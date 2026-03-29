/**
 * Verifier Simulation
 * Simulates checking constraints for Zero-Knowledge Verification
 *
 * It generates an environment and checks whether the path meets the requirement
 * without giving away the exact locations to unauthorized elements.
 * 
 * Contributors: Radhika Agrawal (23BCE5021), Anshaditya Sharma (23BRS1204)
 */

// Generate a 4x4 grid with some simulated hidden traps
function simulateEnvironment(customTraps) {
  const defaultTraps = [
    {x: 1, y: 1},
    {x: 2, y: 3},
    {x: 3, y: 0}
  ];

  const traps = customTraps && customTraps.length > 0 ? customTraps : defaultTraps;

  return {
    gridSize: { width: 4, height: 4 },
    start: { x: 0, y: 0 },
    goal: { x: 2, y: 2 },
    traps
  };
}

// BFS pathfinding to find a valid path that avoids traps
function findValidPath(environment) {
  const { gridSize, start, goal, traps } = environment;
  const { width, height } = gridSize;
  
  const trapSet = new Set(traps.map(t => `${t.x},${t.y}`));
  const visited = new Set();
  const queue = [[{ x: start.x, y: start.y }]]; // queue of paths
  
  visited.add(`${start.x},${start.y}`);
  
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ];
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (current.x === goal.x && current.y === goal.y) {
      return path;
    }
    
    for (const dir of directions) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;
      const key = `${nx},${ny}`;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited.has(key) && !trapSet.has(key)) {
        visited.add(key);
        queue.push([...path, { x: nx, y: ny }]);
      }
    }
  }
  
  return null; // No valid path found
}

// Check Constraint: The path must never touch a trap
function validatePathConstraints(path, traps) {
  // We assume the path is an array of coordinates: [{x, y}, {x, y}]
  // Check intersection
  for (const step of path) {
    for (const trap of traps) {
      if (step.x === trap.x && step.y === trap.y) {
        return false; // Constraint Failed: Hit a trap
      }
    }
  }
  return true; // Path avoids traps
}

module.exports = {
  simulateEnvironment,
  validatePathConstraints,
  findValidPath
};
