import React from 'react'
import { Card, Tag, Button, Input } from '../ui-helpers.jsx'

export default function UI14_CRM360() {
  const [searchTerm, setSearchTerm] = React.useState('')
  
  const customers = [
    { id: 'C001', name: 'Acme Corp', industry: 'Technology', value: '$125k', status: 'Active' },
    { id: 'C002', name: 'Global Industries', industry: 'Manufacturing', value: '$89k', status: 'Lead' },
    { id: 'C003', name: 'StartUp Inc', industry: 'Fintech', value: '$45k', status: 'Prospect' }
  ]
  
  return (
    <div className="p-5 space-y-4">
      <Card 
        title="UI14 • CRM 360° Customer View" 
        subtitle="Comprehensive customer relationship management dashboard"
        actions={
          <div className="flex gap-2">
            <Button variant="primary">Add Customer</Button>
            <Button variant="ghost">Import</Button>
          </div>
        }
      >
        <div className="mb-4">
          <Input 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          {customers.map(customer => (
            <div key={customer.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50">
              <div className="flex-1">
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-neutral-600">{customer.industry} • {customer.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium">{customer.value}</div>
                  <Tag tone={customer.status === 'Active' ? 'green' : customer.status === 'Lead' ? 'amber' : 'slate'}>
                    {customer.status}
                  </Tag>
                </div>
                <Button variant="ghost">View</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
