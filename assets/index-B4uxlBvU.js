(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const Ne="modulepreload",Pe=function(t){return"/link/"+t},Mt={},qe=function(e,a,n){let i=Promise.resolve();if(a&&a.length>0){let d=function(m){return Promise.all(m.map(u=>Promise.resolve(u).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};var l=d;document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=o?.nonce||o?.getAttribute("nonce");i=d(a.map(m=>{if(m=Pe(m),m in Mt)return;Mt[m]=!0;const u=m.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${p}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":Ne,u||(f.as="script"),f.crossOrigin="",f.href=m,c&&f.setAttribute("nonce",c),document.head.appendChild(f),u)return new Promise((g,A)=>{f.addEventListener("load",g),f.addEventListener("error",()=>A(new Error(`Unable to preload CSS for ${m}`)))})}))}function s(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return i.then(o=>{for(const c of o||[])c.status==="rejected"&&s(c.reason);return e().catch(s)})};function Oe(t={}){const{immediate:e=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:i,onRegisteredSW:s,onRegisterError:l}=t;let o,c;const d=async(u=!0)=>{await c};async function m(){if("serviceWorker"in navigator){if(o=await qe(async()=>{const{Workbox:u}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:u}},[]).then(({Workbox:u})=>new u("/link/sw.js",{scope:"/link/",type:"classic"})).catch(u=>{l?.(u)}),!o)return;o.addEventListener("activated",u=>{(u.isUpdate||u.isExternal)&&window.location.reload()}),o.addEventListener("installed",u=>{u.isUpdate||n?.()}),o.register({immediate:e}).then(u=>{s?s("/link/sw.js",u):i?.(u)}).catch(u=>{l?.(u)})}}return c=m(),d}const _e="./pulse-data.json",Vt="https://api.pugetsound.onebusaway.org/api/where",ot="TEST".trim()||"TEST",L=ot==="TEST",Be=L?6e4:2e4,xt=3,Fe=800,Ue=L?2e4:5e3,At=L?12e4:3e4,Et=L?1200:0,z=L?1:3,He=1100,We=L?45e3:15e3,Ve=L?9e4:3e4,je=4e3,Ke=15e3,Ye=4.8,Ge=.35,ze=45e3,jt=4,Kt="link-pulse-theme",x="link",U={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},r={fetchedAt:"",error:"",activeSystemId:x,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0},Xe=Oe({immediate:!0,onNeedRefresh(){Xe(!0)}});document.querySelector("#app").innerHTML=`
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
          <h3 id="dialog-title" class="dialog-title">
            <span id="dialog-title-track" class="dialog-title-track">
              <span id="dialog-title-text" class="dialog-title-text">Station</span>
              <span id="dialog-title-text-clone" class="dialog-title-text dialog-title-text-clone" aria-hidden="true">Station</span>
            </span>
          </h3>
          <p id="dialog-service-summary" class="dialog-service-summary">Service summary</p>
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
`;const $=document.querySelector("#board"),Ze=document.querySelector("#screen-kicker"),Je=document.querySelector("#screen-title"),Ct=document.querySelector("#system-bar"),Yt=[...document.querySelectorAll(".tab-button")],Gt=document.querySelector("#theme-toggle"),B=document.querySelector("#status-pill"),Qe=document.querySelector("#current-time"),et=document.querySelector("#updated-at"),h=document.querySelector("#station-dialog"),ta=document.querySelector("#dialog-title"),ea=document.querySelector("#dialog-title-track"),zt=document.querySelector("#dialog-title-text"),aa=document.querySelector("#dialog-title-text-clone"),na=document.querySelector("#dialog-service-summary"),kt=document.querySelector("#dialog-status-pill"),ia=document.querySelector("#dialog-updated-at"),at=document.querySelector("#dialog-display"),Xt=[...document.querySelectorAll("[data-dialog-direction]")],E=document.querySelector("#station-alerts-container"),T=document.querySelector("#transfer-section"),Rt=document.querySelector("#arrivals-nb-pinned"),k=document.querySelector("#arrivals-nb"),Nt=document.querySelector("#arrivals-sb-pinned"),R=document.querySelector("#arrivals-sb"),D=document.querySelector("#train-dialog"),sa=document.querySelector("#train-dialog-title"),ra=document.querySelector("#train-dialog-subtitle"),oa=document.querySelector("#train-dialog-line"),Pt=document.querySelector("#train-dialog-status"),la=document.querySelector("#train-dialog-close"),M=document.querySelector("#alert-dialog"),ca=document.querySelector("#alert-dialog-title"),da=document.querySelector("#alert-dialog-subtitle"),ua=document.querySelector("#alert-dialog-lines"),qt=document.querySelector("#alert-dialog-body"),Ot=document.querySelector("#alert-dialog-link"),ma=document.querySelector("#alert-dialog-close");at.addEventListener("click",()=>Wa());la.addEventListener("click",()=>bt());ma.addEventListener("click",()=>St());Xt.forEach(t=>{t.addEventListener("click",()=>{r.dialogDisplayDirection=t.dataset.dialogDirection,r.dialogDisplayDirection==="auto"&&(r.dialogDisplayAutoPhase="nb"),ft()})});h.addEventListener("click",t=>{t.target===h&&fe()});D.addEventListener("click",t=>{t.target===D&&bt()});M.addEventListener("click",t=>{t.target===M&&St()});h.addEventListener("close",()=>{gt(),ht(),pt(),mt(!1),r.isSyncingFromUrl||me()});Yt.forEach(t=>{t.addEventListener("click",()=>{r.activeTab=t.dataset.tab,b()})});Gt.addEventListener("click",()=>{Zt(r.theme==="dark"?"light":"dark"),b()});function lt(){return U[r.activeSystemId]??U[x]}function pa(){return r.systemsById.get(r.activeSystemId)?.agencyId??U[x].agencyId}function fa(){return`${Vt}/vehicles-for-agency/${pa()}.json?key=${ot}`}function w(){return lt().vehicleLabel??"Vehicle"}function ga(t){return/bus$/i.test(t)?`${t}es`:`${t}s`}function v(){return lt().vehicleLabelPlural??ga(w())}function H(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function ha(){const t=window.localStorage.getItem(Kt);return t==="light"||t==="dark"?t:"dark"}function Zt(t){r.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(Kt,t)}function _t(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);r.compactLayout=n<=He}function W(){const a=window.getComputedStyle($).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==r.compactLayout&&(r.compactLayout=a,b())}function F(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function X(t,e,a){return Math.max(e,Math.min(t,a))}function va(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function ya(){return new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit"}).format(new Date)}function V(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),a=t%60;return e>0?`${e}m ${a}s`:`${a}s`}function ba(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function Z(t){const e=new Date;return e.setDate(e.getDate()+t),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(e)}function Sa(t){const[e="0",a="0",n="0"]=String(t).split(":");return Number(e)*3600+Number(a)*60+Number(n)}function I(t,e){if(!t||!e)return null;const[a,n,i]=t.split("-").map(Number),s=Sa(e),l=Math.floor(s/3600),o=Math.floor(s%3600/60),c=s%60;return new Date(a,n-1,i,l,o,c)}function _(t){const e=Math.max(0,Math.round(t/6e4)),a=Math.floor(e/60),n=e%60;return a&&n?`${a}h ${n}m`:a?`${a}h`:`${n}m`}function S(t){if(!t)return"";const[e="0",a="0"]=String(t).split(":"),n=Number(e),i=Number(a),s=(n%24+24)%24,l=s>=12?"PM":"AM";return`${s%12||12}:${String(i).padStart(2,"0")} ${l}`}function ct(t){const e=ba(),a=t.serviceSpansByDate?.[e];return a?`Today ${S(a.start)} - ${S(a.end)}`:"Today service hours unavailable"}function Jt(t){const e=new Date,a=Z(-1),n=Z(0),i=Z(1),s=t.serviceSpansByDate?.[a],l=t.serviceSpansByDate?.[n],o=t.serviceSpansByDate?.[i],d=[s&&{kind:"yesterday",start:I(a,s.start),end:I(a,s.end),span:s},l&&{kind:"today",start:I(n,l.start),end:I(n,l.end),span:l}].filter(Boolean).find(m=>e>=m.start&&e<=m.end);if(d)return{tone:"active",headline:`Last trip ${S(d.span.end)}`,detail:`Ends in ${_(d.end.getTime()-e.getTime())}`,compact:`Ends in ${_(d.end.getTime()-e.getTime())}`};if(l){const m=I(n,l.start),u=I(n,l.end);if(e<m)return{tone:"upcoming",headline:`First trip ${S(l.start)}`,detail:`Starts in ${_(m.getTime()-e.getTime())}`,compact:`Starts in ${_(m.getTime()-e.getTime())}`};if(e>u)return{tone:"ended",headline:`Service ended ${S(l.end)}`,detail:o?`Next start ${S(o.start)}`:"No next service loaded",compact:o?`Next ${S(o.start)}`:"Ended"}}return o?{tone:"upcoming",headline:`Next first trip ${S(o.start)}`,detail:"No service remaining today",compact:`Next ${S(o.start)}`}:{tone:"muted",headline:"Service hours unavailable",detail:"Static schedule data missing for this date",compact:"Unavailable"}}function dt(t){const e=Jt(t);return`
    <div class="service-reminder service-reminder-${e.tone}">
      <p class="service-reminder-headline">${e.headline}</p>
      <p class="service-reminder-detail">${e.detail}</p>
    </div>
  `}function wa(t){const e=K(t).map(({line:a})=>{const n=Jt(a);return`${a.name}: ${n.compact}`}).slice(0,3);na.textContent=e.join("  ·  ")||"Service summary unavailable"}function Qt(t){return String(t||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function te(t){return String(t||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function q(t){return r.alerts.filter(e=>e.lineIds.includes(t))}function ee(t,e){const a=q(e.id);if(!a.length)return[];const n=new Set(P(t,e));return n.add(t.id),a.filter(i=>i.stopIds.length>0&&i.stopIds.some(s=>n.has(s)))}function $a(t){const e=new Set,a=[];for(const{station:n,line:i}of K(t))for(const s of ee(n,i))e.has(s.id)||(e.add(s.id),a.push(s));return a}function ae(t,e){return t.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${e}">
      <span class="line-alert-badge-count">${t.length}</span>
      <span class="line-alert-badge-copy">alert${t.length===1?"":"s"}</span>
    </button>
  `:""}function ut(t){return new Promise(e=>window.setTimeout(e,t))}function La(){const t=Math.max(0,r.obaRateLimitStreak-1),e=Math.min(At,Ue*2**t),a=Math.round(e*(.15+Math.random()*.2));return Math.min(At,e+a)}async function Ta(){const t=r.obaCooldownUntil-Date.now();t>0&&await ut(t)}function Ia(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function ne(t,e){for(let a=0;a<=xt;a+=1){await Ta();const n=await fetch(t,{cache:"no-store"});let i=null;try{i=await n.json()}catch{i=null}const s=n.status===429||Ia(i);if(n.ok&&!s)return r.obaRateLimitStreak=0,r.obaCooldownUntil=0,i;if(a===xt||!s)throw i?.text?new Error(i.text):new Error(`${e} request failed with ${n.status}`);r.obaRateLimitStreak+=1;const l=Fe*2**a,o=Math.max(l,La());r.obaCooldownUntil=Date.now()+o,await ut(o)}throw new Error(`${e} request failed`)}function Da(t){const e=[...t.stops].sort((u,p)=>p.sequence-u.sequence),a=48,n=44,i=28,s=88,l=122,o=n+i+(e.length-1)*a,c=new Map,d=e.map((u,p)=>{const f={...u,label:H(u.name),y:n+p*a,index:p,isTerminal:p===0||p===e.length-1};c.set(u.id,p),c.set(`${t.agencyId}_${u.id}`,p);for(const g of t.stationAliases?.[u.id]??[])c.set(g,p),c.set(`${t.agencyId}_${g}`,p);return f});let m=0;for(let u=0;u<d.length;u+=1)d[u].cumulativeMinutes=m,m+=u<d.length-1?d[u].segmentMinutes:0;return{totalMinutes:m,height:o,labelX:l,stationGap:a,stationIndexByStopId:c,stations:d,trackX:s}}function Ma(t,e){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":"•"}function xa(t){const e=t.tripStatus??{},a=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const n=e.nextStopTimeOffset??0,i=e.scheduleDeviation??0,s=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return a==="approaching"||s&&Math.abs(n)<=90?"ARR":i>=120?"DELAY":"OK"}function Aa(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const a=Math.round(t/60);let n="status-late-minor";return t>600?n="status-late-severe":t>300&&(n="status-late-moderate"),{text:`+${a} min late`,colorClass:n}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function Ea(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function y(t){if(!r.fetchedAt)return t;const e=Math.max(0,Math.floor((Date.now()-new Date(r.fetchedAt).getTime())/1e3));return t-e}function N(t,e){return e<=90?"status-arriving":t.delayInfo.colorClass}function ie(t){const e=y(t.nextOffset??0),a=y(t.closestOffset??0),n=t.delayInfo.text;return e<=15?[{text:"Arriving now",toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:e<=90?[{text:`Arriving in ${V(e)}`,toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:a<0&&e>0?[{text:`Next stop in ${V(e)}`,toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:[{text:Ea(t.serviceStatus),toneClass:N(t,e)},{text:n,toneClass:t.delayInfo.colorClass}]}function C(t){return t.map(e=>`
        <span class="status-chip ${e.toneClass}">
          ${e.text}
        </span>
      `).join("")}function se(t){const e=y(t.nextOffset??0),a=y(t.closestOffset??0),n=t.upcomingLabel||t.toLabel||t.currentStopLabel,[i,s]=ie(t);return e<=15?`${t.label} at ${n} ${C([i,s])}`:e<=90?`${t.label} at ${n} ${C([i,s])}`:a<0&&e>0?`${t.label} ${n} ${C([i,s])}`:`${t.label} to ${n} ${C([i,s])}`}function re(t){return C(ie(t))}function oe(t,e){if(!e.length)return"";const a=[...e].sort((i,s)=>y(i.nextOffset??0)-y(s.nextOffset??0)).slice(0,8),n=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${t};">
      <div class="line-marquee-track">
        ${n.map(i=>`
          <span
            class="line-marquee-item ${N(i,y(i.nextOffset??0))}"
            data-vehicle-marquee="${i.id}"
          >
            <span class="line-marquee-token">${i.lineToken}</span>
            <span class="line-marquee-copy">${se(i)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function Ca(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const n=a.dataset.vehicleStatus,i=j().find(l=>l.id===n);if(!i)return;const s=y(i.nextOffset??0);a.innerHTML=re(i),a.className=`train-list-status ${N(i,s)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const n=a.dataset.vehicleMarquee,i=j().find(o=>o.id===n);if(!i)return;const s=y(i.nextOffset??0);a.className=`line-marquee-item ${N(i,s)}`;const l=a.querySelector(".line-marquee-copy");l&&(l.innerHTML=se(i))})}function ka(t,e,a,n){const i=t.tripStatus?.activeTripId??t.tripId??"",s=n.get(i);if(!s||s.routeId!==e.routeKey)return null;const l=t.tripStatus?.closestStop,o=t.tripStatus?.nextStop,c=a.stationIndexByStopId.get(l),d=a.stationIndexByStopId.get(o);if(c==null&&d==null)return null;let m=c??d,u=d??c;if(m>u){const Re=m;m=u,u=Re}const p=a.stations[m],f=a.stations[u],g=t.tripStatus?.closestStopTimeOffset??0,A=t.tripStatus?.nextStopTimeOffset??0,$t=s.directionId==="1"?"▲":s.directionId==="0"?"▼":Ma(c,d);let O=0;m!==u&&g<0&&A>0&&(O=X(Math.abs(g)/(Math.abs(g)+A),0,1));const Ie=p.y+(f.y-p.y)*O,De=m!==u?p.segmentMinutes:0,Me=p.cumulativeMinutes+De*O,G=c??d??m,Lt=a.stations[G]??p,Tt=$t==="▲",xe=X(G+(Tt?1:-1),0,a.stations.length-1),Ae=c!=null&&d!=null&&c!==d?d:X(G+(Tt?-1:1),0,a.stations.length-1),Ee=a.stations[xe]??Lt,Ce=a.stations[Ae]??f,It=t.tripStatus?.scheduleDeviation??0,Dt=t.tripStatus?.predicted??!1,ke=Aa(It,Dt);return{id:t.vehicleId,label:t.vehicleId.replace(/^\d+_/,""),directionSymbol:$t,fromLabel:p.label,minutePosition:Me,progress:O,serviceStatus:xa(t),toLabel:f.label,y:Ie,currentLabel:p.label,nextLabel:f.label,previousLabel:Ee.label,currentStopLabel:Lt.label,upcomingLabel:Ce.label,status:t.tripStatus?.status??"",closestStop:l,nextStop:o,closestOffset:g,nextOffset:A,scheduleDeviation:It,isPredicted:Dt,delayInfo:ke,rawVehicle:t}}function le(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function j(){return r.lines.flatMap(t=>(r.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function Ra(){return Object.values(U).filter(t=>r.systemsById.has(t.id)).map(t=>`
        <button
          class="tab-button ${t.id===r.activeSystemId?"is-active":""}"
          data-system-switch="${t.id}"
          type="button"
        >
          ${t.label}
        </button>
      `).join("")}function J(){return!r.compactLayout||r.lines.length<2?"":`<section class="line-switcher">${r.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===r.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function nt(t,e){const a=[...t].sort((s,l)=>s.minutePosition-l.minutePosition),n=[...e].sort((s,l)=>s.minutePosition-l.minutePosition),i=s=>s.slice(1).map((l,o)=>Math.round(l.minutePosition-s[o].minutePosition));return{nbGaps:i(a),sbGaps:i(n)}}function Na(t){if(!t.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const e=t.reduce((i,s)=>i+s,0)/t.length,a=Math.max(...t),n=Math.min(...t);return{avg:Math.round(e),max:a,min:n,spread:a-n,ratio:a/Math.max(n,1)}}function it(t,e){const a=Na(t);if(e<2||a.avg==null)return{health:"quiet",stats:a};let n="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?n="bunched":a.max>=12||a.spread>=6?n="uneven":a.avg>=18&&(n="sparse"),{health:n,stats:a}}function Bt(t,e,a){const{health:n,stats:i}=it(e,a),s=i.avg!=null?`~${i.avg} min`:"—",l=n==="healthy"?"Consistent spacing now":n==="uneven"?`Largest gap ${i.max} min`:n==="bunched"?"Short and long gaps at once":n==="sparse"?"Service spread is thin":a<2?`Too few ${v().toLowerCase()}`:"Low frequency";return`
    <div class="headway-health-card headway-health-card-${n}">
      <p class="headway-health-label">${t}</p>
      <p class="headway-health-value">${s}</p>
      <p class="headway-health-copy">${l}</p>
    </div>
  `}function Pa(t){return t.reduce((e,a)=>{const n=Number(a.scheduleDeviation??0);return n<=60?e.onTime+=1:n<=300?e.minorLate+=1:e.severeLate+=1,e},{onTime:0,minorLate:0,severeLate:0})}function ce(t,e){return e?`${Math.round(t/e*100)}%`:"—"}function qa(t,e){return Math.abs(t.length-e.length)<=1?{label:"Balanced",tone:"healthy"}:t.length>e.length?{label:"▲ Heavier",tone:"warn"}:{label:"▼ Heavier",tone:"warn"}}function Oa(t,e){return`
    <div class="delay-distribution">
      ${[["On time",t.onTime,"healthy"],["2-5 min late",t.minorLate,"warn"],["5+ min late",t.severeLate,"alert"]].map(([n,i,s])=>`
        <div class="delay-chip delay-chip-${s}">
          <p class="delay-chip-label">${n}</p>
          <p class="delay-chip-value">${i}</p>
          <p class="delay-chip-copy">${ce(i,e)}</p>
        </div>
      `).join("")}
    </div>
  `}function Ft(t,e,a,n){if(!e.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${t}</p>
          <p class="flow-lane-copy">No live ${v().toLowerCase()}</p>
        </div>
      </div>
    `;const i=[...e].sort((l,o)=>l.minutePosition-o.minutePosition),s=i.map(l=>{const o=a.totalMinutes>0?l.minutePosition/a.totalMinutes:0;return Math.max(0,Math.min(100,o*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${t}</p>
        <p class="flow-lane-copy">${i.length} live ${i.length===1?w().toLowerCase():v().toLowerCase()}</p>
      </div>
      <div class="flow-track" style="--line-color:${n};">
        ${s.map((l,o)=>`
          <span
            class="flow-vehicle"
            style="left:${l}%; --line-color:${n};"
            title="${i[o].label} · ${le(i[o])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function de(t,e,a,n){const i=[],{stats:s}=it(nt(e,[]).nbGaps,e.length),{stats:l}=it(nt([],a).sbGaps,a.length),o=[...e,...a].filter(d=>Number(d.scheduleDeviation??0)>300),c=Math.abs(e.length-a.length);return s.max!=null&&s.max>=12&&i.push({tone:"alert",copy:`Direction ▲ has a ${s.max} min service hole right now.`}),l.max!=null&&l.max>=12&&i.push({tone:"alert",copy:`Direction ▼ has a ${l.max} min service hole right now.`}),c>=2&&i.push({tone:"warn",copy:e.length>a.length?`Vehicle distribution is tilted toward ▲ by ${c}.`:`Vehicle distribution is tilted toward ▼ by ${c}.`}),o.length&&i.push({tone:"warn",copy:`${o.length} ${o.length===1?w().toLowerCase():v().toLowerCase()} are running 5+ min late.`}),n.length&&i.push({tone:"info",copy:`${n.length} active alert${n.length===1?"":"s"} affecting ${t.name}.`}),i.length||i.push({tone:"healthy",copy:"Spacing and punctuality look stable right now."}),i.slice(0,4)}function _a(t){const e=t.flatMap(l=>l.exceptions.map(o=>({tone:o.tone,copy:`${l.line.name}: ${o.copy}`,lineColor:l.line.color})));if(!e.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="Current insights summary">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">No active issues right now.</span>
        </div>
      </section>
    `;const a=Ba(),n=Math.ceil(e.length/a),i=r.insightsTickerIndex%n;return`
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
  `}function Ba(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);return n>=1680?3:n>=980?2:1}function Fa(t,e,a,n,i){const s=a.length+n.length;if(!s)return"";const{nbGaps:l,sbGaps:o}=nt(a,n),c=[...a,...n],d=Pa(c),m=[...l,...o].length?Math.max(...l,...o):null,u=qa(a,n),p=de(t,a,n,i),f=new Set(i.flatMap(g=>g.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">In Service</p>
          <p class="metric-chip-value">${s}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">On-Time Rate</p>
          <p class="metric-chip-value">${ce(d.onTime,s)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">Worst Gap</p>
          <p class="metric-chip-value">${m!=null?`${m} min`:"—"}</p>
        </div>
        <div class="metric-chip metric-chip-${u.tone}">
          <p class="metric-chip-label">Balance</p>
          <p class="metric-chip-value">${u.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${Bt("Direction ▲",l,a.length)}
        ${Bt("Direction ▼",o,n.length)}
      </div>
      ${Oa(d,s)}
      <div class="flow-grid">
        ${Ft("Direction ▲ Flow",a,e,t.color)}
        ${Ft("Direction ▼ Flow",n,e,t.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">Now</p>
          <p class="headway-chart-copy">${i.length?`${i.length} active alert${i.length===1?"":"s"}${f?` · ${f} impacted stops`:""}`:"No active alerts on this line"}</p>
        </div>
        ${p.map(g=>`
          <div class="insight-exception insight-exception-${g.tone}">
            <p>${g.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function ue(t,e=!1){const a=Date.now(),n=s=>{const l=s.arrivalTime,o=Math.floor((l-a)/1e3),c=V(o),d=he(s.arrivalTime,s.scheduleDeviation??0),m=vt(d);let u="";if(s.distanceFromStop>0){const p=s.distanceFromStop>=1e3?`${(s.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(s.distanceFromStop)}m`,f=s.numberOfStopsAway===1?"1 stop away":`${s.numberOfStopsAway} stops away`;u=` • ${p} • ${f}`}return`
      <div class="arrival-item" data-arrival-time="${s.arrivalTime}" data-schedule-deviation="${s.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${s.lineColor};">${s.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${s.lineName} ${w()} ${s.vehicleId}</span>
            <span class="arrival-destination">To ${s.destination}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${m}">${d}</span>
          <span class="arrival-time"><span class="arrival-countdown">${c}</span><span class="arrival-precision">${u}</span></span>
        </span>
      </div>
    `};if(e){Rt.innerHTML="",Nt.innerHTML="",k.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',R.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',st();return}const i=(s,l,o)=>{if(!s.length){l.innerHTML="",o.innerHTML=`<div class="arrival-item muted">No upcoming ${v().toLowerCase()}</div>`;return}const c=r.dialogDisplayMode?s.slice(0,2):[],d=r.dialogDisplayMode?s.slice(2):s;l.innerHTML=c.map(n).join(""),o.innerHTML=d.length?d.map(n).join(""):r.dialogDisplayMode?`<div class="arrival-item muted">No additional ${v().toLowerCase()}</div>`:""};i(t.nb,Rt,k),i(t.sb,Nt,R),st()}function P(t,e){const a=new Set(e.stationAliases?.[t.id]??[]);a.add(t.id);const n=new Set;for(const s of a){const l=s.startsWith(`${e.agencyId}_`)?s:`${e.agencyId}_${s}`;n.add(l)}const i=t.id.replace(/-T\d+$/,"");return n.add(i.startsWith(`${e.agencyId}_`)?i:`${e.agencyId}_${i}`),[...n]}function K(t){const e=r.lines.map(a=>{const n=a.stops.find(i=>i.id===t.id);return n?{line:a,station:n}:null}).filter(Boolean);return e.length>0?e:r.lines.map(a=>{const n=a.stops.find(i=>i.name===t.name);return n?{line:a,station:n}:null}).filter(Boolean)}function Ua(t){if(!t)return null;const e=t.trim().toLowerCase();for(const a of r.lines)for(const n of a.stops){const i=new Set([n.id,`${a.agencyId}_${n.id}`,n.name,H(n.name),F(n.name),F(H(n.name))]);for(const s of a.stationAliases?.[n.id]??[])i.add(s),i.add(`${a.agencyId}_${s}`),i.add(F(s));if([...i].some(s=>String(s).toLowerCase()===e))return n}return null}function Ha(t){const e=new URL(window.location.href);e.searchParams.set("station",F(t.name)),window.history.pushState({},"",e)}function me(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function Ut(t){const e=new URL(window.location.href);t===x?e.searchParams.delete("system"):e.searchParams.set("system",t),window.history.pushState({},"",e)}function pe(){const e=new URL(window.location.href).searchParams.get("system");return e&&r.systemsById.has(e)?e:x}function mt(t){r.dialogDisplayMode=t,h.classList.toggle("is-display-mode",t),at.textContent=t?"Exit":"Board",at.setAttribute("aria-label",t?"Exit display mode":"Toggle display mode"),r.dialogDisplayDirection="both",r.dialogDisplayAutoPhase="nb",ft(),h.open&&r.currentDialogStation&&yt(r.currentDialogStation).catch(console.error),Y(),st()}function Wa(){mt(!r.dialogDisplayMode)}function pt(){r.dialogDisplayDirectionTimer&&(window.clearInterval(r.dialogDisplayDirectionTimer),r.dialogDisplayDirectionTimer=0)}function ft(){pt();const t=r.dialogDisplayDirection,e=t==="auto"?r.dialogDisplayAutoPhase:t;Xt.forEach(a=>{a.classList.toggle("is-active",a.dataset.dialogDirection===t)}),h.classList.toggle("show-nb-only",r.dialogDisplayMode&&e==="nb"),h.classList.toggle("show-sb-only",r.dialogDisplayMode&&e==="sb"),r.dialogDisplayMode&&t==="auto"&&(r.dialogDisplayDirectionTimer=window.setInterval(()=>{r.dialogDisplayAutoPhase=r.dialogDisplayAutoPhase==="nb"?"sb":"nb",ft()},Ke))}function gt(){r.dialogRefreshTimer&&(window.clearTimeout(r.dialogRefreshTimer),r.dialogRefreshTimer=0)}function ht(){r.dialogDisplayTimer&&(window.clearInterval(r.dialogDisplayTimer),r.dialogDisplayTimer=0)}function Q(t,e){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(t.style.transform="translateY(0)",!r.dialogDisplayMode||a.length<=3)return;const n=Number.parseFloat(window.getComputedStyle(t).rowGap||"0")||0,i=a[0].getBoundingClientRect().height+n,s=Math.max(0,a.length-3),l=Math.min(r.dialogDisplayIndexes[e],s);t.style.transform=`translateY(-${l*i}px)`}function st(){ht(),r.dialogDisplayIndexes={nb:0,sb:0},Q(k,"nb"),Q(R,"sb"),r.dialogDisplayMode&&(r.dialogDisplayTimer=window.setInterval(()=>{for(const[t,e]of[["nb",k],["sb",R]]){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const n=Math.max(0,a.length-3);r.dialogDisplayIndexes[t]=r.dialogDisplayIndexes[t]>=n?0:r.dialogDisplayIndexes[t]+1,Q(e,t)}},je))}function Va(){if(!h.open)return;h.querySelectorAll(".arrival-item[data-arrival-time]").forEach(e=>{const a=Number(e.dataset.arrivalTime),n=Number(e.dataset.scheduleDeviation||0),i=e.querySelector(".arrival-countdown"),s=e.querySelector(".arrival-status");if(!i||!s)return;i.textContent=V(Math.floor((a-Date.now())/1e3));const l=he(a,n),o=vt(l);s.textContent=l,s.className=`arrival-status arrival-status-${o}`})}function ja(){if(gt(),!r.currentDialogStation)return;const t=()=>{r.dialogRefreshTimer=window.setTimeout(async()=>{!h.open||!r.currentDialogStation||(await yt(r.currentDialogStation).catch(console.error),t())},Ve)};t()}function fe(){r.currentDialogStationId="",r.currentDialogStation=null,h.open?h.close():(gt(),ht(),pt(),mt(!1),me())}async function Ht(){const t=pe();t!==r.activeSystemId&&await Te(t,{updateUrl:!1,preserveDialog:!1});const e=new URL(window.location.href).searchParams.get("station"),a=Ua(e);r.isSyncingFromUrl=!0;try{if(!a){r.currentDialogStationId="",h.open&&h.close();return}if(r.activeTab="map",b(),r.currentDialogStationId===a.id&&h.open)return;await Se(a,!1)}finally{r.isSyncingFromUrl=!1}}function Ka(t,e){const a=e.directionLookup?.[t.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const n=t.tripHeadsign??"",i=n.toLowerCase();return e.nbTerminusPrefix&&i.startsWith(e.nbTerminusPrefix)?"nb":e.sbTerminusPrefix&&i.startsWith(e.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function ge(t){return t.routeKey??`${t.agencyId}_${t.id}`}function Ya(t){const e=t.tripHeadsign?.trim();return e?H(e.replace(/^to\s+/i,"")):"Terminal"}function he(t,e){return Math.floor((t-Date.now())/1e3)<=90?"ARR":e>=120?"DELAY":"ON TIME"}function vt(t){return t==="DELAY"?"delay":t==="ARR"?"arr":"ok"}async function Ga(t){const e=`${Vt}/arrivals-and-departures-for-stop/${t}.json?key=${ot}&minutesAfter=120`,a=await ne(e,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${t}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function ve(t){const e=[...new Set(t)],a=[],n=[];for(let i=0;i<e.length;i+=z){const s=e.slice(i,i+z),l=await Promise.allSettled(s.map(o=>Ga(o)));a.push(...l),Et>0&&i+z<e.length&&await ut(Et)}for(const i of a)i.status==="fulfilled"&&n.push(...i.value);return n}function ye(t,e,a=null){const n=Date.now(),i=new Set,s={nb:[],sb:[]},l=a?new Set(a):null;for(const o of t){if(o.routeId!==ge(e)||l&&!l.has(o.stopId))continue;const c=o.predictedArrivalTime||o.scheduledArrivalTime;if(!c||c<=n)continue;const d=Ka(o,e);if(!d)continue;const m=`${o.tripId}:${o.stopId}:${c}`;i.has(m)||(i.add(m),s[d].push({vehicleId:(o.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:c,destination:Ya(o),scheduleDeviation:o.scheduleDeviation??0,tripId:o.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0],distanceFromStop:o.distanceFromStop??0,numberOfStopsAway:o.numberOfStopsAway??0}))}return s.nb.sort((o,c)=>o.arrivalTime-c.arrivalTime),s.sb.sort((o,c)=>o.arrivalTime-c.arrivalTime),s.nb=s.nb.slice(0,4),s.sb=s.sb.slice(0,4),s}async function za(t,e,a=null){const n=`${r.activeSystemId}:${e.id}:${t.id}`,i=r.arrivalsCache.get(n);if(i&&Date.now()-i.fetchedAt<Be)return i.value;const s=P(t,e),l=a??await ve(s),o=ye(l,e,s);return r.arrivalsCache.set(n,{fetchedAt:Date.now(),value:o}),o}function Xa(t){const e={nb:[],sb:[]};for(const a of t)e.nb.push(...a.nb),e.sb.push(...a.sb);return e.nb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e.sb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e}function be(t){const e=$a(t);if(!e.length){E.innerHTML="",E.hidden=!0;return}E.hidden=!1,E.innerHTML=`
    <div class="station-alerts">
      ${e.map((a,n)=>`
        <button class="station-alert-pill" data-alert-idx="${n}" type="button">
          <span class="station-alert-pill-meta">${te(a.severity)} · ${Qt(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||"Service alert"}</span>
        </button>
      `).join("")}
    </div>
  `,E.querySelectorAll(".station-alert-pill").forEach(a=>{const n=e[Number(a.dataset.alertIdx)];n&&a.addEventListener("click",()=>{const i=r.lines.find(s=>n.lineIds.includes(s.id));i&&we(i)})})}async function Se(t,e=!0){tn(t.name),wa(t),r.currentDialogStationId=t.id,r.currentDialogStation=t,be(t),rt([],!0),ue({nb:[],sb:[]},!0),e&&Ha(t),h.showModal(),Y(),ja(),await yt(t)}async function yt(t){const e=r.activeDialogRequest+1;r.activeDialogRequest=e;try{const a=K(t),n=sn(t),i=a.flatMap(({station:c,line:d})=>P(c,d)),s=n.flatMap(({stop:c,line:d})=>P(c,d)),l=await ve([...i,...s]),o=await Promise.all(a.map(({station:c,line:d})=>za(c,d,l)));if(r.activeDialogRequest!==e||!h.open)return;rt(rn(n,l)),be(t),ue(Xa(o))}catch(a){if(r.activeDialogRequest!==e||!h.open)return;rt([]),k.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,R.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function Za(t){const e=r.layouts.get(t.id),a=r.vehiclesByLine.get(t.id)??[],n=q(t.id),i=e.stations.map((o,c)=>{const d=e.stations[c-1],m=c>0?d.segmentMinutes:"",p=ee(o,t).length>0,f=o.isTerminal?15:10;return`
        <g transform="translate(0, ${o.y})" class="station-group${p?" has-alert":""}" data-stop-id="${o.id}" style="cursor: pointer;">
          ${c>0?`<text x="0" y="-14" class="segment-time">${m}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${o.isTerminal?11:5}" class="${o.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${o.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          ${p?`<circle cx="${e.trackX+f}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${o.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),s=a.map((o,c)=>`
        <g transform="translate(${e.trackX}, ${o.y+(c%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${c*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${o.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),l=w();return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div>
            <div class="line-title-row">
              <h2>${t.name}</h2>
              ${ae(n,t.id)}
            </div>
            <p>${a.length} live ${a.length===1?l.toLowerCase():v().toLowerCase()}</p>
            <p>${ct(t)}</p>
            ${dt(t)}
          </div>
        </div>
      </header>
      ${oe(t.color,a.map(o=>({...o,lineToken:t.name[0]})))}
      <svg viewBox="0 0 460 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${i}
        ${s}
      </svg>
    </article>
  `}function Ja(){const t=j().sort((l,o)=>l.minutePosition-o.minutePosition),e=w(),a=v(),n=a.toLowerCase();return t.length?(r.compactLayout?r.lines.filter(l=>l.id===r.activeLineId):r.lines).map(l=>{const o=t.filter(p=>p.lineId===l.id),c=q(l.id),d=o.filter(p=>p.directionSymbol==="▲"),m=o.filter(p=>p.directionSymbol==="▼"),u=(p,f)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${p}</p>
          ${f.length?f.map(g=>`
                      <article class="train-list-item" data-train-id="${g.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${g.lineColor};">${g.lineToken}</span>
                          <div>
                            <p class="train-list-title">${g.lineName} ${e} ${g.label}</p>
                            <p class="train-list-subtitle">${le(g)}</p>
                            <p class="train-list-status ${N(g,y(g.nextOffset??0))}" data-vehicle-status="${g.id}">${re(g)}</p>
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
                  ${ae(c,l.id)}
                </div>
                <p>${o.length} ${o.length===1?e.toLowerCase():v().toLowerCase()} in service · ${ct(l)}</p>
                ${dt(l)}
              </div>
            </div>
            </header>
          ${oe(l.color,o)}
          <div class="line-readout line-readout-grid train-columns">
            ${u("NB",d)}
            ${u("SB",m)}
          </div>
        </article>
      `}).join(""):`
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>Active ${a}</h2>
          <p>No live ${n}</p>
        </article>
      </section>
    `}function Qa(t){return new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function tn(t){zt.textContent=t,aa.textContent=t,Y()}function Y(){const t=ta;if(!t||!ea)return;const a=r.dialogDisplayMode&&h.open&&zt.scrollWidth>t.clientWidth;t.classList.toggle("is-marquee",a)}function en(t,e,a,n){const s=(a-t)*Math.PI/180,l=(n-e)*Math.PI/180,o=Math.sin(s/2)**2+Math.cos(t*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(l/2)**2;return 2*6371*Math.asin(Math.sqrt(o))}function an(t){return Math.max(1,Math.round(t/Ye*60))}function nn(t){return t>=1?`${t.toFixed(1)} km walk`:`${Math.round(t*1e3)} m walk`}function sn(t){if(!t)return[];const e=K(t),a=new Set(e.map(({line:i,station:s})=>`${i.agencyId}:${i.id}:${s.id}`)),n=new Map;for(const i of r.systemsById.values())for(const s of i.lines??[])for(const l of s.stops??[]){if(a.has(`${s.agencyId}:${s.id}:${l.id}`))continue;const o=en(t.lat,t.lon,l.lat,l.lon);if(o>Ge)continue;const c=`${i.id}:${s.id}`,d=n.get(c);(!d||o<d.distanceKm)&&n.set(c,{systemId:i.id,systemName:i.name,line:s,stop:l,distanceKm:o,walkMinutes:an(o)})}return[...n.values()].sort((i,s)=>i.distanceKm-s.distanceKm||i.line.name.localeCompare(s.line.name)).slice(0,jt*2)}function rt(t,e=!1){if(e){T.hidden=!1,T.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">Transfers</h4>
          <p class="transfer-panel-copy">Checking nearby connections...</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">Loading transfer recommendations...</div>
        </div>
      </div>
    `;return}if(!t.length){T.hidden=!0,T.innerHTML="";return}T.hidden=!1,T.innerHTML=`
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
                    <p class="transfer-card-meta">${nn(a.distanceKm)}${a.arrival?` • To ${a.arrival.destination}`:""}</p>
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
  `}function rn(t,e){const a=Date.now(),n=[];for(const i of t){const s=P(i.stop,i.line),l=ye(e,i.line,s),o=[...l.nb,...l.sb].sort((p,f)=>p.arrivalTime-f.arrivalTime);if(!o.length)continue;const c=a+i.walkMinutes*6e4+ze,d=o.find(p=>p.arrivalTime>=c)??o[0],m=d.arrivalTime-a-i.walkMinutes*6e4,u=Math.max(0,Math.round(m/6e4));n.push({...i,arrival:d,boardAt:d.arrivalTime,badge:m<=0?"Leave now":u<=1?"Board in ~1 min":`Board in ~${u} min`,tone:u<=2?"hot":u<=8?"good":"calm",timeText:Qa(d.arrivalTime)})}return n.sort((i,s)=>i.boardAt-s.boardAt||i.distanceKm-s.distanceKm).slice(0,jt)}function on(){const t=r.compactLayout?r.lines.filter(n=>n.id===r.activeLineId):r.lines,e=w(),a=t.map(n=>{const i=r.layouts.get(n.id),s=r.vehiclesByLine.get(n.id)??[],l=s.filter(d=>d.directionSymbol==="▲"),o=s.filter(d=>d.directionSymbol==="▼"),c=q(n.id);return{line:n,layout:i,vehicles:s,nb:l,sb:o,lineAlerts:c,exceptions:de(n,l,o,c)}});return`
    ${_a(a)}
    ${a.map(({line:n,layout:i,vehicles:s,nb:l,sb:o,lineAlerts:c})=>{const d=Fa(n,i,l,o,c);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${n.color};">${n.name[0]}</span>
              <div>
                <h2>${n.name}</h2>
                <p>${s.length} live ${s.length===1?w().toLowerCase():v().toLowerCase()} · ${ct(n)}</p>
                ${dt(n)}
              </div>
            </div>
          </header>
          ${d||`<p class="train-readout muted">Waiting for live ${e.toLowerCase()} data…</p>`}
        </article>
      `}).join("")}
  `}function ln(){document.querySelectorAll("[data-system-switch]").forEach(e=>{e.addEventListener("click",async()=>{await Te(e.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function tt(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{r.activeLineId=e.dataset.lineSwitch,b()})})}function bt(){r.currentTrainId="",D.open&&D.close()}function St(){M.open&&M.close()}function we(t){const e=q(t.id);ca.textContent=`${t.name} Alerts`,da.textContent=`${e.length} active alert${e.length===1?"":"s"}`,ua.textContent=t.name,qt.textContent="",qt.innerHTML=e.length?e.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${te(a.severity)} • ${Qt(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||"Service alert"}</p>
              <p class="alert-dialog-item-copy">${a.description||"No additional alert details available."}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">Read official alert</a></p>`:""}
            </article>
          `).join(""):'<p class="alert-dialog-item-copy">No active alerts.</p>',Ot.hidden=!0,Ot.removeAttribute("href"),M.open||M.showModal()}function Wt(){document.querySelectorAll("[data-alert-line-id]").forEach(e=>{e.addEventListener("click",()=>{const a=r.lines.find(n=>n.id===e.dataset.alertLineId);a&&we(a)})})}function cn(t){const e=t.fromLabel!==t.toLabel&&t.progress>0&&t.progress<1,a=e?t.fromLabel:t.previousLabel,n=e?`${t.fromLabel} -> ${t.toLabel}`:t.currentStopLabel,i=e?"Between":"Now",s=e?t.toLabel:t.upcomingLabel,l=e?t.progress:.5;sa.textContent=`${t.lineName} ${w()} ${t.label}`,ra.textContent=t.directionSymbol==="▲"?"Direction A movement":"Direction B movement",Pt.className=`train-detail-status train-list-status-${vt(t.serviceStatus)}`,Pt.textContent=t.serviceStatus,oa.innerHTML=`
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
        <p class="train-detail-name">${s}</p>
      </div>
    </div>
  `,D.open||D.showModal()}function dn(){document.querySelectorAll("[data-train-id]").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.trainId,n=j().find(i=>i.id===a);n&&(r.currentTrainId=a,cn(n))})})}function un(){r.lines.forEach(t=>{const e=r.layouts.get(t.id),a=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.stopId,l=e.stations.find(o=>o.id===s);l&&Se(l)})})})}function b(){const t=lt();if(Gt.textContent=r.theme==="dark"?"Light":"Dark",Ze.textContent=t.kicker,Je.textContent=t.title,Ct.hidden=r.systemsById.size<2,Ct.innerHTML=Ra(),$e(),Yt.forEach(e=>e.classList.toggle("is-active",e.dataset.tab===r.activeTab)),document.querySelector("#tab-trains").textContent=v(),ln(),r.activeTab==="map"){$.className="board";const e=r.compactLayout?r.lines.filter(a=>a.id===r.activeLineId):r.lines;$.innerHTML=`${J()}${e.map(Za).join("")}`,tt(),Wt(),un(),queueMicrotask(W);return}if(r.activeTab==="trains"){$.className="board",$.innerHTML=`${J()}${Ja()}`,tt(),Wt(),dn(),queueMicrotask(W);return}r.activeTab==="insights"&&($.className="board",$.innerHTML=`${J()}${on()}`,tt())}function mn(){window.clearInterval(r.insightsTickerTimer),r.insightsTickerTimer=0}function pn(){mn(),r.insightsTickerTimer=window.setInterval(()=>{r.insightsTickerIndex+=1,r.activeTab==="insights"&&b()},5e3)}function $e(){B.textContent=r.error?"HOLD":"SYNC",B.classList.toggle("status-pill-error",!!r.error),Qe.textContent=`Now ${ya()}`,et.textContent=r.error?"Using last successful snapshot":va(r.fetchedAt),kt.textContent=B.textContent,kt.classList.toggle("status-pill-error",!!r.error),ia.textContent=et.textContent}function fn(){window.clearTimeout(r.liveRefreshTimer),r.liveRefreshTimer=0}function gn(){fn();const t=()=>{r.liveRefreshTimer=window.setTimeout(async()=>{await wt(),t()},We)};t()}function Le(t){const e=r.systemsById.has(t)?t:x,a=r.systemsById.get(e);r.activeSystemId=e,r.lines=a?.lines??[],r.layouts=r.layoutsBySystem.get(e)??new Map,r.lines.some(n=>n.id===r.activeLineId)||(r.activeLineId=r.lines[0]?.id??""),r.vehiclesByLine=new Map,r.rawVehicles=[],r.arrivalsCache.clear(),r.alerts=[],r.error="",r.fetchedAt="",r.insightsTickerIndex=0}async function Te(t,{updateUrl:e=!0,preserveDialog:a=!1}={}){if(!r.systemsById.has(t)||r.activeSystemId===t){e&&Ut(r.activeSystemId);return}Le(t),a||fe(),bt(),St(),b(),e&&Ut(t),await wt()}async function hn(){const a=(await(await fetch(_e,{cache:"no-store"})).json()).systems??[];r.systemsById=new Map(a.map(n=>[n.id,n])),r.layoutsBySystem=new Map(a.map(n=>[n.id,new Map(n.lines.map(i=>[i.id,Da(i)]))])),Le(pe())}function vn(t){const e=[...new Set((t.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=r.lines.filter(n=>e.includes(ge(n))).map(n=>n.id);return a.length?{id:t.id,effect:t.reason??"SERVICE ALERT",severity:t.severity??"INFO",title:t.summary?.value??"Service alert",description:t.description?.value??"",url:t.url?.value??"",lineIds:a,stopIds:[...new Set((t.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function wt(){try{const t=await ne(fa(),"Realtime");r.error="",r.fetchedAt=new Date().toISOString(),r.rawVehicles=t.data.list??[],r.alerts=(t.data.references?.situations??[]).map(vn).filter(Boolean);const e=new Map((t.data.references?.trips??[]).map(a=>[a.id,a]));for(const a of r.lines){const n=r.layouts.get(a.id),i=r.rawVehicles.map(s=>ka(s,a,n,e)).filter(Boolean);r.vehiclesByLine.set(a.id,i)}}catch(t){r.error="Realtime offline",console.error(t)}b()}async function yn(){Zt(ha()),_t(),await hn(),b(),await wt(),await Ht(),window.addEventListener("popstate",()=>{Ht().catch(console.error)});const t=()=>{const a=r.compactLayout;if(_t(),Y(),a!==r.compactLayout){b();return}W()};window.addEventListener("resize",t),window.visualViewport?.addEventListener("resize",t),new ResizeObserver(()=>{W()}).observe($),gn(),pn(),window.setInterval(()=>{$e(),Va(),Ca()},1e3)}yn().catch(t=>{B.textContent="FAIL",et.textContent=t.message});
