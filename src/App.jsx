import { useState, useMemo, useCallback, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Users, CheckCircle2, XCircle, DollarSign, TrendingUp, Star,
  Plus, Trash2, Pencil, X, Menu, LayoutDashboard, UserPlus,
  Settings, ChevronDown, Search, Filter, Download, Clock,
  LogOut, Loader2, Wallet, ArrowUpCircle, ArrowDownCircle,
  Phone, Mail, MapPin, FileText, Eye, EyeOff, Save,
  ChevronLeft, Calendar, BarChart3, UserCircle, Sliders,
  Home, BookOpen, CreditCard, Grip,
} from "lucide-react";

// ====================================================
// SUPABASE
// ====================================================
const SUPABASE_URL = "https://lanzgjytslmbyytwvgdr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhbnpnanl0c2xtYnl5dHd2Z2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDY3NTYsImV4cCI6MjA4ODk4Mjc1Nn0.EaA8bwLsn0DrOx0c4OP7rL1FnidbOfwZtiMu1AoMc3Y";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====================================================
// THEME
// ====================================================
const T = {
  bg: "#0b0d11", card: "#14171f", card2: "#1a1e28", border: "#222738",
  text: "#e8eaf0", text2: "#7c819a", input: "#111420",
  P: "#27a8de", G: "#34d399", R: "#f87171", Y: "#fbbf24", V: "#a78bfa",
};

// ====================================================
// HELPERS
// ====================================================
const fBRL = (v) => (v == null || isNaN(v)) ? "R$ 0,00" : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fDate = (d) => { if (!d) return "—"; const p = d.split("-"); return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d; };
const td = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; };
const sow = () => { const n = new Date(), d = n.getDay(), diff = n.getDate() - d + (d===0?-6:1), m = new Date(n); m.setDate(diff); return `${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}-${String(m.getDate()).padStart(2,"0")}`; };
const som = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-01`; };
const maskPhone = (v) => { const d = v.replace(/\D/g,"").slice(0,11); if(d.length<=2) return d.length?`(${d}`:""; if(d.length<=7) return `(${d.slice(0,2)}) ${d.slice(2)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`; };

const STATUS_MAP = {
  fechado:    { label: "Fechado",       color: T.G, Icon: CheckCircle2 },
  andamento:  { label: "Em Andamento",  color: T.Y, Icon: Clock },
  naoFechado: { label: "Não Fechado",   color: T.R, Icon: XCircle },
};

const DEFAULT_FIELDS = {
  nome:        { label: "Nome",         icon: UserCircle, enabled: true,  required: true,  type: "text" },
  numero:      { label: "WhatsApp",     icon: Phone,      enabled: true,  required: false, type: "phone" },
  email:       { label: "E-mail",       icon: Mail,       enabled: false, required: false, type: "email" },
  endereco:    { label: "Endereço",     icon: MapPin,     enabled: false, required: false, type: "text" },
  origem:      { label: "Origem",       icon: Star,       enabled: true,  required: false, type: "select" },
  valor:       { label: "Valor (R$)",   icon: DollarSign, enabled: true,  required: false, type: "number" },
  dataVeio:    { label: "Data Contato", icon: Calendar,   enabled: true,  required: false, type: "date" },
  dataServico: { label: "Data Serviço", icon: Calendar,   enabled: false, required: false, type: "date" },
  observacoes: { label: "Observações",  icon: FileText,   enabled: false, required: false, type: "textarea" },
  status:      { label: "Status",       icon: CheckCircle2, enabled: true, required: false, type: "status" },
};

const emptyClient = { nome:"", numero:"", email:"", endereco:"", origem:"", valor:"", dataVeio:td(), dataServico:"", observacoes:"", status:"naoFechado" };

// ====================================================
// SHARED UI
// ====================================================
const inp = "w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all placeholder:text-gray-600";
const inpStyle = { backgroundColor: T.input, border: `1px solid ${T.border}`, color: T.text };
const btnPrimary = "px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95";

const StatusBadge = ({status, onClick, small}) => {
  const s = STATUS_MAP[status] || STATUS_MAP.naoFechado;
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1 font-bold rounded-full cursor-pointer transition-all active:scale-95 ${small?"text-[10px] px-2 py-0.5":"text-xs px-3 py-1"}`}
      style={{backgroundColor:s.color+"18",color:s.color,border:`1px solid ${s.color}25`}}>
      <s.Icon size={small?10:12}/>{s.label}
    </button>
  );
};

const Card = ({children, className="", style={}}) => (
  <div className={`rounded-2xl ${className}`} style={{backgroundColor:T.card, border:`1px solid ${T.border}`, ...style}}>{children}</div>
);

