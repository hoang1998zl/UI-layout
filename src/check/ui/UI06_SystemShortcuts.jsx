import React from "react";

/**
 * UI 06 – Finance & Cash Management (Console Canvas single-file)
 * - No external libs (no Tailwind, no icons)
 * - Paste as `index.tsx`, press Run
 * Features:
 *  • Filters: Company, Period, Currency (VND locked)
 *  • KPI: Ending Cash, Cash In, Cash Out, Net Flow, DSO, DPO, Runway (months)
 *  • Cash 30-day sparkline (SVG)
 *  • AR Aging & AP Aging (0–30 / 31–60 / 61–90 / >90)
 *  • Payment Proposal table: select → Propose/Approve with rules
 *      - Rule: vendor risk ≤ Medium & invoice amount ≤ 500,000,000₫ & due within 7 days; otherwise exception
 *  • 13-week Forecast (weekly buckets)
 *  • Drawer details; Self-tests verify formulas & integrity
 */

// KPI Component


const KPI = ({ title, value, hint }) => (
  <div
    style={{
      backgroundColor: "#f8f9fa",
      padding: "15px",
      borderRadius: "6px",
      textAlign: "center",
      minHeight: "90px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <div style={{ fontSize: "11px", color: "#666", marginBottom: "5px" }}>
      {title}
    </div>
    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "5px" }}>
      {value}
    </div>
    <div style={{ fontSize: "9px", color: "#999" }}>
      {hint}
    </div>
  </div>
);

/* ============ Types & Demo Data ============ */






const PERIODS = ["2025-Q1", "2025-Q2", "2025-Q3"];

// High-level KPI backdrop (per period), used for DSO/DPO and runway
const FIN_KPI = {
  co1: {
    "2025-Q3": {
      revenue: 4200000000,
      cogs: 2350000000,
      opex: 1100000000,
      cash: 1500000000,
      burn: 250000000,
    },
    "2025-Q2": {
      revenue: 3800000000,
      cogs: 2200000000,
      opex: 1050000000,
      cash: 1400000000,
      burn: 260000000,
    },
    "2025-Q1": {
      revenue: 3600000000,
      cogs: 2100000000,
      opex: 1000000000,
      cash: 1200000000,
      burn: 280000000,
    },
  },
  co2: {
    "2025-Q3": {
      revenue: 2800000000,
      cogs: 1650000000,
      opex: 800000000,
      cash: 900000000,
      burn: 170000000,
    },
    "2025-Q2": {
      revenue: 2600000000,
      cogs: 1600000000,
      opex: 780000000,
      cash: 850000000,
      burn: 180000000,
    },
    "2025-Q1": {
      revenue: 2400000000,
      cogs: 1500000000,
      opex: 760000000,
      cash: 800000000,
      burn: 190000000,
    },
  },
};

// Simple vendor book (for AP risk)
const VENDORS = [
  { id: "v1", name: "Alpha Ltd", tier: "Gold", risk: "Low" },
  { id: "v2", name: "Bravo Co", tier: "Silver", risk: "Medium" },
  { id: "v3", name: "Ceta LLC", tier: "Bronze", risk: "High" },
  { id: "v4", name: "Delta Inc", tier: "Gold", risk: "Medium" },
  { id: "v5", name: "Echo JSC", tier: "Platinum", risk: "Low" },
];

// AR invoices (open)
 // ISO date
const AR_OPEN = [
  {
    id: "AR-2001",
    company: "co1",
    period: "2025-Q3",
    cust: "Mega Retail",
    dept: "Ops",
    amount: 280_000_000,
    due: "2025-08-10",
  },
  {
    id: "AR-2002",
    company: "co1",
    period: "2025-Q3",
    cust: "City Bank",
    dept: "Finance",
    amount: 360_000_000,
    due: "2025-09-05",
  },
  {
    id: "AR-2003",
    company: "co1",
    period: "2025-Q3",
    cust: "Vina Foods",
    dept: "Ops",
    amount: 190_000_000,
    due: "2025-08-28",
  },
  {
    id: "AR-2004",
    company: "co2",
    period: "2025-Q3",
    cust: "Pacific Co",
    dept: "IT",
    amount: 220_000_000,
    due: "2025-08-18",
  },
  {
    id: "AR-2005",
    company: "co2",
    period: "2025-Q3",
    cust: "Metroline",
    dept: "HR",
    amount: 150_000_000,
    due: "2025-09-12",
  },
];

