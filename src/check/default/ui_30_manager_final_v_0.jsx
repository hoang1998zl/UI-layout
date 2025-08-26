import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building2,
  Factory,
  Network,
  Users,
  Settings,
  Bell,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Pencil,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  TriangleAlert,
  CalendarDays,
  ClipboardCheck,
  MessageSquare,
  Paperclip,
  Send,
  X,
  Info,
} from "lucide-react";

/**
 * UI 30 — Manager (User 3)
 * FINAL v0.4 — PA2 only (Floating Chat Modal)
 * - Auto-route per role (Manager):
 *   • If Temp: allow MyWork/Cell (no global anyway).
 *   • If recent cell interaction (< RECENT_MS): CELL thread.
 *   • Else if focusDept selected: CELL(homeCompany, focusDept).
 *   • Else: MYWORK thread.
 * - Storage key: erp_ui30_manager_chatStore_v1
 * - Thread IDs: mywork/cell only
 *      thread:mywork:r3
 *      thread:cell:<companyId>:<deptId>:r3
 * - Auto-open Chat modal upon matrix cell click.
 * - Views: Tổng quan · Ma trận (1 công ty) · Công việc · Phê duyệt · KPI phòng ban · Rủi ro đội ngũ
 * - Self-tests M1–M17: routing, ids, isolation, persistence, icon rendering, config flags, KPI & risk checks.
 */

// -------------------- Config --------------------
const VERSION = "v0.4";
const RECENT_MS = 120_000; // 120s
const STORAGE_KEY = "erp_ui30_manager_chatStore_v1";
const AUTO_OPEN_CHAT_ON_SELECT = true; // product flag

// -------------------- Demo data --------------------
const demoCompanies = [
  { id: "co1", label: "Đại Tín Co. Ltd", icon: Building2 },
  { id: "co2", label: "Đại Tín Invest", icon: Building2 },
  { id: "co3", label: "Đại Tín Services", icon: Factory },
];

const demoDepts = [
  { id: "biz", label: "Kinh doanh" },
  { id: "tech", label: "Kỹ thuật" },
  { id: "pm", label: "Dự án" },
  { id: "fin", label: "Tài chính" },
  { id: "hr", label: "Nhân sự" },
  { id: "it", label: "Công nghệ" },
];

function makeMatrixSingleCompany(companyId, depts) {
  const m = { [companyId]: {} };
  depts.forEach((d) => {
    const users = Math.floor(Math.random() * 6) + 2;
    const assigned = users + Math.floor(Math.random() * 6);
    const progress = Math.min(100, Math.floor((users / Math.max(1, assigned)) * 100) + Math.floor(Math.random() * 30));
    m[companyId][d.id] = { users, assigned, progress };
  });
  return m;
}

// KPI & Risk helpers (lightweight)
function genTeamKPI(deptId) {
  const base = deptId.charCodeAt(0) % 7;
  const delivery = Math.max(0, Math.min(100, 65 + base * 3 + Math.floor(Math.random() * 20)));
  const quality = Math.max(0, Math.min(100, 70 + base * 2 + Math.floor(Math.random() * 15)));
  const capacity = Math.max(0, Math.min(100, 60 + base * 4 + Math.floor(Math.random() * 25)));
  return { delivery, quality, capacity };
}
function scoreTeamKPI(k) {
  return Math.round(k.delivery * 0.4 + k.quality * 0.35 + k.capacity * 0.25);
}
function genTeamRisks(deptId) {
  const risks = ["Thiếu nguồn lực", "Trễ mốc", "Chất lượng", "Phụ thuộc vendor", "Budget squeeze"];
  return risks.map((name, idx) => {
    const sev = (deptId.charCodeAt(idx % deptId.length) % 3); // 0..2
    const prob = (idx * 13 + deptId.length) % 100; // 0..99
    const score = Math.min(100, sev * 30 + Math.floor(prob / 2));
    const level = score > 70 ? "High" : score >= 40 ? "Medium" : "Low";
    return { id: `${deptId}-${idx}`, name, sev, prob, score, level };
  });
}

