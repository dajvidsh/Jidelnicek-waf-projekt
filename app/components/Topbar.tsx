"use client";
import React, {useState} from 'react';
import Link from "next/link";

function Topbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-100 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center shrink-0">
                        <span className="font-bold text-2xl"><Link href={'/'}>Jidelnicek</Link></span>
                    </div>

                    <div className="flex items-center sm:hidden">
                        <button
                            className="p-2 text-gray-400 focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span className="material-icons">
                                {menuOpen ? 'X' : '|||'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-[70%] bg-white border-r border-gray-100 z-40 transform transition-transform duration-300 ease-in-out sm:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <ul className="py-4">
                    <li>
                        <Link href="/"
                           onClick={() => setMenuOpen(false)}
                           className="block px-6 py-3 text-gray-500 hover:text-black transition-colors tracking-wide">Home</Link>
                    </li>
                    <li>
                        <Link href="/fridge"
                              onClick={() => setMenuOpen(false)}
                              className="block px-6 py-3 text-gray-500 hover:text-black transition-colors tracking-wide">Fridge</Link>
                    </li>
                    <li>
                        <Link href="/recipes"
                           onClick={() => setMenuOpen(false)}
                           className="block px-6 py-3 text-gray-500 hover:text-black transition-colors tracking-wide">Recipes</Link>
                    </li>
                    <li>
                        <Link href="/shoppingList"
                           onClick={() => setMenuOpen(false)}
                           className="block px-6 py-3 text-gray-500 hover:text-black transition-colors tracking-wide">Shopping
                            list</Link>
                    </li>
                    <li>
                        <Link href="/"
                           onClick={() => setMenuOpen(false)}
                           className="block px-6 py-3 text-gray-500 hover:text-black transition-colors tracking-wide">Profile</Link>
                    </li>
                </ul>
            </div>

            {menuOpen && (
                <div
                    className="fixed top-16 inset-0 z-30 sm:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </nav>
    );
}

export default Topbar;