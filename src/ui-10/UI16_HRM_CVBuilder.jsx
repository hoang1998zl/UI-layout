import React, { useState } from 'react'

export default function UI16_HRM_CVBuilder() {
  const [activeSection, setActiveSection] = useState('personal')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')

  const [cvData, setCvData] = useState({
    personal: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      address: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.dev'
    },
    summary: 'Experienced software engineer with 5+ years of expertise in full-stack development...',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        period: '2022 - Present',
        description: 'Led development of microservices architecture...'
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        period: '2020 - 2022',
        description: 'Developed and maintained web applications...'
      }
    ],
    education: [
      {
        degree: 'Master of Computer Science',
        school: 'University of Technology',
        period: '2018 - 2020',
        gpa: '3.8/4.0'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS']
  })

  const templates = [
    { id: 'modern', name: 'Modern', preview: 'bg-gradient-to-br from-blue-100 to-blue-200' },
    { id: 'classic', name: 'Classic', preview: 'bg-gradient-to-br from-neutral-100 to-neutral-200' },
    { id: 'creative', name: 'Creative', preview: 'bg-gradient-to-br from-purple-100 to-pink-200' },
    { id: 'professional', name: 'Professional', preview: 'bg-gradient-to-br from-green-100 to-green-200' }
  ]

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'summary', label: 'Summary', icon: '📝' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'template', label: 'Template', icon: '🎨' }
  ]

  return (
    <div className="p-5">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold text-lg">UI16 • HRM CV Builder</div>
            <div className="text-sm text-neutral-600">Professional resume creation tool</div>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
              Preview
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-neutral-700 mb-3">CV Sections</h3>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="col-span-2">
            {/* Personal Info Section */}
            {activeSection === 'personal' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={cvData.personal.fullName}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={cvData.personal.email}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={cvData.personal.phone}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={cvData.personal.address}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={cvData.personal.linkedin}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={cvData.personal.website}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary Section */}
            {activeSection === 'summary' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Professional Summary</h3>
                <div>
                  <textarea
                    rows={6}
                    value={cvData.summary}
                    placeholder="Write a compelling professional summary..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-neutral-500 mt-1">
                    Tip: Keep it concise and highlight your key achievements
                  </div>
                </div>
              </div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Work Experience</h3>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Add Experience
                  </button>
                </div>
                <div className="space-y-4">
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Job Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Period</label>
                        <input
                          type="text"
                          value={exp.period}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={exp.description}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Education</h3>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Add Education
                  </button>
                </div>
                <div className="space-y-4">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">School</label>
                          <input
                            type="text"
                            value={edu.school}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Period</label>
                          <input
                            type="text"
                            value={edu.period}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">GPA</label>
                          <input
                            type="text"
                            value={edu.gpa}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Skills & Technologies</h3>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Add Skills</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {cvData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center space-x-2">
                        <span>{skill}</span>
                        <button className="text-blue-500 hover:text-blue-700">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a new skill..."
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Template Section */}
            {activeSection === 'template' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Choose Template</h3>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className={`h-32 rounded-lg mb-2 ${template.preview}`}></div>
                      <div className="text-sm font-medium text-center">{template.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="bg-neutral-50 rounded-xl p-4">
            <h3 className="font-semibold mb-4">Live Preview</h3>
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <div className="text-center mb-4">
                <div className="text-lg font-bold">{cvData.personal.fullName}</div>
                <div className="text-sm text-neutral-600">{cvData.personal.email}</div>
                <div className="text-sm text-neutral-600">{cvData.personal.phone}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm font-semibold mb-2">Professional Summary</div>
                <div className="text-xs text-neutral-600 line-clamp-3">
                  {cvData.summary}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold mb-2">Experience</div>
                {cvData.experience.slice(0, 2).map((exp, index) => (
                  <div key={index} className="mb-2">
                    <div className="text-xs font-medium">{exp.title}</div>
                    <div className="text-xs text-neutral-600">{exp.company} • {exp.period}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {cvData.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-neutral-100 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Save CV
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Export Word
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Share Link
          </button>
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm hover:bg-neutral-50">
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
