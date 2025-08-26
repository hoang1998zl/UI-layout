import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  DollarSign,
  User,
  Calendar,
  Filter,
  Search,
  Eye,
  MessageSquare,
  Download,
  MoreHorizontal,
  Zap,
  Building,
  TrendingUp
} from 'lucide-react';

export default function UI02_ApprovalExec() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const approvalData = {
    pending: [
      {
        id: 'APP-001',
        type: 'purchase',
        title: 'Mua thiết bị máy tính cho phòng IT',
        amount: '₫45,000,000',
        requester: 'Nguyễn Văn A',
        department: 'Công nghệ thông tin',
        priority: 'high',
        deadline: '2024-08-25',
        description: 'Yêu cầu mua 20 máy tính để bàn Dell OptiPlex 7090 cho nhân viên mới',
        documents: ['quote.pdf', 'specs.xlsx']
      },
      {
        id: 'APP-002',
        type: 'contract',
        title: 'Hợp đồng đối tác chiến lược với ABC Corp',
        amount: '₫2,400,000,000',
        requester: 'Trần Thị B',
        department: 'Kinh doanh',
        priority: 'critical',
        deadline: '2024-08-23',
        description: 'Hợp đồng hợp tác phân phối độc quyền sản phẩm trong 3 năm',
        documents: ['contract_draft.pdf', 'financial_analysis.xlsx']
      },
      {
        id: 'APP-003',
        type: 'budget',
        title: 'Ngân sách marketing Q4 2024',
        amount: '₫180,000,000',
        requester: 'Lê Văn C',
        department: 'Marketing',
        priority: 'medium',
        deadline: '2024-08-30',
        description: 'Phân bổ ngân sách cho các chiến dịch quảng cáo và sự kiện cuối năm',
        documents: ['budget_proposal.pdf', 'campaign_plans.pptx']
      }
    ],
    approved: [
      {
        id: 'APP-004',
        type: 'travel',
        title: 'Công tác nước ngoài - Hội thảo Tokyo',
        amount: '₫25,000,000',
        requester: 'Phạm Thị D',
        department: 'Nghiên cứu phát triển',
        approvedBy: 'CEO',
        approvedDate: '2024-08-20',
        status: 'approved'
      }
    ],
    rejected: [
      {
        id: 'APP-005',
        type: 'purchase',
        title: 'Mua xe công ty mới',
        amount: '₫800,000,000',
        requester: 'Hoàng Văn E',
        department: 'Hành chính',
        rejectedBy: 'CFO',
        rejectedDate: '2024-08-18',
        rejectedReason: 'Ngân sách không phù hợp với kế hoạch tài chính hiện tại',
        status: 'rejected'
      }
    ]
  };

  const stats = [
    { label: 'Chờ duyệt', value: approvalData.pending.length, color: 'bg-yellow-500', icon: Clock },
    { label: 'Đã duyệt', value: approvalData.approved.length, color: 'bg-green-500', icon: CheckCircle },
    { label: 'Từ chối', value: approvalData.rejected.length, color: 'bg-red-500', icon: XCircle },
    { label: 'Quá hạn', value: 2, color: 'bg-orange-500', icon: AlertTriangle }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'purchase': return <DollarSign className="h-5 w-5" />;
      case 'contract': return <FileText className="h-5 w-5" />;
      case 'budget': return <TrendingUp className="h-5 w-5" />;
      case 'travel': return <Building className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleApprove = (id) => {
    console.log('Approved:', id);
    // Logic phê duyệt
  };

  const handleReject = (id) => {
    console.log('Rejected:', id);
    // Logic từ chối
  };

  const ApprovalCard = ({ approval, showActions = true }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            {getTypeIcon(approval.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{approval.title}</h3>
            <p className="text-sm text-gray-500">#{approval.id}</p>
          </div>
        </div>
        {approval.priority && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(approval.priority)}`}>
            {approval.priority === 'critical' ? 'Khẩn cấp' :
             approval.priority === 'high' ? 'Cao' :
             approval.priority === 'medium' ? 'Trung bình' : 'Thấp'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Người yêu cầu</p>
          <p className="font-medium">{approval.requester}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phòng ban</p>
          <p className="font-medium">{approval.department}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Số tiền</p>
          <p className="font-medium text-green-600">{approval.amount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            {approval.deadline ? 'Hạn cuối' : approval.approvedDate ? 'Ngày duyệt' : 'Ngày từ chối'}
          </p>
          <p className="font-medium">
            {approval.deadline || approval.approvedDate || approval.rejectedDate}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{approval.description}</p>

      {approval.documents && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Tài liệu đính kèm:</p>
          <div className="flex flex-wrap gap-2">
            {approval.documents.map((doc, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                <FileText className="h-3 w-3 mr-1" />
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}

      {approval.rejectedReason && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Lý do từ chối:</strong> {approval.rejectedReason}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedApproval(approval)}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <Eye className="h-4 w-4 mr-1" />
            Xem chi tiết
          </button>
          <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
            <MessageSquare className="h-4 w-4 mr-1" />
            Bình luận
          </button>
          <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
            <Download className="h-4 w-4 mr-1" />
            Tải xuống
          </button>
        </div>

        {showActions && activeTab === 'pending' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleReject(approval.id)}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
            >
              Từ chối
            </button>
            <button
              onClick={() => handleApprove(approval.id)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              Phê duyệt
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hệ thống phê duyệt</h1>
            <p className="mt-1 text-sm text-gray-600">
              Quản lý và xử lý các yêu cầu phê duyệt trong tổ chức
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              Phê duyệt nhanh
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm yêu cầu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="purchase">Mua sắm</option>
                  <option value="contract">Hợp đồng</option>
                  <option value="budget">Ngân sách</option>
                  <option value="travel">Công tác</option>
                </select>
              </div>
              <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                <Filter className="h-4 w-4 mr-2" />
                Lọc nâng cao
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'pending', label: 'Chờ duyệt', count: approvalData.pending.length },
                  { id: 'approved', label: 'Đã duyệt', count: approvalData.approved.length },
                  { id: 'rejected', label: 'Từ chối', count: approvalData.rejected.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {approvalData[activeTab].map((approval) => (
                    <ApprovalCard key={approval.id} approval={approval} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <Zap className="h-4 w-4 mr-3" />
                Phê duyệt hàng loạt
              </button>
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <Download className="h-4 w-4 mr-3" />
                Xuất báo cáo
              </button>
              <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                <MessageSquare className="h-4 w-4 mr-3" />
                Gửi nhắc nhở
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
            <div className="space-y-4">
              {[
                { action: 'Phê duyệt', item: 'Mua laptop Dell XPS', time: '2 giờ trước', user: 'Bạn' },
                { action: 'Từ chối', item: 'Ngân sách event Q4', time: '4 giờ trước', user: 'Bạn' },
                { action: 'Bình luận', item: 'Hợp đồng ABC Corp', time: '1 ngày trước', user: 'Nguyễn Văn A' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> đã {activity.action.toLowerCase()} 
                      <span className="font-medium"> {activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApproval && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setSelectedApproval(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Chi tiết yêu cầu</h2>
                  <button
                    onClick={() => setSelectedApproval(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <ApprovalCard approval={selectedApproval} showActions={false} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}