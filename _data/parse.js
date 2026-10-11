const fs = require('fs');
const path = require('path');
const dir = __dirname;

function loadJson(file){
  const txt = fs.readFileSync(path.join(dir, file), 'utf8');
  return txt.split('\n').filter(l=>l.trim()).map(l=>{ try{ return JSON.parse(l); }catch(e){ return null; } }).filter(Boolean);
}
function pick(entry){
  const hw = entry.headWord || '';
  if(!hw) return null;
  const c = (entry.content||{}).word||{}; const cc = c.content||{};
  const ph = cc.usphone || cc.ukphone || '';
  let cn = '';
  const trans = cc.trans || [];
  if(trans.length){
    cn = trans.slice(0,4).map(t=>((t.pos||'')+' '+(t.tranCn||'')).trim()).join('；').trim();
  }
  let ex = '';
  const sent = ((cc.sentence||{}).sentences)||[];
  if(sent.length && sent[0].sContent) ex = sent[0].sContent.trim();
  let fun = '';
  const rem = cc.remMethod || {};
  if(rem.val) fun = rem.val.replace(/^【[^】]*】/,'').trim();
  return [hw.toLowerCase(), ph, cn, ex, fun];
}
function buildList(file){
  const data = loadJson(file);
  const map = new Map();
  for(const e of data){ const p = pick(e); if(p && p[0]) map.set(p[0], p); }
  return map;
}
const cet4 = buildList('CET4_2.json');
const cet6All = buildList('CET6_2.json');
const cet6 = new Map();
for(const [w,v] of cet6All){ if(!cet4.has(w)) cet6.set(w,v); }
const arr4 = [...cet4.values()];
const arr6 = [...cet6.values()];

// 只生成可内联的数据文件
fs.writeFileSync(path.join(dir,'cet4_data.js'), 'const CET4='+JSON.stringify(arr4)+';','utf8');
fs.writeFileSync(path.join(dir,'cet6_data.js'), 'const CET6='+JSON.stringify(arr6)+';','utf8');
let s4=JSON.stringify(arr4), s6=JSON.stringify(arr6);
console.log('四级词数:', arr4.length, '| 数据字符:', s4.length);
console.log('六级(独有)词数:', arr6.length, '| 数据字符:', s6.length);
console.log('合计:', arr4.length+arr6.length);
