<template>
  <div
    v-theme="{ scheme }"
    class="mk-AppTab"
    role="tab"
    :aria-selected="active"
    @click="handleClick"
  >
    <span>
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { WritableComputedRef } from 'vue';
import {
  computed,
  inject,
} from 'vue';
import useComponentTheme from '@src/composables/useComponentTheme';

type Props = {
  value: unknown;
};

const props = defineProps<Props>();

const { scheme } = useComponentTheme();

const index = inject<WritableComputedRef<unknown>>('tabs-index');

const active = computed(() => index?.value === props.value);

function handleClick() {
  if (index) {
    if (index.value !== props.value) {
      index.value = props.value;
    } else {
      index.value = undefined;
    }
  }
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppTab {
    --mk-tab-border-size: 4px;

    position: relative;
    display: block;
    padding-bottom: calc(var(--app-m-1) + var(--mk-tab-border-size));
    font-weight: 500;
    letter-spacing: 0.1em;
    cursor: pointer;

    &::before {
        @include pseudo;

        bottom: 0;
        left: 0;
        width: 100%;
        height: var(--mk-tab-border-size);
        background-color: var(--app-primary-color);
        opacity: 0;
        transition: opacity 128ms;
    }

    &[aria-selected="true"] {
        &::before {
            opacity: 1;
        }
    }
}
</style>
