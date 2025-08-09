import Graph from 'graphology';
import { Attributes } from 'graphology-types';

// Define the types of nodes in the Org mode document graph
export type OrgNodeType =
  | 'Document'
  | 'Heading'
  | 'Title'
  | 'Tags'
  | 'Properties'
  | 'Property'
  | 'Content'
  | 'List'
  | 'UnorderedListItem'
  | 'OrderedListItem'
  | 'DescriptionListItem'
  | 'Block'
  | 'SourceBlock'
  | 'QuoteBlock'
  | 'ExampleBlock'
  | 'CenterBlock'
  | 'Table'
  | 'TableRow'
  | 'TableCell'
  | 'Link'
  | 'InternalLink'
  | 'ExternalLink'
  | 'FileLink'
  | 'Footnote'
  | 'FootnoteDefinition'
  | 'FootnoteReference'
  | 'Timestamp'
  | 'ActiveTimestamp'
  | 'InactiveTimestamp'
  | 'Comment'
  | 'LineComment'
  | 'BlockComment'
  | 'Macro'
  | 'InlineMacro'
  | 'BlockMacro';

// Define the attributes for each node type
export interface OrgNodeAttributes extends Attributes {
  type: OrgNodeType;
  level?: number; // For headings (e.g., level 1, level 2, etc.)
  text?: string; // For titles, content, list items, etc.
  tags?: string[]; // For headings
  key?: string; // For properties
  value?: string; // For properties
  language?: string; // For source blocks
  url?: string; // For links
  timestamp?: string; // For timestamps
}

// Define the graph type for the Org mode document
export interface OrgDocumentGraph extends Graph<OrgNodeAttributes> {
  // Add any custom methods or properties if needed
}

// Example usage
const orgGraph: OrgDocumentGraph = new Graph();

// Add nodes to the graph
orgGraph.addNode('document', { type: 'Document' });
orgGraph.addNode('heading1', { type: 'Heading', level: 1, text: 'Main Heading' });
orgGraph.addNode('title1', { type: 'Title', text: 'Main Heading' });
orgGraph.addNode('content1', { type: 'Content', text: 'This is the content of the main heading.' });

// Add edges to represent relationships
orgGraph.addEdge('document', 'heading1');
orgGraph.addEdge('heading1', 'title1');
orgGraph.addEdge('heading1', 'content1');

// Add a list under the heading
orgGraph.addNode('list1', { type: 'List' });
orgGraph.addNode('unorderedItem1', { type: 'UnorderedListItem', text: 'First item' });
orgGraph.addNode('unorderedItem2', { type: 'UnorderedListItem', text: 'Second item' });

orgGraph.addEdge('heading1', 'list1');
orgGraph.addEdge('list1', 'unorderedItem1');
orgGraph.addEdge('list1', 'unorderedItem2');

// Add a source block
orgGraph.addNode('sourceBlock1', {
  type: 'SourceBlock',
  language: 'typescript',
  text: 'console.log("Hello, Org mode!");',
});
orgGraph.addEdge('content1', 'sourceBlock1');