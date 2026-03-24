import OpenAI from 'openai';
import { ClaivClient } from '@claiv/memory';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const claiv  = new ClaivClient({ apiKey: process.env.CLAIV_API_KEY });

const USER_ID = 'user_123';
const CONV_ID = 'demo_conv';

async function chat(userMessage) {
  // 1. Recall memory before responding
  const memory = await claiv.recall({
    user_id: USER_ID,
    conversation_id: CONV_ID,
    query: userMessage,
  });

  // 2. Call OpenAI with memory injected
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: memory.llm_context.text
          ? `You are a helpful assistant. User context:\n${memory.llm_context.text}`
          : 'You are a helpful assistant.',
      },
      { role: 'user', content: userMessage },
    ],
  });

  const reply = response.choices[0].message.content;

  // 3. Ingest both turns so they're remembered next time
  await claiv.ingest({ user_id: USER_ID, conversation_id: CONV_ID, type: 'message', role: 'user', content: userMessage });
  await claiv.ingest({ user_id: USER_ID, conversation_id: CONV_ID, type: 'message', role: 'assistant', content: reply });

  return reply;
}

// Demo
const reply = await chat("My name is Alex and I run a fitness business.");
console.log('AI:', reply);

const reply2 = await chat("What should I focus on this quarter?");
console.log('AI:', reply2);
