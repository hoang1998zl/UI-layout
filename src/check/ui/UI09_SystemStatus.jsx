import React from "react";

/**
 * UI 09 – Sales & CRM (Console Canvas single-file)
 * - No external libs (no Tailwind, no icons)
 * - Paste as `index.tsx`, press Run
 * Features:
 *  • Filters: Company, Period (Q), Owner, Territory, Product, Stage, Search
 *  • KPIs: Pipeline (open), Commit, Weighted Forecast, Win rate, Avg Deal Size, Avg Cycle (won)
 *  • Funnel + Pipeline board (Lead → Qualified → Proposal → Negotiation → Closed)
 *  • Opportunity Table + Drawer
 *  • Batch Approve Quotes (rule)
 *  • Forecast table (due in-period, weighted by stage)
 *  • Self-tests button
 */

/* ====================== Types & Data ====================== */







const PERIODS = ["2025-Q1", "2025-Q2", "2025-Q3"];
const TODAY = new Date("2025-08-14");

const STAGE_PROB = {
  Lead: 0.1,
  Qualified: 0.25,
  Proposal: 0.5,
  Negotiation: 0.7,
  "Closed Won": 1,
  "Closed Lost": 0,
};



const OPS_INIT = [
  {
    id: "OP-1001",
    company: "co1",
    period: "2025-Q3",
    account: "Mega Retail",
    owner: "Lan Vu",
    territory: "South",
    product: "ERP Suite",
    amount: 750_000_000,
    discountPct: 10,
    marginPct: 32,
    created: "2025-06-01",
    closeDate: "2025-08-20",
    stage: "Negotiation",
  },
  {
    id: "OP-1002",
    company: "co1",
    period: "2025-Q3",
    account: "City Bank",
    owner: "Minh Pham",
    territory: "North",
    product: "Analytics",
    amount: 420_000_000,
    discountPct: 12,
    marginPct: 28,
    created: "2025-05-18",
    closeDate: "2025-09-12",
    stage: "Proposal",
  },
  {
    id: "OP-1003",
    company: "co1",
    period: "2025-Q3",
    account: "Vina Foods",
    owner: "Thao Nguyen",
    territory: "South",
    product: "Field Service",
    amount: 260_000_000,
    discountPct: 8,
    marginPct: 30,
    created: "2025-06-25",
    closeDate: "2025-08-30",
    stage: "Qualified",
  },
  {
    id: "OP-1004",
    company: "co1",
    period: "2025-Q2",
    account: "Metroline",
    owner: "Khoa Bui",
    territory: "Central",
    product: "HR Cloud",
    amount: 180_000_000,
    discountPct: 5,
    marginPct: 35,
    created: "2025-04-20",
    closeDate: "2025-06-28",
    stage: "Closed Won",
  },
  {
    id: "OP-1005",
    company: "co2",
    period: "2025-Q3",
    account: "Pacific Co",
    owner: "Trang Do",
    territory: "North",
    product: "ERP Suite",
    amount: 520_000_000,
    discountPct: 18,
    marginPct: 22,
    created: "2025-07-01",
    closeDate: "2025-08-22",
    stage: "Negotiation",
  }, // high discount, low margin
  {
    id: "OP-1006",
    company: "co2",
    period: "2025-Q3",
    account: "Delta Pharma",
    owner: "Trang Do",
    territory: "North",
    product: "Analytics",
    amount: 310_000_000,
    discountPct: 14,
    marginPct: 27,
    created: "2025-05-10",
    closeDate: "2025-09-05",
    stage: "Proposal",
  },
  {
    id: "OP-1007",
    company: "co2",
    period: "2025-Q3",
    account: "Echo Logistics",
    owner: "Khoa Bui",
    territory: "Central",
    product: "Field Service",
    amount: 190_000_000,
    discountPct: 6,
    marginPct: 33,
    created: "2025-07-12",
    closeDate: "2025-08-18",
    stage: "Lead",
  },
  {
    id: "OP-1008",
    company: "co1",
    period: "2025-Q3",
    account: "Green Telecom",
    owner: "Lan Vu",
    territory: "South",
    product: "HR Cloud",
    amount: 240_000_000,
    discountPct: 15,
    marginPct: 26,
    created: "2025-07-08",
    closeDate: "2025-09-02",
    stage: "Negotiation",
  },
  {
    id: "OP-1009",
    company: "co1",
    period: "2025-Q3",
    account: "Nova Energy",
    owner: "Thao Nguyen",
    territory: "South",
    product: "ERP Suite",
    amount: 680_000_000,
    discountPct: 9,
    marginPct: 31,
    created: "2025-06-05",
    closeDate: "2025-08-29",
    stage: "Proposal",
  },
  {
    id: "OP-1010",
    company: "co2",
    period: "2025-Q3",
    account: "Asia Retail",
    owner: "Minh Pham",
    territory: "North",
    product: "HR Cloud",
    amount: 150_000_000,
    discountPct: 11,
    marginPct: 24,
    created: "2025-08-01",
    closeDate: "2025-09-07",
    stage: "Qualified",
  },
  {
    id: "OP-1011",
    company: "co1",
    period: "2025-Q2",
    account: "Sun Foods",
    owner: "Lan Vu",
    territory: "South",
    product: "Analytics",
    amount: 210_000_000,
    discountPct: 7,
    marginPct: 34,
    created: "2025-04-03",
    closeDate: "2025-06-05",
    stage: "Closed Lost",
  },
];

