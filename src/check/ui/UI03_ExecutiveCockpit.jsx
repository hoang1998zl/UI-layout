import React from "react";

/**
 * UI 03 – Executive Cockpit (Canvas single-file)
 * - No external libraries (no Tailwind, no icon libs)
 * - Default export: CanvasDemo (press Run to see dashboard)
 * - Includes: KPI cards + sparkline, Runway alert, OKR alignment,
 *   Portfolio snapshot, BI-style drill drawer, and a Self-test button.
 */

/* ====================== Demo Data & Types ====================== */




const PERIODS = ["2025-Q1", "2025-Q2", "2025-Q3"];

const KPI_DATA = {
  co1: {
    "2025-Q3": {
      revenue: 4200000000,
      cogs: 2350000000,
      opex: 1100000000,
      cash: 1500000000,
      burn: 250000000,
    },
    "2025-Q2": {
      revenue: 3800000000,
      cogs: 2200000000,
      opex: 1050000000,
      cash: 1400000000,
      burn: 260000000,
    },
    "2025-Q1": {
      revenue: 3600000000,
      cogs: 2100000000,
      opex: 1000000000,
      cash: 1200000000,
      burn: 280000000,
    },
  },
  co2: {
    "2025-Q3": {
      revenue: 2800000000,
      cogs: 1650000000,
      opex: 800000000,
      cash: 900000000,
      burn: 170000000,
    },
    "2025-Q2": {
      revenue: 2600000000,
      cogs: 1600000000,
      opex: 780000000,
      cash: 850000000,
      burn: 180000000,
    },
    "2025-Q1": {
      revenue: 2400000000,
      cogs: 1500000000,
      opex: 760000000,
      cash: 800000000,
      burn: 190000000,
    },
  },
};

const PROGRAMS = {
  co1: [
    {
      id: "p1",
      name: "ERP Core",
      budget: 1200000000,
      spend: 650000000,
      progress: 0.62,
      health: "Good",
      risk: "Low",
    },
    {
      id: "p2",
      name: "Mobile App",
      budget: 800000000,
      spend: 520000000,
      progress: 0.48,
      health: "Watch",
      risk: "Medium",
    },
    {
      id: "p3",
      name: "BI & Analytics",
      budget: 600000000,
      spend: 300000000,
      progress: 0.4,
      health: "Good",
      risk: "Low",
    },
  ],
  co2: [
    {
      id: "p3",
      name: "Supply Chain",
      budget: 1000000000,
      spend: 640000000,
      progress: 0.55,
      health: "Watch",
      risk: "Medium",
    },
    {
      id: "p4",
      name: "Infra Upgrade",
      budget: 700000000,
      spend: 400000000,
      progress: 0.35,
      health: "Risk",
      risk: "High",
    },
  ],
};

const OKR = {
  co1: [
    {
      obj: "Tăng trưởng doanh thu 20% Q3",
      krs: [
        {
          name: "Mở 2 thị trường mới",
          target: 2,
          current: 2,
          program: "Mobile App",
        },
        {
          name: "Upsell 15% khách hàng ERP",
          target: 15,
          current: 12,
          program: "ERP Core",
        },
      ],
    },
    {
      obj: "Giảm OPEX 8%",
      krs: [
        {
          name: "Tối ưu chi phí hạ tầng",
          target: 8,
          current: 5,
          program: "Infra Upgrade",
        },
        {
          name: "Tự động hóa báo cáo BI",
          target: 100,
          current: 60,
          program: "BI & Analytics",
        },
      ],
    },
  ],
  co2: [
    {
      obj: "Ổn định chuỗi cung ứng",
      krs: [
        {
          name: "Giảm lead time 10%",
          target: 10,
          current: 6,
          program: "Supply Chain",
        },
        {
          name: "SLA vendor ≥ Silver",
          target: 100,
          current: 85,
          program: "Supply Chain",
        },
      ],
    },
  ],
};

/* ====================== Utils ====================== */
function ebitda(k) {
  return k.revenue - k.cogs - k.opex;
}
function runwayMonths(k) {
  return k.burn > 0 ? Math.floor(k.cash / k.burn) : 0;
}
function fmtMoneyVND(x) {
  return x.toLocaleString("vi-VN") + " ₫";
}
function delta(cur, ref) {
  if (ref == null) return "–";
  const d = ((cur - ref) / (ref || 1)) * 100;
  return (d >= 0 ? "+" : "") + d.toFixed(1) + "%";
}

