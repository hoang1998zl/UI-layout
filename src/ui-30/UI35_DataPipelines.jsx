import React from 'react'
import { Card, Tag, Input, Select, Button } from '../ui-helpers.jsx'

export default function UI35_DataPipelines(){
  const [filter, setFilter] = React.useState('all')
  const rows = [
    { id:'PL-ETL-CRM', source:'CRM', target:'DWH', latency:'6m', status:'Healthy', last:'10:12' },
    { id:'PL-ERP-AP', source:'ERP.AP', target:'DWH', latency:'14m', status:'Degraded', last:'10:08' },
    { id:'PL-WMS', source:'WMS', target:'DWH', latency:'3m', status:'Healthy', last:'10:11' },
    { id:'PL-HRM', source:'HRM', target:'DWH', latency:'—', status:'Failed', last:'09:58' },
  ].filter(r => filter==='all' || r.status===filter)

  const tone = (s)=> s==='Healthy'?'green':(s==='Degraded'?'amber': s==='Failed'?'rose':'slate')

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">UI35 · Data Pipelines Monitor</div>
        <div className="ml-auto flex items-center gap-2">
          <Select value={filter} onChange={e=>setFilter(e.target.value)} className="w-[160px]">
            <option value="all">All</option>
            <option value="Healthy">Healthy</option>
            <option value="Degraded">Degraded</option>
            <option value="Failed">Failed</option>
          </Select>
          <Button onClick={()=>alert('Create pipeline')}>+ New pipeline</Button>
          <Button variant="primary" onClick={()=>alert('Deploy changes')}>Deploy</Button>
        </div>
      </div>

      <Card title="Pipelines">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-500">
            <tr><th className="py-2">ID</th><th>Source</th><th>Target</th><th>Latency</th><th>Status</th><th className="text-right">Actions</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="py-2">{r.id}</td>
                <td>{r.source}</td>
                <td>{r.target}</td>
                <td>{r.latency}</td>
                <td><Tag tone={tone(r.status)}>{r.status}</Tag></td>
                <td className="text-right">
                  <Button className="mr-2" onClick={()=>alert('Run '+r.id)}>Run</Button>
                  <Button onClick={()=>alert('Logs '+r.id)}>Logs</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
