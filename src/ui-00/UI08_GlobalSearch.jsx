import React from 'react'
import { Card, Tag, Button, Input } from '../ui-helpers.jsx'

export default function UI08_GlobalSearch() {
  const [query, setQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('all')
  
  const searchResults = [
    { type: 'Customer', title: 'Acme Corporation', subtitle: 'Enterprise customer since 2020', category: 'CRM' },
    { type: 'Document', title: 'Q3 Financial Report.pdf', subtitle: 'Finance/Reports/2024/', category: 'Files' },
    { type: 'Task', title: 'Review purchase orders', subtitle: 'Assigned to John Doe • Due today', category: 'Tasks' },
    { type: 'Project', title: 'ERP Migration Phase 2', subtitle: '75% complete • 12 team members', category: 'Projects' }
  ]
  
  const tabs = ['all', 'customers', 'documents', 'tasks', 'projects']
  
  return (
    <div className="p-5 space-y-4">
      <Card 
        title="UI08 • Global Search" 
        subtitle="Search across all modules and data types"
        actions={<Button variant="ghost">Advanced Search</Button>}
      >
        <div className="mb-4">
          <Input 
            placeholder="Search everything... (customers, documents, tasks, projects)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-lg"
          />
        </div>
        
        <div className="flex gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="space-y-3">
          {searchResults.map((result, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="font-medium">{result.title}</div>
                  <Tag tone="slate">{result.type}</Tag>
                </div>
                <div className="text-sm text-neutral-600">{result.subtitle}</div>
              </div>
              <div className="flex items-center gap-2">
                <Tag tone="indigo">{result.category}</Tag>
                <Button variant="ghost">Open</Button>
              </div>
            </div>
          ))}
        </div>
        
        {query && (
          <div className="mt-4 pt-4 border-t border-neutral-200 text-center text-sm text-neutral-500">
            Found 47 results for "{query}" • Searched in 0.23s
          </div>
        )}
      </Card>
    </div>
  )
}
