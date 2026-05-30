export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplier: string;
  lastUpdated: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: "entry" | "exit";
  quantity: number;
  date: string;
  reference: string;
  notes?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  recentMovements: number;
}
