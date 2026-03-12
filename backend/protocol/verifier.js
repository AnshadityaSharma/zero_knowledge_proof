/**
 * Verifier Simulation
 * Simulates checking constraints for Zero-Knowledge Verification
 *
 * It generates an environment and checks whether the path meets the requirement
 * without giving away the exact locations to unauthorized elements.
 */

// Generate a 4x4 grid with some simulated hidden traps
function simulateEnvironment() {
  const traps = [
    {x: 1, y: 1},
    {x: 2, y: 3},
    {x: 3, y: 0}
  ];

  return {
    gridSize: { width: 4, height: 4 },
    start: { x: 0, y: 0 },
    goal: { x: 2, y: 2 },
    traps
  };
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
  validatePathConstraints
};
