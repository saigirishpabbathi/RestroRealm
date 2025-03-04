import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { OrderService } from '../../core/services/orders/order.service';
import { Order } from '../../shared/models/order.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  cartService = inject(CartService);
  orderService = inject(OrderService);
  
  @ViewChild('receiptContent')
  receiptContent!: ElementRef;

  order!: Order;
  orderId!: string;
  isLoading: boolean = true;
  estimatedDeliveryTime: Date;
  isGeneratingReceipt: boolean = false;
  deliveryAddress!: string;
  
  constructor() {
    this.cartService.clearCart();
    this.estimatedDeliveryTime = this.calculateEstimatedDeliveryTime();
  }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.fetchOrderDetails();
  }

  fetchOrderDetails(): void {
    this.orderService.getOrder(this.orderId).subscribe({
      next: (orderData) => {
        this.order = orderData;
        this.deliveryAddress = this.order.street1 + ', ' + this.order.street2 + ', ' + this.order.city + ', ' + this.order.state + ' ' + this.order.postalCode + '.';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching order details', error);
        this.isLoading = false;
      }
    });
  }

  calculateEstimatedDeliveryTime(): Date {
    const deliveryTime = new Date();
    deliveryTime.setMinutes(deliveryTime.getMinutes() + 45);
    return deliveryTime;
  }

  async downloadReceipt(): Promise<void> {
    this.isGeneratingReceipt = true;
    
    try {
      const receiptHtml = this.generateReceiptHtml();
      const container = document.createElement('div');
      container.innerHTML = receiptHtml;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await this.convertHtmlToCanvas(container);
      const pdf = await this.convertCanvasToPdf(canvas);
      this.downloadPdf(pdf);
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt. Please try again.');
    } finally {
      this.isGeneratingReceipt = false;
    }
  }
  
  private generateReceiptHtml(): string {
    const date = new Date(this.order.createdAt || new Date()).toLocaleDateString();
    const time = new Date(this.order.createdAt || new Date()).toLocaleTimeString();
    
    const logoUrl = environment.imageUrl + '/images/logo.png';
    const itemRows = this.order.orderItems.map(item => `
      <tr>
        <td>${item.menuItemName || item.name || 'Item'}</td>
        <td>${item.quantity || 1}</td>
        <td>$${(item.price || 0).toFixed(2)}</td>
        <td>$${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</td>
      </tr>
    `).join('');
    const subtotal = this.order.subtotal || 
      this.order.orderItems.reduce((sum, item) => sum + ((item.quantity || 1) * (item.price || 0)), 0);
    const orderId = this.order.orderNumber || this.orderId || 'N/A';
    const deliveryAddress = this.deliveryAddress || 'Not provided';
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="Company Logo" style="max-width: 150px; height: auto;">
          <h1 style="margin: 10px 0;">Order Receipt</h1>
          <p style="color: #666;">Order #${orderId}</p>
          <p style="color: #666;">${date} at ${time}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="margin-right: 20px;">
            <h3 style="margin-bottom: 10px;">Customer Details</h3>
            <p style="margin: 5px 0;">${this.order.customerName || 'Customer'}</p>
            <p style="margin: 5px 0;">${this.order.customerEmail || 'Email not provided'}</p>
            <p style="margin: 5px 0;">${this.order.customerPhone || 'Phone not provided'}</p>
          </div>
          
          <div>
            <h3 style="margin-bottom: 10px;">Delivery Details</h3>
            <p style="margin: 5px 0;">${deliveryAddress}</p>
            <p style="margin: 5px 0;">Estimated Delivery: ${this.estimatedDeliveryTime.toLocaleString()}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="margin-bottom: 10px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background-color: #f3f3f3;">
              <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Unit Price</th>
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; border-top: 1px solid #ddd;"><strong>Subtotal</strong></td>
                <td style="padding: 10px; text-align: left; border-top: 1px solid #ddd;">$${subtotal.toFixed(2)}</td>
              </tr>
              ${this.order.taxAmount ? `
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax</strong></td>
                <td style="padding: 10px; text-align: left;">$${this.order.taxAmount.toFixed(2)}</td>
              </tr>
              ` : ''}
              ${this.order.deliveryFee ? `
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Delivery Fee</strong></td>
                <td style="padding: 10px; text-align: left;">$${this.order.deliveryFee.toFixed(2)}</td>
              </tr>
              ` : ''}
              ${this.order.discount ? `
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Discount</strong></td>
                <td style="padding: 10px; text-align: left;">-$${this.order.discount.toFixed(2)}</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; border-top: 1px solid #ddd;"><strong>Total</strong></td>
                <td style="padding: 10px; text-align: left; font-weight: bold; border-top: 1px solid #ddd;">$${(this.order.totalAmount || subtotal).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>Thank you for your order!</p>
          <p>If you have any questions, please contact us at support@restrorealm.com</p>
        </div>
      </div>
    `;
  }

  private async convertHtmlToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
    return await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
  }
  
  private async convertCanvasToPdf(canvas: HTMLCanvasElement): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, 297));
    
    if (pdfHeight > 297) {
      let remainingHeight = pdfHeight - 297;
      let position = -297;
      
      while (remainingHeight > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        
        remainingHeight -= 297;
        position -= 297;
      }
    }
    
    return pdf.output('blob');
  }
  
  private downloadPdf(pdfBlob: Blob): void {
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `order-receipt-${this.order.orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  shareOrder(): void {
    if (navigator.share) {
      navigator.share({
        title: `Order Confirmation #${this.orderId}`,
        text: `Check out my order from RestroRealm restaurant!`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Order link copied to clipboard!'));
    }
  }
}