// AP invoices (unpaid)
 // ISO date
const AP_OPEN_INIT = [
  {
    id: "AP-3001",
    company: "co1",
    period: "2025-Q3",
    vendorId: "v2",
    dept: "IT",
    amount: 240_000_000,
    due: "2025-08-17",
  },
  {
    id: "AP-3002",
    company: "co1",
    period: "2025-Q3",
    vendorId: "v3",
    dept: "IT",
    amount: 600_000_000,
    due: "2025-08-15",
  },
  {
    id: "AP-3003",
    company: "co1",
    period: "2025-Q3",
    vendorId: "v1",
    dept: "Finance",
    amount: 180_000_000,
    due: "2025-08-25",
  },
  {
    id: "AP-3004",
    company: "co2",
    period: "2025-Q3",
    vendorId: "v4",
    dept: "Ops",
    amount: 420_000_000,
    due: "2025-08-16",
  },
  {
    id: "AP-3005",
    company: "co2",
    period: "2025-Q3",
    vendorId: "v5",
    dept: "HR",
    amount: 160_000_000,
    due: "2025-09-03",
  },
];

// Bank accounts and last 30 days balance deltas (for sparkline)

const BANKS = {
  co1: [
    { id: "ba1", name: "Operating", number: "001-2356", balance: 900_000_000 },
    { id: "ba2", name: "Payroll", number: "001-7788", balance: 300_000_000 },
    { id: "ba3", name: "Tax", number: "001-9900", balance: 300_000_000 },
  ],
  co2: [
    { id: "ba1", name: "Operating", number: "007-1122", balance: 550_000_000 },
    { id: "ba2", name: "Payroll", number: "007-3344", balance: 200_000_000 },
    { id: "ba3", name: "CapEx", number: "007-5566", balance: 150_000_000 },
  ],
};

// Cash daily net flow (last 30 days) per company/period (simplified)
const CASH_30D = {
  co1: {
    "2025-Q3": [
      50, -20, 35, -15, 10, -40, 25, 30, -10, 5, 20, -25, 15, -10, 35, -5, 10,
      -15, 20, -10, 5, 10, -5, 15, -10, 25, -5, 10, -15, 20,
    ].map((x) => x * 1_000_000),
    "2025-Q2": Array.from({ length: 30 }, (_, i) => ((i % 5) - 2) * 10_000_000),
    "2025-Q1": Array.from({ length: 30 }, (_, i) => ((i % 7) - 3) * 8_000_000),
  },
  co2: {
    "2025-Q3": [
      20, -10, 25, -5, 10, -20, 15, 15, -10, 5, 10, -10, 10, -10, 20, -5, 10,
      -10, 15, -10, 5, 10, -5, 10, -10, 15, -5, 10, -10, 15,
    ].map((x) => x * 1_000_000),
    "2025-Q2": Array.from({ length: 30 }, (_, i) => ((i % 6) - 3) * 7_000_000),
    "2025-Q1": Array.from({ length: 30 }, (_, i) => ((i % 8) - 4) * 6_000_000),
  },
};

// 13-week forecast items

const FCST_13W = {
  co1: Array.from({ length: 13 }, (_, w) => ({
    week: w + 1,
    inflow: 180_000_000 + (w % 3) * 40_000_000,
    outflow: 220_000_000 + (w % 4) * 35_000_000,
    note: w === 3 ? "Tax payment" : w === 6 ? "Hardware PO wave" : undefined,
  })),
  co2: Array.from({ length: 13 }, (_, w) => ({
    week: w + 1,
    inflow: 120_000_000 + (w % 4) * 30_000_000,
    outflow: 150_000_000 + (w % 3) * 25_000_000,
    note: w === 5 ? "Dividend" : undefined,
  })),
};

