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

  it('removes unused xmlns:xlink attribute', async () => {
    const html = await $fetch<string>('/')
    expect(html).not.toContain('xmlns:xlink')
  })

  it('converts polyline to optimized path', async () => {
    const html = await $fetch<string>('/')
    expect(html).not.toContain('<polyline')
    expect(html).toContain('<path')
  })

  it('still renders the icon', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('id="check-icon"')
    expect(html).toContain('<svg')
    expect(html).toContain('viewBox')
  })
})
