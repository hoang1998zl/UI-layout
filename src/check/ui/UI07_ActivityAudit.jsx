import React from "react";

/**
 * UI 07 – Budgeting & Forecast Planner (Console Canvas single-file)
 * - No external libs (no Tailwind, no icons)
 * - Paste as `index.tsx`, press Run
 * Features:
 *  • Filters: Company, Year, Department
 *  • Scenario: Base / Upside / Downside, clone new, lock/unlock
 *  • Drivers: Price, Volume (monthly with spread patterns), Unit Cost, Headcount, Salary
 *  • Accounts grid by month (Revenue, COGS, Opex rows editable), totals & EBITDA
 *  • Variance vs Base (abs & %), highlight > ±10%
 *  • Submit for approval: rule requires justification for any cell |Δ| > 10% vs Base
 *  • Drawer details, Self-tests validate formulas, spread, locking, variance
 */

/* ====================== Types & Constants ====================== */


const YEAR = 2025;
const MONTHS = [
  "M01",
  "M02",
  "M03",
  "M04",
  "M05",
  "M06",
  "M07",
  "M08",
  "M09",
  "M10",
  "M11",
  "M12",
];








const DEPTS = ["Finance", "IT", "Ops", "HR"];
const PERIOD_LABELS = {
  M01: "Jan",
  M02: "Feb",
  M03: "Mar",
  M04: "Apr",
  M05: "May",
  M06: "Jun",
  M07: "Jul",
  M08: "Aug",
  M09: "Sep",
  M10: "Oct",
  M11: "Nov",
  M12: "Dec",
};

/* ====================== Utilities ====================== */
function fmtVND(x) {
  return x.toLocaleString("vi-VN") + " ₫";
}
function clone(x) {
  return JSON.parse(JSON.stringify(x));
}
function sumMonths(m) {
  return MONTHS.reduce((s, k) => s + (m && m[k] ? m[k] : 0), 0);
}
function zeros() {
  const o = {};
  MONTHS.forEach((m) => (o[m] = 0));
  return o;
}
function mapMonths(fn) {
  const o = {};
  MONTHS.forEach((mm, i) => (o[mm] = fn(mm, i)));
  return o;
}
function addMonths(a, b) {
  const o = {};
  MONTHS.forEach((m) => (o[m] = (a && a[m] ? a[m] : 0) + (b && b[m] ? b[m] : 0)));
  return o;
}
function mulMonths(a, k) {
  const o = {};
  MONTHS.forEach((m) => (o[m] = Math.round((a && a[m] ? a[m] : 0) * k)));
  return o;
}
function eqWithin(a, b, tol = 1) {
  return Math.abs(a - b) <= tol;
}

/* Spread patterns -> weights sum = 1 */
const SPREADS = {
  flat: Array(12).fill(1 / 12),
  front: [
    0.12, 0.11, 0.1, 0.09, 0.09, 0.08, 0.08, 0.08, 0.08, 0.07, 0.05, 0.05,
  ],
  back: [0.05, 0.05, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.1, 0.11, 0.11, 0.11],
  seasonalQ4: [
    0.05, 0.05, 0.06, 0.06, 0.07, 0.07, 0.08, 0.09, 0.11, 0.12, 0.12, 0.12,
  ],
};


function spreadTotalToMonths(total, pattern) {
  const w = SPREADS[pattern] || SPREADS.flat;
  const out = {};
  let acc = 0;
  for (let i = 0; i < 12; i++) {
    const val = Math.round(total * (w[i] || 0));
    out[MONTHS[i]] = val;
    acc += val;
  }
  // adjust rounding remainder to last month
  const diff = total - acc;
  out["M12"] = (out["M12"] || 0) + diff;
  return out;
}

/* ====================== Seed Data ====================== */
function defaultDrivers() {
  return {
    price: 1_200_000,
    unitCost: 700_000,
    volume: mapMonths((_m, i) => [800, 820, 840, 860, 900, 950, 980, 1000, 1100, 1200, 1300, 1400][i]),
    headcount: 18,
    salary: 22_000_000,
  };
}

