import React, { useState } from 'react'

export default function UI19_ComplianceCenter() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedFramework, setSelectedFramework] = useState('all')

  const complianceStats = [
    { title: 'Compliance Score', value: '87%', target: '95%', color: 'bg-green-500', trend: '+3%' },
    { title: 'Active Policies', value: '156', color: 'bg-blue-500', trend: '+12' },
    { title: 'Pending Reviews', value: '23', color: 'bg-yellow-500', trend: '-5' },
    { title: 'Risk Issues', value: '8', color: 'bg-red-500', trend: '+2' }
  ]

  const frameworks = [
    {
      id: 'iso27001',
      name: 'ISO 27001',
      description: 'Information Security Management',
      compliance: 92,
      lastAudit: '2024-01-15',
      nextReview: '2024-04-15',
      status: 'Compliant',
      controls: 114
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      compliance: 89,
      lastAudit: '2024-01-10',
      nextReview: '2024-03-10',
      status: 'Minor Issues',
      controls: 78
    },
    {
      id: 'sox',
      name: 'SOX',
      description: 'Sarbanes-Oxley Act',
      compliance: 95,
      lastAudit: '2024-01-20',
      nextReview: '2024-07-20',
      status: 'Compliant',
      controls: 45
    },
    {
      id: 'pci',
      name: 'PCI DSS',
      description: 'Payment Card Industry Data Security',
      compliance: 76,
      lastAudit: '2024-01-05',
      nextReview: '2024-02-05',
      status: 'Action Required',
      controls: 67
    }
  ]

  const riskAssessments = [
    { id: 'RISK-001', title: 'Data Breach Prevention', category: 'Security', severity: 'High', owner: 'IT Security', dueDate: '2024-02-01', status: 'In Progress' },
    { id: 'RISK-002', title: 'Third-party Vendor Assessment', category: 'Vendor', severity: 'Medium', owner: 'Procurement', dueDate: '2024-02-15', status: 'Pending' },
    { id: 'RISK-003', title: 'Employee Privacy Training', category: 'Training', severity: 'Low', owner: 'HR', dueDate: '2024-03-01', status: 'Scheduled' },
    { id: 'RISK-004', title: 'Financial Controls Review', category: 'Finance', severity: 'High', owner: 'Finance', dueDate: '2024-01-30', status: 'Overdue' }
  ]

  const auditTrail = [
    { timestamp: '2024-01-22 14:30', action: 'Policy Updated', user: 'John Smith', details: 'Data Retention Policy v2.1 approved', type: 'Policy' },
    { timestamp: '2024-01-22 13:15', action: 'Risk Assessment', user: 'Sarah Johnson', details: 'Completed quarterly risk assessment', type: 'Risk' },
    { timestamp: '2024-01-22 11:45', action: 'Compliance Check', user: 'Mike Chen', details: 'ISO 27001 control verification', type: 'Audit' },
    { timestamp: '2024-01-22 10:30', action: 'Training Completed', user: 'Lisa Wang', details: 'GDPR awareness training completed', type: 'Training' }
  ]

  const getComplianceColor = (compliance) => {
    if (compliance >= 90) return 'bg-green-500'
    if (compliance >= 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Compliant': return 'bg-green-100 text-green-700'
      case 'Minor Issues': return 'bg-yellow-100 text-yellow-700'
      case 'Action Required': return 'bg-red-100 text-red-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Low': return 'bg-green-100 text-green-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getRiskStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      case 'Scheduled': return 'bg-neutral-100 text-neutral-700'
      case 'Overdue': return 'bg-red-100 text-red-700'
      case 'Completed': return 'bg-green-100 text-green-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI19 • Compliance Center</div>
            <div className="text-sm text-neutral-600">Regulatory compliance and risk management</div>
          </div>
          <div className="flex space-x-2">
            <select 
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
            >
              <option value="all">All Frameworks</option>
              <option value="iso27001">ISO 27001</option>
              <option value="gdpr">GDPR</option>
              <option value="sox">SOX</option>
              <option value="pci">PCI DSS</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              New Assessment
            </button>
          </div>
        </div>

        {/* Compliance Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {complianceStats.map((stat, index) => (
            <div key={index} className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
              </div>
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-sm text-neutral-600">{stat.title}</div>
              {stat.target && (
                <div className="text-xs text-neutral-500 mt-1">Target: {stat.target}</div>
              )}
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Framework Overview' },
            { id: 'risks', label: 'Risk Management' },
            { id: 'audit', label: 'Audit Trail' },
            { id: 'reports', label: 'Reports' }
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

        {/* Framework Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {frameworks.map((framework) => (
              <div key={framework.id} className="border border-neutral-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{framework.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(framework.status)}`}>
                        {framework.status}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600 mb-2">{framework.description}</div>
                    <div className="text-sm text-neutral-500">
                      {framework.controls} controls • Last audit: {framework.lastAudit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neutral-900">{framework.compliance}%</div>
                    <div className="text-sm text-neutral-600">Compliance</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <div className="text-sm text-neutral-500">Controls</div>
                    <div className="font-medium">{framework.controls} active</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Last Audit</div>
                    <div className="font-medium">{framework.lastAudit}</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Next Review</div>
                    <div className="font-medium">{framework.nextReview}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Level</span>
                    <span>{framework.compliance}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getComplianceColor(framework.compliance)}`}
                      style={{ width: `${framework.compliance}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
                    Run Assessment
                  </button>
                  <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
                    Generate Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Risk Management Tab */}
        {activeTab === 'risks' && (
          <div>
            <div className="overflow-hidden border border-neutral-200 rounded-lg">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                <div className="grid grid-cols-7 gap-4 text-sm font-medium text-neutral-700">
                  <div>Risk ID</div>
                  <div className="col-span-2">Title</div>
                  <div>Category</div>
                  <div>Severity</div>
                  <div>Owner</div>
                  <div>Status</div>
                </div>
              </div>
              <div className="divide-y divide-neutral-200">
                {riskAssessments.map((risk) => (
                  <div key={risk.id} className="px-4 py-3 hover:bg-neutral-50">
                    <div className="grid grid-cols-7 gap-4 text-sm items-center">
                      <div className="font-medium text-blue-600">{risk.id}</div>
                      <div className="col-span-2 font-medium">{risk.title}</div>
                      <div>{risk.category}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(risk.severity)}`}>
                          {risk.severity}
                        </span>
                      </div>
                      <div>{risk.owner}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRiskStatusColor(risk.status)}`}>
                          {risk.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-neutral-500">
                      Due: {risk.dueDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audit Trail Tab */}
        {activeTab === 'audit' && (
          <div>
            <h3 className="font-semibold mb-4">Recent Compliance Activities</h3>
            <div className="space-y-3">
              {auditTrail.map((entry, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-sm text-neutral-500 w-32">{entry.timestamp}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="font-medium">{entry.action}</div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          entry.type === 'Policy' ? 'bg-blue-100 text-blue-700' :
                          entry.type === 'Risk' ? 'bg-red-100 text-red-700' :
                          entry.type === 'Audit' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {entry.type}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-600 mb-1">{entry.details}</div>
                      <div className="text-xs text-neutral-500">by {entry.user}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Available Reports</h3>
              <div className="space-y-3">
                <div className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                  <div className="font-medium mb-1">Compliance Dashboard</div>
                  <div className="text-sm text-neutral-600">Executive summary of compliance status</div>
                  <div className="text-xs text-neutral-500 mt-2">Last generated: 2024-01-20</div>
                </div>
                <div className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                  <div className="font-medium mb-1">Risk Assessment Report</div>
                  <div className="text-sm text-neutral-600">Detailed risk analysis and mitigation plans</div>
                  <div className="text-xs text-neutral-500 mt-2">Last generated: 2024-01-18</div>
                </div>
                <div className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                  <div className="font-medium mb-1">Audit Trail Export</div>
                  <div className="text-sm text-neutral-600">Complete audit trail for compliance review</div>
                  <div className="text-xs text-neutral-500 mt-2">Available on demand</div>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Frameworks</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Controls</span>
                  <span className="font-medium">304</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Open Risk Items</span>
                  <span className="font-medium text-red-600">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completed Audits</span>
                  <span className="font-medium text-green-600">12</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Run Compliance Scan
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Schedule Audit
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Export Reports
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}
