import React, { useEffect, useState } from "react";

/**
 * UI45 – Privacy Center
 * - Quản lý yêu cầu quyền riêng tư (DSAR), xóa/ẩn dữ liệu, mapping dữ liệu PII, chính sách retention
 * - Có tabs: Requests, Data Map, Retention; kèm bảng, filters, actions
 */

const sleep=(ms)=> new Promise(r=>setTimeout(r,ms));

async function fetchRequests({ q, status }){
  await sleep(300);
  const total=60;
  let rows = Array.from({length:total},(_,i)=> ({
    id: 1000+i,
    subject: ["Quyền truy cập","Yêu cầu xóa","Chỉnh sửa dữ liệu","Hạn chế xử lý"][i%4],
    requester: ["Ngọc","Tâm","Huy","Hương"][i%4],
    status: ["Open","Processing","Done"][i%3],
    received: `2025-08-${String((i%28)+1).padStart(2,"0")}`,
    due: `2025-09-${String((i%28)+1).padStart(2,"0")}`,
    risk: ["Low","Medium","High"][i%3]
  }));
  if(q) rows = rows.filter(r=> r.subject.toLowerCase().includes(q.toLowerCase()));
  if(status && status!=="All") rows = rows.filter(r=> r.status===status);
  return { rows, total: rows.length };
}

export default function UI45_PrivacyCenter(){
  const [tab,setTab]=useState("requests");
  const [q,setQ]=useState("");
  const [status,setStatus]=useState("All");
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);

  async function load(){
    setLoading(true);
    if(tab==="requests"){
      const res=await fetchRequests({ q, status });
      setRows(res.rows.slice(0,20));
    }
    setLoading(false);
  }
  useEffect(()=>{ load() },[tab,q,status]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-4 bg-white border-b h-14">
        <div className="font-semibold">UI45 – Privacy Center</div>
        <div className="flex items-center gap-2">
          <input className="px-2 py-1 border rounded" placeholder="Tìm..." value={q} onChange={e=>setQ(e.target.value)}/>
          {tab==="requests" && (
            <select className="px-2 py-1 border rounded" value={status} onChange={e=>setStatus(e.target.value)}>
              {["All","Open","Processing","Done"].map(o=><option key={o}>{o}</option>)}
            </select>
          )}
        </div>
      </header>

      <main className="p-4 mx-auto space-y-4 max-w-7xl">
        <nav className="flex gap-1 p-1 bg-white border rounded">
          {["requests","map","retention"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded ${tab===t?"bg-slate-900 text-white":"border"}`}>
              {t==="requests"?"Requests": t==="map"?"Data Map":"Retention"}
            </button>
          ))}
        </nav>

        {tab==="requests" && (
          <section className="p-3 bg-white border rounded">
            <div className="mb-2 text-sm font-semibold">DSAR Requests</div>
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-2 py-1 text-left">Subject</th>
                  <th className="px-2 py-1">Requester</th>
                  <th className="px-2 py-1">Status</th>
                  <th className="px-2 py-1">Received</th>
                  <th className="px-2 py-1">Due</th>
                  <th className="px-2 py-1">Risk</th>
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {loading? <tr><td colSpan={7} className="p-4 text-center">Đang tải...</td></tr> :
                  rows.map(r=> (
                    <tr key={r.id} className="border-t hover:bg-slate-50">
                      <td className="px-2 py-1 text-left">{r.subject}</td>
                      <td className="px-2 py-1 text-center">{r.requester}</td>
                      <td className="px-2 py-1 text-center">{r.status}</td>
                      <td className="px-2 py-1 text-center">{r.received}</td>
                      <td className="px-2 py-1 text-center">{r.due}</td>
                      <td className="px-2 py-1 text-center">{r.risk}</td>
                      <td className="px-2 py-1 text-right">
                        <button className="px-2 py-1 mr-1 border rounded">Chi tiết</button>
                        <button className="px-2 py-1 border rounded">Hoàn tất</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </section>
        )}

        {tab==="map" && (
          <section className="p-3 space-y-3 bg-white border rounded">
            <div className="text-sm font-semibold">Data Map (PII)</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {["Customers","Leads","Invoices","HR_Employees","SupportTickets","AuditLogs"].map((n,i)=>(
                <div key={n} className="p-3 border rounded">
                  <div className="font-semibold">{n}</div>
                  <div className="mb-2 text-xs text-slate-500">Hệ thống: {["DWH","CRM","ERP"][i%3]}</div>
                  <ul className="ml-5 space-y-1 text-sm list-disc">
                    <li>Email (PII)</li>
                    <li>Full name (PII)</li>
                    <li>Phone (PII)</li>
                    <li>Address (PII)</li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab==="retention" && (
          <section className="p-3 space-y-3 bg-white border rounded">
            <div className="text-sm font-semibold">Retention Policies</div>
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-2 py-1 text-left">Dataset</th>
                  <th className="px-2 py-1">Policy</th>
                  <th className="px-2 py-1">Duration</th>
                  <th className="px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {["Customers","Invoices","Employees","Leads"].map((d,i)=>(
                  <tr key={d} className="border-t">
                    <td className="px-2 py-1 text-left">{d}</td>
                    <td className="px-2 py-1 text-center">{i%2===0?"Delete":"Anonymize"}</td>
                    <td className="px-2 py-1 text-center">{i%2===0?"730 days":"365 days"}</td>
                    <td className="px-2 py-1 text-center"><button className="px-2 py-1 border rounded">Sửa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  )
}
