import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [contacts, setContacts] = useState([]);

  // Sample contacts
  useEffect(() => {
    if (user) {
      const sampleContacts = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          status: 'online',
          lastMessage: 'Hey! How are you?',
          lastMessageTime: new Date(Date.now() - 60000).toISOString(),
          unread: 2
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
          status: 'online',
          lastMessage: 'See you tomorrow!',
          lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
          unread: 0
        },
        {
          id: '3',
          name: 'Emily Davis',
          email: 'emily@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
          status: 'away',
          lastMessage: 'Thanks for the help!',
          lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
          unread: 0
        },
        {
          id: '4',
          name: 'Alex Thompson',
          email: 'alex@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          status: 'offline',
          lastMessage: 'Let me know when you are free',
          lastMessageTime: new Date(Date.now() - 172800000).toISOString(),
          unread: 1
        },
        {
          id: '5',
          name: 'Jessica Lee',
          email: 'jessica@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica',
          status: 'online',
          lastMessage: 'Great job on the project!',
          lastMessageTime: new Date(Date.now() - 300000).toISOString(),
          unread: 3
        }
      ];
      setContacts(sampleContacts);

      // Initialize sample conversations
      const sampleConversations = [
        {
          id: 'conv1',
          participantId: '1',
          participant: sampleContacts[0],
          messages: [
            {
              id: 'm1',
              senderId: '1',
              text: 'Hey! How are you doing?',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              read: true
            },
            {
              id: 'm2',
              senderId: user.id,
              text: "I'm doing great! Just finished working on the new project.",
              timestamp: new Date(Date.now() - 6800000).toISOString(),
              read: true
            },
            {
              id: 'm3',
              senderId: '1',
              text: "That's awesome! Can't wait to see it.",
              timestamp: new Date(Date.now() - 6000000).toISOString(),
              read: true
            },
            {
              id: 'm4',
              senderId: '1',
              text: 'Hey! How are you?',
              timestamp: new Date(Date.now() - 60000).toISOString(),
              read: false
            }
          ]
        },
        {
          id: 'conv2',
          participantId: '2',
          participant: sampleContacts[1],
          messages: [
            {
              id: 'm5',
              senderId: user.id,
              text: 'Are we still meeting tomorrow?',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              read: true
            },
            {
              id: 'm6',
              senderId: '2',
              text: 'Yes! Looking forward to it.',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              read: true
            },
            {
              id: 'm7',
              senderId: '2',
              text: 'See you tomorrow!',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              read: true
            }
          ]
        },
        {
          id: 'conv3',
          participantId: '5',
          participant: sampleContacts[4],
          messages: [
            {
              id: 'm8',
              senderId: '5',
              text: 'Great job on the project!',
              timestamp: new Date(Date.now() - 300000).toISOString(),
              read: false
            }
          ]
        }
      ];
      setConversations(sampleConversations);
    }
  }, [user]);

  const sendMessage = (conversationId, text) => {
    if (!text.trim() || !user) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: text.trim(),
          lastMessageTime: newMessage.timestamp
        };
      }
      return conv;
    }));

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMessage = {
        id: Date.now().toString(),
        senderId: activeConversation?.participantId,
        text: getSmartReply(text),
        timestamp: new Date().toISOString(),
        read: false
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, replyMessage]
          };
        }
        return conv;
      }));
    }, 2000);
  };

  const getSmartReply = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Name-related questions
    if (message.includes('name') || message.includes('who are you')) {
      return "I'm Sarah Johnson! 👋";
    }
    
    // How are you questions
    if (message.includes('how are you') || message.includes('how do you do')) {
      const responses = [
        "I'm doing great, thanks for asking! 😊",
        "Pretty good! How about you?",
        "Fantastic! Just been working on some projects."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // What are you doing
    if (message.includes('what are you doing') || message.includes('wyd')) {
      return "Just chilling, thinking about what to do next. You?";
    }
    
    // Help questions
    if (message.includes('help') || message.includes('can you')) {
      return "Of course! What do you need help with?";
    }
    
    // Thank you
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! 😊";
    }
    
    // Bye goodbye
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      return "Take care! Talk to you soon! 👋";
    }
    
    // What's up
    if (message.includes("what's up") || message.includes('wassup')) {
      return "Not much, just vibing! You?";
    }
    
    // Yes/no questions
    if (message.includes('?')) {
      const yesNoResponses = [
        "That's a good question! Let me think about it.",
        "Hmm, I'd say it depends on the situation.",
        "Maybe! What do you think?"
      ];
      return yesNoResponses[Math.floor(Math.random() * yesNoResponses.length)];
    }
    
    // Default random replies
    const defaultReplies = [
      "That's interesting! Tell me more.",
      "Got it, thanks for sharing!",
      "Sounds good! What else is new?",
      "I see! That's cool.",
      "Nice! How's everything else going?",
      "Great to hear that!",
      "Thanks for letting me know!",
      "I appreciate you telling me that!",
      "That's really neat!",
      "Wow, that's awesome!"
    ];
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  };

  const startConversation = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    const existingConv = conversations.find(c => c.participantId === contactId);
    if (existingConv) {
      setActiveConversation(existingConv);
    } else {
      const newConv = {
        id: `conv_${Date.now()}`,
        participantId: contactId,
        participant: contact,
        messages: []
      };
      setConversations(prev => [...prev, newConv]);
      setActiveConversation(newConv);
    }
  };

  const markAsRead = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    }));
  };

  const value = {
    conversations,
    activeConversation,
    setActiveConversation,
    contacts,
    sendMessage,
    startConversation,
    markAsRead,
    unreadCount: conversations.reduce((acc, conv) => {
      return acc + conv.messages.filter(m => !m.read && m.senderId !== user?.id).length;
    }, 0)
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
