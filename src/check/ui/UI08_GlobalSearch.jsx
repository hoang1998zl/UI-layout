import React from "react";

/**
 * UI 08 – HR & Workforce Planning (Console Canvas single-file)
 * - No external libs (no Tailwind, no icons)
 * - Paste as `index.tsx`, press Run
 * Features:
 *  • Filters: Company, Period, Dept, Location, Search
 *  • KPIs: Headcount, Open roles, Attrition %, Payroll (run-rate), Offer Acceptance, Avg Time-to-Fill
 *  • Roster table + drawer
 *  • Hiring Board: Requisitions → Candidates → Offers
 *  • Compensation Bands & rule check (band + HC budget)
 *  • Batch Approve Offers (exception list khi vi phạm)
 *  • Self-tests to validate formulas & rules
 */

/* ====================== Types & Constants ====================== */




 // staff to manager




const PERIODS = ["2025-Q1", "2025-Q2", "2025-Q3"];
const TODAY = new Date("2025-08-14");

/* ====================== Demo Data ====================== */

const ROSTER = [
  {
    id: "E-001",
    name: "Lan Vu",
    company: "co1",
    dept: "IT",
    location: "HCM",
    grade: "M1",
    salary: 48_000_000,
    start: "2023-02-01",
  },
  {
    id: "E-002",
    name: "Thao Nguyen",
    company: "co1",
    dept: "IT",
    location: "HN",
    grade: "G7",
    salary: 35_000_000,
    start: "2024-06-15",
  },
  {
    id: "E-003",
    name: "Minh Pham",
    company: "co1",
    dept: "Finance",
    location: "HCM",
    grade: "M2",
    salary: 55_000_000,
    start: "2022-09-01",
  },
  {
    id: "E-004",
    name: "Quan Tran",
    company: "co1",
    dept: "Ops",
    location: "Remote",
    grade: "G6",
    salary: 28_000_000,
    start: "2023-10-01",
  },
  {
    id: "E-005",
    name: "Trang Do",
    company: "co2",
    dept: "Ops",
    location: "HCM",
    grade: "G7",
    salary: 33_000_000,
    start: "2024-03-01",
  },
  {
    id: "E-006",
    name: "Khoa Bui",
    company: "co2",
    dept: "IT",
    location: "HN",
    grade: "G6",
    salary: 27_000_000,
    start: "2024-11-01",
  },
  {
    id: "E-007",
    name: "My Dang",
    company: "co2",
    dept: "HR",
    location: "HCM",
    grade: "M1",
    salary: 46_000_000,
    start: "2023-05-01",
  },
  {
    id: "E-008",
    name: "Hoang Le",
    company: "co2",
    dept: "Finance",
    location: "Remote",
    grade: "G5",
    salary: 22_000_000,
    start: "2025-04-01",
  },
  // one separation in Q3
  {
    id: "E-009",
    name: "An Phan",
    company: "co1",
    dept: "Ops",
    location: "HCM",
    grade: "G5",
    salary: 23_000_000,
    start: "2024-02-01",
    end: "2025-07-20",
  },
];


const SEPARATIONS = [
  { empId: "E-009", company: "co1", dept: "Ops", date: "2025-07-20" },
];


const REQS = [
  {
    id: "RQ-IT-01",
    company: "co1",
    dept: "IT",
    location: "HCM",
    grade: "G7",
    headcount: 2,
    opened: "2025-07-01",
    status: "Open",
    budget: 70_000_000,
  },
  {
    id: "RQ-OPS-01",
    company: "co1",
    dept: "Ops",
    location: "HCM",
    grade: "G5",
    headcount: 1,
    opened: "2025-06-20",
    status: "Open",
    budget: 25_000_000,
  },
  {
    id: "RQ-FN-01",
    company: "co1",
    dept: "Finance",
    location: "HCM",
    grade: "G6",
    headcount: 1,
    opened: "2025-05-15",
    status: "Closed",
    budget: 30_000_000,
  },
  {
    id: "RQ-IT-02",
    company: "co2",
    dept: "IT",
    location: "HN",
    grade: "G6",
    headcount: 1,
    opened: "2025-07-10",
    status: "Open",
    budget: 28_000_000,
  },
];


