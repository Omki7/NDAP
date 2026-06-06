/* ============================================================
   NDAP — MODULE VIEWS
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
          <span className="en-only">Ask in natural language across 4,800+ standardised datasets and 1.3 lakh documents. Get cited, reproducible answers — with code, charts and full audit trails.</span>
          <span className="hi-only">4,800+ मानकीकृत डेटासेट और 1.3 लाख दस्तावेज़ों पर प्राकृतिक भाषा में पूछें। स्रोत-सहित, पुनरुत्पादनीय उत्तर पाएँ।</span></p>
        <div style={{display:"flex",gap:12,marginTop:22,flexWrap:"wrap"}}>
          <button onClick={()=>go("ask")} style={{display:"inline-flex",alignItems:"center",gap:9,background:"#fff",color:"var(--navy-800)",
            border:"none",borderRadius:"var(--r)",padding:"11px 20px",fontSize:14.5,fontWeight:700,cursor:"pointer"}}>
            <Icon name="ask" size={17}/>{lang==="hi"?"NDAP से पूछें":"Ask NDAP"}</button>
          <button onClick={()=>go("data")} style={{display:"inline-flex",alignItems:"center",gap:9,background:"rgba(255,255,255,.12)",color:"#fff",
            border:"1px solid rgba(255,255,255,.25)",borderRadius:"var(--r)",padding:"11px 20px",fontSize:14.5,fontWeight:600,cursor:"pointer"}}>
            <Icon name="data" size={17}/>Explore datasets</button>
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

/* =================== AI STUDIO — DRAFTING STUDIO =================== */
/* Citation footnote — one-click reveals its pinned source */
function Footnote({ n, src, onCite }){
  return (
    <sup onClick={()=>onCite({n,src})} title="One-click citation — view source"
      style={{color:"var(--blue)",fontWeight:700,background:"var(--blue-50)",borderRadius:3,padding:"0 3px",cursor:"pointer"}}>{n}</sup>
  );
}

