<template>
  <div class="mk-AppMenuGroup">
    <slot />
  </div>
</template>

<style lang="scss">
.mk-AppMenuGroup {
    padding: var(--app-m-1) 0;

    & + & {
        border-top: 1px solid var(--app-border-color);
    }
}
</style>
