(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const Sa="modulepreload",wa=function(e){return"/link/dev/"+e},et={},La=function(t,a,i){let s=Promise.resolve();if(a&&a.length>0){let m=function(u){return Promise.all(u.map(p=>Promise.resolve(p).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};var l=m;document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),d=o?.nonce||o?.getAttribute("nonce");s=m(a.map(u=>{if(u=wa(u),u in et)return;et[u]=!0;const p=u.endsWith(".css"),g=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${g}`))return;const v=document.createElement("link");if(v.rel=p?"stylesheet":Sa,p||(v.as="script"),v.crossOrigin="",v.href=u,d&&v.setAttribute("nonce",d),document.head.appendChild(v),p)return new Promise((f,T)=>{v.addEventListener("load",f),v.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(o){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=o,window.dispatchEvent(d),!d.defaultPrevented)throw o}return s.then(o=>{for(const d of o||[])d.status==="rejected"&&r(d.reason);return t().catch(r)})};function Ta(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:i,onRegistered:s,onRegisteredSW:r,onRegisterError:l}=e;let o,d;const m=async(p=!0)=>{await d};async function u(){if("serviceWorker"in navigator){if(o=await La(async()=>{const{Workbox:p}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:p}},[]).then(({Workbox:p})=>new p("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(p=>{l?.(p)}),!o)return;o.addEventListener("activated",p=>{(p.isUpdate||p.isExternal)&&window.location.reload()}),o.addEventListener("installed",p=>{p.isUpdate||i?.()}),o.register({immediate:t}).then(p=>{r?r("/link/dev/sw.js",p):s?.(p)}).catch(p=>{l?.(p)})}}return d=u(),m}const Ca="./pulse-data.json",Lt="https://api.pugetsound.onebusaway.org/api/where",qe="TEST".trim()||"TEST",R=qe==="TEST",Ia=R?6e4:2e4,tt=3,at=800,Aa=R?2e4:5e3,nt=R?12e4:3e4,it=R?1200:0,Le=R?1:3,xa=1100,Da=R?45e3:15e3,Ma=R?9e4:3e4,Na=4e3,ka=15e3,Ea=520,st=4*6e4,Ra=4.8,Tt=.35,za=3e3,Oa=45e3,Ct=4,It="link-pulse-theme",At="link-pulse-language",j="link",pe={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},rt={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}};function _a(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function me(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function ce(e){return e.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function U(e,t,a){return Math.max(t,Math.min(e,a))}function k(e){return new Promise(t=>window.setTimeout(t,e))}function Pa(e){const[t="0",a="0",i="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(i)}function Ba(e,t,a,i){const r=(a-e)*Math.PI/180,l=(i-t)*Math.PI/180,o=Math.sin(r/2)**2+Math.cos(e*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(l/2)**2;return 2*6371*Math.asin(Math.sqrt(o))}function qa(e,t){const a=e.lat*Math.PI/180,i=t.lat*Math.PI/180,s=(t.lon-e.lon)*Math.PI/180,r=Math.sin(s)*Math.cos(i),l=Math.cos(a)*Math.sin(i)-Math.sin(a)*Math.cos(i)*Math.cos(s);return(Math.atan2(r,l)*180/Math.PI+360)%360}function Fa(e,t){if(!e)return t("waitingSnapshot");const a=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return a<10?t("updatedNow"):a<60?t("updatedSecondsAgo",a):t("updatedMinutesAgo",Math.round(a/60))}function Ha(e){return new Intl.DateTimeFormat(e==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:e!=="zh-CN"}).format(new Date)}function Ua(e,t,a){if(e<=0)return a("arriving");const i=Math.floor(e/60),s=e%60;return t==="zh-CN"?i>0?`${i}分 ${s}秒`:`${s}秒`:i>0?`${i}m ${s}s`:`${s}s`}function Va(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function de(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function q(e,t){if(!e||!t)return null;const[a,i,s]=e.split("-").map(Number),r=Pa(t),l=Math.floor(r/3600),o=Math.floor(r%3600/60),d=r%60;return new Date(a,i-1,s,l,o,d)}function Wa(e,t){const a=Math.max(0,Math.round(e/6e4)),i=Math.floor(a/60),s=a%60;return t==="zh-CN"?i&&s?`${i}小时${s}分钟`:i?`${i}小时`:`${s}分钟`:i&&s?`${i}h ${s}m`:i?`${i}h`:`${s}m`}function Ga(e,t){if(!e)return"";const[a="0",i="0"]=String(e).split(":"),s=Number(a),r=Number(i),l=(s%24+24)%24;if(t==="zh-CN")return`${String(l).padStart(2,"0")}:${String(r).padStart(2,"0")}`;const o=l>=12?"PM":"AM";return`${l%12||12}:${String(r).padStart(2,"0")} ${o}`}function xt(e,t){return new Date(e).toLocaleTimeString(t==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:t!=="zh-CN"})}function ja(e,t){return xt(Date.now()+Math.max(0,e)*1e3,t)}function Ka(e,t){return e>=1?t("walkKm",e):t("walkMeters",Math.round(e*1e3))}function Dt(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function Mt(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function ge(e,t){const a=[...e].sort((r,l)=>r.minutePosition-l.minutePosition),i=[...t].sort((r,l)=>r.minutePosition-l.minutePosition),s=r=>r.slice(1).map((l,o)=>Math.round(l.minutePosition-r[o].minutePosition));return{nbGaps:s(a),sbGaps:s(i)}}function Ya(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((s,r)=>s+r,0)/e.length,a=Math.max(...e),i=Math.min(...e);return{avg:Math.round(t),max:a,min:i,spread:a-i,ratio:a/Math.max(i,1)}}function he(e,t){const a=Ya(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let i="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?i="bunched":a.max>=12||a.spread>=6?i="uneven":a.avg>=18&&(i="sparse"),{health:i,stats:a}}function xe(e){return e.reduce((t,a)=>{const i=Number(a.scheduleDeviation??0);return i<=60?t.onTime+=1:i<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function Nt(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function Xa({worstGap:e,severeLateCount:t,alertCount:a,balanceDelta:i,language:s}){const r=[];return e>=12&&r.push({key:"gap",tone:"alert",label:s==="zh-CN"?"大间隔":"Large gap"}),t>0&&r.push({key:"late",tone:"warn",label:s==="zh-CN"?"严重晚点":"Severe late"}),a>0&&r.push({key:"alert",tone:"info",label:s==="zh-CN"?"有告警":"Alerted"}),i>=2&&r.push({key:"balance",tone:"warn",label:s==="zh-CN"?"方向失衡":"Imbalanced"}),r.length||r.push({key:"healthy",tone:"healthy",label:s==="zh-CN"?"健康":"Healthy"}),r}const n={fetchedAt:"",error:"",activeSystemId:j,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayDirectionAnimationTimer:0,dialogDisplayAnimatingDirection:"",dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},Za=Ta({immediate:!0,onNeedRefresh(){Za(!0)}});document.querySelector("#app").innerHTML=`
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
`;const x=document.querySelector("#board"),Qa=document.querySelector("#screen-kicker"),Ja=document.querySelector("#screen-title"),Te=document.querySelector("#system-bar"),en=document.querySelector("#view-bar"),De=[...document.querySelectorAll(".tab-button")],Me=document.querySelector("#language-toggle"),Ne=document.querySelector("#theme-toggle"),ue=document.querySelector("#status-pill"),tn=document.querySelector("#current-time"),ke=document.querySelector("#updated-at"),b=document.querySelector("#station-dialog"),an=document.querySelector("#dialog-title"),nn=document.querySelector("#dialog-title-track"),kt=document.querySelector("#dialog-title-text"),sn=document.querySelector("#dialog-title-text-clone"),Et=document.querySelector("#dialog-service-summary"),ot=document.querySelector("#dialog-status-pill"),rn=document.querySelector("#dialog-updated-at"),Z=document.querySelector("#dialog-display"),Rt=[...document.querySelectorAll("[data-dialog-direction]")],zt=document.querySelector("#arrivals-title-nb"),Ot=document.querySelector("#arrivals-title-sb"),K=document.querySelector("#station-alerts-container"),F=document.querySelector("#transfer-section"),_t=document.querySelector('[data-direction-section="nb"]'),lt=document.querySelector("#arrivals-nb-pinned"),Q=document.querySelector("#arrivals-nb"),Pt=document.querySelector('[data-direction-section="sb"]'),ct=document.querySelector("#arrivals-sb-pinned"),J=document.querySelector("#arrivals-sb"),M=document.querySelector("#train-dialog"),Bt=document.querySelector("#train-dialog-title"),qt=document.querySelector("#train-dialog-subtitle"),dt=document.querySelector("#train-dialog-line"),ut=document.querySelector("#train-dialog-status"),Ft=document.querySelector("#train-dialog-close"),E=document.querySelector("#alert-dialog"),Ht=document.querySelector("#alert-dialog-title"),Ut=document.querySelector("#alert-dialog-subtitle"),on=document.querySelector("#alert-dialog-lines"),pt=document.querySelector("#alert-dialog-body"),Ee=document.querySelector("#alert-dialog-link"),Vt=document.querySelector("#alert-dialog-close");Z.addEventListener("click",()=>Vn());Ft.addEventListener("click",()=>Ze());Vt.addEventListener("click",()=>Qe());Me.addEventListener("click",()=>{Kt(n.language==="en"?"zh-CN":"en"),I()});Rt.forEach(e=>{e.addEventListener("click",()=>{n.dialogDisplayDirection=e.dataset.dialogDirection,n.dialogDisplayDirection==="auto"&&(n.dialogDisplayAutoPhase="nb"),Ge()})});b.addEventListener("click",e=>{e.target===b&&la()});M.addEventListener("click",e=>{e.target===M&&Ze()});E.addEventListener("click",e=>{e.target===E&&Qe()});b.addEventListener("close",()=>{je(),Ke(),We(),Ve(!1),n.isSyncingFromUrl||sa()});De.forEach(e=>{e.addEventListener("click",()=>{n.activeTab=e.dataset.tab,I()})});Ne.addEventListener("click",()=>{jt(n.theme==="dark"?"light":"dark"),I()});function V(){return pe[n.activeSystemId]??pe[j]}function ln(){return n.systemsById.get(n.activeSystemId)?.agencyId??pe[j].agencyId}function cn(){return`${Lt}/vehicles-for-agency/${ln()}.json?key=${qe}`}function L(){return n.language==="zh-CN"?V().vehicleLabel==="Train"?"列车":"公交":V().vehicleLabel??"Vehicle"}function S(){return n.language==="zh-CN"?L():V().vehicleLabelPlural??_a(L())}function dn(){return rt[n.language]??rt.en}function c(e,...t){const a=dn()[e];return typeof a=="function"?a(...t):a}function un(e){return Fa(e,c)}function Re(){return Ha(n.language)}function A(e){return Ua(e,n.language,c)}function le(e){return Wa(e,n.language)}function C(e){return Ga(e,n.language)}function pn(e){return xt(e,n.language)}function ze(e){return ja(e,n.language)}function mn(e){return Ka(e,c)}function Wt(e,t=!1){const a=t&&(e==="▲"||e==="▼")?`${e} `:"";return e==="▲"?`${a}${n.language==="zh-CN"?"北向":"Northbound"}`:e==="▼"?`${a}${n.language==="zh-CN"?"南向":"Southbound"}`:c("active")}function W(e,t="",{includeSymbol:a=!1}={}){const i=Wt(e,a);return t?n.language==="zh-CN"?`${i} · 开往 ${t}`:`${i} to ${t}`:i}function Gt(e,t){if(!t?.stations?.length)return"";const a=e==="▲"?0:e==="▼"?t.stations.length-1:-1;return a<0?"":t.stations[a]?.label??""}function D(e,t,a={}){return W(e,Gt(e,t),a)}function mt(e){const t=[...new Set(e.map(i=>i?.trim()).filter(Boolean))];if(!t.length)return"";const a=t.slice(0,2);return t.length>2&&a.push(n.language==="zh-CN"?"等":"etc."),a.join(" / ")}function fe(e,t=[],a=n.currentDialogStation){const i=t.map(l=>l.destination),s=mt(i);if(s)return s;if(!a)return"";const r=ae(a).map(({line:l})=>n.layouts.get(l.id)).map(l=>Gt(e,l));return mt(r)}function gn(){const e=window.localStorage.getItem(It);return e==="light"||e==="dark"?e:"dark"}function hn(){const e=window.localStorage.getItem(At);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function jt(e){n.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(It,e)}function Kt(e){n.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=n.language,window.localStorage.setItem(At,n.language)}function gt(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);n.compactLayout=i<=xa}function ve(){const a=window.getComputedStyle(x).gridTemplateColumns.split(" ").map(i=>i.trim()).filter(Boolean).length<=1;a!==n.compactLayout&&(n.compactLayout=a,I())}function Fe(e){const t=Va(),a=e.serviceSpansByDate?.[t];return a?c("todayServiceSpan",C(a.start),C(a.end)):c("todayServiceUnavailable")}function Yt(e){const t=new Date,a=de(-1),i=de(0),s=de(1),r=e.serviceSpansByDate?.[a],l=e.serviceSpansByDate?.[i],o=e.serviceSpansByDate?.[s],m=[r&&{kind:"yesterday",start:q(a,r.start),end:q(a,r.end),span:r},l&&{kind:"today",start:q(i,l.start),end:q(i,l.end),span:l}].filter(Boolean).find(u=>t>=u.start&&t<=u.end);if(m)return{tone:"active",headline:c("lastTrip",C(m.span.end)),detail:c("endsIn",le(m.end.getTime()-t.getTime())),compact:c("endsIn",le(m.end.getTime()-t.getTime()))};if(l){const u=q(i,l.start),p=q(i,l.end);if(t<u)return{tone:"upcoming",headline:c("firstTrip",C(l.start)),detail:c("startsIn",le(u.getTime()-t.getTime())),compact:c("startsIn",le(u.getTime()-t.getTime()))};if(t>p)return{tone:"ended",headline:c("serviceEnded",C(l.end)),detail:o?c("nextStart",C(o.start)):c("noNextServiceLoaded"),compact:o?c("nextStart",C(o.start)):c("ended")}}return o?{tone:"upcoming",headline:c("nextFirstTrip",C(o.start)),detail:c("noServiceRemainingToday"),compact:c("nextStart",C(o.start))}:{tone:"muted",headline:c("serviceHoursUnavailable"),detail:c("staticScheduleMissing"),compact:c("unavailable")}}function He(e){const t=Yt(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function fn(e){const t=ae(e).map(({line:a})=>{const i=Yt(a);return`${a.name}: ${i.compact}`}).slice(0,3);Et.textContent=t.join("  ·  ")||c("serviceSummaryUnavailable")}function vn(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function yn(e){const t=de(0),a=e.serviceSpansByDate?.[t];if(!a)return null;const i=parseClockToSeconds(a.start)/3600,s=parseClockToSeconds(a.end)/3600,r=vn(new Date),l=Math.max(24,s,r,1);return{startHours:i,endHours:s,nowHours:r,axisMax:l,startLabel:C(a.start),endLabel:C(a.end)}}function $n(e){const t=yn(e);if(!t)return"";const a=U(t.startHours/t.axisMax*100,0,100),i=U(t.endHours/t.axisMax*100,a,100),s=U(t.nowHours/t.axisMax*100,0,100),r=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
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
  `}function te(e){return n.alerts.filter(t=>t.lineIds.includes(e))}function Xt(e,t){const a=te(t.id);if(!a.length)return[];const i=new Set(ee(e,t));return i.add(e.id),a.filter(s=>s.stopIds.length>0&&s.stopIds.some(r=>i.has(r)))}function bn(e){const t=new Set,a=[];for(const{station:i,line:s}of ae(e))for(const r of Xt(i,s))t.has(r.id)||(t.add(r.id),a.push(r));return a}function Zt(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${c("alertsWord",e.length)}</span>
    </button>
  `:""}function Sn(){const e=Math.max(0,n.obaRateLimitStreak-1),t=Math.min(nt,Aa*2**e),a=Math.round(t*(.15+Math.random()*.2));return Math.min(nt,t+a)}async function wn(){const e=n.obaCooldownUntil-Date.now();e>0&&await k(e)}function Ln(e){return e?.code===429||/rate limit/i.test(e?.text??"")}async function Qt(e,t){for(let a=0;a<=tt;a+=1){await wn();let i=null,s=null,r=null;try{i=await fetch(e,{cache:"no-store"})}catch(d){r=d}if(i!==null)try{s=await i.json()}catch{s=null}const l=i?.status===429||Ln(s);if(i?.ok&&!l)return n.obaRateLimitStreak=0,n.obaCooldownUntil=0,s;const o=r!=null||i!=null&&(i.status===429||i.status>=500&&i.status<600);if(a===tt||!o)throw r||(s?.text?new Error(s.text):new Error(`${t} request failed with ${i?.status??"network error"}`));if(l){n.obaRateLimitStreak+=1;const d=at*2**a,m=Math.max(d,Sn());n.obaCooldownUntil=Date.now()+m,await k(m)}else{const d=at*2**a;await k(d)}}throw new Error(`${t} request failed`)}function Tn(e){const t=[...e.stops].sort((p,g)=>g.sequence-p.sequence),a=48,i=44,s=28,r=88,l=122,o=i+s+(t.length-1)*a,d=new Map,m=t.map((p,g)=>{const v={...p,label:me(p.name),y:i+g*a,index:g,isTerminal:g===0||g===t.length-1};d.set(p.id,g),d.set(`${e.agencyId}_${p.id}`,g);for(const f of e.stationAliases?.[p.id]??[])d.set(f,g),d.set(`${e.agencyId}_${f}`,g);return v});let u=0;for(let p=0;p<m.length;p+=1)m[p].cumulativeMinutes=u,u+=p<m.length-1?m[p].segmentMinutes:0;return{totalMinutes:u,height:o,labelX:l,stationGap:a,stationIndexByStopId:d,stations:m,trackX:r}}function Cn(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function In(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase();t.closestStopTimeOffset;const i=t.nextStopTimeOffset??0,s=t.scheduleDeviation??0,r=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||r&&Math.abs(i)<=90?"ARR":s>=120?"DELAY":"OK"}function An(e,t){if(!t)return{text:c("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:c("onTime"),colorClass:"status-ontime"};if(e>60){const a=Math.round(e/60);let i="status-late-minor";return e>600?i="status-late-severe":e>300&&(i="status-late-moderate"),{text:n.language==="zh-CN"?`晚点 ${a} 分钟`:`+${a} min late`,colorClass:i}}if(e<-60){const a=Math.round(Math.abs(e)/60);return{text:n.language==="zh-CN"?`早到 ${a} 分钟`:`${a} min early`,colorClass:"status-early"}}return{text:c("unknown"),colorClass:"status-muted"}}function xn(e){switch(e){case"ARR":return c("arrivingStatus");case"DELAY":return c("delayedStatus");case"OK":return c("enRoute");default:return""}}function $(e){if(!n.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(n.fetchedAt).getTime())/1e3));return e-t}function G(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function Ue(e){const t=$(e.nextOffset??0),a=$(e.closestOffset??0),i=e.delayInfo.text;return t<=15?[{text:c("arrivingNow"),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:c("arrivingIn",A(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:c("nextStopIn",A(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:[{text:xn(e.serviceStatus),toneClass:G(e,t)},{text:i,toneClass:e.delayInfo.colorClass}]}function H(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function Jt(e){const t=$(e.nextOffset??0),a=$(e.closestOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel,[s,r]=Ue(e);return t<=15?`${e.label} at ${i} ${H([s,r])}`:t<=90?`${e.label} at ${i} ${H([s,r])}`:a<0&&t>0?`${e.label} ${i} ${H([s,r])}`:`${e.label} to ${i} ${H([s,r])}`}function Oe(e){return H(Ue(e))}function ea(e,t){if(!t.length)return"";const a=[...t].sort((s,r)=>$(s.nextOffset??0)-$(r.nextOffset??0)).slice(0,8),i=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${i.map(s=>`
          <span
            class="line-marquee-item ${G(s,$(s.nextOffset??0))}"
            data-vehicle-marquee="${s.id}"
          >
            <span class="line-marquee-token">${s.lineToken}</span>
            <span class="line-marquee-copy">${Jt(s)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function Dn(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const i=a.dataset.vehicleStatus,s=ye().find(l=>l.id===i);if(!s)return;const r=$(s.nextOffset??0);a.innerHTML=Oe(s),a.className=`train-list-status ${G(s,r)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const i=a.dataset.vehicleMarquee,s=ye().find(o=>o.id===i);if(!s)return;const r=$(s.nextOffset??0);a.className=`line-marquee-item ${G(s,r)}`;const l=a.querySelector(".line-marquee-copy");l&&(l.innerHTML=Jt(s))})}function Mn(e,t,a,i){const s=e.tripStatus?.activeTripId??e.tripId??"",r=i.get(s);if(!r||r.routeId!==t.routeKey)return null;const l=e.tripStatus?.closestStop,o=e.tripStatus?.nextStop,d=a.stationIndexByStopId.get(l),m=a.stationIndexByStopId.get(o);if(d==null&&m==null)return null;let u=d??m,p=m??d;if(u>p){const we=u;u=p,p=we}const g=a.stations[u],v=a.stations[p],f=e.tripStatus?.closestStopTimeOffset??0,T=e.tripStatus?.nextStopTimeOffset??0,ne=r.directionId==="1"?"▲":r.directionId==="0"?"▼":Cn(d,m);let z=0;u!==p&&f<0&&T>0&&(z=U(Math.abs(f)/(Math.abs(f)+T),0,1));const O=g.y+(v.y-g.y)*z,y=u!==p?g.segmentMinutes:0,h=g.cumulativeMinutes+y*z,w=d??m??u,_=a.stations[w]??g,P=ne==="▲",B=U(w+(P?1:-1),0,a.stations.length-1),ie=d!=null&&m!=null&&d!==m?m:U(w+(P?-1:1),0,a.stations.length-1),se=a.stations[B]??_,be=a.stations[ie]??v,re=e.tripStatus?.scheduleDeviation??0,oe=e.tripStatus?.predicted??!1,Se=An(re,oe);return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:ne,fromLabel:g.label,minutePosition:h,progress:z,serviceStatus:In(e),toLabel:v.label,y:O,currentLabel:g.label,nextLabel:v.label,previousLabel:se.label,currentStopLabel:_.label,upcomingLabel:be.label,currentIndex:w,upcomingStopIndex:ie,status:e.tripStatus?.status??"",closestStop:l,nextStop:o,closestOffset:f,nextOffset:T,scheduleDeviation:re,isPredicted:oe,delayInfo:Se,rawVehicle:e}}function Nn(e){return e.fromLabel===e.toLabel||e.progress===0?n.language==="zh-CN"?`位于 ${e.fromLabel}`:`At ${e.fromLabel}`:`${e.fromLabel} -> ${e.toLabel}`}function kn(e){return e.fromLabel===e.toLabel||e.progress===0?n.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:n.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function En(e){const t=n.layouts.get(e.lineId),a=Math.max(0,ga(e,t).at(-1)?.etaSeconds??e.nextOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${n.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${i}</p>
        <p class="train-focus-metric-copy">${A($(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${n.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${X(e,t)}</p>
        <p class="train-focus-metric-copy">${A($(a))}</p>
      </div>
    </div>
  `}function ye(){return n.lines.flatMap(e=>(n.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function Rn(){return Object.values(pe).filter(e=>n.systemsById.has(e.id)).map(e=>`
        <button
          class="tab-button ${e.id===n.activeSystemId?"is-active":""}"
          data-system-switch="${e.id}"
          type="button"
        >
          ${e.label}
        </button>
      `).join("")}function Ce(){return!n.compactLayout||n.lines.length<2?"":`<section class="line-switcher">${n.lines.map(t=>`
        <button
          class="line-switcher-button ${t.id===n.activeLineId?"is-active":""}"
          data-line-switch="${t.id}"
          type="button"
          style="--line-color:${t.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <span>${t.name}</span>
        </button>
      `).join("")}</section>`}function ta(){return n.compactLayout?n.lines.filter(e=>e.id===n.activeLineId):n.lines}function zn(e,t){if(!e.length||t<2)return{averageText:"—",detailText:n.language==="zh-CN"?`${S()}数量不足，无法判断间隔`:`Too few ${S().toLowerCase()} for a spacing read`};const a=Math.round(e.reduce((r,l)=>r+l,0)/e.length),i=Math.min(...e),s=Math.max(...e);return{averageText:`~${a} min`,detailText:n.language==="zh-CN"?`观测间隔 ${i}-${s} 分钟`:`${i}-${s} min observed gap`}}function ht(e,t,a){const{averageText:i,detailText:s}=zn(t,a);return`
    <div class="headway-health-card">
      <p class="headway-health-label">${e}</p>
      <p class="headway-health-value">${i}</p>
      <p class="headway-health-copy">${s}</p>
    </div>
  `}function On(e,t){return Math.abs(e.length-t.length)<=1?{label:n.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:e.length>t.length?{label:n.language==="zh-CN"?"北向偏多":"Northbound heavier",tone:"warn"}:{label:n.language==="zh-CN"?"南向偏多":"Southbound heavier",tone:"warn"}}function _n(e,t){return`
    <div class="delay-distribution">
      ${[[n.language==="zh-CN"?"准点":"On time",e.onTime,"healthy"],[n.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",e.minorLate,"warn"],[n.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",e.severeLate,"alert"]].map(([i,s,r])=>`
        <div class="delay-chip delay-chip-${r}">
          <p class="delay-chip-label">${i}</p>
          <p class="delay-chip-value">${s}</p>
          <p class="delay-chip-copy">${Nt(s,t)}</p>
        </div>
      `).join("")}
    </div>
  `}function ft(e,t,a,i){if(!t.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${e}</p>
          <p class="flow-lane-copy">${c("noLiveVehicles",S().toLowerCase())}</p>
        </div>
      </div>
    `;const s=[...t].sort((l,o)=>l.minutePosition-o.minutePosition),r=s.map(l=>{const o=a.totalMinutes>0?l.minutePosition/a.totalMinutes:0;return Math.max(0,Math.min(100,o*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${e}</p>
        <p class="flow-lane-copy">${c("liveCount",s.length,s.length===1?L().toLowerCase():S().toLowerCase())}</p>
      </div>
      <div class="flow-track" style="--line-color:${i};">
        ${r.map((l,o)=>`
          <span
            class="flow-vehicle"
            style="left:${l}%; --line-color:${i};"
            title="${s[o].label} · ${Nn(s[o])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function aa(e,t,a,i){const s=[],r=n.layouts.get(e.id),l=D("▲",r,{includeSymbol:!0}),o=D("▼",r,{includeSymbol:!0}),{stats:d}=he(ge(t,[]).nbGaps,t.length),{stats:m}=he(ge([],a).sbGaps,a.length),u=[...t,...a].filter(g=>Number(g.scheduleDeviation??0)>300),p=Math.abs(t.length-a.length);return d.max!=null&&d.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`${l} 当前有 ${d.max} 分钟的服务空档。`:`${l} has a ${d.max} min service hole right now.`}),m.max!=null&&m.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`${o} 当前有 ${m.max} 分钟的服务空档。`:`${o} has a ${m.max} min service hole right now.`}),p>=2&&s.push({tone:"warn",copy:t.length>a.length?n.language==="zh-CN"?`车辆分布向 ${l} 偏多 ${p} 辆。`:`Vehicle distribution is tilted toward ${l} by ${p}.`:n.language==="zh-CN"?`车辆分布向 ${o} 偏多 ${p} 辆。`:`Vehicle distribution is tilted toward ${o} by ${p}.`}),u.length&&s.push({tone:"warn",copy:n.language==="zh-CN"?`${u.length} 辆${u.length===1?L().toLowerCase():S().toLowerCase()}晚点超过 5 分钟。`:`${u.length} ${u.length===1?L().toLowerCase():S().toLowerCase()} are running 5+ min late.`}),i.length&&s.push({tone:"info",copy:n.language==="zh-CN"?`${e.name} 当前受 ${i.length} 条告警影响。`:`${i.length} active alert${i.length===1?"":"s"} affecting ${e.name}.`}),s.length||s.push({tone:"healthy",copy:n.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),s.slice(0,4)}function _e(e){return e.map(t=>{const a=n.layouts.get(t.id),i=n.vehiclesByLine.get(t.id)??[],s=i.filter(o=>o.directionSymbol==="▲"),r=i.filter(o=>o.directionSymbol==="▼"),l=te(t.id);return{line:t,layout:a,vehicles:i,nb:s,sb:r,lineAlerts:l,exceptions:aa(t,s,r,l)}})}function vt(e){return`
    <div class="attention-reason-badges">
      ${e.map(t=>`
        <span class="attention-reason-badge attention-reason-badge-${t.tone}">${t.label}</span>
      `).join("")}
    </div>
  `}function na(e){const t=e.length,a=e.reduce((h,w)=>h+w.vehicles.length,0),i=e.reduce((h,w)=>h+w.lineAlerts.length,0),s=e.filter(h=>h.lineAlerts.length>0).length,r=new Set(e.flatMap(h=>h.lineAlerts.flatMap(w=>w.stopIds??[]))).size,l=e.flatMap(h=>h.vehicles),o=xe(l),d=e.map(h=>{const{nbGaps:w,sbGaps:_}=ge(h.nb,h.sb),P=[...w,..._].length?Math.max(...w,..._):0,B=h.vehicles.filter(N=>Number(N.scheduleDeviation??0)>300).length,ie=xe(h.vehicles),se=Math.abs(h.nb.length-h.sb.length),be=he(w,h.nb.length).health,re=he(_,h.sb.length).health,oe=[be,re].some(N=>N==="uneven"||N==="bunched"||N==="sparse"),Se=B>0,we=h.lineAlerts.length*5+B*3+Math.max(0,P-10),ba=Xa({worstGap:P,severeLateCount:B,alertCount:h.lineAlerts.length,balanceDelta:se,language:n.language});return{line:h.line,score:we,worstGap:P,severeLateCount:B,alertCount:h.lineAlerts.length,impactedStopCount:new Set(h.lineAlerts.flatMap(N=>N.stopIds??[])).size,balanceDelta:se,hasSevereLate:Se,isUneven:oe,attentionReasons:ba,delayBuckets:ie}}).sort((h,w)=>w.score-h.score||w.worstGap-h.worstGap),m=new Set(d.filter(h=>h.hasSevereLate).map(h=>h.line.id)),u=new Set(d.filter(h=>h.isUneven).map(h=>h.line.id)),p=d.filter(h=>h.hasSevereLate&&!h.isUneven).length,g=d.filter(h=>h.isUneven&&!h.hasSevereLate).length,v=d.filter(h=>h.hasSevereLate&&h.isUneven).length,f=new Set([...m,...u]).size,T=Math.max(0,t-f),ne=a?Math.round(o.onTime/a*100):null,z=d.filter(h=>h.score>0).slice(0,2);let O={tone:"healthy",copy:n.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const y=d[0]??null;return y?.alertCount?O={tone:"info",copy:n.language==="zh-CN"?`${y.line.name} 当前有 ${y.alertCount} 条生效告警。`:`${y.line.name} has ${y.alertCount} active alert${y.alertCount===1?"":"s"}.`}:y?.worstGap>=12?O={tone:"alert",copy:n.language==="zh-CN"?`当前最大实时间隔为空 ${y.line.name} 的 ${y.worstGap} 分钟。`:`Largest live gap: ${y.worstGap} min on ${y.line.name}.`}:y?.severeLateCount&&(O={tone:"warn",copy:n.language==="zh-CN"?`${y.line.name} 有 ${y.severeLateCount} 辆${y.severeLateCount===1?L().toLowerCase():S().toLowerCase()}晚点超过 5 分钟。`:`${y.line.name} has ${y.severeLateCount} ${y.severeLateCount===1?L().toLowerCase():S().toLowerCase()} running 5+ min late.`}),{totalLines:t,totalVehicles:a,totalAlerts:i,impactedLines:s,impactedStopCount:r,delayedLineIds:m,unevenLineIds:u,lateOnlyLineCount:p,unevenOnlyLineCount:g,mixedIssueLineCount:v,attentionLineCount:f,healthyLineCount:T,onTimeRate:ne,rankedLines:d,priorityLines:z,topIssue:O}}function yt(e,t,{suffix:a="",invert:i=!1}={}){if(e==null||t==null||e===t)return n.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const s=e-t,r=i?s<0:s>0,l=s>0?"↑":"↓";return n.language==="zh-CN"?`${r?"改善":"变差"} ${l} ${Math.abs(s)}${a}`:`${r?"Improving":"Worse"} ${l} ${Math.abs(s)}${a}`}function Pn(e){const t=na(e),a=n.systemSnapshots.get(n.activeSystemId)?.previous??null,i=[];t.totalAlerts>0&&i.push({tone:"info",copy:n.language==="zh-CN"?`${t.impactedLines} 条线路共受 ${t.totalAlerts} 条告警影响。`:`${t.totalAlerts} active alert${t.totalAlerts===1?"":"s"} across ${t.impactedLines} line${t.impactedLines===1?"":"s"}.`}),t.delayedLineIds.size>0&&i.push({tone:"warn",copy:n.language==="zh-CN"?`${t.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${t.delayedLineIds.size} line${t.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),t.unevenLineIds.size>0&&i.push({tone:"alert",copy:n.language==="zh-CN"?`${t.unevenLineIds.size} 条线路当前发车间隔不均。`:`${t.unevenLineIds.size} line${t.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),i.length||i.push({tone:"healthy",copy:n.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const s=[{label:n.language==="zh-CN"?"准点率":"On-Time Rate",value:t.onTimeRate!=null?`${t.onTimeRate}%`:"—",delta:yt(t.onTimeRate,a?.onTimeRate,{suffix:"%"})},{label:n.language==="zh-CN"?"需关注线路":"Attention Lines",value:t.attentionLineCount,delta:yt(t.attentionLineCount,a?.attentionLineCount,{invert:!0})}];return`
    <article class="panel-card panel-card-wide system-summary-card">
      <header class="panel-header">
        <div class="system-summary-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:var(--accent-strong);">${V().label[0]}</span>
            <div class="line-title-copy">
              <h2>${V().label} ${n.language==="zh-CN"?"概览":"Summary"}</h2>
              <p>${n.language==="zh-CN"?`系统内 ${t.totalLines} 条线路 · 更新于 ${Re()}`:`${t.totalLines} line${t.totalLines===1?"":"s"} in system · Updated ${Re()}`}</p>
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
          ${(t.priorityLines.length?t.priorityLines:t.rankedLines.slice(0,1)).map(({line:r,worstGap:l,severeLateCount:o,alertCount:d,attentionReasons:m})=>`
            <div class="system-priority-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${r.color};">${r.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${r.name}</p>
                  <p class="headway-chart-copy">${n.language==="zh-CN"?`${l?`最大间隔 ${l} 分钟`:"当前无明显间隔问题"}${o?` · ${o} 辆严重晚点`:""}${d?` · ${d} 条告警`:""}`:`${l?`Gap ${l} min`:"No major spacing issue"}${o?` · ${o} severe late`:""}${d?` · ${d} alert${d===1?"":"s"}`:""}`}</p>
                  ${vt(m)}
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
          ${t.rankedLines.slice(0,3).map(({line:r,score:l,worstGap:o,alertCount:d,severeLateCount:m,attentionReasons:u})=>`
            <div class="system-ranking-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${r.color};">${r.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${r.name}</p>
                  <p class="headway-chart-copy">${n.language==="zh-CN"?`评分 ${l}${o?` · 最大间隔 ${o} 分钟`:""}${d?` · ${d} 条告警`:""}${m?` · ${m} 辆严重晚点`:""}`:`Score ${l}${o?` · gap ${o} min`:""}${d?` · ${d} alert${d===1?"":"s"}`:""}${m?` · ${m} severe late`:""}`}</p>
                  ${vt(u)}
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
  `}function Bn(e){const t=e.flatMap(l=>l.exceptions.map(o=>({tone:o.tone,copy:`${l.line.name}: ${o.copy}`,lineColor:l.line.color})));if(!t.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${n.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">${n.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span>
        </div>
      </section>
    `;const a=qn(),i=Math.ceil(t.length/a),s=n.insightsTickerIndex%i,r=t.slice(s*a,s*a+a);return`
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
  `}function qn(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);return i>=1680?3:i>=980?2:1}function Fn(e,t,a,i,s){const r=a.length+i.length;if(!r)return"";const{nbGaps:l,sbGaps:o}=ge(a,i),d=xe([...a,...i]),m=[...l,...o].length?Math.max(...l,...o):null,u=On(a,i),p=aa(e,a,i,s),g=new Set(s.flatMap(v=>v.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"运营中":"In Service"}</p>
          <p class="metric-chip-value">${r}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"准点率":"On-Time Rate"}</p>
          <p class="metric-chip-value">${Nt(d.onTime,r)}</p>
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
        ${ht(D("▲",t,{includeSymbol:!0}),l,a.length)}
        ${ht(D("▼",t,{includeSymbol:!0}),o,i.length)}
      </div>
      ${_n(d,r)}
      <div class="flow-grid">
        ${ft(n.language==="zh-CN"?`${D("▲",t,{includeSymbol:!0})} 流向`:`${D("▲",t,{includeSymbol:!0})} flow`,a,t,e.color)}
        ${ft(n.language==="zh-CN"?`${D("▼",t,{includeSymbol:!0})} 流向`:`${D("▼",t,{includeSymbol:!0})} flow`,i,t,e.color)}
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
  `}function ia(e,t=!1){const a=Date.now(),i=o=>{const d=o.arrivalTime,m=Math.floor((d-a)/1e3),u=A(m),p=da(o.arrivalTime,o.scheduleDeviation??0),g=Ye(p);let v="";if(o.distanceFromStop>0){const f=o.distanceFromStop>=1e3?`${(o.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(o.distanceFromStop)}m`,T=c("stopAway",o.numberOfStopsAway);v=` • ${f} • ${T}`}return`
      <div class="arrival-item" data-arrival-time="${o.arrivalTime}" data-schedule-deviation="${o.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${o.lineColor};">${o.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${o.lineName} ${L()} ${o.vehicleId}</span>
            <span class="arrival-destination">${c("toDestination",o.destination)}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${g}">${p}</span>
          <span class="arrival-time">
            <span class="arrival-countdown">${u}</span>
            <span class="arrival-precision">${v}</span>
          </span>
        </span>
      </div>
    `},s=fe("▲",e.nb),r=fe("▼",e.sb);if(t){lt.innerHTML="",ct.innerHTML="",Q.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,J.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,Pe();return}const l=(o,d,m)=>{if(!o.length){d.innerHTML="",m.innerHTML=`<div class="arrival-item muted">${c("noUpcomingVehicles",S().toLowerCase())}</div>`;return}const u=n.dialogDisplayMode?o.slice(0,2):[],p=n.dialogDisplayMode?o.slice(2):o;d.innerHTML=u.map(i).join(""),m.innerHTML=p.length?p.map(i).join(""):n.dialogDisplayMode?`<div class="arrival-item muted">${c("noAdditionalVehicles",S().toLowerCase())}</div>`:""};l(e.nb,lt,Q),l(e.sb,ct,J),zt.textContent=W("▲",s,{includeSymbol:!0}),Ot.textContent=W("▼",r,{includeSymbol:!0}),Pe()}function ee(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const i=new Set;for(const r of a){const l=r.startsWith(`${t.agencyId}_`)?r:`${t.agencyId}_${r}`;i.add(l)}const s=e.id.replace(/-T\d+$/,"");return i.add(s.startsWith(`${t.agencyId}_`)?s:`${t.agencyId}_${s}`),[...i]}function ae(e){const t=n.lines.map(a=>{const i=a.stops.find(s=>s.id===e.id);return i?{line:a,station:i}:null}).filter(Boolean);return t.length>0?t:n.lines.map(a=>{const i=a.stops.find(s=>s.name===e.name);return i?{line:a,station:i}:null}).filter(Boolean)}function Hn(e){if(!e)return null;const t=e.trim().toLowerCase();for(const a of n.lines)for(const i of a.stops){const s=new Set([i.id,`${a.agencyId}_${i.id}`,i.name,me(i.name),ce(i.name),ce(me(i.name))]);for(const r of a.stationAliases?.[i.id]??[])s.add(r),s.add(`${a.agencyId}_${r}`),s.add(ce(r));if([...s].some(r=>String(r).toLowerCase()===t))return i}return null}function Un(e){const t=new URL(window.location.href);t.searchParams.set("station",ce(e.name)),window.history.pushState({},"",t)}function sa(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function $t(e){const t=new URL(window.location.href);e===j?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function ra(){const t=new URL(window.location.href).searchParams.get("system");return t&&n.systemsById.has(t)?t:j}function Ve(e){n.dialogDisplayMode=e,b.classList.toggle("is-display-mode",e),Z.textContent=c(e?"exit":"board"),Z.setAttribute("aria-label",c(e?"exit":"board")),n.dialogDisplayDirection="both",n.dialogDisplayAutoPhase="nb",Ge(),b.open&&n.currentDialogStation&&Xe(n.currentDialogStation).catch(console.error),$e(),Pe()}function Vn(){Ve(!n.dialogDisplayMode)}function We(){n.dialogDisplayDirectionTimer&&(window.clearInterval(n.dialogDisplayDirectionTimer),n.dialogDisplayDirectionTimer=0)}function oa(){n.dialogDisplayDirectionAnimationTimer&&(window.clearTimeout(n.dialogDisplayDirectionAnimationTimer),n.dialogDisplayDirectionAnimationTimer=0),n.dialogDisplayAnimatingDirection="",_t?.classList.remove("is-direction-animating"),Pt?.classList.remove("is-direction-animating")}function Wn(e){if(!n.dialogDisplayMode||!e||e==="both")return;oa(),n.dialogDisplayAnimatingDirection=e;const t=e==="nb"?_t:Pt;t&&(t.offsetWidth,t.classList.add("is-direction-animating"),n.dialogDisplayDirectionAnimationTimer=window.setTimeout(()=>{t.classList.remove("is-direction-animating"),n.dialogDisplayDirectionAnimationTimer=0,n.dialogDisplayAnimatingDirection===e&&(n.dialogDisplayAnimatingDirection="")},Ea))}function Ge({animate:e=!1}={}){We(),oa();const t=n.dialogDisplayDirection,a=t==="auto"?n.dialogDisplayAutoPhase:t;Rt.forEach(i=>{i.classList.toggle("is-active",i.dataset.dialogDirection===t)}),b.classList.toggle("show-nb-only",n.dialogDisplayMode&&a==="nb"),b.classList.toggle("show-sb-only",n.dialogDisplayMode&&a==="sb"),e&&Wn(a),n.dialogDisplayMode&&t==="auto"&&(n.dialogDisplayDirectionTimer=window.setInterval(()=>{n.dialogDisplayAutoPhase=n.dialogDisplayAutoPhase==="nb"?"sb":"nb",Ge({animate:!0})},ka))}function je(){n.dialogRefreshTimer&&(window.clearTimeout(n.dialogRefreshTimer),n.dialogRefreshTimer=0)}function Ke(){n.dialogDisplayTimer&&(window.clearInterval(n.dialogDisplayTimer),n.dialogDisplayTimer=0)}function Ie(e,t){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(e.style.transform="translateY(0)",!n.dialogDisplayMode||a.length<=3)return;const i=Number.parseFloat(window.getComputedStyle(e).rowGap||"0")||0,s=a[0].getBoundingClientRect().height+i,r=Math.max(0,a.length-3),l=Math.min(n.dialogDisplayIndexes[t],r);e.style.transform=`translateY(-${l*s}px)`}function Pe(){Ke(),n.dialogDisplayIndexes={nb:0,sb:0},Ie(Q,"nb"),Ie(J,"sb"),n.dialogDisplayMode&&(n.dialogDisplayTimer=window.setInterval(()=>{for(const[e,t]of[["nb",Q],["sb",J]]){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const i=Math.max(0,a.length-3);n.dialogDisplayIndexes[e]=n.dialogDisplayIndexes[e]>=i?0:n.dialogDisplayIndexes[e]+1,Ie(t,e)}},Na))}function Gn(){if(!b.open)return;b.querySelectorAll(".arrival-item[data-arrival-time]").forEach(t=>{const a=Number(t.dataset.arrivalTime),i=Number(t.dataset.scheduleDeviation||0),s=t.querySelector(".arrival-countdown"),r=t.querySelector(".arrival-status");if(!s||!r)return;s.textContent=A(Math.floor((a-Date.now())/1e3));const l=da(a,i),o=Ye(l);r.textContent=l,r.className=`arrival-status arrival-status-${o}`})}function jn(){if(je(),!n.currentDialogStation)return;const e=()=>{n.dialogRefreshTimer=window.setTimeout(async()=>{!b.open||!n.currentDialogStation||(await Xe(n.currentDialogStation).catch(console.error),e())},Ma)};e()}function la(){n.currentDialogStationId="",n.currentDialogStation=null,b.open?b.close():(je(),Ke(),We(),Ve(!1),sa())}async function bt(){const e=ra();e!==n.activeSystemId&&await $a(e,{updateUrl:!1,preserveDialog:!1});const t=new URL(window.location.href).searchParams.get("station"),a=Hn(t);n.isSyncingFromUrl=!0;try{if(!a){n.currentDialogStationId="",b.open&&b.close();return}if(n.activeTab="map",I(),n.currentDialogStationId===a.id&&b.open)return;await ma(a,!1)}finally{n.isSyncingFromUrl=!1}}function Kn(e,t){const a=t.directionLookup?.[e.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const i=e.tripHeadsign??"",s=i.toLowerCase();return t.nbTerminusPrefix&&s.startsWith(t.nbTerminusPrefix)?"nb":t.sbTerminusPrefix&&s.startsWith(t.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(i)?"nb":/Federal Way|South Bellevue/i.test(i)?"sb":""}function ca(e){return e.routeKey??`${e.agencyId}_${e.id}`}function Yn(e){const t=e.tripHeadsign?.trim();return t?me(t.replace(/^to\s+/i,"")):c("terminalFallback")}function da(e,t){return Math.floor((e-Date.now())/1e3)<=90?"ARR":t>=120?"DELAY":n.language==="zh-CN"?"准点":"ON TIME"}function Ye(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}async function Xn(e){const t=`${Lt}/arrivals-and-departures-for-stop/${e}.json?key=${qe}&minutesAfter=120`,a=await Qt(t,"Arrivals");if(a.code!==200)throw new Error(a.text||`Arrivals request failed for ${e}`);return a.data?.entry?.arrivalsAndDepartures??[]}async function Be(e){const t=[...new Set(e)],a=[],i=[];for(let s=0;s<t.length;s+=Le){const r=t.slice(s,s+Le),l=await Promise.allSettled(r.map(o=>Xn(o)));a.push(...l),it>0&&s+Le<t.length&&await k(it)}for(const s of a)s.status==="fulfilled"&&i.push(...s.value);return i}function ua(e,t,a=null){const i=Date.now(),s=new Set,r={nb:[],sb:[]},l=a?new Set(a):null;for(const o of e){if(o.routeId!==ca(t)||l&&!l.has(o.stopId))continue;const d=o.predictedArrivalTime||o.scheduledArrivalTime;if(!d||d<=i)continue;const m=Kn(o,t);if(!m)continue;const u=`${o.tripId}:${o.stopId}:${d}`;s.has(u)||(s.add(u),r[m].push({vehicleId:(o.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:d,destination:Yn(o),scheduleDeviation:o.scheduleDeviation??0,tripId:o.tripId,lineColor:t.color,lineName:t.name,lineToken:t.name[0],distanceFromStop:o.distanceFromStop??0,numberOfStopsAway:o.numberOfStopsAway??0}))}return r.nb.sort((o,d)=>o.arrivalTime-d.arrivalTime),r.sb.sort((o,d)=>o.arrivalTime-d.arrivalTime),r.nb=r.nb.slice(0,4),r.sb=r.sb.slice(0,4),r}async function Zn(e,t,a=null){const i=`${n.activeSystemId}:${t.id}:${e.id}`,s=n.arrivalsCache.get(i);if(s&&Date.now()-s.fetchedAt<Ia)return s.value;const r=ee(e,t),l=a??await Be(r),o=ua(l,t,r);return n.arrivalsCache.set(i,{fetchedAt:Date.now(),value:o}),o}function Qn(e){const t={nb:[],sb:[]};for(const a of e)t.nb.push(...a.nb),t.sb.push(...a.sb);return t.nb.sort((a,i)=>a.arrivalTime-i.arrivalTime),t.sb.sort((a,i)=>a.arrivalTime-i.arrivalTime),t}function pa(e){const t=bn(e);if(!t.length){K.innerHTML="",K.hidden=!0;return}K.hidden=!1,K.innerHTML=`
    <div class="station-alerts">
      ${t.map((a,i)=>`
        <button class="station-alert-pill" data-alert-idx="${i}" type="button">
          <span class="station-alert-pill-meta">${Mt(a.severity)} · ${Dt(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||c("serviceAlert")}</span>
        </button>
      `).join("")}
    </div>
  `,K.querySelectorAll(".station-alert-pill").forEach(a=>{const i=t[Number(a.dataset.alertIdx)];i&&a.addEventListener("click",()=>{const s=n.lines.find(r=>i.lineIds.includes(r.id));s&&fa(s)})})}async function ma(e,t=!0){ha(e.name),fn(e),n.currentDialogStationId=e.id,n.currentDialogStation=e,pa(e),Y([],!0),ia({nb:[],sb:[]},!0),t&&Un(e),b.showModal(),$e(),jn(),await Xe(e)}async function Xe(e){const t=n.activeDialogRequest+1;n.activeDialogRequest=t;const a=()=>n.activeDialogRequest!==t||!b.open;try{const i=ae(e),s=i.flatMap(({station:o,line:d})=>ee(o,d)),r=await Be(s),l=await Promise.all(i.map(({station:o,line:d})=>Zn(o,d,r)));if(a())return;pa(e),ia(Qn(l))}catch(i){if(a())return;Y([],!1,e),Q.innerHTML=`<div class="arrival-item muted">${i.message}</div>`,J.innerHTML=`<div class="arrival-item muted">${n.language==="zh-CN"?"请稍后重试":"Retry in a moment"}</div>`;return}try{const i=si(e);if(!i.length){if(a())return;Y([],!1,e);return}if(await k(za),a())return;const s=i.flatMap(({stop:l,line:o})=>ee(l,o)),r=await Be(s);if(a())return;Y(ri(i,r),!1,e)}catch{if(a())return;Y([],!1,e)}}function Jn(e){const t=n.layouts.get(e.id),a=n.vehiclesByLine.get(e.id)??[],i=te(e.id),s=t.stations.map((o,d)=>{const m=t.stations[d-1],u=d>0?m.segmentMinutes:"",g=Xt(o,e).length>0,v=o.isTerminal?15:10;return`
        <g transform="translate(0, ${o.y})" class="station-group${g?" has-alert":""}" data-stop-id="${o.id}" style="cursor: pointer;">
          ${d>0?`<text x="0" y="-14" class="segment-time">${u}</text>
                 <line x1="18" x2="${t.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${t.trackX}" cy="0" r="${o.isTerminal?11:5}" class="${o.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${e.color};"></circle>
          ${o.isTerminal?`<text x="${t.trackX}" y="4" text-anchor="middle" class="terminal-mark">${e.name[0]}</text>`:""}
          ${g?`<circle cx="${t.trackX+v}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${t.labelX}" y="5" class="station-label">${o.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),r=a.map((o,d)=>{const m=ni(e.id,o.id);return`
        <g transform="translate(${t.trackX}, 0)" class="train" data-train-id="${o.id}">
          ${m.map((u,p)=>`
                <circle
                  cy="${u.y+(d%3-1)*1.5}"
                  r="${Math.max(3,7-p)}"
                  class="train-ghost-dot"
                  style="--line-color:${e.color}; --ghost-opacity:${Math.max(.18,.56-p*.1)};"
                ></circle>
              `).join("")}
          <g transform="translate(0, ${o.y+(d%3-1)*1.5})">
            <circle r="13" class="train-wave" style="--line-color:${e.color}; animation-delay:${d*.18}s;"></circle>
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${o.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${e.color};"></path>
          </g>
        </g>
      `}).join(""),l=L();return`
    <article class="line-card" data-line-id="${e.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <div class="line-title-copy">
            <div class="line-title-row">
              <h2>${e.name}</h2>
              ${Zt(i,e.id)}
            </div>
            <p>${c("liveCount",a.length,a.length===1?l.toLowerCase():S().toLowerCase())}</p>
            <p>${Fe(e)}</p>
          </div>
        </div>
        ${He(e)}
      </header>
      ${ea(e.color,a.map(o=>({...o,lineToken:e.name[0]})))}
      <svg viewBox="0 0 460 ${t.height}" class="line-diagram" role="img" aria-label="${n.language==="zh-CN"?`${e.name} 实时线路图`:`${e.name} live LED board`}">
        <line x1="${t.trackX}" x2="${t.trackX}" y1="${t.stations[0].y}" y2="${t.stations.at(-1).y}" class="spine" style="--line-color:${e.color};"></line>
        ${s}
        ${r}
      </svg>
    </article>
  `}function ei(){const e=ye().sort((l,o)=>l.minutePosition-o.minutePosition),t=L(),a=S(),i=a.toLowerCase();return e.length?(n.compactLayout?n.lines.filter(l=>l.id===n.activeLineId):n.lines).map(l=>{const o=e.filter(f=>f.lineId===l.id),d=te(l.id),m=[...o].sort((f,T)=>$(f.nextOffset??0)-$(T.nextOffset??0)),u=m[0]??null,p=m.slice(1),g=f=>`
        <span class="train-direction-badge">
          ${W(f.directionSymbol,X(f,n.layouts.get(f.lineId)),{includeSymbol:!0})}
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
              <p class="train-list-subtitle">${c("toDestination",X(f,n.layouts.get(f.lineId)))}</p>
              <p class="train-list-status ${G(f,$(f.nextOffset??0))}" data-vehicle-status="${f.id}">${Oe(f)}</p>
            </div>
          </div>
          <div class="train-queue-side">
            <p class="train-queue-time">${A($(f.nextOffset??0))}</p>
            <p class="train-queue-clock">${ze($(f.nextOffset??0))}</p>
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
                  ${Zt(d,l.id)}
                </div>
                <p>${c("inServiceCount",o.length,o.length===1?t.toLowerCase():S().toLowerCase())} · ${Fe(l)}</p>
              </div>
            </div>
            ${He(l)}
          </header>
          ${ea(l.color,o)}
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
                        <p class="train-focus-time">${A($(u.nextOffset??0))}</p>
                        <p class="train-focus-clock">${ze($(u.nextOffset??0))}</p>
                      </div>
                    </div>
                    <p class="train-focus-destination">${c("toDestination",X(u,n.layouts.get(u.lineId)))}</p>
                    <p class="train-focus-segment">${kn(u)}</p>
                    ${En(u)}
                    <p class="train-list-status ${G(u,$(u.nextOffset??0))}" data-vehicle-status="${u.id}">${Oe(u)}</p>
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
    `}function X(e,t){if(!t?.stations?.length)return e.upcomingLabel??e.toLabel??e.currentStopLabel??c("terminalFallback");const a=e.directionSymbol==="▲"?0:t.stations.length-1;return t.stations[a]?.label??e.upcomingLabel}function ga(e,t,a=6){if(!t?.stations?.length)return[];const i=e.directionSymbol==="▲"?-1:1,s=[],r=new Set,l=e.upcomingStopIndex??e.currentIndex,o=Math.max(0,e.nextOffset??0),d=(u,p,{isNext:g=!1,isTerminal:v=!1}={})=>{if(u==null||r.has(u))return;const f=t.stations[u];f&&(r.add(u),s.push({id:`${e.id}:${f.id}`,label:f.label,etaSeconds:Math.max(0,Math.round(p)),clockTime:ze(p),isNext:g,isTerminal:v}))};d(l,o,{isNext:!0});let m=o;for(let u=l+i;s.length<a&&!(u<0||u>=t.stations.length);u+=i){const p=u-i,g=t.stations[p];m+=Math.max(0,Math.round((g?.segmentMinutes??0)*60));const v=u===0||u===t.stations.length-1;d(u,m,{isTerminal:v})}return s}function ha(e){kt.textContent=e,sn.textContent=e,$e()}function $e(){const e=an;if(!e||!nn)return;const a=n.dialogDisplayMode&&b.open&&kt.scrollWidth>e.clientWidth;e.classList.toggle("is-marquee",a)}function ti(e){return Math.max(1,Math.round(e/Ra*60))}function ai(e,t){const a=Date.now(),i=new Set;for(const s of t){const r=`${e}:${s.id}`;i.add(r);const o=[...(n.vehicleGhosts.get(r)??[]).filter(d=>a-d.timestamp<=st),{y:s.y,minutePosition:s.minutePosition,timestamp:a}].slice(-6);n.vehicleGhosts.set(r,o)}for(const[s,r]of n.vehicleGhosts.entries()){if(!s.startsWith(`${e}:`))continue;const l=r.filter(o=>a-o.timestamp<=st);if(!i.has(s)||l.length===0){n.vehicleGhosts.delete(s);continue}l.length!==r.length&&n.vehicleGhosts.set(s,l)}}function ni(e,t){return(n.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}function ii(e,t){if(!e||!t.length)return"";const a=Math.max(...t.map(s=>s.distanceKm),Tt/2),i=82;return`
    <div class="transfer-radar">
      <svg viewBox="0 0 164 164" class="transfer-radar-svg" aria-hidden="true">
        <circle cx="${i}" cy="${i}" r="64" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="44" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="24" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="8" class="transfer-radar-core"></circle>
        ${t.map(s=>{const r=qa(e,s.stop),l=22+s.distanceKm/a*44,o=i+Math.sin(r*Math.PI/180)*l,d=i-Math.cos(r*Math.PI/180)*l;return`
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
  `}function si(e){if(!e)return[];const t=ae(e),a=new Set(t.map(({line:s,station:r})=>`${s.agencyId}:${s.id}:${r.id}`)),i=new Map;for(const s of n.systemsById.values())for(const r of s.lines??[])for(const l of r.stops??[]){if(a.has(`${r.agencyId}:${r.id}:${l.id}`))continue;const o=Ba(e.lat,e.lon,l.lat,l.lon);if(o>Tt)continue;const d=`${s.id}:${r.id}`,m=i.get(d);(!m||o<m.distanceKm)&&i.set(d,{systemId:s.id,systemName:s.name,line:r,stop:l,distanceKm:o,walkMinutes:ti(o)})}return[...i.values()].sort((s,r)=>s.distanceKm-r.distanceKm||s.line.name.localeCompare(r.line.name)).slice(0,Ct*2)}function Y(e,t=!1,a=n.currentDialogStation){if(t){F.hidden=!1,F.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">${c("transfers")}</h4>
          <p class="transfer-panel-copy">${c("checkingNearbyConnections")}</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">${c("loadingTransferRecommendations")}</div>
        </div>
      </div>
    `;return}if(!e.length){F.hidden=!0,F.innerHTML="";return}F.hidden=!1,F.innerHTML=`
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <h4 class="arrivals-title">${c("transfers")}</h4>
        <p class="transfer-panel-copy">${c("closestBoardableConnections")}</p>
      </div>
      ${ii(a,e)}
      <div class="transfer-list">
        ${e.map(i=>`
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${i.line.color};">${i.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${i.line.name} <span class="transfer-system-chip">${i.systemName}</span></p>
                    <p class="transfer-card-stop">${c("walkToStop",i.walkMinutes,i.stop.name)}</p>
                    <p class="transfer-card-meta">${mn(i.distanceKm)}${i.arrival?` • ${c("toDestination",i.arrival.destination)}`:""}</p>
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
  `}function ri(e,t){const a=Date.now(),i=[];for(const s of e){const r=ee(s.stop,s.line),l=ua(t,s.line,r),o=[...l.nb,...l.sb].sort((g,v)=>g.arrivalTime-v.arrivalTime);if(!o.length)continue;const d=a+s.walkMinutes*6e4+Oa,m=o.find(g=>g.arrivalTime>=d)??o[0],u=m.arrivalTime-a-s.walkMinutes*6e4,p=Math.max(0,Math.round(u/6e4));i.push({...s,arrival:m,boardAt:m.arrivalTime,badge:u<=0?c("leaveNow"):p<=1?c("boardInOneMinute"):c("boardInMinutes",p),tone:p<=2?"hot":p<=8?"good":"calm",timeText:pn(m.arrivalTime)})}return i.sort((s,r)=>s.boardAt-r.boardAt||s.distanceKm-r.distanceKm).slice(0,Ct)}function oi(){const e=ta(),t=_e(n.lines),a=L(),i=_e(e);return`
    ${Bn(i)}
    ${Pn(t)}
    ${i.map(({line:s,layout:r,vehicles:l,nb:o,sb:d,lineAlerts:m})=>{const u=Fn(s,r,o,d,m);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header line-card-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${s.color};">${s.name[0]}</span>
              <div class="line-title-copy">
                <h2>${s.name}</h2>
                <p>${c("liveCount",l.length,l.length===1?L().toLowerCase():S().toLowerCase())} · ${Fe(s)}</p>
              </div>
            </div>
            ${He(s)}
          </header>
          ${$n(s)}
          ${u||`<p class="train-readout muted">${n.language==="zh-CN"?`等待实时${a.toLowerCase()}数据…`:`Waiting for live ${a.toLowerCase()} data…`}</p>`}
        </article>
      `}).join("")}
  `}function li(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await $a(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function Ae(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{n.activeLineId=t.dataset.lineSwitch,I()})})}function Ze(){n.currentTrainId="",M.open&&M.close()}function Qe(){E.open&&E.close()}function fa(e){const t=te(e.id);Ht.textContent=c("affectedLineAlerts",e.name,t.length),Ut.textContent=c("activeAlerts",t.length),on.textContent=e.name,pt.textContent="",pt.innerHTML=t.length?t.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${Mt(a.severity)} • ${Dt(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||c("serviceAlert")}</p>
              <p class="alert-dialog-item-copy">${a.description||c("noAdditionalAlertDetails")}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">${c("readOfficialAlert")}</a></p>`:""}
            </article>
          `).join(""):`<p class="alert-dialog-item-copy">${c("noActiveAlerts")}</p>`,Ee.hidden=!0,Ee.removeAttribute("href"),E.open||E.showModal()}function St(){document.querySelectorAll("[data-alert-line-id]").forEach(t=>{t.addEventListener("click",()=>{const a=n.lines.find(i=>i.id===t.dataset.alertLineId);a&&fa(a)})})}function ci(e){const t=e.fromLabel!==e.toLabel&&e.progress>0&&e.progress<1,a=t?e.fromLabel:e.previousLabel,i=t?`${e.fromLabel} -> ${e.toLabel}`:e.currentStopLabel,s=t?"Between":"Now",r=t?e.toLabel:e.upcomingLabel,l=t?e.progress:.5,o=n.layouts.get(e.lineId),d=ga(e,o),m=o?X(e,o):e.upcomingLabel,u=d.at(-1)?.etaSeconds??Math.max(0,e.nextOffset??0),p=Wt(e.directionSymbol);Bt.textContent=`${e.lineName} ${L()} ${e.label}`,qt.textContent=n.language==="zh-CN"?`${p} · ${c("toDestination",m)}`:`${p} to ${m}`,ut.className=`train-detail-status train-list-status-${Ye(e.serviceStatus)}`,ut.innerHTML=H(Ue(e)),M.querySelector(".train-eta-panel")?.remove(),dt.innerHTML=`
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
  `,dt.insertAdjacentHTML("afterend",`
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
            <p class="metric-chip-value">${A(u)}</p>
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
                      <p class="train-eta-stop-countdown">${A(g.etaSeconds)}</p>
                      <p class="train-eta-stop-clock">${g.clockTime}</p>
                    </div>
                  </article>
                `).join(""):`<p class="train-readout muted">${c("noDownstreamEta")}</p>`}
        </div>
      </section>
    `),M.open||M.showModal()}function wt(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,i=ye().find(s=>s.id===a);i&&(n.currentTrainId=a,ci(i))})})}function di(){n.lines.forEach(e=>{const t=n.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.stopId,l=t.stations.find(o=>o.id===r);l&&ma(l)})})})}function I(){const e=V();if(document.documentElement.lang=n.language,Me.textContent=c("languageToggle"),Me.setAttribute("aria-label",c("languageToggleAria")),Ne.textContent=n.theme==="dark"?c("themeLight"):c("themeDark"),Ne.setAttribute("aria-label",c("themeToggleAria")),Qa.textContent=e.kicker,Ja.textContent=e.title,Te.setAttribute("aria-label",c("transitSystems")),en.setAttribute("aria-label",c("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",c("boardDirectionView")),zt.textContent=W("▲",fe("▲"),{includeSymbol:!0}),Ot.textContent=W("▼",fe("▼"),{includeSymbol:!0}),Z.textContent=n.dialogDisplayMode?c("exit"):c("board"),Z.setAttribute("aria-label",n.dialogDisplayMode?c("exit"):c("board")),Ft.setAttribute("aria-label",c("closeTrainDialog")),Vt.setAttribute("aria-label",c("closeAlertDialog")),b.open||(ha(c("station")),Et.textContent=c("serviceSummary")),M.open||(Bt.textContent=c("train"),qt.textContent=c("currentMovement")),E.open||(Ht.textContent=c("serviceAlert"),Ut.textContent=c("transitAdvisory")),Ee.textContent=c("readOfficialAlert"),Te.hidden=n.systemsById.size<2,Te.innerHTML=Rn(),va(),De.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===n.activeTab)),De.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=c("tabMap")),t.dataset.tab==="trains"&&(t.textContent=S()),t.dataset.tab==="insights"&&(t.textContent=c("tabInsights"))}),li(),n.activeTab==="map"){x.className="board";const t=ta();x.innerHTML=`${Ce()}${t.map(Jn).join("")}`,Ae(),St(),di(),wt(),queueMicrotask(ve);return}if(n.activeTab==="trains"){x.className="board",x.innerHTML=`${Ce()}${ei()}`,Ae(),St(),wt(),queueMicrotask(ve);return}n.activeTab==="insights"&&(x.className="board",x.innerHTML=`${Ce()}${oi()}`,Ae())}function ui(){window.clearInterval(n.insightsTickerTimer),n.insightsTickerTimer=0}function pi(){ui(),n.insightsTickerTimer=window.setInterval(()=>{n.insightsTickerIndex+=1,n.activeTab==="insights"&&I()},5e3)}function va(){ue.textContent=n.error?c("statusHold"):c("statusSync"),ue.classList.toggle("status-pill-error",!!n.error),tn.textContent=`${c("nowPrefix")} ${Re()}`,ke.textContent=n.error?n.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":un(n.fetchedAt),ot.textContent=ue.textContent,ot.classList.toggle("status-pill-error",!!n.error),rn.textContent=ke.textContent}function mi(){window.clearTimeout(n.liveRefreshTimer),n.liveRefreshTimer=0}function gi(){mi();const e=()=>{n.liveRefreshTimer=window.setTimeout(async()=>{await Je(),e()},Da)};e()}function ya(e){const t=n.systemsById.has(e)?e:j,a=n.systemsById.get(t);n.activeSystemId=t,n.lines=a?.lines??[],n.layouts=n.layoutsBySystem.get(t)??new Map,n.lines.some(i=>i.id===n.activeLineId)||(n.activeLineId=n.lines[0]?.id??""),n.vehiclesByLine=new Map,n.rawVehicles=[],n.arrivalsCache.clear(),n.alerts=[],n.error="",n.fetchedAt="",n.insightsTickerIndex=0,n.vehicleGhosts=new Map}async function $a(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!n.systemsById.has(e)||n.activeSystemId===e){t&&$t(n.activeSystemId);return}ya(e),a||la(),Ze(),Qe(),I(),t&&$t(e),await Je()}async function hi(){for(let a=0;a<=4;a+=1){let i=null,s=null;try{i=await fetch(Ca,{cache:"no-store"}),s=await i.json()}catch(l){if(a===4)throw l;await k(1e3*2**a);continue}if(!i.ok){if(a===4)throw new Error(`Static data load failed with ${i.status}`);await k(1e3*2**a);continue}const r=s.systems??[];n.systemsById=new Map(r.map(l=>[l.id,l])),n.layoutsBySystem=new Map(r.map(l=>[l.id,new Map(l.lines.map(o=>[o.id,Tn(o)]))])),ya(ra());return}}function fi(e){const t=[...new Set((e.allAffects??[]).map(i=>i.routeId).filter(Boolean))],a=n.lines.filter(i=>t.includes(ca(i))).map(i=>i.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??c("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(i=>i.stopId).filter(Boolean))]}:null}async function Je(){try{const e=await Qt(cn(),"Realtime");n.error="",n.fetchedAt=new Date().toISOString(),n.rawVehicles=e.data.list??[],n.alerts=(e.data.references?.situations??[]).map(fi).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(s=>[s.id,s]));for(const s of n.lines){const r=n.layouts.get(s.id),l=n.rawVehicles.map(o=>Mn(o,s,r,t)).filter(Boolean);n.vehiclesByLine.set(s.id,l),ai(s.id,l)}const a=na(_e(n.lines)),i=n.systemSnapshots.get(n.activeSystemId);n.systemSnapshots.set(n.activeSystemId,{previous:i?.current??null,current:a})}catch(e){n.error=c("realtimeOffline"),console.error(e)}I()}async function vi(){Kt(hn()),jt(gn()),gt(),await hi(),I(),await Je(),await bt(),window.addEventListener("popstate",()=>{bt().catch(console.error)});const e=()=>{const a=n.compactLayout;if(gt(),$e(),a!==n.compactLayout){I();return}ve()};window.addEventListener("resize",e),window.visualViewport?.addEventListener("resize",e),new ResizeObserver(()=>{ve()}).observe(x),gi(),pi(),window.setInterval(()=>{va(),Gn(),Dn()},1e3)}vi().catch(e=>{ue.textContent=c("statusFail"),ke.textContent=e.message});
