import axios, { AxiosInstance } from 'axios';
import { ApiCredentials, OrderRequest, Order, Position } from '../types/trading';

class BinanceApiService {
  private client: AxiosInstance;
  private credentials: ApiCredentials | null = null;

  constructor() {
    this.client = axios.create({
      timeout: 10000,
    });
  }

  setCredentials(credentials: ApiCredentials) {
    this.credentials = credentials;
    const baseURL = credentials.testnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com';
    
    this.client.defaults.baseURL = baseURL;
    this.client.defaults.headers.common['X-MBX-APIKEY'] = credentials.apiKey;
  }

  private createSignature(queryString: string): string {
    if (!this.credentials) throw new Error('API credentials not set');
    
    // In a real implementation, you would use crypto.createHmac
    // For this demo, we'll simulate the signature
    return 'demo_signature_' + Date.now();
  }

  private createTimestamp(): number {
    return Date.now();
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/fapi/v1/ping');
      return response.status === 200;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async getAccountInfo(): Promise<any> {
    if (!this.credentials) throw new Error('API credentials not set');
    
    const timestamp = this.createTimestamp();
    const queryString = `timestamp=${timestamp}`;
    const signature = this.createSignature(queryString);
    
    try {
      const response = await this.client.get(`/fapi/v2/account?${queryString}&signature=${signature}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get account info: ${error.response?.data?.msg || error.message}`);
    }
  }

  async getPositions(): Promise<Position[]> {
    if (!this.credentials) throw new Error('API credentials not set');
    
    const timestamp = this.createTimestamp();
    const queryString = `timestamp=${timestamp}`;
    const signature = this.createSignature(queryString);
    
    try {
      const response = await this.client.get(`/fapi/v2/positionRisk?${queryString}&signature=${signature}`);
      return response.data.filter((pos: Position) => parseFloat(pos.positionAmt) !== 0);
    } catch (error: any) {
      throw new Error(`Failed to get positions: ${error.response?.data?.msg || error.message}`);
    }
  }

  async placeOrder(orderRequest: OrderRequest): Promise<Order> {
    if (!this.credentials) throw new Error('API credentials not set');
    
    const timestamp = this.createTimestamp();
    const params = {
      symbol: orderRequest.symbol,
      side: orderRequest.side,
      type: orderRequest.type,
      quantity: orderRequest.quantity,
      timestamp: timestamp,
      ...(orderRequest.price && { price: orderRequest.price }),
      ...(orderRequest.stopPrice && { stopPrice: orderRequest.stopPrice }),
      ...(orderRequest.timeInForce && { timeInForce: orderRequest.timeInForce }),
    };
    
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    const signature = this.createSignature(queryString);
    
    try {
      const response = await this.client.post(`/fapi/v1/order?${queryString}&signature=${signature}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to place order: ${error.response?.data?.msg || error.message}`);
    }
  }

  async getOpenOrders(symbol?: string): Promise<Order[]> {
    if (!this.credentials) throw new Error('API credentials not set');
    
    const timestamp = this.createTimestamp();
    const queryString = symbol 
      ? `symbol=${symbol}&timestamp=${timestamp}`
      : `timestamp=${timestamp}`;
    const signature = this.createSignature(queryString);
    
    try {
      const response = await this.client.get(`/fapi/v1/openOrders?${queryString}&signature=${signature}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get open orders: ${error.response?.data?.msg || error.message}`);
    }
  }

  async cancelOrder(symbol: string, orderId: number): Promise<Order> {
    if (!this.credentials) throw new Error('API credentials not set');
    
    const timestamp = this.createTimestamp();
    const queryString = `symbol=${symbol}&orderId=${orderId}&timestamp=${timestamp}`;
    const signature = this.createSignature(queryString);
    
    try {
      const response = await this.client.delete(`/fapi/v1/order?${queryString}&signature=${signature}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to cancel order: ${error.response?.data?.msg || error.message}`);
    }
  }

  async getSymbolInfo(symbol: string): Promise<any> {
    try {
      const response = await this.client.get('/fapi/v1/exchangeInfo');
      const symbolInfo = response.data.symbols.find((s: any) => s.symbol === symbol);
      if (!symbolInfo) throw new Error(`Symbol ${symbol} not found`);
      return symbolInfo;
    } catch (error: any) {
      throw new Error(`Failed to get symbol info: ${error.response?.data?.msg || error.message}`);
    }
  }
}

export const binanceApi = new BinanceApiService();