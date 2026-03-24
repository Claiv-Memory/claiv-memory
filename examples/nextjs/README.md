# Next.js AI Chatbot with Persistent Memory (OpenAI + CLAIV)

> Build a chatbot that actually remembers users — across sessions, across devices.
> OpenAI GPT-4o + CLAIV persistent memory + Vercel AI SDK.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Claiv-Memory/template-nextjs)

This template shows how to build a **Next.js AI chatbot with persistent memory** — not just chat history, but structured facts that survive across sessions.

## Features

- Persistent memory (not just chat history)
- OpenAI GPT-4o streaming responses
- Memory recalled automatically on every turn
- Memory stored after every response
- Ready to deploy on Vercel

## Why not just use chat history?

Chat history breaks with long conversations. It gets truncated. Users repeat themselves.

CLAIV extracts **structured facts** from conversations and recalls only what is relevant — within your token budget.

## Why not just use LangChain memory?

LangChain ConversationBufferMemory stores raw chat history. It does not handle contradictions, work across sessions, or scale beyond a few turns. CLAIV does all three.

## Quickstart

```bash
git clone https://github.com/Claiv-Memory/template-nextjs
cd template-nextjs
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment variables

```
OPENAI_API_KEY=your_openai_key
CLAIV_API_KEY=your_claiv_key
```

Get a CLAIV API key at https://claiv.io.

## How it works

```
User sends message
      ↓
POST /api/chat
      ↓
claiv.recall() — fetch memory for this user
      ↓
Inject memory into system prompt
      ↓
OpenAI streams response
      ↓
claiv.ingest() — store both turns
```

## Stack

- Next.js 14 (App Router)
- Vercel AI SDK
- OpenAI GPT-4o
- CLAIV Memory — persistent memory layer

## Related templates

- template-openai-nodejs — plain Node.js, no framework
- template-document-rag-nextjs — add document upload
- claiv-memory — full examples and SDK links

Keywords: nextjs ai chatbot, nextjs chatbot memory, ai chatbot persistent memory, openai nextjs memory, llm memory nextjs, chatbot context across sessions
