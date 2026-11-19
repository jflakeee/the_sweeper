import test from 'node:test';
import assert from 'node:assert/strict';
import {initial} from '../game/core.mjs';
import {sectors,sectorTiles,sectorThresholds,validSectorResources} from '../game/sectors.mjs';

test('sector one exactly matches v1 tiles',()=>assert.deepEqual(sectorTiles(1),initial().tiles));
test('sector two has 105 unique in-bounds tiles and 1050 dust',()=>{
  const tiles=sectorTiles(2);
  assert.equal(tiles.length,105);
  assert.equal(new Set(tiles.map(t=>t.x+','+t.y)).size,105);
  assert.ok(tiles.every(t=>t.x>0&&t.x<24&&t.y>0&&t.y<32&&Math.hypot(t.x-12.5,t.y-26.5)>1.5));
  assert.equal(tiles.reduce((a,t)=>a+t.n,0),1050);
  assert.notEqual(tiles[0],sectorTiles(2)[0]);
});
test('thresholds follow integer dust counts',()=>{
  assert.deepEqual(sectorThresholds(1),{highlight:45,finish:4});
  assert.deepEqual(sectorThresholds(2),{highlight:52,finish:5});
});
test('sector two conservation across partial work, bag and sale',()=>{
  const tiles=sectorTiles(2);
  assert.ok(validSectorResources(2,tiles,0,0));
  tiles[0].n=0;tiles[1].n=8;tiles[1].p=.5;
  assert.ok(validSectorResources(2,tiles,12,0));
  assert.ok(validSectorResources(2,tiles,0,12));
  assert.equal(validSectorResources(2,tiles,0,13),false);
  tiles[0].p=.2;
  assert.equal(validSectorResources(2,tiles,0,12),false);
});
test('capacity and invalid sector boundaries',()=>{
  const tiles=sectorTiles(2);
  for(let i=0;i<10;i++)tiles[i].n=0;
  assert.equal(validSectorResources(2,tiles,100,0),false);
  assert.ok(validSectorResources(2,tiles,100,0,135));
  assert.equal(validSectorResources(3,tiles,100,0),false);
  assert.throws(()=>sectorTiles(3),RangeError);
});
test('two-sector maximum first-completion income',()=>{
  assert.equal(sectors[1].total+sectors[1].reward+sectors[2].total+sectors[2].reward,2170);
});
