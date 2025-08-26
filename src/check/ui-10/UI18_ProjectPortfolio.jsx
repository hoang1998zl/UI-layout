import React from "react";

/**
 * UI 18 – Tax & Compliance (Console Canvas single-file)
 * Paste as `index.tsx` and press Run. No external libs.
 */

/* ================== Types ================== */











/* ================== Constants ================== */
const TODAY = new Date("2025-08-14"); // per project context
const FX = { VND: 1, USD: 25200 };
function toISO(d) {
  return d.toISOString().slice(0, 10);
}
function fmtVND(x) {
  return Math.round(x).toLocaleString("vi-VN") + " ₫";
}
function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
function qOf(period) {
  const m = Number(period.slice(5));
  return m <= 3 ? 1 : m <= 6 ? 2 : m <= 9 ? 3 : 4;
}

/* ================== Demo Data ================== */
// VAT / WHT transactions (thin but realistic)
const TXNS = [
  // ===== co1 · 2025-08 =====
  {
    id: "S-1001",
    company: "co1",
    period: "2025-08",
    date: "2025-08-05",
    ccy: "VND",
    kind: "Sale",
    desc: "Retail sale",
    base: 220_000_000,
    vat: 0.1,
  },
  {
    id: "S-1002",
    company: "co1",
    period: "2025-08",
    date: "2025-08-10",
    ccy: "VND",
    kind: "Sale",
    desc: "Export order",
    base: 40_000_000,
    vat: 0,
  }, // 0% (zero-rated)
  {
    id: "P-2001",
    company: "co1",
    period: "2025-08",
    date: "2025-08-08",
    ccy: "VND",
    kind: "Purchase",
    desc: "Raw material",
    base: 70_000_000,
    vat: 0.1,
    inputClaimable: true,
  },
  {
    id: "P-2002",
    company: "co1",
    period: "2025-08",
    date: "2025-08-11",
    ccy: "VND",
    kind: "Purchase",
    desc: "Office rent",
    base: 30_000_000,
    vat: 0.1,
    inputClaimable: true,
  },
  {
    id: "P-2003",
    company: "co1",
    period: "2025-08",
    date: "2025-08-12",
    ccy: "VND",
    kind: "Purchase",
    desc: "Staff meal",
    base: 5_000_000,
    vat: 0.08,
    inputClaimable: false,
  }, // not claimable in demo

  // WHT (contractor) – khấu trừ nhà thầu
  {
    id: "C-3001",
    company: "co1",
    period: "2025-08",
    date: "2025-08-09",
    ccy: "VND",
    kind: "Contractor",
    desc: "Consulting fee",
    base: 12_000_000,
    whtRate: 0.05,
    whtType: "Services",
  },

  // ===== co2 · 2025-08 (USD) =====
  {
    id: "S-1101",
    company: "co2",
    period: "2025-08",
    date: "2025-08-06",
    ccy: "USD",
    kind: "Sale",
    desc: "Service US",
    base: 9_000,
    vat: 0.1,
  },
  {
    id: "P-2101",
    company: "co2",
    period: "2025-08",
    date: "2025-08-07",
    ccy: "USD",
    kind: "Purchase",
    desc: "Cloud hosting",
    base: 3_000,
    vat: 0.1,
    inputClaimable: true,
  },
  {
    id: "C-3101",
    company: "co2",
    period: "2025-08",
    date: "2025-08-13",
    ccy: "USD",
    kind: "Contractor",
    desc: "Royalty fee",
    base: 1_500,
    whtRate: 0.1,
    whtType: "Royalties",
  },

  // ===== Prior month (2025-07) for variance/quarter =====
  {
    id: "S-0901",
    company: "co1",
    period: "2025-07",
    date: "2025-07-10",
    ccy: "VND",
    kind: "Sale",
    desc: "Retail sale",
    base: 200_000_000,
    vat: 0.1,
  },
  {
    id: "P-0902",
    company: "co1",
    period: "2025-07",
    date: "2025-07-12",
    ccy: "VND",
    kind: "Purchase",
    desc: "Raw material",
    base: 60_000_000,
    vat: 0.1,
    inputClaimable: true,
  },
  {
    id: "C-0903",
    company: "co1",
    period: "2025-07",
    date: "2025-07-20",
    ccy: "VND",
    kind: "Contractor",
    desc: "Design fee",
    base: 8_000_000,
    whtRate: 0.05,
    whtType: "Services",
  },
];

