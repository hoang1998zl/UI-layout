import React, { useState } from 'react'

export default function UI02_ApprovalExec() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month')

  const approvalStats = [
    { label: 'Pending', value: 24, color: 'bg-orange-500', change: '+12%' },
    { label: 'Approved', value: 156, color: 'bg-green-500', change: '+8%' },
    { label: 'Rejected', value: 8, color: 'bg-red-500', change: '-3%' },
    { label: 'Total', value: 188, color: 'bg-blue-500', change: '+15%' }
  ]

  const pendingApprovals = [
    { id: 1, type: 'Purchase Order', amount: '$45,000', requestor: 'John Smith', priority: 'High', days: 2 },
    { id: 2, type: 'Travel Request', amount: '$3,200', requestor: 'Sarah Johnson', priority: 'Medium', days: 5 },
    { id: 3, type: 'Budget Amendment', amount: '$120,000', requestor: 'Mike Chen', priority: 'High', days: 1 },
    { id: 4, type: 'Contract Renewal', amount: '$85,000', requestor: 'Lisa Wang', priority: 'Low', days: 8 }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Low': return 'bg-green-100 text-green-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI02 • Approval Executive</div>
            <div className="text-sm text-neutral-600">Executive approval management dashboard</div>
          </div>
          <select 
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-quarter">This Quarter</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {approvalStats.map((stat, index) => (
            <div key={index} className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <div className="text-xs text-green-600 font-medium">{stat.change}</div>
              </div>
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-sm text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pending Approvals */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Approvals</h3>
            <button className="text-blue-600 text-sm hover:text-blue-700">View All</button>
          </div>
          
          <div className="space-y-3">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium">{item.type}</div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <div className="text-sm text-neutral-500">{item.days} days ago</div>
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">
                      by {item.requestor} • {item.amount}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Bulk Approve
          </button>
          <button className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50">
            Export Report
          </button>
          <button className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}
