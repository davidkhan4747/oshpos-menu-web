"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CategorySlider } from "@/components/category-slider";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, ProductType, getProductTypes, getProductsByType } from "@/lib/api";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("category") ? Number(searchParams.get("category")) : null;
  
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialCategoryId);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProducts();
  }, [selectedCategoryId]);

  return (
    <div className="container py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Меню</h1>
      
      <CategorySlider 
        categories={categories}
        selectedCategory={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        isLoading={loadingCategories}
      />
      
      <div className="mt-6">
        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Товары не найдены</h3>
            <p className="text-muted-foreground">
              В этой категории пока нет товаров.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
