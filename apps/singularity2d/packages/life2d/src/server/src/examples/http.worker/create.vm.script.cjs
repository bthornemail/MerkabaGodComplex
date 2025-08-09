const vm = require('vm');

function createVMScript(params, runtimeValues) {
  const { name, input, output, code, summary } = params;
  const typeRegistry = {
    'cid1': 'Type1',
    'cid2': 'Type2',
    // ... more types ...
  };

  // Resolve CIDs to type names
  const resolveType = (type) => typeRegistry[type] || type;
  const resolvedInputTypes = Array.isArray(input) ? input.map(resolveType) : resolveType(input || '');
  const resolvedOutputTypes = Array.isArray(output) ? output.map(resolveType) : resolveType(output || '');

  // Construct the function declaration
  const inputParams = Array.isArray(resolvedInputTypes) ? resolvedInputTypes : [resolvedInputTypes];
  const functionParams = inputParams.map((_, index) => `param${index}`).join(', ');

  // Construct the function declaration with async if needed
  const isAsync = code.includes('await');
  const functionDeclaration = isAsync
    ? `async function ${name}(${functionParams}) {\n${code}\n}`
    : `function ${name}(${functionParams}) {\n${code}\n}`;

  // Construct the function call with runtime values
  const runtimeValuesString = runtimeValues.map(value => {
    if (typeof value === 'object' || Array.isArray(value)) {
      return `JSON.parse('${JSON.stringify(value).replace(/'/g, "\\'").replace(/\n/g, '\\n')}')`;
    } else {
      return JSON.stringify(value);
    }
  }).join(', ');
  const functionCall = `${name}(${runtimeValuesString});`;

  // Combine everything into a script
  const scriptContent = `${functionDeclaration}\n\n${functionCall}`;
  // console.log('scriptContent', scriptContent)
  const script = isAsync
    ? new vm.Script(`(async () => { ${scriptContent} })()`, { filename: name })
    : new vm.Script(scriptContent, { filename: name });
  return script;
}

module.exports = createVMScript;
