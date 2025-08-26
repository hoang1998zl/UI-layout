import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  Sun,
  Moon,
  Globe,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

export default function Topbar({ 
  onMenuToggle, 
  user,
  notifications = [],
  onNotificationClick,
  className = ''
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const userMenuItems = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
    { id: 'help', label: 'Trợ giúp', icon: HelpCircle },
    { id: 'logout', label: 'Đăng xuất', icon: LogOut, danger: true }
  ];

  return (
    <header className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm (Ctrl+K)"
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              title="Thông báo"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadNotifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </motion.span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role || 'Administrator'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || 'admin@company.com'}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    {userMenuItems.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => setShowUserMenu(false)}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm ${
                          item.danger 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click Outside Handler */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}