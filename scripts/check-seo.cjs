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
 assert((src.match(/data-i18n-aria-label="galleryOpenAria"/g)||[]).length===3,p+' every photo gallery must open by clicking the photo');
 assert(src.includes('data-i18n-aria-label="creekOpenAria"'),p+' Mida Creek illustration must be clickable');
 assert(!src.includes('class="photo-arrow')&&!src.includes('class="photo-dot'),p+' navigation cursors and dots must be absent');
 assert(!src.includes('data-photo-index=')&&!src.includes('data-photo-dir='),p+' old gallery navigators must be removed');
 const cardKeys=['data-exp="Blue Safari"','data-exp="Deep-Sea Fishing"','data-exp="Watersports"','data-exp="Mida Creek Sunset Cruise"'];
 const cardPositions=cardKeys.map(key=>src.indexOf(key));
 assert(cardPositions.every((pos,i)=>pos>=0&&(i===0||pos>cardPositions[i-1])),p+' wrong experience order');
 assert(src.includes('value="Watersports"'),p+' Watersports enquiry option missing');
 assert(src.includes('<option value="Mida Creek Sunset Cruise" data-i18n="creekTitle">'),p+' Mida Creek sunset enquiry choice missing');
 const creekCard=src.match(/<article class="experience experience-creek"[\s\S]*?<\/article>/)?.[0];
 assert(creekCard,p+' Mida Creek sunset card missing');
 assert(creekCard.includes('data-i18n="creekDesc"')&&creekCard.includes('data-i18n="creekTitle"'),p+' sunset card text missing');
 assert(creekCard.includes('data-exp="Mida Creek Sunset Cruise"'),p+' sunset card selection missing');
 const sunsetNames={
  it:'Tramonto in barca a Mida Creek',
  en:'Sunset boat trip at Mida Creek',
  de:'Bootsfahrt bei Sonnenuntergang am Mida Creek',
  fr:'Balade en bateau au coucher du soleil à Mida Creek'
 };
 assert(src.includes(sunsetNames[lang]),p+' translated Mida Creek heading missing');

 assert(src.includes('src="/assets/images/IMG_0034.jpeg"'),p+' first Watersports photo missing');
 assert(src.includes('src="/assets/Vier Fahrer auf dem gelben Rocket.png"'),p+' second Watersports Rocket photo missing');
 const sportsCard=[...src.matchAll(/<article class="experience"[\s\S]*?<\/article>/g)].map(m=>m[0]).find(card=>card.includes('data-exp="Watersports"'));
 assert(sportsCard,p+' Watersports gallery missing');
 assert((sportsCard.match(/<img class="photo-slide(?: |")/g)||[]).length===3,p+' Watersports should retain all three photos');
 assert((sportsCard.match(/<video class="photo-slide /g)||[]).length===1,p+' Watersports MP4 missing');
 assert(!sportsCard.includes('data-photo-index='),p+' Watersports on-card dots should be removed');
 assert(sportsCard.includes('src="/assets/videos/watersports-latest.mp4"'),p+' latest Watersports video source missing');
 assert(sportsCard.includes('poster="/assets/images/watersports-video-poster.jpg"'),p+' latest Watersports video preview missing');
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
 assert(src.includes('src="/assets/images/IMG_0065.jpeg"')&&src.includes('src="/assets/images/IMG_0066.jpeg"'),p+' missing snorkeling photos in Blue Safari');
 for(const name of ['blue-safari-newest.mp4','blue-safari-second-newest.mp4','blue-safari-dolphins.mp4']){
  assert(src.includes('src="/assets/videos/'+name+'"'),p+' missing Blue Safari MP4 '+name);
 }
 const blueCard=[...src.matchAll(/<article class="experience"[\s\S]*?<\/article>/g)].map(m=>m[0]).find(c=>c.includes('data-exp="Blue Safari"'));
 assert(blueCard,p+' Blue Safari card not found');
 assert((blueCard.match(/<img class="photo-slide(?: |")/g)||[]).length===3,p+' expected three Blue Safari photos');
 assert((blueCard.match(/<video class="photo-slide /g)||[]).length===3,p+' expected three Blue Safari videos');
 assert(!blueCard.includes('data-photo-index='),p+' Blue Safari on-card dots should be removed');
 const orderedBlueMedia=[...blueCard.matchAll(/<(?:img|video) class="photo-slide[^>]*src="([^"]+)"/g)].map(m=>m[1]);
 assert(orderedBlueMedia.join('|')===[
  '/assets/images/watamu-glass-bottom-boat-subira-kenya.jpg',
  '/assets/images/IMG_0066.jpeg',
  '/assets/images/IMG_0065.jpeg',
  '/assets/videos/blue-safari-newest.mp4',
  '/assets/videos/blue-safari-second-newest.mp4',
  '/assets/videos/blue-safari-dolphins.mp4'
 ].join('|'),p+' Blue Safari slide order should be Subira, group, snorkeling, food, boats and dolphins videos');
 assert(blueCard.includes('poster="/assets/images/blue-safari-food-video-poster.jpg"'),p+' food video should have its own video-frame preview');
 assert(blueCard.includes('poster="/assets/images/blue-safari-snorkeling-video-poster.jpg"'),p+' snorkeling video should have its own video-frame preview');
 assert(blueCard.includes('poster="/assets/images/blue-safari-dolphins-video-poster.jpg"'),p+' dolphin video should have its own video-frame preview');
 assert(!blueCard.includes('IMG_0053.jpeg')&&!blueCard.includes('fishing-portrait.mp4'),p+' fishing media must not appear in Blue Safari');
 assert(!blueCard.includes('glass-boat-watamu-subira-sandbar-tour.jpg')&&!blueCard.includes('glass-boat-subira-snorkeling-watamu-passengers.jpg'),p+' extra Subira photos must not appear in Blue Safari');
 assert(!src.includes('photo-1771056511594') && !src.includes('photo-1636612287192'),p+' illustrative fishing photos must be removed');
 assert(src.includes('src="/assets/videos/fishing-portrait.mp4"'),p+' fishing gallery MP4 missing');
 const fishingVideoLabels={it:'Video dell&#39;escursione di pesca d&#39;altura',en:'Deep-sea fishing excursion video',de:'Video vom Hochseeangel-Ausflug',fr:'Vidéo de la sortie de pêche au large'};
 const fishingVideoTag=src.match(/<video class="photo-slide fishing-gallery-video"[^>]*>/)?.[0];
 assert(fishingVideoTag?.includes('aria-label="'+fishingVideoLabels[lang]+'"'),p+' fishing video accessibility label missing');
 assert((src.match(/<video class="photo-slide /g)||[]).length===5,p+' expected one fishing, three Blue Safari and one Watersports video slides');
 assert((src.match(/<img class="photo-slide(?: |")/g)||[]).length===8,p+' expected three Blue Safari, two fishing and three Watersports photos');
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
