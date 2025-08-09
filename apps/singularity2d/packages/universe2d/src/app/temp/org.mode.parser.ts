import { writeFileSync } from "fs";

interface OrgNode {
  type: 'document' | 'heading' | 'list' | 'list-item' | 'table' | 'table-row' | 
        'drawer' | 'block' | 'paragraph';
  level?: number;
  title?: string;
  tags?: string[];
  children?: OrgNode[];
  content?: string[];
  items?: OrgNode[];
  rows?: string[][];
  name?: string;
  parameters?: string;
  parent?: OrgNode;
}

class OrgParser {
  private root: OrgNode;
  private current: OrgNode;
  private stack: OrgNode[];
  private listStack: OrgNode[];
  private currentBlock: OrgNode | null;
  private currentDrawer: OrgNode | null;

  constructor() {
    this.root = { type: 'document', children: [] };
    this.current = this.root;
    this.stack = [this.root];
    this.listStack = [];
    this.currentBlock = null;
    this.currentDrawer = null;
  }

  parse(text: string): OrgNode {
    const lines = text.split('\n');

    for (const line of lines) {
      // Skip empty lines
      if (line.trim() === '') continue;

      // Handle blocks and drawers first
      if (this.currentBlock) {
        if (!this.currentBlock.content) this.currentBlock.content = [];
        this.currentBlock.content.push(line);
        if (line.startsWith(`#+END_${this.currentBlock.name}`)) {
          this.currentBlock = null;
        }
        continue;
      }

      if (this.currentDrawer) {
        if (!this.currentDrawer.content) this.currentDrawer.content = [];
        this.currentDrawer.content.push(line);
        if (line.startsWith(':END:')) {
          this.currentDrawer = null;
        }
        continue;
      }

      // Parse headings
      const headingMatch = line.match(/^(\*+)\s+(.*?)(\s+:[^:]+:)?$/);
      if (headingMatch) {
        this.handleHeading(
          headingMatch[1].length,
          headingMatch[2].trim(),
          headingMatch[3]?.trim().split(':').filter(Boolean) || []
        );
        continue;
      }

      // Parse drawers
      const drawerMatch = line.match(/^:([A-Z_]+):$/);
      if (drawerMatch) {
        this.currentDrawer = {
          type: 'drawer',
          name: drawerMatch[1],
          content: []
        };
        if (!this.current.children) this.current.children = [];
        this.current.children.push(this.currentDrawer);
        continue;
      }

      // Parse blocks
      const blockMatch = line.match(/^#\+BEGIN_(\w+)(?:\s+(.*))?$/);
      if (blockMatch) {
        this.currentBlock = {
          type: 'block',
          name: blockMatch[1],
          parameters: blockMatch[2] || '',
          content: [line]
        };
        if (!this.current.children) this.current.children = [];
        this.current.children.push(this.currentBlock);
        continue;
      }

      // Parse lists
      const listMatch = line.match(/^(\s*)([-+*]|\d+[.)])\s+(.*)/);
      if (listMatch) {
        this.handleList(
          listMatch[1].length,
          listMatch[2],
          listMatch[3]
        );
        continue;
      }

      // Parse tables
      if (line.includes('|')) {
        this.handleTable(line);
        continue;
      }

      // Add other content as paragraphs
      if (!this.current.children) this.current.children = [];
      this.current.children.push({
        type: 'paragraph',
        content: [line]
      });
    }

    return this.root;
  }

  private handleHeading(level: number, title: string, tags: string[]) {
    const heading: OrgNode = {
      type: 'heading',
      level,
      title,
      tags,
      children: []
    };

    // Pop the stack until we find the correct parent
    while (this.stack.length > 1 && this.stack[this.stack.length - 1].level! >= level) {
      this.stack.pop();
    }

    const parent = this.stack[this.stack.length - 1];
    if (!parent.children) parent.children = [];
    parent.children.push(heading);
    this.stack.push(heading);
    this.current = heading;
  }

  private handleList(indent: number, marker: string, content: string) {
    const listItem: OrgNode = {
      type: 'list-item',
      content: [content]
    };

    // Calculate list depth based on indentation
    const depth = Math.floor(indent / 2);

    // Pop the list stack until we find the correct parent
    while (this.listStack.length > depth) {
      this.listStack.pop();
    }

    if (!this.listStack.length) {
      const newList: OrgNode = {
        type: 'list',
        items: [listItem]
      };
      if (!this.current.children) this.current.children = [];
      this.current.children.push(newList);
      this.listStack.push(newList);
    } else {
      const currentList = this.listStack[this.listStack.length - 1];
      if (!currentList.items) currentList.items = [];
      currentList.items.push(listItem);
    }
  }

  private handleTable(line: string) {
    const tableRow = line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell);

    if (!this.current || this.current.type !== 'table') {
      const newTable: OrgNode = {
        type: 'table',
        rows: [tableRow]
      };
      if (!this.current.children) this.current.children = [];
      this.current.children.push(newTable);
      this.current = newTable;
    } else {
      if (!this.current.rows) this.current.rows = [];
      this.current.rows.push(tableRow);
    }
  }
}

// Example usage
const orgContent = `
* TODO Top Heading :tag:
** Subheading
- List item 1
  - Sublist item
- List item 2
| A | B |
|-------+-------|
| Table | Data |
#+BEGIN_SRC javascript
console.log("Hello World");
#+END_SRC
:PROPERTIES:
:ID: 123
:END:
`;

const parser = new OrgParser();
const orgTree = parser.parse(orgContent);
console.log(JSON.stringify(orgTree, null, 2));
writeFileSync("/tmp/parsed.org.file.json",JSON.stringify(orgTree, null, 2))
// console.log(orgTree.children[0].children[0].children);
