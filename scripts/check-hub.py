#!/usr/bin/env python3
"""Validate the AZMX skills hub.

Four things can break this repository without anyone touching it, or with one
careless commit. This script checks all of them and reports every failure, not
just the first:

  1. .claude-plugin/marketplace.json is well-formed and internally consistent.
  2. Each plugin source on GitHub still has .claude-plugin/plugin.json and
     SKILL.md on main, the names agree, and the SKILL.md frontmatter keeps its
     description double-quoted. An unquoted description made the skills CLI
     skip the brand skill on 2026-09-07.
  3. Every http(s) link in README.md and INSTALL.md resolves.
  4. The frozen folders (brand/, colab/, majarah/) match the git tree hashes in
     scripts/frozen-trees.json, and have no uncommitted changes.

Standard library only. Exit status 1 on any failure.

    python3 scripts/check-hub.py            # everything
    python3 scripts/check-hub.py --offline  # skip the network checks (2 and 3)
"""

import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MARKETPLACE = ROOT / ".claude-plugin" / "marketplace.json"
FROZEN = ROOT / "scripts" / "frozen-trees.json"
GUIDES = [ROOT / "README.md", ROOT / "INSTALL.md"]
OWNER = "Gamaleldientarek"
RAW = "https://raw.githubusercontent.com/{repo}/main/{path}"
USER_AGENT = "azmx-hub-check/1.0 (+https://github.com/Gamaleldientarek/azmx)"
TIMEOUT = 25

# Links that cannot resolve until after a change lands on main, so a pull
# request must not fail on them. The workflow badge is the only one today.
LINK_SKIP_PREFIXES = (
    "https://github.com/Gamaleldientarek/azmx/actions/",
)

failures = []


def ok(msg):
    print("ok    " + msg)


def fail(msg):
    print("FAIL  " + msg)
    failures.append(msg)


def get(url, whole_body=False):
    """Return (status, body_or_None). Status is None on a network error."""
    headers = {"User-Agent": USER_AGENT}
    if not whole_body:
        headers["Range"] = "bytes=0-0"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            body = resp.read() if whole_body else None
            return resp.status, body
    except urllib.error.HTTPError as e:
        return e.code, None
    except (urllib.error.URLError, OSError) as e:
        print("      network error for %s: %s" % (url, e))
        return None, None


# 1. Marketplace manifest ---------------------------------------------------

