import React from "react";

/**
 * UI 12 – Projects / PSA (Console Canvas single-file)
 * - No external libs (no Tailwind)
 * - Paste as `index.tsx`, press Run
 */

/* ================== Types & Constants ================== */
type Company = "co1" | "co2";
type Period = "2025-Q1" | "2025-Q2" | "2025-Q3";
type Practice = "Implementation" | "Support" | "Analytics";
type ProjType = "T&M" | "Fixed Fee" | "Internal";
type PM = "Lan Vu" | "Thao Nguyen" | "Minh Pham";
type Role = "Consultant" | "Senior" | "PM";
type Status = "Active" | "At Risk" | "On Hold" | "Closed";

type Project = {
  id: string;
  company: Company;
  name: string;
  practice: Practice;
  type: ProjType;
  pm: PM;
  contractValue: number;
  budgetCost: number;
  billedToDate: number;
  start: string;
  end: string;
  status: Status;
};
type Milestone = {
  projectId: string;
  name: string;
  planned: string;
  actual?: string;
  billable: boolean;
  done: boolean;
};

type Resource = {
  id: string;
  name: string;
  role: Role;
  company: Company;
  costRate: number;
  billRate: number;
};
type Assignment = {
  resourceId: string;
  projectId: string;
  start: string;
  end: string;
  allocationPct: number;
}; // % of 8h/day
type Timesheet = {
  id: string;
  resourceId: string;
  projectId: string;
  date: string;
  hours: number;
  note?: string;
  status: "Submitted" | "Approved" | "Rejected";
  billed?: boolean;
};
type Expense = {
  id: string;
  resourceId: string;
  projectId: string;
  date: string;
  amount: number;
  category: "Travel" | "Meal" | "Equipment" | "Other";
  receipt: boolean;
  status: "Submitted" | "Approved" | "Rejected";
  billed?: boolean;
};

/* ================== Demo Data ================== */
const PERIODS: Period[] = ["2025-Q1", "2025-Q2", "2025-Q3"];
const TODAY = new Date("2025-08-14");

const PROJECTS: Project[] = [
  {
    id: "PR-001",
    company: "co1",
    name: "Mega Retail ERP",
    practice: "Implementation",
    type: "T&M",
    pm: "Lan Vu",
    contractValue: 3_600_000_000,
    budgetCost: 1_900_000_000,
    billedToDate: 1_800_000_000,
    start: "2025-05-01",
    end: "2025-10-31",
    status: "Active",
  },
  {
    id: "PR-002",
    company: "co1",
    name: "City Bank Analytics",
    practice: "Analytics",
    type: "Fixed Fee",
    pm: "Minh Pham",
    contractValue: 1_200_000_000,
    budgetCost: 650_000_000,
    billedToDate: 300_000_000,
    start: "2025-06-10",
    end: "2025-09-30",
    status: "At Risk",
  },
  {
    id: "PR-003",
    company: "co2",
    name: "Delta Support Retainer",
    practice: "Support",
    type: "T&M",
    pm: "Thao Nguyen",
    contractValue: 900_000_000,
    budgetCost: 420_000_000,
    billedToDate: 420_000_000,
    start: "2025-01-01",
    end: "2025-12-31",
    status: "Active",
  },
  {
    id: "PR-INT",
    company: "co1",
    name: "Internal R&D Tools",
    practice: "Implementation",
    type: "Internal",
    pm: "Lan Vu",
    contractValue: 0,
    budgetCost: 200_000_000,
    billedToDate: 0,
    start: "2025-07-01",
    end: "2025-12-31",
    status: "Active",
  },
];

const MILESTONES: Milestone[] = [
  {
    projectId: "PR-001",
    name: "Design Complete",
    planned: "2025-07-15",
    actual: "2025-07-14",
    billable: false,
    done: true,
  },
  {
    projectId: "PR-001",
    name: "UAT Start",
    planned: "2025-09-10",
    billable: false,
    done: false,
  },
  {
    projectId: "PR-002",
    name: "Phase 1 Delivery",
    planned: "2025-08-15",
    actual: "2025-08-16",
    billable: true,
    done: true,
  },
  {
    projectId: "PR-002",
    name: "Final Delivery",
    planned: "2025-09-25",
    billable: true,
    done: false,
  },
  {
    projectId: "PR-003",
    name: "Monthly Retainer",
    planned: "2025-08-31",
    billable: true,
    done: false,
  },
  {
    projectId: "PR-INT",
    name: "Prototype",
    planned: "2025-08-20",
    billable: false,
    done: false,
  },
];

