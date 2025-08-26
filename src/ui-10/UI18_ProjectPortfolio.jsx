import React, { useState } from 'react'

export default function UI18_ProjectPortfolio() {
  const [activeView, setActiveView] = useState('overview')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const portfolioStats = [
    { title: 'Active Projects', value: '24', change: '+3', color: 'bg-blue-500' },
    { title: 'Total Budget', value: '$2.4M', change: '+12%', color: 'bg-green-500' },
    { title: 'On Schedule', value: '18', change: '+2', color: 'bg-purple-500' },
    { title: 'Resource Utilization', value: '87%', change: '+5%', color: 'bg-yellow-500' }
  ]

  const projects = [
    {
      id: 'PRJ-001',
      name: 'ERP System Upgrade',
      manager: 'Sarah Johnson',
      budget: 450000,
      spent: 320000,
      progress: 71,
      status: 'On Track',
      priority: 'High',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      team: 8
    },
    {
      id: 'PRJ-002', 
      name: 'Mobile App Development',
      manager: 'Mike Chen',
      budget: 180000,
      spent: 95000,
      progress: 45,
      status: 'At Risk',
      priority: 'Medium',
      startDate: '2024-02-01',
      endDate: '2024-08-15',
      team: 5
    },
    {
      id: 'PRJ-003',
      name: 'Data Migration',
      manager: 'Lisa Wang',
      budget: 120000,
      spent: 89000,
      progress: 85,
      status: 'Ahead',
      priority: 'High',
      startDate: '2024-01-10',
      endDate: '2024-04-20',
      team: 6
    },
    {
      id: 'PRJ-004',
      name: 'Security Audit',
      manager: 'David Wilson',
      budget: 75000,
      spent: 25000,
      progress: 20,
      status: 'Behind',
      priority: 'Critical',
      startDate: '2024-03-01',
      endDate: '2024-05-30',
      team: 3
    }
  ]

  const resourceAllocation = [
    { resource: 'Frontend Developers', allocated: 12, available: 5, utilization: 85 },
    { resource: 'Backend Developers', allocated: 8, available: 2, utilization: 92 },
    { resource: 'DevOps Engineers', allocated: 4, available: 1, utilization: 95 },
    { resource: 'UI/UX Designers', allocated: 6, available: 3, utilization: 67 },
    { resource: 'Project Managers', allocated: 5, available: 1, utilization: 89 }
  ]

  const milestones = [
    { project: 'ERP System Upgrade', milestone: 'Phase 2 Completion', date: '2024-01-25', status: 'Completed' },
    { project: 'Mobile App Development', milestone: 'UI Design Review', date: '2024-01-28', status: 'In Progress' },
    { project: 'Data Migration', milestone: 'Testing Phase', date: '2024-02-01', status: 'Upcoming' },
    { project: 'Security Audit', milestone: 'Initial Assessment', date: '2024-02-05', status: 'Upcoming' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track': return 'bg-green-100 text-green-700'
      case 'Ahead': return 'bg-blue-100 text-blue-700'
      case 'At Risk': return 'bg-yellow-100 text-yellow-700'
      case 'Behind': return 'bg-red-100 text-red-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700'
      case 'High': return 'bg-orange-100 text-orange-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Low': return 'bg-green-100 text-green-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getUtilizationColor = (utilization) => {
    if (utilization > 90) return 'bg-red-500'
    if (utilization > 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="p-5">
      <div className="p-6 bg-white border shadow-sm rounded-2xl border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-lg font-semibold">UI18 • Project Portfolio</div>
            <div className="text-sm text-neutral-600">Enterprise project management and portfolio overview</div>
          </div>
          <div className="flex space-x-2">
            <select 
              className="px-3 py-2 text-sm border rounded-lg border-neutral-300"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Projects</option>
              <option value="active">Active Only</option>
              <option value="critical">Critical Priority</option>
              <option value="behind">Behind Schedule</option>
            </select>
            <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              New Project
            </button>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {portfolioStats.map((stat, index) => (
            <div key={index} className="p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <div className="text-xs font-medium text-green-600">{stat.change}</div>
              </div>
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-sm text-neutral-600">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 mb-6 space-x-1 rounded-lg bg-neutral-100">
          {[
            { id: 'overview', label: 'Project Overview' },
            { id: 'resources', label: 'Resource Allocation' },
            { id: 'milestones', label: 'Milestones' },
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

        {/* Project Overview Tab */}
        {activeView === 'overview' && (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-6 border rounded-lg border-neutral-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 space-x-3">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    <div className="mb-2 text-sm text-neutral-600">
                      Project Manager: {project.manager} • Team Size: {project.team} members
                    </div>
                    <div className="text-sm text-neutral-500">
                      {project.startDate} → {project.endDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neutral-900">{project.progress}%</div>
                    <div className="text-sm text-neutral-600">Complete</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <div className="text-sm text-neutral-500">Budget</div>
                    <div className="font-medium">${project.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Spent</div>
                    <div className="font-medium">${project.spent.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Remaining</div>
                    <div className="font-medium">${(project.budget - project.spent).toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-200">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex mt-4 space-x-3">
                  <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    View Details
                  </button>
                  <button className="px-4 py-2 text-sm border rounded-lg border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                    Edit
                  </button>
                  <button className="px-4 py-2 text-sm border rounded-lg border-neutral-300 text-neutral-700 hover:bg-neutral-50">
                    Reports
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resource Allocation Tab */}
        {activeView === 'resources' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-4 font-semibold">Resource Utilization</h3>
              <div className="space-y-4">
                {resourceAllocation.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-lg border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium">{resource.resource}</div>
                      <div className="text-sm text-neutral-600">
                        {resource.allocated}/{resource.allocated + resource.available} allocated
                      </div>
                    </div>
                    <div className="flex items-center mb-2 space-x-4">
                      <div className="flex-1 h-2 rounded-full bg-neutral-200">
                        <div 
                          className={`h-2 rounded-full ${getUtilizationColor(resource.utilization)}`}
                          style={{ width: `${resource.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-neutral-600">{resource.utilization}%</span>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Available: {resource.available} resources
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-neutral-50 rounded-xl">
              <h3 className="mb-4 font-semibold">Resource Insights</h3>
              <div className="space-y-4">
                <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                  <div className="text-sm font-medium text-red-800">High Utilization Alert</div>
                  <div className="text-xs text-red-700">DevOps Engineers at 95% capacity</div>
                </div>
                <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="text-sm font-medium text-yellow-800">Resource Shortage</div>
                  <div className="text-xs text-yellow-700">Backend Developers may be over-allocated</div>
                </div>
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <div className="text-sm font-medium text-green-800">Available Capacity</div>
                  <div className="text-xs text-green-700">UI/UX Designers have 33% available capacity</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Milestones Tab */}
        {activeView === 'milestones' && (
          <div>
            <h3 className="mb-4 font-semibold">Upcoming Milestones</h3>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="p-4 border rounded-lg border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{milestone.milestone}</div>
                      <div className="text-sm text-neutral-600">{milestone.project}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-neutral-600">{milestone.date}</div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        milestone.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        milestone.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-neutral-100 text-neutral-700'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeView === 'analytics' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-neutral-50 rounded-xl">
              <h3 className="mb-4 font-semibold">Portfolio Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>On-Time Delivery Rate</span>
                  <span className="font-medium text-green-600">78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Budget Variance</span>
                  <span className="font-medium text-yellow-600">+8.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quality Score</span>
                  <span className="font-medium text-blue-600">4.2/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Risk Level</span>
                  <span className="font-medium text-orange-600">Medium</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-neutral-50 rounded-xl">
              <h3 className="mb-4 font-semibold">Trends</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Projects This Quarter</span>
                  <span className="font-medium">24 (+3)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Project Duration</span>
                  <span className="font-medium">4.2 months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span className="font-medium text-green-600">89%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex mt-6 space-x-3">
          <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Portfolio Report
          </button>
          <button className="px-4 py-2 text-sm border rounded-lg border-neutral-300 text-neutral-700 hover:bg-neutral-50">
            Resource Planning
          </button>
          <button className="px-4 py-2 text-sm border rounded-lg border-neutral-300 text-neutral-700 hover:bg-neutral-50">
            Export Data
          </button>
          <button className="px-4 py-2 text-sm border rounded-lg border-neutral-300 text-neutral-700 hover:bg-neutral-50">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}
