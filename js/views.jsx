/* ============================================================
   NDAP -- MODULE VIEWS
   Home · Datasets/MDM · AI Studio · Analytics · Governance
   ============================================================ */

function Page({ children, pad=28 }){
  return <div style={{height:"100%",overflowY:"auto"}}>
    <div style={{maxWidth:1180,margin:"0 auto",padding:pad}}>{children}</div></div>;
}
function PageHead({ kicker, title, sub, right }){
  return (
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:20,marginBottom:22,flexWrap:"wrap"}}>
      <div>
        {kicker && <div style={{fontSize:11.5,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:"var(--saffron)",marginBottom:6}}>{kicker}</div>}
        <h1 style={{margin:0,fontSize:24,fontWeight:700,letterSpacing:-.4,color:"var(--ink)"}}>{title}</h1>
        {sub && <p style={{margin:"6px 0 0",fontSize:14,color:"var(--muted)",maxWidth:620,lineHeight:1.5}}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}
function Grid({ cols, gap=14, children, style }){
  return <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap,...style}}>{children}</div>;
}

/* =================== HOME =================== */
function HomeView({ go, lang }){
  const [tab, setTab] = useState("site");
  const [range, setRange] = useState("30 days");
  return (
    <Page>
      {/* hero */}
      <div style={{background:"linear-gradient(120deg,var(--navy-900),var(--navy-700) 70%,var(--navy-600))",
        borderRadius:"var(--r-xl)",padding:"34px 36px",color:"#fff",position:"relative",overflow:"hidden",marginBottom:22}}>
        <div style={{position:"absolute",right:-30,top:-30,opacity:.10}}><Emblem size={260} color="#ffffff" ring="transparent"/></div>
        <Badge tone="saffron" soft={false} style={{background:"rgba(201,138,43,.22)",color:"#f3d9a8"}}>{t("gov_india",lang)}</Badge>
        <h1 style={{margin:"14px 0 6px",fontSize:34,fontWeight:700,letterSpacing:-.8,maxWidth:680}}>
          <span className="en-only">The reasoning layer for India's public data</span>
          <span className="hi-only">भारत के सार्वजनिक डेटा के लिए विश्लेषण परत</span></h1>
        <p style={{margin:0,fontSize:15,color:"#bccbe6",maxWidth:600,lineHeight:1.55}}>
          <span className="en-only">Ask in natural language across 4,800+ standardised datasets and 1.3 lakh documents. Get cited, reproducible answers -- with code, charts and full audit trails.</span>
          <span className="hi-only">4,800+ मानकीकृत डेटासेट और 1.3 लाख दस्तावेज़ों पर प्राकृतिक भाषा में पूछें। स्रोत-सहित, पुनरुत्पादनीय उत्तर पाएँ।</span></p>
        <div style={{display:"flex",gap:12,marginTop:22,flexWrap:"wrap"}}>
          <button onClick={()=>go("ask")} style={{display:"inline-flex",alignItems:"center",gap:9,background:"#fff",color:"var(--navy-800)",
            border:"none",borderRadius:"var(--r)",padding:"11px 20px",fontSize:14.5,fontWeight:700,cursor:"pointer"}}>
            <Icon name="ask" size={17}/>{lang==="hi"?"NDAP से पूछें":"Ask NDAP"}</button>
          <button onClick={()=>window.open("https://ndap.niti.gov.in/catalogue?query=*&search=Variables%2CDatasetInfo&domain=ndap","_blank")} style={{display:"inline-flex",alignItems:"center",gap:9,background:"rgba(255,255,255,.12)",color:"#fff",
            border:"1px solid rgba(255,255,255,.25)",borderRadius:"var(--r)",padding:"11px 20px",fontSize:14.5,fontWeight:600,cursor:"pointer"}}>
            <Icon name="data" size={17}/>Explore datasets ↗</button>
        </div>
      </div>

      {/* platform stats */}
      <Grid cols={4} style={{marginBottom:22}}>
        {PLATFORM_STATS.map((s,i)=>(
          <Card key={i}>
            <div style={{fontSize:11.5,color:"var(--muted)",marginBottom:6}}>{s.k}</div>
            <div style={{fontSize:26,fontWeight:700,color:"var(--ink)",marginBottom:4}}>{s.v}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>{s.sub}</div>
            <div style={{height:3,width:36,borderRadius:2,background:["var(--blue)","var(--navy-700)","var(--saffron)","var(--green)"][i]}}/>
          </Card>
        ))}
      </Grid>

      {/* tabs + filters */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--saffron)",marginBottom:4}}>Public transparency</div>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:"var(--ink)"}}>Site Analytics</h2>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:20,padding:3,gap:2}}>
            {[["site","Site Analytics"],["gis","Spatial Analytics (GIS)"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{fontSize:13,fontWeight:600,padding:"6px 14px",borderRadius:16,border:"none",cursor:"pointer",transition:"all .15s",
                background:tab===k?"#fff":"transparent",color:tab===k?"var(--ink)":"var(--muted)",boxShadow:tab===k?"var(--sh-1)":"none"}}>{l}</button>
            ))}
          </div>
          {["All India","Sector","Source"].map((f,i)=>(
            <button key={i} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12.5,color:"var(--ink-2)",background:"#fff",border:"1px solid var(--border)",borderRadius:20,padding:"6px 13px",cursor:"pointer"}}>
              <Icon name="filter" size={13}/>{f}</button>
          ))}
        </div>
      </div>

      {tab==="site" && (
        <>
          {/* KPI tiles */}
          <Grid cols={4} style={{marginBottom:22}}>
            {ANALYTICS.kpis.map((k,i)=>(
              <Card key={i}>
                <div style={{fontSize:12,color:"var(--muted)",marginBottom:8}}>{k.k}</div>
                <div style={{fontSize:24,fontWeight:700,color:"var(--ink)",marginBottom:6}}>{k.v}</div>
                <div style={{fontSize:12.5,fontWeight:600,color:k.up?"var(--green)":"var(--red)",display:"flex",alignItems:"center",gap:4,marginBottom:10}}>
                  {k.up?"▲":"▼"} {k.d}</div>
                <div style={{height:3,width:36,borderRadius:2,background:["var(--blue)","var(--green)","var(--saffron)","var(--navy-700)"][i]}}/>
              </Card>
            ))}
          </Grid>

          {/* charts row */}
          <Grid cols={2} gap={16} style={{marginBottom:22,gridTemplateColumns:"1.4fr 1fr"}}>
            <Card>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,color:"var(--saffron)",marginBottom:3}}>Traffic</div>
                  <div style={{fontSize:16,fontWeight:700,color:"var(--ink)"}}>Page views</div>
                </div>
                <div style={{display:"flex",gap:4}}>
                  {["7 days","30 days","12 months"].map(r=>(
                    <button key={r} onClick={()=>setRange(r)} style={{fontSize:12,fontWeight:600,padding:"4px 11px",borderRadius:20,border:"1px solid",cursor:"pointer",transition:"all .15s",
                      borderColor:range===r?"var(--blue)":"var(--border)",background:range===r?"var(--blue-50)":"transparent",color:range===r?"var(--blue-700)":"var(--muted)"}}>{r}</button>
                  ))}
                </div>
              </div>
              <AreaLine data={ANALYTICS.traffic} color="var(--blue)" fill="rgba(30,90,200,.08)" height={160}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11.5,color:"var(--muted)"}}>
                <span>Day 1</span><span style={{fontWeight:600,color:"var(--ink)"}}>Today · 462K views</span></div>
            </Card>
            <Card>
              <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,color:"var(--saffron)",marginBottom:3}}>Audience</div>
              <div style={{fontSize:16,fontWeight:700,color:"var(--ink)",marginBottom:14}}>Browsers</div>
              <Donut data={ANALYTICS.browsers} size={160}/>
              <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:14}}>
                {ANALYTICS.browsers.map((b,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:["#2563eb","#1e3a5f","#d97706","#16a34a","#9ca3af"][i],flexShrink:0}}/>
                    <span style={{fontSize:13,color:"var(--ink-2)",flex:1}}>{b.k}</span>
                    <span style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>{b.v}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </Grid>

          {/* bottom row */}
          <Grid cols={2} gap={16} style={{marginBottom:22,gridTemplateColumns:"1fr 1fr"}}>
            <Card>
              <SectionTitle kicker="Top sectors" title="Dataset usage by sector"/>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {ANALYTICS.topSegments.map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:13,color:"var(--ink-2)",width:160,flexShrink:0}}>{s.k}</span>
                    <div style={{flex:1,height:7,background:"var(--surface-3)",borderRadius:5,overflow:"hidden"}}>
                      <div style={{height:"100%",width:s.v+"%",background:"var(--blue)",borderRadius:5,transition:"width .5s"}}/>
                    </div>
                    <span className="tnum" style={{fontSize:12,color:"var(--muted)",width:32,textAlign:"right"}}>{s.v}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle kicker="Downloads" title="Top datasets downloaded"/>
              <div style={{display:"flex",flexDirection:"column"}}>
                {ANALYTICS.topDownloads.map((d,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:i<4?"1px solid var(--surface-3)":"none"}}>
                    <span className="tnum" style={{fontSize:13,fontWeight:700,color:"var(--muted-2)",width:18}}>{i+1}</span>
                    <Icon name="download" size={15} style={{color:"var(--green)"}}/>
                    <span style={{flex:1,fontSize:13.5,color:"var(--ink)",fontWeight:500}}>{d.k}</span>
                    <span className="tnum" style={{fontSize:13,fontWeight:700,color:"var(--ink-2)"}}>{d.v}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Grid>
        </>
      )}

      {tab === "gis" && (
        <div style={{height:600, border:"1px solid var(--border)", borderRadius:"var(--r-lg)", overflow:"hidden", marginBottom:22}}>
          <GISView />
        </div>
      )}
    </Page>
  );
}

