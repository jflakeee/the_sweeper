import {valid,KEY} from './core.mjs';
import {sectors,validSectorResources} from './sectors.mjs';
export const CAMPAIGN_KEY='the-sweeper-campaign-v2';
export function migrateV1(state){
  if(!valid(state))throw Error('Invalid v1 save');
  return { ...structuredClone(state),version:2,sector:1,completed:state.complete?[1]:[],capacityLevel:0,speedLevel:0,tool:'basic'};
}
export function validCampaign(s){
  try{
    if(!s||s.version!==2||![1,2].includes(s.sector)||!Number.isSafeInteger(s.seq)||s.seq<0||![0,1].includes(s.level)||![0,1].includes(s.capacityLevel)||![0,1].includes(s.speedLevel)||typeof s.complete!=='boolean')return false;
    const expected=s.sector===1?(s.complete?[1]:[]):(s.complete?[1,2]:[1]);
    if(!Array.isArray(s.completed)||s.completed.length!==expected.length||!expected.every((id,i)=>s.completed[i]===id))return false;
    if(!['basic','wide'].includes(s.tool)||(s.sector===1&&(s.capacityLevel||s.speedLevel||s.tool!=='basic')))return false;
    if(!validSectorResources(s.sector,s.tiles,s.bag,s.sold,s.capacityLevel?135:90)||s.complete!==(s.sold===sectors[s.sector].total))return false;
    const prior=s.sector===2?1000:0;
    return Number.isSafeInteger(s.wallet)&&s.wallet>=0&&s.wallet===prior+s.sold+(s.complete?sectors[s.sector].reward:0)-50*s.level-150*s.capacityLevel-150*s.speedLevel&&Number.isFinite(s.player.x)&&s.player.x>=.3&&s.player.x<=23.7&&Number.isFinite(s.player.y)&&s.player.y>=.3&&s.player.y<=31.7&&Math.abs(Math.hypot(s.facing.x,s.facing.y)-1)<1e-6;
  }catch{return false;}
}
export function readCampaign(storage){
  const raw=storage.getItem(CAMPAIGN_KEY);
  if(raw!==null){
    try{const e=JSON.parse(raw);if(validCampaign(e.current))return {current:e.current,previous:validCampaign(e.previous)?e.previous:null};return {corrupt:true,raw,previous:validCampaign(e.previous)?e.previous:null};}catch{return {corrupt:true,raw,previous:null};}
  }
  const legacy=storage.getItem(KEY);
  if(legacy===null)return {fresh:true};
  try{const e=JSON.parse(legacy);if(valid(e.current))return {migration:migrateV1(e.current)};return {corrupt:true,raw:legacy,previous:valid(e.previous)?migrateV1(e.previous):null};}catch{return {corrupt:true,raw:legacy,previous:null};}
}
export function persistCampaign(storage,state,previous=null){
  if(!validCampaign(state)||state.seq>=Number.MAX_SAFE_INTEGER)throw Error('Invalid v2 save');
  const next=structuredClone(state);next.seq++;
  storage.setItem(CAMPAIGN_KEY,JSON.stringify({current:next,previous:validCampaign(previous)?previous:null}));
  return next;
}
