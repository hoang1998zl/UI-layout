import React from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'

// Import Check component với router navigation
import Check from './check/Check.jsx'

// Import Demo Components (existing)
// UI-00 Series
import UI00 from './ui-00/UI00_Shell.jsx'
import UI01 from './ui-00/UI01_Dashboard00.jsx'
import UI02 from './ui-00/UI02_ApprovalExec.jsx'
import UI03 from './ui-00/UI03_ExecutiveCockpit.jsx'
import UI06 from './ui-00/UI06_SystemShortcuts.jsx'
import UI07 from './ui-00/UI07_ActivityAudit.jsx'
import UI08 from './ui-00/UI08_GlobalSearch.jsx'
import UI09 from './ui-00/UI09_SystemStatus.jsx'

// UI-10 Series
import UI12 from './ui-10/UI12_ProductionPlanning.jsx'
import UI13 from './ui-10/UI13_FinanceCockpit.jsx'
import UI14 from './ui-10/UI14_CRM360.jsx'
import UI15 from './ui-10/UI15_LogisticsDashboard.jsx'
import UI16 from './ui-10/UI16_HRM_CVBuilder.jsx'
import UI17 from './ui-10/UI17_OKRDesigner.jsx'
import UI18 from './ui-10/UI18_ProjectPortfolio.jsx'
import UI19 from './ui-10/UI19_ComplianceCenter.jsx'
import UI20_v1 from './ui-10/UI20_RealtimeCollab.jsx'
import UI21_v1 from './ui-10/UI21_RealEstateAsset.jsx'

// UI-20 Series  
import UI20_v2 from './ui-20/UI20_RealtimeCollab.jsx'
import UI21_v2 from './ui-20/UI21_RealEstateAsset.jsx'
import UI22 from './ui-20/UI22_Procurement.jsx'
import UI23 from './ui-20/UI23_Support.jsx'
import UI24 from './ui-20/UI24_Sales.jsx'
import UI26 from './ui-20/UI26_CustomModule.jsx'

// UI-30 Series
import UI30 from './ui-30/UI30_ProcessOrchestration.jsx'
import UI31 from './ui-30/UI31_WorkflowBuilder.jsx'
import UI32 from './ui-30/UI32_FormDesigner.jsx'
import UI33 from './ui-30/UI33_RulesEngine.jsx'
import UI34 from './ui-30/UI34_DocGenTemplate.jsx'
import UI35 from './ui-30/UI35_DataPipelines.jsx'

