import React from 'react';

export function Map({ mapData, isVerifierView }) {
  if (!mapData) {
    return (
      <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, border: '2px dashed currentColor', borderRadius: '8px', fontSize: '0.9rem', fontStyle: 'italic' }}>
        Map Uninitialized
      </div>
    );
  }
  
  const { width, height } = mapData.gridSize;
  const cells = [];
  
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

      let text = '';
      let cellTypeClass = '';

      if (isVerifierView && !isStart && !isGoal) {
        cellTypeClass = 'hidden';
        text = '•';
      } else {
        if (isStart) { cellTypeClass = 'start'; text = 'S'; }
        else if (isGoal) { cellTypeClass = 'goal'; text = 'G'; }
        else if (trap) { cellTypeClass = 'trap'; text = 'T'; }
        else if (path) { cellTypeClass = 'path'; text = '✓'; }
      }

      cells.push(<div key={`${x}-${y}`} className={`map-cell ${cellTypeClass}`}>{text}</div>);
    }
  }

  return (
    <div className={`map-grid ${isVerifierView ? 'map-ver' : 'map-obs'}`}>
      {cells}
    </div>
  );
}
