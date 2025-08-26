import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

export default function UI01_Dashboard00() {
  const [timeframe, setTimeframe] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  const kpiData = [
    {
      title: 'Doanh thu',
      value: '₫15.2B',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Đơn hàng',
      value: '2,847',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Khách hàng mới',
      value: '1,249',
      change: '-2.1%',
      trend: 'down',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Tỷ lệ chuyển đổi',
      value: '3.24%',
      change: '+0.8%',
      trend: 'up',
      icon: Target,
      color: 'bg-orange-500'
    }
  ];

  const tasksSummary = [
    { status: 'completed', count: 45, label: 'Hoàn thành', color: 'text-green-600 bg-green-100' },
    { status: 'pending', count: 23, label: 'Đang xử lý', color: 'text-yellow-600 bg-yellow-100' },
    { status: 'overdue', count: 8, label: 'Quá hạn', color: 'text-red-600 bg-red-100' },
  ];

  const recentTransactions = [
    { id: 'TXN-001', customer: 'Công ty ABC', amount: '₫2,400,000', status: 'completed', time: '10:30 AM' },
    { id: 'TXN-002', customer: 'Doanh nghiệp XYZ', amount: '₫1,800,000', status: 'pending', time: '09:15 AM' },
    { id: 'TXN-003', customer: 'Tập đoàn DEF', amount: '₫3,600,000', status: 'completed', time: '08:45 AM' },
    { id: 'TXN-004', customer: 'Công ty GHI', amount: '₫950,000', status: 'failed', time: '08:20 AM' },
  ];

  const upcomingMeetings = [
    { id: 1, title: 'Họp Ban giám đốc', time: '14:00 - 15:30', participants: 8, priority: 'high' },
    { id: 2, title: 'Review dự án Q4', time: '16:00 - 17:00', participants: 12, priority: 'medium' },
    { id: 3, title: 'Đào tạo nhân viên mới', time: '09:00 - 11:00 (Ngày mai)', participants: 25, priority: 'low' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Executive</h1>
            <p className="mt-1 text-sm text-gray-600">
              Tổng quan hoạt động kinh doanh ngày {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Cập nhật
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">so với kỳ trước</span>
                </div>
              </div>
              <div className={`${kpi.color} p-3 rounded-lg`}>
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Chart Area */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Xu hướng doanh thu</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Biểu đồ doanh thu</h4>
                  <p className="text-gray-600 max-w-md">
                    Tích hợp với thư viện biểu đồ như Chart.js, D3.js hoặc Recharts 
                    để hiển thị dữ liệu doanh thu theo thời gian thực
                  </p>
                  <div className="mt-4 flex justify-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Doanh thu</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Lợi nhuận</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                      <span>Chi phí</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Summary */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan công việc</h3>
              <div className="grid grid-cols-3 gap-4">
                {tasksSummary.map((task, index) => (
                  <div key={index} className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${task.color} mb-2`}>
                      {task.status === 'completed' && <CheckCircle className="h-6 w-6" />}
                      {task.status === 'pending' && <Clock className="h-6 w-6" />}
                      {task.status === 'overdue' && <AlertCircle className="h-6 w-6" />}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{task.count}</p>
                    <p className="text-sm text-gray-600">{task.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.customer}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{transaction.id}</span>
                        <span className="mx-1 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{transaction.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.amount}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'completed' ? 'Hoàn thành' :
                         transaction.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Xem tất cả giao dịch
              </button>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Cuộc họp sắp tới</h3>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{meeting.time}</p>
                        <p className="text-xs text-gray-500">{meeting.participants} người tham gia</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        meeting.priority === 'high' ? 'bg-red-100 text-red-800' :
                        meeting.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {meeting.priority === 'high' ? 'Cao' :
                         meeting.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Xem lịch đầy đủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}