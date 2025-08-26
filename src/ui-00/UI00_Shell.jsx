import React, { useState } from 'react'

export default function UI00_Shell() {
  const [activeTab, setActiveTab] = useState('layout')

  return (
    <div className="p-5">
      <div className="p-4 bg-white border shadow-sm rounded-2xl border-neutral-200">
        <div className="mb-4 font-semibold">UI00 • Shell Configuration</div>
        
        {/* Tab Navigation */}
        <div className="flex p-1 mb-6 space-x-1 rounded-lg bg-neutral-100">
          {[
            { id: 'layout', label: 'Layout' },
            { id: 'theme', label: 'Theme' },
            { id: 'navigation', label: 'Navigation' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 text-center border-2 border-dashed rounded-lg border-neutral-300">
                <div className="mb-2 text-sm text-neutral-500">Header</div>
                <div className="h-8 rounded bg-neutral-100"></div>
              </div>
              <div className="p-4 text-center border-2 border-dashed rounded-lg border-neutral-300">
                <div className="mb-2 text-sm text-neutral-500">Navigation</div>
                <div className="h-8 rounded bg-neutral-100"></div>
              </div>
              <div className="p-4 text-center border-2 border-dashed rounded-lg border-neutral-300">
                <div className="mb-2 text-sm text-neutral-500">Actions</div>
                <div className="h-8 rounded bg-neutral-100"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 text-center border-2 border-dashed rounded-lg border-neutral-300">
                <div className="mb-2 text-sm text-neutral-500">Sidebar</div>
                <div className="h-32 rounded bg-neutral-100"></div>
              </div>
              <div className="col-span-3 p-4 text-center border-2 border-dashed rounded-lg border-neutral-300">
                <div className="mb-2 text-sm text-neutral-500">Main Content</div>
                <div className="h-32 rounded bg-neutral-100"></div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {['Light', 'Dark', 'Auto'].map((theme) => (
                <div key={theme} className="p-4 border rounded-lg cursor-pointer border-neutral-200 hover:border-blue-300">
                  <div className="mb-2 text-sm font-medium">{theme}</div>
                  <div className={`h-16 rounded ${
                    theme === 'Light' ? 'bg-white border' : 
                    theme === 'Dark' ? 'bg-neutral-800' : 'bg-gradient-to-r from-white to-neutral-800'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Tab */}
        {activeTab === 'navigation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Navigation Style</div>
              <select className="px-3 py-1 text-sm border rounded-md border-neutral-300">
                <option>Horizontal</option>
                <option>Vertical</option>
                <option>Collapsible</option>
              </select>
            </div>
            
            <div className="p-4 border rounded-lg border-neutral-200">
              <div className="mb-2 text-xs text-neutral-500">Preview</div>
              <div className="flex space-x-4 text-sm">
                <div className="px-3 py-2 text-blue-700 bg-blue-100 rounded">Dashboard</div>
                <div className="px-3 py-2 rounded text-neutral-600 hover:bg-neutral-100">Analytics</div>
                <div className="px-3 py-2 rounded text-neutral-600 hover:bg-neutral-100">Reports</div>
                <div className="px-3 py-2 rounded text-neutral-600 hover:bg-neutral-100">Settings</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