/* ====================== Small components ====================== */
function Spark({ values }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth || 260,
      h = 40;
    const min = Math.min(...values),
      max = Math.max(...values);
    const pad = 4;
    const xs = values.map((_, i) => pad + (i * (w - 2 * pad)) / (values.length - 1));
    const ys = values.map((v) =>
      max === min ? h / 2 : h - pad - ((v - min) / (max - min)) * (h - 2 * pad)
    );
    const d = ys
      .map((y, i) => (i === 0 ? `M ${xs[i]},${y}` : `L ${xs[i]},${y}`))
      .join(" ");
    el.innerHTML = `<svg width="${w}" height="${h}"><path d="${d}" stroke="currentColor" fill="none" stroke-width="2"/></svg>`;
  }, [values]);
  return <div ref={ref} style={{ marginTop: 8, height: 40, width: "100%" }} />;
}

function KpiCard({
  title,
  value,
  delta,
  onClick,
  children,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        background: "#fff",
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            background: "#f5f5f5",
            borderRadius: 999,
            padding: "2px 8px",
          }}
        >
          {delta}
        </div>
      </div>
      <div style={{ marginTop: 4, fontSize: 22, fontWeight: 600 }}>{value}</div>
      {children}
    </div>
  );
}

function CardProgram({
  name,
  risk,
  budget,
  spend,
  progress,
}) {
  const pct = Math.round(progress * 100);
  const used = Math.min(100, Math.round((spend / budget) * 100));
  const badgeColor =
    risk === "High" ? "#fee2e2" : risk === "Medium" ? "#fef3c7" : "#dcfce7";
  const badgeText =
    risk === "High" ? "#991b1b" : risk === "Medium" ? "#92400e" : "#065f46";
  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
        <span
          style={{
            fontSize: 12,
            background: badgeColor,
            color: badgeText,
            padding: "2px 8px",
            borderRadius: 999,
          }}
        >
          {risk}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginTop: 8,
          fontSize: 12,
          color: "#52525b",
        }}
      >
        <div>
          Budget: <b>{fmtMoneyVND(budget)}</b>
        </div>
        <div>
          Spend: <b>{fmtMoneyVND(spend)}</b>
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12 }}>Progress</div>
      <div
        style={{
          height: 8,
          background: "#f5f5f5",
          borderRadius: 6,
          marginTop: 4,
        }}
      >
        <div
          style={{
            height: 8,
            width: `${pct}%`,
            background: "#111827",
            borderRadius: 6,
          }}
        />
      </div>
      <div style={{ marginTop: 8, fontSize: 12 }}>Budget Used</div>
      <div
        style={{
          height: 8,
          background: "#f5f5f5",
          borderRadius: 6,
          marginTop: 4,
        }}
      >
        <div
          style={{
            height: 8,
            width: `${used}%`,
            background: "#374151",
            borderRadius: 6,
          }}
        />
      </div>
    </div>
  );
}

