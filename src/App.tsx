import React, { useEffect } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { ApiSetup } from './components/ApiSetup';
import { OrderForm } from './components/OrderForm';
import { OrderHistory } from './components/OrderHistory';
import { ActivityLog } from './components/ActivityLog';
import { useTrading } from './hooks/useTrading';

function App() {
  const {
    isConnected,
    isTestingConnection,
    orders,
    logs,
    isLoading,
    setCredentials,
    placeOrder,
    cancelOrder,
    refreshOrders,
  } = useTrading();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        refreshOrders();
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [isConnected, refreshOrders]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">Binance Trading Bot</h1>
              <p className="text-sm text-slate-400">Professional Trading Interface</p>
            </div>
          </div>
          
          {isConnected && (
            <button
              onClick={refreshOrders}
              disabled={isLoading}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* API Setup */}
          <ApiSetup
            onCredentialsSet={setCredentials}
            isConnected={isConnected}
            isTestingConnection={isTestingConnection}
          />

          {isConnected && (
            <>
              {/* Trading Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OrderForm onPlaceOrder={placeOrder} isLoading={isLoading} />
                <OrderHistory 
                  orders={orders} 
                  onCancelOrder={cancelOrder}
                  isLoading={isLoading}
                />
              </div>

              {/* Activity Log */}
              <ActivityLog logs={logs} />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 px-6 py-4 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              Professional trading interface for Binance Futures API
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Built with React & TypeScript</span>
              <span>•</span>
              <span>Real-time order management</span>
              <span>•</span>
              <span>Testnet ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;