import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * UI43 – Data Catalog & Lineage
 * - Danh mục dữ liệu, tìm kiếm, gắn nhãn, xem lineage (đồ thị SVG), preview schema, ownership, SLA
 * - Thuần React + Tailwind, dữ liệu mock, có filter, sort, pagination, drawer chi tiết
 */

const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));
const rand = (a,b)=> Math.floor(Math.random()*(b-a+1))+a;

// MOCK API
async function fetchCatalog({ q, domain, tag, page, pageSize, sortBy, sortDir }){
  await sleep(400);
  const total=173;
  const start=(page-1)*pageSize, end=Math.min(total,start+pageSize);
  const make = (i)=> ({
    id:i+1,
    name:`dataset_${String(i+1).padStart(3,"0")}`,
    title:`Bộ dữ liệu ${i+1}`,
    domain:["Sales","Finance","Operations","HR","Marketing"][i%5],
    tags:["pii","gold","bronze","silver","external","internal"].slice(0,(i%5)+1),
    rows: 10_000 + (i%23)*1_337,
    sizeMB: 120 + (i%41)*7,
    freshness: ["<1h","<24h","<3d","stale"][i%4],
    owner: ["Lan","Tú","Nam","Vy"][i%4],
    updatedAt: `2025-08-${String((i%28)+1).padStart(2,"0")} ${String(i%23).padStart(2,"0")}:00`,
    upstream: [rand(1,15),rand(16,30)].map(n=>`ds_${n}`),
    downstream: [rand(31,45),rand(46,60)].map(n=>`ds_${n}`),
    schema: [
      { name:"id", type:"int", pk:true, desc:"Khóa chính" },
      { name:"customer_name", type:"string", desc:"Tên KH" },
      { name:"email", type:"string", pii:true },
      { name:"amount", type:"decimal(18,2)" },
      { name:"created_at", type:"timestamp" },
    ]
  });
  let rows = Array.from({length:total},(_,i)=>make(i));
  if(q) rows = rows.filter(r=> (r.name+r.title).toLowerCase().includes(q.toLowerCase()));
  if(domain && domain!=="All") rows = rows.filter(r=> r.domain===domain);
  if(tag && tag!=="All") rows = rows.filter(r=> r.tags.includes(tag));
  if(sortBy){
    rows = rows.sort((a,b)=>{
      const A=a[sortBy], B=b[sortBy];
      const dir = sortDir==="asc"?1:-1;
      if(A===B) return 0;
      return A>B?dir:-dir;
    });
  }
  return { rows: rows.slice(start,end), total: rows.length };
}

