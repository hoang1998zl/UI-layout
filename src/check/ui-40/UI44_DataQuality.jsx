import React, { useEffect, useState } from "react";

/**
 * UI44 – Data Quality Monitoring
 * - Nền tảng theo dõi chất lượng dữ liệu: test suites, incident, rules, trending chart, heatmap SLA
 * - Có filter, bảng, drawer chỉnh rule, tạo incident
 */

const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));
const rnd = (a,b)=> Math.floor(Math.random()*(b-a+1))+a;

async function fetchDQ({ q, severity, page, pageSize }){
  await sleep(400);
  const total = 96;
  const mk = (i)=> ({
    id:i+1,
    suite:`suite_${String((i%12)+1).padStart(2,"0")}`,
    rule:`not_null_${i%5}`,
    severity:["low","medium","high","critical"][i%4],
    failures:rnd(0,20),
    lastRun:`2025-08-${String((i%28)+1).padStart(2,"0")} ${String(i%23).padStart(2,"0")}:00`,
    owner:["Lan","Tú","Nam","Vy"][i%4],
    trend: Array.from({length:14},()=> rnd(88,100)),
  });
  let rows = Array.from({length:total},(_,i)=> mk(i));
  if(q) rows = rows.filter(r=> (r.suite+r.rule).includes(q));
  if(severity && severity!=="All") rows = rows.filter(r=> r.severity===severity);
  return { rows, total: rows.length };
}

