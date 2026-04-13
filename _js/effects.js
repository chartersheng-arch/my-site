// Particle + butterfly-free background
(function(){
  var canvas=document.getElementById('particles');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var width,height,ps=[];
  function rz(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight;}
  rz();window.addEventListener('resize',rz);
  for(var i=0;i<50;i++){
    ps.push({
      x:Math.random()*width,
      y:Math.random()*height,
      r:Math.random()*2.5+0.5,
      vx:(Math.random()-0.5)*0.4,
      vy:-Math.random()*0.6-0.1,
      alpha:Math.random()*0.5+0.15,
      color:Math.random()>0.3?'#00d4c8':'#8b5cf6'
    });
  }
  (function df(){
    ctx.clearRect(0,0,width,height);
    ps.forEach(function(p){
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color;
      ctx.globalAlpha=p.alpha;
      ctx.fill();
      p.x+=p.vx;p.y+=p.vy;
      if(p.y<-10){p.y=height+10;p.x=Math.random()*width;}
    });
    ctx.globalAlpha=1;
    requestAnimationFrame(df);
  })();
})();

// Background music - navbar player
(function(){
  var musicSrc='https://bilbb-a.akamaized.net/audio/music/BV1xroTY7Etk.mp3';
  var audio=document.getElementById('bgMusic');
  var btn=document.getElementById('musicToggle');
  if(!audio||!btn)return;
  var playing=false;
  audio.src=musicSrc;audio.volume=0.3;
  btn.addEventListener('click',function(){
    if(playing){audio.pause();btn.textContent='♪';btn.style.borderColor='rgba(0,212,200,0.3)';playing=false;}
    else{audio.play().catch(function(){});btn.textContent='❚❚';btn.style.borderColor='var(--crystal)';playing=true;}
  });
  audio.addEventListener('play',function(){btn.textContent='❚❚';btn.style.borderColor='var(--crystal)';playing=true;});
  audio.addEventListener('pause',function(){btn.textContent='♪';btn.style.borderColor='rgba(0,212,200,0.3)';playing=false;});
})();
