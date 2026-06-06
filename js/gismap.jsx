/* ============================================================
   NDAP — GIS MAP COMPONENT (India real map)
   ============================================================ */

/* ---------- State lat/lon data ---------- */
const INDIA_STATES = [
  { id:"jk", name:"J&K / Ladakh",     lat:33.7782, lng:76.5762 },
  { id:"hp", name:"Himachal Pradesh",  lat:31.1048, lng:77.1665 },
  { id:"pb", name:"Punjab",            lat:31.1471, lng:75.3412 },
  { id:"hr", name:"Haryana",           lat:29.0588, lng:76.0856 },
  { id:"dl", name:"Delhi",             lat:28.7041, lng:77.1025 },
  { id:"uk", name:"Uttarakhand",       lat:30.0668, lng:79.0193 },
  { id:"up", name:"Uttar Pradesh",     lat:26.8467, lng:80.9462 },
  { id:"rj", name:"Rajasthan",         lat:27.0238, lng:74.2179 },
  { id:"br", name:"Bihar",             lat:25.0961, lng:85.3131 },
  { id:"jh", name:"Jharkhand",         lat:23.6102, lng:85.2799 },
  { id:"wb", name:"West Bengal",       lat:22.9868, lng:87.8550 },
  { id:"as", name:"Assam",             lat:26.2006, lng:92.9376 },
  { id:"ne", name:"North East",        lat:25.5736, lng:93.2473 },
  { id:"od", name:"Odisha",            lat:20.9517, lng:85.0985 },
  { id:"mp", name:"Madhya Pradesh",    lat:22.9734, lng:78.6569 },
  { id:"cg", name:"Chhattisgarh",      lat:21.2787, lng:81.8661 },
  { id:"gj", name:"Gujarat",           lat:22.2587, lng:71.1924 },
  { id:"mh", name:"Maharashtra",       lat:19.7515, lng:75.7139 },
  { id:"ts", name:"Telangana",         lat:18.1124, lng:79.0193 },
  { id:"ap", name:"Andhra Pradesh",    lat:15.9129, lng:79.7400 },
  { id:"ka", name:"Karnataka",         lat:15.3173, lng:75.7139 },
  { id:"ga", name:"Goa",               lat:15.2993, lng:74.1240 },
  { id:"kl", name:"Kerala",            lat:10.8505, lng:76.2711 },
  { id:"tn", name:"Tamil Nadu",        lat:11.1271, lng:78.6569 }
];

/* ---------- Metric definitions + data ---------- */
const GIS_METRICS = {
  health: {
    label:"Health Infrastructure (Hospitals/1L pop)", source:"HMIS 2025", unit:"hospitals", fmt:(v)=>v.toFixed(1),
    min:0.5, max:3.5,
    lo:[248,240,215], hi:[20,112,80],
    values:{ jk:2.1, hp:3.2, pb:1.8, hr:1.6, dl:2.5, uk:2.4, up:0.8,
             rj:1.2, br:0.6, jh:0.9, wb:1.4, as:1.3, ne:2.0,
             od:1.5, mp:1.1, cg:1.4, gj:2.1, mh:1.9, ts:1.8,
             ap:1.7, ka:2.2, ga:3.4, kl:3.1, tn:2.8 }
  },
  edu: {
    label:"Primary Education Funding", source:"UDISE+ 2024", unit:"₹ per student", fmt:(v)=>"₹"+v.toLocaleString(),
    min:4000, max:18000,
    lo:[218,232,250], hi:[11,37,82],
    values:{ jk:12400, hp:16500, pb:9800, hr:8500, dl:15200, uk:13100, up:5400,
             rj:6200, br:4100, jh:5200, wb:7100, as:6800, ne:11500,
             od:7500, mp:6100, cg:6900, gj:9200, mh:8900, ts:8100,
             ap:7800, ka:9500, ga:17200, kl:16800, tn:11200 }
  },
  poverty: {
    label:"Poverty Headcount Ratio", source:"NITI Aayog MPI", unit:"%", fmt:(v)=>v.toFixed(1)+"%",
    min:0, max:50,
    lo:[252,242,218], hi:[148,78,12],
    values:{ jk:4.8, hp:4.9, pb:4.7, hr:6.0, dl:2.1, uk:11.0, up:22.9,
             rj:15.3, br:33.7, jh:28.8, wb:11.8, as:19.3, ne:16.0,
             od:15.6, mp:20.6, cg:16.3, gj:11.6, mh:7.7, ts:5.8,
             ap:6.0, ka:7.5, ga:0.8, kl:0.5, tn:2.2 }
  },
};

