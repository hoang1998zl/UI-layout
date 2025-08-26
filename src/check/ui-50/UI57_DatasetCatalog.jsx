import React, { useEffect, useState } from "react";

export default function UI57_DatasetCatalog() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setDatasets([
        { id: "ds_train_01", name: "training_set_v1", rows: 120_000, schema: ["id", "label", "features"], owner: "ml-team" },
        { id: "ds_train_02", name: "training_set_v2", rows: 240_000, schema: ["id", "label", "features"], owner: "ml-team" },
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => { load(); }, []);

  const exportJSON = (payload, filename = "dataset_catalog.json") => {
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

  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), datasets }, `dataset_catalog_${new Date().toISOString()}.json`);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">UI57 — Dataset Catalog</h1>
      <p className="mt-2 text-gray-600">List and preview training datasets with metadata and schema.</p>

      <div className="mt-4 mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">Datasets</div>
        <div className="flex gap-2">
          <button onClick={exportAll} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export JSON</button>
          <button onClick={load} className="px-3 py-1 bg-gray-100 rounded text-sm">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow-sm p-4">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-gray-500">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Rows</th>
                <th className="p-2">Owner</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-2">{d.id}</td>
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.rows.toLocaleString()}</td>
                  <td className="p-2">{d.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
