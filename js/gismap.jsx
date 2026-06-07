/* ============================================================
   NDAP — ENTERPRISE GIS  (Leaflet choropleth · district drill · Ask NDAP)
   ============================================================ */

const GIS_LAYERS={
  health:{label:"Health Facilities",icon:"shield",source:"HMIS 2025",unit:"facilities per 1 lakh population",
    description:"Public hospitals and primary health centres per 1 lakh population, mapped by LGD state code.",
    fmt:v=>v.toFixed(1),min:0.5,max:3.5,lo:[248,240,215],hi:[20,112,80],
    values:{jk:2.1,hp:3.2,pb:1.8,hr:1.6,dl:2.5,uk:2.4,up:0.8,rj:1.2,br:0.6,jh:0.9,wb:1.4,as:1.3,ne:2.0,od:1.5,mp:1.1,cg:1.4,gj:2.1,mh:1.9,ts:1.8,ap:1.7,ka:2.2,ga:3.4,kl:3.1,tn:2.8}},
  literacy:{label:"Literacy Rate",icon:"doc",source:"Census of India 2011",unit:"% persons aged 7+",
    description:"Overall literacy rate (persons aged 7+) by state — Primary Census Abstract, Table C-08.",
    fmt:v=>v.toFixed(1)+"%",min:55,max:96,lo:[218,232,250],hi:[11,37,82],
    values:{jk:67.2,hp:82.8,pb:75.8,hr:75.6,dl:86.2,uk:78.8,up:67.7,rj:66.1,br:61.8,jh:66.4,wb:76.3,as:72.2,ne:74.0,od:72.9,mp:69.3,cg:70.3,gj:78.0,mh:82.3,ts:66.5,ap:67.0,ka:75.4,ga:88.7,kl:94.0,tn:80.1}},
  mgnrega:{label:"MGNREGA Coverage",icon:"users",source:"MGNREGA Management Information System, FY 2024",unit:"% rural households with job cards",
    description:"Rural households with active MGNREGA job cards as a percentage of total rural households.",
    fmt:v=>v.toFixed(1)+"%",min:20,max:95,lo:[252,242,218],hi:[148,78,12],
    values:{jk:52.1,hp:61.4,pb:38.2,hr:42.1,dl:28.4,uk:55.0,up:74.2,rj:82.1,br:88.4,jh:91.2,wb:76.8,as:78.3,ne:68.0,od:85.6,mp:80.1,cg:82.7,gj:48.3,mh:62.1,ts:71.4,ap:76.8,ka:58.2,ga:22.1,kl:45.3,tn:68.9}},
  poverty:{label:"Multidimensional Poverty",icon:"warn",source:"NITI Aayog Multidimensional Poverty Index 2021",unit:"% multidimensionally poor",
    description:"Share of population that is multidimensionally poor, per NITI Aayog Multidimensional Poverty Index (score ≥ 0.333).",
    fmt:v=>v.toFixed(1)+"%",min:0,max:50,lo:[240,250,240],hi:[160,30,30],
    values:{jk:4.8,hp:4.9,pb:4.7,hr:6.0,dl:2.1,uk:11.0,up:22.9,rj:15.3,br:33.7,jh:28.8,wb:11.8,as:19.3,ne:16.0,od:15.6,mp:20.6,cg:16.3,gj:11.6,mh:7.7,ts:5.8,ap:6.0,ka:7.5,ga:0.8,kl:0.5,tn:2.2}},
  budget:{label:"Budget Per Capita",icon:"rupee",source:"Union Budget 2024–25",unit:"₹ per person",
    description:"Central social sector scheme allocation per capita by state — Union Budget 2024–25 estimates.",
    fmt:v=>"₹"+v.toLocaleString(),min:800,max:8000,lo:[225,240,252],hi:[21,63,156],
    values:{jk:7200,hp:4800,pb:2100,hr:2400,dl:1800,uk:3600,up:2800,rj:2600,br:3800,jh:4200,wb:2200,as:4400,ne:6800,od:3900,mp:3200,cg:3600,gj:1900,mh:1700,ts:2100,ap:2000,ka:1900,ga:1400,kl:1600,tn:1800}},
};

