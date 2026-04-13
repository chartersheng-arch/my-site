const canvas=document.getElementById('particles'),ctx=canvas&&canvas.getContext('2d');
if(canvas&&ctx){
  function rz(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  rz();window.addEventListener('resize',rz);
  const ps=[];
  for(let i=0;i<40;i++)ps.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+0.5,vx:(Math.random()-0.5)*0.3,vy:-Math.random()*0.5-0.1,alpha:Math.random()*0.5+0.1,color:Math.random()>0.3?'#00d4c8':'#8b5cf6'});
  (function df(){ctx.clearRect(0,0,canvas.width,canvas.height);ps.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.globalAlpha=p.alpha;ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.y<-10){p.y=canvas.height+10;p.x=Math.random()*canvas.width;}});ctx.globalAlpha=1;requestAnimationFrame(df);})();
}
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
