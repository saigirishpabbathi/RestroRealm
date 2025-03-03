import { OrderStatus } from "../enum/order-status.enum";

export interface Order {
    orderId: number;
    orderNumber: string;
    customerName: string;
    status: OrderStatus;
    totalAmount: number;
    orderItems: any[];
    createdAt: Date;
    updatedAt: Date;
    tableId?: number;
    // other properties as needed
  }