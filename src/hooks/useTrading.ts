import { useState, useCallback } from 'react';
import { binanceApi } from '../services/binanceApi';
import { ApiCredentials, OrderRequest, Order, LogEntry } from '../types/trading';

export const useTrading = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = useCallback((type: LogEntry['type'], message: string, details?: any) => {
    const log: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
      details,
    };
    setLogs(prev => [...prev, log]);
  }, []);

  const setCredentials = useCallback(async (credentials: ApiCredentials) => {
    setIsTestingConnection(true);
    addLog('info', 'Setting up API credentials...');
    
    try {
      binanceApi.setCredentials(credentials);
      const connected = await binanceApi.testConnection();
      
      if (connected) {
        setIsConnected(true);
        addLog('success', `Connected to Binance ${credentials.testnet ? 'Testnet' : 'Mainnet'}`);
        await refreshOrders();
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error: any) {
      setIsConnected(false);
      addLog('error', 'Failed to connect to Binance API', error.message);
    } finally {
      setIsTestingConnection(false);
    }
  }, [addLog]);

  const placeOrder = useCallback(async (orderRequest: OrderRequest) => {
    if (!isConnected) {
      addLog('error', 'Not connected to Binance API');
      return;
    }

    setIsLoading(true);
    addLog('info', `Placing ${orderRequest.side} order for ${orderRequest.quantity} ${orderRequest.symbol}`, orderRequest);

    try {
      const order = await binanceApi.placeOrder(orderRequest);
      addLog('success', `Order placed successfully: ${order.orderId}`, order);
      await refreshOrders();
    } catch (error: any) {
      addLog('error', `Failed to place order: ${error.message}`, error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, addLog]);

  const cancelOrder = useCallback(async (symbol: string, orderId: number) => {
    if (!isConnected) {
      addLog('error', 'Not connected to Binance API');
      return;
    }

    setIsLoading(true);
    addLog('info', `Cancelling order ${orderId} for ${symbol}`);

    try {
      const canceledOrder = await binanceApi.cancelOrder(symbol, orderId);
      addLog('success', `Order ${orderId} cancelled successfully`, canceledOrder);
      await refreshOrders();
    } catch (error: any) {
      addLog('error', `Failed to cancel order: ${error.message}`, error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, addLog]);

  const refreshOrders = useCallback(async () => {
    if (!isConnected) return;

    try {
      const openOrders = await binanceApi.getOpenOrders();
      setOrders(openOrders);
    } catch (error: any) {
      addLog('error', `Failed to refresh orders: ${error.message}`, error);
    }
  }, [isConnected, addLog]);

  return {
    isConnected,
    isTestingConnection,
    orders,
    logs,
    isLoading,
    setCredentials,
    placeOrder,
    cancelOrder,
    refreshOrders,
  };
};