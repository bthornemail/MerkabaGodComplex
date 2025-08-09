const ethers = require('ethers');
const Test = require('./Test');
const Task = require('./Task');

/**
 * Exam Class
 * Represents an exam consisting of a test and a task.
 */
class Exam {
  constructor(test, task) {
    this.test = test;
    this.task = task;
    this.cids = [];
  }
  
  /**
   * Save the current state of the exam using Helia.
   */
  async saveState() {
    const state = {
      test: this.test,
      task: this.task
    };
    const cid = await d.add(state);
    this.cids.push(cid);
    return cid;
  }

  /**
   * Load a previously saved state of the exam using a CID and Helia.
   * @param {string} cid - The Content ID (CID) of the saved state.
   */
  async loadState(cid) {
    const state = await d.get(cid);
    this.test = state.test;
    this.task = state.task;
  }

  /**
   * Determine if the exam is passed or failed.
   * @return {boolean} - True if passed, false otherwise.
   */
  isPassed() {
    return this.test.isCompleted && this.task.isCompleted;
  }

}

module.exports = Exam;
