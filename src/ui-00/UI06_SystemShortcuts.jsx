import React, { useState } from 'react'

export default function UI06_SystemShortcuts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const shortcuts = [
    { id: 1, name: 'Create New Order', keys: 'Ctrl + N', category: 'orders', description: 'Create a new sales order' },
    { id: 2, name: 'Quick Search', keys: 'Ctrl + K', category: 'navigation', description: 'Open global search' },
    { id: 3, name: 'Save & Continue', keys: 'Ctrl + S', category: 'general', description: 'Save current form and continue' },
    { id: 4, name: 'Print Document', keys: 'Ctrl + P', category: 'documents', description: 'Print current document' },
    { id: 5, name: 'Navigate Back', keys: 'Alt + ←', category: 'navigation', description: 'Go to previous page' },
    { id: 6, name: 'Navigate Forward', keys: 'Alt + →', category: 'navigation', description: 'Go to next page' },
    { id: 7, name: 'Toggle Sidebar', keys: 'Ctrl + B', category: 'interface', description: 'Show/hide sidebar' },
    { id: 8, name: 'Open Help', keys: 'F1', category: 'general', description: 'Open help documentation' },
    { id: 9, name: 'Create Invoice', keys: 'Ctrl + I', category: 'finance', description: 'Create new invoice' },
    { id: 10, name: 'Dashboard View', keys: 'Ctrl + D', category: 'navigation', description: 'Switch to dashboard' }
  ]

  const categories = [
    { id: 'all', name: 'All Shortcuts', color: 'bg-neutral-100' },
    { id: 'navigation', name: 'Navigation', color: 'bg-blue-100' },
    { id: 'general', name: 'General', color: 'bg-green-100' },
    { id: 'orders', name: 'Orders', color: 'bg-purple-100' },
    { id: 'finance', name: 'Finance', color: 'bg-yellow-100' },
    { id: 'documents', name: 'Documents', color: 'bg-red-100' },
    { id: 'interface', name: 'Interface', color: 'bg-indigo-100' }
  ]

  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesSearch = shortcut.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shortcut.keys.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || shortcut.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.color : 'bg-neutral-100'
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="font-semibold text-lg mb-2">UI06 • System Shortcuts</div>
          <div className="text-sm text-neutral-600">Quick access to system keyboard shortcuts</div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category.id
                  ? `${category.color} border-2 border-neutral-400`
                  : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Shortcuts Grid */}
        <div className="grid gap-3 mb-6">
          {filteredShortcuts.map(shortcut => (
            <div key={shortcut.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">{shortcut.name}</div>
                    <span className={`px-2 py-1 rounded-md text-xs ${getCategoryColor(shortcut.category)}`}>
                      {categories.find(c => c.id === shortcut.category)?.name}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">{shortcut.description}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-neutral-100 px-3 py-1 rounded-md font-mono text-sm">
                    {shortcut.keys}
                  </div>
                  <button className="text-blue-600 text-sm hover:text-blue-700">Try</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-neutral-900">{shortcuts.length}</div>
              <div className="text-sm text-neutral-600">Total Shortcuts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{categories.length - 1}</div>
              <div className="text-sm text-neutral-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{filteredShortcuts.length}</div>
              <div className="text-sm text-neutral-600">Filtered Results</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Download Cheat Sheet
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Customize Shortcuts
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  )
}
