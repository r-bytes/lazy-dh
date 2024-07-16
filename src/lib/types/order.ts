export interface OrderItem {
  name: string;
  quantity: number;
  quantityInBox: number;
  volume: string;
  percentage: string;
  price: string;
  imgUrl: string;
}

export interface User {
  name: string;
  email: string;
}

export interface Order {
  id: number;
  userId: string;
  orderDate: string;
  totalAmount: string;
  status: string;
  user: User;
  items: OrderItem | null;
}

export interface ApiResponse {
  success: boolean;
  orders: Array<{
    orders: Order;
    users: User;
    orderItems: OrderItem | null;
  }>;
}
