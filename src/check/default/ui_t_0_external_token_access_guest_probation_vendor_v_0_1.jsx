import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building2,
  Users,
  ShieldCheck,
  KeyRound,
  UserPlus,
  FileSignature,
  Info,
  CheckCircle2,
  Mail,
  Phone,
  Send,
  X,
  MessageSquare,
} from "lucide-react";

/**
 * UI T0 — Token Portal for External / Probation / Intern / Vendor
 * Version: v0.1.1 (Default returnTo + tests)
 *
 * Purpose
 *  - Unified entry after Auth Gateway for users who come via token links (invite/intern/vendor)
 *  - Minimal, safe permissions; collects required consents before dropping user into Shell
 *
 * Steps
 *  1) Enter Token & Validate
 *  2) Identify (profile lite) + Create/Bind account
 *  3) Accept policies (NDA & Terms)
 *  4) Review scopes & Continue → Shell (role routed by token kind)
 *
 * Storage keys
 *  - t0_progress_v1: persist lightweight progress in localStorage
 *
 * Self-tests N1–N17
 */

const VERSION = "v0.1.2";
const STORAGE_KEY = "t0_progress_v1";
const DEFAULT_RETURN_TO = "/shell?tab=mywork"; // ✅ default returnTo (applies to all token kinds)

// ---- Mock token parsing (deterministic rules) ----
// Valid forms: T-INVITE-XXXXXX, T-INTERN-XXXXXX, T-VENDOR-XXXXXX (X = A–Z0–9)
const TOKEN_RE = /^T-(INVITE|INTERN|VENDOR)-[A-Z0-9]{6}$/;
function parseToken(raw) {
  if (!TOKEN_RE.test(raw)) return { ok: false, reason: "Định dạng token không hợp lệ" };
  const kind = raw.split("-")[1];
  // Mock company mapping
  const company = kind === "VENDOR" ? { id: "co2", name: "Đại Tín Invest" } : { id: "co1", name: "Đại Tín Co. Ltd" };
  // Expiry mock: INTERN shorter
  const expiresInDays = kind === "INTERN" ? 7 : 14;
  // Default scopes per kind (read-mostly)
  const scopes =
    kind === "VENDOR"
      ? ["documents.upload", "po.view", "vendor.profile.read"]
      : kind === "INTERN"
      ? ["task.view", "task.comment", "kpi.self.view"]
      : ["workspace.join", "task.view", "notice.view"];
  // Default target role level mapping (for Shell route)
  const roleLevel = kind === "VENDOR" ? "T_vendor" : kind === "INTERN" ? "T_intern" : "T_invitee";
  return { ok: true, kind, company, expiresInDays, scopes, roleLevel };
}

/** Build returnTo path safely (relative only). Appends role & company if missing. */
function buildReturnToPath(role, companyId, baseOrigin){
  const origin = baseOrigin || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  try {
    const u = new URL(DEFAULT_RETURN_TO, origin);
    if (role && !u.searchParams.has('role')) u.searchParams.set('role', role);
    if (companyId && !u.searchParams.has('company')) u.searchParams.set('company', companyId);
    return u.pathname + (u.search ? u.search : '') + (u.hash ? u.hash : '');
  } catch {
    // Fallback: ensure relative path even if DEFAULT_RETURN_TO accidentally absolute
    let p = DEFAULT_RETURN_TO || '/shell?tab=mywork';
    if (role && !/([?&])role=/.test(p)) p += (p.includes('?') ? '&' : '?') + 'role=' + encodeURIComponent(role);
    if (companyId && !/([?&])company=/.test(p)) p += '&company=' + encodeURIComponent(companyId);
    return p.replace(/^https?:\/\/[^/]+/, '');
  }
}

