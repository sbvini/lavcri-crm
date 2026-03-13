import { useState, useMemo, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, CheckCircle2, XCircle, DollarSign, TrendingUp, Star, Plus, Trash2, Pencil, X, ChevronDown, Search, Download, Clock, LogOut, Loader2, Wallet, ArrowUpCircle, ArrowDownCircle, Phone, Save, ChevronLeft, Calendar, BarChart3, Sliders, Home, Crown, Megaphone } from "lucide-react";

const SUPABASE_URL = "https://lanzgjytslmbyytwvgdr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhbnpnanl0c2xtYnl5dHd2Z2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDY3NTYsImV4cCI6MjA4ODk4Mjc1Nn0.EaA8bwLsn0DrOx0c4OP7rL1FnidbOfwZtiMu1AoMc3Y";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const T = { bg:"#0b0d11", card:"#14171f", card2:"#1a1e28", border:"#222738", text:"#e8eaf0", text2:"#7c819a", input:"#111420", P:"#27a8de", G:"#34d399", R:"#f87171", Y:"#fbbf24", V:"#a78bfa", O:"#fb923c" };
const ic = "w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all placeholder:text-gray-600";
const is = { backgroundColor:T.input, border:`1px solid ${T.border}`, color:T.text };
const bp = "px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95";
const fBRL = v => (v==null||isNaN(v))?"R$ 0,00":Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const fDate = d => { if(!d) return "-"; const p=d.split("-"); return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:d; };
const td = () => { const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; };
const sow = () => { const n=new Date(),d=n.getDay(),diff=n.getDate()-d+(d===0?-6:1),m=new Date(n); m.setDate(diff); return `${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}-${String(m.getDate()).padStart(2,"0")}`; };
const som = () => { const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-01`; };
const maskPhone = v => { const d=v.replace(/\D/g,"").slice(0,11); if(d.length<=2) return d.length?`(${d}`:""; if(d.length<=7) return `(${d.slice(0,2)}) ${d.slice(2)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`; };
const daysBetween = (a,b) => Math.floor((new Date(b)-new Date(a))/86400000);

const SM = { fechado:{label:"Fechado",color:T.G,Icon:CheckCircle2}, andamento:{label:"Em Andamento",color:T.Y,Icon:Clock}, naoFechado:{label:"N\u00e3o Fechado",color:T.R,Icon:XCircle} };
const DF = { nome:{label:"Nome",enabled:true,type:"text"}, numero:{label:"WhatsApp",enabled:true,type:"phone"}, email:{label:"E-mail",enabled:false,type:"email"}, endereco:{label:"Endere\u00e7o",enabled:false,type:"text"}, origem:{label:"Origem",enabled:true,type:"select"}, valor:{label:"Valor (R$)",enabled:true,type:"number"}, dataVeio:{label:"Data Contato",enabled:true,type:"date"}, dataServico:{label:"Data Servi\u00e7o",enabled:false,type:"date"}, observacoes:{label:"Observa\u00e7ões",enabled:false,type:"textarea"}, status:{label:"Status",enabled:true,type:"status"} };
const DW = { kpis:true, bestClient:true, bestOrigin:true, remarketing:true, statusPie:true, revenueBar:true, leadsLine:true, financeSummary:true };
const EMP = { nome:"",numero:"",email:"",endereco:"",origem:"",valor:"",dataVeio:td(),dataServico:"",observacoes:"",status:"naoFechado" };

const exportCSV = (data,fields) => {
  const cols=Object.entries(fields).filter(([,f])=>f.enabled).map(([k])=>k);
  const hm={nome:"Nome",numero:"WhatsApp",email:"Email",endereco:"Endere\u00e7o",origem:"Origem",valor:"Valor",dataVeio:"Data Contato",dataServico:"Data Servi\u00e7o",observacoes:"Obs",status:"Status"};
  const h=cols.map(c=>hm[c]||c).join(",")+"\n";
  const r=data.map(c=>cols.map(col=>{const dk=col==="dataVeio"?"data_veio":col==="dataServico"?"data_servico":col;let v=c[dk]||"";if(col==="valor")v=fBRL(v);if(col==="status")v=SM[v]?.label||v;if(col==="dataVeio"||col==="dataServico")v=fDate(v);return `"${String(v).replace(/"/g,'""')}"`;}).join(",")).join("\n");
  const blob=new Blob(["\uFEFF"+h+r],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`clientes_${td()}.csv`;a.click();URL.revokeObjectURL(url);
};

function AuthScreen(){
  const[isLogin,setIsLogin]=useState(true);const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[loading,setLoading]=useState(false);const[error,setError]=useState("");
  const go=async()=>{setLoading(true);setError("");try{if(isLogin){const{error}=await supabase.auth.signInWithPassword({email,password:pass});if(error)throw error}else{const{error}=await supabase.auth.signUp({email,password:pass});if(error)throw error;setError("Conta criada! Fa\u00e7a login.");setIsLogin(true)}}catch(e){setError(e.message||"Erro.")}finally{setLoading(false)}};
  return(<div style={{backgroundColor:T.bg,color:T.text,fontFamily:"system-ui,sans-serif"}} className="min-h-screen flex items-center justify-center p-4"><div className="w-full max-w-sm"><div className="text-center mb-8"><div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background:`linear-gradient(135deg,${T.P},${T.V})`}}><BarChart3 size={28} color="white"/></div><h1 className="text-2xl font-bold">LavCri CRM</h1><p className="text-sm mt-1" style={{color:T.text2}}>{isLogin?"Acesse sua conta":"Criar conta"}</p></div>
  <div className="rounded-2xl p-5" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="space-y-3"><div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" className={ic} style={is} onKeyDown={e=>e.key==="Enter"&&go()}/></div><div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Senha</label><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Mínimo 6 caracteres" className={ic} style={is} onKeyDown={e=>e.key==="Enter"&&go()}/></div></div>
  {error&&<p className="text-xs mt-3" style={{color:error.includes("Conta")?T.G:T.R}}>{error}</p>}
  <button onClick={go} disabled={loading} className={`w-full mt-4 ${bp} flex items-center justify-center gap-2`} style={{background:`linear-gradient(135deg,${T.P},${T.P}cc)`,opacity:loading?.6:1}}>{loading&&<Loader2 size={15} className="animate-spin"/>}{isLogin?"Entrar":"Criar Conta"}</button>
  <p className="text-center text-xs mt-4" style={{color:T.text2}}>{isLogin?"N\u00e3o tem conta? ":"Já tem conta? "}<button onClick={()=>{setIsLogin(!isLogin);setError("")}} className="font-bold" style={{color:T.P}}>{isLogin?"Criar conta":"Fazer login"}</button></p></div></div></div>);
}

