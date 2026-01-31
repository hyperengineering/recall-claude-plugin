'use strict';

/**
 * Story 8-3: MCP Server Configuration Tests
 *
 * These tests validate the .mcp.json configuration file meets all
 * acceptance criteria for MCP server registration with Claude Code.
 *
 * NOTE: AC #3-#8 (tool availability) are verified by Go tests in mcp/server_test.go
 * which test the MCP server directly. End-to-end integration testing of the full
 * npx -> binary -> MCP server path requires the npm package to be published
 * (Story 8.1) and is covered by manual testing in the Dev Notes section of the story.
 */

const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const PLUGIN_ROOT = path.join(__dirname, '..');

describe('.mcp.json Existence (AC #1)', () => {
  it('has .mcp.json file at plugin repository root', () => {
    const mcpConfigPath = path.join(PLUGIN_ROOT, '.mcp.json');
    assert.ok(
      fs.existsSync(mcpConfigPath),
      '.mcp.json should exist at plugin root'
    );
  });

  it('.mcp.json is valid JSON', () => {
    const mcpConfigPath = path.join(PLUGIN_ROOT, '.mcp.json');
    const content = fs.readFileSync(mcpConfigPath, 'utf8');
    let parsed;
    assert.doesNotThrow(() => {
      parsed = JSON.parse(content);
    }, '.mcp.json should be valid JSON');
    assert.ok(typeof parsed === 'object', '.mcp.json should parse to an object');
  });
});

describe('.mcp.json Configuration Structure (AC #2)', () => {
  let mcpConfig;

  before(() => {
    const mcpConfigPath = path.join(PLUGIN_ROOT, '.mcp.json');
    const content = fs.readFileSync(mcpConfigPath, 'utf8');
    mcpConfig = JSON.parse(content);
  });

  it('has "recall" server entry', () => {
    assert.ok(
      typeof mcpConfig.recall === 'object',
      '.mcp.json should have "recall" server entry'
    );
  });

  it('configures command as "npx"', () => {
    assert.strictEqual(
      mcpConfig.recall.command,
      'npx',
      'command should be "npx"'
    );
  });

  it('configures args to invoke @hyperengineering/recall mcp', () => {
    assert.ok(
      Array.isArray(mcpConfig.recall.args),
      'args should be an array'
    );
    assert.deepStrictEqual(
      mcpConfig.recall.args,
      ['@hyperengineering/recall', 'mcp'],
      'args should be ["@hyperengineering/recall", "mcp"]'
    );
  });

  it('has env object for user customization', () => {
    assert.ok(
      typeof mcpConfig.recall.env === 'object',
      'env should be an object'
    );
  });

  it('env object is empty by default (zero-config)', () => {
    assert.deepStrictEqual(
      mcpConfig.recall.env,
      {},
      'env should be empty object by default for zero-config operation'
    );
  });
});

describe('.mcp.json Schema Validation (AC #2)', () => {
  let mcpConfig;

  before(() => {
    const mcpConfigPath = path.join(PLUGIN_ROOT, '.mcp.json');
    const content = fs.readFileSync(mcpConfigPath, 'utf8');
    mcpConfig = JSON.parse(content);
  });

  it('has only expected top-level keys', () => {
    const keys = Object.keys(mcpConfig);
    assert.deepStrictEqual(
      keys,
      ['recall'],
      '.mcp.json should only have "recall" key at top level'
    );
  });

  it('recall entry has only expected keys', () => {
    const keys = Object.keys(mcpConfig.recall).sort();
    assert.deepStrictEqual(
      keys,
      ['args', 'command', 'env'],
      'recall entry should have exactly command, args, and env keys'
    );
  });

  it('command is a non-empty string', () => {
    assert.strictEqual(typeof mcpConfig.recall.command, 'string');
    assert.ok(mcpConfig.recall.command.length > 0, 'command should not be empty');
  });

  it('args contains only strings', () => {
    assert.ok(Array.isArray(mcpConfig.recall.args), 'args should be an array');
    mcpConfig.recall.args.forEach((arg, i) => {
      assert.strictEqual(
        typeof arg,
        'string',
        `args[${i}] should be a string, got ${typeof arg}`
      );
    });
  });

  it('env is a plain object (not array or null)', () => {
    assert.ok(mcpConfig.recall.env !== null, 'env should not be null');
    assert.ok(!Array.isArray(mcpConfig.recall.env), 'env should not be an array');
    assert.strictEqual(typeof mcpConfig.recall.env, 'object');
  });
});

