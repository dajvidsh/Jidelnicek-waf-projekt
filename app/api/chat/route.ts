import Groq from "groq-sdk";
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Jsi profesionální český šéfkuchař a pomocník pro tvorbu receptů. Odpovídej vždy česky, stručně a jasně."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.1-8b-instant",
        });

        const replyText = chatCompletion.choices[0]?.message?.content || "Nevím, co na to říct.";

        return NextResponse.json({ reply: replyText });

    } catch (error) {
        console.error('Chyba AI (Groq):', error);
        return NextResponse.json(
            { error: 'Nepodařilo se vygenerovat odpověď z Groq API.' },
            { status: 500 }
        );
    }
}