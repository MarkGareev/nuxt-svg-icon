export default defineNuxtConfig({
  modules: ['../src/module'],

  devtools: { enabled: true },
  compatibilityDate: '2026-05-09',

  svgIcon: {
    iconsDir: 'assets/icons',
    componentName: 'Icon',
    prefix: 'icon',
  },
})
