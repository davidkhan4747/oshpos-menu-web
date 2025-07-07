"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/lib/cart-context";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export function Header() {
  const { items } = useCart();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-40 transition-all duration-300",
      scrolled 
        ? "bg-background shadow-md py-2" 
        : "bg-primary py-4"
    )}>
      <div className="container flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center gap-2 group">
            <div className={cn(
              "rounded-full p-1 group-hover:scale-110 transition-transform relative w-8 h-8 overflow-hidden",
              scrolled ? "bg-[#fdd7d6]" : "bg-[#fdd7d6]"
            )}>
              <Image 
                src="/LogoFast Icon (1).svg" 
                alt="OshPos Logo" 
                fill 
                className="object-contain p-0.5" 
              />
            </div>
            <span className={cn(
              "text-xl font-bold",
              scrolled ? "text-primary" : "text-white"
            )}>OshPos</span>
          </Link>

          <nav className="hidden md:flex gap-1">
            {[
              { href: "/", label: "Главная" },
              { href: "/menu", label: "Меню" },
              { href: "/cart", label: "Корзина" },
              { href: "/orders", label: "Мои заказы" },
            ].map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={cn(
                  "px-4 py-2 rounded-full transition-colors font-medium",
                  scrolled 
                    ? "hover:bg-accent/50 text-foreground" 
                    : "hover:bg-white/20 text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/cart">
            <Button 
              variant={scrolled ? "outline" : "secondary"}
              size="icon" 
              className="relative rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1 bg-highlight text-white rounded-full animate-pulse">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant={scrolled ? "outline" : "secondary"}
                size="icon"
                className="rounded-full transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-64 border-l-primary/20">
              <div className="flex flex-col gap-2 mt-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-[#fdd7d6] rounded-full p-1 relative w-8 h-8 overflow-hidden">
                    <Image 
                      src="/LogoFast Icon (1).svg" 
                      alt="OshPos Logo" 
                      fill 
                      className="object-contain p-0.5" 
                    />
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-highlight">OshPos</span>
                </div>
                
                {[
                  { href: "/", label: "Главная" },
                  { href: "/menu", label: "Меню" },
                  { href: "/cart", label: "Корзина" },
                  { href: "/orders", label: "Мои заказы" },
                ].map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors font-medium flex items-center"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
