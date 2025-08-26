import React, { useEffect, useState } from "react";

export default function UI48_CompliancePolicyManager() {
  const [policies, setPolicies] = useState([
    { id: "p-001", name: "PII Retention", active: true, description: "Remove PII after 3 years." },
    { id: "p-002", name: "GDPR Export Consent", active: false, description: "Require explicit consent for export." },
  ]);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockFetchPolicies = () => new Promise((resolve) => setTimeout(() => resolve(policies), 400));

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockFetchPolicies();
      setPolicies(data);
    } catch (err) {
      setError(err?.message || "Failed to fetch policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const exportJSON = (payload, filename = "policies.json") => {
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

  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), policies }, `policies_${new Date().toISOString()}.json`);
  const exportSelected = () => { if (!selected) return; exportJSON({ exportedAt: new Date().toISOString(), policy: selected }, `policy_${selected.id}_${new Date().toISOString()}.json`); };

  const toggle = (id) => {
    setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">UI48 — Compliance Policy Manager</h1>
        <p className="mt-1 text-gray-600">Create and manage compliance policies (GDPR/PII). This is a mock UI for demonstration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1 bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Policies</h2>
            <div className="flex gap-2">
              <button onClick={fetchPolicies} className="text-sm px-2 py-1 bg-gray-100 rounded">Refresh</button>
              <button onClick={exportAll} className="text-sm px-2 py-1 bg-blue-600 text-white rounded">Export</button>
            </div>
          </div>
          <ul className="space-y-2">
            {policies.map((p) => (
              <li key={p.id}>
                <button onClick={() => setSelected(p)} className={`w-full text-left p-2 rounded hover:bg-gray-50 ${selected?.id === p.id ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.description}</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="lg:col-span-3">
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            {!selected ? (
              <div className="text-gray-500">Select a policy to edit or view details.</div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-gray-500">Policy</div>
                    <div className="text-lg font-medium">{selected.name}</div>
                    <div className="text-xs text-gray-500">{selected.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(selected.id)} className={`px-3 py-1 text-sm rounded ${selected.active ? "bg-red-100" : "bg-green-100"}`}>
                      {selected.active ? "Deactivate" : "Activate"}
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 rounded">Edit</button>
                    <button onClick={exportSelected} className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Export</button>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2">Description</div>
                  <textarea defaultValue={selected.description} className="w-full border p-2 rounded text-sm h-24" />
                </div>

                <div className="mt-4 text-xs text-gray-500">Rules (mock)</div>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="p-2 bg-gray-50 rounded">If dataset contains tag "pii" then apply masking.</li>
                  <li className="p-2 bg-gray-50 rounded">If user requests export and consent=false, deny export.</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <h3 className="text-sm font-medium mb-2">Activity Log</h3>
            <ul className="text-sm text-gray-500">
              <li className="p-2 bg-gray-50 rounded mb-2">2025-08-22: Policy p-001 activated by alice</li>
              <li className="p-2 bg-gray-50 rounded">2025-08-20: Policy p-002 created by bob</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
