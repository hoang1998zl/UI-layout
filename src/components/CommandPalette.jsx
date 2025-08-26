import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command, 
  ArrowRight, 
  Hash, 
  User, 
  FileText, 
  Settings,
  Calendar,
  Calculator,
  Download,
  Upload,
  Bell,
  Shield,
  Zap
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      id: 'search-orders',
      title: 'Tìm kiếm đơn hàng',
      subtitle: 'Tìm đơn hàng theo ID hoặc khách hàng',
      icon: Search,
      category: 'Tìm kiếm',
      shortcut: 'Ctrl+Shift+O'
    },
    {
      id: 'create-invoice',
      title: 'Tạo hóa đơn mới',
      subtitle: 'Tạo hóa đơn cho khách hàng',
      icon: FileText,
      category: 'Tạo mới',
      shortcut: 'Ctrl+Shift+I'
    },
    {
      id: 'user-management',
      title: 'Quản lý người dùng',
      subtitle: 'Thêm, sửa, xóa người dùng',
      icon: User,
      category: 'Quản lý',
      shortcut: 'Ctrl+Shift+U'
    },
    {
      id: 'settings',
      title: 'Cài đặt hệ thống',
      subtitle: 'Cấu hình và tùy chỉnh hệ thống',
      icon: Settings,
      category: 'Cài đặt',
      shortcut: 'Ctrl+,'
    },
    {
      id: 'calendar',
      title: 'Lịch làm việc',
      subtitle: 'Xem lịch và tạo sự kiện',
      icon: Calendar,
      category: 'Tiện ích',
      shortcut: 'Ctrl+Shift+C'
    },
    {
      id: 'calculator',
      title: 'Máy tính',
      subtitle: 'Máy tính nhanh',
      icon: Calculator,
      category: 'Tiện ích',
      shortcut: 'Ctrl+Shift+K'
    },
    {
      id: 'export-data',
      title: 'Xuất dữ liệu',
      subtitle: 'Xuất báo cáo và dữ liệu',
      icon: Download,
      category: 'Dữ liệu',
      shortcut: 'Ctrl+E'
    },
    {
      id: 'import-data',
      title: 'Nhập dữ liệu',
      subtitle: 'Nhập dữ liệu từ file',
      icon: Upload,
      category: 'Dữ liệu',
      shortcut: 'Ctrl+I'
    },
    {
      id: 'notifications',
      title: 'Thông báo',
      subtitle: 'Xem tất cả thông báo',
      icon: Bell,
      category: 'Thông báo',
      shortcut: 'Ctrl+Shift+N'
    },
    {
      id: 'security',
      title: 'Bảo mật',
      subtitle: 'Cài đặt bảo mật và quyền truy cập',
      icon: Shield,
      category: 'Bảo mật',
      shortcut: 'Ctrl+Shift+S'
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    command.category.toLowerCase().includes(query.toLowerCase())
  );

  const categories = [...new Set(filteredCommands.map(cmd => cmd.category))];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            handleCommand(filteredCommands[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  const handleCommand = (command) => {
    console.log('Executing command:', command.id);
    // Here you would implement the actual command execution
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm lệnh hoặc chức năng..."
                className="w-full py-3 pl-10 pr-4 text-lg border-none outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-96">
            {categories.map((category) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 bg-gray-50">
                  {category}
                </div>
                {filteredCommands
                  .filter(cmd => cmd.category === category)
                  .map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command);
                    return (
                      <motion.div
                        key={command.id}
                        className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          selectedIndex === globalIndex 
                            ? 'bg-blue-50 border-blue-100' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleCommand(command)}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              selectedIndex === globalIndex ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <command.icon className={`w-4 h-4 ${
                                selectedIndex === globalIndex ? 'text-blue-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{command.title}</div>
                              <div className="text-sm text-gray-500">{command.subtitle}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {command.shortcut && (
                              <div className="px-2 py-1 font-mono text-xs text-gray-400 bg-gray-100 rounded">
                                {command.shortcut}
                              </div>
                            )}
                            <ArrowRight className={`w-4 h-4 ${
                              selectedIndex === globalIndex ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 rounded-b-lg bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Command className="w-3 h-3" />
                  <span>Ctrl+K để mở</span>
                </div>
                <div>↑↓ để điều hướng</div>
                <div>Enter để chọn</div>
                <div>Esc để đóng</div>
              </div>
              <div>
                {filteredCommands.length} kết quả
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}