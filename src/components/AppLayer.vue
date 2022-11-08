<template>
  <div
    v-if="active"
    v-theme="{ scheme }"
    class="mk-AppLayer"
  >
    <slot />
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

const index = inject<WritableComputedRef<unknown>>('layer-index');

const active = computed(() => index?.value === props.value);

</script>