function metricColor(v, cfg){
  if(v===null||v===undefined) return "#e8edf4";
  const t = Math.min(1, Math.max(0, (v-cfg.min)/(cfg.max-cfg.min)));
  const r=Math.round(cfg.lo[0]+(cfg.hi[0]-cfg.lo[0])*t);
  const g=Math.round(cfg.lo[1]+(cfg.hi[1]-cfg.lo[1])*t);
  const b=Math.round(cfg.lo[2]+(cfg.hi[2]-cfg.lo[2])*t);
  return `rgb(${r},${g},${b})`;
}

function MapLegend({ cfg }){
  const steps=6;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <div style={{fontSize:10.5,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.6,marginBottom:2}}>{cfg.unit}</div>
      <div style={{display:"flex",alignItems:"center",height:12,borderRadius:4,overflow:"hidden",width:120}}>
        {Array.from({length:steps}).map((_,i)=>{
          const t=i/(steps-1);
          const v=cfg.min+t*(cfg.max-cfg.min);
          return <div key={i} style={{flex:1,height:"100%",background:metricColor(v,cfg)}}/>;
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10.5,color:"var(--muted)",width:120}}>
        <span>{cfg.fmt(cfg.min)}</span><span>{cfg.fmt(cfg.max)}</span>
      </div>
    </div>
  );
}

