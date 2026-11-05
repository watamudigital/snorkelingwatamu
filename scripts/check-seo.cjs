// Validates generated, server-visible multilingual pages before indexing.
'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const langs=['it','en','de','fr'];
const root='https://www.snorkelingwatamu.com';
const expected={
 it:'Un mondo',en:'A world',de:'Eine Welt',fr:'Un monde'
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
 assert(src.includes('id="meet-juma"'),p+' Juma story section missing');
 assert(src.includes('data-video-src="/assets/videos/juma-ocean-latest.mp4"'),p+' Juma story video configuration missing');
 assert(src.includes('src="/assets/juma-video.js"'),p+' Juma video bootstrap missing');
 assert(src.includes('class="juma-story-fallback"'),p+' Juma video image fallback missing');
 assert(src.includes('id="experienceCarousel"'),p+' experience carousel missing');
 const cardKeys=['data-exp="Blue Safari"','data-exp="Deep-Sea Fishing"','data-exp="Watersports"'];
 const cardPositions=cardKeys.map(key=>src.indexOf(key));
 assert(cardPositions.every((pos,i)=>pos>=0&&(i===0||pos>cardPositions[i-1])),p+' wrong experience order');
 assert(src.includes('value="Watersports"'),p+' Watersports enquiry option missing');
 assert(src.includes('src="/assets/images/IMG_0034.jpeg"'),p+' first Watersports photo missing');
 assert(src.includes('src="/assets/Vier Fahrer auf dem gelben Rocket.png"'),p+' second Watersports Rocket photo missing');
 assert(!src.includes('Your Blue Safari'),p+' old private safari offer remains');
 const sportTitles={it:'Watersports',en:'Watersports',de:'Watersports',fr:'Watersports'};
 assert(src.includes(sportTitles[lang]),p+' missing translated Watersports title');
 const fishingTitles={it:'Pesca d&#39;altura',en:'Deep-Sea Fishing',de:'Hochseefischen',fr:'Pêche au large'};
 const snorkelingTags={it:'Snorkeling incluso',en:'Snorkeling included',de:'Schnorcheln inklusive',fr:'Snorkeling inclus'};
 assert(src.includes(fishingTitles[lang]),p+' missing localized deep-sea fishing title');
 assert(src.includes(snorkelingTags[lang]),p+' snorkeling must be included in glass-boat tour');
 assert(!src.includes('Coral Garden Explorer'),p+' old standalone snorkeling activity still visible');
 assert(src.includes('value="Deep-Sea Fishing"'),p+' missing fishing option in enquiry form');
 assert(src.includes('src="/assets/images/Juma mit Fischen auf sonniger See.png"'),p+' missing authentic Juma fishing photo');
 assert(src.includes('src="/assets/images/IMG_0053.jpeg"'),p+' latest uploaded fishing photo missing');
 assert(!src.includes('photo-1771056511594') && !src.includes('photo-1636612287192'),p+' illustrative fishing photos must be removed');
 assert(src.includes('src="/assets/videos/fishing-latest.mp4?v=1a1ba108"'),p+' fishing gallery MP4 missing');
 const fishingVideoLabels={it:'Video dell&#39;escursione di pesca d&#39;altura',en:'Deep-sea fishing excursion video',de:'Video vom Hochseeangel-Ausflug',fr:'Vidéo de la sortie de pêche au large'};
 const fishingVideoTag=src.match(/<video class="photo-slide fishing-gallery-video"[^>]*>/)?.[0];
 assert(fishingVideoTag?.includes('aria-label="'+fishingVideoLabels[lang]+'"'),p+' fishing video accessibility label missing');
 assert((src.match(/<video class="photo-slide /g)||[]).length===1,p+' expected exactly one fishing video slide');
 assert((src.match(/<img class="photo-slide(?: |")/g)||[]).length===8,p+' expected two fishing and three photos in other galleries');
 assert(src.includes('src="/assets/images/watamu-snorkeling-boat-trip-guests.jpg"'),p+' missing guest photo in carousel');
 assert(src.includes('src="/assets/experience-carousel.js"'),p+' missing carousel script');
 const jumaHead={it:'con Juma.',en:'with Juma.',de:'mit Juma.',fr:'avec Juma.'};
 assert(src.includes(jumaHead[lang]),p+' missing translated Juma headline');
 assert(!src.includes('opérateur local') && !src.includes('operatore locale') && !src.includes('lokalen Anbieter') && !src.includes('local operator'),p+' obsolete operator phrasing');
 assert(src.includes('name="robots" content="noindex,nofollow,noarchive"'),p+' premature indexing');
 assert(!src.includes('src="https://www.googletagmanager.com/'),p+' GA4 must be configured only after ECM');
 assert(src.includes('src="/assets/ecm-bootstrap.js"'),p+' missing ECM bootstrap');
 assert(src.includes('siteId: "c64f3c2a-13ae-4ec1-8362-8bc54a7538e4"'),p+' wrong ECM site ID');
 assert(src.includes('href="https://wa.me/254741457022"'),p+' missing direct WhatsApp CTA');
 assert(src.includes('href="tel:+254741457022"'),p+' missing click-to-call number');
 assert(src.includes('href="https://wa.me/41775129241"'),p+' missing secondary WhatsApp CTA');
 assert(src.includes('href="tel:+41775129241"'),p+' missing secondary click-to-call number');
 const swissLabels={it:'Invia messaggio WhatsApp (+41)',en:'Send a WhatsApp message (+41)',de:'WhatsApp-Nachricht senden (+41)',fr:'Envoyer un message WhatsApp (+41)'};
 assert(src.includes(swissLabels[lang]),p+' secondary WhatsApp button label untranslated');
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