/* =================== STUDIO -- RESOURCE RAIL =================== */
function StudioResourcesRail({ collab, setShare, showToast }){
  const pins = window.__ndapPins || [];
  const insertPin = (pin) => showToast("Inserted: " + (pin.data?.label || pin.data?.title || "artifact"));
  
  return (
    <div style={{width:280,borderRight:"1px solid var(--border)",background:"var(--surface)",flexShrink:0,overflowY:"auto",padding:"20px 16px",display:"flex",flexDirection:"column",gap:24}}>
      {/* PINNED FROM ASK NDAP */}
      <div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",color:"var(--muted)",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          <Icon name="star" size={13} style={{color:"var(--saffron)"}}/>Pinned from Ask NDAP
        </div>
        {pins.length===0?(
          <div style={{border:"2px dashed var(--border)",borderRadius:"var(--r)",padding:"18px 14px",textAlign:"center",color:"var(--muted)",fontSize:12.5,lineHeight:1.6,background:"var(--surface-2)"}}>
            <Icon name="star" size={24} style={{color:"var(--border-strong)",marginBottom:8}}/>
            <div>No pinned insights yet.</div>
            <div style={{fontSize:11,marginTop:4}}>Go to <b>Ask NDAP</b> → run a query → click <b>Pin</b> on any result</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {pins.map((pin,i)=>{
              const b=pin.data;
              const label=b&&b.label?b.label:b&&b.title?b.title:b&&b.type?b.type.toUpperCase():"Artifact";
              return (
                <div key={pin.id} draggable onDragStart={e=>{ e.dataTransfer.setData("text/plain",pin.id); }}
                  style={{background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"10px 12px",cursor:"grab",boxShadow:"var(--sh-1)",transition:"all .15s"}}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow="var(--sh-2)"; e.currentTarget.style.borderColor="var(--blue)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow="var(--sh-1)"; e.currentTarget.style.borderColor="var(--border)"; }}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <Icon name={b&&b.type==="chart"?"chart":b&&b.type==="table"?"table":"star"} size={15} style={{color:"var(--blue)",flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12.5,fontWeight:600,color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{pin.src||"Ask NDAP"} · {pin.ts||"just now"}</div>
                    </div>
                  </div>
                  <button onClick={()=>insertPin(pin)} style={{width:"100%",padding:"5px",background:"var(--blue-50)",border:"1px solid var(--blue-100)",borderRadius:4,fontSize:11.5,fontWeight:600,color:"var(--blue-700)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    <Icon name="plus" size={12}/>Insert into document
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* COLLABORATION */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",color:"var(--muted)"}}>Collaboration</div>
          <button onClick={()=>setShare(true)} style={{fontSize:11.5,fontWeight:600,color:"var(--blue)",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Icon name="users" size={13}/>Manage</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {collab.map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:p.color,color:"#fff",fontSize:11.5,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>{p.name}</div>
                <div style={{fontSize:11.5,color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.org}</div>
              </div>
              <Badge tone="neutral" style={{fontSize:11}}>{p.role}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =================== AI STUDIO -- AI AGENT PANEL =================== */
function AIAgentPanel({ showToast }) {
  const [input, setInput] = useState("");
  const [histOpen, setHistOpen] = useState(false);
  const studioSessions = [{id:1,title:"Bihar Health Brief",ts:"2h ago"},{id:2,title:"MGNREGA Analysis",ts:"yesterday"},{id:3,title:"NFHS-5 Review",ts:"3 days ago"}];
  const chatScrollRef = React.useRef(null);
  const [chat, setChat] = useState([
    { role:"assistant", text:"Hi Anaya. I'm your AI writing partner. I can help you draft, rephrase, find data, review against an RFP, or insert pinned insights. What would you like to do?" },
  ]);

  function handleSend(text){
    if(!text.trim()) return;
    const userMsg={role:"user",text};
    const lq=text.toLowerCase();
    let reply;
    if(lq.includes("rephrase")||lq.includes("rewrite")){
      reply={role:"assistant",text:"Here is a rephrased version:\n\nBihar's institutional birth rate improved from 63.8% (NFHS-4) to 76.2% (NFHS-5), reflecting sustained investment in antenatal care and JSY incentives.",actions:["Insert into draft","Rephrase again","Make it shorter"]};
    } else if(lq.includes("review")||lq.includes("what do you think")){
      reply={role:"assistant",text:"Overall the draft is strong. Three suggestions: (1) Strengthen the lede. (2) Add a state comparison. (3) Reposition Table 2.",actions:["Accept all suggestions","Discuss suggestion 1","Open full review"]};
    } else {
      reply={role:"assistant",text:"Done. I've updated the document based on your instruction. The change is highlighted.",actions:["Accept change","Reject change","Refine further"]};
    }
    setChat(t=>[...t,userMsg,reply]);
    setInput("");
    setTimeout(()=>{ if(chatScrollRef.current) chatScrollRef.current.scrollTop=chatScrollRef.current.scrollHeight; },100);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"var(--surface)"}}>
      <div style={{padding:"11px 16px",borderBottom:"1px solid var(--border)",background:"var(--surface)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,var(--navy-800),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>
            <Icon name="sparkle" size={16}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>NDAP Agent</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>Copilot for policy drafting</div>
          </div>
        </div>
      </div>

      <div ref={chatScrollRef} style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:16}}>
        {chat.map((m,i)=>(
          <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"92%"}}>
            {m.role==="user"?(
              <div style={{background:"var(--navy-800)",color:"#fff",padding:"10px 14px",borderRadius:"14px 14px 3px 14px",fontSize:13.5,lineHeight:1.5,boxShadow:"var(--sh-1)"}}>{m.text}</div>
            ):(
              <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <div style={{width:24,height:24,borderRadius:7,background:"linear-gradient(135deg,var(--navy-800),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0,marginTop:2}}><Icon name="sparkle" size={11}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{background:"#fff",border:"1px solid var(--border)",borderRadius:"3px 14px 14px 14px",padding:"12px 14px",fontSize:13.5,lineHeight:1.65,color:"var(--ink)",boxShadow:"var(--sh-1)"}}>{m.text}</div>
                  {m.actions&&(
                    <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                      {m.actions.map((act,j)=>(
                        <button key={j} onClick={()=>handleSend(act)} style={{background:"#fff",border:"1px solid var(--border-strong)",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,color:"var(--ink-2)",cursor:"pointer",transition:"all .15s"}}
                          onMouseEnter={e=>{ e.currentTarget.style.background="var(--surface-2)"; }} onMouseLeave={e=>{ e.currentTarget.style.background="#fff"; }}>{act}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{padding:"12px 14px",borderTop:"1px solid var(--border)",background:"#fff",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",border:"1px solid var(--border-strong)",borderRadius:10,padding:"7px 8px",background:"var(--surface)",boxShadow:"var(--sh-1)"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend(input)} placeholder="Ask the agent…" style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13.5,padding:"5px 10px",fontFamily:"var(--font)"}}/>
          <button onClick={()=>handleSend(input)} style={{background:input.trim()?"var(--navy-900)":"var(--border-strong)",color:"#fff",border:"none",borderRadius:7,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:input.trim()?"pointer":"default",transition:"background .15s"}}><Icon name="send" size={15}/></button>
        </div>
      </div>
    </div>
  );
}

function StudioView(){
  const [toast,setToast]=useState("");
  const [share,setShare]=useState(false);
  const [cite,setCite]=useState(null);
  const [collab,setCollab]=useState(STUDIO_COLLAB);
  const [leftOpen,setLeftOpen]=useState(true);
  const [rightOpen,setRightOpen]=useState(false);
  const [activeDraftId,setActiveDraftId]=useState(1);
  const [drafts,setDrafts]=useState([
    {id:1,title:"Rural Health Brief"},
    {id:2,title:"MGNREGA Analysis -- Rajasthan"},
  ]);
  const showToast=(msg)=>{ setToast(msg); setTimeout(()=>setToast(""),3000); };
  const onCite=(c)=>{ setCite(c); setTimeout(()=>setCite(null),3200); };
  const setRole=(i,r)=>setCollab(cs=>cs.map((c,j)=>j===i?{...c,role:r}:c));

  const CITES={
    1:{src:"Census 2011 · PCA Table C-08 · p.1834"},
    2:{src:"MGNREGA MIS · FY 2023-24 · Rajasthan"},
  };

  function addDraft(){
    const newId=Date.now();
    setDrafts(d=>[...d,{id:newId,title:"New draft "+(d.length+1)}]);
    setActiveDraftId(newId);
  }

  return (
    <Page pad={0}>
      <div style={{display:"flex",height:"calc(100vh - 55px)",overflow:"hidden",position:"relative"}}>
        {/* Left Rail */}
        <div style={{width:leftOpen?280:0,transition:"all 0.28s cubic-bezier(.4,0,.2,1)",overflow:"hidden",flexShrink:0,display:"flex"}}>
          <StudioResourcesRail collab={collab} setShare={setShare} showToast={showToast}/>
        </div>

        {/* Center editor */}
        <div style={{flex:1,overflowY:"auto",background:"#fff",display:"flex",flexDirection:"column",position:"relative",minWidth:0}}>
          {/* Header bar with toggles + draft tabs */}
          <div style={{display:"flex",alignItems:"center",borderBottom:"1px solid var(--border)",background:"var(--surface)",flexShrink:0,padding:"0 12px",gap:8}}>
            <button onClick={()=>setLeftOpen(!leftOpen)} title={leftOpen?"Collapse resources":"Expand resources"} style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:"var(--muted)",borderRadius:6,flexShrink:0}}>
              <Icon name={leftOpen?"chevL":"chevR"} size={18}/>
            </button>
            {/* Draft tabs */}
            <div style={{display:"flex",alignItems:"center",gap:0,flex:1,overflowX:"auto",padding:"4px 0"}}>
              {drafts.map(d=>(
                <button key={d.id} onClick={()=>setActiveDraftId(d.id)} style={{flexShrink:0,display:"flex",alignItems:"center",gap:7,padding:"6px 14px",border:"none",borderBottom:activeDraftId===d.id?"2px solid var(--blue)":"2px solid transparent",background:"transparent",color:activeDraftId===d.id?"var(--blue)":"var(--muted)",fontSize:13,fontWeight:activeDraftId===d.id?600:500,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>
                  <Icon name="doc" size={13}/>{d.title}
                </button>
              ))}
              <button onClick={addDraft} title="New draft" style={{flexShrink:0,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",border:"none",cursor:"pointer",color:"var(--muted)",borderRadius:5,marginLeft:4}}>
                <Icon name="plus" size={15}/>
              </button>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <GhostBtn icon="doc" label="Export .docx" onClick={()=>showToast("Exported Rural_Health_Brief.docx")}/>
              <GhostBtn icon="download" label=".pdf" onClick={()=>showToast("Exported Rural_Health_Brief.pdf")}/>
            </div>
            <button onClick={()=>setRightOpen(!rightOpen)} title={rightOpen?"Collapse agent":"Expand agent"} style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",background:rightOpen?"var(--blue-50)":"transparent",border:"none",cursor:"pointer",color:rightOpen?"var(--blue)":"var(--muted)",borderRadius:6,flexShrink:0}}>
              <Icon name={rightOpen?"chevR":"chevL"} size={18}/>
            </button>
          </div>

          {/* Toasts */}
          {toast&&<div className="fade-in" style={{position:"absolute",top:60,left:"50%",transform:"translateX(-50%)",background:"var(--navy-800)",color:"#fff",padding:"10px 20px",borderRadius:20,fontSize:13,fontWeight:600,boxShadow:"var(--sh-2)",zIndex:50,maxWidth:420,pointerEvents:"none"}}><Icon name="check" size={15} style={{marginRight:8,color:"var(--green)",verticalAlign:"middle"}}/>{toast}</div>}
          {cite&&<div className="fade-in" style={{position:"absolute",top:60,left:"50%",transform:"translateX(-50%)",background:"#fff",border:"1px solid var(--blue)",color:"var(--ink)",padding:"10px 16px",borderRadius:"var(--r)",fontSize:12.5,fontWeight:600,boxShadow:"var(--sh-pop)",zIndex:50,display:"flex",alignItems:"center",gap:8,pointerEvents:"none"}}><span style={{width:18,height:18,borderRadius:5,background:"var(--blue)",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{cite.n}</span>Source [{cite.n}] · {(CITES[cite.n]||{}).src}</div>}

          {/* Document body */}
          <div style={{overflowY:"auto",flex:1,padding:"36px 64px"}}>
            <div style={{maxWidth:720,margin:"0 auto"}}>
              <Badge tone="saffron" style={{marginBottom:16}}>Drafting Studio</Badge>
              {/* block toolbar */}
              <div style={{display:"flex",gap:2,padding:"5px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--r)",marginBottom:18,flexWrap:"wrap"}}>
                {["H1","H2","B","i","• List","1. List","\" Quote","</> Code"].map((x,i)=>(
                  <button key={i} style={{fontSize:12.5,fontWeight:600,padding:"5px 10px",border:"none",background:"transparent",borderRadius:5,color:"var(--ink-2)",cursor:"pointer"}}>{x}</button>
                ))}
                <span style={{width:1,background:"var(--border)",margin:"2px 4px"}}/>
                <button onClick={()=>onCite({n:1})} style={{fontSize:12.5,fontWeight:600,padding:"5px 10px",border:"none",background:"transparent",borderRadius:5,color:"var(--ink-2)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}><Icon name="cite" size={13}/>Cite</button>
                <button onClick={()=>showToast("Inserted live artifact")} style={{fontSize:12.5,fontWeight:600,padding:"5px 10px",border:"none",background:"var(--blue-50)",borderRadius:5,color:"var(--blue)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}><Icon name="chart" size={13}/>Insert artifact</button>
              </div>

              <h1 style={{fontSize:27,fontWeight:700,letterSpacing:-.5,margin:"0 0 14px",color:"var(--ink)"}}>{STUDIO_DOC.title}</h1>
              <p style={{fontSize:15,lineHeight:1.7,color:"var(--ink-2)",margin:"0 0 16px"}}>
                India's aspirational districts show a persistent gap between female literacy and health-facility access. Drawing on Census 2011 and HMIS 2025, this brief quantifies the mismatch and identifies five priority districts.
              </p>
              <h2 style={{fontSize:18,fontWeight:600,margin:"22px 0 10px",color:"var(--ink)"}}>1 · The literacy-access mismatch</h2>
              <p style={{fontSize:15,lineHeight:1.7,color:"var(--ink-2)",margin:"0 0 16px"}}>
                MGNREGA per-capita wage expenditure in Rajasthan rose to ₹1,148 in FY 2023-24, a 27% increase over FY 2020-21. The embedded chart below stays live and queryable inside the document.</p>
              <div style={{border:"1px solid var(--border-2)",borderRadius:"var(--r-lg)",overflow:"hidden",margin:"0 0 18px",boxShadow:"var(--sh-1)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 13px",background:"var(--surface-2)",borderBottom:"1px solid var(--border)"}}>
                  <Icon name="chart" size={14} style={{color:"var(--blue)"}}/><span style={{fontSize:12,fontWeight:600}}>Live artifact · MGNREGA per-capita (Rajasthan)</span>
                  <Badge tone="green" style={{marginLeft:"auto"}}><Dot color="var(--green)" pulse/>interactive</Badge>
                </div>
                <div style={{padding:"16px 18px"}}>
                  <BarChart data={[{k:"FY21",v:902},{k:"FY22",v:1011},{k:"FY23",v:1074},{k:"FY24",v:1148}]} height={150} fmt={(v)=>"₹"+v}/>
                </div>
              </div>
              <h2 style={{fontSize:18,fontWeight:600,margin:"22px 0 10px",color:"var(--ink)"}}>2 · Priority districts</h2>
              <p style={{fontSize:15,lineHeight:1.7,color:"var(--ink-2)",margin:"0 0 12px"}}>Pinned from the cross-dataset merge -- fully editable as a table:</p>
              <div style={{border:"1px solid var(--border)",borderRadius:"var(--r)",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13.5}}>
                  <thead><tr>{["District","Female literacy","Facilities / 1L"].map((c,i)=><th key={i} style={{textAlign:i?"right":"left",padding:"9px 14px",background:"var(--surface-2)",fontSize:11.5,color:"var(--muted)",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid var(--border)"}}>{c}</th>)}</tr></thead>
                  <tbody>{[["Kottayam","96.4%","2.1"],["Ernakulam","95.0%","2.4"],["Mahe","97.9%","2.6"]].map((r,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid var(--surface-3)"}}>{r.map((c,j)=><td key={j} className={j?"tnum":""} style={{padding:"9px 14px",textAlign:j?"right":"left",fontWeight:j?400:600,color:j?"var(--ink-2)":"var(--ink)"}}>{c}</td>)}</tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Agent */}
        <div style={{width:rightOpen?320:0,transition:"all 0.28s cubic-bezier(.4,0,.2,1)",borderLeft:rightOpen?"1px solid var(--border)":"none",background:"var(--surface)",flexShrink:0,overflow:"hidden",display:"flex"}}>
          <div style={{width:320,height:"100%",flexShrink:0}}>
            <AIAgentPanel showToast={showToast}/>
          </div>
        </div>
      </div>
      {share&&<ShareModal onClose={()=>setShare(false)} collab={collab} onRole={setRole} onToast={showToast}/>}
    </Page>
  );
}

Object.assign(window, { HomeView, StudioView, Page, PageHead });