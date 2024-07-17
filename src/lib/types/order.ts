export interface OrderItem {
  name: string;
  quantity: number;
  quantityInBox: number;
  volume: string;
  percentage: string;
  price: number;
  imgUrl: string;
}

export interface User {
  name: string;
  email: string;
}

export interface Order {
  orderId: number;
  userId: string;
  orderDate: string;
  totalAmount: string;
  status: string;
  userName: string;
  userEmail: string;
  orderItems: OrderItem[] | null;
}

export interface ApiResponse {
  success: boolean;
  orders: Order[];
}
