'use client';

import { useState, useRef } from 'react';

interface UploadedDoc {
  document_id: string;
  filename: string;
  status: string;
  sections: number;
}

interface Props {
  userId: string;
  projectId: string;
}

export default function DocumentPanel({ userId, projectId }: Props) {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('projectId', projectId);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      setDocs((prev) => [
        ...prev,
        {
          document_id: data.document_id,
          filename: file.name,
          status: data.document_status?.status ?? 'processing',
          sections: data.sections?.length ?? 0,
        },
      ]);
    } catch (err) {
      alert(`Failed to upload ${file.name}`);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(uploadFile);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach(uploadFile);
    e.target.value = '';
  }

  return (
    <div style={{ width: 280, borderRight: '1px solid #e5e5e5', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h2 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Documents</h2>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#0070f3' : '#d0d0d0'}`,
          borderRadius: 8,
          padding: '1.5rem 1rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? '#f0f7ff' : 'transparent',
          transition: 'all 0.15s',
        }}
      >
        <input ref={inputRef} type="file" style={{ display: 'none' }} multiple onChange={handleFileChange}
          accept=".pdf,.txt,.md,.docx,.csv" />
        {uploading ? (
          <p style={{ color: '#999', fontSize: '0.85rem', margin: 0 }}>Uploading...</p>
        ) : (
          <>
            <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Drop files here</p>
            <p style={{ color: '#999', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>or click to browse</p>
          </>
        )}
      </div>

      {/* Document list */}
      {docs.length === 0 ? (
        <p style={{ color: '#bbb', fontSize: '0.8rem', margin: 0 }}>No documents yet</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {docs.map((doc) => (
            <li key={doc.document_id} style={{ background: '#f5f5f5', borderRadius: 6, padding: '0.5rem 0.75rem' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {doc.filename}
              </p>
              <p style={{ margin: '0.1rem 0 0', fontSize: '0.7rem', color: doc.status === 'ready' ? '#22c55e' : '#f59e0b' }}>
                {doc.status === 'ready' ? `Ready · ${doc.sections} sections` : 'Processing...'}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p style={{ fontSize: '0.7rem', color: '#bbb', margin: 0 }}>
        Supported: PDF, TXT, MD, DOCX, CSV
      </p>
    </div>
  );
}