export default function App(){
  const[session,setSession]=useState(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setLoading(false)});const{data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>setSession(s));return()=>subscription.unsubscribe()},[]);
  if(loading) return <div style={{backgroundColor:T.bg}} className="min-h-screen flex items-center justify-center"><Loader2 size={28} className="animate-spin" style={{color:T.P}}/></div>;
  if(!session) return <AuthScreen/>;
  return <CRMApp session={session}/>;
}

function CRMApp({session}){
  const[tab,setTab]=useState("dash");const[clients,setClients]=useState([]);const[origins,setOrigins]=useState([]);const[transactions,setTransactions]=useState([]);
  const[fields,setFields]=useState({...DF});const[widgets,setWidgets]=useState({...DW});const[form,setForm]=useState({...EMP});
  const[editId,setEditId]=useState(null);const[showForm,setShowForm]=useState(false);const[fPer,setFPer]=useState("mes");const[fSt,setFSt]=useState("todos");
  const[srch,setSrch]=useState("");const[dateFrom,setDateFrom]=useState(som());const[dateTo,setDateTo]=useState(td());const[dbLoading,setDbLoading]=useState(true);
  const[txForm,setTxForm]=useState({tipo:"receita",descricao:"",valor:"",data:td(),client_id:""});const[showTxForm,setShowTxForm]=useState(false);
  const[settingsSaved,setSettingsSaved]=useState(false);const[newOr,setNewOr]=useState("");const[remarkDays,setRemarkDays]=useState(30);

  const fetchC=useCallback(async()=>{const{data}=await supabase.from("clients").select("*").order("created_at",{ascending:false});if(data)setClients(data)},[]);
  const fetchO=useCallback(async()=>{const{data}=await supabase.from("origins").select("*").order("id");if(data)setOrigins(data)},[]);
  const fetchT=useCallback(async()=>{const{data}=await supabase.from("transactions").select("*").order("data",{ascending:false});if(data)setTransactions(data)},[]);
  const fetchS=useCallback(async()=>{const{data}=await supabase.from("profiles").select("settings").eq("id",session.user.id).single();if(data?.settings){if(data.settings.fields)setFields(p=>{const m={...p};Object.entries(data.settings.fields).forEach(([k,v])=>{if(m[k])m[k]={...m[k],enabled:v}});return m});if(data.settings.widgets)setWidgets(p=>({...p,...data.settings.widgets}));if(data.settings.remarkDays)setRemarkDays(data.settings.remarkDays)}},[session]);

  useEffect(()=>{Promise.all([fetchC(),fetchO(),fetchT(),fetchS()]).then(()=>setDbLoading(false))},[fetchC,fetchO,fetchT,fetchS]);
  const oNames=useMemo(()=>origins.map(o=>o.name),[origins]);
  useEffect(()=>{if(oNames.length>0&&!form.origem)setForm(f=>({...f,origem:oNames[0]}))},[oNames]);

  const gdr=()=>{if(fPer==="hoje")return[td(),td()];if(fPer==="semana")return[sow(),td()];if(fPer==="mes")return[som(),td()];if(fPer==="tudo")return["",""];return[dateFrom,dateTo]};
  const filtered=useMemo(()=>{const[fr,to]=gdr();return clients.filter(c=>{if(fr&&c.data_veio<fr)return false;if(to&&c.data_veio>to)return false;if(fSt!=="todos"&&c.status!==fSt)return false;if(srch){const s=srch.toLowerCase();if(!c.nome?.toLowerCase().includes(s)&&!c.numero?.includes(s)&&!c.email?.toLowerCase().includes(s))return false}return true})},[clients,fPer,fSt,srch,dateFrom,dateTo]);

  const kpis=useMemo(()=>{const t=filtered.length,fc=filtered.filter(c=>c.status==="fechado"),ea=filtered.filter(c=>c.status==="andamento"),nf=filtered.filter(c=>c.status==="naoFechado");const rec=fc.reduce((s,c)=>s+Number(c.valor||0),0);return{t,fc:fc.length,nf:nf.length,ea:ea.length,pct:t>0?((fc.length/t)*100).toFixed(1):"0",rec,tk:fc.length>0?rec/fc.length:0}},[filtered]);
  const bestClient=useMemo(()=>{const tot={};clients.filter(c=>c.status==="fechado").forEach(c=>{tot[c.nome]=(tot[c.nome]||0)+Number(c.valor||0)});let b="-",mx=0;Object.entries(tot).forEach(([n,v])=>{if(v>mx){b=n;mx=v}});return{name:b,total:mx}},[clients]);
  const bestOrigin=useMemo(()=>{const m={};filtered.filter(c=>c.status==="fechado").forEach(c=>{m[c.origem]=(m[c.origem]||0)+Number(c.valor||0)});let b="-",mx=0;Object.entries(m).forEach(([k,v])=>{if(v>mx){b=k;mx=v}});return{name:b,total:mx}},[filtered]);
  const remarketingList=useMemo(()=>{const today=td();return clients.filter(c=>{if(c.status!=="fechado")return false;const ref=c.data_servico||c.data_veio;if(!ref)return false;return daysBetween(ref,today)>=remarkDays}).slice(0,5)},[clients,remarkDays]);
  const finKpis=useMemo(()=>{const[fr,to]=gdr();const ml=transactions.filter(tx=>{if(!fr&&!to)return true;return(!fr||tx.data>=fr)&&(!to||tx.data<=to)});const r=ml.filter(tx=>tx.tipo==="receita").reduce((s,tx)=>s+Number(tx.valor),0);const c=ml.filter(tx=>tx.tipo==="custo").reduce((s,tx)=>s+Number(tx.valor),0);return{receitas:r,custos:c,resultado:r-c,txList:ml}},[transactions,fPer,dateFrom,dateTo]);
  const barD=useMemo(()=>{const m={};filtered.filter(c=>c.status==="fechado").forEach(c=>{m[c.origem]=(m[c.origem]||0)+Number(c.valor||0)});return Object.entries(m).map(([name,value])=>({name,value}))},[filtered]);
  const lineD=useMemo(()=>{const m={};filtered.forEach(c=>{const d=fDate(c.data_veio);m[d]=(m[d]||0)+1});return Object.entries(m).sort((a,b)=>{const[da,ma,ya]=a[0].split("/"),[db,mb,yb]=b[0].split("/");return new Date(`${ya}-${ma}-${da}`)-new Date(`${yb}-${mb}-${db}`)}).map(([date,leads])=>({date,leads}))},[filtered]);
  const pieD=useMemo(()=>[{name:"Fechados",value:kpis.fc,color:T.G},{name:"Andamento",value:kpis.ea,color:T.Y},{name:"N\u00e3o Fechados",value:kpis.nf,color:T.R}].filter(d=>d.value>0),[kpis]);

  // CRUD
  // CRUD
  const submitClient = async () => {
    if (!form.nome.trim()) {
      alert("Digite o nome do cliente.");
      return;
    }

    const val =
      typeof form.valor === "string"
        ? parseFloat(form.valor.replace(",", "."))
        : Number(form.valor || 0);

    const rec = {
      nome: form.nome.trim(),
      numero: form.numero || "",
      email: form.email || "",
      endereco: form.endereco || "",
      origem: form.origem || oNames[0] || "",
      valor: isNaN(val) ? 0 : val,
      data_veio: form.dataVeio || td(),
      data_servico: form.dataServico || null,
      observacoes: form.observacoes || "",
      status: form.status || "naoFechado",
      user_id: session.user.id,
    };

    let error = null;

    if (editId !== null) {
      const result = await supabase
        .from("clients")
        .update(rec)
        .eq("id", editId);

      error = result.error;
    } else {
      const result = await supabase
        .from("clients")
        .insert(rec);

      error = result.error;
    }

    if (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar cliente: " + error.message);
      return;
    }

    setForm({ ...EMP, origem: oNames[0] || "" });
    setEditId(null);
    setShowForm(false);
    await fetchC();
  };

  const editClient = (c) => {
    setForm({
      nome: c.nome,
      numero: c.numero || "",
      email: c.email || "",
      endereco: c.endereco || "",
      origem: c.origem,
      valor: c.valor,
      dataVeio: c.data_veio,
      dataServico: c.data_servico || "",
      observacoes: c.observacoes || "",
      status: c.status,
    });
    setEditId(c.id);
    setShowForm(true);
    setTab("clientes");
  };

  const delClient = async (id) => {
    const ok = window.confirm("Deseja excluir este cliente?");
    if (!ok) return;

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Erro ao excluir cliente: " + error.message);
      return;
    }

    await fetchC();
  };

  const cycleStatus = async (id) => {
    const order = ["naoFechado", "andamento", "fechado"];
    const c = clients.find((x) => x.id === id);
    if (!c) return;

    const nextStatus = order[(order.indexOf(c.status) + 1) % order.length];

    const { error } = await supabase
      .from("clients")
      .update({ status: nextStatus })
      .eq("id", id);

    if (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status: " + error.message);
      return;
    }

    await fetchC();
  };

  const submitTx = async () => {
    if (!txForm.descricao.trim()) {
      alert("Digite a descrição da transação.");
      return;
    }

    if (!txForm.valor) {
      alert("Digite o valor da transação.");
      return;
    }

    const val = parseFloat(String(txForm.valor).replace(",", "."));
    if (isNaN(val)) {
      alert("Digite um valor válido.");
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .insert({
        tipo: txForm.tipo,
        descricao: txForm.descricao.trim(),
        valor: val,
        data: txForm.data,
        client_id: txForm.client_id ? Number(txForm.client_id) : null,
        user_id: session.user.id,
      });

    if (error) {
      console.error("Erro ao salvar transação:", error);
      alert("Erro ao salvar transação: " + error.message);
      return;
    }

    setTxForm({
      tipo: "receita",
      descricao: "",
      valor: "",
      data: td(),
      client_id: "",
    });
    setShowTxForm(false);
    await fetchT();
  };

  const delTx = async (id) => {
    const ok = window.confirm("Deseja excluir esta transação?");
    if (!ok) return;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir transação:", error);
      alert("Erro ao excluir transação: " + error.message);
      return;
    }

    await fetchT();
  };

  const addOr = async () => {
    const tr = newOr.trim();

    if (!tr) {
      alert("Digite o nome da origem.");
      return;
    }

    if (oNames.includes(tr)) {
      alert("Essa origem já existe.");
      return;
    }

    const { error } = await supabase
      .from("origins")
      .insert({
        name: tr,
        is_default: false,
        user_id: session.user.id,
      });

    if (error) {
      console.error("Erro ao adicionar origem:", error);
      alert("Erro ao adicionar origem: " + error.message);
      return;
    }

    setNewOr("");
    await fetchO();
  };

  const remOr = async (o) => {
    const origin = origins.find((x) => x.name === o.name && !x.is_default);
    if (!origin) return;

    const ok = window.confirm("Deseja remover esta origem?");
    if (!ok) return;

    const { error } = await supabase
      .from("origins")
      .delete()
      .eq("id", origin.id);

    if (error) {
      console.error("Erro ao remover origem:", error);
      alert("Erro ao remover origem: " + error.message);
      return;
    }

    await fetchO();
  };

  const saveSettings = async () => {
    const fs = {};

    Object.entries(fields).forEach(([k, v]) => {
      fs[k] = v.enabled;
    });

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: session.user.id,
        settings: {
          fields: fs,
          widgets,
          remarkDays,
        },
      });

    if (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("Erro ao salvar configurações: " + error.message);
      return;
    }

    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const toggleField = (k) => {
    if (k === "nome") return;
    setFields((p) => ({
      ...p,
      [k]: { ...p[k], enabled: !p[k].enabled },
    }));
  };

  const toggleWidget = (k) =>
    setWidgets((p) => ({
      ...p,
      [k]: !p[k],
    }));

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const perLabel =
    fPer === "hoje"
      ? "Hoje"
      : fPer === "semana"
      ? "Semana"
      : fPer === "mes"
      ? "Mês"
      : fPer === "tudo"
      ? "Tudo"
      : "Custom";

  const CTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div
        style={{
          backgroundColor: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: "8px 12px",
        }}
      >
        <p style={{ color: T.text2, fontSize: 10, marginBottom: 3 }}>
          {label}
        </p>

        {payload.map((p, i) => (
          <p
            key={i}
            style={{
              color: p.color || T.P,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {typeof p.value === "number" && p.value > 100
              ? fBRL(p.value)
              : p.value}
          </p>
        ))}
      </div>
    );
  };

  if (dbLoading)
    return (
      <div
        style={{ backgroundColor: T.bg }}
        className="min-h-screen flex items-center justify-center"
      >
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: T.P }}
        />
      </div>
    );

  // PERIOD BAR (JSX variable, not component)
  const periodBar=(<div className="rounded-2xl p-3 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}>
    <div className="flex items-center gap-1.5 flex-wrap">{[{v:"hoje",l:"Hoje"},{v:"semana",l:"Semana"},{v:"mes",l:"Mês"},{v:"tudo",l:"Tudo"},{v:"custom",l:"Período"}].map(p=><button key={p.v} onClick={()=>{setFPer(p.v);if(p.v==="mes"){setDateFrom(som());setDateTo(td())}else if(p.v==="semana"){setDateFrom(sow());setDateTo(td())}else if(p.v==="hoje"){setDateFrom(td());setDateTo(td())}}} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={fPer===p.v?{backgroundColor:T.P+"20",color:T.P}:{color:T.text2}}>{p.l}</button>)}</div>
    {fPer==="custom"&&<div className="flex gap-2 mt-2"><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className={`flex-1 ${ic} text-xs`} style={is}/><input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className={`flex-1 ${ic} text-xs`} style={is}/></div>}
  </div>);

  // FORM FIELD RENDERER (function returning JSX, not a component)
  const renderField=key=>{const f=fields[key];if(!f||!f.enabled)return null;const val=form[key]||"";
    if(key==="status") return <div key={key}><label className="block text-[11px] font-semibold mb-2 uppercase tracking-wider" style={{color:T.text2}}>Status</label><div className="flex flex-wrap gap-2">{Object.entries(SM).map(([k,s])=><button key={k} type="button" onClick={()=>setForm(p=>({...p,status:k}))} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl" style={form.status===k?{backgroundColor:s.color+"20",color:s.color,border:`2px solid ${s.color}`}:{backgroundColor:T.input,color:T.text2,border:`2px solid ${T.border}`}}><s.Icon size={14}/>{s.label}</button>)}</div></div>;
    if(key==="origem") return <div key={key}><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>{f.label}</label><div className="relative"><select value={form.origem||""} onChange={e=>setForm(p=>({...p,origem:e.target.value}))} className={`${ic} appearance-none pr-8`} style={is}>{oNames.map(o=><option key={o} value={o}>{o}</option>)}</select><ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:T.text2}}/></div></div>;
    if(f.type==="textarea") return <div key={key}><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>{f.label}</label><textarea value={val} onChange={e=>{const v=e.target.value;setForm(p=>({...p,[key]:v}))}} rows={3} className={ic} style={is} placeholder={f.label+"..."}/></div>;
    return <div key={key}><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>{f.label}</label><input type={f.type==="phone"?"text":f.type==="number"?"number":f.type} value={val} onChange={e=>{const v=f.type==="phone"?maskPhone(e.target.value):e.target.value;setForm(p=>({...p,[key]:v}))}} placeholder={f.type==="phone"?"(00) 00000-0000":f.type==="number"?"0,00":f.label+"..."} maxLength={f.type==="phone"?15:undefined} step={f.type==="number"?"0.01":undefined} min={f.type==="number"?"0":undefined} className={ic} style={is}/>{f.type==="phone"&&<p className="text-[10px] mt-0.5" style={{color:T.text2+"80"}}>{val.replace(/\D/g,"").length}/11</p>}</div>;
  };

  // ===================== CONTENT BY TAB =====================
  let content=null;

  // === DASHBOARD ===
  if(tab==="dash") content=<div>{periodBar}
    {widgets.kpis&&<div className="grid grid-cols-2 gap-3 mb-4">{[{icon:Users,label:"Total",value:kpis.t,color:T.P},{icon:CheckCircle2,label:"Fechados",value:`${kpis.fc} (${kpis.pct}%)`,color:T.G},{icon:DollarSign,label:"Receita",value:fBRL(kpis.rec),color:T.G},{icon:TrendingUp,label:"Ticket Médio",value:fBRL(kpis.tk),color:T.V}].map((k,i)=><div key={i} className="rounded-2xl p-4 flex items-center gap-3" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="rounded-xl p-2.5 shrink-0" style={{background:k.color+"15"}}><k.icon size={18} style={{color:k.color}}/></div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-widest" style={{color:T.text2}}>{k.label}</p><p className="text-base font-extrabold truncate leading-tight mt-0.5">{k.value}</p></div></div>)}</div>}
    <div className="grid grid-cols-2 gap-3 mb-4">
      {widgets.bestClient&&<div className="rounded-2xl p-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="flex items-center gap-2 mb-2"><Crown size={14} style={{color:T.Y}}/><span className="text-[10px] font-bold uppercase tracking-widest" style={{color:T.text2}}>Melhor Cliente</span></div><p className="text-sm font-bold truncate">{bestClient.name}</p>{bestClient.total>0&&<p className="text-xs font-semibold mt-0.5" style={{color:T.G}}>{fBRL(bestClient.total)}</p>}</div>}
      {widgets.bestOrigin&&<div className="rounded-2xl p-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="flex items-center gap-2 mb-2"><Star size={14} style={{color:T.O}}/><span className="text-[10px] font-bold uppercase tracking-widest" style={{color:T.text2}}>Melhor Origem</span></div><p className="text-sm font-bold truncate">{bestOrigin.name}</p>{bestOrigin.total>0&&<p className="text-xs font-semibold mt-0.5" style={{color:T.G}}>{fBRL(bestOrigin.total)}</p>}</div>}
    </div>
    {widgets.remarketing&&remarketingList.length>0&&<div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.O}30`}}><div className="flex items-center gap-2 mb-3"><Megaphone size={15} style={{color:T.O}}/><span className="text-xs font-bold" style={{color:T.O}}>Remarketing</span></div><p className="text-[10px] mb-2" style={{color:T.text2}}>Clientes fechados há +{remarkDays} dias</p><div className="space-y-1.5">{remarketingList.map(c=><div key={c.id} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}><div className="min-w-0 flex-1"><p className="text-xs font-semibold truncate">{c.nome}</p><p className="text-[10px]" style={{color:T.text2}}>{c.numero||"Sem número"} \u00b7 {fDate(c.data_servico||c.data_veio)}</p></div><span className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2" style={{backgroundColor:T.O+"15",color:T.O}}>{daysBetween(c.data_servico||c.data_veio,td())}d</span></div>)}</div></div>}
    {widgets.statusPie&&pieD.length>0&&<div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:T.text2}}>Status</h3><div className="flex items-center gap-4"><div style={{width:90,height:90}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieD} cx="50%" cy="50%" innerRadius={26} outerRadius={42} dataKey="value" stroke="none">{pieD.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart></ResponsiveContainer></div><div className="flex-1 space-y-1.5">{pieD.map((d,i)=><div key={i} className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:d.color}}/><span className="text-xs">{d.name}</span></div><span className="text-xs font-bold">{d.value}</span></div>)}</div></div></div>}
    {widgets.revenueBar&&barD.length>0&&<div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:T.text2}}>Receita por Origem</h3><ResponsiveContainer width="100%" height={160}><BarChart data={barD} margin={{top:5,right:5,left:-15,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="name" tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false} tickFormatter={v=>`R$${(v/1000).toFixed(0)}k`}/><Tooltip content={<CTooltip/>}/><Bar dataKey="value" radius={[6,6,0,0]} maxBarSize={36}>{barD.map((_,i)=><Cell key={i} fill={i%2===0?T.P:T.G}/>)}</Bar></BarChart></ResponsiveContainer></div>}
    {widgets.leadsLine&&lineD.length>0&&<div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:T.text2}}>Leads por Dia</h3><ResponsiveContainer width="100%" height={140}><LineChart data={lineD} margin={{top:5,right:5,left:-15,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="date" tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false} allowDecimals={false}/><Tooltip content={<CTooltip/>}/><Line type="monotone" dataKey="leads" stroke={T.P} strokeWidth={2.5} dot={{fill:T.P,r:3,strokeWidth:2,stroke:T.card}} activeDot={{r:5,fill:T.G}}/></LineChart></ResponsiveContainer></div>}
    {widgets.financeSummary&&<div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:T.text2}}>Financeiro - {perLabel}</h3><div className="space-y-2"><div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.G+"10"}}><div className="flex items-center gap-2"><ArrowUpCircle size={15} style={{color:T.G}}/><span className="text-sm">Receitas</span></div><span className="text-sm font-bold" style={{color:T.G}}>{fBRL(finKpis.receitas)}</span></div><div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.R+"10"}}><div className="flex items-center gap-2"><ArrowDownCircle size={15} style={{color:T.R}}/><span className="text-sm">Custos</span></div><span className="text-sm font-bold" style={{color:T.R}}>{fBRL(finKpis.custos)}</span></div><div className="flex items-center justify-between py-2 px-3 rounded-xl font-bold" style={{backgroundColor:T.border+"40"}}><span className="text-sm">Resultado</span><span className="text-sm" style={{color:finKpis.resultado>=0?T.G:T.R}}>{fBRL(finKpis.resultado)}</span></div></div></div>}
  </div>;

  // === CLIENTES ===
  if(tab==="clientes"){
    if(showForm) content=<div className="pb-4"><div className="flex items-center gap-3 mb-4"><button onClick={()=>{setShowForm(false);setEditId(null);setForm({...EMP,origem:oNames[0]||""})}} className="p-2 rounded-xl" style={{color:T.text2}}><ChevronLeft size={20}/></button><h2 className="text-base font-bold">{editId?"Editar":"Novo"} Cliente</h2></div>
      <div className="rounded-2xl p-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="space-y-3">{Object.keys(fields).map(k=>renderField(k))}</div><div className="flex gap-2 mt-5 pt-4" style={{borderTop:`1px solid ${T.border}`}}><button onClick={submitClient} className={`flex-1 ${bp}`} style={{background:`linear-gradient(135deg,${T.P},${T.P}cc)`}}>{editId?"Atualizar":"Cadastrar"}</button>{editId&&<button onClick={()=>{setEditId(null);setForm({...EMP,origem:oNames[0]||""});setShowForm(false)}} className="px-4 py-2.5 rounded-xl text-sm" style={{color:T.text2}}>Cancelar</button>}</div></div></div>;
    else content=<div>{periodBar}
      <div className="flex gap-2 mb-3"><div className="relative flex-1"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:T.text2}}/><input type="text" value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar..." className={`${ic} pl-9 text-xs`} style={is}/></div><button onClick={()=>exportCSV(filtered,fields)} className="p-2.5 rounded-xl active:scale-95" style={{backgroundColor:T.G+"15",color:T.G}}><Download size={16}/></button><button onClick={()=>{setEditId(null);setForm({...EMP,origem:oNames[0]||""});setShowForm(true)}} className="p-2.5 rounded-xl active:scale-95" style={{background:`linear-gradient(135deg,${T.P},${T.P}cc)`}}><Plus size={16} color="white"/></button></div>
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">{[{v:"todos",l:"Todos"},{v:"fechado",l:"Fechados"},{v:"andamento",l:"Andamento"},{v:"naoFechado",l:"N\u00e3o Fechados"}].map(s=><button key={s.v} onClick={()=>setFSt(s.v)} className="px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0" style={fSt===s.v?{backgroundColor:T.P+"20",color:T.P}:{color:T.text2,backgroundColor:T.card}}>{s.l}</button>)}</div>
      <p className="text-[10px] font-semibold mb-2 px-1" style={{color:T.text2}}>{filtered.length} cliente(s)</p>
      <div className="space-y-2">{filtered.length===0?<div className="rounded-2xl p-8 text-center" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><p className="text-sm" style={{color:T.text2}}>Nenhum cliente.</p></div>:filtered.map(c=><div key={c.id} className="rounded-2xl p-3" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="flex items-start justify-between gap-2"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><p className="text-sm font-bold truncate">{c.nome}</p><button onClick={()=>cycleStatus(c.id)} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full active:scale-95 shrink-0" style={{backgroundColor:(SM[c.status]?.color||T.R)+"18",color:SM[c.status]?.color||T.R}}>{SM[c.status]?.label||"?"}</button></div><div className="flex items-center gap-3 flex-wrap">{c.numero&&<p className="text-[11px] flex items-center gap-1" style={{color:T.text2}}><Phone size={10}/>{c.numero}</p>}{c.valor>0&&<p className="text-[11px] font-bold" style={{color:T.G}}>{fBRL(c.valor)}</p>}{c.origem&&<span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{backgroundColor:T.P+"12",color:T.P}}>{c.origem}</span>}<p className="text-[10px]" style={{color:T.text2}}>{fDate(c.data_veio)}</p></div></div><div className="flex items-center gap-0.5 shrink-0"><button onClick={()=>editClient(c)} className="p-1.5 rounded-lg" style={{color:T.text2}}><Pencil size={13}/></button><button onClick={()=>delClient(c.id)} className="p-1.5 rounded-lg" style={{color:T.text2}}><Trash2 size={13}/></button></div></div></div>)}</div></div>;
  }

  // === FINANCEIRO ===
  if(tab==="financeiro"){
    if(showTxForm) content=<div className="pb-4"><div className="flex items-center gap-3 mb-4"><button onClick={()=>setShowTxForm(false)} className="p-2 rounded-xl" style={{color:T.text2}}><ChevronLeft size={20}/></button><h2 className="text-base font-bold">Nova Transa\u00e7\u00e3o</h2></div>
      <div className="rounded-2xl p-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="space-y-3">
        <div><label className="block text-[11px] font-semibold mb-2 uppercase tracking-wider" style={{color:T.text2}}>Tipo</label><div className="flex gap-2">{[{v:"receita",l:"Receita",c:T.G},{v:"custo",l:"Custo",c:T.R}].map(t=><button key={t.v} onClick={()=>setTxForm(p=>({...p,tipo:t.v}))} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold" style={txForm.tipo===t.v?{backgroundColor:t.c+"20",color:t.c,border:`2px solid ${t.c}`}:{backgroundColor:T.input,color:T.text2,border:`2px solid ${T.border}`}}>{t.v==="receita"?<ArrowUpCircle size={16}/>:<ArrowDownCircle size={16}/>}{t.l}</button>)}</div></div>
        <div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Descrição</label><input type="text" value={txForm.descricao} onChange={e=>setTxForm(p=>({...p,descricao:e.target.value}))} placeholder="Ex: Servi\u00e7o" className={ic} style={is}/></div>
        <div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Valor (R$)</label><input type="number" value={txForm.valor} onChange={e=>setTxForm(p=>({...p,valor:e.target.value}))} placeholder="0,00" min="0" step="0.01" className={ic} style={is}/></div>
        <div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Data</label><input type="date" value={txForm.data} onChange={e=>setTxForm(p=>({...p,data:e.target.value}))} className={ic} style={is}/></div>
      </div><button onClick={submitTx} className={`w-full mt-5 ${bp}`} style={{background:txForm.tipo==="receita"?`linear-gradient(135deg,${T.G},${T.G}cc)`:`linear-gradient(135deg,${T.R},${T.R}cc)`}}>Salvar {txForm.tipo==="receita"?"Receita":"Custo"}</button></div></div>;
    else content=<div>{periodBar}
      <div className="grid grid-cols-2 gap-3 mb-4"><div className="rounded-2xl p-4 flex items-center gap-3" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="rounded-xl p-2.5" style={{background:T.G+"15"}}><ArrowUpCircle size={18} style={{color:T.G}}/></div><div><p className="text-[10px] font-bold uppercase" style={{color:T.text2}}>Receitas</p><p className="text-base font-extrabold" style={{color:T.G}}>{fBRL(finKpis.receitas)}</p></div></div><div className="rounded-2xl p-4 flex items-center gap-3" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="rounded-xl p-2.5" style={{background:T.R+"15"}}><ArrowDownCircle size={18} style={{color:T.R}}/></div><div><p className="text-[10px] font-bold uppercase" style={{color:T.text2}}>Custos</p><p className="text-base font-extrabold" style={{color:T.R}}>{fBRL(finKpis.custos)}</p></div></div></div>
      <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><span className="text-sm font-bold">Resultado</span><span className="text-lg font-extrabold" style={{color:finKpis.resultado>=0?T.G:T.R}}>{fBRL(finKpis.resultado)}</span></div>
      <button onClick={()=>setShowTxForm(true)} className={`w-full mb-4 ${bp} flex items-center justify-center gap-2`} style={{background:`linear-gradient(135deg,${T.P},${T.V})`}}><Plus size={16}/>Nova Transa\u00e7ão</button>
      <p className="text-[10px] font-semibold mb-2 px-1" style={{color:T.text2}}>{finKpis.txList.length} transação(ões)</p>
      <div className="space-y-2">{finKpis.txList.length===0?<div className="rounded-2xl p-8 text-center" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><p className="text-sm" style={{color:T.text2}}>Nenhuma transa\u00e7\u00e3o.</p></div>:finKpis.txList.map(tx=><div key={tx.id} className="rounded-2xl p-3 flex items-center justify-between" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><div className="flex items-center gap-3"><div className="rounded-lg p-2" style={{backgroundColor:(tx.tipo==="receita"?T.G:T.R)+"12"}}>{tx.tipo==="receita"?<ArrowUpCircle size={16} style={{color:T.G}}/>:<ArrowDownCircle size={16} style={{color:T.R}}/>}</div><div><p className="text-sm font-semibold">{tx.descricao}</p><p className="text-[10px]" style={{color:T.text2}}>{fDate(tx.data)}</p></div></div><div className="flex items-center gap-2"><span className="text-sm font-bold" style={{color:tx.tipo==="receita"?T.G:T.R}}>{tx.tipo==="custo"?"- ":""}{fBRL(tx.valor)}</span><button onClick={()=>delTx(tx.id)} className="p-1 rounded-lg" style={{color:T.text2}}><Trash2 size={12}/></button></div></div>)}</div></div>;
  }

  // === CONFIG ===
  if(tab==="config"){
    const wl={kpis:"KPIs",bestClient:"Melhor Cliente",bestOrigin:"Melhor Origem",remarketing:"Remarketing",statusPie:"Gráfico Status",revenueBar:"Receita/Origem",leadsLine:"Leads/Dia",financeSummary:"Resumo Financeiro"};
    content=<div>
      <div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><h2 className="text-sm font-bold mb-1">Dashboard</h2><p className="text-[11px] mb-3" style={{color:T.text2}}>Widgets da tela inicial</p><div className="space-y-2">{Object.entries(wl).map(([k,label])=><div key={k} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}><span className="text-sm" style={{color:widgets[k]?T.text:T.text2+"70"}}>{label}</span><button onClick={()=>toggleWidget(k)} className="w-10 h-5 rounded-full relative" style={{backgroundColor:widgets[k]?T.P:T.border}}><div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all" style={{left:widgets[k]?20:2}}/></button></div>)}</div></div>
      <div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><h2 className="text-sm font-bold mb-1">Remarketing</h2><p className="text-[11px] mb-3" style={{color:T.text2}}>Dias para avisar</p><div className="flex items-center gap-3"><input type="number" value={remarkDays} onChange={e=>setRemarkDays(Number(e.target.value)||30)} min="7" max="365" className={`w-20 ${ic} text-center`} style={is}/><span className="text-sm" style={{color:T.text2}}>dias</span></div></div>
      <div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><h2 className="text-sm font-bold mb-1">Campos Cadastro</h2><p className="text-[11px] mb-3" style={{color:T.text2}}>Ative/desative</p><div className="space-y-2">{Object.entries(fields).map(([k,f])=><div key={k} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}><div className="flex items-center gap-2"><span className="text-sm" style={{color:f.enabled?T.text:T.text2+"70"}}>{f.label}</span>{k==="nome"&&<span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{backgroundColor:T.Y+"20",color:T.Y}}>Fixo</span>}</div><button onClick={()=>toggleField(k)} disabled={k==="nome"} className="w-10 h-5 rounded-full relative" style={{backgroundColor:f.enabled?T.P:T.border,opacity:k==="nome"?.5:1}}><div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all" style={{left:f.enabled?20:2}}/></button></div>)}</div></div>
      <div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.border}`}}><h2 className="text-sm font-bold mb-1">Origens</h2><div className="flex gap-2 mb-3 mt-3"><input type="text" value={newOr} onChange={e=>setNewOr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addOr()} placeholder="Nova origem..." className={`flex-1 ${ic} text-xs`} style={is}/><button onClick={addOr} className="px-3 py-2 rounded-xl text-white text-xs font-bold active:scale-95" style={{background:`linear-gradient(135deg,${T.P},${T.P}cc)`}}><Plus size={14}/></button></div><div className="space-y-1.5">{origins.map(o=><div key={o.id} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{backgroundColor:T.P}}/><span className="text-xs font-semibold">{o.name}</span></div>{o.is_default?<span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{backgroundColor:T.P+"15",color:T.P}}>Padr\u00e3o</span>:<button onClick={()=>remOr(o)} className="p-1 rounded-lg" style={{color:T.text2}}><Trash2 size={12}/></button>}</div>)}</div></div>
      <button onClick={saveSettings} className={`w-full mb-4 ${bp} flex items-center justify-center gap-2`} style={{background:settingsSaved?`linear-gradient(135deg,${T.G},${T.G}cc)`:`linear-gradient(135deg,${T.P},${T.P}cc)`}}>{settingsSaved?<><CheckCircle2 size={15}/>Salvo!</>:<><Save size={15}/>Salvar Tudo</>}</button>
      <div className="rounded-2xl p-4 mb-4" style={{backgroundColor:T.card,border:`1px solid ${T.V}30`}}><h3 className="text-xs font-bold mb-1" style={{color:T.V}}>LGPD</h3><p className="text-[11px] leading-relaxed" style={{color:T.text2}}>Sem dados sensíveis (CPF/RG). Cliente pode pedir exclus\u00e3o.</p></div>
      <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold" style={{color:T.R,backgroundColor:T.R+"10"}}><LogOut size={16}/>Sair</button>
      <p className="text-center text-[10px] mt-3 mb-6" style={{color:T.text2+"60"}}>{session.user.email}</p>
    </div>;
  }

  // === LAYOUT ===
  const nav=[{id:"dash",label:"Início",Icon:Home},{id:"clientes",label:"Clientes",Icon:Users},{id:"financeiro",label:"Financeiro",Icon:Wallet},{id:"config",label:"Config",Icon:Sliders}];
  return(<div style={{fontFamily:"system-ui,-apple-system,sans-serif",backgroundColor:T.bg,color:T.text}} className="flex flex-col h-screen overflow-hidden">
    <header className="px-4 py-3 flex items-center justify-between shrink-0" style={{backgroundColor:T.card,borderBottom:`1px solid ${T.border}`}}><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:`linear-gradient(135deg,${T.P},${T.V})`}}><BarChart3 size={16} color="white"/></div><h1 className="text-sm font-bold">LavCri CRM</h1></div><p className="text-[10px]" style={{color:T.text2}}>v2.1</p></header>
    <main className="flex-1 overflow-y-auto p-4 pb-20">{content}</main>
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 px-2" style={{backgroundColor:T.card,borderTop:`1px solid ${T.border}`,paddingBottom:"max(8px, env(safe-area-inset-bottom))"}}>{nav.map(n=><button key={n.id} onClick={()=>{setTab(n.id);setShowForm(false);setShowTxForm(false)}} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-w-[60px]" style={tab===n.id?{color:T.P}:{color:T.text2}}><n.Icon size={20} strokeWidth={tab===n.id?2.5:1.8}/><span className="text-[10px] font-semibold">{n.label}</span>{tab===n.id&&<div className="w-1 h-1 rounded-full" style={{backgroundColor:T.P}}/>}</button>)}</nav>
  </div>);
}
