const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("WEIR Protocol Test Suite", function () {
  const PRECOMPILE_0FD2 = "0x0000000000000000000000000000000000000FD2";

  let owner, payor, alice, bob, charlie, stranger;
  let mockUSDC, weirVault;
  let mockVerifier, mockDecoder, weirASC;

  const ASSET_ID = 1;
  const TOTAL_SHARES = 10000n;
  const EXPECTED_COVENANT = 10000n * 10n ** 6n; // 10,000 mUSDC (6 decimals)

  beforeEach(async function () {
    [owner, payor, alice, bob, charlie, stranger] = await ethers.getSigners();

    // 1. Deploy Sepolia contracts
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();

    const WeirVault = await ethers.getContractFactory("WeirVault");
    weirVault = await WeirVault.deploy();
    await weirVault.waitForDeployment();

    // Register Asset on Sepolia Vault
    await weirVault.registerAsset(
      ASSET_ID,
      "Sahara Solar Array #4",
      owner.address,
      await mockUSDC.getAddress(),
      EXPECTED_COVENANT
    );

    // 2. Set up Creditcoin CC3 Mock Precompile at 0x0FD2
    const MockVerifier = await ethers.getContractFactory("MockNativeQueryVerifier");
    mockVerifier = await MockVerifier.deploy();
    await mockVerifier.waitForDeployment();

    const verifierBytecode = await network.provider.send("eth_getCode", [
      await mockVerifier.getAddress(),
    ]);
    await network.provider.send("hardhat_setCode", [
      PRECOMPILE_0FD2,
      verifierBytecode,
    ]);

    // 3. Deploy Mock EvmV1Decoder
    const MockDecoder = await ethers.getContractFactory("MockEvmV1Decoder");
    mockDecoder = await MockDecoder.deploy();
    await mockDecoder.waitForDeployment();

    // 4. Deploy WeirDistributionASC on Creditcoin
    const WeirDistributionASC = await ethers.getContractFactory("WeirDistributionASC");
    weirASC = await WeirDistributionASC.deploy(await mockDecoder.getAddress());
    await weirASC.waitForDeployment();

    // Register Cap Table on Creditcoin ASC (Alice 50%, Bob 30%, Charlie 20%)
    await weirASC.registerAssetWithCapTable(
      ASSET_ID,
      "Sahara Solar Array #4",
      TOTAL_SHARES,
      EXPECTED_COVENANT,
      alice.address,
      bob.address,
      charlie.address
    );
  });

  describe("1. Ethereum Sepolia Inbound Vault (WeirVault)", function () {
    it("mUSDC faucet should mint tokens accurately up to the cap", async function () {
      const amount = 10000n * 10n ** 6n;
      await mockUSDC.faucet(payor.address, amount);
      expect(await mockUSDC.balanceOf(payor.address)).to.equal(amount);
    });

    it("should accept commercial revenue and emit RevenueDeposited event", async function () {
      const amount = 10000n * 10n ** 6n;
      await mockUSDC.faucet(payor.address, amount);
      await mockUSDC.connect(payor).approve(await weirVault.getAddress(), amount);

      await expect(weirVault.connect(payor).depositRevenue(ASSET_ID, amount))
        .to.emit(weirVault, "RevenueDeposited")
        .withArgs(ASSET_ID, amount, 1, payor.address);

      expect(await mockUSDC.balanceOf(await weirVault.getAddress())).to.equal(amount);

      const asset = await weirVault.getAsset(ASSET_ID);
      expect(asset.currentPeriod).to.equal(1);
      expect(asset.totalRevenueCollected).to.equal(amount);
    });
  });

  describe("2. Creditcoin CC3 Distribution ASC (O(1) Dividend Index)", function () {
    function prepareMockReceipt(assetId, grossAmount, period, payorAddr, status = 1) {
      const eventSig = ethers.id("RevenueDeposited(uint256,uint256,uint256,address)");
      const topics = [
        eventSig,
        ethers.zeroPadValue(ethers.toBeHex(assetId), 32),
      ];
      const data = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256", "address"],
        [grossAmount, period, payorAddr]
      );
      return { eventSig, topics, data, status };
    }

    const dummyMerkleProof = { root: ethers.ZeroHash, siblings: [] };
    const dummyContinuityProof = { lowerEndpointDigest: ethers.ZeroHash, roots: [] };

    it("should correctly initialize 50% / 30% / 20% cap table", async function () {
      const [investors, shares, total] = await weirASC.getCapTable(ASSET_ID);
      expect(investors[0]).to.equal(alice.address);
      expect(investors[1]).to.equal(bob.address);
      expect(investors[2]).to.equal(charlie.address);

      expect(shares[0]).to.equal(5000n); // 50%
      expect(shares[1]).to.equal(3000n); // 30%
      expect(shares[2]).to.equal(2000n); // 20%
      expect(total).to.equal(TOTAL_SHARES);
    });

    it("should process verified Ethereum revenue and update O(1) dividend index", async function () {
      const grossAmount = 10000n * 10n ** 6n; // $10,000
      const { topics, data } = prepareMockReceipt(ASSET_ID, grossAmount, 1, payor.address);
      await mockDecoder.setMockLog(await weirVault.getAddress(), topics, data);

      await expect(
        weirASC.verifyAndDistribute(
          1, // Sepolia chainKey
          11685000,
          "0x1234",
          dummyMerkleProof.root,
          dummyMerkleProof.siblings,
          dummyContinuityProof.lowerEndpointDigest,
          dummyContinuityProof.roots
        )
      ).to.emit(weirASC, "DividendsCalculated");

      // Verify claimable balances
      const aliceClaimable = await weirASC.getClaimableDividend(ASSET_ID, alice.address);
      const bobClaimable = await weirASC.getClaimableDividend(ASSET_ID, bob.address);
      const charlieClaimable = await weirASC.getClaimableDividend(ASSET_ID, charlie.address);

      expect(aliceClaimable).to.equal(5000n * 10n ** 6n); // $5,000 (50%)
      expect(bobClaimable).to.equal(3000n * 10n ** 6n); // $3,000 (30%)
      expect(charlieClaimable).to.equal(2000n * 10n ** 6n); // $2,000 (20%)
    });

    it("should allow investor pull-claims and prevent double claiming", async function () {
      const grossAmount = 10000n * 10n ** 6n;
      const { topics, data } = prepareMockReceipt(ASSET_ID, grossAmount, 1, payor.address);
      await mockDecoder.setMockLog(await weirVault.getAddress(), topics, data);

      await weirASC.verifyAndDistribute(
        1,
        11685000,
        "0x1234",
        dummyMerkleProof.root,
        dummyMerkleProof.siblings,
        dummyContinuityProof.lowerEndpointDigest,
        dummyContinuityProof.roots
      );

      // Alice claims her $5,000
      await expect(weirASC.connect(alice).claimDividend(ASSET_ID))
        .to.emit(weirASC, "DividendClaimed")
        .withArgs(ASSET_ID, alice.address, 5000n * 10n ** 6n);

      // Alice balance should now be 0
      expect(await weirASC.getClaimableDividend(ASSET_ID, alice.address)).to.equal(0n);

      // Second claim should revert
      await expect(weirASC.connect(alice).claimDividend(ASSET_ID)).to.be.revertedWith(
        "No new dividends to claim"
      );
    });

    it("should emit RevenueShortfall event when gross deposit is under covenant", async function () {
      const shortfallAmount = 6000n * 10n ** 6n; // $6,000 vs $10,000 target
      const { topics, data } = prepareMockReceipt(ASSET_ID, shortfallAmount, 1, payor.address);
      await mockDecoder.setMockLog(await weirVault.getAddress(), topics, data);

      await expect(
        weirASC.verifyAndDistribute(
          1,
          11685000,
          "0x1234",
          dummyMerkleProof.root,
          dummyMerkleProof.siblings,
          dummyContinuityProof.lowerEndpointDigest,
          dummyContinuityProof.roots
        )
      )
        .to.emit(weirASC, "RevenueShortfall")
        .withArgs(ASSET_ID, EXPECTED_COVENANT, shortfallAmount, 1);

      // Pro-rata distribution on actual received:
      // Alice (50% of 6000) = $3,000
      // Bob (30% of 6000) = $1,800
      // Charlie (20% of 6000) = $1,200
      expect(await weirASC.getClaimableDividend(ASSET_ID, alice.address)).to.equal(3000n * 10n ** 6n);
      expect(await weirASC.getClaimableDividend(ASSET_ID, bob.address)).to.equal(1800n * 10n ** 6n);
      expect(await weirASC.getClaimableDividend(ASSET_ID, charlie.address)).to.equal(1200n * 10n ** 6n);
    });

    it("should enforce replay protection and revert on duplicate verification", async function () {
      const grossAmount = 10000n * 10n ** 6n;
      const { topics, data } = prepareMockReceipt(ASSET_ID, grossAmount, 1, payor.address);
      await mockDecoder.setMockLog(await weirVault.getAddress(), topics, data);

      // First verification succeeds
      await weirASC.verifyAndDistribute(
        1,
        11685000,
        "0x1234",
        dummyMerkleProof.root,
        dummyMerkleProof.siblings,
        dummyContinuityProof.lowerEndpointDigest,
        dummyContinuityProof.roots
      );

      // Duplicate verification with same block and sibling path reverts
      await expect(
        weirASC.verifyAndDistribute(
          1,
          11685000,
          "0x1234",
          dummyMerkleProof.root,
          dummyMerkleProof.siblings,
          dummyContinuityProof.lowerEndpointDigest,
          dummyContinuityProof.roots
        )
      ).to.be.revertedWith("Query already processed (Replay protection)");
    });

    it("should revert if source transaction receipt status is not 1 (success)", async function () {
      const grossAmount = 10000n * 10n ** 6n;
      const { topics, data } = prepareMockReceipt(ASSET_ID, grossAmount, 1, payor.address, 0);
      await mockDecoder.setMockStatus(0); // Failed tx
      await mockDecoder.setMockLog(await weirVault.getAddress(), topics, data);

      await expect(
        weirASC.verifyAndDistribute(
          1,
          11685001,
          "0x1234",
          dummyMerkleProof.root,
          dummyMerkleProof.siblings,
          dummyContinuityProof.lowerEndpointDigest,
          dummyContinuityProof.roots
        )
      ).to.be.revertedWith("Source transaction did not succeed (status != 1)");
    });

    it("should reject claim attempts from unauthorized strangers", async function () {
      await expect(weirASC.connect(stranger).claimDividend(ASSET_ID)).to.be.revertedWith(
        "No shares owned in this asset"
      );
    });
  });
});
