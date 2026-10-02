(function(){
var field=document.getElementById('field'),menu=document.getElementById('menu'),
scoreEl=document.getElementById('score'),timeEl=document.getElementById('time'),
comboEl=document.getElementById('combo'),msg=document.getElementById('msg'),bestEl=document.getElementById('best');
var score=0,time=45,combo=0,lastPick=0,spawner,clock,running=false,best=0;
try{best=+localStorage.getItem('bubblePickBest')||0}catch(e){}
bestEl.textContent=best;

function spawn(){
  var gold=Math.random()<0.07, size=gold?44:Math.round(36+Math.random()*70);
  var b=document.createElement('div');
  b.className='b'+(gold?' gold':'');
  b.style.width=b.style.height=size+'px';
  b.style.left=Math.random()*(field.clientWidth-size)+'px';
  b.style.setProperty('--dx',(Math.random()*80-40)+'px');
  b.style.animationDuration=(gold?4:5+Math.random()*4)+'s';
  b.dataset.pts=gold?25:Math.max(1,Math.round(12-size/10));
  b.addEventListener('pointerdown',pick);
  b.addEventListener('animationend',function(e){if(e.animationName==='rise')b.remove()});
  field.appendChild(b);
}
function pick(e){
  var b=e.currentTarget; if(!running||b.classList.contains('pop'))return;
  var now=Date.now(); combo=(now-lastPick<1200)?combo+1:1; lastPick=now;
  var pts=+b.dataset.pts+Math.floor(combo/3);
  score+=pts; scoreEl.textContent=score;
  comboEl.textContent=combo>=3?'Combo x'+combo:'';
  var r=b.getBoundingClientRect(),t=document.createElement('div');
  t.className='plus';t.textContent='+'+pts;t.style.left=r.left+r.width/2-10+'px';t.style.top=r.top+'px';
  field.appendChild(t);setTimeout(function(){t.remove()},700);
  b.style.transform=getComputedStyle(b).transform==='none'?'':getComputedStyle(b).transform;
  var tr=getComputedStyle(b).transform; b.style.animation='none'; b.style.transform=tr;
  b.classList.add('pop'); b.style.animation=''; setTimeout(function(){b.remove()},260);
}
function start(){
  field.innerHTML='';score=0;time=45;combo=0;running=true;
  scoreEl.textContent=0;timeEl.textContent=time;comboEl.textContent='';
  menu.classList.add('hide');
  for(var i=0;i<6;i++)spawn();
  spawner=setInterval(spawn,520);
  clock=setInterval(function(){
    time--;timeEl.textContent=time;
    if(Date.now()-lastPick>1200)comboEl.textContent='';
    if(time<=0)end();
  },1000);
}
function end(){
  running=false;clearInterval(spawner);clearInterval(clock);
  var rec=score>best;
  if(rec){best=score;try{localStorage.setItem('bubblePickBest',best)}catch(e){}}
  bestEl.textContent=best;
  msg.textContent=(rec?'New best! ':'Time is up. ')+'You picked '+score+' points.';
  document.getElementById('go').textContent='Play again';
  menu.classList.remove('hide');
}
document.getElementById('go').addEventListener('click',start);
})();
