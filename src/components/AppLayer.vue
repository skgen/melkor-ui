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
import {
  computed,
  inject,
} from 'vue';
import useComponentTheme from '@src/composables/useComponentTheme';
import { layersContextKey } from '@src/definition';
import isEqual from 'lodash/isEqual';

type Props = {
  value: unknown;
};

const props = defineProps<Props>();

const { scheme } = useComponentTheme();

const index = inject(layersContextKey);

const active = computed(() => isEqual(index?.value, props.value));

</script>
