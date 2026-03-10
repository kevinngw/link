(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=a(r);fetch(r.href,s)}})();const se="modulepreload",re=function(t){return"/link/dev/"+t},rt={},oe=function(e,a,n){let r=Promise.resolve();if(a&&a.length>0){let m=function(p){return Promise.all(p.map(c=>Promise.resolve(c).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};var o=m;document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");r=m(a.map(p=>{if(p=re(p),p in rt)return;rt[p]=!0;const c=p.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${u}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":se,c||(f.as="script"),f.crossOrigin="",f.href=p,d&&f.setAttribute("nonce",d),document.head.appendChild(f),c)return new Promise((g,v)=>{f.addEventListener("load",g),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${p}`)))})}))}function s(l){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=l,window.dispatchEvent(d),!d.defaultPrevented)throw l}return r.then(l=>{for(const d of l||[])d.status==="rejected"&&s(d.reason);return e().catch(s)})};function le(t={}){const{immediate:e=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:r,onRegisteredSW:s,onRegisterError:o}=t;let l,d;const m=async(c=!0)=>{await d};async function p(){if("serviceWorker"in navigator){if(l=await oe(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(c=>{o?.(c)}),!l)return;l.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),l.addEventListener("installed",c=>{c.isUpdate||n?.()}),l.register({immediate:e}).then(c=>{s?s("/link/dev/sw.js",c):r?.(c)}).catch(c=>{o?.(c)})}}return d=p(),m}const ce="./link-data.json",wt="https://api.pugetsound.onebusaway.org/api/where",Lt="TEST",de=2e4,ot=3,ue=800,pe=1100,me=3e4,fe=4e3,ge=15e3,$t="link-pulse-theme",D="link",x={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},i={fetchedAt:"",error:"",activeSystemId:D,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},currentTrainId:"",alerts:[]},he=le({immediate:!0,onNeedRefresh(){he(!0)}});document.querySelector("#app").innerHTML=`
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
`;const w=document.querySelector("#board"),ve=document.querySelector("#screen-kicker"),ye=document.querySelector("#screen-title"),lt=document.querySelector("#system-bar"),It=[...document.querySelectorAll(".tab-button")],Dt=document.querySelector("#theme-toggle"),C=document.querySelector("#status-pill"),be=document.querySelector("#current-time"),U=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),Se=document.querySelector("#dialog-title"),ct=document.querySelector("#dialog-status-pill"),we=document.querySelector("#dialog-updated-at"),F=document.querySelector("#dialog-display"),Tt=[...document.querySelectorAll("[data-dialog-direction]")],T=document.querySelector("#station-alerts-container"),dt=document.querySelector("#arrivals-nb-pinned"),A=document.querySelector("#arrivals-nb"),ut=document.querySelector("#arrivals-sb-pinned"),E=document.querySelector("#arrivals-sb"),$=document.querySelector("#train-dialog"),Le=document.querySelector("#train-dialog-title"),$e=document.querySelector("#train-dialog-subtitle"),Ie=document.querySelector("#train-dialog-line"),pt=document.querySelector("#train-dialog-status"),De=document.querySelector("#train-dialog-close"),I=document.querySelector("#alert-dialog"),Te=document.querySelector("#alert-dialog-title"),Ae=document.querySelector("#alert-dialog-subtitle"),Ee=document.querySelector("#alert-dialog-lines"),mt=document.querySelector("#alert-dialog-body"),ft=document.querySelector("#alert-dialog-link"),Me=document.querySelector("#alert-dialog-close");F.addEventListener("click",()=>Qe());De.addEventListener("click",()=>tt());Me.addEventListener("click",()=>et());Tt.forEach(t=>{t.addEventListener("click",()=>{i.dialogDisplayDirection=t.dataset.dialogDirection,i.dialogDisplayDirection==="auto"&&(i.dialogDisplayAutoPhase="nb"),z()})});h.addEventListener("click",t=>{t.target===h&&Ht()});$.addEventListener("click",t=>{t.target===$&&tt()});I.addEventListener("click",t=>{t.target===I&&et()});h.addEventListener("close",()=>{X(),Z(),K(),G(!1),i.isSyncingFromUrl||_t()});It.forEach(t=>{t.addEventListener("click",()=>{i.activeTab=t.dataset.tab,b()})});Dt.addEventListener("click",()=>{At(i.theme==="dark"?"light":"dark"),b()});function Y(){return x[i.activeSystemId]??x[D]}function Ce(){return i.systemsById.get(i.activeSystemId)?.agencyId??x[D].agencyId}function ke(){return`${wt}/vehicles-for-agency/${Ce()}.json?key=${Lt}`}function L(){return Y().vehicleLabel??"Vehicle"}function y(){return Y().vehicleLabelPlural??"Vehicles"}function R(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function xe(){const t=window.localStorage.getItem($t);return t==="light"||t==="dark"?t:"dark"}function At(t){i.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem($t,t)}function gt(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);i.compactLayout=n<=pe}function P(){const a=window.getComputedStyle(w).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==i.compactLayout&&(i.compactLayout=a,b())}function k(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function q(t,e,a){return Math.max(e,Math.min(t,a))}function Re(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function Pe(){return new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit"}).format(new Date)}function Et(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),a=t%60;return e>0?`${e}m ${a}s`:`${a}s`}function Be(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function ht(t){if(!t)return"";const[e="0",a="0"]=String(t).split(":"),n=Number(e),r=Number(a),s=(n%24+24)%24,o=s>=12?"PM":"AM";return`${s%12||12}:${String(r).padStart(2,"0")} ${o}`}function Mt(t){const e=Be(),a=t.serviceSpansByDate?.[e];return a?`Today ${ht(a.start)} - ${ht(a.end)}`:"Today service hours unavailable"}function Ct(t){return String(t||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function kt(t){return String(t||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function B(t){return i.alerts.filter(e=>e.lineIds.includes(t))}function xt(t,e){const a=B(e.id);if(!a.length)return[];const n=new Set(V(t,e));return n.add(t.id),a.filter(r=>r.stopIds.length>0&&r.stopIds.some(s=>n.has(s)))}function Ne(t){const e=new Set,a=[];for(const{station:n,line:r}of qt(t))for(const s of xt(n,r))e.has(s.id)||(e.add(s.id),a.push(s));return a}function Rt(t,e){return t.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${e}">
      <span class="line-alert-badge-count">${t.length}</span>
      <span class="line-alert-badge-copy">alert${t.length===1?"":"s"}</span>
    </button>
  `:""}function qe(t){return new Promise(e=>window.setTimeout(e,t))}function _e(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function Pt(t,e){for(let a=0;a<=ot;a+=1){const n=await fetch(t,{cache:"no-store"});let r=null;try{r=await n.json()}catch{r=null}const s=n.status===429||_e(r);if(n.ok&&!s)return r;if(a===ot||!s)throw r?.text?new Error(r.text):new Error(`${e} request failed with ${n.status}`);const o=ue*2**a;await qe(o)}throw new Error(`${e} request failed`)}function Oe(t){const e=[...t.stops].sort((c,u)=>u.sequence-c.sequence),a=48,n=44,r=28,s=88,o=122,l=n+r+(e.length-1)*a,d=new Map,m=e.map((c,u)=>{const f={...c,label:R(c.name),y:n+u*a,index:u,isTerminal:u===0||u===e.length-1};d.set(c.id,u),d.set(`${t.agencyId}_${c.id}`,u);for(const g of t.stationAliases?.[c.id]??[])d.set(g,u),d.set(`${t.agencyId}_${g}`,u);return f});let p=0;for(let c=0;c<m.length;c+=1)m[c].cumulativeMinutes=p,p+=c<m.length-1?m[c].segmentMinutes:0;return{totalMinutes:p,height:l,labelX:o,stationGap:a,stationIndexByStopId:d,stations:m,trackX:s}}function He(t,e){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":"•"}function Ue(t){const e=t.tripStatus??{},a=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const n=e.nextStopTimeOffset??0,r=e.scheduleDeviation??0,s=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return a==="approaching"||s&&Math.abs(n)<=90?"ARR":r>=120?"DELAY":"OK"}function Fe(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const a=Math.round(t/60);let n="status-late-minor";return t>600?n="status-late-severe":t>300&&(n="status-late-moderate"),{text:`+${a} min late`,colorClass:n}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function We(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function je(t){const e=We(t.serviceStatus),a=t.delayInfo.text;return`${e} (${a})`}function Ye(t,e,a,n){const r=t.tripStatus?.activeTripId??t.tripId??"",s=n.get(r);if(!s||s.routeId!==e.routeKey)return null;const o=t.tripStatus?.closestStop,l=t.tripStatus?.nextStop,d=a.stationIndexByStopId.get(o),m=a.stationIndexByStopId.get(l);if(d==null&&m==null)return null;let p=d??m,c=m??d;if(p>c){const ne=p;p=c,c=ne}const u=a.stations[p],f=a.stations[c],g=t.tripStatus?.closestStopTimeOffset??0,v=t.tripStatus?.nextStopTimeOffset??0,S=s.directionId==="1"?"▲":s.directionId==="0"?"▼":He(d,m);let M=0;p!==c&&g<0&&v>0&&(M=q(Math.abs(g)/(Math.abs(g)+v),0,1));const Xt=u.y+(f.y-u.y)*M,Zt=p!==c?u.segmentMinutes:0,Jt=u.cumulativeMinutes+Zt*M,N=d??m??p,at=a.stations[N]??u,it=S==="▲",Qt=q(N+(it?1:-1),0,a.stations.length-1),te=d!=null&&m!=null&&d!==m?m:q(N+(it?-1:1),0,a.stations.length-1),ee=a.stations[Qt]??at,ae=a.stations[te]??f,nt=t.tripStatus?.scheduleDeviation??0,st=t.tripStatus?.predicted??!1,ie=Fe(nt,st);return{id:t.vehicleId,label:t.vehicleId.replace(/^\d+_/,""),directionSymbol:S,fromLabel:u.label,minutePosition:Jt,progress:M,serviceStatus:Ue(t),toLabel:f.label,y:Xt,currentLabel:u.label,nextLabel:f.label,previousLabel:ee.label,currentStopLabel:at.label,upcomingLabel:ae.label,status:t.tripStatus?.status??"",closestStop:o,nextStop:l,closestOffset:g,nextOffset:v,scheduleDeviation:nt,isPredicted:st,delayInfo:ie,rawVehicle:t}}function Ve(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function Bt(){return i.lines.flatMap(t=>(i.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function Ge(){return Object.values(x).filter(t=>i.systemsById.has(t.id)).map(t=>`
        <button
          class="tab-button ${t.id===i.activeSystemId?"is-active":""}"
          data-system-switch="${t.id}"
          type="button"
        >
          ${t.label}
        </button>
      `).join("")}function _(){return!i.compactLayout||i.lines.length<2?"":`<section class="line-switcher">${i.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===i.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function Ke(t,e){const a=[...t].sort((s,o)=>s.minutePosition-o.minutePosition),n=[...e].sort((s,o)=>s.minutePosition-o.minutePosition),r=s=>s.slice(1).map((o,l)=>Math.round(o.minutePosition-s[l].minutePosition));return{nbGaps:r(a),sbGaps:r(n)}}function ze(t,e){if(e<2||!t.length)return{health:"quiet",avg:null};const a=t.reduce((s,o)=>s+o,0)/t.length,n=Math.max(...t);let r;return n>a*2.5&&n>10?r="alert":a<14?r="balanced":a<22?r="warn":r="quiet",{health:r,avg:Math.round(a)}}function vt(t,e,a){const{health:n,avg:r}=ze(e,a),s=r!=null?`~${r} min`:"—",o=n==="balanced"?"Consistent spacing":n==="warn"?"Some irregularity":n==="alert"?"Bunching detected":a<2?`Too few ${y().toLowerCase()}`:"Low frequency";return`
    <div class="headway-health-card headway-health-card-${n}">
      <p class="headway-health-label">${t}</p>
      <p class="headway-health-value">${s}</p>
      <p class="headway-health-copy">${o}</p>
    </div>
  `}function Xe(t,e,a){const n=e.length+a.length;if(!n)return"";const{nbGaps:r,sbGaps:s}=Ke(e,a),l=[...e,...a].reduce((v,S)=>v+S.scheduleDeviation,0)/n,d=Math.round(Math.abs(l)/60),m=l<30?"On time":`+${d} min late`,p=[...r,...s],c=p.length?Math.min(...p):null,u=L(),f=y(),g=p.length?`
      <div class="headway-chart">
        <div class="headway-chart-header">
          <p class="headway-chart-title">Live ${u} Gaps</p>
          <p class="headway-chart-copy">Minutes between consecutive ${f.toLowerCase()} by direction</p>
        </div>
        <div class="headway-chart-grid">
          ${r.map((v,S)=>`
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
        ${vt("NB Headway",r,e.length)}
        ${vt("SB Headway",s,a.length)}
      </div>
      ${g}
    </div>
  `}function Nt(t,e=!1){const a=Date.now(),n=s=>{const o=s.arrivalTime,l=Math.floor((o-a)/1e3),d=Et(l),m=Ft(s.arrivalTime,s.scheduleDeviation??0),p=J(m);let c="";if(s.distanceFromStop>0){const u=s.distanceFromStop>=1e3?`${(s.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(s.distanceFromStop)}m`,f=s.numberOfStopsAway===1?"1 stop away":`${s.numberOfStopsAway} stops away`;c=` • ${u} • ${f}`}return`
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
    `};if(e){dt.innerHTML="",ut.innerHTML="",A.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',E.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',W();return}const r=(s,o,l)=>{if(!s.length){o.innerHTML="",l.innerHTML=`<div class="arrival-item muted">No upcoming ${y().toLowerCase()}</div>`;return}const d=i.dialogDisplayMode?s.slice(0,2):[],m=i.dialogDisplayMode?s.slice(2):s;o.innerHTML=d.map(n).join(""),l.innerHTML=m.length?m.map(n).join(""):i.dialogDisplayMode?`<div class="arrival-item muted">No additional ${y().toLowerCase()}</div>`:""};r(t.nb,dt,A),r(t.sb,ut,E),W()}function V(t,e){const a=new Set(e.stationAliases?.[t.id]??[]);a.add(t.id);const n=new Set;for(const s of a){const o=s.startsWith(`${e.agencyId}_`)?s:`${e.agencyId}_${s}`;n.add(o)}const r=t.id.replace(/-T\d+$/,"");return n.add(r.startsWith(`${e.agencyId}_`)?r:`${e.agencyId}_${r}`),[...n]}function qt(t){const e=i.lines.map(a=>{const n=a.stops.find(r=>r.id===t.id);return n?{line:a,station:n}:null}).filter(Boolean);return e.length>0?e:i.lines.map(a=>{const n=a.stops.find(r=>r.name===t.name);return n?{line:a,station:n}:null}).filter(Boolean)}function Ze(t){if(!t)return null;const e=t.trim().toLowerCase();for(const a of i.lines)for(const n of a.stops){const r=new Set([n.id,`${a.agencyId}_${n.id}`,n.name,R(n.name),k(n.name),k(R(n.name))]);for(const s of a.stationAliases?.[n.id]??[])r.add(s),r.add(`${a.agencyId}_${s}`),r.add(k(s));if([...r].some(s=>String(s).toLowerCase()===e))return n}return null}function Je(t){const e=new URL(window.location.href);e.searchParams.set("station",k(t.name)),window.history.pushState({},"",e)}function _t(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function yt(t){const e=new URL(window.location.href);t===D?e.searchParams.delete("system"):e.searchParams.set("system",t),window.history.pushState({},"",e)}function Ot(){const e=new URL(window.location.href).searchParams.get("system");return e&&i.systemsById.has(e)?e:D}function G(t){i.dialogDisplayMode=t,h.classList.toggle("is-display-mode",t),F.textContent=t?"Exit":"Board",F.setAttribute("aria-label",t?"Exit display mode":"Toggle display mode"),i.dialogDisplayDirection="both",i.dialogDisplayAutoPhase="nb",z(),h.open&&i.currentDialogStation&&Q(i.currentDialogStation).catch(console.error),W()}function Qe(){G(!i.dialogDisplayMode)}function K(){i.dialogDisplayDirectionTimer&&(window.clearInterval(i.dialogDisplayDirectionTimer),i.dialogDisplayDirectionTimer=0)}function z(){K();const t=i.dialogDisplayDirection,e=t==="auto"?i.dialogDisplayAutoPhase:t;Tt.forEach(a=>{a.classList.toggle("is-active",a.dataset.dialogDirection===t)}),h.classList.toggle("show-nb-only",i.dialogDisplayMode&&e==="nb"),h.classList.toggle("show-sb-only",i.dialogDisplayMode&&e==="sb"),i.dialogDisplayMode&&t==="auto"&&(i.dialogDisplayDirectionTimer=window.setInterval(()=>{i.dialogDisplayAutoPhase=i.dialogDisplayAutoPhase==="nb"?"sb":"nb",z()},ge))}function X(){i.dialogRefreshTimer&&(window.clearInterval(i.dialogRefreshTimer),i.dialogRefreshTimer=0)}function Z(){i.dialogDisplayTimer&&(window.clearInterval(i.dialogDisplayTimer),i.dialogDisplayTimer=0)}function O(t,e){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(t.style.transform="translateY(0)",!i.dialogDisplayMode||a.length<=3)return;const n=Number.parseFloat(window.getComputedStyle(t).rowGap||"0")||0,r=a[0].getBoundingClientRect().height+n,s=Math.max(0,a.length-3),o=Math.min(i.dialogDisplayIndexes[e],s);t.style.transform=`translateY(-${o*r}px)`}function W(){Z(),i.dialogDisplayIndexes={nb:0,sb:0},O(A,"nb"),O(E,"sb"),i.dialogDisplayMode&&(i.dialogDisplayTimer=window.setInterval(()=>{for(const[t,e]of[["nb",A],["sb",E]]){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const n=Math.max(0,a.length-3);i.dialogDisplayIndexes[t]=i.dialogDisplayIndexes[t]>=n?0:i.dialogDisplayIndexes[t]+1,O(e,t)}},fe))}function ta(){if(!h.open)return;h.querySelectorAll(".arrival-item[data-arrival-time]").forEach(e=>{const a=Number(e.dataset.arrivalTime),n=Number(e.dataset.scheduleDeviation||0),r=e.querySelector(".arrival-countdown"),s=e.querySelector(".arrival-status");if(!r||!s)return;r.textContent=Et(Math.floor((a-Date.now())/1e3));const o=Ft(a,n),l=J(o);s.textContent=o,s.className=`arrival-status arrival-status-${l}`})}function ea(){X(),i.currentDialogStation&&(i.dialogRefreshTimer=window.setInterval(()=>{!h.open||!i.currentDialogStation||Q(i.currentDialogStation).catch(console.error)},me))}function Ht(){i.currentDialogStationId="",i.currentDialogStation=null,h.open?h.close():(X(),Z(),K(),G(!1),_t())}async function bt(){const t=Ot();t!==i.activeSystemId&&await zt(t,{updateUrl:!1,preserveDialog:!1});const e=new URL(window.location.href).searchParams.get("station"),a=Ze(e);i.isSyncingFromUrl=!0;try{if(!a){i.currentDialogStationId="",h.open&&h.close();return}if(i.activeTab="map",b(),i.currentDialogStationId===a.id&&h.open)return;await Yt(a,!1)}finally{i.isSyncingFromUrl=!1}}function aa(t,e){const a=e.directionLookup?.[t.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const n=t.tripHeadsign??"",r=n.toLowerCase();return e.nbTerminusPrefix&&r.startsWith(e.nbTerminusPrefix)?"nb":e.sbTerminusPrefix&&r.startsWith(e.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function Ut(t){return t.routeKey??`${t.agencyId}_${t.id}`}function ia(t){const e=t.tripHeadsign?.trim();return e?R(e.replace(/^to\s+/i,"")):"Terminal"}function Ft(t,e){return Math.floor((t-Date.now())/1e3)<=90?"ARR":e>=120?"DELAY":"ON TIME"}function J(t){return t==="DELAY"?"delay":t==="ARR"?"arr":"ok"}async function na(t){const e=`${wt}/arrivals-and-departures-for-stop/${t}.json?key=${Lt}&minutesAfter=120`,a=await Pt(e,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${t}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function Wt(t){const e=[...new Set(t)],a=await Promise.allSettled(e.map(r=>na(r))),n=[];for(const r of a)r.status==="fulfilled"&&n.push(...r.value);return n}function sa(t,e){const a=Date.now(),n=new Set,r={nb:[],sb:[]};for(const s of t){if(s.routeId!==Ut(e))continue;const o=s.predictedArrivalTime||s.scheduledArrivalTime;if(!o||o<=a)continue;const l=aa(s,e);if(!l)continue;const d=`${s.tripId}:${s.stopId}:${o}`;n.has(d)||(n.add(d),r[l].push({vehicleId:(s.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:o,destination:ia(s),scheduleDeviation:s.scheduleDeviation??0,tripId:s.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0],distanceFromStop:s.distanceFromStop??0,numberOfStopsAway:s.numberOfStopsAway??0}))}return r.nb.sort((s,o)=>s.arrivalTime-o.arrivalTime),r.sb.sort((s,o)=>s.arrivalTime-o.arrivalTime),r.nb=r.nb.slice(0,4),r.sb=r.sb.slice(0,4),r}async function ra(t,e,a=null){const n=`${i.activeSystemId}:${e.id}:${t.id}`,r=i.arrivalsCache.get(n);if(r&&Date.now()-r.fetchedAt<de)return r.value;const s=V(t,e),o=a??await Wt(s),l=sa(o,e);return i.arrivalsCache.set(n,{fetchedAt:Date.now(),value:l}),l}function oa(t){const e={nb:[],sb:[]};for(const a of t)e.nb.push(...a.nb),e.sb.push(...a.sb);return e.nb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e.sb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e}function jt(t){const e=Ne(t);if(!e.length){T.innerHTML="",T.hidden=!0;return}T.hidden=!1,T.innerHTML=`
    <div class="station-alerts">
      ${e.map((a,n)=>`
        <button class="station-alert-pill" data-alert-idx="${n}" type="button">
          <span class="station-alert-pill-meta">${kt(a.severity)} · ${Ct(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||"Service alert"}</span>
        </button>
      `).join("")}
    </div>
  `,T.querySelectorAll(".station-alert-pill").forEach(a=>{const n=e[Number(a.dataset.alertIdx)];n&&a.addEventListener("click",()=>{const r=i.lines.find(s=>n.lineIds.includes(s.id));r&&Vt(r)})})}async function Yt(t,e=!0){Se.textContent=t.name,i.currentDialogStationId=t.id,i.currentDialogStation=t,jt(t),Nt({nb:[],sb:[]},!0),e&&Je(t),h.showModal(),ea(),await Q(t)}async function Q(t){const e=i.activeDialogRequest+1;i.activeDialogRequest=e;try{const a=qt(t),n=a.flatMap(({station:o,line:l})=>V(o,l)),r=await Wt(n),s=await Promise.all(a.map(({station:o,line:l})=>ra(o,l,r)));if(i.activeDialogRequest!==e||!h.open)return;jt(t),Nt(oa(s))}catch(a){if(i.activeDialogRequest!==e||!h.open)return;A.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,E.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function la(t){const e=i.layouts.get(t.id),a=i.vehiclesByLine.get(t.id)??[],n=B(t.id),r=e.stations.map((l,d)=>{const m=e.stations[d-1],p=d>0?m.segmentMinutes:"",u=xt(l,t).length>0,f=l.isTerminal?15:10;return`
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
      `).join(""),o=L();return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <div class="line-title-row">
              <h2>${t.name}</h2>
              ${Rt(n,t.id)}
            </div>
            <p>${a.length} live ${a.length===1?o.toLowerCase():y().toLowerCase()}</p>
            <p>${Mt(t)}</p>
          </div>
        </div>
      </header>
      <svg viewBox="0 0 360 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${r}
        ${s}
      </svg>
    </article>
  `}function ca(){const t=Bt().sort((o,l)=>o.minutePosition-l.minutePosition),e=L(),a=y(),n=a.toLowerCase();return t.length?(i.compactLayout?i.lines.filter(o=>o.id===i.activeLineId):i.lines).map(o=>{const l=t.filter(u=>u.lineId===o.id),d=B(o.id),m=l.filter(u=>u.directionSymbol==="▲"),p=l.filter(u=>u.directionSymbol==="▼"),c=(u,f)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${u}</p>
          ${f.length?f.map(g=>`
                      <article class="train-list-item" data-train-id="${g.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${g.lineColor};">${g.lineToken}</span>
                          <div>
                            <p class="train-list-title">${g.lineName} ${e} ${g.label}</p>
                            <p class="train-list-subtitle">${Ve(g)}</p>
                            <p class="train-list-status ${g.delayInfo.colorClass}">${je(g)}</p>
                          </div>
                        </div>
                      </article>
                    `).join(""):`<p class="train-readout muted">No ${y().toLowerCase()}</p>`}
        </div>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${o.color};">${o.name[0]}</span>
              <div>
                <div class="line-title-row">
                  <h2>${o.name}</h2>
                  ${Rt(d,o.id)}
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
    `}function da(){const t=i.compactLayout?i.lines.filter(a=>a.id===i.activeLineId):i.lines,e=L();return t.map(a=>{const n=i.vehiclesByLine.get(a.id)??[],r=n.filter(l=>l.directionSymbol==="▲"),s=n.filter(l=>l.directionSymbol==="▼"),o=Xe(a,r,s);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${a.color};">${a.name[0]}</span>
              <div>
                <h2>${a.name}</h2>
                <p>${n.length} live ${n.length===1?L().toLowerCase():y().toLowerCase()} · ${Mt(a)}</p>
              </div>
            </div>
          </header>
          ${o||`<p class="train-readout muted">Waiting for live ${e.toLowerCase()} data…</p>`}
        </article>
      `}).join("")}function ua(){document.querySelectorAll("[data-system-switch]").forEach(e=>{e.addEventListener("click",async()=>{await zt(e.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function H(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{i.activeLineId=e.dataset.lineSwitch,b()})})}function tt(){i.currentTrainId="",$.open&&$.close()}function et(){I.open&&I.close()}function Vt(t){const e=B(t.id);Te.textContent=`${t.name} Alerts`,Ae.textContent=`${e.length} active alert${e.length===1?"":"s"}`,Ee.textContent=t.name,mt.textContent="",mt.innerHTML=e.length?e.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${kt(a.severity)} • ${Ct(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||"Service alert"}</p>
              <p class="alert-dialog-item-copy">${a.description||"No additional alert details available."}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">Read official alert</a></p>`:""}
            </article>
          `).join(""):'<p class="alert-dialog-item-copy">No active alerts.</p>',ft.hidden=!0,ft.removeAttribute("href"),I.open||I.showModal()}function St(){document.querySelectorAll("[data-alert-line-id]").forEach(e=>{e.addEventListener("click",()=>{const a=i.lines.find(n=>n.id===e.dataset.alertLineId);a&&Vt(a)})})}function pa(t){const e=t.fromLabel!==t.toLabel&&t.progress>0&&t.progress<1,a=e?t.fromLabel:t.previousLabel,n=e?`${t.fromLabel} -> ${t.toLabel}`:t.currentStopLabel,r=e?"Between":"Now",s=e?t.toLabel:t.upcomingLabel,o=e?t.progress:.5;Le.textContent=`${t.lineName} ${L()} ${t.label}`,$e.textContent=t.directionSymbol==="▲"?"Direction A movement":"Direction B movement",pt.className=`train-detail-status train-list-status-${J(t.serviceStatus)}`,pt.textContent=t.serviceStatus,Ie.innerHTML=`
    <div class="train-detail-spine" style="--line-color:${t.lineColor};"></div>
    <div
      class="train-detail-marker-floating"
      style="--line-color:${t.lineColor}; --segment-progress:${o}; --direction-offset:${t.directionSymbol==="▼"?"10px":"-10px"};"
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
        <p class="train-detail-label">${r}</p>
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
  `,$.open||$.showModal()}function ma(){document.querySelectorAll("[data-train-id]").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.trainId,n=Bt().find(r=>r.id===a);n&&(i.currentTrainId=a,pa(n))})})}function fa(){i.lines.forEach(t=>{const e=i.layouts.get(t.id),a=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(r=>{r.addEventListener("click",()=>{const s=r.dataset.stopId,o=e.stations.find(l=>l.id===s);o&&Yt(o)})})})}function b(){const t=Y();if(Dt.textContent=i.theme==="dark"?"Light":"Dark",ve.textContent=t.kicker,ye.textContent=t.title,lt.hidden=i.systemsById.size<2,lt.innerHTML=Ge(),Gt(),It.forEach(e=>e.classList.toggle("is-active",e.dataset.tab===i.activeTab)),document.querySelector("#tab-trains").textContent=t.vehicleLabelPlural||`${t.vehicleLabel}s`,ua(),i.activeTab==="map"){w.className="board";const e=i.compactLayout?i.lines.filter(a=>a.id===i.activeLineId):i.lines;w.innerHTML=`${_()}${e.map(la).join("")}`,H(),St(),fa(),queueMicrotask(P);return}if(i.activeTab==="trains"){w.className="board",w.innerHTML=`${_()}${ca()}`,H(),St(),ma(),queueMicrotask(P);return}i.activeTab==="insights"&&(w.className="board",w.innerHTML=`${_()}${da()}`,H())}function Gt(){C.textContent=i.error?"HOLD":"SYNC",C.classList.toggle("status-pill-error",!!i.error),be.textContent=`Now ${Pe()}`,U.textContent=i.error?"Using last successful snapshot":Re(i.fetchedAt),ct.textContent=C.textContent,ct.classList.toggle("status-pill-error",!!i.error),we.textContent=U.textContent}function Kt(t){const e=i.systemsById.has(t)?t:D,a=i.systemsById.get(e);i.activeSystemId=e,i.lines=a?.lines??[],i.layouts=i.layoutsBySystem.get(e)??new Map,i.lines.some(n=>n.id===i.activeLineId)||(i.activeLineId=i.lines[0]?.id??""),i.vehiclesByLine=new Map,i.rawVehicles=[],i.arrivalsCache.clear(),i.alerts=[],i.error="",i.fetchedAt=""}async function zt(t,{updateUrl:e=!0,preserveDialog:a=!1}={}){if(!i.systemsById.has(t)||i.activeSystemId===t){e&&yt(i.activeSystemId);return}Kt(t),a||Ht(),tt(),et(),b(),e&&yt(t),await j()}async function ga(){const a=(await(await fetch(ce)).json()).systems??[];i.systemsById=new Map(a.map(n=>[n.id,n])),i.layoutsBySystem=new Map(a.map(n=>[n.id,new Map(n.lines.map(r=>[r.id,Oe(r)]))])),Kt(Ot())}function ha(t){const e=[...new Set((t.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=i.lines.filter(n=>e.includes(Ut(n))).map(n=>n.id);return a.length?{id:t.id,effect:t.reason??"SERVICE ALERT",severity:t.severity??"INFO",title:t.summary?.value??"Service alert",description:t.description?.value??"",url:t.url?.value??"",lineIds:a,stopIds:[...new Set((t.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function j(){try{const t=await Pt(ke(),"Realtime");i.error="",i.fetchedAt=new Date().toISOString(),i.rawVehicles=t.data.list??[],i.alerts=(t.data.references?.situations??[]).map(ha).filter(Boolean);const e=new Map((t.data.references?.trips??[]).map(a=>[a.id,a]));for(const a of i.lines){const n=i.layouts.get(a.id),r=i.rawVehicles.map(s=>Ye(s,a,n,e)).filter(Boolean);i.vehiclesByLine.set(a.id,r)}}catch(t){i.error="Realtime offline",console.error(t)}b()}async function va(){At(xe()),gt(),await ga(),b(),await j(),await bt(),window.addEventListener("popstate",()=>{bt().catch(console.error)});const t=()=>{const a=i.compactLayout;if(gt(),a!==i.compactLayout){b();return}P()};window.addEventListener("resize",t),window.visualViewport?.addEventListener("resize",t),new ResizeObserver(()=>{P()}).observe(w),window.setInterval(j,15e3),window.setInterval(()=>{Gt(),ta()},1e3)}va().catch(t=>{C.textContent="FAIL",U.textContent=t.message});
