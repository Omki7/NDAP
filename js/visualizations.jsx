/* ============================================================
   NDAP — VISUALIZATIONS & ANALYTICS v2
   Dashboard management + Analytics Agent (no SQL, business logic only)
   ============================================================ */
const { useState, useRef, useEffect } = React;

/* ── Sample dashboard data ─────────────────────────────────── */
const DASH_DATA = [
  {
    id:"health",title:"Health Equity Dashboard",
    desc:"NFHS-5 health indicators across Indian states — IMR, immunisation, maternal health",
    color:"var(--blue)",icon:"shield",ago:"2h ago",shared:3,
    charts:[
      {id:"h1",defaultType:"bar",title:"Infant Mortality Rate by State",
       bar:[{k:"Bihar",v:46.8},{k:"UP",v:43.2},{k:"MP",v:41.3},{k:"JH",v:39.1},{k:"India",v:35.2},{k:"Kerala",v:6.4}],
       unit:"per 1,000 live births",source:"NFHS-5 · MoHFW"},
      {id:"h2",defaultType:"line",title:"Immunisation Coverage Trend",
       line:[71,75,79,82,86,89,91],unit:"% children fully immunised (12–23m)",
       source:"HMIS · MoHFW"},
    ]
  },
  {
    id:"rural",title:"Rural Employment",
    desc:"MGNREGA work participation, wage expenditure and job card coverage by state",
    color:"var(--green)",icon:"users",ago:"yesterday",shared:1,
    charts:[
      {id:"r1",defaultType:"bar",title:"MGNREGA Wage Expenditure FY24",
       bar:[{k:"Rajasthan",v:9014},{k:"UP",v:7823},{k:"MP",v:6540},{k:"WB",v:5210},{k:"Bihar",v:4900}],
       unit:"₹ Crore",source:"MGNREGA MIS · Rural Dev"},
      {id:"r2",defaultType:"donut",title:"Work Category Distribution",
       donut:[{k:"Water conservation",v:34},{k:"Land development",v:28},{k:"Rural roads",v:24},{k:"Other",v:14}],
       source:"MGNREGA MIS FY2024"},
    ]
  },
  {
    id:"budget",title:"Social Sector Budget",
    desc:"Union Budget 2024–25 social sector allocations by ministry",
    color:"var(--saffron)",icon:"rupee",ago:"3 days ago",shared:5,
    charts:[
      {id:"b1",defaultType:"donut",title:"Allocation by Ministry",
       donut:[{k:"Health & FW",v:32},{k:"Education",v:28},{k:"Rural Dev",v:22},{k:"Agriculture",v:12},{k:"Other",v:6}],
       source:"Union Budget 2024-25 · MoF"},
      {id:"b2",defaultType:"bar",title:"Per-capita Spend by State",
       bar:[{k:"NE States",v:6800},{k:"J&K",v:7200},{k:"Jharkhand",v:4200},{k:"Bihar",v:3800},{k:"UP",v:2800}],
       unit:"₹ per person",source:"Budget 2024-25 · Census projections"},
    ]
  },
];

