import React from "react";

/**
 * UI 16 – Consolidation & Reporting (v2 + PDF Export)
 * - Single-file TSX, no external libs
 * - Paste as `index.tsx`, press Run in Console Canvas
 */

/* ================== Types ================== */








/* ================== Chart of Accounts ================== */
const COA = [
  { id: "1000", name: "Cash", type: "Asset" },
  { id: "1100", name: "Accounts Receivable", type: "Asset" },
  { id: "1200", name: "Prepaid Expenses", type: "Asset" },
  { id: "1300", name: "Due from Affiliate", type: "Asset" },
  { id: "1500", name: "Fixed Assets", type: "Asset" },

  { id: "2000", name: "Accounts Payable", type: "Liability" },
  { id: "2100", name: "Accrued Expenses", type: "Liability" },
  { id: "2300", name: "Due to Affiliate", type: "Liability" },

  { id: "3000", name: "Equity", type: "Equity" },
  { id: "3999", name: "CTA (Translation Adj.)", type: "Equity" },

  { id: "4000", name: "Revenue", type: "Revenue" },
  { id: "5000", name: "COGS", type: "Expense" },
  { id: "5100", name: "Opex", type: "Expense" },
];

/* ================== FX Rates (base) ================== */
const FX_BASE = {
  "2025-07": { USD: { avg: 24900, close: 25100 } },
  "2025-08": { USD: { avg: 25000, close: 25200 } },
};

/* ================== Demo Trial Balances (LC) ================== */
const TB_INIT = [
  // ===== 2025-08 =====
  // co1 (VND)
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "1000",
    bal: 220_000_000,
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "1100",
    bal: 200_000_000,
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "1200",
    bal: 12_000_000,
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "1300",
    bal: 100_000_000,
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "1500",
    bal: 50_000_000,
  },

  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "2000",
    bal: -58_000_000,
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "2100",
    bal: -18_000_000,
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "3000",
    bal: -354_000_000,
  },

  // Revenue split (segment) + IC
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "4000",
    bal: -275_000_000,
    seg: "Retail",
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "4000",
    bal: -25_000_000,
    seg: "Wholesale",
    ic: true,
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "5000",
    bal: 70_000_000,
    seg: "Retail",
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "5100",
    bal: 20_000_000,
    seg: "Wholesale",
  },
  {
    company: "co1",
    period: "2025-08",
    ccy: "VND",
    accId: "5100",
    bal: 20_000_000,
    seg: "Services",
  },

  // co2 (USD)
  { company: "co2", period: "2025-08", ccy: "USD", accId: "1000", bal: 5_000 },
  { company: "co2", period: "2025-08", ccy: "USD", accId: "1100", bal: 4_000 },
  { company: "co2", period: "2025-08", ccy: "USD", accId: "1200", bal: 3_000 },
  { company: "co2", period: "2025-08", ccy: "USD", accId: "1500", bal: 1_800 },

  { company: "co2", period: "2025-08", ccy: "USD", accId: "2300", bal: -4_000 },
  { company: "co2", period: "2025-08", ccy: "USD", accId: "2000", bal: -1_000 },
  { company: "co2", period: "2025-08", ccy: "USD", accId: "2100", bal: -900 },
  { company: "co2", period: "2025-08", ccy: "USD", accId: "3000", bal: -3_000 },

  {
    company: "co2",
    period: "2025-08",
    ccy: "USD",
    accId: "4000",
    bal: -9_000,
    seg: "Services",
  },
  {
    company: "co2",
    period: "2025-08",
    ccy: "USD",
    accId: "5000",
    bal: 3_000,
    seg: "Retail",
  },
  {
    company: "co2",
    period: "2025-08",
    ccy: "USD",
    accId: "5000",
    bal: 1_000,
    seg: "Wholesale",
    ic: true,
  },
  {
    company: "co2",
    period: "2025-08",
    ccy: "USD",
    accId: "5100",
    bal: 2_000,
    seg: "Services",
  },

  // ===== 2025-07 =====
  // co1 (VND)
  {
    company: "co1",
    period: "2025-07",
    ccy: "VND",
    accId: "1000",
    bal: 200_000_000,
  },
  {
    company: "co1",
    period: "2025-07",
    ccy: "VND",
    accId: "1100",
    bal: 150_000_000,
  },
  {
    company: "co1",
    period: "2025-07",
    ccy: "VND",
    accId: "1200",
    bal: 10_000_000,
  },
  {
    company: "co1",
    period: "2025-07",
    ccy: "VND",
    accId: "1500",
    bal: 45_000_000,
  },
  {
    company: "co1",
    period: "2025-07",
    ccy: "VND",
    accId: "3000",
    bal: -250_000_000,
  },
  {
    company: "co1",
    period: "2025-07",
    ccy: "VND",
    accId: "4000",
    bal: -280_000_000,
    seg: "Retail",
  },
  {
    company: "co1",
    period: "2025-07",
    ccy: "VND",
    accId: "5000",
    bal: 100_000_000,
    seg: "Retail",
  },
  {
    company: "co1",
    period: "2025-07",
    ccy: "VND",
    accId: "5100",
    bal: 80_000_000,
    seg: "Services",
  },

  // co2 (USD)
  { company: "co2", period: "2025-07", ccy: "USD", accId: "1000", bal: 4_500 },
  { company: "co2", period: "2025-07", ccy: "USD", accId: "1100", bal: 3_500 },
  { company: "co2", period: "2025-07", ccy: "USD", accId: "1200", bal: 2_100 },
  { company: "co2", period: "2025-07", ccy: "USD", accId: "1500", bal: 1_700 },

  { company: "co2", period: "2025-07", ccy: "USD", accId: "2300", bal: -3_100 },
  { company: "co2", period: "2025-07", ccy: "USD", accId: "2000", bal: -800 },
  { company: "co2", period: "2025-07", ccy: "USD", accId: "3000", bal: -2_700 },

  {
    company: "co2",
    period: "2025-07",
    ccy: "USD",
    accId: "4000",
    bal: -9_000,
    seg: "Services",
  },
  {
    company: "co2",
    period: "2025-07",
    ccy: "USD",
    accId: "5000",
    bal: 3_600,
    seg: "Retail",
  },
  {
    company: "co2",
    period: "2025-07",
    ccy: "USD",
    accId: "5100",
    bal: 1_900,
    seg: "Services",
  },
];

