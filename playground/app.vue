<template>
  <div class="page">
    <h1>nuxt-svg-icon-module playground</h1>

    <section class="section">
      <h2 class="section__title">
        Default (inherits currentColor)
      </h2>
      <div class="row row_large row_blue">
        <Icon name="check" />
        <Icon name="close" />
        <Icon name="arrow-right" />
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">
        Filled (original SVG colors preserved)
      </h2>
      <div class="row row_large">
        <Icon
          name="check"
          filled
        />
        <Icon
          name="close"
          filled
        />
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">
        Subdirectory: social/github
      </h2>
      <div class="row row_large">
        <Icon name="social/github" />
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">
        Dynamic name
      </h2>
      <div class="row">
        <button
          class="button"
          @click="toggle"
        >
          Toggle icon
        </button>
        <Icon
          :name="current"
          class="icon_dynamic"
          filled
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const icons = ['check', 'close', 'arrow-right']
const index = ref(0)
const current = computed(() => icons[index.value]!)
function toggle() {
  index.value = (index.value + 1) % icons.length
}
</script>

<style>
.page {
  padding: 2rem;
  font-family: sans-serif;
}

.section {
  margin-top: 2rem;
}

.section__title {
  margin-bottom: 0.75rem;
}

.row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.row_large {
  font-size: 2rem;
}

.row_blue {
  color: steelblue;
}

.button {
  cursor: pointer;
}

.icon_dynamic {
  font-size: 2rem;
  color: tomato;
}
</style>
