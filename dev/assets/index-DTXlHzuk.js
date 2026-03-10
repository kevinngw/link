(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const at="modulepreload",ot=function(t){return"/link/dev/"+t},x={},rt=function(e,s,i){let n=Promise.resolve();if(s&&s.length>0){let m=function(u){return Promise.all(u.map(l=>Promise.resolve(l).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var c=m;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),r=d?.nonce||d?.getAttribute("nonce");n=m(s.map(u=>{if(u=ot(u),u in x)return;x[u]=!0;const l=u.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${p}`))return;const f=document.createElement("link");if(f.rel=l?"stylesheet":at,l||(f.as="script"),f.crossOrigin="",f.href=u,r&&f.setAttribute("nonce",r),document.head.appendChild(f),l)return new Promise((g,b)=>{f.addEventListener("load",g),f.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${u}`)))})}))}function o(d){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=d,window.dispatchEvent(r),!r.defaultPrevented)throw d}return n.then(d=>{for(const r of d||[])r.status==="rejected"&&o(r.reason);return e().catch(o)})};function ct(t={}){const{immediate:e=!1,onNeedRefresh:s,onOfflineReady:i,onRegistered:n,onRegisteredSW:o,onRegisterError:c}=t;let d,r;const m=async(l=!0)=>{await r};async function u(){if("serviceWorker"in navigator){if(d=await rt(async()=>{const{Workbox:l}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:l}},[]).then(({Workbox:l})=>new l("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(l=>{c?.(l)}),!d)return;d.addEventListener("activated",l=>{(l.isUpdate||l.isExternal)&&window.location.reload()}),d.addEventListener("installed",l=>{l.isUpdate||i?.()}),d.register({immediate:e}).then(l=>{o?o("/link/dev/sw.js",l):n?.(l)}).catch(l=>{c?.(l)})}}return r=u(),m}const lt="./link-data.json",dt="https://api.pugetsound.onebusaway.org/api/where/vehicles-for-agency/40.json?key=TEST",ut="https://api.pugetsound.onebusaway.org/api/where",mt="TEST",pt=2e4,R=3,ft=800,ht=1100,O="link-pulse-theme",vt={100479:/100479/,"2LINE":/2LINE/},a={fetchedAt:"",error:"",activeTab:"map",activeLineId:"100479",compactLayout:!1,theme:"dark",currentDialogStationId:"",lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1};ct({immediate:!0});document.querySelector("#app").innerHTML=`
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
      <button class="tab-button" data-tab="times" type="button">Times</button>
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
`;const y=document.querySelector("#board"),N=[...document.querySelectorAll(".tab-button")],B=document.querySelector("#theme-toggle"),E=document.querySelector("#status-pill"),U=document.querySelector("#updated-at"),v=document.querySelector("#station-dialog"),gt=document.querySelector("#dialog-title"),yt=document.querySelector("#dialog-close"),I=document.querySelector("#arrivals-nb"),k=document.querySelector("#arrivals-sb");yt.addEventListener("click",()=>V());v.addEventListener("click",t=>{t.target===v&&V()});v.addEventListener("close",()=>{a.isSyncingFromUrl||Y()});N.forEach(t=>{t.addEventListener("click",async()=>{a.activeTab=t.dataset.tab,h(),a.activeTab==="times"&&(await Z(),a.activeTab==="times"&&h())})});B.addEventListener("click",()=>{q(a.theme==="dark"?"light":"dark"),h()});function $(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function bt(){const t=window.localStorage.getItem(O);return t==="light"||t==="dark"?t:"dark"}function q(t){a.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(O,t)}function L(){const t=window.visualViewport?.width??window.innerWidth,e=Math.min(window.innerWidth,t);a.compactLayout=e<=ht}function S(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function wt(t,e,s){return Math.max(e,Math.min(t,s))}function St(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function F(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),s=t%60;return e>0?`${e}m ${s}s`:`${s}s`}function $t(t){return new Promise(e=>window.setTimeout(e,t))}function Lt(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function j(t,e){for(let s=0;s<=R;s+=1){const i=await fetch(t,{cache:"no-store"});let n=null;try{n=await i.json()}catch{n=null}const o=i.status===429||Lt(n);if(i.ok&&!o)return n;if(s===R||!o)throw n?.text?new Error(n.text):new Error(`${e} request failed with ${i.status}`);const c=ft*2**s;await $t(c)}throw new Error(`${e} request failed`)}function Tt(t){const e=[...t.stops].sort((l,p)=>p.sequence-l.sequence),s=48,i=44,n=28,o=88,c=122,d=i+n+(e.length-1)*s,r=new Map,m=e.map((l,p)=>{const f={...l,label:$(l.name),y:i+p*s,index:p,isTerminal:p===0||p===e.length-1};r.set(l.id,p);for(const g of t.stationAliases?.[l.id]??[])r.set(g,p),r.set(`40_${g}`,p);return r.set(`40_${l.id}`,p),f});let u=0;for(let l=0;l<m.length;l+=1)m[l].cumulativeMinutes=u,u+=l<m.length-1?m[l].segmentMinutes:0;return{totalMinutes:u,height:d,labelX:c,stationGap:s,stationIndexByStopId:r,stations:m,trackX:o}}function At(t,e,s){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":/Lynnwood City Center|Downtown Redmond/.test(s)?"▲":/Federal Way Downtown|South Bellevue/.test(s)?"▼":"•"}function H(t,e){const s=`_${t}_`,i=e.lastIndexOf(s);return i===-1?"":e.slice(i+s.length).replace(/\.\d+$/,"")}function Et(t){const e=t.tripStatus??{},s=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const i=e.nextStopTimeOffset??0,n=e.scheduleDeviation??0,o=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return s==="approaching"||o&&Math.abs(i)<=90?"ARR":n>=120?"DELAY":"OK"}function It(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const s=Math.round(t/60);let i="status-late-minor";return t>600?i="status-late-severe":t>300&&(i="status-late-moderate"),{text:`+${s} min late`,colorClass:i}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function kt(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function W(t){const e=kt(t.serviceStatus),s=t.delayInfo.text;return`${e} (${s})`}function Mt(t,e,s){const i=t.tripStatus?.activeTripId??"";if(!vt[e.id].test(i))return null;const n=t.tripStatus?.closestStop,o=t.tripStatus?.nextStop,c=s.stationIndexByStopId.get(n),d=s.stationIndexByStopId.get(o);if(c==null&&d==null)return null;let r=c??d,m=d??c;if(r>m){const it=r;r=m,m=it}const u=s.stations[r],l=s.stations[m],p=t.tripStatus?.closestStopTimeOffset??0,f=t.tripStatus?.nextStopTimeOffset??0,g=H(e.id,i),b=e.directionLookup?.[g],Q=b==="1"?"▲":b==="0"?"▼":At(c,d,i);let w=0;r!==m&&p<0&&f>0&&(w=wt(Math.abs(p)/(Math.abs(p)+f),0,1));const tt=u.y+(l.y-u.y)*w,et=r!==m?u.segmentMinutes:0,nt=u.cumulativeMinutes+et*w,M=t.tripStatus?.scheduleDeviation??0,D=t.tripStatus?.predicted??!1,st=It(M,D);return{id:t.vehicleId,label:t.vehicleId.replace(/^40_/,""),directionSymbol:Q,fromLabel:u.label,minutePosition:nt,progress:w,serviceStatus:Et(t),toLabel:l.label,y:tt,currentLabel:u.label,nextLabel:l.label,status:t.tripStatus?.status??"",closestStop:n,nextStop:o,closestOffset:p,nextOffset:f,scheduleDeviation:M,isPredicted:D,delayInfo:st,rawVehicle:t}}function K(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function Dt(){return a.lines.flatMap(t=>(a.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function T(){return!a.compactLayout||a.lines.length<2?"":`<section class="line-switcher">${a.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===a.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function C(t,e=!1){const s=Date.now(),i=n=>{const o=n.arrivalTime,c=Math.floor((o-s)/1e3),d=F(c);let r="";if(n.distanceFromStop>0){const m=n.distanceFromStop>=1e3?`${(n.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(n.distanceFromStop)}m`,u=n.numberOfStopsAway===1?"1 stop away":`${n.numberOfStopsAway} stops away`;r=` • ${m} • ${u}`}return`
      <div class="arrival-item">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${n.lineColor};">${n.lineToken}</span>
          <span class="arrival-vehicle">${n.lineName} Train ${n.vehicleId}</span>
        </span>
        <span class="arrival-time">${d}<span class="arrival-precision">${r}</span></span>
      </div>
    `};if(e){I.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',k.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>';return}I.innerHTML=t.nb.length?t.nb.map(i).join(""):'<div class="arrival-item muted">No upcoming trains</div>',k.innerHTML=t.sb.length?t.sb.map(i).join(""):'<div class="arrival-item muted">No upcoming trains</div>'}function X(t,e){const s=new Set(e.stationAliases?.[t.id]??[]);s.add(t.id);const i=new Set;for(const o of s){const c=o.startsWith("40_")?o:`40_${o}`;i.add(c)}const n=t.id.replace(/-T\d+$/,"");return i.add(n.startsWith("40_")?n:`40_${n}`),[...i]}function xt(t){const e=a.lines.map(s=>{const i=s.stops.find(n=>n.id===t.id);return i?{line:s,station:i}:null}).filter(Boolean);return e.length>0?e:a.lines.map(s=>{const i=s.stops.find(n=>n.name===t.name);return i?{line:s,station:i}:null}).filter(Boolean)}function Rt(t){if(!t)return null;const e=t.trim().toLowerCase();for(const s of a.lines)for(const i of s.stops){const n=new Set([i.id,`40_${i.id}`,i.name,$(i.name),S(i.name),S($(i.name))]);for(const o of s.stationAliases?.[i.id]??[])n.add(o),n.add(`40_${o}`),n.add(S(o));if([...n].some(o=>String(o).toLowerCase()===e))return i}return null}function Ct(t){const e=new URL(window.location.href);e.searchParams.set("station",S(t.name)),window.history.pushState({},"",e)}function Y(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function V(){a.currentDialogStationId="",v.open?v.close():Y()}async function P(){const t=new URL(window.location.href).searchParams.get("station"),e=Rt(t);a.isSyncingFromUrl=!0;try{if(!e){a.currentDialogStationId="",v.open&&v.close();return}if(a.activeTab="map",h(),a.currentDialogStationId===e.id&&v.open)return;await J(e,!1)}finally{a.isSyncingFromUrl=!1}}function Pt(t,e){const s=H(e.id,t.tripId??""),i=e.directionLookup?.[s];if(i==="1")return"nb";if(i==="0")return"sb";const n=t.tripHeadsign??"";return/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function _t(t){return`40_${t.id}`}async function Ot(t){const e=`${ut}/arrivals-and-departures-for-stop/${t}.json?key=${mt}&minutesAfter=120`,s=await j(e,"Arrivals");if(s.code!==200)throw new Error(s.text||`Arrivals request failed for ${t}`);return s.data?.entry?.arrivalsAndDepartures??[]}async function z(t){const e=[...new Set(t)],s=await Promise.allSettled(e.map(n=>Ot(n))),i=[];for(const n of s)n.status==="fulfilled"&&i.push(...n.value);return i}function Nt(t,e){const s=Date.now(),i=new Set,n={nb:[],sb:[]};for(const o of t){if(o.routeId!==_t(e))continue;const c=o.predictedArrivalTime||o.scheduledArrivalTime;if(!c||c<=s)continue;const d=Pt(o,e);if(!d)continue;const r=`${o.tripId}:${o.stopId}:${c}`;i.has(r)||(i.add(r),n[d].push({vehicleId:(o.vehicleId||"").replace(/^40_/,"")||"--",arrivalTime:c,tripId:o.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0],distanceFromStop:o.distanceFromStop??0,numberOfStopsAway:o.numberOfStopsAway??0}))}return n.nb.sort((o,c)=>o.arrivalTime-c.arrivalTime),n.sb.sort((o,c)=>o.arrivalTime-c.arrivalTime),n.nb=n.nb.slice(0,4),n.sb=n.sb.slice(0,4),n}async function G(t,e,s=null){const i=`${e.id}:${t.id}`,n=a.arrivalsCache.get(i);if(n&&Date.now()-n.fetchedAt<pt)return n.value;const o=X(t,e),c=s??await z(o),d=Nt(c,e);return a.arrivalsCache.set(i,{fetchedAt:Date.now(),value:d}),d}function Bt(t){const e={nb:[],sb:[]};for(const s of t)e.nb.push(...s.nb),e.sb.push(...s.sb);return e.nb.sort((s,i)=>s.arrivalTime-i.arrivalTime),e.sb.sort((s,i)=>s.arrivalTime-i.arrivalTime),e}async function J(t,e=!0){gt.textContent=t.name,a.currentDialogStationId=t.id;const s=a.activeDialogRequest+1;a.activeDialogRequest=s,C({nb:[],sb:[]},!0),e&&Ct(t),v.showModal();try{const i=xt(t),n=i.flatMap(({station:d,line:r})=>X(d,r)),o=await z(n),c=await Promise.all(i.map(({station:d,line:r})=>G(d,r,o)));if(a.activeDialogRequest!==s||!v.open)return;C(Bt(c))}catch(i){if(a.activeDialogRequest!==s||!v.open)return;I.innerHTML=`<div class="arrival-item muted">${i.message}</div>`,k.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function Ut(t){const e=a.layouts.get(t.id),s=a.vehiclesByLine.get(t.id)??[],i=s.filter(r=>r.directionSymbol==="▲"),n=s.filter(r=>r.directionSymbol==="▼"),o=e.stations.map((r,m)=>{const u=e.stations[m-1],l=m>0?u.segmentMinutes:"";return`
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
      ${m.length?m.sort((u,l)=>u.minutePosition-l.minutePosition).map(u=>`<p class="train-readout"><span class="train-id">${u.label}</span>${K(u)} <span class="train-delay ${u.delayInfo.colorClass}">${W(u)}</span></p>`).join(""):'<p class="train-readout muted">No trains</p>'}
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
        ${o}
        ${c}
      </svg>
      <div class="line-readout line-readout-grid">
        ${d("NB",i)}
        ${d("SB",n)}
      </div>
    </article>
  `}function qt(){const t=Dt().sort((i,n)=>i.minutePosition-n.minutePosition);return t.length?(a.compactLayout?a.lines.filter(i=>i.id===a.activeLineId):a.lines).map(i=>{const n=t.filter(r=>r.lineId===i.id),o=n.filter(r=>r.directionSymbol==="▲"),c=n.filter(r=>r.directionSymbol==="▼"),d=(r,m)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${r}</p>
          ${m.length?m.map(u=>`
                      <article class="train-list-item">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${u.lineColor};">${u.lineToken}</span>
                          <div>
                            <p class="train-list-title">${u.lineName} Train ${u.label}</p>
                            <p class="train-list-subtitle">${K(u)}</p>
                            <p class="train-list-status ${u.delayInfo.colorClass}">${W(u)}</p>
                          </div>
                        </div>
                      </article>
                    `).join(""):'<p class="train-readout muted">No trains</p>'}
        </div>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${i.color};">${i.name[0]}</span>
              <div>
                <h2>${i.name}</h2>
                <p>${n.length} trains in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${d("NB",o)}
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
    `}function Ft(t){return new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function jt(t){const e=Date.now(),s={nb:[],sb:[]};for(const i of t.stops){const n=a.arrivalsCache.get(`${t.id}:${i.id}`)?.value;if(n)for(const o of["nb","sb"])for(const c of n[o]??[])!c.arrivalTime||c.arrivalTime<=e||s[o].push({...c,stationName:$(i.name)})}for(const i of["nb","sb"])s[i].sort((n,o)=>n.arrivalTime-o.arrivalTime),s[i]=s[i].slice(0,8);return s}function Ht(){const t=a.compactLayout?a.lines.filter(s=>s.id===a.activeLineId):a.lines,e=(s,i)=>`
    <div class="times-direction-column">
      <p class="direction-column-title">${s}</p>
      ${i.length?i.map(n=>{const o=Math.floor((n.arrivalTime-Date.now())/1e3),c=F(o),d=Ft(n.arrivalTime),r=n.numberOfStopsAway>0?n.numberOfStopsAway===1?"1 stop away":`${n.numberOfStopsAway} stops away`:"Boarding now",m=n.distanceFromStop>0?n.distanceFromStop>=1e3?`${(n.distanceFromStop/1e3).toFixed(1)} km away`:`${Math.round(n.distanceFromStop)} m away`:"At platform";return`
                  <article class="times-item">
                    <div class="times-item-main">
                      <div>
                        <p class="times-item-title">${n.stationName}</p>
                        <p class="times-item-subtitle">${n.lineName} Train ${n.vehicleId} • ${r} • ${m}</p>
                      </div>
                      <div class="times-item-right">
                        <p class="times-item-relative">${c}</p>
                        <p class="times-item-clock">${d}</p>
                      </div>
                    </div>
                  </article>
                `}).join(""):'<p class="train-readout muted">Open a station first to warm the live arrivals cache.</p>'}
    </div>
  `;return t.map(s=>{const i=jt(s),n=i.nb.length+i.sb.length;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${s.color};">${s.name[0]}</span>
              <div>
                <h2>${s.name}</h2>
                <p>${n} upcoming live arrivals in cache</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${e("NB",i.nb)}
            ${e("SB",i.sb)}
          </div>
        </article>
      `}).join("")}async function Z(){const t=a.compactLayout?a.lines.filter(e=>e.id===a.activeLineId):a.lines;await Promise.allSettled(t.flatMap(e=>e.stops.map(s=>G(s,e))))}function A(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",async()=>{a.activeLineId=e.dataset.lineSwitch,h(),a.activeTab==="times"&&(await Z(),a.activeTab==="times"&&h())})})}function Wt(){a.lines.forEach(t=>{const e=a.layouts.get(t.id),s=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!s)return;s.querySelectorAll(".station-group").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.stopId,c=e.stations.find(d=>d.id===o);c&&J(c)})})})}function h(){if(B.textContent=a.theme==="dark"?"Light":"Dark",E.textContent=a.error?"HOLD":"SYNC",E.classList.toggle("status-pill-error",!!a.error),U.textContent=a.error?"Using last successful snapshot":St(a.fetchedAt),N.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===a.activeTab)),a.activeTab==="map"){y.className="board";const t=a.compactLayout?a.lines.filter(e=>e.id===a.activeLineId):a.lines;y.innerHTML=`${T()}${t.map(Ut).join("")}`,A(),Wt();return}if(a.activeTab==="trains"){y.className="board",y.innerHTML=`${T()}${qt()}`,A();return}if(a.activeTab==="times"){y.className="board",y.innerHTML=`${T()}${Ht()}`,A();return}}async function Kt(){const e=await(await fetch(lt)).json();a.lines=e.lines,a.layouts=new Map(e.lines.map(s=>[s.id,Tt(s)]))}async function _(){try{const t=await j(dt,"Realtime");a.error="",a.fetchedAt=new Date().toISOString(),a.rawVehicles=t.data.list;for(const e of a.lines){const s=a.layouts.get(e.id),i=t.data.list.map(n=>Mt(n,e,s)).filter(Boolean);a.vehiclesByLine.set(e.id,i)}}catch(t){a.error="Realtime offline",console.error(t)}h()}async function Xt(){q(bt()),L(),await Kt(),h(),await _(),await P(),window.addEventListener("popstate",()=>{P().catch(console.error)}),window.addEventListener("resize",()=>{const t=a.compactLayout;L(),t!==a.compactLayout&&h()}),window.visualViewport?.addEventListener("resize",()=>{const t=a.compactLayout;L(),t!==a.compactLayout&&h()}),window.setInterval(_,15e3),window.setInterval(h,1e3)}Xt().catch(t=>{E.textContent="FAIL",U.textContent=t.message,console.error(t)});
