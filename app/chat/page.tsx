'use client';

import { useState } from 'react';

type Message = {
    role: 'user' | 'ai';
    content: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                body: JSON.stringify({ message: input }),
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
        <div className="max-w-2xl mx-auto p-4 flex flex-col h-screen font-sans">
            <h1 className="text-2xl font-bold mb-4 text-center">Generátor Receptů 🍳</h1>

            {/* Výpis zpráv */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4 space-y-4">
                {messages.length === 0 && (
                    <p className="text-gray-400 text-center mt-10">Zatím tu nic není. Napište, z čeho chcete vařit!</p>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg max-w-[80%] ${
                            msg.role === 'user'
                                ? 'bg-blue-500 text-white ml-auto' // Zpráva uživatele (vpravo, modrá)
                                : 'bg-white text-black border border-gray-200 mr-auto' // Zpráva AI (vlevo, bílá)
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="bg-white text-gray-500 border border-gray-200 p-3 rounded-lg w-fit">
                        AI přemýšlí...
                    </div>
                )}
            </div>

            {/* Formulář pro odeslání */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Např. mám kuře, mrkev a rýži..."
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-blue-300 transition-colors"
                >
                    Odeslat
                </button>
            </form>
        </div>
    );
}