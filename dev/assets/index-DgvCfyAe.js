(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const ya="modulepreload",$a=function(e){return"/link/dev/"+e},et={},ba=function(t,a,i){let s=Promise.resolve();if(a&&a.length>0){let m=function(u){return Promise.all(u.map(p=>Promise.resolve(p).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};var o=m;document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");s=m(a.map(u=>{if(u=$a(u),u in et)return;et[u]=!0;const p=u.endsWith(".css"),g=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${g}`))return;const v=document.createElement("link");if(v.rel=p?"stylesheet":ya,p||(v.as="script"),v.crossOrigin="",v.href=u,d&&v.setAttribute("nonce",d),document.head.appendChild(v),p)return new Promise((f,x)=>{v.addEventListener("load",f),v.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(l){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=l,window.dispatchEvent(d),!d.defaultPrevented)throw l}return s.then(l=>{for(const d of l||[])d.status==="rejected"&&r(d.reason);return t().catch(r)})};function Sa(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:i,onRegistered:s,onRegisteredSW:r,onRegisterError:o}=e;let l,d;const m=async(p=!0)=>{await d};async function u(){if("serviceWorker"in navigator){if(l=await ba(async()=>{const{Workbox:p}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:p}},[]).then(({Workbox:p})=>new p("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(p=>{o?.(p)}),!l)return;l.addEventListener("activated",p=>{(p.isUpdate||p.isExternal)&&window.location.reload()}),l.addEventListener("installed",p=>{p.isUpdate||i?.()}),l.register({immediate:t}).then(p=>{r?r("/link/dev/sw.js",p):s?.(p)}).catch(p=>{o?.(p)})}}return d=u(),m}const wa="./pulse-data.json",St="https://api.pugetsound.onebusaway.org/api/where",_e="TEST".trim()||"TEST",E=_e==="TEST",La=E?6e4:2e4,tt=3,Ta=800,Ca=E?2e4:5e3,at=E?12e4:3e4,nt=E?1200:0,we=E?1:3,Ia=1100,xa=E?45e3:15e3,Aa=E?9e4:3e4,Da=4e3,Ma=15e3,Na=520,it=4*6e4,ka=4.8,wt=.35,Ea=3e3,Ra=45e3,Lt=4,Tt="link-pulse-theme",Ct="link-pulse-language",G="link",de={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},st={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}},n={fetchedAt:"",error:"",activeSystemId:G,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayDirectionAnimationTimer:0,dialogDisplayAnimatingDirection:"",dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},za=Sa({immediate:!0,onNeedRefresh(){za(!0)}});document.querySelector("#app").innerHTML=`
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
`;const A=document.querySelector("#board"),Oa=document.querySelector("#screen-kicker"),Pa=document.querySelector("#screen-title"),Le=document.querySelector("#system-bar"),Ba=document.querySelector("#view-bar"),xe=[...document.querySelectorAll(".tab-button")],Ae=document.querySelector("#language-toggle"),De=document.querySelector("#theme-toggle"),oe=document.querySelector("#status-pill"),qa=document.querySelector("#current-time"),Me=document.querySelector("#updated-at"),b=document.querySelector("#station-dialog"),_a=document.querySelector("#dialog-title"),Fa=document.querySelector("#dialog-title-track"),It=document.querySelector("#dialog-title-text"),Ha=document.querySelector("#dialog-title-text-clone"),xt=document.querySelector("#dialog-service-summary"),rt=document.querySelector("#dialog-status-pill"),Ua=document.querySelector("#dialog-updated-at"),X=document.querySelector("#dialog-display"),At=[...document.querySelectorAll("[data-dialog-direction]")],Dt=document.querySelector("#arrivals-title-nb"),Mt=document.querySelector("#arrivals-title-sb"),j=document.querySelector("#station-alerts-container"),q=document.querySelector("#transfer-section"),Nt=document.querySelector('[data-direction-section="nb"]'),ot=document.querySelector("#arrivals-nb-pinned"),Z=document.querySelector("#arrivals-nb"),kt=document.querySelector('[data-direction-section="sb"]'),lt=document.querySelector("#arrivals-sb-pinned"),Q=document.querySelector("#arrivals-sb"),M=document.querySelector("#train-dialog"),Et=document.querySelector("#train-dialog-title"),Rt=document.querySelector("#train-dialog-subtitle"),ct=document.querySelector("#train-dialog-line"),dt=document.querySelector("#train-dialog-status"),zt=document.querySelector("#train-dialog-close"),k=document.querySelector("#alert-dialog"),Ot=document.querySelector("#alert-dialog-title"),Pt=document.querySelector("#alert-dialog-subtitle"),Va=document.querySelector("#alert-dialog-lines"),ut=document.querySelector("#alert-dialog-body"),Ne=document.querySelector("#alert-dialog-link"),Bt=document.querySelector("#alert-dialog-close");X.addEventListener("click",()=>Nn());zt.addEventListener("click",()=>Ze());Bt.addEventListener("click",()=>Qe());Ae.addEventListener("click",()=>{Ft(n.language==="en"?"zh-CN":"en"),C()});At.forEach(e=>{e.addEventListener("click",()=>{n.dialogDisplayDirection=e.dataset.dialogDirection,n.dialogDisplayDirection==="auto"&&(n.dialogDisplayAutoPhase="nb"),Ge()})});b.addEventListener("click",e=>{e.target===b&&ia()});M.addEventListener("click",e=>{e.target===M&&Ze()});k.addEventListener("click",e=>{e.target===k&&Qe()});b.addEventListener("close",()=>{je(),Ke(),We(),Ve(!1),n.isSyncingFromUrl||ta()});xe.forEach(e=>{e.addEventListener("click",()=>{n.activeTab=e.dataset.tab,C()})});De.addEventListener("click",()=>{_t(n.theme==="dark"?"light":"dark"),C()});function U(){return de[n.activeSystemId]??de[G]}function Wa(){return n.systemsById.get(n.activeSystemId)?.agencyId??de[G].agencyId}function Ga(){return`${St}/vehicles-for-agency/${Wa()}.json?key=${_e}`}function L(){return n.language==="zh-CN"?U().vehicleLabel==="Train"?"列车":"公交":U().vehicleLabel??"Vehicle"}function ja(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function S(){return n.language==="zh-CN"?L():U().vehicleLabelPlural??ja(L())}function Ka(){return st[n.language]??st.en}function c(e,...t){const a=Ka()[e];return typeof a=="function"?a(...t):a}function qt(e,t=!1){const a=t&&(e==="▲"||e==="▼")?`${e} `:"";return e==="▲"?`${a}${n.language==="zh-CN"?"北向":"Northbound"}`:e==="▼"?`${a}${n.language==="zh-CN"?"南向":"Southbound"}`:c("active")}function V(e,t="",{includeSymbol:a=!1}={}){const i=qt(e,a);return t?n.language==="zh-CN"?`${i} · 开往 ${t}`:`${i} to ${t}`:i}function Ya(e,t){if(!t?.stations?.length)return"";const a=e==="▲"?0:e==="▼"?t.stations.length-1:-1;return a<0?"":t.stations[a]?.label??""}function D(e,t,a={}){return V(e,Ya(e,t),a)}function ue(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function Xa(){const e=window.localStorage.getItem(Tt);return e==="light"||e==="dark"?e:"dark"}function Za(){const e=window.localStorage.getItem(Ct);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function _t(e){n.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(Tt,e)}function Ft(e){n.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=n.language,window.localStorage.setItem(Ct,n.language)}function pt(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);n.compactLayout=i<=Ia}function pe(){const a=window.getComputedStyle(A).gridTemplateColumns.split(" ").map(i=>i.trim()).filter(Boolean).length<=1;a!==n.compactLayout&&(n.compactLayout=a,C())}function le(e){return e.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function H(e,t,a){return Math.max(t,Math.min(e,a))}function Qa(e){if(!e)return c("waitingSnapshot");const t=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return t<10?c("updatedNow"):t<60?c("updatedSecondsAgo",t):c("updatedMinutesAgo",Math.round(t/60))}function ke(){return new Intl.DateTimeFormat(n.language==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:n.language!=="zh-CN"}).format(new Date)}function I(e){if(e<=0)return c("arriving");const t=Math.floor(e/60),a=e%60;return n.language==="zh-CN"?t>0?`${t}分 ${a}秒`:`${a}秒`:t>0?`${t}m ${a}s`:`${a}s`}function Ja(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function ce(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function Ee(e){const[t="0",a="0",i="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(i)}function _(e,t){if(!e||!t)return null;const[a,i,s]=e.split("-").map(Number),r=Ee(t),o=Math.floor(r/3600),l=Math.floor(r%3600/60),d=r%60;return new Date(a,i-1,s,o,l,d)}function re(e){const t=Math.max(0,Math.round(e/6e4)),a=Math.floor(t/60),i=t%60;return n.language==="zh-CN"?a&&i?`${a}小时${i}分钟`:a?`${a}小时`:`${i}分钟`:a&&i?`${a}h ${i}m`:a?`${a}h`:`${i}m`}function T(e){if(!e)return"";const[t="0",a="0"]=String(e).split(":"),i=Number(t),s=Number(a),r=(i%24+24)%24;if(n.language==="zh-CN")return`${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`;const o=r>=12?"PM":"AM";return`${r%12||12}:${String(s).padStart(2,"0")} ${o}`}function Fe(e){const t=Ja(),a=e.serviceSpansByDate?.[t];return a?c("todayServiceSpan",T(a.start),T(a.end)):c("todayServiceUnavailable")}function Ht(e){const t=new Date,a=ce(-1),i=ce(0),s=ce(1),r=e.serviceSpansByDate?.[a],o=e.serviceSpansByDate?.[i],l=e.serviceSpansByDate?.[s],m=[r&&{kind:"yesterday",start:_(a,r.start),end:_(a,r.end),span:r},o&&{kind:"today",start:_(i,o.start),end:_(i,o.end),span:o}].filter(Boolean).find(u=>t>=u.start&&t<=u.end);if(m)return{tone:"active",headline:c("lastTrip",T(m.span.end)),detail:c("endsIn",re(m.end.getTime()-t.getTime())),compact:c("endsIn",re(m.end.getTime()-t.getTime()))};if(o){const u=_(i,o.start),p=_(i,o.end);if(t<u)return{tone:"upcoming",headline:c("firstTrip",T(o.start)),detail:c("startsIn",re(u.getTime()-t.getTime())),compact:c("startsIn",re(u.getTime()-t.getTime()))};if(t>p)return{tone:"ended",headline:c("serviceEnded",T(o.end)),detail:l?c("nextStart",T(l.start)):c("noNextServiceLoaded"),compact:l?c("nextStart",T(l.start)):c("ended")}}return l?{tone:"upcoming",headline:c("nextFirstTrip",T(l.start)),detail:c("noServiceRemainingToday"),compact:c("nextStart",T(l.start))}:{tone:"muted",headline:c("serviceHoursUnavailable"),detail:c("staticScheduleMissing"),compact:c("unavailable")}}function He(e){const t=Ht(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function en(e){const t=ve(e).map(({line:a})=>{const i=Ht(a);return`${a.name}: ${i.compact}`}).slice(0,3);xt.textContent=t.join("  ·  ")||c("serviceSummaryUnavailable")}function tn(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function an(e){const t=ce(0),a=e.serviceSpansByDate?.[t];if(!a)return null;const i=Ee(a.start)/3600,s=Ee(a.end)/3600,r=tn(new Date),o=Math.max(24,s,r,1);return{startHours:i,endHours:s,nowHours:r,axisMax:o,startLabel:T(a.start),endLabel:T(a.end)}}function nn(e){const t=an(e);if(!t)return"";const a=H(t.startHours/t.axisMax*100,0,100),i=H(t.endHours/t.axisMax*100,a,100),s=H(t.nowHours/t.axisMax*100,0,100),r=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
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
  `}function Ut(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function Vt(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function ee(e){return n.alerts.filter(t=>t.lineIds.includes(e))}function Wt(e,t){const a=ee(t.id);if(!a.length)return[];const i=new Set(J(e,t));return i.add(e.id),a.filter(s=>s.stopIds.length>0&&s.stopIds.some(r=>i.has(r)))}function sn(e){const t=new Set,a=[];for(const{station:i,line:s}of ve(e))for(const r of Wt(i,s))t.has(r.id)||(t.add(r.id),a.push(r));return a}function Gt(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${c("alertsWord",e.length)}</span>
    </button>
  `:""}function fe(e){return new Promise(t=>window.setTimeout(t,e))}function rn(){const e=Math.max(0,n.obaRateLimitStreak-1),t=Math.min(at,Ca*2**e),a=Math.round(t*(.15+Math.random()*.2));return Math.min(at,t+a)}async function on(){const e=n.obaCooldownUntil-Date.now();e>0&&await fe(e)}function ln(e){return e?.code===429||/rate limit/i.test(e?.text??"")}async function jt(e,t){for(let a=0;a<=tt;a+=1){await on();const i=await fetch(e,{cache:"no-store"});let s=null;try{s=await i.json()}catch{s=null}const r=i.status===429||ln(s);if(i.ok&&!r)return n.obaRateLimitStreak=0,n.obaCooldownUntil=0,s;if(a===tt||!r)throw s?.text?new Error(s.text):new Error(`${t} request failed with ${i.status}`);n.obaRateLimitStreak+=1;const o=Ta*2**a,l=Math.max(o,rn());n.obaCooldownUntil=Date.now()+l,await fe(l)}throw new Error(`${t} request failed`)}function cn(e){const t=[...e.stops].sort((p,g)=>g.sequence-p.sequence),a=48,i=44,s=28,r=88,o=122,l=i+s+(t.length-1)*a,d=new Map,m=t.map((p,g)=>{const v={...p,label:ue(p.name),y:i+g*a,index:g,isTerminal:g===0||g===t.length-1};d.set(p.id,g),d.set(`${e.agencyId}_${p.id}`,g);for(const f of e.stationAliases?.[p.id]??[])d.set(f,g),d.set(`${e.agencyId}_${f}`,g);return v});let u=0;for(let p=0;p<m.length;p+=1)m[p].cumulativeMinutes=u,u+=p<m.length-1?m[p].segmentMinutes:0;return{totalMinutes:u,height:l,labelX:o,stationGap:a,stationIndexByStopId:d,stations:m,trackX:r}}function dn(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function un(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase();t.closestStopTimeOffset;const i=t.nextStopTimeOffset??0,s=t.scheduleDeviation??0,r=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||r&&Math.abs(i)<=90?"ARR":s>=120?"DELAY":"OK"}function pn(e,t){if(!t)return{text:c("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:c("onTime"),colorClass:"status-ontime"};if(e>60){const a=Math.round(e/60);let i="status-late-minor";return e>600?i="status-late-severe":e>300&&(i="status-late-moderate"),{text:n.language==="zh-CN"?`晚点 ${a} 分钟`:`+${a} min late`,colorClass:i}}if(e<-60){const a=Math.round(Math.abs(e)/60);return{text:n.language==="zh-CN"?`早到 ${a} 分钟`:`${a} min early`,colorClass:"status-early"}}return{text:c("unknown"),colorClass:"status-muted"}}function mn(e){switch(e){case"ARR":return c("arrivingStatus");case"DELAY":return c("delayedStatus");case"OK":return c("enRoute");default:return""}}function $(e){if(!n.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(n.fetchedAt).getTime())/1e3));return e-t}function W(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function Ue(e){const t=$(e.nextOffset??0),a=$(e.closestOffset??0),i=e.delayInfo.text;return t<=15?[{text:c("arrivingNow"),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:c("arrivingIn",I(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:c("nextStopIn",I(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:[{text:mn(e.serviceStatus),toneClass:W(e,t)},{text:i,toneClass:e.delayInfo.colorClass}]}function F(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function Kt(e){const t=$(e.nextOffset??0),a=$(e.closestOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel,[s,r]=Ue(e);return t<=15?`${e.label} at ${i} ${F([s,r])}`:t<=90?`${e.label} at ${i} ${F([s,r])}`:a<0&&t>0?`${e.label} ${i} ${F([s,r])}`:`${e.label} to ${i} ${F([s,r])}`}function Re(e){return F(Ue(e))}function Yt(e,t){if(!t.length)return"";const a=[...t].sort((s,r)=>$(s.nextOffset??0)-$(r.nextOffset??0)).slice(0,8),i=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${i.map(s=>`
          <span
            class="line-marquee-item ${W(s,$(s.nextOffset??0))}"
            data-vehicle-marquee="${s.id}"
          >
            <span class="line-marquee-token">${s.lineToken}</span>
            <span class="line-marquee-copy">${Kt(s)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function gn(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const i=a.dataset.vehicleStatus,s=me().find(o=>o.id===i);if(!s)return;const r=$(s.nextOffset??0);a.innerHTML=Re(s),a.className=`train-list-status ${W(s,r)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const i=a.dataset.vehicleMarquee,s=me().find(l=>l.id===i);if(!s)return;const r=$(s.nextOffset??0);a.className=`line-marquee-item ${W(s,r)}`;const o=a.querySelector(".line-marquee-copy");o&&(o.innerHTML=Kt(s))})}function hn(e,t,a,i){const s=e.tripStatus?.activeTripId??e.tripId??"",r=i.get(s);if(!r||r.routeId!==t.routeKey)return null;const o=e.tripStatus?.closestStop,l=e.tripStatus?.nextStop,d=a.stationIndexByStopId.get(o),m=a.stationIndexByStopId.get(l);if(d==null&&m==null)return null;let u=d??m,p=m??d;if(u>p){const Se=u;u=p,p=Se}const g=a.stations[u],v=a.stations[p],f=e.tripStatus?.closestStopTimeOffset??0,x=e.tripStatus?.nextStopTimeOffset??0,te=r.directionId==="1"?"▲":r.directionId==="0"?"▼":dn(d,m);let R=0;u!==p&&f<0&&x>0&&(R=H(Math.abs(f)/(Math.abs(f)+x),0,1));const z=g.y+(v.y-g.y)*R,y=u!==p?g.segmentMinutes:0,h=g.cumulativeMinutes+y*R,w=d??m??u,O=a.stations[w]??g,P=te==="▲",B=H(w+(P?1:-1),0,a.stations.length-1),ae=d!=null&&m!=null&&d!==m?m:H(w+(P?-1:1),0,a.stations.length-1),ne=a.stations[B]??O,$e=a.stations[ae]??v,ie=e.tripStatus?.scheduleDeviation??0,se=e.tripStatus?.predicted??!1,be=pn(ie,se);return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:te,fromLabel:g.label,minutePosition:h,progress:R,serviceStatus:un(e),toLabel:v.label,y:z,currentLabel:g.label,nextLabel:v.label,previousLabel:ne.label,currentStopLabel:O.label,upcomingLabel:$e.label,currentIndex:w,upcomingStopIndex:ae,status:e.tripStatus?.status??"",closestStop:o,nextStop:l,closestOffset:f,nextOffset:x,scheduleDeviation:ie,isPredicted:se,delayInfo:be,rawVehicle:e}}function fn(e){return e.fromLabel===e.toLabel||e.progress===0?n.language==="zh-CN"?`位于 ${e.fromLabel}`:`At ${e.fromLabel}`:`${e.fromLabel} -> ${e.toLabel}`}function vn(e){return e.fromLabel===e.toLabel||e.progress===0?n.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:n.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function yn(e){const t=n.layouts.get(e.lineId),a=Math.max(0,ua(e,t).at(-1)?.etaSeconds??e.nextOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${n.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${i}</p>
        <p class="train-focus-metric-copy">${I($(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${n.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${Y(e,t)}</p>
        <p class="train-focus-metric-copy">${I($(a))}</p>
      </div>
    </div>
  `}function me(){return n.lines.flatMap(e=>(n.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function $n(){return Object.values(de).filter(e=>n.systemsById.has(e.id)).map(e=>`
        <button
          class="tab-button ${e.id===n.activeSystemId?"is-active":""}"
          data-system-switch="${e.id}"
          type="button"
        >
          ${e.label}
        </button>
      `).join("")}function Te(){return!n.compactLayout||n.lines.length<2?"":`<section class="line-switcher">${n.lines.map(t=>`
        <button
          class="line-switcher-button ${t.id===n.activeLineId?"is-active":""}"
          data-line-switch="${t.id}"
          type="button"
          style="--line-color:${t.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <span>${t.name}</span>
        </button>
      `).join("")}</section>`}function Xt(){return n.compactLayout?n.lines.filter(e=>e.id===n.activeLineId):n.lines}function ge(e,t){const a=[...e].sort((r,o)=>r.minutePosition-o.minutePosition),i=[...t].sort((r,o)=>r.minutePosition-o.minutePosition),s=r=>r.slice(1).map((o,l)=>Math.round(o.minutePosition-r[l].minutePosition));return{nbGaps:s(a),sbGaps:s(i)}}function bn(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((s,r)=>s+r,0)/e.length,a=Math.max(...e),i=Math.min(...e);return{avg:Math.round(t),max:a,min:i,spread:a-i,ratio:a/Math.max(i,1)}}function he(e,t){const a=bn(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let i="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?i="bunched":a.max>=12||a.spread>=6?i="uneven":a.avg>=18&&(i="sparse"),{health:i,stats:a}}function Sn(e,t){if(!e.length||t<2)return{averageText:"—",detailText:n.language==="zh-CN"?`${S()}数量不足，无法判断间隔`:`Too few ${S().toLowerCase()} for a spacing read`};const a=Math.round(e.reduce((r,o)=>r+o,0)/e.length),i=Math.min(...e),s=Math.max(...e);return{averageText:`~${a} min`,detailText:n.language==="zh-CN"?`观测间隔 ${i}-${s} 分钟`:`${i}-${s} min observed gap`}}function mt(e,t,a){const{averageText:i,detailText:s}=Sn(t,a);return`
    <div class="headway-health-card">
      <p class="headway-health-label">${e}</p>
      <p class="headway-health-value">${i}</p>
      <p class="headway-health-copy">${s}</p>
    </div>
  `}function ze(e){return e.reduce((t,a)=>{const i=Number(a.scheduleDeviation??0);return i<=60?t.onTime+=1:i<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function Zt(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function wn(e,t){return Math.abs(e.length-t.length)<=1?{label:n.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:e.length>t.length?{label:n.language==="zh-CN"?"北向偏多":"Northbound heavier",tone:"warn"}:{label:n.language==="zh-CN"?"南向偏多":"Southbound heavier",tone:"warn"}}function Ln(e,t){return`
    <div class="delay-distribution">
      ${[[n.language==="zh-CN"?"准点":"On time",e.onTime,"healthy"],[n.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",e.minorLate,"warn"],[n.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",e.severeLate,"alert"]].map(([i,s,r])=>`
        <div class="delay-chip delay-chip-${r}">
          <p class="delay-chip-label">${i}</p>
          <p class="delay-chip-value">${s}</p>
          <p class="delay-chip-copy">${Zt(s,t)}</p>
        </div>
      `).join("")}
    </div>
  `}function gt(e,t,a,i){if(!t.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${e}</p>
          <p class="flow-lane-copy">${c("noLiveVehicles",S().toLowerCase())}</p>
        </div>
      </div>
    `;const s=[...t].sort((o,l)=>o.minutePosition-l.minutePosition),r=s.map(o=>{const l=a.totalMinutes>0?o.minutePosition/a.totalMinutes:0;return Math.max(0,Math.min(100,l*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${e}</p>
        <p class="flow-lane-copy">${c("liveCount",s.length,s.length===1?L().toLowerCase():S().toLowerCase())}</p>
      </div>
      <div class="flow-track" style="--line-color:${i};">
        ${r.map((o,l)=>`
          <span
            class="flow-vehicle"
            style="left:${o}%; --line-color:${i};"
            title="${s[l].label} · ${fn(s[l])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function Qt(e,t,a,i){const s=[],r=n.layouts.get(e.id),o=D("▲",r,{includeSymbol:!0}),l=D("▼",r,{includeSymbol:!0}),{stats:d}=he(ge(t,[]).nbGaps,t.length),{stats:m}=he(ge([],a).sbGaps,a.length),u=[...t,...a].filter(g=>Number(g.scheduleDeviation??0)>300),p=Math.abs(t.length-a.length);return d.max!=null&&d.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`${o} 当前有 ${d.max} 分钟的服务空档。`:`${o} has a ${d.max} min service hole right now.`}),m.max!=null&&m.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`${l} 当前有 ${m.max} 分钟的服务空档。`:`${l} has a ${m.max} min service hole right now.`}),p>=2&&s.push({tone:"warn",copy:t.length>a.length?n.language==="zh-CN"?`车辆分布向 ${o} 偏多 ${p} 辆。`:`Vehicle distribution is tilted toward ${o} by ${p}.`:n.language==="zh-CN"?`车辆分布向 ${l} 偏多 ${p} 辆。`:`Vehicle distribution is tilted toward ${l} by ${p}.`}),u.length&&s.push({tone:"warn",copy:n.language==="zh-CN"?`${u.length} 辆${u.length===1?L().toLowerCase():S().toLowerCase()}晚点超过 5 分钟。`:`${u.length} ${u.length===1?L().toLowerCase():S().toLowerCase()} are running 5+ min late.`}),i.length&&s.push({tone:"info",copy:n.language==="zh-CN"?`${e.name} 当前受 ${i.length} 条告警影响。`:`${i.length} active alert${i.length===1?"":"s"} affecting ${e.name}.`}),s.length||s.push({tone:"healthy",copy:n.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),s.slice(0,4)}function Oe(e){return e.map(t=>{const a=n.layouts.get(t.id),i=n.vehiclesByLine.get(t.id)??[],s=i.filter(l=>l.directionSymbol==="▲"),r=i.filter(l=>l.directionSymbol==="▼"),o=ee(t.id);return{line:t,layout:a,vehicles:i,nb:s,sb:r,lineAlerts:o,exceptions:Qt(t,s,r,o)}})}function Tn({worstGap:e,severeLateCount:t,alertCount:a,balanceDelta:i}){const s=[];return e>=12&&s.push({key:"gap",tone:"alert",label:n.language==="zh-CN"?"大间隔":"Large gap"}),t>0&&s.push({key:"late",tone:"warn",label:n.language==="zh-CN"?"严重晚点":"Severe late"}),a>0&&s.push({key:"alert",tone:"info",label:n.language==="zh-CN"?"有告警":"Alerted"}),i>=2&&s.push({key:"balance",tone:"warn",label:n.language==="zh-CN"?"方向失衡":"Imbalanced"}),s.length||s.push({key:"healthy",tone:"healthy",label:n.language==="zh-CN"?"健康":"Healthy"}),s}function ht(e){return`
    <div class="attention-reason-badges">
      ${e.map(t=>`
        <span class="attention-reason-badge attention-reason-badge-${t.tone}">${t.label}</span>
      `).join("")}
    </div>
  `}function Jt(e){const t=e.length,a=e.reduce((h,w)=>h+w.vehicles.length,0),i=e.reduce((h,w)=>h+w.lineAlerts.length,0),s=e.filter(h=>h.lineAlerts.length>0).length,r=new Set(e.flatMap(h=>h.lineAlerts.flatMap(w=>w.stopIds??[]))).size,o=e.flatMap(h=>h.vehicles),l=ze(o),d=e.map(h=>{const{nbGaps:w,sbGaps:O}=ge(h.nb,h.sb),P=[...w,...O].length?Math.max(...w,...O):0,B=h.vehicles.filter(N=>Number(N.scheduleDeviation??0)>300).length,ae=ze(h.vehicles),ne=Math.abs(h.nb.length-h.sb.length),$e=he(w,h.nb.length).health,ie=he(O,h.sb.length).health,se=[$e,ie].some(N=>N==="uneven"||N==="bunched"||N==="sparse"),be=B>0,Se=h.lineAlerts.length*5+B*3+Math.max(0,P-10),va=Tn({worstGap:P,severeLateCount:B,alertCount:h.lineAlerts.length,balanceDelta:ne});return{line:h.line,score:Se,worstGap:P,severeLateCount:B,alertCount:h.lineAlerts.length,impactedStopCount:new Set(h.lineAlerts.flatMap(N=>N.stopIds??[])).size,balanceDelta:ne,hasSevereLate:be,isUneven:se,attentionReasons:va,delayBuckets:ae}}).sort((h,w)=>w.score-h.score||w.worstGap-h.worstGap),m=new Set(d.filter(h=>h.hasSevereLate).map(h=>h.line.id)),u=new Set(d.filter(h=>h.isUneven).map(h=>h.line.id)),p=d.filter(h=>h.hasSevereLate&&!h.isUneven).length,g=d.filter(h=>h.isUneven&&!h.hasSevereLate).length,v=d.filter(h=>h.hasSevereLate&&h.isUneven).length,f=new Set([...m,...u]).size,x=Math.max(0,t-f),te=a?Math.round(l.onTime/a*100):null,R=d.filter(h=>h.score>0).slice(0,2);let z={tone:"healthy",copy:n.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const y=d[0]??null;return y?.alertCount?z={tone:"info",copy:n.language==="zh-CN"?`${y.line.name} 当前有 ${y.alertCount} 条生效告警。`:`${y.line.name} has ${y.alertCount} active alert${y.alertCount===1?"":"s"}.`}:y?.worstGap>=12?z={tone:"alert",copy:n.language==="zh-CN"?`当前最大实时间隔为空 ${y.line.name} 的 ${y.worstGap} 分钟。`:`Largest live gap: ${y.worstGap} min on ${y.line.name}.`}:y?.severeLateCount&&(z={tone:"warn",copy:n.language==="zh-CN"?`${y.line.name} 有 ${y.severeLateCount} 辆${y.severeLateCount===1?L().toLowerCase():S().toLowerCase()}晚点超过 5 分钟。`:`${y.line.name} has ${y.severeLateCount} ${y.severeLateCount===1?L().toLowerCase():S().toLowerCase()} running 5+ min late.`}),{totalLines:t,totalVehicles:a,totalAlerts:i,impactedLines:s,impactedStopCount:r,delayedLineIds:m,unevenLineIds:u,lateOnlyLineCount:p,unevenOnlyLineCount:g,mixedIssueLineCount:v,attentionLineCount:f,healthyLineCount:x,onTimeRate:te,rankedLines:d,priorityLines:R,topIssue:z}}function ft(e,t,{suffix:a="",invert:i=!1}={}){if(e==null||t==null||e===t)return n.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const s=e-t,r=i?s<0:s>0,o=s>0?"↑":"↓";return n.language==="zh-CN"?`${r?"改善":"变差"} ${o} ${Math.abs(s)}${a}`:`${r?"Improving":"Worse"} ${o} ${Math.abs(s)}${a}`}function Cn(e){const t=Jt(e),a=n.systemSnapshots.get(n.activeSystemId)?.previous??null,i=[];t.totalAlerts>0&&i.push({tone:"info",copy:n.language==="zh-CN"?`${t.impactedLines} 条线路共受 ${t.totalAlerts} 条告警影响。`:`${t.totalAlerts} active alert${t.totalAlerts===1?"":"s"} across ${t.impactedLines} line${t.impactedLines===1?"":"s"}.`}),t.delayedLineIds.size>0&&i.push({tone:"warn",copy:n.language==="zh-CN"?`${t.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${t.delayedLineIds.size} line${t.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),t.unevenLineIds.size>0&&i.push({tone:"alert",copy:n.language==="zh-CN"?`${t.unevenLineIds.size} 条线路当前发车间隔不均。`:`${t.unevenLineIds.size} line${t.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),i.length||i.push({tone:"healthy",copy:n.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const s=[{label:n.language==="zh-CN"?"准点率":"On-Time Rate",value:t.onTimeRate!=null?`${t.onTimeRate}%`:"—",delta:ft(t.onTimeRate,a?.onTimeRate,{suffix:"%"})},{label:n.language==="zh-CN"?"需关注线路":"Attention Lines",value:t.attentionLineCount,delta:ft(t.attentionLineCount,a?.attentionLineCount,{invert:!0})}];return`
    <article class="panel-card panel-card-wide system-summary-card">
      <header class="panel-header">
        <div class="system-summary-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:var(--accent-strong);">${U().label[0]}</span>
            <div class="line-title-copy">
              <h2>${U().label} ${n.language==="zh-CN"?"概览":"Summary"}</h2>
              <p>${n.language==="zh-CN"?`系统内 ${t.totalLines} 条线路 · 更新于 ${ke()}`:`${t.totalLines} line${t.totalLines===1?"":"s"} in system · Updated ${ke()}`}</p>
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
          <p class="metric-chip-label">${n.language==="zh-CN"?`实时${S()}`:`Live ${S()}`}</p>
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
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"影响站点":"Impacted Stops"}</p>
          <p class="metric-chip-value">${t.impactedStopCount}</p>
        </div>
      </div>
      <div class="system-composition">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${n.language==="zh-CN"?"需关注线路构成":"Attention Breakdown"}</p>
          <p class="headway-chart-copy">${n.language==="zh-CN"?"按晚点与间隔异常拆解":"Split by lateness and spacing issues"}</p>
        </div>
        <div class="attention-breakdown-grid">
          <div class="metric-chip">
            <p class="metric-chip-label">${n.language==="zh-CN"?"仅晚点":"Late Only"}</p>
            <p class="metric-chip-value">${t.lateOnlyLineCount}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${n.language==="zh-CN"?"仅间隔不均":"Spacing Only"}</p>
            <p class="metric-chip-value">${t.unevenOnlyLineCount}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${n.language==="zh-CN"?"两者都有":"Both"}</p>
            <p class="metric-chip-value">${t.mixedIssueLineCount}</p>
          </div>
        </div>
      </div>
      <div class="system-priority">
        <div class="insight-exceptions-header">
          ${n.language==="zh-CN"?"":'<p class="headway-chart-title">Recommended Next</p>'}
          <p class="headway-chart-copy">${n.language==="zh-CN"?"基于当前快照的综合优先级":"Best next checks from the current snapshot"}</p>
        </div>
        <div class="system-priority-list">
          ${(t.priorityLines.length?t.priorityLines:t.rankedLines.slice(0,1)).map(({line:r,worstGap:o,severeLateCount:l,alertCount:d,attentionReasons:m})=>`
            <div class="system-priority-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${r.color};">${r.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${r.name}</p>
                  <p class="headway-chart-copy">${n.language==="zh-CN"?`${o?`最大间隔 ${o} 分钟`:"当前无明显间隔问题"}${l?` · ${l} 辆严重晚点`:""}${d?` · ${d} 条告警`:""}`:`${o?`Gap ${o} min`:"No major spacing issue"}${l?` · ${l} severe late`:""}${d?` · ${d} alert${d===1?"":"s"}`:""}`}</p>
                  ${ht(m)}
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="system-ranking">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${n.language==="zh-CN"?"关注排名":"Attention Ranking"}</p>
          <p class="headway-chart-copy">${n.error?n.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":n.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p>
        </div>
        <div class="system-ranking-list">
          ${t.rankedLines.slice(0,3).map(({line:r,score:o,worstGap:l,alertCount:d,severeLateCount:m,attentionReasons:u})=>`
            <div class="system-ranking-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${r.color};">${r.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${r.name}</p>
                  <p class="headway-chart-copy">${n.language==="zh-CN"?`评分 ${o}${l?` · 最大间隔 ${l} 分钟`:""}${d?` · ${d} 条告警`:""}${m?` · ${m} 辆严重晚点`:""}`:`Score ${o}${l?` · gap ${l} min`:""}${d?` · ${d} alert${d===1?"":"s"}`:""}${m?` · ${m} severe late`:""}`}</p>
                  ${ht(u)}
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
  `}function In(e){const t=e.flatMap(o=>o.exceptions.map(l=>({tone:l.tone,copy:`${o.line.name}: ${l.copy}`,lineColor:o.line.color})));if(!t.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${n.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">${n.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span>
        </div>
      </section>
    `;const a=xn(),i=Math.ceil(t.length/a),s=n.insightsTickerIndex%i,r=t.slice(s*a,s*a+a);return`
    <section class="insights-ticker" aria-label="${n.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}">
      <div class="insights-ticker-viewport">
        ${r.map(o=>`
              <span class="insights-ticker-item insights-ticker-item-${o.tone} insights-ticker-item-animated">
                <span class="insights-ticker-dot" style="--line-color:${o.lineColor};"></span>
                <span class="insights-ticker-copy">${o.copy}</span>
              </span>
            `).join("")}
      </div>
    </section>
  `}function xn(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);return i>=1680?3:i>=980?2:1}function An(e,t,a,i,s){const r=a.length+i.length;if(!r)return"";const{nbGaps:o,sbGaps:l}=ge(a,i),d=ze([...a,...i]),m=[...o,...l].length?Math.max(...o,...l):null,u=wn(a,i),p=Qt(e,a,i,s),g=new Set(s.flatMap(v=>v.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"运营中":"In Service"}</p>
          <p class="metric-chip-value">${r}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"准点率":"On-Time Rate"}</p>
          <p class="metric-chip-value">${Zt(d.onTime,r)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"最大间隔":"Worst Gap"}</p>
          <p class="metric-chip-value">${m!=null?`${m} min`:"—"}</p>
        </div>
        <div class="metric-chip metric-chip-${u.tone}">
          <p class="metric-chip-label">${n.language==="zh-CN"?"方向平衡":"Balance"}</p>
          <p class="metric-chip-value">${u.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${mt(D("▲",t,{includeSymbol:!0}),o,a.length)}
        ${mt(D("▼",t,{includeSymbol:!0}),l,i.length)}
      </div>
      ${Ln(d,r)}
      <div class="flow-grid">
        ${gt(n.language==="zh-CN"?`${D("▲",t,{includeSymbol:!0})} 流向`:`${D("▲",t,{includeSymbol:!0})} flow`,a,t,e.color)}
        ${gt(n.language==="zh-CN"?`${D("▼",t,{includeSymbol:!0})} 流向`:`${D("▼",t,{includeSymbol:!0})} flow`,i,t,e.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${n.language==="zh-CN"?"当前":"Now"}</p>
          <p class="headway-chart-copy">${s.length?n.language==="zh-CN"?`${s.length} 条生效告警${g?` · 影响 ${g} 个站点`:""}`:`${s.length} active alert${s.length===1?"":"s"}${g?` · ${g} impacted stops`:""}`:n.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p>
        </div>
        ${p.map(v=>`
          <div class="insight-exception insight-exception-${v.tone}">
            <p>${v.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function ea(e,t=!1){const a=Date.now(),i=o=>{const l=o.arrivalTime,d=Math.floor((l-a)/1e3),m=I(d),u=ra(o.arrivalTime,o.scheduleDeviation??0),p=Ye(u);let g="";if(o.distanceFromStop>0){const v=o.distanceFromStop>=1e3?`${(o.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(o.distanceFromStop)}m`,f=c("stopAway",o.numberOfStopsAway);g=` • ${v} • ${f}`}return`
      <div class="arrival-item" data-arrival-time="${o.arrivalTime}" data-schedule-deviation="${o.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${o.lineColor};">${o.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${o.lineName} ${L()} ${o.vehicleId}</span>
            <span class="arrival-destination">${c("toDestination",o.destination)}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${p}">${u}</span>
          <span class="arrival-time"><span class="arrival-countdown">${m}</span><span class="arrival-precision">${g}</span></span>
        </span>
      </div>
    `};if(t){ot.innerHTML="",lt.innerHTML="",Z.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,Q.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,Pe();return}const s=o=>{const l=[...new Set(o.map(m=>m.destination).filter(Boolean))];if(!l.length)return"";const d=l.slice(0,2);return l.length>2&&d.push(n.language==="zh-CN"?"等":"etc."),d.join(" / ")},r=(o,l,d)=>{if(!o.length){l.innerHTML="",d.innerHTML=`<div class="arrival-item muted">${c("noUpcomingVehicles",S().toLowerCase())}</div>`;return}const m=n.dialogDisplayMode?o.slice(0,2):[],u=n.dialogDisplayMode?o.slice(2):o;l.innerHTML=m.map(i).join(""),d.innerHTML=u.length?u.map(i).join(""):n.dialogDisplayMode?`<div class="arrival-item muted">${c("noAdditionalVehicles",S().toLowerCase())}</div>`:""};r(e.nb,ot,Z),r(e.sb,lt,Q),Dt.textContent=V("▲",s(e.nb),{includeSymbol:!0}),Mt.textContent=V("▼",s(e.sb),{includeSymbol:!0}),Pe()}function J(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const i=new Set;for(const r of a){const o=r.startsWith(`${t.agencyId}_`)?r:`${t.agencyId}_${r}`;i.add(o)}const s=e.id.replace(/-T\d+$/,"");return i.add(s.startsWith(`${t.agencyId}_`)?s:`${t.agencyId}_${s}`),[...i]}function ve(e){const t=n.lines.map(a=>{const i=a.stops.find(s=>s.id===e.id);return i?{line:a,station:i}:null}).filter(Boolean);return t.length>0?t:n.lines.map(a=>{const i=a.stops.find(s=>s.name===e.name);return i?{line:a,station:i}:null}).filter(Boolean)}function Dn(e){if(!e)return null;const t=e.trim().toLowerCase();for(const a of n.lines)for(const i of a.stops){const s=new Set([i.id,`${a.agencyId}_${i.id}`,i.name,ue(i.name),le(i.name),le(ue(i.name))]);for(const r of a.stationAliases?.[i.id]??[])s.add(r),s.add(`${a.agencyId}_${r}`),s.add(le(r));if([...s].some(r=>String(r).toLowerCase()===t))return i}return null}function Mn(e){const t=new URL(window.location.href);t.searchParams.set("station",le(e.name)),window.history.pushState({},"",t)}function ta(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function vt(e){const t=new URL(window.location.href);e===G?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function aa(){const t=new URL(window.location.href).searchParams.get("system");return t&&n.systemsById.has(t)?t:G}function Ve(e){n.dialogDisplayMode=e,b.classList.toggle("is-display-mode",e),X.textContent=c(e?"exit":"board"),X.setAttribute("aria-label",c(e?"exit":"board")),n.dialogDisplayDirection="both",n.dialogDisplayAutoPhase="nb",Ge(),b.open&&n.currentDialogStation&&Xe(n.currentDialogStation).catch(console.error),ye(),Pe()}function Nn(){Ve(!n.dialogDisplayMode)}function We(){n.dialogDisplayDirectionTimer&&(window.clearInterval(n.dialogDisplayDirectionTimer),n.dialogDisplayDirectionTimer=0)}function na(){n.dialogDisplayDirectionAnimationTimer&&(window.clearTimeout(n.dialogDisplayDirectionAnimationTimer),n.dialogDisplayDirectionAnimationTimer=0),n.dialogDisplayAnimatingDirection="",Nt?.classList.remove("is-direction-animating"),kt?.classList.remove("is-direction-animating")}function kn(e){if(!n.dialogDisplayMode||!e||e==="both")return;na(),n.dialogDisplayAnimatingDirection=e;const t=e==="nb"?Nt:kt;t&&(t.offsetWidth,t.classList.add("is-direction-animating"),n.dialogDisplayDirectionAnimationTimer=window.setTimeout(()=>{t.classList.remove("is-direction-animating"),n.dialogDisplayDirectionAnimationTimer=0,n.dialogDisplayAnimatingDirection===e&&(n.dialogDisplayAnimatingDirection="")},Na))}function Ge({animate:e=!1}={}){We(),na();const t=n.dialogDisplayDirection,a=t==="auto"?n.dialogDisplayAutoPhase:t;At.forEach(i=>{i.classList.toggle("is-active",i.dataset.dialogDirection===t)}),b.classList.toggle("show-nb-only",n.dialogDisplayMode&&a==="nb"),b.classList.toggle("show-sb-only",n.dialogDisplayMode&&a==="sb"),e&&kn(a),n.dialogDisplayMode&&t==="auto"&&(n.dialogDisplayDirectionTimer=window.setInterval(()=>{n.dialogDisplayAutoPhase=n.dialogDisplayAutoPhase==="nb"?"sb":"nb",Ge({animate:!0})},Ma))}function je(){n.dialogRefreshTimer&&(window.clearTimeout(n.dialogRefreshTimer),n.dialogRefreshTimer=0)}function Ke(){n.dialogDisplayTimer&&(window.clearInterval(n.dialogDisplayTimer),n.dialogDisplayTimer=0)}function Ce(e,t){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(e.style.transform="translateY(0)",!n.dialogDisplayMode||a.length<=3)return;const i=Number.parseFloat(window.getComputedStyle(e).rowGap||"0")||0,s=a[0].getBoundingClientRect().height+i,r=Math.max(0,a.length-3),o=Math.min(n.dialogDisplayIndexes[t],r);e.style.transform=`translateY(-${o*s}px)`}function Pe(){Ke(),n.dialogDisplayIndexes={nb:0,sb:0},Ce(Z,"nb"),Ce(Q,"sb"),n.dialogDisplayMode&&(n.dialogDisplayTimer=window.setInterval(()=>{for(const[e,t]of[["nb",Z],["sb",Q]]){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const i=Math.max(0,a.length-3);n.dialogDisplayIndexes[e]=n.dialogDisplayIndexes[e]>=i?0:n.dialogDisplayIndexes[e]+1,Ce(t,e)}},Da))}function En(){if(!b.open)return;b.querySelectorAll(".arrival-item[data-arrival-time]").forEach(t=>{const a=Number(t.dataset.arrivalTime),i=Number(t.dataset.scheduleDeviation||0),s=t.querySelector(".arrival-countdown"),r=t.querySelector(".arrival-status");if(!s||!r)return;s.textContent=I(Math.floor((a-Date.now())/1e3));const o=ra(a,i),l=Ye(o);r.textContent=o,r.className=`arrival-status arrival-status-${l}`})}function Rn(){if(je(),!n.currentDialogStation)return;const e=()=>{n.dialogRefreshTimer=window.setTimeout(async()=>{!b.open||!n.currentDialogStation||(await Xe(n.currentDialogStation).catch(console.error),e())},Aa)};e()}function ia(){n.currentDialogStationId="",n.currentDialogStation=null,b.open?b.close():(je(),Ke(),We(),Ve(!1),ta())}async function yt(){const e=aa();e!==n.activeSystemId&&await fa(e,{updateUrl:!1,preserveDialog:!1});const t=new URL(window.location.href).searchParams.get("station"),a=Dn(t);n.isSyncingFromUrl=!0;try{if(!a){n.currentDialogStationId="",b.open&&b.close();return}if(n.activeTab="map",C(),n.currentDialogStationId===a.id&&b.open)return;await ca(a,!1)}finally{n.isSyncingFromUrl=!1}}function zn(e,t){const a=t.directionLookup?.[e.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const i=e.tripHeadsign??"",s=i.toLowerCase();return t.nbTerminusPrefix&&s.startsWith(t.nbTerminusPrefix)?"nb":t.sbTerminusPrefix&&s.startsWith(t.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(i)?"nb":/Federal Way|South Bellevue/i.test(i)?"sb":""}function sa(e){return e.routeKey??`${e.agencyId}_${e.id}`}function On(e){const t=e.tripHeadsign?.trim();return t?ue(t.replace(/^to\s+/i,"")):c("terminalFallback")}function ra(e,t){return Math.floor((e-Date.now())/1e3)<=90?"ARR":t>=120?"DELAY":n.language==="zh-CN"?"准点":"ON TIME"}function Ye(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}async function Pn(e){const t=`${St}/arrivals-and-departures-for-stop/${e}.json?key=${_e}&minutesAfter=120`,a=await jt(t,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${e}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function Be(e){const t=[...new Set(e)],a=[],i=[];for(let s=0;s<t.length;s+=we){const r=t.slice(s,s+we),o=await Promise.allSettled(r.map(l=>Pn(l)));a.push(...o),nt>0&&s+we<t.length&&await fe(nt)}for(const s of a)s.status==="fulfilled"&&i.push(...s.value);return i}function oa(e,t,a=null){const i=Date.now(),s=new Set,r={nb:[],sb:[]},o=a?new Set(a):null;for(const l of e){if(l.routeId!==sa(t)||o&&!o.has(l.stopId))continue;const d=l.predictedArrivalTime||l.scheduledArrivalTime;if(!d||d<=i)continue;const m=zn(l,t);if(!m)continue;const u=`${l.tripId}:${l.stopId}:${d}`;s.has(u)||(s.add(u),r[m].push({vehicleId:(l.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:d,destination:On(l),scheduleDeviation:l.scheduleDeviation??0,tripId:l.tripId,lineColor:t.color,lineName:t.name,lineToken:t.name[0],distanceFromStop:l.distanceFromStop??0,numberOfStopsAway:l.numberOfStopsAway??0}))}return r.nb.sort((l,d)=>l.arrivalTime-d.arrivalTime),r.sb.sort((l,d)=>l.arrivalTime-d.arrivalTime),r.nb=r.nb.slice(0,4),r.sb=r.sb.slice(0,4),r}async function Bn(e,t,a=null){const i=`${n.activeSystemId}:${t.id}:${e.id}`,s=n.arrivalsCache.get(i);if(s&&Date.now()-s.fetchedAt<La)return s.value;const r=J(e,t),o=a??await Be(r),l=oa(o,t,r);return n.arrivalsCache.set(i,{fetchedAt:Date.now(),value:l}),l}function qn(e){const t={nb:[],sb:[]};for(const a of e)t.nb.push(...a.nb),t.sb.push(...a.sb);return t.nb.sort((a,i)=>a.arrivalTime-i.arrivalTime),t.sb.sort((a,i)=>a.arrivalTime-i.arrivalTime),t}function la(e){const t=sn(e);if(!t.length){j.innerHTML="",j.hidden=!0;return}j.hidden=!1,j.innerHTML=`
    <div class="station-alerts">
      ${t.map((a,i)=>`
        <button class="station-alert-pill" data-alert-idx="${i}" type="button">
          <span class="station-alert-pill-meta">${Vt(a.severity)} · ${Ut(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||c("serviceAlert")}</span>
        </button>
      `).join("")}
    </div>
  `,j.querySelectorAll(".station-alert-pill").forEach(a=>{const i=t[Number(a.dataset.alertIdx)];i&&a.addEventListener("click",()=>{const s=n.lines.find(r=>i.lineIds.includes(r.id));s&&ma(s)})})}async function ca(e,t=!0){pa(e.name),en(e),n.currentDialogStationId=e.id,n.currentDialogStation=e,la(e),K([],!0),ea({nb:[],sb:[]},!0),t&&Mn(e),b.showModal(),ye(),Rn(),await Xe(e)}async function Xe(e){const t=n.activeDialogRequest+1;n.activeDialogRequest=t;const a=()=>n.activeDialogRequest!==t||!b.open;try{const i=ve(e),s=i.flatMap(({station:l,line:d})=>J(l,d)),r=await Be(s),o=await Promise.all(i.map(({station:l,line:d})=>Bn(l,d,r)));if(a())return;la(e),ea(qn(o))}catch(i){if(a())return;K([],!1,e),Z.innerHTML=`<div class="arrival-item muted">${i.message}</div>`,Q.innerHTML=`<div class="arrival-item muted">${n.language==="zh-CN"?"请稍后重试":"Retry in a moment"}</div>`;return}try{const i=Yn(e);if(!i.length){if(a())return;K([],!1,e);return}if(await fe(Ea),a())return;const s=i.flatMap(({stop:o,line:l})=>J(o,l)),r=await Be(s);if(a())return;K(Xn(i,r),!1,e)}catch{if(a())return;K([],!1,e)}}function _n(e){const t=n.layouts.get(e.id),a=n.vehiclesByLine.get(e.id)??[],i=ee(e.id),s=t.stations.map((l,d)=>{const m=t.stations[d-1],u=d>0?m.segmentMinutes:"",g=Wt(l,e).length>0,v=l.isTerminal?15:10;return`
        <g transform="translate(0, ${l.y})" class="station-group${g?" has-alert":""}" data-stop-id="${l.id}" style="cursor: pointer;">
          ${d>0?`<text x="0" y="-14" class="segment-time">${u}</text>
                 <line x1="18" x2="${t.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${t.trackX}" cy="0" r="${l.isTerminal?11:5}" class="${l.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${e.color};"></circle>
          ${l.isTerminal?`<text x="${t.trackX}" y="4" text-anchor="middle" class="terminal-mark">${e.name[0]}</text>`:""}
          ${g?`<circle cx="${t.trackX+v}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${t.labelX}" y="5" class="station-label">${l.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),r=a.map((l,d)=>{const m=Gn(e.id,l.id);return`
        <g transform="translate(${t.trackX}, 0)" class="train" data-train-id="${l.id}">
          ${m.map((u,p)=>`
                <circle
                  cy="${u.y+(d%3-1)*1.5}"
                  r="${Math.max(3,7-p)}"
                  class="train-ghost-dot"
                  style="--line-color:${e.color}; --ghost-opacity:${Math.max(.18,.56-p*.1)};"
                ></circle>
              `).join("")}
          <g transform="translate(0, ${l.y+(d%3-1)*1.5})">
            <circle r="13" class="train-wave" style="--line-color:${e.color}; animation-delay:${d*.18}s;"></circle>
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${l.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${e.color};"></path>
          </g>
        </g>
      `}).join(""),o=L();return`
    <article class="line-card" data-line-id="${e.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <div class="line-title-copy">
            <div class="line-title-row">
              <h2>${e.name}</h2>
              ${Gt(i,e.id)}
            </div>
            <p>${c("liveCount",a.length,a.length===1?o.toLowerCase():S().toLowerCase())}</p>
            <p>${Fe(e)}</p>
          </div>
        </div>
        ${He(e)}
      </header>
      ${Yt(e.color,a.map(l=>({...l,lineToken:e.name[0]})))}
      <svg viewBox="0 0 460 ${t.height}" class="line-diagram" role="img" aria-label="${n.language==="zh-CN"?`${e.name} 实时线路图`:`${e.name} live LED board`}">
        <line x1="${t.trackX}" x2="${t.trackX}" y1="${t.stations[0].y}" y2="${t.stations.at(-1).y}" class="spine" style="--line-color:${e.color};"></line>
        ${s}
        ${r}
      </svg>
    </article>
  `}function Fn(){const e=me().sort((o,l)=>o.minutePosition-l.minutePosition),t=L(),a=S(),i=a.toLowerCase();return e.length?(n.compactLayout?n.lines.filter(o=>o.id===n.activeLineId):n.lines).map(o=>{const l=e.filter(f=>f.lineId===o.id),d=ee(o.id),m=[...l].sort((f,x)=>$(f.nextOffset??0)-$(x.nextOffset??0)),u=m[0]??null,p=m.slice(1),g=f=>`
        <span class="train-direction-badge">
          ${V(f.directionSymbol,Y(f,n.layouts.get(f.lineId)),{includeSymbol:!0})}
        </span>
      `,v=f=>`
        <article class="train-list-item train-queue-item" data-train-id="${f.id}">
          <div class="train-list-main">
            <span class="line-token train-list-token" style="--line-color:${f.lineColor};">${f.lineToken}</span>
            <div>
              <div class="train-list-row">
                <p class="train-list-title">${f.lineName} ${t} ${f.label}</p>
                ${g(f)}
              </div>
              <p class="train-list-subtitle">${c("toDestination",Y(f,n.layouts.get(f.lineId)))}</p>
              <p class="train-list-status ${W(f,$(f.nextOffset??0))}" data-vehicle-status="${f.id}">${Re(f)}</p>
            </div>
          </div>
          <div class="train-queue-side">
            <p class="train-queue-time">${I($(f.nextOffset??0))}</p>
            <p class="train-queue-clock">${qe($(f.nextOffset??0))}</p>
          </div>
        </article>
      `;return`
        <article class="line-card train-line-card">
          <header class="line-card-header train-list-section-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${o.color};">${o.name[0]}</span>
              <div class="line-title-copy">
                <div class="line-title-row">
                  <h2>${o.name}</h2>
                  ${Gt(d,o.id)}
                </div>
                <p>${c("inServiceCount",l.length,l.length===1?t.toLowerCase():S().toLowerCase())} · ${Fe(o)}</p>
              </div>
            </div>
            ${He(o)}
          </header>
          ${Yt(o.color,l)}
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
                        <p class="train-focus-time">${I($(u.nextOffset??0))}</p>
                        <p class="train-focus-clock">${qe($(u.nextOffset??0))}</p>
                      </div>
                    </div>
                    <p class="train-focus-destination">${c("toDestination",Y(u,n.layouts.get(u.lineId)))}</p>
                    <p class="train-focus-segment">${vn(u)}</p>
                    ${yn(u)}
                    <p class="train-list-status ${W(u,$(u.nextOffset??0))}" data-vehicle-status="${u.id}">${Re(u)}</p>
                  </article>
                `:`<p class="train-readout muted">${c("noLiveVehicles",S().toLowerCase())}</p>`}
            ${p.length?`
                  <div class="train-queue-list">
                    <p class="train-queue-heading">${n.language==="zh-CN"?"后续车次":"Following vehicles"}</p>
                    ${p.map(v).join("")}
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
    `}function da(e){return new Date(e).toLocaleTimeString(n.language==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:n.language!=="zh-CN"})}function qe(e){return da(Date.now()+Math.max(0,e)*1e3)}function Y(e,t){if(!t?.stations?.length)return e.upcomingLabel??e.toLabel??e.currentStopLabel??c("terminalFallback");const a=e.directionSymbol==="▲"?0:t.stations.length-1;return t.stations[a]?.label??e.upcomingLabel}function ua(e,t,a=6){if(!t?.stations?.length)return[];const i=e.directionSymbol==="▲"?-1:1,s=[],r=new Set,o=e.upcomingStopIndex??e.currentIndex,l=Math.max(0,e.nextOffset??0),d=(u,p,{isNext:g=!1,isTerminal:v=!1}={})=>{if(u==null||r.has(u))return;const f=t.stations[u];f&&(r.add(u),s.push({id:`${e.id}:${f.id}`,label:f.label,etaSeconds:Math.max(0,Math.round(p)),clockTime:qe(p),isNext:g,isTerminal:v}))};d(o,l,{isNext:!0});let m=l;for(let u=o+i;s.length<a&&!(u<0||u>=t.stations.length);u+=i){const p=u-i,g=t.stations[p];m+=Math.max(0,Math.round((g?.segmentMinutes??0)*60));const v=u===0||u===t.stations.length-1;d(u,m,{isTerminal:v})}return s}function pa(e){It.textContent=e,Ha.textContent=e,ye()}function ye(){const e=_a;if(!e||!Fa)return;const a=n.dialogDisplayMode&&b.open&&It.scrollWidth>e.clientWidth;e.classList.toggle("is-marquee",a)}function Hn(e,t,a,i){const r=(a-e)*Math.PI/180,o=(i-t)*Math.PI/180,l=Math.sin(r/2)**2+Math.cos(e*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(o/2)**2;return 2*6371*Math.asin(Math.sqrt(l))}function Un(e){return Math.max(1,Math.round(e/ka*60))}function Vn(e){return e>=1?c("walkKm",e):c("walkMeters",Math.round(e*1e3))}function Wn(e,t){const a=Date.now(),i=new Set;for(const s of t){const r=`${e}:${s.id}`;i.add(r);const l=[...(n.vehicleGhosts.get(r)??[]).filter(d=>a-d.timestamp<=it),{y:s.y,minutePosition:s.minutePosition,timestamp:a}].slice(-6);n.vehicleGhosts.set(r,l)}for(const[s,r]of n.vehicleGhosts.entries()){if(!s.startsWith(`${e}:`))continue;const o=r.filter(l=>a-l.timestamp<=it);if(!i.has(s)||o.length===0){n.vehicleGhosts.delete(s);continue}o.length!==r.length&&n.vehicleGhosts.set(s,o)}}function Gn(e,t){return(n.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}function jn(e,t){const a=e.lat*Math.PI/180,i=t.lat*Math.PI/180,s=(t.lon-e.lon)*Math.PI/180,r=Math.sin(s)*Math.cos(i),o=Math.cos(a)*Math.sin(i)-Math.sin(a)*Math.cos(i)*Math.cos(s);return(Math.atan2(r,o)*180/Math.PI+360)%360}function Kn(e,t){if(!e||!t.length)return"";const a=Math.max(...t.map(s=>s.distanceKm),wt/2),i=82;return`
    <div class="transfer-radar">
      <svg viewBox="0 0 164 164" class="transfer-radar-svg" aria-hidden="true">
        <circle cx="${i}" cy="${i}" r="64" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="44" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="24" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="8" class="transfer-radar-core"></circle>
        ${t.map(s=>{const r=jn(e,s.stop),o=22+s.distanceKm/a*44,l=i+Math.sin(r*Math.PI/180)*o,d=i-Math.cos(r*Math.PI/180)*o;return`
              <g>
                <line x1="${i}" y1="${i}" x2="${l.toFixed(1)}" y2="${d.toFixed(1)}" class="transfer-radar-spoke"></line>
                <circle cx="${l.toFixed(1)}" cy="${d.toFixed(1)}" r="7" class="transfer-radar-stop" style="--line-color:${s.line.color};"></circle>
              </g>
            `}).join("")}
      </svg>
      <div class="transfer-radar-copy">
        <p class="headway-chart-title">${n.language==="zh-CN"?"换乘雷达":"Transfer Radar"}</p>
        <p class="headway-chart-copy">${n.language==="zh-CN"?"中心为当前站，越远表示步行越久":"Center is this station; farther dots mean longer walks"}</p>
      </div>
    </div>
  `}function Yn(e){if(!e)return[];const t=ve(e),a=new Set(t.map(({line:s,station:r})=>`${s.agencyId}:${s.id}:${r.id}`)),i=new Map;for(const s of n.systemsById.values())for(const r of s.lines??[])for(const o of r.stops??[]){if(a.has(`${r.agencyId}:${r.id}:${o.id}`))continue;const l=Hn(e.lat,e.lon,o.lat,o.lon);if(l>wt)continue;const d=`${s.id}:${r.id}`,m=i.get(d);(!m||l<m.distanceKm)&&i.set(d,{systemId:s.id,systemName:s.name,line:r,stop:o,distanceKm:l,walkMinutes:Un(l)})}return[...i.values()].sort((s,r)=>s.distanceKm-r.distanceKm||s.line.name.localeCompare(r.line.name)).slice(0,Lt*2)}function K(e,t=!1,a=n.currentDialogStation){if(t){q.hidden=!1,q.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">${c("transfers")}</h4>
          <p class="transfer-panel-copy">${c("checkingNearbyConnections")}</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">${c("loadingTransferRecommendations")}</div>
        </div>
      </div>
    `;return}if(!e.length){q.hidden=!0,q.innerHTML="";return}q.hidden=!1,q.innerHTML=`
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <h4 class="arrivals-title">${c("transfers")}</h4>
        <p class="transfer-panel-copy">${c("closestBoardableConnections")}</p>
      </div>
      ${Kn(a,e)}
      <div class="transfer-list">
        ${e.map(i=>`
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${i.line.color};">${i.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${i.line.name} <span class="transfer-system-chip">${i.systemName}</span></p>
                    <p class="transfer-card-stop">${c("walkToStop",i.walkMinutes,i.stop.name)}</p>
                    <p class="transfer-card-meta">${Vn(i.distanceKm)}${i.arrival?` • ${c("toDestination",i.arrival.destination)}`:""}</p>
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
  `}function Xn(e,t){const a=Date.now(),i=[];for(const s of e){const r=J(s.stop,s.line),o=oa(t,s.line,r),l=[...o.nb,...o.sb].sort((g,v)=>g.arrivalTime-v.arrivalTime);if(!l.length)continue;const d=a+s.walkMinutes*6e4+Ra,m=l.find(g=>g.arrivalTime>=d)??l[0],u=m.arrivalTime-a-s.walkMinutes*6e4,p=Math.max(0,Math.round(u/6e4));i.push({...s,arrival:m,boardAt:m.arrivalTime,badge:u<=0?c("leaveNow"):p<=1?c("boardInOneMinute"):c("boardInMinutes",p),tone:p<=2?"hot":p<=8?"good":"calm",timeText:da(m.arrivalTime)})}return i.sort((s,r)=>s.boardAt-r.boardAt||s.distanceKm-r.distanceKm).slice(0,Lt)}function Zn(){const e=Xt(),t=Oe(n.lines),a=L(),i=Oe(e);return`
    ${In(i)}
    ${Cn(t)}
    ${i.map(({line:s,layout:r,vehicles:o,nb:l,sb:d,lineAlerts:m})=>{const u=An(s,r,l,d,m);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header line-card-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${s.color};">${s.name[0]}</span>
              <div class="line-title-copy">
                <h2>${s.name}</h2>
                <p>${c("liveCount",o.length,o.length===1?L().toLowerCase():S().toLowerCase())} · ${Fe(s)}</p>
              </div>
            </div>
            ${He(s)}
          </header>
          ${nn(s)}
          ${u||`<p class="train-readout muted">${n.language==="zh-CN"?`等待实时${a.toLowerCase()}数据…`:`Waiting for live ${a.toLowerCase()} data…`}</p>`}
        </article>
      `}).join("")}
  `}function Qn(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await fa(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function Ie(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{n.activeLineId=t.dataset.lineSwitch,C()})})}function Ze(){n.currentTrainId="",M.open&&M.close()}function Qe(){k.open&&k.close()}function ma(e){const t=ee(e.id);Ot.textContent=c("affectedLineAlerts",e.name,t.length),Pt.textContent=c("activeAlerts",t.length),Va.textContent=e.name,ut.textContent="",ut.innerHTML=t.length?t.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${Vt(a.severity)} • ${Ut(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||c("serviceAlert")}</p>
              <p class="alert-dialog-item-copy">${a.description||c("noAdditionalAlertDetails")}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">${c("readOfficialAlert")}</a></p>`:""}
            </article>
          `).join(""):`<p class="alert-dialog-item-copy">${c("noActiveAlerts")}</p>`,Ne.hidden=!0,Ne.removeAttribute("href"),k.open||k.showModal()}function $t(){document.querySelectorAll("[data-alert-line-id]").forEach(t=>{t.addEventListener("click",()=>{const a=n.lines.find(i=>i.id===t.dataset.alertLineId);a&&ma(a)})})}function Jn(e){const t=e.fromLabel!==e.toLabel&&e.progress>0&&e.progress<1,a=t?e.fromLabel:e.previousLabel,i=t?`${e.fromLabel} -> ${e.toLabel}`:e.currentStopLabel,s=t?"Between":"Now",r=t?e.toLabel:e.upcomingLabel,o=t?e.progress:.5,l=n.layouts.get(e.lineId),d=ua(e,l),m=l?Y(e,l):e.upcomingLabel,u=d.at(-1)?.etaSeconds??Math.max(0,e.nextOffset??0),p=qt(e.directionSymbol);Et.textContent=`${e.lineName} ${L()} ${e.label}`,Rt.textContent=n.language==="zh-CN"?`${p} · ${c("toDestination",m)}`:`${p} to ${m}`,dt.className=`train-detail-status train-list-status-${Ye(e.serviceStatus)}`,dt.innerHTML=F(Ue(e)),M.querySelector(".train-eta-panel")?.remove(),ct.innerHTML=`
    <div class="train-detail-spine" style="--line-color:${e.lineColor};"></div>
    <div
      class="train-detail-marker-floating"
      style="--line-color:${e.lineColor}; --segment-progress:${o}; --direction-offset:${e.directionSymbol==="▼"?"10px":"-10px"};"
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
  `,ct.insertAdjacentHTML("afterend",`
      <section class="train-eta-panel">
        <div class="train-eta-summary">
          <div class="metric-chip">
            <p class="metric-chip-label">${c("direction")}</p>
            <p class="metric-chip-value">${p}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("terminal")}</p>
            <p class="metric-chip-value">${m}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("etaToTerminal")}</p>
            <p class="metric-chip-value">${I(u)}</p>
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
                      <p class="train-eta-stop-countdown">${I(g.etaSeconds)}</p>
                      <p class="train-eta-stop-clock">${g.clockTime}</p>
                    </div>
                  </article>
                `).join(""):`<p class="train-readout muted">${c("noDownstreamEta")}</p>`}
        </div>
      </section>
    `),M.open||M.showModal()}function bt(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,i=me().find(s=>s.id===a);i&&(n.currentTrainId=a,Jn(i))})})}function ei(){n.lines.forEach(e=>{const t=n.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.stopId,o=t.stations.find(l=>l.id===r);o&&ca(o)})})})}function C(){const e=U();if(document.documentElement.lang=n.language,Ae.textContent=c("languageToggle"),Ae.setAttribute("aria-label",c("languageToggleAria")),De.textContent=n.theme==="dark"?c("themeLight"):c("themeDark"),De.setAttribute("aria-label",c("themeToggleAria")),Oa.textContent=e.kicker,Pa.textContent=e.title,Le.setAttribute("aria-label",c("transitSystems")),Ba.setAttribute("aria-label",c("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",c("boardDirectionView")),Dt.textContent=V("▲","",{includeSymbol:!0}),Mt.textContent=V("▼","",{includeSymbol:!0}),X.textContent=n.dialogDisplayMode?c("exit"):c("board"),X.setAttribute("aria-label",n.dialogDisplayMode?c("exit"):c("board")),zt.setAttribute("aria-label",c("closeTrainDialog")),Bt.setAttribute("aria-label",c("closeAlertDialog")),b.open||(pa(c("station")),xt.textContent=c("serviceSummary")),M.open||(Et.textContent=c("train"),Rt.textContent=c("currentMovement")),k.open||(Ot.textContent=c("serviceAlert"),Pt.textContent=c("transitAdvisory")),Ne.textContent=c("readOfficialAlert"),Le.hidden=n.systemsById.size<2,Le.innerHTML=$n(),ga(),xe.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===n.activeTab)),xe.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=c("tabMap")),t.dataset.tab==="trains"&&(t.textContent=S()),t.dataset.tab==="insights"&&(t.textContent=c("tabInsights"))}),Qn(),n.activeTab==="map"){A.className="board";const t=Xt();A.innerHTML=`${Te()}${t.map(_n).join("")}`,Ie(),$t(),ei(),bt(),queueMicrotask(pe);return}if(n.activeTab==="trains"){A.className="board",A.innerHTML=`${Te()}${Fn()}`,Ie(),$t(),bt(),queueMicrotask(pe);return}n.activeTab==="insights"&&(A.className="board",A.innerHTML=`${Te()}${Zn()}`,Ie())}function ti(){window.clearInterval(n.insightsTickerTimer),n.insightsTickerTimer=0}function ai(){ti(),n.insightsTickerTimer=window.setInterval(()=>{n.insightsTickerIndex+=1,n.activeTab==="insights"&&C()},5e3)}function ga(){oe.textContent=n.error?c("statusHold"):c("statusSync"),oe.classList.toggle("status-pill-error",!!n.error),qa.textContent=`${c("nowPrefix")} ${ke()}`,Me.textContent=n.error?n.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":Qa(n.fetchedAt),rt.textContent=oe.textContent,rt.classList.toggle("status-pill-error",!!n.error),Ua.textContent=Me.textContent}function ni(){window.clearTimeout(n.liveRefreshTimer),n.liveRefreshTimer=0}function ii(){ni();const e=()=>{n.liveRefreshTimer=window.setTimeout(async()=>{await Je(),e()},xa)};e()}function ha(e){const t=n.systemsById.has(e)?e:G,a=n.systemsById.get(t);n.activeSystemId=t,n.lines=a?.lines??[],n.layouts=n.layoutsBySystem.get(t)??new Map,n.lines.some(i=>i.id===n.activeLineId)||(n.activeLineId=n.lines[0]?.id??""),n.vehiclesByLine=new Map,n.rawVehicles=[],n.arrivalsCache.clear(),n.alerts=[],n.error="",n.fetchedAt="",n.insightsTickerIndex=0,n.vehicleGhosts=new Map}async function fa(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!n.systemsById.has(e)||n.activeSystemId===e){t&&vt(n.activeSystemId);return}ha(e),a||ia(),Ze(),Qe(),C(),t&&vt(e),await Je()}async function si(){const a=(await(await fetch(wa,{cache:"no-store"})).json()).systems??[];n.systemsById=new Map(a.map(i=>[i.id,i])),n.layoutsBySystem=new Map(a.map(i=>[i.id,new Map(i.lines.map(s=>[s.id,cn(s)]))])),ha(aa())}function ri(e){const t=[...new Set((e.allAffects??[]).map(i=>i.routeId).filter(Boolean))],a=n.lines.filter(i=>t.includes(sa(i))).map(i=>i.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??c("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(i=>i.stopId).filter(Boolean))]}:null}async function Je(){try{const e=await jt(Ga(),"Realtime");n.error="",n.fetchedAt=new Date().toISOString(),n.rawVehicles=e.data.list??[],n.alerts=(e.data.references?.situations??[]).map(ri).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(s=>[s.id,s]));for(const s of n.lines){const r=n.layouts.get(s.id),o=n.rawVehicles.map(l=>hn(l,s,r,t)).filter(Boolean);n.vehiclesByLine.set(s.id,o),Wn(s.id,o)}const a=Jt(Oe(n.lines)),i=n.systemSnapshots.get(n.activeSystemId);n.systemSnapshots.set(n.activeSystemId,{previous:i?.current??null,current:a})}catch(e){n.error=c("realtimeOffline"),console.error(e)}C()}async function oi(){Ft(Za()),_t(Xa()),pt(),await si(),C(),await Je(),await yt(),window.addEventListener("popstate",()=>{yt().catch(console.error)});const e=()=>{const a=n.compactLayout;if(pt(),ye(),a!==n.compactLayout){C();return}pe()};window.addEventListener("resize",e),window.visualViewport?.addEventListener("resize",e),new ResizeObserver(()=>{pe()}).observe(A),ii(),ai(),window.setInterval(()=>{ga(),En(),gn()},1e3)}oi().catch(e=>{oe.textContent=c("statusFail"),Me.textContent=e.message});
