<template>
  <span class="mk-AppIcon">
    {{ props.icon }}
  </span>
</template>

<script lang="ts" setup>
type Props = {
  icon: string;
};

const props = defineProps<Props>();
</script>

<style lang="scss">
.mk-AppIcon {
    --mk-icon-size: inherit;

    display: inline-block;
    font-family: "Material Symbols Outlined", sans-serif;
    font-size: var(--mk-icon-size);
    font-style: normal;
    font-weight: normal;
    font-feature-settings: "liga";
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
}
</style>
