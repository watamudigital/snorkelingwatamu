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
console.log('OK: IT / EN / DE / FR translations, form messages, accessibility labels, and gallery');
