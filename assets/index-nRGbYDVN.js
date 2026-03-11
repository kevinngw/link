(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=a(i);fetch(i.href,o)}})();const Me="modulepreload",Ae=function(t){return"/link/"+t},wt={},xe=function(e,a,n){let i=Promise.resolve();if(a&&a.length>0){let u=function(m){return Promise.all(m.map(d=>Promise.resolve(d).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var l=u;document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=r?.nonce||r?.getAttribute("nonce");i=u(a.map(m=>{if(m=Ae(m),m in wt)return;wt[m]=!0;const d=m.endsWith(".css"),p=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${p}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":Me,d||(f.as="script"),f.crossOrigin="",f.href=m,c&&f.setAttribute("nonce",c),document.head.appendChild(f),d)return new Promise((h,M)=>{f.addEventListener("load",h),f.addEventListener("error",()=>M(new Error(`Unable to preload CSS for ${m}`)))})}))}function o(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return i.then(r=>{for(const c of r||[])c.status==="rejected"&&o(c.reason);return e().catch(o)})};function Ee(t={}){const{immediate:e=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:i,onRegisteredSW:o,onRegisterError:l}=t;let r,c;const u=async(d=!0)=>{await c};async function m(){if("serviceWorker"in navigator){if(r=await xe(async()=>{const{Workbox:d}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:d}},[]).then(({Workbox:d})=>new d("/link/sw.js",{scope:"/link/",type:"classic"})).catch(d=>{l?.(d)}),!r)return;r.addEventListener("activated",d=>{(d.isUpdate||d.isExternal)&&window.location.reload()}),r.addEventListener("installed",d=>{d.isUpdate||n?.()}),r.register({immediate:e}).then(d=>{o?o("/link/sw.js",d):i?.(d)}).catch(d=>{l?.(d)})}}return c=m(),u}const Ce="./pulse-data.json",qt="https://api.pugetsound.onebusaway.org/api/where",et="TEST".trim()||"TEST",$=et==="TEST",ke=$?6e4:2e4,$t=3,Re=800,Ne=$?2e4:5e3,Lt=$?12e4:3e4,Tt=$?1200:0,V=$?1:3,Pe=1100,Oe=$?45e3:15e3,_e=$?9e4:3e4,Be=4e3,qe=15e3,Fe=4.8,He=.35,Ue=45e3,Ft=4,Ht="link-pulse-theme",D="link",B={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},s={fetchedAt:"",error:"",activeSystemId:D,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0},We=Ee({immediate:!0,onNeedRefresh(){We(!0)}});document.querySelector("#app").innerHTML=`
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
        <section id="transfer-section" class="transfer-section" hidden></section>
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
`;const w=document.querySelector("#board"),Ve=document.querySelector("#screen-kicker"),je=document.querySelector("#screen-title"),It=document.querySelector("#system-bar"),Ut=[...document.querySelectorAll(".tab-button")],Wt=document.querySelector("#theme-toggle"),O=document.querySelector("#status-pill"),Ye=document.querySelector("#current-time"),z=document.querySelector("#updated-at"),g=document.querySelector("#station-dialog"),Ke=document.querySelector("#dialog-title"),Dt=document.querySelector("#dialog-status-pill"),Ge=document.querySelector("#dialog-updated-at"),X=document.querySelector("#dialog-display"),Vt=[...document.querySelectorAll("[data-dialog-direction]")],A=document.querySelector("#station-alerts-container"),L=document.querySelector("#transfer-section"),Mt=document.querySelector("#arrivals-nb-pinned"),E=document.querySelector("#arrivals-nb"),At=document.querySelector("#arrivals-sb-pinned"),C=document.querySelector("#arrivals-sb"),T=document.querySelector("#train-dialog"),ze=document.querySelector("#train-dialog-title"),Xe=document.querySelector("#train-dialog-subtitle"),Ze=document.querySelector("#train-dialog-line"),xt=document.querySelector("#train-dialog-status"),Je=document.querySelector("#train-dialog-close"),I=document.querySelector("#alert-dialog"),Qe=document.querySelector("#alert-dialog-title"),ta=document.querySelector("#alert-dialog-subtitle"),ea=document.querySelector("#alert-dialog-lines"),Et=document.querySelector("#alert-dialog-body"),Ct=document.querySelector("#alert-dialog-link"),aa=document.querySelector("#alert-dialog-close");X.addEventListener("click",()=>Ca());Je.addEventListener("click",()=>mt());aa.addEventListener("click",()=>ft());Vt.forEach(t=>{t.addEventListener("click",()=>{s.dialogDisplayDirection=t.dataset.dialogDirection,s.dialogDisplayDirection==="auto"&&(s.dialogDisplayAutoPhase="nb"),lt()})});g.addEventListener("click",t=>{t.target===g&&re()});T.addEventListener("click",t=>{t.target===T&&mt()});I.addEventListener("click",t=>{t.target===I&&ft()});g.addEventListener("close",()=>{ct(),dt(),rt(),ot(!1),s.isSyncingFromUrl||se()});Ut.forEach(t=>{t.addEventListener("click",()=>{s.activeTab=t.dataset.tab,b()})});Wt.addEventListener("click",()=>{jt(s.theme==="dark"?"light":"dark"),b()});function at(){return B[s.activeSystemId]??B[D]}function na(){return s.systemsById.get(s.activeSystemId)?.agencyId??B[D].agencyId}function ia(){return`${qt}/vehicles-for-agency/${na()}.json?key=${et}`}function S(){return at().vehicleLabel??"Vehicle"}function sa(t){return/bus$/i.test(t)?`${t}es`:`${t}s`}function v(){return at().vehicleLabelPlural??sa(S())}function q(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function oa(){const t=window.localStorage.getItem(Ht);return t==="light"||t==="dark"?t:"dark"}function jt(t){s.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(Ht,t)}function kt(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);s.compactLayout=n<=Pe}function F(){const a=window.getComputedStyle(w).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==s.compactLayout&&(s.compactLayout=a,b())}function _(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function j(t,e,a){return Math.max(e,Math.min(t,a))}function ra(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function la(){return new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit"}).format(new Date)}function H(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),a=t%60;return e>0?`${e}m ${a}s`:`${a}s`}function ca(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function Rt(t){if(!t)return"";const[e="0",a="0"]=String(t).split(":"),n=Number(e),i=Number(a),o=(n%24+24)%24,l=o>=12?"PM":"AM";return`${o%12||12}:${String(i).padStart(2,"0")} ${l}`}function nt(t){const e=ca(),a=t.serviceSpansByDate?.[e];return a?`Today ${Rt(a.start)} - ${Rt(a.end)}`:"Today service hours unavailable"}function Yt(t){return String(t||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function Kt(t){return String(t||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function N(t){return s.alerts.filter(e=>e.lineIds.includes(t))}function Gt(t,e){const a=N(e.id);if(!a.length)return[];const n=new Set(R(t,e));return n.add(t.id),a.filter(i=>i.stopIds.length>0&&i.stopIds.some(o=>n.has(o)))}function da(t){const e=new Set,a=[];for(const{station:n,line:i}of st(t))for(const o of Gt(n,i))e.has(o.id)||(e.add(o.id),a.push(o));return a}function zt(t,e){return t.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${e}">
      <span class="line-alert-badge-count">${t.length}</span>
      <span class="line-alert-badge-copy">alert${t.length===1?"":"s"}</span>
    </button>
  `:""}function it(t){return new Promise(e=>window.setTimeout(e,t))}function ua(){const t=Math.max(0,s.obaRateLimitStreak-1),e=Math.min(Lt,Ne*2**t),a=Math.round(e*(.15+Math.random()*.2));return Math.min(Lt,e+a)}async function pa(){const t=s.obaCooldownUntil-Date.now();t>0&&await it(t)}function ma(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function Xt(t,e){for(let a=0;a<=$t;a+=1){await pa();const n=await fetch(t,{cache:"no-store"});let i=null;try{i=await n.json()}catch{i=null}const o=n.status===429||ma(i);if(n.ok&&!o)return s.obaRateLimitStreak=0,s.obaCooldownUntil=0,i;if(a===$t||!o)throw i?.text?new Error(i.text):new Error(`${e} request failed with ${n.status}`);s.obaRateLimitStreak+=1;const l=Re*2**a,r=Math.max(l,ua());s.obaCooldownUntil=Date.now()+r,await it(r)}throw new Error(`${e} request failed`)}function fa(t){const e=[...t.stops].sort((d,p)=>p.sequence-d.sequence),a=48,n=44,i=28,o=88,l=122,r=n+i+(e.length-1)*a,c=new Map,u=e.map((d,p)=>{const f={...d,label:q(d.name),y:n+p*a,index:p,isTerminal:p===0||p===e.length-1};c.set(d.id,p),c.set(`${t.agencyId}_${d.id}`,p);for(const h of t.stationAliases?.[d.id]??[])c.set(h,p),c.set(`${t.agencyId}_${h}`,p);return f});let m=0;for(let d=0;d<u.length;d+=1)u[d].cumulativeMinutes=m,m+=d<u.length-1?u[d].segmentMinutes:0;return{totalMinutes:m,height:r,labelX:l,stationGap:a,stationIndexByStopId:c,stations:u,trackX:o}}function ha(t,e){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":"•"}function ga(t){const e=t.tripStatus??{},a=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const n=e.nextStopTimeOffset??0,i=e.scheduleDeviation??0,o=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return a==="approaching"||o&&Math.abs(n)<=90?"ARR":i>=120?"DELAY":"OK"}function va(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const a=Math.round(t/60);let n="status-late-minor";return t>600?n="status-late-severe":t>300&&(n="status-late-moderate"),{text:`+${a} min late`,colorClass:n}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function ya(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function y(t){if(!s.fetchedAt)return t;const e=Math.max(0,Math.floor((Date.now()-new Date(s.fetchedAt).getTime())/1e3));return t-e}function k(t,e){return e<=90?"status-arriving":t.delayInfo.colorClass}function Zt(t){const e=y(t.nextOffset??0),a=y(t.closestOffset??0),n=t.delayInfo.text;return e<=15?[{text:"Arriving now",toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:e<=90?[{text:`Arriving in ${H(e)}`,toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:a<0&&e>0?[{text:`Next stop in ${H(e)}`,toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:[{text:ya(t.serviceStatus),toneClass:k(t,e)},{text:n,toneClass:t.delayInfo.colorClass}]}function x(t){return t.map(e=>`
        <span class="status-chip ${e.toneClass}">
          ${e.text}
        </span>
      `).join("")}function Jt(t){const e=y(t.nextOffset??0),a=y(t.closestOffset??0),n=t.upcomingLabel||t.toLabel||t.currentStopLabel,[i,o]=Zt(t);return e<=15?`${t.label} at ${n} ${x([i,o])}`:e<=90?`${t.label} at ${n} ${x([i,o])}`:a<0&&e>0?`${t.label} ${n} ${x([i,o])}`:`${t.label} to ${n} ${x([i,o])}`}function Qt(t){return x(Zt(t))}function te(t,e){if(!e.length)return"";const a=[...e].sort((i,o)=>y(i.nextOffset??0)-y(o.nextOffset??0)).slice(0,8),n=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${t};">
      <div class="line-marquee-track">
        ${n.map(i=>`
          <span
            class="line-marquee-item ${k(i,y(i.nextOffset??0))}"
            data-vehicle-marquee="${i.id}"
          >
            <span class="line-marquee-token">${i.lineToken}</span>
            <span class="line-marquee-copy">${Jt(i)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function ba(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const n=a.dataset.vehicleStatus,i=U().find(l=>l.id===n);if(!i)return;const o=y(i.nextOffset??0);a.innerHTML=Qt(i),a.className=`train-list-status ${k(i,o)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const n=a.dataset.vehicleMarquee,i=U().find(r=>r.id===n);if(!i)return;const o=y(i.nextOffset??0);a.className=`line-marquee-item ${k(i,o)}`;const l=a.querySelector(".line-marquee-copy");l&&(l.innerHTML=Jt(i))})}function Sa(t,e,a,n){const i=t.tripStatus?.activeTripId??t.tripId??"",o=n.get(i);if(!o||o.routeId!==e.routeKey)return null;const l=t.tripStatus?.closestStop,r=t.tripStatus?.nextStop,c=a.stationIndexByStopId.get(l),u=a.stationIndexByStopId.get(r);if(c==null&&u==null)return null;let m=c??u,d=u??c;if(m>d){const De=m;m=d,d=De}const p=a.stations[m],f=a.stations[d],h=t.tripStatus?.closestStopTimeOffset??0,M=t.tripStatus?.nextStopTimeOffset??0,gt=o.directionId==="1"?"▲":o.directionId==="0"?"▼":ha(c,u);let P=0;m!==d&&h<0&&M>0&&(P=j(Math.abs(h)/(Math.abs(h)+M),0,1));const ye=p.y+(f.y-p.y)*P,be=m!==d?p.segmentMinutes:0,Se=p.cumulativeMinutes+be*P,W=c??u??m,vt=a.stations[W]??p,yt=gt==="▲",we=j(W+(yt?1:-1),0,a.stations.length-1),$e=c!=null&&u!=null&&c!==u?u:j(W+(yt?-1:1),0,a.stations.length-1),Le=a.stations[we]??vt,Te=a.stations[$e]??f,bt=t.tripStatus?.scheduleDeviation??0,St=t.tripStatus?.predicted??!1,Ie=va(bt,St);return{id:t.vehicleId,label:t.vehicleId.replace(/^\d+_/,""),directionSymbol:gt,fromLabel:p.label,minutePosition:Se,progress:P,serviceStatus:ga(t),toLabel:f.label,y:ye,currentLabel:p.label,nextLabel:f.label,previousLabel:Le.label,currentStopLabel:vt.label,upcomingLabel:Te.label,status:t.tripStatus?.status??"",closestStop:l,nextStop:r,closestOffset:h,nextOffset:M,scheduleDeviation:bt,isPredicted:St,delayInfo:Ie,rawVehicle:t}}function ee(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function U(){return s.lines.flatMap(t=>(s.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function wa(){return Object.values(B).filter(t=>s.systemsById.has(t.id)).map(t=>`
        <button
          class="tab-button ${t.id===s.activeSystemId?"is-active":""}"
          data-system-switch="${t.id}"
          type="button"
        >
          ${t.label}
        </button>
      `).join("")}function Y(){return!s.compactLayout||s.lines.length<2?"":`<section class="line-switcher">${s.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===s.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function Z(t,e){const a=[...t].sort((o,l)=>o.minutePosition-l.minutePosition),n=[...e].sort((o,l)=>o.minutePosition-l.minutePosition),i=o=>o.slice(1).map((l,r)=>Math.round(l.minutePosition-o[r].minutePosition));return{nbGaps:i(a),sbGaps:i(n)}}function $a(t){if(!t.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const e=t.reduce((i,o)=>i+o,0)/t.length,a=Math.max(...t),n=Math.min(...t);return{avg:Math.round(e),max:a,min:n,spread:a-n,ratio:a/Math.max(n,1)}}function J(t,e){const a=$a(t);if(e<2||a.avg==null)return{health:"quiet",stats:a};let n="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?n="bunched":a.max>=12||a.spread>=6?n="uneven":a.avg>=18&&(n="sparse"),{health:n,stats:a}}function Nt(t,e,a){const{health:n,stats:i}=J(e,a),o=i.avg!=null?`~${i.avg} min`:"—",l=n==="healthy"?"Consistent spacing now":n==="uneven"?`Largest gap ${i.max} min`:n==="bunched"?"Short and long gaps at once":n==="sparse"?"Service spread is thin":a<2?`Too few ${v().toLowerCase()}`:"Low frequency";return`
    <div class="headway-health-card headway-health-card-${n}">
      <p class="headway-health-label">${t}</p>
      <p class="headway-health-value">${o}</p>
      <p class="headway-health-copy">${l}</p>
    </div>
  `}function La(t){return t.reduce((e,a)=>{const n=Number(a.scheduleDeviation??0);return n<=60?e.onTime+=1:n<=300?e.minorLate+=1:e.severeLate+=1,e},{onTime:0,minorLate:0,severeLate:0})}function ae(t,e){return e?`${Math.round(t/e*100)}%`:"—"}function Ta(t,e){return Math.abs(t.length-e.length)<=1?{label:"Balanced",tone:"healthy"}:t.length>e.length?{label:"▲ Heavier",tone:"warn"}:{label:"▼ Heavier",tone:"warn"}}function Ia(t,e){return`
    <div class="delay-distribution">
      ${[["On time",t.onTime,"healthy"],["2-5 min late",t.minorLate,"warn"],["5+ min late",t.severeLate,"alert"]].map(([n,i,o])=>`
        <div class="delay-chip delay-chip-${o}">
          <p class="delay-chip-label">${n}</p>
          <p class="delay-chip-value">${i}</p>
          <p class="delay-chip-copy">${ae(i,e)}</p>
        </div>
      `).join("")}
    </div>
  `}function Pt(t,e,a,n){if(!e.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${t}</p>
          <p class="flow-lane-copy">No live ${v().toLowerCase()}</p>
        </div>
      </div>
    `;const i=[...e].sort((l,r)=>l.minutePosition-r.minutePosition),o=i.map(l=>{const r=a.totalMinutes>0?l.minutePosition/a.totalMinutes:0;return Math.max(0,Math.min(100,r*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${t}</p>
        <p class="flow-lane-copy">${i.length} live ${i.length===1?S().toLowerCase():v().toLowerCase()}</p>
      </div>
      <div class="flow-track" style="--line-color:${n};">
        ${o.map((l,r)=>`
          <span
            class="flow-vehicle"
            style="left:${l}%; --line-color:${n};"
            title="${i[r].label} · ${ee(i[r])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function ne(t,e,a,n){const i=[],{stats:o}=J(Z(e,[]).nbGaps,e.length),{stats:l}=J(Z([],a).sbGaps,a.length),r=[...e,...a].filter(u=>Number(u.scheduleDeviation??0)>300),c=Math.abs(e.length-a.length);return o.max!=null&&o.max>=12&&i.push({tone:"alert",copy:`Direction ▲ has a ${o.max} min service hole right now.`}),l.max!=null&&l.max>=12&&i.push({tone:"alert",copy:`Direction ▼ has a ${l.max} min service hole right now.`}),c>=2&&i.push({tone:"warn",copy:e.length>a.length?`Vehicle distribution is tilted toward ▲ by ${c}.`:`Vehicle distribution is tilted toward ▼ by ${c}.`}),r.length&&i.push({tone:"warn",copy:`${r.length} ${r.length===1?S().toLowerCase():v().toLowerCase()} are running 5+ min late.`}),n.length&&i.push({tone:"info",copy:`${n.length} active alert${n.length===1?"":"s"} affecting ${t.name}.`}),i.length||i.push({tone:"healthy",copy:"Spacing and punctuality look stable right now."}),i.slice(0,4)}function Da(t){const e=t.flatMap(l=>l.exceptions.map(r=>({tone:r.tone,copy:`${l.line.name}: ${r.copy}`,lineColor:l.line.color})));if(!e.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="Current insights summary">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">No active issues right now.</span>
        </div>
      </section>
    `;const a=Ma(),n=Math.ceil(e.length/a),i=s.insightsTickerIndex%n;return`
    <section class="insights-ticker" aria-label="Current insights summary">
      <div class="insights-ticker-viewport">
        ${e.slice(i*a,i*a+a).map(l=>`
              <span class="insights-ticker-item insights-ticker-item-${l.tone} insights-ticker-item-animated">
                <span class="insights-ticker-dot" style="--line-color:${l.lineColor};"></span>
                <span class="insights-ticker-copy">${l.copy}</span>
              </span>
            `).join("")}
      </div>
    </section>
  `}function Ma(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);return n>=1680?3:n>=980?2:1}function Aa(t,e,a,n,i){const o=a.length+n.length;if(!o)return"";const{nbGaps:l,sbGaps:r}=Z(a,n),c=[...a,...n],u=La(c),m=[...l,...r].length?Math.max(...l,...r):null,d=Ta(a,n),p=ne(t,a,n,i),f=new Set(i.flatMap(h=>h.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">In Service</p>
          <p class="metric-chip-value">${o}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">On-Time Rate</p>
          <p class="metric-chip-value">${ae(u.onTime,o)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">Worst Gap</p>
          <p class="metric-chip-value">${m!=null?`${m} min`:"—"}</p>
        </div>
        <div class="metric-chip metric-chip-${d.tone}">
          <p class="metric-chip-label">Balance</p>
          <p class="metric-chip-value">${d.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${Nt("Direction ▲",l,a.length)}
        ${Nt("Direction ▼",r,n.length)}
      </div>
      ${Ia(u,o)}
      <div class="flow-grid">
        ${Pt("Direction ▲ Flow",a,e,t.color)}
        ${Pt("Direction ▼ Flow",n,e,t.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">Now</p>
          <p class="headway-chart-copy">${i.length?`${i.length} active alert${i.length===1?"":"s"}${f?` · ${f} impacted stops`:""}`:"No active alerts on this line"}</p>
        </div>
        ${p.map(h=>`
          <div class="insight-exception insight-exception-${h.tone}">
            <p>${h.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function ie(t,e=!1){const a=Date.now(),n=o=>{const l=o.arrivalTime,r=Math.floor((l-a)/1e3),c=H(r),u=ce(o.arrivalTime,o.scheduleDeviation??0),m=ut(u);let d="";if(o.distanceFromStop>0){const p=o.distanceFromStop>=1e3?`${(o.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(o.distanceFromStop)}m`,f=o.numberOfStopsAway===1?"1 stop away":`${o.numberOfStopsAway} stops away`;d=` • ${p} • ${f}`}return`
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
          <span class="arrival-time"><span class="arrival-countdown">${c}</span><span class="arrival-precision">${d}</span></span>
        </span>
      </div>
    `};if(e){Mt.innerHTML="",At.innerHTML="",E.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',C.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',Q();return}const i=(o,l,r)=>{if(!o.length){l.innerHTML="",r.innerHTML=`<div class="arrival-item muted">No upcoming ${v().toLowerCase()}</div>`;return}const c=s.dialogDisplayMode?o.slice(0,2):[],u=s.dialogDisplayMode?o.slice(2):o;l.innerHTML=c.map(n).join(""),r.innerHTML=u.length?u.map(n).join(""):s.dialogDisplayMode?`<div class="arrival-item muted">No additional ${v().toLowerCase()}</div>`:""};i(t.nb,Mt,E),i(t.sb,At,C),Q()}function R(t,e){const a=new Set(e.stationAliases?.[t.id]??[]);a.add(t.id);const n=new Set;for(const o of a){const l=o.startsWith(`${e.agencyId}_`)?o:`${e.agencyId}_${o}`;n.add(l)}const i=t.id.replace(/-T\d+$/,"");return n.add(i.startsWith(`${e.agencyId}_`)?i:`${e.agencyId}_${i}`),[...n]}function st(t){const e=s.lines.map(a=>{const n=a.stops.find(i=>i.id===t.id);return n?{line:a,station:n}:null}).filter(Boolean);return e.length>0?e:s.lines.map(a=>{const n=a.stops.find(i=>i.name===t.name);return n?{line:a,station:n}:null}).filter(Boolean)}function xa(t){if(!t)return null;const e=t.trim().toLowerCase();for(const a of s.lines)for(const n of a.stops){const i=new Set([n.id,`${a.agencyId}_${n.id}`,n.name,q(n.name),_(n.name),_(q(n.name))]);for(const o of a.stationAliases?.[n.id]??[])i.add(o),i.add(`${a.agencyId}_${o}`),i.add(_(o));if([...i].some(o=>String(o).toLowerCase()===e))return n}return null}function Ea(t){const e=new URL(window.location.href);e.searchParams.set("station",_(t.name)),window.history.pushState({},"",e)}function se(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function Ot(t){const e=new URL(window.location.href);t===D?e.searchParams.delete("system"):e.searchParams.set("system",t),window.history.pushState({},"",e)}function oe(){const e=new URL(window.location.href).searchParams.get("system");return e&&s.systemsById.has(e)?e:D}function ot(t){s.dialogDisplayMode=t,g.classList.toggle("is-display-mode",t),X.textContent=t?"Exit":"Board",X.setAttribute("aria-label",t?"Exit display mode":"Toggle display mode"),s.dialogDisplayDirection="both",s.dialogDisplayAutoPhase="nb",lt(),g.open&&s.currentDialogStation&&pt(s.currentDialogStation).catch(console.error),Q()}function Ca(){ot(!s.dialogDisplayMode)}function rt(){s.dialogDisplayDirectionTimer&&(window.clearInterval(s.dialogDisplayDirectionTimer),s.dialogDisplayDirectionTimer=0)}function lt(){rt();const t=s.dialogDisplayDirection,e=t==="auto"?s.dialogDisplayAutoPhase:t;Vt.forEach(a=>{a.classList.toggle("is-active",a.dataset.dialogDirection===t)}),g.classList.toggle("show-nb-only",s.dialogDisplayMode&&e==="nb"),g.classList.toggle("show-sb-only",s.dialogDisplayMode&&e==="sb"),s.dialogDisplayMode&&t==="auto"&&(s.dialogDisplayDirectionTimer=window.setInterval(()=>{s.dialogDisplayAutoPhase=s.dialogDisplayAutoPhase==="nb"?"sb":"nb",lt()},qe))}function ct(){s.dialogRefreshTimer&&(window.clearTimeout(s.dialogRefreshTimer),s.dialogRefreshTimer=0)}function dt(){s.dialogDisplayTimer&&(window.clearInterval(s.dialogDisplayTimer),s.dialogDisplayTimer=0)}function K(t,e){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(t.style.transform="translateY(0)",!s.dialogDisplayMode||a.length<=3)return;const n=Number.parseFloat(window.getComputedStyle(t).rowGap||"0")||0,i=a[0].getBoundingClientRect().height+n,o=Math.max(0,a.length-3),l=Math.min(s.dialogDisplayIndexes[e],o);t.style.transform=`translateY(-${l*i}px)`}function Q(){dt(),s.dialogDisplayIndexes={nb:0,sb:0},K(E,"nb"),K(C,"sb"),s.dialogDisplayMode&&(s.dialogDisplayTimer=window.setInterval(()=>{for(const[t,e]of[["nb",E],["sb",C]]){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const n=Math.max(0,a.length-3);s.dialogDisplayIndexes[t]=s.dialogDisplayIndexes[t]>=n?0:s.dialogDisplayIndexes[t]+1,K(e,t)}},Be))}function ka(){if(!g.open)return;g.querySelectorAll(".arrival-item[data-arrival-time]").forEach(e=>{const a=Number(e.dataset.arrivalTime),n=Number(e.dataset.scheduleDeviation||0),i=e.querySelector(".arrival-countdown"),o=e.querySelector(".arrival-status");if(!i||!o)return;i.textContent=H(Math.floor((a-Date.now())/1e3));const l=ce(a,n),r=ut(l);o.textContent=l,o.className=`arrival-status arrival-status-${r}`})}function Ra(){if(ct(),!s.currentDialogStation)return;const t=()=>{s.dialogRefreshTimer=window.setTimeout(async()=>{!g.open||!s.currentDialogStation||(await pt(s.currentDialogStation).catch(console.error),t())},_e)};t()}function re(){s.currentDialogStationId="",s.currentDialogStation=null,g.open?g.close():(ct(),dt(),rt(),ot(!1),se())}async function _t(){const t=oe();t!==s.activeSystemId&&await ve(t,{updateUrl:!1,preserveDialog:!1});const e=new URL(window.location.href).searchParams.get("station"),a=xa(e);s.isSyncingFromUrl=!0;try{if(!a){s.currentDialogStationId="",g.open&&g.close();return}if(s.activeTab="map",b(),s.currentDialogStationId===a.id&&g.open)return;await me(a,!1)}finally{s.isSyncingFromUrl=!1}}function Na(t,e){const a=e.directionLookup?.[t.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const n=t.tripHeadsign??"",i=n.toLowerCase();return e.nbTerminusPrefix&&i.startsWith(e.nbTerminusPrefix)?"nb":e.sbTerminusPrefix&&i.startsWith(e.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function le(t){return t.routeKey??`${t.agencyId}_${t.id}`}function Pa(t){const e=t.tripHeadsign?.trim();return e?q(e.replace(/^to\s+/i,"")):"Terminal"}function ce(t,e){return Math.floor((t-Date.now())/1e3)<=90?"ARR":e>=120?"DELAY":"ON TIME"}function ut(t){return t==="DELAY"?"delay":t==="ARR"?"arr":"ok"}async function Oa(t){const e=`${qt}/arrivals-and-departures-for-stop/${t}.json?key=${et}&minutesAfter=120`,a=await Xt(e,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${t}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function de(t){const e=[...new Set(t)],a=[],n=[];for(let i=0;i<e.length;i+=V){const o=e.slice(i,i+V),l=await Promise.allSettled(o.map(r=>Oa(r)));a.push(...l),Tt>0&&i+V<e.length&&await it(Tt)}for(const i of a)i.status==="fulfilled"&&n.push(...i.value);return n}function ue(t,e,a=null){const n=Date.now(),i=new Set,o={nb:[],sb:[]},l=a?new Set(a):null;for(const r of t){if(r.routeId!==le(e)||l&&!l.has(r.stopId))continue;const c=r.predictedArrivalTime||r.scheduledArrivalTime;if(!c||c<=n)continue;const u=Na(r,e);if(!u)continue;const m=`${r.tripId}:${r.stopId}:${c}`;i.has(m)||(i.add(m),o[u].push({vehicleId:(r.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:c,destination:Pa(r),scheduleDeviation:r.scheduleDeviation??0,tripId:r.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0],distanceFromStop:r.distanceFromStop??0,numberOfStopsAway:r.numberOfStopsAway??0}))}return o.nb.sort((r,c)=>r.arrivalTime-c.arrivalTime),o.sb.sort((r,c)=>r.arrivalTime-c.arrivalTime),o.nb=o.nb.slice(0,4),o.sb=o.sb.slice(0,4),o}async function _a(t,e,a=null){const n=`${s.activeSystemId}:${e.id}:${t.id}`,i=s.arrivalsCache.get(n);if(i&&Date.now()-i.fetchedAt<ke)return i.value;const o=R(t,e),l=a??await de(o),r=ue(l,e,o);return s.arrivalsCache.set(n,{fetchedAt:Date.now(),value:r}),r}function Ba(t){const e={nb:[],sb:[]};for(const a of t)e.nb.push(...a.nb),e.sb.push(...a.sb);return e.nb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e.sb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e}function pe(t){const e=da(t);if(!e.length){A.innerHTML="",A.hidden=!0;return}A.hidden=!1,A.innerHTML=`
    <div class="station-alerts">
      ${e.map((a,n)=>`
        <button class="station-alert-pill" data-alert-idx="${n}" type="button">
          <span class="station-alert-pill-meta">${Kt(a.severity)} · ${Yt(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||"Service alert"}</span>
        </button>
      `).join("")}
    </div>
  `,A.querySelectorAll(".station-alert-pill").forEach(a=>{const n=e[Number(a.dataset.alertIdx)];n&&a.addEventListener("click",()=>{const i=s.lines.find(o=>n.lineIds.includes(o.id));i&&fe(i)})})}async function me(t,e=!0){Ke.textContent=t.name,s.currentDialogStationId=t.id,s.currentDialogStation=t,pe(t),tt([],!0),ie({nb:[],sb:[]},!0),e&&Ea(t),g.showModal(),Ra(),await pt(t)}async function pt(t){const e=s.activeDialogRequest+1;s.activeDialogRequest=e;try{const a=st(t),n=ja(t),i=a.flatMap(({station:c,line:u})=>R(c,u)),o=n.flatMap(({stop:c,line:u})=>R(c,u)),l=await de([...i,...o]),r=await Promise.all(a.map(({station:c,line:u})=>_a(c,u,l)));if(s.activeDialogRequest!==e||!g.open)return;tt(Ya(n,l)),pe(t),ie(Ba(r))}catch(a){if(s.activeDialogRequest!==e||!g.open)return;tt([]),E.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,C.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function qa(t){const e=s.layouts.get(t.id),a=s.vehiclesByLine.get(t.id)??[],n=N(t.id),i=e.stations.map((r,c)=>{const u=e.stations[c-1],m=c>0?u.segmentMinutes:"",p=Gt(r,t).length>0,f=r.isTerminal?15:10;return`
        <g transform="translate(0, ${r.y})" class="station-group${p?" has-alert":""}" data-stop-id="${r.id}" style="cursor: pointer;">
          ${c>0?`<text x="0" y="-14" class="segment-time">${m}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${r.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          ${p?`<circle cx="${e.trackX+f}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),o=a.map((r,c)=>`
        <g transform="translate(${e.trackX}, ${r.y+(c%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${c*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),l=S();return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <div class="line-title-row">
              <h2>${t.name}</h2>
              ${zt(n,t.id)}
            </div>
            <p>${a.length} live ${a.length===1?l.toLowerCase():v().toLowerCase()}</p>
            <p>${nt(t)}</p>
          </div>
        </div>
      </header>
      ${te(t.color,a.map(r=>({...r,lineToken:t.name[0]})))}
      <svg viewBox="0 0 460 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${i}
        ${o}
      </svg>
    </article>
  `}function Fa(){const t=U().sort((l,r)=>l.minutePosition-r.minutePosition),e=S(),a=v(),n=a.toLowerCase();return t.length?(s.compactLayout?s.lines.filter(l=>l.id===s.activeLineId):s.lines).map(l=>{const r=t.filter(p=>p.lineId===l.id),c=N(l.id),u=r.filter(p=>p.directionSymbol==="▲"),m=r.filter(p=>p.directionSymbol==="▼"),d=(p,f)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${p}</p>
          ${f.length?f.map(h=>`
                      <article class="train-list-item" data-train-id="${h.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${h.lineColor};">${h.lineToken}</span>
                          <div>
                            <p class="train-list-title">${h.lineName} ${e} ${h.label}</p>
                            <p class="train-list-subtitle">${ee(h)}</p>
                            <p class="train-list-status ${k(h,y(h.nextOffset??0))}" data-vehicle-status="${h.id}">${Qt(h)}</p>
                          </div>
                        </div>
                      </article>
                    `).join(""):`<p class="train-readout muted">No ${v().toLowerCase()}</p>`}
        </div>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${l.color};">${l.name[0]}</span>
              <div>
                <div class="line-title-row">
                  <h2>${l.name}</h2>
                  ${zt(c,l.id)}
                </div>
                <p>${r.length} ${r.length===1?e.toLowerCase():v().toLowerCase()} in service · ${nt(l)}</p>
              </div>
            </div>
            </header>
          ${te(l.color,r)}
          <div class="line-readout line-readout-grid train-columns">
            ${d("NB",u)}
            ${d("SB",m)}
          </div>
        </article>
      `}).join(""):`
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>Active ${a}</h2>
          <p>No live ${n}</p>
        </article>
      </section>
    `}function Ha(t){return new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function Ua(t,e,a,n){const o=(a-t)*Math.PI/180,l=(n-e)*Math.PI/180,r=Math.sin(o/2)**2+Math.cos(t*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(l/2)**2;return 2*6371*Math.asin(Math.sqrt(r))}function Wa(t){return Math.max(1,Math.round(t/Fe*60))}function Va(t){return t>=1?`${t.toFixed(1)} km walk`:`${Math.round(t*1e3)} m walk`}function ja(t){if(!t)return[];const e=st(t),a=new Set(e.map(({line:i,station:o})=>`${i.agencyId}:${i.id}:${o.id}`)),n=new Map;for(const i of s.systemsById.values())for(const o of i.lines??[])for(const l of o.stops??[]){if(a.has(`${o.agencyId}:${o.id}:${l.id}`))continue;const r=Ua(t.lat,t.lon,l.lat,l.lon);if(r>He)continue;const c=`${i.id}:${o.id}`,u=n.get(c);(!u||r<u.distanceKm)&&n.set(c,{systemId:i.id,systemName:i.name,line:o,stop:l,distanceKm:r,walkMinutes:Wa(r)})}return[...n.values()].sort((i,o)=>i.distanceKm-o.distanceKm||i.line.name.localeCompare(o.line.name)).slice(0,Ft*2)}function tt(t,e=!1){if(e){L.hidden=!1,L.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">Transfers</h4>
          <p class="transfer-panel-copy">Checking nearby connections...</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">Loading transfer recommendations...</div>
        </div>
      </div>
    `;return}if(!t.length){L.hidden=!0,L.innerHTML="";return}L.hidden=!1,L.innerHTML=`
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <h4 class="arrivals-title">Transfers</h4>
        <p class="transfer-panel-copy">Closest boardable connections from this station</p>
      </div>
      <div class="transfer-list">
        ${t.map(a=>`
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${a.line.color};">${a.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${a.line.name} <span class="transfer-system-chip">${a.systemName}</span></p>
                    <p class="transfer-card-stop">Walk ${a.walkMinutes} min to ${a.stop.name}</p>
                    <p class="transfer-card-meta">${Va(a.distanceKm)}${a.arrival?` • To ${a.arrival.destination}`:""}</p>
                  </div>
                </div>
                <div class="transfer-card-side">
                  <span class="transfer-card-badge transfer-card-badge-${a.tone}">${a.badge}</span>
                  <span class="transfer-card-time">${a.timeText}</span>
                </div>
              </article>
            `).join("")}
      </div>
    </div>
  `}function Ya(t,e){const a=Date.now(),n=[];for(const i of t){const o=R(i.stop,i.line),l=ue(e,i.line,o),r=[...l.nb,...l.sb].sort((p,f)=>p.arrivalTime-f.arrivalTime);if(!r.length)continue;const c=a+i.walkMinutes*6e4+Ue,u=r.find(p=>p.arrivalTime>=c)??r[0],m=u.arrivalTime-a-i.walkMinutes*6e4,d=Math.max(0,Math.round(m/6e4));n.push({...i,arrival:u,boardAt:u.arrivalTime,badge:m<=0?"Leave now":d<=1?"Board in ~1 min":`Board in ~${d} min`,tone:d<=2?"hot":d<=8?"good":"calm",timeText:Ha(u.arrivalTime)})}return n.sort((i,o)=>i.boardAt-o.boardAt||i.distanceKm-o.distanceKm).slice(0,Ft)}function Ka(){const t=s.compactLayout?s.lines.filter(n=>n.id===s.activeLineId):s.lines,e=S(),a=t.map(n=>{const i=s.layouts.get(n.id),o=s.vehiclesByLine.get(n.id)??[],l=o.filter(u=>u.directionSymbol==="▲"),r=o.filter(u=>u.directionSymbol==="▼"),c=N(n.id);return{line:n,layout:i,vehicles:o,nb:l,sb:r,lineAlerts:c,exceptions:ne(n,l,r,c)}});return`
    ${Da(a)}
    ${a.map(({line:n,layout:i,vehicles:o,nb:l,sb:r,lineAlerts:c})=>{const u=Aa(n,i,l,r,c);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${n.color};">${n.name[0]}</span>
              <div>
                <h2>${n.name}</h2>
                <p>${o.length} live ${o.length===1?S().toLowerCase():v().toLowerCase()} · ${nt(n)}</p>
              </div>
            </div>
          </header>
          ${u||`<p class="train-readout muted">Waiting for live ${e.toLowerCase()} data…</p>`}
        </article>
      `}).join("")}
  `}function Ga(){document.querySelectorAll("[data-system-switch]").forEach(e=>{e.addEventListener("click",async()=>{await ve(e.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function G(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{s.activeLineId=e.dataset.lineSwitch,b()})})}function mt(){s.currentTrainId="",T.open&&T.close()}function ft(){I.open&&I.close()}function fe(t){const e=N(t.id);Qe.textContent=`${t.name} Alerts`,ta.textContent=`${e.length} active alert${e.length===1?"":"s"}`,ea.textContent=t.name,Et.textContent="",Et.innerHTML=e.length?e.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${Kt(a.severity)} • ${Yt(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||"Service alert"}</p>
              <p class="alert-dialog-item-copy">${a.description||"No additional alert details available."}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">Read official alert</a></p>`:""}
            </article>
          `).join(""):'<p class="alert-dialog-item-copy">No active alerts.</p>',Ct.hidden=!0,Ct.removeAttribute("href"),I.open||I.showModal()}function Bt(){document.querySelectorAll("[data-alert-line-id]").forEach(e=>{e.addEventListener("click",()=>{const a=s.lines.find(n=>n.id===e.dataset.alertLineId);a&&fe(a)})})}function za(t){const e=t.fromLabel!==t.toLabel&&t.progress>0&&t.progress<1,a=e?t.fromLabel:t.previousLabel,n=e?`${t.fromLabel} -> ${t.toLabel}`:t.currentStopLabel,i=e?"Between":"Now",o=e?t.toLabel:t.upcomingLabel,l=e?t.progress:.5;ze.textContent=`${t.lineName} ${S()} ${t.label}`,Xe.textContent=t.directionSymbol==="▲"?"Direction A movement":"Direction B movement",xt.className=`train-detail-status train-list-status-${ut(t.serviceStatus)}`,xt.textContent=t.serviceStatus,Ze.innerHTML=`
    <div class="train-detail-spine" style="--line-color:${t.lineColor};"></div>
    <div
      class="train-detail-marker-floating"
      style="--line-color:${t.lineColor}; --segment-progress:${l}; --direction-offset:${t.directionSymbol==="▼"?"10px":"-10px"};"
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
        <p class="train-detail-label">${i}</p>
        <p class="train-detail-name">${n}</p>
      </div>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">Next</p>
        <p class="train-detail-name">${o}</p>
      </div>
    </div>
  `,T.open||T.showModal()}function Xa(){document.querySelectorAll("[data-train-id]").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.trainId,n=U().find(i=>i.id===a);n&&(s.currentTrainId=a,za(n))})})}function Za(){s.lines.forEach(t=>{const e=s.layouts.get(t.id),a=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.stopId,l=e.stations.find(r=>r.id===o);l&&me(l)})})})}function b(){const t=at();if(Wt.textContent=s.theme==="dark"?"Light":"Dark",Ve.textContent=t.kicker,je.textContent=t.title,It.hidden=s.systemsById.size<2,It.innerHTML=wa(),he(),Ut.forEach(e=>e.classList.toggle("is-active",e.dataset.tab===s.activeTab)),document.querySelector("#tab-trains").textContent=v(),Ga(),s.activeTab==="map"){w.className="board";const e=s.compactLayout?s.lines.filter(a=>a.id===s.activeLineId):s.lines;w.innerHTML=`${Y()}${e.map(qa).join("")}`,G(),Bt(),Za(),queueMicrotask(F);return}if(s.activeTab==="trains"){w.className="board",w.innerHTML=`${Y()}${Fa()}`,G(),Bt(),Xa(),queueMicrotask(F);return}s.activeTab==="insights"&&(w.className="board",w.innerHTML=`${Y()}${Ka()}`,G())}function Ja(){window.clearInterval(s.insightsTickerTimer),s.insightsTickerTimer=0}function Qa(){Ja(),s.insightsTickerTimer=window.setInterval(()=>{s.insightsTickerIndex+=1,s.activeTab==="insights"&&b()},5e3)}function he(){O.textContent=s.error?"HOLD":"SYNC",O.classList.toggle("status-pill-error",!!s.error),Ye.textContent=`Now ${la()}`,z.textContent=s.error?"Using last successful snapshot":ra(s.fetchedAt),Dt.textContent=O.textContent,Dt.classList.toggle("status-pill-error",!!s.error),Ge.textContent=z.textContent}function tn(){window.clearTimeout(s.liveRefreshTimer),s.liveRefreshTimer=0}function en(){tn();const t=()=>{s.liveRefreshTimer=window.setTimeout(async()=>{await ht(),t()},Oe)};t()}function ge(t){const e=s.systemsById.has(t)?t:D,a=s.systemsById.get(e);s.activeSystemId=e,s.lines=a?.lines??[],s.layouts=s.layoutsBySystem.get(e)??new Map,s.lines.some(n=>n.id===s.activeLineId)||(s.activeLineId=s.lines[0]?.id??""),s.vehiclesByLine=new Map,s.rawVehicles=[],s.arrivalsCache.clear(),s.alerts=[],s.error="",s.fetchedAt="",s.insightsTickerIndex=0}async function ve(t,{updateUrl:e=!0,preserveDialog:a=!1}={}){if(!s.systemsById.has(t)||s.activeSystemId===t){e&&Ot(s.activeSystemId);return}ge(t),a||re(),mt(),ft(),b(),e&&Ot(t),await ht()}async function an(){const a=(await(await fetch(Ce,{cache:"no-store"})).json()).systems??[];s.systemsById=new Map(a.map(n=>[n.id,n])),s.layoutsBySystem=new Map(a.map(n=>[n.id,new Map(n.lines.map(i=>[i.id,fa(i)]))])),ge(oe())}function nn(t){const e=[...new Set((t.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=s.lines.filter(n=>e.includes(le(n))).map(n=>n.id);return a.length?{id:t.id,effect:t.reason??"SERVICE ALERT",severity:t.severity??"INFO",title:t.summary?.value??"Service alert",description:t.description?.value??"",url:t.url?.value??"",lineIds:a,stopIds:[...new Set((t.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function ht(){try{const t=await Xt(ia(),"Realtime");s.error="",s.fetchedAt=new Date().toISOString(),s.rawVehicles=t.data.list??[],s.alerts=(t.data.references?.situations??[]).map(nn).filter(Boolean);const e=new Map((t.data.references?.trips??[]).map(a=>[a.id,a]));for(const a of s.lines){const n=s.layouts.get(a.id),i=s.rawVehicles.map(o=>Sa(o,a,n,e)).filter(Boolean);s.vehiclesByLine.set(a.id,i)}}catch(t){s.error="Realtime offline",console.error(t)}b()}async function sn(){jt(oa()),kt(),await an(),b(),await ht(),await _t(),window.addEventListener("popstate",()=>{_t().catch(console.error)});const t=()=>{const a=s.compactLayout;if(kt(),a!==s.compactLayout){b();return}F()};window.addEventListener("resize",t),window.visualViewport?.addEventListener("resize",t),new ResizeObserver(()=>{F()}).observe(w),en(),Qa(),window.setInterval(()=>{he(),ka(),ba()},1e3)}sn().catch(t=>{O.textContent="FAIL",z.textContent=t.message});
