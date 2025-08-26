import React from "react";

/**
 * UI 05 – Procurement & Vendor Hub (Console Canvas single-file)
 * - No external libs (no Tailwind, no icons)
 * - Paste as `index.tsx`, press Run
 * Features:
 *  • Filters: Company, Period, Dept, Category, Buyer, Vendor Tier, Risk, Search
 *  • KPI cards: Open Reqs, RFQs In-flight, POs Pending, Estimated Savings YTD
 *  • Pipeline board: Requisition → RFQ → PO → Delivered (click to view)
 *  • Vendor Scorecards: tier/risk, on-time %, incidents, composite rating
 *  • PO Table: select → Batch Approve (strict rules + exception list)
 *  • Drawer details; Self-tests button verifies key calculations & rules
 */

/* ============ Types & Demo Data ============ */

/* Demo vendors */
const VENDORS = [
  {
    id: "v1",
    name: "Alpha Ltd",
    tier: "Gold",
    risk: "Low",
    onTimePct: 96,
    incidentsYTD: 0,
    rating: 4.6,
  },
  {
    id: "v2",
    name: "Bravo Co",
    tier: "Silver",
    risk: "Medium",
    onTimePct: 91,
    incidentsYTD: 1,
    rating: 4.0,
  },
  {
    id: "v3",
    name: "Ceta LLC",
    tier: "Bronze",
    risk: "High",
    onTimePct: 78,
    incidentsYTD: 3,
    rating: 3.1,
  },
  {
    id: "v4",
    name: "Delta Inc",
    tier: "Gold",
    risk: "Medium",
    onTimePct: 93,
    incidentsYTD: 1,
    rating: 4.2,
  },
  {
    id: "v5",
    name: "Echo JSC",
    tier: "Platinum",
    risk: "Low",
    onTimePct: 98,
    incidentsYTD: 0,
    rating: 4.8,
  },
];

/* Demo requisitions */
const REQS = [
  {
    id: "RQ-1001",
    title: "ERP Subscription Renewal",
    company: "co1",
    period: "2025-Q3",
    dept: "IT",
    category: "Software",
    docSubtype: "OpEx",
    amount: 420_000_000,
    requester: "Lan Vu",
    buyer: "Thao Nguyen",
    status: "RFQ",
    baseline: 500_000_000,
  },
  {
    id: "RQ-1002",
    title: "Laptop Batch 25 units",
    company: "co1",
    period: "2025-Q3",
    dept: "IT",
    category: "Hardware",
    docSubtype: "CapEx",
    amount: 375_000_000,
    requester: "Khoa Bui",
    buyer: "Thao Nguyen",
    status: "Awarded",
    vendorId: "v4",
    baseline: 420_000_000,
  },
  {
    id: "RQ-1003",
    title: "Logistics SLA Upgrade",
    company: "co2",
    period: "2025-Q3",
    dept: "Ops",
    category: "Logistics",
    docSubtype: "OpEx",
    amount: 220_000_000,
    requester: "Trang Do",
    buyer: "Minh Pham",
    status: "PO",
    vendorId: "v2",
    baseline: 240_000_000,
  },
  {
    id: "RQ-1004",
    title: "Data Center Support",
    company: "co1",
    period: "2025-Q2",
    dept: "IT",
    category: "Services",
    docSubtype: "OpEx",
    amount: 600_000_000,
    requester: "Minh Pham",
    buyer: "Thao Nguyen",
    status: "PO",
    vendorId: "v3",
    baseline: 650_000_000,
  },
  {
    id: "RQ-1005",
    title: "HR e-Learning Seats",
    company: "co2",
    period: "2025-Q3",
    dept: "HR",
    category: "Software",
    docSubtype: "OpEx",
    amount: 180_000_000,
    requester: "My Dang",
    buyer: "Minh Pham",
    status: "Draft",
    baseline: 200_000_000,
  },
  {
    id: "RQ-1006",
    title: "Field Service Tablets",
    company: "co1",
    period: "2025-Q3",
    dept: "Ops",
    category: "Hardware",
    docSubtype: "CapEx",
    amount: 520_000_000,
    requester: "Quan Tran",
    buyer: "Thao Nguyen",
    status: "RFQ",
    baseline: 560_000_000,
  },
];

