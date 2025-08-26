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
 * UI 20 — Director (User 2)
 * FINAL v0.5 — PA2 only (Floating Chat Modal)
 * - Auto-route per v0.4 (Director):
 *   • If Temp: NO global → cell or mywork.
 *   • If recent cell interaction (< RECENT_MS): CELL thread.
 *   • Else if focusCompany selected: COMPANY thread.
 *   • Else: GLOBAL thread.
 * - Storage key unified: erp_ui20_director_chatStore_v1
 * - Thread IDs: global/company/cell
 *      thread:global:r2
 *      thread:company:<companyId>:r2
 *      thread:cell:<companyId>:<deptId>:r2
 * - Auto-open Chat modal upon matrix cell click (per product decision).
 * - **New views**: KPI by company, Vendor risks.
 * - Self-tests D1–D17: routing, ids, isolation, persistence, icon rendering, config flags, KPI & risk scoring.
 */

// -------------------- Config --------------------
const VERSION = "v0.5";
const RECENT_MS = 120_000; // 120s per Spec v0.4
const STORAGE_KEY = "erp_ui20_director_chatStore_v1";
const AUTO_OPEN_CHAT_ON_SELECT = true; // product flag for tests

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

function makeMatrix(companies, depts) {
  const m = {};
  companies.forEach((c) => {
    m[c.id] = {};
    depts.forEach((d) => {
      const users = Math.floor(Math.random() * 5);
      const assigned = Math.floor(Math.random() * 6) + users;
      const progress = Math.min(
        100,
        Math.floor((users / Math.max(1, assigned)) * 100) + Math.floor(Math.random() * 25)
      );
      m[c.id][d.id] = { users, assigned, progress };
    });
  });
  return m;
}