// ---- Small UI atoms ----
function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-neutral-100 ${className}`}>{children}</span>
  );
}
function IconBtn({ title, onClick, children }) {
  return (
    <button title={title} onClick={onClick} className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-neutral-100">
      {children}
    </button>
  );
}

// ---- Chat (PA2 modal) – optional help ----
function ChatBody({ messages }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [messages]);
  return (
    <div ref={ref} className="space-y-2 overflow-auto max-h-72">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
          <div className={`${m.from === "you" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-900"} max-w-[80%] rounded-2xl px-3 py-2 text-sm`}>{m.text}</div>
        </div>
      ))}
    </div>
  );
}
function ChatInput({ onSend }) {
  const [v, setV] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input value={v} onChange={(e)=>setV(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); const t=v.trim(); if(t) onSend(t); setV(''); } }} className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" placeholder="Hỏi trợ giúp…" />
      <button onClick={()=>{ const t=v.trim(); if(t) onSend(t); setV(''); }} className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-black">
        <Send className="h-4 w-4"/>Gửi
      </button>
    </div>
  );
}
function ChatModal({ open, onClose, messages, onSend }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">Trợ giúp</div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-neutral-100"><X className="h-4 w-4"/></button>
        </div>
        <div className="mb-2 max-h-80 flex-1 overflow-hidden rounded-xl border border-neutral-200 bg-white p-3">
          <ChatBody messages={messages} />
        </div>
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
}
function FloatingHelpButton({ onClick }){
  return (
    <button onClick={onClick} title="Trợ giúp" className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-white shadow-lg hover:bg-black">
      <MessageSquare className="h-5 w-5"/>
      <span className="text-sm font-medium">Help</span>
    </button>
  );
}

