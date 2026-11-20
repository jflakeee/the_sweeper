import test from 'node:test';
import assert from 'node:assert/strict';
import {initial} from '../game/core.mjs';
import {migrateV1} from '../game/campaign-save.mjs';
import {enterNextSector} from '../game/campaign-transition.mjs';
import {campaignView} from '../game/campaign-ui.mjs';
function completeOne(){const a=initial();for(const t of a.tiles)t.n=0;a.sold=900;a.wallet=1000;a.complete=true;return migrateV1(a);}
test('v1 migration keeps first sector HUD and no premature unlock',()=>{
 const s=migrateV1(initial()),v=campaignView(s);
 assert.equal(v.progress,'0.0%');assert.equal(v.bag,'0 / 90');assert.equal(v.sectorLabel,'A-01');
 assert.equal(v.actions.enterNext,false);assert.equal(v.actions.wide,false);assert.equal(v.actions.capacity,false);
});
test('completion enables explicit next sector action once',()=>{
 const done=campaignView(completeOne());assert.equal(done.actions.enterNext,true);
 assert.equal(done.actions.sell,false);
 const next=campaignView(enterNextSector(completeOne()));
 assert.equal(next.actions.enterNext,false);assert.equal(next.sectorLabel,'A-02');assert.equal(next.progress,'0.0%');
 assert.equal(next.wallet,'1000');assert.equal(next.actions.wide,true);assert.equal(next.actions.capacity,true);
});
test('sector two bag, upgrades and remaining hint reflect state',()=>{
 const s=enterNextSector(completeOne());s.bag=90;s.tiles[0].n=0;for(let i=1;i<9;i++)s.tiles[i].n=0;
 const v=campaignView(s);assert.equal(v.bag,'90 / 90');assert.match(v.hint,/가득/);
 s.capacityLevel=1;s.wallet=850;const upgraded=campaignView(s);
 assert.equal(upgraded.bag,'90 / 135');assert.equal(upgraded.actions.capacity,false);
});
test('invalid state cannot generate misleading UI',()=>{
 assert.throws(()=>campaignView({...migrateV1(initial()),wallet:500}));
});
