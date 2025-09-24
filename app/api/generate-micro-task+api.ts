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

    const prompt = `You are an AI assistant inside an anti-procrastination app.
The user will tell you what they are currently procrastinating on or describe their current situation.
Your task is to respond with ONE single short, concrete action the user can do in the next 2–3 minutes.
This action should be the smallest possible step that helps them start moving toward the bigger task.
Always include the context of the user's input in the action, so the user feels it is personally tailored.

Guidelines:
- The action must be specific and observable (clear finish line).
- Prefer physical or clearly measurable actions over vague thinking.
- If possible, make the action an activity (e.g. "put on your running shoes" instead of "think about running").
- Keep the response short and direct, like an instruction.
- Do not generate more than one step. Only the smallest next step.

Examples:
User: "I'm lying on the couch and I don't feel like going to the gym."
AI: "Stand up from the couch and pack your gym bag."

User: "I'm scrolling on social media but I should be writing my English essay."
AI: "Put your phone away and write one sentence of your essay."

User: "My desk is a mess and I keep avoiding cleaning it."
AI: "Pick up just one item from your desk and put it where it belongs."

User input: "${procrastinationText}"
Respond with just the micro-task text, nothing else.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 100,
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