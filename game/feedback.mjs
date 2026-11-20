// Lightweight, dependency-free feedback for the existing Canvas2D game.
// The pinned PixelFX/PlinkFX repositories remain optional references, not runtime imports.
export function makeFeedback({audioContextFactory=()=>new AudioContext(),random=Math.random}={}){
 let audio=null,enabled=false,particles=[];
 const colors={collect:'#ffe1a7',sell:'#a7e6be',upgrade:'#7bd4e6',finish:'#f8cc72'};
 function unlock(){
  if(enabled)return true;
  try{audio=audioContextFactory();enabled=true;if(audio.state==='suspended')audio.resume().catch(()=>{});return true;}catch{return false;}
 }
 function sound(kind){
  if(!enabled||!audio||audio.state!=='running')return;
  const notes={sell:[660,880],upgrade:[523,784],finish:[523,659,988]};
  const frequencies=notes[kind];if(!frequencies)return;
  try{
   const start=audio.currentTime;
   frequencies.forEach((frequency,i)=>{
    const oscillator=audio.createOscillator(),gain=audio.createGain(),t=start+i*.07;
    oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,t);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.055,t+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,t+.15);
    oscillator.connect(gain).connect(audio.destination);oscillator.start(t);oscillator.stop(t+.16);
   });
  }catch{/* Audio is decorative: never affect a transaction. */}
 }
 function emit(kind,x,y,count=9){
  if(!colors[kind]||!Number.isFinite(x)||!Number.isFinite(y))return;
  particles=particles.slice(-60);
  for(let i=0;i<Math.min(count,24);i++){
   const angle=random()*Math.PI*2,speed=25+random()*70;
   particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.4+random()*.3,max:.7,color:colors[kind]});
  }
  sound(kind);
 }
 function tick(dt){
  const elapsed=Math.max(0,Math.min(dt,.1));
  for(const p of particles){p.x+=p.vx*elapsed;p.y+=p.vy*elapsed;p.vy+=55*elapsed;p.life-=elapsed;}
  particles=particles.filter(p=>p.life>0);
 }
 function draw(ctx){
  for(const p of particles){ctx.globalAlpha=Math.max(0,Math.min(1,p.life/p.max));ctx.fillStyle=p.color;ctx.fillRect(p.x-2,p.y-2,4,4);}
  ctx.globalAlpha=1;
 }
 function stop(){particles=[];}
 return {unlock,emit,tick,draw,stop,get count(){return particles.length;}};
}
