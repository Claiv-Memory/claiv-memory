'use client';

import { useChat } from 'ai/react';
import DocumentPanel from './components/DocumentPanel';

// In production, get these from your auth system
const USER_ID         = 'demo-user-001';
const CONVERSATION_ID = 'demo-conversation-001';
const PROJECT_ID      = 'demo-project-001';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { userId: USER_ID, conversationId: CONVERSATION_ID, projectId: PROJECT_ID },
  });

  return (
    <main style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Left panel — document upload */}
      <DocumentPanel userId={USER_ID} projectId={PROJECT_ID} />

      {/* Right panel — chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', margin: '0 0 0.25rem' }}>Document Q&A</h1>
        <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
          Upload documents on the left, then ask questions about them here.
        </p>

        {/* Message list */}
        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e5e5e5',
          borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          {messages.length === 0 && (
            <p style={{ color: '#999', textAlign: 'center', marginTop: '4rem' }}>
              Upload a document, then ask a question about it.
            </p>
          )}
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: '1rem',
              textAlign: m.role === 'user' ? 'right' : 'left' }}>
              <span style={{
                display: 'inline-block', padding: '0.5rem 0.75rem', borderRadius: 8,
                background: m.role === 'user' ? '#0070f3' : '#f5f5f5',
                color: m.role === 'user' ? 'white' : 'black',
                maxWidth: '80%', textAlign: 'left',
                whiteSpace: 'pre-wrap', lineHeight: 1.5,
              }}>
                {m.content}
              </span>
            </div>
          ))}
          {isLoading && <p style={{ color: '#999' }}>Thinking...</p>}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about your documents..."
            style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 6,
              border: '1px solid #e5e5e5', fontSize: '1rem' }}
          />
          <button type="submit" disabled={isLoading}
            style={{ padding: '0.5rem 1rem', borderRadius: 6,
              background: '#0070f3', color: 'white', border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            Ask
          </button>
        </form>
      </div>
    </main>
  );
}