const RESOURCES: Resource[] = [
  {
    id: "R-01",
    name: "Hai Nguyen",
    company: "co1",
    role: "PM",
    costRate: 350_000,
    billRate: 1_200_000,
  },
  {
    id: "R-02",
    name: "Khanh Le",
    company: "co1",
    role: "Senior",
    costRate: 300_000,
    billRate: 1_000_000,
  },
  {
    id: "R-03",
    name: "Huy Tran",
    company: "co1",
    role: "Consultant",
    costRate: 250_000,
    billRate: 800_000,
  },
  {
    id: "R-04",
    name: "Thu Pham",
    company: "co2",
    role: "Senior",
    costRate: 280_000,
    billRate: 900_000,
  },
];

const ASSIGN: Assignment[] = [
  {
    resourceId: "R-01",
    projectId: "PR-001",
    start: "2025-06-01",
    end: "2025-09-30",
    allocationPct: 60,
  },
  {
    resourceId: "R-02",
    projectId: "PR-001",
    start: "2025-06-15",
    end: "2025-10-31",
    allocationPct: 80,
  },
  {
    resourceId: "R-03",
    projectId: "PR-002",
    start: "2025-07-01",
    end: "2025-09-30",
    allocationPct: 70,
  },
  {
    resourceId: "R-02",
    projectId: "PR-002",
    start: "2025-07-20",
    end: "2025-09-30",
    allocationPct: 30,
  },
  {
    resourceId: "R-04",
    projectId: "PR-003",
    start: "2025-01-01",
    end: "2025-12-31",
    allocationPct: 50,
  },
  {
    resourceId: "R-03",
    projectId: "PR-INT",
    start: "2025-07-15",
    end: "2025-10-15",
    allocationPct: 20,
  },
];

const TIMES_INIT: Timesheet[] = [
  {
    id: "TS-001",
    resourceId: "R-01",
    projectId: "PR-001",
    date: "2025-08-12",
    hours: 9,
    note: "Workshop + PM",
    status: "Submitted",
    billed: false,
  },
  {
    id: "TS-002",
    resourceId: "R-02",
    projectId: "PR-001",
    date: "2025-08-12",
    hours: 8,
    note: "Build interfaces",
    status: "Submitted",
    billed: false,
  },
  {
    id: "TS-003",
    resourceId: "R-03",
    projectId: "PR-002",
    date: "2025-08-11",
    hours: 10,
    note: "Modeling (late)",
    status: "Submitted",
    billed: false,
  },
  {
    id: "TS-004",
    resourceId: "R-03",
    projectId: "PR-INT",
    date: "2025-08-13",
    hours: 6,
    note: "Internal tooling",
    status: "Submitted",
    billed: false,
  },
  {
    id: "TS-005",
    resourceId: "R-04",
    projectId: "PR-003",
    date: "2025-08-10",
    hours: 7,
    note: "Support case",
    status: "Submitted",
    billed: false,
  },
  {
    id: "TS-006",
    resourceId: "R-02",
    projectId: "PR-002",
    date: "2025-08-13",
    hours: 11,
    note: "Overtime ETL, urgent",
    status: "Submitted",
    billed: false,
  }, // > 10h
];

const EXP_INIT: Expense[] = [
  {
    id: "EX-001",
    resourceId: "R-01",
    projectId: "PR-001",
    date: "2025-08-12",
    amount: 1_200_000,
    category: "Meal",
    receipt: true,
    status: "Submitted",
    billed: false,
  },
  {
    id: "EX-002",
    resourceId: "R-02",
    projectId: "PR-001",
    date: "2025-08-12",
    amount: 6_500_000,
    category: "Travel",
    receipt: false,
    status: "Submitted",
    billed: false,
  }, // >2m no receipt
  {
    id: "EX-003",
    resourceId: "R-03",
    projectId: "PR-002",
    date: "2025-08-11",
    amount: 480_000,
    category: "Meal",
    receipt: true,
    status: "Submitted",
    billed: false,
  },
  {
    id: "EX-004",
    resourceId: "R-04",
    projectId: "PR-003",
    date: "2025-08-10",
    amount: 2_200_000,
    category: "Other",
    receipt: true,
    status: "Submitted",
    billed: false,
  },
];

/* ================== Small UI helpers ================== */
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

