import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('custom iconsDir', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/custom-icons-dir'),
  })

  it('loads icon from custom iconsDir outside assets/', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('id="check-icon"')
  })

  it('renders svg content from custom iconsDir', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('<svg')
  })

  it('does not render icon when name is not found in custom iconsDir', async () => {
    const html = await $fetch<string>('/')
    expect(html).not.toContain('id="missing-icon"')
  })
})
