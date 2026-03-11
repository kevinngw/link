(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=a(o);fetch(o.href,s)}})();const ue="modulepreload",pe=function(t){return"/link/dev/"+t},pt={},me=function(e,a,n){let o=Promise.resolve();if(a&&a.length>0){let m=function(p){return Promise.all(p.map(c=>Promise.resolve(c).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};var r=m;document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");o=m(a.map(p=>{if(p=pe(p),p in pt)return;pt[p]=!0;const c=p.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${u}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":ue,c||(f.as="script"),f.crossOrigin="",f.href=p,d&&f.setAttribute("nonce",d),document.head.appendChild(f),c)return new Promise((g,v)=>{f.addEventListener("load",g),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${p}`)))})}))}function s(l){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=l,window.dispatchEvent(d),!d.defaultPrevented)throw l}return o.then(l=>{for(const d of l||[])d.status==="rejected"&&s(d.reason);return e().catch(s)})};function fe(t={}){const{immediate:e=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:o,onRegisteredSW:s,onRegisterError:r}=t;let l,d;const m=async(c=!0)=>{await d};async function p(){if("serviceWorker"in navigator){if(l=await me(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(c=>{r?.(c)}),!l)return;l.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),l.addEventListener("installed",c=>{c.isUpdate||n?.()}),l.register({immediate:e}).then(c=>{s?s("/link/dev/sw.js",c):o?.(c)}).catch(c=>{r?.(c)})}}return d=p(),m}const ge="./link-data.json",xt="https://api.pugetsound.onebusaway.org/api/where",G="TEST".trim()||"TEST",T=G==="TEST",he=T?6e4:2e4,mt=3,ve=800,ye=T?2e4:5e3,ft=T?12e4:3e4,gt=T?1200:0,q=T?1:3,be=1100,Se=T?45e3:15e3,we=T?9e4:3e4,Le=4e3,$e=15e3,Ct="link-pulse-theme",D="link",N={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},i={fetchedAt:"",error:"",activeSystemId:D,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0},Te=fe({immediate:!0,onNeedRefresh(){Te(!0)}});document.querySelector("#app").innerHTML=`
  <main class="screen">
    <header class="screen-header">
      <div>
        <p id="screen-kicker" class="screen-kicker">SEATTLE LIGHT RAIL</p>
        <h1 id="screen-title">LINK PULSE</h1>
      </div>
      <div class="screen-meta">
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">Light</button>
        <p id="status-pill" class="status-pill">SYNC</p>
        <p id="current-time" class="updated-at">Now --:--</p>
        <p id="updated-at" class="updated-at">Waiting for snapshot</p>
      </div>
    </header>
    <div class="switcher-stack">
      <section id="system-bar" class="tab-bar system-bar" aria-label="Transit systems"></section>
      <section class="tab-bar" aria-label="Board views">
        <button class="tab-button is-active" data-tab="map" type="button">Map</button>
        <button class="tab-button" data-tab="trains" type="button" id="tab-trains">Trains</button>
        <button class="tab-button" data-tab="insights" type="button">Insights</button>
      </section>
    </div>
    <section id="board" class="board"></section>
  </main>
  <dialog id="station-dialog" class="station-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="dialog-title">Station</h3>
        </div>
        <div class="dialog-actions">
          <div class="dialog-actions-top">
            <div id="dialog-direction-tabs" class="dialog-direction-tabs" aria-label="Board direction view">
              <button class="dialog-direction-tab is-active" data-dialog-direction="both" type="button">Both</button>
              <button class="dialog-direction-tab" data-dialog-direction="nb" type="button">NB</button>
              <button class="dialog-direction-tab" data-dialog-direction="sb" type="button">SB</button>
              <button class="dialog-direction-tab" data-dialog-direction="auto" type="button">Auto</button>
            </div>
            <p id="dialog-status-pill" class="status-pill">SYNC</p>
            <button id="dialog-display" class="dialog-close dialog-mode-button" type="button" aria-label="Toggle display mode">Board</button>
          </div>
          <div id="dialog-meta" class="dialog-meta">
            <p id="dialog-updated-at" class="updated-at">Waiting for snapshot</p>
          </div>
        </div>
      </header>
      <div id="station-alerts-container"></div>
      <div class="dialog-body">
        <div class="arrivals-section" data-direction-section="nb">
          <h4 class="arrivals-title">Northbound (▲)</h4>
          <div id="arrivals-nb-pinned" class="arrivals-pinned"></div>
          <div class="arrivals-viewport"><div id="arrivals-nb" class="arrivals-list"></div></div>
        </div>
        <div class="arrivals-section" data-direction-section="sb">
          <h4 class="arrivals-title">Southbound (▼)</h4>
          <div id="arrivals-sb-pinned" class="arrivals-pinned"></div>
          <div class="arrivals-viewport"><div id="arrivals-sb" class="arrivals-list"></div></div>
        </div>
      </div>
    </div>
  </dialog>
  <dialog id="train-dialog" class="station-dialog train-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="train-dialog-title">Train</h3>
          <p id="train-dialog-subtitle" class="updated-at">Current movement</p>
        </div>
        <div class="dialog-actions">
          <button id="train-dialog-close" class="dialog-close" type="button" aria-label="Close train dialog">&times;</button>
        </div>
      </header>
      <div class="train-dialog-body">
        <div id="train-dialog-line" class="train-detail-line"></div>
        <div id="train-dialog-status" class="train-detail-status"></div>
      </div>
    </div>
  </dialog>
  <dialog id="alert-dialog" class="station-dialog alert-dialog">
    <div class="dialog-content">
      <header class="dialog-header">
        <div>
          <h3 id="alert-dialog-title">Service Alert</h3>
          <p id="alert-dialog-subtitle" class="updated-at">Transit advisory</p>
        </div>
        <div class="dialog-actions">
          <button id="alert-dialog-close" class="dialog-close" type="button" aria-label="Close alert dialog">&times;</button>
        </div>
      </header>
      <div class="train-dialog-body">
        <p id="alert-dialog-lines" class="train-detail-status"></p>
        <p id="alert-dialog-body" class="alert-dialog-body"></p>
        <a id="alert-dialog-link" class="alert-dialog-link" href="" target="_blank" rel="noreferrer">Read official alert</a>
      </div>
    </div>
  </dialog>
`;const w=document.querySelector("#board"),Ie=document.querySelector("#screen-kicker"),De=document.querySelector("#screen-title"),ht=document.querySelector("#system-bar"),kt=[...document.querySelectorAll(".tab-button")],Rt=document.querySelector("#theme-toggle"),k=document.querySelector("#status-pill"),Ae=document.querySelector("#current-time"),j=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),Ee=document.querySelector("#dialog-title"),vt=document.querySelector("#dialog-status-pill"),Me=document.querySelector("#dialog-updated-at"),V=document.querySelector("#dialog-display"),Nt=[...document.querySelectorAll("[data-dialog-direction]")],A=document.querySelector("#station-alerts-container"),yt=document.querySelector("#arrivals-nb-pinned"),E=document.querySelector("#arrivals-nb"),bt=document.querySelector("#arrivals-sb-pinned"),M=document.querySelector("#arrivals-sb"),$=document.querySelector("#train-dialog"),xe=document.querySelector("#train-dialog-title"),Ce=document.querySelector("#train-dialog-subtitle"),St=document.querySelector("#train-dialog-line"),wt=document.querySelector("#train-dialog-status"),ke=document.querySelector("#train-dialog-close"),I=document.querySelector("#alert-dialog"),Re=document.querySelector("#alert-dialog-title"),Ne=document.querySelector("#alert-dialog-subtitle"),Pe=document.querySelector("#alert-dialog-lines"),Lt=document.querySelector("#alert-dialog-body"),$t=document.querySelector("#alert-dialog-link"),Be=document.querySelector("#alert-dialog-close");V.addEventListener("click",()=>la());ke.addEventListener("click",()=>nt());Be.addEventListener("click",()=>st());Nt.forEach(t=>{t.addEventListener("click",()=>{i.dialogDisplayDirection=t.dataset.dialogDirection,i.dialogDisplayDirection==="auto"&&(i.dialogDisplayAutoPhase="nb"),Q()})});h.addEventListener("click",t=>{t.target===h&&Gt()});$.addEventListener("click",t=>{t.target===$&&nt()});I.addEventListener("click",t=>{t.target===I&&st()});h.addEventListener("close",()=>{tt(),et(),J(),Z(!1),i.isSyncingFromUrl||Vt()});kt.forEach(t=>{t.addEventListener("click",()=>{i.activeTab=t.dataset.tab,b()})});Rt.addEventListener("click",()=>{Pt(i.theme==="dark"?"light":"dark"),b()});function K(){return N[i.activeSystemId]??N[D]}function _e(){return i.systemsById.get(i.activeSystemId)?.agencyId??N[D].agencyId}function Oe(){return`${xt}/vehicles-for-agency/${_e()}.json?key=${G}`}function L(){return K().vehicleLabel??"Vehicle"}function qe(t){return/bus$/i.test(t)?`${t}es`:`${t}s`}function y(){return K().vehicleLabelPlural??qe(L())}function P(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function Ue(){const t=window.localStorage.getItem(Ct);return t==="light"||t==="dark"?t:"dark"}function Pt(t){i.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(Ct,t)}function Tt(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);i.compactLayout=n<=be}function B(){const a=window.getComputedStyle(w).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==i.compactLayout&&(i.compactLayout=a,b())}function R(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function U(t,e,a){return Math.max(e,Math.min(t,a))}function He(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function Fe(){return new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit"}).format(new Date)}function _(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),a=t%60;return e>0?`${e}m ${a}s`:`${a}s`}function We(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function It(t){if(!t)return"";const[e="0",a="0"]=String(t).split(":"),n=Number(e),o=Number(a),s=(n%24+24)%24,r=s>=12?"PM":"AM";return`${s%12||12}:${String(o).padStart(2,"0")} ${r}`}function Bt(t){const e=We(),a=t.serviceSpansByDate?.[e];return a?`Today ${It(a.start)} - ${It(a.end)}`:"Today service hours unavailable"}function _t(t){return String(t||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function Ot(t){return String(t||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function O(t){return i.alerts.filter(e=>e.lineIds.includes(t))}function qt(t,e){const a=O(e.id);if(!a.length)return[];const n=new Set(X(t,e));return n.add(t.id),a.filter(o=>o.stopIds.length>0&&o.stopIds.some(s=>n.has(s)))}function je(t){const e=new Set,a=[];for(const{station:n,line:o}of jt(t))for(const s of qt(n,o))e.has(s.id)||(e.add(s.id),a.push(s));return a}function Ut(t,e){return t.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${e}">
      <span class="line-alert-badge-count">${t.length}</span>
      <span class="line-alert-badge-copy">alert${t.length===1?"":"s"}</span>
    </button>
  `:""}function z(t){return new Promise(e=>window.setTimeout(e,t))}function Ve(){const t=Math.max(0,i.obaRateLimitStreak-1),e=Math.min(ft,ye*2**t),a=Math.round(e*(.15+Math.random()*.2));return Math.min(ft,e+a)}async function Ye(){const t=i.obaCooldownUntil-Date.now();t>0&&await z(t)}function Ge(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function Ht(t,e){for(let a=0;a<=mt;a+=1){await Ye();const n=await fetch(t,{cache:"no-store"});let o=null;try{o=await n.json()}catch{o=null}const s=n.status===429||Ge(o);if(n.ok&&!s)return i.obaRateLimitStreak=0,i.obaCooldownUntil=0,o;if(a===mt||!s)throw o?.text?new Error(o.text):new Error(`${e} request failed with ${n.status}`);i.obaRateLimitStreak+=1;const r=ve*2**a,l=Math.max(r,Ve());i.obaCooldownUntil=Date.now()+l,await z(l)}throw new Error(`${e} request failed`)}function Ke(t){const e=[...t.stops].sort((c,u)=>u.sequence-c.sequence),a=48,n=44,o=28,s=88,r=122,l=n+o+(e.length-1)*a,d=new Map,m=e.map((c,u)=>{const f={...c,label:P(c.name),y:n+u*a,index:u,isTerminal:u===0||u===e.length-1};d.set(c.id,u),d.set(`${t.agencyId}_${c.id}`,u);for(const g of t.stationAliases?.[c.id]??[])d.set(g,u),d.set(`${t.agencyId}_${g}`,u);return f});let p=0;for(let c=0;c<m.length;c+=1)m[c].cumulativeMinutes=p,p+=c<m.length-1?m[c].segmentMinutes:0;return{totalMinutes:p,height:l,labelX:r,stationGap:a,stationIndexByStopId:d,stations:m,trackX:s}}function ze(t,e){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":"•"}function Xe(t){const e=t.tripStatus??{},a=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const n=e.nextStopTimeOffset??0,o=e.scheduleDeviation??0,s=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return a==="approaching"||s&&Math.abs(n)<=90?"ARR":o>=120?"DELAY":"OK"}function Ze(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const a=Math.round(t/60);let n="status-late-minor";return t>600?n="status-late-severe":t>300&&(n="status-late-moderate"),{text:`+${a} min late`,colorClass:n}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function Je(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function Qe(t){const e=Je(t.serviceStatus),a=t.delayInfo.text;return`${e} (${a})`}function ta(t,e,a,n){const o=t.tripStatus?.activeTripId??t.tripId??"",s=n.get(o);if(!s||s.routeId!==e.routeKey)return null;const r=t.tripStatus?.closestStop,l=t.tripStatus?.nextStop,d=a.stationIndexByStopId.get(r),m=a.stationIndexByStopId.get(l);if(d==null&&m==null)return null;let p=d??m,c=m??d;if(p>c){const de=p;p=c,c=de}const u=a.stations[p],f=a.stations[c],g=t.tripStatus?.closestStopTimeOffset??0,v=t.tripStatus?.nextStopTimeOffset??0,S=s.directionId==="1"?"▲":s.directionId==="0"?"▼":ze(d,m);let x=0;p!==c&&g<0&&v>0&&(x=U(Math.abs(g)/(Math.abs(g)+v),0,1));const ie=u.y+(f.y-u.y)*x,ne=p!==c?u.segmentMinutes:0,se=u.cumulativeMinutes+ne*x,C=d??m??p,rt=a.stations[C]??u,lt=S==="▲",oe=U(C+(lt?1:-1),0,a.stations.length-1),ct=d!=null&&m!=null&&d!==m?m:U(C+(lt?-1:1),0,a.stations.length-1),re=a.stations[oe]??rt,le=a.stations[ct]??f,dt=t.tripStatus?.scheduleDeviation??0,ut=t.tripStatus?.predicted??!1,ce=Ze(dt,ut);return{id:t.vehicleId,label:t.vehicleId.replace(/^\d+_/,""),directionSymbol:S,fromLabel:u.label,minutePosition:se,progress:x,serviceStatus:Xe(t),toLabel:f.label,y:ie,currentLabel:u.label,nextLabel:f.label,previousLabel:re.label,currentStopLabel:rt.label,upcomingLabel:le.label,currentIndex:C,upcomingStopIndex:ct,status:t.tripStatus?.status??"",closestStop:r,nextStop:l,closestOffset:g,nextOffset:v,scheduleDeviation:dt,isPredicted:ut,delayInfo:ce,rawVehicle:t}}function ea(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function Ft(){return i.lines.flatMap(t=>(i.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function aa(){return Object.values(N).filter(t=>i.systemsById.has(t.id)).map(t=>`
        <button
          class="tab-button ${t.id===i.activeSystemId?"is-active":""}"
          data-system-switch="${t.id}"
          type="button"
        >
          ${t.label}
        </button>
      `).join("")}function H(){return!i.compactLayout||i.lines.length<2?"":`<section class="line-switcher">${i.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===i.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function ia(t,e){const a=[...t].sort((s,r)=>s.minutePosition-r.minutePosition),n=[...e].sort((s,r)=>s.minutePosition-r.minutePosition),o=s=>s.slice(1).map((r,l)=>Math.round(r.minutePosition-s[l].minutePosition));return{nbGaps:o(a),sbGaps:o(n)}}function na(t,e){if(!t.length||e<2)return{averageText:"—",detailText:`Too few ${y().toLowerCase()} for a spacing read`};const a=Math.round(t.reduce((s,r)=>s+r,0)/t.length),n=Math.min(...t),o=Math.max(...t);return{averageText:`~${a} min`,detailText:`${n}-${o} min observed gap`}}function Dt(t,e,a){const{averageText:n,detailText:o}=na(e,a);return`
    <div class="headway-health-card">
      <p class="headway-health-label">${t}</p>
      <p class="headway-health-value">${n}</p>
      <p class="headway-health-copy">${o}</p>
    </div>
  `}function sa(t,e,a){const n=e.length+a.length;if(!n)return"";const{nbGaps:o,sbGaps:s}=ia(e,a),l=[...e,...a].reduce((v,S)=>v+S.scheduleDeviation,0)/n,d=Math.round(Math.abs(l)/60),m=l<30?"On time":`+${d} min late`,p=[...o,...s],c=p.length?Math.min(...p):null,u=L(),f=y(),g=p.length?`
      <div class="headway-chart">
        <div class="headway-chart-header">
          <p class="headway-chart-title">Live ${u} Gaps</p>
          <p class="headway-chart-copy">Minutes between consecutive ${f.toLowerCase()} by direction</p>
        </div>
        <div class="headway-chart-grid">
          ${o.map((v,S)=>`
            <div class="headway-bucket ${v===c?"is-current":""}">
              <p class="headway-bucket-label">NB gap ${S+1}</p>
              <p class="headway-bucket-value">${v} min</p>
            </div>
          `).join("")}
          ${s.map((v,S)=>`
            <div class="headway-bucket ${v===c?"is-current":""}">
              <p class="headway-bucket-label">SB gap ${S+1}</p>
              <p class="headway-bucket-value">${v} min</p>
            </div>
          `).join("")}
        </div>
      </div>
    `:"";return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">Active</p>
          <p class="metric-chip-value">${n}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">Dir A (▲)</p>
          <p class="metric-chip-value">${e.length}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">Dir B (▼)</p>
          <p class="metric-chip-value">${a.length}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">Avg Delay</p>
          <p class="metric-chip-value">${m}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${Dt("NB Spacing",o,e.length)}
        ${Dt("SB Spacing",s,a.length)}
      </div>
      ${g}
    </div>
  `}function Wt(t,e=!1){const a=Date.now(),n=s=>{const r=s.arrivalTime,l=Math.floor((r-a)/1e3),d=_(l),m=zt(s.arrivalTime,s.scheduleDeviation??0),p=at(m);let c="";if(s.distanceFromStop>0){const u=s.distanceFromStop>=1e3?`${(s.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(s.distanceFromStop)}m`,f=s.numberOfStopsAway===1?"1 stop away":`${s.numberOfStopsAway} stops away`;c=` • ${u} • ${f}`}return`
      <div class="arrival-item" data-arrival-time="${s.arrivalTime}" data-schedule-deviation="${s.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${s.lineColor};">${s.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${s.lineName} ${L()} ${s.vehicleId}</span>
            <span class="arrival-destination">To ${s.destination}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${p}">${m}</span>
          <span class="arrival-time"><span class="arrival-countdown">${d}</span><span class="arrival-precision">${c}</span></span>
        </span>
      </div>
    `};if(e){yt.innerHTML="",bt.innerHTML="",E.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',M.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',Y();return}const o=(s,r,l)=>{if(!s.length){r.innerHTML="",l.innerHTML=`<div class="arrival-item muted">No upcoming ${y().toLowerCase()}</div>`;return}const d=i.dialogDisplayMode?s.slice(0,2):[],m=i.dialogDisplayMode?s.slice(2):s;r.innerHTML=d.map(n).join(""),l.innerHTML=m.length?m.map(n).join(""):i.dialogDisplayMode?`<div class="arrival-item muted">No additional ${y().toLowerCase()}</div>`:""};o(t.nb,yt,E),o(t.sb,bt,M),Y()}function X(t,e){const a=new Set(e.stationAliases?.[t.id]??[]);a.add(t.id);const n=new Set;for(const s of a){const r=s.startsWith(`${e.agencyId}_`)?s:`${e.agencyId}_${s}`;n.add(r)}const o=t.id.replace(/-T\d+$/,"");return n.add(o.startsWith(`${e.agencyId}_`)?o:`${e.agencyId}_${o}`),[...n]}function jt(t){const e=i.lines.map(a=>{const n=a.stops.find(o=>o.id===t.id);return n?{line:a,station:n}:null}).filter(Boolean);return e.length>0?e:i.lines.map(a=>{const n=a.stops.find(o=>o.name===t.name);return n?{line:a,station:n}:null}).filter(Boolean)}function oa(t){if(!t)return null;const e=t.trim().toLowerCase();for(const a of i.lines)for(const n of a.stops){const o=new Set([n.id,`${a.agencyId}_${n.id}`,n.name,P(n.name),R(n.name),R(P(n.name))]);for(const s of a.stationAliases?.[n.id]??[])o.add(s),o.add(`${a.agencyId}_${s}`),o.add(R(s));if([...o].some(s=>String(s).toLowerCase()===e))return n}return null}function ra(t){const e=new URL(window.location.href);e.searchParams.set("station",R(t.name)),window.history.pushState({},"",e)}function Vt(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function At(t){const e=new URL(window.location.href);t===D?e.searchParams.delete("system"):e.searchParams.set("system",t),window.history.pushState({},"",e)}function Yt(){const e=new URL(window.location.href).searchParams.get("system");return e&&i.systemsById.has(e)?e:D}function Z(t){i.dialogDisplayMode=t,h.classList.toggle("is-display-mode",t),V.textContent=t?"Exit":"Board",V.setAttribute("aria-label",t?"Exit display mode":"Toggle display mode"),i.dialogDisplayDirection="both",i.dialogDisplayAutoPhase="nb",Q(),h.open&&i.currentDialogStation&&it(i.currentDialogStation).catch(console.error),Y()}function la(){Z(!i.dialogDisplayMode)}function J(){i.dialogDisplayDirectionTimer&&(window.clearInterval(i.dialogDisplayDirectionTimer),i.dialogDisplayDirectionTimer=0)}function Q(){J();const t=i.dialogDisplayDirection,e=t==="auto"?i.dialogDisplayAutoPhase:t;Nt.forEach(a=>{a.classList.toggle("is-active",a.dataset.dialogDirection===t)}),h.classList.toggle("show-nb-only",i.dialogDisplayMode&&e==="nb"),h.classList.toggle("show-sb-only",i.dialogDisplayMode&&e==="sb"),i.dialogDisplayMode&&t==="auto"&&(i.dialogDisplayDirectionTimer=window.setInterval(()=>{i.dialogDisplayAutoPhase=i.dialogDisplayAutoPhase==="nb"?"sb":"nb",Q()},$e))}function tt(){i.dialogRefreshTimer&&(window.clearTimeout(i.dialogRefreshTimer),i.dialogRefreshTimer=0)}function et(){i.dialogDisplayTimer&&(window.clearInterval(i.dialogDisplayTimer),i.dialogDisplayTimer=0)}function F(t,e){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(t.style.transform="translateY(0)",!i.dialogDisplayMode||a.length<=3)return;const n=Number.parseFloat(window.getComputedStyle(t).rowGap||"0")||0,o=a[0].getBoundingClientRect().height+n,s=Math.max(0,a.length-3),r=Math.min(i.dialogDisplayIndexes[e],s);t.style.transform=`translateY(-${r*o}px)`}function Y(){et(),i.dialogDisplayIndexes={nb:0,sb:0},F(E,"nb"),F(M,"sb"),i.dialogDisplayMode&&(i.dialogDisplayTimer=window.setInterval(()=>{for(const[t,e]of[["nb",E],["sb",M]]){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const n=Math.max(0,a.length-3);i.dialogDisplayIndexes[t]=i.dialogDisplayIndexes[t]>=n?0:i.dialogDisplayIndexes[t]+1,F(e,t)}},Le))}function ca(){if(!h.open)return;h.querySelectorAll(".arrival-item[data-arrival-time]").forEach(e=>{const a=Number(e.dataset.arrivalTime),n=Number(e.dataset.scheduleDeviation||0),o=e.querySelector(".arrival-countdown"),s=e.querySelector(".arrival-status");if(!o||!s)return;o.textContent=_(Math.floor((a-Date.now())/1e3));const r=zt(a,n),l=at(r);s.textContent=r,s.className=`arrival-status arrival-status-${l}`})}function da(){if(tt(),!i.currentDialogStation)return;const t=()=>{i.dialogRefreshTimer=window.setTimeout(async()=>{!h.open||!i.currentDialogStation||(await it(i.currentDialogStation).catch(console.error),t())},we)};t()}function Gt(){i.currentDialogStationId="",i.currentDialogStation=null,h.open?h.close():(tt(),et(),J(),Z(!1),Vt())}async function Et(){const t=Yt();t!==i.activeSystemId&&await ae(t,{updateUrl:!1,preserveDialog:!1});const e=new URL(window.location.href).searchParams.get("station"),a=oa(e);i.isSyncingFromUrl=!0;try{if(!a){i.currentDialogStationId="",h.open&&h.close();return}if(i.activeTab="map",b(),i.currentDialogStationId===a.id&&h.open)return;await Jt(a,!1)}finally{i.isSyncingFromUrl=!1}}function ua(t,e){const a=e.directionLookup?.[t.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const n=t.tripHeadsign??"",o=n.toLowerCase();return e.nbTerminusPrefix&&o.startsWith(e.nbTerminusPrefix)?"nb":e.sbTerminusPrefix&&o.startsWith(e.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function Kt(t){return t.routeKey??`${t.agencyId}_${t.id}`}function pa(t){const e=t.tripHeadsign?.trim();return e?P(e.replace(/^to\s+/i,"")):"Terminal"}function zt(t,e){return Math.floor((t-Date.now())/1e3)<=90?"ARR":e>=120?"DELAY":"ON TIME"}function at(t){return t==="DELAY"?"delay":t==="ARR"?"arr":"ok"}async function ma(t){const e=`${xt}/arrivals-and-departures-for-stop/${t}.json?key=${G}&minutesAfter=120`,a=await Ht(e,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${t}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function Xt(t){const e=[...new Set(t)],a=[],n=[];for(let o=0;o<e.length;o+=q){const s=e.slice(o,o+q),r=await Promise.allSettled(s.map(l=>ma(l)));a.push(...r),gt>0&&o+q<e.length&&await z(gt)}for(const o of a)o.status==="fulfilled"&&n.push(...o.value);return n}function fa(t,e){const a=Date.now(),n=new Set,o={nb:[],sb:[]};for(const s of t){if(s.routeId!==Kt(e))continue;const r=s.predictedArrivalTime||s.scheduledArrivalTime;if(!r||r<=a)continue;const l=ua(s,e);if(!l)continue;const d=`${s.tripId}:${s.stopId}:${r}`;n.has(d)||(n.add(d),o[l].push({vehicleId:(s.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:r,destination:pa(s),scheduleDeviation:s.scheduleDeviation??0,tripId:s.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0],distanceFromStop:s.distanceFromStop??0,numberOfStopsAway:s.numberOfStopsAway??0}))}return o.nb.sort((s,r)=>s.arrivalTime-r.arrivalTime),o.sb.sort((s,r)=>s.arrivalTime-r.arrivalTime),o.nb=o.nb.slice(0,4),o.sb=o.sb.slice(0,4),o}async function ga(t,e,a=null){const n=`${i.activeSystemId}:${e.id}:${t.id}`,o=i.arrivalsCache.get(n);if(o&&Date.now()-o.fetchedAt<he)return o.value;const s=X(t,e),r=a??await Xt(s),l=fa(r,e);return i.arrivalsCache.set(n,{fetchedAt:Date.now(),value:l}),l}function ha(t){const e={nb:[],sb:[]};for(const a of t)e.nb.push(...a.nb),e.sb.push(...a.sb);return e.nb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e.sb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e}function Zt(t){const e=je(t);if(!e.length){A.innerHTML="",A.hidden=!0;return}A.hidden=!1,A.innerHTML=`
    <div class="station-alerts">
      ${e.map((a,n)=>`
        <button class="station-alert-pill" data-alert-idx="${n}" type="button">
          <span class="station-alert-pill-meta">${Ot(a.severity)} · ${_t(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||"Service alert"}</span>
        </button>
      `).join("")}
    </div>
  `,A.querySelectorAll(".station-alert-pill").forEach(a=>{const n=e[Number(a.dataset.alertIdx)];n&&a.addEventListener("click",()=>{const o=i.lines.find(s=>n.lineIds.includes(s.id));o&&Qt(o)})})}async function Jt(t,e=!0){Ee.textContent=t.name,i.currentDialogStationId=t.id,i.currentDialogStation=t,Zt(t),Wt({nb:[],sb:[]},!0),e&&ra(t),h.showModal(),da(),await it(t)}async function it(t){const e=i.activeDialogRequest+1;i.activeDialogRequest=e;try{const a=jt(t),n=a.flatMap(({station:r,line:l})=>X(r,l)),o=await Xt(n),s=await Promise.all(a.map(({station:r,line:l})=>ga(r,l,o)));if(i.activeDialogRequest!==e||!h.open)return;Zt(t),Wt(ha(s))}catch(a){if(i.activeDialogRequest!==e||!h.open)return;E.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,M.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function va(t){const e=i.layouts.get(t.id),a=i.vehiclesByLine.get(t.id)??[],n=O(t.id),o=e.stations.map((l,d)=>{const m=e.stations[d-1],p=d>0?m.segmentMinutes:"",u=qt(l,t).length>0,f=l.isTerminal?15:10;return`
        <g transform="translate(0, ${l.y})" class="station-group${u?" has-alert":""}" data-stop-id="${l.id}" style="cursor: pointer;">
          ${d>0?`<text x="0" y="-14" class="segment-time">${p}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${l.isTerminal?11:5}" class="${l.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${l.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          ${u?`<circle cx="${e.trackX+f}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${l.label}</text>
          <rect x="0" y="-24" width="300" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),s=a.map((l,d)=>`
        <g transform="translate(${e.trackX}, ${l.y+(d%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${d*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${l.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),r=L();return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <div class="line-title-row">
              <h2>${t.name}</h2>
              ${Ut(n,t.id)}
            </div>
            <p>${a.length} live ${a.length===1?r.toLowerCase():y().toLowerCase()}</p>
            <p>${Bt(t)}</p>
          </div>
        </div>
      </header>
      <svg viewBox="0 0 360 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${o}
        ${s}
      </svg>
    </article>
  `}function ya(){const t=Ft().sort((r,l)=>r.minutePosition-l.minutePosition),e=L(),a=y(),n=a.toLowerCase();return t.length?(i.compactLayout?i.lines.filter(r=>r.id===i.activeLineId):i.lines).map(r=>{const l=t.filter(u=>u.lineId===r.id),d=O(r.id),m=l.filter(u=>u.directionSymbol==="▲"),p=l.filter(u=>u.directionSymbol==="▼"),c=(u,f)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${u}</p>
          ${f.length?f.map(g=>`
                      <article class="train-list-item" data-train-id="${g.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${g.lineColor};">${g.lineToken}</span>
                          <div>
                            <p class="train-list-title">${g.lineName} ${e} ${g.label}</p>
                            <p class="train-list-subtitle">${ea(g)}</p>
                            <p class="train-list-status ${g.delayInfo.colorClass}">${Qe(g)}</p>
                          </div>
                        </div>
                      </article>
                    `).join(""):`<p class="train-readout muted">No ${y().toLowerCase()}</p>`}
        </div>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${r.color};">${r.name[0]}</span>
              <div>
                <div class="line-title-row">
                  <h2>${r.name}</h2>
                  ${Ut(d,r.id)}
                </div>
                <p>${l.length} ${l.length===1?e.toLowerCase():y().toLowerCase()} in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${c("NB",m)}
            ${c("SB",p)}
          </div>
        </article>
      `}).join(""):`
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>Active ${a}</h2>
          <p>No live ${n}</p>
        </article>
      </section>
    `}function ba(t){return new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function Sa(t){return ba(Date.now()+Math.max(0,t)*1e3)}function wa(t,e){const a=t.directionSymbol==="▲"?0:e.stations.length-1;return e.stations[a]?.label??t.upcomingLabel}function La(t,e,a=6){if(!e?.stations?.length)return[];const n=t.directionSymbol==="▲"?-1:1,o=[],s=new Set,r=t.upcomingStopIndex??t.currentIndex,l=Math.max(0,t.nextOffset??0),d=(p,c,{isNext:u=!1,isTerminal:f=!1}={})=>{if(p==null||s.has(p))return;const g=e.stations[p];g&&(s.add(p),o.push({id:`${t.id}:${g.id}`,label:g.label,etaSeconds:Math.max(0,Math.round(c)),clockTime:Sa(c),isNext:u,isTerminal:f}))};d(r,l,{isNext:!0});let m=l;for(let p=r+n;o.length<a&&!(p<0||p>=e.stations.length);p+=n){const c=p-n,u=e.stations[c];m+=Math.max(0,Math.round((u?.segmentMinutes??0)*60));const f=p===0||p===e.stations.length-1;d(p,m,{isTerminal:f})}return o}function $a(){const t=i.compactLayout?i.lines.filter(a=>a.id===i.activeLineId):i.lines,e=L();return t.map(a=>{const n=i.vehiclesByLine.get(a.id)??[],o=n.filter(l=>l.directionSymbol==="▲"),s=n.filter(l=>l.directionSymbol==="▼"),r=sa(a,o,s);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${a.color};">${a.name[0]}</span>
              <div>
                <h2>${a.name}</h2>
                <p>${n.length} live ${n.length===1?L().toLowerCase():y().toLowerCase()} · ${Bt(a)}</p>
              </div>
            </div>
          </header>
          ${r||`<p class="train-readout muted">Waiting for live ${e.toLowerCase()} data…</p>`}
        </article>
      `}).join("")}function Ta(){document.querySelectorAll("[data-system-switch]").forEach(e=>{e.addEventListener("click",async()=>{await ae(e.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function W(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{i.activeLineId=e.dataset.lineSwitch,b()})})}function nt(){i.currentTrainId="",$.open&&$.close()}function st(){I.open&&I.close()}function Qt(t){const e=O(t.id);Re.textContent=`${t.name} Alerts`,Ne.textContent=`${e.length} active alert${e.length===1?"":"s"}`,Pe.textContent=t.name,Lt.textContent="",Lt.innerHTML=e.length?e.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${Ot(a.severity)} • ${_t(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||"Service alert"}</p>
              <p class="alert-dialog-item-copy">${a.description||"No additional alert details available."}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">Read official alert</a></p>`:""}
            </article>
          `).join(""):'<p class="alert-dialog-item-copy">No active alerts.</p>',$t.hidden=!0,$t.removeAttribute("href"),I.open||I.showModal()}function Mt(){document.querySelectorAll("[data-alert-line-id]").forEach(e=>{e.addEventListener("click",()=>{const a=i.lines.find(n=>n.id===e.dataset.alertLineId);a&&Qt(a)})})}function Ia(t){const e=t.fromLabel!==t.toLabel&&t.progress>0&&t.progress<1,a=e?t.fromLabel:t.previousLabel,n=e?`${t.fromLabel} -> ${t.toLabel}`:t.currentStopLabel,o=e?"Between":"Now",s=e?t.toLabel:t.upcomingLabel,r=e?t.progress:.5,l=i.layouts.get(t.lineId),d=La(t,l),m=l?wa(t,l):t.upcomingLabel,p=d.at(-1)?.etaSeconds??Math.max(0,t.nextOffset??0),c=t.directionSymbol==="▲"?"Northbound":t.directionSymbol==="▼"?"Southbound":"In service";xe.textContent=`${t.lineName} ${L()} ${t.label}`,Ce.textContent=`${c} to ${m}`,wt.className=`train-detail-status train-list-status-${at(t.serviceStatus)}`,wt.innerHTML=renderStatusPills(getVehicleStatusPills(t)),$.querySelector(".train-eta-panel")?.remove(),St.innerHTML=`
    <div class="train-detail-spine" style="--line-color:${t.lineColor};"></div>
    <div
      class="train-detail-marker-floating"
      style="--line-color:${t.lineColor}; --segment-progress:${r}; --direction-offset:${t.directionSymbol==="▼"?"10px":"-10px"};"
    >
      <span class="train-detail-vehicle-marker">
        <svg viewBox="-10 -10 20 20" class="train-detail-arrow" aria-hidden="true">
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${t.directionSymbol==="▼"?"rotate(180)":""}"></path>
        </svg>
      </span>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">Previous</p>
        <p class="train-detail-name">${a}</p>
      </div>
    </div>
    <div class="train-detail-stop is-current">
      <span class="train-detail-marker train-detail-marker-ghost"></span>
      <div>
        <p class="train-detail-label">${o}</p>
        <p class="train-detail-name">${n}</p>
      </div>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">Next</p>
        <p class="train-detail-name">${s}</p>
      </div>
    </div>
  `,St.insertAdjacentHTML("afterend",`
      <section class="train-eta-panel">
        <div class="train-eta-summary">
          <div class="metric-chip">
            <p class="metric-chip-label">Direction</p>
            <p class="metric-chip-value">${c}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">Terminal</p>
            <p class="metric-chip-value">${m}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">ETA to Terminal</p>
            <p class="metric-chip-value">${_(p)}</p>
          </div>
        </div>
        <div class="train-eta-timeline">
          <div class="train-eta-header">
            <p class="train-detail-label">Upcoming stops</p>
            <p class="train-eta-header-copy">Live ETA now</p>
          </div>
          ${d.length?d.map(u=>`
                  <article class="train-eta-stop${u.isNext?" is-next":""}${u.isTerminal?" is-terminal":""}">
                    <div>
                      <p class="train-eta-stop-label">${u.isNext?"Next stop":u.isTerminal?"Terminal":"Upcoming"}</p>
                      <p class="train-eta-stop-name">${u.label}</p>
                    </div>
                    <div class="train-eta-stop-side">
                      <p class="train-eta-stop-countdown">${_(u.etaSeconds)}</p>
                      <p class="train-eta-stop-clock">${u.clockTime}</p>
                    </div>
                  </article>
                `).join(""):'<p class="train-readout muted">No downstream ETA available for this train right now.</p>'}
        </div>
      </section>
    `),$.open||$.showModal()}function Da(){document.querySelectorAll("[data-train-id]").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.trainId,n=Ft().find(o=>o.id===a);n&&(i.currentTrainId=a,Ia(n))})})}function Aa(){i.lines.forEach(t=>{const e=i.layouts.get(t.id),a=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.stopId,r=e.stations.find(l=>l.id===s);r&&Jt(r)})})})}function b(){const t=K();if(Rt.textContent=i.theme==="dark"?"Light":"Dark",Ie.textContent=t.kicker,De.textContent=t.title,ht.hidden=i.systemsById.size<2,ht.innerHTML=aa(),te(),kt.forEach(e=>e.classList.toggle("is-active",e.dataset.tab===i.activeTab)),document.querySelector("#tab-trains").textContent=y(),Ta(),i.activeTab==="map"){w.className="board";const e=i.compactLayout?i.lines.filter(a=>a.id===i.activeLineId):i.lines;w.innerHTML=`${H()}${e.map(va).join("")}`,W(),Mt(),Aa(),queueMicrotask(B);return}if(i.activeTab==="trains"){w.className="board",w.innerHTML=`${H()}${ya()}`,W(),Mt(),Da(),queueMicrotask(B);return}i.activeTab==="insights"&&(w.className="board",w.innerHTML=`${H()}${$a()}`,W())}function te(){k.textContent=i.error?"HOLD":"SYNC",k.classList.toggle("status-pill-error",!!i.error),Ae.textContent=`Now ${Fe()}`,j.textContent=i.error?"Using last successful snapshot":He(i.fetchedAt),vt.textContent=k.textContent,vt.classList.toggle("status-pill-error",!!i.error),Me.textContent=j.textContent}function Ea(){window.clearTimeout(i.liveRefreshTimer),i.liveRefreshTimer=0}function Ma(){Ea();const t=()=>{i.liveRefreshTimer=window.setTimeout(async()=>{await ot(),t()},Se)};t()}function ee(t){const e=i.systemsById.has(t)?t:D,a=i.systemsById.get(e);i.activeSystemId=e,i.lines=a?.lines??[],i.layouts=i.layoutsBySystem.get(e)??new Map,i.lines.some(n=>n.id===i.activeLineId)||(i.activeLineId=i.lines[0]?.id??""),i.vehiclesByLine=new Map,i.rawVehicles=[],i.arrivalsCache.clear(),i.alerts=[],i.error="",i.fetchedAt=""}async function ae(t,{updateUrl:e=!0,preserveDialog:a=!1}={}){if(!i.systemsById.has(t)||i.activeSystemId===t){e&&At(i.activeSystemId);return}ee(t),a||Gt(),nt(),st(),b(),e&&At(t),await ot()}async function xa(){const a=(await(await fetch(ge,{cache:"no-store"})).json()).systems??[];i.systemsById=new Map(a.map(n=>[n.id,n])),i.layoutsBySystem=new Map(a.map(n=>[n.id,new Map(n.lines.map(o=>[o.id,Ke(o)]))])),ee(Yt())}function Ca(t){const e=[...new Set((t.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=i.lines.filter(n=>e.includes(Kt(n))).map(n=>n.id);return a.length?{id:t.id,effect:t.reason??"SERVICE ALERT",severity:t.severity??"INFO",title:t.summary?.value??"Service alert",description:t.description?.value??"",url:t.url?.value??"",lineIds:a,stopIds:[...new Set((t.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function ot(){try{const t=await Ht(Oe(),"Realtime");i.error="",i.fetchedAt=new Date().toISOString(),i.rawVehicles=t.data.list??[],i.alerts=(t.data.references?.situations??[]).map(Ca).filter(Boolean);const e=new Map((t.data.references?.trips??[]).map(a=>[a.id,a]));for(const a of i.lines){const n=i.layouts.get(a.id),o=i.rawVehicles.map(s=>ta(s,a,n,e)).filter(Boolean);i.vehiclesByLine.set(a.id,o)}}catch(t){i.error="Realtime offline",console.error(t)}b()}async function ka(){Pt(Ue()),Tt(),await xa(),b(),await ot(),await Et(),window.addEventListener("popstate",()=>{Et().catch(console.error)});const t=()=>{const a=i.compactLayout;if(Tt(),a!==i.compactLayout){b();return}B()};window.addEventListener("resize",t),window.visualViewport?.addEventListener("resize",t),new ResizeObserver(()=>{B()}).observe(w),Ma(),window.setInterval(()=>{te(),ca()},1e3)}ka().catch(t=>{k.textContent="FAIL",j.textContent=t.message});
