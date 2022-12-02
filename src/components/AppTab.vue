<template>
  <div
    v-theme="theme"
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
import {
  computed,
  inject,
} from 'vue';
import useTheme from '@src/composables/useTheme';
import { tabsContextKey } from '@src/definition';

import isEqual from 'lodash/isEqual';

type Props = {
  value: unknown;
};

const props = defineProps<Props>();

const { theme } = useTheme();

const index = inject(tabsContextKey);

const active = computed(() => isEqual(index?.value, props.value));

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
    --mk-tab-border-height: 4px;

    position: relative;
    display: block;
    padding-bottom: calc(var(--app-m-1) + var(--mk-tab-border-height));
    font-weight: 500;
    letter-spacing: 0.1em;
    cursor: pointer;

    &::before {
        @include pseudo;

        bottom: 0;
        left: 0;
        width: 100%;
        height: var(--mk-tab-border-height);
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
