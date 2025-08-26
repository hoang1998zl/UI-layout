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
  Info
} from "lucide-react";

/**
 * UI 00 — CEO (User 0)
 * FINAL v0.4 — PA2 only (Floating Chat Modal)
 * - Auto-route per v0.4: CEO Global-first, switch to Cell if recent cell interaction (< RECENT_MS)
 * - Storage key unified: erp_ui00_ceo_chatStore_v1
 * - Thread IDs unified: thread:global:ceo | thread:cell:<companyId>:<deptId>:ceo
 * - Temp-user guard (probation/intern/external) blocks Global; fallback My Work (simulated)
 * - Added tooltips for approval thresholds
 * - Self-tests T1–T10 (incl. new T7–T10)
 */

// -------------------- Config --------------------
const RECENT_MS = 120_000; // 120s per Spec v0.4
const STORAGE_KEY = "erp_ui00_ceo_chatStore_v1";

// -------------------- Demo data --------------------
const demoCompanies = [
  { id: "grp", label: "Tập đoàn", icon: Network },
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
    id: "grp",
    label: "Tập đoàn Đại Tín",
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
          { id: "br2", label: "Chi nhánh Quận 1", type: "branch", children: [] },
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
                  {c.icon ? <c.icon className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
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

// -------------------- Chat store & auto-routing --------------------
const ROLE_LEVEL = 0; // CEO

function threadIdCell(companyId, deptId) {
  return `thread:cell:${companyId}:${deptId}:ceo`;
}
function threadIdGlobal() {
  return `thread:global:ceo`;
}

/**
 * Auto-route per v0.4
 * - CEO (level 0): default GLOBAL, switch to CELL if selected & recent (<RECENT_MS)
 * - Temp user guard: if isTemp -> NO GLOBAL, use MyWork thread
 */
function chooseThread({ selected, lastCellTs, isTemp }) {
  if (isTemp) {
    if (selected) return { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id) };
    return { scope: "mywork", id: "thread:mywork:temp" };
  }
  const now = Date.now();
  const recent = !!(selected && lastCellTs && now - lastCellTs < RECENT_MS);
  if (recent && selected) return { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id) };
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
    "Tổng hợp KPI Q3",
    "Danh sách phê duyệt tuần này",
    "Báo cáo dự án trọng điểm",
    "Rà soát ngân sách các công ty",
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

  // T1: Matrix shape and value bounds
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

  // T2: Chat append
  const sample = [{ from: "system", text: "x" }];
  const sim = simulateChat(sample, "Hello");
  const pass2 = sim.length === 3 && sim[1].from === "you" && sim[2].from === "assistant";
  results.push({ name: "Chat simulate append", pass: pass2, detail: pass2 ? "OK" : "Append failed" });

  // T3: Keyboard toggle
  const pass3 = shouldToggleByKey({ key: "j", metaKey: true }) && !shouldToggleByKey({ key: "k", metaKey: true });
  results.push({ name: "Toggle ⌘/Ctrl+J", pass: !!pass3, detail: pass3 ? "OK" : "Logic sai" });

  // T4: Thread ID format
  const gid = threadIdGlobal();
  const cid = threadIdCell("co1", "hr");
  const ok4 = gid === "thread:global:ceo" && cid === "thread:cell:co1:hr:ceo";
  results.push({ name: "Thread ID format (ceo)", pass: ok4, detail: ok4 ? "OK" : `gid=${gid} cid=${cid}` });

  // T5: Store isolation (cell vs global)
  const s = { ...chatStore, [gid]: [{ from: "you", text: "G-global" }], [cid]: [{ from: "you", text: "C-cell" }] };
  const ok5 = (s[gid].length === 1 && s[cid].length === 1 && s[gid][0].text !== s[cid][0].text);
  results.push({ name: "Isolation cell vs global", pass: ok5, detail: ok5 ? "OK" : "Không tách kho" });

  // T6: Persistence serialization
  const ser = JSON.stringify(s);
  const back = JSON.parse(ser);
  const ok6 = back && back[gid] && back[cid] && back[gid][0].text === "G-global" && back[cid][0].text === "C-cell";
  results.push({ name: "Persistence (serialize/parse)", pass: ok6, detail: ok6 ? "OK" : "Sai serialize/parse" });

  // T7: CEO routing recent vs stale
  const sel = { company: { id: "co1", label: "Đại Tín Co. Ltd" }, dept: { id: "hr", label: "Nhân sự" } };
  const rRecent = route({ selected: sel, lastCellTs: Date.now(), isTemp: false });
  const rStale = route({ selected: sel, lastCellTs: Date.now() - (RECENT_MS + 1000), isTemp: false });
  const ok7 = rRecent.scope === "cell" && rStale.scope === "global";
  results.push({ name: "Routing CEO (recent vs stale)", pass: ok7, detail: ok7 ? "OK" : `recent=${rRecent.scope} stale=${rStale.scope}` });

  // T8: CEO global thread id stays constant
  const rGlobal1 = route({ selected: null, lastCellTs: 0, isTemp: false });
  const rGlobal2 = route({ selected: null, lastCellTs: 0, isTemp: false });
  const ok8 = rGlobal1.id === rGlobal2.id && rGlobal1.id === "thread:global:ceo";
  results.push({ name: "Global thread id stable", pass: ok8, detail: ok8 ? "OK" : rGlobal1.id + " vs " + rGlobal2.id });

  // T9: Temp-user guard blocks global
  const gTemp = route({ selected: null, lastCellTs: 0, isTemp: true });
  const cTemp = route({ selected: sel, lastCellTs: Date.now(), isTemp: true });
  const ok9 = gTemp.scope !== "global" && (cTemp.scope === "cell" || cTemp.scope === "mywork");
  results.push({ name: "Temp guard (no global)", pass: ok9, detail: ok9 ? "OK" : `g=${gTemp.scope} c=${cTemp.scope}` });

  // T10: STORAGE_KEY sanity
  const ok10 = STORAGE_KEY === "erp_ui00_ceo_chatStore_v1";
  results.push({ name: "Storage key", pass: ok10, detail: ok10 ? "OK" : STORAGE_KEY });

  return results;
}

