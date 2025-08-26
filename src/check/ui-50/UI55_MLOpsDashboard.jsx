import React, { useEffect, useState } from "react";

export default function UI55_MLOpsDashboard() {
  const [loading, setLoading] = useState(true);
  const [deploys, setDeploys] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    setTimeout(() => {
      setDeploys([
        { id: "d-001", name: "credit-risk", env: "prod", status: "Healthy", trafficPct: 100 },
        { id: "d-002", name: "churn-predictor", env: "staging", status: "Degraded", trafficPct: 20 },
      ]);
      setExperiments([
        { id: "e-101", name: "feat-selection-v2", owner: "alice", result: "win", created: "2025-08-20" },
        { id: "e-102", name: "hyperopt-v3", owner: "bob", result: "inconclusive", created: "2025-08-22" },
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => { load(); }, []);

  const exportJSON = (payload, filename = "mlops_export.json") => {
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

  const exportDeploys = () => exportJSON({ exportedAt: new Date().toISOString(), deploys }, `deploys_${new Date().toISOString()}.json`);
  const exportExperiments = () => exportJSON({ exportedAt: new Date().toISOString(), experiments }, `experiments_${new Date().toISOString()}.json`);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">UI55 — MLOps Dashboard</h1>
        <p className="mt-1 text-gray-600">Overview of deployments, pipelines and experiments.</p>
      </header>

      {error ? (
        <div className="p-4 bg-white rounded shadow-sm text-sm text-red-500">
          <div>{error}</div>
          <div className="mt-2"><button onClick={load} className="px-2 py-1 bg-gray-100 rounded">Retry</button></div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">Active Deployments</div>
              <div className="mt-2 text-2xl font-semibold">{loading ? "..." : deploys.length}</div>
            </div>
            <div className="p-4 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">Running Pipelines</div>
              <div className="mt-2 text-2xl font-semibold">{loading ? "..." : 3}</div>
            </div>
            <div className="p-4 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">Recent Experiments</div>
              <div className="mt-2 text-2xl font-semibold">{loading ? "..." : experiments.length}</div>
            </div>
          </section>

          <section className="bg-white rounded shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Deployments</h2>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm bg-gray-100 rounded">New Deployment</button>
                <button onClick={exportDeploys} className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Export Deploys</button>
                <button onClick={load} className="px-3 py-1 text-sm bg-gray-100 rounded">Refresh</button>
              </div>
            </div>
            {loading ? (
              <div className="text-gray-500">Loading deployments…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="p-2">ID</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Env</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Traffic</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deploys.map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="p-2">{d.id}</td>
                        <td className="p-2">{d.name}</td>
                        <td className="p-2">{d.env}</td>
                        <td className="p-2">{d.status}</td>
                        <td className="p-2">{d.trafficPct}%</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <button className="px-2 py-1 text-sm bg-gray-100 rounded">Logs</button>
                            <button className="px-2 py-1 text-sm bg-yellow-100 rounded">Rollback</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Experiments</h2>
              <button onClick={exportExperiments} className="px-3 py-1 text-sm bg-gray-100 rounded">Export Experiments</button>
            </div>
            {loading ? (
              <div className="text-gray-500">Loading experiments…</div>
            ) : (
              <ul className="space-y-2">
                {experiments.map((e) => (
                  <li key={e.id} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{e.name}</div>
                      <div className="text-xs text-gray-500">{e.owner} — {e.created}</div>
                    </div>
                    <div className="text-sm text-gray-700">{e.result}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
