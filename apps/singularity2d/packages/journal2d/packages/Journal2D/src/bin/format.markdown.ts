import { MATTER } from "../App";

export function formatMD({ attributes, body }: MATTER) {
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
  
  ${body}`
  }