/**
 * Story 8-2: Plugin Repository Structure Tests
 *
 * These tests validate the Claude Code plugin structure meets all
 * acceptance criteria before the plugin is published.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const PLUGIN_ROOT = path.join(__dirname, '..');

describe('Plugin Repository Structure (AC #1, #2, #3)', () => {
  it('has .claude-plugin directory at root', () => {
    const pluginDir = path.join(PLUGIN_ROOT, '.claude-plugin');
    assert.ok(fs.existsSync(pluginDir), '.claude-plugin directory should exist');
    assert.ok(fs.statSync(pluginDir).isDirectory(), '.claude-plugin should be a directory');
  });

  it('.claude-plugin contains ONLY plugin.json', () => {
    const pluginDir = path.join(PLUGIN_ROOT, '.claude-plugin');
    const contents = fs.readdirSync(pluginDir);
    assert.deepStrictEqual(
      contents,
      ['plugin.json'],
      '.claude-plugin should contain only plugin.json'
    );
  });
});

describe('plugin.json Required Fields (AC #4)', () => {
  let pluginJson;

  it('is valid JSON', () => {
    const pluginPath = path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');
    const content = fs.readFileSync(pluginPath, 'utf8');
    pluginJson = JSON.parse(content);
    assert.ok(typeof pluginJson === 'object', 'plugin.json should parse to an object');
  });

  it('has name field set to "recall"', () => {
    const pluginPath = path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');
    const content = fs.readFileSync(pluginPath, 'utf8');
    pluginJson = JSON.parse(content);
    assert.strictEqual(pluginJson.name, 'recall', 'name should be "recall"');
  });

  it('has description field', () => {
    const pluginPath = path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');
    const content = fs.readFileSync(pluginPath, 'utf8');
    pluginJson = JSON.parse(content);
    assert.ok(
      typeof pluginJson.description === 'string' && pluginJson.description.length > 0,
      'description should be a non-empty string'
    );
  });

  it('has version field in semver format', () => {
    const pluginPath = path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');
    const content = fs.readFileSync(pluginPath, 'utf8');
    pluginJson = JSON.parse(content);
    const semverPattern = /^\d+\.\d+\.\d+$/;
    assert.ok(
      semverPattern.test(pluginJson.version),
      `version "${pluginJson.version}" should match semver format X.Y.Z`
    );
  });

  it('has author object with name field', () => {
    const pluginPath = path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');
    const content = fs.readFileSync(pluginPath, 'utf8');
    pluginJson = JSON.parse(content);
    assert.ok(
      typeof pluginJson.author === 'object',
      'author should be an object'
    );
    assert.strictEqual(
      pluginJson.author.name,
      'Hyper Engineering',
      'author.name should be "Hyper Engineering"'
    );
  });
});

describe('plugin.json Optional Fields (AC #5)', () => {
  let pluginJson;

  function loadPluginJson() {
    const pluginPath = path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');
    const content = fs.readFileSync(pluginPath, 'utf8');
    return JSON.parse(content);
  }

  it('has homepage URL', () => {
    pluginJson = loadPluginJson();
    assert.ok(
      typeof pluginJson.homepage === 'string' && pluginJson.homepage.startsWith('https://'),
      'homepage should be a valid URL'
    );
  });

  it('has repository URL', () => {
    pluginJson = loadPluginJson();
    assert.ok(
      typeof pluginJson.repository === 'string' && pluginJson.repository.startsWith('https://'),
      'repository should be a valid URL'
    );
  });

  it('has license field set to MIT', () => {
    pluginJson = loadPluginJson();
    assert.strictEqual(pluginJson.license, 'MIT', 'license should be "MIT"');
  });

  it('has keywords array', () => {
    pluginJson = loadPluginJson();
    assert.ok(Array.isArray(pluginJson.keywords), 'keywords should be an array');
    assert.ok(pluginJson.keywords.length > 0, 'keywords should not be empty');
    assert.ok(
      pluginJson.keywords.every(k => typeof k === 'string'),
      'all keywords should be strings'
    );
  });
});

describe('Standard Repository Files (AC #7)', () => {
  it('has README.md', () => {
    const readmePath = path.join(PLUGIN_ROOT, 'README.md');
    assert.ok(fs.existsSync(readmePath), 'README.md should exist');
    const content = fs.readFileSync(readmePath, 'utf8');
    assert.ok(content.length > 0, 'README.md should not be empty');
  });

  it('has LICENSE file with MIT license', () => {
    const licensePath = path.join(PLUGIN_ROOT, 'LICENSE');
    assert.ok(fs.existsSync(licensePath), 'LICENSE should exist');
    const content = fs.readFileSync(licensePath, 'utf8');
    assert.ok(content.includes('MIT License'), 'LICENSE should contain MIT License');
  });

  it('has .gitignore', () => {
    const gitignorePath = path.join(PLUGIN_ROOT, '.gitignore');
    assert.ok(fs.existsSync(gitignorePath), '.gitignore should exist');
  });
});

describe('Version Strategy (AC #8)', () => {
  it('plugin version follows semantic versioning', () => {
    const pluginPath = path.join(PLUGIN_ROOT, '.claude-plugin', 'plugin.json');
    const content = fs.readFileSync(pluginPath, 'utf8');
    const pluginJson = JSON.parse(content);

    // Verify semver format
    const parts = pluginJson.version.split('.');
    assert.strictEqual(parts.length, 3, 'version should have 3 parts');
    parts.forEach((part, i) => {
      assert.ok(!isNaN(parseInt(part, 10)), `version part ${i} should be a number`);
    });
  });
});
