-- Chat Support System Schema Extension
-- Minimalist chat tables for live support

-- Chat sessions table - Store individual chat conversations
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  agent_id INTEGER, -- NULL when no agent assigned
  status TEXT CHECK(status IN ('waiting', 'active', 'resolved', 'closed')) DEFAULT 'waiting',
  subject TEXT, -- Optional chat subject/category
  priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Chat messages table - Store individual messages in conversations
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  sender_type TEXT CHECK(sender_type IN ('user', 'agent', 'system')) NOT NULL,
  message_text TEXT NOT NULL,
  message_type TEXT CHECK(message_type IN ('text', 'system', 'file')) DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Chat agent status table - Track agent availability
CREATE TABLE IF NOT EXISTS chat_agent_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER UNIQUE NOT NULL,
  status TEXT CHECK(status IN ('online', 'busy', 'offline')) DEFAULT 'offline',
  max_concurrent_chats INTEGER DEFAULT 3,
  current_chat_count INTEGER DEFAULT 0,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_agent_id ON chat_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_agent_status_agent_id ON chat_agent_status(agent_id);

-- Insert default agent status for admin users (will be populated dynamically)
-- Admin users can be set as chat agents through the admin interface