<template>
  <slot v-if="display" />
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core';
import { computed } from 'vue';

type Props = {
  from?: number;
  to?: number;
};

const props = defineProps<Props>();

const { width } = useWindowSize();

const displayFrom = computed(() => (props.from ? width.value >= props.from + 1 : true));
const displayTo = computed(() => (props.to ? width.value <= props.to : true));
const display = computed(() => displayFrom.value && displayTo.value);
</script>
