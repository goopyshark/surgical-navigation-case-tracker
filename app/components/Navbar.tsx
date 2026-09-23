"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-950 text-white">
      <div className="px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="bg-cyan-500 rounded-xl w-10 h-10 flex items-center justify-center font-bold">
            +
          </div>
          <span className="text-2xl font-bold">SNCT</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a
            href="/"
            className="hover:text-cyan-400 transition-colors"
          >
            Dashboard
          </a>

          <a
            href="/cases"
            className="hover:text-cyan-400 transition-colors"
          >
            Cases
          </a>

          <a
            href="/add-case"
            className="hover:text-cyan-400 transition-colors"
          >
            Add Case
          </a>

          <a
            href="/about"
            className="hover:text-cyan-400 transition-colors"
          >
            About
          </a>

          <span className="text-slate-400">Logout</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden border border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-800"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <span className="text-xl">✕</span>
          ) : (
            <span className="text-xl">☰</span>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 px-6 py-4">
          <div className="flex flex-col gap-2">
            <a
              href="/"
              className="px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-cyan-400"
            >
              Dashboard
            </a>

            <a
              href="/cases"
              className="px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-cyan-400"
            >
              Cases
            </a>

            <a
              href="/add-case"
              className="px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-cyan-400"
            >
              Add Case
            </a>

            <a
              href="/about"
              className="px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-cyan-400"
            >
              About
            </a>

            <div className="px-4 py-3 text-slate-500">
              Logout
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}