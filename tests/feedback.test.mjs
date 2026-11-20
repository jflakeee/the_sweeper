import test from 'node:test';
import assert from 'node:assert/strict';
import {makeFeedback} from '../game/feedback.mjs';
test('feedback is inert until user activation and survives unavailable audio',()=>{
 const f=makeFeedback({audioContextFactory:()=>{throw Error('unavailable')},random:()=>.5});
 assert.equal(f.unlock(),false);
 f.emit('collect',30,40,3);assert.equal(f.count,3);
 const ctx={globalAlpha:1,fillStyle:'',fillRect(){}};f.draw(ctx);assert.equal(ctx.globalAlpha,1);
 f.tick(1);assert.equal(f.count,3);for(let i=0;i<8;i++)f.tick(.1);assert.equal(f.count,0);
});
test('feedback rejects invalid points and caps particle count',()=>{
 const f=makeFeedback({random:()=>0});
 f.emit('unknown',0,0);f.emit('sell',NaN,0);assert.equal(f.count,0);
 for(let i=0;i<20;i++)f.emit('collect',1,1,24);
 assert.ok(f.count<=84);f.stop();assert.equal(f.count,0);
});
test('sound generation is optional and bounded to transaction events',()=>{
 let starts=0;const node={connect(){return this},start(){starts++},stop(){},frequency:{setValueAtTime(){}},gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}}};
 const f=makeFeedback({audioContextFactory:()=>({state:'running',currentTime:0,destination:{},createOscillator:()=>({...node}),createGain:()=>({...node})}),random:()=>0});
 assert.equal(f.unlock(),true);f.emit('collect',1,1,1);assert.equal(starts,0);
 f.emit('sell',1,1,1);assert.equal(starts,2);
 f.emit('upgrade',1,1,1);assert.equal(starts,4);
 f.emit('finish',1,1,1);assert.equal(starts,7);
});
