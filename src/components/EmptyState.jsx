import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  ShoppingCart, 
  Database, 
  Search, 
  Plus,
  FolderOpen,
  Inbox,
  AlertCircle
} from 'lucide-react';

export default function EmptyState({ 
  type = 'default',
  title,
  description,
  actionText,
  onAction,
  icon: CustomIcon,
  className = ''
}) {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'search':
        return {
          icon: Search,
          title: title || 'Không tìm thấy kết quả',
          description: description || 'Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc của bạn',
          actionText: actionText || 'Xóa bộ lọc',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500'
        };
      case 'data':
        return {
          icon: Database,
          title: title || 'Chưa có dữ liệu',
          description: description || 'Dữ liệu sẽ hiển thị ở đây khi có sẵn',
          actionText: actionText || 'Tải lại',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-500'
        };
      case 'users':
        return {
          icon: Users,
          title: title || 'Chưa có người dùng',
          description: description || 'Bắt đầu bằng cách mời người dùng đầu tiên',
          actionText: actionText || 'Mời người dùng',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-500'
        };
      case 'orders':
        return {
          icon: ShoppingCart,
          title: title || 'Chưa có đơn hàng',
          description: description || 'Đơn hàng sẽ xuất hiện ở đây khi có khách hàng đặt mua',
          actionText: actionText || 'Tạo đơn hàng',
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-500'
        };
      case 'documents':
        return {
          icon: FileText,
          title: title || 'Chưa có tài liệu',
          description: description || 'Tải lên tài liệu đầu tiên để bắt đầu',
          actionText: actionText || 'Tải lên tài liệu',
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-500'
        };
      case 'folder':
        return {
          icon: FolderOpen,
          title: title || 'Thư mục trống',
          description: description || 'Thư mục này chưa có nội dung nào',
          actionText: actionText || 'Thêm nội dung',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-500'
        };
      case 'inbox':
        return {
          icon: Inbox,
          title: title || 'Hộp thư trống',
          description: description || 'Tất cả tin nhắn đã được xử lý',
          actionText: actionText || null,
          bgColor: 'bg-emerald-50',
          iconColor: 'text-emerald-500'
        };
      case 'error':
        return {
          icon: AlertCircle,
          title: title || 'Có lỗi xảy ra',
          description: description || 'Không thể tải dữ liệu. Vui lòng thử lại',
          actionText: actionText || 'Thử lại',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-500'
        };
      default:
        return {
          icon: CustomIcon || FolderOpen,
          title: title || 'Chưa có nội dung',
          description: description || 'Nội dung sẽ hiển thị ở đây khi có sẵn',
          actionText: actionText || 'Bắt đầu',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getEmptyStateConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={`${config.bgColor} p-4 rounded-full mb-4`}
      >
        <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-medium text-gray-900 mb-2"
      >
        {config.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-gray-500 mb-6 max-w-sm"
      >
        {config.description}
      </motion.p>

      {/* Action Button */}
      {config.actionText && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {type === 'users' || type === 'orders' || type === 'documents' ? (
            <Plus className="w-4 h-4" />
          ) : null}
          {config.actionText}
        </motion.button>
      )}

      {/* Additional Actions (optional) */}
      {type === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <button className="text-sm text-gray-500 hover:text-gray-700 underline">
            Báo cáo sự cố
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}