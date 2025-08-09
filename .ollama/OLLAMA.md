# OLLAMA.md

This file outlines the status and development plans for Ollama integrations within the Universal Life Protocol / MerkabaGodComplex repository.

## Current Status

The **MGC Agent Network**, implemented in `live.ts`, is the primary component utilizing Ollama.

-   **Functionality**: The system is designed as a multi-layer daemon network to process questions.
-   **Layer 2 (LLM Domain)**: Daemons with IDs 8-14 are specifically designated to process questions using various models available through a local Ollama instance.
-   **Implementation**: The `live.ts` script contains the logic for invoking these daemons and passing data to them for processing.

## Development & Monitoring

This folder is intended to track the development and performance of Ollama-based integrations.

### 1. Integration Monitoring
-   **Model Performance**: Track the effectiveness of different Ollama models (e.g., Llama3, Mistral, etc.) for the tasks assigned to Layer 2 daemons.
-   **Response Quality**: Log and evaluate the quality of responses generated for various prompts.
-   **Error Handling**: Document common errors and failures in the interaction between the `live.ts` script and the Ollama API.

### 2. Future Development
-   **Expanded Use**: Explore using Ollama for other tasks within the CUE or AMGF frameworks, such as code generation, logical reasoning, or proposition resolution.
-   **Model Fine-Tuning**: Investigate the possibility of fine-tuning local models on the project's extensive documentation for more context-aware responses.
-   **Tool Integration**: Develop more sophisticated tool-use capabilities for the Ollama agents, allowing them to interact with other parts of the CUE framework directly.

### 3. Development Workflow
-   All new Ollama-related scripts or configurations should be documented here.
-   When running tests, use the `live.ts process-questions` command to trigger the Layer 2 daemons.
-   Log outputs from Ollama interactions to a local file for analysis.

```bash
# Example command to run the Ollama-dependent processing layer
npx ts-node live.ts process-questions
```

This structured approach will help manage the evolution of local LLM integrations within the project.