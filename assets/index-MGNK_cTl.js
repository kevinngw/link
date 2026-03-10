(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}})();const he="modulepreload",ve=function(t){return"/link/"+t},pt={},ye=function(e,i,a){let s=Promise.resolve();if(i&&i.length>0){let u=function(m){return Promise.all(m.map(c=>Promise.resolve(c).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var r=u;document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");s=u(i.map(m=>{if(m=ve(m),m in pt)return;pt[m]=!0;const c=m.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${p}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":he,c||(f.as="script"),f.crossOrigin="",f.href=m,d&&f.setAttribute("nonce",d),document.head.appendChild(f),c)return new Promise((g,I)=>{f.addEventListener("load",g),f.addEventListener("error",()=>I(new Error(`Unable to preload CSS for ${m}`)))})}))}function o(l){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=l,window.dispatchEvent(d),!d.defaultPrevented)throw l}return s.then(l=>{for(const d of l||[])d.status==="rejected"&&o(d.reason);return e().catch(o)})};function be(t={}){const{immediate:e=!1,onNeedRefresh:i,onOfflineReady:a,onRegistered:s,onRegisteredSW:o,onRegisterError:r}=t;let l,d;const u=async(c=!0)=>{await d};async function m(){if("serviceWorker"in navigator){if(l=await ye(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/link/sw.js",{scope:"/link/",type:"classic"})).catch(c=>{r?.(c)}),!l)return;l.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),l.addEventListener("installed",c=>{c.isUpdate||a?.()}),l.register({immediate:e}).then(c=>{o?o("/link/sw.js",c):s?.(c)}).catch(c=>{r?.(c)})}}return d=m(),u}const Se="./pulse-data.json",xt="https://api.pugetsound.onebusaway.org/api/where",G="TEST".trim()||"TEST",w=G==="TEST",we=w?6e4:2e4,mt=3,$e=800,Le=w?2e4:5e3,ft=w?12e4:3e4,gt=w?1200:0,_=w?1:3,Te=1100,Ie=w?45e3:15e3,De=w?9e4:3e4,Ae=4e3,Me=15e3,kt="link-pulse-theme",T="link",R={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},n={fetchedAt:"",error:"",activeSystemId:T,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0},Ee=be({immediate:!0,onNeedRefresh(){Ee(!0)}});document.querySelector("#app").innerHTML=`
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
`;const S=document.querySelector("#board"),xe=document.querySelector("#screen-kicker"),ke=document.querySelector("#screen-title"),ht=document.querySelector("#system-bar"),Ct=[...document.querySelectorAll(".tab-button")],Rt=document.querySelector("#theme-toggle"),k=document.querySelector("#status-pill"),Ce=document.querySelector("#current-time"),F=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),Re=document.querySelector("#dialog-title"),vt=document.querySelector("#dialog-status-pill"),Ne=document.querySelector("#dialog-updated-at"),W=document.querySelector("#dialog-display"),Nt=[...document.querySelectorAll("[data-dialog-direction]")],D=document.querySelector("#station-alerts-container"),yt=document.querySelector("#arrivals-nb-pinned"),A=document.querySelector("#arrivals-nb"),bt=document.querySelector("#arrivals-sb-pinned"),M=document.querySelector("#arrivals-sb"),$=document.querySelector("#train-dialog"),Pe=document.querySelector("#train-dialog-title"),Be=document.querySelector("#train-dialog-subtitle"),_e=document.querySelector("#train-dialog-line"),St=document.querySelector("#train-dialog-status"),Oe=document.querySelector("#train-dialog-close"),L=document.querySelector("#alert-dialog"),qe=document.querySelector("#alert-dialog-title"),Ue=document.querySelector("#alert-dialog-subtitle"),He=document.querySelector("#alert-dialog-lines"),wt=document.querySelector("#alert-dialog-body"),$t=document.querySelector("#alert-dialog-link"),Fe=document.querySelector("#alert-dialog-close");W.addEventListener("click",()=>hi());Oe.addEventListener("click",()=>nt());Fe.addEventListener("click",()=>st());Nt.forEach(t=>{t.addEventListener("click",()=>{n.dialogDisplayDirection=t.dataset.dialogDirection,n.dialogDisplayDirection==="auto"&&(n.dialogDisplayAutoPhase="nb"),Q()})});h.addEventListener("click",t=>{t.target===h&&Zt()});$.addEventListener("click",t=>{t.target===$&&nt()});L.addEventListener("click",t=>{t.target===L&&st()});h.addEventListener("close",()=>{tt(),et(),J(),Z(!1),n.isSyncingFromUrl||zt()});Ct.forEach(t=>{t.addEventListener("click",()=>{n.activeTab=t.dataset.tab,y()})});Rt.addEventListener("click",()=>{Pt(n.theme==="dark"?"light":"dark"),y()});function K(){return R[n.activeSystemId]??R[T]}function We(){return n.systemsById.get(n.activeSystemId)?.agencyId??R[T].agencyId}function Ve(){return`${xt}/vehicles-for-agency/${We()}.json?key=${G}`}function b(){return K().vehicleLabel??"Vehicle"}function Ye(t){return/bus$/i.test(t)?`${t}es`:`${t}s`}function v(){return K().vehicleLabelPlural??Ye(b())}function N(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function je(){const t=window.localStorage.getItem(kt);return t==="light"||t==="dark"?t:"dark"}function Pt(t){n.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(kt,t)}function Lt(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,i=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,a=Math.min(e,t,i);n.compactLayout=a<=Te}function P(){const i=window.getComputedStyle(S).gridTemplateColumns.split(" ").map(a=>a.trim()).filter(Boolean).length<=1;i!==n.compactLayout&&(n.compactLayout=i,y())}function C(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function O(t,e,i){return Math.max(e,Math.min(t,i))}function Ge(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function Ke(){return new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit"}).format(new Date)}function Bt(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),i=t%60;return e>0?`${e}m ${i}s`:`${i}s`}function ze(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function Tt(t){if(!t)return"";const[e="0",i="0"]=String(t).split(":"),a=Number(e),s=Number(i),o=(a%24+24)%24,r=o>=12?"PM":"AM";return`${o%12||12}:${String(s).padStart(2,"0")} ${r}`}function _t(t){const e=ze(),i=t.serviceSpansByDate?.[e];return i?`Today ${Tt(i.start)} - ${Tt(i.end)}`:"Today service hours unavailable"}function Ot(t){return String(t||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function qt(t){return String(t||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function E(t){return n.alerts.filter(e=>e.lineIds.includes(t))}function Ut(t,e){const i=E(e.id);if(!i.length)return[];const a=new Set(X(t,e));return a.add(t.id),i.filter(s=>s.stopIds.length>0&&s.stopIds.some(o=>a.has(o)))}function Xe(t){const e=new Set,i=[];for(const{station:a,line:s}of Kt(t))for(const o of Ut(a,s))e.has(o.id)||(e.add(o.id),i.push(o));return i}function Ht(t,e){return t.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${e}">
      <span class="line-alert-badge-count">${t.length}</span>
      <span class="line-alert-badge-copy">alert${t.length===1?"":"s"}</span>
    </button>
  `:""}function z(t){return new Promise(e=>window.setTimeout(e,t))}function Ze(){const t=Math.max(0,n.obaRateLimitStreak-1),e=Math.min(ft,Le*2**t),i=Math.round(e*(.15+Math.random()*.2));return Math.min(ft,e+i)}async function Je(){const t=n.obaCooldownUntil-Date.now();t>0&&await z(t)}function Qe(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function Ft(t,e){for(let i=0;i<=mt;i+=1){await Je();const a=await fetch(t,{cache:"no-store"});let s=null;try{s=await a.json()}catch{s=null}const o=a.status===429||Qe(s);if(a.ok&&!o)return n.obaRateLimitStreak=0,n.obaCooldownUntil=0,s;if(i===mt||!o)throw s?.text?new Error(s.text):new Error(`${e} request failed with ${a.status}`);n.obaRateLimitStreak+=1;const r=$e*2**i,l=Math.max(r,Ze());n.obaCooldownUntil=Date.now()+l,await z(l)}throw new Error(`${e} request failed`)}function ti(t){const e=[...t.stops].sort((c,p)=>p.sequence-c.sequence),i=48,a=44,s=28,o=88,r=122,l=a+s+(e.length-1)*i,d=new Map,u=e.map((c,p)=>{const f={...c,label:N(c.name),y:a+p*i,index:p,isTerminal:p===0||p===e.length-1};d.set(c.id,p),d.set(`${t.agencyId}_${c.id}`,p);for(const g of t.stationAliases?.[c.id]??[])d.set(g,p),d.set(`${t.agencyId}_${g}`,p);return f});let m=0;for(let c=0;c<u.length;c+=1)u[c].cumulativeMinutes=m,m+=c<u.length-1?u[c].segmentMinutes:0;return{totalMinutes:m,height:l,labelX:r,stationGap:i,stationIndexByStopId:d,stations:u,trackX:o}}function ei(t,e){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":"•"}function ii(t){const e=t.tripStatus??{},i=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const a=e.nextStopTimeOffset??0,s=e.scheduleDeviation??0,o=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return i==="approaching"||o&&Math.abs(a)<=90?"ARR":s>=120?"DELAY":"OK"}function ai(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const i=Math.round(t/60);let a="status-late-minor";return t>600?a="status-late-severe":t>300&&(a="status-late-moderate"),{text:`+${i} min late`,colorClass:a}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function ni(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function si(t){const e=ni(t.serviceStatus),i=t.delayInfo.text;return`${e} (${i})`}function oi(t,e,i,a){const s=t.tripStatus?.activeTripId??t.tripId??"",o=a.get(s);if(!o||o.routeId!==e.routeKey)return null;const r=t.tripStatus?.closestStop,l=t.tripStatus?.nextStop,d=i.stationIndexByStopId.get(r),u=i.stationIndexByStopId.get(l);if(d==null&&u==null)return null;let m=d??u,c=u??d;if(m>c){const ge=m;m=c,c=ge}const p=i.stations[m],f=i.stations[c],g=t.tripStatus?.closestStopTimeOffset??0,I=t.tripStatus?.nextStopTimeOffset??0,rt=o.directionId==="1"?"▲":o.directionId==="0"?"▼":ei(d,u);let x=0;m!==c&&g<0&&I>0&&(x=O(Math.abs(g)/(Math.abs(g)+I),0,1));const re=p.y+(f.y-p.y)*x,le=m!==c?p.segmentMinutes:0,ce=p.cumulativeMinutes+le*x,B=d??u??m,lt=i.stations[B]??p,ct=rt==="▲",de=O(B+(ct?1:-1),0,i.stations.length-1),ue=d!=null&&u!=null&&d!==u?u:O(B+(ct?-1:1),0,i.stations.length-1),pe=i.stations[de]??lt,me=i.stations[ue]??f,dt=t.tripStatus?.scheduleDeviation??0,ut=t.tripStatus?.predicted??!1,fe=ai(dt,ut);return{id:t.vehicleId,label:t.vehicleId.replace(/^\d+_/,""),directionSymbol:rt,fromLabel:p.label,minutePosition:ce,progress:x,serviceStatus:ii(t),toLabel:f.label,y:re,currentLabel:p.label,nextLabel:f.label,previousLabel:pe.label,currentStopLabel:lt.label,upcomingLabel:me.label,status:t.tripStatus?.status??"",closestStop:r,nextStop:l,closestOffset:g,nextOffset:I,scheduleDeviation:dt,isPredicted:ut,delayInfo:fe,rawVehicle:t}}function Wt(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function Vt(){return n.lines.flatMap(t=>(n.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function ri(){return Object.values(R).filter(t=>n.systemsById.has(t.id)).map(t=>`
        <button
          class="tab-button ${t.id===n.activeSystemId?"is-active":""}"
          data-system-switch="${t.id}"
          type="button"
        >
          ${t.label}
        </button>
      `).join("")}function q(){return!n.compactLayout||n.lines.length<2?"":`<section class="line-switcher">${n.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===n.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function V(t,e){const i=[...t].sort((o,r)=>o.minutePosition-r.minutePosition),a=[...e].sort((o,r)=>o.minutePosition-r.minutePosition),s=o=>o.slice(1).map((r,l)=>Math.round(r.minutePosition-o[l].minutePosition));return{nbGaps:s(i),sbGaps:s(a)}}function li(t){if(!t.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const e=t.reduce((s,o)=>s+o,0)/t.length,i=Math.max(...t),a=Math.min(...t);return{avg:Math.round(e),max:i,min:a,spread:i-a,ratio:i/Math.max(a,1)}}function Y(t,e){const i=li(t);if(e<2||i.avg==null)return{health:"quiet",stats:i};let a="healthy";return i.max>=12&&i.min<=4||i.ratio>=3?a="bunched":i.max>=12||i.spread>=6?a="uneven":i.avg>=18&&(a="sparse"),{health:a,stats:i}}function It(t,e,i){const{health:a,stats:s}=Y(e,i),o=s.avg!=null?`~${s.avg} min`:"—",r=a==="healthy"?"Consistent spacing now":a==="uneven"?`Largest gap ${s.max} min`:a==="bunched"?"Short and long gaps at once":a==="sparse"?"Service spread is thin":i<2?`Too few ${v().toLowerCase()}`:"Low frequency";return`
    <div class="headway-health-card headway-health-card-${a}">
      <p class="headway-health-label">${t}</p>
      <p class="headway-health-value">${o}</p>
      <p class="headway-health-copy">${r}</p>
    </div>
  `}function ci(t){return t.reduce((e,i)=>{const a=Number(i.scheduleDeviation??0);return a<=60?e.onTime+=1:a<=300?e.minorLate+=1:e.severeLate+=1,e},{onTime:0,minorLate:0,severeLate:0})}function Yt(t,e){return e?`${Math.round(t/e*100)}%`:"—"}function di(t,e){return Math.abs(t.length-e.length)<=1?{label:"Balanced",tone:"healthy"}:t.length>e.length?{label:"▲ Heavier",tone:"warn"}:{label:"▼ Heavier",tone:"warn"}}function ui(t,e){return`
    <div class="delay-distribution">
      ${[["On time",t.onTime,"healthy"],["2-5 min late",t.minorLate,"warn"],["5+ min late",t.severeLate,"alert"]].map(([a,s,o])=>`
        <div class="delay-chip delay-chip-${o}">
          <p class="delay-chip-label">${a}</p>
          <p class="delay-chip-value">${s}</p>
          <p class="delay-chip-copy">${Yt(s,e)}</p>
        </div>
      `).join("")}
    </div>
  `}function Dt(t,e,i,a){if(!e.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${t}</p>
          <p class="flow-lane-copy">No live ${v().toLowerCase()}</p>
        </div>
      </div>
    `;const s=[...e].sort((r,l)=>r.minutePosition-l.minutePosition),o=s.map(r=>{const l=i.totalMinutes>0?r.minutePosition/i.totalMinutes:0;return Math.max(0,Math.min(100,l*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${t}</p>
        <p class="flow-lane-copy">${s.length} live ${s.length===1?b().toLowerCase():v().toLowerCase()}</p>
      </div>
      <div class="flow-track" style="--line-color:${a};">
        ${o.map((r,l)=>`
          <span
            class="flow-vehicle"
            style="left:${r}%; --line-color:${a};"
            title="${s[l].label} · ${Wt(s[l])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function jt(t,e,i,a){const s=[],{stats:o}=Y(V(e,[]).nbGaps,e.length),{stats:r}=Y(V([],i).sbGaps,i.length),l=[...e,...i].filter(u=>Number(u.scheduleDeviation??0)>300),d=Math.abs(e.length-i.length);return o.max!=null&&o.max>=12&&s.push({tone:"alert",copy:`Direction ▲ has a ${o.max} min service hole right now.`}),r.max!=null&&r.max>=12&&s.push({tone:"alert",copy:`Direction ▼ has a ${r.max} min service hole right now.`}),d>=2&&s.push({tone:"warn",copy:e.length>i.length?`Vehicle distribution is tilted toward ▲ by ${d}.`:`Vehicle distribution is tilted toward ▼ by ${d}.`}),l.length&&s.push({tone:"warn",copy:`${l.length} ${l.length===1?b().toLowerCase():v().toLowerCase()} are running 5+ min late.`}),a.length&&s.push({tone:"info",copy:`${a.length} active alert${a.length===1?"":"s"} affecting ${t.name}.`}),s.length||s.push({tone:"healthy",copy:"Spacing and punctuality look stable right now."}),s.slice(0,4)}function pi(t){const e=t.flatMap(s=>s.exceptions.map(o=>({tone:o.tone,copy:`${s.line.name}: ${o.copy}`,lineColor:s.line.color})));if(!e.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="Current insights summary">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">No active issues right now.</span>
        </div>
      </section>
    `;const i=n.insightsTickerIndex%e.length,a=e[i];return`
    <section class="insights-ticker" aria-label="Current insights summary">
      <div class="insights-ticker-viewport">
        <span class="insights-ticker-item insights-ticker-item-${a.tone} insights-ticker-item-animated">
          <span class="insights-ticker-dot" style="--line-color:${a.lineColor};"></span>
          <span>${a.copy}</span>
        </span>
      </div>
    </section>
  `}function mi(t,e,i,a,s){const o=i.length+a.length;if(!o)return"";const{nbGaps:r,sbGaps:l}=V(i,a),d=[...i,...a],u=ci(d),m=[...r,...l].length?Math.max(...r,...l):null,c=di(i,a),p=jt(t,i,a,s),f=new Set(s.flatMap(g=>g.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">In Service</p>
          <p class="metric-chip-value">${o}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">On-Time Rate</p>
          <p class="metric-chip-value">${Yt(u.onTime,o)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">Worst Gap</p>
          <p class="metric-chip-value">${m!=null?`${m} min`:"—"}</p>
        </div>
        <div class="metric-chip metric-chip-${c.tone}">
          <p class="metric-chip-label">Balance</p>
          <p class="metric-chip-value">${c.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${It("Direction ▲",r,i.length)}
        ${It("Direction ▼",l,a.length)}
      </div>
      ${ui(u,o)}
      <div class="flow-grid">
        ${Dt("Direction ▲ Flow",i,e,t.color)}
        ${Dt("Direction ▼ Flow",a,e,t.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">Now</p>
          <p class="headway-chart-copy">${s.length?`${s.length} active alert${s.length===1?"":"s"}${f?` · ${f} impacted stops`:""}`:"No active alerts on this line"}</p>
        </div>
        ${p.map(g=>`
          <div class="insight-exception insight-exception-${g.tone}">
            <p>${g.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function Gt(t,e=!1){const i=Date.now(),a=o=>{const r=o.arrivalTime,l=Math.floor((r-i)/1e3),d=Bt(l),u=Qt(o.arrivalTime,o.scheduleDeviation??0),m=it(u);let c="";if(o.distanceFromStop>0){const p=o.distanceFromStop>=1e3?`${(o.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(o.distanceFromStop)}m`,f=o.numberOfStopsAway===1?"1 stop away":`${o.numberOfStopsAway} stops away`;c=` • ${p} • ${f}`}return`
      <div class="arrival-item" data-arrival-time="${o.arrivalTime}" data-schedule-deviation="${o.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${o.lineColor};">${o.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${o.lineName} ${b()} ${o.vehicleId}</span>
            <span class="arrival-destination">To ${o.destination}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${m}">${u}</span>
          <span class="arrival-time"><span class="arrival-countdown">${d}</span><span class="arrival-precision">${c}</span></span>
        </span>
      </div>
    `};if(e){yt.innerHTML="",bt.innerHTML="",A.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',M.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',j();return}const s=(o,r,l)=>{if(!o.length){r.innerHTML="",l.innerHTML=`<div class="arrival-item muted">No upcoming ${v().toLowerCase()}</div>`;return}const d=n.dialogDisplayMode?o.slice(0,2):[],u=n.dialogDisplayMode?o.slice(2):o;r.innerHTML=d.map(a).join(""),l.innerHTML=u.length?u.map(a).join(""):n.dialogDisplayMode?`<div class="arrival-item muted">No additional ${v().toLowerCase()}</div>`:""};s(t.nb,yt,A),s(t.sb,bt,M),j()}function X(t,e){const i=new Set(e.stationAliases?.[t.id]??[]);i.add(t.id);const a=new Set;for(const o of i){const r=o.startsWith(`${e.agencyId}_`)?o:`${e.agencyId}_${o}`;a.add(r)}const s=t.id.replace(/-T\d+$/,"");return a.add(s.startsWith(`${e.agencyId}_`)?s:`${e.agencyId}_${s}`),[...a]}function Kt(t){const e=n.lines.map(i=>{const a=i.stops.find(s=>s.id===t.id);return a?{line:i,station:a}:null}).filter(Boolean);return e.length>0?e:n.lines.map(i=>{const a=i.stops.find(s=>s.name===t.name);return a?{line:i,station:a}:null}).filter(Boolean)}function fi(t){if(!t)return null;const e=t.trim().toLowerCase();for(const i of n.lines)for(const a of i.stops){const s=new Set([a.id,`${i.agencyId}_${a.id}`,a.name,N(a.name),C(a.name),C(N(a.name))]);for(const o of i.stationAliases?.[a.id]??[])s.add(o),s.add(`${i.agencyId}_${o}`),s.add(C(o));if([...s].some(o=>String(o).toLowerCase()===e))return a}return null}function gi(t){const e=new URL(window.location.href);e.searchParams.set("station",C(t.name)),window.history.pushState({},"",e)}function zt(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function At(t){const e=new URL(window.location.href);t===T?e.searchParams.delete("system"):e.searchParams.set("system",t),window.history.pushState({},"",e)}function Xt(){const e=new URL(window.location.href).searchParams.get("system");return e&&n.systemsById.has(e)?e:T}function Z(t){n.dialogDisplayMode=t,h.classList.toggle("is-display-mode",t),W.textContent=t?"Exit":"Board",W.setAttribute("aria-label",t?"Exit display mode":"Toggle display mode"),n.dialogDisplayDirection="both",n.dialogDisplayAutoPhase="nb",Q(),h.open&&n.currentDialogStation&&at(n.currentDialogStation).catch(console.error),j()}function hi(){Z(!n.dialogDisplayMode)}function J(){n.dialogDisplayDirectionTimer&&(window.clearInterval(n.dialogDisplayDirectionTimer),n.dialogDisplayDirectionTimer=0)}function Q(){J();const t=n.dialogDisplayDirection,e=t==="auto"?n.dialogDisplayAutoPhase:t;Nt.forEach(i=>{i.classList.toggle("is-active",i.dataset.dialogDirection===t)}),h.classList.toggle("show-nb-only",n.dialogDisplayMode&&e==="nb"),h.classList.toggle("show-sb-only",n.dialogDisplayMode&&e==="sb"),n.dialogDisplayMode&&t==="auto"&&(n.dialogDisplayDirectionTimer=window.setInterval(()=>{n.dialogDisplayAutoPhase=n.dialogDisplayAutoPhase==="nb"?"sb":"nb",Q()},Me))}function tt(){n.dialogRefreshTimer&&(window.clearTimeout(n.dialogRefreshTimer),n.dialogRefreshTimer=0)}function et(){n.dialogDisplayTimer&&(window.clearInterval(n.dialogDisplayTimer),n.dialogDisplayTimer=0)}function U(t,e){const i=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(t.style.transform="translateY(0)",!n.dialogDisplayMode||i.length<=3)return;const a=Number.parseFloat(window.getComputedStyle(t).rowGap||"0")||0,s=i[0].getBoundingClientRect().height+a,o=Math.max(0,i.length-3),r=Math.min(n.dialogDisplayIndexes[e],o);t.style.transform=`translateY(-${r*s}px)`}function j(){et(),n.dialogDisplayIndexes={nb:0,sb:0},U(A,"nb"),U(M,"sb"),n.dialogDisplayMode&&(n.dialogDisplayTimer=window.setInterval(()=>{for(const[t,e]of[["nb",A],["sb",M]]){const i=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(i.length<=3)continue;const a=Math.max(0,i.length-3);n.dialogDisplayIndexes[t]=n.dialogDisplayIndexes[t]>=a?0:n.dialogDisplayIndexes[t]+1,U(e,t)}},Ae))}function vi(){if(!h.open)return;h.querySelectorAll(".arrival-item[data-arrival-time]").forEach(e=>{const i=Number(e.dataset.arrivalTime),a=Number(e.dataset.scheduleDeviation||0),s=e.querySelector(".arrival-countdown"),o=e.querySelector(".arrival-status");if(!s||!o)return;s.textContent=Bt(Math.floor((i-Date.now())/1e3));const r=Qt(i,a),l=it(r);o.textContent=r,o.className=`arrival-status arrival-status-${l}`})}function yi(){if(tt(),!n.currentDialogStation)return;const t=()=>{n.dialogRefreshTimer=window.setTimeout(async()=>{!h.open||!n.currentDialogStation||(await at(n.currentDialogStation).catch(console.error),t())},De)};t()}function Zt(){n.currentDialogStationId="",n.currentDialogStation=null,h.open?h.close():(tt(),et(),J(),Z(!1),zt())}async function Mt(){const t=Xt();t!==n.activeSystemId&&await oe(t,{updateUrl:!1,preserveDialog:!1});const e=new URL(window.location.href).searchParams.get("station"),i=fi(e);n.isSyncingFromUrl=!0;try{if(!i){n.currentDialogStationId="",h.open&&h.close();return}if(n.activeTab="map",y(),n.currentDialogStationId===i.id&&h.open)return;await ie(i,!1)}finally{n.isSyncingFromUrl=!1}}function bi(t,e){const i=e.directionLookup?.[t.tripId??""];if(i==="1")return"nb";if(i==="0")return"sb";const a=t.tripHeadsign??"",s=a.toLowerCase();return e.nbTerminusPrefix&&s.startsWith(e.nbTerminusPrefix)?"nb":e.sbTerminusPrefix&&s.startsWith(e.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(a)?"nb":/Federal Way|South Bellevue/i.test(a)?"sb":""}function Jt(t){return t.routeKey??`${t.agencyId}_${t.id}`}function Si(t){const e=t.tripHeadsign?.trim();return e?N(e.replace(/^to\s+/i,"")):"Terminal"}function Qt(t,e){return Math.floor((t-Date.now())/1e3)<=90?"ARR":e>=120?"DELAY":"ON TIME"}function it(t){return t==="DELAY"?"delay":t==="ARR"?"arr":"ok"}async function wi(t){const e=`${xt}/arrivals-and-departures-for-stop/${t}.json?key=${G}&minutesAfter=120`,i=await Ft(e,"Arrivals");if(i.code!==200)throw new Error(i.text||`Arrivals request failed for ${t}`);return i.data?.entry?.arrivalsAndDepartures??[]}async function te(t){const e=[...new Set(t)],i=[],a=[];for(let s=0;s<e.length;s+=_){const o=e.slice(s,s+_),r=await Promise.allSettled(o.map(l=>wi(l)));i.push(...r),gt>0&&s+_<e.length&&await z(gt)}for(const s of i)s.status==="fulfilled"&&a.push(...s.value);return a}function $i(t,e){const i=Date.now(),a=new Set,s={nb:[],sb:[]};for(const o of t){if(o.routeId!==Jt(e))continue;const r=o.predictedArrivalTime||o.scheduledArrivalTime;if(!r||r<=i)continue;const l=bi(o,e);if(!l)continue;const d=`${o.tripId}:${o.stopId}:${r}`;a.has(d)||(a.add(d),s[l].push({vehicleId:(o.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:r,destination:Si(o),scheduleDeviation:o.scheduleDeviation??0,tripId:o.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0],distanceFromStop:o.distanceFromStop??0,numberOfStopsAway:o.numberOfStopsAway??0}))}return s.nb.sort((o,r)=>o.arrivalTime-r.arrivalTime),s.sb.sort((o,r)=>o.arrivalTime-r.arrivalTime),s.nb=s.nb.slice(0,4),s.sb=s.sb.slice(0,4),s}async function Li(t,e,i=null){const a=`${n.activeSystemId}:${e.id}:${t.id}`,s=n.arrivalsCache.get(a);if(s&&Date.now()-s.fetchedAt<we)return s.value;const o=X(t,e),r=i??await te(o),l=$i(r,e);return n.arrivalsCache.set(a,{fetchedAt:Date.now(),value:l}),l}function Ti(t){const e={nb:[],sb:[]};for(const i of t)e.nb.push(...i.nb),e.sb.push(...i.sb);return e.nb.sort((i,a)=>i.arrivalTime-a.arrivalTime),e.sb.sort((i,a)=>i.arrivalTime-a.arrivalTime),e}function ee(t){const e=Xe(t);if(!e.length){D.innerHTML="",D.hidden=!0;return}D.hidden=!1,D.innerHTML=`
    <div class="station-alerts">
      ${e.map((i,a)=>`
        <button class="station-alert-pill" data-alert-idx="${a}" type="button">
          <span class="station-alert-pill-meta">${qt(i.severity)} · ${Ot(i.effect)}</span>
          <span class="station-alert-pill-copy">${i.title||"Service alert"}</span>
        </button>
      `).join("")}
    </div>
  `,D.querySelectorAll(".station-alert-pill").forEach(i=>{const a=e[Number(i.dataset.alertIdx)];a&&i.addEventListener("click",()=>{const s=n.lines.find(o=>a.lineIds.includes(o.id));s&&ae(s)})})}async function ie(t,e=!0){Re.textContent=t.name,n.currentDialogStationId=t.id,n.currentDialogStation=t,ee(t),Gt({nb:[],sb:[]},!0),e&&gi(t),h.showModal(),yi(),await at(t)}async function at(t){const e=n.activeDialogRequest+1;n.activeDialogRequest=e;try{const i=Kt(t),a=i.flatMap(({station:r,line:l})=>X(r,l)),s=await te(a),o=await Promise.all(i.map(({station:r,line:l})=>Li(r,l,s)));if(n.activeDialogRequest!==e||!h.open)return;ee(t),Gt(Ti(o))}catch(i){if(n.activeDialogRequest!==e||!h.open)return;A.innerHTML=`<div class="arrival-item muted">${i.message}</div>`,M.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function Ii(t){const e=n.layouts.get(t.id),i=n.vehiclesByLine.get(t.id)??[],a=E(t.id),s=e.stations.map((l,d)=>{const u=e.stations[d-1],m=d>0?u.segmentMinutes:"",p=Ut(l,t).length>0,f=l.isTerminal?15:10;return`
        <g transform="translate(0, ${l.y})" class="station-group${p?" has-alert":""}" data-stop-id="${l.id}" style="cursor: pointer;">
          ${d>0?`<text x="0" y="-14" class="segment-time">${m}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${l.isTerminal?11:5}" class="${l.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${l.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          ${p?`<circle cx="${e.trackX+f}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${l.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),o=i.map((l,d)=>`
        <g transform="translate(${e.trackX}, ${l.y+(d%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${d*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${l.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),r=b();return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <div class="line-title-row">
              <h2>${t.name}</h2>
              ${Ht(a,t.id)}
            </div>
            <p>${i.length} live ${i.length===1?r.toLowerCase():v().toLowerCase()}</p>
            <p>${_t(t)}</p>
          </div>
        </div>
      </header>
      <svg viewBox="0 0 460 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${s}
        ${o}
      </svg>
    </article>
  `}function Di(){const t=Vt().sort((r,l)=>r.minutePosition-l.minutePosition),e=b(),i=v(),a=i.toLowerCase();return t.length?(n.compactLayout?n.lines.filter(r=>r.id===n.activeLineId):n.lines).map(r=>{const l=t.filter(p=>p.lineId===r.id),d=E(r.id),u=l.filter(p=>p.directionSymbol==="▲"),m=l.filter(p=>p.directionSymbol==="▼"),c=(p,f)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${p}</p>
          ${f.length?f.map(g=>`
                      <article class="train-list-item" data-train-id="${g.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${g.lineColor};">${g.lineToken}</span>
                          <div>
                            <p class="train-list-title">${g.lineName} ${e} ${g.label}</p>
                            <p class="train-list-subtitle">${Wt(g)}</p>
                            <p class="train-list-status ${g.delayInfo.colorClass}">${si(g)}</p>
                          </div>
                        </div>
                      </article>
                    `).join(""):`<p class="train-readout muted">No ${v().toLowerCase()}</p>`}
        </div>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${r.color};">${r.name[0]}</span>
              <div>
                <div class="line-title-row">
                  <h2>${r.name}</h2>
                  ${Ht(d,r.id)}
                </div>
                <p>${l.length} ${l.length===1?e.toLowerCase():v().toLowerCase()} in service</p>
              </div>
            </div>
          </header>
          <div class="line-readout line-readout-grid train-columns">
            ${c("NB",u)}
            ${c("SB",m)}
          </div>
        </article>
      `}).join(""):`
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>Active ${i}</h2>
          <p>No live ${a}</p>
        </article>
      </section>
    `}function Ai(){const t=n.compactLayout?n.lines.filter(a=>a.id===n.activeLineId):n.lines,e=b(),i=t.map(a=>{const s=n.layouts.get(a.id),o=n.vehiclesByLine.get(a.id)??[],r=o.filter(u=>u.directionSymbol==="▲"),l=o.filter(u=>u.directionSymbol==="▼"),d=E(a.id);return{line:a,layout:s,vehicles:o,nb:r,sb:l,lineAlerts:d,exceptions:jt(a,r,l,d)}});return`
    ${pi(i)}
    ${i.map(({line:a,layout:s,vehicles:o,nb:r,sb:l,lineAlerts:d})=>{const u=mi(a,s,r,l,d);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${a.color};">${a.name[0]}</span>
              <div>
                <h2>${a.name}</h2>
                <p>${o.length} live ${o.length===1?b().toLowerCase():v().toLowerCase()} · ${_t(a)}</p>
              </div>
            </div>
          </header>
          ${u||`<p class="train-readout muted">Waiting for live ${e.toLowerCase()} data…</p>`}
        </article>
      `}).join("")}
  `}function Mi(){document.querySelectorAll("[data-system-switch]").forEach(e=>{e.addEventListener("click",async()=>{await oe(e.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function H(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{n.activeLineId=e.dataset.lineSwitch,y()})})}function nt(){n.currentTrainId="",$.open&&$.close()}function st(){L.open&&L.close()}function ae(t){const e=E(t.id);qe.textContent=`${t.name} Alerts`,Ue.textContent=`${e.length} active alert${e.length===1?"":"s"}`,He.textContent=t.name,wt.textContent="",wt.innerHTML=e.length?e.map(i=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${qt(i.severity)} • ${Ot(i.effect)}</p>
              <p class="alert-dialog-item-title">${i.title||"Service alert"}</p>
              <p class="alert-dialog-item-copy">${i.description||"No additional alert details available."}</p>
              ${i.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${i.url}" target="_blank" rel="noreferrer">Read official alert</a></p>`:""}
            </article>
          `).join(""):'<p class="alert-dialog-item-copy">No active alerts.</p>',$t.hidden=!0,$t.removeAttribute("href"),L.open||L.showModal()}function Et(){document.querySelectorAll("[data-alert-line-id]").forEach(e=>{e.addEventListener("click",()=>{const i=n.lines.find(a=>a.id===e.dataset.alertLineId);i&&ae(i)})})}function Ei(t){const e=t.fromLabel!==t.toLabel&&t.progress>0&&t.progress<1,i=e?t.fromLabel:t.previousLabel,a=e?`${t.fromLabel} -> ${t.toLabel}`:t.currentStopLabel,s=e?"Between":"Now",o=e?t.toLabel:t.upcomingLabel,r=e?t.progress:.5;Pe.textContent=`${t.lineName} ${b()} ${t.label}`,Be.textContent=t.directionSymbol==="▲"?"Direction A movement":"Direction B movement",St.className=`train-detail-status train-list-status-${it(t.serviceStatus)}`,St.textContent=t.serviceStatus,_e.innerHTML=`
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
        <p class="train-detail-name">${i}</p>
      </div>
    </div>
    <div class="train-detail-stop is-current">
      <span class="train-detail-marker train-detail-marker-ghost"></span>
      <div>
        <p class="train-detail-label">${s}</p>
        <p class="train-detail-name">${a}</p>
      </div>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">Next</p>
        <p class="train-detail-name">${o}</p>
      </div>
    </div>
  `,$.open||$.showModal()}function xi(){document.querySelectorAll("[data-train-id]").forEach(e=>{e.addEventListener("click",()=>{const i=e.dataset.trainId,a=Vt().find(s=>s.id===i);a&&(n.currentTrainId=i,Ei(a))})})}function ki(){n.lines.forEach(t=>{const e=n.layouts.get(t.id),i=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!i)return;i.querySelectorAll(".station-group").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.stopId,r=e.stations.find(l=>l.id===o);r&&ie(r)})})})}function y(){const t=K();if(Rt.textContent=n.theme==="dark"?"Light":"Dark",xe.textContent=t.kicker,ke.textContent=t.title,ht.hidden=n.systemsById.size<2,ht.innerHTML=ri(),ne(),Ct.forEach(e=>e.classList.toggle("is-active",e.dataset.tab===n.activeTab)),document.querySelector("#tab-trains").textContent=v(),Mi(),n.activeTab==="map"){S.className="board";const e=n.compactLayout?n.lines.filter(i=>i.id===n.activeLineId):n.lines;S.innerHTML=`${q()}${e.map(Ii).join("")}`,H(),Et(),ki(),queueMicrotask(P);return}if(n.activeTab==="trains"){S.className="board",S.innerHTML=`${q()}${Di()}`,H(),Et(),xi(),queueMicrotask(P);return}n.activeTab==="insights"&&(S.className="board",S.innerHTML=`${q()}${Ai()}`,H())}function Ci(){window.clearInterval(n.insightsTickerTimer),n.insightsTickerTimer=0}function Ri(){Ci(),n.insightsTickerTimer=window.setInterval(()=>{n.insightsTickerIndex+=1,n.activeTab==="insights"&&y()},5e3)}function ne(){k.textContent=n.error?"HOLD":"SYNC",k.classList.toggle("status-pill-error",!!n.error),Ce.textContent=`Now ${Ke()}`,F.textContent=n.error?"Using last successful snapshot":Ge(n.fetchedAt),vt.textContent=k.textContent,vt.classList.toggle("status-pill-error",!!n.error),Ne.textContent=F.textContent}function Ni(){window.clearTimeout(n.liveRefreshTimer),n.liveRefreshTimer=0}function Pi(){Ni();const t=()=>{n.liveRefreshTimer=window.setTimeout(async()=>{await ot(),t()},Ie)};t()}function se(t){const e=n.systemsById.has(t)?t:T,i=n.systemsById.get(e);n.activeSystemId=e,n.lines=i?.lines??[],n.layouts=n.layoutsBySystem.get(e)??new Map,n.lines.some(a=>a.id===n.activeLineId)||(n.activeLineId=n.lines[0]?.id??""),n.vehiclesByLine=new Map,n.rawVehicles=[],n.arrivalsCache.clear(),n.alerts=[],n.error="",n.fetchedAt="",n.insightsTickerIndex=0}async function oe(t,{updateUrl:e=!0,preserveDialog:i=!1}={}){if(!n.systemsById.has(t)||n.activeSystemId===t){e&&At(n.activeSystemId);return}se(t),i||Zt(),nt(),st(),y(),e&&At(t),await ot()}async function Bi(){const i=(await(await fetch(Se,{cache:"no-store"})).json()).systems??[];n.systemsById=new Map(i.map(a=>[a.id,a])),n.layoutsBySystem=new Map(i.map(a=>[a.id,new Map(a.lines.map(s=>[s.id,ti(s)]))])),se(Xt())}function _i(t){const e=[...new Set((t.allAffects??[]).map(a=>a.routeId).filter(Boolean))],i=n.lines.filter(a=>e.includes(Jt(a))).map(a=>a.id);return i.length?{id:t.id,effect:t.reason??"SERVICE ALERT",severity:t.severity??"INFO",title:t.summary?.value??"Service alert",description:t.description?.value??"",url:t.url?.value??"",lineIds:i,stopIds:[...new Set((t.allAffects??[]).map(a=>a.stopId).filter(Boolean))]}:null}async function ot(){try{const t=await Ft(Ve(),"Realtime");n.error="",n.fetchedAt=new Date().toISOString(),n.rawVehicles=t.data.list??[],n.alerts=(t.data.references?.situations??[]).map(_i).filter(Boolean);const e=new Map((t.data.references?.trips??[]).map(i=>[i.id,i]));for(const i of n.lines){const a=n.layouts.get(i.id),s=n.rawVehicles.map(o=>oi(o,i,a,e)).filter(Boolean);n.vehiclesByLine.set(i.id,s)}}catch(t){n.error="Realtime offline",console.error(t)}y()}async function Oi(){Pt(je()),Lt(),await Bi(),y(),await ot(),await Mt(),window.addEventListener("popstate",()=>{Mt().catch(console.error)});const t=()=>{const i=n.compactLayout;if(Lt(),i!==n.compactLayout){y();return}P()};window.addEventListener("resize",t),window.visualViewport?.addEventListener("resize",t),new ResizeObserver(()=>{P()}).observe(S),Pi(),Ri(),window.setInterval(()=>{ne(),vi()},1e3)}Oi().catch(t=>{k.textContent="FAIL",F.textContent=t.message});
