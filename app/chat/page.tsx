"use client";

import { useChat } from '@ai-sdk/react';
import { useState } from 'react'; // Přidali jsme klasický React state
import PageHeader from "@/app/components/Pageheader"; // Cestu si případně uprav
import { Button } from "@/components/ui/button";

export default function ChatPage() {

    const { messages, status, sendMessage } = useChat();

    const [input, setInput] = useState('');

    const isLoading = status === 'submitted' || status === 'streaming';

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;

        sendMessage({ text: input });
        setInput('');
    };

    return (
        <div>
            <PageHeader title={"AI Kuchař"} />

            <div className="max-w-3xl mx-auto p-6 flex flex-col h-[75vh]">

                <div className="flex-1 overflow-y-auto mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-4 shadow-inner">
                    {messages.length === 0 && (
                        <div className="text-center text-slate-500 mt-10">
                            <span className="text-4xl mb-4 block">👨‍🍳</span>
                            <p>Ahoj! Jsem tvůj AI kuchař. Zeptej se mě na jakýkoliv recept,<br/> nebo mi řekni, co máš v lednici!</p>
                        </div>
                    )}

                    {messages.map(m => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 ${
                                m.role === 'user'
                                    ? 'bg-[#4A4870] text-white rounded-br-sm'
                                    : 'bg-white border border-slate-200 shadow-sm rounded-bl-sm text-slate-800'
                            }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {m.parts.map((part, index) => (
                                        <span key={index}>{part.type === 'text' ? part.text : null}</span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-bl-sm p-4 text-slate-400 animate-pulse">
                                Kuchař přemýšlí...
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleFormSubmit} className="flex gap-3">
                    <input
                        className="flex-1 border border-slate-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#4A4870] transition-shadow"
                        value={input}
                        placeholder="Zeptej se na recept..."
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        size="xl"
                        className="bg-[#4A4870] hover:bg-[#3a3858]"
                    >
                        Odeslat
                    </Button>
                </form>
            </div>
        </div>
    );
}