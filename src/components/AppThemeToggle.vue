<template>
  <div
    v-theme="theme"
    class="mk-AppThemeToggle"
    v-bind="$attrs"
    @click="handleNext"
  >
    <div class="mk-AppThemeToggle-label">
      <span
        v-if="!props.compact"
        class="mk-AppThemeToggle-stateLabel"
      >{{ label }}</span>
      <div class="mk-AppThemeToggle-input">
        <div class="mk-AppThemeToggle-icons">
          <transition-group name="mk-fade">
            <AppIcon
              v-if="theme?.theme === Theme.light"
              icon="light_mode"
              :data-scheme="Theme.light"
              fill
            />
            <AppIcon
              v-if="theme?.theme === Theme.dark"
              icon="dark_mode"
              :data-scheme="Theme.dark"
              fill
            />
          </transition-group>
        </div>
        <div
          class="mk-AppThemeToggle-target"
          :data-scheme="theme?.theme"
        >
          <transition name="mk-fade">
            <AppIcon
              v-if="theme?.theme === Theme.auto"
              icon="settings"
              fill
            />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { Theme } from '@src/definition';
import { computed } from 'vue';
import useTheme from '@src/composables/useTheme';
import AppIcon from '@src/components/AppIcon.vue';

type Props = {
  compact?: boolean;
};

const props = defineProps<Props>();

const { t } = useI18n();

const { theme, updateTheme } = useTheme();

const label = computed(() => t(`melkor.theme.${theme?.value.theme}`));

function handleNext() {
  if (theme?.value.theme === Theme.light) {
    updateTheme(Theme.auto);
  } else if (theme?.value.theme === Theme.auto) {
    updateTheme(Theme.dark);
  } else if (theme?.value.theme === Theme.dark) {
    updateTheme(Theme.light);
  }
}
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppThemeToggle {
    --mk-theme-toggle-background-color: var(--app-border-color);
    --mk-theme-toggle-color-on-background: var(--c-white);
    --mk-theme-toggle-color-on-target: var(--c-grey-40);
    --mk-theme-toggle-spacing: var(--app-m-1);
    --mk-theme-toggle-size: 16px;
    --mk-theme-toggle-padding: 2px;
    --mk-theme-toggle-target-padding: calc(var(--mk-theme-toggle-padding) / 2);
    --mk-theme-toggle-icon-size: calc(var(--mk-theme-toggle-size) - calc(var(--mk-theme-toggle-target-padding) * 4));

    @include light {
        --mk-theme-toggle-icon-color-on-background: var(--c-grey-20);
    }

    @include dark {
        --mk-theme-toggle-icon-color-on-background: var(--c-grey-95);
    }

    $this: &;

    display: inline-block;

    &-label {
        display: flex;
        gap: var(--mk-theme-toggle-spacing);
        align-items: center;
    }

    &-stateLabel,
    &-input {
        cursor: pointer;
    }

    &-stateLabel {
        transition: opacity var(--app-transition-duration-opacity);
    }

    &-input {
        position: relative;
        display: block;
        width: calc(var(--mk-theme-toggle-size) * 2 + var(--mk-theme-toggle-padding) * 2);
        padding: var(--mk-theme-toggle-padding);
        color: var(--mk-theme-toggle-target-color);
        background-color: var(--mk-theme-toggle-background-color);
        border-radius: var(--mk-theme-toggle-size);
    }

    &-target {
        position: relative;
        width: var(--mk-theme-toggle-size);
        height: var(--mk-theme-toggle-size);
        user-select: none;
        background-color: var(--mk-theme-toggle-color-on-background);
        border-radius: 50%;
        transition: transform var(--app-transition-duration-transform);

        .mk-AppIcon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            --mk-icon-color: var(--mk-theme-toggle-color-on-target);
        }

        &[data-scheme="dark"] {
            transform: translate(100%, 0);
        }

        &[data-scheme="light"] {
            transform: translate(0, 0);
        }

        &[data-scheme="auto"] {
            transform: translate(50%, 0);
        }
    }

    .mk-AppIcon {
        --mk-icon-size: var(--mk-theme-toggle-icon-size);
    }

    &-icons {
        .mk-AppIcon {
            position: absolute;
            top: 50%;
            display: block;
            opacity: 0.6;

            --mk-icon-color: var(--mk-theme-toggle-icon-color-on-background);

            &[data-scheme="dark"] {
                left: calc((var(--mk-theme-toggle-padding) + var(--mk-theme-toggle-size) / 2));
                transform: translate(-50%, -50%);
            }

            &[data-scheme="light"] {
                right: calc((var(--mk-theme-toggle-padding) + var(--mk-theme-toggle-size) / 2));
                transform: translate(50%, -50%);
            }
        }
    }
}
</style>
