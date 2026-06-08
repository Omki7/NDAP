/* ============================================================
   NDAP — ASK NDAP CHAT ENGINE
   Self-animating assistant turns: routing → thinking → blocks.
   ============================================================ */

/* ---------- small bits ---------- */
function AgentAvatar({ size=30 }){
  return (
    <div style={{width:size,height:size,borderRadius:8,background:"var(--navy-800)",
      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"var(--sh-1)"}}>
      <Emblem size={size-8}/>
    </div>
  );
}
function RoutePills({ route, n }){
  return (
    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
      {route.map((r,i)=>{
        const on=i<n;
        return (
          <React.Fragment key={i}>
            {i>0 && <Icon name="chevR" size={12} style={{color: on?"var(--blue)":"var(--border-2)"}}/>}
            <span style={{fontSize:11.5,fontWeight:600,padding:"3px 9px",borderRadius:20,
              border:"1px solid",borderColor:on?"var(--blue)":"var(--border)",
              color:on?"var(--blue-700)":"var(--muted-2)",background:on?"var(--blue-50)":"var(--surface-2)",
              transition:"all .25s",display:"inline-flex",alignItems:"center",gap:5}}>
              {on && i===n-1 && <Dot color="var(--blue)" pulse/>}{r}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* Analysis trace — collapsible, shows query steps */
function ThinkTrace({ think, n, done }){
  const [open,setOpen]=useState(true);
  useEffect(()=>{ if(done) setOpen(false); },[done]);
  if(!think.length) return null;
  return (
    <div style={{margin:"10px 0 4px",border:"1px solid var(--border)",borderRadius:"var(--r)",background:"var(--surface-2)",overflow:"hidden"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,
        padding:"8px 12px",background:"none",border:"none",color:"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer"}}>
        <Icon name="bolt" size={14} style={{color:"var(--saffron)"}}/>
        <span>How this answer was found</span>
        <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
          {!done && <span style={{fontSize:11,color:"var(--saffron)"}}>Working…</span>}
          {!done && <Dot color="var(--saffron)" pulse/>}
          {done && <span style={{fontSize:11,color:"var(--green)",fontWeight:600}}>Complete</span>}
          <Icon name={open?"chevD":"chevR"} size={13}/>
        </span>
      </button>
      {open && (
        <div style={{padding:"2px 12px 10px 14px",display:"flex",flexDirection:"column",gap:6}}>
          {think.slice(0,n).map((s,i)=>(
            <div key={i} className="fade-in" style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:12.5,color:"var(--ink-2)"}}>
              <Icon name={i<n-1||done?"check":"clock"} size={13} style={{color:i<n-1||done?"var(--green)":"var(--muted-2)",marginTop:2,flexShrink:0}}/>
              <span style={{fontSize:12,lineHeight:1.5}}>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- citation superscript text ---------- */
function RichText({ md, onCite }){
  const parts = useMemo(()=>{
    const out=[]; let key=0;
    const tokens = md.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[\d+\])/g);
    tokens.forEach(tok=>{
      if(/^\*\*[^*]+\*\*$/.test(tok)) out.push(<strong key={key++}>{tok.slice(2,-2)}</strong>);
      else if(/^\*[^*]+\*$/.test(tok)) out.push(<em key={key++}>{tok.slice(1,-1)}</em>);
      else if(/^\[\d+\]$/.test(tok)){ const n=+tok.slice(1,-1);
        out.push(<sup key={key++} onClick={()=>onCite&&onCite(n)} title="View source"
          style={{color:"var(--blue)",cursor:"pointer",fontWeight:700,fontSize:".72em",padding:"0 1px",
            background:"var(--blue-50)",borderRadius:3,margin:"0 1px"}}>{n}</sup>);
      } else out.push(<span key={key++}>{tok}</span>);
    });
    return out;
  },[md]);
  return <p style={{margin:"4px 0",fontSize:14.5,lineHeight:1.6,color:"var(--ink)"}}>{parts}</p>;
}

/* ---------- helper: is this citation from a document (PDF/report) or a database? ---------- */
function isDocSource(cite){
  const url = cite.url || '';
  return url.includes('.pdf') || url.includes('rchiips.org') || url.includes('/doc/') || url.includes('indiabudget.gov.in/doc');
}

/* ---------- block renderers ---------- */
function AnswerBlock({ b, onCite }){
  return (
    <div className="rise" style={{border:"1px solid var(--border-2)",borderLeft:"3px solid var(--blue)",
      borderRadius:"var(--r)",padding:"13px 16px",background:"linear-gradient(180deg,#fff,#fafcff)",margin:"4px 0"}}>
      <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,marginBottom:4}}>{b.label}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"}}>
        <span className="tnum" style={{fontSize:30,fontWeight:700,color:"var(--navy-800)",letterSpacing:-.5}}>{b.value}</span>
        {b.unit && <span style={{fontSize:13,color:"var(--muted)"}}>{b.unit}</span>}
        {b.cites && b.cites.map(n=>(
          <sup key={n} onClick={()=>onCite&&onCite(n)} title="View source"
            style={{color:"var(--blue)",cursor:"pointer",fontWeight:700,fontSize:13,background:"var(--blue-50)",borderRadius:3,padding:"1px 4px"}}>{n}</sup>
        ))}
      </div>
      {b.note && <div style={{fontSize:12.5,color:"var(--muted)",marginTop:6}}>{b.note}</div>}
    </div>
  );
}

/* ---------- Citations — two distinct treatments: structured database vs source document ---------- */
function CitesBlock({ b, hl, onCite, onOpenPDF }){
  return (
    <div style={{margin:"8px 0",display:"flex",flexDirection:"column",gap:10}}>
      {b.items.map(c=>{
        const on=hl===c.n;
        const isDoc=isDocSource(c);
        return (
          <div key={c.n} id={`cite-${c.n}`} style={{
            border:"1px solid",
            borderColor:on?(isDoc?"var(--saffron)":"var(--blue)"):"var(--border)",
            borderLeft:`3px solid ${on?(isDoc?"var(--saffron)":"var(--blue)"):(isDoc?"var(--saffron-tint)":"var(--blue-100)")}`,
            borderRadius:"var(--r)",
            background:on?(isDoc?"var(--saffron-50)":"var(--blue-50)"):"var(--surface)",
            transition:"all .3s",
            boxShadow:on?"0 0 0 3px "+(isDoc?"var(--saffron-50)":"var(--blue-50)"):"none",
          }}>
            {/* Header */}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px 7px",borderBottom:"1px solid var(--border)"}}>
              <div style={{width:22,height:22,borderRadius:5,background:isDoc?"#c0392b":"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name={isDoc?"doc":"data"} size={12} style={{color:"#fff"}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>{c.src}</span>
                  <span style={{
                    fontSize:10,fontWeight:700,letterSpacing:.3,textTransform:"uppercase",
                    padding:"1px 7px",borderRadius:9,
                    background:isDoc?"var(--saffron-50)":"var(--blue-50)",
                    color:isDoc?"var(--saffron)":"var(--blue-700)",
                    border:`1px solid ${isDoc?"var(--saffron-tint)":"var(--blue-100)"}`,
                  }}>
                    {isDoc?"Source document":"Structured database"}
                  </span>
                  <span style={{
                    fontSize:10,fontWeight:600,padding:"1px 7px",borderRadius:9,
                    background:"var(--green-50)",color:"var(--green)",
                    border:"1px solid var(--green-tint)",
                  }}>Verified</span>
                </div>
                <div style={{fontSize:11.5,color:"var(--muted)",marginTop:2}}>{c.loc}</div>
              </div>
              <sup onClick={()=>onCite&&onCite(c.n)} title="Jump to citation"
                style={{width:18,height:18,borderRadius:5,background:on?"var(--blue)":"var(--border-2)",color:on?"#fff":"var(--muted)",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .15s"}}>{c.n}</sup>
            </div>

            {/* Data snippet */}
            <div style={{padding:"8px 12px"}}>
              <div style={{
                fontSize:isDoc?13:12,lineHeight:1.55,
                color:"var(--ink-2)",
                fontStyle:isDoc?"italic":"normal",
                fontFamily:isDoc?"inherit":"var(--mono)",
                background:isDoc?"#fffde7":"var(--surface-2)",
                border:`1px ${isDoc?"solid":"dashed"} ${isDoc?"#f9e68a":"var(--border-2)"}`,
                borderRadius:4,
                padding:"8px 11px",
              }}>
                {isDoc?`"${c.snippet}"`:c.snippet}
              </div>
            </div>

            {/* Footer — actions differ by type */}
            <div style={{padding:"6px 12px 9px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              {isDoc?(
                <>
                  {/* Document: show source link + Ask this document */}
                  <span style={{fontSize:10.5,color:"var(--muted)",display:"flex",alignItems:"center",gap:4,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    <Icon name="link" size={11} style={{flexShrink:0}}/>{c.url}
                  </span>
                  {onOpenPDF&&<button onClick={()=>onOpenPDF(c)} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:"#c0392b",background:"#fff",border:"1px solid #e8c0bc",borderRadius:20,padding:"3px 9px",cursor:"pointer",flexShrink:0,transition:"background .12s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#fff5f4"}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <Icon name="ask" size={10}/>Open &amp; ask questions
                  </button>}
                  <span style={{fontSize:10.5,color:"var(--green)",fontWeight:600,display:"flex",alignItems:"center",gap:3}}>
                    <Icon name="shield" size={11}/>Verified source
                  </span>
                </>
              ):(
                <>
                  {/* Structured: verified badge, no technical hashes */}
                  <span style={{fontSize:10.5,color:"var(--green)",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
                    <Icon name="shield" size={11} style={{flexShrink:0}}/>
                    Verified source
                  </span>
                  <span style={{marginLeft:"auto",fontSize:10.5,fontWeight:600,color:"var(--muted)",display:"flex",alignItems:"center",gap:3}}>
                    <Icon name="data" size={10}/>Government database record
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Sandbox / computation block ---------- */
function SandboxBlock({ b }){
  const [tab,setTab]=useState("output");
  return (
    <div className="rise" style={{margin:"8px 0",borderRadius:"var(--r)",overflow:"hidden",border:"1px solid var(--border-2)",boxShadow:"var(--sh-1)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"var(--surface-2)",borderBottom:"1px solid var(--border)"}}>
        <Icon name="bolt" size={15} style={{color:"var(--green)"}}/>
        <span style={{fontSize:12,color:"var(--ink)",fontWeight:600}}>Computation Details</span>
        <span style={{fontSize:10.5,color:"var(--green)",fontWeight:600,display:"flex",alignItems:"center",gap:3,marginLeft:4}}><Icon name="shield" size={10}/>Ran in secure environment</span>
        <div style={{marginLeft:"auto",display:"flex",gap:4}}>
          {["output","code"].map(tk=>(
            <button key={tk} onClick={()=>setTab(tk)} style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:5,
              border:"1px solid",cursor:"pointer",textTransform:"capitalize",
              borderColor:tab===tk?"var(--blue)":"var(--border)",
              background:tab===tk?"var(--blue-50)":"transparent",color:tab===tk?"var(--blue-700)":"var(--muted)"}}>{tk==="code"?"View code":tk==="output"?"Result":"Output"}</button>
          ))}
        </div>
      </div>
      <pre className="mono" style={{margin:0,padding:"13px 15px",background:tab==="code"?"#0a1322":"var(--surface-inset)",color:tab==="code"?"#d6e2f5":"var(--ink)",
        fontSize:12,lineHeight:1.65,overflowX:"auto",whiteSpace:"pre"}}>
        {tab==="code"? b.code : ""+b.output}
      </pre>
    </div>
  );
}

/* ---------- Chart block — owns its own type switcher ---------- */
function ChartBlock({ b }){
  const availableTypes = b.data ? ["bar","hbar","line","area","donut"] : ["bar","hbar","line"];
  const typeLabels = {bar:"Bar",hbar:"Horizontal",line:"Line",area:"Area",donut:"Pie / Donut"};
  const [type,setType] = useState(b.chart || "bar");
  const lineData = b.data ? b.data.map(d=>d.v) : [];
  const donutData = b.data ? b.data.map(d=>({k:d.k,v:d.v})) : [];

  return (
    <Card pad={15} style={{margin:"8px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
        <Icon name="chart" size={15} style={{color:"var(--blue)"}}/>
        <span style={{fontSize:13,fontWeight:600,color:"var(--ink)",flex:1}}>{b.title}</span>
        <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:"var(--muted)",marginRight:4}}>Chart type:</span>
          {availableTypes.map(t=>(
            <button key={t} onClick={()=>setType(t)} style={{padding:"3px 9px",fontSize:11,fontWeight:600,border:"1px solid",borderRadius:20,cursor:"pointer",transition:"all .12s",
              borderColor:type===t?"var(--blue)":"var(--border)",
              background:type===t?"var(--blue-50)":"transparent",
              color:type===t?"var(--blue-700)":"var(--muted)"}}>{typeLabels[t]||t}</button>
          ))}
        </div>
      </div>
      {type==="donut"&&donutData.length>0?(
        <Donut data={donutData}/>
      ):type==="hbar"&&b.data?(
        <HBars data={b.data} fmt={b.fmt||(v=>String(v))}/>
      ):(type==="line"||type==="area")&&lineData.length>0?(
        <><AreaLine data={lineData} color="var(--blue)" fill={type==="area"?"rgba(46,107,214,.12)":"rgba(0,0,0,0)"} showDots={type==="line"}/><div style={{fontSize:10.5,color:"var(--muted-2)",marginTop:6}}>{b.unit}</div></>
      ):(
        <BarChart data={b.data||[]} fmt={b.fmt||(v=>String(v))} unit={b.unit}/>
      )}
    </Card>
  );
}

/* ---------- Compare block — switchable bar / horizontal ---------- */
function CompareBlock({ b, onCite }){
  const [view,setView]=useState("hbar");
  const max=Math.max(...b.rows.map(r=>r.v));
  return (
    <Card pad={15} style={{margin:"8px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
        <span style={{fontSize:13,fontWeight:600,color:"var(--ink)",flex:1}}>{b.title}
          {b.cites&&b.cites.map(n=><sup key={n} onClick={()=>onCite&&onCite(n)} style={{color:"var(--blue)",cursor:"pointer",fontWeight:700,marginLeft:3}}>{n}</sup>)}</span>
        <div style={{display:"flex",gap:4,flexShrink:0}}>
          {[["hbar","Horizontal"],["bar","Vertical"]].map(([k,label])=>(
            <button key={k} onClick={()=>setView(k)} style={{padding:"3px 9px",fontSize:11,fontWeight:600,border:"1px solid",borderRadius:20,cursor:"pointer",transition:"all .12s",
              borderColor:view===k?"var(--blue)":"var(--border)",
              background:view===k?"var(--blue-50)":"transparent",
              color:view===k?"var(--blue-700)":"var(--muted)"}}>{label}</button>
          ))}
        </div>
      </div>
      {view==="hbar"?(
        <HBars data={b.rows} fmt={(v)=>v+"%"} max={max*1.12}/>
      ):(
        <BarChart data={b.rows.map(r=>({k:r.k,v:r.v,color:r.color}))} fmt={(v)=>v+"%"} color="var(--blue)"/>
      )}
      {b.note && <div style={{fontSize:12.5,color:"var(--muted)",marginTop:12,paddingTop:10,borderTop:"1px solid var(--border)"}}>{b.note}</div>}
    </Card>
  );
}

function TableBlock({ b, onCite }){
  const colTypes = b.colTypes||[];
  const hasColTypes = colTypes.some(Boolean);
  return (
    <Card pad={0} style={{margin:"8px 0",overflow:"hidden"}}>
      <div style={{padding:"11px 15px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
        <Icon name="table" size={15} style={{color:"var(--blue)"}}/>
        <span style={{fontSize:13,fontWeight:600}}>{b.title}</span>
        {b.cites&&b.cites.map(n=><sup key={n} onClick={()=>onCite&&onCite(n)} style={{color:"var(--blue)",cursor:"pointer",fontWeight:700}}>{n}</sup>)}
      </div>
      {hasColTypes&&(
        <div style={{padding:"5px 15px",background:"var(--surface-2)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:"var(--muted)",fontWeight:600,flexShrink:0}}>Column source:</span>
          <span style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:8,height:8,borderRadius:2,background:"var(--blue)",display:"inline-block",flexShrink:0}}/>
            <span style={{fontSize:10.5,color:"var(--blue-700)",fontWeight:600}}>Structured database</span>
          </span>
          <span style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:8,height:8,borderRadius:2,background:"#c0392b",display:"inline-block",flexShrink:0}}/>
            <span style={{fontSize:10.5,color:"#c0392b",fontWeight:600}}>PDF document</span>
          </span>
        </div>
      )}
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr>{b.cols.map((c,i)=>{
            const ct=colTypes[i];
            return (
              <th key={i} style={{textAlign:"left",padding:"9px 15px",
                background:ct==="structured"?"rgba(46,92,246,.06)":ct==="document"?"rgba(192,57,43,.06)":"var(--surface-2)",
                color:"var(--muted)",fontWeight:600,fontSize:11.5,textTransform:"uppercase",
                letterSpacing:.4,borderBottom:"1px solid var(--border)",whiteSpace:"nowrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  {ct&&<span style={{width:6,height:6,borderRadius:1,background:ct==="structured"?"var(--blue)":"#c0392b",flexShrink:0,display:"inline-block"}}/>}
                  {c}
                </div>
              </th>
            );
          })}</tr></thead>
          <tbody>{b.rows.map((r,ri)=>(
            <tr key={ri} style={{borderBottom:"1px solid var(--surface-3)"}}>
              {r.map((cell,ci)=>{
                const ct=colTypes[ci];
                return <td key={ci} className={ci>1&&ci<4?"tnum":""} style={{padding:"9px 15px",
                  color:ci===0?"var(--ink)":"var(--ink-2)",fontWeight:ci===0?600:400,
                  background:ct==="structured"?"rgba(46,92,246,.025)":ct==="document"?"rgba(192,57,43,.025)":"transparent",
                  ...(ci===4?{color:"var(--saffron)",fontWeight:600,whiteSpace:"nowrap"}:{})}}>{cell}</td>;
              })}
            </tr>
          ))}</tbody>
        </table>
      </div>
      {b.note && <div style={{padding:"9px 15px",fontSize:12,color:"var(--muted)",background:"var(--surface-2)",borderTop:"1px solid var(--border)"}}>{b.note}</div>}
    </Card>
  );
}

function JoinReportBlock({ b }){
  const hasTypes = b.leftType && b.rightType;
  return (
    <Card pad={15} style={{margin:"8px 0",borderLeft:"3px solid var(--saffron)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <Icon name="layers" size={15} style={{color:"var(--saffron)"}}/>
        <span style={{fontSize:13,fontWeight:600}}>{b.title}</span>
      </div>

      {hasTypes ? (
        /* ── two-panel source diagram ── */
        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"stretch",marginBottom:12}}>
          {/* Left: Structured DB */}
          <div style={{background:"var(--blue-50)",border:"1px solid var(--blue-100)",borderRadius:"var(--r)",padding:"10px 13px"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}>
              <div style={{width:18,height:18,borderRadius:4,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="data" size={10} style={{color:"#fff"}}/>
              </div>
              <span style={{fontSize:9.5,fontWeight:700,color:"var(--blue-700)",textTransform:"uppercase",letterSpacing:.5}}>Structured Database</span>
            </div>
            <div style={{fontSize:12.5,fontWeight:700,color:"var(--ink)",marginBottom:2}}>{b.leftSrc}</div>
            <div className="mono" style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>{b.left}</div>
            {b.leftDesc && <div style={{fontSize:10.5,color:"var(--muted-2)",lineHeight:1.4}}>{b.leftDesc}</div>}
          </div>

          {/* Join symbol */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:"0 4px"}}>
            <span style={{fontSize:22,color:"var(--saffron)",fontWeight:700,lineHeight:1}}>⋈</span>
            <div style={{fontSize:8.5,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.5,textAlign:"center",lineHeight:1.3}}>joined<br/>on</div>
            <Badge tone="saffron">{b.on}</Badge>
          </div>

          {/* Right: PDF Document */}
          <div style={{background:"var(--red-50)",border:"1px solid #e8c0bc",borderRadius:"var(--r)",padding:"10px 13px"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}>
              <div style={{width:18,height:18,borderRadius:4,background:"#c0392b",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="doc" size={10} style={{color:"#fff"}}/>
              </div>
              <span style={{fontSize:9.5,fontWeight:700,color:"#c0392b",textTransform:"uppercase",letterSpacing:.5}}>PDF Document</span>
            </div>
            <div style={{fontSize:12.5,fontWeight:700,color:"var(--ink)",marginBottom:2}}>{b.rightSrc}</div>
            <div className="mono" style={{fontSize:10,color:"var(--muted)",marginBottom:4}}>{b.right}</div>
            {b.rightDesc && <div style={{fontSize:10.5,color:"var(--muted-2)",lineHeight:1.4}}>{b.rightDesc}</div>}
          </div>
        </div>
      ) : (
        <div className="mono" style={{fontSize:11.5,color:"var(--muted)",marginBottom:10,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <Badge tone="navy">{b.left}</Badge><span style={{color:"var(--saffron)",fontWeight:700}}>⋈</span>
          <Badge tone="navy">{b.right}</Badge><span>on</span><Badge tone="saffron">{b.on}</Badge>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px 18px"}}>
        {b.rows.map((r,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",gap:10,fontSize:12.5,
            padding:"5px 0",borderBottom:"1px dotted var(--border-2)"}}>
            <span style={{color:"var(--muted)"}}>{r.k}</span>
            <span className="tnum" style={{fontWeight:600,color:r.k.startsWith("Dropped")?"var(--red)":"var(--ink)",textAlign:"right"}}>{r.v}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PdfBlock({ b }){
  return (
    <Card pad={0} style={{margin:"8px 0",overflow:"hidden"}}>
      <div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8,background:"var(--surface-2)"}}>
        <Icon name="doc" size={15} style={{color:"var(--red)"}}/>
        <span style={{fontSize:12.5,fontWeight:600}}>{b.title}</span>
        <Badge tone="red" style={{marginLeft:"auto"}}>Source document</Badge>
      </div>
      <div style={{padding:"14px",background:"#e9edf3"}}>
        <div style={{background:"#fff",border:"1px solid var(--border-2)",borderRadius:4,boxShadow:"var(--sh-2)",
          padding:"22px 26px",maxWidth:520,margin:"0 auto"}}>
          <div style={{fontSize:11,color:"var(--muted-2)",marginBottom:14,letterSpacing:.3}}>{b.page}</div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {b.lines.map((l,i)=>(
              <div key={i} className="mono" style={{fontSize:12.5,lineHeight:1.5,
                color:l.dim?"var(--muted-2)":(l.h?"var(--navy-900)":"var(--ink-2)"),fontWeight:l.h?700:400,
                background:l.h?"var(--saffron-tint)":"transparent",
                boxShadow:l.h?"0 0 0 6px var(--saffron-tint)":"none",borderRadius:l.h?2:0}}>{l.t}</div>
            ))}
          </div>
        </div>
        <div style={{textAlign:"center",fontSize:11,color:"var(--muted)",marginTop:10}}>Exact table row highlighted at the cited page position</div>
      </div>
    </Card>
  );
}

function CanonicalBlock({ b }){
  return (
    <Card pad={15} style={{margin:"8px 0"}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
        <Icon name="globe" size={15} style={{color:"var(--green)"}}/>{b.title}</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <tbody>{b.rows.map((r,i)=>(
          <tr key={i} style={{borderBottom:"1px solid var(--surface-3)"}}>
            <td style={{padding:"8px 10px 8px 0",fontWeight:600,color:"var(--ink)",width:"40%"}}>{r[0]}</td>
            <td style={{padding:"8px 0",color:"var(--muted)"}}><Icon name="chevR" size={12} style={{display:"inline",verticalAlign:"middle",color:"var(--green)"}}/> {r[1]}</td>
          </tr>
        ))}</tbody>
      </table>
    </Card>
  );
}

function RefusalBlock({ b }){
  const tone = b.tone==="red"?{bd:"var(--red)",bg:"var(--red-50)",ic:"var(--red)"}:{bd:"var(--amber)",bg:"var(--amber-50)",ic:"var(--amber)"};
  return (
    <div className="rise" style={{margin:"8px 0",border:"1px solid",borderColor:tone.bd,borderLeft:`4px solid ${tone.bd}`,
      borderRadius:"var(--r)",background:tone.bg,padding:"14px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
        <Icon name={b.icon} size={19} style={{color:tone.ic}}/>
        <span style={{fontSize:14.5,fontWeight:700,color:"var(--ink)"}}>{b.title}</span>
      </div>
      <RichText md={b.body}/>
      {b.bullets && <ul style={{margin:"8px 0 0",paddingLeft:18,fontSize:13,color:"var(--ink-2)",lineHeight:1.7}}>
        {b.bullets.map((x,i)=><li key={i}>{x}</li>)}</ul>}
      {b.violations && <div style={{display:"flex",flexDirection:"column",gap:7,marginTop:10}}>
        {b.violations.map((v,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",background:"#fff",borderRadius:5,padding:"8px 11px",border:"1px solid var(--border)"}}>
            <Badge tone="red" soft={false} style={{marginTop:1}}>{v.tag}</Badge>
            <span style={{fontSize:12.5,color:"var(--ink-2)"}}>{v.d}</span>
          </div>
        ))}</div>}
      {b.foot && <div style={{marginTop:10,paddingTop:9,borderTop:`1px solid ${tone.bd}33`,fontSize:12.5,color:"var(--ink-2)"}}>{b.foot}</div>}
    </div>
  );
}

function ClarifyBlock({ b, onGenerate }){
  const [sel,setSel]=useState({});
  const pick=(g,c)=>setSel(s=>({...s,[g]:c}));
  const ready=Object.keys(sel).length>=2;
  return (
    <div className="rise" style={{margin:"8px 0",border:"1px solid var(--blue-100)",borderLeft:"4px solid var(--blue)",
      borderRadius:"var(--r)",background:"var(--blue-tint)",padding:"14px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
        <Icon name="ask" size={18} style={{color:"var(--blue)"}}/>
        <span style={{fontSize:14.5,fontWeight:700,color:"var(--ink)"}}>{b.title}</span>
      </div>
      <p style={{margin:"0 0 12px",fontSize:13.5,color:"var(--ink-2)"}}>{b.body}</p>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {b.groups.map((g,gi)=>(
          <div key={gi}>
            <div style={{fontSize:11.5,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.5,marginBottom:7}}>{g.label}</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {g.chips.map((c,ci)=>{
                const on=sel[g.label]===c;
                return <button key={ci} onClick={()=>pick(g.label,c)} style={{fontSize:12.5,fontWeight:500,
                  padding:"6px 12px",borderRadius:20,border:"1px solid",cursor:"pointer",transition:"all .15s",
                  borderColor:on?"var(--blue)":"var(--border-2)",background:on?"var(--blue)":"#fff",color:on?"#fff":"var(--ink-2)"}}>{c}</button>;
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginTop:14}}>
        <button disabled={!ready} onClick={()=>onGenerate&&onGenerate(sel)} style={{fontSize:13,fontWeight:600,
          padding:"9px 18px",borderRadius:"var(--r)",border:"none",cursor:ready?"pointer":"not-allowed",
          background:ready?"var(--blue)":"var(--border-2)",color:"#fff",opacity:ready?1:.7,transition:"all .15s"}}>
          Generate answer →</button>
        <span style={{fontSize:11.5,color:"var(--muted)"}}>{b.note}</span>
      </div>
    </div>
  );
}

function TraceBlock({ b }){
  return (
    <Card pad={15} style={{margin:"8px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <Icon name="branch" size={15} style={{color:"var(--blue)"}}/><span style={{fontSize:13,fontWeight:600}}>{b.title}</span>
        <Badge tone="green" style={{marginLeft:"auto"}}>Fully reproducible</Badge>
      </div>
      <div style={{display:"flex",alignItems:"stretch",gap:0,flexWrap:"wrap"}}>
        {b.steps.map((s,i)=>(
          <React.Fragment key={i}>
            <div style={{flex:"1 1 130px",minWidth:130,background:"var(--surface-2)",border:"1px solid var(--border)",
              borderRadius:"var(--r)",padding:"10px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                <Icon name="check" size={13} style={{color:"var(--green)"}}/>
                <span style={{fontSize:12.5,fontWeight:700,color:"var(--navy-800)"}}>{s.s}</span>
              </div>
              <div style={{fontSize:11.5,color:"var(--muted)",lineHeight:1.4,marginBottom:6}}>{s.d}</div>
              <span style={{fontSize:11,color:"var(--blue)",fontWeight:600}}>{(s.ms/1000).toFixed(1)}s</span>
            </div>
            {i<b.steps.length-1 && <div style={{display:"flex",alignItems:"center",padding:"0 4px"}}><Icon name="chevR" size={16} style={{color:"var(--border-strong)"}}/></div>}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

function DriversBlock({ b, onCite }){
  const max=Math.max(...b.drivers.map(d=>Math.abs(d.v)));
  return (
    <Card pad={15} style={{margin:"8px 0",borderLeft:"3px solid var(--blue)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
        <Icon name="branch" size={15} style={{color:"var(--blue)"}}/>
        <span style={{fontSize:13,fontWeight:600}}>{b.title}</span>
        {b.cites&&b.cites.map(n=><sup key={n} onClick={()=>onCite&&onCite(n)} style={{color:"var(--blue)",cursor:"pointer",fontWeight:700,marginLeft:2}}>{n}</sup>)}
      </div>
      <div style={{fontSize:11.5,color:"var(--muted)",marginBottom:14}}>{b.baseline}</div>
      <div style={{display:"flex",flexDirection:"column",gap:11}}>
        {b.drivers.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:172,fontSize:12.5,color:"var(--ink-2)",textAlign:"right",flexShrink:0,lineHeight:1.25}}>{d.k}</div>
            <div style={{flex:1,height:18,background:"var(--surface-3)",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(Math.abs(d.v)/max)*100}%`,background:d.v<0?"var(--red)":"var(--green)",borderRadius:4,animation:`growW .8s cubic-bezier(.2,.7,.3,1) ${i*0.07}s both`}}/>
            </div>
            <div className="tnum" style={{width:62,fontSize:12.5,fontWeight:700,color:d.v<0?"var(--red)":"var(--green)",flexShrink:0}}>{d.v>0?"+":""}{d.v} pp</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:13,paddingTop:11,borderTop:"1px solid var(--border)"}}>
        <span style={{fontSize:12.5,fontWeight:600,color:"var(--ink)"}}>{b.totalLabel}</span>
        <span className="tnum" style={{fontSize:14,fontWeight:700,color:"var(--navy-800)"}}>{b.total}</span>
      </div>
      {b.note && <div style={{fontSize:11.5,color:"var(--muted)",marginTop:8,lineHeight:1.5}}>{b.note}</div>}
    </Card>
  );
}

function RecommendBlock({ b }){
  const TONE={High:["var(--red-50)","var(--red)"],Medium:["var(--amber-50)","var(--amber)"],Low:["var(--green-50)","var(--green)"]};
  return (
    <Card pad={15} style={{margin:"8px 0",borderLeft:"3px solid var(--saffron)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <Icon name="target" size={15} style={{color:"var(--saffron)"}}/>
        <span style={{fontSize:13,fontWeight:600}}>{b.title}</span>
        <Badge tone="amber" style={{marginLeft:"auto"}}>Model recommendation</Badge>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {b.items.map((r,i)=>{
          const tn=TONE[r.priority]||TONE.Medium;
          return (
            <div key={i} style={{display:"flex",gap:11,alignItems:"flex-start",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"10px 12px"}}>
              <span style={{width:20,height:20,borderRadius:6,background:"var(--navy-800)",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--ink)"}}>{r.action}</div>
                <div style={{fontSize:11.5,color:"var(--muted)",marginTop:2,lineHeight:1.45}}>{r.why}</div>
              </div>
              <span style={{fontSize:10.5,fontWeight:700,letterSpacing:.4,textTransform:"uppercase",color:tn[1],background:tn[0],borderRadius:20,padding:"3px 9px",flexShrink:0}}>{r.priority}</span>
            </div>
          );
        })}
      </div>
      {b.foot && <div style={{marginTop:11,paddingTop:10,borderTop:"1px solid var(--border)",fontSize:11.5,color:"var(--muted)",lineHeight:1.5}}>{b.foot}</div>}
    </Card>
  );
}

function ComplexityBlock({ b }){
  const active=b.active||[];
  return (
    <div style={{margin:"8px 0",border:"1px solid var(--border)",borderRadius:"var(--r)",background:"var(--surface-2)",padding:"11px 13px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <Icon name="layers" size={14} style={{color:"var(--saffron)"}}/>
        <span style={{fontSize:12,fontWeight:700,color:"var(--ink)"}}>Query complexity</span>
        <span style={{fontSize:11.5,color:"var(--muted)"}}>· {active.length} of 5 capabilities engaged</span>
      </div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        {COMPLEX_FEATURES.map(f=>{
          const on=active.includes(f.id);
          return (
            <span key={f.id} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11.5,fontWeight:600,padding:"4px 10px",borderRadius:20,
              border:"1px solid",borderColor:on?"var(--green)":"var(--border)",background:on?"var(--green-50)":"#fff",color:on?"var(--green)":"var(--muted-2)"}}>
              <Icon name={on?"check":"close"} size={11}/>{f.label}</span>
          );
        })}
      </div>
    </div>
  );
}

function LogsBlock(){
  const streams=[["Data Pipeline","etl","var(--green)"],["User Activity","user","var(--blue)"],["Analysis Log","inf","var(--saffron)"]];
  return (
    <div style={{margin:"8px 0",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
      {streams.map(([title,key,col])=>(
        <div key={key} style={{borderRadius:"var(--r)",overflow:"hidden",border:"1px solid var(--navy-900)"}}>
          <div style={{padding:"7px 11px",background:"var(--navy-900)",display:"flex",alignItems:"center",gap:7}}>
            <Dot color={col} pulse/><span style={{fontSize:11.5,fontWeight:600,color:"#cdd8ec"}}>{title}</span>
          </div>
          <div className="mono" style={{padding:"9px 11px",background:"#0a1322",display:"flex",flexDirection:"column",gap:6,minHeight:120}}>
            {LOG_STREAMS[key].map((l,i)=><span key={i} style={{fontSize:10.5,color:"#8fa4c6",lineHeight:1.4,wordBreak:"break-word"}}>{l}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Block({ b, hl, onCite, onGenerate, onPin, onOpenPDF }){
  switch(b.type){
    case "answer": return <AnswerBlock b={b} onCite={onCite}/>;
    case "text": return <RichText md={b.md} onCite={onCite}/>;
    case "cites": return <CitesBlock b={b} hl={hl} onCite={onCite} onOpenPDF={onOpenPDF}/>;
    case "sandbox": return <SandboxBlock b={b}/>;
    case "chart": return <ChartBlock b={b}/>;
    case "compare": return <CompareBlock b={b} onCite={onCite}/>;
    case "table": return <TableBlock b={b} onCite={onCite}/>;
    case "joinreport": return <JoinReportBlock b={b}/>;
    case "pdf": return <PdfBlock b={b}/>;
    case "canonical": return <CanonicalBlock b={b}/>;
    case "refusal": return <RefusalBlock b={b}/>;
    case "clarify": return <ClarifyBlock b={b} onGenerate={onGenerate}/>;
    case "trace": return <TraceBlock b={b}/>;
    case "drivers": return <DriversBlock b={b} onCite={onCite}/>;
    case "recommend": return <RecommendBlock b={b}/>;
    case "complexity": return <ComplexityBlock b={b}/>;
    case "logs": return <LogsBlock/>;
    default: return null;
  }
}

Object.assign(window, {
  AgentAvatar, RoutePills, ThinkTrace, RichText, Block, isDocSource,
});
