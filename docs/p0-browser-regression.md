# P0-B Browser Regression Protocol (not yet executed)

Branch: docs/map-systems-20261111. Do not merge into main or deploy until the gates pass.

## Setup
- Serve repository root over localhost HTTPS or localhost HTTP with Web Locks support.
- Use fresh browser profile or back up the existing `the-sweeper-a-v1` localStorage value before tests.
- Record browser name/version, viewport, device/emulation, console output and screenshots.
- Run `node --test tests/*.test.mjs` and record exit status separately from browser results.

## B01 — Single writer / two tabs
1. Open /game/ in tab A; start game and move.
2. Open /game/ in tab B with same origin and profile.
3. Expected: B displays '다른 탭에서 실행 중이에요'; cannot modify save or start moving.
4. Close A, then select '다시 연결' in B.
5. Expected: B acquires lock, loads same v1 progress; no double credit.
6. Repeat with tab A reloaded, backgrounded and browser restarted. Capture lock availability and state.

## B02 — Storage write failure
1. Use browser devtools to instrument localStorage.setItem so the game's save key throws once (do not modify production source).
2. Trigger a sale, upgrade or finish transaction.
3. Expected: failure dialog, gameplay paused, no committed transaction or duplicate payout.
4. Restore setItem and click '저장 다시 시도' once.
5. Expected: exactly one transaction committed, UI state consistent, reload preserves same result.
6. Repeat with consecutive failures and export-current-progress action.

## B03 — Completion and reload
1. Set up a valid v1 fixture with remaining dust 1..4, enough capacity, and player at depot.
2. Click '마지막 정리' repeatedly and reload.
3. Expected: total sold 900, one-time +100 reward, invariant valid, no repeat.
4. Test remaining 5 (finish disabled) and full bag final sale separately.
5. Record actual wallet and sequence values before and after.

## B04 — Mobile interruption
- Test pointercancel, lostpointercapture, blur, visibilitychange, orientation changes, 360px viewport.
- Confirm save state, disabled actions, no stuck joystick and no accidental input while modal is open.
- Repeat on real Android Chrome and iPhone Safari; desktop emulation is not device validation.

## Acceptance
- All deterministic Node tests pass.
- B01-B03 pass with reproducible evidence and no duplicate payout, data loss or simultaneous writers.
- B04 device checks documented; any untested device remains unverified.
- Only after evidence review consider PR merge, Pages deployment, and live URL verification.

## Status
All browser cases: NOT EXECUTED. No browser screenshots or actual pass claims.
