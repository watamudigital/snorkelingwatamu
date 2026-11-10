#!/usr/bin/env python3
"""Static checks for the Snorkeling Watamu pre-launch release (stdlib only)."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "assets/styles.css").read_text(encoding="utf-8")
js = (ROOT / "assets/app.js").read_text(encoding="utf-8")
robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
conf = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))

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
            assert d["id"] not in self.ids, "Duplicate id: " + d["id"]
            self.ids.add(d["id"])
        for prop in ("src", "href", "poster", "data-video-src"):
            value = d.get(prop, "")
            if value.startswith("./assets/"):
                self.local.append(urlsplit(value).path)

p = Tags()
p.feed(html)
assert "h1" in p.tags and "form" in p.tags
assert "customTripForm" in p.ids
assert 'content="index,follow,max-image-preview:large"' in html
assert "noindex" not in html.lower(), "A page still contains an indexing block"
assert "Disallow: /" not in robots
assert "Allow: /" in robots
assert "Sitemap: https://www.snorkelingwatamu.com/sitemap.xml" in robots
assert all(h.get("key", "").lower() != "x-robots-tag" for rule in conf["headers"] for h in rule["headers"])
assert conf["buildCommand"] == "node scripts/build-locales.cjs" and conf["outputDirectory"] == "dist"
assert "https://wa.me/254741457022?text=" in (ROOT / "assets/journey-builder.js").read_text(encoding="utf-8")
assert "https://wa.me/254741457022" in html
assert "tel:+254741457022" in html
assert "https://wa.me/41775129241" in html
assert css.strip()
for x in p.local:
    generated = x == "./assets/images/IMG_0256.jpeg" and (ROOT / "IMG_0256.jpeg").is_file()
    assert (ROOT / x).is_file() or generated, "Missing local asset: " + x
print("OK: site structure, local assets, contacts and SEO release guards")
