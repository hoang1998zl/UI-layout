import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Video, 
  Monitor, 
  Mic,
  MicOff,
  VideoOff,
  Phone,
  Share2,
  FileText,
  Image,
  Paperclip,
  Send,
  MoreHorizontal,
  Settings,
  Clock,
  Circle,
  Edit3,
  Save,
  X,
  Plus,
  Search,
  Filter,
  Eye
} from 'lucide-react';

export default function UI20_RealtimeCollab() {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Nguyễn Văn A',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff',
      message: 'Xin chào mọi người! Chúng ta bắt đầu cuộc họp nhé.',
      timestamp: '10:30',
      type: 'text'
    },
    {
      id: 2,
      user: 'Trần Thị B',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=10b981&color=fff',
      message: 'Tôi đã chuẩn bị xong báo cáo. Có thể chia sẻ màn hình được không?',
      timestamp: '10:32',
      type: 'text'
    },
    {
      id: 3,
      user: 'Lê Văn C',
      avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=f59e0b&color=fff',
      message: 'Tệp đính kèm: Báo_cáo_Q3.pdf',
      timestamp: '10:35',
      type: 'file',
      fileName: 'Báo_cáo_Q3.pdf'
    }
  ]);

  // Ref for messages container to auto-scroll when new messages arrive
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const participants = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'Trưởng phòng',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff',
      status: 'online',
      isMuted: false,
      isVideoOn: true,
      isPresenting: false
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'Chuyên viên',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=10b981&color=fff',
      status: 'online',
      isMuted: true,
      isVideoOn: true,
      isPresenting: true
    },
    {
      id: 3,
      name: 'Lê Văn C',
      role: 'Thực tập sinh',
      avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=f59e0b&color=fff',
      status: 'online',
      isMuted: false,
      isVideoOn: false,
      isPresenting: false
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      role: 'Nhân viên',
      avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=8b5cf6&color=fff',
      status: 'away',
      isMuted: true,
      isVideoOn: true,
      isPresenting: false
    }
  ];

  const rooms = [
    {
      id: 1,
      name: 'Họp Ban Giám Đốc',
      participants: 8,
      status: 'active',
      startTime: '10:00',
      type: 'meeting'
    },
    {
      id: 2,
      name: 'Team Marketing',
      participants: 5,
      status: 'active',
      startTime: '14:30',
      type: 'collaboration'
    },
    {
      id: 3,
      name: 'Dự án ABC',
      participants: 12,
      status: 'scheduled',
      startTime: '16:00',
      type: 'project'
    }
  ];

  const sharedDocuments = [
    {
      id: 1,
      name: 'Presentation_Q3_2024.pptx',
      type: 'presentation',
      lastModified: '2 phút trước',
      modifiedBy: 'Trần Thị B',
      collaborators: 3
    },
    {
      id: 2,
      name: 'Budget_Analysis.xlsx',
      type: 'spreadsheet',
      lastModified: '15 phút trước',
      modifiedBy: 'Nguyễn Văn A',
      collaborators: 5
    },
    {
      id: 3,
      name: 'Project_Roadmap.pdf',
      type: 'document',
      lastModified: '1 giờ trước',
      modifiedBy: 'Lê Văn C',
      collaborators: 2
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: 'Bạn',
        avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'presentation': return '📊';
      case 'spreadsheet': return '📈';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cộng tác thời gian thực</h1>
            <p className="mt-1 text-sm text-gray-600">
              Làm việc nhóm, họp trực tuyến và chia sẻ tài liệu
            </p>
          </div>
          <div className="flex items-center mt-4 space-x-3 sm:mt-0">
            <button 
              onClick={() => setIsVideoCall(!isVideoCall)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Video className="w-4 h-4 mr-2" />
              {isVideoCall ? 'Kết thúc cuộc gọi' : 'Bắt đầu cuộc gọi'}
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tạo phòng mới
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Collaboration Area */}
        <div className="col-span-12 lg:col-span-8">
          {/* Video Call Interface */}
          {isVideoCall && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-6 overflow-hidden bg-black rounded-xl"
            >
              <div className="relative aspect-video">
                {/* Main Video */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                  {isScreenSharing ? (
                    <div className="text-center text-white">
                      <Monitor className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Đang chia sẻ màn hình</p>
                      <p className="text-sm opacity-75">Trần Thị B đang trình bày</p>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Cuộc họp video</p>
                      <p className="text-sm opacity-75">{participants.filter(p => p.status === 'online').length} người tham gia</p>
                    </div>
                  )}
                </div>

                {/* Participant Thumbnails */}
                <div className="absolute flex space-x-2 bottom-4 right-4">
                  {participants.slice(0, 4).map((participant) => (
                    <div key={participant.id} className="relative">
                      <div className="w-20 h-16 overflow-hidden bg-gray-800 rounded-lg">
                        <img 
                          src={participant.avatar} 
                          alt={participant.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      {!participant.isVideoOn && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                          <VideoOff className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {participant.isMuted && (
                        <div className="absolute flex items-center justify-center w-4 h-4 bg-red-500 rounded-full top-1 right-1">
                          <MicOff className="w-2 h-2 text-white" />
                        </div>
                      )}
                      {participant.isPresenting && (
                        <div className="absolute flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full top-1 left-1">
                          <Share2 className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Call Controls */}
                <div className="absolute transform -translate-x-1/2 bottom-4 left-1/2">
                  <div className="flex items-center px-4 py-2 space-x-3 bg-black bg-opacity-50 rounded-full">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} text-white hover:bg-opacity-80`}
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`p-3 rounded-full ${!isVideoOn ? 'bg-red-500' : 'bg-gray-700'} text-white hover:bg-opacity-80`}
                    >
                      {!isVideoOn ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                      className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500' : 'bg-gray-700'} text-white hover:bg-opacity-80`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsVideoCall(false)}
                      className="p-3 text-white bg-red-500 rounded-full hover:bg-red-600"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="border-b border-gray-200">
              <nav className="flex px-6 space-x-8">
                {[
                  { id: 'chat', label: 'Chat', icon: MessageCircle },
                  { id: 'documents', label: 'Tài liệu', icon: FileText },
                  { id: 'whiteboard', label: 'Bảng trắng', icon: Edit3 },
                  { id: 'rooms', label: 'Phòng họp', icon: Video }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'chat' && (
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="p-4 space-y-4 overflow-y-auto border border-gray-200 rounded-lg h-96" ref={messagesContainerRef}>
                    <AnimatePresence>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start space-x-3"
                        >
                          <img
                            src={msg.avatar}
                            alt={msg.user}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900">{msg.user}</p>
                              <p className="text-xs text-gray-500">{msg.timestamp}</p>
                            </div>
                            {msg.type === 'text' ? (
                              <p className="mt-1 text-sm text-gray-700">{msg.message}</p>
                            ) : (
                              <div className="flex items-center p-2 mt-1 space-x-2 rounded-lg bg-gray-50">
                                <Paperclip className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{msg.fileName}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Message Input */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Image className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      placeholder="Nhập tin nhắn..."
                      aria-label="Nhập tin nhắn"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      aria-label="Gửi tin nhắn"
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Tài liệu chia sẻ</h3>
                    <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800">
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm tài liệu
                    </button>
                  </div>
                  <div className="space-y-3">
                    {sharedDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getFileIcon(doc.type)}</span>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-600">
                              {doc.lastModified} bởi {doc.modifiedBy} • {doc.collaborators} người cộng tác
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'whiteboard' && (
                <div className="flex items-center justify-center border-2 border-gray-300 border-dashed rounded-lg h-96">
                  <div className="text-center">
                    <Edit3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h4 className="mb-2 text-lg font-medium text-gray-900">Bảng trắng cộng tác</h4>
                    <p className="max-w-md text-gray-600">
                      Tích hợp với các công cụ như Miro, Figma Jam hoặc Excalidraw 
                      để vẽ và brainstorm cùng nhau
                    </p>
                    <button className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      Khởi tạo bảng trắng
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'rooms' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Phòng họp</h3>
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm phòng..."
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {rooms.map((room) => (
                      <div key={room.id} className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{room.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            room.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {room.status === 'active' ? 'Đang hoạt động' : 'Đã lên lịch'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {room.participants}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {room.startTime}
                            </span>
                          </div>
                          <button className="font-medium text-blue-600 hover:text-blue-800">
                            {room.status === 'active' ? 'Tham gia' : 'Xem chi tiết'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          {/* Online Participants */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Người tham gia ({participants.filter(p => p.status === 'online').length})
            </h3>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(participant.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {participant.isMuted && (
                      <MicOff className="w-3 h-3 text-red-500" />
                    )}
                    {!participant.isVideoOn && (
                      <VideoOff className="w-3 h-3 text-gray-500" />
                    )}
                    {participant.isPresenting && (
                      <Share2 className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md bg-gray-50 hover:bg-gray-100">
                <Monitor className="w-4 h-4 mr-3" />
                Chia sẻ màn hình
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md bg-gray-50 hover:bg-gray-100">
                <FileText className="w-4 h-4 mr-3" />
                Chia sẻ tài liệu
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md bg-gray-50 hover:bg-gray-100">
                <Edit3 className="w-4 h-4 mr-3" />
                Mở bảng trắng
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md bg-gray-50 hover:bg-gray-100">
                <Save className="w-4 h-4 mr-3" />
                Ghi lại cuộc họp
              </button>
            </div>
          </div>

          {/* Meeting Notes */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Ghi chú cuộc họp</h3>
            <textarea
              placeholder="Ghi chú nhanh về cuộc họp..."
              rows={6}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="w-full px-4 py-2 mt-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Lưu ghi chú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}