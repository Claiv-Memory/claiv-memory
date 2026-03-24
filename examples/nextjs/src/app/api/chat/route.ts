import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { ClaivClient } from '@claiv/memory';

const claiv = new ClaivClient({ apiKey: process.env.CLAIV_API_KEY! });

export async function POST(req: Request) {
  const { messages, userId, conversationId } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // 1. Recall — fetch everything Claiv knows about this user
  const memory = await claiv.recall({
    user_id: userId,
    conversation_id: conversationId,
    query: lastMessage,
  });

  const systemPrompt = memory.llm_context.text ||
    'You are a helpful assistant with persistent memory across sessions.';

  // 2. Stream response with memory as system prompt
  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages,
    onFinish: async ({ text }) => {
      // 3. Ingest — store this exchange for future sessions
      await Promise.all([
        claiv.ingest({ user_id: userId, conversation_id: conversationId,
          type: 'message', role: 'user', content: lastMessage }),
        claiv.ingest({ user_id: userId, conversation_id: conversationId,
          type: 'message', role: 'assistant', content: text }),
      ]);
    },
  });

  return result.toDataStreamResponse();
}
