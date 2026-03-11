(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=a(s);fetch(s.href,o)}})();const ta="modulepreload",aa=function(e){return"/link/dev/"+e},_e={},na=function(t,a,i){let s=Promise.resolve();if(a&&a.length>0){let u=function(m){return Promise.all(m.map(p=>Promise.resolve(p).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};var l=u;document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),d=r?.nonce||r?.getAttribute("nonce");s=u(a.map(m=>{if(m=aa(m),m in _e)return;_e[m]=!0;const p=m.endsWith(".css"),g=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${g}`))return;const f=document.createElement("link");if(f.rel=p?"stylesheet":ta,p||(f.as="script"),f.crossOrigin="",f.href=m,d&&f.setAttribute("nonce",d),document.head.appendChild(f),p)return new Promise((h,v)=>{f.addEventListener("load",h),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${m}`)))})}))}function o(r){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=r,window.dispatchEvent(d),!d.defaultPrevented)throw r}return s.then(r=>{for(const d of r||[])d.status==="rejected"&&o(d.reason);return t().catch(o)})};function ia(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:i,onRegistered:s,onRegisteredSW:o,onRegisterError:l}=e;let r,d;const u=async(p=!0)=>{await d};async function m(){if("serviceWorker"in navigator){if(r=await na(async()=>{const{Workbox:p}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:p}},[]).then(({Workbox:p})=>new p("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(p=>{l?.(p)}),!r)return;r.addEventListener("activated",p=>{(p.isUpdate||p.isExternal)&&window.location.reload()}),r.addEventListener("installed",p=>{p.isUpdate||i?.()}),r.register({immediate:t}).then(p=>{o?o("/link/dev/sw.js",p):s?.(p)}).catch(p=>{l?.(p)})}}return d=m(),u}const sa="./pulse-data.json",it="https://api.pugetsound.onebusaway.org/api/where",be="TEST".trim()||"TEST",M=be==="TEST",oa=M?6e4:2e4,Ue=3,ra=800,la=M?2e4:5e3,Fe=M?12e4:3e4,He=M?1200:0,ie=M?1:3,ca=1100,da=M?45e3:15e3,ua=M?9e4:3e4,pa=4e3,ma=15e3,ga=4.8,ha=.35,fa=45e3,st=4,ot="link-pulse-theme",rt="link-pulse-language",q="link",Z={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},Ve={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}},n={fetchedAt:"",error:"",activeSystemId:q,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,language:"en"},va=ia({immediate:!0,onNeedRefresh(){va(!0)}});document.querySelector("#app").innerHTML=`
  <main class="screen">
    <header class="screen-header">
      <div>
        <p id="screen-kicker" class="screen-kicker">SEATTLE LIGHT RAIL</p>
        <h1 id="screen-title">LINK PULSE</h1>
      </div>
      <div class="screen-meta">
        <button id="language-toggle" class="theme-toggle" type="button" aria-label="Switch to Chinese">中文</button>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">Light</button>
        <p id="status-pill" class="status-pill">SYNC</p>
        <p id="current-time" class="updated-at">Now --:--</p>
        <p id="updated-at" class="updated-at">Waiting for snapshot</p>
      </div>
    </header>
    <div class="switcher-stack">
      <section id="system-bar" class="tab-bar system-bar" aria-label="Transit systems"></section>
      <section id="view-bar" class="tab-bar" aria-label="Board views">
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
          <h4 id="arrivals-title-nb" class="arrivals-title">Northbound (▲)</h4>
          <div id="arrivals-nb-pinned" class="arrivals-pinned"></div>
          <div class="arrivals-viewport"><div id="arrivals-nb" class="arrivals-list"></div></div>
        </div>
        <div class="arrivals-section" data-direction-section="sb">
          <h4 id="arrivals-title-sb" class="arrivals-title">Southbound (▼)</h4>
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
`;const I=document.querySelector("#board"),ya=document.querySelector("#screen-kicker"),$a=document.querySelector("#screen-title"),se=document.querySelector("#system-bar"),ba=document.querySelector("#view-bar"),ue=[...document.querySelectorAll(".tab-button")],pe=document.querySelector("#language-toggle"),me=document.querySelector("#theme-toggle"),Y=document.querySelector("#status-pill"),Sa=document.querySelector("#current-time"),ge=document.querySelector("#updated-at"),y=document.querySelector("#station-dialog"),wa=document.querySelector("#dialog-title"),La=document.querySelector("#dialog-title-track"),lt=document.querySelector("#dialog-title-text"),Ta=document.querySelector("#dialog-title-text-clone"),ct=document.querySelector("#dialog-service-summary"),We=document.querySelector("#dialog-status-pill"),Ca=document.querySelector("#dialog-updated-at"),U=document.querySelector("#dialog-display"),dt=[...document.querySelectorAll("[data-dialog-direction]")],Ia=document.querySelector("#arrivals-title-nb"),Aa=document.querySelector("#arrivals-title-sb"),_=document.querySelector("#station-alerts-container"),R=document.querySelector("#transfer-section"),je=document.querySelector("#arrivals-nb-pinned"),F=document.querySelector("#arrivals-nb"),Ge=document.querySelector("#arrivals-sb-pinned"),H=document.querySelector("#arrivals-sb"),A=document.querySelector("#train-dialog"),ut=document.querySelector("#train-dialog-title"),pt=document.querySelector("#train-dialog-subtitle"),Ke=document.querySelector("#train-dialog-line"),Ye=document.querySelector("#train-dialog-status"),mt=document.querySelector("#train-dialog-close"),D=document.querySelector("#alert-dialog"),gt=document.querySelector("#alert-dialog-title"),ht=document.querySelector("#alert-dialog-subtitle"),xa=document.querySelector("#alert-dialog-lines"),Xe=document.querySelector("#alert-dialog-body"),he=document.querySelector("#alert-dialog-link"),ft=document.querySelector("#alert-dialog-close");U.addEventListener("click",()=>ln());mt.addEventListener("click",()=>ke());ft.addEventListener("click",()=>Ee());pe.addEventListener("click",()=>{yt(n.language==="en"?"zh-CN":"en"),w()});dt.forEach(e=>{e.addEventListener("click",()=>{n.dialogDisplayDirection=e.dataset.dialogDirection,n.dialogDisplayDirection==="auto"&&(n.dialogDisplayAutoPhase="nb"),Ae()})});y.addEventListener("click",e=>{e.target===y&&Pt()});A.addEventListener("click",e=>{e.target===A&&ke()});D.addEventListener("click",e=>{e.target===D&&Ee()});y.addEventListener("close",()=>{xe(),De(),Ie(),Ce(!1),n.isSyncingFromUrl||zt()});ue.forEach(e=>{e.addEventListener("click",()=>{n.activeTab=e.dataset.tab,w()})});me.addEventListener("click",()=>{vt(n.theme==="dark"?"light":"dark"),w()});function P(){return Z[n.activeSystemId]??Z[q]}function Da(){return n.systemsById.get(n.activeSystemId)?.agencyId??Z[q].agencyId}function Ma(){return`${it}/vehicles-for-agency/${Da()}.json?key=${be}`}function S(){return n.language==="zh-CN"?P().vehicleLabel==="Train"?"列车":"公交":P().vehicleLabel??"Vehicle"}function Na(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function $(){return n.language==="zh-CN"?S():P().vehicleLabelPlural??Na(S())}function ka(){return Ve[n.language]??Ve.en}function c(e,...t){const a=ka()[e];return typeof a=="function"?a(...t):a}function J(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function Ea(){const e=window.localStorage.getItem(ot);return e==="light"||e==="dark"?e:"dark"}function Ra(){const e=window.localStorage.getItem(rt);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function vt(e){n.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(ot,e)}function yt(e){n.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=n.language,window.localStorage.setItem(rt,n.language)}function Ze(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);n.compactLayout=i<=ca}function Q(){const a=window.getComputedStyle(I).gridTemplateColumns.split(" ").map(i=>i.trim()).filter(Boolean).length<=1;a!==n.compactLayout&&(n.compactLayout=a,w())}function X(e){return e.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function oe(e,t,a){return Math.max(t,Math.min(e,a))}function za(e){if(!e)return c("waitingSnapshot");const t=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return t<10?c("updatedNow"):t<60?c("updatedSecondsAgo",t):c("updatedMinutesAgo",Math.round(t/60))}function fe(){return new Intl.DateTimeFormat(n.language==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:n.language!=="zh-CN"}).format(new Date)}function B(e){if(e<=0)return c("arriving");const t=Math.floor(e/60),a=e%60;return n.language==="zh-CN"?t>0?`${t}分 ${a}秒`:`${a}秒`:t>0?`${t}m ${a}s`:`${a}s`}function Oa(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function re(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function Pa(e){const[t="0",a="0",i="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(i)}function z(e,t){if(!e||!t)return null;const[a,i,s]=e.split("-").map(Number),o=Pa(t),l=Math.floor(o/3600),r=Math.floor(o%3600/60),d=o%60;return new Date(a,i-1,s,l,r,d)}function K(e){const t=Math.max(0,Math.round(e/6e4)),a=Math.floor(t/60),i=t%60;return n.language==="zh-CN"?a&&i?`${a}小时${i}分钟`:a?`${a}小时`:`${i}分钟`:a&&i?`${a}h ${i}m`:a?`${a}h`:`${i}m`}function C(e){if(!e)return"";const[t="0",a="0"]=String(e).split(":"),i=Number(t),s=Number(a),o=(i%24+24)%24;if(n.language==="zh-CN")return`${String(o).padStart(2,"0")}:${String(s).padStart(2,"0")}`;const l=o>=12?"PM":"AM";return`${o%12||12}:${String(s).padStart(2,"0")} ${l}`}function Se(e){const t=Oa(),a=e.serviceSpansByDate?.[t];return a?c("todayServiceSpan",C(a.start),C(a.end)):c("todayServiceUnavailable")}function $t(e){const t=new Date,a=re(-1),i=re(0),s=re(1),o=e.serviceSpansByDate?.[a],l=e.serviceSpansByDate?.[i],r=e.serviceSpansByDate?.[s],u=[o&&{kind:"yesterday",start:z(a,o.start),end:z(a,o.end),span:o},l&&{kind:"today",start:z(i,l.start),end:z(i,l.end),span:l}].filter(Boolean).find(m=>t>=m.start&&t<=m.end);if(u)return{tone:"active",headline:c("lastTrip",C(u.span.end)),detail:c("endsIn",K(u.end.getTime()-t.getTime())),compact:c("endsIn",K(u.end.getTime()-t.getTime()))};if(l){const m=z(i,l.start),p=z(i,l.end);if(t<m)return{tone:"upcoming",headline:c("firstTrip",C(l.start)),detail:c("startsIn",K(m.getTime()-t.getTime())),compact:c("startsIn",K(m.getTime()-t.getTime()))};if(t>p)return{tone:"ended",headline:c("serviceEnded",C(l.end)),detail:r?c("nextStart",C(r.start)):c("noNextServiceLoaded"),compact:r?c("nextStart",C(r.start)):c("ended")}}return r?{tone:"upcoming",headline:c("nextFirstTrip",C(r.start)),detail:c("noServiceRemainingToday"),compact:c("nextStart",C(r.start))}:{tone:"muted",headline:c("serviceHoursUnavailable"),detail:c("staticScheduleMissing"),compact:c("unavailable")}}function we(e){const t=$t(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function Ba(e){const t=ae(e).map(({line:a})=>{const i=$t(a);return`${a.name}: ${i.compact}`}).slice(0,3);ct.textContent=t.join("  ·  ")||c("serviceSummaryUnavailable")}function bt(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function St(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function G(e){return n.alerts.filter(t=>t.lineIds.includes(e))}function wt(e,t){const a=G(t.id);if(!a.length)return[];const i=new Set(j(e,t));return i.add(e.id),a.filter(s=>s.stopIds.length>0&&s.stopIds.some(o=>i.has(o)))}function qa(e){const t=new Set,a=[];for(const{station:i,line:s}of ae(e))for(const o of wt(i,s))t.has(o.id)||(t.add(o.id),a.push(o));return a}function Lt(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${c("alertsWord",e.length)}</span>
    </button>
  `:""}function Le(e){return new Promise(t=>window.setTimeout(t,e))}function _a(){const e=Math.max(0,n.obaRateLimitStreak-1),t=Math.min(Fe,la*2**e),a=Math.round(t*(.15+Math.random()*.2));return Math.min(Fe,t+a)}async function Ua(){const e=n.obaCooldownUntil-Date.now();e>0&&await Le(e)}function Fa(e){return e?.code===429||/rate limit/i.test(e?.text??"")}async function Tt(e,t){for(let a=0;a<=Ue;a+=1){await Ua();const i=await fetch(e,{cache:"no-store"});let s=null;try{s=await i.json()}catch{s=null}const o=i.status===429||Fa(s);if(i.ok&&!o)return n.obaRateLimitStreak=0,n.obaCooldownUntil=0,s;if(a===Ue||!o)throw s?.text?new Error(s.text):new Error(`${t} request failed with ${i.status}`);n.obaRateLimitStreak+=1;const l=ra*2**a,r=Math.max(l,_a());n.obaCooldownUntil=Date.now()+r,await Le(r)}throw new Error(`${t} request failed`)}function Ha(e){const t=[...e.stops].sort((p,g)=>g.sequence-p.sequence),a=48,i=44,s=28,o=88,l=122,r=i+s+(t.length-1)*a,d=new Map,u=t.map((p,g)=>{const f={...p,label:J(p.name),y:i+g*a,index:g,isTerminal:g===0||g===t.length-1};d.set(p.id,g),d.set(`${e.agencyId}_${p.id}`,g);for(const h of e.stationAliases?.[p.id]??[])d.set(h,g),d.set(`${e.agencyId}_${h}`,g);return f});let m=0;for(let p=0;p<u.length;p+=1)u[p].cumulativeMinutes=m,m+=p<u.length-1?u[p].segmentMinutes:0;return{totalMinutes:m,height:r,labelX:l,stationGap:a,stationIndexByStopId:d,stations:u,trackX:o}}function Va(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function Wa(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase();t.closestStopTimeOffset;const i=t.nextStopTimeOffset??0,s=t.scheduleDeviation??0,o=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||o&&Math.abs(i)<=90?"ARR":s>=120?"DELAY":"OK"}function ja(e,t){if(!t)return{text:c("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:c("onTime"),colorClass:"status-ontime"};if(e>60){const a=Math.round(e/60);let i="status-late-minor";return e>600?i="status-late-severe":e>300&&(i="status-late-moderate"),{text:n.language==="zh-CN"?`晚点 ${a} 分钟`:`+${a} min late`,colorClass:i}}if(e<-60){const a=Math.round(Math.abs(e)/60);return{text:n.language==="zh-CN"?`早到 ${a} 分钟`:`${a} min early`,colorClass:"status-early"}}return{text:c("unknown"),colorClass:"status-muted"}}function Ga(e){switch(e){case"ARR":return c("arrivingStatus");case"DELAY":return c("delayedStatus");case"OK":return c("enRoute");default:return""}}function L(e){if(!n.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(n.fetchedAt).getTime())/1e3));return e-t}function V(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function Te(e){const t=L(e.nextOffset??0),a=L(e.closestOffset??0),i=e.delayInfo.text;return t<=15?[{text:c("arrivingNow"),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:c("arrivingIn",B(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:c("nextStopIn",B(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:[{text:Ga(e.serviceStatus),toneClass:V(e,t)},{text:i,toneClass:e.delayInfo.colorClass}]}function O(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function Ct(e){const t=L(e.nextOffset??0),a=L(e.closestOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel,[s,o]=Te(e);return t<=15?`${e.label} at ${i} ${O([s,o])}`:t<=90?`${e.label} at ${i} ${O([s,o])}`:a<0&&t>0?`${e.label} ${i} ${O([s,o])}`:`${e.label} to ${i} ${O([s,o])}`}function It(e){return O(Te(e))}function At(e,t){if(!t.length)return"";const a=[...t].sort((s,o)=>L(s.nextOffset??0)-L(o.nextOffset??0)).slice(0,8),i=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${i.map(s=>`
          <span
            class="line-marquee-item ${V(s,L(s.nextOffset??0))}"
            data-vehicle-marquee="${s.id}"
          >
            <span class="line-marquee-token">${s.lineToken}</span>
            <span class="line-marquee-copy">${Ct(s)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function Ka(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const i=a.dataset.vehicleStatus,s=ee().find(l=>l.id===i);if(!s)return;const o=L(s.nextOffset??0);a.innerHTML=It(s),a.className=`train-list-status ${V(s,o)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const i=a.dataset.vehicleMarquee,s=ee().find(r=>r.id===i);if(!s)return;const o=L(s.nextOffset??0);a.className=`line-marquee-item ${V(s,o)}`;const l=a.querySelector(".line-marquee-copy");l&&(l.innerHTML=Ct(s))})}function Ya(e,t,a,i){const s=e.tripStatus?.activeTripId??e.tripId??"",o=i.get(s);if(!o||o.routeId!==t.routeKey)return null;const l=e.tripStatus?.closestStop,r=e.tripStatus?.nextStop,d=a.stationIndexByStopId.get(l),u=a.stationIndexByStopId.get(r);if(d==null&&u==null)return null;let m=d??u,p=u??d;if(m>p){const ea=m;m=p,p=ea}const g=a.stations[m],f=a.stations[p],h=e.tripStatus?.closestStopTimeOffset??0,v=e.tripStatus?.nextStopTimeOffset??0,b=o.directionId==="1"?"▲":o.directionId==="0"?"▼":Va(d,u);let T=0;m!==p&&h<0&&v>0&&(T=oe(Math.abs(h)/(Math.abs(h)+v),0,1));const N=g.y+(f.y-g.y)*T,k=m!==p?g.segmentMinutes:0,x=g.cumulativeMinutes+k*T,E=d??u??m,ze=a.stations[E]??g,Oe=b==="▲",Xt=oe(E+(Oe?1:-1),0,a.stations.length-1),Pe=d!=null&&u!=null&&d!==u?u:oe(E+(Oe?-1:1),0,a.stations.length-1),Zt=a.stations[Xt]??ze,Jt=a.stations[Pe]??f,Be=e.tripStatus?.scheduleDeviation??0,qe=e.tripStatus?.predicted??!1,Qt=ja(Be,qe);return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:b,fromLabel:g.label,minutePosition:x,progress:T,serviceStatus:Wa(e),toLabel:f.label,y:N,currentLabel:g.label,nextLabel:f.label,previousLabel:Zt.label,currentStopLabel:ze.label,upcomingLabel:Jt.label,currentIndex:E,upcomingStopIndex:Pe,status:e.tripStatus?.status??"",closestStop:l,nextStop:r,closestOffset:h,nextOffset:v,scheduleDeviation:Be,isPredicted:qe,delayInfo:Qt,rawVehicle:e}}function xt(e){return e.fromLabel===e.toLabel||e.progress===0?n.language==="zh-CN"?`位于 ${e.fromLabel}`:`At ${e.fromLabel}`:`${e.fromLabel} -> ${e.toLabel}`}function ee(){return n.lines.flatMap(e=>(n.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function Xa(){return Object.values(Z).filter(e=>n.systemsById.has(e.id)).map(e=>`
        <button
          class="tab-button ${e.id===n.activeSystemId?"is-active":""}"
          data-system-switch="${e.id}"
          type="button"
        >
          ${e.label}
        </button>
      `).join("")}function le(){return!n.compactLayout||n.lines.length<2?"":`<section class="line-switcher">${n.lines.map(t=>`
        <button
          class="line-switcher-button ${t.id===n.activeLineId?"is-active":""}"
          data-line-switch="${t.id}"
          type="button"
          style="--line-color:${t.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <span>${t.name}</span>
        </button>
      `).join("")}</section>`}function Dt(){return n.compactLayout?n.lines.filter(e=>e.id===n.activeLineId):n.lines}function W(e,t){const a=[...e].sort((o,l)=>o.minutePosition-l.minutePosition),i=[...t].sort((o,l)=>o.minutePosition-l.minutePosition),s=o=>o.slice(1).map((l,r)=>Math.round(l.minutePosition-o[r].minutePosition));return{nbGaps:s(a),sbGaps:s(i)}}function Za(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((s,o)=>s+o,0)/e.length,a=Math.max(...e),i=Math.min(...e);return{avg:Math.round(t),max:a,min:i,spread:a-i,ratio:a/Math.max(i,1)}}function te(e,t){const a=Za(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let i="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?i="bunched":a.max>=12||a.spread>=6?i="uneven":a.avg>=18&&(i="sparse"),{health:i,stats:a}}function Ja(e,t){if(!e.length||t<2)return{averageText:"—",detailText:n.language==="zh-CN"?`${$()}数量不足，无法判断间隔`:`Too few ${$().toLowerCase()} for a spacing read`};const a=Math.round(e.reduce((o,l)=>o+l,0)/e.length),i=Math.min(...e),s=Math.max(...e);return{averageText:`~${a} min`,detailText:n.language==="zh-CN"?`观测间隔 ${i}-${s} 分钟`:`${i}-${s} min observed gap`}}function Je(e,t,a){const{averageText:i,detailText:s}=Ja(t,a);return`
    <div class="headway-health-card">
      <p class="headway-health-label">${e}</p>
      <p class="headway-health-value">${i}</p>
      <p class="headway-health-copy">${s}</p>
    </div>
  `}function Mt(e){return e.reduce((t,a)=>{const i=Number(a.scheduleDeviation??0);return i<=60?t.onTime+=1:i<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function Nt(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function Qa(e,t){return Math.abs(e.length-t.length)<=1?{label:n.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:e.length>t.length?{label:n.language==="zh-CN"?"▲ 偏多":"▲ Heavier",tone:"warn"}:{label:n.language==="zh-CN"?"▼ 偏多":"▼ Heavier",tone:"warn"}}function en(e,t){return`
    <div class="delay-distribution">
      ${[[n.language==="zh-CN"?"准点":"On time",e.onTime,"healthy"],[n.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",e.minorLate,"warn"],[n.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",e.severeLate,"alert"]].map(([i,s,o])=>`
        <div class="delay-chip delay-chip-${o}">
          <p class="delay-chip-label">${i}</p>
          <p class="delay-chip-value">${s}</p>
          <p class="delay-chip-copy">${Nt(s,t)}</p>
        </div>
      `).join("")}
    </div>
  `}function Qe(e,t,a,i){if(!t.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${e}</p>
          <p class="flow-lane-copy">${c("noLiveVehicles",$().toLowerCase())}</p>
        </div>
      </div>
    `;const s=[...t].sort((l,r)=>l.minutePosition-r.minutePosition),o=s.map(l=>{const r=a.totalMinutes>0?l.minutePosition/a.totalMinutes:0;return Math.max(0,Math.min(100,r*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${e}</p>
        <p class="flow-lane-copy">${c("liveCount",s.length,s.length===1?S().toLowerCase():$().toLowerCase())}</p>
      </div>
      <div class="flow-track" style="--line-color:${i};">
        ${o.map((l,r)=>`
          <span
            class="flow-vehicle"
            style="left:${l}%; --line-color:${i};"
            title="${s[r].label} · ${xt(s[r])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function kt(e,t,a,i){const s=[],{stats:o}=te(W(t,[]).nbGaps,t.length),{stats:l}=te(W([],a).sbGaps,a.length),r=[...t,...a].filter(u=>Number(u.scheduleDeviation??0)>300),d=Math.abs(t.length-a.length);return o.max!=null&&o.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`▲ 方向当前有 ${o.max} 分钟的服务空档。`:`Direction ▲ has a ${o.max} min service hole right now.`}),l.max!=null&&l.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`▼ 方向当前有 ${l.max} 分钟的服务空档。`:`Direction ▼ has a ${l.max} min service hole right now.`}),d>=2&&s.push({tone:"warn",copy:t.length>a.length?n.language==="zh-CN"?`车辆分布向 ▲ 方向偏多 ${d} 辆。`:`Vehicle distribution is tilted toward ▲ by ${d}.`:n.language==="zh-CN"?`车辆分布向 ▼ 方向偏多 ${d} 辆。`:`Vehicle distribution is tilted toward ▼ by ${d}.`}),r.length&&s.push({tone:"warn",copy:n.language==="zh-CN"?`${r.length} 辆${r.length===1?S().toLowerCase():$().toLowerCase()}晚点超过 5 分钟。`:`${r.length} ${r.length===1?S().toLowerCase():$().toLowerCase()} are running 5+ min late.`}),i.length&&s.push({tone:"info",copy:n.language==="zh-CN"?`${e.name} 当前受 ${i.length} 条告警影响。`:`${i.length} active alert${i.length===1?"":"s"} affecting ${e.name}.`}),s.length||s.push({tone:"healthy",copy:n.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),s.slice(0,4)}function ve(e){return e.map(t=>{const a=n.layouts.get(t.id),i=n.vehiclesByLine.get(t.id)??[],s=i.filter(r=>r.directionSymbol==="▲"),o=i.filter(r=>r.directionSymbol==="▼"),l=G(t.id);return{line:t,layout:a,vehicles:i,nb:s,sb:o,lineAlerts:l,exceptions:kt(t,s,o,l)}})}function Et(e){const t=e.length,a=e.reduce((v,b)=>v+b.vehicles.length,0),i=e.reduce((v,b)=>v+b.lineAlerts.length,0),s=e.filter(v=>v.lineAlerts.length>0).length,o=e.flatMap(v=>v.vehicles),l=Mt(o),r=new Set(e.filter(v=>v.vehicles.some(b=>Number(b.scheduleDeviation??0)>300)).map(v=>v.line.id)),d=new Set(e.filter(v=>{const{nbGaps:b,sbGaps:T}=W(v.nb,v.sb),N=te(b,v.nb.length).health,k=te(T,v.sb.length).health;return[N,k].some(x=>x==="uneven"||x==="bunched"||x==="sparse")}).map(v=>v.line.id)),u=new Set([...r,...d]).size,m=Math.max(0,t-u),p=a?Math.round(l.onTime/a*100):null,g=e.map(v=>{const{nbGaps:b,sbGaps:T}=W(v.nb,v.sb),N=[...b,...T].length?Math.max(...b,...T):0,k=v.vehicles.filter(E=>Number(E.scheduleDeviation??0)>300).length,x=v.lineAlerts.length*5+k*3+Math.max(0,N-10);return{line:v.line,score:x,worstGap:N,severeLateCount:k,alertCount:v.lineAlerts.length}}).sort((v,b)=>b.score-v.score||b.worstGap-v.worstGap);let f={tone:"healthy",copy:n.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const h=g[0]??null;return h?.alertCount?f={tone:"info",copy:n.language==="zh-CN"?`${h.line.name} 当前有 ${h.alertCount} 条生效告警。`:`${h.line.name} has ${h.alertCount} active alert${h.alertCount===1?"":"s"}.`}:h?.worstGap>=12?f={tone:"alert",copy:n.language==="zh-CN"?`当前最大实时间隔为空 ${h.line.name} 的 ${h.worstGap} 分钟。`:`Largest live gap: ${h.worstGap} min on ${h.line.name}.`}:h?.severeLateCount&&(f={tone:"warn",copy:n.language==="zh-CN"?`${h.line.name} 有 ${h.severeLateCount} 辆${h.severeLateCount===1?S().toLowerCase():$().toLowerCase()}晚点超过 5 分钟。`:`${h.line.name} has ${h.severeLateCount} ${h.severeLateCount===1?S().toLowerCase():$().toLowerCase()} running 5+ min late.`}),{totalLines:t,totalVehicles:a,totalAlerts:i,impactedLines:s,delayedLineIds:r,unevenLineIds:d,attentionLineCount:u,healthyLineCount:m,onTimeRate:p,rankedLines:g,topIssue:f}}function et(e,t,{suffix:a="",invert:i=!1}={}){if(e==null||t==null||e===t)return n.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const s=e-t,o=i?s<0:s>0,l=s>0?"↑":"↓";return n.language==="zh-CN"?`${o?"改善":"变差"} ${l} ${Math.abs(s)}${a}`:`${o?"Improving":"Worse"} ${l} ${Math.abs(s)}${a}`}function tn(e){const t=Et(e),a=n.systemSnapshots.get(n.activeSystemId)?.previous??null,i=[];t.totalAlerts>0&&i.push({tone:"info",copy:n.language==="zh-CN"?`${t.impactedLines} 条线路共受 ${t.totalAlerts} 条告警影响。`:`${t.totalAlerts} active alert${t.totalAlerts===1?"":"s"} across ${t.impactedLines} line${t.impactedLines===1?"":"s"}.`}),t.delayedLineIds.size>0&&i.push({tone:"warn",copy:n.language==="zh-CN"?`${t.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${t.delayedLineIds.size} line${t.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),t.unevenLineIds.size>0&&i.push({tone:"alert",copy:n.language==="zh-CN"?`${t.unevenLineIds.size} 条线路当前发车间隔不均。`:`${t.unevenLineIds.size} line${t.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),i.length||i.push({tone:"healthy",copy:n.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const s=[{label:n.language==="zh-CN"?"准点率":"On-Time Rate",value:t.onTimeRate!=null?`${t.onTimeRate}%`:"—",delta:et(t.onTimeRate,a?.onTimeRate,{suffix:"%"})},{label:n.language==="zh-CN"?"需关注线路":"Attention Lines",value:t.attentionLineCount,delta:et(t.attentionLineCount,a?.attentionLineCount,{invert:!0})}];return`
    <article class="panel-card panel-card-wide system-summary-card">
      <header class="panel-header">
        <div class="system-summary-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:var(--accent-strong);">${P().label[0]}</span>
            <div class="line-title-copy">
              <h2>${P().label} ${n.language==="zh-CN"?"概览":"Summary"}</h2>
              <p>${n.language==="zh-CN"?`系统内 ${t.totalLines} 条线路 · 更新于 ${fe()}`:`${t.totalLines} line${t.totalLines===1?"":"s"} in system · Updated ${fe()}`}</p>
            </div>
          </div>
        </div>
      </header>
      <div class="system-summary-hero">
        <div class="insight-exception insight-exception-${t.topIssue.tone}">
          <p>${t.topIssue.copy}</p>
        </div>
        <div class="system-trend-strip">
          ${s.map(o=>`
            <div class="metric-chip system-trend-chip">
              <p class="metric-chip-label">${o.label}</p>
              <p class="metric-chip-value">${o.value}</p>
              <p class="system-trend-copy">${o.delta}</p>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="metric-strip system-summary-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"健康线路":"Healthy Lines"}</p>
          <p class="metric-chip-value">${t.healthyLineCount}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?`实时${$()}`:`Live ${$()}`}</p>
          <p class="metric-chip-value">${t.totalVehicles}</p>
        </div>
        <div class="metric-chip ${t.totalAlerts?"metric-chip-warn":"metric-chip-healthy"}">
          <p class="metric-chip-label">${n.language==="zh-CN"?"告警":"Alerts"}</p>
          <p class="metric-chip-value">${t.totalAlerts}</p>
        </div>
        <div class="metric-chip ${t.attentionLineCount?"metric-chip-warn":"metric-chip-healthy"}">
          <p class="metric-chip-label">${n.language==="zh-CN"?"需关注线路":"Lines Needing Attention"}</p>
          <p class="metric-chip-value">${t.attentionLineCount}</p>
        </div>
      </div>
      <div class="system-ranking">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${n.language==="zh-CN"?"关注排名":"Attention Ranking"}</p>
          <p class="headway-chart-copy">${n.error?n.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":n.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p>
        </div>
        <div class="system-ranking-list">
          ${t.rankedLines.slice(0,3).map(({line:o,score:l,worstGap:r,alertCount:d,severeLateCount:u})=>`
            <div class="system-ranking-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${o.color};">${o.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${o.name}</p>
                  <p class="headway-chart-copy">${n.language==="zh-CN"?`评分 ${l}${r?` · 最大间隔 ${r} 分钟`:""}${d?` · ${d} 条告警`:""}${u?` · ${u} 辆严重晚点`:""}`:`Score ${l}${r?` · gap ${r} min`:""}${d?` · ${d} alert${d===1?"":"s"}`:""}${u?` · ${u} severe late`:""}`}</p>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${n.language==="zh-CN"?"系统状态":"System Status"}</p>
          <p class="headway-chart-copy">${n.error?n.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":n.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p>
        </div>
        ${i.map(o=>`
          <div class="insight-exception insight-exception-${o.tone}">
            <p>${o.copy}</p>
          </div>
        `).join("")}
      </div>
    </article>
  `}function an(e){const t=e.flatMap(l=>l.exceptions.map(r=>({tone:r.tone,copy:`${l.line.name}: ${r.copy}`,lineColor:l.line.color})));if(!t.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${n.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">${n.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span>
        </div>
      </section>
    `;const a=nn(),i=Math.ceil(t.length/a),s=n.insightsTickerIndex%i,o=t.slice(s*a,s*a+a);return`
    <section class="insights-ticker" aria-label="${n.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}">
      <div class="insights-ticker-viewport">
        ${o.map(l=>`
              <span class="insights-ticker-item insights-ticker-item-${l.tone} insights-ticker-item-animated">
                <span class="insights-ticker-dot" style="--line-color:${l.lineColor};"></span>
                <span class="insights-ticker-copy">${l.copy}</span>
              </span>
            `).join("")}
      </div>
    </section>
  `}function nn(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);return i>=1680?3:i>=980?2:1}function sn(e,t,a,i,s){const o=a.length+i.length;if(!o)return"";const{nbGaps:l,sbGaps:r}=W(a,i),d=[...a,...i],u=Mt(d),m=[...l,...r].length?Math.max(...l,...r):null,p=Qa(a,i),g=kt(e,a,i,s),f=new Set(s.flatMap(h=>h.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"运营中":"In Service"}</p>
          <p class="metric-chip-value">${o}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"准点率":"On-Time Rate"}</p>
          <p class="metric-chip-value">${Nt(u.onTime,o)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"最大间隔":"Worst Gap"}</p>
          <p class="metric-chip-value">${m!=null?`${m} min`:"—"}</p>
        </div>
        <div class="metric-chip metric-chip-${p.tone}">
          <p class="metric-chip-label">${n.language==="zh-CN"?"方向平衡":"Balance"}</p>
          <p class="metric-chip-value">${p.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${Je(n.language==="zh-CN"?"▲ 方向":"Direction ▲",l,a.length)}
        ${Je(n.language==="zh-CN"?"▼ 方向":"Direction ▼",r,i.length)}
      </div>
      ${en(u,o)}
      <div class="flow-grid">
        ${Qe(n.language==="zh-CN"?"▲ 方向流向":"Direction ▲ Flow",a,t,e.color)}
        ${Qe(n.language==="zh-CN"?"▼ 方向流向":"Direction ▼ Flow",i,t,e.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${n.language==="zh-CN"?"当前":"Now"}</p>
          <p class="headway-chart-copy">${s.length?n.language==="zh-CN"?`${s.length} 条生效告警${f?` · 影响 ${f} 个站点`:""}`:`${s.length} active alert${s.length===1?"":"s"}${f?` · ${f} impacted stops`:""}`:n.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p>
        </div>
        ${g.map(h=>`
          <div class="insight-exception insight-exception-${h.tone}">
            <p>${h.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function Rt(e,t=!1){const a=Date.now(),i=o=>{const l=o.arrivalTime,r=Math.floor((l-a)/1e3),d=B(r),u=qt(o.arrivalTime,o.scheduleDeviation??0),m=Me(u);let p="";if(o.distanceFromStop>0){const g=o.distanceFromStop>=1e3?`${(o.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(o.distanceFromStop)}m`,f=c("stopAway",o.numberOfStopsAway);p=` • ${g} • ${f}`}return`
      <div class="arrival-item" data-arrival-time="${o.arrivalTime}" data-schedule-deviation="${o.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${o.lineColor};">${o.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${o.lineName} ${S()} ${o.vehicleId}</span>
            <span class="arrival-destination">${c("toDestination",o.destination)}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${m}">${u}</span>
          <span class="arrival-time"><span class="arrival-countdown">${d}</span><span class="arrival-precision">${p}</span></span>
        </span>
      </div>
    `};if(t){je.innerHTML="",Ge.innerHTML="",F.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,H.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,ye();return}const s=(o,l,r)=>{if(!o.length){l.innerHTML="",r.innerHTML=`<div class="arrival-item muted">${c("noUpcomingVehicles",$().toLowerCase())}</div>`;return}const d=n.dialogDisplayMode?o.slice(0,2):[],u=n.dialogDisplayMode?o.slice(2):o;l.innerHTML=d.map(i).join(""),r.innerHTML=u.length?u.map(i).join(""):n.dialogDisplayMode?`<div class="arrival-item muted">${c("noAdditionalVehicles",$().toLowerCase())}</div>`:""};s(e.nb,je,F),s(e.sb,Ge,H),ye()}function j(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const i=new Set;for(const o of a){const l=o.startsWith(`${t.agencyId}_`)?o:`${t.agencyId}_${o}`;i.add(l)}const s=e.id.replace(/-T\d+$/,"");return i.add(s.startsWith(`${t.agencyId}_`)?s:`${t.agencyId}_${s}`),[...i]}function ae(e){const t=n.lines.map(a=>{const i=a.stops.find(s=>s.id===e.id);return i?{line:a,station:i}:null}).filter(Boolean);return t.length>0?t:n.lines.map(a=>{const i=a.stops.find(s=>s.name===e.name);return i?{line:a,station:i}:null}).filter(Boolean)}function on(e){if(!e)return null;const t=e.trim().toLowerCase();for(const a of n.lines)for(const i of a.stops){const s=new Set([i.id,`${a.agencyId}_${i.id}`,i.name,J(i.name),X(i.name),X(J(i.name))]);for(const o of a.stationAliases?.[i.id]??[])s.add(o),s.add(`${a.agencyId}_${o}`),s.add(X(o));if([...s].some(o=>String(o).toLowerCase()===t))return i}return null}function rn(e){const t=new URL(window.location.href);t.searchParams.set("station",X(e.name)),window.history.pushState({},"",t)}function zt(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function tt(e){const t=new URL(window.location.href);e===q?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function Ot(){const t=new URL(window.location.href).searchParams.get("system");return t&&n.systemsById.has(t)?t:q}function Ce(e){n.dialogDisplayMode=e,y.classList.toggle("is-display-mode",e),U.textContent=c(e?"exit":"board"),U.setAttribute("aria-label",c(e?"exit":"board")),n.dialogDisplayDirection="both",n.dialogDisplayAutoPhase="nb",Ae(),y.open&&n.currentDialogStation&&Ne(n.currentDialogStation).catch(console.error),ne(),ye()}function ln(){Ce(!n.dialogDisplayMode)}function Ie(){n.dialogDisplayDirectionTimer&&(window.clearInterval(n.dialogDisplayDirectionTimer),n.dialogDisplayDirectionTimer=0)}function Ae(){Ie();const e=n.dialogDisplayDirection,t=e==="auto"?n.dialogDisplayAutoPhase:e;dt.forEach(a=>{a.classList.toggle("is-active",a.dataset.dialogDirection===e)}),y.classList.toggle("show-nb-only",n.dialogDisplayMode&&t==="nb"),y.classList.toggle("show-sb-only",n.dialogDisplayMode&&t==="sb"),n.dialogDisplayMode&&e==="auto"&&(n.dialogDisplayDirectionTimer=window.setInterval(()=>{n.dialogDisplayAutoPhase=n.dialogDisplayAutoPhase==="nb"?"sb":"nb",Ae()},ma))}function xe(){n.dialogRefreshTimer&&(window.clearTimeout(n.dialogRefreshTimer),n.dialogRefreshTimer=0)}function De(){n.dialogDisplayTimer&&(window.clearInterval(n.dialogDisplayTimer),n.dialogDisplayTimer=0)}function ce(e,t){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(e.style.transform="translateY(0)",!n.dialogDisplayMode||a.length<=3)return;const i=Number.parseFloat(window.getComputedStyle(e).rowGap||"0")||0,s=a[0].getBoundingClientRect().height+i,o=Math.max(0,a.length-3),l=Math.min(n.dialogDisplayIndexes[t],o);e.style.transform=`translateY(-${l*s}px)`}function ye(){De(),n.dialogDisplayIndexes={nb:0,sb:0},ce(F,"nb"),ce(H,"sb"),n.dialogDisplayMode&&(n.dialogDisplayTimer=window.setInterval(()=>{for(const[e,t]of[["nb",F],["sb",H]]){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const i=Math.max(0,a.length-3);n.dialogDisplayIndexes[e]=n.dialogDisplayIndexes[e]>=i?0:n.dialogDisplayIndexes[e]+1,ce(t,e)}},pa))}function cn(){if(!y.open)return;y.querySelectorAll(".arrival-item[data-arrival-time]").forEach(t=>{const a=Number(t.dataset.arrivalTime),i=Number(t.dataset.scheduleDeviation||0),s=t.querySelector(".arrival-countdown"),o=t.querySelector(".arrival-status");if(!s||!o)return;s.textContent=B(Math.floor((a-Date.now())/1e3));const l=qt(a,i),r=Me(l);o.textContent=l,o.className=`arrival-status arrival-status-${r}`})}function dn(){if(xe(),!n.currentDialogStation)return;const e=()=>{n.dialogRefreshTimer=window.setTimeout(async()=>{!y.open||!n.currentDialogStation||(await Ne(n.currentDialogStation).catch(console.error),e())},ua)};e()}function Pt(){n.currentDialogStationId="",n.currentDialogStation=null,y.open?y.close():(xe(),De(),Ie(),Ce(!1),zt())}async function at(){const e=Ot();e!==n.activeSystemId&&await Yt(e,{updateUrl:!1,preserveDialog:!1});const t=new URL(window.location.href).searchParams.get("station"),a=on(t);n.isSyncingFromUrl=!0;try{if(!a){n.currentDialogStationId="",y.open&&y.close();return}if(n.activeTab="map",w(),n.currentDialogStationId===a.id&&y.open)return;await Ht(a,!1)}finally{n.isSyncingFromUrl=!1}}function un(e,t){const a=t.directionLookup?.[e.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const i=e.tripHeadsign??"",s=i.toLowerCase();return t.nbTerminusPrefix&&s.startsWith(t.nbTerminusPrefix)?"nb":t.sbTerminusPrefix&&s.startsWith(t.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(i)?"nb":/Federal Way|South Bellevue/i.test(i)?"sb":""}function Bt(e){return e.routeKey??`${e.agencyId}_${e.id}`}function pn(e){const t=e.tripHeadsign?.trim();return t?J(t.replace(/^to\s+/i,"")):c("terminalFallback")}function qt(e,t){return Math.floor((e-Date.now())/1e3)<=90?"ARR":t>=120?"DELAY":n.language==="zh-CN"?"准点":"ON TIME"}function Me(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}async function mn(e){const t=`${it}/arrivals-and-departures-for-stop/${e}.json?key=${be}&minutesAfter=120`,a=await Tt(t,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${e}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function _t(e){const t=[...new Set(e)],a=[],i=[];for(let s=0;s<t.length;s+=ie){const o=t.slice(s,s+ie),l=await Promise.allSettled(o.map(r=>mn(r)));a.push(...l),He>0&&s+ie<t.length&&await Le(He)}for(const s of a)s.status==="fulfilled"&&i.push(...s.value);return i}function Ut(e,t,a=null){const i=Date.now(),s=new Set,o={nb:[],sb:[]},l=a?new Set(a):null;for(const r of e){if(r.routeId!==Bt(t)||l&&!l.has(r.stopId))continue;const d=r.predictedArrivalTime||r.scheduledArrivalTime;if(!d||d<=i)continue;const u=un(r,t);if(!u)continue;const m=`${r.tripId}:${r.stopId}:${d}`;s.has(m)||(s.add(m),o[u].push({vehicleId:(r.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:d,destination:pn(r),scheduleDeviation:r.scheduleDeviation??0,tripId:r.tripId,lineColor:t.color,lineName:t.name,lineToken:t.name[0],distanceFromStop:r.distanceFromStop??0,numberOfStopsAway:r.numberOfStopsAway??0}))}return o.nb.sort((r,d)=>r.arrivalTime-d.arrivalTime),o.sb.sort((r,d)=>r.arrivalTime-d.arrivalTime),o.nb=o.nb.slice(0,4),o.sb=o.sb.slice(0,4),o}async function gn(e,t,a=null){const i=`${n.activeSystemId}:${t.id}:${e.id}`,s=n.arrivalsCache.get(i);if(s&&Date.now()-s.fetchedAt<oa)return s.value;const o=j(e,t),l=a??await _t(o),r=Ut(l,t,o);return n.arrivalsCache.set(i,{fetchedAt:Date.now(),value:r}),r}function hn(e){const t={nb:[],sb:[]};for(const a of e)t.nb.push(...a.nb),t.sb.push(...a.sb);return t.nb.sort((a,i)=>a.arrivalTime-i.arrivalTime),t.sb.sort((a,i)=>a.arrivalTime-i.arrivalTime),t}function Ft(e){const t=qa(e);if(!t.length){_.innerHTML="",_.hidden=!0;return}_.hidden=!1,_.innerHTML=`
    <div class="station-alerts">
      ${t.map((a,i)=>`
        <button class="station-alert-pill" data-alert-idx="${i}" type="button">
          <span class="station-alert-pill-meta">${St(a.severity)} · ${bt(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||c("serviceAlert")}</span>
        </button>
      `).join("")}
    </div>
  `,_.querySelectorAll(".station-alert-pill").forEach(a=>{const i=t[Number(a.dataset.alertIdx)];i&&a.addEventListener("click",()=>{const s=n.lines.find(o=>i.lineIds.includes(o.id));s&&jt(s)})})}async function Ht(e,t=!0){Wt(e.name),Ba(e),n.currentDialogStationId=e.id,n.currentDialogStation=e,Ft(e),$e([],!0),Rt({nb:[],sb:[]},!0),t&&rn(e),y.showModal(),ne(),dn(),await Ne(e)}async function Ne(e){const t=n.activeDialogRequest+1;n.activeDialogRequest=t;try{const a=ae(e),i=Tn(e),s=a.flatMap(({station:d,line:u})=>j(d,u)),o=i.flatMap(({stop:d,line:u})=>j(d,u)),l=await _t([...s,...o]),r=await Promise.all(a.map(({station:d,line:u})=>gn(d,u,l)));if(n.activeDialogRequest!==t||!y.open)return;$e(Cn(i,l)),Ft(e),Rt(hn(r))}catch(a){if(n.activeDialogRequest!==t||!y.open)return;$e([]),F.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,H.innerHTML=`<div class="arrival-item muted">${n.language==="zh-CN"?"请稍后重试":"Retry in a moment"}</div>`}}function fn(e){const t=n.layouts.get(e.id),a=n.vehiclesByLine.get(e.id)??[],i=G(e.id),s=t.stations.map((r,d)=>{const u=t.stations[d-1],m=d>0?u.segmentMinutes:"",g=wt(r,e).length>0,f=r.isTerminal?15:10;return`
        <g transform="translate(0, ${r.y})" class="station-group${g?" has-alert":""}" data-stop-id="${r.id}" style="cursor: pointer;">
          ${d>0?`<text x="0" y="-14" class="segment-time">${m}</text>
                 <line x1="18" x2="${t.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${t.trackX}" cy="0" r="${r.isTerminal?11:5}" class="${r.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${e.color};"></circle>
          ${r.isTerminal?`<text x="${t.trackX}" y="4" text-anchor="middle" class="terminal-mark">${e.name[0]}</text>`:""}
          ${g?`<circle cx="${t.trackX+f}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${t.labelX}" y="5" class="station-label">${r.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),o=a.map((r,d)=>`
        <g transform="translate(${t.trackX}, ${r.y+(d%3-1)*1.5})" class="train">
          <circle r="13" class="train-wave" style="--line-color:${e.color}; animation-delay:${d*.18}s;"></circle>
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${r.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${e.color};"></path>
        </g>
      `).join(""),l=S();return`
    <article class="line-card" data-line-id="${e.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <div class="line-title-copy">
            <div class="line-title-row">
              <h2>${e.name}</h2>
              ${Lt(i,e.id)}
            </div>
            <p>${c("liveCount",a.length,a.length===1?l.toLowerCase():$().toLowerCase())}</p>
            <p>${Se(e)}</p>
          </div>
        </div>
        ${we(e)}
      </header>
      ${At(e.color,a.map(r=>({...r,lineToken:e.name[0]})))}
      <svg viewBox="0 0 460 ${t.height}" class="line-diagram" role="img" aria-label="${n.language==="zh-CN"?`${e.name} 实时线路图`:`${e.name} live LED board`}">
        <line x1="${t.trackX}" x2="${t.trackX}" y1="${t.stations[0].y}" y2="${t.stations.at(-1).y}" class="spine" style="--line-color:${e.color};"></line>
        ${s}
        ${o}
      </svg>
    </article>
  `}function vn(){const e=ee().sort((l,r)=>l.minutePosition-r.minutePosition),t=S(),a=$(),i=a.toLowerCase();return e.length?(n.compactLayout?n.lines.filter(l=>l.id===n.activeLineId):n.lines).map(l=>{const r=e.filter(g=>g.lineId===l.id),d=G(l.id),u=r.filter(g=>g.directionSymbol==="▲"),m=r.filter(g=>g.directionSymbol==="▼"),p=(g,f)=>`
        <div class="train-direction-column">
          <p class="direction-column-title">${g}</p>
          ${f.length?f.map(h=>`
                      <article class="train-list-item" data-train-id="${h.id}">
                        <div class="train-list-main">
                          <span class="line-token train-list-token" style="--line-color:${h.lineColor};">${h.lineToken}</span>
                          <div>
                            <p class="train-list-title">${h.lineName} ${t} ${h.label}</p>
                            <p class="train-list-subtitle">${xt(h)}</p>
                            <p class="train-list-status ${V(h,L(h.nextOffset??0))}" data-vehicle-status="${h.id}">${It(h)}</p>
                          </div>
                        </div>
                      </article>
                    `).join(""):`<p class="train-readout muted">${c("noLiveVehicles",$().toLowerCase())}</p>`}
        </div>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${l.color};">${l.name[0]}</span>
              <div class="line-title-copy">
                <div class="line-title-row">
                  <h2>${l.name}</h2>
                  ${Lt(d,l.id)}
                </div>
                <p>${c("inServiceCount",r.length,r.length===1?t.toLowerCase():$().toLowerCase())} · ${Se(l)}</p>
              </div>
            </div>
            ${we(l)}
          </header>
          ${At(l.color,r)}
          <div class="line-readout line-readout-grid train-columns">
            ${p(n.language==="zh-CN"?"北向":"NB",u)}
            ${p(n.language==="zh-CN"?"南向":"SB",m)}
          </div>
        </article>
      `}).join(""):`
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>${c("activeVehicles",a)}</h2>
          <p>${c("noLiveVehicles",i)}</p>
        </article>
      </section>
    `}function Vt(e){return new Date(e).toLocaleTimeString(n.language==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:n.language!=="zh-CN"})}function yn(e){return Vt(Date.now()+Math.max(0,e)*1e3)}function $n(e,t){const a=e.directionSymbol==="▲"?0:t.stations.length-1;return t.stations[a]?.label??e.upcomingLabel}function bn(e,t,a=6){if(!t?.stations?.length)return[];const i=e.directionSymbol==="▲"?-1:1,s=[],o=new Set,l=e.upcomingStopIndex??e.currentIndex,r=Math.max(0,e.nextOffset??0),d=(m,p,{isNext:g=!1,isTerminal:f=!1}={})=>{if(m==null||o.has(m))return;const h=t.stations[m];h&&(o.add(m),s.push({id:`${e.id}:${h.id}`,label:h.label,etaSeconds:Math.max(0,Math.round(p)),clockTime:yn(p),isNext:g,isTerminal:f}))};d(l,r,{isNext:!0});let u=r;for(let m=l+i;s.length<a&&!(m<0||m>=t.stations.length);m+=i){const p=m-i,g=t.stations[p];u+=Math.max(0,Math.round((g?.segmentMinutes??0)*60));const f=m===0||m===t.stations.length-1;d(m,u,{isTerminal:f})}return s}function Wt(e){lt.textContent=e,Ta.textContent=e,ne()}function ne(){const e=wa;if(!e||!La)return;const a=n.dialogDisplayMode&&y.open&&lt.scrollWidth>e.clientWidth;e.classList.toggle("is-marquee",a)}function Sn(e,t,a,i){const o=(a-e)*Math.PI/180,l=(i-t)*Math.PI/180,r=Math.sin(o/2)**2+Math.cos(e*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(l/2)**2;return 2*6371*Math.asin(Math.sqrt(r))}function wn(e){return Math.max(1,Math.round(e/ga*60))}function Ln(e){return e>=1?c("walkKm",e):c("walkMeters",Math.round(e*1e3))}function Tn(e){if(!e)return[];const t=ae(e),a=new Set(t.map(({line:s,station:o})=>`${s.agencyId}:${s.id}:${o.id}`)),i=new Map;for(const s of n.systemsById.values())for(const o of s.lines??[])for(const l of o.stops??[]){if(a.has(`${o.agencyId}:${o.id}:${l.id}`))continue;const r=Sn(e.lat,e.lon,l.lat,l.lon);if(r>ha)continue;const d=`${s.id}:${o.id}`,u=i.get(d);(!u||r<u.distanceKm)&&i.set(d,{systemId:s.id,systemName:s.name,line:o,stop:l,distanceKm:r,walkMinutes:wn(r)})}return[...i.values()].sort((s,o)=>s.distanceKm-o.distanceKm||s.line.name.localeCompare(o.line.name)).slice(0,st*2)}function $e(e,t=!1){if(t){R.hidden=!1,R.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">${c("transfers")}</h4>
          <p class="transfer-panel-copy">${c("checkingNearbyConnections")}</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">${c("loadingTransferRecommendations")}</div>
        </div>
      </div>
    `;return}if(!e.length){R.hidden=!0,R.innerHTML="";return}R.hidden=!1,R.innerHTML=`
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <h4 class="arrivals-title">${c("transfers")}</h4>
        <p class="transfer-panel-copy">${c("closestBoardableConnections")}</p>
      </div>
      <div class="transfer-list">
        ${e.map(a=>`
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${a.line.color};">${a.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${a.line.name} <span class="transfer-system-chip">${a.systemName}</span></p>
                    <p class="transfer-card-stop">${c("walkToStop",a.walkMinutes,a.stop.name)}</p>
                    <p class="transfer-card-meta">${Ln(a.distanceKm)}${a.arrival?` • ${c("toDestination",a.arrival.destination)}`:""}</p>
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
  `}function Cn(e,t){const a=Date.now(),i=[];for(const s of e){const o=j(s.stop,s.line),l=Ut(t,s.line,o),r=[...l.nb,...l.sb].sort((g,f)=>g.arrivalTime-f.arrivalTime);if(!r.length)continue;const d=a+s.walkMinutes*6e4+fa,u=r.find(g=>g.arrivalTime>=d)??r[0],m=u.arrivalTime-a-s.walkMinutes*6e4,p=Math.max(0,Math.round(m/6e4));i.push({...s,arrival:u,boardAt:u.arrivalTime,badge:m<=0?c("leaveNow"):p<=1?c("boardInOneMinute"):c("boardInMinutes",p),tone:p<=2?"hot":p<=8?"good":"calm",timeText:Vt(u.arrivalTime)})}return i.sort((s,o)=>s.boardAt-o.boardAt||s.distanceKm-o.distanceKm).slice(0,st)}function In(){const e=Dt(),t=ve(n.lines),a=S(),i=ve(e);return`
    ${an(i)}
    ${tn(t)}
    ${i.map(({line:s,layout:o,vehicles:l,nb:r,sb:d,lineAlerts:u})=>{const m=sn(s,o,r,d,u);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header line-card-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${s.color};">${s.name[0]}</span>
              <div class="line-title-copy">
                <h2>${s.name}</h2>
                <p>${c("liveCount",l.length,l.length===1?S().toLowerCase():$().toLowerCase())} · ${Se(s)}</p>
              </div>
            </div>
            ${we(s)}
          </header>
          ${m||`<p class="train-readout muted">${n.language==="zh-CN"?`等待实时${a.toLowerCase()}数据…`:`Waiting for live ${a.toLowerCase()} data…`}</p>`}
        </article>
      `}).join("")}
  `}function An(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await Yt(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function de(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{n.activeLineId=t.dataset.lineSwitch,w()})})}function ke(){n.currentTrainId="",A.open&&A.close()}function Ee(){D.open&&D.close()}function jt(e){const t=G(e.id);gt.textContent=c("affectedLineAlerts",e.name,t.length),ht.textContent=c("activeAlerts",t.length),xa.textContent=e.name,Xe.textContent="",Xe.innerHTML=t.length?t.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${St(a.severity)} • ${bt(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||c("serviceAlert")}</p>
              <p class="alert-dialog-item-copy">${a.description||c("noAdditionalAlertDetails")}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">${c("readOfficialAlert")}</a></p>`:""}
            </article>
          `).join(""):`<p class="alert-dialog-item-copy">${c("noActiveAlerts")}</p>`,he.hidden=!0,he.removeAttribute("href"),D.open||D.showModal()}function nt(){document.querySelectorAll("[data-alert-line-id]").forEach(t=>{t.addEventListener("click",()=>{const a=n.lines.find(i=>i.id===t.dataset.alertLineId);a&&jt(a)})})}function xn(e){const t=e.fromLabel!==e.toLabel&&e.progress>0&&e.progress<1,a=t?e.fromLabel:e.previousLabel,i=t?`${e.fromLabel} -> ${e.toLabel}`:e.currentStopLabel,s=t?"Between":"Now",o=t?e.toLabel:e.upcomingLabel,l=t?e.progress:.5,r=n.layouts.get(e.lineId),d=bn(e,r),u=r?$n(e,r):e.upcomingLabel,m=d.at(-1)?.etaSeconds??Math.max(0,e.nextOffset??0),p=e.directionSymbol==="▲"?n.language==="zh-CN"?"北向":"Northbound":e.directionSymbol==="▼"?n.language==="zh-CN"?"南向":"Southbound":c("active");ut.textContent=`${e.lineName} ${S()} ${e.label}`,pt.textContent=n.language==="zh-CN"?`${p} · ${c("toDestination",u)}`:`${p} to ${u}`,Ye.className=`train-detail-status train-list-status-${Me(e.serviceStatus)}`,Ye.innerHTML=O(Te(e)),A.querySelector(".train-eta-panel")?.remove(),Ke.innerHTML=`
    <div class="train-detail-spine" style="--line-color:${e.lineColor};"></div>
    <div
      class="train-detail-marker-floating"
      style="--line-color:${e.lineColor}; --segment-progress:${l}; --direction-offset:${e.directionSymbol==="▼"?"10px":"-10px"};"
    >
      <span class="train-detail-vehicle-marker">
        <svg viewBox="-10 -10 20 20" class="train-detail-arrow" aria-hidden="true">
          <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${e.directionSymbol==="▼"?"rotate(180)":""}"></path>
        </svg>
      </span>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">${c("previous")}</p>
        <p class="train-detail-name">${a}</p>
      </div>
    </div>
    <div class="train-detail-stop is-current">
      <span class="train-detail-marker train-detail-marker-ghost"></span>
      <div>
        <p class="train-detail-label">${s==="Between"?n.language==="zh-CN"?"区间":"Between":c("now")}</p>
        <p class="train-detail-name">${i}</p>
      </div>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">${c("next")}</p>
        <p class="train-detail-name">${o}</p>
      </div>
    </div>
  `,Ke.insertAdjacentHTML("afterend",`
      <section class="train-eta-panel">
        <div class="train-eta-summary">
          <div class="metric-chip">
            <p class="metric-chip-label">${c("direction")}</p>
            <p class="metric-chip-value">${p}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("terminal")}</p>
            <p class="metric-chip-value">${u}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("etaToTerminal")}</p>
            <p class="metric-chip-value">${B(m)}</p>
          </div>
        </div>
        <div class="train-eta-timeline">
          <div class="train-eta-header">
            <p class="train-detail-label">${c("upcomingStops")}</p>
            <p class="train-eta-header-copy">${c("liveEtaNow")}</p>
          </div>
          ${d.length?d.map(g=>`
                  <article class="train-eta-stop${g.isNext?" is-next":""}${g.isTerminal?" is-terminal":""}">
                    <div>
                      <p class="train-eta-stop-label">${g.isNext?c("nextStop"):g.isTerminal?c("terminal"):c("upcoming")}</p>
                      <p class="train-eta-stop-name">${g.label}</p>
                    </div>
                    <div class="train-eta-stop-side">
                      <p class="train-eta-stop-countdown">${B(g.etaSeconds)}</p>
                      <p class="train-eta-stop-clock">${g.clockTime}</p>
                    </div>
                  </article>
                `).join(""):`<p class="train-readout muted">${c("noDownstreamEta")}</p>`}
        </div>
      </section>
    `),A.open||A.showModal()}function Dn(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,i=ee().find(s=>s.id===a);i&&(n.currentTrainId=a,xn(i))})})}function Mn(){n.lines.forEach(e=>{const t=n.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(s=>{s.addEventListener("click",()=>{const o=s.dataset.stopId,l=t.stations.find(r=>r.id===o);l&&Ht(l)})})})}function w(){const e=P();if(document.documentElement.lang=n.language,pe.textContent=c("languageToggle"),pe.setAttribute("aria-label",c("languageToggleAria")),me.textContent=n.theme==="dark"?c("themeLight"):c("themeDark"),me.setAttribute("aria-label",c("themeToggleAria")),ya.textContent=e.kicker,$a.textContent=e.title,se.setAttribute("aria-label",c("transitSystems")),ba.setAttribute("aria-label",c("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",c("boardDirectionView")),Ia.textContent=c("northbound"),Aa.textContent=c("southbound"),U.textContent=n.dialogDisplayMode?c("exit"):c("board"),U.setAttribute("aria-label",n.dialogDisplayMode?c("exit"):c("board")),mt.setAttribute("aria-label",c("closeTrainDialog")),ft.setAttribute("aria-label",c("closeAlertDialog")),y.open||(Wt(c("station")),ct.textContent=c("serviceSummary")),A.open||(ut.textContent=c("train"),pt.textContent=c("currentMovement")),D.open||(gt.textContent=c("serviceAlert"),ht.textContent=c("transitAdvisory")),he.textContent=c("readOfficialAlert"),se.hidden=n.systemsById.size<2,se.innerHTML=Xa(),Gt(),ue.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===n.activeTab)),ue.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=c("tabMap")),t.dataset.tab==="trains"&&(t.textContent=$()),t.dataset.tab==="insights"&&(t.textContent=c("tabInsights"))}),An(),n.activeTab==="map"){I.className="board";const t=Dt();I.innerHTML=`${le()}${t.map(fn).join("")}`,de(),nt(),Mn(),queueMicrotask(Q);return}if(n.activeTab==="trains"){I.className="board",I.innerHTML=`${le()}${vn()}`,de(),nt(),Dn(),queueMicrotask(Q);return}n.activeTab==="insights"&&(I.className="board",I.innerHTML=`${le()}${In()}`,de())}function Nn(){window.clearInterval(n.insightsTickerTimer),n.insightsTickerTimer=0}function kn(){Nn(),n.insightsTickerTimer=window.setInterval(()=>{n.insightsTickerIndex+=1,n.activeTab==="insights"&&w()},5e3)}function Gt(){Y.textContent=n.error?c("statusHold"):c("statusSync"),Y.classList.toggle("status-pill-error",!!n.error),Sa.textContent=`${c("nowPrefix")} ${fe()}`,ge.textContent=n.error?n.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":za(n.fetchedAt),We.textContent=Y.textContent,We.classList.toggle("status-pill-error",!!n.error),Ca.textContent=ge.textContent}function En(){window.clearTimeout(n.liveRefreshTimer),n.liveRefreshTimer=0}function Rn(){En();const e=()=>{n.liveRefreshTimer=window.setTimeout(async()=>{await Re(),e()},da)};e()}function Kt(e){const t=n.systemsById.has(e)?e:q,a=n.systemsById.get(t);n.activeSystemId=t,n.lines=a?.lines??[],n.layouts=n.layoutsBySystem.get(t)??new Map,n.lines.some(i=>i.id===n.activeLineId)||(n.activeLineId=n.lines[0]?.id??""),n.vehiclesByLine=new Map,n.rawVehicles=[],n.arrivalsCache.clear(),n.alerts=[],n.error="",n.fetchedAt="",n.insightsTickerIndex=0}async function Yt(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!n.systemsById.has(e)||n.activeSystemId===e){t&&tt(n.activeSystemId);return}Kt(e),a||Pt(),ke(),Ee(),w(),t&&tt(e),await Re()}async function zn(){const a=(await(await fetch(sa,{cache:"no-store"})).json()).systems??[];n.systemsById=new Map(a.map(i=>[i.id,i])),n.layoutsBySystem=new Map(a.map(i=>[i.id,new Map(i.lines.map(s=>[s.id,Ha(s)]))])),Kt(Ot())}function On(e){const t=[...new Set((e.allAffects??[]).map(i=>i.routeId).filter(Boolean))],a=n.lines.filter(i=>t.includes(Bt(i))).map(i=>i.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??c("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(i=>i.stopId).filter(Boolean))]}:null}async function Re(){try{const e=await Tt(Ma(),"Realtime");n.error="",n.fetchedAt=new Date().toISOString(),n.rawVehicles=e.data.list??[],n.alerts=(e.data.references?.situations??[]).map(On).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(s=>[s.id,s]));for(const s of n.lines){const o=n.layouts.get(s.id),l=n.rawVehicles.map(r=>Ya(r,s,o,t)).filter(Boolean);n.vehiclesByLine.set(s.id,l)}const a=Et(ve(n.lines)),i=n.systemSnapshots.get(n.activeSystemId);n.systemSnapshots.set(n.activeSystemId,{previous:i?.current??null,current:a})}catch(e){n.error=c("realtimeOffline"),console.error(e)}w()}async function Pn(){yt(Ra()),vt(Ea()),Ze(),await zn(),w(),await Re(),await at(),window.addEventListener("popstate",()=>{at().catch(console.error)});const e=()=>{const a=n.compactLayout;if(Ze(),ne(),a!==n.compactLayout){w();return}Q()};window.addEventListener("resize",e),window.visualViewport?.addEventListener("resize",e),new ResizeObserver(()=>{Q()}).observe(I),Rn(),kn(),window.setInterval(()=>{Gt(),cn(),Ka()},1e3)}Pn().catch(e=>{Y.textContent=c("statusFail"),ge.textContent=e.message});
