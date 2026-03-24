# CLAIV Memory — LLM Memory Layer for AI Chatbots and Agents

> Persistent memory for OpenAI, Claude, LangChain, and any AI application.
> Drop in 3 API calls. Your AI remembers everything.

[![LoCoMo J-Score](https://img.shields.io/badge/LoCoMo%20J--Score-75.0%25-brightgreen)](https://claiv.io)
[![npm](https://img.shields.io/npm/v/@claiv/memory)](https://www.npmjs.com/package/@claiv/memory)
[![PyPI](https://img.shields.io/pypi/v/claiv-memory)](https://pypi.org/project/claiv-memory/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

The easiest way to add **persistent memory** to:

- OpenAI chatbots (GPT-4o, GPT-4.1)
- LangChain agents
- Anthropic Claude applications
- Next.js AI chat apps
- Any LLM with a system prompt

Replaces:
- LangChain `ConversationBufferMemory`
- Naive RAG-based memory systems
- Prompt stuffing with chat history

---

## Quickstart (30 seconds)

```bash
npm install @claiv/memory
```

```javascript
import { ClaivClient } from '@claiv/memory';

const claiv = new ClaivClient({ apiKey: process.env.CLAIV_API_KEY });

// Store what happened
await claiv.ingest({
  user_id: 'user_123',
  conversation_id: 'chat_abc',
  type: 'message',
  role: 'user',
  content: 'I run a fitness business and prefer morning workouts.',
});

// Recall before each response
const memory = await claiv.recall({
  user_id: 'user_123',
  conversation_id: 'chat_abc',
  query: 'What does this user do?',
});

// Inject into your system prompt
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: `User context:\n${memory.llm_context.text}` },
    { role: 'user',   content: userMessage },
  ],
});
```

Python:

```bash
pip install claiv-memory
```

```python
from claiv import ClaivClient

claiv = ClaivClient(api_key="your_key")

claiv.ingest({
    "user_id": "user_123",
    "conversation_id": "chat_abc",
    "type": "message",
    "role": "user",
    "content": "I run a fitness business and prefer morning workouts.",
})

memory = claiv.recall({
    "user_id": "user_123",
    "conversation_id": "chat_abc",
    "query": "What does this user do?",
})

system_prompt = f"User context:\n{memory['llm_context']['text']}"
```

---

## Why not just use LangChain memory?

| | LangChain ConversationBufferMemory | CLAIV Memory |
|---|---|---|
| Stores | Raw chat history | Structured, deduplicated facts |
| Long conversations | Breaks (token overflow) | No limit |
| Contradiction handling | ❌ | ✅ Resolved automatically |
| Cross-session memory | ❌ | ✅ |
| Document memory | ❌ | ✅ Built-in |
| GDPR deletion | ❌ | ✅ Audit receipt |
| LoCoMo benchmark | — | 75.0% |

**LangChain memory not working?** CLAIV is a drop-in replacement.

---

## Why not just use a vector database?

Vector databases give you similarity search. CLAIV gives you structured memory:

- Facts are extracted and deduplicated — no contradictions
- Temporal reasoning built in
- Token-budget-aware recall — not 50 raw chunks
- Document memory + conversation memory in one call
- Forget with a real audit trail

---

## How it works

```
POST /v6/ingest     →  Store a memory event (conversation turn, app event)
POST /v6/recall     →  Retrieve ranked context — ready to inject into your prompt
POST /v6/documents  →  Upload a document for persistent RAG
POST /v6/forget     →  Delete user data (GDPR-compliant, timestamped receipt)
```

---

## Document memory (built-in RAG)

Upload documents directly — no separate vector database needed:

```javascript
const doc = await claiv.uploadDocument({
  user_id: 'user_123',
  project_id: 'my-project',
  document_name: 'Product Manual',
  content: documentText,
});
// Spans indexed immediately. Recall automatically surfaces relevant sections.
```

---

## Examples

Clone any example to get started immediately:

| Example | Stack | Description |
|---|---|---|
| [examples/openai-nodejs](examples/openai-nodejs/) | Node.js + OpenAI | Chatbot with persistent memory |
| [examples/openai-python](examples/openai-python/) | Python + OpenAI | Chatbot with persistent memory |
| [examples/claude-python](examples/claude-python/) | Python + Claude | Anthropic Claude with memory |
| [examples/langchain](examples/langchain/) | Python + LangChain | LangChain memory replacement |
| [examples/nextjs](examples/nextjs/) | Next.js + OpenAI | Streaming chat app with memory |
| [examples/document-rag-python](examples/document-rag-python/) | Python | Document upload + question answering |
| [examples/document-rag-nextjs](examples/document-rag-nextjs/) | Next.js | Drag-and-drop document RAG app |

---

## Deployable app

Want a full working chatbot you can deploy in one click?

👉 [ai-chatbot-with-memory](https://github.com/Claiv-Memory/ai-chatbot-with-memory) — Next.js + OpenAI + CLAIV. Vercel deploy button included.

---

## SDKs

| | Install | Repo |
|---|---|---|
| JavaScript / TypeScript | `npm install @claiv/memory` | [sdk-js](https://github.com/Claiv-Memory/sdk-js) |
| Python | `pip install claiv-memory` | [sdk-py](https://github.com/Claiv-Memory/sdk-py) |

---

## Benchmark

**LoCoMo 10-dialogue J-score: 75.0%**

| Category | Score |
|---|---|
| Single-hop | 68.8% |
| Temporal | 74.2% |
| Multi-hop | 55.2% |
| Open-domain | 79.7% |

LoCoMo is the standard benchmark for long-context conversational memory systems.

---

## Use cases

- AI chatbots that remember users across sessions
- AI agents with multi-step context
- SaaS apps with per-user memory
- Customer support bots that know customer history
- Internal copilots over company documents
- Research and compliance tools with document memory

---

## Get started

👉 **API key:** [claiv.io](https://claiv.io)
👉 **Docs:** [claiv.io/docs](https://claiv.io/docs)

---

*Keywords: ai memory, llm memory, chatbot memory, ai agent memory, langchain memory, rag memory, openai memory, persistent memory, chatbot context, conversational memory, vector database alternative*
