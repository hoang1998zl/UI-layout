import React from "react";

export default function UI56_ModelExplainability() {
  const exportJSON = (payload, filename = "explainability_export.json") => {
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

  const mockPayload = { exportedAt: new Date().toISOString(), shapSummary: [{ feature: "age", mean_abs_shap: 0.12 }, { feature: "income", mean_abs_shap: 0.08 }] };
  const exportAll = () => exportJSON(mockPayload, `explainability_${new Date().toISOString()}.json`);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">UI56 — Model Explainability</h1>
      <p className="mt-2 text-gray-600">Feature importance, SHAP summary and local explanations.</p>
      <div className="mt-4">
        <button onClick={exportAll} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export SHAP JSON</button>
      </div>
    </div>
  );
}
