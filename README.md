# Recall - Claude Code Plugin

Persistent memory for AI agents - capture, store, and retrieve experiential knowledge across sessions.

## Installation

1. Add the Hyper Engineering marketplace:
   ```
   /plugin marketplace add hyperengineering/claude-plugins
   ```

2. Install the recall plugin:
   ```
   /plugin install recall@hyperengineering
   ```

3. Restart Claude Code to activate the MCP server.

## MCP Tools Reference

### recall_query

Retrieve relevant lore based on semantic similarity to a query.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search query to find relevant lore |
| `k` | number | No | Maximum results (default: 5) |
| `min_confidence` | number | No | Minimum confidence 0.0-1.0 (default: 0.5) |
| `categories` | array | No | Filter by specific categories |
| `store` | string | No | Target store ID |

Returns lore entries with session references (L1, L2, ...) for feedback.

### recall_record

Capture lore from current experience for future recall.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | Yes | The insight to record (max 4000 chars) |
| `category` | string | Yes | Category (see below) |
| `context` | string | No | Additional context (story, epic, situation) |
| `confidence` | number | No | Initial confidence 0.0-1.0 (default: 0.5) |
| `store` | string | No | Target store ID |

**Categories:** `ARCHITECTURAL_DECISION`, `PATTERN_OUTCOME`, `INTERFACE_LESSON`, `EDGE_CASE_DISCOVERY`, `IMPLEMENTATION_FRICTION`, `TESTING_STRATEGY`, `DEPENDENCY_BEHAVIOR`, `PERFORMANCE_INSIGHT`

### recall_feedback

Provide feedback on recalled lore to adjust confidence.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `helpful` | array | No | Session refs of helpful lore (+0.08 confidence) |
| `not_relevant` | array | No | Session refs of irrelevant lore (no change) |
| `incorrect` | array | No | Session refs of incorrect lore (-0.15 confidence) |
| `store` | string | No | Store ID (only for direct lore IDs) |

Use session references (L1, L2, ...) from query results. Store is auto-resolved from session refs.

### recall_sync

Synchronize local lore with Engram.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `direction` | string | No | `pull`, `push`, or `both` (default: `both`) |
| `store` | string | No | Target store ID |

Requires `ENGRAM_URL` and `ENGRAM_API_KEY` to be configured.

### recall_store_list

List available stores from Engram.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prefix` | string | No | Filter stores by path prefix (e.g., `myorg/`) |

Returns stores with record counts and last update times.

### recall_store_info

Get detailed information about a specific store.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `store` | string | No | Store ID to inspect (default: current store) |

Returns store metadata, statistics, and category distribution.

## Configuration

### Zero-Config Mode

By default, Recall works with no configuration required:
- Uses a local SQLite database at `./data/lore.db` (relative to the current working directory where Claude Code was launched)
- Operates in offline mode (no sync)
- All tools function locally

To use a fixed location regardless of working directory, set `RECALL_DB_PATH` to an absolute path like `~/.local/share/recall/lore.db`.

### Environment Variables

To enable sync with Engram or customize behavior, add environment variables to your Claude Code MCP configuration:

| Variable | Purpose | Default |
|----------|---------|---------|
| `ENGRAM_STORE` | Target store ID for operations | `"default"` |
| `ENGRAM_URL` | Engram service URL for sync | None (offline mode) |
| `ENGRAM_API_KEY` | API key for Engram authentication | None |
| `RECALL_DB_PATH` | Custom local database path | `./data/lore.db` |
| `RECALL_SOURCE_ID` | Client identifier for sync | Hostname |

Example configuration with environment variables:

```json
{
  "recall": {
    "command": "npx",
    "args": ["@hyperengineering/recall", "mcp"],
    "env": {
      "ENGRAM_STORE": "my-project",
      "ENGRAM_URL": "https://engram.example.com",
      "ENGRAM_API_KEY": "your-api-key"
    }
  }
}
```

## Multi-Store Usage

Query a specific project store:

```
recall_query(query="error handling", store="myorg/api-service")
```

Record to a team knowledge base:

```
recall_record(
  content="Batch operations need idempotency keys",
  category="PATTERN_OUTCOME",
  store="myorg/shared-patterns"
)
```

List available stores:

```
recall_store_list()
recall_store_list(prefix="myorg/")  // Filter by organization
```

Session refs work across stores. If you query store A (returns L1-L3) then query store B (returns L4-L6), feedback on any ref auto-routes to the correct store:

```
recall_feedback(helpful=["L1", "L5"])  // L1 -> store A, L5 -> store B
```

## Security Considerations

### API Key Storage

When configuring `ENGRAM_API_KEY` in your MCP configuration:

- **Plaintext storage:** API keys in `.mcp.json` or Claude Code config files are stored in plaintext on disk. Ensure these files have appropriate permissions (e.g., `chmod 600`).

- **Do not commit to version control:** Never commit configuration files containing API keys to git or other version control systems. Add config paths to your `.gitignore`.

- **Use environment variables when possible:** Instead of hardcoding API keys in config files, consider setting them as system environment variables that Claude Code inherits.

- **Rotate keys regularly:** If you suspect a key may have been exposed, rotate it immediately in your Engram dashboard.

### File Permissions

The local database (`lore.db`) may contain sensitive information from your development sessions. Ensure:
- The database file is not world-readable
- Backups are stored securely
- The file is excluded from version control (already in default `.gitignore`)

## Troubleshooting

### npx not found

**Error:** `spawn npx ENOENT`

**Solution:** Install Node.js 18 or later, which includes npx:
- macOS: `brew install node`
- Ubuntu/Debian: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
- Windows: Download from https://nodejs.org

### Package not found

**Error:** `npm ERR! 404 Not Found - GET https://registry.npmjs.org/@hyperengineering/recall`

**Solution:** The package may not be published yet or you may be behind a proxy. Check:
1. Your network connection
2. npm registry configuration: `npm config get registry`
3. Contact the maintainers if the issue persists

### Binary download fails

**Error:** `Failed to download recall binary for [platform]-[arch]`

**Solution:**
1. Check your network connection
2. Retry installation: `npm cache clean --force && npm install -g @hyperengineering/recall`
3. If behind a corporate firewall, configure npm proxy settings

### Permission denied

**Error:** `EACCES: permission denied`

**Solution:**
1. Use a user-writable npm prefix: `npm config set prefix ~/.npm-global`
2. Add `~/.npm-global/bin` to your PATH
3. Or use a Node version manager like nvm

### MCP server startup timeout

**Error:** Claude Code shows MCP server failed to start

**Solution:**
1. Test the server manually: `npx @hyperengineering/recall mcp`
2. Check for error messages in the output
3. Verify the binary is executable: `which recall`
4. Check Claude Code logs for detailed error messages

### Tools not appearing

If Recall tools don't appear after installation:

1. Verify the plugin is installed: `/plugin list`
2. Restart Claude Code completely
3. Check that `.mcp.json` is present in the plugin directory
4. Look for MCP server errors in Claude Code logs

## Documentation

For full documentation, see the [Recall repository](https://github.com/hyperengineering/recall).

## License

MIT
