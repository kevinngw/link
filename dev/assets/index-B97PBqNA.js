(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=a(i);fetch(i.href,o)}})();const kt="modulepreload",Et=function(e){return"/link/dev/"+e},je={},Rt=function(t,a,n){let i=Promise.resolve();if(a&&a.length>0){let b=function(y){return Promise.all(y.map(u=>Promise.resolve(u).then(D=>({status:"fulfilled",value:D}),D=>({status:"rejected",reason:D}))))};var l=b;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),m=d?.nonce||d?.getAttribute("nonce");i=b(a.map(y=>{if(y=Et(y),y in je)return;je[y]=!0;const u=y.endsWith(".css"),D=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${y}"]${D}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":kt,u||(h.as="script"),h.crossOrigin="",h.href=y,m&&h.setAttribute("nonce",m),document.head.appendChild(h),u)return new Promise((S,N)=>{h.addEventListener("load",S),h.addEventListener("error",()=>N(new Error(`Unable to preload CSS for ${y}`)))})}))}function o(d){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=d,window.dispatchEvent(m),!m.defaultPrevented)throw d}return i.then(d=>{for(const m of d||[])m.status==="rejected"&&o(m.reason);return t().catch(o)})};function zt(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:i,onRegisteredSW:o,onRegisterError:l}=e;let d,m;const b=async(u=!0)=>{await m};async function y(){if("serviceWorker"in navigator){if(d=await Rt(async()=>{const{Workbox:u}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:u}},[]).then(({Workbox:u})=>new u("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(u=>{l?.(u)}),!d)return;d.addEventListener("activated",u=>{(u.isUpdate||u.isExternal)&&window.location.reload()}),d.addEventListener("installed",u=>{u.isUpdate||n?.()}),d.register({immediate:t}).then(u=>{o?o("/link/dev/sw.js",u):i?.(u)}).catch(u=>{l?.(u)})}}return m=y(),b}const Ot="./pulse-data.json",Bt="https://api.pugetsound.onebusaway.org/api/where",st="TEST".trim()||"TEST",Le=st==="TEST",Ye=3,Ke=800,Pt=Le?2e4:5e3,Xe=Le?12e4:3e4,qt=1100,_t=Le?45e3:15e3,Ut=Le?9e4:3e4,Ht=4e3,Ft=15e3,Vt=520,Ze=4*6e4,ot="link-pulse-theme",rt="link-pulse-language",te="link",ye={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},Je={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}};function Gt(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function Wt(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function se(e,t,a){return Math.max(t,Math.min(e,a))}function ce(e){return new Promise(t=>window.setTimeout(t,e))}function Ne(e){const[t="0",a="0",n="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(n)}function jt(e,t){if(!e)return t("waitingSnapshot");const a=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return a<10?t("updatedNow"):a<60?t("updatedSecondsAgo",a):t("updatedMinutesAgo",Math.round(a/60))}function Yt(e){return new Intl.DateTimeFormat(e==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:e!=="zh-CN"}).format(new Date)}function Kt(e,t,a){if(e<=0)return a("arriving");const n=Math.floor(e/60),i=e%60;return t==="zh-CN"?n>0?`${n}分 ${i}秒`:`${i}秒`:n>0?`${n}m ${i}s`:`${i}s`}function Xt(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function fe(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function ie(e,t){if(!e||!t)return null;const[a,n,i]=e.split("-").map(Number),o=Ne(t),l=Math.floor(o/3600),d=Math.floor(o%3600/60),m=o%60;return new Date(a,n-1,i,l,d,m)}function Zt(e,t){const a=Math.max(0,Math.round(e/6e4)),n=Math.floor(a/60),i=a%60;return t==="zh-CN"?n&&i?`${n}小时${i}分钟`:n?`${n}小时`:`${i}分钟`:n&&i?`${n}h ${i}m`:n?`${n}h`:`${i}m`}function Jt(e,t){if(!e)return"";const[a="0",n="0"]=String(e).split(":"),i=Number(a),o=Number(n),l=(i%24+24)%24;if(t==="zh-CN")return`${String(l).padStart(2,"0")}:${String(o).padStart(2,"0")}`;const d=l>=12?"PM":"AM";return`${l%12||12}:${String(o).padStart(2,"0")} ${d}`}function Qt(e,t){return new Date(e).toLocaleTimeString(t==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:t!=="zh-CN"})}function ea(e,t){return Qt(Date.now()+Math.max(0,e)*1e3,t)}function ta(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function aa(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function ia(e,t){const a=[...e].sort((o,l)=>o.minutePosition-l.minutePosition),n=[...t].sort((o,l)=>o.minutePosition-l.minutePosition),i=o=>o.slice(1).map((l,d)=>Math.round(l.minutePosition-o[d].minutePosition));return{nbGaps:i(a),sbGaps:i(n)}}function na(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((i,o)=>i+o,0)/e.length,a=Math.max(...e),n=Math.min(...e);return{avg:Math.round(t),max:a,min:n,spread:a-n,ratio:a/Math.max(n,1)}}function sa(e,t){const a=na(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let n="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?n="bunched":a.max>=12||a.spread>=6?n="uneven":a.avg>=18&&(n="sparse"),{health:n,stats:a}}function oa(e){return e.reduce((t,a)=>{const n=Number(a.scheduleDeviation??0);return n<=60?t.onTime+=1:n<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function ra(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function la({worstGap:e,severeLateCount:t,alertCount:a,balanceDelta:n,language:i}){const o=[];return e>=12&&o.push({key:"gap",tone:"alert",label:i==="zh-CN"?"大间隔":"Large gap"}),t>0&&o.push({key:"late",tone:"warn",label:i==="zh-CN"?"严重晚点":"Severe late"}),a>0&&o.push({key:"alert",tone:"info",label:i==="zh-CN"?"有告警":"Alerted"}),n>=2&&o.push({key:"balance",tone:"warn",label:i==="zh-CN"?"方向失衡":"Imbalanced"}),o.length||o.push({key:"healthy",tone:"healthy",label:i==="zh-CN"?"健康":"Healthy"}),o}function ca(e){function t(){const o=Math.max(0,e.obaRateLimitStreak-1),l=Math.min(Xe,Pt*2**o),d=Math.round(l*(.15+Math.random()*.2));return Math.min(Xe,l+d)}async function a(){const o=e.obaCooldownUntil-Date.now();o>0&&await ce(o)}function n(o){return o?.code===429||/rate limit/i.test(o?.text??"")}async function i(o,l){for(let d=0;d<=Ye;d+=1){await a();let m=null,b=null,y=null;try{m=await fetch(o,{cache:"no-store"})}catch(h){y=h}if(m!==null)try{b=await m.json()}catch{b=null}const u=m?.status===429||n(b);if(m?.ok&&!u)return e.obaRateLimitStreak=0,e.obaCooldownUntil=0,b;const D=y!=null||m!=null&&(m.status===429||m.status>=500&&m.status<600);if(d===Ye||!D)throw y||(b?.text?new Error(b.text):new Error(`${l} request failed with ${m?.status??"network error"}`));if(u){e.obaRateLimitStreak+=1;const h=Ke*2**d,S=Math.max(h,t());e.obaCooldownUntil=Date.now()+S,await ce(S)}else{const h=Ke*2**d;await ce(h)}}throw new Error(`${l} request failed`)}return{fetchJsonWithRetry:i,isRateLimitedPayload:n,waitForObaCooldown:a}}function da(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}function ua(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function ga(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase(),n=t.nextStopTimeOffset??0,i=t.scheduleDeviation??0,o=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||o&&Math.abs(n)<=90?"ARR":i>=120?"DELAY":"OK"}function pa(e,t,{language:a,copyValue:n}){if(!t)return{text:n("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:n("onTime"),colorClass:"status-ontime"};if(e>60){const i=Math.round(e/60);let o="status-late-minor";return e>600?o="status-late-severe":e>300&&(o="status-late-moderate"),{text:a==="zh-CN"?`晚点 ${i} 分钟`:`+${i} min late`,colorClass:o}}if(e<-60){const i=Math.round(Math.abs(e)/60);return{text:a==="zh-CN"?`早到 ${i} 分钟`:`${i} min early`,colorClass:"status-early"}}return{text:n("unknown"),colorClass:"status-muted"}}function ma(e,t,a,n,{language:i,copyValue:o}){const l=e.tripStatus?.activeTripId??e.tripId??"",d=n.get(l);if(!d||d.routeId!==t.routeKey)return null;const m=e.tripStatus?.closestStop,b=e.tripStatus?.nextStop,y=a.stationIndexByStopId.get(m),u=a.stationIndexByStopId.get(b);if(y==null&&u==null)return null;let D=y??u,h=u??y;if(D>h){const p=D;D=h,h=p}const S=a.stations[D],N=a.stations[h],M=e.tripStatus?.closestStopTimeOffset??0,F=e.tripStatus?.nextStopTimeOffset??0,H=d.directionId==="1"?"▲":d.directionId==="0"?"▼":ua(y,u);let O=0;D!==h&&M<0&&F>0&&(O=se(Math.abs(M)/(Math.abs(M)+F),0,1));const k=S.y+(N.y-S.y)*O,B=D!==h?S.segmentMinutes:0,U=S.cumulativeMinutes+B*O,R=y??u??D,P=a.stations[R]??S,W=H==="▲",K=se(R+(W?1:-1),0,a.stations.length-1),E=y!=null&&u!=null&&y!==u?u:se(R+(W?-1:1),0,a.stations.length-1),V=a.stations[K]??P,A=a.stations[E]??N,v=e.tripStatus?.scheduleDeviation??0,w=e.tripStatus?.predicted??!1,z=pa(v,w,{language:i,copyValue:o});return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:H,fromLabel:S.label,minutePosition:U,progress:O,serviceStatus:ga(e),toLabel:N.label,y:k,currentLabel:S.label,nextLabel:N.label,previousLabel:V.label,currentStopLabel:P.label,upcomingLabel:A.label,currentIndex:R,upcomingStopIndex:E,status:e.tripStatus?.status??"",closestStop:m,nextStop:b,closestOffset:M,nextOffset:F,scheduleDeviation:v,isPredicted:w,delayInfo:z,rawVehicle:e}}function ha(e){const{state:t,getAlertsForLine:a,getAlertsForStation:n,getTodayServiceSpan:i,getVehicleGhostTrail:o,getVehicleLabel:l,getVehicleLabelPlural:d,copyValue:m,renderInlineAlerts:b,renderLineStatusMarquee:y,renderServiceReminderChip:u}=e;function D(h){const S=t.layouts.get(h.id),N=t.vehiclesByLine.get(h.id)??[],M=a(h.id),F=S.stations.map((k,B)=>{const U=S.stations[B-1],R=B>0?U.segmentMinutes:"",W=n(k,h).length>0,K=k.isTerminal?15:10;return`
          <g transform="translate(0, ${k.y})" class="station-group${W?" has-alert":""}" data-stop-id="${k.id}" style="cursor: pointer;">
            ${B>0?`<text x="0" y="-14" class="segment-time">${R}</text>
                   <line x1="18" x2="${S.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
            <circle cx="${S.trackX}" cy="0" r="${k.isTerminal?11:5}" class="${k.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${h.color};"></circle>
            ${k.isTerminal?`<text x="${S.trackX}" y="4" text-anchor="middle" class="terminal-mark">${h.name[0]}</text>`:""}
            ${W?`<circle cx="${S.trackX+K}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
            <text x="${S.labelX}" y="5" class="station-label">${k.label}</text>
            <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
          </g>
        `}).join(""),H=N.map((k,B)=>{const U=o(h.id,k.id);return`
          <g transform="translate(${S.trackX}, 0)" class="train" data-train-id="${k.id}">
            ${U.map((R,P)=>`
                  <circle
                    cy="${R.y+(B%3-1)*1.5}"
                    r="${Math.max(3,7-P)}"
                    class="train-ghost-dot"
                    style="--line-color:${h.color}; --ghost-opacity:${Math.max(.18,.56-P*.1)};"
                  ></circle>
                `).join("")}
            <g transform="translate(0, ${k.y+(B%3-1)*1.5})">
              <circle r="13" class="train-wave" style="--line-color:${h.color}; animation-delay:${B*.18}s;"></circle>
              <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${k.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${h.color};"></path>
            </g>
          </g>
        `}).join(""),O=l();return`
      <article class="line-card" data-line-id="${h.id}">
        <header class="line-card-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:${h.color};">${h.name[0]}</span>
            <div class="line-title-copy">
              <div class="line-title-row">
                <h2>${h.name}</h2>
                ${b(M,h.id)}
              </div>
              <p>${m("liveCount",N.length,N.length===1?O.toLowerCase():d().toLowerCase())}</p>
              <p>${i(h)}</p>
            </div>
          </div>
          ${u(h)}
        </header>
        ${y(h.color,N.map(k=>({...k,lineToken:h.name[0]})))}
        <svg viewBox="0 0 460 ${S.height}" class="line-diagram" role="img" aria-label="${t.language==="zh-CN"?`${h.name} 实时线路图`:`${h.name} live LED board`}">
          <line x1="${S.trackX}" x2="${S.trackX}" y1="${S.stations[0].y}" y2="${S.stations.at(-1).y}" class="spine" style="--line-color:${h.color};"></line>
          ${F}
          ${H}
        </svg>
      </article>
    `}return{renderLine:D}}function fa(e){const{state:t,copyValue:a,formatArrivalTime:n,formatDirectionLabel:i,formatEtaClockFromNow:o,formatVehicleLocationSummary:l,getAlertsForLine:d,getAllVehicles:m,getRealtimeOffset:b,getTodayServiceSpan:y,getVehicleDestinationLabel:u,getVehicleLabel:D,getVehicleLabelPlural:h,getVehicleStatusClass:S,renderFocusMetrics:N,renderInlineAlerts:M,renderLineStatusMarquee:F,renderServiceReminderChip:H,formatVehicleStatus:O}=e;function k(){const B=m().sort((E,V)=>E.minutePosition-V.minutePosition),U=D(),R=h(),P=R.toLowerCase();return B.length?(t.compactLayout?t.lines.filter(E=>E.id===t.activeLineId):t.lines).map(E=>{const V=B.filter(c=>c.lineId===E.id),A=d(E.id),v=[...V].sort((c,$)=>b(c.nextOffset??0)-b($.nextOffset??0)),w=v[0]??null,z=v.slice(1),p=c=>`
          <span class="train-direction-badge">
            ${i(c.directionSymbol,u(c,t.layouts.get(c.lineId)),{includeSymbol:!0})}
          </span>
        `,r=c=>`
          <article class="train-list-item train-queue-item" data-train-id="${c.id}">
            <div class="train-list-main">
              <span class="line-token train-list-token" style="--line-color:${c.lineColor};">${c.lineToken}</span>
              <div>
                <div class="train-list-row">
                  <p class="train-list-title">${c.lineName} ${U} ${c.label}</p>
                  ${p(c)}
                </div>
                <p class="train-list-subtitle">${a("toDestination",u(c,t.layouts.get(c.lineId)))}</p>
                <p class="train-list-status ${S(c,b(c.nextOffset??0))}" data-vehicle-status="${c.id}">${O(c)}</p>
              </div>
            </div>
            <div class="train-queue-side">
              <p class="train-queue-time">${n(b(c.nextOffset??0))}</p>
              <p class="train-queue-clock">${o(b(c.nextOffset??0))}</p>
            </div>
          </article>
        `;return`
          <article class="line-card train-line-card">
            <header class="line-card-header train-list-section-header">
              <div class="line-title">
                <span class="line-token" style="--line-color:${E.color};">${E.name[0]}</span>
                <div class="line-title-copy">
                  <div class="line-title-row">
                    <h2>${E.name}</h2>
                    ${M(A,E.id)}
                  </div>
                  <p>${a("inServiceCount",V.length,V.length===1?U.toLowerCase():h().toLowerCase())} · ${y(E)}</p>
                </div>
              </div>
              ${H(E)}
            </header>
            ${F(E.color,V)}
            <div class="line-readout train-columns train-stack-layout">
              ${w?`
                    <article class="train-focus-card train-list-item" data-train-id="${w.id}">
                      <div class="train-focus-header">
                        <div>
                          <p class="train-focus-kicker">${t.language==="zh-CN"?"最近一班":"Next up"}</p>
                          <div class="train-list-row">
                            <p class="train-focus-title">${w.lineName} ${U} ${w.label}</p>
                            ${p(w)}
                          </div>
                        </div>
                        <div class="train-focus-side">
                          <p class="train-focus-time">${n(b(w.nextOffset??0))}</p>
                          <p class="train-focus-clock">${o(b(w.nextOffset??0))}</p>
                        </div>
                      </div>
                      <p class="train-focus-destination">${a("toDestination",u(w,t.layouts.get(w.lineId)))}</p>
                      <p class="train-focus-segment">${l(w)}</p>
                      ${N(w)}
                      <p class="train-list-status ${S(w,b(w.nextOffset??0))}" data-vehicle-status="${w.id}">${O(w)}</p>
                    </article>
                  `:`<p class="train-readout muted">${a("noLiveVehicles",h().toLowerCase())}</p>`}
              ${z.length?`
                    <div class="train-queue-list">
                      <p class="train-queue-heading">${t.language==="zh-CN"?"后续车次":"Following vehicles"}</p>
                      ${z.map(r).join("")}
                    </div>
                  `:""}
            </div>
          </article>
        `}).join(""):`
        <section class="board" style="grid-template-columns: 1fr;">
          <article class="panel-card">
            <h2>${a("activeVehicles",R)}</h2>
            <p>${a("noLiveVehicles",P)}</p>
          </article>
        </section>
      `}return{renderTrainList:k}}function va(e){const{state:t,classifyHeadwayHealth:a,computeLineHeadways:n,copyValue:i,formatCurrentTime:o,formatLayoutDirectionLabel:l,formatPercent:d,getActiveSystemMeta:m,getAlertsForLine:b,getDelayBuckets:y,getLineAttentionReasons:u,getInsightsTickerPageSize:D,getRealtimeOffset:h,getTodayServiceSpan:S,getVehicleLabel:N,getVehicleLabelPlural:M,renderServiceReminderChip:F,renderServiceTimeline:H}=e;function O(p,r){if(!p.length||r<2)return{averageText:"—",detailText:t.language==="zh-CN"?`${M()}数量不足，无法判断间隔`:`Too few ${M().toLowerCase()} for a spacing read`};const c=Math.round(p.reduce((T,L)=>T+L,0)/p.length),$=Math.min(...p),f=Math.max(...p);return{averageText:`~${c} min`,detailText:t.language==="zh-CN"?`观测间隔 ${$}-${f} 分钟`:`${$}-${f} min observed gap`}}function k(p,r,c){const{averageText:$,detailText:f}=O(r,c);return`
      <div class="headway-health-card">
        <p class="headway-health-label">${p}</p>
        <p class="headway-health-value">${$}</p>
        <p class="headway-health-copy">${f}</p>
      </div>
    `}function B(p,r){return Math.abs(p.length-r.length)<=1?{label:t.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:p.length>r.length?{label:t.language==="zh-CN"?"北向偏多":"Northbound heavier",tone:"warn"}:{label:t.language==="zh-CN"?"南向偏多":"Southbound heavier",tone:"warn"}}function U(p,r){return`
      <div class="delay-distribution">
        ${[[t.language==="zh-CN"?"准点":"On time",p.onTime,"healthy"],[t.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",p.minorLate,"warn"],[t.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",p.severeLate,"alert"]].map(([$,f,T])=>`
          <div class="delay-chip delay-chip-${T}">
            <p class="delay-chip-label">${$}</p>
            <p class="delay-chip-value">${f}</p>
            <p class="delay-chip-copy">${d(f,r)}</p>
          </div>
        `).join("")}
      </div>
    `}function R(p,r,c,$){if(!r.length)return`
        <div class="flow-lane">
          <div class="flow-lane-header">
            <p class="flow-lane-title">${p}</p>
            <p class="flow-lane-copy">${i("noLiveVehicles",M().toLowerCase())}</p>
          </div>
        </div>
      `;const f=[...r].sort((L,x)=>L.minutePosition-x.minutePosition),T=f.map(L=>{const x=c.totalMinutes>0?L.minutePosition/c.totalMinutes:0;return Math.max(0,Math.min(100,x*100))});return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${p}</p>
          <p class="flow-lane-copy">${i("liveCount",f.length,f.length===1?N().toLowerCase():M().toLowerCase())}</p>
        </div>
        <div class="flow-track" style="--line-color:${$};">
          ${T.map((L,x)=>`
            <span
              class="flow-vehicle"
              style="left:${L}%; --line-color:${$};"
              title="${f[x].label}"
            ></span>
          `).join("")}
        </div>
      </div>
    `}function P(p,r,c,$){const f=[],T=t.layouts.get(p.id),L=l("▲",T,{includeSymbol:!0}),x=l("▼",T,{includeSymbol:!0}),{stats:I}=a(n(r,[]).nbGaps,r.length),{stats:q}=a(n([],c).sbGaps,c.length),G=[...r,...c].filter(Q=>Number(Q.scheduleDeviation??0)>300),J=Math.abs(r.length-c.length);return I.max!=null&&I.max>=12&&f.push({tone:"alert",copy:t.language==="zh-CN"?`${L} 当前有 ${I.max} 分钟的服务空档。`:`${L} has a ${I.max} min service hole right now.`}),q.max!=null&&q.max>=12&&f.push({tone:"alert",copy:t.language==="zh-CN"?`${x} 当前有 ${q.max} 分钟的服务空档。`:`${x} has a ${q.max} min service hole right now.`}),J>=2&&f.push({tone:"warn",copy:r.length>c.length?t.language==="zh-CN"?`车辆分布向 ${L} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${L} by ${J}.`:t.language==="zh-CN"?`车辆分布向 ${x} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${x} by ${J}.`}),G.length&&f.push({tone:"warn",copy:t.language==="zh-CN"?`${G.length} 辆${G.length===1?N().toLowerCase():M().toLowerCase()}晚点超过 5 分钟。`:`${G.length} ${G.length===1?N().toLowerCase():M().toLowerCase()} are running 5+ min late.`}),$.length&&f.push({tone:"info",copy:t.language==="zh-CN"?`${p.name} 当前受 ${$.length} 条告警影响。`:`${$.length} active alert${$.length===1?"":"s"} affecting ${p.name}.`}),f.length||f.push({tone:"healthy",copy:t.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),f.slice(0,4)}function W(p){return p.map(r=>{const c=t.layouts.get(r.id),$=t.vehiclesByLine.get(r.id)??[],f=$.filter(x=>x.directionSymbol==="▲"),T=$.filter(x=>x.directionSymbol==="▼"),L=b(r.id);return{line:r,layout:c,vehicles:$,nb:f,sb:T,lineAlerts:L,exceptions:P(r,f,T,L)}})}function K(p){return`
      <div class="attention-reason-badges">
        ${p.map(r=>`<span class="attention-reason-badge attention-reason-badge-${r.tone}">${r.label}</span>`).join("")}
      </div>
    `}function E(p){const r=p.length,c=p.reduce((C,Y)=>C+Y.vehicles.length,0),$=p.reduce((C,Y)=>C+Y.lineAlerts.length,0),f=p.filter(C=>C.lineAlerts.length>0).length,T=new Set(p.flatMap(C=>C.lineAlerts.flatMap(Y=>Y.stopIds??[]))).size,L=p.flatMap(C=>C.vehicles),x=y(L),I=p.map(C=>{const{nbGaps:Y,sbGaps:Ce}=n(C.nb,C.sb),De=[...Y,...Ce].length?Math.max(...Y,...Ce):0,me=C.vehicles.filter(le=>Number(le.scheduleDeviation??0)>300).length,We=Math.abs(C.nb.length-C.sb.length),Dt=a(Y,C.nb.length).health,At=a(Ce,C.sb.length).health,xt=[Dt,At].some(le=>le==="uneven"||le==="bunched"||le==="sparse"),It=me>0,Nt=C.lineAlerts.length*5+me*3+Math.max(0,De-10),Mt=u({worstGap:De,severeLateCount:me,alertCount:C.lineAlerts.length,balanceDelta:We,language:t.language});return{line:C.line,score:Nt,worstGap:De,severeLateCount:me,alertCount:C.lineAlerts.length,balanceDelta:We,hasSevereLate:It,isUneven:xt,attentionReasons:Mt}}).sort((C,Y)=>Y.score-C.score||Y.worstGap-C.worstGap),q=new Set(I.filter(C=>C.hasSevereLate).map(C=>C.line.id)),G=new Set(I.filter(C=>C.isUneven).map(C=>C.line.id)),J=I.filter(C=>C.hasSevereLate&&!C.isUneven).length,Q=I.filter(C=>C.isUneven&&!C.hasSevereLate).length,ae=I.filter(C=>C.hasSevereLate&&C.isUneven).length,Ge=new Set([...q,...G]).size,Lt=Math.max(0,r-Ge),Tt=c?Math.round(x.onTime/c*100):null,Ct=I.filter(C=>C.score>0).slice(0,2);let pe={tone:"healthy",copy:t.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const _=I[0]??null;return _?.alertCount?pe={tone:"info",copy:t.language==="zh-CN"?`${_.line.name} 当前有 ${_.alertCount} 条生效告警。`:`${_.line.name} has ${_.alertCount} active alert${_.alertCount===1?"":"s"}.`}:_?.worstGap>=12?pe={tone:"alert",copy:t.language==="zh-CN"?`当前最大实时间隔为空 ${_.line.name} 的 ${_.worstGap} 分钟。`:`Largest live gap: ${_.worstGap} min on ${_.line.name}.`}:_?.severeLateCount&&(pe={tone:"warn",copy:t.language==="zh-CN"?`${_.line.name} 有 ${_.severeLateCount} 辆${_.severeLateCount===1?N().toLowerCase():M().toLowerCase()}晚点超过 5 分钟。`:`${_.line.name} has ${_.severeLateCount} ${_.severeLateCount===1?N().toLowerCase():M().toLowerCase()} running 5+ min late.`}),{totalLines:r,totalVehicles:c,totalAlerts:$,impactedLines:f,impactedStopCount:T,delayedLineIds:q,unevenLineIds:G,lateOnlyLineCount:J,unevenOnlyLineCount:Q,mixedIssueLineCount:ae,attentionLineCount:Ge,healthyLineCount:Lt,onTimeRate:Tt,rankedLines:I,priorityLines:Ct,topIssue:pe}}function V(p,r,{suffix:c="",invert:$=!1}={}){if(p==null||r==null||p===r)return t.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const f=p-r,T=$?f<0:f>0,L=f>0?"↑":"↓";return t.language==="zh-CN"?`${T?"改善":"变差"} ${L} ${Math.abs(f)}${c}`:`${T?"Improving":"Worse"} ${L} ${Math.abs(f)}${c}`}function A(p){const r=E(p),c=t.systemSnapshots.get(t.activeSystemId)?.previous??null,$=[];r.totalAlerts>0&&$.push({tone:"info",copy:t.language==="zh-CN"?`${r.impactedLines} 条线路共受 ${r.totalAlerts} 条告警影响。`:`${r.totalAlerts} active alert${r.totalAlerts===1?"":"s"} across ${r.impactedLines} line${r.impactedLines===1?"":"s"}.`}),r.delayedLineIds.size>0&&$.push({tone:"warn",copy:t.language==="zh-CN"?`${r.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${r.delayedLineIds.size} line${r.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),r.unevenLineIds.size>0&&$.push({tone:"alert",copy:t.language==="zh-CN"?`${r.unevenLineIds.size} 条线路当前发车间隔不均。`:`${r.unevenLineIds.size} line${r.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),$.length||$.push({tone:"healthy",copy:t.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const f=[{label:t.language==="zh-CN"?"准点率":"On-Time Rate",value:r.onTimeRate!=null?`${r.onTimeRate}%`:"—",delta:V(r.onTimeRate,c?.onTimeRate,{suffix:"%"})},{label:t.language==="zh-CN"?"需关注线路":"Attention Lines",value:r.attentionLineCount,delta:V(r.attentionLineCount,c?.attentionLineCount,{invert:!0})}];return`
      <article class="panel-card panel-card-wide system-summary-card">
        <header class="panel-header"><div class="system-summary-header"><div class="line-title"><span class="line-token" style="--line-color:var(--accent-strong);">${m().label[0]}</span><div class="line-title-copy"><h2>${m().label} ${t.language==="zh-CN"?"概览":"Summary"}</h2><p>${t.language==="zh-CN"?`系统内 ${r.totalLines} 条线路 · 更新于 ${o()}`:`${r.totalLines} line${r.totalLines===1?"":"s"} in system · Updated ${o()}`}</p></div></div></div></header>
        <div class="system-summary-hero"><div class="insight-exception insight-exception-${r.topIssue.tone}"><p>${r.topIssue.copy}</p></div><div class="system-trend-strip">${f.map(T=>`<div class="metric-chip system-trend-chip"><p class="metric-chip-label">${T.label}</p><p class="metric-chip-value">${T.value}</p><p class="system-trend-copy">${T.delta}</p></div>`).join("")}</div></div>
        <div class="metric-strip system-summary-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"健康线路":"Healthy Lines"}</p><p class="metric-chip-value">${r.healthyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?`实时${M()}`:`Live ${M()}`}</p><p class="metric-chip-value">${r.totalVehicles}</p></div><div class="metric-chip ${r.totalAlerts?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"告警":"Alerts"}</p><p class="metric-chip-value">${r.totalAlerts}</p></div><div class="metric-chip ${r.attentionLineCount?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"需关注线路":"Lines Needing Attention"}</p><p class="metric-chip-value">${r.attentionLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"影响站点":"Impacted Stops"}</p><p class="metric-chip-value">${r.impactedStopCount}</p></div></div>
        <div class="system-composition"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"需关注线路构成":"Attention Breakdown"}</p><p class="headway-chart-copy">${t.language==="zh-CN"?"按晚点与间隔异常拆解":"Split by lateness and spacing issues"}</p></div><div class="attention-breakdown-grid"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅晚点":"Late Only"}</p><p class="metric-chip-value">${r.lateOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅间隔不均":"Spacing Only"}</p><p class="metric-chip-value">${r.unevenOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"两者都有":"Both"}</p><p class="metric-chip-value">${r.mixedIssueLineCount}</p></div></div></div>
        <div class="system-priority"><div class="insight-exceptions-header">${t.language==="zh-CN"?"":'<p class="headway-chart-title">Recommended Next</p>'}<p class="headway-chart-copy">${t.language==="zh-CN"?"基于当前快照的综合优先级":"Best next checks from the current snapshot"}</p></div><div class="system-priority-list">${(r.priorityLines.length?r.priorityLines:r.rankedLines.slice(0,1)).map(({line:T,worstGap:L,severeLateCount:x,alertCount:I,attentionReasons:q})=>`<div class="system-priority-item"><div class="line-title"><span class="line-token" style="--line-color:${T.color};">${T.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${T.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`${L?`最大间隔 ${L} 分钟`:"当前无明显间隔问题"}${x?` · ${x} 辆严重晚点`:""}${I?` · ${I} 条告警`:""}`:`${L?`Gap ${L} min`:"No major spacing issue"}${x?` · ${x} severe late`:""}${I?` · ${I} alert${I===1?"":"s"}`:""}`}</p>${K(q)}</div></div></div>`).join("")}</div></div>
        <div class="system-ranking"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"关注排名":"Attention Ranking"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div><div class="system-ranking-list">${r.rankedLines.slice(0,3).map(({line:T,score:L,worstGap:x,alertCount:I,severeLateCount:q,attentionReasons:G})=>`<div class="system-ranking-item"><div class="line-title"><span class="line-token" style="--line-color:${T.color};">${T.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${T.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`评分 ${L}${x?` · 最大间隔 ${x} 分钟`:""}${I?` · ${I} 条告警`:""}${q?` · ${q} 辆严重晚点`:""}`:`Score ${L}${x?` · gap ${x} min`:""}${I?` · ${I} alert${I===1?"":"s"}`:""}${q?` · ${q} severe late`:""}`}</p>${K(G)}</div></div></div>`).join("")}</div></div>
        <div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"系统状态":"System Status"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div>${$.map(T=>`<div class="insight-exception insight-exception-${T.tone}"><p>${T.copy}</p></div>`).join("")}</div>
      </article>
    `}function v(p){const r=p.flatMap(L=>L.exceptions.map(x=>({tone:x.tone,copy:`${L.line.name}: ${x.copy}`,lineColor:L.line.color})));if(!r.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport"><span class="insights-ticker-item insights-ticker-item-healthy">${t.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span></div></section>
    `;const c=D(),$=Math.ceil(r.length/c),f=t.insightsTickerIndex%$,T=r.slice(f*c,f*c+c);return`
      <section class="insights-ticker" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport">${T.map(L=>`<span class="insights-ticker-item insights-ticker-item-${L.tone} insights-ticker-item-animated"><span class="insights-ticker-dot" style="--line-color:${L.lineColor};"></span><span class="insights-ticker-copy">${L.copy}</span></span>`).join("")}</div></section>
    `}function w(p,r,c,$,f){const T=c.length+$.length;if(!T)return"";const{nbGaps:L,sbGaps:x}=n(c,$),I=y([...c,...$]),q=[...L,...x].length?Math.max(...L,...x):null,G=B(c,$),J=P(p,c,$,f),Q=new Set(f.flatMap(ae=>ae.stopIds??[])).size;return`
      <div class="line-insights"><div class="metric-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"运营中":"In Service"}</p><p class="metric-chip-value">${T}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"准点率":"On-Time Rate"}</p><p class="metric-chip-value">${d(I.onTime,T)}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"最大间隔":"Worst Gap"}</p><p class="metric-chip-value">${q!=null?`${q} min`:"—"}</p></div><div class="metric-chip metric-chip-${G.tone}"><p class="metric-chip-label">${t.language==="zh-CN"?"方向平衡":"Balance"}</p><p class="metric-chip-value">${G.label}</p></div></div><div class="headway-health-grid">${k(l("▲",r,{includeSymbol:!0}),L,c.length)}${k(l("▼",r,{includeSymbol:!0}),x,$.length)}</div>${U(I,T)}<div class="flow-grid">${R(t.language==="zh-CN"?`${l("▲",r,{includeSymbol:!0})} 流向`:`${l("▲",r,{includeSymbol:!0})} flow`,c,r,p.color)}${R(t.language==="zh-CN"?`${l("▼",r,{includeSymbol:!0})} 流向`:`${l("▼",r,{includeSymbol:!0})} flow`,$,r,p.color)}</div><div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"当前":"Now"}</p><p class="headway-chart-copy">${f.length?t.language==="zh-CN"?`${f.length} 条生效告警${Q?` · 影响 ${Q} 个站点`:""}`:`${f.length} active alert${f.length===1?"":"s"}${Q?` · ${Q} impacted stops`:""}`:t.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p></div>${J.map(ae=>`<div class="insight-exception insight-exception-${ae.tone}"><p>${ae.copy}</p></div>`).join("")}</div></div>
    `}function z(p){const r=W(t.lines),c=N(),$=W(p);return`
      ${v($)}
      ${A(r)}
      ${$.map(({line:f,layout:T,vehicles:L,nb:x,sb:I,lineAlerts:q})=>{const G=w(f,T,x,I,q);return`
          <article class="panel-card panel-card-wide">
            <header class="panel-header line-card-header"><div class="line-title"><span class="line-token" style="--line-color:${f.color};">${f.name[0]}</span><div class="line-title-copy"><h2>${f.name}</h2><p>${i("liveCount",L.length,L.length===1?N().toLowerCase():M().toLowerCase())} · ${S(f)}</p></div></div>${F(f)}</header>
            ${H(f)}
            ${G||`<p class="train-readout muted">${t.language==="zh-CN"?`等待实时${c.toLowerCase()}数据…`:`Waiting for live ${c.toLowerCase()} data…`}</p>`}
          </article>
        `}).join("")}
    `}return{renderInsightsBoard:z}}function ya(){return{dialog:document.querySelector("#station-dialog"),dialogTitle:document.querySelector("#dialog-title"),dialogTitleTrack:document.querySelector("#dialog-title-track"),dialogTitleText:document.querySelector("#dialog-title-text"),dialogTitleTextClone:document.querySelector("#dialog-title-text-clone"),dialogServiceSummary:document.querySelector("#dialog-service-summary"),dialogStatusPillElement:document.querySelector("#dialog-status-pill"),dialogUpdatedAtElement:document.querySelector("#dialog-updated-at"),dialogDisplay:document.querySelector("#dialog-display"),dialogDirectionTabs:[...document.querySelectorAll("[data-dialog-direction]")],arrivalsTitleNb:document.querySelector("#arrivals-title-nb"),arrivalsTitleSb:document.querySelector("#arrivals-title-sb"),stationAlertsContainer:document.querySelector("#station-alerts-container"),transferSection:document.querySelector("#transfer-section"),arrivalsSectionNb:document.querySelector('[data-direction-section="nb"]'),arrivalsNbPinned:document.querySelector("#arrivals-nb-pinned"),arrivalsNb:document.querySelector("#arrivals-nb"),arrivalsSectionSb:document.querySelector('[data-direction-section="sb"]'),arrivalsSbPinned:document.querySelector("#arrivals-sb-pinned"),arrivalsSb:document.querySelector("#arrivals-sb"),trainDialog:document.querySelector("#train-dialog"),trainDialogTitle:document.querySelector("#train-dialog-title"),trainDialogSubtitle:document.querySelector("#train-dialog-subtitle"),trainDialogLine:document.querySelector("#train-dialog-line"),trainDialogStatus:document.querySelector("#train-dialog-status"),trainDialogClose:document.querySelector("#train-dialog-close"),alertDialog:document.querySelector("#alert-dialog"),alertDialogTitle:document.querySelector("#alert-dialog-title"),alertDialogSubtitle:document.querySelector("#alert-dialog-subtitle"),alertDialogLines:document.querySelector("#alert-dialog-lines"),alertDialogBody:document.querySelector("#alert-dialog-body"),alertDialogLink:document.querySelector("#alert-dialog-link"),alertDialogClose:document.querySelector("#alert-dialog-close")}}function $a({state:e,elements:t,copyValue:a,refreshStationDialog:n,clearStationParam:i}){const{dialog:o,dialogTitle:l,dialogTitleTrack:d,dialogTitleText:m,dialogTitleTextClone:b,dialogDisplay:y,dialogDirectionTabs:u,arrivalsSectionNb:D,arrivalsNb:h,arrivalsSectionSb:S,arrivalsSb:N}=t;function M(v){e.dialogDisplayMode=v,o.classList.toggle("is-display-mode",v),y.textContent=a(v?"exit":"board"),y.setAttribute("aria-label",a(v?"exit":"board")),e.dialogDisplayDirection="both",e.dialogDisplayAutoPhase="nb",B(),o.open&&e.currentDialogStation&&n(e.currentDialogStation).catch(console.error),A(),W()}function F(){M(!e.dialogDisplayMode)}function H(){e.dialogDisplayDirectionTimer&&(window.clearInterval(e.dialogDisplayDirectionTimer),e.dialogDisplayDirectionTimer=0)}function O(){e.dialogDisplayDirectionAnimationTimer&&(window.clearTimeout(e.dialogDisplayDirectionAnimationTimer),e.dialogDisplayDirectionAnimationTimer=0),e.dialogDisplayAnimatingDirection="",D?.classList.remove("is-direction-animating"),S?.classList.remove("is-direction-animating")}function k(v){if(!e.dialogDisplayMode||!v||v==="both")return;O(),e.dialogDisplayAnimatingDirection=v;const w=v==="nb"?D:S;w&&(w.offsetWidth,w.classList.add("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=window.setTimeout(()=>{w.classList.remove("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=0,e.dialogDisplayAnimatingDirection===v&&(e.dialogDisplayAnimatingDirection="")},Vt))}function B({animate:v=!1}={}){H(),O();const w=e.dialogDisplayDirection,z=w==="auto"?e.dialogDisplayAutoPhase:w;u.forEach(p=>{p.classList.toggle("is-active",p.dataset.dialogDirection===w)}),o.classList.toggle("show-nb-only",e.dialogDisplayMode&&z==="nb"),o.classList.toggle("show-sb-only",e.dialogDisplayMode&&z==="sb"),v&&k(z),e.dialogDisplayMode&&w==="auto"&&(e.dialogDisplayDirectionTimer=window.setInterval(()=>{e.dialogDisplayAutoPhase=e.dialogDisplayAutoPhase==="nb"?"sb":"nb",B({animate:!0})},Ft))}function U(){e.dialogRefreshTimer&&(window.clearTimeout(e.dialogRefreshTimer),e.dialogRefreshTimer=0)}function R(){e.dialogDisplayTimer&&(window.clearInterval(e.dialogDisplayTimer),e.dialogDisplayTimer=0)}function P(v,w){const z=[...v.querySelectorAll(".arrival-item:not(.muted)")];if(v.style.transform="translateY(0)",!e.dialogDisplayMode||z.length<=3)return;const p=Number.parseFloat(window.getComputedStyle(v).rowGap||"0")||0,r=z[0].getBoundingClientRect().height+p,c=Math.max(0,z.length-3),$=Math.min(e.dialogDisplayIndexes[w],c);v.style.transform=`translateY(-${$*r}px)`}function W(){R(),e.dialogDisplayIndexes={nb:0,sb:0},P(h,"nb"),P(N,"sb"),e.dialogDisplayMode&&(e.dialogDisplayTimer=window.setInterval(()=>{for(const[v,w]of[["nb",h],["sb",N]]){const z=[...w.querySelectorAll(".arrival-item:not(.muted)")];if(z.length<=3)continue;const p=Math.max(0,z.length-3);e.dialogDisplayIndexes[v]=e.dialogDisplayIndexes[v]>=p?0:e.dialogDisplayIndexes[v]+1,P(w,v)}},Ht))}function K(){if(U(),!e.currentDialogStation)return;const v=()=>{e.dialogRefreshTimer=window.setTimeout(async()=>{!o.open||!e.currentDialogStation||(await n(e.currentDialogStation).catch(console.error),v())},Ut)};v()}function E(){e.currentDialogStationId="",e.currentDialogStation=null,o.open?o.close():(U(),R(),H(),M(!1),i())}function V(v){m.textContent=v,b.textContent=v,A()}function A(){const v=l;if(!v||!d)return;const z=e.dialogDisplayMode&&o.open&&m.scrollWidth>v.clientWidth;v.classList.toggle("is-marquee",z)}return{setDialogDisplayMode:M,toggleDialogDisplayMode:F,stopDialogDirectionRotation:H,stopDialogDirectionAnimation:O,renderDialogDirectionView:B,stopDialogAutoRefresh:U,stopDialogDisplayScroll:R,applyDialogDisplayOffset:P,syncDialogDisplayScroll:W,startDialogAutoRefresh:K,closeStationDialog:E,setDialogTitle:V,syncDialogTitleMarquee:A}}function ba({state:e,elements:t,copyValue:a,formatAlertSeverity:n,formatAlertEffect:i,getAlertsForLine:o,getDirectionBaseLabel:l,getVehicleLabel:d,getVehicleDestinationLabel:m,getTrainTimelineEntries:b,getStatusTone:y,getVehicleStatusPills:u,renderStatusPills:D,formatArrivalTime:h}){const{trainDialog:S,trainDialogTitle:N,trainDialogSubtitle:M,trainDialogLine:F,trainDialogStatus:H,alertDialog:O,alertDialogTitle:k,alertDialogSubtitle:B,alertDialogLines:U,alertDialogBody:R,alertDialogLink:P}=t;function W(){e.currentTrainId="",S.open&&S.close()}function K(){O.open&&O.close()}function E(A){const v=o(A.id);k.textContent=a("affectedLineAlerts",A.name,v.length),B.textContent=a("activeAlerts",v.length),U.textContent=A.name,R.textContent="",R.innerHTML=v.length?v.map(w=>`
              <article class="alert-dialog-item">
                <p class="alert-dialog-item-meta">${n(w.severity)} • ${i(w.effect)}</p>
                <p class="alert-dialog-item-title">${w.title||a("serviceAlert")}</p>
                <p class="alert-dialog-item-copy">${w.description||a("noAdditionalAlertDetails")}</p>
                ${w.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${w.url}" target="_blank" rel="noreferrer">${a("readOfficialAlert")}</a></p>`:""}
              </article>
            `).join(""):`<p class="alert-dialog-item-copy">${a("noActiveAlerts")}</p>`,P.hidden=!0,P.removeAttribute("href"),O.open||O.showModal()}function V(A){const v=A.fromLabel!==A.toLabel&&A.progress>0&&A.progress<1,w=v?A.fromLabel:A.previousLabel,z=v?`${A.fromLabel} -> ${A.toLabel}`:A.currentStopLabel,p=v?"Between":"Now",r=v?A.toLabel:A.upcomingLabel,c=v?A.progress:.5,$=e.layouts.get(A.lineId),f=b(A,$),T=$?m(A,$):A.upcomingLabel,L=f.at(-1)?.etaSeconds??Math.max(0,A.nextOffset??0),x=l(A.directionSymbol);N.textContent=`${A.lineName} ${d()} ${A.label}`,M.textContent=e.language==="zh-CN"?`${x} · ${a("toDestination",T)}`:`${x} to ${T}`,H.className=`train-detail-status train-list-status-${y(A.serviceStatus)}`,H.innerHTML=D(u(A)),S.querySelector(".train-eta-panel")?.remove(),F.innerHTML=`
      <div class="train-detail-spine" style="--line-color:${A.lineColor};"></div>
      <div
        class="train-detail-marker-floating"
        style="--line-color:${A.lineColor}; --segment-progress:${c}; --direction-offset:${A.directionSymbol==="▼"?"10px":"-10px"};"
      >
        <span class="train-detail-vehicle-marker">
          <svg viewBox="-10 -10 20 20" class="train-detail-arrow" aria-hidden="true">
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${A.directionSymbol==="▼"?"rotate(180)":""}"></path>
          </svg>
        </span>
      </div>
      <div class="train-detail-stop">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${a("previous")}</p>
          <p class="train-detail-name">${w}</p>
        </div>
      </div>
      <div class="train-detail-stop is-current">
        <span class="train-detail-marker train-detail-marker-ghost"></span>
        <div>
          <p class="train-detail-label">${p==="Between"?e.language==="zh-CN"?"区间":"Between":a("now")}</p>
          <p class="train-detail-name">${z}</p>
        </div>
      </div>
      <div class="train-detail-stop">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${a("next")}</p>
          <p class="train-detail-name">${r}</p>
        </div>
      </div>
    `,F.insertAdjacentHTML("afterend",`
        <section class="train-eta-panel">
          <div class="train-eta-summary">
            <div class="metric-chip">
              <p class="metric-chip-label">${a("direction")}</p>
              <p class="metric-chip-value">${x}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${a("terminal")}</p>
              <p class="metric-chip-value">${T}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${a("etaToTerminal")}</p>
              <p class="metric-chip-value">${h(L)}</p>
            </div>
          </div>
          <div class="train-eta-timeline">
            <div class="train-eta-header">
              <p class="train-detail-label">${a("upcomingStops")}</p>
              <p class="train-eta-header-copy">${a("liveEtaNow")}</p>
            </div>
            ${f.length?f.map(I=>`
                    <article class="train-eta-stop${I.isNext?" is-next":""}${I.isTerminal?" is-terminal":""}">
                      <div>
                        <p class="train-eta-stop-label">${I.isNext?a("nextStop"):I.isTerminal?a("terminal"):a("upcoming")}</p>
                        <p class="train-eta-stop-name">${I.label}</p>
                      </div>
                      <div class="train-eta-stop-side">
                        <p class="train-eta-stop-countdown">${h(I.etaSeconds)}</p>
                        <p class="train-eta-stop-clock">${I.clockTime}</p>
                      </div>
                    </article>
                  `).join(""):`<p class="train-readout muted">${a("noDownstreamEta")}</p>`}
          </div>
        </section>
      `),S.open||S.showModal()}return{closeTrainDialog:W,closeAlertDialog:K,renderAlertListDialog:E,renderTrainDialog:V}}function Sa(e){const t=[...e.stops].sort((u,D)=>D.sequence-u.sequence),a=48,n=44,i=28,o=88,l=122,d=n+i+(t.length-1)*a,m=new Map,b=t.map((u,D)=>{const h={...u,label:Wt(u.name),y:n+D*a,index:D,isTerminal:D===0||D===t.length-1};m.set(u.id,D),m.set(`${e.agencyId}_${u.id}`,D);for(const S of e.stationAliases?.[u.id]??[])m.set(S,D),m.set(`${e.agencyId}_${S}`,D);return h});let y=0;for(let u=0;u<b.length;u+=1)b[u].cumulativeMinutes=y,y+=u<b.length-1?b[u].segmentMinutes:0;return{totalMinutes:y,height:d,labelX:l,stationGap:a,stationIndexByStopId:m,stations:b,trackX:o}}function wa(e,t){const a=e.systemsById.has(t)?t:te,n=e.systemsById.get(a);e.activeSystemId=a,e.lines=n?.lines??[],e.layouts=e.layoutsBySystem.get(a)??new Map,e.lines.some(i=>i.id===e.activeLineId)||(e.activeLineId=e.lines[0]?.id??""),e.vehiclesByLine=new Map,e.rawVehicles=[],e.arrivalsCache.clear(),e.alerts=[],e.error="",e.fetchedAt="",e.insightsTickerIndex=0,e.vehicleGhosts=new Map}async function La({state:e,getSystemIdFromUrl:t}){for(let i=0;i<=4;i+=1){let o=null,l=null;try{o=await fetch(Ot,{cache:"no-store"}),l=await o.json()}catch(m){if(i===4)throw m;await ce(1e3*2**i);continue}if(!o.ok){if(i===4)throw new Error(`Static data load failed with ${o.status}`);await ce(1e3*2**i);continue}const d=l.systems??[];e.systemsById=new Map(d.map(m=>[m.id,m])),e.layoutsBySystem=new Map(d.map(m=>[m.id,new Map(m.lines.map(b=>[b.id,Sa(b)]))])),wa(e,t());return}}function Ta({getPreferredLanguage:e,getPreferredTheme:t,handleViewportResize:a,loadStaticData:n,refreshVehicles:i,render:o,refreshLiveMeta:l,refreshArrivalCountdowns:d,refreshVehicleStatusMessages:m,startInsightsTickerRotation:b,startLiveRefreshLoop:y,syncCompactLayoutFromBoard:u,syncDialogFromUrl:D,updateViewportState:h,setLanguage:S,setTheme:N,boardElement:M}){return async function(){S(e()),N(t()),h(),await n(),o(),await i(),await D(),window.addEventListener("popstate",()=>{D().catch(console.error)}),window.addEventListener("resize",a),window.visualViewport?.addEventListener("resize",a),new ResizeObserver(()=>{u()}).observe(M),y(),b(),window.setInterval(()=>{l(),d(),m()},1e3)}}const s={fetchedAt:"",error:"",activeSystemId:te,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayDirectionAnimationTimer:0,dialogDisplayAnimatingDirection:"",dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},Ca=zt({immediate:!0,onNeedRefresh(){Ca(!0)}});document.querySelector("#app").innerHTML=`
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
`;const ee=document.querySelector("#board"),Da=document.querySelector("#screen-kicker"),Aa=document.querySelector("#screen-title"),Ae=document.querySelector("#system-bar"),xa=document.querySelector("#view-bar"),Me=[...document.querySelectorAll(".tab-button")],ke=document.querySelector("#language-toggle"),Ee=document.querySelector("#theme-toggle"),ve=document.querySelector("#status-pill"),Ia=document.querySelector("#current-time"),Re=document.querySelector("#updated-at"),Pe=ya(),{dialog:$e,dialogServiceSummary:Na,dialogStatusPillElement:Qe,dialogUpdatedAtElement:Ma,dialogDisplay:ze,dialogDirectionTabs:ka,arrivalsTitleNb:Ea,arrivalsTitleSb:Ra,trainDialog:Oe,trainDialogClose:lt,alertDialog:Be,alertDialogLink:za,alertDialogClose:ct}=Pe;ze.addEventListener("click",()=>oi());lt.addEventListener("click",()=>He());ct.addEventListener("click",()=>Fe());ke.addEventListener("click",()=>{mt(s.language==="en"?"zh-CN":"en"),Z()});ka.forEach(e=>{e.addEventListener("click",()=>{s.dialogDisplayDirection=e.dataset.dialogDirection,s.dialogDisplayDirection==="auto"&&(s.dialogDisplayAutoPhase="nb"),li()})});$e.addEventListener("click",e=>{e.target===$e&&St()});Oe.addEventListener("click",e=>{e.target===Oe&&He()});Be.addEventListener("click",e=>{e.target===Be&&Fe()});$e.addEventListener("close",()=>{ci(),di(),ri(),si(!1),s.isSyncingFromUrl||bt()});Me.forEach(e=>{e.addEventListener("click",()=>{s.activeTab=e.dataset.tab,Z()})});Ee.addEventListener("click",()=>{pt(s.theme==="dark"?"light":"dark"),Z()});function de(){return ye[s.activeSystemId]??ye[te]}function Oa(){return s.systemsById.get(s.activeSystemId)?.agencyId??ye[te].agencyId}function Ba(){return`${Bt}/vehicles-for-agency/${Oa()}.json?key=${st}`}function oe(){return s.language==="zh-CN"?de().vehicleLabel==="Train"?"列车":"公交":de().vehicleLabel??"Vehicle"}function Te(){return s.language==="zh-CN"?oe():de().vehicleLabelPlural??Gt(oe())}function Pa(){return Je[s.language]??Je.en}function g(e,...t){const a=Pa()[e];return typeof a=="function"?a(...t):a}const{fetchJsonWithRetry:qa}=ca(s);function _a(e){return jt(e,g)}function dt(){return Yt(s.language)}function re(e){return Kt(e,s.language,g)}function he(e){return Zt(e,s.language)}function X(e){return Jt(e,s.language)}function Ua(e){return ea(e,s.language)}function ut(e,t=!1){const a=t&&(e==="▲"||e==="▼")?`${e} `:"";return e==="▲"?`${a}${s.language==="zh-CN"?"北向":"Northbound"}`:e==="▼"?`${a}${s.language==="zh-CN"?"南向":"Southbound"}`:g("active")}function be(e,t="",{includeSymbol:a=!1}={}){const n=ut(e,a);return t?s.language==="zh-CN"?`${n} · 开往 ${t}`:`${n} to ${t}`:n}function gt(e,t){if(!t?.stations?.length)return"";const a=e==="▲"?0:e==="▼"?t.stations.length-1:-1;return a<0?"":t.stations[a]?.label??""}function Ha(e,t,a={}){return be(e,gt(e,t),a)}function et(e){const t=[...new Set(e.map(n=>n?.trim()).filter(Boolean))];if(!t.length)return"";const a=t.slice(0,2);return t.length>2&&a.push(s.language==="zh-CN"?"等":"etc."),a.join(" / ")}function tt(e,t=[],a=s.currentDialogStation){const n=t.map(l=>l.destination),i=et(n);if(i)return i;if(!a)return"";const o=ai(a).map(({line:l})=>s.layouts.get(l.id)).map(l=>gt(e,l));return et(o)}function Fa(){const e=window.localStorage.getItem(ot);return e==="light"||e==="dark"?e:"dark"}function Va(){const e=window.localStorage.getItem(rt);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function pt(e){s.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(ot,e)}function mt(e){s.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=s.language,window.localStorage.setItem(rt,s.language)}function ht(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(t,e,a);s.compactLayout=n<=qt}function Se(){const a=window.getComputedStyle(ee).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==s.compactLayout&&(s.compactLayout=a,Z())}function qe(e){const t=Xt(),a=e.serviceSpansByDate?.[t];return a?g("todayServiceSpan",X(a.start),X(a.end)):g("todayServiceUnavailable")}function Ga(e){const t=new Date,a=fe(-1),n=fe(0),i=fe(1),o=e.serviceSpansByDate?.[a],l=e.serviceSpansByDate?.[n],d=e.serviceSpansByDate?.[i],b=[o&&{kind:"yesterday",start:ie(a,o.start),end:ie(a,o.end),span:o},l&&{kind:"today",start:ie(n,l.start),end:ie(n,l.end),span:l}].filter(Boolean).find(y=>t>=y.start&&t<=y.end);if(b)return{tone:"active",headline:g("lastTrip",X(b.span.end)),detail:g("endsIn",he(b.end.getTime()-t.getTime())),compact:g("endsIn",he(b.end.getTime()-t.getTime()))};if(l){const y=ie(n,l.start),u=ie(n,l.end);if(t<y)return{tone:"upcoming",headline:g("firstTrip",X(l.start)),detail:g("startsIn",he(y.getTime()-t.getTime())),compact:g("startsIn",he(y.getTime()-t.getTime()))};if(t>u)return{tone:"ended",headline:g("serviceEnded",X(l.end)),detail:d?g("nextStart",X(d.start)):g("noNextServiceLoaded"),compact:d?g("nextStart",X(d.start)):g("ended")}}return d?{tone:"upcoming",headline:g("nextFirstTrip",X(d.start)),detail:g("noServiceRemainingToday"),compact:g("nextStart",X(d.start))}:{tone:"muted",headline:g("serviceHoursUnavailable"),detail:g("staticScheduleMissing"),compact:g("unavailable")}}function _e(e){const t=Ga(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function Wa(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function ja(e){const t=fe(0),a=e.serviceSpansByDate?.[t];if(!a)return null;const n=Ne(a.start)/3600,i=Ne(a.end)/3600,o=Wa(new Date),l=Math.max(24,i,o,1);return{startHours:n,endHours:i,nowHours:o,axisMax:l,startLabel:X(a.start),endLabel:X(a.end)}}function Ya(e){const t=ja(e);if(!t)return"";const a=se(t.startHours/t.axisMax*100,0,100),n=se(t.endHours/t.axisMax*100,a,100),i=se(t.nowHours/t.axisMax*100,0,100),o=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
    <section class="service-timeline-card">
      <div class="service-timeline-header">
        <div>
          <p class="headway-chart-title">${s.language==="zh-CN"?"今日运营时间带":"Today Service Window"}</p>
          <p class="headway-chart-copy">${s.language==="zh-CN"?"首末班与当前时刻":"First trip, last trip, and current time"}</p>
        </div>
        <span class="service-timeline-badge ${o?"is-live":"is-off"}">${o?s.language==="zh-CN"?"运营中":"In service":s.language==="zh-CN"?"未运营":"Off hours"}</span>
      </div>
      <div class="service-timeline-track">
        <div class="service-timeline-band" style="left:${a}%; width:${Math.max(2,n-a)}%;"></div>
        <div class="service-timeline-now" style="left:${i}%;">
          <span class="service-timeline-now-dot"></span>
          <span class="service-timeline-now-label">${s.language==="zh-CN"?"当前":"Now"}</span>
        </div>
      </div>
      <div class="service-timeline-labels">
        <span>${t.startLabel}</span>
        <span>${t.endLabel}</span>
      </div>
    </section>
  `}function ge(e){return s.alerts.filter(t=>t.lineIds.includes(e))}function Ka(e,t){const a=ge(t.id);if(!a.length)return[];const n=new Set(ti(e,t));return n.add(e.id),a.filter(i=>i.stopIds.length>0&&i.stopIds.some(o=>n.has(o)))}function ft(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${g("alertsWord",e.length)}</span>
    </button>
  `:""}function Xa(e){switch(e){case"ARR":return g("arrivingStatus");case"DELAY":return g("delayedStatus");case"OK":return g("enRoute");default:return""}}function j(e){if(!s.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(s.fetchedAt).getTime())/1e3));return e-t}function ue(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function Ue(e){const t=j(e.nextOffset??0),a=j(e.closestOffset??0),n=e.delayInfo.text;return t<=15?[{text:g("arrivingNow"),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:g("arrivingIn",re(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:g("nextStopIn",re(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:[{text:Xa(e.serviceStatus),toneClass:ue(e,t)},{text:n,toneClass:e.delayInfo.colorClass}]}function ne(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function vt(e){const t=j(e.nextOffset??0),a=j(e.closestOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel,[i,o]=Ue(e);return t<=15?`${e.label} at ${n} ${ne([i,o])}`:t<=90?`${e.label} at ${n} ${ne([i,o])}`:a<0&&t>0?`${e.label} ${n} ${ne([i,o])}`:`${e.label} to ${n} ${ne([i,o])}`}function yt(e){return ne(Ue(e))}function $t(e,t){if(!t.length)return"";const a=[...t].sort((i,o)=>j(i.nextOffset??0)-j(o.nextOffset??0)).slice(0,8),n=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${n.map(i=>`
          <span
            class="line-marquee-item ${ue(i,j(i.nextOffset??0))}"
            data-vehicle-marquee="${i.id}"
          >
            <span class="line-marquee-token">${i.lineToken}</span>
            <span class="line-marquee-copy">${vt(i)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function Za(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const n=a.dataset.vehicleStatus,i=we().find(l=>l.id===n);if(!i)return;const o=j(i.nextOffset??0);a.innerHTML=yt(i),a.className=`train-list-status ${ue(i,o)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const n=a.dataset.vehicleMarquee,i=we().find(d=>d.id===n);if(!i)return;const o=j(i.nextOffset??0);a.className=`line-marquee-item ${ue(i,o)}`;const l=a.querySelector(".line-marquee-copy");l&&(l.innerHTML=vt(i))})}function Ja(e){return e.fromLabel===e.toLabel||e.progress===0?s.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:s.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function Qa(e){const t=s.layouts.get(e.lineId),a=Math.max(0,getTrainTimelineEntries(e,t).at(-1)?.etaSeconds??e.nextOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${s.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${n}</p>
        <p class="train-focus-metric-copy">${re(j(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${s.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${getVehicleDestinationLabel(e,t)}</p>
        <p class="train-focus-metric-copy">${re(j(a))}</p>
      </div>
    </div>
  `}function we(){return s.lines.flatMap(e=>(s.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function ei(){return Object.values(ye).filter(e=>s.systemsById.has(e.id)).map(e=>`
        <button
          class="tab-button ${e.id===s.activeSystemId?"is-active":""}"
          data-system-switch="${e.id}"
          type="button"
        >
          ${e.label}
        </button>
      `).join("")}function xe(){return!s.compactLayout||s.lines.length<2?"":`<section class="line-switcher">${s.lines.map(t=>`
        <button
          class="line-switcher-button ${t.id===s.activeLineId?"is-active":""}"
          data-line-switch="${t.id}"
          type="button"
          style="--line-color:${t.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <span>${t.name}</span>
        </button>
      `).join("")}</section>`}function at(){return s.compactLayout?s.lines.filter(e=>e.id===s.activeLineId):s.lines}function ti(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const n=new Set;for(const o of a){const l=o.startsWith(`${t.agencyId}_`)?o:`${t.agencyId}_${o}`;n.add(l)}const i=e.id.replace(/-T\d+$/,"");return n.add(i.startsWith(`${t.agencyId}_`)?i:`${t.agencyId}_${i}`),[...n]}function ai(e){const t=s.lines.map(a=>{const n=a.stops.find(i=>i.id===e.id);return n?{line:a,station:n}:null}).filter(Boolean);return t.length>0?t:s.lines.map(a=>{const n=a.stops.find(i=>i.name===e.name);return n?{line:a,station:n}:null}).filter(Boolean)}function bt(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function it(e){const t=new URL(window.location.href);e===te?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function ii(){const t=new URL(window.location.href).searchParams.get("system");return t&&s.systemsById.has(t)?t:te}const ni=$a({state:s,elements:Pe,copyValue:g,refreshStationDialog:e=>refreshStationDialog(e),clearStationParam:bt}),{setDialogDisplayMode:si,toggleDialogDisplayMode:oi,stopDialogDirectionRotation:ri,renderDialogDirectionView:li,stopDialogAutoRefresh:ci,stopDialogDisplayScroll:di,closeStationDialog:St,setDialogTitle:ui,syncDialogTitleMarquee:gi}=ni;function pi(e,t){const a=Date.now(),n=new Set;for(const i of t){const o=`${e}:${i.id}`;n.add(o);const d=[...(s.vehicleGhosts.get(o)??[]).filter(m=>a-m.timestamp<=Ze),{y:i.y,minutePosition:i.minutePosition,timestamp:a}].slice(-6);s.vehicleGhosts.set(o,d)}for(const[i,o]of s.vehicleGhosts.entries()){if(!i.startsWith(`${e}:`))continue;const l=o.filter(d=>a-d.timestamp<=Ze);if(!n.has(i)||l.length===0){s.vehicleGhosts.delete(i);continue}l.length!==o.length&&s.vehicleGhosts.set(i,l)}}function mi(e,t){return(s.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}const{renderLine:hi}=ha({state:s,getAlertsForLine:ge,getAlertsForStation:Ka,getTodayServiceSpan:qe,getVehicleGhostTrail:mi,getVehicleLabel:oe,getVehicleLabelPlural:Te,copyValue:g,renderInlineAlerts:ft,renderLineStatusMarquee:$t,renderServiceReminderChip:_e}),{renderTrainList:fi}=fa({state:s,copyValue:g,formatArrivalTime:re,formatDirectionLabel:be,formatEtaClockFromNow:Ua,formatVehicleLocationSummary:Ja,getAlertsForLine:ge,getAllVehicles:we,getRealtimeOffset:j,getTodayServiceSpan:qe,getVehicleDestinationLabel,getVehicleLabel:oe,getVehicleLabelPlural:Te,getVehicleStatusClass:ue,renderFocusMetrics:Qa,renderInlineAlerts:ft,renderLineStatusMarquee:$t,renderServiceReminderChip:_e,formatVehicleStatus:yt}),{renderInsightsBoard:vi}=va({state:s,classifyHeadwayHealth:sa,computeLineHeadways:ia,copyValue:g,formatCurrentTime:dt,formatLayoutDirectionLabel:Ha,formatPercent:ra,getActiveSystemMeta:de,getAlertsForLine:ge,getDelayBuckets:oa,getLineAttentionReasons:la,getInsightsTickerPageSize,getRealtimeOffset:j,getTodayServiceSpan:qe,getVehicleLabel:oe,getVehicleLabelPlural:Te,renderServiceReminderChip:_e,renderServiceTimeline:Ya});function yi(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await Ai(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function Ie(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{s.activeLineId=t.dataset.lineSwitch,Z()})})}const $i=ba({state:s,elements:Pe,copyValue:g,formatAlertSeverity:aa,formatAlertEffect:ta,getAlertsForLine:e=>ge(e),getDirectionBaseLabel:ut,getVehicleLabel:oe,getVehicleDestinationLabel,getTrainTimelineEntries,getStatusTone:da,getVehicleStatusPills:Ue,renderStatusPills:ne,formatArrivalTime:re}),{closeTrainDialog:He,closeAlertDialog:Fe,renderTrainDialog:bi}=$i;function nt(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,n=we().find(i=>i.id===a);n&&(s.currentTrainId=a,bi(n))})})}function Si(){s.lines.forEach(e=>{const t=s.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.stopId,l=t.stations.find(d=>d.id===o);l&&showStationDialog(l)})})})}function Z(){const e=de();if(document.documentElement.lang=s.language,ke.textContent=g("languageToggle"),ke.setAttribute("aria-label",g("languageToggleAria")),Ee.textContent=s.theme==="dark"?g("themeLight"):g("themeDark"),Ee.setAttribute("aria-label",g("themeToggleAria")),Da.textContent=e.kicker,Aa.textContent=e.title,Ae.setAttribute("aria-label",g("transitSystems")),xa.setAttribute("aria-label",g("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",g("boardDirectionView")),Ea.textContent=be("▲",tt("▲"),{includeSymbol:!0}),Ra.textContent=be("▼",tt("▼"),{includeSymbol:!0}),ze.textContent=s.dialogDisplayMode?g("exit"):g("board"),ze.setAttribute("aria-label",s.dialogDisplayMode?g("exit"):g("board")),lt.setAttribute("aria-label",g("closeTrainDialog")),ct.setAttribute("aria-label",g("closeAlertDialog")),$e.open||(ui(g("station")),Na.textContent=g("serviceSummary")),Oe.open||(trainDialogTitle.textContent=g("train"),trainDialogSubtitle.textContent=g("currentMovement")),Be.open||(alertDialogTitle.textContent=g("serviceAlert"),alertDialogSubtitle.textContent=g("transitAdvisory")),za.textContent=g("readOfficialAlert"),Ae.hidden=s.systemsById.size<2,Ae.innerHTML=ei(),wt(),Me.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===s.activeTab)),Me.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=g("tabMap")),t.dataset.tab==="trains"&&(t.textContent=Te()),t.dataset.tab==="insights"&&(t.textContent=g("tabInsights"))}),yi(),s.activeTab==="map"){ee.className="board";const t=at();ee.innerHTML=`${xe()}${t.map(hi).join("")}`,Ie(),attachAlertClickHandlers(),Si(),nt(),queueMicrotask(Se);return}if(s.activeTab==="trains"){ee.className="board",ee.innerHTML=`${xe()}${fi()}`,Ie(),attachAlertClickHandlers(),nt(),queueMicrotask(Se);return}if(s.activeTab==="insights"){ee.className="board";const t=at();ee.innerHTML=`${xe()}${vi(t)}`,Ie()}}function wi(){window.clearInterval(s.insightsTickerTimer),s.insightsTickerTimer=0}function Li(){wi(),s.insightsTickerTimer=window.setInterval(()=>{s.insightsTickerIndex+=1,s.activeTab==="insights"&&Z()},5e3)}function wt(){ve.textContent=s.error?g("statusHold"):g("statusSync"),ve.classList.toggle("status-pill-error",!!s.error),Ia.textContent=`${g("nowPrefix")} ${dt()}`,Re.textContent=s.error?s.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":_a(s.fetchedAt),Qe.textContent=ve.textContent,Qe.classList.toggle("status-pill-error",!!s.error),Ma.textContent=Re.textContent}function Ti(){window.clearTimeout(s.liveRefreshTimer),s.liveRefreshTimer=0}function Ci(){Ti();const e=()=>{s.liveRefreshTimer=window.setTimeout(async()=>{await Ve(),e()},_t)};e()}function Di(e){const t=s.systemsById.has(e)?e:te,a=s.systemsById.get(t);s.activeSystemId=t,s.lines=a?.lines??[],s.layouts=s.layoutsBySystem.get(t)??new Map,s.lines.some(n=>n.id===s.activeLineId)||(s.activeLineId=s.lines[0]?.id??""),s.vehiclesByLine=new Map,s.rawVehicles=[],s.arrivalsCache.clear(),s.alerts=[],s.error="",s.fetchedAt="",s.insightsTickerIndex=0,s.vehicleGhosts=new Map}async function Ai(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!s.systemsById.has(e)||s.activeSystemId===e){t&&it(s.activeSystemId);return}Di(e),a||St(),He(),Fe(),Z(),t&&it(e),await Ve()}async function xi(){await La({state:s,getSystemIdFromUrl:ii})}function Ii(e){const t=[...new Set((e.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=s.lines.filter(n=>t.includes(getLineRouteId(n))).map(n=>n.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??g("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function Ve(){try{const e=await qa(Ba(),"Realtime");s.error="",s.fetchedAt=new Date().toISOString(),s.rawVehicles=e.data.list??[],s.alerts=(e.data.references?.situations??[]).map(Ii).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(i=>[i.id,i]));for(const i of s.lines){const o=s.layouts.get(i.id),l=s.rawVehicles.map(d=>ma(d,i,o,t,{language:s.language,copyValue:g})).filter(Boolean);s.vehiclesByLine.set(i.id,l),pi(i.id,l)}const a=computeSystemSummaryMetrics(buildInsightsItems(s.lines)),n=s.systemSnapshots.get(s.activeSystemId);s.systemSnapshots.set(s.activeSystemId,{previous:n?.current??null,current:a})}catch(e){s.error=g("realtimeOffline"),console.error(e)}Z()}const Ni=()=>{const e=s.compactLayout;if(ht(),gi(),e!==s.compactLayout){Z();return}Se()},Mi=Ta({getPreferredLanguage:Va,getPreferredTheme:Fa,handleViewportResize:Ni,loadStaticData:xi,refreshVehicles:Ve,render:Z,refreshLiveMeta:wt,refreshArrivalCountdowns,refreshVehicleStatusMessages:Za,startInsightsTickerRotation:Li,startLiveRefreshLoop:Ci,syncCompactLayoutFromBoard:Se,syncDialogFromUrl,updateViewportState:ht,setLanguage:mt,setTheme:pt,boardElement:ee});Mi().catch(e=>{ve.textContent=g("statusFail"),Re.textContent=e.message});
