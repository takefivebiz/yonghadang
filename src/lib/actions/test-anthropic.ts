'use server';

import { Anthropic } from '@anthropic-ai/sdk';

export const testAnthropicAPI = async () => {
  console.log('[Server Action] Testing Anthropic API');
  console.log('[Server Action] ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY?.slice(0, 20) + '...');

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: '안녕하세요. 간단하게 인사해주세요.',
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  return {
    success: true,
    message: content.text,
    model: message.model,
    usage: message.usage,
  };
};
