import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * UI19 – Compliance Center
 * - Trung tâm tuân thủ: Policies, Controls, Tasks, Evidence
 * - Tính năng: filter nâng cao, KPI, biểu đồ (SVG), bảng có sort/pagination/ẩn cột,
 *   drawer chỉnh sửa, activity stream, notifications, realtime mock.
 * - Thuần React + TailwindCSS (không phụ thuộc lib ngoài).
 */

const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));
const rand = (a,b)=> Math.floor(Math.random()*(b-a+1))+a;

function useInterval(cb, delay){
  const ref = useRef(cb);
  useEffect(()=>{ ref.current = cb }, [cb]);
  useEffect(()=>{
    if(delay==null) return;
    const id = setInterval(()=>ref.current(), delay);
    return ()=> clearInterval(id);
  }, [delay]);
}

// MOCK API
async function fetchCompliance({ q, framework, status, owner, page, pageSize }){
  await sleep(400);
  const total = 180;
  const make = (i)=> ({
    id: i+1,
    code: `POL-${String(i+1).padStart(3,"0")}`,
    title: `Chính sách ${i+1}`,
    framework: ["ISO27001","SOC2","GDPR","HIPAA"][i%4],
    owner: ["Lan","Tú","Nam","Vy"][i%4],
    status: ["Draft","In Review","Approved","Archived"][i%4],
    controls: 4 + (i%7),
    tasksOpen: i%5,
    nextAudit: `2025-${String((i%12)+1).padStart(2,"0")}-${String((i%27)+1).padStart(2,"0")}`,
    risk: ["Low","Medium","High"][i%3],
    updatedAt: `2025-08-${String((i%28)+1).padStart(2,"0")} ${String(i%23).padStart(2,"0")}:00`,
  });
  let rows = Array.from({length: total}, (_,i)=> make(i));
  if(q) rows = rows.filter(r=> (r.code+r.title).toLowerCase().includes(q.toLowerCase()));
  if(framework && framework!=="All") rows = rows.filter(r=> r.framework===framework);
  if(status && status!=="All") rows = rows.filter(r=> r.status===status);
  if(owner && owner!=="All") rows = rows.filter(r=> r.owner===owner);
  const filtered = rows.length;
  rows = rows.slice((page-1)*pageSize, (page-1)*pageSize+pageSize);

  const kpi = {
    policies: 240,
    controls: 940,
    openTasks: 73,
    highRisk: 11,
  };

  const controlStatus = [
    { label:"Effective", value: 58 },
    { label:"Ineffective", value: 12 },
    { label:"Design Gap", value: 8 },
    { label:"Not Tested", value: 22 },
  ];

  const schedule = Array.from({length: 12}, (_,m)=> ({
    m: m+1, audits: 2 + (m%4), tests: 4 + (m%5)
  }));

  const activities = Array.from({length: 9}, (_,i)=> ({
    id: i+1,
    actor: ["System","Lan","Tú","Nam"][i%4],
    action: ["updated policy","added evidence","assigned task","closed task"][i%4],
    ref: `#${rand(100,999)}`,
    at: `${String(8+i).padStart(2,"0")}:0${i%6}`
  }));

  return { rows, total: filtered, kpi, controlStatus, schedule, activities };
}

function Sparkline({ data, className }){
  const w=120, h=36, p=4;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v,i)=>[ p + i*(w-2*p)/(data.length-1), h-p - ((v-min)/(max-min||1))*(h-2*p) ]);
  return (
    <svg width={w} height={h} className={className}>
      <polyline points={pts.map(p2=>p2.join(",")).join(" ")} fill="none" stroke="#0f172a" strokeWidth="1.5"/>
    </svg>
  );
}

