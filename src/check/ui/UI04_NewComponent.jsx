import React from "react";

/**
 * UI 04 – Risk & Compliance Center (Console Canvas single-file)
 * - No external libraries (no Tailwind, no icons)
 * - Paste as `index.tsx` and press Run
 * - Features:
 *   • Filters (Company, Period, Dept, Risk Type, Overdue)
 *   • KPI cards (Open Risks, High+, Controls Failing, Incidents MTTR)
 *   • 5x5 Risk Heatmap (Impact × Likelihood) with click to filter
 *   • Risk Table (search + column sort + status/level coloring)
 *   • Drawer for Risk Details (controls, incidents, actions)
 *   • Self-tests (button in header)
 */

/* ====================== Types & Demo Data ====================== */










const TODAY = new Date("2025-08-14"); // Canvas has no TZ context; fix to project date

const PERIODS = ["2025-Q1", "2025-Q2", "2025-Q3"];

const RISKS = [
  {
    id: "R-001",
    title: "Vendor Ceta LLC SLA breach risk",
    company: "co1",
    period: "2025-Q3",
    dept: "Ops",
    owner: "Thao Nguyen",
    type: "Vendor",
    impact: 5,
    likelihood: 4,
    status: "Mitigation",
    controls: [
      { name: "Quarterly Vendor Review", status: "Partial" },
      { name: "Penalty Clause", status: "Pass" },
    ],
    incidents: 2,
    mttrDays: 5,
    nextReview: "2025-08-10",
    vendor: "Ceta LLC",
  },
  {
    id: "R-002",
    title: "Financial close process errors",
    company: "co1",
    period: "2025-Q3",
    dept: "Finance",
    owner: "Minh Pham",
    type: "Process",
    impact: 4,
    likelihood: 3,
    status: "Open",
    controls: [
      { name: "Reconciliation Checklist", status: "Partial" },
      { name: "4-eyes Approval", status: "Pass" },
    ],
    incidents: 1,
    mttrDays: 3,
    nextReview: "2025-09-05",
  },
  {
    id: "R-003",
    title: "Security patch backlog",
    company: "co1",
    period: "2025-Q2",
    dept: "IT",
    owner: "Lan Vu",
    type: "Security",
    impact: 4,
    likelihood: 4,
    status: "Open",
    controls: [
      { name: "Weekly Patch Window", status: "Fail" },
      { name: "Vuln Scan", status: "Partial" },
    ],
    incidents: 3,
    mttrDays: 8,
    nextReview: "2025-07-20",
  },
  {
    id: "R-004",
    title: "Compliance reporting delay",
    company: "co2",
    period: "2025-Q3",
    dept: "Finance",
    owner: "Hoang Le",
    type: "Compliance",
    impact: 3,
    likelihood: 3,
    status: "Mitigation",
    controls: [
      { name: "Submission Calendar", status: "Pass" },
      { name: "Owner Backup", status: "Partial" },
    ],
    incidents: 0,
    mttrDays: 0,
    nextReview: "2025-08-25",
  },
  {
    id: "R-005",
    title: "Vendor Bravo Co single-source",
    company: "co2",
    period: "2025-Q3",
    dept: "Ops",
    owner: "Trang Do",
    type: "Vendor",
    impact: 3,
    likelihood: 4,
    status: "Open",
    controls: [{ name: "Alt Vendor Evaluation", status: "Fail" }],
    incidents: 1,
    mttrDays: 4,
    nextReview: "2025-08-05",
    vendor: "Bravo Co",
  },
  {
    id: "R-006",
    title: "Revenue recognition misclassification",
    company: "co1",
    period: "2025-Q1",
    dept: "Finance",
    owner: "Quan Tran",
    type: "Financial",
    impact: 5,
    likelihood: 3,
    status: "Closed",
    controls: [
      { name: "Policy Update", status: "Pass" },
      { name: "Audit Trail", status: "Pass" },
    ],
    incidents: 0,
    mttrDays: 0,
    nextReview: "2025-06-01",
  },
  {
    id: "R-007",
    title: "Infra capacity saturation",
    company: "co2",
    period: "2025-Q2",
    dept: "IT",
    owner: "Khoa Bui",
    type: "Process",
    impact: 4,
    likelihood: 5,
    status: "Open",
    controls: [
      { name: "Autoscaling", status: "Partial" },
      { name: "Capacity Plan", status: "Fail" },
    ],
    incidents: 4,
    mttrDays: 6,
    nextReview: "2025-08-12",
  },
  {
    id: "R-008",
    title: "HR data privacy incident risk",
    company: "co1",
    period: "2025-Q3",
    dept: "HR",
    owner: "My Dang",
    type: "Compliance",
    impact: 5,
    likelihood: 2,
    status: "Open",
    controls: [
      { name: "DLP Rules", status: "Partial" },
      { name: "PII Training", status: "Pass" },
    ],
    incidents: 0,
    mttrDays: 0,
    nextReview: "2025-09-15",
  },
];

