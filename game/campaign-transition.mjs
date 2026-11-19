import {validCampaign} from './campaign-save.mjs';
import {sectorTiles} from './sectors.mjs';

// Caller must hold the existing writer lock and persist before publishing.
export function enterNextSector(state){
  if(!validCampaign(state)||state.sector!==1||!state.complete)return null;
  const next={...structuredClone(state),sector:2,tiles:sectorTiles(2),bag:0,sold:0,complete:false,player:{x:12.5,y:25.5},facing:{x:0,y:-1}};
  if(!validCampaign(next))throw Error('Invalid sector transition');
  return next;
}
