# External game-dev tools (isolated installation)

The Sweeper uses vanilla JavaScript and Canvas2D. External projects are pinned as six Git submodules under `external/` on the work branch; do not replace the already installed CCGS files under `.claude/` or `project.yaml`. The game does **not** import, run or deploy any of these external repositories by default.

## Checkout

```bash
git clone --branch docs/map-systems-20261111 --recurse-submodules https://github.com/jflakeee/the_sweeper.git
# Existing clone:
git submodule update --init --recursive
git submodule status
```

Four local Claude Code skill-directory symlinks resolve after checkout:
- `.claude/skills/external-gamedev-router` — skill router from awesome-gamedev-agent-skills
- `.claude/skills/external-dream-loop` — visual critique and iterative art workflow
- `.claude/skills/external-plinkfx` — sound design guidance
- `.claude/skills/external-pixelfx` — 2D pixel VFX guidance

This links four **skill entrypoints**. It does not silently activate every skill in the 79-skill catalog, install JavaScript packages, execute upstream hooks, configure Claude Code itself, or load any effects into the game.

## Frameworks

**Claude Code Game Studios** is already present in the current project (`.claude/`, `project.yaml`, `studio-tests/`). The separate pinned `external/Claude-Code-Game-Studios` is only a reference/upgrade source. Do not overwrite root `.claude/` or `project.yaml` without a reviewed migration.

**claude-gamedev-kit** is pinned at `external/claude-gamedev-kit`, but its Claude plugin is deliberately **not auto-enabled**, to avoid competing root hooks/agents with CCGS. To opt in from a Claude Code installation, after reviewing its plugin config:

```bash
claude plugin marketplace add dudwns0921/claude-gamedev-kit
claude plugin install gamedev-kit@claude-gamedev-kit --scope project
```

The awesome-gamedev-agent-skills upstream also supports `npx skills add gamedev-skills/awesome-gamedev-agent-skills` (Node >=22.20) for all skills. This is separate from the pinned reference/router in this work branch; review whether it conflicts with existing project skills before running.

## SFX / VFX

- `plinkfx`: reference source and skill only. To use its audio runtime in the game, select sounds and vendor a compatible, licensed player module or add a build dependency in a later reviewed change. Do not assume browsers auto-enable sound.
- `pixelfx`: reference source and skill only. Its pixel-resolution renderer is not currently attached to The Sweeper's existing Canvas2D render loop. Integrate a small relevant effect deliberately and check mobile performance and visual accuracy first.
- `dream-loop`: centered on 3D visual iteration; helpful for future 3D work, not a runtime requirement for The Sweeper.

## Verification and safety

The `external-tools.yml` workflow fetches the exact pinned submodule commits in GitHub Actions, verifies required entrypoints and four skill symlinks, and runs no downloaded install scripts or hooks. This does not prove Claude Code plugin activation on a real workstation, audio playback, a VFX frame, or browser gameplay.

Never commit credentials, download unpinned scripts for automatic execution, or merge this branch into `main` before reviewing CI, licensing and browser impact. Production Pages remains unchanged.
