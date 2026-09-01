import React, { useState, useRef, useEffect } from 'react';
import { X, Code, Eye, Copy, Check, RotateCw, Maximize2, Minimize2, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ArtifactViewer({ artifact, onClose }) {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'code' (for HTML)
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth * 0.35); // default to 35% of screen width
  const [iframeKey, setIframeKey] = useState(0); // For reloading iframe
  
  const isDragging = useRef(false);

  // Sync width to 35% of screen on mount and window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isFullscreen) {
        setWidth(window.innerWidth * 0.35);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // Handle Drag Resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || isFullscreen) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < window.innerWidth * 0.85) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isFullscreen]);

  const startResize = (e) => {
    e.preventDefault();
    if (isFullscreen) return;
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleCopy = () => {
    const codeToCopy = artifact?.content || '';
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!artifact) return null;

  const isHtml = artifact.type === 'html';
  const isMarkdown = artifact.type === 'markdown';

  return (
    <div 
      className={`artifact-viewer ${isFullscreen ? 'fullscreen' : ''}`} 
      style={{ width: isFullscreen ? '100vw' : `${width}px` }}
    >
      {/* Resizable handle, disabled in fullscreen */}
      {!isFullscreen && (
        <div 
          className="resize-handle"
          onMouseDown={startResize}
        />
      )}

      {/* Header */}
      <div className="artifact-header">
        <div className="artifact-title-area">
          {isHtml ? (
            <Code size={18} className="artifact-title-icon" />
          ) : (
            <FileText size={18} className="artifact-title-icon" />
          )}
          <span className="artifact-title">
            {isHtml ? 'HTML Webpage Artifact' : 'Document Artifact'}
          </span>
        </div>

        <div className="artifact-actions">
          {/* Tabs for HTML Artifact */}
          {isHtml && (
            <>
              <button
                className={`artifact-action-btn ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
                title="Preview webpage"
              >
                <Eye size={16} />
              </button>
              
              <button
                className={`artifact-action-btn ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
                title="View HTML source"
              >
                <Code size={16} />
              </button>

              <button
                className="artifact-action-btn"
                onClick={() => setIframeKey((prev) => prev + 1)}
                title="Refresh preview"
                disabled={activeTab !== 'preview'}
              >
                <RotateCw size={16} />
              </button>
            </>
          )}

          {/* Copy Button */}
          <button
            className="artifact-action-btn"
            onClick={handleCopy}
            title="Copy content"
          >
            {copied ? <Check size={16} style={{ color: 'var(--success-text)' }} /> : <Copy size={16} />}
          </button>

          {/* Fullscreen Button */}
          <button
            className="artifact-action-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-color)', margin: '0 4px' }} />

          {/* Close Button */}
          <button
            className="artifact-action-btn"
            onClick={onClose}
            title="Close panel"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="artifact-body" style={{ overflowY: 'auto' }}>
        {isHtml ? (
          activeTab === 'preview' ? (
            <iframe
              key={iframeKey}
              title="Artifact Preview"
              srcDoc={artifact.content}
              sandbox="allow-scripts allow-modals allow-same-origin"
              className="artifact-iframe"
            />
          ) : (
            <pre className="artifact-code-view">
              <code>{artifact.content}</code>
            </pre>
          )
        ) : isMarkdown ? (
          <div className="artifact-markdown-view">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {artifact.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>
            Unsupported artifact type.
          </div>
        )}
      </div>
    </div>
  );
}
