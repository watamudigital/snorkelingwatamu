// Validate four complete language variants and the current set of experiences.
'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('assets/app.js','utf8');
const translations=fs.readFileSync('assets/translations.js','utf8');
new vm.Script(app);
new vm.Script(translations);
const context={window:{}};
vm.runInNewContext(translations,context,{timeout:2000});
const extras=context.window.SW_TRANSLATIONS;
assert(extras&&typeof extras==='object','Missing SW_TRANSLATIONS');
const match=app.match(/const tr=(\{[\s\S]*?\n \});/);
assert(match,'Base translations missing');
const base=vm.runInNewContext('('+match[1]+')',{}, {timeout:2000});
const keys=[...new Set([...html.matchAll(/data-i18n(?:-placeholder|-alt|-aria-label)?="([^"]+)"/g)].map(m=>m[1]))];
const languages=['it','en','de','fr'];
for(const code of languages){
 const dict={...(base[code]||{}),...(extras[code]||{})};
 for(const key of keys) assert(typeof dict[key]==='string'&&dict[key].trim(),code+': missing translation '+key);
 for(const key of ['pageTitle','metaDescription','demoTag','privateSafariTitle','creekTitle','waterSportsVideoAria','contactCta','contactSwissCta']){
  assert(typeof dict[key]==='string'&&dict[key].trim(),code+': missing release field '+key);
 }
 assert(!/(demo website|demo-website|sito dimostrativo|site de démonstration|preview website)/i.test(dict.metaDescription+' '+dict.demoTag),code+': demo text must not go live');
 assert(html.includes('id="'+code+'"'),'Missing language button '+code);
}
assert(html.indexOf('assets/translations.js')<html.indexOf('assets/app.js'),'Translation scripts out of order');
assert(html.includes('id="experienceCarousel"'),'Experience carousel missing');
assert(html.includes('id="customTripForm"'),'Quote enquiry form missing');
assert((html.match(/<article class="experience\b/g)||[]).length===5,'Expected five current experience cards');
assert((html.match(/data-photo-gallery\b/g)||[]).length===4,'Expected four photo/video galleries');
assert((html.match(/data-i18n-aria-label="galleryOpenAria"/g)||[]).length===4,'Four openable photo galleries expected');
const cardOrder=[...html.matchAll(/data-exp="([^"]+)"/g)].map(m=>m[1]);
assert(cardOrder.join('|')==='Blue Safari|Blue Safari Private|Deep-Sea Fishing|Watersports|Mida Creek Sunset Cruise','Experience order changed');
assert(html.includes('data-private-video-player="dolphins"'),'Private Safari dolphin video missing');
assert(html.includes('data-juma-video'),'Juma story missing');
assert(html.includes('src="/assets/videos/fishing-portrait.mp4"'),'Fishing video missing');
assert(html.includes('src="/assets/videos/mida-creek-sunset-latest.mp4"'),'Mida Creek video missing');
assert(html.includes('src="/assets/videos/blue-safari-dolphins.mp4"'),'Blue Safari dolphin video missing');
assert(html.includes('src="/assets/videos/watersports-latest.mp4"'),'Watersports video missing');
assert(html.includes('data-i18n="creekDesc"'),'Translated Mida Creek story missing');
assert(!html.includes('Concept preview'),'Preview footer must not go live');
const galleryJs=fs.readFileSync('assets/experience-carousel.js','utf8');
const galleryCss=fs.readFileSync('assets/styles.css','utf8');
assert(galleryJs.includes('function addVisibleControls('),'Missing visible on-card navigation');
assert(galleryJs.includes('refreshVisibleCount=addVisibleControls(gallery,media,showSlide)'),'Missing arrows for Watersports and Creek');
assert(galleryJs.includes('refreshVisibleCount=addVisibleControls(gallery,media,showBasicSlide)'),'Missing arrows for Blue Safari and Fishing');
assert(galleryJs.includes("stage.addEventListener('pointerup'"),'Lightbox desktop drag missing');
assert(galleryJs.includes("track.setPointerCapture"),'On-card pointer drag missing');
assert(galleryJs.includes("const privateMedia=region.querySelector('.private-safari-dual-video')"),'Private video switch missing');
assert(galleryCss.includes('.visible-gallery-arrow'),'High contrast on-card arrows CSS missing');
console.log('OK: four language dictionaries, five experiences, media and WhatsApp enquiry');
