import axios from 'axios';

const API_BASE_URL = 'https://oshposapi.021.uz';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Iis5OTg5Mzc4NTgxMDQiLCJwYXNzd29yZCI6IjAxNDIiLCJpYXQiOjE3NTEyMDY4MDIsImV4cCI6MTc1MTU2NjgwMn0.YkcWNx3AtzyfVEgd6qZN1pkYYih6eimX0FZOeESR_qM';

export interface ProductType {
  id: number;
  name: string;
  description?: string;
  image?: string | null;
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
}

export interface CartItem extends Product {
  quantity: number;
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
