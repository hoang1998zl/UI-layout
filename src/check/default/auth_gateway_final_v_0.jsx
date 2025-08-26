import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  ScanLine,
  FileText,
  ClipboardList,
} from "lucide-react";

/**
 * Auth Gateway – Final v0.4 (All Roles)
 * Works as a pre-entry flow for all UI roles (UI 00/10/20/30/40/50/T0).
 * Features:
 *  - Email/Password or SSO mock; Invite Token capture/parse with TTL 72h.
 *  - MFA step (External required; others optional toggle).
 *  - Tenant selection (radio) when >1 tenants.
 *  - Terms/NDA gates for Probation/Intern/External (Temp users) – mandatory.
 *  - Role-based routing preview (no real navigation), consistent with Spec v0.4.
 *  - Self-tests: invite TTL, temp no-global routing, role mapping, MFA requirement, term gates.
 *  - Persists last identity in localStorage.
 */

// -------------------- Config & Helpers --------------------
const INVITE_TTL_HOURS = 72;
const STORAGE_KEY = "erp_auth_gateway_state_v1";

const ROLE_OPTIONS = [
  { id: 0, label: "CEO (0)" },
  { id: 1, label: "Executive (1)" },
  { id: 2, label: "Director (2)" },
  { id: 3, label: "Manager (3)" },
  { id: 4, label: "Lead (4)" },
  { id: 5, label: "Staff (5)" },
];

const EMPLOYMENT_OPTIONS = [
  { id: "employee", label: "Employee" },
  { id: "probation", label: "Probation (Temp)" },
  { id: "intern", label: "Intern (Temp)" },
  { id: "external", label: "External (Temp)" },
];

function isTemp(status) {
  return status === "probation" || status === "intern" || status === "external";
}

function mapRouteByRole(roleLevel, status) {
  if (isTemp(status)) return "UI T0 – Temp Landing";
  switch (roleLevel) {
    case 0: return "UI 00 – CEO";
    case 1: return "UI 10 – Exec";
    case 2: return "UI 20 – Director";
    case 3: return "UI 30 – Manager";
    case 4: return "UI 40 – Lead";
    case 5: return "UI 50 – Staff";
    default: return "UI 50 – Staff";
  }
}

function parseInviteToken(raw) {
  if (!raw) return { ok: false, reason: "No token" };
  try {
    // Support two demo formats:
    // 1) JSON string: { exp: <ms or ISO>, user_type:"external", scopes:["project:p1"], sponsor:"u123" }
    // 2) Query-ish: "exp=2025-12-31T23:59:59Z;user_type=external;scopes=project:p1"
    let obj;
    if (raw.trim().startsWith("{")) {
      obj = JSON.parse(raw);
    } else {
      obj = {};
      raw.split(/[;,&\n]/).forEach((kv) => {
        const [k, v] = kv.split(/=|:/);
        if (!k) return;
        obj[k.trim()] = (v || "").trim();
      });
    }
    let expMs = null;
    if (typeof obj.exp === "number") expMs = obj.exp;
    else if (typeof obj.exp === "string") expMs = Date.parse(obj.exp);
    if (!expMs || Number.isNaN(expMs)) return { ok: false, reason: "Bad exp" };
    const now = Date.now();
    const msLeft = expMs - now;
    return {
      ok: msLeft > 0,
      expMs,
      msLeft,
      user_type: obj.user_type || obj.typ || "",
      scopes: obj.scopes || obj.scope || [],
      sponsor: obj.sponsor || obj.sponsor_id || "",
    };
  } catch (e) {
    return { ok: false, reason: "Parse error" };
  }
}

function withinInviteTTL(createdAtMs, ttlHours = INVITE_TTL_HOURS) {
  const now = Date.now();
  return now - createdAtMs <= ttlHours * 3600 * 1000;
}

// -------------------- Self Tests --------------------
function runSelfTests(identity, inviteInfo) {
  const results = [];

  // T1: Invite TTL (simulate createdAt = now-1h)
  const createdAt = Date.now() - 3600 * 1000;
  const t1 = withinInviteTTL(createdAt, INVITE_TTL_HOURS) === true;
  results.push({ name: "Invite TTL <= 72h", pass: t1, detail: t1 ? "OK" : "TTL failed" });

  // T2: Temp users route to UI T0
  const routeTemp = mapRouteByRole(identity.roleLevel, "external");
  const t2 = routeTemp.startsWith("UI T0");
  results.push({ name: "Temp no Global (UI T0)", pass: t2, detail: routeTemp });

  // T3: Role mapping correctness
  const map = [0,1,2,3,4,5].map(r => mapRouteByRole(r, "employee"));
  const t3 = map[0].includes("UI 00") && map[1].includes("UI 10") && map[2].includes("UI 20") && map[3].includes("UI 30") && map[4].includes("UI 40") && map[5].includes("UI 50");
  results.push({ name: "Role→UI mapping", pass: t3, detail: map.join(" | ") });

  // T4: MFA required for External
  const t4 = (identity.employment_status === "external" ? identity.mfaRequired === true : true);
  results.push({ name: "MFA requirement", pass: t4, detail: identity.employment_status === "external" ? "External requires MFA" : "OK" });

  // T5: Terms gate (Temp must accept)
  const t5 = isTemp(identity.employment_status) ? !!identity.acceptedTerms : true;
  results.push({ name: "Terms/NDA gate", pass: t5, detail: isTemp(identity.employment_status) ? (identity.acceptedTerms ? "Accepted" : "Missing acceptance") : "Not required" });

  return results;
}

