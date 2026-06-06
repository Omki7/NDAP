/* ============================================================
   NDAP — CHAT VIEW (orchestration)
   ============================================================ */

/* build the render-data for a category (handles multi-turn) */
function turnData(cat, ti){
  if(cat.multiturn){
    const tn=cat.turns[ti];
    return { ...cat, query:tn.query, queryRoman:cat.queryRoman, think:tn.think, blocks:tn.blocks,
      anchors:tn.anchors, applied:tn.applied, _ti:ti, _last:ti===cat.turns.length-1 };
  }
  return { ...cat, _ti:null };
}

/* ---------- one assistant turn (self-animating) ---------- */
function AssistantMessage({ data, onDone, onGenerate, onPin }){
  const route=data.route||[], think=data.think||[], blocks=data.blocks||[];
  const [phase,setPhase]=useState("route");
  const [routeN,setRouteN]=useState(0);
  const [thinkN,setThinkN]=useState(0);
  const [hl,setHl]=useState(null);
  const doneRef=useRef(false);
  useEffect(()=>{
    const tos=[]; let d=180;
    route.forEach((_,i)=>{ tos.push(setTimeout(()=>setRouteN(i+1),d)); d+=280; });
    tos.push(setTimeout(()=>setPhase("think"),d)); d+=160;
    think.forEach((_,i)=>{ tos.push(setTimeout(()=>setThinkN(i+1),d)); d+=340; });
    tos.push(setTimeout(()=>{ setPhase("done"); if(!doneRef.current){doneRef.current=true; onDone&&onDone();} },d+250));
    return ()=>tos.forEach(clearTimeout);
  },[]);
  const onCite=(n)=>{ setHl(n); };
  const done=phase==="done";
  return (
    <div style={{display:"flex",gap:12,maxWidth:820}}>
      <AgentAvatar/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
          <span style={{fontSize:13,fontWeight:700,color:"var(--navy-800)",whiteSpace:"nowrap"}}>NDAP Reasoning Engine</span>
          <Badge tone="saffron">{data.agent}</Badge>
        </div>
        <RoutePills route={route} n={routeN}/>
        {/* context anchors (multi-turn) */}
        {data.anchors && (phase!=="route") && (
          <div style={{margin:"10px 0 2px"}}>
            {data.applied && <div style={{fontSize:11.5,color:"var(--green)",fontWeight:600,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
              <Icon name="check" size={13}/>{data.applied}</div>}
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {data.anchors.map((a,i)=><Badge key={i} tone={a.k==="Compare"?"blue":a.k==="Metric"?"navy":"green"}>
                <span style={{opacity:.7}}>{a.k}:</span>&nbsp;{a.v}</Badge>)}
            </div>
          </div>
        )}
        <ThinkTrace think={think} n={thinkN} done={done}/>
        {done && (
          <div className="fade-in">
            {blocks.map((b,i)=><Block key={i} b={b} hl={hl} onCite={onCite} onGenerate={onGenerate} onPin={onPin}/>)}
            <div style={{display:"flex",alignItems:"center",gap:16,marginTop:10,paddingTop:9,borderTop:"1px solid var(--border)",flexWrap:"wrap"}}>
              <MetaPill icon="clock" label="Latency" v={data.latency}/>
              <MetaPill icon="bolt" label="Tokens" v={data.tokens || "1.2k"}/>
              <span style={{marginLeft:"auto",display:"flex",gap:8}}>
                {onPin && <GhostBtn icon="star" label="Pin" onClick={()=>{
                  const v = blocks.find(b => ["chart","table","compare","answer","sandbox","joinreport","drivers","recommend"].includes(b.type));
                  if(v) onPin({id: Math.random().toString(36).substr(2,9), data: v});
                }}/>}
                <GhostBtn icon="refresh" label="Reproduce"/>
                <GhostBtn icon="download" label="Export"/>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function MetaPill({ icon, label, v, mono }){
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11.5,color:"var(--muted)"}}>
      <Icon name={icon} size={13} style={{color:"var(--muted-2)"}}/>
      <span>{label}</span>
      <span className={mono?"mono":"tnum"} style={{fontWeight:700,color:"var(--ink)"}}>{v}</span>
    </span>
  );
}
function GhostBtn({ icon, label, onClick }){
  return (
    <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11.5,fontWeight:600,
      color:"var(--muted)",background:"none",border:"1px solid var(--border)",borderRadius:20,padding:"4px 11px",cursor:"pointer"}}>
      <Icon name={icon} size={13}/>{label}</button>
  );
}

/* ---------- user bubble ---------- */
function UserBubble({ text, roman, voice }){
  return (
    <div style={{display:"flex",justifyContent:"flex-end"}}>
      <div style={{maxWidth:640}}>
        <div style={{background:"var(--navy-800)",color:"#fff",borderRadius:"12px 12px 3px 12px",
          padding:"11px 15px",fontSize:14.5,lineHeight:1.5,boxShadow:"var(--sh-2)"}}>
          {voice && <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11.5,color:"#9fb6dd",marginBottom:5}}>
            <Icon name="mic" size={13}/>Voice input · हिंदी</span>}
          <div>{text}</div>
        </div>
        {roman && <div style={{fontSize:11.5,color:"var(--muted)",textAlign:"right",marginTop:5,fontStyle:"italic"}}>{roman}</div>}
      </div>
    </div>
  );
}

