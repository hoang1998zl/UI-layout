import React from "react";

/*
 * UI 14 – AP / Payments (Console Canvas single-file)
 * - No external libs (no Tailwind/icons)
 * - Paste as `index.tsx`, press Run
 */

/* ====================== Types & Constants ====================== */

const PERIODS = ["2025-Q1", "2025-Q2", "2025-Q3"];
const TODAY = new Date("2025-08-14");

// 3-way match tolerance
const MATCH_TOL_PCT = 2; // ±2%
const MATCH_TOL_ABS = 1_000_000; // ≤ 1,000,000₫
const VENDOR_RISK_GATE = 80; // >80 → high risk

/* ====================== Demo Data ====================== */
const VENDORS = [
  { id: "VEN-A", name: "Alpha Supplies", risk: 45, bank: "701-0001 VN" },
  { id: "VEN-B", name: "Beta Software", risk: 62, bank: "701-0002 VN" },
  { id: "VEN-C", name: "Gamma Services", risk: 78, bank: "701-0003 VN" },
  { id: "VEN-D", name: "Delta Hardware", risk: 30, bank: "701-0004 VN" },
];

const GRN_INIT = [
  { id: "GRN-11", poId: "PO-8001", amount: 395_000_000 },
  { id: "GRN-12", poId: "PO-8002", amount: 235_000_000 },
];

const INV_INIT = [
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
  },
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
  },
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
  },
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
  },
];

const BANKS_INIT = [
  { id: "BANK-CO1-01", company: "co1", name: "VCB Main", balance: 600_000_000 },
  { id: "BANK-CO1-02", company: "co1", name: "ACB Ops", balance: 180_000_000 },
  { id: "BANK-CO2-01", company: "co2", name: "VCB Main", balance: 120_000_000 },
];

/* ====================== Small UI helpers ====================== */
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
  if (x == null) return "—";
  return Number(x).toLocaleString("vi-VN") + " ₫";
}
function daysBetween(a, b) {
  const da = a instanceof Date ? a : new Date(a);
  const db = b instanceof Date ? b : new Date(b);
  return Math.ceil((db.getTime() - da.getTime()) / (1000 * 3600 * 24));
}
function toISO(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().slice(0, 10);
}

