// Validates generated, server-visible multilingual pages before indexing.
'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const langs=['it','en','de','fr'];
const root='https://www.snorkelingwatamu.com';
const expected={
 it:'Un mondo',en:'Another',de:'Eine Welt',fr:'Un monde'
};
for(const lang of langs){
 const p='dist/'+lang+'/index.html';
 const src=fs.readFileSync(p,'utf8');
 assert(src.includes('<html lang="'+lang+'">'),p+' wrong HTML language');
 assert(src.includes('<link rel="canonical" href="'+root+'/'+lang+'/">'),p+' canonical missing');
 for(const alternate of [...langs,'x-default']){
  const target=alternate==='x-default'?root+'/':root+'/'+alternate+'/';
  assert(src.includes('rel="alternate" hreflang="'+alternate+'" href="'+target+'"'),p+' missing alternate '+alternate);
 }
 assert(src.includes(expected[lang]),p+' main copy not localised');
 assert(!src.includes('src="./assets/'),p+' relative assets broken');
 assert(!src.includes('href="./assets/'),p+' relative assets broken');
 assert(src.includes('src="/assets/images/glass-boat-watamu-subira-sandbar-tour.jpg"'),p+' glass-boat image missing');
 assert(src.includes('data-i18n="faq1Q"'),p+' FAQ missing');
 assert(src.includes('name="robots" content="noindex,nofollow,noarchive"'),p+' premature indexing');
 assert(!src.includes('src="https://www.googletagmanager.com/'),p+' GA4 must be configured only after ECM');
 assert(src.includes('src="/assets/ecm-bootstrap.js"'),p+' missing ECM bootstrap');
 assert(src.includes('siteId: "c64f3c2a-13ae-4ec1-8362-8bc54a7538e4"'),p+' wrong ECM site ID');
 assert(src.includes('href="https://wa.me/254741457022"'),p+' missing direct WhatsApp CTA');
 assert(src.includes('href="tel:+254741457022"'),p+' missing click-to-call number');
 const labels={it:'Invia messaggio WhatsApp',en:'Send a WhatsApp message',de:'WhatsApp-Nachricht senden',fr:'Envoyer un message WhatsApp'};
 assert(src.includes(labels[lang]),p+' WhatsApp button label untranslated');
}
const template=fs.readFileSync('dist/index.html','utf8');
assert(template.includes('rel="canonical" href="'+root+'/it/"'), 'root canonical missing');
assert(fs.readFileSync('dist/robots.txt','utf8').includes('Disallow: /'), 'robots must remain blocked before launch');
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
for(const lang of langs)assert(sitemap.includes('<loc>'+root+'/'+lang+'/</loc>'),'missing sitemap '+lang);
assert(fs.statSync('dist/assets/images/glass-boat-watamu-subira-sandbar-tour.jpg').size>10000,'missing actual boat photo');
console.log('OK: canonical, alternate hreflang, translated HTML, assets, sitemap and noindex for all 4 locales.');
