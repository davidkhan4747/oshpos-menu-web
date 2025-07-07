"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { useCart } from "@/lib/cart-context";
import { 
  createOrder, 
  OrderRequest, 
  OrderProduct, 
  PaymentMethod, 
  OrderDeliveryType 
} from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [deliveryType, setDeliveryType] = useState<OrderDeliveryType>("PICKUP");
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !phone.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        duration: 3000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert cart items to order products format
      const orderProducts: OrderProduct[] = items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        count: item.quantity,
        additionProducts: item.additionProducts || []
      }));
      
      // Create order request
      const orderRequest: OrderRequest = {
        products: orderProducts,
        totalAmount: totalPrice,
        paymentStatus: "unpaid",
        totalPaymentAmount: totalPrice,
        orderDeliveryType: deliveryType,
        paymentMethod: paymentMethod,
        clientInfo: {
          fullName,
          phone
        }
      };
      
      // Send order request to API
      const response = await createOrder(orderRequest);
      
      // Show success message
      toast({
        title: "Заказ успешно создан",
        description: `Номер заказа: ${response.id}`,
        duration: 5000,
      });
      
      // Clear cart and redirect to success page
      clearCart();
      router.push("/orders");
      
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать заказ. Пожалуйста, попробуйте еще раз.",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-6">
      <div className="content-wrapper">
        <div className="flex items-center mb-8">
          <Link href="/cart" className="flex items-center text-muted-foreground hover:text-primary mr-4">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Вернуться в корзину</span>
          </Link>
          <h1 className="text-3xl font-bold">Оформление заказа</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Контактная информация</h2>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Имя и фамилия</Label>
                      <Input 
                        id="fullName" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Введите ваше имя и фамилию"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Номер телефона</Label>
                      <Input 
                        id="phone" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+998 XX XXX XX XX"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Способ получения</h2>
                  
                  <RadioGroup 
                    value={deliveryType} 
                    onValueChange={(value: string) => setDeliveryType(value as OrderDeliveryType)}
                    className="grid gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PICKUP" id="pickup" />
                      <Label htmlFor="pickup" className="flex items-center cursor-pointer">
                        <span className="font-medium">Самовывоз</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          (Заберите заказ самостоятельно из ресторана)
                        </span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DELIVERY" id="delivery" />
                      <Label htmlFor="delivery" className="flex items-center cursor-pointer">
                        <span className="font-medium">Доставка</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          (Доставим заказ по указанному адресу)
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Способ оплаты</h2>
                  
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}
                    className="grid gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CASH" id="cash" />
                      <Label htmlFor="cash" className="flex items-center cursor-pointer">
                        <span className="font-medium">Наличными</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          (Оплата при получении)
                        </span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CARD" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <span className="font-medium">Картой</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          (Оплата картой при получении)
                        </span>
                      </Label>
                    </div>
                    
                    {/* <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ONLINE" id="online" />
                      <Label htmlFor="online" className="flex items-center cursor-pointer">
                        <span className="font-medium">Онлайн</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          (Оплата онлайн через платежную систему)
                        </span>
                      </Label>
                    </div> */}
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Обработка заказа...
                  </>
                ) : (
                  "Подтвердить заказ"
                )}
              </Button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-4">Ваш заказ</h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{(item.price * item.quantity).toLocaleString()} сум</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Итого</span>
                    <span className="text-primary text-lg">{totalPrice.toLocaleString()} сум</span>
                  </div>
                  
                  <div className="bg-accent/30 rounded-md p-4 mt-4">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Нажимая кнопку «Подтвердить заказ», вы соглашаетесь с условиями доставки и оплаты.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