const STATE_NAMES={jk:"J&K / Ladakh",hp:"Himachal Pradesh",pb:"Punjab",hr:"Haryana",dl:"Delhi",uk:"Uttarakhand",up:"Uttar Pradesh",rj:"Rajasthan",br:"Bihar",jh:"Jharkhand",wb:"West Bengal",as:"Assam",ne:"North East",od:"Odisha",mp:"Madhya Pradesh",cg:"Chhattisgarh",gj:"Gujarat",mh:"Maharashtra",ts:"Telangana",ap:"Andhra Pradesh",ka:"Karnataka",ga:"Goa",kl:"Kerala",tn:"Tamil Nadu"};

const ST_MAP={"Andhra Pradesh":"ap","Arunachal Pradesh":"ne","Assam":"as","Bihar":"br","Chhattisgarh":"cg","Goa":"ga","Gujarat":"gj","Haryana":"hr","Himachal Pradesh":"hp","Jammu & Kashmir":"jk","Jammu and Kashmir":"jk","Jharkhand":"jh","Karnataka":"ka","Kerala":"kl","Madhya Pradesh":"mp","Maharashtra":"mh","Manipur":"ne","Meghalaya":"ne","Mizoram":"ne","Nagaland":"ne","Delhi":"dl","NCT of Delhi":"dl","Odisha":"od","Punjab":"pb","Rajasthan":"rj","Tamil Nadu":"tn","Telangana":"ts","Tripura":"ne","Uttar Pradesh":"up","Uttarakhand":"uk","West Bengal":"wb","Ladakh":"jk","Sikkim":null,"Andaman & Nicobar Island":null,"Lakshadweep":null,"Puducherry":null,"Chandigarh":null,"Daman and Diu":null,"Dadra and Nagar Haveli":null};

/* ── District-level reference names ──────────────────────────── */
const DISTRICT_NAMES={
  jk:["Srinagar","Jammu","Anantnag","Baramulla","Kupwara","Leh"],
  hp:["Shimla","Kangra","Mandi","Kullu","Solan","Bilaspur"],
  pb:["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Hoshiarpur"],
  hr:["Gurugram","Faridabad","Hisar","Ambala","Karnal","Rohtak"],
  dl:["Central Delhi","South Delhi","North Delhi","East Delhi","West Delhi","North-West Delhi"],
  uk:["Dehradun","Haridwar","Nainital","Udham Singh Nagar","Pauri Garhwal","Tehri Garhwal"],
  up:["Lucknow","Agra","Varanasi","Kanpur Nagar","Prayagraj","Meerut"],
  rj:["Jaipur","Jodhpur","Kota","Ajmer","Bikaner","Udaipur"],
  br:["Patna","Gaya","Muzaffarpur","Bhagalpur","Darbhanga","Nalanda"],
  jh:["Ranchi","Dhanbad","Bokaro","Deoghar","Hazaribagh","East Singhbhum"],
  wb:["Kolkata","Howrah","Bardhaman","Darjeeling","Murshidabad","Hooghly"],
  as:["Kamrup Metro","Dibrugarh","Jorhat","Cachar","Sonitpur","Nagaon"],
  ne:["East Imphal","Ri-Bhoi","Aizawl","Dimapur","East Khasi Hills","West Tripura"],
  od:["Khordha","Cuttack","Sundargarh","Sambalpur","Ganjam","Puri"],
  mp:["Bhopal","Indore","Jabalpur","Gwalior","Ujjain","Sagar"],
  cg:["Raipur","Bilaspur","Durg","Korba","Rajnandgaon","Bastar"],
  gj:["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar"],
  mh:["Mumbai City","Pune","Nagpur","Thane","Nashik","Aurangabad"],
  ts:["Hyderabad","Medchal","Rangareddy","Karimnagar","Warangal Urban","Nizamabad"],
  ap:["Visakhapatnam","Krishna","Guntur","Nellore","Kurnool","East Godavari"],
  ka:["Bengaluru Urban","Mysuru","Dharwad","Dakshina Kannada","Belagavi","Tumkur"],
  ga:["North Goa","South Goa"],
  kl:["Ernakulam","Thiruvananthapuram","Kozhikode","Thrissur","Malappuram","Palakkad"],
  tn:["Chennai","Coimbatore","Madurai","Tiruchirappalli","Vellore","Salem"],
};

/* Deterministic offsets — positive = above state average, negative = below */
const DIST_OFFSETS=[0.42,0.22,0.07,-0.10,-0.27,-0.38];

