<template>
  <div
    class="mk-AppAlert"
    :data-type="type"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

enum Type {
  basic = 'basic',
  success = 'success',
  warning = 'warning',
  error = 'error',
  info = 'info',
}

type Props = {
  success?: boolean;
  warning?: boolean;
  error?: boolean;
  info?: boolean;
};

const props = defineProps<Props>();

const type = computed(() => {
  if (props.success) {
    return Type.success;
  }
  if (props.warning) {
    return Type.warning;
  }
  if (props.error) {
    return Type.error;
  }
  if (props.info) {
    return Type.info;
  }
  return Type.basic;
});
</script>

<style lang="scss">
.mk-AppAlert {
    padding: 10px;

    &[data-type="basic"] {
        background-color: var(--app-background-color);
    }

    &[data-type="info"] {
        background-color: var(--app-info-color);
    }

    &[data-type="success"] {
        background-color: var(--app-success-color);
    }

    &[data-type="warning"] {
        background-color: var(--app-warning-color);
    }

    &[data-type="error"] {
        background-color: var(--app-error-color);
    }
}
</style>