/* ── Analytics agent demo responses ─────────────────────────── */
const AG_DEMOS = {
  imr:{
    src:{d:"NFHS-5 (2019–21)",m:"MoHFW",s:"Health",g:"District → State aggregate"},
    logic:"Filter health indicators for IMR, aggregate districts to state mean, add All-India benchmark, sort descending",
    chart:{id:"q_imr",defaultType:"bar",title:"Infant Mortality Rate by State",
      bar:[{k:"Bihar",v:46.8},{k:"UP",v:43.2},{k:"MP",v:41.3},{k:"JH",v:39.1},{k:"India",v:35.2},{k:"Kerala",v:6.4}],
      unit:"per 1,000 live births",source:"NFHS-5 · MoHFW"}
  },
  mgnrega:{
    src:{d:"MGNREGA MIS FY2024",m:"Ministry of Rural Development",s:"Rural Employment",g:"District → State"},
    logic:"Aggregate job-card households by state, divide by total rural HH from Census 2011, express as coverage %",
    chart:{id:"q_mg",defaultType:"bar",title:"MGNREGA Coverage by State",
      bar:[{k:"Jharkhand",v:91.2},{k:"Bihar",v:88.4},{k:"Odisha",v:85.6},{k:"Rajasthan",v:82.1},{k:"Chhattisgarh",v:82.7},{k:"UP",v:74.2}],
      unit:"% rural HH with job cards",source:"MGNREGA MIS · Rural Dev"}
  },
  literacy:{
    src:{d:"Census of India 2011",m:"MoSPI / RGI",s:"Demography",g:"State"},
    logic:"Extract literacy rate from PCA C-08 table (persons 7+), compare to national average 74.04%, rank states",
    chart:{id:"q_lit",defaultType:"bar",title:"Literacy Rate by State",
      bar:[{k:"Kerala",v:94.0},{k:"Goa",v:88.7},{k:"Delhi",v:86.2},{k:"HP",v:82.8},{k:"India",v:74.0},{k:"Bihar",v:61.8},{k:"Rajasthan",v:66.1}],
      unit:"% literate (age 7+)",source:"Census 2011 · PCA C-08"}
  },
  budget:{
    src:{d:"Union Budget 2024–25",m:"Ministry of Finance",s:"Public Finance",g:"Scheme-level"},
    logic:"Aggregate social sector scheme allocations by ministry, calculate share of total social spend",
    chart:{id:"q_bud",defaultType:"donut",
      donut:[{k:"Health & FW",v:32},{k:"Education",v:28},{k:"Rural Dev",v:22},{k:"Agriculture",v:12},{k:"Other",v:6}],
      title:"Social Sector Budget Share",source:"Union Budget 2024-25"}
  },
  poverty:{
    src:{d:"NITI Aayog MPI 2021",m:"NITI Aayog",s:"Social",g:"State"},
    logic:"Extract multidimensional poverty index (MPI ≥ 0.333), rank states, compare to national average",
    chart:{id:"q_mpi",defaultType:"bar",title:"Multidimensional Poverty by State",
      bar:[{k:"Bihar",v:33.7},{k:"Jharkhand",v:28.8},{k:"UP",v:22.9},{k:"MP",v:20.6},{k:"Assam",v:19.3},{k:"Kerala",v:0.5}],
      unit:"% multidimensionally poor",source:"MPI 2021 · NITI Aayog"}
  },
};

function matchAG(q){
  const l=q.toLowerCase();
  if(l.includes("imr")||l.includes("infant")||l.includes("mortality")) return AG_DEMOS.imr;
  if(l.includes("mgnrega")||l.includes("rural employ")||l.includes("job card")) return AG_DEMOS.mgnrega;
  if(l.includes("litera")||l.includes("census")) return AG_DEMOS.literacy;
  if(l.includes("budget")||l.includes("allocat")||l.includes("spend")) return AG_DEMOS.budget;
  if(l.includes("poverty")||l.includes("mpi")||l.includes("poor")) return AG_DEMOS.poverty;
  return null;
}