/* ====================== Main Component ====================== */
export default function UI13_FinanceCockpit() {
  // Filters
  const [company, setCompany] = React.useState("co1");
  const [period, setPeriod] = React.useState("2025-Q3");
  const [vendor, setVendor] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [bucket, setBucket] = React.useState("All");
  const [search, setSearch] = React.useState("");

  // State
  const [invoices, setInvoices] = React.useState(markDuplicates(INV_INIT));
  const [banks, setBanks] = React.useState(BANKS_INIT);
  const [grn] = React.useState(GRN_INIT);
  const [drawer, setDrawer] = React.useState(null);

  const [selInv, setSelInv] = React.useState({});
  const [payBankId, setPayBankId] = React.useState(
    (banks.find((b) => b.company === company) || {}).id || ""
  );
  const [payDate, setPayDate] = React.useState(toISO(TODAY));

  // Slices
  const invViewBase = invoices.filter(
    (iv) =>
      iv.company === company &&
      (!vendor || iv.vendor === vendor) &&
      (!status || iv.status === status) &&
      (!search ||
        `${iv.id} ${iv.vendor} ${iv.poId || ""}`.toLowerCase().includes(search.toLowerCase())) &&
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
    const paid = invoices.filter(
      (iv) => iv.company === company && iv.status === "Paid" && inPeriod(iv.date, period)
    );
    const spend = sum(paid.map((iv) => iv.amount)) || 1;
    return Math.round(outstanding / (spend / 30));
  })();
  const exceptions = invoices.filter((iv) => iv.status === "Exception" || iv.status === "Rejected").length;
  const discountCapturedPct = (() => {
    const scheduled = invoices.filter(
      (iv) => iv.company === company && iv.status === "Paid" && iv.terms === "2/10 Net 30"
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
  function threeWayMatchRule(iv) {
    if (!iv.poId) return { ok: iv.hasDoc, reasons: iv.hasDoc ? [] : ["Thiếu chứng từ"] };
    const rec = sum(grn.filter((g) => g.poId === iv.poId).map((g) => g.amount));
    const allowed = Math.max(MATCH_TOL_ABS, (iv.amount * MATCH_TOL_PCT) / 100);
    const base = Math.min(rec, iv.amount);
    const diff = Math.abs(iv.amount - base);
    const ok = diff <= allowed && iv.hasDoc;
    const reasons = [];
    if (!iv.hasDoc) reasons.push("Thiếu chứng từ");
    if (diff > allowed)
      reasons.push(
        `Sai lệch ${fmtVND(diff)} vượt tolerance (±${MATCH_TOL_PCT}% hoặc ≤ ${fmtVND(MATCH_TOL_ABS)})`
      );
    return { ok, reasons };
  }
  function vendorRiskOK(iv) {
    const v = VENDORS.find((x) => x.id === iv.vendor);
    if (!v) return false;
    return v.risk <= VENDOR_RISK_GATE;
  }
  function isDuplicate(iv) {
    return !!iv.duplicateOf;
  }
  function approveRule(iv) {
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

  function discountAmount(iv, whenPay) {
    if (iv.terms !== "2/10 Net 30") return 0;
    const payD = new Date(whenPay);
    const invD = new Date(iv.date);
    const within = daysBetween(invD, payD) <= 10;
    return within ? Math.round(iv.amount * 0.02) : 0;
  }

  function agingBucket(iv) {
    const due = new Date(iv.dueDate);
    const dd = daysBetween(TODAY, due);
    if (dd >= 8) return "Current";
    if (dd >= 0) return "Due≤7";
    const od = -dd;
    if (od <= 30) return "Overdue 1–30";
    if (od <= 60) return "Overdue 31–60";
    return "Overdue >60";
  }

  function markDuplicates(list) {
    const key = (x) => `${x.company}|${x.vendor}|${x.amount}|${x.date}`;
    const seen = {};
    return list.map((x) => {
      const k = key(x);
      if (seen[k]) return { ...x, duplicateOf: seen[k] };
      seen[k] = x.id;
      return x;
    });
  }

  /* ====================== Actions ====================== */
  function batchApprove() {
    const ids = Object.entries(selInv).filter(([_id, v]) => v).map(([id]) => id);
    if (!ids.length) {
      alert("Chưa chọn invoice nào.");
      return;
    }
    const ok = [];
    const ex = [];
    setInvoices((prev) =>
      prev.map((iv) => {
        if (!ids.includes(iv.id)) return iv;
        const r = approveRule(iv);
        if (r.ok) {
          ok.push(iv.id);
          return { ...iv, status: "Approved", match: iv.poId ? "Matched" : "Matched" };
        } else {
          ex.push({ id: iv.id, reason: r.reasons.join(" & ") });
          return { ...iv, status: "Exception" };
        }
      })
    );
    setSelInv({});
    const approvedCount = ok.length;
    const exMsg = ex.length ? "\n" + ex.map((x) => `• ${x.id}: ${x.reason}`).join("\n") : "";
    alert(`Invoice Approval\n✅ Approved: ${approvedCount}\n⚠️ Exception: ${ex.length}${exMsg}`);
  }

  function batchNeedsInfo() {
    const ids = Object.entries(selInv).filter(([_id, v]) => v).map(([id]) => id);
    if (!ids.length) {
      alert("Chưa chọn invoice nào.");
      return;
    }
    setInvoices((prev) => prev.map((iv) => (ids.includes(iv.id) ? { ...iv, status: "Needs Info" } : iv)));
    setSelInv({});
    alert('Đã chuyển các invoice sang trạng thái "Needs Info".');
  }

  function batchReject() {
    const ids = Object.entries(selInv).filter(([_id, v]) => v).map(([id]) => id);
    if (!ids.length) {
      alert("Chưa chọn invoice nào.");
      return;
    }
    setInvoices((prev) => prev.map((iv) => (ids.includes(iv.id) ? { ...iv, status: "Rejected" } : iv)));
    setSelInv({});
    alert("Đã Reject các invoice đã chọn.");
  }

  function schedulePayments() {
    const bank = banks.find((b) => b.id === payBankId && b.company === company);
    if (!bank) {
      alert("Chưa chọn bank account hợp lệ.");
      return;
    }
    const ids = Object.entries(selInv).filter(([_id, v]) => v).map(([id]) => id);
    const candidates = invoices.filter((iv) => ids.includes(iv.id) && iv.company === company && iv.status === "Approved");
    if (!candidates.length) {
      alert("Chỉ invoice trạng thái Approved mới được schedule.");
      return;
    }

    const lines = candidates.map((iv) => {
      const disc = discountAmount(iv, payDate);
      return { id: iv.id, net: iv.amount - disc, disc };
    });
    const total = sum(lines.map((l) => l.net));
    if (total > bank.balance) {
      alert(`Số dư không đủ (${fmtVND(bank.balance)}), cần ${fmtVND(total)}.`);
      return;
    }

    setBanks((prev) => prev.map((b) => (b.id === bank.id ? { ...b, balance: b.balance - total } : b)));
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
    alert(`Scheduled ${lines.length} payments, tổng ${fmtVND(total)} từ ${bank.name}.`);
  }

  function executeScheduled() {
    setInvoices((prev) => prev.map((iv) => (iv.status === "Scheduled" ? { ...iv, status: "Paid" } : iv)));
    alert("Đã thực hiện chi các khoản đã schedule (demo).");
  }

  /* ====================== Drawers ====================== */
  function openInvoice(iv) {
    const v = VENDORS.find((x) => x.id === iv.vendor) || { id: iv.vendor, name: iv.vendor, risk: 0 };
    const m = threeWayMatchRule(iv);
    setDrawer({
      title: `${iv.id} · ${v.name}`,
      body: (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
              <b>Early pay</b>, chiết khấu ước tính <b>{fmtVND(discountAmount(iv, payDate))}</b>.
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
    const t = [];
    const dupsOK = invoices.some((iv) => iv.duplicateOf);
    t.push({ name: "Duplicate detection flags at least one", pass: !!dupsOK });

    const somePo = invoices.find((x) => x.poId);
    let tolOK = false;
    if (somePo) {
      const iv20 = { ...somePo, amount: Math.round((somePo.amount || 1) * 1.2) };
      const tol = threeWayMatchRule(iv20);
      tolOK = tol.ok === false;
    }
    t.push({ name: "3-way match blocks 20% variance", pass: tolOK });

    const invDisc = invoices.find((x) => x.terms === "2/10 Net 30");
    let discOK = false;
    if (invDisc) {
      const dIn = discountAmount(invDisc, toISO(new Date(invDisc.date)));
      const dOut = discountAmount(invDisc, toISO(new Date(new Date(invDisc.date).getTime() + 12 * 86400000)));
      discOK = dIn > 0 && dOut === 0;
    }
    t.push({ name: "Discount window calc", pass: discOK });

    const b = invoices[3] ? agingBucket({ ...invoices[3] }) : "";
    t.push({ name: "Aging bucket works", pass: b.startsWith("Overdue") });

    const bank = banks.find((b) => b.company === company) || { balance: 0 };
    const need = (bank.balance || 0) + 1_000_000;
    t.push({
      name: "Bank structure sane",
      pass: Number.isFinite(bank.balance) && bank.balance >= 0 && need > bank.balance,
    });

    const passCount = t.filter((x) => x.pass).length;
    alert(`${passCount}/${t.length} PASS\n` + t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n"));
  }

  /* ====================== Render ====================== */
  const bankList = banks.filter((b) => b.company === company);

  // helpers for UI actions
  function toggleSel(id) {
    setSelInv((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div style={{ padding: 16, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>
      <h3>Finance Cockpit (AP / Payments) — Demo</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 200px 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label>Company</label>
          <Select value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="co1">co1</option>
            <option value="co2">co2</option>
          </Select>
        </div>
        <div>
          <label>Period</label>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            {PERIODS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ width: 200 }}>
            <label>Search</label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button onClick={() => setSearch('')}>Clear</Button>
          <Button onClick={runTests}>Run Tests</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <div><b>Outstanding</b></div>
          <div style={{ fontSize: 18 }}>{fmtVND(outstanding)}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <div><b>Due soon</b></div>
          <div style={{ fontSize: 18 }}>{fmtVND(dueSoon)}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <div><b>Overdue</b></div>
          <div style={{ fontSize: 18 }}>{fmtVND(overdue)}</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#fff' }}>
          <tr>
            <th style={thStyle()}>#</th>
            <th style={thStyle()}>ID</th>
            <th style={thStyle()}>Vendor</th>
            <th style={thStyle()}>Amount</th>
            <th style={thStyle()}>Due</th>
            <th style={thStyle()}>Status</th>
            <th style={thStyle()}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invView.map((iv, idx) => (
            <tr key={iv.id}>
              <td style={tdStyle(true)}>
                <input type="checkbox" checked={!!selInv[iv.id]} onChange={() => toggleSel(iv.id)} />
              </td>
              <td style={tdStyle(true)}>{iv.id}</td>
              <td style={tdStyle()}>{(VENDORS.find(v=>v.id===iv.vendor)||{name:iv.vendor}).name}</td>
              <td style={tdStyle()}>{fmtVND(iv.amount)}</td>
              <td style={tdStyle()}>{iv.dueDate}</td>
              <td style={tdStyle()}><span style={tagStyle(iv.status === 'Exception' ? '#fee2e2' : '#eef2ff', '#111')}>{iv.status}</span></td>
              <td style={tdStyle()}>
                <Button onClick={() => openInvoice(iv)}>Open</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <Button onClick={batchApprove} variant="solid">Batch Approve</Button>
        <Button onClick={batchNeedsInfo}>Needs Info</Button>
        <Button onClick={batchReject}>Reject</Button>
        <div style={{ width: 200 }}>
          <label>Pay from</label>
          <Select value={payBankId} onChange={(e) => setPayBankId(e.target.value)}>
            <option value="">(select)</option>
            {bankList.map((b) => <option key={b.id} value={b.id}>{b.name} ({fmtVND(b.balance)})</option>)}
          </Select>
        </div>
        <div style={{ width: 160 }}>
          <label>Pay date</label>
          <Input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
        </div>
        <Button onClick={schedulePayments}>Schedule</Button>
        <Button onClick={executeScheduled}>Execute</Button>
      </div>

      {drawer && (
        <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, width: '80%', maxHeight: '80%', overflow: 'auto', boxShadow: '0 6px 24px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>{drawer.title}</h4>
              <Button onClick={() => setDrawer(null)}>Close</Button>
            </div>
            <div style={{ marginTop: 12 }}>{drawer.body}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== Small util helpers ====================== */
function sum(arr) {
  return arr.reduce((s, x) => s + (Number(x) || 0), 0);
}
function inPeriod(dateStr, period) {
  if (!dateStr) return false;
  // simple: match year-quarter
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = d.getMonth();
  const q = Math.floor(m / 3) + 1;
  return `${y}-Q${q}` === period;
}
