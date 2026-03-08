(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();const z="modulepreload",V=function(t){return"/link/dev/"+t},A={},J=function(e,n,a){let s=Promise.resolve();if(n&&n.length>0){let u=function(m){return Promise.all(m.map(l=>Promise.resolve(l).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};var d=u;document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),r=o?.nonce||o?.getAttribute("nonce");s=u(n.map(m=>{if(m=V(m),m in A)return;A[m]=!0;const l=m.endsWith(".css"),f=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${f}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":z,l||(p.as="script"),p.crossOrigin="",p.href=m,r&&p.setAttribute("nonce",r),document.head.appendChild(p),l)return new Promise((v,y)=>{p.addEventListener("load",v),p.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${m}`)))})}))}function i(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return s.then(o=>{for(const r of o||[])r.status==="rejected"&&i(r.reason);return e().catch(i)})};function Z(t={}){const{immediate:e=!1,onNeedRefresh:n,onOfflineReady:a,onRegistered:s,onRegisteredSW:i,onRegisterError:d}=t;let o,r;const u=async(l=!0)=>{await r};async function m(){if("serviceWorker"in navigator){if(o=await J(async()=>{const{Workbox:l}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:l}},[]).then(({Workbox:l})=>new l("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(l=>{d?.(l)}),!o)return;o.addEventListener("activated",l=>{(l.isUpdate||l.isExternal)&&window.location.reload()}),o.addEventListener("installed",l=>{l.isUpdate||a?.()}),o.register({immediate:e}).then(l=>{i?i("/link/dev/sw.js",l):s?.(l)}).catch(l=>{d?.(l)})}}return r=m(),u}const Q="./link-data.json",tt="https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST",et="https://api.pugetsound.onebusaway.org/api/where",nt="TEST",st=2e4,I=3,at=800,D="link-pulse-theme",it={100479:/100479/,"2LINE":/2LINE/},c={fetchedAt:"",error:"",activeTab:"map",theme:"dark",currentDialogStationId:"",lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1};Z({immediate:!0});document.querySelector("#app").innerHTML=`
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
`;const S=document.querySelector("#board"),x=[...document.querySelectorAll(".tab-button")],_=document.querySelector("#theme-toggle"),$=document.querySelector("#status-pill"),P=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),rt=document.querySelector("#dialog-title"),ot=document.querySelector("#dialog-close"),L=document.querySelector("#arrivals-nb"),T=document.querySelector("#arrivals-sb");ot.addEventListener("click",()=>j());h.addEventListener("click",t=>{t.target===h&&j()});h.addEventListener("close",()=>{c.isSyncingFromUrl||U()});x.forEach(t=>{t.addEventListener("click",()=>{c.activeTab=t.dataset.tab,g()})});_.addEventListener("click",()=>{C(c.theme==="dark"?"light":"dark"),g()});function E(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function lt(){const t=window.localStorage.getItem(D);return t==="light"||t==="dark"?t:"dark"}function C(t){c.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(D,t)}function w(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function ct(t,e,n){return Math.max(e,Math.min(t,n))}function dt(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function ut(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),n=t%60;return e>0?`${e}m ${n}s`:`${n}s`}function mt(t){return new Promise(e=>window.setTimeout(e,t))}function ft(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function B(t,e){for(let n=0;n<=I;n+=1){const a=await fetch(t,{cache:"no-store"});let s=null;try{s=await a.json()}catch{s=null}const i=a.status===429||ft(s);if(a.ok&&!i)return s;if(n===I||!i)throw s?.text?new Error(s.text):new Error(`${e} request failed with ${a.status}`);const d=at*2**n;await mt(d)}throw new Error(`${e} request failed`)}function pt(t){const e=[...t.stops].sort((l,f)=>f.sequence-l.sequence),n=48,a=44,s=28,i=88,d=122,o=a+s+(e.length-1)*n,r=new Map,u=e.map((l,f)=>{const p={...l,label:E(l.name),y:a+f*n,index:f,isTerminal:f===0||f===e.length-1};r.set(l.id,f);for(const v of t.stationAliases?.[l.id]??[])r.set(v,f),r.set(`40_${v}`,f);return r.set(`40_${l.id}`,f),p});let m=0;for(let l=0;l<u.length;l+=1)u[l].cumulativeMinutes=m,m+=l<u.length-1?u[l].segmentMinutes:0;return{totalMinutes:m,height:o,labelX:d,stationGap:n,stationIndexByStopId:r,stations:u,trackX:i}}function ht(t,e,n){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":/Lynnwood City Center|Downtown Redmond/.test(n)?"▲":/Federal Way Downtown|South Bellevue/.test(n)?"▼":"•"}function N(t,e){const n=`_${t}_`,a=e.lastIndexOf(n);return a===-1?"":e.slice(a+n.length).replace(/\.\d+$/,"")}function vt(t){const e=t.tripStatus??{},n=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const a=e.nextStopTimeOffset??0,s=e.scheduleDeviation??0,i=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return n==="approaching"||i&&Math.abs(a)<=90?"ARR":s>=120?"DELAY":"OK"}function gt(t,e,n){const a=t.tripStatus?.activeTripId??"";if(!it[e.id].test(a))return null;const s=t.tripStatus?.closestStop,i=t.tripStatus?.nextStop,d=n.stationIndexByStopId.get(s),o=n.stationIndexByStopId.get(i);if(d==null&&o==null)return null;let r=d??o,u=o??d;if(r>u){const G=r;r=u,u=G}const m=n.stations[r],l=n.stations[u],f=t.tripStatus?.closestStopTimeOffset??0,p=t.tripStatus?.nextStopTimeOffset??0,v=N(e.id,a),y=e.directionLookup?.[v],W=y==="1"?"▲":y==="0"?"▼":ht(d,o,a);let b=0;r!==u&&f<0&&p>0&&(b=ct(Math.abs(f)/(Math.abs(f)+p),0,1));const K=m.y+(l.y-m.y)*b,X=r!==u?m.segmentMinutes:0,Y=m.cumulativeMinutes+X*b;return{id:t.vehicleId,label:t.vehicleId.replace(/^40_/,""),directionSymbol:W,fromLabel:m.label,minutePosition:Y,progress:b,serviceStatus:vt(t),toLabel:l.label,y:K,currentLabel:m.label,nextLabel:l.label,status:t.tripStatus?.status??"",closestStop:s,nextStop:i,closestOffset:f,nextOffset:p,rawVehicle:t}}function q(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function yt(){return c.lines.flatMap(t=>(c.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function k(t,e=!1){const n=Date.now(),a=s=>{const i=s.arrivalTime,d=Math.floor((i-n)/1e3),o=ut(d);return`
      <div class="arrival-item">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${s.lineColor};">${s.lineToken}</span>
          <span class="arrival-vehicle">${s.lineName} Train ${s.vehicleId}</span>
        </span>
        <span class="arrival-time">${o}</span>
      </div>
    `};if(e){L.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',T.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>';return}L.innerHTML=t.nb.length?t.nb.map(a).join(""):'<div class="arrival-item muted">No upcoming trains</div>',T.innerHTML=t.sb.length?t.sb.map(a).join(""):'<div class="arrival-item muted">No upcoming trains</div>'}function O(t,e){const n=new Set(e.stationAliases?.[t.id]??[]);n.add(t.id);const a=new Set;for(const i of n){const d=i.startsWith("40_")?i:`40_${i}`;a.add(d)}const s=t.id.replace(/-T\d+$/,"");return a.add(s.startsWith("40_")?s:`40_${s}`),[...a]}function bt(t){const e=c.lines.map(n=>{const a=n.stops.find(s=>s.id===t.id);return a?{line:n,station:a}:null}).filter(Boolean);return e.length>0?e:c.lines.map(n=>{const a=n.stops.find(s=>s.name===t.name);return a?{line:n,station:a}:null}).filter(Boolean)}function St(t){if(!t)return null;const e=t.trim().toLowerCase();for(const n of c.lines)for(const a of n.stops){const s=new Set([a.id,`40_${a.id}`,a.name,E(a.name),w(a.name),w(E(a.name))]);for(const i of n.stationAliases?.[a.id]??[])s.add(i),s.add(`40_${i}`),s.add(w(i));if([...s].some(i=>String(i).toLowerCase()===e))return a}return null}function wt(t){const e=new URL(window.location.href);e.searchParams.set("station",w(t.name)),window.history.pushState({},"",e)}function U(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function j(){c.currentDialogStationId="",h.open?h.close():U()}async function M(){const t=new URL(window.location.href).searchParams.get("station"),e=St(t);c.isSyncingFromUrl=!0;try{if(!e){c.currentDialogStationId="",h.open&&h.close();return}if(c.activeTab="map",g(),c.currentDialogStationId===e.id&&h.open)return;await F(e,!1)}finally{c.isSyncingFromUrl=!1}}function $t(t,e){const n=N(e.id,t.tripId??""),a=e.directionLookup?.[n];if(a==="1")return"nb";if(a==="0")return"sb";const s=t.tripHeadsign??"";return/Lynnwood|Downtown Redmond/i.test(s)?"nb":/Federal Way|South Bellevue/i.test(s)?"sb":""}function Lt(t){return`40_${t.id}`}async function Tt(t){const e=`${et}/arrivals-and-departures-for-stop/${t}.json?key=${nt}&minutesAfter=120`,n=await B(e,"Arrivals");if(n.code!==200)throw new Error(n.text||`Arrivals request failed for ${t}`);return n.data?.entry?.arrivalsAndDepartures??[]}async function H(t){const e=[...new Set(t)],n=await Promise.allSettled(e.map(s=>Tt(s))),a=[];for(const s of n)s.status==="fulfilled"&&a.push(...s.value);return a}function Et(t,e){const n=Date.now(),a=new Set,s={nb:[],sb:[]};for(const i of t){if(i.routeId!==Lt(e))continue;const d=i.predictedArrivalTime||i.scheduledArrivalTime;if(!d||d<=n)continue;const o=$t(i,e);if(!o)continue;const r=`${i.tripId}:${i.stopId}:${d}`;a.has(r)||(a.add(r),s[o].push({vehicleId:(i.vehicleId||"").replace(/^40_/,"")||"--",arrivalTime:d,tripId:i.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0]}))}return s.nb.sort((i,d)=>i.arrivalTime-d.arrivalTime),s.sb.sort((i,d)=>i.arrivalTime-d.arrivalTime),s.nb=s.nb.slice(0,4),s.sb=s.sb.slice(0,4),s}async function At(t,e,n=null){const a=`${e.id}:${t.id}`,s=c.arrivalsCache.get(a);if(s&&Date.now()-s.fetchedAt<st)return s.value;const i=O(t,e),d=n??await H(i),o=Et(d,e);return c.arrivalsCache.set(a,{fetchedAt:Date.now(),value:o}),o}function It(t){const e={nb:[],sb:[]};for(const n of t)e.nb.push(...n.nb),e.sb.push(...n.sb);return e.nb.sort((n,a)=>n.arrivalTime-a.arrivalTime),e.sb.sort((n,a)=>n.arrivalTime-a.arrivalTime),e}async function F(t,e=!0){rt.textContent=t.name,c.currentDialogStationId=t.id;const n=c.activeDialogRequest+1;c.activeDialogRequest=n,k({nb:[],sb:[]},!0),e&&wt(t),h.showModal();try{const a=bt(t),s=a.flatMap(({station:o,line:r})=>O(o,r)),i=await H(s),d=await Promise.all(a.map(({station:o,line:r})=>At(o,r,i)));if(c.activeDialogRequest!==n||!h.open)return;k(It(d))}catch(a){if(c.activeDialogRequest!==n||!h.open)return;L.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,T.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function kt(t){const e=c.layouts.get(t.id),n=c.vehiclesByLine.get(t.id)??[],a=n.filter(r=>r.directionSymbol==="▲"),s=n.filter(r=>r.directionSymbol==="▼"),i=e.stations.map((r,u)=>{const m=e.stations[u-1],l=u>0?m.segmentMinutes:"";return`
        <g transform="translate(0, ${r.y})" class="station-group" data-stop-id="${r.id}" style="cursor: pointer;">
          ${u>0?`<text x="0" y="-14" class="segment-time">${l}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${r.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="300" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),d=n.map((r,u)=>`
        <g transform="translate(${e.trackX}, ${r.y+(u%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${u*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),o=(r,u)=>`
    <div class="direction-column">
      <p class="direction-column-title">${r}</p>
      ${u.length?u.sort((m,l)=>m.minutePosition-l.minutePosition).map(m=>`<p class="train-readout"><span class="train-id">${m.label}</span>${q(m)}</p>`).join(""):'<p class="train-readout muted">No trains</p>'}
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
        ${d}
      </svg>
      <div class="line-readout line-readout-grid">
        ${o("NB",a)}
        ${o("SB",s)}
      </div>
    </article>
  `}function Mt(){const t=yt().sort((n,a)=>n.minutePosition-a.minutePosition);return t.length?c.lines.map(n=>{const a=t.filter(o=>o.lineId===n.id),s=a.filter(o=>o.directionSymbol==="▲"),i=a.filter(o=>o.directionSymbol==="▼"),d=(o,r)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${o}</p>
          ${r.length?r.map(u=>`
                      <article class="train-list-item">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${u.lineColor};">${u.lineToken}</span>
                          <div>
                            <p class="train-list-title">${u.lineName} Train ${u.label}</p>
                            <p class="train-list-subtitle">${q(u)}</p>
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
              <span class="line-token" style="--line-color:${n.color};">${n.name[0]}</span>
              <div>
                <h2>${n.name}</h2>
                <p>${a.length} trains in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${d("NB",s)}
            ${d("SB",i)}
          </div>
        </article>
      `}).join(""):`
      <section class="line-card">
        <header class="panel-header">
          <h2>Active Trains</h2>
          <p>No live trains</p>
        </header>
      </section>
    `}function Rt(){c.lines.forEach(t=>{const e=c.layouts.get(t.id),n=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!n)return;n.querySelectorAll(".station-group").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.stopId,d=e.stations.find(o=>o.id===i);d&&F(d)})})})}function g(){if(_.textContent=c.theme==="dark"?"Light":"Dark",$.textContent=c.error?"HOLD":"SYNC",$.classList.toggle("status-pill-error",!!c.error),P.textContent=c.error?"Using last successful snapshot":dt(c.fetchedAt),x.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===c.activeTab)),c.activeTab==="map"){S.className="board",S.innerHTML=c.lines.map(kt).join(""),Rt();return}if(c.activeTab==="trains"){S.className="board",S.innerHTML=Mt();return}}async function Dt(){const e=await(await fetch(Q)).json();c.lines=e.lines,c.layouts=new Map(e.lines.map(n=>[n.id,pt(n)]))}async function R(){try{const t=await B(tt,"Realtime");c.error="",c.fetchedAt=new Date().toISOString(),c.rawVehicles=t.data.list;for(const e of c.lines){const n=c.layouts.get(e.id),a=t.data.list.map(s=>gt(s,e,n)).filter(Boolean);c.vehiclesByLine.set(e.id,a)}}catch(t){c.error="Realtime offline",console.error(t)}g()}async function xt(){C(lt()),await Dt(),g(),await R(),await M(),window.addEventListener("popstate",()=>{M().catch(console.error)}),window.setInterval(R,15e3),window.setInterval(g,1e3)}xt().catch(t=>{$.textContent="FAIL",P.textContent=t.message,console.error(t)});
