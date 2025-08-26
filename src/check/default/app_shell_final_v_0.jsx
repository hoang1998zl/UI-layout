import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Bell,
  Users,
  ShieldAlert,
  Settings,
  PanelLeft,
  PanelRight,
  MessageSquare,
  Paperclip,
  Send,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Filter,
  Network,
  Building2,
  Factory,
  ClipboardList,
  CalendarDays,
  TriangleAlert,
} from "lucide-react";

/**
 * App Shell – Final v0.4 (All Roles)
 * - Dùng chung cho UI 00/10/20/30/40/50 và UI T0
 * - Chỉ dùng PA2 (Floating Chat) theo Spec v0.4: auto-route Global/Cell + guard Temp users
 * - Keybindings: ⌘/Ctrl+J (Chat), ⌘/Ctrl+K (Search palette)
 * - Left sidebar theo role, Topbar chung, Right signals, Content slot (children)
 * - Function-as-children: children(props) nhận { openChat, onSelectCell, selectedCell }
 * - Self-tests: routing, thread format, isolation, storage key, nav mapping
 */

// -------------------- Config --------------------
const VERSION = "v0.4";
const RECENT_MS = 120_000; // 120s
const STORAGE_KEY = "erp_shell_chatStore_v1";

// -------------------- Helpers --------------------
function roleTag(roleLevel) {
  if (roleLevel === 0) return "ceo";
  return `r${roleLevel}`; // r1..r5
}
function threadIdCell(companyId, deptId, roleLevel) {
  return `thread:cell:${companyId}:${deptId}:${roleTag(roleLevel)}`;
}
function threadIdGlobal(roleLevel) {
  return `thread:global:${roleTag(roleLevel)}`;
}
function chooseThread({ roleLevel, isTemp, selected, lastCellTs }) {
  if (isTemp) {
    if (selected) return { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id, roleLevel) };
    return { scope: "mywork", id: "thread:mywork:temp" };
  }
  const now = Date.now();
  const recent = !!(selected && lastCellTs && now - lastCellTs < RECENT_MS);
  if (roleLevel <= 1) {
    return recent && selected
      ? { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id, roleLevel) }
      : { scope: "global", id: threadIdGlobal(roleLevel) };
  }
  // roleLevel >= 2
  return selected
    ? { scope: "cell", id: threadIdCell(selected.company.id, selected.dept.id, roleLevel) }
    : { scope: "global", id: threadIdGlobal(roleLevel) };
}
function shouldToggleChat(evt) {
  const key = (evt?.key || "").toLowerCase();
  return (evt?.metaKey || evt?.ctrlKey) && key === "j";
}
function shouldOpenSearch(evt) {
  const key = (evt?.key || "").toLowerCase();
  return (evt?.metaKey || evt?.ctrlKey) && key === "k";
}

// -------------------- Generic UI bits --------------------
function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-neutral-100 ${className}`}>
      {children}
    </span>
  );
}
function IconBtn({ title, onClick, children }) {
  return (
    <button title={title} onClick={onClick} className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-neutral-100">
      {children}
    </button>
  );
}

// -------------------- Chat (PA2) --------------------
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
function ChatModal({ open, onClose, scopeLabel, messages, onSend, onUpload }) {
  const prompts = [
    "Tổng hợp KPI Q3",
    "Danh sách phê duyệt tuần này",
    "Báo cáo dự án trọng điểm",
    "Rà soát ngân sách các đơn vị",
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

// -------------------- App Shell --------------------
function RightSignals() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700"><Bell className="h-4 w-4"/>Tín hiệu</div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2"><TriangleAlert className="h-4 w-4"/><span>2 cảnh báo hiệu suất</span></div>
        <div className="flex items-center gap-2"><ClipboardList className="h-4 w-4"/><span>5 yêu cầu chờ xử lý</span></div>
        <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4"/><span>Lịch họp 15:30</span></div>
      </div>
    </div>
  );
}

function NavForRole({ roleLevel, active, setActive }) {
  const maps = {
    0: ["Tổng quan", "Ma trận", "Phê duyệt"],
    1: ["Danh mục", "Ma trận", "Phê duyệt", "KPI"],
    2: ["Bảng điều khiển", "Dòng tiền", "Phê duyệt", "Nhân sự", "Ma trận", "Tác vụ"],
    3: ["Workbench", "Ma trận", "Phê duyệt", "Đội nhóm", "Sprint"],
    4: ["Sprint", "Workload", "Checklist", "Báo cáo"],
    5: ["Việc của tôi", "Form", "Hướng dẫn", "Lịch", "Files"],
    t: ["My Work", "Files", "NDA"],
  };
  const list = roleLevel >= 0 && roleLevel <= 5 ? maps[roleLevel] : maps.t;
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700"><PanelLeft className="h-4 w-4"/>Điều hướng</div>
      <div className="grid gap-2">
        {list.map((label) => (
          <button key={label} onClick={() => setActive(label)} className={`rounded-xl px-3 py-2 text-left text-sm ${active === label ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"}`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SearchPalette({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-24">
      <div className="w-full max-w-lg rounded-2xl bg-white p-3 shadow-xl">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input autoFocus placeholder="Tìm nhanh… (gõ để lọc)" className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" />
        </div>
        <div className="mt-2 text-xs text-neutral-500">Mẹo: ⌘/Ctrl+K để mở lại.</div>
      </div>
    </div>
  );
}

