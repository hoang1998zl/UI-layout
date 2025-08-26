import React, { useState } from 'react'

export default function UI17_OKRDesigner() {
  const [activeTab, setActiveTab] = useState('objectives')
  const [selectedQuarter, setSelectedQuarter] = useState('Q1-2024')

  const objectives = [
    {
      id: 1,
      title: 'Increase Revenue Growth',
      description: 'Achieve sustainable revenue growth through strategic initiatives',
      owner: 'Sales Team',
      progress: 75,
      status: 'On Track',
      keyResults: [
        { id: 1, description: 'Increase MRR by 25%', progress: 80, target: 25, current: 20 },
        { id: 2, description: 'Acquire 50 new enterprise clients', progress: 70, target: 50, current: 35 },
        { id: 3, description: 'Improve conversion rate to 15%', progress: 60, target: 15, current: 12 }
      ]
    },
    {
      id: 2,
      title: 'Enhance Product Quality',
      description: 'Deliver exceptional user experience and product reliability',
      owner: 'Product Team',
      progress: 85,
      status: 'Ahead',
      keyResults: [
        { id: 4, description: 'Reduce bug reports by 40%', progress: 90, target: 40, current: 36 },
        { id: 5, description: 'Achieve 95% uptime', progress: 85, target: 95, current: 94.2 },
        { id: 6, description: 'Launch 3 major features', progress: 67, target: 3, current: 2 }
      ]
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ahead': return 'bg-green-100 text-green-700'
      case 'On Track': return 'bg-blue-100 text-blue-700'
      case 'At Risk': return 'bg-yellow-100 text-yellow-700'
      case 'Behind': return 'bg-red-100 text-red-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI17 • OKR Designer</div>
            <div className="text-sm text-neutral-600">Objectives and Key Results management</div>
          </div>
          <div className="flex space-x-2">
            <select 
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
            >
              <option value="Q1-2024">Q1 2024</option>
              <option value="Q2-2024">Q2 2024</option>
              <option value="Q3-2024">Q3 2024</option>
              <option value="Q4-2024">Q4 2024</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              New Objective
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-neutral-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-neutral-900">8</div>
            <div className="text-sm text-neutral-600">Total Objectives</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-700">6</div>
            <div className="text-sm text-neutral-600">On Track</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-700">2</div>
            <div className="text-sm text-neutral-600">At Risk</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-700">78%</div>
            <div className="text-sm text-neutral-600">Avg Progress</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'objectives', label: 'Objectives' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Objectives Tab */}
        {activeTab === 'objectives' && (
          <div className="space-y-6">
            {objectives.map((objective) => (
              <div key={objective.id} className="border border-neutral-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{objective.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(objective.status)}`}>
                        {objective.status}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600 mb-2">{objective.description}</div>
                    <div className="text-sm text-neutral-500">Owner: {objective.owner}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neutral-900">{objective.progress}%</div>
                    <div className="text-sm text-neutral-600">Complete</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${objective.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Key Results</h4>
                  <div className="space-y-3">
                    {objective.keyResults.map((kr) => (
                      <div key={kr.id} className="bg-neutral-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">{kr.description}</div>
                          <div className="text-sm text-neutral-600">
                            {kr.current}/{kr.target} ({kr.progress}%)
                          </div>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              kr.progress >= 80 ? 'bg-green-500' : 
                              kr.progress >= 60 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${kr.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Progress Trends</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Week 1</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Week 2</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Week 3</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Week 4</span>
                  <span className="font-medium text-blue-600">78%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Team Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sales Team</span>
                  <span className="text-sm font-medium text-green-600">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Product Team</span>
                  <span className="text-sm font-medium text-blue-600">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marketing Team</span>
                  <span className="text-sm font-medium text-yellow-600">65%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">OKR Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Quarterly Reviews</div>
                    <div className="text-sm text-neutral-600">Enable automatic quarterly review reminders</div>
                  </div>
                  <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Progress Notifications</div>
                    <div className="text-sm text-neutral-600">Send weekly progress update emails</div>
                  </div>
                  <button className="w-12 h-6 bg-neutral-300 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Update Progress
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Export Report
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Archive Quarter
          </button>
        </div>
      </div>
    </div>
  )
}
