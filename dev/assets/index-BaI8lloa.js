(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();const nt="modulepreload",st=function(t){return"/link/dev/"+t},M={},at=function(e,n,a){let s=Promise.resolve();if(n&&n.length>0){let m=function(u){return Promise.all(u.map(l=>Promise.resolve(l).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};var c=m;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),r=d?.nonce||d?.getAttribute("nonce");s=m(n.map(u=>{if(u=st(u),u in M)return;M[u]=!0;const l=u.endsWith(".css"),f=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${f}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":nt,l||(p.as="script"),p.crossOrigin="",p.href=u,r&&p.setAttribute("nonce",r),document.head.appendChild(p),l)return new Promise((g,y)=>{p.addEventListener("load",g),p.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(d){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=d,window.dispatchEvent(r),!r.defaultPrevented)throw d}return s.then(d=>{for(const r of d||[])r.status==="rejected"&&i(r.reason);return e().catch(i)})};function it(t={}){const{immediate:e=!1,onNeedRefresh:n,onOfflineReady:a,onRegistered:s,onRegisteredSW:i,onRegisterError:c}=t;let d,r;const m=async(l=!0)=>{await r};async function u(){if("serviceWorker"in navigator){if(d=await at(async()=>{const{Workbox:l}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:l}},[]).then(({Workbox:l})=>new l("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(l=>{c?.(l)}),!d)return;d.addEventListener("activated",l=>{(l.isUpdate||l.isExternal)&&window.location.reload()}),d.addEventListener("installed",l=>{l.isUpdate||a?.()}),d.register({immediate:e}).then(l=>{i?i("/link/dev/sw.js",l):s?.(l)}).catch(l=>{c?.(l)})}}return r=u(),m}const ot="./link-data.json",rt="https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST",lt="https://api.pugetsound.onebusaway.org/api/where",ct="TEST",dt=2e4,R=3,ut=800,mt=1100,B="link-pulse-theme",ft={100479:/100479/,"2LINE":/2LINE/},o={fetchedAt:"",error:"",activeTab:"map",activeLineId:"100479",compactLayout:!1,theme:"dark",currentDialogStationId:"",lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1};it({immediate:!0});document.querySelector("#app").innerHTML=`
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
`;const w=document.querySelector("#board"),N=[...document.querySelectorAll(".tab-button")],O=document.querySelector("#theme-toggle"),$=document.querySelector("#status-pill"),q=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),pt=document.querySelector("#dialog-title"),ht=document.querySelector("#dialog-close"),T=document.querySelector("#arrivals-nb"),E=document.querySelector("#arrivals-sb");ht.addEventListener("click",()=>Y());h.addEventListener("click",t=>{t.target===h&&Y()});h.addEventListener("close",()=>{o.isSyncingFromUrl||X()});N.forEach(t=>{t.addEventListener("click",()=>{o.activeTab=t.dataset.tab,v()})});O.addEventListener("click",()=>{U(o.theme==="dark"?"light":"dark"),v()});function I(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function vt(){const t=window.localStorage.getItem(B);return t==="light"||t==="dark"?t:"dark"}function U(t){o.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(B,t)}function L(){const t=window.visualViewport?.width??window.innerWidth,e=Math.min(window.innerWidth,t);o.compactLayout=e<=mt}function S(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function gt(t,e,n){return Math.max(e,Math.min(t,n))}function yt(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function bt(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),n=t%60;return e>0?`${e}m ${n}s`:`${n}s`}function wt(t){return new Promise(e=>window.setTimeout(e,t))}function St(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function W(t,e){for(let n=0;n<=R;n+=1){const a=await fetch(t,{cache:"no-store"});let s=null;try{s=await a.json()}catch{s=null}const i=a.status===429||St(s);if(a.ok&&!i)return s;if(n===R||!i)throw s?.text?new Error(s.text):new Error(`${e} request failed with ${a.status}`);const c=ut*2**n;await wt(c)}throw new Error(`${e} request failed`)}function Lt(t){const e=[...t.stops].sort((l,f)=>f.sequence-l.sequence),n=48,a=44,s=28,i=88,c=122,d=a+s+(e.length-1)*n,r=new Map,m=e.map((l,f)=>{const p={...l,label:I(l.name),y:a+f*n,index:f,isTerminal:f===0||f===e.length-1};r.set(l.id,f);for(const g of t.stationAliases?.[l.id]??[])r.set(g,f),r.set(`40_${g}`,f);return r.set(`40_${l.id}`,f),p});let u=0;for(let l=0;l<m.length;l+=1)m[l].cumulativeMinutes=u,u+=l<m.length-1?m[l].segmentMinutes:0;return{totalMinutes:u,height:d,labelX:c,stationGap:n,stationIndexByStopId:r,stations:m,trackX:i}}function $t(t,e,n){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":/Lynnwood City Center|Downtown Redmond/.test(n)?"▲":/Federal Way Downtown|South Bellevue/.test(n)?"▼":"•"}function j(t,e){const n=`_${t}_`,a=e.lastIndexOf(n);return a===-1?"":e.slice(a+n.length).replace(/\.\d+$/,"")}function Tt(t){const e=t.tripStatus??{},n=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const a=e.nextStopTimeOffset??0,s=e.scheduleDeviation??0,i=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return n==="approaching"||i&&Math.abs(a)<=90?"ARR":s>=120?"DELAY":"OK"}function Et(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const n=Math.round(t/60);let a="status-late-minor";return t>600?a="status-late-severe":t>300&&(a="status-late-moderate"),{text:`+${n} min late`,colorClass:a}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function It(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function H(t){const e=It(t.serviceStatus),n=t.delayInfo.text;return`${e} (${n})`}function At(t,e,n){const a=t.tripStatus?.activeTripId??"";if(!ft[e.id].test(a))return null;const s=t.tripStatus?.closestStop,i=t.tripStatus?.nextStop,c=n.stationIndexByStopId.get(s),d=n.stationIndexByStopId.get(i);if(c==null&&d==null)return null;let r=c??d,m=d??c;if(r>m){const et=r;r=m,m=et}const u=n.stations[r],l=n.stations[m],f=t.tripStatus?.closestStopTimeOffset??0,p=t.tripStatus?.nextStopTimeOffset??0,g=j(e.id,a),y=e.directionLookup?.[g],G=y==="1"?"▲":y==="0"?"▼":$t(c,d,a);let b=0;r!==m&&f<0&&p>0&&(b=gt(Math.abs(f)/(Math.abs(f)+p),0,1));const J=u.y+(l.y-u.y)*b,Z=r!==m?u.segmentMinutes:0,Q=u.cumulativeMinutes+Z*b,A=t.tripStatus?.scheduleDeviation??0,k=t.tripStatus?.predicted??!1,tt=Et(A,k);return{id:t.vehicleId,label:t.vehicleId.replace(/^40_/,""),directionSymbol:G,fromLabel:u.label,minutePosition:Q,progress:b,serviceStatus:Tt(t),toLabel:l.label,y:J,currentLabel:u.label,nextLabel:l.label,status:t.tripStatus?.status??"",closestStop:s,nextStop:i,closestOffset:f,nextOffset:p,scheduleDeviation:A,isPredicted:k,delayInfo:tt,rawVehicle:t}}function F(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function kt(){return o.lines.flatMap(t=>(o.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function x(){return!o.compactLayout||o.lines.length<2?"":`<section class="line-switcher">${o.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===o.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function D(t,e=!1){const n=Date.now(),a=s=>{const i=s.arrivalTime,c=Math.floor((i-n)/1e3),d=bt(c);return`
      <div class="arrival-item">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${s.lineColor};">${s.lineToken}</span>
          <span class="arrival-vehicle">${s.lineName} Train ${s.vehicleId}</span>
        </span>
        <span class="arrival-time">${d}</span>
      </div>
    `};if(e){T.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',E.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>';return}T.innerHTML=t.nb.length?t.nb.map(a).join(""):'<div class="arrival-item muted">No upcoming trains</div>',E.innerHTML=t.sb.length?t.sb.map(a).join(""):'<div class="arrival-item muted">No upcoming trains</div>'}function K(t,e){const n=new Set(e.stationAliases?.[t.id]??[]);n.add(t.id);const a=new Set;for(const i of n){const c=i.startsWith("40_")?i:`40_${i}`;a.add(c)}const s=t.id.replace(/-T\d+$/,"");return a.add(s.startsWith("40_")?s:`40_${s}`),[...a]}function Mt(t){const e=o.lines.map(n=>{const a=n.stops.find(s=>s.id===t.id);return a?{line:n,station:a}:null}).filter(Boolean);return e.length>0?e:o.lines.map(n=>{const a=n.stops.find(s=>s.name===t.name);return a?{line:n,station:a}:null}).filter(Boolean)}function Rt(t){if(!t)return null;const e=t.trim().toLowerCase();for(const n of o.lines)for(const a of n.stops){const s=new Set([a.id,`40_${a.id}`,a.name,I(a.name),S(a.name),S(I(a.name))]);for(const i of n.stationAliases?.[a.id]??[])s.add(i),s.add(`40_${i}`),s.add(S(i));if([...s].some(i=>String(i).toLowerCase()===e))return a}return null}function xt(t){const e=new URL(window.location.href);e.searchParams.set("station",S(t.name)),window.history.pushState({},"",e)}function X(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function Y(){o.currentDialogStationId="",h.open?h.close():X()}async function C(){const t=new URL(window.location.href).searchParams.get("station"),e=Rt(t);o.isSyncingFromUrl=!0;try{if(!e){o.currentDialogStationId="",h.open&&h.close();return}if(o.activeTab="map",v(),o.currentDialogStationId===e.id&&h.open)return;await z(e,!1)}finally{o.isSyncingFromUrl=!1}}function Dt(t,e){const n=j(e.id,t.tripId??""),a=e.directionLookup?.[n];if(a==="1")return"nb";if(a==="0")return"sb";const s=t.tripHeadsign??"";return/Lynnwood|Downtown Redmond/i.test(s)?"nb":/Federal Way|South Bellevue/i.test(s)?"sb":""}function Ct(t){return`40_${t.id}`}async function _t(t){const e=`${lt}/arrivals-and-departures-for-stop/${t}.json?key=${ct}&minutesAfter=120`,n=await W(e,"Arrivals");if(n.code!==200)throw new Error(n.text||`Arrivals request failed for ${t}`);return n.data?.entry?.arrivalsAndDepartures??[]}async function V(t){const e=[...new Set(t)],n=await Promise.allSettled(e.map(s=>_t(s))),a=[];for(const s of n)s.status==="fulfilled"&&a.push(...s.value);return a}function Pt(t,e){const n=Date.now(),a=new Set,s={nb:[],sb:[]};for(const i of t){if(i.routeId!==Ct(e))continue;const c=i.predictedArrivalTime||i.scheduledArrivalTime;if(!c||c<=n)continue;const d=Dt(i,e);if(!d)continue;const r=`${i.tripId}:${i.stopId}:${c}`;a.has(r)||(a.add(r),s[d].push({vehicleId:(i.vehicleId||"").replace(/^40_/,"")||"--",arrivalTime:c,tripId:i.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0]}))}return s.nb.sort((i,c)=>i.arrivalTime-c.arrivalTime),s.sb.sort((i,c)=>i.arrivalTime-c.arrivalTime),s.nb=s.nb.slice(0,4),s.sb=s.sb.slice(0,4),s}async function Bt(t,e,n=null){const a=`${e.id}:${t.id}`,s=o.arrivalsCache.get(a);if(s&&Date.now()-s.fetchedAt<dt)return s.value;const i=K(t,e),c=n??await V(i),d=Pt(c,e);return o.arrivalsCache.set(a,{fetchedAt:Date.now(),value:d}),d}function Nt(t){const e={nb:[],sb:[]};for(const n of t)e.nb.push(...n.nb),e.sb.push(...n.sb);return e.nb.sort((n,a)=>n.arrivalTime-a.arrivalTime),e.sb.sort((n,a)=>n.arrivalTime-a.arrivalTime),e}async function z(t,e=!0){pt.textContent=t.name,o.currentDialogStationId=t.id;const n=o.activeDialogRequest+1;o.activeDialogRequest=n,D({nb:[],sb:[]},!0),e&&xt(t),h.showModal();try{const a=Mt(t),s=a.flatMap(({station:d,line:r})=>K(d,r)),i=await V(s),c=await Promise.all(a.map(({station:d,line:r})=>Bt(d,r,i)));if(o.activeDialogRequest!==n||!h.open)return;D(Nt(c))}catch(a){if(o.activeDialogRequest!==n||!h.open)return;T.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,E.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function Ot(t){const e=o.layouts.get(t.id),n=o.vehiclesByLine.get(t.id)??[],a=n.filter(r=>r.directionSymbol==="▲"),s=n.filter(r=>r.directionSymbol==="▼"),i=e.stations.map((r,m)=>{const u=e.stations[m-1],l=m>0?u.segmentMinutes:"";return`
        <g transform="translate(0, ${r.y})" class="station-group" data-stop-id="${r.id}" style="cursor: pointer;">
          ${m>0?`<text x="0" y="-14" class="segment-time">${l}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${r.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="300" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),c=n.map((r,m)=>`
        <g transform="translate(${e.trackX}, ${r.y+(m%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${m*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),d=(r,m)=>`
    <div class="direction-column">
      <p class="direction-column-title">${r}</p>
      ${m.length?m.sort((u,l)=>u.minutePosition-l.minutePosition).map(u=>`<p class="train-readout"><span class="train-id">${u.label}</span>${F(u)} <span class="train-delay ${u.delayInfo.colorClass}">${H(u)}</span></p>`).join(""):'<p class="train-readout muted">No trains</p>'}
    </div>
  `;return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <h2>${t.name}</h2>
            <p>${n.length} live trains</p>
          </div>
        </div>
      </header>
      <svg viewBox="0 0 360 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${i}
        ${c}
      </svg>
      <div class="line-readout line-readout-grid">
        ${d("NB",a)}
        ${d("SB",s)}
      </div>
    </article>
  `}function qt(){const t=kt().sort((a,s)=>a.minutePosition-s.minutePosition);return t.length?(o.compactLayout?o.lines.filter(a=>a.id===o.activeLineId):o.lines).map(a=>{const s=t.filter(r=>r.lineId===a.id),i=s.filter(r=>r.directionSymbol==="▲"),c=s.filter(r=>r.directionSymbol==="▼"),d=(r,m)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${r}</p>
          ${m.length?m.map(u=>`
                      <article class="train-list-item">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${u.lineColor};">${u.lineToken}</span>
                          <div>
                            <p class="train-list-title">${u.lineName} Train ${u.label}</p>
                            <p class="train-list-subtitle">${F(u)}</p>
                            <p class="train-list-status ${u.delayInfo.colorClass}">${H(u)}</p>
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
                <p>${s.length} trains in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${d("NB",i)}
            ${d("SB",c)}
          </div>
        </article>
      `}).join(""):`
      <section class="line-card">
        <header class="panel-header">
          <h2>Active Trains</h2>
          <p>No live trains</p>
        </header>
      </section>
    `}function _(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{o.activeLineId=e.dataset.lineSwitch,v()})})}function Ut(){o.lines.forEach(t=>{const e=o.layouts.get(t.id),n=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!n)return;n.querySelectorAll(".station-group").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.stopId,c=e.stations.find(d=>d.id===i);c&&z(c)})})})}function v(){if(O.textContent=o.theme==="dark"?"Light":"Dark",$.textContent=o.error?"HOLD":"SYNC",$.classList.toggle("status-pill-error",!!o.error),q.textContent=o.error?"Using last successful snapshot":yt(o.fetchedAt),N.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===o.activeTab)),o.activeTab==="map"){w.className="board";const t=o.compactLayout?o.lines.filter(e=>e.id===o.activeLineId):o.lines;w.innerHTML=`${x()}${t.map(Ot).join("")}`,_(),Ut();return}if(o.activeTab==="trains"){w.className="board",w.innerHTML=`${x()}${qt()}`,_();return}}async function Wt(){const e=await(await fetch(ot)).json();o.lines=e.lines,o.layouts=new Map(e.lines.map(n=>[n.id,Lt(n)]))}async function P(){try{const t=await W(rt,"Realtime");o.error="",o.fetchedAt=new Date().toISOString(),o.rawVehicles=t.data.list;for(const e of o.lines){const n=o.layouts.get(e.id),a=t.data.list.map(s=>At(s,e,n)).filter(Boolean);o.vehiclesByLine.set(e.id,a)}}catch(t){o.error="Realtime offline",console.error(t)}v()}async function jt(){U(vt()),L(),await Wt(),v(),await P(),await C(),window.addEventListener("popstate",()=>{C().catch(console.error)}),window.addEventListener("resize",()=>{const t=o.compactLayout;L(),t!==o.compactLayout&&v()}),window.visualViewport?.addEventListener("resize",()=>{const t=o.compactLayout;L(),t!==o.compactLayout&&v()}),window.setInterval(P,15e3),window.setInterval(v,1e3)}jt().catch(t=>{$.textContent="FAIL",q.textContent=t.message,console.error(t)});
