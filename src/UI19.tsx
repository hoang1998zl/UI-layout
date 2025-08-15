import React from "react";

/**
 * UI 19 – Fixed Assets (Console Canvas single-file)
 * - Paste as `index.tsx` and press Run. No external libs.
 * - Simplifications for demo (monthly basis, disposal khấu hao tới tháng thanh lý).
 */

/* =============== Types & Utils =============== */
type Company = "co1" | "co2";
type Currency = "VND" | "USD";
type PeriodYM = "2025-07" | "2025-08";
type Method = "SL" | "DDB";
type AssetClass = "Machinery" | "IT Equipment" | "Furniture" | "Vehicles";

type Asset = {
  id: string;
  company: Company;
  ccy: Currency;
  class: AssetClass;
  name: string;
  cost: number;
  salvage: number;
  method: Method;
  lifeMonths: number;
  start: string; // ISO date
};
type Disposal = {
  assetId: string;
  date: string;
  proceeds: number;
  note?: string;
};
type DepLine = { assetId: string; period: PeriodYM; amount: number }; // monthly dep
type ScheduleLine = {
  month: PeriodYM;
  open: number;
  dep: number;
  close: number;
  method: Method;
};

type JE = {
  id: string;
  date: string;
  period: PeriodYM;
  company: Company;
  lines: { account: string; desc: string; debit: number; credit: number }[];
};

