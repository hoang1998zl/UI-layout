import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Users, 
  ShoppingCart, 
  FileText,
  Settings,
  BarChart3,
  Building,
  Package,
  CreditCard,
  Calendar,
  Search,
  Bell
} from 'lucide-react';

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  activeItem, 
  onItemClick,
  items = [],
  className = ''
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const defaultItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'customers', label: 'Khách hàng', icon: Users, href: '/customers', badge: '24' },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart, href: '/orders', badge: '12' },
    { id: 'products', label: 'Sản phẩm', icon: Package, href: '/products' },
    { id: 'invoices', label: 'Hóa đơn', icon: FileText, href: '/invoices' },
    { id: 'payments', label: 'Thanh toán', icon: CreditCard, href: '/payments' },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3, href: '/reports' },
    { id: 'companies', label: 'Công ty', icon: Building, href: '/companies' },
    { id: 'calendar', label: 'Lịch', icon: Calendar, href: '/calendar' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, href: '/settings' }
  ];

  const menuItems = items.length > 0 ? items : defaultItems;

  const sidebarVariants = {
    open: {
      width: '16rem',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      width: '4rem',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      initial="open"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className={`bg-white border-r border-gray-200 shadow-sm h-full flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">ERP System</h2>
                  <p className="text-xs text-gray-500">v2.0</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      {isOpen && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <li key={item.id}>
                <motion.button
                  onClick={() => onItemClick?.(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : isHovered
                      ? 'bg-gray-50 text-gray-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <IconComponent 
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`} 
                  />
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="flex items-center justify-between flex-1 min-w-0"
                      >
                        <span className="font-medium truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50"
                        >
                          {item.label}
                          {item.badge && (
                            <span className="ml-2 bg-gray-700 px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@company.com</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isOpen && (
            <button className="p-1 rounded hover:bg-gray-100">
              <Bell className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}