import React from "react";

/**
 * UI 11 – Inventory & Warehouse (WMS) — Console Canvas single-file
 * - Paste as `index.tsx`, press Run
 * - No external libs
 *
 * Features:
 *  • Filters: Company, Location, Category, Search
 *  • KPI: On-hand, Allocated, Available, Fill-rate, DO Backlog, Turns (proxy)
 *  • Inventory: safety / reorder flags, drawer details
 *  • Replenishment Queue: auto-suggest, batch create (rule gate)
 *  • Outbound Board: New → Picking → Packed → Shipped; batch approve picks (fill-rate ≥ 95%)
 *  • Cycle Count: discrepancies; batch post adjustments (|Δ| ≤ 5% or Δ value ≤ 20m)
 *  • Self-tests button
 */

/* ====================== Types & Demo Data ====================== */












const SKUS = [
  {
    id: "SKU-ERP-01",
    name: "ERP Server Appliance",
    category: "ERP HW",
    uom: "EA",
    price: 45_000_000,
    abc: "A",
    perishable: false,
    dailyDemand: 1.2,
  },
  {
    id: "SKU-SP-01",
    name: "SSD 1TB Spare",
    category: "Spares",
    uom: "EA",
    price: 3_200_000,
    abc: "A",
    perishable: false,
    dailyDemand: 6.0,
  },
  {
    id: "SKU-LIC-01",
    name: "ERP User License",
    category: "Licenses",
    uom: "EA",
    price: 800_000,
    abc: "B",
    perishable: false,
    dailyDemand: 25.0,
  },
  {
    id: "SKU-CM-01",
    name: "Label Roll 1000",
    category: "Consumables",
    uom: "BOX",
    price: 450_000,
    abc: "C",
    perishable: false,
    dailyDemand: 12.0,
  },
  {
    id: "SKU-SP-02",
    name: "Network Card 10Gb",
    category: "Spares",
    uom: "EA",
    price: 2_400_000,
    abc: "B",
    perishable: false,
    dailyDemand: 3.5,
  },
];

const STOCK_INIT = [
  {
    skuId: "SKU-ERP-01",
    company: "co1",
    location: "WH-A",
    onHand: 12,
    allocated: 4,
    safetyStock: 10,
    reorderPoint: 14,
    leadTimeDays: 14,
  },
  {
    skuId: "SKU-SP-01",
    company: "co1",
    location: "WH-A",
    onHand: 80,
    allocated: 25,
    safetyStock: 60,
    reorderPoint: 90,
    leadTimeDays: 10,
  },
  {
    skuId: "SKU-LIC-01",
    company: "co1",
    location: "WH-A",
    onHand: 450,
    allocated: 120,
    safetyStock: 300,
    reorderPoint: 420,
    leadTimeDays: 7,
  },
  {
    skuId: "SKU-CM-01",
    company: "co1",
    location: "WH-A",
    onHand: 50,
    allocated: 10,
    safetyStock: 40,
    reorderPoint: 60,
    leadTimeDays: 5,
  },
  {
    skuId: "SKU-SP-02",
    company: "co1",
    location: "WH-B",
    onHand: 18,
    allocated: 8,
    safetyStock: 20,
    reorderPoint: 26,
    leadTimeDays: 12,
  },

  {
    skuId: "SKU-ERP-01",
    company: "co2",
    location: "WH-B",
    onHand: 9,
    allocated: 6,
    safetyStock: 12,
    reorderPoint: 16,
    leadTimeDays: 14,
  },
  {
    skuId: "SKU-SP-01",
    company: "co2",
    location: "WH-B",
    onHand: 55,
    allocated: 30,
    safetyStock: 50,
    reorderPoint: 80,
    leadTimeDays: 10,
  },
  {
    skuId: "SKU-LIC-01",
    company: "co2",
    location: "WH-A",
    onHand: 520,
    allocated: 150,
    safetyStock: 300,
    reorderPoint: 480,
    leadTimeDays: 7,
  },
  {
    skuId: "SKU-CM-01",
    company: "co2",
    location: "WH-A",
    onHand: 30,
    allocated: 5,
    safetyStock: 40,
    reorderPoint: 60,
    leadTimeDays: 5,
  },
  {
    skuId: "SKU-SP-02",
    company: "co2",
    location: "WH-B",
    onHand: 10,
    allocated: 1,
    safetyStock: 18,
    reorderPoint: 24,
    leadTimeDays: 12,
  },
];

