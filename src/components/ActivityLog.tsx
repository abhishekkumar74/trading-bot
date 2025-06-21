import React from 'react';
import { Activity, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { LogEntry } from '../types/trading';

interface ActivityLogProps {
  logs: LogEntry[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getTextColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'info': return 'text-blue-300';
      case 'success': return 'text-green-300';
      case 'warning': return 'text-yellow-300';
      case 'error': return 'text-red-300';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-5 h-5 text-orange-400" />
        <h2 className="text-lg font-semibold text-white">Activity Log</h2>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-3">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No activity yet</p>
          </div>
        ) : (
          logs.slice().reverse().map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg border border-slate-600"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${getTextColor(log.type)}`}>
                  {log.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {log.timestamp.toLocaleTimeString()}
                </p>
                {log.details && (
                  <pre className="text-xs text-slate-500 mt-2 bg-slate-800 p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};