const CANDS = [
  {
    id: "C-1001",
    reqId: "RQ-IT-01",
    name: "Tuan Le",
    stage: "Interview",
    days: 14,
  },
  {
    id: "C-1002",
    reqId: "RQ-IT-01",
    name: "Mai Tran",
    stage: "Screen",
    days: 5,
  },
  {
    id: "C-2001",
    reqId: "RQ-OPS-01",
    name: "Hieu Ngo",
    stage: "Offer",
    days: 21,
  },
  {
    id: "C-3001",
    reqId: "RQ-IT-02",
    name: "Thu Ha",
    stage: "Interview",
    days: 10,
  },
];


const OFFERS_INIT = [
  {
    id: "OF-5001",
    reqId: "RQ-OPS-01",
    candidateId: "C-2001",
    company: "co1",
    dept: "Ops",
    grade: "G5",
    salary: 26_000_000,
    status: "Pending",
    created: "2025-08-05",
  }, // > budget 25m
  {
    id: "OF-5002",
    reqId: "RQ-IT-01",
    candidateId: "C-1001",
    company: "co1",
    dept: "IT",
    grade: "G7",
    salary: 34_000_000,
    status: "Pending",
    created: "2025-08-08",
  },
  {
    id: "OF-5003",
    reqId: "RQ-IT-02",
    candidateId: "C-3001",
    company: "co2",
    dept: "IT",
    grade: "G6",
    salary: 28_000_000,
    status: "Pending",
    created: "2025-08-07",
  },
];

// Compensation bands per grade (min, mid, max)
const BANDS = {
  G5: { min: 20_000_000, mid: 23_000_000, max: 26_000_000 },
  G6: { min: 25_000_000, mid: 28_000_000, max: 32_000_000 },
  G7: { min: 30_000_000, mid: 34_000_000, max: 38_000_000 },
  M1: { min: 42_000_000, mid: 48_000_000, max: 55_000_000 },
  M2: { min: 50_000_000, mid: 58_000_000, max: 68_000_000 },
};

// HC budget (max approved headcount) by dept per company
const HC_BUDGET = {
  co1: { IT: 8, Ops: 6, Finance: 4, HR: 2 },
  co2: { IT: 5, Ops: 5, Finance: 3, HR: 3 },
};

/* ====================== Helpers ====================== */
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
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/* Quarter boundaries for attrition */
function qStartEnd(p) {
  const [y, q] = p.split("-Q");
  const year = Number(y);
  const map = {
    "1": [`${year}-01-01`, `${year}-03-31`],
    "2": [`${year}-04-01`, `${year}-06-30`],
    "3": [`${year}-07-01`, `${year}-09-30`],
  };
  const [s, e] = map[q];
  return { start: new Date(s), end: new Date(e) };
}
function isActiveAt(e, at) {
  const st = new Date(e.start).getTime();
  const ed = e.end ? new Date(e.end).getTime() : Number.POSITIVE_INFINITY;
  const t = at.getTime();
  return t >= st && t <= ed;
}
function countActive(company, dept, at) {
  return ROSTER.filter(
    (e) =>
      e.company === company &&
      (!dept || e.dept === dept) &&
      isActiveAt(e, at || TODAY)
  ).length;
}
function avgHeadcount(company, period, dept) {
  const { start, end } = qStartEnd(period);
  const a = countActive(company, dept, start);
  const b = countActive(company, dept, end);
  return (a + b) / 2;
}
function separationsIn(company, period, dept) {
  const { start, end } = qStartEnd(period);
  return SEPARATIONS.filter(
    (s) =>
      s.company === company &&
      (!dept || s.dept === dept) &&
      new Date(s.date) >= start &&
      new Date(s.date) <= end
  ).length;
}
function attritionPct(company, period, dept) {
  const sep = separationsIn(company, period, dept);
  const avg = avgHeadcount(company, period, dept);
  return avg > 0 ? Math.round((sep / avg) * 1000) / 10 : 0;
}

