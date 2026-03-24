# OpenAI Chatbot with Persistent Memory (Node.js + CLAIV)

> Add long-term memory to any OpenAI chatbot in under 10 lines.
> Works with GPT-4o, GPT-4.1, and any OpenAI model.

This template shows how to add **persistent memory to an OpenAI chatbot** — so your AI remembers users across sessions without prompt stuffing or vector database setup.

## Features

- Persistent user memory across conversations
- Works with GPT-4o, GPT-4.1, any OpenAI model
- No vector database to manage
- Automatic contradiction handling
- GDPR-compliant deletion

## Why not just stuff chat history into the prompt?

Chat history gets truncated silently, wastes tokens on irrelevant context, has no contradiction resolution, and breaks across sessions. CLAIV extracts structured facts and injects only what is relevant within your token budget.

## Why not just use LangChain memory?

LangChain ConversationBufferMemory stores raw chat history. CLAIV stores structured facts that work across sessions and handle contradictions automatically.

## Quickstart

```bash
git clone https://github.com/Claiv-Memory/template-openai-nodejs
cd template-openai-nodejs
npm install
cp .env.example .env
node src/chat.mjs
```

## Environment variables

```
OPENAI_API_KEY=your_openai_key
CLAIV_API_KEY=your_claiv_key
```

Get a CLAIV API key at https://claiv.io.

## How it works

```javascript
import { ClaivClient } from '@claiv/memory';
import OpenAI from 'openai';

const claiv  = new ClaivClient({ apiKey: process.env.CLAIV_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat(userId, conversationId, userMessage) {
  const memory = await claiv.recall({ user_id: userId, conversation_id: conversationId, query: userMessage });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: `User context:\n${memory.llm_context.text}` },
      { role: 'user', content: userMessage },
    ],
  });

  const reply = response.choices[0].message.content;

  await claiv.ingest({ user_id: userId, conversation_id: conversationId, type: 'message', role: 'user', content: userMessage });
  await claiv.ingest({ user_id: userId, conversation_id: conversationId, type: 'message', role: 'assistant', content: reply });

  return reply;
}
```

## Related

- template-nextjs — Next.js version with streaming UI
- template-openai-python — Python version
- claiv-memory — full examples and SDK links

Keywords: openai chatbot memory, openai persistent memory, nodejs chatbot memory, llm memory nodejs, chatbot long-term memory, ai memory layer, openai context across sessions
