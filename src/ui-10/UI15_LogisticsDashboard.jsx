import React, { useState } from 'react'

export default function UI15_LogisticsDashboard() {
  const [activeView, setActiveView] = useState('overview')
  const [selectedRegion, setSelectedRegion] = useState('all')

  const logisticsKPIs = [
    { title: 'Active Shipments', value: '342', change: '+15', color: 'bg-blue-500' },
    { title: 'On-Time Delivery', value: '94.2%', change: '+2.1%', color: 'bg-green-500' },
    { title: 'Average Transit Time', value: '3.2 days', change: '-0.3', color: 'bg-yellow-500' },
    { title: 'Total Costs', value: '$45.2K', change: '-8%', color: 'bg-purple-500' }
  ]

  const shipments = [
    { id: 'SH-2024-001', origin: 'New York', destination: 'Los Angeles', status: 'In Transit', progress: 65, eta: '2024-01-25', carrier: 'FedEx' },
    { id: 'SH-2024-002', origin: 'Chicago', destination: 'Miami', status: 'Delivered', progress: 100, eta: '2024-01-23', carrier: 'UPS' },
    { id: 'SH-2024-003', origin: 'Seattle', destination: 'Boston', status: 'Pending', progress: 0, eta: '2024-01-28', carrier: 'DHL' },
    { id: 'SH-2024-004', origin: 'Dallas', destination: 'Denver', status: 'In Transit', progress: 30, eta: '2024-01-26', carrier: 'FedEx' },
    { id: 'SH-2024-005', origin: 'Atlanta', destination: 'Phoenix', status: 'Delayed', progress: 45, eta: '2024-01-27', carrier: 'UPS' }
  ]

  const warehouseData = [
    { location: 'Warehouse A', capacity: 10000, current: 8500, utilization: 85, status: 'Normal' },
    { location: 'Warehouse B', capacity: 15000, current: 14200, utilization: 94.7, status: 'High' },
    { location: 'Warehouse C', capacity: 8000, current: 4200, utilization: 52.5, status: 'Low' },
    { location: 'Warehouse D', capacity: 12000, current: 9800, utilization: 81.7, status: 'Normal' }
  ]

  const deliveryPerformance = [
    { region: 'North', onTime: 96, delayed: 4, total: 125 },
    { region: 'South', onTime: 89, delayed: 11, total: 98 },
    { region: 'East', onTime: 94, delayed: 6, total: 156 },
    { region: 'West', onTime: 91, delayed: 9, total: 134 }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700'
      case 'In Transit': return 'bg-blue-100 text-blue-700'
      case 'Pending': return 'bg-neutral-100 text-neutral-700'
      case 'Delayed': return 'bg-red-100 text-red-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getUtilizationColor = (utilization) => {
    if (utilization > 90) return 'bg-red-500'
    if (utilization > 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI15 • Logistics Dashboard</div>
            <div className="text-sm text-neutral-600">Supply chain and delivery management</div>
          </div>
          <div className="flex space-x-2">
            <select 
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">All Regions</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              New Shipment
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {logisticsKPIs.map((kpi, index) => (
            <div key={index} className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${kpi.color}`}></div>
                <div className="text-xs text-green-600 font-medium">{kpi.change}</div>
              </div>
              <div className="text-2xl font-bold text-neutral-900">{kpi.value}</div>
              <div className="text-sm text-neutral-600">{kpi.title}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'shipments', label: 'Shipments' },
            { id: 'warehouses', label: 'Warehouses' },
            { id: 'performance', label: 'Performance' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeView === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">Shipment SH-2024-002 delivered to Miami</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm">New shipment SH-2024-005 created</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="text-sm">Delay reported for SH-2024-004</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="text-sm">Warehouse B approaching capacity</div>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Transportation</span>
                  <span className="font-medium">$32.1K (71%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Warehousing</span>
                  <span className="font-medium">$8.9K (20%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Insurance</span>
                  <span className="font-medium">$2.7K (6%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Other</span>
                  <span className="font-medium">$1.5K (3%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shipments Tab */}
        {activeView === 'shipments' && (
          <div className="overflow-hidden border border-neutral-200 rounded-lg">
            <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
              <div className="grid grid-cols-7 gap-4 text-sm font-medium text-neutral-700">
                <div>Shipment ID</div>
                <div>Origin</div>
                <div>Destination</div>
                <div>Status</div>
                <div>Progress</div>
                <div>ETA</div>
                <div>Carrier</div>
              </div>
            </div>
            <div className="divide-y divide-neutral-200">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="px-4 py-3 hover:bg-neutral-50">
                  <div className="grid grid-cols-7 gap-4 text-sm items-center">
                    <div className="font-medium">{shipment.id}</div>
                    <div>{shipment.origin}</div>
                    <div>{shipment.destination}</div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${shipment.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-neutral-600">{shipment.progress}%</span>
                    </div>
                    <div className="text-neutral-600">{shipment.eta}</div>
                    <div>{shipment.carrier}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warehouses Tab */}
        {activeView === 'warehouses' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Warehouse Capacity</h3>
              <div className="space-y-3">
                {warehouseData.map((warehouse, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{warehouse.location}</div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        warehouse.status === 'High' ? 'bg-red-100 text-red-700' :
                        warehouse.status === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {warehouse.status}
                      </div>
                    </div>
                    <div className="text-sm text-neutral-600 mb-2">
                      {warehouse.current.toLocaleString()} / {warehouse.capacity.toLocaleString()} units
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getUtilizationColor(warehouse.utilization)}`}
                          style={{ width: `${warehouse.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-neutral-600">{warehouse.utilization}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Inventory Alerts</h3>
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-red-800">Critical Stock Level</div>
                  <div className="text-xs text-red-700">Product ABC-123 below minimum threshold</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-yellow-800">Reorder Point</div>
                  <div className="text-xs text-yellow-700">5 items need reordering</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-blue-800">Incoming Shipment</div>
                  <div className="text-xs text-blue-700">Expected delivery tomorrow</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeView === 'performance' && (
          <div>
            <h3 className="font-semibold mb-4">Regional Delivery Performance</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                {deliveryPerformance.map((region, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{region.region} Region</div>
                      <div className="text-sm text-neutral-600">{region.total} deliveries</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div>
                        <div className="text-green-600 font-medium">{region.onTime} On Time</div>
                        <div className="text-neutral-500">{((region.onTime/region.total)*100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-red-600 font-medium">{region.delayed} Delayed</div>
                        <div className="text-neutral-500">{((region.delayed/region.total)*100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${(region.onTime/region.total)*100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-semibold mb-4">Performance Trends</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>This Week</span>
                    <span className="text-green-600 font-medium">+2.3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This Month</span>
                    <span className="text-green-600 font-medium">+1.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This Quarter</span>
                    <span className="text-red-600 font-medium">-0.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Track Shipment
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Optimize Routes
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Inventory Report
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
