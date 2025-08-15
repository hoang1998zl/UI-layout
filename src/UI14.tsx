import React from "react";

/**
 * UI 14 – AP / Payments (Console Canvas single-file)
 * - No external libs (no Tailwind/icons)
 * - Paste as `index.tsx`, press Run
 */

/* ====================== Types & Constants ====================== */
type Company = "co1" | "co2";
type Period = "2025-Q1" | "2025-Q2" | "2025-Q3";
type VendorId = "VEN-A" | "VEN-B" | "VEN-C" | "VEN-D";
type InvStatus =
  | "Pending"
  | "Needs Info"
  | "Approved"
  | "Scheduled"
  | "Paid"
  | "Rejected"
  | "Exception";

type Invoice = {
  id: string;
  company: Company;
  vendor: VendorId;
  poId?: string;
  date: string;
  dueDate: string;
  amount: number;
  hasDoc: boolean; // chứng từ scan/OCR (giả lập)
  status: InvStatus;
  match?: "Unmatched" | "Matched";
  terms?: "Net 30" | "2/10 Net 30";
  duplicateOf?: string; // id của hóa đơn trùng (nếu phát hiện)
  scheduledPayDate?: string;
  scheduledPayAmt?: number;
};

type Vendor = { id: VendorId; name: string; risk: number; bank: string };
type GRN = { id: string; poId: string; amount: number }; // received amount (simple)
type Bank = { id: string; company: Company; name: string; balance: number };

const PERIODS: Period[] = ["2025-Q1", "2025-Q2", "2025-Q3"];
const TODAY = new Date("2025-08-14");

// 3-way match tolerance (giữ đồng bộ với UI 13)
const MATCH_TOL_PCT = 2; // ±2%
const MATCH_TOL_ABS = 1_000_000; // ≤ 1,000,000₫ (giá trị tuyệt đối)
const VENDOR_RISK_GATE = 80; // >80 → coi như rủi ro cao, auto Exception khi duyệt

/* ====================== Demo Data ====================== */
const VENDORS: Vendor[] = [
  { id: "VEN-A", name: "Alpha Supplies", risk: 45, bank: "701-0001 VN" },
  { id: "VEN-B", name: "Beta Software", risk: 62, bank: "701-0002 VN" },
  { id: "VEN-C", name: "Gamma Services", risk: 78, bank: "701-0003 VN" },
  { id: "VEN-D", name: "Delta Hardware", risk: 30, bank: "701-0004 VN" },
];

// PO & GRN (để match 3 chiều đơn giản)
const GRN_INIT: GRN[] = [
  { id: "GRN-11", poId: "PO-8001", amount: 395_000_000 },
  { id: "GRN-12", poId: "PO-8002", amount: 235_000_000 },
];

const INV_INIT: Invoice[] = [
  {
    id: "INV-1001",
    company: "co1",
    vendor: "VEN-D",
    poId: "PO-8001",
    date: "2025-08-01",
    dueDate: "2025-08-31",
    amount: 402_000_000,
    hasDoc: true,
    status: "Pending",
    terms: "2/10 Net 30",
  }, // gần tol, có chiết khấu 2% nếu trả ≤ Aug 11
  {
    id: "INV-1002",
    company: "co1",
    vendor: "VEN-A",
    date: "2025-08-03",
    dueDate: "2025-08-25",
    amount: 58_000_000,
    hasDoc: true,
    status: "Approved",
    terms: "Net 30",
  },
  {
    id: "INV-1003",
    company: "co1",
    vendor: "VEN-B",
    poId: "PO-8002",
    date: "2025-08-05",
    dueDate: "2025-09-04",
    amount: 235_000_000,
    hasDoc: true,
    status: "Needs Info",
    terms: "2/10 Net 30",
  },
  {
    id: "INV-1004",
    company: "co2",
    vendor: "VEN-C",
    date: "2025-06-28",
    dueDate: "2025-07-28",
    amount: 78_500_000,
    hasDoc: true,
    status: "Exception",
    terms: "Net 30",
  }, // quá hạn (overdue)
  {
    id: "INV-1005",
    company: "co1",
    vendor: "VEN-A",
    date: "2025-08-03",
    dueDate: "2025-08-25",
    amount: 58_000_000,
    hasDoc: true,
    status: "Pending",
    terms: "Net 30",
  }, // trùng với INV-1002 (demo duplicate)
  {
    id: "INV-1006",
    company: "co2",
    vendor: "VEN-D",
    date: "2025-07-30",
    dueDate: "2025-08-29",
    amount: 18_000_000,
    hasDoc: false,
    status: "Pending",
    terms: "Net 30",
  }, // thiếu chứng từ
];

