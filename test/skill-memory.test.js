/**
 * Story 8-4: Recall Agent Skill Tests
 *
 * These tests validate the Memory skill file meets all acceptance criteria
 * for enabling Claude's autonomous use of Recall.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const PLUGIN_ROOT = path.join(__dirname, '..');
const SKILL_PATH = path.join(PLUGIN_ROOT, 'skills', 'recall-memory', 'SKILL.md');

/**
 * Parse YAML frontmatter from markdown content.
 * Returns null if no valid frontmatter found.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const result = {};

  for (const line of yaml.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      result[key] = value;
    }
  }

  return result;
}

describe('Skill File Existence (AC #1)', () => {
  it('skills/recall-memory directory exists', () => {
    const skillDir = path.join(PLUGIN_ROOT, 'skills', 'recall-memory');
    assert.ok(fs.existsSync(skillDir), 'skills/recall-memory directory should exist');
    assert.ok(fs.statSync(skillDir).isDirectory(), 'skills/recall-memory should be a directory');
  });

  it('SKILL.md file exists', () => {
    assert.ok(fs.existsSync(SKILL_PATH), 'skills/memory/SKILL.md should exist');
  });
});

describe('Skill Frontmatter (AC #2, #3)', () => {
  it('has valid YAML frontmatter', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    const frontmatter = parseFrontmatter(content);
    assert.ok(frontmatter !== null, 'SKILL.md should have YAML frontmatter');
  });

  it('has name field set to "recall-memory"', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    const frontmatter = parseFrontmatter(content);
    assert.strictEqual(frontmatter.name, 'recall-memory', 'name should be "recall-memory"');
  });

  it('has non-empty description field', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    const frontmatter = parseFrontmatter(content);
    assert.ok(
      typeof frontmatter.description === 'string' && frontmatter.description.length > 0,
      'description should be a non-empty string'
    );
  });

  it('does NOT have disable-model-invocation flag (AC #3)', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      !content.includes('disable-model-invocation'),
      'SKILL.md should NOT contain disable-model-invocation (model-invokable by default)'
    );
  });
});

describe('Query Guidance Section (AC #4)', () => {
  it('has "When to Query" section', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('## When to Query') || content.includes('# When to Query'),
      'SKILL.md should have a "When to Query" section'
    );
  });

  it('includes guidance for querying before starting work', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.toLowerCase().includes('before starting') ||
      content.toLowerCase().includes('before a task'),
      'Should include guidance on querying before starting work'
    );
  });

  it('includes example queries', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    // Check for example patterns like quoted queries
    assert.ok(
      content.includes('"') && content.toLowerCase().includes('query'),
      'Should include example query patterns'
    );
  });
});

describe('Record Guidance Section (AC #5, #7, #8, #9)', () => {
  it('has "When to Record" section', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('## When to Record') || content.includes('# When to Record'),
      'SKILL.md should have a "When to Record" section'
    );
  });

  it('includes guidance on solving non-obvious problems', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.toLowerCase().includes('non-obvious') ||
      content.toLowerCase().includes('not immediately apparent'),
      'Should include guidance on recording non-obvious solutions'
    );
  });

  it('has "Do NOT record" anti-patterns section (AC #9)', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('Do NOT record') || content.includes('do NOT record'),
      'SKILL.md should have anti-patterns section'
    );
  });
});

describe('Category Guidance (AC #7)', () => {
  const REQUIRED_CATEGORIES = [
    'ARCHITECTURAL_DECISION',
    'PATTERN_OUTCOME',
    'INTERFACE_LESSON',
    'EDGE_CASE_DISCOVERY',
    'IMPLEMENTATION_FRICTION',
    'TESTING_STRATEGY',
    'DEPENDENCY_BEHAVIOR',
    'PERFORMANCE_INSIGHT'
  ];

  it('documents all 8 lore categories', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    const missingCategories = REQUIRED_CATEGORIES.filter(cat => !content.includes(cat));

    assert.strictEqual(
      missingCategories.length,
      0,
      `Missing categories: ${missingCategories.join(', ')}`
    );
  });

  it('includes examples for categories', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    // Categories should have example text (quotes or descriptive content)
    const categorySection = content.split('## Categories')[1] || content.split('# Categories')[1];
    assert.ok(categorySection, 'Should have a Categories section');
    // Each category should have at least one example (indicated by quotes or dash lists)
    assert.ok(
      (categorySection.match(/"/g) || []).length >= 8,
      'Categories should have example quotes'
    );
  });
});

describe('Feedback Guidance (AC #6)', () => {
  it('has Feedback section', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('## Feedback') || content.includes('# Feedback'),
      'SKILL.md should have a Feedback section'
    );
  });

  it('documents "helpful" feedback type', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('### helpful') || content.includes('**helpful**') || content.includes('`helpful`'),
      'Should document helpful feedback type'
    );
  });

  it('documents "incorrect" feedback type', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('### incorrect') || content.includes('**incorrect**') || content.includes('`incorrect`'),
      'Should document incorrect feedback type'
    );
  });

  it('documents "not_relevant" feedback type', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('### not_relevant') || content.includes('**not_relevant**') || content.includes('`not_relevant`'),
      'Should document not_relevant feedback type'
    );
  });
});

describe('Examples Section (AC #8)', () => {
  it('has Examples section with good and bad lore', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('## Examples') || content.includes('# Examples'),
      'SKILL.md should have an Examples section'
    );
  });

  it('includes good lore examples', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('**Good:**') || content.includes('Good:'),
      'Should include good lore examples'
    );
  });

  it('includes bad lore examples', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    assert.ok(
      content.includes('**Bad:**') || content.includes('Bad:'),
      'Should include bad lore examples'
    );
  });
});

describe('MCP Tool Integration (AC #10)', () => {
  it('references recall_query tool', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    // The skill should reference querying, though not necessarily by exact tool name
    assert.ok(
      content.toLowerCase().includes('query') && content.toLowerCase().includes('recall'),
      'Should reference Recall query functionality'
    );
  });

  it('references recall_record tool', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    // The skill should reference recording, though not necessarily by exact tool name
    assert.ok(
      content.toLowerCase().includes('record') && content.toLowerCase().includes('recall'),
      'Should reference Recall record functionality'
    );
  });

  it('references recall_feedback tool', () => {
    const content = fs.readFileSync(SKILL_PATH, 'utf8');
    // The skill should reference feedback mechanism
    assert.ok(
      content.toLowerCase().includes('feedback'),
      'Should reference Recall feedback functionality'
    );
  });
});
