#!/usr/bin/env python3
"""Lightweight checks for the static snorkeling demo (stdlib only)."""
from pathlib import Path
from html.parser import HTMLParser
import json

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text()
css = (ROOT / "assets/styles.css").read_text()
js = (ROOT / "assets/app.js").read_text()
conf = json.loads((ROOT / "vercel.json").read_text())

class Tags(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.ids = set()
        self.local = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        self.tags.append(tag)
        if "id" in d:
            assert d["id"] not in self.ids, f"Duplicate id: {d['id']}"
            self.ids.add(d["id"])
        for prop in ("src", "href"):
            x = d.get(prop, "")
            if x.startswith("./"):
                self.local.append(x)

p = Tags()
p.feed(html)
assert "h1" in p.tags
assert "form" in p.tags
assert "noindex,nofollow,noarchive" in html
assert "Disallow: /" in (ROOT / "robots.txt").read_text()
assert any(h.get("headers") for h in conf["headers"])
assert "WA_NUMBER=''" in js
assert "requestForm" in p.ids
assert "addEventListener" in js
assert css.strip()
for x in p.local:
    assert (ROOT / x).is_file(), f"Missing file: {x}"
print("OK: static site structure, assets, indexing guards, and demo contact")