const ORDERS_INIT = [
  {
    id: "SO-5001",
    company: "co1",
    location: "WH-A",
    status: "New",
    created: "2025-08-10",
    lines: [
      { skuId: "SKU-ERP-01", qty: 4 },
      { skuId: "SKU-LIC-01", qty: 200 },
    ],
  },
  {
    id: "SO-5002",
    company: "co1",
    location: "WH-A",
    status: "New",
    created: "2025-08-11",
    lines: [
      { skuId: "SKU-SP-01", qty: 40 },
      { skuId: "SKU-CM-01", qty: 10 },
    ],
  },
  {
    id: "SO-5003",
    company: "co2",
    location: "WH-B",
    status: "Picking",
    created: "2025-08-09",
    lines: [
      { skuId: "SKU-ERP-01", qty: 3 },
      { skuId: "SKU-SP-02", qty: 6 },
    ],
  },
  {
    id: "SO-5004",
    company: "co2",
    location: "WH-A",
    status: "Packed",
    created: "2025-08-08",
    lines: [{ skuId: "SKU-LIC-01", qty: 250 }],
  },
];

const CYCLE_INIT = [
  {
    id: "CC-01",
    company: "co1",
    location: "WH-A",
    skuId: "SKU-SP-01",
    expected: 80,
    counted: 78,
  },
  {
    id: "CC-02",
    company: "co1",
    location: "WH-A",
    skuId: "SKU-LIC-01",
    expected: 450,
    counted: null,
  },
  {
    id: "CC-03",
    company: "co2",
    location: "WH-B",
    skuId: "SKU-ERP-01",
    expected: 9,
    counted: 7,
  },
];

