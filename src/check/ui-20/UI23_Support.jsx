import React from 'react';

export default function UI23_Support() {
  const [activeTickets, setActiveTickets] = React.useState([
    { id: 'T-001', title: 'Login Authentication Issue', priority: 'High', status: 'Open', assignee: 'John Doe', created: '2 hours ago' },
    { id: 'T-002', title: 'Dashboard Loading Slow', priority: 'Medium', status: 'In Progress', assignee: 'Jane Smith', created: '4 hours ago' },
    { id: 'T-003', title: 'Export Function Not Working', priority: 'Low', status: 'Resolved', assignee: 'Mike Johnson', created: '1 day ago' }
  ]);
  
  const [filter, setFilter] = React.useState('all');
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'In Progress': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Resolved': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const filteredTickets = activeTickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status.toLowerCase().replace(' ', '_') === filter;
  });
  
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">UI23_Support - Help Desk</h1>
      
      {/* Support Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Open Tickets</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
          <p className="text-2xl font-bold text-orange-600">8</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Resolved Today</h3>
          <p className="text-2xl font-bold text-green-600">15</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Avg Response</h3>
          <p className="text-2xl font-bold text-purple-600">2.4h</p>
        </div>
      </div>
      
      {/* Ticket Filters and List */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="font-semibold">Support Tickets</h3>
          <div className="flex gap-2">
            {['all', 'open', 'in_progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm capitalize ${
                  filter === status 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{ticket.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{ticket.created}</span>
              </div>
              <h4 className="font-medium mb-1">{ticket.title}</h4>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Assigned to: {ticket.assignee}</span>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">View</button>
                  <button className="text-green-600 hover:text-green-800">Update</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <span>🎫</span>
            <span className="text-sm">New Ticket</span>
          </button>
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <span>📚</span>
            <span className="text-sm">Knowledge Base</span>
          </button>
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <span>📊</span>
            <span className="text-sm">Reports</span>
          </button>
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <span>⚙️</span>
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
