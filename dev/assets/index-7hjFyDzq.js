(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const Et="modulepreload",Rt=function(e){return"/link/dev/"+e},je={},zt=function(t,a,i){let n=Promise.resolve();if(a&&a.length>0){let C=function($){return Promise.all($.map(g=>Promise.resolve(g).then(I=>({status:"fulfilled",value:I}),I=>({status:"rejected",reason:I}))))};var l=C;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),v=d?.nonce||d?.getAttribute("nonce");n=C(a.map($=>{if($=Rt($),$ in je)return;je[$]=!0;const g=$.endsWith(".css"),I=g?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${$}"]${I}`))return;const m=document.createElement("link");if(m.rel=g?"stylesheet":Et,g||(m.as="script"),m.crossOrigin="",m.href=$,v&&m.setAttribute("nonce",v),document.head.appendChild(m),g)return new Promise((L,N)=>{m.addEventListener("load",L),m.addEventListener("error",()=>N(new Error(`Unable to preload CSS for ${$}`)))})}))}function o(d){const v=new Event("vite:preloadError",{cancelable:!0});if(v.payload=d,window.dispatchEvent(v),!v.defaultPrevented)throw d}return n.then(d=>{for(const v of d||[])v.status==="rejected"&&o(v.reason);return t().catch(o)})};function Ot(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:i,onRegistered:n,onRegisteredSW:o,onRegisterError:l}=e;let d,v;const C=async(g=!0)=>{await v};async function $(){if("serviceWorker"in navigator){if(d=await zt(async()=>{const{Workbox:g}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:g}},[]).then(({Workbox:g})=>new g("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(g=>{l?.(g)}),!d)return;d.addEventListener("activated",g=>{(g.isUpdate||g.isExternal)&&window.location.reload()}),d.addEventListener("installed",g=>{g.isUpdate||i?.()}),d.register({immediate:t}).then(g=>{o?o("/link/dev/sw.js",g):n?.(g)}).catch(g=>{l?.(g)})}}return v=$(),C}const Bt="./pulse-data.json",Pt="https://api.pugetsound.onebusaway.org/api/where",ot="TEST".trim()||"TEST",Le=ot==="TEST",Ye=3,Ke=800,qt=Le?2e4:5e3,Xe=Le?12e4:3e4,_t=1100,Ut=Le?45e3:15e3,Ht=Le?9e4:3e4,Ft=4e3,Vt=15e3,Gt=520,Ze=4*6e4,rt="link-pulse-theme",lt="link-pulse-language",re="link",ye={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},Je={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}};function Wt(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function jt(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function ne(e,t,a){return Math.max(t,Math.min(e,a))}function ce(e){return new Promise(t=>window.setTimeout(t,e))}function Ne(e){const[t="0",a="0",i="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(i)}function Yt(e,t){if(!e)return t("waitingSnapshot");const a=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return a<10?t("updatedNow"):a<60?t("updatedSecondsAgo",a):t("updatedMinutesAgo",Math.round(a/60))}function Kt(e){return new Intl.DateTimeFormat(e==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:e!=="zh-CN"}).format(new Date)}function Xt(e,t,a){if(e<=0)return a("arriving");const i=Math.floor(e/60),n=e%60;return t==="zh-CN"?i>0?`${i}分 ${n}秒`:`${n}秒`:i>0?`${i}m ${n}s`:`${n}s`}function Zt(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function fe(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function ae(e,t){if(!e||!t)return null;const[a,i,n]=e.split("-").map(Number),o=Ne(t),l=Math.floor(o/3600),d=Math.floor(o%3600/60),v=o%60;return new Date(a,i-1,n,l,d,v)}function Jt(e,t){const a=Math.max(0,Math.round(e/6e4)),i=Math.floor(a/60),n=a%60;return t==="zh-CN"?i&&n?`${i}小时${n}分钟`:i?`${i}小时`:`${n}分钟`:i&&n?`${i}h ${n}m`:i?`${i}h`:`${n}m`}function Qt(e,t){if(!e)return"";const[a="0",i="0"]=String(e).split(":"),n=Number(a),o=Number(i),l=(n%24+24)%24;if(t==="zh-CN")return`${String(l).padStart(2,"0")}:${String(o).padStart(2,"0")}`;const d=l>=12?"PM":"AM";return`${l%12||12}:${String(o).padStart(2,"0")} ${d}`}function ea(e,t){return new Date(e).toLocaleTimeString(t==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:t!=="zh-CN"})}function ta(e,t){return ea(Date.now()+Math.max(0,e)*1e3,t)}function aa(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function ia(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function na(e,t){const a=[...e].sort((o,l)=>o.minutePosition-l.minutePosition),i=[...t].sort((o,l)=>o.minutePosition-l.minutePosition),n=o=>o.slice(1).map((l,d)=>Math.round(l.minutePosition-o[d].minutePosition));return{nbGaps:n(a),sbGaps:n(i)}}function sa(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((n,o)=>n+o,0)/e.length,a=Math.max(...e),i=Math.min(...e);return{avg:Math.round(t),max:a,min:i,spread:a-i,ratio:a/Math.max(i,1)}}function oa(e,t){const a=sa(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let i="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?i="bunched":a.max>=12||a.spread>=6?i="uneven":a.avg>=18&&(i="sparse"),{health:i,stats:a}}function ra(e){return e.reduce((t,a)=>{const i=Number(a.scheduleDeviation??0);return i<=60?t.onTime+=1:i<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function la(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function ca({worstGap:e,severeLateCount:t,alertCount:a,balanceDelta:i,language:n}){const o=[];return e>=12&&o.push({key:"gap",tone:"alert",label:n==="zh-CN"?"大间隔":"Large gap"}),t>0&&o.push({key:"late",tone:"warn",label:n==="zh-CN"?"严重晚点":"Severe late"}),a>0&&o.push({key:"alert",tone:"info",label:n==="zh-CN"?"有告警":"Alerted"}),i>=2&&o.push({key:"balance",tone:"warn",label:n==="zh-CN"?"方向失衡":"Imbalanced"}),o.length||o.push({key:"healthy",tone:"healthy",label:n==="zh-CN"?"健康":"Healthy"}),o}function da(e){function t(){const o=Math.max(0,e.obaRateLimitStreak-1),l=Math.min(Xe,qt*2**o),d=Math.round(l*(.15+Math.random()*.2));return Math.min(Xe,l+d)}async function a(){const o=e.obaCooldownUntil-Date.now();o>0&&await ce(o)}function i(o){return o?.code===429||/rate limit/i.test(o?.text??"")}async function n(o,l){for(let d=0;d<=Ye;d+=1){await a();let v=null,C=null,$=null;try{v=await fetch(o,{cache:"no-store"})}catch(m){$=m}if(v!==null)try{C=await v.json()}catch{C=null}const g=v?.status===429||i(C);if(v?.ok&&!g)return e.obaRateLimitStreak=0,e.obaCooldownUntil=0,C;const I=$!=null||v!=null&&(v.status===429||v.status>=500&&v.status<600);if(d===Ye||!I)throw $||(C?.text?new Error(C.text):new Error(`${l} request failed with ${v?.status??"network error"}`));if(g){e.obaRateLimitStreak+=1;const m=Ke*2**d,L=Math.max(m,t());e.obaCooldownUntil=Date.now()+L,await ce(L)}else{const m=Ke*2**d;await ce(m)}}throw new Error(`${l} request failed`)}return{fetchJsonWithRetry:n,isRateLimitedPayload:i,waitForObaCooldown:a}}function ua(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}function ga(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function pa(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase(),i=t.nextStopTimeOffset??0,n=t.scheduleDeviation??0,o=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||o&&Math.abs(i)<=90?"ARR":n>=120?"DELAY":"OK"}function ma(e,t,{language:a,copyValue:i}){if(!t)return{text:i("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:i("onTime"),colorClass:"status-ontime"};if(e>60){const n=Math.round(e/60);let o="status-late-minor";return e>600?o="status-late-severe":e>300&&(o="status-late-moderate"),{text:a==="zh-CN"?`晚点 ${n} 分钟`:`+${n} min late`,colorClass:o}}if(e<-60){const n=Math.round(Math.abs(e)/60);return{text:a==="zh-CN"?`早到 ${n} 分钟`:`${n} min early`,colorClass:"status-early"}}return{text:i("unknown"),colorClass:"status-muted"}}function ha(e,t,a,i,{language:n,copyValue:o}){const l=e.tripStatus?.activeTripId??e.tripId??"",d=i.get(l);if(!d||d.routeId!==t.routeKey)return null;const v=e.tripStatus?.closestStop,C=e.tripStatus?.nextStop,$=a.stationIndexByStopId.get(v),g=a.stationIndexByStopId.get(C);if($==null&&g==null)return null;let I=$??g,m=g??$;if(I>m){const p=I;I=m,m=p}const L=a.stations[I],N=a.stations[m],M=e.tripStatus?.closestStopTimeOffset??0,G=e.tripStatus?.nextStopTimeOffset??0,H=d.directionId==="1"?"▲":d.directionId==="0"?"▼":ga($,g);let O=0;I!==m&&M<0&&G>0&&(O=ne(Math.abs(M)/(Math.abs(M)+G),0,1));const k=L.y+(N.y-L.y)*O,B=I!==m?L.segmentMinutes:0,U=L.cumulativeMinutes+B*O,R=$??g??I,P=a.stations[R]??L,W=H==="▲",K=ne(R+(W?1:-1),0,a.stations.length-1),E=$!=null&&g!=null&&$!==g?g:ne(R+(W?-1:1),0,a.stations.length-1),F=a.stations[K]??P,D=a.stations[E]??N,f=e.tripStatus?.scheduleDeviation??0,b=e.tripStatus?.predicted??!1,z=ma(f,b,{language:n,copyValue:o});return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:H,fromLabel:L.label,minutePosition:U,progress:O,serviceStatus:pa(e),toLabel:N.label,y:k,currentLabel:L.label,nextLabel:N.label,previousLabel:F.label,currentStopLabel:P.label,upcomingLabel:D.label,currentIndex:R,upcomingStopIndex:E,status:e.tripStatus?.status??"",closestStop:v,nextStop:C,closestOffset:M,nextOffset:G,scheduleDeviation:f,isPredicted:b,delayInfo:z,rawVehicle:e}}function fa(e){const{state:t,getAlertsForLine:a,getAlertsForStation:i,getTodayServiceSpan:n,getVehicleGhostTrail:o,getVehicleLabel:l,getVehicleLabelPlural:d,copyValue:v,renderInlineAlerts:C,renderLineStatusMarquee:$,renderServiceReminderChip:g}=e;function I(m){const L=t.layouts.get(m.id),N=t.vehiclesByLine.get(m.id)??[],M=a(m.id),G=L.stations.map((k,B)=>{const U=L.stations[B-1],R=B>0?U.segmentMinutes:"",W=i(k,m).length>0,K=k.isTerminal?15:10;return`
          <g transform="translate(0, ${k.y})" class="station-group${W?" has-alert":""}" data-stop-id="${k.id}" style="cursor: pointer;">
            ${B>0?`<text x="0" y="-14" class="segment-time">${R}</text>
                   <line x1="18" x2="${L.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
            <circle cx="${L.trackX}" cy="0" r="${k.isTerminal?11:5}" class="${k.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${m.color};"></circle>
            ${k.isTerminal?`<text x="${L.trackX}" y="4" text-anchor="middle" class="terminal-mark">${m.name[0]}</text>`:""}
            ${W?`<circle cx="${L.trackX+K}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
            <text x="${L.labelX}" y="5" class="station-label">${k.label}</text>
            <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
          </g>
        `}).join(""),H=N.map((k,B)=>{const U=o(m.id,k.id);return`
          <g transform="translate(${L.trackX}, 0)" class="train" data-train-id="${k.id}">
            ${U.map((R,P)=>`
                  <circle
                    cy="${R.y+(B%3-1)*1.5}"
                    r="${Math.max(3,7-P)}"
                    class="train-ghost-dot"
                    style="--line-color:${m.color}; --ghost-opacity:${Math.max(.18,.56-P*.1)};"
                  ></circle>
                `).join("")}
            <g transform="translate(0, ${k.y+(B%3-1)*1.5})">
              <circle r="13" class="train-wave" style="--line-color:${m.color}; animation-delay:${B*.18}s;"></circle>
              <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${k.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${m.color};"></path>
            </g>
          </g>
        `}).join(""),O=l();return`
      <article class="line-card" data-line-id="${m.id}">
        <header class="line-card-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:${m.color};">${m.name[0]}</span>
            <div class="line-title-copy">
              <div class="line-title-row">
                <h2>${m.name}</h2>
                ${C(M,m.id)}
              </div>
              <p>${v("liveCount",N.length,N.length===1?O.toLowerCase():d().toLowerCase())}</p>
              <p>${n(m)}</p>
            </div>
          </div>
          ${g(m)}
        </header>
        ${$(m.color,N.map(k=>({...k,lineToken:m.name[0]})))}
        <svg viewBox="0 0 460 ${L.height}" class="line-diagram" role="img" aria-label="${t.language==="zh-CN"?`${m.name} 实时线路图`:`${m.name} live LED board`}">
          <line x1="${L.trackX}" x2="${L.trackX}" y1="${L.stations[0].y}" y2="${L.stations.at(-1).y}" class="spine" style="--line-color:${m.color};"></line>
          ${G}
          ${H}
        </svg>
      </article>
    `}return{renderLine:I}}function va(e){const{state:t,copyValue:a,formatArrivalTime:i,formatDirectionLabel:n,formatEtaClockFromNow:o,formatVehicleLocationSummary:l,getAlertsForLine:d,getAllVehicles:v,getRealtimeOffset:C,getTodayServiceSpan:$,getVehicleDestinationLabel:g,getVehicleLabel:I,getVehicleLabelPlural:m,getVehicleStatusClass:L,renderFocusMetrics:N,renderInlineAlerts:M,renderLineStatusMarquee:G,renderServiceReminderChip:H,formatVehicleStatus:O}=e;function k(){const B=v().sort((E,F)=>E.minutePosition-F.minutePosition),U=I(),R=m(),P=R.toLowerCase();return B.length?(t.compactLayout?t.lines.filter(E=>E.id===t.activeLineId):t.lines).map(E=>{const F=B.filter(c=>c.lineId===E.id),D=d(E.id),f=[...F].sort((c,y)=>C(c.nextOffset??0)-C(y.nextOffset??0)),b=f[0]??null,z=f.slice(1),p=c=>`
          <span class="train-direction-badge">
            ${n(c.directionSymbol,g(c,t.layouts.get(c.lineId)),{includeSymbol:!0})}
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
                <p class="train-list-subtitle">${a("toDestination",g(c,t.layouts.get(c.lineId)))}</p>
                <p class="train-list-status ${L(c,C(c.nextOffset??0))}" data-vehicle-status="${c.id}">${O(c)}</p>
              </div>
            </div>
            <div class="train-queue-side">
              <p class="train-queue-time">${i(C(c.nextOffset??0))}</p>
              <p class="train-queue-clock">${o(C(c.nextOffset??0))}</p>
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
                    ${M(D,E.id)}
                  </div>
                  <p>${a("inServiceCount",F.length,F.length===1?U.toLowerCase():m().toLowerCase())} · ${$(E)}</p>
                </div>
              </div>
              ${H(E)}
            </header>
            ${G(E.color,F)}
            <div class="line-readout train-columns train-stack-layout">
              ${b?`
                    <article class="train-focus-card train-list-item" data-train-id="${b.id}">
                      <div class="train-focus-header">
                        <div>
                          <p class="train-focus-kicker">${t.language==="zh-CN"?"最近一班":"Next up"}</p>
                          <div class="train-list-row">
                            <p class="train-focus-title">${b.lineName} ${U} ${b.label}</p>
                            ${p(b)}
                          </div>
                        </div>
                        <div class="train-focus-side">
                          <p class="train-focus-time">${i(C(b.nextOffset??0))}</p>
                          <p class="train-focus-clock">${o(C(b.nextOffset??0))}</p>
                        </div>
                      </div>
                      <p class="train-focus-destination">${a("toDestination",g(b,t.layouts.get(b.lineId)))}</p>
                      <p class="train-focus-segment">${l(b)}</p>
                      ${N(b)}
                      <p class="train-list-status ${L(b,C(b.nextOffset??0))}" data-vehicle-status="${b.id}">${O(b)}</p>
                    </article>
                  `:`<p class="train-readout muted">${a("noLiveVehicles",m().toLowerCase())}</p>`}
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
      `}return{renderTrainList:k}}function ya(e){const{state:t,classifyHeadwayHealth:a,computeLineHeadways:i,copyValue:n,formatCurrentTime:o,formatLayoutDirectionLabel:l,formatPercent:d,getActiveSystemMeta:v,getAlertsForLine:C,getDelayBuckets:$,getLineAttentionReasons:g,getInsightsTickerPageSize:I,getRealtimeOffset:m,getTodayServiceSpan:L,getVehicleLabel:N,getVehicleLabelPlural:M,renderServiceReminderChip:G,renderServiceTimeline:H}=e;function O(p,r){if(!p.length||r<2)return{averageText:"—",detailText:t.language==="zh-CN"?`${M()}数量不足，无法判断间隔`:`Too few ${M().toLowerCase()} for a spacing read`};const c=Math.round(p.reduce((w,S)=>w+S,0)/p.length),y=Math.min(...p),h=Math.max(...p);return{averageText:`~${c} min`,detailText:t.language==="zh-CN"?`观测间隔 ${y}-${h} 分钟`:`${y}-${h} min observed gap`}}function k(p,r,c){const{averageText:y,detailText:h}=O(r,c);return`
      <div class="headway-health-card">
        <p class="headway-health-label">${p}</p>
        <p class="headway-health-value">${y}</p>
        <p class="headway-health-copy">${h}</p>
      </div>
    `}function B(p,r){return Math.abs(p.length-r.length)<=1?{label:t.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:p.length>r.length?{label:t.language==="zh-CN"?"北向偏多":"Northbound heavier",tone:"warn"}:{label:t.language==="zh-CN"?"南向偏多":"Southbound heavier",tone:"warn"}}function U(p,r){return`
      <div class="delay-distribution">
        ${[[t.language==="zh-CN"?"准点":"On time",p.onTime,"healthy"],[t.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",p.minorLate,"warn"],[t.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",p.severeLate,"alert"]].map(([y,h,w])=>`
          <div class="delay-chip delay-chip-${w}">
            <p class="delay-chip-label">${y}</p>
            <p class="delay-chip-value">${h}</p>
            <p class="delay-chip-copy">${d(h,r)}</p>
          </div>
        `).join("")}
      </div>
    `}function R(p,r,c,y){if(!r.length)return`
        <div class="flow-lane">
          <div class="flow-lane-header">
            <p class="flow-lane-title">${p}</p>
            <p class="flow-lane-copy">${n("noLiveVehicles",M().toLowerCase())}</p>
          </div>
        </div>
      `;const h=[...r].sort((S,x)=>S.minutePosition-x.minutePosition),w=h.map(S=>{const x=c.totalMinutes>0?S.minutePosition/c.totalMinutes:0;return Math.max(0,Math.min(100,x*100))});return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${p}</p>
          <p class="flow-lane-copy">${n("liveCount",h.length,h.length===1?N().toLowerCase():M().toLowerCase())}</p>
        </div>
        <div class="flow-track" style="--line-color:${y};">
          ${w.map((S,x)=>`
            <span
              class="flow-vehicle"
              style="left:${S}%; --line-color:${y};"
              title="${h[x].label}"
            ></span>
          `).join("")}
        </div>
      </div>
    `}function P(p,r,c,y){const h=[],w=t.layouts.get(p.id),S=l("▲",w,{includeSymbol:!0}),x=l("▼",w,{includeSymbol:!0}),{stats:A}=a(i(r,[]).nbGaps,r.length),{stats:q}=a(i([],c).sbGaps,c.length),V=[...r,...c].filter(Q=>Number(Q.scheduleDeviation??0)>300),J=Math.abs(r.length-c.length);return A.max!=null&&A.max>=12&&h.push({tone:"alert",copy:t.language==="zh-CN"?`${S} 当前有 ${A.max} 分钟的服务空档。`:`${S} has a ${A.max} min service hole right now.`}),q.max!=null&&q.max>=12&&h.push({tone:"alert",copy:t.language==="zh-CN"?`${x} 当前有 ${q.max} 分钟的服务空档。`:`${x} has a ${q.max} min service hole right now.`}),J>=2&&h.push({tone:"warn",copy:r.length>c.length?t.language==="zh-CN"?`车辆分布向 ${S} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${S} by ${J}.`:t.language==="zh-CN"?`车辆分布向 ${x} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${x} by ${J}.`}),V.length&&h.push({tone:"warn",copy:t.language==="zh-CN"?`${V.length} 辆${V.length===1?N().toLowerCase():M().toLowerCase()}晚点超过 5 分钟。`:`${V.length} ${V.length===1?N().toLowerCase():M().toLowerCase()} are running 5+ min late.`}),y.length&&h.push({tone:"info",copy:t.language==="zh-CN"?`${p.name} 当前受 ${y.length} 条告警影响。`:`${y.length} active alert${y.length===1?"":"s"} affecting ${p.name}.`}),h.length||h.push({tone:"healthy",copy:t.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),h.slice(0,4)}function W(p){return p.map(r=>{const c=t.layouts.get(r.id),y=t.vehiclesByLine.get(r.id)??[],h=y.filter(x=>x.directionSymbol==="▲"),w=y.filter(x=>x.directionSymbol==="▼"),S=C(r.id);return{line:r,layout:c,vehicles:y,nb:h,sb:w,lineAlerts:S,exceptions:P(r,h,w,S)}})}function K(p){return`
      <div class="attention-reason-badges">
        ${p.map(r=>`<span class="attention-reason-badge attention-reason-badge-${r.tone}">${r.label}</span>`).join("")}
      </div>
    `}function E(p){const r=p.length,c=p.reduce((T,Y)=>T+Y.vehicles.length,0),y=p.reduce((T,Y)=>T+Y.lineAlerts.length,0),h=p.filter(T=>T.lineAlerts.length>0).length,w=new Set(p.flatMap(T=>T.lineAlerts.flatMap(Y=>Y.stopIds??[]))).size,S=p.flatMap(T=>T.vehicles),x=$(S),A=p.map(T=>{const{nbGaps:Y,sbGaps:Ce}=i(T.nb,T.sb),De=[...Y,...Ce].length?Math.max(...Y,...Ce):0,me=T.vehicles.filter(le=>Number(le.scheduleDeviation??0)>300).length,We=Math.abs(T.nb.length-T.sb.length),xt=a(Y,T.nb.length).health,At=a(Ce,T.sb.length).health,It=[xt,At].some(le=>le==="uneven"||le==="bunched"||le==="sparse"),Nt=me>0,Mt=T.lineAlerts.length*5+me*3+Math.max(0,De-10),kt=g({worstGap:De,severeLateCount:me,alertCount:T.lineAlerts.length,balanceDelta:We,language:t.language});return{line:T.line,score:Mt,worstGap:De,severeLateCount:me,alertCount:T.lineAlerts.length,balanceDelta:We,hasSevereLate:Nt,isUneven:It,attentionReasons:kt}}).sort((T,Y)=>Y.score-T.score||Y.worstGap-T.worstGap),q=new Set(A.filter(T=>T.hasSevereLate).map(T=>T.line.id)),V=new Set(A.filter(T=>T.isUneven).map(T=>T.line.id)),J=A.filter(T=>T.hasSevereLate&&!T.isUneven).length,Q=A.filter(T=>T.isUneven&&!T.hasSevereLate).length,te=A.filter(T=>T.hasSevereLate&&T.isUneven).length,Ge=new Set([...q,...V]).size,Tt=Math.max(0,r-Ge),Ct=c?Math.round(x.onTime/c*100):null,Dt=A.filter(T=>T.score>0).slice(0,2);let pe={tone:"healthy",copy:t.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const _=A[0]??null;return _?.alertCount?pe={tone:"info",copy:t.language==="zh-CN"?`${_.line.name} 当前有 ${_.alertCount} 条生效告警。`:`${_.line.name} has ${_.alertCount} active alert${_.alertCount===1?"":"s"}.`}:_?.worstGap>=12?pe={tone:"alert",copy:t.language==="zh-CN"?`当前最大实时间隔为空 ${_.line.name} 的 ${_.worstGap} 分钟。`:`Largest live gap: ${_.worstGap} min on ${_.line.name}.`}:_?.severeLateCount&&(pe={tone:"warn",copy:t.language==="zh-CN"?`${_.line.name} 有 ${_.severeLateCount} 辆${_.severeLateCount===1?N().toLowerCase():M().toLowerCase()}晚点超过 5 分钟。`:`${_.line.name} has ${_.severeLateCount} ${_.severeLateCount===1?N().toLowerCase():M().toLowerCase()} running 5+ min late.`}),{totalLines:r,totalVehicles:c,totalAlerts:y,impactedLines:h,impactedStopCount:w,delayedLineIds:q,unevenLineIds:V,lateOnlyLineCount:J,unevenOnlyLineCount:Q,mixedIssueLineCount:te,attentionLineCount:Ge,healthyLineCount:Tt,onTimeRate:Ct,rankedLines:A,priorityLines:Dt,topIssue:pe}}function F(p,r,{suffix:c="",invert:y=!1}={}){if(p==null||r==null||p===r)return t.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const h=p-r,w=y?h<0:h>0,S=h>0?"↑":"↓";return t.language==="zh-CN"?`${w?"改善":"变差"} ${S} ${Math.abs(h)}${c}`:`${w?"Improving":"Worse"} ${S} ${Math.abs(h)}${c}`}function D(p){const r=E(p),c=t.systemSnapshots.get(t.activeSystemId)?.previous??null,y=[];r.totalAlerts>0&&y.push({tone:"info",copy:t.language==="zh-CN"?`${r.impactedLines} 条线路共受 ${r.totalAlerts} 条告警影响。`:`${r.totalAlerts} active alert${r.totalAlerts===1?"":"s"} across ${r.impactedLines} line${r.impactedLines===1?"":"s"}.`}),r.delayedLineIds.size>0&&y.push({tone:"warn",copy:t.language==="zh-CN"?`${r.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${r.delayedLineIds.size} line${r.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),r.unevenLineIds.size>0&&y.push({tone:"alert",copy:t.language==="zh-CN"?`${r.unevenLineIds.size} 条线路当前发车间隔不均。`:`${r.unevenLineIds.size} line${r.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),y.length||y.push({tone:"healthy",copy:t.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const h=[{label:t.language==="zh-CN"?"准点率":"On-Time Rate",value:r.onTimeRate!=null?`${r.onTimeRate}%`:"—",delta:F(r.onTimeRate,c?.onTimeRate,{suffix:"%"})},{label:t.language==="zh-CN"?"需关注线路":"Attention Lines",value:r.attentionLineCount,delta:F(r.attentionLineCount,c?.attentionLineCount,{invert:!0})}];return`
      <article class="panel-card panel-card-wide system-summary-card">
        <header class="panel-header"><div class="system-summary-header"><div class="line-title"><span class="line-token" style="--line-color:var(--accent-strong);">${v().label[0]}</span><div class="line-title-copy"><h2>${v().label} ${t.language==="zh-CN"?"概览":"Summary"}</h2><p>${t.language==="zh-CN"?`系统内 ${r.totalLines} 条线路 · 更新于 ${o()}`:`${r.totalLines} line${r.totalLines===1?"":"s"} in system · Updated ${o()}`}</p></div></div></div></header>
        <div class="system-summary-hero"><div class="insight-exception insight-exception-${r.topIssue.tone}"><p>${r.topIssue.copy}</p></div><div class="system-trend-strip">${h.map(w=>`<div class="metric-chip system-trend-chip"><p class="metric-chip-label">${w.label}</p><p class="metric-chip-value">${w.value}</p><p class="system-trend-copy">${w.delta}</p></div>`).join("")}</div></div>
        <div class="metric-strip system-summary-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"健康线路":"Healthy Lines"}</p><p class="metric-chip-value">${r.healthyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?`实时${M()}`:`Live ${M()}`}</p><p class="metric-chip-value">${r.totalVehicles}</p></div><div class="metric-chip ${r.totalAlerts?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"告警":"Alerts"}</p><p class="metric-chip-value">${r.totalAlerts}</p></div><div class="metric-chip ${r.attentionLineCount?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"需关注线路":"Lines Needing Attention"}</p><p class="metric-chip-value">${r.attentionLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"影响站点":"Impacted Stops"}</p><p class="metric-chip-value">${r.impactedStopCount}</p></div></div>
        <div class="system-composition"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"需关注线路构成":"Attention Breakdown"}</p><p class="headway-chart-copy">${t.language==="zh-CN"?"按晚点与间隔异常拆解":"Split by lateness and spacing issues"}</p></div><div class="attention-breakdown-grid"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅晚点":"Late Only"}</p><p class="metric-chip-value">${r.lateOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅间隔不均":"Spacing Only"}</p><p class="metric-chip-value">${r.unevenOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"两者都有":"Both"}</p><p class="metric-chip-value">${r.mixedIssueLineCount}</p></div></div></div>
        <div class="system-priority"><div class="insight-exceptions-header">${t.language==="zh-CN"?"":'<p class="headway-chart-title">Recommended Next</p>'}<p class="headway-chart-copy">${t.language==="zh-CN"?"基于当前快照的综合优先级":"Best next checks from the current snapshot"}</p></div><div class="system-priority-list">${(r.priorityLines.length?r.priorityLines:r.rankedLines.slice(0,1)).map(({line:w,worstGap:S,severeLateCount:x,alertCount:A,attentionReasons:q})=>`<div class="system-priority-item"><div class="line-title"><span class="line-token" style="--line-color:${w.color};">${w.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${w.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`${S?`最大间隔 ${S} 分钟`:"当前无明显间隔问题"}${x?` · ${x} 辆严重晚点`:""}${A?` · ${A} 条告警`:""}`:`${S?`Gap ${S} min`:"No major spacing issue"}${x?` · ${x} severe late`:""}${A?` · ${A} alert${A===1?"":"s"}`:""}`}</p>${K(q)}</div></div></div>`).join("")}</div></div>
        <div class="system-ranking"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"关注排名":"Attention Ranking"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div><div class="system-ranking-list">${r.rankedLines.slice(0,3).map(({line:w,score:S,worstGap:x,alertCount:A,severeLateCount:q,attentionReasons:V})=>`<div class="system-ranking-item"><div class="line-title"><span class="line-token" style="--line-color:${w.color};">${w.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${w.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`评分 ${S}${x?` · 最大间隔 ${x} 分钟`:""}${A?` · ${A} 条告警`:""}${q?` · ${q} 辆严重晚点`:""}`:`Score ${S}${x?` · gap ${x} min`:""}${A?` · ${A} alert${A===1?"":"s"}`:""}${q?` · ${q} severe late`:""}`}</p>${K(V)}</div></div></div>`).join("")}</div></div>
        <div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"系统状态":"System Status"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div>${y.map(w=>`<div class="insight-exception insight-exception-${w.tone}"><p>${w.copy}</p></div>`).join("")}</div>
      </article>
    `}function f(p){const r=p.flatMap(S=>S.exceptions.map(x=>({tone:x.tone,copy:`${S.line.name}: ${x.copy}`,lineColor:S.line.color})));if(!r.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport"><span class="insights-ticker-item insights-ticker-item-healthy">${t.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span></div></section>
    `;const c=I(),y=Math.ceil(r.length/c),h=t.insightsTickerIndex%y,w=r.slice(h*c,h*c+c);return`
      <section class="insights-ticker" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport">${w.map(S=>`<span class="insights-ticker-item insights-ticker-item-${S.tone} insights-ticker-item-animated"><span class="insights-ticker-dot" style="--line-color:${S.lineColor};"></span><span class="insights-ticker-copy">${S.copy}</span></span>`).join("")}</div></section>
    `}function b(p,r,c,y,h){const w=c.length+y.length;if(!w)return"";const{nbGaps:S,sbGaps:x}=i(c,y),A=$([...c,...y]),q=[...S,...x].length?Math.max(...S,...x):null,V=B(c,y),J=P(p,c,y,h),Q=new Set(h.flatMap(te=>te.stopIds??[])).size;return`
      <div class="line-insights"><div class="metric-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"运营中":"In Service"}</p><p class="metric-chip-value">${w}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"准点率":"On-Time Rate"}</p><p class="metric-chip-value">${d(A.onTime,w)}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"最大间隔":"Worst Gap"}</p><p class="metric-chip-value">${q!=null?`${q} min`:"—"}</p></div><div class="metric-chip metric-chip-${V.tone}"><p class="metric-chip-label">${t.language==="zh-CN"?"方向平衡":"Balance"}</p><p class="metric-chip-value">${V.label}</p></div></div><div class="headway-health-grid">${k(l("▲",r,{includeSymbol:!0}),S,c.length)}${k(l("▼",r,{includeSymbol:!0}),x,y.length)}</div>${U(A,w)}<div class="flow-grid">${R(t.language==="zh-CN"?`${l("▲",r,{includeSymbol:!0})} 流向`:`${l("▲",r,{includeSymbol:!0})} flow`,c,r,p.color)}${R(t.language==="zh-CN"?`${l("▼",r,{includeSymbol:!0})} 流向`:`${l("▼",r,{includeSymbol:!0})} flow`,y,r,p.color)}</div><div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"当前":"Now"}</p><p class="headway-chart-copy">${h.length?t.language==="zh-CN"?`${h.length} 条生效告警${Q?` · 影响 ${Q} 个站点`:""}`:`${h.length} active alert${h.length===1?"":"s"}${Q?` · ${Q} impacted stops`:""}`:t.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p></div>${J.map(te=>`<div class="insight-exception insight-exception-${te.tone}"><p>${te.copy}</p></div>`).join("")}</div></div>
    `}function z(p){const r=W(t.lines),c=N(),y=W(p);return`
      ${f(y)}
      ${D(r)}
      ${y.map(({line:h,layout:w,vehicles:S,nb:x,sb:A,lineAlerts:q})=>{const V=b(h,w,x,A,q);return`
          <article class="panel-card panel-card-wide">
            <header class="panel-header line-card-header"><div class="line-title"><span class="line-token" style="--line-color:${h.color};">${h.name[0]}</span><div class="line-title-copy"><h2>${h.name}</h2><p>${n("liveCount",S.length,S.length===1?N().toLowerCase():M().toLowerCase())} · ${L(h)}</p></div></div>${G(h)}</header>
            ${H(h)}
            ${V||`<p class="train-readout muted">${t.language==="zh-CN"?`等待实时${c.toLowerCase()}数据…`:`Waiting for live ${c.toLowerCase()} data…`}</p>`}
          </article>
        `}).join("")}
    `}return{renderInsightsBoard:z}}function $a(){return{dialog:document.querySelector("#station-dialog"),dialogTitle:document.querySelector("#dialog-title"),dialogTitleTrack:document.querySelector("#dialog-title-track"),dialogTitleText:document.querySelector("#dialog-title-text"),dialogTitleTextClone:document.querySelector("#dialog-title-text-clone"),dialogServiceSummary:document.querySelector("#dialog-service-summary"),dialogStatusPillElement:document.querySelector("#dialog-status-pill"),dialogUpdatedAtElement:document.querySelector("#dialog-updated-at"),dialogDisplay:document.querySelector("#dialog-display"),dialogDirectionTabs:[...document.querySelectorAll("[data-dialog-direction]")],arrivalsTitleNb:document.querySelector("#arrivals-title-nb"),arrivalsTitleSb:document.querySelector("#arrivals-title-sb"),stationAlertsContainer:document.querySelector("#station-alerts-container"),transferSection:document.querySelector("#transfer-section"),arrivalsSectionNb:document.querySelector('[data-direction-section="nb"]'),arrivalsNbPinned:document.querySelector("#arrivals-nb-pinned"),arrivalsNb:document.querySelector("#arrivals-nb"),arrivalsSectionSb:document.querySelector('[data-direction-section="sb"]'),arrivalsSbPinned:document.querySelector("#arrivals-sb-pinned"),arrivalsSb:document.querySelector("#arrivals-sb"),trainDialog:document.querySelector("#train-dialog"),trainDialogTitle:document.querySelector("#train-dialog-title"),trainDialogSubtitle:document.querySelector("#train-dialog-subtitle"),trainDialogLine:document.querySelector("#train-dialog-line"),trainDialogStatus:document.querySelector("#train-dialog-status"),trainDialogClose:document.querySelector("#train-dialog-close"),alertDialog:document.querySelector("#alert-dialog"),alertDialogTitle:document.querySelector("#alert-dialog-title"),alertDialogSubtitle:document.querySelector("#alert-dialog-subtitle"),alertDialogLines:document.querySelector("#alert-dialog-lines"),alertDialogBody:document.querySelector("#alert-dialog-body"),alertDialogLink:document.querySelector("#alert-dialog-link"),alertDialogClose:document.querySelector("#alert-dialog-close")}}function ba({state:e,elements:t,copyValue:a,refreshStationDialog:i,clearStationParam:n}){const{dialog:o,dialogTitle:l,dialogTitleTrack:d,dialogTitleText:v,dialogTitleTextClone:C,dialogDisplay:$,dialogDirectionTabs:g,arrivalsSectionNb:I,arrivalsNb:m,arrivalsSectionSb:L,arrivalsSb:N}=t;function M(f){e.dialogDisplayMode=f,o.classList.toggle("is-display-mode",f),$.textContent=a(f?"exit":"board"),$.setAttribute("aria-label",a(f?"exit":"board")),e.dialogDisplayDirection="both",e.dialogDisplayAutoPhase="nb",B(),o.open&&e.currentDialogStation&&i(e.currentDialogStation).catch(console.error),D(),W()}function G(){M(!e.dialogDisplayMode)}function H(){e.dialogDisplayDirectionTimer&&(window.clearInterval(e.dialogDisplayDirectionTimer),e.dialogDisplayDirectionTimer=0)}function O(){e.dialogDisplayDirectionAnimationTimer&&(window.clearTimeout(e.dialogDisplayDirectionAnimationTimer),e.dialogDisplayDirectionAnimationTimer=0),e.dialogDisplayAnimatingDirection="",I?.classList.remove("is-direction-animating"),L?.classList.remove("is-direction-animating")}function k(f){if(!e.dialogDisplayMode||!f||f==="both")return;O(),e.dialogDisplayAnimatingDirection=f;const b=f==="nb"?I:L;b&&(b.offsetWidth,b.classList.add("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=window.setTimeout(()=>{b.classList.remove("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=0,e.dialogDisplayAnimatingDirection===f&&(e.dialogDisplayAnimatingDirection="")},Gt))}function B({animate:f=!1}={}){H(),O();const b=e.dialogDisplayDirection,z=b==="auto"?e.dialogDisplayAutoPhase:b;g.forEach(p=>{p.classList.toggle("is-active",p.dataset.dialogDirection===b)}),o.classList.toggle("show-nb-only",e.dialogDisplayMode&&z==="nb"),o.classList.toggle("show-sb-only",e.dialogDisplayMode&&z==="sb"),f&&k(z),e.dialogDisplayMode&&b==="auto"&&(e.dialogDisplayDirectionTimer=window.setInterval(()=>{e.dialogDisplayAutoPhase=e.dialogDisplayAutoPhase==="nb"?"sb":"nb",B({animate:!0})},Vt))}function U(){e.dialogRefreshTimer&&(window.clearTimeout(e.dialogRefreshTimer),e.dialogRefreshTimer=0)}function R(){e.dialogDisplayTimer&&(window.clearInterval(e.dialogDisplayTimer),e.dialogDisplayTimer=0)}function P(f,b){const z=[...f.querySelectorAll(".arrival-item:not(.muted)")];if(f.style.transform="translateY(0)",!e.dialogDisplayMode||z.length<=3)return;const p=Number.parseFloat(window.getComputedStyle(f).rowGap||"0")||0,r=z[0].getBoundingClientRect().height+p,c=Math.max(0,z.length-3),y=Math.min(e.dialogDisplayIndexes[b],c);f.style.transform=`translateY(-${y*r}px)`}function W(){R(),e.dialogDisplayIndexes={nb:0,sb:0},P(m,"nb"),P(N,"sb"),e.dialogDisplayMode&&(e.dialogDisplayTimer=window.setInterval(()=>{for(const[f,b]of[["nb",m],["sb",N]]){const z=[...b.querySelectorAll(".arrival-item:not(.muted)")];if(z.length<=3)continue;const p=Math.max(0,z.length-3);e.dialogDisplayIndexes[f]=e.dialogDisplayIndexes[f]>=p?0:e.dialogDisplayIndexes[f]+1,P(b,f)}},Ft))}function K(){if(U(),!e.currentDialogStation)return;const f=()=>{e.dialogRefreshTimer=window.setTimeout(async()=>{!o.open||!e.currentDialogStation||(await i(e.currentDialogStation).catch(console.error),f())},Ht)};f()}function E(){e.currentDialogStationId="",e.currentDialogStation=null,o.open?o.close():(U(),R(),H(),M(!1),n())}function F(f){v.textContent=f,C.textContent=f,D()}function D(){const f=l;if(!f||!d)return;const z=e.dialogDisplayMode&&o.open&&v.scrollWidth>f.clientWidth;f.classList.toggle("is-marquee",z)}return{setDialogDisplayMode:M,toggleDialogDisplayMode:G,stopDialogDirectionRotation:H,stopDialogDirectionAnimation:O,renderDialogDirectionView:B,stopDialogAutoRefresh:U,stopDialogDisplayScroll:R,applyDialogDisplayOffset:P,syncDialogDisplayScroll:W,startDialogAutoRefresh:K,closeStationDialog:E,setDialogTitle:F,syncDialogTitleMarquee:D}}function Sa({state:e,elements:t,copyValue:a,formatAlertSeverity:i,formatAlertEffect:n,getAlertsForLine:o,getDirectionBaseLabel:l,getVehicleLabel:d,getVehicleDestinationLabel:v,getTrainTimelineEntries:C,getStatusTone:$,getVehicleStatusPills:g,renderStatusPills:I,formatArrivalTime:m}){const{trainDialog:L,trainDialogTitle:N,trainDialogSubtitle:M,trainDialogLine:G,trainDialogStatus:H,alertDialog:O,alertDialogTitle:k,alertDialogSubtitle:B,alertDialogLines:U,alertDialogBody:R,alertDialogLink:P}=t;function W(){e.currentTrainId="",L.open&&L.close()}function K(){O.open&&O.close()}function E(D){const f=o(D.id);k.textContent=a("affectedLineAlerts",D.name,f.length),B.textContent=a("activeAlerts",f.length),U.textContent=D.name,R.textContent="",R.innerHTML=f.length?f.map(b=>`
              <article class="alert-dialog-item">
                <p class="alert-dialog-item-meta">${i(b.severity)} • ${n(b.effect)}</p>
                <p class="alert-dialog-item-title">${b.title||a("serviceAlert")}</p>
                <p class="alert-dialog-item-copy">${b.description||a("noAdditionalAlertDetails")}</p>
                ${b.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${b.url}" target="_blank" rel="noreferrer">${a("readOfficialAlert")}</a></p>`:""}
              </article>
            `).join(""):`<p class="alert-dialog-item-copy">${a("noActiveAlerts")}</p>`,P.hidden=!0,P.removeAttribute("href"),O.open||O.showModal()}function F(D){const f=D.fromLabel!==D.toLabel&&D.progress>0&&D.progress<1,b=f?D.fromLabel:D.previousLabel,z=f?`${D.fromLabel} -> ${D.toLabel}`:D.currentStopLabel,p=f?"Between":"Now",r=f?D.toLabel:D.upcomingLabel,c=f?D.progress:.5,y=e.layouts.get(D.lineId),h=C(D,y),w=y?v(D,y):D.upcomingLabel,S=h.at(-1)?.etaSeconds??Math.max(0,D.nextOffset??0),x=l(D.directionSymbol);N.textContent=`${D.lineName} ${d()} ${D.label}`,M.textContent=e.language==="zh-CN"?`${x} · ${a("toDestination",w)}`:`${x} to ${w}`,H.className=`train-detail-status train-list-status-${$(D.serviceStatus)}`,H.innerHTML=I(g(D)),L.querySelector(".train-eta-panel")?.remove(),G.innerHTML=`
      <div class="train-detail-spine" style="--line-color:${D.lineColor};"></div>
      <div
        class="train-detail-marker-floating"
        style="--line-color:${D.lineColor}; --segment-progress:${c}; --direction-offset:${D.directionSymbol==="▼"?"10px":"-10px"};"
      >
        <span class="train-detail-vehicle-marker">
          <svg viewBox="-10 -10 20 20" class="train-detail-arrow" aria-hidden="true">
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${D.directionSymbol==="▼"?"rotate(180)":""}"></path>
          </svg>
        </span>
      </div>
      <div class="train-detail-stop">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${a("previous")}</p>
          <p class="train-detail-name">${b}</p>
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
    `,G.insertAdjacentHTML("afterend",`
        <section class="train-eta-panel">
          <div class="train-eta-summary">
            <div class="metric-chip">
              <p class="metric-chip-label">${a("direction")}</p>
              <p class="metric-chip-value">${x}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${a("terminal")}</p>
              <p class="metric-chip-value">${w}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${a("etaToTerminal")}</p>
              <p class="metric-chip-value">${m(S)}</p>
            </div>
          </div>
          <div class="train-eta-timeline">
            <div class="train-eta-header">
              <p class="train-detail-label">${a("upcomingStops")}</p>
              <p class="train-eta-header-copy">${a("liveEtaNow")}</p>
            </div>
            ${h.length?h.map(A=>`
                    <article class="train-eta-stop${A.isNext?" is-next":""}${A.isTerminal?" is-terminal":""}">
                      <div>
                        <p class="train-eta-stop-label">${A.isNext?a("nextStop"):A.isTerminal?a("terminal"):a("upcoming")}</p>
                        <p class="train-eta-stop-name">${A.label}</p>
                      </div>
                      <div class="train-eta-stop-side">
                        <p class="train-eta-stop-countdown">${m(A.etaSeconds)}</p>
                        <p class="train-eta-stop-clock">${A.clockTime}</p>
                      </div>
                    </article>
                  `).join(""):`<p class="train-readout muted">${a("noDownstreamEta")}</p>`}
          </div>
        </section>
      `),L.open||L.showModal()}return{closeTrainDialog:W,closeAlertDialog:K,renderAlertListDialog:E,renderTrainDialog:F}}const s={fetchedAt:"",error:"",activeSystemId:re,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayDirectionAnimationTimer:0,dialogDisplayAnimatingDirection:"",dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},wa=Ot({immediate:!0,onNeedRefresh(){wa(!0)}});document.querySelector("#app").innerHTML=`
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
`;const ee=document.querySelector("#board"),La=document.querySelector("#screen-kicker"),Ta=document.querySelector("#screen-title"),xe=document.querySelector("#system-bar"),Ca=document.querySelector("#view-bar"),Me=[...document.querySelectorAll(".tab-button")],ke=document.querySelector("#language-toggle"),Ee=document.querySelector("#theme-toggle"),ve=document.querySelector("#status-pill"),Da=document.querySelector("#current-time"),Re=document.querySelector("#updated-at"),Pe=$a(),{dialog:$e,dialogServiceSummary:xa,dialogStatusPillElement:Qe,dialogUpdatedAtElement:Aa,dialogDisplay:ze,dialogDirectionTabs:Ia,arrivalsTitleNb:Na,arrivalsTitleSb:Ma,trainDialog:Oe,trainDialogClose:ct,alertDialog:Be,alertDialogLink:ka,alertDialogClose:dt}=Pe;ze.addEventListener("click",()=>ni());ct.addEventListener("click",()=>He());dt.addEventListener("click",()=>Fe());ke.addEventListener("click",()=>{ht(s.language==="en"?"zh-CN":"en"),Z()});Ia.forEach(e=>{e.addEventListener("click",()=>{s.dialogDisplayDirection=e.dataset.dialogDirection,s.dialogDisplayDirection==="auto"&&(s.dialogDisplayAutoPhase="nb"),oi()})});$e.addEventListener("click",e=>{e.target===$e&&St()});Oe.addEventListener("click",e=>{e.target===Oe&&He()});Be.addEventListener("click",e=>{e.target===Be&&Fe()});$e.addEventListener("close",()=>{ri(),li(),si(),ii(!1),s.isSyncingFromUrl||bt()});Me.forEach(e=>{e.addEventListener("click",()=>{s.activeTab=e.dataset.tab,Z()})});Ee.addEventListener("click",()=>{mt(s.theme==="dark"?"light":"dark"),Z()});function de(){return ye[s.activeSystemId]??ye[re]}function Ea(){return s.systemsById.get(s.activeSystemId)?.agencyId??ye[re].agencyId}function Ra(){return`${Pt}/vehicles-for-agency/${Ea()}.json?key=${ot}`}function se(){return s.language==="zh-CN"?de().vehicleLabel==="Train"?"列车":"公交":de().vehicleLabel??"Vehicle"}function Te(){return s.language==="zh-CN"?se():de().vehicleLabelPlural??Wt(se())}function za(){return Je[s.language]??Je.en}function u(e,...t){const a=za()[e];return typeof a=="function"?a(...t):a}const{fetchJsonWithRetry:Oa}=da(s);function Ba(e){return Yt(e,u)}function ut(){return Kt(s.language)}function oe(e){return Xt(e,s.language,u)}function he(e){return Jt(e,s.language)}function X(e){return Qt(e,s.language)}function Pa(e){return ta(e,s.language)}function gt(e,t=!1){const a=t&&(e==="▲"||e==="▼")?`${e} `:"";return e==="▲"?`${a}${s.language==="zh-CN"?"北向":"Northbound"}`:e==="▼"?`${a}${s.language==="zh-CN"?"南向":"Southbound"}`:u("active")}function be(e,t="",{includeSymbol:a=!1}={}){const i=gt(e,a);return t?s.language==="zh-CN"?`${i} · 开往 ${t}`:`${i} to ${t}`:i}function pt(e,t){if(!t?.stations?.length)return"";const a=e==="▲"?0:e==="▼"?t.stations.length-1:-1;return a<0?"":t.stations[a]?.label??""}function qa(e,t,a={}){return be(e,pt(e,t),a)}function et(e){const t=[...new Set(e.map(i=>i?.trim()).filter(Boolean))];if(!t.length)return"";const a=t.slice(0,2);return t.length>2&&a.push(s.language==="zh-CN"?"等":"etc."),a.join(" / ")}function tt(e,t=[],a=s.currentDialogStation){const i=t.map(l=>l.destination),n=et(i);if(n)return n;if(!a)return"";const o=ei(a).map(({line:l})=>s.layouts.get(l.id)).map(l=>pt(e,l));return et(o)}function _a(){const e=window.localStorage.getItem(rt);return e==="light"||e==="dark"?e:"dark"}function Ua(){const e=window.localStorage.getItem(lt);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function mt(e){s.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(rt,e)}function ht(e){s.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=s.language,window.localStorage.setItem(lt,s.language)}function at(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);s.compactLayout=i<=_t}function Se(){const a=window.getComputedStyle(ee).gridTemplateColumns.split(" ").map(i=>i.trim()).filter(Boolean).length<=1;a!==s.compactLayout&&(s.compactLayout=a,Z())}function qe(e){const t=Zt(),a=e.serviceSpansByDate?.[t];return a?u("todayServiceSpan",X(a.start),X(a.end)):u("todayServiceUnavailable")}function Ha(e){const t=new Date,a=fe(-1),i=fe(0),n=fe(1),o=e.serviceSpansByDate?.[a],l=e.serviceSpansByDate?.[i],d=e.serviceSpansByDate?.[n],C=[o&&{kind:"yesterday",start:ae(a,o.start),end:ae(a,o.end),span:o},l&&{kind:"today",start:ae(i,l.start),end:ae(i,l.end),span:l}].filter(Boolean).find($=>t>=$.start&&t<=$.end);if(C)return{tone:"active",headline:u("lastTrip",X(C.span.end)),detail:u("endsIn",he(C.end.getTime()-t.getTime())),compact:u("endsIn",he(C.end.getTime()-t.getTime()))};if(l){const $=ae(i,l.start),g=ae(i,l.end);if(t<$)return{tone:"upcoming",headline:u("firstTrip",X(l.start)),detail:u("startsIn",he($.getTime()-t.getTime())),compact:u("startsIn",he($.getTime()-t.getTime()))};if(t>g)return{tone:"ended",headline:u("serviceEnded",X(l.end)),detail:d?u("nextStart",X(d.start)):u("noNextServiceLoaded"),compact:d?u("nextStart",X(d.start)):u("ended")}}return d?{tone:"upcoming",headline:u("nextFirstTrip",X(d.start)),detail:u("noServiceRemainingToday"),compact:u("nextStart",X(d.start))}:{tone:"muted",headline:u("serviceHoursUnavailable"),detail:u("staticScheduleMissing"),compact:u("unavailable")}}function _e(e){const t=Ha(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function Fa(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function Va(e){const t=fe(0),a=e.serviceSpansByDate?.[t];if(!a)return null;const i=Ne(a.start)/3600,n=Ne(a.end)/3600,o=Fa(new Date),l=Math.max(24,n,o,1);return{startHours:i,endHours:n,nowHours:o,axisMax:l,startLabel:X(a.start),endLabel:X(a.end)}}function Ga(e){const t=Va(e);if(!t)return"";const a=ne(t.startHours/t.axisMax*100,0,100),i=ne(t.endHours/t.axisMax*100,a,100),n=ne(t.nowHours/t.axisMax*100,0,100),o=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
    <section class="service-timeline-card">
      <div class="service-timeline-header">
        <div>
          <p class="headway-chart-title">${s.language==="zh-CN"?"今日运营时间带":"Today Service Window"}</p>
          <p class="headway-chart-copy">${s.language==="zh-CN"?"首末班与当前时刻":"First trip, last trip, and current time"}</p>
        </div>
        <span class="service-timeline-badge ${o?"is-live":"is-off"}">${o?s.language==="zh-CN"?"运营中":"In service":s.language==="zh-CN"?"未运营":"Off hours"}</span>
      </div>
      <div class="service-timeline-track">
        <div class="service-timeline-band" style="left:${a}%; width:${Math.max(2,i-a)}%;"></div>
        <div class="service-timeline-now" style="left:${n}%;">
          <span class="service-timeline-now-dot"></span>
          <span class="service-timeline-now-label">${s.language==="zh-CN"?"当前":"Now"}</span>
        </div>
      </div>
      <div class="service-timeline-labels">
        <span>${t.startLabel}</span>
        <span>${t.endLabel}</span>
      </div>
    </section>
  `}function ge(e){return s.alerts.filter(t=>t.lineIds.includes(e))}function Wa(e,t){const a=ge(t.id);if(!a.length)return[];const i=new Set(Qa(e,t));return i.add(e.id),a.filter(n=>n.stopIds.length>0&&n.stopIds.some(o=>i.has(o)))}function ft(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${u("alertsWord",e.length)}</span>
    </button>
  `:""}function ja(e){const t=[...e.stops].sort((g,I)=>I.sequence-g.sequence),a=48,i=44,n=28,o=88,l=122,d=i+n+(t.length-1)*a,v=new Map,C=t.map((g,I)=>{const m={...g,label:jt(g.name),y:i+I*a,index:I,isTerminal:I===0||I===t.length-1};v.set(g.id,I),v.set(`${e.agencyId}_${g.id}`,I);for(const L of e.stationAliases?.[g.id]??[])v.set(L,I),v.set(`${e.agencyId}_${L}`,I);return m});let $=0;for(let g=0;g<C.length;g+=1)C[g].cumulativeMinutes=$,$+=g<C.length-1?C[g].segmentMinutes:0;return{totalMinutes:$,height:d,labelX:l,stationGap:a,stationIndexByStopId:v,stations:C,trackX:o}}function Ya(e){switch(e){case"ARR":return u("arrivingStatus");case"DELAY":return u("delayedStatus");case"OK":return u("enRoute");default:return""}}function j(e){if(!s.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(s.fetchedAt).getTime())/1e3));return e-t}function ue(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function Ue(e){const t=j(e.nextOffset??0),a=j(e.closestOffset??0),i=e.delayInfo.text;return t<=15?[{text:u("arrivingNow"),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:u("arrivingIn",oe(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:u("nextStopIn",oe(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:[{text:Ya(e.serviceStatus),toneClass:ue(e,t)},{text:i,toneClass:e.delayInfo.colorClass}]}function ie(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function vt(e){const t=j(e.nextOffset??0),a=j(e.closestOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel,[n,o]=Ue(e);return t<=15?`${e.label} at ${i} ${ie([n,o])}`:t<=90?`${e.label} at ${i} ${ie([n,o])}`:a<0&&t>0?`${e.label} ${i} ${ie([n,o])}`:`${e.label} to ${i} ${ie([n,o])}`}function yt(e){return ie(Ue(e))}function $t(e,t){if(!t.length)return"";const a=[...t].sort((n,o)=>j(n.nextOffset??0)-j(o.nextOffset??0)).slice(0,8),i=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${i.map(n=>`
          <span
            class="line-marquee-item ${ue(n,j(n.nextOffset??0))}"
            data-vehicle-marquee="${n.id}"
          >
            <span class="line-marquee-token">${n.lineToken}</span>
            <span class="line-marquee-copy">${vt(n)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function Ka(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const i=a.dataset.vehicleStatus,n=we().find(l=>l.id===i);if(!n)return;const o=j(n.nextOffset??0);a.innerHTML=yt(n),a.className=`train-list-status ${ue(n,o)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const i=a.dataset.vehicleMarquee,n=we().find(d=>d.id===i);if(!n)return;const o=j(n.nextOffset??0);a.className=`line-marquee-item ${ue(n,o)}`;const l=a.querySelector(".line-marquee-copy");l&&(l.innerHTML=vt(n))})}function Xa(e){return e.fromLabel===e.toLabel||e.progress===0?s.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:s.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function Za(e){const t=s.layouts.get(e.lineId),a=Math.max(0,getTrainTimelineEntries(e,t).at(-1)?.etaSeconds??e.nextOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${s.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${i}</p>
        <p class="train-focus-metric-copy">${oe(j(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${s.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${getVehicleDestinationLabel(e,t)}</p>
        <p class="train-focus-metric-copy">${oe(j(a))}</p>
      </div>
    </div>
  `}function we(){return s.lines.flatMap(e=>(s.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function Ja(){return Object.values(ye).filter(e=>s.systemsById.has(e.id)).map(e=>`
        <button
          class="tab-button ${e.id===s.activeSystemId?"is-active":""}"
          data-system-switch="${e.id}"
          type="button"
        >
          ${e.label}
        </button>
      `).join("")}function Ae(){return!s.compactLayout||s.lines.length<2?"":`<section class="line-switcher">${s.lines.map(t=>`
        <button
          class="line-switcher-button ${t.id===s.activeLineId?"is-active":""}"
          data-line-switch="${t.id}"
          type="button"
          style="--line-color:${t.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <span>${t.name}</span>
        </button>
      `).join("")}</section>`}function it(){return s.compactLayout?s.lines.filter(e=>e.id===s.activeLineId):s.lines}function Qa(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const i=new Set;for(const o of a){const l=o.startsWith(`${t.agencyId}_`)?o:`${t.agencyId}_${o}`;i.add(l)}const n=e.id.replace(/-T\d+$/,"");return i.add(n.startsWith(`${t.agencyId}_`)?n:`${t.agencyId}_${n}`),[...i]}function ei(e){const t=s.lines.map(a=>{const i=a.stops.find(n=>n.id===e.id);return i?{line:a,station:i}:null}).filter(Boolean);return t.length>0?t:s.lines.map(a=>{const i=a.stops.find(n=>n.name===e.name);return i?{line:a,station:i}:null}).filter(Boolean)}function bt(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function nt(e){const t=new URL(window.location.href);e===re?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function ti(){const t=new URL(window.location.href).searchParams.get("system");return t&&s.systemsById.has(t)?t:re}const ai=ba({state:s,elements:Pe,copyValue:u,refreshStationDialog:e=>refreshStationDialog(e),clearStationParam:bt}),{setDialogDisplayMode:ii,toggleDialogDisplayMode:ni,stopDialogDirectionRotation:si,renderDialogDirectionView:oi,stopDialogAutoRefresh:ri,stopDialogDisplayScroll:li,closeStationDialog:St,setDialogTitle:ci,syncDialogTitleMarquee:di}=ai;function ui(e,t){const a=Date.now(),i=new Set;for(const n of t){const o=`${e}:${n.id}`;i.add(o);const d=[...(s.vehicleGhosts.get(o)??[]).filter(v=>a-v.timestamp<=Ze),{y:n.y,minutePosition:n.minutePosition,timestamp:a}].slice(-6);s.vehicleGhosts.set(o,d)}for(const[n,o]of s.vehicleGhosts.entries()){if(!n.startsWith(`${e}:`))continue;const l=o.filter(d=>a-d.timestamp<=Ze);if(!i.has(n)||l.length===0){s.vehicleGhosts.delete(n);continue}l.length!==o.length&&s.vehicleGhosts.set(n,l)}}function gi(e,t){return(s.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}const{renderLine:pi}=fa({state:s,getAlertsForLine:ge,getAlertsForStation:Wa,getTodayServiceSpan:qe,getVehicleGhostTrail:gi,getVehicleLabel:se,getVehicleLabelPlural:Te,copyValue:u,renderInlineAlerts:ft,renderLineStatusMarquee:$t,renderServiceReminderChip:_e}),{renderTrainList:mi}=va({state:s,copyValue:u,formatArrivalTime:oe,formatDirectionLabel:be,formatEtaClockFromNow:Pa,formatVehicleLocationSummary:Xa,getAlertsForLine:ge,getAllVehicles:we,getRealtimeOffset:j,getTodayServiceSpan:qe,getVehicleDestinationLabel,getVehicleLabel:se,getVehicleLabelPlural:Te,getVehicleStatusClass:ue,renderFocusMetrics:Za,renderInlineAlerts:ft,renderLineStatusMarquee:$t,renderServiceReminderChip:_e,formatVehicleStatus:yt}),{renderInsightsBoard:hi}=ya({state:s,classifyHeadwayHealth:oa,computeLineHeadways:na,copyValue:u,formatCurrentTime:ut,formatLayoutDirectionLabel:qa,formatPercent:la,getActiveSystemMeta:de,getAlertsForLine:ge,getDelayBuckets:ra,getLineAttentionReasons:ca,getInsightsTickerPageSize,getRealtimeOffset:j,getTodayServiceSpan:qe,getVehicleLabel:se,getVehicleLabelPlural:Te,renderServiceReminderChip:_e,renderServiceTimeline:Ga});function fi(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await Ti(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function Ie(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{s.activeLineId=t.dataset.lineSwitch,Z()})})}const vi=Sa({state:s,elements:Pe,copyValue:u,formatAlertSeverity:ia,formatAlertEffect:aa,getAlertsForLine:e=>ge(e),getDirectionBaseLabel:gt,getVehicleLabel:se,getVehicleDestinationLabel,getTrainTimelineEntries,getStatusTone:ua,getVehicleStatusPills:Ue,renderStatusPills:ie,formatArrivalTime:oe}),{closeTrainDialog:He,closeAlertDialog:Fe,renderTrainDialog:yi}=vi;function st(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,i=we().find(n=>n.id===a);i&&(s.currentTrainId=a,yi(i))})})}function $i(){s.lines.forEach(e=>{const t=s.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.stopId,l=t.stations.find(d=>d.id===o);l&&showStationDialog(l)})})})}function Z(){const e=de();if(document.documentElement.lang=s.language,ke.textContent=u("languageToggle"),ke.setAttribute("aria-label",u("languageToggleAria")),Ee.textContent=s.theme==="dark"?u("themeLight"):u("themeDark"),Ee.setAttribute("aria-label",u("themeToggleAria")),La.textContent=e.kicker,Ta.textContent=e.title,xe.setAttribute("aria-label",u("transitSystems")),Ca.setAttribute("aria-label",u("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",u("boardDirectionView")),Na.textContent=be("▲",tt("▲"),{includeSymbol:!0}),Ma.textContent=be("▼",tt("▼"),{includeSymbol:!0}),ze.textContent=s.dialogDisplayMode?u("exit"):u("board"),ze.setAttribute("aria-label",s.dialogDisplayMode?u("exit"):u("board")),ct.setAttribute("aria-label",u("closeTrainDialog")),dt.setAttribute("aria-label",u("closeAlertDialog")),$e.open||(ci(u("station")),xa.textContent=u("serviceSummary")),Oe.open||(trainDialogTitle.textContent=u("train"),trainDialogSubtitle.textContent=u("currentMovement")),Be.open||(alertDialogTitle.textContent=u("serviceAlert"),alertDialogSubtitle.textContent=u("transitAdvisory")),ka.textContent=u("readOfficialAlert"),xe.hidden=s.systemsById.size<2,xe.innerHTML=Ja(),wt(),Me.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===s.activeTab)),Me.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=u("tabMap")),t.dataset.tab==="trains"&&(t.textContent=Te()),t.dataset.tab==="insights"&&(t.textContent=u("tabInsights"))}),fi(),s.activeTab==="map"){ee.className="board";const t=it();ee.innerHTML=`${Ae()}${t.map(pi).join("")}`,Ie(),attachAlertClickHandlers(),$i(),st(),queueMicrotask(Se);return}if(s.activeTab==="trains"){ee.className="board",ee.innerHTML=`${Ae()}${mi()}`,Ie(),attachAlertClickHandlers(),st(),queueMicrotask(Se);return}if(s.activeTab==="insights"){ee.className="board";const t=it();ee.innerHTML=`${Ae()}${hi(t)}`,Ie()}}function bi(){window.clearInterval(s.insightsTickerTimer),s.insightsTickerTimer=0}function Si(){bi(),s.insightsTickerTimer=window.setInterval(()=>{s.insightsTickerIndex+=1,s.activeTab==="insights"&&Z()},5e3)}function wt(){ve.textContent=s.error?u("statusHold"):u("statusSync"),ve.classList.toggle("status-pill-error",!!s.error),Da.textContent=`${u("nowPrefix")} ${ut()}`,Re.textContent=s.error?s.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":Ba(s.fetchedAt),Qe.textContent=ve.textContent,Qe.classList.toggle("status-pill-error",!!s.error),Aa.textContent=Re.textContent}function wi(){window.clearTimeout(s.liveRefreshTimer),s.liveRefreshTimer=0}function Li(){wi();const e=()=>{s.liveRefreshTimer=window.setTimeout(async()=>{await Ve(),e()},Ut)};e()}function Lt(e){const t=s.systemsById.has(e)?e:re,a=s.systemsById.get(t);s.activeSystemId=t,s.lines=a?.lines??[],s.layouts=s.layoutsBySystem.get(t)??new Map,s.lines.some(i=>i.id===s.activeLineId)||(s.activeLineId=s.lines[0]?.id??""),s.vehiclesByLine=new Map,s.rawVehicles=[],s.arrivalsCache.clear(),s.alerts=[],s.error="",s.fetchedAt="",s.insightsTickerIndex=0,s.vehicleGhosts=new Map}async function Ti(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!s.systemsById.has(e)||s.activeSystemId===e){t&&nt(s.activeSystemId);return}Lt(e),a||St(),He(),Fe(),Z(),t&&nt(e),await Ve()}async function Ci(){for(let a=0;a<=4;a+=1){let i=null,n=null;try{i=await fetch(Bt,{cache:"no-store"}),n=await i.json()}catch(l){if(a===4)throw l;await ce(1e3*2**a);continue}if(!i.ok){if(a===4)throw new Error(`Static data load failed with ${i.status}`);await ce(1e3*2**a);continue}const o=n.systems??[];s.systemsById=new Map(o.map(l=>[l.id,l])),s.layoutsBySystem=new Map(o.map(l=>[l.id,new Map(l.lines.map(d=>[d.id,ja(d)]))])),Lt(ti());return}}function Di(e){const t=[...new Set((e.allAffects??[]).map(i=>i.routeId).filter(Boolean))],a=s.lines.filter(i=>t.includes(getLineRouteId(i))).map(i=>i.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??u("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(i=>i.stopId).filter(Boolean))]}:null}async function Ve(){try{const e=await Oa(Ra(),"Realtime");s.error="",s.fetchedAt=new Date().toISOString(),s.rawVehicles=e.data.list??[],s.alerts=(e.data.references?.situations??[]).map(Di).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(n=>[n.id,n]));for(const n of s.lines){const o=s.layouts.get(n.id),l=s.rawVehicles.map(d=>ha(d,n,o,t,{language:s.language,copyValue:u})).filter(Boolean);s.vehiclesByLine.set(n.id,l),ui(n.id,l)}const a=computeSystemSummaryMetrics(buildInsightsItems(s.lines)),i=s.systemSnapshots.get(s.activeSystemId);s.systemSnapshots.set(s.activeSystemId,{previous:i?.current??null,current:a})}catch(e){s.error=u("realtimeOffline"),console.error(e)}Z()}async function xi(){ht(Ua()),mt(_a()),at(),await Ci(),Z(),await Ve(),await syncDialogFromUrl(),window.addEventListener("popstate",()=>{syncDialogFromUrl().catch(console.error)});const e=()=>{const a=s.compactLayout;if(at(),di(),a!==s.compactLayout){Z();return}Se()};window.addEventListener("resize",e),window.visualViewport?.addEventListener("resize",e),new ResizeObserver(()=>{Se()}).observe(ee),Li(),Si(),window.setInterval(()=>{wt(),refreshArrivalCountdowns(),Ka()},1e3)}xi().catch(e=>{ve.textContent=u("statusFail"),Re.textContent=e.message});
