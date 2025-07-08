"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t mt-auto">
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#fdd7d6] rounded-full p-1 relative w-8 h-8 overflow-hidden">
                <Image 
                  src="/LogoFast Icon (1).svg" 
                  alt="OshPos Logo" 
                  fill 
                  className="object-contain p-0.5" 
                />
              </div>
              <h3 className="font-bold text-lg"> OSHMENU</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Вкусная еда с доставкой до вашей двери. Заказывайте онлайн для быстрого
              и удобного обслуживания.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* <div>
            <h3 className="font-bold text-lg mb-4">Быстрые ссылки</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Главная
              </Link>
              <Link href="/menu" className="text-muted-foreground hover:text-foreground">
                Меню
              </Link>
              <Link href="/cart" className="text-muted-foreground hover:text-foreground">
                Корзина
              </Link>
              <Link href="/orders" className="text-muted-foreground hover:text-foreground">
                Мои заказы
              </Link>
            </nav>
          </div> */}
          
          <div>
            <h3 className="font-bold text-lg mb-4">Связаться с нами</h3>
            <address className="not-italic">
              {/* <p className="text-muted-foreground">ул. Ресторанная, 123</p> */}
              <p className="text-muted-foreground">Ташкент, Узбекистан</p>
              {/* <p className="text-muted-foreground mt-2">
                <a href="tel:+998712345678" className="hover:text-foreground">+998 71 234 56 78</a>
              </p> */}
              <p className="text-muted-foreground">
                <a href="mailto:info@oshpos.uz" className="hover:text-foreground">info@oshlab.uz</a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} OSHLAB. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
