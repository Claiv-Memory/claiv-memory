// app/api/chat/route.ts — Next.js AI chat with CLAIV persistent memory
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { ClaivClient } from '@claiv/memory';

const claiv = new ClaivClient({ apiKey: process.env.CLAIV_API_KEY! });

export async function POST(req: Request) {
  const { messages, userId, conversationId } = await req.json();
  const userMessage = messages.at(-1)?.content ?? '';

  // 1. Recall memory before responding
  const memory = await claiv.recall({
    user_id: userId,
    conversation_id: conversationId,
    query: userMessage,
  });

  const systemPrompt = memory.llm_context.text
    ? `You are a helpful assistant. User context:\n${memory.llm_context.text}`
    : 'You are a helpful assistant.';

  // 2. Stream response
  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
    async onFinish({ text }) {
      // 3. Ingest both turns after response completes
      await claiv.ingest({ user_id: userId, conversation_id: conversationId,
        type: 'message', role: 'user', content: userMessage });
      await claiv.ingest({ user_id: userId, conversation_id: conversationId,
        type: 'message', role: 'assistant', content: text });
    },
  });

  return result.toDataStreamResponse();
}
