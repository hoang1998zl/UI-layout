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

function Asset({ a, onClick }){ return <button onClick={()=>onClick(a)} className="p-2 text-left border rounded-xl hover:bg-slate-50">{a.title}</button> }

export default function UI52_GenerativeStudio(){
  const [assets,setAssets]=useState(Array.from({length:8},(_,i)=>({id:i+1,title:`Template #${i+1}`, type:['Doc','Email','SOP'][i%3]})));
  const [current,setCurrent]=useState(null);

  const refresh = () => { setAssets(Array.from({length:8},(_,i)=>({id:i+1,title:`Template #${i+1}`, type:['Doc','Email','SOP'][i%3]}))); setCurrent(null); };
  const exportJSON = (payload, filename = "generative_assets.json") => {
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
  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), assets }, `templates_${new Date().toISOString()}.json`);

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <Topbar title="UI52 – Generative Studio" actions={
        <>
          <button className="px-3 py-1.5 border rounded-lg" onClick={refresh}>Refresh</button>
          <button className="px-3 py-1.5 border rounded-lg" onClick={exportAll}>Export JSON</button>
        </>
      }/>
      <div className="grid gap-3 px-4 mx-auto mt-4 max-w-7xl">
        <div className="grid gap-3 md:grid-cols-3">
          <Section title="Templates">
            <div className="grid grid-cols-2 gap-2">
              {assets.map(a=> <Asset key={a.id} a={a} onClick={setCurrent}/>)}
            </div>
          </Section>
          <Section title="Editor">
            <textarea className="w-full h-56 px-3 py-2 border rounded-lg" defaultValue="Nhập nội dung..."/>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1.5 border rounded-lg">Suggest</button>
              <button className="px-3 py-1.5 border rounded-lg">Rewrite</button>
              <button className="px-3 py-1.5 border rounded-lg">Translate</button>
            </div>
          </Section>
          <Section title="Preview">
            <div className="h-56 p-3 overflow-auto text-sm bg-white border rounded-xl">Xem trước nội dung...</div>
          </Section>
        </div>
        {current && (<Section title={"Đang mở: "+current.title}><div className="text-sm text-slate-600">Loại: {current.type}</div></Section>)}
      </div>
    </div>
  );
}
