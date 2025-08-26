import React, { useState } from 'react'

export default function UI12_ProductionPlanning() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [activeView, setActiveView] = useState('schedule')

  const productionStats = [
    { label: 'Planned Orders', value: '156', trend: '+12%', color: 'bg-blue-500' },
    { label: 'In Progress', value: '89', trend: '+5%', color: 'bg-yellow-500' },
    { label: 'Completed', value: '234', trend: '+18%', color: 'bg-green-500' },
    { label: 'Delayed', value: '12', trend: '-8%', color: 'bg-red-500' }
  ]

  const productionOrders = [
    { id: 'PO-2024-001', product: 'Widget A', quantity: 500, priority: 'High', startDate: '2024-01-23', endDate: '2024-01-25', status: 'In Progress', progress: 65 },
    { id: 'PO-2024-002', product: 'Component B', quantity: 1200, priority: 'Medium', startDate: '2024-01-24', endDate: '2024-01-26', status: 'Scheduled', progress: 0 },
    { id: 'PO-2024-003', product: 'Assembly C', quantity: 300, priority: 'Low', startDate: '2024-01-25', endDate: '2024-01-28', status: 'Scheduled', progress: 0 },
    { id: 'PO-2024-004', product: 'Product D', quantity: 800, priority: 'High', startDate: '2024-01-22', endDate: '2024-01-24', status: 'Delayed', progress: 45 }
  ]

  const resources = [
    { name: 'Machine A', utilization: 85, status: 'Running', nextMaintenance: '2024-02-01' },
    { name: 'Machine B', utilization: 67, status: 'Running', nextMaintenance: '2024-01-28' },
    { name: 'Line 1', utilization: 92, status: 'Running', nextMaintenance: '2024-02-05' },
    { name: 'Line 2', utilization: 45, status: 'Maintenance', nextMaintenance: '2024-01-25' }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Low': return 'bg-green-100 text-green-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700'
      case 'Scheduled': return 'bg-neutral-100 text-neutral-700'
      case 'Completed': return 'bg-green-100 text-green-700'
      case 'Delayed': return 'bg-red-100 text-red-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI12 • Production Planning</div>
            <div className="text-sm text-neutral-600">Manufacturing schedule and resource management</div>
          </div>
          <div className="flex space-x-2">
            <select 
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              New Order
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {productionStats.map((stat, index) => (
            <div key={index} className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
              </div>
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-sm text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'schedule', label: 'Production Schedule' },
            { id: 'resources', label: 'Resource Utilization' }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === view.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Production Schedule View */}
        {activeView === 'schedule' && (
          <div className="space-y-4">
            <div className="overflow-hidden border border-neutral-200 rounded-lg">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                <div className="grid grid-cols-8 gap-4 text-sm font-medium text-neutral-700">
                  <div>Order ID</div>
                  <div>Product</div>
                  <div>Quantity</div>
                  <div>Priority</div>
                  <div>Start Date</div>
                  <div>End Date</div>
                  <div>Status</div>
                  <div>Progress</div>
                </div>
              </div>
              <div className="divide-y divide-neutral-200">
                {productionOrders.map((order) => (
                  <div key={order.id} className="px-4 py-3 hover:bg-neutral-50">
                    <div className="grid grid-cols-8 gap-4 text-sm items-center">
                      <div className="font-medium">{order.id}</div>
                      <div>{order.product}</div>
                      <div>{order.quantity}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </div>
                      <div className="text-neutral-600">{order.startDate}</div>
                      <div className="text-neutral-600">{order.endDate}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-neutral-200 rounded-full h-2">
                          <div 
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-600">{order.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resource Utilization View */}
        {activeView === 'resources' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Equipment Status</h3>
              <div className="space-y-3">
                {resources.map((resource, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{resource.name}</div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        resource.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {resource.status}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            resource.utilization > 80 ? 'bg-red-500' : 
                            resource.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${resource.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-neutral-600">{resource.utilization}%</span>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Next maintenance: {resource.nextMaintenance}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Capacity Planning</h3>
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">72%</div>
                    <div className="text-sm text-neutral-600">Overall Utilization</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">127</div>
                    <div className="text-sm text-neutral-600">Available Hours</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Week</span>
                    <span className="text-green-600">+15%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Next Week</span>
                    <span className="text-yellow-600">-5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Schedule Production
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Resource Planning
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Export Schedule
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Maintenance Log
          </button>
        </div>
      </div>
    </div>
  )
}