def check_marketplace():
    try:
        m = json.loads(MARKETPLACE.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        fail("marketplace.json unreadable or not JSON: %s" % e)
        return []
    if m.get("name") != "azmx":
        fail("marketplace name is %r, expected 'azmx'" % m.get("name"))
    if not m.get("owner", {}).get("name"):
        fail("marketplace owner.name missing")
    plugins = m.get("plugins") or []
    if not plugins:
        fail("marketplace has no plugins")
    names = [p.get("name") for p in plugins]
    if len(names) != len(set(names)):
        fail("duplicate plugin names: %s" % names)
    for p in plugins:
        name = p.get("name", "<unnamed>")
        for key in ("name", "description", "source", "repository", "homepage",
                    "keywords", "category", "skills"):
            if key not in p:
                fail("%s: missing %r" % (name, key))
        src = p.get("source") or {}
        repo = src.get("repo", "")
        if src.get("source") != "github":
            fail("%s: source.source is %r, expected 'github'" % (name, src.get("source")))
        if not repo.startswith(OWNER + "/"):
            fail("%s: source.repo %r is not under %s/" % (name, repo, OWNER))
        if p.get("repository") != "https://github.com/" + repo:
            fail("%s: repository %r does not match source.repo %r"
                 % (name, p.get("repository"), repo))
        kws = p.get("keywords") or []
        if not kws:
            fail("%s: keywords empty" % name)
        if len(kws) != len(set(kws)):
            fail("%s: duplicate keywords %s" % (name, kws))
        if p.get("skills") != ["./"]:
            fail("%s: skills is %r, expected ['./']" % (name, p.get("skills")))
        if not str(p.get("homepage", "")).startswith("https://"):
            fail("%s: homepage missing or not https" % name)
    if not failures:
        ok("marketplace.json: %d plugins, consistent" % len(plugins))
    return plugins


# 2. Plugin sources on GitHub ----------------------------------------------

def check_sources(plugins):
    for p in plugins:
        name = p["name"]
        repo = p["source"]["repo"]

        url = RAW.format(repo=repo, path=".claude-plugin/plugin.json")
        status, body = get(url, whole_body=True)
        if status != 200:
            fail("%s: plugin.json on main returned %s (%s)" % (name, status, url))
        else:
            try:
                pj = json.loads(body.decode("utf-8"))
            except ValueError as e:
                fail("%s: plugin.json is not JSON: %s" % (name, e))
                pj = {}
            if pj.get("name") != name:
                fail("%s: plugin.json name is %r" % (name, pj.get("name")))
            if not re.fullmatch(r"\d+\.\d+\.\d+", str(pj.get("version", ""))):
                fail("%s: plugin.json version %r is not X.Y.Z" % (name, pj.get("version")))

        url = RAW.format(repo=repo, path="SKILL.md")
        status, body = get(url, whole_body=True)
        if status != 200:
            fail("%s: SKILL.md on main returned %s (%s)" % (name, status, url))
            continue
        text = body.decode("utf-8", errors="replace")
        if not text.startswith("---\n"):
            fail("%s: SKILL.md has no frontmatter" % name)
            continue
        front = text.split("\n---", 1)[0]
        m_name = re.search(r"^name:\s*(.+?)\s*$", front, re.M)
        m_desc = re.search(r"^description:\s*(.+?)\s*$", front, re.M)
        if not m_name or m_name.group(1).strip("\"'") != name:
            fail("%s: SKILL.md frontmatter name is %r"
                 % (name, m_name.group(1) if m_name else None))
        if not m_desc:
            fail("%s: SKILL.md frontmatter has no description" % name)
        elif not (m_desc.group(1).startswith('"') and m_desc.group(1).endswith('"')):
            fail("%s: SKILL.md description is not double-quoted; the skills CLI "
                 "can skip the skill (it did on 2026-09-07)" % name)
        else:
            ok("%s: plugin.json and SKILL.md present on main, names agree" % name)


# 3. Links in the guides ----------------------------------------------------

URL_RE = re.compile(r"https?://[^\s<>()\[\]\"'`]+")


def check_links():
    urls = []
    for guide in GUIDES:
        for u in URL_RE.findall(guide.read_text(encoding="utf-8")):
            u = u.rstrip(".,;:")
            if u not in urls:
                urls.append(u)
    skipped = 0
    bad = 0
    for u in urls:
        if u.startswith(LINK_SKIP_PREFIXES):
            skipped += 1
            continue
        status, _ = get(u)
        if status is None or status >= 400:
            fail("link %s returned %s" % (u, status))
            bad += 1
    if not bad:
        ok("links: %d checked, %d skipped, all resolve" % (len(urls) - skipped, skipped))


# 4. Frozen folders ---------------------------------------------------------

def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True,
                          text=True, check=False)


def check_frozen():
    try:
        expected = json.loads(FROZEN.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        fail("frozen-trees.json unreadable: %s" % e)
        return
    dirs = [d for d in expected if not d.startswith("_")]
    for d in dirs:
        r = git("rev-parse", "HEAD:" + d)
        if r.returncode != 0:
            fail("frozen folder %s/ is missing from HEAD" % d)
            continue
        actual = r.stdout.strip()
        if actual != expected[d]:
            fail("frozen folder %s/ changed: tree %s, expected %s. These folders "
                 "keep published links alive and are never edited."
                 % (d, actual[:12], expected[d][:12]))
    r = git("status", "--porcelain", "--", *dirs)
    if r.stdout.strip():
        fail("uncommitted changes inside frozen folders:\n" + r.stdout.rstrip())
    if not any(f.startswith(("frozen", "uncommitted")) for f in failures):
        ok("frozen folders: %s unchanged" % ", ".join(d + "/" for d in dirs))


def main(argv):
    offline = "--offline" in argv
    plugins = check_marketplace()
    if offline:
        print("skip  network checks (--offline)")
    else:
        check_sources(plugins)
        check_links()
    check_frozen()
    print()
    if failures:
        print("%d failure(s)" % len(failures))
        return 1
    print("all checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