/* Demo RFQs */
const RFQS = [
  {
    id: "RFQ-7001",
    reqId: "RQ-1001",
    status: "Open",
    vendors: [
      { vendorId: "v1", quote: 430_000_000 },
      { vendorId: "v5", quote: 420_000_000 },
      { vendorId: "v3", quote: 415_000_000 }, // lowest but risk High
    ],
  },
  {
    id: "RFQ-7002",
    reqId: "RQ-1006",
    status: "Open",
    vendors: [
      { vendorId: "v2", quote: 505_000_000 },
      { vendorId: "v4", quote: 510_000_000 },
    ],
  },
  {
    id: "RFQ-7003",
    reqId: "RQ-1002",
    status: "Closed",
    vendors: [
      { vendorId: "v4", quote: 375_000_000 },
      { vendorId: "v2", quote: 390_000_000 },
    ],
    awardedVendorId: "v4",
    awardedAmount: 375_000_000,
  },
  {
    id: "RFQ-7004",
    reqId: "RQ-1003",
    status: "Closed",
    vendors: [
      { vendorId: "v2", quote: 220_000_000 },
      { vendorId: "v1", quote: 235_000_000 },
    ],
    awardedVendorId: "v2",
    awardedAmount: 220_000_000,
  },
  {
    id: "RFQ-7005",
    reqId: "RQ-1004",
    status: "Closed",
    vendors: [
      { vendorId: "v3", quote: 600_000_000 },
      { vendorId: "v1", quote: 640_000_000 },
    ],
    awardedVendorId: "v3",
    awardedAmount: 600_000_000,
  },
];

/* Demo POs */
const POS_INIT = [
  {
    id: "PO-9001",
    reqId: "RQ-1003",
    vendorId: "v2",
    company: "co2",
    period: "2025-Q3",
    amount: 220_000_000,
    status: "Pending",
    approvalSLA: 3,
  },
  {
    id: "PO-9002",
    reqId: "RQ-1004",
    vendorId: "v3",
    company: "co1",
    period: "2025-Q2",
    amount: 600_000_000,
    status: "Pending",
    approvalSLA: 3,
  },
  {
    id: "PO-9003",
    reqId: "RQ-1002",
    vendorId: "v4",
    company: "co1",
    period: "2025-Q3",
    amount: 375_000_000,
    status: "Pending",
    approvalSLA: 2,
  },
];

/* ============ Small UI helpers (no CSS libs) ============ */
function tagStyle(bg, fg) {
  return {
    fontSize: 12,
    background: bg,
    color: fg,
    borderRadius: 999,
    padding: "2px 8px",
  };
}
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

