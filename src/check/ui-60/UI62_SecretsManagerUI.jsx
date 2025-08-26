import React, { useEffect, useMemo, useRef, useState } from "react";

export default function UI62_SecretsManagerUI() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef(null);

  const initialSecrets = useMemo(
    () => [
      { id: "s-2001", name: "db/password", type: "credential", environment: "prod", owner: "infra-team", createdAt: "2025-06-10" },
      { id: "s-2002", name: "api/key/payment", type: "api-key", environment: "staging", owner: "payments", createdAt: "2025-07-15" },
      { id: "s-2003", name: "oauth/client_secret", type: "credential", environment: "prod", owner: "auth", createdAt: "2025-08-01" },
      { id: "s-2004", name: "smtp/password", type: "credential", environment: "dev", owner: "comm", createdAt: "2025-08-12" },
      // ... add more mock rows if desired
    ],
    []
  );

  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // table controls
  const [sortBy, setSortBy] = useState({ field: "name", dir: "asc" });
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  // detail drawer
  const [detail, setDetail] = useState(null);
  const [detailTab, setDetailTab] = useState("overview");

  const mockFetch = (shouldFail = false) =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        if (shouldFail) return reject(new Error("Simulated network error"));
        resolve(initialSecrets);
      }, 450)
    );

  const fetchSecrets = async (opts = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockFetch(opts.fail);
      setSecrets(Array.isArray(data) ? data : []);
      setSelectedIds(new Set());
      setPage(1);
    } catch (err) {
      setError(err?.message || "Failed to load secrets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecrets();
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce query
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // filtering
  const filtered = useMemo(() => {
    if (!debouncedQuery) return secrets;
    const q = debouncedQuery.toLowerCase();
    return secrets.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.owner.toLowerCase().includes(q) ||
      s.environment.toLowerCase().includes(q)
    );
  }, [secrets, debouncedQuery]);

  // sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { field, dir } = sortBy;
    arr.sort((a, b) => {
      const va = (a[field] || "").toString();
      const vb = (b[field] || "").toString();
      if (field === "createdAt") {
        return dir === "asc" ? new Date(va) - new Date(vb) : new Date(vb) - new Date(va);
      }
      return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return arr;
  }, [filtered, sortBy]);

  // pagination
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [pageCount]);
  const paginated = useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [sorted, page, pageSize]);

  // selection helpers
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAllPage = () => setSelectedIds(new Set(paginated.map((s) => s.id)));
  const selectAllMatching = () => setSelectedIds(new Set(sorted.map((s) => s.id)));
  const clearSelection = () => setSelectedIds(new Set());

  // exports
  const exportJSON = (payload, filename = "secrets_export.json") => {
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

  const exportCSV = (rows, filename = "secrets_export.csv") => {
    if (!rows || rows.length === 0) return;
    const keys = ["id", "name", "type", "environment", "owner", "createdAt"];
    const csv = [keys.join(","), ...rows.map(r => keys.map(k => `"${(r[k] || "").toString().replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportSelected = () => {
    const selected = secrets.filter((s) => selectedIds.has(s.id));
    exportJSON({ exportedAt: new Date().toISOString(), count: selected.length, secrets: selected }, `secrets_selected_${new Date().toISOString()}.json`);
  };

  const exportAll = () => {
    exportJSON({ exportedAt: new Date().toISOString(), count: secrets.length, secrets }, `secrets_all_${new Date().toISOString()}.json`);
  };

  const exportSelectedCSV = () => {
    const selected = secrets.filter((s) => selectedIds.has(s.id));
    exportCSV(selected, `secrets_selected_${new Date().toISOString()}.csv`);
  };

  // detail drawer
  const openDetail = (row) => { setDetail(row); setDetailTab("overview"); }
  const closeDetail = () => setDetail(null);

  // utilities
  const toggleSort = (field) => {
    setSortBy((curr) => ({ field, dir: curr.field === field ? (curr.dir === "asc" ? "desc" : "asc") : "asc" }));
  };

  const highlightText = (text = "", q = "") => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}<mark className="text-orange-800 bg-yellow-200">{text.slice(idx, idx + q.length)}</mark>{text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">UI62 — Secrets Manager UI (Mock)</h1>
        <p className="mt-1 text-gray-600">Mock interface for viewing secret metadata. Do not store real secrets here.</p>
      </header>

      <div className="p-4 mb-4 bg-white rounded shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <input
            className="flex-1 p-2 border rounded"
            placeholder="Search by name, id, owner, or environment"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="flex gap-2">
            <button onClick={() => fetchSecrets()} className="px-3 py-1 bg-gray-100 rounded">Refresh</button>
            <button onClick={() => fetchSecrets({ fail: true })} className="px-3 py-1 text-red-700 bg-red-100 rounded">Simulate Error</button>

            <div className="relative inline-flex">
              <button onClick={selectAllPage} className="px-3 py-1 bg-gray-100 rounded">Select page</button>
              <button onClick={selectAllMatching} className="px-3 py-1 bg-gray-100 rounded">Select all matching</button>
              <button onClick={clearSelection} className="px-3 py-1 bg-gray-100 rounded">Clear</button>
            </div>

            <button onClick={exportSelected} className="px-3 py-1 text-white bg-blue-600 rounded">Export JSON</button>
            <button onClick={exportSelectedCSV} className="px-3 py-1 text-white bg-green-600 rounded">Export CSV</button>
            <button onClick={exportAll} className="px-3 py-1 bg-gray-100 rounded">Export all JSON</button>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="w-1/4 h-8 mb-2 bg-gray-200 rounded" />
            <div className="space-y-2">
              {Array.from({ length: Math.min(5, pageSize) }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-between text-sm text-red-600">
            <div>{error}</div>
            <div>
              <button onClick={() => fetchSecrets()} className="px-3 py-1 mr-2 bg-gray-100 rounded">Retry</button>
              <button onClick={() => fetchSecrets({ fail: false })} className="px-3 py-1 bg-gray-100 rounded">Reload</button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs text-gray-500">
                  <th className="p-2">
                    <input
                      type="checkbox"
                      checked={paginated.length > 0 && paginated.every(s => selectedIds.has(s.id))}
                      onChange={(e) => e.target.checked ? selectAllPage() : clearSelection()}
                    />
                  </th>
                  <th className="p-2 cursor-pointer" onClick={() => toggleSort('id')}>ID {sortBy.field === 'id' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th className="p-2 cursor-pointer" onClick={() => toggleSort('name')}>Name {sortBy.field === 'name' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th className="p-2 cursor-pointer" onClick={() => toggleSort('type')}>Type</th>
                  <th className="p-2 cursor-pointer" onClick={() => toggleSort('environment')}>Environment</th>
                  <th className="p-2 cursor-pointer" onClick={() => toggleSort('owner')}>Owner</th>
                  <th className="p-2 cursor-pointer" onClick={() => toggleSort('createdAt')}>Created {sortBy.field === 'createdAt' ? (sortBy.dir === 'asc' ? '▲' : '▼') : ''}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((s) => (
                  <tr key={s.id} className="border-t cursor-pointer hover:bg-gray-50" onClick={(e) => { if ((e.target && e.target.type) !== 'checkbox') openDetail(s); }}>
                    <td className="p-2"><input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleSelect(s.id)} onClick={(e) => e.stopPropagation()} /></td>
                    <td className="p-2">{highlightText(s.id, debouncedQuery)}</td>
                    <td className="p-2">{highlightText(s.name, debouncedQuery)}</td>
                    <td className="p-2">{s.type}</td>
                    <td className="p-2">{highlightText(s.environment, debouncedQuery)}</td>
                    <td className="p-2">{highlightText(s.owner, debouncedQuery)}</td>
                    <td className="p-2">{s.createdAt}</td>
                  </tr>
                ))}

                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-gray-500">No secrets match the current filter.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Page</span>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 bg-gray-100 rounded">Prev</button>
                <span className="px-2">{page} / {pageCount}</span>
                <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-2 py-1 bg-gray-100 rounded">Next</button>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="p-1 ml-2 border rounded">
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                </select>
              </div>

              <div className="text-sm text-gray-500">Showing {Math.min(sorted.length, (page - 1) * pageSize + 1)}-
                {Math.min(sorted.length, page * pageSize)} of {sorted.length}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 text-xs text-gray-500">
        Note: This is a mock viewer for metadata only. Secrets values are intentionally omitted.
      </div>

      {/* detail drawer */}
      {detail && (
        <div className="fixed right-0 top-0 h-full w-[420px] bg-white border-l shadow-lg z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <div className="text-lg font-semibold">{detail.name}</div>
              <div className="text-xs text-gray-500">{detail.id} • {detail.environment} • {detail.owner}</div>
            </div>
            <div>
              <button onClick={closeDetail} className="px-2 py-1 bg-gray-100 rounded">Close</button>
            </div>
          </div>

          <div className="p-3 border-b">
            <div className="flex gap-2 text-sm">
              <button onClick={() => setDetailTab('overview')} className={`px-2 py-1 rounded ${detailTab === 'overview' ? 'bg-gray-200' : ''}`}>Overview</button>
              <button onClick={() => setDetailTab('raw')} className={`px-2 py-1 rounded ${detailTab === 'raw' ? 'bg-gray-200' : ''}`}>Raw JSON</button>
            </div>
          </div>

          <div className="p-4 overflow-auto">{
            detailTab === 'overview' ? (
              <div className="space-y-2 text-sm">
                <div><strong>ID:</strong> {detail.id}</div>
                <div><strong>Name:</strong> {detail.name}</div>
                <div><strong>Type:</strong> {detail.type}</div>
                <div><strong>Environment:</strong> {detail.environment}</div>
                <div><strong>Owner:</strong> {detail.owner}</div>
                <div><strong>Created:</strong> {detail.createdAt}</div>
              </div>
            ) : (
              <pre className="p-2 overflow-auto text-xs rounded bg-gray-50">{JSON.stringify(detail, null, 2)}</pre>
            )
          }</div>

          <div className="p-3 text-right border-t">
            <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(detail)); }} className="px-3 py-1 bg-gray-100 rounded">Copy JSON</button>
          </div>
        </div>
      )}
    </div>
  );
}