const KpiCard = ({icon:Icon, label, value, sub, color}) => (
  <Card className="p-4 flex items-center gap-3">
    <div className="rounded-xl p-2.5 shrink-0" style={{background:`${color}15`}}>
      <Icon size={18} style={{color}}/>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:T.text2}}>{label}</p>
      <p className="text-lg font-extrabold truncate leading-tight mt-0.5">{value}</p>
      {sub && <p className="text-[10px]" style={{color:T.text2}}>{sub}</p>}
    </div>
  </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{backgroundColor:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 12px"}}>
      <p style={{color:T.text2,fontSize:10,marginBottom:3}}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{color:p.color||T.P,fontSize:12,fontWeight:700}}>
          {typeof p.value==="number"&&p.value>100?fBRL(p.value):p.value}
        </p>
      ))}
    </div>
  );
};

// ====================================================
// CSV EXPORT
// ====================================================
const exportCSV = (data, fields) => {
  const cols = Object.entries(fields).filter(([,f])=>f.enabled).map(([k])=>k);
  const headerMap = {nome:"Nome",numero:"WhatsApp",email:"Email",endereco:"Endereço",origem:"Origem",valor:"Valor",dataVeio:"Data Contato",dataServico:"Data Serviço",observacoes:"Observações",status:"Status"};
  const header = cols.map(c=>headerMap[c]||c).join(",")+"\n";
  const rows = data.map(c => cols.map(col => {
    let v = c[col==="dataVeio"?"data_veio":col==="dataServico"?"data_servico":col] || "";
    if(col==="valor") v=fBRL(v);
    if(col==="status") v=STATUS_MAP[v]?.label||v;
    if(col==="dataVeio"||col==="dataServico") v=fDate(v);
    return `"${String(v).replace(/"/g,'""')}"`;
  }).join(",")).join("\n");
  const blob = new Blob(["\uFEFF"+header+rows],{type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`clientes_${td()}.csv`; a.click();
  URL.revokeObjectURL(url);
};

// ====================================================
// AUTH SCREEN
// ====================================================
function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
        setError("Conta criada! Faça login agora.");
        setIsLogin(true);
      }
    } catch (e) { setError(e.message || "Erro ao autenticar.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{backgroundColor:T.bg,color:T.text,fontFamily:"'Instrument Sans',system-ui,sans-serif"}} className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background:`linear-gradient(135deg,${T.P},${T.V})`}}>
            <BarChart3 size={28} color="white"/>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">LavCri CRM</h1>
          <p className="text-sm mt-1" style={{color:T.text2}}>{isLogin?"Acesse sua conta":"Criar nova conta"}</p>
        </div>
        <Card className="p-5">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>E-mail</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" className={inp} style={inpStyle} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
            <div>
              <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Senha</label>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Mínimo 6 caracteres" className={inp} style={inpStyle} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
          </div>
          {error && <p className="text-xs mt-3" style={{color:error.includes("Conta criada")?T.G:T.R}}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading} className={`w-full mt-4 ${btnPrimary} flex items-center justify-center gap-2`}
            style={{background:`linear-gradient(135deg,${T.P},${T.P}cc)`,opacity:loading?.6:1}}>
            {loading&&<Loader2 size={15} className="animate-spin"/>}{isLogin?"Entrar":"Criar Conta"}
          </button>
          <p className="text-center text-xs mt-4" style={{color:T.text2}}>
            {isLogin?"Não tem conta? ":"Já tem conta? "}
            <button onClick={()=>{setIsLogin(!isLogin);setError("");}} className="font-bold" style={{color:T.P}}>{isLogin?"Criar conta":"Fazer login"}</button>
          </p>
        </Card>
        <p className="text-center text-[10px] mt-6" style={{color:T.text2+"80"}}>Seus dados são protegidos conforme a LGPD</p>
      </div>
    </div>
  );
}

// ====================================================
// MAIN APP
// ====================================================
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}}) => { setSession(session); setLoading(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_e,session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{backgroundColor:T.bg,color:T.text}} className="min-h-screen flex items-center justify-center"><Loader2 size={28} className="animate-spin" style={{color:T.P}}/></div>;
  if (!session) return <AuthScreen/>;
  return <CRMApp session={session}/>;
}

