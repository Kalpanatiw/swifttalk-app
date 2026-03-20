import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { 
  MessageCircle, 
  Search, 
  LogOut, 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  Phone,
  Video,
  Circle,
  Check,
  CheckCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { 
    conversations, 
    contacts, 
    activeConversation, 
    setActiveConversation,
    sendMessage,
    startConversation,
    markAsRead,
    unreadCount
  } = useChat();
  
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  useEffect(() => {
    if (activeConversation) {
      markAsRead(activeConversation.id);
    }
  }, [activeConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeConversation) {
      sendMessage(activeConversation.id, message);
      setMessage('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact => 
    !conversations.find(c => c.participantId === contact.id) &&
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'away': return '#f59e0b';
      case 'offline': return '#94a3b8';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              className="user-avatar"
            />
            <div className="user-info">
              <h3>{user?.name}</h3>
              <span className="user-status">
                <Circle size={8} fill="#22c55e" stroke="none" />
                Online
              </span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>

        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="tabs">
          <button 
            className={`tab ${!showContacts ? 'active' : ''}`}
            onClick={() => setShowContacts(false)}
          >
            Chats {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <button 
            className={`tab ${showContacts ? 'active' : ''}`}
            onClick={() => setShowContacts(true)}
          >
            Contacts
          </button>
        </div>

        <div className="conversations-list">
          {!showContacts ? (
            filteredConversations.length > 0 ? (
              filteredConversations.map(conv => {
                const unread = conv.messages.filter(m => !m.read && m.senderId !== user.id).length;
                return (
                  <div
                    key={conv.id}
                    className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                    onClick={() => setActiveConversation(conv)}
                  >
                    <div className="avatar-container">
                      <img 
                        src={conv.participant.avatar} 
                        alt={conv.participant.name}
                        className="contact-avatar"
                      />
                      <span 
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(conv.participant.status) }}
                      ></span>
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <h4>{conv.participant.name}</h4>
                        <span className="time">{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <p className="last-message">{conv.lastMessage}</p>
                    </div>
                    {unread > 0 && <span className="unread-badge">{unread}</span>}
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <MessageCircle size={48} strokeWidth={1} />
                <p>No conversations yet</p>
                <button onClick={() => setShowContacts(true)}>Start a chat</button>
              </div>
            )
          ) : (
            filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className="conversation-item"
                  onClick={() => startConversation(contact.id)}
                >
                  <div className="avatar-container">
                    <img 
                      src={contact.avatar} 
                      alt={contact.name}
                      className="contact-avatar"
                    />
                    <span 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(contact.status) }}
                    ></span>
                  </div>
                  <div className="conversation-info">
                    <h4>{contact.name}</h4>
                    <p className="status-text">{contact.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <MessageCircle size={48} strokeWidth={1} />
                <p>No contacts found</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {activeConversation ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <img 
                  src={activeConversation.participant.avatar} 
                  alt={activeConversation.participant.name}
                  className="chat-avatar"
                />
                <div>
                  <h3>{activeConversation.participant.name}</h3>
                  <span className="chat-status">
                    <Circle 
                      size={8} 
                      fill={getStatusColor(activeConversation.participant.status)} 
                      stroke="none" 
                    />
                    {activeConversation.participant.status}
                  </span>
                </div>
              </div>
              <div className="chat-actions">
                <button title="Voice Call"><Phone size={20} /></button>
                <button title="Video Call"><Video size={20} /></button>
                <button title="More"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="messages-container">
              {activeConversation.messages.map((msg, index) => {
                const isOwn = msg.senderId === user.id;
                const showAvatar = index === 0 || 
                  activeConversation.messages[index - 1].senderId !== msg.senderId;
                
                return (
                  <div 
                    key={msg.id} 
                    className={`message ${isOwn ? 'own' : ''}`}
                  >
                    {!isOwn && showAvatar && (
                      <img 
                        src={activeConversation.participant.avatar} 
                        alt=""
                        className="message-avatar"
                      />
                    )}
                    {!isOwn && !showAvatar && <div className="message-spacer"></div>}
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                      <span className="message-time">
                        {formatTime(msg.timestamp)}
                        {isOwn && (
                          msg.read ? <CheckCheck size={14} /> : <Check size={14} />
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-input">
              <button type="button" className="input-action" title="Attach file">
                <Paperclip size={20} />
              </button>
              <button type="button" className="input-action" title="Emoji">
                <Smile size={20} />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!message.trim()}>
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-icon">
              <MessageCircle size={80} strokeWidth={1} />
            </div>
            <h2>Welcome to SwiftTalk</h2>
            <p>Select a conversation or start a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
