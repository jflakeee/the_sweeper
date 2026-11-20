# P2-A — 화물 통로 구현 계획

Status: P2-A implemented on the working branch; not merged or publicly deployed. CI #102 (2026-11-20): Node 41/41, Chromium 18/18, external tools checkout passed. Physical Android/iPhone devices remain unverified. Basis: benchmark design §§13.2–14.3, 19–20.

## Scope
Sector 2 (화물 통로): 1,050 ordinary dust, first reward 120, 24×32 field. Unlock after sector 1 completion; entry is explicit and free. Wide brush free (7 dust/s, width 2.24), basic brush remains viable. Capacity 135 for 150 credits and speed ×1.1 for 150 unlock after sector 1. Keep rate upgrade ×1.2 if purchased. No drones, chance rewards, or dense dust in this slice.

Implemented deterministic layout: three non-overlapping 35-tile clusters (7×5, 10 dust per tile), origins (3,5), (14,8), (9,17), depot (12.5,26.5), spawn (12.5,25.5). Balancing remains provisional. Corridor walls deferred until traversability and collision tests exist.

## Persistence contract
Keep v1 storage intact during migration. A separately versioned v2 envelope must validate migrated state before becoming authoritative; retain v1 as recovery source, never silently fall back to stale v1 after v2 progression. Use the existing shared Web Lock. Old app versions cannot safely write a divergent campaign: document downgrade limitation and require explicit user consent for any rollback. Preserve partial dust progress, facing, player position, bag, sold, wallet, rate level and completion, including incomplete v1 campaigns. Sector entry uses one candidate transaction; retry same candidate; no repeat reward, no charge. Track per-sector sold and first completion independently; validate global wallet against cumulative sales + first rewards minus purchased upgrades. Do not silently reinterpret v1 wallet.

## Acceptance gates
- Migration fixtures: fresh, partial, upgraded, completed v1, malformed v1, v2 write failure and reload.
- Sector 1 unchanged and reward exactly once. Sector 2 unlocked only after completion. Sector 2 conservation remaining + bag + sold = 1050; finish threshold floor(1050 × .005)=5, highlight <=52.
- No-upgrade campaign total wallet 2170 after both first completions; with rate, capacity and speed level 1 purchases total 1820.
- Entry, purchase and finish failure injection and retry; duplicate input; reload; two tabs; no stale v1 fallback.
- Parameterize HUD/receipt totals, capacity, tool range, speed and rate. Render and logic use same geometry. Retain 25 existing checks, add v2 tests before enabling runtime migration.
- Browser layout and performance checks on both sectors; real device and playtime verification remain separate. Main and public deployment unchanged pending approval.

## Implementation history and release gates

Implemented: deterministic sector resources; v1-to-v2 migration and validation; atomic sector entry; tool, capacity and speed controls; save-failure and retry tests; browser migration, reload, equipment and 360px touch-target checks. CI #102 passed on commit `c0e111bdea34dbb3edaf5f809bde89bb59b00b53`.

Before merging: review the 56-commit/36-file diff, verify real Android/iPhone behavior and production deployment rollback expectations, and obtain explicit release approval. The v1 key remains untouched, but an old app build cannot interpret v2 progress; do not treat a rollback to the old build as a safe migration path.

## Original implementation order
1. Pure sector definition and invariant tests (no runtime change).
2. v2 schema and migration tests; storage switching contract.
3. Explicit sector selection and atomic transition.
4. Tool, capacity, speed upgrades and UX.
5. Browser failure/reload and end-to-end campaign tests.
