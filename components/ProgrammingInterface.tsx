'use client';

import { useState } from 'react';
import { Code, Play, Save, FileCode, Wand2 } from 'lucide-react';

type ProgramMode = 'blocks' | 'natural' | 'iec';

export default function ProgrammingInterface() {
  const [mode, setMode] = useState<ProgramMode>('blocks');
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleGenerate = () => {
    setGeneratedCode(`// Generated from: "${naturalLanguage}"
PROGRAM MainControl
  VAR
    Pump_Status : BOOL;
    Flow_Rate : REAL := 85.0;
    Temperature : REAL;
  END_VAR

  IF Temperature > 90.0 THEN
    Pump_Status := FALSE;
    Flow_Rate := 0.0;
  ELSIF Temperature < 60.0 THEN
    Flow_Rate := 75.0;
    Pump_Status := TRUE;
  ELSE
    Pump_Status := TRUE;
  END_IF;
END_PROGRAM`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-950">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Code className="w-6 h-6" />
            Programming Interface
          </h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
              <Play className="w-4 h-4" />
              Run
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('blocks')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'blocks'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Drag & Drop
          </button>
          <button
            onClick={() => setMode('natural')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'natural'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Natural Language
          </button>
          <button
            onClick={() => setMode('iec')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'iec'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            IEC 61131-3
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {mode === 'blocks' && (
          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                Logic Blocks
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['IF/THEN', 'WHILE', 'FOR LOOP', 'TIMER', 'COUNTER', 'COMPARE', 'MATH', 'MOVE'].map(
                  (block) => (
                    <div
                      key={block}
                      draggable
                      className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg cursor-move text-center text-sm font-medium transition-colors"
                    >
                      {block}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-lg min-h-[400px] border-2 border-dashed border-gray-600">
              <p className="text-gray-400 text-center">Drag blocks here to build your logic</p>
              <div className="mt-6 space-y-3">
                <div className="p-3 bg-blue-900/30 border border-blue-500 rounded-lg">
                  <div className="font-medium text-sm">IF Temperature &gt; 90°C</div>
                  <div className="ml-4 mt-2 p-2 bg-gray-800 rounded">
                    <div className="text-sm">THEN Stop Pump</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'natural' && (
          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Natural Language to Code
              </h3>
              <textarea
                value={naturalLanguage}
                onChange={(e) => setNaturalLanguage(e.target.value)}
                placeholder="Describe what you want the system to do... e.g., 'When temperature exceeds 90 degrees, stop the pump and set flow rate to zero'"
                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
              <button
                onClick={handleGenerate}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Wand2 className="w-4 h-4" />
                Generate Code
              </button>
            </div>

            {generatedCode && (
              <div className="glass-panel p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-3">Generated IEC 61131-3 Code</h3>
                <pre className="p-4 bg-gray-900 rounded-lg text-xs overflow-x-auto">
                  <code className="text-green-400">{generatedCode}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {mode === 'iec' && (
          <div className="glass-panel p-4 rounded-lg h-full">
            <h3 className="text-sm font-semibold mb-3">IEC 61131-3 Editor</h3>
            <textarea
              defaultValue={`PROGRAM MainControl
  VAR
    Pump_001_Status : BOOL := TRUE;
    Flow_Rate : REAL := 85.0;
    Temperature : REAL;
    Pressure : REAL;
  END_VAR

  (* Main control logic *)
  IF Temperature > 90.0 THEN
    Pump_001_Status := FALSE;
    Flow_Rate := 0.0;
  ELSIF Temperature < 60.0 THEN
    Flow_Rate := 75.0;
    Pump_001_Status := TRUE;
  ELSE
    Pump_001_Status := TRUE;
  END_IF;

  (* Pressure monitoring *)
  IF Pressure > 160.0 THEN
    Pump_001_Status := FALSE;
  END_IF;
END_PROGRAM`}
              className="w-full h-[500px] px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="mt-3 flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
                Validate Syntax
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
                Format Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
