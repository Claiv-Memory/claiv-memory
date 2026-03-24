'use client';

import { useChat } from 'ai/react';

// In production, get these from your auth system
const USER_ID         = 'demo-user-001';
const CONVERSATION_ID = 'demo-conversation-001';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { userId: USER_ID, conversationId: CONVERSATION_ID },
  });

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Claiv Memory × Next.js</h1>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
        This AI remembers you across sessions. Close the tab and come back — it still knows who you are.
      </p>

      <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: '1rem',
        minHeight: 400, marginBottom: '1rem', overflowY: 'auto' }}>
        {messages.length === 0 && (
          <p style={{ color: '#999', textAlign: 'center', marginTop: '4rem' }}>
            Say hello — tell me your name and what you work on.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: '1rem',
            textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block', padding: '0.5rem 0.75rem', borderRadius: 8,
              background: m.role === 'user' ? '#0070f3' : '#f5f5f5',
              color: m.role === 'user' ? 'white' : 'black',
              maxWidth: '80%',
            }}>
              {m.content}
            </span>
          </div>
        ))}
        {isLoading && <p style={{ color: '#999' }}>Thinking...</p>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 6,
            border: '1px solid #e5e5e5', fontSize: '1rem' }}
        />
        <button type="submit" disabled={isLoading}
          style={{ padding: '0.5rem 1rem', borderRadius: 6,
            background: '#0070f3', color: 'white', border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer' }}>
          Send
        </button>
      </form>
    </main>
  );
}
