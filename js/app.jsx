/* ============================================================
   NDAP — APP SHELL (nav, header, routing, feedback, a11y)
   ============================================================ */

const NAV=[
  { id:"home", icon:"home", key:"nav_home" },
  { id:"ask", icon:"ask", key:"nav_ask" },
  { id:"data", icon:"data", key:"nav_data" },
  { id:"studio", icon:"studio", key:"nav_studio" },
];
const ROUTE_TITLE={
  home:{en:"Home",hi:"मुख पृष्ठ"}, ask:{en:"Ask NDAP",hi:"NDAP से पूछें"},
  data:{en:"Datasets & MDM",hi:"डेटासेट और MDM"}, studio:{en:"AI Studio",hi:"AI स्टूडियो"},
  analytics:{en:"Analytics",hi:"विश्लेषण"},
};

/* ---------- Sidebar ---------- */
function Sidebar({ route, go, lang }){
  return (
    <nav style={{width:"var(--side)",background:"var(--navy-900)",display:"flex",flexDirection:"column",flexShrink:0}}>
      <div style={{padding:"15px 18px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",padding:0,cursor:"pointer"}}>
          <Wordmark lang={lang}/></button>
      </div>
      <div style={{padding:"14px 12px",display:"flex",flexDirection:"column",gap:3,flex:1}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:"#5d6f92",padding:"4px 12px 8px"}}>
          <span className="en-only">Platform</span><span className="hi-only">मंच</span></div>
        {NAV.map(n=>{
          const on=route===n.id;
          return (
            <button key={n.id} onClick={()=>go(n.id)} style={{display:"flex",alignItems:"center",gap:12,
              padding:"10px 12px",borderRadius:"var(--r)",border:"none",cursor:"pointer",textAlign:"left",width:"100%",
              background:on?"var(--navy-600)":"transparent",color:on?"#fff":"#9fb0cf",fontSize:13.5,fontWeight:on?600:500,
              transition:"background .15s",position:"relative"}}
              onMouseEnter={e=>{ if(!on) e.currentTarget.style.background="rgba(255,255,255,.06)"; }}
              onMouseLeave={e=>{ if(!on) e.currentTarget.style.background="transparent"; }}>
              {on && <span style={{position:"absolute",left:0,top:8,bottom:8,width:3,borderRadius:3,background:"var(--saffron)"}}/>}
              <Icon name={n.icon} size={18} stroke={on?1.9:1.7}/>{t(n.key,lang)}
            </button>
          );
        })}
      </div>
      {/* system status */}
      <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,.08)",fontSize:11,color:"#7e8fb0"}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}><Dot color="#1fb98a" pulse/><span style={{color:"#bccadf",fontWeight:600}}>Platform Status: Operational</span></div>
        <div className="mono" style={{fontSize:10.5,lineHeight:1.5}}>Version 2.3 · Last updated: Jun 2026</div>
      </div>
    </nav>
  );
}