/* ====================== Main component ====================== */
export function UI03ExecutiveCockpit(props) {
  const [company, setCompany] = React.useState(props?.initialCompany ?? "co1");
  const [period, setPeriod] = React.useState(props?.initialPeriod ?? "2025-Q3");
  const [compare, setCompare] = React.useState(props?.compare ?? "prev-q");
  const [drawer, setDrawer] = React.useState(null);

  const now = KPI_DATA[company][period];
  const prevKey =
    compare === "prev-q"
      ? PERIODS[Math.max(0, PERIODS.indexOf(period) - 1)]
      : compare === "prev-y"
      ? "2024-Q3"
      : null;
  const prev = prevKey ? KPI_DATA[company][prevKey] : null;

  const runway = runwayMonths(now);
  const showAlert = runway < (props?.runwayAlertThreshold ?? 6);

  function openKPIDrill(kind) {
    const data = PROGRAMS[company];
    if (kind === "revenue") {
      setDrawer({
        title: "Doanh thu ước tính theo chương trình",
        body: (
          <table style={{ width: "100%", fontSize: 12 }}>
            <thead>
              <tr style={{ color: "#6b7280" }}>
                <th style={{ textAlign: "left", padding: 4 }}>Program</th>
                <th style={{ textAlign: "right", padding: 4 }}>Revenue est.</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: 4 }}>{p.name}</td>
                  <td style={{ padding: 4, textAlign: "right" }}>
                    {fmtMoneyVND(Math.round(p.spend * 1.2))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      });
    } else if (kind === "ebitda") {
      setDrawer({
        title: "EBITDA theo chương trình",
        body: (
          <table style={{ width: "100%", fontSize: 12 }}>
            <thead>
              <tr style={{ color: "#6b7280" }}>
                <th style={{ textAlign: "left", padding: 4 }}>Program</th>
                <th style={{ textAlign: "right", padding: 4 }}>EBITDA</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => {
                const rev = p.spend * 1.2,
                  cogs = p.spend * 0.7,
                  opex = p.spend * 0.3;
                const val = rev - cogs - opex;
                return (
                  <tr key={p.id}>
                    <td style={{ padding: 4 }}>{p.name}</td>
                    <td style={{ padding: 4, textAlign: "right" }}>
                      {fmtMoneyVND(Math.round(val))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ),
      });
    } else {
      setDrawer({
        title: "Runway breakdown",
        body: (
          <ul style={{ fontSize: 12, color: "#374151", paddingLeft: 18 }}>
            <li>Cash hiện có theo công ty & chương trình</li>
            <li>Burn rate theo tháng (ước tính từ OPEX)</li>
            <li>
              Khuyến nghị: giảm OPEX 5–10% ở các chương trình rủi ro Medium/High
            </li>
          </ul>
        ),
      });
    }
  }

  return (
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
            fontSize: 14,
          }}
        >
          <label>
            Company
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={sel()}
            >
              <option value="co1">Đại Tín Co.</option>
              <option value="co2">Đại Tín Invest</option>
            </select>
          </label>
          <label>
            Period
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={sel()}
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label>
            Currency
            <select disabled value={"VND"} style={sel()}>
              <option value="VND">VND</option>
            </select>
          </label>
          <label>
            Compare
            <select
              value={compare}
              onChange={(e) => setCompare(e.target.value)}
              style={sel()}
            >
              <option value="prev-q">Prev Quarter</option>
              <option value="prev-y">Prev Year</option>
              <option value="none">None</option>
            </select>
          </label>
          <div />
          <div />
        </div>
      </div>

      {/* Alerts */}
      {showAlert && (
        <div
          style={{
            border: "1px solid #fcd34d",
            background: "#fffbeb",
            color: "#92400e",
            borderRadius: 16,
            padding: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div>⚠️</div>
            <div style={{ fontSize: 14 }}>
              <b>Cảnh báo Runway, ưu tiên chương trình ROI cao, hoãn dự án rủi ro.</b>
            </div>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
        }}
      >
        <KpiCard
          title="Revenue"
          value={fmtMoneyVND(now.revenue)}
          delta={delta(now.revenue, prev ? prev.revenue : null)}
          onClick={() => openKPIDrill("revenue")}
        >
          <Spark
            values={[
              KPI_DATA[company]["2025-Q1"].revenue,
              KPI_DATA[company]["2025-Q2"].revenue,
              KPI_DATA[company]["2025-Q3"].revenue,
            ]}
          />
        </KpiCard>
        <KpiCard
          title="EBITDA"
          value={fmtMoneyVND(ebitda(now))}
          delta={delta(ebitda(now), prev ? ebitda(prev) : null)}
          onClick={() => openKPIDrill("ebitda")}
        >
          <Spark
            values={[
              ebitda(KPI_DATA[company]["2025-Q1"]),
              ebitda(KPI_DATA[company]["2025-Q2"]),
              ebitda(KPI_DATA[company]["2025-Q3"]),
            ]}
          />
        </KpiCard>
        <KpiCard
          title="Runway"
          value={runway + " tháng"}
          delta={delta(runway, prev ? runwayMonths(prev) : null)}
          onClick={() => openKPIDrill("runway")}
        >
          <Spark
            values={[
              runwayMonths(KPI_DATA[company]["2025-Q1"]),
              runwayMonths(KPI_DATA[company]["2025-Q2"]),
              runwayMonths(KPI_DATA[company]["2025-Q3"]),
            ]}
          />
        </KpiCard>
      </div>

      {/* Portfolio */}
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 16,
          background: "#fff",
          padding: 12,
        }}
      >
        <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          Portfolio snapshot
        </div>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(2, minmax(0,1fr))",
          }}
        >
          {PROGRAMS[company].map((p) => (
            <CardProgram
              key={p.id}
              name={p.name}
              risk={p.risk}
              budget={p.budget}
              spend={p.spend}
              progress={p.progress}
            />
          ))}
        </div>
      </div>

      {/* OKR Alignment */}
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 16,
          background: "#fff",
          padding: 12,
        }}
      >
        <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          OKR alignment
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {OKR[company].map((o, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>{o.obj}</div>
              <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                {o.krs.map((kr, i) => {
                  const pct = Math.min(100, Math.round((kr.current / kr.target) * 100));
                  return (
                    <div
                      key={i}
                      style={{
                        border: "1px solid #e5e5e5",
                        borderRadius: 12,
                        padding: 8,
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{kr.name}</div>
                      <div
                        style={{
                          height: 8,
                          background: "#f5f5f5",
                          borderRadius: 6,
                          marginTop: 4,
                        }}
                      >
                        <div
                          style={{
                            height: 8,
                            width: `${pct}%`,
                            background: "#111827",
                            borderRadius: 6,
                          }}
                        />
                      </div>
                      <div style={{ marginTop: 4, fontSize: 11, color: "#6b7280" }}>
                        {kr.current}/{kr.target} ({pct}%) • Program: {kr.program}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
              <div style={{ fontSize: 14, fontWeight: 600 }}>{drawer.title}</div>
              <button
                onClick={() => setDrawer(null)}
                style={{
                  borderRadius: 999,
                  padding: 6,
                  background: "transparent",
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

/* ====================== Demo wrapper + tests ====================== */
function sel() {
  return {
    marginTop: 4,
    width: "100%",
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: "8px 12px",
    background: "#fff",
  };
}

function runTests() {
  const t = [];
  const now = KPI_DATA.co1["2025-Q3"];
  t.push({ name: "EBITDA calc", pass: ebitda(now) === now.revenue - now.cogs - now.opex });
  t.push({ name: "Runway integer", pass: Number.isInteger(runwayMonths(now)) });
  const rwQ1 = runwayMonths(KPI_DATA.co1["2025-Q1"]);
  t.push({ name: "Runway alert threshold (Q1 < 6)", pass: rwQ1 < 6 });
  t.push({ name: "OKR has at least 1 objective", pass: OKR.co1 && OKR.co1.length > 0 });
  const passed = t.filter((x) => x.pass).length;
  alert(
    `${passed}/${t.length} PASS\n` + t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n")
  );
}

export default function UI03_ExecutiveCockpit() {
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
                ⏱ Executive Cockpit
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 03 – KPI · OKR · Alerts
              </span>
            </div>
            <button
              onClick={runTests}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: "8px 12px",
                fontSize: 13,
                background: "#fff",
              }}
            >
              ✓ Kiểm thử
            </button>
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
          gridTemplateColumns: "1fr 320px",
        }}
      >
        <div>
          <UI03ExecutiveCockpit />
        </div>
        <div>
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Approvals cần hành động
            </div>
            <ul
              style={{ fontSize: 14, listStyle: "none", padding: 0, margin: 0 }}
            >
              {(() => {
                const base = 12;
                const items = [
                  ["Pending", base],
                  ["Over SLA", Math.floor(base * 0.25)],
                  ["Exception", Math.floor(base * 0.15)],
                ];
                return items.map(([k, v], i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                    }}
                  >
                    <span>{k}</span>
                    <b>{v}</b>
                  </li>
                ));
              })()}
            </ul>
            <a
              href="/shell/r0/approval"
              style={{
                fontSize: 12,
                textDecoration: "underline",
                color: "#374151",
                marginTop: 8,
                display: "inline-block",
              }}
            >
              Mở Approval Center
            </a>
          </div>
          <div
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              background: "#fff",
              padding: 16,
              marginTop: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Gợi ý
            </div>
            <ul style={{ fontSize: 14, paddingLeft: 18 }}>
              <li>Ưu tiên vendors rủi ro Medium/High trước khi batch duyệt.</li>
              <li>
                Runway &lt; 6 tháng: cân nhắc cắt giảm OPEX, trì hoãn dự án.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
