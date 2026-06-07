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
          <button onClick={()=>window.open("https://ndap.niti.gov.in/datasets","_blank")} style={{display:"inline-flex",alignItems:"center",gap:9,background:"rgba(255,255,255,.12)",color:"#fff",
            border:"1px solid rgba(255,255,255,.25)",borderRadius:"var(--r)",padding:"11px 20px",fontSize:14.5,fontWeight:600,cursor:"pointer"}}>
            <Icon name="data" size={17}/>Explore datasets ↗</button>
        </div>
      </div>

      {/* platform stats */}
      <Grid cols={4} style={{marginBottom:24}}>
        {PLATFORM_STATS.map((s,i)=><StatTile key={i} k={s.k} v={s.v} sub={s.sub} accent={["var(--blue)","var(--navy-700)","var(--saffron)","var(--green)"][i]}/>)}
      </Grid>

      {/* Analytics embedded */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:11.5,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:"var(--saffron)",marginBottom:4}}>Public transparency</div>
          <h2 style={{margin:0,fontSize:18,fontWeight:600}}>Site Analytics</h2>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:20,padding:3}}>
            <button onClick={()=>setTab("site")} style={{border:"none",background:tab==="site"?"#fff":"transparent",borderRadius:16,padding:"4px 12px",fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:tab==="site"?"0 1px 3px rgba(0,0,0,0.1)":"none",color:tab==="site"?"var(--navy-800)":"var(--muted)"}}>Site Analytics</button>
            <button onClick={()=>setTab("gis")} style={{border:"none",background:tab==="gis"?"#fff":"transparent",borderRadius:16,padding:"4px 12px",fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:tab==="gis"?"0 1px 3px rgba(0,0,0,0.1)":"none",color:tab==="gis"?"var(--navy-800)":"var(--muted)"}}>Spatial Analytics (GIS)</button>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["All India","Sector","Source"].map((x,i)=><div key={i} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12.5,color:"var(--muted)",border:"1px solid var(--border)",borderRadius:20,padding:"6px 13px",background:"#fff",cursor:"pointer"}}><Icon name="filter" size={13}/>{x}</div>)}
          </div>
        </div>
      </div>

      {tab === "site" && (
        <>
          <Grid cols={4} style={{marginBottom:22}}>
            {ANALYTICS.kpis.map((k,i)=><StatTile key={i} k={k.k} v={k.v} d={k.d} up={k.up} accent={["var(--blue)","var(--green)","var(--saffron)","var(--navy-700)"][i]}/>)}
          </Grid>
          <Grid cols={3} gap={16} style={{marginBottom:22,gridTemplateColumns:"1.7fr 1fr"}}>
            <Card>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
                <SectionTitle kicker="Traffic" title="Page views" right={null}/>
                <div style={{display:"flex",gap:5}}>{["7 days","30 days","12 months"].map(r=>(
                  <button key={r} onClick={()=>setRange(r)} style={{fontSize:11.5,fontWeight:600,padding:"5px 11px",borderRadius:20,border:"1px solid",
                    borderColor:range===r?"var(--blue)":"var(--border)",background:range===r?"var(--blue-50)":"#fff",color:range===r?"var(--blue-700)":"var(--muted)",cursor:"pointer"}}>{r}</button>
                ))}</div>
              </div>
              <AreaLine data={ANALYTICS.traffic} height={180}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11.5,color:"var(--muted)"}}><span>Day 1</span><span>Today · 462K views</span></div>
            </Card>
            <Card>
              <SectionTitle kicker="Audience" title="Browsers"/>
              <Donut data={ANALYTICS.browsers}/>
            </Card>
          </Grid>
          <Grid cols={2} gap={16}>
            <Card>
              <SectionTitle kicker="Engagement" title="Most viewed segments"/>
              <HBars data={ANALYTICS.topSegments} color="var(--blue)" fmt={(v)=>v+"K"}/>
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