// -------------------- Main App (UI 00 – CEO) --------------------
export default function UI00CEO() {
  const [org, setOrg] = useState(seedOrg);
  const [companies, setCompanies] = useState(demoCompanies);
  const [depts, setDepts] = useState(demoDepts);
  const [matrix, setMatrix] = useState(() => makeMatrix(demoCompanies, demoDepts));
  const [tab, setTab] = useState("overview"); // overview | matrix | approvals
  const [selected, setSelected] = useState(null);
  const [lastCellTs, setLastCellTs] = useState(0);
  const [chatOpen, setChatOpen] = useState(false); // PA2 modal state
  const [testOpen, setTestOpen] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Simulate employment status (CEO is never temp, but test needs guard)
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

  const route = ({ selected, lastCellTs, isTemp }) => chooseThread({ selected, lastCellTs, isTemp });
  const routing = useMemo(() => route({ selected, lastCellTs, isTemp }), [selected, lastCellTs, isTemp]);
  const scopeLabel = useMemo(() => {
    if (routing.scope === "cell" && selected) return `${selected.company.label} · ${selected.dept.label}`;
    if (routing.scope === "mywork") return "My Work";
    return "Toàn hệ thống";
  }, [routing.scope, selected]);
  const messagesForScope = chatStore[routing.id] || [];

  // Keyboard shortcut for PA2
  useEffect(() => {
    function onKeyDown(e) {
      if (shouldToggleByKey(e)) {
        e.preventDefault();
        setChatOpen((v) => !v);
      }
    }
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

  // ---------- Views ----------
  function Overview() {
    return (
      <motion.div key="ov" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {["Doanh thu", "Lợi nhuận", "CapEx", "OPEX", "Tiến độ dự án", "Rủi ro"].map((k, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 p-4">
            <div className="text-sm font-semibold mb-2">{k}</div>
            <div className="h-24 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs">(Chart giả lập)</div>
            <div className="mt-2 text-xs text-neutral-500">Cập nhật gần nhất: hôm nay</div>
          </div>
        ))}
      </motion.div>
    );
  }

  function Approvals() {
    const tooltip = "CEO: Full · Exec: 1B/single, 5B/month · Director: 200M/single, 1B/month";
    return (
      <motion.div key="ap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
        <div className="flex items-center gap-1 text-xs text-neutral-500"><Info className="h-3.5 w-3.5" />Ngưỡng phê duyệt (v0.4): {tooltip}</div>
        {["Phiếu mua sắm", "Hợp đồng", "Tạm ứng", "Thanh toán"].map((type, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-neutral-200 p-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs">{i + 1}</div>
              <div>
                <div className="text-sm font-semibold">{type}</div>
                <div className="text-xs text-neutral-500">Có {Math.floor(Math.random()*5)+1} phiếu chờ duyệt</div>
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
              <Pill>UI 00 · CEO · Final v0.4</Pill>
              <div className="hidden md:flex items-center gap-2">
                <Pill>Tổng quan hệ thống</Pill>
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
                <span className="text-sm">Anh (CEO)</span>
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body grid */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 grid grid-cols-[280px,1fr,360px] gap-4">
        {/* Left: Org & Filters */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <SectionTitle icon={Network} title="Tổ chức & bộ lọc" />
            <OrgTree data={org} onQuickAdd={handleQuickAdd} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Bộ lọc theo công ty")}>Lọc theo công ty</button>
              <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Bộ lọc theo phòng ban")}>Lọc theo phòng ban</button>
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
                      companies={companies}
                      depts={depts}
                      matrix={matrix}
                      onSelectCell={(company, dept) => {
                        setSelected({ company, dept });
                        setLastCellTs(Date.now());
                      }}
                    />
                    <div className="mt-2 text-xs text-neutral-500">Mẹo: Click vào từng ô để chat đúng ngữ cảnh hoặc tạo chỉ đạo.</div>
                  </motion.div>
                )}

                {tab === "approvals" && <Approvals />}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Signals & Quick actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <SectionTitle icon={Bell} title="Tín hiệu CxO" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><TriangleAlert className="h-4 w-4" /><span>2 KPI toàn tập đoàn dưới ngưỡng</span></div>
              <div className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4" /><span>5 phiếu trình chờ duyệt</span></div>
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>Họp chiến lược 15:30</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <SectionTitle icon={Settings} title="Hành động nhanh" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button title="CEO: Full · Exec: 1B/5B · Director: 200M/1B" className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Tạo chỉ đạo mới")}>Tạo chỉ đạo</button>
              <button title="CEO: Full · Exec: 1B/5B · Director: 200M/1B" className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Giao nhiệm vụ")}>Giao nhiệm vụ</button>
              <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Xuất báo cáo KPI")}>Xuất KPI</button>
              <button title="CEO: Full · Exec: 1B/5B · Director: 200M/1B" className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Phê duyệt nhanh")}>Phê duyệt nhanh</button>
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
          onClick={handleRunTests}
          className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-neutral-50 shadow"
        >
          <CheckCircle2 className="h-4 w-4" /> Kiểm thử
        </button>
      </div>
    </div>
  );
}
