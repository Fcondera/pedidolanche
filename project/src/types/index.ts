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
