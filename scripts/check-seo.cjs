// Check generated public-facing HTML, SEO metadata and sitemap before release.
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const langs=['it','en','de','fr'];
const origin='https://www.snorkelingwatamu.com';
const imageUrl=origin+'/assets/images/watamu-glass-bottom-boat-subira-kenya.jpg';
const titles=new Set();
const metas=new Set();
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.deepEqual(urls,langs.map(code=>origin+'/'+code+'/'),'Sitemap should list exactly four canonicals');
for(const lang of langs){
 const p='dist/'+lang+'/index.html';
 const src=fs.readFileSync(p,'utf8');
 const page=origin+'/'+lang+'/';
 assert(src.includes('<html lang="'+lang+'">'),p+' wrong language');
 assert(src.includes('content="index,follow,max-image-preview:large"'),p+' missing indexable robots');
 assert(!/content="[^"]*noindex/i.test(src),p+' HTML still noindexed');
 assert(src.includes('<link rel="canonical" href="'+page+'">'),p+' canonical wrong');
 for(const hreflang of [...langs,'x-default']){
  const url=hreflang==='x-default'?origin+'/':origin+'/'+hreflang+'/';
  assert(src.includes('rel="alternate" hreflang="'+hreflang+'" href="'+url+'"'),p+' missing hreflang '+hreflang);
 }
 const title=src.match(/<title>([^<]+)<\/title>/)?.[1];
 const meta=src.match(/<meta name="description" content="([^"]+)">/)?.[1];
 assert(title&&title.length>20,p+' title missing');
 assert(meta&&meta.length>70,p+' description missing');
 assert(!/(demo|dimostrativo|démonstration|preview)/i.test(meta),p+' demo in description');
 titles.add(title);metas.add(meta);
 for(const [property,value] of [['og:type','website'],['og:url',page],['og:title',title],['og:description',meta],['og:image',imageUrl]]){
  assert(src.includes('<meta property="'+property+'" content="'+value+'">'),p+' missing Open Graph '+property);
 }
 assert(src.includes('<meta name="twitter:card" content="summary_large_image">'),p+' missing social card');
 const ld=src.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
 assert(ld,p+' structured data missing');
 const data=JSON.parse(ld);
 assert(data['@graph'].some(x=>x['@type']==='WebPage'&&x.url===page&&x.inLanguage===lang),p+' invalid WebPage JSON-LD');
 assert(src.includes('id="customTripForm"')&&src.includes('id="experienceCarousel"'),p+' commercial content missing');
 assert(src.includes('href="https://wa.me/254741457022"'),p+' primary WhatsApp missing');
 assert(src.includes('href="https://wa.me/41775129241"'),p+' secondary WhatsApp missing');
 assert(!/(SITO DIMOSTRATIVO|DEMO WEBSITE|DEMO-WEBSITE|SITE DE DÉMONSTRATION|Concept preview)/i.test(src),p+' demo text found in visible content');
 assert(!src.includes('src="./assets/'),p+' relative asset URL');
 assert(!src.includes('href="./assets/'),p+' relative stylesheet/script');
 const assets=[...src.matchAll(/(?:src|href|poster|data-video-src)="(\/assets\/[^"?#]+)/g)].map(m=>m[1]);
 for(const asset of new Set(assets)){
  assert(fs.existsSync(path.join('dist',decodeURIComponent(asset))),p+' missing asset: '+asset);
 }
}
assert(titles.size===4,'Localized SEO titles must be distinct');
assert(metas.size===4,'Localized SEO descriptions must be distinct');
const root=fs.readFileSync('dist/index.html','utf8');
assert(root.includes('rel="canonical" href="'+origin+'/it/"'),'Root should point to Italian canonical');
const robots=fs.readFileSync('dist/robots.txt','utf8');
assert(!robots.includes('Disallow: /'),'Crawl is blocked in robots.txt');
assert(robots.includes('Sitemap: '+origin+'/sitemap.xml'),'Sitemap missing in robots.txt');
const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
assert(config.headers.every(rule=>rule.headers.every(h=>h.key.toLowerCase()!=='x-robots-tag')),'X-Robots-Tag override remains');
console.log('OK: 4 canonical URLs, metadata, hreflang, Open Graph, JSON-LD, sitemap,  assets and crawl policy');