function Donut({ data }){
  const total = data.reduce((a,b)=>a+b.value,0);
  const R=56,r=28,C=2*Math.PI*R;
  let off=0; const colors=["#10b981","#ef4444","#f59e0b","#94a3b8"];
  return (
    <div className="flex items-center gap-3">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <g transform="translate(70,70)">
          <circle r={R} fill="none" stroke="#e2e8f0" strokeWidth={r}/>
          {data.map((d,i)=>{
            const pct = d.value/(total||1);
            const len = pct*C, dash=`${len} ${C-len}`;
            const el = <circle key={i} r={R} fill="none" stroke={colors[i%colors.length]} strokeWidth={r}
              strokeDasharray={dash} strokeDashoffset={-off} />;
            off += len;
            return el;
          })}
        </g>
      </svg>
      <div className="space-y-1 text-sm">
        {data.map((d,i)=>(
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded" style={{background: ["#10b981","#ef4444","#f59e0b","#94a3b8"][i%4]}}/>
            <span className="w-28">{d.label}</span><b className="tabular-nums">{d.value}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarCombo({ series }){
  const w=520,h=180,p=26;
  const max = Math.max(...series.map(s=>Math.max(s.audits,s.tests)));
  const bw = (w-2*p)/series.length;
  const path = series.map((s,i)=>{
    const x = p + i*bw + bw/2;
    const y = h-p - (s.tests/(max||1))*(h-2*p);
    return `${i?"L":"M"}${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h}>
      <line x1={p} y1={h-p} x2={w-p} y2={h-p} stroke="#cbd5e1"/>
      <line x1={p} y1={p} x2={p} y2={h-p} stroke="#cbd5e1"/>
      {series.map((s,i)=>{
        const x = p + i*bw + 6;
        const y = h-p - (s.audits/(max||1))*(h-2*p);
        const hh = h-p - y;
        return <rect key={i} x={x} y={y} width={bw-12} height={hh} rx="3" className="fill-slate-300"/>;
      })}
      <path d={path} fill="none" stroke="#0f172a" strokeWidth="1.5"/>
      {series.map((s,i)=>(
        <text key={i} x={p+i*bw+bw/2} y={h-p+12} textAnchor="middle" className="fill-slate-500 text-[10px]">{s.m}</text>
      ))}
    </svg>
  );
}

function KPI({ title, value, suffix, delta, data }){
  const pretty = useMemo(()=> (typeof value==="number"? value:0).toLocaleString("vi-VN"), [value]);
  return (
    <div className="p-4 bg-white border rounded-xl">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-2xl font-semibold">{pretty}{suffix?<span className="ml-1 text-base font-normal">{suffix}</span>:null}</div>
      <div className={`text-xs mt-1 ${delta>=0?"text-emerald-600":"text-rose-600"}`}>{delta>=0?"▲":"▼"} {Math.abs(delta)}%</div>
      {data && <Sparkline data={data} className="mt-2" />}
    </div>
  );
}

function Drawer({ open, onClose, title, children }){
  return (
    <div className={`fixed inset-0 z-40 ${open?"":"pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/20 ${open?"opacity-100":"opacity-0"}`} onClick={onClose}/>
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[560px] bg-white border-l shadow-xl transition-transform ${open? "translate-x-0":"translate-x-full"}`}>
        <div className="flex items-center justify-between h-12 px-3 border-b">
          <div className="font-semibold">{title}</div>
          <button className="px-2 py-1 border rounded" onClick={onClose}>Đóng</button>
        </div>
        <div className="p-4 overflow-auto h-[calc(100%-3rem)]">{children}</div>
      </div>
    </div>
  );
}

function Table({ rows, total, page, pageSize, onPageChange, sort, onSort }){
  const [visible, setVisible] = useState(["code","title","framework","owner","status","controls","tasksOpen","nextAudit","risk"]);
  const colsAll = [
    { key:"code", label:"Code" },
    { key:"title", label:"Tiêu đề" },
    { key:"framework", label:"Framework" },
    { key:"owner", label:"Owner" },
    { key:"status", label:"Trạng thái" },
    { key:"controls", label:"#Controls" },
    { key:"tasksOpen", label:"Tasks mở" },
    { key:"nextAudit", label:"Lịch audit" },
    { key:"risk", label:"Rủi ro" },
  ];
  const cols = colsAll.filter(c=> visible.includes(c.key));
  function toggle(k){ setVisible(v=> v.includes(k)? v.filter(x=>x!==k) : [...v,k]); }
  function th(c){
    const active = sort.key===c.key; const dir = active? (sort.dir==="asc"?"▲":"▼") : "";
    return (
      <th key={c.key} className="px-2 py-1 text-xs font-semibold text-left text-slate-500">
        <button className="inline-flex items-center gap-1" onClick={()=>onSort?.(c.key)}>{c.label} <span className="text-slate-400">{dir}</span></button>
      </th>
    );
  }
  return (
    <div className="overflow-hidden bg-white border rounded-xl">
      <div className="flex items-center justify-between px-3 py-2 text-sm border-b">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500">Cột:</span>
          {colsAll.map(c=>(
            <label key={c.key} className="inline-flex items-center gap-1">
              <input type="checkbox" checked={visible.includes(c.key)} onChange={()=>toggle(c.key)} className="rounded"/>
              <span className="text-xs">{c.label}</span>
            </label>
          ))}
        </div>
        <div className="text-slate-500">Tổng: <b className="tabular-nums">{total}</b></div>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50"><tr>{cols.map(th)}<th className="px-2 py-1 text-xs font-semibold text-right">Hành động</th></tr></thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id} className="border-t hover:bg-slate-50">
              {cols.map(c=> (<td key={c.key} className="px-2 py-1">{r[c.key]}</td>))}
              <td className="px-2 py-1 text-right">
                <button className="px-2 py-1 mr-1 border rounded" onClick={()=>alert(`Xem ${r.code}`)}>Xem</button>
                <button className="px-2 py-1 border rounded" onClick={()=>alert(`Giao việc từ ${r.code}`)}>Giao việc</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-3 py-2 text-sm border-t">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select className="px-2 py-1 border rounded" value={pageSize} onChange={e=>onPageChange?.(1, Number(e.target.value))}>{[10,20,50].map(n=><option key={n}>{n}</option>)}</select>
        </div>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 border rounded" disabled={page===1} onClick={()=>onPageChange?.(page-1, pageSize)}>Trước</button>
          <span>Trang <b>{page}</b></span>
          <button className="px-2 py-1 border rounded" disabled={page*pageSize>=total} onClick={()=>onPageChange?.(page+1, pageSize)}>Sau</button>
        </div>
      </div>
    </div>
  );
}

export default function UI19_ComplianceCenter(){
  const [filters, setFilters] = useState({ q:"", framework:"All", status:"All", owner:"All" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({ key:"updatedAt", dir:"desc" });
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [kpi, setKpi] = useState({ policies:0, controls:0, openTasks:0, highRisk:0 });
  const [cs, setCs] = useState([]);
  const [sched, setSched] = useState([]);
  const [activities, setActivities] = useState([]);

  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load(){
    setLoading(true);
    const res = await fetchCompliance({ ...filters, page, pageSize });
    const sorted = [...res.rows].sort((a,b)=>{
      const dir = sort.dir==="asc"?1:-1;
      const av=a[sort.key], bv=b[sort.key]; if(av===bv) return 0; return av>bv?dir:-dir;
    });
    setRows(sorted); setTotal(res.total);
    setKpi(res.kpi); setCs(res.controlStatus); setSched(res.schedule);
    setActivities(res.activities);
    setLoading(false);
  }
  useEffect(()=>{ load(); }, [filters, page, pageSize, sort.key, sort.dir]);

  // realtime mock: openTasks tăng/giảm nhẹ
  useInterval(()=>{
    setKpi(k=>({ ...k, openTasks: Math.max(0, k.openTasks + rand(-2,3)) }));
  }, 5000);

  function onSort(key){ setSort(s=> ({ key, dir: s.key===key ? (s.dir==="asc"?"desc":"asc") : "asc" })); }
  function onPageChange(p,ps){ setPage(p); setPageSize(ps); }

  function openEdit(row){ setEditing(row); setDrawer(true); }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-4 bg-white border-b h-14">
        <div className="font-semibold">UI19 – Compliance Center</div>
        <div className="flex items-center gap-2">
          <input className="w-64 px-2 py-1 border rounded" placeholder="Tìm policy/control..."
            value={filters.q} onChange={(e)=> setFilters(f=>({...f, q:e.target.value}))}/>
          <select className="px-2 py-1 border rounded" value={filters.framework} onChange={(e)=> setFilters(f=>({...f, framework:e.target.value}))}>
            {["All","ISO27001","SOC2","GDPR","HIPAA"].map(o=><option key={o}>{o}</option>)}
          </select>
          <select className="px-2 py-1 border rounded" value={filters.status} onChange={(e)=> setFilters(f=>({...f, status:e.target.value}))}>
            {["All","Draft","In Review","Approved","Archived"].map(o=><option key={o}>{o}</option>)}
          </select>
          <select className="px-2 py-1 border rounded" value={filters.owner} onChange={(e)=> setFilters(f=>({...f, owner:e.target.value}))}>
            {["All","Lan","Tú","Nam","Vy"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
      </header>

      <main className="p-4 mx-auto space-y-4 max-w-7xl">
        {/* KPI */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KPI title="Policies" value={kpi.policies} delta={+1.4} />
          <KPI title="Controls" value={kpi.controls} delta={+0.8} />
          <KPI title="Tasks mở" value={kpi.openTasks} delta={-2.1} />
          <KPI title="High Risk" value={kpi.highRisk} delta={+0.3} />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="p-3 bg-white border rounded-xl lg:col-span-2">
            <div className="mb-2 text-sm font-semibold">Audit & Test Schedule</div>
            {loading? <div className="h-40 rounded bg-slate-100 animate-pulse"/> : <BarCombo series={sched}/>}
          </div>
          <div className="p-3 bg-white border rounded-xl">
            <div className="mb-2 text-sm font-semibold">Trạng thái kiểm soát</div>
            {loading? <div className="h-40 rounded bg-slate-100 animate-pulse"/> : <Donut data={cs}/>}
          </div>
        </section>

        {/* Table + Activity */}
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {loading? <div className="rounded h-80 bg-slate-100 animate-pulse"/> :
              <Table rows={rows} total={total} page={page} pageSize={pageSize} onPageChange={onPageChange} sort={sort} onSort={onSort} />
            }
          </div>
          <aside className="space-y-3">
            <div className="p-3 bg-white border rounded-xl">
              <div className="mb-2 text-sm font-semibold">Hoạt động gần đây</div>
              <ul className="pr-1 space-y-2 overflow-auto max-h-72">
                {activities.map(a=> (
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
            <div className="p-3 bg-white border rounded-xl">
              <div className="mb-2 text-sm font-semibold">Mẹo</div>
              <ul className="ml-5 space-y-1 text-sm list-disc text-slate-600">
                <li>Nhấn vào mã code để mở Drawer chỉnh sửa.</li>
                <li>Dùng bộ lọc để xuất CSV theo framework.</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>

      {/* Drawer (demo) */}
      <Drawer open={drawer} onClose={()=>setDrawer(false)} title={editing? `Sửa ${editing.code}` : "Tạo mới"}>
        <form className="grid grid-cols-1 gap-3" onSubmit={(e)=>{e.preventDefault(); alert("Đã lưu (mock)"); setDrawer(false);}}>
          <div>
            <label className="block mb-1 text-xs text-slate-500">Tiêu đề</label>
            <input className="w-full px-2 py-1 border rounded" defaultValue={editing?.title || ""}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-xs text-slate-500">Framework</label>
              <select className="w-full px-2 py-1 border rounded" defaultValue={editing?.framework || "ISO27001"}>
                {["ISO27001","SOC2","GDPR","HIPAA"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs text-slate-500">Owner</label>
              <select className="w-full px-2 py-1 border rounded" defaultValue={editing?.owner || "Lan"}>
                {["Lan","Tú","Nam","Vy"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-xs text-slate-500">Mô tả</label>
            <textarea className="w-full px-2 py-1 border rounded" rows={4} defaultValue={editing? "Mô tả chính sách..." : ""} />
          </div>
          <div className="pt-2">
            <button className="px-3 py-2 text-white rounded bg-slate-900">Lưu</button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
