"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductType, getProductTypes } from "@/lib/api";
import { themeColors } from "@/lib/theme-config";
import { Card, CardContent } from "@/components/ui/card";
import restaurantImage from "../assets/Buy-Restaurant-barcelona-spain-Top-House-Realty-4.jpg";
import { cn } from "@/lib/utils";

export default function Home() {
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Handle scroll for parallax effect with requestAnimationFrame for smoother performance
  useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;
    
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(lastScrollY);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getProductTypes();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 w-full h-full transform scale-110">
          <Image 
            src={restaurantImage} 
            alt="Restaurant Background" 
            fill 
            priority
            className="object-cover brightness-[0.4]"
            style={{ 
              objectPosition: "center 30%",
              transform: `scale(1.1) translateY(${scrollY * 0.15}px)`,
              transition: "transform 0.01s cubic-bezier(0.33, 1, 0.68, 1)",
              willChange: "transform"
            }}
          />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-background/80"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/30 to-transparent opacity-60"></div>
        
        {/* Hero Content */}
        <div className="container relative z-10 flex flex-col items-center text-white px-4">
          <div className="mb-4 inline-block">
            <span className="px-4 py-1 rounded-full bg-highlight/80 text-white text-sm font-medium">
              Новое меню 2025
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-center leading-tight">
            <span className="block">Ресторан</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-accent to-highlight">
              OSHPOS
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-center font-light">
            Откройте для себя наше вкусное меню и закажите любимые блюда
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/menu">
              <Button size="lg" className="bg-highlight hover:bg-highlight/90 text-white rounded-full px-8 py-6 font-medium text-lg shadow-sm shadow-accent/10 hover:shadow-accent/20 transition-all hover:scale-105">
                Смотреть меню
              </Button>
            </Link>
            <Link href="/orders">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 font-medium text-lg transition-all hover:scale-105">
                Мои заказы
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative Bottom Curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-background">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.18,70.28,289.4,40.17,263.2,72.93,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 opacity-50"></div>
        
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-highlight font-medium mb-2 inline-block">Наше меню</span>
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Популярные категории
              </h2>
            </div>
            <Link 
              href="/menu" 
              className="group flex items-center gap-2 px-6 py-2 rounded-full border border-primary/30 hover:bg-primary/5 transition-all"
            >
              <span className="text-primary font-medium">Смотреть все</span>
              <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 p-6 rounded-xl border bg-background">
                    <Skeleton className="h-28 w-28 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))
              : categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    href={`/menu?category=${category.id}`}
                    className="flex flex-col items-center gap-4 p-6 rounded-xl border bg-background hover:border-primary/30 hover:bg-accent/10 group transition-all"
                  >
                    <div className="h-28 w-28 rounded-full overflow-hidden relative bg-muted group-hover:ring-4 ring-accent/30 transition-all">
                      {category.logo && (
                        <Image
                          src={category.logo}
                          alt={category.name}
                          fill
                          sizes="(max-width: 768px) 112px, 112px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}
                      {!category.logo && (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/50 to-primary/20 group-hover:from-accent/70 group-hover:to-primary/30 transition-colors">
                          <span className="text-3xl font-bold text-primary">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-center text-lg">{category.name}</span>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-highlight/5 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10 opacity-70"></div>
        
        <div className="container px-4">
          <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Left side with image */}
                <div className="relative w-full md:w-2/5 min-h-[300px] md:min-h-0 order-2 md:order-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0,_transparent_40%)] animate-[spin_40s_linear_infinite]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-opacity-10 flex flex-col items-center">
                        <UtensilsCrossed className="h-40 w-40" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary to-transparent"></div>
                  </div>
                  <div className="relative h-full flex flex-col items-center justify-center p-10 text-white">
                    <UtensilsCrossed className="h-16 w-16 mb-4" />
                    <span className="text-4xl font-bold">OSHPOS</span>
                    <div className="mt-6 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-highlight animate-pulse"></div>
                      <span className="text-sm font-medium">Открыто сейчас</span>
                    </div>
                  </div>
                </div>
                
                {/* Right side with content */}
                <div className="w-full md:w-3/5 p-8 md:p-12 order-1 md:order-2 flex flex-col justify-center">
                  <div className="max-w-lg">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-highlight">
                      Готовы сделать заказ?
                    </h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                      Просмотрите наше меню и сделайте заказ всего в несколько кликов. Наслаждайтесь вкусной едой, когда вам удобно.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/menu">
                        <Button className="bg-highlight hover:bg-highlight/90 text-white rounded-full px-8 py-6 font-medium text-lg shadow-sm shadow-accent/10 hover:shadow-accent/20 transition-all hover:scale-105">
                          Заказать сейчас
                        </Button>
                      </Link>
                      <Link href="/orders">
                        <Button variant="outline" className="rounded-full px-8 py-6 border-primary/30 hover:bg-primary/5 font-medium text-lg transition-all">
                          История заказов
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>
    </div>
  );
}
