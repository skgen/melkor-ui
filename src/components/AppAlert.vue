<template>
  <div
    v-theme="theme"
    class="mk-AppAlert"
    :data-type="type"
  >
    <div class="mk-AppAlert-wrapper">
      <slot name="icon" />
      <mk-icon
        v-if="!$slots.icon"
        :icon="icon"
        fill
      />
      <div class="mk-AppAlert-main">
        <span
          v-if="$slots['default']"
          class="mk-AppAlert-title"
        >
          <slot />
        </span>
        <span
          v-if="$slots['content']"
          class="mk-AppAlert-content"
        >
          <slot name="content" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isValue } from '@src/lib/modules/definition';
import { computed, useSlots } from 'vue';
import useTheme from '@src/composables/useTheme';

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

const slots = useSlots();

const { theme } = useTheme();

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
  if (isValue(slots.icon)) {
    return null;
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
    --mk-alert-border-radius: calc(var(--app-border-radius) * 2);
    --mk-alert-border-width: 1px;
    --mk-alert-color: var(--app-border-color);
    --mk-alert-icon-size: 24px;
    --mk-alert-padding-x: var(--app-m-3);
    --mk-alert-padding-y: var(--app-m-2);

    display: block;
    padding: var(--mk-alert-padding-x) var(--mk-alert-padding-y);
    background-color: var(--mk-alert-background-color);
    border: var(--mk-alert-border-width) solid var(--mk-alert-color);
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
        --mk-icon-color: var(--mk-alert-color);
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
        background-color: var(--app-info-color-soft);
        border-color: var(--app-info-color);

        .mk-AppIcon {
            --mk-icon-color: var(--app-info-color);
        }
    }

    &[data-type="success"] {
        background-color: var(--app-success-color-soft);
        border-color: var(--app-success-color);

        .mk-AppIcon {
            --mk-icon-color: var(--app-success-color);
        }
    }

    &[data-type="warning"] {
        background-color: var(--app-warning-color-soft);
        border-color: var(--app-warning-color);

        .mk-AppIcon {
            --mk-icon-color: var(--app-warning-color);
        }
    }

    &[data-type="error"] {
        background-color: var(--app-error-color-soft);
        border-color: var(--app-error-color);

        .mk-AppIcon {
            --mk-icon-color: var(--app-error-color);
        }
    }
}
</style>
