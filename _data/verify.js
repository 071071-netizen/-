const fs = require('fs');
const path = require('path');
const dir = __dirname;
const htmlPath = path.join(dir, '..', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('占位符 CET4 是否残留:', html.includes('/*__CET4__*/'));
console.log('占位符 CET6 是否残留:', html.includes('/*__CET6__*/'));
console.log('是否包含 </script> 提前关闭风险:', /\]\s*<\/script>|<\\\//.test(html.slice(0,html.indexOf('/* __DATA_END__ */'))));

function extract(name){
  const m = html.match(new RegExp('const '+name+'=\\[[\\s\\S]*?\\];'));
  if(!m) return null;
  return JSON.parse(m[0].substring(m[0].indexOf('['), m[0].lastIndexOf(']')+1));
}
const c4 = extract('CET4');
const c6 = extract('CET6');
console.log('CET4 词数:', c4? c4.length : 'FAIL');
console.log('CET6 词数:', c6? c6.length : 'FAIL');
// 抽样检查字段
const sample = [c4[0], c4.find(x=>x[0]==='abandon'), c6.find(x=>x[0]==='abundant')];
sample.forEach(s=>console.log('样本:', s && s.slice(0,5)));
// 检查任何词条是否含 </script>
let bad=0;
[].concat(c4||[],c6||[]).forEach(w=>{ w.slice(1,5).forEach(f=>{ if(String(f).toLowerCase().includes('</script')) bad++ }) });
console.log('含 </script> 的词条数:', bad);
