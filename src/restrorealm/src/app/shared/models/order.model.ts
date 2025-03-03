import { OrderStatus } from "../enum/order-status.enum";

export interface Order {
    orderId: number;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    paymentMethod: string;
    status: OrderStatus;
    totalAmount: number;
    orderItems: any[];
    createdAt: Date;
    updatedAt: Date;
    tableId?: number;
    subtotal?: number;
    taxAmount?: number;
    deliveryFee?: number;
    discount?: number;
    // other properties as needed
  }