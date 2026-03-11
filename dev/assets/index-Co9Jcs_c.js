(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const ya="modulepreload",$a=function(e){return"/link/dev/"+e},lt={},ba=function(t,a,n){let i=Promise.resolve();if(a&&a.length>0){let f=function(g){return Promise.all(g.map(c=>Promise.resolve(c).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};var o=f;document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),u=l?.nonce||l?.getAttribute("nonce");i=f(a.map(g=>{if(g=$a(g),g in lt)return;lt[g]=!0;const c=g.endsWith(".css"),v=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${v}`))return;const b=document.createElement("link");if(b.rel=c?"stylesheet":ya,c||(b.as="script"),b.crossOrigin="",b.href=g,u&&b.setAttribute("nonce",u),document.head.appendChild(b),c)return new Promise((L,m)=>{b.addEventListener("load",L),b.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${g}`)))})}))}function s(l){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=l,window.dispatchEvent(u),!u.defaultPrevented)throw l}return i.then(l=>{for(const u of l||[])u.status==="rejected"&&s(u.reason);return t().catch(s)})};function Sa(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:i,onRegisteredSW:s,onRegisterError:o}=e;let l,u;const f=async(c=!0)=>{await u};async function g(){if("serviceWorker"in navigator){if(l=await ba(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(c=>{o?.(c)}),!l)return;l.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),l.addEventListener("installed",c=>{c.isUpdate||n?.()}),l.register({immediate:t}).then(c=>{s?s("/link/dev/sw.js",c):i?.(c)}).catch(c=>{o?.(c)})}}return u=g(),f}const wa="./pulse-data.json",Dt="https://api.pugetsound.onebusaway.org/api/where",Ye="TEST".trim()||"TEST",se=Ye==="TEST",La=se?6e4:2e4,ct=3,dt=800,Ta=se?2e4:5e3,ut=se?12e4:3e4,pt=se?1200:0,Ee=se?1:3,Ca=1100,Da=se?45e3:15e3,Aa=se?9e4:3e4,xa=4e3,Ia=15e3,Ma=520,gt=4*6e4,Na=4.8,At=.35,ka=45e3,xt=4,It="link-pulse-theme",Mt="link-pulse-language",re="link",Ce={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},mt={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}};function Ea(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function Nt(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function we(e){return e.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function ue(e,t,a){return Math.max(t,Math.min(e,a))}function pe(e){return new Promise(t=>window.setTimeout(t,e))}function Pe(e){const[t="0",a="0",n="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(n)}function Ra(e,t,a,n){const s=(a-e)*Math.PI/180,o=(n-t)*Math.PI/180,l=Math.sin(s/2)**2+Math.cos(e*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(o/2)**2;return 2*6371*Math.asin(Math.sqrt(l))}function za(e,t){const a=e.lat*Math.PI/180,n=t.lat*Math.PI/180,i=(t.lon-e.lon)*Math.PI/180,s=Math.sin(i)*Math.cos(n),o=Math.cos(a)*Math.sin(n)-Math.sin(a)*Math.cos(n)*Math.cos(i);return(Math.atan2(s,o)*180/Math.PI+360)%360}function Oa(e,t){if(!e)return t("waitingSnapshot");const a=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return a<10?t("updatedNow"):a<60?t("updatedSecondsAgo",a):t("updatedMinutesAgo",Math.round(a/60))}function Ba(e){return new Intl.DateTimeFormat(e==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:e!=="zh-CN"}).format(new Date)}function Pa(e,t,a){if(e<=0)return a("arriving");const n=Math.floor(e/60),i=e%60;return t==="zh-CN"?n>0?`${n}分 ${i}秒`:`${i}秒`:n>0?`${n}m ${i}s`:`${i}s`}function _a(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function Le(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function le(e,t){if(!e||!t)return null;const[a,n,i]=e.split("-").map(Number),s=Pe(t),o=Math.floor(s/3600),l=Math.floor(s%3600/60),u=s%60;return new Date(a,n-1,i,o,l,u)}function qa(e,t){const a=Math.max(0,Math.round(e/6e4)),n=Math.floor(a/60),i=a%60;return t==="zh-CN"?n&&i?`${n}小时${i}分钟`:n?`${n}小时`:`${i}分钟`:n&&i?`${n}h ${i}m`:n?`${n}h`:`${i}m`}function Fa(e,t){if(!e)return"";const[a="0",n="0"]=String(e).split(":"),i=Number(a),s=Number(n),o=(i%24+24)%24;if(t==="zh-CN")return`${String(o).padStart(2,"0")}:${String(s).padStart(2,"0")}`;const l=o>=12?"PM":"AM";return`${o%12||12}:${String(s).padStart(2,"0")} ${l}`}function kt(e,t){return new Date(e).toLocaleTimeString(t==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:t!=="zh-CN"})}function Ha(e,t){return kt(Date.now()+Math.max(0,e)*1e3,t)}function Ua(e,t){return e>=1?t("walkKm",e):t("walkMeters",Math.round(e*1e3))}function Ga(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function Va(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function Et(e,t){const a=[...e].sort((s,o)=>s.minutePosition-o.minutePosition),n=[...t].sort((s,o)=>s.minutePosition-o.minutePosition),i=s=>s.slice(1).map((o,l)=>Math.round(o.minutePosition-s[l].minutePosition));return{nbGaps:i(a),sbGaps:i(n)}}function Wa(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((i,s)=>i+s,0)/e.length,a=Math.max(...e),n=Math.min(...e);return{avg:Math.round(t),max:a,min:n,spread:a-n,ratio:a/Math.max(n,1)}}function _e(e,t){const a=Wa(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let n="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?n="bunched":a.max>=12||a.spread>=6?n="uneven":a.avg>=18&&(n="sparse"),{health:n,stats:a}}function Rt(e){return e.reduce((t,a)=>{const n=Number(a.scheduleDeviation??0);return n<=60?t.onTime+=1:n<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function ja(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function zt({worstGap:e,severeLateCount:t,alertCount:a,balanceDelta:n,language:i}){const s=[];return e>=12&&s.push({key:"gap",tone:"alert",label:i==="zh-CN"?"大间隔":"Large gap"}),t>0&&s.push({key:"late",tone:"warn",label:i==="zh-CN"?"严重晚点":"Severe late"}),a>0&&s.push({key:"alert",tone:"info",label:i==="zh-CN"?"有告警":"Alerted"}),n>=2&&s.push({key:"balance",tone:"warn",label:i==="zh-CN"?"方向失衡":"Imbalanced"}),s.length||s.push({key:"healthy",tone:"healthy",label:i==="zh-CN"?"健康":"Healthy"}),s}function Ka(e){function t(){const s=Math.max(0,e.obaRateLimitStreak-1),o=Math.min(ut,Ta*2**s),l=Math.round(o*(.15+Math.random()*.2));return Math.min(ut,o+l)}async function a(){const s=e.obaCooldownUntil-Date.now();s>0&&await pe(s)}function n(s){return s?.code===429||/rate limit/i.test(s?.text??"")}async function i(s,o){for(let l=0;l<=ct;l+=1){await a();let u=null,f=null,g=null;try{u=await fetch(s,{cache:"no-store"})}catch(b){g=b}if(u!==null)try{f=await u.json()}catch{f=null}const c=u?.status===429||n(f);if(u?.ok&&!c)return e.obaRateLimitStreak=0,e.obaCooldownUntil=0,f;const v=g!=null||u!=null&&(u.status===429||u.status>=500&&u.status<600);if(l===ct||!v)throw g||(f?.text?new Error(f.text):new Error(`${o} request failed with ${u?.status??"network error"}`));if(c){e.obaRateLimitStreak+=1;const b=dt*2**l,L=Math.max(b,t());e.obaCooldownUntil=Date.now()+L,await pe(L)}else{const b=dt*2**l;await pe(b)}}throw new Error(`${o} request failed`)}return{fetchJsonWithRetry:i,isRateLimitedPayload:n,waitForObaCooldown:a}}function Ya(e,t){const a=t.directionLookup?.[e.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const n=e.tripHeadsign??"",i=n.toLowerCase();return t.nbTerminusPrefix&&i.startsWith(t.nbTerminusPrefix)?"nb":t.sbTerminusPrefix&&i.startsWith(t.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function Ot(e){return e.routeKey??`${e.agencyId}_${e.id}`}function Xa(e,t){const a=e.tripHeadsign?.trim();return a?Nt(a.replace(/^to\s+/i,"")):t("terminalFallback")}function Za(e,t,a){return Math.floor((e-Date.now())/1e3)<=90?"ARR":t>=120?"DELAY":a==="zh-CN"?"准点":"ON TIME"}function Xe(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}function Ja({state:e,fetchJsonWithRetry:t,getStationStopIds:a,copyValue:n,getLanguage:i}){async function s(g){const c=`${Dt}/arrivals-and-departures-for-stop/${g}.json?key=${Ye}&minutesAfter=120`,v=await t(c,"Arrivals");if(v.code!==200)throw new Error(v.text||`Arrivals request failed for ${g}`);return v.data?.entry?.arrivalsAndDepartures??[]}async function o(g){const c=[...new Set(g)],v=[],b=[];for(let L=0;L<c.length;L+=Ee){const m=c.slice(L,L+Ee),S=await Promise.allSettled(m.map(C=>s(C)));v.push(...S),pt>0&&L+Ee<c.length&&await pe(pt)}for(const L of v)L.status==="fulfilled"&&b.push(...L.value);return b}function l(g,c,v=null){const b=Date.now(),L=new Set,m={nb:[],sb:[]},S=v?new Set(v):null;for(const C of g){if(C.routeId!==Ot(c)||S&&!S.has(C.stopId))continue;const z=C.predictedArrivalTime||C.scheduledArrivalTime;if(!z||z<=b)continue;const A=Ya(C,c);if(!A)continue;const y=`${C.tripId}:${C.stopId}:${z}`;L.has(y)||(L.add(y),m[A].push({vehicleId:(C.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:z,destination:Xa(C,n),scheduleDeviation:C.scheduleDeviation??0,tripId:C.tripId,lineColor:c.color,lineName:c.name,lineToken:c.name[0],distanceFromStop:C.distanceFromStop??0,numberOfStopsAway:C.numberOfStopsAway??0}))}return m.nb.sort((C,z)=>C.arrivalTime-z.arrivalTime),m.sb.sort((C,z)=>C.arrivalTime-z.arrivalTime),m.nb=m.nb.slice(0,4),m.sb=m.sb.slice(0,4),m}async function u(g,c,v=null){const b=`${e.activeSystemId}:${c.id}:${g.id}`,L=e.arrivalsCache.get(b);if(L&&Date.now()-L.fetchedAt<La)return L.value;const m=a(g,c),S=v??await o(m),C=l(S,c,m);return e.arrivalsCache.set(b,{fetchedAt:Date.now(),value:C}),C}function f(g){const c={nb:[],sb:[]};for(const v of g)c.nb.push(...v.nb),c.sb.push(...v.sb);return c.nb.sort((v,b)=>v.arrivalTime-b.arrivalTime),c.sb.sort((v,b)=>v.arrivalTime-b.arrivalTime),c}return{buildArrivalsForLine:l,fetchArrivalsForStop:s,fetchArrivalsForStopIds:o,getArrivalsForStation:u,mergeArrivalBuckets:f,getArrivalServiceStatus:(g,c)=>Za(g,c,i())}}function Qa(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function en(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase(),n=t.nextStopTimeOffset??0,i=t.scheduleDeviation??0,s=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||s&&Math.abs(n)<=90?"ARR":i>=120?"DELAY":"OK"}function tn(e,t,{language:a,copyValue:n}){if(!t)return{text:n("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:n("onTime"),colorClass:"status-ontime"};if(e>60){const i=Math.round(e/60);let s="status-late-minor";return e>600?s="status-late-severe":e>300&&(s="status-late-moderate"),{text:a==="zh-CN"?`晚点 ${i} 分钟`:`+${i} min late`,colorClass:s}}if(e<-60){const i=Math.round(Math.abs(e)/60);return{text:a==="zh-CN"?`早到 ${i} 分钟`:`${i} min early`,colorClass:"status-early"}}return{text:n("unknown"),colorClass:"status-muted"}}function an(e,t,a,n,{language:i,copyValue:s}){const o=e.tripStatus?.activeTripId??e.tripId??"",l=n.get(o);if(!l||l.routeId!==t.routeKey)return null;const u=e.tripStatus?.closestStop,f=e.tripStatus?.nextStop,g=a.stationIndexByStopId.get(u),c=a.stationIndexByStopId.get(f);if(g==null&&c==null)return null;let v=g??c,b=c??g;if(v>b){const $=v;v=b,b=$}const L=a.stations[v],m=a.stations[b],S=e.tripStatus?.closestStopTimeOffset??0,C=e.tripStatus?.nextStopTimeOffset??0,z=l.directionId==="1"?"▲":l.directionId==="0"?"▼":Qa(g,c);let A=0;v!==b&&S<0&&C>0&&(A=ue(Math.abs(S)/(Math.abs(S)+C),0,1));const y=L.y+(m.y-L.y)*A,B=v!==b?L.segmentMinutes:0,O=L.cumulativeMinutes+B*A,P=g??c??v,F=a.stations[P]??L,G=z==="▲",W=ue(P+(G?1:-1),0,a.stations.length-1),_=g!=null&&c!=null&&g!==c?c:ue(P+(G?-1:1),0,a.stations.length-1),H=a.stations[W]??F,k=a.stations[_]??m,T=e.tripStatus?.scheduleDeviation??0,x=e.tripStatus?.predicted??!1,q=tn(T,x,{language:i,copyValue:s});return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:z,fromLabel:L.label,minutePosition:O,progress:A,serviceStatus:en(e),toLabel:m.label,y,currentLabel:L.label,nextLabel:m.label,previousLabel:H.label,currentStopLabel:F.label,upcomingLabel:k.label,currentIndex:P,upcomingStopIndex:_,status:e.tripStatus?.status??"",closestStop:u,nextStop:f,closestOffset:S,nextOffset:C,scheduleDeviation:T,isPredicted:x,delayInfo:q,rawVehicle:e}}function nn(e){const{state:t,getAlertsForLine:a,getAlertsForStation:n,getTodayServiceSpan:i,getVehicleGhostTrail:s,getVehicleLabel:o,getVehicleLabelPlural:l,copyValue:u,renderInlineAlerts:f,renderLineStatusMarquee:g,renderServiceReminderChip:c}=e;function v(m){const S=String(m).trim().split(/\s+/).filter(Boolean);if(S.length<=1||m.length<=16)return[m];const C=Math.ceil(S.length/2),z=S.slice(0,C).join(" "),A=S.slice(C).join(" ");return Math.max(z.length,A.length)>m.length-4?[m]:[z,A]}function b(m,S){const C=v(m.label),z=C.length>1?-5:5,A=`station-label${C.length>1?" station-label-multiline":""}`;return`
      <text x="${S.labelX}" y="${z}" class="${A}">
        ${C.map((y,B)=>`<tspan x="${S.labelX}" dy="${B===0?0:15}">${y}</tspan>`).join("")}
      </text>
    `}function L(m){const S=t.layouts.get(m.id),C=t.vehiclesByLine.get(m.id)??[],z=a(m.id),A=S.stations.map((O,P)=>{const F=S.stations[P-1],G=P>0?F.segmentMinutes:"",_=n(O,m).length>0,H=O.isTerminal?15:10;return`
          <g transform="translate(0, ${O.y})" class="station-group${_?" has-alert":""}" data-stop-id="${O.id}" style="cursor: pointer;">
            ${P>0?`<text x="0" y="-14" class="segment-time">${G}</text>
                   <line x1="18" x2="${S.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
            <circle cx="${S.trackX}" cy="0" r="${O.isTerminal?11:5}" class="${O.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${m.color};"></circle>
            ${O.isTerminal?`<text x="${S.trackX}" y="4" text-anchor="middle" class="terminal-mark">${m.name[0]}</text>`:""}
            ${_?`<circle cx="${S.trackX+H}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
            ${b(O,S)}
            <rect x="0" y="-30" width="420" height="60" fill="transparent" class="station-hitbox"></rect>
          </g>
        `}).join(""),y=C.map((O,P)=>{const F=s(m.id,O.id);return`
          <g transform="translate(${S.trackX}, 0)" class="train" data-train-id="${O.id}">
            ${F.map((G,W)=>`
                  <circle
                    cy="${G.y+(P%3-1)*1.5}"
                    r="${Math.max(3,7-W)}"
                    class="train-ghost-dot"
                    style="--line-color:${m.color}; --ghost-opacity:${Math.max(.18,.56-W*.1)};"
                  ></circle>
                `).join("")}
            <g transform="translate(0, ${O.y+(P%3-1)*1.5})">
              <circle r="13" class="train-wave" style="--line-color:${m.color}; animation-delay:${P*.18}s;"></circle>
              <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${O.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${m.color};"></path>
            </g>
          </g>
        `}).join(""),B=o();return`
      <article class="line-card" data-line-id="${m.id}">
        <header class="line-card-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:${m.color};">${m.name[0]}</span>
            <div class="line-title-copy">
              <div class="line-title-row">
                <h2>${m.name}</h2>
                ${f(z,m.id)}
              </div>
              <p>${u("liveCount",C.length,C.length===1?B.toLowerCase():l().toLowerCase())}</p>
              <p>${i(m)}</p>
            </div>
          </div>
          ${c(m)}
        </header>
        ${g(m.color,C.map(O=>({...O,lineToken:m.name[0]})))}
        <svg viewBox="0 0 ${t.compactLayout?320:460} ${S.height}" class="line-diagram" role="img" aria-label="${t.language==="zh-CN"?`${m.name} 实时线路图`:`${m.name} live LED board`}">
          <line x1="${S.trackX}" x2="${S.trackX}" y1="${S.stations[0].y}" y2="${S.stations.at(-1).y}" class="spine" style="--line-color:${m.color};"></line>
          ${A}
          ${y}
        </svg>
      </article>
    `}return{renderLine:L}}function sn(e){const{state:t,copyValue:a,formatArrivalTime:n,formatDirectionLabel:i,formatEtaClockFromNow:s,formatVehicleLocationSummary:o,getAlertsForLine:l,getAllVehicles:u,getRealtimeOffset:f,getTodayServiceSpan:g,getVehicleDestinationLabel:c,getVehicleLabel:v,getVehicleLabelPlural:b,getVehicleStatusClass:L,renderFocusMetrics:m,renderInlineAlerts:S,renderLineStatusMarquee:C,renderServiceReminderChip:z,formatVehicleStatus:A}=e;function y(){const B=u().sort((_,H)=>_.minutePosition-H.minutePosition),O=v(),P=b(),F=P.toLowerCase();return B.length?(t.compactLayout?t.lines.filter(_=>_.id===t.activeLineId):t.lines).map(_=>{const H=B.filter(h=>h.lineId===_.id),k=l(_.id),T=[...H].sort((h,D)=>f(h.nextOffset??0)-f(D.nextOffset??0)),x=T[0]??null,q=T.slice(1),$=h=>`
          <span class="train-direction-badge">
            ${i(h.directionSymbol,c(h,t.layouts.get(h.lineId)),{includeSymbol:!0})}
          </span>
        `,d=h=>`
          <article class="train-list-item train-queue-item" data-train-id="${h.id}">
            <div class="train-list-main">
              <span class="line-token train-list-token" style="--line-color:${h.lineColor};">${h.lineToken}</span>
              <div>
                <div class="train-list-row">
                  <p class="train-list-title">${h.lineName} ${O} ${h.label}</p>
                  ${$(h)}
                </div>
                <p class="train-list-subtitle">${a("toDestination",c(h,t.layouts.get(h.lineId)))}</p>
                <p class="train-list-status ${L(h,f(h.nextOffset??0))}" data-vehicle-status="${h.id}">${A(h)}</p>
              </div>
            </div>
            <div class="train-queue-side">
              <p class="train-queue-time">${n(f(h.nextOffset??0))}</p>
              <p class="train-queue-clock">${s(f(h.nextOffset??0))}</p>
            </div>
          </article>
        `;return`
          <article class="line-card train-line-card">
            <header class="line-card-header train-list-section-header">
              <div class="line-title">
                <span class="line-token" style="--line-color:${_.color};">${_.name[0]}</span>
                <div class="line-title-copy">
                  <div class="line-title-row">
                    <h2>${_.name}</h2>
                    ${S(k,_.id)}
                  </div>
                  <p>${a("inServiceCount",H.length,H.length===1?O.toLowerCase():b().toLowerCase())} · ${g(_)}</p>
                </div>
              </div>
              ${z(_)}
            </header>
            ${C(_.color,H)}
            <div class="line-readout train-columns train-stack-layout">
              ${x?`
                    <article class="train-focus-card train-list-item" data-train-id="${x.id}">
                      <div class="train-focus-header">
                        <div>
                          <p class="train-focus-kicker">${t.language==="zh-CN"?"最近一班":"Next up"}</p>
                          <div class="train-list-row">
                            <p class="train-focus-title">${x.lineName} ${O} ${x.label}</p>
                            ${$(x)}
                          </div>
                        </div>
                        <div class="train-focus-side">
                          <p class="train-focus-time">${n(f(x.nextOffset??0))}</p>
                          <p class="train-focus-clock">${s(f(x.nextOffset??0))}</p>
                        </div>
                      </div>
                      <p class="train-focus-destination">${a("toDestination",c(x,t.layouts.get(x.lineId)))}</p>
                      <p class="train-focus-segment">${o(x)}</p>
                      ${m(x)}
                      <p class="train-list-status ${L(x,f(x.nextOffset??0))}" data-vehicle-status="${x.id}">${A(x)}</p>
                    </article>
                  `:`<p class="train-readout muted">${a("noLiveVehicles",b().toLowerCase())}</p>`}
              ${q.length?`
                    <div class="train-queue-list">
                      <p class="train-queue-heading">${t.language==="zh-CN"?"后续车次":"Following vehicles"}</p>
                      ${q.map(d).join("")}
                    </div>
                  `:""}
            </div>
          </article>
        `}).join(""):`
        <section class="board" style="grid-template-columns: 1fr;">
          <article class="panel-card">
            <h2>${a("activeVehicles",P)}</h2>
            <p>${a("noLiveVehicles",F)}</p>
          </article>
        </section>
      `}return{renderTrainList:y}}function rn(e){const{state:t,classifyHeadwayHealth:a,computeLineHeadways:n,copyValue:i,formatCurrentTime:s,formatLayoutDirectionLabel:o,formatPercent:l,getActiveSystemMeta:u,getAlertsForLine:f,getDelayBuckets:g,getLineAttentionReasons:c,getInsightsTickerPageSize:v,getRealtimeOffset:b,getTodayServiceSpan:L,getVehicleLabel:m,getVehicleLabelPlural:S,renderServiceReminderChip:C,renderServiceTimeline:z}=e;function A($,d){if(!$.length||d<2)return{averageText:"—",detailText:t.language==="zh-CN"?`${S()}数量不足，无法判断间隔`:`Too few ${S().toLowerCase()} for a spacing read`};const h=Math.round($.reduce((M,I)=>M+I,0)/$.length),D=Math.min(...$),w=Math.max(...$);return{averageText:`~${h} min`,detailText:t.language==="zh-CN"?`观测间隔 ${D}-${w} 分钟`:`${D}-${w} min observed gap`}}function y($,d,h){const{averageText:D,detailText:w}=A(d,h);return`
      <div class="headway-health-card">
        <p class="headway-health-label">${$}</p>
        <p class="headway-health-value">${D}</p>
        <p class="headway-health-copy">${w}</p>
      </div>
    `}function B($,d){return Math.abs($.length-d.length)<=1?{label:t.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:$.length>d.length?{label:t.language==="zh-CN"?"北向偏多":"Northbound heavier",tone:"warn"}:{label:t.language==="zh-CN"?"南向偏多":"Southbound heavier",tone:"warn"}}function O($,d){return`
      <div class="delay-distribution">
        ${[[t.language==="zh-CN"?"准点":"On time",$.onTime,"healthy"],[t.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",$.minorLate,"warn"],[t.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",$.severeLate,"alert"]].map(([D,w,M])=>`
          <div class="delay-chip delay-chip-${M}">
            <p class="delay-chip-label">${D}</p>
            <p class="delay-chip-value">${w}</p>
            <p class="delay-chip-copy">${l(w,d)}</p>
          </div>
        `).join("")}
      </div>
    `}function P($,d,h,D){if(!d.length)return`
        <div class="flow-lane">
          <div class="flow-lane-header">
            <p class="flow-lane-title">${$}</p>
            <p class="flow-lane-copy">${i("noLiveVehicles",S().toLowerCase())}</p>
          </div>
        </div>
      `;const w=[...d].sort((I,E)=>I.minutePosition-E.minutePosition),M=w.map(I=>{const E=h.totalMinutes>0?I.minutePosition/h.totalMinutes:0;return Math.max(0,Math.min(100,E*100))});return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${$}</p>
          <p class="flow-lane-copy">${i("liveCount",w.length,w.length===1?m().toLowerCase():S().toLowerCase())}</p>
        </div>
        <div class="flow-track" style="--line-color:${D};">
          ${M.map((I,E)=>`
            <span
              class="flow-vehicle"
              style="left:${I}%; --line-color:${D};"
              title="${w[E].label}"
            ></span>
          `).join("")}
        </div>
      </div>
    `}function F($,d,h,D){const w=[],M=t.layouts.get($.id),I=o("▲",M,{includeSymbol:!0}),E=o("▼",M,{includeSymbol:!0}),{stats:R}=a(n(d,[]).nbGaps,d.length),{stats:U}=a(n([],h).sbGaps,h.length),j=[...d,...h].filter(ee=>Number(ee.scheduleDeviation??0)>300),J=Math.abs(d.length-h.length);return R.max!=null&&R.max>=12&&w.push({tone:"alert",copy:t.language==="zh-CN"?`${I} 当前有 ${R.max} 分钟的服务空档。`:`${I} has a ${R.max} min service hole right now.`}),U.max!=null&&U.max>=12&&w.push({tone:"alert",copy:t.language==="zh-CN"?`${E} 当前有 ${U.max} 分钟的服务空档。`:`${E} has a ${U.max} min service hole right now.`}),J>=2&&w.push({tone:"warn",copy:d.length>h.length?t.language==="zh-CN"?`车辆分布向 ${I} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${I} by ${J}.`:t.language==="zh-CN"?`车辆分布向 ${E} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${E} by ${J}.`}),j.length&&w.push({tone:"warn",copy:t.language==="zh-CN"?`${j.length} 辆${j.length===1?m().toLowerCase():S().toLowerCase()}晚点超过 5 分钟。`:`${j.length} ${j.length===1?m().toLowerCase():S().toLowerCase()} are running 5+ min late.`}),D.length&&w.push({tone:"info",copy:t.language==="zh-CN"?`${$.name} 当前受 ${D.length} 条告警影响。`:`${D.length} active alert${D.length===1?"":"s"} affecting ${$.name}.`}),w.length||w.push({tone:"healthy",copy:t.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),w.slice(0,4)}function G($){return $.map(d=>{const h=t.layouts.get(d.id),D=t.vehiclesByLine.get(d.id)??[],w=D.filter(E=>E.directionSymbol==="▲"),M=D.filter(E=>E.directionSymbol==="▼"),I=f(d.id);return{line:d,layout:h,vehicles:D,nb:w,sb:M,lineAlerts:I,exceptions:F(d,w,M,I)}})}function W($){return`
      <div class="attention-reason-badges">
        ${$.map(d=>`<span class="attention-reason-badge attention-reason-badge-${d.tone}">${d.label}</span>`).join("")}
      </div>
    `}function _($){const d=$.length,h=$.reduce((N,Y)=>N+Y.vehicles.length,0),D=$.reduce((N,Y)=>N+Y.lineAlerts.length,0),w=$.filter(N=>N.lineAlerts.length>0).length,M=new Set($.flatMap(N=>N.lineAlerts.flatMap(Y=>Y.stopIds??[]))).size,I=$.flatMap(N=>N.vehicles),E=g(I),R=$.map(N=>{const{nbGaps:Y,sbGaps:Ne}=n(N.nb,N.sb),ke=[...Y,...Ne].length?Math.max(...Y,...Ne):0,be=N.vehicles.filter(he=>Number(he.scheduleDeviation??0)>300).length,ot=Math.abs(N.nb.length-N.sb.length),pa=a(Y,N.nb.length).health,ga=a(Ne,N.sb.length).health,ma=[pa,ga].some(he=>he==="uneven"||he==="bunched"||he==="sparse"),ha=be>0,fa=N.lineAlerts.length*5+be*3+Math.max(0,ke-10),va=c({worstGap:ke,severeLateCount:be,alertCount:N.lineAlerts.length,balanceDelta:ot,language:t.language});return{line:N.line,score:fa,worstGap:ke,severeLateCount:be,alertCount:N.lineAlerts.length,balanceDelta:ot,hasSevereLate:ha,isUneven:ma,attentionReasons:va}}).sort((N,Y)=>Y.score-N.score||Y.worstGap-N.worstGap),U=new Set(R.filter(N=>N.hasSevereLate).map(N=>N.line.id)),j=new Set(R.filter(N=>N.isUneven).map(N=>N.line.id)),J=R.filter(N=>N.hasSevereLate&&!N.isUneven).length,ee=R.filter(N=>N.isUneven&&!N.hasSevereLate).length,oe=R.filter(N=>N.hasSevereLate&&N.isUneven).length,rt=new Set([...U,...j]).size,ca=Math.max(0,d-rt),da=h?Math.round(E.onTime/h*100):null,ua=R.filter(N=>N.score>0).slice(0,2);let $e={tone:"healthy",copy:t.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const V=R[0]??null;return V?.alertCount?$e={tone:"info",copy:t.language==="zh-CN"?`${V.line.name} 当前有 ${V.alertCount} 条生效告警。`:`${V.line.name} has ${V.alertCount} active alert${V.alertCount===1?"":"s"}.`}:V?.worstGap>=12?$e={tone:"alert",copy:t.language==="zh-CN"?`当前最大实时间隔为空 ${V.line.name} 的 ${V.worstGap} 分钟。`:`Largest live gap: ${V.worstGap} min on ${V.line.name}.`}:V?.severeLateCount&&($e={tone:"warn",copy:t.language==="zh-CN"?`${V.line.name} 有 ${V.severeLateCount} 辆${V.severeLateCount===1?m().toLowerCase():S().toLowerCase()}晚点超过 5 分钟。`:`${V.line.name} has ${V.severeLateCount} ${V.severeLateCount===1?m().toLowerCase():S().toLowerCase()} running 5+ min late.`}),{totalLines:d,totalVehicles:h,totalAlerts:D,impactedLines:w,impactedStopCount:M,delayedLineIds:U,unevenLineIds:j,lateOnlyLineCount:J,unevenOnlyLineCount:ee,mixedIssueLineCount:oe,attentionLineCount:rt,healthyLineCount:ca,onTimeRate:da,rankedLines:R,priorityLines:ua,topIssue:$e}}function H($,d,{suffix:h="",invert:D=!1}={}){if($==null||d==null||$===d)return t.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const w=$-d,M=D?w<0:w>0,I=w>0?"↑":"↓";return t.language==="zh-CN"?`${M?"改善":"变差"} ${I} ${Math.abs(w)}${h}`:`${M?"Improving":"Worse"} ${I} ${Math.abs(w)}${h}`}function k($){const d=_($),h=t.systemSnapshots.get(t.activeSystemId)?.previous??null,D=[];d.totalAlerts>0&&D.push({tone:"info",copy:t.language==="zh-CN"?`${d.impactedLines} 条线路共受 ${d.totalAlerts} 条告警影响。`:`${d.totalAlerts} active alert${d.totalAlerts===1?"":"s"} across ${d.impactedLines} line${d.impactedLines===1?"":"s"}.`}),d.delayedLineIds.size>0&&D.push({tone:"warn",copy:t.language==="zh-CN"?`${d.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${d.delayedLineIds.size} line${d.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),d.unevenLineIds.size>0&&D.push({tone:"alert",copy:t.language==="zh-CN"?`${d.unevenLineIds.size} 条线路当前发车间隔不均。`:`${d.unevenLineIds.size} line${d.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),D.length||D.push({tone:"healthy",copy:t.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const w=[{label:t.language==="zh-CN"?"准点率":"On-Time Rate",value:d.onTimeRate!=null?`${d.onTimeRate}%`:"—",delta:H(d.onTimeRate,h?.onTimeRate,{suffix:"%"})},{label:t.language==="zh-CN"?"需关注线路":"Attention Lines",value:d.attentionLineCount,delta:H(d.attentionLineCount,h?.attentionLineCount,{invert:!0})}];return`
      <article class="panel-card panel-card-wide system-summary-card">
        <header class="panel-header"><div class="system-summary-header"><div class="line-title"><span class="line-token" style="--line-color:var(--accent-strong);">${u().label[0]}</span><div class="line-title-copy"><h2>${u().label} ${t.language==="zh-CN"?"概览":"Summary"}</h2><p>${t.language==="zh-CN"?`系统内 ${d.totalLines} 条线路 · 更新于 ${s()}`:`${d.totalLines} line${d.totalLines===1?"":"s"} in system · Updated ${s()}`}</p></div></div></div></header>
        <div class="system-summary-hero"><div class="insight-exception insight-exception-${d.topIssue.tone}"><p>${d.topIssue.copy}</p></div><div class="system-trend-strip">${w.map(M=>`<div class="metric-chip system-trend-chip"><p class="metric-chip-label">${M.label}</p><p class="metric-chip-value">${M.value}</p><p class="system-trend-copy">${M.delta}</p></div>`).join("")}</div></div>
        <div class="metric-strip system-summary-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"健康线路":"Healthy Lines"}</p><p class="metric-chip-value">${d.healthyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?`实时${S()}`:`Live ${S()}`}</p><p class="metric-chip-value">${d.totalVehicles}</p></div><div class="metric-chip ${d.totalAlerts?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"告警":"Alerts"}</p><p class="metric-chip-value">${d.totalAlerts}</p></div><div class="metric-chip ${d.attentionLineCount?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"需关注线路":"Lines Needing Attention"}</p><p class="metric-chip-value">${d.attentionLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"影响站点":"Impacted Stops"}</p><p class="metric-chip-value">${d.impactedStopCount}</p></div></div>
        <div class="system-composition"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"需关注线路构成":"Attention Breakdown"}</p><p class="headway-chart-copy">${t.language==="zh-CN"?"按晚点与间隔异常拆解":"Split by lateness and spacing issues"}</p></div><div class="attention-breakdown-grid"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅晚点":"Late Only"}</p><p class="metric-chip-value">${d.lateOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅间隔不均":"Spacing Only"}</p><p class="metric-chip-value">${d.unevenOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"两者都有":"Both"}</p><p class="metric-chip-value">${d.mixedIssueLineCount}</p></div></div></div>
        <div class="system-priority"><div class="insight-exceptions-header">${t.language==="zh-CN"?"":'<p class="headway-chart-title">Recommended Next</p>'}<p class="headway-chart-copy">${t.language==="zh-CN"?"基于当前快照的综合优先级":"Best next checks from the current snapshot"}</p></div><div class="system-priority-list">${(d.priorityLines.length?d.priorityLines:d.rankedLines.slice(0,1)).map(({line:M,worstGap:I,severeLateCount:E,alertCount:R,attentionReasons:U})=>`<div class="system-priority-item"><div class="line-title"><span class="line-token" style="--line-color:${M.color};">${M.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${M.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`${I?`最大间隔 ${I} 分钟`:"当前无明显间隔问题"}${E?` · ${E} 辆严重晚点`:""}${R?` · ${R} 条告警`:""}`:`${I?`Gap ${I} min`:"No major spacing issue"}${E?` · ${E} severe late`:""}${R?` · ${R} alert${R===1?"":"s"}`:""}`}</p>${W(U)}</div></div></div>`).join("")}</div></div>
        <div class="system-ranking"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"关注排名":"Attention Ranking"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div><div class="system-ranking-list">${d.rankedLines.slice(0,3).map(({line:M,score:I,worstGap:E,alertCount:R,severeLateCount:U,attentionReasons:j})=>`<div class="system-ranking-item"><div class="line-title"><span class="line-token" style="--line-color:${M.color};">${M.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${M.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`评分 ${I}${E?` · 最大间隔 ${E} 分钟`:""}${R?` · ${R} 条告警`:""}${U?` · ${U} 辆严重晚点`:""}`:`Score ${I}${E?` · gap ${E} min`:""}${R?` · ${R} alert${R===1?"":"s"}`:""}${U?` · ${U} severe late`:""}`}</p>${W(j)}</div></div></div>`).join("")}</div></div>
        <div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"系统状态":"System Status"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div>${D.map(M=>`<div class="insight-exception insight-exception-${M.tone}"><p>${M.copy}</p></div>`).join("")}</div>
      </article>
    `}function T($){const d=$.flatMap(I=>I.exceptions.map(E=>({tone:E.tone,copy:`${I.line.name}: ${E.copy}`,lineColor:I.line.color})));if(!d.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport"><span class="insights-ticker-item insights-ticker-item-healthy">${t.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span></div></section>
    `;const h=v(),D=Math.ceil(d.length/h),w=t.insightsTickerIndex%D,M=d.slice(w*h,w*h+h);return`
      <section class="insights-ticker" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport">${M.map(I=>`<span class="insights-ticker-item insights-ticker-item-${I.tone} insights-ticker-item-animated"><span class="insights-ticker-dot" style="--line-color:${I.lineColor};"></span><span class="insights-ticker-copy">${I.copy}</span></span>`).join("")}</div></section>
    `}function x($,d,h,D,w){const M=h.length+D.length;if(!M)return"";const{nbGaps:I,sbGaps:E}=n(h,D),R=g([...h,...D]),U=[...I,...E].length?Math.max(...I,...E):null,j=B(h,D),J=F($,h,D,w),ee=new Set(w.flatMap(oe=>oe.stopIds??[])).size;return`
      <div class="line-insights"><div class="metric-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"运营中":"In Service"}</p><p class="metric-chip-value">${M}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"准点率":"On-Time Rate"}</p><p class="metric-chip-value">${l(R.onTime,M)}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"最大间隔":"Worst Gap"}</p><p class="metric-chip-value">${U!=null?`${U} min`:"—"}</p></div><div class="metric-chip metric-chip-${j.tone}"><p class="metric-chip-label">${t.language==="zh-CN"?"方向平衡":"Balance"}</p><p class="metric-chip-value">${j.label}</p></div></div><div class="headway-health-grid">${y(o("▲",d,{includeSymbol:!0}),I,h.length)}${y(o("▼",d,{includeSymbol:!0}),E,D.length)}</div>${O(R,M)}<div class="flow-grid">${P(t.language==="zh-CN"?`${o("▲",d,{includeSymbol:!0})} 流向`:`${o("▲",d,{includeSymbol:!0})} flow`,h,d,$.color)}${P(t.language==="zh-CN"?`${o("▼",d,{includeSymbol:!0})} 流向`:`${o("▼",d,{includeSymbol:!0})} flow`,D,d,$.color)}</div><div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"当前":"Now"}</p><p class="headway-chart-copy">${w.length?t.language==="zh-CN"?`${w.length} 条生效告警${ee?` · 影响 ${ee} 个站点`:""}`:`${w.length} active alert${w.length===1?"":"s"}${ee?` · ${ee} impacted stops`:""}`:t.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p></div>${J.map(oe=>`<div class="insight-exception insight-exception-${oe.tone}"><p>${oe.copy}</p></div>`).join("")}</div></div>
    `}function q($){const d=G(t.lines),h=m(),D=G($);return`
      ${T(D)}
      ${k(d)}
      ${D.map(({line:w,layout:M,vehicles:I,nb:E,sb:R,lineAlerts:U})=>{const j=x(w,M,E,R,U);return`
          <article class="panel-card panel-card-wide">
            <header class="panel-header line-card-header"><div class="line-title"><span class="line-token" style="--line-color:${w.color};">${w.name[0]}</span><div class="line-title-copy"><h2>${w.name}</h2><p>${i("liveCount",I.length,I.length===1?m().toLowerCase():S().toLowerCase())} · ${L(w)}</p></div></div>${C(w)}</header>
            ${z(w)}
            ${j||`<p class="train-readout muted">${t.language==="zh-CN"?`等待实时${h.toLowerCase()}数据…`:`Waiting for live ${h.toLowerCase()} data…`}</p>`}
          </article>
        `}).join("")}
    `}return{renderInsightsBoard:q}}function on(){return{dialog:document.querySelector("#station-dialog"),dialogTitle:document.querySelector("#dialog-title"),dialogTitleTrack:document.querySelector("#dialog-title-track"),dialogTitleText:document.querySelector("#dialog-title-text"),dialogTitleTextClone:document.querySelector("#dialog-title-text-clone"),dialogServiceSummary:document.querySelector("#dialog-service-summary"),dialogStatusPillElement:document.querySelector("#dialog-status-pill"),dialogUpdatedAtElement:document.querySelector("#dialog-updated-at"),dialogDisplay:document.querySelector("#dialog-display"),dialogDirectionTabs:[...document.querySelectorAll("[data-dialog-direction]")],arrivalsTitleNb:document.querySelector("#arrivals-title-nb"),arrivalsTitleSb:document.querySelector("#arrivals-title-sb"),stationAlertsContainer:document.querySelector("#station-alerts-container"),transferSection:document.querySelector("#transfer-section"),arrivalsSectionNb:document.querySelector('[data-direction-section="nb"]'),arrivalsNbPinned:document.querySelector("#arrivals-nb-pinned"),arrivalsNb:document.querySelector("#arrivals-nb"),arrivalsSectionSb:document.querySelector('[data-direction-section="sb"]'),arrivalsSbPinned:document.querySelector("#arrivals-sb-pinned"),arrivalsSb:document.querySelector("#arrivals-sb"),trainDialog:document.querySelector("#train-dialog"),trainDialogTitle:document.querySelector("#train-dialog-title"),trainDialogSubtitle:document.querySelector("#train-dialog-subtitle"),trainDialogLine:document.querySelector("#train-dialog-line"),trainDialogStatus:document.querySelector("#train-dialog-status"),trainDialogClose:document.querySelector("#train-dialog-close"),alertDialog:document.querySelector("#alert-dialog"),alertDialogTitle:document.querySelector("#alert-dialog-title"),alertDialogSubtitle:document.querySelector("#alert-dialog-subtitle"),alertDialogLines:document.querySelector("#alert-dialog-lines"),alertDialogBody:document.querySelector("#alert-dialog-body"),alertDialogLink:document.querySelector("#alert-dialog-link"),alertDialogClose:document.querySelector("#alert-dialog-close")}}function ln({state:e,elements:t,copyValue:a,refreshStationDialog:n,clearStationParam:i}){const{dialog:s,dialogTitle:o,dialogTitleTrack:l,dialogTitleText:u,dialogTitleTextClone:f,dialogDisplay:g,dialogDirectionTabs:c,arrivalsSectionNb:v,arrivalsNb:b,arrivalsSectionSb:L,arrivalsSb:m}=t;function S(T){e.dialogDisplayMode=T,s.classList.toggle("is-display-mode",T),g.textContent=a(T?"exit":"board"),g.setAttribute("aria-label",a(T?"exit":"board")),e.dialogDisplayDirection="both",e.dialogDisplayAutoPhase="nb",B(),s.open&&e.currentDialogStation&&n(e.currentDialogStation).catch(console.error),k(),G()}function C(){S(!e.dialogDisplayMode)}function z(){e.dialogDisplayDirectionTimer&&(window.clearInterval(e.dialogDisplayDirectionTimer),e.dialogDisplayDirectionTimer=0)}function A(){e.dialogDisplayDirectionAnimationTimer&&(window.clearTimeout(e.dialogDisplayDirectionAnimationTimer),e.dialogDisplayDirectionAnimationTimer=0),e.dialogDisplayAnimatingDirection="",v?.classList.remove("is-direction-animating"),L?.classList.remove("is-direction-animating")}function y(T){if(!e.dialogDisplayMode||!T||T==="both")return;A(),e.dialogDisplayAnimatingDirection=T;const x=T==="nb"?v:L;x&&(x.offsetWidth,x.classList.add("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=window.setTimeout(()=>{x.classList.remove("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=0,e.dialogDisplayAnimatingDirection===T&&(e.dialogDisplayAnimatingDirection="")},Ma))}function B({animate:T=!1}={}){z(),A();const x=e.dialogDisplayDirection,q=x==="auto"?e.dialogDisplayAutoPhase:x;c.forEach($=>{$.classList.toggle("is-active",$.dataset.dialogDirection===x)}),s.classList.toggle("show-nb-only",e.dialogDisplayMode&&q==="nb"),s.classList.toggle("show-sb-only",e.dialogDisplayMode&&q==="sb"),T&&y(q),e.dialogDisplayMode&&x==="auto"&&(e.dialogDisplayDirectionTimer=window.setInterval(()=>{e.dialogDisplayAutoPhase=e.dialogDisplayAutoPhase==="nb"?"sb":"nb",B({animate:!0})},Ia))}function O(){e.dialogRefreshTimer&&(window.clearTimeout(e.dialogRefreshTimer),e.dialogRefreshTimer=0)}function P(){e.dialogDisplayTimer&&(window.clearInterval(e.dialogDisplayTimer),e.dialogDisplayTimer=0)}function F(T,x){const q=[...T.querySelectorAll(".arrival-item:not(.muted)")];if(T.style.transform="translateY(0)",!e.dialogDisplayMode||q.length<=3)return;const $=Number.parseFloat(window.getComputedStyle(T).rowGap||"0")||0,d=q[0].getBoundingClientRect().height+$,h=Math.max(0,q.length-3),D=Math.min(e.dialogDisplayIndexes[x],h);T.style.transform=`translateY(-${D*d}px)`}function G(){P(),e.dialogDisplayIndexes={nb:0,sb:0},F(b,"nb"),F(m,"sb"),e.dialogDisplayMode&&(e.dialogDisplayTimer=window.setInterval(()=>{for(const[T,x]of[["nb",b],["sb",m]]){const q=[...x.querySelectorAll(".arrival-item:not(.muted)")];if(q.length<=3)continue;const $=Math.max(0,q.length-3);e.dialogDisplayIndexes[T]=e.dialogDisplayIndexes[T]>=$?0:e.dialogDisplayIndexes[T]+1,F(x,T)}},xa))}function W(){if(O(),!e.currentDialogStation)return;const T=()=>{e.dialogRefreshTimer=window.setTimeout(async()=>{!s.open||!e.currentDialogStation||(await n(e.currentDialogStation).catch(console.error),T())},Aa)};T()}function _(){e.currentDialogStationId="",e.currentDialogStation=null,s.open?s.close():(O(),P(),z(),S(!1),i())}function H(T){u.textContent=T,f.textContent=T,k()}function k(){const T=o;if(!T||!l)return;const q=e.dialogDisplayMode&&s.open&&u.scrollWidth>T.clientWidth;T.classList.toggle("is-marquee",q)}return{setDialogDisplayMode:S,toggleDialogDisplayMode:C,stopDialogDirectionRotation:z,stopDialogDirectionAnimation:A,renderDialogDirectionView:B,stopDialogAutoRefresh:O,stopDialogDisplayScroll:P,applyDialogDisplayOffset:F,syncDialogDisplayScroll:G,startDialogAutoRefresh:W,closeStationDialog:_,setDialogTitle:H,syncDialogTitleMarquee:k}}function cn({state:e,elements:t,copyValue:a,formatAlertSeverity:n,formatAlertEffect:i,getAlertsForLine:s,getDirectionBaseLabel:o,getVehicleLabel:l,getVehicleDestinationLabel:u,getTrainTimelineEntries:f,getStatusTone:g,getVehicleStatusPills:c,renderStatusPills:v,formatArrivalTime:b}){const{trainDialog:L,trainDialogTitle:m,trainDialogSubtitle:S,trainDialogLine:C,trainDialogStatus:z,alertDialog:A,alertDialogTitle:y,alertDialogSubtitle:B,alertDialogLines:O,alertDialogBody:P,alertDialogLink:F}=t;function G(){e.currentTrainId="",L.open&&L.close()}function W(){A.open&&A.close()}function _(k){const T=s(k.id);y.textContent=a("affectedLineAlerts",k.name,T.length),B.textContent=a("activeAlerts",T.length),O.textContent=k.name,P.textContent="",P.innerHTML=T.length?T.map(x=>`
              <article class="alert-dialog-item">
                <p class="alert-dialog-item-meta">${n(x.severity)} • ${i(x.effect)}</p>
                <p class="alert-dialog-item-title">${x.title||a("serviceAlert")}</p>
                <p class="alert-dialog-item-copy">${x.description||a("noAdditionalAlertDetails")}</p>
                ${x.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${x.url}" target="_blank" rel="noreferrer">${a("readOfficialAlert")}</a></p>`:""}
              </article>
            `).join(""):`<p class="alert-dialog-item-copy">${a("noActiveAlerts")}</p>`,F.hidden=!0,F.removeAttribute("href"),A.open||A.showModal()}function H(k){const T=k.fromLabel!==k.toLabel&&k.progress>0&&k.progress<1,x=T?k.fromLabel:k.previousLabel,q=T?`${k.fromLabel} -> ${k.toLabel}`:k.currentStopLabel,$=T?"Between":"Now",d=T?k.toLabel:k.upcomingLabel,h=T?k.progress:.5,D=e.layouts.get(k.lineId),w=f(k,D),M=D?u(k,D):k.upcomingLabel,I=w.at(-1)?.etaSeconds??Math.max(0,k.nextOffset??0),E=o(k.directionSymbol);m.textContent=`${k.lineName} ${l()} ${k.label}`,S.textContent=e.language==="zh-CN"?`${E} · ${a("toDestination",M)}`:`${E} to ${M}`,z.className=`train-detail-status train-list-status-${g(k.serviceStatus)}`,z.innerHTML=v(c(k)),L.querySelector(".train-eta-panel")?.remove(),C.innerHTML=`
      <div class="train-detail-spine" style="--line-color:${k.lineColor};"></div>
      <div
        class="train-detail-marker-floating"
        style="--line-color:${k.lineColor}; --segment-progress:${h}; --direction-offset:${k.directionSymbol==="▼"?"10px":"-10px"};"
      >
        <span class="train-detail-vehicle-marker">
          <svg viewBox="-10 -10 20 20" class="train-detail-arrow" aria-hidden="true">
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${k.directionSymbol==="▼"?"rotate(180)":""}"></path>
          </svg>
        </span>
      </div>
      <div class="train-detail-stop">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${a("previous")}</p>
          <p class="train-detail-name">${x}</p>
        </div>
      </div>
      <div class="train-detail-stop is-current">
        <span class="train-detail-marker train-detail-marker-ghost"></span>
        <div>
          <p class="train-detail-label">${$==="Between"?e.language==="zh-CN"?"区间":"Between":a("now")}</p>
          <p class="train-detail-name">${q}</p>
        </div>
      </div>
      <div class="train-detail-stop">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${a("next")}</p>
          <p class="train-detail-name">${d}</p>
        </div>
      </div>
    `,C.insertAdjacentHTML("afterend",`
        <section class="train-eta-panel">
          <div class="train-eta-summary">
            <div class="metric-chip">
              <p class="metric-chip-label">${a("direction")}</p>
              <p class="metric-chip-value">${E}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${a("terminal")}</p>
              <p class="metric-chip-value">${M}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${a("etaToTerminal")}</p>
              <p class="metric-chip-value">${b(I)}</p>
            </div>
          </div>
          <div class="train-eta-timeline">
            <div class="train-eta-header">
              <p class="train-detail-label">${a("upcomingStops")}</p>
              <p class="train-eta-header-copy">${a("liveEtaNow")}</p>
            </div>
            ${w.length?w.map(R=>`
                    <article class="train-eta-stop${R.isNext?" is-next":""}${R.isTerminal?" is-terminal":""}">
                      <div>
                        <p class="train-eta-stop-label">${R.isNext?a("nextStop"):R.isTerminal?a("terminal"):a("upcoming")}</p>
                        <p class="train-eta-stop-name">${R.label}</p>
                      </div>
                      <div class="train-eta-stop-side">
                        <p class="train-eta-stop-countdown">${b(R.etaSeconds)}</p>
                        <p class="train-eta-stop-clock">${R.clockTime}</p>
                      </div>
                    </article>
                  `).join(""):`<p class="train-readout muted">${a("noDownstreamEta")}</p>`}
          </div>
        </section>
      `),L.open||L.showModal()}return{closeTrainDialog:G,closeAlertDialog:W,renderAlertListDialog:_,renderTrainDialog:H}}function dn(e){const t=[...e.stops].sort((c,v)=>v.sequence-c.sequence),a=48,n=44,i=28,s=76,o=106,l=n+i+(t.length-1)*a,u=new Map,f=t.map((c,v)=>{const b={...c,label:Nt(c.name),y:n+v*a,index:v,isTerminal:v===0||v===t.length-1};u.set(c.id,v),u.set(`${e.agencyId}_${c.id}`,v);for(const L of e.stationAliases?.[c.id]??[])u.set(L,v),u.set(`${e.agencyId}_${L}`,v);return b});let g=0;for(let c=0;c<f.length;c+=1)f[c].cumulativeMinutes=g,g+=c<f.length-1?f[c].segmentMinutes:0;return{totalMinutes:g,height:l,labelX:o,stationGap:a,stationIndexByStopId:u,stations:f,trackX:s}}function un(e,t){const a=e.systemsById.has(t)?t:re,n=e.systemsById.get(a);e.activeSystemId=a,e.lines=n?.lines??[],e.layouts=e.layoutsBySystem.get(a)??new Map,e.lines.some(i=>i.id===e.activeLineId)||(e.activeLineId=e.lines[0]?.id??""),e.vehiclesByLine=new Map,e.rawVehicles=[],e.arrivalsCache.clear(),e.alerts=[],e.error="",e.fetchedAt="",e.insightsTickerIndex=0,e.vehicleGhosts=new Map}async function pn({state:e,getSystemIdFromUrl:t}){for(let i=0;i<=4;i+=1){let s=null,o=null;try{s=await fetch(wa,{cache:"no-store"}),o=await s.json()}catch(u){if(i===4)throw u;await pe(1e3*2**i);continue}if(!s.ok){if(i===4)throw new Error(`Static data load failed with ${s.status}`);await pe(1e3*2**i);continue}const l=o.systems??[];e.systemsById=new Map(l.map(u=>[u.id,u])),e.layoutsBySystem=new Map(l.map(u=>[u.id,new Map(u.lines.map(f=>[f.id,dn(f)]))])),un(e,t());return}}function gn({getPreferredLanguage:e,getPreferredTheme:t,handleViewportResize:a,loadStaticData:n,refreshVehicles:i,render:s,refreshLiveMeta:o,refreshArrivalCountdowns:l,refreshVehicleStatusMessages:u,startInsightsTickerRotation:f,startLiveRefreshLoop:g,syncCompactLayoutFromBoard:c,syncDialogFromUrl:v,updateViewportState:b,setLanguage:L,setTheme:m,boardElement:S}){return async function(){L(e()),m(t()),b(),await n(),s(),await i(),await v(),window.addEventListener("popstate",()=>{v().catch(console.error)}),window.addEventListener("resize",a),window.visualViewport?.addEventListener("resize",a),new ResizeObserver(()=>{c()}).observe(S),g(),f(),window.setInterval(()=>{o(),l(),u()},1e3)}}const r={fetchedAt:"",error:"",activeSystemId:re,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayDirectionAnimationTimer:0,dialogDisplayAnimatingDirection:"",dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},mn=Sa({immediate:!0,onNeedRefresh(){mn(!0)}});document.querySelector("#app").innerHTML=`
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
`;const te=document.querySelector("#board"),hn=document.querySelector("#screen-kicker"),fn=document.querySelector("#screen-title"),Re=document.querySelector("#system-bar"),vn=document.querySelector("#view-bar"),qe=[...document.querySelectorAll(".tab-button")],Fe=document.querySelector("#language-toggle"),He=document.querySelector("#theme-toggle"),Te=document.querySelector("#status-pill"),yn=document.querySelector("#current-time"),Ue=document.querySelector("#updated-at"),Ze=on(),{dialog:ie,dialogServiceSummary:Bt,dialogStatusPillElement:ht,dialogUpdatedAtElement:$n,dialogDisplay:Ge,dialogDirectionTabs:bn,arrivalsTitleNb:Pt,arrivalsTitleSb:_t,stationAlertsContainer:Sn,transferSection:ce,arrivalsNbPinned:ft,arrivalsNb:vt,arrivalsSbPinned:yt,arrivalsSb:$t,trainDialog:Ve,trainDialogTitle:wn,trainDialogSubtitle:Ln,trainDialogClose:qt,alertDialog:We,alertDialogTitle:Tn,alertDialogSubtitle:Cn,alertDialogLink:Dn,alertDialogClose:Ft}=Ze;Ge.addEventListener("click",()=>si());qt.addEventListener("click",()=>nt());Ft.addEventListener("click",()=>it());Fe.addEventListener("click",()=>{Kt(r.language==="en"?"zh-CN":"en"),Z()});bn.forEach(e=>{e.addEventListener("click",()=>{r.dialogDisplayDirection=e.dataset.dialogDirection,r.dialogDisplayDirection==="auto"&&(r.dialogDisplayAutoPhase="nb"),je()})});ie.addEventListener("click",e=>{e.target===ie&&Ie()});Ve.addEventListener("click",e=>{e.target===Ve&&nt()});We.addEventListener("click",e=>{e.target===We&&it()});ie.addEventListener("close",()=>{oi(),li(),ri(),ii(!1),r.isSyncingFromUrl||na()});qe.forEach(e=>{e.addEventListener("click",()=>{r.activeTab=e.dataset.tab,Z()})});He.addEventListener("click",()=>{jt(r.theme==="dark"?"light":"dark"),Z()});function fe(){return Ce[r.activeSystemId]??Ce[re]}function An(){return r.systemsById.get(r.activeSystemId)?.agencyId??Ce[re].agencyId}function xn(){return`${Dt}/vehicles-for-agency/${An()}.json?key=${Ye}`}function Q(){return r.language==="zh-CN"?fe().vehicleLabel==="Train"?"列车":"公交":fe().vehicleLabel??"Vehicle"}function ae(){return r.language==="zh-CN"?Q():fe().vehicleLabelPlural??Ea(Q())}function In(){return mt[r.language]??mt.en}function p(e,...t){const a=In()[e];return typeof a=="function"?a(...t):a}const{fetchJsonWithRetry:Ht}=Ka(r),{buildArrivalsForLine:Mn,fetchArrivalsForStopIds:Nn,getArrivalsForStation:kn,mergeArrivalBuckets:En,getArrivalServiceStatus:Ut}=Ja({state:r,fetchJsonWithRetry:Ht,getStationStopIds:(...e)=>Me(...e),copyValue:p,getLanguage:()=>r.language});function Rn(e){return Oa(e,p)}function Gt(){return Ba(r.language)}function ne(e){return Pa(e,r.language,p)}function Se(e){return qa(e,r.language)}function X(e){return Fa(e,r.language)}function Vt(e){return kt(e,r.language)}function zn(e){return Ha(e,r.language)}function On(e){return Ua(e,p)}function Wt(e,t=!1){const a=t&&(e==="▲"||e==="▼")?`${e} `:"";return e==="▲"?`${a}${r.language==="zh-CN"?"北向":"Northbound"}`:e==="▼"?`${a}${r.language==="zh-CN"?"南向":"Southbound"}`:p("active")}function ge(e,t="",{includeSymbol:a=!1}={}){const n=Wt(e,a);return t?r.language==="zh-CN"?`${n} · 开往 ${t}`:`${n} to ${t}`:n}function Je(e,t){if(!t?.stations?.length)return"";const a=e==="▲"?0:e==="▼"?t.stations.length-1:-1;return a<0?"":t.stations[a]?.label??""}function Qe(e,t){const a=Je(e?.directionSymbol,t);return a||e?.upcomingLabel||e?.toLabel||e?.currentStopLabel||""}function Bn(e,t,a={}){return ge(e,Je(e,t),a)}function bt(e){const t=[...new Set(e.map(n=>n?.trim()).filter(Boolean))];if(!t.length)return"";const a=t.slice(0,2);return t.length>2&&a.push(r.language==="zh-CN"?"等":"etc."),a.join(" / ")}function De(e,t=[],a=r.currentDialogStation){const n=t.map(o=>o.destination),i=bt(n);if(i)return i;if(!a)return"";const s=ye(a).map(({line:o})=>r.layouts.get(o.id)).map(o=>Je(e,o));return bt(s)}function Pn(){const e=window.localStorage.getItem(It);return e==="light"||e==="dark"?e:"dark"}function _n(){const e=window.localStorage.getItem(Mt);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function jt(e){r.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(It,e)}function Kt(e){r.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=r.language,window.localStorage.setItem(Mt,r.language)}function Yt(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(t,e,a);r.compactLayout=n<=Ca}function Ae(){const a=window.getComputedStyle(te).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==r.compactLayout&&(r.compactLayout=a,Z())}function qn(){return r.compactLayout?1:3}function et(e){const t=_a(),a=e.serviceSpansByDate?.[t];return a?p("todayServiceSpan",X(a.start),X(a.end)):p("todayServiceUnavailable")}function Xt(e){const t=new Date,a=Le(-1),n=Le(0),i=Le(1),s=e.serviceSpansByDate?.[a],o=e.serviceSpansByDate?.[n],l=e.serviceSpansByDate?.[i],f=[s&&{kind:"yesterday",start:le(a,s.start),end:le(a,s.end),span:s},o&&{kind:"today",start:le(n,o.start),end:le(n,o.end),span:o}].filter(Boolean).find(g=>t>=g.start&&t<=g.end);if(f)return{tone:"active",headline:p("lastTrip",X(f.span.end)),detail:p("endsIn",Se(f.end.getTime()-t.getTime())),compact:p("endsIn",Se(f.end.getTime()-t.getTime()))};if(o){const g=le(n,o.start),c=le(n,o.end);if(t<g)return{tone:"upcoming",headline:p("firstTrip",X(o.start)),detail:p("startsIn",Se(g.getTime()-t.getTime())),compact:p("startsIn",Se(g.getTime()-t.getTime()))};if(t>c)return{tone:"ended",headline:p("serviceEnded",X(o.end)),detail:l?p("nextStart",X(l.start)):p("noNextServiceLoaded"),compact:l?p("nextStart",X(l.start)):p("ended")}}return l?{tone:"upcoming",headline:p("nextFirstTrip",X(l.start)),detail:p("noServiceRemainingToday"),compact:p("nextStart",X(l.start))}:{tone:"muted",headline:p("serviceHoursUnavailable"),detail:p("staticScheduleMissing"),compact:p("unavailable")}}function tt(e){const t=Xt(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function Fn(e){const t=ye(e).map(({line:a})=>{const n=Xt(a);return`${a.name}: ${n.compact}`}).slice(0,3);Bt.textContent=t.join("  ·  ")||p("serviceSummaryUnavailable")}function Hn(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function Un(e){const t=Le(0),a=e.serviceSpansByDate?.[t];if(!a)return null;const n=Pe(a.start)/3600,i=Pe(a.end)/3600,s=Hn(new Date),o=Math.max(24,i,s,1);return{startHours:n,endHours:i,nowHours:s,axisMax:o,startLabel:X(a.start),endLabel:X(a.end)}}function Gn(e){const t=Un(e);if(!t)return"";const a=ue(t.startHours/t.axisMax*100,0,100),n=ue(t.endHours/t.axisMax*100,a,100),i=ue(t.nowHours/t.axisMax*100,0,100),s=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
    <section class="service-timeline-card">
      <div class="service-timeline-header">
        <div>
          <p class="headway-chart-title">${r.language==="zh-CN"?"今日运营时间带":"Today Service Window"}</p>
          <p class="headway-chart-copy">${r.language==="zh-CN"?"首末班与当前时刻":"First trip, last trip, and current time"}</p>
        </div>
        <span class="service-timeline-badge ${s?"is-live":"is-off"}">${s?r.language==="zh-CN"?"运营中":"In service":r.language==="zh-CN"?"未运营":"Off hours"}</span>
      </div>
      <div class="service-timeline-track">
        <div class="service-timeline-band" style="left:${a}%; width:${Math.max(2,n-a)}%;"></div>
        <div class="service-timeline-now" style="left:${i}%;">
          <span class="service-timeline-now-dot"></span>
          <span class="service-timeline-now-label">${r.language==="zh-CN"?"当前":"Now"}</span>
        </div>
      </div>
      <div class="service-timeline-labels">
        <span>${t.startLabel}</span>
        <span>${t.endLabel}</span>
      </div>
    </section>
  `}function me(e){return r.alerts.filter(t=>t.lineIds.includes(e))}function Zt(e,t){const a=me(t.id);if(!a.length)return[];const n=new Set(Me(e,t));return n.add(e.id),a.filter(i=>i.stopIds.length>0&&i.stopIds.some(s=>n.has(s)))}function Vn(e){const t=new Set,a=[];for(const{station:n,line:i}of ye(e))for(const s of Zt(n,i))t.has(s.id)||(t.add(s.id),a.push(s));return a}function Jt(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${p("alertsWord",e.length)}</span>
    </button>
  `:""}function Wn(e){switch(e){case"ARR":return p("arrivingStatus");case"DELAY":return p("delayedStatus");case"OK":return p("enRoute");default:return""}}function K(e){if(!r.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(r.fetchedAt).getTime())/1e3));return e-t}function ve(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function at(e){const t=K(e.nextOffset??0),a=K(e.closestOffset??0),n=e.delayInfo.text;return t<=15?[{text:p("arrivingNow"),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:p("arrivingIn",ne(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:p("nextStopIn",ne(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:[{text:Wn(e.serviceStatus),toneClass:ve(e,t)},{text:n,toneClass:e.delayInfo.colorClass}]}function de(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function Qt(e){const t=K(e.nextOffset??0),a=K(e.closestOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel,[i,s]=at(e);return t<=15?`${e.label} at ${n} ${de([i,s])}`:t<=90?`${e.label} at ${n} ${de([i,s])}`:a<0&&t>0?`${e.label} ${n} ${de([i,s])}`:`${e.label} to ${n} ${de([i,s])}`}function ea(e){return de(at(e))}function ta(e,t){if(!t.length)return"";const a=[...t].sort((i,s)=>K(i.nextOffset??0)-K(s.nextOffset??0)).slice(0,8),n=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${n.map(i=>`
          <span
            class="line-marquee-item ${ve(i,K(i.nextOffset??0))}"
            data-vehicle-marquee="${i.id}"
          >
            <span class="line-marquee-token">${i.lineToken}</span>
            <span class="line-marquee-copy">${Qt(i)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function jn(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const n=a.dataset.vehicleStatus,i=xe().find(o=>o.id===n);if(!i)return;const s=K(i.nextOffset??0);a.innerHTML=ea(i),a.className=`train-list-status ${ve(i,s)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const n=a.dataset.vehicleMarquee,i=xe().find(l=>l.id===n);if(!i)return;const s=K(i.nextOffset??0);a.className=`line-marquee-item ${ve(i,s)}`;const o=a.querySelector(".line-marquee-copy");o&&(o.innerHTML=Qt(i))})}function Kn(){document.querySelectorAll(".arrival-item[data-arrival-time]").forEach(t=>{const a=Number(t.dataset.arrivalTime);if(!Number.isFinite(a))return;const n=t.querySelector(".arrival-countdown"),i=t.querySelector(".arrival-status");if(!n||!i)return;const s=Math.floor((a-Date.now())/1e3),o=Number(t.dataset.scheduleDeviation??0),l=Ut(a,o),u=Xe(l);n.textContent=ne(s),i.textContent=l,i.className=`arrival-status arrival-status-${u}`})}function Yn(e){return e.fromLabel===e.toLabel||e.progress===0?r.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:r.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function aa(e,t){if(!t?.stations?.length)return[];const a=Math.max(0,Math.min(t.stations.length-1,e.currentIndex??0)),n=Math.max(0,Math.min(t.stations.length-1,e.upcomingStopIndex??a)),i=e.directionSymbol==="▲"?-1:e.directionSymbol==="▼"?1:0;if(!i)return[];const s=[];let o=Math.max(0,e.nextOffset??0);for(let l=n;l>=0&&l<t.stations.length;l+=i){const u=t.stations[l];if(!u)break;s.push({label:u.label,etaSeconds:o,clockTime:Vt(Date.now()+o*1e3),isNext:l===n,isTerminal:l===0||l===t.stations.length-1});const f=u.segmentMinutes??0,c=t.stations[l-1]?.segmentMinutes??0;o+=Math.round((i>0?f:c)*60)}return s}function Xn(e){const t=r.layouts.get(e.lineId),a=Math.max(0,aa(e,t).at(-1)?.etaSeconds??e.nextOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${r.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${n}</p>
        <p class="train-focus-metric-copy">${ne(K(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${r.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${Qe(e,t)}</p>
        <p class="train-focus-metric-copy">${ne(K(a))}</p>
      </div>
    </div>
  `}function xe(){return r.lines.flatMap(e=>(r.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function Zn(){return Object.values(Ce).filter(e=>r.systemsById.has(e.id)).map(e=>`
        <button
          class="tab-button ${e.id===r.activeSystemId?"is-active":""}"
          data-system-switch="${e.id}"
          type="button"
        >
          ${e.label}
        </button>
      `).join("")}function ze(){return!r.compactLayout||r.lines.length<2?"":`<section class="line-switcher">${r.lines.map(t=>`
        <button
          class="line-switcher-button ${t.id===r.activeLineId?"is-active":""}"
          data-line-switch="${t.id}"
          type="button"
          style="--line-color:${t.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <span>${t.name}</span>
        </button>
      `).join("")}</section>`}function St(){return r.compactLayout?r.lines.filter(e=>e.id===r.activeLineId):r.lines}function Jn(e,t=!1){const a=Date.now(),n=l=>{const u=l.arrivalTime,f=Math.floor((u-a)/1e3),g=ne(f),c=Ut(l.arrivalTime,l.scheduleDeviation??0),v=Xe(c);let b="";if(l.distanceFromStop>0){const L=l.distanceFromStop>=1e3?`${(l.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(l.distanceFromStop)}m`,m=p("stopAway",l.numberOfStopsAway);b=` • ${L} • ${m}`}return`
      <div class="arrival-item" data-arrival-time="${l.arrivalTime}" data-schedule-deviation="${l.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${l.lineColor};">${l.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${l.lineName} ${Q()} ${l.vehicleId}</span>
            <span class="arrival-destination">${p("toDestination",l.destination)}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${v}">${c}</span>
          <span class="arrival-time">
            <span class="arrival-countdown">${g}</span>
            <span class="arrival-precision">${b}</span>
          </span>
        </span>
      </div>
    `},i=De("▲",e.nb),s=De("▼",e.sb);if(t){ft.innerHTML="",yt.innerHTML="",vt.innerHTML=`<div class="arrival-item muted">${p("loadingArrivals")}</div>`,$t.innerHTML=`<div class="arrival-item muted">${p("loadingArrivals")}</div>`,Lt();return}const o=(l,u,f)=>{if(!l.length){u.innerHTML="",f.innerHTML=`<div class="arrival-item muted">${p("noUpcomingVehicles",ae().toLowerCase())}</div>`;return}const g=r.dialogDisplayMode?l.slice(0,2):[],c=r.dialogDisplayMode?l.slice(2):l;u.innerHTML=g.map(n).join(""),f.innerHTML=c.length?c.map(n).join(""):r.dialogDisplayMode?`<div class="arrival-item muted">${p("noAdditionalVehicles",ae().toLowerCase())}</div>`:""};o(e.nb,ft,vt),o(e.sb,yt,$t),Pt.textContent=ge("▲",i,{includeSymbol:!0}),_t.textContent=ge("▼",s,{includeSymbol:!0}),Lt()}function Me(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const n=new Set;for(const s of a){const o=s.startsWith(`${t.agencyId}_`)?s:`${t.agencyId}_${s}`;n.add(o)}const i=e.id.replace(/-T\d+$/,"");return n.add(i.startsWith(`${t.agencyId}_`)?i:`${t.agencyId}_${i}`),[...n]}function ye(e){const t=r.lines.map(a=>{const n=a.stops.find(i=>i.id===e.id);return n?{line:a,station:n}:null}).filter(Boolean);return t.length>0?t:r.lines.map(a=>{const n=a.stops.find(i=>i.name===e.name);return n?{line:a,station:n}:null}).filter(Boolean)}function Qn(e){if(!e)return null;const t=e.trim().toLowerCase();for(const a of r.lines)for(const n of a.stops){const i=new Set([n.id,`${a.agencyId}_${n.id}`,n.name,normalizeName(n.name),we(n.name),we(normalizeName(n.name))]);for(const s of a.stationAliases?.[n.id]??[])i.add(s),i.add(`${a.agencyId}_${s}`),i.add(we(s));if([...i].some(s=>String(s).toLowerCase()===t))return n}return null}function ei(e){const t=new URL(window.location.href);t.searchParams.set("station",we(e.name)),window.history.pushState({},"",t)}function na(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function wt(e){const t=new URL(window.location.href);e===re?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function ti(){const t=new URL(window.location.href).searchParams.get("system");return t&&r.systemsById.has(t)?t:re}async function ai(){const e=new URL(window.location.href),t=e.searchParams.get("system");t&&r.systemsById.has(t)&&t!==r.activeSystemId&&await la(t,{updateUrl:!1,preserveDialog:!1});const a=e.searchParams.get("station");if(!a){Ie();return}const n=Qn(a);if(!n){Ie();return}r.currentDialogStationId===n.id&&ie.open||await ra(n,{updateUrl:!1})}const ni=ln({state:r,elements:Ze,copyValue:p,refreshStationDialog:e=>sa(e),clearStationParam:na}),{setDialogDisplayMode:ii,toggleDialogDisplayMode:si,stopDialogDirectionRotation:ri,renderDialogDirectionView:je,stopDialogAutoRefresh:oi,stopDialogDisplayScroll:li,syncDialogDisplayScroll:Lt,startDialogAutoRefresh:ci,closeStationDialog:Ie,setDialogTitle:ia,syncDialogTitleMarquee:Ke}=ni;function di(e){return Math.max(1,Math.round(e/Na*60))}function ui(e,t){const a=Date.now(),n=new Set;for(const i of t){const s=`${e}:${i.id}`;n.add(s);const l=[...(r.vehicleGhosts.get(s)??[]).filter(u=>a-u.timestamp<=gt),{y:i.y,minutePosition:i.minutePosition,timestamp:a}].slice(-6);r.vehicleGhosts.set(s,l)}for(const[i,s]of r.vehicleGhosts.entries()){if(!i.startsWith(`${e}:`))continue;const o=s.filter(l=>a-l.timestamp<=gt);if(!n.has(i)||o.length===0){r.vehicleGhosts.delete(i);continue}o.length!==s.length&&r.vehicleGhosts.set(i,o)}}function pi(e,t){return(r.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}function gi(e,t){if(!e||!t.length)return"";const a=Math.max(...t.map(i=>i.distanceKm),At/2),n=82;return`
    <div class="transfer-radar">
      <svg viewBox="0 0 164 164" class="transfer-radar-svg" aria-hidden="true">
        <circle cx="${n}" cy="${n}" r="64" class="transfer-radar-ring"></circle>
        <circle cx="${n}" cy="${n}" r="44" class="transfer-radar-ring"></circle>
        <circle cx="${n}" cy="${n}" r="24" class="transfer-radar-ring"></circle>
        <circle cx="${n}" cy="${n}" r="8" class="transfer-radar-core"></circle>
        ${t.map(i=>{const s=za(e,i.stop),o=22+i.distanceKm/a*44,l=n+Math.sin(s*Math.PI/180)*o,u=n-Math.cos(s*Math.PI/180)*o;return`
              <g>
                <line x1="${n}" y1="${n}" x2="${l.toFixed(1)}" y2="${u.toFixed(1)}" class="transfer-radar-spoke"></line>
                <circle cx="${l.toFixed(1)}" cy="${u.toFixed(1)}" r="7" class="transfer-radar-stop" style="--line-color:${i.line.color};"></circle>
              </g>
            `}).join("")}
      </svg>
      <div class="transfer-radar-copy">
        <p class="headway-chart-title">${r.language==="zh-CN"?"换乘雷达":"Transfer Radar"}</p>
        <p class="headway-chart-copy">${r.language==="zh-CN"?"中心为当前站，越远表示步行越久":"Center is this station; farther dots mean longer walks"}</p>
      </div>
    </div>
  `}function mi(e){if(!e)return[];const t=ye(e),a=new Set(t.map(({line:i,station:s})=>`${i.agencyId}:${i.id}:${s.id}`)),n=new Map;for(const i of r.systemsById.values())for(const s of i.lines??[])for(const o of s.stops??[]){if(a.has(`${s.agencyId}:${s.id}:${o.id}`))continue;const l=Ra(e.lat,e.lon,o.lat,o.lon);if(l>At)continue;const u=`${i.id}:${s.id}`,f=n.get(u);(!f||l<f.distanceKm)&&n.set(u,{systemId:i.id,systemName:i.name,line:s,stop:o,distanceKm:l,walkMinutes:di(l)})}return[...n.values()].sort((i,s)=>i.distanceKm-s.distanceKm||i.line.name.localeCompare(s.line.name)).slice(0,xt*2)}function Oe(e,t=!1,a=r.currentDialogStation){if(t){ce.hidden=!1,ce.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">${p("transfers")}</h4>
          <p class="transfer-panel-copy">${p("checkingNearbyConnections")}</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">${p("loadingTransferRecommendations")}</div>
        </div>
      </div>
    `;return}if(!e.length){ce.hidden=!0,ce.innerHTML="";return}ce.hidden=!1,ce.innerHTML=`
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <h4 class="arrivals-title">${p("transfers")}</h4>
        <p class="transfer-panel-copy">${p("closestBoardableConnections")}</p>
      </div>
      ${gi(a,e)}
      <div class="transfer-list">
        ${e.map(n=>`
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${n.line.color};">${n.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${n.line.name} <span class="transfer-system-chip">${n.systemName}</span></p>
                    <p class="transfer-card-stop">${p("walkToStop",n.walkMinutes,n.stop.name)}</p>
                    <p class="transfer-card-meta">${On(n.distanceKm)}${n.arrival?` • ${p("toDestination",n.arrival.destination)}`:""}</p>
                  </div>
                </div>
                <div class="transfer-card-side">
                  <span class="transfer-card-badge transfer-card-badge-${n.tone}">${n.badge}</span>
                  <span class="transfer-card-time">${n.timeText}</span>
                </div>
              </article>
            `).join("")}
      </div>
    </div>
  `}function hi(e,t){const a=Date.now(),n=[];for(const i of e){const s=Me(i.stop,i.line),o=Mn(t,i.line,s),l=[...o.nb,...o.sb].sort((v,b)=>v.arrivalTime-b.arrivalTime);if(!l.length)continue;const u=a+i.walkMinutes*6e4+ka,f=l.find(v=>v.arrivalTime>=u)??l[0],g=f.arrivalTime-a-i.walkMinutes*6e4,c=Math.max(0,Math.round(g/6e4));n.push({...i,arrival:f,boardAt:f.arrivalTime,badge:g<=0?p("leaveNow"):c<=1?p("boardInOneMinute"):p("boardInMinutes",c),tone:c<=2?"hot":c<=8?"good":"calm",timeText:Vt(f.arrivalTime)})}return n.sort((i,s)=>i.boardAt-s.boardAt||i.distanceKm-s.distanceKm).slice(0,xt)}function fi(e){return e.map(t=>{const a=r.layouts.get(t.id),n=r.vehiclesByLine.get(t.id)??[],i=n.filter(l=>l.directionSymbol==="▲"),s=n.filter(l=>l.directionSymbol==="▼"),o=me(t.id);return{line:t,layout:a,vehicles:n,nb:i,sb:s,lineAlerts:o}})}function vi(e){const t=e.length,a=e.reduce((y,B)=>y+B.vehicles.length,0),n=e.reduce((y,B)=>y+B.lineAlerts.length,0),i=e.filter(y=>y.lineAlerts.length>0).length,s=new Set(e.flatMap(y=>y.lineAlerts.flatMap(B=>B.stopIds??[]))).size,o=e.flatMap(y=>y.vehicles),l=Rt(o),u=e.map(y=>{const{nbGaps:B,sbGaps:O}=Et(y.nb,y.sb),P=[...B,...O].length?Math.max(...B,...O):0,F=y.vehicles.filter(q=>Number(q.scheduleDeviation??0)>300).length,G=Math.abs(y.nb.length-y.sb.length),W=_e(B,y.nb.length).health,_=_e(O,y.sb.length).health,H=[W,_].some(q=>q==="uneven"||q==="bunched"||q==="sparse"),k=F>0,T=y.lineAlerts.length*5+F*3+Math.max(0,P-10),x=zt({worstGap:P,severeLateCount:F,alertCount:y.lineAlerts.length,balanceDelta:G,language:r.language});return{line:y.line,score:T,worstGap:P,severeLateCount:F,alertCount:y.lineAlerts.length,balanceDelta:G,hasSevereLate:k,isUneven:H,attentionReasons:x}}).sort((y,B)=>B.score-y.score||B.worstGap-y.worstGap),f=new Set(u.filter(y=>y.hasSevereLate).map(y=>y.line.id)),g=new Set(u.filter(y=>y.isUneven).map(y=>y.line.id)),c=u.filter(y=>y.hasSevereLate&&!y.isUneven).length,v=u.filter(y=>y.isUneven&&!y.hasSevereLate).length,b=u.filter(y=>y.hasSevereLate&&y.isUneven).length,L=new Set([...f,...g]).size,m=Math.max(0,t-L),S=a?Math.round(l.onTime/a*100):null,C=u.filter(y=>y.score>0).slice(0,2);let z={tone:"healthy",copy:r.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const A=u[0]??null;return A?.alertCount?z={tone:"info",copy:r.language==="zh-CN"?`${A.line.name} 当前有 ${A.alertCount} 条生效告警。`:`${A.line.name} has ${A.alertCount} active alert${A.alertCount===1?"":"s"}.`}:A?.worstGap>=12?z={tone:"alert",copy:r.language==="zh-CN"?`当前最大实时间隔为空 ${A.line.name} 的 ${A.worstGap} 分钟。`:`Largest live gap: ${A.worstGap} min on ${A.line.name}.`}:A?.severeLateCount&&(z={tone:"warn",copy:r.language==="zh-CN"?`${A.line.name} 有 ${A.severeLateCount} 辆${A.severeLateCount===1?Q().toLowerCase():ae().toLowerCase()}晚点超过 5 分钟。`:`${A.line.name} has ${A.severeLateCount} ${A.severeLateCount===1?Q().toLowerCase():ae().toLowerCase()} running 5+ min late.`}),{totalLines:t,totalVehicles:a,totalAlerts:n,impactedLines:i,impactedStopCount:s,delayedLineIds:f,unevenLineIds:g,lateOnlyLineCount:c,unevenOnlyLineCount:v,mixedIssueLineCount:b,attentionLineCount:L,healthyLineCount:m,onTimeRate:S,rankedLines:u,priorityLines:C,topIssue:z}}async function sa(e){if(!e)return;r.currentDialogStation=e,r.currentDialogStationId=e.id,ia(e.name),Fn(e);const t=ye(e),a=await Promise.all(t.map(({station:o,line:l})=>kn(o,l)));Jn(En(a));const n=Vn(e);Sn.innerHTML=n.length?n.map(o=>`
        <article class="insight-exception insight-exception-warn">
          <p>${o.title||p("serviceAlert")}</p>
        </article>
      `).join(""):"";const i=mi(e);if(!i.length){Oe([],!1,e),je(),Ke();return}Oe([],!0,e);const s=await Nn(i.flatMap(o=>Me(o.stop,o.line)));Oe(hi(i,s),!1,e),je(),Ke()}async function ra(e,{updateUrl:t=!0}={}){await sa(e),ie.open||ie.showModal(),t&&ei(e),ci()}const{renderLine:yi}=nn({state:r,getAlertsForLine:me,getAlertsForStation:Zt,getTodayServiceSpan:et,getVehicleGhostTrail:pi,getVehicleLabel:Q,getVehicleLabelPlural:ae,copyValue:p,renderInlineAlerts:Jt,renderLineStatusMarquee:ta,renderServiceReminderChip:tt}),{renderTrainList:$i}=sn({state:r,copyValue:p,formatArrivalTime:ne,formatDirectionLabel:ge,formatEtaClockFromNow:zn,formatVehicleLocationSummary:Yn,getAlertsForLine:me,getAllVehicles:xe,getRealtimeOffset:K,getTodayServiceSpan:et,getVehicleDestinationLabel:Qe,getVehicleLabel:Q,getVehicleLabelPlural:ae,getVehicleStatusClass:ve,renderFocusMetrics:Xn,renderInlineAlerts:Jt,renderLineStatusMarquee:ta,renderServiceReminderChip:tt,formatVehicleStatus:ea}),{renderInsightsBoard:bi}=rn({state:r,classifyHeadwayHealth:_e,computeLineHeadways:Et,copyValue:p,formatCurrentTime:Gt,formatLayoutDirectionLabel:Bn,formatPercent:ja,getActiveSystemMeta:fe,getAlertsForLine:me,getDelayBuckets:Rt,getLineAttentionReasons:zt,getInsightsTickerPageSize:qn,getRealtimeOffset:K,getTodayServiceSpan:et,getVehicleLabel:Q,getVehicleLabelPlural:ae,renderServiceReminderChip:tt,renderServiceTimeline:Gn});function Si(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await la(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function Be(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{r.activeLineId=t.dataset.lineSwitch,Z()})})}const wi=cn({state:r,elements:Ze,copyValue:p,formatAlertSeverity:Va,formatAlertEffect:Ga,getAlertsForLine:e=>me(e),getDirectionBaseLabel:Wt,getVehicleLabel:Q,getVehicleDestinationLabel:Qe,getTrainTimelineEntries:aa,getStatusTone:Xe,getVehicleStatusPills:at,renderStatusPills:de,formatArrivalTime:ne}),{closeTrainDialog:nt,closeAlertDialog:it,renderAlertListDialog:Li,renderTrainDialog:Ti}=wi;function Tt(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,n=xe().find(i=>i.id===a);n&&(r.currentTrainId=a,Ti(n))})})}function Ct(){document.querySelectorAll("[data-alert-line-id]").forEach(t=>{t.addEventListener("click",()=>{const a=r.lines.find(n=>n.id===t.dataset.alertLineId);a&&Li(a)})})}function Ci(){r.lines.forEach(e=>{const t=r.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.stopId,o=t.stations.find(l=>l.id===s);o&&ra(o)})})})}function Z(){const e=fe();if(document.documentElement.lang=r.language,Fe.textContent=p("languageToggle"),Fe.setAttribute("aria-label",p("languageToggleAria")),He.textContent=r.theme==="dark"?p("themeLight"):p("themeDark"),He.setAttribute("aria-label",p("themeToggleAria")),hn.textContent=e.kicker,fn.textContent=e.title,Re.setAttribute("aria-label",p("transitSystems")),vn.setAttribute("aria-label",p("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",p("boardDirectionView")),Pt.textContent=ge("▲",De("▲"),{includeSymbol:!0}),_t.textContent=ge("▼",De("▼"),{includeSymbol:!0}),Ge.textContent=r.dialogDisplayMode?p("exit"):p("board"),Ge.setAttribute("aria-label",r.dialogDisplayMode?p("exit"):p("board")),qt.setAttribute("aria-label",p("closeTrainDialog")),Ft.setAttribute("aria-label",p("closeAlertDialog")),ie.open||(ia(p("station")),Bt.textContent=p("serviceSummary")),Ve.open||(wn.textContent=p("train"),Ln.textContent=p("currentMovement")),We.open||(Tn.textContent=p("serviceAlert"),Cn.textContent=p("transitAdvisory")),Dn.textContent=p("readOfficialAlert"),Re.hidden=r.systemsById.size<2,Re.innerHTML=Zn(),oa(),qe.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===r.activeTab)),qe.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=p("tabMap")),t.dataset.tab==="trains"&&(t.textContent=ae()),t.dataset.tab==="insights"&&(t.textContent=p("tabInsights"))}),Si(),r.activeTab==="map"){te.className="board";const t=St();te.innerHTML=`${ze()}${t.map(yi).join("")}`,Be(),Ct(),Ci(),Tt(),queueMicrotask(Ae);return}if(r.activeTab==="trains"){te.className="board",te.innerHTML=`${ze()}${$i()}`,Be(),Ct(),Tt(),queueMicrotask(Ae);return}if(r.activeTab==="insights"){te.className="board";const t=St();te.innerHTML=`${ze()}${bi(t)}`,Be()}}function Di(){window.clearInterval(r.insightsTickerTimer),r.insightsTickerTimer=0}function Ai(){Di(),r.insightsTickerTimer=window.setInterval(()=>{r.insightsTickerIndex+=1,r.activeTab==="insights"&&Z()},5e3)}function oa(){Te.textContent=r.error?p("statusHold"):p("statusSync"),Te.classList.toggle("status-pill-error",!!r.error),yn.textContent=`${p("nowPrefix")} ${Gt()}`,Ue.textContent=r.error?r.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":Rn(r.fetchedAt),ht.textContent=Te.textContent,ht.classList.toggle("status-pill-error",!!r.error),$n.textContent=Ue.textContent}function xi(){window.clearTimeout(r.liveRefreshTimer),r.liveRefreshTimer=0}function Ii(){xi();const e=()=>{r.liveRefreshTimer=window.setTimeout(async()=>{await st(),e()},Da)};e()}function Mi(e){const t=r.systemsById.has(e)?e:re,a=r.systemsById.get(t);r.activeSystemId=t,r.lines=a?.lines??[],r.layouts=r.layoutsBySystem.get(t)??new Map,r.lines.some(n=>n.id===r.activeLineId)||(r.activeLineId=r.lines[0]?.id??""),r.vehiclesByLine=new Map,r.rawVehicles=[],r.arrivalsCache.clear(),r.alerts=[],r.error="",r.fetchedAt="",r.insightsTickerIndex=0,r.vehicleGhosts=new Map}async function la(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!r.systemsById.has(e)||r.activeSystemId===e){t&&wt(r.activeSystemId);return}Mi(e),a||Ie(),nt(),it(),Z(),t&&wt(e),await st()}function Ni(e){const t=[...new Set((e.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=r.lines.filter(n=>t.includes(Ot(n))).map(n=>n.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??p("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function st(){try{const e=await Ht(xn(),"Realtime");r.error="",r.fetchedAt=new Date().toISOString(),r.rawVehicles=e.data.list??[],r.alerts=(e.data.references?.situations??[]).map(Ni).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(i=>[i.id,i]));for(const i of r.lines){const s=r.layouts.get(i.id),o=r.rawVehicles.map(l=>an(l,i,s,t,{language:r.language,copyValue:p})).filter(Boolean);r.vehiclesByLine.set(i.id,o),ui(i.id,o)}const a=vi(fi(r.lines)),n=r.systemSnapshots.get(r.activeSystemId);r.systemSnapshots.set(r.activeSystemId,{previous:n?.current??null,current:a})}catch(e){r.error=p("realtimeOffline"),console.error(e)}Z()}const ki=()=>{const e=r.compactLayout;if(Yt(),Ke(),e!==r.compactLayout){Z();return}Ae()},Ei=gn({getPreferredLanguage:_n,getPreferredTheme:Pn,handleViewportResize:ki,loadStaticData:()=>pn({state:r,getSystemIdFromUrl:ti}),refreshVehicles:st,render:Z,refreshLiveMeta:oa,refreshArrivalCountdowns:Kn,refreshVehicleStatusMessages:jn,startInsightsTickerRotation:Ai,startLiveRefreshLoop:Ii,syncCompactLayoutFromBoard:Ae,syncDialogFromUrl:ai,updateViewportState:Yt,setLanguage:Kt,setTheme:jt,boardElement:te});Ei().catch(e=>{Te.textContent=p("statusFail"),Ue.textContent=e.message});
