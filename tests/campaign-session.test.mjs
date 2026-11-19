import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,KEY} from '../game/core.mjs';
import {CAMPAIGN_KEY} from '../game/campaign-save.mjs';
import {loadSession,transactionCandidate,commitSession} from '../game/campaign-session.mjs';
import {campaignSell} from '../game/campaign-core.mjs';
test('session migration and sale retry never publish an uncommitted wallet',()=>{
 const legacy=initial();legacy.tiles[0].n=0;legacy.bag=10;
 const raw=JSON.stringify({current:legacy});const map=new Map([[KEY,raw]]);
 let fail=false;const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(fail)throw Error('quota');map.set(k,v);}};
 const loaded=loadSession(storage);assert.equal(loaded.migration,true);assert.equal(map.has(CAMPAIGN_KEY),false);
 const baseline=commitSession(storage,loaded.current,loaded.saved);
 const candidate=transactionCandidate(baseline.current,campaignSell);
 assert.equal(candidate.wallet,10);assert.equal(baseline.current.wallet,0);
 fail=true;assert.throws(()=>commitSession(storage,candidate,baseline.saved));
 assert.equal(loadSession(storage).current.wallet,0);
 fail=false;const result=commitSession(storage,candidate,baseline.saved);
 assert.equal(result.current.wallet,10);assert.equal(loadSession(storage).current.wallet,10);
 assert.equal(transactionCandidate(result.current,campaignSell),null);assert.equal(map.get(KEY),raw);
});
test('fresh session initializes without writing and corrupt session remains corrupt',()=>{
 const storage={getItem:()=>null};const loaded=loadSession(storage);
 assert.equal(loaded.fresh,true);assert.equal(loaded.current.version,2);assert.equal(loaded.saved,null);
 assert.equal(loadSession({getItem:()=>'{bad'}).corrupt,true);
});
