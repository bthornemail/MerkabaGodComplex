const ethers = require('ethers');

/**
 * Answer Class
 * Represents an individual answer with its associated metadata.
 */
class Answer {
  constructor(id, answer, score, weight) {
    this.id = id;
    this.answer = answer;
    this.score = score;
    this.weight = weight;
    this.signature = null;
  }
  
  /**
   * Sign the answer using cryptographic functions.
   */
  sign() {
    // For demonstration, adding a "signed" flag to the signature
    this.signature = "signed";
  }

  /**
   * Verify the signature of the answer.
   * @return {boolean} - True if the signature is valid, false otherwise.
   */
  verify() {
    return this.signature === "signed";
  }

}

module.exports = Answer;
