<template>
  <button
    v-theme="theme"
    class="mk-AppInputTextableCancel"
  >
    <slot>
      <AppIcon
        icon="cancel"
        fill
      />
    </slot>
  </button>
</template>

<script lang="ts" setup>
import AppIcon from '@src/components/AppIcon.vue';
import useTheme from '@src/composables/useTheme';

const { theme } = useTheme();
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputTextableCancel {
    --mk-input-textable-cancel-color: var(--app-input-icon-color);
    --mk-input-textable-cancel-size: var(--app-input-icon-size);

    padding: 0;

    &:not([disabled]) {
        cursor: pointer;

        @include expand-click-area;
    }

    .mk-AppIcon {
        --mk-icon-size: var(--mk-input-textable-cancel-size);
        --mk-icon-color: var(--mk-input-textable-cancel-color);

        display: block;
    }
}
</style>
