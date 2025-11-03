'use client';

import { Cpu, Code, Network, Activity, Zap } from 'lucide-react';

type ViewMode = 'canvas' | 'programming' | 'assets' | 'diagnostics';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export default function Header({ viewMode, setViewMode }: HeaderProps) {
  const navItems = [
    { id: 'canvas' as ViewMode, icon: Cpu, label: 'Process Canvas' },
    { id: 'programming' as ViewMode, icon: Code, label: 'Programming' },
    { id: 'assets' as ViewMode, icon: Network, label: 'Asset Graph' },
    { id: 'diagnostics' as ViewMode, icon: Activity, label: 'Diagnostics' },
  ];

  return (
    <header className="h-16 glass-panel border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center glow">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Axiom HMI</h1>
          <p className="text-xs text-gray-400">Industrial Automation Platform</p>
        </div>
      </div>

      <nav className="flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = viewMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white glow'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-600/50 rounded-lg glow-green">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400 font-medium">All Systems Operational</span>
        </div>
      </div>
    </header>
  );
}
