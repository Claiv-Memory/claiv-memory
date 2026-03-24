# OpenAI Chatbot with Persistent Memory (Python + CLAIV)

> Add long-term memory to any OpenAI chatbot in Python.
> Works with GPT-4o, GPT-4.1, and any OpenAI model.

This template shows how to add **persistent memory to a Python OpenAI chatbot** — so your AI remembers users across sessions without prompt stuffing or vector database setup.

## Features

- Persistent user memory across conversations
- Works with GPT-4o, GPT-4.1, any OpenAI model
- No vector database to manage
- Async client included
- GDPR-compliant deletion

## Why not just stuff chat history into the prompt?

Chat history gets truncated, wastes tokens, has no contradiction resolution, and breaks across sessions. CLAIV extracts structured facts and injects only what is relevant within your token budget.

## Why not just use LangChain memory?

LangChain ConversationBufferMemory stores raw chat history. CLAIV stores structured facts that work across sessions and handle contradictions automatically.

## Quickstart

```bash
git clone https://github.com/Claiv-Memory/template-openai-python
cd template-openai-python
pip install -r requirements.txt
cp .env.example .env
python chat.py
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
from openai import OpenAI

claiv  = ClaivClient(api_key=os.environ["CLAIV_API_KEY"])
openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

def chat(user_id, conversation_id, user_message):
    memory = claiv.recall({"user_id": user_id, "conversation_id": conversation_id, "query": user_message})

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"User context:\n{memory['llm_context']['text']}"},
            {"role": "user", "content": user_message},
        ],
    )
    reply = response.choices[0].message.content

    claiv.ingest({"user_id": user_id, "conversation_id": conversation_id, "type": "message", "role": "user", "content": user_message})
    claiv.ingest({"user_id": user_id, "conversation_id": conversation_id, "type": "message", "role": "assistant", "content": reply})

    return reply
```

## Related

- template-openai-nodejs — Node.js version
- template-langchain — LangChain version
- claiv-memory — full examples and SDK links

Keywords: openai chatbot memory python, python llm memory, openai persistent memory python, chatbot long-term memory python, ai memory python, langchain alternative python
