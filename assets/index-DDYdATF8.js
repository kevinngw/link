(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const Le="modulepreload",Ie=function(t){return"/link/"+t},yt={},Te=function(e,a,i){let n=Promise.resolve();if(a&&a.length>0){let u=function(m){return Promise.all(m.map(c=>Promise.resolve(c).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var r=u;document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");n=u(a.map(m=>{if(m=Ie(m),m in yt)return;yt[m]=!0;const c=m.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${p}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":Le,c||(f.as="script"),f.crossOrigin="",f.href=m,d&&f.setAttribute("nonce",d),document.head.appendChild(f),c)return new Promise((g,D)=>{f.addEventListener("load",g),f.addEventListener("error",()=>D(new Error(`Unable to preload CSS for ${m}`)))})}))}function o(l){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=l,window.dispatchEvent(d),!d.defaultPrevented)throw l}return n.then(l=>{for(const d of l||[])d.status==="rejected"&&o(d.reason);return e().catch(o)})};function De(t={}){const{immediate:e=!1,onNeedRefresh:a,onOfflineReady:i,onRegistered:n,onRegisteredSW:o,onRegisterError:r}=t;let l,d;const u=async(c=!0)=>{await d};async function m(){if("serviceWorker"in navigator){if(l=await Te(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/link/sw.js",{scope:"/link/",type:"classic"})).catch(c=>{r?.(c)}),!l)return;l.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),l.addEventListener("installed",c=>{c.isUpdate||i?.()}),l.register({immediate:e}).then(c=>{o?o("/link/sw.js",c):n?.(c)}).catch(c=>{r?.(c)})}}return d=m(),u}const Ae="./pulse-data.json",Ot="https://api.pugetsound.onebusaway.org/api/where",J="TEST".trim()||"TEST",$=J==="TEST",xe=$?6e4:2e4,bt=3,Me=800,Ee=$?2e4:5e3,St=$?12e4:3e4,wt=$?1200:0,F=$?1:3,Ce=1100,ke=$?45e3:15e3,Re=$?9e4:3e4,Ne=4e3,Pe=15e3,qt="link-pulse-theme",T="link",O={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},s={fetchedAt:"",error:"",activeSystemId:T,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0},Oe=De({immediate:!0,onNeedRefresh(){Oe(!0)}});document.querySelector("#app").innerHTML=`
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
`;const w=document.querySelector("#board"),qe=document.querySelector("#screen-kicker"),Be=document.querySelector("#screen-title"),$t=document.querySelector("#system-bar"),Bt=[...document.querySelectorAll(".tab-button")],_t=document.querySelector("#theme-toggle"),N=document.querySelector("#status-pill"),_e=document.querySelector("#current-time"),G=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),Ue=document.querySelector("#dialog-title"),Lt=document.querySelector("#dialog-status-pill"),He=document.querySelector("#dialog-updated-at"),K=document.querySelector("#dialog-display"),Ut=[...document.querySelectorAll("[data-dialog-direction]")],A=document.querySelector("#station-alerts-container"),It=document.querySelector("#arrivals-nb-pinned"),M=document.querySelector("#arrivals-nb"),Tt=document.querySelector("#arrivals-sb-pinned"),E=document.querySelector("#arrivals-sb"),L=document.querySelector("#train-dialog"),Fe=document.querySelector("#train-dialog-title"),Ve=document.querySelector("#train-dialog-subtitle"),We=document.querySelector("#train-dialog-line"),Dt=document.querySelector("#train-dialog-status"),Ye=document.querySelector("#train-dialog-close"),I=document.querySelector("#alert-dialog"),je=document.querySelector("#alert-dialog-title"),Ge=document.querySelector("#alert-dialog-subtitle"),Ke=document.querySelector("#alert-dialog-lines"),At=document.querySelector("#alert-dialog-body"),xt=document.querySelector("#alert-dialog-link"),ze=document.querySelector("#alert-dialog-close");K.addEventListener("click",()=>Ia());Ye.addEventListener("click",()=>dt());ze.addEventListener("click",()=>ut());Ut.forEach(t=>{t.addEventListener("click",()=>{s.dialogDisplayDirection=t.dataset.dialogDirection,s.dialogDisplayDirection==="auto"&&(s.dialogDisplayAutoPhase="nb"),st()})});h.addEventListener("click",t=>{t.target===h&&ne()});L.addEventListener("click",t=>{t.target===L&&dt()});I.addEventListener("click",t=>{t.target===I&&ut()});h.addEventListener("close",()=>{ot(),rt(),nt(),it(!1),s.isSyncingFromUrl||ae()});Bt.forEach(t=>{t.addEventListener("click",()=>{s.activeTab=t.dataset.tab,b()})});_t.addEventListener("click",()=>{Ht(s.theme==="dark"?"light":"dark"),b()});function Q(){return O[s.activeSystemId]??O[T]}function Xe(){return s.systemsById.get(s.activeSystemId)?.agencyId??O[T].agencyId}function Ze(){return`${Ot}/vehicles-for-agency/${Xe()}.json?key=${J}`}function S(){return Q().vehicleLabel??"Vehicle"}function Je(t){return/bus$/i.test(t)?`${t}es`:`${t}s`}function v(){return Q().vehicleLabelPlural??Je(S())}function q(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function Qe(){const t=window.localStorage.getItem(qt);return t==="light"||t==="dark"?t:"dark"}function Ht(t){s.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(qt,t)}function Mt(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(e,t,a);s.compactLayout=i<=Ce}function B(){const a=window.getComputedStyle(w).gridTemplateColumns.split(" ").map(i=>i.trim()).filter(Boolean).length<=1;a!==s.compactLayout&&(s.compactLayout=a,b())}function P(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function V(t,e,a){return Math.max(e,Math.min(t,a))}function ta(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function ea(){return new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit"}).format(new Date)}function _(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),a=t%60;return e>0?`${e}m ${a}s`:`${a}s`}function aa(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function Et(t){if(!t)return"";const[e="0",a="0"]=String(t).split(":"),i=Number(e),n=Number(a),o=(i%24+24)%24,r=o>=12?"PM":"AM";return`${o%12||12}:${String(n).padStart(2,"0")} ${r}`}function tt(t){const e=aa(),a=t.serviceSpansByDate?.[e];return a?`Today ${Et(a.start)} - ${Et(a.end)}`:"Today service hours unavailable"}function Ft(t){return String(t||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function Vt(t){return String(t||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function k(t){return s.alerts.filter(e=>e.lineIds.includes(t))}function Wt(t,e){const a=k(e.id);if(!a.length)return[];const i=new Set(at(t,e));return i.add(t.id),a.filter(n=>n.stopIds.length>0&&n.stopIds.some(o=>i.has(o)))}function ia(t){const e=new Set,a=[];for(const{station:i,line:n}of ee(t))for(const o of Wt(i,n))e.has(o.id)||(e.add(o.id),a.push(o));return a}function Yt(t,e){return t.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${e}">
      <span class="line-alert-badge-count">${t.length}</span>
      <span class="line-alert-badge-copy">alert${t.length===1?"":"s"}</span>
    </button>
  `:""}function et(t){return new Promise(e=>window.setTimeout(e,t))}function na(){const t=Math.max(0,s.obaRateLimitStreak-1),e=Math.min(St,Ee*2**t),a=Math.round(e*(.15+Math.random()*.2));return Math.min(St,e+a)}async function sa(){const t=s.obaCooldownUntil-Date.now();t>0&&await et(t)}function oa(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function jt(t,e){for(let a=0;a<=bt;a+=1){await sa();const i=await fetch(t,{cache:"no-store"});let n=null;try{n=await i.json()}catch{n=null}const o=i.status===429||oa(n);if(i.ok&&!o)return s.obaRateLimitStreak=0,s.obaCooldownUntil=0,n;if(a===bt||!o)throw n?.text?new Error(n.text):new Error(`${e} request failed with ${i.status}`);s.obaRateLimitStreak+=1;const r=Me*2**a,l=Math.max(r,na());s.obaCooldownUntil=Date.now()+l,await et(l)}throw new Error(`${e} request failed`)}function ra(t){const e=[...t.stops].sort((c,p)=>p.sequence-c.sequence),a=48,i=44,n=28,o=88,r=122,l=i+n+(e.length-1)*a,d=new Map,u=e.map((c,p)=>{const f={...c,label:q(c.name),y:i+p*a,index:p,isTerminal:p===0||p===e.length-1};d.set(c.id,p),d.set(`${t.agencyId}_${c.id}`,p);for(const g of t.stationAliases?.[c.id]??[])d.set(g,p),d.set(`${t.agencyId}_${g}`,p);return f});let m=0;for(let c=0;c<u.length;c+=1)u[c].cumulativeMinutes=m,m+=c<u.length-1?u[c].segmentMinutes:0;return{totalMinutes:m,height:l,labelX:r,stationGap:a,stationIndexByStopId:d,stations:u,trackX:o}}function la(t,e){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":"•"}function ca(t){const e=t.tripStatus??{},a=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const i=e.nextStopTimeOffset??0,n=e.scheduleDeviation??0,o=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return a==="approaching"||o&&Math.abs(i)<=90?"ARR":n>=120?"DELAY":"OK"}function da(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const a=Math.round(t/60);let i="status-late-minor";return t>600?i="status-late-severe":t>300&&(i="status-late-moderate"),{text:`+${a} min late`,colorClass:i}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function ua(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function y(t){if(!s.fetchedAt)return t;const e=Math.max(0,Math.floor((Date.now()-new Date(s.fetchedAt).getTime())/1e3));return t-e}function C(t,e){return e<=90?"status-arriving":t.delayInfo.colorClass}function Gt(t){const e=y(t.nextOffset??0),a=y(t.closestOffset??0),i=t.delayInfo.text;return e<=15?[{text:"Arriving now",toneClass:"status-arriving"},{text:i,toneClass:t.delayInfo.colorClass}]:e<=90?[{text:`Arriving in ${_(e)}`,toneClass:"status-arriving"},{text:i,toneClass:t.delayInfo.colorClass}]:a<0&&e>0?[{text:`Next stop in ${_(e)}`,toneClass:"status-arriving"},{text:i,toneClass:t.delayInfo.colorClass}]:[{text:ua(t.serviceStatus),toneClass:C(t,e)},{text:i,toneClass:t.delayInfo.colorClass}]}function x(t){return t.map(e=>`
        <span class="status-chip ${e.toneClass}">
          ${e.text}
        </span>
      `).join("")}function Kt(t){const e=y(t.nextOffset??0),a=y(t.closestOffset??0),i=t.upcomingLabel||t.toLabel||t.currentStopLabel,[n,o]=Gt(t);return e<=15?`${t.label} at ${i} ${x([n,o])}`:e<=90?`${t.label} at ${i} ${x([n,o])}`:a<0&&e>0?`${t.label} ${i} ${x([n,o])}`:`${t.label} to ${i} ${x([n,o])}`}function zt(t){return x(Gt(t))}function Xt(t,e){if(!e.length)return"";const a=[...e].sort((n,o)=>y(n.nextOffset??0)-y(o.nextOffset??0)).slice(0,8),i=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${t};">
      <div class="line-marquee-track">
        ${i.map(n=>`
          <span
            class="line-marquee-item ${C(n,y(n.nextOffset??0))}"
            data-vehicle-marquee="${n.id}"
          >
            <span class="line-marquee-token">${n.lineToken}</span>
            <span class="line-marquee-copy">${Kt(n)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function pa(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const i=a.dataset.vehicleStatus,n=U().find(r=>r.id===i);if(!n)return;const o=y(n.nextOffset??0);a.innerHTML=zt(n),a.className=`train-list-status ${C(n,o)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const i=a.dataset.vehicleMarquee,n=U().find(l=>l.id===i);if(!n)return;const o=y(n.nextOffset??0);a.className=`line-marquee-item ${C(n,o)}`;const r=a.querySelector(".line-marquee-copy");r&&(r.innerHTML=Kt(n))})}function ma(t,e,a,i){const n=t.tripStatus?.activeTripId??t.tripId??"",o=i.get(n);if(!o||o.routeId!==e.routeKey)return null;const r=t.tripStatus?.closestStop,l=t.tripStatus?.nextStop,d=a.stationIndexByStopId.get(r),u=a.stationIndexByStopId.get(l);if(d==null&&u==null)return null;let m=d??u,c=u??d;if(m>c){const $e=m;m=c,c=$e}const p=a.stations[m],f=a.stations[c],g=t.tripStatus?.closestStopTimeOffset??0,D=t.tripStatus?.nextStopTimeOffset??0,mt=o.directionId==="1"?"▲":o.directionId==="0"?"▼":la(d,u);let R=0;m!==c&&g<0&&D>0&&(R=V(Math.abs(g)/(Math.abs(g)+D),0,1));const fe=p.y+(f.y-p.y)*R,ge=m!==c?p.segmentMinutes:0,he=p.cumulativeMinutes+ge*R,H=d??u??m,ft=a.stations[H]??p,gt=mt==="▲",ve=V(H+(gt?1:-1),0,a.stations.length-1),ye=d!=null&&u!=null&&d!==u?u:V(H+(gt?-1:1),0,a.stations.length-1),be=a.stations[ve]??ft,Se=a.stations[ye]??f,ht=t.tripStatus?.scheduleDeviation??0,vt=t.tripStatus?.predicted??!1,we=da(ht,vt);return{id:t.vehicleId,label:t.vehicleId.replace(/^\d+_/,""),directionSymbol:mt,fromLabel:p.label,minutePosition:he,progress:R,serviceStatus:ca(t),toLabel:f.label,y:fe,currentLabel:p.label,nextLabel:f.label,previousLabel:be.label,currentStopLabel:ft.label,upcomingLabel:Se.label,status:t.tripStatus?.status??"",closestStop:r,nextStop:l,closestOffset:g,nextOffset:D,scheduleDeviation:ht,isPredicted:vt,delayInfo:we,rawVehicle:t}}function Zt(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function U(){return s.lines.flatMap(t=>(s.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function fa(){return Object.values(O).filter(t=>s.systemsById.has(t.id)).map(t=>`
        <button
          class="tab-button ${t.id===s.activeSystemId?"is-active":""}"
          data-system-switch="${t.id}"
          type="button"
        >
          ${t.label}
        </button>
      `).join("")}function W(){return!s.compactLayout||s.lines.length<2?"":`<section class="line-switcher">${s.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===s.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function z(t,e){const a=[...t].sort((o,r)=>o.minutePosition-r.minutePosition),i=[...e].sort((o,r)=>o.minutePosition-r.minutePosition),n=o=>o.slice(1).map((r,l)=>Math.round(r.minutePosition-o[l].minutePosition));return{nbGaps:n(a),sbGaps:n(i)}}function ga(t){if(!t.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const e=t.reduce((n,o)=>n+o,0)/t.length,a=Math.max(...t),i=Math.min(...t);return{avg:Math.round(e),max:a,min:i,spread:a-i,ratio:a/Math.max(i,1)}}function X(t,e){const a=ga(t);if(e<2||a.avg==null)return{health:"quiet",stats:a};let i="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?i="bunched":a.max>=12||a.spread>=6?i="uneven":a.avg>=18&&(i="sparse"),{health:i,stats:a}}function Ct(t,e,a){const{health:i,stats:n}=X(e,a),o=n.avg!=null?`~${n.avg} min`:"—",r=i==="healthy"?"Consistent spacing now":i==="uneven"?`Largest gap ${n.max} min`:i==="bunched"?"Short and long gaps at once":i==="sparse"?"Service spread is thin":a<2?`Too few ${v().toLowerCase()}`:"Low frequency";return`
    <div class="headway-health-card headway-health-card-${i}">
      <p class="headway-health-label">${t}</p>
      <p class="headway-health-value">${o}</p>
      <p class="headway-health-copy">${r}</p>
    </div>
  `}function ha(t){return t.reduce((e,a)=>{const i=Number(a.scheduleDeviation??0);return i<=60?e.onTime+=1:i<=300?e.minorLate+=1:e.severeLate+=1,e},{onTime:0,minorLate:0,severeLate:0})}function Jt(t,e){return e?`${Math.round(t/e*100)}%`:"—"}function va(t,e){return Math.abs(t.length-e.length)<=1?{label:"Balanced",tone:"healthy"}:t.length>e.length?{label:"▲ Heavier",tone:"warn"}:{label:"▼ Heavier",tone:"warn"}}function ya(t,e){return`
    <div class="delay-distribution">
      ${[["On time",t.onTime,"healthy"],["2-5 min late",t.minorLate,"warn"],["5+ min late",t.severeLate,"alert"]].map(([i,n,o])=>`
        <div class="delay-chip delay-chip-${o}">
          <p class="delay-chip-label">${i}</p>
          <p class="delay-chip-value">${n}</p>
          <p class="delay-chip-copy">${Jt(n,e)}</p>
        </div>
      `).join("")}
    </div>
  `}function kt(t,e,a,i){if(!e.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${t}</p>
          <p class="flow-lane-copy">No live ${v().toLowerCase()}</p>
        </div>
      </div>
    `;const n=[...e].sort((r,l)=>r.minutePosition-l.minutePosition),o=n.map(r=>{const l=a.totalMinutes>0?r.minutePosition/a.totalMinutes:0;return Math.max(0,Math.min(100,l*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${t}</p>
        <p class="flow-lane-copy">${n.length} live ${n.length===1?S().toLowerCase():v().toLowerCase()}</p>
      </div>
      <div class="flow-track" style="--line-color:${i};">
        ${o.map((r,l)=>`
          <span
            class="flow-vehicle"
            style="left:${r}%; --line-color:${i};"
            title="${n[l].label} · ${Zt(n[l])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function Qt(t,e,a,i){const n=[],{stats:o}=X(z(e,[]).nbGaps,e.length),{stats:r}=X(z([],a).sbGaps,a.length),l=[...e,...a].filter(u=>Number(u.scheduleDeviation??0)>300),d=Math.abs(e.length-a.length);return o.max!=null&&o.max>=12&&n.push({tone:"alert",copy:`Direction ▲ has a ${o.max} min service hole right now.`}),r.max!=null&&r.max>=12&&n.push({tone:"alert",copy:`Direction ▼ has a ${r.max} min service hole right now.`}),d>=2&&n.push({tone:"warn",copy:e.length>a.length?`Vehicle distribution is tilted toward ▲ by ${d}.`:`Vehicle distribution is tilted toward ▼ by ${d}.`}),l.length&&n.push({tone:"warn",copy:`${l.length} ${l.length===1?S().toLowerCase():v().toLowerCase()} are running 5+ min late.`}),i.length&&n.push({tone:"info",copy:`${i.length} active alert${i.length===1?"":"s"} affecting ${t.name}.`}),n.length||n.push({tone:"healthy",copy:"Spacing and punctuality look stable right now."}),n.slice(0,4)}function ba(t){const e=t.flatMap(r=>r.exceptions.map(l=>({tone:l.tone,copy:`${r.line.name}: ${l.copy}`,lineColor:r.line.color})));if(!e.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="Current insights summary">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">No active issues right now.</span>
        </div>
      </section>
    `;const a=Sa(),i=Math.ceil(e.length/a),n=s.insightsTickerIndex%i;return`
    <section class="insights-ticker" aria-label="Current insights summary">
      <div class="insights-ticker-viewport">
        ${e.slice(n*a,n*a+a).map(r=>`
              <span class="insights-ticker-item insights-ticker-item-${r.tone} insights-ticker-item-animated">
                <span class="insights-ticker-dot" style="--line-color:${r.lineColor};"></span>
                <span class="insights-ticker-copy">${r.copy}</span>
              </span>
            `).join("")}
      </div>
    </section>
  `}function Sa(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(e,t,a);return i>=1680?3:i>=980?2:1}function wa(t,e,a,i,n){const o=a.length+i.length;if(!o)return"";const{nbGaps:r,sbGaps:l}=z(a,i),d=[...a,...i],u=ha(d),m=[...r,...l].length?Math.max(...r,...l):null,c=va(a,i),p=Qt(t,a,i,n),f=new Set(n.flatMap(g=>g.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">In Service</p>
          <p class="metric-chip-value">${o}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">On-Time Rate</p>
          <p class="metric-chip-value">${Jt(u.onTime,o)}</p>
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
        ${Ct("Direction ▲",r,a.length)}
        ${Ct("Direction ▼",l,i.length)}
      </div>
      ${ya(u,o)}
      <div class="flow-grid">
        ${kt("Direction ▲ Flow",a,e,t.color)}
        ${kt("Direction ▼ Flow",i,e,t.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">Now</p>
          <p class="headway-chart-copy">${n.length?`${n.length} active alert${n.length===1?"":"s"}${f?` · ${f} impacted stops`:""}`:"No active alerts on this line"}</p>
        </div>
        ${p.map(g=>`
          <div class="insight-exception insight-exception-${g.tone}">
            <p>${g.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function te(t,e=!1){const a=Date.now(),i=o=>{const r=o.arrivalTime,l=Math.floor((r-a)/1e3),d=_(l),u=oe(o.arrivalTime,o.scheduleDeviation??0),m=lt(u);let c="";if(o.distanceFromStop>0){const p=o.distanceFromStop>=1e3?`${(o.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(o.distanceFromStop)}m`,f=o.numberOfStopsAway===1?"1 stop away":`${o.numberOfStopsAway} stops away`;c=` • ${p} • ${f}`}return`
      <div class="arrival-item" data-arrival-time="${o.arrivalTime}" data-schedule-deviation="${o.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${o.lineColor};">${o.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${o.lineName} ${S()} ${o.vehicleId}</span>
            <span class="arrival-destination">To ${o.destination}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${m}">${u}</span>
          <span class="arrival-time"><span class="arrival-countdown">${d}</span><span class="arrival-precision">${c}</span></span>
        </span>
      </div>
    `};if(e){It.innerHTML="",Tt.innerHTML="",M.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',E.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',Z();return}const n=(o,r,l)=>{if(!o.length){r.innerHTML="",l.innerHTML=`<div class="arrival-item muted">No upcoming ${v().toLowerCase()}</div>`;return}const d=s.dialogDisplayMode?o.slice(0,2):[],u=s.dialogDisplayMode?o.slice(2):o;r.innerHTML=d.map(i).join(""),l.innerHTML=u.length?u.map(i).join(""):s.dialogDisplayMode?`<div class="arrival-item muted">No additional ${v().toLowerCase()}</div>`:""};n(t.nb,It,M),n(t.sb,Tt,E),Z()}function at(t,e){const a=new Set(e.stationAliases?.[t.id]??[]);a.add(t.id);const i=new Set;for(const o of a){const r=o.startsWith(`${e.agencyId}_`)?o:`${e.agencyId}_${o}`;i.add(r)}const n=t.id.replace(/-T\d+$/,"");return i.add(n.startsWith(`${e.agencyId}_`)?n:`${e.agencyId}_${n}`),[...i]}function ee(t){const e=s.lines.map(a=>{const i=a.stops.find(n=>n.id===t.id);return i?{line:a,station:i}:null}).filter(Boolean);return e.length>0?e:s.lines.map(a=>{const i=a.stops.find(n=>n.name===t.name);return i?{line:a,station:i}:null}).filter(Boolean)}function $a(t){if(!t)return null;const e=t.trim().toLowerCase();for(const a of s.lines)for(const i of a.stops){const n=new Set([i.id,`${a.agencyId}_${i.id}`,i.name,q(i.name),P(i.name),P(q(i.name))]);for(const o of a.stationAliases?.[i.id]??[])n.add(o),n.add(`${a.agencyId}_${o}`),n.add(P(o));if([...n].some(o=>String(o).toLowerCase()===e))return i}return null}function La(t){const e=new URL(window.location.href);e.searchParams.set("station",P(t.name)),window.history.pushState({},"",e)}function ae(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function Rt(t){const e=new URL(window.location.href);t===T?e.searchParams.delete("system"):e.searchParams.set("system",t),window.history.pushState({},"",e)}function ie(){const e=new URL(window.location.href).searchParams.get("system");return e&&s.systemsById.has(e)?e:T}function it(t){s.dialogDisplayMode=t,h.classList.toggle("is-display-mode",t),K.textContent=t?"Exit":"Board",K.setAttribute("aria-label",t?"Exit display mode":"Toggle display mode"),s.dialogDisplayDirection="both",s.dialogDisplayAutoPhase="nb",st(),h.open&&s.currentDialogStation&&ct(s.currentDialogStation).catch(console.error),Z()}function Ia(){it(!s.dialogDisplayMode)}function nt(){s.dialogDisplayDirectionTimer&&(window.clearInterval(s.dialogDisplayDirectionTimer),s.dialogDisplayDirectionTimer=0)}function st(){nt();const t=s.dialogDisplayDirection,e=t==="auto"?s.dialogDisplayAutoPhase:t;Ut.forEach(a=>{a.classList.toggle("is-active",a.dataset.dialogDirection===t)}),h.classList.toggle("show-nb-only",s.dialogDisplayMode&&e==="nb"),h.classList.toggle("show-sb-only",s.dialogDisplayMode&&e==="sb"),s.dialogDisplayMode&&t==="auto"&&(s.dialogDisplayDirectionTimer=window.setInterval(()=>{s.dialogDisplayAutoPhase=s.dialogDisplayAutoPhase==="nb"?"sb":"nb",st()},Pe))}function ot(){s.dialogRefreshTimer&&(window.clearTimeout(s.dialogRefreshTimer),s.dialogRefreshTimer=0)}function rt(){s.dialogDisplayTimer&&(window.clearInterval(s.dialogDisplayTimer),s.dialogDisplayTimer=0)}function Y(t,e){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(t.style.transform="translateY(0)",!s.dialogDisplayMode||a.length<=3)return;const i=Number.parseFloat(window.getComputedStyle(t).rowGap||"0")||0,n=a[0].getBoundingClientRect().height+i,o=Math.max(0,a.length-3),r=Math.min(s.dialogDisplayIndexes[e],o);t.style.transform=`translateY(-${r*n}px)`}function Z(){rt(),s.dialogDisplayIndexes={nb:0,sb:0},Y(M,"nb"),Y(E,"sb"),s.dialogDisplayMode&&(s.dialogDisplayTimer=window.setInterval(()=>{for(const[t,e]of[["nb",M],["sb",E]]){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const i=Math.max(0,a.length-3);s.dialogDisplayIndexes[t]=s.dialogDisplayIndexes[t]>=i?0:s.dialogDisplayIndexes[t]+1,Y(e,t)}},Ne))}function Ta(){if(!h.open)return;h.querySelectorAll(".arrival-item[data-arrival-time]").forEach(e=>{const a=Number(e.dataset.arrivalTime),i=Number(e.dataset.scheduleDeviation||0),n=e.querySelector(".arrival-countdown"),o=e.querySelector(".arrival-status");if(!n||!o)return;n.textContent=_(Math.floor((a-Date.now())/1e3));const r=oe(a,i),l=lt(r);o.textContent=r,o.className=`arrival-status arrival-status-${l}`})}function Da(){if(ot(),!s.currentDialogStation)return;const t=()=>{s.dialogRefreshTimer=window.setTimeout(async()=>{!h.open||!s.currentDialogStation||(await ct(s.currentDialogStation).catch(console.error),t())},Re)};t()}function ne(){s.currentDialogStationId="",s.currentDialogStation=null,h.open?h.close():(ot(),rt(),nt(),it(!1),ae())}async function Nt(){const t=ie();t!==s.activeSystemId&&await me(t,{updateUrl:!1,preserveDialog:!1});const e=new URL(window.location.href).searchParams.get("station"),a=$a(e);s.isSyncingFromUrl=!0;try{if(!a){s.currentDialogStationId="",h.open&&h.close();return}if(s.activeTab="map",b(),s.currentDialogStationId===a.id&&h.open)return;await ce(a,!1)}finally{s.isSyncingFromUrl=!1}}function Aa(t,e){const a=e.directionLookup?.[t.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const i=t.tripHeadsign??"",n=i.toLowerCase();return e.nbTerminusPrefix&&n.startsWith(e.nbTerminusPrefix)?"nb":e.sbTerminusPrefix&&n.startsWith(e.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(i)?"nb":/Federal Way|South Bellevue/i.test(i)?"sb":""}function se(t){return t.routeKey??`${t.agencyId}_${t.id}`}function xa(t){const e=t.tripHeadsign?.trim();return e?q(e.replace(/^to\s+/i,"")):"Terminal"}function oe(t,e){return Math.floor((t-Date.now())/1e3)<=90?"ARR":e>=120?"DELAY":"ON TIME"}function lt(t){return t==="DELAY"?"delay":t==="ARR"?"arr":"ok"}async function Ma(t){const e=`${Ot}/arrivals-and-departures-for-stop/${t}.json?key=${J}&minutesAfter=120`,a=await jt(e,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${t}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function re(t){const e=[...new Set(t)],a=[],i=[];for(let n=0;n<e.length;n+=F){const o=e.slice(n,n+F),r=await Promise.allSettled(o.map(l=>Ma(l)));a.push(...r),wt>0&&n+F<e.length&&await et(wt)}for(const n of a)n.status==="fulfilled"&&i.push(...n.value);return i}function Ea(t,e){const a=Date.now(),i=new Set,n={nb:[],sb:[]};for(const o of t){if(o.routeId!==se(e))continue;const r=o.predictedArrivalTime||o.scheduledArrivalTime;if(!r||r<=a)continue;const l=Aa(o,e);if(!l)continue;const d=`${o.tripId}:${o.stopId}:${r}`;i.has(d)||(i.add(d),n[l].push({vehicleId:(o.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:r,destination:xa(o),scheduleDeviation:o.scheduleDeviation??0,tripId:o.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0],distanceFromStop:o.distanceFromStop??0,numberOfStopsAway:o.numberOfStopsAway??0}))}return n.nb.sort((o,r)=>o.arrivalTime-r.arrivalTime),n.sb.sort((o,r)=>o.arrivalTime-r.arrivalTime),n.nb=n.nb.slice(0,4),n.sb=n.sb.slice(0,4),n}async function Ca(t,e,a=null){const i=`${s.activeSystemId}:${e.id}:${t.id}`,n=s.arrivalsCache.get(i);if(n&&Date.now()-n.fetchedAt<xe)return n.value;const o=at(t,e),r=a??await re(o),l=Ea(r,e);return s.arrivalsCache.set(i,{fetchedAt:Date.now(),value:l}),l}function ka(t){const e={nb:[],sb:[]};for(const a of t)e.nb.push(...a.nb),e.sb.push(...a.sb);return e.nb.sort((a,i)=>a.arrivalTime-i.arrivalTime),e.sb.sort((a,i)=>a.arrivalTime-i.arrivalTime),e}function le(t){const e=ia(t);if(!e.length){A.innerHTML="",A.hidden=!0;return}A.hidden=!1,A.innerHTML=`
    <div class="station-alerts">
      ${e.map((a,i)=>`
        <button class="station-alert-pill" data-alert-idx="${i}" type="button">
          <span class="station-alert-pill-meta">${Vt(a.severity)} · ${Ft(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||"Service alert"}</span>
        </button>
      `).join("")}
    </div>
  `,A.querySelectorAll(".station-alert-pill").forEach(a=>{const i=e[Number(a.dataset.alertIdx)];i&&a.addEventListener("click",()=>{const n=s.lines.find(o=>i.lineIds.includes(o.id));n&&de(n)})})}async function ce(t,e=!0){Ue.textContent=t.name,s.currentDialogStationId=t.id,s.currentDialogStation=t,le(t),te({nb:[],sb:[]},!0),e&&La(t),h.showModal(),Da(),await ct(t)}async function ct(t){const e=s.activeDialogRequest+1;s.activeDialogRequest=e;try{const a=ee(t),i=a.flatMap(({station:r,line:l})=>at(r,l)),n=await re(i),o=await Promise.all(a.map(({station:r,line:l})=>Ca(r,l,n)));if(s.activeDialogRequest!==e||!h.open)return;le(t),te(ka(o))}catch(a){if(s.activeDialogRequest!==e||!h.open)return;M.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,E.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function Ra(t){const e=s.layouts.get(t.id),a=s.vehiclesByLine.get(t.id)??[],i=k(t.id),n=e.stations.map((l,d)=>{const u=e.stations[d-1],m=d>0?u.segmentMinutes:"",p=Wt(l,t).length>0,f=l.isTerminal?15:10;return`
        <g transform="translate(0, ${l.y})" class="station-group${p?" has-alert":""}" data-stop-id="${l.id}" style="cursor: pointer;">
          ${d>0?`<text x="0" y="-14" class="segment-time">${m}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${l.isTerminal?11:5}" class="${l.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${l.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          ${p?`<circle cx="${e.trackX+f}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${l.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),o=a.map((l,d)=>`
        <g transform="translate(${e.trackX}, ${l.y+(d%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${d*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${l.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),r=S();return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <div class="line-title-row">
              <h2>${t.name}</h2>
              ${Yt(i,t.id)}
            </div>
            <p>${a.length} live ${a.length===1?r.toLowerCase():v().toLowerCase()}</p>
            <p>${tt(t)}</p>
          </div>
        </div>
      </header>
      ${Xt(t.color,a.map(l=>({...l,lineToken:t.name[0]})))}
      <svg viewBox="0 0 460 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${n}
        ${o}
      </svg>
    </article>
  `}function Na(){const t=U().sort((r,l)=>r.minutePosition-l.minutePosition),e=S(),a=v(),i=a.toLowerCase();return t.length?(s.compactLayout?s.lines.filter(r=>r.id===s.activeLineId):s.lines).map(r=>{const l=t.filter(p=>p.lineId===r.id),d=k(r.id),u=l.filter(p=>p.directionSymbol==="▲"),m=l.filter(p=>p.directionSymbol==="▼"),c=(p,f)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${p}</p>
          ${f.length?f.map(g=>`
                      <article class="train-list-item" data-train-id="${g.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${g.lineColor};">${g.lineToken}</span>
                          <div>
                            <p class="train-list-title">${g.lineName} ${e} ${g.label}</p>
                            <p class="train-list-subtitle">${Zt(g)}</p>
                            <p class="train-list-status ${C(g,y(g.nextOffset??0))}" data-vehicle-status="${g.id}">${zt(g)}</p>
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
                  ${Yt(d,r.id)}
                </div>
                <p>${l.length} ${l.length===1?e.toLowerCase():v().toLowerCase()} in service · ${tt(r)}</p>
              </div>
            </div>
            </header>
          ${Xt(r.color,l)}
          <div class="line-readout line-readout-grid train-columns">
            ${c("NB",u)}
            ${c("SB",m)}
          </div>
        </article>
      `}).join(""):`
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>Active ${a}</h2>
          <p>No live ${i}</p>
        </article>
      </section>
    `}function Pa(){const t=s.compactLayout?s.lines.filter(i=>i.id===s.activeLineId):s.lines,e=S(),a=t.map(i=>{const n=s.layouts.get(i.id),o=s.vehiclesByLine.get(i.id)??[],r=o.filter(u=>u.directionSymbol==="▲"),l=o.filter(u=>u.directionSymbol==="▼"),d=k(i.id);return{line:i,layout:n,vehicles:o,nb:r,sb:l,lineAlerts:d,exceptions:Qt(i,r,l,d)}});return`
    ${ba(a)}
    ${a.map(({line:i,layout:n,vehicles:o,nb:r,sb:l,lineAlerts:d})=>{const u=wa(i,n,r,l,d);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${i.color};">${i.name[0]}</span>
              <div>
                <h2>${i.name}</h2>
                <p>${o.length} live ${o.length===1?S().toLowerCase():v().toLowerCase()} · ${tt(i)}</p>
              </div>
            </div>
          </header>
          ${u||`<p class="train-readout muted">Waiting for live ${e.toLowerCase()} data…</p>`}
        </article>
      `}).join("")}
  `}function Oa(){document.querySelectorAll("[data-system-switch]").forEach(e=>{e.addEventListener("click",async()=>{await me(e.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function j(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{s.activeLineId=e.dataset.lineSwitch,b()})})}function dt(){s.currentTrainId="",L.open&&L.close()}function ut(){I.open&&I.close()}function de(t){const e=k(t.id);je.textContent=`${t.name} Alerts`,Ge.textContent=`${e.length} active alert${e.length===1?"":"s"}`,Ke.textContent=t.name,At.textContent="",At.innerHTML=e.length?e.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${Vt(a.severity)} • ${Ft(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||"Service alert"}</p>
              <p class="alert-dialog-item-copy">${a.description||"No additional alert details available."}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">Read official alert</a></p>`:""}
            </article>
          `).join(""):'<p class="alert-dialog-item-copy">No active alerts.</p>',xt.hidden=!0,xt.removeAttribute("href"),I.open||I.showModal()}function Pt(){document.querySelectorAll("[data-alert-line-id]").forEach(e=>{e.addEventListener("click",()=>{const a=s.lines.find(i=>i.id===e.dataset.alertLineId);a&&de(a)})})}function qa(t){const e=t.fromLabel!==t.toLabel&&t.progress>0&&t.progress<1,a=e?t.fromLabel:t.previousLabel,i=e?`${t.fromLabel} -> ${t.toLabel}`:t.currentStopLabel,n=e?"Between":"Now",o=e?t.toLabel:t.upcomingLabel,r=e?t.progress:.5;Fe.textContent=`${t.lineName} ${S()} ${t.label}`,Ve.textContent=t.directionSymbol==="▲"?"Direction A movement":"Direction B movement",Dt.className=`train-detail-status train-list-status-${lt(t.serviceStatus)}`,Dt.textContent=t.serviceStatus,We.innerHTML=`
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
        <p class="train-detail-label">${n}</p>
        <p class="train-detail-name">${i}</p>
      </div>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">Next</p>
        <p class="train-detail-name">${o}</p>
      </div>
    </div>
  `,L.open||L.showModal()}function Ba(){document.querySelectorAll("[data-train-id]").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.trainId,i=U().find(n=>n.id===a);i&&(s.currentTrainId=a,qa(i))})})}function _a(){s.lines.forEach(t=>{const e=s.layouts.get(t.id),a=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.stopId,r=e.stations.find(l=>l.id===o);r&&ce(r)})})})}function b(){const t=Q();if(_t.textContent=s.theme==="dark"?"Light":"Dark",qe.textContent=t.kicker,Be.textContent=t.title,$t.hidden=s.systemsById.size<2,$t.innerHTML=fa(),ue(),Bt.forEach(e=>e.classList.toggle("is-active",e.dataset.tab===s.activeTab)),document.querySelector("#tab-trains").textContent=v(),Oa(),s.activeTab==="map"){w.className="board";const e=s.compactLayout?s.lines.filter(a=>a.id===s.activeLineId):s.lines;w.innerHTML=`${W()}${e.map(Ra).join("")}`,j(),Pt(),_a(),queueMicrotask(B);return}if(s.activeTab==="trains"){w.className="board",w.innerHTML=`${W()}${Na()}`,j(),Pt(),Ba(),queueMicrotask(B);return}s.activeTab==="insights"&&(w.className="board",w.innerHTML=`${W()}${Pa()}`,j())}function Ua(){window.clearInterval(s.insightsTickerTimer),s.insightsTickerTimer=0}function Ha(){Ua(),s.insightsTickerTimer=window.setInterval(()=>{s.insightsTickerIndex+=1,s.activeTab==="insights"&&b()},5e3)}function ue(){N.textContent=s.error?"HOLD":"SYNC",N.classList.toggle("status-pill-error",!!s.error),_e.textContent=`Now ${ea()}`,G.textContent=s.error?"Using last successful snapshot":ta(s.fetchedAt),Lt.textContent=N.textContent,Lt.classList.toggle("status-pill-error",!!s.error),He.textContent=G.textContent}function Fa(){window.clearTimeout(s.liveRefreshTimer),s.liveRefreshTimer=0}function Va(){Fa();const t=()=>{s.liveRefreshTimer=window.setTimeout(async()=>{await pt(),t()},ke)};t()}function pe(t){const e=s.systemsById.has(t)?t:T,a=s.systemsById.get(e);s.activeSystemId=e,s.lines=a?.lines??[],s.layouts=s.layoutsBySystem.get(e)??new Map,s.lines.some(i=>i.id===s.activeLineId)||(s.activeLineId=s.lines[0]?.id??""),s.vehiclesByLine=new Map,s.rawVehicles=[],s.arrivalsCache.clear(),s.alerts=[],s.error="",s.fetchedAt="",s.insightsTickerIndex=0}async function me(t,{updateUrl:e=!0,preserveDialog:a=!1}={}){if(!s.systemsById.has(t)||s.activeSystemId===t){e&&Rt(s.activeSystemId);return}pe(t),a||ne(),dt(),ut(),b(),e&&Rt(t),await pt()}async function Wa(){const a=(await(await fetch(Ae,{cache:"no-store"})).json()).systems??[];s.systemsById=new Map(a.map(i=>[i.id,i])),s.layoutsBySystem=new Map(a.map(i=>[i.id,new Map(i.lines.map(n=>[n.id,ra(n)]))])),pe(ie())}function Ya(t){const e=[...new Set((t.allAffects??[]).map(i=>i.routeId).filter(Boolean))],a=s.lines.filter(i=>e.includes(se(i))).map(i=>i.id);return a.length?{id:t.id,effect:t.reason??"SERVICE ALERT",severity:t.severity??"INFO",title:t.summary?.value??"Service alert",description:t.description?.value??"",url:t.url?.value??"",lineIds:a,stopIds:[...new Set((t.allAffects??[]).map(i=>i.stopId).filter(Boolean))]}:null}async function pt(){try{const t=await jt(Ze(),"Realtime");s.error="",s.fetchedAt=new Date().toISOString(),s.rawVehicles=t.data.list??[],s.alerts=(t.data.references?.situations??[]).map(Ya).filter(Boolean);const e=new Map((t.data.references?.trips??[]).map(a=>[a.id,a]));for(const a of s.lines){const i=s.layouts.get(a.id),n=s.rawVehicles.map(o=>ma(o,a,i,e)).filter(Boolean);s.vehiclesByLine.set(a.id,n)}}catch(t){s.error="Realtime offline",console.error(t)}b()}async function ja(){Ht(Qe()),Mt(),await Wa(),b(),await pt(),await Nt(),window.addEventListener("popstate",()=>{Nt().catch(console.error)});const t=()=>{const a=s.compactLayout;if(Mt(),a!==s.compactLayout){b();return}B()};window.addEventListener("resize",t),window.visualViewport?.addEventListener("resize",t),new ResizeObserver(()=>{B()}).observe(w),Va(),Ha(),window.setInterval(()=>{ue(),Ta(),pa()},1e3)}ja().catch(t=>{N.textContent="FAIL",G.textContent=t.message});
