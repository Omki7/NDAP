/* ============================================================
   NDAP — DATA LAYER
   Mock (fabricated-but-plausible) Indian government data,
   bilingual strings, and module datasets.
   ============================================================ */

/* ---------- i18n: EN / HI ---------- */
const I18N = {
  nav_home:        { en:"Home",            hi:"मुख पृष्ठ" },
  nav_ask:         { en:"Ask NDAP",        hi:"NDAP से पूछें" },
  nav_data:        { en:"Datasets & MDM",  hi:"डेटासेट और MDM" },
  nav_studio:      { en:"AI Studio",       hi:"AI स्टूडियो" },
  nav_analytics:   { en:"Analytics",       hi:"विश्लेषण" },
  nav_gov:         { en:"Governance",      hi:"अभिशासन" },
  search_ph:       { en:"Ask a question about India's data…", hi:"भारत के डेटा के बारे में प्रश्न पूछें…" },
  feedback:        { en:"Feedback",        hi:"प्रतिक्रिया" },
  textsize:        { en:"Text size",       hi:"अक्षर आकार" },
  skip:            { en:"Skip to main content", hi:"मुख्य सामग्री पर जाएँ" },
  gov_india:       { en:"Government of India · NITI Aayog", hi:"भारत सरकार · नीति आयोग" },
  tagline:         { en:"National Data & Analytics Platform", hi:"राष्ट्रीय डेटा एवं विश्लेषण मंच" },
};
function t(key, lang){ const e = I18N[key]; return e ? (e[lang]||e.en) : key; }

/* ---------- Platform headline stats ---------- */
const PLATFORM_STATS = [
  { k:"Datasets",         v:"4,812",   sub:"standardised & LGD-mapped" },
  { k:"Structured records", v:"3.41 B", sub:"across 1,082 source files" },
  { k:"Documents indexed", v:"1,35,400", sub:"507K+ pages, RAG-ready" },
  { k:"Ministries & sources", v:"214",  sub:"Centre + State + UT" },
];

/* ---------- Datasets / MDM ---------- */
const DATASETS = [
  { id:"census-2011", name:"Census of India 2011", ministry:"MoSPI / RGI", sector:"Demography", rows:"1.21 B", granularity:"Village", updated:"2024-11-02", id_keys:["LGD","Census"], status:"Harmonised" },
  { id:"mgnrega", name:"MGNREGA Transactions", ministry:"Ministry of Rural Development", sector:"Rural / Employment", rows:"2.84 B", granularity:"Gram Panchayat", updated:"2026-05-30", id_keys:["LGD"], status:"Harmonised" },
  { id:"nfhs-5", name:"NFHS-5 (2019–21)", ministry:"MoHFW", sector:"Health", rows:"6.1 M", granularity:"District", updated:"2025-09-14", id_keys:["LGD","Census"], status:"Harmonised" },
  { id:"u-dise", name:"UDISE+ School Report Card", ministry:"Ministry of Education", sector:"Education", rows:"148 M", granularity:"School", updated:"2026-03-21", id_keys:["LGD","PIN"], status:"Harmonised" },
  { id:"pmkisan", name:"PM-KISAN Beneficiary Ledger", ministry:"Ministry of Agriculture", sector:"Agriculture", rows:"410 M", granularity:"Village", updated:"2026-05-28", id_keys:["LGD"], status:"Harmonised" },
  { id:"plfs", name:"PLFS Annual Report 2023–24", ministry:"MoSPI", sector:"Labour", rows:"3.2 M", granularity:"State", updated:"2026-02-10", id_keys:["Census"], status:"Review" },
  { id:"hmis", name:"HMIS Health Facility Data", ministry:"MoHFW", sector:"Health", rows:"92 M", granularity:"District", updated:"2026-04-19", id_keys:["LGD"], status:"Harmonised" },
  { id:"budget-2425", name:"Union Budget 2024–25 (Docs)", ministry:"Ministry of Finance", sector:"Public Finance", rows:"3,140 pp", granularity:"Scheme", updated:"2025-07-23", id_keys:["—"], status:"Indexed" },
];

const INGESTION_PIPELINE = [
  { stage:"Fetch & Stage", structured:"1,082 files", unstructured:"1,35,400 docs", health:99.8 },
  { stage:"Parse & OCR", structured:"schema-typed", unstructured:"507K pages", health:98.2 },
  { stage:"Harmonise IDs", structured:"LGD / Census / PIN", unstructured:"entity-link", health:97.1 },
  { stage:"Index & Embed", structured:"columnar + tnum", unstructured:"vector store", health:99.4 },
  { stage:"Provenance Stamp", structured:"checksum + URL", unstructured:"checksum + URL", health:100 },
];

