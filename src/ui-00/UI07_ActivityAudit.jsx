import React, { useState } from 'react'

export default function UI07_ActivityAudit() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [selectedUser, setSelectedUser] = useState('all')
  const [selectedAction, setSelectedAction] = useState('all')

  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-01-22 14:30:25',
      user: 'John Smith',
      action: 'Login',
      module: 'Authentication',
      details: 'Successful login from 192.168.1.100',
      risk: 'Low',
      status: 'Success'
    },
    {
      id: 2,
      timestamp: '2024-01-22 14:28:15',
      user: 'Sarah Johnson',
      action: 'Delete Record',
      module: 'Customer Management',
      details: 'Deleted customer record #CM-2024-0156',
      risk: 'High',
      status: 'Success'
    },
    {
      id: 3,
      timestamp: '2024-01-22 14:25:10',
      user: 'Mike Chen',
      action: 'Update',
      module: 'Financial Records',
      details: 'Modified invoice #INV-2024-0892 amount',
      risk: 'Medium',
      status: 'Success'
    },
    {
      id: 4,
      timestamp: '2024-01-22 14:20:05',
      user: 'Lisa Wang',
      action: 'Export Data',
      module: 'Reports',
      details: 'Exported customer data (1,247 records)',
      risk: 'Medium',
      status: 'Success'
    },
    {
      id: 5,
      timestamp: '2024-01-22 14:15:45',
      user: 'Admin',
      action: 'Failed Login',
      module: 'Authentication',
      details: 'Multiple failed login attempts from 203.192.45.22',
      risk: 'High',
      status: 'Failed'
    }
  ]

  const activityStats = [
    { label: 'Total Activities', value: '1,247', color: 'bg-blue-500' },
    { label: 'High Risk', value: '23', color: 'bg-red-500' },
    { label: 'Failed Actions', value: '8', color: 'bg-orange-500' },
    { label: 'Active Users', value: '156', color: 'bg-green-500' }
  ]

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Low': return 'bg-green-100 text-green-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getStatusColor = (status) => {
    return status === 'Success' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI07 • Activity Audit</div>
            <div className="text-sm text-neutral-600">System activity monitoring and audit trail</div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Export Logs
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {activityStats.map((stat, index) => (
            <div key={index} className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              </div>
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-sm text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="admin">Admin Users</option>
            <option value="regular">Regular Users</option>
          </select>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Actions</option>
            <option value="login">Login/Logout</option>
            <option value="crud">Create/Update/Delete</option>
            <option value="export">Data Export</option>
            <option value="failed">Failed Actions</option>
          </select>

          <input
            type="text"
            placeholder="Search logs..."
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Audit Log Table */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden mb-6">
          <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
            <div className="grid grid-cols-8 gap-4 text-sm font-medium text-neutral-700">
              <div>Timestamp</div>
              <div>User</div>
              <div>Action</div>
              <div>Module</div>
              <div className="col-span-2">Details</div>
              <div>Risk Level</div>
              <div>Status</div>
            </div>
          </div>
          
          <div className="divide-y divide-neutral-200">
            {auditLogs.map((log) => (
              <div key={log.id} className="px-4 py-3 hover:bg-neutral-50">
                <div className="grid grid-cols-8 gap-4 text-sm">
                  <div className="text-neutral-600">{log.timestamp}</div>
                  <div className="font-medium">{log.user}</div>
                  <div>{log.action}</div>
                  <div className="text-neutral-600">{log.module}</div>
                  <div className="col-span-2 text-neutral-600">{log.details}</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(log.risk)}`}>
                      {log.risk}
                    </span>
                  </div>
                  <div className={`font-medium ${getStatusColor(log.status)}`}>
                    {log.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="font-medium text-red-800">Security Alert</div>
          </div>
          <div className="text-sm text-red-700">
            Detected multiple failed login attempts from suspicious IP addresses in the last hour.
            <button className="ml-2 text-red-800 underline hover:no-underline">View Details</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Generate Report
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Configure Alerts
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Archive Logs
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}
