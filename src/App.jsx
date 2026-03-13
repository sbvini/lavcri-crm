import { useState, useMemo, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, CheckCircle2, XCircle, DollarSign, TrendingUp, Star, Plus, Trash2, Pencil, ChevronDown, Search, Download, Clock, LogOut, Loader2, Wallet, ArrowUpCircle, ArrowDownCircle, Phone, Save, ChevronLeft, BarChart3, Sliders, Home, Crown, Megaphone } from "lucide-react";

const SUPABASE_URL = "https://lanzgjytslmbyytwvgdr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhbnpnanl0c2xtYnl5dHd2Z2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDY3NTYsImV4cCI6MjA4ODk4Mjc1Nn0.EaA8bwLsn0DrOx0c4OP7rL1FnidbOfwZtiMu1AoMc3Y";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const T={bg:"#0b0d11",card:"#14171f",card2:"#1a1e28",border:"#222738",text:"#e8eaf0",text2:"#7c819a",input:"#111420",P:"#27a8de",G:"#34d399",R:"#f87171",Y:"#fbbf24",V:"#a78bfa",O:"#fb923c"};
const cn="w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 placeholder:text-gray-600";
const cs={backgroundColor:T.input,border:"1px solid "+T.border,color:T.text};
const bb="px-5 py-2.5 rounded-xl text-white text-sm font-semibold active:scale-95";

const fBRL=v=>(v==null||isNaN(v))?"R$ 0,00":Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const fDate=d=>{if(!d)return"—";const p=d.split("-");return p.length===3?p[2]+"/"+p[1]+"/"+p[0]:d};
const td=()=>{const n=new Date();return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0")};
const sow=()=>{const n=new Date(),d=n.getDay(),x=n.getDate()-d+(d===0?-6:1),m=new Date(n);m.setDate(x);return m.getFullYear()+"-"+String(m.getMonth()+1).padStart(2,"0")+"-"+String(m.getDate()).padStart(2,"0")};
const som=()=>{const n=new Date();return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-01"};
const maskPhone=v=>{const d=v.replace(/\D/g,"").slice(0,11);if(d.length<=2)return d.length?"("+d:"";if(d.length<=7)return"("+d.slice(0,2)+") "+d.slice(2);return"("+d.slice(0,2)+") "+d.slice(2,7)+"-"+d.slice(7)};
const daysBetween=(a,b)=>Math.floor((new Date(b)-new Date(a))/86400000);

const SM={fechado:{l:"Fechado",c:T.G,I:CheckCircle2},andamento:{l:"Em Andamento",c:T.Y,I:Clock},naoFechado:{l:"Não Fechado",c:T.R,I:XCircle}};
const FIELDS={nome:{label:"Nome",on:true,type:"text"},numero:{label:"WhatsApp",on:true,type:"phone"},email:{label:"E-mail",on:false,type:"email"},endereco:{label:"Endereço",on:false,type:"text"},origem:{label:"Origem",on:true,type:"select"},valor:{label:"Valor (R$)",on:true,type:"number"},dataVeio:{label:"Data Contato",on:true,type:"date"},dataServico:{label:"Data Serviço",on:false,type:"date"},observacoes:{label:"Observações",on:false,type:"textarea"},status:{label:"Status",on:true,type:"status"}};
const DWID={kpis:true,bestClient:true,bestOrigin:true,remarketing:true,statusPie:true,revenueBar:true,leadsLine:true,financeSummary:true};
const EMP={nome:"",numero:"",email:"",endereco:"",origem:"",valor:"",dataVeio:td(),dataServico:"",observacoes:"",status:"naoFechado"};

const CTooltip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return <div style={{backgroundColor:T.card,border:"1px solid "+T.border,borderRadius:10,padding:"8px 12px"}}><p style={{color:T.text2,fontSize:10,marginBottom:3}}>{label}</p>{payload.map((p,i)=><p key={i} style={{color:p.color||T.P,fontSize:12,fontWeight:700}}>{typeof p.value==="number"&&p.value>100?fBRL(p.value):p.value}</p>)}</div>;
};

function AuthScreen(){
  const[il,setIl]=useState(true);
  const[em,setEm]=useState("");
  const[pw,setPw]=useState("");
  const[ld,setLd]=useState(false);
  const[er,setEr]=useState("");
  const go=async()=>{
    setLd(true);setEr("");
    try{
      if(il){const{error}=await supabase.auth.signInWithPassword({email:em,password:pw});if(error)throw error;}
      else{const{error}=await supabase.auth.signUp({email:em,password:pw});if(error)throw error;setEr("Conta criada! Faça login.");setIl(true);}
    }catch(e){setEr(e.message||"Erro.")}finally{setLd(false)}
  };
  return(
    <div style={{backgroundColor:T.bg,color:T.text,fontFamily:"system-ui,sans-serif"}} className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background:"linear-gradient(135deg,"+T.P+","+T.V+")"}}><BarChart3 size={28} color="white"/></div>
          <h1 className="text-2xl font-bold">LavCri CRM</h1>
          <p className="text-sm mt-1" style={{color:T.text2}}>{il?"Acesse sua conta":"Criar conta"}</p>
        </div>
        <div className="rounded-2xl p-5" style={{backgroundColor:T.card,border:"1px solid "+T.border}}>
          <div className="space-y-3">
            <div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>E-mail</label><input type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="seu@email.com" className={cn} style={cs} onKeyDown={e=>e.key==="Enter"&&go()}/></div>
            <div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Senha</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mínimo 6 caracteres" className={cn} style={cs} onKeyDown={e=>e.key==="Enter"&&go()}/></div>
          </div>
          {er&&<p className="text-xs mt-3" style={{color:er.includes("Conta")?T.G:T.R}}>{er}</p>}
          <button onClick={go} disabled={ld} className={"w-full mt-4 "+bb+" flex items-center justify-center gap-2"} style={{background:"linear-gradient(135deg,"+T.P+","+T.P+"cc)",opacity:ld?.6:1}}>{ld&&<Loader2 size={15} className="animate-spin"/>}{il?"Entrar":"Criar Conta"}</button>
          <p className="text-center text-xs mt-4" style={{color:T.text2}}>{il?"Não tem conta? ":"Já tem conta? "}<button onClick={()=>{setIl(!il);setEr("")}} className="font-bold" style={{color:T.P}}>{il?"Criar conta":"Fazer login"}</button></p>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const[session,setSession]=useState(null);
  const[ld,setLd]=useState(true);
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session:s}})=>{setSession(s);setLd(false)});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>setSession(s));
    return()=>subscription.unsubscribe();
  },[]);
  if(ld)return<div style={{backgroundColor:T.bg}} className="min-h-screen flex items-center justify-center"><Loader2 size={28} className="animate-spin" style={{color:T.P}}/></div>;
  if(!session)return<AuthScreen/>;
  return<CRMApp session={session}/>;
}