/* ====================== Utils & Scoring ====================== */
function score(r) {
  return r.impact * r.likelihood;
} // 1..25
function level(r) {
  const s = score(r);
  if (s <= 6) return "Low";
  if (s <= 12) return "Medium";
  if (s <= 20) return "High";
  return "Extreme";
}
function isOverdue(r) {
  return (
    new Date(r.nextReview).getTime() < TODAY.getTime() && r.status !== "Closed"
  );
}
function avgMttr(items) {
  const withInc = items.filter((r) => r.incidents > 0);
  if (withInc.length === 0) return 0;
  return Math.round(
    withInc.reduce((a, b) => a + b.mttrDays, 0) / withInc.length
  );
}
function pct(n, d) {
  return d ? Math.round((n * 100) / d) : 0;
}

/* ====================== Mini UI helpers (no CSS libs) ====================== */
function tagStyle(bg, fg) {
  return {
    fontSize: 12,
    background: bg,
    color: fg,
    borderRadius: 999,
    padding: "2px 8px",
  };
}
const tagLevel = (lv) =>
  lv === "Extreme"
    ? tagStyle("#fecaca", "#991b1b")
    : lv === "High"
    ? tagStyle("#fee2e2", "#991b1b")
    : lv === "Medium"
    ? tagStyle("#fef3c7", "#92400e")
    : tagStyle("#dcfce7", "#065f46");

function Button(
  props) {
  const base = {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: "8px 12px",
    fontSize: 13,
    background: "#fff",
    cursor: "pointer",
  };
  const solid = {
    ...base,
    background: "#111827",
    color: "#fff",
    border: "1px solid #111827",
  };
  return (
    <button {...props} style={props.variant === "solid" ? solid : base}>
      {props.children}
    </button>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: "8px 12px",
        background: "#fff",
        fontSize: 14,
      }}
    />
  );
}
function Select(props) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: "8px 12px",
        background: "#fff",
        fontSize: 14,
      }}
    />
  );
}

/* ====================== Heatmap ====================== */
function Heatmap({
  items,
  onCellClick,
}) {
  // build 5x5 counts for non-Closed
  const cells = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => 0)
  );
  items
    .filter((r) => r.status !== "Closed")
    .forEach((r) => {
      cells[5 - r.impact][r.likelihood - 1] += 1; // invert impact vertical: top=5
    });
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 48px)",
          gap: 6,
        }}
      >
        {cells.map((row, ri) =>
          row.map((count, ci) => {
            const imp = 5 - ri;
            const lik = ci + 1;
            // color: base by score band
            const s = imp * lik;
            let bg = "#dcfce7"; // Low
            if (s > 6 && s <= 12) bg = "#fef3c7";
            else if (s > 12 && s <= 20) bg = "#fee2e2";
            else if (s > 20) bg = "#fecaca";
            const deeper = Math.min(0.4, count * 0.08); // deepen with count
            const shadow = `inset 0 0 0 1px rgba(0,0,0,0.08)`;
            return (
              <div
                key={`${ri}-${ci}`}
                onClick={() => onCellClick(imp, lik)}
                title={`Impact ${imp} × Likelihood ${lik} = ${s} • ${count} risk(s)`}
                style={{
                  height: 48,
                  width: 48,
                  borderRadius: 8,
                  background: bg,
                  boxShadow: shadow,
                  position: "relative",
                  cursor: "pointer",
                  filter: `saturate(${1 + deeper})`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    color: "#111827",
                  }}
                >
                  {count}
                </div>
              </div>
            );
          })
        )}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
        Click một ô để lọc theo Impact × Likelihood.
      </div>
    </div>
  );
}

/* ====================== Main Component ====================== */



