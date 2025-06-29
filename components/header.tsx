"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/lib/cart-context";
import { Badge } from "./ui/badge";

export function Header() {
  const { items } = useCart();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold text-orange-500">OshPos</span>
          </Link>

          <nav className="hidden md:flex space-x-6 text-sm">
            <Link href="/" className="transition hover:text-orange-500">
              Главная
            </Link>
            <Link href="/menu" className="transition hover:text-orange-500">
              Меню
            </Link>
            <Link href="/cart" className="transition hover:text-orange-500">
              Корзина
            </Link>
            <Link href="/orders" className="transition hover:text-orange-500">
              Мои заказы
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1 bg-orange-500 text-white">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-64">
              <div className="flex flex-col space-y-4 mt-8 text-lg">
                <Link href="/" className="transition hover:text-orange-500">
                  Главная
                </Link>
                <Link href="/menu" className="transition hover:text-orange-500">
                  Меню
                </Link>
                <Link href="/cart" className="transition hover:text-orange-500">
                  Корзина
                </Link>
                <Link href="/orders" className="transition hover:text-orange-500">
                  Мои заказы
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