/* Share / manage-access modal — collaboration controls */
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
          <span style={{fontSize:12,color:"var(--muted)"}}>· “{STUDIO_DOC.title.split(" — ")[0]}”</span>
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
                <div style={{fontSize:11.5,color:"var(--muted)"}}>{linkOn?"Anyone with the link inside the gov network":"Restricted — invited people only"}</div>
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
            Role-based access control (RBAC) — every view, edit &amp; export is written to the audit log.
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioResourcesRail({ collab, setShare, showToast }) {
  return (
    <div style={{width: 280, borderRight: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0, overflowY: "auto", padding: "24px 20px", display:"flex", flexDirection:"column", gap:28}}>


      {/* INSERT FROM NDAP */}
      <div>
        <div style={{fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "var(--muted)", marginBottom: 12}}>Insert from NDAP</div>
        <div style={{display:"flex", flexDirection:"column", gap:8}}>
          {[
            {icon:"chart", title:"Chart artifact", sub:"Drag a live visualisation"},
            {icon:"data", title:"Data table", sub:"Pin a queryable table"},
            {icon:"cite", title:"Citation", sub:"Auto one-click footnote"}
          ].map((item,i)=>(
            <div key={i} style={{background:"#fff", border:"1px solid var(--border)", borderRadius:"8px", padding:"12px", display:"flex", alignItems:"center", gap:10, cursor:"grab", boxShadow:"0 1px 2px rgba(0,0,0,0.03)", transition:"transform 0.15s, box-shadow 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 3px 6px rgba(0,0,0,0.06)";}} onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 1px 2px rgba(0,0,0,0.03)";}}>
              <div style={{display:"flex", flexDirection:"column", gap:3, opacity:0.3}}><span style={{width:3,height:3,background:"var(--ink)",borderRadius:"50%"}}></span><span style={{width:3,height:3,background:"var(--ink)",borderRadius:"50%"}}></span><span style={{width:3,height:3,background:"var(--ink)",borderRadius:"50%"}}></span></div>
              <Icon name={item.icon} size={16} style={{color:"var(--blue)", flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13, fontWeight:600, color:"var(--ink)"}}>{item.title}</div>
                <div style={{fontSize:11.5, color:"var(--muted)", marginTop:2}}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLLABORATION & ACCESS */}
      <div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 12}}>
          <div style={{fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: "var(--muted)"}}>Collaboration</div>
          <button onClick={()=>setShare(true)} style={{fontSize:11.5, fontWeight:600, color:"var(--blue)", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4}}><Icon name="users" size={13}/>Manage</button>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:10}}>
          {collab.map((p,i)=>(
            <div key={i} style={{display:"flex", alignItems:"center", gap:10}}>
              <div style={{width:32, height:32, borderRadius:"50%", background:p.color, color:"#fff", fontSize:11.5, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}>{p.initials}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13, fontWeight:600, color:"var(--ink)"}}>{p.name}</div>
                <div style={{fontSize:11.5, color:"var(--muted)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{p.org}</div>
              </div>
              <Badge tone="surface" style={{background:"var(--surface-3)", color:"var(--ink-2)", fontSize:11, padding:"3px 8px"}}>{p.role}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIAgentPanel({ showToast }) {
  const [input, setInput] = useState("");
  const [conv, setConv] = useState("draft");
  const [chat, setChat] = useState([
    { role:"assistant", text:"Hi Anaya. I can help you draft this brief. You can ask me to rephrase sections, find data, or generate a new paragraph." },
    { role:"user", text:"Can you review the PDF I just uploaded and summarize the key health metrics for Bihar?" },
    { role:"assistant", type:"doc_summary", docName:"NFHS-5_Bihar_Factsheet.pdf", 
      text:"I've analyzed **NFHS-5_Bihar_Factsheet.pdf**. Here is a summary of the key health metrics for Bihar:",
      bullets: [
        "Infant Mortality Rate (IMR) has decreased to 46.8 per 1000 live births.",
        "Institutional births have improved significantly to 76.2%.",
        "Children (12-23 months) fully vaccinated is at 71.0%."
      ],
      questions: [
        "Compare Bihar's IMR to the national average?",
        "What are the trends in women's empowerment indicators?",
        "Draft a paragraph on maternal health improvements in Bihar."
      ]
    }
  ]);
  const handleSend = (text) => {
    if(!text.trim()) return;
    setChat([...chat, { role:"user", text }, { role:"assistant", text:"I have processed your request and generated the content. Let me know if you want to insert this directly into the editor or refine it further.", actions:["Insert into draft", "Rephrase", "Make it shorter"] }]);
    setInput("");
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"var(--surface)"}}>
      {/* Header */}
      <div style={{padding:"18px 24px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", boxShadow:"0 1px 5px rgba(0,0,0,0.03)", zIndex:10}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <div style={{width:36, height:36, borderRadius:10, background:"linear-gradient(135deg, var(--navy-800), var(--blue-700))", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", boxShadow:"0 4px 10px rgba(0,0,0,0.15)"}}>
            <Icon name="sparkle" size={18}/>
          </div>
          <div>
            <div style={{fontSize:13.5, fontWeight:700, color:"var(--ink)", letterSpacing:"-0.2px"}}>NDAP Agent</div>
            <select value={conv} onChange={e=>setConv(e.target.value)} style={{fontSize:11.5, color:"var(--muted)", border:"none", background:"transparent", outline:"none", padding:0, cursor:"pointer", fontWeight:500, fontFamily:"var(--font)"}}>
              <option value="draft">Rural Health Brief Analysis</option>
              <option value="new">Agriculture Policy Q&A</option>
              <option value="old">General Assistance</option>
            </select>
          </div>
        </div>
        <button style={{background:"var(--surface-2)", border:"1px solid var(--border-2)", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--ink-2)", transition:"background 0.2s"}} title="New Conversation" onMouseEnter={e=>e.currentTarget.style.background="var(--border)"} onMouseLeave={e=>e.currentTarget.style.background="var(--surface-2)"}><Icon name="plus" size={16}/></button>
      </div>

      {/* Chat History */}
      <div style={{flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:24, padding:"28px 24px", background:"var(--surface)"}}>
        {chat.map((m,i)=>(
          <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start", maxWidth:"88%"}}>
            {m.role==="user" ? (
              <div style={{background:"var(--navy-900)", color:"#fff", padding:"14px 18px", borderRadius:"18px 18px 4px 18px", fontSize:14, lineHeight:1.5, boxShadow:"var(--sh-2)"}}>
                {m.text}
              </div>
            ) : (
              <div style={{display:"flex", gap:12}}>
                <div style={{width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg, var(--blue-700), var(--blue))", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0, marginTop:2, boxShadow:"0 2px 4px rgba(0,85,255,0.2)"}}><Icon name="sparkle" size={12}/></div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{background:"#fff", color:"var(--ink)", border:"1px solid var(--border-2)", padding:"14px 16px", borderRadius:"4px 16px 16px 16px", fontSize:13.5, lineHeight:1.6, boxShadow:"0 2px 6px rgba(0,0,0,0.03)"}}>
                    {m.type === "doc_summary" ? (
                      <>
                        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10, paddingBottom:10, borderBottom:"1px solid var(--border-2)"}}>
                          <Icon name="doc" size={18} style={{color:"var(--red)"}}/>
                          <span style={{fontSize:13, fontWeight:600}}>{m.docName}</span>
                        </div>
                        <div style={{marginBottom:12}}>{m.text}</div>
                        <ul style={{margin:0, paddingLeft:22, marginBottom:14, color:"var(--ink-2)"}}>
                          {m.bullets.map((b,idx)=><li key={idx} style={{marginBottom:6}}>{b}</li>)}
                        </ul>
                        <div style={{fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, color:"var(--muted)", marginBottom:10}}>Suggested questions</div>
                        <div style={{display:"flex", flexDirection:"column", gap:8}}>
                          {m.questions.map((q,idx)=>(
                            <button key={idx} onClick={()=>handleSend(q)} style={{textAlign:"left", background:"var(--surface-2)", border:"1px solid var(--border)", borderRadius:"8px", padding:"10px 12px", fontSize:12.5, color:"var(--blue-700)", fontWeight:500, cursor:"pointer", transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="var(--blue-200)"; e.currentTarget.style.boxShadow="0 2px 4px rgba(0,0,0,0.03)"}} onMouseLeave={e=>{e.currentTarget.style.background="var(--surface-2)"; e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="none"}}>{q}</button>
                          ))}
                        </div>
                      </>
                    ) : (
                      m.text
                    )}
                  </div>
                  {m.actions && (
                    <div style={{display:"flex", gap:8, marginTop:10, flexWrap:"wrap"}}>
                      {m.actions.map((act,idx)=>(
                         <button key={idx} style={{background:"#fff", border:"1px solid var(--border-strong)", borderRadius:24, padding:"6px 14px", fontSize:12, fontWeight:600, color:"var(--ink-2)", cursor:"pointer", transition:"background 0.2s", boxShadow:"0 1px 2px rgba(0,0,0,0.03)"}} onMouseEnter={e=>e.currentTarget.style.background="var(--surface-2)"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>{act}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Quick prompt chips at bottom */}
        <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:"auto", paddingTop:10}}>
           <button onClick={()=>handleSend("What do you think of this draft?")} style={{background:"#fff", border:"1px solid var(--blue-200)", borderRadius:24, padding:"8px 14px", fontSize:12, fontWeight:600, color:"var(--blue-700)", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>Review draft</button>
           <button onClick={()=>handleSend("Rephrase the literacy gap section")} style={{background:"#fff", border:"1px solid var(--blue-200)", borderRadius:24, padding:"8px 14px", fontSize:12, fontWeight:600, color:"var(--blue-700)", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>Rephrase sections</button>
           <button onClick={()=>handleSend("Find data on MGNREGA")} style={{background:"#fff", border:"1px solid var(--blue-200)", borderRadius:24, padding:"8px 14px", fontSize:12, fontWeight:600, color:"var(--blue-700)", cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>Find data</button>
        </div>
      </div>

      {/* Input Area */}
      <div style={{padding:"20px 24px", background:"#fff", borderTop:"1px solid var(--border)", boxShadow:"0 -4px 12px rgba(0,0,0,0.02)"}}>
        <div style={{display:"flex", alignItems:"center", border:"1px solid var(--border-strong)", borderRadius:"12px", padding:"8px 10px", background:"var(--surface)", transition:"all 0.2s", boxShadow:"var(--sh-1)"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend(input)} placeholder="Ask NDAP Agent..." style={{flex:1, border:"none", background:"transparent", outline:"none", fontSize:14, padding:"8px 14px", fontFamily:"var(--font)"}}/>
          <button onClick={()=>handleSend(input)} style={{background:input.trim()?"var(--navy-900)":"var(--border-strong)", color:"#fff", border:"none", borderRadius:8, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:input.trim()?"pointer":"not-allowed", transition:"background 0.2s, opacity 0.2s"}}><Icon name="send" size={16}/></button>
        </div>
        <div style={{fontSize:11, color:"var(--muted)", textAlign:"center", marginTop:10, letterSpacing:0.3}}>Agent can read your draft, datasets, and uploaded files.</div>
      </div>
    </div>
  );
}

function StudioView(){
  const [toast, setToast] = useState("");
  const [share, setShare] = useState(false);
  const [cite, setCite] = useState(null);            // active footnote popover
  const [collab, setCollab] = useState(STUDIO_COLLAB);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 3000); };
  const onCite = (c) => { setCite(c); setTimeout(()=>setCite(null), 3200); };
  const setRole = (i,r) => setCollab(cs=>cs.map((c,j)=>j===i?{...c,role:r}:c));

  const CITES={
    1:{src:"Census 2011 · PCA Table C-08 · p.1834"},
    2:{src:"MGNREGA MIS · FY 2023–24 · Rajasthan"},
  };

  return (
    <Page pad={0}>
      <div style={{display:"flex", height:"calc(100vh - 55px)", overflow:"hidden", position:"relative"}}>
        {/* Left Inner Rail: Resources & Collab */}
        <div style={{width: leftOpen ? 280 : 0, opacity: leftOpen ? 1 : 0, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden", flexShrink: 0, display: "flex"}}>
          <StudioResourcesRail collab={collab} setShare={setShare} showToast={showToast} />
        </div>

        {/* editor */}
        <div style={{flex:1,overflowY:"auto",padding:"32px 60px",position:"relative", background:"#fff", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}}>
          <button onClick={() => setLeftOpen(!leftOpen)} style={{position: "fixed", left: leftOpen ? 264 : 16, top: 120, zIndex: 100, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "var(--sh-2)", color: "var(--ink-2)", transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}} title={leftOpen ? "Collapse Left Panel" : "Expand Left Panel"}>
            <Icon name={leftOpen ? "chevL" : "chevR"} size={16}/>
          </button>
          <button onClick={() => setRightOpen(!rightOpen)} style={{position: "fixed", right: rightOpen ? 416 : 16, top: 120, zIndex: 100, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "var(--sh-2)", color: "var(--ink-2)", transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)"}} title={rightOpen ? "Collapse Right Panel" : "Expand Right Panel"}>
            <Icon name={rightOpen ? "chevR" : "chevL"} size={16}/>
          </button>
          {toast && <div className="fade-in" style={{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",background:"var(--navy-800)",color:"#fff",padding:"10px 20px",borderRadius:20,fontSize:13,fontWeight:600,boxShadow:"var(--sh-2)",zIndex:100,maxWidth:420}}><Icon name="check" size={15} style={{marginRight:8,color:"var(--green)",verticalAlign:"middle"}}/>{toast}</div>}
          {cite && <div className="fade-in" style={{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",background:"#fff",border:"1px solid var(--blue)",color:"var(--ink)",padding:"10px 16px",borderRadius:"var(--r)",fontSize:12.5,fontWeight:600,boxShadow:"var(--sh-pop)",zIndex:100,display:"flex",alignItems:"center",gap:8}}><span style={{width:18,height:18,borderRadius:5,background:"var(--blue)",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{cite.n}</span>Source [{cite.n}] · {(CITES[cite.n]||{}).src}</div>}
          <div style={{maxWidth:720,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,flexWrap:"wrap"}}>
              <Badge tone="saffron">Drafting Studio</Badge>
              <span style={{fontSize:12,color:"var(--muted)"}}>{STUDIO_DOC.meta}</span>
              <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                <GhostBtn icon="doc" label="Export .docx" onClick={()=>showToast("Exported Rural_Health_Brief.docx — citations preserved as footnotes")}/>
                <GhostBtn icon="download" label="Export .pdf" onClick={()=>showToast("Exported Rural_Health_Brief.pdf")}/>
              </div>
            </div>
            {/* block toolbar */}
            <div style={{display:"flex",gap:3,padding:"6px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--r)",marginBottom:18,flexWrap:"wrap"}}>
              {["H1","H2","B","i","• List","1. List","“ Quote","</> Code"].map((x,i)=>(
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
            <h2 style={{fontSize:18,fontWeight:600,margin:"22px 0 10px",color:"var(--ink)"}}>1 · The literacy–access mismatch</h2>
            <p style={{fontSize:15,lineHeight:1.7,color:"var(--ink-2)",margin:"0 0 16px"}}>
              MGNREGA per-capita wage expenditure in Rajasthan rose to ₹1,148 in FY 2023–24, a 27% increase over FY 2020–21.<Footnote n={2} onCite={onCite}/> The embedded chart below stays live and queryable inside the document.</p>

            {/* live embedded artifact */}
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
            <p style={{fontSize:15,lineHeight:1.7,color:"var(--ink-2)",margin:"0 0 12px"}}>Pinned from the cross-dataset merge — fully editable as a table:</p>
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
        {/* right rail: AI Agent Panel */}
        <div style={{width: rightOpen ? 400 : 0, opacity: rightOpen ? 1 : 0, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", borderLeft: rightOpen ? "1px solid var(--border)" : "none", background: "var(--surface)", flexShrink: 0, overflow: "hidden", display: "flex"}}>
          <div style={{width: 400, height: "100%", flexShrink: 0}}>
            <AIAgentPanel showToast={showToast} />
          </div>
        </div>
      </div>
      {share && <ShareModal onClose={()=>setShare(false)} collab={collab} onRole={setRole} onToast={showToast}/>}
    </Page>
  );
}

Object.assign(window, { HomeView, DataView, StudioView, Page, PageHead });