/* ================== Helpers ================== */
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
function fmtVND(x) {
  return Math.round(x).toLocaleString("vi-VN") + " ₫";
}
function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
function accBy(id) {
  return COA.find((a) => a.id === id);
}
function isPL(accId) {
  return accId.startsWith("4") || accId.startsWith("5");
}
function isBS(accId) {
  return (
    accId.startsWith("1") || accId.startsWith("2") || accId.startsWith("3")
  );
}
function isAsset(accId) {
  return accId.startsWith("1");
}
function isLiabEquity(accId) {
  return accId.startsWith("2") || accId.startsWith("3");
}

/* ================== Consolidation Core ================== */
function filterBySeg(rows, seg) {
  return seg === "All"
    ? rows
    : rows.filter((r) => (!isBS(r.accId) ? r.seg === seg : true));
}

function translateRows(
  rows,
  period,
  fxAvg,
  fxClose) {
  const out = [];
  const companies = Array.from(new Set(rows.map((r) => r.company)));
  companies.forEach((c) => {
    const rs = rows.filter((r) => r.company === c);
    const trs = rs.map((r) => {
      const rate = r.ccy === "VND" ? 1 : isPL(r.accId) ? fxAvg : fxClose;
      return { ...r, ccy: "VND", bal: r.bal * rate };
    });
    const total = Math.round(sum(trs.map((t) => t.bal)));
    if (Math.abs(total) !== 0) {
      trs.push({ company: c, period, ccy: "VND", accId: "3999", bal: -total });
    }
    out.push(...trs);
  });
  return out;
}

function groupByAcc(rows) {
  const map = {};
  rows.forEach((r) => {
    map[r.accId] = (map[r.accId] || 0) + r.bal;
  });
  return Object.entries(map).map(([accId, bal]) => ({ accId, bal }));
}

function icEliminateBS(rows) {
  const totals = groupByAcc(rows);
  const a1300 = totals.find((x) => x.accId === "1300")?.bal || 0;
  const l2300 = totals.find((x) => x.accId === "2300")?.bal || 0;
  const elimAmt = Math.min(Math.abs(a1300), Math.abs(l2300));
  if (elimAmt <= 0) return { rows, elim: 0, postNet: Math.abs(a1300 + l2300) };
  const adj = [
    {
      company: "co1",
      period: rows[0].period,
      ccy: "VND",
      accId: "1300",
      bal: -elimAmt,
    },
    {
      company: "co2",
      period: rows[0].period,
      ccy: "VND",
      accId: "2300",
      bal: +elimAmt,
    },
  ];
  const merged = [...rows, ...adj];
  const postTotals = groupByAcc(merged);
  const postNet = Math.abs(
    (postTotals.find((x) => x.accId === "1300")?.bal || 0) +
      (postTotals.find((x) => x.accId === "2300")?.bal || 0)
  );
  return { rows: merged, elim: elimAmt, postNet };
}

