// Creem webhook event types
export interface CreemWebhookEvent {
  id: string;
  eventType: string;
  created_at: number;
  object: CreemCheckoutObject | CreemSubscriptionObject;
}

export interface CreemCheckoutObject {
  id: string;
  object: string;
  order?: {
    id: string;
    transaction?: string;
    amount?: number;
    currency?: string;
  };
  product?: {
    id: string;
  };
  subscription?: {
    id: string;
    status: string;
    current_period_start_date?: string;
    current_period_end_date?: string;
  };
  metadata?: {
    userId?: string;
    productId?: string;
    lessonId?: string;
    [key: string]: string | undefined;
  };
}

export interface CreemSubscriptionObject {
  id: string;
  status: string;
  current_period_start_date?: string;
  current_period_end_date?: string;
  canceled_at?: string;
  product?: {
    id: string;
  };
  customer?: {
    id: string;
  };
}

