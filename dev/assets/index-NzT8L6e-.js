(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const Ue="modulepreload",We=function(t){return"/link/dev/"+t},Rt={},Ve=function(e,a,n){let i=Promise.resolve();if(a&&a.length>0){let u=function(p){return Promise.all(p.map(d=>Promise.resolve(d).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};var l=u;document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=r?.nonce||r?.getAttribute("nonce");i=u(a.map(p=>{if(p=We(p),p in Rt)return;Rt[p]=!0;const d=p.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${m}`))return;const h=document.createElement("link");if(h.rel=d?"stylesheet":Ue,d||(h.as="script"),h.crossOrigin="",h.href=p,c&&h.setAttribute("nonce",c),document.head.appendChild(h),d)return new Promise((f,g)=>{h.addEventListener("load",f),h.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${p}`)))})}))}function s(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return i.then(r=>{for(const c of r||[])c.status==="rejected"&&s(c.reason);return e().catch(s)})};function je(t={}){const{immediate:e=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:i,onRegisteredSW:s,onRegisterError:l}=t;let r,c;const u=async(d=!0)=>{await c};async function p(){if("serviceWorker"in navigator){if(r=await Ve(async()=>{const{Workbox:d}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:d}},[]).then(({Workbox:d})=>new d("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(d=>{l?.(d)}),!r)return;r.addEventListener("activated",d=>{(d.isUpdate||d.isExternal)&&window.location.reload()}),r.addEventListener("installed",d=>{d.isUpdate||n?.()}),r.register({immediate:e}).then(d=>{s?s("/link/dev/sw.js",d):i?.(d)}).catch(d=>{l?.(d)})}}return c=p(),u}const Ge="./pulse-data.json",Jt="https://api.pugetsound.onebusaway.org/api/where",mt="TEST".trim()||"TEST",x=mt==="TEST",Ke=x?6e4:2e4,Nt=3,Ye=800,ze=x?2e4:5e3,Pt=x?12e4:3e4,Ot=x?1200:0,at=x?1:3,Xe=1100,Ze=x?45e3:15e3,Je=x?9e4:3e4,Qe=4e3,ta=15e3,ea=4.8,aa=.35,na=45e3,Qt=4,te="link-pulse-theme",q="link",z={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},o={fetchedAt:"",error:"",activeSystemId:q,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map},ia=je({immediate:!0,onNeedRefresh(){ia(!0)}});document.querySelector("#app").innerHTML=`
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
`;const I=document.querySelector("#board"),sa=document.querySelector("#screen-kicker"),oa=document.querySelector("#screen-title"),qt=document.querySelector("#system-bar"),ee=[...document.querySelectorAll(".tab-button")],ae=document.querySelector("#theme-toggle"),K=document.querySelector("#status-pill"),ra=document.querySelector("#current-time"),lt=document.querySelector("#updated-at"),v=document.querySelector("#station-dialog"),la=document.querySelector("#dialog-title"),ca=document.querySelector("#dialog-title-track"),ne=document.querySelector("#dialog-title-text"),da=document.querySelector("#dialog-title-text-clone"),ua=document.querySelector("#dialog-service-summary"),_t=document.querySelector("#dialog-status-pill"),pa=document.querySelector("#dialog-updated-at"),ct=document.querySelector("#dialog-display"),ie=[...document.querySelectorAll("[data-dialog-direction]")],_=document.querySelector("#station-alerts-container"),E=document.querySelector("#transfer-section"),Bt=document.querySelector("#arrivals-nb-pinned"),B=document.querySelector("#arrivals-nb"),Ft=document.querySelector("#arrivals-sb-pinned"),F=document.querySelector("#arrivals-sb"),M=document.querySelector("#train-dialog"),ma=document.querySelector("#train-dialog-title"),fa=document.querySelector("#train-dialog-subtitle"),Ht=document.querySelector("#train-dialog-line"),Ut=document.querySelector("#train-dialog-status"),ha=document.querySelector("#train-dialog-close"),P=document.querySelector("#alert-dialog"),ga=document.querySelector("#alert-dialog-title"),va=document.querySelector("#alert-dialog-subtitle"),ya=document.querySelector("#alert-dialog-lines"),Wt=document.querySelector("#alert-dialog-body"),Vt=document.querySelector("#alert-dialog-link"),ba=document.querySelector("#alert-dialog-close");ct.addEventListener("click",()=>Xa());ha.addEventListener("click",()=>It());ba.addEventListener("click",()=>Dt());ie.forEach(t=>{t.addEventListener("click",()=>{o.dialogDisplayDirection=t.dataset.dialogDirection,o.dialogDisplayDirection==="auto"&&(o.dialogDisplayAutoPhase="nb"),$t()})});v.addEventListener("click",t=>{t.target===v&&Ie()});M.addEventListener("click",t=>{t.target===M&&It()});P.addEventListener("click",t=>{t.target===P&&Dt()});v.addEventListener("close",()=>{St(),wt(),bt(),yt(!1),o.isSyncingFromUrl||Le()});ee.forEach(t=>{t.addEventListener("click",()=>{o.activeTab=t.dataset.tab,w()})});ae.addEventListener("click",()=>{se(o.theme==="dark"?"light":"dark"),w()});function H(){return z[o.activeSystemId]??z[q]}function $a(){return o.systemsById.get(o.activeSystemId)?.agencyId??z[q].agencyId}function Sa(){return`${Jt}/vehicles-for-agency/${$a()}.json?key=${mt}`}function S(){return H().vehicleLabel??"Vehicle"}function wa(t){return/bus$/i.test(t)?`${t}es`:`${t}s`}function b(){return H().vehicleLabelPlural??wa(S())}function X(t){return t.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function La(){const t=window.localStorage.getItem(te);return t==="light"||t==="dark"?t:"dark"}function se(t){o.theme=t,document.documentElement.dataset.theme=t,window.localStorage.setItem(te,t)}function jt(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);o.compactLayout=n<=Xe}function Z(){const a=window.getComputedStyle(I).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==o.compactLayout&&(o.compactLayout=a,w())}function Y(t){return t.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function nt(t,e,a){return Math.max(e,Math.min(t,a))}function Ta(t){if(!t)return"Waiting for snapshot";const e=Math.max(0,Math.round((Date.now()-new Date(t).getTime())/1e3));return e<10?"Updated now":e<60?`Updated ${e}s ago`:`Updated ${Math.round(e/60)}m ago`}function oe(){return new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit"}).format(new Date)}function O(t){if(t<=0)return"Arriving";const e=Math.floor(t/60),a=t%60;return e>0?`${e}m ${a}s`:`${a}s`}function Ia(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function it(t){const e=new Date;return e.setDate(e.getDate()+t),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(e)}function Da(t){const[e="0",a="0",n="0"]=String(t).split(":");return Number(e)*3600+Number(a)*60+Number(n)}function R(t,e){if(!t||!e)return null;const[a,n,i]=t.split("-").map(Number),s=Da(e),l=Math.floor(s/3600),r=Math.floor(s%3600/60),c=s%60;return new Date(a,n-1,i,l,r,c)}function G(t){const e=Math.max(0,Math.round(t/6e4)),a=Math.floor(e/60),n=e%60;return a&&n?`${a}h ${n}m`:a?`${a}h`:`${n}m`}function T(t){if(!t)return"";const[e="0",a="0"]=String(t).split(":"),n=Number(e),i=Number(a),s=(n%24+24)%24,l=s>=12?"PM":"AM";return`${s%12||12}:${String(i).padStart(2,"0")} ${l}`}function ft(t){const e=Ia(),a=t.serviceSpansByDate?.[e];return a?`Today ${T(a.start)} - ${T(a.end)}`:"Today service hours unavailable"}function re(t){const e=new Date,a=it(-1),n=it(0),i=it(1),s=t.serviceSpansByDate?.[a],l=t.serviceSpansByDate?.[n],r=t.serviceSpansByDate?.[i],u=[s&&{kind:"yesterday",start:R(a,s.start),end:R(a,s.end),span:s},l&&{kind:"today",start:R(n,l.start),end:R(n,l.end),span:l}].filter(Boolean).find(p=>e>=p.start&&e<=p.end);if(u)return{tone:"active",headline:`Last trip ${T(u.span.end)}`,detail:`Ends in ${G(u.end.getTime()-e.getTime())}`,compact:`Ends in ${G(u.end.getTime()-e.getTime())}`};if(l){const p=R(n,l.start),d=R(n,l.end);if(e<p)return{tone:"upcoming",headline:`First trip ${T(l.start)}`,detail:`Starts in ${G(p.getTime()-e.getTime())}`,compact:`Starts in ${G(p.getTime()-e.getTime())}`};if(e>d)return{tone:"ended",headline:`Service ended ${T(l.end)}`,detail:r?`Next start ${T(r.start)}`:"No next service loaded",compact:r?`Next ${T(r.start)}`:"Ended"}}return r?{tone:"upcoming",headline:`Next first trip ${T(r.start)}`,detail:"No service remaining today",compact:`Next ${T(r.start)}`}:{tone:"muted",headline:"Service hours unavailable",detail:"Static schedule data missing for this date",compact:"Unavailable"}}function ht(t){const e=re(t);return`
    <div class="service-reminder service-reminder-${e.tone}">
      <p class="service-reminder-headline">${e.headline}</p>
      <p class="service-reminder-detail">${e.detail}</p>
    </div>
  `}function Ma(t){const e=tt(t).map(({line:a})=>{const n=re(a);return`${a.name}: ${n.compact}`}).slice(0,3);ua.textContent=e.join("  ·  ")||"Service summary unavailable"}function le(t){return String(t||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function ce(t){return String(t||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,e=>e.toUpperCase())}function j(t){return o.alerts.filter(e=>e.lineIds.includes(t))}function de(t,e){const a=j(e.id);if(!a.length)return[];const n=new Set(V(t,e));return n.add(t.id),a.filter(i=>i.stopIds.length>0&&i.stopIds.some(s=>n.has(s)))}function xa(t){const e=new Set,a=[];for(const{station:n,line:i}of tt(t))for(const s of de(n,i))e.has(s.id)||(e.add(s.id),a.push(s));return a}function ue(t,e){return t.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${e}">
      <span class="line-alert-badge-count">${t.length}</span>
      <span class="line-alert-badge-copy">alert${t.length===1?"":"s"}</span>
    </button>
  `:""}function gt(t){return new Promise(e=>window.setTimeout(e,t))}function Aa(){const t=Math.max(0,o.obaRateLimitStreak-1),e=Math.min(Pt,ze*2**t),a=Math.round(e*(.15+Math.random()*.2));return Math.min(Pt,e+a)}async function ka(){const t=o.obaCooldownUntil-Date.now();t>0&&await gt(t)}function Ca(t){return t?.code===429||/rate limit/i.test(t?.text??"")}async function pe(t,e){for(let a=0;a<=Nt;a+=1){await ka();const n=await fetch(t,{cache:"no-store"});let i=null;try{i=await n.json()}catch{i=null}const s=n.status===429||Ca(i);if(n.ok&&!s)return o.obaRateLimitStreak=0,o.obaCooldownUntil=0,i;if(a===Nt||!s)throw i?.text?new Error(i.text):new Error(`${e} request failed with ${n.status}`);o.obaRateLimitStreak+=1;const l=Ye*2**a,r=Math.max(l,Aa());o.obaCooldownUntil=Date.now()+r,await gt(r)}throw new Error(`${e} request failed`)}function Ea(t){const e=[...t.stops].sort((d,m)=>m.sequence-d.sequence),a=48,n=44,i=28,s=88,l=122,r=n+i+(e.length-1)*a,c=new Map,u=e.map((d,m)=>{const h={...d,label:X(d.name),y:n+m*a,index:m,isTerminal:m===0||m===e.length-1};c.set(d.id,m),c.set(`${t.agencyId}_${d.id}`,m);for(const f of t.stationAliases?.[d.id]??[])c.set(f,m),c.set(`${t.agencyId}_${f}`,m);return h});let p=0;for(let d=0;d<u.length;d+=1)u[d].cumulativeMinutes=p,p+=d<u.length-1?u[d].segmentMinutes:0;return{totalMinutes:p,height:r,labelX:l,stationGap:a,stationIndexByStopId:c,stations:u,trackX:s}}function Ra(t,e){return t!=null&&e!=null&&t!==e?e<t?"▲":"▼":"•"}function Na(t){const e=t.tripStatus??{},a=String(e.status??"").toLowerCase();e.closestStopTimeOffset;const n=e.nextStopTimeOffset??0,i=e.scheduleDeviation??0,s=e.closestStop&&e.nextStop&&e.closestStop===e.nextStop;return a==="approaching"||s&&Math.abs(n)<=90?"ARR":i>=120?"DELAY":"OK"}function Pa(t,e){if(!e)return{text:"Scheduled",colorClass:"status-muted"};if(t>=-30&&t<=60)return{text:"On Time",colorClass:"status-ontime"};if(t>60){const a=Math.round(t/60);let n="status-late-minor";return t>600?n="status-late-severe":t>300&&(n="status-late-moderate"),{text:`+${a} min late`,colorClass:n}}return t<-60?{text:`${Math.round(Math.abs(t)/60)} min early`,colorClass:"status-early"}:{text:"Unknown",colorClass:"status-muted"}}function Oa(t){switch(t){case"ARR":return"ARRIVING";case"DELAY":return"DELAYED";case"OK":return"EN ROUTE";default:return""}}function $(t){if(!o.fetchedAt)return t;const e=Math.max(0,Math.floor((Date.now()-new Date(o.fetchedAt).getTime())/1e3));return t-e}function U(t,e){return e<=90?"status-arriving":t.delayInfo.colorClass}function vt(t){const e=$(t.nextOffset??0),a=$(t.closestOffset??0),n=t.delayInfo.text;return e<=15?[{text:"Arriving now",toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:e<=90?[{text:`Arriving in ${O(e)}`,toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:a<0&&e>0?[{text:`Next stop in ${O(e)}`,toneClass:"status-arriving"},{text:n,toneClass:t.delayInfo.colorClass}]:[{text:Oa(t.serviceStatus),toneClass:U(t,e)},{text:n,toneClass:t.delayInfo.colorClass}]}function N(t){return t.map(e=>`
        <span class="status-chip ${e.toneClass}">
          ${e.text}
        </span>
      `).join("")}function me(t){const e=$(t.nextOffset??0),a=$(t.closestOffset??0),n=t.upcomingLabel||t.toLabel||t.currentStopLabel,[i,s]=vt(t);return e<=15?`${t.label} at ${n} ${N([i,s])}`:e<=90?`${t.label} at ${n} ${N([i,s])}`:a<0&&e>0?`${t.label} ${n} ${N([i,s])}`:`${t.label} to ${n} ${N([i,s])}`}function fe(t){return N(vt(t))}function he(t,e){if(!e.length)return"";const a=[...e].sort((i,s)=>$(i.nextOffset??0)-$(s.nextOffset??0)).slice(0,8),n=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${t};">
      <div class="line-marquee-track">
        ${n.map(i=>`
          <span
            class="line-marquee-item ${U(i,$(i.nextOffset??0))}"
            data-vehicle-marquee="${i.id}"
          >
            <span class="line-marquee-token">${i.lineToken}</span>
            <span class="line-marquee-copy">${me(i)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function qa(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const n=a.dataset.vehicleStatus,i=J().find(l=>l.id===n);if(!i)return;const s=$(i.nextOffset??0);a.innerHTML=fe(i),a.className=`train-list-status ${U(i,s)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const n=a.dataset.vehicleMarquee,i=J().find(r=>r.id===n);if(!i)return;const s=$(i.nextOffset??0);a.className=`line-marquee-item ${U(i,s)}`;const l=a.querySelector(".line-marquee-copy");l&&(l.innerHTML=me(i))})}function _a(t,e,a,n){const i=t.tripStatus?.activeTripId??t.tripId??"",s=n.get(i);if(!s||s.routeId!==e.routeKey)return null;const l=t.tripStatus?.closestStop,r=t.tripStatus?.nextStop,c=a.stationIndexByStopId.get(l),u=a.stationIndexByStopId.get(r);if(c==null&&u==null)return null;let p=c??u,d=u??c;if(p>d){const He=p;p=d,d=He}const m=a.stations[p],h=a.stations[d],f=t.tripStatus?.closestStopTimeOffset??0,g=t.tripStatus?.nextStopTimeOffset??0,y=s.directionId==="1"?"▲":s.directionId==="0"?"▼":Ra(c,u);let L=0;p!==d&&f<0&&g>0&&(L=nt(Math.abs(f)/(Math.abs(f)+g),0,1));const A=m.y+(h.y-m.y)*L,k=p!==d?m.segmentMinutes:0,D=m.cumulativeMinutes+k*L,C=c??u??p,xt=a.stations[C]??m,At=y==="▲",qe=nt(C+(At?1:-1),0,a.stations.length-1),kt=c!=null&&u!=null&&c!==u?u:nt(C+(At?-1:1),0,a.stations.length-1),_e=a.stations[qe]??xt,Be=a.stations[kt]??h,Ct=t.tripStatus?.scheduleDeviation??0,Et=t.tripStatus?.predicted??!1,Fe=Pa(Ct,Et);return{id:t.vehicleId,label:t.vehicleId.replace(/^\d+_/,""),directionSymbol:y,fromLabel:m.label,minutePosition:D,progress:L,serviceStatus:Na(t),toLabel:h.label,y:A,currentLabel:m.label,nextLabel:h.label,previousLabel:_e.label,currentStopLabel:xt.label,upcomingLabel:Be.label,currentIndex:C,upcomingStopIndex:kt,status:t.tripStatus?.status??"",closestStop:l,nextStop:r,closestOffset:f,nextOffset:g,scheduleDeviation:Ct,isPredicted:Et,delayInfo:Fe,rawVehicle:t}}function ge(t){return t.fromLabel===t.toLabel||t.progress===0?`At ${t.fromLabel}`:`${t.fromLabel} -> ${t.toLabel}`}function J(){return o.lines.flatMap(t=>(o.vehiclesByLine.get(t.id)??[]).map(e=>({...e,lineColor:t.color,lineId:t.id,lineName:t.name,lineToken:t.name[0]})))}function Ba(){return Object.values(z).filter(t=>o.systemsById.has(t.id)).map(t=>`
        <button
          class="tab-button ${t.id===o.activeSystemId?"is-active":""}"
          data-system-switch="${t.id}"
          type="button"
        >
          ${t.label}
        </button>
      `).join("")}function st(){return!o.compactLayout||o.lines.length<2?"":`<section class="line-switcher">${o.lines.map(e=>`
        <button
          class="line-switcher-button ${e.id===o.activeLineId?"is-active":""}"
          data-line-switch="${e.id}"
          type="button"
          style="--line-color:${e.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <span>${e.name}</span>
        </button>
      `).join("")}</section>`}function ve(){return o.compactLayout?o.lines.filter(t=>t.id===o.activeLineId):o.lines}function W(t,e){const a=[...t].sort((s,l)=>s.minutePosition-l.minutePosition),n=[...e].sort((s,l)=>s.minutePosition-l.minutePosition),i=s=>s.slice(1).map((l,r)=>Math.round(l.minutePosition-s[r].minutePosition));return{nbGaps:i(a),sbGaps:i(n)}}function Fa(t){if(!t.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const e=t.reduce((i,s)=>i+s,0)/t.length,a=Math.max(...t),n=Math.min(...t);return{avg:Math.round(e),max:a,min:n,spread:a-n,ratio:a/Math.max(n,1)}}function Q(t,e){const a=Fa(t);if(e<2||a.avg==null)return{health:"quiet",stats:a};let n="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?n="bunched":a.max>=12||a.spread>=6?n="uneven":a.avg>=18&&(n="sparse"),{health:n,stats:a}}function Ha(t,e){if(!t.length||e<2)return{averageText:"—",detailText:`Too few ${b().toLowerCase()} for a spacing read`};const a=Math.round(t.reduce((s,l)=>s+l,0)/t.length),n=Math.min(...t),i=Math.max(...t);return{averageText:`~${a} min`,detailText:`${n}-${i} min observed gap`}}function Gt(t,e,a){const{averageText:n,detailText:i}=Ha(e,a);return`
    <div class="headway-health-card">
      <p class="headway-health-label">${t}</p>
      <p class="headway-health-value">${n}</p>
      <p class="headway-health-copy">${i}</p>
    </div>
  `}function ye(t){return t.reduce((e,a)=>{const n=Number(a.scheduleDeviation??0);return n<=60?e.onTime+=1:n<=300?e.minorLate+=1:e.severeLate+=1,e},{onTime:0,minorLate:0,severeLate:0})}function be(t,e){return e?`${Math.round(t/e*100)}%`:"—"}function Ua(t,e){return Math.abs(t.length-e.length)<=1?{label:"Balanced",tone:"healthy"}:t.length>e.length?{label:"▲ Heavier",tone:"warn"}:{label:"▼ Heavier",tone:"warn"}}function Wa(t,e){return`
    <div class="delay-distribution">
      ${[["On time",t.onTime,"healthy"],["2-5 min late",t.minorLate,"warn"],["5+ min late",t.severeLate,"alert"]].map(([n,i,s])=>`
        <div class="delay-chip delay-chip-${s}">
          <p class="delay-chip-label">${n}</p>
          <p class="delay-chip-value">${i}</p>
          <p class="delay-chip-copy">${be(i,e)}</p>
        </div>
      `).join("")}
    </div>
  `}function Kt(t,e,a,n){if(!e.length)return`
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
        <p class="flow-lane-copy">${i.length} live ${i.length===1?S().toLowerCase():b().toLowerCase()}</p>
      </div>
      <div class="flow-track" style="--line-color:${n};">
        ${s.map((l,r)=>`
          <span
            class="flow-vehicle"
            style="left:${l}%; --line-color:${n};"
            title="${i[r].label} · ${ge(i[r])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function $e(t,e,a,n){const i=[],{stats:s}=Q(W(e,[]).nbGaps,e.length),{stats:l}=Q(W([],a).sbGaps,a.length),r=[...e,...a].filter(u=>Number(u.scheduleDeviation??0)>300),c=Math.abs(e.length-a.length);return s.max!=null&&s.max>=12&&i.push({tone:"alert",copy:`Direction ▲ has a ${s.max} min service hole right now.`}),l.max!=null&&l.max>=12&&i.push({tone:"alert",copy:`Direction ▼ has a ${l.max} min service hole right now.`}),c>=2&&i.push({tone:"warn",copy:e.length>a.length?`Vehicle distribution is tilted toward ▲ by ${c}.`:`Vehicle distribution is tilted toward ▼ by ${c}.`}),r.length&&i.push({tone:"warn",copy:`${r.length} ${r.length===1?S().toLowerCase():b().toLowerCase()} are running 5+ min late.`}),n.length&&i.push({tone:"info",copy:`${n.length} active alert${n.length===1?"":"s"} affecting ${t.name}.`}),i.length||i.push({tone:"healthy",copy:"Spacing and punctuality look stable right now."}),i.slice(0,4)}function dt(t){return t.map(e=>{const a=o.layouts.get(e.id),n=o.vehiclesByLine.get(e.id)??[],i=n.filter(r=>r.directionSymbol==="▲"),s=n.filter(r=>r.directionSymbol==="▼"),l=j(e.id);return{line:e,layout:a,vehicles:n,nb:i,sb:s,lineAlerts:l,exceptions:$e(e,i,s,l)}})}function Se(t){const e=t.length,a=t.reduce((g,y)=>g+y.vehicles.length,0),n=t.reduce((g,y)=>g+y.lineAlerts.length,0),i=t.filter(g=>g.lineAlerts.length>0).length,s=t.flatMap(g=>g.vehicles),l=ye(s),r=new Set(t.filter(g=>g.vehicles.some(y=>Number(y.scheduleDeviation??0)>300)).map(g=>g.line.id)),c=new Set(t.filter(g=>{const{nbGaps:y,sbGaps:L}=W(g.nb,g.sb),A=Q(y,g.nb.length).health,k=Q(L,g.sb.length).health;return[A,k].some(D=>D==="uneven"||D==="bunched"||D==="sparse")}).map(g=>g.line.id)),u=new Set([...r,...c]).size,p=Math.max(0,e-u),d=a?Math.round(l.onTime/a*100):null,m=t.map(g=>{const{nbGaps:y,sbGaps:L}=W(g.nb,g.sb),A=[...y,...L].length?Math.max(...y,...L):0,k=g.vehicles.filter(C=>Number(C.scheduleDeviation??0)>300).length,D=g.lineAlerts.length*5+k*3+Math.max(0,A-10);return{line:g.line,score:D,worstGap:A,severeLateCount:k,alertCount:g.lineAlerts.length}}).sort((g,y)=>y.score-g.score||y.worstGap-g.worstGap);let h={tone:"healthy",copy:"No major active issues right now."};const f=m[0]??null;return f?.alertCount?h={tone:"info",copy:`${f.line.name} has ${f.alertCount} active alert${f.alertCount===1?"":"s"}.`}:f?.worstGap>=12?h={tone:"alert",copy:`Largest live gap: ${f.worstGap} min on ${f.line.name}.`}:f?.severeLateCount&&(h={tone:"warn",copy:`${f.line.name} has ${f.severeLateCount} ${f.severeLateCount===1?S().toLowerCase():b().toLowerCase()} running 5+ min late.`}),{totalLines:e,totalVehicles:a,totalAlerts:n,impactedLines:i,delayedLineIds:r,unevenLineIds:c,attentionLineCount:u,healthyLineCount:p,onTimeRate:d,rankedLines:m,topIssue:h}}function Yt(t,e,{suffix:a="",invert:n=!1}={}){if(t==null||e==null||t===e)return"Flat vs last snapshot";const i=t-e,s=n?i<0:i>0,l=i>0?"↑":"↓";return`${s?"Improving":"Worse"} ${l} ${Math.abs(i)}${a}`}function Va(t){const e=Se(t),a=o.systemSnapshots.get(o.activeSystemId)?.previous??null,n=[];e.totalAlerts>0&&n.push({tone:"info",copy:`${e.totalAlerts} active alert${e.totalAlerts===1?"":"s"} across ${e.impactedLines} line${e.impactedLines===1?"":"s"}.`}),e.delayedLineIds.size>0&&n.push({tone:"warn",copy:`${e.delayedLineIds.size} line${e.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),e.unevenLineIds.size>0&&n.push({tone:"alert",copy:`${e.unevenLineIds.size} line${e.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),n.length||n.push({tone:"healthy",copy:"System looks stable right now with no major active issues."});const i=[{label:"On-Time Rate",value:e.onTimeRate!=null?`${e.onTimeRate}%`:"—",delta:Yt(e.onTimeRate,a?.onTimeRate,{suffix:"%"})},{label:"Attention Lines",value:e.attentionLineCount,delta:Yt(e.attentionLineCount,a?.attentionLineCount,{invert:!0})}];return`
    <article class="panel-card panel-card-wide system-summary-card">
      <header class="panel-header">
        <div class="system-summary-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:var(--accent-strong);">${H().label[0]}</span>
            <div class="line-title-copy">
              <h2>${H().label} Summary</h2>
              <p>${e.totalLines} line${e.totalLines===1?"":"s"} in system · Updated ${oe()}</p>
            </div>
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
          ${e.rankedLines.slice(0,3).map(({line:s,score:l,worstGap:r,alertCount:c,severeLateCount:u})=>`
            <div class="system-ranking-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${s.color};">${s.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${s.name}</p>
                  <p class="headway-chart-copy">Score ${l}${r?` · gap ${r} min`:""}${c?` · ${c} alert${c===1?"":"s"}`:""}${u?` · ${u} severe late`:""}</p>
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
  `}function ja(t){const e=t.flatMap(l=>l.exceptions.map(r=>({tone:r.tone,copy:`${l.line.name}: ${r.copy}`,lineColor:l.line.color})));if(!e.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="Current insights summary">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">No active issues right now.</span>
        </div>
      </section>
    `;const a=Ga(),n=Math.ceil(e.length/a),i=o.insightsTickerIndex%n;return`
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
  `}function Ga(){const t=window.visualViewport?.width??Number.POSITIVE_INFINITY,e=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(e,t,a);return n>=1680?3:n>=980?2:1}function Ka(t,e,a,n,i){const s=a.length+n.length;if(!s)return"";const{nbGaps:l,sbGaps:r}=W(a,n),c=[...a,...n],u=ye(c),p=[...l,...r].length?Math.max(...l,...r):null,d=Ua(a,n),m=$e(t,a,n,i),h=new Set(i.flatMap(f=>f.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">In Service</p>
          <p class="metric-chip-value">${s}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">On-Time Rate</p>
          <p class="metric-chip-value">${be(u.onTime,s)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">Worst Gap</p>
          <p class="metric-chip-value">${p!=null?`${p} min`:"—"}</p>
        </div>
        <div class="metric-chip metric-chip-${d.tone}">
          <p class="metric-chip-label">Balance</p>
          <p class="metric-chip-value">${d.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${Gt("Direction ▲",l,a.length)}
        ${Gt("Direction ▼",r,n.length)}
      </div>
      ${Wa(u,s)}
      <div class="flow-grid">
        ${Kt("Direction ▲ Flow",a,e,t.color)}
        ${Kt("Direction ▼ Flow",n,e,t.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">Now</p>
          <p class="headway-chart-copy">${i.length?`${i.length} active alert${i.length===1?"":"s"}${h?` · ${h} impacted stops`:""}`:"No active alerts on this line"}</p>
        </div>
        ${m.map(f=>`
          <div class="insight-exception insight-exception-${f.tone}">
            <p>${f.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function we(t,e=!1){const a=Date.now(),n=s=>{const l=s.arrivalTime,r=Math.floor((l-a)/1e3),c=O(r),u=Me(s.arrivalTime,s.scheduleDeviation??0),p=Lt(u);let d="";if(s.distanceFromStop>0){const m=s.distanceFromStop>=1e3?`${(s.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(s.distanceFromStop)}m`,h=s.numberOfStopsAway===1?"1 stop away":`${s.numberOfStopsAway} stops away`;d=` • ${m} • ${h}`}return`
      <div class="arrival-item" data-arrival-time="${s.arrivalTime}" data-schedule-deviation="${s.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${s.lineColor};">${s.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${s.lineName} ${S()} ${s.vehicleId}</span>
            <span class="arrival-destination">To ${s.destination}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${p}">${u}</span>
          <span class="arrival-time"><span class="arrival-countdown">${c}</span><span class="arrival-precision">${d}</span></span>
        </span>
      </div>
    `};if(e){Bt.innerHTML="",Ft.innerHTML="",B.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',F.innerHTML='<div class="arrival-item muted">Loading arrivals...</div>',ut();return}const i=(s,l,r)=>{if(!s.length){l.innerHTML="",r.innerHTML=`<div class="arrival-item muted">No upcoming ${b().toLowerCase()}</div>`;return}const c=o.dialogDisplayMode?s.slice(0,2):[],u=o.dialogDisplayMode?s.slice(2):s;l.innerHTML=c.map(n).join(""),r.innerHTML=u.length?u.map(n).join(""):o.dialogDisplayMode?`<div class="arrival-item muted">No additional ${b().toLowerCase()}</div>`:""};i(t.nb,Bt,B),i(t.sb,Ft,F),ut()}function V(t,e){const a=new Set(e.stationAliases?.[t.id]??[]);a.add(t.id);const n=new Set;for(const s of a){const l=s.startsWith(`${e.agencyId}_`)?s:`${e.agencyId}_${s}`;n.add(l)}const i=t.id.replace(/-T\d+$/,"");return n.add(i.startsWith(`${e.agencyId}_`)?i:`${e.agencyId}_${i}`),[...n]}function tt(t){const e=o.lines.map(a=>{const n=a.stops.find(i=>i.id===t.id);return n?{line:a,station:n}:null}).filter(Boolean);return e.length>0?e:o.lines.map(a=>{const n=a.stops.find(i=>i.name===t.name);return n?{line:a,station:n}:null}).filter(Boolean)}function Ya(t){if(!t)return null;const e=t.trim().toLowerCase();for(const a of o.lines)for(const n of a.stops){const i=new Set([n.id,`${a.agencyId}_${n.id}`,n.name,X(n.name),Y(n.name),Y(X(n.name))]);for(const s of a.stationAliases?.[n.id]??[])i.add(s),i.add(`${a.agencyId}_${s}`),i.add(Y(s));if([...i].some(s=>String(s).toLowerCase()===e))return n}return null}function za(t){const e=new URL(window.location.href);e.searchParams.set("station",Y(t.name)),window.history.pushState({},"",e)}function Le(){const t=new URL(window.location.href);t.searchParams.has("station")&&(t.searchParams.delete("station"),window.history.pushState({},"",t))}function zt(t){const e=new URL(window.location.href);t===q?e.searchParams.delete("system"):e.searchParams.set("system",t),window.history.pushState({},"",e)}function Te(){const e=new URL(window.location.href).searchParams.get("system");return e&&o.systemsById.has(e)?e:q}function yt(t){o.dialogDisplayMode=t,v.classList.toggle("is-display-mode",t),ct.textContent=t?"Exit":"Board",ct.setAttribute("aria-label",t?"Exit display mode":"Toggle display mode"),o.dialogDisplayDirection="both",o.dialogDisplayAutoPhase="nb",$t(),v.open&&o.currentDialogStation&&Tt(o.currentDialogStation).catch(console.error),et(),ut()}function Xa(){yt(!o.dialogDisplayMode)}function bt(){o.dialogDisplayDirectionTimer&&(window.clearInterval(o.dialogDisplayDirectionTimer),o.dialogDisplayDirectionTimer=0)}function $t(){bt();const t=o.dialogDisplayDirection,e=t==="auto"?o.dialogDisplayAutoPhase:t;ie.forEach(a=>{a.classList.toggle("is-active",a.dataset.dialogDirection===t)}),v.classList.toggle("show-nb-only",o.dialogDisplayMode&&e==="nb"),v.classList.toggle("show-sb-only",o.dialogDisplayMode&&e==="sb"),o.dialogDisplayMode&&t==="auto"&&(o.dialogDisplayDirectionTimer=window.setInterval(()=>{o.dialogDisplayAutoPhase=o.dialogDisplayAutoPhase==="nb"?"sb":"nb",$t()},ta))}function St(){o.dialogRefreshTimer&&(window.clearTimeout(o.dialogRefreshTimer),o.dialogRefreshTimer=0)}function wt(){o.dialogDisplayTimer&&(window.clearInterval(o.dialogDisplayTimer),o.dialogDisplayTimer=0)}function ot(t,e){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(t.style.transform="translateY(0)",!o.dialogDisplayMode||a.length<=3)return;const n=Number.parseFloat(window.getComputedStyle(t).rowGap||"0")||0,i=a[0].getBoundingClientRect().height+n,s=Math.max(0,a.length-3),l=Math.min(o.dialogDisplayIndexes[e],s);t.style.transform=`translateY(-${l*i}px)`}function ut(){wt(),o.dialogDisplayIndexes={nb:0,sb:0},ot(B,"nb"),ot(F,"sb"),o.dialogDisplayMode&&(o.dialogDisplayTimer=window.setInterval(()=>{for(const[t,e]of[["nb",B],["sb",F]]){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const n=Math.max(0,a.length-3);o.dialogDisplayIndexes[t]=o.dialogDisplayIndexes[t]>=n?0:o.dialogDisplayIndexes[t]+1,ot(e,t)}},Qe))}function Za(){if(!v.open)return;v.querySelectorAll(".arrival-item[data-arrival-time]").forEach(e=>{const a=Number(e.dataset.arrivalTime),n=Number(e.dataset.scheduleDeviation||0),i=e.querySelector(".arrival-countdown"),s=e.querySelector(".arrival-status");if(!i||!s)return;i.textContent=O(Math.floor((a-Date.now())/1e3));const l=Me(a,n),r=Lt(l);s.textContent=l,s.className=`arrival-status arrival-status-${r}`})}function Ja(){if(St(),!o.currentDialogStation)return;const t=()=>{o.dialogRefreshTimer=window.setTimeout(async()=>{!v.open||!o.currentDialogStation||(await Tt(o.currentDialogStation).catch(console.error),t())},Je)};t()}function Ie(){o.currentDialogStationId="",o.currentDialogStation=null,v.open?v.close():(St(),wt(),bt(),yt(!1),Le())}async function Xt(){const t=Te();t!==o.activeSystemId&&await Oe(t,{updateUrl:!1,preserveDialog:!1});const e=new URL(window.location.href).searchParams.get("station"),a=Ya(e);o.isSyncingFromUrl=!0;try{if(!a){o.currentDialogStationId="",v.open&&v.close();return}if(o.activeTab="map",w(),o.currentDialogStationId===a.id&&v.open)return;await Ce(a,!1)}finally{o.isSyncingFromUrl=!1}}function Qa(t,e){const a=e.directionLookup?.[t.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const n=t.tripHeadsign??"",i=n.toLowerCase();return e.nbTerminusPrefix&&i.startsWith(e.nbTerminusPrefix)?"nb":e.sbTerminusPrefix&&i.startsWith(e.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function De(t){return t.routeKey??`${t.agencyId}_${t.id}`}function tn(t){const e=t.tripHeadsign?.trim();return e?X(e.replace(/^to\s+/i,"")):"Terminal"}function Me(t,e){return Math.floor((t-Date.now())/1e3)<=90?"ARR":e>=120?"DELAY":"ON TIME"}function Lt(t){return t==="DELAY"?"delay":t==="ARR"?"arr":"ok"}async function en(t){const e=`${Jt}/arrivals-and-departures-for-stop/${t}.json?key=${mt}&minutesAfter=120`,a=await pe(e,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${t}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function xe(t){const e=[...new Set(t)],a=[],n=[];for(let i=0;i<e.length;i+=at){const s=e.slice(i,i+at),l=await Promise.allSettled(s.map(r=>en(r)));a.push(...l),Ot>0&&i+at<e.length&&await gt(Ot)}for(const i of a)i.status==="fulfilled"&&n.push(...i.value);return n}function Ae(t,e,a=null){const n=Date.now(),i=new Set,s={nb:[],sb:[]},l=a?new Set(a):null;for(const r of t){if(r.routeId!==De(e)||l&&!l.has(r.stopId))continue;const c=r.predictedArrivalTime||r.scheduledArrivalTime;if(!c||c<=n)continue;const u=Qa(r,e);if(!u)continue;const p=`${r.tripId}:${r.stopId}:${c}`;i.has(p)||(i.add(p),s[u].push({vehicleId:(r.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:c,destination:tn(r),scheduleDeviation:r.scheduleDeviation??0,tripId:r.tripId,lineColor:e.color,lineName:e.name,lineToken:e.name[0],distanceFromStop:r.distanceFromStop??0,numberOfStopsAway:r.numberOfStopsAway??0}))}return s.nb.sort((r,c)=>r.arrivalTime-c.arrivalTime),s.sb.sort((r,c)=>r.arrivalTime-c.arrivalTime),s.nb=s.nb.slice(0,4),s.sb=s.sb.slice(0,4),s}async function an(t,e,a=null){const n=`${o.activeSystemId}:${e.id}:${t.id}`,i=o.arrivalsCache.get(n);if(i&&Date.now()-i.fetchedAt<Ke)return i.value;const s=V(t,e),l=a??await xe(s),r=Ae(l,e,s);return o.arrivalsCache.set(n,{fetchedAt:Date.now(),value:r}),r}function nn(t){const e={nb:[],sb:[]};for(const a of t)e.nb.push(...a.nb),e.sb.push(...a.sb);return e.nb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e.sb.sort((a,n)=>a.arrivalTime-n.arrivalTime),e}function ke(t){const e=xa(t);if(!e.length){_.innerHTML="",_.hidden=!0;return}_.hidden=!1,_.innerHTML=`
    <div class="station-alerts">
      ${e.map((a,n)=>`
        <button class="station-alert-pill" data-alert-idx="${n}" type="button">
          <span class="station-alert-pill-meta">${ce(a.severity)} · ${le(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||"Service alert"}</span>
        </button>
      `).join("")}
    </div>
  `,_.querySelectorAll(".station-alert-pill").forEach(a=>{const n=e[Number(a.dataset.alertIdx)];n&&a.addEventListener("click",()=>{const i=o.lines.find(s=>n.lineIds.includes(s.id));i&&Re(i)})})}async function Ce(t,e=!0){dn(t.name),Ma(t),o.currentDialogStationId=t.id,o.currentDialogStation=t,ke(t),pt([],!0),we({nb:[],sb:[]},!0),e&&za(t),v.showModal(),et(),Ja(),await Tt(t)}async function Tt(t){const e=o.activeDialogRequest+1;o.activeDialogRequest=e;try{const a=tt(t),n=fn(t),i=a.flatMap(({station:c,line:u})=>V(c,u)),s=n.flatMap(({stop:c,line:u})=>V(c,u)),l=await xe([...i,...s]),r=await Promise.all(a.map(({station:c,line:u})=>an(c,u,l)));if(o.activeDialogRequest!==e||!v.open)return;pt(hn(n,l)),ke(t),we(nn(r))}catch(a){if(o.activeDialogRequest!==e||!v.open)return;pt([]),B.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,F.innerHTML='<div class="arrival-item muted">Retry in a moment</div>'}}function sn(t){const e=o.layouts.get(t.id),a=o.vehiclesByLine.get(t.id)??[],n=j(t.id),i=e.stations.map((r,c)=>{const u=e.stations[c-1],p=c>0?u.segmentMinutes:"",m=de(r,t).length>0,h=r.isTerminal?15:10;return`
        <g transform="translate(0, ${r.y})" class="station-group${m?" has-alert":""}" data-stop-id="${r.id}" style="cursor: pointer;">
          ${c>0?`<text x="0" y="-14" class="segment-time">${p}</text>
                 <line x1="18" x2="${e.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${e.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${t.color};"></circle>
          ${r.isTerminal?`<text x="${e.trackX}" y="4" text-anchor="middle" class="terminal-mark">${t.name[0]}</text>`:""}
          ${m?`<circle cx="${e.trackX+h}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${e.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),s=a.map((r,c)=>`
        <g transform="translate(${e.trackX}, ${r.y+(c%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${t.color}; animation-delay:${c*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${t.color};"></path>
        </g>
      `).join(""),l=S();return`
    <article class="line-card" data-line-id="${t.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <div class="line-title-copy">
            <div class="line-title-row">
              <h2>${t.name}</h2>
              ${ue(n,t.id)}
            </div>
            <p>${a.length} live ${a.length===1?l.toLowerCase():b().toLowerCase()}</p>
            <p>${ft(t)}</p>
          </div>
        </div>
        ${ht(t)}
      </header>
      ${he(t.color,a.map(r=>({...r,lineToken:t.name[0]})))}
      <svg viewBox="0 0 460 ${e.height}" class="line-diagram" role="img" aria-label="${t.name} live LED board">
        <line x1="${e.trackX}" x2="${e.trackX}" y1="${e.stations[0].y}" y2="${e.stations.at(-1).y}" class="spine" style="--line-color:${t.color};"></line>
        ${i}
        ${s}
      </svg>
    </article>
  `}function on(){const t=J().sort((l,r)=>l.minutePosition-r.minutePosition),e=S(),a=b(),n=a.toLowerCase();return t.length?(o.compactLayout?o.lines.filter(l=>l.id===o.activeLineId):o.lines).map(l=>{const r=t.filter(m=>m.lineId===l.id),c=j(l.id),u=r.filter(m=>m.directionSymbol==="▲"),p=r.filter(m=>m.directionSymbol==="▼"),d=(m,h)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${m}</p>
          ${h.length?h.map(f=>`
                      <article class="train-list-item" data-train-id="${f.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${f.lineColor};">${f.lineToken}</span>
                          <div>
                            <p class="train-list-title">${f.lineName} ${e} ${f.label}</p>
                            <p class="train-list-subtitle">${ge(f)}</p>
                            <p class="train-list-status ${U(f,$(f.nextOffset??0))}" data-vehicle-status="${f.id}">${fe(f)}</p>
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
                  ${ue(c,l.id)}
                </div>
                <p>${r.length} ${r.length===1?e.toLowerCase():b().toLowerCase()} in service · ${ft(l)}</p>
              </div>
            </div>
            ${ht(l)}
          </header>
          ${he(l.color,r)}
          <div class="line-readout line-readout-grid train-columns">
            ${d("NB",u)}
            ${d("SB",p)}
          </div>
        </article>
      `}).join(""):`
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>Active ${a}</h2>
          <p>No live ${n}</p>
        </article>
      </section>
    `}function Ee(t){return new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function rn(t){return Ee(Date.now()+Math.max(0,t)*1e3)}function ln(t,e){const a=t.directionSymbol==="▲"?0:e.stations.length-1;return e.stations[a]?.label??t.upcomingLabel}function cn(t,e,a=6){if(!e?.stations?.length)return[];const n=t.directionSymbol==="▲"?-1:1,i=[],s=new Set,l=t.upcomingStopIndex??t.currentIndex,r=Math.max(0,t.nextOffset??0),c=(p,d,{isNext:m=!1,isTerminal:h=!1}={})=>{if(p==null||s.has(p))return;const f=e.stations[p];f&&(s.add(p),i.push({id:`${t.id}:${f.id}`,label:f.label,etaSeconds:Math.max(0,Math.round(d)),clockTime:rn(d),isNext:m,isTerminal:h}))};c(l,r,{isNext:!0});let u=r;for(let p=l+n;i.length<a&&!(p<0||p>=e.stations.length);p+=n){const d=p-n,m=e.stations[d];u+=Math.max(0,Math.round((m?.segmentMinutes??0)*60));const h=p===0||p===e.stations.length-1;c(p,u,{isTerminal:h})}return i}function dn(t){ne.textContent=t,da.textContent=t,et()}function et(){const t=la;if(!t||!ca)return;const a=o.dialogDisplayMode&&v.open&&ne.scrollWidth>t.clientWidth;t.classList.toggle("is-marquee",a)}function un(t,e,a,n){const s=(a-t)*Math.PI/180,l=(n-e)*Math.PI/180,r=Math.sin(s/2)**2+Math.cos(t*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(l/2)**2;return 2*6371*Math.asin(Math.sqrt(r))}function pn(t){return Math.max(1,Math.round(t/ea*60))}function mn(t){return t>=1?`${t.toFixed(1)} km walk`:`${Math.round(t*1e3)} m walk`}function fn(t){if(!t)return[];const e=tt(t),a=new Set(e.map(({line:i,station:s})=>`${i.agencyId}:${i.id}:${s.id}`)),n=new Map;for(const i of o.systemsById.values())for(const s of i.lines??[])for(const l of s.stops??[]){if(a.has(`${s.agencyId}:${s.id}:${l.id}`))continue;const r=un(t.lat,t.lon,l.lat,l.lon);if(r>aa)continue;const c=`${i.id}:${s.id}`,u=n.get(c);(!u||r<u.distanceKm)&&n.set(c,{systemId:i.id,systemName:i.name,line:s,stop:l,distanceKm:r,walkMinutes:pn(r)})}return[...n.values()].sort((i,s)=>i.distanceKm-s.distanceKm||i.line.name.localeCompare(s.line.name)).slice(0,Qt*2)}function pt(t,e=!1){if(e){E.hidden=!1,E.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">Transfers</h4>
          <p class="transfer-panel-copy">Checking nearby connections...</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">Loading transfer recommendations...</div>
        </div>
      </div>
    `;return}if(!t.length){E.hidden=!0,E.innerHTML="";return}E.hidden=!1,E.innerHTML=`
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
                    <p class="transfer-card-meta">${mn(a.distanceKm)}${a.arrival?` • To ${a.arrival.destination}`:""}</p>
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
  `}function hn(t,e){const a=Date.now(),n=[];for(const i of t){const s=V(i.stop,i.line),l=Ae(e,i.line,s),r=[...l.nb,...l.sb].sort((m,h)=>m.arrivalTime-h.arrivalTime);if(!r.length)continue;const c=a+i.walkMinutes*6e4+na,u=r.find(m=>m.arrivalTime>=c)??r[0],p=u.arrivalTime-a-i.walkMinutes*6e4,d=Math.max(0,Math.round(p/6e4));n.push({...i,arrival:u,boardAt:u.arrivalTime,badge:p<=0?"Leave now":d<=1?"Board in ~1 min":`Board in ~${d} min`,tone:d<=2?"hot":d<=8?"good":"calm",timeText:Ee(u.arrivalTime)})}return n.sort((i,s)=>i.boardAt-s.boardAt||i.distanceKm-s.distanceKm).slice(0,Qt)}function gn(){const t=ve(),e=dt(o.lines),a=S(),n=dt(t);return`
    ${ja(n)}
    ${Va(e)}
    ${n.map(({line:i,layout:s,vehicles:l,nb:r,sb:c,lineAlerts:u})=>{const p=Ka(i,s,r,c,u);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header line-card-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${i.color};">${i.name[0]}</span>
              <div class="line-title-copy">
                <h2>${i.name}</h2>
                <p>${l.length} live ${l.length===1?S().toLowerCase():b().toLowerCase()} · ${ft(i)}</p>
              </div>
            </div>
            ${ht(i)}
          </header>
          ${p||`<p class="train-readout muted">Waiting for live ${a.toLowerCase()} data…</p>`}
        </article>
      `}).join("")}
  `}function vn(){document.querySelectorAll("[data-system-switch]").forEach(e=>{e.addEventListener("click",async()=>{await Oe(e.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function rt(){document.querySelectorAll("[data-line-switch]").forEach(e=>{e.addEventListener("click",()=>{o.activeLineId=e.dataset.lineSwitch,w()})})}function It(){o.currentTrainId="",M.open&&M.close()}function Dt(){P.open&&P.close()}function Re(t){const e=j(t.id);ga.textContent=`${t.name} Alerts`,va.textContent=`${e.length} active alert${e.length===1?"":"s"}`,ya.textContent=t.name,Wt.textContent="",Wt.innerHTML=e.length?e.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${ce(a.severity)} • ${le(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||"Service alert"}</p>
              <p class="alert-dialog-item-copy">${a.description||"No additional alert details available."}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">Read official alert</a></p>`:""}
            </article>
          `).join(""):'<p class="alert-dialog-item-copy">No active alerts.</p>',Vt.hidden=!0,Vt.removeAttribute("href"),P.open||P.showModal()}function Zt(){document.querySelectorAll("[data-alert-line-id]").forEach(e=>{e.addEventListener("click",()=>{const a=o.lines.find(n=>n.id===e.dataset.alertLineId);a&&Re(a)})})}function yn(t){const e=t.fromLabel!==t.toLabel&&t.progress>0&&t.progress<1,a=e?t.fromLabel:t.previousLabel,n=e?`${t.fromLabel} -> ${t.toLabel}`:t.currentStopLabel,i=e?"Between":"Now",s=e?t.toLabel:t.upcomingLabel,l=e?t.progress:.5,r=o.layouts.get(t.lineId),c=cn(t,r),u=r?ln(t,r):t.upcomingLabel,p=c.at(-1)?.etaSeconds??Math.max(0,t.nextOffset??0),d=t.directionSymbol==="▲"?"Northbound":t.directionSymbol==="▼"?"Southbound":"In service";ma.textContent=`${t.lineName} ${S()} ${t.label}`,fa.textContent=`${d} to ${u}`,Ut.className=`train-detail-status train-list-status-${Lt(t.serviceStatus)}`,Ut.innerHTML=N(vt(t)),M.querySelector(".train-eta-panel")?.remove(),Ht.innerHTML=`
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
  `,Ht.insertAdjacentHTML("afterend",`
      <section class="train-eta-panel">
        <div class="train-eta-summary">
          <div class="metric-chip">
            <p class="metric-chip-label">Direction</p>
            <p class="metric-chip-value">${d}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">Terminal</p>
            <p class="metric-chip-value">${u}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">ETA to Terminal</p>
            <p class="metric-chip-value">${O(p)}</p>
          </div>
        </div>
        <div class="train-eta-timeline">
          <div class="train-eta-header">
            <p class="train-detail-label">Upcoming stops</p>
            <p class="train-eta-header-copy">Live ETA now</p>
          </div>
          ${c.length?c.map(m=>`
                  <article class="train-eta-stop${m.isNext?" is-next":""}${m.isTerminal?" is-terminal":""}">
                    <div>
                      <p class="train-eta-stop-label">${m.isNext?"Next stop":m.isTerminal?"Terminal":"Upcoming"}</p>
                      <p class="train-eta-stop-name">${m.label}</p>
                    </div>
                    <div class="train-eta-stop-side">
                      <p class="train-eta-stop-countdown">${O(m.etaSeconds)}</p>
                      <p class="train-eta-stop-clock">${m.clockTime}</p>
                    </div>
                  </article>
                `).join(""):'<p class="train-readout muted">No downstream ETA available for this train right now.</p>'}
        </div>
      </section>
    `),M.open||M.showModal()}function bn(){document.querySelectorAll("[data-train-id]").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.trainId,n=J().find(i=>i.id===a);n&&(o.currentTrainId=a,yn(n))})})}function $n(){o.lines.forEach(t=>{const e=o.layouts.get(t.id),a=document.querySelector(`.line-card[data-line-id="${t.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.stopId,l=e.stations.find(r=>r.id===s);l&&Ce(l)})})})}function w(){const t=H();if(ae.textContent=o.theme==="dark"?"Light":"Dark",sa.textContent=t.kicker,oa.textContent=t.title,qt.hidden=o.systemsById.size<2,qt.innerHTML=Ba(),Ne(),ee.forEach(e=>e.classList.toggle("is-active",e.dataset.tab===o.activeTab)),document.querySelector("#tab-trains").textContent=b(),vn(),o.activeTab==="map"){I.className="board";const e=ve();I.innerHTML=`${st()}${e.map(sn).join("")}`,rt(),Zt(),$n(),queueMicrotask(Z);return}if(o.activeTab==="trains"){I.className="board",I.innerHTML=`${st()}${on()}`,rt(),Zt(),bn(),queueMicrotask(Z);return}o.activeTab==="insights"&&(I.className="board",I.innerHTML=`${st()}${gn()}`,rt())}function Sn(){window.clearInterval(o.insightsTickerTimer),o.insightsTickerTimer=0}function wn(){Sn(),o.insightsTickerTimer=window.setInterval(()=>{o.insightsTickerIndex+=1,o.activeTab==="insights"&&w()},5e3)}function Ne(){K.textContent=o.error?"HOLD":"SYNC",K.classList.toggle("status-pill-error",!!o.error),ra.textContent=`Now ${oe()}`,lt.textContent=o.error?"Using last successful snapshot":Ta(o.fetchedAt),_t.textContent=K.textContent,_t.classList.toggle("status-pill-error",!!o.error),pa.textContent=lt.textContent}function Ln(){window.clearTimeout(o.liveRefreshTimer),o.liveRefreshTimer=0}function Tn(){Ln();const t=()=>{o.liveRefreshTimer=window.setTimeout(async()=>{await Mt(),t()},Ze)};t()}function Pe(t){const e=o.systemsById.has(t)?t:q,a=o.systemsById.get(e);o.activeSystemId=e,o.lines=a?.lines??[],o.layouts=o.layoutsBySystem.get(e)??new Map,o.lines.some(n=>n.id===o.activeLineId)||(o.activeLineId=o.lines[0]?.id??""),o.vehiclesByLine=new Map,o.rawVehicles=[],o.arrivalsCache.clear(),o.alerts=[],o.error="",o.fetchedAt="",o.insightsTickerIndex=0}async function Oe(t,{updateUrl:e=!0,preserveDialog:a=!1}={}){if(!o.systemsById.has(t)||o.activeSystemId===t){e&&zt(o.activeSystemId);return}Pe(t),a||Ie(),It(),Dt(),w(),e&&zt(t),await Mt()}async function In(){const a=(await(await fetch(Ge,{cache:"no-store"})).json()).systems??[];o.systemsById=new Map(a.map(n=>[n.id,n])),o.layoutsBySystem=new Map(a.map(n=>[n.id,new Map(n.lines.map(i=>[i.id,Ea(i)]))])),Pe(Te())}function Dn(t){const e=[...new Set((t.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=o.lines.filter(n=>e.includes(De(n))).map(n=>n.id);return a.length?{id:t.id,effect:t.reason??"SERVICE ALERT",severity:t.severity??"INFO",title:t.summary?.value??"Service alert",description:t.description?.value??"",url:t.url?.value??"",lineIds:a,stopIds:[...new Set((t.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function Mt(){try{const t=await pe(Sa(),"Realtime");o.error="",o.fetchedAt=new Date().toISOString(),o.rawVehicles=t.data.list??[],o.alerts=(t.data.references?.situations??[]).map(Dn).filter(Boolean);const e=new Map((t.data.references?.trips??[]).map(i=>[i.id,i]));for(const i of o.lines){const s=o.layouts.get(i.id),l=o.rawVehicles.map(r=>_a(r,i,s,e)).filter(Boolean);o.vehiclesByLine.set(i.id,l)}const a=Se(dt(o.lines)),n=o.systemSnapshots.get(o.activeSystemId);o.systemSnapshots.set(o.activeSystemId,{previous:n?.current??null,current:a})}catch(t){o.error="Realtime offline",console.error(t)}w()}async function Mn(){se(La()),jt(),await In(),w(),await Mt(),await Xt(),window.addEventListener("popstate",()=>{Xt().catch(console.error)});const t=()=>{const a=o.compactLayout;if(jt(),et(),a!==o.compactLayout){w();return}Z()};window.addEventListener("resize",t),window.visualViewport?.addEventListener("resize",t),new ResizeObserver(()=>{Z()}).observe(I),Tn(),wn(),window.setInterval(()=>{Ne(),Za(),qa()},1e3)}Mn().catch(t=>{K.textContent="FAIL",lt.textContent=t.message});
