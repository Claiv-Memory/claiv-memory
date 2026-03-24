/**
 * Claiv Memory × OpenAI — persistent memory chatbot (Node.js)
 *
 * The AI remembers you across sessions. Close it, come back tomorrow,
 * it picks up where you left off.
 */

import 'dotenv/config';
import * as readline from 'readline';
import { ClaivClient } from '@claiv/memory';
import OpenAI from 'openai';

const claiv  = new ClaivClient({ apiKey: process.env.CLAIV_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Fixed IDs so memory persists across runs.
// In a real app these come from your auth system.
const USER_ID         = 'demo-user-001';
const CONVERSATION_ID = 'demo-conversation-001';

async function chat(userMessage) {
  // 1. Recall — fetch everything Claiv knows about this user
  const memory = await claiv.recall({
    user_id: USER_ID,
    conversation_id: CONVERSATION_ID,
    query: userMessage,
  });

  const systemPrompt = memory.llm_context.text || 'You are a helpful assistant.';

  // 2. Call OpenAI with memory as the system prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage },
    ],
  });

  const reply = response.choices[0].message.content;

  // 3. Ingest — store this turn so it's remembered next time
  await claiv.ingest({ user_id: USER_ID, conversation_id: CONVERSATION_ID,
    type: 'message', role: 'user', content: userMessage });
  await claiv.ingest({ user_id: USER_ID, conversation_id: CONVERSATION_ID,
    type: 'message', role: 'assistant', content: reply });

  return reply;
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('Claiv Memory chatbot — press Ctrl+C to exit');
console.log('(Memory persists across sessions)\n');

function prompt() {
  rl.question('You: ', async (input) => {
    const userMessage = input.trim();
    if (!userMessage) { prompt(); return; }

    try {
      const reply = await chat(userMessage);
      console.log(`AI:  ${reply}\n`);
    } catch (err) {
      console.error('Error:', err.message);
    }
    prompt();
  });
}

prompt();
