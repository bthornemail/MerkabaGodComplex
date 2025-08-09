const ethers = require('ethers');

/**
 * Task Class
 * Represents a single task with an objective that can be verified by a delegate.
 */
class Task {
  constructor(objective, weight = 1, score = 0) {
    this.objective = objective;
    this.isCompleted = false;
    this.delegateSignature = null;
    this.weight = weight;
    this.score = score;
  }
  // ... (other methods)
}

module.exports = Task;
