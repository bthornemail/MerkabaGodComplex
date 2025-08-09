
async function runLambdaModel({
  modelId,
  modelFile,
  userInput,
  ollamaUrl = 'http://localhost:11434/api/generate',
}: {
  modelId: string
  modelFile: LambdaModel
  userInput: Record<string, any>
  ollamaUrl?: string
}) {
  const prompt = `
# Lambda Model: ${modelFile.id}

## Description
${modelFile.description}

## Rules
${JSON.stringify(modelFile.rules, null, 2)}

## Input
${JSON.stringify(userInput, null, 2)}

## Task
Given the above input and rules, generate the appropriate output as JSON.

Respond only with raw JSON.
`;

  const res = await fetch(ollamaUrl, {
    method: 'POST',
    body: JSON.stringify({
      model: modelId,
      prompt,
      stream: false
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const { response } = await res.json();
  return JSON.parse(response);
}