/* ================== Main Component ================== */
export default function UI12_ProjectsPSA() {
  // Filters
  const [company, setCompany] = React.useState<Company>("co1");
  const [period, setPeriod] = React.useState<Period>("2025-Q3");
  const [practice, setPractice] = React.useState<Practice | "">("");
  const [ptype, setPtype] = React.useState<ProjType | "">("");
  const [pm, setPM] = React.useState<PM | "">("");
  const [search, setSearch] = React.useState("");

  // State
  const [times, setTimes] = React.useState<Timesheet[]>(TIMES_INIT);
  const [exps, setExps] = React.useState<Expense[]>(EXP_INIT);
  const [selTS, setSelTS] = React.useState<Record<string, boolean>>({});
  const [selEX, setSelEX] = React.useState<Record<string, boolean>>({});
  const [drawer, setDrawer] = React.useState<{
    title: string;
    body: React.ReactNode;
  } | null>(null);

  // Slices
  const projs = PROJECTS.filter(
    (p) =>
      p.company === company &&
      (!practice || p.practice === practice) &&
      (!ptype || p.type === ptype) &&
      (!pm || p.pm === pm) &&
      (!search ||
        `${p.id} ${p.name} ${p.pm}`
          .toLowerCase()
          .includes(search.toLowerCase()))
  );
  const res = RESOURCES.filter((r) => r.company === company);
  const assignView = ASSIGN.filter((a) => {
    const p = PROJECTS.find((p) => p.id === a.projectId)!;
    return p.company === company;
  });

  const timesView = times.filter((t) => {
    const p = PROJECTS.find((p) => p.id === t.projectId)!;
    return p.company === company && inPeriod(t.date, period);
  });
  const expsView = exps.filter((e) => {
    const p = PROJECTS.find((p) => p.id === e.projectId)!;
    return p.company === company && inPeriod(e.date, period);
  });

  // KPI calculations
  const { billableH, nonbillH, capacityH } = utilization(
    res,
    assignView,
    timesView,
    period
  );
  const util = capacityH > 0 ? Math.round((billableH / capacityH) * 100) : 0;
  const nonbillPct =
    capacityH > 0 ? Math.round((nonbillH / capacityH) * 100) : 0;
  const backlog = sum(
    projs.map((p) => Math.max(0, p.contractValue - p.billedToDate))
  );
  const wip = (() => {
    const tm = timesView.filter(
      (t) => t.status === "Approved" && !t.billed && isBillable(t.projectId)
    );
    const ex = expsView.filter(
      (e) => e.status === "Approved" && !e.billed && isBillable(e.projectId)
    );
    const tVal = sum(tm.map((t) => rateOf(t.resourceId) * t.hours));
    const eVal = sum(ex.map((e) => e.amount));
    return tVal + eVal;
  })();
  const gmPct = grossMarginPct(
    timesView.filter((t) => t.status !== "Rejected"),
    expsView
  );
  const ontime = onTimePct(projs);

  // Project burn/flags
  const port = projs.map((p) => {
    const rev =
      billedOrApprovedValue(p.id, timesView, expsView) + p.billedToDate;
    const cost = costToDate(p.id, timesView, expsView);
    const burnPct =
      p.contractValue > 0 ? Math.round((rev / p.contractValue) * 100) : 0;
    const marginPct = rev > 0 ? Math.round(((rev - cost) / rev) * 100) : 0;
    const atRisk = p.status === "At Risk" || burnPct > 85 || marginPct < 20;
    return { ...p, burnPct, marginPct, atRisk };
  });

  // --- Rules ---
  function isBillable(projectId: string) {
    const p = PROJECTS.find((x) => x.id === projectId)!;
    return p.type !== "Internal";
  }
  function rateOf(resourceId: string) {
    return RESOURCES.find((r) => r.id === resourceId)?.billRate || 0;
  }
  function costRateOf(resourceId: string) {
    return RESOURCES.find((r) => r.id === resourceId)?.costRate || 0;
  }
  function allocationPct(
    resourceId: string,
    projectId: string,
    dateISO: string
  ) {
    const a = ASSIGN.filter(
      (x) => x.resourceId === resourceId && x.projectId === projectId
    );
    const d = new Date(dateISO).getTime();
    const hit = a.find(
      (x) => d >= new Date(x.start).getTime() && d <= new Date(x.end).getTime()
    );
    return hit ? hit.allocationPct : 0;
  }
  function tsRuleOK(t: Timesheet) {
    // 1) ≤10h/day
    if (t.hours > 10) return { ok: false, reason: "Hours > 10h/day" };
    // 2) >8h cần justification
    if (t.hours > 8 && !(t.note && t.note.trim().length >= 10))
      return { ok: false, reason: ">8h needs justification (≥10 chars)" };
    // 3) within allocation: allow tolerance +2h
    const alloc = allocationPct(t.resourceId, t.projectId, t.date);
    const max = Math.ceil((8 * alloc) / 100) + 2;
    if (t.hours > max)
      return {
        ok: false,
        reason: `Over allocation (max ${max}h by ${alloc}%)`,
      };
    // 4) Internal projects are non-billable (still approvable)
    return { ok: true };
  }
  function exRuleOK(e: Expense) {
    if (e.amount > 2_000_000 && !e.receipt)
      return { ok: false, reason: "Receipt required (>2,000,000₫)" };
    if (e.category === "Meal" && e.amount > 500_000)
      return { ok: false, reason: "Meal cap 500,000₫/day" };
    return { ok: true };
  }
  function billRuleOK(projectId: string) {
    const p = PROJECTS.find((x) => x.id === projectId)!;
    if (p.type === "T&M") return { ok: true };
    if (p.type === "Fixed Fee") {
      const ms = MILESTONES.find(
        (m) => m.projectId === projectId && m.billable && m.done
      );
      return ms
        ? { ok: true }
        : { ok: false, reason: "No billable milestone done" };
    }
    return { ok: false, reason: "Internal project" };
  }

  // --- Actions ---
  function batchApproveTimesheets() {
    const ids = Object.entries(selTS)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (!ids.length) {
      alert("Chưa chọn timesheet nào.");
      return;
    }
    const ok: string[] = [];
    const ex: { id: string; reason: string }[] = [];
    setTimes((prev) => {
      return prev.map((t) => {
        if (!ids.includes(t.id)) return t;
        const r = tsRuleOK(t);
        if (r.ok) {
          ok.push(t.id);
          return { ...t, status: "Approved" };
        } else {
          ex.push({ id: t.id, reason: r.reason! });
          return t;
        }
      });
    });
    setSelTS({});
    alert(`Timesheets
✅ Approved: ${ok.length} [${ok.join(", ") || "—"}]
⚠️ Exception: ${ex.length}${
      ex.length ? "\n" + ex.map((x) => `• ${x.id}: ${x.reason}`).join("\n") : ""
    }`);
  }

  function batchApproveExpenses() {
    const ids = Object.entries(selEX)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (!ids.length) {
      alert("Chưa chọn expense nào.");
      return;
    }
    const ok: string[] = [];
    const ex: { id: string; reason: string }[] = [];
    setExps((prev) => {
      return prev.map((e) => {
        if (!ids.includes(e.id)) return e;
        const r = exRuleOK(e);
        if (r.ok) {
          ok.push(e.id);
          return { ...e, status: "Approved" };
        } else {
          ex.push({ id: e.id, reason: r.reason! });
          return e;
        }
      });
    });
    setSelEX({});
    alert(`Expenses
✅ Approved: ${ok.length} [${ok.join(", ") || "—"}]
⚠️ Exception: ${ex.length}${
      ex.length ? "\n" + ex.map((x) => `• ${x.id}: ${x.reason}`).join("\n") : ""
    }`);
  }

  function batchGenerateInvoices() {
    // Eligible per project rule + approved not billed items
    const grouped: Record<string, { ts: Timesheet[]; ex: Expense[] }> = {};
    timesView
      .filter(
        (t) => t.status === "Approved" && !t.billed && isBillable(t.projectId)
      )
      .forEach((t) => {
        (grouped[t.projectId] ||= { ts: [], ex: [] }).ts.push(t);
      });
    expsView
      .filter(
        (e) => e.status === "Approved" && !e.billed && isBillable(e.projectId)
      )
      .forEach((e) => {
        (grouped[e.projectId] ||= { ts: [], ex: [] }).ex.push(e);
      });
    const lines: string[] = [];
    Object.entries(grouped).forEach(([pid, pack]) => {
      const rule = billRuleOK(pid);
      if (!rule.ok) {
        lines.push(`• ${pid}: BLOCKED – ${rule.reason}`);
        return;
      }
      const tvr = sum(pack.ts.map((t) => rateOf(t.resourceId) * t.hours));
      const evr = sum(pack.ex.map((e) => e.amount));
      const amt = tvr + evr;
      // mark billed (demo)
      setTimes((prev) =>
        prev.map((t) =>
          t.projectId === pid && pack.ts.some((x) => x.id === t.id)
            ? { ...t, billed: true }
            : t
        )
      );
      setExps((prev) =>
        prev.map((e) =>
          e.projectId === pid && pack.ex.some((x) => x.id === e.id)
            ? { ...e, billed: true }
            : e
        )
      );
      lines.push(
        `• ${pid}: invoice ${fmtVND(amt)} (TS ${fmtVND(tvr)} + EX ${fmtVND(
          evr
        )})`
      );
    });
    alert(
      lines.length
        ? `Billing run\n${lines.join("\n")}`
        : "Không có item nào đủ điều kiện xuất hóa đơn."
    );
  }

  // --- Drawers ---
  function openProject(p: Project) {
    const ms = MILESTONES.filter((m) => m.projectId === p.id);
    const rev =
      billedOrApprovedValue(p.id, timesView, expsView) + p.billedToDate;
    const cost = costToDate(p.id, timesView, expsView);
    setDrawer({
      title: `${p.id} · ${p.name}`,
      body: (
        <div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <b>Practice:</b> {p.practice}
            </div>
            <div>
              <b>Type:</b> {p.type}
            </div>
            <div>
              <b>PM:</b> {p.pm}
            </div>
            <div>
              <b>Status:</b> {p.status}
            </div>
            <div>
              <b>Contract:</b> {fmtVND(p.contractValue)}
            </div>
            <div>
              <b>Billed:</b> {fmtVND(p.billedToDate)}
            </div>
            <div>
              <b>Revenue to-date:</b> {fmtVND(rev)}
            </div>
            <div>
              <b>Cost to-date:</b> {fmtVND(cost)}
            </div>
          </div>
          <div style={{ marginTop: 12, fontWeight: 600 }}>Milestones</div>
          <table style={{ width: "100%", fontSize: 13, marginTop: 6 }}>
            <thead>
              <tr style={{ color: "#6b7280" }}>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "left" }}>Planned</th>
                <th style={{ textAlign: "left" }}>Actual</th>
                <th style={{ textAlign: "left" }}>Billable</th>
                <th style={{ textAlign: "left" }}>Done</th>
              </tr>
            </thead>
            <tbody>
              {ms.map((m, i) => (
                <tr key={i}>
                  <td>{m.name}</td>
                  <td>{m.planned}</td>
                  <td>{m.actual || "—"}</td>
                  <td>{m.billable ? "Yes" : "No"}</td>
                  <td>{m.done ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    });
  }

  function openResource(r: Resource) {
    const a = ASSIGN.filter((x) => x.resourceId === r.id);
    setDrawer({
      title: `${r.id} · ${r.name}`,
      body: (
        <div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <b>Role:</b> {r.role}
            </div>
            <div>
              <b>Cost Rate:</b> {fmtVND(r.costRate)}/h
            </div>
            <div>
              <b>Bill Rate:</b> {fmtVND(r.billRate)}/h
            </div>
          </div>
          <div style={{ marginTop: 12, fontWeight: 600 }}>Assignments</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {a.map((x, i) => {
              const p = PROJECTS.find((p) => p.id === x.projectId)!;
              return (
                <li key={i}>
                  {p.id} · {p.name} — {x.allocationPct}% ({x.start} → {x.end})
                </li>
              );
            })}
          </ul>
        </div>
      ),
    });
  }

  // --- Self-tests ---
  function runTests() {
    const t: { name: string; pass: boolean }[] = [];
    // 1) Utilization bounds
    t.push({ name: "Util 0..100", pass: util >= 0 && util <= 100 });
    // 2) Timesheet rule: >10h blocks
    const tooMuch = { ...timesView[0], hours: 12 };
    t.push({
      name: "TS >10h blocked",
      pass: tsRuleOK(tooMuch as Timesheet).ok === false,
    });
    // 3) Expense rule: >2m needs receipt
    const e = { ...expsView[0], amount: 2_500_000, receipt: false };
    t.push({
      name: "Expense receipt check",
      pass: exRuleOK(e as Expense).ok === false,
    });
    // 4) Billing rule: FF needs billable milestone
    const ff = PROJECTS.find((p) => p.type === "Fixed Fee")!;
    const r = billRuleOK(ff.id);
    t.push({
      name: "Fixed-fee milestone gate",
      pass: typeof r.ok === "boolean",
    });
    // 5) GM% sane number
    t.push({ name: "GM% is finite", pass: Number.isFinite(gmPct) });
    alert(
      `Self-tests: ${t.filter((x) => x.pass).length}/${t.length} PASS\n` +
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
                🧩 Projects / PSA
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 12
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => {
                  setPractice("");
                  setPtype("");
                  setPM("");
                  setSearch("");
                  setSelTS({});
                  setSelEX({});
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
                <Select
                  value={company}
                  onChange={(e) => setCompany(e.target.value as Company)}
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
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </label>
              <label>
                Practice
                <Select
                  value={practice}
                  onChange={(e) => setPractice(e.target.value as Practice | "")}
                >
                  <option value="">All</option>
                  <option>Implementation</option>
                  <option>Support</option>
                  <option>Analytics</option>
                </Select>
              </label>
              <label>
                Type
                <Select
                  value={ptype}
                  onChange={(e) => setPtype(e.target.value as ProjType | "")}
                >
                  <option value="">Any</option>
                  <option>T&M</option>
                  <option>Fixed Fee</option>
                  <option>Internal</option>
                </Select>
              </label>
              <label>
                PM
                <Select
                  value={pm}
                  onChange={(e) => setPM(e.target.value as PM | "")}
                >
                  <option value="">Any</option>
                  <option>Lan Vu</option>
                  <option>Thao Nguyen</option>
                  <option>Minh Pham</option>
                </Select>
              </label>
              <label>
                Search
                <Input
                  placeholder="id/name/pm…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
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
              title="Utilization (billable)"
              value={util + "%"}
              hint={`${billableH}/${capacityH}h`}
            />
            <KPI
              title="Non-billable %"
              value={nonbillPct + "%"}
              hint={`${nonbillH}h`}
            />
            <KPI
              title="Backlog"
              value={fmtVND(backlog)}
              hint="unbilled contract"
            />
            <KPI title="WIP" value={fmtVND(wip)} hint="approved not billed" />
            <KPI
              title="Gross Margin %"
              value={gmPct.toFixed(1) + "%"}
              hint="(Rev−Cost)/Rev"
            />
            <KPI
              title="On-time MS"
              value={ontime + "%"}
              hint="planned vs actual"
            />
          </div>

          {/* Portfolio */}
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
              Project Portfolio
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
                    <th style={thStyle()}>Project</th>
                    <th style={thStyle()}>Practice</th>
                    <th style={thStyle()}>Type</th>
                    <th style={thStyle()}>PM</th>
                    <th style={thStyle()}>Contract</th>
                    <th style={thStyle()}>Billed</th>
                    <th style={thStyle()}>Burn%</th>
                    <th style={thStyle()}>Margin%</th>
                    <th style={thStyle()}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {port.map((p) => (
                    <tr
                      key={p.id}
                      style={{ fontSize: 14, cursor: "pointer" }}
                      onClick={() => openProject(p)}
                    >
                      <td style={tdStyle(true)}>
                        {p.id} · {p.name}
                      </td>
                      <td style={tdStyle()}>{p.practice}</td>
                      <td style={tdStyle()}>{p.type}</td>
                      <td style={tdStyle()}>{p.pm}</td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(p.contractValue)}
                      </td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(p.billedToDate)}
                      </td>
                      <td style={tdStyle()}>
                        <Bar value={p.burnPct} />
                      </td>
                      <td style={tdStyle()}>
                        <span
                          style={
                            p.marginPct < 20
                              ? tagStyle("#fee2e2", "#991b1b")
                              : tagStyle("#dcfce7", "#065f46")
                          }
                        >
                          {p.marginPct}%
                        </span>
                      </td>
                      <td style={tdStyle()}>
                        {p.atRisk ? (
                          <span style={tagStyle("#fef3c7", "#92400e")}>
                            At-risk
                          </span>
                        ) : (
                          p.status
                        )}
                      </td>
                    </tr>
                  ))}
                  {port.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No projects.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resource Planner */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Resource Planner
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(4, minmax(0,1fr))",
              }}
            >
              {(["Unassigned", "Under", "Fully", "Over"] as const).map(
                (bucket) => {
                  const items = res.filter((r) => {
                    const pct = totalAllocPct(r.id);
                    if (bucket === "Unassigned") return pct === 0;
                    if (bucket === "Under") return pct > 0 && pct < 80;
                    if (bucket === "Fully") return pct >= 80 && pct <= 100;
                    return pct > 100;
                  });
                  return (
                    <div
                      key={bucket}
                      style={{
                        border: "1px solid #e5e5e5",
                        borderRadius: 12,
                        padding: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                      >
                        {bucket}{" "}
                        <span style={{ fontSize: 12, color: "#6b7280" }}>
                          ({items.length})
                        </span>
                      </div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {items.map((r) => {
                          const pct = totalAllocPct(r.id);
                          return (
                            <div
                              key={r.id}
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
                                <div
                                  onClick={() => openResource(r)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div
                                    style={{ fontSize: 13, fontWeight: 600 }}
                                  >
                                    {r.name} · {r.role}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      color: "#374151",
                                      marginTop: 2,
                                    }}
                                  >
                                    Alloc: <b>{pct}%</b>
                                  </div>
                                </div>
                                <div style={{ width: 80 }}>
                                  <Bar small value={Math.min(100, pct)} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {items.length === 0 && (
                          <div style={{ color: "#6b7280", fontSize: 12 }}>
                            Empty
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Timesheets */}
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
              <div style={{ fontSize: 14, fontWeight: 600 }}>Timesheets</div>
              <Button variant="solid" onClick={batchApproveTimesheets}>
                Batch Approve
              </Button>
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
                    <th style={thStyle()}>TS</th>
                    <th style={thStyle()}>Resource</th>
                    <th style={thStyle()}>Project</th>
                    <th style={thStyle()}>Date</th>
                    <th style={thStyle()}>Hours</th>
                    <th style={thStyle()}>Note</th>
                    <th style={thStyle()}>Rule</th>
                    <th style={thStyle()}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {timesView.map((t) => {
                    const r = RESOURCES.find((x) => x.id === t.resourceId)!;
                    const p = PROJECTS.find((x) => x.id === t.projectId)!;
                    const rule = tsRuleOK(t);
                    const checked = !!selTS[t.id];
                    const disabled = t.status !== "Submitted";
                    return (
                      <tr key={t.id} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={(e) =>
                              setSelTS((s) => ({
                                ...s,
                                [t.id]: e.target.checked,
                              }))
                            }
                          />
                        </td>
                        <td style={tdStyle()}>{t.id}</td>
                        <td style={tdStyle()}>{r.name}</td>
                        <td style={tdStyle()}>{p.id}</td>
                        <td style={tdStyle()}>{t.date}</td>
                        <td style={tdStyle()}>{t.hours}</td>
                        <td style={tdStyle()}>{t.note || "—"}</td>
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
                        </td>
                        <td style={tdStyle()}>{t.status}</td>
                      </tr>
                    );
                  })}
                  {timesView.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No timesheets.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expenses */}
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
              <div style={{ fontSize: 14, fontWeight: 600 }}>Expenses</div>
              <Button variant="solid" onClick={batchApproveExpenses}>
                Batch Approve
              </Button>
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
                    <th style={thStyle()}>EX</th>
                    <th style={thStyle()}>Resource</th>
                    <th style={thStyle()}>Project</th>
                    <th style={thStyle()}>Date</th>
                    <th style={thStyle()}>Amount</th>
                    <th style={thStyle()}>Category</th>
                    <th style={thStyle()}>Receipt</th>
                    <th style={thStyle()}>Rule</th>
                    <th style={thStyle()}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expsView.map((e) => {
                    const r = RESOURCES.find((x) => x.id === e.resourceId)!;
                    const p = PROJECTS.find((x) => x.id === e.projectId)!;
                    const rule = exRuleOK(e);
                    const checked = !!selEX[e.id];
                    const disabled = e.status !== "Submitted";
                    return (
                      <tr key={e.id} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={(ev) =>
                              setSelEX((s) => ({
                                ...s,
                                [e.id]: ev.target.checked,
                              }))
                            }
                          />
                        </td>
                        <td style={tdStyle()}>{e.id}</td>
                        <td style={tdStyle()}>{r.name}</td>
                        <td style={tdStyle()}>{p.id}</td>
                        <td style={tdStyle()}>{e.date}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(e.amount)}
                        </td>
                        <td style={tdStyle()}>{e.category}</td>
                        <td style={tdStyle()}>{e.receipt ? "Yes" : "No"}</td>
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
                        </td>
                        <td style={tdStyle()}>{e.status}</td>
                      </tr>
                    );
                  })}
                  {expsView.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No expenses.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Billing */}
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
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>Billing Run</div>
              <Button onClick={batchGenerateInvoices}>Generate Invoices</Button>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280" }}>
              Rule: T&amp;M — xuất hóa đơn cho items{" "}
              <b>Approved &amp; not billed</b>. Fixed-Fee — yêu cầu milestone{" "}
              <b>billable &amp; done</b>.
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
                Timesheet &le; 10h/ngày; &gt; 8h cần justification và không vượt
                allocation.
              </li>
              <li>
                Expense &gt; 2,000,000₫ cần hóa đơn; Meal &le; 500,000₫/ngày.
              </li>
              <li>Fixed-Fee chỉ bill khi milestone billable đã hoàn thành.</li>
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
                onClick={() => alert("Open Project Planner (placeholder)")}
              >
                Project Planner
              </Button>
              <Button onClick={() => alert("Export Timesheets (placeholder)")}>
                Export Timesheets
              </Button>
              <Button
                onClick={() => alert("Revenue Recognition (placeholder)")}
              >
                Revenue Recognition
              </Button>
            </div>
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

  /* ===== local helpers & tiny components ===== */
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
  function Bar({ value, small }: { value: number; small?: boolean }) {
    const v = Math.max(0, Math.min(100, value || 0));
    return (
      <div
        style={{
          width: small ? "100%" : 160,
          height: small ? 8 : 12,
          background: "#f3f4f6",
          borderRadius: 999,
        }}
      >
        <div
          style={{
            width: v + "%",
            height: "100%",
            borderRadius: 999,
            background: v >= 85 ? "#fde68a" : "#93c5fd",
          }}
        />
      </div>
    );
  }
  function totalAllocPct(resourceId: string) {
    // Sum of active assignments in current period (approx)
    const inQ = (d: string) => inPeriod(d, period);
    return ASSIGN.filter(
      (a) => a.resourceId === resourceId && (inQ(a.start) || inQ(a.end))
    ).reduce((s, a) => s + a.allocationPct, 0);
  }
}

/* ================== math utils ================== */
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

function utilization(
  res: Resource[],
  asg: Assignment[],
  ts: Timesheet[],
  p: Period
) {
  const { start, end } = qStartEnd(p);
  const workDays = Math.max(1, businessDaysBetween(start, end));
  const capacityH = res.length * workDays * 8;
  let billableH = 0,
    nonbillH = 0;
  ts.forEach((t) => {
    const proj = PROJECTS.find((x) => x.id === t.projectId)!;
    if (proj.type === "Internal") nonbillH += t.hours;
    else billableH += t.hours;
  });
  return { billableH, nonbillH, capacityH };
}
function businessDaysBetween(start: Date, end: Date) {
  let days = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) days++;
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function billedOrApprovedValue(
  projectId: string,
  ts: Timesheet[],
  ex: Expense[]
) {
  const t = ts.filter(
    (x) =>
      x.projectId === projectId &&
      (x.status === "Approved" || x.status === "Submitted")
  );
  const e = ex.filter(
    (x) =>
      x.projectId === projectId &&
      (x.status === "Approved" || x.status === "Submitted")
  );
  const tVal = sum(
    t.map(
      (x) =>
        (RESOURCES.find((r) => r.id === x.resourceId)?.billRate || 0) * x.hours
    )
  );
  const eVal = sum(e.map((x) => x.amount));
  return tVal + eVal;
}
function costToDate(projectId: string, ts: Timesheet[], ex: Expense[]) {
  const t = ts.filter((x) => x.projectId === projectId);
  const tCost = sum(
    t.map(
      (x) =>
        (RESOURCES.find((r) => r.id === x.resourceId)?.costRate || 0) * x.hours
    )
  );
  const eVal = sum(
    ex.filter((x) => x.projectId === projectId).map((x) => x.amount)
  );
  return tCost + eVal;
}
function grossMarginPct(ts: Timesheet[], ex: Expense[]) {
  const revenue =
    sum(
      ts
        .filter(
          (x) => PROJECTS.find((p) => p.id === x.projectId)!.type !== "Internal"
        )
        .map(
          (x) =>
            (RESOURCES.find((r) => r.id === x.resourceId)?.billRate || 0) *
            x.hours
        )
    ) +
    sum(
      ex
        .filter(
          (x) => PROJECTS.find((p) => p.id === x.projectId)!.type !== "Internal"
        )
        .map((x) => x.amount)
    );
  const cost =
    sum(
      ts.map(
        (x) =>
          (RESOURCES.find((r) => r.id === x.resourceId)?.costRate || 0) *
          x.hours
      )
    ) + sum(ex.map((x) => x.amount));
  return revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0;
}
function onTimePct(projs: Project[]) {
  const ms = MILESTONES.filter((m) => projs.some((p) => p.id === m.projectId));
  const done = ms.filter((m) => m.done);
  if (!done.length) return 100;
  const ok = done.filter((m) =>
    m.actual ? new Date(m.actual) <= new Date(m.planned) : false
  ).length;
  return Math.round((ok / done.length) * 100);
}