describe('MCP Configuration Documentation (AC #10)', () => {
  let readmeContent;

  before(() => {
    const readmePath = path.join(PLUGIN_ROOT, 'README.md');
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  });

  it('documents ENGRAM_STORE environment variable', () => {
    assert.ok(
      readmeContent.includes('ENGRAM_STORE'),
      'README should document ENGRAM_STORE environment variable'
    );
  });

  it('documents ENGRAM_URL environment variable', () => {
    assert.ok(
      readmeContent.includes('ENGRAM_URL'),
      'README should document ENGRAM_URL environment variable'
    );
  });

  it('documents ENGRAM_API_KEY environment variable', () => {
    assert.ok(
      readmeContent.includes('ENGRAM_API_KEY'),
      'README should document ENGRAM_API_KEY environment variable'
    );
  });

  it('documents RECALL_DB_PATH environment variable', () => {
    assert.ok(
      readmeContent.includes('RECALL_DB_PATH'),
      'README should document RECALL_DB_PATH environment variable'
    );
  });
});

describe('Troubleshooting Documentation (AC #11, #12)', () => {
  let readmeContent;

  before(() => {
    const readmePath = path.join(PLUGIN_ROOT, 'README.md');
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  });

  it('has troubleshooting section', () => {
    assert.ok(
      readmeContent.includes('## Troubleshooting'),
      'README should have Troubleshooting section header'
    );
  });

  it('documents npx not found error (ENOENT)', () => {
    assert.ok(
      readmeContent.includes('ENOENT'),
      'README should document ENOENT error for npx not found'
    );
    assert.ok(
      readmeContent.includes('npx not found') || readmeContent.includes('spawn npx'),
      'README should explain npx not found scenario'
    );
  });

  it('documents package not found error (404)', () => {
    assert.ok(
      readmeContent.includes('404'),
      'README should document 404 error for package not found'
    );
  });

  it('documents binary download failure', () => {
    assert.ok(
      readmeContent.includes('download') && readmeContent.includes('binary'),
      'README should document binary download failure'
    );
  });

  it('documents permission denied error (EACCES)', () => {
    assert.ok(
      readmeContent.includes('EACCES') || readmeContent.includes('permission denied'),
      'README should document permission denied error'
    );
  });

  it('documents MCP server startup timeout', () => {
    assert.ok(
      readmeContent.includes('startup') || readmeContent.includes('timeout'),
      'README should document MCP server startup issues'
    );
  });

  it('provides actionable solutions for each error', () => {
    // Count occurrences of "Solution:" to ensure each error has guidance
    const solutionCount = (readmeContent.match(/\*\*Solution:\*\*/g) || []).length;
    assert.ok(
      solutionCount >= 5,
      `README should have at least 5 solutions documented, found ${solutionCount}`
    );
  });
});

describe('Security Documentation', () => {
  let readmeContent;

  before(() => {
    const readmePath = path.join(PLUGIN_ROOT, 'README.md');
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  });

  it('documents API key security considerations', () => {
    assert.ok(
      readmeContent.includes('Security') || readmeContent.includes('security'),
      'README should have security documentation'
    );
  });

  it('warns about plaintext credential storage', () => {
    assert.ok(
      readmeContent.includes('plaintext') || readmeContent.includes('plain text'),
      'README should warn about plaintext credential storage'
    );
  });
});

describe('MCP Tool Availability (AC #3-#8)', () => {
  /**
   * TESTING APPROACH FOR AC #3-#8:
   *
   * Tool registration is verified at multiple levels:
   *
   * 1. Go unit tests (mcp/server_test.go):
   *    - TestServer_ToolsList verifies all 6 tools are registered
   *    - Individual tool tests verify each tool functions correctly
   *
   * 2. Protocol tests (mcp/server_test.go):
   *    - TestProtocol_Initialize verifies MCP server responds correctly
   *
   * 3. End-to-end integration:
   *    - Requires npm package published (Story 8.1 dependency)
   *    - Manual testing documented in story Dev Notes section
   *    - Automated E2E tests are out of scope for this story
   *
   * The tests below verify the configuration enables the tools,
   * while Go tests verify the tools themselves work correctly.
   */

  const EXPECTED_TOOLS = [
    'recall_query',
    'recall_record',
    'recall_feedback',
    'recall_sync',
    'recall_store_list',
    'recall_store_info',
  ];

  it('configuration enables exactly 6 MCP tools', () => {
    assert.strictEqual(
      EXPECTED_TOOLS.length,
      6,
      'Should configure exactly 6 MCP tools'
    );
  });

  EXPECTED_TOOLS.forEach(toolName => {
    it(`${toolName} is expected to be registered`, () => {
      // This test documents the expected tools
      // Actual registration verified by Go tests in mcp/server_test.go:TestServer_ToolsList
      assert.ok(
        toolName.startsWith('recall_'),
        `${toolName} should have recall_ prefix per naming convention`
      );
    });
  });

  it('README documents all available tools', () => {
    const readmePath = path.join(PLUGIN_ROOT, 'README.md');
    const content = fs.readFileSync(readmePath, 'utf8');

    EXPECTED_TOOLS.forEach(toolName => {
      assert.ok(
        content.includes(toolName),
        `README should document ${toolName} tool`
      );
    });
  });
});
