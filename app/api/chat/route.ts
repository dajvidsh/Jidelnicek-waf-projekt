import Groq from "groq-sdk";
import {NextResponse} from 'next/server';

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

type FoodItem = { name: string; amount: number; unit: string };
type Message = { role: 'user' | 'ai'; content: string };

export async function POST(req: Request) {
    try {
        const {message, fridge, history} = await req.json() as {
            message: string;
            fridge?: FoodItem[];
            history?: Message[];
        };

        // Naformátujeme lednici do čitelného seznamu
        const fridgeList = fridge && fridge.length > 0
            ? fridge.map(f => `- ${f.name} (${f.amount} ${f.unit})`).join('\n')
            : 'Lednice je prázdná.';

        const systemPrompt = `You are a professional chef and a helper for creating recipes.

The user has these ingredients in their fridge:
${fridgeList}

RULES:
- Prefer ingredients the user already has in their fridge. If an important ingredient is missing, clearly mention it.
- Be concise and practical.
- Always answer in English.
- Format your responses in Markdown for better readability:
  * **bold** for recipe names and important info
  * ## headings for sections (Ingredients, Instructions, Tips)
  * numbered lists for cooking steps
  * bullet points for ingredient lists`;

// Systémový prompt pro AI, který obsahuje informace o lednici
        // Převedeme historii do formátu, který Groq očekává ('ai' -> 'assistant')
        const historyMessages = (history ?? []).map(m => ({
            role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
            content: m.content,
        }));

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {role: "system", content: systemPrompt},
                ...historyMessages,
                {role: "user", content: message},
            ],
            model: "llama-3.1-8b-instant",
        });

        const replyText = chatCompletion.choices[0]?.message?.content || "I dont know what to say.";

        return NextResponse.json({reply: replyText});

    } catch (error) {
        console.error('Chyba AI (Groq):', error);
        return NextResponse.json(
            {error: 'Nepodařilo se vygenerovat odpověď z Groq API.'},
            {status: 500}
        );
    }
}