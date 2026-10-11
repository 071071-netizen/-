const fs = require('fs');
const path = require('path');
const dir = __dirname;
const htmlPath = path.join(dir, '..', 'index.html');

function readArr(file, name){
  const t = fs.readFileSync(path.join(dir, file), 'utf8');
  const s = t.substring(t.indexOf('['), t.lastIndexOf(']')+1); // 去掉结尾 ;
  return s;
}
const a4 = readArr('cet4_data.js');
const a6 = readArr('cet6_data.js');

let html = fs.readFileSync(htmlPath, 'utf8');
if(!html.includes('/*__CET4__*/[]') || !html.includes('/*__CET6__*/[]')){ console.error('占位符缺失'); process.exit(1); }
html = html.replace('/*__CET4__*/[]', a4);
html = html.replace('/*__CET6__*/[]', a6);
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('注入完成');

// 校验
html = fs.readFileSync(htmlPath, 'utf8');
function count(name){
  const m = html.match(new RegExp('const '+name+'=\\[[\\s\\S]*?\\];'));
  if(!m) return 'FAIL';
  return JSON.parse(m[0].substring(m[0].indexOf('['), m[0].lastIndexOf(']')+1)).length;
}
console.log('CET4 词数:', count('CET4'));
console.log('CET6 词数:', count('CET6'));
console.log('TRANS 残留占位:', html.includes('/*__TRANS__*/'));
console.log('index.html 字符:', html.length);
