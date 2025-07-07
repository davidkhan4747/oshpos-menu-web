"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CategorySlider } from "@/components/category-slider";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, ProductType, getProductTypes, getProductsByType } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("category") ? Number(searchParams.get("category")) : null;
  
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialCategoryId);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { totalItems, totalPrice } = useCart();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getProductTypes();
        setCategories(data);
        
        // Если категории есть и нет начальной выбранной категории, выбираем первую
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
        return; // Не загружать продукты, если категория не выбрана
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
  }, [selectedCategoryId, setProducts, setFilteredProducts]);
  
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