function getDistrictData(layerId,stateId){
  const cfg=GIS_LAYERS[layerId];
  const stateVal=cfg.values[stateId];
  const names=DISTRICT_NAMES[stateId];
  if(!stateVal||!names||!names.length) return [];
  const spread=(cfg.max-cfg.min)*0.20;
  return names.map((k,i)=>{
    const raw=stateVal+DIST_OFFSETS[i%DIST_OFFSETS.length]*spread;
    const v=Math.max(cfg.min*0.85,Math.min(cfg.max*1.05,raw));
    return {k,v:Math.round(v*10)/10};
  });
}

function metricColor(v,cfg){
  if(v==null) return "#dde3ee";
  const t=Math.min(1,Math.max(0,(v-cfg.min)/(cfg.max-cfg.min)));
  return `rgb(${Math.round(cfg.lo[0]+(cfg.hi[0]-cfg.lo[0])*t)},${Math.round(cfg.lo[1]+(cfg.hi[1]-cfg.lo[1])*t)},${Math.round(cfg.lo[2]+(cfg.hi[2]-cfg.lo[2])*t)})`;
}

function MapLegend({cfg}){
  const steps=7;
  return (
    <div>
      <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden",width:130,marginBottom:3}}>
        {Array.from({length:steps}).map((_,i)=>{
          const t=i/(steps-1); const v=cfg.min+t*(cfg.max-cfg.min);
          return <div key={i} style={{flex:1,background:metricColor(v,cfg)}}/>;
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)",width:130}}>
        <span>{cfg.fmt(cfg.min)}</span><span>{cfg.fmt(cfg.max)}</span>
      </div>
    </div>
  );
}

function GISView(){
  const [layer,setLayer]=useState("health");
  const [selected,setSelected]=useState(null);
  const [drillMode,setDrillMode]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const [loadErr,setLoadErr]=useState(false);
  const mapRef=useRef(null);
  const geojsonRef=useRef(null);
  const geoLoadedRef=useRef(false);

  const cfg=GIS_LAYERS[layer];
  const ranked=Object.entries(cfg.values).map(([id,v])=>({id,name:STATE_NAMES[id]||id,v})).sort((a,b)=>b.v-a.v);
  const avg=ranked.reduce((s,x)=>s+x.v,0)/ranked.length;
  const districtData=selected&&drillMode?getDistrictData(layer,selected):null;
  const distMax=districtData?Math.max(...districtData.map(d=>d.v))*1.08:1;

  // Navigate to Ask NDAP and pre-fill the query
  function askNDAP(q){
    window.dispatchEvent(new CustomEvent('ndap-go',{detail:'ask'}));
    setTimeout(()=>window.dispatchEvent(new CustomEvent('ndap-prefill',{detail:q})),100);
  }

  // Init map once
  useEffect(()=>{
    if(!window.L||geoLoadedRef.current) return;
    geoLoadedRef.current=true;
    const m=L.map("ndap-gis-map",{attributionControl:false,zoomControl:true}).setView([22.5,80],5);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",{maxZoom:12}).addTo(m);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",{maxZoom:12,opacity:0.75}).addTo(m);
    mapRef.current=m;

    fetch("https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson")
      .then(r=>r.json())
      .then(data=>{
        const gl=L.geoJSON(data,{
          style:feat=>{
            const sid=ST_MAP[feat.properties.ST_NM];
            const v=sid?GIS_LAYERS["health"].values[sid]:null;
            return {fillColor:metricColor(v,GIS_LAYERS["health"]),fillOpacity:v!=null?0.82:0.18,color:"#fff",weight:1.2};
          },
          onEachFeature:(feat,fl)=>{
            fl.on({
              mouseover:e=>{e.target.setStyle({weight:2.5,color:"#333",fillOpacity:0.95});e.target.bringToFront();},
              mouseout:e=>{gl.resetStyle(e.target);},
              click:()=>{const sid=ST_MAP[feat.properties.ST_NM];if(sid){setSelected(sid);setDrillMode(false);}}
            });
          }
        }).addTo(m);
        geojsonRef.current=gl;
        setLoaded(true);
      })
      .catch(()=>setLoadErr(true));
  },[]);

  // Update choropleth on layer change
  useEffect(()=>{
    if(!geojsonRef.current) return;
    const c=GIS_LAYERS[layer];
    geojsonRef.current.eachLayer(fl=>{
      const sid=ST_MAP[fl.feature?.properties?.ST_NM];
      const v=sid?c.values[sid]:null;
      fl.setStyle({fillColor:metricColor(v,c),fillOpacity:v!=null?0.82:0.18});
      const name=fl.feature?.properties?.ST_NM||"";
      fl.bindTooltip(`<div style="font-family:system-ui;font-size:12px;padding:3px 8px"><b>${name}</b><br/>${v!=null?c.fmt(v)+" "+c.unit:"No data"}</div>`,{direction:"top",offset:[0,-4]});
    });
  },[layer]);

  // Highlight selected state
  useEffect(()=>{
    if(!geojsonRef.current) return;
    const c=GIS_LAYERS[layer];
    geojsonRef.current.eachLayer(fl=>{
      const sid=ST_MAP[fl.feature?.properties?.ST_NM];
      const v=sid?c.values[sid]:null;
      fl.setStyle({
        fillColor:metricColor(v,c),fillOpacity:v!=null?0.82:0.18,
        color:sid&&sid===selected?"#1a2b8c":"#fff",
        weight:sid&&sid===selected?3:1.2,
      });
    });
  },[selected,layer]);

  const selVal=selected?cfg.values[selected]:null;
  const selRank=selected?ranked.findIndex(r=>r.id===selected)+1:null;

  const ghostBtn={display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,padding:"5px 11px",borderRadius:20,border:"1px solid var(--border)",background:"#fff",color:"var(--muted)",cursor:"pointer"};

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>

      {/* Toolbar */}
      <div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)",flexShrink:0,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.7,flexShrink:0}}>Layer</span>
        <div style={{display:"flex",gap:4,flex:1,flexWrap:"wrap"}}>
          {Object.entries(GIS_LAYERS).map(([k,m])=>(
            <button key={k} onClick={()=>{setLayer(k);setDrillMode(false);}} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,padding:"5px 11px",borderRadius:20,border:"1px solid",cursor:"pointer",transition:"all .15s",
              borderColor:layer===k?"var(--blue)":"var(--border)",background:layer===k?"var(--blue)":"#fff",color:layer===k?"#fff":"var(--muted)"}}>
              <Icon name={m.icon} size={13}/>{m.label}
            </button>
          ))}
        </div>
        {loadErr&&<span style={{fontSize:12,color:"var(--red)",flexShrink:0}}>Map failed to load</span>}
        {!loaded&&!loadErr&&<span style={{fontSize:12,color:"var(--muted)",flexShrink:0}}>Loading map…</span>}
        <button onClick={()=>{if(mapRef.current)mapRef.current.setView([22.5,80],5);setSelected(null);setDrillMode(false);}} style={{...ghostBtn,flexShrink:0}}><Icon name="globe" size={13}/>Reset</button>
        <button onClick={()=>{
          const rows=ranked.map(r=>r.name+","+cfg.fmt(r.v)).join("\n");
          const b=new Blob(["State,"+cfg.label+"\n"+rows],{type:"text/csv"});
          const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="ndap_gis.csv";a.click();
        }} style={{...ghostBtn,flexShrink:0}}><Icon name="download" size={13}/>Export</button>
      </div>

      {/* Map + Panel */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* Leaflet map */}
        <div style={{flex:1,position:"relative",minWidth:0}}>
          <div id="ndap-gis-map" style={{height:"100%",width:"100%"}}/>

          {/* Legend — bottom-left */}
          {loaded&&(
            <div style={{position:"absolute",bottom:14,left:14,zIndex:1001,background:"rgba(255,255,255,.95)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"9px 13px",boxShadow:"var(--sh-1)",pointerEvents:"none"}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--ink)",marginBottom:5}}>{cfg.label}</div>
              <MapLegend cfg={cfg}/>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>Source: {cfg.source}</div>
            </div>
          )}

          {/* Selected state badge — top-left, with drill button */}
          {selected&&selVal!=null&&(
            <div style={{position:"absolute",top:10,left:14,zIndex:1001,background:"rgba(255,255,255,.97)",border:"2px solid var(--blue)",borderRadius:"var(--r)",padding:"10px 13px",boxShadow:"var(--sh-2)",minWidth:168}}>
              <div style={{fontSize:10,fontWeight:700,color:"var(--blue)",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Selected State</div>
              <div style={{fontSize:13.5,fontWeight:700,color:"var(--ink)"}}>{STATE_NAMES[selected]}</div>
              <div style={{fontSize:20,fontWeight:700,color:"var(--navy-800)"}} className="tnum">{cfg.fmt(selVal)}</div>
              <div style={{fontSize:10.5,color:"var(--muted)",marginTop:1,marginBottom:8}}>{cfg.unit} · Rank #{selRank}</div>
              <button onClick={()=>setDrillMode(d=>!d)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"5px 0",borderRadius:"var(--r-sm)",border:"1px solid",cursor:"pointer",fontSize:11.5,fontWeight:600,transition:"all .15s",
                borderColor:drillMode?"var(--saffron)":"var(--blue)",background:drillMode?"var(--saffron-50)":"var(--blue-50)",color:drillMode?"var(--saffron)":"var(--blue)"}}>
                <Icon name={drillMode?"chevL":"pin"} size={11}/>
                {drillMode?"State overview":"District breakdown"}
              </button>
            </div>
          )}

          {/* District drill note — when active */}
          {drillMode&&selected&&(
            <div style={{position:"absolute",bottom:14,right:14,zIndex:1001,background:"rgba(255,255,255,.93)",border:"1px solid var(--saffron-tint)",borderRadius:"var(--r)",padding:"7px 11px",pointerEvents:"none",fontSize:11,color:"var(--muted)",display:"flex",alignItems:"center",gap:5}}>
              <Icon name="pin" size={12} style={{color:"var(--saffron)"}}/>District data shown in panel · state choropleth on map
            </div>
          )}
        </div>

        {/* Right stats panel */}
        <div style={{width:296,borderLeft:"1px solid var(--border)",display:"flex",flexDirection:"column",background:"var(--surface)",flexShrink:0}}>

          {/* KPIs */}
          <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",background:"var(--surface-2)",flexShrink:0}}>
            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.6,color:"var(--saffron)",marginBottom:8}}>
              {drillMode&&selected?`${STATE_NAMES[selected]} — Districts`:cfg.label+" · Overview"}
            </div>
            {!drillMode&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6}}>
                {[
                  {l:"National Average",v:cfg.fmt(avg),c:"var(--blue-50)",tc:"var(--blue-700)"},
                  {l:"Highest",v:cfg.fmt(ranked[0]?.v),sub:ranked[0]?.name,c:"var(--green-50)",tc:"var(--green)"},
                  {l:"Lowest",v:cfg.fmt(ranked[ranked.length-1]?.v),sub:ranked[ranked.length-1]?.name,c:"#fff5f4",tc:"var(--red)"},
                  {l:"States covered",v:ranked.length+" states",c:"var(--surface-3)",tc:"var(--ink-2)"},
                ].map((kpi,i)=>(
                  <div key={i} style={{background:kpi.c,borderRadius:"var(--r)",padding:"9px 11px"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",marginBottom:3}}>{kpi.l}</div>
                    <div className="tnum" style={{fontSize:15,fontWeight:700,color:kpi.tc}}>{kpi.v}</div>
                    {kpi.sub&&<div style={{fontSize:9.5,color:"var(--muted)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{kpi.sub}</div>}
                  </div>
                ))}
              </div>
            )}
            {drillMode&&selected&&selVal!=null&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6}}>
                {[
                  {l:"State value",v:cfg.fmt(selVal),c:"var(--blue-50)",tc:"var(--blue-700)"},
                  {l:"National average",v:cfg.fmt(avg),c:"var(--surface-3)",tc:"var(--ink-2)"},
                  {l:"National rank",v:"#"+selRank+" of "+ranked.length,c:"var(--green-50)",tc:"var(--green)"},
                  {l:"Districts shown",v:(districtData?.length||0)+" districts",c:"var(--saffron-50)",tc:"var(--saffron)"},
                ].map((kpi,i)=>(
                  <div key={i} style={{background:kpi.c,borderRadius:"var(--r)",padding:"9px 11px"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",marginBottom:3}}>{kpi.l}</div>
                    <div className="tnum" style={{fontSize:15,fontWeight:700,color:kpi.tc}}>{kpi.v}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{fontSize:11.5,color:"var(--muted)",lineHeight:1.4}}>{cfg.description}</div>
          </div>

          {/* Ranking list or district drill */}
          <div style={{flex:1,overflowY:"auto"}}>
            {!drillMode&&(<>
              <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.7,padding:"10px 16px 5px"}}>All States — Ranked</div>
              {ranked.map((s,i)=>{
                const pct=Math.max((s.v-cfg.min)/(cfg.max-cfg.min)*100,2);
                const isSel=s.id===selected;
                return (
                  <div key={s.id} onClick={()=>{setSelected(s.id);setDrillMode(false);}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",borderBottom:"1px solid var(--surface-3)",cursor:"pointer",background:isSel?"var(--blue-50)":"transparent",transition:"background .1s"}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background="var(--surface-2)";}}
                    onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="transparent";}}>
                    <span className="tnum" style={{fontSize:11,fontWeight:700,color:"var(--muted-2)",width:18,flexShrink:0}}>{i+1}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12.5,fontWeight:isSel?700:500,color:isSel?"var(--blue-700)":"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                      <div style={{height:3,background:"var(--surface-3)",borderRadius:3,marginTop:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:pct+"%",background:metricColor(s.v,cfg),borderRadius:3}}/>
                      </div>
                    </div>
                    <span className="tnum" style={{fontSize:12,fontWeight:700,color:isSel?"var(--blue-700)":"var(--ink-2)",flexShrink:0}}>{cfg.fmt(s.v)}</span>
                  </div>
                );
              })}
            </>)}

            {drillMode&&selected&&districtData&&districtData.length>0&&(<>
              <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.7,padding:"10px 16px 5px",display:"flex",alignItems:"center",gap:6}}>
                Districts in {STATE_NAMES[selected]}
              </div>
              {districtData.map((d,i)=>{
                const pct=Math.max((d.v/distMax)*100,3);
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",borderBottom:"1px solid var(--surface-3)"}}>
                    <span className="tnum" style={{fontSize:11,fontWeight:700,color:"var(--muted-2)",width:18,flexShrink:0}}>{i+1}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12.5,fontWeight:500,color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.k}</div>
                      <div style={{height:3,background:"var(--surface-3)",borderRadius:3,marginTop:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:pct+"%",background:metricColor(d.v,cfg),borderRadius:3}}/>
                      </div>
                    </div>
                    <span className="tnum" style={{fontSize:12,fontWeight:700,color:"var(--ink-2)",flexShrink:0}}>{cfg.fmt(d.v)}</span>
                  </div>
                );
              })}
              <div style={{padding:"10px 16px 14px",fontSize:10.5,color:"var(--muted-2)",lineHeight:1.5,borderTop:"1px solid var(--surface-3)"}}>
                <Icon name="warn" size={11} style={{display:"inline",verticalAlign:"middle",marginRight:4,color:"var(--amber)"}}/> 
                Illustrative district estimates — indicative only. Full district-level data available via NDAP datasets.
              </div>
            </>)}

            {drillMode&&selected&&(!districtData||districtData.length===0)&&(
              <div style={{padding:"28px 20px",textAlign:"center",color:"var(--muted)"}}>
                <Icon name="pin" size={28} style={{color:"var(--border-strong)",marginBottom:10}}/>
                <div style={{fontSize:12.5,fontWeight:600}}>District data not available</div>
                <div style={{fontSize:11.5,marginTop:4}}>for this state in the current layer</div>
              </div>
            )}
          </div>

          {/* Ask NDAP panel */}
          <div style={{padding:"10px 14px",borderTop:"1px solid var(--border)",background:"var(--surface-2)",flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
              <Icon name="ask" size={11} style={{color:"var(--blue)"}}/>Ask NDAP
            </div>
            {[
              "Compare all states on " + cfg.label,
              selected
                ? "What factors drive " + cfg.label + " variation across districts in " + STATE_NAMES[selected] + "?"
                : "Why does " + cfg.label + " vary across Indian states?",
            ].map((q,i)=>(
              <button key={i} onClick={()=>askNDAP(q)}
                style={{width:"100%",textAlign:"left",marginBottom:5,fontSize:12,color:"var(--blue-700)",background:"var(--blue-50)",border:"1px solid var(--blue-100)",borderRadius:"var(--r)",padding:"7px 10px",cursor:"pointer",fontWeight:500,display:"flex",alignItems:"center",gap:5,transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#dce9fd"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--blue-50)"}>
                <Icon name="ask" size={11} style={{color:"var(--blue)",flexShrink:0}}/>{q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window,{GISView});
