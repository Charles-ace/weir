import urllib.request
import urllib.error
import json
import time

candidates = ['weir', 'sluice', 'spigot', 'grist', 'collet']

print("====================================================")
print("  STEP 1 (GITHUB) & STEP 3 (COINGECKO / COINMARKETCAP)")
print("====================================================\n")

for c in candidates:
    # GitHub Check
    gh_status = "UNKNOWN"
    try:
        url = f"https://api.github.com/search/repositories?q={c}+blockchain+OR+{c}+crypto+OR+{c}+rwa&sort=stars&order=desc"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/vnd.github.v3+json"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("items", [])
            relevant = [f"{it['full_name']} ({it['stargazers_count']} stars)" for it in items[:3]]
            gh_status = f"Top repos: {relevant}" if relevant else "CLEAN (0 matching repos)"
    except Exception as e:
        gh_status = f"ERROR/RATE-LIMIT: {e}"

    # CoinGecko Check
    cg_status = "UNKNOWN"
    try:
        url = f"https://api.coingecko.com/api/v3/search?query={c}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            coins = [f"{coin['name']} (${coin['symbol']})" for coin in data.get("coins", [])[:3]]
            cg_status = f"Coins: {coins}" if coins else "CLEAN (0 matching coins)"
    except Exception as e:
        cg_status = f"ERROR/RATE-LIMIT: {e}"

    print(f"[{c.upper()}]")
    print(f"  GitHub:    {gh_status}")
    print(f"  CoinGecko: {cg_status}")
    print("----------------------------------------------------")
    time.sleep(1)
