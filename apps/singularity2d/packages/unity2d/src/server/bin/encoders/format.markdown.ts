import { FRONT_MATTER } from "../../types/transformer/yaml";

export function formatMD({ attributes, body }: FRONT_MATTER) {
  return `---
  title: "${attributes.title || "New Journal Entry"}"
  identity: ${attributes.identity}
  startDate: "${attributes.startDate}"
  lastEdit: "${new Date().toISOString()}"
  documents:
  - one
  - two
  assets:
  - one
  - two
  services:
  - one
  - two
  ---
  
  ${body}`;
}
export function formatMarkdown(content: string,{ attributes, body }: { attributes?: Record<string, any>; body?: string }) {
  return `---
  ${attributes
      ? Object.entries(attributes)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
      : ""
    }
  
  ---
  ${body ? body : ""}
  `;
};
