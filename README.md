# nuxt-svg-icon-module

[![npm version](https://img.shields.io/npm/v/nuxt-svg-icon-module.svg)](https://npmjs.com/package/nuxt-svg-icon-module)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-svg-icon-module.svg)](https://npmjs.com/package/nuxt-svg-icon-module)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.10%2B%20%7C%204.x-00DC82.svg)](https://nuxt.com)

Nuxt module for lazily loading inline SVG icons straight from your `assets/` directory. Icons inherit `currentColor` automatically so they fit naturally into any design system.

## Features

- **Lazy-loaded** — each SVG is loaded on demand via `import.meta.glob`, no upfront bundle cost
- **Inline SVG** — full CSS control: `color`, `stroke`, `fill`, `width`, `height`
- **`currentColor` by default** — icons follow the text color of their container
- **Subdirectory support** — organise icons into folders: `<Icon name="social/github" />`
- **Reactive** — changing the `name` prop swaps the icon without a page reload
- **SSR-safe** — uses `useAsyncData` with a unique key per instance, no hydration mismatches
- **Configurable** — custom icons directory, component name, and CSS prefix
- **Automatic optimization** — SVGs are optimized via SVGO at build time (configurable or opt-out)

## Compatibility

| nuxt-svg-icon-module | Nuxt  | Node.js |
|---------------|-------|---------|
| `^1.0.0`      | `^3.10 \|\| ^4.0` | `>=18`  |

## Setup

```bash
# pnpm
pnpm add nuxt-svg-icon-module

# npm
npm install nuxt-svg-icon-module

# yarn
yarn add nuxt-svg-icon-module
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-svg-icon-module'],
})
```

That's it. The `<Icon>` component is now available everywhere in your app — no imports needed.

## Usage

Place your SVG files in `assets/icons/`:

```
assets/
  icons/
    check.svg
    close.svg
    social/
      github.svg
      twitter.svg
```

Use the component anywhere:

```vue
<!-- Basic usage -->
<Icon name="check" />

<!-- Preserves original SVG colors -->
<Icon name="check" filled />

<!-- Subdirectory -->
<Icon name="social/github" />

<!-- Dynamic name -->
<Icon :name="currentIcon" />
```

Icons inherit `color` from their parent:

```vue
<p style="color: tomato;">
  <Icon name="check" /> Done
</p>
```

By default icons are `1em × 1em`. To set a fixed size, apply `width` and `height` directly on the component or wrap it in a container:

```vue
<!-- square icon -->
<Icon name="check" style="width: 24px; height: 24px" />

<!-- non-square icon -->
<Icon name="logo" style="width: 124px; height: 40px" />

<!-- via a wrapper -->
<div style="width: 124px; height: 40px">
  <Icon name="logo" />
</div>
```

## Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-svg-icon-module'],

  svgIcon: {
    // Directory containing SVG files, relative to project root
    iconsDir: 'assets/icons', // default

    // Name of the globally registered component
    componentName: 'Icon', // default

    // CSS class prefix applied to the wrapper <span>
    prefix: 'icon', // default

    // Automatically optimize SVGs via SVGO at build time
    optimize: true, // default

    // Custom SVGO configuration (see https://svgo.dev/docs/configuration/)
    svgoConfig: {}, // default
  },
})
```

## Props

| Prop     | Type      | Default | Description                                                    |
|----------|-----------|---------|----------------------------------------------------------------|
| `name`   | `string`  | —       | Icon path relative to `iconsDir`, without `.svg` extension     |
| `filled` | `boolean` | `false` | When `true`, preserves the SVG's original fill and stroke colors |
| `label`  | `string`  | —       | Accessible label announced by screen readers. When omitted, the icon is hidden from assistive technologies (`aria-hidden="true"`) |

## Accessibility

By default, icons are decorative and hidden from screen readers via `aria-hidden="true"`. When an icon carries meaning, pass the `label` prop — the icon will be announced by assistive technologies:

```vue
<!-- decorative — screen readers skip this -->
<Icon name="check" />

<!-- meaningful — screen readers announce "Close dialog" -->
<Icon name="close" label="Close dialog" />
```

## TypeScript: `IconName` type

The module generates an `IconName` type — a string union of every icon name derived from your `iconsDir` at build time. It is automatically available in `vue` component props via the global components augmentation, and can also be imported explicitly:

```ts
import type { IconName } from 'nuxt-svg-icon-module'

const icon = ref<IconName>('check')
```

This gives you autocomplete and type-safety wherever you pass an icon name — in scripts, composables, or typed component props.

If no SVG files are found in `iconsDir`, `IconName` falls back to `string`.

## How it works

The component uses Vite's `import.meta.glob` with the `?raw` query to import SVG files as plain strings at build time. At runtime:

1. The component calls `useAsyncData` with a key unique per instance (via `useId`) and icon name — so multiple `<Icon name="check" />` on the same page share one request but never conflict
2. The raw SVG string is injected via `v-html` inside a `<span>` wrapper
3. If the SVG contains a `stroke` attribute (and `filled` is not set), `.icon_stroke` is applied — making `stroke` inherit `currentColor`. Otherwise `.icon_fill` is applied for `fill`
4. The `filled` prop skips both classes, leaving the SVG colors untouched

Only icons that are actually rendered get bundled — unused SVGs are tree-shaken automatically.

> **Security note:** SVG content is injected via `v-html`. Never pass untrusted or user-supplied SVG strings through this component — only serve icons from your own `iconsDir`. Injecting arbitrary SVG can lead to XSS attacks.

## Contributing

```bash
# clone and install
git clone https://github.com/markgareev/nuxt-svg-icon-module.git
cd nuxt-svg-icon-module
pnpm install

# prepare stubs and start playground
pnpm dev:prepare
pnpm dev

# run tests
pnpm test

# lint
pnpm lint
```

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](./LICENSE)
