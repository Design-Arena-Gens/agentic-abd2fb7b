'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  asset: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    severity: 'critical',
    message: 'Motor-001 temperature exceeds safe threshold',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    asset: 'motor-001',
  },
  {
    id: '2',
    severity: 'warning',
    message: 'Sensor-001 response time degraded',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    asset: 'sensor-001',
  },
  {
    id: '3',
    severity: 'info',
    message: 'Pump-001 maintenance scheduled in 48 hours',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    asset: 'pump-001',
  },
];

const temperatureData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  temp: 65 + Math.random() * 30,
  pressure: 120 + Math.random() * 40,
}));

const efficiencyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}h`,
  efficiency: 85 + Math.random() * 10,
}));

export default function Diagnostics() {
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'efficiency'>('temperature');

  return (
    <div className="w-full h-full flex flex-col bg-gray-950 overflow-auto">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-7 h-7" />
          System Diagnostics
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Real-time monitoring and predictive analytics
        </p>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">System Health</div>
                <div className="text-2xl font-bold text-green-400 mt-1">98.5%</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Active Alerts</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">2</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Efficiency</div>
                <div className="text-2xl font-bold text-blue-400 mt-1">94.2%</div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Uptime</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">247.5h</div>
              </div>
              <Clock className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="glass-panel p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'critical'
                    ? 'bg-red-900/20 border-red-500'
                    : alert.severity === 'warning'
                    ? 'bg-amber-900/20 border-amber-500'
                    : 'bg-blue-900/20 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {alert.severity === 'critical' ? (
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Asset: {alert.asset} • {Math.floor((Date.now() - alert.timestamp.getTime()) / 60000)} minutes ago
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Temperature & Pressure</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Temperature (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Pressure (PSI)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">System Efficiency (24h)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                  name="Efficiency (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Maintenance */}
        <div className="glass-panel p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Predictive Maintenance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Motor-001</div>
              <div className="text-lg font-semibold text-red-400">High Risk</div>
              <div className="text-xs text-gray-400 mt-2">
                Predicted failure in 72 hours
              </div>
              <button className="mt-3 w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors">
                Schedule Maintenance
              </button>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Pump-001</div>
              <div className="text-lg font-semibold text-amber-400">Medium Risk</div>
              <div className="text-xs text-gray-400 mt-2">
                Maintenance due in 2 days
              </div>
              <button className="mt-3 w-full px-3 py-1.5 bg-amber-600 hover:bg-amber-700 rounded text-sm transition-colors">
                View Details
              </button>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Valve-001</div>
              <div className="text-lg font-semibold text-green-400">Low Risk</div>
              <div className="text-xs text-gray-400 mt-2">
                Operating normally
              </div>
              <button className="mt-3 w-full px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                Monitor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
