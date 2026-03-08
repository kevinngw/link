(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function i(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=i(n);fetch(n.href,s)}})();const Z="modulepreload",Q=function(t){return"/link/"+t},I={},tt=function(e,i,a){let n=Promise.resolve();if(i&&i.length>0){let m=function(u){return Promise.all(u.map(c=>Promise.resolve(c).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var l=m;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),r=d?.nonce||d?.getAttribute("nonce");n=m(i.map(u=>{if(u=Q(u),u in I)return;I[u]=!0;const c=u.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${p}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":Z,c||(f.as="script"),f.crossOrigin="",f.href=u,r&&f.setAttribute("nonce",r),document.head.appendChild(f),c)return new Promise((g,y)=>{f.addEventListener("load",g),f.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(d){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=d,window.dispatchEvent(r),!r.defaultPrevented)throw d}return n.then(d=>{for(const r of d||[])r.status==="rejected"&&s(r.reason);return e().catch(s)})};function et(t={}){const{immediate:e=!1,onNeedRefresh:i,onOfflineReady:a,onRegistered:n,onRegisteredSW:s,onRegisterError:l}=t;let d,r;const m=async(c=!0)=>{await r};async function u(){if("serviceWorker"in navigator){if(d=await tt(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/link/sw.js",{scope:"/link/",type:"classic"})).catch(c=>{l?.(c)}),!d)return;d.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),d.addEventListener("installed",c=>{c.isUpdate||a?.()}),d.register({immediate:e}).then(c=>{s?s("/link/sw.js",c):n?.(c)}).catch(c=>{l?.(c)})}}return r=u(),m}const nt="./link-data.json",it="https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST",at="https://api.pugetsound.onebusaway.org/api/where",st="TEST",ot=2e4,k=3,rt=800,ct=1100,P="link-pulse-theme",lt={100479:/100479/,"2LINE":/2LINE/},o={fetchedAt:"",error:"",activeTab:"map",activeLineId:"100479",compactLayout:!1,theme:"dark",currentDialogStationId:"",lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1};et({immediate:!0});document.querySelector("#app").innerHTML=`
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
`;const w=document.querySelector("#board"),C=[...document.querySelectorAll(".tab-button")],B=document.querySelector("#theme-toggle"),$=document.querySelector("#status-pill"),N=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),dt=document.querySelector("#dialog-title"),ut=document.querySelector("#dialog-close"),T=document.querySelector("#arrivals-nb"),E=document.querySelector("#arrivals-sb");ut.addEventListener("click",()=>F());h.addEventListener("click",t=>{t.target===h&&F()});h.addEventListener("close",()=>{o.isSyncingFromUrl||H()});C.forEach(t=>{t.addEventListener("click",()=>{o.activeTab=t.dataset.tab,v()})});B.addEventListener("click",()=>{q(o.theme==="dark"?"light":"dark"),v()});function A(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function mt(){const t=window.localStorage.getItem(P);return t==="light"||t==="dark"?t:"dark"}function q(t){o.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(P,t)}function L(){const t=window.visualViewport?.width??window.innerWidth,e=Math.min(window.innerWidth,t);o.compactLayout=e<=ct}function S(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function pt(t,e,i){return Math.max(e,Math.min(t,i))}function ft(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function ht(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),i=t%60;return e>0?`${e}m ${i}s`:`${i}s`}function vt(t){return new Promise(e=>window.setTimeout(e,t))}function gt(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function O(t,e){for(let i=0;i<=k;i+=1){const a=await fetch(t,{cache:"no-store"});let n=null;try{n=await a.json()}catch{n=null}const s=a.status===429||gt(n);if(a.ok&&!s)return n;if(i===k||!s)throw n?.text?new Error(n.text):new Error(`${e} request failed with ${a.status}`);const l=rt*2**i;await vt(l)}throw new Error(`${e} request failed`)}function yt(t){const e=[...t.stops].sort((c,p)=>p.sequence-c.sequence),i=48,a=44,n=28,s=88,l=122,d=a+n+(e.length-1)*i,r=new Map,m=e.map((c,p)=>{const f={...c,label:A(c.name),y:a+p*i,index:p,isTerminal:p===0||p===e.length-1};r.set(c.id,p);for(const g of t.stationAliases?.[c.id]??[])r.set(g,p),r.set(`40_${g}`,p);return r.set(`40_${c.id}`,p),f});let u=0;for(let c=0;c<m.length;c+=1)m[c].cumulativeMinutes=u,u+=c<m.length-1?m[c].segmentMinutes:0;return{totalMinutes:u,height:d,labelX:l,stationGap:i,stationIndexByStopId:r,stations:m,trackX:s}}function bt(t,e,i){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":/Lynnwood City Center|Downtown Redmond/.test(i)?"▲":/Federal Way Downtown|South Bellevue/.test(i)?"▼":"•"}function U(t,e){const i=`_${t}_`,a=e.lastIndexOf(i);return a===-1?"":e.slice(a+i.length).replace(/\.\d+$/,"")}function wt(t){const e=t.tripStatus??{},i=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const a=e.nextStopTimeOffset??0,n=e.scheduleDeviation??0,s=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return i==="approaching"||s&&Math.abs(a)<=90?"ARR":n>=120?"DELAY":"OK"}function St(t,e,i){const a=t.tripStatus?.activeTripId??"";if(!lt[e.id].test(a))return null;const n=t.tripStatus?.closestStop,s=t.tripStatus?.nextStop,l=i.stationIndexByStopId.get(n),d=i.stationIndexByStopId.get(s);if(l==null&&d==null)return null;let r=l??d,m=d??l;if(r>m){const J=r;r=m,m=J}const u=i.stations[r],c=i.stations[m],p=t.tripStatus?.closestStopTimeOffset??0,f=t.tripStatus?.nextStopTimeOffset??0,g=U(e.id,a),y=e.directionLookup?.[g],V=y==="1"?"▲":y==="0"?"▼":bt(l,d,a);let b=0;r!==m&&p<0&&f>0&&(b=pt(Math.abs(p)/(Math.abs(p)+f),0,1));const Y=u.y+(c.y-u.y)*b,z=r!==m?u.segmentMinutes:0,G=u.cumulativeMinutes+z*b;return{id:t.vehicleId,label:t.vehicleId.replace(/^40_/,""),directionSymbol:V,fromLabel:u.label,minutePosition:G,progress:b,serviceStatus:wt(t),toLabel:c.label,y:Y,currentLabel:u.label,nextLabel:c.label,status:t.tripStatus?.status??"",closestStop:n,nextStop:s,closestOffset:p,nextOffset:f,rawVehicle:t}}function W(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function Lt(){return o.lines.flatMap(t=>(o.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function M(){return!o.compactLayout||o.lines.length<2?"":`<section class="line-switcher">${o.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===o.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function R(t,e=!1){const i=Date.now(),a=n=>{const s=n.arrivalTime,l=Math.floor((s-i)/1e3),d=ht(l);return`
      <div class="arrival-item">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${n.lineColor};">${n.lineToken}</span>
          <span class="arrival-vehicle">${n.lineName} Train ${n.vehicleId}</span>
        </span>
        <span class="arrival-time">${d}</span>
      </div>
    `};if(e){T.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',E.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>';return}T.innerHTML=t.nb.length?t.nb.map(a).join(""):'<div class="arrival-item muted">No upcoming trains</div>',E.innerHTML=t.sb.length?t.sb.map(a).join(""):'<div class="arrival-item muted">No upcoming trains</div>'}function j(t,e){const i=new Set(e.stationAliases?.[t.id]??[]);i.add(t.id);const a=new Set;for(const s of i){const l=s.startsWith("40_")?s:`40_${s}`;a.add(l)}const n=t.id.replace(/-T\d+$/,"");return a.add(n.startsWith("40_")?n:`40_${n}`),[...a]}function $t(t){const e=o.lines.map(i=>{const a=i.stops.find(n=>n.id===t.id);return a?{line:i,station:a}:null}).filter(Boolean);return e.length>0?e:o.lines.map(i=>{const a=i.stops.find(n=>n.name===t.name);return a?{line:i,station:a}:null}).filter(Boolean)}function Tt(t){if(!t)return null;const e=t.trim().toLowerCase();for(const i of o.lines)for(const a of i.stops){const n=new Set([a.id,`40_${a.id}`,a.name,A(a.name),S(a.name),S(A(a.name))]);for(const s of i.stationAliases?.[a.id]??[])n.add(s),n.add(`40_${s}`),n.add(S(s));if([...n].some(s=>String(s).toLowerCase()===e))return a}return null}function Et(t){const e=new URL(window.location.href);e.searchParams.set("station",S(t.name)),window.history.pushState({},"",e)}function H(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function F(){o.currentDialogStationId="",h.open?h.close():H()}async function D(){const t=new URL(window.location.href).searchParams.get("station"),e=Tt(t);o.isSyncingFromUrl=!0;try{if(!e){o.currentDialogStationId="",h.open&&h.close();return}if(o.activeTab="map",v(),o.currentDialogStationId===e.id&&h.open)return;await X(e,!1)}finally{o.isSyncingFromUrl=!1}}function At(t,e){const i=U(e.id,t.tripId??""),a=e.directionLookup?.[i];if(a==="1")return"nb";if(a==="0")return"sb";const n=t.tripHeadsign??"";return/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function It(t){return`40_${t.id}`}async function kt(t){const e=`${at}/arrivals-and-departures-for-stop/${t}.json?key=${st}&minutesAfter=120`,i=await O(e,"Arrivals");if(i.code!==200)throw new Error(i.text||`Arrivals request failed for ${t}`);return i.data?.entry?.arrivalsAndDepartures??[]}async function K(t){const e=[...new Set(t)],i=await Promise.allSettled(e.map(n=>kt(n))),a=[];for(const n of i)n.status==="fulfilled"&&a.push(...n.value);return a}function Mt(t,e){const i=Date.now(),a=new Set,n={nb:[],sb:[]};for(const s of t){if(s.routeId!==It(e))continue;const l=s.predictedArrivalTime||s.scheduledArrivalTime;if(!l||l<=i)continue;const d=At(s,e);if(!d)continue;const r=`${s.tripId}:${s.stopId}:${l}`;a.has(r)||(a.add(r),n[d].push({vehicleId:(s.vehicleId||"").replace(/^40_/,"")||"--",arrivalTime:l,tripId:s.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0]}))}return n.nb.sort((s,l)=>s.arrivalTime-l.arrivalTime),n.sb.sort((s,l)=>s.arrivalTime-l.arrivalTime),n.nb=n.nb.slice(0,4),n.sb=n.sb.slice(0,4),n}async function Rt(t,e,i=null){const a=`${e.id}:${t.id}`,n=o.arrivalsCache.get(a);if(n&&Date.now()-n.fetchedAt<ot)return n.value;const s=j(t,e),l=i??await K(s),d=Mt(l,e);return o.arrivalsCache.set(a,{fetchedAt:Date.now(),value:d}),d}function Dt(t){const e={nb:[],sb:[]};for(const i of t)e.nb.push(...i.nb),e.sb.push(...i.sb);return e.nb.sort((i,a)=>i.arrivalTime-a.arrivalTime),e.sb.sort((i,a)=>i.arrivalTime-a.arrivalTime),e}async function X(t,e=!0){dt.textContent=t.name,o.currentDialogStationId=t.id;const i=o.activeDialogRequest+1;o.activeDialogRequest=i,R({nb:[],sb:[]},!0),e&&Et(t),h.showModal();try{const a=$t(t),n=a.flatMap(({station:d,line:r})=>j(d,r)),s=await K(n),l=await Promise.all(a.map(({station:d,line:r})=>Rt(d,r,s)));if(o.activeDialogRequest!==i||!h.open)return;R(Dt(l))}catch(a){if(o.activeDialogRequest!==i||!h.open)return;T.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,E.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function _t(t){const e=o.layouts.get(t.id),i=o.vehiclesByLine.get(t.id)??[],a=i.filter(r=>r.directionSymbol==="▲"),n=i.filter(r=>r.directionSymbol==="▼"),s=e.stations.map((r,m)=>{const u=e.stations[m-1],c=m>0?u.segmentMinutes:"";return`
        <g transform="translate(0, ${r.y})" class="station-group" data-stop-id="${r.id}" style="cursor: pointer;">
          ${m>0?`<text x="0" y="-14" class="segment-time">${c}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${r.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="300" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),l=i.map((r,m)=>`
        <g transform="translate(${e.trackX}, ${r.y+(m%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${m*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),d=(r,m)=>`
    <div class="direction-column">
      <p class="direction-column-title">${r}</p>
      ${m.length?m.sort((u,c)=>u.minutePosition-c.minutePosition).map(u=>`<p class="train-readout"><span class="train-id">${u.label}</span>${W(u)}</p>`).join(""):'<p class="train-readout muted">No trains</p>'}
    </div>
  `;return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <h2>${t.name}</h2>
            <p>${i.length} live trains</p>
          </div>
        </div>
      </header>
      <svg viewBox="0 0 360 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${s}
        ${l}
      </svg>
      <div class="line-readout line-readout-grid">
        ${d("NB",a)}
        ${d("SB",n)}
      </div>
    </article>
  `}function xt(){const t=Lt().sort((a,n)=>a.minutePosition-n.minutePosition);return t.length?(o.compactLayout?o.lines.filter(a=>a.id===o.activeLineId):o.lines).map(a=>{const n=t.filter(r=>r.lineId===a.id),s=n.filter(r=>r.directionSymbol==="▲"),l=n.filter(r=>r.directionSymbol==="▼"),d=(r,m)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${r}</p>
          ${m.length?m.map(u=>`
                      <article class="train-list-item">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${u.lineColor};">${u.lineToken}</span>
                          <div>
                            <p class="train-list-title">${u.lineName} Train ${u.label}</p>
                            <p class="train-list-subtitle">${W(u)}</p>
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
              <span class="line-token" style="--line-color:${a.color};">${a.name[0]}</span>
              <div>
                <h2>${a.name}</h2>
                <p>${n.length} trains in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${d("NB",s)}
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
    `}function _(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{o.activeLineId=e.dataset.lineSwitch,v()})})}function Pt(){o.lines.forEach(t=>{const e=o.layouts.get(t.id),i=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!i)return;i.querySelectorAll(".station-group").forEach(n=>{n.addEventListener("click",()=>{const s=n.dataset.stopId,l=e.stations.find(d=>d.id===s);l&&X(l)})})})}function v(){if(B.textContent=o.theme==="dark"?"Light":"Dark",$.textContent=o.error?"HOLD":"SYNC",$.classList.toggle("status-pill-error",!!o.error),N.textContent=o.error?"Using last successful snapshot":ft(o.fetchedAt),C.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===o.activeTab)),o.activeTab==="map"){w.className="board";const t=o.compactLayout?o.lines.filter(e=>e.id===o.activeLineId):o.lines;w.innerHTML=`${M()}${t.map(_t).join("")}`,_(),Pt();return}if(o.activeTab==="trains"){w.className="board",w.innerHTML=`${M()}${xt()}`,_();return}}async function Ct(){const e=await(await fetch(nt)).json();o.lines=e.lines,o.layouts=new Map(e.lines.map(i=>[i.id,yt(i)]))}async function x(){try{const t=await O(it,"Realtime");o.error="",o.fetchedAt=new Date().toISOString(),o.rawVehicles=t.data.list;for(const e of o.lines){const i=o.layouts.get(e.id),a=t.data.list.map(n=>St(n,e,i)).filter(Boolean);o.vehiclesByLine.set(e.id,a)}}catch(t){o.error="Realtime offline",console.error(t)}v()}async function Bt(){q(mt()),L(),await Ct(),v(),await x(),await D(),window.addEventListener("popstate",()=>{D().catch(console.error)}),window.addEventListener("resize",()=>{const t=o.compactLayout;L(),t!==o.compactLayout&&v()}),window.visualViewport?.addEventListener("resize",()=>{const t=o.compactLayout;L(),t!==o.compactLayout&&v()}),window.setInterval(x,15e3),window.setInterval(v,1e3)}Bt().catch(t=>{$.textContent="FAIL",N.textContent=t.message,console.error(t)});
