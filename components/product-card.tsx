"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Product } from "@/lib/api";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  
  // Проверяем, есть ли файлы изображений
  const hasImage = product.files && product.files.length > 0;
  
  // Базовый URL API для изображений
  const baseImageUrl = "https://oshposapi.021.uz";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square relative overflow-hidden bg-muted">
        {hasImage ? (
          <Image
            src={`${baseImageUrl}/api/file/${product.files[0].id}`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.backgroundColor = "#f1f5f9";
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
            <span className="text-2xl font-semibold text-orange-500">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-base mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-lg font-semibold text-orange-500">
              {product.price.toLocaleString()} сум
            </p>
          </div>
          <div className="flex items-center">
            {quantity > 0 ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center font-medium">{quantity}</span>
                <Button 
                  size="icon" 
                  className="h-8 w-8 bg-orange-500 hover:bg-orange-600"
                  onClick={() => addToCart(product)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => addToCart(product)}
              >
                Добавить
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
