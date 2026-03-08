(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const Q="modulepreload",tt=function(t){return"/link/"+t},A={},et=function(e,n,s){let i=Promise.resolve();if(n&&n.length>0){let m=function(u){return Promise.all(u.map(c=>Promise.resolve(c).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var l=m;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),r=d?.nonce||d?.getAttribute("nonce");i=m(n.map(u=>{if(u=tt(u),u in A)return;A[u]=!0;const c=u.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${p}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":Q,c||(f.as="script"),f.crossOrigin="",f.href=u,r&&f.setAttribute("nonce",r),document.head.appendChild(f),c)return new Promise((g,b)=>{f.addEventListener("load",g),f.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${u}`)))})}))}function a(d){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=d,window.dispatchEvent(r),!r.defaultPrevented)throw d}return i.then(d=>{for(const r of d||[])r.status==="rejected"&&a(r.reason);return e().catch(a)})};function nt(t={}){const{immediate:e=!1,onNeedRefresh:n,onOfflineReady:s,onRegistered:i,onRegisteredSW:a,onRegisterError:l}=t;let d,r;const m=async(c=!0)=>{await r};async function u(){if("serviceWorker"in navigator){if(d=await et(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/link/sw.js",{scope:"/link/",type:"classic"})).catch(c=>{l?.(c)}),!d)return;d.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),d.addEventListener("installed",c=>{c.isUpdate||s?.()}),d.register({immediate:e}).then(c=>{a?a("/link/sw.js",c):i?.(c)}).catch(c=>{l?.(c)})}}return r=u(),m}const it="./link-data.json",st="https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST",at="https://api.pugetsound.onebusaway.org/api/where",ot="TEST",rt=2e4,k=3,ct=800,lt=1100,N="link-pulse-theme",dt={100479:/100479/,"2LINE":/2LINE/},o={fetchedAt:"",error:"",activeTab:"map",activeLineId:"100479",compactLayout:!1,theme:"dark",currentDialogStationId:"",lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1},ut=nt({immediate:!0,onNeedRefresh(){ut(!0)}});document.querySelector("#app").innerHTML=`
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
`;const y=document.querySelector("#board"),x=[...document.querySelectorAll(".tab-button")],B=document.querySelector("#theme-toggle"),$=document.querySelector("#status-pill"),O=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),mt=document.querySelector("#dialog-title"),pt=document.querySelector("#dialog-close"),T=document.querySelector("#arrivals-nb"),I=document.querySelector("#arrivals-sb");pt.addEventListener("click",()=>V());h.addEventListener("click",t=>{t.target===h&&V()});h.addEventListener("close",()=>{o.isSyncingFromUrl||H()});x.forEach(t=>{t.addEventListener("click",()=>{o.activeTab=t.dataset.tab,v()})});B.addEventListener("click",()=>{q(o.theme==="dark"?"light":"dark"),v()});function E(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function ft(){const t=window.localStorage.getItem(N);return t==="light"||t==="dark"?t:"dark"}function q(t){o.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(N,t)}function M(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,n=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,s=Math.min(e,t,n);o.compactLayout=s<=lt}function L(){const n=window.getComputedStyle(y).gridTemplateColumns.split(" ").map(s=>s.trim()).filter(Boolean).length<=1;n!==o.compactLayout&&(o.compactLayout=n,v())}function w(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function ht(t,e,n){return Math.max(e,Math.min(t,n))}function vt(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function gt(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),n=t%60;return e>0?`${e}m ${n}s`:`${n}s`}function yt(t){return new Promise(e=>window.setTimeout(e,t))}function bt(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function U(t,e){for(let n=0;n<=k;n+=1){const s=await fetch(t,{cache:"no-store"});let i=null;try{i=await s.json()}catch{i=null}const a=s.status===429||bt(i);if(s.ok&&!a)return i;if(n===k||!a)throw i?.text?new Error(i.text):new Error(`${e} request failed with ${s.status}`);const l=ct*2**n;await yt(l)}throw new Error(`${e} request failed`)}function St(t){const e=[...t.stops].sort((c,p)=>p.sequence-c.sequence),n=48,s=44,i=28,a=88,l=122,d=s+i+(e.length-1)*n,r=new Map,m=e.map((c,p)=>{const f={...c,label:E(c.name),y:s+p*n,index:p,isTerminal:p===0||p===e.length-1};r.set(c.id,p);for(const g of t.stationAliases?.[c.id]??[])r.set(g,p),r.set(`40_${g}`,p);return r.set(`40_${c.id}`,p),f});let u=0;for(let c=0;c<m.length;c+=1)m[c].cumulativeMinutes=u,u+=c<m.length-1?m[c].segmentMinutes:0;return{totalMinutes:u,height:d,labelX:l,stationGap:n,stationIndexByStopId:r,stations:m,trackX:a}}function wt(t,e,n){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":/Lynnwood City Center|Downtown Redmond/.test(n)?"▲":/Federal Way Downtown|South Bellevue/.test(n)?"▼":"•"}function W(t,e){const n=`_${t}_`,s=e.lastIndexOf(n);return s===-1?"":e.slice(s+n.length).replace(/\.\d+$/,"")}function Lt(t){const e=t.tripStatus??{},n=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const s=e.nextStopTimeOffset??0,i=e.scheduleDeviation??0,a=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return n==="approaching"||a&&Math.abs(s)<=90?"ARR":i>=120?"DELAY":"OK"}function $t(t,e,n){const s=t.tripStatus?.activeTripId??"";if(!dt[e.id].test(s))return null;const i=t.tripStatus?.closestStop,a=t.tripStatus?.nextStop,l=n.stationIndexByStopId.get(i),d=n.stationIndexByStopId.get(a);if(l==null&&d==null)return null;let r=l??d,m=d??l;if(r>m){const Z=r;r=m,m=Z}const u=n.stations[r],c=n.stations[m],p=t.tripStatus?.closestStopTimeOffset??0,f=t.tripStatus?.nextStopTimeOffset??0,g=W(e.id,s),b=e.directionLookup?.[g],z=b==="1"?"▲":b==="0"?"▼":wt(l,d,s);let S=0;r!==m&&p<0&&f>0&&(S=ht(Math.abs(p)/(Math.abs(p)+f),0,1));const X=u.y+(c.y-u.y)*S,G=r!==m?u.segmentMinutes:0,J=u.cumulativeMinutes+G*S;return{id:t.vehicleId,label:t.vehicleId.replace(/^40_/,""),directionSymbol:z,fromLabel:u.label,minutePosition:J,progress:S,serviceStatus:Lt(t),toLabel:c.label,y:X,currentLabel:u.label,nextLabel:c.label,status:t.tripStatus?.status??"",closestStop:i,nextStop:a,closestOffset:p,nextOffset:f,rawVehicle:t}}function F(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function Tt(){return o.lines.flatMap(t=>(o.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function R(){return!o.compactLayout||o.lines.length<2?"":`<section class="line-switcher">${o.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===o.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function C(t,e=!1){const n=Date.now(),s=i=>{const a=i.arrivalTime,l=Math.floor((a-n)/1e3),d=gt(l);return`
      <div class="arrival-item">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${i.lineColor};">${i.lineToken}</span>
          <span class="arrival-vehicle">${i.lineName} Train ${i.vehicleId}</span>
        </span>
        <span class="arrival-time">${d}</span>
      </div>
    `};if(e){T.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',I.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>';return}T.innerHTML=t.nb.length?t.nb.map(s).join(""):'<div class="arrival-item muted">No upcoming trains</div>',I.innerHTML=t.sb.length?t.sb.map(s).join(""):'<div class="arrival-item muted">No upcoming trains</div>'}function j(t,e){const n=new Set(e.stationAliases?.[t.id]??[]);n.add(t.id);const s=new Set;for(const a of n){const l=a.startsWith("40_")?a:`40_${a}`;s.add(l)}const i=t.id.replace(/-T\d+$/,"");return s.add(i.startsWith("40_")?i:`40_${i}`),[...s]}function It(t){const e=o.lines.map(n=>{const s=n.stops.find(i=>i.id===t.id);return s?{line:n,station:s}:null}).filter(Boolean);return e.length>0?e:o.lines.map(n=>{const s=n.stops.find(i=>i.name===t.name);return s?{line:n,station:s}:null}).filter(Boolean)}function Et(t){if(!t)return null;const e=t.trim().toLowerCase();for(const n of o.lines)for(const s of n.stops){const i=new Set([s.id,`40_${s.id}`,s.name,E(s.name),w(s.name),w(E(s.name))]);for(const a of n.stationAliases?.[s.id]??[])i.add(a),i.add(`40_${a}`),i.add(w(a));if([...i].some(a=>String(a).toLowerCase()===e))return s}return null}function At(t){const e=new URL(window.location.href);e.searchParams.set("station",w(t.name)),window.history.pushState({},"",e)}function H(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function V(){o.currentDialogStationId="",h.open?h.close():H()}async function _(){const t=new URL(window.location.href).searchParams.get("station"),e=Et(t);o.isSyncingFromUrl=!0;try{if(!e){o.currentDialogStationId="",h.open&&h.close();return}if(o.activeTab="map",v(),o.currentDialogStationId===e.id&&h.open)return;await Y(e,!1)}finally{o.isSyncingFromUrl=!1}}function kt(t,e){const n=W(e.id,t.tripId??""),s=e.directionLookup?.[n];if(s==="1")return"nb";if(s==="0")return"sb";const i=t.tripHeadsign??"";return/Lynnwood|Downtown Redmond/i.test(i)?"nb":/Federal Way|South Bellevue/i.test(i)?"sb":""}function Mt(t){return`40_${t.id}`}async function Rt(t){const e=`${at}/arrivals-and-departures-for-stop/${t}.json?key=${ot}&minutesAfter=120`,n=await U(e,"Arrivals");if(n.code!==200)throw new Error(n.text||`Arrivals request failed for ${t}`);return n.data?.entry?.arrivalsAndDepartures??[]}async function K(t){const e=[...new Set(t)],n=await Promise.allSettled(e.map(i=>Rt(i))),s=[];for(const i of n)i.status==="fulfilled"&&s.push(...i.value);return s}function Ct(t,e){const n=Date.now(),s=new Set,i={nb:[],sb:[]};for(const a of t){if(a.routeId!==Mt(e))continue;const l=a.predictedArrivalTime||a.scheduledArrivalTime;if(!l||l<=n)continue;const d=kt(a,e);if(!d)continue;const r=`${a.tripId}:${a.stopId}:${l}`;s.has(r)||(s.add(r),i[d].push({vehicleId:(a.vehicleId||"").replace(/^40_/,"")||"--",arrivalTime:l,tripId:a.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0]}))}return i.nb.sort((a,l)=>a.arrivalTime-l.arrivalTime),i.sb.sort((a,l)=>a.arrivalTime-l.arrivalTime),i.nb=i.nb.slice(0,4),i.sb=i.sb.slice(0,4),i}async function _t(t,e,n=null){const s=`${e.id}:${t.id}`,i=o.arrivalsCache.get(s);if(i&&Date.now()-i.fetchedAt<rt)return i.value;const a=j(t,e),l=n??await K(a),d=Ct(l,e);return o.arrivalsCache.set(s,{fetchedAt:Date.now(),value:d}),d}function Pt(t){const e={nb:[],sb:[]};for(const n of t)e.nb.push(...n.nb),e.sb.push(...n.sb);return e.nb.sort((n,s)=>n.arrivalTime-s.arrivalTime),e.sb.sort((n,s)=>n.arrivalTime-s.arrivalTime),e}async function Y(t,e=!0){mt.textContent=t.name,o.currentDialogStationId=t.id;const n=o.activeDialogRequest+1;o.activeDialogRequest=n,C({nb:[],sb:[]},!0),e&&At(t),h.showModal();try{const s=It(t),i=s.flatMap(({station:d,line:r})=>j(d,r)),a=await K(i),l=await Promise.all(s.map(({station:d,line:r})=>_t(d,r,a)));if(o.activeDialogRequest!==n||!h.open)return;C(Pt(l))}catch(s){if(o.activeDialogRequest!==n||!h.open)return;T.innerHTML=`<div class="arrival-item muted">${s.message}</div>`,I.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function Dt(t){const e=o.layouts.get(t.id),n=o.vehiclesByLine.get(t.id)??[],s=n.filter(r=>r.directionSymbol==="▲"),i=n.filter(r=>r.directionSymbol==="▼"),a=e.stations.map((r,m)=>{const u=e.stations[m-1],c=m>0?u.segmentMinutes:"";return`
        <g transform="translate(0, ${r.y})" class="station-group" data-stop-id="${r.id}" style="cursor: pointer;">
          ${m>0?`<text x="0" y="-14" class="segment-time">${c}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${r.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="300" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),l=n.map((r,m)=>`
        <g transform="translate(${e.trackX}, ${r.y+(m%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${m*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),d=(r,m)=>`
    <div class="direction-column">
      <p class="direction-column-title">${r}</p>
      ${m.length?m.sort((u,c)=>u.minutePosition-c.minutePosition).map(u=>`<p class="train-readout"><span class="train-id">${u.label}</span>${F(u)}</p>`).join(""):'<p class="train-readout muted">No trains</p>'}
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
        ${a}
        ${l}
      </svg>
      <div class="line-readout line-readout-grid">
        ${d("NB",s)}
        ${d("SB",i)}
      </div>
    </article>
  `}function Nt(){const t=Tt().sort((s,i)=>s.minutePosition-i.minutePosition);return t.length?(o.compactLayout?o.lines.filter(s=>s.id===o.activeLineId):o.lines).map(s=>{const i=t.filter(r=>r.lineId===s.id),a=i.filter(r=>r.directionSymbol==="▲"),l=i.filter(r=>r.directionSymbol==="▼"),d=(r,m)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${r}</p>
          ${m.length?m.map(u=>`
                      <article class="train-list-item">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${u.lineColor};">${u.lineToken}</span>
                          <div>
                            <p class="train-list-title">${u.lineName} Train ${u.label}</p>
                            <p class="train-list-subtitle">${F(u)}</p>
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
                <p>${i.length} trains in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${d("NB",a)}
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
    `}function P(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{o.activeLineId=e.dataset.lineSwitch,v()})})}function xt(){o.lines.forEach(t=>{const e=o.layouts.get(t.id),n=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!n)return;n.querySelectorAll(".station-group").forEach(i=>{i.addEventListener("click",()=>{const a=i.dataset.stopId,l=e.stations.find(d=>d.id===a);l&&Y(l)})})})}function v(){if(B.textContent=o.theme==="dark"?"Light":"Dark",$.textContent=o.error?"HOLD":"SYNC",$.classList.toggle("status-pill-error",!!o.error),O.textContent=o.error?"Using last successful snapshot":vt(o.fetchedAt),x.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===o.activeTab)),o.activeTab==="map"){y.className="board";const t=o.compactLayout?o.lines.filter(e=>e.id===o.activeLineId):o.lines;y.innerHTML=`${R()}${t.map(Dt).join("")}`,P(),xt(),queueMicrotask(L);return}if(o.activeTab==="trains"){y.className="board",y.innerHTML=`${R()}${Nt()}`,P(),queueMicrotask(L);return}}async function Bt(){const e=await(await fetch(it)).json();o.lines=e.lines,o.layouts=new Map(e.lines.map(n=>[n.id,St(n)]))}async function D(){try{const t=await U(st,"Realtime");o.error="",o.fetchedAt=new Date().toISOString(),o.rawVehicles=t.data.list;for(const e of o.lines){const n=o.layouts.get(e.id),s=t.data.list.map(i=>$t(i,e,n)).filter(Boolean);o.vehiclesByLine.set(e.id,s)}}catch(t){o.error="Realtime offline",console.error(t)}v()}async function Ot(){q(ft()),M(),await Bt(),v(),await D(),await _(),window.addEventListener("popstate",()=>{_().catch(console.error)});const t=()=>{const n=o.compactLayout;if(M(),n!==o.compactLayout){v();return}L()};window.addEventListener("resize",t),window.visualViewport?.addEventListener("resize",t),new ResizeObserver(()=>{L()}).observe(y),window.setInterval(D,15e3),window.setInterval(v,1e3)}Ot().catch(t=>{$.textContent="FAIL",O.textContent=t.message,console.error(t)});