export default function UI44_DataQuality(){
  const [q,setQ]=useState("");
  const [severity,setSeverity]=useState("All");
  const [page,setPage]=useState(1);
  const [pageSize,setPageSize]=useState(20);
  const [rows,setRows]=useState([]);
  const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [drawer,setDrawer]=useState(false);
  const [editing,setEditing]=useState(null);

  async function load(){
    setLoading(true); setError(null);
    try {
      const res = await fetchDQ({ q, severity, page, pageSize });
      setTotal(res.total);
      setRows(res.rows.slice((page-1)*pageSize, (page-1)*pageSize+pageSize));
    } catch(err) {
      setError(err?.message || 'Failed to load rules');
      setRows([]); setTotal(0);
    } finally { setLoading(false); }
  }
  useEffect(()=>{ load() },[q,severity,page,pageSize]);

  function openEdit(r){ setEditing(r); setDrawer(true); }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-14 bg-white border-b flex items-center px-4 justify-between">
        <div className="font-semibold">UI44 – Data Quality Monitoring</div>
        <div className="flex gap-2 items-center">
          <input className="border rounded px-2 py-1" placeholder="Tìm rule/suite" value={q} onChange={e=>{setPage(1);setQ(e.target.value)}}/>
          <select className="border rounded px-2 py-1" value={severity} onChange={e=>{setPage(1);setSeverity(e.target.value)}}>
            {["All","low","medium","high","critical"].map(o=><option key={o}>{o}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <button onClick={load} className="px-2 py-1 border rounded">Refresh</button>
            <button onClick={()=> exportJSON({ exportedAt: new Date().toISOString(), filter:{q,severity}, count: total, rows }, `dq_export_${new Date().toISOString()}.json`)} className="px-2 py-1 bg-blue-600 text-white rounded">Export</button>
          </div>
        </div>
      </header>
   
   <main className="max-w-7xl mx-auto p-4 space-y-4">
     <div className="bg-white border rounded p-3">
       <div className="text-sm font-semibold mb-2">Danh sách Rules</div>
          {loading ? (
            <div className="p-4 text-center">Đang tải...</div>
          ) : error ? (
            <div className="p-4 text-xs text-red-500 flex items-center gap-3">
              <div>{error}</div>
              <button onClick={load} className="px-2 py-1 bg-gray-100 rounded">Retry</button>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-2 py-1 text-left">Suite</th>
                  <th className="px-2 py-1 text-left">Rule</th>
                  <th className="px-2 py-1">Severity</th>
                  <th className="px-2 py-1">Failures (14d)</th>
                  <th className="px-2 py-1">Trend</th>
                  <th className="px-2 py-1">Owner</th>
                  <th className="px-2 py-1">Last run</th>
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r=>(
                  <tr key={r.id} className="border-t hover:bg-slate-50">
                    <td className="px-2 py-1">{r.suite}</td>
                    <td className="px-2 py-1">{r.rule}</td>
                    <td className="px-2 py-1 text-center"><Badge s={r.severity}/></td>
                    <td className="px-2 py-1 text-center">{r.failures}</td>
                    <td className="px-2 py-1"><MiniTrend data={r.trend}/></td>
                    <td className="px-2 py-1">{r.owner}</td>
                    <td className="px-2 py-1">{r.lastRun}</td>
                    <td className="px-2 py-1 text-right">
                      <button className="px-2 py-1 border rounded mr-1" onClick={()=>openEdit(r)}>Sửa</button>
                      <button className="px-2 py-1 border rounded">Tạo Incident</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

           <div className="flex items-center justify-between p-2 border-t text-sm">
             <span>Tổng: {total}</span>
             <div className="flex gap-2">
               <button className="px-2 py-1 border rounded" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Trước</button>
               <span>Trang {page}</span>
               <button className="px-2 py-1 border rounded" disabled={page*pageSize>=total} onClick={()=>setPage(p=>p+1)}>Sau</button>
               <select className="border rounded px-2 py-1" value={pageSize} onChange={e=>{setPage(1);setPageSize(Number(e.target.value))}}>
                 {[10,20,50].map(n=><option key={n}>{n}</option>)}
               </select>
             </div>
           </div>
         </div>
       </main>

      {/* Drawer edit rule */}
      <div className={`fixed inset-0 z-40 ${drawer?"":"pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/20 ${drawer?"opacity-100":"opacity-0"}`} onClick={()=>setDrawer(false)} />
        <div className={`absolute right-0 top-0 h-full w-full sm:w-[560px] bg-white border-l shadow-xl transition-transform ${drawer? "translate-x-0":"translate-x-full"}`}>
          <div className="h-12 border-b flex items-center justify-between px-3">
            <div className="font-semibold">Chỉnh sửa Rule</div>
            <button className="px-2 py-1 border rounded" onClick={()=>setDrawer(false)}>Đóng</button>
          </div>
          <div className="p-4 space-y-3">
            {!editing? <div className="text-sm text-slate-500">Chưa chọn rule</div> :
            <form className="grid grid-cols-1 gap-3" onSubmit={(e)=>{e.preventDefault(); alert("Đã lưu (mock)")}}>
              <div>
                <label className="text-xs text-slate-500">Suite</label>
                <input className="w-full border rounded px-2 py-1" defaultValue={editing.suite}/>
              </div>
              <div>
                <label className="text-xs text-slate-500">Rule</label>
                <input className="w-full border rounded px-2 py-1" defaultValue={editing.rule}/>
              </div>
              <div>
                <label className="text-xs text-slate-500">Severity</label>
                <select className="w-full border rounded px-2 py-1" defaultValue={editing.severity}>
                  {["low","medium","high","critical"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Điều kiện</label>
                <textarea className="w-full border rounded px-2 py-1" rows={4} defaultValue={"amount IS NOT NULL AND amount > 0"} />
              </div>
              <div>
                <button className="px-3 py-2 rounded bg-slate-900 text-white">Lưu</button>
              </div>
            </form>}
          </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ s }){
  const cls = s==="critical"?"bg-rose-100 text-rose-700": s==="high"?"bg-amber-100 text-amber-700": s==="medium"?"bg-sky-100 text-sky-700":"bg-emerald-100 text-emerald-700";
  return <span className={`px-2 py-1 rounded-full text-xs ${cls}`}>{s}</span>
}

function MiniTrend({ data }){
  const w=140,h=32,p=3;
  const min=Math.min(...data), max=Math.max(...data);
  const pts=data.map((v,i)=>[p+i*(w-2*p)/(data.length-1), h-p - ((v-min)/(max-min||1))*(h-2*p)]);
  return (
    <svg width={w} height={h}>
      <polyline points={pts.map(p=>p.join(",")).join(" ")} fill="none" stroke="#0f172a" strokeWidth="1.5"/>
    </svg>
  )
}

// export helper
function exportJSON(payload, filename = 'dq_export.json'){
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
