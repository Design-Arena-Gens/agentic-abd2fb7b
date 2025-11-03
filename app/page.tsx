'use client';

import { useState } from 'react';
import DynamicProcessCanvas from '@/components/DynamicProcessCanvas';
import ControlPanel from '@/components/ControlPanel';
import ProgrammingInterface from '@/components/ProgrammingInterface';
import AssetGraph from '@/components/AssetGraph';
import AIAssistant from '@/components/AIAssistant';
import Diagnostics from '@/components/Diagnostics';
import Header from '@/components/Header';

type ViewMode = 'canvas' | 'programming' | 'assets' | 'diagnostics';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Header viewMode={viewMode} setViewMode={setViewMode} />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 relative">
          {viewMode === 'canvas' && (
            <DynamicProcessCanvas
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
            />
          )}
          {viewMode === 'programming' && <ProgrammingInterface />}
          {viewMode === 'assets' && (
            <AssetGraph
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
            />
          )}
          {viewMode === 'diagnostics' && <Diagnostics />}
        </main>

        <aside className="w-80 glass-panel border-l border-gray-700 flex flex-col">
          <ControlPanel selectedAsset={selectedAsset} />
          <AIAssistant />
        </aside>
      </div>
    </div>
  );
}