/* ── Chart Widget (type-switchable, pinnable) ───────────────── */
function ChartWidget({c, onPin, compact=false}){
  const [type,setType]=useState(c.defaultType||"bar");
  const isDonut=type==="donut"||c.donut!=null;
  const types=c.donut?["donut","bar"]:["bar","line","area"];
  const barData=c.bar||[];
  const lineData=c.line||barData.map(d=>d.v);

  return (
    <Card pad={compact?12:16}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>{c.title}</div>
          {c.source&&<div style={{fontSize:10.5,color:"var(--muted)",marginTop:2,display:"flex",alignItems:"center",gap:4}}>
            <Icon name="data" size={10} style={{color:"var(--blue)",flexShrink:0}}/>Source: {c.source}
          </div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
          {types.map(t=>(
            <button key={t} onClick={()=>setType(t)} style={{fontSize:11,padding:"3px 9px",borderRadius:20,border:"1px solid",cursor:"pointer",transition:"all .12s",
              borderColor:type===t?"var(--blue)":"var(--border)",background:type===t?"var(--blue-50)":"transparent",
              color:type===t?"var(--blue-700)":"var(--muted)",fontWeight:type===t?600:400}}>{t}</button>
          ))}
          {onPin&&<button onClick={()=>onPin(c)} title="Pin to dashboard" style={{marginLeft:4,width:26,height:26,borderRadius:6,border:"1px solid var(--border)",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--saffron)",flexShrink:0,transition:"all .12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="var(--saffron-50)";e.currentTarget.style.borderColor="var(--saffron)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor="var(--border)";}}>
            <Icon name="star" size={12}/>
          </button>}
        </div>
      </div>
      {type==="donut"&&c.donut?<Donut data={c.donut}/>:
       (type==="line"||type==="area")&&lineData.length?(
         <><AreaLine data={lineData} color="var(--blue)" fill={type==="area"?"rgba(46,107,214,.12)":"rgba(0,0,0,0)"}/><div style={{fontSize:10.5,color:"var(--muted-2)",marginTop:4}}>{c.unit}</div></>
       ):(
         <BarChart data={barData} fmt={(v)=>typeof v==="number"&&v>999?v.toLocaleString():String(v)} unit={c.unit} color="var(--blue)"/>
       )
      }
    </Card>
  );
}

/* ── Mini bar preview for dashboard card ────────────────────── */
function MiniPreview({c,color}){
  const vals=(c.bar?c.bar.map(d=>d.v):c.donut?c.donut.map(d=>d.v):c.line||[]).slice(0,7);
  if(!vals.length) return null;
  const max=Math.max(...vals)||1;
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:34,marginTop:10}}>
      {vals.map((v,i)=>(
        <div key={i} style={{flex:1,height:`${Math.max((v/max)*100,8)}%`,background:color,opacity:.55+i*.06,borderRadius:"2px 2px 0 0",minHeight:3}}/>
      ))}
    </div>
  );
}

