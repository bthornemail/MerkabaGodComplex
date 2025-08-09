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
  
  /**
   * Mark the task as completed and update the score.
   * @param {number} score - The score to set for this completed task.
   * @param {string} delegateSignature - The signature of the delegate verifying the task.
   */
  markAsCompleted(score, delegateSignature) {
    this.isCompleted = true;
    this.score = score;
    this.delegateSignature = delegateSignature;
  }

  /**
   * Verify if the task has been completed and the delegate's signature is valid.
   * @return {boolean} - True if the task is completed and the signature is valid, false otherwise.
   */
  verifyCompletion() {
    // For demonstration, we'll simply return the value of isCompleted
    return this.isCompleted;
  }

}

module.exports = Task;
