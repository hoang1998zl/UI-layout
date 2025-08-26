import React, { useEffect, useState } from "react";

export default function UI60_PipelineMonitor() {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);

  const mockFetch = () => new Promise((resolve) => setTimeout(() => resolve([
    { id: "pl-001", name: "daily-ingest", status: "Running", lastRun: "2025-08-25 04:00", owner: "etl-team", duration: "12m" },
    { id: "pl-002", name: "etl-sales", status: "Failed", lastRun: "2025-08-25 03:30", owner: "etl-team", duration: "3m" },
  ]), 400));

  const fetchPipelines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockFetch();
      setPipelines(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load pipelines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const exportJSON = (payload, filename = "pipelines.json") => {
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

  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), pipelines }, `pipelines_${new Date().toISOString()}.json`);
  const exportOne = (p) => exportJSON({ exportedAt: new Date().toISOString(), pipeline: p }, `pipeline_${p.id}_${new Date().toISOString()}.json`);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">UI60 — Pipeline Monitor</h1>
      <p className="mt-2 text-gray-600">CI/CD and data pipeline status overview.</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">Pipelines</div>
        <div className="flex gap-2">
          <button onClick={fetchPipelines} className="px-3 py-1 bg-gray-100 rounded">Refresh</button>
          <button onClick={exportAll} className="px-3 py-1 bg-blue-600 text-white rounded">Export JSON</button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-4 p-3 bg-white rounded shadow-sm text-sm text-red-500 flex items-center justify-between">
          <div>{error}</div>
          <div><button onClick={fetchPipelines} className="px-2 py-1 bg-gray-100 rounded">Retry</button></div>
        </div>
      ) : (
        <div className="mt-4 bg-white rounded shadow-sm p-4">
          <ul className="space-y-2">
            {pipelines.map((p) => (
              <li key={p.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <button onClick={() => setDetail(p)} className="text-sm font-medium text-left text-blue-600 underline">{p.name}</button>
                  <div className="text-xs text-gray-500">{p.lastRun} — {p.owner}</div>
                </div>
                <div className="text-sm">{p.status}</div>
              </li>
            ))}
          </ul>

          <div className="mt-3 text-xs text-gray-500">Tip: click a pipeline to view details and export its run metadata.</div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-11/12 max-w-md p-4 bg-white rounded shadow-lg">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">Pipeline — {detail.name}</h3>
              <button onClick={() => setDetail(null)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-3 text-sm">
              <div><strong>ID:</strong> {detail.id}</div>
              <div><strong>Status:</strong> {detail.status}</div>
              <div><strong>Last Run:</strong> {detail.lastRun}</div>
              <div><strong>Owner:</strong> {detail.owner}</div>
              <div><strong>Duration:</strong> {detail.duration}</div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(detail, null, 2)); }} className="px-3 py-1 bg-gray-100 rounded">Copy JSON</button>
              <button onClick={() => exportOne(detail)} className="px-3 py-1 text-white bg-blue-600 rounded">Export</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
