import {near,remaining} from './core.mjs';
import {sectors,sectorThresholds} from './sectors.mjs';
export const capacity=s=>s.capacityLevel?135:90;
export const toolWidth=s=>s.tool==='wide'?2.24:1.4;
export const rate=s=>(s.tool==='wide'?7:6)*(s.level?1.2:1);
export function campaignStep(s,dt,dx=0,dy=0){
 if(s.complete||![dt,dx,dy].every(Number.isFinite))return;
 dt=Math.max(0,Math.min(dt,1));const len=Math.hypot(dx,dy);
 if(len){dx/=len;dy/=len;s.facing={x:dx,y:dy};const speed=s.speedLevel?2.2:2;
 s.player.x=Math.max(.3,Math.min(23.7,s.player.x+dx*speed*dt));s.player.y=Math.max(.3,Math.min(31.7,s.player.y+dy*speed*dt));}
 let work=dt*rate(s);const cap=capacity(s),half=toolWidth(s)/2;
 const targets=s.tiles.map((t,i)=>{const x=t.x-s.player.x,y=t.y-s.player.y;return {t,i,front:x*s.facing.x+y*s.facing.y,side:Math.abs(x*s.facing.y-y*s.facing.x),d:x*x+y*y};}).filter(a=>a.t.n&&a.front>=0&&a.front<=1.8&&a.side<=half).sort((a,b)=>a.t.n-b.t.n||a.d-b.d||a.i-b.i);
 for(const {t} of targets){while(work>1e-10&&t.n&&s.bag<cap){const used=Math.min(work,1-t.p);t.p+=used;work-=used;if(t.p>=1-1e-10){t.p=0;t.n--;s.bag++;}}if(s.bag===cap)break;}
}
export function campaignSell(s){
 if(!near(s)||s.complete||!s.bag)return false;
 s.wallet+=s.bag;s.sold+=s.bag;s.bag=0;
 if(s.sold===sectors[s.sector].total){s.complete=true;s.completed.push(s.sector);s.wallet+=sectors[s.sector].reward;}
 return true;
}
export function campaignFinish(s){
 if(!near(s)||s.complete||remaining(s)>sectorThresholds(s.sector).finish)return false;
 const collected=s.bag+remaining(s);if(!collected)return false;
 for(const t of s.tiles){t.n=0;t.p=0;}
 s.bag=0;s.sold+=collected;s.wallet+=collected;
 if(s.sold===sectors[s.sector].total){s.complete=true;s.completed.push(s.sector);s.wallet+=sectors[s.sector].reward;}
 return true;
}
export function campaignUpgrade(s,kind){
 const costs={rate:50,capacity:150,speed:150},fields={rate:'level',capacity:'capacityLevel',speed:'speedLevel'};
 if(!Object.hasOwn(costs,kind)||!near(s)||s.complete||(kind!=='rate'&&s.sector!==2)||s[fields[kind]]||s.wallet<costs[kind])return false;
 s.wallet-=costs[kind];s[fields[kind]]=1;return true;
}
export function campaignEquip(s,tool){
 if(s.complete||s.sector!==2||!['basic','wide'].includes(tool)||s.tool===tool)return false;s.tool=tool;return true;
}
