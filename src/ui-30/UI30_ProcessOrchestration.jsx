import React from 'react'
import { Card, Tag, Input, Select, Button } from '../ui-helpers.jsx'

export default function UI30_ProcessOrchestration(){ 
  const [env, setEnv] = React.useState('prod')
  const [search, setSearch] = React.useState('')
  const processes = [
    { id:'PR-AP', name:'Accounts Payable', owner:'Finance', runs:382, fail:3, sla:'99.2%', status:'Healthy' },
    { id:'PR-PO', name:'Purchase Order', owner:'Procurement', runs:520, fail:11, sla:'98.1%', status:'Degraded' },
    { id:'PR-WMS', name:'Warehouse Sync', owner:'Ops', runs:214, fail:0, sla:'100%', status:'Healthy' },
    { id:'PR-CRM', name:'CRM Nightly ETL', owner:'Sales', runs:90, fail:2, sla:'97.6%', status:'At Risk' },
  ].filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))

  const badge = (s)=> s==='Healthy'?'green':(s==='Degraded'?'amber':'rose')

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">UI30 · Process Orchestration</div>
        <Tag tone="indigo">{env.toUpperCase()}</Tag>
        <div className="ml-auto flex items-center gap-2 w-[360px]">
          <Input placeholder="Tìm process…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <Select value={env} onChange={e=>setEnv(e.target.value)} className="w-[140px]">
            <option value="prod">Production</option>
            <option value="staging">Staging</option>
            <option value="dev">Development</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-3">
          {processes.map(p => (
            <Card key={p.id} title={`${p.id} · ${p.name}`} subtitle={`Owner: ${p.owner}`} actions={
              <div className="flex items-center gap-2">
                <Tag tone={badge(p.status)}>{p.status}</Tag>
                <Button onClick={()=>alert('Run now: '+p.id)} variant="primary">Run now</Button>
                <Button onClick={()=>alert('Schedule '+p.id)}>Schedule…</Button>
              </div>
            }>
              <div className="grid grid-cols-4 text-sm">
                <div><div className="text-neutral-500 text-xs">Runs (30d)</div><div className="font-medium">{p.runs}</div></div>
                <div><div className="text-neutral-500 text-xs">Failures</div><div className="font-medium">{p.fail}</div></div>
                <div><div className="text-neutral-500 text-xs">SLA</div><div className="font-medium">{p.sla}</div></div>
                <div className="text-right">
                  <Button onClick={()=>alert('Timeline '+p.id)} className="ml-auto">Timeline</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="col-span-4 space-y-3">
          <Card title="Quick actions">
            <div className="flex flex-col gap-2">
              <Button onClick={()=>alert('Create process')} variant="primary">+ New process</Button>
              <Button onClick={()=>alert('Import BPMN')}>Import BPMN</Button>
              <Button onClick={()=>alert('Permissions')}>Permissions</Button>
            </div>
          </Card>
          <Card title="Recent incidents" subtitle="7 days">
            <ul className="text-sm space-y-2">
              <li className="flex items-center justify-between"><span>PO validation timeout</span><Tag tone="amber">Degraded</Tag></li>
              <li className="flex items-center justify-between"><span>CRM ETL step 3</span><Tag tone="rose">At Risk</Tag></li>
              <li className="flex items-center justify-between"><span>WMS sync</span><Tag tone="green">Recovered</Tag></li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
