<template>
  <div
    v-if="active"
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

type Props = {
  value: unknown;
};

const props = defineProps<Props>();

const index = inject<WritableComputedRef<unknown>>('layer-index');

const active = computed(() => index?.value === props.value);

</script>
