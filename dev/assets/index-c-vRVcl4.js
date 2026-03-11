(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const ba="modulepreload",Sa=function(e){return"/link/dev/"+e},tt={},wa=function(t,a,i){let s=Promise.resolve();if(a&&a.length>0){let g=function(u){return Promise.all(u.map(d=>Promise.resolve(d).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};var o=g;document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),p=l?.nonce||l?.getAttribute("nonce");s=g(a.map(u=>{if(u=Sa(u),u in tt)return;tt[u]=!0;const d=u.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${m}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":ba,d||(f.as="script"),f.crossOrigin="",f.href=u,p&&f.setAttribute("nonce",p),document.head.appendChild(f),d)return new Promise((h,$)=>{f.addEventListener("load",h),f.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(l){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=l,window.dispatchEvent(p),!p.defaultPrevented)throw l}return s.then(l=>{for(const p of l||[])p.status==="rejected"&&r(p.reason);return t().catch(r)})};function La(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:i,onRegistered:s,onRegisteredSW:r,onRegisterError:o}=e;let l,p;const g=async(d=!0)=>{await p};async function u(){if("serviceWorker"in navigator){if(l=await wa(async()=>{const{Workbox:d}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:d}},[]).then(({Workbox:d})=>new d("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(d=>{o?.(d)}),!l)return;l.addEventListener("activated",d=>{(d.isUpdate||d.isExternal)&&window.location.reload()}),l.addEventListener("installed",d=>{d.isUpdate||i?.()}),l.register({immediate:t}).then(d=>{r?r("/link/dev/sw.js",d):s?.(d)}).catch(d=>{o?.(d)})}}return p=u(),g}const Ta="./pulse-data.json",Ct="https://api.pugetsound.onebusaway.org/api/where",Fe="TEST".trim()||"TEST",B=Fe==="TEST",Ca=B?6e4:2e4,at=3,nt=800,Ia=B?2e4:5e3,it=B?12e4:3e4,st=B?1200:0,Te=B?1:3,Aa=1100,xa=B?45e3:15e3,Da=B?9e4:3e4,Ma=4e3,Na=15e3,ka=520,rt=4*6e4,Ea=4.8,It=.35,Ra=3e3,za=45e3,At=4,xt="link-pulse-theme",Dt="link-pulse-language",j="link",me={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},ot={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}};function Oa(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function ge(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function de(e){return e.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function U(e,t,a){return Math.max(t,Math.min(e,a))}function _(e){return new Promise(t=>window.setTimeout(t,e))}function De(e){const[t="0",a="0",i="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(i)}function _a(e,t,a,i){const r=(a-e)*Math.PI/180,o=(i-t)*Math.PI/180,l=Math.sin(r/2)**2+Math.cos(e*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(o/2)**2;return 2*6371*Math.asin(Math.sqrt(l))}function Pa(e,t){const a=e.lat*Math.PI/180,i=t.lat*Math.PI/180,s=(t.lon-e.lon)*Math.PI/180,r=Math.sin(s)*Math.cos(i),o=Math.cos(a)*Math.sin(i)-Math.sin(a)*Math.cos(i)*Math.cos(s);return(Math.atan2(r,o)*180/Math.PI+360)%360}function Ba(e,t){if(!e)return t("waitingSnapshot");const a=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return a<10?t("updatedNow"):a<60?t("updatedSecondsAgo",a):t("updatedMinutesAgo",Math.round(a/60))}function qa(e){return new Intl.DateTimeFormat(e==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:e!=="zh-CN"}).format(new Date)}function Fa(e,t,a){if(e<=0)return a("arriving");const i=Math.floor(e/60),s=e%60;return t==="zh-CN"?i>0?`${i}分 ${s}秒`:`${s}秒`:i>0?`${i}m ${s}s`:`${s}s`}function Ha(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function ue(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function q(e,t){if(!e||!t)return null;const[a,i,s]=e.split("-").map(Number),r=De(t),o=Math.floor(r/3600),l=Math.floor(r%3600/60),p=r%60;return new Date(a,i-1,s,o,l,p)}function Ua(e,t){const a=Math.max(0,Math.round(e/6e4)),i=Math.floor(a/60),s=a%60;return t==="zh-CN"?i&&s?`${i}小时${s}分钟`:i?`${i}小时`:`${s}分钟`:i&&s?`${i}h ${s}m`:i?`${i}h`:`${s}m`}function Va(e,t){if(!e)return"";const[a="0",i="0"]=String(e).split(":"),s=Number(a),r=Number(i),o=(s%24+24)%24;if(t==="zh-CN")return`${String(o).padStart(2,"0")}:${String(r).padStart(2,"0")}`;const l=o>=12?"PM":"AM";return`${o%12||12}:${String(r).padStart(2,"0")} ${l}`}function Mt(e,t){return new Date(e).toLocaleTimeString(t==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:t!=="zh-CN"})}function Wa(e,t){return Mt(Date.now()+Math.max(0,e)*1e3,t)}function Ga(e,t){return e>=1?t("walkKm",e):t("walkMeters",Math.round(e*1e3))}function Nt(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function kt(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function he(e,t){const a=[...e].sort((r,o)=>r.minutePosition-o.minutePosition),i=[...t].sort((r,o)=>r.minutePosition-o.minutePosition),s=r=>r.slice(1).map((o,l)=>Math.round(o.minutePosition-r[l].minutePosition));return{nbGaps:s(a),sbGaps:s(i)}}function ja(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((s,r)=>s+r,0)/e.length,a=Math.max(...e),i=Math.min(...e);return{avg:Math.round(t),max:a,min:i,spread:a-i,ratio:a/Math.max(i,1)}}function fe(e,t){const a=ja(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let i="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?i="bunched":a.max>=12||a.spread>=6?i="uneven":a.avg>=18&&(i="sparse"),{health:i,stats:a}}function Me(e){return e.reduce((t,a)=>{const i=Number(a.scheduleDeviation??0);return i<=60?t.onTime+=1:i<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function Et(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function Ka({worstGap:e,severeLateCount:t,alertCount:a,balanceDelta:i,language:s}){const r=[];return e>=12&&r.push({key:"gap",tone:"alert",label:s==="zh-CN"?"大间隔":"Large gap"}),t>0&&r.push({key:"late",tone:"warn",label:s==="zh-CN"?"严重晚点":"Severe late"}),a>0&&r.push({key:"alert",tone:"info",label:s==="zh-CN"?"有告警":"Alerted"}),i>=2&&r.push({key:"balance",tone:"warn",label:s==="zh-CN"?"方向失衡":"Imbalanced"}),r.length||r.push({key:"healthy",tone:"healthy",label:s==="zh-CN"?"健康":"Healthy"}),r}function Ya(e){function t(){const r=Math.max(0,e.obaRateLimitStreak-1),o=Math.min(it,Ia*2**r),l=Math.round(o*(.15+Math.random()*.2));return Math.min(it,o+l)}async function a(){const r=e.obaCooldownUntil-Date.now();r>0&&await _(r)}function i(r){return r?.code===429||/rate limit/i.test(r?.text??"")}async function s(r,o){for(let l=0;l<=at;l+=1){await a();let p=null,g=null,u=null;try{p=await fetch(r,{cache:"no-store"})}catch(f){u=f}if(p!==null)try{g=await p.json()}catch{g=null}const d=p?.status===429||i(g);if(p?.ok&&!d)return e.obaRateLimitStreak=0,e.obaCooldownUntil=0,g;const m=u!=null||p!=null&&(p.status===429||p.status>=500&&p.status<600);if(l===at||!m)throw u||(g?.text?new Error(g.text):new Error(`${o} request failed with ${p?.status??"network error"}`));if(d){e.obaRateLimitStreak+=1;const f=nt*2**l,h=Math.max(f,t());e.obaCooldownUntil=Date.now()+h,await _(h)}else{const f=nt*2**l;await _(f)}}throw new Error(`${o} request failed`)}return{fetchJsonWithRetry:s,isRateLimitedPayload:i,waitForObaCooldown:a}}function Xa(e,t){const a=t.directionLookup?.[e.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const i=e.tripHeadsign??"",s=i.toLowerCase();return t.nbTerminusPrefix&&s.startsWith(t.nbTerminusPrefix)?"nb":t.sbTerminusPrefix&&s.startsWith(t.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(i)?"nb":/Federal Way|South Bellevue/i.test(i)?"sb":""}function Za(e){return e.routeKey??`${e.agencyId}_${e.id}`}function Ja(e,t){const a=e.tripHeadsign?.trim();return a?ge(a.replace(/^to\s+/i,"")):t("terminalFallback")}function Qa(e,t,a){return Math.floor((e-Date.now())/1e3)<=90?"ARR":t>=120?"DELAY":a==="zh-CN"?"准点":"ON TIME"}function He(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}function en({state:e,fetchJsonWithRetry:t,getStationStopIds:a,copyValue:i,getLanguage:s}){async function r(u){const d=`${Ct}/arrivals-and-departures-for-stop/${u}.json?key=${Fe}&minutesAfter=120`,m=await t(d,"Arrivals");if(m.code!==200)throw new Error(m.text||`Arrivals request failed for ${u}`);return m.data?.entry?.arrivalsAndDepartures??[]}async function o(u){const d=[...new Set(u)],m=[],f=[];for(let h=0;h<d.length;h+=Te){const $=d.slice(h,h+Te),I=await Promise.allSettled($.map(y=>r(y)));m.push(...I),st>0&&h+Te<d.length&&await _(st)}for(const h of m)h.status==="fulfilled"&&f.push(...h.value);return f}function l(u,d,m=null){const f=Date.now(),h=new Set,$={nb:[],sb:[]},I=m?new Set(m):null;for(const y of u){if(y.routeId!==Za(d)||I&&!I.has(y.stopId))continue;const T=y.predictedArrivalTime||y.scheduledArrivalTime;if(!T||T<=f)continue;const b=Xa(y,d);if(!b)continue;const v=`${y.tripId}:${y.stopId}:${T}`;h.has(v)||(h.add(v),$[b].push({vehicleId:(y.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:T,destination:Ja(y,i),scheduleDeviation:y.scheduleDeviation??0,tripId:y.tripId,lineColor:d.color,lineName:d.name,lineToken:d.name[0],distanceFromStop:y.distanceFromStop??0,numberOfStopsAway:y.numberOfStopsAway??0}))}return $.nb.sort((y,T)=>y.arrivalTime-T.arrivalTime),$.sb.sort((y,T)=>y.arrivalTime-T.arrivalTime),$.nb=$.nb.slice(0,4),$.sb=$.sb.slice(0,4),$}async function p(u,d,m=null){const f=`${e.activeSystemId}:${d.id}:${u.id}`,h=e.arrivalsCache.get(f);if(h&&Date.now()-h.fetchedAt<Ca)return h.value;const $=a(u,d),I=m??await o($),y=l(I,d,$);return e.arrivalsCache.set(f,{fetchedAt:Date.now(),value:y}),y}function g(u){const d={nb:[],sb:[]};for(const m of u)d.nb.push(...m.nb),d.sb.push(...m.sb);return d.nb.sort((m,f)=>m.arrivalTime-f.arrivalTime),d.sb.sort((m,f)=>m.arrivalTime-f.arrivalTime),d}return{buildArrivalsForLine:l,fetchArrivalsForStop:r,fetchArrivalsForStopIds:o,getArrivalsForStation:p,mergeArrivalBuckets:g,getArrivalServiceStatus:(u,d)=>Qa(u,d,s())}}function tn(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function an(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase(),i=t.nextStopTimeOffset??0,s=t.scheduleDeviation??0,r=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||r&&Math.abs(i)<=90?"ARR":s>=120?"DELAY":"OK"}function nn(e,t,{language:a,copyValue:i}){if(!t)return{text:i("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:i("onTime"),colorClass:"status-ontime"};if(e>60){const s=Math.round(e/60);let r="status-late-minor";return e>600?r="status-late-severe":e>300&&(r="status-late-moderate"),{text:a==="zh-CN"?`晚点 ${s} 分钟`:`+${s} min late`,colorClass:r}}if(e<-60){const s=Math.round(Math.abs(e)/60);return{text:a==="zh-CN"?`早到 ${s} 分钟`:`${s} min early`,colorClass:"status-early"}}return{text:i("unknown"),colorClass:"status-muted"}}function sn(e,t,a,i,{language:s,copyValue:r}){const o=e.tripStatus?.activeTripId??e.tripId??"",l=i.get(o);if(!l||l.routeId!==t.routeKey)return null;const p=e.tripStatus?.closestStop,g=e.tripStatus?.nextStop,u=a.stationIndexByStopId.get(p),d=a.stationIndexByStopId.get(g);if(u==null&&d==null)return null;let m=u??d,f=d??u;if(m>f){const N=m;m=f,f=N}const h=a.stations[m],$=a.stations[f],I=e.tripStatus?.closestStopTimeOffset??0,y=e.tripStatus?.nextStopTimeOffset??0,T=l.directionId==="1"?"▲":l.directionId==="0"?"▼":tn(u,d);let b=0;m!==f&&I<0&&y>0&&(b=U(Math.abs(I)/(Math.abs(I)+y),0,1));const v=h.y+($.y-h.y)*b,C=m!==f?h.segmentMinutes:0,K=h.cumulativeMinutes+C*b,k=u??d??m,O=a.stations[k]??h,ie=T==="▲",se=U(k+(ie?1:-1),0,a.stations.length-1),re=u!=null&&d!=null&&u!==d?d:U(k+(ie?-1:1),0,a.stations.length-1),Se=a.stations[se]??O,we=a.stations[re]??$,oe=e.tripStatus?.scheduleDeviation??0,le=e.tripStatus?.predicted??!1,Le=nn(oe,le,{language:s,copyValue:r});return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:T,fromLabel:h.label,minutePosition:K,progress:b,serviceStatus:an(e),toLabel:$.label,y:v,currentLabel:h.label,nextLabel:$.label,previousLabel:Se.label,currentStopLabel:O.label,upcomingLabel:we.label,currentIndex:k,upcomingStopIndex:re,status:e.tripStatus?.status??"",closestStop:p,nextStop:g,closestOffset:I,nextOffset:y,scheduleDeviation:oe,isPredicted:le,delayInfo:Le,rawVehicle:e}}const n={fetchedAt:"",error:"",activeSystemId:j,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayDirectionAnimationTimer:0,dialogDisplayAnimatingDirection:"",dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},rn=La({immediate:!0,onNeedRefresh(){rn(!0)}});document.querySelector("#app").innerHTML=`
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
`;const E=document.querySelector("#board"),on=document.querySelector("#screen-kicker"),ln=document.querySelector("#screen-title"),Ce=document.querySelector("#system-bar"),cn=document.querySelector("#view-bar"),Ne=[...document.querySelectorAll(".tab-button")],ke=document.querySelector("#language-toggle"),Ee=document.querySelector("#theme-toggle"),pe=document.querySelector("#status-pill"),dn=document.querySelector("#current-time"),Re=document.querySelector("#updated-at"),w=document.querySelector("#station-dialog"),un=document.querySelector("#dialog-title"),pn=document.querySelector("#dialog-title-track"),Rt=document.querySelector("#dialog-title-text"),mn=document.querySelector("#dialog-title-text-clone"),zt=document.querySelector("#dialog-service-summary"),lt=document.querySelector("#dialog-status-pill"),gn=document.querySelector("#dialog-updated-at"),J=document.querySelector("#dialog-display"),Ot=[...document.querySelectorAll("[data-dialog-direction]")],_t=document.querySelector("#arrivals-title-nb"),Pt=document.querySelector("#arrivals-title-sb"),Y=document.querySelector("#station-alerts-container"),F=document.querySelector("#transfer-section"),Bt=document.querySelector('[data-direction-section="nb"]'),ct=document.querySelector("#arrivals-nb-pinned"),Q=document.querySelector("#arrivals-nb"),qt=document.querySelector('[data-direction-section="sb"]'),dt=document.querySelector("#arrivals-sb-pinned"),ee=document.querySelector("#arrivals-sb"),z=document.querySelector("#train-dialog"),Ft=document.querySelector("#train-dialog-title"),Ht=document.querySelector("#train-dialog-subtitle"),ut=document.querySelector("#train-dialog-line"),pt=document.querySelector("#train-dialog-status"),Ut=document.querySelector("#train-dialog-close"),P=document.querySelector("#alert-dialog"),Vt=document.querySelector("#alert-dialog-title"),Wt=document.querySelector("#alert-dialog-subtitle"),hn=document.querySelector("#alert-dialog-lines"),mt=document.querySelector("#alert-dialog-body"),ze=document.querySelector("#alert-dialog-link"),Gt=document.querySelector("#alert-dialog-close");J.addEventListener("click",()=>Kn());Ut.addEventListener("click",()=>Je());Gt.addEventListener("click",()=>Qe());ke.addEventListener("click",()=>{Jt(n.language==="en"?"zh-CN":"en"),D()});Ot.forEach(e=>{e.addEventListener("click",()=>{n.dialogDisplayDirection=e.dataset.dialogDirection,n.dialogDisplayDirection==="auto"&&(n.dialogDisplayAutoPhase="nb"),Ke()})});w.addEventListener("click",e=>{e.target===w&&ua()});z.addEventListener("click",e=>{e.target===z&&Je()});P.addEventListener("click",e=>{e.target===P&&Qe()});w.addEventListener("close",()=>{Ye(),Xe(),je(),Ge(!1),n.isSyncingFromUrl||la()});Ne.forEach(e=>{e.addEventListener("click",()=>{n.activeTab=e.dataset.tab,D()})});Ee.addEventListener("click",()=>{Zt(n.theme==="dark"?"light":"dark"),D()});function V(){return me[n.activeSystemId]??me[j]}function fn(){return n.systemsById.get(n.activeSystemId)?.agencyId??me[j].agencyId}function vn(){return`${Ct}/vehicles-for-agency/${fn()}.json?key=${Fe}`}function A(){return n.language==="zh-CN"?V().vehicleLabel==="Train"?"列车":"公交":V().vehicleLabel??"Vehicle"}function L(){return n.language==="zh-CN"?A():V().vehicleLabelPlural??Oa(A())}function yn(){return ot[n.language]??ot.en}function c(e,...t){const a=yn()[e];return typeof a=="function"?a(...t):a}const{fetchJsonWithRetry:jt}=Ya(n),{buildArrivalsForLine:$n,fetchArrivalsForStopIds:gt,getArrivalsForStation:bn,mergeArrivalBuckets:Sn,getArrivalServiceStatus:Kt}=en({state:n,fetchJsonWithRetry:jt,getStationStopIds:(...e)=>te(...e),copyValue:c,getLanguage:()=>n.language});function wn(e){return Ba(e,c)}function Oe(){return qa(n.language)}function M(e){return Fa(e,n.language,c)}function ce(e){return Ua(e,n.language)}function x(e){return Va(e,n.language)}function Ln(e){return Mt(e,n.language)}function _e(e){return Wa(e,n.language)}function Tn(e){return Ga(e,c)}function Yt(e,t=!1){const a=t&&(e==="▲"||e==="▼")?`${e} `:"";return e==="▲"?`${a}${n.language==="zh-CN"?"北向":"Northbound"}`:e==="▼"?`${a}${n.language==="zh-CN"?"南向":"Southbound"}`:c("active")}function W(e,t="",{includeSymbol:a=!1}={}){const i=Yt(e,a);return t?n.language==="zh-CN"?`${i} · 开往 ${t}`:`${i} to ${t}`:i}function Xt(e,t){if(!t?.stations?.length)return"";const a=e==="▲"?0:e==="▼"?t.stations.length-1:-1;return a<0?"":t.stations[a]?.label??""}function R(e,t,a={}){return W(e,Xt(e,t),a)}function ht(e){const t=[...new Set(e.map(i=>i?.trim()).filter(Boolean))];if(!t.length)return"";const a=t.slice(0,2);return t.length>2&&a.push(n.language==="zh-CN"?"等":"etc."),a.join(" / ")}function ve(e,t=[],a=n.currentDialogStation){const i=t.map(o=>o.destination),s=ht(i);if(s)return s;if(!a)return"";const r=ne(a).map(({line:o})=>n.layouts.get(o.id)).map(o=>Xt(e,o));return ht(r)}function Cn(){const e=window.localStorage.getItem(xt);return e==="light"||e==="dark"?e:"dark"}function In(){const e=window.localStorage.getItem(Dt);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function Zt(e){n.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(xt,e)}function Jt(e){n.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=n.language,window.localStorage.setItem(Dt,n.language)}function ft(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);n.compactLayout=i<=Aa}function ye(){const a=window.getComputedStyle(E).gridTemplateColumns.split(" ").map(i=>i.trim()).filter(Boolean).length<=1;a!==n.compactLayout&&(n.compactLayout=a,D())}function Ue(e){const t=Ha(),a=e.serviceSpansByDate?.[t];return a?c("todayServiceSpan",x(a.start),x(a.end)):c("todayServiceUnavailable")}function Qt(e){const t=new Date,a=ue(-1),i=ue(0),s=ue(1),r=e.serviceSpansByDate?.[a],o=e.serviceSpansByDate?.[i],l=e.serviceSpansByDate?.[s],g=[r&&{kind:"yesterday",start:q(a,r.start),end:q(a,r.end),span:r},o&&{kind:"today",start:q(i,o.start),end:q(i,o.end),span:o}].filter(Boolean).find(u=>t>=u.start&&t<=u.end);if(g)return{tone:"active",headline:c("lastTrip",x(g.span.end)),detail:c("endsIn",ce(g.end.getTime()-t.getTime())),compact:c("endsIn",ce(g.end.getTime()-t.getTime()))};if(o){const u=q(i,o.start),d=q(i,o.end);if(t<u)return{tone:"upcoming",headline:c("firstTrip",x(o.start)),detail:c("startsIn",ce(u.getTime()-t.getTime())),compact:c("startsIn",ce(u.getTime()-t.getTime()))};if(t>d)return{tone:"ended",headline:c("serviceEnded",x(o.end)),detail:l?c("nextStart",x(l.start)):c("noNextServiceLoaded"),compact:l?c("nextStart",x(l.start)):c("ended")}}return l?{tone:"upcoming",headline:c("nextFirstTrip",x(l.start)),detail:c("noServiceRemainingToday"),compact:c("nextStart",x(l.start))}:{tone:"muted",headline:c("serviceHoursUnavailable"),detail:c("staticScheduleMissing"),compact:c("unavailable")}}function Ve(e){const t=Qt(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function An(e){const t=ne(e).map(({line:a})=>{const i=Qt(a);return`${a.name}: ${i.compact}`}).slice(0,3);zt.textContent=t.join("  ·  ")||c("serviceSummaryUnavailable")}function xn(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function Dn(e){const t=ue(0),a=e.serviceSpansByDate?.[t];if(!a)return null;const i=De(a.start)/3600,s=De(a.end)/3600,r=xn(new Date),o=Math.max(24,s,r,1);return{startHours:i,endHours:s,nowHours:r,axisMax:o,startLabel:x(a.start),endLabel:x(a.end)}}function Mn(e){const t=Dn(e);if(!t)return"";const a=U(t.startHours/t.axisMax*100,0,100),i=U(t.endHours/t.axisMax*100,a,100),s=U(t.nowHours/t.axisMax*100,0,100),r=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
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
  `}function ae(e){return n.alerts.filter(t=>t.lineIds.includes(e))}function ea(e,t){const a=ae(t.id);if(!a.length)return[];const i=new Set(te(e,t));return i.add(e.id),a.filter(s=>s.stopIds.length>0&&s.stopIds.some(r=>i.has(r)))}function Nn(e){const t=new Set,a=[];for(const{station:i,line:s}of ne(e))for(const r of ea(i,s))t.has(r.id)||(t.add(r.id),a.push(r));return a}function ta(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${c("alertsWord",e.length)}</span>
    </button>
  `:""}function kn(e){const t=[...e.stops].sort((d,m)=>m.sequence-d.sequence),a=48,i=44,s=28,r=88,o=122,l=i+s+(t.length-1)*a,p=new Map,g=t.map((d,m)=>{const f={...d,label:ge(d.name),y:i+m*a,index:m,isTerminal:m===0||m===t.length-1};p.set(d.id,m),p.set(`${e.agencyId}_${d.id}`,m);for(const h of e.stationAliases?.[d.id]??[])p.set(h,m),p.set(`${e.agencyId}_${h}`,m);return f});let u=0;for(let d=0;d<g.length;d+=1)g[d].cumulativeMinutes=u,u+=d<g.length-1?g[d].segmentMinutes:0;return{totalMinutes:u,height:l,labelX:o,stationGap:a,stationIndexByStopId:p,stations:g,trackX:r}}function En(e){switch(e){case"ARR":return c("arrivingStatus");case"DELAY":return c("delayedStatus");case"OK":return c("enRoute");default:return""}}function S(e){if(!n.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(n.fetchedAt).getTime())/1e3));return e-t}function G(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function We(e){const t=S(e.nextOffset??0),a=S(e.closestOffset??0),i=e.delayInfo.text;return t<=15?[{text:c("arrivingNow"),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:c("arrivingIn",M(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:c("nextStopIn",M(t)),toneClass:"status-arriving"},{text:i,toneClass:e.delayInfo.colorClass}]:[{text:En(e.serviceStatus),toneClass:G(e,t)},{text:i,toneClass:e.delayInfo.colorClass}]}function H(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function aa(e){const t=S(e.nextOffset??0),a=S(e.closestOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel,[s,r]=We(e);return t<=15?`${e.label} at ${i} ${H([s,r])}`:t<=90?`${e.label} at ${i} ${H([s,r])}`:a<0&&t>0?`${e.label} ${i} ${H([s,r])}`:`${e.label} to ${i} ${H([s,r])}`}function Pe(e){return H(We(e))}function na(e,t){if(!t.length)return"";const a=[...t].sort((s,r)=>S(s.nextOffset??0)-S(r.nextOffset??0)).slice(0,8),i=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${i.map(s=>`
          <span
            class="line-marquee-item ${G(s,S(s.nextOffset??0))}"
            data-vehicle-marquee="${s.id}"
          >
            <span class="line-marquee-token">${s.lineToken}</span>
            <span class="line-marquee-copy">${aa(s)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function Rn(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const i=a.dataset.vehicleStatus,s=$e().find(o=>o.id===i);if(!s)return;const r=S(s.nextOffset??0);a.innerHTML=Pe(s),a.className=`train-list-status ${G(s,r)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const i=a.dataset.vehicleMarquee,s=$e().find(l=>l.id===i);if(!s)return;const r=S(s.nextOffset??0);a.className=`line-marquee-item ${G(s,r)}`;const o=a.querySelector(".line-marquee-copy");o&&(o.innerHTML=aa(s))})}function zn(e){return e.fromLabel===e.toLabel||e.progress===0?n.language==="zh-CN"?`位于 ${e.fromLabel}`:`At ${e.fromLabel}`:`${e.fromLabel} -> ${e.toLabel}`}function On(e){return e.fromLabel===e.toLabel||e.progress===0?n.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:n.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function _n(e){const t=n.layouts.get(e.lineId),a=Math.max(0,ga(e,t).at(-1)?.etaSeconds??e.nextOffset??0),i=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${n.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${i}</p>
        <p class="train-focus-metric-copy">${M(S(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${n.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${Z(e,t)}</p>
        <p class="train-focus-metric-copy">${M(S(a))}</p>
      </div>
    </div>
  `}function $e(){return n.lines.flatMap(e=>(n.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function Pn(){return Object.values(me).filter(e=>n.systemsById.has(e.id)).map(e=>`
        <button
          class="tab-button ${e.id===n.activeSystemId?"is-active":""}"
          data-system-switch="${e.id}"
          type="button"
        >
          ${e.label}
        </button>
      `).join("")}function Ie(){return!n.compactLayout||n.lines.length<2?"":`<section class="line-switcher">${n.lines.map(t=>`
        <button
          class="line-switcher-button ${t.id===n.activeLineId?"is-active":""}"
          data-line-switch="${t.id}"
          type="button"
          style="--line-color:${t.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <span>${t.name}</span>
        </button>
      `).join("")}</section>`}function ia(){return n.compactLayout?n.lines.filter(e=>e.id===n.activeLineId):n.lines}function Bn(e,t){if(!e.length||t<2)return{averageText:"—",detailText:n.language==="zh-CN"?`${L()}数量不足，无法判断间隔`:`Too few ${L().toLowerCase()} for a spacing read`};const a=Math.round(e.reduce((r,o)=>r+o,0)/e.length),i=Math.min(...e),s=Math.max(...e);return{averageText:`~${a} min`,detailText:n.language==="zh-CN"?`观测间隔 ${i}-${s} 分钟`:`${i}-${s} min observed gap`}}function vt(e,t,a){const{averageText:i,detailText:s}=Bn(t,a);return`
    <div class="headway-health-card">
      <p class="headway-health-label">${e}</p>
      <p class="headway-health-value">${i}</p>
      <p class="headway-health-copy">${s}</p>
    </div>
  `}function qn(e,t){return Math.abs(e.length-t.length)<=1?{label:n.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:e.length>t.length?{label:n.language==="zh-CN"?"北向偏多":"Northbound heavier",tone:"warn"}:{label:n.language==="zh-CN"?"南向偏多":"Southbound heavier",tone:"warn"}}function Fn(e,t){return`
    <div class="delay-distribution">
      ${[[n.language==="zh-CN"?"准点":"On time",e.onTime,"healthy"],[n.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",e.minorLate,"warn"],[n.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",e.severeLate,"alert"]].map(([i,s,r])=>`
        <div class="delay-chip delay-chip-${r}">
          <p class="delay-chip-label">${i}</p>
          <p class="delay-chip-value">${s}</p>
          <p class="delay-chip-copy">${Et(s,t)}</p>
        </div>
      `).join("")}
    </div>
  `}function yt(e,t,a,i){if(!t.length)return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${e}</p>
          <p class="flow-lane-copy">${c("noLiveVehicles",L().toLowerCase())}</p>
        </div>
      </div>
    `;const s=[...t].sort((o,l)=>o.minutePosition-l.minutePosition),r=s.map(o=>{const l=a.totalMinutes>0?o.minutePosition/a.totalMinutes:0;return Math.max(0,Math.min(100,l*100))});return`
    <div class="flow-lane">
      <div class="flow-lane-header">
        <p class="flow-lane-title">${e}</p>
        <p class="flow-lane-copy">${c("liveCount",s.length,s.length===1?A().toLowerCase():L().toLowerCase())}</p>
      </div>
      <div class="flow-track" style="--line-color:${i};">
        ${r.map((o,l)=>`
          <span
            class="flow-vehicle"
            style="left:${o}%; --line-color:${i};"
            title="${s[l].label} · ${zn(s[l])}"
          ></span>
        `).join("")}
      </div>
    </div>
  `}function sa(e,t,a,i){const s=[],r=n.layouts.get(e.id),o=R("▲",r,{includeSymbol:!0}),l=R("▼",r,{includeSymbol:!0}),{stats:p}=fe(he(t,[]).nbGaps,t.length),{stats:g}=fe(he([],a).sbGaps,a.length),u=[...t,...a].filter(m=>Number(m.scheduleDeviation??0)>300),d=Math.abs(t.length-a.length);return p.max!=null&&p.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`${o} 当前有 ${p.max} 分钟的服务空档。`:`${o} has a ${p.max} min service hole right now.`}),g.max!=null&&g.max>=12&&s.push({tone:"alert",copy:n.language==="zh-CN"?`${l} 当前有 ${g.max} 分钟的服务空档。`:`${l} has a ${g.max} min service hole right now.`}),d>=2&&s.push({tone:"warn",copy:t.length>a.length?n.language==="zh-CN"?`车辆分布向 ${o} 偏多 ${d} 辆。`:`Vehicle distribution is tilted toward ${o} by ${d}.`:n.language==="zh-CN"?`车辆分布向 ${l} 偏多 ${d} 辆。`:`Vehicle distribution is tilted toward ${l} by ${d}.`}),u.length&&s.push({tone:"warn",copy:n.language==="zh-CN"?`${u.length} 辆${u.length===1?A().toLowerCase():L().toLowerCase()}晚点超过 5 分钟。`:`${u.length} ${u.length===1?A().toLowerCase():L().toLowerCase()} are running 5+ min late.`}),i.length&&s.push({tone:"info",copy:n.language==="zh-CN"?`${e.name} 当前受 ${i.length} 条告警影响。`:`${i.length} active alert${i.length===1?"":"s"} affecting ${e.name}.`}),s.length||s.push({tone:"healthy",copy:n.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),s.slice(0,4)}function Be(e){return e.map(t=>{const a=n.layouts.get(t.id),i=n.vehiclesByLine.get(t.id)??[],s=i.filter(l=>l.directionSymbol==="▲"),r=i.filter(l=>l.directionSymbol==="▼"),o=ae(t.id);return{line:t,layout:a,vehicles:i,nb:s,sb:r,lineAlerts:o,exceptions:sa(t,s,r,o)}})}function $t(e){return`
    <div class="attention-reason-badges">
      ${e.map(t=>`
        <span class="attention-reason-badge attention-reason-badge-${t.tone}">${t.label}</span>
      `).join("")}
    </div>
  `}function ra(e){const t=e.length,a=e.reduce((v,C)=>v+C.vehicles.length,0),i=e.reduce((v,C)=>v+C.lineAlerts.length,0),s=e.filter(v=>v.lineAlerts.length>0).length,r=new Set(e.flatMap(v=>v.lineAlerts.flatMap(C=>C.stopIds??[]))).size,o=e.flatMap(v=>v.vehicles),l=Me(o),p=e.map(v=>{const{nbGaps:C,sbGaps:K}=he(v.nb,v.sb),k=[...C,...K].length?Math.max(...C,...K):0,O=v.vehicles.filter(N=>Number(N.scheduleDeviation??0)>300).length,ie=Me(v.vehicles),se=Math.abs(v.nb.length-v.sb.length),re=fe(C,v.nb.length).health,Se=fe(K,v.sb.length).health,we=[re,Se].some(N=>N==="uneven"||N==="bunched"||N==="sparse"),oe=O>0,le=v.lineAlerts.length*5+O*3+Math.max(0,k-10),Le=Ka({worstGap:k,severeLateCount:O,alertCount:v.lineAlerts.length,balanceDelta:se,language:n.language});return{line:v.line,score:le,worstGap:k,severeLateCount:O,alertCount:v.lineAlerts.length,impactedStopCount:new Set(v.lineAlerts.flatMap(N=>N.stopIds??[])).size,balanceDelta:se,hasSevereLate:oe,isUneven:we,attentionReasons:Le,delayBuckets:ie}}).sort((v,C)=>C.score-v.score||C.worstGap-v.worstGap),g=new Set(p.filter(v=>v.hasSevereLate).map(v=>v.line.id)),u=new Set(p.filter(v=>v.isUneven).map(v=>v.line.id)),d=p.filter(v=>v.hasSevereLate&&!v.isUneven).length,m=p.filter(v=>v.isUneven&&!v.hasSevereLate).length,f=p.filter(v=>v.hasSevereLate&&v.isUneven).length,h=new Set([...g,...u]).size,$=Math.max(0,t-h),I=a?Math.round(l.onTime/a*100):null,y=p.filter(v=>v.score>0).slice(0,2);let T={tone:"healthy",copy:n.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const b=p[0]??null;return b?.alertCount?T={tone:"info",copy:n.language==="zh-CN"?`${b.line.name} 当前有 ${b.alertCount} 条生效告警。`:`${b.line.name} has ${b.alertCount} active alert${b.alertCount===1?"":"s"}.`}:b?.worstGap>=12?T={tone:"alert",copy:n.language==="zh-CN"?`当前最大实时间隔为空 ${b.line.name} 的 ${b.worstGap} 分钟。`:`Largest live gap: ${b.worstGap} min on ${b.line.name}.`}:b?.severeLateCount&&(T={tone:"warn",copy:n.language==="zh-CN"?`${b.line.name} 有 ${b.severeLateCount} 辆${b.severeLateCount===1?A().toLowerCase():L().toLowerCase()}晚点超过 5 分钟。`:`${b.line.name} has ${b.severeLateCount} ${b.severeLateCount===1?A().toLowerCase():L().toLowerCase()} running 5+ min late.`}),{totalLines:t,totalVehicles:a,totalAlerts:i,impactedLines:s,impactedStopCount:r,delayedLineIds:g,unevenLineIds:u,lateOnlyLineCount:d,unevenOnlyLineCount:m,mixedIssueLineCount:f,attentionLineCount:h,healthyLineCount:$,onTimeRate:I,rankedLines:p,priorityLines:y,topIssue:T}}function bt(e,t,{suffix:a="",invert:i=!1}={}){if(e==null||t==null||e===t)return n.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const s=e-t,r=i?s<0:s>0,o=s>0?"↑":"↓";return n.language==="zh-CN"?`${r?"改善":"变差"} ${o} ${Math.abs(s)}${a}`:`${r?"Improving":"Worse"} ${o} ${Math.abs(s)}${a}`}function Hn(e){const t=ra(e),a=n.systemSnapshots.get(n.activeSystemId)?.previous??null,i=[];t.totalAlerts>0&&i.push({tone:"info",copy:n.language==="zh-CN"?`${t.impactedLines} 条线路共受 ${t.totalAlerts} 条告警影响。`:`${t.totalAlerts} active alert${t.totalAlerts===1?"":"s"} across ${t.impactedLines} line${t.impactedLines===1?"":"s"}.`}),t.delayedLineIds.size>0&&i.push({tone:"warn",copy:n.language==="zh-CN"?`${t.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${t.delayedLineIds.size} line${t.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),t.unevenLineIds.size>0&&i.push({tone:"alert",copy:n.language==="zh-CN"?`${t.unevenLineIds.size} 条线路当前发车间隔不均。`:`${t.unevenLineIds.size} line${t.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),i.length||i.push({tone:"healthy",copy:n.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const s=[{label:n.language==="zh-CN"?"准点率":"On-Time Rate",value:t.onTimeRate!=null?`${t.onTimeRate}%`:"—",delta:bt(t.onTimeRate,a?.onTimeRate,{suffix:"%"})},{label:n.language==="zh-CN"?"需关注线路":"Attention Lines",value:t.attentionLineCount,delta:bt(t.attentionLineCount,a?.attentionLineCount,{invert:!0})}];return`
    <article class="panel-card panel-card-wide system-summary-card">
      <header class="panel-header">
        <div class="system-summary-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:var(--accent-strong);">${V().label[0]}</span>
            <div class="line-title-copy">
              <h2>${V().label} ${n.language==="zh-CN"?"概览":"Summary"}</h2>
              <p>${n.language==="zh-CN"?`系统内 ${t.totalLines} 条线路 · 更新于 ${Oe()}`:`${t.totalLines} line${t.totalLines===1?"":"s"} in system · Updated ${Oe()}`}</p>
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
          <p class="metric-chip-label">${n.language==="zh-CN"?`实时${L()}`:`Live ${L()}`}</p>
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
          ${(t.priorityLines.length?t.priorityLines:t.rankedLines.slice(0,1)).map(({line:r,worstGap:o,severeLateCount:l,alertCount:p,attentionReasons:g})=>`
            <div class="system-priority-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${r.color};">${r.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${r.name}</p>
                  <p class="headway-chart-copy">${n.language==="zh-CN"?`${o?`最大间隔 ${o} 分钟`:"当前无明显间隔问题"}${l?` · ${l} 辆严重晚点`:""}${p?` · ${p} 条告警`:""}`:`${o?`Gap ${o} min`:"No major spacing issue"}${l?` · ${l} severe late`:""}${p?` · ${p} alert${p===1?"":"s"}`:""}`}</p>
                  ${$t(g)}
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
          ${t.rankedLines.slice(0,3).map(({line:r,score:o,worstGap:l,alertCount:p,severeLateCount:g,attentionReasons:u})=>`
            <div class="system-ranking-item">
              <div class="line-title">
                <span class="line-token" style="--line-color:${r.color};">${r.name[0]}</span>
                <div class="line-title-copy">
                  <p class="headway-chart-title">${r.name}</p>
                  <p class="headway-chart-copy">${n.language==="zh-CN"?`评分 ${o}${l?` · 最大间隔 ${l} 分钟`:""}${p?` · ${p} 条告警`:""}${g?` · ${g} 辆严重晚点`:""}`:`Score ${o}${l?` · gap ${l} min`:""}${p?` · ${p} alert${p===1?"":"s"}`:""}${g?` · ${g} severe late`:""}`}</p>
                  ${$t(u)}
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
  `}function Un(e){const t=e.flatMap(o=>o.exceptions.map(l=>({tone:l.tone,copy:`${o.line.name}: ${l.copy}`,lineColor:o.line.color})));if(!t.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${n.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}">
        <div class="insights-ticker-viewport">
          <span class="insights-ticker-item insights-ticker-item-healthy">${n.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span>
        </div>
      </section>
    `;const a=Vn(),i=Math.ceil(t.length/a),s=n.insightsTickerIndex%i,r=t.slice(s*a,s*a+a);return`
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
  `}function Vn(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,i=Math.min(t,e,a);return i>=1680?3:i>=980?2:1}function Wn(e,t,a,i,s){const r=a.length+i.length;if(!r)return"";const{nbGaps:o,sbGaps:l}=he(a,i),p=Me([...a,...i]),g=[...o,...l].length?Math.max(...o,...l):null,u=qn(a,i),d=sa(e,a,i,s),m=new Set(s.flatMap(f=>f.stopIds??[])).size;return`
    <div class="line-insights">
      <div class="metric-strip">
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"运营中":"In Service"}</p>
          <p class="metric-chip-value">${r}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"准点率":"On-Time Rate"}</p>
          <p class="metric-chip-value">${Et(p.onTime,r)}</p>
        </div>
        <div class="metric-chip">
          <p class="metric-chip-label">${n.language==="zh-CN"?"最大间隔":"Worst Gap"}</p>
          <p class="metric-chip-value">${g!=null?`${g} min`:"—"}</p>
        </div>
        <div class="metric-chip metric-chip-${u.tone}">
          <p class="metric-chip-label">${n.language==="zh-CN"?"方向平衡":"Balance"}</p>
          <p class="metric-chip-value">${u.label}</p>
        </div>
      </div>
      <div class="headway-health-grid">
        ${vt(R("▲",t,{includeSymbol:!0}),o,a.length)}
        ${vt(R("▼",t,{includeSymbol:!0}),l,i.length)}
      </div>
      ${Fn(p,r)}
      <div class="flow-grid">
        ${yt(n.language==="zh-CN"?`${R("▲",t,{includeSymbol:!0})} 流向`:`${R("▲",t,{includeSymbol:!0})} flow`,a,t,e.color)}
        ${yt(n.language==="zh-CN"?`${R("▼",t,{includeSymbol:!0})} 流向`:`${R("▼",t,{includeSymbol:!0})} flow`,i,t,e.color)}
      </div>
      <div class="insight-exceptions">
        <div class="insight-exceptions-header">
          <p class="headway-chart-title">${n.language==="zh-CN"?"当前":"Now"}</p>
          <p class="headway-chart-copy">${s.length?n.language==="zh-CN"?`${s.length} 条生效告警${m?` · 影响 ${m} 个站点`:""}`:`${s.length} active alert${s.length===1?"":"s"}${m?` · ${m} impacted stops`:""}`:n.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p>
        </div>
        ${d.map(f=>`
          <div class="insight-exception insight-exception-${f.tone}">
            <p>${f.copy}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `}function oa(e,t=!1){const a=Date.now(),i=l=>{const p=l.arrivalTime,g=Math.floor((p-a)/1e3),u=M(g),d=Kt(l.arrivalTime,l.scheduleDeviation??0),m=He(d);let f="";if(l.distanceFromStop>0){const h=l.distanceFromStop>=1e3?`${(l.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(l.distanceFromStop)}m`,$=c("stopAway",l.numberOfStopsAway);f=` • ${h} • ${$}`}return`
      <div class="arrival-item" data-arrival-time="${l.arrivalTime}" data-schedule-deviation="${l.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${l.lineColor};">${l.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${l.lineName} ${A()} ${l.vehicleId}</span>
            <span class="arrival-destination">${c("toDestination",l.destination)}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${m}">${d}</span>
          <span class="arrival-time">
            <span class="arrival-countdown">${u}</span>
            <span class="arrival-precision">${f}</span>
          </span>
        </span>
      </div>
    `},s=ve("▲",e.nb),r=ve("▼",e.sb);if(t){ct.innerHTML="",dt.innerHTML="",Q.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,ee.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,qe();return}const o=(l,p,g)=>{if(!l.length){p.innerHTML="",g.innerHTML=`<div class="arrival-item muted">${c("noUpcomingVehicles",L().toLowerCase())}</div>`;return}const u=n.dialogDisplayMode?l.slice(0,2):[],d=n.dialogDisplayMode?l.slice(2):l;p.innerHTML=u.map(i).join(""),g.innerHTML=d.length?d.map(i).join(""):n.dialogDisplayMode?`<div class="arrival-item muted">${c("noAdditionalVehicles",L().toLowerCase())}</div>`:""};o(e.nb,ct,Q),o(e.sb,dt,ee),_t.textContent=W("▲",s,{includeSymbol:!0}),Pt.textContent=W("▼",r,{includeSymbol:!0}),qe()}function te(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const i=new Set;for(const r of a){const o=r.startsWith(`${t.agencyId}_`)?r:`${t.agencyId}_${r}`;i.add(o)}const s=e.id.replace(/-T\d+$/,"");return i.add(s.startsWith(`${t.agencyId}_`)?s:`${t.agencyId}_${s}`),[...i]}function ne(e){const t=n.lines.map(a=>{const i=a.stops.find(s=>s.id===e.id);return i?{line:a,station:i}:null}).filter(Boolean);return t.length>0?t:n.lines.map(a=>{const i=a.stops.find(s=>s.name===e.name);return i?{line:a,station:i}:null}).filter(Boolean)}function Gn(e){if(!e)return null;const t=e.trim().toLowerCase();for(const a of n.lines)for(const i of a.stops){const s=new Set([i.id,`${a.agencyId}_${i.id}`,i.name,ge(i.name),de(i.name),de(ge(i.name))]);for(const r of a.stationAliases?.[i.id]??[])s.add(r),s.add(`${a.agencyId}_${r}`),s.add(de(r));if([...s].some(r=>String(r).toLowerCase()===t))return i}return null}function jn(e){const t=new URL(window.location.href);t.searchParams.set("station",de(e.name)),window.history.pushState({},"",t)}function la(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function St(e){const t=new URL(window.location.href);e===j?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function ca(){const t=new URL(window.location.href).searchParams.get("system");return t&&n.systemsById.has(t)?t:j}function Ge(e){n.dialogDisplayMode=e,w.classList.toggle("is-display-mode",e),J.textContent=c(e?"exit":"board"),J.setAttribute("aria-label",c(e?"exit":"board")),n.dialogDisplayDirection="both",n.dialogDisplayAutoPhase="nb",Ke(),w.open&&n.currentDialogStation&&Ze(n.currentDialogStation).catch(console.error),be(),qe()}function Kn(){Ge(!n.dialogDisplayMode)}function je(){n.dialogDisplayDirectionTimer&&(window.clearInterval(n.dialogDisplayDirectionTimer),n.dialogDisplayDirectionTimer=0)}function da(){n.dialogDisplayDirectionAnimationTimer&&(window.clearTimeout(n.dialogDisplayDirectionAnimationTimer),n.dialogDisplayDirectionAnimationTimer=0),n.dialogDisplayAnimatingDirection="",Bt?.classList.remove("is-direction-animating"),qt?.classList.remove("is-direction-animating")}function Yn(e){if(!n.dialogDisplayMode||!e||e==="both")return;da(),n.dialogDisplayAnimatingDirection=e;const t=e==="nb"?Bt:qt;t&&(t.offsetWidth,t.classList.add("is-direction-animating"),n.dialogDisplayDirectionAnimationTimer=window.setTimeout(()=>{t.classList.remove("is-direction-animating"),n.dialogDisplayDirectionAnimationTimer=0,n.dialogDisplayAnimatingDirection===e&&(n.dialogDisplayAnimatingDirection="")},ka))}function Ke({animate:e=!1}={}){je(),da();const t=n.dialogDisplayDirection,a=t==="auto"?n.dialogDisplayAutoPhase:t;Ot.forEach(i=>{i.classList.toggle("is-active",i.dataset.dialogDirection===t)}),w.classList.toggle("show-nb-only",n.dialogDisplayMode&&a==="nb"),w.classList.toggle("show-sb-only",n.dialogDisplayMode&&a==="sb"),e&&Yn(a),n.dialogDisplayMode&&t==="auto"&&(n.dialogDisplayDirectionTimer=window.setInterval(()=>{n.dialogDisplayAutoPhase=n.dialogDisplayAutoPhase==="nb"?"sb":"nb",Ke({animate:!0})},Na))}function Ye(){n.dialogRefreshTimer&&(window.clearTimeout(n.dialogRefreshTimer),n.dialogRefreshTimer=0)}function Xe(){n.dialogDisplayTimer&&(window.clearInterval(n.dialogDisplayTimer),n.dialogDisplayTimer=0)}function Ae(e,t){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(e.style.transform="translateY(0)",!n.dialogDisplayMode||a.length<=3)return;const i=Number.parseFloat(window.getComputedStyle(e).rowGap||"0")||0,s=a[0].getBoundingClientRect().height+i,r=Math.max(0,a.length-3),o=Math.min(n.dialogDisplayIndexes[t],r);e.style.transform=`translateY(-${o*s}px)`}function qe(){Xe(),n.dialogDisplayIndexes={nb:0,sb:0},Ae(Q,"nb"),Ae(ee,"sb"),n.dialogDisplayMode&&(n.dialogDisplayTimer=window.setInterval(()=>{for(const[e,t]of[["nb",Q],["sb",ee]]){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const i=Math.max(0,a.length-3);n.dialogDisplayIndexes[e]=n.dialogDisplayIndexes[e]>=i?0:n.dialogDisplayIndexes[e]+1,Ae(t,e)}},Ma))}function Xn(){if(!w.open)return;w.querySelectorAll(".arrival-item[data-arrival-time]").forEach(t=>{const a=Number(t.dataset.arrivalTime),i=Number(t.dataset.scheduleDeviation||0),s=t.querySelector(".arrival-countdown"),r=t.querySelector(".arrival-status");if(!s||!r)return;s.textContent=M(Math.floor((a-Date.now())/1e3));const o=Kt(a,i),l=He(o);r.textContent=o,r.className=`arrival-status arrival-status-${l}`})}function Zn(){if(Ye(),!n.currentDialogStation)return;const e=()=>{n.dialogRefreshTimer=window.setTimeout(async()=>{!w.open||!n.currentDialogStation||(await Ze(n.currentDialogStation).catch(console.error),e())},Da)};e()}function ua(){n.currentDialogStationId="",n.currentDialogStation=null,w.open?w.close():(Ye(),Xe(),je(),Ge(!1),la())}async function wt(){const e=ca();e!==n.activeSystemId&&await $a(e,{updateUrl:!1,preserveDialog:!1});const t=new URL(window.location.href).searchParams.get("station"),a=Gn(t);n.isSyncingFromUrl=!0;try{if(!a){n.currentDialogStationId="",w.open&&w.close();return}if(n.activeTab="map",D(),n.currentDialogStationId===a.id&&w.open)return;await ma(a,!1)}finally{n.isSyncingFromUrl=!1}}function pa(e){const t=Nn(e);if(!t.length){Y.innerHTML="",Y.hidden=!0;return}Y.hidden=!1,Y.innerHTML=`
    <div class="station-alerts">
      ${t.map((a,i)=>`
        <button class="station-alert-pill" data-alert-idx="${i}" type="button">
          <span class="station-alert-pill-meta">${kt(a.severity)} · ${Nt(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||c("serviceAlert")}</span>
        </button>
      `).join("")}
    </div>
  `,Y.querySelectorAll(".station-alert-pill").forEach(a=>{const i=t[Number(a.dataset.alertIdx)];i&&a.addEventListener("click",()=>{const s=n.lines.find(r=>i.lineIds.includes(r.id));s&&fa(s)})})}async function ma(e,t=!0){ha(e.name),An(e),n.currentDialogStationId=e.id,n.currentDialogStation=e,pa(e),X([],!0),oa({nb:[],sb:[]},!0),t&&jn(e),w.showModal(),be(),Zn(),await Ze(e)}async function Ze(e){const t=n.activeDialogRequest+1;n.activeDialogRequest=t;const a=()=>n.activeDialogRequest!==t||!w.open;try{const i=ne(e),s=i.flatMap(({station:l,line:p})=>te(l,p)),r=await gt(s),o=await Promise.all(i.map(({station:l,line:p})=>bn(l,p,r)));if(a())return;pa(e),oa(Sn(o))}catch(i){if(a())return;X([],!1,e),Q.innerHTML=`<div class="arrival-item muted">${i.message}</div>`,ee.innerHTML=`<div class="arrival-item muted">${n.language==="zh-CN"?"请稍后重试":"Retry in a moment"}</div>`;return}try{const i=ii(e);if(!i.length){if(a())return;X([],!1,e);return}if(await _(Ra),a())return;const s=i.flatMap(({stop:o,line:l})=>te(o,l)),r=await gt(s);if(a())return;X(si(i,r),!1,e)}catch{if(a())return;X([],!1,e)}}function Jn(e){const t=n.layouts.get(e.id),a=n.vehiclesByLine.get(e.id)??[],i=ae(e.id),s=t.stations.map((l,p)=>{const g=t.stations[p-1],u=p>0?g.segmentMinutes:"",m=ea(l,e).length>0,f=l.isTerminal?15:10;return`
        <g transform="translate(0, ${l.y})" class="station-group${m?" has-alert":""}" data-stop-id="${l.id}" style="cursor: pointer;">
          ${p>0?`<text x="0" y="-14" class="segment-time">${u}</text>
                 <line x1="18" x2="${t.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
          <circle cx="${t.trackX}" cy="0" r="${l.isTerminal?11:5}" class="${l.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${e.color};"></circle>
          ${l.isTerminal?`<text x="${t.trackX}" y="4" text-anchor="middle" class="terminal-mark">${e.name[0]}</text>`:""}
          ${m?`<circle cx="${t.trackX+f}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
          <text x="${t.labelX}" y="5" class="station-label">${l.label}</text>
          <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
        </g>
      `}).join(""),r=a.map((l,p)=>{const g=ai(e.id,l.id);return`
        <g transform="translate(${t.trackX}, 0)" class="train" data-train-id="${l.id}">
          ${g.map((u,d)=>`
                <circle
                  cy="${u.y+(p%3-1)*1.5}"
                  r="${Math.max(3,7-d)}"
                  class="train-ghost-dot"
                  style="--line-color:${e.color}; --ghost-opacity:${Math.max(.18,.56-d*.1)};"
                ></circle>
              `).join("")}
          <g transform="translate(0, ${l.y+(p%3-1)*1.5})">
            <circle r="13" class="train-wave" style="--line-color:${e.color}; animation-delay:${p*.18}s;"></circle>
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${l.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${e.color};"></path>
          </g>
        </g>
      `}).join(""),o=A();return`
    <article class="line-card" data-line-id="${e.id}">
      <header class="line-card-header">
        <div class="line-title">
          <span class="line-token" style="--line-color:${e.color};">${e.name[0]}</span>
          <div class="line-title-copy">
            <div class="line-title-row">
              <h2>${e.name}</h2>
              ${ta(i,e.id)}
            </div>
            <p>${c("liveCount",a.length,a.length===1?o.toLowerCase():L().toLowerCase())}</p>
            <p>${Ue(e)}</p>
          </div>
        </div>
        ${Ve(e)}
      </header>
      ${na(e.color,a.map(l=>({...l,lineToken:e.name[0]})))}
      <svg viewBox="0 0 460 ${t.height}" class="line-diagram" role="img" aria-label="${n.language==="zh-CN"?`${e.name} 实时线路图`:`${e.name} live LED board`}">
        <line x1="${t.trackX}" x2="${t.trackX}" y1="${t.stations[0].y}" y2="${t.stations.at(-1).y}" class="spine" style="--line-color:${e.color};"></line>
        ${s}
        ${r}
      </svg>
    </article>
  `}function Qn(){const e=$e().sort((o,l)=>o.minutePosition-l.minutePosition),t=A(),a=L(),i=a.toLowerCase();return e.length?(n.compactLayout?n.lines.filter(o=>o.id===n.activeLineId):n.lines).map(o=>{const l=e.filter(h=>h.lineId===o.id),p=ae(o.id),g=[...l].sort((h,$)=>S(h.nextOffset??0)-S($.nextOffset??0)),u=g[0]??null,d=g.slice(1),m=h=>`
        <span class="train-direction-badge">
          ${W(h.directionSymbol,Z(h,n.layouts.get(h.lineId)),{includeSymbol:!0})}
        </span>
      `,f=h=>`
        <article class="train-list-item train-queue-item" data-train-id="${h.id}">
          <div class="train-list-main">
            <span class="line-token train-list-token" style="--line-color:${h.lineColor};">${h.lineToken}</span>
            <div>
              <div class="train-list-row">
                <p class="train-list-title">${h.lineName} ${t} ${h.label}</p>
                ${m(h)}
              </div>
              <p class="train-list-subtitle">${c("toDestination",Z(h,n.layouts.get(h.lineId)))}</p>
              <p class="train-list-status ${G(h,S(h.nextOffset??0))}" data-vehicle-status="${h.id}">${Pe(h)}</p>
            </div>
          </div>
          <div class="train-queue-side">
            <p class="train-queue-time">${M(S(h.nextOffset??0))}</p>
            <p class="train-queue-clock">${_e(S(h.nextOffset??0))}</p>
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
                  ${ta(p,o.id)}
                </div>
                <p>${c("inServiceCount",l.length,l.length===1?t.toLowerCase():L().toLowerCase())} · ${Ue(o)}</p>
              </div>
            </div>
            ${Ve(o)}
          </header>
          ${na(o.color,l)}
          <div class="line-readout train-columns train-stack-layout">
            ${u?`
                  <article class="train-focus-card train-list-item" data-train-id="${u.id}">
                    <div class="train-focus-header">
                      <div>
                        <p class="train-focus-kicker">${n.language==="zh-CN"?"最近一班":"Next up"}</p>
                        <div class="train-list-row">
                          <p class="train-focus-title">${u.lineName} ${t} ${u.label}</p>
                          ${m(u)}
                        </div>
                      </div>
                      <div class="train-focus-side">
                        <p class="train-focus-time">${M(S(u.nextOffset??0))}</p>
                        <p class="train-focus-clock">${_e(S(u.nextOffset??0))}</p>
                      </div>
                    </div>
                    <p class="train-focus-destination">${c("toDestination",Z(u,n.layouts.get(u.lineId)))}</p>
                    <p class="train-focus-segment">${On(u)}</p>
                    ${_n(u)}
                    <p class="train-list-status ${G(u,S(u.nextOffset??0))}" data-vehicle-status="${u.id}">${Pe(u)}</p>
                  </article>
                `:`<p class="train-readout muted">${c("noLiveVehicles",L().toLowerCase())}</p>`}
            ${d.length?`
                  <div class="train-queue-list">
                    <p class="train-queue-heading">${n.language==="zh-CN"?"后续车次":"Following vehicles"}</p>
                    ${d.map(f).join("")}
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
    `}function Z(e,t){if(!t?.stations?.length)return e.upcomingLabel??e.toLabel??e.currentStopLabel??c("terminalFallback");const a=e.directionSymbol==="▲"?0:t.stations.length-1;return t.stations[a]?.label??e.upcomingLabel}function ga(e,t,a=6){if(!t?.stations?.length)return[];const i=e.directionSymbol==="▲"?-1:1,s=[],r=new Set,o=e.upcomingStopIndex??e.currentIndex,l=Math.max(0,e.nextOffset??0),p=(u,d,{isNext:m=!1,isTerminal:f=!1}={})=>{if(u==null||r.has(u))return;const h=t.stations[u];h&&(r.add(u),s.push({id:`${e.id}:${h.id}`,label:h.label,etaSeconds:Math.max(0,Math.round(d)),clockTime:_e(d),isNext:m,isTerminal:f}))};p(o,l,{isNext:!0});let g=l;for(let u=o+i;s.length<a&&!(u<0||u>=t.stations.length);u+=i){const d=u-i,m=t.stations[d];g+=Math.max(0,Math.round((m?.segmentMinutes??0)*60));const f=u===0||u===t.stations.length-1;p(u,g,{isTerminal:f})}return s}function ha(e){Rt.textContent=e,mn.textContent=e,be()}function be(){const e=un;if(!e||!pn)return;const a=n.dialogDisplayMode&&w.open&&Rt.scrollWidth>e.clientWidth;e.classList.toggle("is-marquee",a)}function ei(e){return Math.max(1,Math.round(e/Ea*60))}function ti(e,t){const a=Date.now(),i=new Set;for(const s of t){const r=`${e}:${s.id}`;i.add(r);const l=[...(n.vehicleGhosts.get(r)??[]).filter(p=>a-p.timestamp<=rt),{y:s.y,minutePosition:s.minutePosition,timestamp:a}].slice(-6);n.vehicleGhosts.set(r,l)}for(const[s,r]of n.vehicleGhosts.entries()){if(!s.startsWith(`${e}:`))continue;const o=r.filter(l=>a-l.timestamp<=rt);if(!i.has(s)||o.length===0){n.vehicleGhosts.delete(s);continue}o.length!==r.length&&n.vehicleGhosts.set(s,o)}}function ai(e,t){return(n.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}function ni(e,t){if(!e||!t.length)return"";const a=Math.max(...t.map(s=>s.distanceKm),It/2),i=82;return`
    <div class="transfer-radar">
      <svg viewBox="0 0 164 164" class="transfer-radar-svg" aria-hidden="true">
        <circle cx="${i}" cy="${i}" r="64" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="44" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="24" class="transfer-radar-ring"></circle>
        <circle cx="${i}" cy="${i}" r="8" class="transfer-radar-core"></circle>
        ${t.map(s=>{const r=Pa(e,s.stop),o=22+s.distanceKm/a*44,l=i+Math.sin(r*Math.PI/180)*o,p=i-Math.cos(r*Math.PI/180)*o;return`
              <g>
                <line x1="${i}" y1="${i}" x2="${l.toFixed(1)}" y2="${p.toFixed(1)}" class="transfer-radar-spoke"></line>
                <circle cx="${l.toFixed(1)}" cy="${p.toFixed(1)}" r="7" class="transfer-radar-stop" style="--line-color:${s.line.color};"></circle>
              </g>
            `}).join("")}
      </svg>
      <div class="transfer-radar-copy">
        <p class="headway-chart-title">${n.language==="zh-CN"?"换乘雷达":"Transfer Radar"}</p>
        <p class="headway-chart-copy">${n.language==="zh-CN"?"中心为当前站，越远表示步行越久":"Center is this station; farther dots mean longer walks"}</p>
      </div>
    </div>
  `}function ii(e){if(!e)return[];const t=ne(e),a=new Set(t.map(({line:s,station:r})=>`${s.agencyId}:${s.id}:${r.id}`)),i=new Map;for(const s of n.systemsById.values())for(const r of s.lines??[])for(const o of r.stops??[]){if(a.has(`${r.agencyId}:${r.id}:${o.id}`))continue;const l=_a(e.lat,e.lon,o.lat,o.lon);if(l>It)continue;const p=`${s.id}:${r.id}`,g=i.get(p);(!g||l<g.distanceKm)&&i.set(p,{systemId:s.id,systemName:s.name,line:r,stop:o,distanceKm:l,walkMinutes:ei(l)})}return[...i.values()].sort((s,r)=>s.distanceKm-r.distanceKm||s.line.name.localeCompare(r.line.name)).slice(0,At*2)}function X(e,t=!1,a=n.currentDialogStation){if(t){F.hidden=!1,F.innerHTML=`
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
      ${ni(a,e)}
      <div class="transfer-list">
        ${e.map(i=>`
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${i.line.color};">${i.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${i.line.name} <span class="transfer-system-chip">${i.systemName}</span></p>
                    <p class="transfer-card-stop">${c("walkToStop",i.walkMinutes,i.stop.name)}</p>
                    <p class="transfer-card-meta">${Tn(i.distanceKm)}${i.arrival?` • ${c("toDestination",i.arrival.destination)}`:""}</p>
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
  `}function si(e,t){const a=Date.now(),i=[];for(const s of e){const r=te(s.stop,s.line),o=$n(t,s.line,r),l=[...o.nb,...o.sb].sort((m,f)=>m.arrivalTime-f.arrivalTime);if(!l.length)continue;const p=a+s.walkMinutes*6e4+za,g=l.find(m=>m.arrivalTime>=p)??l[0],u=g.arrivalTime-a-s.walkMinutes*6e4,d=Math.max(0,Math.round(u/6e4));i.push({...s,arrival:g,boardAt:g.arrivalTime,badge:u<=0?c("leaveNow"):d<=1?c("boardInOneMinute"):c("boardInMinutes",d),tone:d<=2?"hot":d<=8?"good":"calm",timeText:Ln(g.arrivalTime)})}return i.sort((s,r)=>s.boardAt-r.boardAt||s.distanceKm-r.distanceKm).slice(0,At)}function ri(){const e=ia(),t=Be(n.lines),a=A(),i=Be(e);return`
    ${Un(i)}
    ${Hn(t)}
    ${i.map(({line:s,layout:r,vehicles:o,nb:l,sb:p,lineAlerts:g})=>{const u=Wn(s,r,l,p,g);return`
        <article class="panel-card panel-card-wide">
          <header class="panel-header line-card-header">
            <div class="line-title">
              <span class="line-token" style="--line-color:${s.color};">${s.name[0]}</span>
              <div class="line-title-copy">
                <h2>${s.name}</h2>
                <p>${c("liveCount",o.length,o.length===1?A().toLowerCase():L().toLowerCase())} · ${Ue(s)}</p>
              </div>
            </div>
            ${Ve(s)}
          </header>
          ${Mn(s)}
          ${u||`<p class="train-readout muted">${n.language==="zh-CN"?`等待实时${a.toLowerCase()}数据…`:`Waiting for live ${a.toLowerCase()} data…`}</p>`}
        </article>
      `}).join("")}
  `}function oi(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await $a(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function xe(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{n.activeLineId=t.dataset.lineSwitch,D()})})}function Je(){n.currentTrainId="",z.open&&z.close()}function Qe(){P.open&&P.close()}function fa(e){const t=ae(e.id);Vt.textContent=c("affectedLineAlerts",e.name,t.length),Wt.textContent=c("activeAlerts",t.length),hn.textContent=e.name,mt.textContent="",mt.innerHTML=t.length?t.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${kt(a.severity)} • ${Nt(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||c("serviceAlert")}</p>
              <p class="alert-dialog-item-copy">${a.description||c("noAdditionalAlertDetails")}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">${c("readOfficialAlert")}</a></p>`:""}
            </article>
          `).join(""):`<p class="alert-dialog-item-copy">${c("noActiveAlerts")}</p>`,ze.hidden=!0,ze.removeAttribute("href"),P.open||P.showModal()}function Lt(){document.querySelectorAll("[data-alert-line-id]").forEach(t=>{t.addEventListener("click",()=>{const a=n.lines.find(i=>i.id===t.dataset.alertLineId);a&&fa(a)})})}function li(e){const t=e.fromLabel!==e.toLabel&&e.progress>0&&e.progress<1,a=t?e.fromLabel:e.previousLabel,i=t?`${e.fromLabel} -> ${e.toLabel}`:e.currentStopLabel,s=t?"Between":"Now",r=t?e.toLabel:e.upcomingLabel,o=t?e.progress:.5,l=n.layouts.get(e.lineId),p=ga(e,l),g=l?Z(e,l):e.upcomingLabel,u=p.at(-1)?.etaSeconds??Math.max(0,e.nextOffset??0),d=Yt(e.directionSymbol);Ft.textContent=`${e.lineName} ${A()} ${e.label}`,Ht.textContent=n.language==="zh-CN"?`${d} · ${c("toDestination",g)}`:`${d} to ${g}`,pt.className=`train-detail-status train-list-status-${He(e.serviceStatus)}`,pt.innerHTML=H(We(e)),z.querySelector(".train-eta-panel")?.remove(),ut.innerHTML=`
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
  `,ut.insertAdjacentHTML("afterend",`
      <section class="train-eta-panel">
        <div class="train-eta-summary">
          <div class="metric-chip">
            <p class="metric-chip-label">${c("direction")}</p>
            <p class="metric-chip-value">${d}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("terminal")}</p>
            <p class="metric-chip-value">${g}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("etaToTerminal")}</p>
            <p class="metric-chip-value">${M(u)}</p>
          </div>
        </div>
        <div class="train-eta-timeline">
          <div class="train-eta-header">
            <p class="train-detail-label">${c("upcomingStops")}</p>
            <p class="train-eta-header-copy">${c("liveEtaNow")}</p>
          </div>
          ${p.length?p.map(m=>`
                  <article class="train-eta-stop${m.isNext?" is-next":""}${m.isTerminal?" is-terminal":""}">
                    <div>
                      <p class="train-eta-stop-label">${m.isNext?c("nextStop"):m.isTerminal?c("terminal"):c("upcoming")}</p>
                      <p class="train-eta-stop-name">${m.label}</p>
                    </div>
                    <div class="train-eta-stop-side">
                      <p class="train-eta-stop-countdown">${M(m.etaSeconds)}</p>
                      <p class="train-eta-stop-clock">${m.clockTime}</p>
                    </div>
                  </article>
                `).join(""):`<p class="train-readout muted">${c("noDownstreamEta")}</p>`}
        </div>
      </section>
    `),z.open||z.showModal()}function Tt(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,i=$e().find(s=>s.id===a);i&&(n.currentTrainId=a,li(i))})})}function ci(){n.lines.forEach(e=>{const t=n.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.stopId,o=t.stations.find(l=>l.id===r);o&&ma(o)})})})}function D(){const e=V();if(document.documentElement.lang=n.language,ke.textContent=c("languageToggle"),ke.setAttribute("aria-label",c("languageToggleAria")),Ee.textContent=n.theme==="dark"?c("themeLight"):c("themeDark"),Ee.setAttribute("aria-label",c("themeToggleAria")),on.textContent=e.kicker,ln.textContent=e.title,Ce.setAttribute("aria-label",c("transitSystems")),cn.setAttribute("aria-label",c("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",c("boardDirectionView")),_t.textContent=W("▲",ve("▲"),{includeSymbol:!0}),Pt.textContent=W("▼",ve("▼"),{includeSymbol:!0}),J.textContent=n.dialogDisplayMode?c("exit"):c("board"),J.setAttribute("aria-label",n.dialogDisplayMode?c("exit"):c("board")),Ut.setAttribute("aria-label",c("closeTrainDialog")),Gt.setAttribute("aria-label",c("closeAlertDialog")),w.open||(ha(c("station")),zt.textContent=c("serviceSummary")),z.open||(Ft.textContent=c("train"),Ht.textContent=c("currentMovement")),P.open||(Vt.textContent=c("serviceAlert"),Wt.textContent=c("transitAdvisory")),ze.textContent=c("readOfficialAlert"),Ce.hidden=n.systemsById.size<2,Ce.innerHTML=Pn(),va(),Ne.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===n.activeTab)),Ne.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=c("tabMap")),t.dataset.tab==="trains"&&(t.textContent=L()),t.dataset.tab==="insights"&&(t.textContent=c("tabInsights"))}),oi(),n.activeTab==="map"){E.className="board";const t=ia();E.innerHTML=`${Ie()}${t.map(Jn).join("")}`,xe(),Lt(),ci(),Tt(),queueMicrotask(ye);return}if(n.activeTab==="trains"){E.className="board",E.innerHTML=`${Ie()}${Qn()}`,xe(),Lt(),Tt(),queueMicrotask(ye);return}n.activeTab==="insights"&&(E.className="board",E.innerHTML=`${Ie()}${ri()}`,xe())}function di(){window.clearInterval(n.insightsTickerTimer),n.insightsTickerTimer=0}function ui(){di(),n.insightsTickerTimer=window.setInterval(()=>{n.insightsTickerIndex+=1,n.activeTab==="insights"&&D()},5e3)}function va(){pe.textContent=n.error?c("statusHold"):c("statusSync"),pe.classList.toggle("status-pill-error",!!n.error),dn.textContent=`${c("nowPrefix")} ${Oe()}`,Re.textContent=n.error?n.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":wn(n.fetchedAt),lt.textContent=pe.textContent,lt.classList.toggle("status-pill-error",!!n.error),gn.textContent=Re.textContent}function pi(){window.clearTimeout(n.liveRefreshTimer),n.liveRefreshTimer=0}function mi(){pi();const e=()=>{n.liveRefreshTimer=window.setTimeout(async()=>{await et(),e()},xa)};e()}function ya(e){const t=n.systemsById.has(e)?e:j,a=n.systemsById.get(t);n.activeSystemId=t,n.lines=a?.lines??[],n.layouts=n.layoutsBySystem.get(t)??new Map,n.lines.some(i=>i.id===n.activeLineId)||(n.activeLineId=n.lines[0]?.id??""),n.vehiclesByLine=new Map,n.rawVehicles=[],n.arrivalsCache.clear(),n.alerts=[],n.error="",n.fetchedAt="",n.insightsTickerIndex=0,n.vehicleGhosts=new Map}async function $a(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!n.systemsById.has(e)||n.activeSystemId===e){t&&St(n.activeSystemId);return}ya(e),a||ua(),Je(),Qe(),D(),t&&St(e),await et()}async function gi(){for(let a=0;a<=4;a+=1){let i=null,s=null;try{i=await fetch(Ta,{cache:"no-store"}),s=await i.json()}catch(o){if(a===4)throw o;await _(1e3*2**a);continue}if(!i.ok){if(a===4)throw new Error(`Static data load failed with ${i.status}`);await _(1e3*2**a);continue}const r=s.systems??[];n.systemsById=new Map(r.map(o=>[o.id,o])),n.layoutsBySystem=new Map(r.map(o=>[o.id,new Map(o.lines.map(l=>[l.id,kn(l)]))])),ya(ca());return}}function hi(e){const t=[...new Set((e.allAffects??[]).map(i=>i.routeId).filter(Boolean))],a=n.lines.filter(i=>t.includes(getLineRouteId(i))).map(i=>i.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??c("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(i=>i.stopId).filter(Boolean))]}:null}async function et(){try{const e=await jt(vn(),"Realtime");n.error="",n.fetchedAt=new Date().toISOString(),n.rawVehicles=e.data.list??[],n.alerts=(e.data.references?.situations??[]).map(hi).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(s=>[s.id,s]));for(const s of n.lines){const r=n.layouts.get(s.id),o=n.rawVehicles.map(l=>sn(l,s,r,t,{language:n.language,copyValue:c})).filter(Boolean);n.vehiclesByLine.set(s.id,o),ti(s.id,o)}const a=ra(Be(n.lines)),i=n.systemSnapshots.get(n.activeSystemId);n.systemSnapshots.set(n.activeSystemId,{previous:i?.current??null,current:a})}catch(e){n.error=c("realtimeOffline"),console.error(e)}D()}async function fi(){Jt(In()),Zt(Cn()),ft(),await gi(),D(),await et(),await wt(),window.addEventListener("popstate",()=>{wt().catch(console.error)});const e=()=>{const a=n.compactLayout;if(ft(),be(),a!==n.compactLayout){D();return}ye()};window.addEventListener("resize",e),window.visualViewport?.addEventListener("resize",e),new ResizeObserver(()=>{ye()}).observe(E),mi(),ui(),window.setInterval(()=>{va(),Xn(),Rn()},1e3)}fi().catch(e=>{pe.textContent=c("statusFail"),Re.textContent=e.message});
