import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building2, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Menu,
  ChevronDown,
  MessageSquare,
  Calendar,
  TrendingUp,
  FileText,
  Shield,
  Zap
} from 'lucide-react';

export default function UI00_Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, badge: null },
    { id: 'companies', name: 'Công ty', icon: Building2, badge: '3' },
    { id: 'users', name: 'Người dùng', icon: Users, badge: '24' },
    { id: 'analytics', name: 'Phân tích', icon: TrendingUp, badge: null },
    { id: 'documents', name: 'Tài liệu', icon: FileText, badge: '12' },
    { id: 'security', name: 'Bảo mật', icon: Shield, badge: null },
    { id: 'automation', name: 'Tự động hóa', icon: Zap, badge: '2' },
  ];

  const quickStats = [
    { label: 'Tổng doanh thu', value: '₫2.4B', change: '+12%', color: 'text-green-600' },
    { label: 'Đơn hàng mới', value: '156', change: '+8%', color: 'text-blue-600' },
    { label: 'Khách hàng hoạt động', value: '1,234', change: '+15%', color: 'text-purple-600' },
    { label: 'Tỷ lệ hoàn thành', value: '94.2%', change: '+2%', color: 'text-orange-600' }
  ];

  const recentActivities = [
    { id: 1, type: 'order', message: 'Đơn hàng mới #DH-2024-001 đã được tạo', time: '5 phút trước', status: 'success' },
    { id: 2, type: 'user', message: 'Người dùng mới Nguyễn Văn A đã đăng ký', time: '10 phút trước', status: 'info' },
    { id: 3, type: 'payment', message: 'Thanh toán ₫5,000,000 đã được xử lý', time: '15 phút trước', status: 'success' },
    { id: 4, type: 'alert', message: 'Cảnh báo: Hàng tồn kho thấp cho sản phẩm SP-001', time: '20 phút trước', status: 'warning' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">ERP Shell</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff"
                  alt="Avatar"
                />
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`${
                      activeModule === module.id
                        ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  >
                    <module.icon className="mr-3 h-5 w-5" />
                    {module.name}
                    {module.badge && (
                      <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-blue-100 text-blue-800">
                        {module.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Tổng quan hệ thống ERP</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Main Content Area */}
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Biểu đồ doanh thu</h3>
                    <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-gray-600">Biểu đồ doanh thu theo tháng</p>
                        <p className="text-sm text-gray-500">Tích hợp với Chart.js hoặc Recharts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-800">Xem tất cả</button>
                    </div>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                            activity.status === 'success' ? 'bg-green-400' :
                            activity.status === 'warning' ? 'bg-yellow-400' :
                            'bg-blue-400'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow mt-6">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50">
                        <Calendar className="mr-3 h-4 w-4" />
                        Tạo cuộc họp
                      </button>
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50">
                        <FileText className="mr-3 h-4 w-4" />
                        Tạo báo cáo
                      </button>
                      <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50">
                        <MessageSquare className="mr-3 h-4 w-4" />
                        Gửi thông báo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}