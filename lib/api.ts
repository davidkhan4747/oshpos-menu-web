import axios from 'axios';

const API_BASE_URL = 'https://oshposapi.021.uz';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Iis5OTg5Mzc4NTgxMDQiLCJwYXNzd29yZCI6IjAxNDIiLCJpYXQiOjE3NTE4NjYyMTQsImV4cCI6MTc1MjIyNjIxNH0.vzY1VXrcR8PzH-6-kkZD28Cz64MxCMI8T44tLgjmn5Y';

export interface ProductType {
  id: number;
  name: string;
  description?: string;
  image?: string | null;
  logo?: string | null; // Added logo property
  createdAt: string;
  createdBy: number;
  deletedAt: string | null;
  deletedBy: number | null;
}

export interface FileInfo {
  id: number;
  createdAt: string;
  createdBy: number;
  deletedAt: string | null;
  deletedBy: number | null;
  entityType: string;
  entityId: number;
  originalName: string;
  mimeType: string;
  size: number;
}

// Addition product interfaces
export interface Addition {
  id: number;
  name: string;
  products: AdditionProduct[];
}

export interface AdditionProduct {
  additionId: number;
  additionProductId: number;
  name: string;
  price: number;
  count: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image: string | null;
  stock: number;
  status: string;
  productTypeId: number;
  createdAt: string;
  createdBy: number;
  deletedAt: string | null;
  deletedBy: number | null;
  files: FileInfo[];
  additions?: Addition[];
}

export interface CartItem extends Product {
  quantity: number;
  additionProducts?: AdditionProduct[];
}

// Order interfaces
export interface OrderProduct {
  productId: number;
  name: string;
  price: number;
  count: number;
  additionProducts?: AdditionProduct[];
}

export interface ClientInfo {
  fullName: string;
  phone: string;
}

export type PaymentStatus = 'unpaid' | 'paid';
export type OrderDeliveryType = 'PICKUP' | 'DELIVERY';
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

export interface OrderRequest {
  clientId?: number;
  products: OrderProduct[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  totalPaymentAmount: number;
  orderDeliveryType: OrderDeliveryType;
  paymentMethod: PaymentMethod;
  clientInfo: ClientInfo;
}

export interface OrderResponse {
  id: number;
  status: string;
  message?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  }
});

export const getProductTypes = async (): Promise<ProductType[]> => {
  try {
    const response = await api.get('/website/product/product-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching product types:', error);
    return [];
  }
};

export const createOrder = async (orderData: OrderRequest): Promise<OrderResponse> => {
  try {
    const response = await api.post('/pos/order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getProductsByType = async (typeId: number): Promise<Product[]> => {
  try {
    const response = await api.get(`/website/product/by-product-type-id/${typeId}`);
    return response.data.items || response.data; 
  } catch (error) {
    console.error(`Error fetching products for type ${typeId}:`, error);
    return [];
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // Попробуем исходный путь к API как в случае с категориями
    const response = await api.get('/pos/product');
    return response.data.items || response.data; 
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};
