import React from 'react'
import { Card, Tag, Input, Select, Button } from '../ui-helpers.jsx'

export default function UI33_RulesEngine(){
  const [rules, setRules] = React.useState([
    { id:'R-001', name:'PO > 200M requires CFO', expr:'amount > 200_000_000', priority:1, status:'Active' },
    { id:'R-017', name:'Vendor must be active', expr:'vendor.status == "active"', priority:2, status:'Active' },
    { id:'R-099', name:'Auto-reject blacklisted', expr:'vendor.blacklist == true', priority:0, status:'Active' },
  ])
  const [test, setTest] = React.useState({ amount: 180_000_000, 'vendor.status':'active', 'vendor.blacklist': false })
  const runTest = ()=> alert('Evaluated ' + rules.length + ' rules (demo)')

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">UI33 · Rules Engine</div>
        <Button className="ml-auto" onClick={()=>setRules(r=>[...r, {id:'R-'+String(r.length+1).padStart(3,'0') , name:'New rule', expr:'true', priority:5, status:'Draft'}])}>+ New rule</Button>
        <Button variant="primary" onClick={()=>alert('Published!')}>Publish</Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7 space-y-3">
          <Card title="Rules">
            <table className="w-full text-sm">
              <thead className="text-left text-neutral-500">
                <tr><th className="py-2">ID</th><th>Name</th><th>Expression</th><th>Priority</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rules.map((r,i)=>(
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{r.id}</td>
                    <td><Input value={r.name} onChange={e=>setRules(arr=>arr.map((x,idx)=> idx===i? {...x, name:e.target.value}:x))}/></td>
                    <td><Input value={r.expr} onChange={e=>setRules(arr=>arr.map((x,idx)=> idx===i? {...x, expr:e.target.value}:x))}/></td>
                    <td><Input type="number" value={r.priority} onChange={e=>setRules(arr=>arr.map((x,idx)=> idx===i? {...x, priority:Number(e.target.value)}:x))}/></td>
                    <td><Select value={r.status} onChange={e=>setRules(arr=>arr.map((x,idx)=> idx===i? {...x, status:e.target.value}:x))}>
                      <option>Active</option><option>Draft</option><option>Disabled</option>
                    </Select></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        <div className="col-span-5 space-y-3">
          <Card title="Test payload">
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-xs text-neutral-500 mb-1">amount</div>
                <Input type="number" value={test.amount} onChange={e=>setTest(t=>({...t, amount:Number(e.target.value)}))}/>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">vendor.status</div>
                <Select value={test['vendor.status']} onChange={e=>setTest(t=>({...t, ['vendor.status']:e.target.value}))}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input id="bl" type="checkbox" checked={test['vendor.blacklist']} onChange={e=>setTest(t=>({...t, ['vendor.blacklist']:e.target.checked}))}/>
                <label htmlFor="bl" className="text-sm">vendor.blacklist</label>
              </div>
              <Button variant="primary" onClick={runTest}>Run test</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
