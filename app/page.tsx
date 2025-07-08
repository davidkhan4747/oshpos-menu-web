"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, ProductType, getProductTypes, getProductsByType } from "@/lib/api";
import { CategorySlider } from "@/components/category-slider";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";
import restaurantImage from "../assets/Buy-Restaurant-barcelona-spain-Top-House-Realty-4.jpg";

// Menu content component
function HomeMenuContent() {
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { totalItems, totalPrice } = useCart();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getProductTypes();
        setCategories(data);
        
        // If there are categories and no selected category, select the first one
        if (data.length > 0 && selectedCategoryId === null) {
          setSelectedCategoryId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      if (selectedCategoryId === null) {
        return; // Don't load products if no category is selected
      }
      
      setLoadingProducts(true);
      try {
        const data = await getProductsByType(selectedCategoryId);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProducts();
  }, [selectedCategoryId]);
  
  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query) || 
      (product.description && product.description.toLowerCase().includes(query))
    );
    
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  return (
    <div className="container py-6">
      <div className="content-wrapper">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Меню</h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Поиск блюд..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8"
              />
              {searchQuery && (
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
            
            {totalItems > 0 && (
              <Link href="/cart" className="flex-shrink-0">
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Корзина</span>
                  <Badge className="ml-1 bg-white text-primary">{totalItems}</Badge>
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur pb-2">
          <CategorySlider 
            categories={categories}
            selectedCategory={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            isLoading={loadingCategories}
          />
        </div>
        
        <div className="mt-6">
          {loadingProducts ? (
            <div className="grid-wrapper grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden">
                  <Skeleton className="w-full aspect-square" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid-wrapper grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-accent/10">
              <h3 className="text-xl font-medium mb-2">Товары не найдены</h3>
              <p className="text-muted-foreground px-4">
                {searchQuery ? 
                  `По запросу "${searchQuery}" ничего не найдено.` : 
                  "В этой категории пока нет товаров."}
              </p>
            </div>
          )}
        </div>
        
        {totalItems > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden z-40">
            <Link href="/cart">
              <Button className="bg-primary hover:bg-primary/90 shadow-lg gap-2 px-6 py-6 h-auto rounded-full">
                <ShoppingCart className="h-5 w-5" />
                <span>Корзина: {totalItems}</span>
                <span className="font-bold ml-2">{totalPrice.toLocaleString()} сум</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function HomeMenuLoading() {
  return (
    <div className="container py-6">
      <div className="content-wrapper">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-28 flex-shrink-0" />
            ))}
          </div>
        </div>
        
        <div className="mt-6 grid-wrapper grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden">
              <Skeleton className="w-full aspect-square" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
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
        
        {/* Hero Content */}
        <div className="container relative z-10 flex flex-col items-center text-white px-4">
          <div className="mb-4 inline-block">
            <span className="px-4 py-1 rounded-full bg-highlight/80 text-white text-sm font-medium">
              Новое меню 2025
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-center leading-tight">
            <span className="block">Ресторан</span>
            <span className="bg-clip-text bg-gradient-to-r from-white via-accent to-highlight">
              OSHPOS
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-center font-light">
            Откройте для себя наше вкусное меню и закажите любимые блюда
          </p>
          
          {/*<div className="flex flex-col sm:flex-row gap-4 items-center">*/}
          {/*  <Link href="/orders">*/}
          {/*    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 font-medium text-lg transition-all hover:scale-105">*/}
          {/*      Мои заказы*/}
          {/*    </Button>*/}
          {/*  </Link>*/}
          {/*</div>*/}
        </div>
        
        {/* Decorative Bottom Curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-background">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.18,70.28,289.4,40.17,263.2,72.93,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Menu Section - Directly after hero */}
      <section className="bg-background relative">
        <Suspense fallback={<HomeMenuLoading />}>
          <HomeMenuContent />
        </Suspense>
      </section>
    </div>
  );
}
