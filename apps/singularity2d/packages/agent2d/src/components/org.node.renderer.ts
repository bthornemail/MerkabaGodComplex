import Graph from "graphology";
import { OrgDocumentGraph, OrgNodeAttributes } from "./org.node.graph";

export default class OrgNodeRenderer {
    // Render the entire graph as an Org mode document
    renderGraph(graph: OrgDocumentGraph): string {
      let output = '';
      graph.forEachNode((node, attributes) => {
        if (attributes.type === 'Document') {
          output += this.renderDocument(node, attributes, graph);
        }
      });
      return output;
    }
  
    // Render a Document node
    private renderDocument(node: string, attributes: OrgNodeAttributes, graph: OrgDocumentGraph): string {
      let output = '';
      graph.forEachOutboundEdge(node, (edge, attributes, source, target) => {
        const targetAttributes = graph.getNodeAttributes(target);
        output += this.renderNode(target, targetAttributes, graph);
      });
      return output;
    }
  
    // Render a Heading node
    private renderHeading(node: string, attributes: OrgNodeAttributes, graph: OrgDocumentGraph): string {
      const level = attributes.level || 1;
      const title = this.renderTitle(node, graph);
      const tags = attributes.tags ? ` :${attributes.tags.join(':')}:` : '';
      let content = '';
  
      graph.forEachOutboundEdge(node, (edge, attributes, source, target) => {
        const targetAttributes = graph.getNodeAttributes(target);
        if (targetAttributes.type !== 'Title') {
          content += this.renderNode(target, targetAttributes, graph);
        }
      });
  
      return `${'*'.repeat(level)} ${title}${tags}\n${content}`;
    }
  
    // Render a Title node
    private renderTitle(node: string, graph: OrgDocumentGraph): string {
      const attributes = graph.getNodeAttributes(node);
      return attributes.text || '';
    }
  
    // Render a List node
    private renderList(node: string, attributes: OrgNodeAttributes, graph: OrgDocumentGraph): string {
      let output = '';
      graph.forEachOutboundEdge(node, (edge, attributes, source, target) => {
        const targetAttributes = graph.getNodeAttributes(target);
        output += this.renderNode(target, targetAttributes, graph);
      });
      return output;
    }
  
    // Render an Unordered List Item node
    private renderUnorderedListItem(node: string, attributes: OrgNodeAttributes): string {
      return `- ${attributes.text}\n`;
    }
  
    // Render an Ordered List Item node
    private renderOrderedListItem(node: string, attributes: OrgNodeAttributes): string {
      return `1. ${attributes.text}\n`;
    }
  
    // Render a Description List Item node
    private renderDescriptionListItem(node: string, attributes: OrgNodeAttributes): string {
      return `- ${attributes.text} :: ${attributes.value}\n`;
    }
  
    // Render a Block node
    private renderBlock(node: string, attributes: OrgNodeAttributes): string {
      switch (attributes.type) {
        case 'SourceBlock':
          return this.renderSourceBlock(node, attributes);
        case 'QuoteBlock':
          return this.renderQuoteBlock(node, attributes);
        case 'ExampleBlock':
          return this.renderExampleBlock(node, attributes);
        case 'CenterBlock':
          return this.renderCenterBlock(node, attributes);
        default:
          return '';
      }
    }
  
    // Render a Source Block node
    private renderSourceBlock(node: string, attributes: OrgNodeAttributes): string {
      return `#+BEGIN_SRC ${attributes.language}\n${attributes.text}\n#+END_SRC\n`;
    }
  
    // Render a Quote Block node
    private renderQuoteBlock(node: string, attributes: OrgNodeAttributes): string {
      return `#+BEGIN_QUOTE\n${attributes.text}\n#+END_QUOTE\n`;
    }
  
    // Render an Example Block node
    private renderExampleBlock(node: string, attributes: OrgNodeAttributes): string {
      return `#+BEGIN_EXAMPLE\n${attributes.text}\n#+END_EXAMPLE\n`;
    }
  
    // Render a Center Block node
    private renderCenterBlock(node: string, attributes: OrgNodeAttributes): string {
      return `#+BEGIN_CENTER\n${attributes.text}\n#+END_CENTER\n`;
    }
  
    // Render a Table node
    private renderTable(node: string, attributes: OrgNodeAttributes, graph: OrgDocumentGraph): string {
      let output = '';
      graph.forEachOutboundEdge(node, (edge, attributes, source, target) => {
        const targetAttributes = graph.getNodeAttributes(target);
        output += this.renderNode(target, targetAttributes, graph);
      });
      return output;
    }
  
