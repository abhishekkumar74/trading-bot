import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { OrderRequest } from '../types/trading';

interface OrderFormProps {
  onPlaceOrder: (order: OrderRequest) => void;
  isLoading: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onPlaceOrder, isLoading }) => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [type, setType] = useState<'MARKET' | 'LIMIT' | 'STOP_MARKET' | 'STOP_LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order: OrderRequest = {
      symbol,
      side,
      type,
      quantity,
      ...(type === 'LIMIT' || type === 'STOP_LIMIT' ? { price } : {}),
      ...(type === 'STOP_MARKET' || type === 'STOP_LIMIT' ? { stopPrice } : {}),
      ...(type === 'LIMIT' ? { timeInForce: 'GTC' as const } : {}),
    };

    onPlaceOrder(order);
  };

  const isFormValid = () => {
    if (!symbol || !quantity) return false;
    if ((type === 'LIMIT' || type === 'STOP_LIMIT') && !price) return false;
    if ((type === 'STOP_MARKET' || type === 'STOP_LIMIT') && !stopPrice) return false;
    return true;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-5 h-5 text-green-400" />
        <h2 className="text-lg font-semibold text-white">Place Order</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="BTCUSDT"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Order Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="MARKET">Market</option>
              <option value="LIMIT">Limit</option>
              <option value="STOP_MARKET">Stop Market</option>
              <option value="STOP_LIMIT">Stop Limit</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSide('BUY')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              side === 'BUY'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide('SELL')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              side === 'SELL'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            Sell
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Quantity
          </label>
          <input
            type="number"
            step="0.00001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            placeholder="0.001"
            required
          />
        </div>

        {(type === 'LIMIT' || type === 'STOP_LIMIT') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="50000.00"
              required
            />
          </div>
        )}

        {(type === 'STOP_MARKET' || type === 'STOP_LIMIT') && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Stop Price
            </label>
            <input
              type="number"
              step="0.01"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="49000.00"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            side === 'BUY'
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-slate-600'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-slate-600'
          } text-white disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Target className="w-4 h-4" />
              Place {side.toLowerCase()} Order
            </>
          )}
        </button>
      </form>
    </div>
  );
};