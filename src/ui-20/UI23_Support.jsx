import React, { useState } from 'react'

export default function UI23_Support() {
  const [activeView, setActiveView] = useState('tickets')
  const [selectedPriority, setSelectedPriority] = useState('all')

  const supportStats = [
    { title: 'Open Tickets', value: '47', change: '+5', color: 'bg-blue-500' },
    { title: 'Avg Response Time', value: '2.3h', change: '-0.5h', color: 'bg-green-500' },
    { title: 'Resolution Rate', value: '94%', change: '+3%', color: 'bg-purple-500' },
    { title: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', color: 'bg-yellow-500' }
  ]

  const tickets = [
    {
      id: 'TICKET-001',
      subject: 'Unable to login to system',
      customer: 'John Smith',
      priority: 'High',
      status: 'Open',
      assignee: 'Sarah Johnson',
      created: '2024-01-22 14:30',
      updated: '2024-01-22 15:45'
    },
    {
      id: 'TICKET-002',
      subject: 'Invoice generation error',
      customer: 'Mike Chen',
      priority: 'Medium',
      status: 'In Progress',
      assignee: 'David Wilson',
      created: '2024-01-22 13:15',
      updated: '2024-01-22 16:20'
    },
    {
      id: 'TICKET-003',
      subject: 'Feature request: Export to Excel',
      customer: 'Lisa Wang',
      priority: 'Low',
      status: 'Pending',
      assignee: 'Tom Brown',
      created: '2024-01-22 11:45',
      updated: '2024-01-22 12:30'
    }
  ]

  const knowledgeBase = [
    { id: 1, title: 'How to reset your password', category: 'Account', views: 1247 },
    { id: 2, title: 'Setting up two-factor authentication', category: 'Security', views: 892 },
    { id: 3, title: 'Creating custom reports', category: 'Reports', views: 673 },
    { id: 4, title: 'Troubleshooting login issues', category: 'Account', views: 1156 }
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
      case 'Open': return 'bg-blue-100 text-blue-700'
      case 'In Progress': return 'bg-yellow-100 text-yellow-700'
      case 'Pending': return 'bg-orange-100 text-orange-700'
      case 'Resolved': return 'bg-green-100 text-green-700'
      case 'Closed': return 'bg-neutral-100 text-neutral-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI23 • Support / Helpdesk</div>
            <div className="text-sm text-neutral-600">Customer support and ticket management</div>
          </div>
          <div className="flex space-x-2">
            <select 
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              New Ticket
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {supportStats.map((stat, index) => (
            <div key={index} className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <div className="text-xs text-green-600 font-medium">{stat.change}</div>
              </div>
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-sm text-neutral-600">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'tickets', label: 'Support Tickets' },
            { id: 'knowledge', label: 'Knowledge Base' },
            { id: 'analytics', label: 'Analytics' }
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

        {/* Tickets View */}
        {activeView === 'tickets' && (
          <div>
            <div className="overflow-hidden border border-neutral-200 rounded-lg">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                <div className="grid grid-cols-8 gap-4 text-sm font-medium text-neutral-700">
                  <div>Ticket ID</div>
                  <div className="col-span-2">Subject</div>
                  <div>Customer</div>
                  <div>Priority</div>
                  <div>Status</div>
                  <div>Assignee</div>
                  <div>Updated</div>
                </div>
              </div>
              <div className="divide-y divide-neutral-200">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="px-4 py-3 hover:bg-neutral-50">
                    <div className="grid grid-cols-8 gap-4 text-sm items-center">
                      <div className="font-medium text-blue-600">{ticket.id}</div>
                      <div className="col-span-2 font-medium">{ticket.subject}</div>
                      <div>{ticket.customer}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div>{ticket.assignee}</div>
                      <div className="text-neutral-600 text-xs">{ticket.updated}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Base View */}
        {activeView === 'knowledge' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Popular Articles</h3>
              <div className="space-y-3">
                {knowledgeBase.map((article) => (
                  <div key={article.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{article.title}</div>
                        <div className="text-sm text-neutral-600">{article.category}</div>
                      </div>
                      <div className="text-sm text-neutral-500">{article.views} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">
                  <div className="font-medium">Create New Article</div>
                  <div className="text-sm text-neutral-600">Add knowledge base content</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">
                  <div className="font-medium">Manage Categories</div>
                  <div className="text-sm text-neutral-600">Organize knowledge base</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-sm text-neutral-600">Article performance stats</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Ticket Trends</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>This Week</span>
                  <span className="font-medium">23 tickets</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Week</span>
                  <span className="font-medium">31 tickets</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>This Month</span>
                  <span className="font-medium">127 tickets</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Resolution Time</span>
                  <span className="font-medium text-green-600">4.2 hours</span>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Team Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sarah Johnson</span>
                  <span className="text-sm font-medium">12 resolved</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">David Wilson</span>
                  <span className="text-sm font-medium">9 resolved</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tom Brown</span>
                  <span className="text-sm font-medium">7 resolved</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Assign Tickets
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Bulk Update
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Export Report
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}
