import { useState, useMemo, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Users, CheckCircle2, XCircle, DollarSign, TrendingUp, Star,
  Plus, Trash2, Pencil, X, Menu, LayoutDashboard, UserPlus,
  Settings, ChevronDown, Search, Filter, Download, Clock,
  LogOut, Loader2,
} from "lucide-react";

// ====================================================
// CONFIGURE AQUI: cole suas credenciais do Supabase
// ====================================================
const SUPABASE_URL = "https://lanzgjytslmbyytwvgdr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhbnpnanl0c2xtYnl5dHd2Z2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDY3NTYsImV4cCI6MjA4ODk4Mjc1Nn0.EaA8bwLsn0DrOx0c4OP7rL1FnidbOfwZtiMu1AoMc3Y";
// ====================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAARgAAACMCAYAAACnDrZtAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABcgklEQVR42u29d3gc1bn++54z21e92pab3EC2aS6AsbHcKAaHYiQDAZwQzE0oN4VAgACS4CYkGAg3gfCD0CEEJAgJkGAwxDamGWzcBe69qPcts3PO9/tjZ2VJlhvY2HDnfZ59JK12Z86cOeedr3+AAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhwcAj4/5V58jpcAqIsAAAAAElFTkSuQmCC";

const P = "#27a8de";
const G = "#8fc61f";
const R = "#ef4444";
const Y = "#f59e0b";
const BG = "#0f1117";
const CARD = "#1a1d27";
const CARD2 = "#222633";
const BORDER = "#2a2e3d";
const TEXT = "#e2e4ea";
const TEXT2 = "#8b8fa3";
const INPUT_BG = "#181b24";

