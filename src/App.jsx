import { useState, useMemo, useCallback, useEffect, createContext, useContext } from "react";
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
// CONFIGURE AQUI
// ====================================================
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA-ANON-KEY-AQUI";
// ====================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Logos por slug da empresa
const LOGOS = {
  lavcri: "data:image/png;base64,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8847LQ8//HBZdna2t7S09L6LLrrIM2LEiJ+63W4dDAbdGzZs2PmjH/3odwUFBe5f/OIXd/Tr1y/w3nvvLfrd735XfvrppyddeeWVt/bp08fPzLRp06bt995779Opqaktt956672madZdc801sx9//PGbg8Fg8nPPPffbOXPmNF977bUDzjvvvOt379796bPPPvv+rbfeenMgEKBQKKRjsZgG4J4zZ85fiGjlww8/fNPgwYN7Ll26dNmvfvWr50tKSgwism6++ebzp0yZUkREeV9++eXfbrzxxqfeeeedzZdccsl72dnZ/h07dnwCAEOHDiUi0tdff/306dOnn8fMvZcuXfqPX/7yl8/bhuljznPk4ChKSvaTx7N27dq21tZWPvnkk0cCwB/+8IfvMTM3NjaWA8DHH3+8gpn5X//61z8AyOXLl7cwMz/++OO/nz17dsD2aHFLSwszM7/00kv3PvLII48zM9fU1HBNTQ2//PLLj9x7771PNDU18Y4dOxJf4aeeeurvttj9cOK9v/3tb08lRP+EqgEgZcmSJeu3bNliffrpp42VlZVVI0aMSEk8VRNP1s8++2w1M/N1111X/Kc//Wk4M7Npmnz55ZcP/+Mf/zgrMabMzMweTz/99P9jZm5qamJm5jVr1vCUKVOuX7t2LTMz79y5k5ctW6aLi4sntLW17WJmDoVCzMz82muvPe/xePpt27aNmZn//Oc/Xztp0qT8cDjMzMy33HLLpc8///woZuZoNMq7du3iuXPnrgOA2bNnX2oH3PE777xTD8A9fvz43K1btzIz8/bt2xP/WwAg1TRN3rp1axWAzBUrVnAsFuPJkyePBICf/vSns5iZP/roo49GjBgxZcuWLbx7925ua2tjZubPPvssPHPmzNwbb7zx5NraWmZmXrVqVeu4ceN6EBGeeeaZq+rq6jhxbYsXL2YA/vvvv//7ifsxZ86cjQA8AHDffffd39rayvb6YHtdLM3Pz0+x78ExK8kIZ88fHbhcrtrW1lZLa23ZapcJwEpKSqoGYPh8vn4AYv379z9u2rRp0/v27esFEOvdu3ffRx991ABgrVq16tP8/PwzLMsyJ0yYMDEajcYAWG+++eab11577cy33377j59//vmN55xzTs6zzz77BIDYJ598suHqq6++EoB3+PDh07/44gusXLkSI0eOnEJEhpSyY5h9zO12x5qamjbV1dWtCQaD/iVLljR1NWIbhlEPwIpEIpG8vLyeACyXyxU788wzzznhhBMmADADgYB11llnDRJC1ACw7rjjjqJXX331r4MHD1bTpk27VGtdXV1dbf74xz++5a677rqwvLz8A8MwsHjx4m3Dhg27zDRNa9SoUWddfPHFZ/r9fgUgNnjw4LHTp0+/1Ov1xgBYZ599Nm3atMkEYC1atGjZrFmzrv7rX/86k4hw2mmnTTVNE3PmzImMGTMm+Sc/+cnwBQsWNAshops2bdp6yy23/DQUCsWys7PTAFAoFDI9Hk8tACai+paWlkT0LIQQUQCW1lovWbLk3RtvvLHXFVdccUFVVVVTS0uLLi8vv+zZZ5/dPXLkyPMzMjL03Llz24477rjAOeecM4mZ/aNHj37S7/fjrrvu+tWFF154/GuvvVYGIDpq1KipoVCI58+f3zJ69Oi+RUVFOVdfffXIq6+++qZQKBS+6aabLr/sssuGfPrpp59PnTr1pJtvvvnnRMTz5s2Tzo5y0EmC2bBhw47du3fzhAkTRsybN8946KGHpjIzx2KxhwFk1NXVRauqqnjjxo3qhRde2Lpjxw5uaWnhlStXLr3ooovyotForLa2tmXZsmWV9tP0/YceeujPCakmFovxyy+/PJeIcOGFFw7evn17Q2trK99yyy0XMzOVlJRMtSyLX3rppRcfe+yxF5RS6tZbb53cwaAsBg4cmLxw4cK5iafqXXfddVNpaenMmTNnpna0JSxduvQjZuYZM2acv2DBgju01rxp0yaeO3futs8//7xh8+bNrJTip556auLjjz9+LzPz6tWrV+zatauGmfmmm276a2VlZb3WmqPRKC9btowHDRp0kmVZG3ft2tX8+uuvv2qaJr/33ntzfv7zn18Vi8V4165dvHTp0sb//Oc/W7Zu3cpKKV6wYEHZvffeezIzczgcZsuy+JVXXvkUQHDTpk2RtWvXVk6fPr2Umfntt98uBeDesGFD1LIsTkgUDz744GsAAvX19Xr37t1fAshYsWJFU319PU+fPn0kMxs//elPf8DMvHDhwk8SUtybb775ti1Jvmo7ATzLli1bUlVVZZ566qnXtbW1qY8++ugfJ5544ln29W/qaH9KSUlJ27ZtW2TZsmWrLr/88t8xs37llVdueOSRR2Yws7V06dK/JhbRb3/72x9alqXee++9z46g/c2RYL7lTKMty+J58+Y1TZgwwSIiy87YNSdMmNAvOTnZ9eGHH25sampqmz59eu8lS5Zs2bRp09ZgMDgkJSWljxAiTESB5OTkwNKlSxc988wzNweDwajWmt977735s2fPvr2ysvJPzEzXX3/9n3v16pX6/PPPP3Tffff9nYh4yJAhP5BScq9evU7Mz88fLoSgESNG3AgApaWlgoj0Y4899uAZZ5wx+ZFHHnlz165dDVddddWvLr300mdcLtepXdYPa605HA4HDcM4o7m5Wb3zzjvLxo0bl9ezZ8+UuXPnLgXAHo/nDNM0lV0/9/iamhqUl5c/9sADD/zW5XIl1dXVWffdd9/sl19++WfhcHhrJBJBcnJy0rRp0y7+7LPPQpMmTfrBxIkTBwsh+NVXX93Qq1evpDFjxvR555131re0tKhAIDB+y5YtQa01r1+/ftn9999/+wcffHD7r3/96wv69u3rAZA9ffr0aQC4b9++lwBIc7lctG3btuqbbrrp+nXr1m29+uqrp86cOfMkwzBaO2xcrZTiV199tZ6ILCll2Fa3JBHxbbfddv3kyZPP+vzzz3dceumlVwFQRUVFA/r06XOKaZri+uuvv0IpJfr37z+WmYP19fVWenp62ogRI05lZpx44on9brvttkvy8vI8hmH0PP/886cCoH79+v3wvffeswBIr9d7KoA8AMjPz58opRRVVVVrj/V97Bh5j+Lc9+rVi1auXPkogG3vvvvuokQm99SpU081DIOqqqpez8jIGOb1eievXbv2LwMHDpyUl5fXp1evXn7DMIK7d+/eMHTo0CGw44BOP/30nwghaPjw4cnjxo3L3bFjx0dpaWk/mDx58qRIJIIBAwacsG7duhdffPHFnSeddNI4ANS/f/8sAGRZFp1wwgmTc3NzswzDqAGAQCAwjIjQu3dvr9Y6MGDAAPfy5cvrN2/evNJ+8jIAuN1uQwhBLpfLM3jw4NRIJCIXLlz49LXXXvu/QojGBQsW/L9rrrnmsZ49e47bvn37WiEEzZkz55pf/OIXfwfQ0rNnz8GGYRgpKSm46KKLejOzb9GiRbmBQMD98ccfh5qamraeffbZx919992FwWBwmBCCPvjgg/unTZv2+6ysrOT333//18XFxY+npqb2CwaDASEEZWdnZ1599dU9P/vss1O8Xu9EIkJSUpIoLCzsW1dXR/379x967bXXXuD1els9Hk/qddddd3JaWlqq2+12ezwe6XK5XG632wAgtNa+zMxMWrNmzSOmadY//vjjYSEE+Xy+2JgxY4ZcffXVv/d4PIhEIrx27dpH165dK6qqqvqkpaUhHA6HpkyZMiQWi7Xm5uZmXHPNNcmffvrp0+ecc86s559/fq7L5fps+fLlI4UQ1bYkQxMnTsxtbGzUBQUFpyilGv/zn/+8OXHixPNXrlz5MRFtGjp06LjVq1er+fPnP8DMVFxcfMwuckeC+eZdlwCAdevWNW7durUpOTl5olLq0qamJv+2bduali1bFvF6vdnbtm1rampqenX9+vX/WLduXdO77777TmVl5dbt27c3KaXy165du3vHjh11dodCd0lJiWhpadm+devWJiHE4Fgs9t8ff/zxr3v16nXz1q1bG7Zu3do4YMCAQrfbfVlKSspPlFKeN954Y2leXl6fvLy8nm+99da7brfbOu+8805SKt6I7YUXXnhg8eLFW8aMGVO4cePGj1555ZW/pqWluc4999zfdRTLN27c2LJ58+amaDQaqKysTP/yyy+r3nzzzQXvv//+zsWLFy9+4YUXXlm1alVTS0sLRSKRndu2bWvq27fvTiFECzMbPp8vvG7dut07d+5sSk1NvVQpdYPH48ldt25dQ2Nj45d/+MMfblu7dm3rkCFDfrdx48be69evb1q6dOmc1atXz/3oo492zJs374OVK1c2NDU1tWitjTVr1jSFQqE0pdQNDQ0N9zQ3N49atmzZ7ksvvfTMnj17Zj/33HOl1dXVTb179z59xYoVO5uamqK5ubnX1NfX6yeeeOLBv/3tb6u//PLL0Jo1a5oARHbu3Llx69atTR6P5yyl1GUArE2bNjVt3rx56/jx43/k9/v1hg0b6nr06JHh8XiuDAQC3/d6vaPXrl1bf8stt1zSo0ePrPvuu++WTZs2NWZmZl5w7rnnXl9RUfFsampqICkpaWJjY+OXXq8367PPPtt11llnjc7Nzc199913f9XQ0NA0efLkkZMmTbrwlVdeec7r9aanpaWd9uGHH86/7777pjz++OOfl5aW0iFGOTv4v4CUlJTU5OTkdAApAJIAePLy8tIB+IuKinwFBQXpti7vtj8HAG77M24AafZ3O+rfwv5/KoDsrKys4IUXXpiRnJyc3uFcyQAC9ud8He3Ow4cPT5s5c6Y3ocXZP7329wAAffr0Sbv22mszO15Lenp6cl5eXnpBQUFifEn2v5Lt7wNAelZWVhAAFRQUpNvVAzt6QIL2GJPt71NKSkpaTk5OwP5/9ve+972eY8eOzQKQbj8cvR3Oldq3b9/UDvOVBiA5OTk5fcyYMT3t43ayeRQUFATjv6ak2f9PTlxTcnJyekpKSqr9p9++rmQAwcT/Afivu+66YEpKSpp9jNTEcUaMGJFi/42Ox5w0aVIGc7xK4A033PDbBQsWNF1zzTWXjB8/PtW+LnSc69GjRyd3iBNK7XgvjpUYLAffEbPNEbADJY7bbRH7kpISQXvKc9K+AsSO9HgPwohJh3Ac2t/xEpv/MI99r5ZNN99884y//OUv1UuWLOHZs2f/3PZO7WuMneaemelQI8e/M4vWwcHPfdcG7x375nRszN4hOZMS79vvtdtButuM1KV27z7OxR3H002SHnUzlq7n7fiZjmVoaM+w9nyvw/Xsbz72+k6Xse/3XAe41o7X0bW2cXfXub+xdTu/Xe9hh2MSAF1QUBCcMWPGiWvWrIm8+OKLS7qb127e29c9cuDAgYP9SpKO2O3AgYPDt/eKiooEADhGWgcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhw4MCBAwcOHDhwcAj4/5V58jpcAqIsAAAAAElFTkSuQmCC",
  south: null, // SVG inline below
};

