import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * UI25 – Vendor Portal
 * - Quản lý nhà cung cấp: directory, đánh giá, chi tiêu, SLA giao hàng, hồ sơ & chứng từ
 * - Tính năng: filter tìm kiếm, KPI, charts (SVG), bảng vendors, drawer chi tiết vendor,
 *   tab POs/Invoices/Compliance, actions (suspend/approve), realtime mock.
 * - Thuần React + TailwindCSS.
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
async function fetchVendors({ q, status, category, page, pageSize }){
  await sleep(400);
  const cats = ["Logistics","IT","Facilities","Marketing","Consulting"];
  const total = 220;
  const mk = (i)=> ({
    id: i+1,
    code: `V-${String(i+1).padStart(4,"0")}`,
    name: `Vendor ${i+1}`,
    status: ["Active","Pending","Suspended"][i%3],
    category: cats[i%cats.length],
    rating: (i%5)+1,
    spendYTD: 10_000_000 + (i%37)*3_700_000,
    onTimeRate: 80 + (i%15),
    lastPO: `PO-${rand(1000,9999)}`,
    updatedAt: `2025-08-${String((i%28)+1).padStart(2,"0")}`,
  });
  let rows = Array.from({length: total}, (_,i)=>mk(i));
  if(q) rows = rows.filter(r=> (r.code+r.name).toLowerCase().includes(q.toLowerCase()));
  if(status && status!=="All") rows = rows.filter(r=> r.status===status);
  if(category && category!=="All") rows = rows.filter(r=> r.category===category);
  const filtered = rows.length;
  rows = rows.slice((page-1)*pageSize, (page-1)*pageSize+pageSize);

  const kpi = {
    active: 147,
    spendYTD: 4_230_000_000,
    lateDeliveries: 23,
    avgRating: 4.2,
  };

  const byMonth = Array.from({length: 12}, (_,m)=> ({
    m: m+1, deliveries: 120 + (m%7)*8, late: 10 + (m%5)*2
  }));
  const byCat = cats.map((c,i)=> ({ label: c, value: 8 + (i*3)%17 }));

  return { rows, total: filtered, kpi, byMonth, byCat };
}

function KPI({ title, value, suffix, delta, data }){
  const pretty = useMemo(()=> (typeof value==="number"? value:0).toLocaleString("vi-VN"), [value]);
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-2xl font-semibold">{pretty}{suffix?<span className="text-base ml-1 font-normal">{suffix}</span>:null}</div>
      {typeof delta==="number" && <div className={`text-xs mt-1 ${delta>=0?"text-emerald-600":"text-rose-600"}`}>{delta>=0?"▲":"▼"} {Math.abs(delta)}%</div>}
      {data && <Sparkline data={data} className="mt-2" />}
    </div>
  );
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