/* ---------- category launcher card ---------- */
const CAT_COLORS={A:"var(--blue)",B:"var(--saffron)",C:"var(--green)",D:"var(--navy-700)",E:"var(--red)",
  F:"var(--green)",G:"var(--blue)",H:"var(--amber)",I:"var(--navy-700)",J:"var(--red)",K:"var(--blue)"};
function CatCard({ cat, onClick }){
  return (
    <Card hover pad={14} onClick={onClick} style={{display:"flex",flexDirection:"column",gap:7,height:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <span style={{width:26,height:26,borderRadius:7,background:CAT_COLORS[cat.letter],color:"#fff",
          fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cat.letter}</span>
        <span style={{fontSize:13.5,fontWeight:600,color:"var(--ink)"}}>{cat.name}</span>
      </div>
      <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.4}}>{cat.purpose}</div>
      <div style={{marginTop:"auto",display:"flex",alignItems:"center",gap:7,paddingTop:8,borderTop:"1px dashed var(--border-2)"}}>
        <Icon name="ask" size={13} style={{color:CAT_COLORS[cat.letter],flexShrink:0}}/>
        <span style={{fontSize:11.5,color:"var(--ink-2)",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {cat.voice?cat.queryRoman:`"${cat.query || (cat.turns && cat.turns[0] && cat.turns[0].query) || ''}"`}</span>
      </div>
    </Card>
  );
}

/* ---------- synthetic clarify follow-up answer ---------- */
function clarifyAnswer(sel){
  const ds=sel["Dataset / definition"]||"PLFS (usual status)";
  const geo=sel["Geography"]||"All-India";
  const yr=sel["Time period"]||"2023–24";
  const co=sel["Cohort"]||"All ages 15+";
  return { agent:"Retrieval Agent", route:["Intent Router","Retrieval Agent","Visualisation Agent"], id:"clr1",
    latency:"1.04 s", cost:"₹0.07", think:["Parameters now specified","Retrieving "+ds+" · "+geo+" · "+yr],
    blocks:[
      { type:"answer", label:`Unemployment rate — ${geo} · ${ds} · ${yr} · ${co}`, value:"3.2%", unit:"usual status (ps+ss)", cites:[1] },
      { type:"text", md:`With your parameters (**${ds}**, ${geo}, ${yr}, ${co}), the unemployment rate is **3.2%**.[1] Now that the dimensions are specified, NDAP returns a single auditable figure.` },
      { type:"cites", items:[{ n:1, src:"PLFS Annual Report 2023–24", loc:"Statement 14 · "+geo,
        snippet:"Unemployment rate (usual status, ps+ss), persons 15+: 3.2%.", url:"mospi.gov.in/plfs/2024", checksum:"sha256:5e2c…91aa" }] },
    ] };
}

/* keyword → category match for free text */
function matchCat(text){
  const q=text.toLowerCase();
  const map=[["why",10],["driver",10],["causal",10],["prioriti",10],["root cause",10],
    ["kerala",0],["literacy rate",0],["per capita",1],["per-capita",1],["mgnrega",1],
    ["immuni",2],["institutional birth",2],["merge",3],["interoper",3],["pm-kisan",4],["budget",4],
    ["hindi",5],["राजस्थान",5],["unemployment",6],["predict",7],["2035",7],["forecast",7],
    ["trace",8],["logs",8],["ignore",9],["system prompt",9],["fabricate",9]];
  for(const [kw,idx] of map){ if(q.includes(kw)) return idx; }
  return -1;
}

/* ============ CHAT VIEW ============ */
function ChatView({ lang }){
  const [sessions, setSessions] = useState([
    { id: 1, title: "Initial Session", thread: [], timestamp: Date.now() }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [pinnedInsights, setPinnedInsights] = useState([]);
  
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const thread = activeSession ? activeSession.thread : [];

  const [followup,setFollowup]=useState(null); // {catId, ti}
  const [input,setInput]=useState("");
  const [listening,setListening]=useState(false);
  const scrollRef=useRef(null);
  const idRef=useRef(0);
  const nid=()=>++idRef.current;

  useEffect(()=>{
    const el=scrollRef.current; if(!el) return;
    el.scrollTop=el.scrollHeight;
    let n=0; const iv=setInterval(()=>{ el.scrollTop=el.scrollHeight; if(++n>26) clearInterval(iv); },200);
    return ()=>clearInterval(iv);
  },[thread,followup]);

  function updateActiveThread(newThreadOrFn) {
    setSessions(prev => prev.map(s => {
      if(s.id === activeSessionId){
        const nextThread = typeof newThreadOrFn === "function" ? newThreadOrFn(s.thread) : newThreadOrFn;
        let newTitle = s.title;
        if(nextThread.length > 0 && s.title === "Initial Session" && nextThread[0].role === "user") {
          newTitle = nextThread[0].text;
        }
        return { ...s, thread: nextThread, title: newTitle };
      }
      return s;
    }));
  }

  function pushCatTurn(cat, ti){
    const d=turnData(cat, ti);
    updateActiveThread(t=>[...t,
      { id:nid(), role:"user", text:d.query, roman:cat.voice?cat.queryRoman:null, voice:cat.voice },
      { id:nid(), role:"assistant", data:d, catId:cat.id, ti }]);
    setFollowup(null);
  }

  function launchCat(cat){
    if(cat.voice){ setListening(true); setTimeout(()=>{ setListening(false); pushCatTurn(cat,0); },1100); }
    else pushCatTurn(cat, cat.multiturn?0:null);
  }

  function onAssistantDone(item){
    const cat=CATS.find(c=>c.id===item.catId);
    if(cat && cat.multiturn && item.ti!=null && item.ti<cat.turns.length-1){
      setFollowup({ catId:cat.id, ti:item.ti+1 });
    }
  }

  function runFollowup(){
    const cat=CATS.find(c=>c.id===followup.catId);
    pushCatTurn(cat, followup.ti);
  }

  function onGenerate(sel){
    const d=clarifyAnswer(sel);
    updateActiveThread(t=>[...t, { id:nid(), role:"assistant", data:d, catId:null, ti:null }]);
  }

  function submitInput(){
    const text=input.trim(); if(!text) return;
    setInput("");
    const idx=matchCat(text);
    if(idx>=0){ launchCat(CATS[idx]); return; }
    updateActiveThread(t=>[...t,
      { id:nid(), role:"user", text },
      { id:nid(), role:"assistant", data:{ agent:"Intent Router", route:["Intent Router"], id:"fb",
        latency:"0.21 s", cost:"₹0.01", think:["No matching demo dataset for free input"],
        blocks:[{ type:"refusal", tone:"amber", icon:"warn", title:"Demo dataset scope",
          body:"This sandbox is loaded with the **10 evaluation datasets** only. Pick a demo category below to see the full behaviour, or rephrase toward the loaded datasets (Census, MGNREGA, NFHS-5, PLFS, Budget, etc.).",
          bullets:["No external sources are accessed during the demo (per RFP §1.3)."] }] }}]);
  }

  function createNewChat() {
    const newId = Date.now();
    setSessions(prev => [{ id: newId, title: "New Session", thread: [], timestamp: newId }, ...prev]);
    setActiveSessionId(newId);
    setFollowup(null);
  }

  function handlePinBlock(blockData) {
    if(!pinnedInsights.some(p => p.id === blockData.id)) {
      setPinnedInsights(prev => [...prev, blockData]);
      if(!rightOpen) setRightOpen(true);
    }
  }

  function handleUnpinBlock(blockId) {
    setPinnedInsights(prev => prev.filter(p => p.id !== blockId));
  }

  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  function startRename(s) {
    setEditingSessionId(s.id);
    setEditingTitle(s.title);
  }
  function saveRename(e, id) {
    if(e.key && e.key !== "Enter") return;
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: editingTitle || s.title } : s));
    setEditingSessionId(null);
  }
  function deleteSession(id) {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      if(next.length === 0) return [{ id: Date.now(), title: "New Session", thread: [], timestamp: Date.now() }];
      return next;
    });
    if(activeSessionId === id) setActiveSessionId(sessions.find(s => s.id !== id)?.id || Date.now());
  }
  function togglePinSession(id) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s));
  }
  function shareSession() {
    alert("Share link copied to clipboard!");
  }

  const empty=thread.length===0;

  return (
    <div style={{display:"flex", height:"100%", width:"100%", overflow:"hidden", background:"var(--surface)", fontFamily:"var(--font)"}}>
      {/* LEFT SIDEBAR */}
      <div style={{
        width: leftOpen ? 260 : 0, transition:"width 0.3s ease", borderRight: leftOpen ? "1px solid var(--border)" : "none",
        background:"var(--surface-2)", display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden"
      }}>
        <div style={{padding:"16px", flexShrink:0}}>
          <button onClick={createNewChat} style={{
            width:"100%", padding:"10px 14px", background:"var(--blue)", color:"#fff", border:"none", cursor:"pointer",
            borderRadius:"var(--r)", display:"flex", alignItems:"center", gap:8, fontWeight:600, fontSize:14
          }}>
            <Icon name="plus" size={16}/> New Chat
          </button>
        </div>
        <div style={{flex:1, overflowY:"auto", padding:"0 12px 16px"}}>
          <div style={{fontSize:11.5, fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:10, marginLeft:4}}>Recent Sessions</div>
          <div style={{display:"flex", flexDirection:"column", gap:4}}>
            {[...sessions].sort((a,b) => (b.pinned?1:0) - (a.pinned?1:0) || b.timestamp - a.timestamp).map(s => {
              const active = s.id === activeSessionId;
              return (
              <div key={s.id} className="session-item" style={{position:"relative", display:"flex", alignItems:"center"}}>
                <button onClick={() => {if(editingSessionId!==s.id) setActiveSessionId(s.id)}}
                  style={{
                    flex:1, textAlign:"left", padding:"10px 12px", background: active ? "var(--blue-50)" : "transparent",
                    border:"none", borderRadius:"var(--r)", cursor:"pointer", color: active ? "var(--blue-700)" : "var(--ink)",
                    display:"flex", alignItems:"center", gap:8, fontSize:13.5, fontWeight: active ? 600 : 500,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"
                  }}>
                  <Icon name={s.pinned ? "star" : "message"} size={14} style={{color: s.pinned ? "var(--saffron)" : (active ? "var(--blue)" : "var(--muted)"), flexShrink:0}}/>
                  {editingSessionId === s.id ? (
                    <input autoFocus value={editingTitle} onChange={e=>setEditingTitle(e.target.value)} onKeyDown={e=>saveRename(e, s.id)} onBlur={e=>saveRename(e, s.id)} style={{border:"none", borderBottom:"1px solid var(--blue)", background:"transparent", outline:"none", color:"inherit", fontFamily:"inherit", fontSize:"inherit", fontWeight:"inherit", width:"100%"}} onClick={e=>e.stopPropagation()}/>
                  ) : (
                    <span style={{overflow:"hidden", textOverflow:"ellipsis"}}>{s.title}</span>
                  )}
                </button>
                <div className="session-actions" style={{position:"absolute", right:4, display:"flex", gap:2, background: active ? "var(--blue-50)" : "var(--surface-2)", padding:"2px", borderRadius:4}}>
                  <button onClick={(e)=>{e.stopPropagation(); startRename(s)}} title="Rename" style={{border:"none", background:"transparent", color:"var(--muted)", cursor:"pointer", padding:"4px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:4}}><Icon name="edit" size={13}/></button>
                  <button onClick={(e)=>{e.stopPropagation(); shareSession()}} title="Share" style={{border:"none", background:"transparent", color:"var(--muted)", cursor:"pointer", padding:"4px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:4}}><Icon name="link" size={13}/></button>
                  <button onClick={(e)=>{e.stopPropagation(); togglePinSession(s.id)}} title={s.pinned?"Unpin chat":"Pin chat"} style={{border:"none", background:"transparent", color:"var(--muted)", cursor:"pointer", padding:"4px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:4}}><Icon name="star" size={13}/></button>
                  <button onClick={(e)=>{e.stopPropagation(); deleteSession(s.id)}} title="Delete" style={{border:"none", background:"transparent", color:"var(--muted)", cursor:"pointer", padding:"4px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:4}}><Icon name="close" size={13}/></button>
                </div>
              </div>
            )})}
            <style>{`.session-actions { opacity: 0; transition: opacity 0.2s; } .session-item:hover .session-actions { opacity: 1; }`}</style>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{display:"flex", flexDirection:"column", flex:1, height:"100%", position:"relative", minWidth:0}}>
        
        {/* Top Header / Toggles */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderBottom: "1px solid var(--border)", zIndex:10}}>
          <button onClick={() => setLeftOpen(!leftOpen)} title="Toggle Sidebar" style={{
            background:"transparent", border:"none", cursor:"pointer", color:"var(--muted)", display:"flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:8
          }}>
            <Icon name="menu" size={20}/>
          </button>
          
          <button onClick={() => setRightOpen(!rightOpen)} title="Pinned Insights" style={{
            background: rightOpen ? "var(--saffron-50)" : "transparent", border:"none", cursor:"pointer", color: rightOpen ? "var(--saffron)" : "var(--muted)", display:"flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:8, position:"relative"
          }}>
            <Icon name="star" size={20}/>
            {pinnedInsights.length > 0 && <span style={{position:"absolute", top:4, right:4, background:"var(--saffron)", width:8, height:8, borderRadius:"50%"}}></span>}
          </button>
        </div>

        {/* thread / hero */}
        <div ref={scrollRef} style={{flex:1, overflowY:"auto", padding:empty?"0":"12px 0 26px"}}>
          {empty ? (
            <div style={{maxWidth:860, margin:"0 auto", padding:"20px 28px"}}>
              <div style={{display:"flex", alignItems:"center", gap:13, marginBottom:8}}>
                <AgentAvatar size={46}/>
                <div>
                  <h1 style={{margin:0, fontSize:28, fontWeight:700, letterSpacing:-0.4, color:"var(--ink)"}}>
                    <span className="en-only">Ask NDAP</span><span className="hi-only">NDAP से पूछें</span></h1>
                  <div style={{fontSize:14, color:"var(--muted)", marginTop:2}}>
                    <span className="en-only">Natural-language analysis over India's standardised public data — with citations, code, and full traceability.</span>
                    <span className="hi-only">भारत के मानकीकृत सार्वजनिक डेटा पर प्राकृतिक-भाषा विश्लेषण — स्रोत, कोड और पूर्ण पारदर्शिता के साथ।</span>
                  </div>
                </div>
              </div>
              <div style={{display:"flex", alignItems:"center", gap:8, margin:"30px 0 16px"}}>
                <span style={{fontSize:11.5, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--saffron)"}}>
                  11 Evaluation Categories</span>
                <span style={{flex:1, height:1, background:"var(--border)"}}/>
                <span style={{fontSize:11.5, color:"var(--muted)"}}>click any to run the scripted demo</span>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:12}}>
                {CATS.map(c=><CatCard key={c.id} cat={c} onClick={()=>launchCat(c)}/>)}
              </div>
            </div>
          ) : (
            <div style={{maxWidth:860, margin:"0 auto", padding:"0 28px", display:"flex", flexDirection:"column", gap:26}}>
              {thread.map(item=> item.role==="user"
                ? <UserBubble key={item.id} text={item.text} roman={item.roman} voice={item.voice}/>
                : <AssistantMessage key={item.id} data={item.data} onDone={()=>onAssistantDone(item)} onGenerate={onGenerate} onPin={handlePinBlock}/>)}
              {followup && <FollowupChip catId={followup.catId} ti={followup.ti} onRun={runFollowup}/>}
            </div>
          )}
        </div>

        {/* category quick-rail */}
        {!empty && (
          <div style={{borderTop:"1px solid var(--border)", background:"var(--surface-2)", padding:"8px 28px", display:"flex", alignItems:"center", gap:8, overflowX:"auto"}}>
            <span style={{fontSize:11, fontWeight:600, color:"var(--muted)", flexShrink:0}}>Replay:</span>
            {CATS.map(c=>(
              <button key={c.id} onClick={()=>launchCat(c)} title={c.name} style={{flexShrink:0, width:24, height:24, borderRadius:6,
                border:"1px solid var(--border-2)", background:"#fff", color:CAT_COLORS[c.letter], fontWeight:700, fontSize:12, cursor:"pointer"}}>{c.letter}</button>
            ))}
          </div>
        )}

        {/* composer */}
        <div style={{borderTop:"1px solid var(--border)", background:"var(--surface)", padding:"16px 28px"}}>
          <div style={{maxWidth:860, margin:"0 auto"}}>
            <div style={{display:"flex", alignItems:"center", gap:10, border:"1px solid var(--border-2)", borderRadius:"var(--r-lg)",
              padding:"6px 6px 6px 16px", background:listening?"var(--blue-tint)":"var(--surface)", boxShadow:"var(--sh-1)", transition:"background 0.2s"}}>
              <Icon name="search" size={18} style={{color:"var(--muted-2)", flexShrink:0}}/>
              <input value={listening?"":input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter") submitInput(); }}
                placeholder={listening?"🎙 Listening… (हिंदी)":"Ask NDAP..."}
                style={{flex:1, border:"none", outline:"none", fontSize:14.5, background:"transparent", color:"var(--ink)", fontFamily:"var(--font)"}}/>
              <button onClick={()=>launchCat(CATS[5])} title="Voice (Hindi demo)" style={{width:38, height:38, borderRadius:8, border:"none",
                background:listening?"var(--blue)":"var(--surface-3)", color:listening?"#fff":"var(--muted)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>
                <Icon name="mic" size={18}/></button>
              <button onClick={submitInput} style={{width:38, height:38, borderRadius:8, border:"none",
                background:"var(--blue)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer"}}>
                <Icon name="send" size={18}/></button>
            </div>
            <div style={{fontSize:11, color:"var(--muted-2)", marginTop:8, textAlign:"center"}}>
              Sandboxed demo · only the 10 provided datasets are accessible · all answers carry citations &amp; execution traces
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR - PINNED INSIGHTS */}
      <div style={{
        width: rightOpen ? 300 : 0, transition:"width 0.3s ease", borderLeft: rightOpen ? "1px solid var(--border)" : "none",
        background:"var(--surface-2)", display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden"
      }}>
        <div style={{padding:"16px 16px 12px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:10, flexShrink:0}}>
          <Icon name="star" size={18} style={{color:"var(--saffron)"}}/>
          <div style={{fontSize:14, fontWeight:700, color:"var(--ink)"}}>Pinned Insights</div>
          <button onClick={()=>setRightOpen(false)} style={{marginLeft:"auto", background:"transparent", border:"none", cursor:"pointer", color:"var(--muted)"}}>
            <Icon name="close" size={16}/>
          </button>
        </div>
        <div style={{flex:1, overflowY:"auto", padding:"16px"}}>
          {pinnedInsights.length === 0 ? (
            <div style={{textAlign:"center", color:"var(--muted)", fontSize:13, marginTop:40}}>
              <Icon name="star" size={32} style={{color:"var(--border-strong)", marginBottom:10, opacity:0.6}}/>
              <div>Pin interesting charts and metrics<br/>to keep them handy here.</div>
            </div>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:16}}>
              {pinnedInsights.map((block, i) => (
                <div key={i} className="rise" style={{position:"relative"}}>
                  <button onClick={() => handleUnpinBlock(block.id)} style={{
                    position:"absolute", top:4, right:4, width:24, height:24, borderRadius:4, background:"var(--surface-3)", 
                    border:"none", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)", zIndex:10, cursor:"pointer"
                  }} title="Unpin">
                    <Icon name="close" size={14}/>
                  </button>
                  <div style={{zoom:0.85, transformOrigin:"top left", width:"117%", pointerEvents:"none"}}>
                    <Block b={block.data} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function FollowupChip({ catId, ti, onRun }){
  const cat=CATS.find(c=>c.id===catId); const q=cat.turns[ti].query;
  return (
    <div className="fade-in" style={{display:"flex",justifyContent:"flex-end"}}>
      <button onClick={onRun} style={{display:"inline-flex",alignItems:"center",gap:9,background:"#fff",
        border:"1px dashed var(--blue)",borderRadius:20,padding:"8px 15px",cursor:"pointer",boxShadow:"var(--sh-1)"}}>
        <Icon name="ask" size={14} style={{color:"var(--blue)"}}/>
        <span style={{fontSize:12.5,color:"var(--muted)"}}>Suggested follow-up:</span>
        <span style={{fontSize:13,fontWeight:600,color:"var(--navy-800)"}}>{q}</span>
        <Icon name="chevR" size={14} style={{color:"var(--blue)"}}/>
      </button>
    </div>
  );
}

Object.assign(window, { ChatView });
