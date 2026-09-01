import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileCode, FileText, Play, User, Bot } from 'lucide-react';
import remarkGfm from 'remark-gfm';

export default function Message({ message, onOpenArtifact }) {
  const isAi = message.role === 'assistant';
  
  // Extract Artifact if any
  const detectArtifact = (text) => {
    if (!text) return null;
    
    // Case 1: HTML inside standard markdown code block: ```html ... ```
    const htmlCodeBlock = text.match(/```html\s*([\s\S]*?)\s*```/);
    if (htmlCodeBlock && htmlCodeBlock[1]) {
      return {
        type: 'html',
        content: htmlCodeBlock[1].trim(),
        cleanedText: text.replace(/```html[\s\S]*?```/, '').trim(),
        title: "HTML Webpage Artifact"
      };
    }

    // Case 2: Raw HTML page starts with <!DOCTYPE html> or contains <html>
    if (text.includes('<!DOCTYPE html>') || text.includes('<html>') || (text.includes('<body') && text.includes('</body>'))) {
      return {
        type: 'html',
        content: text,
        cleanedText: "Generated HTML Page Artifact",
        title: "HTML Webpage Artifact"
      };
    }

    // Case 3: Markdown wrapped in ```markdown code block
    const mdCodeBlock = text.match(/```markdown\s*([\s\S]*?)\s*```/);
    if (mdCodeBlock && mdCodeBlock[1]) {
      return {
        type: 'markdown',
        content: mdCodeBlock[1].trim(),
        cleanedText: text.replace(/```markdown[\s\S]*?```/, '').trim(),
        title: "Markdown Document Artifact"
      };
    }

    // Case 4: General markdown formatting
    const hasMarkdown = 
      /(^|\n)(#+\s+|[*-]\s+|\d+\.\s+|\|)/g.test(text) || 
      text.includes('```') || 
      /(\*\*|__|\*|_)/.test(text);

    if (hasMarkdown) {
      return {
        type: 'markdown',
        content: text,
        cleanedText: text,
        title: "Document Artifact"
      };
    }

    return null;
  };

  const artifactData = detectArtifact(message.content);
  const displayContent = artifactData && artifactData.type === 'html' ? artifactData.cleanedText : message.content;

  return (
    <div className={`message-row ${isAi ? 'ai' : 'user'}`}>
      <div className={`avatar ${isAi ? 'ai' : 'user'}`}>
        {isAi ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className="message-content-wrapper">
        <div className="message-bubble">
          {isAi ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent || '...'}</ReactMarkdown>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{displayContent}</div>
          )}

          {isAi && artifactData && (
            <div 
              className="artifact-card"
              onClick={() => onOpenArtifact({ type: artifactData.type, content: artifactData.content })}
            >
              <div className="artifact-card-icon">
                {artifactData.type === 'html' ? <FileCode size={20} /> : <FileText size={20} />}
              </div>
              <div className="artifact-card-info">
                <div className="artifact-card-title">{artifactData.title}</div>
                <div className="artifact-card-subtitle">Click to view in interactive panel</div>
              </div>
              <div className="artifact-card-action">
                <Play size={14} />
                <span>View</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
