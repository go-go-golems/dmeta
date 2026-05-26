# Tailwind CSS Library Packaging: Research Summary

Sources analyzed:
1. TW Discussion #18545 — Best practices for distributing React component libraries (2025)
2. StackOverflow — Tailwind v4 styles not applied in packages/components (2025)
3. skovy.dev — Build a library with tsup and Tailwind (2023, TW v3 era)
4. Tailkits — Guide to Tailwind @source Directive
5. Tailwind v4 official docs — Detecting classes in source files
6. DaisyUI — Install docs (TW v4 `@plugin` approach)
7. Flowbite — Quickstart docs (TW v4 `@source` + `@plugin` approach)
8. Tailwind v4 official docs — Functions and directives

---

## Three Packaging Strategies

### Strategy A: Pre-built CSS (compile in the package, ship dist/*.css)

**Used by:** The skovy/tsup approach (Tailwind v3 era)

The library runs Tailwind as a build step, producing a `dist/styles.css` that contains all the CSS the library needs. Consumers import this CSS file.

```js
// Consumer app
import "@go-go-golems/pbui/dist/styles.css";
```

**Pros:**
- Zero consumer configuration needed — just import the CSS
- No `@source` directives needed
- Works regardless of consumer's Tailwind version (or even without Tailwind)
- No class name collisions if you use a `prefix` (e.g. `clim-`)

**Cons:**
- No tree-shaking — consumer gets ALL library CSS, even unused components
- Class name collisions possible (if no prefix) — your `.p-4` may fight with theirs
- Preflight (global reset) conflicts — must disable `preflight` in library build
- Theme tokens cannot be overridden by consumer's `@theme` — the values are baked in
- Dark mode conflicts — your `dark:` variant may not match consumer's dark mode strategy

**When to use:** Library where you control both library and consumer, or when you don't need theme customization.

---

### Strategy B: Source-level distribution (ship uncompiled .tsx, consumer runs Tailwind)

**Used by:** Flowbite, HeroUI, and our current `@go-go-golems/pbui`

The library ships uncompiled TypeScript/JSX source files. The consumer's Tailwind build scans the library source for class names and generates only the CSS needed.

```css
/* Consumer's index.css */
@import "tailwindcss";
@source "../node_modules/@go-go-golems/pbui";
```

**Pros:**
- Perfect tree-shaking — only used classes are generated
- Theme tokens are inherited from consumer's `@theme` — customization works naturally
- No prefix needed — same utility namespace, same tokens
- Dark mode "just works" — consumer's strategy applies
- No preflight conflicts — consumer's single Tailwind build handles everything

**Cons:**
- Consumer MUST add `@source` directive — breaks silently if they forget
- Consumer MUST use Tailwind v4 (or v3 with `content` config)
- Build is slower (Tailwind scans more files)
- Package must ship source files (not just `dist/`) — larger package, exposes internals
- Path to `@source` is relative to CSS file, not project root — fragile

**This is what we're doing now.** The `@source` fragility bit us immediately when extracting the package.

---

### Strategy C: Tailwind Plugin (register custom utilities/components via `@plugin`)

**Used by:** DaisyUI, Flowbite (partial), `@tailwindcss/typography`

The library exports a Tailwind plugin that registers custom components, utilities, and theme extensions. Consumer activates it with `@plugin`.

```css
/* Consumer's index.css */
@import "tailwindcss";
@plugin "@go-go-golems/pbui";
```

**Pros:**
- Cleanest consumer API — one line
- Plugin can register custom utilities, theme extensions, and component classes
- Works with Tailwind's build system natively
- No `@source` needed for the plugin-registered parts

**Cons:**
- `@plugin` is officially a "compatibility" feature for v3-era JS plugins — may be deprecated
- Plugin JS API is v3-oriented (uses `addComponents`, `addUtilities`) — not idiomatic v4
- Only registers static CSS — doesn't help with dynamic utility classes like `px-3`, `bg-red-500` used in component markup
- Still need `@source` for component class discovery unless you emit pre-built CSS
- Limited to what the plugin API can express — complex React components can't be plugins

**When to use:** CSS-only libraries (DaisyUI) or utility packs. Not sufficient for React component libraries.

---

## What the Major Libraries Do (Tailwind v4 era)

