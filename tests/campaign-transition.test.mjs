import test from 'node:test';
import assert from 'node:assert/strict';
import {initial} from '../game/core.mjs';
import {migrateV1,validCampaign,persistCampaign,readCampaign,CAMPAIGN_KEY} from '../game/campaign-save.mjs';
import {enterNextSector} from '../game/campaign-transition.mjs';
function completed(level=0){
 const s=initial();for(const t of s.tiles)t.n=0;
 s.sold=900;s.complete=true;s.level=level;s.wallet=1000-50*level;
 return migrateV1(s);
}
test('sector entry is free, explicit, and preserves first reward and upgrade',()=>{
 for(const level of [0,1]){
  const before=completed(level),copy=structuredClone(before),next=enterNextSector(before);
  assert.deepEqual(before,copy);assert.ok(validCampaign(next));assert.equal(next.sector,2);
  assert.equal(next.wallet,before.wallet);assert.equal(next.level,level);assert.deepEqual(next.completed,[1]);
  assert.equal(next.tiles.reduce((n,t)=>n+t.n,0),1050);assert.equal(next.sold,0);assert.equal(next.bag,0);
  assert.equal(next.complete,false);assert.equal(enterNextSector(next),null);
 }
});
test('sector entry denied before first completion or for invalid save',()=>{
 assert.equal(enterNextSector(migrateV1(initial())),null);
 assert.equal(enterNextSector({...completed(),wallet:9999}),null);
});
test('failed sector entry retains old state and same candidate can retry',()=>{
 const before=completed(1);let raw=JSON.stringify({current:before,previous:null});
 let fail=true;
 const store={getItem:k=>k===CAMPAIGN_KEY?raw:null,setItem:(k,v)=>{if(fail)throw Error('quota');raw=v;}};
 const next=enterNextSector(before);
 assert.throws(()=>persistCampaign(store,next,before));
 assert.deepEqual(readCampaign(store).current,before);
 fail=false;const committed=persistCampaign(store,next,before);
 assert.deepEqual(readCampaign(store).current,committed);
 assert.deepEqual(readCampaign(store).previous,before);
 assert.equal(committed.seq,before.seq+1);
 assert.equal(committed.wallet,950);
 assert.equal(enterNextSector(committed),null);
});