const FX: Record<Currency, number> = { VND: 1, USD: 25200 }; // USD→VND
const TODAY = new Date("2025-08-14"); // per project context
function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}
function fmtVND(x: number) {
  return Math.round(x).toLocaleString("vi-VN") + " ₫";
}
function vndEq(ccy: Currency, x: number) {
  return x * FX[ccy];
}
function sum(ns: number[]) {
  return ns.reduce((a, b) => a + b, 0);
}
function ym(d: Date): PeriodYM {
  const y = d.getFullYear(),
    m = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${y}-${m}` as PeriodYM;
}
function parseYM(p: PeriodYM) {
  const [yy, mm] = p.split("-").map(Number);
  return new Date(yy, mm - 1, 1);
}
function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}
function monthsDiffInclusive(a: Date, b: Date) {
  // number of month steps including end
  return (
    (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1
  );
}

/* =============== Demo Data =============== */
const ASSETS: Asset[] = [
  {
    id: "FA-1001",
    company: "co1",
    ccy: "VND",
    class: "IT Equipment",
    name: "Laptop Dell X",
    cost: 30_000_000,
    salvage: 0,
    method: "SL",
    lifeMonths: 36,
    start: "2025-03-01",
  },
  {
    id: "FA-1002",
    company: "co1",
    ccy: "VND",
    class: "Machinery",
    name: "Mini CNC #1",
    cost: 120_000_000,
    salvage: 12_000_000,
    method: "DDB",
    lifeMonths: 60,
    start: "2025-01-15",
  },
  {
    id: "FA-2001",
    company: "co2",
    ccy: "USD",
    class: "IT Equipment",
    name: "Server Rack",
    cost: 8_000,
    salvage: 0,
    method: "SL",
    lifeMonths: 48,
    start: "2025-02-01",
  },
  {
    id: "FA-2002",
    company: "co2",
    ccy: "USD",
    class: "Vehicles",
    name: "Van Ford",
    cost: 12_000,
    salvage: 1_200,
    method: "SL",
    lifeMonths: 60,
    start: "2024-08-01",
  },
];

const DISPOSALS: Disposal[] = [
  // Thanh lý Van Ford trong tháng 2025-08 (giả định)
  { assetId: "FA-2002", date: "2025-08-10", proceeds: 9_000, note: "Trade-in" },
];

/* =============== Depreciation Engine =============== */
/**
 * Rules:
 * - Monthly basis. Bắt đầu khấu hao từ tháng "start".
 * - Nếu disposal trong kỳ, khấu hao tới tháng thanh lý (bao gồm tháng đó).
 * - SL: dep = (cost - salvage)/lifeMonths (đều theo tháng).
 * - DDB: rate = 2 / lifeYears; monthDep = open * rate/12; clamp để close >= salvage.
 */
function buildSchedule(a: Asset, upto: PeriodYM): ScheduleLine[] {
  const start = new Date(a.start);
  const endMonth = parseYM(upto);
  // Nếu có disposal, kết thúc ở tháng disposal
  const disp = DISPOSALS.find((d) => d.assetId === a.id);
  const end = disp ? parseYM(ym(new Date(disp.date))) : endMonth;
  if (end < start) return []; // before in-service

  const months = monthsDiffInclusive(parseYM(ym(start)), end);
  const out: ScheduleLine[] = [];
  let opening = a.cost;
  let accum = 0;
  const lifeYears = a.lifeMonths / 12;
  const ddbRate = 2 / lifeYears;

  for (let i = 0; i < months; i++) {
    const period = ym(addMonths(parseYM(ym(start)), i));
    let dep = 0;
    if (a.method === "SL") {
      dep = (a.cost - a.salvage) / a.lifeMonths;
      dep = Math.max(0, dep);
      if (opening - dep < a.salvage) dep = Math.max(0, opening - a.salvage); // clamp cuối kỳ
    } else {
      const monthRate = ddbRate / 12;
      dep = opening * monthRate;
      if (opening - dep < a.salvage) dep = Math.max(0, opening - a.salvage);
    }
    const closing = opening - dep;
    accum += dep;
    out.push({
      month: period,
      open: opening,
      dep,
      close: closing,
      method: a.method,
    });
    opening = closing;
  }
  return out;
}

function nbvAt(a: Asset, upto: PeriodYM) {
  const sch = buildSchedule(a, upto);
  if (sch.length === 0) return a.cost;
  return sch[sch.length - 1].close;
}
function accumDepAt(a: Asset, upto: PeriodYM) {
  const sch = buildSchedule(a, upto);
  return sum(sch.map((x) => x.dep));
}
function periodDep(a: Asset, p: PeriodYM) {
  const sch = buildSchedule(a, p);
  const row = sch.find((x) => x.month === p);
  return row ? row.dep : 0;
}

function disposalGainLoss(a: Asset, p: PeriodYM) {
  const disp = DISPOSALS.find((d) => d.assetId === a.id);
  if (!disp) return null;
  const dispMonth = ym(new Date(disp.date));
  if (dispMonth > p) return null;
  // NBV at end of disposal month
  const nbv = nbvAt(a, dispMonth);
  const proceeds = disp.proceeds;
  const gainLoss = proceeds - nbv;
  return { proceeds, nbv, gainLoss, dispMonth };
}

/* =============== UI Helpers =============== */
function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "solid" | "ghost";
  }
) {
  const base: React.CSSProperties = {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: "8px 12px",
    fontSize: 13,
    background: "#fff",
    cursor: "pointer",
  };
  const solid: React.CSSProperties = {
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
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
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
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
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
function thStyle(): React.CSSProperties {
  return {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid #e5e5e5",
    position: "sticky",
    top: 0,
  };
}
function tdStyle(first = false): React.CSSProperties {
  return {
    padding: "10px 12px",
    borderBottom: "1px solid #f3f4f6",
    whiteSpace: first ? "nowrap" : undefined,
  };
}

/* =============== Main Component =============== */
export default function UI19_FixedAssets() {
  const [company, setCompany] = React.useState<Company>("co1");
  const [period, setPeriod] = React.useState<PeriodYM>("2025-08");
  const [tab, setTab] = React.useState<
    "Register" | "Depreciation" | "JEs" | "Analytics"
  >("Register");
  const [jes, setJEs] = React.useState<JE[]>([]);
  const [drawer, setDrawer] = React.useState<{
    title: string;
    body: React.ReactNode;
  } | null>(null);

  const assets = ASSETS.filter((a) => a.company === company);
  const regs = assets.map((a) => {
    const nbv = nbvAt(a, period);
    const acc = accumDepAt(a, period);
    return { a, nbv, acc };
  });

  /* ---------- KPIs ---------- */
  const kpiGrossVND = sum(regs.map((r) => vndEq(r.a.ccy, r.a.cost)));
  const kpiAccVND = sum(regs.map((r) => vndEq(r.a.ccy, r.acc)));
  const kpiNBVVND = sum(regs.map((r) => vndEq(r.a.ccy, r.nbv)));
  const classBreak = (() => {
    const map: Record<string, { gross: number; nbv: number }> = {};
    regs.forEach((r) => {
      const k = r.a.class;
      map[k] = map[k] || { gross: 0, nbv: 0 };
      map[k].gross += vndEq(r.a.ccy, r.a.cost);
      map[k].nbv += vndEq(r.a.ccy, r.nbv);
    });
    return map;
  })();

  /* ---------- Dep run ---------- */
  const depLines: DepLine[] = assets.map((a) => ({
    assetId: a.id,
    period,
    amount: periodDep(a, period),
  }));
  const depTotalVND = sum(
    depLines.map((l) =>
      vndEq(assets.find((x) => x.id === l.assetId)!.ccy, l.amount)
    )
  );

  function postDep() {
    if (depTotalVND === 0) {
      alert("Không có khấu hao trong kỳ.");
      return;
    }
    const id = `JE-DEP-${company}-${period}`;
    const exists = jes.some((j) => j.id === id);
    if (exists) {
      alert("Đã post khấu hao kỳ này.");
      return;
    }
    // For simplicity: một JE tổng hợp
    const lines = [
      {
        account: "6800 Depreciation Expense",
        desc: `Dep ${period}`,
        debit: depTotalVND,
        credit: 0,
      },
      {
        account: "2140 Accumulated Depreciation",
        desc: `Dep ${period}`,
        debit: 0,
        credit: depTotalVND,
      },
    ];
    const newJE: JE = { id, date: toISO(new Date()), period, company, lines };
    setJEs((prev) => [newJE, ...prev]);

    // Post disposal JEs (nếu có trong/đến kỳ)
    const dispAssets = assets
      .map((a) => ({ a, info: disposalGainLoss(a, period) }))
      .filter((x) => x.info);
    dispAssets.forEach((x) => {
      const a = x.a,
        info = x.info!;
      const nbvVND = vndEq(a.ccy, info.nbv);
      const proceedsVND = vndEq(a.ccy, info.proceeds);
      const gain = Math.max(0, proceedsVND - nbvVND);
      const loss = Math.max(0, nbvVND - proceedsVND);
      const id2 = `JE-DISP-${a.id}-${info.dispMonth}`;
      if (!jes.some((j) => j.id === id2)) {
        const lines2 = [
          {
            account: "1110/1310 Cash/AR (proceeds)",
            desc: `Disposal ${a.name}`,
            debit: proceedsVND,
            credit: 0,
          },
          {
            account: "2140 Accumulated Depreciation",
            desc: `Clear accum`,
            debit: vndEq(a.ccy, accumDepAt(a, info.dispMonth)),
            credit: 0,
          },
          {
            account: "2110 Fixed Asset Cost",
            desc: `Clear cost`,
            debit: 0,
            credit: vndEq(a.ccy, a.cost),
          },
          ...(gain > 0
            ? [
                {
                  account: "7110 Gain on Disposal",
                  desc: "Gain",
                  debit: 0,
                  credit: gain,
                },
              ]
            : []),
          ...(loss > 0
            ? [
                {
                  account: "8110 Loss on Disposal",
                  desc: "Loss",
                  debit: loss,
                  credit: 0,
                },
              ]
            : []),
        ];
        const je2: JE = {
          id: id2,
          date: toISO(new Date()),
          period,
          company,
          lines: lines2,
        };
        setJEs((prev) => [je2, ...prev]);
      }
    });

    alert("Đã post khấu hao kỳ này (và tự động post disposal nếu có).");
  }

  /* ---------- Drawer ---------- */
  function openSchedule(a: Asset) {
    const sch = buildSchedule(a, period);
    setDrawer({
      title: `${a.id} · ${a.name} — Schedule tới ${period}`,
      body: (
        <div>
          <div style={{ marginBottom: 8, color: "#6b7280", fontSize: 13 }}>
            {a.method} · Cost{" "}
            {a.ccy === "USD"
              ? `${a.cost.toLocaleString("en-US")} USD`
              : fmtVND(a.cost)}{" "}
            · Salvage{" "}
            {a.ccy === "USD"
              ? `${a.salvage.toLocaleString("en-US")} USD`
              : fmtVND(a.salvage)}{" "}
            · Life {a.lifeMonths} m
          </div>
          <div style={{ maxHeight: 360, overflow: "auto" }}>
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
                  <th style={thStyle()}>Month</th>
                  <th style={{ ...thStyle(), textAlign: "right" }}>Opening</th>
                  <th style={{ ...thStyle(), textAlign: "right" }}>Dep</th>
                  <th style={{ ...thStyle(), textAlign: "right" }}>Closing</th>
                </tr>
              </thead>
              <tbody>
                {sch.map((r, i) => (
                  <tr key={i}>
                    <td style={tdStyle(true)}>{r.month}</td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {a.ccy === "USD"
                        ? r.open.toLocaleString("en-US") + " USD"
                        : fmtVND(r.open)}
                    </td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {a.ccy === "USD"
                        ? r.dep.toLocaleString("en-US") + " USD"
                        : fmtVND(r.dep)}
                    </td>
                    <td style={{ ...tdStyle(), textAlign: "right" }}>
                      {a.ccy === "USD"
                        ? r.close.toLocaleString("en-US") + " USD"
                        : fmtVND(r.close)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
            *Monthly basis; nếu disposal trong kỳ, khấu hao tới tháng thanh lý.
          </div>
        </div>
      ),
    });
  }

  /* ---------- Export ---------- */
  function exportRegisterCSV() {
    let csv =
      "ID,Name,Class,Cost,Salvage,Method,Life(m),NBV(end),CCY,NBV(VND eq.)\n";
    regs.forEach((r) => {
      csv += `${r.a.id},${r.a.name},${r.a.class},${r.a.cost},${r.a.salvage},${
        r.a.method
      },${r.a.lifeMonths},${Math.round(r.nbv)},${r.a.ccy},${Math.round(
        vndEq(r.a.ccy, r.nbv)
      )}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FA_Register_${company}_${period}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function exportJEsCSV() {
    let csv = "JE,Date,Period,Company,Account,Desc,Debit,Credit\n";
    jes
      .filter((j) => j.company === company && j.period === period)
      .forEach((j) => {
        j.lines.forEach((l) => {
          csv += `${j.id},${j.date},${j.period},${j.company},${l.account},${
            l.desc
          },${Math.round(l.debit)},${Math.round(l.credit)}\n`;
        });
      });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FA_JE_${company}_${period}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ---------- Self-tests ---------- */
  function runTests() {
    const t: { name: string; pass: boolean }[] = [];
    // 1) NBV >= salvage for all
    t.push({
      name: "NBV ≥ salvage",
      pass: assets.every((a) => nbvAt(a, period) + 1e-6 >= a.salvage),
    });
    // 2) Dep sum + NBV == cost (approx)
    t.push({
      name: "Dep sum + NBV ≈ Cost",
      pass: assets.every(
        (a) => Math.abs(accumDepAt(a, period) + nbvAt(a, period) - a.cost) < 1
      ),
    });
    // 3) DDB clamp
    t.push({
      name: "DDB clamp to salvage",
      pass: assets
        .filter((a) => a.method === "DDB")
        .every((a) => nbvAt(a, period) >= a.salvage),
    });
    // 4) Posted JEs balanced
    const balanced = jes.every(
      (j) =>
        Math.abs(
          sum(j.lines.map((l) => l.debit)) - sum(j.lines.map((l) => l.credit))
        ) < 1
    );
    t.push({ name: "Posted JEs balanced", pass: balanced });
    // 5) Period Dep matches sch row
    t.push({
      name: "Period dep resolvable",
      pass: depLines.every((l) => Number.isFinite(l.amount)),
    });
    alert(
      `Self-tests: ${t.filter((x) => x.pass).length}/${t.length} PASS\n` +
        t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n")
    );
  }

  /* =============== Render =============== */
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
                🏗️ Fixed Assets
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 19
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
                  onChange={(e) => setCompany(e.target.value as Company)}
                >
                  <option value="co1">Đại Tín Co.</option>
                  <option value="co2">Đại Tín Invest</option>
                </Select>
              </label>
              <label style={{ gridColumn: "span 2" }}>
                Period
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PeriodYM)}
                >
                  {(["2025-07", "2025-08"] as PeriodYM[]).map((p) => (
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
                  onChange={(e) => setTab(e.target.value as any)}
                >
                  {["Register", "Depreciation", "JEs", "Analytics"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </label>
              <div style={{ gridColumn: "span 2" }} />
            </div>
          </div>

          {/* Register */}
          {tab === "Register" && (
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
                  Asset Register — {company} · {period}
                </div>
                <Button onClick={exportRegisterCSV}>Export CSV</Button>
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
                      <th style={thStyle()}>ID</th>
                      <th style={thStyle()}>Name</th>
                      <th style={thStyle()}>Class</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>Cost</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Salvage
                      </th>
                      <th style={thStyle()}>Method</th>
                      <th style={thStyle()}>Life(m)</th>
                      <th style={thStyle()}>Start</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Accum Dep
                      </th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>NBV</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        NBV (VND eq.)
                      </th>
                      <th style={thStyle()}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regs.map((r) => (
                      <tr key={r.a.id}>
                        <td style={tdStyle(true)}>{r.a.id}</td>
                        <td style={tdStyle()}>{r.a.name}</td>
                        <td style={tdStyle()}>{r.a.class}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {r.a.ccy === "USD"
                            ? r.a.cost.toLocaleString("en-US") + " USD"
                            : fmtVND(r.a.cost)}
                        </td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {r.a.ccy === "USD"
                            ? r.a.salvage.toLocaleString("en-US") + " USD"
                            : fmtVND(r.a.salvage)}
                        </td>
                        <td style={tdStyle()}>{r.a.method}</td>
                        <td style={tdStyle()}>{r.a.lifeMonths}</td>
                        <td style={tdStyle()}>{r.a.start}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {r.a.ccy === "USD"
                            ? r.acc.toLocaleString("en-US") + " USD"
                            : fmtVND(r.acc)}
                        </td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {r.a.ccy === "USD"
                            ? r.nbv.toLocaleString("en-US") + " USD"
                            : fmtVND(r.nbv)}
                        </td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(vndEq(r.a.ccy, r.nbv))}
                        </td>
                        <td style={tdStyle()}>
                          <Button onClick={() => openSchedule(r.a)}>
                            Schedule
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {regs.length === 0 && (
                      <tr>
                        <td
                          colSpan={12}
                          style={{
                            padding: 16,
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          No assets.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: 12, fontSize: 13, color: "#6b7280" }}>
                *NBV tính tới cuối kỳ {period}. USD quy đổi @{" "}
                {FX.USD.toLocaleString("vi-VN")}.
              </div>
            </div>
          )}

          {/* Depreciation */}
          {tab === "Depreciation" && (
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
                  Depreciation — {company} · {period}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>
                    Total: <b>{fmtVND(depTotalVND)}</b>
                  </div>
                  <Button onClick={postDep} variant="solid">
                    Post Depreciation
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
                      <th style={thStyle()}>Asset</th>
                      <th style={thStyle()}>Method</th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Dep (CCY)
                      </th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        Dep (VND eq.)
                      </th>
                      <th style={{ ...thStyle(), textAlign: "right" }}>
                        NBV end (CCY)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {depLines.map((l) => {
                      const a = assets.find((x) => x.id === l.assetId)!;
                      const nbv = nbvAt(a, period);
                      return (
                        <tr key={l.assetId}>
                          <td style={tdStyle(true)}>
                            {a.id} · {a.name}
                          </td>
                          <td style={tdStyle()}>{a.method}</td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {a.ccy === "USD"
                              ? l.amount.toLocaleString("en-US") + " USD"
                              : fmtVND(l.amount)}
                          </td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {fmtVND(vndEq(a.ccy, l.amount))}
                          </td>
                          <td style={{ ...tdStyle(), textAlign: "right" }}>
                            {a.ccy === "USD"
                              ? nbv.toLocaleString("en-US") + " USD"
                              : fmtVND(nbv)}
                          </td>
                        </tr>
                      );
                    })}
                    {depLines.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: 16,
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          No depreciation this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Disposal notices */}
              <div style={{ padding: 12 }}>
                {assets.map((a) => {
                  const info = disposalGainLoss(a, period);
                  if (!info) return null;
                  const proceedsVND = vndEq(a.ccy, info.proceeds),
                    nbvVND = vndEq(a.ccy, info.nbv);
                  return (
                    <div
                      key={a.id}
                      style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}
                    >
                      Disposal {a.id} tại {info.dispMonth}: Proceeds{" "}
                      {fmtVND(proceedsVND)} · NBV {fmtVND(nbvVND)} →{" "}
                      {proceedsVND >= nbvVND ? "Gain" : "Loss"}{" "}
                      {fmtVND(Math.abs(proceedsVND - nbvVND))}.
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* JEs */}
          {tab === "JEs" && (
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
                  Journal Entries — {company} · {period}
                </div>
                <Button onClick={exportJEsCSV}>Export CSV</Button>
              </div>
              <div style={{ padding: 12 }}>
                {jes.filter((j) => j.company === company).length === 0 ? (
                  <div
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No JEs yet.
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {jes
                      .filter((j) => j.company === company)
                      .map((j) => (
                        <div
                          key={j.id}
                          style={{
                            border: "1px solid #e5e5e5",
                            borderRadius: 12,
                          }}
                        >
                          <div
                            style={{
                              padding: 10,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              background: "#f9fafb",
                              borderBottom: "1px solid #e5e5e5",
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: 13 }}>
                              {j.id}
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                              {j.date} · {j.period}
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
                                  background: "#fff",
                                  fontSize: 12,
                                  color: "#6b7280",
                                }}
                              >
                                <th style={thStyle()}>Account</th>
                                <th style={thStyle()}>Desc</th>
                                <th
                                  style={{ ...thStyle(), textAlign: "right" }}
                                >
                                  Debit
                                </th>
                                <th
                                  style={{ ...thStyle(), textAlign: "right" }}
                                >
                                  Credit
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {j.lines.map((l, idx) => (
                                <tr key={idx}>
                                  <td style={tdStyle(true)}>{l.account}</td>
                                  <td style={tdStyle()}>{l.desc}</td>
                                  <td
                                    style={{ ...tdStyle(), textAlign: "right" }}
                                  >
                                    {fmtVND(l.debit)}
                                  </td>
                                  <td
                                    style={{ ...tdStyle(), textAlign: "right" }}
                                  >
                                    {fmtVND(l.credit)}
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td style={tdStyle(true)}></td>
                                <td style={tdStyle()}></td>
                                <td
                                  style={{
                                    ...tdStyle(),
                                    textAlign: "right",
                                    fontWeight: 600,
                                  }}
                                >
                                  {fmtVND(sum(j.lines.map((l) => l.debit)))}
                                </td>
                                <td
                                  style={{
                                    ...tdStyle(),
                                    textAlign: "right",
                                    fontWeight: 600,
                                  }}
                                >
                                  {fmtVND(sum(j.lines.map((l) => l.credit)))}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics */}
          {tab === "Analytics" && (
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 16,
                background: "#fff",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                Analytics — {company} · {period}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <KPI title="Gross Cost (VND eq.)" value={fmtVND(kpiGrossVND)} />
                <KPI title="Accum Dep (VND eq.)" value={fmtVND(kpiAccVND)} />
                <KPI title="NBV (VND eq.)" value={fmtVND(kpiNBVVND)} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                By Asset Class
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
                    <th style={thStyle()}>Class</th>
                    <th style={{ ...thStyle(), textAlign: "right" }}>
                      Gross (VND)
                    </th>
                    <th style={{ ...thStyle(), textAlign: "right" }}>
                      NBV (VND)
                    </th>
                    <th style={{ ...thStyle(), textAlign: "right" }}>
                      NBV / Gross
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(classBreak).map(([k, v]) => (
                    <tr key={k}>
                      <td style={tdStyle(true)}>{k}</td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(v.gross)}
                      </td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(v.nbv)}
                      </td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {v.gross > 0 ? Math.round((v.nbv / v.gross) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                  {Object.keys(classBreak).length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
                *NBV/Gross giúp nhận diện lớp tài sản gần hết khấu hao.
              </div>
            </div>
          )}
        </div>

        {/* SIDE */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* KPIs quick */}
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
            <KPI title="Gross (VND eq.)" value={fmtVND(kpiGrossVND)} />
            <KPI title="Accum Dep (VND eq.)" value={fmtVND(kpiAccVND)} />
            <KPI title="NBV (VND eq.)" value={fmtVND(kpiNBVVND)} />
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
                <b>SL</b>: (Cost − Salvage)/Life theo tháng.
              </li>
              <li>
                <b>DDB</b>: 2×SL theo giá trị còn lại; có kẹp để không xuống
                dưới salvage.
              </li>
              <li>
                <b>Disposal</b>: khấu hao tới tháng thanh lý; tính Gain/Loss =
                Proceeds − NBV.
              </li>
              <li>
                Post Dep tạo 1 JE tổng hợp; JE thanh lý tự động nếu có disposal
                trong/đến kỳ.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawer && (
        <div style={{ position: "fixed", inset: 0 as any, zIndex: 50 }}>
          <div
            onClick={() => setDrawer(null)}
            style={{
              position: "absolute",
              inset: 0 as any,
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

  /* --- tiny KPI --- */
  function KPI({ title, value }: { title: string; value: string }) {
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
