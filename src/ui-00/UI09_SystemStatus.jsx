import React, { useState } from 'react'

export default function UI09_SystemStatus() {
  const [refreshInterval, setRefreshInterval] = useState('30s')

  const systemComponents = [
    { name: 'Web Server', status: 'operational', uptime: '99.9%', responseTime: '145ms', load: '67%' },
    { name: 'Database', status: 'operational', uptime: '99.8%', responseTime: '23ms', load: '42%' },
    { name: 'API Gateway', status: 'operational', uptime: '99.9%', responseTime: '89ms', load: '71%' },
    { name: 'File Storage', status: 'maintenance', uptime: '98.5%', responseTime: '234ms', load: '89%' },
    { name: 'Cache Server', status: 'operational', uptime: '99.7%', responseTime: '12ms', load: '34%' },
    { name: 'Email Service', status: 'degraded', uptime: '97.2%', responseTime: '567ms', load: '23%' }
  ]

  const systemMetrics = [
    { name: 'CPU Usage', value: '67%', status: 'normal', trend: 'stable' },
    { name: 'Memory Usage', value: '84%', status: 'warning', trend: 'increasing' },
    { name: 'Disk Usage', value: '45%', status: 'normal', trend: 'stable' },
    { name: 'Network I/O', value: '1.2 GB/s', status: 'normal', trend: 'decreasing' }
  ]

  const recentEvents = [
    { time: '14:30', event: 'Database backup completed successfully', type: 'info' },
    { time: '14:15', event: 'High memory usage detected on web server 2', type: 'warning' },
    { time: '13:45', event: 'Scheduled maintenance started for file storage', type: 'maintenance' },
    { time: '13:30', event: 'Email service response time degraded', type: 'error' },
    { time: '13:00', event: 'System health check completed', type: 'info' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-500'
      case 'degraded': return 'bg-yellow-500'
      case 'maintenance': return 'bg-blue-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-neutral-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'operational': return 'Operational'
      case 'degraded': return 'Degraded'
      case 'maintenance': return 'Maintenance'
      case 'offline': return 'Offline'
      default: return 'Unknown'
    }
  }

  const getMetricColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-neutral-600'
    }
  }

  const getEventColor = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-700'
      case 'warning': return 'bg-yellow-100 text-yellow-700'
      case 'error': return 'bg-red-100 text-red-700'
      case 'maintenance': return 'bg-purple-100 text-purple-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI09 • System Status</div>
            <div className="text-sm text-neutral-600">Real-time system health monitoring</div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="px-3 py-1 border border-neutral-300 rounded-md text-sm"
            >
              <option value="10s">10 seconds</option>
              <option value="30s">30 seconds</option>
              <option value="1m">1 minute</option>
              <option value="5m">5 minutes</option>
            </select>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-neutral-600">Live</span>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="font-medium text-green-800">All Systems Operational</div>
            <div className="text-sm text-green-600">• Last updated: 2 minutes ago</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* System Components */}
          <div>
            <h3 className="font-semibold mb-4">System Components</h3>
            <div className="space-y-3">
              {systemComponents.map((component, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(component.status)}`}></div>
                      <div className="font-medium">{component.name}</div>
                    </div>
                    <div className="text-sm text-neutral-600">{getStatusText(component.status)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-neutral-600">
                    <div>
                      <div className="text-xs">Uptime</div>
                      <div className="font-medium">{component.uptime}</div>
                    </div>
                    <div>
                      <div className="text-xs">Response</div>
                      <div className="font-medium">{component.responseTime}</div>
                    </div>
                    <div>
                      <div className="text-xs">Load</div>
                      <div className="font-medium">{component.load}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Metrics */}
          <div>
            <h3 className="font-semibold mb-4">System Metrics</h3>
            <div className="space-y-4 mb-6">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{metric.name}</div>
                    <div className={`font-bold ${getMetricColor(metric.status)}`}>
                      {metric.value}
                    </div>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.status === 'normal' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: metric.value }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Events */}
            <h3 className="font-semibold mb-4">Recent Events</h3>
            <div className="space-y-2">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <div className="text-neutral-500 w-12">{event.time}</div>
                  <div className="flex-1">
                    <span className={`px-2 py-1 rounded-md text-xs mr-2 ${getEventColor(event.type)}`}>
                      {event.type}
                    </span>
                    {event.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            View Full Report
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Configure Alerts
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            System Settings
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Download Logs
          </button>
        </div>
      </div>
    </div>
  )
}