const SouthLogo = ({width}) => (
  <svg width={width || 130} viewBox="0 0 260 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="40" fontFamily="system-ui" fontWeight="800" fontSize="38" fill="#d4af37">SOUTH</text>
    <text x="148" y="40" fontFamily="system-ui" fontWeight="300" fontSize="38" fill="#f5f5f5">SOL</text>
    <text x="0" y="56" fontFamily="system-ui" fontWeight="400" fontSize="11" fill="#888" letterSpacing="4">SOLUÇÕES</text>
  </svg>
);

const DEFAULT_THEME = {
  P: "#27a8de", G: "#8fc61f", Y: "#f59e0b",
  BG: "#0f1117", CARD: "#1a1d27", BORDER: "#2a2e3d",
};

const ThemeContext = createContext(DEFAULT_THEME);
const useTheme = () => useContext(ThemeContext);

const TEXT = "#e2e4ea";
const TEXT2 = "#8b8fa3";
const INPUT_BG = "#181b24";
const R = "#ef4444";

const fBRL = (v) => (v == null || isNaN(v)) ? "R$ 0,00" : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fDate = (d) => { if (!d) return ""; const p = d.split("-"); return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d; };
const td = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; };
const sow = () => { const n = new Date(); const d = n.getDay(); const diff = n.getDate() - d + (d===0?-6:1); const m = new Date(n); m.setDate(diff); return `${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}-${String(m.getDate()).padStart(2,"0")}`; };
const som = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-01`; };

const STATUS_MAP = {
  fechado: { label: "Fechado", color: "#8fc61f", Icon: CheckCircle2 },
  andamento: { label: "Em Andamento", color: "#f59e0b", Icon: Clock },
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
// LOGO COMPONENT
// ============================
function CompanyLogo({ slug, width }) {
  if (slug === "south") return <SouthLogo width={width} />;
  const src = LOGOS[slug];
  if (src) return <img src={src} alt="Logo" style={{width: width || 130, height:"auto", objectFit:"contain"}} />;
  return <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>{slug}</span>;
}

// ============================
// AUTH SCREEN
// ============================
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
        setError("Conta criada! Faça login.");
        setIsLogin(true);
      }
    } catch (e) {
      setError(e.message || "Erro ao autenticar.");
    } finally { setLoading(false); }
  };

  const inp = "w-full rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all";
  const inpStyle = { backgroundColor: INPUT_BG, border: `1px solid #2a2e3d`, color: TEXT };

  return (
    <div style={{backgroundColor:"#0f1117",color:TEXT,fontFamily:"system-ui,-apple-system,sans-serif"}} className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1">CRM Dashboard</h1>
          <p className="text-sm" style={{color:TEXT2}}>{isLogin ? "Faça login para continuar" : "Crie sua conta"}</p>
        </div>
        <div className="rounded-3xl p-6" style={{backgroundColor:"#1a1d27",border:"1px solid #2a2e3d"}}>
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
          {error && <p className="text-xs mt-3 px-1" style={{color: error.includes("Conta criada") ? "#8fc61f" : R}}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-4 py-3 rounded-2xl text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            style={{background:"linear-gradient(135deg, #27a8de, #27a8decc)",opacity:loading?0.7:1}}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            {isLogin ? "Entrar" : "Criar Conta"}
          </button>
          <p className="text-center text-xs mt-4" style={{color:TEXT2}}>
            {isLogin ? "Não tem conta? " : "Já tem conta? "}
            <button onClick={() => {setIsLogin(!isLogin);setError("");}} className="font-bold hover:underline" style={{color:"#27a8de"}}>
              {isLogin ? "Criar conta" : "Fazer login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================
// MAIN APP
// ============================
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      else { setCompany(null); setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data: prof } = await supabase.from("profiles").select("*, companies(*)").eq("id", userId).single();
    if (prof) {
      setProfile(prof);
      setCompany(prof.companies);
    }
    setLoading(false);
  };

  if (loading) return (
    <div style={{backgroundColor:"#0f1117",color:TEXT}} className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin" style={{color:"#27a8de"}} />
    </div>
  );

  if (!session) return <AuthScreen />;

  if (!company) return (
    <div style={{backgroundColor:"#0f1117",color:TEXT,fontFamily:"system-ui"}} className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-lg font-bold mb-2">Conta sem empresa vinculada</p>
        <p className="text-sm mb-4" style={{color:TEXT2}}>Peça ao administrador para vincular sua conta a uma empresa.</p>
        <button onClick={() => supabase.auth.signOut()}
          className="px-6 py-2 rounded-2xl text-sm font-bold" style={{backgroundColor:R+"20",color:R}}>
          <LogOut size={14} className="inline mr-2" />Sair
        </button>
      </div>
    </div>
  );

  const theme = {
    P: company.primary_color || "#27a8de",
    G: company.secondary_color || "#8fc61f",
    Y: company.accent_color || "#f59e0b",
    BG: company.bg_color || "#0f1117",
    CARD: company.card_color || "#1a1d27",
    BORDER: company.border_color || "#2a2e3d",
    slug: company.slug,
    name: company.name,
    companyId: company.id,
  };

  return (
    <ThemeContext.Provider value={theme}>
      <CRMDashboard session={session} company={company} />
    </ThemeContext.Provider>
  );
}

// ============================
// CRM DASHBOARD
// ============================
function CRMDashboard({ session, company }) {
  const T = useTheme();
  const CARD2 = T.CARD === "#141414" ? "#1e1e1e" : "#222633";

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

  const fetchClients = useCallback(async () => {
    const { data } = await supabase.from("clients").select("*").eq("company_id", T.companyId).order("created_at", { ascending: false });
    if (data) setClients(data);
  }, [T.companyId]);

  const fetchOrigins = useCallback(async () => {
    const { data } = await supabase.from("origins").select("*").order("id");
    if (data) setOrigins(data);
  }, []);

  useEffect(() => {
    Promise.all([fetchClients(), fetchOrigins()]).then(() => setDbLoading(false));
  }, [fetchClients, fetchOrigins]);

  const originNames = useMemo(() => origins.map(o => o.name), [origins]);

  useEffect(() => {
    if (originNames.length > 0 && !form.origem) setForm(f => ({...f, origem: originNames[0]}));
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
      if (!c.nome.toLowerCase().includes(s) && !c.numero.includes(s) && !fBRL(c.valor).toLowerCase().includes(s)) return false;
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

  const submit = useCallback(async () => {
    if (!form.nome || !form.numero || !form.origem || !form.valor) return;
    const val = typeof form.valor === "string" ? parseFloat(form.valor.replace(",",".")) : Number(form.valor);
    if (isNaN(val)) return;
    const record = {
      nome: form.nome, numero: form.numero, origem: form.origem, valor: val,
      data_veio: form.dataVeio, data_servico: form.dataServico || null,
      status: form.status, user_id: session.user.id, company_id: T.companyId,
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
  }, [form, editId, session, originNames, fetchClients, T.companyId]);

  const edit = (c) => {
    setForm({nome:c.nome,numero:c.numero,origem:c.origem,valor:c.valor,dataVeio:c.data_veio,dataServico:c.data_servico||"",status:c.status});
    setEditId(c.id); setTab("cad");
  };

  const del = async (id) => { await supabase.from("clients").delete().eq("id", id); fetchClients(); };

  const cycleStatus = async (id) => {
    const order = ["naoFechado", "andamento", "fechado"];
    const client = clients.find(c => c.id === id);
    if (!client) return;
    const newStatus = order[(order.indexOf(client.status) + 1) % 3];
    await supabase.from("clients").update({ status: newStatus }).eq("id", id);
    fetchClients();
  };

  const addOr = async () => {
    const tr = newOr.trim();
    if (tr && !originNames.includes(tr)) {
      await supabase.from("origins").insert({ name: tr, is_default: false, user_id: session.user.id });
      setNewOr(""); fetchOrigins();
    }
  };

  const remOr = async (o) => {
    if (!o.is_default) { await supabase.from("origins").delete().eq("id", o.id); fetchOrigins(); }
  };

  const logout = async () => { await supabase.auth.signOut(); };

  const inp = "w-full rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all";
  const inpStyle = { backgroundColor: INPUT_BG, border: `1px solid ${T.BORDER}`, color: TEXT };
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
      <div style={{backgroundColor:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:12,padding:"10px 14px"}}>
        <p style={{color:TEXT2,fontSize:11,marginBottom:4}}>{label}</p>
        {payload.map((p,i) => (
          <p key={i} style={{color:p.color || T.P,fontSize:13,fontWeight:700}}>
            {p.dataKey === "value" ? fBRL(p.value) : p.value}
          </p>
        ))}
      </div>
    );
  };

  if (dbLoading) return (
    <div style={{backgroundColor:T.BG,color:TEXT}} className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin" style={{color:T.P}} />
    </div>
  );

  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",backgroundColor:T.BG,color:TEXT}} className="flex h-screen overflow-hidden">
      {sidebar && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebar(false)}/>}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 flex flex-col transition-transform duration-300 ${sidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{backgroundColor:T.CARD,borderRight:`1px solid ${T.BORDER}`}}>
        <div className="p-5 flex items-center justify-between" style={{borderBottom:`1px solid ${T.BORDER}`}}>
          <CompanyLogo slug={T.slug} width={130} />
          <button onClick={() => setSidebar(false)} className="lg:hidden p-1 rounded-xl hover:bg-white/10 transition" style={{color:TEXT2}}><X size={18}/></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabItems.map(t => (
            <button key={t.id} onClick={() => {setTab(t.id);setSidebar(false);}}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
              style={tab===t.id ? {background:`linear-gradient(135deg, ${T.P}25, ${T.P}10)`,color:T.P} : {color:TEXT2}}>
              <t.Icon size={18}/>{t.label}
            </button>
          ))}
        </nav>
        <div className="p-3" style={{borderTop:`1px solid ${T.BORDER}`}}>
          <p className="text-xs truncate mb-2 px-2" style={{color:TEXT2}}>{session.user.email}</p>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all hover:bg-white/5"
            style={{color:R}}><LogOut size={16}/>Sair</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="px-4 lg:px-6 py-3 flex items-center justify-between shrink-0" style={{backgroundColor:T.CARD,borderBottom:`1px solid ${T.BORDER}`}}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebar(true)} className="lg:hidden p-2 rounded-2xl hover:bg-white/10 transition" style={{color:TEXT2}}><Menu size={18}/></button>
            <h1 className="text-lg font-bold">{tab==="dash"?"Dashboard":tab==="cad"?(editId?"Editar":"Novo Cliente"):"Origens"}</h1>
          </div>
          <div className="flex items-center gap-2">
            {tab==="dash" && (
              <>
                <button onClick={() => exportCSV(filtered)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{backgroundColor:T.G+"20",color:T.G,border:`1px solid ${T.G}30`}}>
                  <Download size={15}/>Exportar
                </button>
                <button onClick={() => {setEditId(null);setForm({...empty,origem:originNames[0]||""});setTab("cad");}}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
                  style={{background:`linear-gradient(135deg, ${T.P}, ${T.P}cc)`,boxShadow:`0 4px 15px ${T.P}40`}}>
                  <Plus size={15}/>Novo
                </button>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {tab==="dash" && (<div>
            {/* Filters */}
            <div className="rounded-3xl p-4 mb-5" style={{backgroundColor:T.CARD,border:`1px solid ${T.BORDER}`}}>
              <div className="flex items-center gap-2 mb-3"><Filter size={15} style={{color:T.P}}/><span className="text-sm font-bold">Filtros</span></div>
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
                {fPer==="custom" && (<>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{color:TEXT2}}>De</label>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={inp} style={inpStyle}/>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{color:TEXT2}}>Até</label>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={inp} style={inpStyle}/>
                  </div>
                </>)}
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
              <div className="mt-3 relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:TEXT2}}/>
                <input type="text" value={srch} onChange={e => setSrch(e.target.value)} placeholder="Buscar por nome, número ou valor..."
                  className={`${inp} pl-11`} style={inpStyle}/>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {[
                {icon:Users,label:"Total Clientes",value:kpis.t,color:T.P},
                {icon:CheckCircle2,label:"Fechados",value:kpis.fc,sub:`${kpis.pct}%`,color:T.G},
                {icon:Clock,label:"Em Andamento",value:kpis.ea,color:T.Y},
                {icon:XCircle,label:"Não Fechados",value:kpis.nf,color:R},
                {icon:DollarSign,label:"Receita Total",value:fBRL(kpis.rec),color:T.G},
                {icon:TrendingUp,label:"Ticket Médio",value:fBRL(kpis.tk),color:T.P},
                {icon:Star,label:"Melhor Origem",value:kpis.mo,color:T.Y},
              ].map((k,i) => (
                <div key={i} className={`rounded-3xl p-5 flex items-start gap-4 transition-all hover:scale-[1.02] ${i===6?"col-span-2 lg:col-span-1":""}`}
                  style={{backgroundColor:T.CARD,border:`1px solid ${T.BORDER}`}}>
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

            {/* Table */}
            <div className="rounded-3xl mb-5 overflow-hidden" style={{backgroundColor:T.CARD,border:`1px solid ${T.BORDER}`}}>
              <div className="px-5 py-4" style={{borderBottom:`1px solid ${T.BORDER}`}}>
                <h2 className="text-sm font-bold">Clientes</h2>
                <p className="text-xs" style={{color:TEXT2}}>{filtered.length} registro(s)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr style={{borderBottom:`1px solid ${T.BORDER}`}}>
                    {["Nome","Número","Origem","Valor","Veio","Serviço","Status",""].map((h,i) => (
                      <th key={i} className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap ${i===7?"text-right w-20":""}`} style={{color:TEXT2}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-10 text-center text-sm" style={{color:TEXT2}}>Nenhum cliente encontrado.</td></tr>
                    ) : filtered.map(c => (
                      <tr key={c.id} className="transition-colors" style={{borderBottom:`1px solid ${T.BORDER}40`}}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor="rgba(255,255,255,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor="transparent"}>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap">{c.nome}</td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{color:TEXT2}}>{c.numero}</td>
                        <td className="px-4 py-3"><span className="text-xs font-bold px-3 py-1 rounded-full" style={{backgroundColor:T.P+"18",color:T.P}}>{c.origem}</span></td>
                        <td className="px-4 py-3 font-bold whitespace-nowrap" style={{color:T.G}}>{fBRL(c.valor)}</td>
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-3xl p-5" style={{backgroundColor:T.CARD,border:`1px solid ${T.BORDER}`}}>
                <h3 className="text-sm font-bold mb-4">Receita por Origem</h3>
                {barD.length===0 ? <p className="text-sm text-center py-10" style={{color:TEXT2}}>Sem dados.</p> : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={barD} margin={{top:5,right:5,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.BORDER}/>
                      <XAxis dataKey="name" tick={{fontSize:10,fill:TEXT2}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fontSize:10,fill:TEXT2}} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Bar dataKey="value" radius={[8,8,0,0]} maxBarSize={44}>
                        {barD.map((_,i) => <Cell key={i} fill={i%2===0?T.P:T.G}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="rounded-3xl p-5" style={{backgroundColor:T.CARD,border:`1px solid ${T.BORDER}`}}>
                <h3 className="text-sm font-bold mb-4">Leads por Dia</h3>
                {lineD.length===0 ? <p className="text-sm text-center py-10" style={{color:TEXT2}}>Sem dados.</p> : (
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={lineD} margin={{top:5,right:5,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.BORDER}/>
                      <XAxis dataKey="date" tick={{fontSize:10,fill:TEXT2}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fontSize:10,fill:TEXT2}} axisLine={false} tickLine={false} allowDecimals={false}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Line type="monotone" dataKey="leads" stroke={T.P} strokeWidth={3} dot={{fill:T.P,r:4,strokeWidth:2,stroke:T.CARD}} activeDot={{r:6,fill:T.G,stroke:T.CARD,strokeWidth:2}}/>
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>)}

          {/* Form */}
          {tab==="cad" && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-3xl p-6" style={{backgroundColor:T.CARD,border:`1px solid ${T.BORDER}`}}>
                <h2 className="text-lg font-bold mb-1">{editId?"Editar Cliente":"Novo Cliente"}</h2>
                <p className="text-sm mb-6" style={{color:TEXT2}}>{editId?"Atualize os dados.":"Preencha os dados para registrar."}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Nome do Cliente</label>
                    <input type="text" value={form.nome} onChange={e => setForm({...form,nome:e.target.value})} placeholder="Ex: João da Silva" className={inp} style={inpStyle}/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Número / WhatsApp</label>
                    <input type="text" value={form.numero} onChange={e => setForm({...form,numero:maskPhone(e.target.value)})} placeholder="(00) 00000-0000" maxLength={15} className={inp} style={inpStyle}/>
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
                    <label className="block text-xs font-bold mb-1.5" style={{color:TEXT2}}>Valor (R$)</label>
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
                          style={form.status===key ? {backgroundColor:s.color+"25",color:s.color,border:`2px solid ${s.color}`} : {backgroundColor:INPUT_BG,color:TEXT2,border:`2px solid ${T.BORDER}`}}>
                          <s.Icon size={16}/>{s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-5" style={{borderTop:`1px solid ${T.BORDER}`}}>
                  <button onClick={submit}
                    className="px-8 py-3 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
                    style={{background:`linear-gradient(135deg, ${T.P}, ${T.P}cc)`,boxShadow:`0 4px 20px ${T.P}40`}}>
                    {editId?"Atualizar":"Cadastrar"}
                  </button>
                  {editId && <button onClick={() => {setEditId(null);setForm({...empty,origem:originNames[0]||""});}} className="px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-white/5 transition" style={{color:TEXT2}}>Cancelar</button>}
                </div>
              </div>
            </div>
          )}

          {/* Origins */}
          {tab==="orig" && (
            <div className="max-w-lg mx-auto">
              <div className="rounded-3xl p-6" style={{backgroundColor:T.CARD,border:`1px solid ${T.BORDER}`}}>
                <h2 className="text-lg font-bold mb-1">Gerenciar Origens</h2>
                <p className="text-sm mb-5" style={{color:TEXT2}}>Adicione ou remova fontes de origem.</p>
                <div className="flex gap-2 mb-5">
                  <input type="text" value={newOr} onChange={e => setNewOr(e.target.value)} onKeyDown={e => e.key==="Enter" && addOr()} placeholder="Nova origem..." className={`flex-1 ${inp}`} style={inpStyle}/>
                  <button onClick={addOr}
                    className="px-5 py-2.5 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0"
                    style={{background:`linear-gradient(135deg, ${T.P}, ${T.P}cc)`}}>
                    <Plus size={15}/>Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {origins.map(o => (
                    <div key={o.id} className="flex items-center justify-between rounded-2xl px-4 py-3" style={{backgroundColor:CARD2,border:`1px solid ${T.BORDER}`}}>
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full" style={{backgroundColor:T.P}}/>
                        <span className="text-sm font-semibold">{o.name}</span>
                      </div>
                      {o.is_default ? (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-lg" style={{backgroundColor:T.P+"15",color:T.P}}>Padrão</span>
                      ) : (
                        <button onClick={() => remOr(o)} className="p-1.5 rounded-xl hover:bg-red-500/10 transition" style={{color:TEXT2}}><Trash2 size={14}/></button>
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
