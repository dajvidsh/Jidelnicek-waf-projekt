import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

interface MessagePart {
    type: string;
    text?: string;
}

interface IncomingMessage {
    role: 'user' | 'assistant' | 'system';
    content?: string;
    parts?: MessagePart[];
}

export async function POST(req: Request) {
    const { messages } = await req.json();

    const formattedMessages = messages.map((m: IncomingMessage) => {
        let textContent = m.content;
        if (m.parts) {
            textContent = m.parts.map((part: MessagePart) => part.text).join('');
        }

        return {
            role: m.role,
            content: textContent || ''
        };
    });

    const result = await streamText({
        model: google('gemini-2.0-flash'),
        system: `You are a professional chef and nutritional consultant. 
Your job is to help users with cooking, come up with recipes and create menus. 
Answer in a friendly, concise manner, in Czech and in a clear text format using bullet points.`,

        messages: formattedMessages,
    });

    return result.toTextStreamResponse();
}