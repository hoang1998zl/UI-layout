import React, { useState } from 'react'

export default function UI13_FinanceCockpit() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [activeTab, setActiveTab] = useState('overview')

  const financialKPIs = [
    { title: 'Revenue', value: '$2.45M', change: '+12.3%', trend: 'up', target: '$2.8M' },
    { title: 'Gross Profit', value: '$1.23M', change: '+8.7%', trend: 'up', target: '$1.4M' },
    { title: 'Operating Expenses', value: '$890K', change: '+5.2%', trend: 'up', target: '$850K' },
    { title: 'Net Profit', value: '$340K', change: '+15.6%', trend: 'up', target: '$400K' }
  ]

  const cashFlowData = [
    { month: 'Jan', inflow: 450000, outflow: 320000, net: 130000 },
    { month: 'Feb', inflow: 520000, outflow: 380000, net: 140000 },
    { month: 'Mar', inflow: 480000, outflow: 350000, net: 130000 },
    { month: 'Apr', inflow: 580000, outflow: 420000, net: 160000 }
  ]

  const budgetCategories = [
    { category: 'Marketing', budgeted: 150000, actual: 142000, variance: -8000, percent: 94.7 },
    { category: 'Operations', budgeted: 280000, actual: 295000, variance: 15000, percent: 105.4 },
    { category: 'R&D', budgeted: 120000, actual: 108000, variance: -12000, percent: 90.0 },
    { category: 'Sales', budgeted: 200000, actual: 185000, variance: -15000, percent: 92.5 }
  ]

  const invoiceStatus = [
    { status: 'Paid', count: 234, amount: 1850000, color: 'bg-green-500' },
    { status: 'Pending', count: 45, amount: 340000, color: 'bg-yellow-500' },
    { status: 'Overdue', count: 12, amount: 89000, color: 'bg-red-500' },
    { status: 'Draft', count: 8, amount: 67000, color: 'bg-neutral-500' }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI13 • Finance Cockpit</div>
            <div className="text-sm text-neutral-600">Financial performance dashboard</div>
          </div>
          <div className="flex space-x-2">
            <select 
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {financialKPIs.map((kpi, index) => (
            <div key={index} className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4">
              <div className="text-sm text-neutral-600 mb-1">{kpi.title}</div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">{kpi.value}</div>
              <div className="flex items-center justify-between">
                <div className={`text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                } flex items-center`}>
                  <span className="mr-1">{kpi.trend === 'up' ? '↗' : '↘'}</span>
                  {kpi.change}
                </div>
                <div className="text-xs text-neutral-500">Target: {kpi.target}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'cashflow', label: 'Cash Flow' },
            { id: 'budget', label: 'Budget Analysis' },
            { id: 'invoices', label: 'Invoices' }
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Product Sales</span>
                  <span className="font-medium">$1.8M (73%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Service Revenue</span>
                  <span className="font-medium">$450K (18%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Licensing</span>
                  <span className="font-medium">$220K (9%)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Key Ratios</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gross Margin</span>
                  <span className="font-medium text-green-600">50.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Operating Margin</span>
                  <span className="font-medium text-green-600">13.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Net Margin</span>
                  <span className="font-medium text-green-600">13.9%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cash Flow Tab */}
        {activeTab === 'cashflow' && (
          <div>
            <h3 className="font-semibold mb-4">Monthly Cash Flow</h3>
            <div className="overflow-hidden border border-neutral-200 rounded-lg">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-neutral-700">
                  <div>Month</div>
                  <div>Cash Inflow</div>
                  <div>Cash Outflow</div>
                  <div>Net Cash Flow</div>
                </div>
              </div>
              <div className="divide-y divide-neutral-200">
                {cashFlowData.map((data, index) => (
                  <div key={index} className="px-4 py-3">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="font-medium">{data.month}</div>
                      <div className="text-green-600">{formatCurrency(data.inflow)}</div>
                      <div className="text-red-600">{formatCurrency(data.outflow)}</div>
                      <div className={`font-medium ${data.net > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(data.net)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Budget Analysis Tab */}
        {activeTab === 'budget' && (
          <div>
            <h3 className="font-semibold mb-4">Budget vs Actual</h3>
            <div className="space-y-3">
              {budgetCategories.map((item, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{item.category}</div>
                    <div className={`text-sm font-medium ${
                      item.variance < 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.variance < 0 ? 'Under' : 'Over'} budget by {formatCurrency(Math.abs(item.variance))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div>
                      <div className="text-neutral-500">Budgeted</div>
                      <div className="font-medium">{formatCurrency(item.budgeted)}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500">Actual</div>
                      <div className="font-medium">{formatCurrency(item.actual)}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500">Utilization</div>
                      <div className="font-medium">{item.percent}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.percent > 100 ? 'bg-red-500' : 
                        item.percent > 90 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Invoice Status</h3>
              <div className="space-y-3">
                {invoiceStatus.map((status, index) => (
                  <div key={index} className="flex items-center justify-between border border-neutral-200 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                      <div>
                        <div className="font-medium">{status.status}</div>
                        <div className="text-sm text-neutral-600">{status.count} invoices</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(status.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Aging Report</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>0-30 days</span>
                  <span className="font-medium">$234K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>31-60 days</span>
                  <span className="font-medium">$89K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>61-90 days</span>
                  <span className="font-medium">$45K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>90+ days</span>
                  <span className="font-medium text-red-600">$23K</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Financial Analysis
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Budget Planning
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Export Data
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}
