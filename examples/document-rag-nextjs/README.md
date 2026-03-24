# Next.js Document RAG with Persistent Memory (OpenAI + CLAIV)

> Drag and drop documents. Ask questions. Your AI answers from the right section every time.
> No vector database. No RAG pipeline. Ships in minutes.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Claiv-Memory/template-document-rag-nextjs)

This template shows how to build a **Next.js document question-answering app with persistent memory** — drag-and-drop document upload, automatic indexing, and AI that answers from the right section.

## Features

- Drag-and-drop document upload (PDF, TXT, MD, DOCX, CSV)
- Documents indexed into searchable sections immediately
- Ask questions — CLAIV retrieves relevant sections automatically
- Conversation memory layered on top of document memory
- No Pinecone, Weaviate, or Chroma to manage
- Ready to deploy on Vercel

## Why not just use a vector database?

Vector databases give you similarity search. CLAIV gives you:
- Section-aware retrieval (not just top-k chunks)
- Automatic routing to the right retrieval strategy
- Document memory + conversation memory in one call
- No infrastructure to manage

## Why not build RAG yourself?

Building RAG requires: chunking strategy, embedding pipeline, vector store, retrieval logic, reranking, prompt injection. CLAIV handles all of it with one API call.

## Quickstart

```bash
git clone https://github.com/Claiv-Memory/template-document-rag-nextjs
cd template-document-rag-nextjs
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Drag in a document, then ask questions about it.

## Environment variables

```
OPENAI_API_KEY=your_openai_key
CLAIV_API_KEY=your_claiv_key
```

Get a CLAIV API key at https://claiv.io.

## How it works

```
User drags in document
      ↓
POST /api/upload → claiv.uploadDocument()
      ↓
CLAIV indexes document into sections and spans
      ↓
User asks question in chat
      ↓
claiv.recall() — routes to relevant section automatically
      ↓
OpenAI answers from retrieved context
```

## Stack

- Next.js 14 (App Router)
- Vercel AI SDK
- OpenAI GPT-4o
- CLAIV Memory — document indexing + recall

## Use cases

- Knowledge copilots over internal documentation
- Compliance and research tools
- Support assistants that reason over manuals and policies
- Due diligence platforms
- Any product combining chat memory with document context

## Related

- template-document-rag-python — Python CLI version
- template-nextjs — chat memory without documents
- claiv-memory — full examples and SDK links

Keywords: nextjs document rag, nextjs pdf question answering, document chatbot nextjs, rag without pinecone, next.js document search ai, llm document retrieval nextjs, ai document chat nextjs
