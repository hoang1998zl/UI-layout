import React, { useState } from 'react'

export default function UI21_RealEstateAsset() {
  const [activeTab, setActiveTab] = useState('overview')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedProperty, setSelectedProperty] = useState(null)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Real Estate Asset Management</h1>
            <p className="text-gray-600">Quản lý danh mục bất động sản và tài sản</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Nhập dữ liệu
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Thêm tài sản
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { 
            label: "Tổng giá trị tài sản", 
            value: "₫ 247.8 tỷ", 
            change: "+5.2%", 
            icon: "🏢",
            color: "blue" 
          },
          { 
            label: "Bất động sản đang cho thuê", 
            value: "142", 
            change: "+12", 
            icon: "🏠",
            color: "green" 
          },
          { 
            label: "Tỷ suất cho thuê", 
            value: "92.3%", 
            change: "+2.1%", 
            icon: "📈",
            color: "purple" 
          },
          { 
            label: "Doanh thu tháng", 
            value: "₫ 3.2 tỷ", 
            change: "+8.7%", 
            icon: "💰",
            color: "orange" 
          }
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">{stat.icon}</div>
              <div className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Tổng quan' },
              { id: 'properties', name: 'Danh mục BĐS' },
              { id: 'rentals', name: 'Cho thuê' },
              { id: 'maintenance', name: 'Bảo trì' },
              { id: 'finance', name: 'Tài chính' },
              { id: 'reports', name: 'Báo cáo' }
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
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Property Portfolio */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Danh mục đầu tư</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {[
                {
                  id: 1,
                  name: "Chung cư Green Valley",
                  type: "Apartment Complex",
                  location: "Quận 7, TP.HCM",
                  value: "₫ 45.2 tỷ",
                  occupancy: "95%",
                  units: 124,
                  status: "active",
                  image: "bg-green-500"
                },
                {
                  id: 2,
                  name: "Tòa nhà văn phòng Central Park",
                  type: "Office Building",
                  location: "Quận 1, TP.HCM",
                  value: "₫ 78.5 tỷ",
                  occupancy: "88%",
                  units: 45,
                  status: "active",
                  image: "bg-blue-500"
                },
                {
                  id: 3,
                  name: "Khu biệt thự Ocean View",
                  type: "Villa Complex",
                  location: "Vũng Tàu",
                  value: "₫ 32.8 tỷ",
                  occupancy: "72%",
                  units: 28,
                  status: "maintenance",
                  image: "bg-purple-500"
                },
                {
                  id: 4,
                  name: "Trung tâm thương mại Sky Plaza",
                  type: "Shopping Mall",
                  location: "Quận 3, TP.HCM",
                  value: "₫ 91.3 tỷ",
                  occupancy: "100%",
                  units: 156,
                  status: "active",
                  image: "bg-orange-500"
                }
              ].map(property => (
                <div key={property.id} className={`bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex items-center gap-6' : ''}`}>
                  <div className={`${property.image} rounded-lg ${viewMode === 'list' ? 'w-16 h-16' : 'w-full h-32'} mb-4 flex items-center justify-center text-white text-2xl`}>
                    🏢
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{property.name}</h4>
                        <p className="text-sm text-gray-600">{property.type}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{property.location}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Giá trị:</span>
                        <span className="font-medium">{property.value}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tỷ lệ thuê:</span>
                        <span className="font-medium">{property.occupancy}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Số đơn vị:</span>
                        <span className="font-medium">{property.units}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
            <div className="space-y-4">
              {[
                {
                  action: "Ký hợp đồng thuê mới",
                  property: "Chung cư Green Valley - Tầng 12A",
                  time: "2 giờ trước",
                  user: "Nguyễn Văn A",
                  type: "contract"
                },
                {
                  action: "Hoàn thành bảo trì",
                  property: "Tòa nhà Central Park - Hệ thống điều hòa",
                  time: "5 giờ trước",
                  user: "Đội kỹ thuật",
                  type: "maintenance"
                },
                {
                  action: "Thanh toán tiền thuê",
                  property: "Sky Plaza - Shop 156",
                  time: "1 ngày trước",
                  user: "Công ty ABC",
                  type: "payment"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'contract' ? 'bg-green-100 text-green-600' :
                    activity.type === 'maintenance' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'contract' ? '📝' : activity.type === 'maintenance' ? '🔧' : '💰'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.property}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'properties' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại BĐS</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Tất cả</option>
                  <option>Chung cư</option>
                  <option>Văn phòng</option>
                  <option>Biệt thự</option>
                  <option>Thương mại</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Tất cả</option>
                  <option>TP.HCM</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Tất cả</option>
                  <option>Hoạt động</option>
                  <option>Bảo trì</option>
                  <option>Tạm ngưng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                <input 
                  type="text" 
                  placeholder="Tên BĐS..." 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Properties Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài sản</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ thuê</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Table rows would be populated here */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Chung cư Green Valley</div>
                      <div className="text-sm text-gray-500">124 căn hộ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Chung cư</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Quận 7, TP.HCM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫ 45.2 tỷ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">95%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">Xem chi tiết</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
