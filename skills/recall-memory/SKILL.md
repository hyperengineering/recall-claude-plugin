---
name: recall-memory
description: Persistent memory for development insights. Query past learnings before starting work. Record discoveries that will help future sessions.
---

# Memory Skill

You have access to a persistent memory system called Recall. Use it to:
- **Query** past learnings before starting significant work
- **Record** valuable insights discovered during implementation
- **Feedback** on what helped to improve future recommendations

## When to Query

Query Recall at these moments:

1. **Before starting a task** - Search for relevant past experiences
2. **Before architectural decisions** - Check for existing insights on similar choices
3. **When hitting unexpected friction** - Others may have documented the same issue
4. **When working with unfamiliar dependencies** - Look for gotchas and patterns

Example queries:
- "error handling patterns in Go"
- "database connection pooling"
- "API versioning strategies"
- "testing async workflows"

Query results include session references (L1, L2, L3...) that you can use for feedback.

## When to Record

Record lore when you:

1. **Solve a non-obvious problem** - The solution wasn't immediately apparent
2. **Discover an edge case** - Found unexpected behavior worth remembering
3. **Make an architectural decision** - Capture the rationale while it's fresh
4. **Find a pattern that works well** - Reinforce successful approaches
5. **Encounter dependency quirks** - Document library/framework gotchas
6. **Complete performance optimization** - Record what actually improved performance

Do NOT record:
- Project-specific implementation details ("Function X is in file Y")
- Obvious or well-documented patterns
- Unvalidated hypotheses (wait until confirmed)
- Vague observations ("This was hard")

## Categories

Select the category that best matches the insight type:

### ARCHITECTURAL_DECISION
System-level design choices and their rationale.
- "Event sourcing adds complexity but provides complete audit trail for financial transactions"
- "Chose PostgreSQL over MongoDB for relational data with complex joins"

### PATTERN_OUTCOME
Results of applying (or not applying) patterns.
- "Repository pattern added unnecessary abstraction for simple CRUD operations"
- "Circuit breaker pattern prevented cascade failures in microservice calls"

### INTERFACE_LESSON
API boundaries, contracts, and interface design insights.
- "Nullable returns caused null check proliferation; Optional<T> is clearer"
- "Accepting interfaces and returning concrete types improved testability"

### EDGE_CASE_DISCOVERY
Unexpected behaviors and boundary conditions.
- "Empty string and null require different handling in this API"
- "Timezone conversions fail silently for dates before 1970"

### IMPLEMENTATION_FRICTION
Pain points when translating design to code.
- "The async interface looked right but blocking I/O required complete rewrite"
- "Generic type constraints prevented clean composition with existing interfaces"

### TESTING_STRATEGY
Testing approaches that proved valuable or problematic.
- "Integration tests with real database caught issues unit tests missed"
- "Property-based testing found edge cases manual tests never would"

### DEPENDENCY_BEHAVIOR
External library and framework quirks.
- "ORM generates N+1 queries without explicit eager loading configuration"
- "HTTP client doesn't retry on connection reset by default"

### PERFORMANCE_INSIGHT
Optimization discoveries and performance characteristics.
- "Batch inserts with RETURNING clause avoid N queries for generated IDs"
- "In-memory cache failed at 10K entries; needed disk-backed LRU"

## Confidence Guidelines

Set initial confidence based on validation level:

| Confidence | When to Use |
|------------|-------------|
| 0.3-0.4 | First observation, hypothesis |
| 0.5 | Reasonable certainty (default) |
| 0.6-0.7 | Validated in current context |
| 0.8+ | Confirmed across multiple contexts |

## Feedback

After using queried lore, provide feedback to improve future recommendations:

### helpful
Use when the lore directly contributed to your work.
- Applied the pattern successfully
- Avoided a problem because of the warning
- Made a better decision based on the insight

### incorrect
Use when the lore was wrong or misleading.
- The described behavior was inaccurate
- Following the advice caused problems
- The pattern doesn't work as described

### not_relevant
Use when the lore was accurate but didn't apply to your situation.
- Different context or constraints
- Already knew this information
- Not related to the current task

## Examples of Good Lore

**Good:** "Go interfaces should be defined by consumers, not producers - this enables better test isolation and avoids import cycles"
- Specific, actionable insight
- Explains the 'why'
- Transferable across projects

**Good:** "SQLite PRAGMA journal_mode=WAL improves concurrent read performance 10x but requires more disk space"
- Quantified improvement
- Notes the tradeoff
- Immediately applicable

**Bad:** "The database was slow"
- Too vague
- No actionable insight

**Bad:** "Use the handleError function in utils.go"
- Too project-specific
- Won't help in other contexts

**Bad:** "This might work better with caching"
- Unvalidated hypothesis
- Record after confirming
