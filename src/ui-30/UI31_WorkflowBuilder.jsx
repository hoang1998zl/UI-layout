import React from 'react'
import { Card, Tag, Input, Select, Button } from '../ui-helpers.jsx'

export default function UI31_WorkflowBuilder(){
  const [nodes, setNodes] = React.useState([
    { id:'start', type:'start', label:'Start' },
    { id:'val', type:'task', label:'Validate Input' },
    { id:'branch', type:'gateway', label:'Approved?' },
    { id:'appr', type:'task', label:'Create PO' },
    { id:'rej', type:'task', label:'Notify Rejection' },
    { id:'end', type:'end', label:'End' },
  ])
  const [selected, setSelected] = React.useState(null)
  const types = { start:'bg-emerald-50 border-emerald-200', end:'bg-slate-50 border-slate-200', task:'bg-indigo-50 border-indigo-200', gateway:'bg-amber-50 border-amber-200' }
  const addTask = ()=> setNodes(n=>[...n, { id:'task'+(n.length+1), type:'task', label:'New Task' }])

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">UI31 · Workflow Builder</div>
        <Button className="ml-auto" onClick={addTask}>+ Add task</Button>
        <Button variant="primary" onClick={()=>alert('Saved!')}>Save</Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <Card title="Canvas" subtitle="Drag & select (demo)">
            <div className="grid grid-cols-6 gap-4">
              {nodes.map(n => (
                <button key={n.id} onClick={()=>setSelected(n)} className={`rounded-2xl border p-4 text-sm text-left shadow-sm ${types[n.type]}`}>
                  <div className="text-xs uppercase tracking-wide text-neutral-500">{n.type}</div>
                  <div className="font-medium">{n.label}</div>
                  <div className="text-[11px] text-neutral-500 mt-1">id: {n.id}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>
        <div className="col-span-3 space-y-3">
          <Card title="Inspector" subtitle={selected? selected.id : '—'} actions={selected && <Tag tone="indigo">{selected.type}</Tag>}>
            {selected ? (
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Label</div>
                  <Input value={selected.label} onChange={e=>setSelected({...selected, label:e.target.value})}/>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Type</div>
                  <Select value={selected.type} onChange={e=>setSelected({...selected, type:e.target.value})}>
                    <option value="start">start</option>
                    <option value="task">task</option>
                    <option value="gateway">gateway</option>
                    <option value="end">end</option>
                  </Select>
                </div>
                <Button onClick={()=>alert('Validate OK')}>Validate</Button>
              </div>
            ) : <div className="text-sm text-neutral-500">Chọn 1 node để chỉnh sửa.</div>}
          </Card>
        </div>
      </div>
    </div>
  )
}
