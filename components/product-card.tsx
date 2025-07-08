"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Product, getImageUrl } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const [showDescription, setShowDescription] = useState(false);
  
  // Get image URL using our helper function
  const imageUrl = getImageUrl(product);

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/20 group relative border border-border/50 hover:shadow-lg hover:shadow-accent/5">
      {product.stock <= 5 && product.stock > 0 && (
        <Badge className="absolute top-2 right-2 z-10 bg-destructive text-white">
          Осталось {product.stock}
        </Badge>
      )}
      
      <div className="aspect-square relative overflow-hidden bg-muted group-hover:brightness-105 transition-all">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.backgroundColor = "#f1f5f9";
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent/50 dark:bg-accent/20">
            <span className="text-2xl font-semibold text-primary">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-base">{product.name}</h3>
              <p className="text-lg font-semibold text-primary mt-1">
                {product.price.toLocaleString()} сум
              </p>
            </div>
          </div>
          
          {product.description && (
            <div className="w-full">
              <button 
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors w-full justify-between"
              >
                <span>{showDescription ? "Скрыть описание" : "Показать описание"}</span>
                {showDescription ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-300",
                showDescription ? "max-h-[200px] mt-2" : "max-h-0"
              )}>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-end w-full mt-2 border-t pt-2 border-border/30">
            {quantity > 0 ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 border-primary/30 hover:bg-primary/10 rounded-full"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center font-medium">{quantity}</span>
                <Button 
                  size="icon" 
                  className="h-8 w-8 bg-primary hover:bg-primary/90 rounded-full"
                  onClick={() => addToCart(product)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 w-full rounded-full"
                onClick={() => addToCart(product)}
              >
                В корзину
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
