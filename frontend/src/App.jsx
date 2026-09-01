import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import ArtifactViewer from './components/ArtifactViewer';
import { apiService } from './api/api';
import { useLocalStorage } from './hooks/useLocalStorage';

// Helper to generate a unique client-side ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to detect HTML or Markdown artifacts in reply text
const detectArtifact = (text) => {
  if (!text) return null;

  // Case 1: HTML inside standard markdown code block: ```html ... ```
  const htmlCodeBlock = text.match(/```html\s*([\s\S]*?)\s*```/);
  if (htmlCodeBlock && htmlCodeBlock[1]) {
    return { type: 'html', content: htmlCodeBlock[1].trim() };
  }

  // Case 2: Raw HTML page starts with <!DOCTYPE html> or contains <html>
  if (text.includes('<!DOCTYPE html>') || text.includes('<html>') || (text.includes('<body') && text.includes('</body>'))) {
    return { type: 'html', content: text };
  }

  // Case 3: Response contains Markdown formatting (headers, tables, lists, etc.)
  const hasMarkdown = 
    /(^|\n)(#+\s+|[*-]\s+|\d+\.\s+|\|)/g.test(text) || 
    text.includes('```') || 
    /(\*\*|__|\*|_)/.test(text);

  if (hasMarkdown) {
    // Check if it is wrapped in a ```markdown code block
    const mdCodeBlock = text.match(/```markdown\s*([\s\S]*?)\s*```/);
    if (mdCodeBlock && mdCodeBlock[1]) {
      return { type: 'markdown', content: mdCodeBlock[1].trim() };
    }
    return { type: 'markdown', content: text };
  }

  return null;
};

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useLocalStorage('lenny_current_session_id', null);
  const [messagesBySession, setMessagesBySession] = useLocalStorage('lenny_messages_by_session', {});
  const [artifactBySession, setArtifactBySession] = useLocalStorage('lenny_artifacts_by_session', {});
  const [isArtifactOpen, setIsArtifactOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch sessions on mount
  useEffect(() => {
    const initSessions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSessions();
        setSessions(data);
        
        if (data.length > 0) {
          // If there is a current session saved and it exists in fetched list, keep it
          const exists = data.some((s) => s.id === currentSessionId);
          if (!exists) {
            setCurrentSessionId(data[0].id);
          }
        } else {
          // No sessions on backend, create one to start
          await handleCreateSession();
        }
      } catch (err) {
        console.error("Failed to load sessions:", err);
        setError("Could not connect to Lenny Assistant backend. Please check if the server is running.");
      } finally {
        setLoading(false);
      }
    };

    initSessions();
  }, []);

  // Watch for changes in active artifact to open/close panel
  useEffect(() => {
    if (currentSessionId && artifactBySession[currentSessionId]) {
      setIsArtifactOpen(true);
    } else {
      setIsArtifactOpen(false);
    }
  }, [currentSessionId, artifactBySession]);

  // Create a new session
  const handleCreateSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newSession = await apiService.createSession(`Chat ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      
      // Initialize messages for this session
      setMessagesBySession((prev) => ({
        ...prev,
        [newSession.id]: []
      }));
    } catch (err) {
      console.error("Failed to create session:", err);
      setError("Failed to create a new chat session.");
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const handleSendMessage = async (text) => {
    if (!currentSessionId) return;
    
    // 1. Append User Message
    const userMsg = {
      id: generateId(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };

    setMessagesBySession((prev) => ({
      ...prev,
      [currentSessionId]: [...(prev[currentSessionId] || []), userMsg]
    }));

    setLoading(true);
    setError(null);

    try {
      // 2. Query Agent Backend
      const res = await apiService.sendMessage(currentSessionId, text);
      const reply = res.response;

      // 3. Detect and extract artifact
      const artifact = detectArtifact(reply);

      // If artifact was returned, cache it for this session and open visualizer
      if (artifact) {
        setArtifactBySession((prev) => ({
          ...prev,
          [currentSessionId]: artifact
        }));
        setIsArtifactOpen(true);
      }

      // 4. Append Assistant Message
      const aiMsg = {
        id: generateId(),
        role: 'assistant',
        content: reply,
        created_at: new Date().toISOString()
      };

      setMessagesBySession((prev) => ({
        ...prev,
        [currentSessionId]: [...(prev[currentSessionId] || []), aiMsg]
      }));
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error sending message. Check backend connection or Ollama service.");
    } finally {
      setLoading(false);
    }
  };

  // Open/reopen artifact panel manually (e.g. from artifact card click)
  const handleOpenArtifact = (artifact) => {
    if (currentSessionId) {
      setArtifactBySession((prev) => ({
        ...prev,
        [currentSessionId]: artifact
      }));
      setIsArtifactOpen(true);
    }
  };

  // Close artifact panel
  const handleCloseArtifact = () => {
    setIsArtifactOpen(false);
  };

  const activeMessages = currentSessionId ? (messagesBySession[currentSessionId] || []) : [];
  const activeArtifact = currentSessionId ? (artifactBySession[currentSessionId] || null) : null;

  return (
    <div className="app-container">
      {/* Sidebar List */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => setCurrentSessionId(id)}
        onCreateSession={handleCreateSession}
        loading={loading}
      />

      {/* Main Chat Area */}
      <Chat
        messages={activeMessages}
        loading={loading}
        error={error}
        onSendMessage={handleSendMessage}
        onOpenArtifact={handleOpenArtifact}
        onClearError={() => setError(null)}
      />

      {/* Artifact Right Panel */}
      {isArtifactOpen && activeArtifact && (
        <ArtifactViewer
          artifact={activeArtifact}
          onClose={handleCloseArtifact}
        />
      )}
    </div>
  );
}

