'use client';

import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 서비스명 */}
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-xl font-bold text-foreground hidden sm:block">
              Ecommerce AI Agent
            </h1>
            <h1 className="text-lg font-bold text-foreground sm:hidden">
              AI Agent
            </h1>
          </div>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              주문
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              배송
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              상품
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              고객지원
            </a>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-border pt-4">
            <a
              href="#"
              className="block px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              주문
            </a>
            <a
              href="#"
              className="block px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              배송
            </a>
            <a
              href="#"
              className="block px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              상품
            </a>
            <a
              href="#"
              className="block px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              고객지원
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