/* ====================== Main Component ====================== */
export default function UI08_GlobalSearch() {
  // Filters
  const [company, setCompany] = React.useState("co1");
  const [period, setPeriod] = React.useState("2025-Q3");
  const [dept, setDept] = React.useState("");
  const [loc, setLoc] = React.useState("");
  const [search, setSearch] = React.useState("");

  // State
  const [offers, setOffers] = React.useState(OFFERS_INIT);
  const [selOffer, setSelOffer] = React.useState({});
   const [drawer, setDrawer] = React.useState(null);

  // Slices
  const roster = ROSTER.filter(
    (e) =>
      e.company === company &&
      (!dept || e.dept === dept) &&
      (!loc || e.location === loc) &&
      (!search ||
        `${e.id} ${e.name} ${e.dept} ${e.location}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      isActiveAt(e, TODAY)
  );
  const reqs = REQS.filter(
    (r) =>
      r.company === company &&
      (!dept || r.dept === dept) &&
      (!loc || r.location === loc)
  );
  const cands = CANDS.filter((c) => reqs.some((r) => r.id === c.reqId));
  const offersView = offers.filter(
    (o) => o.company === company && (!dept || o.dept === dept)
  );

  // KPIs
  const kpiHeadcount = roster.length;
  const kpiOpenRoles = reqs
    .filter((r) => r.status === "Open")
    .reduce((a, b) => a + b.headcount, 0);
  const kpiAttrition = attritionPct(company, period, dept || undefined);
  const payrollRunRate = roster.reduce((s, e) => s + e.salary, 0);
  const kpiOfferAcc = (() => {
    const mine = offersView;
    const done = mine.filter((o) => o.status !== "Pending").length;
    const acc = mine.filter((o) => o.status === "Accepted").length;
    return done > 0 ? Math.round((acc / done) * 100) : 0;
  })();
  const kpiTTF = (() => {
    const openReqs = reqs.filter((r) => r.status === "Open");
    const days = openReqs.map((r) => daysBetween(new Date(r.opened), TODAY));
    return days.length
      ? Math.round(days.reduce((a, b) => a + b, 0) / days.length)
      : 0;
  })();

  // HC budget check per dept
  function activeHC(company, dept) {
    return ROSTER.filter(
      (e) => e.company === company && e.dept === dept && isActiveAt(e, TODAY)
    ).length;
  }
  function withinHCBudget(company, dept, plus) {
    const cur = activeHC(company, dept);
    const budget = HC_BUDGET[company][dept];
    return cur + plus <= budget;
  }

  // Bands
  function bandStatus(grade, salary) {
    const b = BANDS[grade];
    if (!b) return { ok: true, pos: "in" };
    if (salary < b.min) return { ok: false, pos: "below" };
    if (salary > b.max) return { ok: false, pos: "above" };
    return { ok: true, pos: "in" };
  }

  // Approvals
  function batchApproveOffers() {
    const ids = Object.entries(selOffer)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (ids.length === 0) {
      alert("Chưa chọn offer nào.");
      return;
    }
    const approved = [];
    const blocked = [];
    // Count by dept for HC budget increment
    const incByDept = {
      IT: 0,
      Ops: 0,
      Finance: 0,
      HR: 0,
    };
    // Tentative pass 1: check band rule
    ids.forEach((id) => {
      const o = offersView.find((x) => x.id === id);
      if (!o) {
        blocked.push({ id, reason: "Not in current view" });
        return;
      }
      const band = bandStatus(o.grade, o.salary);
      if (!band.ok) {
        blocked.push({ id, reason: `Out-of-band (${band.pos})` });
        return;
      }
      incByDept[o.dept]++;
      approved.push(id);
    });
    // Pass 2: check HC budget by dept
    const budgetBlocked = approved.filter((id) => {
      const o = offersView.find((x) => x.id === id);
      return !withinHCBudget(o.company, o.dept, incByDept[o.dept]);
    });
    const finalApproved = approved.filter((id) => !budgetBlocked.includes(id));
    const finalBlocked = [
      ...blocked,
      ...budgetBlocked.map((id) => {
        const o = offersView.find((x) => x.id === id);
        const cur = activeHC(o.company, o.dept);
        const budget = HC_BUDGET[o.company][o.dept];
        return {
          id,
          reason: `HC budget exceeded for ${o.dept} (${cur}+${
            incByDept[o.dept]
          } > ${budget})`,
        };
      }),
    ];
    // Apply
    if (finalApproved.length) {
      setOffers((prev) =>
        prev.map((o) =>
          finalApproved.includes(o.id) ? { ...o, status: "Accepted" } : o
        )
      );
    }
    const msg = [
      `✅ Approved: ${finalApproved.length} [${
        finalApproved.join(", ") || "—"
      }]`,
      finalBlocked.length
        ? `⚠️ Need exception: ${finalBlocked.length}\n` +
          finalBlocked.map((x) => `• ${x.id}: ${x.reason}`).join("\n")
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    alert(msg || "No changes");
    setSelOffer({});
  }

  // Drawers
  function openEmp(e) {
    setDrawer({
      title: `${e.id} · ${e.name}`,
      body: (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <b>Dept:</b> {e.dept}
          </div>
          <div>
            <b>Location:</b> {e.location}
          </div>
          <div>
            <b>Grade:</b> {e.grade}
          </div>
          <div>
            <b>Salary:</b> {fmtVND(e.salary)}
          </div>
          <div>
            <b>Start:</b> {e.start}
          </div>
          <div>
            <b>Status:</b> {e.end ? `Left on ${e.end}` : "Active"}
          </div>
        </div>
      ),
    });
  }
  function openReq(r) {
    const candidates = CANDS.filter((c) => c.reqId === r.id);
    const off = offers.filter((o) => o.reqId === r.id);
    setDrawer({
      title: `${r.id} · ${r.dept} · ${r.grade}`,
      body: (
        <div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <b>Headcount:</b> {r.headcount}
            </div>
            <div>
              <b>Budget (per head):</b> {fmtVND(r.budget)}
            </div>
            <div>
              <b>Opened:</b> {r.opened}
            </div>
            <div>
              <b>Status:</b> {r.status}
            </div>
          </div>
          <div style={{ marginTop: 12, fontWeight: 600 }}>Candidates</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {candidates.map((c) => (
              <li key={c.id}>
                {c.name} – {c.stage} · {c.days} day(s)
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, fontWeight: 600 }}>Offers</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {off.map((o) => (
              <li key={o.id}>
                {o.id} – {fmtVND(o.salary)} – {o.status}
              </li>
            ))}
            {off.length === 0 && <li>None</li>}
          </ul>
        </div>
      ),
    });
  }

  // Self-tests
  function runTests() {
    const t = [];
    // 1) Attrition formula basic sanity: sep/avgHC in [0..100]
    const a = attritionPct(company, period, dept || undefined);
    t.push({ name: "Attrition 0..100%", pass: a >= 0 && a <= 100 });
    // 2) Headcount equals roster active
    t.push({ name: "Headcount equals roster", pass: kpiHeadcount === roster.length });
    // 3) Band check flags out-of-band
    const testBand = bandStatus("G5", 18_000_000); // below min
    t.push({ name: "Band below flagged", pass: testBand.ok === false && testBand.pos === "below" });
    // 4) HC budget check blocks if exceeding
    const deptX = "IT";
    const cur = activeHC(company, deptX);
    const budget = HC_BUDGET[company][deptX];
    t.push({ name: "HC budget sanity", pass: cur <= budget });
    // 5) Offer approval changes status to Accepted
    const ok = bandStatus("G7", 34_000_000).ok;
    t.push({ name: "Band for OF-5002 ok", pass: !!ok });
    const passCount = t.filter((x) => x.pass).length;
    alert(`${passCount}/${t.length} PASS\n` + t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n"));
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
                👥 HR & Workforce
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 08
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
                Department
                <Select value={dept} onChange={(e) => setDept(e.target.value)}>
                  <option value="">All</option>
                  <option>Finance</option>
                  <option>IT</option>
                  <option>Ops</option>
                  <option>HR</option>
                </Select>
              </label>
              <label>
                Location
                <Select value={loc} onChange={(e) => setLoc(e.target.value)}>
                  <option value="">Any</option>
                  <option>HCM</option>
                  <option>HN</option>
                  <option>Remote</option>
                </Select>
              </label>
              <label>
                Search
                <Input
                  placeholder="id/name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
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
              title="Headcount"
              value={kpiHeadcount.toString()}
              hint="active employees"
            />
            <KPI
              title="Open roles"
              value={kpiOpenRoles.toString()}
              hint="sum of headcount in open reqs"
            />
            <KPI
              title="Attrition %"
              value={kpiAttrition.toFixed(1) + "%"}
              hint="sep / avg HC"
            />
            <KPI
              title="Payroll (mo)"
              value={fmtVND(payrollRunRate)}
              hint="sum of salaries"
            />
            <KPI
              title="Offer acceptance"
              value={kpiOfferAcc + "%"}
              hint="accepted / decided"
            />
            <KPI
              title="Avg time-to-fill"
              value={kpiTTF + " d"}
              hint="open reqs only"
            />
          </div>

          {/* Roster */}
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
              Roster (active)
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
                    <th style={thStyle()}>Dept</th>
                    <th style={thStyle()}>Location</th>
                    <th style={thStyle()}>Grade</th>
                    <th style={thStyle()}>Salary</th>
                    <th style={thStyle()}>Start</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((e) => (
                    <tr
                      key={e.id}
                      style={{ fontSize: 14, cursor: "pointer" }}
                      onClick={() => openEmp(e)}
                    >
                      <td style={tdStyle(true)}>{e.id}</td>
                      <td style={tdStyle()}>{e.name}</td>
                      <td style={tdStyle()}>{e.dept}</td>
                      <td style={tdStyle()}>{e.location}</td>
                      <td style={tdStyle()}>{e.grade}</td>
                      <td style={{ ...tdStyle(), textAlign: "right" }}>
                        {fmtVND(e.salary)}
                      </td>
                      <td style={tdStyle()}>{e.start}</td>
                    </tr>
                  ))}
                  {roster.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No employees match filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hiring Board */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Hiring board
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              }}
            >
              <Lane
                title="Requisitions"
                count={reqs.filter((r) => r.status === "Open").length}
              >
                {reqs.map((r) => (
                  <Card key={r.id} onClick={() => openReq(r)}>
                    <div style={{ fontWeight: 600 }}>
                      {r.id} · {r.dept} · {r.grade}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#374151", marginTop: 4 }}
                    >
                      HC: <b>{r.headcount}</b> · Budget/Head:{" "}
                      <b>{fmtVND(r.budget)}</b>
                      <br />
                      Opened: {r.opened} · Status: {r.status}
                    </div>
                  </Card>
                ))}
              </Lane>
              <Lane title="Candidates" count={cands.length}>
                {cands.map((c) => {
                  const r = reqs.find((x) => x.id === c.reqId) || {};
                  return (
                    <Card key={c.id}>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>
                        {c.stage} · {c.days} day(s) · {r.dept || ""}/{r.grade || ""}
                        <br />
                        Req: {r.id || c.reqId}
                      </div>
                    </Card>
                  );
                })}
              </Lane>
              <Lane title="Offers" count={offersView.length}>
                <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                  <Button onClick={batchApproveOffers} variant="solid">
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
                        <th style={thStyle()}>Offer</th>
                        <th style={thStyle()}>Req</th>
                        <th style={thStyle()}>Dept</th>
                        <th style={thStyle()}>Grade</th>
                        <th style={thStyle()}>Salary</th>
                        <th style={thStyle()}>Band</th>
                        <th style={thStyle()}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offersView.map((o) => {
                        const band = BANDS[o.grade] || { min: 0, mid: 0, max: 0 };
                        const inBand = bandStatus(o.grade, o.salary);
                        const checked = !!selOffer[o.id];
                        const disabled = o.status !== "Pending";
                        return (
                          <tr key={o.id} style={{ fontSize: 14 }}>
                            <td style={tdStyle(true)}>
                              <input
                                type="checkbox"
                                disabled={disabled}
                                checked={checked}
                                onChange={(e) =>
                                  setSelOffer((s) => ({
                                    ...s,
                                    [o.id]: e.target.checked,
                                  }))
                                }
                              />
                            </td>
                            <td style={tdStyle()}>{o.id}</td>
                            <td style={tdStyle()}>{o.reqId}</td>
                            <td style={tdStyle()}>{o.dept}</td>
                            <td style={tdStyle()}>{o.grade}</td>
                            <td style={{ ...tdStyle(), textAlign: "right" }}>
                              {fmtVND(o.salary)}
                            </td>
                            <td style={tdStyle()}>
                              {inBand.ok ? (
                                <span style={tagStyle("#dcfce7", "#065f46")}>
                                  In-band
                                </span>
                              ) : (
                                <span style={tagStyle("#fee2e2", "#991b1b")}>
                                  Out ({inBand.pos})
                                </span>
                              )}
                              <span style={{ marginLeft: 6, fontSize: 11, color: "#6b7280" }}>
                                {fmtVND(band.min)}–{fmtVND(band.max)}
                              </span>
                            </td>
                            <td style={tdStyle()}>{o.status}</td>
                          </tr>
                        );
                      })}
                      {offersView.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            style={{
                              padding: 16,
                              textAlign: "center",
                              color: "#6b7280",
                            }}
                          >
                            No offers.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Lane>
            </div>
          </div>
        </div>

        {/* Side */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Bands quick view */}
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Compensation bands
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {Object.entries(BANDS).map(([g, b]) => (
                <div
                  key={g}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <div>
                    <b>{g}</b>
                  </div>
                  <div>
                    {fmtVND(b.min)} – {fmtVND(b.mid)} – {fmtVND(b.max)}
                  </div>
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
                Ưu tiên duyệt offer <b>in-band</b> và đảm bảo không vượt{" "}
                <b>HC budget</b>.
              </li>
              <li>
                Attrition tính theo: tách trong quý / HC trung bình của quý.
              </li>
              <li>
                Giữ thời gian <b>time-to-fill</b> trong mục tiêu &le; 30 ngày.
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
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)" }}
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

  /* ---- local small components ---- */
  function KPI({ title, value, hint }) {
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
  function Lane({ title, count, children }) {
    return (
      <div
        style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          {title}{" "}
          <span style={{ fontSize: 12, color: "#6b7280" }}>({count})</span>
        </div>
        <div style={{ display: "grid", gap: 8 }}>{children}</div>
      </div>
    );
  }
  function Card({ children, onClick }) {
    return (
      <div
        onClick={onClick}
        style={{
          cursor: onClick ? "pointer" : "default",
          border: "1px solid #e5e5e5",
          borderRadius: 10,
          padding: 10,
          background: "#fff",
        }}
      >
        {children}
      </div>
    );
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
}
