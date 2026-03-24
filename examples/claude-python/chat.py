"""
Claiv Memory × Claude — persistent memory chatbot.

The AI remembers you across sessions using Claiv Memory and Anthropic Claude.
"""

import os
from dotenv import load_dotenv
from claiv import ClaivClient
import anthropic

load_dotenv()

claiv     = ClaivClient(api_key=os.environ["CLAIV_API_KEY"])
anthropic_client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

USER_ID         = "demo-user-001"
CONVERSATION_ID = "demo-conversation-001"


def chat(user_message: str) -> str:
    # 1. Recall — fetch everything Claiv knows about this user
    memory = claiv.recall({
        "user_id": USER_ID,
        "conversation_id": CONVERSATION_ID,
        "query": user_message,
    })

    system_prompt = memory["llm_context"]["text"] or "You are a helpful assistant."

    # 2. Call Claude with memory as the system prompt
    response = anthropic_client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    reply = response.content[0].text

    # 3. Ingest — store this turn so it's remembered next time
    claiv.ingest({
        "user_id": USER_ID,
        "conversation_id": CONVERSATION_ID,
        "type": "message",
        "role": "user",
        "content": user_message,
    })
    claiv.ingest({
        "user_id": USER_ID,
        "conversation_id": CONVERSATION_ID,
        "type": "message",
        "role": "assistant",
        "content": reply,
    })

    return reply


def main():
    print("Claiv Memory × Claude chatbot — press Ctrl+C to exit")
    print("(Memory persists across sessions)\n")

    while True:
        try:
            user_input = input("You: ").strip()
            if not user_input:
                continue
            reply = chat(user_input)
            print(f"Claude: {reply}\n")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break


if __name__ == "__main__":
    main()