// -------------------- KPI & Vendor Risk helpers --------------------
function genKPI(companyId) {
  // pseudo metrics per company, bounded
  const base = companyId.charCodeAt(companyId.length - 1) % 7;
  const revenue = 50 + base * 10 + Math.floor(Math.random() * 20); // tỷ
  const margin = Math.max(5, Math.min(40, 10 + base * 3 + Math.floor(Math.random() * 10))); // %
  const project = Math.max(0, Math.min(100, 60 + base * 5 + Math.floor(Math.random() * 30))); // %
  const arDays = 20 + base * 5 + Math.floor(Math.random() * 15); // ngày
  const headcount = 30 + base * 10 + Math.floor(Math.random() * 40);
  return { revenue, margin, project, arDays, headcount };
}
function scoreKPI(k) {
  // 0..100 higher better; AR days lower is better
  const revScore = Math.min(100, (k.revenue / 120) * 100);
  const mgScore = Math.min(100, (k.margin / 40) * 100);
  const prjScore = k.project; // already %
  const arScore = Math.max(0, 100 - Math.min(90, k.arDays));
  return Math.round((revScore * 0.25 + mgScore * 0.25 + prjScore * 0.3 + arScore * 0.2));
}
function riskLevelFromScore(score) {
  if (score > 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}
function genVendorRisks(companyId) {
  const vendors = ["FPT", "CMC", "Viettel", "MISA", "SAP Partner", "AWS Partner", "Local Print"];
  return vendors.slice(0, 4 + (companyId.charCodeAt(0) % 3)).map((name, idx) => {
    const delay = (companyId.charCodeAt(idx % companyId.length) % 30);
    const disputes = (idx + companyId.length) % 5;
    const compliance = (companyId.charCodeAt(idx) % 2) ? "OK" : "Pending";
    const score = Math.min(100, delay * 2 + disputes * 12 + (compliance === "Pending" ? 25 : 0));
    return { id: `${companyId}-${idx}`, name, delay, disputes, compliance, score, level: riskLevelFromScore(score) };
  });
}

// -------------------- Small UI helpers --------------------
function IconBtn({ title, onClick, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-neutral-100 active:bg-neutral-200 transition"
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
        {Icon && <Icon className="h-4 w-4" />}
        <span>{title}</span>
      </div>
      <div>{right}</div>
    </div>
  );
}

// -------------------- Org Tree (left) --------------------
const seedOrg = [
  {
    id: "dir-portfolio",
    label: "Công ty phụ trách",
    type: "group",
    children: [
      {
        id: "co1",
        label: "Đại Tín Co. Ltd",
        type: "company",
        children: [
          { id: "br1", label: "Chi nhánh Q7", type: "branch", children: [] },
        ],
      },
      {
        id: "co2",
        label: "Đại Tín Invest",
        type: "company",
        children: [
          { id: "br3", label: "Chi nhánh Quận 1", type: "branch", children: [] },
        ],
      },
    ],
  },
];

function OrgNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div>
      <div className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-neutral-100">
        <button className="shrink-0" onClick={() => setOpen((s) => !s)} aria-label={open ? "Thu gọn" : "Mở rộng"}>
          {hasChildren ? (
            open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="inline-block w-4" />
          )}
        </button>
        <div className="flex-1 truncate" style={{ paddingLeft: depth * 6 }}>
          <span className="text-sm text-neutral-700">{node.label}</span>
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 transition"
          title="Sửa nhanh"
          onClick={() => alert(`Inline edit: ${node.label}`)}
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
      {hasChildren && open && (
        <div className="ml-4 border-l border-dashed border-neutral-200 pl-2">
          {node.children.map((c) => (
            <OrgNode key={c.id} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrgTree({ data, onQuickAdd }) {
  return (
    <div className="space-y-3">
      {data.map((n) => (
        <OrgNode key={n.id} node={n} />
      ))}
      <div className="pt-2">
        <SectionTitle
          icon={Plus}
          title="Thêm nhanh"
          right={
            <div className="flex items-center gap-1">
              <IconBtn title="Thêm công ty" onClick={() => onQuickAdd("company")}>
                <Building2 className="h-4 w-4" /> <span className="text-xs">Công ty</span>
              </IconBtn>
              <IconBtn title="Thêm chi nhánh" onClick={() => onQuickAdd("branch")}>
                <Factory className="h-4 w-4" /> <span className="text-xs">Chi nhánh</span>
              </IconBtn>
              <IconBtn title="Thêm phòng ban" onClick={() => onQuickAdd("dept")}>
                <Users className="h-4 w-4" /> <span className="text-xs">Phòng ban</span>
              </IconBtn>
            </div>
          }
        />
      </div>
    </div>
  );
}

// -------------------- Matrix (center) --------------------
function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
      <div className="h-full bg-black/80" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function MatrixCell({ cell, onClick }) {
  return (
    <button onClick={onClick} className="w-full text-left rounded-xl border border-neutral-200 p-2 hover:shadow-sm hover:bg-neutral-50 transition">
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

function Matrix({ companies, depts, matrix, onSelectCell }) {
  return (
    <div className="overflow-auto rounded-2xl border border-neutral-200">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 sticky top-0 z-10">
          <tr>
            <th className="w-48 px-3 py-2 text-left font-semibold text-neutral-700">Phòng ban \\ Công ty</th>
            {companies.map((c) => (
              <th key={c.id} className="px-3 py-2 text-left font-semibold text-neutral-700">
                <div className="flex items-center gap-2">
                  {React.createElement(c.icon || Building2, { className: "h-4 w-4" })}
                  <span>{c.label}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {depts.map((d, ri) => (
            <tr key={d.id} className={ri % 2 === 0 ? "bg-white" : "bg-neutral-50/40"}>
              <td className="px-3 py-2 font-medium text-neutral-800 sticky left-0 bg-inherit">{d.label}</td>
              {companies.map((c) => (
                <td key={`${c.id}-${d.id}`} className="px-3 py-2">
                  <MatrixCell cell={matrix[c.id][d.id]} onClick={() => onSelectCell(c, d)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -------------------- Chat store & auto-routing (Director) --------------------
function threadIdCell(companyId, deptId) { return `thread:cell:${companyId}:${deptId}:r2`; }
function threadIdCompany(companyId) { return `thread:company:${companyId}:r2`; }
function threadIdGlobal() { return `thread:global:r2`; }

/**
 * Director routing (PA2):
 * - Temp → cell or mywork (no global)
 * - If recent cell (lastCellTs < RECENT_MS) → cell
 * - Else if focusCompany → company
 * - Else → global
 */
function chooseThread({ selected, focusCompanyId, lastCellTs, isTemp }) {
  if (isTemp) {
    if (selected) return { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id) };
    return { scope: "mywork", id: "thread:mywork:temp" };
  }
  const now = Date.now();
  const recent = !!(selected && lastCellTs && now - lastCellTs < RECENT_MS);
  if (recent && selected) return { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id) };
  if (focusCompanyId) return { scope: "company", id: threadIdCompany(focusCompanyId) };
  return { scope: "global", id: threadIdGlobal() };
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
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50">
          <Paperclip className="h-4 w-4" />
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
        className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
      />
      <button
        onClick={() => {
          const v = input.trim();
          if (v) onSend(v);
          setInput("");
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-black"
      >
        <Send className="h-4 w-4" /> Gửi
      </button>
    </div>
  );
}

function FloatingChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Chat (⌘/Ctrl+J)"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-white shadow-lg hover:bg-black"
    >
      <MessageSquare className="h-5 w-5" />
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
    "Tổng hợp KPI công ty",
    "Top phiếu chờ duyệt theo công ty",
    "Rủi ro phòng ban",
    "So sánh ngân sách công ty",
  ];
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">Chat – {scopeLabel}</div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-2 max-h-80 flex-1 overflow-auto rounded-xl border border-neutral-200 bg-white p-3">
          <ChatBody messages={messages} />
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          {prompts.map((p, idx) => (
            <button key={idx} className="rounded-full border px-3 py-1 text-xs hover:bg-neutral-50" onClick={() => onSend(p)}>
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

function runSelfTests({ companies, depts, matrix, route, chatStore }) {
  const results = [];

  // D1: Matrix shape and value bounds
  let pass1 = true;
  let msg1 = "";
  for (const c of companies) {
    if (!matrix[c.id]) { pass1 = false; msg1 = `Missing company key ${c.id}`; break; }
    for (const d of depts) {
      const cell = matrix[c.id][d.id];
      if (!cell) { pass1 = false; msg1 = `Missing cell ${c.id}.${d.id}`; break; }
      const within = cell.progress >= 0 && cell.progress <= 100;
      if (!within) { pass1 = false; msg1 = `Progress out of bounds at ${c.id}.${d.id}: ${cell.progress}`; break; }
    }
  }
  results.push({ name: "Matrix shape & progress bounds", pass: pass1, detail: msg1 || "OK" });

  // D2: Chat append
  const sample = [{ from: "system", text: "x" }];
  const sim = simulateChat(sample, "Hello");
  const pass2 = sim.length === 3 && sim[1].from === "you" && sim[2].from === "assistant";
  results.push({ name: "Chat simulate append", pass: pass2, detail: pass2 ? "OK" : "Append failed" });

  // D3: Keyboard toggle
  const pass3 = shouldToggleByKey({ key: "j", metaKey: true }) && !shouldToggleByKey({ key: "k", metaKey: true });
  results.push({ name: "Toggle ⌘/Ctrl+J", pass: !!pass3, detail: pass3 ? "OK" : "Logic sai" });

  // D4: Thread ID format (global/company/cell)
  const gid = threadIdGlobal();
  const cid = threadIdCell("co1", "hr");
  const comp = threadIdCompany("co1");
  const ok4 = gid === "thread:global:r2" && cid === "thread:cell:co1:hr:r2" && comp === "thread:company:co1:r2";
  results.push({ name: "Thread ID format (r2)", pass: ok4, detail: ok4 ? "OK" : `gid=${gid} cid=${cid} comp=${comp}` });

  // D5: Store isolation (cell vs company vs global)
  const s = { ...chatStore, [gid]: [{ from: "you", text: "G" }], [cid]: [{ from: "you", text: "C" }], [comp]: [{ from: "you", text: "CO" }] };
  const ok5 = s[gid][0].text !== s[cid][0].text && s[cid][0].text !== s[comp][0].text && s[gid][0].text !== s[comp][0].text;
  results.push({ name: "Isolation across scopes", pass: ok5, detail: ok5 ? "OK" : "Không tách kho" });

  // D6: Persistence serialization
  const ser = JSON.stringify(s);
  const back = JSON.parse(ser);
  const ok6 = back && back[gid] && back[cid] && back[comp];
  results.push({ name: "Persistence (serialize/parse)", pass: ok6, detail: ok6 ? "OK" : "Sai serialize/parse" });

  // D7: Routing - recent cell -> cell; stale cell + focusCompany -> company; none -> global
  const sel = { company: { id: "co1", label: "Đại Tín Co. Ltd" }, dept: { id: "hr", label: "Nhân sự" } };
  const rRecent = route({ selected: sel, lastCellTs: Date.now(), focusCompanyId: "co1", isTemp: false });
  const rStaleWithCompany = route({ selected: sel, lastCellTs: Date.now() - (RECENT_MS + 1000), focusCompanyId: "co1", isTemp: false });
  const rNone = route({ selected: null, lastCellTs: 0, focusCompanyId: null, isTemp: false });
  const ok7 = rRecent.scope === "cell" && rStaleWithCompany.scope === "company" && rNone.scope === "global";
  results.push({ name: "Routing (recent/stale/company/global)", pass: ok7, detail: ok7 ? "OK" : `${rRecent.scope}|${rStaleWithCompany.scope}|${rNone.scope}` });

  // D8: Company thread id stable when focus unchanged
  const rComp1 = route({ selected: null, lastCellTs: 0, focusCompanyId: "co2", isTemp: false });
  const rComp2 = route({ selected: null, lastCellTs: 0, focusCompanyId: "co2", isTemp: false });
  const ok8 = rComp1.id === rComp2.id && rComp1.id === "thread:company:co2:r2";
  results.push({ name: "Company thread id stable", pass: ok8, detail: ok8 ? "OK" : rComp1.id + " vs " + rComp2.id });

  // D9: Temp-user guard blocks global
  const gTemp = route({ selected: null, lastCellTs: 0, focusCompanyId: null, isTemp: true });
  const cTemp = route({ selected: sel, lastCellTs: Date.now(), focusCompanyId: null, isTemp: true });
  const ok9 = gTemp.scope !== "global" && (cTemp.scope === "cell" || cTemp.scope === "mywork");
  results.push({ name: "Temp guard (no global)", pass: ok9, detail: ok9 ? "OK" : `g=${gTemp.scope} c=${cTemp.scope}` });

  // D10: STORAGE_KEY sanity
  const ok10 = STORAGE_KEY === "erp_ui20_director_chatStore_v1";
  results.push({ name: "Storage key", pass: ok10, detail: ok10 ? "OK" : STORAGE_KEY });

  // D11: RECENT_MS sanity
  const ok11 = RECENT_MS === 120000;
  results.push({ name: "RECENT_MS = 120000", pass: ok11, detail: ok11 ? "OK" : String(RECENT_MS) });

  // D12: Default route is company when focus set & no recent cell
  const defComp = route({ selected: null, lastCellTs: 0, focusCompanyId: "co1", isTemp: false });
  const ok12 = defComp.scope === "company" && defComp.id === "thread:company:co1:r2";
  results.push({ name: "Default route (company when focus)", pass: ok12, detail: ok12 ? "OK" : `${defComp.scope}:${defComp.id}` });

  // D13: Icon render via createElement
  try {
    const el = React.createElement(demoCompanies[0].icon || Building2, { className: "h-4 w-4" });
    results.push({ name: "Icon render via createElement", pass: !!el && typeof el === "object", detail: "OK" });
  } catch (e) {
    results.push({ name: "Icon render via createElement", pass: false, detail: String(e) });
  }

  // D14: Auto-open chat flag exists and true
  results.push({ name: "Auto-open on select flag", pass: AUTO_OPEN_CHAT_ON_SELECT === true, detail: String(AUTO_OPEN_CHAT_ON_SELECT) });

  // D15: Company vs Global different ids
  const defGlobal = route({ selected: null, lastCellTs: 0, focusCompanyId: null, isTemp: false });
  const ok15 = defGlobal.id !== defComp.id;
  results.push({ name: "Company vs Global ids differ", pass: ok15, detail: ok15 ? "OK" : `${defGlobal.id} == ${defComp.id}` });

  // D16: KPI score within 0..100
  const k = genKPI("co1");
  const sc = scoreKPI(k);
  results.push({ name: "KPI score bounds", pass: sc >= 0 && sc <= 100, detail: `score=${sc}` });

  // D17: Risk level mapping
  const lv1 = riskLevelFromScore(20);
  const lv2 = riskLevelFromScore(55);
  const lv3 = riskLevelFromScore(85);
  results.push({ name: "Risk level mapping", pass: lv1 === "Low" && lv2 === "Medium" && lv3 === "High", detail: `${lv1}/${lv2}/${lv3}` });

  return results;
}

// -------------------- Main App (UI 20 – Director) --------------------
export default function UI20Director() {
  const [portfolio, setPortfolio] = useState(["co1", "co2"]); // công ty phụ trách
  const [focusCompanyId, setFocusCompanyId] = useState("co1");
  const [companies, setCompanies] = useState(demoCompanies);
  const [depts, setDepts] = useState(demoDepts);
  const [matrix, setMatrix] = useState(() => makeMatrix(demoCompanies, demoDepts));
  const [tab, setTab] = useState("overview"); // overview | matrix | approvals | procurement | kpi | vendorRisks
  const [selected, setSelected] = useState(null);
  const [lastCellTs, setLastCellTs] = useState(0);
  const [chatOpen, setChatOpen] = useState(false); // PA2 modal state
  const [testOpen, setTestOpen] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Simulate employment status (Director có thể là temp trong thử nghiệm)
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

  const route = ({ selected, lastCellTs, focusCompanyId, isTemp }) => chooseThread({ selected, lastCellTs, focusCompanyId, isTemp });
  const routing = useMemo(() => route({ selected, lastCellTs, focusCompanyId, isTemp }), [selected, lastCellTs, focusCompanyId, isTemp]);
  const scopeLabel = useMemo(() => {
    if (routing.scope === "cell" && selected) return `${selected.company.label} · ${selected.dept.label}`;
    if (routing.scope === "company") {
      const co = companies.find(c => c.id === focusCompanyId);
      return co ? co.label : "Company";
    }
    if (routing.scope === "mywork") return "My Work";
    return "Toàn công ty phụ trách";
  }, [routing.scope, selected, companies, focusCompanyId]);
  const messagesForScope = chatStore[routing.id] || [];

  // Keyboard shortcut for PA2
  useEffect(() => {
    function onKeyDown(e) { if ((e.metaKey || e.ctrlKey) && (e.key || "").toLowerCase() === "j") { e.preventDefault(); setChatOpen((v) => !v); } }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleRunTests() {
    const res = runSelfTests({ companies, depts, matrix, route, chatStore });
    setTestResults(res);
    setTestOpen(true);
  }

  function handleQuickAdd(type) {
    const name = prompt(`Tên ${type === "company" ? "công ty" : type === "branch" ? "chi nhánh" : "phòng ban"}?`);
    if (!name) return;
    if (type === "company") {
      const id = `co${companies.length + 1}`;
      const next = [...companies, { id, label: name, icon: Building2 }];
      setCompanies(next);
      setMatrix(makeMatrix(next, depts));
    } else if (type === "branch") {
      alert(`Đã tạo chi nhánh: ${name} (demo)`);
    } else if (type === "dept") {
      const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      const next = [...depts, { id, label: name }];
      setDepts(next);
      setMatrix(makeMatrix(companies, next));
    }
  }

  const filteredCompanies = useMemo(() => companies.filter(c => portfolio.includes(c.id)), [companies, portfolio]);

  // Helpers to open chat to company scope
  function openCompanyChat(coId, seedText) {
    setSelected(null);
    setLastCellTs(0);
    // set focus and open modal -> route() will pick company scope
    setFocusCompanyId(coId);
    setTimeout(() => {
      setChatOpen(true);
      const id = threadIdCompany(coId);
      if (seedText) appendMessage(id, seedText, "you");
    }, 0);
  }

  // ---------- Views ----------
  function Overview() {
    return (
      <motion.div key="ov" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {["Doanh thu công ty", "Lợi nhuận", "Tiến độ dự án", "AR/AP", "Headcount", "Rủi ro"]
          .map((k, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 p-4">
            <div className="text-sm font-semibold mb-2">{k}</div>
            <div className="h-24 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs">(Chart giả lập)</div>
            <div className="mt-2 text-xs text-neutral-500">Cập nhật gần nhất: hôm nay</div>
          </div>
        ))}
      </motion.div>
    );
  }

  function Procurement() {
    return (
      <motion.div key="pc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
        {filteredCompanies.map((c, i) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl border border-neutral-200 p-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs">{i + 1}</div>
              <div>
                <div className="text-sm font-semibold">{c.label}</div>
                <div className="text-xs text-neutral-500">Danh mục PO/PR mở: {Math.floor(Math.random()*7)+2} · Hợp đồng chờ duyệt: {Math.floor(Math.random()*4)+1}</div>
              </div>
            </div>
            <button title="Xem danh mục mua sắm" className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-100" onClick={() => alert(`Mở danh mục mua sắm của ${c.label}`)}>
              Xem
            </button>
          </div>
        ))}
      </motion.div>
    );
  }

  function Approvals() {
    const tooltip = "Director: 200M/single, 1B/month · Trên ngưỡng → Exec";
    return (
      <motion.div key="ap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
        <div className="flex items-center gap-1 text-xs text-neutral-500"><Info className="h-3.5 w-3.5" />Ngưỡng phê duyệt ({VERSION}): {tooltip}</div>
        {["Phiếu mua sắm", "Hợp đồng", "Tạm ứng", "Thanh toán"].map((type, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-neutral-200 p-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs">{i + 1}</div>
              <div>
                <div className="text-sm font-semibold">{type}</div>
                <div className="text-xs text-neutral-500">Có {Math.floor(Math.random()*5)+1} phiếu chờ duyệt (công ty phụ trách)</div>
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

  function KPICompany() {
    const cards = filteredCompanies.map((c) => {
      const k = genKPI(c.id);
      const score = scoreKPI(k);
      return { company: c, k, score };
    });
    return (
      <motion.div key="kpi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
        {cards.map(({ company, k, score }, i) => (
          <div key={company.id} className="rounded-2xl border border-neutral-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {React.createElement(company.icon || Building2, { className: "h-4 w-4" })}
                <div className="text-sm font-semibold">{company.label}</div>
                <Pill>Score {score}</Pill>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => openCompanyChat(company.id, `Phân tích KPI của ${company.label} (score ${score}).`)}>Trao đổi</button>
                <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => setFocusCompanyId(company.id)}>Đặt Focus</button>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
              <div className="rounded-xl border p-2"><div className="text-neutral-500">Revenue</div><div className="text-sm font-medium">{k.revenue.toLocaleString()} tỷ</div></div>
              <div className="rounded-xl border p-2"><div className="text-neutral-500">Margin</div><div className="text-sm font-medium">{k.margin}%</div></div>
              <div className="rounded-xl border p-2"><div className="text-neutral-500">Project</div><div className="text-sm font-medium">{k.project}%</div></div>
              <div className="rounded-xl border p-2"><div className="text-neutral-500">AR Days</div><div className="text-sm font-medium">{k.arDays} ngày</div></div>
              <div className="rounded-xl border p-2"><div className="text-neutral-500">Headcount</div><div className="text-sm font-medium">{k.headcount}</div></div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  function VendorRisks() {
    const blocks = filteredCompanies.map((c) => ({ company: c, risks: genVendorRisks(c.id) }));
    return (
      <motion.div key="vr" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
        {blocks.map(({ company, risks }) => (
          <div key={company.id} className="rounded-2xl border border-neutral-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {React.createElement(company.icon || Building2, { className: "h-4 w-4" })}
                <div className="text-sm font-semibold">{company.label}</div>
              </div>
              <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-neutral-50" onClick={() => openCompanyChat(company.id, `Điều tra vendor risk của ${company.label}.`)}>Trao đổi</button>
            </div>
            <div className="overflow-auto rounded-xl border border-neutral-200">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-neutral-700">Vendor</th>
                    <th className="px-3 py-2 text-left font-semibold text-neutral-700">Delay (d)</th>
                    <th className="px-3 py-2 text-left font-semibold text-neutral-700">Disputes</th>
                    <th className="px-3 py-2 text-left font-semibold text-neutral-700">Compliance</th>
                    <th className="px-3 py-2 text-left font-semibold text-neutral-700">Score</th>
                    <th className="px-3 py-2 text-left font-semibold text-neutral-700">Level</th>
                    <th className="px-3 py-2 text-left font-semibold text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((r) => (
                    <tr key={r.id} className="border-t border-neutral-100">
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{r.delay}</td>
                      <td className="px-3 py-2">{r.disputes}</td>
                      <td className="px-3 py-2">{r.compliance}</td>
                      <td className="px-3 py-2">{r.score}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${r.level==="High"?"bg-red-100 text-red-700":r.level==="Medium"?"bg-amber-100 text-amber-700":"bg-green-100 text-green-700"}`}>{r.level}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          <button className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50" onClick={()=> openCompanyChat(company.id, `Follow-up với vendor ${r.name} (risk ${r.level}).`)}>Trao đổi</button>
                          <button className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50" onClick={()=> alert(`Mở PR/PO của ${r.name}`)}>Xem PR/PO</button>
                          <button className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50" onClick={()=> alert(`Đánh dấu theo dõi ${r.name}`)}>Theo dõi</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <div className="h-screen w-full bg-neutral-50 text-neutral-900">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-black px-3 py-1.5 text-white">
                <Home className="h-4 w-4" />
                <span className="text-sm font-semibold">ERP</span>
              </div>
              <Pill>UI 20 · Director · Final {VERSION}</Pill>
              <div className="hidden md:flex items-center gap-2">
                <Pill>Company Portfolio</Pill>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  placeholder="Tìm nhanh (⌘K)"
                  className="w-64 rounded-2xl border border-neutral-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>
              <IconBtn title="Kiểm thử" onClick={handleRunTests}>
                <CheckCircle2 className="h-4 w-4" /> <span className="text-xs">Kiểm thử</span>
              </IconBtn>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-2 py-1.5">
                <Users className="h-4 w-4" />
                <span className="text-sm">Anh (Director)</span>
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body grid */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 grid grid-cols-[280px,1fr,360px] gap-4">
        {/* Left: Portfolio & Focus company */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <SectionTitle icon={Network} title="Công ty phụ trách & bộ lọc" />
            <div className="space-y-2 text-sm">
              {companies.map((c) => (
                <label key={c.id} className="flex items-center justify-between rounded-xl px-2 py-1 hover:bg-neutral-50">
                  <span className="flex items-center gap-2">
                    {React.createElement(c.icon || Building2, { className: "h-4 w-4" })}
                    {c.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={portfolio.includes(c.id)} onChange={(e)=>{
                      setPortfolio((prev)=> e.target.checked ? [...new Set([...prev, c.id])] : prev.filter(x=>x!==c.id));
                    }} />
                    <input type="radio" name="focusCompany" checked={focusCompanyId===c.id} onChange={()=> setFocusCompanyId(c.id)} title="Focus company" />
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Bộ lọc theo công ty")}>Lọc công ty</button>
              <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Bộ lọc theo phòng ban")}>Lọc phòng ban</button>
            </div>
          </div>
        </div>

        {/* Center: Tabs + Views */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="rounded-2xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-1">
                {[
                  { id: "overview", label: "Tổng quan" },
                  { id: "matrix", label: "Ma trận" },
                  { id: "kpi", label: "KPI by company" },
                  { id: "vendorRisks", label: "Vendor risks" },
                  { id: "procurement", label: "Mua sắm" },
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
                  <Filter className="h-4 w-4" />
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
                      companies={filteredCompanies}
                      depts={depts}
                      matrix={matrix}
                      onSelectCell={(company, dept) => {
                        setSelected({ company, dept });
                        setLastCellTs(Date.now());
                        if (AUTO_OPEN_CHAT_ON_SELECT) setChatOpen(true);
                      }}
                    />
                    <div className="mt-2 text-xs text-neutral-500">Mẹo: Chọn một công ty làm <b>Focus</b> để chat mặc định theo **Company** khi chưa chọn ô ma trận gần đây.</div>
                  </motion.div>
                )}

                {tab === "kpi" && <KPICompany />}
                {tab === "vendorRisks" && <VendorRisks />}
                {tab === "procurement" && <Procurement />}
                {tab === "approvals" && <Approvals />}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Signals & Quick actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <SectionTitle icon={Bell} title="Tín hiệu công ty" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><TriangleAlert className="h-4 w-4" /><span>2 KPI dưới ngưỡng</span></div>
              <div className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4" /><span>5 phiếu chờ duyệt</span></div>
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>Họp công ty 15:30</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <SectionTitle icon={Settings} title="Hành động nhanh" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button title="Director: ≤200M/phiếu; ≤1B/tháng" className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Phân bổ ngân sách công ty")}>Phân bổ ngân sách</button>
              <button title="Director: ≤200M/phiếu; ≤1B/tháng" className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Phê duyệt nhanh")}>Phê duyệt nhanh</button>
              <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Giao Manager")}>Giao Manager</button>
              <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Xuất báo cáo công ty")}>Xuất báo cáo</button>
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
          <motion.div className="fixed inset-0 z-50 bg-black/30 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white p-4 shadow-xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Kết quả kiểm thử</div>
                <button className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50" onClick={() => setTestOpen(false)}>
                  Đóng
                </button>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {testResults.map((t, i) => (
                  <div key={i} className="flex items-start justify-between rounded-xl border border-neutral-200 p-2">
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
          onClick={() => { const res = runSelfTests({ companies, depts, matrix, route, chatStore }); setTestResults(res); setTestOpen(true); }}
          className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-neutral-50 shadow"
        >
          <CheckCircle2 className="h-4 w-4" /> Kiểm thử
        </button>
      </div>
    </div>
  );
}
