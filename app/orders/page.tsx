"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  ArrowRight 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Типы данных для заказов (пока мокап)
type OrderStatus = 'completed' | 'processing' | 'cancelled';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: number;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

// Мокап данные для заказов
const mockOrders: Order[] = [
  {
    id: 12345,
    date: '2025-06-25T14:30:00',
    status: 'completed',
    items: [
      { id: 1, name: 'Плов Фергана', price: 45000, quantity: 2, image: '' },
      { id: 2, name: 'Шашлык из баранины', price: 38000, quantity: 1, image: '' },
      { id: 3, name: 'Лагман', price: 29000, quantity: 1, image: '' },
    ],
    total: 157000
  },
  {
    id: 12346,
    date: '2025-06-28T19:45:00',
    status: 'processing',
    items: [
      { id: 4, name: 'Манты с говядиной', price: 32000, quantity: 2, image: '' },
      { id: 5, name: 'Самса', price: 18000, quantity: 3, image: '' }
    ],
    total: 118000
  },
  {
    id: 12347,
    date: '2025-06-22T12:15:00',
    status: 'cancelled',
    items: [
      { id: 6, name: 'Шурпа', price: 26000, quantity: 1, image: '' }
    ],
    total: 26000
  }
];

// Вспомогательные функции
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'processing':
      return 'bg-orange-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'processing':
      return <Clock className="h-5 w-5 text-orange-500" />;
    case 'cancelled':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'completed':
      return 'Выполнен';
    case 'processing':
      return 'В обработке';
    case 'cancelled':
      return 'Отменен';
    default:
      return '';
  }
};

export default function OrdersPage() {
  if (mockOrders.length === 0) {
    return (
      <div className="container py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Заказов пока нет</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Вы еще не сделали ни одного заказа
          </p>
          <Link href="/menu">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Перейти в меню
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 px-4">
      <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>
      
      <div className="space-y-6">
        {mockOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Заказ #{order.id} 
                  <Badge className={`${getStatusColor(order.status)} text-white ml-2`}>
                    {getStatusText(order.status)}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {formatDate(order.date)}
                </CardDescription>
              </div>
              <div className="hidden md:flex items-center">
                {getStatusIcon(order.status)}
                <span className="ml-2 font-medium">{getStatusText(order.status)}</span>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Состав заказа</h3>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-muted rounded-md relative overflow-hidden">
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
                        <span className="font-medium">{item.name}</span>
                        <span>x{item.quantity}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.price.toLocaleString()} сум
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Итого</span>
                <span className="font-semibold text-lg">
                  {order.total.toLocaleString()} сум
                </span>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/30 py-3 px-6 flex justify-between">
              <span className="text-sm text-muted-foreground">
                {order.items.length} {order.items.length === 1 ? 'позиция' : 
                  order.items.length > 1 && order.items.length < 5 ? 'позиции' : 'позиций'}
              </span>
              <Button variant="ghost" size="sm" className="gap-1 text-orange-500">
                Подробнее <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
