"use client";
import React, {useState} from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {signOut} from "firebase/auth";
import {auth} from "@/lib/firebase";
import { LogOut, Menu, X } from "lucide-react";

const NAV_ITEMS = [
    { href: "/home", label: "Home" },
    { href: "/fridge", label: "Fridge" },
    { href: "/recipes", label: "Recipes" },
    { href: "/shoppingList", label: "Shopping list" },
    { href: "/profile", label: "Profile" },
    { href: "/chat", label: "AI Chef" },
];

const LINK_CLASSES = "block px-6 py-3 text-gray-500 hover:text-black transition-colors tracking-wide";


function Topbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const pathname = usePathname();

    // 2. Elegantnější zápis kontroly stránek pomocí pole a metody .includes()
    if (['/login', '/register', '/'].includes(pathname)) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error while logout:", error);
        }
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="bg-white border-b border-gray-100 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center shrink-0">
                        <span className="font-bold text-2xl"><Link href={'/home'}>Jidelnicek</Link></span>
                    </div>

                    <div className="flex items-center sm:hidden">
                        <button
                            className="p-2 text-gray-400 focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-[70%] bg-white border-r border-gray-100 z-40 transform transition-transform duration-300 ease-in-out sm:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <ul className="py-4">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={closeMenu}
                                className={LINK_CLASSES}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-red-600 transition-colors tracking-wide"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Log out</span>
                        </button>
                    </li>
                </ul>
            </div>

            {menuOpen && (
                <div className="fixed top-16 inset-0 z-30 sm:hidden" onClick={closeMenu} />
            )}
        </nav>
    );
}

export default Topbar;