function GISView(){
  const [metric,setMetric]=useState("health");
  const [selected,setSelected]=useState("mh");
  const mapRef=useRef(null);
  const layerGroupRef=useRef(null);

  const cfg=GIS_METRICS[metric];
  const selState=INDIA_STATES.find(s=>s.id===selected);
  const selVal=selState?cfg.values[selState.id]:null;

  const ranked=INDIA_STATES
    .map(s=>({...s,v:cfg.values[s.id]}))
    .filter(s=>s.v!=null)
    .sort((a,b)=>b.v-a.v);

  // Initialize Leaflet
  useEffect(()=>{
    if(!window.L) return;
    if(!mapRef.current){
      const m=L.map("leaflet-map", { attributionControl: false }).setView([22.5, 80], 5);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 10
      }).addTo(m);
      layerGroupRef.current = L.layerGroup().addTo(m);
      mapRef.current = m;
    }
  }, []);

  // Update markers
  useEffect(()=>{
    if(!mapRef.current || !layerGroupRef.current) return;
    layerGroupRef.current.clearLayers();
    INDIA_STATES.forEach(s => {
      const v=cfg.values[s.id];
      const color=metricColor(v,cfg);
      const isS=selected===s.id;
      const marker = L.circleMarker([s.lat, s.lng], {
        radius: isS?14:10,
        fillColor: color,
        color: isS?"#0b2552":"#fff",
        weight: isS?3:1,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(layerGroupRef.current);
      
      marker.bindTooltip(`<b>${s.name}</b><br/>${v!=null?cfg.fmt(v):"No data"}`, { direction:"top", offset:[0,-10] });
      marker.on("click", ()=>setSelected(s.id));
    });
  }, [metric, selected]);

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",height:"100%",gap:0}}>
      {/* map area */}
      <div style={{position:"relative",background:"#e3e8ee",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column"}}>
        {/* toolbar */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:"1px solid var(--border)",background:"var(--surface)",flexWrap:"wrap",zIndex:10}}>
          <span style={{fontSize:12,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.6}}>Layer</span>
          <div style={{display:"flex",gap:6}}>
            {Object.entries(GIS_METRICS).map(([k,m])=>(
              <button key={k} onClick={()=>setMetric(k)} style={{fontSize:12,fontWeight:600,padding:"5px 12px",borderRadius:20,border:"1px solid",cursor:"pointer",transition:"all .15s",
                borderColor:metric===k?"var(--blue)":"var(--border)",background:metric===k?"var(--blue)":"#fff",color:metric===k?"#fff":"var(--muted)"}}>
                {k==="health"?"Health":k==="edu"?"Education":"Poverty"}
              </button>
            ))}
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
            <MapLegend cfg={cfg}/>
          </div>
        </div>
        
        <div id="leaflet-map" style={{flex:1, width:"100%"}}></div>
      </div>

      {/* right panel */}
      <div style={{overflowY:"auto",padding:"18px 18px",background:"var(--surface)",display:"flex",flexDirection:"column",gap:18}}>
        {/* selected state card */}
        <div style={{borderRadius:"var(--r-lg)",border:"2px solid var(--navy-800)",overflow:"hidden"}}>
          <div style={{background:"var(--navy-800)",padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:14,height:14,borderRadius:3,background:selVal!=null?metricColor(selVal,cfg):"#dde3ec",flexShrink:0}}/>
            <span style={{fontWeight:700,fontSize:14,color:"#fff"}}>{selState?.name||"—"}</span>
          </div>
          <div style={{padding:"14px"}}>
            <div style={{fontSize:11.5,color:"var(--muted)",marginBottom:3}}>{cfg.label}</div>
            <div className="tnum" style={{fontSize:30,fontWeight:700,color:"var(--ink)",letterSpacing:-.5}}>
              {selVal!=null?cfg.fmt(selVal):"No data"}</div>
            <div style={{fontSize:11,color:"var(--muted-2)",marginTop:3}}>Source: {cfg.source}</div>
            <div style={{height:3,background:selVal!=null?metricColor(selVal,cfg):"var(--border)",borderRadius:3,margin:"10px 0 6px"}}/>
            {selVal!=null && (()=>{
              const rank=ranked.findIndex(s=>s.id===selected)+1;
              return <div style={{fontSize:12,color:"var(--muted)"}}>
                <span className="tnum" style={{fontWeight:700,color:"var(--ink)"}}>{rank}</span> of {ranked.length} states · {rank<=8?"above average":"below average"}</div>;
            })()}
          </div>
        </div>

        {/* top / bottom 5 */}
        <div>
          <div style={{fontSize:11.5,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,color:"var(--muted)",marginBottom:10}}>Rankings · {cfg.label}</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {ranked.slice(0,5).map((s,i)=>(
              <div key={s.id} onClick={()=>setSelected(s.id)} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",
                padding:"7px 9px",borderRadius:"var(--r)",background:selected===s.id?"var(--blue-50)":"transparent",
                border:`1px solid ${selected===s.id?"var(--blue)":"transparent"}`}}>
                <span className="tnum" style={{width:16,fontSize:11,fontWeight:700,color:"var(--green)",flexShrink:0}}>{i+1}</span>
                <div style={{flex:1,height:7,background:"var(--surface-3)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${((s.v-cfg.min)/(cfg.max-cfg.min))*100}%`,background:metricColor(s.v,cfg),borderRadius:4}}/>
                </div>
                <span className="tnum" style={{fontSize:12,fontWeight:600,color:"var(--ink)",width:48,textAlign:"right",flexShrink:0}}>{cfg.fmt(s.v)}</span>
                <span style={{fontSize:11.5,color:"var(--ink-2)",width:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
              </div>
            ))}
            <div style={{height:1,background:"var(--border)",margin:"4px 0"}}/>
            {ranked.slice(-3).map((s,i)=>(
              <div key={s.id} onClick={()=>setSelected(s.id)} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",
                padding:"7px 9px",borderRadius:"var(--r)",background:selected===s.id?"var(--red-50)":"transparent",
                border:`1px solid ${selected===s.id?"var(--red)":"transparent"}`}}>
                <span className="tnum" style={{width:16,fontSize:11,fontWeight:700,color:"var(--red)",flexShrink:0}}>{ranked.length-2+i}</span>
                <div style={{flex:1,height:7,background:"var(--surface-3)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${((s.v-cfg.min)/(cfg.max-cfg.min))*100}%`,background:metricColor(s.v,cfg),borderRadius:4}}/>
                </div>
                <span className="tnum" style={{fontSize:12,fontWeight:600,color:"var(--ink)",width:48,textAlign:"right",flexShrink:0}}>{cfg.fmt(s.v)}</span>
                <span style={{fontSize:11.5,color:"var(--ink-2)",width:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* data source */}
        <div style={{padding:"11px 13px",background:"var(--surface-2)",borderRadius:"var(--r)",border:"1px solid var(--border)",fontSize:12}}>
          <div style={{fontWeight:600,color:"var(--ink-2)",marginBottom:4,display:"flex",alignItems:"center",gap:6}}><Icon name="cite" size={13} style={{color:"var(--blue)"}}/>Source</div>
          <div style={{color:"var(--muted)",lineHeight:1.5}}>{cfg.source} · {cfg.label}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GISView });
