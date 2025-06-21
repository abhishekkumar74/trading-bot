import React, { useState } from 'react';
import { Settings, TestTube, CheckCircle, AlertCircle } from 'lucide-react';
import { ApiCredentials } from '../types/trading';

interface ApiSetupProps {
  onCredentialsSet: (credentials: ApiCredentials) => void;
  isConnected: boolean;
  isTestingConnection: boolean;
}

export const ApiSetup: React.FC<ApiSetupProps> = ({
  onCredentialsSet,
  isConnected,
  isTestingConnection
}) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [testnet, setTestnet] = useState(true);
  const [showForm, setShowForm] = useState(!isConnected);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim() && apiSecret.trim()) {
      onCredentialsSet({ apiKey: apiKey.trim(), apiSecret: apiSecret.trim(), testnet });
      setShowForm(false);
    }
  };

  const connectionStatus = () => {
    if (isTestingConnection) {
      return (
        <div className="flex items-center gap-2 text-yellow-400">
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span>Testing connection...</span>
        </div>
      );
    }
    
    if (isConnected) {
      return (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>Connected to {testnet ? 'Testnet' : 'Mainnet'}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 text-red-400">
        <AlertCircle className="w-4 h-4" />
        <span>Not connected</span>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">API Configuration</h2>
        </div>
        {connectionStatus()}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter your Binance API key"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              API Secret
            </label>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter your Binance API secret"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="testnet"
              checked={testnet}
              onChange={(e) => setTestnet(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="testnet" className="text-sm text-slate-300 flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Use Testnet (Recommended)
            </label>
          </div>

          <button
            type="submit"
            disabled={!apiKey.trim() || !apiSecret.trim() || isTestingConnection}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Connect to Binance API
          </button>
        </form>
      )}

      {isConnected && !showForm && (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            Update API Credentials
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-700">
        <p className="text-xs text-slate-400">
          <strong>Safety Notice:</strong> Always use Testnet for testing. Never share your API credentials. 
          This demo interface stores credentials in memory only.
        </p>
      </div>
    </div>
  );
};