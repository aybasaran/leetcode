# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal LeetCode study repo built for someone who wants to **solve LeetCode problems in Go _and_ deeply learn Go itself at the same time**. The Go files are not terse contest solutions — they are heavily annotated teaching artifacts that explain language fundamentals (pointers, structs, packages, `nil`, slices vs. linked lists) inline, so each solved problem doubles as a Go lesson.

Two independent, side-by-side subprojects, one per problem solved in both:

- `ui/` — a Vue 3 single-page app of **visual, step-by-step explanations** of LeetCode problems (one route per problem).
- `go/` — the **Go solutions + table-driven tests** for the same problems.

The two are linked only by a shared naming convention: each problem lives under a zero-padded `NNNN-slug` directory in both trees (e.g. `ui/src/problems/0021-merge-two-sorted-lists/` and `go/0021-merge-two-sorted-lists/`).

Comments and all user-facing copy are written in **Turkish**, in a deliberately pedagogical voice (the Go solution files are teaching artifacts). Match that language and tone when adding code or strings.

## Commands

### ui/ (run from `ui/`)
Requires Node 24 (`.nvmrc`) and pnpm 11.8 (pinned via `packageManager`).

- `pnpm dev` — Vite dev server with HMR
- `pnpm build` — type-check (`vue-tsc`) **and** build, in parallel
- `pnpm type-check` — `vue-tsc --build` only
- `pnpm lint` — runs `oxlint --fix` then `eslint --fix` in sequence (both must pass)
- `pnpm format` — Prettier over `src/`

There is **no JS test runner** (no Vitest). Correctness lives in `go/`.

### go/ (run from `go/`)
Go 1.26.

- `go test ./...` — run every problem's tests
- `go test ./0021-merge-two-sorted-lists/ -run TestMergeTwoLists -v` — single problem, verbose
- `go run .` — runs the placeholder `main.go`

## Architecture

### ui/ — registry-driven visualizations

`src/problems/registry.ts` is the **single source of truth**. Adding a problem = appending one `ProblemMeta` object to the `problems[]` array. Both the router (`src/router/index.ts`) and the home page derive their lists by `.map()`-ing over it — nothing else needs manual editing.

Each problem is its own **lazy-loaded route component** (`component: () => import(...)`). Because different problems mount different components, navigation gives a clean remount with no stale step-player state carried between problems.

The visualization engine is built from a few shared pieces:

- **`src/problems/types.ts`** — the data model. A `Step` is an immutable snapshot of the whole scene for one frame: `lanes` (linked-list rows of `LLNode`s with per-node flags like `ghost`/`compare`/`pop`), `codeLines` (1-based lines to highlight), and `message` (`MsgPart[]`, plain strings or colored emphasis).
- **`<problem>/steps.ts`** — a pure `buildSteps(): Step[]` that _runs the algorithm and records a snapshot per moment_. No imperative animation; the player just indexes into this array, so scrubbing is deterministic. A problem may expose multiple modes (e.g. `steps.ts` iterative + `recursionSteps.ts` recursive), each its own builder + raw source string.
- **`composables/useStepPlayer.ts`** — owns index/play/keyboard (←/→) navigation. Its `total` is a `MaybeRefOrGetter`, so when a `MergeView`-style toggle switches mode and the step count changes, the player adapts reactively.
- **`composables/useShikiTokens.ts`** — tokenizes the raw Go source with Shiki (real Go grammar) for the code panel; re-tokenizes when the source ref changes.
- **`components/viz/VisualizerLayout.vue`** — the shared shell (header / scene slot + side panel / control bar) that every problem view fills in.

So a new problem typically means: add a dir under `src/problems/`, write `steps.ts` (`buildSteps` + source string), write a `*View.vue` that wires `useStepPlayer` to `VisualizerLayout`, and register it in `registry.ts`.

Path alias: `@` → `src` (set in both `vite.config.ts` and tsconfig).
Stack: Vue 3.5, Vite 8, Nuxt UI 4 (`UApp`, `i-lucide-*` icons), Pinia (installed, no stores yet), Tailwind 4, vue-router 5.

### go/ — one package per problem

`main.go` is a placeholder. Each solution dir is its **own package named after the problem** (e.g. `package merge`, not `main`) so the sibling `solution_test.go` can import and call the functions directly. Tests are table-driven with `t.Run` subtests and `reflect.DeepEqual` comparisons; helpers like `build(...)`/`toSlice(...)` convert between slices and linked lists.

## Dependency hygiene (ui/)

`ui/pnpm-workspace.yaml` enforces supply-chain hardening — read it before changing dependencies:

- **`saveExact: true`** — `pnpm add` writes exact versions; never introduce `^`/`~` ranges.
- **`minimumReleaseAge: 4320`** (3 days) — pnpm refuses to resolve any version published within the last 3 days. A brand-new release will fail to install; for a genuine hotfix, add `"pkg@x.y.z"` to `minimumReleaseAgeExclude`.
- **`strictDepBuilds: true` + `allowBuilds`** — dependency lifecycle/postinstall scripts are blocked unless explicitly allowlisted. After `pnpm approve-builds`, add the package under `allowBuilds`.
- **`.npmrc`** holds only the registry pin (pnpm 11 convention); all other config lives in `pnpm-workspace.yaml`.
