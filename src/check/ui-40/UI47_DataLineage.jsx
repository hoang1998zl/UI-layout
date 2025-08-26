import React, { useEffect, useMemo, useState } from "react";

// Mock API + export helpers for UI47
const mockFetchUI47 = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "ln_customers", name: "customers", type: "table", owner: "sales", tags: ["pii"] },
        { id: "ln_orders", name: "orders", type: "stream", owner: "logistics", tags: ["events"] },
      ]);
    }, 500);
  });

const useUI47Data = () => {
  const [itemsUI47, setItemsUI47] = useState([]);
  const [loadingUI47, setLoadingUI47] = useState(false);
  const [errorUI47, setErrorUI47] = useState(null);
  const [selectedUI47, setSelectedUI47] = useState(null);

  const fetchUI47 = async () => {
    setLoadingUI47(true);
    setErrorUI47(null);
    try {
      const data = await mockFetchUI47();
      setItemsUI47(data);
    } catch (err) {
      setErrorUI47(err?.message || "Failed to fetch UI47 items");
      setItemsUI47([]);
    } finally {
      setLoadingUI47(false);
    }
  };

  useEffect(() => {
    fetchUI47();
  }, []);

  const tagsUI47 = useMemo(() => ["All", ...Array.from(new Set(itemsUI47.flatMap((i) => i.tags || [])))], [itemsUI47]);
  const filteredUI47 = itemsUI47; // placeholder for UI filtering logic

  const exportJSONUI47 = (payload, filename = "ui47_export.json") => {
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

  const exportFilteredUI47 = () => {
    const payload = { exportedAt: new Date().toISOString(), count: filteredUI47.length, items: filteredUI47 };
    exportJSONUI47(payload, `ui47_filtered_${new Date().toISOString()}.json`);
  };

  const exportSelectedUI47 = () => {
    if (!selectedUI47) return;
    exportJSONUI47({ exportedAt: new Date().toISOString(), item: selectedUI47 }, `ui47_item_${selectedUI47.id}_${new Date().toISOString()}.json`);
  };

  return {
    itemsUI47,
    loadingUI47,
    errorUI47,
    selectedUI47,
    setSelectedUI47,
    fetchUI47,
    tagsUI47,
    filteredUI47,
    exportFilteredUI47,
    exportSelectedUI47,
  };
};

// Export hook for internal use in this file's component
export { useUI47Data };

export default function UI47_DataLineage() {
  const [selectedNode, setSelectedNode] = useState(null);
  const {
    itemsUI47,
    loadingUI47,
    errorUI47,
    selectedUI47,
    setSelectedUI47,
    fetchUI47,
    tagsUI47,
    filteredUI47,
    exportFilteredUI47,
    exportSelectedUI47,
  } = useUI47Data();

  const nodes = [
    { id: "src-db", name: "source_db", type: "source" },
    { id: "etl-1", name: "etl_sales", type: "etl" },
    { id: "table_orders", name: "orders", type: "table" },
    { id: "table_sales", name: "sales_fct", type: "table" },
  ];

  return (
    <div className="p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">UI47 — Data Lineage</h1>
          <p className="mt-1 text-gray-600">Visualize upstream/downstream lineage and dependencies.</p>
        </div>
        <div className="flex items-center gap-2">
          {loadingUI47 ? (
            <div className="text-xs text-gray-500">Loading…</div>
          ) : errorUI47 ? (
            <div className="text-xs text-red-500">{errorUI47}</div>
          ) : null}
          <button onClick={fetchUI47} className="px-2 py-1 text-xs bg-gray-100 rounded">Refresh</button>
          <button onClick={exportFilteredUI47} className="px-2 py-1 text-xs bg-blue-600 text-white rounded" disabled={filteredUI47.length===0}>Export filtered</button>
          <button onClick={exportSelectedUI47} className={`px-2 py-1 text-xs rounded ${!selectedUI47 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white'}`} disabled={!selectedUI47}>Export selected</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1 bg-white rounded shadow-sm p-4">
          <div className="text-sm font-medium mb-2">Nodes</div>
          <ul className="space-y-2">
            {nodes.map((n) => (
              <li key={n.id}>
                <button onClick={() => setSelectedNode(n)} className={`w-full text-left p-2 rounded hover:bg-gray-50 ${selectedNode?.id === n.id ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}>
                  <div className="text-sm font-medium">{n.name}</div>
                  <div className="text-xs text-gray-500">{n.type}</div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Available items</div>
            {loadingUI47 ? (
              <div className="space-y-2">
                {[...Array(3)].map((_,i)=>(<div key={i} className="h-8 bg-slate-100 rounded animate-pulse"/>))}
              </div>
            ) : errorUI47 ? (
              <div className="text-xs text-red-500">{errorUI47} <button onClick={fetchUI47} className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">Retry</button></div>
            ) : (
              <ul className="space-y-2 text-sm">
                {itemsUI47.map(it=> (
                  <li key={it.id}>
                    <button onClick={()=> setSelectedUI47(it)} className={`w-full text-left p-2 rounded hover:bg-gray-50 ${selectedUI47?.id===it.id?"bg-blue-50 border-l-4 border-blue-500":""}`}>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-gray-500">{it.type} • {it.owner}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <div className="text-sm text-gray-500 mb-2">Lineage Graph (placeholder)</div>
            <div className="h-64 bg-gray-50 border rounded flex items-center justify-center text-gray-400">Graph rendering area — integrate d3/cytoscape later</div>
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <h3 className="text-sm font-medium mb-2">Node Details</h3>
            {!selectedNode ? (
              <div className="text-gray-500">Select a node to view details.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">ID</div>
                  <div className="font-medium">{selectedNode.id}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Name</div>
                  <div className="font-medium">{selectedNode.name}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Type</div>
                  <div className="font-medium">{selectedNode.type}</div>
                </div>
                <div className="md:col-span-3 mt-2 text-xs text-gray-500">Recent lineage events (mock)</div>
                <div className="md:col-span-3">
                  <ul className="space-y-2 mt-2 text-sm">
                    <li className="p-2 bg-gray-50 rounded">2025-08-20: Upstream column mapping changed</li>
                    <li className="p-2 bg-gray-50 rounded">2025-08-18: ETL job failed (retry)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
