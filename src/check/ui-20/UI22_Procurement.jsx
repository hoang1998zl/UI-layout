import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Truck,
  DollarSign,
  Building,
  Calendar
} from 'lucide-react';

export default function UI22_Procurement() {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedPO, setSelectedPO] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const kpiData = [
    { 
      title: 'Tổng đơn mua', 
      value: '2,847', 
      change: '+12%', 
      icon: ShoppingCart, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Giá trị đơn hàng', 
      value: '₫85.2B', 
      change: '+8.5%', 
      icon: DollarSign, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Nhà cung cấp', 
      value: '156', 
      change: '+3', 
      icon: Building, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Tiết kiệm', 
      value: '₫12.8B', 
      change: '+15%', 
      icon: TrendingUp, 
      color: 'bg-orange-500' 
    }
  ];

  const purchaseOrders = [
    {
      id: 'PO-2024-001',
      vendor: 'Công ty TNHH Vật tư XYZ',
      category: 'Văn phòng phẩm',
      amount: 45000000,
      status: 'approved',
      priority: 'high',
      dateCreated: '2024-08-20',
      expectedDelivery: '2024-08-25',
      items: 12,
      approver: 'Nguyễn Văn A'
    },
    {
      id: 'PO-2024-002',
      vendor: 'Công ty CP Thiết bị IT',
      category: 'Công nghệ',
      amount: 125000000,
      status: 'pending',
      priority: 'critical',
      dateCreated: '2024-08-19',
      expectedDelivery: '2024-08-28',
      items: 5,
      approver: 'Trần Thị B'
    },
    {
      id: 'PO-2024-003',
      vendor: 'Nhà cung cấp ABC',
      category: 'Nguyên vật liệu',
      amount: 78000000,
      status: 'delivered',
      priority: 'medium',
      dateCreated: '2024-08-18',
      expectedDelivery: '2024-08-23',
      items: 8,
      approver: 'Lê Văn C'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'delivered': return 'text-blue-600 bg-blue-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Thu mua</h1>
            <p className="text-gray-600">Theo dõi đơn mua hàng, nhà cung cấp và quy trình thu mua</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Tạo đơn mua
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-green-600">{kpi.change}</span>
                  <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                </div>
              </div>
              <div className={`${kpi.color} p-3 rounded-lg`}>
                <kpi.icon className="w-6 h-6 text-white" />
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
                {['orders', 'vendors', 'analytics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'orders' ? 'Đơn mua hàng' : tab === 'vendors' ? 'Nhà cung cấp' : 'Phân tích'}
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
                    placeholder="Tìm kiếm đơn hàng, nhà cung cấp..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Bộ lọc
                </button>
              </div>
            </div>

            {/* Purchase Orders List */}
            <div className="p-6">
              <div className="space-y-4">
                {purchaseOrders.map((po) => (
                  <motion.div
                    key={po.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{po.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                            {po.status === 'approved' ? 'Đã duyệt' : 
                             po.status === 'pending' ? 'Chờ duyệt' : 
                             po.status === 'delivered' ? 'Đã giao' : po.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(po.priority)}`}>
                            {po.priority === 'critical' ? 'Khẩn cấp' :
                             po.priority === 'high' ? 'Cao' :
                             po.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{po.vendor}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Danh mục: {po.category}</span>
                          <span>{po.items} sản phẩm</span>
                          <span>Giao hàng: {po.expectedDelivery}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(po.amount)}</p>
                          <p className="text-xs text-gray-500">Người duyệt: {po.approver}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Tạo đơn mua mới</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <Users className="w-4 h-4 text-green-600" />
                <span>Quản lý nhà cung cấp</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Tạo báo cáo thu mua</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Lên kế hoạch mua sắm</span>
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Đơn PO-2024-001 đã được duyệt</p>
                  <p className="text-xs text-gray-500">5 phút trước</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Nhà cung cấp mới đã được thêm</p>
                  <p className="text-xs text-gray-500">15 phút trước</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Cảnh báo: Đơn PO-2024-002 quá hạn</p>
                  <p className="text-xs text-gray-500">1 giờ trước</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Chờ phê duyệt</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">PO-2024-004</p>
                  <p className="text-xs text-gray-600">₫65,000,000</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">PO-2024-005</p>
                  <p className="text-xs text-gray-600">₫32,000,000</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
