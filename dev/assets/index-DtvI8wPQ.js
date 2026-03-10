(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();const et="modulepreload",nt=function(t){return"/link/dev/"+t},M={},st=function(e,s,a){let n=Promise.resolve();if(s&&s.length>0){let m=function(u){return Promise.all(u.map(l=>Promise.resolve(l).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};var c=m;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),r=d?.nonce||d?.getAttribute("nonce");n=m(s.map(u=>{if(u=nt(u),u in M)return;M[u]=!0;const l=u.endsWith(".css"),f=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${f}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":et,l||(p.as="script"),p.crossOrigin="",p.href=u,r&&p.setAttribute("nonce",r),document.head.appendChild(p),l)return new Promise((g,y)=>{p.addEventListener("load",g),p.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(d){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=d,window.dispatchEvent(r),!r.defaultPrevented)throw d}return n.then(d=>{for(const r of d||[])r.status==="rejected"&&i(r.reason);return e().catch(i)})};function at(t={}){const{immediate:e=!1,onNeedRefresh:s,onOfflineReady:a,onRegistered:n,onRegisteredSW:i,onRegisterError:c}=t;let d,r;const m=async(l=!0)=>{await r};async function u(){if("serviceWorker"in navigator){if(d=await st(async()=>{const{Workbox:l}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:l}},[]).then(({Workbox:l})=>new l("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(l=>{c?.(l)}),!d)return;d.addEventListener("activated",l=>{(l.isUpdate||l.isExternal)&&window.location.reload()}),d.addEventListener("installed",l=>{l.isUpdate||a?.()}),d.register({immediate:e}).then(l=>{i?i("/link/dev/sw.js",l):n?.(l)}).catch(l=>{c?.(l)})}}return r=u(),m}const it="./link-data.json",ot="https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST",rt="https://api.pugetsound.onebusaway.org/api/where",lt="TEST",ct=2e4,x=3,dt=800,ut=1100,B="link-pulse-theme",mt={100479:/100479/,"2LINE":/2LINE/},o={fetchedAt:"",error:"",activeTab:"map",activeLineId:"100479",compactLayout:!1,theme:"dark",currentDialogStationId:"",lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1};at({immediate:!0});document.querySelector("#app").innerHTML=`
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
`;const w=document.querySelector("#board"),N=[...document.querySelectorAll(".tab-button")],O=document.querySelector("#theme-toggle"),$=document.querySelector("#status-pill"),q=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),ft=document.querySelector("#dialog-title"),pt=document.querySelector("#dialog-close"),T=document.querySelector("#arrivals-nb"),E=document.querySelector("#arrivals-sb");pt.addEventListener("click",()=>X());h.addEventListener("click",t=>{t.target===h&&X()});h.addEventListener("close",()=>{o.isSyncingFromUrl||K()});N.forEach(t=>{t.addEventListener("click",()=>{o.activeTab=t.dataset.tab,v()})});O.addEventListener("click",()=>{U(o.theme==="dark"?"light":"dark"),v()});function I(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function ht(){const t=window.localStorage.getItem(B);return t==="light"||t==="dark"?t:"dark"}function U(t){o.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(B,t)}function L(){const t=window.visualViewport?.width??window.innerWidth,e=Math.min(window.innerWidth,t);o.compactLayout=e<=ut}function S(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function vt(t,e,s){return Math.max(e,Math.min(t,s))}function gt(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function yt(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),s=t%60;return e>0?`${e}m ${s}s`:`${s}s`}function bt(t){return new Promise(e=>window.setTimeout(e,t))}function wt(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function W(t,e){for(let s=0;s<=x;s+=1){const a=await fetch(t,{cache:"no-store"});let n=null;try{n=await a.json()}catch{n=null}const i=a.status===429||wt(n);if(a.ok&&!i)return n;if(s===x||!i)throw n?.text?new Error(n.text):new Error(`${e} request failed with ${a.status}`);const c=dt*2**s;await bt(c)}throw new Error(`${e} request failed`)}function St(t){const e=[...t.stops].sort((l,f)=>f.sequence-l.sequence),s=48,a=44,n=28,i=88,c=122,d=a+n+(e.length-1)*s,r=new Map,m=e.map((l,f)=>{const p={...l,label:I(l.name),y:a+f*s,index:f,isTerminal:f===0||f===e.length-1};r.set(l.id,f);for(const g of t.stationAliases?.[l.id]??[])r.set(g,f),r.set(`40_${g}`,f);return r.set(`40_${l.id}`,f),p});let u=0;for(let l=0;l<m.length;l+=1)m[l].cumulativeMinutes=u,u+=l<m.length-1?m[l].segmentMinutes:0;return{totalMinutes:u,height:d,labelX:c,stationGap:s,stationIndexByStopId:r,stations:m,trackX:i}}function Lt(t,e,s){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":/Lynnwood City Center|Downtown Redmond/.test(s)?"▲":/Federal Way Downtown|South Bellevue/.test(s)?"▼":"•"}function j(t,e){const s=`_${t}_`,a=e.lastIndexOf(s);return a===-1?"":e.slice(a+s.length).replace(/\.\d+$/,"")}function $t(t){const e=t.tripStatus??{},s=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const a=e.nextStopTimeOffset??0,n=e.scheduleDeviation??0,i=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return s==="approaching"||i&&Math.abs(a)<=90?"ARR":n>=120?"DELAY":"OK"}function Tt(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const s=Math.round(t/60);let a="status-late-minor";return t>600?a="status-late-severe":t>300&&(a="status-late-moderate"),{text:`+${s} min late`,colorClass:a}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function Et(t,e,s){const a=t.tripStatus?.activeTripId??"";if(!mt[e.id].test(a))return null;const n=t.tripStatus?.closestStop,i=t.tripStatus?.nextStop,c=s.stationIndexByStopId.get(n),d=s.stationIndexByStopId.get(i);if(c==null&&d==null)return null;let r=c??d,m=d??c;if(r>m){const tt=r;r=m,m=tt}const u=s.stations[r],l=s.stations[m],f=t.tripStatus?.closestStopTimeOffset??0,p=t.tripStatus?.nextStopTimeOffset??0,g=j(e.id,a),y=e.directionLookup?.[g],V=y==="1"?"▲":y==="0"?"▼":Lt(c,d,a);let b=0;r!==m&&f<0&&p>0&&(b=vt(Math.abs(f)/(Math.abs(f)+p),0,1));const G=u.y+(l.y-u.y)*b,J=r!==m?u.segmentMinutes:0,Z=u.cumulativeMinutes+J*b,A=t.tripStatus?.scheduleDeviation??0,k=t.tripStatus?.predicted??!1,Q=Tt(A,k);return{id:t.vehicleId,label:t.vehicleId.replace(/^40_/,""),directionSymbol:V,fromLabel:u.label,minutePosition:Z,progress:b,serviceStatus:$t(t),toLabel:l.label,y:G,currentLabel:u.label,nextLabel:l.label,status:t.tripStatus?.status??"",closestStop:n,nextStop:i,closestOffset:f,nextOffset:p,scheduleDeviation:A,isPredicted:k,delayInfo:Q,rawVehicle:t}}function H(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function It(){return o.lines.flatMap(t=>(o.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function D(){return!o.compactLayout||o.lines.length<2?"":`<section class="line-switcher">${o.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===o.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function R(t,e=!1){const s=Date.now(),a=n=>{const i=n.arrivalTime,c=Math.floor((i-s)/1e3),d=yt(c);return`
      <div class="arrival-item">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${n.lineColor};">${n.lineToken}</span>
          <span class="arrival-vehicle">${n.lineName} Train ${n.vehicleId}</span>
        </span>
        <span class="arrival-time">${d}</span>
      </div>
    `};if(e){T.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',E.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>';return}T.innerHTML=t.nb.length?t.nb.map(a).join(""):'<div class="arrival-item muted">No upcoming trains</div>',E.innerHTML=t.sb.length?t.sb.map(a).join(""):'<div class="arrival-item muted">No upcoming trains</div>'}function F(t,e){const s=new Set(e.stationAliases?.[t.id]??[]);s.add(t.id);const a=new Set;for(const i of s){const c=i.startsWith("40_")?i:`40_${i}`;a.add(c)}const n=t.id.replace(/-T\d+$/,"");return a.add(n.startsWith("40_")?n:`40_${n}`),[...a]}function At(t){const e=o.lines.map(s=>{const a=s.stops.find(n=>n.id===t.id);return a?{line:s,station:a}:null}).filter(Boolean);return e.length>0?e:o.lines.map(s=>{const a=s.stops.find(n=>n.name===t.name);return a?{line:s,station:a}:null}).filter(Boolean)}function kt(t){if(!t)return null;const e=t.trim().toLowerCase();for(const s of o.lines)for(const a of s.stops){const n=new Set([a.id,`40_${a.id}`,a.name,I(a.name),S(a.name),S(I(a.name))]);for(const i of s.stationAliases?.[a.id]??[])n.add(i),n.add(`40_${i}`),n.add(S(i));if([...n].some(i=>String(i).toLowerCase()===e))return a}return null}function Mt(t){const e=new URL(window.location.href);e.searchParams.set("station",S(t.name)),window.history.pushState({},"",e)}function K(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function X(){o.currentDialogStationId="",h.open?h.close():K()}async function C(){const t=new URL(window.location.href).searchParams.get("station"),e=kt(t);o.isSyncingFromUrl=!0;try{if(!e){o.currentDialogStationId="",h.open&&h.close();return}if(o.activeTab="map",v(),o.currentDialogStationId===e.id&&h.open)return;await z(e,!1)}finally{o.isSyncingFromUrl=!1}}function xt(t,e){const s=j(e.id,t.tripId??""),a=e.directionLookup?.[s];if(a==="1")return"nb";if(a==="0")return"sb";const n=t.tripHeadsign??"";return/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function Dt(t){return`40_${t.id}`}async function Rt(t){const e=`${rt}/arrivals-and-departures-for-stop/${t}.json?key=${lt}&minutesAfter=120`,s=await W(e,"Arrivals");if(s.code!==200)throw new Error(s.text||`Arrivals request failed for ${t}`);return s.data?.entry?.arrivalsAndDepartures??[]}async function Y(t){const e=[...new Set(t)],s=await Promise.allSettled(e.map(n=>Rt(n))),a=[];for(const n of s)n.status==="fulfilled"&&a.push(...n.value);return a}function Ct(t,e){const s=Date.now(),a=new Set,n={nb:[],sb:[]};for(const i of t){if(i.routeId!==Dt(e))continue;const c=i.predictedArrivalTime||i.scheduledArrivalTime;if(!c||c<=s)continue;const d=xt(i,e);if(!d)continue;const r=`${i.tripId}:${i.stopId}:${c}`;a.has(r)||(a.add(r),n[d].push({vehicleId:(i.vehicleId||"").replace(/^40_/,"")||"--",arrivalTime:c,tripId:i.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0]}))}return n.nb.sort((i,c)=>i.arrivalTime-c.arrivalTime),n.sb.sort((i,c)=>i.arrivalTime-c.arrivalTime),n.nb=n.nb.slice(0,4),n.sb=n.sb.slice(0,4),n}async function _t(t,e,s=null){const a=`${e.id}:${t.id}`,n=o.arrivalsCache.get(a);if(n&&Date.now()-n.fetchedAt<ct)return n.value;const i=F(t,e),c=s??await Y(i),d=Ct(c,e);return o.arrivalsCache.set(a,{fetchedAt:Date.now(),value:d}),d}function Pt(t){const e={nb:[],sb:[]};for(const s of t)e.nb.push(...s.nb),e.sb.push(...s.sb);return e.nb.sort((s,a)=>s.arrivalTime-a.arrivalTime),e.sb.sort((s,a)=>s.arrivalTime-a.arrivalTime),e}async function z(t,e=!0){ft.textContent=t.name,o.currentDialogStationId=t.id;const s=o.activeDialogRequest+1;o.activeDialogRequest=s,R({nb:[],sb:[]},!0),e&&Mt(t),h.showModal();try{const a=At(t),n=a.flatMap(({station:d,line:r})=>F(d,r)),i=await Y(n),c=await Promise.all(a.map(({station:d,line:r})=>_t(d,r,i)));if(o.activeDialogRequest!==s||!h.open)return;R(Pt(c))}catch(a){if(o.activeDialogRequest!==s||!h.open)return;T.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,E.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function Bt(t){const e=o.layouts.get(t.id),s=o.vehiclesByLine.get(t.id)??[],a=s.filter(r=>r.directionSymbol==="▲"),n=s.filter(r=>r.directionSymbol==="▼"),i=e.stations.map((r,m)=>{const u=e.stations[m-1],l=m>0?u.segmentMinutes:"";return`
        <g transform="translate(0, ${r.y})" class="station-group" data-stop-id="${r.id}" style="cursor: pointer;">
          ${m>0?`<text x="0" y="-14" class="segment-time">${l}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${r.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="300" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),c=s.map((r,m)=>`
        <g transform="translate(${e.trackX}, ${r.y+(m%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${m*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),d=(r,m)=>`
    <div class="direction-column">
      <p class="direction-column-title">${r}</p>
      ${m.length?m.sort((u,l)=>u.minutePosition-l.minutePosition).map(u=>`<p class="train-readout"><span class="train-id">${u.label}</span>${H(u)} <span class="train-delay ${u.delayInfo.colorClass}">${u.delayInfo.text}</span></p>`).join(""):'<p class="train-readout muted">No trains</p>'}
    </div>
  `;return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <h2>${t.name}</h2>
            <p>${s.length} live trains</p>
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
        ${d("SB",n)}
      </div>
    </article>
  `}function Nt(){const t=It().sort((a,n)=>a.minutePosition-n.minutePosition);return t.length?(o.compactLayout?o.lines.filter(a=>a.id===o.activeLineId):o.lines).map(a=>{const n=t.filter(r=>r.lineId===a.id),i=n.filter(r=>r.directionSymbol==="▲"),c=n.filter(r=>r.directionSymbol==="▼"),d=(r,m)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${r}</p>
          ${m.length?m.map(u=>`
                      <article class="train-list-item">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${u.lineColor};">${u.lineToken}</span>
                          <div>
                            <p class="train-list-title">${u.lineName} Train ${u.label}</p>
                            <p class="train-list-subtitle">${H(u)}</p>
                            <p class="train-list-status ${u.delayInfo.colorClass}">${u.delayInfo.text}</p>
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
    `}function _(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{o.activeLineId=e.dataset.lineSwitch,v()})})}function Ot(){o.lines.forEach(t=>{const e=o.layouts.get(t.id),s=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!s)return;s.querySelectorAll(".station-group").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.stopId,c=e.stations.find(d=>d.id===i);c&&z(c)})})})}function v(){if(O.textContent=o.theme==="dark"?"Light":"Dark",$.textContent=o.error?"HOLD":"SYNC",$.classList.toggle("status-pill-error",!!o.error),q.textContent=o.error?"Using last successful snapshot":gt(o.fetchedAt),N.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===o.activeTab)),o.activeTab==="map"){w.className="board";const t=o.compactLayout?o.lines.filter(e=>e.id===o.activeLineId):o.lines;w.innerHTML=`${D()}${t.map(Bt).join("")}`,_(),Ot();return}if(o.activeTab==="trains"){w.className="board",w.innerHTML=`${D()}${Nt()}`,_();return}}async function qt(){const e=await(await fetch(it)).json();o.lines=e.lines,o.layouts=new Map(e.lines.map(s=>[s.id,St(s)]))}async function P(){try{const t=await W(ot,"Realtime");o.error="",o.fetchedAt=new Date().toISOString(),o.rawVehicles=t.data.list;for(const e of o.lines){const s=o.layouts.get(e.id),a=t.data.list.map(n=>Et(n,e,s)).filter(Boolean);o.vehiclesByLine.set(e.id,a)}}catch(t){o.error="Realtime offline",console.error(t)}v()}async function Ut(){U(ht()),L(),await qt(),v(),await P(),await C(),window.addEventListener("popstate",()=>{C().catch(console.error)}),window.addEventListener("resize",()=>{const t=o.compactLayout;L(),t!==o.compactLayout&&v()}),window.visualViewport?.addEventListener("resize",()=>{const t=o.compactLayout;L(),t!==o.compactLayout&&v()}),window.setInterval(P,15e3),window.setInterval(v,1e3)}Ut().catch(t=>{$.textContent="FAIL",q.textContent=t.message,console.error(t)});
