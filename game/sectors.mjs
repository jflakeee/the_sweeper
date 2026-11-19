export const sectors=Object.freeze({
  1:Object.freeze({id:1,name:'착륙장',total:900,reward:100,width:24,height:32}),
  2:Object.freeze({id:2,name:'화물 통로',total:1050,reward:120,width:24,height:32})
});
export function sectorTiles(id){
  const groups=id===1?[[6,8],[14,8],[9,17]]:id===2?[[3,5],[14,8],[9,17]]:null;
  if(!groups)throw new RangeError('Unknown sector');
  const tiles=[],width=id===1?6:7;
  for(const [x,y] of groups)for(let j=y;j<y+5;j++)for(let i=x;i<x+width;i++)tiles.push({x:i+.5,y:j+.5,n:10,p:0});
  return tiles;
}
export function sectorThresholds(id){
  const s=sectors[id];if(!s)throw new RangeError('Unknown sector');
  return {highlight:Math.floor(s.total/20),finish:Math.floor(s.total/200)};
}
export function validSectorResources(id,tiles,bag,sold,capacity=90){
  if(!sectors[id]||!Array.isArray(tiles)||![90,135].includes(capacity)||!Number.isInteger(bag)||bag<0||bag>capacity||!Number.isInteger(sold)||sold<0)return false;
  const base=sectorTiles(id);
  return tiles.length===base.length&&tiles.every((t,i)=>t&&t.x===base[i].x&&t.y===base[i].y&&Number.isInteger(t.n)&&t.n>=0&&t.n<=10&&Number.isFinite(t.p)&&t.p>=0&&t.p<1&&(t.n>0||t.p===0))&&tiles.reduce((sum,t)=>sum+t.n,0)+bag+sold===sectors[id].total;
}
