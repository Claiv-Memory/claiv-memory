# Document RAG with Persistent Memory (Python + CLAIV)

> Upload documents. Ask questions. Your AI answers from the right section every time.
> No vector database to manage. No RAG pipeline to build.

This template shows how to build a **document question-answering system with persistent memory** — upload PDFs, markdown files, or any text, and your AI retrieves and answers from them automatically.

## Features

- Upload documents — parsed into sections and indexed immediately
- Ask questions — CLAIV retrieves the most relevant sections automatically
- No Pinecone, Weaviate, or Chroma to manage
- Combine document memory with user conversation memory
- Delete documents cleanly when no longer needed

## Why not just use a vector database?

Vector databases give you similarity search. CLAIV gives you:
- Structured section-aware retrieval (not just top-k chunks)
- Automatic routing: span similarity, section retrieval, full document, or collection
- Document memory combined with conversation memory in one recall call
- No infrastructure to manage

## Why not just stuff the document into the prompt?

Documents are often too large for context windows. Stuffing is expensive and unreliable. CLAIV retrieves only what is relevant to the current query.

## Quickstart

```bash
git clone https://github.com/Claiv-Memory/template-document-rag-python
cd template-document-rag-python
pip install -r requirements.txt
cp .env.example .env
python rag.py
```

## Environment variables

```
CLAIV_API_KEY=your_claiv_key
OPENAI_API_KEY=your_openai_key
```

Get a CLAIV API key at https://claiv.io.

## How it works

```python
from claiv import ClaivClient

claiv = ClaivClient(api_key=os.environ["CLAIV_API_KEY"])

# Upload document — indexed immediately
doc = claiv.upload_document({
    "user_id": "user_123",
    "project_id": "my-project",
    "document_name": "Product Manual",
    "content": open("manual.md").read(),
})
print(f"Indexed {doc['spans_created']} spans across {len(doc['sections'])} sections")

# Ask a question — CLAIV routes to the right section automatically
memory = claiv.recall({
    "user_id": "user_123",
    "conversation_id": "chat_abc",
    "query": "How do I install the product?",
    "document_id": doc["document_id"],
})

# Inject into your LLM prompt
system_prompt = f"Answer based on this context:\n{memory['llm_context']['text']}"
```

## Use cases

- Knowledge copilots over internal documentation
- Compliance and research tools
- Support assistants that reason over manuals
- Due diligence platforms
- Any app combining conversation memory with document context

## Related

- template-document-rag-nextjs — Next.js version with drag-and-drop upload UI
- template-openai-python — conversation memory without documents
- claiv-memory — full examples and SDK links

Keywords: document rag python, python document question answering, rag without vector database, document memory python, pdf question answering python, llm document retrieval, ai document search python
