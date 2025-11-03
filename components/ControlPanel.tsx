'use client';

import { useState } from 'react';
import { Gauge, Thermometer, Activity, Zap, Power, PlayCircle, PauseCircle } from 'lucide-react';

interface ControlPanelProps {
  selectedAsset: string | null;
}

export default function ControlPanel({ selectedAsset }: ControlPanelProps) {
  const [isRunning, setIsRunning] = useState(true);
  const [power, setPower] = useState(75);
  const [flowRate, setFlowRate] = useState(85);

  return (
    <div className="p-4 border-b border-gray-700 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Control Panel</h2>
        {selectedAsset && (
          <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
            {selectedAsset}
          </span>
        )}
      </div>

      {!selectedAsset && (
        <div className="text-sm text-gray-400 text-center py-8">
          Select an asset to view controls
        </div>
      )}

      {selectedAsset && (
        <>
          <div className="space-y-3">
            <div className="glass-panel p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <div className="text-2xl font-bold">72°C</div>
              <div className="text-xs text-gray-400 mt-1">Normal range: 60-80°C</div>
            </div>

            <div className="glass-panel p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Pressure</span>
              </div>
              <div className="text-2xl font-bold">145 PSI</div>
              <div className="text-xs text-gray-400 mt-1">Normal range: 120-160 PSI</div>
            </div>

            <div className="glass-panel p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Flow Rate</span>
              </div>
              <div className="text-2xl font-bold">{flowRate}%</div>
              <input
                type="range"
                min="0"
                max="100"
                value={flowRate}
                onChange={(e) => setFlowRate(Number(e.target.value))}
                className="w-full mt-2 accent-blue-600"
              />
            </div>

            <div className="glass-panel p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Power Level</span>
              </div>
              <div className="text-2xl font-bold">{power}%</div>
              <input
                type="range"
                min="0"
                max="100"
                value={power}
                onChange={(e) => setPower(Number(e.target.value))}
                className="w-full mt-2 accent-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <PauseCircle className="w-5 h-5" />
                  Stop Asset
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  Start Asset
                </>
              )}
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors">
              <Power className="w-5 h-5" />
              Emergency Stop
            </button>
          </div>

          <div className="glass-panel p-3 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Quick Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime</span>
                <span className="font-mono">247.5 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Efficiency</span>
                <span className="font-mono text-green-400">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Maintenance</span>
                <span className="font-mono">12 days ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="font-mono text-green-400">Optimal</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