function icEliminatePL(rows) {
  const icRows = rows.filter((r) => r.ic && isPL(r.accId));
  if (!icRows.length) return { rows, elim: 0 };
  const rev = -sum(
    icRows.filter((r) => (accBy(r.accId)?.type || "") === "Revenue").map((r) => r.bal)
  );
  const exp = sum(
    icRows.filter((r) => (accBy(r.accId)?.type || "") !== "Revenue").map((r) => r.bal)
  );
  const elimAmt = Math.min(rev, exp);
  if (elimAmt <= 0) return { rows, elim: 0 };
  const p = rows[0].period;
  const adj = [
    { company: "co1", period: p, ccy: "VND", accId: "4000", bal: +elimAmt },
    { company: "co2", period: p, ccy: "VND", accId: "5000", bal: -elimAmt },
  ];
  return { rows: [...rows, ...adj], elim: elimAmt };
}

function consolidate(
  period,
  seg,
  postElim,
  elimPL,
  fxAvg,
  fxClose) {
  const curLC = filterBySeg(
    TB_INIT.filter((r) => r.period === period),
    seg
  );
  const tr = translateRows(curLC, period, fxAvg, fxClose);
  const bs = icEliminateBS(tr);
  let rows = bs.rows;
  let icNet = bs.postNet;
  let elimICPL = 0;
  if (postElim && elimPL) {
    const pl = icEliminatePL(rows);
    rows = pl.rows;
    elimICPL = pl.elim;
  }
  const totals = groupByAcc(rows);
  return { rows, totals, icNet, elimICPL };
}

/* ===== P&L / BS / CF computations ===== */
function plFromTotals(totals) {
  const rev = -sum(
    totals.filter((r) => accBy(r.accId).type === "Revenue").map((r) => r.bal)
  );
  const cogs = sum(totals.filter((r) => r.accId === "5000").map((r) => r.bal));
  const opex = sum(totals.filter((r) => r.accId === "5100").map((r) => r.bal));
  const ebitda = rev - cogs - opex;
  const cta = sum(totals.filter((r) => r.accId === "3999").map((r) => r.bal));
  return { rev, cogs, opex, ebitda, cta };
}
function bsFromTotals(totals) {
  const assets = sum(totals.filter((r) => isAsset(r.accId)).map((r) => r.bal));
  const le = sum(totals.filter((r) => isLiabEquity(r.accId)).map((r) => r.bal));
  const diff = Math.round(assets + le);
  return { assets, le, diff };
}
function cashFromTotals(totals) {
  return totals.find((x) => x.accId === "1000")?.bal || 0;
}

function consolidatedFor(
  period,
  seg,
  postElim,
  elimPL,
  fxAvg,
  fxClose) {
  const c = consolidate(period, seg, postElim, elimPL, fxAvg, fxClose);
  const pl = plFromTotals(c.totals);
  const bs = bsFromTotals(c.totals);
  const cash = cashFromTotals(c.totals);
  return { ...c, pl, bs, cash };
}

