/* ============================================================
   NDAP — SHARED COMPONENTS  (icons, logo, primitives, charts)
   ============================================================ */
const { useState, useEffect, useRef, useMemo } = React;

/* ---------------- ICONS (stroke, 20x20 grid) ---------------- */
const PATHS = {
  home:"M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5",
  ask:"M4 5h16v11H8l-4 3.5V5Z",
  data:"M4 6c0-1.4 3.6-2.5 8-2.5S20 4.6 20 6s-3.6 2.5-8 2.5S4 7.4 4 6Zm0 0v12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V6M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5",
  studio:"M5 3h9l5 5v13H5V3Zm9 0v5h5M8.5 13h7M8.5 16.5h7",
  analytics:"M4 20V4M20 20H4M8 20v-6M12 20V8M16 20v-9",
  gov:"M4 9.5 12 4l8 5.5M5 9.5h14M6.5 9.5V18M11 9.5V18M13 9.5V18M17.5 9.5V18M4 18h16M4 20.5h16",
  search:"M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4",
  mic:"M12 3.5a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3ZM6 11a6 6 0 0 0 12 0M12 17v3.5M9 20.5h6",
  send:"M4 12 20 4l-5 16-3.5-6.5L4 12Z",
  cite:"M7 4h7l4 4v12H7V4Zm7 0v4h4M9.5 12.5h5M9.5 16h3",
  code:"M8 7 3.5 12 8 17M16 7l4.5 5L16 17M13.5 5l-3 14",
  chart:"M4 20V4M20 20H4M7 17l4-5 3 3 4-7",
  globe:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c-2.6 2-2.6 16 0 18m0-18c2.6 2 2.6 16 0 18M3.5 9h17M3.5 15h17",
  warn:"M12 4 22 20H2L12 4Zm0 6v5m0 2.5v.2",
  shield:"M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6l-7-3Zm-2.5 9 1.8 1.8L15 9.5",
  check:"M5 12.5 10 17l9-10",
  branch:"M7 4v9m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm10-4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 6c0 4-3 5-7 5",
  layers:"M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5",
  doc:"M6 3h8l4 4v14H6V3Zm8 0v4h4M9 12h6M9 15.5h6M9 8.5h3",
  download:"M12 3v11m0 0 4-4m-4 4-4-4M5 19h14",
  star:"M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z",
  close:"M5 5l14 14M19 5 5 19",
  plus:"M12 5v14M5 12h14",
  filter:"M4 5h16l-6 7v6l-4 2v-8L4 5Z",
  clock:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5V12l4 2.5",
  rupee:"M7 4h10M7 8h10M16 4c0 5-4 6-7 6 4 0 7 1 7 6M7 10l8 8",
  bolt:"M13 3 5 13h6l-1 8 8-10h-6l1-8Z",
  link:"M9 15l6-6M8.5 10.5 7 12a3.5 3.5 0 0 0 5 5l1.5-1.5M15.5 13.5 17 12a3.5 3.5 0 0 0-5-5l-1.5 1.5",
  drag:"M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",
  refresh:"M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4",
  chevR:"M9 5l7 7-7 7",
  chevL:"M15 19l-7-7 7-7",
  chevD:"M5 9l7 7 7-7",
  table:"M4 5h16v14H4V5Zm0 5h16M4 14.5h16M9.5 10v9M14.5 10v9",
  pin:"M12 3a5 5 0 0 0-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 0 0-5-5Zm0 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z",
  eye:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 2.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z",
  upload:"M5 16v3h14v-3M12 14V3m0 0L8 7m4-4 4 4",
  users:"M8.5 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM2.5 19v-1.5C2.5 15 5 13.5 8.5 13.5s6 1.5 6 4V19M16 4.7a3.2 3.2 0 0 1 0 6.1m1.5 2.9c2.4.5 4 1.9 4 3.8V19",
  lock:"M6 10V8a6 6 0 0 1 12 0v2M5 10h14v10H5V10Zm7 4.5v2.5",
  share:"M7 13.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm10-6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 14a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM9.2 10.3l5.6-3.1M9.2 13.2l5.6 3",
  sparkle:"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16Z",
  target:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  edit:"M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
};
function Icon({ name, size=20, stroke=1.7, style, className }){
  const d = PATHS[name] || "";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className} aria-hidden="true">
      {d.split("M").filter(Boolean).map((seg,i)=><path key={i} d={"M"+seg} />)}
    </svg>
  );
}