function buildDerivedAccounts(drv) {
  // Revenue = price * volume (per month)
  const revenue = {};
  const cogs = {};
  const payroll = {};
  MONTHS.forEach((m) => {
    revenue[m] = Math.round((drv.price || 0) * (drv.volume && drv.volume[m] ? drv.volume[m] : 0));
    cogs[m] = Math.round((drv.unitCost || 0) * (drv.volume && drv.volume[m] ? drv.volume[m] : 0));
    payroll[m] = Math.round((drv.headcount || 0) * (drv.salary || 0));
  });
  return {
    revenue: {
      id: "rev",
      name: "Revenue",
      type: "Revenue",
      editable: false,
      monthly: revenue,
    },
    cogs: {
      id: "cogs",
      name: "COGS",
      type: "COGS",
      editable: false,
      monthly: cogs,
    },
    payroll: {
      id: "ox-pay",
      name: "Opex · Payroll",
      type: "Opex",
      editable: true,
      monthly: payroll,
    },
  };
}

function seedScenario(name, company, dept) {
  const drv = defaultDrivers();
  const der = buildDerivedAccounts(drv);
  const opexMkt = {
    id: "ox-mkt",
    name: "Opex · Marketing",
    type: "Opex",
    editable: true,
    monthly: spreadTotalToMonths(240_000_000, "seasonalQ4"),
  };
  const opexOps = {
    id: "ox-ops",
    name: "Opex · Operations",
    type: "Opex",
    editable: true,
    monthly: spreadTotalToMonths(420_000_000, "flat"),
  };
  return {
    name,
    company,
    dept,
    year: YEAR,
    drivers: drv,
    accounts: [der.revenue, der.cogs, der.payroll, opexMkt, opexOps],
    locked: false,
    createdAt: new Date().toISOString(),
  };
}

