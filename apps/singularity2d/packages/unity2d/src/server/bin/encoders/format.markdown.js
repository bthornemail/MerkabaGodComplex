export function formatMD({ attributes, body }) {
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
export function formatMarkdown(content, { attributes, body }) {
    return `---
  ${attributes
        ? Object.entries(attributes)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")
        : ""}
  
  ---
  ${body ? body : ""}
  `;
}
;
//# sourceMappingURL=format.markdown.js.map