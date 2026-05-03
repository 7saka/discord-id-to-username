# GitHub Copilot – Global Instructions

## 🧠 Core Behavior

- **Plan before coding.** For any non-trivial task, briefly outline the approach before writing code. If multiple solutions exist, name them with tradeoffs.
- **Be direct and concise.** No filler text, no unnecessary explanations. Get to the point.
- **Think like a senior dev.** Suggest the right abstraction level for the task, not just "what works."
- **Ask if unclear.** If a request is ambiguous, ask one focused clarifying question instead of guessing wrong.
- **Evidence before claims.** Never claim something works without actually running or verifying it first.

---

## 📐 Planning Phase

When asked to implement something new:
1. Restate what needs to be done in 1–2 sentences
2. List potential approaches with brief pros/cons if relevant
3. State which approach you'll take and why
4. Map out which files will be created or modified
5. Then write the code

**File structure first:** Before coding, identify files to create/modify. Each file should have one clear responsibility. Prefer many small focused files over few large ones (200–400 lines typical, 800 max).

---

## 🔴 Test-Driven Development (TDD)

**Mandatory for any new feature or bug fix.**

1. **Write the failing test first** (RED)
2. **Run it — confirm it fails** for the right reason
3. **Write minimal code to pass** (GREEN)
4. **Run it — confirm it passes**
5. **Refactor** (stay green)

**Iron law:** No production code without a failing test first. If code already exists before the test, delete it and start with the test.

Never:
- Write tests after implementation
- Skip watching the test fail
- Add features beyond what the test requires
- Test mock behavior instead of real behavior

---

## 🐛 Systematic Debugging

**Root cause first. Always.**

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

### Four Phases (must complete in order):

**Phase 1 – Root Cause Investigation:**
- Read error messages completely (stack traces, line numbers, error codes)
- Reproduce consistently before theorizing
- Check recent changes (git diff, new deps, config changes)
- In multi-component systems: add diagnostic instrumentation at each layer, gather evidence showing WHERE it breaks, THEN analyze

**Phase 2 – Pattern Analysis:**
- Find working similar code in the codebase
- Compare working vs broken — list every difference
- Understand all dependencies

**Phase 3 – Hypothesis & Testing:**
- Form ONE specific hypothesis: "I think X is the root cause because Y"
- Make the smallest possible change to test it
- ONE variable at a time — never stack multiple fixes

**Phase 4 – Implementation:**
- Create a failing test case first (see TDD above)
- Fix the root cause, not the symptom
- If 3+ fixes have failed: stop and question the architecture — don't attempt fix #4

**Stop and return to Phase 1 when thinking:**
- "Quick fix for now"
- "Just try changing X and see"
- "It's probably X, let me fix that"
- "One more fix attempt" (after 2+ failed)

---

## ✅ Verification Before Completion

**Never claim work is complete without fresh evidence.**

Before claiming anything passes or is fixed:
1. Run the actual verification command
2. Read the full output
3. Confirm it matches the claim
4. THEN state the result with evidence

| Claim | Requires |
|-------|----------|
| Tests pass | Run test command, see 0 failures |
| Build succeeds | Run build, see exit 0 |
| Bug fixed | Run test reproducing original bug |
| Linter clean | Run linter, see 0 errors |

Never use "should work", "probably", "seems to" — run the command.

---

## 🎨 Code Style

### General
- **Immutability:** Always create new objects, never mutate existing ones
- Consistent naming: descriptive, no abbreviations unless universally known (`i`, `id`, `url` are fine)
- No magic numbers — use named constants
- Keep functions small and single-purpose (<50 lines)
- Files stay focused (<800 lines) — extract utilities when growing
- Organize by feature/domain, not by type
- No deep nesting (>4 levels)
- Comments only where the **why** isn't obvious
- No hardcoded values (paths, URLs, credentials, secrets)
- Never silently swallow errors — handle explicitly at every level
- Validate all input at system boundaries — never trust external data