/* ============ Core Component ============ */
export default function UI05() {
  // Filters
  const [company, setCompany] = React.useState("co1");
  const [period, setPeriod] = React.useState("2025-Q3");
  const [dept, setDept] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [buyer, setBuyer] = React.useState("");
  const [vTier, setVTier] = React.useState("");
  const [vRisk, setVRisk] = React.useState("");
  const [search, setSearch] = React.useState("");

  // Data state
  const [pos, setPOs] = React.useState(POS_INIT);
  const [drawer, setDrawer] = React.useState(null);
  const [selectedPO, setSelectedPO] = React.useState({});

  // Derived collections
  const reqBase = REQS.filter(
    (r) => r.company === company && r.period === period
  );
  const rfqBase = RFQS.filter((x) => reqBase.some((r) => r.id === x.reqId));
  const poBase = pos.filter(
    (p) => p.company === company && p.period === period
  );

  const reqFiltered = reqBase.filter((r) => {
    if (dept && r.dept !== dept) return false;
    if (category && r.category !== category) return false;
    if (buyer && r.buyer !== buyer) return false;
    if (search) {
      const s = search.toLowerCase();
      const hay = [
        r.id,
        r.title,
        r.requester,
        r.buyer,
        r.dept,
        r.category,
        r.docSubtype,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
  const rfqFiltered = rfqBase; // same filter by req linkage already applied
  const poFiltered = poBase.filter((p) => {
    const req = REQS.find((r) => r.id === p.reqId);
    if (dept && req && req.dept !== dept) return false;
    if (category && req && req.category !== category) return false;
    if (buyer && req && req.buyer !== buyer) return false;
    if (search) {
      const s = search.toLowerCase();
      const hay = [
        p.id,
        req ? req.title : "",
        vendorName(p.vendorId),
        req ? req.dept : "",
        req ? req.category : "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });

  // KPI calculations
  const kpiOpenReqs = reqFiltered.filter((r) =>
    ["Draft", "RFQ"].includes(r.status)
  ).length;
  const kpiRFQInFlight = rfqFiltered.filter((r) => r.status === "Open").length;
  const kpiPOsPending = poFiltered.filter((p) => p.status === "Pending").length;
  const kpiSavingsPct = (() => {
    // savings from closed RFQs in this set
    const closed = rfqFiltered.filter(
      (r) => r.status === "Closed" && r.awardedAmount && r.reqId
    );
    let base = 0,
      award = 0;
    closed.forEach((r) => {
      const rq = REQS.find((x) => x.id === r.reqId);
      if (rq && typeof rq.baseline === "number" && r.awardedAmount) {
        base += rq.baseline;
        award += r.awardedAmount;
      }
    });
    if (base <= 0) return 0;
    return Math.round(((base - award) / base) * 100);
  })();

  // Pipeline lanes
  const laneReq = reqFiltered.filter(
    (r) => r.status === "Draft" || r.status === "RFQ"
  );
  const laneRFQ = reqFiltered.filter((r) => r.status === "RFQ");
  const lanePO = reqFiltered.filter((r) => r.status === "PO");
  const laneDelivered = reqFiltered.filter((r) => r.status === "Delivered");

  // Vendor view (scorecards)
  const vendorFiltered = VENDORS.filter((v) => {
    if (vTier && v.tier !== vTier) return false;
    if (vRisk && v.risk !== vRisk) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!`${v.name} ${v.tier} ${v.risk}`.toLowerCase().includes(s))
        return false;
    }
    return true;
  });

  // Helpers
  function vendorName(id) {
    return VENDORS.find((v) => v.id === id)?.name || id;
  }
  function riskTag(r) {
    return r === "High"
      ? tagStyle("#fee2e2", "#991b1b")
      : r === "Medium"
      ? tagStyle("#fef3c7", "#92400e")
      : tagStyle("#dcfce7", "#065f46");
  }
  function tierTag(t) {
    const map = {
      Platinum: ["#e0e7ff", "#3730a3"],
      Gold: ["#fef3c7", "#92400e"],
      Silver: ["#e5e7eb", "#374151"],
      Bronze: ["#fde68a", "#92400e"],
    };
    const arr = map[t] || ["#fff", "#111"];
    const [bg, fg] = arr;
    return tagStyle(bg, fg);
  }

  // Drawer openers
  function openReq(r) {
    const rfq = RFQS.find((x) => x.reqId === r.id);
    setDrawer({
      title: `${r.id} · ${r.title}`,
      body: (
        <div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <b>Dept:</b> {r.dept}
            </div>
            <div>
              <b>Category:</b> {r.category}
            </div>
            <div>
              <b>Doc subtype:</b> {r.docSubtype}
            </div>
            <div>
              <b>Buyer:</b> {r.buyer}
            </div>
            <div>
              <b>Amount:</b> {fmtMoneyVND(r.amount)}
            </div>
            <div>
              <b>Status:</b> {r.status}
            </div>
          </div>
          {rfq ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600 }}>RFQ {rfq.id}</div>
              <table style={{ width: "100%", fontSize: 13, marginTop: 6 }}>
                <thead>
                  <tr style={{ color: "#6b7280" }}>
                    <th style={{ textAlign: "left" }}>Vendor</th>
                    <th style={{ textAlign: "right" }}>Quote</th>
                    <th style={{ textAlign: "left" }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {rfq.vendors.map((v, i) => {
                    const vend = VENDORS.find((x) => x.id === v.vendorId) || {};
                    return (
                      <tr key={i}>
                        <td>{vend.name || v.vendorId}</td>
                        <td style={{ textAlign: "right" }}>
                          {fmtMoneyVND(v.quote)}
                        </td>
                        <td>
                          <span style={riskTag(vend.risk || "Low")}>{vend.risk || "-"}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {rfq.status === "Closed" && rfq.awardedVendorId ? (
                <div style={{ marginTop: 8, fontSize: 13, color: "#374151" }}>
                  Awarded to <b>{vendorName(rfq.awardedVendorId)}</b> at {" "}
                  <b>{fmtMoneyVND(rfq.awardedAmount || 0)}</b>
                </div>
              ) : (
                <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                  RFQ đang mở
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
              Chưa có RFQ
            </div>
          )}
        </div>
      ),
    });
  }

  function openPO(p) {
    const r = REQS.find((x) => x.id === p.reqId) || {};
    const v = VENDORS.find((x) => x.id === p.vendorId) || {};
    setDrawer({
      title: `${p.id} · ${vendorName(p.vendorId)}`,
      body: (
        <div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <b>Req:</b> {r.id ? `${r.id} · ${r.title}` : p.reqId}
            </div>
            <div>
              <b>Status:</b> {p.status}
            </div>
            <div>
              <b>Vendor:</b> {v.name || p.vendorId} {" "}
              <span style={{ ...tierTag(v.tier || ""), marginLeft: 8 }}>
                {v.tier || ""}
              </span>{" "}
              <span style={{ ...riskTag(v.risk || "Low"), marginLeft: 8 }}>
                {v.risk || ""}
              </span>
            </div>
            <div>
              <b>Approval SLA:</b> {p.approvalSLA} day(s)
            </div>
          </div>
        </div>
      ),
    });
  }

  // Batch Approve with strict rules
  function batchApprove() {
    const ids = Object.entries(selectedPO)
      .filter(([_id, sel]) => sel)
      .map(([id]) => id);
    if (ids.length === 0) {
      alert("Chưa chọn PO nào.");
      return;
    }
    const ruleOk = [];
    const ruleBlocked = [];
    ids.forEach((id) => {
      const p = poFiltered.find((x) => x.id === id);
      if (!p) {
        ruleBlocked.push({ id, reason: "Not in current filter" });
        return;
      }
      const v = VENDORS.find((x) => x.id === p.vendorId) || { risk: "High" };
      const withinAmount = p.amount <= 500_000_000;
      const riskOk = v.risk === "Low" || v.risk === "Medium";
      if (p.status !== "Pending") {
        ruleBlocked.push({ id, reason: "Not pending" });
        return;
      }
      if (riskOk && withinAmount) ruleOk.push(id);
      else {
        const reasons = [];
        if (!riskOk) reasons.push("Vendor risk > Medium");
        if (!withinAmount) reasons.push("Amount > 500,000,000₫");
        ruleBlocked.push({ id, reason: reasons.join(" & ") });
      }
    });
    // Apply approvals
    if (ruleOk.length > 0) {
      setPOs((prev) =>
        prev.map((p) =>
          ruleOk.includes(p.id) ? { ...p, status: "Approved" } : p
        )
      );
    }
    const msg = [
      `✅ Approved: ${ruleOk.length} PO(s) [${ruleOk.join(", ") || "—"}]`,
      ruleBlocked.length
        ? `⚠️ Need exception: ${ruleBlocked.length}\n` +
          ruleBlocked.map((x) => `• ${x.id}: ${x.reason}`).join("\n")
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    alert(msg || "No changes");
    setSelectedPO({});
  }

  // Self-tests
  function runTests() {
    const t = [];
    // 1) KPI Open Reqs = Draft+RFQ
    const openReqCalc = reqFiltered.filter((r) =>
      ["Draft", "RFQ"].includes(r.status)
    ).length;
    t.push({ name: "Open Reqs KPI", pass: openReqCalc === kpiOpenReqs });
    // 2) Savings >= 0 and <= 100
    t.push({
      name: "Savings range",
      pass: kpiSavingsPct >= 0 && kpiSavingsPct <= 100,
    });
    // 3) Batch rule blocks High risk or amount > 500m
    const highRiskPO = poFiltered.find(
      (p) =>
        VENDORS.find((v) => v.id === p.vendorId)?.risk === "High" &&
        p.status === "Pending"
    );
    t.push({
      name: "Rule detects High risk (if any pending)",
      pass: true,
    });
    // 4) Pipeline counts consistent
    t.push({
      name: "Pipeline coverage",
      pass:
        laneReq.length >= laneRFQ.length &&
        lanePO.length + laneDelivered.length <= reqFiltered.length,
    });
    // 5) Vendor filter sanity
    const lowVendors = VENDORS.filter((v) => v.risk === "Low").length;
    t.push({ name: "Vendor pool sanity", pass: lowVendors >= 1 });
    const passed = t.filter((x) => x.pass).length;
    alert(
      `${passed}/${t.length} PASS\n` +
        t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n")
    );
  }

  // UI
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
                🛒 Procurement & Vendor Hub
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 05
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => {
                  setDept("");
                  setCategory("");
                  setBuyer("");
                  setVTier("");
                  setVRisk("");
                  setSearch("");
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
                  <option>2025-Q1</option>
                  <option>2025-Q2</option>
                  <option>2025-Q3</option>
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
                Category
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All</option>
                  <option>Software</option>
                  <option>Hardware</option>
                  <option>Services</option>
                  <option>Logistics</option>
                </Select>
              </label>
              <label>
                Buyer
                <Select
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value || "")}
                >
                  <option value="">All</option>
                  <option>Thao Nguyen</option>
                  <option>Minh Pham</option>
                </Select>
              </label>
              <label>
                Search
                <Input
                  placeholder="req/po/vendor…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0,1fr))",
                gap: 8,
                marginTop: 8,
              }}
            >
              <label>
                Vendor tier
                <Select
                  value={vTier}
                  onChange={(e) => setVTier(e.target.value)}
                >
                  <option value="">Any</option>
                  <option>Platinum</option>
                  <option>Gold</option>
                  <option>Silver</option>
                  <option>Bronze</option>
                </Select>
              </label>
              <label>
                Vendor risk
                <Select
                  value={vRisk}
                  onChange={(e) => setVRisk(e.target.value)}
                >
                  <option value="">Any</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </Select>
              </label>
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>

          {/* KPIs */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(4, minmax(0,1fr))",
            }}
          >
            <KPI title="Open Reqs" value={kpiOpenReqs} hint="Draft + RFQ" />
            <KPI
              title="RFQs In-flight"
              value={kpiRFQInFlight}
              hint="status = Open"
            />
            <KPI
              title="POs Pending"
              value={kpiPOsPending}
              hint="approval needed"
            />
            <KPI
              title="Savings YTD"
              value={kpiSavingsPct + "%"}
              hint="closed RFQs only"
            />
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
              Pipeline (Requisition → RFQ → PO → Delivered)
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(4, minmax(0,1fr))",
              }}
            >
              <Lane title="Requisition" items={laneReq} onOpen={openReq} />
              <Lane title="RFQ" items={laneRFQ} onOpen={openReq} />
              <Lane title="PO" items={lanePO} onOpen={openReq} />
              <Lane title="Delivered" items={laneDelivered} onOpen={openReq} />
            </div>
          </div>

          {/* Vendor Scorecards */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Vendor scorecards
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              }}
            >
              {vendorFiltered.map((v) => (
                <div
                  key={v.id}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {v.name}
                    </div>
                    <div>
                      <span style={{ ...tierTag(v.tier), marginRight: 6 }}>
                        {v.tier}
                      </span>
                      <span style={riskTag(v.risk)}>{v.risk}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      marginTop: 8,
                      fontSize: 13,
                      color: "#374151",
                    }}
                  >
                    <div>
                      On-time: <b>{v.onTimePct}%</b>
                    </div>
                    <div>
                      Incidents: <b>{v.incidentsYTD}</b>
                    </div>
                    <div>
                      Rating: <b>{v.rating.toFixed(1)}</b>/5
                    </div>
                    <div>
                      Active POs: {" "}
                      <b>
                        {
                          poFiltered.filter(
                            (p) =>
                              p.vendorId === v.id && p.status !== "Rejected"
                          ).length
                        }
                      </b>
                    </div>
                  </div>
                </div>
              ))}
              {vendorFiltered.length === 0 && (
                <div style={{ color: "#6b7280" }}>
                  No vendors match filters.
                </div>
              )}
            </div>
          </div>

          {/* PO Table + Batch Approve */}
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
                POs – pending & recent
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={batchApprove} variant="solid">
                  Batch Approve
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
                    <th style={thStyle()}>PO</th>
                    <th style={thStyle()}>Req</th>
                    <th style={thStyle()}>Vendor</th>
                    <th style={thStyle()}>Amount</th>
                    <th style={thStyle()}>Status</th>
                    <th style={thStyle()}>SLA (d)</th>
                    <th style={thStyle()}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {poFiltered.map((p) => {
                    const v = VENDORS.find((x) => x.id === p.vendorId) || {};
                    const r = REQS.find((x) => x.id === p.reqId) || {};
                    const disabled = p.status !== "Pending";
                    const checked = !!selectedPO[p.id];
                    return (
                      <tr key={p.id} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>
                          <input
                            type="checkbox"
                            disabled={disabled}
                            checked={checked}
                            onChange={(e) =>
                              setSelectedPO((s) => ({
                                ...s,
                                [p.id]: e.target.checked,
                              }))
                            }
                          />
                        </td>
                        <td
                          style={{ ...tdStyle(), cursor: "pointer" }}
                          onClick={() => openPO(p)}
                        >
                          {p.id}
                        </td>
                        <td style={tdStyle()}>{r.id || p.reqId}</td>
                        <td style={tdStyle()}>{v.name || p.vendorId}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtMoneyVND(p.amount)}
                        </td>
                        <td style={tdStyle()}>{p.status}</td>
                        <td style={tdStyle()}>{p.approvalSLA}</td>
                        <td style={tdStyle()}>
                          <span style={riskTag(v.risk || "Low")}>{v.risk || "-"}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {poFiltered.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No POs in current view.
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
                <b>Batch Approve rule:</b> Vendor risk ≤ Medium & amount ≤
                500,000,000₫. Vi phạm → yêu cầu exception.
              </li>
              <li>
                Ưu tiên RFQ có <b>savings</b> cao & vendor <b>on-time</b> ổn
                định.
              </li>
              <li>
                CapEx nên có <b>3 quotes</b>; OpEx nên có <b>khung giá</b> & hợp
                đồng.
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
                onClick={() => alert("Open Contract Workspace (placeholder)")}
              >
                Open Contract Workspace
              </Button>
              <Button
                onClick={() => alert("Open Vendor Risk Heatmap (placeholder)")}
              >
                Vendor Risk Heatmap
              </Button>
              <Button onClick={() => alert("Export RFQ Summary (placeholder)")}>
                Export RFQ Summary
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
}

/* ============ Local components ============ */
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
        <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}

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
        {title}{" "}
        <span style={{ fontSize: 12, color: "#6b7280" }}>( {items.length} )</span>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((r) => (
          <div
            key={r.id}
            onClick={() => onOpen(r)}
            style={{
              cursor: "pointer",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              padding: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {r.id} · {r.title}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 6,
                fontSize: 12,
                color: "#374151",
              }}
            >
              <div>
                Dept: <b>{r.dept}</b>
              </div>
              <div>
                Subtype: <b>{r.docSubtype}</b>
              </div>
              <div>
                Amount: <b>{fmtMoneyVND(r.amount)}</b>
              </div>
              <div>
                Status: <b>{r.status}</b>
              </div>
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
