"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/toast";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 15000; // Delivery fee in sum
  const total = subtotal + delivery;

  const handleCheckout = () => {
    toast({
      title: "Оформление заказа",
      description: "Для оформления заказа потребуется авторизация. Функция скоро будет доступна.",
      duration: 3000,
    });
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      toast({
        title: "Промокод",
        description: "Функция применения промокода в разработке.",
        duration: 3000,
      });
      setPromoCode("");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Trash2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Ваша корзина пуста</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Похоже, вы еще не добавили товары в корзину
          </p>
          <Link href="/menu">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Вернуться в меню
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-6 border-b">
              <div className="w-20 h-20 relative bg-muted rounded-md overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.backgroundColor = "#f1f5f9";
                      target.style.display = "none";
                    }}
                  />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h3 className="font-medium">{item.name}</h3>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-lg font-semibold text-orange-500 mt-1">
                  {item.price.toLocaleString()} сум
                </p>
                <div className="flex items-center mt-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <Button 
                    size="icon" 
                    className="h-8 w-8 bg-orange-500 hover:bg-orange-600"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="text-muted-foreground"
            onClick={() => clearCart()}
          >
            Очистить корзину
          </Button>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-muted/40 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Информация о заказе</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Подытог</span>
                <span>{subtotal.toLocaleString()} сум</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Доставка</span>
                <span>{delivery.toLocaleString()} сум</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Итого</span>
                <span>{total.toLocaleString()} сум</span>
              </div>
              
              <form onSubmit={handleApplyPromo} className="flex gap-2 mt-4">
                <Input
                  placeholder="Промокод"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow"
                />
                <Button variant="outline" type="submit">
                  Применить
                </Button>
              </form>
              
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 mt-4"
                onClick={handleCheckout}
              >
                Оформить заказ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