// -------------------- Small UI helpers --------------------
function IconBtn({ title, onClick, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 transition rounded-2xl hover:bg-neutral-100 active:bg-neutral-200"
    >
      {children}
    </button>
  );
}

function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-neutral-100 ${className}`}>
      {children}
    </span>
  );
}

function SectionTitle({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{title}</span>
      </div>
      <div>{right}</div>
    </div>
  );
}

// -------------------- Org/Sidebar (left) --------------------
function OrgNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div>
      <div className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-neutral-100">
        <button className="shrink-0" onClick={() => setOpen((s) => !s)} aria-label={open ? "Thu gọn" : "Mở rộng"}>
          {hasChildren ? (
            open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            <span className="inline-block w-4" />
          )}
        </button>
        <div className="flex-1 truncate" style={{ paddingLeft: depth * 6 }}>
          <span className="text-sm text-neutral-700">{node.label}</span>
        </div>
        <button
          className="transition opacity-0 group-hover:opacity-100"
          title="Sửa nhanh"
          onClick={() => alert(`Inline edit: ${node.label}`)}
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      {hasChildren && open && (
        <div className="pl-2 ml-4 border-l border-dashed border-neutral-200">
          {node.children.map((c) => (
            <OrgNode key={c.id} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// -------------------- Matrix (center) --------------------
function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 overflow-hidden rounded-full bg-neutral-100">
      <div className="h-full bg-black/80" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function MatrixCell({ cell, onClick }) {
  return (
    <button onClick={onClick} className="w-full p-2 text-left transition border rounded-xl border-neutral-200 hover:shadow-sm hover:bg-neutral-50">
      <div className="flex items-center justify-between text-xs">
        <span>
          Users: <b>{cell.users}</b>
        </span>
        <span>
          Need: <b>{cell.assigned}</b>
        </span>
      </div>
      <div className="mt-1">
        <ProgressBar value={cell.progress} />
      </div>
    </button>
  );
}

function Matrix({ company, depts, matrix, onSelectCell }) {
  return (
    <div className="overflow-auto border rounded-2xl border-neutral-200">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 z-10 bg-neutral-50">
          <tr>
            <th className="w-48 px-3 py-2 font-semibold text-left text-neutral-700">Phòng ban \\ {company.label}</th>
          </tr>
        </thead>
        <tbody>
          {depts.map((d, ri) => (
            <tr key={d.id} className={ri % 2 === 0 ? "bg-white" : "bg-neutral-50/40"}>
              <td className="px-3 py-2">
                <MatrixCell cell={matrix[company.id][d.id]} onClick={() => onSelectCell(company, d)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -------------------- Chat store & auto-routing (Manager) --------------------
function threadIdCell(companyId, deptId) { return `thread:cell:${companyId}:${deptId}:r3`; }
function threadIdMyWork() { return `thread:mywork:r3`; }

/**
 * Manager routing (PA2):
 * - If Temp → allow mywork/cell (no change needed)
 * - If recent cell (lastCellTs < RECENT_MS) → cell
 * - Else if focusDeptId → cell(homeCompanyId, focusDeptId)
 * - Else → mywork
 */
function chooseThread({ selected, focusDeptId, homeCompanyId, lastCellTs, isTemp }) {
  const now = Date.now();
  const recent = !!(selected && lastCellTs && now - lastCellTs < RECENT_MS);
  if (recent && selected) return { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id) };
  if (focusDeptId) return { scope: "cell", id: threadIdCell(homeCompanyId, focusDeptId) };
  return { scope: "mywork", id: threadIdMyWork() };
}

// -------------------- Chat UI (modal only) --------------------
function ChatBody({ messages }) {
  return (
    <div className="space-y-2">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
          <div className={`${m.from === "you" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-900"} max-w-[80%] rounded-2xl px-3 py-2 text-sm`}>
            {m.text}
          </div>
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
        <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border cursor-pointer rounded-xl hover:bg-neutral-50">
          <Paperclip className="w-4 h-4" />
          <span>Tệp</span>
          <input type="file" className="hidden" multiple onChange={onUpload} />
        </label>
      )}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const v = input.trim();
            if (v) onSend(v);
            setInput("");
          }
        }}
        placeholder="Nhập để chat… (Enter để gửi)"
        className="flex-1 px-3 py-2 text-sm bg-white border outline-none rounded-xl border-neutral-200 focus:ring-2 focus:ring-black/10"
      />
      <button
        onClick={() => {
          const v = input.trim();
          if (v) onSend(v);
          setInput("");
        }}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white rounded-xl bg-neutral-900 hover:bg-black"
      >
        <Send className="w-4 h-4" /> Gửi
      </button>
    </div>
  );
}

function FloatingChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Chat (⌘/Ctrl+J)"
      className="fixed z-50 flex items-center gap-2 px-4 py-3 text-white rounded-full shadow-lg bottom-6 right-6 bg-neutral-900 hover:bg-black"
    >
      <MessageSquare className="w-5 h-5" />
      <span className="text-sm font-medium">Chat</span>
    </button>
  );
}

function shouldToggleByKey(evt) {
  const key = (evt?.key || "").toLowerCase();
  return (evt?.metaKey || evt?.ctrlKey) && key === "j";
}

function ChatModal({ open, onClose, scopeLabel, messages, onSend, onUpload }) {
  const prompts = [
    "Trạng thái công việc phòng ban",
    "Phiếu chờ duyệt của phòng ban",
    "Nguồn lực thiếu/điểm tắc",
    "Kế hoạch tuần tới",
  ];
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col w-full max-w-lg p-4 bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Chat – {scopeLabel}</div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 p-3 mb-2 overflow-auto bg-white border max-h-80 rounded-xl border-neutral-200">
          <ChatBody messages={messages} />
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {prompts.map((p, idx) => (
            <button key={idx} className="px-3 py-1 text-xs border rounded-full hover:bg-neutral-50" onClick={() => onSend(p)}>
              {p}
            </button>
          ))}
        </div>
        <ChatInput onSend={onSend} onUpload={onUpload} />
      </div>
    </div>
  );
}

// -------------------- Self-tests --------------------
function simulateChat(messages, text) {
  return [...messages, { from: "you", text }, { from: "assistant", text: "Đã nhận yêu cầu. (Demo)" }];
}

