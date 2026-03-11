(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function i(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=i(a);fetch(a.href,o)}})();const kt="modulepreload",Et=function(e){return"/link/dev/"+e},We={},Rt=function(t,i,n){let a=Promise.resolve();if(i&&i.length>0){let S=function(y){return Promise.all(y.map(u=>Promise.resolve(u).then(D=>({status:"fulfilled",value:D}),D=>({status:"rejected",reason:D}))))};var l=S;document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),m=d?.nonce||d?.getAttribute("nonce");a=S(i.map(y=>{if(y=Et(y),y in We)return;We[y]=!0;const u=y.endsWith(".css"),D=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${y}"]${D}`))return;const I=document.createElement("link");if(I.rel=u?"stylesheet":kt,u||(I.as="script"),I.crossOrigin="",I.href=y,m&&I.setAttribute("nonce",m),document.head.appendChild(I),u)return new Promise((M,f)=>{I.addEventListener("load",M),I.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${y}`)))})}))}function o(d){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=d,window.dispatchEvent(m),!m.defaultPrevented)throw d}return a.then(d=>{for(const m of d||[])m.status==="rejected"&&o(m.reason);return t().catch(o)})};function zt(e={}){const{immediate:t=!1,onNeedRefresh:i,onOfflineReady:n,onRegistered:a,onRegisteredSW:o,onRegisterError:l}=e;let d,m;const S=async(u=!0)=>{await m};async function y(){if("serviceWorker"in navigator){if(d=await Rt(async()=>{const{Workbox:u}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:u}},[]).then(({Workbox:u})=>new u("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(u=>{l?.(u)}),!d)return;d.addEventListener("activated",u=>{(u.isUpdate||u.isExternal)&&window.location.reload()}),d.addEventListener("installed",u=>{u.isUpdate||n?.()}),d.register({immediate:t}).then(u=>{o?o("/link/dev/sw.js",u):a?.(u)}).catch(u=>{l?.(u)})}}return m=y(),S}const Ot="./pulse-data.json",Bt="https://api.pugetsound.onebusaway.org/api/where",st="TEST".trim()||"TEST",Le=st==="TEST",Ye=3,Ke=800,Pt=Le?2e4:5e3,Xe=Le?12e4:3e4,qt=1100,_t=Le?45e3:15e3,Ut=Le?9e4:3e4,Ht=4e3,Ft=15e3,Vt=520,Ze=4*6e4,ot="link-pulse-theme",rt="link-pulse-language",te="link",ye={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},Je={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}};function Gt(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function jt(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function se(e,t,i){return Math.max(t,Math.min(e,i))}function ce(e){return new Promise(t=>window.setTimeout(t,e))}function Ne(e){const[t="0",i="0",n="0"]=String(e).split(":");return Number(t)*3600+Number(i)*60+Number(n)}function Wt(e,t){if(!e)return t("waitingSnapshot");const i=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return i<10?t("updatedNow"):i<60?t("updatedSecondsAgo",i):t("updatedMinutesAgo",Math.round(i/60))}function Yt(e){return new Intl.DateTimeFormat(e==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:e!=="zh-CN"}).format(new Date)}function Kt(e,t,i){if(e<=0)return i("arriving");const n=Math.floor(e/60),a=e%60;return t==="zh-CN"?n>0?`${n}分 ${a}秒`:`${a}秒`:n>0?`${n}m ${a}s`:`${a}s`}function Xt(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function fe(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function ae(e,t){if(!e||!t)return null;const[i,n,a]=e.split("-").map(Number),o=Ne(t),l=Math.floor(o/3600),d=Math.floor(o%3600/60),m=o%60;return new Date(i,n-1,a,l,d,m)}function Zt(e,t){const i=Math.max(0,Math.round(e/6e4)),n=Math.floor(i/60),a=i%60;return t==="zh-CN"?n&&a?`${n}小时${a}分钟`:n?`${n}小时`:`${a}分钟`:n&&a?`${n}h ${a}m`:n?`${n}h`:`${a}m`}function Jt(e,t){if(!e)return"";const[i="0",n="0"]=String(e).split(":"),a=Number(i),o=Number(n),l=(a%24+24)%24;if(t==="zh-CN")return`${String(l).padStart(2,"0")}:${String(o).padStart(2,"0")}`;const d=l>=12?"PM":"AM";return`${l%12||12}:${String(o).padStart(2,"0")} ${d}`}function Qt(e,t){return new Date(e).toLocaleTimeString(t==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:t!=="zh-CN"})}function ei(e,t){return Qt(Date.now()+Math.max(0,e)*1e3,t)}function ti(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function ii(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function ai(e,t){const i=[...e].sort((o,l)=>o.minutePosition-l.minutePosition),n=[...t].sort((o,l)=>o.minutePosition-l.minutePosition),a=o=>o.slice(1).map((l,d)=>Math.round(l.minutePosition-o[d].minutePosition));return{nbGaps:a(i),sbGaps:a(n)}}function ni(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((a,o)=>a+o,0)/e.length,i=Math.max(...e),n=Math.min(...e);return{avg:Math.round(t),max:i,min:n,spread:i-n,ratio:i/Math.max(n,1)}}function si(e,t){const i=ni(e);if(t<2||i.avg==null)return{health:"quiet",stats:i};let n="healthy";return i.max>=12&&i.min<=4||i.ratio>=3?n="bunched":i.max>=12||i.spread>=6?n="uneven":i.avg>=18&&(n="sparse"),{health:n,stats:i}}function oi(e){return e.reduce((t,i)=>{const n=Number(i.scheduleDeviation??0);return n<=60?t.onTime+=1:n<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function ri(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function li({worstGap:e,severeLateCount:t,alertCount:i,balanceDelta:n,language:a}){const o=[];return e>=12&&o.push({key:"gap",tone:"alert",label:a==="zh-CN"?"大间隔":"Large gap"}),t>0&&o.push({key:"late",tone:"warn",label:a==="zh-CN"?"严重晚点":"Severe late"}),i>0&&o.push({key:"alert",tone:"info",label:a==="zh-CN"?"有告警":"Alerted"}),n>=2&&o.push({key:"balance",tone:"warn",label:a==="zh-CN"?"方向失衡":"Imbalanced"}),o.length||o.push({key:"healthy",tone:"healthy",label:a==="zh-CN"?"健康":"Healthy"}),o}function ci(e){function t(){const o=Math.max(0,e.obaRateLimitStreak-1),l=Math.min(Xe,Pt*2**o),d=Math.round(l*(.15+Math.random()*.2));return Math.min(Xe,l+d)}async function i(){const o=e.obaCooldownUntil-Date.now();o>0&&await ce(o)}function n(o){return o?.code===429||/rate limit/i.test(o?.text??"")}async function a(o,l){for(let d=0;d<=Ye;d+=1){await i();let m=null,S=null,y=null;try{m=await fetch(o,{cache:"no-store"})}catch(I){y=I}if(m!==null)try{S=await m.json()}catch{S=null}const u=m?.status===429||n(S);if(m?.ok&&!u)return e.obaRateLimitStreak=0,e.obaCooldownUntil=0,S;const D=y!=null||m!=null&&(m.status===429||m.status>=500&&m.status<600);if(d===Ye||!D)throw y||(S?.text?new Error(S.text):new Error(`${l} request failed with ${m?.status??"network error"}`));if(u){e.obaRateLimitStreak+=1;const I=Ke*2**d,M=Math.max(I,t());e.obaCooldownUntil=Date.now()+M,await ce(M)}else{const I=Ke*2**d;await ce(I)}}throw new Error(`${l} request failed`)}return{fetchJsonWithRetry:a,isRateLimitedPayload:n,waitForObaCooldown:i}}function di(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}function ui(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function gi(e){const t=e.tripStatus??{},i=String(t.status??"").toLowerCase(),n=t.nextStopTimeOffset??0,a=t.scheduleDeviation??0,o=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return i==="approaching"||o&&Math.abs(n)<=90?"ARR":a>=120?"DELAY":"OK"}function pi(e,t,{language:i,copyValue:n}){if(!t)return{text:n("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:n("onTime"),colorClass:"status-ontime"};if(e>60){const a=Math.round(e/60);let o="status-late-minor";return e>600?o="status-late-severe":e>300&&(o="status-late-moderate"),{text:i==="zh-CN"?`晚点 ${a} 分钟`:`+${a} min late`,colorClass:o}}if(e<-60){const a=Math.round(Math.abs(e)/60);return{text:i==="zh-CN"?`早到 ${a} 分钟`:`${a} min early`,colorClass:"status-early"}}return{text:n("unknown"),colorClass:"status-muted"}}function mi(e,t,i,n,{language:a,copyValue:o}){const l=e.tripStatus?.activeTripId??e.tripId??"",d=n.get(l);if(!d||d.routeId!==t.routeKey)return null;const m=e.tripStatus?.closestStop,S=e.tripStatus?.nextStop,y=i.stationIndexByStopId.get(m),u=i.stationIndexByStopId.get(S);if(y==null&&u==null)return null;let D=y??u,I=u??y;if(D>I){const p=D;D=I,I=p}const M=i.stations[D],f=i.stations[I],b=e.tripStatus?.closestStopTimeOffset??0,E=e.tripStatus?.nextStopTimeOffset??0,B=d.directionId==="1"?"▲":d.directionId==="0"?"▼":ui(y,u);let R=0;D!==I&&b<0&&E>0&&(R=se(Math.abs(b)/(Math.abs(b)+E),0,1));const j=M.y+(f.y-M.y)*R,F=D!==I?M.segmentMinutes:0,k=M.cumulativeMinutes+F*R,z=y??u??D,q=i.stations[z]??M,V=B==="▲",W=se(z+(V?1:-1),0,i.stations.length-1),O=y!=null&&u!=null&&y!==u?u:se(z+(V?-1:1),0,i.stations.length-1),H=i.stations[W]??q,x=i.stations[O]??f,v=e.tripStatus?.scheduleDeviation??0,w=e.tripStatus?.predicted??!1,P=pi(v,w,{language:a,copyValue:o});return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:B,fromLabel:M.label,minutePosition:k,progress:R,serviceStatus:gi(e),toLabel:f.label,y:j,currentLabel:M.label,nextLabel:f.label,previousLabel:H.label,currentStopLabel:q.label,upcomingLabel:x.label,currentIndex:z,upcomingStopIndex:O,status:e.tripStatus?.status??"",closestStop:m,nextStop:S,closestOffset:b,nextOffset:E,scheduleDeviation:v,isPredicted:w,delayInfo:P,rawVehicle:e}}function hi(e){const{state:t,getAlertsForLine:i,getAlertsForStation:n,getTodayServiceSpan:a,getVehicleGhostTrail:o,getVehicleLabel:l,getVehicleLabelPlural:d,copyValue:m,renderInlineAlerts:S,renderLineStatusMarquee:y,renderServiceReminderChip:u}=e;function D(f){const b=String(f).trim().split(/\s+/).filter(Boolean);if(b.length<=1||f.length<=16)return[f];const E=Math.ceil(b.length/2),B=b.slice(0,E).join(" "),R=b.slice(E).join(" ");return Math.max(B.length,R.length)>f.length-4?[f]:[B,R]}function I(f,b){const E=D(f.label),B=E.length>1?-5:5,R=`station-label${E.length>1?" station-label-multiline":""}`;return`
      <text x="${b.labelX}" y="${B}" class="${R}">
        ${E.map((j,F)=>`<tspan x="${b.labelX}" dy="${F===0?0:15}">${j}</tspan>`).join("")}
      </text>
    `}function M(f){const b=t.layouts.get(f.id),E=t.vehiclesByLine.get(f.id)??[],B=i(f.id),R=b.stations.map((k,z)=>{const q=b.stations[z-1],V=z>0?q.segmentMinutes:"",O=n(k,f).length>0,H=k.isTerminal?15:10;return`
          <g transform="translate(0, ${k.y})" class="station-group${O?" has-alert":""}" data-stop-id="${k.id}" style="cursor: pointer;">
            ${z>0?`<text x="0" y="-14" class="segment-time">${V}</text>
                   <line x1="18" x2="${b.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
            <circle cx="${b.trackX}" cy="0" r="${k.isTerminal?11:5}" class="${k.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${f.color};"></circle>
            ${k.isTerminal?`<text x="${b.trackX}" y="4" text-anchor="middle" class="terminal-mark">${f.name[0]}</text>`:""}
            ${O?`<circle cx="${b.trackX+H}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
            ${I(k,b)}
            <rect x="0" y="-30" width="420" height="60" fill="transparent" class="station-hitbox"></rect>
          </g>
        `}).join(""),j=E.map((k,z)=>{const q=o(f.id,k.id);return`
          <g transform="translate(${b.trackX}, 0)" class="train" data-train-id="${k.id}">
            ${q.map((V,W)=>`
                  <circle
                    cy="${V.y+(z%3-1)*1.5}"
                    r="${Math.max(3,7-W)}"
                    class="train-ghost-dot"
                    style="--line-color:${f.color}; --ghost-opacity:${Math.max(.18,.56-W*.1)};"
                  ></circle>
                `).join("")}
            <g transform="translate(0, ${k.y+(z%3-1)*1.5})">
              <circle r="13" class="train-wave" style="--line-color:${f.color}; animation-delay:${z*.18}s;"></circle>
              <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${k.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${f.color};"></path>
            </g>
          </g>
        `}).join(""),F=l();return`
      <article class="line-card" data-line-id="${f.id}">
        <header class="line-card-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:${f.color};">${f.name[0]}</span>
            <div class="line-title-copy">
              <div class="line-title-row">
                <h2>${f.name}</h2>
                ${S(B,f.id)}
              </div>
              <p>${m("liveCount",E.length,E.length===1?F.toLowerCase():d().toLowerCase())}</p>
              <p>${a(f)}</p>
            </div>
          </div>
          ${u(f)}
        </header>
        ${y(f.color,E.map(k=>({...k,lineToken:f.name[0]})))}
        <div class="line-diagram-viewport${t.compactLayout?" is-compact":""}" style="--line-diagram-height:${b.height}px;">
          <svg viewBox="0 0 ${t.compactLayout?320:460} ${b.height}" class="line-diagram" role="img" aria-label="${t.language==="zh-CN"?`${f.name} 实时线路图`:`${f.name} live LED board`}">
            <line x1="${b.trackX}" x2="${b.trackX}" y1="${b.stations[0].y}" y2="${b.stations.at(-1).y}" class="spine" style="--line-color:${f.color};"></line>
            ${R}
            ${j}
          </svg>
        </div>
      </article>
    `}return{renderLine:M}}function fi(e){const{state:t,copyValue:i,formatArrivalTime:n,formatDirectionLabel:a,formatEtaClockFromNow:o,formatVehicleLocationSummary:l,getAlertsForLine:d,getAllVehicles:m,getRealtimeOffset:S,getTodayServiceSpan:y,getVehicleDestinationLabel:u,getVehicleLabel:D,getVehicleLabelPlural:I,getVehicleStatusClass:M,renderFocusMetrics:f,renderInlineAlerts:b,renderLineStatusMarquee:E,renderServiceReminderChip:B,formatVehicleStatus:R}=e;function j(){const F=m().sort((O,H)=>O.minutePosition-H.minutePosition),k=D(),z=I(),q=z.toLowerCase();return F.length?(t.compactLayout?t.lines.filter(O=>O.id===t.activeLineId):t.lines).map(O=>{const H=F.filter(c=>c.lineId===O.id),x=d(O.id),v=[...H].sort((c,$)=>S(c.nextOffset??0)-S($.nextOffset??0)),w=v[0]??null,P=v.slice(1),p=c=>`
          <span class="train-direction-badge">
            ${a(c.directionSymbol,u(c,t.layouts.get(c.lineId)),{includeSymbol:!0})}
          </span>
        `,r=c=>`
          <article class="train-list-item train-queue-item" data-train-id="${c.id}">
            <div class="train-list-main">
              <span class="line-token train-list-token" style="--line-color:${c.lineColor};">${c.lineToken}</span>
              <div>
                <div class="train-list-row">
                  <p class="train-list-title">${c.lineName} ${k} ${c.label}</p>
                  ${p(c)}
                </div>
                <p class="train-list-subtitle">${i("toDestination",u(c,t.layouts.get(c.lineId)))}</p>
                <p class="train-list-status ${M(c,S(c.nextOffset??0))}" data-vehicle-status="${c.id}">${R(c)}</p>
              </div>
            </div>
            <div class="train-queue-side">
              <p class="train-queue-time">${n(S(c.nextOffset??0))}</p>
              <p class="train-queue-clock">${o(S(c.nextOffset??0))}</p>
            </div>
          </article>
        `;return`
          <article class="line-card train-line-card">
            <header class="line-card-header train-list-section-header">
              <div class="line-title">
                <span class="line-token" style="--line-color:${O.color};">${O.name[0]}</span>
                <div class="line-title-copy">
                  <div class="line-title-row">
                    <h2>${O.name}</h2>
                    ${b(x,O.id)}
                  </div>
                  <p>${i("inServiceCount",H.length,H.length===1?k.toLowerCase():I().toLowerCase())} · ${y(O)}</p>
                </div>
              </div>
              ${B(O)}
            </header>
            ${E(O.color,H)}
            <div class="line-readout train-columns train-stack-layout">
              ${w?`
                    <article class="train-focus-card train-list-item" data-train-id="${w.id}">
                      <div class="train-focus-header">
                        <div>
                          <p class="train-focus-kicker">${t.language==="zh-CN"?"最近一班":"Next up"}</p>
                          <div class="train-list-row">
                            <p class="train-focus-title">${w.lineName} ${k} ${w.label}</p>
                            ${p(w)}
                          </div>
                        </div>
                        <div class="train-focus-side">
                          <p class="train-focus-time">${n(S(w.nextOffset??0))}</p>
                          <p class="train-focus-clock">${o(S(w.nextOffset??0))}</p>
                        </div>
                      </div>
                      <p class="train-focus-destination">${i("toDestination",u(w,t.layouts.get(w.lineId)))}</p>
                      <p class="train-focus-segment">${l(w)}</p>
                      ${f(w)}
                      <p class="train-list-status ${M(w,S(w.nextOffset??0))}" data-vehicle-status="${w.id}">${R(w)}</p>
                    </article>
                  `:`<p class="train-readout muted">${i("noLiveVehicles",I().toLowerCase())}</p>`}
              ${P.length?`
                    <div class="train-queue-list">
                      <p class="train-queue-heading">${t.language==="zh-CN"?"后续车次":"Following vehicles"}</p>
                      ${P.map(r).join("")}
                    </div>
                  `:""}
            </div>
          </article>
        `}).join(""):`
        <section class="board" style="grid-template-columns: 1fr;">
          <article class="panel-card">
            <h2>${i("activeVehicles",z)}</h2>
            <p>${i("noLiveVehicles",q)}</p>
          </article>
        </section>
      `}return{renderTrainList:j}}function vi(e){const{state:t,classifyHeadwayHealth:i,computeLineHeadways:n,copyValue:a,formatCurrentTime:o,formatLayoutDirectionLabel:l,formatPercent:d,getActiveSystemMeta:m,getAlertsForLine:S,getDelayBuckets:y,getLineAttentionReasons:u,getInsightsTickerPageSize:D,getRealtimeOffset:I,getTodayServiceSpan:M,getVehicleLabel:f,getVehicleLabelPlural:b,renderServiceReminderChip:E,renderServiceTimeline:B}=e;function R(p,r){if(!p.length||r<2)return{averageText:"—",detailText:t.language==="zh-CN"?`${b()}数量不足，无法判断间隔`:`Too few ${b().toLowerCase()} for a spacing read`};const c=Math.round(p.reduce((T,L)=>T+L,0)/p.length),$=Math.min(...p),h=Math.max(...p);return{averageText:`~${c} min`,detailText:t.language==="zh-CN"?`观测间隔 ${$}-${h} 分钟`:`${$}-${h} min observed gap`}}function j(p,r,c){const{averageText:$,detailText:h}=R(r,c);return`
      <div class="headway-health-card">
        <p class="headway-health-label">${p}</p>
        <p class="headway-health-value">${$}</p>
        <p class="headway-health-copy">${h}</p>
      </div>
    `}function F(p,r){return Math.abs(p.length-r.length)<=1?{label:t.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:p.length>r.length?{label:t.language==="zh-CN"?"北向偏多":"Northbound heavier",tone:"warn"}:{label:t.language==="zh-CN"?"南向偏多":"Southbound heavier",tone:"warn"}}function k(p,r){return`
      <div class="delay-distribution">
        ${[[t.language==="zh-CN"?"准点":"On time",p.onTime,"healthy"],[t.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",p.minorLate,"warn"],[t.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",p.severeLate,"alert"]].map(([$,h,T])=>`
          <div class="delay-chip delay-chip-${T}">
            <p class="delay-chip-label">${$}</p>
            <p class="delay-chip-value">${h}</p>
            <p class="delay-chip-copy">${d(h,r)}</p>
          </div>
        `).join("")}
      </div>
    `}function z(p,r,c,$){if(!r.length)return`
        <div class="flow-lane">
          <div class="flow-lane-header">
            <p class="flow-lane-title">${p}</p>
            <p class="flow-lane-copy">${a("noLiveVehicles",b().toLowerCase())}</p>
          </div>
        </div>
      `;const h=[...r].sort((L,A)=>L.minutePosition-A.minutePosition),T=h.map(L=>{const A=c.totalMinutes>0?L.minutePosition/c.totalMinutes:0;return Math.max(0,Math.min(100,A*100))});return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${p}</p>
          <p class="flow-lane-copy">${a("liveCount",h.length,h.length===1?f().toLowerCase():b().toLowerCase())}</p>
        </div>
        <div class="flow-track" style="--line-color:${$};">
          ${T.map((L,A)=>`
            <span
              class="flow-vehicle"
              style="left:${L}%; --line-color:${$};"
              title="${h[A].label}"
            ></span>
          `).join("")}
        </div>
      </div>
    `}function q(p,r,c,$){const h=[],T=t.layouts.get(p.id),L=l("▲",T,{includeSymbol:!0}),A=l("▼",T,{includeSymbol:!0}),{stats:N}=i(n(r,[]).nbGaps,r.length),{stats:_}=i(n([],c).sbGaps,c.length),G=[...r,...c].filter(Q=>Number(Q.scheduleDeviation??0)>300),J=Math.abs(r.length-c.length);return N.max!=null&&N.max>=12&&h.push({tone:"alert",copy:t.language==="zh-CN"?`${L} 当前有 ${N.max} 分钟的服务空档。`:`${L} has a ${N.max} min service hole right now.`}),_.max!=null&&_.max>=12&&h.push({tone:"alert",copy:t.language==="zh-CN"?`${A} 当前有 ${_.max} 分钟的服务空档。`:`${A} has a ${_.max} min service hole right now.`}),J>=2&&h.push({tone:"warn",copy:r.length>c.length?t.language==="zh-CN"?`车辆分布向 ${L} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${L} by ${J}.`:t.language==="zh-CN"?`车辆分布向 ${A} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${A} by ${J}.`}),G.length&&h.push({tone:"warn",copy:t.language==="zh-CN"?`${G.length} 辆${G.length===1?f().toLowerCase():b().toLowerCase()}晚点超过 5 分钟。`:`${G.length} ${G.length===1?f().toLowerCase():b().toLowerCase()} are running 5+ min late.`}),$.length&&h.push({tone:"info",copy:t.language==="zh-CN"?`${p.name} 当前受 ${$.length} 条告警影响。`:`${$.length} active alert${$.length===1?"":"s"} affecting ${p.name}.`}),h.length||h.push({tone:"healthy",copy:t.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),h.slice(0,4)}function V(p){return p.map(r=>{const c=t.layouts.get(r.id),$=t.vehiclesByLine.get(r.id)??[],h=$.filter(A=>A.directionSymbol==="▲"),T=$.filter(A=>A.directionSymbol==="▼"),L=S(r.id);return{line:r,layout:c,vehicles:$,nb:h,sb:T,lineAlerts:L,exceptions:q(r,h,T,L)}})}function W(p){return`
      <div class="attention-reason-badges">
        ${p.map(r=>`<span class="attention-reason-badge attention-reason-badge-${r.tone}">${r.label}</span>`).join("")}
      </div>
    `}function O(p){const r=p.length,c=p.reduce((C,K)=>C+K.vehicles.length,0),$=p.reduce((C,K)=>C+K.lineAlerts.length,0),h=p.filter(C=>C.lineAlerts.length>0).length,T=new Set(p.flatMap(C=>C.lineAlerts.flatMap(K=>K.stopIds??[]))).size,L=p.flatMap(C=>C.vehicles),A=y(L),N=p.map(C=>{const{nbGaps:K,sbGaps:Ce}=n(C.nb,C.sb),De=[...K,...Ce].length?Math.max(...K,...Ce):0,me=C.vehicles.filter(le=>Number(le.scheduleDeviation??0)>300).length,je=Math.abs(C.nb.length-C.sb.length),Dt=i(K,C.nb.length).health,xt=i(Ce,C.sb.length).health,At=[Dt,xt].some(le=>le==="uneven"||le==="bunched"||le==="sparse"),It=me>0,Nt=C.lineAlerts.length*5+me*3+Math.max(0,De-10),Mt=u({worstGap:De,severeLateCount:me,alertCount:C.lineAlerts.length,balanceDelta:je,language:t.language});return{line:C.line,score:Nt,worstGap:De,severeLateCount:me,alertCount:C.lineAlerts.length,balanceDelta:je,hasSevereLate:It,isUneven:At,attentionReasons:Mt}}).sort((C,K)=>K.score-C.score||K.worstGap-C.worstGap),_=new Set(N.filter(C=>C.hasSevereLate).map(C=>C.line.id)),G=new Set(N.filter(C=>C.isUneven).map(C=>C.line.id)),J=N.filter(C=>C.hasSevereLate&&!C.isUneven).length,Q=N.filter(C=>C.isUneven&&!C.hasSevereLate).length,ie=N.filter(C=>C.hasSevereLate&&C.isUneven).length,Ge=new Set([..._,...G]).size,Lt=Math.max(0,r-Ge),Tt=c?Math.round(A.onTime/c*100):null,Ct=N.filter(C=>C.score>0).slice(0,2);let pe={tone:"healthy",copy:t.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const U=N[0]??null;return U?.alertCount?pe={tone:"info",copy:t.language==="zh-CN"?`${U.line.name} 当前有 ${U.alertCount} 条生效告警。`:`${U.line.name} has ${U.alertCount} active alert${U.alertCount===1?"":"s"}.`}:U?.worstGap>=12?pe={tone:"alert",copy:t.language==="zh-CN"?`当前最大实时间隔为空 ${U.line.name} 的 ${U.worstGap} 分钟。`:`Largest live gap: ${U.worstGap} min on ${U.line.name}.`}:U?.severeLateCount&&(pe={tone:"warn",copy:t.language==="zh-CN"?`${U.line.name} 有 ${U.severeLateCount} 辆${U.severeLateCount===1?f().toLowerCase():b().toLowerCase()}晚点超过 5 分钟。`:`${U.line.name} has ${U.severeLateCount} ${U.severeLateCount===1?f().toLowerCase():b().toLowerCase()} running 5+ min late.`}),{totalLines:r,totalVehicles:c,totalAlerts:$,impactedLines:h,impactedStopCount:T,delayedLineIds:_,unevenLineIds:G,lateOnlyLineCount:J,unevenOnlyLineCount:Q,mixedIssueLineCount:ie,attentionLineCount:Ge,healthyLineCount:Lt,onTimeRate:Tt,rankedLines:N,priorityLines:Ct,topIssue:pe}}function H(p,r,{suffix:c="",invert:$=!1}={}){if(p==null||r==null||p===r)return t.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const h=p-r,T=$?h<0:h>0,L=h>0?"↑":"↓";return t.language==="zh-CN"?`${T?"改善":"变差"} ${L} ${Math.abs(h)}${c}`:`${T?"Improving":"Worse"} ${L} ${Math.abs(h)}${c}`}function x(p){const r=O(p),c=t.systemSnapshots.get(t.activeSystemId)?.previous??null,$=[];r.totalAlerts>0&&$.push({tone:"info",copy:t.language==="zh-CN"?`${r.impactedLines} 条线路共受 ${r.totalAlerts} 条告警影响。`:`${r.totalAlerts} active alert${r.totalAlerts===1?"":"s"} across ${r.impactedLines} line${r.impactedLines===1?"":"s"}.`}),r.delayedLineIds.size>0&&$.push({tone:"warn",copy:t.language==="zh-CN"?`${r.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${r.delayedLineIds.size} line${r.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),r.unevenLineIds.size>0&&$.push({tone:"alert",copy:t.language==="zh-CN"?`${r.unevenLineIds.size} 条线路当前发车间隔不均。`:`${r.unevenLineIds.size} line${r.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),$.length||$.push({tone:"healthy",copy:t.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const h=[{label:t.language==="zh-CN"?"准点率":"On-Time Rate",value:r.onTimeRate!=null?`${r.onTimeRate}%`:"—",delta:H(r.onTimeRate,c?.onTimeRate,{suffix:"%"})},{label:t.language==="zh-CN"?"需关注线路":"Attention Lines",value:r.attentionLineCount,delta:H(r.attentionLineCount,c?.attentionLineCount,{invert:!0})}];return`
      <article class="panel-card panel-card-wide system-summary-card">
        <header class="panel-header"><div class="system-summary-header"><div class="line-title"><span class="line-token" style="--line-color:var(--accent-strong);">${m().label[0]}</span><div class="line-title-copy"><h2>${m().label} ${t.language==="zh-CN"?"概览":"Summary"}</h2><p>${t.language==="zh-CN"?`系统内 ${r.totalLines} 条线路 · 更新于 ${o()}`:`${r.totalLines} line${r.totalLines===1?"":"s"} in system · Updated ${o()}`}</p></div></div></div></header>
        <div class="system-summary-hero"><div class="insight-exception insight-exception-${r.topIssue.tone}"><p>${r.topIssue.copy}</p></div><div class="system-trend-strip">${h.map(T=>`<div class="metric-chip system-trend-chip"><p class="metric-chip-label">${T.label}</p><p class="metric-chip-value">${T.value}</p><p class="system-trend-copy">${T.delta}</p></div>`).join("")}</div></div>
        <div class="metric-strip system-summary-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"健康线路":"Healthy Lines"}</p><p class="metric-chip-value">${r.healthyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?`实时${b()}`:`Live ${b()}`}</p><p class="metric-chip-value">${r.totalVehicles}</p></div><div class="metric-chip ${r.totalAlerts?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"告警":"Alerts"}</p><p class="metric-chip-value">${r.totalAlerts}</p></div><div class="metric-chip ${r.attentionLineCount?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"需关注线路":"Lines Needing Attention"}</p><p class="metric-chip-value">${r.attentionLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"影响站点":"Impacted Stops"}</p><p class="metric-chip-value">${r.impactedStopCount}</p></div></div>
        <div class="system-composition"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"需关注线路构成":"Attention Breakdown"}</p><p class="headway-chart-copy">${t.language==="zh-CN"?"按晚点与间隔异常拆解":"Split by lateness and spacing issues"}</p></div><div class="attention-breakdown-grid"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅晚点":"Late Only"}</p><p class="metric-chip-value">${r.lateOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅间隔不均":"Spacing Only"}</p><p class="metric-chip-value">${r.unevenOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"两者都有":"Both"}</p><p class="metric-chip-value">${r.mixedIssueLineCount}</p></div></div></div>
        <div class="system-priority"><div class="insight-exceptions-header">${t.language==="zh-CN"?"":'<p class="headway-chart-title">Recommended Next</p>'}<p class="headway-chart-copy">${t.language==="zh-CN"?"基于当前快照的综合优先级":"Best next checks from the current snapshot"}</p></div><div class="system-priority-list">${(r.priorityLines.length?r.priorityLines:r.rankedLines.slice(0,1)).map(({line:T,worstGap:L,severeLateCount:A,alertCount:N,attentionReasons:_})=>`<div class="system-priority-item"><div class="line-title"><span class="line-token" style="--line-color:${T.color};">${T.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${T.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`${L?`最大间隔 ${L} 分钟`:"当前无明显间隔问题"}${A?` · ${A} 辆严重晚点`:""}${N?` · ${N} 条告警`:""}`:`${L?`Gap ${L} min`:"No major spacing issue"}${A?` · ${A} severe late`:""}${N?` · ${N} alert${N===1?"":"s"}`:""}`}</p>${W(_)}</div></div></div>`).join("")}</div></div>
        <div class="system-ranking"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"关注排名":"Attention Ranking"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div><div class="system-ranking-list">${r.rankedLines.slice(0,3).map(({line:T,score:L,worstGap:A,alertCount:N,severeLateCount:_,attentionReasons:G})=>`<div class="system-ranking-item"><div class="line-title"><span class="line-token" style="--line-color:${T.color};">${T.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${T.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`评分 ${L}${A?` · 最大间隔 ${A} 分钟`:""}${N?` · ${N} 条告警`:""}${_?` · ${_} 辆严重晚点`:""}`:`Score ${L}${A?` · gap ${A} min`:""}${N?` · ${N} alert${N===1?"":"s"}`:""}${_?` · ${_} severe late`:""}`}</p>${W(G)}</div></div></div>`).join("")}</div></div>
        <div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"系统状态":"System Status"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div>${$.map(T=>`<div class="insight-exception insight-exception-${T.tone}"><p>${T.copy}</p></div>`).join("")}</div>
      </article>
    `}function v(p){const r=p.flatMap(L=>L.exceptions.map(A=>({tone:A.tone,copy:`${L.line.name}: ${A.copy}`,lineColor:L.line.color})));if(!r.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport"><span class="insights-ticker-item insights-ticker-item-healthy">${t.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span></div></section>
    `;const c=D(),$=Math.ceil(r.length/c),h=t.insightsTickerIndex%$,T=r.slice(h*c,h*c+c);return`
      <section class="insights-ticker" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport">${T.map(L=>`<span class="insights-ticker-item insights-ticker-item-${L.tone} insights-ticker-item-animated"><span class="insights-ticker-dot" style="--line-color:${L.lineColor};"></span><span class="insights-ticker-copy">${L.copy}</span></span>`).join("")}</div></section>
    `}function w(p,r,c,$,h){const T=c.length+$.length;if(!T)return"";const{nbGaps:L,sbGaps:A}=n(c,$),N=y([...c,...$]),_=[...L,...A].length?Math.max(...L,...A):null,G=F(c,$),J=q(p,c,$,h),Q=new Set(h.flatMap(ie=>ie.stopIds??[])).size;return`
      <div class="line-insights"><div class="metric-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"运营中":"In Service"}</p><p class="metric-chip-value">${T}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"准点率":"On-Time Rate"}</p><p class="metric-chip-value">${d(N.onTime,T)}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"最大间隔":"Worst Gap"}</p><p class="metric-chip-value">${_!=null?`${_} min`:"—"}</p></div><div class="metric-chip metric-chip-${G.tone}"><p class="metric-chip-label">${t.language==="zh-CN"?"方向平衡":"Balance"}</p><p class="metric-chip-value">${G.label}</p></div></div><div class="headway-health-grid">${j(l("▲",r,{includeSymbol:!0}),L,c.length)}${j(l("▼",r,{includeSymbol:!0}),A,$.length)}</div>${k(N,T)}<div class="flow-grid">${z(t.language==="zh-CN"?`${l("▲",r,{includeSymbol:!0})} 流向`:`${l("▲",r,{includeSymbol:!0})} flow`,c,r,p.color)}${z(t.language==="zh-CN"?`${l("▼",r,{includeSymbol:!0})} 流向`:`${l("▼",r,{includeSymbol:!0})} flow`,$,r,p.color)}</div><div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"当前":"Now"}</p><p class="headway-chart-copy">${h.length?t.language==="zh-CN"?`${h.length} 条生效告警${Q?` · 影响 ${Q} 个站点`:""}`:`${h.length} active alert${h.length===1?"":"s"}${Q?` · ${Q} impacted stops`:""}`:t.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p></div>${J.map(ie=>`<div class="insight-exception insight-exception-${ie.tone}"><p>${ie.copy}</p></div>`).join("")}</div></div>
    `}function P(p){const r=V(t.lines),c=f(),$=V(p);return`
      ${v($)}
      ${x(r)}
      ${$.map(({line:h,layout:T,vehicles:L,nb:A,sb:N,lineAlerts:_})=>{const G=w(h,T,A,N,_);return`
          <article class="panel-card panel-card-wide">
            <header class="panel-header line-card-header"><div class="line-title"><span class="line-token" style="--line-color:${h.color};">${h.name[0]}</span><div class="line-title-copy"><h2>${h.name}</h2><p>${a("liveCount",L.length,L.length===1?f().toLowerCase():b().toLowerCase())} · ${M(h)}</p></div></div>${E(h)}</header>
            ${B(h)}
            ${G||`<p class="train-readout muted">${t.language==="zh-CN"?`等待实时${c.toLowerCase()}数据…`:`Waiting for live ${c.toLowerCase()} data…`}</p>`}
          </article>
        `}).join("")}
    `}return{renderInsightsBoard:P}}function yi(){return{dialog:document.querySelector("#station-dialog"),dialogTitle:document.querySelector("#dialog-title"),dialogTitleTrack:document.querySelector("#dialog-title-track"),dialogTitleText:document.querySelector("#dialog-title-text"),dialogTitleTextClone:document.querySelector("#dialog-title-text-clone"),dialogServiceSummary:document.querySelector("#dialog-service-summary"),dialogStatusPillElement:document.querySelector("#dialog-status-pill"),dialogUpdatedAtElement:document.querySelector("#dialog-updated-at"),dialogDisplay:document.querySelector("#dialog-display"),dialogDirectionTabs:[...document.querySelectorAll("[data-dialog-direction]")],arrivalsTitleNb:document.querySelector("#arrivals-title-nb"),arrivalsTitleSb:document.querySelector("#arrivals-title-sb"),stationAlertsContainer:document.querySelector("#station-alerts-container"),transferSection:document.querySelector("#transfer-section"),arrivalsSectionNb:document.querySelector('[data-direction-section="nb"]'),arrivalsNbPinned:document.querySelector("#arrivals-nb-pinned"),arrivalsNb:document.querySelector("#arrivals-nb"),arrivalsSectionSb:document.querySelector('[data-direction-section="sb"]'),arrivalsSbPinned:document.querySelector("#arrivals-sb-pinned"),arrivalsSb:document.querySelector("#arrivals-sb"),trainDialog:document.querySelector("#train-dialog"),trainDialogTitle:document.querySelector("#train-dialog-title"),trainDialogSubtitle:document.querySelector("#train-dialog-subtitle"),trainDialogLine:document.querySelector("#train-dialog-line"),trainDialogStatus:document.querySelector("#train-dialog-status"),trainDialogClose:document.querySelector("#train-dialog-close"),alertDialog:document.querySelector("#alert-dialog"),alertDialogTitle:document.querySelector("#alert-dialog-title"),alertDialogSubtitle:document.querySelector("#alert-dialog-subtitle"),alertDialogLines:document.querySelector("#alert-dialog-lines"),alertDialogBody:document.querySelector("#alert-dialog-body"),alertDialogLink:document.querySelector("#alert-dialog-link"),alertDialogClose:document.querySelector("#alert-dialog-close")}}function $i({state:e,elements:t,copyValue:i,refreshStationDialog:n,clearStationParam:a}){const{dialog:o,dialogTitle:l,dialogTitleTrack:d,dialogTitleText:m,dialogTitleTextClone:S,dialogDisplay:y,dialogDirectionTabs:u,arrivalsSectionNb:D,arrivalsNb:I,arrivalsSectionSb:M,arrivalsSb:f}=t;function b(v){e.dialogDisplayMode=v,o.classList.toggle("is-display-mode",v),y.textContent=i(v?"exit":"board"),y.setAttribute("aria-label",i(v?"exit":"board")),e.dialogDisplayDirection="both",e.dialogDisplayAutoPhase="nb",F(),o.open&&e.currentDialogStation&&n(e.currentDialogStation).catch(console.error),x(),V()}function E(){b(!e.dialogDisplayMode)}function B(){e.dialogDisplayDirectionTimer&&(window.clearInterval(e.dialogDisplayDirectionTimer),e.dialogDisplayDirectionTimer=0)}function R(){e.dialogDisplayDirectionAnimationTimer&&(window.clearTimeout(e.dialogDisplayDirectionAnimationTimer),e.dialogDisplayDirectionAnimationTimer=0),e.dialogDisplayAnimatingDirection="",D?.classList.remove("is-direction-animating"),M?.classList.remove("is-direction-animating")}function j(v){if(!e.dialogDisplayMode||!v||v==="both")return;R(),e.dialogDisplayAnimatingDirection=v;const w=v==="nb"?D:M;w&&(w.offsetWidth,w.classList.add("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=window.setTimeout(()=>{w.classList.remove("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=0,e.dialogDisplayAnimatingDirection===v&&(e.dialogDisplayAnimatingDirection="")},Vt))}function F({animate:v=!1}={}){B(),R();const w=e.dialogDisplayDirection,P=w==="auto"?e.dialogDisplayAutoPhase:w;u.forEach(p=>{p.classList.toggle("is-active",p.dataset.dialogDirection===w)}),o.classList.toggle("show-nb-only",e.dialogDisplayMode&&P==="nb"),o.classList.toggle("show-sb-only",e.dialogDisplayMode&&P==="sb"),v&&j(P),e.dialogDisplayMode&&w==="auto"&&(e.dialogDisplayDirectionTimer=window.setInterval(()=>{e.dialogDisplayAutoPhase=e.dialogDisplayAutoPhase==="nb"?"sb":"nb",F({animate:!0})},Ft))}function k(){e.dialogRefreshTimer&&(window.clearTimeout(e.dialogRefreshTimer),e.dialogRefreshTimer=0)}function z(){e.dialogDisplayTimer&&(window.clearInterval(e.dialogDisplayTimer),e.dialogDisplayTimer=0)}function q(v,w){const P=[...v.querySelectorAll(".arrival-item:not(.muted)")];if(v.style.transform="translateY(0)",!e.dialogDisplayMode||P.length<=3)return;const p=Number.parseFloat(window.getComputedStyle(v).rowGap||"0")||0,r=P[0].getBoundingClientRect().height+p,c=Math.max(0,P.length-3),$=Math.min(e.dialogDisplayIndexes[w],c);v.style.transform=`translateY(-${$*r}px)`}function V(){z(),e.dialogDisplayIndexes={nb:0,sb:0},q(I,"nb"),q(f,"sb"),e.dialogDisplayMode&&(e.dialogDisplayTimer=window.setInterval(()=>{for(const[v,w]of[["nb",I],["sb",f]]){const P=[...w.querySelectorAll(".arrival-item:not(.muted)")];if(P.length<=3)continue;const p=Math.max(0,P.length-3);e.dialogDisplayIndexes[v]=e.dialogDisplayIndexes[v]>=p?0:e.dialogDisplayIndexes[v]+1,q(w,v)}},Ht))}function W(){if(k(),!e.currentDialogStation)return;const v=()=>{e.dialogRefreshTimer=window.setTimeout(async()=>{!o.open||!e.currentDialogStation||(await n(e.currentDialogStation).catch(console.error),v())},Ut)};v()}function O(){e.currentDialogStationId="",e.currentDialogStation=null,o.open?o.close():(k(),z(),B(),b(!1),a())}function H(v){m.textContent=v,S.textContent=v,x()}function x(){const v=l;if(!v||!d)return;const P=e.dialogDisplayMode&&o.open&&m.scrollWidth>v.clientWidth;v.classList.toggle("is-marquee",P)}return{setDialogDisplayMode:b,toggleDialogDisplayMode:E,stopDialogDirectionRotation:B,stopDialogDirectionAnimation:R,renderDialogDirectionView:F,stopDialogAutoRefresh:k,stopDialogDisplayScroll:z,applyDialogDisplayOffset:q,syncDialogDisplayScroll:V,startDialogAutoRefresh:W,closeStationDialog:O,setDialogTitle:H,syncDialogTitleMarquee:x}}function bi({state:e,elements:t,copyValue:i,formatAlertSeverity:n,formatAlertEffect:a,getAlertsForLine:o,getDirectionBaseLabel:l,getVehicleLabel:d,getVehicleDestinationLabel:m,getTrainTimelineEntries:S,getStatusTone:y,getVehicleStatusPills:u,renderStatusPills:D,formatArrivalTime:I}){const{trainDialog:M,trainDialogTitle:f,trainDialogSubtitle:b,trainDialogLine:E,trainDialogStatus:B,alertDialog:R,alertDialogTitle:j,alertDialogSubtitle:F,alertDialogLines:k,alertDialogBody:z,alertDialogLink:q}=t;function V(){e.currentTrainId="",M.open&&M.close()}function W(){R.open&&R.close()}function O(x){const v=o(x.id);j.textContent=i("affectedLineAlerts",x.name,v.length),F.textContent=i("activeAlerts",v.length),k.textContent=x.name,z.textContent="",z.innerHTML=v.length?v.map(w=>`
              <article class="alert-dialog-item">
                <p class="alert-dialog-item-meta">${n(w.severity)} • ${a(w.effect)}</p>
                <p class="alert-dialog-item-title">${w.title||i("serviceAlert")}</p>
                <p class="alert-dialog-item-copy">${w.description||i("noAdditionalAlertDetails")}</p>
                ${w.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${w.url}" target="_blank" rel="noreferrer">${i("readOfficialAlert")}</a></p>`:""}
              </article>
            `).join(""):`<p class="alert-dialog-item-copy">${i("noActiveAlerts")}</p>`,q.hidden=!0,q.removeAttribute("href"),R.open||R.showModal()}function H(x){const v=x.fromLabel!==x.toLabel&&x.progress>0&&x.progress<1,w=v?x.fromLabel:x.previousLabel,P=v?`${x.fromLabel} -> ${x.toLabel}`:x.currentStopLabel,p=v?"Between":"Now",r=v?x.toLabel:x.upcomingLabel,c=v?x.progress:.5,$=e.layouts.get(x.lineId),h=S(x,$),T=$?m(x,$):x.upcomingLabel,L=h.at(-1)?.etaSeconds??Math.max(0,x.nextOffset??0),A=l(x.directionSymbol);f.textContent=`${x.lineName} ${d()} ${x.label}`,b.textContent=e.language==="zh-CN"?`${A} · ${i("toDestination",T)}`:`${A} to ${T}`,B.className=`train-detail-status train-list-status-${y(x.serviceStatus)}`,B.innerHTML=D(u(x)),M.querySelector(".train-eta-panel")?.remove(),E.innerHTML=`
      <div class="train-detail-spine" style="--line-color:${x.lineColor};"></div>
      <div
        class="train-detail-marker-floating"
        style="--line-color:${x.lineColor}; --segment-progress:${c}; --direction-offset:${x.directionSymbol==="▼"?"10px":"-10px"};"
      >
        <span class="train-detail-vehicle-marker">
          <svg viewBox="-10 -10 20 20" class="train-detail-arrow" aria-hidden="true">
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${x.directionSymbol==="▼"?"rotate(180)":""}"></path>
          </svg>
        </span>
      </div>
      <div class="train-detail-stop">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${i("previous")}</p>
          <p class="train-detail-name">${w}</p>
        </div>
      </div>
      <div class="train-detail-stop is-current">
        <span class="train-detail-marker train-detail-marker-ghost"></span>
        <div>
          <p class="train-detail-label">${p==="Between"?e.language==="zh-CN"?"区间":"Between":i("now")}</p>
          <p class="train-detail-name">${P}</p>
        </div>
      </div>
      <div class="train-detail-stop">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${i("next")}</p>
          <p class="train-detail-name">${r}</p>
        </div>
      </div>
    `,E.insertAdjacentHTML("afterend",`
        <section class="train-eta-panel">
          <div class="train-eta-summary">
            <div class="metric-chip">
              <p class="metric-chip-label">${i("direction")}</p>
              <p class="metric-chip-value">${A}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${i("terminal")}</p>
              <p class="metric-chip-value">${T}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${i("etaToTerminal")}</p>
              <p class="metric-chip-value">${I(L)}</p>
            </div>
          </div>
          <div class="train-eta-timeline">
            <div class="train-eta-header">
              <p class="train-detail-label">${i("upcomingStops")}</p>
              <p class="train-eta-header-copy">${i("liveEtaNow")}</p>
            </div>
            ${h.length?h.map(N=>`
                    <article class="train-eta-stop${N.isNext?" is-next":""}${N.isTerminal?" is-terminal":""}">
                      <div>
                        <p class="train-eta-stop-label">${N.isNext?i("nextStop"):N.isTerminal?i("terminal"):i("upcoming")}</p>
                        <p class="train-eta-stop-name">${N.label}</p>
                      </div>
                      <div class="train-eta-stop-side">
                        <p class="train-eta-stop-countdown">${I(N.etaSeconds)}</p>
                        <p class="train-eta-stop-clock">${N.clockTime}</p>
                      </div>
                    </article>
                  `).join(""):`<p class="train-readout muted">${i("noDownstreamEta")}</p>`}
          </div>
        </section>
      `),M.open||M.showModal()}return{closeTrainDialog:V,closeAlertDialog:W,renderAlertListDialog:O,renderTrainDialog:H}}function Si(e){const t=[...e.stops].sort((u,D)=>D.sequence-u.sequence),i=48,n=44,a=28,o=76,l=106,d=n+a+(t.length-1)*i,m=new Map,S=t.map((u,D)=>{const I={...u,label:jt(u.name),y:n+D*i,index:D,isTerminal:D===0||D===t.length-1};m.set(u.id,D),m.set(`${e.agencyId}_${u.id}`,D);for(const M of e.stationAliases?.[u.id]??[])m.set(M,D),m.set(`${e.agencyId}_${M}`,D);return I});let y=0;for(let u=0;u<S.length;u+=1)S[u].cumulativeMinutes=y,y+=u<S.length-1?S[u].segmentMinutes:0;return{totalMinutes:y,height:d,labelX:l,stationGap:i,stationIndexByStopId:m,stations:S,trackX:o}}function wi(e,t){const i=e.systemsById.has(t)?t:te,n=e.systemsById.get(i);e.activeSystemId=i,e.lines=n?.lines??[],e.layouts=e.layoutsBySystem.get(i)??new Map,e.lines.some(a=>a.id===e.activeLineId)||(e.activeLineId=e.lines[0]?.id??""),e.vehiclesByLine=new Map,e.rawVehicles=[],e.arrivalsCache.clear(),e.alerts=[],e.error="",e.fetchedAt="",e.insightsTickerIndex=0,e.vehicleGhosts=new Map}async function Li({state:e,getSystemIdFromUrl:t}){for(let a=0;a<=4;a+=1){let o=null,l=null;try{o=await fetch(Ot,{cache:"no-store"}),l=await o.json()}catch(m){if(a===4)throw m;await ce(1e3*2**a);continue}if(!o.ok){if(a===4)throw new Error(`Static data load failed with ${o.status}`);await ce(1e3*2**a);continue}const d=l.systems??[];e.systemsById=new Map(d.map(m=>[m.id,m])),e.layoutsBySystem=new Map(d.map(m=>[m.id,new Map(m.lines.map(S=>[S.id,Si(S)]))])),wi(e,t());return}}function Ti({getPreferredLanguage:e,getPreferredTheme:t,handleViewportResize:i,loadStaticData:n,refreshVehicles:a,render:o,refreshLiveMeta:l,refreshArrivalCountdowns:d,refreshVehicleStatusMessages:m,startInsightsTickerRotation:S,startLiveRefreshLoop:y,syncCompactLayoutFromBoard:u,syncDialogFromUrl:D,updateViewportState:I,setLanguage:M,setTheme:f,boardElement:b}){return async function(){M(e()),f(t()),I(),await n(),o(),await a(),await D(),window.addEventListener("popstate",()=>{D().catch(console.error)}),window.addEventListener("resize",i),window.visualViewport?.addEventListener("resize",i),new ResizeObserver(()=>{u()}).observe(b),y(),S(),window.setInterval(()=>{l(),d(),m()},1e3)}}const s={fetchedAt:"",error:"",activeSystemId:te,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayDirectionAnimationTimer:0,dialogDisplayAnimatingDirection:"",dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},Ci=zt({immediate:!0,onNeedRefresh(){Ci(!0)}});document.querySelector("#app").innerHTML=`
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
`;const ee=document.querySelector("#board"),Di=document.querySelector("#screen-kicker"),xi=document.querySelector("#screen-title"),xe=document.querySelector("#system-bar"),Ai=document.querySelector("#view-bar"),Me=[...document.querySelectorAll(".tab-button")],ke=document.querySelector("#language-toggle"),Ee=document.querySelector("#theme-toggle"),ve=document.querySelector("#status-pill"),Ii=document.querySelector("#current-time"),Re=document.querySelector("#updated-at"),Pe=yi(),{dialog:$e,dialogServiceSummary:Ni,dialogStatusPillElement:Qe,dialogUpdatedAtElement:Mi,dialogDisplay:ze,dialogDirectionTabs:ki,arrivalsTitleNb:Ei,arrivalsTitleSb:Ri,trainDialog:Oe,trainDialogClose:lt,alertDialog:Be,alertDialogLink:zi,alertDialogClose:ct}=Pe;ze.addEventListener("click",()=>oa());lt.addEventListener("click",()=>He());ct.addEventListener("click",()=>Fe());ke.addEventListener("click",()=>{mt(s.language==="en"?"zh-CN":"en"),Z()});ki.forEach(e=>{e.addEventListener("click",()=>{s.dialogDisplayDirection=e.dataset.dialogDirection,s.dialogDisplayDirection==="auto"&&(s.dialogDisplayAutoPhase="nb"),la()})});$e.addEventListener("click",e=>{e.target===$e&&St()});Oe.addEventListener("click",e=>{e.target===Oe&&He()});Be.addEventListener("click",e=>{e.target===Be&&Fe()});$e.addEventListener("close",()=>{ca(),da(),ra(),sa(!1),s.isSyncingFromUrl||bt()});Me.forEach(e=>{e.addEventListener("click",()=>{s.activeTab=e.dataset.tab,Z()})});Ee.addEventListener("click",()=>{pt(s.theme==="dark"?"light":"dark"),Z()});function de(){return ye[s.activeSystemId]??ye[te]}function Oi(){return s.systemsById.get(s.activeSystemId)?.agencyId??ye[te].agencyId}function Bi(){return`${Bt}/vehicles-for-agency/${Oi()}.json?key=${st}`}function oe(){return s.language==="zh-CN"?de().vehicleLabel==="Train"?"列车":"公交":de().vehicleLabel??"Vehicle"}function Te(){return s.language==="zh-CN"?oe():de().vehicleLabelPlural??Gt(oe())}function Pi(){return Je[s.language]??Je.en}function g(e,...t){const i=Pi()[e];return typeof i=="function"?i(...t):i}const{fetchJsonWithRetry:qi}=ci(s);function _i(e){return Wt(e,g)}function dt(){return Yt(s.language)}function re(e){return Kt(e,s.language,g)}function he(e){return Zt(e,s.language)}function X(e){return Jt(e,s.language)}function Ui(e){return ei(e,s.language)}function ut(e,t=!1){const i=t&&(e==="▲"||e==="▼")?`${e} `:"";return e==="▲"?`${i}${s.language==="zh-CN"?"北向":"Northbound"}`:e==="▼"?`${i}${s.language==="zh-CN"?"南向":"Southbound"}`:g("active")}function be(e,t="",{includeSymbol:i=!1}={}){const n=ut(e,i);return t?s.language==="zh-CN"?`${n} · 开往 ${t}`:`${n} to ${t}`:n}function gt(e,t){if(!t?.stations?.length)return"";const i=e==="▲"?0:e==="▼"?t.stations.length-1:-1;return i<0?"":t.stations[i]?.label??""}function Hi(e,t,i={}){return be(e,gt(e,t),i)}function et(e){const t=[...new Set(e.map(n=>n?.trim()).filter(Boolean))];if(!t.length)return"";const i=t.slice(0,2);return t.length>2&&i.push(s.language==="zh-CN"?"等":"etc."),i.join(" / ")}function tt(e,t=[],i=s.currentDialogStation){const n=t.map(l=>l.destination),a=et(n);if(a)return a;if(!i)return"";const o=ia(i).map(({line:l})=>s.layouts.get(l.id)).map(l=>gt(e,l));return et(o)}function Fi(){const e=window.localStorage.getItem(ot);return e==="light"||e==="dark"?e:"dark"}function Vi(){const e=window.localStorage.getItem(rt);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function pt(e){s.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(ot,e)}function mt(e){s.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=s.language,window.localStorage.setItem(rt,s.language)}function ht(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,i=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(t,e,i);s.compactLayout=n<=qt}function Se(){const i=window.getComputedStyle(ee).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;i!==s.compactLayout&&(s.compactLayout=i,Z())}function qe(e){const t=Xt(),i=e.serviceSpansByDate?.[t];return i?g("todayServiceSpan",X(i.start),X(i.end)):g("todayServiceUnavailable")}function Gi(e){const t=new Date,i=fe(-1),n=fe(0),a=fe(1),o=e.serviceSpansByDate?.[i],l=e.serviceSpansByDate?.[n],d=e.serviceSpansByDate?.[a],S=[o&&{kind:"yesterday",start:ae(i,o.start),end:ae(i,o.end),span:o},l&&{kind:"today",start:ae(n,l.start),end:ae(n,l.end),span:l}].filter(Boolean).find(y=>t>=y.start&&t<=y.end);if(S)return{tone:"active",headline:g("lastTrip",X(S.span.end)),detail:g("endsIn",he(S.end.getTime()-t.getTime())),compact:g("endsIn",he(S.end.getTime()-t.getTime()))};if(l){const y=ae(n,l.start),u=ae(n,l.end);if(t<y)return{tone:"upcoming",headline:g("firstTrip",X(l.start)),detail:g("startsIn",he(y.getTime()-t.getTime())),compact:g("startsIn",he(y.getTime()-t.getTime()))};if(t>u)return{tone:"ended",headline:g("serviceEnded",X(l.end)),detail:d?g("nextStart",X(d.start)):g("noNextServiceLoaded"),compact:d?g("nextStart",X(d.start)):g("ended")}}return d?{tone:"upcoming",headline:g("nextFirstTrip",X(d.start)),detail:g("noServiceRemainingToday"),compact:g("nextStart",X(d.start))}:{tone:"muted",headline:g("serviceHoursUnavailable"),detail:g("staticScheduleMissing"),compact:g("unavailable")}}function _e(e){const t=Gi(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function ji(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function Wi(e){const t=fe(0),i=e.serviceSpansByDate?.[t];if(!i)return null;const n=Ne(i.start)/3600,a=Ne(i.end)/3600,o=ji(new Date),l=Math.max(24,a,o,1);return{startHours:n,endHours:a,nowHours:o,axisMax:l,startLabel:X(i.start),endLabel:X(i.end)}}function Yi(e){const t=Wi(e);if(!t)return"";const i=se(t.startHours/t.axisMax*100,0,100),n=se(t.endHours/t.axisMax*100,i,100),a=se(t.nowHours/t.axisMax*100,0,100),o=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
    <section class="service-timeline-card">
      <div class="service-timeline-header">
        <div>
          <p class="headway-chart-title">${s.language==="zh-CN"?"今日运营时间带":"Today Service Window"}</p>
          <p class="headway-chart-copy">${s.language==="zh-CN"?"首末班与当前时刻":"First trip, last trip, and current time"}</p>
        </div>
        <span class="service-timeline-badge ${o?"is-live":"is-off"}">${o?s.language==="zh-CN"?"运营中":"In service":s.language==="zh-CN"?"未运营":"Off hours"}</span>
      </div>
      <div class="service-timeline-track">
        <div class="service-timeline-band" style="left:${i}%; width:${Math.max(2,n-i)}%;"></div>
        <div class="service-timeline-now" style="left:${a}%;">
          <span class="service-timeline-now-dot"></span>
          <span class="service-timeline-now-label">${s.language==="zh-CN"?"当前":"Now"}</span>
        </div>
      </div>
      <div class="service-timeline-labels">
        <span>${t.startLabel}</span>
        <span>${t.endLabel}</span>
      </div>
    </section>
  `}function ge(e){return s.alerts.filter(t=>t.lineIds.includes(e))}function Ki(e,t){const i=ge(t.id);if(!i.length)return[];const n=new Set(ta(e,t));return n.add(e.id),i.filter(a=>a.stopIds.length>0&&a.stopIds.some(o=>n.has(o)))}function ft(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${g("alertsWord",e.length)}</span>
    </button>
  `:""}function Xi(e){switch(e){case"ARR":return g("arrivingStatus");case"DELAY":return g("delayedStatus");case"OK":return g("enRoute");default:return""}}function Y(e){if(!s.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(s.fetchedAt).getTime())/1e3));return e-t}function ue(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function Ue(e){const t=Y(e.nextOffset??0),i=Y(e.closestOffset??0),n=e.delayInfo.text;return t<=15?[{text:g("arrivingNow"),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:g("arrivingIn",re(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:i<0&&t>0?[{text:g("nextStopIn",re(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:[{text:Xi(e.serviceStatus),toneClass:ue(e,t)},{text:n,toneClass:e.delayInfo.colorClass}]}function ne(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function vt(e){const t=Y(e.nextOffset??0),i=Y(e.closestOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel,[a,o]=Ue(e);return t<=15?`${e.label} at ${n} ${ne([a,o])}`:t<=90?`${e.label} at ${n} ${ne([a,o])}`:i<0&&t>0?`${e.label} ${n} ${ne([a,o])}`:`${e.label} to ${n} ${ne([a,o])}`}function yt(e){return ne(Ue(e))}function $t(e,t){if(!t.length)return"";const i=[...t].sort((a,o)=>Y(a.nextOffset??0)-Y(o.nextOffset??0)).slice(0,8),n=[...i,...i];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${n.map(a=>`
          <span
            class="line-marquee-item ${ue(a,Y(a.nextOffset??0))}"
            data-vehicle-marquee="${a.id}"
          >
            <span class="line-marquee-token">${a.lineToken}</span>
            <span class="line-marquee-copy">${vt(a)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function Zi(){document.querySelectorAll("[data-vehicle-status]").forEach(i=>{const n=i.dataset.vehicleStatus,a=we().find(l=>l.id===n);if(!a)return;const o=Y(a.nextOffset??0);i.innerHTML=yt(a),i.className=`train-list-status ${ue(a,o)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(i=>{const n=i.dataset.vehicleMarquee,a=we().find(d=>d.id===n);if(!a)return;const o=Y(a.nextOffset??0);i.className=`line-marquee-item ${ue(a,o)}`;const l=i.querySelector(".line-marquee-copy");l&&(l.innerHTML=vt(a))})}function Ji(e){return e.fromLabel===e.toLabel||e.progress===0?s.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:s.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function Qi(e){const t=s.layouts.get(e.lineId),i=Math.max(0,getTrainTimelineEntries(e,t).at(-1)?.etaSeconds??e.nextOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${s.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${n}</p>
        <p class="train-focus-metric-copy">${re(Y(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${s.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${getVehicleDestinationLabel(e,t)}</p>
        <p class="train-focus-metric-copy">${re(Y(i))}</p>
      </div>
    </div>
  `}function we(){return s.lines.flatMap(e=>(s.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function ea(){return Object.values(ye).filter(e=>s.systemsById.has(e.id)).map(e=>`
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
      `).join("")}</section>`}function it(){return s.compactLayout?s.lines.filter(e=>e.id===s.activeLineId):s.lines}function ta(e,t){const i=new Set(t.stationAliases?.[e.id]??[]);i.add(e.id);const n=new Set;for(const o of i){const l=o.startsWith(`${t.agencyId}_`)?o:`${t.agencyId}_${o}`;n.add(l)}const a=e.id.replace(/-T\d+$/,"");return n.add(a.startsWith(`${t.agencyId}_`)?a:`${t.agencyId}_${a}`),[...n]}function ia(e){const t=s.lines.map(i=>{const n=i.stops.find(a=>a.id===e.id);return n?{line:i,station:n}:null}).filter(Boolean);return t.length>0?t:s.lines.map(i=>{const n=i.stops.find(a=>a.name===e.name);return n?{line:i,station:n}:null}).filter(Boolean)}function bt(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function at(e){const t=new URL(window.location.href);e===te?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function aa(){const t=new URL(window.location.href).searchParams.get("system");return t&&s.systemsById.has(t)?t:te}const na=$i({state:s,elements:Pe,copyValue:g,refreshStationDialog:e=>refreshStationDialog(e),clearStationParam:bt}),{setDialogDisplayMode:sa,toggleDialogDisplayMode:oa,stopDialogDirectionRotation:ra,renderDialogDirectionView:la,stopDialogAutoRefresh:ca,stopDialogDisplayScroll:da,closeStationDialog:St,setDialogTitle:ua,syncDialogTitleMarquee:ga}=na;function pa(e,t){const i=Date.now(),n=new Set;for(const a of t){const o=`${e}:${a.id}`;n.add(o);const d=[...(s.vehicleGhosts.get(o)??[]).filter(m=>i-m.timestamp<=Ze),{y:a.y,minutePosition:a.minutePosition,timestamp:i}].slice(-6);s.vehicleGhosts.set(o,d)}for(const[a,o]of s.vehicleGhosts.entries()){if(!a.startsWith(`${e}:`))continue;const l=o.filter(d=>i-d.timestamp<=Ze);if(!n.has(a)||l.length===0){s.vehicleGhosts.delete(a);continue}l.length!==o.length&&s.vehicleGhosts.set(a,l)}}function ma(e,t){return(s.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}const{renderLine:ha}=hi({state:s,getAlertsForLine:ge,getAlertsForStation:Ki,getTodayServiceSpan:qe,getVehicleGhostTrail:ma,getVehicleLabel:oe,getVehicleLabelPlural:Te,copyValue:g,renderInlineAlerts:ft,renderLineStatusMarquee:$t,renderServiceReminderChip:_e}),{renderTrainList:fa}=fi({state:s,copyValue:g,formatArrivalTime:re,formatDirectionLabel:be,formatEtaClockFromNow:Ui,formatVehicleLocationSummary:Ji,getAlertsForLine:ge,getAllVehicles:we,getRealtimeOffset:Y,getTodayServiceSpan:qe,getVehicleDestinationLabel,getVehicleLabel:oe,getVehicleLabelPlural:Te,getVehicleStatusClass:ue,renderFocusMetrics:Qi,renderInlineAlerts:ft,renderLineStatusMarquee:$t,renderServiceReminderChip:_e,formatVehicleStatus:yt}),{renderInsightsBoard:va}=vi({state:s,classifyHeadwayHealth:si,computeLineHeadways:ai,copyValue:g,formatCurrentTime:dt,formatLayoutDirectionLabel:Hi,formatPercent:ri,getActiveSystemMeta:de,getAlertsForLine:ge,getDelayBuckets:oi,getLineAttentionReasons:li,getInsightsTickerPageSize,getRealtimeOffset:Y,getTodayServiceSpan:qe,getVehicleLabel:oe,getVehicleLabelPlural:Te,renderServiceReminderChip:_e,renderServiceTimeline:Yi});function ya(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await xa(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function Ie(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{s.activeLineId=t.dataset.lineSwitch,Z()})})}const $a=bi({state:s,elements:Pe,copyValue:g,formatAlertSeverity:ii,formatAlertEffect:ti,getAlertsForLine:e=>ge(e),getDirectionBaseLabel:ut,getVehicleLabel:oe,getVehicleDestinationLabel,getTrainTimelineEntries,getStatusTone:di,getVehicleStatusPills:Ue,renderStatusPills:ne,formatArrivalTime:re}),{closeTrainDialog:He,closeAlertDialog:Fe,renderTrainDialog:ba}=$a;function nt(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.trainId,n=we().find(a=>a.id===i);n&&(s.currentTrainId=i,ba(n))})})}function Sa(){s.lines.forEach(e=>{const t=s.layouts.get(e.id),i=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!i)return;i.querySelectorAll(".station-group").forEach(a=>{a.addEventListener("click",()=>{const o=a.dataset.stopId,l=t.stations.find(d=>d.id===o);l&&showStationDialog(l)})})})}function Z(){const e=de();if(document.documentElement.lang=s.language,ke.textContent=g("languageToggle"),ke.setAttribute("aria-label",g("languageToggleAria")),Ee.textContent=s.theme==="dark"?g("themeLight"):g("themeDark"),Ee.setAttribute("aria-label",g("themeToggleAria")),Di.textContent=e.kicker,xi.textContent=e.title,xe.setAttribute("aria-label",g("transitSystems")),Ai.setAttribute("aria-label",g("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",g("boardDirectionView")),Ei.textContent=be("▲",tt("▲"),{includeSymbol:!0}),Ri.textContent=be("▼",tt("▼"),{includeSymbol:!0}),ze.textContent=s.dialogDisplayMode?g("exit"):g("board"),ze.setAttribute("aria-label",s.dialogDisplayMode?g("exit"):g("board")),lt.setAttribute("aria-label",g("closeTrainDialog")),ct.setAttribute("aria-label",g("closeAlertDialog")),$e.open||(ua(g("station")),Ni.textContent=g("serviceSummary")),Oe.open||(trainDialogTitle.textContent=g("train"),trainDialogSubtitle.textContent=g("currentMovement")),Be.open||(alertDialogTitle.textContent=g("serviceAlert"),alertDialogSubtitle.textContent=g("transitAdvisory")),zi.textContent=g("readOfficialAlert"),xe.hidden=s.systemsById.size<2,xe.innerHTML=ea(),wt(),Me.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===s.activeTab)),Me.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=g("tabMap")),t.dataset.tab==="trains"&&(t.textContent=Te()),t.dataset.tab==="insights"&&(t.textContent=g("tabInsights"))}),ya(),s.activeTab==="map"){ee.className="board";const t=it();ee.innerHTML=`${Ae()}${t.map(ha).join("")}`,Ie(),attachAlertClickHandlers(),Sa(),nt(),queueMicrotask(Se);return}if(s.activeTab==="trains"){ee.className="board",ee.innerHTML=`${Ae()}${fa()}`,Ie(),attachAlertClickHandlers(),nt(),queueMicrotask(Se);return}if(s.activeTab==="insights"){ee.className="board";const t=it();ee.innerHTML=`${Ae()}${va(t)}`,Ie()}}function wa(){window.clearInterval(s.insightsTickerTimer),s.insightsTickerTimer=0}function La(){wa(),s.insightsTickerTimer=window.setInterval(()=>{s.insightsTickerIndex+=1,s.activeTab==="insights"&&Z()},5e3)}function wt(){ve.textContent=s.error?g("statusHold"):g("statusSync"),ve.classList.toggle("status-pill-error",!!s.error),Ii.textContent=`${g("nowPrefix")} ${dt()}`,Re.textContent=s.error?s.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":_i(s.fetchedAt),Qe.textContent=ve.textContent,Qe.classList.toggle("status-pill-error",!!s.error),Mi.textContent=Re.textContent}function Ta(){window.clearTimeout(s.liveRefreshTimer),s.liveRefreshTimer=0}function Ca(){Ta();const e=()=>{s.liveRefreshTimer=window.setTimeout(async()=>{await Ve(),e()},_t)};e()}function Da(e){const t=s.systemsById.has(e)?e:te,i=s.systemsById.get(t);s.activeSystemId=t,s.lines=i?.lines??[],s.layouts=s.layoutsBySystem.get(t)??new Map,s.lines.some(n=>n.id===s.activeLineId)||(s.activeLineId=s.lines[0]?.id??""),s.vehiclesByLine=new Map,s.rawVehicles=[],s.arrivalsCache.clear(),s.alerts=[],s.error="",s.fetchedAt="",s.insightsTickerIndex=0,s.vehicleGhosts=new Map}async function xa(e,{updateUrl:t=!0,preserveDialog:i=!1}={}){if(!s.systemsById.has(e)||s.activeSystemId===e){t&&at(s.activeSystemId);return}Da(e),i||St(),He(),Fe(),Z(),t&&at(e),await Ve()}function Aa(e){const t=[...new Set((e.allAffects??[]).map(n=>n.routeId).filter(Boolean))],i=s.lines.filter(n=>t.includes(getLineRouteId(n))).map(n=>n.id);return i.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??g("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:i,stopIds:[...new Set((e.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function Ve(){try{const e=await qi(Bi(),"Realtime");s.error="",s.fetchedAt=new Date().toISOString(),s.rawVehicles=e.data.list??[],s.alerts=(e.data.references?.situations??[]).map(Aa).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(a=>[a.id,a]));for(const a of s.lines){const o=s.layouts.get(a.id),l=s.rawVehicles.map(d=>mi(d,a,o,t,{language:s.language,copyValue:g})).filter(Boolean);s.vehiclesByLine.set(a.id,l),pa(a.id,l)}const i=computeSystemSummaryMetrics(buildInsightsItems(s.lines)),n=s.systemSnapshots.get(s.activeSystemId);s.systemSnapshots.set(s.activeSystemId,{previous:n?.current??null,current:i})}catch(e){s.error=g("realtimeOffline"),console.error(e)}Z()}const Ia=()=>{const e=s.compactLayout;if(ht(),ga(),e!==s.compactLayout){Z();return}Se()},Na=Ti({getPreferredLanguage:Vi,getPreferredTheme:Fi,handleViewportResize:Ia,loadStaticData:()=>Li({state:s,getSystemIdFromUrl:aa}),refreshVehicles:Ve,render:Z,refreshLiveMeta:wt,refreshArrivalCountdowns,refreshVehicleStatusMessages:Zi,startInsightsTickerRotation:La,startLiveRefreshLoop:Ca,syncCompactLayoutFromBoard:Se,syncDialogFromUrl,updateViewportState:ht,setLanguage:mt,setTheme:pt,boardElement:ee});Na().catch(e=>{ve.textContent=g("statusFail"),Re.textContent=e.message});
