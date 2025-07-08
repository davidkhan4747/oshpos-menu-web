"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 15000; // Delivery fee in sum
  const total = subtotal + delivery;

  const handleCheckout = () => {
    router.push('/checkout');
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
      <div className="container py-12">
        <div className="content-wrapper">
          <div className="flex items-center mb-8">
            <Link href="/menu" className="flex items-center text-muted-foreground hover:text-primary mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Вернуться в меню</span>
            </Link>
            <h1 className="text-3xl font-bold">Корзина</h1>
          </div>
          
          <Card className="border-dashed border-2 border-accent">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-accent/30 rounded-full p-6 mb-4">
                <ShoppingBag className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Ваша корзина пуста</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Похоже, вы еще не добавили товары в корзину. Добавьте блюда из меню, чтобы оформить заказ.
              </p>
              <Link href="/menu">
                <Button className="bg-primary hover:bg-primary/90">
                  Перейти в меню
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="content-wrapper">
        <div className="flex items-center mb-8">
          <Link href="/menu" className="flex items-center text-muted-foreground hover:text-primary mr-4">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Вернуться в меню</span>
          </Link>
          <h1 className="text-3xl font-bold">Корзина</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                {items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div className="flex gap-4 py-4">
                      <div className="w-24 h-24 relative bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.files && item.files.length > 0 ? (
                          <Image
                            src={getImageUrl(item) || "/placeholder-image.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.backgroundColor = "#f1f5f9";
                              target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-accent/50">
                            <span className="text-xl font-semibold text-primary">
                              {item.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-primary mt-1">
                          {item.price.toLocaleString()} сум
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-muted-foreground">
                            Итого: {(item.price * item.quantity).toLocaleString()} сум
                          </div>
                          <div className="flex items-center">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 border-primary/30 hover:bg-primary/10"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <Button 
                              size="icon" 
                              className="h-8 w-8 bg-primary hover:bg-primary/90"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="my-2" />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                className="text-muted-foreground border-primary/30 hover:bg-primary/10"
                onClick={() => clearCart()}
              >
                Очистить корзину
              </Button>
              <Link href="/menu">
                <Button variant="link" className="text-primary">
                  Добавить еще блюда
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6 sticky top-20">
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
                    <span className="text-primary text-lg">{total.toLocaleString()} сум</span>
                  </div>
                  
                  <form onSubmit={handleApplyPromo} className="flex gap-2 mt-4">
                    <Input
                      placeholder="Промокод"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-grow"
                    />
                    <Button 
                      variant="outline" 
                      type="submit"
                      className="border-primary/30 hover:bg-primary/10"
                    >
                      Применить
                    </Button>
                  </form>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 mt-4 py-6 text-lg"
                    onClick={handleCheckout}
                  >
                    Оформить заказ
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Нажимая кнопку, вы соглашаетесь с условиями доставки
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
