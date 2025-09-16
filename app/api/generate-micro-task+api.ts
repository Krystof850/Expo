import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    const { procrastinationText } = await request.json();

    if (!procrastinationText || typeof procrastinationText !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid procrastination text' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Based on what the user is procrastinating with: "${procrastinationText}"

Generate a very simple, specific micro-task that takes only 2-3 minutes to complete and gets them started. The task should be:
- Extremely small and easy to do
- The very first step to break the procrastination cycle
- Specific and actionable
- Something that builds momentum

Examples:
- If procrastinating "cleaning room" → "Pick up 5 items and put them away"
- If procrastinating "studying" → "Open your textbook and read just one paragraph"
- If procrastinating "exercising" → "Put on your workout clothes"

Respond with just the micro-task text, nothing else. Keep it under 60 characters if possible.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
      temperature: 0.7,
    });

    const task = response.choices[0].message.content?.trim();

    if (!task) {
      throw new Error("No task generated");
    }

    return new Response(JSON.stringify({ task }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to generate task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}