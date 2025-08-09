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
  // ... (other methods)
}

module.exports = Exam;
