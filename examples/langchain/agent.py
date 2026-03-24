"""LangChain agent with CLAIV persistent memory."""
import os
from claiv import ClaivClient
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

claiv = ClaivClient(api_key=os.environ["CLAIV_API_KEY"])
llm   = ChatOpenAI(model="gpt-4o", api_key=os.environ["OPENAI_API_KEY"])

USER_ID = "user_123"
CONV_ID = "demo_conv"

def chat(user_message: str) -> str:
    # 1. Recall — get everything CLAIV knows about this user
    memory = claiv.recall({
        "user_id": USER_ID,
        "conversation_id": CONV_ID,
        "query": user_message,
    })

    system_text = memory["llm_context"]["text"] or "You are a helpful assistant."

    # 2. Call LangChain with memory injected
    response = llm.invoke([
        SystemMessage(content=f"You are a helpful assistant. User context:\n{system_text}"),
        HumanMessage(content=user_message),
    ])
    reply = response.content

    # 3. Ingest both turns
    claiv.ingest({"user_id": USER_ID, "conversation_id": CONV_ID,
                  "type": "message", "role": "user", "content": user_message})
    claiv.ingest({"user_id": USER_ID, "conversation_id": CONV_ID,
                  "type": "message", "role": "assistant", "content": reply})

    return reply


if __name__ == "__main__":
    print(chat("My name is Alex and I run a fitness business."))
    print(chat("What should I focus on this quarter?"))
