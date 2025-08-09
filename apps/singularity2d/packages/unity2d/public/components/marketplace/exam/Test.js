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
  
  /**
   * Add an answer to the test.
   * @param {Answer} answer - The answer to add.
   * @param {number} weight - The weight of the question for this answer.
   */
  addAnswer(answer, weight) {
    this.answers.push({ answer, weight });
    this.calculateTotalScore();
  }

  /**
   * Sign an answer using cryptographic functions.
   * @param {Answer} answer - The answer to sign.
   */
  signAnswer(answer) {
    // For demonstration, adding a "signed" flag to the answer
    answer.signed = true;
  }

  /**
   * Verify the signature of an answer.
   * @param {Answer} answer - The answer to verify.
   * @return {boolean} - True if the signature is valid, false otherwise.
   */
  verifyAnswer(answer) {
    return answer.signed === true;
  }

  /**
   * Calculate the total score based on weighted scores of each question.
   */
  calculateTotalScore() {
    let total = 0;
    for (const { answer, weight } of this.answers) {
      total += answer.score * weight;
    }
    this.totalScore = total;
  }

}

module.exports = Test;
