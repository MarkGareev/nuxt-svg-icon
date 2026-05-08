import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('custom prefix', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/custom-prefix'),
  })

  describe('wrapper class', () => {
    it('uses custom prefix as base class', async () => {
      const html = await $fetch<string>('/')
      expect(html).toContain('class="svg')
      expect(html).not.toContain('class="icon')
    })

    it('applies custom prefix_stroke for stroke-based icon', async () => {
      const html = await $fetch<string>('/')
      const spanMatch = html.match(/id="stroke-icon"[^>]*class="([^"]*)"/)
        ?? html.match(/class="([^"]*)"[^>]*id="stroke-icon"/)
      expect(spanMatch).not.toBeNull()
      expect(spanMatch![1]).toContain('svg_stroke')
      expect(spanMatch![1]).not.toContain('icon_stroke')
    })

    it('applies custom prefix_fill for fill-based icon', async () => {
      const html = await $fetch<string>('/')
      const spanMatch = html.match(/id="fill-only-icon"[^>]*class="([^"]*)"/)
        ?? html.match(/class="([^"]*)"[^>]*id="fill-only-icon"/)
      expect(spanMatch).not.toBeNull()
      expect(spanMatch![1]).toContain('svg_fill')
      expect(spanMatch![1]).not.toContain('icon_fill')
    })

    it('omits color classes when filled prop is set', async () => {
      const html = await $fetch<string>('/')
      const spanMatch = html.match(/id="filled-icon"[^>]*class="([^"]*)"/)
        ?? html.match(/class="([^"]*)"[^>]*id="filled-icon"/)
      expect(spanMatch).not.toBeNull()
      expect(spanMatch![1]).not.toContain('svg_fill')
      expect(spanMatch![1]).not.toContain('svg_stroke')
    })
  })

  describe('generated css', () => {
    it('bundles css with custom prefix selectors', async () => {
      const html = await $fetch<string>('/')
      // extract entry css href from <link rel="stylesheet">
      const cssHref = html.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1]
      expect(cssHref).toBeTruthy()
      const css = await $fetch<string>(cssHref!)
      expect(css).toContain('.svg svg')
      expect(css).toContain('.svg_fill')
      expect(css).toContain('.svg_stroke')
      expect(css).not.toContain('.icon svg')
    })
  })
})
