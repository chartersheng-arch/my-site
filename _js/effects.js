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

// Background music - navbar player (iframe-based, persistent across pages)
(function(){
  var musicSrc='res/bgm.mp3';
  var musicTitle='赴每一程未知';
  var STORAGE_KEY='***';

  var btn=document.getElementById('musicToggle');
  var titleEl=document.getElementById('musicTitle');
  var audioEl=document.getElementById('bgMusic');
  if(!btn)return;

  var playerFrame=null;
  var playing=false;
  var playerReady=false;
  var currentSrc=musicSrc;

  // 从 sessionStorage 读取播放进度（由 player.html 回传）
  function getSavedTime(){
    try{
      var s=sessionStorage.getItem(STORAGE_KEY);
      if(s){var d=JSON.parse(s);return d.time||0;}
    }catch(ex){}
    return 0;
  }

  function getSavedPlaying(){
    try{
      var s=sessionStorage.getItem(STORAGE_KEY);
      if(s){var d=JSON.parse(s);return d.playing||false;}
    }catch(ex){}
    return false;
  }

  function initPlayer(){
    playerFrame=document.createElement('iframe');
    playerFrame.id='bgPlayerFrame';
    playerFrame.style.cssText='position:fixed;width:1px;height:1px;border:none;top:-9999px;left:-9999px;pointer-events:none;visibility:hidden;';
    playerFrame.src='player.html';
    document.body.appendChild(playerFrame);

    window.addEventListener('message',function(e){
      if(!e.data||!e.data.type)return;
      switch(e.data.type){
        case 'ready':
          playerReady=true;
          syncFromPage();
          var savedPlaying=getSavedPlaying();
          var savedTime=getSavedTime();
          // 通知播放器设置 src 并恢复进度
          playerFrame.contentWindow.postMessage({
            type:'setSrc',
            src:currentSrc,
            time:savedTime
          },'*');
          if(savedPlaying){
            setTimeout(function(){
              playerFrame.contentWindow.postMessage({type:'play'},'*');
              playing=true;
              updateBtn();
            },200);
          }
          break;
        case 'playing':
          playing=e.data.playing;
          updateBtn();
          // 通知播放器保存当前进度
          playerFrame.contentWindow.postMessage({type:'saveProgress'},'*');
          break;
        case 'progressSaved':
          // 播放器已保存进度到 sessionStorage
          try{
            sessionStorage.setItem(STORAGE_KEY,JSON.stringify({
              playing:playing,
              src:currentSrc,
              time:e.data.time||0
            }));
          }catch(ex){}
          break;
        case 'state':
          playing=e.data.playing;
          updateBtn();
          break;
      }
    });
  }

  function syncFromPage(){
    if(titleEl&&titleEl.textContent){
      musicTitle=titleEl.textContent.trim();
    }
    if(audioEl&&audioEl.src){
      var src=audioEl.getAttribute('src')||'';
      if(src&&src!==''){
        currentSrc=src;
      }
    }
  }

  function updateBtn(){
    if(!btn)return;
    if(playing){
      btn.textContent='❚❚';
      btn.style.borderColor='var(--crystal)';
    }else{
      btn.textContent='♪';
      btn.style.borderColor='rgba(0,212,200,0.3)';
    }
  }

  initPlayer();

  btn.addEventListener('click',function(){
    if(!playerReady)return;
    playerFrame.contentWindow.postMessage({type:'toggle'},'*');
  });
})();
