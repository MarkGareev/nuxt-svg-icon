import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('nuxt-svg-icon-module', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/basic'),
  })

  describe('rendering', () => {
    it('renders a span wrapper with .icon class', async () => {
      const html = await $fetch<string>('/')
      const matches = html.match(/class="icon[^"]*"/g) ?? []
      expect(matches.length).toBeGreaterThanOrEqual(1)
    })

    it('inlines svg content inside the wrapper', async () => {
      const html = await $fetch<string>('/')
      expect(html).toContain('<svg')
      expect(html).toContain('viewBox')
    })

    it('does not render a span for missing icon', async () => {
      const html = await $fetch<string>('/')
      // missing icon has no data so v-if="data?.svg" is false — no span rendered
      expect(html).not.toContain('id="missing-icon"')
    })
  })

  describe('currentColor classes', () => {
    it('adds icon_stroke class for stroke-based icon', async () => {
      const html = await $fetch<string>('/')
      const spanMatch = html.match(/id="stroke-icon"[^>]*class="([^"]*)"/)
        ?? html.match(/class="([^"]*)"[^>]*id="stroke-icon"/)
      expect(spanMatch).not.toBeNull()
      expect(spanMatch![1]).toContain('icon_stroke')
    })

    it('adds icon_fill class for fill-based icon without stroke', async () => {
      const html = await $fetch<string>('/')
      const spanMatch = html.match(/id="fill-only-icon"[^>]*class="([^"]*)"/)
        ?? html.match(/class="([^"]*)"[^>]*id="fill-only-icon"/)
      expect(spanMatch).not.toBeNull()
      expect(spanMatch![1]).toContain('icon_fill')
      expect(spanMatch![1]).not.toContain('icon_stroke')
    })

    it('omits color classes when filled prop is set', async () => {
      const html = await $fetch<string>('/')
      const spanMatch = html.match(/id="filled-icon"[^>]*class="([^"]*)"/)
        ?? html.match(/class="([^"]*)"[^>]*id="filled-icon"/)
      expect(spanMatch).not.toBeNull()
      expect(spanMatch![1]).not.toContain('icon_fill')
      expect(spanMatch![1]).not.toContain('icon_stroke')
    })
  })

  describe('subdirectory support', () => {
    it('loads icon from nested subdirectory', async () => {
      const html = await $fetch<string>('/')
      expect(html).toContain('id="subdir-icon"')
    })
  })
})