// -------------------- Main Component --------------------
export default function AuthGateway() {
  // Identity model (persisted for demo)
  const [identity, setIdentity] = useState({
    email: "ceo@example.com",
    roleLevel: 0, // 0..5
    employment_status: "employee", // employee | probation | intern | external
    tenantIds: ["grp"],
    selectedTenant: "grp",
    mfaRequired: false,
    acceptedTerms: false,
  });

  // Flow state
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [inviteRaw, setInviteRaw] = useState("");
  const inviteInfo = useMemo(() => parseInviteToken(inviteRaw), [inviteRaw]);
  const tenants = [
    { id: "grp", label: "Tập đoàn" },
    { id: "co1", label: "Đại Tín Co. Ltd" },
  ];

  // Restore persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setIdentity((s) => ({ ...s, ...parsed }));
        }
      }
    } catch (e) {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
    } catch (e) {}
  }, [identity]);

  // Derive flags
  const routeLabel = useMemo(() => mapRouteByRole(identity.roleLevel, identity.employment_status), [identity.roleLevel, identity.employment_status]);
  const showTerms = isTemp(identity.employment_status);
  const mfaMust = identity.employment_status === "external" || identity.mfaRequired;

  // Step control
  function next() { setStep((s) => Math.min(s + 1, 6)); }
  function prev() { setStep((s) => Math.max(s - 1, 0)); }

  // Handle events
  function handleSignIn() {
    // Mock password check
    if (!identity.email || (!password && step === 0)) return alert("Nhập email & mật khẩu");
    // External must have invite token to proceed (demo rule)
    if (identity.employment_status === "external" && !inviteInfo.ok) return alert("External cần Invite token hợp lệ");
    setStep(1); // proceed to MFA/SSO
  }

  function handleVerifyMFA() {
    if (mfaMust && (!mfaCode || mfaCode.length < 6)) return alert("Nhập mã MFA 6 số");
    setStep(2); // tenant selection
  }

  function handleTenantSelect(id) {
    setIdentity((s) => ({ ...s, selectedTenant: id }));
  }

  function canContinueTerms() {
    if (!showTerms) return true;
    return !!identity.acceptedTerms;
  }

  function handleEnterApp() {
    if (showTerms && !identity.acceptedTerms) return alert("Vui lòng chấp nhận Điều khoản/NDA");
    alert(`Đi tới ${routeLabel} (tenant: ${identity.selectedTenant || tenants[0].id})`);
  }

  // Self-tests modal
  const [testOpen, setTestOpen] = useState(false);
  const testResults = useMemo(() => runSelfTests(identity, inviteInfo), [identity, inviteInfo]);

  // Steps UI
  const steps = [
    { id: 0, title: "Đăng nhập", icon: Mail },
    { id: 1, title: "MFA", icon: ShieldCheck },
    { id: 2, title: "Chọn tenant", icon: Building2 },
    { id: 3, title: "Invite token", icon: ExternalLink },
    { id: 4, title: "Điều khoản/NDA", icon: FileText },
    { id: 5, title: "Xem tuyến & vào app", icon: ClipboardList },
  ];

  // Auto-skip: if not external, allow skipping invite; if one tenant, preselect.
  useEffect(() => {
    if (identity.employment_status !== "external" && step === 3) setStep(4);
  }, [identity.employment_status, step]);

  useEffect(() => {
    if (!identity.selectedTenant && tenants.length) {
      setIdentity((s) => ({ ...s, selectedTenant: tenants[0].id }));
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1100px] px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <ScanLine className="w-5 h-5" />
              <span className="text-sm font-semibold">Auth Gateway · v0.4</span>
            </div>
            <button onClick={() => setTestOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-xl hover:bg-neutral-50">
              <CheckCircle2 className="w-4 h-4" /> Kiểm thử
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1100px] px-4 py-6 grid grid-cols-1 md:grid-cols-[360px,1fr] gap-6">
        {/* Left: Identity Config (for demo) */}
        <div className="p-4 bg-white border rounded-2xl border-neutral-200">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold"><User className="w-4 h-4" />Cấu hình danh tính (demo)</div>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block mb-1 text-xs text-neutral-500">Email</label>
              <input value={identity.email} onChange={(e)=>setIdentity(s=>({...s,email:e.target.value}))} className="w-full px-3 py-2 border rounded-xl border-neutral-200" placeholder="you@company.com" />
            </div>
            <div>
              <label className="block mb-1 text-xs text-neutral-500">Mật khẩu</label>
              <div className="flex items-center gap-2">
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="flex-1 px-3 py-2 border rounded-xl border-neutral-200" placeholder="••••••" />
                <button onClick={handleSignIn} className="px-3 py-2 text-sm text-white rounded-xl bg-neutral-900 hover:bg-black"><KeyRound className="inline w-4 h-4 mr-1"/>Đăng nhập</button>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-xs text-neutral-500">Role</label>
              <select value={identity.roleLevel} onChange={(e)=>setIdentity(s=>({...s,roleLevel:Number(e.target.value)}))} className="w-full px-3 py-2 border rounded-xl border-neutral-200">
                {ROLE_OPTIONS.map(o=> <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs text-neutral-500">Employment status</label>
              <select value={identity.employment_status} onChange={(e)=>setIdentity(s=>({...s,employment_status:e.target.value}))} className="w-full px-3 py-2 border rounded-xl border-neutral-200">
                {EMPLOYMENT_OPTIONS.map(o=> <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={identity.mfaRequired} onChange={(e)=>setIdentity(s=>({...s,mfaRequired:e.target.checked}))} />
                Bật yêu cầu MFA (tự chọn; External luôn bắt buộc)
              </label>
            </div>
            <div>
              <label className="block mb-1 text-xs text-neutral-500">Tenant</label>
              <div className="space-y-2">
                {tenants.map(t => (
                  <label key={t.id} className="flex items-center gap-2">
                    <input type="radio" name="tenant" checked={(identity.selectedTenant||tenants[0].id)===t.id} onChange={()=>handleTenantSelect(t.id)} />
                    <span className="text-sm">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              Route dự kiến: <b>{routeLabel}</b>
            </div>
          </div>
        </div>

        {/* Right: Stepper */}
        <div className="p-4 bg-white border rounded-2xl border-neutral-200">
          {/* Step header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              {steps.map((s, idx) => (
                <div key={s.id} className={`flex items-center gap-2 ${idx>0?"ml-2":''}`}>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step===s.id?"bg-neutral-900 text-white":"bg-neutral-100 text-neutral-600"}`}>{idx+1}</div>
                  <span className={`${step===s.id?"text-neutral-900":"text-neutral-500"}`}>{s.title}</span>
                  {idx < steps.length-1 && <ChevronRight className="w-4 h-4 text-neutral-300"/>}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={prev} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50"><ChevronLeft className="w-4 h-4"/></button>
              <button onClick={next} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50"><ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>

          {/* Steps content */}
          <AnimatePresence mode="wait">
            {step===0 && (
              <motion.div key="s0" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space-y-3">
                <div className="text-sm text-neutral-700">Chọn phương thức đăng nhập:</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <button onClick={handleSignIn} className="px-3 py-3 text-left border rounded-2xl hover:bg-neutral-50">
                    <div className="flex items-center gap-2 text-sm font-medium"><Mail className="w-4 h-4"/>Email & Mật khẩu</div>
                    <div className="mt-1 text-xs text-neutral-500">Nhập trường bên trái rồi bấm</div>
                  </button>
                  <button onClick={()=>setStep(1)} className="px-3 py-3 text-left border rounded-2xl hover:bg-neutral-50">
                    <div className="flex items-center gap-2 text-sm font-medium"><ExternalLink className="w-4 h-4"/>SSO (SAML/OIDC)</div>
                    <div className="mt-1 text-xs text-neutral-500">Mô phỏng callback thành công</div>
                  </button>
                </div>
              </motion.div>
            )}

            {step===1 && (
              <motion.div key="s1" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space-y-3">
                <div className="text-sm font-medium">Xác thực đa yếu tố (MFA)</div>
                <div className="text-xs text-neutral-500">{mfaMust ? "Bắt buộc cho External hoặc khi bật cờ MFA" : "Tuỳ chọn (có thể bỏ qua)"}</div>
                <input value={mfaCode} onChange={(e)=>setMfaCode(e.target.value)} placeholder="Nhập mã 6 số" className="w-full px-3 py-2 border rounded-xl border-neutral-200" />
                <div className="flex items-center gap-2">
                  <button onClick={handleVerifyMFA} className="px-3 py-2 text-sm text-white rounded-xl bg-neutral-900 hover:bg-black">Xác minh</button>
                  {!mfaMust && <button onClick={()=>setStep(2)} className="px-3 py-2 text-sm border rounded-xl hover:bg-neutral-50">Bỏ qua</button>}
                </div>
              </motion.div>
            )}

            {step===2 && (
              <motion.div key="s2" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space-y-3">
                <div className="text-sm font-medium">Chọn Tenant</div>
                <div className="text-xs text-neutral-500">Nếu chỉ có 1 tenant, hệ thống sẽ tự chọn.</div>
                <div className="space-y-2">
                  {tenants.map(t => (
                    <label key={t.id} className="flex items-center gap-2">
                      <input type="radio" name="tenant2" checked={(identity.selectedTenant||tenants[0].id)===t.id} onChange={()=>handleTenantSelect(t.id)} />
                      <span className="text-sm">{t.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setStep(3)} className="px-3 py-2 text-sm text-white rounded-xl bg-neutral-900 hover:bg-black">Tiếp tục</button>
                </div>
              </motion.div>
            )}

            {step===3 && (
              <motion.div key="s3" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space-y-3">
                <div className="text-sm font-medium">Invite Token (External bắt buộc)</div>
                <textarea value={inviteRaw} onChange={(e)=>setInviteRaw(e.target.value)} placeholder='{"exp":"2025-12-31T23:59:59Z","user_type":"external","scopes":["project:p1"]}' className="w-full px-3 py-2 font-mono text-xs border h-28 rounded-xl border-neutral-200" />
                <div className="text-xs">
                  {inviteRaw ? (
                    inviteInfo.ok ? (
                      <div className="flex items-center gap-2 text-green-600"><CheckCircle2 className="w-4 h-4"/>Token hợp lệ · Hết hạn: {new Date(inviteInfo.expMs).toLocaleString()}</div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4"/>Token không hợp lệ: {inviteInfo.reason || "unknown"}</div>
                    )
                  ) : (
                    <div className="text-neutral-500">Dán token nếu có. External cần token hợp lệ để tiếp tục.</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setStep(4)} className="px-3 py-2 text-sm text-white rounded-xl bg-neutral-900 hover:bg-black">Tiếp tục</button>
                </div>
              </motion.div>
            )}

            {step===4 && (
              <motion.div key="s4" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space-y-3">
                <div className="text-sm font-medium">Điều khoản & NDA</div>
                {showTerms ? (
                  <>
                    <div className="text-xs text-neutral-500">Người dùng tạm thời (Probation/Intern/External) bắt buộc đồng ý trước khi vào hệ thống.</div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={identity.acceptedTerms} onChange={(e)=>setIdentity(s=>({...s,acceptedTerms:e.target.checked}))} />
                      Tôi đã đọc và đồng ý ToS/NDA.
                    </label>
                  </>
                ) : (
                  <div className="text-xs text-neutral-500">Nhân viên chính thức: có thể bỏ qua bước này.</div>
                )}
                <div className="flex items-center gap-2">
                  <button disabled={!canContinueTerms()} onClick={()=>setStep(5)} className={`rounded-xl px-3 py-2 text-sm text-white ${canContinueTerms()?"bg-neutral-900 hover:bg-black":"bg-neutral-300"}`}>Tiếp tục</button>
                </div>
              </motion.div>
            )}

            {step===5 && (
              <motion.div key="s5" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="space-y-4">
                <div>
                  <div className="text-sm font-semibold">Tuyến vào ứng dụng</div>
                  <div className="mt-1 text-sm">Vai trò: <b>{ROLE_OPTIONS.find(o=>o.id===identity.roleLevel)?.label}</b> · Trạng thái: <b>{EMPLOYMENT_OPTIONS.find(o=>o.id===identity.employment_status)?.label}</b></div>
                  <div className="mt-1 text-sm">Tenant: <b>{tenants.find(t=>t.id===identity.selectedTenant)?.label}</b></div>
                  <div className="mt-1 text-sm">Sẽ điều hướng tới: <b>{routeLabel}</b></div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleEnterApp} className="px-3 py-2 text-sm text-white rounded-xl bg-neutral-900 hover:bg-black">Vào ứng dụng</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Self-test modal */}
      <AnimatePresence>
        {testOpen && (
          <motion.div className="fixed inset-0 z-50 p-4 bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="max-w-xl p-4 mx-auto mt-10 bg-white shadow-xl rounded-2xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Kết quả kiểm thử</div>
                <button className="px-2 py-1 text-xs border rounded-xl hover:bg-neutral-50" onClick={() => setTestOpen(false)}>
                  Đóng
                </button>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {testResults.map((t, i) => (
                  <div key={i} className="flex items-start justify-between p-2 border rounded-xl border-neutral-200">
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-neutral-500">{t.detail}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${t.pass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {t.pass ? "PASS" : "FAIL"}
                    </span>
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
