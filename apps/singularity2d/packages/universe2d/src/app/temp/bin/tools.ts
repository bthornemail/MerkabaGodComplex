export type TOOL_FUNCTION = {
  name: string;
  description: string;
  parameters: {
    [key: string]: any;
  }
}
export type EVENTS = Map<string,(params: any)=>string>;

export type TOOL = {
  type: "function",
  function: TOOL_FUNCTION
}
export const tools: TOOL[] = [
  {
    type: "function",
    function: {
      name: "createContentNode",
      description: "Create random content node",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Name of a document, asset or service",
          },
          summary: {
            type: "string",
            description:
              "short description of a document, asset or service",
          },
          description: {
            type: "string",
            description:
              "long description of a document, asset or service",
          },
          datetime: {
            type: "string",
            description:
              "date and time of a document, asset or service created in ISO string",
          },
          author: {
            type: "string",
            description: "author of a document, asset or service",
          },
          images: {
            type: "string",
            description: "image of a document, asset or service",
          },
          tags: {
            type: "array",
            description:
              "relevant tags of a document, asset or service",
            enum: ["tags"],
          },
          keywords: {
            type: "array",
            description:
              "relevant keywords of a document, asset or service",
            enum: ["keywords"],
          },
          content: {
            type: "string",
            description: "frontmatter string of fields that are used",
          },
        },
        required: ["title", "content"],
      },
    }
  },
]
export default class Tools {
  tools: TOOL[] = tools;
  events: EVENTS =  new Map()
  run(name: string,attributes: any) {
    if(!this.events.has(name))return;
    return this.events.get(name)!(attributes);
  };
  get(name?: string) {
    return name ? this.tools.filter((tool)=>tool.function.name === name) : this.tools;
  };
  list() {
    return this.tools.map((tool) => tool.function.name)
  };
}