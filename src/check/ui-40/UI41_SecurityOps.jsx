import React, { useEffect, useRef, useState } from "react";

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
function useInterval(callback, delay){
  const saved = useRef(callback);
  useEffect(()=>{ saved.current = callback }, [callback]);
  useEffect(()=>{
    if(delay==null) return;
    const id = setInterval(()=> saved.current(), delay);
    return ()=> clearInterval(id);
  }, [delay]);
}

function TinyBar({ data }){
  const w=200,h=48,p=4; const max=Math.max(...data);
  const bw=(w-p*2)/data.length-2, step=(w-p*2)/data.length;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {data.map((v,i)=>{
        const x=p+i*step, y=h-p-(v/(max||1))*(h-p*2);
        return <rect key={i} x={x} y={y} width={bw} height={h-p-y} rx={2} className="fill-slate-400" />;
      })}
    </svg>
  );
}

export default function UI41_SecurityOps(){
  const [incidents,setIncidents]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [trend,setTrend]=useState(Array.from({length:16},()=> 10+Math.round(Math.random()*10)));
  // mock fetch with occasional error simulation
  const mockFetchIncidents = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) return reject(new Error('Network error'));
      resolve([
        {id:101, sev:'High', title:'Unauthorized access attempt', sys:'VPN'},
        {id:102, sev:'Medium', title:'Abnormal API traffic', sys:'Gateway'},
        {id:103, sev:'Low', title:'Outdated dependency', sys:'Service A'},
      ]);
    }, 300);
  });

  const fetchIncidents = async () => {
    setLoading(true); setError(null);
    try {
      const data = await mockFetchIncidents();
      setIncidents(data);
    } catch(err) {
      setError(err?.message || 'Failed to load incidents');
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchIncidents(); }, []);
  useInterval(()=> setTrend(t=> t.map(v=> Math.max(5, Math.min(30, v + (Math.random()<.5?-1:1))))), 4000);
  const exportJSON = (payload, filename = 'incidents_export.json') => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <Topbar title="UI41 – Security Operations" actions={<>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={fetchIncidents} className="px-2 py-1 border rounded-lg">Refresh</button>
          <button onClick={() => exportJSON({ exportedAt: new Date().toISOString(), count: incidents.length, incidents }, `incidents_${new Date().toISOString()}.json`)} className="px-2 py-1 border rounded-lg">Export</button>
        </div>
        <button className="px-2 py-1 border rounded-lg" onClick={()=>alert('Run scan (mock)')}>Run Scan</button>
      </>} />
       <div className="grid gap-3 px-4 mx-auto mt-4 max-w-7xl">
         <div className="grid gap-3 md:grid-cols-3">
           <Section title="Threat Trend"><TinyBar data={trend}/></Section>
           <Section title="Patch Status">
             <ul className="space-y-1 text-sm">
               <li>• Critical pending: <b className="text-rose-600">4</b></li>
               <li>• High pending: <b className="text-amber-600">9</b></li>
               <li>• Medium: 23</li>
               <li>• Up-to-date: 412</li>
             </ul>
           </Section>
           <Section title="MFA Coverage">
             <div className="text-3xl font-semibold">93%</div>
             <div className="text-xs text-slate-500">Users with MFA enabled</div>
           </Section>
         </div>

         <Section title="Incidents">
          <div className="overflow-hidden bg-white border rounded-xl">
            {loading ? (
              <div className="p-4 space-y-2">
                {[...Array(3)].map((_,i)=>(<div key={i} className="h-6 bg-slate-100 rounded animate-pulse"/>))}
              </div>
            ) : error ? (
              <div className="p-4 text-xs text-red-500 flex items-center gap-3">
                <div>{error}</div>
                <button onClick={fetchIncidents} className="px-2 py-1 bg-gray-100 rounded">Retry</button>
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Severity</th>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">System</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map(it=> {
                    const sevClass = it.sev==='High' ? 'bg-rose-100 text-rose-700' : it.sev==='Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700';
                    return (
                    <tr key={it.id} className="border-t hover:bg-slate-50">
                      <td className="px-3 py-2">{it.id}</td>
                      <td className="px-3 py-2"><span className={`px-2 py-1 text-xs rounded-full ${sevClass}`}>{it.sev}</span></td>
                      <td className="px-3 py-2">{it.title}</td>
                      <td className="px-3 py-2">{it.sys}</td>
                      <td className="px-3 py-2 text-right">
                        <button className="px-2 py-1 mr-1 border rounded-lg">Assign</button>
                        <button className="px-2 py-1 border rounded-lg">Close</button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            )}
          </div>
         </Section>
       </div>
     </div>
   );
 }