/* ---------------- LOGO / EMBLEM ---------------- */
/* Abstract gov emblem: 24-spoke chakra ring (original, geometric placeholder) */
function Emblem({ size=34, color="#c98a2b", ring="#0b2552" }){
  const c = size/2, spokes = 24;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill={ring}/>
      <circle cx="50" cy="50" r="33" fill="none" stroke={color} strokeWidth="3"/>
      {Array.from({length:spokes}).map((_,i)=>{
        const a=(i/spokes)*Math.PI*2;
        return <line key={i} x1={50+6*Math.cos(a)} y1={50+6*Math.sin(a)}
          x2={50+33*Math.cos(a)} y2={50+33*Math.sin(a)} stroke={color} strokeWidth="1.6"/>;
      })}
      <circle cx="50" cy="50" r="7" fill={color}/>
    </svg>
  );
}
function Wordmark({ lang="en", compact=false }){
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <img src="https://ndap.niti.gov.in/static/assets/images/india-emblem-2.png" alt="India Emblem" width={compact?24:34} height={compact?36:51} />
      {!compact && (
        <div style={{lineHeight:1.15}}>
          <div style={{fontWeight:700,fontSize:14,letterSpacing:.2,color:"#fff"}}>National Data and</div>
          <div style={{fontWeight:700,fontSize:14,letterSpacing:.2,color:"#fff"}}>Analytics Platform</div>
        </div>
      )}
    </div>
  );
}

/* ---------------- PRIMITIVES ---------------- */
function Badge({ children, tone="neutral", soft=true, style }){
  const T = {
    neutral:["#5a6b85","#eef1f6"], blue:["#205bbf","#eaf1fc"], green:["#15735a","#e1f1ea"],
    saffron:["#a96f14","#f7edda"], red:["#a93226","#fbe9e7"], amber:["#9a6a06","#fbf1d8"],
    navy:["#0b2552","#e4e9f3"],
  }[tone] || ["#5a6b85","#eef1f6"];
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11.5,fontWeight:600,
      padding:"2px 8px",borderRadius:20,color:soft?T[0]:"#fff",background:soft?T[1]:T[0],
      letterSpacing:.2,whiteSpace:"nowrap",...style}}>{children}</span>
  );
}
function Dot({ color="#1b8a6b", pulse }){
  return <span style={{width:7,height:7,borderRadius:8,background:color,display:"inline-block",
    animation:pulse?"pulseDot 1.4s infinite":"none",flexShrink:0}}/>;
}
function Card({ children, style, pad=18, hover, onClick }){
  const [h,setH]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",
        padding:pad,boxShadow:h&&hover?"var(--sh-2)":"var(--sh-1)",transition:"box-shadow .18s, transform .18s, border-color .18s",
        transform:h&&hover?"translateY(-2px)":"none",cursor:onClick?"pointer":"default",
        borderColor:h&&hover?"var(--border-2)":"var(--border)",...style}}>
      {children}
    </div>
  );
}
function SectionTitle({ kicker, title, right }){
  return (
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:14,gap:16}}>
      <div>
        {kicker && <div style={{fontSize:11,fontWeight:600,letterSpacing:1.2,textTransform:"uppercase",color:"var(--saffron)",marginBottom:5}}>{kicker}</div>}
        <h2 style={{margin:0,fontSize:19,fontWeight:600,color:"var(--ink)",letterSpacing:-.2}}>{title}</h2>
      </div>
      {right}
    </div>
  );
}
function StatTile({ k, v, sub, d, up, accent="var(--blue)" }){
  return (
    <Card pad={16} style={{display:"flex",flexDirection:"column",gap:3}}>
      <div style={{fontSize:12,color:"var(--muted)",fontWeight:500}}>{k}</div>
      <div className="tnum" style={{fontSize:26,fontWeight:700,color:"var(--ink)",letterSpacing:-.5,lineHeight:1.1}}>{v}</div>
      {sub && <div style={{fontSize:11.5,color:"var(--muted-2)"}}>{sub}</div>}
      {d && <div style={{fontSize:12,fontWeight:600,color:up?"var(--green)":"var(--red)",display:"flex",alignItems:"center",gap:4,marginTop:2}}>
        <span>{up?"▲":"▼"}</span>{d}</div>}
      <div style={{height:3,background:accent,opacity:.85,borderRadius:3,marginTop:8,width:36}}/>
    </Card>
  );
}