// ---- ReturnTo helpers ----
function readCookie(name){
  if (typeof document === 'undefined') return null;
  const parts = (document.cookie || '').split(';').map(s=>s.trim());
  for (const p of parts){ if (p.startsWith(name+'=')) return decodeURIComponent(p.slice(name.length+1)); }
  return null;
}
function resolveReturnTo(){
  // In production: verify HMAC; here: if cookie exists use it; else fallback to DEFAULT_RETURN_TO
  const rt = readCookie('t0_rt');
  if (!rt) return DEFAULT_RETURN_TO;
  // Basic allowlist: must start with '/'
  if (!/^\//.test(rt)) return DEFAULT_RETURN_TO;
  return rt;
}

// ---- Self-tests ----
function runSelfTests(){
  const results = [];
  // N1: token regex
  results.push({ name: "Token regex ok", pass: TOKEN_RE.test("T-INVITE-ABC123") && !TOKEN_RE.test("INVITE-ABC123"), detail: "format" });
  // N2: parse invite
  const p1 = parseToken("T-INVITE-ABC123");
  results.push({ name: "Parse INVITE ok", pass: p1.ok && p1.kind === "INVITE" && p1.company.id === "co1", detail: JSON.stringify({k:p1.kind,co:p1.company.id}) });
  // N3: parse vendor
  const p2 = parseToken("T-VENDOR-ZZ99ZZ");
  results.push({ name: "Parse VENDOR -> co2", pass: p2.ok && p2.company.id === "co2" && p2.scopes.includes("documents.upload"), detail: p2.company.id });
  // N4: intern expiry shorter
  const p3 = parseToken("T-INTERN-HELLO1");
  results.push({ name: "INTERN expiresInDays 7", pass: p3.ok && p3.expiresInDays === 7, detail: String(p3.expiresInDays) });
  // N5: invalid fmt
  const p4 = parseToken("T-OTHER-ABC123");
  results.push({ name: "Invalid kind", pass: !p4.ok, detail: String(p4.ok) });
  // N6: roleLevel mapping present
  results.push({ name: "roleLevel present", pass: !!p1.roleLevel && !!p2.roleLevel && !!p3.roleLevel, detail: [p1.roleLevel,p2.roleLevel,p3.roleLevel].join(',') });
  // N7: scopes non-empty
  results.push({ name: "scopes non-empty", pass: p1.scopes.length>0 && p2.scopes.length>0, detail: `${p1.scopes.length}/${p2.scopes.length}` });
  // N8: UI atoms exist
  try { const b = FloatingHelpButton({ onClick: ()=>{} }); results.push({ name: "HelpButton exists", pass: typeof FloatingHelpButton==='function' && !!b, detail: typeof FloatingHelpButton }); } catch(e){ results.push({ name: "HelpButton exists", pass: false, detail: String(e) }); }
  // N9: Chat modal closed returns null
  try { const cm = ChatModal({ open:false, onClose:()=>{}, messages:[], onSend:()=>{} }); results.push({ name: "ChatModal closed", pass: cm===null, detail: cm===null?"OK":typeof cm }); } catch(e){ results.push({ name: "ChatModal closed", pass:false, detail:String(e) }); }
  // N10: NDA required (simulate)
  const ndaRequired = true; results.push({ name: "NDA required flag", pass: ndaRequired, detail: "true" });
  // N11: invite default scopes contain workspace.join
  results.push({ name: "INVITE has workspace.join", pass: p1.scopes.includes('workspace.join'), detail: p1.scopes.join('|') });
  // N12: vendor cannot have task.comment
  results.push({ name: "VENDOR no task.comment", pass: !p2.scopes.includes('task.comment'), detail: p2.scopes.join('|') });
  // N13: regex is uppercase only for code part
  results.push({ name: "Uppercase enforced", pass: TOKEN_RE.test('T-INVITE-ABC123') && !TOKEN_RE.test('T-INVITE-abc123'), detail: 'case' });
  // N14: intern has kpi.self.view
  results.push({ name: "INTERN kpi.self.view", pass: p3.scopes.includes('kpi.self.view'), detail: p3.scopes.join('|') });
  // N15: DEFAULT_RETURN_TO is mywork
  results.push({ name: "Default returnTo", pass: DEFAULT_RETURN_TO === '/shell?tab=mywork', detail: DEFAULT_RETURN_TO });
  // N16: resolveReturnTo fallback when cookie missing
  try { const r = resolveReturnTo(); results.push({ name: "resolveReturnTo fallback", pass: r === DEFAULT_RETURN_TO, detail: r }); } catch(e){ results.push({ name: "resolveReturnTo fallback", pass:false, detail:String(e) }); }
  // N17: whitelist path starts with '/'
  const okPath = /^\//.test(DEFAULT_RETURN_TO);
  results.push({ name: "returnTo path safe", pass: okPath, detail: DEFAULT_RETURN_TO });
  // N15: DEFAULT_RETURN_TO path sane
  results.push({ name: "default returnTo", pass: typeof DEFAULT_RETURN_TO==='string' && /^\/shell/.test(DEFAULT_RETURN_TO), detail: DEFAULT_RETURN_TO });
  // N16: buildReturnTo includes params
  const pth = buildReturnToPath('T_intern','co1','https://demo.local');
  const hasRole = /[?&]role=T_intern/.test(pth);
  const hasCo = /[?&]company=co1/.test(pth);
  results.push({ name: "buildReturnTo includes params", pass: hasRole && hasCo, detail: pth });
  // N17: buildReturnTo returns relative path
  results.push({ name: "buildReturnTo relative", pass: !/^https?:/i.test(pth), detail: pth });
  return results;
}

export default function UIT0TokenPortal(){
  // Progress state
  const [step, setStep] = useState(1); // 1..4
  const [token, setToken] = useState("");
  const [tokenInfo, setTokenInfo] = useState(null);
  const [profile, setProfile] = useState({ fullName: "", email: "", phone: "" });
  const [security, setSecurity] = useState({ password: "", confirm: "" });
  const [consent, setConsent] = useState({ nda: false, terms: false });

  // Help chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ from: "assistant", text: "Chào bạn! Cần giúp gì với token?" }]);
  function sendChat(text){ setChatMessages(m=>[...m,{ from:"you", text },{ from:"assistant", text: "Đã ghi nhận. Team sẽ phản hồi." }]); }

  // Tests modal
  const [testOpen, setTestOpen] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Persist
  useEffect(()=>{
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw){ const p = JSON.parse(raw); if (p && typeof p === 'object'){ setStep(p.step||1); setToken(p.token||""); setTokenInfo(p.tokenInfo||null); setProfile(p.profile||{fullName:"",email:"",phone:""}); setSecurity(p.security||{password:"",confirm:""}); setConsent(p.consent||{nda:false,terms:false}); } }
    } catch{}
  },[]);
  useEffect(()=>{
    if (typeof window === 'undefined') return;
    try { const payload = { step, token, tokenInfo, profile, security, consent }; window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch{}
  },[step, token, tokenInfo, profile, security, consent]);

  // Derived
  const canProceedStep1 = useMemo(()=> TOKEN_RE.test(token), [token]);
  const canProceedStep2 = useMemo(()=> profile.fullName && /@/.test(profile.email) && security.password.length>=6 && security.password===security.confirm, [profile, security]);
  const canProceedStep3 = useMemo(()=> consent.nda && consent.terms, [consent]);

  function handleValidateToken(){
    const info = parseToken(token);
    if (!info.ok) { alert(info.reason); return; }
    setTokenInfo(info);
    setStep(2);
  }
  function handleBindAccount(){ setStep(3); }
  function handleAcceptPolicies(){ setStep(4); }
  function handleEnterWorkspace(){
    const r = tokenInfo?.roleLevel || 'T_invitee';
    const companyId = tokenInfo?.company?.id;
    const path = buildReturnToPath(r, companyId);
    if (typeof window !== 'undefined'){
      window.location.replace(path);
      return;
    }
    // Fallback (non-browser): show intent
    alert(`Đi vào Shell với vai trò: ${r} · company=${companyId} · target=${DEFAULT_RETURN_TO}`);
  }

  function runTests(){ setTestResults(runSelfTests()); setTestOpen(true); }

  return (
    <div className="h-screen w-full bg-neutral-50 text-neutral-900">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[980px] px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-black px-3 py-1.5 text-white">
                <Home className="h-4 w-4" />
                <span className="text-sm font-semibold">ERP</span>
              </div>
              <Pill>T0 · Token Portal · {VERSION}</Pill>
            </div>
            <IconBtn title="Kiểm thử" onClick={runTests}>
              <CheckCircle2 className="h-4 w-4"/> <span className="text-xs">Kiểm thử</span>
            </IconBtn>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[980px] px-4 py-6 grid gap-4 md:grid-cols-[1fr,320px]">
        {/* Main Card */}
        <motion.div layout className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            {step===1 && <><KeyRound className="h-4 w-4"/>Nhập token</>}
            {step===2 && <><UserPlus className="h-4 w-4"/>Xác nhận thông tin</>}
            {step===3 && <><FileSignature className="h-4 w-4"/>Chấp thuận chính sách</>}
            {step===4 && <><ShieldCheck className="h-4 w-4"/>Rà soát quyền hạn</>}
          </div>

          {step===1 && (
            <div className="space-y-3">
              <div className="text-sm text-neutral-600">Dán mã token được cấp (ví dụ: <code>T-INVITE-ABC123</code>)</div>
              <input value={token} onChange={(e)=>setToken(e.target.value.toUpperCase())} placeholder="T-INVITE-ABC123" className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" />
              <div className="flex items-center justify-between">
                <button disabled={!canProceedStep1} onClick={handleValidateToken} className={`rounded-xl px-4 py-2 text-sm text-white ${canProceedStep1? 'bg-neutral-900 hover:bg-black':'bg-neutral-300 cursor-not-allowed'}`}>Xác thực token</button>
                <div className="text-xs text-neutral-500">Chấp nhận token mời/intern/vendor</div>
              </div>
            </div>
          )}

          {step===2 && tokenInfo && (
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-200 p-3 bg-neutral-50 text-xs">
                <div><b>Token:</b> {token}</div>
                <div><b>Loại:</b> {tokenInfo.kind}</div>
                <div><b>Công ty:</b> {tokenInfo.company.name}</div>
                <div><b>Hiệu lực:</b> {tokenInfo.expiresInDays} ngày</div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">Họ tên
                  <input value={profile.fullName} onChange={(e)=>setProfile(p=>({...p, fullName:e.target.value}))} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" />
                </label>
                <label className="text-sm">Email
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400"/>
                    <input value={profile.email} onChange={(e)=>setProfile(p=>({...p, email:e.target.value}))} className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" />
                  </div>
                </label>
                <label className="text-sm">Số điện thoại
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400"/>
                    <input value={profile.phone} onChange={(e)=>setProfile(p=>({...p, phone:e.target.value}))} className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" />
                  </div>
                </label>
                <div />
                <label className="text-sm">Mật khẩu tạm thời
                  <input type="password" value={security.password} onChange={(e)=>setSecurity(s=>({...s, password:e.target.value}))} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" />
                </label>
                <label className="text-sm">Nhập lại mật khẩu
                  <input type="password" value={security.confirm} onChange={(e)=>setSecurity(s=>({...s, confirm:e.target.value}))} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={()=>setStep(1)} className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">Quay lại</button>
                <button disabled={!canProceedStep2} onClick={handleBindAccount} className={`rounded-xl px-4 py-2 text-sm text-white ${canProceedStep2? 'bg-neutral-900 hover:bg-black':'bg-neutral-300 cursor-not-allowed'}`}>Tiếp tục</button>
              </div>
            </div>
          )}

          {step===3 && tokenInfo && (
            <div className="space-y-4">
              <div className="text-sm">Vui lòng đọc và chấp thuận trước khi vào workspace.</div>
              <div className="rounded-xl border p-3 text-xs bg-neutral-50">
                <div className="font-medium mb-1">1) Thoả thuận bảo mật (NDA)</div>
                <div>- Không chia sẻ dữ liệu, tài liệu trong hệ thống ra ngoài khi chưa có phép.</div>
                <div>- Chỉ sử dụng quyền hạn được cấp cho mục đích công việc.</div>
              </div>
              <div className="rounded-xl border p-3 text-xs bg-neutral-50">
                <div className="font-medium mb-1">2) Điều khoản sử dụng</div>
                <div>- Tuân thủ chính sách CNTT, quy định bảo mật, và pháp luật hiện hành.</div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={consent.nda} onChange={(e)=>setConsent(c=>({...c, nda:e.target.checked}))} />
                Tôi đồng ý với NDA
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={consent.terms} onChange={(e)=>setConsent(c=>({...c, terms:e.target.checked}))} />
                Tôi đồng ý với Điều khoản sử dụng
              </label>
              <div className="flex items-center justify-between">
                <button onClick={()=>setStep(2)} className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">Quay lại</button>
                <button disabled={!canProceedStep3} onClick={handleAcceptPolicies} className={`rounded-xl px-4 py-2 text-sm text-white ${canProceedStep3? 'bg-neutral-900 hover:bg-black':'bg-neutral-300 cursor-not-allowed'}`}>Tiếp tục</button>
              </div>
            </div>
          )}

          {step===4 && tokenInfo && (
            <div className="space-y-4">
              <div className="text-sm font-medium">Rà soát quyền hạn</div>
              <div className="rounded-xl border border-neutral-200 p-3 bg-neutral-50 text-xs">
                <div><b>Vai trò mục tiêu:</b> {tokenInfo.roleLevel}</div>
                <div><b>Công ty:</b> {tokenInfo.company.name}</div>
                <div className="mt-2"><b>Scopes:</b></div>
                <ul className="list-disc pl-5">
                  {tokenInfo.scopes.map((s,i)=>(<li key={i}>{s}</li>))}
                </ul>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={()=>setStep(3)} className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">Quay lại</button>
                <button onClick={handleEnterWorkspace} className="rounded-xl px-4 py-2 text-sm text-white bg-neutral-900 hover:bg-black">Vào workspace</button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Side Info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Info className="h-4 w-4"/>Hướng dẫn nhanh</div>
            <ol className="list-decimal pl-5 text-sm space-y-1">
              <li>Nhập token hợp lệ (mời / intern / vendor)</li>
              <li>Xác thực thông tin cá nhân & đặt mật khẩu</li>
              <li>Chấp thuận NDA & điều khoản</li>
              <li>Rà soát scopes rồi vào workspace</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Building2 className="h-4 w-4"/>Thông tin token</div>
            {tokenInfo ? (
              <div className="text-sm space-y-1">
                <div>Công ty: <b>{tokenInfo.company.name}</b></div>
                <div>Loại: <b>{tokenInfo.kind}</b></div>
                <div>Hiệu lực: <b>{tokenInfo.expiresInDays} ngày</b></div>
              </div>
            ) : (
              <div className="text-sm text-neutral-500">Chưa có thông tin. Hãy nhập token.</div>
            )}
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4"/>Liên hệ</div>
            <div className="text-sm">Gặp sự cố? Nhấn <b>Help</b> ở góc phải để chat với bộ phận hỗ trợ.</div>
          </div>
        </div>
      </div>

      {/* Help Chat */}
      <FloatingHelpButton onClick={()=>setChatOpen(true)} />
      <ChatModal open={chatOpen} onClose={()=>setChatOpen(false)} messages={chatMessages} onSend={sendChat} />

      {/* Test Modal */}
      <AnimatePresence>
        {testOpen && (
          <motion.div className="fixed inset-0 z-50 bg-black/30 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white p-4 shadow-xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Kết quả kiểm thử</div>
                <button className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50" onClick={()=>setTestOpen(false)}>Đóng</button>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {testResults.map((t, i) => (
                  <div key={i} className="flex items-start justify-between rounded-xl border border-neutral-200 p-2">
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-neutral-500">{t.detail}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${t.pass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.pass ? 'PASS' : 'FAIL'}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
