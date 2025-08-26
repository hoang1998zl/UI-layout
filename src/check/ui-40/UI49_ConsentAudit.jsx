import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";

export default function UI49_ConsentAudit() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const initialRecords = useMemo(
    () => [
      { id: "c-1001", user: "user1@example.com", action: "granted", date: "2025-07-01", reason: "Initial opt-in", source: "web" },
      { id: "c-1002", user: "user2@example.com", action: "revoked", date: "2025-08-10", reason: "User requested", source: "support" },
      { id: "c-1003", user: "user3@example.com", action: "granted", date: "2025-08-20", reason: "Marketing opt-in", source: "mobile" },
    ],
    []
  );

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // new UI states
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailTab, setDetailTab] = useState("overview");
  const [detailHistory, setDetailHistory] = useState([]);
  // debounced search state to avoid filtering on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // presets, confirm/toast and undo stack state used across the UI
  const [presets, setPresets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ui49.presets') || '{}'); } catch (e) { return {}; }
  });
  const [presetName, setPresetName] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);
  const undoStackRef = useRef([]);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const mockFetch = () => new Promise((resolve) => setTimeout(() => resolve(initialRecords), 400));

  // export CSV helper
  const exportCSV = (rows, filename = 'export.csv') => {
    if (!rows || rows.length === 0) return exportJSON([], filename.replace('.csv', '.json'));
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(',')].concat(rows.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g,'""')}"`).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockFetch();
      setRecords(Array.isArray(data) ? data : []);
      setSelectedIds(new Set());
      setPage(1);
    } catch (err) {
      setError(err?.message || "Failed to load consent records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filtering (use debouncedQuery)
  const filtered = records.filter((r) => {
    if (statusFilter !== "All" && r.action !== statusFilter) return false;
    if (dateFrom && new Date(r.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(r.date) > new Date(dateTo)) return false;
    if (!debouncedQuery) return true;
    const q = debouncedQuery.toLowerCase();
    return (
      r.user.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.reason && r.reason.toLowerCase().includes(q))
    );
  });

  // helper: highlight first match of query inside text
  const highlight = (text = "", q) => {
    if (!q) return text;
    const t = String(text);
    const qi = q.toLowerCase();
    const idx = t.toLowerCase().indexOf(qi);
    if (idx === -1) return t;
    return (
      <>
        {t.slice(0, idx)}
        <mark className="bg-orange-200">{t.slice(idx, idx + q.length)}</mark>
        {t.slice(idx + q.length)}
      </>
    );
  };

  // sorting
  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "date") return dir * (new Date(a.date) - new Date(b.date));
    if (sortBy === "user") return dir * a.user.localeCompare(b.user);
    return 0;
  });

  // pagination
  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);
  const pageItems = sorted.slice((current - 1) * pageSize, current * pageSize);

  // selection helpers
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  // select visible items (defaults to current page items)
  const selectAllVisible = (items = pageItems) => setSelectedIds(new Set(items.map((r) => r.id)));
  const clearSelection = () => setSelectedIds(new Set());

  const exportJSON = (payload, filename = "consent_export.json") => {
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

  const exportFiltered = () => exportJSON({ exportedAt: new Date().toISOString(), filter: { statusFilter, query, dateFrom, dateTo }, count: sorted.length, records: sorted }, `consent_filtered_${new Date().toISOString()}.json`);
  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), count: records.length, records }, `consent_all_${new Date().toISOString()}.json`);
  const exportSelected = () => {
    const sel = records.filter((r) => selectedIds.has(r.id));
    exportJSON({ exportedAt: new Date().toISOString(), count: sel.length, records: sel }, `consent_selected_${new Date().toISOString()}.json`);
  };

  // presets management
  const savePreset = (name) => {
    if (!name) return;
    const p = { query, statusFilter, dateFrom, dateTo };
    const next = { ...presets, [name]: p };
    setPresets(next);
    localStorage.setItem('ui49.presets', JSON.stringify(next));
    setPresetName('');
  };
  const applyPreset = (name) => {
    const p = presets[name];
    if (!p) return;
    setQuery(p.query || '');
    setStatusFilter(p.statusFilter || 'All');
    setDateFrom(p.dateFrom || '');
    setDateTo(p.dateTo || '');
  };
  const deletePreset = (name) => {
    const next = { ...presets }; delete next[name]; setPresets(next); localStorage.setItem('ui49.presets', JSON.stringify(next));
  };

  // bulk actions (simulate revoke/restore)
  const confirmBulkAction = (type) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return setToast({ message: 'No selection', actionLabel: null });
    setConfirmAction({ type, ids });
  };

  const performBulkAction = (type, ids) => {
    // snapshot for undo
    const before = records.map(r => ({ ...r }));
    // apply
    const next = records.map(r => ids.includes(r.id) ? { ...r, action: type === 'revoke' ? 'revoked' : 'granted' } : r);
    setRecords(next);
    // push undo
    undoStackRef.current.push(before);
    setToast({ message: `${ids.length} record(s) ${type === 'revoke' ? 'revoked' : 'restored'}.`, actionLabel: 'Undo' });
    setSelectedIds(new Set());
    setConfirmAction(null);
  };

  const undoLast = () => {
    const snap = undoStackRef.current.pop();
    if (!snap) return setToast({ message: 'Nothing to undo' });
    setRecords(snap);
    setToast({ message: 'Undo completed' });
  };

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const fetchDetailHistory = (id) => {
    // mock history for the selected consent record
    setDetailHistory([]);
    setTimeout(() => {
      const entries = [
        { id: `${id}-h1`, action: "granted", actor: "system", date: "2025-07-01T10:00:00Z", note: "Initial opt-in" },
        { id: `${id}-h2`, action: "revoked", actor: "user", date: "2025-08-10T08:30:00Z", note: "User requested removal" },
        { id: `${id}-h3`, action: "granted", actor: "marketing", date: "2025-08-20T12:15:00Z", note: "Marketing opt-in" },
      ];
      setDetailHistory(entries);
    }, 300);
  };

  const openDetail = (r) => {
    setDetailRecord(r);
    setDetailTab("overview");
    fetchDetailHistory(r.id);
  };

  // keyboard shortcuts: Cmd/Ctrl+A selects visible, Esc closes modal/confirm/toast, Enter opens detail when single selection
  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'a') {
        e.preventDefault();
        if (pageItems && pageItems.length) setSelectedIds(new Set(pageItems.map(r => r.id)));
        return;
      }
      if (key === 'Escape') {
        if (detailRecord) setDetailRecord(null);
        else if (typeof setConfirmAction === 'function' && confirmAction) setConfirmAction(null);
        else if (typeof setToast === 'function' && toast) setToast(null);
        return;
      }
      if (key === 'Enter') {
        if (selectedIds && selectedIds.size === 1) {
          const id = Array.from(selectedIds)[0];
          const rec = records.find(r => r.id === id);
          if (rec) openDetail(rec);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pageItems, selectedIds, detailRecord, confirmAction, toast, records]);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">UI49 — Consent Audit</h1>
        <p className="mt-1 text-gray-600">Review consent changes and audit history.</p>
      </header>

      <div className="p-4 mb-4 bg-white rounded shadow-sm">
        <div className="flex flex-col gap-3 mb-3 md:flex-row md:items-center">
          <input
            className="flex-1 p-2 border rounded"
            placeholder="Search by user, consent id or reason"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="p-2 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option value="granted">granted</option>
            <option value="revoked">revoked</option>
          </select>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">From</label>
            <input className="p-2 border rounded" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <label className="text-xs text-gray-500">To</label>
            <input className="p-2 border rounded" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <button onClick={fetchRecords} className="px-2.5 py-1.5 bg-gray-100 rounded text-sm">Refresh</button>
            <button onClick={() => typeof setRetryToken === 'function' ? setRetryToken((t) => t + 1) : null} className="px-2.5 py-1.5 bg-yellow-100 rounded text-sm">Retry</button>
            <div className="flex gap-1">
              <button onClick={exportAll} className="px-2.5 py-1.5 text-white bg-blue-600 rounded text-sm">Export All</button>
              <button onClick={() => exportCSV(sorted, `consent_all_${new Date().toISOString()}.csv`)} className="px-2.5 py-1.5 text-white bg-indigo-600 rounded text-sm">CSV</button>
            </div>

            <button onClick={exportSelected} disabled={selectedIds.size === 0} className={`px-2.5 py-1.5 rounded text-sm ${selectedIds.size === 0 ? 'bg-gray-200 text-gray-400' : 'bg-green-600 text-white'}`}>
              Export Selected ({selectedIds.size})
            </button>
            <button onClick={() => confirmBulkAction('revoke')} disabled={selectedIds.size===0} className={`px-2.5 py-1.5 rounded text-sm ${selectedIds.size===0 ? 'bg-gray-200 text-gray-400' : 'bg-red-600 text-white'}`}>Bulk Revoke</button>
            <button onClick={() => confirmBulkAction('restore')} disabled={selectedIds.size===0} className={`px-2.5 py-1.5 rounded text-sm ${selectedIds.size===0 ? 'bg-gray-200 text-gray-400' : 'bg-green-700 text-white'}`}>Bulk Restore</button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 text-xs text-red-500">
            <span>{error}</span>
            <button onClick={fetchRecords} className="px-2 py-1 bg-gray-100 rounded">Retry</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs text-gray-500">
                  <th className="p-2"><input type="checkbox" checked={pageItems.length>0 && pageItems.every(r => selectedIds.has(r.id))} onChange={(e) => {
                    if (e.target.checked) setSelectedIds(new Set(pageItems.map(r => r.id)));
                    else setSelectedIds((prev) => {
                      const next = new Set(prev);
                      pageItems.forEach(r => next.delete(r.id));
                      return next;
                    });
                  }} /></th>
                  <th className="p-2 cursor-pointer" onClick={() => toggleSort('id')}>ID {sortBy==='id' ? (sortDir==='asc' ? '▲' : '▼') : ''}</th>
                  <th className="p-2 cursor-pointer" onClick={() => toggleSort('user')}>User {sortBy==='user' ? (sortDir==='asc' ? '▲' : '▼') : ''}</th>
                  <th className="p-2">Action</th>
                  <th className="p-2 cursor-pointer" onClick={() => toggleSort('date')}>Date {sortBy==='date' ? (sortDir==='asc' ? '▲' : '▼') : ''}</th>
                  <th className="p-2">Source</th>
                  <th className="p-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="p-2"><input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleSelect(r.id)} /></td>
                    <td className="p-2"><button className="text-blue-600 underline" onClick={() => openDetail(r)}>{highlight(r.id, debouncedQuery)}</button></td>
                    <td className="p-2">{highlight(r.user, debouncedQuery)}</td>
                    <td className="p-2">{r.action}</td>
                    <td className="p-2">{r.date}</td>
                    <td className="p-2">{r.source || '-'}</td>
                    <td className="p-2">{r.reason ? highlight(r.reason, debouncedQuery) : '-'}</td>
                  </tr>
                ))}

                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-gray-500">No consent records match the current filters.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
              <div>Showing {Math.min(total, (current - 1) * pageSize + 1)} - {Math.min(total, current * pageSize)} of {total}</div>
              <div className="flex items-center gap-2">
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="p-1 border rounded">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 bg-gray-100 rounded">Prev</button>
                <span>Page {current} / {pages}</span>
                <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-2 py-1 bg-gray-100 rounded">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">Tip: use Export to download consent history for compliance reporting.</div>

      {/* detail drawer/modal - convert to right-side drawer with scroll */}
      {detailRecord && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
          <div className="w-full h-full transition-transform transform bg-white shadow-lg md:w-96">
            <div className="flex items-start justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Consent Detail — {detailRecord.id}</h3>
              <button onClick={() => setDetailRecord(null)} className="text-gray-500">Close</button>
            </div>
            <div className="h-full p-4 overflow-auto">
              {/* tabs */}
              <div className="mt-3">
                <div className="flex gap-2 pb-2 border-b">
                  <button className={`px-2 py-1 ${detailTab === 'overview' ? 'border-b-2 border-blue-600' : 'text-gray-600'}`} onClick={() => setDetailTab('overview')}>Overview</button>
                  <button className={`px-2 py-1 ${detailTab === 'history' ? 'border-b-2 border-blue-600' : 'text-gray-600'}`} onClick={() => setDetailTab('history')}>History</button>
                  <button className={`px-2 py-1 ${detailTab === 'raw' ? 'border-b-2 border-blue-600' : 'text-gray-600'}`} onClick={() => setDetailTab('raw')}>Raw JSON</button>
                </div>

                {detailTab === 'overview' && (
                  <div className="mt-3 text-sm">
                    <div><strong>User:</strong> {detailRecord.user}</div>
                    <div><strong>Action:</strong> {detailRecord.action}</div>
                    <div><strong>Date:</strong> {detailRecord.date}</div>
                    <div><strong>Source:</strong> {detailRecord.source || '-'}</div>
                    <div className="mt-2"><strong>Reason:</strong><div className="p-2 mt-1 rounded bg-gray-50">{detailRecord.reason || '-'}</div></div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(detailRecord, null, 2)); }} className="px-3 py-1 bg-gray-100 rounded">Copy JSON</button>
                      <button onClick={() => { exportJSON(detailRecord, `consent_${detailRecord.id}.json`); }} className="px-3 py-1 text-white bg-blue-600 rounded">Export</button>
                    </div>
                  </div>
                )}

                {detailTab === 'history' && (
                  <div className="mt-3 text-sm">
                    {detailHistory.length === 0 ? (
                      <div className="text-gray-500">Loading history…</div>
                    ) : (
                      <ul className="space-y-2">
                        {detailHistory.map((h) => (
                          <li key={h.id} className="p-2 border rounded">
                            <div className="text-xs text-gray-600">{new Date(h.date).toLocaleString()} · {h.actor}</div>
                            <div className="font-medium">{h.action}</div>
                            <div className="text-sm text-gray-700">{h.note}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {detailTab === 'raw' && (
                  <div className="mt-3 text-sm">
                    <pre className="p-3 overflow-auto text-xs bg-gray-100 rounded max-h-60">{JSON.stringify(detailRecord, null, 2)}</pre>
                    <div className="flex justify-end gap-2 mt-3">
                      <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(detailRecord, null, 2))} className="px-3 py-1 bg-gray-100 rounded">Copy</button>
                      <button onClick={() => exportJSON(detailRecord, `consent_${detailRecord.id}.json`)} className="px-3 py-1 text-white bg-blue-600 rounded">Export JSON</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* confirm modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="p-4 bg-white rounded shadow w-96">
            <div className="font-medium">Confirm {confirmAction.type}</div>
            <div className="mt-2 text-sm text-gray-600">Apply "{confirmAction.type}" to {confirmAction.ids.length} selected record(s)?</div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setConfirmAction(null)} className="px-3 py-1 bg-gray-100 rounded">Cancel</button>
              <button onClick={() => performBulkAction(confirmAction.type, confirmAction.ids)} className="px-3 py-1 text-white bg-red-600 rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* toast/undo */}
      {toast && (
        <div className="fixed z-50 right-4 bottom-4">
          <div className="flex items-center gap-3 px-4 py-2 text-white bg-gray-800 rounded shadow">
            <div>{toast.message}</div>
            {toast.actionLabel !== null && (
              <button onClick={undoLast} className="underline">Undo</button>
            )}
            <button onClick={() => setToast(null)} className="ml-2 text-gray-300">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
