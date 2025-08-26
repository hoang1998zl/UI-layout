import React, { useState } from 'react'

export default function UI24_Sales() {
  const [activeTab, setActiveTab] = useState('pipeline')
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const salesMetrics = [
    { title: 'Revenue', value: '$847K', target: '$900K', progress: 94, change: '+12%' },
    { title: 'New Deals', value: '23', target: '25', progress: 92, change: '+8%' },
    { title: 'Conversion Rate', value: '18.5%', target: '20%', progress: 92.5, change: '+2.1%' },
    { title: 'Avg Deal Size', value: '$36.8K', target: '$35K', progress: 105, change: '+5.1%' }
  ]

  const pipeline = [
    { id: 'DEAL-001', company: 'TechCorp Inc', contact: 'John Smith', value: 85000, stage: 'Proposal', probability: 75, nextAction: 'Follow-up call', date: '2024-01-25' },
    { id: 'DEAL-002', company: 'StartupXYZ', contact: 'Sarah Johnson', value: 45000, stage: 'Negotiation', probability: 60, nextAction: 'Contract review', date: '2024-01-24' },
    { id: 'DEAL-003', company: 'Enterprise Ltd', contact: 'Mike Chen', value: 120000, stage: 'Qualified', probability: 40, nextAction: 'Demo scheduled', date: '2024-01-26' },
    { id: 'DEAL-004', company: 'SMB Solutions', contact: 'Lisa Wang', value: 28000, stage: 'Closing', probability: 90, nextAction: 'Final approval', date: '2024-01-23' }
  ]

  const salesTeam = [
    { name: 'Alex Thompson', role: 'Senior Sales Rep', revenue: 245000, deals: 12, target: 280000, performance: 87.5 },
    { name: 'Maria Garcia', role: 'Sales Rep', revenue: 198000, deals: 9, target: 220000, performance: 90.0 },
    { name: 'David Kim', role: 'Sales Rep', revenue: 167000, deals: 7, target: 200000, performance: 83.5 },
    { name: 'Jennifer Lopez', role: 'Junior Sales Rep', revenue: 89000, deals: 5, target: 120000, performance: 74.2 }
  ]

  const activities = [
    { time: '14:30', activity: 'Call with TechCorp Inc - Proposal discussion', rep: 'Alex Thompson', outcome: 'Positive' },
    { time: '13:15', activity: 'Demo completed for Enterprise Ltd', rep: 'Maria Garcia', outcome: 'Interested' },
    { time: '11:45', activity: 'Contract sent to SMB Solutions', rep: 'David Kim', outcome: 'Pending' },
    { time: '10:30', activity: 'Follow-up email to StartupXYZ', rep: 'Jennifer Lopez', outcome: 'No response' }
  ]

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Qualified': return 'bg-blue-100 text-blue-700'
      case 'Proposal': return 'bg-yellow-100 text-yellow-700'
      case 'Negotiation': return 'bg-orange-100 text-orange-700'
      case 'Closing': return 'bg-green-100 text-green-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-green-600'
    if (performance >= 80) return 'text-blue-600'
    if (performance >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI24 • Sales Operations</div>
            <div className="text-sm text-neutral-600">Sales pipeline and performance management</div>
          </div>
          <div className="flex space-x-2">
            <select 
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              New Deal
            </button>
          </div>
        </div>

        {/* Sales Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {salesMetrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4">
              <div className="text-sm text-neutral-600 mb-1">{metric.title}</div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">{metric.value}</div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-neutral-500">Target: {metric.target}</div>
                <div className="text-xs text-green-600 font-medium">{metric.change}</div>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-1.5">
                <div 
                  className="h-1.5 bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(metric.progress, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'pipeline', label: 'Sales Pipeline' },
            { id: 'team', label: 'Team Performance' },
            { id: 'activities', label: 'Recent Activities' }
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

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div>
            <div className="overflow-hidden border border-neutral-200 rounded-lg">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                <div className="grid grid-cols-8 gap-4 text-sm font-medium text-neutral-700">
                  <div>Deal ID</div>
                  <div>Company</div>
                  <div>Contact</div>
                  <div>Value</div>
                  <div>Stage</div>
                  <div>Probability</div>
                  <div>Next Action</div>
                  <div>Date</div>
                </div>
              </div>
              <div className="divide-y divide-neutral-200">
                {pipeline.map((deal) => (
                  <div key={deal.id} className="px-4 py-3 hover:bg-neutral-50">
                    <div className="grid grid-cols-8 gap-4 text-sm items-center">
                      <div className="font-medium text-blue-600">{deal.id}</div>
                      <div className="font-medium">{deal.company}</div>
                      <div>{deal.contact}</div>
                      <div className="font-medium">${deal.value.toLocaleString()}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStageColor(deal.stage)}`}>
                          {deal.stage}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-neutral-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 bg-green-500 rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-600">{deal.probability}%</span>
                      </div>
                      <div className="text-neutral-600">{deal.nextAction}</div>
                      <div className="text-neutral-600 text-xs">{deal.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Performance Tab */}
        {activeTab === 'team' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Sales Representatives</h3>
              <div className="space-y-3">
                {salesTeam.map((rep, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">{rep.name}</div>
                        <div className="text-sm text-neutral-600">{rep.role}</div>
                      </div>
                      <div className={`text-lg font-bold ${getPerformanceColor(rep.performance)}`}>
                        {rep.performance}%
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                      <div>
                        <div className="text-neutral-500">Revenue</div>
                        <div className="font-medium">${rep.revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-neutral-500">Deals</div>
                        <div className="font-medium">{rep.deals}</div>
                      </div>
                      <div>
                        <div className="text-neutral-500">Target</div>
                        <div className="font-medium">${rep.target.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          rep.performance >= 90 ? 'bg-green-500' : 
                          rep.performance >= 80 ? 'bg-blue-500' : 
                          rep.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${rep.performance}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Team Insights</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">Top Performer</div>
                  <div className="text-lg font-bold text-green-600">Maria Garcia</div>
                  <div className="text-xs text-neutral-600">90% of target achieved</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">Team Average</div>
                  <div className="text-lg font-bold text-blue-600">83.8%</div>
                  <div className="text-xs text-neutral-600">Target achievement rate</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">Pipeline Value</div>
                  <div className="text-lg font-bold text-purple-600">$278K</div>
                  <div className="text-xs text-neutral-600">Total open opportunities</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Recent Sales Activities</h3>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-sm text-neutral-500 w-12">{activity.time}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">{activity.activity}</div>
                        <div className="text-xs text-neutral-600">by {activity.rep}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        activity.outcome === 'Positive' ? 'bg-green-100 text-green-700' :
                        activity.outcome === 'Interested' ? 'bg-blue-100 text-blue-700' :
                        activity.outcome === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {activity.outcome}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Upcoming Tasks</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium">Follow-up call with TechCorp Inc</div>
                  <div className="text-xs text-neutral-600">Tomorrow at 2:00 PM</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium">Demo for Enterprise Ltd</div>
                  <div className="text-xs text-neutral-600">Jan 26 at 10:00 AM</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm font-medium">Contract review meeting</div>
                  <div className="text-xs text-neutral-600">Jan 27 at 3:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Sales Forecast
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Pipeline Report
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Team Analytics
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Export Data
          </button>
        </div>
      </div>
    </div>
  )
}
