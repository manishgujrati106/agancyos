import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CONFIG ─────────────────────────────────

const SUPABASE_URL = "https://osqhegbrcvhgplfcnhcg.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcWhlZ2JyY3ZoZ3BsZmNuaGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDUyNjAsImV4cCI6MjA5NTcyMTI2MH0.QwsmocM_EWdLPge1H5emoQITsG7qPN7-BiaMg2tbCe4";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const AI_MODEL = "claude-sonnet-4-20250514";
const TYPE_META = {
  shoot:  { label:"Shoot",  icon:"📸", color:"#FF9F0A" },
  edit:   { label:"Edit",   icon:"✂️",  color:"#BF5AF2" },
  social: { label:"Social", icon:"📱", color:"#30D158" },
  design: { label:"Design", icon:"🎨", color:"#0A84FF" },
};
const STATUS_META = {
  todo:          { label:"To Do",       color:"#636366" },
  "in-progress": { label:"In Progress", color:"#FF9F0A" },
  review:        { label:"In Review",   color:"#BF5AF2" },
  done:          { label:"Done",        color:"#30D158" },
};

function useAI() {
  const [loading, setLoading] = useState(false);
  const ask = async (prompt, system="") => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:AI_MODEL, max_tokens:1000,
          system: system||"You are an expert creative agency project manager. Be concise and practical. Plain text only.",
          messages:[{role:"user",content:prompt}] }),
      });
      const d = await res.json();
      return d.content?.[0]?.text || "No response";
    } catch { return "AI unavailable."; } finally { setLoading(false); }
  };
  return { ask, loading };
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#080808;--s1:#111;--s2:#181818;--s3:#222;--border:#252525;--text:#f0f0f0;--muted:#555;--muted2:#333;--red:#FF3B30;--gold:#FF9F0A;--green:#2DBD6E;--blue:#0A84FF;--purple:#BF5AF2;--font:'Syne',sans-serif;--mono:'JetBrains Mono',monospace}
body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh}
.app{display:flex;min-height:100vh}
.sidebar{width:224px;min-height:100vh;background:var(--s1);border-right:1px solid var(--border);padding:22px 14px;display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:20}
.logo{font-size:16px;font-weight:800;padding:0 8px 20px;border-bottom:1px solid var(--border);margin-bottom:10px;letter-spacing:.5px}
.logo em{color:var(--red);font-style:normal}
.nav-btn{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:600;color:var(--muted);transition:all .15s;border:none;background:none;text-align:left;width:100%;font-family:var(--font)}
.nav-btn:hover,.nav-btn.active{color:var(--text);background:var(--s2)}
.user-pill{display:flex;align-items:center;gap:9px;padding:10px 12px;background:var(--s2);border-radius:10px;margin-top:auto;border:1px solid var(--border)}
.user-name{font-size:12px;font-weight:700;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.user-role{font-size:10px;color:var(--muted);font-family:var(--mono)}
.main{margin-left:224px;flex:1;padding:36px 40px;min-height:100vh}
.ph{margin-bottom:26px;display:flex;align-items:flex-start;justify-content:space-between}
.pt{font-size:24px;font-weight:800;letter-spacing:-.5px}
.ps{color:var(--muted);font-size:11px;margin-top:3px;font-family:var(--mono)}
.card{background:var(--s1);border:1px solid var(--border);border-radius:15px;padding:20px}
.sg{display:grid;gap:13px;margin-bottom:22px}
.s4{grid-template-columns:repeat(4,1fr)}.s3{grid-template-columns:repeat(3,1fr)}.s2g{grid-template-columns:repeat(2,1fr)}
.sc{background:var(--s1);border:1px solid var(--border);border-radius:13px;padding:17px 19px}
.sl{font-size:10px;font-weight:600;color:var(--muted);letter-spacing:1.2px;text-transform:uppercase;font-family:var(--mono)}
.sv{font-size:26px;font-weight:800;margin-top:5px;letter-spacing:-1px}
.sd{font-size:11px;color:var(--green);margin-top:3px;font-family:var(--mono)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}
.slbl{font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:13px;font-family:var(--mono)}
.pc{background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:15px;cursor:pointer;transition:border-color .15s}
.pc:hover{border-color:#333}
.pc-name{font-size:13px;font-weight:700}.pc-client{font-size:11px;color:var(--muted);margin-top:2px;font-family:var(--mono)}
.badge{font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px;font-family:var(--mono);letter-spacing:.5px}
.pb{height:2px;background:var(--border);border-radius:2px;margin-top:11px}
.pf{height:100%;border-radius:2px;transition:width .4s}
.pc-foot{display:flex;justify-content:space-between;align-items:center;margin-top:9px}
.pc-dead{font-size:10px;color:var(--muted);font-family:var(--mono)}
.av{border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
.pills{display:flex;gap:4px;flex-wrap:wrap;margin-top:7px}
.pill{font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;font-family:var(--mono)}
.tr{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--border)}
.tr:last-child{border-bottom:none}
.tc{width:16px;height:16px;border-radius:4px;border:2px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;transition:all .15s;background:transparent;color:transparent}
.tc.done{background:var(--green);border-color:var(--green);color:white}
.tt{font-size:13px;flex:1}.tt.done{color:var(--muted);text-decoration:line-through}
.pdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.btn{padding:9px 15px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;border:none;font-family:var(--font);transition:all .15s;letter-spacing:.3px}
.br{background:var(--red);color:white}.br:hover{opacity:.85}
.bg{background:var(--s2);color:var(--text);border:1px solid var(--border)}.bg:hover{border-color:#3a3a3a}
.bs{padding:5px 10px;font-size:11px;border-radius:7px}
.btn:disabled{opacity:.5;cursor:not-allowed}
.tabs{display:flex;gap:3px;margin-bottom:20px;background:var(--s2);padding:3px;border-radius:10px;width:fit-content}
.tab{padding:6px 13px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;border:none;background:transparent;color:var(--muted);font-family:var(--font);transition:all .15s}
.tab.active{background:var(--s1);color:var(--text)}
.fg{margin-bottom:13px}.fl{font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);margin-bottom:5px;display:block}
.fi{width:100%;background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:9px 11px;font-size:13px;color:var(--text);font-family:var(--font);outline:none}
.fi:focus{border-color:var(--red)}.fi::placeholder{color:var(--muted2)}
select.fi{appearance:none;cursor:pointer}
.gi2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.gi3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--s1);border:1px solid var(--border);border-radius:18px;padding:26px;width:100%;max-width:460px;max-height:90vh;overflow-y:auto}
.mt{font-size:16px;font-weight:800;margin-bottom:16px}
.lw{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);position:relative;overflow:hidden}
.lbg{position:absolute;inset:0;background:radial-gradient(ellipse at 15% 50%,#FF3B3018 0%,transparent 55%),radial-gradient(ellipse at 85% 15%,#FF9F0A12 0%,transparent 50%)}
.lc{background:var(--s1);border:1px solid var(--border);border-radius:22px;padding:38px;width:100%;max-width:400px;position:relative;z-index:1}
.ll{font-size:26px;font-weight:800;margin-bottom:4px}.ll em{color:var(--red);font-style:normal}
.ls{font-size:12px;color:var(--muted);margin-bottom:28px;font-family:var(--mono)}
.aip{background:var(--s1);border:1px solid var(--border);border-radius:15px;overflow:hidden}
.aih{display:flex;align-items:center;gap:10px;padding:13px 17px;border-bottom:1px solid var(--border);background:var(--s2)}
.aipulse{width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.aim{padding:14px 17px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:10px}
.aiu{font-size:11px;color:var(--muted);font-family:var(--mono)}.aia{font-size:13px;line-height:1.65;background:var(--s2);padding:11px 13px;border-radius:9px}
.air{display:flex;gap:8px;padding:11px 17px;border-top:1px solid var(--border)}
.row{display:flex;align-items:center;gap:11px;padding:11px 0;border-bottom:1px solid var(--border)}
.row:last-child{border-bottom:none}
.err{color:var(--red);font-size:11px;font-family:var(--mono);margin-bottom:10px}
.hb{background:var(--s2);border:1px solid var(--border);border-radius:9px;padding:13px;font-size:13px;line-height:1.7;white-space:pre-wrap}
.empty{text-align:center;padding:32px;color:var(--muted);font-size:12px;font-family:var(--mono)}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.fade{animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.spinner{display:inline-block;width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--red);border-radius:50%;animation:spin .6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;background:var(--bg)}
`;

// ── Login ──────────────────────────────────────────────────
function LoginScreen() {
  const [email,setEmail]=useState("");const [pw,setPw]=useState("");
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const login=async()=>{
    if(!email||!pw)return;setLoading(true);setErr("");
    const{error}=await supabase.auth.signInWithPassword({email,password:pw});
    if(error)setErr(error.message);
    setLoading(false);
  };
  return(<div className="lw"><div className="lbg"/><div className="lc fade">
    <div className="ll">AGENCY<em>OS</em></div>
    <div className="ls">Sign in to your workspace</div>
    {err&&<div className="err">{err}</div>}
    <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="you@agency.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
    <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/></div>
    <button className="btn br" style={{width:"100%",marginTop:4}} onClick={login} disabled={loading}>{loading?"Signing in...":"Sign In"}</button>
    <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",marginTop:14,textAlign:"center"}}>First time? Ask your owner to set up your account.</div>
  </div></div>);
}

// ── Shared ────────────────────────────────────────────────
function Stat({label,value,delta,color}){return(<div className="sc"><div className="sl">{label}</div><div className="sv" style={{color:color||"var(--text)"}}>{value}</div>{delta&&<div className="sd">{delta}</div>}</div>);}

function PCard({project,clients,employees,onClick,money=true}){
  const client=clients.find(c=>c.id===project.client_id);
  const type=TYPE_META[project.type]||TYPE_META.shoot;
  const status=STATUS_META[project.status]||STATUS_META.todo;
  const assigned=(project.assigned_to||[]).map(id=>employees.find(e=>e.id===id)).filter(Boolean);
  return(<div className="pc" onClick={onClick}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div><div style={{display:"flex",alignItems:"center",gap:6}}><span>{type.icon}</span><span className="pc-name">{project.name}</span></div><div className="pc-client">{client?.name}</div></div>
      <span className="badge" style={{background:status.color+"22",color:status.color}}>{status.label}</span>
    </div>
    {assigned.length>0&&<div className="pills">{assigned.map(e=><span key={e.id} className="pill" style={{background:e.color+"22",color:e.color}}>{(e.full_name||"?").split(" ")[0]}</span>)}</div>}
    <div className="pb"><div className="pf" style={{width:`${project.progress||0}%`,background:type.color}}/></div>
    <div className="pc-foot">
      {money?<span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>${(project.paid||0).toLocaleString()} / ${(project.budget||0).toLocaleString()}</span>
            :<span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{project.progress||0}% done</span>}
      <span className="pc-dead">📅 {project.deadline}</span>
    </div>
  </div>);
}

// ── Owner Pages ───────────────────────────────────────────
function OwnDash({clients,projects,tasks,employees}){
  const rev=projects.reduce((s,p)=>s+(p.paid||0),0);
  const out=projects.reduce((s,p)=>s+((p.budget||0)-(p.paid||0)),0);
  return(<div className="fade">
    <div className="ph"><div><div className="pt">Dashboard 🔥</div><div className="ps">Agency overview</div></div></div>
    <div className="sg s4">
      <Stat label="Collected" value={`$${rev.toLocaleString()}`} color="var(--green)" delta="total paid"/>
      <Stat label="Outstanding" value={`$${out.toLocaleString()}`} color="var(--gold)" delta="to collect"/>
      <Stat label="Active Projects" value={projects.filter(p=>p.status==="in-progress").length}/>
      <Stat label="Open Tasks" value={tasks.filter(t=>!t.done).length} color="var(--purple)"/>
    </div>
    <div className="g2">
      <div className="card"><div className="slbl">Upcoming Deadlines</div>
        {[...projects].sort((a,b)=>new Date(a.deadline)-new Date(b.deadline)).slice(0,5).map(p=>{
          const c=clients.find(c=>c.id===p.client_id);const t=TYPE_META[p.type]||TYPE_META.shoot;
          return(<div key={p.id} className="row"><span>{t.icon}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{c?.name}</div></div><span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{p.deadline}</span></div>);
        })}
        {projects.length===0&&<div className="empty">No projects yet</div>}
      </div>
      <div className="card"><div className="slbl">Team Workload</div>
        {employees.map(e=>{const mine=tasks.filter(t=>t.assigned_to===e.id&&!t.done).length;
          return(<div key={e.id} className="row"><div className="av" style={{width:34,height:34,background:e.color+"22",color:e.color,fontSize:13}}>{(e.full_name||"?").charAt(0)}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{e.full_name}</div><div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{e.role}</div></div><span className="badge" style={{background:"var(--s2)",color:"var(--muted)"}}>{mine} tasks</span></div>);
        })}
        {employees.length===0&&<div className="empty">No team yet</div>}
      </div>
    </div>
  </div>);
}

function OwnProjects({clients,projects,setProjects,tasks,setTasks,employees}){
  const[filter,setFilter]=useState("all");const[sel,setSel]=useState(null);
  const[show,setShow]=useState(false);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({name:"",client_id:"",type:"shoot",status:"todo",deadline:"",budget:"",paid:"0",assigned_to:[]});
  const{ask,loading:al}=useAI();const[aiText,setAiText]=useState("");const[nt,setNt]=useState("");
  const filtered=filter==="all"?projects:projects.filter(p=>p.status===filter);
  const save=async()=>{if(!form.name||!form.client_id)return;setSaving(true);
    const{data,error}=await supabase.from("projects").insert([{name:form.name,client_id:form.client_id,type:form.type,status:form.status,deadline:form.deadline||null,budget:+form.budget||0,paid:+form.paid||0,progress:0,assigned_to:form.assigned_to}]).select().single();
    if(!error){setProjects(p=>[...p,data]);setShow(false);setForm({name:"",client_id:"",type:"shoot",status:"todo",deadline:"",budget:"",paid:"0",assigned_to:[]});}setSaving(false);};
  const addTask=async()=>{if(!nt.trim()||!sel)return;
    const{data}=await supabase.from("tasks").insert([{project_id:sel.id,title:nt.trim(),done:false,priority:"medium",assigned_to:null}]).select().single();
    if(data){setTasks(t=>[...t,data]);setNt("");}};
  const tog=async(task)=>{const{data}=await supabase.from("tasks").update({done:!task.done}).eq("id",task.id).select().single();if(data)setTasks(t=>t.map(x=>x.id===task.id?data:x));};
  const getAI=async(p)=>{const c=clients.find(c=>c.id===p.client_id);const txt=await ask(`For "${p.name}" (${p.type} for ${c?.name}, ${p.progress}% done, due ${p.deadline}): 3 specific next steps or ideas. Brief.`);setAiText(txt);};
  return(<div className="fade">
    <div className="ph"><div><div className="pt">Projects</div><div className="ps">{projects.length} total</div></div><button className="btn br" onClick={()=>setShow(true)}>+ New Project</button></div>
    <div className="tabs">{["all","todo","in-progress","review","done"].map(s=><button key={s} className={`tab ${filter===s?"active":""}`} onClick={()=>setFilter(s)}>{s==="all"?"All":STATUS_META[s]?.label}</button>)}</div>
    <div className="g3" style={{marginBottom:18}}>{filtered.map(p=><PCard key={p.id} project={p} clients={clients} employees={employees} onClick={()=>{setSel(p);setAiText("");}}/>)}{filtered.length===0&&<div className="empty" style={{gridColumn:"1/-1"}}>Nothing here</div>}</div>
    {sel&&(<div className="card fade" style={{marginBottom:18}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:13}}>
        <div><div style={{fontSize:16,fontWeight:800}}>{sel.name}</div><div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",marginTop:2}}>{clients.find(c=>c.id===sel.client_id)?.name} · {TYPE_META[sel.type]?.label} · ${(sel.paid||0).toLocaleString()} / ${(sel.budget||0).toLocaleString()}</div></div>
        <div style={{display:"flex",gap:7}}><button className="btn bg bs" onClick={()=>getAI(sel)} disabled={al}>{al?"...":"✨ AI Ideas"}</button><button className="btn bg bs" onClick={()=>setSel(null)}>✕</button></div>
      </div>
      {aiText&&<div className="hb" style={{marginBottom:13}}>{aiText}</div>}
      <div className="slbl">Tasks</div>
      {tasks.filter(t=>t.project_id===sel.id).map(t=>{const a=employees.find(e=>e.id===t.assigned_to);return(<div key={t.id} className="tr"><div className={`tc ${t.done?"done":""}`} onClick={()=>tog(t)}>✓</div><div className={`tt ${t.done?"done":""}`}>{t.title}</div>{a&&<div className="av" style={{width:20,height:20,background:a.color+"22",color:a.color,fontSize:9,borderRadius:5}}>{(a.full_name||"?").charAt(0)}</div>}</div>);})}
      <div style={{display:"flex",gap:8,marginTop:10}}><input className="fi" placeholder="Add task + Enter" value={nt} onChange={e=>setNt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()}/><button className="btn bg bs" onClick={addTask}>Add</button></div>
    </div>)}
    {show&&(<div className="ov" onClick={e=>e.target===e.currentTarget&&setShow(false)}><div className="modal">
      <div className="mt">New Project</div>
      <div className="fg"><label className="fl">Name</label><input className="fi" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Project name"/></div>
      <div className="fg"><label className="fl">Client</label><select className="fi" value={form.client_id} onChange={e=>setForm(f=>({...f,client_id:e.target.value}))}><option value="">Select...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div className="gi2">
        <div className="fg"><label className="fl">Type</label><select className="fi" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{Object.entries(TYPE_META).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}</select></div>
        <div className="fg"><label className="fl">Status</label><select className="fi" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{Object.entries(STATUS_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
      </div>
      <div className="gi3">
        <div className="fg"><label className="fl">Deadline</label><input type="date" className="fi" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}/></div>
        <div className="fg"><label className="fl">Budget $</label><input type="number" className="fi" value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))}/></div>
        <div className="fg"><label className="fl">Paid $</label><input type="number" className="fi" value={form.paid} onChange={e=>setForm(f=>({...f,paid:e.target.value}))}/></div>
      </div>
      <div className="fg"><label className="fl">Assign Team</label><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{employees.map(e=>{const on=form.assigned_to.includes(e.id);return(<button key={e.id} className="btn bs" style={{background:on?e.color+"33":"var(--s2)",color:on?e.color:"var(--muted)",border:`1px solid ${on?e.color:"var(--border)"}`}} onClick={()=>setForm(f=>({...f,assigned_to:on?f.assigned_to.filter(x=>x!==e.id):[...f.assigned_to,e.id]}))}>{(e.full_name||"?").split(" ")[0]}</button>);})}</div></div>
      <div style={{display:"flex",gap:8,marginTop:6}}><button className="btn br" style={{flex:1}} onClick={save} disabled={saving}>{saving?"Saving...":"Create"}</button><button className="btn bg" onClick={()=>setShow(false)}>Cancel</button></div>
    </div></div>)}
  </div>);
}

function OwnClients({clients,setClients,projects}){
  const[sel,setSel]=useState(null);const[show,setShow]=useState(false);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({name:"",industry:"",email:"",color:"#FF3B30"});
  const{ask,loading}=useAI();const[aiText,setAiText]=useState("");
  const save=async()=>{if(!form.name)return;setSaving(true);
    const{data,error}=await supabase.from("clients").insert([{...form,spent:0,status:"active"}]).select().single();
    if(!error){setClients(c=>[...c,data]);setShow(false);setForm({name:"",industry:"",email:"",color:"#FF3B30"});}setSaving(false);};
  const getI=async(c)=>{setSel(c);setAiText("");const cp=projects.filter(p=>p.client_id===c.id);const txt=await ask(`Agency client: ${c.name} (${c.industry}), $${c.spent} spent. Projects: ${cp.map(p=>p.name).join(", ")||"none"}. 3 specific upsell ideas. Brief.`);setAiText(txt);};
  return(<div className="fade">
    <div className="ph"><div><div className="pt">Clients</div><div className="ps">{clients.length} clients</div></div><button className="btn br" onClick={()=>setShow(true)}>+ New Client</button></div>
    <div className="g2">
      <div className="card">{clients.map(c=>(<div key={c.id} className="row" style={{cursor:"pointer"}} onClick={()=>{setSel(c);setAiText("");}}>
        <div className="av" style={{width:36,height:36,background:c.color+"22",color:c.color,fontSize:14}}>{(c.name||"?").charAt(0)}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{c.industry} · {projects.filter(p=>p.client_id===c.id).length} projects</div></div>
        <span style={{fontSize:13,fontWeight:700,color:"var(--green)",fontFamily:"var(--mono)"}}>${(c.spent||0).toLocaleString()}</span>
      </div>))}{clients.length===0&&<div className="empty">No clients yet</div>}</div>
      {sel&&(<div className="card fade">
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:13}}>
          <div><div style={{fontSize:17,fontWeight:800}}>{sel.name}</div><div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",marginTop:2}}>{sel.email}</div></div>
          <div style={{display:"flex",gap:7}}><button className="btn bg bs" onClick={()=>getI(sel)} disabled={loading}>{loading?"...":"✨ Upsells"}</button><button className="btn bg bs" onClick={()=>setSel(null)}>✕</button></div>
        </div>
        <div className="gi2" style={{marginBottom:13}}>
          <div className="sc" style={{padding:"13px 15px"}}><div className="sl">Total Spent</div><div className="sv" style={{fontSize:18,color:"var(--green)"}}>${(sel.spent||0).toLocaleString()}</div></div>
          <div className="sc" style={{padding:"13px 15px"}}><div className="sl">Projects</div><div className="sv" style={{fontSize:18}}>{projects.filter(p=>p.client_id===sel.id).length}</div></div>
        </div>
        {aiText&&<div className="hb">{aiText}</div>}
      </div>)}
    </div>
    {show&&(<div className="ov" onClick={e=>e.target===e.currentTarget&&setShow(false)}><div className="modal">
      <div className="mt">New Client</div>
      <div className="fg"><label className="fl">Brand Name</label><input className="fi" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
      <div className="fg"><label className="fl">Industry</label><input className="fi" value={form.industry} onChange={e=>setForm(f=>({...f,industry:e.target.value}))} placeholder="Streetwear, Beauty..."/></div>
      <div className="fg"><label className="fl">Email</label><input className="fi" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
      <div className="fg"><label className="fl">Color</label><input type="color" className="fi" style={{height:40,padding:4,cursor:"pointer"}} value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))}/></div>
      <div style={{display:"flex",gap:8}}><button className="btn br" style={{flex:1}} onClick={save} disabled={saving}>{saving?"Saving...":"Add Client"}</button><button className="btn bg" onClick={()=>setShow(false)}>Cancel</button></div>
    </div></div>)}
  </div>);
}

function OwnTeam({employees,setEmployees}){
  const[show,setShow]=useState(false);const[saving,setSaving]=useState(false);const[err,setErr]=useState("");
  const[form,setForm]=useState({full_name:"",role:"",color:"#FF9F0A",email:""});
  const save=async()=>{if(!form.full_name||!form.email)return;setSaving(true);setErr("");
    const{data,error}=await supabase.from("profiles").insert([{full_name:form.full_name,role:form.role,color:form.color,email:form.email,is_owner:false,active:true}]).select().single();
    if(error){setErr(error.message);}else{setEmployees(e=>[...e,data]);setShow(false);setForm({full_name:"",role:"",color:"#FF9F0A",email:""});}setSaving(false);};
  const tog=async(emp)=>{const{data}=await supabase.from("profiles").update({active:!emp.active}).eq("id",emp.id).select().single();if(data)setEmployees(e=>e.map(x=>x.id===emp.id?data:x));};
  return(<div className="fade">
    <div className="ph"><div><div className="pt">Team</div><div className="ps">Manage employees & access</div></div><button className="btn br" onClick={()=>setShow(true)}>+ Add Employee</button></div>
    <div className="card" style={{maxWidth:540}}>
      <div className="slbl">Employees ({employees.length})</div>
      {employees.map(e=>(<div key={e.id} className="row">
        <div className="av" style={{width:36,height:36,background:e.color+"22",color:e.color,fontSize:13}}>{(e.full_name||"?").charAt(0)}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{e.full_name}</div><div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{e.role} · {e.email}</div></div>
        <span className="badge" style={{background:e.active?"var(--green)22":"var(--s3)",color:e.active?"var(--green)":"var(--muted)",marginRight:8}}>{e.active?"Active":"Inactive"}</span>
        <button className="btn bg bs" onClick={()=>tog(e)}>{e.active?"Deactivate":"Activate"}</button>
      </div>))}
      {employees.length===0&&<div className="empty">No employees yet</div>}
      <div style={{marginTop:14,padding:"11px 13px",background:"var(--s2)",borderRadius:9,fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>💡 Employees log in with email + password. They only see projects & tasks — no revenue or financials.</div>
    </div>
    {show&&(<div className="ov" onClick={e=>e.target===e.currentTarget&&setShow(false)}><div className="modal">
      <div className="mt">Add Employee</div>
      <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",marginBottom:13,background:"var(--s2)",padding:"10px 12px",borderRadius:8}}>First create their account in Supabase → Authentication → Users → "Invite user". Then fill this to set name & role.</div>
      {err&&<div className="err">{err}</div>}
      <div className="fg"><label className="fl">Full Name</label><input className="fi" value={form.full_name} onChange={e=>setForm(f=>({...f,full_name:e.target.value}))}/></div>
      <div className="fg"><label className="fl">Role</label><input className="fi" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} placeholder="e.g. Photographer, Editor"/></div>
      <div className="fg"><label className="fl">Email (must match Supabase auth)</label><input className="fi" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
      <div className="fg"><label className="fl">Color</label><input type="color" className="fi" style={{height:40,padding:4,cursor:"pointer"}} value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))}/></div>
      <div style={{display:"flex",gap:8}}><button className="btn br" style={{flex:1}} onClick={save} disabled={saving}>{saving?"Saving...":"Add Employee"}</button><button className="btn bg" onClick={()=>setShow(false)}>Cancel</button></div>
    </div></div>)}
  </div>);
}

function OwnInvoices({clients,projects}){
  const{ask,loading}=useAI();const[draft,setDraft]=useState("");const[did,setDid]=useState(null);
  const total=projects.reduce((s,p)=>s+(p.budget||0),0);const collected=projects.reduce((s,p)=>s+(p.paid||0),0);
  const gen=async(p)=>{setDid(p.id);const c=clients.find(c=>c.id===p.client_id);const txt=await ask(`Invoice email. Client:${c?.name}. Project:${p.name}. Total:$${p.budget}. Paid:$${p.paid}. Balance:$${(p.budget||0)-(p.paid||0)}. Deadline:${p.deadline}. Subject line. Concise.`,"Professional agency account manager. Plain text.");setDraft(txt);setDid(null);};
  return(<div className="fade">
    <div className="ph"><div><div className="pt">Invoices 💰</div><div className="ps">Payment tracking</div></div></div>
    <div className="sg s3"><Stat label="Total Contracted" value={`$${total.toLocaleString()}`}/><Stat label="Collected" value={`$${collected.toLocaleString()}`} color="var(--green)"/><Stat label="Outstanding" value={`$${(total-collected).toLocaleString()}`} color="var(--red)"/></div>
    <div className="g2">
      <div className="card"><div className="slbl">All Projects</div>
        {projects.map(p=>{const c=clients.find(c=>c.id===p.client_id);const bal=(p.budget||0)-(p.paid||0);return(<div key={p.id} className="row"><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>{c?.name}</div></div><div style={{fontFamily:"var(--mono)",fontSize:12,marginRight:9}}>{bal===0?<span style={{color:"var(--green)"}}>PAID</span>:<span style={{color:"var(--red)"}}>-${bal.toLocaleString()}</span>}</div>{bal>0&&<button className="btn bg bs" onClick={()=>gen(p)} disabled={loading&&did===p.id}>{loading&&did===p.id?"...":"✉️ Draft"}</button>}</div>);})}
        {projects.length===0&&<div className="empty">No projects yet</div>}
      </div>
      <div className="card"><div className="slbl">AI Invoice Email</div>
        {draft?<><div className="hb" style={{marginBottom:11}}>{draft}</div><div style={{display:"flex",gap:8}}><button className="btn br bs" onClick={()=>navigator.clipboard?.writeText(draft)}>Copy</button><button className="btn bg bs" onClick={()=>setDraft("")}>Clear</button></div></>:<div className="empty">Click "Draft" on any unpaid project</div>}
      </div>
    </div>
  </div>);
}

function OwnAI({clients,projects,tasks,employees}){
  const{ask,loading}=useAI();const[msgs,setMsgs]=useState([{r:"ai",t:"Hey! I'm your agency AI. Ask me anything — deadlines, upsells, updates, team workload."}]);
  const[input,setInput]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async()=>{if(!input.trim()||loading)return;const q=input.trim();setInput("");setMsgs(m=>[...m,{r:"user",t:q}]);
    const ctx=`Clients:${clients.map(c=>`${c.name}($${c.spent})`).join(",")}. Projects:${projects.map(p=>`${p.name}(${p.status},${p.progress}%,due ${p.deadline})`).join("|")}. Open tasks:${tasks.filter(t=>!t.done).map(t=>t.title).join(",")}. Team:${employees.map(e=>e.full_name).join(",")}.`;
    const reply=await ask(`${ctx}\n\nQuestion:${q}`);setMsgs(m=>[...m,{r:"ai",t:reply}]);};
  const quick=["What's overdue?","Draft a client update","Suggest upsells","Who's busiest?"];
  return(<div className="fade">
    <div className="ph"><div><div className="pt">AI Assistant ✨</div><div className="ps">Your agency co-pilot</div></div></div>
    <div className="aip">
      <div className="aih"><div className="aipulse"/><span style={{fontSize:13,fontWeight:700}}>Agency AI</span><div style={{marginLeft:"auto",display:"flex",gap:6}}>{quick.map(q=><button key={q} className="btn bg bs" onClick={()=>setInput(q)}>{q}</button>)}</div></div>
      <div className="aim">{msgs.map((m,i)=><div key={i} className={m.r==="user"?"aiu":"aia"}>{m.t}</div>)}{loading&&<div className="aia" style={{color:"var(--muted)"}}>Thinking...</div>}<div ref={ref}/></div>
      <div className="air"><input className="fi" style={{flex:1}} placeholder="Ask anything..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button className="btn br bs" onClick={send} disabled={loading}>{loading?"...":"Send"}</button></div>
    </div>
  </div>);
}

// ── Employee View ─────────────────────────────────────────
function EmpView({user,clients,projects,tasks,setTasks,employees,onLogout}){
  const[tab,setTab]=useState("tasks");const[sel,setSel]=useState(null);const[nt,setNt]=useState("");
  const myP=projects.filter(p=>(p.assigned_to||[]).includes(user.id));
  const myT=tasks.filter(t=>t.assigned_to===user.id);
  const tog=async(task)=>{const{data}=await supabase.from("tasks").update({done:!task.done}).eq("id",task.id).select().single();if(data)setTasks(t=>t.map(x=>x.id===task.id?data:x));};
  const add=async()=>{if(!nt.trim()||!sel)return;const{data}=await supabase.from("tasks").insert([{project_id:sel.id,title:nt.trim(),done:false,priority:"medium",assigned_to:user.id}]).select().single();if(data){setTasks(t=>[...t,data]);setNt("");}};
  return(<div className="app">
    <aside className="sidebar">
      <div className="logo">AGENCY<em>OS</em></div>
      {[{id:"tasks",icon:"✅",label:"My Tasks"},{id:"projects",icon:"🎯",label:"Projects"}].map(n=><button key={n.id} className={`nav-btn ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}><span style={{fontSize:14,width:20,textAlign:"center"}}>{n.icon}</span>{n.label}</button>)}
      <div className="user-pill"><div style={{width:7,height:7,borderRadius:"50%",background:user.color||"var(--gold)",flexShrink:0}}/><div style={{flex:1,minWidth:0}}><div className="user-name">{user.full_name}</div><div className="user-role">{user.role}</div></div><button className="btn bg bs" onClick={onLogout} style={{fontSize:10,padding:"3px 7px"}}>Out</button></div>
    </aside>
    <main className="main">
      {tab==="tasks"&&(<div className="fade">
        <div className="ph"><div><div className="pt">My Tasks</div><div className="ps">{myT.filter(t=>!t.done).length} open</div></div></div>
        <div className="sg s3" style={{maxWidth:480}}><Stat label="Open" value={myT.filter(t=>!t.done).length} color="var(--gold)"/><Stat label="Done" value={myT.filter(t=>t.done).length} color="var(--green)"/><Stat label="Total" value={myT.length}/></div>
        <div className="card" style={{maxWidth:580}}>{myT.length===0&&<div className="empty">No tasks assigned yet</div>}
          {myT.map(t=>{const p=projects.find(x=>x.id===t.project_id);return(<div key={t.id} className="tr"><div className={`tc ${t.done?"done":""}`} onClick={()=>tog(t)}>✓</div><div className={`tt ${t.done?"done":""}`}>{t.title}</div>{p&&<span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--mono)"}}>{p.name}</span>}</div>);})}
        </div>
      </div>)}
      {tab==="projects"&&(<div className="fade">
        <div className="ph"><div><div className="pt">My Projects</div><div className="ps">{myP.length} assigned</div></div></div>
        <div className="g3" style={{marginBottom:18}}>{myP.map(p=><PCard key={p.id} project={p} clients={clients} employees={employees} onClick={()=>setSel(p)} money={false}/>)}{myP.length===0&&<div className="empty" style={{gridColumn:"1/-1"}}>No projects assigned yet</div>}</div>
        {sel&&(<div className="card fade">
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:13}}><div><div style={{fontSize:16,fontWeight:800}}>{sel.name}</div><div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)",marginTop:2}}>{clients.find(c=>c.id===sel.client_id)?.name} · {sel.progress||0}% done · Due {sel.deadline}</div></div><button className="btn bg bs" onClick={()=>setSel(null)}>✕</button></div>
          <div className="slbl">Tasks</div>
          {tasks.filter(t=>t.project_id===sel.id).map(t=><div key={t.id} className="tr"><div className={`tc ${t.done?"done":""}`} onClick={()=>tog(t)}>✓</div><div className={`tt ${t.done?"done":""}`}>{t.title}</div></div>)}
          <div style={{display:"flex",gap:8,marginTop:10}}><input className="fi" placeholder="Add task + Enter" value={nt} onChange={e=>setNt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/><button className="btn bg bs" onClick={add}>Add</button></div>
        </div>)}
      </div>)}
    </main>
  </div>);
}

