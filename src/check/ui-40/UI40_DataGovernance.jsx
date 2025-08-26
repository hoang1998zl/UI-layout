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
function Skeleton({ h=200 }){
  return (
    <div className="animate-pulse">
      <div className="h-4 mb-2 rounded bg-slate-100" />
      <div className="rounded bg-slate-100" style={{height:h}} />
    </div>
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

function Donut({ data }){
  const total = data.reduce((a,b)=>a+b.value,0);
  const R=64, r=36, C=2*Math.PI*R;
  let off=0;
  const colors=["#0ea5e9","#10b981","#f59e0b","#ef4444","#6366f1","#14b8a6"];
  return (
    <div className="flex items-center gap-4">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <g transform="translate(80,80)">
          <circle r={R} fill="none" stroke="#e2e8f0" strokeWidth={r}/>
          {data.map((d,i)=>{
            const pct=d.value/(total||1), len=pct*C, dash=`${len} ${C-len}`;
            const el=(<circle key={i} r={R} fill="none" stroke={colors[i%colors.length]} strokeWidth={r} strokeDasharray={dash} strokeDashoffset={-off}/>);
            off+=len; return el;
          })}
        </g>
      </svg>
      <div className="space-y-1 text-sm">
        {data.map((d,i)=>(
          <div className="flex items-center gap-2" key={i}>
            <span className="w-3 h-3 rounded" style={{background:colors[i%colors.length]}}/>
            <span className="w-40 text-slate-700">{d.label}</span>
            <span className="tabular-nums text-slate-500">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTable({ rows, onRow, selectedIds = new Set(), onSelect = ()=>{}, onSort = ()=>{}, sortBy, sortDir }){
  const arrow = (field) => sortBy===field ? (sortDir==='asc' ? ' ▲' : ' ▼') : '';
  return (
    <div className="overflow-hidden border rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left"><input type="checkbox" checked={rows.length>0 && rows.every(r=>selectedIds.has(r.id))} onChange={(e)=>{
              if(e.target.checked) onSelect(new Set(rows.map(r=>r.id))); else onSelect(new Set());
            }} /></th>
            <th className="px-3 py-2 text-left cursor-pointer" onClick={()=>onSort('name')}>Dataset{arrow('name')}</th>
            <th className="px-3 py-2 text-left cursor-pointer" onClick={()=>onSort('owner')}>Owner{arrow('owner')}</th>
            <th className="px-3 py-2 text-left">Class</th>
            <th className="px-3 py-2 text-left">PII</th>
            <th className="px-3 py-2 text-left cursor-pointer" onClick={()=>onSort('quality')}>Quality{arrow('quality')}</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length===0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-sm text-center text-slate-500">
                <div className="max-w-xs mx-auto">
                  <div className="mb-2 text-2xl">📭</div>
                  <div className="font-medium">No datasets</div>
                  <div className="mt-1 text-xs">No rows match your filters. Try Refresh or adjust search.</div>
                </div>
              </td>
            </tr>
          ) : rows.map(r=> (
            <tr key={r.id} className="border-t hover:bg-slate-50">
              <td className="px-3 py-2"><input type="checkbox" checked={selectedIds.has(r.id)} onChange={()=>{
                const next = new Set(selectedIds);
                if(next.has(r.id)) next.delete(r.id); else next.add(r.id);
                onSelect(next);
              }} /></td>
              <td className="px-3 py-2">{r.name}</td>
              <td className="px-3 py-2">{r.owner}</td>
              <td className="px-3 py-2">{r.class}</td>
              <td className="px-3 py-2">{r.pii ? 'Yes' : 'No'}</td>
              <td className="px-3 py-2">{r.quality}%</td>
              <td className="px-3 py-2 text-right">
                <button className="px-2 py-1 mr-1 border rounded-lg" onClick={()=>onRow('view',r)}>View</button>
                <button className="px-2 py-1 mr-1 border rounded-lg" onClick={()=>onRow('policy',r)}>Policy</button>
                <button className="px-2 py-1 border rounded-lg" onClick={()=>onRow('scan',r)}>Scan</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UI40_DataGovernance(){
  const [loading,setLoading]=useState(true);
  const [rows,setRows]=useState([]);
  const [score,setScore]=useState(78);
  const [donut,setDonut]=useState([
    {label:'Confidential', value:32},
    {label:'Internal', value:38},
    {label:'Public', value:30},
  ]);
  // UI enhancements: search, selection, pagination
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  // sorting / detail / confirmations
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [detailRow, setDetailRow] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  // add export and refresh helpers
  const exportJSON = (payload, filename = 'data_governance_export.json') => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const exportCatalog = () => exportJSON({ exportedAt: new Date().toISOString(), rows }, `catalog_${new Date().toISOString()}.json`);
  const exportSelected = () => {
    const sel = rows.filter(r=> selectedIds.has(r.id));
    exportJSON({ exportedAt: new Date().toISOString(), count: sel.length, records: sel }, `catalog_selected_${new Date().toISOString()}.json`);
  };
  const exportCSV = (rowsToExport, filename = 'export.csv') => {
    if(!rowsToExport || rowsToExport.length===0) return exportJSON([], filename.replace('.csv','.json'));
    const keys = Object.keys(rowsToExport[0]);
    const csv = [keys.join(',')].concat(rowsToExport.map(r=> keys.map(k=> `"${String(r[k] ?? '').replace(/"/g,'""') }"`).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const performDeleteSelected = () => {
    const ids = Array.from(selectedIds);
    if(ids.length===0) return setToast('No selection');
    setRows(r=> r.filter(x=> !selectedIds.has(x.id)));
    setToast(`${ids.length} dataset(s) deleted`);
    setSelectedIds(new Set());
    setConfirm(null);
  };

  const fetchRows = () => {
    setLoading(true);
    setTimeout(()=>{
      setRows(Array.from({length:24},(_,i)=>({
        id:i+1,
        name:`dataset_${i+1}`,
        owner:['DataOps','Finance','HR','Sales'][i%4],
        class:['Confidential','Internal','Public'][i%3],
        pii: i%3===0,
        quality: 65 + (i%7)*4
      })));
      setLoading(false);
    },400);
  };

  useEffect(()=>{
    fetchRows();
  },[]);

  // derived rows: filter & paginate
  const filtered = rows.filter(r=> (
    !search || `${r.name} ${r.owner} ${r.class}`.toLowerCase().includes(search.toLowerCase())
  ));
  // apply sorting
  const sorted = [...filtered].sort((a,b)=>{
    const dir = sortDir==='asc' ? 1 : -1;
    if(sortBy==='name') return dir * a.name.localeCompare(b.name);
    if(sortBy==='owner') return dir * a.owner.localeCompare(b.owner);
    if(sortBy==='quality') return dir * (a.quality - b.quality);
    return 0;
  });
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(page, pages);
  const visible = sorted.slice((current-1)*perPage, current*perPage);

  // clear selection if rows changed
  useEffect(()=>{
    setSelectedIds(prev=>{
      const next = new Set(Array.from(prev).filter(id=> rows.some(r=> r.id===id)));
      return next;
    });
  },[rows]);

  const toggleSort = (field) => {
    if(sortBy===field) setSortDir(d=> d==='asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  // auto-dismiss toast
  useEffect(()=>{
    if(!toast) return;
    const t = setTimeout(()=> setToast(null), 3000);
    return ()=> clearTimeout(t);
  },[toast]);

  useInterval(()=> setScore(s=> Math.max(0,Math.min(100, s + (Math.random()<.5?-1:1)))), 3000);

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <Topbar title="UI40 – Data Governance Center" actions={<>
        <div className="items-center hidden gap-2 sm:flex">
          <button onClick={fetchRows} className="px-2 py-1 text-sm bg-gray-100 rounded">Refresh</button>
          <button onClick={exportCatalog} className="px-2 py-1 text-sm text-white bg-blue-600 rounded">Export</button>
          <button onClick={exportSelected} disabled={selectedIds.size===0} className={`px-2 py-1 text-sm rounded ${selectedIds.size===0? 'bg-gray-200 text-gray-400':'bg-green-600 text-white'}`}>Export Selected ({selectedIds.size})</button>
          <button onClick={()=> setConfirm({type:'deleteSelected'})} disabled={selectedIds.size===0} className={`px-2 py-1 text-sm rounded ${selectedIds.size===0? 'bg-gray-200 text-gray-400':'bg-rose-600 text-white'}`}>Delete Selected</button>
        </div>
        <span className="text-xs text-slate-500">Trust score: <b className="tabular-nums">{score}</b></span>
      </>} />
       <div className="grid gap-3 px-4 mx-auto mt-4 max-w-7xl">
         <div className="grid gap-3 md:grid-cols-3">
           <Section title="Data Classes">
             {loading? <Skeleton h={160}/> : <Donut data={donut}/>} 
           </Section>
           <Section title="Policies" right={<button className="px-2 py-1 border rounded-lg">New Policy</button>}>
             <ul className="space-y-2 text-sm">
               <li>• Mask PII on non-prod</li>
               <li>• Retain logs 365 days</li>
               <li>• Encrypt at rest (AES-256)</li>
               <li>• Lineage must be captured</li>
             </ul>
           </Section>
           <Section title="Alerts">
             <ul className="space-y-2 text-sm">
               <li className="flex justify-between"><span>Unclassified tables</span><span className="text-amber-600">14</span></li>
               <li className="flex justify-between"><span>PII exposure risk</span><span className="text-rose-600">3</span></li>
               <li className="flex justify-between"><span>Failed lineage extract</span><span className="text-slate-600">2</span></li>
             </ul>
           </Section>
         </div>

         <Section title="Catalog" right={<div className="flex items-center gap-2">
           <input placeholder="Search catalog" value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="px-2 py-1 text-sm border rounded" />
         </div>}>
          {loading ? <Skeleton h={340}/> : (
            <>
              <DataTable rows={visible} onRow={(t,r)=>{ if(t==='view') setDetailRow(r); else alert(`${t}: ${r.name}`); }} selectedIds={selectedIds} onSelect={setSelectedIds} onSort={toggleSort} sortBy={sortBy} sortDir={sortDir} />
              <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                <div>Showing {Math.min(total, (current-1)*perPage+1)} - {Math.min(total, current*perPage)} of {total}</div>
                <div className="flex items-center gap-2">
                  <select value={perPage} onChange={(e)=>{ setPerPage(Number(e.target.value)); setPage(1); }} className="p-1 text-sm border rounded">
                    <option value={5}>5</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                  </select>
                  <button onClick={()=> setPage(p=> Math.max(1,p-1))} className="px-2 py-1 bg-gray-100 rounded">Prev</button>
                  <span>Page {current} / {pages}</span>
                  <button onClick={()=> setPage(p=> Math.min(pages,p+1))} className="px-2 py-1 bg-gray-100 rounded">Next</button>
                </div>
              </div>
            </>
          )}
         </Section>
       </div>
      {/* detail drawer */}
      {detailRow && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black bg-opacity-30">
          <div className="w-full h-full overflow-auto bg-white shadow-lg md:w-96">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-bold">{detailRow.name}</h3>
                <div className="text-xs text-gray-500">Owner: {detailRow.owner} · Class: {detailRow.class}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=> exportJSON(detailRow, `${detailRow.name}.json`)} className="px-2 py-1 text-sm text-white bg-blue-600 rounded">Export</button>
                <button onClick={()=> setDetailRow(null)} className="px-2 py-1 text-sm bg-gray-100 rounded">Close</button>
              </div>
            </div>
            <div className="p-4 text-sm">
              <div className="mb-2"><strong>PII:</strong> {detailRow.pii ? 'Yes' : 'No'}</div>
              <div className="mb-2"><strong>Quality:</strong> {detailRow.quality}%</div>
              <div className="mb-2"><strong>Description:</strong><div className="p-2 mt-1 rounded bg-gray-50">Sample dataset for demonstration purposes.</div></div>
            </div>
          </div>
        </div>
      )}

      {/* confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="p-4 bg-white rounded shadow w-96">
            <div className="font-medium">Confirm action</div>
            <div className="mt-2 text-sm text-gray-600">Are you sure you want to delete {selectedIds.size} selected dataset(s)? This is a simulation.</div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={()=> setConfirm(null)} className="px-3 py-1 bg-gray-100 rounded">Cancel</button>
              <button onClick={performDeleteSelected} className="px-3 py-1 text-white rounded bg-rose-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div className="fixed z-50 right-4 bottom-4">
          <div className="px-4 py-2 text-white bg-gray-800 rounded shadow">{toast}</div>
        </div>
      )}
     </div>
   );
 }
