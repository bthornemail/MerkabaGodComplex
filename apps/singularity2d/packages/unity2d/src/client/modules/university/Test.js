const ethers = require('ethers');
const Answer = require('./Answer');

/**
 * Test Class
 * Represents a test containing multiple questions and answers.
 */
class Test {
  constructor(weight = 1) {
    this.questions = [];
    this.answers = [];
    this.weight = weight;
    this.totalScore = null;
  }
  // ... (other methods)
}

module.exports = Test;
