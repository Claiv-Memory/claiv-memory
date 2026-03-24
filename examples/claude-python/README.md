# Claude AI Chatbot with Persistent Memory (Python + CLAIV)

> Add long-term memory to Anthropic Claude in Python.
> Claude 3.5 Sonnet / Claude 3 Opus + CLAIV persistent memory.

This template shows how to add **persistent memory to a Claude chatbot** — so your AI remembers users across sessions without prompt stuffing or vector database setup.

## Features

- Persistent user memory across conversations
- Works with Claude 3.5 Sonnet, Claude 3 Opus, any Anthropic model
- No vector database to manage
- Automatic contradiction handling
- GDPR-compliant deletion

## Why not just use Claude's context window?

Claude's context window is large but not infinite. Stuffing conversation history:
- Wastes tokens on irrelevant context
- Has no contradiction resolution
- Breaks across sessions
- Gets expensive fast

CLAIV extracts structured facts and injects only what is relevant.

## Why not just use LangChain memory?

LangChain memory stores raw chat history. CLAIV stores structured facts that work across sessions and handle contradictions automatically.

## Quickstart

```bash
git clone https://github.com/Claiv-Memory/template-claude-python
cd template-claude-python
pip install -r requirements.txt
cp .env.example .env
python chat.py
```

## Environment variables

```
ANTHROPIC_API_KEY=your_anthropic_key
CLAIV_API_KEY=your_claiv_key
```

Get a CLAIV API key at https://claiv.io.

## How it works

```python
from claiv import ClaivClient
import anthropic

claiv  = ClaivClient(api_key=os.environ["CLAIV_API_KEY"])
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def chat(user_id, conversation_id, user_message):
    memory = claiv.recall({"user_id": user_id, "conversation_id": conversation_id, "query": user_message})

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=f"You are a helpful assistant. User context:\n{memory['llm_context']['text']}",
        messages=[{"role": "user", "content": user_message}],
    )
    reply = response.content[0].text

    claiv.ingest({"user_id": user_id, "conversation_id": conversation_id, "type": "message", "role": "user", "content": user_message})
    claiv.ingest({"user_id": user_id, "conversation_id": conversation_id, "type": "message", "role": "assistant", "content": reply})

    return reply
```

## Related

- template-openai-python — OpenAI version
- template-langchain — LangChain version
- claiv-memory — full examples and SDK links

Keywords: claude chatbot memory, anthropic claude memory, claude persistent memory, claude context across sessions, ai memory claude, llm memory python
