import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('optimize: true (default)', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/optimize'),
  })

  it('removes comments from SVG', async () => {
    const html = await $fetch<string>('/')
    expect(html).not.toContain('<!-- comment -->')
  })

  it('removes <title> and <desc> elements', async () => {
    const html = await $fetch<string>('/')
    expect(html).not.toContain('<title>')
    expect(html).not.toContain('<desc>')
  })

  it('removes unused xmlns:xlink attribute', async () => {
    const html = await $fetch<string>('/')
    expect(html).not.toContain('xmlns:xlink')
  })

  it('still renders the icon', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('id="check-icon"')
    expect(html).toContain('<svg')
    expect(html).toContain('viewBox')
    expect(html).toContain('polyline')
  })
})

describe('optimize: false', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/no-optimize'),
  })

  it('preserves comments in SVG', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('<!-- comment -->')
  })

  it('preserves <title> and <desc> elements', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('<title>')
    expect(html).toContain('<desc>')
  })

  it('still renders the icon', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('id="check-icon"')
    expect(html).toContain('<svg')
    expect(html).toContain('viewBox')
  })
})
