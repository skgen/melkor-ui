<template>
  <div
    class="mk-AppAlert"
    :data-type="type"
  >
    <div class="mk-AppAlert-wrapper">
      <mk-icon
        :icon="icon"
        fill
      />
      <div class="mk-AppAlert-main">
        <span class="mk-AppAlert-title">
          <slot />
        </span>
        <span class="mk-AppAlert-content">
          <slot name="content" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isValue } from '@src/lib/modules/definition';
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
  icon?: string;
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

const icon = computed(() => {
  if (isValue(props.icon)) {
    return props.icon;
  }
  if (props.success) {
    return 'check_circle';
  }
  if (props.warning) {
    return 'warning';
  }
  if (props.error) {
    return 'error';
  }
  if (props.info) {
    return 'info';
  }
  return 'info';
});
</script>

<style lang="scss">
.mk-AppAlert {
    --mk-alert-background-color: var(--app-background-color);
    --mk-alert-border-color: var(--app-border-color-highlight);
    --mk-alert-padding-x: var(--app-m-3);
    --mk-alert-padding-y: var(--app-m-2);
    --mk-alert-border-radius: calc(var(--app-border-radius) * 2);
    --mk-alert-icon-size: 24px;

    display: block;
    padding: var(--mk-alert-padding-x) var(--mk-alert-padding-y);
    background-color: var(--mk-alert-background-color);
    border: 1px solid var(--mk-alert-border-color);
    border-radius: var(--mk-alert-border-radius);

    &-wrapper {
        display: flex;
        gap: var(--mk-alert-padding-x);
        align-items: center;
    }

    &-main {
        display: flex;
        flex-direction: column;
        gap: var(--app-m-1);
    }

    .mk-AppIcon {
        --mk-icon-size: var(--mk-alert-icon-size);
        --mk-icon-color: var(--mk-alert-border-color);
    }

    &-title {
        display: block;
        font-weight: 500;
    }

    &-content {
        display: block;
        font-size: 0.875rem;
        letter-spacing: 0.1em;
    }

    &[data-type="info"] {
        --mk-alert-border-color: var(--app-info-color);
        --mk-alert-background-color: var(--app-info-color-soft);
    }

    &[data-type="success"] {
        --mk-alert-border-color: var(--app-success-color);
        --mk-alert-background-color: var(--app-success-color-soft);
    }

    &[data-type="warning"] {
        --mk-alert-border-color: var(--app-warning-color);
        --mk-alert-background-color: var(--app-warning-color-soft);
    }

    &[data-type="error"] {
        --mk-alert-border-color: var(--app-error-color);
        --mk-alert-background-color: var(--app-error-color-soft);
    }
}
</style>