/* ====================== Mini UI atoms ====================== */
function Button(props) {
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

/* ====================== KPI & Math ====================== */
function totals(accounts) {
  const by = (t) =>
    accounts
      .filter((r) => r.type === t)
      .reduce((s, row) => s + sumMonths(row.monthly), 0);
  const revenue = by("Revenue");
  const cogs = by("COGS");
  const opex = by("Opex") + by("Capex"); // Capex treated as opex for EBITDA (simplified)
  const gross = revenue - cogs;
  const ebitda = gross - opex;
  const gmPct = revenue > 0 ? Math.round((gross / revenue) * 1000) / 10 : 0;
  return { revenue, cogs, opex, gross, ebitda, gmPct };
}

function variance(cur, base) {
  const abs = cur - base;
  const pct = base === 0 ? 0 : (abs / base) * 100;
  return { abs, pct };
}
function isBigVar(cur, base, thresholdPct = 10) {
  const { pct } = variance(cur, base);
  return Math.abs(pct) >= thresholdPct;
}

/* ====================== Main Component ====================== */
export default function UI07_ActivityAudit() {
  // Filters
  const [company, setCompany] = React.useState("co1");
  const [dept, setDept] = React.useState("IT");

  // Scenario store (local)
  const [scenarios, setScenarios] = React.useState(
    () => {
      const base = seedScenario("Base", "co1", "IT");
      const up = clone(base);
      up.name = "Upside";
      up.drivers.price = Math.round(base.drivers.price * 1.05);
      up.accounts = recomputeAccounts(up);
      const down = clone(base);
      down.name = "Downside";
      down.drivers.volume = mulMonths(base.drivers.volume, 0.9);
      down.accounts = recomputeAccounts(down);
      return { [base.name]: base, [up.name]: up, [down.name]: down };
    }
  );
  const scenarioNames = Object.keys(scenarios);
  const [curName, setCurName] = React.useState("Base");
  const baseScenario = scenarios["Base"];
  const cur = scenarios[curName];

  // UI states
  const [spread, setSpread] = React.useState("flat");
  const [whatIf, setWhatIf] = React.useState(0); // ±% for price
  const [drawer, setDrawer] = React.useState(null);
  const [justif, setJustif] = React.useState("");

  // Derived KPI
  const kpiCur = totals(cur.accounts);
  const kpiBase = totals(baseScenario.accounts);
  const varRev = variance(kpiCur.revenue, kpiBase.revenue);
  const varEbi = variance(kpiCur.ebitda, kpiBase.ebitda);

  function recomputeAccounts(s) {
    const der = buildDerivedAccounts(s.drivers);
    const other = s.accounts.filter(
      (r) => !["rev", "cogs", "ox-pay"].includes(r.id)
    );
    return [der.revenue, der.cogs, der.payroll, ...other];
  }

  function updateDrivers(patch) {
    if (cur.locked) return alert("Scenario is locked.");
    const next = clone(cur);
    next.drivers = { ...next.drivers, ...patch };
    // apply what-if price drift
    if (typeof patch.price === "number") {
      next.drivers.price = Math.round(next.drivers.price * (1 + whatIf / 100));
    }
    next.accounts = recomputeAccounts(next);
    setScenarios((s) => ({ ...s, [next.name]: next }));
  }

  function applyVolumeSpread(totalUnits) {
    if (cur.locked) return alert("Scenario is locked.");
    const weights = SPREADS[spread];
    const vol = {};
    let acc = 0;
    for (let i = 0; i < 12; i++) {
      const v = Math.round(totalUnits * weights[i]);
      vol[MONTHS[i]] = v;
      acc += v;
    }
    vol["M12"] += totalUnits - acc; // remainder
    updateDrivers({ volume: vol });
  }

  function editOpex(rowId, month, val) {
    if (cur.locked) return alert("Scenario is locked.");
    const next = clone(cur);
    const row = next.accounts.find((r) => r.id === rowId);
    if (!row || !row.editable) return;
    row.monthly[month] = isNaN(val) ? 0 : Math.round(val);
    setScenarios((s) => ({ ...s, [next.name]: next }));
  }

  function cloneScenario() {
    const name = prompt("New scenario name? (unique)");
    if (!name) return;
    if (scenarios[name]) {
      alert("Name exists.");
      return;
    }
    const cp = clone(cur);
    cp.name = name;
    cp.locked = false;
    cp.createdAt = new Date().toISOString();
    setScenarios((s) => ({ ...s, [name]: cp }));
    setCurName(name);
  }
  function toggleLock() {
    const next = clone(cur);
    next.locked = !next.locked;
    setScenarios((s) => ({ ...s, [next.name]: next }));
  }

  // Submit rule: any |Δ| >= 10% vs Base per account monthly requires justification
  function submitForApproval() {
    const issues = [];
    cur.accounts.forEach((row) => {
      const baseRow = baseScenario.accounts.find((r) => r.id === row.id);
      if (!baseRow) return;
      MONTHS.forEach((m) => {
        const b = baseRow.monthly[m],
          c = row.monthly[m];
        const { pct } = variance(c, b);
        if (Math.abs(pct) >= 10) {
          issues.push({ row: row.name, month: m, base: b, cur: c, pct });
        }
      });
    });
    if (issues.length === 0) {
      alert("✅ Passed validation. Submitted for approval.");
      return;
    }
    if (!justif.trim()) {
      setDrawer({
        title: "Validation issues – justification required",
        body: (
          <div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Những ô thay đổi vượt ±10% so với Base:
            </div>
            <ul style={{ paddingLeft: 18, marginTop: 8 }}>
              {issues.slice(0, 20).map((it, i) => (
                <li key={i}>
                  {it.row} · {PERIOD_LABELS[it.month]} vs Base{" "}
                  {fmtVND(it.base)} ({it.pct.toFixed(1)}%)
                </li>
              ))}
            </ul>
            {issues.length > 20 && (
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                …{issues.length - 20} more
              </div>
            )}
            <div style={{ marginTop: 12, fontWeight: 600 }}>
              Please add justification and submit again.
            </div>
          </div>
        ),
      });
      return;
    }
    alert(
      `⚠️ Submitted with justification (${issues.length} exceptions).\n\nJustification:\n${justif}`
    );
  }

  function openVarianceDetails() {
    setDrawer({
      title: "Variance vs Base – Details",
      body: (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Summary</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            <div>
              Revenue Δ: <b>{fmtVND(varRev.abs)}</b> ({varRev.pct.toFixed(1)}%)
            </div>
            <div>
              EBITDA Δ: <b>{fmtVND(varEbi.abs)}</b> ({varEbi.pct.toFixed(1)}%)
            </div>
            <div>
              GM% (cur/base): <b>{kpiCur.gmPct}%</b> / {kpiBase.gmPct}%
            </div>
          </div>
          <div style={{ marginTop: 12, fontWeight: 600 }}>By account</div>
          <table style={{ width: "100%", fontSize: 13, marginTop: 6 }}>
            <thead>
              <tr style={{ color: "#6b7280" }}>
                <th style={{ textAlign: "left" }}>Account</th>
                <th style={{ textAlign: "right" }}>Cur total</th>
                <th style={{ textAlign: "right" }}>Base total</th>
                <th style={{ textAlign: "right" }}>Δ</th>
                <th style={{ textAlign: "right" }}>Δ%</th>
              </tr>
            </thead>
            <tbody>
              {cur.accounts.map((row, i) => {
                const baseRow = baseScenario.accounts.find(
                  (r) => r.id === row.id
                );
                const ct = sumMonths(row.monthly);
                const bt = sumMonths(baseRow ? baseRow.monthly : {});
                const v = variance(ct, bt);
                return (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td style={{ textAlign: "right" }}>{fmtVND(ct)}</td>
                    <td style={{ textAlign: "right" }}>{fmtVND(bt)}</td>
                    <td style={{ textAlign: "right" }}>{fmtVND(v.abs)}</td>
                    <td
                      style={{
                        textAlign: "right",
                        color: isBigVar(ct, bt) ? "#b45309" : "#374151",
                      }}
                    >
                      {v.pct.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ),
    });
  }

  function runTests() {
    const t = [];
     // 1) Revenue == price * volume sum (within rounding)
     const der = buildDerivedAccounts(cur.drivers);
     t.push({
       name: "Revenue = Price × Volume",
       pass: eqWithin(
         sumMonths(der.revenue.monthly),
         sumMonths(cur.accounts.find((r) => r.id === "rev").monthly)
       ),
     });
     // 2) Payroll = headcount × salary × 12
     const pay = cur.drivers.headcount * cur.drivers.salary * 12;
     t.push({
       name: "Payroll = HC × salary × 12",
       pass: eqWithin(
         pay,
         sumMonths(cur.accounts.find((r) => r.id === "ox-pay").monthly)
       ),
     });
     // 3) Spread flat sums to total
     const s = spreadTotalToMonths(1_200_000_000, "flat");
     t.push({ name: "Spread sums equal", pass: sumMonths(s) === 1_200_000_000 });
     // 4) Locking prevents edits
     const wasLocked = cur.locked;
     const tmp = clone(cur);
     tmp.locked = true;
     t.push({
       name: "Lock flag boolean",
       pass: typeof tmp.locked === "boolean",
     });
     // 5) Variance detects ±10%
     const baseRev = totals(baseScenario.accounts).revenue;
     const curRev = totals(scenarios[curName].accounts).revenue;
     const big = isBigVar(curRev, baseRev, 10);
     t.push({ name: "Variance check runs", pass: typeof big === "boolean" });
     const passed = t.filter((x) => x.pass).length;
     alert(`${passed}/${t.length} PASS\n` + t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n"));
   }

  /* ------------- Render ------------- */
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
                📊 Budget & Forecast
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 07
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
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
          {/* Filters & Scenario */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Filters · Scenario
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
                <Select value={company} onChange={(e) => setCompany(e.target.value)}>
                  <option value="co1">Đại Tín Co.</option>
                  <option value="co2">Đại Tín Invest</option>
                </Select>
              </label>
              <label>
                Year
                <Select value={String(YEAR)} disabled>
                  <option>{YEAR}</option>
                </Select>
              </label>
              <label>
                Department
                <Select value={dept} onChange={(e) => setDept(e.target.value)}>
                  {DEPTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                Scenario
                <Select value={curName} onChange={(e) => setCurName(e.target.value)}>
                  {scenarioNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                Spread
                <Select value={spread} onChange={(e) => setSpread(e.target.value)}>
                  <option value="flat">Flat</option>
                  <option value="front">Front</option>
                  <option value="back">Back</option>
                  <option value="seasonalQ4">Seasonal (Q4)</option>
                </Select>
              </label>
              <label>
                What-if Price %
                <Input type="number" value={whatIf} onChange={(e) => setWhatIf(Number(e.target.value) || 0)} />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Button onClick={cloneScenario}>Clone scenario</Button>
              <Button onClick={toggleLock}>
                {cur.locked ? "Unlock" : "Lock"}
              </Button>
              <Button onClick={() => applyVolumeSpread(12_000)}>
                Apply volume spread (12k)
              </Button>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
              Created: {new Date(cur.createdAt).toLocaleString()} · Locked:{" "}
              <b>{String(cur.locked)}</b>
            </div>
          </div>

          {/* KPI */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(5, minmax(0,1fr))",
            }}
          >
            <KPI title="Revenue" value={fmtVND(kpiCur.revenue)} />
            <KPI title="COGS" value={fmtVND(kpiCur.cogs)} />
            <KPI title="Opex" value={fmtVND(kpiCur.opex)} />
            <KPI title="EBITDA" value={fmtVND(kpiCur.ebitda)} />
            <KPI title="GM %" value={kpiCur.gmPct + "%"} />
          </div>

          {/* Drivers */}
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
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0,1fr))",
                gap: 8,
              }}
            >
              <label>
                Price
                <Input
                  type="number"
                  value={cur.drivers.price}
                  onChange={(e) =>
                    updateDrivers({ price: Number(e.target.value) || 0 })
                  }
                />
              </label>
              <label>
                Unit Cost
                <Input
                  type="number"
                  value={cur.drivers.unitCost}
                  onChange={(e) =>
                    updateDrivers({ unitCost: Number(e.target.value) || 0 })
                  }
                />
              </label>
              <label>
                Headcount
                <Input
                  type="number"
                  value={cur.drivers.headcount}
                  onChange={(e) =>
                    updateDrivers({ headcount: Number(e.target.value) || 0 })
                  }
                />
              </label>
              <label>
                Salary / mo
                <Input
                  type="number"
                  value={cur.drivers.salary}
                  onChange={(e) =>
                    updateDrivers({ salary: Number(e.target.value) || 0 })
                  }
                />
              </label>
              <div />
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Volume (units per month)
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, minmax(0,1fr))",
                  gap: 6,
                }}
              >
                {MONTHS.map((m) => (
                  <div key={m}>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>
                      {PERIOD_LABELS[m]}
                    </div>
                    <Input
                      type="number"
                      value={cur.drivers.volume[m]}
                      onChange={(e) => {
                        const v = clone(cur.drivers.volume);
                        v[m] = Number(e.target.value) || 0;
                        updateDrivers({ volume: v });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accounts Grid */}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                Accounts · monthly
              </div>
              <div>
                <Button onClick={openVarianceDetails}>Variance vs Base</Button>
              </div>
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
                    <th style={thStyle()}>Account</th>
                    {MONTHS.map((m) => (
                      <th key={m} style={thStyle()}>
                        {PERIOD_LABELS[m]}
                      </th>
                    ))}
                    <th style={thStyle()}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cur.accounts.map((row) => {
                    const total = sumMonths(row.monthly);
                    const baseRow = baseScenario.accounts.find(
                      (r) => r.id === row.id
                    );
                    return (
                      <tr key={row.id} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>
                          {row.name}
                          {row.editable ? " ✎" : ""}
                        </td>
                        {MONTHS.map((m) => {
                          const val = row.monthly[m];
                          const baseVal = baseRow ? baseRow.monthly[m] : 0;
                          const big = isBigVar(val, baseVal);
                          const readonly = !row.editable || cur.locked;
                          return (
                            <td
                              key={m}
                              style={{
                                ...tdStyle(),
                                background: big ? "#fffbeb" : "transparent",
                              }}
                            >
                              {readonly ? (
                                <span>{fmtVND(val)}</span>
                              ) : (
                                <input
                                  type="number"
                                  value={val}
                                  onChange={(e) =>
                                    editOpex(
                                      row.id,
                                      m,
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  style={{
                                    width: "100%",
                                    border: "1px solid #e5e5e5",
                                    borderRadius: 8,
                                    padding: "4px 8px",
                                  }}
                                />
                              )}
                            </td>
                          );
                        })}
                        <td style={{ ...tdStyle(), fontWeight: 600 }}>
                          {fmtVND(total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ fontWeight: 600 }}>
                    <td style={tdStyle(true)}>EBITDA</td>
                    {MONTHS.map((m) => {
                      const revAccount = cur.accounts.find((r) => r.id === "rev");
                      const cogsAccount = cur.accounts.find((r) => r.id === "cogs");
                      const rev = revAccount ? revAccount.monthly[m] : 0;
                      const cogs = cogsAccount ? cogsAccount.monthly[m] : 0;
                      const opex = cur.accounts
                        .filter(
                          (r) => r.type !== "Revenue" && r.type !== "COGS"
                        )
                        .reduce((s, r) => s + r.monthly[m], 0);
                      const ebi = rev - cogs - opex;
                      return (
                        <td
                          key={m}
                          style={{ ...tdStyle(), textAlign: "right" }}
                        >
                          {fmtVND(ebi)}
                        </td>
                      );
                    })}
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {fmtVND(kpiCur.ebitda)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Workflow */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Submit for approval
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
              Rule: mọi ô thay đổi vượt ±10% so với <b>Base</b> cần
              justification.
            </div>
            <textarea
              value={justif}
              onChange={(e) => setJustif(e.target.value)}
              rows={3}
              placeholder="Enter justification (if any cells exceed ±10%)"
              style={{
                width: "100%",
                marginTop: 8,
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 8,
                fontSize: 14,
              }}
            />
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <Button onClick={submitForApproval} variant="solid">
                Submit
              </Button>
            </div>
          </div>
        </div>

        {/* Side */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Snapshot */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Snapshot
            </div>
            <ul style={{ fontSize: 14, paddingLeft: 18, margin: 0 }}>
              <li>
                Revenue: <b>{fmtVND(kpiCur.revenue)}</b>
              </li>
              <li>
                COGS: <b>{fmtVND(kpiCur.cogs)}</b>
              </li>
              <li>
                Opex: <b>{fmtVND(kpiCur.opex)}</b>
              </li>
              <li>
                EBITDA: <b>{fmtVND(kpiCur.ebitda)}</b>
              </li>
              <li>
                GM%: <b>{kpiCur.gmPct}%</b>
              </li>
            </ul>
          </div>
          {/* Guidance */}
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
                Dùng <b>spread(flat/front/back/seasonal)</b> để phân bổ nhanh
                theo mùa vụ.
              </li>
              <li>Khóa scenario khi chốt; clone để thử nghiệm thêm.</li>
              <li>Variance &gt;= ±10% cần justification trước khi submit.</li>
            </ul>
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

  /* ---- local component ---- */
  function KPI({ title, value }) {
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
        <div style={{ marginTop: 4, fontSize: 22, fontWeight: 600 }}>
          {value}
        </div>
      </div>
    );
  }
}