/* =================== DATASETS / MDM =================== */
function DataView(){
  const [tab,setTab]=useState("catalogue");
  return (
    <Page>
      <PageHead kicker="Master Data Management" title="Datasets &amp; Ingestion"
        sub="Every source is harmonised to unified identifiers (LGD / Census / PIN) and provenance-stamped at the cell level."
        right={<button style={{display:"inline-flex",alignItems:"center",gap:8,background:"var(--navy-800)",color:"#fff",border:"none",borderRadius:"var(--r)",padding:"10px 16px",fontSize:13.5,fontWeight:600,cursor:"pointer"}}><Icon name="plus" size={15}/>Ingest source</button>}/>
      <Grid cols={4} style={{marginBottom:22}}>
        <StatTile k="Standardised datasets" v="4,812" sub="LGD-mapped" accent="var(--blue)"/>
        <StatTile k="Structured records" v="3.41 B" sub="1,082 files" accent="var(--navy-700)"/>
        <StatTile k="Documents indexed" v="1,35,400" sub="507K+ pages" accent="var(--saffron)"/>
        <StatTile k="Harmonisation rate" v="99.97%" sub="rows ID-matched" accent="var(--green)"/>
      </Grid>

      <Grid cols={3} gap={16} style={{marginBottom:22,gridTemplateColumns:"1.6fr 1fr"}}>
        {/* pipeline */}
        <Card>
          <SectionTitle kicker="Two specialised pipelines" title="Ingestion &amp; harmonisation"/>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {INGESTION_PIPELINE.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:26,height:26,borderRadius:7,background:"var(--navy-800)",color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13.5,fontWeight:600,color:"var(--ink)"}}>{s.stage}</div>
                  <div style={{fontSize:11.5,color:"var(--muted)"}}><span style={{color:"var(--blue)"}}>structured:</span> {s.structured} &nbsp;·&nbsp; <span style={{color:"var(--saffron)"}}>unstructured:</span> {s.unstructured}</div>
                </div>
                <div style={{width:110,flexShrink:0}}>
                  <div style={{height:7,background:"var(--surface-3)",borderRadius:5,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${s.health}%`,background:s.health>99?"var(--green)":"var(--saffron)",borderRadius:5}}/></div>
                  <div className="tnum" style={{fontSize:11,color:"var(--muted)",textAlign:"right",marginTop:3}}>{s.health}% health</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        {/* trend */}
        <Card>
          <SectionTitle kicker="Last 12 months" title="Ingestion volume"/>
          <AreaLine data={INGEST_TREND} color="var(--saffron)" fill="rgba(201,138,43,.13)" height={120}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:11.5,color:"var(--muted)"}}>
            <span>Jun '25</span><span className="tnum" style={{fontWeight:700,color:"var(--ink)"}}>142 GB / mo</span><span>May '26</span></div>
          <div style={{marginTop:14,padding:"11px 13px",background:"var(--green-50)",borderRadius:"var(--r)",border:"1px solid var(--green-tint)"}}>
            <div style={{fontSize:12,fontWeight:600,color:"var(--green)",display:"flex",alignItems:"center",gap:6,marginBottom:4}}><Icon name="check" size={14}/>Provenance logger</div>
            <div style={{fontSize:11.5,color:"var(--ink-2)",lineHeight:1.5}}>Every cell stamped with <b>origin URL</b>, <b>fetch timestamp</b> &amp; <b>SHA-256 checksum</b>.</div>
          </div>
        </Card>
      </Grid>

      {/* catalogue */}
      <Card pad={0}>
        <div style={{display:"flex",alignItems:"center",gap:4,padding:"12px 16px",borderBottom:"1px solid var(--border)"}}>
          {[["catalogue","Catalogue"],["provenance","Provenance log"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{fontSize:13,fontWeight:600,padding:"6px 13px",borderRadius:"var(--r)",border:"none",cursor:"pointer",
              background:tab===k?"var(--navy-800)":"transparent",color:tab===k?"#fff":"var(--muted)"}}>{l}</button>
          ))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7,fontSize:12.5,color:"var(--muted)",border:"1px solid var(--border)",borderRadius:20,padding:"5px 12px"}}>
            <Icon name="filter" size={14}/>All sectors</div>
        </div>
        {tab==="catalogue" ? (
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr>{["Dataset","Ministry / Source","Sector","Records","Granularity","ID keys","Status"].map((c,i)=>
                <th key={i} style={{textAlign:"left",padding:"10px 16px",background:"var(--surface-2)",color:"var(--muted)",fontWeight:600,fontSize:11,textTransform:"uppercase",letterSpacing:.4,borderBottom:"1px solid var(--border)",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
              <tbody>{DATASETS.map((d,i)=>(
                <tr key={i} style={{borderBottom:"1px solid var(--surface-3)"}}>
                  <td style={{padding:"11px 16px",fontWeight:600,color:"var(--ink)"}}>{d.name}</td>
                  <td style={{padding:"11px 16px",color:"var(--ink-2)"}}>{d.ministry}</td>
                  <td style={{padding:"11px 16px"}}><Badge tone="neutral">{d.sector}</Badge></td>
                  <td className="tnum" style={{padding:"11px 16px",color:"var(--ink-2)"}}>{d.rows}</td>
                  <td style={{padding:"11px 16px",color:"var(--muted)"}}>{d.granularity}</td>
                  <td style={{padding:"11px 16px"}}><div style={{display:"flex",gap:4}}>{d.id_keys.map((k,j)=><Badge key={j} tone="blue">{k}</Badge>)}</div></td>
                  <td style={{padding:"11px 16px"}}><Badge tone={d.status==="Harmonised"?"green":d.status==="Review"?"amber":"navy"}><Dot color={d.status==="Harmonised"?"var(--green)":d.status==="Review"?"var(--amber)":"var(--navy-700)"}/>{d.status}</Badge></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          <div className="mono" style={{padding:"16px",background:"#0a1322",borderRadius:"0 0 var(--r-lg) var(--r-lg)",display:"flex",flexDirection:"column",gap:7}}>
            {[
              "census-2011/KL/C08.csv  cell[R32,C7]  url=censusindia.gov.in/2011/PCA/KL  fetched=2024-11-02T04:12Z  sha256=7b41c0…d92a",
              "mgnrega/fy2024/RJ.parquet  url=nrega.nic.in/MIS/fy2024/RJ  fetched=2026-05-30T22:01Z  sha256=1c9f…8ee0  rows=33",
              "budget-2425/eb/sbe1.pdf  page=12  url=indiabudget.gov.in/doc/eb/sbe1.pdf  fetched=2025-07-23T09:40Z  sha256=2f88…ac40",
              "nfhs5/BR.pdf  indicator=44  url=rchiips.org/nfhs/NFHS-5/BR  fetched=2025-09-14T11:55Z  sha256=aa12…77c1",
            ].map((l,i)=><span key={i} style={{fontSize:11.5,color:"#8fa4c6",lineHeight:1.5,wordBreak:"break-all"}}><span style={{color:"var(--green)"}}>✓ stamped</span>  {l}</span>)}
          </div>
        )}
      </Card>
    </Page>
  );
}

/* =================== AI STUDIO -- DRAFTING STUDIO =================== */
/* Citation footnote -- one-click reveals its pinned source */
function Footnote({ n, src, onCite }){
  return (
    <sup onClick={()=>onCite({n,src})} title="One-click citation -- view source"
      style={{color:"var(--blue)",fontWeight:700,background:"var(--blue-50)",borderRadius:3,padding:"0 3px",cursor:"pointer"}}>{n}</sup>
  );
}

/* Share / manage-access modal -- collaboration controls */
function ShareModal({ onClose, collab, onRole, onToast }){
  const ROLES=["Owner","Editor","Viewer"];
  const [linkRole,setLinkRole]=useState("Viewer");
  const [linkOn,setLinkOn]=useState(false);
  const [invite,setInvite]=useState("");
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:60,background:"rgba(7,24,47,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(2px)"}}>
      <div onClick={e=>e.stopPropagation()} className="rise" style={{width:480,maxWidth:"100%",background:"var(--surface)",borderRadius:"var(--r-xl)",boxShadow:"var(--sh-pop)",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"15px 20px",borderBottom:"1px solid var(--border)"}}>
          <Icon name="users" size={18} style={{color:"var(--blue)"}}/>
          <span style={{fontSize:16,fontWeight:600}}>Manage access</span>
          <span style={{fontSize:12,color:"var(--muted)"}}>· '{STUDIO_DOC.title.split(" -- ")[0]}'</span>
          <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><Icon name="close" size={18}/></button>
        </div>
        <div style={{padding:"18px 20px"}}>
          {/* invite */}
          <div style={{display:"flex",gap:8,marginBottom:18}}>
            <input value={invite} onChange={e=>setInvite(e.target.value)} placeholder="Invite by email or @ministry directory…"
              style={{flex:1,border:"1px solid var(--border-2)",borderRadius:"var(--r)",padding:"9px 12px",fontSize:13,fontFamily:"var(--font)",outline:"none"}}/>
            <button onClick={()=>{ if(invite){ onToast("Invitation sent to "+invite); setInvite(""); } }} style={{background:"var(--navy-800)",color:"#fff",border:"none",borderRadius:"var(--r)",padding:"9px 16px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Invite</button>
          </div>
          {/* people with roles */}
          <div style={{fontSize:11.5,fontWeight:700,letterSpacing:.6,textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>People with access</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
            {collab.map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:11}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:p.color,color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.initials}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13.5,fontWeight:600,color:"var(--ink)"}}>{p.name}</div>
                  <div style={{fontSize:11.5,color:"var(--muted)"}}>{p.org}</div>
                </div>
                {p.role==="Owner" ? (
                  <span style={{fontSize:12.5,fontWeight:600,color:"var(--muted)",padding:"6px 10px"}}>Owner</span>
                ) : (
                  <select value={p.role} onChange={e=>onRole(i,e.target.value)} style={{fontSize:12.5,fontWeight:600,color:"var(--ink-2)",border:"1px solid var(--border-2)",borderRadius:"var(--r)",padding:"6px 8px",background:"#fff",cursor:"pointer",fontFamily:"var(--font)"}}>
                    {ROLES.filter(r=>r!=="Owner").map(r=><option key={r}>{r}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
          {/* permission-based link sharing */}
          <div style={{padding:"13px 14px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--r)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:linkOn?12:0}}>
              <Icon name="lock" size={16} style={{color:"var(--navy-700)"}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>Permission-based link sharing</div>
                <div style={{fontSize:11.5,color:"var(--muted)"}}>{linkOn?"Anyone with the link inside the gov network":"Restricted -- invited people only"}</div>
              </div>
              <button onClick={()=>setLinkOn(v=>!v)} aria-label="Toggle link sharing" style={{width:42,height:24,borderRadius:14,border:"none",cursor:"pointer",background:linkOn?"var(--blue)":"var(--border-strong)",position:"relative",transition:"background .15s",flexShrink:0}}>
                <span style={{position:"absolute",top:3,left:linkOn?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .15s"}}/>
              </button>
            </div>
            {linkOn && (
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {ROLES.filter(r=>r!=="Owner").map(r=>(
                  <button key={r} onClick={()=>setLinkRole(r)} style={{fontSize:12,fontWeight:600,padding:"5px 11px",borderRadius:20,border:"1px solid",cursor:"pointer",borderColor:linkRole===r?"var(--blue)":"var(--border-2)",background:linkRole===r?"var(--blue-50)":"#fff",color:linkRole===r?"var(--blue-700)":"var(--muted)"}}>{r} access</button>
                ))}
                <button onClick={()=>onToast("Share link copied")} style={{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:6,fontSize:12,fontWeight:600,color:"var(--blue)",background:"none",border:"none",cursor:"pointer"}}><Icon name="link" size={14}/>Copy link</button>
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7,marginTop:14,fontSize:11.5,color:"var(--muted)"}}>
            <Icon name="shield" size={14} style={{color:"var(--green)",flexShrink:0}}/>
            Role-based access control (RBAC) -- every view, edit &amp; export is written to the audit log.
          </div>
        </div>
      </div>
    </div>
  );
}


function StudioResourcesRail({ collab, setShare, showToast }) {
  const [pins, setPins] = React.useState([]);
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(()=>{
    const check = ()=>{
      if(window.__ndapPins && window.__ndapPins.length>0) setPins([...window.__ndapPins]);
    };
    check();
    const iv = setInterval(check, 1200);
    return ()=>clearInterval(iv);
  },[]);

  function insertPin(pin){
    showToast("Inserted '" + (pin.data&&pin.data.title ? pin.data.title : "artifact") + "' into document");
  }

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
            <div style={{fontSize:11,marginTop:4}}>Go to <b>Ask NDAP</b> -> run a query -> click <b>Pin</b> on any chart or table</div>
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
                    <div style={{display:"flex",flexDirection:"column",gap:3,opacity:.4}}>
                      {[0,1,2].map(j=><div key={j} style={{display:"flex",gap:3}}><span style={{width:3,height:3,background:"var(--muted)",borderRadius:"50%"}}/><span style={{width:3,height:3,background:"var(--muted)",borderRadius:"50%"}}/></div>)}
                    </div>
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

      {/* CITATIONS */}
      <div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>Quick cite</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {[{icon:"cite",title:"One-click citation",sub:"Auto-formatted footnote"}].map((item,i)=>(
            <div key={i} style={{background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"10px",display:"flex",alignItems:"center",gap:9,cursor:"pointer",transition:"all .15s"}}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--blue)"; e.currentTarget.style.background="#fff"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.background="var(--surface-2)"; }}
              onClick={()=>showToast(item.title+" -- coming soon in full release")}>
              <Icon name={item.icon} size={16} style={{color:"var(--blue)",flexShrink:0}}/>
              <div>
                <div style={{fontSize:12.5,fontWeight:600,color:"var(--ink)"}}>{item.title}</div>
                <div style={{fontSize:11.5,color:"var(--muted)",marginTop:1}}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
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

function AIAgentPanel({ showToast }) {
  const [input, setInput] = useState("");
  const [uploadName, setUploadName] = useState(null);
  const [histOpen, setHistOpen] = useState(false);
  const [tts, setTts] = useState(false);
  const studioSessions = [{id:1,title:"Bihar Health Brief",ts:"2h ago"},{id:2,title:"MGNREGA Analysis",ts:"yesterday"},{id:3,title:"NFHS-5 Review",ts:"3 days ago"}];
  const chatScrollRef = React.useRef(null);
  const [chat, setChat] = useState([
    { role:"assistant", text:"Hi Anaya. I'm your AI writing partner. I can help you draft, rephrase, find data, review against an RFP, or insert pinned insights. What would you like to do?" },
    { role:"user", text:"Can you review the Bihar NFHS-5 PDF and give me the key health metrics?" },
    { role:"assistant", type:"doc_summary", docName:"NFHS-5_Bihar_Factsheet.pdf",
      text:"I've analysed NFHS-5_Bihar_Factsheet.pdf. Key health metrics for Bihar:",
      bullets:["IMR: 46.8 per 1,000 live births (↓ from 48 in NFHS-4)","Institutional births: 76.2% (↑ +12.4 pp vs NFHS-4)","Full vaccination (12-23 months): 71.0%","Anaemia in children <5: 69.4%"],
      questions:["Compare Bihar's IMR to national average?","Draft a paragraph on maternal health improvements","What should we prioritise to close the gap with India?"]
    }
  ]);

  function handleSend(text){
    if(!text.trim()) return;
    const userMsg={role:"user",text};
    const lq=text.toLowerCase();
    let reply;
    if(lq.includes("rephrase")||lq.includes("rewrite")){
      reply={role:"assistant",text:"Here is a rephrased version:\n\nBihar's institutional birth rate improved from 63.8% (NFHS-4) to 76.2% (NFHS-5), reflecting sustained investment in antenatal care and JSY incentives. A 12.4 pp gap versus India (88.6%) remains.",actions:["Insert into draft","Rephrase again","Make it shorter"]};
    } else if(lq.includes("review")||lq.includes("what do you think")){
      reply={role:"assistant",text:"Overall the draft is strong. Three suggestions: (1) Strengthen the lede - lead with the headline finding. (2) Add a state comparison with Jharkhand and UP. (3) Table 2 seems misplaced in a Bihar brief.",actions:["Accept all suggestions","Discuss suggestion 1","Open full review"]};
    } else if(lq.includes("find data")||lq.includes("mgnrega")||lq.includes("data")){
      reply={role:"assistant",text:"Found relevant NDAP datasets: MGNREGA MIS FY2024 (33 districts, Rajasthan, wage exp Rs9,014 Cr), HMIS 2025 (Bihar PHC density by block), NFHS-5 Districtwise (all 38 Bihar districts). Shall I pull any into the brief?",actions:["Insert MGNREGA data","Insert HMIS table","Show all datasets"]};
    } else if(lq.includes("shorter")||lq.includes("concise")){
      reply={role:"assistant",text:"Condensed (42 words): Bihar's institutional births rose +12.4 pp (NFHS-4 to NFHS-5), driven by ANC coverage, JSY uptake, and facility density. A 12.4 pp gap vs India (88.6%) remains. Priority: scale ANC drives in 12 districts.",actions:["Insert condensed version","Make even shorter","Restore original"]};
    } else if(lq.includes("rfp")||lq.includes("upload")){
      reply={role:"assistant",text:"RFP parsed. Key requirements: (1) All claims must cite NDAP-indexed sources. (2) Executive summary 250 words max. (3) Minimum 2 visualisations required. (4) Deadline 15 June 2026. Your draft meets 3 of 4 -- executive summary is 310 words.",actions:["Shorten executive summary","Add missing citation","View full RFP checklist"]};
    } else {
      reply={role:"assistant",text:"Done. I've updated the document based on your instruction. The change is highlighted in the editor -- you can accept, reject, or ask me to refine it further.",actions:["Accept change","Reject change","Refine further"]};
    }
    setChat(t=>[...t,userMsg,reply]);
    setInput("");
    setTimeout(()=>{ if(chatScrollRef.current) chatScrollRef.current.scrollTop=chatScrollRef.current.scrollHeight; },100);
  }

  const QUICK_ACTIONS=[
    {label:"Review draft",q:"What do you think of this draft?",icon:"eye"},
    {label:"Find data",q:"Find NDAP data relevant to this brief",icon:"data"},
    {label:"Rephrase section",q:"Rephrase the literacy gap section",icon:"edit"},
    {label:"Check against RFP",q:"Check this draft against the uploaded RFP",icon:"shield"},
    {label:"Make concise",q:"Make the executive summary shorter",icon:"bolt"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"var(--surface)"}}>
      {/* Header */}
      <div style={{padding:"11px 16px",borderBottom:"1px solid var(--border)",background:"var(--surface)",flexShrink:0,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,var(--navy-800),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>
            <Icon name="sparkle" size={16}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>NDAP Agent</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>Copilot for policy drafting</div>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button onClick={()=>{setChat([{role:"assistant",text:"New session. What would you like to draft today?"}]);setUploadName(null);}} title="New chat" style={{width:28,height:28,borderRadius:6,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}><Icon name="plus" size={13}/></button>
            <button onClick={()=>setHistOpen(!histOpen)} title="Chat history" style={{width:28,height:28,borderRadius:6,border:"1px solid var(--border)",background:histOpen?"var(--surface-2)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}><Icon name="clock" size={13}/></button>
            <button onClick={()=>setTts(!tts)} title="Text to speech" style={{width:28,height:28,borderRadius:6,border:"1px solid var(--border)",background:tts?"var(--blue-50)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:tts?"var(--blue)":"var(--muted)"}}><Icon name="globe" size={13}/></button>
            <label title="Upload RFP or brief" style={{width:28,height:28,borderRadius:6,background:"var(--surface-2)",border:"1px solid var(--border)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}>
              <Icon name="upload" size={13}/>
              <input type="file" style={{display:"none"}} onChange={e=>{ if(e.target.files[0]){ setUploadName(e.target.files[0].name); handleSend("I've uploaded "+e.target.files[0].name+". Please review it."); } }}/>
            </label>
          </div>
        </div>
        {histOpen&&(
          <div style={{position:"absolute",top:"100%",right:10,zIndex:50,background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-pop)",width:220,overflow:"hidden",marginTop:4}}>
            <div style={{padding:"9px 14px",borderBottom:"1px solid var(--border)",fontSize:11.5,fontWeight:700,color:"var(--muted)"}}>Recent sessions</div>
            {studioSessions.map((s,i)=>(
              <button key={i} onClick={()=>setHistOpen(false)} style={{width:"100%",textAlign:"left",padding:"9px 14px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:"var(--ink-2)",display:"flex",alignItems:"center",gap:8}}
                onMouseEnter={e=>e.currentTarget.style.background="var(--surface-2)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Icon name="doc" size={13} style={{color:"var(--blue)"}}/><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</span><span style={{fontSize:11,color:"var(--muted)",flexShrink:0}}>{s.ts}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upload banner */}
      {uploadName&&<div style={{padding:"8px 18px",background:"var(--green-50)",borderBottom:"1px solid var(--green-tint)",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <Icon name="doc" size={14} style={{color:"var(--green)"}}/>
        <span style={{fontSize:12,fontWeight:600,color:"var(--green)"}}>{uploadName}</span>
        <span style={{fontSize:11.5,color:"var(--muted)"}}>uploaded · parsing…</span>
        <button onClick={()=>setUploadName(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><Icon name="close" size={13}/></button>
      </div>}

      {/* Chat */}
      <div ref={chatScrollRef} style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:16}}>
        {chat.map((m,i)=>(
          <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"92%"}}>
            {m.role==="user"?(
              <div style={{background:"var(--navy-800)",color:"#fff",padding:"10px 14px",borderRadius:"14px 14px 3px 14px",fontSize:13.5,lineHeight:1.5,boxShadow:"var(--sh-1)"}}>{m.text}</div>
            ):(
              <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <div style={{width:24,height:24,borderRadius:7,background:"linear-gradient(135deg,var(--navy-800),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0,marginTop:2}}><Icon name="sparkle" size={11}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{background:"#fff",border:"1px solid var(--border)",borderRadius:"3px 14px 14px 14px",padding:"12px 14px",fontSize:13.5,lineHeight:1.65,color:"var(--ink)",whiteSpace:"pre-wrap",boxShadow:"var(--sh-1)"}}>
                    {m.type==="doc_summary"?(
                      <>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:10,borderBottom:"1px solid var(--border)"}}>
                          <div style={{width:28,height:28,background:"#c0392b",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="doc" size={14} style={{color:"#fff"}}/></div>
                          <span style={{fontSize:13,fontWeight:700}}>{m.docName}</span>
                        </div>
                        <div style={{marginBottom:10}}>{m.text}</div>
                        <ul style={{margin:"0 0 14px",paddingLeft:20,color:"var(--ink-2)"}}>{m.bullets.map((b,j)=><li key={j} style={{marginBottom:5,fontSize:13}}>{b}</li>)}</ul>
                        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,color:"var(--muted)",marginBottom:8}}>Suggested follow-ups</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {m.questions.map((q,j)=>(
                            <button key={j} onClick={()=>handleSend(q)} style={{textAlign:"left",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:7,padding:"8px 10px",fontSize:12.5,color:"var(--blue-700)",fontWeight:500,cursor:"pointer",transition:"all .15s"}}
                              onMouseEnter={e=>{ e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="var(--blue-100)"; }}
                              onMouseLeave={e=>{ e.currentTarget.style.background="var(--surface-2)"; e.currentTarget.style.borderColor="var(--border)"; }}>{q}</button>
                          ))}
                        </div>
                      </>
                    ):m.text}
                  </div>
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

      {/* Quick actions */}
      <div style={{padding:"8px 14px",borderTop:"1px solid var(--border)",display:"flex",gap:6,overflowX:"auto",flexShrink:0,background:"var(--surface-2)"}}>
        {QUICK_ACTIONS.map((a,i)=>(
          <button key={i} onClick={()=>handleSend(a.q)} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,padding:"5px 10px",borderRadius:20,border:"1px solid var(--border)",background:"#fff",color:"var(--ink-2)",cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--blue)"; e.currentTarget.style.color="var(--blue)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--ink-2)"; }}>
            <Icon name={a.icon} size={12}/>{a.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{padding:"12px 14px",borderTop:"1px solid var(--border)",background:"#fff",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",border:"1px solid var(--border-strong)",borderRadius:10,padding:"7px 8px",background:"var(--surface)",boxShadow:"var(--sh-1)"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend(input)} placeholder="Ask the agent anything…" style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13.5,padding:"5px 10px",fontFamily:"var(--font)"}}/>
          <button title="Voice input" style={{background:"var(--surface-3)",color:"var(--muted)",border:"none",borderRadius:7,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginRight:2}}><Icon name="mic" size={14}/></button>
          <button onClick={()=>handleSend(input)} style={{background:input.trim()?"var(--navy-900)":"var(--border-strong)",color:"#fff",border:"none",borderRadius:7,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:input.trim()?"pointer":"default",transition:"background .15s"}}><Icon name="send" size={15}/></button>
        </div>
        <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:7}}>Agent reads your draft, pinned insights, and uploaded files</div>
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
                India's aspirational districts show a persistent gap between female literacy and health-facility access. Drawing on Census 2011 and HMIS 2025, this brief quantifies the mismatch and identifies five priority districts.<Footnote n={1} onCite={onCite}/>
              </p>
              <h2 style={{fontSize:18,fontWeight:600,margin:"22px 0 10px",color:"var(--ink)"}}>1 · The literacy-access mismatch</h2>
              <p style={{fontSize:15,lineHeight:1.7,color:"var(--ink-2)",margin:"0 0 16px"}}>
                MGNREGA per-capita wage expenditure in Rajasthan rose to ₹1,148 in FY 2023-24, a 27% increase over FY 2020-21.<Footnote n={2} onCite={onCite}/> The embedded chart below stays live and queryable inside the document.</p>
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


Object.assign(window, { HomeView, DataView, StudioView, Page, PageHead });