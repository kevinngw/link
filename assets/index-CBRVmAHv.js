(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function a(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=a(n);fetch(n.href,i)}})();const Z="modulepreload",Q=function(t){return"/link/"+t},I={},tt=function(e,a,s){let n=Promise.resolve();if(a&&a.length>0){let m=function(u){return Promise.all(u.map(c=>Promise.resolve(c).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var l=m;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),r=d?.nonce||d?.getAttribute("nonce");n=m(a.map(u=>{if(u=Q(u),u in I)return;I[u]=!0;const c=u.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${p}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":Z,c||(f.as="script"),f.crossOrigin="",f.href=u,r&&f.setAttribute("nonce",r),document.head.appendChild(f),c)return new Promise((g,y)=>{f.addEventListener("load",g),f.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(d){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=d,window.dispatchEvent(r),!r.defaultPrevented)throw d}return n.then(d=>{for(const r of d||[])r.status==="rejected"&&i(r.reason);return e().catch(i)})};function et(t={}){const{immediate:e=!1,onNeedRefresh:a,onOfflineReady:s,onRegistered:n,onRegisteredSW:i,onRegisterError:l}=t;let d,r;const m=async(c=!0)=>{await r};async function u(){if("serviceWorker"in navigator){if(d=await tt(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/link/sw.js",{scope:"/link/",type:"classic"})).catch(c=>{l?.(c)}),!d)return;d.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),d.addEventListener("installed",c=>{c.isUpdate||s?.()}),d.register({immediate:e}).then(c=>{i?i("/link/sw.js",c):n?.(c)}).catch(c=>{l?.(c)})}}return r=u(),m}const nt="./link-data.json",at="https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST",st="https://api.pugetsound.onebusaway.org/api/where",it="TEST",ot=2e4,A=3,rt=800,P="link-pulse-theme",ct={100479:/100479/,"2LINE":/2LINE/},o={fetchedAt:"",error:"",activeTab:"map",activeLineId:"100479",compactLayout:!1,theme:"dark",currentDialogStationId:"",lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1};et({immediate:!0});document.querySelector("#app").innerHTML=`
  <main class="screen">
    <header class="screen-header">
      <div>
        <p class="screen-kicker">SEATTLE LIGHT RAIL</p>
        <h1>LINK PULSE</h1>
      </div>
      <div class="screen-meta">
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">Light</button>
        <p id="status-pill" class="status-pill">SYNC</p>
        <p id="updated-at" class="updated-at">Waiting for snapshot</p>
      </div>
    </header>
    <section class="tab-bar" aria-label="Board views">
      <button class="tab-button is-active" data-tab="map" type="button">Map</button>
      <button class="tab-button" data-tab="trains" type="button">Trains</button>
    </section>
    <section id="board" class="board"></section>
  </main>
  <dialog id="station-dialog" class="station-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <h3 id="dialog-title">Station</h3>
        <button id="dialog-close" class="dialog-close">&times;</button>
      </header>
      <div class="dialog-body">
        <div class="arrivals-section">
          <h4 class="arrivals-title">Northbound (▲)</h4>
          <div id="arrivals-nb" class="arrivals-list"></div>
        </div>
        <div class="arrivals-section">
          <h4 class="arrivals-title">Southbound (▼)</h4>
          <div id="arrivals-sb" class="arrivals-list"></div>
        </div>
      </div>
    </div>
  </dialog>
`;const S=document.querySelector("#board"),C=[...document.querySelectorAll(".tab-button")],B=document.querySelector("#theme-toggle"),L=document.querySelector("#status-pill"),N=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),lt=document.querySelector("#dialog-title"),dt=document.querySelector("#dialog-close"),$=document.querySelector("#arrivals-nb"),T=document.querySelector("#arrivals-sb");dt.addEventListener("click",()=>W());h.addEventListener("click",t=>{t.target===h&&W()});h.addEventListener("close",()=>{o.isSyncingFromUrl||F()});C.forEach(t=>{t.addEventListener("click",()=>{o.activeTab=t.dataset.tab,v()})});B.addEventListener("click",()=>{q(o.theme==="dark"?"light":"dark"),v()});function E(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function ut(){const t=window.localStorage.getItem(P);return t==="light"||t==="dark"?t:"dark"}function q(t){o.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(P,t)}function k(){o.compactLayout=window.matchMedia("(max-width: 900px)").matches}function w(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function mt(t,e,a){return Math.max(e,Math.min(t,a))}function pt(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function ft(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),a=t%60;return e>0?`${e}m ${a}s`:`${a}s`}function ht(t){return new Promise(e=>window.setTimeout(e,t))}function vt(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function O(t,e){for(let a=0;a<=A;a+=1){const s=await fetch(t,{cache:"no-store"});let n=null;try{n=await s.json()}catch{n=null}const i=s.status===429||vt(n);if(s.ok&&!i)return n;if(a===A||!i)throw n?.text?new Error(n.text):new Error(`${e} request failed with ${s.status}`);const l=rt*2**a;await ht(l)}throw new Error(`${e} request failed`)}function gt(t){const e=[...t.stops].sort((c,p)=>p.sequence-c.sequence),a=48,s=44,n=28,i=88,l=122,d=s+n+(e.length-1)*a,r=new Map,m=e.map((c,p)=>{const f={...c,label:E(c.name),y:s+p*a,index:p,isTerminal:p===0||p===e.length-1};r.set(c.id,p);for(const g of t.stationAliases?.[c.id]??[])r.set(g,p),r.set(`40_${g}`,p);return r.set(`40_${c.id}`,p),f});let u=0;for(let c=0;c<m.length;c+=1)m[c].cumulativeMinutes=u,u+=c<m.length-1?m[c].segmentMinutes:0;return{totalMinutes:u,height:d,labelX:l,stationGap:a,stationIndexByStopId:r,stations:m,trackX:i}}function yt(t,e,a){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":/Lynnwood City Center|Downtown Redmond/.test(a)?"▲":/Federal Way Downtown|South Bellevue/.test(a)?"▼":"•"}function U(t,e){const a=`_${t}_`,s=e.lastIndexOf(a);return s===-1?"":e.slice(s+a.length).replace(/\.\d+$/,"")}function bt(t){const e=t.tripStatus??{},a=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const s=e.nextStopTimeOffset??0,n=e.scheduleDeviation??0,i=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return a==="approaching"||i&&Math.abs(s)<=90?"ARR":n>=120?"DELAY":"OK"}function St(t,e,a){const s=t.tripStatus?.activeTripId??"";if(!ct[e.id].test(s))return null;const n=t.tripStatus?.closestStop,i=t.tripStatus?.nextStop,l=a.stationIndexByStopId.get(n),d=a.stationIndexByStopId.get(i);if(l==null&&d==null)return null;let r=l??d,m=d??l;if(r>m){const J=r;r=m,m=J}const u=a.stations[r],c=a.stations[m],p=t.tripStatus?.closestStopTimeOffset??0,f=t.tripStatus?.nextStopTimeOffset??0,g=U(e.id,s),y=e.directionLookup?.[g],Y=y==="1"?"▲":y==="0"?"▼":yt(l,d,s);let b=0;r!==m&&p<0&&f>0&&(b=mt(Math.abs(p)/(Math.abs(p)+f),0,1));const z=u.y+(c.y-u.y)*b,G=r!==m?u.segmentMinutes:0,V=u.cumulativeMinutes+G*b;return{id:t.vehicleId,label:t.vehicleId.replace(/^40_/,""),directionSymbol:Y,fromLabel:u.label,minutePosition:V,progress:b,serviceStatus:bt(t),toLabel:c.label,y:z,currentLabel:u.label,nextLabel:c.label,status:t.tripStatus?.status??"",closestStop:n,nextStop:i,closestOffset:p,nextOffset:f,rawVehicle:t}}function j(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function wt(){return o.lines.flatMap(t=>(o.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function M(){return!o.compactLayout||o.lines.length<2?"":`<section class="line-switcher">${o.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===o.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function R(t,e=!1){const a=Date.now(),s=n=>{const i=n.arrivalTime,l=Math.floor((i-a)/1e3),d=ft(l);return`
      <div class="arrival-item">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${n.lineColor};">${n.lineToken}</span>
          <span class="arrival-vehicle">${n.lineName} Train ${n.vehicleId}</span>
        </span>
        <span class="arrival-time">${d}</span>
      </div>
    `};if(e){$.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',T.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>';return}$.innerHTML=t.nb.length?t.nb.map(s).join(""):'<div class="arrival-item muted">No upcoming trains</div>',T.innerHTML=t.sb.length?t.sb.map(s).join(""):'<div class="arrival-item muted">No upcoming trains</div>'}function H(t,e){const a=new Set(e.stationAliases?.[t.id]??[]);a.add(t.id);const s=new Set;for(const i of a){const l=i.startsWith("40_")?i:`40_${i}`;s.add(l)}const n=t.id.replace(/-T\d+$/,"");return s.add(n.startsWith("40_")?n:`40_${n}`),[...s]}function Lt(t){const e=o.lines.map(a=>{const s=a.stops.find(n=>n.id===t.id);return s?{line:a,station:s}:null}).filter(Boolean);return e.length>0?e:o.lines.map(a=>{const s=a.stops.find(n=>n.name===t.name);return s?{line:a,station:s}:null}).filter(Boolean)}function $t(t){if(!t)return null;const e=t.trim().toLowerCase();for(const a of o.lines)for(const s of a.stops){const n=new Set([s.id,`40_${s.id}`,s.name,E(s.name),w(s.name),w(E(s.name))]);for(const i of a.stationAliases?.[s.id]??[])n.add(i),n.add(`40_${i}`),n.add(w(i));if([...n].some(i=>String(i).toLowerCase()===e))return s}return null}function Tt(t){const e=new URL(window.location.href);e.searchParams.set("station",w(t.name)),window.history.pushState({},"",e)}function F(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function W(){o.currentDialogStationId="",h.open?h.close():F()}async function x(){const t=new URL(window.location.href).searchParams.get("station"),e=$t(t);o.isSyncingFromUrl=!0;try{if(!e){o.currentDialogStationId="",h.open&&h.close();return}if(o.activeTab="map",v(),o.currentDialogStationId===e.id&&h.open)return;await X(e,!1)}finally{o.isSyncingFromUrl=!1}}function Et(t,e){const a=U(e.id,t.tripId??""),s=e.directionLookup?.[a];if(s==="1")return"nb";if(s==="0")return"sb";const n=t.tripHeadsign??"";return/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function It(t){return`40_${t.id}`}async function At(t){const e=`${st}/arrivals-and-departures-for-stop/${t}.json?key=${it}&minutesAfter=120`,a=await O(e,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${t}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function K(t){const e=[...new Set(t)],a=await Promise.allSettled(e.map(n=>At(n))),s=[];for(const n of a)n.status==="fulfilled"&&s.push(...n.value);return s}function kt(t,e){const a=Date.now(),s=new Set,n={nb:[],sb:[]};for(const i of t){if(i.routeId!==It(e))continue;const l=i.predictedArrivalTime||i.scheduledArrivalTime;if(!l||l<=a)continue;const d=Et(i,e);if(!d)continue;const r=`${i.tripId}:${i.stopId}:${l}`;s.has(r)||(s.add(r),n[d].push({vehicleId:(i.vehicleId||"").replace(/^40_/,"")||"--",arrivalTime:l,tripId:i.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0]}))}return n.nb.sort((i,l)=>i.arrivalTime-l.arrivalTime),n.sb.sort((i,l)=>i.arrivalTime-l.arrivalTime),n.nb=n.nb.slice(0,4),n.sb=n.sb.slice(0,4),n}async function Mt(t,e,a=null){const s=`${e.id}:${t.id}`,n=o.arrivalsCache.get(s);if(n&&Date.now()-n.fetchedAt<ot)return n.value;const i=H(t,e),l=a??await K(i),d=kt(l,e);return o.arrivalsCache.set(s,{fetchedAt:Date.now(),value:d}),d}function Rt(t){const e={nb:[],sb:[]};for(const a of t)e.nb.push(...a.nb),e.sb.push(...a.sb);return e.nb.sort((a,s)=>a.arrivalTime-s.arrivalTime),e.sb.sort((a,s)=>a.arrivalTime-s.arrivalTime),e}async function X(t,e=!0){lt.textContent=t.name,o.currentDialogStationId=t.id;const a=o.activeDialogRequest+1;o.activeDialogRequest=a,R({nb:[],sb:[]},!0),e&&Tt(t),h.showModal();try{const s=Lt(t),n=s.flatMap(({station:d,line:r})=>H(d,r)),i=await K(n),l=await Promise.all(s.map(({station:d,line:r})=>Mt(d,r,i)));if(o.activeDialogRequest!==a||!h.open)return;R(Rt(l))}catch(s){if(o.activeDialogRequest!==a||!h.open)return;$.innerHTML=`<div class="arrival-item muted">${s.message}</div>`,T.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function xt(t){const e=o.layouts.get(t.id),a=o.vehiclesByLine.get(t.id)??[],s=a.filter(r=>r.directionSymbol==="▲"),n=a.filter(r=>r.directionSymbol==="▼"),i=e.stations.map((r,m)=>{const u=e.stations[m-1],c=m>0?u.segmentMinutes:"";return`
        <g transform="translate(0, ${r.y})" class="station-group" data-stop-id="${r.id}" style="cursor: pointer;">
          ${m>0?`<text x="0" y="-14" class="segment-time">${c}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${r.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="300" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),l=a.map((r,m)=>`
        <g transform="translate(${e.trackX}, ${r.y+(m%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${m*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),d=(r,m)=>`
    <div class="direction-column">
      <p class="direction-column-title">${r}</p>
      ${m.length?m.sort((u,c)=>u.minutePosition-c.minutePosition).map(u=>`<p class="train-readout"><span class="train-id">${u.label}</span>${j(u)}</p>`).join(""):'<p class="train-readout muted">No trains</p>'}
    </div>
  `;return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <h2>${t.name}</h2>
            <p>${a.length} live trains</p>
          </div>
        </div>
      </header>
      <svg viewBox="0 0 360 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${i}
        ${l}
      </svg>
      <div class="line-readout line-readout-grid">
        ${d("NB",s)}
        ${d("SB",n)}
      </div>
    </article>
  `}function Dt(){const t=wt().sort((s,n)=>s.minutePosition-n.minutePosition);return t.length?(o.compactLayout?o.lines.filter(s=>s.id===o.activeLineId):o.lines).map(s=>{const n=t.filter(r=>r.lineId===s.id),i=n.filter(r=>r.directionSymbol==="▲"),l=n.filter(r=>r.directionSymbol==="▼"),d=(r,m)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${r}</p>
          ${m.length?m.map(u=>`
                      <article class="train-list-item">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${u.lineColor};">${u.lineToken}</span>
                          <div>
                            <p class="train-list-title">${u.lineName} Train ${u.label}</p>
                            <p class="train-list-subtitle">${j(u)}</p>
                            <p class="train-list-status train-list-status-${u.serviceStatus.toLowerCase()}">${u.serviceStatus}</p>
                          </div>
                        </div>
                      </article>
                    `).join(""):'<p class="train-readout muted">No trains</p>'}
        </div>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${s.color};">${s.name[0]}</span>
              <div>
                <h2>${s.name}</h2>
                <p>${n.length} trains in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${d("NB",i)}
            ${d("SB",l)}
          </div>
        </article>
      `}).join(""):`
      <section class="line-card">
        <header class="panel-header">
          <h2>Active Trains</h2>
          <p>No live trains</p>
        </header>
      </section>
    `}function D(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{o.activeLineId=e.dataset.lineSwitch,v()})})}function _t(){o.lines.forEach(t=>{const e=o.layouts.get(t.id),a=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.stopId,l=e.stations.find(d=>d.id===i);l&&X(l)})})})}function v(){if(B.textContent=o.theme==="dark"?"Light":"Dark",L.textContent=o.error?"HOLD":"SYNC",L.classList.toggle("status-pill-error",!!o.error),N.textContent=o.error?"Using last successful snapshot":pt(o.fetchedAt),C.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===o.activeTab)),o.activeTab==="map"){S.className="board";const t=o.compactLayout?o.lines.filter(e=>e.id===o.activeLineId):o.lines;S.innerHTML=`${M()}${t.map(xt).join("")}`,D(),_t();return}if(o.activeTab==="trains"){S.className="board",S.innerHTML=`${M()}${Dt()}`,D();return}}async function Pt(){const e=await(await fetch(nt)).json();o.lines=e.lines,o.layouts=new Map(e.lines.map(a=>[a.id,gt(a)]))}async function _(){try{const t=await O(at,"Realtime");o.error="",o.fetchedAt=new Date().toISOString(),o.rawVehicles=t.data.list;for(const e of o.lines){const a=o.layouts.get(e.id),s=t.data.list.map(n=>St(n,e,a)).filter(Boolean);o.vehiclesByLine.set(e.id,s)}}catch(t){o.error="Realtime offline",console.error(t)}v()}async function Ct(){q(ut()),k(),await Pt(),v(),await _(),await x(),window.addEventListener("popstate",()=>{x().catch(console.error)}),window.addEventListener("resize",()=>{const t=o.compactLayout;k(),t!==o.compactLayout&&v()}),window.setInterval(_,15e3),window.setInterval(v,1e3)}Ct().catch(t=>{L.textContent="FAIL",N.textContent=t.message,console.error(t)});
