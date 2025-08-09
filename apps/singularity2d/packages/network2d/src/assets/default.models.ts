export default new Map([
    ["llama3.2:1b", {
      modelfile: `FROM llama3.2:1b
SYSTEM """
You are a code generator. Based on a TypeScript interface and a JSON input, create a React component that:
- Uses the interface for typing.
- Displays the JSON data using that interface.
- Uses Bootstrap CSS for styling.
- Exports as a '.tsx' file.
"""`,
      system: `
SYSTEM """
You are a code generator. Based on a TypeScript interface and a JSON input, create a React component that:
- Uses the interface for typing.
- Displays the JSON data using that interface.
- Uses Bootstrap CSS for styling.
- Exports a pure react component as a '.tsx' file.
- Respond in emacs org-mode syntax
"""`,
      prompt: (jsonData: any, interfaceDef: any) => `
  Here is a TypeScript interface:
  
  ${interfaceDef}
  
  Here is the JSON data:
  
  ${JSON.stringify(jsonData, null, 2)}
  
  Create a React component that:
  - Uses the interface.
  - Renders the data.
  - Uses Bootstrap CSS.
  - Exports as default.
  `
    }]
  ])