export default function UI43_DataCatalog(){
  const [q,setQ]=useState("");
  const [domain,setDomain]=useState("All");
  const [tag,setTag]=useState("All");
  const [page,setPage]=useState(1);
  const [pageSize,setPageSize]=useState(20);
  const [sortBy,setSortBy]=useState("updatedAt");
  const [sortDir,setSortDir]=useState("desc");
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [rows,setRows]=useState([]);
  const [total,setTotal]=useState(0);
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(null);

  const exportJSON = (payload, filename = 'data_catalog_export.json') => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const exportFiltered = () => exportJSON({ exportedAt: new Date().toISOString(), filter:{ q, domain, tag }, count: rows.length, rows }, `catalog_filtered_${new Date().toISOString()}.json`);
  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), total, rows }, `catalog_all_${new Date().toISOString()}.json`);

  async function load(){
    setLoading(true); setError(null);
    try {
      const res = await fetchCatalog({ q, domain, tag, page, pageSize, sortBy, sortDir });
      setRows(res.rows); setTotal(res.total);
    } catch(err) {
      setError(err?.message || 'Failed to load catalog');
      setRows([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{ load() },[q,domain,tag,page,pageSize,sortBy,sortDir]);

  function openDetail(r){ setActive(r); setOpen(true); }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-14 bg-white border-b flex items-center px-4 justify-between">
        <div className="font-semibold">UI43 – Data Catalog &amp; Lineage</div>
        <div className="flex gap-2 items-center">
          <input className="border rounded px-2 py-1 w-64" placeholder="Tìm dataset..."
            value={q} onChange={e=>{setPage(1);setQ(e.target.value)}}/>
          <select className="border rounded px-2 py-1" value={domain} onChange={e=>{setPage(1);setDomain(e.target.value)}}>
            {["All","Sales","Finance","Operations","HR","Marketing"].map(o=><option key={o}>{o}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={tag} onChange={e=>{setPage(1);setTag(e.target.value)}}>
            {["All","pii","gold","silver","bronze","internal","external"].map(o=><option key={o}>{o}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <button onClick={load} className="px-2 py-1 border rounded">Refresh</button>
            <button onClick={exportFiltered} className="px-2 py-1 bg-blue-600 text-white rounded" disabled={loading||rows.length===0}>Export filtered</button>
            <button onClick={exportAll} className="px-2 py-1 border rounded" disabled={loading||total===0}>Export all</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        <div className="bg-white border rounded p-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span>Sắp xếp</span>
            <select className="border rounded px-2 py-1" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
              <option value="updatedAt">Cập nhật</option>
              <option value="rows">Số dòng</option>
              <option value="sizeMB">Dung lượng</option>
              <option value="name">Tên</option>
            </select>
            <button className="border rounded px-2 py-1" onClick={()=>setSortDir(d=> d==="asc"?"desc":"asc")}>
              {sortDir==="asc"?"▲ asc":"▼ desc"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span>Tổng: <b className="tabular-nums">{total}</b></span>
            <select className="border rounded px-2 py-1" value={pageSize} onChange={e=>{setPage(1);setPageSize(Number(e.target.value))}}>
              {[10,20,50].map(n=><option key={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {loading ? Array.from({length:9},(_,i)=>(
            <div key={i} className="h-40 bg-white border rounded animate-pulse" />
          )) : error ? (
            <div className="col-span-full p-4 text-xs text-red-500 flex items-center gap-3">
              <div>{error}</div>
              <button onClick={load} className="px-2 py-1 bg-gray-100 rounded">Retry</button>
            </div>
          ) : rows.map(r => (
            <div key={r.id} className="bg-white border rounded p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-xs text-slate-500">{r.name} • {r.domain}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${r.freshness.includes("stale")?"bg-rose-100 text-rose-700":"bg-emerald-100 text-emerald-700"}`}>{r.freshness}</span>
              </div>
              <div className="text-xs text-slate-600">Tags: {r.tags.map(t=>(<code key={t} className="mr-1 px-1 rounded bg-slate-100">{t}</code>))}</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 border rounded">
                  <div className="text-slate-500">Rows</div>
                  <div className="font-semibold tabular-nums">{r.rows.toLocaleString("vi-VN")}</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-slate-500">Size</div>
                  <div className="font-semibold">{r.sizeMB} MB</div>
                </div>
                <div className="p-2 border rounded">
                  <div className="text-slate-500">Owner</div>
                  <div className="font-semibold">{r.owner}</div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Cập nhật: {r.updatedAt}</span>
                <button className="px-2 py-1 border rounded" onClick={()=>openDetail(r)}>Chi tiết</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <button className="px-2 py-1 border rounded" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Trước</button>
          <span>Trang <b>{page}</b></span>
          <button className="px-2 py-1 border rounded" disabled={page*pageSize>=total} onClick={()=>setPage(p=>p+1)}>Sau</button>
        </div>
      </main>

      {/* Drawer detail */}
      <div className={`fixed inset-0 z-40 ${open?"":"pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/20 ${open?"opacity-100":"opacity-0"}`} onClick={()=>setOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full sm:w-[720px] bg-white border-l shadow-xl transition-transform ${open? "translate-x-0":"translate-x-full"}`}>
          <div className="h-12 border-b flex items-center justify-between px-3">
            <div className="font-semibold">Chi tiết dataset</div>
            <button className="px-2 py-1 border rounded" onClick={()=>setOpen(false)}>Đóng</button>
          </div>
          <div className="p-4 space-y-4 overflow-auto h-[calc(100%-3rem)]">
            {!active? <div className="text-sm text-slate-500">Chưa chọn dataset</div> : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xl font-semibold">{active.title}</div>
                    <div className="text-sm text-slate-500">{active.name} • {active.domain}</div>
                  </div>
                  <div className="text-xs text-slate-500">Cập nhật: {active.updatedAt}</div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border rounded p-3">
                    <div className="text-sm font-semibold mb-2">Schema</div>
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-2 py-1">Field</th>
                          <th className="px-2 py-1">Type</th>
                          <th className="px-2 py-1">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {active.schema.map((c,i)=>(
                          <tr key={i} className="border-t">
                            <td className="px-2 py-1"><code>{c.name}</code>{c.pk && <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-slate-100">PK</span>}</td>
                            <td className="px-2 py-1">{c.type}</td>
                            <td className="px-2 py-1 text-slate-600">{c.desc || (c.pii?"PII": "")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-sm font-semibold mb-2">Lineage</div>
                    <LineageGraph upstream={active.upstream} current={active.name} downstream={active.downstream} />
                  </div>
                </section>

                <section className="border rounded p-3">
                  <div className="text-sm font-semibold mb-2">Thông tin & SLA</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <Info title="Owner" value={active.owner}/>
                    <Info title="Freshness" value={active.freshness}/>
                    <Info title="Rows" value={active.rows.toLocaleString("vi-VN")}/>
                    <Info title="Dung lượng" value={`${active.sizeMB} MB`}/>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({title, value}){
  return <div className="p-2 border rounded">
    <div className="text-slate-500 text-xs">{title}</div>
    <div className="font-semibold">{value}</div>
  </div>
}

function LineageGraph({ upstream=[], current="current", downstream=[] }){
  // Đồ thị đơn giản bằng SVG: upstream -> current -> downstream
  const w=640, h=160;
  const cx=w/2, cy=h/2;
  const up = upstream.map((u,i)=>({ x: 120, y: 40 + i*(h-80)/Math.max(1,upstream.length-1), label:u }));
  const dn = downstream.map((d,i)=>({ x: w-120, y: 40 + i*(h-80)/Math.max(1,downstream.length-1), label:d }));
  return (
    <svg width={w} height={h} className="border rounded">
      {/* edges */}
      {up.map((n,i)=>(<line key={"u"+i} x1={n.x+50} y1={n.y} x2={cx-70} y2={cy} stroke="#cbd5e1"/>))}
      {dn.map((n,i)=>(<line key={"d"+i} x1={cx+70} y1={cy} x2={n.x-50} y2={n.y} stroke="#cbd5e1"/>))}
      {/* nodes */}
      {up.map((n,i)=>(<Node key={"nu"+i} x={n.x} y={n.y} label={n.label}/>))}
      <Node x={cx-40} y={cy-18} w={80} h={36} label={current} main/>
      {dn.map((n,i)=>(<Node key={"nd"+i} x={n.x-80} y={n.y-18} w={80} h={36} label={n.label}/>))}
    </svg>
  )
}

function Node({ x, y, w=100, h=32, label, main=false }){
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height={h} rx="8" className={main? "fill-slate-900":"fill-white"} stroke="#cbd5e1" />
      <text x={w/2} y={h/2+4} textAnchor="middle" className={main?"fill-white":"fill-slate-800"} fontSize="12">{label}</text>
    </g>
  )
}