// ====================================================
// CRM APP
// ====================================================
function CRMApp({ session }) {
  const [tab, setTab] = useState("dash");
  const [clients, setClients] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fields, setFields] = useState({...DEFAULT_FIELDS});
  const [form, setForm] = useState({...emptyClient});
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [fPer, setFPer] = useState("mes");
  const [fSt, setFSt] = useState("todos");
  const [srch, setSrch] = useState("");
  const [dateFrom, setDateFrom] = useState(som());
  const [dateTo, setDateTo] = useState(td());
  const [dbLoading, setDbLoading] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const [txForm, setTxForm] = useState({tipo:"receita",descricao:"",valor:"",data:td(),client_id:""});
  const [showTxForm, setShowTxForm] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // === DATA FETCHING ===
  const fetchClients = useCallback(async () => {
    const {data} = await supabase.from("clients").select("*").order("created_at",{ascending:false});
    if(data) setClients(data);
  },[]);

  const fetchOrigins = useCallback(async () => {
    const {data} = await supabase.from("origins").select("*").order("id");
    if(data) setOrigins(data);
  },[]);

  const fetchTransactions = useCallback(async () => {
    const {data} = await supabase.from("transactions").select("*").order("data",{ascending:false});
    if(data) setTransactions(data);
  },[]);

  const fetchSettings = useCallback(async () => {
    const {data} = await supabase.from("profiles").select("settings").eq("id",session.user.id).single();
    if(data?.settings?.fields) {
      setFields(prev => {
        const merged = {...prev};
        Object.entries(data.settings.fields).forEach(([k,v]) => {
          if(merged[k]) merged[k] = {...merged[k], enabled: v};
        });
        return merged;
      });
    }
  },[session]);

  useEffect(() => {
    Promise.all([fetchClients(), fetchOrigins(), fetchTransactions(), fetchSettings()]).then(()=>setDbLoading(false));
  },[fetchClients,fetchOrigins,fetchTransactions,fetchSettings]);

  const originNames = useMemo(()=>origins.map(o=>o.name),[origins]);

  useEffect(()=>{
    if(originNames.length>0 && !form.origem) setForm(f=>({...f,origem:originNames[0]}));
  },[originNames]);

  // === FILTERING ===
  const filtered = useMemo(()=>clients.filter(c=>{
    if(fPer==="custom"||fPer==="mes"||fPer==="semana"||fPer==="hoje"){
      let from=dateFrom, to=dateTo;
      if(fPer==="hoje"){from=td();to=td();}
      else if(fPer==="semana"){from=sow();to=td();}
      else if(fPer==="mes"){from=som();to=td();}
      if(from && c.data_veio < from) return false;
      if(to && c.data_veio > to) return false;
    }
    if(fSt!=="todos" && c.status!==fSt) return false;
    if(srch){
      const s=srch.toLowerCase();
      if(!c.nome?.toLowerCase().includes(s) && !c.numero?.includes(s) && !c.email?.toLowerCase().includes(s)) return false;
    }
    return true;
  }),[clients,fPer,fSt,srch,dateFrom,dateTo]);

  // === KPIs ===
  const kpis = useMemo(()=>{
    const t=filtered.length;
    const fc=filtered.filter(c=>c.status==="fechado");
    const ea=filtered.filter(c=>c.status==="andamento");
    const nf=filtered.filter(c=>c.status==="naoFechado");
    const rec=fc.reduce((s,c)=>s+Number(c.valor||0),0);
    const tk=fc.length>0?rec/fc.length:0;
    const oc={};
    fc.forEach(c=>{oc[c.origem]=(oc[c.origem]||0)+1;});
    let mo="—",mx=0;
    Object.entries(oc).forEach(([k,v])=>{if(v>mx){mo=k;mx=v;}});
    return {t,fc:fc.length,nf:nf.length,ea:ea.length,pct:t>0?((fc.length/t)*100).toFixed(1):"0",rec,tk,mo};
  },[filtered]);

  // === FINANCIAL KPIs ===
  const finKpis = useMemo(()=>{
    const monthTx = transactions.filter(tx=>{
      if(fPer==="tudo") return true;
      let from=dateFrom, to=dateTo;
      if(fPer==="hoje"){from=td();to=td();}
      else if(fPer==="semana"){from=sow();to=td();}
      else if(fPer==="mes"){from=som();to=td();}
      return tx.data>=from && tx.data<=to;
    });
    const receitas=monthTx.filter(tx=>tx.tipo==="receita").reduce((s,tx)=>s+Number(tx.valor),0);
    const custos=monthTx.filter(tx=>tx.tipo==="custo").reduce((s,tx)=>s+Number(tx.valor),0);
    return {receitas,custos,resultado:receitas-custos,txList:monthTx};
  },[transactions,fPer,dateFrom,dateTo]);

  // === CHART DATA ===
  const barD = useMemo(()=>{
    const m={};
    filtered.filter(c=>c.status==="fechado").forEach(c=>{m[c.origem]=(m[c.origem]||0)+Number(c.valor||0);});
    return Object.entries(m).map(([name,value])=>({name,value}));
  },[filtered]);

  const lineD = useMemo(()=>{
    const m={};
    filtered.forEach(c=>{const d=fDate(c.data_veio);m[d]=(m[d]||0)+1;});
    return Object.entries(m).sort((a,b)=>{
      const [da,ma,ya]=a[0].split("/");const [db,mb,yb]=b[0].split("/");
      return new Date(`${ya}-${ma}-${da}`)-new Date(`${yb}-${mb}-${db}`);
    }).map(([date,leads])=>({date,leads}));
  },[filtered]);

  const pieD = useMemo(()=>[
    {name:"Fechados",value:kpis.fc,color:T.G},
    {name:"Andamento",value:kpis.ea,color:T.Y},
    {name:"Não Fechados",value:kpis.nf,color:T.R},
  ].filter(d=>d.value>0),[kpis]);

  // === CRUD CLIENTS ===
  const submitClient = useCallback(async()=>{
    if(!form.nome) return;
    const val=typeof form.valor==="string"?parseFloat(form.valor.replace(",",".")):Number(form.valor||0);
    const record={
      nome:form.nome, numero:form.numero, email:form.email||"", endereco:form.endereco||"",
      origem:form.origem, valor:isNaN(val)?0:val, data_veio:form.dataVeio||td(),
      data_servico:form.dataServico||null, observacoes:form.observacoes||"",
      status:form.status, user_id:session.user.id,
    };
    if(editId!==null){
      await supabase.from("clients").update(record).eq("id",editId);
      setEditId(null);
    } else {
      await supabase.from("clients").insert(record);
    }
    setForm({...emptyClient,origem:originNames[0]||""});
    setShowForm(false);
    fetchClients();
  },[form,editId,session,originNames,fetchClients]);

  const editClient=(c)=>{
    setForm({nome:c.nome,numero:c.numero||"",email:c.email||"",endereco:c.endereco||"",origem:c.origem,valor:c.valor,dataVeio:c.data_veio,dataServico:c.data_servico||"",observacoes:c.observacoes||"",status:c.status});
    setEditId(c.id); setShowForm(true); setTab("clientes");
  };

  const delClient=async(id)=>{await supabase.from("clients").delete().eq("id",id);fetchClients();};

  const cycleStatus=async(id)=>{
    const order=["naoFechado","andamento","fechado"];
    const client=clients.find(c=>c.id===id);
    if(!client)return;
    const newSt=order[(order.indexOf(client.status)+1)%3];
    await supabase.from("clients").update({status:newSt}).eq("id",id);
    fetchClients();
  };

  // === CRUD TRANSACTIONS ===
  const submitTx=useCallback(async()=>{
    if(!txForm.descricao||!txForm.valor) return;
    const val=parseFloat(txForm.valor.replace(",","."));
    if(isNaN(val)) return;
    await supabase.from("transactions").insert({
      tipo:txForm.tipo, descricao:txForm.descricao, valor:val, data:txForm.data,
      client_id:txForm.client_id||null, user_id:session.user.id,
    });
    setTxForm({tipo:"receita",descricao:"",valor:"",data:td(),client_id:""});
    setShowTxForm(false);
    fetchTransactions();
  },[txForm,session,fetchTransactions]);

  const delTx=async(id)=>{await supabase.from("transactions").delete().eq("id",id);fetchTransactions();};

  // === ORIGINS ===
  const [newOr, setNewOr] = useState("");
  const addOr=async()=>{const tr=newOr.trim();if(tr&&!originNames.includes(tr)){await supabase.from("origins").insert({name:tr,is_default:false,user_id:session.user.id});setNewOr("");fetchOrigins();}};
  const remOr=async(o)=>{const origin=origins.find(x=>x.name===o.name&&!x.is_default);if(origin){await supabase.from("origins").delete().eq("id",origin.id);fetchOrigins();}};

  // === SAVE SETTINGS ===
  const saveSettings=async()=>{
    const fieldStates={};
    Object.entries(fields).forEach(([k,v])=>{fieldStates[k]=v.enabled;});
    await supabase.from("profiles").update({settings:{fields:fieldStates}}).eq("id",session.user.id);
    setSettingsSaved(true);
    setTimeout(()=>setSettingsSaved(false),2000);
  };

  const toggleField=(key)=>{
    if(key==="nome") return; // nome always required
    setFields(prev=>({...prev,[key]:{...prev[key],enabled:!prev[key].enabled}}));
  };

  const logout=async()=>{await supabase.auth.signOut();};

  // === PERIOD LABEL ===
  const perLabel = fPer==="hoje"?"Hoje":fPer==="semana"?"Esta Semana":fPer==="mes"?"Este Mês":fPer==="tudo"?"Tudo":`${fDate(dateFrom)} — ${fDate(dateTo)}`;

  if(dbLoading) return <div style={{backgroundColor:T.bg,color:T.text}} className="min-h-screen flex items-center justify-center"><Loader2 size={28} className="animate-spin" style={{color:T.P}}/></div>;

  // =====================
  // RENDER
  // =====================
  const navItems=[
    {id:"dash",label:"Início",Icon:Home},
    {id:"clientes",label:"Clientes",Icon:Users},
    {id:"financeiro",label:"Financeiro",Icon:Wallet},
    {id:"config",label:"Config",Icon:Sliders},
  ];

  const renderSelect=(val,onChange,opts)=>(
    <div className="relative">
      <select value={val} onChange={onChange} className={`${inp} appearance-none pr-8`} style={inpStyle}>
        {opts.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:T.text2}}/>
    </div>
  );

  // === PERIOD FILTER BAR ===
  const PeriodBar = () => (
    <Card className="p-3 mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        {[{v:"hoje",l:"Hoje"},{v:"semana",l:"Semana"},{v:"mes",l:"Mês"},{v:"tudo",l:"Tudo"},{v:"custom",l:"Custom"}].map(p=>(
          <button key={p.v} onClick={()=>{setFPer(p.v);if(p.v==="mes"){setDateFrom(som());setDateTo(td());}else if(p.v==="semana"){setDateFrom(sow());setDateTo(td());}else if(p.v==="hoje"){setDateFrom(td());setDateTo(td());}}}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={fPer===p.v?{backgroundColor:T.P+"20",color:T.P}:{color:T.text2}}>
            {p.l}
          </button>
        ))}
      </div>
      {fPer==="custom"&&(
        <div className="flex gap-2 mt-2">
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className={`flex-1 ${inp} text-xs`} style={inpStyle}/>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className={`flex-1 ${inp} text-xs`} style={inpStyle}/>
        </div>
      )}
    </Card>
  );

  // =============================
  // TAB: DASHBOARD
  // =============================
  const DashboardView = () => (
    <div>
      <PeriodBar/>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <KpiCard icon={Users} label="Total" value={kpis.t} color={T.P}/>
        <KpiCard icon={CheckCircle2} label="Fechados" value={kpis.fc} sub={`${kpis.pct}%`} color={T.G}/>
        <KpiCard icon={DollarSign} label="Receita" value={fBRL(kpis.rec)} color={T.G}/>
        <KpiCard icon={TrendingUp} label="Ticket Médio" value={fBRL(kpis.tk)} color={T.V}/>
      </div>

      {/* Status Pie */}
      {pieD.length>0 && (
        <Card className="p-4 mb-4">
          <h3 className="text-xs font-bold mb-3" style={{color:T.text2}}>STATUS DOS CLIENTES</h3>
          <div className="flex items-center gap-4">
            <div style={{width:100,height:100}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={pieD} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value" stroke="none">
                  {pieD.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {pieD.map((d,i)=>(
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:d.color}}/>
                    <span className="text-xs">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Revenue by Origin */}
      {barD.length>0 && (
        <Card className="p-4 mb-4">
          <h3 className="text-xs font-bold mb-3" style={{color:T.text2}}>RECEITA POR ORIGEM</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barD} margin={{top:5,right:5,left:-15,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="name" tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false} tickFormatter={v=>`R$${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="value" radius={[6,6,0,0]} maxBarSize={36}>
                {barD.map((_,i)=><Cell key={i} fill={i%2===0?T.P:T.G}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Leads per Day */}
      {lineD.length>0 && (
        <Card className="p-4 mb-4">
          <h3 className="text-xs font-bold mb-3" style={{color:T.text2}}>LEADS POR DIA</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lineD} margin={{top:5,right:5,left:-15,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="date" tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="leads" stroke={T.P} strokeWidth={2.5} dot={{fill:T.P,r:3,strokeWidth:2,stroke:T.card}} activeDot={{r:5,fill:T.G}}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Financial Summary */}
      <Card className="p-4 mb-4">
        <h3 className="text-xs font-bold mb-3" style={{color:T.text2}}>RESUMO FINANCEIRO — {perLabel}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.G+"10"}}>
            <div className="flex items-center gap-2"><ArrowUpCircle size={16} style={{color:T.G}}/><span className="text-sm">Receitas</span></div>
            <span className="text-sm font-bold" style={{color:T.G}}>{fBRL(finKpis.receitas)}</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.R+"10"}}>
            <div className="flex items-center gap-2"><ArrowDownCircle size={16} style={{color:T.R}}/><span className="text-sm">Custos</span></div>
            <span className="text-sm font-bold" style={{color:T.R}}>{fBRL(finKpis.custos)}</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.border+"40",borderTop:`1px solid ${T.border}`}}>
            <span className="text-sm font-bold">Resultado</span>
            <span className="text-sm font-bold" style={{color:finKpis.resultado>=0?T.G:T.R}}>{fBRL(finKpis.resultado)}</span>
          </div>
        </div>
      </Card>
    </div>
  );

  // =============================
  // TAB: CLIENTES
  // =============================
  const ClientForm = () => (
    <div className="pb-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={()=>{setShowForm(false);setEditId(null);setForm({...emptyClient,origem:originNames[0]||""});}} className="p-2 rounded-xl" style={{color:T.text2}}><ChevronLeft size={20}/></button>
        <h2 className="text-base font-bold">{editId?"Editar Cliente":"Novo Cliente"}</h2>
      </div>
      <Card className="p-4">
        <div className="space-y-3">
          {Object.entries(fields).filter(([,f])=>f.enabled).map(([key,field])=>{
            if(key==="status") return (
              <div key={key}>
                <label className="block text-[11px] font-semibold mb-2 uppercase tracking-wider" style={{color:T.text2}}>Status</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_MAP).map(([k,s])=>(
                    <button key={k} onClick={()=>setForm({...form,status:k})}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                      style={form.status===k?{backgroundColor:s.color+"20",color:s.color,border:`2px solid ${s.color}`}:{backgroundColor:T.input,color:T.text2,border:`2px solid ${T.border}`}}>
                      <s.Icon size={14}/>{s.label}
                    </button>
                  ))}
                </div>
              </div>
            );
            if(key==="origem") return (
              <div key={key}>
                <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>{field.label}</label>
                {renderSelect(form.origem,e=>setForm({...form,origem:e.target.value}),originNames.map(o=>({value:o,label:o})))}
              </div>
            );
            const formKey = key==="dataVeio"?"dataVeio":key==="dataServico"?"dataServico":key;
            const val = form[formKey]||"";
            return (
              <div key={key}>
                <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>{field.label}</label>
                {field.type==="textarea"?(
                  <textarea value={val} onChange={e=>setForm({...form,[formKey]:e.target.value})} rows={3} className={inp} style={inpStyle} placeholder={`${field.label}...`}/>
                ):(
                  <input type={field.type==="phone"?"text":field.type==="number"?"number":field.type} value={field.type==="phone"?val:val}
                    onChange={e=>setForm({...form,[formKey]:field.type==="phone"?maskPhone(e.target.value):e.target.value})}
                    placeholder={field.type==="phone"?"(00) 00000-0000":field.type==="number"?"0,00":`${field.label}...`}
                    maxLength={field.type==="phone"?15:undefined} className={inp} style={inpStyle}/>
                )}
                {field.type==="phone"&&<p className="text-[10px] mt-0.5" style={{color:T.text2+"80"}}>{val.replace(/\D/g,"").length}/11</p>}
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-5 pt-4" style={{borderTop:`1px solid ${T.border}`}}>
          <button onClick={submitClient} className={`flex-1 ${btnPrimary}`} style={{background:`linear-gradient(135deg,${T.P},${T.P}cc)`}}>
            {editId?"Atualizar":"Cadastrar"}
          </button>
          {editId&&<button onClick={()=>{setEditId(null);setForm({...emptyClient,origem:originNames[0]||""});setShowForm(false);}} className="px-4 py-2.5 rounded-xl text-sm" style={{color:T.text2}}>Cancelar</button>}
        </div>
      </Card>
    </div>
  );

  const ClientsView = () => {
    if(showForm) return <ClientForm/>;
    return (
      <div>
        <PeriodBar/>
        {/* Search + Actions */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:T.text2}}/>
            <input type="text" value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar nome, WhatsApp..." className={`${inp} pl-9 text-xs`} style={inpStyle}/>
          </div>
          <button onClick={()=>exportCSV(filtered,fields)} className="p-2.5 rounded-xl transition-all active:scale-95" style={{backgroundColor:T.G+"15",color:T.G}}>
            <Download size={16}/>
          </button>
          <button onClick={()=>{setEditId(null);setForm({...emptyClient,origem:originNames[0]||""});setShowForm(true);}} className="p-2.5 rounded-xl transition-all active:scale-95" style={{background:`linear-gradient(135deg,${T.P},${T.P}cc)`}}>
            <Plus size={16} color="white"/>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {[{v:"todos",l:"Todos"},{v:"fechado",l:"Fechados"},{v:"andamento",l:"Andamento"},{v:"naoFechado",l:"Não Fechados"}].map(s=>(
            <button key={s.v} onClick={()=>setFSt(s.v)}
              className="px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all shrink-0"
              style={fSt===s.v?{backgroundColor:T.P+"20",color:T.P}:{color:T.text2,backgroundColor:T.card}}>
              {s.l}
            </button>
          ))}
        </div>

        {/* Client List */}
        <p className="text-[10px] font-semibold mb-2 px-1" style={{color:T.text2}}>{filtered.length} cliente(s) — {perLabel}</p>
        <div className="space-y-2">
          {filtered.length===0?(
            <Card className="p-8 text-center"><p className="text-sm" style={{color:T.text2}}>Nenhum cliente encontrado.</p></Card>
          ):filtered.map(c=>(
            <Card key={c.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold truncate">{c.nome}</p>
                    <StatusBadge status={c.status} onClick={()=>cycleStatus(c.id)} small/>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {c.numero && <p className="text-[11px] flex items-center gap-1" style={{color:T.text2}}><Phone size={10}/>{c.numero}</p>}
                    {c.valor>0 && <p className="text-[11px] font-bold" style={{color:T.G}}>{fBRL(c.valor)}</p>}
                    {c.origem && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{backgroundColor:T.P+"12",color:T.P}}>{c.origem}</span>}
                    <p className="text-[10px]" style={{color:T.text2}}>{fDate(c.data_veio)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={()=>editClient(c)} className="p-1.5 rounded-lg" style={{color:T.text2}}><Pencil size={13}/></button>
                  <button onClick={()=>delClient(c.id)} className="p-1.5 rounded-lg" style={{color:T.text2}}><Trash2 size={13}/></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // =============================
  // TAB: FINANCEIRO
  // =============================
  const TxFormView = () => (
    <div className="pb-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={()=>setShowTxForm(false)} className="p-2 rounded-xl" style={{color:T.text2}}><ChevronLeft size={20}/></button>
        <h2 className="text-base font-bold">Nova Transação</h2>
      </div>
      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold mb-2 uppercase tracking-wider" style={{color:T.text2}}>Tipo</label>
            <div className="flex gap-2">
              {[{v:"receita",l:"Receita",c:T.G,I:ArrowUpCircle},{v:"custo",l:"Custo",c:T.R,I:ArrowDownCircle}].map(t=>(
                <button key={t.v} onClick={()=>setTxForm({...txForm,tipo:t.v})}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={txForm.tipo===t.v?{backgroundColor:t.c+"20",color:t.c,border:`2px solid ${t.c}`}:{backgroundColor:T.input,color:T.text2,border:`2px solid ${T.border}`}}>
                  <t.I size={16}/>{t.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Descrição</label>
            <input type="text" value={txForm.descricao} onChange={e=>setTxForm({...txForm,descricao:e.target.value})} placeholder="Ex: Serviço de limpeza" className={inp} style={inpStyle}/>
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Valor (R$)</label>
            <input type="number" value={txForm.valor} onChange={e=>setTxForm({...txForm,valor:e.target.value})} placeholder="0,00" min="0" step="0.01" className={inp} style={inpStyle}/>
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Data</label>
            <input type="date" value={txForm.data} onChange={e=>setTxForm({...txForm,data:e.target.value})} className={inp} style={inpStyle}/>
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Cliente (opcional)</label>
            {renderSelect(txForm.client_id,e=>setTxForm({...txForm,client_id:e.target.value}),[{value:"",label:"Nenhum"},...clients.map(c=>({value:String(c.id),label:c.nome}))])}
          </div>
        </div>
        <button onClick={submitTx} className={`w-full mt-5 ${btnPrimary}`}
          style={{background:txForm.tipo==="receita"?`linear-gradient(135deg,${T.G},${T.G}cc)`:`linear-gradient(135deg,${T.R},${T.R}cc)`}}>
          Salvar {txForm.tipo==="receita"?"Receita":"Custo"}
        </button>
      </Card>
    </div>
  );

  const FinanceiroView = () => {
    if(showTxForm) return <TxFormView/>;
    return (
      <div>
        <PeriodBar/>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <KpiCard icon={ArrowUpCircle} label="Receitas" value={fBRL(finKpis.receitas)} color={T.G}/>
          <KpiCard icon={ArrowDownCircle} label="Custos" value={fBRL(finKpis.custos)} color={T.R}/>
        </div>
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">Resultado</span>
            <span className="text-lg font-extrabold" style={{color:finKpis.resultado>=0?T.G:T.R}}>{fBRL(finKpis.resultado)}</span>
          </div>
        </Card>

        {/* Add Button */}
        <button onClick={()=>setShowTxForm(true)} className={`w-full mb-4 ${btnPrimary} flex items-center justify-center gap-2`}
          style={{background:`linear-gradient(135deg,${T.P},${T.V})`}}>
          <Plus size={16}/>Nova Transação
        </button>

        {/* Transaction List */}
        <p className="text-[10px] font-semibold mb-2 px-1" style={{color:T.text2}}>{finKpis.txList.length} transação(ões)</p>
        <div className="space-y-2">
          {finKpis.txList.length===0?(
            <Card className="p-8 text-center"><p className="text-sm" style={{color:T.text2}}>Nenhuma transação no período.</p></Card>
          ):finKpis.txList.map(tx=>(
            <Card key={tx.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2" style={{backgroundColor:(tx.tipo==="receita"?T.G:T.R)+"12"}}>
                    {tx.tipo==="receita"?<ArrowUpCircle size={16} style={{color:T.G}}/>:<ArrowDownCircle size={16} style={{color:T.R}}/>}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{tx.descricao}</p>
                    <p className="text-[10px]" style={{color:T.text2}}>{fDate(tx.data)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{color:tx.tipo==="receita"?T.G:T.R}}>
                    {tx.tipo==="custo"?"- ":""}{fBRL(tx.valor)}
                  </span>
                  <button onClick={()=>delTx(tx.id)} className="p-1 rounded-lg" style={{color:T.text2}}><Trash2 size={12}/></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // =============================
  // TAB: CONFIG
  // =============================
  const ConfigView = () => (
    <div>
      {/* Form Fields Config */}
      <Card className="p-4 mb-4">
        <h2 className="text-sm font-bold mb-1">Campos do Formulário</h2>
        <p className="text-[11px] mb-4" style={{color:T.text2}}>Escolha quais campos aparecem ao cadastrar cliente. Salve para manter permanentemente.</p>
        <div className="space-y-2">
          {Object.entries(fields).map(([key,field])=>(
            <div key={key} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}>
              <div className="flex items-center gap-2.5">
                <field.icon size={15} style={{color:field.enabled?T.P:T.text2+"50"}}/>
                <span className={`text-sm ${field.enabled?"font-semibold":""}`} style={{color:field.enabled?T.text:T.text2+"70"}}>{field.label}</span>
                {key==="nome"&&<span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{backgroundColor:T.Y+"20",color:T.Y}}>Obrigatório</span>}
              </div>
              <button onClick={()=>toggleField(key)} disabled={key==="nome"}
                className="w-10 h-5 rounded-full transition-all relative" style={{backgroundColor:field.enabled?T.P:T.border,opacity:key==="nome"?.5:1}}>
                <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all" style={{left:field.enabled?20:2}}/>
              </button>
            </div>
          ))}
        </div>
        <button onClick={saveSettings} className={`w-full mt-4 ${btnPrimary} flex items-center justify-center gap-2`}
          style={{background:settingsSaved?`linear-gradient(135deg,${T.G},${T.G}cc)`:`linear-gradient(135deg,${T.P},${T.P}cc)`}}>
          {settingsSaved?<><CheckCircle2 size={15}/>Salvo!</>:<><Save size={15}/>Salvar Configuração</>}
        </button>
      </Card>

      {/* Origins */}
      <Card className="p-4 mb-4">
        <h2 className="text-sm font-bold mb-1">Origens de Leads</h2>
        <p className="text-[11px] mb-3" style={{color:T.text2}}>De onde vêm seus clientes.</p>
        <div className="flex gap-2 mb-3">
          <input type="text" value={newOr} onChange={e=>setNewOr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addOr()}
            placeholder="Nova origem..." className={`flex-1 ${inp} text-xs`} style={inpStyle}/>
          <button onClick={addOr} className="px-3 py-2 rounded-xl text-white text-xs font-bold active:scale-95" style={{background:`linear-gradient(135deg,${T.P},${T.P}cc)`}}>
            <Plus size={14}/>
          </button>
        </div>
        <div className="space-y-1.5">
          {origins.map(o=>(
            <div key={o.id} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{backgroundColor:T.P}}/><span className="text-xs font-semibold">{o.name}</span></div>
              {o.is_default?<span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{backgroundColor:T.P+"15",color:T.P}}>Padrão</span>
              :<button onClick={()=>remOr(o)} className="p-1 rounded-lg" style={{color:T.text2}}><Trash2 size={12}/></button>}
            </div>
          ))}
        </div>
      </Card>

      {/* LGPD Notice */}
      <Card className="p-4 mb-4" style={{borderColor:T.V+"30"}}>
        <h3 className="text-xs font-bold mb-1" style={{color:T.V}}>LGPD — Proteção de Dados</h3>
        <p className="text-[11px] leading-relaxed" style={{color:T.text2}}>
          Este CRM não coleta dados sensíveis (CPF, RG, dados de saúde). Apenas informações necessárias para a prestação do serviço são armazenadas. O cliente pode solicitar exclusão de seus dados a qualquer momento.
        </p>
      </Card>

      {/* Logout */}
      <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all" style={{color:T.R,backgroundColor:T.R+"10"}}>
        <LogOut size={16}/>Sair da Conta
      </button>
      <p className="text-center text-[10px] mt-3 mb-6" style={{color:T.text2+"60"}}>{session.user.email}</p>
    </div>
  );

  // =============================
  // LAYOUT
  // =============================
  return (
    <div style={{fontFamily:"'Instrument Sans',system-ui,-apple-system,sans-serif",backgroundColor:T.bg,color:T.text}} className="flex flex-col h-screen overflow-hidden">
      {/* HEADER */}
      <header className="px-4 py-3 flex items-center justify-between shrink-0" style={{backgroundColor:T.card,borderBottom:`1px solid ${T.border}`}}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:`linear-gradient(135deg,${T.P},${T.V})`}}>
            <BarChart3 size={16} color="white"/>
          </div>
          <h1 className="text-sm font-bold tracking-tight">LavCri CRM</h1>
        </div>
        <p className="text-[10px] font-medium" style={{color:T.text2}}>v2.0</p>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {tab==="dash"&&<DashboardView/>}
        {tab==="clientes"&&<ClientsView/>}
        {tab==="financeiro"&&<FinanceiroView/>}
        {tab==="config"&&<ConfigView/>}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 px-2 shrink-0" style={{backgroundColor:T.card,borderTop:`1px solid ${T.border}`,paddingBottom:"max(8px, env(safe-area-inset-bottom))"}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>{setTab(n.id);setShowForm(false);setShowTxForm(false);}}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-w-[60px]"
            style={tab===n.id?{color:T.P}:{color:T.text2}}>
            <n.Icon size={20} strokeWidth={tab===n.id?2.5:1.8}/>
            <span className="text-[10px] font-semibold">{n.label}</span>
            {tab===n.id&&<div className="w-1 h-1 rounded-full mt-0.5" style={{backgroundColor:T.P}}/>}
          </button>
        ))}
      </nav>
    </div>
  );
}