const ROUTES = [
  // Core System (UI-00)
  { key:'UI00', label:'UI00 • Shell', node:<UI00/>, group: 'Core' },
  { key:'UI01', label:'UI01 • Dashboard', node:<UI01/>, group: 'Core' },
  { key:'UI02', label:'UI02 • Approval Exec', node:<UI02/>, group: 'Core' },
  { key:'UI03', label:'UI03 • Executive Cockpit', node:<UI03/>, group: 'Core' },
  { key:'UI06', label:'UI06 • System Shortcuts', node:<UI06/>, group: 'Core' },
  { key:'UI07', label:'UI07 • Activity Audit', node:<UI07/>, group: 'Core' },
  { key:'UI08', label:'UI08 • Global Search', node:<UI08/>, group: 'Core' },
  { key:'UI09', label:'UI09 • System Status', node:<UI09/>, group: 'Core' },
  
  // Business Modules (UI-10)
  { key:'UI12', label:'UI12 • Production Planning', node:<UI12/>, group: 'Business' },
  { key:'UI13', label:'UI13 • Finance Cockpit', node:<UI13/>, group: 'Business' },
  { key:'UI14', label:'UI14 • CRM 360', node:<UI14/>, group: 'Business' },
  { key:'UI15', label:'UI15 • Logistics Dashboard', node:<UI15/>, group: 'Business' },
  { key:'UI16', label:'UI16 • HRM CV Builder', node:<UI16/>, group: 'Business' },
  { key:'UI17', label:'UI17 • OKR Designer', node:<UI17/>, group: 'Business' },
  { key:'UI18', label:'UI18 • Project Portfolio', node:<UI18/>, group: 'Business' },
  { key:'UI19', label:'UI19 • Compliance Center', node:<UI19/>, group: 'Business' },
  { key:'UI20_v1', label:'UI20 • Realtime Collab (v1)', node:<UI20_v1/>, group: 'Business' },
  { key:'UI21_v1', label:'UI21 • Real Estate Asset (v1)', node:<UI21_v1/>, group: 'Business' },
  
  // Extended Modules (UI-20)
  { key:'UI20_v2', label:'UI20 • Realtime Collab (v2)', node:<UI20_v2/>, group: 'Extended' },
  { key:'UI21_v2', label:'UI21 • Real Estate Asset (v2)', node:<UI21_v2/>, group: 'Extended' },
  { key:'UI22', label:'UI22 • Procurement', node:<UI22/>, group: 'Extended' },
  { key:'UI23', label:'UI23 • Support', node:<UI23/>, group: 'Extended' },
  { key:'UI24', label:'UI24 • Sales', node:<UI24/>, group: 'Extended' },
  { key:'UI26', label:'UI26 • Custom Module', node:<UI26/>, group: 'Extended' },
  
  // Process Automation (UI-30)
  { key:'UI30', label:'UI30 • Process Orchestration', node:<UI30/>, group: 'Automation' },
  { key:'UI31', label:'UI31 • Workflow Builder', node:<UI31/>, group: 'Automation' },
  { key:'UI32', label:'UI32 • Form Designer', node:<UI32/>, group: 'Automation' },
  { key:'UI33', label:'UI33 • Rules Engine', node:<UI33/>, group: 'Automation' },
  { key:'UI34', label:'UI34 • Doc Template', node:<UI34/>, group: 'Automation' },
  { key:'UI35', label:'UI35 • Data Pipelines', node:<UI35/>, group: 'Automation' },
]

// Demo Mode Component (existing functionality)
function DemoMode() {
  const [route,setRoute] = React.useState('UI01')
  const [selectedGroup, setSelectedGroup] = React.useState('Core')
  const current = ROUTES.find(r=>r.key===route) || ROUTES[0]
  
  const groups = [...new Set(ROUTES.map(r => r.group))]
  const filteredRoutes = ROUTES.filter(r => r.group === selectedGroup)
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur border-neutral-200">
        <div className="px-4 py-3 mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-lg font-bold">ERP UI Layout Demo</div>
            <div className="flex gap-1 ml-auto">
              {groups.map(group => (
                <button key={group}
                  onClick={()=>setSelectedGroup(group)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedGroup===group
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}>
                  {group}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredRoutes.map(r => (
              <button key={r.key}
                onClick={()=>setRoute(r.key)}
                className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                  route===r.key
                    ? 'bg-black text-white border-black'
                    : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                }`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 mx-auto max-w-7xl">{current.node}</div>
    </div>
  )
}

// Home component for mode selection
function Home() {
  const navigate = useNavigate()
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl p-8 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">ERP UI Layout Showcase</h1>
          <p className="text-xl text-gray-600">Choose how you want to explore our UI components</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <div className="text-2xl">🎨</div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Demo Mode</h3>
              <p className="mb-4 text-gray-600">Interactive showcase with grouped navigation and rich content examples</p>
              <button 
                onClick={() => navigate('/demo')}
                className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                Explore Demo
              </button>
            </div>
          </div>
          
          <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <div className="text-2xl">🗂️</div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Router Mode</h3>
              <p className="mb-4 text-gray-600">Traditional routing with sidebar navigation and individual page URLs</p>
              <button 
                onClick={() => navigate('/check')}
                className="px-6 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
                Browse Pages
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">30+ UI Components Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App with Router
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DemoMode />} />
        <Route path="/check/*" element={<Check />} />
      </Routes>
    </BrowserRouter>
  )
}
