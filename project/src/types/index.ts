export interface Product {
  id: string;
  name: string;
  price: number;
  category: "food" | "drink";
  description?: string;
  available: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface EmployeeOrderData {
  id: string;
  employeeName: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  // Campos para sistema de troco do sábado
  dailyLimit: number; // Limite de R$ 25 por colaborador
  change: number; // Troco disponível
  canBuyCoca: boolean; // Se o troco dá para coca
}

export interface OrderSession {
  id: string;
  date: Date;
  sector: string;
  orders: EmployeeOrderData[];
  status: "active" | "finalized" | "sent";
  totalAmount: number;
}

export interface DailyOrderData {
  sector: string;
  orders: EmployeeOrderData[];
}
