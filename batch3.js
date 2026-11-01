/*LIMO:b3:1.0 | requires=b2 */
LimoCut.register({init(L){
const {$,S}=L,d=document,q=s=>d.querySelector(s);
Object.assign(L.T.en,{sV:'Video',sD:'Dubbing',rVoice:'AI voice',rMic:'Record'});
Object.assign(L.T.ar,{sV:'\u0641\u064a\u062f\u064a\u0648',sD:'\u062f\u0628\u0644\u062c\u0629',rVoice:'\u0635\u0648\u062a AI',rMic:'\u062a\u0633\u062c\u064a\u0644'});

const st=d.createElement('style');
st.textContent=`header{position:relative!important;padding:5px 10px;gap:6px;flex-wrap:nowrap}
.logo{font-size:16px}.logo i{width:30px!important;height:30px!important}.logo svg{width:30px;height:30px}
.hr>:not(#exp):not(#hm){display:none!important}#hm{display:inline-flex!important}
#hmenu{display:none;position:absolute;top:100%;inset-inline-end:8px;z-index:25;background:var(--p);border:1px solid var(--ln);border-radius:10px;padding:8px;flex-direction:column;gap:6px;min-width:170px}
#hmenu.open{display:flex}#hmenu>*{display:inline-flex!important}
.seg{display:flex;border:1px solid var(--ln);border-radius:10px;overflow:hidden;flex:none}
.seg button{border:0;background:transparent;padding:6px 12px;cursor:pointer;font-size:13px;color:var(--t2)}
.seg button.on{background:var(--lm);color:#04101a;font-weight:700}
body:not(.dub) #rail [data-m=d],body.dub #rail [data-m=v]{display:none!important}
main{gap:6px!important}.card{padding:8px}
.tools{margin-top:6px!important;gap:4px}.tools .btn{padding:4px 8px;font-size:12px}.bar{margin-top:6px!important}
.lane{height:28px!important}.lhh{height:28px!important}.lane .cl{font-size:10px}
#ctr>.card:nth-child(2)>.ttl,#ctr>.card:nth-child(2)>.sub{display:none}
@media(orientation:landscape) and (min-width:640px){#tlw{max-height:26dvh!important}}
@media not all and (orientation:landscape) and (min-width:640px){
main{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto auto auto minmax(110px,1fr);height:calc(100dvh - var(--hh,44px));padding:6px!important;overflow:auto;margin:0}
#ctr>.card:nth-child(1){grid-row:1;order:0}#ctr>.card:nth-child(2){grid-row:2;order:0}#rail{grid-row:3;order:0}
.toolc{grid-row:4;order:0;max-height:none!important;min-height:0}#tlw{max-height:22dvh!important}}`;
d.head.append(st);

/* header: logo + studio switch + export; everything else in one menu */
const hdr=q('header'),hr=$('exp').parentElement;
const seg=d.createElement('div');seg.className='seg';
seg.innerHTML='<button id="sV" class="on" data-i="sV"></button><button id="sD" data-i="sD"></button>';
hdr.insertBefore(seg,hr);
const menu=d.createElement('div');menu.id='hmenu';
['trial','mode','autoB','aib','upd','lang'].forEach(i=>{const e=$(i);if(e)menu.append(e)});
hdr.append(menu);
$('hm').onclick=e=>{e.stopPropagation();menu.classList.toggle('open')};
d.addEventListener('click',e=>{if(!menu.contains(e.target))menu.classList.remove('open')});

/* studio switch: same project, different tool set */
const rail=$('rail'),M={media:'vd',fx:'v',snd:'d',text:'v',stk:'v',ai:'vd',color:'v',mix:'d'};
[...rail.children].forEach(b=>b.dataset.m=M[b.dataset.k]||'vd');
const add=(ic,t,m,fn)=>{const b=d.createElement('button');b.dataset.m=m;b.innerHTML='<b>'+ic+'</b><span data-i="'+t+'"></span>';b.onclick=fn;rail.append(b)};
add('\u{1F5E3}\uFE0F','rVoice','d',()=>{$('aib').click();const t=q('#aitabs [data-t=dub]');if(t)t.click()});
add('\u{1F399}\uFE0F','rMic','d',()=>$('mic').click());
function studio(m){d.body.classList.toggle('dub',m==='d');$('sV').classList.toggle('on',m!=='d');$('sD').classList.toggle('on',m==='d');
  localStorage.setItem('lc_studio',m);const cur=localStorage.getItem('lc_pane')||'media';
  const ok={d:['media','snd','mix','ai'],v:['media','fx','text','stk','ai','color']}[m==='d'?'d':'v'];
  const k=ok.includes(cur)?cur:(m==='d'?'mix':'media');const b=[...rail.children].find(x=>x.dataset.k===k);if(b)b.click();
  dispatchEvent(new Event('resize'))}
$('sV').onclick=()=>studio('v');$('sD').onclick=()=>studio('d');

L.applyLang();studio(localStorage.getItem('lc_studio')||'v');
}});
