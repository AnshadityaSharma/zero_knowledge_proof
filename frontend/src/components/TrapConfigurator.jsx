import React, { useState } from 'react';
import { Crosshair, Shuffle, MapPin, Trash2, Sparkles } from 'lucide-react';

const PRESETS = [
  {
    name: 'Classic',
    traps: [{x:1,y:1},{x:2,y:3},{x:3,y:0}],
    desc: 'Default diagonal trap layout'
  },
  {
    name: 'Corridor',
    traps: [{x:1,y:1},{x:1,y:2},{x:1,y:3}],
    desc: 'Vertical wall blocking column 1'
  },
  {
    name: 'Minefield',
    traps: [{x:1,y:1},{x:3,y:1},{x:1,y:3},{x:3,y:3}],
    desc: 'Four corner traps — tight navigation'
  },
  {
    name: 'Gauntlet',
    traps: [{x:1,y:0},{x:1,y:2},{x:3,y:1},{x:3,y:3}],
    desc: 'Alternating checkerboard pattern'
  },
  {
    name: 'Serpent',
    traps: [{x:1,y:1},{x:2,y:2},{x:3,y:3}],
    desc: 'Diagonal wall from corner to corner'
  },
];

export function TrapConfigurator({ onConfigureTraps, disabled }) {
  const [mode, setMode] = useState('preset'); // 'preset' or 'custom' 
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customTraps, setCustomTraps] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const GRID_SIZE = 4;
  const START = {x:0,y:0};
  const GOAL = {x:2,y:2};

  const toggleCell = (x, y) => {
    if ((x === START.x && y === START.y) || (x === GOAL.x && y === GOAL.y)) return;
    
    const exists = customTraps.findIndex(t => t.x === x && t.y === y);
    if (exists >= 0) {
      setCustomTraps(prev => prev.filter((_, i) => i !== exists));
    } else {
      if (customTraps.length >= 6) return; // Max 6 traps
      setCustomTraps(prev => [...prev, {x, y}]);
    }
  };

  const generateRandom = () => {
    const traps = [];
    const forbidden = [`${START.x},${START.y}`, `${GOAL.x},${GOAL.y}`];
    const count = 2 + Math.floor(Math.random() * 3); // 2-4 traps
    while (traps.length < count) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      const key = `${x},${y}`;
      if (!forbidden.includes(key) && !traps.find(t => t.x === x && t.y === y)) {
        traps.push({x, y});
      }
    }
    setCustomTraps(traps);
  };

  const applyConfig = () => {
    const traps = mode === 'preset' ? PRESETS[selectedPreset].traps : customTraps;
    if (traps.length === 0) return;
    onConfigureTraps(traps);
    setIsOpen(false);
  };

  const currentTraps = mode === 'preset' ? PRESETS[selectedPreset].traps : customTraps;

  const isTrap = (x, y) => currentTraps.some(t => t.x === x && t.y === y);

  return (
    <div className="trap-configurator">
      <button 
        className="trap-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Crosshair size={16} />
        <span>Configure Traps</span>
        <span className={`trap-chevron ${isOpen ? 'open' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="trap-panel glass-panel">
          {/* Mode Selector */}
          <div className="trap-mode-tabs">
            <button 
              className={`trap-tab ${mode === 'preset' ? 'active' : ''}`}
              onClick={() => setMode('preset')}
            >
              <Sparkles size={14}/> Presets
            </button>
            <button 
              className={`trap-tab ${mode === 'custom' ? 'active' : ''}`}
              onClick={() => setMode('custom')}
            >
              <MapPin size={14}/> Custom
            </button>
          </div>

          {mode === 'preset' ? (
            <div className="trap-presets">
              {PRESETS.map((p, idx) => (
                <button 
                  key={p.name}
                  className={`trap-preset-btn ${selectedPreset === idx ? 'selected' : ''}`}
                  onClick={() => setSelectedPreset(idx)}
                >
                  <span className="preset-name">{p.name}</span>
                  <span className="preset-desc">{p.desc}</span>
                  <span className="preset-count">{p.traps.length} traps</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="trap-custom">
              <p className="trap-hint">Click cells to place/remove traps (max 6). Start and Goal are locked.</p>
              <div className="trap-controls-row">
                <button className="trap-action-btn" onClick={generateRandom}>
                  <Shuffle size={14}/> Random
                </button>
                <button className="trap-action-btn" onClick={() => setCustomTraps([])}>
                  <Trash2 size={14}/> Clear
                </button>
              </div>
              <div className="trap-grid-editor">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
                  const x = idx % GRID_SIZE;
                  const y = Math.floor(idx / GRID_SIZE);
                  const isStart = x === START.x && y === START.y;
                  const isGoal = x === GOAL.x && y === GOAL.y;
                  const trap = isTrap(x, y);
                  
                  let cls = 'trap-cell';
                  if (isStart) cls += ' cell-start';
                  else if (isGoal) cls += ' cell-goal';
                  else if (trap) cls += ' cell-trap';
                  
                  return (
                    <div 
                      key={idx} 
                      className={cls}
                      onClick={() => mode === 'custom' && toggleCell(x, y)}
                    >
                      {isStart ? 'S' : isGoal ? 'G' : trap ? '💀' : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Preview */}
          <div className="trap-preview">
            <div className="trap-preview-label">Live Preview</div>
            <div className="trap-preview-grid">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
                const x = idx % GRID_SIZE;
                const y = Math.floor(idx / GRID_SIZE);
                const isStart = x === START.x && y === START.y;
                const isGoal = x === GOAL.x && y === GOAL.y;
                const trap = isTrap(x, y);
                
                let cls = 'trap-preview-cell';
                if (isStart) cls += ' pv-start';
                else if (isGoal) cls += ' pv-goal';
                else if (trap) cls += ' pv-trap';

                return <div key={idx} className={cls} />;
              })}
            </div>
          </div>

          <button className="trap-apply-btn" onClick={applyConfig}>
            Apply Configuration ({currentTraps.length} traps)
          </button>
        </div>
      )}
    </div>
  );
}
