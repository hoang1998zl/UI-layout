import React, { useState } from 'react'

export default function UI20_RealtimeCollab() {
  const [activeTab, setActiveTab] = useState('active-sessions')
  const [showNotifications, setShowNotifications] = useState(true)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Realtime Collaboration</h1>
            <p className="text-gray-600">Quản lý và theo dõi các phiên cộng tác trực tuyến</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">12 người đang online</span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Tạo phiên mới
            </button>
          </div>
        </div>
      </div>

      {/* Live Notifications Bar */}
      {showNotifications && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="font-medium text-blue-900">Hoạt động mới nhất</p>
                <p className="text-sm text-blue-700">Mai Anh đã tham gia phiên "Họp tuần dự án Alpha" • 2 phút trước</p>
              </div>
            </div>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'active-sessions', name: 'Phiên đang hoạt động', count: 8 },
              { id: 'my-sessions', name: 'Phiên của tôi', count: 3 },
              { id: 'archived', name: 'Lưu trữ', count: 24 },
              { id: 'analytics', name: 'Thống kê', count: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'active-sessions' && (
        <div className="space-y-6">
          {/* Active Sessions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                id: 1,
                title: "Họp tuần dự án Alpha",
                type: "Video Conference",
                participants: 8,
                duration: "45 phút",
                status: "live",
                owner: "Trần Minh",
                avatar: "bg-blue-500"
              },
              {
                id: 2,
                title: "Review thiết kế UI/UX",
                type: "Screen Share",
                participants: 5,
                duration: "22 phút",
                status: "live",
                owner: "Huyền Trang",
                avatar: "bg-green-500"
              },
              {
                id: 3,
                title: "Training nhân viên mới",
                type: "Presentation",
                participants: 12,
                duration: "1h 15m",
                status: "live",
                owner: "Văn Hùng",
                avatar: "bg-purple-500"
              },
              {
                id: 4,
                title: "Brainstorm ý tưởng sản phẩm",
                type: "Whiteboard",
                participants: 6,
                duration: "38 phút",
                status: "live",
                owner: "Thu Hà",
                avatar: "bg-orange-500"
              }
            ].map(session => (
              <div key={session.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${session.avatar} rounded-lg flex items-center justify-center text-white font-semibold`}>
                      {session.owner.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600">{session.type} • {session.owner}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-red-600">LIVE</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {session.participants} người
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {session.duration}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    Tham gia
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 2v6m12-6v6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Tạo phiên cộng tác mới</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Video Meeting", icon: "📹", desc: "Họp video trực tuyến" },
                { name: "Screen Share", icon: "🖥️", desc: "Chia sẻ màn hình" },
                { name: "Whiteboard", icon: "📝", desc: "Bảng vẽ tương tác" },
                { name: "Document", icon: "📄", desc: "Soạn thảo chung" }
              ].map(action => (
                <button key={action.name} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="font-medium text-gray-900">{action.name}</div>
                  <div className="text-sm text-gray-600">{action.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Tổng phiên hôm nay", value: "24", change: "+12%", color: "blue" },
              { label: "Người dùng hoạt động", value: "186", change: "+8%", color: "green" },
              { label: "Thời gian trung bình", value: "42 phút", change: "-5%", color: "orange" },
              { label: "Độ hài lòng", value: "4.8/5", change: "+0.2", color: "purple" }
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Placeholder */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Xu hướng sử dụng theo thời gian</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>Biểu đồ thống kê sử dụng</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
