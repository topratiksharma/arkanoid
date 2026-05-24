# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server (ng serve)
npm run build      # Production build → dist/arkanoid/
npm run watch      # Build in watch mode (development config)
npm test           # Run Karma/Jasmine tests (opens Chrome)
npm run lint       # ESLint (angular-eslint)
```

To run a single spec file, use the Angular CLI directly:
```bash
npx ng test --include='**/game.component.spec.ts'
```

## Architecture

This is an **Angular 16** app rendering a Pong-style game on a **vanilla HTML5 Canvas** (no game engine). Angular is used only for component scaffolding, routing, and Material UI — all game logic runs in plain TypeScript classes.

### Game loop

`GameComponent` (`src/app/game/game.component.ts`) owns the canvas and drives two parallel loops:
- **Render loop** — `requestAnimationFrame` draws the canvas each frame
- **Physics loop** — `setInterval` at 60 ticks/sec calls `Game.tick()` to advance state

### Core game classes (`src/app/game/helper-classes/`)

| Class | File | Role |
|---|---|---|
| `MoveableObject` | `moveableObject.ts` | Abstract base: position, speed, collision boundaries |
| `Ball` | `ball.ts` | Extends MoveableObject; `reverseX/Y()`, spin via `setVerticalSpeedRatio()` |
| `Paddle` | `paddle.ts` | Extends MoveableObject; acceleration/deceleration methods |
| `Game` | `game.ts` | Owns `ball`, `player1`, `player2`; runs `tick()`, `checkCollisions()`, `checkScore()` |

**Collision spin formula** (in `Game.checkCollisions()`):
```
vsr = -(ballY - paddleCenterY) / (paddleTopY - paddleCenterY)
```
This makes the ball curve based on where it hits the paddle.

### Data flow

```
KeyboardEvent (HostListener)
  → ControlState { up, down, w, s }
  → Game.tick(controlState, isTwoPlayerMode)
      → movePlayer1Paddle() / movePlayer2Paddle() / movePlayer2PaddleAuto()
      → checkCollisions()    (bounce + spin)
      → checkScore()         (resets ball, increments score)
  → renderFrame()            (draws canvas from game state)
```

### Module structure

- `AppModule` → lazy-loads `GameModule` at route `/`
- `GameModule` — declares `GameComponent`, imports Angular Material modules
- `SharedModule` — `FooterComponent`, `InstructionsComponent`
- `types.ts` — shared interfaces: `Position`, `SpeedRatio`, `Boundaries`, `ControlState`
- `contants.ts` — keybindings (`CONTROLS`) and colors (`CONFIG`)

### Component selectors & linting

All custom components use the `ark` prefix (e.g., `ark-game`, `ark-footer`). ESLint enforces this via `@angular-eslint`. Prettier uses default settings (empty `.prettierrc.json`).

### Canvas dimensions

Game canvas: **900×600 px**. Game boundary (physics): **800×600 px**. Player 1 paddle starts at x=5 (left), Player 2 at x=795 (right).
