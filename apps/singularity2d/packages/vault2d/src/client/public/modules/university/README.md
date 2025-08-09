# Exam Verification System

## Overview

This application provides a framework for creating, signing, and verifying tests and tasks within an exam setting. It uses Ethereum's cryptographic functions for signing and verifying data, making it secure and tamper-proof. The system is designed to be extendable and can be integrated with storage solutions like Helia (IPFS-based) for immutable storage of exam states.

## Classes

- `Answer`: Represents an individual answer with metadata such as score and weight.
- `Test`: Represents a test containing multiple questions and answers.
- `Task`: Represents a single task with an objective that can be verified by a delegate.
- `Exam`: Represents an exam consisting of a test and a task.

## Use Cases

### Educational Institutions

1. **Create Tests**: Teachers can create multiple-choice or true/false questions with varying weights and scores.
2. **Sign Answers**: Once a test is taken, answers can be signed cryptographically to ensure they haven't been tampered with.
3. **Task Verification**: Assignments or practical tasks can be verified by a delegate (e.g., lab instructor).
4. **Secure Storage**: The state of the exam can be stored securely and immutably on Helia.

### Corporate Training

1. **Employee Assessment**: Employers can use this system to assess the skills and knowledge of their employees.
2. **Compliance**: Ensure that training materials and assessments meet regulatory requirements by storing them immutably.
3. **Audit Trail**: Maintain a secure and verifiable record of all tests and tasks.

### Certification Providers

1. **Certification Exams**: Easily create and administer exams required for professional certifications.
2. **Verification**: Ensure that only the certified individuals can claim a particular status or title.
3. **Credentialing**: Store credentials in a secure, immutable format that can be verified by third parties.

## How to Run

1. Install dependencies: `npm install`
2. Run your code: `node your-main-file.js`

## Note

This is a simplified example, and you'll need to adapt the storage (`add` and `get` methods) according to your actual implementation.

