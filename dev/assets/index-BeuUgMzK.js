(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const oa="modulepreload",la=function(e){return"/link/dev/"+e},Ve={},ca=function(t,a,i){let s=Promise.resolve();if(a&&a.length>0){let p=function(u){return Promise.all(u.map(m=>Promise.resolve(m).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};var l=p;document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),d=o?.nonce||o?.getAttribute("nonce");s=p(a.map(u=>{if(u=la(u),u in Ve)return;Ve[u]=!0;const m=u.endsWith(".css"),g=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${g}`))return;const f=document.createElement("link");if(f.rel=m?"stylesheet":oa,m||(f.as="script"),f.crossOrigin="",f.href=u,d&&f.setAttribute("nonce",d),document.head.appendChild(f),m)return new Promise((h,v)=>{f.addEventListener("load",h),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(o){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=o,window.dispatchEvent(d),!d.defaultPrevented)throw o}return s.then(o=>{for(const d of o||[])d.status==="rejected"&&r(d.reason);return t().catch(r)})};function da(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:i,onRegistered:s,onRegisteredSW:r,onRegisterError:l}=e;let o,d;const p=async(m=!0)=>{await d};async function u(){if("serviceWorker"in navigator){if(o=await ca(async()=>{const{Workbox:m}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:m}},[]).then(({Workbox:m})=>new m("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(m=>{l?.(m)}),!o)return;o.addEventListener("activated",m=>{(m.isUpdate||m.isExternal)&&window.location.reload()}),o.addEventListener("installed",m=>{m.isUpdate||i?.()}),o.register({immediate:t}).then(m=>{r?r("/link/dev/sw.js",m):s?.(m)}).catch(m=>{l?.(m)})}}return d=u(),p}const ua="./pulse-data.json",dt="https://api.pugetsound.onebusaway.org/api/where",Te="TEST".trim()||"TEST",D=Te==="TEST",pa=D?6e4:2e4,We=3,ma=800,ga=D?2e4:5e3,Ge=D?12e4:3e4,je=D?1200:0,oe=D?1:3,ha=1100,fa=D?45e3:15e3,va=D?9e4:3e4,ya=4e3,$a=15e3,Ke=4*6e4,ba=4.8,ut=.35,Sa=45e3,pt=4,mt="link-pulse-theme",gt="link-pulse-language",H="link",J={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},Ye={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}},n={fetchedAt:"",error:"",activeSystemId:H,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},wa=da({immediate:!0,onNeedRefresh(){wa(!0)}});document.querySelector("#app").innerHTML=`
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
`;const x=document.querySelector("#board"),La=document.querySelector("#screen-kicker"),Ta=document.querySelector("#screen-title"),le=document.querySelector("#system-bar"),Ca=document.querySelector("#view-bar"),pe=[...document.querySelectorAll(".tab-button")],me=document.querySelector("#language-toggle"),ge=document.querySelector("#theme-toggle"),X=document.querySelector("#status-pill"),Ia=document.querySelector("#current-time"),he=document.querySelector("#updated-at"),y=document.querySelector("#station-dialog"),xa=document.querySelector("#dialog-title"),Ma=document.querySelector("#dialog-title-track"),ht=document.querySelector("#dialog-title-text"),Aa=document.querySelector("#dialog-title-text-clone"),ft=document.querySelector("#dialog-service-summary"),Xe=document.querySelector("#dialog-status-pill"),Na=document.querySelector("#dialog-updated-at"),U=document.querySelector("#dialog-display"),vt=[...document.querySelectorAll("[data-dialog-direction]")],Da=document.querySelector("#arrivals-title-nb"),ka=document.querySelector("#arrivals-title-sb"),F=document.querySelector("#station-alerts-container"),z=document.querySelector("#transfer-section"),Ze=document.querySelector("#arrivals-nb-pinned"),V=document.querySelector("#arrivals-nb"),Qe=document.querySelector("#arrivals-sb-pinned"),W=document.querySelector("#arrivals-sb"),M=document.querySelector("#train-dialog"),yt=document.querySelector("#train-dialog-title"),$t=document.querySelector("#train-dialog-subtitle"),Je=document.querySelector("#train-dialog-line"),et=document.querySelector("#train-dialog-status"),bt=document.querySelector("#train-dialog-close"),N=document.querySelector("#alert-dialog"),St=document.querySelector("#alert-dialog-title"),wt=document.querySelector("#alert-dialog-subtitle"),Ea=document.querySelector("#alert-dialog-lines"),tt=document.querySelector("#alert-dialog-body"),fe=document.querySelector("#alert-dialog-link"),Lt=document.querySelector("#alert-dialog-close");U.addEventListener("click",()=>yn());bt.addEventListener("click",()=>Oe());Lt.addEventListener("click",()=>Pe());me.addEventListener("click",()=>{Ct(n.language==="en"?"zh-CN":"en"),T()});vt.forEach(e=>{e.addEventListener("click",()=>{n.dialogDisplayDirection=e.dataset.dialogDirection,n.dialogDisplayDirection==="auto"&&(n.dialogDisplayAutoPhase="nb"),De()})});y.addEventListener("click",e=>{e.target===y&&Ft()});M.addEventListener("click",e=>{e.target===M&&Oe()});N.addEventListener("click",e=>{e.target===N&&Pe()});y.addEventListener("close",()=>{ke(),Ee(),Ne(),Ae(!1),n.isSyncingFromUrl||_t()});pe.forEach(e=>{e.addEventListener("click",()=>{n.activeTab=e.dataset.tab,T()})});ge.addEventListener("click",()=>{Tt(n.theme==="dark"?"light":"dark"),T()});function B(){return J[n.activeSystemId]??J[H]}function Ra(){return n.systemsById.get(n.activeSystemId)?.agencyId??J[H].agencyId}function za(){return`${dt}/vehicles-for-agency/${Ra()}.json?key=${Te}`}function w(){return n.language==="zh-CN"?B().vehicleLabel==="Train"?"列车":"公交":B().vehicleLabel??"Vehicle"}function Oa(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function b(){return n.language==="zh-CN"?w():B().vehicleLabelPlural??Oa(w())}function Pa(){return Ye[n.language]??Ye.en}function c(e,...t){const a=Pa()[e];return typeof a=="function"?a(...t):a}function ee(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function qa(){const e=window.localStorage.getItem(mt);return e==="light"||e==="dark"?e:"dark"}function Ba(){const e=window.localStorage.getItem(gt);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function Tt(e){n.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(mt,e)}function Ct(e){n.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=n.language,window.localStorage.setItem(gt,n.language)}function at(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);n.compactLayout=i<=ha}function te(){const a=window.getComputedStyle(x).gridTemplateColumns.split(" ").map(i=>i.trim()).filter(Boolean).length<=1;a!==n.compactLayout&&(n.compactLayout=a,T())}function Z(e){return e.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function q(e,t,a){return Math.max(t,Math.min(e,a))}function _a(e){if(!e)return c("waitingSnapshot");const t=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return t<10?c("updatedNow"):t<60?c("updatedSecondsAgo",t):c("updatedMinutesAgo",Math.round(t/60))}function ve(){return new Intl.DateTimeFormat(n.language==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:n.language!=="zh-CN"}).format(new Date)}function C(e){if(e<=0)return c("arriving");const t=Math.floor(e/60),a=e%60;return n.language==="zh-CN"?t>0?`${t}分 ${a}秒`:`${a}秒`:t>0?`${t}m ${a}s`:`${a}s`}function Ha(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function Q(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function ye(e){const[t="0",a="0",i="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(i)}function O(e,t){if(!e||!t)return null;const[a,i,s]=e.split("-").map(Number),r=ye(t),l=Math.floor(r/3600),o=Math.floor(r%3600/60),d=r%60;return new Date(a,i-1,s,l,o,d)}function Y(e){const t=Math.max(0,Math.round(e/6e4)),a=Math.floor(t/60),i=t%60;return n.language==="zh-CN"?a&&i?`${a}小时${i}分钟`:a?`${a}小时`:`${i}分钟`:a&&i?`${a}h ${i}m`:a?`${a}h`:`${i}m`}function L(e){if(!e)return"";const[t="0",a="0"]=String(e).split(":"),i=Number(t),s=Number(a),r=(i%24+24)%24;if(n.language==="zh-CN")return`${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`;const l=r>=12?"PM":"AM";return`${r%12||12}:${String(s).padStart(2,"0")} ${l}`}function Ce(e){const t=Ha(),a=e.serviceSpansByDate?.[t];return a?c("todayServiceSpan",L(a.start),L(a.end)):c("todayServiceUnavailable")}function It(e){const t=new Date,a=Q(-1),i=Q(0),s=Q(1),r=e.serviceSpansByDate?.[a],l=e.serviceSpansByDate?.[i],o=e.serviceSpansByDate?.[s],p=[r&&{kind:"yesterday",start:O(a,r.start),end:O(a,r.end),span:r},l&&{kind:"today",start:O(i,l.start),end:O(i,l.end),span:l}].filter(Boolean).find(u=>t>=u.start&&t<=u.end);if(p)return{tone:"active",headline:c("lastTrip",L(p.span.end)),detail:c("endsIn",Y(p.end.getTime()-t.getTime())),compact:c("endsIn",Y(p.end.getTime()-t.getTime()))};if(l){const u=O(i,l.start),m=O(i,l.end);if(t<u)return{tone:"upcoming",headline:c("firstTrip",L(l.start)),detail:c("startsIn",Y(u.getTime()-t.getTime())),compact:c("startsIn",Y(u.getTime()-t.getTime()))};if(t>m)return{tone:"ended",headline:c("serviceEnded",L(l.end)),detail:o?c("nextStart",L(o.start)):c("noNextServiceLoaded"),compact:o?c("nextStart",L(o.start)):c("ended")}}return o?{tone:"upcoming",headline:c("nextFirstTrip",L(o.start)),detail:c("noServiceRemainingToday"),compact:c("nextStart",L(o.start))}:{tone:"muted",headline:c("serviceHoursUnavailable"),detail:c("staticScheduleMissing"),compact:c("unavailable")}}function Ie(e){const t=It(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function Fa(e){const t=se(e).map(({line:a})=>{const i=It(a);return`${a.name}: ${i.compact}`}).slice(0,3);ft.textContent=t.join("  ·  ")||c("serviceSummaryUnavailable")}function Ua(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function Va(e){const t=Q(0),a=e.serviceSpansByDate?.[t];if(!a)return null;const i=ye(a.start)/3600,s=ye(a.end)/3600,r=Ua(new Date),l=Math.max(24,s,r,1);return{startHours:i,endHours:s,nowHours:r,axisMax:l,startLabel:L(a.start),endLabel:L(a.end)}}function Wa(e){const t=Va(e);if(!t)return"";const a=q(t.startHours/t.axisMax*100,0,100),i=q(t.endHours/t.axisMax*100,a,100),s=q(t.nowHours/t.axisMax*100,0,100),r=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
    <section class="service-timeline-card">
      <div class="service-timeline-header">
        <div>
          <p class="headway-chart-title">${n.language==="zh-CN"?"今日运营时间带":"Today Service Window"}</p>
          <p class="headway-chart-copy">${n.language==="zh-CN"?"首末班与当前时刻":"First trip, last trip, and current time"}</p>
        </div>
        <span class="service-timeline-badge ${r?"is-live":"is-off"}">${r?n.language==="zh-CN"?"运营中":"In service":n.language==="zh-CN"?"未运营":"Off hours"}</span>
      </div>
      <div class="service-timeline-track">
        <div class="service-timeline-band" style="left:${a}%; width:${Math.max(2,i-a)}%;"></div>
        <div class="service-timeline-now" style="left:${s}%;">
          <span class="service-timeline-now-dot"></span>
          <span class="service-timeline-now-label">${n.language==="zh-CN"?"当前":"Now"}</span>
        </div>
      </div>
      <div class="service-timeline-labels">
        <span>${t.startLabel}</span>
        <span>${t.endLabel}</span>
      </div>
    </section>
  `}function xt(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function Mt(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function K(e){return n.alerts.filter(t=>t.lineIds.includes(e))}function At(e,t){const a=K(t.id);if(!a.length)return[];const i=new Set(j(e,t));return i.add(e.id),a.filter(s=>s.stopIds.length>0&&s.stopIds.some(r=>i.has(r)))}function Ga(e){const t=new Set,a=[];for(const{station:i,line:s}of se(e))for(const r of At(i,s))t.has(r.id)||(t.add(r.id),a.push(r));return a}function Nt(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${c("alertsWord",e.length)}</span>
    </button>
  `:""}function xe(e){return new Promise(t=>window.setTimeout(t,e))}function ja(){const e=Math.max(0,n.obaRateLimitStreak-1),t=Math.min(Ge,ga*2**e),a=Math.round(t*(.15+Math.random()*.2));return Math.min(Ge,t+a)}async function Ka(){const e=n.obaCooldownUntil-Date.now();e>0&&await xe(e)}function Ya(e){return e?.code===429||/rate limit/i.test(e?.text??"")}async function Dt(e,t){for(let a=0;a<=We;a+=1){await Ka();const i=await fetch(e,{cache:"no-store"});let s=null;try{s=await i.json()}catch{s=null}const r=i.status===429||Ya(s);if(i.ok&&!r)return n.obaRateLimitStreak=0,n.obaCooldownUntil=0,s;if(a===We||!r)throw s?.text?new Error(s.text):new Error(`${t} request failed with ${i.status}`);n.obaRateLimitStreak+=1;const l=ma*2**a,o=Math.max(l,ja());n.obaCooldownUntil=Date.now()+o,await xe(o)}throw new Error(`${t} request failed`)}function Xa(e){const t=[...e.stops].sort((m,g)=>g.sequence-m.sequence),a=48,i=44,s=28,r=88,l=122,o=i+s+(t.length-1)*a,d=new Map,p=t.map((m,g)=>{const f={...m,label:ee(m.name),y:i+g*a,index:g,isTerminal:g===0||g===t.length-1};d.set(m.id,g),d.set(`${e.agencyId}_${m.id}`,g);for(const h of e.stationAliases?.[m.id]??[])d.set(h,g),d.set(`${e.agencyId}_${h}`,g);return f});let u=0;for(let m=0;m<p.length;m+=1)p[m].cumulativeMinutes=u,u+=m<p.length-1?p[m].segmentMinutes:0;return{totalMinutes:u,height:o,labelX:l,stationGap:a,stationIndexByStopId:d,stations:p,trackX:r}}function Za(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function Qa(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase();t.closestStopTimeOffset;const i=t.nextStopTimeOffset??0,s=t.scheduleDeviation??0,r=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||r&&Math.abs(i)<=90?"ARR":s>=120?"DELAY":"OK"}function Ja(e,t){if(!t)return{text:c("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:c("onTime"),colorClass:"status-ontime"};if(e>60){const a=Math.round(e/60);let i="status-late-minor";return e>600?i="status-late-severe":e>300&&(i="status-late-moderate"),{text:n.language==="zh-CN"?`晚点 ${a} 分钟`:`+${a} min late`,colorClass:i}}if(e<-60){const a=Math.round(Math.abs(e)/60);return{text:n.language==="zh-CN"?`早到 ${a} 分钟`:`${a} min early`,colorClass:"status-early"}}return{text:c("unknown"),colorClass:"status-muted"}}function en(e){switch(e){case"ARR":return c("arrivingStatus");case"DELAY":return c("delayedStatus");case"OK":return c("enRoute");default:return""}}function $(e){if(!n.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(n.fetchedAt).getTime())/1e3));return e-t}function _(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function Me(e){const t=$(e.nextOffset??0),a=$(e.closestOffset??0),i=e.delayInfo.text;return t<=15?[{text:c("arrivingNow"),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:c("arrivingIn",C(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:c("nextStopIn",C(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:[{text:en(e.serviceStatus),toneClass:_(e,t)},{text:i,toneClass:e.delayInfo.colorClass}]}function P(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function kt(e){const t=$(e.nextOffset??0),a=$(e.closestOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel,[s,r]=Me(e);return t<=15?`${e.label} at ${i} ${P([s,r])}`:t<=90?`${e.label} at ${i} ${P([s,r])}`:a<0&&t>0?`${e.label} ${i} ${P([s,r])}`:`${e.label} to ${i} ${P([s,r])}`}function $e(e){return P(Me(e))}function Et(e,t){if(!t.length)return"";const a=[...t].sort((s,r)=>$(s.nextOffset??0)-$(r.nextOffset??0)).slice(0,8),i=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${i.map(s=>`
          <span
            class="line-marquee-item ${_(s,$(s.nextOffset??0))}"
            data-vehicle-marquee="${s.id}"
          >
            <span class="line-marquee-token">${s.lineToken}</span>
            <span class="line-marquee-copy">${kt(s)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function tn(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const i=a.dataset.vehicleStatus,s=ae().find(l=>l.id===i);if(!s)return;const r=$(s.nextOffset??0);a.innerHTML=$e(s),a.className=`train-list-status ${_(s,r)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const i=a.dataset.vehicleMarquee,s=ae().find(o=>o.id===i);if(!s)return;const r=$(s.nextOffset??0);a.className=`line-marquee-item ${_(s,r)}`;const l=a.querySelector(".line-marquee-copy");l&&(l.innerHTML=kt(s))})}function an(e,t,a,i){const s=e.tripStatus?.activeTripId??e.tripId??"",r=i.get(s);if(!r||r.routeId!==t.routeKey)return null;const l=e.tripStatus?.closestStop,o=e.tripStatus?.nextStop,d=a.stationIndexByStopId.get(l),p=a.stationIndexByStopId.get(o);if(d==null&&p==null)return null;let u=d??p,m=p??d;if(u>m){const ra=u;u=m,m=ra}const g=a.stations[u],f=a.stations[m],h=e.tripStatus?.closestStopTimeOffset??0,v=e.tripStatus?.nextStopTimeOffset??0,S=r.directionId==="1"?"▲":r.directionId==="0"?"▼":Za(d,p);let I=0;u!==m&&h<0&&v>0&&(I=q(Math.abs(h)/(Math.abs(h)+v),0,1));const k=g.y+(f.y-g.y)*I,E=u!==m?g.segmentMinutes:0,A=g.cumulativeMinutes+E*I,R=d??p??u,Be=a.stations[R]??g,_e=S==="▲",aa=q(R+(_e?1:-1),0,a.stations.length-1),He=d!=null&&p!=null&&d!==p?p:q(R+(_e?-1:1),0,a.stations.length-1),na=a.stations[aa]??Be,ia=a.stations[He]??f,Fe=e.tripStatus?.scheduleDeviation??0,Ue=e.tripStatus?.predicted??!1,sa=Ja(Fe,Ue);return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:S,fromLabel:g.label,minutePosition:A,progress:I,serviceStatus:Qa(e),toLabel:f.label,y:k,currentLabel:g.label,nextLabel:f.label,previousLabel:na.label,currentStopLabel:Be.label,upcomingLabel:ia.label,currentIndex:R,upcomingStopIndex:He,status:e.tripStatus?.status??"",closestStop:l,nextStop:o,closestOffset:h,nextOffset:v,scheduleDeviation:Fe,isPredicted:Ue,delayInfo:sa,rawVehicle:e}}function nn(e){return e.fromLabel===e.toLabel||e.progress===0?n.language==="zh-CN"?`位于 ${e.fromLabel}`:`At ${e.fromLabel}`:`${e.fromLabel} -> ${e.toLabel}`}function sn(e){return e.fromLabel===e.toLabel||e.progress===0?n.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:n.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function rn(e){const t=n.layouts.get(e.lineId),a=Math.max(0,Xt(e,t).at(-1)?.etaSeconds??e.nextOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${n.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${i}</p>
        <p class="train-focus-metric-copy">${C($(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${n.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${ie(e,t)}</p>
        <p class="train-focus-metric-copy">${C($(a))}</p>
      </div>
    </div>
  `}function ae(){return n.lines.flatMap(e=>(n.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function on(){return Object.values(J).filter(e=>n.systemsById.has(e.id)).map(e=>`
        <button
          class="tab-button ${e.id===n.activeSystemId?"is-active":""}"
          data-system-switch="${e.id}"
          type="button"
        >
          ${e.label}
        </button>
      `).join("")}function ce(){return!n.compactLayout||n.lines.length<2?"":`<section class="line-switcher">${n.lines.map(t=>`
        <button
          class="line-switcher-button ${t.id===n.activeLineId?"is-active":""}"
          data-line-switch="${t.id}"
          type="button"
          style="--line-color:${t.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <span>${t.name}</span>
        </button>
      `).join("")}</section>`}function Rt(){return n.compactLayout?n.lines.filter(e=>e.id===n.activeLineId):n.lines}function G(e,t){const a=[...e].sort((r,l)=>r.minutePosition-l.minutePosition),i=[...t].sort((r,l)=>r.minutePosition-l.minutePosition),s=r=>r.slice(1).map((l,o)=>Math.round(l.minutePosition-r[o].minutePosition));return{nbGaps:s(a),sbGaps:s(i)}}function ln(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((s,r)=>s+r,0)/e.length,a=Math.max(...e),i=Math.min(...e);return{avg:Math.round(t),max:a,min:i,spread:a-i,ratio:a/Math.max(i,1)}}function ne(e,t){const a=ln(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let i="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?i="bunched":a.max>=12||a.spread>=6?i="uneven":a.avg>=18&&(i="sparse"),{health:i,stats:a}}function cn(e,t){if(!e.length||t<2)return{averageText:"—",detailText:n.language==="zh-CN"?`${b()}数量不足，无法判断间隔`:`Too few ${b().toLowerCase()} for a spacing read`};const a=Math.round(e.reduce((r,l)=>r+l,0)/e.length),i=Math.min(...e),s=Math.max(...e);return{averageText:`~${a} min`,detailText:n.language==="zh-CN"?`观测间隔 ${i}-${s} 分钟`:`${i}-${s} min observed gap`}}function nt(e,t,a){const{averageText:i,detailText:s}=cn(t,a);return`
    <div class="headway-health-card">
      <p class="headway-health-label">${e}</p>
      <p class="headway-health-value">${i}</p>
      <p class="headway-health-copy">${s}</p>
    </div>
  `}function zt(e){return e.reduce((t,a)=>{const i=Number(a.scheduleDeviation??0);return i<=60?t.onTime+=1:i<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function Ot(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function dn(e,t){return Math.abs(e.length-t.length)<=1?{label:n.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:e.length>t.length?{label:n.language==="zh-CN"?"▲ 偏多":"▲ Heavier",tone:"warn"}:{label:n.language==="zh-CN"?"▼ 偏多":"▼ Heavier",tone:"warn"}}function un(e,t){return`
    <div class="delay-distribution">
      ${[[n.language==="zh-CN"?"准点":"On time",e.onTime,"healthy"],[n.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",e.minorLate,"warn"],[n.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",e.severeLate,"alert"]].map(([i,s,r])=>`
        <div class="delay-chip delay-chip-${r}">
          <p class="delay-chip-label">${i}</p>
          <p class="delay-chip-value">${s}</p>
          <p class="delay-chip-copy">${Ot(s,t)}</p>
        </div>
      `).join("")}
    </div>
  `}function it(e,t,a,i){if(!t.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${e}</p>
          <p class="flow-lane-copy">${c("noLiveVehicles",b().toLowerCase())}</p>
        </div>
      </div>
    `;const s=[...t].sort((l,o)=>l.minutePosition-o.minutePosition),r=s.map(l=>{const o=a.totalMinutes>0?l.minutePosition/a.totalMinutes:0;return Math.max(0,Math.min(100,o*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${e}</p>
        <p class="flow-lane-copy">${c("liveCount",s.length,s.length===1?w().toLowerCase():b().toLowerCase())}</p>
      </div>
      <div class="flow-track" style="--line-color:${i};">
        ${r.map((l,o)=>`
          <span
            class="flow-vehicle"
            style="left:${l}%; --line-color:${i};"
            title="${s[o].label} · ${nn(s[o])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function Pt(e,t,a,i){const s=[],{stats:r}=ne(G(t,[]).nbGaps,t.length),{stats:l}=ne(G([],a).sbGaps,a.length),o=[...t,...a].filter(p=>Number(p.scheduleDeviation??0)>300),d=Math.abs(t.length-a.length);return r.max!=null&&r.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`▲ 方向当前有 ${r.max} 分钟的服务空档。`:`Direction ▲ has a ${r.max} min service hole right now.`}),l.max!=null&&l.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`▼ 方向当前有 ${l.max} 分钟的服务空档。`:`Direction ▼ has a ${l.max} min service hole right now.`}),d>=2&&s.push({tone:"warn",copy:t.length>a.length?n.language==="zh-CN"?`车辆分布向 ▲ 方向偏多 ${d} 辆。`:`Vehicle distribution is tilted toward ▲ by ${d}.`:n.language==="zh-CN"?`车辆分布向 ▼ 方向偏多 ${d} 辆。`:`Vehicle distribution is tilted toward ▼ by ${d}.`}),o.length&&s.push({tone:"warn",copy:n.language==="zh-CN"?`${o.length} 辆${o.length===1?w().toLowerCase():b().toLowerCase()}晚点超过 5 分钟。`:`${o.length} ${o.length===1?w().toLowerCase():b().toLowerCase()} are running 5+ min late.`}),i.length&&s.push({tone:"info",copy:n.language==="zh-CN"?`${e.name} 当前受 ${i.length} 条告警影响。`:`${i.length} active alert${i.length===1?"":"s"} affecting ${e.name}.`}),s.length||s.push({tone:"healthy",copy:n.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),s.slice(0,4)}function be(e){return e.map(t=>{const a=n.layouts.get(t.id),i=n.vehiclesByLine.get(t.id)??[],s=i.filter(o=>o.directionSymbol==="▲"),r=i.filter(o=>o.directionSymbol==="▼"),l=K(t.id);return{line:t,layout:a,vehicles:i,nb:s,sb:r,lineAlerts:l,exceptions:Pt(t,s,r,l)}})}function qt(e){const t=e.length,a=e.reduce((v,S)=>v+S.vehicles.length,0),i=e.reduce((v,S)=>v+S.lineAlerts.length,0),s=e.filter(v=>v.lineAlerts.length>0).length,r=e.flatMap(v=>v.vehicles),l=zt(r),o=new Set(e.filter(v=>v.vehicles.some(S=>Number(S.scheduleDeviation??0)>300)).map(v=>v.line.id)),d=new Set(e.filter(v=>{const{nbGaps:S,sbGaps:I}=G(v.nb,v.sb),k=ne(S,v.nb.length).health,E=ne(I,v.sb.length).health;return[k,E].some(A=>A==="uneven"||A==="bunched"||A==="sparse")}).map(v=>v.line.id)),p=new Set([...o,...d]).size,u=Math.max(0,t-p),m=a?Math.round(l.onTime/a*100):null,g=e.map(v=>{const{nbGaps:S,sbGaps:I}=G(v.nb,v.sb),k=[...S,...I].length?Math.max(...S,...I):0,E=v.vehicles.filter(R=>Number(R.scheduleDeviation??0)>300).length,A=v.lineAlerts.length*5+E*3+Math.max(0,k-10);return{line:v.line,score:A,worstGap:k,severeLateCount:E,alertCount:v.lineAlerts.length}}).sort((v,S)=>S.score-v.score||S.worstGap-v.worstGap);let f={tone:"healthy",copy:n.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const h=g[0]??null;return h?.alertCount?f={tone:"info",copy:n.language==="zh-CN"?`${h.line.name} 当前有 ${h.alertCount} 条生效告警。`:`${h.line.name} has ${h.alertCount} active alert${h.alertCount===1?"":"s"}.`}:h?.worstGap>=12?f={tone:"alert",copy:n.language==="zh-CN"?`当前最大实时间隔为空 ${h.line.name} 的 ${h.worstGap} 分钟。`:`Largest live gap: ${h.worstGap} min on ${h.line.name}.`}:h?.severeLateCount&&(f={tone:"warn",copy:n.language==="zh-CN"?`${h.line.name} 有 ${h.severeLateCount} 辆${h.severeLateCount===1?w().toLowerCase():b().toLowerCase()}晚点超过 5 分钟。`:`${h.line.name} has ${h.severeLateCount} ${h.severeLateCount===1?w().toLowerCase():b().toLowerCase()} running 5+ min late.`}),{totalLines:t,totalVehicles:a,totalAlerts:i,impactedLines:s,delayedLineIds:o,unevenLineIds:d,attentionLineCount:p,healthyLineCount:u,onTimeRate:m,rankedLines:g,topIssue:f}}function st(e,t,{suffix:a="",invert:i=!1}={}){if(e==null||t==null||e===t)return n.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const s=e-t,r=i?s<0:s>0,l=s>0?"↑":"↓";return n.language==="zh-CN"?`${r?"改善":"变差"} ${l} ${Math.abs(s)}${a}`:`${r?"Improving":"Worse"} ${l} ${Math.abs(s)}${a}`}function pn(e){const t=qt(e),a=n.systemSnapshots.get(n.activeSystemId)?.previous??null,i=[];t.totalAlerts>0&&i.push({tone:"info",copy:n.language==="zh-CN"?`${t.impactedLines} 条线路共受 ${t.totalAlerts} 条告警影响。`:`${t.totalAlerts} active alert${t.totalAlerts===1?"":"s"} across ${t.impactedLines} line${t.impactedLines===1?"":"s"}.`}),t.delayedLineIds.size>0&&i.push({tone:"warn",copy:n.language==="zh-CN"?`${t.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${t.delayedLineIds.size} line${t.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),t.unevenLineIds.size>0&&i.push({tone:"alert",copy:n.language==="zh-CN"?`${t.unevenLineIds.size} 条线路当前发车间隔不均。`:`${t.unevenLineIds.size} line${t.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),i.length||i.push({tone:"healthy",copy:n.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const s=[{label:n.language==="zh-CN"?"准点率":"On-Time Rate",value:t.onTimeRate!=null?`${t.onTimeRate}%`:"—",delta:st(t.onTimeRate,a?.onTimeRate,{suffix:"%"})},{label:n.language==="zh-CN"?"需关注线路":"Attention Lines",value:t.attentionLineCount,delta:st(t.attentionLineCount,a?.attentionLineCount,{invert:!0})}];return`
    <article class="panel-card panel-card-wide system-summary-card">
      <header class="panel-header">
        <div class="system-summary-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:var(--accent-strong);">${B().label[0]}</span>
            <div class="line-title-copy">
              <h2>${B().label} ${n.language==="zh-CN"?"概览":"Summary"}</h2>
              <p>${n.language==="zh-CN"?`系统内 ${t.totalLines} 条线路 · 更新于 ${ve()}`:`${t.totalLines} line${t.totalLines===1?"":"s"} in system · Updated ${ve()}`}</p>
            </div>
          </div>
        </div>
      </header>
      <div class="system-summary-hero">
        <div class="insight-exception insight-exception-${t.topIssue.tone}">
          <p>${t.topIssue.copy}</p>
        </div>
        <div class="system-trend-strip">
          ${s.map(r=>`
            <div class="metric-chip system-trend-chip">
              <p class="metric-chip-label">${r.label}</p>
              <p class="metric-chip-value">${r.value}</p>
              <p class="system-trend-copy">${r.delta}</p>
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
          <p class="metric-chip-label">${n.language==="zh-CN"?`实时${b()}`:`Live ${b()}`}</p>
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
          ${t.rankedLines.slice(0,3).map(({line:r,score:l,worstGap:o,alertCount:d,severeLateCount:p})=>`
            <div class="system-ranking-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${r.color};">${r.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${r.name}</p>
                  <p class="headway-chart-copy">${n.language==="zh-CN"?`评分 ${l}${o?` · 最大间隔 ${o} 分钟`:""}${d?` · ${d} 条告警`:""}${p?` · ${p} 辆严重晚点`:""}`:`Score ${l}${o?` · gap ${o} min`:""}${d?` · ${d} alert${d===1?"":"s"}`:""}${p?` · ${p} severe late`:""}`}</p>
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
        ${i.map(r=>`
          <div class="insight-exception insight-exception-${r.tone}">
            <p>${r.copy}</p>
          </div>
        `).join("")}
      </div>
    </article>
  `}function mn(e){const t=e.flatMap(l=>l.exceptions.map(o=>({tone:o.tone,copy:`${l.line.name}: ${o.copy}`,lineColor:l.line.color})));if(!t.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${n.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">${n.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span>
        </div>
      </section>
    `;const a=gn(),i=Math.ceil(t.length/a),s=n.insightsTickerIndex%i,r=t.slice(s*a,s*a+a);return`
    <section class="insights-ticker" aria-label="${n.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}">
      <div class="insights-ticker-viewport">
        ${r.map(l=>`
              <span class="insights-ticker-item insights-ticker-item-${l.tone} insights-ticker-item-animated">
                <span class="insights-ticker-dot" style="--line-color:${l.lineColor};"></span>
                <span class="insights-ticker-copy">${l.copy}</span>
              </span>
            `).join("")}
      </div>
    </section>
  `}function gn(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);return i>=1680?3:i>=980?2:1}function hn(e,t,a,i,s){const r=a.length+i.length;if(!r)return"";const{nbGaps:l,sbGaps:o}=G(a,i),d=zt([...a,...i]),p=[...l,...o].length?Math.max(...l,...o):null,u=dn(a,i),m=Pt(e,a,i,s),g=new Set(s.flatMap(f=>f.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"运营中":"In Service"}</p>
          <p class="metric-chip-value">${r}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"准点率":"On-Time Rate"}</p>
          <p class="metric-chip-value">${Ot(d.onTime,r)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"最大间隔":"Worst Gap"}</p>
          <p class="metric-chip-value">${p!=null?`${p} min`:"—"}</p>
        </div>
        <div class="metric-chip metric-chip-${u.tone}">
          <p class="metric-chip-label">${n.language==="zh-CN"?"方向平衡":"Balance"}</p>
          <p class="metric-chip-value">${u.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${nt(n.language==="zh-CN"?"▲ 方向":"Direction ▲",l,a.length)}
        ${nt(n.language==="zh-CN"?"▼ 方向":"Direction ▼",o,i.length)}
      </div>
      ${un(d,r)}
      <div class="flow-grid">
        ${it(n.language==="zh-CN"?"▲ 方向流向":"Direction ▲ Flow",a,t,e.color)}
        ${it(n.language==="zh-CN"?"▼ 方向流向":"Direction ▼ Flow",i,t,e.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${n.language==="zh-CN"?"当前":"Now"}</p>
          <p class="headway-chart-copy">${s.length?n.language==="zh-CN"?`${s.length} 条生效告警${g?` · 影响 ${g} 个站点`:""}`:`${s.length} active alert${s.length===1?"":"s"}${g?` · ${g} impacted stops`:""}`:n.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p>
        </div>
        ${m.map(f=>`
          <div class="insight-exception insight-exception-${f.tone}">
            <p>${f.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function Bt(e,t=!1){const a=Date.now(),i=r=>{const l=r.arrivalTime,o=Math.floor((l-a)/1e3),d=C(o),p=Vt(r.arrivalTime,r.scheduleDeviation??0),u=Re(p);let m="";if(r.distanceFromStop>0){const g=r.distanceFromStop>=1e3?`${(r.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(r.distanceFromStop)}m`,f=c("stopAway",r.numberOfStopsAway);m=` • ${g} • ${f}`}return`
      <div class="arrival-item" data-arrival-time="${r.arrivalTime}" data-schedule-deviation="${r.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${r.lineColor};">${r.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${r.lineName} ${w()} ${r.vehicleId}</span>
            <span class="arrival-destination">${c("toDestination",r.destination)}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${u}">${p}</span>
          <span class="arrival-time"><span class="arrival-countdown">${d}</span><span class="arrival-precision">${m}</span></span>
        </span>
      </div>
    `};if(t){Ze.innerHTML="",Qe.innerHTML="",V.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,W.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,Se();return}const s=(r,l,o)=>{if(!r.length){l.innerHTML="",o.innerHTML=`<div class="arrival-item muted">${c("noUpcomingVehicles",b().toLowerCase())}</div>`;return}const d=n.dialogDisplayMode?r.slice(0,2):[],p=n.dialogDisplayMode?r.slice(2):r;l.innerHTML=d.map(i).join(""),o.innerHTML=p.length?p.map(i).join(""):n.dialogDisplayMode?`<div class="arrival-item muted">${c("noAdditionalVehicles",b().toLowerCase())}</div>`:""};s(e.nb,Ze,V),s(e.sb,Qe,W),Se()}function j(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const i=new Set;for(const r of a){const l=r.startsWith(`${t.agencyId}_`)?r:`${t.agencyId}_${r}`;i.add(l)}const s=e.id.replace(/-T\d+$/,"");return i.add(s.startsWith(`${t.agencyId}_`)?s:`${t.agencyId}_${s}`),[...i]}function se(e){const t=n.lines.map(a=>{const i=a.stops.find(s=>s.id===e.id);return i?{line:a,station:i}:null}).filter(Boolean);return t.length>0?t:n.lines.map(a=>{const i=a.stops.find(s=>s.name===e.name);return i?{line:a,station:i}:null}).filter(Boolean)}function fn(e){if(!e)return null;const t=e.trim().toLowerCase();for(const a of n.lines)for(const i of a.stops){const s=new Set([i.id,`${a.agencyId}_${i.id}`,i.name,ee(i.name),Z(i.name),Z(ee(i.name))]);for(const r of a.stationAliases?.[i.id]??[])s.add(r),s.add(`${a.agencyId}_${r}`),s.add(Z(r));if([...s].some(r=>String(r).toLowerCase()===t))return i}return null}function vn(e){const t=new URL(window.location.href);t.searchParams.set("station",Z(e.name)),window.history.pushState({},"",t)}function _t(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function rt(e){const t=new URL(window.location.href);e===H?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function Ht(){const t=new URL(window.location.href).searchParams.get("system");return t&&n.systemsById.has(t)?t:H}function Ae(e){n.dialogDisplayMode=e,y.classList.toggle("is-display-mode",e),U.textContent=c(e?"exit":"board"),U.setAttribute("aria-label",c(e?"exit":"board")),n.dialogDisplayDirection="both",n.dialogDisplayAutoPhase="nb",De(),y.open&&n.currentDialogStation&&ze(n.currentDialogStation).catch(console.error),re(),Se()}function yn(){Ae(!n.dialogDisplayMode)}function Ne(){n.dialogDisplayDirectionTimer&&(window.clearInterval(n.dialogDisplayDirectionTimer),n.dialogDisplayDirectionTimer=0)}function De(){Ne();const e=n.dialogDisplayDirection,t=e==="auto"?n.dialogDisplayAutoPhase:e;vt.forEach(a=>{a.classList.toggle("is-active",a.dataset.dialogDirection===e)}),y.classList.toggle("show-nb-only",n.dialogDisplayMode&&t==="nb"),y.classList.toggle("show-sb-only",n.dialogDisplayMode&&t==="sb"),n.dialogDisplayMode&&e==="auto"&&(n.dialogDisplayDirectionTimer=window.setInterval(()=>{n.dialogDisplayAutoPhase=n.dialogDisplayAutoPhase==="nb"?"sb":"nb",De()},$a))}function ke(){n.dialogRefreshTimer&&(window.clearTimeout(n.dialogRefreshTimer),n.dialogRefreshTimer=0)}function Ee(){n.dialogDisplayTimer&&(window.clearInterval(n.dialogDisplayTimer),n.dialogDisplayTimer=0)}function de(e,t){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(e.style.transform="translateY(0)",!n.dialogDisplayMode||a.length<=3)return;const i=Number.parseFloat(window.getComputedStyle(e).rowGap||"0")||0,s=a[0].getBoundingClientRect().height+i,r=Math.max(0,a.length-3),l=Math.min(n.dialogDisplayIndexes[t],r);e.style.transform=`translateY(-${l*s}px)`}function Se(){Ee(),n.dialogDisplayIndexes={nb:0,sb:0},de(V,"nb"),de(W,"sb"),n.dialogDisplayMode&&(n.dialogDisplayTimer=window.setInterval(()=>{for(const[e,t]of[["nb",V],["sb",W]]){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const i=Math.max(0,a.length-3);n.dialogDisplayIndexes[e]=n.dialogDisplayIndexes[e]>=i?0:n.dialogDisplayIndexes[e]+1,de(t,e)}},ya))}function $n(){if(!y.open)return;y.querySelectorAll(".arrival-item[data-arrival-time]").forEach(t=>{const a=Number(t.dataset.arrivalTime),i=Number(t.dataset.scheduleDeviation||0),s=t.querySelector(".arrival-countdown"),r=t.querySelector(".arrival-status");if(!s||!r)return;s.textContent=C(Math.floor((a-Date.now())/1e3));const l=Vt(a,i),o=Re(l);r.textContent=l,r.className=`arrival-status arrival-status-${o}`})}function bn(){if(ke(),!n.currentDialogStation)return;const e=()=>{n.dialogRefreshTimer=window.setTimeout(async()=>{!y.open||!n.currentDialogStation||(await ze(n.currentDialogStation).catch(console.error),e())},va)};e()}function Ft(){n.currentDialogStationId="",n.currentDialogStation=null,y.open?y.close():(ke(),Ee(),Ne(),Ae(!1),_t())}async function ot(){const e=Ht();e!==n.activeSystemId&&await ta(e,{updateUrl:!1,preserveDialog:!1});const t=new URL(window.location.href).searchParams.get("station"),a=fn(t);n.isSyncingFromUrl=!0;try{if(!a){n.currentDialogStationId="",y.open&&y.close();return}if(n.activeTab="map",T(),n.currentDialogStationId===a.id&&y.open)return;await Kt(a,!1)}finally{n.isSyncingFromUrl=!1}}function Sn(e,t){const a=t.directionLookup?.[e.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const i=e.tripHeadsign??"",s=i.toLowerCase();return t.nbTerminusPrefix&&s.startsWith(t.nbTerminusPrefix)?"nb":t.sbTerminusPrefix&&s.startsWith(t.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(i)?"nb":/Federal Way|South Bellevue/i.test(i)?"sb":""}function Ut(e){return e.routeKey??`${e.agencyId}_${e.id}`}function wn(e){const t=e.tripHeadsign?.trim();return t?ee(t.replace(/^to\s+/i,"")):c("terminalFallback")}function Vt(e,t){return Math.floor((e-Date.now())/1e3)<=90?"ARR":t>=120?"DELAY":n.language==="zh-CN"?"准点":"ON TIME"}function Re(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}async function Ln(e){const t=`${dt}/arrivals-and-departures-for-stop/${e}.json?key=${Te}&minutesAfter=120`,a=await Dt(t,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${e}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function Wt(e){const t=[...new Set(e)],a=[],i=[];for(let s=0;s<t.length;s+=oe){const r=t.slice(s,s+oe),l=await Promise.allSettled(r.map(o=>Ln(o)));a.push(...l),je>0&&s+oe<t.length&&await xe(je)}for(const s of a)s.status==="fulfilled"&&i.push(...s.value);return i}function Gt(e,t,a=null){const i=Date.now(),s=new Set,r={nb:[],sb:[]},l=a?new Set(a):null;for(const o of e){if(o.routeId!==Ut(t)||l&&!l.has(o.stopId))continue;const d=o.predictedArrivalTime||o.scheduledArrivalTime;if(!d||d<=i)continue;const p=Sn(o,t);if(!p)continue;const u=`${o.tripId}:${o.stopId}:${d}`;s.has(u)||(s.add(u),r[p].push({vehicleId:(o.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:d,destination:wn(o),scheduleDeviation:o.scheduleDeviation??0,tripId:o.tripId,lineColor:t.color,lineName:t.name,lineToken:t.name[0],distanceFromStop:o.distanceFromStop??0,numberOfStopsAway:o.numberOfStopsAway??0}))}return r.nb.sort((o,d)=>o.arrivalTime-d.arrivalTime),r.sb.sort((o,d)=>o.arrivalTime-d.arrivalTime),r.nb=r.nb.slice(0,4),r.sb=r.sb.slice(0,4),r}async function Tn(e,t,a=null){const i=`${n.activeSystemId}:${t.id}:${e.id}`,s=n.arrivalsCache.get(i);if(s&&Date.now()-s.fetchedAt<pa)return s.value;const r=j(e,t),l=a??await Wt(r),o=Gt(l,t,r);return n.arrivalsCache.set(i,{fetchedAt:Date.now(),value:o}),o}function Cn(e){const t={nb:[],sb:[]};for(const a of e)t.nb.push(...a.nb),t.sb.push(...a.sb);return t.nb.sort((a,i)=>a.arrivalTime-i.arrivalTime),t.sb.sort((a,i)=>a.arrivalTime-i.arrivalTime),t}function jt(e){const t=Ga(e);if(!t.length){F.innerHTML="",F.hidden=!0;return}F.hidden=!1,F.innerHTML=`
    <div class="station-alerts">
      ${t.map((a,i)=>`
        <button class="station-alert-pill" data-alert-idx="${i}" type="button">
          <span class="station-alert-pill-meta">${Mt(a.severity)} · ${xt(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||c("serviceAlert")}</span>
        </button>
      `).join("")}
    </div>
  `,F.querySelectorAll(".station-alert-pill").forEach(a=>{const i=t[Number(a.dataset.alertIdx)];i&&a.addEventListener("click",()=>{const s=n.lines.find(r=>i.lineIds.includes(r.id));s&&Qt(s)})})}async function Kt(e,t=!0){Zt(e.name),Fa(e),n.currentDialogStationId=e.id,n.currentDialogStation=e,jt(e),Le([],!0),Bt({nb:[],sb:[]},!0),t&&vn(e),y.showModal(),re(),bn(),await ze(e)}async function ze(e){const t=n.activeDialogRequest+1;n.activeDialogRequest=t;try{const a=se(e),i=zn(e),s=a.flatMap(({station:d,line:p})=>j(d,p)),r=i.flatMap(({stop:d,line:p})=>j(d,p)),l=await Wt([...s,...r]),o=await Promise.all(a.map(({station:d,line:p})=>Tn(d,p,l)));if(n.activeDialogRequest!==t||!y.open)return;Le(On(i,l),!1,e),jt(e),Bt(Cn(o))}catch(a){if(n.activeDialogRequest!==t||!y.open)return;Le([],!1,e),V.innerHTML=`<div class="arrival-item muted">${a.message}</div>`,W.innerHTML=`<div class="arrival-item muted">${n.language==="zh-CN"?"请稍后重试":"Retry in a moment"}</div>`}}function In(e){const t=n.layouts.get(e.id),a=n.vehiclesByLine.get(e.id)??[],i=K(e.id),s=t.stations.map((o,d)=>{const p=t.stations[d-1],u=d>0?p.segmentMinutes:"",g=At(o,e).length>0,f=o.isTerminal?15:10;return`
        <g transform="translate(0, ${o.y})" class="station-group${g?" has-alert":""}" data-stop-id="${o.id}" style="cursor: pointer;">
          ${d>0?`<text x="0" y="-14" class="segment-time">${u}</text>
                 <line x1="18" x2="${t.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${t.trackX}" cy="0" r="${o.isTerminal?11:5}" class="${o.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${e.color};"></circle>
          ${o.isTerminal?`<text x="${t.trackX}" y="4" text-anchor="middle" class="terminal-mark">${e.name[0]}</text>`:""}
          ${g?`<circle cx="${t.trackX+f}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${t.labelX}" y="5" class="station-label">${o.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),r=a.map((o,d)=>{const p=kn(e.id,o.id);return`
        <g transform="translate(${t.trackX}, 0)" class="train" data-train-id="${o.id}">
          ${p.map((u,m)=>`
                <circle
                  cy="${u.y+(d%3-1)*1.5}"
                  r="${Math.max(3,7-m)}"
                  class="train-ghost-dot"
                  style="--line-color:${e.color}; --ghost-opacity:${Math.max(.18,.56-m*.1)};"
                ></circle>
              `).join("")}
          <g transform="translate(0, ${o.y+(d%3-1)*1.5})">
            <circle r="13" class="train-wave" style="--line-color:${e.color}; animation-delay:${d*.18}s;"></circle>
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${o.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${e.color};"></path>
          </g>
        </g>
      `}).join(""),l=w();return`
    <article class="line-card" data-line-id="${e.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <div class="line-title-copy">
            <div class="line-title-row">
              <h2>${e.name}</h2>
              ${Nt(i,e.id)}
            </div>
            <p>${c("liveCount",a.length,a.length===1?l.toLowerCase():b().toLowerCase())}</p>
            <p>${Ce(e)}</p>
          </div>
        </div>
        ${Ie(e)}
      </header>
      ${Et(e.color,a.map(o=>({...o,lineToken:e.name[0]})))}
      <svg viewBox="0 0 460 ${t.height}" class="line-diagram" role="img" aria-label="${n.language==="zh-CN"?`${e.name} 实时线路图`:`${e.name} live LED board`}">
        <line x1="${t.trackX}" x2="${t.trackX}" y1="${t.stations[0].y}" y2="${t.stations.at(-1).y}" class="spine" style="--line-color:${e.color};"></line>
        ${s}
        ${r}
      </svg>
    </article>
  `}function xn(){const e=ae().sort((l,o)=>l.minutePosition-o.minutePosition),t=w(),a=b(),i=a.toLowerCase();return e.length?(n.compactLayout?n.lines.filter(l=>l.id===n.activeLineId):n.lines).map(l=>{const o=e.filter(h=>h.lineId===l.id),d=K(l.id),p=[...o].sort((h,v)=>$(h.nextOffset??0)-$(v.nextOffset??0)),u=p[0]??null,m=p.slice(1),g=h=>`
        <span class="train-direction-badge">
          ${h.directionSymbol==="▲"?n.language==="zh-CN"?"▲ 北向":"▲ Northbound":h.directionSymbol==="▼"?n.language==="zh-CN"?"▼ 南向":"▼ Southbound":n.language==="zh-CN"?"运营中":"Active"}
        </span>
      `,f=h=>`
        <article class="train-list-item train-queue-item" data-train-id="${h.id}">
          <div class="train-list-main">
            <span class="line-token train-list-token" style="--line-color:${h.lineColor};">${h.lineToken}</span>
            <div>
              <div class="train-list-row">
                <p class="train-list-title">${h.lineName} ${t} ${h.label}</p>
                ${g(h)}
              </div>
              <p class="train-list-subtitle">${c("toDestination",ie(h,n.layouts.get(h.lineId)))}</p>
              <p class="train-list-status ${_(h,$(h.nextOffset??0))}" data-vehicle-status="${h.id}">${$e(h)}</p>
            </div>
          </div>
          <div class="train-queue-side">
            <p class="train-queue-time">${C($(h.nextOffset??0))}</p>
            <p class="train-queue-clock">${we($(h.nextOffset??0))}</p>
          </div>
        </article>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${l.color};">${l.name[0]}</span>
              <div class="line-title-copy">
                <div class="line-title-row">
                  <h2>${l.name}</h2>
                  ${Nt(d,l.id)}
                </div>
                <p>${c("inServiceCount",o.length,o.length===1?t.toLowerCase():b().toLowerCase())} · ${Ce(l)}</p>
              </div>
            </div>
            ${Ie(l)}
          </header>
          ${Et(l.color,o)}
          <div class="line-readout train-columns train-stack-layout">
            ${u?`
                  <article class="train-focus-card train-list-item" data-train-id="${u.id}">
                    <div class="train-focus-header">
                      <div>
                        <p class="train-focus-kicker">${n.language==="zh-CN"?"最近一班":"Next up"}</p>
                        <div class="train-list-row">
                          <p class="train-focus-title">${u.lineName} ${t} ${u.label}</p>
                          ${g(u)}
                        </div>
                      </div>
                      <div class="train-focus-side">
                        <p class="train-focus-time">${C($(u.nextOffset??0))}</p>
                        <p class="train-focus-clock">${we($(u.nextOffset??0))}</p>
                      </div>
                    </div>
                    <p class="train-focus-destination">${c("toDestination",ie(u,n.layouts.get(u.lineId)))}</p>
                    <p class="train-focus-segment">${sn(u)}</p>
                    ${rn(u)}
                    <p class="train-list-status ${_(u,$(u.nextOffset??0))}" data-vehicle-status="${u.id}">${$e(u)}</p>
                  </article>
                `:`<p class="train-readout muted">${c("noLiveVehicles",b().toLowerCase())}</p>`}
            ${m.length?`
                  <div class="train-queue-list">
                    <p class="train-queue-heading">${n.language==="zh-CN"?"后续车次":"Following vehicles"}</p>
                    ${m.map(f).join("")}
                  </div>
                `:""}
          </div>
        </article>
      `}).join(""):`
      <section class="board" style="grid-template-columns: 1fr;">
        <article class="panel-card">
          <h2>${c("activeVehicles",a)}</h2>
          <p>${c("noLiveVehicles",i)}</p>
        </article>
      </section>
    `}function Yt(e){return new Date(e).toLocaleTimeString(n.language==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:n.language!=="zh-CN"})}function we(e){return Yt(Date.now()+Math.max(0,e)*1e3)}function ie(e,t){const a=e.directionSymbol==="▲"?0:t.stations.length-1;return t.stations[a]?.label??e.upcomingLabel}function Xt(e,t,a=6){if(!t?.stations?.length)return[];const i=e.directionSymbol==="▲"?-1:1,s=[],r=new Set,l=e.upcomingStopIndex??e.currentIndex,o=Math.max(0,e.nextOffset??0),d=(u,m,{isNext:g=!1,isTerminal:f=!1}={})=>{if(u==null||r.has(u))return;const h=t.stations[u];h&&(r.add(u),s.push({id:`${e.id}:${h.id}`,label:h.label,etaSeconds:Math.max(0,Math.round(m)),clockTime:we(m),isNext:g,isTerminal:f}))};d(l,o,{isNext:!0});let p=o;for(let u=l+i;s.length<a&&!(u<0||u>=t.stations.length);u+=i){const m=u-i,g=t.stations[m];p+=Math.max(0,Math.round((g?.segmentMinutes??0)*60));const f=u===0||u===t.stations.length-1;d(u,p,{isTerminal:f})}return s}function Zt(e){ht.textContent=e,Aa.textContent=e,re()}function re(){const e=xa;if(!e||!Ma)return;const a=n.dialogDisplayMode&&y.open&&ht.scrollWidth>e.clientWidth;e.classList.toggle("is-marquee",a)}function Mn(e,t,a,i){const r=(a-e)*Math.PI/180,l=(i-t)*Math.PI/180,o=Math.sin(r/2)**2+Math.cos(e*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(l/2)**2;return 2*6371*Math.asin(Math.sqrt(o))}function An(e){return Math.max(1,Math.round(e/ba*60))}function Nn(e){return e>=1?c("walkKm",e):c("walkMeters",Math.round(e*1e3))}function Dn(e,t){const a=Date.now(),i=new Set;for(const s of t){const r=`${e}:${s.id}`;i.add(r);const o=[...(n.vehicleGhosts.get(r)??[]).filter(d=>a-d.timestamp<=Ke),{y:s.y,minutePosition:s.minutePosition,timestamp:a}].slice(-6);n.vehicleGhosts.set(r,o)}for(const[s,r]of n.vehicleGhosts.entries()){if(!s.startsWith(`${e}:`))continue;const l=r.filter(o=>a-o.timestamp<=Ke);if(!i.has(s)||l.length===0){n.vehicleGhosts.delete(s);continue}l.length!==r.length&&n.vehicleGhosts.set(s,l)}}function kn(e,t){return(n.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}function En(e,t){const a=e.lat*Math.PI/180,i=t.lat*Math.PI/180,s=(t.lon-e.lon)*Math.PI/180,r=Math.sin(s)*Math.cos(i),l=Math.cos(a)*Math.sin(i)-Math.sin(a)*Math.cos(i)*Math.cos(s);return(Math.atan2(r,l)*180/Math.PI+360)%360}function Rn(e,t){if(!e||!t.length)return"";const a=Math.max(...t.map(s=>s.distanceKm),ut/2),i=82;return`
    <div class="transfer-radar">
      <svg viewBox="0 0 164 164" class="transfer-radar-svg" aria-hidden="true">
        <circle cx="${i}" cy="${i}" r="64" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="44" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="24" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="8" class="transfer-radar-core"></circle>
        ${t.map(s=>{const r=En(e,s.stop),l=22+s.distanceKm/a*44,o=i+Math.sin(r*Math.PI/180)*l,d=i-Math.cos(r*Math.PI/180)*l;return`
              <g>
                <line x1="${i}" y1="${i}" x2="${o.toFixed(1)}" y2="${d.toFixed(1)}" class="transfer-radar-spoke"></line>
                <circle cx="${o.toFixed(1)}" cy="${d.toFixed(1)}" r="7" class="transfer-radar-stop" style="--line-color:${s.line.color};"></circle>
              </g>
            `}).join("")}
      </svg>
      <div class="transfer-radar-copy">
        <p class="headway-chart-title">${n.language==="zh-CN"?"换乘雷达":"Transfer Radar"}</p>
        <p class="headway-chart-copy">${n.language==="zh-CN"?"中心为当前站，越远表示步行越久":"Center is this station; farther dots mean longer walks"}</p>
      </div>
    </div>
  `}function zn(e){if(!e)return[];const t=se(e),a=new Set(t.map(({line:s,station:r})=>`${s.agencyId}:${s.id}:${r.id}`)),i=new Map;for(const s of n.systemsById.values())for(const r of s.lines??[])for(const l of r.stops??[]){if(a.has(`${r.agencyId}:${r.id}:${l.id}`))continue;const o=Mn(e.lat,e.lon,l.lat,l.lon);if(o>ut)continue;const d=`${s.id}:${r.id}`,p=i.get(d);(!p||o<p.distanceKm)&&i.set(d,{systemId:s.id,systemName:s.name,line:r,stop:l,distanceKm:o,walkMinutes:An(o)})}return[...i.values()].sort((s,r)=>s.distanceKm-r.distanceKm||s.line.name.localeCompare(r.line.name)).slice(0,pt*2)}function Le(e,t=!1,a=n.currentDialogStation){if(t){z.hidden=!1,z.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">${c("transfers")}</h4>
          <p class="transfer-panel-copy">${c("checkingNearbyConnections")}</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">${c("loadingTransferRecommendations")}</div>
        </div>
      </div>
    `;return}if(!e.length){z.hidden=!0,z.innerHTML="";return}z.hidden=!1,z.innerHTML=`
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <h4 class="arrivals-title">${c("transfers")}</h4>
        <p class="transfer-panel-copy">${c("closestBoardableConnections")}</p>
      </div>
      ${Rn(a,e)}
      <div class="transfer-list">
        ${e.map(i=>`
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${i.line.color};">${i.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${i.line.name} <span class="transfer-system-chip">${i.systemName}</span></p>
                    <p class="transfer-card-stop">${c("walkToStop",i.walkMinutes,i.stop.name)}</p>
                    <p class="transfer-card-meta">${Nn(i.distanceKm)}${i.arrival?` • ${c("toDestination",i.arrival.destination)}`:""}</p>
                  </div>
                </div>
                <div class="transfer-card-side">
                  <span class="transfer-card-badge transfer-card-badge-${i.tone}">${i.badge}</span>
                  <span class="transfer-card-time">${i.timeText}</span>
                </div>
              </article>
            `).join("")}
      </div>
    </div>
  `}function On(e,t){const a=Date.now(),i=[];for(const s of e){const r=j(s.stop,s.line),l=Gt(t,s.line,r),o=[...l.nb,...l.sb].sort((g,f)=>g.arrivalTime-f.arrivalTime);if(!o.length)continue;const d=a+s.walkMinutes*6e4+Sa,p=o.find(g=>g.arrivalTime>=d)??o[0],u=p.arrivalTime-a-s.walkMinutes*6e4,m=Math.max(0,Math.round(u/6e4));i.push({...s,arrival:p,boardAt:p.arrivalTime,badge:u<=0?c("leaveNow"):m<=1?c("boardInOneMinute"):c("boardInMinutes",m),tone:m<=2?"hot":m<=8?"good":"calm",timeText:Yt(p.arrivalTime)})}return i.sort((s,r)=>s.boardAt-r.boardAt||s.distanceKm-r.distanceKm).slice(0,pt)}function Pn(){const e=Rt(),t=be(n.lines),a=w(),i=be(e);return`
    ${mn(i)}
    ${pn(t)}
    ${i.map(({line:s,layout:r,vehicles:l,nb:o,sb:d,lineAlerts:p})=>{const u=hn(s,r,o,d,p);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header line-card-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${s.color};">${s.name[0]}</span>
              <div class="line-title-copy">
                <h2>${s.name}</h2>
                <p>${c("liveCount",l.length,l.length===1?w().toLowerCase():b().toLowerCase())} · ${Ce(s)}</p>
              </div>
            </div>
            ${Ie(s)}
          </header>
          ${Wa(s)}
          ${u||`<p class="train-readout muted">${n.language==="zh-CN"?`等待实时${a.toLowerCase()}数据…`:`Waiting for live ${a.toLowerCase()} data…`}</p>`}
        </article>
      `}).join("")}
  `}function qn(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await ta(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function ue(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{n.activeLineId=t.dataset.lineSwitch,T()})})}function Oe(){n.currentTrainId="",M.open&&M.close()}function Pe(){N.open&&N.close()}function Qt(e){const t=K(e.id);St.textContent=c("affectedLineAlerts",e.name,t.length),wt.textContent=c("activeAlerts",t.length),Ea.textContent=e.name,tt.textContent="",tt.innerHTML=t.length?t.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${Mt(a.severity)} • ${xt(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||c("serviceAlert")}</p>
              <p class="alert-dialog-item-copy">${a.description||c("noAdditionalAlertDetails")}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">${c("readOfficialAlert")}</a></p>`:""}
            </article>
          `).join(""):`<p class="alert-dialog-item-copy">${c("noActiveAlerts")}</p>`,fe.hidden=!0,fe.removeAttribute("href"),N.open||N.showModal()}function lt(){document.querySelectorAll("[data-alert-line-id]").forEach(t=>{t.addEventListener("click",()=>{const a=n.lines.find(i=>i.id===t.dataset.alertLineId);a&&Qt(a)})})}function Bn(e){const t=e.fromLabel!==e.toLabel&&e.progress>0&&e.progress<1,a=t?e.fromLabel:e.previousLabel,i=t?`${e.fromLabel} -> ${e.toLabel}`:e.currentStopLabel,s=t?"Between":"Now",r=t?e.toLabel:e.upcomingLabel,l=t?e.progress:.5,o=n.layouts.get(e.lineId),d=Xt(e,o),p=o?ie(e,o):e.upcomingLabel,u=d.at(-1)?.etaSeconds??Math.max(0,e.nextOffset??0),m=e.directionSymbol==="▲"?n.language==="zh-CN"?"北向":"Northbound":e.directionSymbol==="▼"?n.language==="zh-CN"?"南向":"Southbound":c("active");yt.textContent=`${e.lineName} ${w()} ${e.label}`,$t.textContent=n.language==="zh-CN"?`${m} · ${c("toDestination",p)}`:`${m} to ${p}`,et.className=`train-detail-status train-list-status-${Re(e.serviceStatus)}`,et.innerHTML=P(Me(e)),M.querySelector(".train-eta-panel")?.remove(),Je.innerHTML=`
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
        <p class="train-detail-name">${r}</p>
      </div>
    </div>
  `,Je.insertAdjacentHTML("afterend",`
      <section class="train-eta-panel">
        <div class="train-eta-summary">
          <div class="metric-chip">
            <p class="metric-chip-label">${c("direction")}</p>
            <p class="metric-chip-value">${m}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("terminal")}</p>
            <p class="metric-chip-value">${p}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("etaToTerminal")}</p>
            <p class="metric-chip-value">${C(u)}</p>
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
                      <p class="train-eta-stop-countdown">${C(g.etaSeconds)}</p>
                      <p class="train-eta-stop-clock">${g.clockTime}</p>
                    </div>
                  </article>
                `).join(""):`<p class="train-readout muted">${c("noDownstreamEta")}</p>`}
        </div>
      </section>
    `),M.open||M.showModal()}function ct(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,i=ae().find(s=>s.id===a);i&&(n.currentTrainId=a,Bn(i))})})}function _n(){n.lines.forEach(e=>{const t=n.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.stopId,l=t.stations.find(o=>o.id===r);l&&Kt(l)})})})}function T(){const e=B();if(document.documentElement.lang=n.language,me.textContent=c("languageToggle"),me.setAttribute("aria-label",c("languageToggleAria")),ge.textContent=n.theme==="dark"?c("themeLight"):c("themeDark"),ge.setAttribute("aria-label",c("themeToggleAria")),La.textContent=e.kicker,Ta.textContent=e.title,le.setAttribute("aria-label",c("transitSystems")),Ca.setAttribute("aria-label",c("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",c("boardDirectionView")),Da.textContent=c("northbound"),ka.textContent=c("southbound"),U.textContent=n.dialogDisplayMode?c("exit"):c("board"),U.setAttribute("aria-label",n.dialogDisplayMode?c("exit"):c("board")),bt.setAttribute("aria-label",c("closeTrainDialog")),Lt.setAttribute("aria-label",c("closeAlertDialog")),y.open||(Zt(c("station")),ft.textContent=c("serviceSummary")),M.open||(yt.textContent=c("train"),$t.textContent=c("currentMovement")),N.open||(St.textContent=c("serviceAlert"),wt.textContent=c("transitAdvisory")),fe.textContent=c("readOfficialAlert"),le.hidden=n.systemsById.size<2,le.innerHTML=on(),Jt(),pe.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===n.activeTab)),pe.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=c("tabMap")),t.dataset.tab==="trains"&&(t.textContent=b()),t.dataset.tab==="insights"&&(t.textContent=c("tabInsights"))}),qn(),n.activeTab==="map"){x.className="board";const t=Rt();x.innerHTML=`${ce()}${t.map(In).join("")}`,ue(),lt(),_n(),ct(),queueMicrotask(te);return}if(n.activeTab==="trains"){x.className="board",x.innerHTML=`${ce()}${xn()}`,ue(),lt(),ct(),queueMicrotask(te);return}n.activeTab==="insights"&&(x.className="board",x.innerHTML=`${ce()}${Pn()}`,ue())}function Hn(){window.clearInterval(n.insightsTickerTimer),n.insightsTickerTimer=0}function Fn(){Hn(),n.insightsTickerTimer=window.setInterval(()=>{n.insightsTickerIndex+=1,n.activeTab==="insights"&&T()},5e3)}function Jt(){X.textContent=n.error?c("statusHold"):c("statusSync"),X.classList.toggle("status-pill-error",!!n.error),Ia.textContent=`${c("nowPrefix")} ${ve()}`,he.textContent=n.error?n.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":_a(n.fetchedAt),Xe.textContent=X.textContent,Xe.classList.toggle("status-pill-error",!!n.error),Na.textContent=he.textContent}function Un(){window.clearTimeout(n.liveRefreshTimer),n.liveRefreshTimer=0}function Vn(){Un();const e=()=>{n.liveRefreshTimer=window.setTimeout(async()=>{await qe(),e()},fa)};e()}function ea(e){const t=n.systemsById.has(e)?e:H,a=n.systemsById.get(t);n.activeSystemId=t,n.lines=a?.lines??[],n.layouts=n.layoutsBySystem.get(t)??new Map,n.lines.some(i=>i.id===n.activeLineId)||(n.activeLineId=n.lines[0]?.id??""),n.vehiclesByLine=new Map,n.rawVehicles=[],n.arrivalsCache.clear(),n.alerts=[],n.error="",n.fetchedAt="",n.insightsTickerIndex=0,n.vehicleGhosts=new Map}async function ta(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!n.systemsById.has(e)||n.activeSystemId===e){t&&rt(n.activeSystemId);return}ea(e),a||Ft(),Oe(),Pe(),T(),t&&rt(e),await qe()}async function Wn(){const a=(await(await fetch(ua,{cache:"no-store"})).json()).systems??[];n.systemsById=new Map(a.map(i=>[i.id,i])),n.layoutsBySystem=new Map(a.map(i=>[i.id,new Map(i.lines.map(s=>[s.id,Xa(s)]))])),ea(Ht())}function Gn(e){const t=[...new Set((e.allAffects??[]).map(i=>i.routeId).filter(Boolean))],a=n.lines.filter(i=>t.includes(Ut(i))).map(i=>i.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??c("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(i=>i.stopId).filter(Boolean))]}:null}async function qe(){try{const e=await Dt(za(),"Realtime");n.error="",n.fetchedAt=new Date().toISOString(),n.rawVehicles=e.data.list??[],n.alerts=(e.data.references?.situations??[]).map(Gn).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(s=>[s.id,s]));for(const s of n.lines){const r=n.layouts.get(s.id),l=n.rawVehicles.map(o=>an(o,s,r,t)).filter(Boolean);n.vehiclesByLine.set(s.id,l),Dn(s.id,l)}const a=qt(be(n.lines)),i=n.systemSnapshots.get(n.activeSystemId);n.systemSnapshots.set(n.activeSystemId,{previous:i?.current??null,current:a})}catch(e){n.error=c("realtimeOffline"),console.error(e)}T()}async function jn(){Ct(Ba()),Tt(qa()),at(),await Wn(),T(),await qe(),await ot(),window.addEventListener("popstate",()=>{ot().catch(console.error)});const e=()=>{const a=n.compactLayout;if(at(),re(),a!==n.compactLayout){T();return}te()};window.addEventListener("resize",e),window.visualViewport?.addEventListener("resize",e),new ResizeObserver(()=>{te()}).observe(x),Vn(),Fn(),window.setInterval(()=>{Jt(),$n(),tn()},1e3)}jn().catch(e=>{X.textContent=c("statusFail"),he.textContent=e.message});
