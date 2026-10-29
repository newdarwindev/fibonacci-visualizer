// Dependency-free logic/DOM-contract tests; not a replacement for browser QA.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
class Element {
  constructor() { this.children=[]; this.handlers={}; this.attributes={}; this.textContent=''; }
  setAttribute(key,value) { this.attributes[key]=String(value); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children=children; }
  addEventListener(event,fn) { this.handlers[event]=fn; }
}
const elements = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],new Element()]));
let tick;
const document = {getElementById:id=>elements[id],createElement:()=>new Element(),createElementNS:()=>new Element(),createTextNode:text=>text,addEventListener:(event,fn)=>document[event]=fn,hidden:false};
const context = vm.createContext({document,setInterval:fn=>{tick=fn;return 1;},clearInterval:()=>{tick=null;}});
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
const run = code=>vm.runInContext(code,context);
const click = id=>elements[id].handlers.click();
const seek = value=>elements.index.handlers.input({target:{value}});
assert.deepEqual(Array.from(run('sequence')), [0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181,6765,10946,17711,28657,46368]);
assert.equal(run('current'),8);
for(let i=0;i<=24;i++) {
  seek(String(i));
  assert.equal(elements.numbers.children.length,i+1);
  assert.equal(elements.bars.children.length,2*(i+1));
  assert.equal(elements.step.disabled,i===24);
  for(const bar of elements.bars.children.filter((_,j)=>j%2===0)) {
    for(const key of ['x','y','width','height','rx']) assert.ok(Number.isFinite(Number(bar.attributes[key])));
    assert.ok(Number(bar.attributes.height)>=0 && Number(bar.attributes.height)<=215);
  }
}
assert.equal(elements.ratio.textContent,'1.618034');
click('step');assert.equal(run('current'),24);
click('play');assert.equal(run('current'),0);assert.equal(elements.play.textContent,'Pause');
for(let i=0;i<24;i++) tick();
assert.equal(run('current'),24);assert.equal(tick,null);assert.equal(elements.play.textContent,'Replay');
click('reset');assert.equal(run('current'),0);assert.equal(elements.ratio.textContent,'Not defined');
click('play');tick();click('play');assert.equal(tick,null);assert.equal(run('current'),1);
click('play');seek('12');assert.equal(tick,null);assert.equal(run('current'),12);
click('play');click('step');assert.equal(tick,null);assert.equal(run('current'),13);
click('play');document.hidden=true;document.visibilitychange();assert.equal(tick,null);
seek('-2');assert.equal(run('current'),0);seek('99');assert.equal(run('current'),24);
assert.ok(html.includes('for="index"'));assert.ok(html.includes('aria-live="polite"'));
assert.ok(!/<(?:script|link|img)[^>]+(?:src|href)=/i.test(html));
console.log('PASS: all 25 values, chart bounds, slider, step, repeated play/pause, replay, reset, hidden-page pause, static accessibility and no external assets.');