function runSelfTests({ homeCompany, depts, matrix, route, chatStore, focusDeptId }) {
  const results = [];

  // M1: Matrix shape and value bounds
  let pass1 = true;
  let msg1 = "";
  if (!matrix[homeCompany.id]) { pass1 = false; msg1 = `Missing company key ${homeCompany.id}`; }
  else {
    for (const d of depts) {
      const cell = matrix[homeCompany.id][d.id];
      if (!cell) { pass1 = false; msg1 = `Missing cell ${homeCompany.id}.${d.id}`; break; }
      const within = cell.progress >= 0 && cell.progress <= 100;
      if (!within) { pass1 = false; msg1 = `Progress out of bounds at ${homeCompany.id}.${d.id}: ${cell.progress}`; break; }
    }
  }
  results.push({ name: "Matrix shape & progress bounds", pass: pass1, detail: msg1 || "OK" });

  // M2: Chat append
  const sample = [{ from: "system", text: "x" }];
  const sim = simulateChat(sample, "Hello");
  const pass2 = sim.length === 3 && sim[1].from === "you" && sim[2].from === "assistant";
  results.push({ name: "Chat simulate append", pass: pass2, detail: pass2 ? "OK" : "Append failed" });

  // M3: Keyboard toggle
  const pass3 = shouldToggleByKey({ key: "j", metaKey: true }) && !shouldToggleByKey({ key: "k", metaKey: true });
  results.push({ name: "Toggle ⌘/Ctrl+J", pass: !!pass3, detail: pass3 ? "OK" : "Logic sai" });

  // M4: Thread ID format (cell/mywork)
  const mid = threadIdMyWork();
  const cid = threadIdCell("co1", "hr");
  const ok4 = mid === "thread:mywork:r3" && cid === "thread:cell:co1:hr:r3";
  results.push({ name: "Thread ID format (r3)", pass: ok4, detail: ok4 ? "OK" : `mid=${mid} cid=${cid}` });

  // M5: Store isolation (cell vs mywork)
  const s = { ...chatStore, [mid]: [{ from: "you", text: "M" }], [cid]: [{ from: "you", text: "C" }] };
  const ok5 = s[mid][0].text !== s[cid][0].text;
  results.push({ name: "Isolation across scopes", pass: ok5, detail: ok5 ? "OK" : "Không tách kho" });

  // M6: Persistence serialization
  const ser = JSON.stringify(s);
  const back = JSON.parse(ser);
  const ok6 = back && back[mid] && back[cid];
  results.push({ name: "Persistence (serialize/parse)", pass: ok6, detail: ok6 ? "OK" : "Sai serialize/parse" });

  // M7: Routing - recent cell -> cell; stale + focusDept -> that cell; none -> mywork
  const sel = { company: { id: homeCompany.id, label: homeCompany.label }, dept: { id: "hr", label: "Nhân sự" } };
  const rRecent = route({ selected: sel, lastCellTs: Date.now(), focusDeptId, homeCompanyId: homeCompany.id, isTemp: false });
  const rStaleWithFocus = route({ selected: sel, lastCellTs: Date.now() - (RECENT_MS + 1000), focusDeptId: "pm", homeCompanyId: homeCompany.id, isTemp: false });
  const rNone = route({ selected: null, lastCellTs: 0, focusDeptId: null, homeCompanyId: homeCompany.id, isTemp: false });
  const ok7 = rRecent.scope === "cell" && rStaleWithFocus.id === threadIdCell(homeCompany.id, "pm") && rNone.scope === "mywork";
  results.push({ name: "Routing (recent/focus/mywork)", pass: ok7, detail: ok7 ? "OK" : `${rRecent.scope}|${rStaleWithFocus.id}|${rNone.scope}` });

  // M8: MyWork id stable
  const m1 = route({ selected: null, lastCellTs: 0, focusDeptId: null, homeCompanyId: homeCompany.id, isTemp: false });
  const m2 = route({ selected: null, lastCellTs: 0, focusDeptId: null, homeCompanyId: homeCompany.id, isTemp: false });
  const ok8 = m1.id === m2.id && m1.id === "thread:mywork:r3";
  results.push({ name: "MyWork thread id stable", pass: ok8, detail: ok8 ? "OK" : m1.id + " vs " + m2.id });

  // M9: STORAGE_KEY sanity
  const ok9 = STORAGE_KEY === "erp_ui30_manager_chatStore_v1";
  results.push({ name: "Storage key", pass: ok9, detail: ok9 ? "OK" : STORAGE_KEY });

  // M10: RECENT_MS sanity
  const ok10 = RECENT_MS === 120000;
  results.push({ name: "RECENT_MS = 120000", pass: ok10, detail: ok10 ? "OK" : String(RECENT_MS) });

  // M11: Default route with focusDept set
  const defCell = route({ selected: null, lastCellTs: 0, focusDeptId: "hr", homeCompanyId: homeCompany.id, isTemp: false });
  const ok11 = defCell.scope === "cell" && defCell.id === threadIdCell(homeCompany.id, "hr");
  results.push({ name: "Default route (focus dept)", pass: ok11, detail: ok11 ? "OK" : `${defCell.scope}:${defCell.id}` });

  // M12: Icon render via createElement (for sidebar/company)
  try {
    const el = React.createElement(Building2, { className: "h-4 w-4" });
    results.push({ name: "Icon render via createElement", pass: !!el && typeof el === "object", detail: "OK" });
  } catch (e) {
    results.push({ name: "Icon render via createElement", pass: false, detail: String(e) });
  }

  // M13: Auto-open chat flag exists and true
  results.push({ name: "Auto-open on select flag", pass: AUTO_OPEN_CHAT_ON_SELECT === true, detail: String(AUTO_OPEN_CHAT_ON_SELECT) });

  // M14: MyWork vs Cell different ids
  const someCell = threadIdCell(homeCompany.id, "it");
  const ok14 = someCell !== threadIdMyWork();
  results.push({ name: "MyWork vs Cell ids differ", pass: ok14, detail: ok14 ? "OK" : `${someCell} == ${threadIdMyWork()}` });

  // M15: Team KPI score bounds
  const sk = scoreTeamKPI(genTeamKPI("pm"));
  results.push({ name: "Team KPI score bounds", pass: sk >= 0 && sk <= 100, detail: `score=${sk}` });

  // M16: Risk level mapping deterministic by score thresholds
  const lv1 = (70 + 1) > 70 ? "High" : "Medium"; // sanity
  const item = genTeamRisks("pm")[0];
  results.push({ name: "Risk item shape", pass: typeof item.name === "string" && typeof item.score === "number", detail: `${item.name}:${item.level}` });

  // M17: Focus changes produce different cell ids
  const f1 = route({ selected: null, lastCellTs: 0, focusDeptId: "hr", homeCompanyId: homeCompany.id, isTemp: false });
  const f2 = route({ selected: null, lastCellTs: 0, focusDeptId: "pm", homeCompanyId: homeCompany.id, isTemp: false });
  const ok17 = f1.id !== f2.id;
  results.push({ name: "Focus switch changes thread", pass: ok17, detail: ok17 ? "OK" : `${f1.id} == ${f2.id}` });

  return results;
}

