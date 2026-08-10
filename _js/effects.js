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
  var STORAGE_KEY='bs_player';

  var btn=document.getElementById('musicToggle');
  var titleEl=document.getElementById('musicTitle');
  var audioEl=document.getElementById('bgMusic');
  if(!btn)return;

  var playerFrame=null;
  var playing=false;
  var playerReady=false;
  var currentSrc=musicSrc;

  // 初始化隐藏的 iframe 播放器
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
          // 恢复之前保存的播放状态
          try{
            var saved=sessionStorage.getItem(STORAGE_KEY);
            if(saved){
              var state=JSON.parse(saved);
              if(state.playing){
                playerFrame.contentWindow.postMessage({type:'setSrc',src:state.src||currentSrc},'*');
                setTimeout(function(){
                  playerFrame.contentWindow.postMessage({type:'play'},'*');
                  playing=true;
                  updateBtn();
                },150);
              } else {
                playerFrame.contentWindow.postMessage({type:'setSrc',src:state.src||currentSrc},'*');
              }
            } else {
              playerFrame.contentWindow.postMessage({type:'setSrc',src:currentSrc},'*');
            }
          }catch(ex){
            playerFrame.contentWindow.postMessage({type:'setSrc',src:currentSrc},'*');
          }
          break;
        case 'playing':
          playing=e.data.playing;
          updateBtn();
          saveState();
          break;
        case 'state':
          playing=e.data.playing;
          updateBtn();
          break;
      }
    });
  }

  // 从页面 DOM 同步音乐信息
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

  function saveState(){
    try{
      sessionStorage.setItem(STORAGE_KEY,JSON.stringify({
        playing:playing,
        src:currentSrc
      }));
    }catch(ex){}
  }

  initPlayer();

  btn.addEventListener('click',function(){
    if(!playerReady)return;
    playerFrame.contentWindow.postMessage({type:'toggle'},'*');
  });
})();
