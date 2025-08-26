import React, { useEffect, useState } from "react";

export default function UI53_ModelMonitoring() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ models: 0, anomalies: 0, avgLatencyMs: 0 });
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    setTimeout(() => {
      setMetrics({ models: 6, anomalies: 2, avgLatencyMs: 82 });
      setModels([
        { id: "rec-001", name: "CreditRiskModel", version: "v1.4", status: "Active", lastRun: "2025-08-24 09:12", accuracy: 0.92, drift: 0.04 },
        { id: "cls-002", name: "ChurnPredictor", version: "v2.0", status: "Staging", lastRun: "2025-08-24 07:44", accuracy: 0.87, drift: 0.11 },
        { id: "nlp-009", name: "NLPIntentV2", version: "v0.9", status: "Active", lastRun: "2025-08-25 02:03", accuracy: 0.88, drift: 0.02 },
        { id: "seg-017", name: "CustomerSegmentation", version: "v3.1", status: "Active", lastRun: "2025-08-23 22:10", accuracy: 0.75, drift: 0.21 },
        { id: "img-021", name: "InvoiceOCR", version: "v1.0", status: "Failed", lastRun: "2025-08-25 03:00", accuracy: 0.00, drift: 0.00 },
        { id: "rec-045", name: "ProductRecommender", version: "v1.2", status: "Active", lastRun: "2025-08-25 05:45", accuracy: 0.95, drift: 0.01 },
      ]);
      setLoading(false);
    }, 600);
  };

  useEffect(() => { load(); }, []);

  const exportJSON = (payload, filename = "models_export.json") => {
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

  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), metrics, models }, `models_${new Date().toISOString()}.json`);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">UI53 — Model Monitoring</h1>
        <p className="mt-1 text-gray-600">Overview of model health, latency, drift and recent failures.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <div className="p-4 bg-white rounded shadow-sm">
          <div className="text-sm text-gray-500">Models Monitored</div>
          <div className="mt-2 text-2xl font-semibold">{loading ? "..." : metrics.models}</div>
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <div className="text-sm text-gray-500">Active Anomalies</div>
          <div className="mt-2 text-2xl font-semibold text-red-600">{loading ? "..." : metrics.anomalies}</div>
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <div className="text-sm text-gray-500">Avg Latency (ms)</div>
          <div className="mt-2 text-2xl font-semibold">{loading ? "..." : metrics.avgLatencyMs}</div>
        </div>
      </section>

      <section className="p-4 bg-white rounded shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Models</h2>
          <div className="flex items-center gap-2">
            <button onClick={load} className="px-3 py-1 text-sm bg-gray-100 rounded">Refresh</button>
            <button onClick={exportAll} className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Export JSON</button>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading models…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs text-gray-500">
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Version</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Last Run</th>
                  <th className="p-2">Accuracy</th>
                  <th className="p-2">Drift</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="p-2 align-top">{m.id}</td>
                    <td className="p-2 align-top">{m.name}</td>
                    <td className="p-2 align-top">{m.version}</td>
                    <td className="p-2 align-top">
                      <span className={`px-2 py-0.5 rounded text-xs ${m.status === "Active" ? "bg-green-100 text-green-800" : m.status === "Staging" ? "bg-yellow-100 text-yellow-800" : m.status === "Failed" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-2 align-top">{m.lastRun}</td>
                    <td className="p-2 align-top">{m.accuracy ? `${(m.accuracy * 100).toFixed(1)}%` : "—"}</td>
                    <td className="p-2 align-top">{m.drift ? (m.drift * 100).toFixed(1) + "%" : "—"}</td>
                    <td className="p-2 align-top">
                      <div className="flex gap-2">
                        <button className="px-2 py-1 text-sm bg-gray-100 rounded">View</button>
                        <button className="px-2 py-1 text-sm bg-yellow-100 rounded">Retrain</button>
                        <button className="px-2 py-1 text-sm bg-red-100 rounded">Disable</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">Tip: click View to open model details and examine feature distributions and recent inference logs.</div>
      </section>
    </div>
  );
}