/* monthly ingestion volume (GB) */
const INGEST_TREND = [42,55,61,58,73,88,95,104,99,118,131,142];

/* ---------- Analytics (public site stats) ---------- */
const ANALYTICS = {
  kpis:[
    { k:"Page views (30d)", v:"8,42,910", d:"+12.4%", up:true },
    { k:"Unique visitors", v:"1,96,540", d:"+8.1%", up:true },
    { k:"Dataset downloads", v:"54,302", d:"+19.7%", up:true },
    { k:"Avg. session", v:"6m 41s", d:"-2.3%", up:false },
  ],
  traffic:[120,138,151,143,168,182,176,201,219,205,234,256,248,271,289,277,302,318,331,309,342,358,371,365,389,402,418,431,447,462],
  browsers:[ {k:"Chrome",v:58},{k:"Edge",v:17},{k:"Safari",v:11},{k:"Firefox",v:7},{k:"Other",v:7} ],
  topSegments:[
    { k:"Health & Nutrition", v:88 },
    { k:"Rural Employment", v:74 },
    { k:"Education", v:69 },
    { k:"Agriculture", v:61 },
    { k:"Public Finance", v:47 },
    { k:"Demography", v:39 },
  ],
  topDownloads:[
    { k:"NFHS-5 District Factsheet", v:"9,210" },
    { k:"MGNREGA FY24 State Summary", v:"7,840" },
    { k:"Census 2011 Primary Abstract", v:"6,517" },
    { k:"PLFS 2023–24 Tables", v:"5,099" },
    { k:"UDISE+ Enrolment", v:"4,233" },
  ],
};

/* ---------- Governance / Config ---------- */
const SYS_CONFIG = [
  { k:"Deployment", v:"Hybrid — Gov Community Cloud (MeghRaj) + on-prem GPU" },
  { k:"Region", v:"India · Hyderabad (primary) / Bhubaneswar (DR)" },
  { k:"Model provider", v:"Self-hosted open-weight (primary) + external API (fallback)" },
  { k:"Inference GPUs", v:"8 × NVIDIA H100 80GB (SXM), NVLink" },
  { k:"Database", v:"PostgreSQL 16 + Apache Iceberg (lakehouse)" },
  { k:"Vector store", v:"Qdrant (HNSW, 1024-dim, cosine)" },
  { k:"Execution engine", v:"DuckDB + Spark 3.5 (heavy joins)" },
  { k:"Orchestration", v:"LangGraph multi-agent · sandbox: gVisor" },
  { k:"Concurrency baseline", v:"Auto-scales to 100 concurrent execution sessions" },
  { k:"Compliance", v:"GIGW · WCAG 2.1 AA · data residency: India-only" },
];

const ORCHESTRATOR_AGENTS = [
  { id:"router", name:"Intent Router", desc:"Classifies query → workflow template" },
  { id:"retriever", name:"Retrieval Agent", desc:"Hybrid search: SQL + vector + BM25" },
  { id:"calc", name:"Compute Agent", desc:"Generates & runs sandboxed Python/SQL" },
  { id:"causal", name:"Causal Agent", desc:"Recursive driver analysis & causal inference" },
  { id:"viz", name:"Visualisation Agent", desc:"Auto-selects chart from result matrix" },
  { id:"verify", name:"Consistency Monitor", desc:"Validates claims vs. source IDs" },
  { id:"guard", name:"Guardrail Agent", desc:"Injection / safety / refusal policy" },
];

/* RFP §3.3.3 — a query is "complex" when it engages ≥3 of these 5 capabilities */
const COMPLEX_FEATURES = [
  { id:"multi",  label:"Multi-step reasoning & orchestration" },
  { id:"cross",  label:"Cross-sectoral integration" },
  { id:"synth",  label:"Unstructured + structured synthesis" },
  { id:"causal", label:"Causal / predictive → recommendations" },
  { id:"spatio", label:"Spatio-temporal harmonisation" },
];

