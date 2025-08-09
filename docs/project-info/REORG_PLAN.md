# Universal Life Protocol — Production Reorganization Plan

Purpose: Provide a safe, incremental restructuring of the repository for production without breaking builds, tests, or published packages.

Phasing Summary
- Phase 0 (Complete): Add workspaces at root to orchestrate apps, libs, and packages consistently.
- Phase 1: Align TypeScript configs, unify scripts, and standardize CI hooks.
- Phase 2: Normalize repository layout (examples, tests, docs, scripts) without moving published sources yet.
- Phase 3: Migrate libraries under packages/, update imports, and remove legacy locations.
- Phase 4: Final cleanup and documentation consolidation.

Target Layout
- packages/
  - consciousness/
  - living-knowledge/
  - cue-core/
  - cue-ai-training/
  - cue-protocols/
  - cue-dev-environment/
  - cue-amgf-system/
  - cue-rectified-prototype/
- apps/
  - control-center/
  - dashboard/
  - knowledge-trie/
  - public-portal/
- examples/
  - mcp/
    - test-mcp-integration.js (authoritative MCP test)
  - demos/
    - demo-complete-system.js
    - walkthrough-demo.js
- tests/
  - unit/
  - integration/
  - system/
- docs/
  - reference/ (API_REFERENCE.md)
  - guides/ (GETTING_STARTED.md, USAGE-GUIDE.md, WORKSPACE-GUIDE.md)
  - announcements/ (ANNOUNCEMENT.md)
  - production/ (PRODUCTION_*.md)
  - research/ (SYSTEM_VERIFICATION_REPORT.md, RESEARCH_*.md)
  - archive/ (fold former docs-archive, legacy PDFs)
- scripts/ (moved .cjs runners)
- tools/ (benchmarking, testing)
- .config/ (eslint, prettier, ts base) [optional]

Phase 1 — Config & Scripts (non-breaking)
1) Workspaces (Done):
   - Added npm workspaces at root for apps/*, libs/*, packages/*.
   - New scripts: ws:build, ws:test, ws:lint, format, mcp:test.
2) TypeScript unification:
   - Ensure every package/app tsconfig.json extends tsconfig.base.json.
   - Module: keep ESM (type: module) and prefer tsx for TS runtime.
3) Script normalization:
   - Replace ad-hoc npx calls with workspace script runners gradually.

Phase 2 — Normalize layout (add-only)
- Create examples/ (mcp/, demos/) and copy authoritative tests/demos here (keep originals until Phase 3).
- Create tests/ (unit/, integration/, system/) and begin moving root test files incrementally.
- Create docs subfolders and relocate top-level docs (as copies), keep originals temporarily.
- Move .cjs runner scripts into scripts/ (copies first).

Phase 3 — Source migration (breaking, needs PR)
- Move libraries from libs/ to packages/ where publishable.
- Update import paths throughout repo.
- Remove duplicate top-level TS sources (index.ts, consciousness.ts, living-knowledge.ts) by re-exporting from packages or moving to packages/core if required.
- Delete legacy duplicates once CI green.

Phase 4 — Cleanup
- Remove duplicated files after verification.
- Consolidate docs (remove docs-unified and docs-archive after migration).
- Ensure dist/ is gitignored in each workspace package.

Operational Safety
- Work branch: MCP-codacy (current). Create feature branches per phase.
- CI: Add checks for build, lint, test across workspaces.
- Publish safety: Use Changesets or manual dry run before publishing.

Action Items (next PR)
- Scaffold examples/, tests/, docs/ subfolders (add-only).
- Add a CONTRIBUTING update describing layout conventions.
- Add CI workflow skeletons (build/test/lint).

Note
- MCP canonical test remains test-mcp-integration.js (works). During Phase 2, copy it to examples/mcp/ and wire npm script `mcp:test` to that path once migrated.
