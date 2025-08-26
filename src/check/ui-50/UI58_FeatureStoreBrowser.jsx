import React, { useState } from "react";

export default function UI58_FeatureStoreBrowser() {
  const [features, setFeatures] = useState([{ name: "age", freshnessHours: 1 }, { name: "income", freshnessHours: 24 }]);

  const exportJSON = (payload, filename = "feature_store.json") => {
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

  const mock = { exportedAt: new Date().toISOString(), features };
  const exportAll = () => exportJSON(mock, `features_${new Date().toISOString()}.json`);
  const refresh = () => setFeatures([{ name: "age", freshnessHours: 1 }, { name: "income", freshnessHours: 24 }]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">UI58 — Feature Store Browser</h1>
      <p className="mt-2 text-gray-600">Browse features, freshness and lineage from the feature store.</p>
      <div className="mt-4 flex gap-2">
        <button onClick={refresh} className="px-3 py-1 bg-gray-100 rounded text-sm">Refresh</button>
        <button onClick={exportAll} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export Features JSON</button>
      </div>
    </div>
  );
}