function BarPairs({ series }){
  const w=520,h=180,p=26;
  const max = Math.max(...series.map(s=>Math.max(s.deliveries,s.late)));
  const bw = (w-2*p)/series.length;
  return (
    <svg width={w} height={h}>
      <line x1={p} y1={h-p} x2={w-p} y2={h-p} stroke="#cbd5e1"/>
      <line x1={p} y1={p} x2={p} y2={h-p} stroke="#cbd5e1"/>
      {series.map((s,i)=>{
        const x = p + i*bw + 4;
        const y1 = h-p - (s.deliveries/(max||1))*(h-2*p);
        const h1 = h-p - y1;
        const y2 = h-p - (s.late/(max||1))*(h-2*p);
        const h2 = h-p - y2;
        return (
          <g key={i}>
            <rect x={x} y={y1} width={(bw-10)/2} height={h1} rx="3" className="fill-slate-300"/>
            <rect x={x+(bw-10)/2+6} y={y2} width={(bw-10)/2} height={h2} rx="3" className="fill-slate-500"/>
            <text x={p+i*bw+bw/2} y={h-p+12} textAnchor="middle" className="fill-slate-500 text-[10px]">{s.m}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Donut({ data }){
  const total = data.reduce((a,b)=>a+b.value,0);
  const R=56,r=28,C=2*Math.PI*R;
  let off=0; const colors=["#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6"];
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
      <div className="text-sm space-y-1">
        {data.map((d,i)=>(
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded" style={{background: ["#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6"][i%5]}}/>
            <span className="w-32">{d.label}</span><b className="tabular-nums">{d.value}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function VendorTable({ rows, total, page, pageSize, onPageChange, sort, onSort, onOpen }){
  const colsAll=[
    {key:"code",label:"Code"},
    {key:"name",label:"Tên"},
    {key:"status",label:"Trạng thái"},
    {key:"category",label:"Nhóm"},
    {key:"rating",label:"Rating"},
    {key:"spendYTD",label:"Spend YTD"},
    {key:"onTimeRate",label:"On-Time %"},
    {key:"lastPO",label:"Last PO"},
    {key:"updatedAt",label:"Cập nhật"},
  ];
  const [visible, setVisible] = useState(colsAll.map(c=>c.key));
  const cols = colsAll.filter(c=>visible.includes(c.key));
  function toggle(k){ setVisible(v=> v.includes(k)? v.filter(x=>x!==k) : [...v,k]); }
  function th(c){
    const active = sort.key===c.key; const dir = active? (sort.dir==="asc"?"▲":"▼") : "";
    return (
      <th key={c.key} className="px-2 py-1 text-left text-xs font-semibold text-slate-500">
        <button className="inline-flex items-center gap-1" onClick={()=>onSort?.(c.key)}>{c.label}<span className="text-slate-400">{dir}</span></button>
      </th>
    );
  }
  return (
    <div className="border rounded-xl bg-white overflow-hidden">
      <div className="px-3 py-2 border-b flex items-center justify-between text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500">Cột:</span>
          {colsAll.map(c=>(
            <label key={c.key} className="inline-flex items-center gap-1">
              <input type="checkbox" className="rounded" checked={visible.includes(c.key)} onChange={()=>toggle(c.key)}/>
              <span className="text-xs">{c.label}</span>
            </label>
          ))}
        </div>
        <div className="text-slate-500">Tổng: <b className="tabular-nums">{total}</b></div>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50"><tr>{cols.map(th)}<th className="px-2 py-1 text-right text-xs font-semibold">Hành động</th></tr></thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r.id} className="border-t hover:bg-slate-50">
              {cols.map(c=> (
                <td key={c.key} className="px-2 py-1">
                  {c.key==="spendYTD"? <span className="tabular-nums">{r[c.key].toLocaleString("vi-VN")} ₫</span> :
                   c.key==="rating"? "★".repeat(r[c.key]) :
                   r[c.key]}
                </td>
              ))}
              <td className="px-2 py-1 text-right">
                <button className="px-2 py-1 border rounded mr-1" onClick={()=>onOpen(r)}>Chi tiết</button>
                <button className="px-2 py-1 border rounded" onClick={()=>alert(`Suspend ${r.code}`)}>Suspend</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 border-t flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select className="border rounded px-2 py-1" value={pageSize} onChange={e=>onPageChange?.(1, Number(e.target.value))}>{[10,20,50].map(n=><option key={n}>{n}</option>)}</select>
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

function Drawer({ open, onClose, title, children }){
  return (
    <div className={`fixed inset-0 z-40 ${open?"":"pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/20 ${open?"opacity-100":"opacity-0"}`} onClick={onClose}/>
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[760px] bg-white border-l shadow-xl transition-transform ${open? "translate-x-0":"translate-x-full"}`}>
        <div className="h-12 border-b flex items-center justify-between px-3">
          <div className="font-semibold">{title}</div>
          <button className="px-2 py-1 border rounded" onClick={onClose}>Đóng</button>
        </div>
        <div className="p-4 overflow-auto h-[calc(100%-3rem)]">{children}</div>
      </div>
    </div>
  );
}

function VendorDetail({ v }){
  const [tab,setTab]=useState("profile");
  if(!v) return <div className="text-sm text-slate-500">Chưa chọn vendor</div>;
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xl font-semibold">{v.name} <span className="text-xs font-normal px-2 py-1 rounded bg-slate-100">{v.code}</span></div>
          <div className="text-sm text-slate-500">{v.category} • Cập nhật: {v.updatedAt}</div>
        </div>
        <div className="text-sm">
          <div>Trạng thái: <b>{v.status}</b></div>
          <div>On-time: <b>{v.onTimeRate}%</b></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border rounded p-3">
          <div className="text-sm font-semibold mb-2">Deliveries theo tháng</div>
          <BarPairs series={Array.from({length:12},(_,m)=>({m:m+1, deliveries:100+(m%7)*9, late:8+(m%5)*2 }))}/>
        </div>
        <div className="border rounded p-3">
          <div className="text-sm font-semibold mb-2">Tỷ trọng theo nhóm</div>
          <Donut data={[{label:"IT",value:28},{label:"Logistics",value:22},{label:"Consulting",value:18},{label:"Facilities",value:14},{label:"Marketing",value:18}]}/>
        </div>
      </div>

      <nav className="flex gap-1">
        {["profile","pos","invoices","compliance"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded ${tab===t?"bg-slate-900 text-white":"border"}`}>{t.toUpperCase()}</button>
        ))}
      </nav>

      {tab==="profile" && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border rounded p-3">
            <div className="text-sm font-semibold mb-2">Thông tin chính</div>
            <ul className="text-sm space-y-1">
              <li>Đánh giá: {"★".repeat(v.rating)}</li>
              <li>Spend YTD: <b className="tabular-nums">{v.spendYTD.toLocaleString("vi-VN")} ₫</b></li>
              <li>Liên hệ: procurement@vendor.com</li>
              <li>Địa chỉ: 123 Industrial Park, City</li>
            </ul>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm font-semibold mb-2">Tài liệu</div>
            <ul className="text-sm list-disc ml-5 space-y-1">
              <li>Hợp đồng chính (PDF)</li>
              <li>Chứng chỉ ISO 9001 (PDF)</li>
              <li>Biên bản NDA (PDF)</li>
            </ul>
          </div>
        </section>
      )}

      {tab==="pos" && (
        <section className="border rounded p-3">
          <div className="text-sm font-semibold mb-2">Danh sách PO gần đây</div>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr><th className="px-2 py-1 text-left">PO</th><th className="px-2 py-1">Ngày</th><th className="px-2 py-1">Trị giá</th><th className="px-2 py-1">Trạng thái</th></tr>
            </thead>
            <tbody>
              {Array.from({length:6},(_,i)=> ({
                po: `PO-${1000+i}`, date:`2025-0${(i%6)+1}-15`, amount: 50_000_000 + i*7_500_000, status:["New","Shipping","Received","Closed"][i%4]
              })).map((r,i)=>(
                <tr key={i} className="border-t">
                  <td className="px-2 py-1 text-left">{r.po}</td>
                  <td className="px-2 py-1 text-center">{r.date}</td>
                  <td className="px-2 py-1 text-center tabular-nums">{r.amount.toLocaleString("vi-VN")} ₫</td>
                  <td className="px-2 py-1 text-center">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab==="invoices" && (
        <section className="border rounded p-3">
          <div className="text-sm font-semibold mb-2">Hóa đơn gần đây</div>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr><th className="px-2 py-1 text-left">INV</th><th className="px-2 py-1">Ngày</th><th className="px-2 py-1">Số tiền</th><th className="px-2 py-1">Trạng thái</th></tr>
            </thead>
            <tbody>
              {Array.from({length:6},(_,i)=> ({
                inv: `INV-${2000+i}`, date:`2025-0${(i%6)+1}-28`, amount: 25_000_000 + i*6_000_000, status:["Pending","Approved","Paid"][i%3]
              })).map((r,i)=>(
                <tr key={i} className="border-t">
                  <td className="px-2 py-1 text-left">{r.inv}</td>
                  <td className="px-2 py-1 text-center">{r.date}</td>
                  <td className="px-2 py-1 text-center tabular-nums">{r.amount.toLocaleString("vi-VN")} ₫</td>
                  <td className="px-2 py-1 text-center">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab==="compliance" && (
        <section className="border rounded p-3">
          <div className="text-sm font-semibold mb-2">Tuân thủ & Chứng từ</div>
          <ul className="text-sm list-disc ml-5 space-y-1">
            <li>W-9 / Tax Form (2025)</li>
            <li>COI – Chứng nhận bảo hiểm (hết hạn: 2026-01-01)</li>
            <li>ISO 27001 Statement of Applicability (SoA)</li>
          </ul>
          <div className="mt-2">
            <button className="px-3 py-2 border rounded mr-2">Yêu cầu cập nhật tài liệu</button>
            <button className="px-3 py-2 border rounded">Đánh giá lại</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default function UI25_VendorPortal(){
  const [filters, setFilters] = useState({ q:"", status:"All", category:"All" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({ key:"updatedAt", dir:"desc" });
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [kpi, setKpi] = useState({ active:0, spendYTD:0, lateDeliveries:0, avgRating:0 });
  const [month, setMonth] = useState([]);
  const [cat, setCat] = useState([]);

  const [drawer, setDrawer] = useState(false);
  const [active, setActive] = useState(null);

  async function load(){
    setLoading(true);
    const res = await fetchVendors({ ...filters, page, pageSize });
    const sorted = [...res.rows].sort((a,b)=>{
      const dir = sort.dir==="asc"?1:-1;
      const av=a[sort.key], bv=b[sort.key]; if(av===bv) return 0; return av>bv?dir:-dir;
    });
    setRows(sorted); setTotal(res.total);
    setKpi(res.kpi); setMonth(res.byMonth); setCat(res.byCat);
    setLoading(false);
  }
  useEffect(()=>{ load(); }, [filters, page, pageSize, sort.key, sort.dir]);

  useInterval(()=>{
    setKpi(k=> ({ ...k, lateDeliveries: Math.max(0, k.lateDeliveries + rand(-1,2)) }));
  }, 5000);

  function onSort(key){ setSort(s=> ({ key, dir: s.key===key ? (s.dir==="asc"?"desc":"asc") : "asc" })); }
  function onPageChange(p,ps){ setPage(p); setPageSize(ps); }
  function openDetail(v){ setActive(v); setDrawer(true); }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-14 bg-white border-b flex items-center px-4 justify-between">
        <div className="font-semibold">UI25 – Vendor Portal</div>
        <div className="flex items-center gap-2">
          <input className="border rounded px-2 py-1 w-64" placeholder="Tìm vendor/code..."
            value={filters.q} onChange={(e)=> setFilters(f=>({...f, q:e.target.value}))}/>
          <select className="border rounded px-2 py-1" value={filters.status} onChange={(e)=> setFilters(f=>({...f, status:e.target.value}))}>
            {["All","Active","Pending","Suspended"].map(o=><option key={o}>{o}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={filters.category} onChange={(e)=> setFilters(f=>({...f, category:e.target.value}))}>
            {["All","Logistics","IT","Facilities","Marketing","Consulting"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {/* KPI */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <KPI title="Vendors Active" value={kpi.active} delta={+1.2} />
          <KPI title="Spend YTD" value={kpi.spendYTD} suffix="₫" delta={+0.9}/>
          <KPI title="Late Deliveries" value={kpi.lateDeliveries} delta={-3.1}/>
          <KPI title="Avg Rating" value={kpi.avgRating} />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="border rounded-xl bg-white p-3 lg:col-span-2">
            <div className="text-sm font-semibold mb-2">Giao hàng theo tháng</div>
            {loading? <div className="h-40 bg-slate-100 animate-pulse rounded"/> : <BarPairs series={month}/>}
          </div>
          <div className="border rounded-xl bg-white p-3">
            <div className="text-sm font-semibold mb-2">Tỷ trọng theo nhóm NCC</div>
            {loading? <div className="h-40 bg-slate-100 animate-pulse rounded"/> : <Donut data={cat}/>}
          </div>
        </section>

        {/* Table */}
        <section>
          {loading? <div className="h-80 bg-slate-100 animate-pulse rounded"/> :
            <VendorTable rows={rows} total={total} page={page} pageSize={pageSize} onPageChange={onPageChange} sort={sort} onSort={onSort} onOpen={openDetail}/>
          }
        </section>
      </main>

      {/* Drawer */}
      <Drawer open={drawer} onClose={()=>setDrawer(false)} title={active? `Vendor ${active.code}` : "Chi tiết vendor"}>
        <VendorDetail v={active} />
      </Drawer>
    </div>
  );
}
