import React, { useEffect, useMemo, useState } from "react";

export default function UI61_ServiceCatalog() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(() => new Set());
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [drawerService, setDrawerService] = useState(null);
  const [retryToken, setRetryToken] = useState(0);

  // Mock fetch with occasional error for retry demo
  const fetchServices = () => {
    setLoading(true);
    setError(null);
    // simulate network latency
    setTimeout(() => {
      // 15% chance to simulate transient error
      if (Math.random() < 0.15) {
        setError("Failed to fetch services. Network error (simulated).");
        setServices([]);
        setLoading(false);
        return;
      }

      // generate mock services
      const items = Array.from({ length: 23 }).map((_, i) => {
        const id = `svc-${String(i + 1).padStart(3, "0")}`;
        const name = ["auth-service", "orders-api", "billing", "inventory", "search", "gateway", "notifications"][i % 7] + `-${i + 1}`;
        const status = Math.random() > 0.2 ? "Healthy" : (Math.random() > 0.5 ? "Degraded" : "Down");
        const endpoints = ["/health", "/v1/items", "/v1/create"].slice(0, (i % 3) + 1);
        return {
          id,
          name,
          status,
          version: `v${1 + (i % 3)}.${i % 10}`,
          owner: ["platform", "sales", "finance", "ops"][i % 4],
          endpoints,
          lastCheckedAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
        };
      });

      setServices(items);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryToken]);

  const refresh = () => {
    // clear selection and drawer on refresh
    setSelected(new Set());
    setDrawerService(null);
    fetchServices();
  };

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

  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), services }, `services_${new Date().toISOString()}.json`);
  const exportSelected = () => {
    const sel = services.filter((s) => selected.has(s.id));
    exportJSON({ exportedAt: new Date().toISOString(), selected: sel }, `services_selected_${new Date().toISOString()}.json`);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visibleServices = useMemo(() => {
    let items = services.slice();
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }
    if (statusFilter !== "All") {
      items = items.filter((s) => s.status === statusFilter);
    }

    items.sort((a, b) => {
      const k = sortBy.key;
      const va = (a[k] || "").toString().toLowerCase();
      const vb = (b[k] || "").toString().toLowerCase();
      if (va < vb) return sortBy.dir === "asc" ? -1 : 1;
      if (va > vb) return sortBy.dir === "asc" ? 1 : -1;
      return 0;
    });

    return items;
  }, [services, query, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visibleServices.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = visibleServices.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    setSortBy((s) => {
      if (s.key === key) return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "asc" };
    });
  };

  const toggleSelectAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allVisibleIds = pageItems.map((i) => i.id);
      const allSelected = allVisibleIds.every((id) => next.has(id));
      if (allSelected) {
        allVisibleIds.forEach((id) => next.delete(id));
      } else {
        allVisibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">UI61 — Service Catalog</h1>
      <p className="mt-2 text-gray-600">List microservices, endpoints, owners and health checks. Includes search, filter, selection, sorting, pagination and export.</p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or id…"
            className="px-3 py-2 border rounded w-64"
          />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2 py-2 border rounded">
            <option>All</option>
            <option>Healthy</option>
            <option>Degraded</option>
            <option>Down</option>
          </select>

          <button onClick={() => { setQuery(""); setStatusFilter("All"); }} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
        </div>

        <div className="flex gap-2">
          <button onClick={refresh} className="px-3 py-2 bg-gray-100 rounded">Refresh</button>
          <button onClick={() => setRetryToken((t) => t + 1)} className="px-3 py-2 bg-yellow-100 rounded">Retry</button>
          <button onClick={exportAll} className="px-3 py-2 bg-blue-600 text-white rounded">Export All</button>
          <button onClick={exportSelected} disabled={selected.size === 0} className={`px-3 py-2 rounded ${selected.size === 0 ? 'bg-gray-200 text-gray-400' : 'bg-green-600 text-white'}`}>
            Export Selected ({selected.size})
          </button>
        </div>
      </div>

      <div className="mt-4">
        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-red-700">Error</div>
                <div className="text-sm text-red-600 mt-1">{error}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setRetryToken((t) => t + 1)} className="px-3 py-1 bg-red-600 text-white rounded">Retry</button>
                <button onClick={refresh} className="px-3 py-1 bg-gray-100 rounded">Refresh</button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-3 bg-white rounded shadow-sm">
          <div className="p-3 border-b flex items-center gap-3">
            <input type="checkbox" onChange={toggleSelectAllVisible} checked={pageItems.length > 0 && pageItems.every((p) => selected.has(p.id))} />
            <div className="flex-1 flex gap-4 items-center text-sm font-medium">
              <button onClick={() => toggleSort("name")} className="flex items-center gap-1">Name {sortBy.key === 'name' ? (sortBy.dir === 'asc' ? '↑' : '↓') : ''}</button>
              <button onClick={() => toggleSort("status")} className="flex items-center gap-1">Status {sortBy.key === 'status' ? (sortBy.dir === 'asc' ? '↑' : '↓') : ''}</button>
            </div>
            <div className="w-48 text-right text-sm text-gray-500">Actions</div>
          </div>

          {loading ? (
            <div className="p-4">
              {Array.from({ length: pageSize }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 py-3">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <ul className="divide-y">
              {pageItems.map((s) => (
                <li key={s.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} />
                    <div>
                      <button onClick={() => setDrawerService(s)} className="text-sm font-medium text-left hover:underline">{s.name}</button>
                      <div className="text-xs text-gray-500">{s.id} · owner: {s.owner}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`text-sm ${s.status === 'Healthy' ? 'text-green-600' : s.status === 'Degraded' ? 'text-yellow-600' : 'text-red-600'}`}>{s.status}</div>
                    <div className="text-xs text-gray-500">{new Date(s.lastCheckedAt).toLocaleString()}</div>
                    <div>
                      <button onClick={() => exportJSON(s, `${s.id}.json`)} className="px-2 py-1 bg-gray-100 rounded">Export</button>
                    </div>
                  </div>
                </li>
              ))}

              {pageItems.length === 0 && (
                <li className="p-6 text-center text-sm text-gray-500">No services match the current filters.</li>
              )}
            </ul>
          )}

          <div className="p-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {Math.min((page - 1) * pageSize + 1, visibleServices.length)}–{Math.min(page * pageSize, visibleServices.length)} of {visibleServices.length}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`px-2 py-1 rounded ${page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200'}`}>Prev</button>
              <div className="px-2">{page} / {totalPages}</div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`px-2 py-1 rounded ${page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200'}`}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {drawerService && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1" onClick={() => setDrawerService(null)} />
          <div className="w-96 bg-white shadow-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{drawerService.name}</div>
                <div className="text-xs text-gray-500">{drawerService.id}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard?.writeText(drawerService.id)} className="px-2 py-1 bg-gray-100 rounded">Copy ID</button>
                <button onClick={() => setDrawerService(null)} className="px-2 py-1 bg-gray-100 rounded">Close</button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <div><strong>Owner:</strong> {drawerService.owner}</div>
              <div className="mt-2"><strong>Version:</strong> {drawerService.version}</div>
              <div className="mt-2"><strong>Status:</strong> {drawerService.status}</div>
              <div className="mt-2"><strong>Last checked:</strong> {new Date(drawerService.lastCheckedAt).toLocaleString()}</div>
              <div className="mt-3"><strong>Endpoints:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {drawerService.endpoints.map((ep, i) => <li key={i} className="text-xs">{ep}</li>)}
                </ul>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => exportJSON(drawerService, `${drawerService.id}.json`)} className="px-3 py-2 bg-blue-600 text-white rounded">Export</button>
                <button onClick={() => { setSelected((s) => new Set(s).add(drawerService.id)); }} className="px-3 py-2 bg-green-100 rounded">Select</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
