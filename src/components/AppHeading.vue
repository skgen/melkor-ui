<template>
  <h1
    v-if="props.h1"
    v-theme="{ scheme }"
    class="mk-Heading"
  >
    <slot />
  </h1>
  <h2
    v-if="props.h2"
    v-theme="{ scheme }"
    class="mk-Heading"
  >
    <slot />
  </h2>
  <h3
    v-if="props.h3"
    v-theme="{ scheme }"
    class="mk-Heading"
  >
    <slot />
  </h3>
  <h4
    v-if="props.h4"
    v-theme="{ scheme }"
    class="mk-Heading"
  >
    <slot />
  </h4>
</template>

<script lang="ts" setup>
import useComponentTheme from '@src/composables/useComponentTheme';

  type Props = {
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;
  };

const props = defineProps<Props>();

const { scheme } = useComponentTheme();

if (!props.h1 && !props.h2 && !props.h3 && !props.h4) {
  throw new Error('AppHeading requires at least one heading level');
}
</script>

<style lang="scss">
h1.mk-Heading {
    font-size: 30px;
}

h2.mk-Heading {
    font-size: 24px;
}

h3.mk-Heading {
    font-size: 18px;
}

h4.mk-Heading {
    font-size: 14px;
}
</style>