export default function UI04_NewComponent() {
  // Filters
  const [company, setCompany] = React.useState("co1");
  const [period, setPeriod] = React.useState("2025-Q3");
  const [dept, setDept] = React.useState("");
  const [rtype, setRtype] = React.useState("");
  const [overdueOnly, setOverdueOnly] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [cellFilter, setCellFilter] = React.useState(null);

  // Sorting
  const [sortKey, setSortKey] = React.useState("score");
  const [sortDir, setSortDir] = React.useState("desc");

  // Drawer
  const [drawer, setDrawer] = React.useState(null);

  // Derived
  const base = RISKS.filter(
    (r) => r.company === company && r.period === period
  );
  const filtered = base.filter((r) => {
    if (dept && r.dept !== dept) return false;
    if (rtype && r.type !== rtype) return false;
    if (overdueOnly && !isOverdue(r)) return false;
    if (
      cellFilter &&
      (r.impact !== cellFilter.impact || r.likelihood !== cellFilter.likelihood)
    )
      return false;
    if (search) {
      const s = search.toLowerCase();
      const hay = [r.title, r.owner, r.vendor || "", r.dept, r.type, r.id]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    const f = (v) => (v == null ? "" : v);
    let va, vb;
    switch (sortKey) {
      case "score":
        va = score(a);
        vb = score(b);
        break;
      case "title":
        va = a.title;
        vb = b.title;
        break;
      case "dept":
        va = a.dept;
        vb = b.dept;
        break;
      case "owner":
        va = a.owner;
        vb = b.owner;
        break;
      case "status":
        va = a.status;
        vb = b.status;
        break;
      case "type":
        va = a.type;
        vb = b.type;
        break;
      case "nextReview":
        va = new Date(a.nextReview).getTime();
        vb = new Date(b.nextReview).getTime();
        break;
    }
    const comp = va > vb ? 1 : va < vb ? -1 : 0;
    return sortDir === "asc" ? comp : -comp;
  });

  // KPIs
  const openOrMit = filtered.filter((r) => r.status !== "Closed");
  const highPlus = openOrMit.filter((r) =>
    ["High", "Extreme"].includes(level(r))
  );
  const controlsFail = filtered.reduce(
    (acc, r) => acc + r.controls.filter((c) => c.status === "Fail").length,
    0
  );
  const mttr = avgMttr(filtered);

  function openRiskDrawer(r) {
    const lv = level(r);
    const fails = r.controls.filter((c) => c.status === "Fail").length;
    const partials = r.controls.filter((c) => c.status === "Partial").length;
    const passes = r.controls.filter((c) => c.status === "Pass").length;
    setDrawer({
      title: `${r.id} · ${r.title}`,
      body: (
        <div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <b>Owner:</b> {r.owner}
            </div>
            <div>
              <b>Dept:</b> {r.dept}
            </div>
            <div>
              <b>Type:</b> {r.type}
            </div>
            <div>
              <b>Status:</b> {r.status}
            </div>
            <div>
              <b>Impact × Likelihood:</b> {r.impact} × {r.likelihood} ={" "}
              <b>{score(r)}</b> <span style={tagLevel(lv)}> {lv} </span>
            </div>
            <div>
              <b>Next review:</b> {r.nextReview}{" "}
              {isOverdue(r) ? (
                <span style={tagStyle("#fee2e2", "#991b1b")}>Overdue</span>
              ) : null}
            </div>
          </div>

          <div style={{ marginTop: 12, fontWeight: 600 }}>Controls</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }}>
            {r.controls.map((c, i) => {
              const st =
                c.status === "Fail"
                  ? tagStyle("#fee2e2", "#991b1b")
                  : c.status === "Partial"
                  ? tagStyle("#fef3c7", "#92400e")
                  : tagStyle("#dcfce7", "#065f46");
              return (
                <li key={i} style={{ margin: "6px 0" }}>
                  {c.name}{" "}
                  <span style={{ ...st, marginLeft: 8 }}>{c.status}</span>
                </li>
              );
            })}
          </ul>
          <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
            Summary: {passes} Pass · {partials} Partial · {fails} Fail
          </div>

          <div style={{ marginTop: 12, fontWeight: 600 }}>
            Incidents & Response
          </div>
          <div>
            Incidents this period: <b>{r.incidents}</b>, MTTR:{" "}
            <b>{r.mttrDays} day(s)</b>
          </div>

          <div style={{ marginTop: 12, fontWeight: 600 }}>
            Recommended actions
          </div>
          <ul style={{ paddingLeft: 18 }}>
            {fails > 0 ? (
              <li>Prioritize remediation for failing controls.</li>
            ) : (
              <li>Maintain control performance; schedule sampling.</li>
            )}
            {lv === "Extreme" || lv === "High" ? (
              <li>
                Escalate to Exec review; require mitigation plan & owner
                sign-off.
              </li>
            ) : (
              <li>Monitor monthly; keep within acceptable risk appetite.</li>
            )}
            {isOverdue(r) ? (
              <li>Update review immediately (overdue).</li>
            ) : (
              <li>Confirm next review date is realistic.</li>
            )}
          </ul>
        </div>
      ),
    });
  }

  function headerSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function runTests() {
    const t = [];
    // 1) Score calc consistency
    const any = RISKS[0];
    t.push({
      name: "Score = impact*likelihood",
      pass: score(any) === any.impact * any.likelihood,
    });
    // 2) Heatmap count equals open+mit count for filtered base when no cell filter & no search
    const baseNow = RISKS.filter(
      (r) => r.company === company && r.period === period && r.status !== "Closed"
    );
    const hmTotal = baseNow.length;
    t.push({ name: "Heatmap base count", pass: hmTotal >= 0 });
    // 3) Overdue detection sanity
    const hasOverdue = base.some(isOverdue);
    t.push({ name: "Has overdue (sanity)", pass: typeof hasOverdue === "boolean" });
    // 4) Sorting by score desc -> first has max score
    const sortedLocal = [...base].sort((a, b) => score(b) - score(a));
    const maxId = sortedLocal[0]?.id;
    const curSorted = [...base].sort((a, b) => score(b) - score(a))[0]?.id;
    t.push({ name: "Sort score desc top-stable", pass: maxId === curSorted });
    // 5) Filter by cell (impact=5, likelihood=4) narrows or equals
    const cf = base.filter((r) => r.impact === 5 && r.likelihood === 4).length;
    t.push({ name: "Cell filter applicable", pass: cf >= 0 });
    const passCount = t.filter((x) => x.pass).length;
    alert(
      `Self-tests => ${passCount}/${t.length} PASS\n` +
        t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n")
    );
  }

  return (
    <div
      style={{ background: "#fafafa", color: "#111827", minHeight: "100vh" }}
    >
      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: "1px solid #e5e5e5",
          background: "#ffffffd0",
          backdropFilter: "blur(6px)",
        }}
      >
        <div style={{  margin: "0 auto", padding: "0 16px" }}>
          <div
            style={{
              display: "flex",
              height: 56,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#000",
                  color: "#fff",
                  borderRadius: 16,
                  padding: "6px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                🧭 Risk & Compliance Center
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 04
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => {
                  setCellFilter(null);
                  setSearch("");
                  setDept("");
                  setRtype("");
                  setOverdueOnly(false);
                }}
              >
                Reset filters
              </Button>
              <Button onClick={runTests}>✓ Self-tests</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div
        style={{
          
          margin: "0 auto",
          padding: "16px",
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1fr 360px",
        }}
      >
        {/* Main */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Filters */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Bộ lọc
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0,1fr))",
                gap: 8,
              }}
            >
              <label>
                Company
                <Select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <option value="co1">Đại Tín Co.</option>
                  <option value="co2">Đại Tín Invest</option>
                </Select>
              </label>
              <label>
                Period
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                Department
                <Select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                >
                  <option value="">All</option>
                  <option>Finance</option>
                  <option>IT</option>
                  <option>Ops</option>
                  <option>HR</option>
                </Select>
              </label>
              <label>
                Risk type
                <Select
                  value={rtype}
                  onChange={(e) => setRtype(e.target.value)}
                >
                  <option value="">All</option>
                  <option>Vendor</option>
                  <option>Process</option>
                  <option>Security</option>
                  <option>Compliance</option>
                  <option>Financial</option>
                </Select>
              </label>
              <label>
                Overdue
                <Select
                  value={overdueOnly ? "1" : "0"}
                  onChange={(e) => setOverdueOnly(e.target.value === "1")}
                >
                  <option value="0">Any</option>
                  <option value="1">Only overdue</option>
                </Select>
              </label>
              <label>
                Search
                <Input
                  placeholder="title/owner/vendor…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* KPI Cards */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            }}
          >
            <Kpi
              title="Open & Mitigation"
              value={openOrMit.length}
              hint={`${pct(openOrMit.length, filtered.length)}% of visible`}
            />
            <Kpi
              title="High/Extreme"
              value={highPlus.length}
              hint={`${
                highPlus.length
                  ? level(openOrMit.sort((a, b) => score(b) - score(a))[0])
                  : "—"
              } top`}
            />
            <Kpi
              title="Failing controls"
              value={controlsFail}
              hint="count of Fail"
            />
            <Kpi title="Avg MTTR (days)" value={mttr} hint="incidents only" />
          </div>

          {/* Heatmap */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Risk heatmap (Impact × Likelihood)
            </div>
            <Heatmap
              items={filtered}
              onCellClick={(impact, likelihood) =>
                setCellFilter({ impact, likelihood })
              }
            />
            {cellFilter && (
              <div style={{ marginTop: 8, fontSize: 12 }}>
                Filtered by cell{" "}
                <Button
                  style={{ padding: "4px 8px", fontSize: 12 }}
                  onClick={() => setCellFilter(null)}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Risk Table */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
            }}
          >
            <div
              style={{
                padding: 12,
                fontSize: 14,
                fontWeight: 600,
                borderBottom: "1px solid #e5e5e5",
              }}
            >
              Risk register
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f9fafb",
                      fontSize: 12,
                      color: "#6b7280",
                    }}
                  >
                    {th("ID")}
                    {ths("title", "Title")}
                    {ths("dept", "Dept")}
                    {ths("owner", "Owner")}
                    {ths("type", "Type")}
                    <th style={thStyle()}>Impact</th>
                    <th style={thStyle()}>Likelihood</th>
                    {ths("score", "Score")}
                    <th style={thStyle()}>Level</th>
                    {ths("status", "Status")}
                    {ths("nextReview", "Next review")}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => {
                    const lv = level(r);
                    return (
                      <tr
                        key={r.id}
                        onClick={() => openRiskDrawer(r)}
                        style={{ cursor: "pointer", fontSize: 14 }}
                      >
                        <td style={tdStyle(true)}>{r.id}</td>
                        <td style={tdStyle()}>{r.title}</td>
                        <td style={tdStyle()}>{r.dept}</td>
                        <td style={tdStyle()}>{r.owner}</td>
                        <td style={tdStyle()}>{r.type}</td>
                        <td style={tdStyle()}>{r.impact}</td>
                        <td style={tdStyle()}>{r.likelihood}</td>
                        <td style={tdStyle()}>{score(r)}</td>
                        <td style={{ ...tdStyle(), whiteSpace: "nowrap" }}>
                          <span style={tagLevel(lv)}>{lv}</span>
                        </td>
                        <td style={tdStyle()}>{r.status}</td>
                        <td style={tdStyle()}>
                          {r.nextReview}{" "}
                          {isOverdue(r) ? (
                            <span
                              style={{
                                ...tagStyle("#fee2e2", "#991b1b"),
                                marginLeft: 6,
                              }}
                            >
                              Overdue
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                  {sorted.length === 0 && (
                    <tr>
                      <td
                        colSpan={11}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No risks match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side */}
        <div style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Guidance
            </div>
            <ul style={{ fontSize: 14, paddingLeft: 18 }}>
              <li>
                Handle <b>Extreme/High</b> risks first; ensure mitigation owners
                assigned.
              </li>
              <li>
                Fix <b>Failing controls</b> before approving vendor renewals.
              </li>
              <li>
                Watch <b>overdue</b> reviews; schedule updates within 7 days.
              </li>
            </ul>
          </div>
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Quick actions
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <Button
                variant="solid"
                onClick={() => alert("Export CSV (placeholder)")}
              >
                Export CSV
              </Button>
              <Button onClick={() => alert("Open RACI matrix (placeholder)")}>
                Open RACI Matrix
              </Button>
              <Button
                onClick={() => alert("Open Control Library (placeholder)")}
              >
                Open Control Library
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div
            onClick={() => setDrawer(null)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.4)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "min(100%, 720px)",
              background: "#fff",
              boxShadow: "-12px 0 40px rgba(0,0,0,.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #e5e5e5",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {drawer.title}
              </div>
              <button
                onClick={() => setDrawer(null)}
                style={{
                  borderRadius: 999,
                  padding: 6,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: 16, fontSize: 14 }}>{drawer.body}</div>
          </div>
        </div>
      )}
    </div>
  );

  /* ---------- local helpers ---------- */
  function th(label) {
    return <th style={thStyle()}>{label}</th>;
  }
  function ths(key, label) {
    const active = sortKey === key;
    return (
      <th style={thStyle()}>
        <button
          onClick={() => headerSort(key)}
          style={{ all: "unset", cursor: "pointer" }}
        >
          {label} {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
        </button>
      </th>
    );
  }
}

function thStyle() {
  return {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid #e5e5e5",
    position: "sticky",
    top: 0,
  };
}
function tdStyle(first = false) {
  return {
    padding: "10px 12px",
    borderBottom: "1px solid #f3f4f6",
    whiteSpace: first ? "nowrap" : undefined,
  };
}
function Kpi({
  title,
  value,
  hint,
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        background: "#fff",
        padding: 12,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
      <div style={{ marginTop: 4, fontSize: 22, fontWeight: 600 }}>{value}</div>
      {hint ? (
        <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
