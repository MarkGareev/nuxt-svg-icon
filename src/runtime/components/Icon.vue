<template>
  <span
    v-if="data?.svg"
    :class="[
      config.prefix,
      !filled && `${config.prefix}_fill`,
      data.hasStroke && !filled && `${config.prefix}_stroke`,
    ]"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    :role="label ? 'img' : undefined"
    v-html="data.svg"
  />
</template>

<script setup lang="ts">
import { useRuntimeConfig, useAsyncData, useId } from '#app'

const props = defineProps<{
  /** Icon path relative to iconsDir, without .svg extension. Supports subdirectories: 'social/github' */
  name: string
  /** When true, keeps the SVG's original fill/stroke colors instead of inheriting currentColor */
  filled?: boolean
  /** Accessible label for the icon. When provided, the icon is announced by screen readers. When omitted, the icon is hidden from assistive technologies (aria-hidden). */
  label?: string
}>()

const {
  public: { svgIcon: config },
} = useRuntimeConfig()

const iconsImport = import.meta.glob<string>(['/**/*.svg', '!**/node_modules/**'], {
  query: '?raw',
  import: 'default',
})

async function loadIcon(name: string) {
  const path = `/${config.iconsDir}/${name}.svg`
  const loader = iconsImport[path]

  if (!loader) {
    console.error(
      `[nuxt-svg-icon-module] Icon not found: "${name}" (looked up "${path}")`,
    )
    return null
  }

  const raw = await loader()
  return {
    svg: raw,
    hasStroke: /stroke="(?!none)[^"]*"/.test(raw),
  }
}

const id = useId()

const { data } = await useAsyncData(
  `nuxt-svg-icon-module:${id}:${props.name}`,
  () => loadIcon(props.name),
  { watch: [() => props.name] },
)
</script>
