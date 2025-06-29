"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductType, getProductTypes } from "@/lib/api";

export default function Home() {
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

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
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Ресторан OshPos
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Откройте для себя наше вкусное меню и закажите любимые блюда
          </p>
          <Link href="/menu">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
              Смотреть меню
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-background">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Популярные категории</h2>
            <Link href="/menu" className="text-orange-500 hover:underline flex items-center gap-1">
              Смотреть все <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-lg border">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))
              : categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    href={`/menu?category=${category.id}`}
                    className="flex flex-col items-center gap-3 p-4 rounded-lg border transition-all hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  >
                    <div className="h-24 w-24 rounded-full overflow-hidden relative bg-muted">
                      {category.logo && (
                        <Image
                          src={category.logo}
                          alt={category.name}
                          fill
                          sizes="(max-width: 768px) 96px, 96px"
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}
                      {!category.logo && (
                        <div className="w-full h-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
                          <span className="text-2xl font-bold text-orange-500">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-center">{category.name}</span>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-orange-50 dark:bg-orange-950/20">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Готовы сделать заказ?</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Просмотрите наше меню и сделайте заказ всего в несколько кликов. Наслаждайтесь вкусной едой когда вам удобно.
              </p>
              <Link href="/menu">
                <Button className="bg-orange-500 hover:bg-orange-600">Заказать сейчас</Button>
              </Link>
            </div>
            <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-lg overflow-hidden bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-orange-500">OshPos</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
