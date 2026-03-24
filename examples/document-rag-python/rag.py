"""
Claiv Memory — Document RAG chatbot.

Upload a document then ask questions about it. Claiv automatically
picks the right retrieval strategy based on your question.
"""

import os
import sys
import argparse
from pathlib import Path
from dotenv import load_dotenv
from claiv import ClaivClient
from openai import OpenAI

load_dotenv()

claiv  = ClaivClient(api_key=os.environ["CLAIV_API_KEY"])
openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

USER_ID         = "demo-user-001"
PROJECT_ID      = "demo-project-001"
CONVERSATION_ID = "demo-rag-conversation"


def upload_document(file_path: str) -> str:
    """Upload a document to Claiv and return its document_id."""
    path = Path(file_path)
    if not path.exists():
        print(f"File not found: {file_path}")
        sys.exit(1)

    content = path.read_text(encoding="utf-8")
    print(f"Uploading '{path.name}' ({len(content):,} chars)...")

    result = claiv.upload_document({
        "user_id": USER_ID,
        "project_id": PROJECT_ID,
        "document_name": path.name,
        "content": content,
    })

    doc_id = result["document_id"]
    print(f"Uploaded: {result['spans_created']} spans, {len(result['sections'])} sections")
    print(f"Document ID: {doc_id}")
    print(f"Status: {result['status']} (distillations completing in background)\n")
    return doc_id


def chat(user_message: str, document_id: str) -> str:
    """Ask a question about the document."""
    # Recall — Claiv picks the right retrieval strategy automatically
    memory = claiv.recall({
        "user_id": USER_ID,
        "conversation_id": CONVERSATION_ID,
        "query": user_message,
        "document_id": document_id,
    })

    system_prompt = memory["llm_context"]["text"] or "You are a helpful assistant."

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_message},
        ],
    )
    reply = response.choices[0].message.content

    # Store this exchange
    claiv.ingest({
        "user_id": USER_ID, "conversation_id": CONVERSATION_ID,
        "type": "message", "role": "user", "content": user_message,
    })
    claiv.ingest({
        "user_id": USER_ID, "conversation_id": CONVERSATION_ID,
        "type": "message", "role": "assistant", "content": reply,
    })

    return reply


def main():
    parser = argparse.ArgumentParser(description="Claiv Document RAG chatbot")
    parser.add_argument("--upload", metavar="FILE", help="Upload a document and start chatting")
    parser.add_argument("--document-id", metavar="ID", help="Chat with an existing document")
    args = parser.parse_args()

    if args.upload:
        document_id = upload_document(args.upload)
    elif args.document_id:
        document_id = args.document_id
        print(f"Using document: {document_id}\n")
    else:
        parser.print_help()
        sys.exit(1)

    print("Ask questions about your document — press Ctrl+C to exit")
    print("Try: 'summarise this document' or 'show me the [section name] section'\n")

    while True:
        try:
            user_input = input("You: ").strip()
            if not user_input:
                continue
            reply = chat(user_input, document_id)
            print(f"AI:  {reply}\n")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break


if __name__ == "__main__":
    main()
