'use client';

import { useState, useRef, useEffect } from 'react';
import { useFridge } from '@/hooks/useFridge';
import { useAuth } from '@/app/context/AuthContext';
import ReactMarkdown from 'react-markdown';
import { ChefHat, User, Send, Sparkles } from 'lucide-react';
import PageHeader from '@/app/components/Pageheader';

type Message = {
    role: 'user' | 'ai';
    content: string;
};

const SUGGESTIONS = [
    "Something tasty to cook?",
    "Suggest me quick dinner.",
    "Something healthy, done in 30 minutes.",
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    const { foods } = useFridge();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    if (!user) return null;

    // Funkce, která se spustí po odeslání formuláře
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Zabrání znovunačtení stránky
        if (!input.trim()) return;

        // 1. Přidáme uživatelskou zprávu do chatu
        const newMessages = [...messages, { role: 'user', content: input } as Message];
        setMessages(newMessages);
        setInput(''); // Vymažeme textové pole
        setIsLoading(true);

        try {
            // 2. Pošleme dotaz na naše API (route.ts)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, fridge: foods, history: messages, }),
            });

            const data = await response.json();

            if (response.ok) {
                // 3. Přidáme odpověď AI do chatu
                setMessages([...newMessages, { role: 'ai', content: data.reply }]);
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Chyba při komunikaci se serverem.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageHeader title="AI Chef" />

            <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-220px)]">

                {/* Výpis zpráv */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-1">

                    {/* Welcome screen */}
                    {messages.length === 0 && (
                        <div className="bg-white border border-slate-100 rounded-[20px] p-6">
                            <div className="flex items-start gap-3 mb-5">
                                <div className="p-2.5 bg-primary/10 rounded-full shrink-0">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900 text-lg">Hi!</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        I am your personal AI chef. I will help you cook from ingredients you have at home.
                                    </p>
                                </div>
                            </div>

                            {foods.length > 0 ? (
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-3">
                                        In fridge you have {foods.length} {foods.length === 1 ? 'ingredient' : foods.length < 5 ? 'ingredients' : 'ingredients'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {foods.map(f => (
                                            <span
                                                key={f.id}
                                                className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-medium text-slate-700"
                                            >
                                                {f.name} <span className="text-slate-400">· {f.amount} {f.unit}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                    <p className="text-sm text-amber-800">
                                        Fridge is empty. Add ingredients to your <strong>Fridge</strong>, so I can help you better!
                                    </p>
                                </div>
                            )}

                            <div className="mt-5 pt-5 border-t border-slate-100">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-3">
                                    Try to ask me:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTIONS.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setInput(s)}
                                            className="px-3 py-1.5 text-xs border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Zprávy */}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                                msg.role === 'user'
                                    ? 'bg-primary text-white'
                                    : 'bg-white border border-slate-200 text-primary'
                            }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <ChefHat className="w-4 h-4" />}
                            </div>

                            {/* Bublina */}
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                                msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-sm'
                                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                            }`}>
                                {msg.role === 'user' ? (
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                ) : (
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ children }) => <h1 className="text-base font-bold text-slate-900 mt-2 mb-1.5 first:mt-0">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-base font-bold text-slate-900 mt-3 mb-1.5 first:mt-0">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-sm font-bold text-slate-900 mt-2.5 mb-1 first:mt-0">{children}</h3>,
                                            p: ({ children }) => <p className="text-sm leading-relaxed my-1.5 first:mt-0 last:mb-0">{children}</p>,
                                            ul: ({ children }) => <ul className="list-disc list-outside ml-4 space-y-1 my-2 text-sm">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal list-outside ml-4 space-y-1 my-2 text-sm">{children}</ol>,
                                            li: ({ children }) => <li className="pl-1">{children}</li>,
                                            strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
                                            em: ({ children }) => <em className="italic">{children}</em>,
                                            code: ({ children }) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                                            hr: () => <hr className="my-3 border-slate-100" />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading indikátor */}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="shrink-0 w-9 h-9 rounded-full bg-white border border-slate-200 text-primary flex items-center justify-center">
                                <ChefHat className="w-4 h-4" />
                            </div>
                            <div className="bg-white border border-slate-100 px-4 py-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Formulář */}
                <form onSubmit={handleSubmit} className="flex gap-2 pt-4 mt-2 border-t border-slate-100">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for recipe..."
                        className="flex-1 border border-slate-200 rounded-full px-5 py-3 bg-white focus:outline-none focus:border-primary text-sm transition-colors"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors shrink-0 w-12 h-12 flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>);
}