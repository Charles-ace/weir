import urllib.request
import urllib.error
import json
import sys

candidates = ['weir', 'sluice', 'spigot', 'grist', 'collet']

print("====================================================")
print("  5-STEP PRIOR ART CHECK (NPM & CRATES.IO)")
print("====================================================\n")

for c in candidates:
    # 1. NPM
    npm_status = "UNKNOWN"
    try:
        url = f"https://registry.npmjs.org/{c}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            desc = data.get("description", "No description")
            npm_status = f"EXISTS ({desc[:50]}...)"
    except urllib.error.HTTPError as e:
        if e.code == 404:
            npm_status = "CLEAN (404 Not Found)"
        else:
            npm_status = f"HTTP {e.code}"
    except Exception as e:
        npm_status = f"ERROR: {e}"

    # 2. Crates.io
    crates_status = "UNKNOWN"
    try:
        url = f"https://crates.io/api/v1/crates/{c}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            desc = data.get("crate", {}).get("description", "No description")
            crates_status = f"EXISTS ({desc[:50]}...)"
    except urllib.error.HTTPError as e:
        if e.code == 404:
            crates_status = "CLEAN (404 Not Found)"
        else:
            crates_status = f"HTTP {e.code}"
    except Exception as e:
        crates_status = f"ERROR: {e}"

    # 3. DefiLlama
    llama_status = "UNKNOWN"
    try:
        url = "https://api.llama.fi/protocols"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            protocols = json.loads(resp.read().decode("utf-8"))
            matches = [p["name"] for p in protocols if c in p["name"].lower()]
            if matches:
                llama_status = f"MATCHES: {matches[:3]}"
            else:
                llama_status = "CLEAN (0 protocols)"
    except Exception as e:
        llama_status = f"ERROR: {e}"

    print(f"[{c.upper()}]")
    print(f"  npm:       {npm_status}")
    print(f"  crates.io: {crates_status}")
    print(f"  DefiLlama: {llama_status}")
    print("----------------------------------------------------")
