import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Users, Mail, KeyRound, CheckCircle2, Sparkles, Building2, Network, Hash, FileText, DollarSign, Factory, ClipboardList, Bell, Link2, Database, ChevronLeft, ChevronRight, MessageSquare, Paperclip, Send, X } from "lucide-react";

/**
 * ERP Entry Orchestrator v0.5 (Auth → FSW → App Shell)
 * One-file demo that wires the full entry flow: Auth Gateway → First-Run Setup Wizard (FSW) → App Shell (per role).
 * Use this when running the UI in isolation (no router). It persists handoff via localStorage.
 *
 * Keys:
 *  - ROUTE_KEY: "erp_route_next_v1" – { roleLevel, employment, screenId }
 *  - DONE_KEY(tag): "erp_fsw_done_<tag>" – FSW completion flag per role tag (ceo|r1..r5|t0)
 */

// -------------------- Shared helpers & constants --------------------
const ROUTE_KEY = "erp_route_next_v1";
const DONE_KEY = (tag) => `erp_fsw_done_${tag}`;
const INVITE_TTL_HOURS = 72;
const RECENT_MS = 120_000;

function roleTag(roleLevel, employment) {
  if (["probation", "intern", "external"].includes(employment || "")) return "t0";
  return roleLevel === 0 ? "ceo" : `r${roleLevel}`;
}
function routeLabel(roleLevel, employment) {
  if (["probation", "intern", "external"].includes(employment || "")) return "UI T0 – Temp";
  return roleLevel === 0 ? "UI 00 – CEO" : roleLevel === 1 ? "UI 10 – Exec" : `UI ${roleLevel}0`;
}

