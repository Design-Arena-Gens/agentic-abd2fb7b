'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ZoomIn, ZoomOut, RotateCw, Thermometer, Activity, Wind } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  position: [number, number, number];
  type: 'pump' | 'valve' | 'tank' | 'sensor' | 'motor';
  temperature: number;
  pressure: number;
  flow: number;
  status: 'operational' | 'warning' | 'critical';
}

const mockAssets: Asset[] = [
  { id: 'pump-001', name: 'Main Pump', position: [-5, 0, 0], type: 'pump', temperature: 72, pressure: 145, flow: 85, status: 'operational' },
  { id: 'valve-001', name: 'Control Valve A', position: [-2, 0, -2], type: 'valve', temperature: 68, pressure: 140, flow: 75, status: 'operational' },
  { id: 'tank-001', name: 'Storage Tank 1', position: [2, 1, 0], type: 'tank', temperature: 65, pressure: 50, flow: 0, status: 'operational' },
  { id: 'sensor-001', name: 'Temp Sensor A', position: [0, 2, 2], type: 'sensor', temperature: 85, pressure: 100, flow: 0, status: 'warning' },
  { id: 'motor-001', name: 'Drive Motor', position: [5, 0, 0], type: 'motor', temperature: 95, pressure: 0, flow: 0, status: 'critical' },
];

function Asset3D({
  asset,
  onClick,
  isSelected,
}: {
  asset: Asset;
  onClick: () => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && asset.type === 'pump') {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getColor = () => {
    if (isSelected) return '#3b82f6';
    if (asset.status === 'critical') return '#ef4444';
    if (asset.status === 'warning') return '#f59e0b';
    return '#22c55e';
  };

  const getGeometry = () => {
    switch (asset.type) {
      case 'pump':
      case 'motor':
        return <Box args={[1, 1, 1]} />;
      case 'valve':
        return <Box args={[0.5, 1.5, 0.5]} />;
      case 'tank':
        return <Box args={[1.5, 2, 1.5]} />;
      case 'sensor':
        return <Sphere args={[0.4, 16, 16]} />;
    }
  };

  return (
    <group position={asset.position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={isSelected || hovered ? 0.5 : 0.2}
        />
      </mesh>
      <Text
        position={[0, asset.type === 'tank' ? 2.5 : 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {asset.name}
      </Text>
      {(hovered || isSelected) && (
        <Text
          position={[0, asset.type === 'tank' ? 2.8 : 1.8, 0]}
          fontSize={0.15}
          color="#888"
          anchorX="center"
          anchorY="middle"
        >
          {`${asset.temperature}°C | ${asset.pressure}psi`}
        </Text>
      )}
    </group>
  );
}

function FlowLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color="#3b82f6" linewidth={2} />
    </line>
  );
}

function Scene({
  selectedAsset,
  onSelectAsset,
}: {
  selectedAsset: string | null;
  onSelectAsset: (id: string) => void;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} />
      <OrbitControls enableDamping dampingFactor={0.05} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <gridHelper args={[20, 20, '#334155', '#1e293b']} />

      {mockAssets.map((asset) => (
        <Asset3D
          key={asset.id}
          asset={asset}
          onClick={() => onSelectAsset(asset.id)}
          isSelected={selectedAsset === asset.id}
        />
      ))}

      <FlowLine start={[-5, 0, 0]} end={[-2, 0, -2]} />
      <FlowLine start={[-2, 0, -2]} end={[2, 1, 0]} />
      <FlowLine start={[2, 1, 0]} end={[5, 0, 0]} />
    </>
  );
}

interface DynamicProcessCanvasProps {
  selectedAsset: string | null;
  onSelectAsset: (id: string) => void;
}

export default function DynamicProcessCanvas({
  selectedAsset,
  onSelectAsset,
}: DynamicProcessCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showThermal, setShowThermal] = useState(true);
  const [showFlow, setShowFlow] = useState(true);

  return (
    <div className="relative w-full h-full bg-gray-950">
      <Canvas>
        <Suspense fallback={null}>
          <Scene selectedAsset={selectedAsset} onSelectAsset={onSelectAsset} />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 left-4 glass-panel p-4 rounded-lg space-y-2">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Process View Controls</h3>

        <button
          onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 3))}
          className="flex items-center gap-2 w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded text-sm transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
          Zoom In
        </button>

        <button
          onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))}
          className="flex items-center gap-2 w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded text-sm transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
          Zoom Out
        </button>

        <button className="flex items-center gap-2 w-full px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded text-sm transition-colors">
          <RotateCw className="w-4 h-4" />
          Reset View
        </button>

        <div className="border-t border-gray-700 pt-2 mt-2 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showThermal}
              onChange={(e) => setShowThermal(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <Thermometer className="w-4 h-4" />
            <span className="text-sm">Thermal Map</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFlow}
              onChange={(e) => setShowFlow(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <Wind className="w-4 h-4" />
            <span className="text-sm">Flow Vectors</span>
          </label>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-lg">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full glow-green" />
            <span>Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full glow-amber" />
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full glow-red" />
            <span>Critical</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 glass-panel p-3 rounded-lg">
        <div className="text-xs space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Zoom:</span>
            <span className="text-white font-mono">{zoomLevel.toFixed(1)}x</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Assets:</span>
            <span className="text-white font-mono">{mockAssets.length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Active:</span>
            <span className="text-green-400 font-mono">
              {mockAssets.filter((a) => a.status === 'operational').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
