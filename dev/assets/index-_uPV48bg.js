(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const qa="modulepreload",Fa=function(e){return"/link/dev/"+e},ft={},Ha=function(t,a,n){let s=Promise.resolve();if(a&&a.length>0){let v=function(p){return Promise.all(p.map(d=>Promise.resolve(d).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};var o=v;document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),g=l?.nonce||l?.getAttribute("nonce");s=v(a.map(p=>{if(p=Fa(p),p in ft)return;ft[p]=!0;const d=p.endsWith(".css"),h=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${h}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":qa,d||(m.as="script"),m.crossOrigin="",m.href=p,g&&m.setAttribute("nonce",g),document.head.appendChild(m),d)return new Promise((y,C)=>{m.addEventListener("load",y),m.addEventListener("error",()=>C(new Error(`Unable to preload CSS for ${p}`)))})}))}function r(l){const g=new Event("vite:preloadError",{cancelable:!0});if(g.payload=l,window.dispatchEvent(g),!g.defaultPrevented)throw l}return s.then(l=>{for(const g of l||[])g.status==="rejected"&&r(g.reason);return t().catch(r)})};function Ua(e={}){const{immediate:t=!1,onNeedRefresh:a,onOfflineReady:n,onRegistered:s,onRegisteredSW:r,onRegisterError:o}=e;let l,g;const v=async(d=!0)=>{await g};async function p(){if("serviceWorker"in navigator){if(l=await Ha(async()=>{const{Workbox:d}=await import("./workbox-window.prod.es5-BIl4cyR9.js");return{Workbox:d}},[]).then(({Workbox:d})=>new d("/link/dev/sw.js",{scope:"/link/dev/",type:"classic"})).catch(d=>{o?.(d)}),!l)return;l.addEventListener("activated",d=>{(d.isUpdate||d.isExternal)&&window.location.reload()}),l.addEventListener("installed",d=>{d.isUpdate||n?.()}),l.register({immediate:t}).then(d=>{r?r("/link/dev/sw.js",d):s?.(d)}).catch(d=>{o?.(d)})}}return g=p(),v}const Va="./pulse-data.json",_t="https://api.pugetsound.onebusaway.org/api/where",Qe="TEST".trim()||"TEST",se=Qe==="TEST",Wa=se?6e4:2e4,vt=3,yt=800,Ga=se?2e4:5e3,$t=se?12e4:3e4,bt=se?1200:0,Fe=se?1:3,ja=1100,Ka=se?45e3:15e3,Ya=se?9e4:3e4,Xa=4e3,Za=15e3,Ja=520,St=4*6e4,Qa=4.8,Pt=.35,en=3e3,tn=45e3,Bt=4,qt="link-pulse-theme",Ft="link-pulse-language",ge="link",Ee={link:{id:"link",agencyId:"40",label:"Link",kicker:"SEATTLE LIGHT RAIL",title:"LINK PULSE",vehicleLabel:"Train",vehicleLabelPlural:"Trains"},rapidride:{id:"rapidride",agencyId:"1",label:"RapidRide",kicker:"KING COUNTY METRO",title:"RAPIDRIDE PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"},swift:{id:"swift",agencyId:"29",label:"Swift",kicker:"COMMUNITY TRANSIT",title:"SWIFT PULSE",vehicleLabel:"Bus",vehicleLabelPlural:"Buses"}},wt={en:{languageToggle:"中文",languageToggleAria:"Switch to Chinese",themeLight:"Light",themeDark:"Dark",themeToggleAria:"Toggle color theme",transitSystems:"Transit systems",boardViews:"Board views",tabMap:"Map",tabInsights:"Insights",statusSync:"SYNC",statusHold:"HOLD",statusFail:"FAIL",nowPrefix:"Now",waitingSnapshot:"Waiting for snapshot",updatedNow:"Updated now",updatedSecondsAgo:e=>`Updated ${e}s ago`,updatedMinutesAgo:e=>`Updated ${e}m ago`,station:"Station",serviceSummary:"Service summary",boardDirectionView:"Board direction view",both:"Both",auto:"Auto",board:"Board",exit:"Exit",northbound:"Northbound (▲)",southbound:"Southbound (▼)",train:"Train",currentMovement:"Current movement",closeTrainDialog:"Close train dialog",serviceAlert:"Service Alert",transitAdvisory:"Transit advisory",closeAlertDialog:"Close alert dialog",readOfficialAlert:"Read official alert",arriving:"Arriving",todayServiceUnavailable:"Today service hours unavailable",todayServiceSpan:(e,t)=>`Today ${e} - ${t}`,lastTrip:e=>`Last trip ${e}`,endsIn:e=>`Ends in ${e}`,firstTrip:e=>`First trip ${e}`,startsIn:e=>`Starts in ${e}`,serviceEnded:e=>`Service ended ${e}`,nextStart:e=>`Next start ${e}`,noNextServiceLoaded:"No next service loaded",ended:"Ended",nextFirstTrip:e=>`Next first trip ${e}`,noServiceRemainingToday:"No service remaining today",serviceHoursUnavailable:"Service hours unavailable",staticScheduleMissing:"Static schedule data missing for this date",unavailable:"Unavailable",serviceSummaryUnavailable:"Service summary unavailable",alertsWord:e=>`alert${e===1?"":"s"}`,scheduled:"Scheduled",onTime:"On Time",unknown:"Unknown",arrivingStatus:"ARRIVING",delayedStatus:"DELAYED",enRoute:"EN ROUTE",arrivingNow:"Arriving now",arrivingIn:e=>`Arriving in ${e}`,nextStopIn:e=>`Next stop in ${e}`,active:"Active",noLiveVehicles:e=>`No live ${e}`,liveCount:(e,t)=>`${e} live ${t}`,inServiceCount:(e,t)=>`${e} ${t} in service`,activeVehicles:e=>`Active ${e}`,previous:"Previous",now:"Now",next:"Next",direction:"Direction",terminal:"Terminal",etaToTerminal:"ETA to Terminal",upcomingStops:"Upcoming stops",liveEtaNow:"Live ETA now",nextStop:"Next stop",upcoming:"Upcoming",noDownstreamEta:"No downstream ETA available for this train right now.",terminalFallback:"Terminal",loadingArrivals:"Loading arrivals...",noUpcomingVehicles:e=>`No upcoming ${e}`,noAdditionalVehicles:e=>`No additional ${e}`,stopAway:e=>`${e} stop${e===1?"":"s"} away`,toDestination:e=>`To ${e}`,transfers:"Transfers",checkingNearbyConnections:"Checking nearby connections...",loadingTransferRecommendations:"Loading transfer recommendations...",closestBoardableConnections:"Closest boardable connections from this station",walkToStop:(e,t)=>`Walk ${e} min to ${t}`,walkKm:e=>`${e.toFixed(1)} km walk`,walkMeters:e=>`${e} m walk`,leaveNow:"Leave now",boardInOneMinute:"Board in ~1 min",boardInMinutes:e=>`Board in ~${e} min`,activeAlerts:e=>`${e} active ${e===1?"alert":"alerts"}`,noActiveAlerts:"No active alerts.",noAdditionalAlertDetails:"No additional alert details available.",affectedLineAlerts:(e,t)=>`${e} Alerts`,realtimeOffline:"Realtime offline"},"zh-CN":{languageToggle:"EN",languageToggleAria:"切换到英文",themeLight:"浅色",themeDark:"深色",themeToggleAria:"切换主题",transitSystems:"交通系统",boardViews:"视图切换",tabMap:"地图",tabInsights:"洞察",statusSync:"同步",statusHold:"保留",statusFail:"失败",nowPrefix:"当前",waitingSnapshot:"等待快照",updatedNow:"刚刚更新",updatedSecondsAgo:e=>`${e} 秒前更新`,updatedMinutesAgo:e=>`${e} 分钟前更新`,station:"站点",serviceSummary:"服务摘要",boardDirectionView:"到站屏方向视图",both:"双向",auto:"自动",board:"到站屏",exit:"退出",northbound:"北向 (▲)",southbound:"南向 (▼)",train:"列车",currentMovement:"当前位置",closeTrainDialog:"关闭列车详情",serviceAlert:"服务告警",transitAdvisory:"交通提示",closeAlertDialog:"关闭告警详情",readOfficialAlert:"查看官方告警",arriving:"即将到站",todayServiceUnavailable:"今日运营时间不可用",todayServiceSpan:(e,t)=>`今日 ${e} - ${t}`,lastTrip:e=>`末班 ${e}`,endsIn:e=>`${e} 后结束`,firstTrip:e=>`首班 ${e}`,startsIn:e=>`${e} 后开始`,serviceEnded:e=>`已于 ${e} 收班`,nextStart:e=>`下次首班 ${e}`,noNextServiceLoaded:"暂无下一班服务数据",ended:"已结束",nextFirstTrip:e=>`下一次首班 ${e}`,noServiceRemainingToday:"今日无剩余服务",serviceHoursUnavailable:"运营时间不可用",staticScheduleMissing:"当前日期缺少静态时刻表数据",unavailable:"不可用",serviceSummaryUnavailable:"暂无服务摘要",alertsWord:()=>"告警",scheduled:"按时刻表",onTime:"准点",unknown:"未知",arrivingStatus:"即将到站",delayedStatus:"晚点",enRoute:"运行中",arrivingNow:"正在进站",arrivingIn:e=>`${e} 后到站`,nextStopIn:e=>`下一站 ${e}`,active:"运营中",noLiveVehicles:e=>`暂无实时${e}`,liveCount:(e,t)=>`${e} 辆实时${t}`,inServiceCount:(e,t)=>`${e} 辆${t}运营中`,activeVehicles:e=>`${e}列表`,previous:"上一站",now:"当前",next:"下一站",direction:"方向",terminal:"终点",etaToTerminal:"到终点 ETA",upcomingStops:"后续站点",liveEtaNow:"实时 ETA",nextStop:"下一站",upcoming:"后续",noDownstreamEta:"当前暂无这趟列车后续站点 ETA。",terminalFallback:"终点",loadingArrivals:"正在加载到站信息...",noUpcomingVehicles:e=>`暂无即将到站的${e}`,noAdditionalVehicles:e=>`暂无更多${e}`,stopAway:e=>`还有 ${e} 站`,toDestination:e=>`开往 ${e}`,transfers:"换乘",checkingNearbyConnections:"正在检查附近可换乘线路...",loadingTransferRecommendations:"正在加载换乘建议...",closestBoardableConnections:"从本站步行可达的最近可上车连接",walkToStop:(e,t)=>`步行 ${e} 分钟到 ${t}`,walkKm:e=>`步行 ${e.toFixed(1)} 公里`,walkMeters:e=>`步行 ${e} 米`,leaveNow:"现在出发",boardInOneMinute:"约 1 分钟后上车",boardInMinutes:e=>`约 ${e} 分钟后上车`,activeAlerts:e=>`${e} 条生效告警`,noActiveAlerts:"当前没有生效告警。",noAdditionalAlertDetails:"暂无更多告警详情。",affectedLineAlerts:e=>`${e} 告警`,realtimeOffline:"实时数据离线"}};function an(e){return/bus$/i.test(e)?`${e}es`:`${e}s`}function Re(e){return e.replace("Station","").replace("Univ of Washington","UW").replace("Int'l","Intl").trim()}function Me(e){return e.toLowerCase().replace(/['.]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function ue(e,t,a){return Math.max(t,Math.min(e,a))}function ae(e){return new Promise(t=>window.setTimeout(t,e))}function Ge(e){const[t="0",a="0",n="0"]=String(e).split(":");return Number(t)*3600+Number(a)*60+Number(n)}function nn(e,t,a,n){const r=(a-e)*Math.PI/180,o=(n-t)*Math.PI/180,l=Math.sin(r/2)**2+Math.cos(e*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(o/2)**2;return 2*6371*Math.asin(Math.sqrt(l))}function sn(e,t){const a=e.lat*Math.PI/180,n=t.lat*Math.PI/180,s=(t.lon-e.lon)*Math.PI/180,r=Math.sin(s)*Math.cos(n),o=Math.cos(a)*Math.sin(n)-Math.sin(a)*Math.cos(n)*Math.cos(s);return(Math.atan2(r,o)*180/Math.PI+360)%360}function rn(e,t){if(!e)return t("waitingSnapshot");const a=Math.max(0,Math.round((Date.now()-new Date(e).getTime())/1e3));return a<10?t("updatedNow"):a<60?t("updatedSecondsAgo",a):t("updatedMinutesAgo",Math.round(a/60))}function on(e){return new Intl.DateTimeFormat(e==="zh-CN"?"zh-CN":"en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"2-digit",hour12:e!=="zh-CN"}).format(new Date)}function ln(e,t,a){if(e<=0)return a("arriving");const n=Math.floor(e/60),s=e%60;return t==="zh-CN"?n>0?`${n}分 ${s}秒`:`${s}秒`:n>0?`${n}m ${s}s`:`${s}s`}function cn(){return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date)}function Ne(e){const t=new Date;return t.setDate(t.getDate()+e),new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(t)}function le(e,t){if(!e||!t)return null;const[a,n,s]=e.split("-").map(Number),r=Ge(t),o=Math.floor(r/3600),l=Math.floor(r%3600/60),g=r%60;return new Date(a,n-1,s,o,l,g)}function dn(e,t){const a=Math.max(0,Math.round(e/6e4)),n=Math.floor(a/60),s=a%60;return t==="zh-CN"?n&&s?`${n}小时${s}分钟`:n?`${n}小时`:`${s}分钟`:n&&s?`${n}h ${s}m`:n?`${n}h`:`${s}m`}function un(e,t){if(!e)return"";const[a="0",n="0"]=String(e).split(":"),s=Number(a),r=Number(n),o=(s%24+24)%24;if(t==="zh-CN")return`${String(o).padStart(2,"0")}:${String(r).padStart(2,"0")}`;const l=o>=12?"PM":"AM";return`${o%12||12}:${String(r).padStart(2,"0")} ${l}`}function Ht(e,t){return new Date(e).toLocaleTimeString(t==="zh-CN"?"zh-CN":"en-US",{hour:"numeric",minute:"2-digit",hour12:t!=="zh-CN"})}function pn(e,t){return Ht(Date.now()+Math.max(0,e)*1e3,t)}function mn(e,t){return e>=1?t("walkKm",e):t("walkMeters",Math.round(e*1e3))}function Ut(e){return String(e||"SERVICE ALERT").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function Vt(e){return String(e||"INFO").replaceAll("_"," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function gn(e,t){const a=[...e].sort((r,o)=>r.minutePosition-o.minutePosition),n=[...t].sort((r,o)=>r.minutePosition-o.minutePosition),s=r=>r.slice(1).map((o,l)=>Math.round(o.minutePosition-r[l].minutePosition));return{nbGaps:s(a),sbGaps:s(n)}}function hn(e){if(!e.length)return{avg:null,max:null,min:null,spread:null,ratio:null};const t=e.reduce((s,r)=>s+r,0)/e.length,a=Math.max(...e),n=Math.min(...e);return{avg:Math.round(t),max:a,min:n,spread:a-n,ratio:a/Math.max(n,1)}}function fn(e,t){const a=hn(e);if(t<2||a.avg==null)return{health:"quiet",stats:a};let n="healthy";return a.max>=12&&a.min<=4||a.ratio>=3?n="bunched":a.max>=12||a.spread>=6?n="uneven":a.avg>=18&&(n="sparse"),{health:n,stats:a}}function vn(e){return e.reduce((t,a)=>{const n=Number(a.scheduleDeviation??0);return n<=60?t.onTime+=1:n<=300?t.minorLate+=1:t.severeLate+=1,t},{onTime:0,minorLate:0,severeLate:0})}function yn(e,t){return t?`${Math.round(e/t*100)}%`:"—"}function $n({worstGap:e,severeLateCount:t,alertCount:a,balanceDelta:n,language:s}){const r=[];return e>=12&&r.push({key:"gap",tone:"alert",label:s==="zh-CN"?"大间隔":"Large gap"}),t>0&&r.push({key:"late",tone:"warn",label:s==="zh-CN"?"严重晚点":"Severe late"}),a>0&&r.push({key:"alert",tone:"info",label:s==="zh-CN"?"有告警":"Alerted"}),n>=2&&r.push({key:"balance",tone:"warn",label:s==="zh-CN"?"方向失衡":"Imbalanced"}),r.length||r.push({key:"healthy",tone:"healthy",label:s==="zh-CN"?"健康":"Healthy"}),r}function bn(e){function t(){const r=Math.max(0,e.obaRateLimitStreak-1),o=Math.min($t,Ga*2**r),l=Math.round(o*(.15+Math.random()*.2));return Math.min($t,o+l)}async function a(){const r=e.obaCooldownUntil-Date.now();r>0&&await ae(r)}function n(r){return r?.code===429||/rate limit/i.test(r?.text??"")}async function s(r,o){for(let l=0;l<=vt;l+=1){await a();let g=null,v=null,p=null;try{g=await fetch(r,{cache:"no-store"})}catch(m){p=m}if(g!==null)try{v=await g.json()}catch{v=null}const d=g?.status===429||n(v);if(g?.ok&&!d)return e.obaRateLimitStreak=0,e.obaCooldownUntil=0,v;const h=p!=null||g!=null&&(g.status===429||g.status>=500&&g.status<600);if(l===vt||!h)throw p||(v?.text?new Error(v.text):new Error(`${o} request failed with ${g?.status??"network error"}`));if(d){e.obaRateLimitStreak+=1;const m=yt*2**l,y=Math.max(m,t());e.obaCooldownUntil=Date.now()+y,await ae(y)}else{const m=yt*2**l;await ae(m)}}throw new Error(`${o} request failed`)}return{fetchJsonWithRetry:s,isRateLimitedPayload:n,waitForObaCooldown:a}}function Sn(e,t){const a=t.directionLookup?.[e.tripId??""];if(a==="1")return"nb";if(a==="0")return"sb";const n=e.tripHeadsign??"",s=n.toLowerCase();return t.nbTerminusPrefix&&s.startsWith(t.nbTerminusPrefix)?"nb":t.sbTerminusPrefix&&s.startsWith(t.sbTerminusPrefix)?"sb":/Lynnwood|Downtown Redmond/i.test(n)?"nb":/Federal Way|South Bellevue/i.test(n)?"sb":""}function wn(e){return e.routeKey??`${e.agencyId}_${e.id}`}function Ln(e,t){const a=e.tripHeadsign?.trim();return a?Re(a.replace(/^to\s+/i,"")):t("terminalFallback")}function Tn(e,t,a){return Math.floor((e-Date.now())/1e3)<=90?"ARR":t>=120?"DELAY":a==="zh-CN"?"准点":"ON TIME"}function et(e){return e==="DELAY"?"delay":e==="ARR"?"arr":"ok"}function Cn({state:e,fetchJsonWithRetry:t,getStationStopIds:a,copyValue:n,getLanguage:s}){async function r(p){const d=`${_t}/arrivals-and-departures-for-stop/${p}.json?key=${Qe}&minutesAfter=120`,h=await t(d,"Arrivals");if(h.code!==200)throw new Error(h.text||`Arrivals request failed for ${p}`);return h.data?.entry?.arrivalsAndDepartures??[]}async function o(p){const d=[...new Set(p)],h=[],m=[];for(let y=0;y<d.length;y+=Fe){const C=d.slice(y,y+Fe),D=await Promise.allSettled(C.map(I=>r(I)));h.push(...D),bt>0&&y+Fe<d.length&&await ae(bt)}for(const y of h)y.status==="fulfilled"&&m.push(...y.value);return m}function l(p,d,h=null){const m=Date.now(),y=new Set,C={nb:[],sb:[]},D=h?new Set(h):null;for(const I of p){if(I.routeId!==wn(d)||D&&!D.has(I.stopId))continue;const O=I.predictedArrivalTime||I.scheduledArrivalTime;if(!O||O<=m)continue;const P=Sn(I,d);if(!P)continue;const M=`${I.tripId}:${I.stopId}:${O}`;y.has(M)||(y.add(M),C[P].push({vehicleId:(I.vehicleId||"").replace(/^\d+_/,"")||"--",arrivalTime:O,destination:Ln(I,n),scheduleDeviation:I.scheduleDeviation??0,tripId:I.tripId,lineColor:d.color,lineName:d.name,lineToken:d.name[0],distanceFromStop:I.distanceFromStop??0,numberOfStopsAway:I.numberOfStopsAway??0}))}return C.nb.sort((I,O)=>I.arrivalTime-O.arrivalTime),C.sb.sort((I,O)=>I.arrivalTime-O.arrivalTime),C.nb=C.nb.slice(0,4),C.sb=C.sb.slice(0,4),C}async function g(p,d,h=null){const m=`${e.activeSystemId}:${d.id}:${p.id}`,y=e.arrivalsCache.get(m);if(y&&Date.now()-y.fetchedAt<Wa)return y.value;const C=a(p,d),D=h??await o(C),I=l(D,d,C);return e.arrivalsCache.set(m,{fetchedAt:Date.now(),value:I}),I}function v(p){const d={nb:[],sb:[]};for(const h of p)d.nb.push(...h.nb),d.sb.push(...h.sb);return d.nb.sort((h,m)=>h.arrivalTime-m.arrivalTime),d.sb.sort((h,m)=>h.arrivalTime-m.arrivalTime),d}return{buildArrivalsForLine:l,fetchArrivalsForStop:r,fetchArrivalsForStopIds:o,getArrivalsForStation:g,mergeArrivalBuckets:v,getArrivalServiceStatus:(p,d)=>Tn(p,d,s())}}function An(e,t){return e!=null&&t!=null&&e!==t?t<e?"▲":"▼":"•"}function In(e){const t=e.tripStatus??{},a=String(t.status??"").toLowerCase(),n=t.nextStopTimeOffset??0,s=t.scheduleDeviation??0,r=t.closestStop&&t.nextStop&&t.closestStop===t.nextStop;return a==="approaching"||r&&Math.abs(n)<=90?"ARR":s>=120?"DELAY":"OK"}function xn(e,t,{language:a,copyValue:n}){if(!t)return{text:n("scheduled"),colorClass:"status-muted"};if(e>=-30&&e<=60)return{text:n("onTime"),colorClass:"status-ontime"};if(e>60){const s=Math.round(e/60);let r="status-late-minor";return e>600?r="status-late-severe":e>300&&(r="status-late-moderate"),{text:a==="zh-CN"?`晚点 ${s} 分钟`:`+${s} min late`,colorClass:r}}if(e<-60){const s=Math.round(Math.abs(e)/60);return{text:a==="zh-CN"?`早到 ${s} 分钟`:`${s} min early`,colorClass:"status-early"}}return{text:n("unknown"),colorClass:"status-muted"}}function Dn(e,t,a,n,{language:s,copyValue:r}){const o=e.tripStatus?.activeTripId??e.tripId??"",l=n.get(o);if(!l||l.routeId!==t.routeKey)return null;const g=e.tripStatus?.closestStop,v=e.tripStatus?.nextStop,p=a.stationIndexByStopId.get(g),d=a.stationIndexByStopId.get(v);if(p==null&&d==null)return null;let h=p??d,m=d??p;if(h>m){const $=h;h=m,m=$}const y=a.stations[h],C=a.stations[m],D=e.tripStatus?.closestStopTimeOffset??0,I=e.tripStatus?.nextStopTimeOffset??0,O=l.directionId==="1"?"▲":l.directionId==="0"?"▼":An(p,d);let P=0;h!==m&&D<0&&I>0&&(P=ue(Math.abs(D)/(Math.abs(D)+I),0,1));const M=y.y+(C.y-y.y)*P,B=h!==m?y.segmentMinutes:0,U=y.cumulativeMinutes+B*P,q=p??d??h,V=a.stations[q]??y,K=O==="▲",ee=ue(q+(K?1:-1),0,a.stations.length-1),R=p!=null&&d!=null&&p!==d?d:ue(q+(K?-1:1),0,a.stations.length-1),W=a.stations[ee]??V,he=a.stations[R]??C,te=e.tripStatus?.scheduleDeviation??0,N=e.tripStatus?.predicted??!1,re=xn(te,N,{language:s,copyValue:r});return{id:e.vehicleId,label:e.vehicleId.replace(/^\d+_/,""),directionSymbol:O,fromLabel:y.label,minutePosition:U,progress:P,serviceStatus:In(e),toLabel:C.label,y:M,currentLabel:y.label,nextLabel:C.label,previousLabel:W.label,currentStopLabel:V.label,upcomingLabel:he.label,currentIndex:q,upcomingStopIndex:R,status:e.tripStatus?.status??"",closestStop:g,nextStop:v,closestOffset:D,nextOffset:I,scheduleDeviation:te,isPredicted:N,delayInfo:re,rawVehicle:e}}function Mn(e){const{state:t,getAlertsForLine:a,getAlertsForStation:n,getTodayServiceSpan:s,getVehicleGhostTrail:r,getVehicleLabel:o,getVehicleLabelPlural:l,copyValue:g,renderInlineAlerts:v,renderLineStatusMarquee:p,renderServiceReminderChip:d}=e;function h(m){const y=t.layouts.get(m.id),C=t.vehiclesByLine.get(m.id)??[],D=a(m.id),I=y.stations.map((M,B)=>{const U=y.stations[B-1],q=B>0?U.segmentMinutes:"",K=n(M,m).length>0,ee=M.isTerminal?15:10;return`
          <g transform="translate(0, ${M.y})" class="station-group${K?" has-alert":""}" data-stop-id="${M.id}" style="cursor: pointer;">
            ${B>0?`<text x="0" y="-14" class="segment-time">${q}</text>
                   <line x1="18" x2="${y.trackX-16}" y1="-18" y2="-18" class="segment-line"></line>`:""}
            <circle cx="${y.trackX}" cy="0" r="${M.isTerminal?11:5}" class="${M.isTerminal?"terminal-stop":"station-stop"}" style="--line-color:${m.color};"></circle>
            ${M.isTerminal?`<text x="${y.trackX}" y="4" text-anchor="middle" class="terminal-mark">${m.name[0]}</text>`:""}
            ${K?`<circle cx="${y.trackX+ee}" cy="-8" r="4" class="station-alert-dot"></circle>`:""}
            <text x="${y.labelX}" y="5" class="station-label">${M.label}</text>
            <rect x="0" y="-24" width="400" height="48" fill="transparent" class="station-hitbox"></rect>
          </g>
        `}).join(""),O=C.map((M,B)=>{const U=r(m.id,M.id);return`
          <g transform="translate(${y.trackX}, 0)" class="train" data-train-id="${M.id}">
            ${U.map((q,V)=>`
                  <circle
                    cy="${q.y+(B%3-1)*1.5}"
                    r="${Math.max(3,7-V)}"
                    class="train-ghost-dot"
                    style="--line-color:${m.color}; --ghost-opacity:${Math.max(.18,.56-V*.1)};"
                  ></circle>
                `).join("")}
            <g transform="translate(0, ${M.y+(B%3-1)*1.5})">
              <circle r="13" class="train-wave" style="--line-color:${m.color}; animation-delay:${B*.18}s;"></circle>
              <path d="M 0 -8 L 7 6 L -7 6 Z" transform="${M.directionSymbol==="▼"?"rotate(180)":""}" class="train-arrow" style="--line-color:${m.color};"></path>
            </g>
          </g>
        `}).join(""),P=o();return`
      <article class="line-card" data-line-id="${m.id}">
        <header class="line-card-header">
          <div class="line-title">
            <span class="line-token" style="--line-color:${m.color};">${m.name[0]}</span>
            <div class="line-title-copy">
              <div class="line-title-row">
                <h2>${m.name}</h2>
                ${v(D,m.id)}
              </div>
              <p>${g("liveCount",C.length,C.length===1?P.toLowerCase():l().toLowerCase())}</p>
              <p>${s(m)}</p>
            </div>
          </div>
          ${d(m)}
        </header>
        ${p(m.color,C.map(M=>({...M,lineToken:m.name[0]})))}
        <svg viewBox="0 0 460 ${y.height}" class="line-diagram" role="img" aria-label="${t.language==="zh-CN"?`${m.name} 实时线路图`:`${m.name} live LED board`}">
          <line x1="${y.trackX}" x2="${y.trackX}" y1="${y.stations[0].y}" y2="${y.stations.at(-1).y}" class="spine" style="--line-color:${m.color};"></line>
          ${I}
          ${O}
        </svg>
      </article>
    `}return{renderLine:h}}function Nn(e){const{state:t,copyValue:a,formatArrivalTime:n,formatDirectionLabel:s,formatEtaClockFromNow:r,formatVehicleLocationSummary:o,getAlertsForLine:l,getAllVehicles:g,getRealtimeOffset:v,getTodayServiceSpan:p,getVehicleDestinationLabel:d,getVehicleLabel:h,getVehicleLabelPlural:m,getVehicleStatusClass:y,renderFocusMetrics:C,renderInlineAlerts:D,renderLineStatusMarquee:I,renderServiceReminderChip:O,formatVehicleStatus:P}=e;function M(){const B=g().sort((R,W)=>R.minutePosition-W.minutePosition),U=h(),q=m(),V=q.toLowerCase();return B.length?(t.compactLayout?t.lines.filter(R=>R.id===t.activeLineId):t.lines).map(R=>{const W=B.filter(f=>f.lineId===R.id),he=l(R.id),te=[...W].sort((f,S)=>v(f.nextOffset??0)-v(S.nextOffset??0)),N=te[0]??null,re=te.slice(1),$=f=>`
          <span class="train-direction-badge">
            ${s(f.directionSymbol,d(f,t.layouts.get(f.lineId)),{includeSymbol:!0})}
          </span>
        `,u=f=>`
          <article class="train-list-item train-queue-item" data-train-id="${f.id}">
            <div class="train-list-main">
              <span class="line-token train-list-token" style="--line-color:${f.lineColor};">${f.lineToken}</span>
              <div>
                <div class="train-list-row">
                  <p class="train-list-title">${f.lineName} ${U} ${f.label}</p>
                  ${$(f)}
                </div>
                <p class="train-list-subtitle">${a("toDestination",d(f,t.layouts.get(f.lineId)))}</p>
                <p class="train-list-status ${y(f,v(f.nextOffset??0))}" data-vehicle-status="${f.id}">${P(f)}</p>
              </div>
            </div>
            <div class="train-queue-side">
              <p class="train-queue-time">${n(v(f.nextOffset??0))}</p>
              <p class="train-queue-clock">${r(v(f.nextOffset??0))}</p>
            </div>
          </article>
        `;return`
          <article class="line-card train-line-card">
            <header class="line-card-header train-list-section-header">
              <div class="line-title">
                <span class="line-token" style="--line-color:${R.color};">${R.name[0]}</span>
                <div class="line-title-copy">
                  <div class="line-title-row">
                    <h2>${R.name}</h2>
                    ${D(he,R.id)}
                  </div>
                  <p>${a("inServiceCount",W.length,W.length===1?U.toLowerCase():m().toLowerCase())} · ${p(R)}</p>
                </div>
              </div>
              ${O(R)}
            </header>
            ${I(R.color,W)}
            <div class="line-readout train-columns train-stack-layout">
              ${N?`
                    <article class="train-focus-card train-list-item" data-train-id="${N.id}">
                      <div class="train-focus-header">
                        <div>
                          <p class="train-focus-kicker">${t.language==="zh-CN"?"最近一班":"Next up"}</p>
                          <div class="train-list-row">
                            <p class="train-focus-title">${N.lineName} ${U} ${N.label}</p>
                            ${$(N)}
                          </div>
                        </div>
                        <div class="train-focus-side">
                          <p class="train-focus-time">${n(v(N.nextOffset??0))}</p>
                          <p class="train-focus-clock">${r(v(N.nextOffset??0))}</p>
                        </div>
                      </div>
                      <p class="train-focus-destination">${a("toDestination",d(N,t.layouts.get(N.lineId)))}</p>
                      <p class="train-focus-segment">${o(N)}</p>
                      ${C(N)}
                      <p class="train-list-status ${y(N,v(N.nextOffset??0))}" data-vehicle-status="${N.id}">${P(N)}</p>
                    </article>
                  `:`<p class="train-readout muted">${a("noLiveVehicles",m().toLowerCase())}</p>`}
              ${re.length?`
                    <div class="train-queue-list">
                      <p class="train-queue-heading">${t.language==="zh-CN"?"后续车次":"Following vehicles"}</p>
                      ${re.map(u).join("")}
                    </div>
                  `:""}
            </div>
          </article>
        `}).join(""):`
        <section class="board" style="grid-template-columns: 1fr;">
          <article class="panel-card">
            <h2>${a("activeVehicles",q)}</h2>
            <p>${a("noLiveVehicles",V)}</p>
          </article>
        </section>
      `}return{renderTrainList:M}}function kn(e){const{state:t,classifyHeadwayHealth:a,computeLineHeadways:n,copyValue:s,formatCurrentTime:r,formatLayoutDirectionLabel:o,formatPercent:l,getActiveSystemMeta:g,getAlertsForLine:v,getDelayBuckets:p,getLineAttentionReasons:d,getInsightsTickerPageSize:h,getRealtimeOffset:m,getTodayServiceSpan:y,getVehicleLabel:C,getVehicleLabelPlural:D,renderServiceReminderChip:I,renderServiceTimeline:O}=e;function P($,u){if(!$.length||u<2)return{averageText:"—",detailText:t.language==="zh-CN"?`${D()}数量不足，无法判断间隔`:`Too few ${D().toLowerCase()} for a spacing read`};const f=Math.round($.reduce((T,w)=>T+w,0)/$.length),S=Math.min(...$),b=Math.max(...$);return{averageText:`~${f} min`,detailText:t.language==="zh-CN"?`观测间隔 ${S}-${b} 分钟`:`${S}-${b} min observed gap`}}function M($,u,f){const{averageText:S,detailText:b}=P(u,f);return`
      <div class="headway-health-card">
        <p class="headway-health-label">${$}</p>
        <p class="headway-health-value">${S}</p>
        <p class="headway-health-copy">${b}</p>
      </div>
    `}function B($,u){return Math.abs($.length-u.length)<=1?{label:t.language==="zh-CN"?"均衡":"Balanced",tone:"healthy"}:$.length>u.length?{label:t.language==="zh-CN"?"北向偏多":"Northbound heavier",tone:"warn"}:{label:t.language==="zh-CN"?"南向偏多":"Southbound heavier",tone:"warn"}}function U($,u){return`
      <div class="delay-distribution">
        ${[[t.language==="zh-CN"?"准点":"On time",$.onTime,"healthy"],[t.language==="zh-CN"?"晚点 2-5 分钟":"2-5 min late",$.minorLate,"warn"],[t.language==="zh-CN"?"晚点 5+ 分钟":"5+ min late",$.severeLate,"alert"]].map(([S,b,T])=>`
          <div class="delay-chip delay-chip-${T}">
            <p class="delay-chip-label">${S}</p>
            <p class="delay-chip-value">${b}</p>
            <p class="delay-chip-copy">${l(b,u)}</p>
          </div>
        `).join("")}
      </div>
    `}function q($,u,f,S){if(!u.length)return`
        <div class="flow-lane">
          <div class="flow-lane-header">
            <p class="flow-lane-title">${$}</p>
            <p class="flow-lane-copy">${s("noLiveVehicles",D().toLowerCase())}</p>
          </div>
        </div>
      `;const b=[...u].sort((w,A)=>w.minutePosition-A.minutePosition),T=b.map(w=>{const A=f.totalMinutes>0?w.minutePosition/f.totalMinutes:0;return Math.max(0,Math.min(100,A*100))});return`
      <div class="flow-lane">
        <div class="flow-lane-header">
          <p class="flow-lane-title">${$}</p>
          <p class="flow-lane-copy">${s("liveCount",b.length,b.length===1?C().toLowerCase():D().toLowerCase())}</p>
        </div>
        <div class="flow-track" style="--line-color:${S};">
          ${T.map((w,A)=>`
            <span
              class="flow-vehicle"
              style="left:${w}%; --line-color:${S};"
              title="${b[A].label}"
            ></span>
          `).join("")}
        </div>
      </div>
    `}function V($,u,f,S){const b=[],T=t.layouts.get($.id),w=o("▲",T,{includeSymbol:!0}),A=o("▼",T,{includeSymbol:!0}),{stats:x}=a(n(u,[]).nbGaps,u.length),{stats:k}=a(n([],f).sbGaps,f.length),_=[...u,...f].filter(Z=>Number(Z.scheduleDeviation??0)>300),Y=Math.abs(u.length-f.length);return x.max!=null&&x.max>=12&&b.push({tone:"alert",copy:t.language==="zh-CN"?`${w} 当前有 ${x.max} 分钟的服务空档。`:`${w} has a ${x.max} min service hole right now.`}),k.max!=null&&k.max>=12&&b.push({tone:"alert",copy:t.language==="zh-CN"?`${A} 当前有 ${k.max} 分钟的服务空档。`:`${A} has a ${k.max} min service hole right now.`}),Y>=2&&b.push({tone:"warn",copy:u.length>f.length?t.language==="zh-CN"?`车辆分布向 ${w} 偏多 ${Y} 辆。`:`Vehicle distribution is tilted toward ${w} by ${Y}.`:t.language==="zh-CN"?`车辆分布向 ${A} 偏多 ${Y} 辆。`:`Vehicle distribution is tilted toward ${A} by ${Y}.`}),_.length&&b.push({tone:"warn",copy:t.language==="zh-CN"?`${_.length} 辆${_.length===1?C().toLowerCase():D().toLowerCase()}晚点超过 5 分钟。`:`${_.length} ${_.length===1?C().toLowerCase():D().toLowerCase()} are running 5+ min late.`}),S.length&&b.push({tone:"info",copy:t.language==="zh-CN"?`${$.name} 当前受 ${S.length} 条告警影响。`:`${S.length} active alert${S.length===1?"":"s"} affecting ${$.name}.`}),b.length||b.push({tone:"healthy",copy:t.language==="zh-CN"?"当前间隔和准点性都比较稳定。":"Spacing and punctuality look stable right now."}),b.slice(0,4)}function K($){return $.map(u=>{const f=t.layouts.get(u.id),S=t.vehiclesByLine.get(u.id)??[],b=S.filter(A=>A.directionSymbol==="▲"),T=S.filter(A=>A.directionSymbol==="▼"),w=v(u.id);return{line:u,layout:f,vehicles:S,nb:b,sb:T,lineAlerts:w,exceptions:V(u,b,T,w)}})}function ee($){return`
      <div class="attention-reason-badges">
        ${$.map(u=>`<span class="attention-reason-badge attention-reason-badge-${u.tone}">${u.label}</span>`).join("")}
      </div>
    `}function R($){const u=$.length,f=$.reduce((L,H)=>L+H.vehicles.length,0),S=$.reduce((L,H)=>L+H.lineAlerts.length,0),b=$.filter(L=>L.lineAlerts.length>0).length,T=new Set($.flatMap(L=>L.lineAlerts.flatMap(H=>H.stopIds??[]))).size,w=$.flatMap(L=>L.vehicles),A=p(w),x=$.map(L=>{const{nbGaps:H,sbGaps:Be}=n(L.nb,L.sb),qe=[...H,...Be].length?Math.max(...H,...Be):0,xe=L.vehicles.filter(fe=>Number(fe.scheduleDeviation??0)>300).length,ht=Math.abs(L.nb.length-L.sb.length),Ra=a(H,L.nb.length).health,za=a(Be,L.sb.length).health,Oa=[Ra,za].some(fe=>fe==="uneven"||fe==="bunched"||fe==="sparse"),_a=xe>0,Pa=L.lineAlerts.length*5+xe*3+Math.max(0,qe-10),Ba=d({worstGap:qe,severeLateCount:xe,alertCount:L.lineAlerts.length,balanceDelta:ht,language:t.language});return{line:L.line,score:Pa,worstGap:qe,severeLateCount:xe,alertCount:L.lineAlerts.length,balanceDelta:ht,hasSevereLate:_a,isUneven:Oa,attentionReasons:Ba}}).sort((L,H)=>H.score-L.score||H.worstGap-L.worstGap),k=new Set(x.filter(L=>L.hasSevereLate).map(L=>L.line.id)),_=new Set(x.filter(L=>L.isUneven).map(L=>L.line.id)),Y=x.filter(L=>L.hasSevereLate&&!L.isUneven).length,Z=x.filter(L=>L.isUneven&&!L.hasSevereLate).length,oe=x.filter(L=>L.hasSevereLate&&L.isUneven).length,gt=new Set([...k,..._]).size,Na=Math.max(0,u-gt),ka=f?Math.round(A.onTime/f*100):null,Ea=x.filter(L=>L.score>0).slice(0,2);let Ie={tone:"healthy",copy:t.language==="zh-CN"?"当前没有明显的主要问题。":"No major active issues right now."};const z=x[0]??null;return z?.alertCount?Ie={tone:"info",copy:t.language==="zh-CN"?`${z.line.name} 当前有 ${z.alertCount} 条生效告警。`:`${z.line.name} has ${z.alertCount} active alert${z.alertCount===1?"":"s"}.`}:z?.worstGap>=12?Ie={tone:"alert",copy:t.language==="zh-CN"?`当前最大实时间隔为空 ${z.line.name} 的 ${z.worstGap} 分钟。`:`Largest live gap: ${z.worstGap} min on ${z.line.name}.`}:z?.severeLateCount&&(Ie={tone:"warn",copy:t.language==="zh-CN"?`${z.line.name} 有 ${z.severeLateCount} 辆${z.severeLateCount===1?C().toLowerCase():D().toLowerCase()}晚点超过 5 分钟。`:`${z.line.name} has ${z.severeLateCount} ${z.severeLateCount===1?C().toLowerCase():D().toLowerCase()} running 5+ min late.`}),{totalLines:u,totalVehicles:f,totalAlerts:S,impactedLines:b,impactedStopCount:T,delayedLineIds:k,unevenLineIds:_,lateOnlyLineCount:Y,unevenOnlyLineCount:Z,mixedIssueLineCount:oe,attentionLineCount:gt,healthyLineCount:Na,onTimeRate:ka,rankedLines:x,priorityLines:Ea,topIssue:Ie}}function W($,u,{suffix:f="",invert:S=!1}={}){if($==null||u==null||$===u)return t.language==="zh-CN"?"与上次快照持平":"Flat vs last snapshot";const b=$-u,T=S?b<0:b>0,w=b>0?"↑":"↓";return t.language==="zh-CN"?`${T?"改善":"变差"} ${w} ${Math.abs(b)}${f}`:`${T?"Improving":"Worse"} ${w} ${Math.abs(b)}${f}`}function he($){const u=R($),f=t.systemSnapshots.get(t.activeSystemId)?.previous??null,S=[];u.totalAlerts>0&&S.push({tone:"info",copy:t.language==="zh-CN"?`${u.impactedLines} 条线路共受 ${u.totalAlerts} 条告警影响。`:`${u.totalAlerts} active alert${u.totalAlerts===1?"":"s"} across ${u.impactedLines} line${u.impactedLines===1?"":"s"}.`}),u.delayedLineIds.size>0&&S.push({tone:"warn",copy:t.language==="zh-CN"?`${u.delayedLineIds.size} 条线路上有车辆晚点超过 5 分钟。`:`${u.delayedLineIds.size} line${u.delayedLineIds.size===1?"":"s"} have vehicles running 5+ min late.`}),u.unevenLineIds.size>0&&S.push({tone:"alert",copy:t.language==="zh-CN"?`${u.unevenLineIds.size} 条线路当前发车间隔不均。`:`${u.unevenLineIds.size} line${u.unevenLineIds.size===1?"":"s"} show uneven spacing right now.`}),S.length||S.push({tone:"healthy",copy:t.language==="zh-CN"?"系统整体稳定，当前没有明显问题。":"System looks stable right now with no major active issues."});const b=[{label:t.language==="zh-CN"?"准点率":"On-Time Rate",value:u.onTimeRate!=null?`${u.onTimeRate}%`:"—",delta:W(u.onTimeRate,f?.onTimeRate,{suffix:"%"})},{label:t.language==="zh-CN"?"需关注线路":"Attention Lines",value:u.attentionLineCount,delta:W(u.attentionLineCount,f?.attentionLineCount,{invert:!0})}];return`
      <article class="panel-card panel-card-wide system-summary-card">
        <header class="panel-header"><div class="system-summary-header"><div class="line-title"><span class="line-token" style="--line-color:var(--accent-strong);">${g().label[0]}</span><div class="line-title-copy"><h2>${g().label} ${t.language==="zh-CN"?"概览":"Summary"}</h2><p>${t.language==="zh-CN"?`系统内 ${u.totalLines} 条线路 · 更新于 ${r()}`:`${u.totalLines} line${u.totalLines===1?"":"s"} in system · Updated ${r()}`}</p></div></div></div></header>
        <div class="system-summary-hero"><div class="insight-exception insight-exception-${u.topIssue.tone}"><p>${u.topIssue.copy}</p></div><div class="system-trend-strip">${b.map(T=>`<div class="metric-chip system-trend-chip"><p class="metric-chip-label">${T.label}</p><p class="metric-chip-value">${T.value}</p><p class="system-trend-copy">${T.delta}</p></div>`).join("")}</div></div>
        <div class="metric-strip system-summary-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"健康线路":"Healthy Lines"}</p><p class="metric-chip-value">${u.healthyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?`实时${D()}`:`Live ${D()}`}</p><p class="metric-chip-value">${u.totalVehicles}</p></div><div class="metric-chip ${u.totalAlerts?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"告警":"Alerts"}</p><p class="metric-chip-value">${u.totalAlerts}</p></div><div class="metric-chip ${u.attentionLineCount?"metric-chip-warn":"metric-chip-healthy"}"><p class="metric-chip-label">${t.language==="zh-CN"?"需关注线路":"Lines Needing Attention"}</p><p class="metric-chip-value">${u.attentionLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"影响站点":"Impacted Stops"}</p><p class="metric-chip-value">${u.impactedStopCount}</p></div></div>
        <div class="system-composition"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"需关注线路构成":"Attention Breakdown"}</p><p class="headway-chart-copy">${t.language==="zh-CN"?"按晚点与间隔异常拆解":"Split by lateness and spacing issues"}</p></div><div class="attention-breakdown-grid"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅晚点":"Late Only"}</p><p class="metric-chip-value">${u.lateOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"仅间隔不均":"Spacing Only"}</p><p class="metric-chip-value">${u.unevenOnlyLineCount}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"两者都有":"Both"}</p><p class="metric-chip-value">${u.mixedIssueLineCount}</p></div></div></div>
        <div class="system-priority"><div class="insight-exceptions-header">${t.language==="zh-CN"?"":'<p class="headway-chart-title">Recommended Next</p>'}<p class="headway-chart-copy">${t.language==="zh-CN"?"基于当前快照的综合优先级":"Best next checks from the current snapshot"}</p></div><div class="system-priority-list">${(u.priorityLines.length?u.priorityLines:u.rankedLines.slice(0,1)).map(({line:T,worstGap:w,severeLateCount:A,alertCount:x,attentionReasons:k})=>`<div class="system-priority-item"><div class="line-title"><span class="line-token" style="--line-color:${T.color};">${T.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${T.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`${w?`最大间隔 ${w} 分钟`:"当前无明显间隔问题"}${A?` · ${A} 辆严重晚点`:""}${x?` · ${x} 条告警`:""}`:`${w?`Gap ${w} min`:"No major spacing issue"}${A?` · ${A} severe late`:""}${x?` · ${x} alert${x===1?"":"s"}`:""}`}</p>${ee(k)}</div></div></div>`).join("")}</div></div>
        <div class="system-ranking"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"关注排名":"Attention Ranking"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div><div class="system-ranking-list">${u.rankedLines.slice(0,3).map(({line:T,score:w,worstGap:A,alertCount:x,severeLateCount:k,attentionReasons:_})=>`<div class="system-ranking-item"><div class="line-title"><span class="line-token" style="--line-color:${T.color};">${T.name[0]}</span><div class="line-title-copy"><p class="headway-chart-title">${T.name}</p><p class="headway-chart-copy">${t.language==="zh-CN"?`评分 ${w}${A?` · 最大间隔 ${A} 分钟`:""}${x?` · ${x} 条告警`:""}${k?` · ${k} 辆严重晚点`:""}`:`Score ${w}${A?` · gap ${A} min`:""}${x?` · ${x} alert${x===1?"":"s"}`:""}${k?` · ${k} severe late`:""}`}</p>${ee(_)}</div></div></div>`).join("")}</div></div>
        <div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"系统状态":"System Status"}</p><p class="headway-chart-copy">${t.error?t.language==="zh-CN"?"实时数据退化，使用最近一次成功快照":"Realtime degraded, using last successful snapshot":t.language==="zh-CN"?"仅基于当前实时快照":"Derived from the current live snapshot only"}</p></div>${S.map(T=>`<div class="insight-exception insight-exception-${T.tone}"><p>${T.copy}</p></div>`).join("")}</div>
      </article>
    `}function te($){const u=$.flatMap(w=>w.exceptions.map(A=>({tone:A.tone,copy:`${w.line.name}: ${A.copy}`,lineColor:w.line.color})));if(!u.length)return`
      <section class="insights-ticker insights-ticker-empty" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport"><span class="insights-ticker-item insights-ticker-item-healthy">${t.language==="zh-CN"?"当前没有活跃问题。":"No active issues right now."}</span></div></section>
    `;const f=h(),S=Math.ceil(u.length/f),b=t.insightsTickerIndex%S,T=u.slice(b*f,b*f+f);return`
      <section class="insights-ticker" aria-label="${t.language==="zh-CN"?"当前洞察摘要":"Current insights summary"}"><div class="insights-ticker-viewport">${T.map(w=>`<span class="insights-ticker-item insights-ticker-item-${w.tone} insights-ticker-item-animated"><span class="insights-ticker-dot" style="--line-color:${w.lineColor};"></span><span class="insights-ticker-copy">${w.copy}</span></span>`).join("")}</div></section>
    `}function N($,u,f,S,b){const T=f.length+S.length;if(!T)return"";const{nbGaps:w,sbGaps:A}=n(f,S),x=p([...f,...S]),k=[...w,...A].length?Math.max(...w,...A):null,_=B(f,S),Y=V($,f,S,b),Z=new Set(b.flatMap(oe=>oe.stopIds??[])).size;return`
      <div class="line-insights"><div class="metric-strip"><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"运营中":"In Service"}</p><p class="metric-chip-value">${T}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"准点率":"On-Time Rate"}</p><p class="metric-chip-value">${l(x.onTime,T)}</p></div><div class="metric-chip"><p class="metric-chip-label">${t.language==="zh-CN"?"最大间隔":"Worst Gap"}</p><p class="metric-chip-value">${k!=null?`${k} min`:"—"}</p></div><div class="metric-chip metric-chip-${_.tone}"><p class="metric-chip-label">${t.language==="zh-CN"?"方向平衡":"Balance"}</p><p class="metric-chip-value">${_.label}</p></div></div><div class="headway-health-grid">${M(o("▲",u,{includeSymbol:!0}),w,f.length)}${M(o("▼",u,{includeSymbol:!0}),A,S.length)}</div>${U(x,T)}<div class="flow-grid">${q(t.language==="zh-CN"?`${o("▲",u,{includeSymbol:!0})} 流向`:`${o("▲",u,{includeSymbol:!0})} flow`,f,u,$.color)}${q(t.language==="zh-CN"?`${o("▼",u,{includeSymbol:!0})} 流向`:`${o("▼",u,{includeSymbol:!0})} flow`,S,u,$.color)}</div><div class="insight-exceptions"><div class="insight-exceptions-header"><p class="headway-chart-title">${t.language==="zh-CN"?"当前":"Now"}</p><p class="headway-chart-copy">${b.length?t.language==="zh-CN"?`${b.length} 条生效告警${Z?` · 影响 ${Z} 个站点`:""}`:`${b.length} active alert${b.length===1?"":"s"}${Z?` · ${Z} impacted stops`:""}`:t.language==="zh-CN"?"本线路当前没有生效告警":"No active alerts on this line"}</p></div>${Y.map(oe=>`<div class="insight-exception insight-exception-${oe.tone}"><p>${oe.copy}</p></div>`).join("")}</div></div>
    `}function re($){const u=K(t.lines),f=C(),S=K($);return`
      ${te(S)}
      ${he(u)}
      ${S.map(({line:b,layout:T,vehicles:w,nb:A,sb:x,lineAlerts:k})=>{const _=N(b,T,A,x,k);return`
          <article class="panel-card panel-card-wide">
            <header class="panel-header line-card-header"><div class="line-title"><span class="line-token" style="--line-color:${b.color};">${b.name[0]}</span><div class="line-title-copy"><h2>${b.name}</h2><p>${s("liveCount",w.length,w.length===1?C().toLowerCase():D().toLowerCase())} · ${y(b)}</p></div></div>${I(b)}</header>
            ${O(b)}
            ${_||`<p class="train-readout muted">${t.language==="zh-CN"?`等待实时${f.toLowerCase()}数据…`:`Waiting for live ${f.toLowerCase()} data…`}</p>`}
          </article>
        `}).join("")}
    `}return{renderInsightsBoard:re}}const i={fetchedAt:"",error:"",activeSystemId:ge,activeTab:"map",activeLineId:"",compactLayout:!1,theme:"dark",currentDialogStationId:"",systemsById:new Map,layoutsBySystem:new Map,lines:[],layouts:new Map,vehiclesByLine:new Map,rawVehicles:[],arrivalsCache:new Map,activeDialogRequest:0,isSyncingFromUrl:!1,currentDialogStation:null,dialogRefreshTimer:0,liveRefreshTimer:0,dialogDisplayMode:!1,dialogDisplayDirection:"both",dialogDisplayAutoPhase:"nb",dialogDisplayDirectionTimer:0,dialogDisplayDirectionAnimationTimer:0,dialogDisplayAnimatingDirection:"",dialogDisplayTimer:0,dialogDisplayIndexes:{nb:0,sb:0},insightsTickerIndex:0,insightsTickerTimer:0,currentTrainId:"",alerts:[],obaCooldownUntil:0,obaRateLimitStreak:0,systemSnapshots:new Map,vehicleGhosts:new Map,language:"en"},En=Ua({immediate:!0,onNeedRefresh(){En(!0)}});document.querySelector("#app").innerHTML=`
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
`;const J=document.querySelector("#board"),Rn=document.querySelector("#screen-kicker"),zn=document.querySelector("#screen-title"),He=document.querySelector("#system-bar"),On=document.querySelector("#view-bar"),je=[...document.querySelectorAll(".tab-button")],Ke=document.querySelector("#language-toggle"),Ye=document.querySelector("#theme-toggle"),ke=document.querySelector("#status-pill"),_n=document.querySelector("#current-time"),Xe=document.querySelector("#updated-at"),E=document.querySelector("#station-dialog"),Pn=document.querySelector("#dialog-title"),Bn=document.querySelector("#dialog-title-track"),Wt=document.querySelector("#dialog-title-text"),qn=document.querySelector("#dialog-title-text-clone"),Gt=document.querySelector("#dialog-service-summary"),Lt=document.querySelector("#dialog-status-pill"),Fn=document.querySelector("#dialog-updated-at"),$e=document.querySelector("#dialog-display"),jt=[...document.querySelectorAll("[data-dialog-direction]")],Kt=document.querySelector("#arrivals-title-nb"),Yt=document.querySelector("#arrivals-title-sb"),ve=document.querySelector("#station-alerts-container"),ce=document.querySelector("#transfer-section"),Xt=document.querySelector('[data-direction-section="nb"]'),Tt=document.querySelector("#arrivals-nb-pinned"),be=document.querySelector("#arrivals-nb"),Zt=document.querySelector('[data-direction-section="sb"]'),Ct=document.querySelector("#arrivals-sb-pinned"),Se=document.querySelector("#arrivals-sb"),Q=document.querySelector("#train-dialog"),Jt=document.querySelector("#train-dialog-title"),Qt=document.querySelector("#train-dialog-subtitle"),At=document.querySelector("#train-dialog-line"),It=document.querySelector("#train-dialog-status"),ea=document.querySelector("#train-dialog-close"),ne=document.querySelector("#alert-dialog"),ta=document.querySelector("#alert-dialog-title"),aa=document.querySelector("#alert-dialog-subtitle"),Hn=document.querySelector("#alert-dialog-lines"),xt=document.querySelector("#alert-dialog-body"),Ze=document.querySelector("#alert-dialog-link"),na=document.querySelector("#alert-dialog-close");$e.addEventListener("click",()=>gi());ea.addEventListener("click",()=>ut());na.addEventListener("click",()=>pt());Ke.addEventListener("click",()=>{ua(i.language==="en"?"zh-CN":"en"),j()});jt.forEach(e=>{e.addEventListener("click",()=>{i.dialogDisplayDirection=e.dataset.dialogDirection,i.dialogDisplayDirection==="auto"&&(i.dialogDisplayAutoPhase="nb"),rt()})});E.addEventListener("click",e=>{e.target===E&&wa()});Q.addEventListener("click",e=>{e.target===Q&&ut()});ne.addEventListener("click",e=>{e.target===ne&&pt()});E.addEventListener("close",()=>{ot(),lt(),st(),it(!1),i.isSyncingFromUrl||$a()});je.forEach(e=>{e.addEventListener("click",()=>{i.activeTab=e.dataset.tab,j()})});Ye.addEventListener("click",()=>{da(i.theme==="dark"?"light":"dark"),j()});function we(){return Ee[i.activeSystemId]??Ee[ge]}function Un(){return i.systemsById.get(i.activeSystemId)?.agencyId??Ee[ge].agencyId}function Vn(){return`${_t}/vehicles-for-agency/${Un()}.json?key=${Qe}`}function ie(){return i.language==="zh-CN"?we().vehicleLabel==="Train"?"列车":"公交":we().vehicleLabel??"Vehicle"}function pe(){return i.language==="zh-CN"?ie():we().vehicleLabelPlural??an(ie())}function Wn(){return wt[i.language]??wt.en}function c(e,...t){const a=Wn()[e];return typeof a=="function"?a(...t):a}const{fetchJsonWithRetry:ia}=bn(i),{buildArrivalsForLine:Gn,fetchArrivalsForStopIds:Dt,getArrivalsForStation:jn,mergeArrivalBuckets:Kn,getArrivalServiceStatus:sa}=Cn({state:i,fetchJsonWithRetry:ia,getStationStopIds:(...e)=>Te(...e),copyValue:c,getLanguage:()=>i.language});function Yn(e){return rn(e,c)}function ra(){return on(i.language)}function X(e){return ln(e,i.language,c)}function De(e){return dn(e,i.language)}function G(e){return un(e,i.language)}function Xn(e){return Ht(e,i.language)}function oa(e){return pn(e,i.language)}function Zn(e){return mn(e,c)}function la(e,t=!1){const a=t&&(e==="▲"||e==="▼")?`${e} `:"";return e==="▲"?`${a}${i.language==="zh-CN"?"北向":"Northbound"}`:e==="▼"?`${a}${i.language==="zh-CN"?"南向":"Southbound"}`:c("active")}function me(e,t="",{includeSymbol:a=!1}={}){const n=la(e,a);return t?i.language==="zh-CN"?`${n} · 开往 ${t}`:`${n} to ${t}`:n}function ca(e,t){if(!t?.stations?.length)return"";const a=e==="▲"?0:e==="▼"?t.stations.length-1:-1;return a<0?"":t.stations[a]?.label??""}function Jn(e,t,a={}){return me(e,ca(e,t),a)}function Mt(e){const t=[...new Set(e.map(n=>n?.trim()).filter(Boolean))];if(!t.length)return"";const a=t.slice(0,2);return t.length>2&&a.push(i.language==="zh-CN"?"等":"etc."),a.join(" / ")}function ze(e,t=[],a=i.currentDialogStation){const n=t.map(o=>o.destination),s=Mt(n);if(s)return s;if(!a)return"";const r=Ae(a).map(({line:o})=>i.layouts.get(o.id)).map(o=>ca(e,o));return Mt(r)}function Qn(){const e=window.localStorage.getItem(qt);return e==="light"||e==="dark"?e:"dark"}function ei(){const e=window.localStorage.getItem(Ft);return e==="en"||e==="zh-CN"?e:(navigator.language?.toLowerCase()??"").startsWith("zh")?"zh-CN":"en"}function da(e){i.theme=e,document.documentElement.dataset.theme=e,window.localStorage.setItem(qt,e)}function ua(e){i.language=e==="zh-CN"?"zh-CN":"en",document.documentElement.lang=i.language,window.localStorage.setItem(Ft,i.language)}function Nt(){const e=window.visualViewport?.width??Number.POSITIVE_INFINITY,t=window.innerWidth||Number.POSITIVE_INFINITY,a=document.documentElement?.clientWidth||Number.POSITIVE_INFINITY,n=Math.min(t,e,a);i.compactLayout=n<=ja}function Oe(){const a=window.getComputedStyle(J).gridTemplateColumns.split(" ").map(n=>n.trim()).filter(Boolean).length<=1;a!==i.compactLayout&&(i.compactLayout=a,j())}function tt(e){const t=cn(),a=e.serviceSpansByDate?.[t];return a?c("todayServiceSpan",G(a.start),G(a.end)):c("todayServiceUnavailable")}function pa(e){const t=new Date,a=Ne(-1),n=Ne(0),s=Ne(1),r=e.serviceSpansByDate?.[a],o=e.serviceSpansByDate?.[n],l=e.serviceSpansByDate?.[s],v=[r&&{kind:"yesterday",start:le(a,r.start),end:le(a,r.end),span:r},o&&{kind:"today",start:le(n,o.start),end:le(n,o.end),span:o}].filter(Boolean).find(p=>t>=p.start&&t<=p.end);if(v)return{tone:"active",headline:c("lastTrip",G(v.span.end)),detail:c("endsIn",De(v.end.getTime()-t.getTime())),compact:c("endsIn",De(v.end.getTime()-t.getTime()))};if(o){const p=le(n,o.start),d=le(n,o.end);if(t<p)return{tone:"upcoming",headline:c("firstTrip",G(o.start)),detail:c("startsIn",De(p.getTime()-t.getTime())),compact:c("startsIn",De(p.getTime()-t.getTime()))};if(t>d)return{tone:"ended",headline:c("serviceEnded",G(o.end)),detail:l?c("nextStart",G(l.start)):c("noNextServiceLoaded"),compact:l?c("nextStart",G(l.start)):c("ended")}}return l?{tone:"upcoming",headline:c("nextFirstTrip",G(l.start)),detail:c("noServiceRemainingToday"),compact:c("nextStart",G(l.start))}:{tone:"muted",headline:c("serviceHoursUnavailable"),detail:c("staticScheduleMissing"),compact:c("unavailable")}}function at(e){const t=pa(e);return`
    <div class="service-reminder service-reminder-${t.tone}">
      <p class="service-reminder-headline">${t.headline}</p>
      <p class="service-reminder-detail">${t.detail}</p>
    </div>
  `}function ti(e){const t=Ae(e).map(({line:a})=>{const n=pa(a);return`${a.name}: ${n.compact}`}).slice(0,3);Gt.textContent=t.join("  ·  ")||c("serviceSummaryUnavailable")}function ai(e){return e.getHours()+e.getMinutes()/60+e.getSeconds()/3600}function ni(e){const t=Ne(0),a=e.serviceSpansByDate?.[t];if(!a)return null;const n=Ge(a.start)/3600,s=Ge(a.end)/3600,r=ai(new Date),o=Math.max(24,s,r,1);return{startHours:n,endHours:s,nowHours:r,axisMax:o,startLabel:G(a.start),endLabel:G(a.end)}}function ii(e){const t=ni(e);if(!t)return"";const a=ue(t.startHours/t.axisMax*100,0,100),n=ue(t.endHours/t.axisMax*100,a,100),s=ue(t.nowHours/t.axisMax*100,0,100),r=t.nowHours>=t.startHours&&t.nowHours<=t.endHours;return`
    <section class="service-timeline-card">
      <div class="service-timeline-header">
        <div>
          <p class="headway-chart-title">${i.language==="zh-CN"?"今日运营时间带":"Today Service Window"}</p>
          <p class="headway-chart-copy">${i.language==="zh-CN"?"首末班与当前时刻":"First trip, last trip, and current time"}</p>
        </div>
        <span class="service-timeline-badge ${r?"is-live":"is-off"}">${r?i.language==="zh-CN"?"运营中":"In service":i.language==="zh-CN"?"未运营":"Off hours"}</span>
      </div>
      <div class="service-timeline-track">
        <div class="service-timeline-band" style="left:${a}%; width:${Math.max(2,n-a)}%;"></div>
        <div class="service-timeline-now" style="left:${s}%;">
          <span class="service-timeline-now-dot"></span>
          <span class="service-timeline-now-label">${i.language==="zh-CN"?"当前":"Now"}</span>
        </div>
      </div>
      <div class="service-timeline-labels">
        <span>${t.startLabel}</span>
        <span>${t.endLabel}</span>
      </div>
    </section>
  `}function Ce(e){return i.alerts.filter(t=>t.lineIds.includes(e))}function ma(e,t){const a=Ce(t.id);if(!a.length)return[];const n=new Set(Te(e,t));return n.add(e.id),a.filter(s=>s.stopIds.length>0&&s.stopIds.some(r=>n.has(r)))}function si(e){const t=new Set,a=[];for(const{station:n,line:s}of Ae(e))for(const r of ma(n,s))t.has(r.id)||(t.add(r.id),a.push(r));return a}function ga(e,t){return e.length?`
    <button class="line-alert-badge" type="button" data-alert-line-id="${t}">
      <span class="line-alert-badge-count">${e.length}</span>
      <span class="line-alert-badge-copy">${c("alertsWord",e.length)}</span>
    </button>
  `:""}function ri(e){const t=[...e.stops].sort((d,h)=>h.sequence-d.sequence),a=48,n=44,s=28,r=88,o=122,l=n+s+(t.length-1)*a,g=new Map,v=t.map((d,h)=>{const m={...d,label:Re(d.name),y:n+h*a,index:h,isTerminal:h===0||h===t.length-1};g.set(d.id,h),g.set(`${e.agencyId}_${d.id}`,h);for(const y of e.stationAliases?.[d.id]??[])g.set(y,h),g.set(`${e.agencyId}_${y}`,h);return m});let p=0;for(let d=0;d<v.length;d+=1)v[d].cumulativeMinutes=p,p+=d<v.length-1?v[d].segmentMinutes:0;return{totalMinutes:p,height:l,labelX:o,stationGap:a,stationIndexByStopId:g,stations:v,trackX:r}}function oi(e){switch(e){case"ARR":return c("arrivingStatus");case"DELAY":return c("delayedStatus");case"OK":return c("enRoute");default:return""}}function F(e){if(!i.fetchedAt)return e;const t=Math.max(0,Math.floor((Date.now()-new Date(i.fetchedAt).getTime())/1e3));return e-t}function Le(e,t){return t<=90?"status-arriving":e.delayInfo.colorClass}function nt(e){const t=F(e.nextOffset??0),a=F(e.closestOffset??0),n=e.delayInfo.text;return t<=15?[{text:c("arrivingNow"),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:t<=90?[{text:c("arrivingIn",X(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:a<0&&t>0?[{text:c("nextStopIn",X(t)),toneClass:"status-arriving"},{text:n,toneClass:e.delayInfo.colorClass}]:[{text:oi(e.serviceStatus),toneClass:Le(e,t)},{text:n,toneClass:e.delayInfo.colorClass}]}function de(e){return e.map(t=>`
        <span class="status-chip ${t.toneClass}">
          ${t.text}
        </span>
      `).join("")}function ha(e){const t=F(e.nextOffset??0),a=F(e.closestOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel,[s,r]=nt(e);return t<=15?`${e.label} at ${n} ${de([s,r])}`:t<=90?`${e.label} at ${n} ${de([s,r])}`:a<0&&t>0?`${e.label} ${n} ${de([s,r])}`:`${e.label} to ${n} ${de([s,r])}`}function fa(e){return de(nt(e))}function va(e,t){if(!t.length)return"";const a=[...t].sort((s,r)=>F(s.nextOffset??0)-F(r.nextOffset??0)).slice(0,8),n=[...a,...a];return`
    <div class="line-marquee" style="--line-color:${e};">
      <div class="line-marquee-track">
        ${n.map(s=>`
          <span
            class="line-marquee-item ${Le(s,F(s.nextOffset??0))}"
            data-vehicle-marquee="${s.id}"
          >
            <span class="line-marquee-token">${s.lineToken}</span>
            <span class="line-marquee-copy">${ha(s)}</span>
          </span>
        `).join("")}
      </div>
    </div>
  `}function li(){document.querySelectorAll("[data-vehicle-status]").forEach(a=>{const n=a.dataset.vehicleStatus,s=_e().find(o=>o.id===n);if(!s)return;const r=F(s.nextOffset??0);a.innerHTML=fa(s),a.className=`train-list-status ${Le(s,r)}`}),document.querySelectorAll("[data-vehicle-marquee]").forEach(a=>{const n=a.dataset.vehicleMarquee,s=_e().find(l=>l.id===n);if(!s)return;const r=F(s.nextOffset??0);a.className=`line-marquee-item ${Le(s,r)}`;const o=a.querySelector(".line-marquee-copy");o&&(o.innerHTML=ha(s))})}function ci(e){return e.fromLabel===e.toLabel||e.progress===0?i.language==="zh-CN"?`当前位于 ${e.fromLabel}`:`Currently at ${e.fromLabel}`:i.language==="zh-CN"?`正从 ${e.fromLabel} 开往 ${e.toLabel}`:`Running from ${e.fromLabel} to ${e.toLabel}`}function di(e){const t=i.layouts.get(e.lineId),a=Math.max(0,Ca(e,t).at(-1)?.etaSeconds??e.nextOffset??0),n=e.upcomingLabel||e.toLabel||e.currentStopLabel;return`
    <div class="train-focus-metrics">
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${i.language==="zh-CN"?"下一站":"Next stop"}</p>
        <p class="train-focus-metric-value">${n}</p>
        <p class="train-focus-metric-copy">${X(F(e.nextOffset??0))}</p>
      </div>
      <div class="train-focus-metric">
        <p class="train-focus-metric-label">${i.language==="zh-CN"?"终点":"Terminal"}</p>
        <p class="train-focus-metric-value">${dt(e,t)}</p>
        <p class="train-focus-metric-copy">${X(F(a))}</p>
      </div>
    </div>
  `}function _e(){return i.lines.flatMap(e=>(i.vehiclesByLine.get(e.id)??[]).map(t=>({...t,lineColor:e.color,lineId:e.id,lineName:e.name,lineToken:e.name[0]})))}function ui(){return Object.values(Ee).filter(e=>i.systemsById.has(e.id)).map(e=>`
        <button
          class="tab-button ${e.id===i.activeSystemId?"is-active":""}"
          data-system-switch="${e.id}"
          type="button"
        >
          ${e.label}
        </button>
      `).join("")}function Ue(){return!i.compactLayout||i.lines.length<2?"":`<section class="line-switcher">${i.lines.map(t=>`
        <button
          class="line-switcher-button ${t.id===i.activeLineId?"is-active":""}"
          data-line-switch="${t.id}"
          type="button"
          style="--line-color:${t.color};"
        >
          <span class="line-token line-switcher-token" style="--line-color:${t.color};">${t.name[0]}</span>
          <span>${t.name}</span>
        </button>
      `).join("")}</section>`}function kt(){return i.compactLayout?i.lines.filter(e=>e.id===i.activeLineId):i.lines}function ya(e,t=!1){const a=Date.now(),n=l=>{const g=l.arrivalTime,v=Math.floor((g-a)/1e3),p=X(v),d=sa(l.arrivalTime,l.scheduleDeviation??0),h=et(d);let m="";if(l.distanceFromStop>0){const y=l.distanceFromStop>=1e3?`${(l.distanceFromStop/1e3).toFixed(1)}km`:`${Math.round(l.distanceFromStop)}m`,C=c("stopAway",l.numberOfStopsAway);m=` • ${y} • ${C}`}return`
      <div class="arrival-item" data-arrival-time="${l.arrivalTime}" data-schedule-deviation="${l.scheduleDeviation??0}">
        <span class="arrival-meta">
          <span class="arrival-line-token" style="--line-color:${l.lineColor};">${l.lineToken}</span>
          <span class="arrival-copy">
            <span class="arrival-vehicle">${l.lineName} ${ie()} ${l.vehicleId}</span>
            <span class="arrival-destination">${c("toDestination",l.destination)}</span>
          </span>
        </span>
        <span class="arrival-side">
          <span class="arrival-status arrival-status-${h}">${d}</span>
          <span class="arrival-time">
            <span class="arrival-countdown">${p}</span>
            <span class="arrival-precision">${m}</span>
          </span>
        </span>
      </div>
    `},s=ze("▲",e.nb),r=ze("▼",e.sb);if(t){Tt.innerHTML="",Ct.innerHTML="",be.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,Se.innerHTML=`<div class="arrival-item muted">${c("loadingArrivals")}</div>`,Je();return}const o=(l,g,v)=>{if(!l.length){g.innerHTML="",v.innerHTML=`<div class="arrival-item muted">${c("noUpcomingVehicles",pe().toLowerCase())}</div>`;return}const p=i.dialogDisplayMode?l.slice(0,2):[],d=i.dialogDisplayMode?l.slice(2):l;g.innerHTML=p.map(n).join(""),v.innerHTML=d.length?d.map(n).join(""):i.dialogDisplayMode?`<div class="arrival-item muted">${c("noAdditionalVehicles",pe().toLowerCase())}</div>`:""};o(e.nb,Tt,be),o(e.sb,Ct,Se),Kt.textContent=me("▲",s,{includeSymbol:!0}),Yt.textContent=me("▼",r,{includeSymbol:!0}),Je()}function Te(e,t){const a=new Set(t.stationAliases?.[e.id]??[]);a.add(e.id);const n=new Set;for(const r of a){const o=r.startsWith(`${t.agencyId}_`)?r:`${t.agencyId}_${r}`;n.add(o)}const s=e.id.replace(/-T\d+$/,"");return n.add(s.startsWith(`${t.agencyId}_`)?s:`${t.agencyId}_${s}`),[...n]}function Ae(e){const t=i.lines.map(a=>{const n=a.stops.find(s=>s.id===e.id);return n?{line:a,station:n}:null}).filter(Boolean);return t.length>0?t:i.lines.map(a=>{const n=a.stops.find(s=>s.name===e.name);return n?{line:a,station:n}:null}).filter(Boolean)}function pi(e){if(!e)return null;const t=e.trim().toLowerCase();for(const a of i.lines)for(const n of a.stops){const s=new Set([n.id,`${a.agencyId}_${n.id}`,n.name,Re(n.name),Me(n.name),Me(Re(n.name))]);for(const r of a.stationAliases?.[n.id]??[])s.add(r),s.add(`${a.agencyId}_${r}`),s.add(Me(r));if([...s].some(r=>String(r).toLowerCase()===t))return n}return null}function mi(e){const t=new URL(window.location.href);t.searchParams.set("station",Me(e.name)),window.history.pushState({},"",t)}function $a(){const e=new URL(window.location.href);e.searchParams.has("station")&&(e.searchParams.delete("station"),window.history.pushState({},"",e))}function Et(e){const t=new URL(window.location.href);e===ge?t.searchParams.delete("system"):t.searchParams.set("system",e),window.history.pushState({},"",t)}function ba(){const t=new URL(window.location.href).searchParams.get("system");return t&&i.systemsById.has(t)?t:ge}function it(e){i.dialogDisplayMode=e,E.classList.toggle("is-display-mode",e),$e.textContent=c(e?"exit":"board"),$e.setAttribute("aria-label",c(e?"exit":"board")),i.dialogDisplayDirection="both",i.dialogDisplayAutoPhase="nb",rt(),E.open&&i.currentDialogStation&&ct(i.currentDialogStation).catch(console.error),Pe(),Je()}function gi(){it(!i.dialogDisplayMode)}function st(){i.dialogDisplayDirectionTimer&&(window.clearInterval(i.dialogDisplayDirectionTimer),i.dialogDisplayDirectionTimer=0)}function Sa(){i.dialogDisplayDirectionAnimationTimer&&(window.clearTimeout(i.dialogDisplayDirectionAnimationTimer),i.dialogDisplayDirectionAnimationTimer=0),i.dialogDisplayAnimatingDirection="",Xt?.classList.remove("is-direction-animating"),Zt?.classList.remove("is-direction-animating")}function hi(e){if(!i.dialogDisplayMode||!e||e==="both")return;Sa(),i.dialogDisplayAnimatingDirection=e;const t=e==="nb"?Xt:Zt;t&&(t.offsetWidth,t.classList.add("is-direction-animating"),i.dialogDisplayDirectionAnimationTimer=window.setTimeout(()=>{t.classList.remove("is-direction-animating"),i.dialogDisplayDirectionAnimationTimer=0,i.dialogDisplayAnimatingDirection===e&&(i.dialogDisplayAnimatingDirection="")},Ja))}function rt({animate:e=!1}={}){st(),Sa();const t=i.dialogDisplayDirection,a=t==="auto"?i.dialogDisplayAutoPhase:t;jt.forEach(n=>{n.classList.toggle("is-active",n.dataset.dialogDirection===t)}),E.classList.toggle("show-nb-only",i.dialogDisplayMode&&a==="nb"),E.classList.toggle("show-sb-only",i.dialogDisplayMode&&a==="sb"),e&&hi(a),i.dialogDisplayMode&&t==="auto"&&(i.dialogDisplayDirectionTimer=window.setInterval(()=>{i.dialogDisplayAutoPhase=i.dialogDisplayAutoPhase==="nb"?"sb":"nb",rt({animate:!0})},Za))}function ot(){i.dialogRefreshTimer&&(window.clearTimeout(i.dialogRefreshTimer),i.dialogRefreshTimer=0)}function lt(){i.dialogDisplayTimer&&(window.clearInterval(i.dialogDisplayTimer),i.dialogDisplayTimer=0)}function Ve(e,t){const a=[...e.querySelectorAll(".arrival-item:not(.muted)")];if(e.style.transform="translateY(0)",!i.dialogDisplayMode||a.length<=3)return;const n=Number.parseFloat(window.getComputedStyle(e).rowGap||"0")||0,s=a[0].getBoundingClientRect().height+n,r=Math.max(0,a.length-3),o=Math.min(i.dialogDisplayIndexes[t],r);e.style.transform=`translateY(-${o*s}px)`}function Je(){lt(),i.dialogDisplayIndexes={nb:0,sb:0},Ve(be,"nb"),Ve(Se,"sb"),i.dialogDisplayMode&&(i.dialogDisplayTimer=window.setInterval(()=>{for(const[e,t]of[["nb",be],["sb",Se]]){const a=[...t.querySelectorAll(".arrival-item:not(.muted)")];if(a.length<=3)continue;const n=Math.max(0,a.length-3);i.dialogDisplayIndexes[e]=i.dialogDisplayIndexes[e]>=n?0:i.dialogDisplayIndexes[e]+1,Ve(t,e)}},Xa))}function fi(){if(!E.open)return;E.querySelectorAll(".arrival-item[data-arrival-time]").forEach(t=>{const a=Number(t.dataset.arrivalTime),n=Number(t.dataset.scheduleDeviation||0),s=t.querySelector(".arrival-countdown"),r=t.querySelector(".arrival-status");if(!s||!r)return;s.textContent=X(Math.floor((a-Date.now())/1e3));const o=sa(a,n),l=et(o);r.textContent=o,r.className=`arrival-status arrival-status-${l}`})}function vi(){if(ot(),!i.currentDialogStation)return;const e=()=>{i.dialogRefreshTimer=window.setTimeout(async()=>{!E.open||!i.currentDialogStation||(await ct(i.currentDialogStation).catch(console.error),e())},Ya)};e()}function wa(){i.currentDialogStationId="",i.currentDialogStation=null,E.open?E.close():(ot(),lt(),st(),it(!1),$a())}async function Rt(){const e=ba();e!==i.activeSystemId&&await Ma(e,{updateUrl:!1,preserveDialog:!1});const t=new URL(window.location.href).searchParams.get("station"),a=pi(t);i.isSyncingFromUrl=!0;try{if(!a){i.currentDialogStationId="",E.open&&E.close();return}if(i.activeTab="map",j(),i.currentDialogStationId===a.id&&E.open)return;await Ta(a,!1)}finally{i.isSyncingFromUrl=!1}}function La(e){const t=si(e);if(!t.length){ve.innerHTML="",ve.hidden=!0;return}ve.hidden=!1,ve.innerHTML=`
    <div class="station-alerts">
      ${t.map((a,n)=>`
        <button class="station-alert-pill" data-alert-idx="${n}" type="button">
          <span class="station-alert-pill-meta">${Vt(a.severity)} · ${Ut(a.effect)}</span>
          <span class="station-alert-pill-copy">${a.title||c("serviceAlert")}</span>
        </button>
      `).join("")}
    </div>
  `,ve.querySelectorAll(".station-alert-pill").forEach(a=>{const n=t[Number(a.dataset.alertIdx)];n&&a.addEventListener("click",()=>{const s=i.lines.find(r=>n.lineIds.includes(r.id));s&&Ia(s)})})}async function Ta(e,t=!0){Aa(e.name),ti(e),i.currentDialogStationId=e.id,i.currentDialogStation=e,La(e),ye([],!0),ya({nb:[],sb:[]},!0),t&&mi(e),E.showModal(),Pe(),vi(),await ct(e)}async function ct(e){const t=i.activeDialogRequest+1;i.activeDialogRequest=t;const a=()=>i.activeDialogRequest!==t||!E.open;try{const n=Ae(e),s=n.flatMap(({station:l,line:g})=>Te(l,g)),r=await Dt(s),o=await Promise.all(n.map(({station:l,line:g})=>jn(l,g,r)));if(a())return;La(e),ya(Kn(o))}catch(n){if(a())return;ye([],!1,e),be.innerHTML=`<div class="arrival-item muted">${n.message}</div>`,Se.innerHTML=`<div class="arrival-item muted">${i.language==="zh-CN"?"请稍后重试":"Retry in a moment"}</div>`;return}try{const n=wi(e);if(!n.length){if(a())return;ye([],!1,e);return}if(await ae(en),a())return;const s=n.flatMap(({stop:o,line:l})=>Te(o,l)),r=await Dt(s);if(a())return;ye(Li(n,r),!1,e)}catch{if(a())return;ye([],!1,e)}}function dt(e,t){if(!t?.stations?.length)return e.upcomingLabel??e.toLabel??e.currentStopLabel??c("terminalFallback");const a=e.directionSymbol==="▲"?0:t.stations.length-1;return t.stations[a]?.label??e.upcomingLabel}function Ca(e,t,a=6){if(!t?.stations?.length)return[];const n=e.directionSymbol==="▲"?-1:1,s=[],r=new Set,o=e.upcomingStopIndex??e.currentIndex,l=Math.max(0,e.nextOffset??0),g=(p,d,{isNext:h=!1,isTerminal:m=!1}={})=>{if(p==null||r.has(p))return;const y=t.stations[p];y&&(r.add(p),s.push({id:`${e.id}:${y.id}`,label:y.label,etaSeconds:Math.max(0,Math.round(d)),clockTime:oa(d),isNext:h,isTerminal:m}))};g(o,l,{isNext:!0});let v=l;for(let p=o+n;s.length<a&&!(p<0||p>=t.stations.length);p+=n){const d=p-n,h=t.stations[d];v+=Math.max(0,Math.round((h?.segmentMinutes??0)*60));const m=p===0||p===t.stations.length-1;g(p,v,{isTerminal:m})}return s}function Aa(e){Wt.textContent=e,qn.textContent=e,Pe()}function Pe(){const e=Pn;if(!e||!Bn)return;const a=i.dialogDisplayMode&&E.open&&Wt.scrollWidth>e.clientWidth;e.classList.toggle("is-marquee",a)}function yi(e){return Math.max(1,Math.round(e/Qa*60))}function $i(e,t){const a=Date.now(),n=new Set;for(const s of t){const r=`${e}:${s.id}`;n.add(r);const l=[...(i.vehicleGhosts.get(r)??[]).filter(g=>a-g.timestamp<=St),{y:s.y,minutePosition:s.minutePosition,timestamp:a}].slice(-6);i.vehicleGhosts.set(r,l)}for(const[s,r]of i.vehicleGhosts.entries()){if(!s.startsWith(`${e}:`))continue;const o=r.filter(l=>a-l.timestamp<=St);if(!n.has(s)||o.length===0){i.vehicleGhosts.delete(s);continue}o.length!==r.length&&i.vehicleGhosts.set(s,o)}}function bi(e,t){return(i.vehicleGhosts.get(`${e}:${t}`)??[]).slice(0,-1)}function Si(e,t){if(!e||!t.length)return"";const a=Math.max(...t.map(s=>s.distanceKm),Pt/2),n=82;return`
    <div class="transfer-radar">
      <svg viewBox="0 0 164 164" class="transfer-radar-svg" aria-hidden="true">
        <circle cx="${n}" cy="${n}" r="64" class="transfer-radar-ring"></circle>
        <circle cx="${n}" cy="${n}" r="44" class="transfer-radar-ring"></circle>
        <circle cx="${n}" cy="${n}" r="24" class="transfer-radar-ring"></circle>
        <circle cx="${n}" cy="${n}" r="8" class="transfer-radar-core"></circle>
        ${t.map(s=>{const r=sn(e,s.stop),o=22+s.distanceKm/a*44,l=n+Math.sin(r*Math.PI/180)*o,g=n-Math.cos(r*Math.PI/180)*o;return`
              <g>
                <line x1="${n}" y1="${n}" x2="${l.toFixed(1)}" y2="${g.toFixed(1)}" class="transfer-radar-spoke"></line>
                <circle cx="${l.toFixed(1)}" cy="${g.toFixed(1)}" r="7" class="transfer-radar-stop" style="--line-color:${s.line.color};"></circle>
              </g>
            `}).join("")}
      </svg>
      <div class="transfer-radar-copy">
        <p class="headway-chart-title">${i.language==="zh-CN"?"换乘雷达":"Transfer Radar"}</p>
        <p class="headway-chart-copy">${i.language==="zh-CN"?"中心为当前站，越远表示步行越久":"Center is this station; farther dots mean longer walks"}</p>
      </div>
    </div>
  `}function wi(e){if(!e)return[];const t=Ae(e),a=new Set(t.map(({line:s,station:r})=>`${s.agencyId}:${s.id}:${r.id}`)),n=new Map;for(const s of i.systemsById.values())for(const r of s.lines??[])for(const o of r.stops??[]){if(a.has(`${r.agencyId}:${r.id}:${o.id}`))continue;const l=nn(e.lat,e.lon,o.lat,o.lon);if(l>Pt)continue;const g=`${s.id}:${r.id}`,v=n.get(g);(!v||l<v.distanceKm)&&n.set(g,{systemId:s.id,systemName:s.name,line:r,stop:o,distanceKm:l,walkMinutes:yi(l)})}return[...n.values()].sort((s,r)=>s.distanceKm-r.distanceKm||s.line.name.localeCompare(r.line.name)).slice(0,Bt*2)}function ye(e,t=!1,a=i.currentDialogStation){if(t){ce.hidden=!1,ce.innerHTML=`
      <div class="transfer-panel">
        <div class="transfer-panel-header">
          <h4 class="arrivals-title">${c("transfers")}</h4>
          <p class="transfer-panel-copy">${c("checkingNearbyConnections")}</p>
        </div>
        <div class="transfer-list">
          <div class="transfer-card transfer-card-loading">${c("loadingTransferRecommendations")}</div>
        </div>
      </div>
    `;return}if(!e.length){ce.hidden=!0,ce.innerHTML="";return}ce.hidden=!1,ce.innerHTML=`
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <h4 class="arrivals-title">${c("transfers")}</h4>
        <p class="transfer-panel-copy">${c("closestBoardableConnections")}</p>
      </div>
      ${Si(a,e)}
      <div class="transfer-list">
        ${e.map(n=>`
              <article class="transfer-card">
                <div class="transfer-card-main">
                  <span class="arrival-line-token" style="--line-color:${n.line.color};">${n.line.name[0]}</span>
                  <div class="transfer-card-copy">
                    <p class="transfer-card-title">${n.line.name} <span class="transfer-system-chip">${n.systemName}</span></p>
                    <p class="transfer-card-stop">${c("walkToStop",n.walkMinutes,n.stop.name)}</p>
                    <p class="transfer-card-meta">${Zn(n.distanceKm)}${n.arrival?` • ${c("toDestination",n.arrival.destination)}`:""}</p>
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
  `}function Li(e,t){const a=Date.now(),n=[];for(const s of e){const r=Te(s.stop,s.line),o=Gn(t,s.line,r),l=[...o.nb,...o.sb].sort((h,m)=>h.arrivalTime-m.arrivalTime);if(!l.length)continue;const g=a+s.walkMinutes*6e4+tn,v=l.find(h=>h.arrivalTime>=g)??l[0],p=v.arrivalTime-a-s.walkMinutes*6e4,d=Math.max(0,Math.round(p/6e4));n.push({...s,arrival:v,boardAt:v.arrivalTime,badge:p<=0?c("leaveNow"):d<=1?c("boardInOneMinute"):c("boardInMinutes",d),tone:d<=2?"hot":d<=8?"good":"calm",timeText:Xn(v.arrivalTime)})}return n.sort((s,r)=>s.boardAt-r.boardAt||s.distanceKm-r.distanceKm).slice(0,Bt)}const{renderLine:Ti}=Mn({state:i,getAlertsForLine:Ce,getAlertsForStation:ma,getTodayServiceSpan:tt,getVehicleGhostTrail:bi,getVehicleLabel:ie,getVehicleLabelPlural:pe,copyValue:c,renderInlineAlerts:ga,renderLineStatusMarquee:va,renderServiceReminderChip:at}),{renderTrainList:Ci}=Nn({state:i,copyValue:c,formatArrivalTime:X,formatDirectionLabel:me,formatEtaClockFromNow:oa,formatVehicleLocationSummary:ci,getAlertsForLine:Ce,getAllVehicles:_e,getRealtimeOffset:F,getTodayServiceSpan:tt,getVehicleDestinationLabel:dt,getVehicleLabel:ie,getVehicleLabelPlural:pe,getVehicleStatusClass:Le,renderFocusMetrics:di,renderInlineAlerts:ga,renderLineStatusMarquee:va,renderServiceReminderChip:at,formatVehicleStatus:fa}),{renderInsightsBoard:Ai}=kn({state:i,classifyHeadwayHealth:fn,computeLineHeadways:gn,copyValue:c,formatCurrentTime:ra,formatLayoutDirectionLabel:Jn,formatPercent:yn,getActiveSystemMeta:we,getAlertsForLine:Ce,getDelayBuckets:vn,getLineAttentionReasons:$n,getInsightsTickerPageSize,getRealtimeOffset:F,getTodayServiceSpan:tt,getVehicleLabel:ie,getVehicleLabelPlural:pe,renderServiceReminderChip:at,renderServiceTimeline:ii});function Ii(){document.querySelectorAll("[data-system-switch]").forEach(t=>{t.addEventListener("click",async()=>{await Ma(t.dataset.systemSwitch,{updateUrl:!0,preserveDialog:!1})})})}function We(){document.querySelectorAll("[data-line-switch]").forEach(t=>{t.addEventListener("click",()=>{i.activeLineId=t.dataset.lineSwitch,j()})})}function ut(){i.currentTrainId="",Q.open&&Q.close()}function pt(){ne.open&&ne.close()}function Ia(e){const t=Ce(e.id);ta.textContent=c("affectedLineAlerts",e.name,t.length),aa.textContent=c("activeAlerts",t.length),Hn.textContent=e.name,xt.textContent="",xt.innerHTML=t.length?t.map(a=>`
            <article class="alert-dialog-item">
              <p class="alert-dialog-item-meta">${Vt(a.severity)} • ${Ut(a.effect)}</p>
              <p class="alert-dialog-item-title">${a.title||c("serviceAlert")}</p>
              <p class="alert-dialog-item-copy">${a.description||c("noAdditionalAlertDetails")}</p>
              ${a.url?`<p class="alert-dialog-item-link-wrap"><a class="alert-dialog-link" href="${a.url}" target="_blank" rel="noreferrer">${c("readOfficialAlert")}</a></p>`:""}
            </article>
          `).join(""):`<p class="alert-dialog-item-copy">${c("noActiveAlerts")}</p>`,Ze.hidden=!0,Ze.removeAttribute("href"),ne.open||ne.showModal()}function zt(){document.querySelectorAll("[data-alert-line-id]").forEach(t=>{t.addEventListener("click",()=>{const a=i.lines.find(n=>n.id===t.dataset.alertLineId);a&&Ia(a)})})}function xi(e){const t=e.fromLabel!==e.toLabel&&e.progress>0&&e.progress<1,a=t?e.fromLabel:e.previousLabel,n=t?`${e.fromLabel} -> ${e.toLabel}`:e.currentStopLabel,s=t?"Between":"Now",r=t?e.toLabel:e.upcomingLabel,o=t?e.progress:.5,l=i.layouts.get(e.lineId),g=Ca(e,l),v=l?dt(e,l):e.upcomingLabel,p=g.at(-1)?.etaSeconds??Math.max(0,e.nextOffset??0),d=la(e.directionSymbol);Jt.textContent=`${e.lineName} ${ie()} ${e.label}`,Qt.textContent=i.language==="zh-CN"?`${d} · ${c("toDestination",v)}`:`${d} to ${v}`,It.className=`train-detail-status train-list-status-${et(e.serviceStatus)}`,It.innerHTML=de(nt(e)),Q.querySelector(".train-eta-panel")?.remove(),At.innerHTML=`
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
        <p class="train-detail-label">${s==="Between"?i.language==="zh-CN"?"区间":"Between":c("now")}</p>
        <p class="train-detail-name">${n}</p>
      </div>
    </div>
    <div class="train-detail-stop">
      <span class="train-detail-marker"></span>
      <div>
        <p class="train-detail-label">${c("next")}</p>
        <p class="train-detail-name">${r}</p>
      </div>
    </div>
  `,At.insertAdjacentHTML("afterend",`
      <section class="train-eta-panel">
        <div class="train-eta-summary">
          <div class="metric-chip">
            <p class="metric-chip-label">${c("direction")}</p>
            <p class="metric-chip-value">${d}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("terminal")}</p>
            <p class="metric-chip-value">${v}</p>
          </div>
          <div class="metric-chip">
            <p class="metric-chip-label">${c("etaToTerminal")}</p>
            <p class="metric-chip-value">${X(p)}</p>
          </div>
        </div>
        <div class="train-eta-timeline">
          <div class="train-eta-header">
            <p class="train-detail-label">${c("upcomingStops")}</p>
            <p class="train-eta-header-copy">${c("liveEtaNow")}</p>
          </div>
          ${g.length?g.map(h=>`
                  <article class="train-eta-stop${h.isNext?" is-next":""}${h.isTerminal?" is-terminal":""}">
                    <div>
                      <p class="train-eta-stop-label">${h.isNext?c("nextStop"):h.isTerminal?c("terminal"):c("upcoming")}</p>
                      <p class="train-eta-stop-name">${h.label}</p>
                    </div>
                    <div class="train-eta-stop-side">
                      <p class="train-eta-stop-countdown">${X(h.etaSeconds)}</p>
                      <p class="train-eta-stop-clock">${h.clockTime}</p>
                    </div>
                  </article>
                `).join(""):`<p class="train-readout muted">${c("noDownstreamEta")}</p>`}
        </div>
      </section>
    `),Q.open||Q.showModal()}function Ot(){document.querySelectorAll("[data-train-id]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.trainId,n=_e().find(s=>s.id===a);n&&(i.currentTrainId=a,xi(n))})})}function Di(){i.lines.forEach(e=>{const t=i.layouts.get(e.id),a=document.querySelector(`.line-card[data-line-id="${e.id}"]`);if(!a)return;a.querySelectorAll(".station-group").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.stopId,o=t.stations.find(l=>l.id===r);o&&Ta(o)})})})}function j(){const e=we();if(document.documentElement.lang=i.language,Ke.textContent=c("languageToggle"),Ke.setAttribute("aria-label",c("languageToggleAria")),Ye.textContent=i.theme==="dark"?c("themeLight"):c("themeDark"),Ye.setAttribute("aria-label",c("themeToggleAria")),Rn.textContent=e.kicker,zn.textContent=e.title,He.setAttribute("aria-label",c("transitSystems")),On.setAttribute("aria-label",c("boardViews")),document.querySelector("#dialog-direction-tabs")?.setAttribute("aria-label",c("boardDirectionView")),Kt.textContent=me("▲",ze("▲"),{includeSymbol:!0}),Yt.textContent=me("▼",ze("▼"),{includeSymbol:!0}),$e.textContent=i.dialogDisplayMode?c("exit"):c("board"),$e.setAttribute("aria-label",i.dialogDisplayMode?c("exit"):c("board")),ea.setAttribute("aria-label",c("closeTrainDialog")),na.setAttribute("aria-label",c("closeAlertDialog")),E.open||(Aa(c("station")),Gt.textContent=c("serviceSummary")),Q.open||(Jt.textContent=c("train"),Qt.textContent=c("currentMovement")),ne.open||(ta.textContent=c("serviceAlert"),aa.textContent=c("transitAdvisory")),Ze.textContent=c("readOfficialAlert"),He.hidden=i.systemsById.size<2,He.innerHTML=ui(),xa(),je.forEach(t=>t.classList.toggle("is-active",t.dataset.tab===i.activeTab)),je.forEach(t=>{t.dataset.tab==="map"&&(t.textContent=c("tabMap")),t.dataset.tab==="trains"&&(t.textContent=pe()),t.dataset.tab==="insights"&&(t.textContent=c("tabInsights"))}),Ii(),i.activeTab==="map"){J.className="board";const t=kt();J.innerHTML=`${Ue()}${t.map(Ti).join("")}`,We(),zt(),Di(),Ot(),queueMicrotask(Oe);return}if(i.activeTab==="trains"){J.className="board",J.innerHTML=`${Ue()}${Ci()}`,We(),zt(),Ot(),queueMicrotask(Oe);return}if(i.activeTab==="insights"){J.className="board";const t=kt();J.innerHTML=`${Ue()}${Ai(t)}`,We()}}function Mi(){window.clearInterval(i.insightsTickerTimer),i.insightsTickerTimer=0}function Ni(){Mi(),i.insightsTickerTimer=window.setInterval(()=>{i.insightsTickerIndex+=1,i.activeTab==="insights"&&j()},5e3)}function xa(){ke.textContent=i.error?c("statusHold"):c("statusSync"),ke.classList.toggle("status-pill-error",!!i.error),_n.textContent=`${c("nowPrefix")} ${ra()}`,Xe.textContent=i.error?i.language==="zh-CN"?"使用最近一次成功快照":"Using last successful snapshot":Yn(i.fetchedAt),Lt.textContent=ke.textContent,Lt.classList.toggle("status-pill-error",!!i.error),Fn.textContent=Xe.textContent}function ki(){window.clearTimeout(i.liveRefreshTimer),i.liveRefreshTimer=0}function Ei(){ki();const e=()=>{i.liveRefreshTimer=window.setTimeout(async()=>{await mt(),e()},Ka)};e()}function Da(e){const t=i.systemsById.has(e)?e:ge,a=i.systemsById.get(t);i.activeSystemId=t,i.lines=a?.lines??[],i.layouts=i.layoutsBySystem.get(t)??new Map,i.lines.some(n=>n.id===i.activeLineId)||(i.activeLineId=i.lines[0]?.id??""),i.vehiclesByLine=new Map,i.rawVehicles=[],i.arrivalsCache.clear(),i.alerts=[],i.error="",i.fetchedAt="",i.insightsTickerIndex=0,i.vehicleGhosts=new Map}async function Ma(e,{updateUrl:t=!0,preserveDialog:a=!1}={}){if(!i.systemsById.has(e)||i.activeSystemId===e){t&&Et(i.activeSystemId);return}Da(e),a||wa(),ut(),pt(),j(),t&&Et(e),await mt()}async function Ri(){for(let a=0;a<=4;a+=1){let n=null,s=null;try{n=await fetch(Va,{cache:"no-store"}),s=await n.json()}catch(o){if(a===4)throw o;await ae(1e3*2**a);continue}if(!n.ok){if(a===4)throw new Error(`Static data load failed with ${n.status}`);await ae(1e3*2**a);continue}const r=s.systems??[];i.systemsById=new Map(r.map(o=>[o.id,o])),i.layoutsBySystem=new Map(r.map(o=>[o.id,new Map(o.lines.map(l=>[l.id,ri(l)]))])),Da(ba());return}}function zi(e){const t=[...new Set((e.allAffects??[]).map(n=>n.routeId).filter(Boolean))],a=i.lines.filter(n=>t.includes(getLineRouteId(n))).map(n=>n.id);return a.length?{id:e.id,effect:e.reason??"SERVICE ALERT",severity:e.severity??"INFO",title:e.summary?.value??c("serviceAlert"),description:e.description?.value??"",url:e.url?.value??"",lineIds:a,stopIds:[...new Set((e.allAffects??[]).map(n=>n.stopId).filter(Boolean))]}:null}async function mt(){try{const e=await ia(Vn(),"Realtime");i.error="",i.fetchedAt=new Date().toISOString(),i.rawVehicles=e.data.list??[],i.alerts=(e.data.references?.situations??[]).map(zi).filter(Boolean);const t=new Map((e.data.references?.trips??[]).map(s=>[s.id,s]));for(const s of i.lines){const r=i.layouts.get(s.id),o=i.rawVehicles.map(l=>Dn(l,s,r,t,{language:i.language,copyValue:c})).filter(Boolean);i.vehiclesByLine.set(s.id,o),$i(s.id,o)}const a=computeSystemSummaryMetrics(buildInsightsItems(i.lines)),n=i.systemSnapshots.get(i.activeSystemId);i.systemSnapshots.set(i.activeSystemId,{previous:n?.current??null,current:a})}catch(e){i.error=c("realtimeOffline"),console.error(e)}j()}async function Oi(){ua(ei()),da(Qn()),Nt(),await Ri(),j(),await mt(),await Rt(),window.addEventListener("popstate",()=>{Rt().catch(console.error)});const e=()=>{const a=i.compactLayout;if(Nt(),Pe(),a!==i.compactLayout){j();return}Oe()};window.addEventListener("resize",e),window.visualViewport?.addEventListener("resize",e),new ResizeObserver(()=>{Oe()}).observe(J),Ei(),Ni(),window.setInterval(()=>{xa(),fi(),li()},1e3)}Oi().catch(e=>{ke.textContent=c("statusFail"),Xe.textContent=e.message});