/* ── Dashboard Card ─────────────────────────────────────────── */
function DashCard({d,onOpen,onShare}){
  const [h,setH]=useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"#fff",border:"1px solid",borderColor:h?"var(--blue)":"var(--border)",borderRadius:"var(--r-lg)",
        padding:18,cursor:"pointer",boxShadow:h?"var(--sh-2)":"var(--sh-1)",transition:"all .18s"}}
      onClick={onOpen}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:9,background:d.color+"18",display:"flex",alignItems:"center",justifyContent:"center",color:d.color,flexShrink:0}}>
            <Icon name={d.icon} size={19}/>
          </div>
          <div>
            <div style={{fontSize:13.5,fontWeight:700,color:"var(--ink)"}}>{d.title}</div>
            <div style={{fontSize:11.5,color:"var(--muted)",marginTop:1}}>{d.charts.length} charts · {d.ago}</div>
          </div>
        </div>
        <button onClick={e=>{e.stopPropagation();onShare(d);}} title="Share" style={{width:28,height:28,borderRadius:6,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)",flexShrink:0,transition:"all .12s"}}
          onMouseEnter={e=>{e.stopPropagation();e.currentTarget.style.borderColor="var(--blue)";e.currentTarget.style.color="var(--blue)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>
          <Icon name="share" size={13}/>
        </button>
      </div>
      <div style={{fontSize:12.5,color:"var(--ink-2)",marginTop:10,lineHeight:1.4}}>{d.desc}</div>
      <MiniPreview c={d.charts[0]} color={d.color}/>
      {d.shared>0&&<div style={{display:"flex",alignItems:"center",gap:5,marginTop:10,fontSize:11,color:"var(--muted)"}}>
        <Icon name="users" size={11}/>{d.shared} collaborator{d.shared>1?"s":""}
      </div>}
    </div>
  );
}

/* ── Share Dashboard Modal ──────────────────────────────────── */
function ShareDashModal({dash,onClose,showToast}){
  const [link,setLink]=useState(false);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(7,24,47,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(2px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:440,background:"#fff",borderRadius:"var(--r-xl)",boxShadow:"var(--sh-pop)",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 20px",borderBottom:"1px solid var(--border)"}}>
          <Icon name="share" size={17} style={{color:"var(--blue)"}}/>
          <span style={{fontSize:15,fontWeight:700}}>Share "{dash.title}"</span>
          <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><Icon name="close" size={17}/></button>
        </div>
        <div style={{padding:"18px 20px"}}>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <input placeholder="Invite by email or @ministry directory…" style={{flex:1,padding:"9px 12px",border:"1px solid var(--border-2)",borderRadius:"var(--r)",fontSize:13,fontFamily:"var(--font)",outline:"none"}}/>
            <button onClick={()=>showToast("Invitation sent")} style={{padding:"9px 14px",background:"var(--navy-800)",color:"#fff",border:"none",borderRadius:"var(--r)",fontSize:13,fontWeight:600,cursor:"pointer"}}>Invite</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--r)",marginBottom:12}}>
            <Icon name="lock" size={15} style={{color:"var(--navy-700)"}}/>
            <div style={{flex:1,fontSize:13,color:"var(--ink)"}}>Link sharing</div>
            <button onClick={()=>setLink(!link)} style={{width:38,height:22,borderRadius:12,border:"none",cursor:"pointer",background:link?"var(--blue)":"var(--border-strong)",position:"relative",flexShrink:0,transition:"background .15s"}}>
              <span style={{position:"absolute",top:2,left:link?19:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .15s"}}/>
            </button>
          </div>
          {link&&<button onClick={()=>showToast("Dashboard link copied")} style={{width:"100%",padding:"9px",background:"var(--blue-50)",border:"1px solid var(--blue-100)",borderRadius:"var(--r)",fontSize:13,fontWeight:600,color:"var(--blue)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7,marginBottom:12}}>
            <Icon name="link" size={14}/>Copy dashboard link
          </button>}
          <div style={{fontSize:11.5,color:"var(--muted)",display:"flex",alignItems:"center",gap:6}}>
            <Icon name="shield" size={13} style={{color:"var(--green)",flexShrink:0}}/>
            Role-based access — every view and export is logged.
          </div>
          <button onClick={onClose} style={{width:"100%",marginTop:14,padding:"10px",background:"var(--navy-800)",color:"#fff",border:"none",borderRadius:"var(--r)",fontSize:13.5,fontWeight:600,cursor:"pointer"}}>Done</button>
        </div>
      </div>
    </div>
  );
}

/* ── Analytics Agent (right chatbot) ────────────────────────── */
function AnalyticsAgent({onPinToBoard}){
  const [msgs,setMsgs]=useState([
    {id:0,role:"assistant",type:"text",text:"Hi Anaya. Ask me about any dataset — I'll identify the right source and build a visual for you. Try: \"IMR by state\", \"MGNREGA coverage\", \"Literacy rates\" or \"Budget allocation\"."}
  ]);
  const [input,setInput]=useState("");
  const [listening,setListening]=useState(false);
  const [tts,setTts]=useState(false);
  const [histOpen,setHistOpen]=useState(false);
  const agSessions=[{id:1,title:"Health Equity Analysis",ts:"2h ago"},{id:2,title:"MGNREGA Coverage",ts:"yesterday"},{id:3,title:"Poverty Mapping",ts:"3 days ago"}];
  const scrollRef=useRef(null);
  const idR=useRef(100);

  function send(text){
    if(!text.trim()) return;
    const uid=++idR.current; const aid=++idR.current;
    const demo=matchAG(text);
    const aiMsg=demo
      ?{id:aid,role:"assistant",type:"visual",src:demo.src,logic:demo.logic,chart:demo.chart,latency:(Math.random()*1.2+0.8).toFixed(1)+"s"}
      :{id:aid,role:"assistant",type:"text",text:"I searched across NDAP's indexed datasets. For a specific result, try asking about health indicators, MGNREGA, literacy rates, MPI poverty, or budget allocations."};
    setMsgs(m=>[...m,{id:uid,role:"user",text},{...aiMsg}]);
    setInput("");
    setTimeout(()=>{ if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight; },120);
  }

  function newChat(){
    setMsgs([{id:Date.now(),role:"assistant",type:"text",text:"New session. What dataset would you like to explore?"}]);
    setHistOpen(false);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"var(--surface)"}}>
      {/* Header */}
      <div style={{padding:"11px 16px",borderBottom:"1px solid var(--border)",background:"var(--surface)",flexShrink:0,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,var(--navy-800),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>
            <Icon name="analytics" size={16}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>Analytics Agent</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>Ask questions → get visuals</div>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button onClick={newChat} title="New chat" style={{width:28,height:28,borderRadius:6,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}><Icon name="plus" size={13}/></button>
            <button onClick={()=>setHistOpen(!histOpen)} title="History" style={{width:28,height:28,borderRadius:6,border:"1px solid var(--border)",background:histOpen?"var(--surface-2)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}><Icon name="clock" size={13}/></button>
            <button onClick={()=>setTts(!tts)} title="Text to speech" style={{width:28,height:28,borderRadius:6,border:"1px solid var(--border)",background:tts?"var(--blue-50)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:tts?"var(--blue)":"var(--muted)"}}><Icon name="globe" size={13}/></button>
          </div>
        </div>
        {histOpen&&(
          <div style={{position:"absolute",top:"100%",right:10,zIndex:50,background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-pop)",width:220,overflow:"hidden",marginTop:4}}>
            <div style={{padding:"9px 14px",borderBottom:"1px solid var(--border)",fontSize:11.5,fontWeight:700,color:"var(--muted)"}}>Recent sessions</div>
            {agSessions.map((s,i)=>(
              <button key={i} onClick={()=>setHistOpen(false)} style={{width:"100%",textAlign:"left",padding:"9px 14px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:"var(--ink-2)",display:"flex",alignItems:"center",gap:8}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--surface-2)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Icon name="analytics" size={13} style={{color:"var(--blue)"}}/>
                <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</span>
                <span style={{fontSize:11,color:"var(--muted)",flexShrink:0}}>{s.ts}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"14px 14px",display:"flex",flexDirection:"column",gap:14}}>
        {msgs.map(m=>(
          <div key={m.id}>
            {m.role==="user"?(
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <div style={{background:"var(--navy-800)",color:"#fff",padding:"9px 13px",borderRadius:"12px 12px 3px 12px",fontSize:13.5,lineHeight:1.5,maxWidth:"85%"}}>{m.text}</div>
              </div>
            ):m.type==="visual"?(
              <div>
                {/* Source + sector tags */}
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,background:"var(--blue-50)",border:"1px solid var(--blue-100)",color:"var(--blue-700)"}}>
                    <Icon name="data" size={10}/>Source: {m.src.d}
                  </div>
                  <Badge tone="saffron">{m.src.s}</Badge>
                  <Badge tone="neutral">{m.src.g}</Badge>
                </div>
                {/* Business logic — no SQL */}
                <div style={{background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"9px 12px",marginBottom:10}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.5,marginBottom:4,display:"flex",alignItems:"center",gap:5}}>
                    <Icon name="bolt" size={10} style={{color:"var(--saffron)"}}/>Business logic
                  </div>
                  <div style={{fontSize:12.5,color:"var(--ink-2)",lineHeight:1.55}}>{m.logic}</div>
                </div>
                {/* Chart with type switcher */}
                <ChartWidget c={m.chart} onPin={onPinToBoard} compact={true}/>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:7}}>
                  <span style={{fontSize:11,color:"var(--muted)"}}>{m.latency}</span>
                  <button onClick={()=>onPinToBoard&&onPinToBoard(m.chart)} style={{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:5,fontSize:11.5,fontWeight:600,padding:"4px 11px",border:"1px solid var(--border)",borderRadius:20,background:"#fff",color:"var(--muted)",cursor:"pointer",transition:"all .12s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--saffron)";e.currentTarget.style.color="var(--saffron)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>
                    <Icon name="star" size={12}/>Pin to dashboard
                  </button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <div style={{width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,var(--navy-800),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0,marginTop:2}}><Icon name="sparkle" size={11}/></div>
                <div style={{background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"3px 12px 12px 12px",padding:"10px 13px",fontSize:13.5,color:"var(--ink)",lineHeight:1.6,flex:1}}>{m.text}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick suggestions */}
      <div style={{borderTop:"1px solid var(--border)",padding:"7px 12px",background:"var(--surface-2)",flexShrink:0}}>
        <div style={{display:"flex",gap:5,overflowX:"auto"}}>
          {["IMR by state","MGNREGA coverage","Literacy rates","Budget allocation","MPI poverty"].map((q,i)=>(
            <button key={i} onClick={()=>send(q)} style={{flexShrink:0,fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,border:"1px solid var(--border)",background:"#fff",color:"var(--ink-2)",cursor:"pointer",whiteSpace:"nowrap",transition:"all .12s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--blue)";e.currentTarget.style.color="var(--blue)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--ink-2)";}}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{padding:"10px 12px",borderTop:"1px solid var(--border)",background:"#fff",flexShrink:0}}>
        <div style={{display:"flex",gap:6,alignItems:"center",border:"1px solid var(--border-2)",borderRadius:10,padding:"5px 7px",background:"var(--surface)",boxShadow:"var(--sh-1)"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
            placeholder="Ask about any dataset…"
            style={{flex:1,border:"none",outline:"none",fontSize:13.5,fontFamily:"var(--font)",background:"transparent",padding:"4px 6px"}}/>
          <button onClick={()=>{setListening(!listening);if(!listening){setTimeout(()=>{setListening(false);send("IMR by state");},1200);}}}
            style={{width:30,height:30,borderRadius:7,border:"none",background:listening?"var(--blue)":"var(--surface-3)",color:listening?"#fff":"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <Icon name="mic" size={14}/>
          </button>
          <button onClick={()=>send(input)} style={{width:32,height:32,borderRadius:7,border:"none",background:input.trim()?"var(--blue)":"var(--border-strong)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background .15s"}}>
            <Icon name="send" size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Visualizations View ────────────────────────────────── */
function VisualizationsView({lang}){
  const [dashboards,setDashboards]=useState(DASH_DATA);
  const [view,setView]=useState("grid");
  const [selected,setSelected]=useState(null);
  const [sharing,setSharing]=useState(null);
  const [toast,setToast]=useState("");
  const [tab,setTab]=useState("mine");
  const [showAgent,setShowAgent]=useState(true);
  const [pinnedCharts,setPinnedCharts]=useState([]);
  const [newName,setNewName]=useState("");
  const [newDesc,setNewDesc]=useState("");
  const [newColor,setNewColor]=useState("var(--blue)");

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(""),3000);}

  function pinToBoard(chart){
    const pinned={...chart,id:chart.id+"_pin_"+Date.now(),pinned:new Date().toLocaleTimeString()};
    setPinnedCharts(p=>[pinned,...p.filter(x=>x.id!==pinned.id)]);
    showToast("Pinned to dashboard");
  }

  function createDashboard(){
    if(!newName.trim()) return;
    const d={id:"d_"+Date.now(),title:newName,desc:newDesc||"Custom dashboard",color:newColor,icon:"chart",ago:"just now",shared:0,charts:[]};
    setDashboards(p=>[d,...p]);
    setNewName("");setNewDesc("");
    showToast("Dashboard created");
    setView("grid");
  }

  return (
    <div style={{display:"flex",height:"100%",overflow:"hidden",position:"relative"}}>
      {/* Toast */}
      {toast&&<div className="fade-in" style={{position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",background:"var(--navy-800)",color:"#fff",padding:"9px 20px",borderRadius:20,fontSize:13,fontWeight:600,boxShadow:"var(--sh-2)",zIndex:100,pointerEvents:"none",whiteSpace:"nowrap"}}>
        <Icon name="check" size={14} style={{marginRight:6,verticalAlign:"middle",color:"var(--green)"}}/>{toast}
      </div>}

      {/* LEFT: main content */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        {/* Header */}
        <div style={{padding:"16px 24px 12px",borderBottom:"1px solid var(--border)",flexShrink:0,background:"#fff"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:view==="grid"?14:0,flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"var(--saffron)",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Analytics</div>
              <h1 style={{margin:0,fontSize:21,fontWeight:700,color:"var(--ink)",letterSpacing:-.4}}>
                {view==="detail"&&selected?selected.title:view==="create"?"New Dashboard":"My Dashboards"}
              </h1>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              {view==="detail"&&selected&&<>
                <button onClick={()=>setSharing(selected)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",background:"var(--surface-2)",color:"var(--ink-2)",border:"1px solid var(--border)",borderRadius:"var(--r)",fontWeight:600,fontSize:13,cursor:"pointer"}}>
                  <Icon name="share" size={14}/>Share
                </button>
                <button onClick={()=>setView("grid")} style={{padding:"8px 14px",border:"1px solid var(--border)",borderRadius:"var(--r)",fontWeight:600,fontSize:13,cursor:"pointer",background:"transparent",color:"var(--muted)"}}>← Back</button>
              </>}
              {view==="create"&&<button onClick={()=>setView("grid")} style={{padding:"8px 14px",border:"1px solid var(--border)",borderRadius:"var(--r)",fontSize:13,cursor:"pointer",background:"transparent",color:"var(--muted)"}}>← Back</button>}
              {view==="grid"&&<button onClick={()=>setView("create")} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 16px",background:"var(--navy-800)",color:"#fff",border:"none",borderRadius:"var(--r)",fontWeight:600,fontSize:13,cursor:"pointer"}}>
                <Icon name="plus" size={14}/>New Dashboard
              </button>}
              <button onClick={()=>setShowAgent(!showAgent)} title="Toggle Analytics Agent" style={{width:34,height:34,borderRadius:"var(--r)",border:"1px solid var(--border)",background:showAgent?"var(--blue-50)":"transparent",color:showAgent?"var(--blue)":"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <Icon name={showAgent?"chevR":"chevL"} size={16}/>
              </button>
            </div>
          </div>
          {view==="grid"&&(
            <div style={{display:"flex",gap:3,background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:20,padding:3,width:"fit-content"}}>
              {[["mine","My Dashboards"],["shared","Shared with me"]].map(([k,l])=>(
                <button key={k} onClick={()=>setTab(k)} style={{padding:"5px 14px",borderRadius:16,border:"none",cursor:"pointer",fontSize:12.5,fontWeight:tab===k?600:500,
                  background:tab===k?"#fff":"transparent",color:tab===k?"var(--navy-800)":"var(--muted)",
                  boxShadow:tab===k?"0 1px 3px rgba(0,0,0,.08)":"none",transition:"all .15s"}}>{l}</button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          {view==="grid"&&(
            <>
              {/* Pinned from agent */}
              {pinnedCharts.length>0&&(
                <div style={{marginBottom:26}}>
                  <div style={{fontSize:11,fontWeight:700,color:"var(--saffron)",textTransform:"uppercase",letterSpacing:.6,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                    <Icon name="star" size={12}/>Pinned from Analytics Agent
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:14}}>
                    {pinnedCharts.map(c=><ChartWidget key={c.id} c={c} onPin={null}/>)}
                  </div>
                  <div style={{height:1,background:"var(--border)",margin:"20px 0"}}/>
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
                {dashboards.map(d=>(
                  <DashCard key={d.id} d={d}
                    onOpen={()=>{setSelected(d);setView("detail");}}
                    onShare={(d)=>setSharing(d)}/>
                ))}
              </div>
            </>
          )}

          {view==="detail"&&selected&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
              {selected.charts.length===0?(
                <div style={{gridColumn:"1/-1",textAlign:"center",padding:"40px 20px",color:"var(--muted)"}}>
                  <Icon name="chart" size={36} style={{color:"var(--border-strong)",marginBottom:12}}/>
                  <div style={{fontSize:14,fontWeight:600}}>No charts yet</div>
                  <div style={{fontSize:13,marginTop:4}}>Ask the Analytics Agent on the right to generate and pin charts here</div>
                </div>
              ):selected.charts.map(c=>(
                <ChartWidget key={c.id} c={c} onPin={(c)=>pinToBoard(c)}/>
              ))}
            </div>
          )}

          {view==="create"&&(
            <div style={{maxWidth:500}}>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6,color:"var(--ink)"}}>Dashboard name <span style={{color:"var(--red)"}}>*</span></label>
                  <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g., Budget Allocation Analysis"
                    style={{width:"100%",padding:"10px 12px",border:"1px solid var(--border-2)",borderRadius:"var(--r)",fontSize:13.5,fontFamily:"var(--font)",outline:"none",boxSizing:"border-box"}}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6,color:"var(--ink)"}}>Description</label>
                  <textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="What will this dashboard track?"
                    style={{width:"100%",padding:"10px 12px",border:"1px solid var(--border-2)",borderRadius:"var(--r)",fontSize:13.5,fontFamily:"var(--font)",height:80,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:8,color:"var(--ink)"}}>Colour theme</label>
                  <div style={{display:"flex",gap:8}}>
                    {[["var(--blue)","Blue"],["var(--green)","Green"],["var(--saffron)","Saffron"],["var(--navy-700)","Navy"],["var(--red)","Red"]].map(([c,l])=>(
                      <button key={c} title={l} onClick={()=>setNewColor(c)}
                        style={{width:30,height:30,borderRadius:"50%",background:c,border:newColor===c?"3px solid var(--ink)":"2px solid transparent",cursor:"pointer",transition:"transform .12s",boxShadow:newColor===c?"0 0 0 2px #fff inset":"none"}}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
                    ))}
                  </div>
                </div>
                <button onClick={createDashboard} disabled={!newName.trim()} style={{padding:"11px",background:newName.trim()?"var(--navy-800)":"var(--border-2)",color:"#fff",border:"none",borderRadius:"var(--r)",fontWeight:600,fontSize:14,cursor:newName.trim()?"pointer":"not-allowed",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <Icon name="plus" size={15}/>Create Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Analytics Agent */}
      <div style={{width:showAgent?370:0,transition:"width .26s cubic-bezier(.4,0,.2,1)",borderLeft:showAgent?"1px solid var(--border)":"none",flexShrink:0,overflow:"hidden"}}>
        <div style={{width:370,height:"100%"}}>
          <AnalyticsAgent onPinToBoard={pinToBoard}/>
        </div>
      </div>

      {/* Share Modal */}
      {sharing&&<ShareDashModal dash={sharing} onClose={()=>setSharing(null)} showToast={showToast}/>}
    </div>
  );
}

Object.assign(window, { VisualizationsView });
