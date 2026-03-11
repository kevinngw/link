(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const ga="modulepreload",ha=function(e){return"/link/dev/"+e},ot={},fa=function(t,a,n){let i=Promise.resolve();if(a&&a.length>0){let v=function(m){return Promise.all(m.map(c=>Promise.resolve(c).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};var o=v;document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),p=l?.nonce||l?.getAttribute("nonce");i=v(a.map(m=>{if(m=ha(m),m in ot)return;ot[m]=!0;const c=m.endsWith(".css"),f=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${f}`))return;const b=document.createElement("link");if(b.rel=c?"stylesheet":ga,c||(b.as="script"),b.crossOrigin="",b.href=m,p&&b.setAttribute("nonce",p),document.head.appendChild(b),c)return new Promise((w,g)=>{b.addEventListener("load",w),b.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${m}`)))})}))}function s(l){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=l,window.dispatchEvent(p),!p.defaultPrevented)throw l}return i.then(l=>{for(const p of l||[])p.status==="rejected"&&s(p.reason);return t().catch(s)})};function va(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:i,onRegisteredSW:s,onRegisterError:o}=e;let l,p;const v=async(c=!0)=>{await p};async function m(){if("serviceWorker"in navigator){if(l=await fa(async()=>{const{Workbox:c}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:c}},[]).then(({Workbox:c})=>new c("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(c=>{o?.(c)}),!l)return;l.addEventListener("activated",c=>{(c.isUpdate||c.isExternal)&&window.location.reload()}),l.addEventListener("installed",c=>{c.isUpdate||n?.()}),l.register({immediate:t}).then(c=>{s?s("/link/dev/sw.js",c):i?.(c)}).catch(c=>{o?.(c)})}}return p=m(),v}const ya="./pulse-data.json",Ct="https://api.pugetsound.onebusaway.org/api/where",Ke="TEST".trim()||"TEST",ie=Ke==="TEST",$a=ie?6e4:2e4,lt=3,ct=800,ba=ie?2e4:5e3,dt=ie?12e4:3e4,ut=ie?1200:0,Ee=ie?1:3,Sa=1100,wa=ie?45e3:15e3,La=ie?9e4:3e4,Ta=4e3,Ca=15e3,Da=520,pt=4*6e4,Aa=4.8,Dt=.35,Ia=45e3,At=4,It="link-pulse-theme",xt="link-pulse-language",se="link",Ce={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},mt={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}};function xa(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function Mt(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function we(e){return e.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function de(e,t,a){return Math.max(t,Math.min(e,a))}function ue(e){return new Promise(t=>window.setTimeout(t,e))}function Be(e){const[t="0",a="0",n="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(n)}function Ma(e,t,a,n){const s=(a-e)*Math.PI/180,o=(n-t)*Math.PI/180,l=Math.sin(s/2)**2+Math.cos(e*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(o/2)**2;return 2*6371*Math.asin(Math.sqrt(l))}function Na(e,t){const a=e.lat*Math.PI/180,n=t.lat*Math.PI/180,i=(t.lon-e.lon)*Math.PI/180,s=Math.sin(i)*Math.cos(n),o=Math.cos(a)*Math.sin(n)-Math.sin(a)*Math.cos(n)*Math.cos(i);return(Math.atan2(s,o)*180/Math.PI+360)%360}function ka(e,t){if(!e)return t("waitingSnapshot");const a=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return a<10?t("updatedNow"):a<60?t("updatedSecondsAgo",a):t("updatedMinutesAgo",Math.round(a/60))}function Ea(e){return new Intl.DateTimeFormat(e==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:e!=="zh-CN"}).format(new Date)}function Ra(e,t,a){if(e<=0)return a("arriving");const n=Math.floor(e/60),i=e%60;return t==="zh-CN"?n>0?`${n}分 ${i}秒`:`${i}秒`:n>0?`${n}m ${i}s`:`${i}s`}function za(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function Le(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function oe(e,t){if(!e||!t)return null;const[a,n,i]=e.split("-").map(Number),s=Be(t),o=Math.floor(s/3600),l=Math.floor(s%3600/60),p=s%60;return new Date(a,n-1,i,o,l,p)}function Oa(e,t){const a=Math.max(0,Math.round(e/6e4)),n=Math.floor(a/60),i=a%60;return t==="zh-CN"?n&&i?`${n}小时${i}分钟`:n?`${n}小时`:`${i}分钟`:n&&i?`${n}h ${i}m`:n?`${n}h`:`${i}m`}function Pa(e,t){if(!e)return"";const[a="0",n="0"]=String(e).split(":"),i=Number(a),s=Number(n),o=(i%24+24)%24;if(t==="zh-CN")return`${String(o).padStart(2,"0")}:${String(s).padStart(2,"0")}`;const l=o>=12?"PM":"AM";return`${o%12||12}:${String(s).padStart(2,"0")} ${l}`}function Nt(e,t){return new Date(e).toLocaleTimeString(t==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:t!=="zh-CN"})}function Ba(e,t){return Nt(Date.now()+Math.max(0,e)*1e3,t)}function _a(e,t){return e>=1?t("walkKm",e):t("walkMeters",Math.round(e*1e3))}function qa(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function Fa(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function Ha(e,t){const a=[...e].sort((s,o)=>s.minutePosition-o.minutePosition),n=[...t].sort((s,o)=>s.minutePosition-o.minutePosition),i=s=>s.slice(1).map((o,l)=>Math.round(o.minutePosition-s[l].minutePosition));return{nbGaps:i(a),sbGaps:i(n)}}function Ua(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((i,s)=>i+s,0)/e.length,a=Math.max(...e),n=Math.min(...e);return{avg:Math.round(t),max:a,min:n,spread:a-n,ratio:a/Math.max(n,1)}}function Va(e,t){const a=Ua(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let n="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?n="bunched":a.max>=12||a.spread>=6?n="uneven":a.avg>=18&&(n="sparse"),{health:n,stats:a}}function Wa(e){return e.reduce((t,a)=>{const n=Number(a.scheduleDeviation??0);return n<=60?t.onTime+=1:n<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function ja(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function Ga({worstGap:e,severeLateCount:t,alertCount:a,balanceDelta:n,language:i}){const s=[];return e>=12&&s.push({key:"gap",tone:"alert",label:i==="zh-CN"?"大间隔":"Large gap"}),t>0&&s.push({key:"late",tone:"warn",label:i==="zh-CN"?"严重晚点":"Severe late"}),a>0&&s.push({key:"alert",tone:"info",label:i==="zh-CN"?"有告警":"Alerted"}),n>=2&&s.push({key:"balance",tone:"warn",label:i==="zh-CN"?"方向失衡":"Imbalanced"}),s.length||s.push({key:"healthy",tone:"healthy",label:i==="zh-CN"?"健康":"Healthy"}),s}function Ka(e){function t(){const s=Math.max(0,e.obaRateLimitStreak-1),o=Math.min(dt,ba*2**s),l=Math.round(o*(.15+Math.random()*.2));return Math.min(dt,o+l)}async function a(){const s=e.obaCooldownUntil-Date.now();s>0&&await ue(s)}function n(s){return s?.code===429||/rate limit/i.test(s?.text??"")}async function i(s,o){for(let l=0;l<=lt;l+=1){await a();let p=null,v=null,m=null;try{p=await fetch(s,{cache:"no-store"})}catch(b){m=b}if(p!==null)try{v=await p.json()}catch{v=null}const c=p?.status===429||n(v);if(p?.ok&&!c)return e.obaRateLimitStreak=0,e.obaCooldownUntil=0,v;const f=m!=null||p!=null&&(p.status===429||p.status>=500&&p.status<600);if(l===lt||!f)throw m||(v?.text?new Error(v.text):new Error(`${o} request failed with ${p?.status??"network error"}`));if(c){e.obaRateLimitStreak+=1;const b=ct*2**l,w=Math.max(b,t());e.obaCooldownUntil=Date.now()+w,await ue(w)}else{const b=ct*2**l;await ue(b)}}throw new Error(`${o} request failed`)}return{fetchJsonWithRetry:i,isRateLimitedPayload:n,waitForObaCooldown:a}}function Ya(e,t){const a=t.directionLookup?.[e.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const n=e.tripHeadsign??"",i=n.toLowerCase();return t.nbTerminusPrefix&&i.startsWith(t.nbTerminusPrefix)?"nb":t.sbTerminusPrefix&&i.startsWith(t.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function kt(e){return e.routeKey??`${e.agencyId}_${e.id}`}function Xa(e,t){const a=e.tripHeadsign?.trim();return a?Mt(a.replace(/^to\s+/i,"")):t("terminalFallback")}function Za(e,t,a){return Math.floor((e-Date.now())/1e3)<=90?"ARR":t>=120?"DELAY":a==="zh-CN"?"准点":"ON TIME"}function Ye(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}function Ja({state:e,fetchJsonWithRetry:t,getStationStopIds:a,copyValue:n,getLanguage:i}){async function s(m){const c=`${Ct}/arrivals-and-departures-for-stop/${m}.json?key=${Ke}&minutesAfter=120`,f=await t(c,"Arrivals");if(f.code!==200)throw new Error(f.text||`Arrivals request failed for ${m}`);return f.data?.entry?.arrivalsAndDepartures??[]}async function o(m){const c=[...new Set(m)],f=[],b=[];for(let w=0;w<c.length;w+=Ee){const g=c.slice(w,w+Ee),S=await Promise.allSettled(g.map(C=>s(C)));f.push(...S),ut>0&&w+Ee<c.length&&await ue(ut)}for(const w of f)w.status==="fulfilled"&&b.push(...w.value);return b}function l(m,c,f=null){const b=Date.now(),w=new Set,g={nb:[],sb:[]},S=f?new Set(f):null;for(const C of m){if(C.routeId!==kt(c)||S&&!S.has(C.stopId))continue;const E=C.predictedArrivalTime||C.scheduledArrivalTime;if(!E||E<=b)continue;const z=Ya(C,c);if(!z)continue;const H=`${C.tripId}:${C.stopId}:${E}`;w.has(H)||(w.add(H),g[z].push({vehicleId:(C.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:E,destination:Xa(C,n),scheduleDeviation:C.scheduleDeviation??0,tripId:C.tripId,lineColor:c.color,lineName:c.name,lineToken:c.name[0],distanceFromStop:C.distanceFromStop??0,numberOfStopsAway:C.numberOfStopsAway??0}))}return g.nb.sort((C,E)=>C.arrivalTime-E.arrivalTime),g.sb.sort((C,E)=>C.arrivalTime-E.arrivalTime),g.nb=g.nb.slice(0,4),g.sb=g.sb.slice(0,4),g}async function p(m,c,f=null){const b=`${e.activeSystemId}:${c.id}:${m.id}`,w=e.arrivalsCache.get(b);if(w&&Date.now()-w.fetchedAt<$a)return w.value;const g=a(m,c),S=f??await o(g),C=l(S,c,g);return e.arrivalsCache.set(b,{fetchedAt:Date.now(),value:C}),C}function v(m){const c={nb:[],sb:[]};for(const f of m)c.nb.push(...f.nb),c.sb.push(...f.sb);return c.nb.sort((f,b)=>f.arrivalTime-b.arrivalTime),c.sb.sort((f,b)=>f.arrivalTime-b.arrivalTime),c}return{buildArrivalsForLine:l,fetchArrivalsForStop:s,fetchArrivalsForStopIds:o,getArrivalsForStation:p,mergeArrivalBuckets:v,getArrivalServiceStatus:(m,c)=>Za(m,c,i())}}function Qa(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function en(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase(),n=t.nextStopTimeOffset??0,i=t.scheduleDeviation??0,s=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||s&&Math.abs(n)<=90?"ARR":i>=120?"DELAY":"OK"}function tn(e,t,{language:a,copyValue:n}){if(!t)return{text:n("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:n("onTime"),colorClass:"status-ontime"};if(e>60){const i=Math.round(e/60);let s="status-late-minor";return e>600?s="status-late-severe":e>300&&(s="status-late-moderate"),{text:a==="zh-CN"?`晚点 ${i} 分钟`:`+${i} min late`,colorClass:s}}if(e<-60){const i=Math.round(Math.abs(e)/60);return{text:a==="zh-CN"?`早到 ${i} 分钟`:`${i} min early`,colorClass:"status-early"}}return{text:n("unknown"),colorClass:"status-muted"}}function an(e,t,a,n,{language:i,copyValue:s}){const o=e.tripStatus?.activeTripId??e.tripId??"",l=n.get(o);if(!l||l.routeId!==t.routeKey)return null;const p=e.tripStatus?.closestStop,v=e.tripStatus?.nextStop,m=a.stationIndexByStopId.get(p),c=a.stationIndexByStopId.get(v);if(m==null&&c==null)return null;let f=m??c,b=c??m;if(f>b){const y=f;f=b,b=y}const w=a.stations[f],g=a.stations[b],S=e.tripStatus?.closestStopTimeOffset??0,C=e.tripStatus?.nextStopTimeOffset??0,E=l.directionId==="1"?"▲":l.directionId==="0"?"▼":Qa(m,c);let z=0;f!==b&&S<0&&C>0&&(z=de(Math.abs(S)/(Math.abs(S)+C),0,1));const H=w.y+(g.y-w.y)*z,V=f!==b?w.segmentMinutes:0,R=w.cumulativeMinutes+V*z,O=m??c??f,_=a.stations[O]??w,W=E==="▲",G=de(O+(W?1:-1),0,a.stations.length-1),P=m!=null&&c!=null&&m!==c?c:de(O+(W?-1:1),0,a.stations.length-1),U=a.stations[G]??_,M=a.stations[P]??g,L=e.tripStatus?.scheduleDeviation??0,D=e.tripStatus?.predicted??!1,B=tn(L,D,{language:i,copyValue:s});return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:E,fromLabel:w.label,minutePosition:R,progress:z,serviceStatus:en(e),toLabel:g.label,y:H,currentLabel:w.label,nextLabel:g.label,previousLabel:U.label,currentStopLabel:_.label,upcomingLabel:M.label,currentIndex:O,upcomingStopIndex:P,status:e.tripStatus?.status??"",closestStop:p,nextStop:v,closestOffset:S,nextOffset:C,scheduleDeviation:L,isPredicted:D,delayInfo:B,rawVehicle:e}}function nn(e){const{state:t,getAlertsForLine:a,getAlertsForStation:n,getTodayServiceSpan:i,getVehicleGhostTrail:s,getVehicleLabel:o,getVehicleLabelPlural:l,copyValue:p,renderInlineAlerts:v,renderLineStatusMarquee:m,renderServiceReminderChip:c}=e;function f(g){const S=String(g).trim().split(/\s+/).filter(Boolean);if(S.length<=1||g.length<=16)return[g];const C=Math.ceil(S.length/2),E=S.slice(0,C).join(" "),z=S.slice(C).join(" ");return Math.max(E.length,z.length)>g.length-4?[g]:[E,z]}function b(g,S){const C=f(g.label),E=C.length>1?-5:5,z=`station-label${C.length>1?" station-label-multiline":""}`;return`
      <text x="${S.labelX}" y="${E}" class="${z}">
        ${C.map((H,V)=>`<tspan x="${S.labelX}" dy="${V===0?0:15}">${H}</tspan>`).join("")}
      </text>
    `}function w(g){const S=t.layouts.get(g.id),C=t.vehiclesByLine.get(g.id)??[],E=a(g.id),z=S.stations.map((R,O)=>{const _=S.stations[O-1],W=O>0?_.segmentMinutes:"",P=n(R,g).length>0,U=R.isTerminal?15:10;return`
          <g transform="translate(0, ${R.y})" class="station-group${P?" has-alert":""}" data-stop-id="${R.id}" style="cursor: pointer;">
            ${O>0?`<text x="0" y="-14" class="segment-time">${W}</text>
                   <line x1="18" x2="${S.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
            <circle cx="${S.trackX}" cy="0" r="${R.isTerminal?11:5}" class="${R.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${g.color};"></circle>
            ${R.isTerminal?`<text x="${S.trackX}" y="4" text-anchor="middle" class="terminal-mark">${g.name[0]}</text>`:""}
            ${P?`<circle cx="${S.trackX+U}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
            ${b(R,S)}
            <rect x="0" y="-30" width="420" height="60" fill="transparent" class="station-hitbox"></rect>
          </g>
        `}).join(""),H=C.map((R,O)=>{const _=s(g.id,R.id);return`
          <g transform="translate(${S.trackX}, 0)" class="train" data-train-id="${R.id}">
            ${_.map((W,G)=>`
                  <circle
                    cy="${W.y+(O%3-1)*1.5}"
                    r="${Math.max(3,7-G)}"
                    class="train-ghost-dot"
                    style="--line-color:${g.color}; --ghost-opacity:${Math.max(.18,.56-G*.1)};"
                  ></circle>
                `).join("")}
            <g transform="translate(0, ${R.y+(O%3-1)*1.5})">
              <circle r="13" class="train-wave" style="--line-color:${g.color}; animation-delay:${O*.18}s;"></circle>
              <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${R.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${g.color};"></path>
            </g>
          </g>
        `}).join(""),V=o();return`
      <article class="line-card" data-line-id="${g.id}">
        <header class="line-card-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:${g.color};">${g.name[0]}</span>
            <div class="line-title-copy">
              <div class="line-title-row">
                <h2>${g.name}</h2>
                ${v(E,g.id)}
              </div>
              <p>${p("liveCount",C.length,C.length===1?V.toLowerCase():l().toLowerCase())}</p>
              <p>${i(g)}</p>
            </div>
          </div>
          ${c(g)}
        </header>
        ${m(g.color,C.map(R=>({...R,lineToken:g.name[0]})))}
        <svg viewBox="0 0 ${t.compactLayout?320:460} ${S.height}" class="line-diagram" role="img" aria-label="${t.language==="zh-CN"?`${g.name} 实时线路图`:`${g.name} live LED board`}">
          <line x1="${S.trackX}" x2="${S.trackX}" y1="${S.stations[0].y}" y2="${S.stations.at(-1).y}" class="spine" style="--line-color:${g.color};"></line>
          ${z}
          ${H}
        </svg>
      </article>
    `}return{renderLine:w}}function sn(e){const{state:t,copyValue:a,formatArrivalTime:n,formatDirectionLabel:i,formatEtaClockFromNow:s,formatVehicleLocationSummary:o,getAlertsForLine:l,getAllVehicles:p,getRealtimeOffset:v,getTodayServiceSpan:m,getVehicleDestinationLabel:c,getVehicleLabel:f,getVehicleLabelPlural:b,getVehicleStatusClass:w,renderFocusMetrics:g,renderInlineAlerts:S,renderLineStatusMarquee:C,renderServiceReminderChip:E,formatVehicleStatus:z}=e;function H(){const V=p().sort((P,U)=>P.minutePosition-U.minutePosition),R=f(),O=b(),_=O.toLowerCase();return V.length?(t.compactLayout?t.lines.filter(P=>P.id===t.activeLineId):t.lines).map(P=>{const U=V.filter(h=>h.lineId===P.id),M=l(P.id),L=[...U].sort((h,T)=>v(h.nextOffset??0)-v(T.nextOffset??0)),D=L[0]??null,B=L.slice(1),y=h=>`
          <span class="train-direction-badge">
            ${i(h.directionSymbol,c(h,t.layouts.get(h.lineId)),{includeSymbol:!0})}
          </span>
        `,d=h=>`
          <article class="train-list-item train-queue-item" data-train-id="${h.id}">
            <div class="train-list-main">
              <span class="line-token train-list-token" style="--line-color:${h.lineColor};">${h.lineToken}</span>
              <div>
                <div class="train-list-row">
                  <p class="train-list-title">${h.lineName} ${R} ${h.label}</p>
                  ${y(h)}
                </div>
                <p class="train-list-subtitle">${a("toDestination",c(h,t.layouts.get(h.lineId)))}</p>
                <p class="train-list-status ${w(h,v(h.nextOffset??0))}" data-vehicle-status="${h.id}">${z(h)}</p>
              </div>
            </div>
            <div class="train-queue-side">
              <p class="train-queue-time">${n(v(h.nextOffset??0))}</p>
              <p class="train-queue-clock">${s(v(h.nextOffset??0))}</p>
            </div>
          </article>
        `;return`
          <article class="line-card train-line-card">
            <header class="line-card-header train-list-section-header">
              <div class="line-title">
                <span class="line-token" style="--line-color:${P.color};">${P.name[0]}</span>
                <div class="line-title-copy">
                  <div class="line-title-row">
                    <h2>${P.name}</h2>
                    ${S(M,P.id)}
                  </div>
                  <p>${a("inServiceCount",U.length,U.length===1?R.toLowerCase():b().toLowerCase())} · ${m(P)}</p>
                </div>
              </div>
              ${E(P)}
            </header>
            ${C(P.color,U)}
            <div class="line-readout train-columns train-stack-layout">
              ${D?`
                    <article class="train-focus-card train-list-item" data-train-id="${D.id}">
                      <div class="train-focus-header">
                        <div>
                          <p class="train-focus-kicker">${t.language==="zh-CN"?"最近一班":"Next up"}</p>
                          <div class="train-list-row">
                            <p class="train-focus-title">${D.lineName} ${R} ${D.label}</p>
                            ${y(D)}
                          </div>
                        </div>
                        <div class="train-focus-side">
                          <p class="train-focus-time">${n(v(D.nextOffset??0))}</p>
                          <p class="train-focus-clock">${s(v(D.nextOffset??0))}</p>
                        </div>
                      </div>
                      <p class="train-focus-destination">${a("toDestination",c(D,t.layouts.get(D.lineId)))}</p>
                      <p class="train-focus-segment">${o(D)}</p>
                      ${g(D)}
                      <p class="train-list-status ${w(D,v(D.nextOffset??0))}" data-vehicle-status="${D.id}">${z(D)}</p>
                    </article>
                  `:`<p class="train-readout muted">${a("noLiveVehicles",b().toLowerCase())}</p>`}
              ${B.length?`
                    <div class="train-queue-list">
                      <p class="train-queue-heading">${t.language==="zh-CN"?"后续车次":"Following vehicles"}</p>
                      ${B.map(d).join("")}
                    </div>
                  `:""}
            </div>
          </article>
        `}).join(""):`
        <section class="board" style="grid-template-columns: 1fr;">
          <article class="panel-card">
            <h2>${a("activeVehicles",O)}</h2>
            <p>${a("noLiveVehicles",_)}</p>
          </article>
        </section>
      `}return{renderTrainList:H}}function rn(e){const{state:t,classifyHeadwayHealth:a,computeLineHeadways:n,copyValue:i,formatCurrentTime:s,formatLayoutDirectionLabel:o,formatPercent:l,getActiveSystemMeta:p,getAlertsForLine:v,getDelayBuckets:m,getLineAttentionReasons:c,getInsightsTickerPageSize:f,getRealtimeOffset:b,getTodayServiceSpan:w,getVehicleLabel:g,getVehicleLabelPlural:S,renderServiceReminderChip:C,renderServiceTimeline:E}=e;function z(y,d){if(!y.length||d<2)return{averageText:"—",detailText:t.language==="zh-CN"?`${S()}数量不足，无法判断间隔`:`Too few ${S().toLowerCase()} for a spacing read`};const h=Math.round(y.reduce((I,A)=>I+A,0)/y.length),T=Math.min(...y),$=Math.max(...y);return{averageText:`~${h} min`,detailText:t.language==="zh-CN"?`观测间隔 ${T}-${$} 分钟`:`${T}-${$} min observed gap`}}function H(y,d,h){const{averageText:T,detailText:$}=z(d,h);return`
      <div class="headway-health-card">
        <p class="headway-health-label">${y}</p>
        <p class="headway-health-value">${T}</p>
        <p class="headway-health-copy">${$}</p>
      </div>
    `}function V(y,d){return Math.abs(y.length-d.length)<=1?{label:t.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:y.length>d.length?{label:t.language==="zh-CN"?"北向偏多":"Northbound heavier",tone:"warn"}:{label:t.language==="zh-CN"?"南向偏多":"Southbound heavier",tone:"warn"}}function R(y,d){return`
      <div class="delay-distribution">
        ${[[t.language==="zh-CN"?"准点":"On time",y.onTime,"healthy"],[t.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",y.minorLate,"warn"],[t.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",y.severeLate,"alert"]].map(([T,$,I])=>`
          <div class="delay-chip delay-chip-${I}">
            <p class="delay-chip-label">${T}</p>
            <p class="delay-chip-value">${$}</p>
            <p class="delay-chip-copy">${l($,d)}</p>
          </div>
        `).join("")}
      </div>
    `}function O(y,d,h,T){if(!d.length)return`
        <div class="flow-lane">
          <div class="flow-lane-header">
            <p class="flow-lane-title">${y}</p>
            <p class="flow-lane-copy">${i("noLiveVehicles",S().toLowerCase())}</p>
          </div>
        </div>
      `;const $=[...d].sort((A,N)=>A.minutePosition-N.minutePosition),I=$.map(A=>{const N=h.totalMinutes>0?A.minutePosition/h.totalMinutes:0;return Math.max(0,Math.min(100,N*100))});return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${y}</p>
          <p class="flow-lane-copy">${i("liveCount",$.length,$.length===1?g().toLowerCase():S().toLowerCase())}</p>
        </div>
        <div class="flow-track" style="--line-color:${T};">
          ${I.map((A,N)=>`
            <span
              class="flow-vehicle"
              style="left:${A}%; --line-color:${T};"
              title="${$[N].label}"
            ></span>
          `).join("")}
        </div>
      </div>
    `}function _(y,d,h,T){const $=[],I=t.layouts.get(y.id),A=o("▲",I,{includeSymbol:!0}),N=o("▼",I,{includeSymbol:!0}),{stats:k}=a(n(d,[]).nbGaps,d.length),{stats:q}=a(n([],h).sbGaps,h.length),j=[...d,...h].filter(Q=>Number(Q.scheduleDeviation??0)>300),J=Math.abs(d.length-h.length);return k.max!=null&&k.max>=12&&$.push({tone:"alert",copy:t.language==="zh-CN"?`${A} 当前有 ${k.max} 分钟的服务空档。`:`${A} has a ${k.max} min service hole right now.`}),q.max!=null&&q.max>=12&&$.push({tone:"alert",copy:t.language==="zh-CN"?`${N} 当前有 ${q.max} 分钟的服务空档。`:`${N} has a ${q.max} min service hole right now.`}),J>=2&&$.push({tone:"warn",copy:d.length>h.length?t.language==="zh-CN"?`车辆分布向 ${A} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${A} by ${J}.`:t.language==="zh-CN"?`车辆分布向 ${N} 偏多 ${J} 辆。`:`Vehicle distribution is tilted toward ${N} by ${J}.`}),j.length&&$.push({tone:"warn",copy:t.language==="zh-CN"?`${j.length} 辆${j.length===1?g().toLowerCase():S().toLowerCase()}晚点超过 5 分钟。`:`${j.length} ${j.length===1?g().toLowerCase():S().toLowerCase()} are running 5+ min late.`}),T.length&&$.push({tone:"info",copy:t.language==="zh-CN"?`${y.name} 当前受 ${T.length} 条告警影响。`:`${T.length} active alert${T.length===1?"":"s"} affecting ${y.name}.`}),$.length||$.push({tone:"healthy",copy:t.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),$.slice(0,4)}function W(y){return y.map(d=>{const h=t.layouts.get(d.id),T=t.vehiclesByLine.get(d.id)??[],$=T.filter(N=>N.directionSymbol==="▲"),I=T.filter(N=>N.directionSymbol==="▼"),A=v(d.id);return{line:d,layout:h,vehicles:T,nb:$,sb:I,lineAlerts:A,exceptions:_(d,$,I,A)}})}function G(y){return`
      <div class="attention-reason-badges">
        ${y.map(d=>`<span class="attention-reason-badge attention-reason-badge-${d.tone}">${d.label}</span>`).join("")}
      </div>
    `}function P(y){const d=y.length,h=y.reduce((x,Y)=>x+Y.vehicles.length,0),T=y.reduce((x,Y)=>x+Y.lineAlerts.length,0),$=y.filter(x=>x.lineAlerts.length>0).length,I=new Set(y.flatMap(x=>x.lineAlerts.flatMap(Y=>Y.stopIds??[]))).size,A=y.flatMap(x=>x.vehicles),N=m(A),k=y.map(x=>{const{nbGaps:Y,sbGaps:Ne}=n(x.nb,x.sb),ke=[...Y,...Ne].length?Math.max(...Y,...Ne):0,be=x.vehicles.filter(ge=>Number(ge.scheduleDeviation??0)>300).length,rt=Math.abs(x.nb.length-x.sb.length),la=a(Y,x.nb.length).health,ca=a(Ne,x.sb.length).health,da=[la,ca].some(ge=>ge==="uneven"||ge==="bunched"||ge==="sparse"),ua=be>0,pa=x.lineAlerts.length*5+be*3+Math.max(0,ke-10),ma=c({worstGap:ke,severeLateCount:be,alertCount:x.lineAlerts.length,balanceDelta:rt,language:t.language});return{line:x.line,score:pa,worstGap:ke,severeLateCount:be,alertCount:x.lineAlerts.length,balanceDelta:rt,hasSevereLate:ua,isUneven:da,attentionReasons:ma}}).sort((x,Y)=>Y.score-x.score||Y.worstGap-x.worstGap),q=new Set(k.filter(x=>x.hasSevereLate).map(x=>x.line.id)),j=new Set(k.filter(x=>x.isUneven).map(x=>x.line.id)),J=k.filter(x=>x.hasSevereLate&&!x.isUneven).length,Q=k.filter(x=>x.isUneven&&!x.hasSevereLate).length,re=k.filter(x=>x.hasSevereLate&&x.isUneven).length,st=new Set([...q,...j]).size,sa=Math.max(0,d-st),ra=h?Math.round(N.onTime/h*100):null,oa=k.filter(x=>x.score>0).slice(0,2);let $e={tone:"healthy",copy:t.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const F=k[0]??null;return F?.alertCount?$e={tone:"info",copy:t.language==="zh-CN"?`${F.line.name} 当前有 ${F.alertCount} 条生效告警。`:`${F.line.name} has ${F.alertCount} active alert${F.alertCount===1?"":"s"}.`}:F?.worstGap>=12?$e={tone:"alert",copy:t.language==="zh-CN"?`当前最大实时间隔为空 ${F.line.name} 的 ${F.worstGap} 分钟。`:`Largest live gap: ${F.worstGap} min on ${F.line.name}.`}:F?.severeLateCount&&($e={tone:"warn",copy:t.language==="zh-CN"?`${F.line.name} 有 ${F.severeLateCount} 辆${F.severeLateCount===1?g().toLowerCase():S().toLowerCase()}晚点超过 5 分钟。`:`${F.line.name} has ${F.severeLateCount} ${F.severeLateCount===1?g().toLowerCase():S().toLowerCase()} running 5+ min late.`}),{totalLines:d,totalVehicles:h,totalAlerts:T,impactedLines:$,impactedStopCount:I,delayedLineIds:q,unevenLineIds:j,lateOnlyLineCount:J,unevenOnlyLineCount:Q,mixedIssueLineCount:re,attentionLineCount:st,healthyLineCount:sa,onTimeRate:ra,rankedLines:k,priorityLines:oa,topIssue:$e}}function U(y,d,{suffix:h="",invert:T=!1}={}){if(y==null||d==null||y===d)return t.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const $=y-d,I=T?$<0:$>0,A=$>0?"↑":"↓";return t.language==="zh-CN"?`${I?"改善":"变差"} ${A} ${Math.abs($)}${h}`:`${I?"Improving":"Worse"} ${A} ${Math.abs($)}${h}`}function M(y){const d=P(y),h=t.systemSnapshots.get(t.activeSystemId)?.previous??null,T=[];d.totalAlerts>0&&T.push({tone:"info",copy:t.language==="zh-CN"?`${d.impactedLines} 条线路共受 ${d.totalAlerts} 条告警影响。`:`${d.totalAlerts} active alert${d.totalAlerts===1?"":"s"} across ${d.impactedLines} line${d.impactedLines===1?"":"s"}.`}),d.delayedLineIds.size>0&&T.push({tone:"warn",copy:t.language==="zh-CN"?`${d.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${d.delayedLineIds.size} line${d.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),d.unevenLineIds.size>0&&T.push({tone:"alert",copy:t.language==="zh-CN"?`${d.unevenLineIds.size} 条线路当前发车间隔不均。`:`${d.unevenLineIds.size} line${d.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),T.length||T.push({tone:"healthy",copy:t.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const $=[{label:t.language==="zh-CN"?"准点率":"On-Time Rate",value:d.onTimeRate!=null?`${d.onTimeRate}%`:"—",delta:U(d.onTimeRate,h?.onTimeRate,{suffix:"%"})},{label:t.language==="zh-CN"?"需关注线路":"Attention Lines",value:d.attentionLineCount,delta:U(d.attentionLineCount,h?.attentionLineCount,{invert:!0})}];return`
      <article class="panel-card panel-card-wide system-summary-card">
        <header class="panel-header"><div class="system-summary-header"><div class="line-title"><span class="line-token" style="--line-color:var(--accent-strong);">${p().label[0]}</span><div class="line-title-copy"><h2>${p().label} ${t.language==="zh-CN"?"概览":"Summary"}</h2><p>${t.language==="zh-CN"?`系统内 ${d.totalLines} 条线路 · 更新于 ${s()}`:`${d.totalLines} line${d.totalLines===1?"":"s"} in system · Updated ${s()}`}</p></div></div></div></header>
        <div class="system-summary-hero"><div class="insight-exception insight-exception-${d.topIssue.tone}"><p>${d.topIssue.copy}</p></div><div class="system-trend-strip">${$.map(I=>`<div class="metric-chip system-trend-chip"><p class="metric-chip-label">${I.label}</p><p class="metric-chip-value">${I.value}</p><p class="system-trend-copy">${I.delta}</p></div>`).join("")}</div></div>
        <div class="metric-strip system-summary-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"健康线路":"Healthy Lines"}</p><p class="metric-chip-value">${d.healthyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?`实时${S()}`:`Live ${S()}`}</p><p class="metric-chip-value">${d.totalVehicles}</p></div><div class="metric-chip ${d.totalAlerts?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"告警":"Alerts"}</p><p class="metric-chip-value">${d.totalAlerts}</p></div><div class="metric-chip ${d.attentionLineCount?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"需关注线路":"Lines Needing Attention"}</p><p class="metric-chip-value">${d.attentionLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"影响站点":"Impacted Stops"}</p><p class="metric-chip-value">${d.impactedStopCount}</p></div></div>
        <div class="system-composition"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"需关注线路构成":"Attention Breakdown"}</p><p class="headway-chart-copy">${t.language==="zh-CN"?"按晚点与间隔异常拆解":"Split by lateness and spacing issues"}</p></div><div class="attention-breakdown-grid"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅晚点":"Late Only"}</p><p class="metric-chip-value">${d.lateOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅间隔不均":"Spacing Only"}</p><p class="metric-chip-value">${d.unevenOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"两者都有":"Both"}</p><p class="metric-chip-value">${d.mixedIssueLineCount}</p></div></div></div>
        <div class="system-priority"><div class="insight-exceptions-header">${t.language==="zh-CN"?"":'<p class="headway-chart-title">Recommended Next</p>'}<p class="headway-chart-copy">${t.language==="zh-CN"?"基于当前快照的综合优先级":"Best next checks from the current snapshot"}</p></div><div class="system-priority-list">${(d.priorityLines.length?d.priorityLines:d.rankedLines.slice(0,1)).map(({line:I,worstGap:A,severeLateCount:N,alertCount:k,attentionReasons:q})=>`<div class="system-priority-item"><div class="line-title"><span class="line-token" style="--line-color:${I.color};">${I.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${I.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`${A?`最大间隔 ${A} 分钟`:"当前无明显间隔问题"}${N?` · ${N} 辆严重晚点`:""}${k?` · ${k} 条告警`:""}`:`${A?`Gap ${A} min`:"No major spacing issue"}${N?` · ${N} severe late`:""}${k?` · ${k} alert${k===1?"":"s"}`:""}`}</p>${G(q)}</div></div></div>`).join("")}</div></div>
        <div class="system-ranking"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"关注排名":"Attention Ranking"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div><div class="system-ranking-list">${d.rankedLines.slice(0,3).map(({line:I,score:A,worstGap:N,alertCount:k,severeLateCount:q,attentionReasons:j})=>`<div class="system-ranking-item"><div class="line-title"><span class="line-token" style="--line-color:${I.color};">${I.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${I.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`评分 ${A}${N?` · 最大间隔 ${N} 分钟`:""}${k?` · ${k} 条告警`:""}${q?` · ${q} 辆严重晚点`:""}`:`Score ${A}${N?` · gap ${N} min`:""}${k?` · ${k} alert${k===1?"":"s"}`:""}${q?` · ${q} severe late`:""}`}</p>${G(j)}</div></div></div>`).join("")}</div></div>
        <div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"系统状态":"System Status"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div>${T.map(I=>`<div class="insight-exception insight-exception-${I.tone}"><p>${I.copy}</p></div>`).join("")}</div>
      </article>
    `}function L(y){const d=y.flatMap(A=>A.exceptions.map(N=>({tone:N.tone,copy:`${A.line.name}: ${N.copy}`,lineColor:A.line.color})));if(!d.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport"><span class="insights-ticker-item insights-ticker-item-healthy">${t.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span></div></section>
    `;const h=f(),T=Math.ceil(d.length/h),$=t.insightsTickerIndex%T,I=d.slice($*h,$*h+h);return`
      <section class="insights-ticker" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport">${I.map(A=>`<span class="insights-ticker-item insights-ticker-item-${A.tone} insights-ticker-item-animated"><span class="insights-ticker-dot" style="--line-color:${A.lineColor};"></span><span class="insights-ticker-copy">${A.copy}</span></span>`).join("")}</div></section>
    `}function D(y,d,h,T,$){const I=h.length+T.length;if(!I)return"";const{nbGaps:A,sbGaps:N}=n(h,T),k=m([...h,...T]),q=[...A,...N].length?Math.max(...A,...N):null,j=V(h,T),J=_(y,h,T,$),Q=new Set($.flatMap(re=>re.stopIds??[])).size;return`
      <div class="line-insights"><div class="metric-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"运营中":"In Service"}</p><p class="metric-chip-value">${I}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"准点率":"On-Time Rate"}</p><p class="metric-chip-value">${l(k.onTime,I)}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"最大间隔":"Worst Gap"}</p><p class="metric-chip-value">${q!=null?`${q} min`:"—"}</p></div><div class="metric-chip metric-chip-${j.tone}"><p class="metric-chip-label">${t.language==="zh-CN"?"方向平衡":"Balance"}</p><p class="metric-chip-value">${j.label}</p></div></div><div class="headway-health-grid">${H(o("▲",d,{includeSymbol:!0}),A,h.length)}${H(o("▼",d,{includeSymbol:!0}),N,T.length)}</div>${R(k,I)}<div class="flow-grid">${O(t.language==="zh-CN"?`${o("▲",d,{includeSymbol:!0})} 流向`:`${o("▲",d,{includeSymbol:!0})} flow`,h,d,y.color)}${O(t.language==="zh-CN"?`${o("▼",d,{includeSymbol:!0})} 流向`:`${o("▼",d,{includeSymbol:!0})} flow`,T,d,y.color)}</div><div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"当前":"Now"}</p><p class="headway-chart-copy">${$.length?t.language==="zh-CN"?`${$.length} 条生效告警${Q?` · 影响 ${Q} 个站点`:""}`:`${$.length} active alert${$.length===1?"":"s"}${Q?` · ${Q} impacted stops`:""}`:t.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p></div>${J.map(re=>`<div class="insight-exception insight-exception-${re.tone}"><p>${re.copy}</p></div>`).join("")}</div></div>
    `}function B(y){const d=W(t.lines),h=g(),T=W(y);return`
      ${L(T)}
      ${M(d)}
      ${T.map(({line:$,layout:I,vehicles:A,nb:N,sb:k,lineAlerts:q})=>{const j=D($,I,N,k,q);return`
          <article class="panel-card panel-card-wide">
            <header class="panel-header line-card-header"><div class="line-title"><span class="line-token" style="--line-color:${$.color};">${$.name[0]}</span><div class="line-title-copy"><h2>${$.name}</h2><p>${i("liveCount",A.length,A.length===1?g().toLowerCase():S().toLowerCase())} · ${w($)}</p></div></div>${C($)}</header>
            ${E($)}
            ${j||`<p class="train-readout muted">${t.language==="zh-CN"?`等待实时${h.toLowerCase()}数据…`:`Waiting for live ${h.toLowerCase()} data…`}</p>`}
          </article>
        `}).join("")}
    `}return{renderInsightsBoard:B}}function on(){return{dialog:document.querySelector("#station-dialog"),dialogTitle:document.querySelector("#dialog-title"),dialogTitleTrack:document.querySelector("#dialog-title-track"),dialogTitleText:document.querySelector("#dialog-title-text"),dialogTitleTextClone:document.querySelector("#dialog-title-text-clone"),dialogServiceSummary:document.querySelector("#dialog-service-summary"),dialogStatusPillElement:document.querySelector("#dialog-status-pill"),dialogUpdatedAtElement:document.querySelector("#dialog-updated-at"),dialogDisplay:document.querySelector("#dialog-display"),dialogDirectionTabs:[...document.querySelectorAll("[data-dialog-direction]")],arrivalsTitleNb:document.querySelector("#arrivals-title-nb"),arrivalsTitleSb:document.querySelector("#arrivals-title-sb"),stationAlertsContainer:document.querySelector("#station-alerts-container"),transferSection:document.querySelector("#transfer-section"),arrivalsSectionNb:document.querySelector('[data-direction-section="nb"]'),arrivalsNbPinned:document.querySelector("#arrivals-nb-pinned"),arrivalsNb:document.querySelector("#arrivals-nb"),arrivalsSectionSb:document.querySelector('[data-direction-section="sb"]'),arrivalsSbPinned:document.querySelector("#arrivals-sb-pinned"),arrivalsSb:document.querySelector("#arrivals-sb"),trainDialog:document.querySelector("#train-dialog"),trainDialogTitle:document.querySelector("#train-dialog-title"),trainDialogSubtitle:document.querySelector("#train-dialog-subtitle"),trainDialogLine:document.querySelector("#train-dialog-line"),trainDialogStatus:document.querySelector("#train-dialog-status"),trainDialogClose:document.querySelector("#train-dialog-close"),alertDialog:document.querySelector("#alert-dialog"),alertDialogTitle:document.querySelector("#alert-dialog-title"),alertDialogSubtitle:document.querySelector("#alert-dialog-subtitle"),alertDialogLines:document.querySelector("#alert-dialog-lines"),alertDialogBody:document.querySelector("#alert-dialog-body"),alertDialogLink:document.querySelector("#alert-dialog-link"),alertDialogClose:document.querySelector("#alert-dialog-close")}}function ln({state:e,elements:t,copyValue:a,refreshStationDialog:n,clearStationParam:i}){const{dialog:s,dialogTitle:o,dialogTitleTrack:l,dialogTitleText:p,dialogTitleTextClone:v,dialogDisplay:m,dialogDirectionTabs:c,arrivalsSectionNb:f,arrivalsNb:b,arrivalsSectionSb:w,arrivalsSb:g}=t;function S(L){e.dialogDisplayMode=L,s.classList.toggle("is-display-mode",L),m.textContent=a(L?"exit":"board"),m.setAttribute("aria-label",a(L?"exit":"board")),e.dialogDisplayDirection="both",e.dialogDisplayAutoPhase="nb",V(),s.open&&e.currentDialogStation&&n(e.currentDialogStation).catch(console.error),M(),W()}function C(){S(!e.dialogDisplayMode)}function E(){e.dialogDisplayDirectionTimer&&(window.clearInterval(e.dialogDisplayDirectionTimer),e.dialogDisplayDirectionTimer=0)}function z(){e.dialogDisplayDirectionAnimationTimer&&(window.clearTimeout(e.dialogDisplayDirectionAnimationTimer),e.dialogDisplayDirectionAnimationTimer=0),e.dialogDisplayAnimatingDirection="",f?.classList.remove("is-direction-animating"),w?.classList.remove("is-direction-animating")}function H(L){if(!e.dialogDisplayMode||!L||L==="both")return;z(),e.dialogDisplayAnimatingDirection=L;const D=L==="nb"?f:w;D&&(D.offsetWidth,D.classList.add("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=window.setTimeout(()=>{D.classList.remove("is-direction-animating"),e.dialogDisplayDirectionAnimationTimer=0,e.dialogDisplayAnimatingDirection===L&&(e.dialogDisplayAnimatingDirection="")},Da))}function V({animate:L=!1}={}){E(),z();const D=e.dialogDisplayDirection,B=D==="auto"?e.dialogDisplayAutoPhase:D;c.forEach(y=>{y.classList.toggle("is-active",y.dataset.dialogDirection===D)}),s.classList.toggle("show-nb-only",e.dialogDisplayMode&&B==="nb"),s.classList.toggle("show-sb-only",e.dialogDisplayMode&&B==="sb"),L&&H(B),e.dialogDisplayMode&&D==="auto"&&(e.dialogDisplayDirectionTimer=window.setInterval(()=>{e.dialogDisplayAutoPhase=e.dialogDisplayAutoPhase==="nb"?"sb":"nb",V({animate:!0})},Ca))}function R(){e.dialogRefreshTimer&&(window.clearTimeout(e.dialogRefreshTimer),e.dialogRefreshTimer=0)}function O(){e.dialogDisplayTimer&&(window.clearInterval(e.dialogDisplayTimer),e.dialogDisplayTimer=0)}function _(L,D){const B=[...L.querySelectorAll(".arrival-item:not(.muted)")];if(L.style.transform="translateY(0)",!e.dialogDisplayMode||B.length<=3)return;const y=Number.parseFloat(window.getComputedStyle(L).rowGap||"0")||0,d=B[0].getBoundingClientRect().height+y,h=Math.max(0,B.length-3),T=Math.min(e.dialogDisplayIndexes[D],h);L.style.transform=`translateY(-${T*d}px)`}function W(){O(),e.dialogDisplayIndexes={nb:0,sb:0},_(b,"nb"),_(g,"sb"),e.dialogDisplayMode&&(e.dialogDisplayTimer=window.setInterval(()=>{for(const[L,D]of[["nb",b],["sb",g]]){const B=[...D.querySelectorAll(".arrival-item:not(.muted)")];if(B.length<=3)continue;const y=Math.max(0,B.length-3);e.dialogDisplayIndexes[L]=e.dialogDisplayIndexes[L]>=y?0:e.dialogDisplayIndexes[L]+1,_(D,L)}},Ta))}function G(){if(R(),!e.currentDialogStation)return;const L=()=>{e.dialogRefreshTimer=window.setTimeout(async()=>{!s.open||!e.currentDialogStation||(await n(e.currentDialogStation).catch(console.error),L())},La)};L()}function P(){e.currentDialogStationId="",e.currentDialogStation=null,s.open?s.close():(R(),O(),E(),S(!1),i())}function U(L){p.textContent=L,v.textContent=L,M()}function M(){const L=o;if(!L||!l)return;const B=e.dialogDisplayMode&&s.open&&p.scrollWidth>L.clientWidth;L.classList.toggle("is-marquee",B)}return{setDialogDisplayMode:S,toggleDialogDisplayMode:C,stopDialogDirectionRotation:E,stopDialogDirectionAnimation:z,renderDialogDirectionView:V,stopDialogAutoRefresh:R,stopDialogDisplayScroll:O,applyDialogDisplayOffset:_,syncDialogDisplayScroll:W,startDialogAutoRefresh:G,closeStationDialog:P,setDialogTitle:U,syncDialogTitleMarquee:M}}function cn({state:e,elements:t,copyValue:a,formatAlertSeverity:n,formatAlertEffect:i,getAlertsForLine:s,getDirectionBaseLabel:o,getVehicleLabel:l,getVehicleDestinationLabel:p,getTrainTimelineEntries:v,getStatusTone:m,getVehicleStatusPills:c,renderStatusPills:f,formatArrivalTime:b}){const{trainDialog:w,trainDialogTitle:g,trainDialogSubtitle:S,trainDialogLine:C,trainDialogStatus:E,alertDialog:z,alertDialogTitle:H,alertDialogSubtitle:V,alertDialogLines:R,alertDialogBody:O,alertDialogLink:_}=t;function W(){e.currentTrainId="",w.open&&w.close()}function G(){z.open&&z.close()}function P(M){const L=s(M.id);H.textContent=a("affectedLineAlerts",M.name,L.length),V.textContent=a("activeAlerts",L.length),R.textContent=M.name,O.textContent="",O.innerHTML=L.length?L.map(D=>`
              <article class="alert-dialog-item">
                <p class="alert-dialog-item-meta">${n(D.severity)} • ${i(D.effect)}</p>
                <p class="alert-dialog-item-title">${D.title||a("serviceAlert")}</p>
                <p class="alert-dialog-item-copy">${D.description||a("noAdditionalAlertDetails")}</p>
                ${D.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${D.url}" target="_blank" rel="noreferrer">${a("readOfficialAlert")}</a></p>`:""}
              </article>
            `).join(""):`<p class="alert-dialog-item-copy">${a("noActiveAlerts")}</p>`,_.hidden=!0,_.removeAttribute("href"),z.open||z.showModal()}function U(M){const L=M.fromLabel!==M.toLabel&&M.progress>0&&M.progress<1,D=L?M.fromLabel:M.previousLabel,B=L?`${M.fromLabel} -> ${M.toLabel}`:M.currentStopLabel,y=L?"Between":"Now",d=L?M.toLabel:M.upcomingLabel,h=L?M.progress:.5,T=e.layouts.get(M.lineId),$=v(M,T),I=T?p(M,T):M.upcomingLabel,A=$.at(-1)?.etaSeconds??Math.max(0,M.nextOffset??0),N=o(M.directionSymbol);g.textContent=`${M.lineName} ${l()} ${M.label}`,S.textContent=e.language==="zh-CN"?`${N} · ${a("toDestination",I)}`:`${N} to ${I}`,E.className=`train-detail-status train-list-status-${m(M.serviceStatus)}`,E.innerHTML=f(c(M)),w.querySelector(".train-eta-panel")?.remove(),C.innerHTML=`
      <div class="train-detail-spine" style="--line-color:${M.lineColor};"></div>
      <div
        class="train-detail-marker-floating"
        style="--line-color:${M.lineColor}; --segment-progress:${h}; --direction-offset:${M.directionSymbol==="▼"?"10px":"-10px"};"
      >
        <span class="train-detail-vehicle-marker">
          <svg viewBox="-10 -10 20 20" class="train-detail-arrow" aria-hidden="true">
            <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${M.directionSymbol==="▼"?"rotate(180)":""}"></path>
          </svg>
        </span>
      </div>
      <div class="train-detail-stop">
        <span class="train-detail-marker"></span>
        <div>
          <p class="train-detail-label">${a("previous")}</p>
          <p class="train-detail-name">${D}</p>
        </div>
      </div>
      <div class="train-detail-stop is-current">
        <span class="train-detail-marker train-detail-marker-ghost"></span>
        <div>
          <p class="train-detail-label">${y==="Between"?e.language==="zh-CN"?"区间":"Between":a("now")}</p>
          <p class="train-detail-name">${B}</p>
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
              <p class="metric-chip-value">${N}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${a("terminal")}</p>
              <p class="metric-chip-value">${I}</p>
            </div>
            <div class="metric-chip">
              <p class="metric-chip-label">${a("etaToTerminal")}</p>
              <p class="metric-chip-value">${b(A)}</p>
            </div>
          </div>
          <div class="train-eta-timeline">
            <div class="train-eta-header">
              <p class="train-detail-label">${a("upcomingStops")}</p>
              <p class="train-eta-header-copy">${a("liveEtaNow")}</p>
            </div>
            ${$.length?$.map(k=>`
                    <article class="train-eta-stop${k.isNext?" is-next":""}${k.isTerminal?" is-terminal":""}">
                      <div>
                        <p class="train-eta-stop-label">${k.isNext?a("nextStop"):k.isTerminal?a("terminal"):a("upcoming")}</p>
                        <p class="train-eta-stop-name">${k.label}</p>
                      </div>
                      <div class="train-eta-stop-side">
                        <p class="train-eta-stop-countdown">${b(k.etaSeconds)}</p>
                        <p class="train-eta-stop-clock">${k.clockTime}</p>
                      </div>
                    </article>
                  `).join(""):`<p class="train-readout muted">${a("noDownstreamEta")}</p>`}
          </div>
        </section>
      `),w.open||w.showModal()}return{closeTrainDialog:W,closeAlertDialog:G,renderAlertListDialog:P,renderTrainDialog:U}}function dn(e){const t=[...e.stops].sort((c,f)=>f.sequence-c.sequence),a=48,n=44,i=28,s=76,o=106,l=n+i+(t.length-1)*a,p=new Map,v=t.map((c,f)=>{const b={...c,label:Mt(c.name),y:n+f*a,index:f,isTerminal:f===0||f===t.length-1};p.set(c.id,f),p.set(`${e.agencyId}_${c.id}`,f);for(const w of e.stationAliases?.[c.id]??[])p.set(w,f),p.set(`${e.agencyId}_${w}`,f);return b});let m=0;for(let c=0;c<v.length;c+=1)v[c].cumulativeMinutes=m,m+=c<v.length-1?v[c].segmentMinutes:0;return{totalMinutes:m,height:l,labelX:o,stationGap:a,stationIndexByStopId:p,stations:v,trackX:s}}function un(e,t){const a=e.systemsById.has(t)?t:se,n=e.systemsById.get(a);e.activeSystemId=a,e.lines=n?.lines??[],e.layouts=e.layoutsBySystem.get(a)??new Map,e.lines.some(i=>i.id===e.activeLineId)||(e.activeLineId=e.lines[0]?.id??""),e.vehiclesByLine=new Map,e.rawVehicles=[],e.arrivalsCache.clear(),e.alerts=[],e.error="",e.fetchedAt="",e.insightsTickerIndex=0,e.vehicleGhosts=new Map}async function pn({state:e,getSystemIdFromUrl:t}){for(let i=0;i<=4;i+=1){let s=null,o=null;try{s=await fetch(ya,{cache:"no-store"}),o=await s.json()}catch(p){if(i===4)throw p;await ue(1e3*2**i);continue}if(!s.ok){if(i===4)throw new Error(`Static data load failed with ${s.status}`);await ue(1e3*2**i);continue}const l=o.systems??[];e.systemsById=new Map(l.map(p=>[p.id,p])),e.layoutsBySystem=new Map(l.map(p=>[p.id,new Map(p.lines.map(v=>[v.id,dn(v)]))])),un(e,t());return}}function mn({getPreferredLanguage:e,getPreferredTheme:t,handleViewportResize:a,loadStaticData:n,refreshVehicles:i,render:s,refreshLiveMeta:o,refreshArrivalCountdowns:l,refreshVehicleStatusMessages:p,startInsightsTickerRotation:v,startLiveRefreshLoop:m,syncCompactLayoutFromBoard:c,syncDialogFromUrl:f,updateViewportState:b,setLanguage:w,setTheme:g,boardElement:S}){return async function(){w(e()),g(t()),b(),await n(),s(),await i(),await f(),window.addEventListener("popstate",()=>{f().catch(console.error)}),window.addEventListener("resize",a),window.visualViewport?.addEventListener("resize",a),new ResizeObserver(()=>{c()}).observe(S),m(),v(),window.setInterval(()=>{o(),l(),p()},1e3)}}const r={fetchedAt:"",error:"",activeSystemId:se,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayDirectionAnimationTimer:0,dialogDisplayAnimatingDirection:"",dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},gn=va({immediate:!0,onNeedRefresh(){gn(!0)}});document.querySelector("#app").innerHTML=`
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
`;const ee=document.querySelector("#board"),hn=document.querySelector("#screen-kicker"),fn=document.querySelector("#screen-title"),Re=document.querySelector("#system-bar"),vn=document.querySelector("#view-bar"),_e=[...document.querySelectorAll(".tab-button")],qe=document.querySelector("#language-toggle"),Fe=document.querySelector("#theme-toggle"),Te=document.querySelector("#status-pill"),yn=document.querySelector("#current-time"),He=document.querySelector("#updated-at"),Xe=on(),{dialog:ae,dialogServiceSummary:Et,dialogStatusPillElement:gt,dialogUpdatedAtElement:$n,dialogDisplay:Ue,dialogDirectionTabs:bn,arrivalsTitleNb:Rt,arrivalsTitleSb:zt,stationAlertsContainer:Sn,transferSection:le,arrivalsNbPinned:ht,arrivalsNb:ft,arrivalsSbPinned:vt,arrivalsSb:yt,trainDialog:Ve,trainDialogTitle:wn,trainDialogSubtitle:Ln,trainDialogClose:Ot,alertDialog:We,alertDialogTitle:Tn,alertDialogSubtitle:Cn,alertDialogLink:Dn,alertDialogClose:Pt}=Xe;Ue.addEventListener("click",()=>si());Ot.addEventListener("click",()=>at());Pt.addEventListener("click",()=>nt());qe.addEventListener("click",()=>{Vt(r.language==="en"?"zh-CN":"en"),Z()});bn.forEach(e=>{e.addEventListener("click",()=>{r.dialogDisplayDirection=e.dataset.dialogDirection,r.dialogDisplayDirection==="auto"&&(r.dialogDisplayAutoPhase="nb"),je()})});ae.addEventListener("click",e=>{e.target===ae&&xe()});Ve.addEventListener("click",e=>{e.target===Ve&&at()});We.addEventListener("click",e=>{e.target===We&&nt()});ae.addEventListener("close",()=>{oi(),li(),ri(),ii(!1),r.isSyncingFromUrl||Qt()});_e.forEach(e=>{e.addEventListener("click",()=>{r.activeTab=e.dataset.tab,Z()})});Fe.addEventListener("click",()=>{Ut(r.theme==="dark"?"light":"dark"),Z()});function he(){return Ce[r.activeSystemId]??Ce[se]}function An(){return r.systemsById.get(r.activeSystemId)?.agencyId??Ce[se].agencyId}function In(){return`${Ct}/vehicles-for-agency/${An()}.json?key=${Ke}`}function ne(){return r.language==="zh-CN"?he().vehicleLabel==="Train"?"列车":"公交":he().vehicleLabel??"Vehicle"}function pe(){return r.language==="zh-CN"?ne():he().vehicleLabelPlural??xa(ne())}function xn(){return mt[r.language]??mt.en}function u(e,...t){const a=xn()[e];return typeof a=="function"?a(...t):a}const{fetchJsonWithRetry:Bt}=Ka(r),{buildArrivalsForLine:Mn,fetchArrivalsForStopIds:Nn,getArrivalsForStation:kn,mergeArrivalBuckets:En,getArrivalServiceStatus:_t}=Ja({state:r,fetchJsonWithRetry:Bt,getStationStopIds:(...e)=>Me(...e),copyValue:u,getLanguage:()=>r.language});function Rn(e){return ka(e,u)}function qt(){return Ea(r.language)}function te(e){return Ra(e,r.language,u)}function Se(e){return Oa(e,r.language)}function X(e){return Pa(e,r.language)}function Ft(e){return Nt(e,r.language)}function zn(e){return Ba(e,r.language)}function On(e){return _a(e,u)}function Ht(e,t=!1){const a=t&&(e==="▲"||e==="▼")?`${e} `:"";return e==="▲"?`${a}${r.language==="zh-CN"?"北向":"Northbound"}`:e==="▼"?`${a}${r.language==="zh-CN"?"南向":"Southbound"}`:u("active")}function me(e,t="",{includeSymbol:a=!1}={}){const n=Ht(e,a);return t?r.language==="zh-CN"?`${n} · 开往 ${t}`:`${n} to ${t}`:n}function Ze(e,t){if(!t?.stations?.length)return"";const a=e==="▲"?0:e==="▼"?t.stations.length-1:-1;return a<0?"":t.stations[a]?.label??""}function Je(e,t){const a=Ze(e?.directionSymbol,t);return a||e?.upcomingLabel||e?.toLabel||e?.currentStopLabel||""}function Pn(e,t,a={}){return me(e,Ze(e,t),a)}function $t(e){const t=[...new Set(e.map(n=>n?.trim()).filter(Boolean))];if(!t.length)return"";const a=t.slice(0,2);return t.length>2&&a.push(r.language==="zh-CN"?"等":"etc."),a.join(" / ")}function De(e,t=[],a=r.currentDialogStation){const n=t.map(o=>o.destination),i=$t(n);if(i)return i;if(!a)return"";const s=ye(a).map(({line:o})=>r.layouts.get(o.id)).map(o=>Ze(e,o));return $t(s)}function Bn(){const e=window.localStorage.getItem(It);return e==="light"||e==="dark"?e:"dark"}function _n(){const e=window.localStorage.getItem(xt);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function Ut(e){r.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(It,e)}function Vt(e){r.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=r.language,window.localStorage.setItem(xt,r.language)}function Wt(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(t,e,a);r.compactLayout=n<=Sa}function Ae(){const a=window.getComputedStyle(ee).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==r.compactLayout&&(r.compactLayout=a,Z())}function qn(){return r.compactLayout?1:3}function Qe(e){const t=za(),a=e.serviceSpansByDate?.[t];return a?u("todayServiceSpan",X(a.start),X(a.end)):u("todayServiceUnavailable")}function jt(e){const t=new Date,a=Le(-1),n=Le(0),i=Le(1),s=e.serviceSpansByDate?.[a],o=e.serviceSpansByDate?.[n],l=e.serviceSpansByDate?.[i],v=[s&&{kind:"yesterday",start:oe(a,s.start),end:oe(a,s.end),span:s},o&&{kind:"today",start:oe(n,o.start),end:oe(n,o.end),span:o}].filter(Boolean).find(m=>t>=m.start&&t<=m.end);if(v)return{tone:"active",headline:u("lastTrip",X(v.span.end)),detail:u("endsIn",Se(v.end.getTime()-t.getTime())),compact:u("endsIn",Se(v.end.getTime()-t.getTime()))};if(o){const m=oe(n,o.start),c=oe(n,o.end);if(t<m)return{tone:"upcoming",headline:u("firstTrip",X(o.start)),detail:u("startsIn",Se(m.getTime()-t.getTime())),compact:u("startsIn",Se(m.getTime()-t.getTime()))};if(t>c)return{tone:"ended",headline:u("serviceEnded",X(o.end)),detail:l?u("nextStart",X(l.start)):u("noNextServiceLoaded"),compact:l?u("nextStart",X(l.start)):u("ended")}}return l?{tone:"upcoming",headline:u("nextFirstTrip",X(l.start)),detail:u("noServiceRemainingToday"),compact:u("nextStart",X(l.start))}:{tone:"muted",headline:u("serviceHoursUnavailable"),detail:u("staticScheduleMissing"),compact:u("unavailable")}}function et(e){const t=jt(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function Fn(e){const t=ye(e).map(({line:a})=>{const n=jt(a);return`${a.name}: ${n.compact}`}).slice(0,3);Et.textContent=t.join("  ·  ")||u("serviceSummaryUnavailable")}function Hn(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function Un(e){const t=Le(0),a=e.serviceSpansByDate?.[t];if(!a)return null;const n=Be(a.start)/3600,i=Be(a.end)/3600,s=Hn(new Date),o=Math.max(24,i,s,1);return{startHours:n,endHours:i,nowHours:s,axisMax:o,startLabel:X(a.start),endLabel:X(a.end)}}function Vn(e){const t=Un(e);if(!t)return"";const a=de(t.startHours/t.axisMax*100,0,100),n=de(t.endHours/t.axisMax*100,a,100),i=de(t.nowHours/t.axisMax*100,0,100),s=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
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
  `}function ve(e){return r.alerts.filter(t=>t.lineIds.includes(e))}function Gt(e,t){const a=ve(t.id);if(!a.length)return[];const n=new Set(Me(e,t));return n.add(e.id),a.filter(i=>i.stopIds.length>0&&i.stopIds.some(s=>n.has(s)))}function Wn(e){const t=new Set,a=[];for(const{station:n,line:i}of ye(e))for(const s of Gt(n,i))t.has(s.id)||(t.add(s.id),a.push(s));return a}function Kt(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${u("alertsWord",e.length)}</span>
    </button>
  `:""}function jn(e){switch(e){case"ARR":return u("arrivingStatus");case"DELAY":return u("delayedStatus");case"OK":return u("enRoute");default:return""}}function K(e){if(!r.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(r.fetchedAt).getTime())/1e3));return e-t}function fe(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function tt(e){const t=K(e.nextOffset??0),a=K(e.closestOffset??0),n=e.delayInfo.text;return t<=15?[{text:u("arrivingNow"),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:u("arrivingIn",te(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:u("nextStopIn",te(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:[{text:jn(e.serviceStatus),toneClass:fe(e,t)},{text:n,toneClass:e.delayInfo.colorClass}]}function ce(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function Yt(e){const t=K(e.nextOffset??0),a=K(e.closestOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel,[i,s]=tt(e);return t<=15?`${e.label} at ${n} ${ce([i,s])}`:t<=90?`${e.label} at ${n} ${ce([i,s])}`:a<0&&t>0?`${e.label} ${n} ${ce([i,s])}`:`${e.label} to ${n} ${ce([i,s])}`}function Xt(e){return ce(tt(e))}function Zt(e,t){if(!t.length)return"";const a=[...t].sort((i,s)=>K(i.nextOffset??0)-K(s.nextOffset??0)).slice(0,8),n=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${n.map(i=>`
          <span
            class="line-marquee-item ${fe(i,K(i.nextOffset??0))}"
            data-vehicle-marquee="${i.id}"
          >
            <span class="line-marquee-token">${i.lineToken}</span>
            <span class="line-marquee-copy">${Yt(i)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function Gn(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const n=a.dataset.vehicleStatus,i=Ie().find(o=>o.id===n);if(!i)return;const s=K(i.nextOffset??0);a.innerHTML=Xt(i),a.className=`train-list-status ${fe(i,s)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const n=a.dataset.vehicleMarquee,i=Ie().find(l=>l.id===n);if(!i)return;const s=K(i.nextOffset??0);a.className=`line-marquee-item ${fe(i,s)}`;const o=a.querySelector(".line-marquee-copy");o&&(o.innerHTML=Yt(i))})}function Kn(){document.querySelectorAll(".arrival-item[data-arrival-time]").forEach(t=>{const a=Number(t.dataset.arrivalTime);if(!Number.isFinite(a))return;const n=t.querySelector(".arrival-countdown"),i=t.querySelector(".arrival-status");if(!n||!i)return;const s=Math.floor((a-Date.now())/1e3),o=Number(t.dataset.scheduleDeviation??0),l=_t(a,o),p=Ye(l);n.textContent=te(s),i.textContent=l,i.className=`arrival-status arrival-status-${p}`})}function Yn(e){return e.fromLabel===e.toLabel||e.progress===0?r.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:r.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function Jt(e,t){if(!t?.stations?.length)return[];const a=Math.max(0,Math.min(t.stations.length-1,e.currentIndex??0)),n=Math.max(0,Math.min(t.stations.length-1,e.upcomingStopIndex??a)),i=e.directionSymbol==="▲"?-1:e.directionSymbol==="▼"?1:0;if(!i)return[];const s=[];let o=Math.max(0,e.nextOffset??0);for(let l=n;l>=0&&l<t.stations.length;l+=i){const p=t.stations[l];if(!p)break;s.push({label:p.label,etaSeconds:o,clockTime:Ft(Date.now()+o*1e3),isNext:l===n,isTerminal:l===0||l===t.stations.length-1});const v=p.segmentMinutes??0,c=t.stations[l-1]?.segmentMinutes??0;o+=Math.round((i>0?v:c)*60)}return s}function Xn(e){const t=r.layouts.get(e.lineId),a=Math.max(0,Jt(e,t).at(-1)?.etaSeconds??e.nextOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${r.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${n}</p>
        <p class="train-focus-metric-copy">${te(K(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${r.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${Je(e,t)}</p>
        <p class="train-focus-metric-copy">${te(K(a))}</p>
      </div>
    </div>
  `}function Ie(){return r.lines.flatMap(e=>(r.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function Zn(){return Object.values(Ce).filter(e=>r.systemsById.has(e.id)).map(e=>`
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
      `).join("")}</section>`}function bt(){return r.compactLayout?r.lines.filter(e=>e.id===r.activeLineId):r.lines}function Jn(e,t=!1){const a=Date.now(),n=l=>{const p=l.arrivalTime,v=Math.floor((p-a)/1e3),m=te(v),c=_t(l.arrivalTime,l.scheduleDeviation??0),f=Ye(c);let b="";if(l.distanceFromStop>0){const w=l.distanceFromStop>=1e3?`${(l.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(l.distanceFromStop)}m`,g=u("stopAway",l.numberOfStopsAway);b=` • ${w} • ${g}`}return`
      <div class="arrival-item" data-arrival-time="${l.arrivalTime}" data-schedule-deviation="${l.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${l.lineColor};">${l.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${l.lineName} ${ne()} ${l.vehicleId}</span>
            <span class="arrival-destination">${u("toDestination",l.destination)}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${f}">${c}</span>
          <span class="arrival-time">
            <span class="arrival-countdown">${m}</span>
            <span class="arrival-precision">${b}</span>
          </span>
        </span>
      </div>
    `},i=De("▲",e.nb),s=De("▼",e.sb);if(t){ht.innerHTML="",vt.innerHTML="",ft.innerHTML=`<div class="arrival-item muted">${u("loadingArrivals")}</div>`,yt.innerHTML=`<div class="arrival-item muted">${u("loadingArrivals")}</div>`,wt();return}const o=(l,p,v)=>{if(!l.length){p.innerHTML="",v.innerHTML=`<div class="arrival-item muted">${u("noUpcomingVehicles",pe().toLowerCase())}</div>`;return}const m=r.dialogDisplayMode?l.slice(0,2):[],c=r.dialogDisplayMode?l.slice(2):l;p.innerHTML=m.map(n).join(""),v.innerHTML=c.length?c.map(n).join(""):r.dialogDisplayMode?`<div class="arrival-item muted">${u("noAdditionalVehicles",pe().toLowerCase())}</div>`:""};o(e.nb,ht,ft),o(e.sb,vt,yt),Rt.textContent=me("▲",i,{includeSymbol:!0}),zt.textContent=me("▼",s,{includeSymbol:!0}),wt()}function Me(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const n=new Set;for(const s of a){const o=s.startsWith(`${t.agencyId}_`)?s:`${t.agencyId}_${s}`;n.add(o)}const i=e.id.replace(/-T\d+$/,"");return n.add(i.startsWith(`${t.agencyId}_`)?i:`${t.agencyId}_${i}`),[...n]}function ye(e){const t=r.lines.map(a=>{const n=a.stops.find(i=>i.id===e.id);return n?{line:a,station:n}:null}).filter(Boolean);return t.length>0?t:r.lines.map(a=>{const n=a.stops.find(i=>i.name===e.name);return n?{line:a,station:n}:null}).filter(Boolean)}function Qn(e){if(!e)return null;const t=e.trim().toLowerCase();for(const a of r.lines)for(const n of a.stops){const i=new Set([n.id,`${a.agencyId}_${n.id}`,n.name,normalizeName(n.name),we(n.name),we(normalizeName(n.name))]);for(const s of a.stationAliases?.[n.id]??[])i.add(s),i.add(`${a.agencyId}_${s}`),i.add(we(s));if([...i].some(s=>String(s).toLowerCase()===t))return n}return null}function ei(e){const t=new URL(window.location.href);t.searchParams.set("station",we(e.name)),window.history.pushState({},"",t)}function Qt(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function St(e){const t=new URL(window.location.href);e===se?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function ti(){const t=new URL(window.location.href).searchParams.get("system");return t&&r.systemsById.has(t)?t:se}async function ai(){const e=new URL(window.location.href),t=e.searchParams.get("system");t&&r.systemsById.has(t)&&t!==r.activeSystemId&&await ia(t,{updateUrl:!1,preserveDialog:!1});const a=e.searchParams.get("station");if(!a){xe();return}const n=Qn(a);if(!n){xe();return}r.currentDialogStationId===n.id&&ae.open||await aa(n,{updateUrl:!1})}const ni=ln({state:r,elements:Xe,copyValue:u,refreshStationDialog:e=>ta(e),clearStationParam:Qt}),{setDialogDisplayMode:ii,toggleDialogDisplayMode:si,stopDialogDirectionRotation:ri,renderDialogDirectionView:je,stopDialogAutoRefresh:oi,stopDialogDisplayScroll:li,syncDialogDisplayScroll:wt,startDialogAutoRefresh:ci,closeStationDialog:xe,setDialogTitle:ea,syncDialogTitleMarquee:Ge}=ni;function di(e){return Math.max(1,Math.round(e/Aa*60))}function ui(e,t){const a=Date.now(),n=new Set;for(const i of t){const s=`${e}:${i.id}`;n.add(s);const l=[...(r.vehicleGhosts.get(s)??[]).filter(p=>a-p.timestamp<=pt),{y:i.y,minutePosition:i.minutePosition,timestamp:a}].slice(-6);r.vehicleGhosts.set(s,l)}for(const[i,s]of r.vehicleGhosts.entries()){if(!i.startsWith(`${e}:`))continue;const o=s.filter(l=>a-l.timestamp<=pt);if(!n.has(i)||o.length===0){r.vehicleGhosts.delete(i);continue}o.length!==s.length&&r.vehicleGhosts.set(i,o)}}function pi(e,t){return(r.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}function mi(e,t){if(!e||!t.length)return"";const a=Math.max(...t.map(i=>i.distanceKm),Dt/2),n=82;return`
    <div class="transfer-radar">
      <svg viewBox="0 0 164 164" class="transfer-radar-svg" aria-hidden="true">
        <circle cx="${n}" cy="${n}" r="64" class="transfer-radar-ring"></circle>
        <circle cx="${n}" cy="${n}" r="44" class="transfer-radar-ring"></circle>
        <circle cx="${n}" cy="${n}" r="24" class="transfer-radar-ring"></circle>
        <circle cx="${n}" cy="${n}" r="8" class="transfer-radar-core"></circle>
        ${t.map(i=>{const s=Na(e,i.stop),o=22+i.distanceKm/a*44,l=n+Math.sin(s*Math.PI/180)*o,p=n-Math.cos(s*Math.PI/180)*o;return`
              <g>
                <line x1="${n}" y1="${n}" x2="${l.toFixed(1)}" y2="${p.toFixed(1)}" class="transfer-radar-spoke"></line>
                <circle cx="${l.toFixed(1)}" cy="${p.toFixed(1)}" r="7" class="transfer-radar-stop" style="--line-color:${i.line.color};"></circle>
              </g>
            `}).join("")}
      </svg>
      <div class="transfer-radar-copy">
        <p class="headway-chart-title">${r.language==="zh-CN"?"换乘雷达":"Transfer Radar"}</p>
        <p class="headway-chart-copy">${r.language==="zh-CN"?"中心为当前站，越远表示步行越久":"Center is this station; farther dots mean longer walks"}</p>
      </div>
    </div>
  `}function gi(e){if(!e)return[];const t=ye(e),a=new Set(t.map(({line:i,station:s})=>`${i.agencyId}:${i.id}:${s.id}`)),n=new Map;for(const i of r.systemsById.values())for(const s of i.lines??[])for(const o of s.stops??[]){if(a.has(`${s.agencyId}:${s.id}:${o.id}`))continue;const l=Ma(e.lat,e.lon,o.lat,o.lon);if(l>Dt)continue;const p=`${i.id}:${s.id}`,v=n.get(p);(!v||l<v.distanceKm)&&n.set(p,{systemId:i.id,systemName:i.name,line:s,stop:o,distanceKm:l,walkMinutes:di(l)})}return[...n.values()].sort((i,s)=>i.distanceKm-s.distanceKm||i.line.name.localeCompare(s.line.name)).slice(0,At*2)}function Oe(e,t=!1,a=r.currentDialogStation){if(t){le.hidden=!1,le.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">${u("transfers")}</h4>
          <p class="transfer-panel-copy">${u("checkingNearbyConnections")}</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">${u("loadingTransferRecommendations")}</div>
        </div>
      </div>
    `;return}if(!e.length){le.hidden=!0,le.innerHTML="";return}le.hidden=!1,le.innerHTML=`
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <h4 class="arrivals-title">${u("transfers")}</h4>
        <p class="transfer-panel-copy">${u("closestBoardableConnections")}</p>
      </div>
      ${mi(a,e)}
      <div class="transfer-list">
        ${e.map(n=>`
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${n.line.color};">${n.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${n.line.name} <span class="transfer-system-chip">${n.systemName}</span></p>
                    <p class="transfer-card-stop">${u("walkToStop",n.walkMinutes,n.stop.name)}</p>
                    <p class="transfer-card-meta">${On(n.distanceKm)}${n.arrival?` • ${u("toDestination",n.arrival.destination)}`:""}</p>
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
  `}function hi(e,t){const a=Date.now(),n=[];for(const i of e){const s=Me(i.stop,i.line),o=Mn(t,i.line,s),l=[...o.nb,...o.sb].sort((f,b)=>f.arrivalTime-b.arrivalTime);if(!l.length)continue;const p=a+i.walkMinutes*6e4+Ia,v=l.find(f=>f.arrivalTime>=p)??l[0],m=v.arrivalTime-a-i.walkMinutes*6e4,c=Math.max(0,Math.round(m/6e4));n.push({...i,arrival:v,boardAt:v.arrivalTime,badge:m<=0?u("leaveNow"):c<=1?u("boardInOneMinute"):u("boardInMinutes",c),tone:c<=2?"hot":c<=8?"good":"calm",timeText:Ft(v.arrivalTime)})}return n.sort((i,s)=>i.boardAt-s.boardAt||i.distanceKm-s.distanceKm).slice(0,At)}async function ta(e){if(!e)return;r.currentDialogStation=e,r.currentDialogStationId=e.id,ea(e.name),Fn(e);const t=ye(e),a=await Promise.all(t.map(({station:o,line:l})=>kn(o,l)));Jn(En(a));const n=Wn(e);Sn.innerHTML=n.length?n.map(o=>`
        <article class="insight-exception insight-exception-warn">
          <p>${o.title||u("serviceAlert")}</p>
        </article>
      `).join(""):"";const i=gi(e);if(!i.length){Oe([],!1,e),je(),Ge();return}Oe([],!0,e);const s=await Nn(i.flatMap(o=>Me(o.stop,o.line)));Oe(hi(i,s),!1,e),je(),Ge()}async function aa(e,{updateUrl:t=!0}={}){await ta(e),ae.open||ae.showModal(),t&&ei(e),ci()}const{renderLine:fi}=nn({state:r,getAlertsForLine:ve,getAlertsForStation:Gt,getTodayServiceSpan:Qe,getVehicleGhostTrail:pi,getVehicleLabel:ne,getVehicleLabelPlural:pe,copyValue:u,renderInlineAlerts:Kt,renderLineStatusMarquee:Zt,renderServiceReminderChip:et}),{renderTrainList:vi}=sn({state:r,copyValue:u,formatArrivalTime:te,formatDirectionLabel:me,formatEtaClockFromNow:zn,formatVehicleLocationSummary:Yn,getAlertsForLine:ve,getAllVehicles:Ie,getRealtimeOffset:K,getTodayServiceSpan:Qe,getVehicleDestinationLabel:Je,getVehicleLabel:ne,getVehicleLabelPlural:pe,getVehicleStatusClass:fe,renderFocusMetrics:Xn,renderInlineAlerts:Kt,renderLineStatusMarquee:Zt,renderServiceReminderChip:et,formatVehicleStatus:Xt}),{renderInsightsBoard:yi}=rn({state:r,classifyHeadwayHealth:Va,computeLineHeadways:Ha,copyValue:u,formatCurrentTime:qt,formatLayoutDirectionLabel:Pn,formatPercent:ja,getActiveSystemMeta:he,getAlertsForLine:ve,getDelayBuckets:Wa,getLineAttentionReasons:Ga,getInsightsTickerPageSize:qn,getRealtimeOffset:K,getTodayServiceSpan:Qe,getVehicleLabel:ne,getVehicleLabelPlural:pe,renderServiceReminderChip:et,renderServiceTimeline:Vn});function $i(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await ia(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function Pe(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{r.activeLineId=t.dataset.lineSwitch,Z()})})}const bi=cn({state:r,elements:Xe,copyValue:u,formatAlertSeverity:Fa,formatAlertEffect:qa,getAlertsForLine:e=>ve(e),getDirectionBaseLabel:Ht,getVehicleLabel:ne,getVehicleDestinationLabel:Je,getTrainTimelineEntries:Jt,getStatusTone:Ye,getVehicleStatusPills:tt,renderStatusPills:ce,formatArrivalTime:te}),{closeTrainDialog:at,closeAlertDialog:nt,renderAlertListDialog:Si,renderTrainDialog:wi}=bi;function Lt(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,n=Ie().find(i=>i.id===a);n&&(r.currentTrainId=a,wi(n))})})}function Tt(){document.querySelectorAll("[data-alert-line-id]").forEach(t=>{t.addEventListener("click",()=>{const a=r.lines.find(n=>n.id===t.dataset.alertLineId);a&&Si(a)})})}function Li(){r.lines.forEach(e=>{const t=r.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.stopId,o=t.stations.find(l=>l.id===s);o&&aa(o)})})})}function Z(){const e=he();if(document.documentElement.lang=r.language,qe.textContent=u("languageToggle"),qe.setAttribute("aria-label",u("languageToggleAria")),Fe.textContent=r.theme==="dark"?u("themeLight"):u("themeDark"),Fe.setAttribute("aria-label",u("themeToggleAria")),hn.textContent=e.kicker,fn.textContent=e.title,Re.setAttribute("aria-label",u("transitSystems")),vn.setAttribute("aria-label",u("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",u("boardDirectionView")),Rt.textContent=me("▲",De("▲"),{includeSymbol:!0}),zt.textContent=me("▼",De("▼"),{includeSymbol:!0}),Ue.textContent=r.dialogDisplayMode?u("exit"):u("board"),Ue.setAttribute("aria-label",r.dialogDisplayMode?u("exit"):u("board")),Ot.setAttribute("aria-label",u("closeTrainDialog")),Pt.setAttribute("aria-label",u("closeAlertDialog")),ae.open||(ea(u("station")),Et.textContent=u("serviceSummary")),Ve.open||(wn.textContent=u("train"),Ln.textContent=u("currentMovement")),We.open||(Tn.textContent=u("serviceAlert"),Cn.textContent=u("transitAdvisory")),Dn.textContent=u("readOfficialAlert"),Re.hidden=r.systemsById.size<2,Re.innerHTML=Zn(),na(),_e.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===r.activeTab)),_e.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=u("tabMap")),t.dataset.tab==="trains"&&(t.textContent=pe()),t.dataset.tab==="insights"&&(t.textContent=u("tabInsights"))}),$i(),r.activeTab==="map"){ee.className="board";const t=bt();ee.innerHTML=`${ze()}${t.map(fi).join("")}`,Pe(),Tt(),Li(),Lt(),queueMicrotask(Ae);return}if(r.activeTab==="trains"){ee.className="board",ee.innerHTML=`${ze()}${vi()}`,Pe(),Tt(),Lt(),queueMicrotask(Ae);return}if(r.activeTab==="insights"){ee.className="board";const t=bt();ee.innerHTML=`${ze()}${yi(t)}`,Pe()}}function Ti(){window.clearInterval(r.insightsTickerTimer),r.insightsTickerTimer=0}function Ci(){Ti(),r.insightsTickerTimer=window.setInterval(()=>{r.insightsTickerIndex+=1,r.activeTab==="insights"&&Z()},5e3)}function na(){Te.textContent=r.error?u("statusHold"):u("statusSync"),Te.classList.toggle("status-pill-error",!!r.error),yn.textContent=`${u("nowPrefix")} ${qt()}`,He.textContent=r.error?r.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":Rn(r.fetchedAt),gt.textContent=Te.textContent,gt.classList.toggle("status-pill-error",!!r.error),$n.textContent=He.textContent}function Di(){window.clearTimeout(r.liveRefreshTimer),r.liveRefreshTimer=0}function Ai(){Di();const e=()=>{r.liveRefreshTimer=window.setTimeout(async()=>{await it(),e()},wa)};e()}function Ii(e){const t=r.systemsById.has(e)?e:se,a=r.systemsById.get(t);r.activeSystemId=t,r.lines=a?.lines??[],r.layouts=r.layoutsBySystem.get(t)??new Map,r.lines.some(n=>n.id===r.activeLineId)||(r.activeLineId=r.lines[0]?.id??""),r.vehiclesByLine=new Map,r.rawVehicles=[],r.arrivalsCache.clear(),r.alerts=[],r.error="",r.fetchedAt="",r.insightsTickerIndex=0,r.vehicleGhosts=new Map}async function ia(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!r.systemsById.has(e)||r.activeSystemId===e){t&&St(r.activeSystemId);return}Ii(e),a||xe(),at(),nt(),Z(),t&&St(e),await it()}function xi(e){const t=[...new Set((e.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=r.lines.filter(n=>t.includes(kt(n))).map(n=>n.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??u("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function it(){try{const e=await Bt(In(),"Realtime");r.error="",r.fetchedAt=new Date().toISOString(),r.rawVehicles=e.data.list??[],r.alerts=(e.data.references?.situations??[]).map(xi).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(i=>[i.id,i]));for(const i of r.lines){const s=r.layouts.get(i.id),o=r.rawVehicles.map(l=>an(l,i,s,t,{language:r.language,copyValue:u})).filter(Boolean);r.vehiclesByLine.set(i.id,o),ui(i.id,o)}const a=computeSystemSummaryMetrics(buildInsightsItems(r.lines)),n=r.systemSnapshots.get(r.activeSystemId);r.systemSnapshots.set(r.activeSystemId,{previous:n?.current??null,current:a})}catch(e){r.error=u("realtimeOffline"),console.error(e)}Z()}const Mi=()=>{const e=r.compactLayout;if(Wt(),Ge(),e!==r.compactLayout){Z();return}Ae()},Ni=mn({getPreferredLanguage:_n,getPreferredTheme:Bn,handleViewportResize:Mi,loadStaticData:()=>pn({state:r,getSystemIdFromUrl:ti}),refreshVehicles:it,render:Z,refreshLiveMeta:na,refreshArrivalCountdowns:Kn,refreshVehicleStatusMessages:Gn,startInsightsTickerRotation:Ci,startLiveRefreshLoop:Ai,syncCompactLayoutFromBoard:Ae,syncDialogFromUrl:ai,updateViewportState:Wt,setLanguage:Vt,setTheme:Ut,boardElement:ee});Ni().catch(e=>{Te.textContent=u("statusFail"),He.textContent=e.message});
