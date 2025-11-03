'use client';

import { useState } from 'react';
import { Network, Server, Cpu, Database, Wifi, HardDrive } from 'lucide-react';

interface AssetNode {
  id: string;
  name: string;
  type: 'controller' | 'sensor' | 'actuator' | 'network' | 'database';
  status: 'online' | 'offline' | 'warning';
  connections: string[];
  metrics: {
    cpu?: number;
    memory?: number;
    uptime?: number;
    latency?: number;
  };
}

const mockNodes: AssetNode[] = [
  {
    id: 'ctrl-main',
    name: 'Main Controller',
    type: 'controller',
    status: 'online',
    connections: ['sensor-temp', 'sensor-pressure', 'pump-001'],
    metrics: { cpu: 45, memory: 62, uptime: 99.8 },
  },
  {
    id: 'sensor-temp',
    name: 'Temperature Sensor A',
    type: 'sensor',
    status: 'online',
    connections: ['ctrl-main'],
    metrics: { latency: 12 },
  },
  {
    id: 'sensor-pressure',
    name: 'Pressure Sensor B',
    type: 'sensor',
    status: 'warning',
    connections: ['ctrl-main'],
    metrics: { latency: 45 },
  },
  {
    id: 'pump-001',
    name: 'Main Pump',
    type: 'actuator',
    status: 'online',
    connections: ['ctrl-main', 'valve-001'],
    metrics: { uptime: 98.5 },
  },
  {
    id: 'valve-001',
    name: 'Control Valve',
    type: 'actuator',
    status: 'online',
    connections: ['pump-001'],
    metrics: { uptime: 99.2 },
  },
  {
    id: 'network-hub',
    name: 'Network Hub',
    type: 'network',
    status: 'online',
    connections: ['ctrl-main', 'db-main'],
    metrics: { latency: 5 },
  },
  {
    id: 'db-main',
    name: 'Main Database',
    type: 'database',
    status: 'online',
    connections: ['network-hub'],
    metrics: { cpu: 28, memory: 71 },
  },
];

interface AssetGraphProps {
  selectedAsset: string | null;
  onSelectAsset: (id: string) => void;
}

export default function AssetGraph({ selectedAsset, onSelectAsset }: AssetGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getIcon = (type: AssetNode['type']) => {
    switch (type) {
      case 'controller':
        return <Cpu className="w-5 h-5" />;
      case 'sensor':
        return <Server className="w-5 h-5" />;
      case 'actuator':
        return <HardDrive className="w-5 h-5" />;
      case 'network':
        return <Wifi className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: AssetNode['status']) => {
    switch (status) {
      case 'online':
        return 'border-green-500 bg-green-500/10';
      case 'warning':
        return 'border-amber-500 bg-amber-500/10';
      case 'offline':
        return 'border-red-500 bg-red-500/10';
    }
  };

  const selectedNode = mockNodes.find((n) => n.id === selectedAsset);

  return (
    <div className="w-full h-full flex bg-gray-950">
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Network className="w-7 h-7" />
            Unified Asset Graph
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Real-time network topology and asset relationships
          </p>
        </div>

        <div className="relative min-h-[600px]">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {mockNodes.map((node) =>
              node.connections.map((targetId) => {
                const target = mockNodes.find((n) => n.id === targetId);
                if (!target) return null;

                const sourceIndex = mockNodes.indexOf(node);
                const targetIndex = mockNodes.indexOf(target);

                const sourceX = 150 + (sourceIndex % 3) * 300;
                const sourceY = 100 + Math.floor(sourceIndex / 3) * 200;
                const targetX = 150 + (targetIndex % 3) * 300;
                const targetY = 100 + Math.floor(targetIndex / 3) * 200;

                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={sourceX}
                    y1={sourceY}
                    x2={targetX}
                    y2={targetY}
                    stroke="rgba(59, 130, 246, 0.3)"
                    strokeWidth="2"
                  />
                );
              })
            )}
          </svg>

          <div className="relative" style={{ zIndex: 1 }}>
            {mockNodes.map((node, index) => {
              const x = (index % 3) * 300;
              const y = Math.floor(index / 3) * 200;

              return (
                <div
                  key={node.id}
                  className={`absolute glass-panel p-4 rounded-lg cursor-pointer transition-all ${getStatusColor(
                    node.status
                  )} ${
                    selectedAsset === node.id ? 'ring-2 ring-blue-500 scale-105' : ''
                  } hover:scale-105`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: '250px',
                  }}
                  onClick={() => onSelectAsset(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(node.status)}`}>
                      {getIcon(node.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{node.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{node.type}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {node.metrics.cpu !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPU</span>
                        <span className="font-mono">{node.metrics.cpu}%</span>
                      </div>
                    )}
                    {node.metrics.memory !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Memory</span>
                        <span className="font-mono">{node.metrics.memory}%</span>
                      </div>
                    )}
                    {node.metrics.uptime !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Uptime</span>
                        <span className="font-mono">{node.metrics.uptime}%</span>
                      </div>
                    )}
                    {node.metrics.latency !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Latency</span>
                        <span className="font-mono">{node.metrics.latency}ms</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-400">
                      {node.connections.length} connection{node.connections.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedNode && (
        <div className="w-80 glass-panel border-l border-gray-700 p-6 overflow-auto">
          <h3 className="text-lg font-semibold mb-4">Asset Details</h3>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Asset ID</div>
              <div className="font-mono text-sm">{selectedNode.id}</div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Name</div>
              <div className="font-semibold">{selectedNode.name}</div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Type</div>
              <div className="capitalize">{selectedNode.type}</div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Status</div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedNode.status === 'online'
                      ? 'bg-green-500'
                      : selectedNode.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="capitalize">{selectedNode.status}</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-2">Connected Assets</div>
              <div className="space-y-2">
                {selectedNode.connections.map((connId) => {
                  const connNode = mockNodes.find((n) => n.id === connId);
                  if (!connNode) return null;
                  return (
                    <div
                      key={connId}
                      className="flex items-center gap-2 p-2 bg-gray-800/50 rounded text-sm cursor-pointer hover:bg-gray-700/50"
                      onClick={() => onSelectAsset(connId)}
                    >
                      {getIcon(connNode.type)}
                      <span className="flex-1">{connNode.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-2">Performance Metrics</div>
              <div className="glass-panel p-3 rounded space-y-2 text-sm">
                {Object.entries(selectedNode.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize text-gray-400">{key}</span>
                    <span className="font-mono">
                      {value}
                      {key === 'latency' ? 'ms' : key === 'uptime' ? '%' : key === 'cpu' || key === 'memory' ? '%' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
