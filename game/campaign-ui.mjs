import {remaining,near} from './core.mjs';
import {sectors,sectorThresholds} from './sectors.mjs';
import {validCampaign} from './campaign-save.mjs';
import {capacity,rate} from './campaign-core.mjs';

export function campaignView(state){
 if(!validCampaign(state))throw Error('Invalid campaign state');
 const s=state,sector=sectors[s.sector],rem=remaining(s),atBase=near(s),cap=capacity(s);
 const nextSectorAvailable=s.sector===1&&s.complete;
 return {
  sectorName:sector.name,sectorLabel:'A-0'+s.sector,
  progress:((sector.total-rem)/sector.total*100).toFixed(1)+'%',
  bag:s.bag+' / '+cap,wallet:String(s.wallet),rate:rate(s),
  hint:s.complete?(nextSectorAvailable?'착륙장 정리 완료 · 화물 통로로 이동할 수 있어요':'모든 먼지 정리 완료'):
   s.bag===cap?'적재함이 가득 찼어요 · 기지에서 판매하세요':
   rem<=sectorThresholds(s.sector).highlight?'남은 먼지 '+rem+' · '+sectorThresholds(s.sector).finish+' 이하일 때 기지에서 마지막 정리':
   '앞쪽 먼지 자동 청소 · '+rate(s)+'/초',
  actions:{
   sell:!s.complete&&atBase&&s.bag>0,
   finish:!s.complete&&atBase&&rem<=sectorThresholds(s.sector).finish,
   rate:!s.complete&&atBase&&!s.level&&s.wallet>=50,
   capacity:!s.complete&&s.sector===2&&atBase&&!s.capacityLevel&&s.wallet>=150,
   speed:!s.complete&&s.sector===2&&atBase&&!s.speedLevel&&s.wallet>=150,
   wide:!s.complete&&s.sector===2&&s.tool!=='wide',
   basic:!s.complete&&s.sector===2&&s.tool!=='basic',
   enterNext:nextSectorAvailable
  },
  upgrades:{rate:s.level?'구매 완료':'처리율 +20% · 50',capacity:s.capacityLevel?'구매 완료':'적재량 135 · 150',speed:s.speedLevel?'구매 완료':'이동 속도 +10% · 150'}
 };
}
