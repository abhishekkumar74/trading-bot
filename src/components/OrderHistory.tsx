import React from 'react';
import { Clock, TrendingUp, TrendingDown, X } from 'lucide-react';
import { Order } from '../types/trading';

interface OrderHistoryProps {
  orders: Order[];
  onCancelOrder: (symbol: string, orderId: number) => void;
  isLoading: boolean;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  onCancelOrder,
  isLoading
}) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled': return 'text-green-400';
      case 'partially_filled': return 'text-yellow-400';
      case 'canceled': return 'text-red-400';
      case 'new': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Open Orders</h2>
        <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs">
          {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No open orders</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-slate-700 rounded-lg p-4 border border-slate-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {order.side === 'BUY' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className="font-medium text-white">{order.symbol}</span>
                  <span className={`text-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                {order.status === 'NEW' && (
                  <button
                    onClick={() => onCancelOrder(order.symbol, order.orderId)}
                    disabled={isLoading}
                    className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Cancel Order"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">Type:</span>
                  <p className="text-white">{order.type}</p>
                </div>
                <div>
                  <span className="text-slate-400">Quantity:</span>
                  <p className="text-white">{order.origQty}</p>
                </div>
                <div>
                  <span className="text-slate-400">Price:</span>
                  <p className="text-white">{order.price || 'Market'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Filled:</span>
                  <p className="text-white">
                    {order.executedQty} / {order.origQty}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                Created: {formatTime(order.time)}
                {order.updateTime !== order.time && (
                  <span className="ml-4">
                    Updated: {formatTime(order.updateTime)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};