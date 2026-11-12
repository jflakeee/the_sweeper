import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const server = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1'], {stdio:'ignore'});
const origin = 'http://127.0.0.1:8765';
const wait = async () => { for(let i=0;i<40;i++){try{const r=await fetch(origin+'/game/');if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,200));}throw Error('local server not ready'); };
const browser = await chromium.launch({headless:true});
const context = await browser.newContext();
let passed = 0;
try {
  await wait();
  // Two pages in the same context share origin and Web Locks.
  const a = await context.newPage();
  await a.goto(origin+'/game/');
  await a.getByRole('button',{name:'첫 청소 시작'}).click();
  await a.waitForTimeout(150);
  const b = await context.newPage();
  await b.goto(origin+'/game/');
  await b.getByText('다른 탭에서 실행 중이에요').waitFor();
  assert.equal(await b.locator('dialog').isVisible(),true);
  console.log('PASS B01: second tab rejected while first owns lock');passed++;
  await a.close();
  await b.getByRole('button',{name:'다시 연결'}).click();
  await b.getByRole('button',{name:/이어서 청소|첫 청소 시작/}).waitFor();
  console.log('PASS B01: lock reacquired after first tab closes');passed++;
  await b.close();

  // Valid v1 near-completion fixture; inject before app boots.
  const c = await context.newPage();
  await c.addInitScript(() => {
    const tiles=[];
    for(const [x,y] of [[6,8],[14,8],[9,17]])for(let j=y;j<y+5;j++)for(let i=x;i<x+6;i++)tiles.push({x:i+.5,y:j+.5,n:0,p:0});
    tiles[0].n=4;
    const state={version:1,seq:4,tiles,bag:0,sold:896,wallet:896,level:0,complete:false,player:{x:12.5,y:26.5},facing:{x:0,y:-1}};
    localStorage.setItem('the-sweeper-a-v1',JSON.stringify({current:state,previous:null}));
  });
  await c.goto(origin+'/game/');
  await c.getByRole('button',{name:'이어서 청소'}).click();
  await c.getByRole('button',{name:'마지막 정리'}).click();
  await c.getByText('착륙장 정리 완료').waitFor();
  let saved=await c.evaluate(()=>JSON.parse(localStorage.getItem('the-sweeper-a-v1')).current);
  assert.equal(saved.wallet,1000);assert.equal(saved.sold,900);assert.equal(saved.complete,true);
  await c.reload();
  await c.getByRole('button',{name:'이어서 청소'}).click();
  saved=await c.evaluate(()=>JSON.parse(localStorage.getItem('the-sweeper-a-v1')).current);
  assert.equal(saved.wallet,1000);assert.equal(saved.complete,true);
  console.log('PASS B03: completion once, reload retains reward');passed++;
  await c.close();

  // Fail exactly one localStorage write in the page, then retry the pending transaction.
  const d=await context.newPage();
  await d.addInitScript(() => {
    const tiles=[];
    for(const [x,y] of [[6,8],[14,8],[9,17]])for(let j=y;j<y+5;j++)for(let i=x;i<x+6;i++)tiles.push({x:i+.5,y:j+.5,n:0,p:0});
    tiles[0].n=4;
    const state={version:1,seq:2,tiles,bag:0,sold:896,wallet:896,level:0,complete:false,player:{x:12.5,y:26.5},facing:{x:0,y:-1}};
    localStorage.setItem('the-sweeper-a-v1',JSON.stringify({current:state,previous:null}));
    const native=Storage.prototype.setItem;
    let injected=false;
    Storage.prototype.setItem=function(key,value){
      if(key==='the-sweeper-a-v1' && !injected && window.__injectFailure){injected=true;throw new DOMException('quota','QuotaExceededError');}
      return native.call(this,key,value);
    };
  });
  await d.goto(origin+'/game/');
  await d.getByRole('button',{name:'이어서 청소'}).click();
  await d.evaluate(()=>{window.__injectFailure=true;});
  await d.getByRole('button',{name:'마지막 정리'}).click();
  await d.getByText('저장을 완료하지 못했어요').waitFor();
  let pending=await d.evaluate(()=>JSON.parse(localStorage.getItem('the-sweeper-a-v1')).current);
  assert.equal(pending.wallet,896);assert.equal(pending.complete,false);
  await d.getByRole('button',{name:'저장 다시 시도'}).click();
  pending=await d.evaluate(()=>JSON.parse(localStorage.getItem('the-sweeper-a-v1')).current);
  assert.equal(pending.wallet,1000);assert.equal(pending.complete,true);
  console.log('PASS B02: failed completion persisted only on retry');passed++;
  await d.close();
  console.log('Browser checks passed:',passed);
} finally { await context.close(); await browser.close();server.kill(); }
