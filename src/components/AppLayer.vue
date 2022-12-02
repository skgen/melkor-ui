<template>
  <div
    v-if="active"
    v-theme="theme"
    class="mk-AppLayer"
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
import { layersContextKey } from '@src/definition';
import isEqual from 'lodash/isEqual';

type Props = {
  value: unknown;
};

const props = defineProps<Props>();

const { theme } = useTheme();

const index = inject(layersContextKey);

const active = computed(() => isEqual(index?.value, props.value));

</script>
