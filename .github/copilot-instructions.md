# Copilot instructions for gooball

## Project snapshot

This repository is a small TypeScript browser game built around a canvas and a lightweight, custom game loop. The code is intentionally simple: no framework, no build pipeline beyond TypeScript compilation, and no test runner.

Key source files:
- `script.ts`: animation loop, keyboard input, and browser startup wiring.
- `graphics.ts`: canvas setup, resize handling, and drawing helpers (`strokeCircle`, `fillRect`, etc.).
- `mathutils.ts`: common geometry/math primitives such as `Vector2`, `Transform`, and `AABB`.
- `Physics.ts`: early physics shape/body abstractions; this is the extension point for future collision/rigid-body logic.
- `engine.ts`: top-level runtime glue for the game logic.
- `player.ts`: player-related logic if/when that feature is expanded.

The generated output directory is `out/`; do not edit compiled files there by hand.

## Build, test, and validation commands

Install dependencies:
```bash
npm install
```

Build the project:
```bash
npm run build
```

There is no `test` or `lint` script configured in `package.json`, and no automated test suite is present in the repo. The project’s current validation path is the TypeScript compile step (`npm run build`). If you need a compile-only check without emitting files, use:
```bash
npx tsc --noEmit
```

## Architecture notes

- The project is an ES module browser app (`"type": "module"` in `package.json` and `tsconfig.json`).
- Source files are compiled into `out/` via `tsconfig.json`, which includes all `*.ts` files at the repository root.
- The browser entry point is the canvas and animation loop; rendering and input handling are deliberately separated into utility modules.
- Math and drawing helpers are reusable primitives rather than game-specific state; keep new gameplay logic leaning on `Vector2` and the graphics helpers instead of ad hoc coordinate math.
- `Physics.ts` is a partial physics layer and is the likely place to add collision or rigid-body code; keep the geometry and body definitions consistent with the rest of the math utilities.

## Conventions specific to this repository

- Follow the project’s formatting guide in `BIG_BROTHER_FORMATTING_RULES!!!!.md` for new code:
  - PascalCase for class names
  - camelCase for everything else
  - 4-space indentation
  - keep lines reasonably short (under ~100 characters when practical)
  - keep spacing consistent and avoid gratuitous reformatting
- Keep browser-side code in the canvas/DOM pattern already used by `graphics.ts` and `script.ts`.
- Use `Vector2` and the existing math helpers for position, movement, and intersection logic instead of introducing new geometry conventions.
- Preserve the repository’s ESM convention: local imports in TypeScript use the `.js` extension (`./graphics.js`, `./mathutils.js`) even though the source files are `.ts`.
- Avoid editing generated output in `out/`; rebuild from TypeScript sources when you need fresh artifacts.

## Existing repository guidance

- `README.md` is intentionally minimal; the project is a simple canvas game and the build step is the main operational requirement.
- `build commands.md` confirms the intended compile workflow: `npm install` followed by `npm run build`.

## AI-config files

No repo-local Copilot/Cursor/Claude/AGENTS config files were present, so this document is the active project guidance for future sessions.
