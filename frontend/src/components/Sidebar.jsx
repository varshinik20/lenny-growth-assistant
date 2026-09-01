import React from 'react';
import { MessageSquare, Plus, Compass } from 'lucide-react';

export default function Sidebar({
  sessions = [],
  currentSessionId,
  onSelectSession,
  onCreateSession,
  loading = false
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="app-brand">
          <Compass size={24} />
          <span>Lenny Assistant</span>
        </div>
        <button
          className="new-chat-btn"
          onClick={onCreateSession}
          disabled={loading}
          title="Start a new conversation"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="sidebar-history">
        <div className="history-section-title">Recent Chats</div>
        {sessions.length === 0 ? (
          <div style={{ padding: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            No chat history
          </div>
        ) : (
          <ul className="session-list">
            {sessions.map((session) => {
              const isActive = session.id === currentSessionId;
              return (
                <li key={session.id}>
                  <button
                    className={`session-item ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectSession(session.id)}
                    title={session.title || 'New Chat'}
                  >
                    <MessageSquare size={16} style={{ flexShrink: 0 }} />
                    <span className="session-item-title">
                      {session.title || 'New Chat'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