/* ---------- Header ---------- */
function Header({ route, go, lang, setLang, fs, setFs, openFeedback }){
  const [userMenu, setUserMenu] = useState(false);
  return (
    <header style={{height:"var(--head)",borderBottom:"1px solid var(--navy-800)",background:"var(--navy-900)",
      display:"flex",alignItems:"center",gap:16,padding:"0 20px",flexShrink:0,zIndex:5,color:"#fff"}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <h1 style={{margin:0,fontSize:15,fontWeight:600,color:"#fff"}}>{(ROUTE_TITLE[route]||{})[lang]||ROUTE_TITLE[route].en}</h1>
      </div>
      {/* quick search */}
      <button onClick={()=>go("ask")} style={{display:"flex",alignItems:"center",gap:9,flexShrink:0,width:300,
        border:"1px solid rgba(255,255,255,0.2)",borderRadius:20,padding:"7px 14px",background:"rgba(0,0,0,0.15)",cursor:"pointer",color:"#ccc"}}>
        <Icon name="search" size={15}/><span style={{fontSize:12.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t("search_ph",lang)}</span></button>
      <div style={{flex:1}}/>

      {/* text-resize (GIGW) */}
      <div title={t("textsize",lang)} style={{display:"flex",alignItems:"center",border:"1px solid rgba(255,255,255,0.2)",borderRadius:20,overflow:"hidden"}}>
        {[["base","A",12],["lg","A",14],["xl","A",16]].map(([k,l,sz],i)=>(
          <button key={k} onClick={()=>setFs(k)} aria-label={`Text size ${i+1}`} style={{border:"none",cursor:"pointer",padding:"5px 10px",
            background:fs===k?"var(--blue)":"transparent",color:"#fff",fontSize:sz,fontWeight:700,lineHeight:1}}>{l}</button>
        ))}
      </div>
      {/* EN / HI */}
      <button onClick={()=>setLang(lang==="en"?"hi":"en")} style={{display:"flex",alignItems:"center",gap:7,
        border:"1px solid rgba(255,255,255,0.2)",borderRadius:20,padding:"6px 12px",background:"rgba(0,0,0,0.15)",cursor:"pointer",fontWeight:600,fontSize:12.5,color:"#fff"}}>
        <Icon name="globe" size={15} style={{color:"#a3bdfa"}}/>
        <span style={{color:lang==="en"?"#fff":"#8aa4df"}}>EN</span>
        <span style={{color:"#485b88"}}>/</span>
        <span style={{fontFamily:"'IBM Plex Sans Devanagari'",color:lang==="hi"?"#fff":"#8aa4df"}}>हिं</span>
      </button>
      {/* accessibility */}
      <button title="Accessibility tools (GIGW · WCAG 2.1 AA)" style={{width:34,height:34,borderRadius:8,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(0,0,0,0.15)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
        <Icon name="eye" size={17}/></button>
      {/* user */}
      <div style={{position:"relative"}}>
        <button onClick={()=>setUserMenu(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,padding:"4px 8px 4px 12px",borderLeft:"1px solid rgba(255,255,255,0.15)",background:"none",borderTop:"none",borderRight:"none",borderBottom:"none",cursor:"pointer",color:"#fff",textAlign:"left"}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,lineHeight:1.2}}>Anaya Sharma</div>
            <div style={{fontSize:10.5,color:"#9fb2d4",fontWeight:500}}>Policy Advisor</div>
          </div>
          <div style={{width:32,height:32,borderRadius:"50%",background:"#fff",color:"var(--navy-800)",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>AS</div>
        </button>
        {userMenu && (
          <div style={{position:"absolute",top:"100%",right:0,marginTop:10,width:220,background:"#fff",borderRadius:"var(--r-lg)",boxShadow:"var(--sh-pop)",overflow:"hidden",color:"var(--ink)",border:"1px solid var(--border)",zIndex:50}}>
            <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",background:"var(--surface-2)"}}>
              <div style={{fontSize:14,fontWeight:600}}>Anaya Sharma</div>
              <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Policy Advisor · NITI Aayog</div>
            </div>
            <div style={{padding:"6px 0"}}>
              {["My Drafts (Studio)","Saved Queries","Platform Settings","Sign Out"].map((l,i)=>(
                <button key={i} onClick={()=>setUserMenu(false)} style={{display:"block",width:"100%",textAlign:"left",padding:"10px 16px",background:"none",border:"none",fontSize:13.5,color:i===3?"var(--red)":"var(--ink-2)",cursor:"pointer",fontWeight:500}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--surface-2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{l}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------- Feedback (floating + modal) ---------- */
function FeedbackButton({ onClick }){
  return (
    <button onClick={onClick} aria-label="Give feedback" style={{position:"fixed",right:22,bottom:22,zIndex:40,
      display:"flex",alignItems:"center",gap:9,background:"var(--saffron)",color:"#fff",border:"none",borderRadius:30,
      padding:"12px 18px",fontSize:13.5,fontWeight:600,cursor:"pointer",boxShadow:"var(--sh-3)"}}>
      <Icon name="star" size={17}/><span>{t("feedback","en")}</span></button>
  );
}
function FeedbackModal({ onClose, route }){
  const [stars,setStars]=useState(0);
  const [cat,setCat]=useState("");
  const [sent,setSent]=useState(false);
  const cats=["Incorrect Search Results","Data Not Available","Inappropriate Visualization","Inappropriate Analysis","Data Error","Dataset","Request Access","Other"];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:50,background:"rgba(7,24,47,.45)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(2px)"}}>
      <div onClick={e=>e.stopPropagation()} className="rise" style={{width:460,maxWidth:"100%",background:"var(--surface)",
        borderRadius:"var(--r-xl)",boxShadow:"var(--sh-pop)",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
          <Icon name="star" size={18} style={{color:"var(--saffron)"}}/>
          <span style={{fontSize:16,fontWeight:600}}>Share feedback</span>
          <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"var(--muted)"}}><Icon name="close" size={18}/></button>
        </div>
        {sent ? (
          <div style={{padding:"40px 24px",textAlign:"center"}}>
            <div style={{width:54,height:54,borderRadius:"50%",background:"var(--green-50)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Icon name="check" size={28} style={{color:"var(--green)"}}/></div>
            <div style={{fontSize:17,fontWeight:600,marginBottom:6}}>Thank you</div>
            <div style={{fontSize:13.5,color:"var(--muted)",maxWidth:300,margin:"0 auto"}}>Your feedback and a screenshot of this screen were logged and dispatched to the administrators.</div>
            <button onClick={onClose} style={{marginTop:20,background:"var(--navy-800)",color:"#fff",border:"none",borderRadius:"var(--r)",padding:"9px 22px",fontSize:13.5,fontWeight:600,cursor:"pointer"}}>Close</button>
          </div>
        ) : (
          <div style={{padding:"20px"}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--ink-2)",marginBottom:8}}>Rate your experience</div>
            <div style={{display:"flex",gap:6,marginBottom:18}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setStars(n)} aria-label={`${n} star`} style={{background:"none",border:"none",cursor:"pointer",padding:2,
                  color:n<=stars?"var(--saffron)":"var(--border-strong)"}}><Icon name="star" size={30} stroke={1.5}/></button>
              ))}
            </div>
            <div style={{fontSize:13,fontWeight:600,color:"var(--ink-2)",marginBottom:8}}>Category <span style={{color:"var(--red)"}}>*</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:18}}>
              {cats.map(c=>(
                <label key={c} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",border:"1px solid",
                  borderColor:cat===c?"var(--blue)":"var(--border)",borderRadius:"var(--r)",cursor:"pointer",fontSize:13.5,
                  background:cat===c?"var(--blue-50)":"#fff",color:"var(--ink-2)"}}>
                  <input type="radio" name="fbcat" checked={cat===c} onChange={()=>setCat(c)} style={{accentColor:"var(--blue)"}}/>{c}</label>
              ))}
            </div>
            <textarea placeholder="Tell us more (optional)…" style={{width:"100%",minHeight:70,border:"1px solid var(--border-2)",
              borderRadius:"var(--r)",padding:"10px 12px",fontSize:13.5,fontFamily:"var(--font)",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
            <div style={{display:"flex",alignItems:"center",gap:8,margin:"12px 0 16px",padding:"9px 12px",background:"var(--surface-2)",borderRadius:"var(--r)",fontSize:12,color:"var(--muted)"}}>
              <Icon name="eye" size={15} style={{color:"var(--blue)",flexShrink:0}}/>
              A screenshot of this screen (query &amp; response context) will be captured and attached automatically.
            </div>
            <button disabled={!cat} onClick={()=>setSent(true)} style={{width:"100%",background:cat?"var(--navy-800)":"var(--border-2)",color:"#fff",
              border:"none",borderRadius:"var(--r)",padding:"11px",fontSize:14,fontWeight:600,cursor:cat?"pointer":"not-allowed"}}>Submit feedback</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- App ---------- */
function App(){
  const [route,setRoute]=useState("home");
  const [lang,setLang]=useState("en");
  const [fs,setFs]=useState("base");
  const [fb,setFb]=useState(false);
  useEffect(()=>{ document.documentElement.lang=lang; },[lang]);
  useEffect(()=>{ document.documentElement.dataset.fs=fs; },[fs]);
  const go=(r)=>setRoute(r);
  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
      <a href="#main" style={{position:"absolute",left:-9999,top:8,zIndex:99,background:"var(--navy-800)",color:"#fff",padding:"8px 16px",borderRadius:6}}
        onFocus={e=>e.target.style.left="8px"} onBlur={e=>e.target.style.left="-9999px"}>{t("skip",lang)}</a>
      <Sidebar route={route} go={go} lang={lang}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <Header route={route} go={go} lang={lang} setLang={setLang} fs={fs} setFs={setFs} openFeedback={()=>setFb(true)}/>
        <main id="main" style={{flex:1,minHeight:0,background:"var(--app-bg)"}}>
          {route==="home" && <HomeView go={go} lang={lang}/>}
          {route==="ask" && <ChatView lang={lang}/>}
          {route==="data" && <DataView/>}
          {route==="studio" && <StudioView/>}
        </main>
      </div>
      <FeedbackButton onClick={()=>setFb(true)}/>
      {fb && <FeedbackModal onClose={()=>setFb(false)} route={route}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