// ====================================================================
//  A) AUTH GATEWAY (MINI)
// ====================================================================
function AuthMini({ onNext }) {
  const [email, setEmail] = useState("ceo@example.com");
  const [pwd, setPwd] = useState("");
  const [roleLevel, setRoleLevel] = useState(0);
  const [employment, setEmployment] = useState("employee");

  function signIn() {
    if (!email || !pwd) return alert("Nhập email & mật khẩu");
    const tag = roleTag(roleLevel, employment);
    const done = localStorage.getItem(DONE_KEY(tag));
    if (!done) {
      onNext({ view: "fsw", roleLevel, employment });
      return;
    }
    localStorage.setItem(ROUTE_KEY, JSON.stringify({ roleLevel, employment, screenId: routeLabel(roleLevel, employment) }));
    onNext({ view: "app", roleLevel, employment });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50 text-neutral-900">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2"><Home className="h-5 w-5"/><span className="text-sm font-semibold">Auth Gateway · v0.5</span></div>
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Mật khẩu</label>
            <input type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Role</label>
              <select value={roleLevel} onChange={(e)=>setRoleLevel(Number(e.target.value))} className="w-full rounded-xl border px-3 py-2">
                {[0,1,2,3,4,5].map(r=> <option key={r} value={r}>{r===0?"CEO":r===1?"Exec":`r${r}`}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Employment</label>
              <select value={employment} onChange={(e)=>setEmployment(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                <option value="employee">Employee</option>
                <option value="probation">Probation</option>
                <option value="intern">Intern</option>
                <option value="external">External</option>
              </select>
            </div>
          </div>
          <button onClick={signIn} className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-black inline-flex items-center justify-center gap-2"><KeyRound className="h-4 w-4"/>Đăng nhập</button>
          <div className="text-xs text-neutral-500">Nếu role này chưa chạy FSW → sẽ mở Wizard. Nếu đã chạy → vào App Shell.</div>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
//  B) FSW (COMPACT, DETAILED FIELDS)
// ====================================================================
function Pill({ children, className = "" }) { return <span className={`inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>; }
function Section({ title, icon: Icon, children }) { return (
  <div className="rounded-2xl border border-neutral-200 p-3">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">{Icon && <Icon className="h-4 w-4"/>}{title}</div>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
); }

function FSWCompact({ roleLevel, employment, onCommit }) {
  const [state, setState] = useState({
    company: { name: "Đại Tín Holdings", code: "DTH", taxId: "0312345678" },
    fiscal: { fyStart: "2025-01-01", currency: "VND", fxSource: "SBV" },
    coa: { preset: "VNSME", accounts: [{ code: "111", name: "Tiền mặt" }, { code: "112", name: "Tiền gửi NH" }] },
    tax: { vatRates: [0,5,8,10], defaultVat: 10, invoiceMask: "INV-{yyyy}-{seq5}" },
    procurement: { categories: ["IT","Marketing"], vendorClasses: ["A","B"], paymentTerms: "Net 30" },
    budget: { cycle: "Quarterly", costCenters: [{ id: "cc-hr", name: "HR" }] },
    org: { companies: [{ id: "co1", label: "Đại Tín Co. Ltd" }], depts: [{ id: "hr", label: "Nhân sự" }, { id: "fin", label: "Tài chính" }] },
    thresholds: { director_single: 200_000_000, director_monthly: 1_000_000_000, exec_single: 1_000_000_000, exec_monthly: 5_000_000_000 },
    sso: { provider: "Google", roleClaim: "custom:role", mappings: [{ claimValue: "CEO", role: 0 }] },
    datagov: { dlp: "strict", retentionDays: 365, auditLog: true },
    temp: { acceptedTerms: false, mfa: false, projectScope: "project:p1" },
  });
  const setField = (path, value) => setState((s)=>{ const clone={...s}; const ks=path.split('.'); let cur=clone; for(let i=0;i<ks.length-1;i++){ cur[ks[i]]={...(cur[ks[i]]||{})}; cur=cur[ks[i]];} cur[ks.at(-1)] = value; return clone; });

  function handleCommit(){
    localStorage.setItem(DONE_KEY(roleTag(roleLevel, employment)), "true");
    localStorage.setItem(ROUTE_KEY, JSON.stringify({ roleLevel, employment, screenId: routeLabel(roleLevel, employment) }));
    onCommit?.();
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1100px] px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5"/><span className="text-sm font-semibold">FSW · v0.5</span><Pill>{routeLabel(roleLevel, employment)}</Pill></div>
            <Pill>Invite TTL {INVITE_TTL_HOURS}h</Pill>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-6 grid gap-6 md:grid-cols-[320px,1fr]">
        {/* Left: steps (simplified) */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          {(["Company & Legal","Fiscal & Currency","COA","Tax/Numbering","Procurement","Budget & CC","Org Skeleton","Thresholds","SSO","Data Governance","Summary"]).map((t,i)=> (
            <div key={i} className="text-sm py-1">{i+1}. {t}</div>
          ))}
        </div>

        {/* Right: content */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-4">
          <Section title="Company & Legal" icon={Building2}>
            <div className="grid md:grid-cols-3 gap-3">
              <div><label className="block text-xs text-neutral-500 mb-1">Tên</label><input value={state.company.name} onChange={(e)=>setField("company.name", e.target.value)} className="w-full rounded-xl border px-3 py-2"/></div>
              <div><label className="block text-xs text-neutral-500 mb-1">Mã</label><input value={state.company.code} onChange={(e)=>setField("company.code", e.target.value)} className="w-full rounded-xl border px-3 py-2"/></div>
              <div><label className="block text-xs text-neutral-500 mb-1">MST</label><input value={state.company.taxId} onChange={(e)=>setField("company.taxId", e.target.value)} className="w-full rounded-xl border px-3 py-2"/></div>
            </div>
          </Section>

          <Section title="Fiscal & Currency" icon={DollarSign}>
            <div className="grid md:grid-cols-3 gap-3">
              <div><label className="block text-xs text-neutral-500 mb-1">FY start</label><input type="date" value={state.fiscal.fyStart} onChange={(e)=>setField("fiscal.fyStart", e.target.value)} className="w-full rounded-xl border px-3 py-2"/></div>
              <div><label className="block text-xs text-neutral-500 mb-1">Currency</label><input value={state.fiscal.currency} onChange={(e)=>setField("fiscal.currency", e.target.value)} className="w-full rounded-xl border px-3 py-2"/></div>
              <div><label className="block text-xs text-neutral-500 mb-1">FX source</label><select value={state.fiscal.fxSource} onChange={(e)=>setField("fiscal.fxSource", e.target.value)} className="w-full rounded-xl border px-3 py-2"><option>SBV</option><option>ECB</option><option>Manual</option></select></div>
            </div>
          </Section>

          <Section title="Chart of Accounts" icon={Hash}>
            <div className="text-xs">Preset: {state.coa.preset} · {state.coa.accounts.length} tài khoản</div>
          </Section>

          <Section title="Tax & Numbering" icon={FileText}>
            <div className="grid md:grid-cols-3 gap-3">
              <div><label className="block text-xs text-neutral-500 mb-1">VAT mặc định</label><input type="number" value={state.tax.defaultVat} onChange={(e)=>setField("tax.defaultVat", Number(e.target.value))} className="w-full rounded-xl border px-3 py-2"/></div>
              <div className="md:col-span-2"><label className="block text-xs text-neutral-500 mb-1">Mask hóa đơn</label><input value={state.tax.invoiceMask} onChange={(e)=>setField("tax.invoiceMask", e.target.value)} className="w-full rounded-xl border px-3 py-2"/></div>
            </div>
          </Section>

          <Section title="Procurement & Vendors" icon={Factory}>
            <div className="text-xs">Danh mục: {state.procurement.categories.join(', ')} · Hạng NCC: {state.procurement.vendorClasses.join(', ')} · Terms: {state.procurement.paymentTerms}</div>
          </Section>

          <Section title="Budget & Cost Centers" icon={ClipboardList}>
            <div className="text-xs">Chu kỳ: {state.budget.cycle} · CC: {state.budget.costCenters.length}</div>
          </Section>

          <Section title="Org Skeleton" icon={Network}>
            <div className="text-xs">{state.org.companies.length} công ty · {state.org.depts.length} phòng ban</div>
          </Section>

          <Section title="Approval Thresholds" icon={DollarSign}>
            <div className="text-xs">Dir {state.thresholds.director_single.toLocaleString()} / {state.thresholds.director_monthly.toLocaleString()} · Exec {state.thresholds.exec_single.toLocaleString()} / {state.thresholds.exec_monthly.toLocaleString()}</div>
          </Section>

          <Section title="SSO & Role Mapping" icon={Link2}>
            <div className="text-xs">Provider: {state.sso.provider} · claim {state.sso.roleClaim} · {state.sso.mappings.length} mapping(s)</div>
          </Section>

          <Section title="Data Governance" icon={Database}>
            <div className="text-xs">DLP {state.datagov.dlp} · Retention {state.datagov.retentionDays}d · Audit {String(state.datagov.auditLog)}</div>
          </Section>

          {/* Summary / Commit */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-500">Commit sẽ set DONE_KEY & ROUTE_KEY rồi vào App Shell.</div>
            <button onClick={handleCommit} className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-black">Commit & Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
//  C) APP SHELL (MINI + PA2)
// ====================================================================
function ChatBody({ messages }) {
  return (
    <div className="space-y-2">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
          <div className={`${m.from === "you" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-900"} max-w-[80%] rounded-2xl px-3 py-2 text-sm`}>{m.text}</div>
        </div>
      ))}
    </div>
  );
}
function ChatInput({ onSend, onUpload }) {
  const [input, setInput] = useState("");
  return (
    <div className="flex items-center gap-2">
      {onUpload && (
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          <Paperclip className="h-4 w-4" />
          <span>Tệp</span>
          <input type="file" className="hidden" multiple onChange={onUpload} />
        </label>
      )}
      <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); const v=input.trim(); if(v) onSend(v); setInput(""); } }} placeholder="Nhập để chat… (Enter để gửi)" className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" />
      <button onClick={()=>{ const v=input.trim(); if(v) onSend(v); setInput(""); }} className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-black"><Send className="h-4 w-4"/>Gửi</button>
    </div>
  );
}
function AppShellMini({ roleLevel, employment, screenId }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [lastCellTs, setLastCellTs] = useState(0);
  const isTemp = ["probation","intern","external"].includes(employment);
  const tag = roleTag(roleLevel, employment);
  const STORAGE_KEY = `erp_shell_chatStore_${tag}`;
  const [store, setStore] = useState({});
  useEffect(()=>{ try{ const raw=localStorage.getItem(STORAGE_KEY); if(raw){ const p=JSON.parse(raw); if(p) setStore(p);} }catch{} },[]);
  useEffect(()=>{ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }catch{} },[store]);
  const threadIdCell = (co, dp) => `thread:cell:${co}:${dp}:${tag}`;
  const threadIdGlobal = () => `thread:global:${tag}`;
  const chooseThread = () => {
    if (isTemp) return selected ? { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id) } : { scope: "mywork", id: "thread:mywork:temp" };
    const recent = !!(selected && lastCellTs && Date.now() - lastCellTs < RECENT_MS);
    if (roleLevel <= 1) return recent && selected ? { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id) } : { scope: "global", id: threadIdGlobal() };
    return selected ? { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id) } : { scope: "global", id: threadIdGlobal() };
  };
  const routing = chooseThread();
  const messages = store[routing.id] || [];
  const scopeLabel = routing.scope === "cell" && selected ? `${selected.company.label} · ${selected.dept.label}` : (routing.scope === "mywork" ? "My Work" : "Toàn hệ thống");
  function appendMessage(id, text, from="you"){ setStore((s)=>{ const prev=s[id]||[]; return { ...s, [id]: [...prev, { from, text }] }; }); }

  return (
    <div className="h-screen w-full bg-neutral-50 text-neutral-900">
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-black px-3 py-1.5 text-white"><Home className="h-4 w-4"/><span className="text-sm font-semibold">ERP</span></div>
              <Pill>{screenId}</Pill>
              <Pill>{roleLevel===0?"CEO":roleLevel===1?"Exec":`r${roleLevel}`}{isTemp && " · Temp"}</Pill>
            </div>
            <div className="flex items-center gap-2"><Bell className="h-4 w-4"/><Users className="h-4 w-4"/></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-4 grid grid-cols-[280px,1fr,320px] gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-sm font-semibold mb-2">Điều hướng</div>
          <div className="grid gap-2">
            {["Tổng quan","Ma trận","Phê duyệt"].map(l => (
              <button key={l} className="rounded-xl px-3 py-2 text-left text-sm hover:bg-neutral-100">{l}</button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 min-h-[420px]">
          <div className="text-sm">(Màn hình theo role sẽ render ở đây) · Chọn một công ty để bật scope Cell:</div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            {[{ id:"co1",label:"Đại Tín Co. Ltd" },{ id:"co2",label:"Đại Tín Invest" },{ id:"co3",label:"Đại Tín Services" }].map(c => (
              <button key={c.id} className="rounded-xl border px-2 py-2 hover:bg-neutral-50" onClick={()=>{ setSelected({ company:{ id:c.id, label:c.label }, dept:{ id:"hr", label:"Nhân sự" } }); setLastCellTs(Date.now()); }}>
                {c.label}
                <div className="text-[10px] text-neutral-500">Dept: Nhân sự</div>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
          <div>Scope: <b>{routing.scope}</b></div>
          <div className="break-all">Thread: <b>{routing.id}</b></div>
        </div>
      </div>

      {/* Floating chat */}
      <button onClick={()=>setChatOpen(true)} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-white shadow-lg hover:bg-black"><MessageSquare className="h-5 w-5"/><span className="text-sm font-medium">Chat</span></button>
      <AnimatePresence>
        {chatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white p-4 shadow-xl">
              <div className="mb-2 flex items-center justify-between"><div className="text-sm font-semibold">Chat – {scopeLabel}</div><button onClick={()=>setChatOpen(false)} className="rounded-full p-1 hover:bg-neutral-100"><X className="h-4 w-4"/></button></div>
              <div className="mb-2 max-h-80 flex-1 overflow-auto rounded-xl border border-neutral-200 bg-white p-3"><ChatBody messages={messages}/></div>
              <ChatInput onSend={(text)=>{ appendMessage(routing.id, text, "you"); appendMessage(routing.id, "Đã nhận yêu cầu. (Demo)", "assistant"); }} onUpload={(e)=>{ const list=Array.from(e.target.files||[]); if(!list.length) return; appendMessage(routing.id, `Tải lên ${list.length} tệp: ${list.map(x=>x.name).join(', ')}`, 'you'); }} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ====================================================================
//  D) ORCHESTRATOR (default export)
// ====================================================================
export default function ERPEntryOrchestratorV05() {
  const [view, setView] = useState("auth");
  const [session, setSession] = useState({ roleLevel: 0, employment: "employee" });

  // If ROUTE_KEY already exists (e.g., returning user), skip auth for demo
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ROUTE_KEY);
      if (raw) {
        const cfg = JSON.parse(raw);
        if (cfg?.roleLevel !== undefined) {
          setSession({ roleLevel: cfg.roleLevel, employment: cfg.employment || "employee" });
          setView("app");
        }
      }
    } catch {}
  }, []);

  if (view === "fsw") {
    return (
      <FSWCompact
        roleLevel={session.roleLevel}
        employment={session.employment}
        onCommit={() => {
          try {
            const raw = localStorage.getItem(ROUTE_KEY);
            const cfg = raw ? JSON.parse(raw) : { roleLevel: session.roleLevel, employment: session.employment, screenId: routeLabel(session.roleLevel, session.employment) };
            setSession({ roleLevel: cfg.roleLevel, employment: cfg.employment || session.employment });
          } catch {}
          setView("app");
        }}
      />
    );
  }

  if (view === "app") {
    const raw = localStorage.getItem(ROUTE_KEY);
    const cfg = raw ? JSON.parse(raw) : { roleLevel: session.roleLevel, employment: session.employment, screenId: routeLabel(session.roleLevel, session.employment) };
    return <AppShellMini roleLevel={cfg.roleLevel} employment={cfg.employment} screenId={cfg.screenId} />;
  }

  return <AuthMini onNext={({ view, roleLevel, employment }) => { setSession({ roleLevel, employment }); setView(view); }} />;
}
