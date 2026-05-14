import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { describe, it, expect } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils/e2e'

describe('TypeScript autocomplete — basic fixture', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/basic'),
  })

  function getTypesPath(): string {
    const ctx = useTestContext()
    return resolve(ctx.nuxt!.options.buildDir, 'types/nuxt-svg-icon-module.d.ts')
  }

  it('generates the .d.ts file', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    expect(content).toBeTruthy()
  })

  it('exports IconName type', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    expect(content).toContain('export type IconName =')
  })

  it('includes flat icon names', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    expect(content).toContain('"check"')
    expect(content).toContain('"fill-only"')
  })

  it('includes subdirectory icon names with slash separator', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    expect(content).toContain('"social/github"')
  })

  it('declares GlobalComponents with Icon and IconName', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    expect(content).toContain('interface GlobalComponents')
    expect(content).toContain('Icon:')
    expect(content).toContain('IconName')
  })

  it('declares LazyIcon component', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    expect(content).toContain('LazyIcon:')
  })

  it('union type members are in alphabetical order', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    const match = content.match(/export type IconName = (.+)/)
    expect(match).not.toBeNull()
    const names = match![1]
      .split('|')
      .map(s => s.trim().replace(/^"|"$/g, ''))
    expect(names).toEqual([...names].sort())
  })

  it('declares module augmentation for nuxt-svg-icon-module', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    expect(content).toContain(`declare module 'nuxt-svg-icon-module'`)
    expect(content).toContain('export type { IconName }')
  })
})
