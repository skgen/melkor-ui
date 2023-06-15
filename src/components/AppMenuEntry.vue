<template>
  <div
    class="mk-AppMenuEntry"
    :data-is-interactive="props.interactive || undefined"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
type Props = {
  interactive?: boolean;
};

const props = defineProps<Props>();
</script>

<style lang="scss">
.mk-AppMenuEntry {
    display: flex;
    gap: var(--app-m-3);
    align-items: center;
    padding: var(--app-m-1) var(--app-m-2);
    transition: background-color var(--app-transition-duration-opacity);

    &[data-is-interactive="true"] {
        cursor: pointer;

        &:hover {
            background-color: var(--app-background-color-soft-hover);
        }
    }
}
</style>