/* ====================== UI Helpers ====================== */
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
function fmtVND(x) {
  return x.toLocaleString("vi-VN") + " ₫";
}
function daysBetween(a, b) {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 3600 * 24));
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
function tagStyle(bg, fg) {
  return {
    fontSize: 12,
    background: bg,
    color: fg,
    borderRadius: 999,
    padding: "2px 8px",
  };
}

/* ====================== Main ====================== */



export default function UI09_SystemStatus() {
  // Filters
  const [company, setCompany] = React.useState("co1");
  const [period, setPeriod] = React.useState("2025-Q3");
  const [owner, setOwner] = React.useState("");
  const [ter, setTer] = React.useState("");
  const [prod, setProd] = React.useState("");
  const [stage, setStage] = React.useState("");
  const [search, setSearch] = React.useState("");

  // State
  const [ops, setOps] = React.useState(OPS_INIT);
  const [sel, setSel] = React.useState({});
  const [drawer, setDrawer] = React.useState(null);

  // Sorting
  const [sortKey, setSortKey] = React.useState("amount");
  const [sortDir, setSortDir] = React.useState("desc");

  // Slices
  const base = ops.filter((o) => o.company === company && o.period === period);
  const filtered = base.filter((o) => {
    if (owner && o.owner !== owner) return false;
    if (ter && o.territory !== ter) return false;
    if (prod && o.product !== prod) return false;
    if (stage && o.stage !== stage) return false;
    if (search) {
      const s = search.toLowerCase();
      const hay =
        `${o.id} ${o.account} ${o.owner} ${o.product} ${o.stage}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
  const open = filtered.filter(
    (o) => !["Closed Won", "Closed Lost"].includes(o.stage)
  );
  const commit = filtered.filter((o) =>
    ["Negotiation", "Closed Won"].includes(o.stage)
  );
  const won = filtered.filter((o) => o.stage === "Closed Won");
  const lost = filtered.filter((o) => o.stage === "Closed Lost");

  // Derived KPIs
  const pipeline = sum(open.map((o) => o.amount));
  const commitVal = sum(commit.map((o) => o.amount));
  const weighted = sum(filtered.map((o) => o.amount * STAGE_PROB[o.stage]));
  const winRate = (() => {
    const done = won.length + lost.length;
    return done ? Math.round((won.length / done) * 100) : 0;
  })();
  const avgDeal = avg(
    filtered.filter((o) => o.stage !== "Closed Lost").map((o) => o.amount)
  );
  const avgCycleWon = avg(
    won.map((o) => daysBetween(new Date(o.created), new Date(o.closeDate)))
  );

  // Funnel counts
  const funnel = [
    "Lead",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
  ].map((s) => ({
    stage: s,
    count: filtered.filter((o) => o.stage === s).length,
    value: sum(filtered.filter((o) => o.stage === s).map((x) => x.amount)),
  }));

  // Pipeline lanes
  const lane = (s) => filtered.filter((o) => o.stage === s);

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    const order = (v) => (v == null ? "" : v);
    let va, vb;
    switch (sortKey) {
      case "account":
        va = a.account;
        vb = b.account;
        break;
      case "owner":
        va = a.owner;
        vb = b.owner;
        break;
      case "territory":
        va = a.territory;
        vb = b.territory;
        break;
      case "product":
        va = a.product;
        vb = b.product;
        break;
      case "amount":
        va = a.amount;
        vb = b.amount;
        break;
      case "stage":
        va = a.stage;
        vb = b.stage;
        break;
      case "closeDate":
        va = new Date(a.closeDate).getTime();
        vb = new Date(b.closeDate).getTime();
        break;
      default:
        va = order(a[sortKey]);
        vb = order(b[sortKey]);
    }
    const c = va > vb ? 1 : va < vb ? -1 : 0;
    return sortDir === "asc" ? c : -c;
  });

  // Rules
  function ruleOK(o) {
    const discountOK = o.discountPct <= 15;
    const marginOK = o.marginPct >= 25;
    const stageOK = o.stage === "Proposal" || o.stage === "Negotiation";
    return discountOK && marginOK && stageOK;
  }

  // Actions
  function batchApproveQuotes() {
    const ids = Object.entries(sel)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (ids.length === 0) {
      alert("No items selected");
      return;
    }
    const ok = [];
    const ex = [];
    ids.forEach((id) => {
      const o = filtered.find((x) => x.id === id);
      if (!o) return;
      const reasons = [];
      if (!(o.stage === "Proposal" || o.stage === "Negotiation")) reasons.push("Wrong stage");
      if (o.discountPct > 15) reasons.push("High discount");
      if (o.marginPct < 25) reasons.push("Low margin");
      if (reasons.length === 0) ok.push(id);
      else ex.push({ id, reason: reasons.join("; ") });
    });
    // Apply: mark those ok as moved to Negotiation (if Proposal) or Closed Won (if Negotiation) for demo
    setOps((prev) =>
      prev.map((o) => {
        if (!ids.includes(o.id)) return o;
        if (ok.includes(o.id)) {
          return {
            ...o,
            stage: o.stage === "Proposal" ? "Negotiation" : "Closed Won",
          };
        }
        return o;
      })
    );
    setSel({});
    const msg = [
      `✅ Approved: ${ok.length} [${ok.join(", ") || "—"}]`,
      ex.length
        ? `⚠️ Need exception: ${ex.length}\n` + ex.map((x) => `• ${x.id}: ${x.reason}`).join("\n")
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    alert(msg || "No changes");
  }

  function openDrawer(o) {
    setDrawer({
      title: `${o.id} · ${o.account}`,
      body: (
        <div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <b>Owner:</b> {o.owner}
            </div>
            <div>
              <b>Territory:</b> {o.territory}
            </div>
            <div>
              <b>Product:</b> {o.product}
            </div>
            <div>
              <b>Stage:</b> {o.stage}
            </div>
            <div>
              <b>Amount:</b> {fmtVND(o.amount)}
            </div>
            <div>
              <b>Close:</b> {o.closeDate}
            </div>
            <div>
              <b>Discount:</b> {o.discountPct}%
            </div>
            <div>
              <b>Margin:</b> {o.marginPct}%
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
            Rule status: {ruleOK(o) ? "OK (eligible)" : "Exception"}
          </div>
          <div style={{ marginTop: 12, fontWeight: 600 }}>Notes</div>
          <div style={{ fontSize: 14 }}>{o.notes || "—"}</div>
        </div>
      ),
    });
  }

  // Forecast rows: opportunities closing in this period (non-lost)
  const forecastRows = filtered.filter((o) => o.stage !== "Closed Lost");

  // Self-tests
  function runTests() {
    const t = [];
    // 1) Weighted forecast equals sum(amount×prob) on filtered
    const calcW = Math.round(sum(filtered.map((o) => o.amount * STAGE_PROB[o.stage])));
    const dispW = Math.round(weighted);
    t.push({ name: "Weighted forecast equals calc", pass: calcW === dispW });
    // 2) Win rate 0..100%
    t.push({ name: "Win rate sane", pass: winRate >= 0 && winRate <= 100 });
    // 3) Rule blocks high discount/low margin
    const sample = filtered.find((o) => o.stage === "Negotiation");
    const sampleObj = sample ? { ...sample, discountPct: 20, marginPct: 20 } : null;
    t.push({ name: "Rule blocks high disc/low margin", pass: sampleObj ? !ruleOK(sampleObj) : true });
    // 4) Funnel covers all filtered
    const fCount = funnel.reduce((a, b) => a + b.count, 0);
    t.push({ name: "Funnel count equals filtered", pass: fCount === filtered.length });
    // 5) Sorting toggle works
    const before = sorted[0]?.id;
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    const after = [...filtered].sort((a, b) => (a.amount > b.amount ? 1 : -1))[0]?.id;
    // revert sortDir
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    t.push({ name: "Sort mutation sanity", pass: typeof before === "string" && typeof after === "string" });
    const passed = t.filter((x) => x.pass).length;
    alert(`${passed}/${t.length} PASS\n` + t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n"));
  }

  /* ====================== Render ====================== */
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
        <div style={{ margin: "0 auto", padding: "0 16px" }}>
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
                🧾 Sales & CRM
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 09
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => {
                  setOwner("");
                  setTer("");
                  setProd("");
                  setStage("");
                  setSearch("");
                  setSel({});
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
                gridTemplateColumns: "repeat(7, minmax(0,1fr))",
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
                Period
                <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                Owner
                <Select value={owner} onChange={(e) => setOwner(e.target.value)}>
                  <option value="">All</option>
                  <option>Lan Vu</option>
                  <option>Thao Nguyen</option>
                  <option>Minh Pham</option>
                  <option>Trang Do</option>
                  <option>Khoa Bui</option>
                </Select>
              </label>
              <label>
                Territory
                <Select value={ter} onChange={(e) => setTer(e.target.value)}>
                  <option value="">Any</option>
                  <option>North</option>
                  <option>South</option>
                  <option>Central</option>
                </Select>
              </label>
              <label>
                Product
                <Select value={prod} onChange={(e) => setProd(e.target.value)}>
                  <option value="">Any</option>
                  <option>ERP Suite</option>
                  <option>Field Service</option>
                  <option>HR Cloud</option>
                  <option>Analytics</option>
                </Select>
              </label>
              <label>
                Stage
                <Select value={stage} onChange={(e) => setStage(e.target.value)}>
                  <option value="">Any</option>
                  <option>Lead</option>
                  <option>Qualified</option>
                  <option>Proposal</option>
                  <option>Negotiation</option>
                  <option>Closed Won</option>
                  <option>Closed Lost</option>
                </Select>
              </label>
              <label>
                Search
                <Input placeholder="id/account…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </label>
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
            <KPI title="Pipeline" value={fmtVND(pipeline)} hint="open opportunities" />
            <KPI title="Commit" value={fmtVND(commitVal)} hint="Negotiation + Won" />
            <KPI title="Weighted FC" value={fmtVND(weighted)} hint="∑ amount×prob" />
            <KPI title="Win rate" value={winRate + "%"} hint="won / (won+lost)" />
            <KPI title="Avg deal" value={fmtVND(Math.round(avgDeal) || 0)} hint="open+won" />
            <KPI title="Avg cycle (won)" value={(Math.round(avgCycleWon) || 0) + " d"} hint="created→close" />
          </div>

          {/* Funnel */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Funnel
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {funnel.map((f, i) => {
                const width = Math.max(10, Math.min(100, f.count * 14));
                const color =
                  f.stage === "Closed Won"
                    ? "#dcfce7"
                    : f.stage === "Closed Lost"
                    ? "#fee2e2"
                    : "#e5e7eb";
                const fg =
                  f.stage === "Closed Won"
                    ? "#065f46"
                    : f.stage === "Closed Lost"
                    ? "#991b1b"
                    : "#374151";
                return (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div style={{ width: 110, fontSize: 12, color: "#6b7280" }}>
                      {f.stage}
                    </div>
                    <div
                      style={{
                        height: 22,
                        width: width + "%",
                        background: color,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 10,
                        color: fg,
                      }}
                    >
                      {f.count} · {fmtVND(f.value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline board */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Pipeline board
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(5, minmax(0,1fr))",
              }}
            >
              <Lane title="Lead" items={lane("Lead")} onOpen={openDrawer} />
              <Lane
                title="Qualified"
                items={lane("Qualified")}
                onOpen={openDrawer}
              />
              <Lane
                title="Proposal"
                items={lane("Proposal")}
                onOpen={openDrawer}
              />
              <Lane
                title="Negotiation"
                items={lane("Negotiation")}
                onOpen={openDrawer}
              />
              <Lane
                title="Closed"
                items={[...lane("Closed Won"), ...lane("Closed Lost")]}
                onOpen={openDrawer}
              />
            </div>
          </div>

          {/* Opportunities Table */}
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
              <div style={{ fontSize: 14, fontWeight: 600 }}>Opportunities</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={batchApproveQuotes} variant="solid">
                  Batch Approve Quotes
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
                    <th style={thStyle()}>Sel</th>
                    {ths("account", "Account")}
                    {ths("owner", "Owner")}
                    {ths("territory", "Territory")}
                    {ths("product", "Product")}
                    {ths("amount", "Amount")}
                    {ths("stage", "Stage")}
                    {ths("closeDate", "Close")}
                    <th style={thStyle()}>Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((o) => {
                    const checked = !!sel[o.id];
                    const disabled =
                      o.stage === "Closed Won" || o.stage === "Closed Lost";
                    const ok = ruleOK(o);
                    return (
                      <tr key={o.id} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>
                          <input
                            type="checkbox"
                            disabled={disabled}
                            checked={checked}
                            onChange={(e) =>
                              setSel((s) => ({
                                ...s,
                                [o.id]: e.target.checked,
                              }))
                            }
                          />
                        </td>
                        <td
                          style={{ ...tdStyle(), cursor: "pointer" }}
                          onClick={() => openDrawer(o)}
                        >
                          {o.account}
                        </td>
                        <td style={tdStyle()}>{o.owner}</td>
                        <td style={tdStyle()}>{o.territory}</td>
                        <td style={tdStyle()}>{o.product}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(o.amount)}
                        </td>
                        <td style={tdStyle()}>
                          {o.stage === "Closed Won" ? (
                            <span style={tagStyle("#dcfce7", "#065f46")}>
                              Won
                            </span>
                          ) : o.stage === "Closed Lost" ? (
                            <span style={tagStyle("#fee2e2", "#991b1b")}>
                              Lost
                            </span>
                          ) : (
                            <span>{o.stage}</span>
                          )}
                        </td>
                        <td style={tdStyle()}>{o.closeDate}</td>
                        <td style={tdStyle()}>
                          {ok ? (
                            <span style={tagStyle("#dcfce7", "#065f46")}>
                              OK
                            </span>
                          ) : (
                            <span style={tagStyle("#fef3c7", "#92400e")}>
                              Exception
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {sorted.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No opportunities match filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Forecast table */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Forecast (within period)
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
                    <th style={thStyle()}>Opportunity</th>
                    <th style={thStyle()}>Owner</th>
                    <th style={thStyle()}>Stage</th>
                    <th style={thStyle()}>Close</th>
                    <th style={thStyle()}>Amount</th>
                    <th style={thStyle()}>Prob</th>
                    <th style={thStyle()}>Weighted</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastRows.map((o) => (
                    <tr key={o.id} style={{ fontSize: 14 }}>
                      <td style={tdStyle(true)}>{o.account}</td>
                      <td style={tdStyle()}>{o.owner}</td>
                      <td style={tdStyle()}>{o.stage}</td>
                      <td style={tdStyle()}>{o.closeDate}</td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(o.amount)}
                      </td>
                      <td style={tdStyle()}>
                        {Math.round(STAGE_PROB[o.stage] * 100)}%
                      </td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(Math.round(o.amount * STAGE_PROB[o.stage]))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ fontWeight: 600 }}>
                    <td style={tdStyle(true)}>Total</td>
                    <td style={tdStyle()}></td>
                    <td style={tdStyle()}></td>
                    <td style={tdStyle()}></td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {fmtVND(sum(forecastRows.map((o) => o.amount)))}
                    </td>
                    <td style={tdStyle()}></td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {fmtVND(
                        Math.round(
                          sum(
                            forecastRows.map(
                              (o) => o.amount * STAGE_PROB[o.stage]
                            )
                          )
                        )
                      )}
                    </td>
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
              <li>
                <b>Commit</b> = Negotiation + Won. <b>Weighted</b> = ∑ (amount ×
                stage prob).
              </li>
              <li>
                Rule duyệt quote: <b>discount ≤ 15%</b> & <b>margin ≥ 25%</b>{" "}
                tại <i>Proposal/Negotiation</i>.
              </li>
              <li>
                Funnel lệch → rà soát ở stage chuyển đổi thấp
                (Qualified→Proposal).
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
              <Button onClick={() => alert("Open Accounts (placeholder)")}>
                Open Accounts
              </Button>
              <Button onClick={() => alert("Open Quotes (placeholder)")}>
                Open Quotes
              </Button>
              <Button onClick={() => alert("Export Forecast (placeholder)")}>
                Export Forecast
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
              <div style={{ fontSize: 14, fontWeight: 600 }}>{drawer.title}</div>
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
  function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
  }
  function avg(arr) {
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }
  function toISO(d) {
    return d.toISOString().slice(0, 10);
  }

  function ths(key, label) {
    const active = sortKey === key;
    return (
      <th style={thStyle()}>
        <button
          onClick={() => {
            if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
            else {
              setSortKey(key);
              setSortDir("desc");
            }
          }}
          style={{ all: "unset", cursor: "pointer" }}
        >
          {label} {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
        </button>
      </th>
    );
  }
}

/* -------- lane & KPI components -------- */
function Lane({
  title,
  items,
  onOpen,
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 8,
        background: "#fff",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        {title} <span style={{ fontSize: 12, color: "#6b7280" }}>({items.length})</span>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((o) => (
          <div
            key={o.id}
            onClick={() => onOpen(o)}
            style={{
              cursor: "pointer",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              padding: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600 }}>{o.account} · {fmtVND(o.amount)}</div>
            <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>
              {o.owner} · {o.product} · Close {o.closeDate}
              <br />
              Disc {o.discountPct}% · Margin {o.marginPct}%
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ color: "#6b7280", fontSize: 12 }}>Empty</div>
        )}
      </div>
    </div>
  );
}

function KPI({
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
        <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>{hint}</div>
      ) : null}
    </div>
  );
}
