"""
Claiv Memory × OpenAI — persistent memory chatbot.

The AI remembers you across sessions. Close it, come back tomorrow,
it picks up where you left off.
"""

import os
import uuid
from dotenv import load_dotenv
from claiv import ClaivClient
from openai import OpenAI

load_dotenv()

claiv  = ClaivClient(api_key=os.environ["CLAIV_API_KEY"])
openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

# In a real app these would come from your auth system.
# Using fixed IDs here so memory persists across runs.
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

    # 2. Call OpenAI with memory as the system prompt
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_message},
        ],
    )
    reply = response.choices[0].message.content

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
    print("Claiv Memory chatbot — press Ctrl+C to exit")
    print("(Memory persists across sessions — try closing and reopening)\n")

    while True:
        try:
            user_input = input("You: ").strip()
            if not user_input:
                continue
            reply = chat(user_input)
            print(f"AI:  {reply}\n")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break


if __name__ == "__main__":
    main()
