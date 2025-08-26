import React from 'react'
import { Card, Tag, Input, Select, Button } from '../ui-helpers.jsx'

export default function UI34_DocGenTemplate(){
  const [vars, setVars] = React.useState({ vendor:'Công ty ABC', amount: 120_000_000, date:'2025-08-21' })
  const [tpl, setTpl] = React.useState('Hợp đồng với {{vendor}} trị giá {{amount}} VND, ngày {{date}}.')
  const render = ()=> tpl.replace(/{{(\w+)}}/g, (_,k)=> String(vars[k]??''))

  return (
    <div className="p-5 space-y-4">
      <div className="text-lg font-semibold">UI34 · Document Template & Generation</div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 space-y-3">
          <Card title="Variables">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-neutral-500 mb-1">vendor</div>
                <Input value={vars.vendor} onChange={e=>setVars(v=>({...v, vendor:e.target.value}))}/>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">amount (VND)</div>
                <Input type="number" value={vars.amount} onChange={e=>setVars(v=>({...v, amount:Number(e.target.value)}))}/>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1">date</div>
                <Input type="date" value={vars.date} onChange={e=>setVars(v=>({...v, date:e.target.value}))}/>
              </div>
            </div>
          </Card>
          <Card title="Template">
            <textarea className="w-full h-40 rounded-xl border border-neutral-200 p-3 text-sm" value={tpl} onChange={e=>setTpl(e.target.value)} />
            <div className="text-xs text-neutral-500 mt-2">Sử dụng cú pháp {'{'}{'{'}key{'}'}{'}'} · key hợp lệ: vendor, amount, date</div>
          </Card>
        </div>
        <div className="col-span-6 space-y-3">
          <Card title="Preview">
            <div className="rounded-xl border border-neutral-200 p-4 text-sm bg-neutral-50 whitespace-pre-wrap">{render()}</div>
            <div className="mt-3 flex items-center gap-2">
              <Button onClick={()=>alert('Export DOCX (demo)')}>Export DOCX</Button>
              <Button onClick={()=>alert('Export PDF (demo)')}>Export PDF</Button>
              <Button variant="primary" onClick={()=>alert('Send for e-sign (demo)')}>Send Sign</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
