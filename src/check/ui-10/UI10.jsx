import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * UI10.jsx – Enterprise Overview / Command Center
 *
 * Mục tiêu:
 * - Trang tổng quan đa mô-đun, giàu chi tiết, có sẵn mock API, filter, sort, pagination, skeleton, modal, drawer
 * - Thuần React + TailwindCSS (không phụ thuộc thư viện ngoài), dễ nhúng vào Vite/React hiện tại
 * - Tái sử dụng được: tất cả subcomponents khai báo ngay trong file
 *
 * Tính năng chính:
 * 1) Shell bố cục (Topbar + Sidebar) – có thể tắt nếu đã có sẵn ở dự án
 * 2) Bộ lọc (khoảng thời gian, phòng ban, trạng thái) + tìm kiếm + quick actions
 * 3) KPI Cards (số liệu key) + mini sparkline (SVG)
 * 4) Biểu đồ tổng hợp (SVG – Bar/Line/Donut)
 * 5) Bảng dữ liệu (với sort, filter, phân trang, chọn cột, hành động hàng)
 * 6) Realtime giả lập (mock socket) – cập nhật một vài số KPI để demo
 * 7) Notifications panel, Activity stream, Approvals queue (danh sách chờ duyệt)
 * 8) ErrorBoundary và Skeleton loaders
 * 9) Accessible: aria-*, focus-trap cho modal/drawer
 */

/************************** Helpers & Mocks ***************************/
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function useInterval(callback, delay) {
  const savedRef = useRef(callback);
  useEffect(() => {
    savedRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => savedRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// Mock API
async function fetchDashboard({ q, dept, status, from, to, page, pageSize }) {
  // Mô phỏng network latency
  await sleep(500);
  const total = 128;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const makeRow = (i) => ({
    id: i + 1,
    name: `Yêu cầu #${i + 1}`,
    dept: ["Procurement", "Support", "Projects", "Sales"][i % 4],
    owner: ["Thắng", "Lan", "Tú", "Minh"][i % 4],
    status: ["Open", "In Progress", "Waiting", "Done"][i % 4],
    budget: 1000 + (i % 7) * 137,
    eta: `${2025}-${String((i % 12) + 1).padStart(2, "0")}-${String(
      (i % 27) + 1
    ).padStart(2, "0")}`,
    risk: ["Low", "Medium", "High"][i % 3],
  });

  let rows = Array.from({ length: total }, (_, i) => makeRow(i));
  if (q) rows = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  if (dept && dept !== "All") rows = rows.filter((r) => r.dept === dept);
  if (status && status !== "All") rows = rows.filter((r) => r.status === status);
  const totalFiltered = rows.length;
  rows = rows.slice(start, end);

  const kpi = {
    revenue: 1250_000,
    costs: 730_000,
    margin: 41.6,
    slaBreach: 6.8,
  };

  const timeseries = Array.from({ length: 12 }, (_, i) => ({
    m: i + 1,
    value: 100 + randomBetween(-30, 30) + i * 8,
  }));

  const donut = [
    { label: "Procurement", value: 34 },
    { label: "Support", value: 26 },
    { label: "Projects", value: 22 },
    { label: "Sales", value: 18 },
  ];

  const approvals = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1001,
    type: ["PO", "Invoice", "Access", "Policy"][i % 4],
    title: `Phê duyệt ${i % 4 === 0 ? "PO" : i % 4 === 1 ? "Hóa đơn" : i % 4 === 2 ? "Truy cập" : "Chính sách"} #${i + 1}`,
    requester: ["Hải", "Hạnh", "Dũng", "Trâm"][i % 4],
    submittedAt: `2025-08-${String(10 + i).padStart(2, "0")}`,
    amount: randomBetween(500, 9000),
    priority: ["Low", "Medium", "High"][i % 3],
  }));

  const activities = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    actor: ["System", "Lan", "Tú", "Minh"][i % 4],
    action: ["updated record", "commented", "changed status", "uploaded file"][i % 4],
    ref: `#${randomBetween(10, 99)}`,
    at: `${String(8 + i).padStart(2, "0")}:0${i % 6}`,
  }));

  return { rows, total: totalFiltered, kpi, timeseries, donut, approvals, activities };
}

