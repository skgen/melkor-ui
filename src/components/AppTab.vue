<template>
  <div
    v-theme="theme"
    class="mk-AppTab"
    role="tab"
    :aria-selected="active"
    @click="handleClick"
  >
    <slot />
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
    index.value = props.value;
  }
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppTab {
    --mk-tab-border-height: 4px;
    --mk-tab-border-color: var(--app-primary-color);
    --mk-tab-padding-y: var(--app-m-1);
    --mk-tab-font-weight: 500;
    --mk-tab-letter-spacing: 0.1em;

    position: relative;
    display: block;
    padding-bottom: calc(var(--mk-tab-padding-y) + var(--mk-tab-border-height));
    font-weight: var(--mk-tab-font-weight);
    letter-spacing: var(--mk-tab-letter-spacing);
    cursor: pointer;

    &::before {
        @include pseudo;

        bottom: 0;
        left: 0;
        width: 100%;
        height: var(--mk-tab-border-height);
        background-color: var(--mk-tab-border-color);
        opacity: 0;
        transition: opacity var(--app-transition-duration-opacity);
    }

    &[aria-selected="true"] {
        &::before {
            opacity: 1;
        }
    }
}
</style>