    // Render a Table Row node
    private renderTableRow(node: string, attributes: OrgNodeAttributes, graph: OrgDocumentGraph): string {
      let output = '|';
      graph.forEachOutboundEdge(node, (edge, attributes, source, target) => {
        const targetAttributes = graph.getNodeAttributes(target);
        output += ` ${this.renderNode(target, targetAttributes, graph)} |`;
      });
      return output + '\n';
    }
  
    // Render a Table Cell node
    private renderTableCell(node: string, attributes: OrgNodeAttributes): string {
      return attributes.text || '';
    }
  
    // Render a Link node
    private renderLink(node: string, attributes: OrgNodeAttributes): string {
      switch (attributes.type) {
        case 'InternalLink':
          return `[[${attributes.text}]]`;
        case 'ExternalLink':
          return `[[${attributes.url}][${attributes.text}]]`;
        case 'FileLink':
          return `[[file:${attributes.url}][${attributes.text}]]`;
        default:
          return '';
      }
    }
  
    // Render a Footnote node
    private renderFootnote(node: string, attributes: OrgNodeAttributes): string {
      switch (attributes.type) {
        case 'FootnoteDefinition':
          return `[fn:${attributes.text}] ${attributes.value}\n`;
        case 'FootnoteReference':
          return `[fn:${attributes.text}]`;
        default:
          return '';
      }
    }
  
    // Render a Timestamp node
    private renderTimestamp(node: string, attributes: OrgNodeAttributes): string {
      return attributes.timestamp || '';
    }
  
    // Render a Comment node
    private renderComment(node: string, attributes: OrgNodeAttributes): string {
      switch (attributes.type) {
        case 'LineComment':
          return `# ${attributes.text}\n`;
        case 'BlockComment':
          return `#+BEGIN_COMMENT\n${attributes.text}\n#+END_COMMENT\n`;
        default:
          return '';
      }
    }
  
    // Render a Macro node
    private renderMacro(node: string, attributes: OrgNodeAttributes): string {
      switch (attributes.type) {
        case 'InlineMacro':
          return `{{{${attributes.text}}}}`;
        case 'BlockMacro':
          return `#+MACRO: ${attributes.text}\n`;
        default:
          return '';
      }
    }
  
    // Generic node renderer
    private renderNode(node: string, attributes: OrgNodeAttributes, graph: OrgDocumentGraph): string {
      switch (attributes.type) {
        case 'Heading':
          return this.renderHeading(node, attributes, graph);
        case 'Title':
          return this.renderTitle(node, graph);
        case 'List':
          return this.renderList(node, attributes, graph);
        case 'UnorderedListItem':
          return this.renderUnorderedListItem(node, attributes);
        case 'OrderedListItem':
          return this.renderOrderedListItem(node, attributes);
        case 'DescriptionListItem':
          return this.renderDescriptionListItem(node, attributes);
        case 'Block':
          return this.renderBlock(node, attributes);
        case 'Table':
          return this.renderTable(node, attributes, graph);
        case 'TableRow':
          return this.renderTableRow(node, attributes, graph);
        case 'TableCell':
          return this.renderTableCell(node, attributes);
        case 'Link':
          return this.renderLink(node, attributes);
        case 'Footnote':
          return this.renderFootnote(node, attributes);
        case 'Timestamp':
          return this.renderTimestamp(node, attributes);
        case 'Comment':
          return this.renderComment(node, attributes);
        case 'Macro':
          return this.renderMacro(node, attributes);
        default:
          return '';
      }
    }
  }
  
  // Example usage
  const orgGraph: OrgDocumentGraph = new Graph();
  orgGraph.addNode('document', { type: 'Document' });
  orgGraph.addNode('heading1', { type: 'Heading', level: 1, text: 'Main Heading' });
  orgGraph.addNode('title1', { type: 'Title', text: 'Main Heading' });
  orgGraph.addNode('content1', { type: 'Content', text: 'This is the content of the main heading.' });
  orgGraph.addEdge('document', 'heading1');
  orgGraph.addEdge('heading1', 'title1');
  orgGraph.addEdge('heading1', 'content1');
  
  const renderer = new OrgNodeRenderer();
  const renderedDocument = renderer.renderGraph(orgGraph);
  console.log(renderedDocument);