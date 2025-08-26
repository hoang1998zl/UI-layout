import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Users,
  FileText,
  Camera,
  Edit,
  Eye,
  MoreHorizontal,
  Filter,
  Search,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Home,
  Building2,
  Warehouse,
  ParkingCircle,
  TreePine
} from 'lucide-react';

export default function UI21_RealEstateAsset() {
  const [activeTab, setActiveTab] = useState('properties');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  const portfolioStats = [
    {
      title: 'Tổng giá trị tài sản',
      value: '₫2.8B',
      change: '+8.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Số lượng bất động sản',
      value: '47',
      change: '+3',
      trend: 'up',
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      title: 'Tỷ lệ cho thuê',
      value: '92.3%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Doanh thu tháng',
      value: '₫45M',
      change: '-1.2%',
      trend: 'down',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  const properties = [
    {
      id: 'RE-001',
      name: 'Chung cư Vinhomes Central Park',
      type: 'apartment',
      address: 'Bình Thạnh, TP.HCM',
      area: '120m²',
      bedrooms: 3,
      bathrooms: 2,
      price: '₫8.5B',
      monthlyRent: '₫25M',
      occupancyRate: 95,
      status: 'rented',
      tenant: 'Công ty ABC',
      leaseExpiry: '2025-06-30',
      lastMaintenance: '2024-07-15',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      roi: 8.2
    },
    {
      id: 'RE-002',
      name: 'Văn phòng Landmark 81',
      type: 'office',
      address: 'Quận 1, TP.HCM',
      area: '450m²',
      bedrooms: null,
      bathrooms: 3,
      price: '₫15.2B',
      monthlyRent: '₫80M',
      occupancyRate: 100,
      status: 'rented',
      tenant: 'Doanh nghiệp XYZ',
      leaseExpiry: '2026-12-31',
      lastMaintenance: '2024-08-01',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      roi: 6.8
    },
    {
      id: 'RE-003',
      name: 'Kho bãi Quận 7',
      type: 'warehouse',
      address: 'Quận 7, TP.HCM',
      area: '2000m²',
      bedrooms: null,
      bathrooms: 2,
      price: '₫12B',
      monthlyRent: '₫45M',
      occupancyRate: 0,
      status: 'vacant',
      tenant: null,
      leaseExpiry: null,
      lastMaintenance: '2024-06-20',
      image: 'https://images.unsplash.com/photo-1566132927831-12d1d5da1fc1?w=400&h=300&fit=crop',
      roi: 4.5
    },
    {
      id: 'RE-004',
      name: 'Nhà phố Thảo Điền',
      type: 'house',
      address: 'Quận 2, TP.HCM',
      area: '300m²',
      bedrooms: 4,
      bathrooms: 3,
      price: '₫18.5B',
      monthlyRent: '₫55M',
      occupancyRate: 100,
      status: 'maintenance',
      tenant: 'Gia đình Nguyễn',
      leaseExpiry: '2025-03-15',
      lastMaintenance: '2024-08-20',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      roi: 7.1
    }
  ];

  const maintenanceSchedule = [
    {
      id: 1,
      property: 'Chung cư Vinhomes Central Park',
      type: 'Bảo trì định kỳ',
      date: '2024-09-15',
      cost: '₫5M',
      status: 'scheduled',
      priority: 'medium'
    },
    {
      id: 2,
      property: 'Văn phòng Landmark 81',
      type: 'Sửa chữa hệ thống điều hòa',
      date: '2024-08-28',
      cost: '₫12M',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: 3,
      property: 'Kho bãi Quận 7',
      type: 'Sơn lại tường',
      date: '2024-09-01',
      cost: '₫8M',
      status: 'completed',
      priority: 'low'
    }
  ];

  const getPropertyTypeIcon = (type) => {
    switch (type) {
      case 'apartment': return Building2;
      case 'office': return Building;
      case 'warehouse': return Warehouse;
      case 'house': return Home;
      default: return Building;
    }
  };

  const getPropertyTypeLabel = (type) => {
    switch (type) {
      case 'apartment': return 'Chung cư';
      case 'office': return 'Văn phòng';
      case 'warehouse': return 'Kho bãi';
      case 'house': return 'Nhà phố';
      default: return 'Khác';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'rented': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'rented': return 'Đã cho thuê';
      case 'vacant': return 'Còn trống';
      case 'maintenance': return 'Bảo trì';
      default: return 'Không xác định';
    }
  };

  const getMaintenanceStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý tài sản bất động sản</h1>
            <p className="mt-1 text-sm text-gray-600">
              Theo dõi và quản lý danh mục bất động sản toàn diện
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              <Plus className="h-4 w-4 mr-2" />
              Thêm tài sản
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {portfolioStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'properties', label: 'Tài sản', icon: Building },
              { id: 'maintenance', label: 'Bảo trì', icon: AlertTriangle },
              { id: 'analytics', label: 'Phân tích', icon: TrendingUp },
              { id: 'documents', label: 'Tài liệu', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          {activeTab === 'properties' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm tài sản..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả loại</option>
                      <option value="apartment">Chung cư</option>
                      <option value="office">Văn phòng</option>
                      <option value="warehouse">Kho bãi</option>
                      <option value="house">Nhà phố</option>
                    </select>
                  </div>
                  <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc nâng cao
                  </button>
                </div>
              </div>

              {/* Property Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProperties.map((property) => {
                  const PropertyIcon = getPropertyTypeIcon(property.type);
                  return (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                            {getStatusLabel(property.status)}
                          </span>
                        </div>
                        <div className="absolute top-4 left-4">
                          <div className="bg-white bg-opacity-90 rounded-lg p-2">
                            <PropertyIcon className="h-5 w-5 text-gray-700" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {property.address}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedProperty(property)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-500">Diện tích</p>
                            <p className="font-medium">{property.area}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Loại hình</p>
                            <p className="font-medium">{getPropertyTypeLabel(property.type)}</p>
                          </div>
                          {property.bedrooms && (
                            <div>
                              <p className="text-gray-500">Phòng ngủ</p>
                              <p className="font-medium">{property.bedrooms}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-500">ROI</p>
                            <p className="font-medium text-green-600">{property.roi}%</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Giá trị</p>
                            <p className="text-lg font-bold text-gray-900">{property.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Thuê/tháng</p>
                            <p className="text-lg font-bold text-green-600">{property.monthlyRent}</p>
                          </div>
                        </div>

                        {property.status === 'rented' && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <p className="text-gray-500">Khách thuê</p>
                                <p className="font-medium">{property.tenant}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-500">Hết hạn</p>
                                <p className="font-medium">{property.leaseExpiry}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800">
                              <Eye className="h-4 w-4 mr-1" />
                              Xem chi tiết
                            </button>
                            <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              BT: {property.lastMaintenance}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Lịch bảo trì</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm công việc
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {maintenanceSchedule.map((maintenance) => (
                  <div key={maintenance.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{maintenance.property}</h4>
                        <p className="text-sm text-gray-600">{maintenance.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(maintenance.priority)}`}>
                          {maintenance.priority === 'high' ? 'Cao' :
                           maintenance.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusColor(maintenance.status)}`}>
                          {maintenance.status === 'scheduled' ? 'Đã lên lịch' :
                           maintenance.status === 'in_progress' ? 'Đang thực hiện' : 'Hoàn thành'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Ngày thực hiện</p>
                        <p className="font-medium">{maintenance.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Chi phí dự kiến</p>
                        <p className="font-medium">{maintenance.cost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích hiệu suất</h3>
                <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Biểu đồ hiệu suất tài sản</h4>
                    <p className="text-gray-600 max-w-md">
                      Tích hợp với Chart.js hoặc D3.js để hiển thị ROI, 
                      xu hướng giá trị và doanh thu theo thời gian
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ lấp đầy</span>
                <span className="text-sm font-medium">92.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92.3%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ROI trung bình</span>
                <span className="text-sm font-medium text-green-600">6.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Doanh thu/tháng</span>
                <span className="text-sm font-medium">₫205M</span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cảnh báo</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Hợp đồng sắp hết hạn</p>
                  <p className="text-xs text-gray-600">3 hợp đồng thuê sẽ hết hạn trong 30 ngày</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Bảo trì khẩn cấp</p>
                  <p className="text-xs text-gray-600">Hệ thống điều hòa Landmark 81 cần sửa chữa</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Thanh toán hoàn tất</p>
                  <p className="text-xs text-gray-600">Tiền thuê tháng 8 đã được thu đầy đủ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Market Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng thị trường</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Giá thuê TB - Quận 1</p>
                  <p className="text-xs text-gray-600">Văn phòng hạng A</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₫650K/m²</p>
                  <p className="text-xs text-green-600">+5.2%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Tỷ lệ trống - TP.HCM</p>
                  <p className="text-xs text-gray-600">Chung cư cao cấp</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">8.5%</p>
                  <p className="text-xs text-red-600">+1.1%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">ROI trung bình</p>
                  <p className="text-xs text-gray-600">Bất động sản cho thuê</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">6.8%</p>
                  <p className="text-xs text-green-600">+0.3%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-3" />
                Thêm tài sản mới
              </button>
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <Calendar className="h-4 w-4 mr-3" />
                Lên lịch bảo trì
              </button>
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <FileText className="h-4 w-4 mr-3" />
                Tạo báo cáo
              </button>
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <Camera className="h-4 w-4 mr-3" />
                Thêm hình ảnh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}