// Creem API Client
export class CreemClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CREEM_API_KEY || '';
    this.baseUrl = process.env.NEXT_PUBLIC_CREEM_URL || 'https://test-api.creem.io';
    
    if (!this.apiKey) {
      console.error('CREEM_API_KEY is not set in environment variables');
    }
  }

  // Create checkout session
  async createCheckout(params: {
    product_id: string;
    success_url: string;
    metadata?: Record<string, any>;
  }) {
    if (!this.apiKey) {
      throw new Error('CREEM_API_KEY is not configured. Please check your .env.local file.');
    }
    
    const response = await fetch(`${this.baseUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Creem API error:', error);
      throw new Error(`Creem API error: ${error}`);
    }

    return response.json();
  }

  // Get checkout session
  async getCheckout(checkoutId: string) {
    const response = await fetch(
      `${this.baseUrl}/v1/checkouts?checkout_id=${checkoutId}`,
      {
        headers: {
          'x-api-key': this.apiKey,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Creem API error: ${error}`);
    }

    return response.json();
  }

  // Get subscription
  async getSubscription(subscriptionId: string) {
    const response = await fetch(
      `${this.baseUrl}/v1/subscriptions?subscription_id=${subscriptionId}`,
      {
        headers: {
          'x-api-key': this.apiKey,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Creem API error: ${error}`);
    }

    return response.json();
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string) {
    const response = await fetch(
      `${this.baseUrl}/v1/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Creem API error: ${error}`);
    }

    return response.json();
  }
}

export const creemClient = new CreemClient();