| Library | Strategy | Consumer Setup |
|---------|----------|----------------|
| **DaisyUI** | C: `@plugin` + CSS-only components | `@plugin "daisyui"` |
| **Flowbite** | B+C: `@source` + `@plugin` + theme import | `@import "flowbite/src/themes/default"`, `@plugin "flowbite/plugin"`, `@source "../node_modules/flowbite"` |
| **HeroUI** | B: `@source` only | `@source "../node_modules/@heroui/react"` |
| **shadcn/ui** | Copy-paste (no npm package) | N/A — source is copied into project |
| **Headless UI** | No CSS — headless components only | N/A — consumer provides all styling |

**Key insight:** Flowbite is the closest analog to our case — a React component library with Tailwind classes. They use a hybrid approach: `@source` for class discovery + `@plugin` for theme + `@import` for theme CSS variables.

---

## Recommended Strategy for @go-go-golems/pbui

### Dual-mode packaging: source + pre-built CSS

Ship **both** distribution modes and let the consumer choose:

#### Mode 1: Source (Tailwind integration) — recommended for Tailwind consumers

```css
@import "tailwindcss";
@source "../node_modules/@go-go-golems/pbui";
```

This is what we already do. It gives full tree-shaking and theme customization.

#### Mode 2: Pre-built CSS — for non-Tailwind consumers or quick setup

```js
import "@go-go-golems/pbui/dist/styles.css";
```

This would be a Tailwind-compiled CSS file containing all the library's utility classes. It requires:
- A Tailwind build step in the package (using `tsup` or similar)
- A `prefix` to avoid class name collisions (e.g. `clim-`)
- `preflight: false` in the library's Tailwind config
- The consumer can override tokens via CSS custom properties

### Concrete steps to add pre-built CSS mode

1. **Add `tsup` as a dev dependency** to the package
2. **Create a Tailwind input CSS** (`src/styles/tailwind-input.css`):
   ```css
   @import "tailwindcss";
   @source "../components";
   @source ".";
   ```
3. **Add a `tailwind.config.ts`** for the build:
   ```ts
   export default {
     content: ["./src/**/*.tsx"],
     prefix: "clim-",
     corePlugins: { preflight: false },
   }
   ```
4. **Update all component classes** to use the `clim-` prefix (or use Tailwind v4's `prefix()` function)
5. **Add `build:css` script** to `package.json`
6. **Ship the compiled CSS** via the `files` field and a new `exports` entry:
   ```json
   "exports": {
     "./dist/styles.css": "./dist/styles.css"
   }
   ```

**OR** — a simpler alternative that avoids the prefix problem:

### Simpler alternative: Safelist file + @source inline()

Ship a generated safelist file that lists every Tailwind class the package uses:

```css
/* Consumer's index.css */
@import "tailwindcss";
@source inline("min-h-screen bg-clim-bg text-clim-fg grid grid-rows-[auto_1fr_auto] flex items-center justify-between border-b border-clim-border px-3 py-2 text-sm ...");
```

This is fragile (must be regenerated on every change) but avoids scanning the package source.

---

## Immediate Improvement: Fix the @source path problem

Our current `@source` uses a relative path that only works in workspace mode:

```css
@source "../../../packages/pbui/src/**/*.tsx";
```

For published npm packages, consumers need:

```css
@source "../node_modules/@go-go-golems/pbui";
```

**Fix:** Document both patterns in the README (already done). For the workspace case, the `@source` must point to the real filesystem path since pnpm's `node_modules` resolution may not have the `.tsx` files (only the built `.js`).

**Better fix:** The package should ship its source files in the npm tarball (via the `files` field) so that `@source "../node_modules/@go-go-golems/pbui/src/**/*.tsx"` works for both workspace and published scenarios.

---

## Summary Table

| Aspect | Pre-built CSS | Source + @source | Plugin |
|--------|:---:|:---:|:---:|
| Zero consumer config | ✅ | ❌ (needs @source) | ⚠️ (needs @plugin) |
| Tree-shaking | ❌ | ✅ | ⚠️ (partial) |
| Theme customization | ⚠️ (CSS vars only) | ✅ (full @theme) | ⚠️ (via plugin) |
| Dark mode flexibility | ❌ (baked in) | ✅ (consumer's choice) | ✅ |
| Class collision risk | ⚠️ (needs prefix) | ✅ (same namespace) | ✅ |
| Works without Tailwind | ✅ | ❌ | ❌ |
| Build complexity | High (need tsup+TW build) | Low | Medium |
| Source code exposed | ❌ | ✅ | ❌ |