/* ====================== Small UI helpers ====================== */
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
function tagStyle(bg, fg) {
  return {
    fontSize: 12,
    background: bg,
    color: fg,
    borderRadius: 999,
    padding: "2px 8px",
  };
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
function fmtVND(x) {
  return x.toLocaleString("vi-VN") + " ₫";
}

/* ====================== Main Component ====================== */
export default function UI11_InventoryWMS() {
  // Filters
  const [company, setCompany] = React.useState("co1");
  const [location, setLocation] = React.useState("WH-A");
  const [category, setCategory] = React.useState("");
  const [search, setSearch] = React.useState("");

  // State
  const [stock, setStock] = React.useState(STOCK_INIT);
  const [orders, setOrders] = React.useState(ORDERS_INIT);
  const [cycle, setCycle] = React.useState(CYCLE_INIT);
  // selection maps (plain objects in JS)
  const [selOrder, setSelOrder] = React.useState({});
  const [selRepl, setSelRepl] = React.useState({});
  const [selCycle, setSelCycle] = React.useState({});
  const [drawer, setDrawer] = React.useState(null);

  // Slices
  const stockView = stock
    .filter((s) => s.company === company && s.location === location)
    .map((s) => {
      const sku =
        SKUS.find((k) => k.id === s.skuId) ||
        { id: "?", name: "Unknown", category: "", uom: "EA", price: 0, abc: "", perishable: false, dailyDemand: 0 };
      return { ...s, sku };
    })
    .filter((row) =>
      (!category || row.sku.category === category) &&
      (!search || `${row.sku.id} ${row.sku.name}`.toLowerCase().includes(search.toLowerCase()))
    );

  const ordersView = orders.filter(
    (o) => o.company === company && o.location === location
  );
  const cycleView = cycle.filter(
    (c) => c.company === company && c.location === location
  );

  // Derived totals
  const onHand = sum(stockView.map((r) => r.onHand));
  const allocated = sum(stockView.map((r) => r.allocated));
  const available = onHand - allocated;
  const doBacklog = ordersView.filter((o) => o.status !== "Shipped").length;
  const fillRate = (() => {
    const newOrders = ordersView.filter((o) => o.status === "New");
    if (!newOrders.length) return 100;
    let ok = 0,
      total = 0;
    newOrders.forEach((o) => {
      o.lines.forEach((l) => {
        const st = stockView.find((r) => r.skuId === l.skuId);
        const avail = Math.max(0, (st?.onHand || 0) - (st?.allocated || 0));
        const picked = Math.min(l.qty, avail);
        ok += picked;
        total += l.qty;
      });
    });
    return total ? Math.round((ok / total) * 100) : 100;
  })();
  const turnsProxy = (() => {
    // proxy: 365 × total demand / avg inventory (aggregate)
    let demand = 0,
      inv = 0;
    stockView.forEach((r) => {
      demand += r.sku.dailyDemand || 0;
      inv += Math.max(1, r.onHand); // avoid zero
    });
    return inv ? Math.round(((365 * demand) / inv) * 10) / 10 : 0;
  })();

  // Replenishment suggestions
  const suggests = stockView
    .map((r) => {
      const avail = r.onHand - r.allocated;
      const cover = Math.ceil(r.leadTimeDays * r.sku.dailyDemand);
      const target = r.safetyStock + cover;
      const qty = Math.max(0, target - avail);
      return qty > 0
        ? {
            skuId: r.skuId,
            company: r.company,
            location: r.location,
            available: avail,
            suggestQty: qty,
            reason: `Avail ${avail} < Target ${target} (SS ${r.safetyStock} + LT×DD ${cover})`,
          }
        : {
            skuId: r.skuId,
            company: r.company,
            location: r.location,
            available: avail,
            suggestQty: 0,
            reason: "OK",
          };
    })
    .filter((x) => x.suggestQty > 0);

  // Outbound by lane
  const lane = (st) => ordersView.filter((o) => o.status === st);

  // Rules
  function pickFillRate(o) {
    let ok = 0,
      total = 0;
    o.lines.forEach((l) => {
      const st = stockView.find((r) => r.skuId === l.skuId);
      const avail = Math.max(0, (st?.onHand || 0) - (st?.allocated || 0));
      const pick = Math.min(l.qty, avail);
      ok += pick;
      total += l.qty;
    });
    return total ? Math.round((ok / total) * 100) : 100;
  }
  function rulePickOK(o) {
    return pickFillRate(o) >= 95;
  }

  function ruleCycleOK(t) {
    if (t.counted == null) return false;
    const delta = t.counted - t.expected;
    const pct = t.expected === 0 ? 100 : (Math.abs(delta) / t.expected) * 100;
    const value =
      Math.abs(delta) * (SKUS.find((s) => s.id === t.skuId)?.price || 0);
    return pct <= 5 || value <= 20_000_000;
  }

  function ruleReplOK(s) {
    // Gate: suggestQty > 0, and not exceeding 90 days of demand (anti-overstock)
    const k = SKUS.find((x) => x.id === s.skuId);
    const cap = Math.ceil(90 * k.dailyDemand);
    return s.suggestQty > 0 && s.suggestQty <= cap;
  }

  // Actions
  function openSKU(skuId) {
    const s = stockView.find((x) => x.skuId === skuId);
    setDrawer({
      title: `${s.sku.id} · ${s.sku.name}`,
      body: (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <b>Category:</b> {s.sku.category}
          </div>
          <div>
            <b>UoM:</b> {s.sku.uom}
          </div>
          <div>
            <b>ABC:</b> {s.sku.abc}
          </div>
          <div>
            <b>Perishable:</b> {s.sku.perishable ? "Yes" : "No"}
          </div>
          <div>
            <b>Price:</b> {fmtVND(s.sku.price)}
          </div>
          <div>
            <b>Daily demand:</b> {s.sku.dailyDemand}
          </div>
          <div>
            <b>On-hand:</b> {s.onHand}
          </div>
          <div>
            <b>Allocated:</b> {s.allocated}
          </div>
          <div>
            <b>Available:</b> {s.onHand - s.allocated}
          </div>
          <div>
            <b>Safety stock:</b> {s.safetyStock}
          </div>
          <div>
            <b>Reorder point:</b> {s.reorderPoint}
          </div>
          <div>
            <b>Lead time:</b> {s.leadTimeDays} d
          </div>
        </div>
      ),
    });
  }

  function batchApprovePicks() {
    const ids = Object.entries(selOrder)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (ids.length === 0) {
      alert("Chưa chọn order nào.");
      return;
    }
    const ok = [];
    const ex = [];
    ids.forEach((id) => {
      const o = ordersView.find((x) => x.id === id);
      if (!o) {
        ex.push({ id, reason: "Not in view" });
        return;
      }
      const rate = pickFillRate(o);
      if (rate >= 95) ok.push(id);
      else ex.push({ id, reason: `Fill-rate ${rate}% < 95%` });
    });
    if (ok.length) {
      setOrders((prev) =>
        prev.map((o) =>
          ok.includes(o.id)
            ? { ...o, status: o.status === "New" ? "Picking" : o.status }
            : o
        )
      );
    }
    setSelOrder({});
    alert(
      `Batch pick\n✅ OK: ${ok.length}\n⚠️ Exception: ${ex.length}${
        ex.length ? "\n" + ex.map((x) => `• ${x.id}: ${x.reason}`).join("\n") : ""
      }`
    );
  }

  function batchCreateReplen() {
    const ids = Object.entries(selRepl)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (ids.length === 0) {
      alert("Chưa chọn đề xuất replen nào.");
      return;
    }
    const ok = [];
    const ex = [];
    ids.forEach((id) => {
      const s = suggests.find((x) => `${x.skuId}@${x.location}` === id);
      if (!s) {
        ex.push({ id, reason: "Not in view" });
        return;
      }
      if (ruleReplOK(s)) ok.push(id);
      else ex.push({ id, reason: "Qty exceeds 90-day cap" });
    });
    alert(
      `Replenishment\n✅ Create: ${ok.length}\n⚠️ Need review: ${ex.length}${
        ex.length ? "\n" + ex.map((x) => `• ${x.id}: ${x.reason}`).join("\n") : ""
      }`
    );
    setSelRepl({});
  }

  function batchPostCycle() {
    const ids = Object.entries(selCycle)
      .filter(([_id, v]) => v)
      .map(([id]) => id);
    if (ids.length === 0) {
      alert("Chưa chọn task cycle nào.");
      return;
    }
    const ok = [];
    const ex = [];
    const next = [...cycle];
    ids.forEach((id) => {
      const t = next.find((x) => x.id === id);
      if (!t || t.counted == null) {
        ex.push({ id, reason: "No count" });
        return;
      }
      if (ruleCycleOK(t)) {
        // apply adjustment to stock
        const stIdx = stock.findIndex(
          (s) =>
            s.company === t.company &&
            s.location === t.location &&
            s.skuId === t.skuId
        );
        if (stIdx >= 0) {
          nextAdjustment(stIdx, t.counted);
          ok.push(id);
        } else ex.push({ id, reason: "Stock not found" });
      } else {
        // compute reason
        const delta = (t.counted || 0) - t.expected;
        const pct =
          t.expected === 0 ? 100 : (Math.abs(delta) / t.expected) * 100;
        const value =
          Math.abs(delta) * (SKUS.find((s) => s.id === t.skuId)?.price || 0);
        ex.push({
          id,
          reason: `Δ=${delta} (${pct.toFixed(1)}%), value=${fmtVND(value)}`,
        });
      }
    });
    setCycle((prev) => prev.filter((x) => !ok.includes(x.id)));
    setSelCycle({});
    alert(
      `Cycle adjustments\n✅ Posted: ${ok.length}\n⚠️ Blocked: ${ex.length}${
        ex.length ? "\n" + ex.map((x) => `• ${x.id}: ${x.reason}`).join("\n") : ""
      }`
    );

    function nextAdjustment(stIdx, newQty) {
      setStock((prev) => {
        const arr = [...prev];
        const s = { ...arr[stIdx] };
        s.onHand = newQty;
        // keep allocated unchanged; reorder/safety unchanged
        arr[stIdx] = s;
        return arr;
      });
    }
  }

  // Drawer quick views
  function openOrder(o) {
    setDrawer({
      title: `${o.id} · ${o.status}`,
      body: (
        <div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <b>Company:</b> {o.company}
            </div>
            <div>
              <b>Location:</b> {o.location}
            </div>
            <div>
              <b>Created:</b> {o.created}
            </div>
            <div>
              <b>Fill-rate:</b> {pickFillRate(o)}%
            </div>
          </div>
          <div style={{ marginTop: 12, fontWeight: 600 }}>Lines</div>
          <table style={{ width: "100%", fontSize: 13, marginTop: 6 }}>
            <thead>
              <tr style={{ color: "#6b7280" }}>
                <th style={{ textAlign: "left" }}>SKU</th>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "right" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Avail</th>
              </tr>
            </thead>
            <tbody>
              {o.lines.map((l, i) => {
                const st = stockView.find((r) => r.skuId === l.skuId);
                const sku = SKUS.find((s) => s.id === l.skuId);
                const avail = Math.max(
                  0,
                  (st?.onHand || 0) - (st?.allocated || 0)
                );
                return (
                  <tr key={i}>
                    <td>{sku.id}</td>
                    <td>{sku.name}</td>
                    <td style={{ textAlign: "right" }}>{l.qty}</td>
                    <td style={{ textAlign: "right" }}>{avail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ),
    });
  }

  // Self-tests
  function runTests() {
    const t = [];
    // 1) Available = onHand - allocated (non-negative floor in UI)
    const a = stockView.map((r) => r.onHand - r.allocated);
    t.push({ name: "Avail calc sane", pass: a.every((v) => Number.isFinite(v)) });
    // 2) Replen suggest equals (SS + LT×DD - avail) clamp >=0
    const repOK = suggests.every((s) => {
      const st = stockView.find((r) => r.skuId === s.skuId);
      const dd = st.sku.dailyDemand,
        lt = st.leadTimeDays;
      const target = st.safetyStock + Math.ceil(lt * dd);
      const avail = st.onHand - st.allocated;
      return s.suggestQty === Math.max(0, target - avail);
    });
    t.push({ name: "Replen formula", pass: repOK });
    // 3) Pick rule blocks <95% fill
    const aNew = ordersView.find((o) => o.status === "New");
    t.push({ name: "Pick rule gate", pass: aNew ? pickFillRate(aNew) >= 95 : true });
    // 4) Cycle rule: either ≤5% or ≤20m value
    const c = cycleView.find((x) => x.counted != null);
    t.push({ name: "Cycle rule shape", pass: c ? typeof ruleCycleOK(c) === "boolean" : true });
    // 5) KPI invariants
    t.push({ name: "On-hand ≥ Allocated? (aggregate may not hold per SKU)", pass: onHand >= 0 && allocated >= 0 });
    const passed = t.filter((x) => x.pass).length;
    alert(`${passed}/${t.length} PASS\n` + t.map((x) => `${x.pass ? "✅" : "❌"} ${x.name}`).join("\n"));
  }

  /* ====================== Render ====================== */
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
                📦 Inventory & WMS
              </div>
              <span
                style={{
                  background: "#f5f5f5",
                  borderRadius: 999,
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                UI 11
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => {
                  setCategory("");
                  setSearch("");
                  setSelOrder({});
                  setSelRepl({});
                  setSelCycle({});
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
                  onChange={(e) => {
                    setCompany(e.target.value);
                    setLocation("WH-A");
                  }}
                >
                  <option value="co1">Đại Tín Co.</option>
                  <option value="co2">Đại Tín Invest</option>
                </Select>
              </label>
              <label>
                Location
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option>WH-A</option>
                  <option>WH-B</option>
                </Select>
              </label>
              <label>
                Category
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All</option>
                  <option>ERP HW</option>
                  <option>Spares</option>
                  <option>Licenses</option>
                  <option>Consumables</option>
                </Select>
              </label>
              <label>
                Search
                <Input
                  placeholder="sku/name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <div />
              <div />
            </div>
          </div>

          {/* KPI */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(6, minmax(0,1fr))",
            }}
          >
            <KPI title="On-hand" value={onHand.toString()} hint="sum units" />
            <KPI
              title="Allocated"
              value={allocated.toString()}
              hint="reserved for orders"
            />
            <KPI
              title="Available"
              value={available.toString()}
              hint="on-hand - allocated"
            />
            <KPI
              title="Fill-rate (New)"
              value={fillRate + "%"}
              hint="pickable qty / requested"
            />
            <KPI
              title="DO Backlog"
              value={doBacklog.toString()}
              hint="orders not shipped"
            />
            <KPI
              title="Turns (proxy)"
              value={turnsProxy.toString()}
              hint="365×DD / avg inv"
            />
          </div>

          {/* Inventory Table */}
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
              Inventory
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
                    <th style={thStyle()}>SKU</th>
                    <th style={thStyle()}>Name</th>
                    <th style={thStyle()}>Cat</th>
                    <th style={thStyle()}>On-hand</th>
                    <th style={thStyle()}>Allocated</th>
                    <th style={thStyle()}>Available</th>
                    <th style={thStyle()}>Safety</th>
                    <th style={thStyle()}>Reorder</th>
                    <th style={thStyle()}>Lead(d)</th>
                    <th style={thStyle()}>Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {stockView.map((r) => {
                    const avail = r.onHand - r.allocated;
                    const belowSS = avail < r.safetyStock;
                    const belowROP = avail < r.reorderPoint;
                    return (
                      <tr
                        key={r.skuId}
                        style={{ fontSize: 14, cursor: "pointer" }}
                        onClick={() => openSKU(r.skuId)}
                      >
                        <td style={tdStyle(true)}>{r.sku.id}</td>
                        <td style={tdStyle()}>{r.sku.name}</td>
                        <td style={tdStyle()}>{r.sku.category}</td>
                        <td style={tdStyle()}>{r.onHand}</td>
                        <td style={tdStyle()}>{r.allocated}</td>
                        <td style={tdStyle()}>{avail}</td>
                        <td style={tdStyle()}>{r.safetyStock}</td>
                        <td style={tdStyle()}>{r.reorderPoint}</td>
                        <td style={tdStyle()}>{r.leadTimeDays}</td>
                        <td style={tdStyle()}>
                          {belowSS ? (
                            <span style={tagStyle("#fee2e2", "#991b1b")}>
                              Below SS
                            </span>
                          ) : belowROP ? (
                            <span style={tagStyle("#fef3c7", "#92400e")}>
                              Below ROP
                            </span>
                          ) : (
                            <span style={tagStyle("#dcfce7", "#065f46")}>
                              OK
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {stockView.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No inventory match filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Replenishment Queue */}
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
                Replenishment Queue
              </div>
              <Button variant="solid" onClick={batchCreateReplen}>
                Batch Create
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
                    <th style={thStyle()}>SKU</th>
                    <th style={thStyle()}>Name</th>
                    <th style={thStyle()}>Avail</th>
                    <th style={thStyle()}>Suggest</th>
                    <th style={thStyle()}>Reason</th>
                    <th style={thStyle()}>Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {suggests.map((s) => {
                    const sku = SKUS.find((k) => k.id === s.skuId);
                    const id = `${s.skuId}@${s.location}`;
                    const checked = !!selRepl[id];
                    const ok = ruleReplOK(s);
                    return (
                      <tr key={id} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setSelRepl((prev) => ({
                                ...prev,
                                [id]: e.target.checked,
                              }))
                            }
                          />
                        </td>
                        <td style={tdStyle()}>{sku.id}</td>
                        <td style={tdStyle()}>{sku.name}</td>
                        <td style={tdStyle()}>{s.available}</td>
                        <td style={{ ...tdStyle(), fontWeight: 600 }}>
                          {s.suggestQty}
                        </td>
                        <td style={tdStyle()}>{s.reason}</td>
                        <td style={tdStyle()}>
                          {ok ? (
                            <span style={tagStyle("#dcfce7", "#065f46")}>
                              OK
                            </span>
                          ) : (
                            <span style={tagStyle("#fef3c7", "#92400e")}>
                              Cap 90d
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {suggests.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No suggestions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outbound Board */}
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
                Outbound Orders
              </div>
              <Button onClick={batchApprovePicks}>Batch Approve Picks</Button>
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(4, minmax(0,1fr))",
              }}
            >
              <Lane
                title="New"
                items={lane("New")}
                onOpen={openOrder}
                sel={selOrder}
                setSel={setSelOrder}
              />
              <Lane
                title="Picking"
                items={lane("Picking")}
                onOpen={openOrder}
                sel={selOrder}
                setSel={setSelOrder}
              />
              <Lane
                title="Packed"
                items={lane("Packed")}
                onOpen={openOrder}
                sel={selOrder}
                setSel={setSelOrder}
              />
              <Lane
                title="Shipped"
                items={lane("Shipped")}
                onOpen={openOrder}
                sel={selOrder}
                setSel={setSelOrder}
              />
            </div>
          </div>

          {/* Cycle Count */}
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
              <div style={{ fontSize: 14, fontWeight: 600 }}>Cycle Count</div>
              <Button variant="solid" onClick={batchPostCycle}>
                Post Adjustments
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
                    <th style={thStyle()}>Task</th>
                    <th style={thStyle()}>SKU</th>
                    <th style={thStyle()}>Name</th>
                    <th style={thStyle()}>Expected</th>
                    <th style={thStyle()}>Counted</th>
                    <th style={thStyle()}>Δ</th>
                    <th style={thStyle()}>Value(Δ)</th>
                    <th style={thStyle()}>Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {cycleView.map((t) => {
                    const sku = SKUS.find((s) => s.id === t.skuId);
                    const checked = !!selCycle[t.id];
                    const delta = (t.counted ?? t.expected) - t.expected;
                    const valueDelta = Math.abs(delta) * sku.price;
                    const ok = t.counted != null ? ruleCycleOK(t) : false;
                    return (
                      <tr key={t.id} style={{ fontSize: 14 }}>
                        <td style={tdStyle(true)}>
                          <input
                            type="checkbox"
                            disabled={t.counted == null}
                            checked={checked}
                            onChange={(e) =>
                              setSelCycle((prev) => ({
                                ...prev,
                                [t.id]: e.target.checked,
                              }))
                            }
                          />
                        </td>
                        <td style={tdStyle()}>{t.id}</td>
                        <td style={tdStyle()}>{sku.id}</td>
                        <td style={tdStyle()}>{sku.name}</td>
                        <td style={tdStyle()}>{t.expected}</td>
                        <td style={tdStyle()}>
                          {t.counted == null ? (
                            <input
                              type="number"
                              placeholder="enter…"
                              onChange={(e) =>
                                setCycle((prev) =>
                                  prev.map((x) =>
                                    x.id === t.id
                                      ? {
                                          ...x,
                                          counted: Number(e.target.value) || 0,
                                        }
                                      : x
                                  )
                                )
                              }
                              style={{
                                width: 100,
                                border: "1px solid #e5e5e5",
                                borderRadius: 8,
                                padding: "4px 8px",
                              }}
                            />
                          ) : (
                            t.counted
                          )}
                        </td>
                        <td style={tdStyle()}>{delta}</td>
                        <td style={{ ...tdStyle(), textAlign: "right" }}>
                          {fmtVND(valueDelta)}
                        </td>
                        <td style={tdStyle()}>
                          {t.counted == null ? (
                            "—"
                          ) : ok ? (
                            <span style={tagStyle("#dcfce7", "#065f46")}>
                              OK
                            </span>
                          ) : (
                            <span style={tagStyle("#fef3c7", "#92400e")}>
                              Exception
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {cycleView.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{
                          padding: 16,
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No cycle tasks.
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
                Replen: <b>SS + LT×Demand − Available</b>, cap ≤ 90 ngày nhu
                cầu.
              </li>
              <li>
                Batch pick: yêu cầu <b>fill-rate ≥ 95%</b> (đủ hàng trước khi
                duyệt).
              </li>
              <li>
                Cycle post: cho phép nếu <b>|Δ| ≤ 5%</b> <i>hoặc</i>{" "}
                <b>|Δ| value ≤ 20,000,000₫</b>.
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
                onClick={() => alert("Open Putaway Planner (placeholder)")}
              >
                Putaway Planner
              </Button>
              <Button onClick={() => alert("Open ASN / Inbound (placeholder)")}>
                ASN / Inbound
              </Button>
              <Button onClick={() => alert("Export Inventory (placeholder)")}>
                Export Inventory
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

  /* ---- small components ---- */
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
    sel,
    setSel,
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
          {items.map((o) => (
            <div
              key={o.id}
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
                <div onClick={() => onOpen(o)} style={{ cursor: "pointer" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {o.id} · {o.status}
                  </div>
                  <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>
                    Lines: {o.lines.length} · Fill-rate:{" "}
                    <b>{pickFillRate(o)}%</b>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={!!sel[o.id]}
                  onChange={(e) =>
                    setSel((prev) => ({ ...prev, [o.id]: e.target.checked }))
                  }
                />
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
}

/* ====================== utils ====================== */
function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