/* triple-stream logs */
const LOG_STREAMS = {
  etl:[
    "Census 2011 village data → remapped to standard codes: 6,40,930 rows, 0 dropped",
    "MGNREGA FY2024 → currency units standardised, OK",
    "NFHS-5 district data: all 707 columns verified",
    "PM-KISAN beneficiary ledger — data integrity verified OK",
    "Data storage optimised: 142 files consolidated to 11, 3.2 GB reclaimed",
  ],
  user:[
    "Anaya Sharma viewed dataset: Census 2011",
    "R. Menon downloaded UDISE+ Enrolment data (4.2 MB)",
    "Policy Cell exported brief: Rural-Health-2026.docx",
    "Guest user ran query — Geography: Kerala",
    "J. Singh pinned a chart to their draft document",
  ],
  inf:[
    "Query processed → Data Search, confidence 97%, response time 812ms",
    "Found 1 matching row in Census 2011 dataset",
    "Analysis ran 23 lines of code in secure environment, completed OK",
    "Processing cost: ₹0.214",
    "Security check: blocked 1 unsafe request (prompt injection)",
  ],
};

/* ---------- AI Studio doc ---------- */
const STUDIO_DOC = {
  title:"Rural Health Access in Aspirational Districts — Policy Brief",
  meta:"Draft · v4 · last edited 2 min ago · 3 collaborators",
};

/* uploaded source PDFs the AI can draft & cite from */
const STUDIO_SOURCES = [
  { name:"Census2011_PCA_C08.pdf", size:"4.2 MB", pages:"1,840 pp", sector:"Demography", status:"indexed" },
  { name:"HMIS_2025_FacilityMaster.pdf", size:"1.1 MB", pages:"612 pp", sector:"Health", status:"indexed" },
  { name:"NFHS-5_Bihar_Factsheet.pdf", size:"380 KB", pages:"24 pp", sector:"Health", status:"indexing" },
];

/* collaboration / permission controls */
const STUDIO_COLLAB = [
  { initials:"AS", name:"Anaya Sharma", org:"NITI Aayog", role:"Owner", color:"var(--blue)" },
  { initials:"RM", name:"Rohan Menon", org:"MoHFW", role:"Editor", color:"var(--saffron)" },
  { initials:"JS", name:"Jagvir Singh", org:"NITI Aayog", role:"Viewer", color:"var(--green)" },
];

/* RFP §1.1.7(iii) — Drafting Studio mandated capabilities */
const STUDIO_CAPS = [
  { ic:"sparkle", label:"AI-assisted writing" },
  { ic:"cite", label:"One-click citations" },
  { ic:"doc", label:"Download as .docx" },
  { ic:"chart", label:"Embed live artifacts" },
  { ic:"users", label:"Collaboration controls" },
];

/* ---------- Model performance — internationally recognised benchmarks (RFP §3.1.5) ---------- */
const BENCHMARKS = [
  { k:"DocVQA", v:73.8, min:70, desc:"Document visual QA — scanned PDFs & forms" },
  { k:"InfoVQA", v:68.4, min:65, desc:"Infographic / chart-image reasoning" },
  { k:"ChartQA", v:64.2, min:60, desc:"Question answering over chart figures" },
  { k:"Indian Policy QA", v:81.5, min:null, desc:"Fine-tuned on Indian gov & policy corpora" },
];

/* shared filesystem — multi-agent coordination (RFP §3.1.5 h) */
const SHARED_FS = [
  { agent:"Retrieval Agent", file:"/run/4f02/retrieved_rows.parquet", op:"write", size:"412 KB", color:"var(--blue)" },
  { agent:"Compute Agent", file:"/run/4f02/retrieved_rows.parquet", op:"read", size:"412 KB", color:"var(--green)" },
  { agent:"Compute Agent", file:"/run/4f02/per_capita.json", op:"write", size:"1.2 KB", color:"var(--green)" },
  { agent:"Visualisation Agent", file:"/run/4f02/per_capita.json", op:"read", size:"1.2 KB", color:"var(--navy-700)" },
  { agent:"Consistency Monitor", file:"/run/4f02/citations.jsonl", op:"read", size:"3.0 KB", color:"var(--saffron)" },
];

Object.assign(window, {
  I18N, t, PLATFORM_STATS, DATASETS, INGESTION_PIPELINE, INGEST_TREND,
  ANALYTICS, SYS_CONFIG, ORCHESTRATOR_AGENTS, LOG_STREAMS, STUDIO_DOC,
  STUDIO_SOURCES, STUDIO_COLLAB, STUDIO_CAPS, BENCHMARKS, SHARED_FS, COMPLEX_FEATURES,
});
