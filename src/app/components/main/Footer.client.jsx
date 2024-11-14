// src/app/components/main/Footer.client.jsx
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="animate-slide-in-left w-full bg-background">
      <div className="border-t border-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-secondary hover:text-primary transition-fast"
              >
                Home
              </Link>
              <span className="text-tertiary">|</span>
              <Link 
                href="/about" 
                className="text-secondary hover:text-primary transition-fast"
              >
                About
              </Link>
            </div>

            {/* Center - Playground Links */}
            <div className="flex items-center space-x-6">
              <Link 
                href="/playground" 
                className="text-secondary hover:text-primary"
              >
                Playground A
              </Link>
              <Link 
                href="/playground/playground-b" 
                className="text-secondary hover:text-primary "
              >
                Playground B
              </Link>
            </div>

            {/* Right Side */}
            <div
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-fast focus-highlight">
              <a>
                Powered by Next.js
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}