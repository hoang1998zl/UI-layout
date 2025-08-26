import React, { useState, useEffect } from "react";

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

function AgentCard({ agent, onRun }){
  return (
    <div className="p-3 bg-white border rounded-xl">
      <div className="font-medium">{agent.name}</div>
      <div className="mb-2 text-xs text-slate-500">{agent.desc}</div>
      <div className="text-xs text-slate-500">Tools: {agent.tools.join(", ")}</div>
      <button className="mt-2 px-3 py-1.5 border rounded-lg" onClick={()=>onRun(agent)}>Run</button>
    </div>
  );
}

export default function UI51_AgentOrchestrator(){
  const [log,setLog]=useState([]);
  const [agents,setAgents]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  const mockFetchAgents = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {name:'Procurement Agent', desc:'Tạo PO, so sánh báo giá', tools:['ERP','Email'], id: 'a-001'},
        {name:'Finance Agent', desc:'Đối soát, lập JE', tools:['GL','Sheets'], id: 'a-002'},
        {name:'Support Agent', desc:'Tra cứu ticket, gợi ý FAQ', tools:['KB','Helpdesk'], id: 'a-003'},
      ]);
    }, 450);
  });

  const fetchAgents = async () => {
    setLoading(true); setError(null);
    try {
      const data = await mockFetchAgents();
      setAgents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchAgents(); }, []);

  function run(agent){ setLog(l=>[...l, `▶ ${agent.name} started...`]) }

  const exportJSON = (payload, filename = "agents_export.json") => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), agents }, `agents_${new Date().toISOString()}.json`);

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <Topbar title="UI51 – Agent Orchestrator" actions={<>
        <button className="px-3 py-1.5 border rounded-lg" onClick={fetchAgents}>Refresh</button>
        <button className="px-3 py-1.5 border rounded-lg" onClick={exportAll}>Export JSON</button>
      </>} />
      <div className="grid gap-3 px-4 mx-auto mt-4 max-w-7xl">
        {loading ? (
          <div className="grid gap-3 md:grid-cols-3">
            {[1,2,3].map(i=> <div key={i} className="h-28 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="p-4 bg-white rounded shadow-sm text-sm text-red-500">
            <div>{error}</div>
            <div className="mt-2"><button onClick={fetchAgents} className="px-2 py-1 bg-gray-100 rounded">Retry</button></div>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {agents.map((a,i)=>(<AgentCard key={a.id || i} agent={a} onRun={run}/>))}
          </div>
        )}

        <Section title="Execution Log">
          <pre className="p-3 text-sm whitespace-pre-wrap border bg-slate-50 rounded-xl">{log.join("\n")}</pre>
        </Section>
      </div>
    </div>
  );
}
