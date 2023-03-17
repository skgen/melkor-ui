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
      :data-active="isActive ? true : null"
      :data-exact-active="isExactActive ? true : null"
      :data-wrapper="props.asWrapper || undefined"
      :data-underline="props.underline || undefined"
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
    :data-wrapper="props.asWrapper || undefined"
    :data-underline="props.underline || undefined"
    v-bind="$attrs"
  >
    <slot />
  </a>

  <button
    v-else-if="props.asButton"
    v-theme="theme"
    class="mk-AppLink"
    :data-wrapper="props.asWrapper || undefined"
    :data-underline="props.underline || undefined"
    v-bind="$attrs"
  >
    <slot />
  </button>

  <div
    v-else
    v-theme="theme"
    class="mk-AppLink"
    :data-wrapper="props.asWrapper || undefined"
    :data-underline="props.underline || undefined"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import useGlobalConfig from '@src/composables/useGlobalConfig';
import useTheme from '@src/composables/useTheme';
import { computed } from 'vue';

type Props = {
  to?: string;
  asButton?: boolean;
  asWrapper?: boolean;
  underline?: boolean;
};

const props = defineProps<Props>();

const { theme } = useTheme();

const config = useGlobalConfig();

const isRelative = computed(() => {
  if (!config.router.active) {
    return false;
  }
  return (props.to ? !/^(http:\/\/|https:\/\/|file:\/\/|tel:|mailto:)/i.test(props.to) : false);
});
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppLink {
    --mk-link-text-color-active: var(--app-primary-color);
    --mk-link-spacing: var(--app-m-1);
    --mk-link-font-size: inherit;
    --mk-link-line-height: inherit;

    @include light {
        --mk-link-text-color: var(--c-grey-30);
    }

    @include dark {
        --mk-link-text-color: var(--c-grey-80);
    }

    &:is(button) {
        padding: 0;
    }

    &:not([data-wrapper="true"]) {
        display: inline-flex;
        gap: var(--mk-link-spacing);
        align-items: center;
        padding: 0;
        font-size: var(--mk-link-font-size);
        line-height: var(--mk-link-line-height);
        color: var(--mk-link-text-color);
        text-decoration: none;
        cursor: pointer;
        transition: color var(--app-transition-duration-color);

        &[data-active="true"] {
            color: var(--mk-link-text-color-active);
            cursor: default;
        }

        &:is(div) {
            color: inherit;
            cursor: default;
        }

        &:not(div) {
            &[data-underline="true"] {
                @include underline($speed: var(--app-transition-duration-color));
            }

            &:hover {
                color: var(--mk-link-text-color-active);
            }
        }
    }
}
</style>
