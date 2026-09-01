import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import Message from './Message';

export default function Chat({
  messages = [],
  loading = false,
  error = null,
  onSendMessage,
  onOpenArtifact,
  onClearError
}) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Reset textarea height on input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    onSendMessage(input.trim());
    setInput('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (loading) return;
    onSendMessage(suggestion);
  };

  const suggestions = [
    "Design a product launch page in HTML",
    "Explain standard SaaS metrics like MRR and Churn",
    "Draft a customer onboarding checklist",
    "Analyze the conversion rate optimization checklist"
  ];

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-title">Conversational AI Assistant</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Powered by Ollama</span>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success-text)' }} />
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button className="error-close" onClick={onClearError}>Dismiss</button>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="messages-pane">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <Sparkles size={32} />
            </div>
            <h2>I'm Lenny, your growth assistant</h2>
            <p>
              Ask me standard growth questions, SaaS strategy queries, or request interactive mockups and dashboard components.
            </p>
            <div className="welcome-suggestions">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  className="suggestion-card"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <Message
              key={msg.id || index}
              message={msg}
              onOpenArtifact={onOpenArtifact}
            />
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="message-row ai">
            <div className="avatar ai">
              <Sparkles size={18} />
            </div>
            <div className="message-content-wrapper">
              <div className="message-bubble" style={{ minWidth: '80px' }}>
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="chat-input-container">
        <form className="chat-input-wrapper" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Send a message to Lenny..."
            className="chat-input-textarea"
            disabled={loading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || loading}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
