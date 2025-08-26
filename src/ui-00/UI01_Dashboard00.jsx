import React from 'react'
import { Card, Tag, Button } from '../ui-helpers.jsx'

export default function UI01_Dashboard00() {
  return (
    <div className="p-5 space-y-4">
      <Card title="UI01 • Dashboard Overview" subtitle="Central command center for business operations">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-700">1,234</div>
            <div className="text-sm text-blue-600">Active Users</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-700">98.5%</div>
            <div className="text-sm text-green-600">System Uptime</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
            <div className="text-2xl font-bold text-amber-700">42</div>
            <div className="text-sm text-amber-600">Pending Tasks</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-700">$2.4M</div>
            <div className="text-sm text-purple-600">Revenue (MTD)</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="primary">View Details</Button>
          <Button variant="ghost">Export Report</Button>
          <Tag tone="green">Live Data</Tag>
        </div>
      </Card>
    </div>
  )
}
