import React, { useEffect, useMemo, useState } from "react";

export default function UI46_DataCatalogBrowser() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [tagFilter, setTagFilter] = useState("All");

  // mock API: simulate fetching datasets with a short delay
  const mockFetchDatasets = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "ds_customers", name: "customers", rows: 1_234_567, owner: "sales", tags: ["pii", "sales"] },
          { id: "ds_orders", name: "orders", rows: 4_567_890, owner: "logistics", tags: ["events"] },
          { id: "ds_products", name: "products", rows: 12_345, owner: "catalog", tags: ["master"] },
          { id: "ds_events", name: "click_events", rows: 98_765_432, owner: "analytics", tags: ["events", "raw"] },
          { id: "ds_invoices", name: "invoices", rows: 54_321, owner: "finance", tags: ["pii", "finance"] },
        ]);
      }, 600);
    });

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDatasets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockFetchDatasets();
      setDatasets(data);
    } catch (err) {
      setError(err?.message || "Failed to fetch datasets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const tags = useMemo(() => {
    const derived = Array.from(new Set(datasets.flatMap((d) => d.tags || [])));
    return ["All", ...derived];
  }, [datasets]);

  const filtered = datasets.filter((d) => {
    if (tagFilter !== "All" && !d.tags.includes(tagFilter)) return false;
    if (!query) return true;
    return d.name.toLowerCase().includes(query.toLowerCase()) || d.id.toLowerCase().includes(query.toLowerCase());
  });

  // export helpers
  const exportJSON = (payload, filename = "export.json") => {
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

  const exportFiltered = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      filter: { query, tagFilter },
      count: filtered.length,
      datasets: filtered,
    };
    exportJSON(payload, `datasets_filtered_${new Date().toISOString()}.json`);
  };

  const exportSelected = () => {
    if (!selected) return;
    const payload = { exportedAt: new Date().toISOString(), dataset: selected };
    exportJSON(payload, `dataset_${selected.id}_${new Date().toISOString()}.json`);
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">UI46 — Data Catalog Browser</h1>
        <p className="mt-1 text-gray-600">Search and browse datasets, view metadata and tags.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <aside className="p-4 bg-white rounded shadow-sm lg:col-span-1">
          <div className="mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Search datasets by name or id"
            />
          </div>

          <div>
            <div className="mb-2 text-xs text-gray-500">Tags</div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTagFilter(t)}
                  className={`text-xs px-2 py-1 rounded ${tagFilter === t ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="p-4 mb-4 bg-white rounded shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-medium">Datasets ({filtered.length})</h2>
                <div className="text-xs text-gray-500">Filters: <span className="font-medium">{tagFilter}</span></div>
              </div>

              <div className="flex items-center gap-2">
                {loading ? (
                  <div className="text-xs text-gray-500">Loading…</div>
                ) : error ? (
                  <div className="text-xs text-red-500">{error}</div>
                ) : null}

                <button
                  onClick={fetchDatasets}
                  className="px-2 py-1 text-xs bg-gray-100 rounded"
                  title="Refresh datasets"
                >
                  Refresh
                </button>

                <button
                  onClick={exportFiltered}
                  className="px-2 py-1 text-xs text-white bg-blue-600 rounded"
                  title="Export filtered datasets as JSON"
                  disabled={filtered.length === 0}
                >
                  Export filtered JSON
                </button>

                <button
                  onClick={exportSelected}
                  className={`text-xs px-2 py-1 rounded ${!selected ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white"}`}
                  title="Export selected dataset"
                  disabled={!selected}
                >
                  Export selected JSON
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-xs text-gray-500">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Rows</th>
                    <th className="p-2">Owner</th>
                    <th className="p-2">Tags</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 align-top">{d.id}</td>
                      <td className="p-2 align-top">{d.name}</td>
                      <td className="p-2 align-top">{d.rows.toLocaleString()}</td>
                      <td className="p-2 align-top">{d.owner}</td>
                      <td className="p-2 align-top">
                        <div className="flex flex-wrap gap-1">
                          {d.tags.map((t) => (
                            <span key={t} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 align-top">
                        <div className="flex gap-2">
                          <button onClick={() => setSelected(d)} className="px-2 py-1 text-sm bg-gray-100 rounded">Preview</button>
                          <button className="px-2 py-1 text-sm text-white bg-blue-600 rounded">Open</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-white rounded shadow-sm">
            <h3 className="mb-2 text-sm font-medium">Preview</h3>
            {!selected ? (
              <div className="text-gray-500">Select a dataset to see metadata and sample rows.</div>
            ) : (
              <div>
                <div className="mb-2 text-xs text-gray-500">{selected.id}</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="p-3 rounded bg-gray-50">
                    <div className="text-xs text-gray-500">Owner</div>
                    <div className="font-medium">{selected.owner}</div>
                  </div>
                  <div className="p-3 rounded bg-gray-50">
                    <div className="text-xs text-gray-500">Rows</div>
                    <div className="font-medium">{selected.rows.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded bg-gray-50">
                    <div className="text-xs text-gray-500">Tags</div>
                    <div className="flex flex-wrap gap-1 mt-1">{selected.tags.map((t) => <span key={t} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{t}</span>)}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 text-xs text-gray-500">Sample rows (mock)</div>
                  <pre className="p-3 overflow-auto text-xs text-white bg-black rounded">{`id,name,created_at\n1,John,2025-01-02\n2,Jane,2025-01-03\n3,Bob,2025-01-04`}</pre>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
