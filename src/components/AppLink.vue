<template>
  <router-link
    v-if="props.to && isRelative"
    v-slot="{ href, navigate, isActive, isExactActive }"
    :to="props.to"
    custom
  >
    <a
      v-theme="theme"
      :href="href"
      class="mk-AppLink"
      :data-wrapper="asWrapper ? 'true' : null"
      :data-active="isActive ? true : null"
      :data-exact-active="isExactActive ? true : null"
      v-bind="$attrs"
      @click="navigate"
    >
      <slot />
    </a>
  </router-link>
  <a
    v-else-if="props.to && !isRelative"
    v-theme="theme"
    :href="props.to"
    class="mk-AppLink"
    :data-wrapper="asWrapper ? 'true' : null"
    v-bind="$attrs"
  >
    <slot />
  </a>

  <button
    v-else-if="props.asButton"
    v-theme="theme"
    class="mk-AppLink"
    :data-wrapper="asWrapper ? 'true' : null"
    v-bind="$attrs"
  >
    <slot />
  </button>

  <div
    v-else
    v-theme="theme"
    v-bind="$attrs"
    class="mk-AppLink"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';
import { configContextKey } from '@src/definition';
import { computed, inject } from 'vue';

type Props = {
  to?: string;
  asButton?: boolean;
  asWrapper?: boolean;
};

const props = defineProps<Props>();

const { theme } = useTheme();

const config = inject(configContextKey);

const isRelative = computed(() => {
  if (!config?.router.active) {
    return false;
  }
  return (props.to ? !/^(http:\/\/|https:\/\/|file:\/\/|tel:|mailto:)/i.test(props.to) : false);
});
</script>

<style lang="scss">
.mk-AppLink {
    --mk-link-text-color: var(--app-text-color);
    --mk-link-text-active-color: var(--app-primary-color);
    --mk-link-gap: var(--app-m-1);

    &:not([data-wrapper="true"]) {
        display: inline-flex;
        gap: var(--mk-link-gap);
        align-items: center;
        padding: 0;
        font-size: 1rem;
        color: var(--mk-link-text-color);
        text-decoration: none;

        &[data-active="true"] {
            color: var(--mk-link-text-active-color);
            cursor: default;
        }

        &:not(span) {
            cursor: pointer;
        }
    }
}
</style>
