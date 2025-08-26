import React, { useState } from "react";

export default function UI59_ExperimentTracker() {
  const [state, setState] = useState({ note: "placeholder for experiments list" });

  const exportJSON = (payload, filename = "experiments_export.json") => {
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

  const mock = { exportedAt: new Date().toISOString(), note: state.note };
  const exportAll = () => exportJSON(mock, `experiments_${new Date().toISOString()}.json`);
  const refresh = () => setState({ note: "placeholder for experiments list" });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">UI59 — Experiment Tracker</h1>
      <p className="mt-2 text-gray-600">Compare runs, metrics and model artifacts.</p>
      <div className="mt-4 flex gap-2">
        <button onClick={refresh} className="px-3 py-1 bg-gray-100 rounded text-sm">Refresh</button>
        <button onClick={exportAll} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export Experiments JSON</button>
      </div>
    </div>
  );
}
