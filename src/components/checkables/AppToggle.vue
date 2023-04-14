<template>
  <div
    v-theme="theme"
    class="mk-AppToggle"
    :data-is-checked="props.checked || undefined"
    :data-is-disabled="props.disabled || undefined"
  >
    <div class="mk-AppToggle-target">
      <template v-if="!props.iconInBackground">
        <slot
          v-if="props.checked && $slots['checked-icon']"
          name="checked-icon"
        />
        <slot
          v-if="!props.checked && $slots['unchecked-icon']"
          name="unchecked-icon"
        />
      </template>
    </div>
    <template v-if="props.iconInBackground">
      <transition-group name="mk-fade">
        <div
          v-if="props.checked && $slots['checked-icon']"
          class="mk-AppToggle-icon"
          data-state="checked"
        >
          <slot name="checked-icon" />
        </div>
        <div
          v-if="!props.checked && $slots['unchecked-icon']"
          class="mk-AppToggle-icon"
          data-state="unchecked"
        >
          <slot name="unchecked-icon" />
        </div>
      </transition-group>
    </template>
  </div>
</template>

<script lang="ts" setup>import useTheme from '@src/composables/useTheme';

type Props = {
  checked?: boolean;
  disabled?: boolean;
  iconInBackground?: boolean;
};

const props = defineProps<Props>();

const { theme } = useTheme();
</script>

<style lang="scss">
.mk-AppToggle {
    --mk-toggle-background-color: var(--app-input-color-disabled);
    --mk-toggle-color-active: var(--app-success-color);
    --mk-toggle-color-on-active: var(--c-white);
    --mk-toggle-color-on-background: var(--c-white);
    --mk-toggle-icon-size: calc(var(--mk-toggle-size) - calc(var(--mk-toggle-target-padding) * 2));
    --mk-toggle-padding: 2px;
    --mk-toggle-size: 16px;
    --mk-toggle-target-padding: calc(var(--mk-toggle-padding) / 2);

    $this: &;

    position: relative;
    display: block;
    width: calc(var(--mk-toggle-size) * 2 + var(--mk-toggle-padding) * 2);
    padding: var(--mk-toggle-padding);
    background-color: var(--mk-toggle-background-color);
    border-radius: var(--mk-toggle-size);
    transition:
        background-color var(--app-transition-duration-background),
        opacity var(--app-transition-duration-opacity);

    &-target {
        position: relative;
        width: var(--mk-toggle-size);
        height: var(--mk-toggle-size);
        user-select: none;
        background-color: var(--mk-toggle-color-on-background);
        border-radius: 50%;
        transition:
            background-color var(--app-transition-duration-background),
            transform var(--app-transition-duration-transform);

        .mk-AppIcon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            --mk-icon-color: var(--mk-toggle-background-color);
        }
    }

    &-icon {
        position: absolute;
        top: 50%;

        .mk-AppIcon {
            display: block;
            opacity: 0.6;

            --mk-icon-color: var(--mk-toggle-color-on-background);
        }

        &[data-state="checked"] {
            left: calc((var(--mk-toggle-padding) + var(--mk-toggle-size) / 2));
            transform: translate(-50%, -50%);
        }

        &[data-state="unchecked"] {
            right: calc((var(--mk-toggle-padding) + var(--mk-toggle-size) / 2));
            transform: translate(50%, -50%);
        }
    }

    &[data-is-checked="true"] {
        background-color: var(--mk-toggle-color-active);

        #{$this} {
            &-target {
                background-color: var(--mk-toggle-color-on-active);
                transform: translate(100%, 0);

                .mk-AppIcon {
                    --mk-icon-color: var(--mk-toggle-color-active);
                }
            }
        }
    }

    &[data-is-disabled="true"] {
        background-color: var(--app-input-color-disabled);
        opacity: var(--app-input-opacity-disabled);

        #{$this} {
            &-target {
                .mk-AppIcon {
                    --mk-icon-color: var(--app-input-color-disabled);
                }
            }
        }
    }
}
</style>