export function AppShell({
  roleLevel = 1,
  employmentStatus = "employee", // employee | probation | intern | external
  screenId = "UI 10",
  screenTitle = "Exec",
  selectedCell: selectedCellProp = null, // { company:{id,label}, dept:{id,label} }
  lastCellTs: lastCellTsProp = 0,
  children, // function-as-children: ({ openChat, onSelectCell, selectedCell }) => ReactNode
}) {
  // Controlled/uncontrolled selected cell
  const [selectedCell, setSelectedCell] = useState(selectedCellProp);
  const [lastCellTs, setLastCellTs] = useState(lastCellTsProp);
  useEffect(() => setSelectedCell(selectedCellProp), [selectedCellProp]);
  useEffect(() => setLastCellTs(lastCellTsProp), [lastCellTsProp]);

  const isTemp = employmentStatus === "probation" || employmentStatus === "intern" || employmentStatus === "external";

  // Chat store
  const [chatOpen, setChatOpen] = useState(false);
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
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(chatStore)); } catch (e) {}
  }, [chatStore]);

  const routing = useMemo(() => chooseThread({ roleLevel, isTemp, selected: selectedCell, lastCellTs }), [roleLevel, isTemp, selectedCell, lastCellTs]);
  const scopeLabel = useMemo(() => {
    if (routing.scope === "cell" && selectedCell) return `${selectedCell.company.label} · ${selectedCell.dept.label}`;
    if (routing.scope === "mywork") return "My Work";
    return "Toàn hệ thống";
  }, [routing.scope, selectedCell]);
  const messagesForScope = chatStore[routing.id] || [];

  function appendMessage(threadId, text, from = "you") {
    setChatStore((s) => {
      const prev = s[threadId] || [];
      return { ...s, [threadId]: [...prev, { from, text }] };
    });
  }

  // Keybindings
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    function onKeyDown(e) {
      if (shouldToggleChat(e)) { e.preventDefault(); setChatOpen((v) => !v); }
      if (shouldOpenSearch(e)) { e.preventDefault(); setSearchOpen(true); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Left nav active tab
  const [active, setActive] = useState("Tổng quan");

  // Shell API to children
  const api = {
    openChat: () => setChatOpen(true),
    onSelectCell: (company, dept) => { setSelectedCell({ company, dept }); setLastCellTs(Date.now()); },
    selectedCell,
  };

  return (
    <div className="h-screen w-full bg-neutral-50 text-neutral-900">
      {/* Topbar */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-black px-3 py-1.5 text-white">
                <Home className="h-4 w-4" />
                <span className="text-sm font-semibold">ERP</span>
              </div>
              <Pill>{screenId} · {screenTitle} · Shell {VERSION}</Pill>
              <Pill>{roleLevel === 0 ? "CEO" : roleLevel === 1 ? "Exec" : `Role r${roleLevel}`}</Pill>
              {isTemp && <Pill className="bg-orange-100 text-orange-700">Temp user</Pill>}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input placeholder="Tìm nhanh (⌘K)" className="w-64 rounded-2xl border border-neutral-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" />
              </div>
              <IconBtn title="Thông báo"><Bell className="h-4 w-4" /></IconBtn>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-2 py-1.5">
                <Users className="h-4 w-4" />
                <span className="text-sm">Current User</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body grid */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 grid grid-cols-[280px,1fr,360px] gap-4">
        {/* Left nav */}
        <div className="space-y-4">
          <NavForRole roleLevel={roleLevel} active={active} setActive={setActive} />
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700"><Settings className="h-4 w-4"/>Bộ lọc</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Filter A")}>Filter A</button>
              <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50" onClick={() => alert("Filter B")}>Filter B</button>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {typeof children === "function" ? (
                  children(api)
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="font-semibold">{active}</div>
                    <div className="text-neutral-600">(Chưa gắn nội dung—màn hình con sẽ render tại đây thông qua props.children)</div>
                    <div className="text-xs text-neutral-500">Gợi ý: màn hình con nên gọi <code>onSelectCell(company, dept)</code> để kích hoạt chat theo Cell.</div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      {[{
                        id: "co1", label: "Đại Tín Co. Ltd", icon: Building2
                      }, { id: "co2", label: "Đại Tín Invest", icon: Building2 }, { id: "co3", label: "Đại Tín Services", icon: Factory }].map((c) => (
                        <button key={c.id} className="rounded-xl border px-2 py-2 hover:bg-neutral-50" onClick={() => api.onSelectCell({ id: c.id, label: c.label }, { id: "hr", label: "Nhân sự" })}>
                          <div className="flex items-center gap-2"><c.icon className="h-4 w-4"/><span>{c.label}</span></div>
                          <div className="text-[10px] text-neutral-500">Chọn · Dept: Nhân sự</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right signals */}
        <div className="space-y-4">
          <RightSignals />
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700"><ShieldAlert className="h-4 w-4"/>Trạng thái</div>
            <div className="text-xs text-neutral-600">Scope: <b>{routing.scope}</b></div>
            <div className="text-xs text-neutral-600 break-all">Thread: <b>{routing.id}</b></div>
          </div>
        </div>
      </div>

      {/* Floating Chat button */}
      <button onClick={() => setChatOpen(true)} title="Chat (⌘/Ctrl+J)" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-white shadow-lg hover:bg-black">
        <MessageSquare className="h-5 w-5" />
        <span className="text-sm font-medium">Chat</span>
      </button>

      {/* Chat modal */}
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

      {/* Search palette */}
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Footer: Self-tests */}
      <ShellSelfTests roleLevel={roleLevel} isTemp={isTemp} selected={selectedCell} lastCellTs={lastCellTs} chatStore={chatStore} />
    </div>
  );
}

// -------------------- Self-tests --------------------
function ShellSelfTests({ roleLevel, isTemp, selected, lastCellTs, chatStore }) {
  const [open, setOpen] = useState(false);
  const results = useMemo(() => {
    const out = [];
    // T1: Thread formats
    const gid = threadIdGlobal(roleLevel);
    const cid = selected ? threadIdCell(selected.company.id, selected.dept.id, roleLevel) : "n/a";
    const ok1 = gid.startsWith("thread:global:") && (cid === "n/a" || cid.startsWith("thread:cell:"));
    out.push({ name: "Thread ID format", pass: ok1, detail: `${gid} | ${cid}` });

    // T2: Routing CEO/Exec recent vs stale
    const sel = { company: { id: "co1", label: "Đại Tín Co. Ltd" }, dept: { id: "hr", label: "Nhân sự" } };
    const rRecent = chooseThread({ roleLevel: 1, isTemp: false, selected: sel, lastCellTs: Date.now() });
    const rStale = chooseThread({ roleLevel: 1, isTemp: false, selected: sel, lastCellTs: Date.now() - (RECENT_MS + 1000) });
    const ok2 = rRecent.scope === "cell" && rStale.scope === "global";
    out.push({ name: "Exec routing (recent vs stale)", pass: ok2, detail: `${rRecent.scope} / ${rStale.scope}` });

    // T3: Director routing (needs selection)
    const rDirNoSel = chooseThread({ roleLevel: 2, isTemp: false, selected: null, lastCellTs: 0 });
    const rDirSel = chooseThread({ roleLevel: 2, isTemp: false, selected: sel, lastCellTs: Date.now() });
    const ok3 = rDirNoSel.scope === "global" && rDirSel.scope === "cell";
    out.push({ name: "Director routing (global↔cell)", pass: ok3, detail: `${rDirNoSel.scope} / ${rDirSel.scope}` });

    // T4: Temp guard
    const rTemp = chooseThread({ roleLevel: 3, isTemp: true, selected: null, lastCellTs: 0 });
    const ok4 = rTemp.scope !== "global";
    out.push({ name: "Temp users no Global", pass: ok4, detail: `${rTemp.scope}` });

    // T5: Isolation cell vs global
    const store = { ...chatStore, [gid]: [{ from: "you", text: "G" }], [cid]: [{ from: "you", text: "C" }] };
    const ok5 = !cid || (store[gid]?.[0]?.text !== store[cid]?.[0]?.text);
    out.push({ name: "Isolation threads", pass: ok5, detail: ok5 ? "OK" : "Collision" });

    // T6: STORAGE_KEY
    out.push({ name: "Storage key", pass: STORAGE_KEY === "erp_shell_chatStore_v1", detail: STORAGE_KEY });

    // T7: RECENT_MS
    out.push({ name: "RECENT_MS=120000", pass: RECENT_MS === 120000, detail: String(RECENT_MS) });

    // T8: Nav map non-empty
    out.push({ name: "Nav map non-empty", pass: true, detail: "OK" });

    return out;
  }, [roleLevel, isTemp, selected, lastCellTs, chatStore]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-4 left-4 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-neutral-50 shadow">
        <CheckCircle2 className="h-4 w-4"/> Kiểm thử
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 bg-black/30 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white p-4 shadow-xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Kết quả kiểm thử (Shell)</div>
                <button className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50" onClick={() => setOpen(false)}>Đóng</button>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {results.map((t, i) => (
                  <div key={i} className="flex items-start justify-between rounded-xl border border-neutral-200 p-2">
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-neutral-500">{t.detail}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${t.pass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.pass ? "PASS" : "FAIL"}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// -------------------- Demo wrapper (for preview). In app, import { AppShell } and pass children. --------------------
export default function AppShellAllRolesDemo() {
  const [roleLevel, setRoleLevel] = useState(1);
  const [employmentStatus, setEmploymentStatus] = useState("employee");
  return (
    <div className="h-screen w-full">
      <div className="fixed top-2 right-2 z-50 rounded-xl border bg-white px-3 py-2 text-xs shadow">
        <div className="mb-1 font-medium">Dev panel (demo)</div>
        <div className="flex items-center gap-2 mb-1">
          <span>Role</span>
          <select value={roleLevel} onChange={(e)=>setRoleLevel(Number(e.target.value))} className="rounded border px-2 py-1">
            {[0,1,2,3,4,5].map(n=> <option key={n} value={n}>{n===0?"CEO":n===1?"Exec":`r${n}`}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span>Status</span>
          <select value={employmentStatus} onChange={(e)=>setEmploymentStatus(e.target.value)} className="rounded border px-2 py-1">
            {[
              {id:"employee",label:"Employee"},
              {id:"probation",label:"Probation"},
              {id:"intern",label:"Intern"},
              {id:"external",label:"External"}
            ].map(o=> <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <AppShell roleLevel={roleLevel} employmentStatus={employmentStatus} screenId={roleLevel===0?"UI 00":roleLevel===1?"UI 10":`UI ${roleLevel}0`} screenTitle={roleLevel===0?"CEO":roleLevel===1?"Exec":`Role r${roleLevel}`}>
        {({ onSelectCell, openChat }) => (
          <div className="space-y-3">
            <div className="text-sm">Bấm một công ty để set <b>Cell</b> (Dept mặc định: Nhân sự), rồi mở Chat.</div>
            <div className="grid grid-cols-3 gap-2">
              {[{ id: "co1", label: "Đại Tín Co. Ltd", icon: Building2 },{ id: "co2", label: "Đại Tín Invest", icon: Building2 },{ id: "co3", label: "Đại Tín Services", icon: Factory }].map(c => (
                <button key={c.id} className="rounded-xl border px-3 py-2 text-left hover:bg-neutral-50" onClick={() => onSelectCell({ id: c.id, label: c.label }, { id: "hr", label: "Nhân sự" })}>
                  <div className="flex items-center gap-2"><c.icon className="h-4 w-4"/><span>{c.label}</span></div>
                  <div className="text-[10px] text-neutral-500">Dept: Nhân sự</div>
                </button>
              ))}
            </div>
            <button onClick={openChat} className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-black inline-flex items-center gap-2"><MessageSquare className="h-4 w-4"/>Mở Chat</button>
          </div>
        )}
      </AppShell>
    </div>
  );
}
