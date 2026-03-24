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

// → memory.llm_context.text contains:
// "User runs a fitness business. Prefers morning workouts."

// Inject into your system prompt
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: `User context:\n${memory.llm_context.text}` },
    { role: 'user',   content: userMessage },
  ],
});
```

Same for Python:

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
| Contradiction handling | ❌ Keeps both | ✅ Resolved automatically |
| Cross-session memory | ❌ | ✅ |
| Document memory | ❌ | ✅ Built-in |
| GDPR deletion | ❌ | ✅ Audit receipt |
| LoCoMo benchmark | — | 75.0% |

**LangChain memory not working for your use case?** CLAIV is a drop-in replacement that scales.

---

## Why not just use a vector database?

Vector databases (Pinecone, Weaviate, Chroma) give you similarity search.
CLAIV gives you **structured memory**:

- Facts are extracted and deduplicated
- Temporal reasoning built in ("what did the user say last week?")
- Contradictions are resolved, not duplicated
- Token-budget-aware recall — no stuffing 50 chunks into a prompt
- Forget with a real audit trail

---

## What CLAIV does

```
POST /v6/ingest     →  Store a memory event (conversation turn, app event)
POST /v6/recall     →  Retrieve structured context for the next LLM response
POST /v6/documents  →  Upload a document for persistent RAG
POST /v6/forget     →  Delete user data (GDPR-compliant, timestamped receipt)
```

Ingest is async. Recall is synchronous and returns `llm_context.text` — ready to paste into your system prompt.

---

## Document memory (built-in RAG)

Don't want to manage a vector database? Upload documents directly to CLAIV:

```javascript
const doc = await claiv.uploadDocument({
  user_id: 'user_123',
  project_id: 'my-project',
  document_name: 'Product Manual',
  content: documentText,
});

// Next recall automatically uses the document
const memory = await claiv.recall({
  user_id: 'user_123',
  conversation_id: 'chat_abc',
  query: 'How do I install the product?',
});
```

Documents are parsed into sections and spans, embedded with pgvector, and retrieved automatically at recall time. No separate vector DB needed.

---

## Examples

| Example | Description |
|---|---|
| [examples/openai-node](examples/openai-node/) | OpenAI Node.js chatbot with persistent memory |
| [examples/langchain](examples/langchain/) | LangChain agent with CLAIV memory |
| [examples/nextjs](examples/nextjs/) | Next.js AI chat app with memory |

---

## Templates (clone and deploy)

| Template | Stack | Link |
|---|---|---|
| OpenAI Node.js | Node.js + OpenAI | [template-openai-nodejs](https://github.com/Claiv-Memory/template-openai-nodejs) |
| OpenAI Python | Python + OpenAI | [template-openai-python](https://github.com/Claiv-Memory/template-openai-python) |
| Claude Python | Python + Claude | [template-claude-python](https://github.com/Claiv-Memory/template-claude-python) |
| LangChain | Python + LangChain | [template-langchain](https://github.com/Claiv-Memory/template-langchain) |
| Next.js chat | Next.js + OpenAI | [template-nextjs](https://github.com/Claiv-Memory/template-nextjs) |
| Document RAG Python | Python + document upload | [template-document-rag-python](https://github.com/Claiv-Memory/template-document-rag-python) |
| Document RAG Next.js | Next.js + document upload | [template-document-rag-nextjs](https://github.com/Claiv-Memory/template-document-rag-nextjs) |

---

## SDKs

| | Install | Docs |
|---|---|---|
| JavaScript / TypeScript | `npm install @claiv/memory` | [sdk-js](https://github.com/Claiv-Memory/sdk-js) |
| Python | `pip install claiv-memory` | [sdk-py](https://github.com/Claiv-Memory/sdk-py) |

---

## Use cases

- **AI chatbots** that remember users across sessions
- **AI agents** that maintain context across multi-step workflows
- **SaaS apps** with per-user memory
- **Customer support** bots that know customer history
- **Internal copilots** over company documents
- **Research and compliance** tools with document memory
- **Any app** replacing fragile prompt stuffing

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

## Get started

👉 **API key:** [claiv.io](https://claiv.io)
👉 **Docs:** [claiv.io/docs](https://claiv.io/docs)

---

*Keywords: ai memory, llm memory, chatbot memory, ai agent memory, langchain memory, rag memory, openai memory, persistent memory, chatbot context, conversational memory, vector database alternative*
