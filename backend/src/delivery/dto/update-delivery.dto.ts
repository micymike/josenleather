export class UpdateDeliveryDto {
  address?: string;
  recipientName?: string;
  recipientPhone?: string;
  courier?: string;
  status?: 'pending' | 'in_transit' | 'delivered' | 'failed';
  cost?: number;
  trackingNumber?: string;
}
