"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Solutions", href: "#solutions" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Impact", href: "#impact" },
  { label: "FAQ", href: "#faq" }
];

const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#hero" className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/10 text-lg font-heading font-semibold text-primary-600 shadow-glow">
            D
          </span>
          <span className="text-lg font-heading font-semibold tracking-tight text-slate-900">
            Descuentia
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-primary-600">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="https://apps.apple.com"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
          >
            Download
          </Link>
          <Link
            href="https://descuentia.eu/contact"
            className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-500"
          >
            Talk to sales
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-primary-400 hover:text-primary-500 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-base font-medium text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-primary-600"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="https://apps.apple.com"
              className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-primary-500 hover:text-primary-600"
              onClick={() => setOpen(false)}
            >
              Download
            </Link>
            <Link
              href="https://descuentia.eu/contact"
              className="rounded-full bg-primary-600 px-5 py-2 text-center text-sm font-semibold text-white shadow-glow transition hover:bg-primary-500"
              onClick={() => setOpen(false)}
            >
              Talk to sales
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navigation;
