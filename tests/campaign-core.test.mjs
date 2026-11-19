import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,remaining,step} from '../game/core.mjs';
import {migrateV1,validCampaign} from '../game/campaign-save.mjs';
import {enterNextSector} from '../game/campaign-transition.mjs';
import {capacity,rate,toolWidth,campaignStep,campaignSell,campaignFinish,campaignUpgrade,campaignEquip} from '../game/campaign-core.mjs';
function second(){const a=initial();for(const t of a.tiles)t.n=0;a.sold=900;a.wallet=1000;a.complete=true;return enterNextSector(migrateV1(a));}
test('sector one movement and cleaning match legacy',()=>{
 const a=initial(),b=migrateV1(a);for(let i=0;i<100;i++){step(a,.1,0,-1);campaignStep(b,.1,0,-1);}
 for(const k of ['tiles','bag','player','facing'])assert.deepEqual(b[k],a[k]);assert.ok(validCampaign(b));
});
test('upgrade and tool eligibility, duplicate protection and ledger',()=>{
 const a=migrateV1(initial());assert.equal(campaignUpgrade(a,'capacity'),false);assert.equal(campaignEquip(a,'wide'),false);
 const s=second();for(const k of ['rate','capacity','speed']){assert.ok(campaignUpgrade(s,k));assert.equal(campaignUpgrade(s,k),false);}
 assert.ok(campaignEquip(s,'wide'));assert.equal(campaignEquip(s,'wide'),false);
 assert.equal(s.wallet,650);assert.equal(capacity(s),135);assert.equal(rate(s),8.4);assert.equal(toolWidth(s),2.24);assert.ok(validCampaign(s));
});
test('capacity limits cleaning and preserves resources',()=>{
 const s=second();campaignUpgrade(s,'capacity');for(let i=0;i<13;i++)s.tiles[i].n=0;s.tiles[13].n=6;s.bag=134;
 s.player={x:9.5,y:18.5};s.facing={x:1,y:0};campaignStep(s,1);
 assert.equal(s.bag,135);assert.equal(remaining(s),915);assert.ok(validCampaign(s));
});
test('sector two finish awards 120 exactly once',()=>{
 const s=second();for(const t of s.tiles)t.n=0;s.tiles[0].n=5;s.sold=1045;s.wallet=2045;
 assert.ok(validCampaign(s));assert.ok(campaignFinish(s));assert.equal(s.wallet,2170);assert.deepEqual(s.completed,[1,2]);assert.ok(validCampaign(s));
 assert.equal(campaignFinish(s),false);assert.equal(campaignSell(s),false);
});
test('finish for six remaining is denied; selling preserves balance',()=>{
 const s=second();for(const t of s.tiles)t.n=0;s.tiles[0].n=6;s.sold=1034;s.bag=10;s.wallet=2034;
 assert.equal(campaignFinish(s),false);assert.ok(campaignSell(s));assert.equal(s.wallet,2044);assert.ok(validCampaign(s));assert.equal(s.complete,false);
});