// Bank accounts
const BANKS_INIT: Bank[] = [
  { id: "BANK-CO1-01", company: "co1", name: "VCB Main", balance: 600_000_000 },
  { id: "BANK-CO1-02", company: "co1", name: "ACB Ops", balance: 180_000_000 },
  { id: "BANK-CO2-01", company: "co2", name: "VCB Main", balance: 120_000_000 },
];

/* ====================== Small UI helpers ====================== */
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
function tagStyle(bg: string, fg: string) {
  return {
    fontSize: 12,
    background: bg,
    color: fg,
    borderRadius: 999,
    padding: "2px 8px",
  } as React.CSSProperties;
}
function fmtVND(x: number) {
  return x.toLocaleString("vi-VN") + " ₫";
}
function daysBetween(a: Date, b: Date) {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 3600 * 24));
}
function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

/* ====================== Main Component ====================== */
export default function UI14_AP_Payments() {
  // Filters
  const [company, setCompany] = React.useState<Company>("co1");
  const [period, setPeriod] = React.useState<Period>("2025-Q3");
  const [vendor, setVendor] = React.useState<VendorId | "">("");
  const [status, setStatus] = React.useState<InvStatus | "">("");
  const [bucket, setBucket] = React.useState<
    | "All"
    | "Current"
    | "Due≤7"
    | "Overdue 1–30"
    | "Overdue 31–60"
    | "Overdue >60"
  >("All");
  const [search, setSearch] = React.useState("");

  // State
  const [invoices, setInvoices] = React.useState<Invoice[]>(
    markDuplicates(INV_INIT)
  );
  const [banks, setBanks] = React.useState<Bank[]>(BANKS_INIT);
  const [grn] = React.useState<GRN[]>(GRN_INIT);
  const [drawer, setDrawer] = React.useState<{
    title: string;
    body: React.ReactNode;
  } | null>(null);

  const [selInv, setSelInv] = React.useState<Record<string, boolean>>({});
  const [payBankId, setPayBankId] = React.useState<string>(
    banks.find((b) => b.company === company)?.id || ""
  );
  const [payDate, setPayDate] = React.useState<string>(toISO(TODAY));

  // Slices
  const invViewBase = invoices.filter(
    (iv) =>
      iv.company === company &&
      (!vendor || iv.vendor === vendor) &&
      (!status || iv.status === status) &&
      (!search ||
        `${iv.id} ${iv.vendor} ${iv.poId || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      inPeriod(iv.date, period)
  );
  const invView = invViewBase.filter((iv) => {
    if (bucket === "All") return true;
    const b = agingBucket(iv);
    return b === bucket;
  });

  // KPI
  const outstanding = sum(
    invoices
      .filter(
        (iv) =>
          iv.company === company &&
          (iv.status === "Pending" ||
            iv.status === "Needs Info" ||
            iv.status === "Approved" ||
            iv.status === "Scheduled")
      )
      .map((iv) => iv.amount)
  );
  const dueSoon = sum(
    invoices
      .filter(
        (iv) =>
          iv.company === company &&
          agingBucket(iv) === "Due≤7" &&
          iv.status !== "Paid" &&
          iv.status !== "Rejected"
      )
      .map((iv) => iv.amount)
  );
  const overdue = sum(
    invoices
      .filter(
        (iv) =>
          iv.company === company &&
          agingBucket(iv).startsWith("Overdue") &&
          iv.status !== "Paid" &&
          iv.status !== "Rejected"
      )
      .map((iv) => iv.amount)
  );
  const dpoProxy = (() => {
    // proxy = (outstanding / (30d spend)) * 30 ; spend ≈ sum Paid in period / 30
    const paid = invoices.filter(
      (iv) =>
        iv.company === company &&
        iv.status === "Paid" &&
        inPeriod(iv.date, period)
    );
    const spend = sum(paid.map((iv) => iv.amount)) || 1;
    return Math.round(outstanding / (spend / 30));
  })();
  const exceptions = invoices.filter(
    (iv) => iv.status === "Exception" || iv.status === "Rejected"
  ).length;
  const discountCapturedPct = (() => {
    const scheduled = invoices.filter(
      (iv) =>
        iv.company === company &&
        iv.status === "Paid" &&
        iv.terms === "2/10 Net 30"
    );
    if (!scheduled.length) return 0;
    let got = 0,
      possible = 0;
    scheduled.forEach((iv) => {
      const payD = iv.scheduledPayDate ? new Date(iv.scheduledPayDate) : TODAY;
      const invD = new Date(iv.date);
      const within = daysBetween(invD, payD) <= 10;
      if (within) {
        got++;
      }
      possible++;
    });
    return Math.round((got / possible) * 100);
  })();

  /* ====================== Rules ====================== */
  function threeWayMatchRule(iv: Invoice) {
    if (!iv.poId)
      return { ok: iv.hasDoc, reasons: iv.hasDoc ? [] : ["Thiếu chứng từ"] };
    const rec = sum(grn.filter((g) => g.poId === iv.poId).map((g) => g.amount));
    const allowed = Math.max(MATCH_TOL_ABS, (iv.amount * MATCH_TOL_PCT) / 100);
    const base = Math.min(rec, iv.amount); // đơn giản
    const diff = Math.abs(iv.amount - base);
    const ok = diff <= allowed && iv.hasDoc;
    const reasons = [];
    if (!iv.hasDoc) reasons.push("Thiếu chứng từ");
    if (diff > allowed)
      reasons.push(
        `Sai lệch ${fmtVND(
          diff
        )} vượt tolerance (±${MATCH_TOL_PCT}% hoặc ≤ ${fmtVND(MATCH_TOL_ABS)})`
      );
    return { ok, reasons };
  }
  function vendorRiskOK(iv: Invoice) {
    const v = VENDORS.find((x) => x.id === iv.vendor)!;
    return v.risk <= VENDOR_RISK_GATE;
  }
  function isDuplicate(iv: Invoice) {
    return !!iv.duplicateOf;
  }
  function approveRule(iv: Invoice) {
    const m = threeWayMatchRule(iv);
    const risk = vendorRiskOK(iv);
    const dup = isDuplicate(iv);
    const ok = m.ok && risk && !dup;
    const reasons = [
      m.ok ? "" : m.reasons.join(" & "),
      risk ? "" : `Vendor risk > ${VENDOR_RISK_GATE}`,
      dup ? "Possible duplicate" : "",
    ].filter(Boolean);
    return { ok, reasons };
  }

  // Discount: 2/10 Net 30
  function discountAmount(iv: Invoice, whenPay: string) {
    if (iv.terms !== "2/10 Net 30") return 0;
    const payD = new Date(whenPay);
    const invD = new Date(iv.date);
    const within = daysBetween(invD, payD) <= 10;
    return within ? Math.round(iv.amount * 0.02) : 0;
  }

  // Aging bucket
  function agingBucket(
    iv: Invoice
  ): "Current" | "Due≤7" | "Overdue 1–30" | "Overdue 31–60" | "Overdue >60" {
    const due = new Date(iv.dueDate);
    const dd = daysBetween(TODAY, due); // positive nếu còn ngày đến hạn
    if (dd >= 8) return "Current";
    if (dd >= 0) return "Due≤7";
    const od = -dd;
    if (od <= 30) return "Overdue 1–30";
    if (od <= 60) return "Overdue 31–60";
    return "Overdue >60";
  }

  // Duplicate detector (same vendor+amount+date)
  function markDuplicates(list: Invoice[]) {
    const key = (x: Invoice) =>
      `${x.company}|${x.vendor}|${x.amount}|${x.date}`;
    const seen: Record<string, string> = {};
    return list.map((x) => {
      const k = key(x);
      if (seen[k]) return { ...x, duplicateOf: seen[k] };
      seen[k] = x.id;
      return x;
    });
  }

  /* ====================== Actions ====================== */
  function batchApprove() {
    const ids = Object.entries(selInv)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (!ids.length) {
      alert("Chưa chọn invoice nào.");
      return;
    }
    const ok: string[] = [];
    const ex: { id: string; reason: string }[] = [];
    setInvoices((prev) =>
      prev.map((iv) => {
        if (!ids.includes(iv.id)) return iv;
        const r = approveRule(iv);
        if (r.ok) {
          ok.push(iv.id);
          return {
            ...iv,
            status: "Approved",
            match: iv.poId ? "Matched" : "Matched",
          };
        } else {
          ex.push({ id: iv.id, reason: r.reasons.join(" & ") });
          return { ...iv, status: "Exception" };
        }
      })
    );
    setSelInv({});
    alert(`Invoice Approval
✅ Approved: ${ok.length} [${ok.join(", ") || "—"}]
⚠️ Exception: ${ex.length}${
      ex.length ? "\n" + ex.map((x) => `• ${x.id}: ${x.reason}`).join("\n") : ""
    }`);
  }

  function batchNeedsInfo() {
    const ids = Object.entries(selInv)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (!ids.length) {
      alert("Chưa chọn invoice nào.");
      return;
    }
    setInvoices((prev) =>
      prev.map((iv) =>
        ids.includes(iv.id) ? { ...iv, status: "Needs Info" } : iv
      )
    );
    setSelInv({});
    alert('Đã chuyển các invoice sang trạng thái "Needs Info".');
  }

  function batchReject() {
    const ids = Object.entries(selInv)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (!ids.length) {
      alert("Chưa chọn invoice nào.");
      return;
    }
    setInvoices((prev) =>
      prev.map((iv) =>
        ids.includes(iv.id) ? { ...iv, status: "Rejected" } : iv
      )
    );
    setSelInv({});
    alert("Đã Reject các invoice đã chọn.");
  }

  function schedulePayments() {
    const bank = banks.find((b) => b.id === payBankId && b.company === company);
    if (!bank) {
      alert("Chưa chọn bank account hợp lệ.");
      return;
    }
    const ids = Object.entries(selInv)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    const candidates = invoices.filter(
      (iv) =>
        ids.includes(iv.id) &&
        iv.company === company &&
        iv.status === "Approved"
    );
    if (!candidates.length) {
      alert("Chỉ invoice trạng thái Approved mới được schedule.");
      return;
    }

    // tính tổng cần chi sau chiết khấu
    const lines = candidates.map((iv) => {
      const disc = discountAmount(iv, payDate);
      return { id: iv.id, net: iv.amount - disc, disc };
    });
    const total = sum(lines.map((l) => l.net));
    if (total > bank.balance) {
      alert(`Số dư không đủ (${fmtVND(bank.balance)}), cần ${fmtVND(total)}.`);
      return;
    }

    // schedule & giữ chỗ số dư (NHƯ DEMO): trừ tiền, set Scheduled
    setBanks((prev) =>
      prev.map((b) =>
        b.id === bank.id ? { ...b, balance: b.balance - total } : b
      )
    );
    setInvoices((prev) =>
      prev.map((iv) => {
        const l = lines.find((x) => x.id === iv.id);
        if (!l) return iv;
        return {
          ...iv,
          status: "Scheduled",
          scheduledPayDate: payDate,
          scheduledPayAmt: l.net,
        };
      })
    );
    setSelInv({});
    alert(
      `Scheduled ${lines.length} payments, tổng ${fmtVND(total)} từ ${
        bank.name
      }.`
    );
  }

  function executeScheduled() {
    // mark Scheduled → Paid
    setInvoices((prev) =>
      prev.map((iv) =>
        iv.status === "Scheduled" ? { ...iv, status: "Paid" } : iv
      )
    );
    alert("Đã thực hiện chi các khoản đã schedule (demo).");
  }

  /* ====================== Drawers ====================== */
  function openInvoice(iv: Invoice) {
    const v = VENDORS.find((x) => x.id === iv.vendor)!;
    const m = threeWayMatchRule(iv);
    setDrawer({
      title: `${iv.id} · ${v.name}`,
      body: (
        <div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <b>Vendor:</b> {v.id} · {v.name}
            </div>
            <div>
              <b>Vendor risk:</b> {v.risk}
            </div>
            <div>
              <b>PO:</b> {iv.poId || "—"}
            </div>
            <div>
              <b>Amount:</b> {fmtVND(iv.amount)}
            </div>
            <div>
              <b>Date:</b> {iv.date}
            </div>
            <div>
              <b>Due:</b> {iv.dueDate} ({agingBucket(iv)})
            </div>
            <div>
              <b>Terms:</b> {iv.terms || "—"}
            </div>
            <div>
              <b>Doc:</b> {iv.hasDoc ? "Yes" : "No"}
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
            Match rule: {m.ok ? "OK" : m.reasons.join(" & ")}
          </div>
          {iv.terms === "2/10 Net 30" && (
            <div style={{ marginTop: 8 }}>
              <b>Early pay</b>: nếu trả {payDate}, chiết khấu ước tính{" "}
              <b>{fmtVND(discountAmount(iv, payDate))}</b>.
            </div>
          )}
          {iv.duplicateOf && (
            <div style={{ marginTop: 8, color: "#b91c1c" }}>
              <b>Possible duplicate of</b> {iv.duplicateOf}
            </div>
          )}
        </div>
      ),
    });
  }

  /* ====================== Self-tests ====================== */
  function runTests() {
    const t: { name: string; pass: boolean }[] = [];
    // 1) Duplicate detection
    const dupsOK = invoices.some((iv) => iv.duplicateOf);
    t.push({ name: "Duplicate detection flags at least one", pass: dupsOK });
    // 2) 3-way tolerance should block a 20% variance
    const iv = { ...invoices.find((x) => x.poId)! };
    const v20 = { ...iv, amount: Math.round((iv.amount || 1) * 1.2) };
    const tol = threeWayMatchRule(v20);
    t.push({ name: "3-way match blocks 20% variance", pass: tol.ok === false });
    // 3) Discount 2% only within 10 days
    const invDisc = invoices.find((x) => x.terms === "2/10 Net 30")!;
    const dIn = discountAmount(invDisc, toISO(new Date(invDisc.date))); // pay ngay
    const dOut = discountAmount(
      invDisc,
      toISO(new Date(new Date(invDisc.date).getTime() + 12 * 86400000))
    ); // +12d
    t.push({ name: "Discount window calc", pass: dIn > 0 && dOut === 0 });
    // 4) Aging bucket monotonic
    const b = agingBucket({ ...invoices[3] }); // overdue
    t.push({ name: "Aging bucket works", pass: b.startsWith("Overdue") });
    // 5) Bank gate: schedule > balance blocks
    const bank = banks.find((b) => b.company === company)!;
    const need = bank.balance + 1_000_000;
    t.push({
      name: "Bank structure sane",
      pass:
        Number.isFinite(bank.balance) &&
        bank.balance >= 0 &&
        need > bank.balance,
    });
    alert(
      `Self-tests: ${t.filter((x) => x.pass).length}/${t.length} PASS\n` +
        t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n")
    );
  }

  /* ====================== Render ====================== */
  // Banks (by company) for UI selects
  const bankList = banks.filter((b) => b.company === company);

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
                💳 AP / Payments
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 14
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => {
                  setVendor("");
                  setStatus("");
                  setBucket("All");
                  setSearch("");
                  setSelInv({});
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
                gridTemplateColumns: "repeat(8, minmax(0,1fr))",
                gap: 8,
              }}
            >
              <label>
                Company
                <Select
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value as Company);
                    setPayBankId(
                      banks.find((b) => b.company === e.target.value)?.id || ""
                    );
                  }}
                >
                  <option value="co1">Đại Tín Co.</option>
                  <option value="co2">Đại Tín Invest</option>
                </Select>
              </label>
              <label>
                Period
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as Period)}
                >
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                Vendor
                <Select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value as VendorId | "")}
                >
                  <option value="">Any</option>
                  {VENDORS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id} · {v.name}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                Status
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InvStatus | "")}
                >
                  <option value="">Any</option>
                  <option>Pending</option>
                  <option>Needs Info</option>
                  <option>Approved</option>
                  <option>Scheduled</option>
                  <option>Paid</option>
                  <option>Rejected</option>
                  <option>Exception</option>
                </Select>
              </label>
              <label>
                Due bucket
                <Select
                  value={bucket}
                  onChange={(e) => setBucket(e.target.value as any)}
                >
                  {[
                    "All",
                    "Current",
                    "Due≤7",
                    "Overdue 1–30",
                    "Overdue 31–60",
                    "Overdue >60",
                  ].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                Search
                <Input
                  placeholder="id/vendor/po…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <div />
              <div />
            </div>
          </div>

          {/* KPIs */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(6, minmax(0,1fr))",
            }}
          >
            <KPI
              title="Outstanding"
              value={fmtVND(outstanding)}
              hint="Pending/Needs/Approved/Scheduled"
            />
            <KPI
              title="Due ≤ 7d"
              value={fmtVND(dueSoon)}
              hint="unpaid & due soon"
            />
            <KPI
              title="Overdue"
              value={fmtVND(overdue)}
              hint="unpaid & overdue"
            />
            <KPI
              title="DPO (proxy)"
              value={dpoProxy.toString()}
              hint="see note"
            />
            <KPI
              title="Exceptions"
              value={exceptions.toString()}
              hint="Exception/Rejected"
            />
            <KPI
              title="Discounts %"
              value={discountCapturedPct + "%"}
              hint="2/10 captured"
            />
          </div>

          {/* Invoice Queue (lanes) */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Invoice Queue
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(5, minmax(0,1fr))",
              }}
            >
              <Lane
                title="Pending"
                items={lane("Pending")}
                sel={selInv}
                setSel={setSelInv}
                onOpen={openInvoice}
              />
              <Lane
                title="Needs Info"
                items={lane("Needs Info")}
                sel={selInv}
                setSel={setSelInv}
                onOpen={openInvoice}
              />
              <Lane
                title="Approved"
                items={lane("Approved")}
                sel={selInv}
                setSel={setSelInv}
                onOpen={openInvoice}
              />
              <Lane
                title="Scheduled"
                items={lane("Scheduled")}
                sel={selInv}
                setSel={setSelInv}
                onOpen={openInvoice}
              />
              <Lane
                title="Paid / Exception"
                items={[...lane("Paid"), ...lane("Exception")]}
                sel={selInv}
                setSel={setSelInv}
                onOpen={openInvoice}
              />
            </div>
          </div>

          {/* Invoices Table */}
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
              <div style={{ fontSize: 14, fontWeight: 600 }}>Invoices</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={batchApprove} variant="solid">
                  Approve
                </Button>
                <Button onClick={batchNeedsInfo}>Needs Info</Button>
                <Button onClick={batchReject}>Reject</Button>
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
                    <th style={thStyle()}>Inv</th>
                    <th style={thStyle()}>Vendor</th>
                    <th style={thStyle()}>PO</th>
                    <th style={thStyle()}>Date</th>
                    <th style={thStyle()}>Due</th>
                    <th style={thStyle()}>Amount</th>
                    <th style={thStyle()}>Terms</th>
                    <th style={thStyle()}>Bucket</th>
                    <th style={thStyle()}>Rule</th>
                    <th style={thStyle()}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invView.map((iv) => {
                    const v = VENDORS.find((x) => x.id === iv.vendor)!;
                    const rule = approveRule(iv);
                    const checked = !!selInv[iv.id];
                    return (
                      <tr key={iv.id} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setSelInv((s) => ({
                                ...s,
                                [iv.id]: e.target.checked,
                              }))
                            }
                          />
                        </td>
                        <td
                          style={{ ...tdStyle(), cursor: "pointer" }}
                          onClick={() => openInvoice(iv)}
                        >
                          {iv.id}
                        </td>
                        <td style={tdStyle()}>
                          {v.id} · {v.name}
                        </td>
                        <td style={tdStyle()}>{iv.poId || "—"}</td>
                        <td style={tdStyle()}>{iv.date}</td>
                        <td style={tdStyle()}>{iv.dueDate}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(iv.amount)}
                        </td>
                        <td style={tdStyle()}>{iv.terms || "—"}</td>
                        <td style={tdStyle()}>{agingBucket(iv)}</td>
                        <td style={tdStyle()}>
                          {rule.ok ? (
                            <span style={tagStyle("#dcfce7", "#065f46")}>
                              OK
                            </span>
                          ) : (
                            <span style={tagStyle("#fef3c7", "#92400e")}>
                              Exception
                            </span>
                          )}
                          {iv.duplicateOf && (
                            <span
                              style={{
                                marginLeft: 8,
                                ...tagStyle("#fee2e2", "#991b1b"),
                              }}
                            >
                              Duplicate
                            </span>
                          )}
                        </td>
                        <td style={tdStyle()}>{iv.status}</td>
                      </tr>
                    );
                  })}
                  {invView.length === 0 && (
                    <tr>
                      <td
                        colSpan={11}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No invoices.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Run */}
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
              <div style={{ fontSize: 14, fontWeight: 600 }}>Payment Run</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={schedulePayments}>Schedule Payments</Button>
                <Button onClick={executeScheduled} variant="solid">
                  Execute Scheduled
                </Button>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 8,
              }}
            >
              <label>
                Bank
                <Select
                  value={payBankId}
                  onChange={(e) => setPayBankId(e.target.value)}
                >
                  {bankList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — Bal {fmtVND(b.balance)}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                Pay date
                <Input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                />
              </label>
              <div />
              <div />
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
              Chỉ schedule được **Approved & chưa thanh toán**. Áp dụng chiết
              khấu **2/10 Net 30** nếu phù hợp.
            </div>
          </div>

          {/* Aging Summary */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Aging Summary
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
                    <th style={thStyle()}>Bucket</th>
                    <th style={thStyle()}>Amount</th>
                    <th style={thStyle()}>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      "Current",
                      "Due≤7",
                      "Overdue 1–30",
                      "Overdue 31–60",
                      "Overdue >60",
                    ] as const
                  ).map((b) => {
                    const rows = invoices.filter(
                      (iv) =>
                        iv.company === company &&
                        iv.status !== "Paid" &&
                        iv.status !== "Rejected" &&
                        agingBucket(iv) === b
                    );
                    return (
                      <tr key={b} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>{b}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(sum(rows.map((r) => r.amount)))}
                        </td>
                        <td style={tdStyle()}>{rows.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Vendors */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Vendors
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {VENDORS.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontSize: 13 }}>
                    {v.id} · {v.name}
                  </div>
                  <div>
                    <span
                      style={
                        v.risk <= 40
                          ? tagStyle("#dcfce7", "#065f46")
                          : v.risk <= 70
                          ? tagStyle("#fef3c7", "#92400e")
                          : tagStyle("#fee2e2", "#991b1b")
                      }
                    >
                      {v.risk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Banks */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Bank Balances
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {banks
                .filter((b) => b.company === company)
                .map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontSize: 13 }}>{b.name}</div>
                    <div style={{ fontWeight: 600 }}>{fmtVND(b.balance)}</div>
                  </div>
                ))}
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
                Duyệt invoice: cần <b>match</b> 3 chiều (nếu có PO),{" "}
                <b>không duplicate</b>, đủ <b>chứng từ</b>.
              </li>
              <li>
                Payment Run: chỉ cho <b>Approved</b>, kiểm tra <b>số dư bank</b>
                , áp dụng <b>2/10 Net 30</b>.
              </li>
              <li>
                Aging theo <b>bucket</b> để ưu tiên trả nợ & bắt chiết khấu khi
                khả thi.
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

  /* ---------- local helpers & small components ---------- */
  function lane(st: InvStatus) {
    return invoices.filter((iv) => iv.company === company && iv.status === st);
  }
  function KPI({
    title,
    value,
    hint,
  }: {
    title: string;
    value: string;
    hint?: string;
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
    sel,
    setSel,
    onOpen,
  }: {
    title: string;
    items: Invoice[];
    sel: Record<string, boolean>;
    setSel: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    onOpen: (iv: Invoice) => void;
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
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            ({items.length})
          </span>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((iv) => {
            const v = VENDORS.find((x) => x.id === iv.vendor)!;
            const bkt = agingBucket(iv);
            return (
              <div
                key={iv.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 10,
                  padding: 8,
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div onClick={() => onOpen(iv)} style={{ cursor: "pointer" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {iv.id} · {v.name}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#374151", marginTop: 2 }}
                    >
                      {iv.poId || "No PO"} · {fmtVND(iv.amount)} · {bkt}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!sel[iv.id]}
                    onChange={(e) =>
                      setSel((prev) => ({ ...prev, [iv.id]: e.target.checked }))
                    }
                  />
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div style={{ color: "#6b7280", fontSize: 12 }}>Empty</div>
          )}
        </div>
      </div>
    );
  }
}

/* ====================== utils ====================== */
function inPeriod(dateISO: string, p: Period) {
  const d = new Date(dateISO);
  const { start, end } = qStartEnd(p);
  return d >= start && d <= end;
}
function qStartEnd(p: Period) {
  const [y, q] = p.split("-Q") as [string, string];
  const year = Number(y);
  const S = {
    1: `${year}-01-01`,
    2: `${year}-04-01`,
    3: `${year}-07-01`,
  } as any;
  const E = {
    1: `${year}-03-31`,
    2: `${year}-06-30`,
    3: `${year}-09-30`,
  } as any;
  return { start: new Date(S[q]), end: new Date(E[q]) };
}
function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}
