# LangChain Agent with Persistent Memory (CLAIV — LangChain Memory Replacement)

> Replace LangChain ConversationBufferMemory with structured, cross-session memory.
> Works with LangChain, LangGraph, and any Python LLM framework.

This template shows how to replace LangChain's built-in memory with **CLAIV persistent memory** — so your LangChain agent remembers users across sessions with structured facts, not raw chat history.

## Why replace LangChain memory?

LangChain `ConversationBufferMemory` and `ConversationSummaryMemory`:

| | LangChain Memory | CLAIV Memory |
|---|---|---|
| Stores | Raw chat history | Structured, deduplicated facts |
| Long conversations | Token overflow | No limit |
| Contradiction handling | ❌ Keeps both | ✅ Resolved automatically |
| Cross-session memory | ❌ | ✅ |
| GDPR deletion | ❌ | ✅ Audit receipt |

**LangChain memory not working for your use case?** CLAIV is a drop-in replacement.

## Features

- Structured fact extraction (not just chat history)
- Cross-session memory — works across restarts
- Contradiction resolution built in
- Works with any LangChain LLM or agent
- GDPR-compliant deletion

## Quickstart

```bash
git clone https://github.com/Claiv-Memory/template-langchain
cd template-langchain
pip install -r requirements.txt
cp .env.example .env
python agent.py
```

## Environment variables

```
OPENAI_API_KEY=your_openai_key
CLAIV_API_KEY=your_claiv_key
```

Get a CLAIV API key at https://claiv.io.

## How it works

```python
from claiv import ClaivClient
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

claiv = ClaivClient(api_key=os.environ["CLAIV_API_KEY"])
llm   = ChatOpenAI(model="gpt-4o")

def chat(user_id, conversation_id, user_message):
    # Recall structured memory
    memory = claiv.recall({"user_id": user_id, "conversation_id": conversation_id, "query": user_message})

    response = llm.invoke([
        SystemMessage(content=f"User context:\n{memory['llm_context']['text']}"),
        HumanMessage(content=user_message),
    ])
    reply = response.content

    # Store both turns
    claiv.ingest({"user_id": user_id, "conversation_id": conversation_id, "type": "message", "role": "user", "content": user_message})
    claiv.ingest({"user_id": user_id, "conversation_id": conversation_id, "type": "message", "role": "assistant", "content": reply})

    return reply
```

## Related

- template-openai-python — without LangChain
- claiv-memory — full examples and SDK links

Keywords: langchain memory replacement, langchain persistent memory, langchain conversationbuffermemory alternative, langchain agent memory, langchain cross-session memory, llm memory langchain, rag memory langchain
