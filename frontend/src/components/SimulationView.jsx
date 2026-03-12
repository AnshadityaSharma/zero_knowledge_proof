import React from 'react';
import { Map, Lock, EyeOff } from 'lucide-react';

export function SimulationView({ mapData, isVerifierView }) {
  if (!mapData) {
    return (
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Map not generated yet...</p>
      </div>
    );
  }

  const { width, height } = mapData.gridSize;
  const cells = [];
  
  // Create static valid path just for display consistency 
  // (Assuming backend path is 0,0 -> 1,0 -> 2,0 -> 2,1 -> 2,2)
  const isPath = (x, y) => {
    const p = [{x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:2,y:1}, {x:2,y:2}];
    return p.some(step => step.x === x && step.y === y);
  };

  const isTrap = (x, y) => mapData.traps.some(t => t.x === x && t.y === y);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let isStart = x === mapData.start.x && y === mapData.start.y;
      let isGoal = x === mapData.goal.x && y === mapData.goal.y;
      let trap = isTrap(x, y);
      let path = isPath(x, y);

      let cellClass = '';
      let text = '';

      if (isVerifierView && !isStart && !isGoal) {
        // Hide information from Verifier
        cellClass = 'cell-hidden';
        text = '?';
      } else {
        if (isStart) { cellClass = 'cell-start'; text = 'S'; }
        else if (isGoal) { cellClass = 'cell-goal'; text = 'G'; }
        else if (trap) { cellClass = 'cell-trap'; text = 'T'; }
        else if (path) { cellClass = 'cell-path'; text = '✓'; }
      }

      cells.push(
        <div key={`${x}-${y}`} className={`map-cell ${cellClass}`}>
          {text}
        </div>
      );
    }
  }

  return (
    <div className="glass-card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f472b6' }}>
        <Map size={24} /> Environment Map
      </h2>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isVerifierView ? (
          <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <EyeOff size={16} /> Verifier View (Hidden Knowledge)
          </span>
        ) : (
          <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Lock size={16} /> Observer Original Secret Revealed
          </span>
        )}
      </p>

      <div className="map-grid">
        {cells}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: 12, height: 12, background: 'rgba(99, 102, 241, 0.3)', border: '1px solid #6366f1' }}></div> Start</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: 12, height: 12, background: 'rgba(16, 185, 129, 0.3)', border: '1px solid #10b981' }}></div> Goal</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: 12, height: 12, background: 'rgba(239, 68, 68, 0.3)', border: '1px solid #ef4444' }}></div> Trap</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: 12, height: 12, background: 'rgba(192, 132, 252, 0.3)', border: '1px solid #c084fc' }}></div> Path</span>
      </div>
    </div>
  );
}