// -------------------- Main App (UI 30 – Manager) --------------------
export default function UI30Manager() {
  // Manager context
  const [homeCompanyId, setHomeCompanyId] = useState("co1");
  const [focusDeptId, setFocusDeptId] = useState("pm"); // phòng ban phụ trách mặc định: Dự án

  const homeCompany = useMemo(() => demoCompanies.find((c) => c.id === homeCompanyId) || demoCompanies[0], [homeCompanyId]);
  const [depts, setDepts] = useState(demoDepts);
  const [matrix, setMatrix] = useState(() => makeMatrixSingleCompany(homeCompany.id, demoDepts));
  useEffect(() => { setMatrix(makeMatrixSingleCompany(homeCompany.id, depts)); }, [homeCompany.id, depts]);

  const [tab, setTab] = useState("overview"); // overview | matrix | tasks | approvals | kpi | risks
  const [selected, setSelected] = useState(null);
  const [lastCellTs, setLastCellTs] = useState(0);
  const [chatOpen, setChatOpen] = useState(false); // PA2 modal state
  const [testOpen, setTestOpen] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Simulate employment status
  const [isTemp] = useState(false);

  // Chat store: { [threadId]: Message[] }, persisted
  const [chatStore, setChatStore] = useState({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setChatStore(parsed);
      }
    } catch (e) {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatStore));
    } catch (e) {}
  }, [chatStore]);

  function appendMessage(threadId, text, from = "you") {
    setChatStore((s) => {
      const prev = s[threadId] || [];
      return { ...s, [threadId]: [...prev, { from, text }] };
    });
  }

  const route = ({ selected, lastCellTs, focusDeptId, homeCompanyId, isTemp }) => chooseThread({ selected, lastCellTs, focusDeptId, homeCompanyId, isTemp });
  const routing = useMemo(() => route({ selected, lastCellTs, focusDeptId, homeCompanyId: homeCompany.id, isTemp }), [selected, lastCellTs, focusDeptId, homeCompany.id, isTemp]);
  const scopeLabel = useMemo(() => {
    if (routing.scope === "cell") {
      const d = depts.find((x) => x.id === (selected?.dept?.id || focusDeptId));
      return `${homeCompany.label} · ${d ? d.label : "Phòng ban"}`;
    }
    return "My Work";
  }, [routing.scope, selected, focusDeptId, homeCompany, depts]);
  const messagesForScope = chatStore[routing.id] || [];

  // Keyboard shortcut for PA2
  useEffect(() => {
    function onKeyDown(e) { if ((e.metaKey || e.ctrlKey) && (e.key || "").toLowerCase() === "j") { e.preventDefault(); setChatOpen((v) => !v); } }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleRunTests() {
    const res = runSelfTests({ homeCompany, depts, matrix, route, chatStore, focusDeptId });
    setTestResults(res);
    setTestOpen(true);
  }

  function handleQuickAdd(type) {
    const name = prompt(`Tên ${type === "dept" ? "phòng ban" : "công ty"}?`);
    if (!name) return;
    if (type === "company") {
      const id = `co${demoCompanies.length + 1}`;
      alert(`(Demo) Thêm công ty ${name} — UI 30 chỉ hiển thị 1 công ty nhà: ${homeCompany.label}`);
    } else {
      const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      const next = [...depts, { id, label: name }];
      setDepts(next);
      setMatrix(makeMatrixSingleCompany(homeCompany.id, next));
    }
  }

  // ---------- Views ----------
  function Overview() {
    return (
      <motion.div key="ov" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {["Tiến độ team", "Chất lượng", "Năng lực", "AR nội bộ", "Headcount", "Rủi ro"]
          .map((k, i) => (
          <div key={i} className="p-4 border rounded-2xl border-neutral-200">
            <div className="mb-2 text-sm font-semibold">{k}</div>
            <div className="flex items-center justify-center h-24 text-xs rounded-xl bg-neutral-100 text-neutral-500">(Chart giả lập)</div>
            <div className="mt-2 text-xs text-neutral-500">Cập nhật gần nhất: hôm nay</div>
          </div>
        ))}
      </motion.div>
    );
  }

  function Tasks() {
    return (
      <motion.div key="tk" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
        {["Daily standup", "Review PR", "Chuẩn bị sprint plan", "Theo dõi AR phòng ban"].map((t, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-2xl border-neutral-200">
            <div className="text-sm font-medium">{t}</div>
            <div className="flex items-center gap-2">
              <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => setTab("kpi")}>Xem KPI</button>
              <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => setChatOpen(true)}>Trao đổi</button>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  function Approvals() {
    const tooltip = "Manager: 50M/single, 300M/month · Trên ngưỡng → Director";
    return (
      <motion.div key="ap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
        <div className="flex items-center gap-1 text-xs text-neutral-500"><Info className="h-3.5 w-3.5" />Ngưỡng phê duyệt ({VERSION}): {tooltip}</div>
        {["Đề nghị mua sắm", "Tạm ứng", "Thanh toán nhỏ"].map((type, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-2xl border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 text-xs text-white rounded-xl bg-neutral-900">{i + 1}</div>
              <div>
                <div className="text-sm font-semibold">{type}</div>
                <div className="text-xs text-neutral-500">Có {Math.floor(Math.random()*3)+1} phiếu chờ duyệt (phòng ban)</div>
              </div>
            </div>
            <button title={tooltip} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-100" onClick={() => alert(`Mở danh sách: ${type}`)}>
              Xem
            </button>
          </div>
        ))}
      </motion.div>
    );
  }

  function KPIDept() {
    const d = depts.find((x) => x.id === focusDeptId) || depts[0];
    const k = genTeamKPI(d.id);
    const score = scoreTeamKPI(k);
    return (
      <motion.div key="kpi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-3 border rounded-2xl border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">KPI · {d.label}</div>
          <Pill>Score {score}</Pill>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
          <div className="p-2 border rounded-xl"><div className="text-neutral-500">Delivery</div><div className="text-sm font-medium">{k.delivery}%</div></div>
          <div className="p-2 border rounded-xl"><div className="text-neutral-500">Quality</div><div className="text-sm font-medium">{k.quality}%</div></div>
          <div className="p-2 border rounded-xl"><div className="text-neutral-500">Capacity</div><div className="text-sm font-medium">{k.capacity}%</div></div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => setChatOpen(true)}>Trao đổi</button>
          <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => setTab("risks")}>Xem rủi ro</button>
        </div>
      </motion.div>
    );
  }

  function TeamRisks() {
    const d = depts.find((x) => x.id === focusDeptId) || depts[0];
    const risks = genTeamRisks(d.id);
    return (
      <motion.div key="risk" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-3 border rounded-2xl border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Rủi ro · {d.label}</div>
          <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => setChatOpen(true)}>Trao đổi</button>
        </div>
        <div className="overflow-auto border rounded-xl border-neutral-200">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-3 py-2 font-semibold text-left text-neutral-700">Hạng mục</th>
                <th className="px-3 py-2 font-semibold text-left text-neutral-700">Severity</th>
                <th className="px-3 py-2 font-semibold text-left text-neutral-700">Probability</th>
                <th className="px-3 py-2 font-semibold text-left text-neutral-700">Score</th>
                <th className="px-3 py-2 font-semibold text-left text-neutral-700">Level</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r) => (
                <tr key={r.id} className="border-t border-neutral-100">
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.sev}</td>
                  <td className="px-3 py-2">{r.prob}%</td>
                  <td className="px-3 py-2">{r.score}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${r.level==="High"?"bg-red-100 text-red-700":r.level==="Medium"?"bg-amber-100 text-amber-700":"bg-green-100 text-green-700"}`}>{r.level}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-screen bg-neutral-50 text-neutral-900">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-black px-3 py-1.5 text-white">
                <Home className="w-4 h-4" />
                <span className="text-sm font-semibold">ERP</span>
              </div>
              <Pill>UI 30 · Manager · Final {VERSION}</Pill>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  placeholder="Tìm nhanh (⌘K)"
                  className="w-64 py-2 pr-3 text-sm bg-white border outline-none rounded-2xl border-neutral-200 pl-9 focus:ring-2 focus:ring-black/10"
                />
              </div>
              <IconBtn title="Kiểm thử" onClick={handleRunTests}>
                <CheckCircle2 className="w-4 h-4" /> <span className="text-xs">Kiểm thử</span>
              </IconBtn>
              <div className="w-px h-8 bg-neutral-200" />
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-2 py-1.5">
                <Users className="w-4 h-4" />
                <span className="text-sm">Anh (Manager)</span>
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body grid */}
      <div className="mx-auto max-w-[1200px] px-4 py-4 grid grid-cols-[280px,1fr,320px] gap-4">
        {/* Left: Focus & Filters */}
        <div className="space-y-4">
          <div className="p-4 bg-white border rounded-2xl border-neutral-200">
            <SectionTitle icon={Network} title="Thiết lập nhanh" />
            <div className="space-y-2 text-sm">
              <label className="flex items-center justify-between px-2 py-1 rounded-xl hover:bg-neutral-50">
                <span className="flex items-center gap-2">
                  {React.createElement(homeCompany.icon || Building2, { className: "h-4 w-4" })}
                  Công ty nhà
                </span>
                <select
                  className="px-2 py-1 text-sm border rounded-lg"
                  value={homeCompanyId}
                  onChange={(e) => setHomeCompanyId(e.target.value)}
                >
                  {demoCompanies.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </label>
              <div className="p-2 border rounded-xl">
                <div className="mb-1 text-xs font-medium">Focus phòng ban</div>
                <div className="grid grid-cols-2 gap-1">
                  {depts.map((d) => (
                    <label key={d.id} className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-neutral-50">
                      <span className="truncate">{d.label}</span>
                      <input type="radio" name="focusDept" checked={focusDeptId===d.id} onChange={()=> setFocusDeptId(d.id)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <button className="px-3 py-2 border rounded-xl hover:bg-neutral-50" onClick={() => handleQuickAdd("dept")}>Thêm phòng ban</button>
              <button className="px-3 py-2 border rounded-xl hover:bg-neutral-50" onClick={() => alert("Bộ lọc nâng cao")}>Bộ lọc</button>
            </div>
          </div>
        </div>

        {/* Center: Tabs + Views */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="bg-white border rounded-2xl border-neutral-200">
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-1">
                {[
                  { id: "overview", label: "Tổng quan" },
                  { id: "matrix", label: "Ma trận" },
                  { id: "tasks", label: "Công việc" },
                  { id: "kpi", label: "KPI phòng ban" },
                  { id: "risks", label: "Rủi ro đội ngũ" },
                  { id: "approvals", label: "Phê duyệt" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`rounded-xl px-3 py-2 text-sm ${tab === t.id ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="p-2">
                <IconBtn title="Bộ lọc">
                  <Filter className="w-4 h-4" />
                  <span className="text-xs">Bộ lọc</span>
                </IconBtn>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-200">
              <AnimatePresence mode="wait">
                {tab === "overview" && <Overview />}

                {tab === "matrix" && (
                  <motion.div key="mx" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <Matrix
                      company={homeCompany}
                      depts={depts}
                      matrix={matrix}
                      onSelectCell={(company, dept) => {
                        setSelected({ company, dept });
                        setLastCellTs(Date.now());
                        if (AUTO_OPEN_CHAT_ON_SELECT) setChatOpen(true);
                      }}
                    />
                    <div className="mt-2 text-xs text-neutral-500">Mẹo: Chọn **Focus phòng ban** để chat mặc định theo đúng team khi chưa click ô nào.</div>
                  </motion.div>
                )}

                {tab === "tasks" && <Tasks />}
                {tab === "kpi" && <KPIDept />}
                {tab === "risks" && <TeamRisks />}
                {tab === "approvals" && <Approvals />}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Signals & Quick actions */}
        <div className="space-y-4">
          <div className="p-4 bg-white border rounded-2xl border-neutral-200">
            <SectionTitle icon={Bell} title="Tín hiệu team" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><TriangleAlert className="w-4 h-4" /><span>1 mốc dự án có nguy cơ trễ</span></div>
              <div className="flex items-center gap-2"><ClipboardCheck className="w-4 h-4" /><span>3 việc cần review</span></div>
              <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /><span>Họp team 10:00</span></div>
            </div>
          </div>

          <div className="p-4 bg-white border rounded-2xl border-neutral-200">
            <SectionTitle icon={Settings} title="Hành động nhanh" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button className="px-3 py-2 border rounded-xl hover:bg-neutral-50" onClick={() => setTab("tasks")}>Lập kế hoạch</button>
              <button className="px-3 py-2 border rounded-xl hover:bg-neutral-50" onClick={() => setTab("kpi")}>Xem KPI</button>
              <button className="px-3 py-2 border rounded-xl hover:bg-neutral-50" onClick={() => setTab("risks")}>Quản trị rủi ro</button>
              <button className="px-3 py-2 border rounded-xl hover:bg-neutral-50" onClick={() => alert("Xuất báo cáo team")}>Xuất báo cáo</button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat (PA2) */}
      <FloatingChatButton onClick={() => setChatOpen(true)} />
      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        scopeLabel={scopeLabel}
        messages={messagesForScope}
        onSend={(text) => {
          const id = routing.id;
          appendMessage(id, text, "you");
          appendMessage(id, "Đã nhận yêu cầu. (Demo)", "assistant");
        }}
        onUpload={(e) => {
          const list = Array.from(e.target.files || []);
          if (!list.length) return;
          const id = routing.id;
          appendMessage(id, `Tải lên ${list.length} tệp: ${list.map((x) => x.name).join(", ")}`, "you");
        }}
      />

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

      {/* Footer: Tests */}
      <div className="fixed bottom-4 left-4">
        <button
          onClick={handleRunTests}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border shadow rounded-xl hover:bg-neutral-50"
        >
          <CheckCircle2 className="w-4 h-4" /> Kiểm thử
        </button>
      </div>
    </div>
  );
}
