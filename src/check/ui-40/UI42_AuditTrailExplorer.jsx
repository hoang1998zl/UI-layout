import React, { useEffect, useState } from "react";

/** Shared UI bits */
function Topbar({ title, actions }){
  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur border-slate-200">
      <div className="flex items-center justify-between px-4 mx-auto max-w-7xl h-14">
        <div className="font-semibold">{title}</div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </header>
  );
}
function Section({ title, right, children }){
  return (
    <section className="p-3 bg-white border rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">{title}</div>
        <div>{right}</div>
      </div>
      {children}
    </section>
  );
}

export default function UI42_AuditTrailExplorer(){
  const [events,setEvents]=useState([]);
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  const mockFetchEvents = () => new Promise((resolve, reject) => {
    setTimeout(()=>{
      if (Math.random()<0.03) return reject(new Error('Failed to load audit events'));
      resolve(Array.from({length:60},(_,i)=>({
        id:i+1,
        at:`2025-08-${String(10 + (i % 10)).padStart(2,'0')} ${String(9 + (i % 8)).padStart(2,'0')}:${String(i % 60).padStart(2,'0')}`,
        actor:['system','lan','tú','minh'][i%4],
        action:['create','update','delete','approve'][i%4],
        ref:`OBJ-${1000+i}`
      })));
    }, 300);
  });

  const fetchEvents = async () => {
    setLoading(true); setError(null);
    try {
      const data = await mockFetchEvents();
      setEvents(data);
    } catch(err){
      setError(err?.message || 'Failed to load events');
      setEvents([]);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchEvents(); }, []);

  const filtered = events.filter(e=>{
    if(!q) return true;
    const s = (e.actor + e.action + e.ref).toLowerCase();
    return s.includes(q.toLowerCase());
  });

  const exportJSON = (payload, filename = 'audit_events.json') => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const exportFiltered = () => exportJSON({ exportedAt: new Date().toISOString(), count: filtered.length, events: filtered }, `audit_filtered_${new Date().toISOString()}.json`);
  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), count: events.length, events }, `audit_all_${new Date().toISOString()}.json`);

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <Topbar title="UI42 – Audit Trail Explorer" actions={<>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={fetchEvents} className="px-2 py-1 border rounded">Refresh</button>
          <button onClick={exportFiltered} className="px-2 py-1 border rounded">Export filtered</button>
          <button onClick={exportAll} className="px-2 py-1 border rounded">Export all</button>
        </div>
      </>} />
       <div className="grid gap-3 px-4 mx-auto mt-4 max-w-7xl">
         <Section title="Tìm kiếm">
          <input className="w-full px-3 py-2 border rounded-lg" placeholder="actor/action/ref..." value={q} onChange={e=>setQ(e.target.value)}/>
         </Section>
         <Section title="Sự kiện">
          <div className="border rounded-xl bg-white max-h-[60vh] overflow-auto">
            {loading ? (
              <div className="p-4 space-y-2">
                {[...Array(6)].map((_,i)=>(<div key={i} className="h-5 bg-slate-100 rounded animate-pulse"/>))}
              </div>
            ) : error ? (
              <div className="p-4 text-xs text-red-500 flex items-center gap-3">
                <div>{error}</div>
                <button onClick={fetchEvents} className="px-2 py-1 bg-gray-100 rounded">Retry</button>
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">Thời gian</th><th className="px-3 py-2 text-left">Actor</th><th className="px-3 py-2 text-left">Hành động</th><th className="px-3 py-2 text-left">Ref</th></tr></thead>
                <tbody>
                  {filtered.map(ev=> (
                    <tr key={ev.id} className="border-t hover:bg-slate-50">
                      <td className="px-3 py-2">{ev.at}</td>
                      <td className="px-3 py-2">{ev.actor}</td>
                      <td className="px-3 py-2">{ev.action}</td>
                      <td className="px-3 py-2">{ev.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
         </Section>
       </div>
     </div>
   );
 }
