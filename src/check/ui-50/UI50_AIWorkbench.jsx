import React, { useState } from "react";

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

function Editor({ value, onChange }){
  return <textarea className="w-full h-48 px-3 py-2 font-mono text-sm border rounded-lg" value={value} onChange={e=>onChange(e.target.value)} />;
}
function Output({ text }){ return <pre className="p-3 text-sm whitespace-pre-wrap border bg-slate-50 rounded-xl">{text}</pre> }

export default function UI50_AIWorkbench(){
  const [prompt,setPrompt]=useState("Tóm tắt quy trình phê duyệt PO theo gạch đầu dòng.");
  const [model,setModel]=useState("gpt-enterprise");
  const [temp,setTemp]=useState(0.2);
  const [out,setOut]=useState("Kết quả sẽ hiển thị ở đây (mock).");
  const [running,setRunning]=useState(false);

  function run(){
    setRunning(true);
    setOut("...");
    setTimeout(()=>{
      setOut(`Model: ${model} | T=${temp}\n---\n- Bước 1: Nộp yêu cầu\n- Bước 2: Trưởng bộ phận duyệt\n- Bước 3: Mua hàng thực hiện\n- Bước 4: Đối soát hóa đơn`);
      setRunning(false);
    }, 500);
  }

  const refresh = () => {
    setPrompt("Tóm tắt quy trình phê duyệt PO theo gạch đầu dòng.");
    setModel("gpt-enterprise");
    setTemp(0.2);
    setOut("Kết quả sẽ hiển thị ở đây (mock).");
  };

  const exportJSON = (payload, filename = "ai_workbench_export.json") => {
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

  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), prompt, model, temp, out }, `ai_workbench_${new Date().toISOString()}.json`);

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <Topbar title="UI50 – AI Workbench" actions={
        <>
          <button className="px-3 py-1.5 border rounded-lg" onClick={run} disabled={running}>{running ? 'Running…' : 'Run'}</button>
          <button className="px-3 py-1.5 border rounded-lg" onClick={refresh}>Refresh</button>
          <button className="px-3 py-1.5 border rounded-lg" onClick={exportAll}>Export JSON</button>
        </>
      }/>
      <div className="grid gap-3 px-4 mx-auto mt-4 max-w-7xl">
        <Section title="Prompt">
          <Editor value={prompt} onChange={setPrompt}/>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <label className="flex items-center gap-2">Model
              <select className="px-2 py-1 border rounded-lg" value={model} onChange={e=>setModel(e.target.value)}>
                <option value="gpt-enterprise">gpt-enterprise</option>
                <option value="gpt-vision">gpt-vision</option>
                <option value="llm-compact">llm-compact</option>
              </select>
            </label>
            <label className="flex items-center gap-2">Temp
              <input type="range" min="0" max="1" step="0.1" value={temp} onChange={e=>setTemp(parseFloat(e.target.value))}/>
              <span className="tabular-nums">{temp.toFixed(1)}</span>
            </label>
            <button className="px-2 py-1 border rounded-lg" onClick={()=> setPrompt("")}>Clear</button>
          </div>
        </Section>

        <Section title="Output">
          <Output text={out}/>
        </Section>
      </div>
    </div>
  );
}
