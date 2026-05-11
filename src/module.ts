import { defineNuxtModule, addComponent, createResolver, addTemplate, addVitePlugin } from '@nuxt/kit'
import type { Config as SvgoConfig } from 'svgo'

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    svgIcon: {
      iconsDir: string
      prefix: string
    }
  }
}

export interface ModuleOptions {
  /**
   * Directory where SVG icons are stored, relative to project root.
   * Supports glob patterns for subdirectories.
   * @default 'assets/icons'
   */
  iconsDir: string

  /**
   * Name of the component registered globally.
   * @default 'Icon'
   */
  componentName: string

  /**
   * Global prefix for CSS classes on the icon element.
   * @default 'icon'
   */
  prefix: string

  /**
   * Enable automatic SVG optimization via SVGO.
   * @default true
   */
  optimize: boolean

  /**
   * Custom SVGO configuration. Only used when `optimize` is true.
   * @default {}
   */
  svgoConfig: SvgoConfig
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-svg-icon-module',
    configKey: 'svgIcon',
    compatibility: {
      nuxt: '>=3.10.0',
    },
  },
  defaults: {
    iconsDir: 'assets/icons',
    componentName: 'Icon',
    prefix: 'icon',
    optimize: true,
    svgoConfig: {},
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.svgIcon = {
      iconsDir: options.iconsDir,
      prefix: options.prefix,
    }

    const p = options.prefix
    const css = addTemplate({
      filename: 'nuxt-svg-icon-module.css',
      write: true,
      getContents: () => `
.${p} svg { width: 1em; height: 1em; vertical-align: middle; margin-bottom: 0.03em; }
.${p}_fill, .${p}_fill * { fill: currentColor; }
.${p}_stroke, .${p}_stroke * { stroke: currentColor; }
`.trimStart(),
    })
    nuxt.options.css.push(css.dst)

    addComponent({
      name: options.componentName,
      filePath: resolve('./runtime/components/Icon.vue'),
    })

    if (options.optimize) {
      addVitePlugin(svgOptimizePlugin(options.svgoConfig))
    }
  },
})

function svgOptimizePlugin(svgoConfig: SvgoConfig) {
  return {
    name: 'nuxt-svg-icon:optimize',
    enforce: 'pre' as const,
    async load(filePath: string) {
      const [path, query] = filePath.split('?')
      if (!path.endsWith('.svg') || query !== 'raw') return

      const { readFile } = await import('node:fs/promises')
      const { optimize } = await import('svgo')

      const raw = await readFile(path, 'utf8')
      const result = optimize(raw, svgoConfig)
      return `export default ${JSON.stringify(result.data)}`
    },
  }
}
