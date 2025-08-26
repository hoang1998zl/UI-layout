import React, { useState } from "react";

export default function UI54_ConversationDesigner() {
  const [intents, setIntents] = useState([
    { id: "i-001", name: "greeting", samples: ["hi", "hello", "good morning"] },
    { id: "i-002", name: "order_status", samples: ["where is my order", "track order"] },
    { id: "i-003", name: "refund_request", samples: ["i want a refund", "return item"] },
  ]);
  const [selected, setSelected] = useState(intents[0].id);

  const selIntent = intents.find((it) => it.id === selected) || intents[0];

  const exportJSON = (payload, filename = "intents_export.json") => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportAll = () => exportJSON({ exportedAt: new Date().toISOString(), intents }, `intents_${new Date().toISOString()}.json`);
  const exportSelected = () => { const i = intents.find((it) => it.id === selected); if (i) exportJSON({ exportedAt: new Date().toISOString(), intent: i }, `intent_${i.id}_${new Date().toISOString()}.json`); };

  const refresh = () => setIntents([
    { id: "i-001", name: "greeting", samples: ["hi", "hello", "good morning"] },
    { id: "i-002", name: "order_status", samples: ["where is my order", "track order"] },
    { id: "i-003", name: "refund_request", samples: ["i want a refund", "return item"] },
  ]);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">UI54 — Conversation Designer</h1>
        <p className="mt-1 text-gray-600">Design intents, sample utterances and simple response flows.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <aside className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Intents</h2>
            <div className="flex gap-2">
              <button onClick={exportAll} className="text-sm px-2 py-1 bg-blue-600 text-white rounded">Export</button>
              <button className="text-sm px-2 py-1 bg-blue-600 text-white rounded">New</button>
              <button onClick={refresh} className="text-sm px-2 py-1 bg-gray-100 rounded">Refresh</button>
            </div>
          </div>
          <ul className="space-y-2">
            {intents.map((it) => (
              <li key={it.id}>
                <button
                  onClick={() => setSelected(it.id)}
                  className={`w-full text-left p-2 rounded ${it.id === selected ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50"}`}
                >
                  <div className="text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-gray-500">{it.samples.length} samples</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Intent: {selIntent.name}</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-gray-100 rounded">Save</button>
                <button className="px-3 py-1 text-sm bg-gray-100 rounded">Train</button>
                <button onClick={exportSelected} className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Export</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-2">Sample Utterances</div>
                <div className="space-y-2">
                  {selIntent.samples.map((s, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded text-sm">{s}</div>
                  ))}
                </div>
                <div className="mt-3">
                  <input className="w-full border p-2 rounded text-sm" placeholder="Add sample utterance" />
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-2">Response Preview</div>
                <div className="p-3 bg-gray-50 rounded text-sm">Simple static preview: "Sure, I can help with that."</div>
                <div className="mt-3 text-xs text-gray-500">Flow Canvas (placeholder)</div>
                <div className="mt-2 h-40 bg-white border rounded flex items-center justify-center text-gray-400">Canvas area</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <h3 className="text-sm font-medium mb-2">Testing</h3>
            <div className="flex gap-2">
              <input className="flex-1 border p-2 rounded" placeholder="Type a test utterance" />
              <button className="px-3 py-1 bg-blue-600 text-white rounded">Run</button>
            </div>
            <div className="mt-3 text-xs text-gray-500">Logs and predictions will appear here after running a test.</div>
          </div>
        </section>
      </div>
    </div>
  );
}
