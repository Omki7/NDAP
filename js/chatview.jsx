/* ============================================================
   NDAP — CHAT VIEW  (premium sidebar · thread lines · pinned panel · PDF modal)
   ============================================================ */

/* ─── Data Sources Panel ─── */
function DataFusionPanel({structured,unstructured}){
  return (
    <div style={{margin:"10px 0 6px",border:"1px solid var(--border)",borderRadius:"var(--r)",overflow:"hidden"}}>
      <div style={{padding:"8px 12px",background:"var(--surface-2)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:6}}>
        <Icon name="layers" size={12} style={{color:"var(--navy-800)"}}/>
        <span style={{fontSize:11,fontWeight:700,color:"var(--ink)",textTransform:"uppercase",letterSpacing:.5}}>Where this answer comes from</span>
        <span style={{marginLeft:"auto",fontSize:10.5,color:"var(--green)",fontWeight:600,display:"flex",alignItems:"center",gap:3}}>
          <Icon name="shield" size={10}/>All sources verified
        </span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
        <div style={{padding:"10px 13px",borderRight:"1px solid var(--border)"}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}>
            <div style={{width:20,height:20,borderRadius:5,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="data" size={11} style={{color:"#fff"}}/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"var(--blue-700)",letterSpacing:.3}}>Government Databases</div>
              <div style={{fontSize:9.5,color:"var(--muted)",marginTop:1}}>Structured data — queried from official databases</div>
            </div>
          </div>
          {structured.slice(0,3).map((s,i)=>(
            <div key={i} style={{fontSize:12,color:"var(--ink-2)",marginTop:3,display:"flex",alignItems:"flex-start",gap:5,lineHeight:1.35}}>
              <Icon name="chevR" size={11} style={{color:"var(--blue)",flexShrink:0,marginTop:2}}/>{s}
            </div>
          ))}
          <div style={{fontSize:10.5,color:"var(--muted)",marginTop:8,display:"flex",alignItems:"center",gap:3,borderTop:"1px solid var(--border)",paddingTop:7}}>
            <Icon name="lock" size={10}/>India-only data residency
          </div>
        </div>
        <div style={{padding:"10px 13px"}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}>
            <div style={{width:20,height:20,borderRadius:5,background:"#c0392b",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="doc" size={11} style={{color:"#fff"}}/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#c0392b",letterSpacing:.3}}>Government Documents</div>
              <div style={{fontSize:9.5,color:"var(--muted)",marginTop:1}}>Reports &amp; PDFs — searched from indexed documents</div>
            </div>
          </div>
          {unstructured.slice(0,3).map((s,i)=>(
            <div key={i} style={{fontSize:12,color:"var(--ink-2)",marginTop:3,display:"flex",alignItems:"flex-start",gap:5,lineHeight:1.35}}>
              <Icon name="chevR" size={11} style={{color:"#c0392b",flexShrink:0,marginTop:2}}/>{s}
            </div>
          ))}
          <div style={{fontSize:10.5,color:"var(--muted)",marginTop:8,display:"flex",alignItems:"center",gap:3,borderTop:"1px solid var(--border)",paddingTop:7}}>
            <Icon name="ask" size={10}/>Click any document citation to open and ask questions
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PDF Modal ─── */
function PDFModal({cite,onClose}){
  const [pdfQ,setPdfQ]=useState("");
  const [pdfThread,setPdfThread]=useState([
    {role:"assistant",text:"Document loaded. I can answer questions about this source.",page:null}
  ]);
  const scrollRef=useRef(null);

  const CITATIONS=[
    {page:3,para:2,text:cite.snippet||"Key finding from this document relevant to your query."},
    {page:7,para:1,text:"Secondary reference cited in the NDAP index — fully traceable."},
    {page:12,para:4,text:"Supporting statistical table — data sourced from primary survey."},
  ];

  function askPDF(){
    if(!pdfQ.trim()) return;
    const q=pdfQ; setPdfQ("");
    const lq=q.toLowerCase();
    let ans,page;
    if(lq.includes("where")||lq.includes("page")||lq.includes("find")){
      ans="This information appears on page "+CITATIONS[0].page+", paragraph "+CITATIONS[0].para+". The NDAP pointer is: "+cite.loc+"."; page=CITATIONS[0].page;
    } else if(lq.includes("method")){
      ans="The methodology is described on pages 8-10. The survey used a stratified random sample with standard CAPI tools, consistent with NSSO guidelines."; page=8;
    } else {
      ans="Based on "+cite.src+" (p."+CITATIONS[0].page+"): "+CITATIONS[0].text; page=CITATIONS[0].page;
    }
    setPdfThread(t=>[...t,{role:"user",text:q,page:null},{role:"assistant",text:ans,page}]);
    setTimeout(()=>{if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},80);
  }

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:300,background:"rgba(7,24,47,.60)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"88vw",maxWidth:1060,height:"84vh",background:"#fff",borderRadius:"var(--r-xl)",boxShadow:"var(--sh-pop)",display:"flex",overflow:"hidden"}}>

        {/* Left: Document */}
        <div style={{flex:1,display:"flex",flexDirection:"column",borderRight:"1px solid var(--border)"}}>
          <div style={{padding:"12px 18px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10,background:"var(--surface-2)",flexShrink:0}}>
            <div style={{width:30,height:30,background:"#c0392b",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="doc" size={15} style={{color:"#fff"}}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cite.src}</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>{cite.loc}</div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><Icon name="close" size={18}/></button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"24px 32px",background:"#d8d8d8"}}>
            <div style={{background:"#fff",boxShadow:"0 3px 14px rgba(0,0,0,.18)",maxWidth:640,margin:"0 auto",padding:"40px 52px",minHeight:820,fontFamily:"Georgia,serif"}}>
              <div style={{textAlign:"center",borderBottom:"2px solid var(--navy-800)",paddingBottom:18,marginBottom:22}}>
                <div style={{fontSize:9.5,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>Government of India</div>
                <div style={{fontSize:16,fontWeight:700,color:"var(--navy-800)",lineHeight:1.3,marginBottom:3}}>{cite.src}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{cite.loc}</div>
              </div>
              <div style={{background:"#fffde7",border:"2px solid #f9a825",borderRadius:5,padding:"12px 16px",marginBottom:20,position:"relative"}}>
                <div style={{position:"absolute",top:-9,left:14,background:"#f9a825",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,textTransform:"uppercase",letterSpacing:.4}}>NDAP highlight</div>
                <div style={{fontSize:13.5,lineHeight:1.7,color:"var(--ink)",fontStyle:"italic"}}>"{cite.snippet||"Key statistical finding from this source, verified and indexed by NDAP."}"</div>
              </div>
              <p style={{fontSize:13,lineHeight:1.8,color:"#333",marginBottom:16}}>This document is part of India's official statistical reporting framework. Collected through systematic surveys following standard methodology established by the relevant Ministry or Department.</p>
              <p style={{fontSize:13,lineHeight:1.8,color:"#333",marginBottom:16}}>The National Data and Analytics Platform (NDAP) has indexed, verified, and made this source fully searchable under the National Data Sharing and Accessibility Policy (NDSAP).</p>
              <div style={{marginTop:28,padding:"10px 13px",background:"var(--surface-2)",borderRadius:5,fontSize:10.5,color:"var(--muted)",display:"flex",alignItems:"center",gap:6}}>
                <Icon name="shield" size={13} style={{color:"var(--green)",flexShrink:0}}/>
                <span>NDAP verified source · indexed and searchable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Citations + Q&A */}
        <div style={{width:340,display:"flex",flexDirection:"column",background:"var(--surface)"}}>
          {/* Citations panel */}
          <div style={{padding:"13px 16px",borderBottom:"1px solid var(--border)",background:"var(--surface-2)",flexShrink:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--ink)",marginBottom:10}}>Source citations</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {CITATIONS.map((c,i)=>(
                <div key={i} style={{background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"9px 12px",fontSize:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                    <span style={{background:"var(--blue)",color:"#fff",fontSize:9.5,fontWeight:700,padding:"1px 6px",borderRadius:4}}>p.{c.page}</span>
                    <span style={{fontSize:10,color:"var(--muted)"}}>Para {c.para}</span>
                  </div>
                  <div style={{fontSize:11.5,color:"var(--ink-2)",lineHeight:1.5,fontStyle:"italic"}}>"{c.text}"</div>
                </div>
              ))}
            </div>
          </div>

          {/* Q&A */}
          <div style={{padding:"10px 16px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--ink)"}}>Ask this document</div>
          </div>
          <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
            {pdfThread.map((m,i)=>(
              <div key={i}>
                {m.role==="assistant"?(
                  <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <AgentAvatar size={22}/>
                    <div style={{flex:1}}>
                      {m.page&&<div style={{fontSize:10.5,fontWeight:700,color:"var(--blue)",marginBottom:3}}>Page {m.page}</div>}
                      <div style={{background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"4px 12px 12px 12px",padding:"9px 12px",fontSize:12.5,color:"var(--ink)",lineHeight:1.55}}>{m.text}</div>
                    </div>
                  </div>
                ):(
                  <div style={{display:"flex",justifyContent:"flex-end"}}>
                    <div style={{background:"var(--navy-800)",color:"#fff",borderRadius:"12px 12px 3px 12px",padding:"8px 12px",fontSize:12.5,maxWidth:"80%",lineHeight:1.5}}>{m.text}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{padding:"10px 14px",borderTop:"1px solid var(--border)",flexShrink:0}}>
            <div style={{display:"flex",gap:7,marginBottom:8}}>
              {["What page?","Methodology?","Key finding?"].map((q,i)=>(
                <button key={i} onClick={()=>{setPdfQ(q);}} style={{fontSize:11,fontWeight:600,color:"var(--blue-700)",background:"var(--blue-50)",border:"1px solid var(--blue-100)",borderRadius:20,padding:"4px 9px",cursor:"pointer",whiteSpace:"nowrap"}}>{q}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center",border:"1px solid var(--border-2)",borderRadius:8,padding:"6px 8px",background:"#fff"}}>
              <input value={pdfQ} onChange={e=>setPdfQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askPDF()} placeholder="Ask about this document…" style={{flex:1,border:"none",outline:"none",fontSize:13,fontFamily:"var(--font)",background:"transparent"}}/>
              <button onClick={askPDF} style={{width:30,height:30,borderRadius:6,background:pdfQ.trim()?"var(--blue)":"var(--border-strong)",color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s"}}><Icon name="send" size={13}/></button>
            </div>
            <button onClick={onClose} style={{width:"100%",marginTop:8,padding:"7px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:6,fontSize:12,fontWeight:600,color:"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}
              onMouseEnter={e=>e.currentTarget.style.background="var(--surface-3)"} onMouseLeave={e=>e.currentTarget.style.background="var(--surface-2)"}>
              <Icon name="chevL" size={13}/>Return to Ask NDAP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ChatGPT-style thread lines on right margin ─── */
function ThreadLines({thread,scrollRef}){
  const [hov,setHov]=useState(null);
  const userMsgs=thread.filter(m=>m.role==="user");
  if(userMsgs.length===0) return null;
  return (
    <div style={{position:"absolute",right:0,top:0,bottom:0,width:14,zIndex:5}}>
      {userMsgs.map((m,i)=>{
        const pct=userMsgs.length===1?50:(i/(userMsgs.length-1))*100;
        return (
          <div key={m.id} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
            onClick={()=>{const el=document.getElementById("cm-"+m.id);if(el&&scrollRef.current){scrollRef.current.scrollTop=Math.max(0,el.offsetTop-70);}}}
            title={typeof m.text==="string"?m.text.substring(0,80):("Q"+(i+1))}
            style={{position:"absolute",top:"calc("+pct+"% - 1px)",right:2,width:hov===i?10:5,height:3,background:hov===i?"var(--blue)":"rgba(0,0,0,.22)",borderRadius:2,cursor:"pointer",transition:"all .15s"}}>
            {hov===i&&(
              <div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",background:"var(--navy-900)",color:"#fff",fontSize:10.5,padding:"4px 9px",borderRadius:4,whiteSpace:"nowrap",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",zIndex:10,pointerEvents:"none",boxShadow:"var(--sh-2)"}}>
                {typeof m.text==="string"?m.text.substring(0,50):("Q"+(i+1))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Pinned Responses Sidebar ─── */
function PinnedSidebar({pins,onRemove,open}){
  return (
    <div style={{width:open?250:0,transition:"width 0.28s cubic-bezier(.4,0,.2,1)",borderLeft:open?"1px solid var(--border)":"none",background:"var(--surface-2)",display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
      <div style={{width:250,height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"13px 15px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
          <div style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>Pinned responses</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{pins.length} item{pins.length!==1?"s":""} · available in AI Studio</div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:10}}>
          {pins.length===0?(
            <div style={{textAlign:"center",padding:"24px 12px",color:"var(--muted)",fontSize:12,lineHeight:1.6}}>
              <Icon name="star" size={26} style={{color:"var(--border-strong)",marginBottom:8}}/>
              <div>Pin any response to save it here</div>
              <div style={{fontSize:11,marginTop:4}}>Items appear in AI Studio's left rail</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {pins.map(pin=>(
                <div key={pin.id} style={{background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"10px 12px"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:7,marginBottom:7}}>
                    <Icon name={pin.data?.type==="chart"?"chart":"data"} size={14} style={{color:"var(--blue)",flexShrink:0,marginTop:2}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pin.data?.label||pin.data?.title||pin.src||"Insight"}</div>
                      <div style={{fontSize:10.5,color:"var(--muted)",marginTop:1}}>{pin.ts||"just now"}</div>
                    </div>
                    <button onClick={()=>onRemove(pin.id)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",padding:2,flexShrink:0}}><Icon name="close" size={11}/></button>
                  </div>
                  <div style={{fontSize:11,color:"var(--blue-700)",fontWeight:600,background:"var(--blue-50)",border:"1px solid var(--blue-100)",borderRadius:4,padding:"5px 8px",display:"flex",alignItems:"center",gap:5}}>
                    <Icon name="studio" size={11}/>In AI Studio left rail
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

/* ─── Turn data builder ─── */
function turnData(cat,ti){
  if(cat.multiturn){const tn=cat.turns[ti];return{...cat,query:tn.query,queryRoman:cat.queryRoman,think:tn.think,blocks:tn.blocks,anchors:tn.anchors,applied:tn.applied,_ti:ti,_last:ti===cat.turns.length-1};}
  return{...cat,_ti:null};
}

/* ─── AssistantMessage with chart switcher + pin + PDF links ─── */
function AssistantMessage({data,onDone,onGenerate,onPin,onOpenPDF}){
  const route=data.route||[],think=data.think||[],blocks=data.blocks||[];
  const [phase,setPhase]=useState("route");
  const [routeN,setRouteN]=useState(0);
  const [thinkN,setThinkN]=useState(0);
  const [hl,setHl]=useState(null);
  const doneRef=useRef(false);

  useEffect(()=>{
    const tos=[];let d=180;
    route.forEach((_,i)=>{tos.push(setTimeout(()=>setRouteN(i+1),d));d+=280;});
    tos.push(setTimeout(()=>setPhase("think"),d));d+=160;
    think.forEach((_,i)=>{tos.push(setTimeout(()=>setThinkN(i+1),d));d+=340;});
    tos.push(setTimeout(()=>{setPhase("done");if(!doneRef.current){doneRef.current=true;onDone&&onDone();}},d+250));
    return()=>tos.forEach(clearTimeout);
  },[]);

  const done=phase==="done";
  const hasChart=blocks.some(b=>b.type==="chart");
  const hasSandbox=blocks.some(b=>b.type==="sandbox"||b.type==="joinreport"||b.type==="trace");
  const allCites=blocks.filter(b=>b.type==="cites").flatMap(b=>b.items||[]);
  const pdfCites=allCites.filter(c=>c.url&&(c.url.includes("rchiips")||c.url.includes("nfhs")||c.url.includes(".pdf")||c.url.includes("report")));
  const showFusion=hasSandbox&&pdfCites.length>0;

  return (
    <div style={{display:"flex",gap:12,maxWidth:820}}>
      <AgentAvatar/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:7,flexWrap:"wrap"}}>
          <span style={{fontSize:13,fontWeight:700,color:"var(--navy-800)"}}>NDAP Assistant</span>
          <Badge tone="saffron">{data.agent}</Badge>
        </div>
        <RoutePills route={route} n={routeN}/>
        {data.anchors&&phase!=="route"&&(
          <div style={{margin:"8px 0 2px"}}>
            {data.applied&&<div style={{fontSize:11,color:"var(--green)",fontWeight:600,marginBottom:5,display:"flex",alignItems:"center",gap:5}}><Icon name="check" size={12}/>{data.applied}</div>}
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{data.anchors.map((a,i)=><Badge key={i} tone={a.k==="Compare"?"blue":a.k==="Metric"?"navy":"green"}><span style={{opacity:.7}}>{a.k}:</span>&nbsp;{a.v}</Badge>)}</div>
          </div>
        )}
        <ThinkTrace think={think} n={thinkN} done={done}/>
        {done&&showFusion&&<DataFusionPanel structured={["Structured Database (SQL/DuckDB)",...allCites.filter(c=>!isDocSource(c)).slice(0,2).map(c=>c.src)].slice(0,3)} unstructured={[...new Set(pdfCites.map(c=>c.src))].slice(0,3)}/>}
        {done&&(
          <div>
            {blocks.map((b,i)=><Block key={i} b={b} hl={hl} onCite={n=>setHl(n)} onGenerate={onGenerate} onPin={onPin} onOpenPDF={onOpenPDF}/>)}
            <div style={{display:"flex",alignItems:"center",gap:12,marginTop:9,paddingTop:8,borderTop:"1px solid var(--border)",flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:"var(--muted)"}}>{data.latency}</span>
              <span style={{marginLeft:"auto",display:"flex",gap:6}}>
                <button onClick={()=>{
                  const v=blocks.find(b=>["chart","table","compare","answer","sandbox","joinreport","drivers","recommend"].includes(b.type));
                  if(v){const pin={id:Math.random().toString(36).slice(2,9),data:v,src:data.agent,ts:new Date().toLocaleTimeString()};onPin&&onPin(pin);if(!window.__ndapPins)window.__ndapPins=[];window.__ndapPins.unshift(pin);}
                }} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:"var(--muted)",background:"none",border:"1px solid var(--border)",borderRadius:20,padding:"4px 10px",cursor:"pointer"}}><Icon name="star" size={12}/>Pin</button>
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

function GhostBtn({icon,label,onClick}){return <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:"var(--muted)",background:"none",border:"1px solid var(--border)",borderRadius:20,padding:"4px 10px",cursor:"pointer"}}><Icon name={icon} size={12}/>{label}</button>;}
function MetaPill({label,v}){return <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,color:"var(--muted)"}}>{label}<span className="tnum" style={{fontWeight:700,color:"var(--ink)"}}>{v}</span></span>;}
function UserBubble({text,roman,voice}){
  return (
    <div style={{display:"flex",justifyContent:"flex-end"}}>
      <div style={{maxWidth:640}}>
        <div style={{background:"var(--navy-800)",color:"#fff",borderRadius:"12px 12px 3px 12px",padding:"10px 15px",fontSize:14,lineHeight:1.5,boxShadow:"var(--sh-2)"}}>
          {voice&&<span style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#9fb6dd",marginBottom:4}}><Icon name="mic" size={12}/>Voice · Hindi</span>}
          <div>{text}</div>
        </div>
        {roman&&<div style={{fontSize:11,color:"var(--muted)",textAlign:"right",marginTop:4,fontStyle:"italic"}}>{roman}</div>}
      </div>
    </div>
  );
}
function clarifyAnswer(sel){
  const ds=sel["Dataset / definition"]||"PLFS";const geo=sel["Geography"]||"All-India";const yr=sel["Time period"]||"2023-24";const co=sel["Cohort"]||"All ages 15+";
  return{agent:"Retrieval Agent",route:["Intent Router","Retrieval Agent","Visualisation Agent"],id:"clr1",latency:"1.04 s",cost:"Rs0.07",think:["Parameters specified","Retrieving "+ds+" * "+geo+" * "+yr],blocks:[
    {type:"answer",label:"Unemployment rate - "+geo+" * "+ds+" * "+yr+" * "+co,value:"3.2%",unit:"usual status (ps+ss)",cites:[1]},
    {type:"text",md:"With your parameters, the unemployment rate is **3.2%**.[1]"},
    {type:"cites",items:[{n:1,src:"PLFS Annual Report 2023-24",loc:"Statement 14 * "+geo,snippet:"Unemployment rate (usual status, ps+ss): 3.2%.",url:"mospi.gov.in/plfs/2024"}]},
  ]};
}
function matchCat(text){
  const q=text.toLowerCase();
  const map=[["why",10],["driver",10],["causal",10],["prioriti",10],["root cause",10],["kerala",0],["literacy",0],["per capita",1],["mgnrega",1],["immuni",2],["institutional birth",2],["merge",3],["interoper",3],["pm-kisan",4],["budget",4],["hindi",5],["unemployment",6],["predict",7],["2035",7],["forecast",7],["trace",8],["logs",8],["ignore",9],["system prompt",9],["fabricate",9]];
  for(const [kw,idx] of map){if(q.includes(kw)) return idx;}
  return -1;
}

const CAT_COLORS={A:"var(--blue)",B:"var(--saffron)",C:"var(--green)",D:"var(--navy-700)",E:"var(--red)",F:"var(--green)",G:"var(--blue)",H:"var(--amber)",I:"var(--navy-700)",J:"var(--red)",K:"var(--blue)"};
function CatCard({cat,onClick}){
  const fused=["K","B","E","D"].includes(cat.letter);
  return (
    <Card hover pad={13} onClick={onClick} style={{display:"flex",flexDirection:"column",gap:6,height:"100%",cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:24,height:24,borderRadius:6,background:CAT_COLORS[cat.letter],color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cat.letter}</span>
        <span style={{fontSize:13,fontWeight:600,color:"var(--ink)",flex:1}}>{cat.name}</span>

      </div>
      <div style={{fontSize:11.5,color:"var(--muted)",lineHeight:1.4}}>{cat.purpose}</div>
      {fused&&<div style={{fontSize:10.5,color:"var(--blue-700)",background:"var(--blue-50)",borderRadius:4,padding:"3px 7px",display:"flex",alignItems:"center",gap:4}}><Icon name="layers" size={11}/>Uses databases + government documents</div>}
      <div style={{marginTop:"auto",paddingTop:7,borderTop:"1px dashed var(--border-2)",fontSize:11,color:"var(--ink-2)",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
        {cat.voice?cat.queryRoman:`"${cat.query||(cat.turns&&cat.turns[0]?.query)||""}"`}
      </div>
    </Card>
  );
}

/* ─── Premium Session Item ─── */
function SessionItem({s,active,editingSessionId,editingTitle,setEditingTitle,saveRename,setActiveSessionId,startRename,deleteSession,togglePinSession}){
  const [hover,setHover]=useState(false);
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{position:"relative"}}>
      <button onClick={()=>{if(editingSessionId!==s.id) setActiveSessionId(s.id);}}
        style={{width:"100%",textAlign:"left",padding:"9px 11px",background:active?"rgba(255,255,255,.12)":hover?"rgba(255,255,255,.06)":"transparent",border:"none",borderRadius:"var(--r)",cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"background .12s",position:"relative"}}>
        {active&&<span style={{position:"absolute",left:0,top:6,bottom:6,width:3,borderRadius:3,background:"var(--saffron)"}}/>}
        <Icon name="ask" size={14} style={{color:active?"#a3bdfa":"#5d7aaa",flexShrink:0}}/>
        <div style={{flex:1,minWidth:0}}>
          {editingSessionId===s.id?(
            <input autoFocus value={editingTitle} onChange={e=>setEditingTitle(e.target.value)} onKeyDown={e=>saveRename(e,s.id)} onBlur={e=>saveRename(e,s.id)} style={{border:"none",borderBottom:"1px solid rgba(255,255,255,.3)",background:"transparent",outline:"none",color:"#fff",fontFamily:"var(--font)",fontSize:13,width:"100%"}} onClick={e=>e.stopPropagation()}/>
          ):(
            <>
              <div style={{fontSize:13,fontWeight:active?600:400,color:active?"#fff":"#c0d0e8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div>
              <div style={{fontSize:10.5,color:"#4a6090",marginTop:1}}>{s.thread.length} messages</div>
            </>
          )}
        </div>
        {s.pinned&&<Icon name="star" size={12} style={{color:"var(--saffron)",flexShrink:0}}/>}
      </button>
      {hover&&editingSessionId!==s.id&&(
        <div style={{position:"absolute",right:5,top:"50%",transform:"translateY(-50%)",display:"flex",gap:2,background:"rgba(255,255,255,.08)",padding:2,borderRadius:4,backdropFilter:"blur(4px)"}}>
          <button onClick={e=>{e.stopPropagation();startRename(s);}} title="Rename" style={{width:22,height:22,border:"none",background:"transparent",color:"#7e9abf",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:3}}><Icon name="edit" size={11}/></button>
          <button onClick={e=>{e.stopPropagation();togglePinSession(s.id);}} title={s.pinned?"Unpin":"Pin"} style={{width:22,height:22,border:"none",background:"transparent",color:s.pinned?"var(--saffron)":"#7e9abf",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:3}}><Icon name="star" size={11}/></button>
          <button onClick={e=>{e.stopPropagation();if(confirm("Delete?")) deleteSession(s.id);}} title="Delete" style={{width:22,height:22,border:"none",background:"transparent",color:"#e07070",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:3}}><Icon name="close" size={11}/></button>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ChatView ─── */
function ChatView({lang}){
  const [sessions,setSessions]=useState([{id:1,title:"New conversation",thread:[],timestamp:Date.now(),pinned:false}]);
  const [activeSessionId,setActiveSessionId]=useState(1);
  const [leftOpen,setLeftOpen]=useState(true);
  const [pinsOpen,setPinsOpen]=useState(false);
  const [pins,setPins]=useState([]);
  const [pdfModal,setPdfModal]=useState({open:false,cite:null});
  const [editingSessionId,setEditingSessionId]=useState(null);
  const [editingTitle,setEditingTitle]=useState("");
  const [followup,setFollowup]=useState(null);
  const [input,setInput]=useState("");
  const [listening,setListening]=useState(false);
  const scrollRef=useRef(null);
  const idRef=useRef(0);
  const nid=()=>++idRef.current;

  const activeSession=sessions.find(s=>s.id===activeSessionId)||sessions[0];
  const thread=activeSession?activeSession.thread:[];

  useEffect(()=>{
    const el=scrollRef.current;if(!el) return;
    el.scrollTop=el.scrollHeight;
    let n=0;const iv=setInterval(()=>{el.scrollTop=el.scrollHeight;if(++n>26)clearInterval(iv);},200);
    return()=>clearInterval(iv);
  },[thread,followup]);

  function updateThread(fn){
    setSessions(prev=>prev.map(s=>{
      if(s.id!==activeSessionId) return s;
      const next=typeof fn==="function"?fn(s.thread):fn;
      let title=s.title;
      if(next.length>0&&s.title==="New conversation"&&next[0].role==="user") title=next[0].text.substring(0,55);
      return{...s,thread:next,title};
    }));
  }

  function pushCatTurn(cat,ti){
    const d=turnData(cat,ti);
    updateThread(t=>[...t,{id:nid(),role:"user",text:d.query,roman:cat.voice?cat.queryRoman:null,voice:cat.voice},{id:nid(),role:"assistant",data:d,catId:cat.id,ti}]);
    setFollowup(null);
  }
  function launchCat(cat){
    if(cat.voice){setListening(true);setTimeout(()=>{setListening(false);pushCatTurn(cat,0);},1100);}
    else pushCatTurn(cat,cat.multiturn?0:null);
  }
  function onAssistantDone(item){const cat=CATS.find(c=>c.id===item.catId);if(cat&&cat.multiturn&&item.ti!=null&&item.ti<cat.turns.length-1) setFollowup({catId:cat.id,ti:item.ti+1});}

  // Listen for prefill events from GIS map
  useEffect(()=>{
    function handlePrefill(evt){
      setInput(evt.detail);
    }
    window.addEventListener('ndap-prefill',handlePrefill);
    return ()=>window.removeEventListener('ndap-prefill',handlePrefill);
  },[]);
  function submitInput(){
    const text=input.trim();if(!text) return;setInput("");
    const idx=matchCat(text);
    if(idx>=0){launchCat(CATS[idx]);return;}
    updateThread(t=>[...t,{id:nid(),role:"user",text},{id:nid(),role:"assistant",data:{agent:"Intent Router",route:["Intent Router"],id:"fb",latency:"0.21 s",cost:"Rs0.01",think:["No matching demo dataset"],blocks:[{type:"refusal",tone:"amber",icon:"warn",title:"Demo scope",body:"Sandbox has 10 evaluation datasets only. Pick a category below.",bullets:["No external sources accessed (per RFP S1.3)."]}]}}]);
  }
  function createNewChat(){const id=Date.now();setSessions(p=>[{id,title:"New conversation",thread:[],timestamp:id,pinned:false},...p]);setActiveSessionId(id);setFollowup(null);}
  function startRename(s){setEditingSessionId(s.id);setEditingTitle(s.title);}
  function saveRename(e,id){if(e.key&&e.key!=="Enter") return;setSessions(p=>p.map(s=>s.id===id?{...s,title:editingTitle||s.title}:s));setEditingSessionId(null);}
  function deleteSession(id){setSessions(p=>{const n=p.filter(s=>s.id!==id);return n.length?n:[{id:Date.now(),title:"New conversation",thread:[],timestamp:Date.now(),pinned:false}];});if(activeSessionId===id) setActiveSessionId(sessions.find(s=>s.id!==id)?.id||1);}
  function togglePinSession(id){setSessions(p=>p.map(s=>s.id===id?{...s,pinned:!s.pinned}:s));}
  function addPin(pin){setPins(p=>[pin,...p.filter(x=>x.id!==pin.id)]);setPinsOpen(true);}
  function removePin(id){setPins(p=>p.filter(x=>x.id!==id));}

  const pinnedSessions=sessions.filter(s=>s.pinned).sort((a,b)=>b.timestamp-a.timestamp);
  const recentSessions=sessions.filter(s=>!s.pinned).sort((a,b)=>b.timestamp-a.timestamp);
  const empty=thread.length===0;

  return (
    <div style={{display:"flex",height:"100%",width:"100%",overflow:"hidden",fontFamily:"var(--font)"}}>

      {/* LEFT SIDEBAR */}
      <div style={{width:leftOpen?252:0,transition:"width 0.26s cubic-bezier(.4,0,.2,1)",overflow:"hidden",flexShrink:0,background:"var(--navy-900)",borderRight:leftOpen?"1px solid rgba(255,255,255,.07)":"none",display:"flex",flexDirection:"column"}}>
        <div style={{width:252,height:"100%",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 10px 8px",flexShrink:0}}>
            <button onClick={createNewChat} style={{width:"100%",padding:"9px 14px",background:"rgba(255,255,255,.1)",color:"#fff",border:"1px solid rgba(255,255,255,.16)",cursor:"pointer",borderRadius:"var(--r)",display:"flex",alignItems:"center",gap:7,fontWeight:600,fontSize:13,transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.16)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}>
              <Icon name="plus" size={14}/>New conversation
            </button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"2px 6px 12px"}}>
            {pinnedSessions.length>0&&<>
              <div style={{fontSize:9.5,fontWeight:700,color:"#4a6090",letterSpacing:.8,textTransform:"uppercase",padding:"7px 8px 4px"}}>Pinned</div>
              {pinnedSessions.map(s=><SessionItem key={s.id} s={s} active={s.id===activeSessionId} editingSessionId={editingSessionId} editingTitle={editingTitle} setEditingTitle={setEditingTitle} saveRename={saveRename} setActiveSessionId={setActiveSessionId} startRename={startRename} deleteSession={deleteSession} togglePinSession={togglePinSession}/>)}
            </>}
            <div style={{fontSize:9.5,fontWeight:700,color:"#4a6090",letterSpacing:.8,textTransform:"uppercase",padding:"7px 8px 4px"}}>{pinnedSessions.length?"Recent":"Conversations"}</div>
            {recentSessions.map(s=><SessionItem key={s.id} s={s} active={s.id===activeSessionId} editingSessionId={editingSessionId} editingTitle={editingTitle} setEditingTitle={setEditingTitle} saveRename={saveRename} setActiveSessionId={setActiveSessionId} startRename={startRename} deleteSession={deleteSession} togglePinSession={togglePinSession}/>)}
          </div>
          <div style={{padding:"9px 14px",borderTop:"1px solid rgba(255,255,255,.07)",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><Dot color="#1fb98a" pulse/><span style={{fontSize:11,color:"#7e9abf",fontWeight:600}}>Operational</span></div>
            <div className="mono" style={{fontSize:10,color:"#3d5070"}}>India-only storage</div>
          </div>
        </div>
      </div>

      {/* CENTER */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,background:"var(--surface)"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",padding:"7px 10px",borderBottom:"1px solid var(--border)",gap:6,flexShrink:0}}>
          <button onClick={()=>setLeftOpen(!leftOpen)} title="Toggle sidebar" style={{width:32,height:32,background:"transparent",border:"none",cursor:"pointer",color:"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6}}>
            <Icon name={leftOpen?"chevL":"chevR"} size={18}/>
          </button>
          {!empty&&<span style={{fontSize:13,fontWeight:600,color:"var(--ink)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{activeSession?.title}</span>}
          {empty&&<span style={{flex:1}}/>}
          <button onClick={()=>setPinsOpen(!pinsOpen)} title="Pinned responses" style={{width:32,height:32,background:pinsOpen?"var(--saffron-50)":"transparent",border:"none",cursor:"pointer",color:pinsOpen?"var(--saffron)":"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6,position:"relative"}}>
            <Icon name="star" size={18}/>
            {pins.length>0&&<span style={{position:"absolute",top:4,right:4,width:8,height:8,borderRadius:"50%",background:"var(--saffron)",border:"2px solid var(--surface)"}}/>}
          </button>
        </div>

        {/* Scroll area with thread lines */}
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          <ThreadLines thread={thread} scrollRef={scrollRef}/>
          <div ref={scrollRef} style={{height:"100%",overflowY:"auto",paddingRight:16}}>
            {empty?(
              <div style={{maxWidth:860,margin:"0 auto",padding:"20px 28px"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <AgentAvatar size={42}/>
                  <div>
                    <h1 style={{margin:0,fontSize:26,fontWeight:700,letterSpacing:-.4,color:"var(--ink)"}}>Ask NDAP</h1>
                    <div style={{fontSize:13.5,color:"var(--muted)",marginTop:2}}>Natural-language analysis over India's standardised public data — with citations and full traceability.</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,margin:"22px 0 12px"}}>
                  <span style={{fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",color:"var(--saffron)"}}>Example Questions</span>
                  <span style={{flex:1,height:1,background:"var(--border)"}}/>
                  <span style={{fontSize:10.5,color:"var(--muted)",display:"flex",alignItems:"center",gap:4}}><Icon name="layers" size={11} style={{color:"var(--saffron)"}}/><span>Some questions combine databases + government documents</span></span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:11}}>
                  {CATS.map(c=><CatCard key={c.id} cat={c} onClick={()=>launchCat(c)}/>)}
                </div>
              </div>
            ):(
              <div style={{maxWidth:840,margin:"0 auto",padding:"16px 28px 32px",display:"flex",flexDirection:"column",gap:24}}>
                {thread.map((item,idx)=>(
                  <div key={item.id} id={"cm-"+item.id}>
                    {item.role==="user"
                      ?<UserBubble text={item.text} roman={item.roman} voice={item.voice}/>
                      :<AssistantMessage data={item.data} onDone={()=>onAssistantDone(item)} onGenerate={sel=>{const d=clarifyAnswer(sel);updateThread(t=>[...t,{id:nid(),role:"assistant",data:d,catId:null,ti:null}]);}} onPin={addPin} onOpenPDF={cite=>setPdfModal({open:true,cite})}/>}
                    {followup&&item===thread[thread.length-1]&&(
                      <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
                        <button onClick={()=>{const cat=CATS.find(c=>c.id===followup.catId);pushCatTurn(cat,followup.ti);}} style={{display:"inline-flex",alignItems:"center",gap:8,background:"#fff",border:"1px dashed var(--blue)",borderRadius:20,padding:"7px 14px",cursor:"pointer",boxShadow:"var(--sh-1)",fontSize:13}}>
                          <Icon name="ask" size={13} style={{color:"var(--blue)"}}/><span style={{color:"var(--muted)"}}>Follow-up:</span><span style={{fontWeight:600,color:"var(--navy-800)"}}>{CATS.find(c=>c.id===followup.catId)?.turns?.[followup.ti]?.query||""}</span>
                          <Icon name="chevR" size={13} style={{color:"var(--blue)"}}/>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick category rail */}
        {!empty&&(
          <div style={{borderTop:"1px solid var(--border)",background:"var(--surface-2)",padding:"6px 20px",display:"flex",alignItems:"center",gap:5,overflowX:"auto",flexShrink:0}}>
            <span style={{fontSize:10.5,fontWeight:600,color:"var(--muted)",flexShrink:0}}>Try:</span>
            {CATS.map(c=><button key={c.id} onClick={()=>launchCat(c)} title={c.name} style={{flexShrink:0,width:22,height:22,borderRadius:5,border:"1px solid var(--border-2)",background:"#fff",color:CAT_COLORS[c.letter],fontWeight:700,fontSize:11,cursor:"pointer"}}>{c.letter}</button>)}
          </div>
        )}

        {/* Composer */}
        <div style={{borderTop:"1px solid var(--border)",background:"var(--surface)",padding:"12px 24px 14px",flexShrink:0}}>
          <div style={{maxWidth:840,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,border:"1px solid var(--border-2)",borderRadius:"var(--r-lg)",padding:"6px 6px 6px 14px",background:listening?"var(--blue-tint)":"var(--surface)",boxShadow:"var(--sh-1)",transition:"background .2s"}}>
              <Icon name="search" size={17} style={{color:"var(--muted-2)",flexShrink:0}}/>
              <input value={listening?"":input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")submitInput();}} placeholder={listening?"Listening (Hindi)...":"Ask NDAP..."} style={{flex:1,border:"none",outline:"none",fontSize:14,background:"transparent",color:"var(--ink)",fontFamily:"var(--font)"}}/>
              <button onClick={()=>launchCat(CATS[5])} title="Voice" style={{width:34,height:34,borderRadius:7,border:"none",background:listening?"var(--blue)":"var(--surface-3)",color:listening?"#fff":"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon name="mic" size={16}/></button>
              <button onClick={submitInput} style={{width:34,height:34,borderRadius:7,border:"none",background:"var(--blue)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon name="send" size={16}/></button>
            </div>
            
          </div>
        </div>
      </div>

      {/* RIGHT: Pinned sidebar */}
      <PinnedSidebar pins={pins} onRemove={removePin} open={pinsOpen}/>

      {pdfModal.open&&pdfModal.cite&&<PDFModal cite={pdfModal.cite} onClose={()=>setPdfModal({open:false,cite:null})}/>}
    </div>
  );
}

Object.assign(window,{ChatView,GhostBtn,MetaPill});
