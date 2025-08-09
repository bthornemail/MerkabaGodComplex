import * as ts from 'typescript';
import { DirectedGraph } from 'graphology';
import { writeFileSync } from 'fs';

// Initialize a graph
const graph = new DirectedGraph();

// Function to parse a TypeScript file and extract class, function, and method declarations
function parseFile(filePath: string) {
    const program = ts.createProgram([filePath], {});
    const sourceFile = program.getSourceFile(filePath);

    if (!sourceFile) return;

    // Visit each node in the AST
    ts.forEachChild(sourceFile, (node) => {
        if (ts.isClassDeclaration(node) && node.name) {
            addClassNode(node.name.text);
        } else if (ts.isFunctionDeclaration(node) && node.name) {
            addFunctionNode(node.name.text, filePath);
        } else if (ts.isMethodDeclaration(node)) {
            const methodName = node.name.getText(sourceFile);
            const parentClass = findParentClass(node);
            if (parentClass && ts.isClassDeclaration(parentClass) && parentClass.name) {
                addMethodNode(parentClass.name.text, methodName);
            }
        }
    });
}

// Helper: Add Class Nodes
function addClassNode(className: string) {
    if (!graph.hasNode(className)) {
        graph.addNode(className, { type: 'class' });
    }
}

// Helper: Add Function Nodes
function addFunctionNode(functionName: string, filePath: string) {
    if (!graph.hasNode(functionName)) {
        graph.addNode(functionName, { type: 'function' });

        // Connect function to its containing file
        graph.addEdgeWithKey(`${filePath}->${functionName}`, filePath, functionName);
    }
}

// Helper: Add Method Nodes
function addMethodNode(className: string, methodName: string) {
    const fullMethodName = `${className}.${methodName}`;
    if (!graph.hasNode(fullMethodName)) {
        graph.addNode(fullMethodName, { type: 'method' });
    }

    // Connect method to its class
    graph.addEdgeWithKey(`${className}->${fullMethodName}`, className, fullMethodName);
}

// Helper: Find the parent class of a method
function findParentClass(node: ts.Node): ts.ClassDeclaration | undefined {
    while (node.parent) {
        if (ts.isClassDeclaration(node.parent)) {
            return node.parent;
        }
        node = node.parent;
    }
    return undefined;
}

// Example: Parse a TypeScript file
const filePath = 'hmm.ts'; // Replace with your file path
parseFile(filePath);

// Save the graph
writeFileSync('program-graph.json', JSON.stringify(graph.export(), null, 2));
console.log('Graph saved!');