/* =============== Minimal PDF generator (no libs) =============== */
// Create a simple multi-page PDF with Helvetica text lines.
function exportSimplePDF(
  filename,
  title,
  subtitle,
  lines) {
  // Split into pages
  const maxLines = 44;
  const pages = [];
  for (let i = 0; i < lines.length; i += maxLines) {
    pages.push(lines.slice(i, i + maxLines));
  }

  // Helpers
  const esc = (s) =>
    s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const objects = [];
  const obj = (id, body) => `${id} 0 obj\n${body}\nendobj\n`;

  // IDs
  const nPages = pages.length || 1;
  const idCatalog = 1;
  const idPages = 2;
  const idPageFirst = 3;
  const idContentFirst = idPageFirst + nPages;
  const idFont = idContentFirst + nPages;
  const nObjs = idFont;

  // Catalog & Pages
  objects.push(obj(idCatalog, `<< /Type /Catalog /Pages ${idPages} 0 R >>`));
  const kids = Array.from(
    { length: nPages },
    (_, i) => `${idPageFirst + i} 0 R`
  ).join(" ");
  objects.push(
    obj(idPages, `<< /Type /Pages /Kids [ ${kids} ] /Count ${nPages} >>`)
  );

  // Content streams & Page objects
  for (let i = 0; i < nPages; i++) {
    const yStart = 770;
    const contentLines = [
      "BT",
      "/F1 12 Tf",
      "14 TL",
      `72 ${yStart} Td`,
      `(${esc(title)}) Tj`,
      "T*",
      `(${esc(subtitle)}) Tj`,
      "T*",
      "(----------------------------------------) Tj",
      "T*",
      ...pages[i].map((s) => `(${esc(s)}) Tj T*`),
      "ET",
    ].join("\n");
    const content = `${idContentFirst + i} 0 obj\n<< /Length ${
      contentLines.length
    } >>\nstream\n${contentLines}\nendstream\nendobj\n`;
    objects.push(content);
    objects.push(
      obj(
        idPageFirst + i,
        `<< /Type /Page /Parent ${idPages} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${idFont} 0 R >> >> /Contents ${
          idContentFirst + i
        } 0 R >>`
      )
    );
  }

  // Font
  objects.push(
    obj(idFont, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`)
  );

  // Assemble with xref
  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [];
  let cursor = header.length;
  for (const o of objects) {
    offsets.push(cursor);
    body += o;
    cursor += o.length;
  }
  const xrefPos = cursor;
  let xref = `xref\n0 ${nObjs + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    xref += `${off.toString().padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer << /Size ${
    nObjs + 1
  } /Root ${idCatalog} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  const pdf = header + body + xref + trailer;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =============== Main Component =============== */
export default function UI16_HRM_CVBuilder() {
  const [period, setPeriod] = React.useState("2025-08");
  const [tab, setTab] = React.useState("P&L");
  const [seg, setSeg] = React.useState("All");
  const [postElim, setPostElim] = React.useState(true);
  const [elimPL, setElimPL] = React.useState(true);
  const [fxAvg, setFxAvg] = React.useState(FX_BASE[period].USD.avg);
  const [fxClose, setFxClose] = React.useState(
    FX_BASE[period].USD.close
  );
  const [drawer, setDrawer] = React.useState(null);

  // KPI Component
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
        <div style={{ marginTop: 4, fontSize: 22, fontWeight: 600 }}>
          {value}
        </div>
        {hint ? (
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
            {hint}
          </div>
        ) : null}
      </div>
    );
  }

  React.useEffect(() => {
    setFxAvg(FX_BASE[period].USD.avg);
    setFxClose(FX_BASE[period].USD.close);
  }, [period]);

  const priorP = period === "2025-08" ? "2025-07" : "2025-08";
  const cur = consolidatedFor(period, seg, postElim, elimPL, fxAvg, fxClose);
  const prev = consolidatedFor(
    priorP,
    seg,
    postElim,
    elimPL,
    FX_BASE[priorP].USD.avg,
    FX_BASE[priorP].USD.close
  );

  const kpiRev = cur.pl.rev;
  const kpiEBITDA = cur.pl.ebitda;
  const kpiEBITDApct = kpiRev > 0 ? Math.round((kpiEBITDA / kpiRev) * 100) : 0;
  const kpiFX = cur.pl.cta;
  const kpiICNet = cur.icNet;
  const kpiAssets = cur.bs.assets;
  const kpiLE = cur.bs.le;
  const kpiDiff = cur.bs.diff;

  // Cash Flow (indirect, simplified)
  const CF = (() => {
    const NI = cur.pl.ebitda;
    function get(totals, id) {
      return totals.find((x) => x.accId === id)?.bal || 0;
    }
    const curT = cur.totals,
      prvT = prev.totals;
    const Δ = (id) => get(curT, id) - get(prvT, id);
    const dAR = Δ("1100"),
      dPre = Δ("1200"),
      dAP = Δ("2000"),
      dAcc = Δ("2100");
    const adjAR = -dAR,
      adjPre = -dPre,
      adjAP = -dAP,
      adjAcc = -dAcc;
    const CFO = NI + adjAR + adjPre + adjAP + adjAcc;
    const dFA = Δ("1500");
    const CFI = -dFA;
    const dEQ = Δ("3000");
    const CFF = dEQ;
    const deltaCash = get(curT, "1000") - get(prvT, "1000");
    const sumCF = CFO + CFI + CFF;
    return { NI, CFO, CFI, CFF, deltaCash, sumCF };
  })();

  function runTests() {
    const t = [];
    t.push({
      name: "Consolidated TB balanced",
      pass: Math.abs(sum(cur.rows.map((r) => r.bal))) < 1,
    });
    t.push({ name: "Assets == Liab+Equity", pass: Math.abs(kpiDiff) < 1 });
    t.push({
      name: "IC net small after elim",
      pass: postElim ? kpiICNet < 1 : true,
    });
    t.push({
      name: "P&L finite",
      pass: [kpiRev, kpiEBITDA].every((x) => Number.isFinite(x)),
    });
    t.push({
      name: "CF sums to ΔCash",
      pass: Math.abs(CF.sumCF - CF.deltaCash) < 1,
    });
    const tmp = consolidatedFor(period, seg, postElim, elimPL, fxAvg + 100, fxClose);
    t.push({ name: "FX override effective", pass: Math.abs(tmp.pl.rev - cur.pl.rev) > 0 });
    const passCount = t.filter((x) => x.pass).length;
    alert(
      `${passCount}/${t.length} PASS\n` + t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n")
    );
  }

  function openBreakdown(accId, title) {
    const tr = translateRows(
      filterBySeg(
        TB_INIT.filter((r) => r.period === period),
        seg
      ),
      period,
      fxAvg,
      fxClose
    );
    const comp = ["co1", "co2"];
    const rows = comp.map((c) => {
      const total = sum(
        tr.filter((r) => r.company === c && r.accId === accId).map((r) => r.bal)
      );
      const bySeg = {};
      (["Retail", "Wholesale", "Services"]).forEach((s) => {
        bySeg[s] = sum(
          tr
            .filter((r) => r.company === c && r.accId === accId && r.seg === s)
            .map((r) => r.bal)
        );
      });
      return { company: c, total, bySeg };
    });
    setDrawer({
      title,
      body: (
        <div>
          {rows.map((r, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div>
                <b>{r.company}</b> · {fmtVND(r.total)}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                Retail {fmtVND(r.bySeg["Retail"] || 0)} · Wholesale{" "}
                {fmtVND(r.bySeg["Wholesale"] || 0)} · Services{" "}
                {fmtVND(r.bySeg["Services"] || 0)}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
            *Breakdown đã translate & có CTA; xem “Post-Elim” để thấy số sau
            loại trừ.
          </div>
        </div>
      ),
    });
  }

  function exportCSV(kind) {
    let csv = "Line,Amount(VND)\n";
    if (kind === "P&L") {
      csv += `Revenue,${Math.round(cur.pl.rev)}\n`;
      csv += `COGS,${-Math.round(cur.pl.cogs)}\n`;
      csv += `Opex,${-Math.round(cur.pl.opex)}\n`;
      csv += `EBITDA,${Math.round(cur.pl.ebitda)}\n`;
      csv += `CTA,${Math.round(cur.pl.cta)}\n`;
      if (postElim && elimPL)
        csv += `Elim P&L IC,${-Math.round(cur.elimICPL)}\n`;
    } else if (kind === "BS") {
      csv = "Account,Amount(VND)\n";
      cur.totals.forEach((r) => {
        const name = accBy(r.accId)?.name || "";
        csv += `${r.accId} ${name},${Math.round(r.bal)}\n`;
      });
      csv += `Total Assets,${Math.round(cur.bs.assets)}\n`;
      csv += `Total L+E,${Math.round(cur.bs.le)}\n`;
      csv += `Delta(should=0),${Math.round(cur.bs.diff)}\n`;
    } else {
      csv = "Section,Amount(VND)\n";
      csv += `Net Income,${Math.round(CF.NI)}\n`;
      csv += `CFO,${Math.round(CF.CFO)}\n`;
      csv += `CFI,${Math.round(CF.CFI)}\n`;
      csv += `CFF,${Math.round(CF.CFF)}\n`;
      csv += `Sum CF,${Math.round(CF.sumCF)}\n`;
      csv += `ΔCash,${Math.round(CF.deltaCash)}\n`;
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kind.replace(/\s+/g, "_")}_${period}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // NEW: Export PDF button logic
  function exportPDF(kind) {
    const title = `Consolidation Report — ${kind}`;
    const subtitle = `Period ${period} · View=${
      postElim ? "Post-Elim" : "Pre-Elim"
    } · Seg=${seg} · FX(avg=${fxAvg.toLocaleString(
      "vi-VN"
    )}, close=${fxClose.toLocaleString("vi-VN")})`;
    let lines = [];
    if (kind === "P&L") {
      lines = [
        `Revenue: ${fmtVND(cur.pl.rev)}`,
        `COGS: ${fmtVND(-cur.pl.cogs)}`,
        `Opex: ${fmtVND(-cur.pl.opex)}`,
        `EBITDA: ${fmtVND(cur.pl.ebitda)}`,
        `CTA: ${fmtVND(cur.pl.cta)}`,
      ];
      if (postElim && elimPL) lines.push(`Elim P&L IC: ${fmtVND(-cur.elimICPL)}`);
    } else if (kind === "BS") {
      lines = ["Assets / Liabilities & Equity"];
      // Limit to keep sample concise
      const sorted = [...cur.totals].sort((a, b) =>
        a.accId.localeCompare(b.accId)
      );
      sorted.forEach((r) =>
        lines.push(`${r.accId} ${accBy(r.accId)?.name || ""}: ${fmtVND(r.bal)}`)
      );
      lines.push("—");
      lines.push(`Total Assets: ${fmtVND(cur.bs.assets)}`);
      lines.push(`Total L+E: ${fmtVND(cur.bs.le)}`);
      lines.push(`Δ (should be 0): ${fmtVND(cur.bs.diff)}`);
    } else {
      lines = [
        `Net Income (≈ EBITDA): ${fmtVND(CF.NI)}`,
        `CFO: ${fmtVND(CF.CFO)}`,
        `CFI: ${fmtVND(CF.CFI)}`,
        `CFF: ${fmtVND(CF.CFF)}`,
        `Sum CF: ${fmtVND(CF.sumCF)}`,
        `ΔCash: ${fmtVND(CF.deltaCash)}`,
      ];
    }
    exportSimplePDF(
      `${kind.replace(/\s+/g, "_")}_${period}.pdf`,
      title,
      subtitle,
      lines
    );
  }

  // Variance
  const priorPeriod = period === "2025-08" ? "2025-07" : "2025-08";
  const varData = [
    { key: "Revenue", delta: cur.pl.rev - prev.pl.rev },
    { key: "COGS", delta: -(cur.pl.cogs - prev.pl.cogs) },
    { key: "Opex", delta: -(cur.pl.opex - prev.pl.opex) },
  ];
  const varTotal = sum(varData.map((d) => d.delta));

  // CTA roll-forward — optional view (no PDF export button here)
  function ctaRollForward(period, fxAvg, fxClose) {
    const prior = period === "2025-08" ? "2025-07" : "2025-08";
    const make = (p) =>
      translateRows(
        TB_INIT.filter((r) => r.period === p),
        p,
        p === period ? fxAvg : FX_BASE[p].USD.avg,
        p === period ? fxClose : FX_BASE[p].USD.close
      );
    const curTR = make(period),
      prvTR = make(prior);
    const comp = ["co1", "co2"];
    const rows = comp.map((c) => {
      const curCTA = sum(
        curTR
          .filter((r) => r.company === c && r.accId === "3999")
          .map((r) => r.bal)
      );
      const prvCTA = sum(
        prvTR
          .filter((r) => r.company === c && r.accId === "3999")
          .map((r) => r.bal)
      );
      return {
        company: c,
        begin: prvCTA,
        movement: curCTA - prvCTA,
        end: curCTA,
      };
    });
    return { rows, prior };
  }
  const CTA = ctaRollForward(period, fxAvg, fxClose);

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
                📊 Consolidation & Reporting
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 16 · v2 + PDF
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
          {/* Controls */}
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
                gridTemplateColumns: "repeat(10, minmax(0,1fr))",
                gap: 8,
                alignItems: "center",
              }}
            >
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
                Report
                <Select
                  value={tab}
                  onChange={(e) => setTab(e.target.value)}
                >
                  {[
                    "P&L",
                    "BS",
                    "CF",
                    "Variance",
                    "By Company",
                    "CTA Roll-forward",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </label>
              <label style={{ gridColumn: "span 2" }}>
                Segment
                <Select
                  value={seg}
                  onChange={(e) => setSeg(e.target.value)}
                >
                  {["All", "Retail", "Wholesale", "Services"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </label>
              <label style={{ gridColumn: "span 2" }}>
                View
                <Select
                  value={postElim ? "Post-Elim" : "Pre-Elim"}
                  onChange={(e) => setPostElim(e.target.value === "Post-Elim")}
                >
                  {["Post-Elim", "Pre-Elim"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </label>
              <label style={{ gridColumn: "span 2" }}>
                Elim P&L IC
                <Select
                  value={elimPL ? "Yes" : "No"}
                  onChange={(e) => setElimPL(e.target.value === "Yes")}
                >
                  {["Yes", "No"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
          </div>

          {/* KPIs */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(8, minmax(0,1fr))",
            }}
          >
            <KPI
              title="Revenue (grp)"
              value={fmtVND(kpiRev)}
              hint={`seg=${seg}`}
            />
            <KPI title="EBITDA" value={fmtVND(kpiEBITDA)} />
            <KPI title="EBITDA %" value={`${kpiEBITDApct}%`} />
            <KPI title="FX Impact (CTA)" value={fmtVND(kpiFX)} />
            <KPI
              title="IC Net (BS)"
              value={fmtVND(kpiICNet)}
              hint={postElim ? "after elim" : "pre-elim"}
            />
            <KPI title="Assets" value={fmtVND(kpiAssets)} />
            <KPI title="Liab+Equity" value={fmtVND(kpiLE)} />
            <KPI title="Δ" value={fmtVND(kpiDiff)} hint="should be 0" />
          </div>

          {/* Reports */}
          {tab === "P&L" && (
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
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Consolidated P&amp;L (VND)
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={() => exportCSV("P&L")}>Export CSV</Button>
                  <Button onClick={() => exportPDF("P&L")} variant="solid">
                    Export PDF
                  </Button>
                </div>
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
                    <th style={thStyle()}>Line</th>
                    <th style={{ ...thStyle(), textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <Row
                    name="Revenue"
                    amt={cur.pl.rev}
                    onClick={() => openBreakdown("4000", "Revenue breakdown")}
                  />
                  <Row
                    name="COGS"
                    amt={-cur.pl.cogs}
                    onClick={() => openBreakdown("5000", "COGS breakdown")}
                  />
                  <Row
                    name="Opex"
                    amt={-cur.pl.opex}
                    onClick={() => openBreakdown("5100", "Opex breakdown")}
                  />
                  <tr>
                    <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                      EBITDA
                    </td>
                    <td
                      style={{
                        ...tdStyle(),
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {fmtVND(cur.pl.ebitda)}
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle(true)}>CTA</td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {fmtVND(cur.pl.cta)}
                    </td>
                  </tr>
                  {postElim && elimPL && (
                    <tr>
                      <td style={tdStyle(true)}>Elim P&L IC</td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(-cur.elimICPL)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === "BS" && (
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
                  borderBottom: "1px solid #e5e5e5",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Consolidated Balance Sheet (VND)
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={() => exportCSV("BS")}>Export CSV</Button>
                  <Button onClick={() => exportPDF("BS")} variant="solid">
                    Export PDF
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0,
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
                        <th style={thStyle()}>Assets</th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cur.totals
                        .filter((r) => isAsset(r.accId))
                        .map((r) => (
                          <tr
                            key={r.accId}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              openBreakdown(
                                r.accId,
                                `${r.accId} · ${accBy(r.accId).name}`
                              )
                            }
                          >
                            <td style={tdStyle(true)}>
                              {r.accId} · {accBy(r.accId).name}
                            </td>
                            <td style={{ ...tdStyle(), textAlign: "right" }}>
                              {fmtVND(r.bal)}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                          Total Assets
                        </td>
                        <td
                          style={{
                            ...tdStyle(),
                            textAlign: "right",
                            fontWeight: 600,
                          }}
                        >
                          {fmtVND(cur.bs.assets)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
                        <th style={thStyle()}>Liabilities & Equity</th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cur.totals
                        .filter((r) => isLiabEquity(r.accId))
                        .map((r) => (
                          <tr
                            key={r.accId}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              openBreakdown(
                                r.accId,
                                `${r.accId} · ${accBy(r.accId).name}`
                              )
                            }
                          >
                            <td style={tdStyle(true)}>
                              {r.accId} · {accBy(r.accId).name}
                            </td>
                            <td style={{ ...tdStyle(), textAlign: "right" }}>
                              {fmtVND(r.bal)}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                          Total L+E
                        </td>
                        <td
                          style={{
                            ...tdStyle(),
                            textAlign: "right",
                            fontWeight: 600,
                          }}
                        >
                          {fmtVND(cur.bs.le)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ padding: 12, fontSize: 13, color: "#6b7280" }}>
                Check: Assets − (L+E) = {fmtVND(cur.bs.diff)} (mong đợi 0)
              </div>
            </div>
          )}

          {tab === "CF" && (
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
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  Cash Flow (Indirect, VND)
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={() => exportCSV("CF")}>Export CSV</Button>
                  <Button onClick={() => exportPDF("CF")} variant="solid">
                    Export PDF
                  </Button>
                </div>
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
                    <th style={thStyle()}>Section</th>
                    <th style={{ ...thStyle(), textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <Row name="Net Income (≈ EBITDA)" amt={CF.NI} />
                  <Row name="Cash from Operations (CFO)" amt={CF.CFO} />
                  <Row name="Cash from Investing (CFI)" amt={CF.CFI} />
                  <Row name="Cash from Financing (CFF)" amt={CF.CFF} />
                  <tr>
                    <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                      Sum CF
                    </td>
                    <td
                      style={{
                        ...tdStyle(),
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {fmtVND(CF.sumCF)}
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle(true)}>ΔCash check</td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {fmtVND(CF.deltaCash)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                CFO = NI + (−ΔAR) + (−ΔPrepaid) + (−ΔAP) + (−ΔAccrued); CFI =
                −ΔFA; CFF = ΔEquity. Kiểm tra Sum CF ≈ ΔCash.
              </div>
            </div>
          )}

          {tab === "Variance" && (
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 16,
                background: "#fff",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                Variance vs Prior ({priorPeriod} → {period})
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
                    <th style={thStyle()}>Item</th>
                    <th style={{ ...thStyle(), textAlign: "right" }}>
                      Δ Amount
                    </th>
                    <th style={thStyle()}>Waterfall</th>
                  </tr>
                </thead>
                <tbody>
                  {varData.map((v) => (
                    <tr key={v.key}>
                      <td style={tdStyle(true)}>{v.key}</td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(v.delta)}
                      </td>
                      <td style={tdStyle()}>
                        <div
                          style={{
                            height: 12,
                            background: "#f3f4f6",
                            borderRadius: 999,
                            width: 260,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width:
                                Math.min(
                                  100,
                                  (Math.abs(v.delta) /
                                    (Math.abs(varTotal) || 1)) *
                                    100
                                ) + "%",
                              borderRadius: 999,
                              background: v.delta >= 0 ? "#93c5fd" : "#fecaca",
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ ...tdStyle(true), fontWeight: 600 }}>
                      Total impact
                    </td>
                    <td
                      style={{
                        ...tdStyle(),
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {fmtVND(varTotal)}
                    </td>
                    <td style={tdStyle()} />
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {tab === "By Company" && (
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
                P&amp;L by Company (translated{" "}
                {postElim ? "post-elim" : "pre-elim"})
              </div>
              {(() => {
                const byCo = {
                  co1: { rev: 0, cogs: 0, opex: 0, ebitda: 0 },
                  co2: { rev: 0, cogs: 0, opex: 0, ebitda: 0 },
                };
                (["co1", "co2"]).forEach((c) => {
                  const totals = groupByAcc(
                    cur.rows.filter((r) => r.company === c)
                  );
                  const pl = plFromTotals(totals);
                  byCo[c] = {
                    rev: pl.rev,
                    cogs: pl.cogs,
                    opex: pl.opex,
                    ebitda: pl.ebitda,
                  };
                });
                return (
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
                        <th style={thStyle()}>Company</th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          Revenue
                        </th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          COGS
                        </th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          Opex
                        </th>
                        <th style={{ ...thStyle(), textAlign: "right" }}>
                          EBITDA
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(["co1", "co2"]).map((c) => (
                        <tr key={c}>
                          <td style={tdStyle(true)}>{c}</td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {fmtVND(byCo[c].rev)}
                          </td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {fmtVND(byCo[c].cogs)}
                          </td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {fmtVND(byCo[c].opex)}
                          </td>
                          <td
                            style={{
                              ...tdStyle(),
                              textAlign: "right",
                              fontWeight: 600,
                            }}
                          >
                            {fmtVND(byCo[c].ebitda)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          )}

          {tab === "CTA Roll-forward" && (
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 16,
                background: "#fff",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                CTA Roll-forward (OCI) — {CTA.prior} → {period}
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
                    <th style={thStyle()}>Company</th>
                    <th style={{ ...thStyle(), textAlign: "right" }}>Begin</th>
                    <th style={{ ...thStyle(), textAlign: "right" }}>
                      Movement
                    </th>
                    <th style={{ ...thStyle(), textAlign: "right" }}>End</th>
                  </tr>
                </thead>
                <tbody>
                  {CTA.rows.map((r) => (
                    <tr key={r.company}>
                      <td style={tdStyle(true)}>{r.company}</td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(r.begin)}
                      </td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(r.movement)}
                      </td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(r.end)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                CTA phát sinh do chênh lệch Avg vs Close khi translate; đây là
                dòng OCI.
              </div>
            </div>
          )}
        </div>

        {/* Side: FX override + Guidance */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* FX override */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              FX Override (USD→VND) · {period}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <label>
                Avg
                <Input
                  type="number"
                  value={fxAvg}
                  onChange={(e) => setFxAvg(Number(e.target.value || 0))}
                />
              </label>
              <label>
                Close
                <Input
                  type="number"
                  value={fxClose}
                  onChange={(e) => setFxClose(Number(e.target.value || 0))}
                />
              </label>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
              P&L dùng Avg, B/S dùng Close. Thay đổi ở đây áp ngay cho kỳ hiện
              tại.
            </div>
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
                <b>Segment</b> áp cho P&L; B/S không segment.
              </li>
              <li>
                <b>Post-Elim</b> bật loại trừ IC B/S; tùy chọn thêm loại trừ{" "}
                <b>P&L IC</b>.
              </li>
              <li>
                <b>CF (Indirect)</b>: kiểm tra Sum CF ~ ΔCash để đảm bảo nhất
                quán.
              </li>
              <li>
                <b>PDF Export</b>: bản PDF text-based tối giản (Helvetica), phù
                hợp ký lưu trữ nhanh.
              </li>
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

  /* ---- tiny row & KPI ---- */
  function Row({
    name,
    amt,
    onClick,
  }) {
    return (
      <tr style={{ cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
        <td style={tdStyle(true)}>{name}</td>
        <td style={{ ...tdStyle(), textAlign: "right" }}>{fmtVND(amt)}</td>
      </tr>
    );
  }
}
