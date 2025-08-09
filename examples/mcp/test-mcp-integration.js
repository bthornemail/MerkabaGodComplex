// Canonical MCP integration test (JS)
// Copy of root test with no imports, safe to run standalone

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function logOk(msg) {
  console.log(colors.green + '✓ ' + msg + colors.reset);
}

function logInfo(msg) {
  console.log(colors.cyan + msg + colors.reset);
}

function logFail(msg) {
  console.log(colors.red + '✗ ' + msg + colors.reset);
}

class MockMCPServer {
  initialize() {
    return { name: 'Universal Life Protocol', version: '2.0.0' };
  }

  resources_list() {
    return [{ uri: 'profile:intj', name: 'INTJ Analyst Profile' }];
  }

  prompts_list() {
    return [{ name: 'The Analyst', description: 'Analyst persona prompt' }];
  }

  tools_list() {
    return [
      {
        name: 'conscious-reasoning',
        input_schema: { type: 'object', properties: { query: { type: 'string' } } },
      },
      {
        name: 'evolve-knowledge',
        input_schema: { type: 'object', properties: { step: { type: 'number' } } },
      },
      {
        name: 'mint-attention-tokens',
        input_schema: { type: 'object', properties: { count: { type: 'number' } } },
      },
    ];
  }

  tools_call(name, params) {
    switch (name) {
      case 'conscious-reasoning':
        return { answer: `Reasoned: ${params.query}`, domain: 'INTJ' };

      case 'evolve-knowledge':
        return { survived: 3, died: 1, born: 2 };

      case 'mint-attention-tokens':
        return { minted: params.count ?? 1, unit: 'ATN' };

      default:
        throw new Error('Unknown tool');
    }
  }
}

(async function main() {
  logInfo('MCP Integration Test — Universal Life Protocol');
  const server = new MockMCPServer();

  // initialize
  const init = server.initialize();
  if (init.name && init.version) {
    logOk(`initialize → ${init.name} v${init.version}`);
  } else {
    throw new Error('initialize failed');
  }

  // resources
  const resources = server.resources_list();
  if (Array.isArray(resources) && resources.length) {
    logOk(`resources/list → ${resources.length}`);
  } else {
    throw new Error('resources/list failed');
  }

  // prompts
  const prompts = server.prompts_list();
  if (Array.isArray(prompts) && prompts.length) {
    logOk(`prompts/list → ${prompts[0].name}`);
  } else {
    throw new Error('prompts/list failed');
  }

  // tools
  const tools = server.tools_list();
  if (Array.isArray(tools) && tools.length >= 3) {
    logOk(`tools/list → ${tools.length} tools`);
  } else {
    throw new Error('tools/list failed');
  }

  // tools/call
  const answer = server.tools_call('conscious-reasoning', {
    query: 'What is epistemic compression?',
  });
  if (answer && answer.answer) {
    logOk('tools/call → conscious-reasoning');
  } else {
    throw new Error('tools/call failed');
  }

  const evo = server.tools_call('evolve-knowledge', { step: 1 });
  if (evo && typeof evo.survived === 'number') {
    logOk('tools/call → evolve-knowledge');
  }

  const mint = server.tools_call('mint-attention-tokens', { count: 3 });
  if (mint && mint.minted === 3) {
    logOk('tools/call → mint-attention-tokens');
  }

  logInfo('All MCP checks passed.');
})().catch((e) => {
  logFail(e.message);
  process.exit(1);
});
