<template>
  <span class="mk-AppInputHint">
    <slot />
  </span>
</template>

<style lang="scss">
.mk-AppInputHint {
    --input-hint-color: var(--app-text-color-soft);

    font-size: 0.8rem;
    color: rgb(var(--input-hint-color));
}
</style>
