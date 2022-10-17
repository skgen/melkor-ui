<template>
  <router-link
    v-if="props.to"
    v-slot="{ href, navigate, isActive, isExactActive }"
    :to="props.to"
    custom
  >
    <a
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
  <button
    v-else-if="props.asButton"
    class="mk-AppLink"
    :data-wrapper="asWrapper ? 'true' : null"
    v-bind="$attrs"
  >
    <slot />
  </button>
  <template v-else>
    <span
      v-bind="$attrs"
      class="mk-AppLink"
    >
      <slot />
    </span>
  </template>
</template>

<script lang="ts" setup>
type Props = {
  to?: string;
  asButton?: boolean;
  asWrapper?: boolean;
};

const props = defineProps<Props>();
</script>

<style lang="scss">
.mk-AppLink {
    --mk-link-text-color: var(--app-text-color);
    --mk-link-text-active-color: var(--app-primary-color);

    &:not([data-wrapper="true"]) {
        display: inline-flex;
        gap: 8px;
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
