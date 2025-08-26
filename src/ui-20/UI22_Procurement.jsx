import React from 'react'
import { Card, Tag, Button, Select, Input } from '../ui-helpers.jsx'

export default function UI22_Procurement() {
  const [filter, setFilter] = React.useState('all')
  const [search, setSearch] = React.useState('')
  
  const purchaseOrders = [
    { id: 'PO-2024-001', vendor: 'Tech Supplies Ltd', amount: '$15,400', status: 'Pending', items: 12, date: '2024-08-20' },
    { id: 'PO-2024-002', vendor: 'Office Solutions', amount: '$3,200', status: 'Approved', items: 8, date: '2024-08-19' },
    { id: 'PO-2024-003', vendor: 'Industrial Parts Co', amount: '$28,900', status: 'In Transit', items: 24, date: '2024-08-18' }
  ]
  
  return (
    <div className="p-5 space-y-4">
      <Card 
        title="UI22 • Procurement Management" 
        subtitle="Purchase orders, vendor management, and procurement workflows"
        actions={
          <div className="flex gap-2">
            <Button variant="primary">New PO</Button>
            <Button variant="ghost">Reports</Button>
          </div>
        }
      >
        <div className="flex gap-3 mb-4">
          <Input 
            placeholder="Search orders, vendors..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-32">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="transit">In Transit</option>
          </Select>
        </div>
        
        <div className="space-y-3">
          {purchaseOrders.map(po => (
            <div key={po.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="font-medium">{po.id}</div>
                  <Tag tone={po.status === 'Approved' ? 'green' : po.status === 'Pending' ? 'amber' : 'indigo'}>
                    {po.status}
                  </Tag>
                </div>
                <div className="text-sm text-neutral-600">{po.vendor} • {po.items} items • {po.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-bold text-lg">{po.amount}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost">View</Button>
                  <Button variant="primary">Process</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
