// Butterfly canvas - both sides of page
(function(){
  var canvas=document.getElementById('butterflies');
  if(!canvas)return;
  var ctx=canvas.getContext('2d'),width,height,mx=0,my=0,bs=[];
  function rz(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight;}
  rz();window.addEventListener('resize',rz);
  window.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
  var numB=12;
  for(var i=0;i<numB;i++){
    var side=i%2===0?Math.random()*width*0.4:width*0.6+Math.random()*width*0.4;
    bs.push({x:side,y:Math.random()*height,vx:(Math.random()-0.5)*0.8,vy:(Math.random()-0.5)*0.5,angle:Math.random()*Math.PI*2,aVel:(Math.random()-0.5)*0.04,wing:Math.random()*Math.PI*2,speed:0.08+Math.random()*0.06,size:8+Math.random()*8});
  }
  function drawB(b){
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);
    var ws=Math.sin(b.wing)*b.size;
    ctx.fillStyle='rgba(0,212,200,0.7)';
    ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(ws*0.5,-b.size*0.6,ws,-b.size*0.3,ws,0);ctx.bezierCurveTo(ws,b.size*0.3,ws*0.5,b.size*0.6,0,0);ctx.fill();
    ctx.fillStyle='rgba(0,212,200,0.5)';
    ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-ws*0.5,-b.size*0.6,-ws,-b.size*0.3,-ws,0);ctx.bezierCurveTo(-ws,b.size*0.3,-ws*0.5,b.size*0.6,0,0);ctx.fill();
    ctx.fillStyle='rgba(0,212,200,0.9)';ctx.beginPath();ctx.arc(0,0,b.size*0.15,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  (function fl(){
    ctx.clearRect(0,0,width,height);
    bs.forEach(function(b){
      var dx=mx-b.x,dy=my-b.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){var f=(120-dist)/120*2;b.vx+=dx/dist*f*0.3;b.vy+=dy/dist*f*0.3;}
      b.vx*=(1-0.02);b.vy*=(1-0.02);
      b.x+=b.vx;b.y+=b.vy;b.angle+=b.aVel;b.wing+=b.speed;
      if(b.wing>Math.PI*2)b.wing-=Math.PI*2;
      if(b.x<-50)b.x=width+50;if(b.x>width+50)b.x=-50;
      if(b.y<-50)b.y=height+50;if(b.y>height+50)b.y=-50;
      drawB(b);
    });
    requestAnimationFrame(fl);
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
    else{audio.play().catch(function(){});btn.textContent='❚❚';btn.style.borderColor='var(--cricstal)';playing=true;}
  });
  // Update button style when playing
  audio.addEventListener('play',function(){btn.textContent='❚❚';btn.style.borderColor='var(--crystal)';playing=true;});
  audio.addEventListener('pause',function(){btn.textContent='♪';btn.style.borderColor='rgba(0,212,200,0.3)';playing=false;});
})();
