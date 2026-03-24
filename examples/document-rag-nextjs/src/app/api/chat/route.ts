import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { ClaivClient } from '@claiv/memory';

const claiv = new ClaivClient({ apiKey: process.env.CLAIV_API_KEY! });

export async function POST(req: Request) {
  const { messages, userId, conversationId, projectId } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // Recall with document strategy — Claiv searches across uploaded documents
  const memory = await claiv.recall({
    user_id: userId,
    conversation_id: conversationId,
    project_id: projectId,
    query: lastMessage,
  });

  const systemPrompt =
    memory.llm_context.text ||
    'You are a helpful assistant. Answer questions based on the documents the user has uploaded.';

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages,
    onFinish: async ({ text }) => {
      await Promise.all([
        claiv.ingest({
          user_id: userId,
          conversation_id: conversationId,
          type: 'message',
          role: 'user',
          content: lastMessage,
        }),
        claiv.ingest({
          user_id: userId,
          conversation_id: conversationId,
          type: 'message',
          role: 'assistant',
          content: text,
        }),
      ]);
    },
  });

  return result.toDataStreamResponse();
}