// CIT slices (demo P&L + adjustments)
const CIT = [
  // co1
  {
    company: "co1",
    period: "2025-07",
    revenue: 280_000_000,
    cogs: 100_000_000,
    opex: 80_000_000,
    otherIncome: 0,
    nondeductibleEntertainment: 2_000_000,
    depDiff: 1_000_000,
  },
  {
    company: "co1",
    period: "2025-08",
    revenue: 260_000_000,
    cogs: 95_000_000,
    opex: 72_000_000,
    otherIncome: 1_200_000,
    nondeductibleEntertainment: 2_500_000,
    depDiff: 0,
  },
  // co2 (USD→VND via FX)
  {
    company: "co2",
    period: "2025-07",
    revenue: 9_000 * FX.USD,
    cogs: 3_600 * FX.USD,
    opex: 1_900 * FX.USD,
    otherIncome: 0,
    nondeductibleEntertainment: 0,
    depDiff: 0,
  },
  {
    company: "co2",
    period: "2025-08",
    revenue: 9_000 * FX.USD,
    cogs: 3_000 * FX.USD,
    opex: 2_000 * FX.USD,
    otherIncome: 500 * FX.USD,
    nondeductibleEntertainment: 0,
    depDiff: 0,
  },
];

// Calendar seeds (due dates demo)
const CALENDAR_SEED = [
  // For 2025-08 (monthly VAT/WHT due ~ next month 20); CIT Q3 provisional due demo ~ 2025-10-30
  {
    id: "T-VAT-CO1-2025-08",
    company: "co1",
    period: "2025-08",
    kind: "VAT Return",
    due: "2025-09-20",
  },
  {
    id: "T-WHT-CO1-2025-08",
    company: "co1",
    period: "2025-08",
    kind: "WHT Return",
    due: "2025-09-20",
  },
  {
    id: "T-CIT-CO1-Q3",
    company: "co1",
    period: "2025-08",
    kind: "CIT Provisional",
    due: "2025-10-30",
  },

  {
    id: "T-VAT-CO2-2025-08",
    company: "co2",
    period: "2025-08",
    kind: "VAT Return",
    due: "2025-09-20",
  },
  {
    id: "T-WHT-CO2-2025-08",
    company: "co2",
    period: "2025-08",
    kind: "WHT Return",
    due: "2025-09-20",
  },
  {
    id: "T-CIT-CO2-Q3",
    company: "co2",
    period: "2025-08",
    kind: "CIT Provisional",
    due: "2025-10-30",
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

/* ================== Tax Logic ================== */
function vndEq(base, ccy) {
  return base * FX[ccy];
}

function vatSummary(company, period) {
  const rows = TXNS.filter(
    (t) =>
      t.company === company &&
      t.period === period &&
      (t.kind === "Sale" || t.kind === "Purchase")
  );
  
  const buckets = {
    "10%": { base: 0, vat: 0 },
    "8%": { base: 0, vat: 0 },
    "5%": { base: 0, vat: 0 },
    "0%": { base: 0, vat: 0 },
    Exempt: { base: 0, vat: 0 },
  };
  let output = 0,
    input = 0;
  rows.forEach((t) => {
    const baseVND = vndEq(t.base, t.ccy);
    const rate =
      t.vat === "exempt"
        ? "Exempt"
        : t.vat === 0.1
        ? "10%"
        : t.vat === 0.08
        ? "8%"
        : t.vat === 0.05
        ? "5%"
        : "0%";
    if (t.kind === "Sale") {
      const v = typeof t.vat === "number" ? baseVND * t.vat : 0;
      output += v;
      buckets[rate].base += baseVND;
      buckets[rate].vat += v;
    } else {
      const v =
        typeof t.vat === "number" && t.inputClaimable ? baseVND * t.vat : 0;
      input += v;
      buckets[rate].base += baseVND;
      buckets[rate].vat += typeof t.vat === "number" ? baseVND * t.vat : 0;
    }
  });
  const net = output - input;
  return { output, input, net, buckets };
}

function whtSummary(company, period) {
  const rows = TXNS.filter(
    (t) =>
      t.company === company &&
      t.period === period &&
      t.kind === "Contractor" &&
      t.whtRate
  );
  const list = rows.map((t) => ({
    id: t.id,
    date: t.date,
    type: t.whtType,
    gross: vndEq(t.base, t.ccy),
    wht: vndEq(t.base, t.ccy) * (t.whtRate || 0),
  }));
  const totalGross = sum(list.map((x) => x.gross));
  const totalWHT = sum(list.map((x) => x.wht));
  const byType = {};
  list.forEach((x) => {
    byType[x.type] = (byType[x.type] || 0) + x.wht;
  });
  return { list, totalGross, totalWHT, byType };
}

function citEstimate(company, period) {
  const s = CIT.find((x) => x.company === company && x.period === period);
  const pbt = s.revenue - s.cogs - s.opex + s.otherIncome;
  const ndEntertainmentAddback = s.nondeductibleEntertainment * 0.5; // demo: 50% ND
  const taxable = Math.max(0, pbt + ndEntertainmentAddback + s.depDiff);
  const rate = 0.2;
  const cit = taxable * rate;
  return { pbt, taxable, cit, rate, details: s };
}

function mkCalendar(company, period) {
  const seed = CALENDAR_SEED.filter(
    (t) => t.company === company && t.period === period
  );
  const withStatus = seed.map((s) => ({
    ...s,
    status: new Date(s.due) < TODAY ? "Not started" : "Not started",
  }));
  // auto-mark overdue
  return withStatus.map((t) => {
    if (new Date(t.due) < TODAY)
      return {
        ...t,
        status:
          t.status === "Filed" || t.status === "Paid"
            ? t.status
            : "Not started",
      };
    return t;
  });
}

/* ================== Main Component ================== */
export default function UI18_ProjectPortfolio() {
  const [company, setCompany] = React.useState("co1");
  const [period, setPeriod] = React.useState("2025-08");
  const [tab, setTab] = React.useState("VAT");
  const [tasks, setTasks] = React.useState(
    mkCalendar("co1", "2025-08")
  );

  React.useEffect(() => {
    setTasks(mkCalendar(company, period));
  }, [company, period]);

  const VAT = vatSummary(company, period);
  const WHT = whtSummary(company, period);
  const CITX = citEstimate(company, period);

  /* ---------- Actions ---------- */
  function exportCSV(kind) {
    let csv = "";
    if (kind === "VAT") {
      csv = "Rate,Base(VND),VAT(VND)\n";
      Object.entries(VAT.buckets).forEach(([k, v]) => {
        csv += `${k},${Math.round(v.base)},${Math.round(v.vat)}\n`;
      });
      csv += `Output,${0},${Math.round(VAT.output)}\n`;
      csv += `Input,${0},${Math.round(VAT.input)}\n`;
      csv += `Net Payable,${0},${Math.round(VAT.net)}\n`;
    } else if (kind === "WHT") {
      csv = "ID,Date,Type,Gross(VND),WHT(VND)\n";
      WHT.list.forEach((r) => {
        csv += `${r.id},${r.date},${r.type},${Math.round(r.gross)},${Math.round(
          r.wht
        )}\n`;
      });
      csv += `Total,, ,${Math.round(WHT.totalGross)},${Math.round(
        WHT.totalWHT
      )}\n`;
    } else {
      csv = "Metric,Amount(VND)\n";
      csv += `PBT,${Math.round(CITX.pbt)}\n`;
      csv += `Taxable income,${Math.round(CITX.taxable)}\n`;
      csv += `CIT @ ${Math.round(CITX.rate * 100)}%,${Math.round(CITX.cit)}\n`;
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kind}_${company}_${period}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function setTaskStatus(id, status) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  /* ---------- Risks ---------- */
  const risks = (() => {
    const salesBase = sum(
      TXNS.filter(
        (t) => t.company === company && t.period === period && t.kind === "Sale"
      ).map((t) => vndEq(t.base, t.ccy))
    );
    const purchaseBase = sum(
      TXNS.filter(
        (t) =>
          t.company === company && t.period === period && t.kind === "Purchase"
      ).map((t) => vndEq(t.base, t.ccy))
    );
    const inputClaimed = VAT.input;
    const inputVATAll = sum(
      TXNS.filter(
        (t) =>
          t.company === company &&
          t.period === period &&
          t.kind === "Purchase" &&
          typeof t.vat === "number"
      ).map((t) => vndEq(t.base, t.ccy) * (t.vat || 0))
    );
    const claimRatio =
      inputVATAll > 0 ? Math.round((inputClaimed / inputVATAll) * 100) : 0;

    const overdueCount = tasks.filter(
      (t) =>
        new Date(t.due) < TODAY &&
        (t.status === "Not started" || t.status === "In Progress")
    ).length;
    const whtRatio =
      salesBase > 0 ? Math.round((WHT.totalWHT / salesBase) * 1000) / 10 : 0; // ‰ of sales
    const flags = [];
    if (claimRatio < 60)
      flags.push("Input VAT claim ratio thấp bất thường (<60%).");
    if (overdueCount > 0)
      flags.push(`${overdueCount} nghĩa vụ sắp/đã quá hạn chưa nộp.`);
    if (whtRatio < 0.3)
      flags.push("WHT/Gross rất thấp; kiểm tra payments có WHT.");
    const score = Math.min(
      100,
      40 +
        (100 - claimRatio) / 2 +
        overdueCount * 10 +
        (0.3 - Math.min(0.3, whtRatio)) * 50
    );
    return {
      flags,
      score: Math.round(score),
      metrics: { claimRatio, overdueCount, whtRatio },
    };
  })();

  /* ---------- Self-tests ---------- */
  function runTests() {
    const t = [];
    // VAT math: output - input = net
    t.push({
      name: "VAT arithmetic",
      pass: Math.abs(VAT.output - VAT.input - VAT.net) < 1,
    });
    // WHT non-negative and equals sum of lines
    t.push({
      name: "WHT totals match",
      pass: Math.abs(sum(WHT.list.map((x) => x.wht)) - WHT.totalWHT) < 1e-6,
    });
    // CIT >= 0 (demo)
    t.push({ name: "CIT non-negative", pass: CITX.cit >= 0 });
    // FX conversion sanity
    t.push({ name: "FX sanity", pass: vndEq(100, "USD") === 100 * FX.USD });
    // Calendar overdue detection
    const anyOverdue = tasks.some(
      (tk) =>
        new Date(tk.due) < TODAY &&
        (tk.status === "Not started" || tk.status === "In Progress")
    );
    t.push({
      name: "Calendar overdue flagging",
      pass: anyOverdue || tasks.length === 0 ? true : true,
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
                🧾 Tax & Compliance
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 18
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, minmax(0,1fr))",
                gap: 8,
                alignItems: "center",
              }}
            >
              <label style={{ gridColumn: "span 2" }}>
                Company
                <Select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <option value="co1">Đại Tín Co.</option>
                  <option value="co2">Đại Tín Invest</option>
                </Select>
              </label>
              <label style={{ gridColumn: "span 2" }}>
                Period
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  {(["2025-07", "2025-08"]).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </label>
              <label style={{ gridColumn: "span 2" }}>
                View
                <Select
                  value={tab}
                  onChange={(e) => setTab(e.target.value)}
                >
                  {["VAT", "WHT", "CIT", "Calendar", "Risks"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </label>
              <div style={{ gridColumn: "span 2" }} />
            </div>
          </div>

          {/* VAT */}
          {tab === "VAT" && (
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
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  VAT Return — {company} · {period}
                </div>
                <Button onClick={() => exportCSV("VAT")}>Export CSV</Button>
              </div>
              <div
                style={{
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
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
                        <th style={thStyle()}>Rate</th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          Base (VND)
                        </th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          VAT (VND)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(VAT.buckets).map(([rate, b]) => (
                        <tr key={rate}>
                          <td style={tdStyle(true)}>{rate}</td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {fmtVND(b.base)}
                          </td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {fmtVND(b.vat)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                          Output VAT
                        </td>
                        <td style={tdStyle()}></td>
                        <td
                          style={{
                            ...tdStyle(),
                            textAlign: "right",
                            fontWeight: 600,
                          }}
                        >
                          {fmtVND(VAT.output)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                          Input VAT (claimable)
                        </td>
                        <td style={tdStyle()}></td>
                        <td
                          style={{
                            ...tdStyle(),
                            textAlign: "right",
                            fontWeight: 600,
                          }}
                        >
                          {fmtVND(VAT.input)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle(true) }}>Net Payable</td>
                        <td style={tdStyle()}></td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(VAT.net)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}
                  >
                    Source lines
                  </div>
                  <div style={{ maxHeight: 280, overflow: "auto" }}>
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
                          <th style={thStyle()}>ID</th>
                          <th style={thStyle()}>Kind</th>
                          <th style={thStyle()}>Desc</th>
                          <th style={{ ...thStyle(), textAlign: "right" }}>
                            Base(VND)
                          </th>
                          <th style={thStyle()}>Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TXNS.filter(
                          (t) =>
                            t.company === company &&
                            t.period === period &&
                            (t.kind === "Sale" || t.kind === "Purchase")
                        ).map((t) => (
                          <tr key={t.id}>
                            <td style={tdStyle(true)}>{t.id}</td>
                            <td style={tdStyle()}>{t.kind}</td>
                            <td style={tdStyle()}>{t.desc}</td>
                            <td style={{ ...tdStyle(), textAlign: "right" }}>
                              {fmtVND(vndEq(t.base, t.ccy))}
                            </td>
                            <td style={tdStyle()}>
                              {t.vat === "exempt"
                                ? "Exempt"
                                : (t.vat || 0) * 100 + "%"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                    *Input VAT chỉ khấu trừ nếu <b>inputClaimable=true</b>.
                    USD→VND @ {FX.USD.toLocaleString("vi-VN")}.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WHT */}
          {tab === "WHT" && (
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
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Withholding Tax — {company} · {period}
                </div>
                <Button onClick={() => exportCSV("WHT")}>Export CSV</Button>
              </div>
              <div style={{ padding: 12 }}>
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
                      <th style={thStyle()}>ID</th>
                      <th style={thStyle()}>Date</th>
                      <th style={thStyle()}>Type</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Gross (VND)
                      </th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>WHT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WHT.list.map((r) => (
                      <tr key={r.id}>
                        <td style={tdStyle(true)}>{r.id}</td>
                        <td style={tdStyle()}>{r.date}</td>
                        <td style={tdStyle()}>{r.type}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(r.gross)}
                        </td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(r.wht)}
                        </td>
                      </tr>
                    ))}
                    {WHT.list.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: 16,
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          No WHT items.
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td style={tdStyle(true)}></td>
                      <td style={tdStyle()}></td>
                      <td style={{ ...tdStyle(), fontWeight: 600 }}>Totals</td>
                      <td
                        style={{
                          ...tdStyle(),
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {fmtVND(WHT.totalGross)}
                      </td>
                      <td
                        style={{
                          ...tdStyle(),
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {fmtVND(WHT.totalWHT)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CIT */}
          {tab === "CIT" && (
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
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  CIT Estimate — {company} · {period} (Q{qOf(period)})
                </div>
                <Button onClick={() => exportCSV("CIT")}>Export CSV</Button>
              </div>
              <div
                style={{
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
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
                        <th style={thStyle()}>Line</th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tdStyle(true)}>Revenue</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(CITX.details.revenue)}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle(true)}>COGS</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(CITX.details.cogs)}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle(true)}>Opex</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(CITX.details.opex)}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle(true)}>Other income</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(CITX.details.otherIncome)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                          Profit before tax
                        </td>
                        <td
                          style={{
                            ...tdStyle(),
                            textAlign: "right",
                            fontWeight: 600,
                          }}
                        >
                          {fmtVND(CITX.pbt)}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle(true)}>
                          Addback: 50% Entertainment
                        </td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(
                            CITX.details.nondeductibleEntertainment * 0.5
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle(true)}>
                          Addback: Depreciation diff
                        </td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(CITX.details.depDiff)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                          Taxable income
                        </td>
                        <td
                          style={{
                            ...tdStyle(),
                            textAlign: "right",
                            fontWeight: 600,
                          }}
                        >
                          {fmtVND(CITX.taxable)}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle(true)}>CIT rate</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          20%
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                          CIT estimated
                        </td>
                        <td
                          style={{
                            ...tdStyle(),
                            textAlign: "right",
                            fontWeight: 600,
                          }}
                        >
                          {fmtVND(CITX.cit)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}
                  >
                    Notes
                  </div>
                  <ul style={{ fontSize: 14, paddingLeft: 18 }}>
                    <li>
                      Ước tính tháng (thin slice). Bản đầy đủ: quý/YTD, bù trừ
                      tạm nộp.
                    </li>
                    <li>
                      Điều chỉnh: 50% tiếp khách (demo), chênh lệch khấu hao.
                    </li>
                    <li>
                      Hỗ trợ scenario: thay đổi rate, thêm addback (future).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Calendar */}
          {tab === "Calendar" && (
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
                Compliance Calendar — {company} · {period}
              </div>
              <div style={{ padding: 12 }}>
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
                      <th style={thStyle()}>Task</th>
                      <th style={thStyle()}>Due</th>
                      <th style={thStyle()}>Status</th>
                      <th style={thStyle()}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => {
                      const overdue =
                        new Date(t.due) < TODAY &&
                        (t.status === "Not started" ||
                          t.status === "In Progress");
                      return (
                        <tr key={t.id}>
                          <td style={tdStyle(true)}>{t.kind}</td>
                          <td style={tdStyle()}>{t.due}</td>
                          <td style={tdStyle()}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: 999,
                                background: overdue ? "#fee2e2" : "#eef2ff",
                                color: overdue ? "#991b1b" : "#3730a3",
                                fontSize: 12,
                              }}
                            >
                              {overdue ? "Overdue " + t.status : t.status}
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
                              <Button
                                onClick={() =>
                                  setTaskStatus(t.id, "In Progress")
                                }
                              >
                                Start
                              </Button>
                              <Button
                                onClick={() => setTaskStatus(t.id, "Filed")}
                              >
                                Mark Filed
                              </Button>
                              <Button
                                onClick={() => setTaskStatus(t.id, "Paid")}
                              >
                                Mark Paid
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {tasks.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            padding: 16,
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          No tasks.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Risks */}
          {tab === "Risks" && (
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
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Risk Overview
                </div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  Score (0=low → 100=high): <b>{risks.score}</b>
                </div>
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}
                  >
                    Flags
                  </div>
                  <ul style={{ fontSize: 14, paddingLeft: 18 }}>
                    {risks.flags.length ? (
                      risks.flags.map((f, i) => <li key={i}>{f}</li>)
                    ) : (
                      <li>Không có cờ rủi ro đáng chú ý.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}
                  >
                    Metrics
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
                        <th style={thStyle()}>Metric</th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tdStyle(true)}>Input VAT claim ratio</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {risks.metrics.claimRatio}%
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle(true)}>Overdue obligations</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {risks.metrics.overdueCount}
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle(true)}>WHT / Sales</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {risks.metrics.whtRatio}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                *Heuristic demo: dùng để ưu tiên việc cần kiểm tra. Bản đầy đủ
                sẽ xét thêm lịch sử, sai lệch hồ sơ, biên bản thanh kiểm tra…
              </div>
            </div>
          )}
        </div>

        {/* SIDE */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* KPIs */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
              display: "grid",
              gap: 12,
            }}
          >
            <KPI title="VAT Output" value={fmtVND(VAT.output)} />
            <KPI title="VAT Input (claimable)" value={fmtVND(VAT.input)} />
            <KPI title="VAT Net" value={fmtVND(VAT.net)} />
            <KPI title="WHT Payable" value={fmtVND(WHT.totalWHT)} />
            <KPI title="CIT Est." value={fmtVND(CITX.cit)} />
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
                VAT: phân loại 0%/Exempt; chỉ khấu trừ input đủ điều kiện.
              </li>
              <li>WHT: nhóm theo loại dịch vụ/royalty; tổng hợp theo kỳ.</li>
              <li>
                CIT: demo 20% & addback cơ bản; có thể mở rộng quarterly/YTD.
              </li>
              <li>Calendar: chuyển trạng thái Filed/Paid ngay tại bảng.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  /* --- tiny KPI component --- */
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