/* ---------------- CHARTS ---------------- */
/* Vertical bar chart, optionally clickable for drill-down */
function BarChart({ data, height=190, color="var(--blue)", onBar, active, fmt=(v)=>v, unit }){
  const max = Math.max(...data.map(d=>d.v))*1.12;
  return (
    <div>
      <div style={{display:"flex",alignItems:"flex-end",gap:10,height,padding:"0 2px"}}>
        {data.map((d,i)=>{
          const isA = active===d.k;
          return (
            <div key={i} onClick={onBar?()=>onBar(d):undefined}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:7,
                cursor:onBar?"pointer":"default",height:"100%",justifyContent:"flex-end"}}>
              <div className="tnum" style={{fontSize:11.5,fontWeight:600,color:isA?"var(--blue-700)":"var(--ink-2)"}}>{fmt(d.v)}</div>
              <div title={d.k} style={{width:"100%",maxWidth:46,height:`${(d.v/max)*100}%`,
                background:isA?"var(--blue-700)":(d.color||color),borderRadius:"var(--r-sm) var(--r-sm) 0 0",
                transformOrigin:"bottom",animation:`growBar .6s cubic-bezier(.2,.7,.3,1) ${i*0.05}s both`,
                boxShadow:isA?"0 0 0 3px var(--blue-50)":"none",transition:"background .15s"}}/>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:10,padding:"8px 2px 0",borderTop:"1px solid var(--border)"}}>
        {data.map((d,i)=><div key={i} style={{flex:1,textAlign:"center",fontSize:11,color:active===d.k?"var(--ink)":"var(--muted)",fontWeight:active===d.k?600:500}}>{d.k}</div>)}
      </div>
      {unit && <div style={{fontSize:10.5,color:"var(--muted-2)",marginTop:6}}>{unit}</div>}
    </div>
  );
}

/* Area line chart with animated draw */
function AreaLine({ data, height=150, color="var(--blue)", fill="rgba(46,107,214,.12)", showDots }){
  const w=560, h=height, pad=8;
  const max=Math.max(...data)*1.08, min=Math.min(...data)*0.96;
  const xs=(i)=> pad + i*((w-pad*2)/(data.length-1));
  const ys=(v)=> h-pad - ((v-min)/(max-min))*(h-pad*2);
  const line=data.map((v,i)=>`${i?"L":"M"}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(" ");
  const area=`${line} L ${xs(data.length-1).toFixed(1)} ${h-pad} L ${pad} ${h-pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} preserveAspectRatio="none" style={{display:"block"}}>
      <path d={area} fill={fill}/>
      <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      {showDots && data.map((v,i)=><circle key={i} cx={xs(i)} cy={ys(v)} r="2.4" fill={color}/>)}
    </svg>
  );
}

/* Horizontal labelled bars (rankings / segments) */
function HBars({ data, color="var(--blue)", fmt=(v)=>v, max:mx }){
  const max = mx || Math.max(...data.map(d=>d.v))*1.05;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:11}}>
      {data.map((d,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:160,fontSize:12.5,color:"var(--ink-2)",textAlign:"right",flexShrink:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.k}</div>
          <div style={{flex:1,height:18,background:"var(--surface-3)",borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(d.v/max)*100}%`,background:d.color||color,borderRadius:4,
              animation:`growW .8s cubic-bezier(.2,.7,.3,1) ${i*0.06}s both`}}/>
          </div>
          <div className="tnum" style={{width:54,fontSize:12.5,fontWeight:600,color:"var(--ink)"}}>{fmt(d.v)}</div>
        </div>
      ))}
      <style>{`@keyframes growW{from{transform:translateX(-10px)}to{transform:none}}`}</style>
    </div>
  );
}

/* Donut chart */
function Donut({ data, size=150, thickness=22, colors }){
  const pal = colors || ["#2e6bd6","#0b2552","#c98a2b","#1b8a6b","#8593a9"];
  const total=data.reduce((s,d)=>s+d.v,0);
  const r=(size-thickness)/2, c=2*Math.PI*r; let off=0;
  return (
    <div style={{display:"flex",alignItems:"center",gap:18}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
        {data.map((d,i)=>{
          const frac=d.v/total, len=frac*c;
          const el=<circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={pal[i%pal.length]}
            strokeWidth={thickness} strokeDasharray={`${len} ${c-len}`} strokeDashoffset={-off}
            style={{transition:"stroke-dasharray .6s"}}/>;
          off+=len; return el;
        })}
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {data.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12.5}}>
            <span style={{width:10,height:10,borderRadius:3,background:pal[i%pal.length]}}/>
            <span style={{color:"var(--ink-2)",minWidth:62}}>{d.k}</span>
            <span className="tnum" style={{fontWeight:600,color:"var(--ink)"}}>{d.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  Icon, Emblem, Wordmark, Badge, Dot, Card, SectionTitle, StatTile,
  BarChart, AreaLine, HBars, Donut,
});
