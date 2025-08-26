import React, { useState } from 'react'

export default function UI20_RealtimeCollab() {
  const [activeTab, setActiveTab] = useState('workspace')
  const [activeUsers, setActiveUsers] = useState(12)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Collaborative Workspace</h1>
            <p className="text-gray-600">Không gian làm việc chung với đồng nghiệp</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${
                    i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-green-500' : i === 3 ? 'bg-purple-500' : 'bg-orange-500'
                  } flex items-center justify-center text-white text-sm font-medium`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-medium">
                  +{activeUsers - 4}
                </div>
              </div>
              <span className="text-sm text-gray-600">{activeUsers} đang online</span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Mời thành viên
            </button>
          </div>
        </div>
      </div>

      {/* Live Activity Banner */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Hoạt động trực tiếp</p>
            <p className="text-sm text-gray-600">Minh Anh đang chỉnh sửa "Báo cáo Q3" • Huyền Trang vừa comment trong "Dự án Alpha"</p>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Xem tất cả
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'workspace', name: 'Không gian làm việc', count: null },
              { id: 'documents', name: 'Tài liệu chung', count: 24 },
              { id: 'meetings', name: 'Cuộc họp', count: 3 },
              { id: 'chat', name: 'Trò chuyện', count: 8 },
              { id: 'activity', name: 'Hoạt động', count: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm relative ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
                {tab.count && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
                {tab.id === 'chat' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tài liệu mới</h3>
                  <p className="text-sm text-gray-600">Tạo và chia sẻ tài liệu</p>
                </div>
              </div>
              <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100">
                Tạo tài liệu
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cuộc họp nhanh</h3>
                  <p className="text-sm text-gray-600">Bắt đầu video call</p>
                </div>
              </div>
              <button className="w-full bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100">
                Bắt đầu họp
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Brainstorm</h3>
                  <p className="text-sm text-gray-600">Bảng ý tưởng chung</p>
                </div>
              </div>
              <button className="w-full bg-purple-50 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-100">
                Tạo board
              </button>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dự án gần đây</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Dự án Alpha - Q3 2024",
                  members: 8,
                  activity: "5 phút trước",
                  progress: 75,
                  status: "Đang tiến hành"
                },
                {
                  name: "Redesign Website",
                  members: 5,
                  activity: "2 giờ trước",
                  progress: 40,
                  status: "Đang thiết kế"
                },
                {
                  name: "Mobile App v2.0",
                  members: 12,
                  activity: "1 ngày trước",
                  progress: 90,
                  status: "Sắp hoàn thành"
                },
                {
                  name: "Marketing Campaign",
                  members: 6,
                  activity: "3 ngày trước",
                  progress: 25,
                  status: "Mới bắt đầu"
                }
              ].map((project, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.status}</p>
                    </div>
                    <div className="flex -space-x-1">
                      {[1,2,3].map(i => (
                        <div key={i} className={`w-6 h-6 rounded-full border border-white ${
                          i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-green-500' : 'bg-purple-500'
                        }`}></div>
                      ))}
                      {project.members > 3 && (
                        <div className="w-6 h-6 rounded-full border border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          +{project.members - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Hoạt động cuối: {project.activity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Activity Feed */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động của team</h3>
            <div className="space-y-4">
              {[
                {
                  user: "Minh Anh",
                  action: "đã cập nhật",
                  target: "Báo cáo tài chính Q3",
                  time: "5 phút trước",
                  avatar: "bg-blue-500"
                },
                {
                  user: "Huyền Trang",
                  action: "đã comment trong",
                  target: "Thiết kế UI mới",
                  time: "15 phút trước",
                  avatar: "bg-green-500"
                },
                {
                  user: "Văn Hùng",
                  action: "đã tạo",
                  target: "Meeting notes - Sprint planning",
                  time: "1 giờ trước",
                  avatar: "bg-purple-500"
                },
                {
                  user: "Thu Hà",
                  action: "đã hoàn thành",
                  target: "Task: Review wireframes",
                  time: "2 giờ trước",
                  avatar: "bg-orange-500"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 ${activity.avatar} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium text-gray-900">{activity.user}</span>
                      <span className="text-gray-600"> {activity.action} </span>
                      <span className="font-medium text-blue-600">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Báo cáo Q3 2024.docx", type: "document", modified: "2 giờ trước", shared: true },
              { name: "Presentation_Final.pptx", type: "presentation", modified: "1 ngày trước", shared: false },
              { name: "Budget_Analysis.xlsx", type: "spreadsheet", modified: "3 ngày trước", shared: true },
              { name: "Project_Timeline.pdf", type: "pdf", modified: "1 tuần trước", shared: true }
            ].map((doc, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    doc.type === 'document' ? 'bg-blue-100 text-blue-600' :
                    doc.type === 'presentation' ? 'bg-orange-100 text-orange-600' :
                    doc.type === 'spreadsheet' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    📄
                  </div>
                  {doc.shared && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{doc.name}</h4>
                <p className="text-xs text-gray-500">Chỉnh sửa {doc.modified}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
