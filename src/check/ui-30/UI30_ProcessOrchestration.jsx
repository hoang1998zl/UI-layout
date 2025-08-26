import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  Play,
  Pause,
  RotateCcw,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Search,
  Filter,
  Eye,
  Edit,
  Bell,
  Database,
  Workflow
} from 'lucide-react';

export default function UI30_ProcessOrchestration() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedProcess, setSelectedProcess] = useState(null);

  const processMetrics = [
    {
      title: 'Quy trình đang chạy',
      value: '24',
      change: '+3',
      icon: Activity,
      color: 'bg-blue-500'
    },
    {
      title: 'Tỷ lệ thành công',
      value: '96.8%',
      change: '+2.1%',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Thời gian trung bình',
      value: '4.2 phút',
      change: '-0.8 phút',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      title: 'Cảnh báo',
      value: '3',
      change: '-2',
      icon: AlertTriangle,
      color: 'bg-orange-500'
    }
  ];

  const processes = [
    {
      id: 'PROC-001',
      name: 'Xử lý đơn hàng',
      description: 'Quy trình từ đặt hàng đến giao hàng',
      status: 'running',
      health: 'healthy',
      instances: 156,
      avgDuration: '3.2 phút',
      successRate: 98.5,
      lastRun: '2 phút trước',
      category: 'Sales'
    },
    {
      id: 'PROC-002', 
      name: 'Phê duyệt thanh toán',
      description: 'Quy trình phê duyệt các khoản thanh toán',
      status: 'running',
      health: 'warning',
      instances: 89,
      avgDuration: '8.1 phút',
      successRate: 94.2,
      lastRun: '5 phút trước',
      category: 'Finance'
    },
    {
      id: 'PROC-003',
      name: 'Onboarding nhân viên',
      description: 'Quy trình đưa nhân viên mới vào làm việc',
      status: 'paused',
      health: 'healthy',
      instances: 12,
      avgDuration: '2.3 giờ',
      successRate: 100,
      lastRun: '1 giờ trước',
      category: 'HR'
    },
    {
      id: 'PROC-004',
      name: 'Kiểm tra chất lượng',
      description: 'Quy trình kiểm tra chất lượng sản phẩm',
      status: 'error',
      health: 'critical',
      instances: 45,
      avgDuration: '12.5 phút',
      successRate: 87.3,
      lastRun: '10 phút trước',
      category: 'Quality'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'running': return 'text-green-600 bg-green-50';
      case 'paused': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'stopped': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthColor = (health) => {
    switch(health) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'running': return Play;
      case 'paused': return Pause;
      case 'error': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Điều phối Quy trình</h1>
            <p className="text-gray-600">Giám sát và quản lý các quy trình nghiệp vụ tự động</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Settings className="w-4 h-4" />
              Cấu hình
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Zap className="w-4 h-4" />
              Tạo quy trình
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {processMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    metric.change.startsWith('+') ? 'text-green-600' : 
                    metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">so với hôm qua</span>
                </div>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {['overview', 'processes', 'monitoring'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveView(tab)}
                    className={`py-4 border-b-2 font-medium text-sm ${
                      activeView === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'overview' ? 'Tổng quan' : 
                     tab === 'processes' ? 'Quy trình' : 'Giám sát'}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm quy trình..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Bộ lọc
                </button>
              </div>
            </div>

            {/* Process List */}
            <div className="p-6">
              <div className="space-y-4">
                {processes.map((process) => {
                  const StatusIcon = getStatusIcon(process.status);
                  return (
                    <motion.div
                      key={process.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <StatusIcon className="w-5 h-5 text-gray-500" />
                            <h3 className="font-medium text-gray-900">{process.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(process.status)}`}>
                              {process.status === 'running' ? 'Đang chạy' :
                               process.status === 'paused' ? 'Tạm dừng' :
                               process.status === 'error' ? 'Lỗi' : process.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(process.health)}`}>
                              {process.health === 'healthy' ? 'Tốt' :
                               process.health === 'warning' ? 'Cảnh báo' :
                               process.health === 'critical' ? 'Nghiêm trọng' : process.health}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{process.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Danh mục: {process.category}</span>
                            <span>{process.instances} instances</span>
                            <span>Thời gian TB: {process.avgDuration}</span>
                            <span>Tỷ lệ thành công: {process.successRate}%</span>
                            <span>Chạy cuối: {process.lastRun}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded">
                            <Pause className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sức khỏe hệ thống</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Cơ sở dữ liệu</span>
                </div>
                <span className="text-sm font-medium text-green-600">Tốt</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Engine quy trình</span>
                </div>
                <span className="text-sm font-medium text-green-600">Tốt</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Hệ thống thông báo</span>
                </div>
                <span className="text-sm font-medium text-yellow-600">Cảnh báo</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Tạo quy trình mới</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span>Báo cáo hiệu suất</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <Settings className="w-4 h-4 text-purple-600" />
                <span>Cấu hình engine</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>Xem logs hệ thống</span>
              </button>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cảnh báo gần đây</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Quy trình PROC-004 có tỷ lệ lỗi cao</p>
                  <p className="text-xs text-gray-500">3 phút trước</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Thời gian xử lý PROC-002 tăng 20%</p>
                  <p className="text-xs text-gray-500">15 phút trước</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Quy trình mới PROC-005 đã được tạo</p>
                  <p className="text-xs text-gray-500">1 giờ trước</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hiệu suất 24h</h3>
            <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Biểu đồ hiệu suất</p>
                <p className="text-xs text-gray-500">Tích hợp với Chart.js</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
