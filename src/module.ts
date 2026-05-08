import { defineNuxtModule, addComponent, createResolver, addTemplate } from '@nuxt/kit'

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
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Pass module options to the runtime component via runtimeConfig
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
  },
})