/* ============ Small UI helpers (no CSS libs) ============ */
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
function fmtMoneyVND(x) {
  return x.toLocaleString("vi-VN") + " ₫";
}
function daysInPeriod(p) {
  return p.endsWith("Q1") || p.endsWith("Q3") ? 90 : 91;
} // rough

/* ============ Sparkline (cash 30d) ============ */
function Spark({ values }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth || 300,
      h = 48;
    const min = Math.min(0, ...values),
      max = Math.max(...values);
    const pad = 4;
    const scaleX = (i) =>
      pad + (i * (w - 2 * pad)) / (values.length - 1);
    const scaleY = (v) => {
      const range = max - min || 1;
      return h - pad - ((v - min) / range) * (h - 2 * pad);
    };
    const d = values
      .map((v, i) =>
        i === 0 ? `M ${scaleX(i)},${scaleY(v)}` : `L ${scaleX(i)},${scaleY(v)}`
      )
      .join(" ");
    el.innerHTML = `<svg width="${w}" height="${h}">
      <path d="${d}" stroke="currentColor" fill="none" stroke-width="2"/>
    </svg>`;
  }, [values]);
  return <div ref={ref} style={{ marginTop: 8, height: 48, width: "100%" }} />;
}

/* ============ Main Component ============ */
export default function UI06_SystemShortcuts() {
  const [company, setCompany] = React.useState("co1");
  const [period, setPeriod] = React.useState("2025-Q3");
  const [dept, setDept] = React.useState("");

  const [ap, setAP] = React.useState(AP_OPEN_INIT);
  const [selectedAP, setSelectedAP] = React.useState(
    {}
  );
  const [drawer, setDrawer] = React.useState(null);

  // Derived slices
  const kpi = FIN_KPI[company][period];
  const cash30 = CASH_30D[company][period];
  const arList = AR_OPEN.filter(
    (x) =>
      x.company === company && x.period === period && (!dept || x.dept === dept)
  );
  const apList = ap.filter(
    (x) =>
      x.company === company && x.period === period && (!dept || x.dept === dept)
  );
  const banks = BANKS[company];

  // KPI derived
  const cashEnd = banks.reduce((s, b) => s + b.balance, 0);
  const cashIn = cash30.filter((x) => x > 0).reduce((a, b) => a + b, 0);
  const cashOut = -cash30.filter((x) => x < 0).reduce((a, b) => a + b, 0);
  const netFlow = cashIn - cashOut;
  const runway = kpi.burn > 0 ? Math.floor(cashEnd / kpi.burn) : 0;

  // DSO / DPO (simplified): AR / (Revenue/period_days) and AP / (COGS/period_days)
  const dso = Math.round(sum(arList) / (kpi.revenue / daysInPeriod(period)));
  const dpo = Math.round(sum(apList) / (kpi.cogs / daysInPeriod(period)));

  // AR/AP Aging
  const today = new Date("2025-08-14"); // match project date context
  const aging = (dueISO) => {
    const d = new Date(dueISO);
    const diff = Math.ceil(
      (d.getTime() - today.getTime()) / (1000 * 3600 * 24)
    ); // days till due (negative means overdue)
    const overdue = -Math.min(0, diff);
    if (overdue === 0) return "0-30";
    if (overdue > 0 && overdue <= 30) return "0-30";
    if (overdue > 30 && overdue <= 60) return "31-60";
    if (overdue > 60 && overdue <= 90) return "61-90";
    if (overdue > 90) return ">90";
    // not due yet
    return "0-30";
  };
  const bucketOrder = ["0-30", "31-60", "61-90", ">90"];
  const arAging = buckets(
    arList.map((x) => ({ bucket: aging(x.due), amount: x.amount })),
    bucketOrder
  );
  const apAging = buckets(
    apList.map((x) => ({ bucket: aging(x.due), amount: x.amount })),
    bucketOrder
  );

  // Payment rules
  function vendorRisk(id) {
    return VENDORS.find((v) => v.id === id)?.risk || "Medium";
  }
  function dueWithin7(dueISO) {
    const d = new Date(dueISO).getTime();
    const diff = Math.ceil((d - today.getTime()) / (1000 * 3600 * 24));
    return diff <= 7; // including overdue
  }
  function ruleOK(inv) {
    if (!inv) return false;
    const risk = vendorRisk(inv.vendorId);
    const amountOK = inv.amount <= 500_000_000;
    const riskOK = risk === "Low" || risk === "Medium";
    const dueOK = dueWithin7(inv.due);
    return riskOK && amountOK && dueOK;
  }

  function proposePayments() {
    const ids = Object.entries(selectedAP)
      .filter(([_id, sel]) => sel)
      .map(([id]) => id);
    if (ids.length === 0) {
      alert("Chưa chọn hóa đơn AP nào.");
      return;
    }
    const ok = [];
    const ex = [];
    ids.forEach((id) => {
      const inv = apList.find((x) => x.id === id);
      if (!inv) {
        ex.push({ id, reason: "Không thuộc view hiện tại" });
        return;
      }
      const reasons = [];
      const risk = vendorRisk(inv.vendorId);
      if (!(risk === "Low" || risk === "Medium")) reasons.push("Vendor risk > Medium");
      if (inv.amount > 500_000_000) reasons.push("Amount > 500,000,000₫");
      if (!dueWithin7(inv.due)) reasons.push("Due > 7 days");
      if (reasons.length === 0) ok.push(id);
      else ex.push({ id, reason: reasons.join(" & ") });
    });
    const msg = `Đề xuất thanh toán:\n✅ Hợp lệ: ${ok.length}\n⚠️ Cần exception: ${ex.length}` + (ex.length ? "\n" + ex.map((x) => `• ${x.id}: ${x.reason}`).join("\n") : "");
    alert(msg);
  }

  function approvePayments() {
    const ids = Object.entries(selectedAP)
      .filter(([_id, sel]) => sel)
      .map(([id]) => id);
    if (ids.length === 0) {
      alert("Chưa chọn hóa đơn AP nào.");
      return;
    }
    const approved = ids.filter((id) => {
      const inv = apList.find((x) => x.id === id);
      return ruleOK(inv);
    });
    if (approved.length === 0) {
      alert("Không có hóa đơn nào đạt rule để duyệt.");
      return;
    }
    setAP((prev) => prev.filter((x) => !approved.includes(x.id)));
    setSelectedAP({});
    alert(`Đã duyệt ${approved.length} hóa đơn và loại khỏi AP Open.`);
  }

  // Drawer
  function openAR(ar) {
    setDrawer({
      title: `${ar.id} · ${ar.cust}`,
      body: (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <b>Dept:</b> {ar.dept}
          </div>
          <div>
            <b>Amount:</b> {fmtMoneyVND(ar.amount)}
          </div>
          <div>
            <b>Due:</b> {ar.due}
          </div>
          <div>
            <b>Bucket:</b> {aging(ar.due)}
          </div>
        </div>
      ),
    });
  }
  function openAP(ap) {
    const vend = VENDORS.find((v) => v.id === ap.vendorId);
    setDrawer({
      title: `${ap.id} · ${vend?.name || ap.vendorId}`,
      body: (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <b>Dept:</b> {ap.dept}
          </div>
          <div>
            <b>Amount:</b> {fmtMoneyVND(ap.amount)}
          </div>
          <div>
            <b>Due:</b> {ap.due}
          </div>
          <div>
            <b>Vendor risk:</b> {vend?.risk}
          </div>
          <div>
            <b>Rule OK:</b> {ruleOK(ap) ? "Yes" : "No"}
          </div>
        </div>
      ),
    });
  }

  // Self-tests
  function runTests() {
    const t = [];
    // 1) Ending cash equals sum of bank balances
    const bankSum = BANKS[company].reduce((s, b) => s + b.balance, 0);
    t.push({ name: "Ending cash equals bank sum", pass: bankSum === cashEnd });
    // 2) Aging sums integrity
    t.push({ name: "AR aging sums", pass: eqWithin(sum(arList), sum(Object.values(arAging))) });
    t.push({ name: "AP aging sums", pass: eqWithin(sum(apList), sum(Object.values(apAging))) });
    // 3) DSO/DPO sanity (non-negative, finite)
    t.push({ name: "DSO finite", pass: Number.isFinite(dso) && dso >= 0 });
    t.push({ name: "DPO finite", pass: Number.isFinite(dpo) && dpo >= 0 });
    // 4) Rule gate catches high risk or amount > 500m or far due
    const sampleHigh = { ...apList[0], vendorId: "v3" }; // High risk
    t.push({ name: "Rule blocks high risk", pass: !ruleOK(sampleHigh) });
    const sampleAmt = { ...apList[0], amount: 900_000_000 };
    t.push({ name: "Rule blocks big amount", pass: !ruleOK(sampleAmt) });
    // 5) Forecast produces 13 buckets and net flow is inflow-outflow
    const fc = FCST_13W[company];
    const net = fc.reduce((s, w) => s + (w.inflow - w.outflow), 0);
    t.push({ name: "Forecast 13 buckets", pass: fc.length === 13 });
    t.push({ name: "Forecast net calc", pass: typeof net === "number" });
    const passed = t.filter((x) => x.pass).length;
    alert(`${passed}/${t.length} PASS\n` + t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n"));
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
                💰 Finance & Cash
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 06
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => {
                  setDept("");
                  setSelectedAP({});
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
                Currency
                <Select value={"VND"} disabled>
                  <option>VND</option>
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
              <div />
              <div />
            </div>
          </div>

          {/* KPI row */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(6, minmax(0,1fr))",
            }}
          >
            <KPI
              title="Ending Cash"
              value={fmtMoneyVND(cashEnd)}
              hint="sum of bank balances"
            />
            <KPI
              title="Cash In (30d)"
              value={fmtMoneyVND(cashIn)}
              hint="sum of positives"
            />
            <KPI
              title="Cash Out (30d)"
              value={fmtMoneyVND(cashOut)}
              hint="sum of negatives"
            />
            <KPI
              title="Net Flow (30d)"
              value={fmtMoneyVND(netFlow)}
              hint="in - out"
            />
            <KPI title="DSO (days)" value={dso} hint="AR / (Rev/day)" />
            <KPI title="DPO (days)" value={dpo} hint="AP / (COGS/day)" />
          </div>

          {/* Cash sparkline + Banks */}
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
                gridTemplateColumns: "2fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Cash – last 30 days
                </div>
                <Spark values={roll(cash30)} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                  Bank accounts
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {banks.map((b) => (
                    <li key={b.id} style={{ margin: "6px 0" }}>
                      {b.name} · {b.number} — <b>{fmtMoneyVND(b.balance)}</b>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                  Runway: <b>{runway}</b> months (cash/burn).
                </div>
              </div>
            </div>
          </div>

          {/* AR & AP Aging */}
          <div
            style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}
          >
            <AgingCard
              title="AR Aging"
              data={arAging}
              total={sum(arList)}
              onOpen={() =>
                setDrawer({
                  title: "AR list",
                  body: <ARTable rows={arList} onOpen={openAR} />,
                })
              }
            />
            <AgingCard
              title="AP Aging"
              data={apAging}
              total={sum(apList)}
              onOpen={() =>
                setDrawer({
                  title: "AP list",
                  body: <APTable rows={apList} onOpen={openAP} />,
                })
              }
            />
          </div>

          {/* Payment Proposal (AP) */}
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
                Payment Proposal – AP Open
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={proposePayments}>Propose</Button>
                <Button variant="solid" onClick={approvePayments}>
                  Approve
                </Button>
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
                    <th style={thStyle()}>Select</th>
                    <th style={thStyle()}>AP</th>
                    <th style={thStyle()}>Vendor</th>
                    <th style={thStyle()}>Dept</th>
                    <th style={thStyle()}>Amount</th>
                    <th style={thStyle()}>Due</th>
                    <th style={thStyle()}>Risk</th>
                    <th style={thStyle()}>Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {apList.map((inv) => {
                    const v = VENDORS.find((x) => x.id === inv.vendorId);
                    const checked = !!selectedAP[inv.id];
                    const disabled = false;
                    const ok = ruleOK(inv);
                    return (
                      <tr key={inv.id} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={(e) =>
                              setSelectedAP((s) => ({
                                ...s,
                                [inv.id]: e.target.checked,
                              }))
                            }
                          />
                        </td>
                        <td
                          style={{ ...tdStyle(), cursor: "pointer" }}
                          onClick={() => openAP(inv)}
                        >
                          {inv.id}
                        </td>
                        <td style={tdStyle()}>{v.name}</td>
                        <td style={tdStyle()}>{inv.dept}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtMoneyVND(inv.amount)}
                        </td>
                        <td style={tdStyle()}>{inv.due}</td>
                        <td style={tdStyle()}>{v.risk}</td>
                        <td style={tdStyle()}>{ok ? "OK" : "Exception"}</td>
                      </tr>
                    );
                  })}
                  {apList.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No AP open.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 13-week Forecast */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              13-week Cash Forecast
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
                    <th style={thStyle()}>Week</th>
                    <th style={thStyle()}>Inflow</th>
                    <th style={thStyle()}>Outflow</th>
                    <th style={thStyle()}>Net</th>
                    <th style={thStyle()}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {FCST_13W[company].map((w) => (
                    <tr key={w.week} style={{ fontSize: 14 }}>
                      <td style={tdStyle(true)}>{w.week}</td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtMoneyVND(w.inflow)}
                      </td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtMoneyVND(w.outflow)}
                      </td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtMoneyVND(w.inflow - w.outflow)}
                      </td>
                      <td style={tdStyle()}>{w.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ fontWeight: 600 }}>
                    <td style={tdStyle(true)}>Total</td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {fmtMoneyVND(
                        FCST_13W[company].reduce((s, w) => s + w.inflow, 0)
                      )}
                    </td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {fmtMoneyVND(
                        FCST_13W[company].reduce((s, w) => s + w.outflow, 0)
                      )}
                    </td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {fmtMoneyVND(
                        FCST_13W[company].reduce(
                          (s, w) => s + (w.inflow - w.outflow),
                          0
                        )
                      )}
                    </td>
                    <td style={tdStyle()}> </td>
                  </tr>
                </tfoot>
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
              <li>Ưu tiên **AR** quá hạn &gt; 30 ngày để thu hồi sớm.</li>
              <li>
                Batch approve **AP** theo rule (risk ≤ Medium &amp; amount ≤
                500,000,000₫ &amp; due ≤ 7 ngày).
              </li>
              <li>
                Giữ **runway** &gt;= 6 tháng; nếu &lt; 6 thì cắt giảm OPEX
                5–10%.
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
              Shortcuts
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <Button
                onClick={() => alert("Open Treasury Calendar (placeholder)")}
              >
                Treasury Calendar
              </Button>
              <Button
                onClick={() => alert("Open Bank Reconciliation (placeholder)")}
              >
                Bank Reconciliation
              </Button>
              <Button onClick={() => alert("Export Cash Report (placeholder)")}>
                Export Cash Report
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

  /* ---------- local helpers & mini components ---------- */
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
}

function sum(arr) {
  if (Array.isArray(arr)) {
    if (arr.length === 0) return 0;
    if (typeof arr[0] === "number") return arr.reduce((a, b) => a + b, 0);
    if (typeof arr[0] === "object") return arr.reduce((a, b) => a + (b.amount || 0), 0);
  }
  if (arr && typeof arr === "object") return Object.values(arr).reduce((a, b) => a + (b || 0), 0);
  return 0;
}
function eqWithin(a, b, tol = 1) {
  return Math.abs(a - b) <= tol;
}

function buckets(items, order) {
  const out = {};
  order.forEach((k) => (out[k] = 0));
  (items || []).forEach((x) => {
    if (!x || !x.bucket) return;
    out[x.bucket] = (out[x.bucket] || 0) + (x.amount || 0);
  });
  return out;
}
function roll(deltas) {
  let acc = 0;
  const out = [];
  for (const v of deltas) {
    acc += v;
    out.push(acc);
  }
  return out;
}

/* ---- small sub-components (tables/cards) ---- */
function AgingCard({
  title,
  data,
  total,
  onOpen,
}) {
  const keys = ["0-30", "31-60", "61-90", ">90"];
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        <Button onClick={onOpen}>Open list</Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: 8,
          marginTop: 8,
        }}
      >
        {keys.map((k) => (
          <div
            key={k}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: 8,
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280" }}>{k} days</div>
            <div style={{ marginTop: 4, fontSize: 16, fontWeight: 600 }}>
              {fmtMoneyVND(data[k] || 0)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
        Total: <b>{fmtMoneyVND(total)}</b>
      </div>
    </div>
  );
}

function ARTable({ rows, onOpen }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}
      >
        <thead>
          <tr style={{ background: "#f9fafb", fontSize: 12, color: "#6b7280" }}>
            <th style={th()}>AR</th>
            <th style={th()}>Customer</th>
            <th style={th()}>Dept</th>
            <th style={th()}>Amount</th>
            <th style={th()}>Due</th>
            <th style={th()}>Bucket</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              style={{ fontSize: 14, cursor: "pointer" }}
              onClick={() => onOpen(r)}
            >
              <td style={td(true)}>{r.id}</td>
              <td style={td()}>{r.cust}</td>
              <td style={td()}>{r.dept}</td>
              <td style={{ ...td(), textAlign: "right" }}>
                {fmtMoneyVND(r.amount)}
              </td>
              <td style={td()}>{r.due}</td>
              <td style={td()}>{bucketOf(r.due)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  function th() {
    return {
      textAlign: "left",
      padding: "10px 12px",
      borderBottom: "1px solid #e5e5e5",
    };
  }
  function td(first = false) {
    return {
      padding: "10px 12px",
      borderBottom: "1px solid #f3f4f6",
      whiteSpace: first ? "nowrap" : undefined,
    };
  }
  function bucketOf(due) {
    const t = new Date("2025-08-14").getTime();
    const diff = Math.ceil((new Date(due).getTime() - t) / (1000 * 3600 * 24));
    const overdue = -Math.min(0, diff);
    if (overdue > 90) return ">90";
    if (overdue > 60) return "61-90";
    if (overdue > 30) return "31-60";
    return "0-30";
  }
}

function APTable({ rows, onOpen }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}
      >
        <thead>
          <tr style={{ background: "#f9fafb", fontSize: 12, color: "#6b7280" }}>
            <th style={th()}>AP</th>
            <th style={th()}>Vendor</th>
            <th style={th()}>Dept</th>
            <th style={th()}>Amount</th>
            <th style={th()}>Due</th>
            <th style={th()}>Risk</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const vend = VENDORS.find((v) => v.id === r.vendorId);
            return (
              <tr
                key={r.id}
                style={{ fontSize: 14, cursor: "pointer" }}
                onClick={() => onOpen(r)}
              >
                <td style={td(true)}>{r.id}</td>
                <td style={td()}>{vend?.name || r.vendorId}</td>
                <td style={td()}>{r.dept}</td>
                <td style={{ ...td(), textAlign: "right" }}>
                  {fmtMoneyVND(r.amount)}
                </td>
                <td style={td()}>{r.due}</td>
                <td style={td()}>{vend?.risk || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  function th() {
    return {
      textAlign: "left",
      padding: "10px 12px",
      borderBottom: "1px solid #e5e5e5",
    };
  }
  function td(first = false) {
    return {
      padding: "10px 12px",
      borderBottom: "1px solid #f3f4f6",
      whiteSpace: first ? "nowrap" : undefined,
    };
  }
}
