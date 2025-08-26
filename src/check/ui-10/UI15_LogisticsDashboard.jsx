import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Navigation,
  Fuel,
  Users,
  BarChart3,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Route,
  Warehouse,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function UI15_LogisticsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [activeTab, setActiveTab] = useState('overview');

  const dashboardStats = [
    {
      title: 'Tổng đơn hàng',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Đang vận chuyển',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: Truck,
      color: 'bg-green-500'
    },
    {
      title: 'Đã giao thành công',
      value: '1,158',
      change: '+8%',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-emerald-500'
    },
    {
      title: 'Giao hàng trễ',
      value: '15',
      change: '-3%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const activeShipments = [
    {
      id: 'SH-001',
      order: 'DH-2024-156',
      customer: 'Công ty ABC',
      destination: 'Hà Nội',
      driver: 'Nguyễn Văn A',
      vehicle: '29A-12345',
      status: 'in_transit',
      progress: 75,
      estimatedArrival: '14:30',
      distance: '25km'
    },
    {
      id: 'SH-002',
      order: 'DH-2024-157',
      customer: 'Doanh nghiệp XYZ',
      destination: 'TP.HCM',
      driver: 'Trần Văn B',
      vehicle: '30B-67890',
      status: 'loading',
      progress: 10,
      estimatedArrival: '16:45',
      distance: '180km'
    },
    {
      id: 'SH-003',
      order: 'DH-2024-158',
      customer: 'Tập đoàn DEF',
      destination: 'Đà Nẵng',
      driver: 'Lê Thị C',
      vehicle: '43C-11111',
      status: 'delivered',
      progress: 100,
      estimatedArrival: 'Đã giao',
      distance: '0km'
    }
  ];

  const warehouses = [
    {
      id: 'WH-001',
      name: 'Kho Hà Nội',
      location: 'Hà Nội',
      capacity: '85%',
      orders: 45,
      status: 'operational'
    },
    {
      id: 'WH-002',
      name: 'Kho TP.HCM',
      location: 'TP. Hồ Chí Minh',
      capacity: '92%',
      orders: 67,
      status: 'near_full'
    },
    {
      id: 'WH-003',
      name: 'Kho Đà Nẵng',
      location: 'Đà Nẵng',
      capacity: '67%',
      orders: 23,
      status: 'operational'
    }
  ];

  const drivers = [
    {
      id: 'DR-001',
      name: 'Nguyễn Văn A',
      vehicle: '29A-12345',
      status: 'active',
      currentLoad: 'DH-2024-156',
      location: 'Đang đi Hà Nội',
      rating: 4.8
    },
    {
      id: 'DR-002',
      name: 'Trần Văn B',
      vehicle: '30B-67890',
      status: 'loading',
      currentLoad: 'DH-2024-157',
      location: 'Kho TP.HCM',
      rating: 4.6
    },
    {
      id: 'DR-003',
      name: 'Lê Thị C',
      vehicle: '43C-11111',
      status: 'available',
      currentLoad: 'Không có',
      location: 'Kho Đà Nẵng',
      rating: 4.9
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'loading': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_transit': return 'Đang vận chuyển';
      case 'loading': return 'Đang tải hàng';
      case 'delivered': return 'Đã giao';
      case 'delayed': return 'Trễ hạn';
      default: return 'Không xác định';
    }
  };

  const getWarehouseStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600';
      case 'near_full': return 'text-yellow-600';
      case 'full': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Logistics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Quản lý vận chuyển và logistics toàn hệ thống
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <RefreshCw className="h-4 w-4 mr-2" />
              Cập nhật
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
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
              { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
              { id: 'shipments', label: 'Vận chuyển', icon: Truck },
              { id: 'warehouses', label: 'Kho bãi', icon: Warehouse },
              { id: 'drivers', label: 'Tài xế', icon: Users },
              { id: 'routes', label: 'Tuyến đường', icon: Route }
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Map View */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Bản đồ theo dõi thời gian thực</h3>
                </div>
                <div className="p-6">
                  <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Navigation className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Bản đồ GPS</h4>
                      <p className="text-gray-600 max-w-md">
                        Tích hợp với Google Maps hoặc Mapbox để theo dõi 
                        vị trí xe và tuyến đường thời gian thực
                      </p>
                      <div className="mt-4 flex justify-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span>Đang vận chuyển</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span>Đã giao</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span>Trễ hạn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Hiệu suất vận chuyển</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">96.5%</p>
                      <p className="text-sm text-gray-600">Tỷ lệ giao đúng hạn</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">2.4h</p>
                      <p className="text-sm text-gray-600">Thời gian giao trung bình</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Fuel className="h-8 w-8 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">8.2L</p>
                      <p className="text-sm text-gray-600">Tiêu thụ nhiên liệu/100km</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Đơn vận chuyển đang hoạt động</h3>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {activeShipments.map((shipment) => (
                  <div key={shipment.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{shipment.order}</h4>
                        <p className="text-sm text-gray-600">{shipment.customer}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {getStatusText(shipment.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Tài xế</p>
                        <p className="font-medium">{shipment.driver}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Xe</p>
                        <p className="font-medium">{shipment.vehicle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Đến</p>
                        <p className="font-medium">{shipment.destination}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dự kiến</p>
                        <p className="font-medium">{shipment.estimatedArrival}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Tiến độ</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${shipment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4 mr-1" />
                          Xem chi tiết
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
                          <MapPin className="h-4 w-4 mr-1" />
                          Theo dõi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'warehouses' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Tình trạng kho bãi</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {warehouses.map((warehouse) => (
                    <div key={warehouse.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{warehouse.name}</h4>
                        <Warehouse className={`h-5 w-5 ${getWarehouseStatusColor(warehouse.status)}`} />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{warehouse.location}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Công suất</span>
                          <span className="font-medium">{warehouse.capacity}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              parseInt(warehouse.capacity) > 90 ? 'bg-red-500' :
                              parseInt(warehouse.capacity) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: warehouse.capacity }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Đơn hàng chờ</span>
                          <span className="font-medium">{warehouse.orders}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Danh sách tài xế</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {drivers.map((driver) => (
                  <div key={driver.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{driver.name}</h4>
                          <p className="text-sm text-gray-600">Xe: {driver.vehicle}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600 ml-1">{driver.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          driver.status === 'active' ? 'bg-green-100 text-green-800' :
                          driver.status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {driver.status === 'active' ? 'Đang hoạt động' :
                           driver.status === 'loading' ? 'Đang tải hàng' : 'Sẵn sàng'}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{driver.currentLoad}</p>
                        <p className="text-xs text-gray-500">{driver.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <Package className="h-4 w-4 mr-3" />
                Tạo đơn vận chuyển
              </button>
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <Route className="h-4 w-4 mr-3" />
                Tối ưu tuyến đường
              </button>
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <Calendar className="h-4 w-4 mr-3" />
                Lên lịch giao hàng
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cảnh báo</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Xe 29A-12345 bị trễ</p>
                  <p className="text-xs text-gray-600">Dự kiến trễ 30 phút do tắc đường</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Kho TP.HCM gần đầy</p>
                  <p className="text-xs text-gray-600">Công suất đạt 92%, cần sắp xếp lại</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Giao hàng thành công</p>
                  <p className="text-xs text-gray-600">Đơn DH-2024-158 đã được giao</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thời tiết</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Hà Nội</p>
                <p className="text-lg font-bold">28°C</p>
                <p className="text-xs text-gray-500">Nắng</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">TP.HCM</p>
                <p className="text-lg font-bold">32°C</p>
                <p className="text-xs text-gray-500">Mưa nhẹ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}