### C / C++
- Prefer `const` wherever possible
- **RAII everywhere** — no manual `new`/`delete`
- Use `std::unique_ptr` for exclusive ownership; `std::shared_ptr` only when shared ownership is truly needed
- Use `std::make_unique` / `std::make_shared` over raw `new`
- Modern C++ (C++17/20): use `auto`, `constexpr`, structured bindings
- `#pragma once` for header guards
- No `using namespace std;` in headers
- Use `clang-format` — run before committing
- Naming: `PascalCase` for types/classes, `snake_case` for functions, `kConstant` or `UPPER_SNAKE` for constants, `snake_case_` for member variables

### C#
- Follow Microsoft naming conventions (PascalCase for methods/classes, camelCase for locals)
- Prefer `var` when type is obvious from context
- Use `async/await` properly — no `.Result` or `.Wait()` on async calls
- Null-safety first: use nullable types and null-coalescing operators

### Python
- Follow PEP 8
- Type hints on all function signatures
- f-strings over `.format()` or `%`
- `pathlib` over `os.path`
- Context managers (`with`) for resources
- Explicit over implicit — avoid clever one-liners that hurt readability

### JavaScript / TypeScript
- TypeScript preferred over JS — always use strict mode
- `const` by default, `let` only when reassignment is needed, never `var`
- Async/await over `.then()` chains
- Explicit return types on TypeScript functions
- No `any` unless absolutely unavoidable — use `unknown` + type narrowing
- Destructuring where it improves readability

### HTML / CSS
- Semantic HTML (`<nav>`, `<main>`, `<section>`, etc.)
- BEM or consistent class naming
- CSS custom properties (`--var`) for colors/spacing
- Mobile-first responsive design
- No inline styles unless dynamic/necessary

### React
- Functional components only
- `useEffect` only when truly needed — prefer derived state
- Extract reusable logic into custom hooks
- Props interface typed explicitly in TypeScript
- Keep components small; split when a component does more than one thing
- When using Tailwind + shadcn/ui: component layer via Radix UI primitives, utility-first Tailwind for styling, semantic tokens for theming

---

## 🔒 Security

**Before any commit — check all of these:**
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized HTML output)
- [ ] CSRF protection enabled
- [ ] Authentication/authorization verified
- [ ] Rate limiting on all endpoints
- [ ] Error messages don't leak sensitive data

**Secret management:** Always use environment variables or a secret manager. Never commit secrets. Rotate any that may have been exposed.

If a security issue is found: **stop immediately**, fix it before continuing, review the entire codebase for similar issues.

---

## 🗄️ Backend / Database (Supabase)

- Always use Row Level Security (RLS) — no exceptions
- Prefer Supabase client methods over raw SQL where possible
- For edge functions: validate input, handle errors, return consistent response shapes
- Never expose service role keys client-side
- Use `.single()` carefully — handle `null` results explicitly

---

## 🤖 Discord Bots (Python)

- Use `discord.py` or `nextcord` with cogs for modular structure
- Prefer slash commands over prefix commands
- Always defer long-running interactions with `interaction.response.defer()`
- Handle `discord.NotFound`, `discord.Forbidden` exceptions explicitly
- Store config in `.env`, never hardcode tokens

---

## ✅ Best Practices (Universal)

- **DRY** – Don't repeat yourself; extract repeated logic
- **YAGNI** – Don't build what isn't needed yet
- **Fail fast** – Validate inputs early, return/throw early
- **Logging** – Use proper log levels; don't leave `console.log`/`print` debug clutter
- **Git** – Commit frequently with meaningful messages (imperative mood: "Add feature X", not "Added")

---

## 🚫 Anti-Patterns to Avoid

- Deeply nested callbacks or promise chains
- Catch-all `except Exception: pass` or empty catch blocks
- Global mutable state
- Functions longer than ~40 lines without good reason
- Hardcoded paths, URLs, or credentials
- Ignoring linting warnings
- Testing mock behavior instead of real behavior
- Claiming completion without running verification

---

## 📁 Project Context Awareness

- If a `README.md` exists, respect the described architecture
- If a `package.json`, `requirements.txt`, `Cargo.toml`, or similar exists, stay within those dependencies unless asked to add new ones
- If tests exist, don't break them — update them if behavior changes
- Match the existing code style of the file being edited, even if it differs from defaults
