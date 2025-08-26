import React, { useState } from 'react'

export default function UI03_ExecutiveCockpit() {
  const [timeRange, setTimeRange] = useState('30d')

  const kpiData = [
    { title: 'Revenue', value: '$2.4M', change: '+12.5%', trend: 'up', color: 'text-green-600' },
    { title: 'Profit Margin', value: '18.3%', change: '+2.1%', trend: 'up', color: 'text-green-600' },
    { title: 'Active Users', value: '24.8K', change: '+8.7%', trend: 'up', color: 'text-green-600' },
    { title: 'Customer Satisfaction', value: '4.6/5', change: '-0.2', trend: 'down', color: 'text-red-600' }
  ]

  const recentActivities = [
    { time: '10:30 AM', activity: 'Q4 Budget approved', type: 'finance', status: 'completed' },
    { time: '9:15 AM', activity: 'New partnership signed', type: 'business', status: 'completed' },
    { time: '8:45 AM', activity: 'Product launch meeting', type: 'product', status: 'in-progress' },
    { time: 'Yesterday', activity: 'Monthly report generated', type: 'report', status: 'completed' }
  ]

  const departmentPerformance = [
    { dept: 'Sales', target: 100, actual: 118, color: 'bg-green-500' },
    { dept: 'Marketing', target: 100, actual: 95, color: 'bg-yellow-500' },
    { dept: 'Operations', target: 100, actual: 107, color: 'bg-green-500' },
    { dept: 'Finance', target: 100, actual: 89, color: 'bg-red-500' }
  ]

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI03 • Executive Cockpit</div>
            <div className="text-sm text-neutral-600">Real-time executive dashboard</div>
          </div>
          <div className="flex space-x-2">
            {['7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeRange(period)}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4">
              <div className="text-sm text-neutral-600 mb-1">{kpi.title}</div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">{kpi.value}</div>
              <div className={`text-sm font-medium ${kpi.color} flex items-center`}>
                <span className="mr-1">
                  {kpi.trend === 'up' ? '↗' : '↘'}
                </span>
                {kpi.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Department Performance */}
          <div className="bg-neutral-50 rounded-xl p-4">
            <h3 className="font-semibold mb-4">Department Performance</h3>
            <div className="space-y-3">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm font-medium">{dept.dept}</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${dept.color}`}
                        style={{ width: `${Math.min(dept.actual, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-neutral-600 w-12 text-right">
                      {dept.actual}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-neutral-50 rounded-xl p-4">
            <h3 className="font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.activity}</div>
                    <div className="text-xs text-neutral-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Generate Report
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Schedule Meeting
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            View Analytics
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Export Data
          </button>
        </div>
      </div>
    </div>
  )
}