// ── Owner Shell ───────────────────────────────────────────
function OwnShell({user,clients,setClients,projects,setProjects,tasks,setTasks,employees,setEmployees,onLogout}){
  const[tab,setTab]=useState("dashboard");
  const nav=[{id:"dashboard",icon:"⚡",label:"Dashboard"},{id:"projects",icon:"🎯",label:"Projects"},{id:"clients",icon:"👥",label:"Clients"},{id:"team",icon:"🧑‍💼",label:"Team"},{id:"invoices",icon:"💰",label:"Invoices"},{id:"ai",icon:"✨",label:"AI Assistant"}];
  return(<div className="app">
    <aside className="sidebar">
      <div className="logo">AGENCY<em>OS</em></div>
      {nav.map(n=><button key={n.id} className={`nav-btn ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}><span style={{fontSize:14,width:20,textAlign:"center"}}>{n.icon}</span>{n.label}</button>)}
      <div className="user-pill"><div style={{width:7,height:7,borderRadius:"50%",background:"var(--gold)",flexShrink:0}}/><div style={{flex:1,minWidth:0}}><div className="user-name">Owner 👑</div><div className="user-role">Full access</div></div><button className="btn bg bs" onClick={onLogout} style={{fontSize:10,padding:"3px 7px"}}>Out</button></div>
    </aside>
    <main className="main">
      {tab==="dashboard"&&<OwnDash clients={clients} projects={projects} tasks={tasks} employees={employees}/>}
      {tab==="projects"&&<OwnProjects clients={clients} projects={projects} setProjects={setProjects} tasks={tasks} setTasks={setTasks} employees={employees}/>}
      {tab==="clients"&&<OwnClients clients={clients} setClients={setClients} projects={projects}/>}
      {tab==="team"&&<OwnTeam employees={employees} setEmployees={setEmployees}/>}
      {tab==="invoices"&&<OwnInvoices clients={clients} projects={projects}/>}
      {tab==="ai"&&<OwnAI clients={clients} projects={projects} tasks={tasks} employees={employees}/>}
    </main>
  </div>);
}

// ── Root ──────────────────────────────────────────────────
export default function App(){
  const[session,setSession]=useState(null);const[profile,setProfile]=useState(null);const[appLoading,setAppLoading]=useState(false);
  const[clients,setClients]=useState([]);const[projects,setProjects]=useState([]);const[tasks,setTasks]=useState([]);const[employees,setEmployees]=useState([]);

  useEffect(()=>{
    console.log("APP STARTED");
    supabase.auth.getSession().then(async ({ data:{session}, error }) => {

  console.log("SESSION:", session, error);

  setSession(session);

  if(session){
    await loadProfile(session.user.id);
  }

  setAppLoading(false);

});
    const{data:{subscription}}=supabase.auth.onAuthStateChange(async(event,session)=>{setSession(session);if(session)await loadProfile(session.user.id);else{setProfile(null);}});
    return()=>subscription.unsubscribe();
  },[]);

  const loadProfile = async (uid) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();

    console.log("PROFILE:", data, error);

    if (error) {
      setProfile(null);
      return;
    }

    setProfile(data);
  } catch (e) {
    console.log("LOAD PROFILE ERROR:", e);
    setProfile(null);
  }
};

  const loadAll=async()=>{
    const[c,p,t,e]=await Promise.all([
      supabase.from("clients").select("*").order("name"),
      supabase.from("projects").select("*").order("deadline"),
      supabase.from("tasks").select("*"),
      supabase.from("profiles").select("*").eq("is_owner",false).eq("active",true),
    ]);
    setClients(c.data||[]);setProjects(p.data||[]);setTasks(t.data||[]);setEmployees(e.data||[]);
  };

  const logout=async()=>{await supabase.auth.signOut();setSession(null);setProfile(null);};

  if(appLoading)return(<><style>{css}</style><div className="loading-screen"><div className="ll">AGENCY<em>OS</em></div><div className="spinner"/></div></>);

  return(<><style>{css}</style>
    {!session&&<LoginScreen/>}
    {session&&profile?.is_owner&&<OwnShell user={profile} clients={clients} setClients={setClients} projects={projects} setProjects={setProjects} tasks={tasks} setTasks={setTasks} employees={employees} setEmployees={setEmployees} onLogout={logout}/>}
    {session&&profile&&!profile.is_owner&&<EmpView user={profile} clients={clients} projects={projects} tasks={tasks} setTasks={setTasks} employees={employees} onLogout={logout}/>}
  </>);
}