function CRMApp({session}){
  const uid=session.user.id;
  const[tab,setTab]=useState("dash");
  const[clients,setClients]=useState([]);
  const[origins,setOrigins]=useState([]);
  const[transactions,setTx]=useState([]);
  const[fields,setFields]=useState(JSON.parse(JSON.stringify(FIELDS)));
  const[wdg,setWdg]=useState({...DWID});
  const[form,setForm]=useState({...EMP});
  const[editId,setEditId]=useState(null);
  const[showForm,setShowForm]=useState(false);
  const[fPer,setFPer]=useState("mes");
  const[fSt,setFSt]=useState("todos");
  const[srch,setSrch]=useState("");
  const[dateFrom,setDateFrom]=useState(som());
  const[dateTo,setDateTo]=useState(td());
  const[dbLd,setDbLd]=useState(true);
  const[txF,setTxF]=useState({tipo:"receita",descricao:"",valor:"",data:td()});
  const[showTx,setShowTx]=useState(false);
  const[saved,setSaved]=useState(false);
  const[newOr,setNewOr]=useState("");
  const[rmDays,setRmDays]=useState(30);

  const fC=useCallback(async()=>{const{data}=await supabase.from("clients").select("*").order("created_at",{ascending:false});if(data)setClients(data)},[]);
  const fO=useCallback(async()=>{const{data}=await supabase.from("origins").select("*").order("id");if(data)setOrigins(data)},[]);
  const fT=useCallback(async()=>{const{data}=await supabase.from("transactions").select("*").order("data",{ascending:false});if(data)setTx(data)},[]);
  const fS=useCallback(async()=>{
    const{data}=await supabase.from("profiles").select("settings").eq("id",uid).single();
    if(data?.settings){
      if(data.settings.fields)setFields(p=>{const m=JSON.parse(JSON.stringify(p));Object.entries(data.settings.fields).forEach(([k,v])=>{if(m[k])m[k].on=v});return m});
      if(data.settings.wdg)setWdg(p=>({...p,...data.settings.wdg}));
      if(data.settings.rmDays)setRmDays(data.settings.rmDays);
    }
  },[uid]);
  useEffect(()=>{Promise.all([fC(),fO(),fT(),fS()]).then(()=>setDbLd(false))},[fC,fO,fT,fS]);
  const oNames=useMemo(()=>origins.map(o=>o.name),[origins]);
  useEffect(()=>{if(oNames.length>0&&!form.origem)setForm(p=>({...p,origem:oNames[0]}))},[oNames]);

  const gdr=()=>{if(fPer==="hoje")return[td(),td()];if(fPer==="semana")return[sow(),td()];if(fPer==="mes")return[som(),td()];if(fPer==="tudo")return["",""];return[dateFrom,dateTo]};
  const filtered=useMemo(()=>{const[fr,to]=gdr();return clients.filter(c=>{if(fr&&c.data_veio<fr)return false;if(to&&c.data_veio>to)return false;if(fSt!=="todos"&&c.status!==fSt)return false;if(srch){const s=srch.toLowerCase();if(!(c.nome||"").toLowerCase().includes(s)&&!(c.numero||"").includes(s))return false}return true})},[clients,fPer,fSt,srch,dateFrom,dateTo]);

  const kpis=useMemo(()=>{const fc=filtered.filter(c=>c.status==="fechado"),ea=filtered.filter(c=>c.status==="andamento"),nf=filtered.filter(c=>c.status==="naoFechado");const rec=fc.reduce((s,c)=>s+Number(c.valor||0),0);return{t:filtered.length,fc:fc.length,ea:ea.length,nf:nf.length,pct:filtered.length>0?((fc.length/filtered.length)*100).toFixed(1):"0",rec,tk:fc.length>0?rec/fc.length:0}},[filtered]);
  const bestClient=useMemo(()=>{const t={};clients.filter(c=>c.status==="fechado").forEach(c=>{t[c.nome]=(t[c.nome]||0)+Number(c.valor||0)});let b="—",m=0;Object.entries(t).forEach(([n,v])=>{if(v>m){b=n;m=v}});return{name:b,total:m}},[clients]);
  const bestOrigin=useMemo(()=>{const t={};filtered.filter(c=>c.status==="fechado").forEach(c=>{t[c.origem]=(t[c.origem]||0)+Number(c.valor||0)});let b="—",m=0;Object.entries(t).forEach(([k,v])=>{if(v>m){b=k;m=v}});return{name:b,total:m}},[filtered]);
  const rmList=useMemo(()=>{const today=td();return clients.filter(c=>{if(c.status!=="fechado")return false;const r=c.data_servico||c.data_veio;return r&&daysBetween(r,today)>=rmDays}).slice(0,5)},[clients,rmDays]);
  const finK=useMemo(()=>{const[fr,to]=gdr();const ml=transactions.filter(x=>{if(!fr&&!to)return true;return(!fr||x.data>=fr)&&(!to||x.data<=to)});const r=ml.filter(x=>x.tipo==="receita").reduce((s,x)=>s+Number(x.valor),0);const c=ml.filter(x=>x.tipo==="custo").reduce((s,x)=>s+Number(x.valor),0);return{rec:r,cus:c,res:r-c,list:ml}},[transactions,fPer,dateFrom,dateTo]);
  const barD=useMemo(()=>{const m={};filtered.filter(c=>c.status==="fechado").forEach(c=>{m[c.origem]=(m[c.origem]||0)+Number(c.valor||0)});return Object.entries(m).map(([name,value])=>({name,value}))},[filtered]);
  const lineD=useMemo(()=>{const m={};filtered.forEach(c=>{const d=fDate(c.data_veio);m[d]=(m[d]||0)+1});return Object.entries(m).sort((a,b)=>{const[da,ma,ya]=a[0].split("/"),[db,mb,yb]=b[0].split("/");return new Date(ya+"-"+ma+"-"+da)-new Date(yb+"-"+mb+"-"+db)}).map(([date,leads])=>({date,leads}))},[filtered]);
  const pieD=useMemo(()=>[{name:"Fechados",value:kpis.fc,color:T.G},{name:"Andamento",value:kpis.ea,color:T.Y},{name:"Não Fechados",value:kpis.nf,color:T.R}].filter(d=>d.value>0),[kpis]);
  const perLabel=fPer==="hoje"?"Hoje":fPer==="semana"?"Semana":fPer==="mes"?"Mês":fPer==="tudo"?"Tudo":"Custom";

  const submitClient=async()=>{
    if(!form.nome||!form.nome.trim()){alert("Preencha o nome");return}
    const val=typeof form.valor==="string"?parseFloat(form.valor.replace(",",".")):Number(form.valor||0);
    const rec={nome:form.nome.trim(),numero:form.numero||"",origem:form.origem||oNames[0]||"",valor:isNaN(val)?0:val,data_veio:form.dataVeio||td(),data_servico:form.dataServico||null,status:form.status||"naoFechado",user_id:uid};
    try{
      let r;
      if(editId!==null){r=await supabase.from("clients").update(rec).eq("id",editId);if(!r.error)setEditId(null)}
      else{r=await supabase.from("clients").insert(rec)}
      if(r.error)throw r.error;
      setForm({...EMP,origem:oNames[0]||""});setShowForm(false);fC();
    }catch(e){console.error(e);alert("Erro: "+(e.message||"Verifique o console"))}
  };
  const editClient=c=>{setForm({nome:c.nome,numero:c.numero||"",email:c.email||"",endereco:c.endereco||"",origem:c.origem,valor:String(c.valor||""),dataVeio:c.data_veio,dataServico:c.data_servico||"",observacoes:c.observacoes||"",status:c.status});setEditId(c.id);setShowForm(true);setTab("clientes")};
  const delClient=async id=>{await supabase.from("clients").delete().eq("id",id);fC()};
  const cycleStatus=async id=>{const o=["naoFechado","andamento","fechado"];const c=clients.find(x=>x.id===id);if(!c)return;await supabase.from("clients").update({status:o[(o.indexOf(c.status)+1)%3]}).eq("id",id);fC()};
  const submitTx=async()=>{
    if(!txF.descricao||!txF.descricao.trim()||!txF.valor)return;
    const val=parseFloat(String(txF.valor).replace(",","."));if(isNaN(val))return;
    try{const{error}=await supabase.from("transactions").insert({tipo:txF.tipo,descricao:txF.descricao.trim(),valor:val,data:txF.data,user_id:uid});if(error)throw error;setTxF({tipo:"receita",descricao:"",valor:"",data:td()});setShowTx(false);fT()}catch(e){alert("Erro: "+e.message)}
  };
  const delTx=async id=>{await supabase.from("transactions").delete().eq("id",id);fT()};
  const addOr=async()=>{const t=newOr.trim();if(t&&!oNames.includes(t)){await supabase.from("origins").insert({name:t,is_default:false,user_id:uid});setNewOr("");fO()}};
  const remOr=async o=>{const x=origins.find(i=>i.name===o.name&&!i.is_default);if(x){await supabase.from("origins").delete().eq("id",x.id);fO()}};
  const saveAll=async()=>{const fs={};Object.entries(fields).forEach(([k,v])=>{fs[k]=v.on});await supabase.from("profiles").update({settings:{fields:fs,wdg,rmDays}}).eq("id",uid);setSaved(true);setTimeout(()=>setSaved(false),2000)};

  if(dbLd)return<div style={{backgroundColor:T.bg}} className="min-h-screen flex items-center justify-center"><Loader2 size={28} className="animate-spin" style={{color:T.P}}/></div>;

  const pBar=<div className="rounded-2xl p-3 mb-4" style={{backgroundColor:T.card,border:"1px solid "+T.border}}><div className="flex items-center gap-1.5 flex-wrap">{[["hoje","Hoje"],["semana","Semana"],["mes","Mês"],["tudo","Tudo"],["custom","Período"]].map(([v,l])=><button key={v} onClick={()=>{setFPer(v);if(v==="mes"){setDateFrom(som());setDateTo(td())}else if(v==="semana"){setDateFrom(sow());setDateTo(td())}else if(v==="hoje"){setDateFrom(td());setDateTo(td())}}} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={fPer===v?{backgroundColor:T.P+"20",color:T.P}:{color:T.text2}}>{l}</button>)}</div>{fPer==="custom"&&<div className="flex gap-2 mt-2"><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className={cn+" flex-1 text-xs"} style={cs}/><input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className={cn+" flex-1 text-xs"} style={cs}/></div>}</div>;

  const renderField=key=>{const f=fields[key];if(!f||!f.on)return null;const val=form[key]||"";
    if(key==="status")return<div key={key}><label className="block text-[11px] font-semibold mb-2 uppercase tracking-wider" style={{color:T.text2}}>Status</label><div className="flex flex-wrap gap-2">{Object.entries(SM).map(([k,s])=><button key={k} type="button" onClick={()=>setForm(p=>({...p,status:k}))} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl" style={form.status===k?{backgroundColor:s.c+"20",color:s.c,border:"2px solid "+s.c}:{backgroundColor:T.input,color:T.text2,border:"2px solid "+T.border}}><s.I size={14}/>{s.l}</button>)}</div></div>;
    if(key==="origem")return<div key={key}><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>{f.label}</label><div className="relative"><select value={form.origem||""} onChange={e=>setForm(p=>({...p,origem:e.target.value}))} className={cn+" appearance-none pr-8"} style={cs}>{oNames.map(o=><option key={o} value={o}>{o}</option>)}</select><ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:T.text2}}/></div></div>;
    if(f.type==="textarea")return<div key={key}><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>{f.label}</label><textarea value={val} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} rows={3} className={cn} style={cs} placeholder={f.label+"..."}/></div>;
    return<div key={key}><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>{f.label}</label><input type={f.type==="phone"?"text":f.type==="number"?"number":f.type} value={val} onChange={e=>setForm(p=>({...p,[key]:f.type==="phone"?maskPhone(e.target.value):e.target.value}))} placeholder={f.type==="phone"?"(00) 00000-0000":f.type==="number"?"0,00":f.label+"..."} maxLength={f.type==="phone"?15:undefined} step={f.type==="number"?"0.01":undefined} className={cn} style={cs}/>{f.type==="phone"&&<p className="text-[10px] mt-0.5" style={{color:T.text2+"80"}}>{val.replace(/\D/g,"").length}/11</p>}</div>;
  };

  const Cd=({children,className,style})=><div className={"rounded-2xl "+(className||"")} style={{backgroundColor:T.card,border:"1px solid "+T.border,...(style||{})}}>{children}</div>;
  const Kp=({icon:I,label,value,color})=><Cd className="p-4 flex items-center gap-3"><div className="rounded-xl p-2.5 shrink-0" style={{background:color+"15"}}><I size={18} style={{color}}/></div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-widest" style={{color:T.text2}}>{label}</p><p className="text-base font-extrabold truncate leading-tight mt-0.5">{value}</p></div></Cd>;

  let content=null;

  if(tab==="dash"){content=<div>{pBar}
    {wdg.kpis&&<div className="grid grid-cols-2 gap-3 mb-4"><Kp icon={Users} label="Total" value={kpis.t} color={T.P}/><Kp icon={CheckCircle2} label="Fechados" value={kpis.fc+" ("+kpis.pct+"%)"} color={T.G}/><Kp icon={DollarSign} label="Receita" value={fBRL(kpis.rec)} color={T.G}/><Kp icon={TrendingUp} label={"Ticket Médio"} value={fBRL(kpis.tk)} color={T.V}/></div>}
    <div className="grid grid-cols-2 gap-3 mb-4">
      {wdg.bestClient&&<Cd className="p-4"><div className="flex items-center gap-2 mb-2"><Crown size={14} style={{color:T.Y}}/><span className="text-[10px] font-bold uppercase tracking-widest" style={{color:T.text2}}>Melhor Cliente</span></div><p className="text-sm font-bold truncate">{bestClient.name}</p>{bestClient.total>0&&<p className="text-xs font-semibold mt-0.5" style={{color:T.G}}>{fBRL(bestClient.total)}</p>}</Cd>}
      {wdg.bestOrigin&&<Cd className="p-4"><div className="flex items-center gap-2 mb-2"><Star size={14} style={{color:T.O}}/><span className="text-[10px] font-bold uppercase tracking-widest" style={{color:T.text2}}>Melhor Origem</span></div><p className="text-sm font-bold truncate">{bestOrigin.name}</p>{bestOrigin.total>0&&<p className="text-xs font-semibold mt-0.5" style={{color:T.G}}>{fBRL(bestOrigin.total)}</p>}</Cd>}
    </div>
    {wdg.remarketing&&rmList.length>0&&<Cd className="p-4 mb-4" style={{borderColor:T.O+"30"}}><div className="flex items-center gap-2 mb-3"><Megaphone size={15} style={{color:T.O}}/><span className="text-xs font-bold" style={{color:T.O}}>Remarketing</span></div><p className="text-[10px] mb-2" style={{color:T.text2}}>Clientes fechados há +{rmDays} dias</p><div className="space-y-1.5">{rmList.map(c=><div key={c.id} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}><div className="min-w-0 flex-1"><p className="text-xs font-semibold truncate">{c.nome}</p><p className="text-[10px]" style={{color:T.text2}}>{c.numero||"Sem número"}</p></div><span className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2" style={{backgroundColor:T.O+"15",color:T.O}}>{daysBetween(c.data_servico||c.data_veio,td())}d</span></div>)}</div></Cd>}
    {wdg.statusPie&&pieD.length>0&&<Cd className="p-4 mb-4"><h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:T.text2}}>Status</h3><div className="flex items-center gap-4"><div style={{width:90,height:90}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieD} cx="50%" cy="50%" innerRadius={26} outerRadius={42} dataKey="value" stroke="none">{pieD.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart></ResponsiveContainer></div><div className="flex-1 space-y-1.5">{pieD.map((d,i)=><div key={i} className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:d.color}}/><span className="text-xs">{d.name}</span></div><span className="text-xs font-bold">{d.value}</span></div>)}</div></div></Cd>}
    {wdg.revenueBar&&barD.length>0&&<Cd className="p-4 mb-4"><h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:T.text2}}>Receita por Origem</h3><ResponsiveContainer width="100%" height={160}><BarChart data={barD} margin={{top:5,right:5,left:-15,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="name" tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false} tickFormatter={v=>"R$"+(v/1000).toFixed(0)+"k"}/><Tooltip content={<CTooltip/>}/><Bar dataKey="value" radius={[6,6,0,0]} maxBarSize={36}>{barD.map((_,i)=><Cell key={i} fill={i%2===0?T.P:T.G}/>)}</Bar></BarChart></ResponsiveContainer></Cd>}
    {wdg.leadsLine&&lineD.length>0&&<Cd className="p-4 mb-4"><h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:T.text2}}>Leads por Dia</h3><ResponsiveContainer width="100%" height={140}><LineChart data={lineD} margin={{top:5,right:5,left:-15,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="date" tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:9,fill:T.text2}} axisLine={false} tickLine={false} allowDecimals={false}/><Tooltip content={<CTooltip/>}/><Line type="monotone" dataKey="leads" stroke={T.P} strokeWidth={2.5} dot={{fill:T.P,r:3,strokeWidth:2,stroke:T.card}} activeDot={{r:5,fill:T.G}}/></LineChart></ResponsiveContainer></Cd>}
    {wdg.financeSummary&&<Cd className="p-4 mb-4"><h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{color:T.text2}}>{"Financeiro — "+perLabel}</h3><div className="space-y-2"><div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.G+"10"}}><div className="flex items-center gap-2"><ArrowUpCircle size={15} style={{color:T.G}}/><span className="text-sm">Receitas</span></div><span className="text-sm font-bold" style={{color:T.G}}>{fBRL(finK.rec)}</span></div><div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.R+"10"}}><div className="flex items-center gap-2"><ArrowDownCircle size={15} style={{color:T.R}}/><span className="text-sm">Custos</span></div><span className="text-sm font-bold" style={{color:T.R}}>{fBRL(finK.cus)}</span></div><div className="flex items-center justify-between py-2 px-3 rounded-xl font-bold" style={{backgroundColor:T.border+"40"}}><span className="text-sm">Resultado</span><span className="text-sm" style={{color:finK.res>=0?T.G:T.R}}>{fBRL(finK.res)}</span></div></div></Cd>}
  </div>}

  if(tab==="clientes"){
    if(showForm){content=<div className="pb-4"><div className="flex items-center gap-3 mb-4"><button onClick={()=>{setShowForm(false);setEditId(null);setForm({...EMP,origem:oNames[0]||""})}} className="p-2 rounded-xl" style={{color:T.text2}}><ChevronLeft size={20}/></button><h2 className="text-base font-bold">{editId?"Editar":"Novo"} Cliente</h2></div><Cd className="p-4"><div className="space-y-3">{Object.keys(fields).map(k=>renderField(k))}</div><div className="flex gap-2 mt-5 pt-4" style={{borderTop:"1px solid "+T.border}}><button onClick={submitClient} className={"flex-1 "+bb} style={{background:"linear-gradient(135deg,"+T.P+","+T.P+"cc)"}}>{editId?"Atualizar":"Cadastrar"}</button>{editId&&<button onClick={()=>{setEditId(null);setForm({...EMP,origem:oNames[0]||""});setShowForm(false)}} className="px-4 py-2.5 rounded-xl text-sm" style={{color:T.text2}}>Cancelar</button>}</div></Cd></div>}
    else{content=<div>{pBar}<div className="flex gap-2 mb-3"><div className="relative flex-1"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:T.text2}}/><input type="text" value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar..." className={cn+" pl-9 text-xs"} style={cs}/></div><button onClick={()=>{const cols=Object.entries(fields).filter(([,f])=>f.on).map(([k])=>k);exportCSV(filtered,fields)}} className="p-2.5 rounded-xl active:scale-95" style={{backgroundColor:T.G+"15",color:T.G}}><Download size={16}/></button><button onClick={()=>{setEditId(null);setForm({...EMP,origem:oNames[0]||""});setShowForm(true)}} className="p-2.5 rounded-xl active:scale-95" style={{background:"linear-gradient(135deg,"+T.P+","+T.P+"cc)"}}><Plus size={16} color="white"/></button></div>
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">{[["todos","Todos"],["fechado","Fechados"],["andamento","Andamento"],["naoFechado","Não Fechados"]].map(([v,l])=><button key={v} onClick={()=>setFSt(v)} className="px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0" style={fSt===v?{backgroundColor:T.P+"20",color:T.P}:{color:T.text2,backgroundColor:T.card}}>{l}</button>)}</div>
      <p className="text-[10px] font-semibold mb-2 px-1" style={{color:T.text2}}>{filtered.length} cliente(s)</p>
      <div className="space-y-2">{filtered.length===0?<Cd className="p-8 text-center"><p className="text-sm" style={{color:T.text2}}>Nenhum cliente.</p></Cd>:filtered.map(c=><Cd key={c.id} className="p-3"><div className="flex items-start justify-between gap-2"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><p className="text-sm font-bold truncate">{c.nome}</p><button onClick={()=>cycleStatus(c.id)} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full active:scale-95 shrink-0" style={{backgroundColor:(SM[c.status]?.c||T.R)+"18",color:SM[c.status]?.c||T.R}}>{SM[c.status]?.l||"?"}</button></div><div className="flex items-center gap-3 flex-wrap">{c.numero&&<p className="text-[11px] flex items-center gap-1" style={{color:T.text2}}><Phone size={10}/>{c.numero}</p>}{Number(c.valor)>0&&<p className="text-[11px] font-bold" style={{color:T.G}}>{fBRL(c.valor)}</p>}{c.origem&&<span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{backgroundColor:T.P+"12",color:T.P}}>{c.origem}</span>}<p className="text-[10px]" style={{color:T.text2}}>{fDate(c.data_veio)}</p></div></div><div className="flex items-center gap-0.5 shrink-0"><button onClick={()=>editClient(c)} className="p-1.5 rounded-lg" style={{color:T.text2}}><Pencil size={13}/></button><button onClick={()=>delClient(c.id)} className="p-1.5 rounded-lg" style={{color:T.text2}}><Trash2 size={13}/></button></div></div></Cd>)}</div></div>}
  }

  if(tab==="financeiro"){
    if(showTx){content=<div className="pb-4"><div className="flex items-center gap-3 mb-4"><button onClick={()=>setShowTx(false)} className="p-2 rounded-xl" style={{color:T.text2}}><ChevronLeft size={20}/></button><h2 className="text-base font-bold">{"Nova Transação"}</h2></div><Cd className="p-4"><div className="space-y-3"><div><label className="block text-[11px] font-semibold mb-2 uppercase tracking-wider" style={{color:T.text2}}>Tipo</label><div className="flex gap-2">{[["receita","Receita",T.G],["custo","Custo",T.R]].map(([v,l,c])=><button key={v} onClick={()=>setTxF(p=>({...p,tipo:v}))} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold" style={txF.tipo===v?{backgroundColor:c+"20",color:c,border:"2px solid "+c}:{backgroundColor:T.input,color:T.text2,border:"2px solid "+T.border}}>{v==="receita"?<ArrowUpCircle size={16}/>:<ArrowDownCircle size={16}/>}{l}</button>)}</div></div>
        <div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>{"Descrição"}</label><input type="text" value={txF.descricao} onChange={e=>setTxF(p=>({...p,descricao:e.target.value}))} placeholder={"Ex: Serviço"} className={cn} style={cs}/></div>
        <div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Valor (R$)</label><input type="number" value={txF.valor} onChange={e=>setTxF(p=>({...p,valor:e.target.value}))} placeholder="0,00" min="0" step="0.01" className={cn} style={cs}/></div>
        <div><label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider" style={{color:T.text2}}>Data</label><input type="date" value={txF.data} onChange={e=>setTxF(p=>({...p,data:e.target.value}))} className={cn} style={cs}/></div>
      </div><button onClick={submitTx} className={"w-full mt-5 "+bb} style={{background:txF.tipo==="receita"?"linear-gradient(135deg,"+T.G+","+T.G+"cc)":"linear-gradient(135deg,"+T.R+","+T.R+"cc)"}}>{"Salvar "+(txF.tipo==="receita"?"Receita":"Custo")}</button></Cd></div>}
    else{content=<div>{pBar}<div className="grid grid-cols-2 gap-3 mb-4"><Kp icon={ArrowUpCircle} label="Receitas" value={fBRL(finK.rec)} color={T.G}/><Kp icon={ArrowDownCircle} label="Custos" value={fBRL(finK.cus)} color={T.R}/></div>
      <Cd className="p-4 mb-4"><div className="flex items-center justify-between"><span className="text-sm font-bold">Resultado</span><span className="text-lg font-extrabold" style={{color:finK.res>=0?T.G:T.R}}>{fBRL(finK.res)}</span></div></Cd>
      <button onClick={()=>setShowTx(true)} className={"w-full mb-4 "+bb+" flex items-center justify-center gap-2"} style={{background:"linear-gradient(135deg,"+T.P+","+T.V+")"}}><Plus size={16}/>{"Nova Transação"}</button>
      <p className="text-[10px] font-semibold mb-2 px-1" style={{color:T.text2}}>{finK.list.length}{" transação(ões)"}</p>
      <div className="space-y-2">{finK.list.length===0?<Cd className="p-8 text-center"><p className="text-sm" style={{color:T.text2}}>{"Nenhuma transação."}</p></Cd>:finK.list.map(x=><Cd key={x.id} className="p-3"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="rounded-lg p-2" style={{backgroundColor:(x.tipo==="receita"?T.G:T.R)+"12"}}>{x.tipo==="receita"?<ArrowUpCircle size={16} style={{color:T.G}}/>:<ArrowDownCircle size={16} style={{color:T.R}}/>}</div><div><p className="text-sm font-semibold">{x.descricao}</p><p className="text-[10px]" style={{color:T.text2}}>{fDate(x.data)}</p></div></div><div className="flex items-center gap-2"><span className="text-sm font-bold" style={{color:x.tipo==="receita"?T.G:T.R}}>{x.tipo==="custo"?"- ":""}{fBRL(x.valor)}</span><button onClick={()=>delTx(x.id)} className="p-1 rounded-lg" style={{color:T.text2}}><Trash2 size={12}/></button></div></div></Cd>)}</div></div>}
  }

  if(tab==="config"){
    const wLabels={kpis:"KPIs",bestClient:"Melhor Cliente",bestOrigin:"Melhor Origem",remarketing:"Remarketing",statusPie:"Status",revenueBar:"Receita/Origem",leadsLine:"Leads/Dia",financeSummary:"Financeiro"};
    content=<div>
      <Cd className="p-4 mb-4"><h2 className="text-sm font-bold mb-1">Dashboard</h2><p className="text-[11px] mb-3" style={{color:T.text2}}>Widgets da tela inicial</p><div className="space-y-2">{Object.entries(wLabels).map(([k,label])=><div key={k} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}><span className="text-sm" style={{color:wdg[k]?T.text:T.text2+"70"}}>{label}</span><button onClick={()=>setWdg(p=>({...p,[k]:!p[k]}))} className="w-10 h-5 rounded-full relative" style={{backgroundColor:wdg[k]?T.P:T.border}}><div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all" style={{left:wdg[k]?20:2}}/></button></div>)}</div></Cd>
      <Cd className="p-4 mb-4"><h2 className="text-sm font-bold mb-1">Remarketing</h2><p className="text-[11px] mb-3" style={{color:T.text2}}>{"Após quantos dias avisar?"}</p><div className="flex items-center gap-3"><input type="number" value={rmDays} onChange={e=>setRmDays(Number(e.target.value)||30)} min="7" max="365" className={cn+" w-20 text-center"} style={cs}/><span className="text-sm" style={{color:T.text2}}>dias</span></div></Cd>
      <Cd className="p-4 mb-4"><h2 className="text-sm font-bold mb-1">Campos do Cadastro</h2><p className="text-[11px] mb-3" style={{color:T.text2}}>Ative/desative campos</p><div className="space-y-2">{Object.entries(fields).map(([k,f])=><div key={k} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}><div className="flex items-center gap-2"><span className="text-sm" style={{color:f.on?T.text:T.text2+"70"}}>{f.label}</span>{k==="nome"&&<span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{backgroundColor:T.Y+"20",color:T.Y}}>Fixo</span>}</div><button onClick={()=>{if(k==="nome")return;setFields(p=>{const n=JSON.parse(JSON.stringify(p));n[k].on=!n[k].on;return n})}} disabled={k==="nome"} className="w-10 h-5 rounded-full relative" style={{backgroundColor:f.on?T.P:T.border,opacity:k==="nome"?.5:1}}><div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all" style={{left:f.on?20:2}}/></button></div>)}</div></Cd>
      <Cd className="p-4 mb-4"><h2 className="text-sm font-bold mb-1">Origens de Leads</h2><div className="flex gap-2 mb-3 mt-3"><input type="text" value={newOr} onChange={e=>setNewOr(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addOr()} placeholder="Nova origem..." className={cn+" flex-1 text-xs"} style={cs}/><button onClick={addOr} className="px-3 py-2 rounded-xl text-white text-xs font-bold active:scale-95" style={{background:"linear-gradient(135deg,"+T.P+","+T.P+"cc)"}}><Plus size={14}/></button></div><div className="space-y-1.5">{origins.map(o=><div key={o.id} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{backgroundColor:T.card2}}><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{backgroundColor:T.P}}/><span className="text-xs font-semibold">{o.name}</span></div>{o.is_default?<span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{backgroundColor:T.P+"15",color:T.P}}>{"Padrão"}</span>:<button onClick={()=>remOr(o)} className="p-1 rounded-lg" style={{color:T.text2}}><Trash2 size={12}/></button>}</div>)}</div></Cd>
      <button onClick={saveAll} className={"w-full mb-4 "+bb+" flex items-center justify-center gap-2"} style={{background:saved?"linear-gradient(135deg,"+T.G+","+T.G+"cc)":"linear-gradient(135deg,"+T.P+","+T.P+"cc)"}}>{saved?<><CheckCircle2 size={15}/>{"Salvo!"}</>:<><Save size={15}/>{"Salvar Tudo"}</>}</button>
      <Cd className="p-4 mb-4" style={{borderColor:T.V+"30"}}><h3 className="text-xs font-bold mb-1" style={{color:T.V}}>LGPD</h3><p className="text-[11px] leading-relaxed" style={{color:T.text2}}>{"Sem dados sensíveis (CPF/RG). Cliente pode pedir exclusão a qualquer momento."}</p></Cd>
      <button onClick={async()=>{await supabase.auth.signOut()}} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold" style={{color:T.R,backgroundColor:T.R+"10"}}><LogOut size={16}/>Sair</button>
      <p className="text-center text-[10px] mt-3 mb-6" style={{color:T.text2+"60"}}>{session.user.email}</p>
    </div>;
  }

  const nav=[["dash","Início",Home],["clientes","Clientes",Users],["financeiro","Financeiro",Wallet],["config","Config",Sliders]];
  return<div style={{fontFamily:"system-ui,-apple-system,sans-serif",backgroundColor:T.bg,color:T.text}} className="flex flex-col h-screen overflow-hidden">
    <header className="px-4 py-3 flex items-center justify-between shrink-0" style={{backgroundColor:T.card,borderBottom:"1px solid "+T.border}}><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg,"+T.P+","+T.V+")"}}><BarChart3 size={16} color="white"/></div><h1 className="text-sm font-bold">LavCri CRM</h1></div><p className="text-[10px]" style={{color:T.text2}}>v2.2</p></header>
    <main className="flex-1 overflow-y-auto p-4 pb-20">{content}</main>
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 px-2" style={{backgroundColor:T.card,borderTop:"1px solid "+T.border,paddingBottom:"max(8px, env(safe-area-inset-bottom))"}}>{nav.map(([id,label,Icon])=><button key={id} onClick={()=>{setTab(id);setShowForm(false);setShowTx(false)}} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-w-[60px]" style={tab===id?{color:T.P}:{color:T.text2}}><Icon size={20} strokeWidth={tab===id?2.5:1.8}/><span className="text-[10px] font-semibold">{label}</span>{tab===id&&<div className="w-1 h-1 rounded-full" style={{backgroundColor:T.P}}/>}</button>)}</nav>
  </div>;
}
