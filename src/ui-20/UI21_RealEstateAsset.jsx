import React, { useState } from 'react'

export default function UI21_RealEstateAsset() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showMap, setShowMap] = useState(false)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Real Estate Portfolio</h1>
            <p className="text-gray-600">Quản lý danh mục đầu tư bất động sản</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMap(!showMap)}
              className={`px-4 py-2 border rounded-lg ${showMap ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              {showMap ? 'Ẩn bản đồ' : 'Xem bản đồ'}
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Thêm BĐS
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Value Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { 
            label: "Tổng giá trị danh mục", 
            value: "₫ 1,247 tỷ", 
            change: "+12.8%", 
            period: "YTD",
            icon: "🏢",
            color: "blue" 
          },
          { 
            label: "Tỷ suất lợi nhuận", 
            value: "8.4%", 
            change: "+1.2%", 
            period: "Năm nay",
            icon: "📈",
            color: "green" 
          },
          { 
            label: "Doanh thu cho thuê", 
            value: "₫ 42.3 tỷ", 
            change: "+5.7%", 
            period: "Năm nay",
            icon: "💰",
            color: "purple" 
          },
          { 
            label: "Tỷ lệ lấp đầy", 
            value: "94.2%", 
            change: "+2.1%", 
            period: "Tháng này",
            icon: "🏠",
            color: "orange" 
          }
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">{stat.icon}</div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.period}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map View (when enabled) */}
      {showMap && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bản đồ tài sản</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🗺️</div>
              <p>Bản đồ hiển thị vị trí các tài sản BĐS</p>
              <p className="text-sm mt-1">Tích hợp với Google Maps/OpenStreetMap</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Tổng quan' },
              { id: 'properties', name: 'Tài sản' },
              { id: 'income', name: 'Thu nhập' },
              { id: 'expenses', name: 'Chi phí' },
              { id: 'analytics', name: 'Phân tích' },
              { id: 'market', name: 'Thị trường' }
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
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Property Categories */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bổ theo loại tài sản</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { 
                  type: "Căn hộ chung cư", 
                  count: 45, 
                  value: "₫ 520 tỷ", 
                  percentage: 42,
                  color: "bg-blue-500",
                  icon: "🏢"
                },
                { 
                  type: "Nhà riêng lẻ", 
                  count: 23, 
                  value: "₫ 280 tỷ", 
                  percentage: 22,
                  color: "bg-green-500",
                  icon: "🏠"
                },
                { 
                  type: "Văn phòng", 
                  count: 12, 
                  value: "₫ 310 tỷ", 
                  percentage: 25,
                  color: "bg-purple-500",
                  icon: "🏢"
                },
                { 
                  type: "Thương mại", 
                  count: 8, 
                  value: "₫ 137 tỷ", 
                  percentage: 11,
                  color: "bg-orange-500",
                  icon: "🏪"
                }
              ].map(category => (
                <div key={category.type} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{category.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.type}</h4>
                      <p className="text-sm text-gray-600">{category.count} tài sản</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Giá trị</span>
                      <span className="font-medium">{category.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${category.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{category.percentage}% của tổng danh mục</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Properties */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tài sản có hiệu suất cao nhất</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Tài sản</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Loại</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Giá trị hiện tại</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">ROI</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Thu nhập/tháng</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Tỷ lệ lấp đầy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Vinhomes Central Park T3",
                      type: "Chung cư cao cấp",
                      value: "₫ 28.5 tỷ",
                      roi: "+15.2%",
                      income: "₫ 180M",
                      occupancy: "100%"
                    },
                    {
                      name: "Saigon Centre Office",
                      type: "Văn phòng",
                      value: "₫ 45.3 tỷ",
                      roi: "+12.8%",
                      income: "₫ 320M",
                      occupancy: "95%"
                    },
                    {
                      name: "Diamond Plaza Shop",
                      type: "Thương mại",
                      value: "₫ 15.7 tỷ",
                      roi: "+11.4%",
                      income: "₫ 125M",
                      occupancy: "88%"
                    }
                  ].map((property, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{property.name}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{property.type}</td>
                      <td className="py-3 px-4 font-medium">{property.value}</td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-medium">{property.roi}</span>
                      </td>
                      <td className="py-3 px-4 font-medium">{property.income}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.occupancy === '100%' ? 'bg-green-100 text-green-800' :
                          property.occupancy === '95%' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.occupancy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tin tức thị trường</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Thị trường BĐS TP.HCM tăng trưởng 8.5% trong Q3",
                    source: "VnEconomy",
                    time: "2 giờ trước"
                  },
                  {
                    title: "Lãi suất vay mua nhà giảm xuống 6.8%/năm",
                    source: "Cafef",
                    time: "5 giờ trước"
                  },
                  {
                    title: "Phân khúc văn phòng hạng A khan hiếm nguồn cung",
                    source: "CBRE Vietnam",
                    time: "1 ngày trước"
                  }
                ].map((news, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{news.title}</h4>
                    <p className="text-xs text-gray-500">{news.source} • {news.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cảnh báo & Khuyến nghị</h3>
              <div className="space-y-4">
                {[
                  {
                    type: "warning",
                    title: "Hợp đồng thuê sắp hết hạn",
                    desc: "3 hợp đồng sẽ hết hạn trong 30 ngày tới",
                    action: "Xem chi tiết"
                  },
                  {
                    type: "info",
                    title: "Cơ hội đầu tư mới",
                    desc: "Phân khúc shophouse tại Quận 2 đang có triển vọng tốt",
                    action: "Khám phá"
                  },
                  {
                    type: "success",
                    title: "Hiệu suất vượt mong đợi",
                    desc: "Danh mục của bạn đã tăng trưởng 12.8% trong năm nay",
                    action: "Xem báo cáo"
                  }
                ].map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    alert.type === 'info' ? 'bg-blue-50 border-blue-200' :
                    'bg-green-50 border-green-200'
                  }`}>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{alert.desc}</p>
                    <button className={`text-sm font-medium ${
                      alert.type === 'warning' ? 'text-yellow-600' :
                      alert.type === 'info' ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {alert.action} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Performance Charts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ hiệu suất danh mục</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>Biểu đồ tăng trưởng giá trị danh mục theo thời gian</p>
                <p className="text-sm mt-1">Tích hợp với thư viện chart (Chart.js, D3.js)</p>
              </div>
            </div>
          </div>

          {/* Comparative Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">So sánh với thị trường</h3>
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-2">📈</div>
                  <p>Biểu đồ so sánh ROI</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích rủi ro</h3>
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-2">⚠️</div>
                  <p>Đánh giá rủi ro danh mục</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
