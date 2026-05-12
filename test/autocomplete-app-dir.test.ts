import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { describe, it, expect } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils/e2e'

describe('TypeScript autocomplete — app/ directory auto-detection', async () => {
  await setup({
    rootDir: resolve(__dirname, './fixtures/app-dir'),
  })

  function getTypesPath(): string {
    const ctx = useTestContext()
    return resolve(ctx.nuxt!.options.buildDir, 'types/nuxt-svg-icon-module.d.ts')
  }

  it('picks up icons from app/assets/icons when app/ dir exists', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    expect(content).toContain('"home"')
  })

  it('picks up nested icons from subdirectory', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    expect(content).toContain('"nav/arrow"')
  })

  it('does not include icons from assets/icons (non-app path)', async () => {
    const content = await readFile(getTypesPath(), 'utf-8')
    // fixture only has icons under app/assets/icons, not assets/icons
    const match = content.match(/export type IconName = (.+)/)
    expect(match).not.toBeNull()
    const union = match![1]
    expect(union).toContain('"home"')
    expect(union).toContain('"nav/arrow"')
  })
})
