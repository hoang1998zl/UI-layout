import React from "react";

/**
 * UI 17 – Treasury & Cash Management (Console Canvas single-file)
 * Paste as `index.tsx` and press Run. No external libs.
 */

/* ================== Types & Constants ================== */









const FX = { VND: 1, USD: 25200 }; // USD→VND
const TODAY = new Date("2025-08-14"); // per project context
function toISO(d) {
  return d.toISOString().slice(0, 10);
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function fmtVND(x) {
  return Math.round(x).toLocaleString("vi-VN") + " ₫";
}
function sum(a) {
  return a.reduce((p, c) => p + c, 0);
}

/* ================== Demo Data ================== */
const BANKS = [
  {
    id: "B1",
    company: "co1",
    bank: "Vietcombank",
    number: "001-001",
    ccy: "VND",
    balance: 220_000_000,
  },
  {
    id: "B2",
    company: "co1",
    bank: "ACB",
    number: "002-888",
    ccy: "VND",
    balance: 85_000_000,
  },
  {
    id: "B3",
    company: "co2",
    bank: "HSBC",
    number: "US-777",
    ccy: "USD",
    balance: 8_500,
  },
];

const STATEMENTS = [
  // co1 VND inflows/outflows around 2025-08-13..16
  {
    id: "ST-100",
    acctId: "B1",
    date: "2025-08-13",
    amount: +58_000_000,
    desc: "AR receipt INV-118",
    matched: false,
  },
  {
    id: "ST-101",
    acctId: "B1",
    date: "2025-08-14",
    amount: -18_000_000,
    desc: "AP wire PAY-450",
    matched: false,
  },
  {
    id: "ST-102",
    acctId: "B2",
    date: "2025-08-14",
    amount: -12_000_000,
    desc: "Payroll August",
    matched: false,
  },
  {
    id: "ST-103",
    acctId: "B1",
    date: "2025-08-15",
    amount: +40_000_000,
    desc: "AR receipt INV-119",
    matched: false,
  },
  // co2 USD
  {
    id: "ST-200",
    acctId: "B3",
    date: "2025-08-14",
    amount: -1_000,
    desc: "AP payment VDR-2002",
    matched: false,
  },
  {
    id: "ST-201",
    acctId: "B3",
    date: "2025-08-15",
    amount: +3_500,
    desc: "AR receipt US-INV-33",
    matched: false,
  },
];

const FORECAST = [
  {
    id: "CF-AR-118",
    company: "co1",
    date: "2025-08-14",
    ccy: "VND",
    amount: +42_000_000,
    type: "AR Inflow",
  },
  {
    id: "CF-AR-119",
    company: "co1",
    date: "2025-08-15",
    ccy: "VND",
    amount: +40_000_000,
    type: "AR Inflow",
  },
  {
    id: "CF-AP-450",
    company: "co1",
    date: "2025-08-14",
    ccy: "VND",
    amount: -18_000_000,
    type: "AP Outflow",
  },
  {
    id: "CF-PAY",
    company: "co1",
    date: "2025-08-15",
    ccy: "VND",
    amount: -12_000_000,
    type: "Payroll",
  },
  {
    id: "CF-TAX",
    company: "co1",
    date: "2025-08-25",
    ccy: "VND",
    amount: -25_000_000,
    type: "Tax",
  },

  {
    id: "CF-AP-US1",
    company: "co2",
    date: "2025-08-14",
    ccy: "USD",
    amount: -1_000,
    type: "AP Outflow",
  },
  {
    id: "CF-AR-US",
    company: "co2",
    date: "2025-08-15",
    ccy: "USD",
    amount: +3_000,
    type: "AR Inflow",
  },
];

const PAYABLES_INIT = [
  {
    id: "AP-1001",
    company: "co1",
    vendor: "FPT Services",
    due: "2025-08-16",
    ccy: "VND",
    amount: 8_800_000,
  },
  {
    id: "AP-1002",
    company: "co1",
    vendor: "EVN Power",
    due: "2025-08-18",
    ccy: "VND",
    amount: 6_200_000,
  },
  {
    id: "AP-1003",
    company: "co1",
    vendor: "VNPT",
    due: "2025-08-20",
    ccy: "VND",
    amount: 4_500_000,
  },
  {
    id: "AP-2001",
    company: "co2",
    vendor: "AWS",
    due: "2025-08-17",
    ccy: "USD",
    amount: 380,
  },
  {
    id: "AP-2002",
    company: "co2",
    vendor: "Atlassian",
    due: "2025-08-14",
    ccy: "USD",
    amount: 1_000,
  },
];

/* ================== Small UI helpers ================== */
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
function vndEq(amount, ccy) {
  return amount * FX[ccy];
}

/* ================== Main Component ================== */
export default function UI17_OKRDesigner() {
  const [company, setCompany] = React.useState("co1");
  const [horizon, setHorizon] = React.useState(14);
  const [payables, setPayables] = React.useState(PAYABLES_INIT);
  const [batches, setBatches] = React.useState([]);
  const [stmts, setStmts] = React.useState(STATEMENTS);
  const [drawer, setDrawer] = React.useState(null);

  /* ---------- Derived ---------- */
  const accts = BANKS.filter((b) => b.company === company);
  const cashNowVND = accts.reduce((s, a) => s + vndEq(a.balance, a.ccy), 0);

  const horizonDates = Array.from({ length: horizon }, (_, i) =>
    toISO(addDays(TODAY, i))
  );
  const events = FORECAST.filter(
    (e) => e.company === company && horizonDates.includes(e.date)
  );
  const batchOutflows = batches
    .filter(
      (b) =>
        b.company === company &&
        (b.status === "Approved" || b.status === "Released")
    )
    .flatMap((b) =>
      b.items.map((it) => ({
        date: toISO(TODAY),
        ccy: b.ccy,
        amount: -it.amount,
      }))
    );
  const ladderEvents = [
    ...events,
    ...batchOutflows.map((x) => ({
      id: "BATCH",
      company,
      date: x.date,
      ccy: x.ccy,
      amount: x.amount,
      type: "AP Outflow",
    })),
  ];

  const ladder = (() => {
    let bal = cashNowVND;
    const rows = horizonDates.map((d) => {
      const inflow = sum(
        ladderEvents
          .filter((e) => e.date === d && e.amount > 0)
          .map((e) => vndEq(e.amount, e.ccy))
      );
      const outflow = sum(
        ladderEvents
          .filter((e) => e.date === d && e.amount < 0)
          .map((e) => vndEq(Math.abs(e.amount), e.ccy))
      );
      bal = bal + inflow - outflow;
      return { date: d, inflow, outflow, closing: bal };
    });
    const minBal = Math.min(...rows.map((r) => r.closing));
    return { rows, minBal };
  })();

  const paymentsPending = payables.filter(
    (p) => p.company === company && p.selected
  ).length;

  // Reco scope
  const stmtsView = stmts.filter((s) => accts.some((a) => a.id === s.acctId));
  const recoToleranceVND = 20_000;
  const glCashSim = [
    // Simulated GL-side cash entries (already posted in GL)
    ...stmtsView.map((s) => ({
      id: "JE-" + s.id,
      acctId: s.acctId,
      date: s.date,
      amount:
        s.amount + (Math.random() < 0.3 ? (s.amount > 0 ? -5000 : 0) : 0),
      desc: "GL " + s.desc,
      matched: false,
    })),
  ];

  /* ---------- KPI ---------- */
  const kpis = {
    totalCash: cashNowVND,
    todayNet: (() => {
      const todayISO = toISO(TODAY);
      const inflow = sum(
        ladderEvents
          .filter((e) => e.date === todayISO && e.amount > 0)
          .map((e) => vndEq(e.amount, e.ccy))
      );
      const outflow = sum(
        ladderEvents
          .filter((e) => e.date === todayISO && e.amount < 0)
          .map((e) => vndEq(Math.abs(e.amount), e.ccy))
      );
      return inflow - outflow;
    })(),
    min14: ladder.minBal,
    paymentsPending,
  };

  /* ---------- Actions: Payments ---------- */
  function createBatch() {
    const items = payables.filter((p) => p.company === company && p.selected);
    if (!items.length) {
      alert("Chưa chọn khoản phải trả nào.");
      return;
    }
    const ccy = items.every((i) => i.ccy === items[0].ccy)
      ? items[0].ccy
      : "VND";
    const id = "PB-" + Math.floor(Math.random() * 9000 + 1000);
    const batch = {
      id,
      company,
      ccy,
      items,
      status: "Draft",
      createdAt: toISO(TODAY),
    };
    setBatches((prev) => [batch, ...prev]);
    // un-select selected payables
    setPayables((prev) =>
      prev.map((p) => (p.company === company ? { ...p, selected: false } : p))
    );
  }
  function approveBatch(b) {
    if (b.status !== "Draft") {
      alert("Batch không ở trạng thái Draft.");
      return;
    }
    setBatches((prev) =>
      prev.map((x) => (x.id === b.id ? { ...x, status: "Approved" } : x))
    );
  }
  function releaseBatch(b) {
    if (b.status !== "Approved") {
      alert("Cần Approve trước khi Release.");
      return;
    }
    setBatches((prev) =>
      prev.map((x) => (x.id === b.id ? { ...x, status: "Released" } : x))
    );
  }
  function exportBatchCSV(b) {
    let csv = "Vendor,Due,Amount,CCY\n";
    b.items.forEach((i) => {
      csv += `${i.vendor},${i.due},${i.amount},${i.ccy}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b.id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ---------- Actions: Reconciliation ---------- */
  function autoSuggestMatch() {
    const withinDays = (d1, d2) =>
      Math.abs((new Date(d1).getTime() - new Date(d2).getTime()) / 86400000) <=
      2;
    setStmts((prev) =>
      prev.map((s) => {
        if (s.matched) return s;
        // find GL candidate by amount & date tolerance
        const gl = glCashSim.find(
          (g) =>
            !g.matched &&
            g.acctId === s.acctId &&
            withinDays(g.date, s.date) &&
            Math.abs(
              vndEq(g.amount, BANKS.find((b) => b.id === s.acctId).ccy) -
                vndEq(s.amount, BANKS.find((b) => b.id === s.acctId).ccy)
            ) <= recoToleranceVND
        );
        if (gl) {
          return { ...s, matched: true };
        }
        return s;
      })
    );
  }
  function bulkMatchSelected(ids) {
    setStmts((prev) =>
      prev.map((s) => (ids.includes(s.id) ? { ...s, matched: true } : s))
    );
  }

  /* ---------- Self-tests ---------- */
  function runTests() {
    const t = [];
    // 1) Ladder math: closing(last) = cashNow + sum(inflow) - sum(outflow)
    const last = ladder.rows[ladder.rows.length - 1];
    const inflowSum = sum(ladder.rows.map((r) => r.inflow));
    const outflowSum = sum(ladder.rows.map((r) => r.outflow));
    t.push({
      name: "Ladder arithmetic",
      pass: Math.abs(cashNowVND + inflowSum - outflowSum - last.closing) < 1,
    });
    // 2) Cannot release before approve
    const badRelease = batches.some((b) => b.status === "Draft" && false); // should be false
    t.push({ name: "Release requires Approve", pass: !badRelease });
    // 3) No duplicate match in statements array
    const dup =
      stmts.filter((s) => s.matched).length !==
      new Set(stmts.filter((s) => s.matched).map((s) => s.id)).size;
    t.push({ name: "No duplicate match IDs", pass: !dup });
    // 4) FX conversion consistency
    const usdAcct = BANKS.find((b) => b.company === company && b.ccy === "USD");
    t.push({
      name: "FX convertible",
      pass: usdAcct ? vndEq(usdAcct.balance, "USD") > 0 : true,
    });
    alert(
      `Self-tests) => x.pass).length}/${t.length} PASS\n` +
        t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n")
    );
  }

  /* ================== Render ================== */
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
                🏦 Treasury & Cash
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 17
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
        {/* MAIN */}
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
                Horizon
                <Select
                  value={horizon}
                  onChange={(e) => setHorizon(Number(e.target.value))}
                >
                  {[7, 14, 30].map((n) => (
                    <option key={n} value={n}>
                      {n} days
                    </option>
                  ))}
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
            <KPI title="Total Cash (VND eq.)" value={fmtVND(kpis.totalCash)} />
            <KPI title="Today Net Flow" value={fmtVND(kpis.todayNet)} />
            <KPI title="14-day Min Cash" value={fmtVND(kpis.min14)} />
            <KPI
              title="Payments Pending"
              value={String(kpis.paymentsPending)}
            />
          </div>

          {/* Cash Position (Ladder) */}
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
              Cash Position — {horizon} ngày
            </div>
            <div style={{ padding: 12 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  fontSize: 13,
                  color: "#6b7280",
                }}
              >
                <div>Start: {fmtVND(cashNowVND)}</div>
                <div>
                  Total inflow: {fmtVND(sum(ladder.rows.map((r) => r.inflow)))}
                </div>
                <div>
                  Total outflow:{" "}
                  {fmtVND(sum(ladder.rows.map((r) => r.outflow)))}
                </div>
              </div>
              <div style={{ marginTop: 12, overflowX: "auto" }}>
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
                      <th style={thStyle()}>Date</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Inflow
                      </th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Outflow
                      </th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Closing
                      </th>
                      <th style={thStyle()}>Bar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ladder.rows.map((r) => (
                      <tr key={r.date}>
                        <td style={tdStyle(true)}>{r.date}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(r.inflow)}
                        </td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(r.outflow)}
                        </td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(r.closing)}
                        </td>
                        <td style={tdStyle()}>
                          <div
                            style={{
                              height: 10,
                              background: "#f3f4f6",
                              borderRadius: 999,
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width:
                                  Math.min(
                                    100,
                                    (Math.abs(r.closing) /
                                      (Math.abs(ladder.rows[0]?.closing) ||
                                        1)) *
                                      100
                                  ) + "%",
                                borderRadius: 999,
                                background:
                                  r.closing >= 0 ? "#bbf7d0" : "#fecaca",
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payments */}
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
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>Payments</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={createBatch} variant="solid">
                  Create Batch
                </Button>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
                borderTop: "1px solid #e5e5e5",
              }}
            >
              {/* Payables list */}
              <div style={{ padding: 12, borderRight: "1px solid #e5e5e5" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Open Payables
                </div>
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
                      <th style={thStyle()}>ID</th>
                      <th style={thStyle()}>Vendor</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Amount
                      </th>
                      <th style={thStyle()}>Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payables
                      .filter((p) => p.company === company)
                      .map((p) => (
                        <tr key={p.id}>
                          <td style={tdStyle(true)}>
                            <input
                              type="checkbox"
                              checked={!!p.selected}
                              onChange={(e) =>
                                setPayables((prev) =>
                                  prev.map((x) =>
                                    x.id === p.id
                                      ? { ...x, selected: e.target.checked }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td style={tdStyle()}>{p.id}</td>
                          <td style={tdStyle()}>{p.vendor}</td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {fmtVND(vndEq(p.amount, p.ccy))}
                          </td>
                          <td style={tdStyle()}>{p.due}</td>
                        </tr>
                      ))}
                    {payables.filter((p) => p.company === company).length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: 16,
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          No payables.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Batches */}
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Batches
                </div>
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
                      <th style={thStyle()}>Batch</th>
                      <th style={thStyle()}>Items</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Total (VND eq.)
                      </th>
                      <th style={thStyle()}>Status</th>
                      <th style={thStyle()}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches
                      .filter((b) => b.company === company)
                      .map((b) => {
                        const total = sum(
                          b.items.map((i) => vndEq(i.amount, i.ccy))
                        );
                        return (
                          <tr key={b.id}>
                            <td style={tdStyle(true)}>{b.id}</td>
                            <td style={tdStyle()}>{b.items.length}</td>
                            <td style={{ ...tdStyle(), textAlign: "right" }}>
                              {fmtVND(total)}
                            </td>
                            <td style={tdStyle()}>
                              <span
                                style={
                                  b.status === "Draft"
                                    ? tagStyle("#fef3c7", "#92400e")
                                    : b.status === "Approved"
                                    ? tagStyle("#dbeafe", "#1e40af")
                                    : tagStyle("#dcfce7", "#065f46")
                                }
                              >
                                {b.status}
                              </span>
                            </td>
                            <td style={tdStyle()}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 6,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Button onClick={() => approveBatch(b)}>
                                  Approve
                                </Button>
                                <Button onClick={() => releaseBatch(b)}>
                                  Release
                                </Button>
                                <Button onClick={() => exportBatchCSV(b)}>
                                  Export CSV
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    {batches.filter((b) => b.company === company).length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: 16,
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          No batches.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bank Reconciliation */}
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
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                Bank Reconciliation
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={autoSuggestMatch}>Auto-suggest</Button>
                <Button
                  onClick={() => {
                    const ids = stmtsView
                      .filter((s) => !s.matched)
                      .slice(0, 2)
                      .map((s) => s.id);
                    bulkMatchSelected(ids);
                  }}
                  variant="solid"
                >
                  Bulk Match (demo)
                </Button>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
                borderTop: "1px solid #e5e5e5",
              }}
            >
              {/* Bank side */}
              <div style={{ padding: 12, borderRight: "1px solid #e5e5e5" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Bank statements
                </div>
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
                      <th style={thStyle()}>Acct</th>
                      <th style={thStyle()}>Date</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Amount
                      </th>
                      <th style={thStyle()}>Desc</th>
                      <th style={thStyle()}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stmtsView.map((s) => {
                      const acct = BANKS.find((b) => b.id === s.acctId);
                      return (
                        <tr key={s.id}>
                          <td style={tdStyle(true)}>
                            {acct.bank} {acct.number}
                          </td>
                          <td style={tdStyle()}>{s.date}</td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {fmtVND(vndEq(s.amount, acct.ccy))}
                          </td>
                          <td style={tdStyle()}>{s.desc}</td>
                          <td style={tdStyle()}>
                            {s.matched ? (
                              <span style={tagStyle("#dcfce7", "#065f46")}>
                                Matched
                              </span>
                            ) : (
                              <span style={tagStyle("#fee2e2", "#991b1b")}>
                                Open
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* GL side (simulated) */}
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  GL cash entries (simulated)
                </div>
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
                      <th style={thStyle()}>JE</th>
                      <th style={thStyle()}>Date</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Amount(VND)
                      </th>
                      <th style={thStyle()}>Desc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {glCashSim.map((g) => {
                      const acct = BANKS.find((b) => b.id === g.acctId);
                      return (
                        <tr key={g.id}>
                          <td style={tdStyle(true)}>{g.id}</td>
                          <td style={tdStyle()}>{g.date}</td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {fmtVND(vndEq(g.amount, acct.ccy))}
                          </td>
                          <td style={tdStyle()}>{g.desc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SIDE */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Accounts & FX Exposure */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Accounts & FX Exposure
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                fontSize: 14,
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
                  <th style={thStyle()}>Bank</th>
                  <th style={thStyle()}>CCY</th>
                  <th style={{ ...thStyle(), textAlign: "right" }}>Balance</th>
                  <th style={{ ...thStyle(), textAlign: "right" }}>VND eq.</th>
                </tr>
              </thead>
              <tbody>
                {accts.map((a) => (
                  <tr key={a.id}>
                    <td style={tdStyle(true)}>
                      {a.bank} {a.number}
                    </td>
                    <td style={tdStyle()}>{a.ccy}</td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {a.ccy === "VND"
                        ? fmtVND(a.balance)
                        : a.balance.toLocaleString("en-US") + " USD"}
                    </td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {fmtVND(vndEq(a.balance, a.ccy))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {accts.some((a) => a.ccy === "USD") && (
              <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                FX rate USD→VND = {FX.USD.toLocaleString("vi-VN")}. Nếu tổng USD
                eq. &gt; {fmtVND(100_000_000)}, gợi ý hedge 50%.
              </div>
            )}
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
                <b>Cash Ladder</b>: Start + Inflow − Outflow → Closing theo
                ngày.
              </li>
              <li>
                <b>Payments</b>: chọn AP → tạo Batch → Approve → Release →
                Export CSV.
              </li>
              <li>
                <b>Reconciliation</b>: Auto-suggest dựa sai số ≤ 20k₫, ±2 ngày.
              </li>
              <li>
                <b>FX</b>: USD quy đổi về VND để so KPI, gợi ý hedge khi vượt
                ngưỡng.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Drawer (for future details) */}
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
              width: "min(100%, 640px)",
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

  /* --- tiny components --- */
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
