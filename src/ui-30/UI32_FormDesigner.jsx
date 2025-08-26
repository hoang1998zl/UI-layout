import React from 'react'
import { Card, Tag, Input, Select, Button } from '../ui-helpers.jsx'

export default function UI32_FormDesigner(){
  const [fields, setFields] = React.useState([
    { key:'vendor', label:'Vendor name', type:'text', required:true },
    { key:'amount', label:'Amount (VND)', type:'number', required:true },
    { key:'currency', label:'Currency', type:'select', options:['VND','USD','EUR'], required:true },
  ])
  const [preview, setPreview] = React.useState({})
  const addField = (type)=> setFields(f=>[...f, { key:'f'+(f.length+1), label:'New field', type, required:false }])

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">UI32 · Form Designer</div>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={()=>addField('text')}>+ Text</Button>
          <Button onClick={()=>addField('number')}>+ Number</Button>
          <Button onClick={()=>addField('select')}>+ Select</Button>
          <Button variant="primary" onClick={()=>alert('Saved schema!')}>Save schema</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 space-y-3">
          <Card title="Fields">
            <ul className="space-y-3">
              {fields.map((f,i)=>(
                <li key={f.key} className="rounded-2xl border border-neutral-200 p-3 flex items-center gap-3">
                  <Tag tone="indigo">{f.type}</Tag>
                  <Input className="flex-1" value={f.label} onChange={e=>setFields(arr=>arr.map((x,idx)=> idx===i? {...x, label:e.target.value}:x))}/>
                  <label className="text-sm flex items-center gap-2">
                    <input type="checkbox" checked={f.required} onChange={e=>setFields(arr=>arr.map((x,idx)=> idx===i? {...x, required:e.target.checked}:x))}/>
                    required
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="col-span-6 space-y-3">
          <Card title="Preview">
            <form className="space-y-3">
              {fields.map(f=> (
                <div key={f.key}>
                  <div className="text-xs text-neutral-500 mb-1">{f.label} {f.required && <span className="text-rose-600">*</span>}</div>
                  {f.type==='text' && <Input value={preview[f.key]||''} onChange={e=>setPreview(p=>({...p,[f.key]:e.target.value}))}/>}
                  {f.type==='number' && <Input type="number" value={preview[f.key]||''} onChange={e=>setPreview(p=>({...p,[f.key]:e.target.value}))}/>}
                  {f.type==='select' && (
                    <Select value={preview[f.key]||''} onChange={e=>setPreview(p=>({...p,[f.key]:e.target.value}))}>
                      <option value="" disabled>-- chọn --</option>
                      {(f.options||[]).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </Select>
                  )}
                </div>
              ))}
              <Button variant="primary" onClick={e=>{e.preventDefault(); alert('Submit preview')}}>Submit</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
