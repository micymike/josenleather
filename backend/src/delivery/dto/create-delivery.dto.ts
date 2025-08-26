export class CreateDeliveryDto {
  orderId: string;
  address: string;
  recipientName: string;
  recipientPhone: string;
  courier: string;
  status?: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed' | 'returned';
  estimatedCost?: number;
  estimatedTime?: string;
  trackingCode?: string;
  lastLocation?: string;
  deliveryHistory?: any[]; // Array of { status, timestamp, location }
}
