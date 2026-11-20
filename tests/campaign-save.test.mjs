import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,KEY} from '../game/core.mjs';
import {sectorTiles} from '../game/sectors.mjs';
import {CAMPAIGN_KEY,migrateV1,validCampaign,readCampaign,persistCampaign} from '../game/campaign-save.mjs';
const store=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};};
test('fresh and partial upgraded v1 migration preserves every original field',()=>{
 const v=initial();v.tiles[0].n=0;for(let i=1;i<6;i++)v.tiles[i].n=0;v.tiles[6].p=.5;v.sold=50;v.bag=10;v.level=1;v.wallet=0;v.seq=7;
 for(const original of [initial(),v]){
  const next=migrateV1(original);assert.ok(validCampaign(next));
  for(const key of Object.keys(original))if(key!=='version')assert.deepEqual(next[key],original[key]);
  assert.notEqual(next.tiles,original.tiles);
 }
});
test('completed v1 retains first reward and purchase',()=>{
 const v=initial();for(const t of v.tiles)t.n=0;v.sold=900;v.complete=true;v.level=1;v.wallet=950;
 const next=migrateV1(v);assert.ok(validCampaign(next));assert.deepEqual(next.completed,[1]);assert.equal(next.wallet,950);
});
test('invalid legacy is not silently reset',()=>{
 const st=store();st.setItem(KEY,'broken');assert.equal(readCampaign(st).corrupt,true);assert.throws(()=>migrateV1({}));
});
test('migration write failure retains legacy and retry commits v2',()=>{
 const st=store(),raw=JSON.stringify({current:initial(),previous:null});st.setItem(KEY,raw);
 const candidate=readCampaign(st).migration;assert.ok(candidate);
 assert.throws(()=>persistCampaign({...st,setItem(){throw Error('quota');}},candidate));
 assert.equal(st.getItem(KEY),raw);assert.equal(st.getItem(CAMPAIGN_KEY),null);
 const next=persistCampaign(st,candidate);assert.deepEqual(readCampaign(st).current,next);assert.equal(st.getItem(KEY),raw);
});
test('corrupt v2 does not fall back to legacy',()=>{
 const st=store();st.setItem(KEY,JSON.stringify({current:initial()}));st.setItem(CAMPAIGN_KEY,'broken');
 assert.equal(readCampaign(st).corrupt,true);assert.equal(readCampaign(st).migration,undefined);
});
test('sector two ledger rejects duplicate rewards and missing eligibility',()=>{
 const s={...migrateV1(initial()),sector:2,tiles:sectorTiles(2),completed:[1],wallet:650,level:1,capacityLevel:1,speedLevel:1,tool:'wide'};
 assert.ok(validCampaign(s));assert.equal(validCampaign({...s,wallet:750}),false);assert.equal(validCampaign({...s,completed:[]}),false);
 for(const t of s.tiles)t.n=0;s.sold=1050;s.complete=true;s.completed=[1,2];s.wallet=1820;assert.ok(validCampaign(s));
});
