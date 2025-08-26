import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Clock,
  User,
  ShoppingCart,
  FileText,
  DollarSign,
  MoreHorizontal,
  Filter,
  MarkAsRead
} from 'lucide-react';

export default function NotificationPanel({ isOpen, onClose, onMarkAllRead }) {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Đơn hàng đã được duyệt',
      message: 'Đơn hàng #DH-2024-001 đã được duyệt và chuyển sang xử lý',
      time: '2 phút trước',
      read: false,
      icon: CheckCircle,
      category: 'orders'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Hàng tồn kho thấp',
      message: 'Sản phẩm "Máy tính Dell OptiPlex" chỉ còn 5 chiếc trong kho',
      time: '5 phút trước',
      read: false,
      icon: AlertTriangle,
      category: 'inventory'
    },
    {
      id: 3,
      type: 'info',
      title: 'Người dùng mới đăng ký',
      message: 'Nguyễn Văn A đã tạo tài khoản và chờ phê duyệt',
      time: '10 phút trước',
      read: true,
      icon: User,
      category: 'users'
    },
    {
      id: 4,
      type: 'success',
      title: 'Thanh toán thành công',
      message: 'Đã nhận thanh toán ₫15,000,000 từ khách hàng ABC Corp',
      time: '15 phút trước',
      read: true,
      icon: DollarSign,
      category: 'payments'
    },
    {
      id: 5,
      type: 'error',
      title: 'Lỗi đồng bộ dữ liệu',
      message: 'Không thể đồng bộ dữ liệu với hệ thống ERP. Vui lòng kiểm tra kết nối',
      time: '30 phút trước',
      read: false,
      icon: AlertTriangle,
      category: 'system'
    },
    {
      id: 6,
      type: 'info',
      title: 'Báo cáo tháng đã sẵn sàng',
      message: 'Báo cáo doanh thu tháng 8 đã được tạo và sẵn sàng để xem',
      time: '1 giờ trước',
      read: true,
      icon: FileText,
      category: 'reports'
    }
  ]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    if (onMarkAllRead) onMarkAllRead();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end pt-16 pr-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: 320, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 320, y: -20 }}
          className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Đánh dấu tất cả đã đọc
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mt-3">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'unread', label: 'Chưa đọc' },
                { key: 'read', label: 'Đã đọc' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'unread' && unreadCount > 0 && (
                    <span className="ml-1 text-xs">({unreadCount})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo'}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                      notification.read 
                        ? 'bg-gray-50 hover:bg-gray-100' 
                        : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                        <notification.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h4>
                          <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded">
                            <MoreHorizontal className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                        <p className={`text-xs mt-1 ${
                          notification.read ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${
                            notification.read ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {notification.time}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
              Xem tất cả thông báo
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}