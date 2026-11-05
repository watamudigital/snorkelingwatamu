// Check complete translations and four-language controls without third-party dependencies.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('assets/app.js','utf8');
const dictionary=fs.readFileSync('assets/translations.js','utf8');
new vm.Script(app);
new vm.Script(dictionary);
const context={window:{}};
vm.runInNewContext(dictionary,context,{timeout:2000});
const extras=context.window.SW_TRANSLATIONS;
assert(extras && typeof extras==='object','Missing SW_TRANSLATIONS');
const match=app.match(/const tr=(\{[\s\S]*?\n \});/);
assert(match,'Base language dictionary missing');
const base=vm.runInNewContext('('+match[1]+')',{}, {timeout:2000});
const required=[...new Set([...html.matchAll(/data-i18n(?:-placeholder|-alt|-aria-label)?="([^"]+)"/g)].map(m=>m[1]))];
const languages=['it','en','de','fr'];
for(const code of languages){
 const dict={...(base[code]||{}),...(extras[code]||{})};
 for(const key of required) assert(typeof dict[key]==='string' && dict[key].trim(),code+': missing translation '+key);
 for(const key of Object.keys(base.en)) assert(typeof dict[key]==='string' && dict[key].trim(),code+': missing base key '+key);
 for(const key of ['pageTitle','metaDescription','dateFallback','msgOpening','msgExperience','msgDate','msgPeople','msgLevel','msgNotes','msgEnding','statusSent','statusCopied','copyPrompt'])
  assert(typeof dict[key]==='string' && dict[key].trim(),code+': missing UX translation '+key);
 assert(html.includes('id="'+code+'"'),'Missing button '+code);
}
assert(html.indexOf('assets/translations.js')<html.indexOf('assets/app.js'),'Scripts loaded in wrong order');
assert(html.includes('noindex,nofollow,noarchive'),'Do not index demo before launch');
assert((html.match(/class="glass-gallery-item/g)||[]).length===4,'Gallery photo count changed');
assert((html.match(/data-photo-gallery/g)||[]).length===3,'Expected three experience photo galleries');
assert((html.match(/<img class="photo-slide(?: |")/g)||[]).length===8,'Expected two fishing photos and three each in other experiences');
assert((html.match(/<video class="photo-slide /g)||[]).length===1,'Expected one video in fishing gallery');
assert(html.includes('src="/assets/videos/fishing-portrait.mp4"'),'Latest fishing video missing from gallery');
assert(html.includes('data-i18n-aria-label="fishingVideoAria"'),'Fishing video needs localized aria label');
assert(html.includes('id="experienceCarousel"'),'Missing experience carousel');
assert(html.includes('data-juma-video'),'Juma story video player missing');
assert(html.includes('data-video-src="/assets/videos/juma-ocean-latest.mp4"'),'Juma video target missing');
assert(html.includes('class="juma-story-fallback"'),'Missing image fallback while video is unavailable');
assert(html.includes('data-i18n-aria-label="jumaVideoAria"'),'Missing translated video accessibility label');
const experienceOrder=[...html.matchAll(/data-exp="([^"]+)"/g)].map(m=>m[1]);
assert(experienceOrder.join('|')==='Blue Safari|Deep-Sea Fishing|Watersports','Experience cards must be Blue Safari, fishing, Watersports');
assert(html.includes('value="Watersports"'),'Missing Watersports enquiry option');
assert(!html.includes('Your Blue Safari'),'Old private safari offer must not remain');
assert(html.includes('data-i18n-aria-label="chooseWatersports"'),'Watersports button needs translated label');
for(const key of ['altWaterSport1','altWaterSport2','altWaterSport3']){
 assert(html.includes('data-i18n-alt="'+key+'"'),'Missing Watersports gallery photo '+key);
}
for(const code of languages){
 const dict={...(base[code]||{}),...(extras[code]||{})};
 for(const key of ['card3Tag','card3Title','card3Text','altWaterSport1','altWaterSport2','altWaterSport3','chooseWatersports']){
  assert(typeof dict[key]==='string' && dict[key].trim(),code+': missing Watersports translation '+key);
 }
}
assert(!html.includes('Coral Garden Explorer'),'Removed snorkeling-only offer must not appear');
assert(html.includes('src="./assets/images/IMG_0053.jpeg"'),'Latest fishing photo missing');
assert(!html.includes('data-i18n-alt="altFishing2"') && !html.includes('data-i18n-alt="altFishing3"'),'Illustrative fishing photos must be removed');
const fishingCard=[...html.matchAll(/<article class="experience"[\s\S]*?<\/article>/g)].map(m=>m[0]).find(c=>c.includes('data-exp="Deep-Sea Fishing"'));
assert(fishingCard,'Fishing gallery missing');
assert((fishingCard.match(/<img class="photo-slide(?: |")/g)||[]).length===2,'Fishing must show exactly two photos');
assert((fishingCard.match(/<video class="photo-slide /g)||[]).length===1,'Fishing must retain its video');
assert((fishingCard.match(/data-photo-index=/g)||[]).length===3,'Fishing navigation must have exactly three dots');
for(const key of ['fishingPhoto1','fishingPhoto2','fishingPhoto3']){
 assert(html.includes('data-i18n-aria-label="'+key+'"'),'Missing fishing gallery navigation '+key);
}
assert(html.includes('data-exp="Deep-Sea Fishing"'),'Fishing card not selectable');
assert(html.includes('value="Deep-Sea Fishing"'),'Fishing form choice missing');
assert(app.includes("tripField.value!=='Deep-Sea Fishing'"),'Fishing form should not request swimming ability');
for(const key of ['altFishing1','altFishing4']){
 assert(html.includes('data-i18n-alt="'+key+'"'),'Missing fishing gallery image '+key);
}
for(const code of languages){
 const dict={...(base[code]||{}),...(extras[code]||{})};
 for(const key of ['card1Tag','card1Title','card1Text','card2Tag','card2Text','altFishing1','altFishing4','fishingPhoto1','fishingPhoto2','fishingPhoto3','fishingVideoAria','chooseFishing']){
  assert(typeof dict[key]==='string' && dict[key].trim(),code+': missing fishing translation '+key);
 }
}
for(const code of languages){
 for(const key of ['experiencesCarouselLabel','experiencePrev','experienceNext','photoPrev','photoNext','photo1','photo2','photo3','carouselHint']){
  assert(typeof extras[code][key]==='string' && extras[code][key].trim(),code+': missing carousel translation '+key);
 }
}
console.log('OK: IT / EN / DE / FR translations, form messages, accessibility labels, and gallery');
