(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const Fe="modulepreload",He=function(t){return"/link/"+t},Et={},Ue=function(e,a,n){let i=Promise.resolve();if(a&&a.length>0){let d=function(p){return Promise.all(p.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};var l=d;document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=r?.nonce||r?.getAttribute("nonce");i=d(a.map(p=>{if(p=He(p),p in Et)return;Et[p]=!0;const u=p.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${m}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":Fe,u||(f.as="script"),f.crossOrigin="",f.href=p,c&&f.setAttribute("nonce",c),document.head.appendChild(f),u)return new Promise((h,D)=>{f.addEventListener("load",h),f.addEventListener("error",()=>D(new Error(`Unable to preload CSS for ${p}`)))})}))}function s(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return i.then(r=>{for(const c of r||[])c.status==="rejected"&&s(c.reason);return e().catch(s)})};function We(t={}){const{immediate:e=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:i,onRegisteredSW:s,onRegisterError:l}=t;let r,c;const d=async(u=!0)=>{await c};async function p(){if("serviceWorker"in navigator){if(r=await Ue(async()=>{const{Workbox:u}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:u}},[]).then(({Workbox:u})=>new u("/link/sw.js",{scope:"/link/",type:"classic"})).catch(u=>{l?.(u)}),!r)return;r.addEventListener("activated",u=>{(u.isUpdate||u.isExternal)&&window.location.reload()}),r.addEventListener("installed",u=>{u.isUpdate||n?.()}),r.register({immediate:e}).then(u=>{s?s("/link/sw.js",u):i?.(u)}).catch(u=>{l?.(u)})}}return c=p(),d}const Ve="./pulse-data.json",zt="https://api.pugetsound.onebusaway.org/api/where",ft="TEST".trim()||"TEST",M=ft==="TEST",je=M?6e4:2e4,Rt=3,Ge=800,Ke=M?2e4:5e3,Nt=M?12e4:3e4,Pt=M?1200:0,nt=M?1:3,Ye=1100,ze=M?45e3:15e3,Xe=M?9e4:3e4,Ze=4e3,Je=15e3,Qe=4.8,ta=.35,ea=45e3,Xt=4,Zt="link-pulse-theme",P="link",X={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},o={fetchedAt:"",error:"",activeSystemId:P,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map},aa=We({immediate:!0,onNeedRefresh(){aa(!0)}});document.querySelector("#app").innerHTML=`
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
`;const I=document.querySelector("#board"),na=document.querySelector("#screen-kicker"),ia=document.querySelector("#screen-title"),Ot=document.querySelector("#system-bar"),Jt=[...document.querySelectorAll(".tab-button")],Qt=document.querySelector("#theme-toggle"),Y=document.querySelector("#status-pill"),sa=document.querySelector("#current-time"),dt=document.querySelector("#updated-at"),v=document.querySelector("#station-dialog"),oa=document.querySelector("#dialog-title"),ra=document.querySelector("#dialog-title-track"),te=document.querySelector("#dialog-title-text"),la=document.querySelector("#dialog-title-text-clone"),ca=document.querySelector("#dialog-service-summary"),qt=document.querySelector("#dialog-status-pill"),da=document.querySelector("#dialog-updated-at"),ut=document.querySelector("#dialog-display"),ee=[...document.querySelectorAll("[data-dialog-direction]")],O=document.querySelector("#station-alerts-container"),k=document.querySelector("#transfer-section"),Bt=document.querySelector("#arrivals-nb-pinned"),B=document.querySelector("#arrivals-nb"),_t=document.querySelector("#arrivals-sb-pinned"),_=document.querySelector("#arrivals-sb"),R=document.querySelector("#train-dialog"),ua=document.querySelector("#train-dialog-title"),pa=document.querySelector("#train-dialog-subtitle"),ma=document.querySelector("#train-dialog-line"),Ft=document.querySelector("#train-dialog-status"),ha=document.querySelector("#train-dialog-close"),N=document.querySelector("#alert-dialog"),fa=document.querySelector("#alert-dialog-title"),ga=document.querySelector("#alert-dialog-subtitle"),va=document.querySelector("#alert-dialog-lines"),Ht=document.querySelector("#alert-dialog-body"),Ut=document.querySelector("#alert-dialog-link"),ya=document.querySelector("#alert-dialog-close");ut.addEventListener("click",()=>Ya());ha.addEventListener("click",()=>Dt());ya.addEventListener("click",()=>Mt());ee.forEach(t=>{t.addEventListener("click",()=>{o.dialogDisplayDirection=t.dataset.dialogDirection,o.dialogDisplayDirection==="auto"&&(o.dialogDisplayAutoPhase="nb"),$t()})});v.addEventListener("click",t=>{t.target===v&&Le()});R.addEventListener("click",t=>{t.target===R&&Dt()});N.addEventListener("click",t=>{t.target===N&&Mt()});v.addEventListener("close",()=>{wt(),Lt(),St(),bt(!1),o.isSyncingFromUrl||$e()});Jt.forEach(t=>{t.addEventListener("click",()=>{o.activeTab=t.dataset.tab,w()})});Qt.addEventListener("click",()=>{ae(o.theme==="dark"?"light":"dark"),w()});function F(){return X[o.activeSystemId]??X[P]}function ba(){return o.systemsById.get(o.activeSystemId)?.agencyId??X[P].agencyId}function Sa(){return`${zt}/vehicles-for-agency/${ba()}.json?key=${ft}`}function $(){return F().vehicleLabel??"Vehicle"}function $a(t){return/bus$/i.test(t)?`${t}es`:`${t}s`}function b(){return F().vehicleLabelPlural??$a($())}function Z(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function wa(){const t=window.localStorage.getItem(Zt);return t==="light"||t==="dark"?t:"dark"}function ae(t){o.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(Zt,t)}function Wt(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);o.compactLayout=n<=Ye}function J(){const a=window.getComputedStyle(I).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==o.compactLayout&&(o.compactLayout=a,w())}function z(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function it(t,e,a){return Math.max(e,Math.min(t,a))}function La(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function ne(){return new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit"}).format(new Date)}function Q(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),a=t%60;return e>0?`${e}m ${a}s`:`${a}s`}function Ta(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function st(t){const e=new Date;return e.setDate(e.getDate()+t),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(e)}function Ia(t){const[e="0",a="0",n="0"]=String(t).split(":");return Number(e)*3600+Number(a)*60+Number(n)}function E(t,e){if(!t||!e)return null;const[a,n,i]=t.split("-").map(Number),s=Ia(e),l=Math.floor(s/3600),r=Math.floor(s%3600/60),c=s%60;return new Date(a,n-1,i,l,r,c)}function K(t){const e=Math.max(0,Math.round(t/6e4)),a=Math.floor(e/60),n=e%60;return a&&n?`${a}h ${n}m`:a?`${a}h`:`${n}m`}function T(t){if(!t)return"";const[e="0",a="0"]=String(t).split(":"),n=Number(e),i=Number(a),s=(n%24+24)%24,l=s>=12?"PM":"AM";return`${s%12||12}:${String(i).padStart(2,"0")} ${l}`}function gt(t){const e=Ta(),a=t.serviceSpansByDate?.[e];return a?`Today ${T(a.start)} - ${T(a.end)}`:"Today service hours unavailable"}function ie(t){const e=new Date,a=st(-1),n=st(0),i=st(1),s=t.serviceSpansByDate?.[a],l=t.serviceSpansByDate?.[n],r=t.serviceSpansByDate?.[i],d=[s&&{kind:"yesterday",start:E(a,s.start),end:E(a,s.end),span:s},l&&{kind:"today",start:E(n,l.start),end:E(n,l.end),span:l}].filter(Boolean).find(p=>e>=p.start&&e<=p.end);if(d)return{tone:"active",headline:`Last trip ${T(d.span.end)}`,detail:`Ends in ${K(d.end.getTime()-e.getTime())}`,compact:`Ends in ${K(d.end.getTime()-e.getTime())}`};if(l){const p=E(n,l.start),u=E(n,l.end);if(e<p)return{tone:"upcoming",headline:`First trip ${T(l.start)}`,detail:`Starts in ${K(p.getTime()-e.getTime())}`,compact:`Starts in ${K(p.getTime()-e.getTime())}`};if(e>u)return{tone:"ended",headline:`Service ended ${T(l.end)}`,detail:r?`Next start ${T(r.start)}`:"No next service loaded",compact:r?`Next ${T(r.start)}`:"Ended"}}return r?{tone:"upcoming",headline:`Next first trip ${T(r.start)}`,detail:"No service remaining today",compact:`Next ${T(r.start)}`}:{tone:"muted",headline:"Service hours unavailable",detail:"Static schedule data missing for this date",compact:"Unavailable"}}function vt(t){const e=ie(t);return`
    <div class="service-reminder service-reminder-${e.tone}">
      <p class="service-reminder-headline">${e.headline}</p>
      <p class="service-reminder-detail">${e.detail}</p>
    </div>
  `}function Da(t){const e=et(t).map(({line:a})=>{const n=ie(a);return`${a.name}: ${n.compact}`}).slice(0,3);ca.textContent=e.join("  ·  ")||"Service summary unavailable"}function se(t){return String(t||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function oe(t){return String(t||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function j(t){return o.alerts.filter(e=>e.lineIds.includes(t))}function re(t,e){const a=j(e.id);if(!a.length)return[];const n=new Set(V(t,e));return n.add(t.id),a.filter(i=>i.stopIds.length>0&&i.stopIds.some(s=>n.has(s)))}function Ma(t){const e=new Set,a=[];for(const{station:n,line:i}of et(t))for(const s of re(n,i))e.has(s.id)||(e.add(s.id),a.push(s));return a}function le(t,e){return t.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${e}">
      <span class="line-alert-badge-count">${t.length}</span>
      <span class="line-alert-badge-copy">alert${t.length===1?"":"s"}</span>
    </button>
  `:""}function yt(t){return new Promise(e=>window.setTimeout(e,t))}function xa(){const t=Math.max(0,o.obaRateLimitStreak-1),e=Math.min(Nt,Ke*2**t),a=Math.round(e*(.15+Math.random()*.2));return Math.min(Nt,e+a)}async function Aa(){const t=o.obaCooldownUntil-Date.now();t>0&&await yt(t)}function Ca(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function ce(t,e){for(let a=0;a<=Rt;a+=1){await Aa();const n=await fetch(t,{cache:"no-store"});let i=null;try{i=await n.json()}catch{i=null}const s=n.status===429||Ca(i);if(n.ok&&!s)return o.obaRateLimitStreak=0,o.obaCooldownUntil=0,i;if(a===Rt||!s)throw i?.text?new Error(i.text):new Error(`${e} request failed with ${n.status}`);o.obaRateLimitStreak+=1;const l=Ge*2**a,r=Math.max(l,xa());o.obaCooldownUntil=Date.now()+r,await yt(r)}throw new Error(`${e} request failed`)}function ka(t){const e=[...t.stops].sort((u,m)=>m.sequence-u.sequence),a=48,n=44,i=28,s=88,l=122,r=n+i+(e.length-1)*a,c=new Map,d=e.map((u,m)=>{const f={...u,label:Z(u.name),y:n+m*a,index:m,isTerminal:m===0||m===e.length-1};c.set(u.id,m),c.set(`${t.agencyId}_${u.id}`,m);for(const h of t.stationAliases?.[u.id]??[])c.set(h,m),c.set(`${t.agencyId}_${h}`,m);return f});let p=0;for(let u=0;u<d.length;u+=1)d[u].cumulativeMinutes=p,p+=u<d.length-1?d[u].segmentMinutes:0;return{totalMinutes:p,height:r,labelX:l,stationGap:a,stationIndexByStopId:c,stations:d,trackX:s}}function Ea(t,e){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":"•"}function Ra(t){const e=t.tripStatus??{},a=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const n=e.nextStopTimeOffset??0,i=e.scheduleDeviation??0,s=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return a==="approaching"||s&&Math.abs(n)<=90?"ARR":i>=120?"DELAY":"OK"}function Na(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const a=Math.round(t/60);let n="status-late-minor";return t>600?n="status-late-severe":t>300&&(n="status-late-moderate"),{text:`+${a} min late`,colorClass:n}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function Pa(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function S(t){if(!o.fetchedAt)return t;const e=Math.max(0,Math.floor((Date.now()-new Date(o.fetchedAt).getTime())/1e3));return t-e}function H(t,e){return e<=90?"status-arriving":t.delayInfo.colorClass}function de(t){const e=S(t.nextOffset??0),a=S(t.closestOffset??0),n=t.delayInfo.text;return e<=15?[{text:"Arriving now",toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:e<=90?[{text:`Arriving in ${Q(e)}`,toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:a<0&&e>0?[{text:`Next stop in ${Q(e)}`,toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:[{text:Pa(t.serviceStatus),toneClass:H(t,e)},{text:n,toneClass:t.delayInfo.colorClass}]}function q(t){return t.map(e=>`
        <span class="status-chip ${e.toneClass}">
          ${e.text}
        </span>
      `).join("")}function ue(t){const e=S(t.nextOffset??0),a=S(t.closestOffset??0),n=t.upcomingLabel||t.toLabel||t.currentStopLabel,[i,s]=de(t);return e<=15?`${t.label} at ${n} ${q([i,s])}`:e<=90?`${t.label} at ${n} ${q([i,s])}`:a<0&&e>0?`${t.label} ${n} ${q([i,s])}`:`${t.label} to ${n} ${q([i,s])}`}function pe(t){return q(de(t))}function me(t,e){if(!e.length)return"";const a=[...e].sort((i,s)=>S(i.nextOffset??0)-S(s.nextOffset??0)).slice(0,8),n=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${t};">
      <div class="line-marquee-track">
        ${n.map(i=>`
          <span
            class="line-marquee-item ${H(i,S(i.nextOffset??0))}"
            data-vehicle-marquee="${i.id}"
          >
            <span class="line-marquee-token">${i.lineToken}</span>
            <span class="line-marquee-copy">${ue(i)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function Oa(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const n=a.dataset.vehicleStatus,i=tt().find(l=>l.id===n);if(!i)return;const s=S(i.nextOffset??0);a.innerHTML=pe(i),a.className=`train-list-status ${H(i,s)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const n=a.dataset.vehicleMarquee,i=tt().find(r=>r.id===n);if(!i)return;const s=S(i.nextOffset??0);a.className=`line-marquee-item ${H(i,s)}`;const l=a.querySelector(".line-marquee-copy");l&&(l.innerHTML=ue(i))})}function qa(t,e,a,n){const i=t.tripStatus?.activeTripId??t.tripId??"",s=n.get(i);if(!s||s.routeId!==e.routeKey)return null;const l=t.tripStatus?.closestStop,r=t.tripStatus?.nextStop,c=a.stationIndexByStopId.get(l),d=a.stationIndexByStopId.get(r);if(c==null&&d==null)return null;let p=c??d,u=d??c;if(p>u){const _e=p;p=u,u=_e}const m=a.stations[p],f=a.stations[u],h=t.tripStatus?.closestStopTimeOffset??0,D=t.tripStatus?.nextStopTimeOffset??0,g=s.directionId==="1"?"▲":s.directionId==="0"?"▼":Ea(c,d);let y=0;p!==u&&h<0&&D>0&&(y=it(Math.abs(h)/(Math.abs(h)+D),0,1));const x=m.y+(f.y-m.y)*y,A=p!==u?m.segmentMinutes:0,C=m.cumulativeMinutes+A*y,L=c??d??p,G=a.stations[L]??m,At=g==="▲",Ne=it(L+(At?1:-1),0,a.stations.length-1),Pe=c!=null&&d!=null&&c!==d?d:it(L+(At?-1:1),0,a.stations.length-1),Oe=a.stations[Ne]??G,qe=a.stations[Pe]??f,Ct=t.tripStatus?.scheduleDeviation??0,kt=t.tripStatus?.predicted??!1,Be=Na(Ct,kt);return{id:t.vehicleId,label:t.vehicleId.replace(/^\d+_/,""),directionSymbol:g,fromLabel:m.label,minutePosition:C,progress:y,serviceStatus:Ra(t),toLabel:f.label,y:x,currentLabel:m.label,nextLabel:f.label,previousLabel:Oe.label,currentStopLabel:G.label,upcomingLabel:qe.label,status:t.tripStatus?.status??"",closestStop:l,nextStop:r,closestOffset:h,nextOffset:D,scheduleDeviation:Ct,isPredicted:kt,delayInfo:Be,rawVehicle:t}}function he(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function tt(){return o.lines.flatMap(t=>(o.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function Ba(){return Object.values(X).filter(t=>o.systemsById.has(t.id)).map(t=>`
        <button
          class="tab-button ${t.id===o.activeSystemId?"is-active":""}"
          data-system-switch="${t.id}"
          type="button"
        >
          ${t.label}
        </button>
      `).join("")}function ot(){return!o.compactLayout||o.lines.length<2?"":`<section class="line-switcher">${o.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===o.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function fe(){return o.compactLayout?o.lines.filter(t=>t.id===o.activeLineId):o.lines}function U(t,e){const a=[...t].sort((s,l)=>s.minutePosition-l.minutePosition),n=[...e].sort((s,l)=>s.minutePosition-l.minutePosition),i=s=>s.slice(1).map((l,r)=>Math.round(l.minutePosition-s[r].minutePosition));return{nbGaps:i(a),sbGaps:i(n)}}function _a(t){if(!t.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const e=t.reduce((i,s)=>i+s,0)/t.length,a=Math.max(...t),n=Math.min(...t);return{avg:Math.round(e),max:a,min:n,spread:a-n,ratio:a/Math.max(n,1)}}function W(t,e){const a=_a(t);if(e<2||a.avg==null)return{health:"quiet",stats:a};let n="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?n="bunched":a.max>=12||a.spread>=6?n="uneven":a.avg>=18&&(n="sparse"),{health:n,stats:a}}function Vt(t,e,a){const{health:n,stats:i}=W(e,a),s=i.avg!=null?`~${i.avg} min`:"—",l=n==="healthy"?"Consistent spacing now":n==="uneven"?`Largest gap ${i.max} min`:n==="bunched"?"Short and long gaps at once":n==="sparse"?"Service spread is thin":a<2?`Too few ${b().toLowerCase()}`:"Low frequency";return`
    <div class="headway-health-card headway-health-card-${n}">
      <p class="headway-health-label">${t}</p>
      <p class="headway-health-value">${s}</p>
      <p class="headway-health-copy">${l}</p>
    </div>
  `}function ge(t){return t.reduce((e,a)=>{const n=Number(a.scheduleDeviation??0);return n<=60?e.onTime+=1:n<=300?e.minorLate+=1:e.severeLate+=1,e},{onTime:0,minorLate:0,severeLate:0})}function ve(t,e){return e?`${Math.round(t/e*100)}%`:"—"}function Fa(t,e){return Math.abs(t.length-e.length)<=1?{label:"Balanced",tone:"healthy"}:t.length>e.length?{label:"▲ Heavier",tone:"warn"}:{label:"▼ Heavier",tone:"warn"}}function Ha(t,e){return`
    <div class="delay-distribution">
      ${[["On time",t.onTime,"healthy"],["2-5 min late",t.minorLate,"warn"],["5+ min late",t.severeLate,"alert"]].map(([n,i,s])=>`
        <div class="delay-chip delay-chip-${s}">
          <p class="delay-chip-label">${n}</p>
          <p class="delay-chip-value">${i}</p>
          <p class="delay-chip-copy">${ve(i,e)}</p>
        </div>
      `).join("")}
    </div>
  `}function jt(t,e,a,n){if(!e.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${t}</p>
          <p class="flow-lane-copy">No live ${b().toLowerCase()}</p>
        </div>
      </div>
    `;const i=[...e].sort((l,r)=>l.minutePosition-r.minutePosition),s=i.map(l=>{const r=a.totalMinutes>0?l.minutePosition/a.totalMinutes:0;return Math.max(0,Math.min(100,r*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${t}</p>
        <p class="flow-lane-copy">${i.length} live ${i.length===1?$().toLowerCase():b().toLowerCase()}</p>
      </div>
      <div class="flow-track" style="--line-color:${n};">
        ${s.map((l,r)=>`
          <span
            class="flow-vehicle"
            style="left:${l}%; --line-color:${n};"
            title="${i[r].label} · ${he(i[r])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function ye(t,e,a,n){const i=[],{stats:s}=W(U(e,[]).nbGaps,e.length),{stats:l}=W(U([],a).sbGaps,a.length),r=[...e,...a].filter(d=>Number(d.scheduleDeviation??0)>300),c=Math.abs(e.length-a.length);return s.max!=null&&s.max>=12&&i.push({tone:"alert",copy:`Direction ▲ has a ${s.max} min service hole right now.`}),l.max!=null&&l.max>=12&&i.push({tone:"alert",copy:`Direction ▼ has a ${l.max} min service hole right now.`}),c>=2&&i.push({tone:"warn",copy:e.length>a.length?`Vehicle distribution is tilted toward ▲ by ${c}.`:`Vehicle distribution is tilted toward ▼ by ${c}.`}),r.length&&i.push({tone:"warn",copy:`${r.length} ${r.length===1?$().toLowerCase():b().toLowerCase()} are running 5+ min late.`}),n.length&&i.push({tone:"info",copy:`${n.length} active alert${n.length===1?"":"s"} affecting ${t.name}.`}),i.length||i.push({tone:"healthy",copy:"Spacing and punctuality look stable right now."}),i.slice(0,4)}function pt(t){return t.map(e=>{const a=o.layouts.get(e.id),n=o.vehiclesByLine.get(e.id)??[],i=n.filter(r=>r.directionSymbol==="▲"),s=n.filter(r=>r.directionSymbol==="▼"),l=j(e.id);return{line:e,layout:a,vehicles:n,nb:i,sb:s,lineAlerts:l,exceptions:ye(e,i,s,l)}})}function be(t){const e=t.length,a=t.reduce((g,y)=>g+y.vehicles.length,0),n=t.reduce((g,y)=>g+y.lineAlerts.length,0),i=t.filter(g=>g.lineAlerts.length>0).length,s=t.flatMap(g=>g.vehicles),l=ge(s),r=new Set(t.filter(g=>g.vehicles.some(y=>Number(y.scheduleDeviation??0)>300)).map(g=>g.line.id)),c=new Set(t.filter(g=>{const{nbGaps:y,sbGaps:x}=U(g.nb,g.sb),A=W(y,g.nb.length).health,C=W(x,g.sb.length).health;return[A,C].some(L=>L==="uneven"||L==="bunched"||L==="sparse")}).map(g=>g.line.id)),d=new Set([...r,...c]).size,p=Math.max(0,e-d),u=a?Math.round(l.onTime/a*100):null,m=t.map(g=>{const{nbGaps:y,sbGaps:x}=U(g.nb,g.sb),A=[...y,...x].length?Math.max(...y,...x):0,C=g.vehicles.filter(G=>Number(G.scheduleDeviation??0)>300).length,L=g.lineAlerts.length*5+C*3+Math.max(0,A-10);return{line:g.line,score:L,worstGap:A,severeLateCount:C,alertCount:g.lineAlerts.length}}).sort((g,y)=>y.score-g.score||y.worstGap-g.worstGap);let f={tone:"healthy",copy:"No major active issues right now."};const h=m[0]??null;h?.alertCount?f={tone:"info",copy:`${h.line.name} has ${h.alertCount} active alert${h.alertCount===1?"":"s"}.`}:h?.worstGap>=12?f={tone:"alert",copy:`Largest live gap: ${h.worstGap} min on ${h.line.name}.`}:h?.severeLateCount&&(f={tone:"warn",copy:`${h.line.name} has ${h.severeLateCount} ${h.severeLateCount===1?$().toLowerCase():b().toLowerCase()} running 5+ min late.`});const D=Math.max(0,Math.min(100,100-n*8-r.size*10-c.size*8-Math.max(0,100-(u??100))/2));return{totalLines:e,totalVehicles:a,totalAlerts:n,impactedLines:i,delayedLineIds:r,unevenLineIds:c,attentionLineCount:d,healthyLineCount:p,onTimeRate:u,rankedLines:m,topIssue:f,healthScore:Math.round(D)}}function rt(t,e,{suffix:a="",invert:n=!1}={}){if(t==null||e==null||t===e)return"Flat vs last snapshot";const i=t-e,s=n?i<0:i>0,l=i>0?"↑":"↓";return`${s?"Improving":"Worse"} ${l} ${Math.abs(i)}${a}`}function Ua(t){const e=be(t),a=o.systemSnapshots.get(o.activeSystemId)?.previous??null,n=[];e.totalAlerts>0&&n.push({tone:"info",copy:`${e.totalAlerts} active alert${e.totalAlerts===1?"":"s"} across ${e.impactedLines} line${e.impactedLines===1?"":"s"}.`}),e.delayedLineIds.size>0&&n.push({tone:"warn",copy:`${e.delayedLineIds.size} line${e.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),e.unevenLineIds.size>0&&n.push({tone:"alert",copy:`${e.unevenLineIds.size} line${e.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),n.length||n.push({tone:"healthy",copy:"System looks stable right now with no major active issues."});const i=[{label:"Health Score",value:e.healthScore,delta:rt(e.healthScore,a?.healthScore)},{label:"On-Time Rate",value:e.onTimeRate!=null?`${e.onTimeRate}%`:"—",delta:rt(e.onTimeRate,a?.onTimeRate,{suffix:"%"})},{label:"Attention Lines",value:e.attentionLineCount,delta:rt(e.attentionLineCount,a?.attentionLineCount,{invert:!0})}];return`
    <article class="panel-card panel-card-wide system-summary-card">
      <header class="panel-header">
        <div class="system-summary-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:var(--accent-strong);">${F().label[0]}</span>
            <div class="line-title-copy">
              <h2>${F().label} Summary</h2>
              <p>${e.totalLines} line${e.totalLines===1?"":"s"} in system · Updated ${ne()}</p>
            </div>
          </div>
          <div class="system-score-card">
            <p class="metric-chip-label">Health Score</p>
            <p class="system-score-value">${e.healthScore}</p>
            <p class="system-score-copy">${e.healthScore>=85?"Stable":e.healthScore>=70?"Watch":"Stressed"}</p>
          </div>
        </div>
      </header>
      <div class="system-summary-hero">
        <div class="insight-exception insight-exception-${e.topIssue.tone}">
          <p>${e.topIssue.copy}</p>
        </div>
        <div class="system-trend-strip">
          ${i.map(s=>`
            <div class="metric-chip system-trend-chip">
              <p class="metric-chip-label">${s.label}</p>
              <p class="metric-chip-value">${s.value}</p>
              <p class="system-trend-copy">${s.delta}</p>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="metric-strip system-summary-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">Healthy Lines</p>
          <p class="metric-chip-value">${e.healthyLineCount}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">Live ${b()}</p>
          <p class="metric-chip-value">${e.totalVehicles}</p>
        </div>
        <div class="metric-chip ${e.totalAlerts?"metric-chip-warn":"metric-chip-healthy"}">
          <p class="metric-chip-label">Alerts</p>
          <p class="metric-chip-value">${e.totalAlerts}</p>
        </div>
        <div class="metric-chip ${e.attentionLineCount?"metric-chip-warn":"metric-chip-healthy"}">
          <p class="metric-chip-label">Lines Needing Attention</p>
          <p class="metric-chip-value">${e.attentionLineCount}</p>
        </div>
      </div>
      <div class="system-ranking">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">Attention Ranking</p>
          <p class="headway-chart-copy">${o.error?"Realtime degraded, using last successful snapshot":"Derived from the current live snapshot only"}</p>
        </div>
        <div class="system-ranking-list">
          ${e.rankedLines.slice(0,3).map(({line:s,score:l,worstGap:r,alertCount:c,severeLateCount:d})=>`
            <div class="system-ranking-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${s.color};">${s.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${s.name}</p>
                  <p class="headway-chart-copy">Score ${l}${r?` · gap ${r} min`:""}${c?` · ${c} alert${c===1?"":"s"}`:""}${d?` · ${d} severe late`:""}</p>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">System Status</p>
          <p class="headway-chart-copy">${o.error?"Realtime degraded, using last successful snapshot":"Derived from the current live snapshot only"}</p>
        </div>
        ${n.map(s=>`
          <div class="insight-exception insight-exception-${s.tone}">
            <p>${s.copy}</p>
          </div>
        `).join("")}
      </div>
    </article>
  `}function Wa(t){const e=t.flatMap(l=>l.exceptions.map(r=>({tone:r.tone,copy:`${l.line.name}: ${r.copy}`,lineColor:l.line.color})));if(!e.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="Current insights summary">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">No active issues right now.</span>
        </div>
      </section>
    `;const a=Va(),n=Math.ceil(e.length/a),i=o.insightsTickerIndex%n;return`
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
  `}function Va(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);return n>=1680?3:n>=980?2:1}function ja(t,e,a,n,i){const s=a.length+n.length;if(!s)return"";const{nbGaps:l,sbGaps:r}=U(a,n),c=[...a,...n],d=ge(c),p=[...l,...r].length?Math.max(...l,...r):null,u=Fa(a,n),m=ye(t,a,n,i),f=new Set(i.flatMap(h=>h.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">In Service</p>
          <p class="metric-chip-value">${s}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">On-Time Rate</p>
          <p class="metric-chip-value">${ve(d.onTime,s)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">Worst Gap</p>
          <p class="metric-chip-value">${p!=null?`${p} min`:"—"}</p>
        </div>
        <div class="metric-chip metric-chip-${u.tone}">
          <p class="metric-chip-label">Balance</p>
          <p class="metric-chip-value">${u.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${Vt("Direction ▲",l,a.length)}
        ${Vt("Direction ▼",r,n.length)}
      </div>
      ${Ha(d,s)}
      <div class="flow-grid">
        ${jt("Direction ▲ Flow",a,e,t.color)}
        ${jt("Direction ▼ Flow",n,e,t.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">Now</p>
          <p class="headway-chart-copy">${i.length?`${i.length} active alert${i.length===1?"":"s"}${f?` · ${f} impacted stops`:""}`:"No active alerts on this line"}</p>
        </div>
        ${m.map(h=>`
          <div class="insight-exception insight-exception-${h.tone}">
            <p>${h.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function Se(t,e=!1){const a=Date.now(),n=s=>{const l=s.arrivalTime,r=Math.floor((l-a)/1e3),c=Q(r),d=Ie(s.arrivalTime,s.scheduleDeviation??0),p=Tt(d);let u="";if(s.distanceFromStop>0){const m=s.distanceFromStop>=1e3?`${(s.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(s.distanceFromStop)}m`,f=s.numberOfStopsAway===1?"1 stop away":`${s.numberOfStopsAway} stops away`;u=` • ${m} • ${f}`}return`
      <div class="arrival-item" data-arrival-time="${s.arrivalTime}" data-schedule-deviation="${s.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${s.lineColor};">${s.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${s.lineName} ${$()} ${s.vehicleId}</span>
            <span class="arrival-destination">To ${s.destination}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${p}">${d}</span>
          <span class="arrival-time"><span class="arrival-countdown">${c}</span><span class="arrival-precision">${u}</span></span>
        </span>
      </div>
    `};if(e){Bt.innerHTML="",_t.innerHTML="",B.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',_.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',mt();return}const i=(s,l,r)=>{if(!s.length){l.innerHTML="",r.innerHTML=`<div class="arrival-item muted">No upcoming ${b().toLowerCase()}</div>`;return}const c=o.dialogDisplayMode?s.slice(0,2):[],d=o.dialogDisplayMode?s.slice(2):s;l.innerHTML=c.map(n).join(""),r.innerHTML=d.length?d.map(n).join(""):o.dialogDisplayMode?`<div class="arrival-item muted">No additional ${b().toLowerCase()}</div>`:""};i(t.nb,Bt,B),i(t.sb,_t,_),mt()}function V(t,e){const a=new Set(e.stationAliases?.[t.id]??[]);a.add(t.id);const n=new Set;for(const s of a){const l=s.startsWith(`${e.agencyId}_`)?s:`${e.agencyId}_${s}`;n.add(l)}const i=t.id.replace(/-T\d+$/,"");return n.add(i.startsWith(`${e.agencyId}_`)?i:`${e.agencyId}_${i}`),[...n]}function et(t){const e=o.lines.map(a=>{const n=a.stops.find(i=>i.id===t.id);return n?{line:a,station:n}:null}).filter(Boolean);return e.length>0?e:o.lines.map(a=>{const n=a.stops.find(i=>i.name===t.name);return n?{line:a,station:n}:null}).filter(Boolean)}function Ga(t){if(!t)return null;const e=t.trim().toLowerCase();for(const a of o.lines)for(const n of a.stops){const i=new Set([n.id,`${a.agencyId}_${n.id}`,n.name,Z(n.name),z(n.name),z(Z(n.name))]);for(const s of a.stationAliases?.[n.id]??[])i.add(s),i.add(`${a.agencyId}_${s}`),i.add(z(s));if([...i].some(s=>String(s).toLowerCase()===e))return n}return null}function Ka(t){const e=new URL(window.location.href);e.searchParams.set("station",z(t.name)),window.history.pushState({},"",e)}function $e(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function Gt(t){const e=new URL(window.location.href);t===P?e.searchParams.delete("system"):e.searchParams.set("system",t),window.history.pushState({},"",e)}function we(){const e=new URL(window.location.href).searchParams.get("system");return e&&o.systemsById.has(e)?e:P}function bt(t){o.dialogDisplayMode=t,v.classList.toggle("is-display-mode",t),ut.textContent=t?"Exit":"Board",ut.setAttribute("aria-label",t?"Exit display mode":"Toggle display mode"),o.dialogDisplayDirection="both",o.dialogDisplayAutoPhase="nb",$t(),v.open&&o.currentDialogStation&&It(o.currentDialogStation).catch(console.error),at(),mt()}function Ya(){bt(!o.dialogDisplayMode)}function St(){o.dialogDisplayDirectionTimer&&(window.clearInterval(o.dialogDisplayDirectionTimer),o.dialogDisplayDirectionTimer=0)}function $t(){St();const t=o.dialogDisplayDirection,e=t==="auto"?o.dialogDisplayAutoPhase:t;ee.forEach(a=>{a.classList.toggle("is-active",a.dataset.dialogDirection===t)}),v.classList.toggle("show-nb-only",o.dialogDisplayMode&&e==="nb"),v.classList.toggle("show-sb-only",o.dialogDisplayMode&&e==="sb"),o.dialogDisplayMode&&t==="auto"&&(o.dialogDisplayDirectionTimer=window.setInterval(()=>{o.dialogDisplayAutoPhase=o.dialogDisplayAutoPhase==="nb"?"sb":"nb",$t()},Je))}function wt(){o.dialogRefreshTimer&&(window.clearTimeout(o.dialogRefreshTimer),o.dialogRefreshTimer=0)}function Lt(){o.dialogDisplayTimer&&(window.clearInterval(o.dialogDisplayTimer),o.dialogDisplayTimer=0)}function lt(t,e){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(t.style.transform="translateY(0)",!o.dialogDisplayMode||a.length<=3)return;const n=Number.parseFloat(window.getComputedStyle(t).rowGap||"0")||0,i=a[0].getBoundingClientRect().height+n,s=Math.max(0,a.length-3),l=Math.min(o.dialogDisplayIndexes[e],s);t.style.transform=`translateY(-${l*i}px)`}function mt(){Lt(),o.dialogDisplayIndexes={nb:0,sb:0},lt(B,"nb"),lt(_,"sb"),o.dialogDisplayMode&&(o.dialogDisplayTimer=window.setInterval(()=>{for(const[t,e]of[["nb",B],["sb",_]]){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const n=Math.max(0,a.length-3);o.dialogDisplayIndexes[t]=o.dialogDisplayIndexes[t]>=n?0:o.dialogDisplayIndexes[t]+1,lt(e,t)}},Ze))}function za(){if(!v.open)return;v.querySelectorAll(".arrival-item[data-arrival-time]").forEach(e=>{const a=Number(e.dataset.arrivalTime),n=Number(e.dataset.scheduleDeviation||0),i=e.querySelector(".arrival-countdown"),s=e.querySelector(".arrival-status");if(!i||!s)return;i.textContent=Q(Math.floor((a-Date.now())/1e3));const l=Ie(a,n),r=Tt(l);s.textContent=l,s.className=`arrival-status arrival-status-${r}`})}function Xa(){if(wt(),!o.currentDialogStation)return;const t=()=>{o.dialogRefreshTimer=window.setTimeout(async()=>{!v.open||!o.currentDialogStation||(await It(o.currentDialogStation).catch(console.error),t())},Xe)};t()}function Le(){o.currentDialogStationId="",o.currentDialogStation=null,v.open?v.close():(wt(),Lt(),St(),bt(!1),$e())}async function Kt(){const t=we();t!==o.activeSystemId&&await Re(t,{updateUrl:!1,preserveDialog:!1});const e=new URL(window.location.href).searchParams.get("station"),a=Ga(e);o.isSyncingFromUrl=!0;try{if(!a){o.currentDialogStationId="",v.open&&v.close();return}if(o.activeTab="map",w(),o.currentDialogStationId===a.id&&v.open)return;await Ae(a,!1)}finally{o.isSyncingFromUrl=!1}}function Za(t,e){const a=e.directionLookup?.[t.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const n=t.tripHeadsign??"",i=n.toLowerCase();return e.nbTerminusPrefix&&i.startsWith(e.nbTerminusPrefix)?"nb":e.sbTerminusPrefix&&i.startsWith(e.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function Te(t){return t.routeKey??`${t.agencyId}_${t.id}`}function Ja(t){const e=t.tripHeadsign?.trim();return e?Z(e.replace(/^to\s+/i,"")):"Terminal"}function Ie(t,e){return Math.floor((t-Date.now())/1e3)<=90?"ARR":e>=120?"DELAY":"ON TIME"}function Tt(t){return t==="DELAY"?"delay":t==="ARR"?"arr":"ok"}async function Qa(t){const e=`${zt}/arrivals-and-departures-for-stop/${t}.json?key=${ft}&minutesAfter=120`,a=await ce(e,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${t}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function De(t){const e=[...new Set(t)],a=[],n=[];for(let i=0;i<e.length;i+=nt){const s=e.slice(i,i+nt),l=await Promise.allSettled(s.map(r=>Qa(r)));a.push(...l),Pt>0&&i+nt<e.length&&await yt(Pt)}for(const i of a)i.status==="fulfilled"&&n.push(...i.value);return n}function Me(t,e,a=null){const n=Date.now(),i=new Set,s={nb:[],sb:[]},l=a?new Set(a):null;for(const r of t){if(r.routeId!==Te(e)||l&&!l.has(r.stopId))continue;const c=r.predictedArrivalTime||r.scheduledArrivalTime;if(!c||c<=n)continue;const d=Za(r,e);if(!d)continue;const p=`${r.tripId}:${r.stopId}:${c}`;i.has(p)||(i.add(p),s[d].push({vehicleId:(r.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:c,destination:Ja(r),scheduleDeviation:r.scheduleDeviation??0,tripId:r.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0],distanceFromStop:r.distanceFromStop??0,numberOfStopsAway:r.numberOfStopsAway??0}))}return s.nb.sort((r,c)=>r.arrivalTime-c.arrivalTime),s.sb.sort((r,c)=>r.arrivalTime-c.arrivalTime),s.nb=s.nb.slice(0,4),s.sb=s.sb.slice(0,4),s}async function tn(t,e,a=null){const n=`${o.activeSystemId}:${e.id}:${t.id}`,i=o.arrivalsCache.get(n);if(i&&Date.now()-i.fetchedAt<je)return i.value;const s=V(t,e),l=a??await De(s),r=Me(l,e,s);return o.arrivalsCache.set(n,{fetchedAt:Date.now(),value:r}),r}function en(t){const e={nb:[],sb:[]};for(const a of t)e.nb.push(...a.nb),e.sb.push(...a.sb);return e.nb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e.sb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e}function xe(t){const e=Ma(t);if(!e.length){O.innerHTML="",O.hidden=!0;return}O.hidden=!1,O.innerHTML=`
    <div class="station-alerts">
      ${e.map((a,n)=>`
        <button class="station-alert-pill" data-alert-idx="${n}" type="button">
          <span class="station-alert-pill-meta">${oe(a.severity)} · ${se(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||"Service alert"}</span>
        </button>
      `).join("")}
    </div>
  `,O.querySelectorAll(".station-alert-pill").forEach(a=>{const n=e[Number(a.dataset.alertIdx)];n&&a.addEventListener("click",()=>{const i=o.lines.find(s=>n.lineIds.includes(s.id));i&&Ce(i)})})}async function Ae(t,e=!0){on(t.name),Da(t),o.currentDialogStationId=t.id,o.currentDialogStation=t,xe(t),ht([],!0),Se({nb:[],sb:[]},!0),e&&Ka(t),v.showModal(),at(),Xa(),await It(t)}async function It(t){const e=o.activeDialogRequest+1;o.activeDialogRequest=e;try{const a=et(t),n=dn(t),i=a.flatMap(({station:c,line:d})=>V(c,d)),s=n.flatMap(({stop:c,line:d})=>V(c,d)),l=await De([...i,...s]),r=await Promise.all(a.map(({station:c,line:d})=>tn(c,d,l)));if(o.activeDialogRequest!==e||!v.open)return;ht(un(n,l)),xe(t),Se(en(r))}catch(a){if(o.activeDialogRequest!==e||!v.open)return;ht([]),B.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,_.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function an(t){const e=o.layouts.get(t.id),a=o.vehiclesByLine.get(t.id)??[],n=j(t.id),i=e.stations.map((r,c)=>{const d=e.stations[c-1],p=c>0?d.segmentMinutes:"",m=re(r,t).length>0,f=r.isTerminal?15:10;return`
        <g transform="translate(0, ${r.y})" class="station-group${m?" has-alert":""}" data-stop-id="${r.id}" style="cursor: pointer;">
          ${c>0?`<text x="0" y="-14" class="segment-time">${p}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${r.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          ${m?`<circle cx="${e.trackX+f}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),s=a.map((r,c)=>`
        <g transform="translate(${e.trackX}, ${r.y+(c%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${c*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),l=$();return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div class="line-title-copy">
            <div class="line-title-row">
              <h2>${t.name}</h2>
              ${le(n,t.id)}
            </div>
            <p>${a.length} live ${a.length===1?l.toLowerCase():b().toLowerCase()}</p>
            <p>${gt(t)}</p>
          </div>
        </div>
        ${vt(t)}
      </header>
      ${me(t.color,a.map(r=>({...r,lineToken:t.name[0]})))}
      <svg viewBox="0 0 460 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${i}
        ${s}
      </svg>
    </article>
  `}function nn(){const t=tt().sort((l,r)=>l.minutePosition-r.minutePosition),e=$(),a=b(),n=a.toLowerCase();return t.length?(o.compactLayout?o.lines.filter(l=>l.id===o.activeLineId):o.lines).map(l=>{const r=t.filter(m=>m.lineId===l.id),c=j(l.id),d=r.filter(m=>m.directionSymbol==="▲"),p=r.filter(m=>m.directionSymbol==="▼"),u=(m,f)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${m}</p>
          ${f.length?f.map(h=>`
                      <article class="train-list-item" data-train-id="${h.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${h.lineColor};">${h.lineToken}</span>
                          <div>
                            <p class="train-list-title">${h.lineName} ${e} ${h.label}</p>
                            <p class="train-list-subtitle">${he(h)}</p>
                            <p class="train-list-status ${H(h,S(h.nextOffset??0))}" data-vehicle-status="${h.id}">${pe(h)}</p>
                          </div>
                        </div>
                      </article>
                    `).join(""):`<p class="train-readout muted">No ${b().toLowerCase()}</p>`}
        </div>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${l.color};">${l.name[0]}</span>
              <div class="line-title-copy">
                <div class="line-title-row">
                  <h2>${l.name}</h2>
                  ${le(c,l.id)}
                </div>
                <p>${r.length} ${r.length===1?e.toLowerCase():b().toLowerCase()} in service · ${gt(l)}</p>
              </div>
            </div>
            ${vt(l)}
          </header>
          ${me(l.color,r)}
          <div class="line-readout line-readout-grid train-columns">
            ${u("NB",d)}
            ${u("SB",p)}
          </div>
        </article>
      `}).join(""):`
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>Active ${a}</h2>
          <p>No live ${n}</p>
        </article>
      </section>
    `}function sn(t){return new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function on(t){te.textContent=t,la.textContent=t,at()}function at(){const t=oa;if(!t||!ra)return;const a=o.dialogDisplayMode&&v.open&&te.scrollWidth>t.clientWidth;t.classList.toggle("is-marquee",a)}function rn(t,e,a,n){const s=(a-t)*Math.PI/180,l=(n-e)*Math.PI/180,r=Math.sin(s/2)**2+Math.cos(t*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(l/2)**2;return 2*6371*Math.asin(Math.sqrt(r))}function ln(t){return Math.max(1,Math.round(t/Qe*60))}function cn(t){return t>=1?`${t.toFixed(1)} km walk`:`${Math.round(t*1e3)} m walk`}function dn(t){if(!t)return[];const e=et(t),a=new Set(e.map(({line:i,station:s})=>`${i.agencyId}:${i.id}:${s.id}`)),n=new Map;for(const i of o.systemsById.values())for(const s of i.lines??[])for(const l of s.stops??[]){if(a.has(`${s.agencyId}:${s.id}:${l.id}`))continue;const r=rn(t.lat,t.lon,l.lat,l.lon);if(r>ta)continue;const c=`${i.id}:${s.id}`,d=n.get(c);(!d||r<d.distanceKm)&&n.set(c,{systemId:i.id,systemName:i.name,line:s,stop:l,distanceKm:r,walkMinutes:ln(r)})}return[...n.values()].sort((i,s)=>i.distanceKm-s.distanceKm||i.line.name.localeCompare(s.line.name)).slice(0,Xt*2)}function ht(t,e=!1){if(e){k.hidden=!1,k.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">Transfers</h4>
          <p class="transfer-panel-copy">Checking nearby connections...</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">Loading transfer recommendations...</div>
        </div>
      </div>
    `;return}if(!t.length){k.hidden=!0,k.innerHTML="";return}k.hidden=!1,k.innerHTML=`
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
                    <p class="transfer-card-meta">${cn(a.distanceKm)}${a.arrival?` • To ${a.arrival.destination}`:""}</p>
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
  `}function un(t,e){const a=Date.now(),n=[];for(const i of t){const s=V(i.stop,i.line),l=Me(e,i.line,s),r=[...l.nb,...l.sb].sort((m,f)=>m.arrivalTime-f.arrivalTime);if(!r.length)continue;const c=a+i.walkMinutes*6e4+ea,d=r.find(m=>m.arrivalTime>=c)??r[0],p=d.arrivalTime-a-i.walkMinutes*6e4,u=Math.max(0,Math.round(p/6e4));n.push({...i,arrival:d,boardAt:d.arrivalTime,badge:p<=0?"Leave now":u<=1?"Board in ~1 min":`Board in ~${u} min`,tone:u<=2?"hot":u<=8?"good":"calm",timeText:sn(d.arrivalTime)})}return n.sort((i,s)=>i.boardAt-s.boardAt||i.distanceKm-s.distanceKm).slice(0,Xt)}function pn(){const t=fe(),e=pt(o.lines),a=$(),n=pt(t);return`
    ${Wa(n)}
    ${Ua(e)}
    ${n.map(({line:i,layout:s,vehicles:l,nb:r,sb:c,lineAlerts:d})=>{const p=ja(i,s,r,c,d);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header line-card-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${i.color};">${i.name[0]}</span>
              <div class="line-title-copy">
                <h2>${i.name}</h2>
                <p>${l.length} live ${l.length===1?$().toLowerCase():b().toLowerCase()} · ${gt(i)}</p>
              </div>
            </div>
            ${vt(i)}
          </header>
          ${p||`<p class="train-readout muted">Waiting for live ${a.toLowerCase()} data…</p>`}
        </article>
      `}).join("")}
  `}function mn(){document.querySelectorAll("[data-system-switch]").forEach(e=>{e.addEventListener("click",async()=>{await Re(e.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function ct(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{o.activeLineId=e.dataset.lineSwitch,w()})})}function Dt(){o.currentTrainId="",R.open&&R.close()}function Mt(){N.open&&N.close()}function Ce(t){const e=j(t.id);fa.textContent=`${t.name} Alerts`,ga.textContent=`${e.length} active alert${e.length===1?"":"s"}`,va.textContent=t.name,Ht.textContent="",Ht.innerHTML=e.length?e.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${oe(a.severity)} • ${se(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||"Service alert"}</p>
              <p class="alert-dialog-item-copy">${a.description||"No additional alert details available."}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">Read official alert</a></p>`:""}
            </article>
          `).join(""):'<p class="alert-dialog-item-copy">No active alerts.</p>',Ut.hidden=!0,Ut.removeAttribute("href"),N.open||N.showModal()}function Yt(){document.querySelectorAll("[data-alert-line-id]").forEach(e=>{e.addEventListener("click",()=>{const a=o.lines.find(n=>n.id===e.dataset.alertLineId);a&&Ce(a)})})}function hn(t){const e=t.fromLabel!==t.toLabel&&t.progress>0&&t.progress<1,a=e?t.fromLabel:t.previousLabel,n=e?`${t.fromLabel} -> ${t.toLabel}`:t.currentStopLabel,i=e?"Between":"Now",s=e?t.toLabel:t.upcomingLabel,l=e?t.progress:.5;ua.textContent=`${t.lineName} ${$()} ${t.label}`,pa.textContent=t.directionSymbol==="▲"?"Direction A movement":"Direction B movement",Ft.className=`train-detail-status train-list-status-${Tt(t.serviceStatus)}`,Ft.textContent=t.serviceStatus,ma.innerHTML=`
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
  `,R.open||R.showModal()}function fn(){document.querySelectorAll("[data-train-id]").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.trainId,n=tt().find(i=>i.id===a);n&&(o.currentTrainId=a,hn(n))})})}function gn(){o.lines.forEach(t=>{const e=o.layouts.get(t.id),a=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.stopId,l=e.stations.find(r=>r.id===s);l&&Ae(l)})})})}function w(){const t=F();if(Qt.textContent=o.theme==="dark"?"Light":"Dark",na.textContent=t.kicker,ia.textContent=t.title,Ot.hidden=o.systemsById.size<2,Ot.innerHTML=Ba(),ke(),Jt.forEach(e=>e.classList.toggle("is-active",e.dataset.tab===o.activeTab)),document.querySelector("#tab-trains").textContent=b(),mn(),o.activeTab==="map"){I.className="board";const e=fe();I.innerHTML=`${ot()}${e.map(an).join("")}`,ct(),Yt(),gn(),queueMicrotask(J);return}if(o.activeTab==="trains"){I.className="board",I.innerHTML=`${ot()}${nn()}`,ct(),Yt(),fn(),queueMicrotask(J);return}o.activeTab==="insights"&&(I.className="board",I.innerHTML=`${ot()}${pn()}`,ct())}function vn(){window.clearInterval(o.insightsTickerTimer),o.insightsTickerTimer=0}function yn(){vn(),o.insightsTickerTimer=window.setInterval(()=>{o.insightsTickerIndex+=1,o.activeTab==="insights"&&w()},5e3)}function ke(){Y.textContent=o.error?"HOLD":"SYNC",Y.classList.toggle("status-pill-error",!!o.error),sa.textContent=`Now ${ne()}`,dt.textContent=o.error?"Using last successful snapshot":La(o.fetchedAt),qt.textContent=Y.textContent,qt.classList.toggle("status-pill-error",!!o.error),da.textContent=dt.textContent}function bn(){window.clearTimeout(o.liveRefreshTimer),o.liveRefreshTimer=0}function Sn(){bn();const t=()=>{o.liveRefreshTimer=window.setTimeout(async()=>{await xt(),t()},ze)};t()}function Ee(t){const e=o.systemsById.has(t)?t:P,a=o.systemsById.get(e);o.activeSystemId=e,o.lines=a?.lines??[],o.layouts=o.layoutsBySystem.get(e)??new Map,o.lines.some(n=>n.id===o.activeLineId)||(o.activeLineId=o.lines[0]?.id??""),o.vehiclesByLine=new Map,o.rawVehicles=[],o.arrivalsCache.clear(),o.alerts=[],o.error="",o.fetchedAt="",o.insightsTickerIndex=0}async function Re(t,{updateUrl:e=!0,preserveDialog:a=!1}={}){if(!o.systemsById.has(t)||o.activeSystemId===t){e&&Gt(o.activeSystemId);return}Ee(t),a||Le(),Dt(),Mt(),w(),e&&Gt(t),await xt()}async function $n(){const a=(await(await fetch(Ve,{cache:"no-store"})).json()).systems??[];o.systemsById=new Map(a.map(n=>[n.id,n])),o.layoutsBySystem=new Map(a.map(n=>[n.id,new Map(n.lines.map(i=>[i.id,ka(i)]))])),Ee(we())}function wn(t){const e=[...new Set((t.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=o.lines.filter(n=>e.includes(Te(n))).map(n=>n.id);return a.length?{id:t.id,effect:t.reason??"SERVICE ALERT",severity:t.severity??"INFO",title:t.summary?.value??"Service alert",description:t.description?.value??"",url:t.url?.value??"",lineIds:a,stopIds:[...new Set((t.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function xt(){try{const t=await ce(Sa(),"Realtime");o.error="",o.fetchedAt=new Date().toISOString(),o.rawVehicles=t.data.list??[],o.alerts=(t.data.references?.situations??[]).map(wn).filter(Boolean);const e=new Map((t.data.references?.trips??[]).map(i=>[i.id,i]));for(const i of o.lines){const s=o.layouts.get(i.id),l=o.rawVehicles.map(r=>qa(r,i,s,e)).filter(Boolean);o.vehiclesByLine.set(i.id,l)}const a=be(pt(o.lines)),n=o.systemSnapshots.get(o.activeSystemId);o.systemSnapshots.set(o.activeSystemId,{previous:n?.current??null,current:a})}catch(t){o.error="Realtime offline",console.error(t)}w()}async function Ln(){ae(wa()),Wt(),await $n(),w(),await xt(),await Kt(),window.addEventListener("popstate",()=>{Kt().catch(console.error)});const t=()=>{const a=o.compactLayout;if(Wt(),at(),a!==o.compactLayout){w();return}J()};window.addEventListener("resize",t),window.visualViewport?.addEventListener("resize",t),new ResizeObserver(()=>{J()}).observe(I),Sn(),yn(),window.setInterval(()=>{ke(),za(),Oa()},1e3)}Ln().catch(t=>{Y.textContent="FAIL",dt.textContent=t.message});
