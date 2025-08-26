import React, { useState } from 'react'

export default function UI26_CustomModule() {
  const [activeView, setActiveView] = useState('builder')
  const [selectedTemplate, setSelectedTemplate] = useState('form')

  const moduleTemplates = [
    { id: 'form', name: 'Data Entry Form', description: 'Create custom forms for data collection', icon: '📝' },
    { id: 'dashboard', name: 'Dashboard', description: 'Build analytics and reporting dashboards', icon: '📊' },
    { id: 'workflow', name: 'Workflow', description: 'Design business process workflows', icon: '🔄' },
    { id: 'report', name: 'Report Generator', description: 'Create custom reports and exports', icon: '📋' }
  ]

  const customModules = [
    { id: 1, name: 'Employee Onboarding', type: 'Workflow', status: 'Active', users: 23, created: '2024-01-15' },
    { id: 2, name: 'Expense Report', type: 'Form', status: 'Active', users: 156, created: '2024-01-10' },
    { id: 3, name: 'Sales Dashboard', type: 'Dashboard', status: 'Draft', users: 8, created: '2024-01-20' },
    { id: 4, name: 'Inventory Report', type: 'Report', status: 'Active', users: 45, created: '2024-01-08' }
  ]

  const formFields = [
    { id: 1, type: 'text', label: 'Full Name', required: true },
    { id: 2, type: 'email', label: 'Email Address', required: true },
    { id: 3, type: 'select', label: 'Department', required: true, options: ['Sales', 'Marketing', 'IT', 'HR'] },
    { id: 4, type: 'textarea', label: 'Comments', required: false },
    { id: 5, type: 'date', label: 'Start Date', required: true }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700'
      case 'Draft': return 'bg-yellow-100 text-yellow-700'
      case 'Inactive': return 'bg-red-100 text-red-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getFieldTypeIcon = (type) => {
    switch (type) {
      case 'text': return '📝'
      case 'email': return '📧'
      case 'select': return '📋'
      case 'textarea': return '📄'
      case 'date': return '📅'
      case 'number': return '🔢'
      case 'file': return '📎'
      default: return '📝'
    }
  }

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI26 • Custom Module Builder</div>
            <div className="text-sm text-neutral-600">Create and manage custom business modules</div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            New Module
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 rounded-lg p-1">
          {[
            { id: 'builder', label: 'Module Builder' },
            { id: 'modules', label: 'My Modules' },
            { id: 'templates', label: 'Templates' }
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

        {/* Builder Tab */}
        {activeView === 'builder' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Template Selection */}
            <div>
              <h3 className="font-semibold mb-4">Choose Template</h3>
              <div className="space-y-3">
                {moduleTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`cursor-pointer border rounded-lg p-4 transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-neutral-600">{template.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Builder */}
            <div>
              <h3 className="font-semibold mb-4">Form Fields</h3>
              <div className="space-y-3">
                {formFields.map((field) => (
                  <div key={field.id} className="border border-neutral-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">{getFieldTypeIcon(field.type)}</div>
                        <div>
                          <div className="font-medium">{field.label}</div>
                          <div className="text-sm text-neutral-600">
                            {field.type} {field.required && '(Required)'}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 text-sm hover:text-blue-700">Edit</button>
                        <button className="text-red-600 text-sm hover:text-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full border-2 border-dashed border-neutral-300 rounded-lg p-4 text-neutral-600 hover:border-neutral-400 hover:text-neutral-700">
                  + Add Field
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Preview</h3>
              <div className="bg-white border border-neutral-200 rounded-lg p-4">
                <div className="space-y-4">
                  {formFields.slice(0, 3).map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'text' || field.type === 'email' ? (
                        <input
                          type={field.type}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : field.type === 'select' ? (
                        <select className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm">
                          <option>Select {field.label.toLowerCase()}</option>
                          {field.options?.map((option, idx) => (
                            <option key={idx}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : field.type === 'date' ? (
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                        />
                      ) : null}
                    </div>
                  ))}
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Modules Tab */}
        {activeView === 'modules' && (
          <div>
            <div className="overflow-hidden border border-neutral-200 rounded-lg">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-neutral-700">
                  <div>Module Name</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Users</div>
                  <div>Created</div>
                  <div>Actions</div>
                </div>
              </div>
              <div className="divide-y divide-neutral-200">
                {customModules.map((module) => (
                  <div key={module.id} className="px-4 py-3 hover:bg-neutral-50">
                    <div className="grid grid-cols-6 gap-4 text-sm items-center">
                      <div className="font-medium">{module.name}</div>
                      <div>{module.type}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(module.status)}`}>
                          {module.status}
                        </span>
                      </div>
                      <div>{module.users} users</div>
                      <div className="text-neutral-600">{module.created}</div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 text-sm hover:text-blue-700">Edit</button>
                        <button className="text-green-600 text-sm hover:text-green-700">Deploy</button>
                        <button className="text-red-600 text-sm hover:text-red-700">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeView === 'templates' && (
          <div className="grid grid-cols-2 gap-6">
            {moduleTemplates.map((template) => (
              <div key={template.id} className="border border-neutral-200 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{template.icon}</div>
                  <div>
                    <div className="font-semibold text-lg">{template.name}</div>
                    <div className="text-sm text-neutral-600">{template.description}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-neutral-600">
                    <strong>Features:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Drag & drop builder</li>
                      <li>Custom validation rules</li>
                      <li>Data export capabilities</li>
                      <li>User permissions</li>
                    </ul>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Save Module
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Preview
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Export
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