const fBRL = (v) => (v == null || isNaN(v)) ? "R$ 0,00" : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fDate = (d) => { if (!d) return ""; const p = d.split("-"); return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d; };
const td = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; };
const sow = () => { const n = new Date(); const d = n.getDay(); const diff = n.getDate() - d + (d===0?-6:1); const m = new Date(n); m.setDate(diff); return `${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}-${String(m.getDate()).padStart(2,"0")}`; };
const som = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-01`; };

const STATUS_MAP = {
  fechado: { label: "Fechado", color: G, Icon: CheckCircle2 },
  andamento: { label: "Em Andamento", color: Y, Icon: Clock },
  naoFechado: { label: "Não Fechado", color: R, Icon: XCircle },
};

const maskPhone = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};

const empty = { nome:"", numero:"", origem:"", valor:"", dataVeio:td(), dataServico:"", status:"naoFechado" };

const exportCSV = (data) => {
  const header = "Nome,Número,Origem,Valor,Data Veio,Data Serviço,Status\n";
  const rows = data.map(c =>
    `"${c.nome}","${c.numero}","${c.origem}","${fBRL(c.valor)}","${fDate(c.data_veio)}","${fDate(c.data_servico)}","${STATUS_MAP[c.status]?.label || c.status}"`
  ).join("\n");
  const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `clientes_${td()}.csv`; a.click();
  URL.revokeObjectURL(url);
};

// ============================
// AUTH SCREEN
// ============================
function AuthScreen({ onAuth }) {
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
        setError("Conta criada! Verifique seu e-mail ou faça login.");
        setIsLogin(true);
      }
    } catch (e) {
      setError(e.message || "Erro ao autenticar.");
    } finally { setLoading(false); }
  };

  const inp = "w-full rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all";
  const inpStyle = { backgroundColor: INPUT_BG, border: `1px solid ${BORDER}`, color: TEXT };

  return (
    <div style={{backgroundColor:BG,color:TEXT,fontFamily:"system-ui,-apple-system,sans-serif"}} className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={`data:image/png;base64,${LOGO_B64}`} alt="LavCri" style={{width:160,height:"auto",margin:"0 auto 16px"}} />
          <h1 className="text-2xl font-bold mb-1">LavCri CRM</h1>
          <p className="text-sm" style={{color:TEXT2}}>{isLogin ? "Faça login para continuar" : "Crie sua conta"}</p>
        </div>
        <div className="rounded-3xl p-6" style={{backgroundColor:CARD,border:`1px solid ${BORDER}`}}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" className={inp} style={inpStyle}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Senha</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                placeholder="Mínimo 6 caracteres" className={inp} style={inpStyle}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
          </div>
          {error && <p className="text-xs mt-3 px-1" style={{color: error.includes("Conta criada") ? G : R}}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-4 py-3 rounded-2xl text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            style={{background:`linear-gradient(135deg, ${P}, ${P}cc)`,boxShadow:`0 4px 20px ${P}40`,opacity:loading?0.7:1}}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            {isLogin ? "Entrar" : "Criar Conta"}
          </button>
          <p className="text-center text-xs mt-4" style={{color:TEXT2}}>
            {isLogin ? "Não tem conta? " : "Já tem conta? "}
            <button onClick={() => {setIsLogin(!isLogin);setError("");}} className="font-bold hover:underline" style={{color:P}}>
              {isLogin ? "Criar conta" : "Fazer login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================
// MAIN CRM APP
// ============================
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{backgroundColor:BG,color:TEXT}} className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin" style={{color:P}} />
    </div>
  );

  if (!session) return <AuthScreen />;
  return <CRMDashboard session={session} />;
}

function CRMDashboard({ session }) {
  const [clients, setClients] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [newOr, setNewOr] = useState("");
  const [form, setForm] = useState({...empty});
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState("dash");
  const [sidebar, setSidebar] = useState(false);
  const [fPer, setFPer] = useState("tudo");
  const [fSt, setFSt] = useState("todos");
  const [fOr, setFOr] = useState("todas");
  const [srch, setSrch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dbLoading, setDbLoading] = useState(true);

  // Fetch data from Supabase
  const fetchClients = useCallback(async () => {
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (data) setClients(data);
  }, []);

  const fetchOrigins = useCallback(async () => {
    const { data } = await supabase.from("origins").select("*").order("id");
    if (data) setOrigins(data);
  }, []);

  useEffect(() => {
    Promise.all([fetchClients(), fetchOrigins()]).then(() => setDbLoading(false));
  }, [fetchClients, fetchOrigins]);

  const originNames = useMemo(() => origins.map(o => o.name), [origins]);

  // Set default origin in form when origins load
  useEffect(() => {
    if (originNames.length > 0 && !form.origem) {
      setForm(f => ({...f, origem: originNames[0]}));
    }
  }, [originNames]);

  const filtered = useMemo(() => clients.filter(c => {
    if (fPer === "custom") {
      if (dateFrom && c.data_veio < dateFrom) return false;
      if (dateTo && c.data_veio > dateTo) return false;
    } else if (fPer !== "tudo") {
      if (fPer === "hoje" && c.data_veio !== td()) return false;
      if (fPer === "semana" && c.data_veio < sow()) return false;
      if (fPer === "mes" && c.data_veio < som()) return false;
    }
    if (fSt !== "todos" && c.status !== fSt) return false;
    if (fOr !== "todas" && c.origem !== fOr) return false;
    if (srch) {
      const s = srch.toLowerCase();
      const valStr = fBRL(c.valor).toLowerCase();
      if (!c.nome.toLowerCase().includes(s) && !c.numero.includes(s) && !valStr.includes(s)) return false;
    }
    return true;
  }), [clients, fPer, fSt, fOr, srch, dateFrom, dateTo]);

  const kpis = useMemo(() => {
    const t = filtered.length;
    const fc = filtered.filter(c => c.status === "fechado");
    const nf = filtered.filter(c => c.status === "naoFechado");
    const ea = filtered.filter(c => c.status === "andamento");
    const rec = fc.reduce((s, c) => s + Number(c.valor), 0);
    const tk = fc.length > 0 ? rec / fc.length : 0;
    const oc = {};
    fc.forEach(c => { oc[c.origem] = (oc[c.origem]||0) + 1; });
    let mo = "—", mx = 0;
    Object.entries(oc).forEach(([k,v]) => { if(v>mx){mo=k;mx=v;} });
    return { t, fc:fc.length, nf:nf.length, ea:ea.length, pct:t>0?((fc.length/t)*100).toFixed(1):"0", rec, tk, mo };
  }, [filtered]);

  const barD = useMemo(() => {
    const m = {};
    filtered.filter(c => c.status === "fechado").forEach(c => { m[c.origem] = (m[c.origem]||0) + Number(c.valor); });
    return Object.entries(m).map(([name,value]) => ({name,value}));
  }, [filtered]);

  const lineD = useMemo(() => {
    const m = {};
    filtered.forEach(c => { const d = fDate(c.data_veio); m[d] = (m[d]||0)+1; });
    return Object.entries(m).sort((a,b) => {
      const [da,ma,ya] = a[0].split("/"); const [db,mb,yb] = b[0].split("/");
      return new Date(`${ya}-${ma}-${da}`) - new Date(`${yb}-${mb}-${db}`);
    }).map(([date,leads]) => ({date,leads}));
  }, [filtered]);

  // CRUD Operations
  const submit = useCallback(async () => {
    if (!form.nome || !form.numero || !form.origem || !form.valor) return;
    const val = typeof form.valor === "string" ? parseFloat(form.valor.replace(",",".")) : Number(form.valor);
    if (isNaN(val)) return;

    const record = {
      nome: form.nome,
      numero: form.numero,
      origem: form.origem,
      valor: val,
      data_veio: form.dataVeio,
      data_servico: form.dataServico || null,
      status: form.status,
      user_id: session.user.id,
    };

    if (editId !== null) {
      await supabase.from("clients").update(record).eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("clients").insert(record);
    }

    setForm({...empty, origem: originNames[0] || ""});
    setTab("dash");
    fetchClients();
  }, [form, editId, session, originNames, fetchClients]);

  const edit = (c) => {
    setForm({nome:c.nome,numero:c.numero,origem:c.origem,valor:c.valor,dataVeio:c.data_veio,dataServico:c.data_servico||"",status:c.status});
    setEditId(c.id); setTab("cad");
  };

  const del = async (id) => {
    await supabase.from("clients").delete().eq("id", id);
    fetchClients();
  };

  const cycleStatus = async (id) => {
    const order = ["naoFechado", "andamento", "fechado"];
    const client = clients.find(c => c.id === id);
    if (!client) return;
    const idx = order.indexOf(client.status);
    const newStatus = order[(idx + 1) % 3];
    await supabase.from("clients").update({ status: newStatus }).eq("id", id);
    fetchClients();
  };

  const addOr = async () => {
    const tr = newOr.trim();
    if (tr && !originNames.includes(tr)) {
      await supabase.from("origins").insert({ name: tr, is_default: false, user_id: session.user.id });
      setNewOr("");
      fetchOrigins();
    }
  };

  const remOr = async (o) => {
    const origin = origins.find(x => x.name === o.name && !x.is_default);
    if (origin) {
      await supabase.from("origins").delete().eq("id", origin.id);
      fetchOrigins();
    }
  };

  const logout = async () => { await supabase.auth.signOut(); };

  const inp = "w-full rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all";
  const inpStyle = { backgroundColor: INPUT_BG, border: `1px solid ${BORDER}`, color: TEXT };
  const tabItems = [{id:"dash",label:"Dashboard",Icon:LayoutDashboard},{id:"cad",label:"Novo Cliente",Icon:UserPlus},{id:"orig",label:"Origens",Icon:Settings}];

  const StatusBadge = ({status, onClick}) => {
    const s = STATUS_MAP[status] || STATUS_MAP.naoFechado;
    return (
      <button onClick={onClick}
        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95"
        style={{backgroundColor:s.color+"20",color:s.color,border:`1px solid ${s.color}30`}}>
        <s.Icon size={12}/>{s.label}
      </button>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{backgroundColor:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"10px 14px"}}>
        <p style={{color:TEXT2,fontSize:11,marginBottom:4}}>{label}</p>
        {payload.map((p,i) => (
          <p key={i} style={{color:p.color || P,fontSize:13,fontWeight:700}}>
            {p.dataKey === "value" ? fBRL(p.value) : p.value}
          </p>
        ))}
      </div>
    );
  };

  if (dbLoading) return (
    <div style={{backgroundColor:BG,color:TEXT}} className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin" style={{color:P}} />
    </div>
  );

  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",backgroundColor:BG,color:TEXT}} className="flex h-screen overflow-hidden">
      {sidebar && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebar(false)}/>}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 flex flex-col transition-transform duration-300 ${sidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{backgroundColor:CARD,borderRight:`1px solid ${BORDER}`}}>
        <div className="p-5 flex items-center justify-between" style={{borderBottom:`1px solid ${BORDER}`}}>
          <img src={`data:image/png;base64,${LOGO_B64}`} alt="LavCri" style={{width:130,height:"auto",objectFit:"contain"}} />
          <button onClick={() => setSidebar(false)} className="lg:hidden p-1 rounded-xl hover:bg-white/10 transition" style={{color:TEXT2}}><X size={18}/></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabItems.map(t => (
            <button key={t.id} onClick={() => {setTab(t.id);setSidebar(false);}}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
              style={tab===t.id ? {background:`linear-gradient(135deg, ${P}25, ${P}10)`,color:P} : {color:TEXT2}}>
              <t.Icon size={18}/>{t.label}
            </button>
          ))}
        </nav>
        <div className="p-3" style={{borderTop:`1px solid ${BORDER}`}}>
          <p className="text-xs truncate mb-2 px-2" style={{color:TEXT2}}>{session.user.email}</p>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all hover:bg-white/5"
            style={{color:R}}>
            <LogOut size={16}/>Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="px-4 lg:px-6 py-3 flex items-center justify-between shrink-0" style={{backgroundColor:CARD,borderBottom:`1px solid ${BORDER}`}}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(true)} className="lg:hidden p-2 rounded-2xl hover:bg-white/10 transition" style={{color:TEXT2}}><Menu size={18}/></button>
            <h1 className="text-lg font-bold">{tab==="dash"?"Dashboard":tab==="cad"?(editId?"Editar Cliente":"Novo Cliente"):"Origens"}</h1>
          </div>
          <div className="flex items-center gap-2">
            {tab==="dash" && (
              <>
                <button onClick={() => exportCSV(filtered)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{backgroundColor:G+"20",color:G,border:`1px solid ${G}30`}}>
                  <Download size={15}/>Exportar
                </button>
                <button onClick={() => {setEditId(null);setForm({...empty,origem:originNames[0]||""});setTab("cad");}}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
                  style={{background:`linear-gradient(135deg, ${P}, ${P}cc)`,boxShadow:`0 4px 15px ${P}40`}}>
                  <Plus size={15}/>Novo
                </button>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* DASHBOARD */}
          {tab==="dash" && (<div>
            <div className="rounded-3xl p-4 mb-5" style={{backgroundColor:CARD,border:`1px solid ${BORDER}`}}>
              <div className="flex items-center gap-2 mb-3"><Filter size={15} style={{color:P}}/><span className="text-sm font-bold">Filtros</span></div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{color:TEXT2}}>Período</label>
                  <div className="relative">
                    <select value={fPer} onChange={e => {setFPer(e.target.value);if(e.target.value!=="custom"){setDateFrom("");setDateTo("");}}}
                      className={`${inp} appearance-none pr-8`} style={inpStyle}>
                      <option value="tudo">Tudo</option><option value="hoje">Hoje</option>
                      <option value="semana">Esta Semana</option><option value="mes">Este Mês</option>
                      <option value="custom">Personalizado</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:TEXT2}}/>
                  </div>
                </div>
                {fPer === "custom" && (
                  <>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{color:TEXT2}}>De</label>
                      <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={inp} style={inpStyle}/>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{color:TEXT2}}>Até</label>
                      <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={inp} style={inpStyle}/>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{color:TEXT2}}>Status</label>
                  <div className="relative">
                    <select value={fSt} onChange={e => setFSt(e.target.value)} className={`${inp} appearance-none pr-8`} style={inpStyle}>
                      <option value="todos">Todos</option><option value="fechado">Fechados</option>
                      <option value="andamento">Em Andamento</option><option value="naoFechado">Não Fechados</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:TEXT2}}/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{color:TEXT2}}>Origem</label>
                  <div className="relative">
                    <select value={fOr} onChange={e => setFOr(e.target.value)} className={`${inp} appearance-none pr-8`} style={inpStyle}>
                      <option value="todas">Todas</option>
                      {originNames.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:TEXT2}}/>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="relative">
                  <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:TEXT2}}/>
                  <input type="text" value={srch} onChange={e => setSrch(e.target.value)}
                    placeholder="Buscar por nome, número ou valor..."
                    className={`${inp} pl-11`} style={inpStyle}/>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {[
                {icon:Users,label:"Total Clientes",value:kpis.t,color:P},
                {icon:CheckCircle2,label:"Fechados",value:kpis.fc,sub:`${kpis.pct}%`,color:G},
                {icon:Clock,label:"Em Andamento",value:kpis.ea,color:Y},
                {icon:XCircle,label:"Não Fechados",value:kpis.nf,color:R},
                {icon:DollarSign,label:"Receita Total",value:fBRL(kpis.rec),color:G},
                {icon:TrendingUp,label:"Ticket Médio",value:fBRL(kpis.tk),color:P},
                {icon:Star,label:"Melhor Origem",value:kpis.mo,color:Y},
              ].map((k,i) => (
                <div key={i} className={`rounded-3xl p-5 flex items-start gap-4 transition-all hover:scale-[1.02] ${i===6?"col-span-2 lg:col-span-1":""}`}
                  style={{backgroundColor:CARD,border:`1px solid ${BORDER}`}}>
                  <div className="rounded-2xl p-3 shrink-0" style={{background:`linear-gradient(135deg, ${k.color}25, ${k.color}10)`}}>
                    <k.icon size={20} style={{color:k.color}}/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{color:TEXT2}}>{k.label}</p>
                    <p className="text-2xl font-extrabold truncate mt-1">{k.value}</p>
                    {k.sub && <p className="text-xs mt-0.5" style={{color:TEXT2}}>{k.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl mb-5 overflow-hidden" style={{backgroundColor:CARD,border:`1px solid ${BORDER}`}}>
              <div className="px-5 py-4 flex items-center justify-between" style={{borderBottom:`1px solid ${BORDER}`}}>
                <div>
                  <h2 className="text-sm font-bold">Clientes</h2>
                  <p className="text-xs" style={{color:TEXT2}}>{filtered.length} registro(s)</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{borderBottom:`1px solid ${BORDER}`}}>
                      {["Nome","Número","Origem","Valor","Veio","Serviço","Status",""].map((h,i) => (
                        <th key={i} className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap ${i===7?"text-right w-20":""}`} style={{color:TEXT2}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-10 text-center text-sm" style={{color:TEXT2}}>Nenhum cliente encontrado.</td></tr>
                    ) : filtered.map(c => (
                      <tr key={c.id} className="transition-colors" style={{borderBottom:`1px solid ${BORDER}40`}}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor="rgba(255,255,255,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor="transparent"}>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap">{c.nome}</td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{color:TEXT2}}>{c.numero}</td>
                        <td className="px-4 py-3"><span className="text-xs font-bold px-3 py-1 rounded-full" style={{backgroundColor:P+"18",color:P}}>{c.origem}</span></td>
                        <td className="px-4 py-3 font-bold whitespace-nowrap" style={{color:G}}>{fBRL(c.valor)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs" style={{color:TEXT2}}>{fDate(c.data_veio)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs" style={{color:TEXT2}}>{fDate(c.data_servico)}</td>
                        <td className="px-4 py-3"><StatusBadge status={c.status} onClick={() => cycleStatus(c.id)}/></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => edit(c)} className="p-2 rounded-xl hover:bg-white/10 transition" style={{color:TEXT2}}><Pencil size={14}/></button>
                            <button onClick={() => del(c.id)} className="p-2 rounded-xl hover:bg-red-500/10 transition" style={{color:TEXT2}}><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-3xl p-5" style={{backgroundColor:CARD,border:`1px solid ${BORDER}`}}>
                <h3 className="text-sm font-bold mb-4">Receita por Origem</h3>
                {barD.length === 0 ? <p className="text-sm text-center py-10" style={{color:TEXT2}}>Sem dados.</p> : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={barD} margin={{top:5,right:5,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                      <XAxis dataKey="name" tick={{fontSize:10,fill:TEXT2}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fontSize:10,fill:TEXT2}} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Bar dataKey="value" radius={[8,8,0,0]} maxBarSize={44}>
                        {barD.map((_,i) => <Cell key={i} fill={i%2===0?P:G}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="rounded-3xl p-5" style={{backgroundColor:CARD,border:`1px solid ${BORDER}`}}>
                <h3 className="text-sm font-bold mb-4">Leads por Dia</h3>
                {lineD.length === 0 ? <p className="text-sm text-center py-10" style={{color:TEXT2}}>Sem dados.</p> : (
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={lineD} margin={{top:5,right:5,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                      <XAxis dataKey="date" tick={{fontSize:10,fill:TEXT2}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fontSize:10,fill:TEXT2}} axisLine={false} tickLine={false} allowDecimals={false}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Line type="monotone" dataKey="leads" stroke={P} strokeWidth={3} dot={{fill:P,r:4,strokeWidth:2,stroke:CARD}} activeDot={{r:6,fill:G,stroke:CARD,strokeWidth:2}}/>
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>)}

          {/* FORM */}
          {tab==="cad" && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-3xl p-6" style={{backgroundColor:CARD,border:`1px solid ${BORDER}`}}>
                <h2 className="text-lg font-bold mb-1">{editId?"Editar Cliente":"Novo Cliente"}</h2>
                <p className="text-sm mb-6" style={{color:TEXT2}}>{editId?"Atualize os dados.":"Preencha os dados para registrar."}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Nome do Cliente</label>
                    <input type="text" value={form.nome} onChange={e => setForm({...form,nome:e.target.value})} placeholder="Ex: João da Silva" className={inp} style={inpStyle}/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Número / WhatsApp</label>
                    <input type="text" value={form.numero} onChange={e => setForm({...form,numero:maskPhone(e.target.value)})}
                      placeholder="(00) 00000-0000" maxLength={15} className={inp} style={inpStyle}/>
                    <p className="text-xs mt-1" style={{color:TEXT2+"80"}}>{form.numero.replace(/\D/g,"").length}/11 dígitos</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Origem</label>
                    <div className="relative">
                      <select value={form.origem} onChange={e => setForm({...form,origem:e.target.value})} className={`${inp} appearance-none pr-8`} style={inpStyle}>
                        {originNames.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:TEXT2}}/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Valor do Serviço (R$)</label>
                    <input type="number" value={form.valor} onChange={e => setForm({...form,valor:e.target.value})} placeholder="0,00" min="0" step="0.01" className={inp} style={inpStyle}/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Data que Veio</label>
                    <input type="date" value={form.dataVeio} onChange={e => setForm({...form,dataVeio:e.target.value})} className={inp} style={inpStyle}/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Data do Serviço</label>
                    <input type="date" value={form.dataServico} onChange={e => setForm({...form,dataServico:e.target.value})} className={inp} style={inpStyle}/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-2" style={{color:TEXT2}}>Status</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(STATUS_MAP).map(([key, s]) => (
                        <button key={key} type="button" onClick={() => setForm({...form,status:key})}
                          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-2xl transition-all"
                          style={form.status === key
                            ? {backgroundColor:s.color+"25",color:s.color,border:`2px solid ${s.color}`}
                            : {backgroundColor:INPUT_BG,color:TEXT2,border:`2px solid ${BORDER}`}}>
                          <s.Icon size={16}/>{s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-5" style={{borderTop:`1px solid ${BORDER}`}}>
                  <button onClick={submit}
                    className="px-8 py-3 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
                    style={{background:`linear-gradient(135deg, ${P}, ${P}cc)`,boxShadow:`0 4px 20px ${P}40`}}>
                    {editId?"Atualizar":"Cadastrar"}
                  </button>
                  {editId && (
                    <button onClick={() => {setEditId(null);setForm({...empty,origem:originNames[0]||""});}}
                      className="px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-white/5 transition" style={{color:TEXT2}}>Cancelar</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ORIGINS */}
          {tab==="orig" && (
            <div className="max-w-lg mx-auto">
              <div className="rounded-3xl p-6" style={{backgroundColor:CARD,border:`1px solid ${BORDER}`}}>
                <h2 className="text-lg font-bold mb-1">Gerenciar Origens</h2>
                <p className="text-sm mb-5" style={{color:TEXT2}}>Adicione ou remova fontes de origem dos leads.</p>
                <div className="flex gap-2 mb-5">
                  <input type="text" value={newOr} onChange={e => setNewOr(e.target.value)} onKeyDown={e => e.key==="Enter" && addOr()}
                    placeholder="Nova origem..." className={`flex-1 ${inp}`} style={inpStyle}/>
                  <button onClick={addOr}
                    className="px-5 py-2.5 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0"
                    style={{background:`linear-gradient(135deg, ${P}, ${P}cc)`}}>
                    <Plus size={15}/>Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {origins.map(o => (
                    <div key={o.id} className="flex items-center justify-between rounded-2xl px-4 py-3"
                      style={{backgroundColor:CARD2,border:`1px solid ${BORDER}`}}>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full" style={{backgroundColor:P}}/>
                        <span className="text-sm font-semibold">{o.name}</span>
                      </div>
                      {o.is_default ? (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-lg" style={{backgroundColor:P+"15",color:P}}>Padrão</span>
                      ) : (
                        <button onClick={() => remOr(o)} className="p-1.5 rounded-xl hover:bg-red-500/10 transition" style={{color:TEXT2}}>
                          <Trash2 size={14}/>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