/************************** Layout: Topbar & Sidebar ***************************/
function Topbar({ onToggleSidebar, onOpenNotif, onOpenCmdk }) {
  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur border-slate-200">
      <div className="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 h-14">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 border rounded-lg hover:bg-slate-50 focus:outline-none focus:ring"
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z"/></svg>
          </button>
          <span className="font-semibold">UI10 – Enterprise Overview</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              aria-label="Tìm kiếm"
              className="w-56 px-3 py-2 text-sm border md:w-72 lg:w-96 rounded-xl focus:ring focus:outline-none"
              placeholder="Tìm nhanh ( / )"
              onKeyDown={(e) => e.key === "/" && onOpenCmdk?.()}
            />
          </div>
          <button
            onClick={onOpenNotif}
            className="p-2 border rounded-lg hover:bg-slate-50 focus:outline-none focus:ring"
            aria-label="Notifications"
          >
            <BellIcon />
          </button>
          <Avatar name="Admin" />
        </div>
      </div>
    </header>
  );
}

function Sidebar({ open }) {
  return (
    <aside
      className={`$${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 ease-out fixed md:static top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-slate-200 z-20`}
      aria-label="Sidebar"
    >
      <nav className="h-full p-3 space-y-1 overflow-y-auto">
        {[
          { id: "overview", label: "Tổng quan", icon: <HomeIcon /> },
          { id: "approvals", label: "Chờ phê duyệt", icon: <CheckIcon /> },
          { id: "projects", label: "Dự án", icon: <KanbanIcon /> },
          { id: "support", label: "Hỗ trợ", icon: <LifeBuoyIcon /> },
          { id: "analytics", label: "Phân tích", icon: <ChartIcon /> },
          { id: "settings", label: "Thiết lập", icon: <SettingsIcon /> },
        ].map((i) => (
          <a key={i.id} href={`#${i.id}`} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg group hover:bg-slate-50">
            <span className="opacity-70 group-hover:opacity-100">{i.icon}</span>
            <span>{i.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

/************************** Icons ***************************/
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 10-12 0v3.2c0 .53-.21 1.04-.59 1.41L4 17h5"/>
      <path d="M9 17a3 3 0 006 0"/>
    </svg>
  );
}
function HomeIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V12H9v8a2 2 0 0 1-2 2H3z"/></svg>}
function CheckIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg>}
function KanbanIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="10" rx="1"/></svg>}
function LifeBuoyIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"/></svg>}
function ChartIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="9" width="3" height="9"/><rect x="17" y="5" width="3" height="13"/></svg>}
function SettingsIcon(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09c.7 0 1.31-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 9 4.09V4a2 2 0 1 1 4 0v.09c0 .7.4 1.31 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0c.2.6.81 1 1.51 1H22a2 2 0 1 1 0 4h-.09c-.7 0-1.31.4-1.51 1z"/></svg>}

function Avatar({ name }) {
  const initials = useMemo(() => (name ? name.split(" ").map((s) => s[0]).join("") : "A"), [name]);
  return (
    <div className="flex items-center gap-2">
      <div className="grid w-8 h-8 text-xs font-semibold text-white rounded-full bg-slate-800 place-content-center">
        {initials}
      </div>
    </div>
  );
}

/************************** Controls ***************************/
function FiltersBar({ value, onChange, onQuickAction }) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);

  function apply() {
    onChange?.(local);
  }

  return (
    <div className="flex flex-col gap-3 p-3 bg-white border border-slate-200 rounded-xl md:flex-row md:items-end">
      <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block mb-1 text-xs text-slate-500">Khoảng thời gian</label>
          <div className="flex gap-2">
            <input type="date" className="w-full px-3 py-2 border rounded-lg" value={local.from} onChange={(e)=>setLocal((s)=>({...s,from:e.target.value}))}/>
            <input type="date" className="w-full px-3 py-2 border rounded-lg" value={local.to} onChange={(e)=>setLocal((s)=>({...s,to:e.target.value}))}/>
          </div>
        </div>
        <div>
          <label className="block mb-1 text-xs text-slate-500">Phòng ban</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={local.dept} onChange={(e)=>setLocal((s)=>({...s,dept:e.target.value}))}>
            {['All','Procurement','Support','Projects','Sales'].map(o=> <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs text-slate-500">Trạng thái</label>
          <select className="w-full px-3 py-2 border rounded-lg" value={local.status} onChange={(e)=>setLocal((s)=>({...s,status:e.target.value}))}>
            {['All','Open','In Progress','Waiting','Done'].map(o=> <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs text-slate-500">Tìm kiếm</label>
          <input placeholder="Nhập từ khóa..." className="w-full px-3 py-2 border rounded-lg" value={local.q} onChange={(e)=>setLocal((s)=>({...s,q:e.target.value}))}/>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={apply} className="px-3 py-2 text-white border rounded-lg bg-slate-900 hover:opacity-90">Áp dụng</button>
        <button onClick={()=>onQuickAction?.("export") } className="px-3 py-2 border rounded-lg">Xuất Excel</button>
        <button onClick={()=>onQuickAction?.("new") } className="px-3 py-2 border rounded-lg">Tạo mới</button>
      </div>
    </div>
  );
}

/************************** Widgets ***************************/
function Sparkline({ data, className }) {
  const w = 120, h = 36, pad = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => [
    pad + (i * (w - pad * 2)) / (data.length - 1),
    h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2),
  ]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function KPI({ title, value, suffix, delta, data }) {
  const pretty = useMemo(() => {
    const v = typeof value === "number" ? value : 0;
    return v.toLocaleString("vi-VN");
  }, [value]);
  return (
    <div className="p-4 bg-white border rounded-xl">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{pretty}{suffix ? <span className="ml-1 text-base font-normal">{suffix}</span> : null}</div>
      <div className={`text-xs mt-1 ${delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{delta >=0 ? '▲' : '▼'} {Math.abs(delta)}%</div>
      {data && <Sparkline data={data} className="mt-2 text-slate-700"/>}
    </div>
  );
}

function BarLineChart({ series, className }) {
  // series: [{m,value}] – vẽ cột + đường
  const w = 520, h = 200, pad = 28;
  const max = Math.max(...series.map((s) => s.value));
  const barW = (w - pad * 2) / series.length;
  const path = series
    .map((s, i) => {
      const x = pad + i * barW + barW / 2;
      const y = h - pad - (s.value / (max || 1)) * (h - pad * 2);
      return `${i ? "L" : "M"}${x},${y}`;
    })
    .join(" ");
  return (
    <svg className={className} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* Axis */}
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#cbd5e1"/>
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#cbd5e1"/>
      {/* Bars */}
      {series.map((s, i) => {
        const x = pad + i * barW + 4;
        const y = h - pad - (s.value / (max || 1)) * (h - pad * 2);
        const height = h - pad - y;
        return <rect key={i} x={x} y={y} width={barW - 8} height={height} rx={3} className="fill-slate-300"/>;
      })}
      {/* Line */}
      <path d={path} fill="none" stroke="#0f172a" strokeWidth="1.5"/>
      {/* Labels */}
      {series.map((s, i) => (
        <text key={i} x={pad + i * barW + barW / 2} y={h - pad + 14} textAnchor="middle" className="fill-slate-500 text-[10px]">{s.m}</text>
      ))}
    </svg>
  );
}

function DonutChart({ data, className }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  const R = 68, r = 42, C = 2 * Math.PI * R;
  let offset = 0;
  const colors = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];
  return (
    <div className={`flex items-center gap-4 ${className || ''}`}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <g transform="translate(80,80)">
          <circle r={R} fill="none" stroke="#e2e8f0" strokeWidth={r} />
          {data.map((d, i) => {
            const pct = d.value / (total || 1);
            const len = pct * C;
            const dash = `${len} ${C - len}`;
            const el = (
              <circle
                key={i}
                r={R}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth={r}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
        </g>
      </svg>
      <div className="space-y-1 text-sm">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded" style={{ background: colors[i % colors.length] }} />
            <span className="w-40 text-slate-700">{d.label}</span>
            <span className="tabular-nums text-slate-500">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/************************** Table ***************************/
function DataTable({ rows, total, page, pageSize, onPageChange, sort, onSort, onRowAction }) {
  const [visibleCols, setVisibleCols] = useState(["name", "dept", "owner", "status", "budget", "eta", "risk"]);

  function toggleCol(c) {
    setVisibleCols((v) => (v.includes(c) ? v.filter((x) => x !== c) : [...v, c]));
  }
  function header(label, key) {
    const active = sort?.key === key;
    const dir = active ? (sort.dir === "asc" ? "▲" : "▼") : "";
    return (
      <th className="px-3 py-2 text-xs font-semibold text-left text-slate-500">
        <button className="inline-flex items-center gap-1" onClick={() => onSort?.(key)}>
          <span>{label}</span>
          <span className="text-slate-400">{dir}</span>
        </button>
      </th>
    );
  }

  const cols = [
    { key: "name", label: "Tên" },
    { key: "dept", label: "Phòng ban" },
    { key: "owner", label: "Phụ trách" },
    { key: "status", label: "Trạng thái" },
    { key: "budget", label: "Ngân sách" },
    { key: "eta", label: "ETA" },
    { key: "risk", label: "Rủi ro" },
  ].filter((c) => visibleCols.includes(c.key));

  return (
    <div className="overflow-hidden bg-white border rounded-xl">
      <div className="flex items-center justify-between px-3 py-2 text-sm border-b">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Cột hiển thị:</span>
          {[
            "name",
            "dept",
            "owner",
            "status",
            "budget",
            "eta",
            "risk",
          ].map((c) => (
            <label key={c} className="inline-flex items-center gap-1 text-slate-600">
              <input type="checkbox" className="rounded" checked={visibleCols.includes(c)} onChange={() => toggleCol(c)} />
              <span className="capitalize">{c}</span>
            </label>
          ))}
        </div>
        <div className="text-slate-500">Tổng: <b className="tabular-nums">{total}</b></div>
      </div>

      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr>
            {cols.map((c) => header(c.label, c.key))}
            <th className="px-3 py-2 text-xs font-semibold text-right text-slate-500">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t hover:bg-slate-50">
              {cols.map((c) => (
                <td key={c.key} className="px-3 py-2 text-sm">
                  {c.key === "budget" ? (
                    <span className="tabular-nums">{r[c.key].toLocaleString("vi-VN")} ₫</span>
                  ) : (
                    <span>{r[c.key]}</span>
                  )}
                </td>
              ))}
              <td className="px-3 py-2 text-sm text-right">
                <button className="px-2 py-1 mr-1 border rounded-lg" onClick={()=>onRowAction?.("view", r)}>Xem</button>
                <button className="px-2 py-1 mr-1 border rounded-lg" onClick={()=>onRowAction?.("edit", r)}>Sửa</button>
                <button className="px-2 py-1 border rounded-lg" onClick={()=>onRowAction?.("approve", r)}>Duyệt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-3 py-2 text-sm border-t">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select className="px-2 py-1 border rounded-lg" value={pageSize} onChange={(e)=>onPageChange?.(1, Number(e.target.value))}>
            {[10,20,50].map(n=> <option key={n} value={n}>{n}/trang</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 border rounded-lg" disabled={page===1} onClick={()=>onPageChange?.(page-1, pageSize)}>Trước</button>
          <span className="px-2">Trang <b>{page}</b></span>
          <button className="px-2 py-1 border rounded-lg" disabled={page*pageSize>=total} onClick={()=>onPageChange?.(page+1, pageSize)}>Sau</button>
        </div>
      </div>
    </div>
  );
}

/************************** Panels ***************************/
function Approvals({ items, onAction }){
  return (
    <div className="p-3 space-y-2 bg-white border rounded-xl">
      <div className="text-sm font-semibold">Chờ phê duyệt</div>
      <ul className="divide-y">
        {items.map(it=> (
          <li key={it.id} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{it.title}</div>
              <div className="text-xs text-slate-500">{it.type} • {it.requester} • {it.submittedAt}</div>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-xs px-2 py-1 rounded-full ${it.priority==='High'?'bg-rose-100 text-rose-700': it.priority==='Medium'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{it.priority}</span>
              <button className="px-2 py-1 border rounded-lg" onClick={()=>onAction?.('approve', it)}>Duyệt</button>
              <button className="px-2 py-1 border rounded-lg" onClick={()=>onAction?.('reject', it)}>Từ chối</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Activity({ items }){
  return (
    <div className="p-3 space-y-2 bg-white border rounded-xl">
      <div className="text-sm font-semibold">Hoạt động gần đây</div>
      <ul className="pr-1 space-y-2 overflow-auto max-h-72">
        {items.map(a => (
          <li key={a.id} className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">•</span>
            <span className="font-medium">{a.actor}</span>
            <span className="text-slate-600">{a.action}</span>
            <span className="text-slate-500">{a.ref}</span>
            <span className="ml-auto text-xs text-slate-400">{a.at}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Notifications({ open, onClose }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="absolute p-3 bg-white border shadow-xl right-4 top-16 w-96 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Thông báo</div>
          <button className="p-1 rounded-lg hover:bg-slate-50" onClick={onClose} aria-label="Đóng">✕</button>
        </div>
        <ul className="mt-2 overflow-auto divide-y max-h-96">
          {Array.from({length:7}, (_,i)=>({id:i+1, title:`Thông báo #${i+1}`, detail:"Cập nhật chỉ số/KPI & sự kiện hệ thống."})).map(n=> (
            <li key={n.id} className="py-2">
              <div className="text-sm font-medium">{n.title}</div>
              <div className="text-xs text-slate-500">{n.detail}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/************************** Drawers / Modals ***************************/
function Drawer({ open, onClose, title, children }){
  return (
    <div className={`fixed inset-0 z-40 ${open?'' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/20 transition-opacity ${open?'opacity-100':'opacity-0'}`} onClick={onClose}/>
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white border-l shadow-xl transition-transform ${open? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 border-b h-14">
          <div className="font-semibold">{title}</div>
          <button className="p-1 rounded-lg hover:bg-slate-50" onClick={onClose}>✕</button>
        </div>
        <div className="p-4 overflow-auto h-[calc(100%-3.5rem)]">{children}</div>
      </div>
    </div>
  );
}

function FormEdit({ row, onSubmit }){
  const [form, setForm] = useState(row || { name:"", dept:"Procurement", owner:"", status:"Open", budget:0, eta:"", risk:"Low"});
  useEffect(()=> setForm(row || form), [row]);
  function update(k, v){ setForm((s)=> ({...s, [k]: v})) }
  return (
    <form
      className="grid grid-cols-1 gap-3"
      onSubmit={(e)=>{e.preventDefault(); onSubmit?.(form)}}
    >
      {[
        ["name","Tên"],
        ["owner","Phụ trách"],
      ].map(([k,l])=> (
        <div key={k}>
          <label className="block mb-1 text-xs text-slate-500">{l}</label>
          <input className="w-full px-3 py-2 border rounded-lg" value={form[k]} onChange={(e)=>update(k,e.target.value)}/>
        </div>
      ))}
      <div>
        <label className="block mb-1 text-xs text-slate-500">Phòng ban</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={form.dept} onChange={(e)=>update('dept',e.target.value)}>
          {['Procurement','Support','Projects','Sales'].map(o=> <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-xs text-slate-500">Trạng thái</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={form.status} onChange={(e)=>update('status',e.target.value)}>
          {['Open','In Progress','Waiting','Done'].map(o=> <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-xs text-slate-500">Ngân sách</label>
        <input type="number" className="w-full px-3 py-2 border rounded-lg" value={form.budget} onChange={(e)=>update('budget', Number(e.target.value)||0)} />
      </div>
      <div>
        <label className="block mb-1 text-xs text-slate-500">ETA</label>
        <input type="date" className="w-full px-3 py-2 border rounded-lg" value={form.eta} onChange={(e)=>update('eta', e.target.value)} />
      </div>
      <div>
        <label className="block mb-1 text-xs text-slate-500">Rủi ro</label>
        <select className="w-full px-3 py-2 border rounded-lg" value={form.risk} onChange={(e)=>update('risk', e.target.value)}>
          {['Low','Medium','High'].map(o=> <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="pt-2">
        <button className="px-3 py-2 text-white border rounded-lg bg-slate-900">Lưu</button>
      </div>
    </form>
  );
}

/************************** Error Boundary ***************************/
class ErrorBoundary extends React.Component {
  constructor(props){super(props); this.state={ hasError:false, message:'' }}
  static getDerivedStateFromError(err){ return { hasError:true, message: String(err) } }
  componentDidCatch(err, info){ console.error(err, info); }
  render(){
    if(this.state.hasError){
      return (
        <div className="p-4 m-4 border rounded-xl bg-rose-50 text-rose-800">
          <div className="font-semibold">Đã xảy ra lỗi khi hiển thị UI10</div>
          <div className="mt-1 text-sm">{this.state.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

/************************** Main Page ***************************/
export default function UI10(){
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [filters, setFilters] = useState({
    q: "",
    dept: "All",
    status: "All",
    from: "2025-07-01",
    to: "2025-08-31",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({ key: "eta", dir: "asc" });

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [kpi, setKpi] = useState({ revenue:0, costs:0, margin:0, slaBreach:0 });
  const [ts, setTs] = useState([]);
  const [donut, setDonut] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [activities, setActivities] = useState([]);

  const [cmdOpen, setCmdOpen] = useState(false);

  // Fetch
  async function load(){
    setLoading(true);
    const res = await fetchDashboard({ ...filters, page, pageSize });
    const sortedRows = [...res.rows].sort((a,b)=>{
      const dir = sort.dir === 'asc' ? 1 : -1;
      const av = a[sort.key], bv = b[sort.key];
      if(av===bv) return 0; return av>bv? dir : -dir;
    });
    setRows(sortedRows);
    setTotal(res.total);
    setKpi(res.kpi);
    setTs(res.timeseries);
    setDonut(res.donut);
    setApprovals(res.approvals);
    setActivities(res.activities);
    setLoading(false);
  }
  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [filters, page, pageSize, sort.key, sort.dir]);

  // Giả lập realtime cập nhật KPI
  useInterval(()=>{
    setKpi((k)=> ({
      ...k,
      revenue: k.revenue + randomBetween(-5000, 12000),
      costs: k.costs + randomBetween(-4000, 7000),
      margin: Math.max(0, Math.min(80, k.margin + randomBetween(-1, 1))),
      slaBreach: Math.max(0, Math.min(20, k.slaBreach + randomBetween(-1,1)))
    }))
  }, 5000);

  // Handlers
  function handleQuickAction(type){
    if(type==='export') alert('Đang xuất dữ liệu (mock) ...');
    if(type==='new'){ setEditingRow(null); setDrawerOpen(true); }
  }
  function handleRowAction(type, row){
    if(type==='view'){ alert(`Xem: ${row.name}`); }
    if(type==='edit'){ setEditingRow(row); setDrawerOpen(true); }
    if(type==='approve'){ alert(`Duyệt: ${row.name}`); }
  }
  function handlePageChange(nextPage, nextSize){ setPage(nextPage); setPageSize(nextSize); }
  function handleSort(key){ setSort((s)=> ({ key, dir: s.key===key ? (s.dir==='asc'?'desc':'asc') : 'asc' })); }

  function handleSubmit(form){
    // Cập nhật vào rows (mock)
    if(editingRow){
      setRows((rs)=> rs.map(r=> r.id===editingRow.id ? { ...r, ...form } : r));
    }else{
      setRows((rs)=> [{ id: Date.now(), ...form }, ...rs]);
      setTotal((t)=> t+1);
    }
    setDrawerOpen(false);
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <Topbar
          onToggleSidebar={()=>setSidebarOpen((o)=>!o)}
          onOpenNotif={()=>setNotifOpen(true)}
          onOpenCmdk={()=>setCmdOpen(true)}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-4 pt-4">
          <Sidebar open={sidebarOpen} />

          <main className="pb-12">
            {/* Filters */}
            <FiltersBar value={filters} onChange={setFilters} onQuickAction={handleQuickAction} />

            {/* KPI Row */}
            <section className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2 lg:grid-cols-4">
              <KPI title="Doanh thu" value={kpi.revenue} suffix="₫" delta={+2.4} data={[110,112,115,120,118,125,127,130]} />
              <KPI title="Chi phí" value={kpi.costs} suffix="₫" delta={-1.2} data={[90,88,92,93,94,95,96,98]} />
              <KPI title="Biên lợi nhuận" value={kpi.margin} suffix="%" delta={+0.8} data={[38,39,40,41,42,41,42,43]} />
              <KPI title="SLA Breach" value={kpi.slaBreach} suffix="%" delta={-0.6} data={[10,9,8,9,8,7,7,6]} />
            </section>

            {/* Charts Row */}
            <section className="grid grid-cols-1 gap-3 mt-4 lg:grid-cols-3">
              <div className="col-span-2 p-3 bg-white border rounded-xl">
                <div className="mb-2 text-sm font-semibold">Hiệu suất theo tháng</div>
                {loading ? <Skeleton h={200}/> : <BarLineChart series={ts} />}
              </div>
              <div className="p-3 bg-white border rounded-xl">
                <div className="mb-2 text-sm font-semibold">Tỷ trọng theo đơn vị</div>
                {loading ? <Skeleton h={200}/> : <DonutChart data={donut} />}
              </div>
            </section>

            {/* Grid Row */}
            <section className="grid grid-cols-1 gap-3 mt-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {loading ? (
                  <Skeleton h={420}/>
                ) : (
                  <DataTable
                    rows={rows}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    sort={sort}
                    onSort={handleSort}
                    onRowAction={handleRowAction}
                  />
                )}
              </div>
              <div className="space-y-3">
                {loading ? (
                  <Skeleton h={220}/>
                ) : (
                  <Approvals items={approvals} onAction={(t,it)=>alert(`${t}: ${it.title}`)} />
                )}
                {loading ? (<Skeleton h={220}/>) : (<Activity items={activities} />)}
              </div>
            </section>
          </main>
        </div>

        {/* Notifications */}
        <Notifications open={notifOpen} onClose={()=>setNotifOpen(false)} />

        {/* Drawer Edit/Create */}
        <Drawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} title={editingRow? 'Sửa mục' : 'Tạo mới'}>
          <FormEdit row={editingRow} onSubmit={handleSubmit} />
        </Drawer>

        {/* Command Palette (đơn giản) */}
        {cmdOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/20" onClick={()=>setCmdOpen(false)} />
            <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[720px] max-w-[92vw] bg-white border rounded-2xl shadow-xl">
              <div className="flex items-center h-12 px-3 border-b">
                <input autoFocus className="w-full outline-none" placeholder="Gõ để tìm lệnh... (Esc để thoát)" onKeyDown={(e)=> e.key==='Escape' && setCmdOpen(false)} />
              </div>
              <div className="overflow-auto max-h-80">
                {["Tạo yêu cầu mới","Xuất báo cáo","Mở phễu bán hàng","Chuyển sang chế độ tối"].map((s,i)=> (
                  <button key={i} className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50">{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

/************************** Small UI **********************/
function Skeleton({ h=120 }){
  return <div className="overflow-hidden bg-white border rounded-xl">
    <div className="animate-pulse">
      <div className="h-8 bg-slate-100"/>
      <div className="p-3 space-y-2">
        <div className="h-4 rounded bg-slate-100"/>
        <div className="h-4 rounded bg-slate-100"/>
        <div className="rounded bg-slate-100" style={{ height: `${h}px` }}/>
      </div>
    </div>
  </div>
}
