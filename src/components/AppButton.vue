<template>
  <button
    v-theme="theme"
    class="mk-AppButton"
    :data-type="type"
    :data-size="size"
    :data-on-primary="onPrimary"
    :data-is-active="isActive"
    :disabled="disabled"
  >
    <div class="mk-AppButton-content">
      <slot />
    </div>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import useTheme from '@src/composables/useTheme';

type Props = {
  outlined?: boolean;
  disabled?: boolean;
  onPrimary?: boolean;
  active?: boolean;
  text?: boolean;
  light?: boolean;
  wide?: boolean;
};

const props = defineProps<Props>();

const { theme } = useTheme();

const type = computed(() => {
  if (props.text) {
    return 'text';
  }
  if (props.outlined) {
    return 'outlined';
  }
  if (props.light) {
    return 'light';
  }
  return 'plain';
});

const size = computed(() => {
  if (props.wide) {
    return 'wide';
  }
  return undefined;
});

const onPrimary = computed(() => props.onPrimary || undefined);
const disabled = computed(() => props.disabled || undefined);
const isActive = computed(() => props.active || undefined);

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppButton {
    // Config variables
    --mk-button-padding-x: var(--app-m-2);
    --mk-button-padding-y: var(--app-m-1);
    --mk-button-spacing-content: var(--app-m-1);
    --mk-button-main-tone-color: var(--app-primary-tone-color);
    --mk-button-text-color: var(--app-text-color);
    --mk-button-text-color-on-main-color: var(--app-text-color-on-primary);
    --mk-button-border-color: var(--app-border-color);
    --mk-button-border-width: 1px;
    --mk-button-border-radius: var(--app-border-radius);
    --mk-button-cursor: pointer;
    --mk-button-icon-color: var(--app-text-color-soft);
    --mk-button-font-size: var(--app-font-size);
    --mk-button-line-height: var(--app-line-height);
    --mk-button-font-weight: 500;

    // Computed variables
    --mk-button-bordered-padding-x: calc(var(--mk-button-padding-x) - var(--mk-button-border-width));
    --mk-button-bordered-padding-y: calc(var(--mk-button-padding-y) - var(--mk-button-border-width));
    --mk-button-wide-font-size: calc(var(--app-font-size) * 1.2);
    --mk-button-wide-padding-x: var(--mk-button-padding-x);
    --mk-button-wide-padding-y: calc(var(--mk-button-padding-y) * 1.5);
    --mk-button-main-color: rgb(var(--mk-button-main-tone-color));

    $this: &;

    position: relative;
    padding: 0;
    overflow: hidden;
    font-size: var(--mk-button-font-size);
    font-weight: var(--mk-button-font-weight);
    line-height: var(--mk-button-line-height);
    cursor: var(--mk-button-cursor);
    border: none;
    transition:
        opacity var(--app-transition-duration-background),
        color var(--app-transition-duration-background);

    .mk-AppIcon {
        --mk-icon-line-height: inherit;
    }

    @mixin icon-color() {
        .mk-AppIcon {
            transition: color var(--app-transition-duration-background);

            --mk-icon-color: var(--mk-button-icon-color);
        }
    }

    @mixin on-primary() {
        &[data-on-primary="true"] {
            @content;
        }
    }

    @mixin on-classic() {
        &:not([data-on-primary="true"]) {
            @content;
        }
    }

    @mixin is-active() {
        &[data-is-active="true"] {
            @content;
        }
    }

    @mixin content() {
        #{$this} {
            &-content {
                @content;
            }
        }
    }

    &-content {
        position: relative;
        display: flex;
        gap: var(--mk-button-spacing-content);
        align-items: center;
        justify-content: center;
        padding: var(--mk-button-padding-y) var(--mk-button-padding-x);
        border-radius: var(--mk-button-border-radius);
        transition: border-color var(--app-transition-duration-background);
    }

    &::before {
        @include pseudo;

        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        user-select: none;
        border-radius: var(--mk-button-border-radius);
        transition:
            filter var(--app-transition-duration-background),
            background-color var(--app-transition-duration-background),
            opacity var(--app-transition-duration-background);
    }

    &[data-type="plain"],
    &[data-type="light"] {
        &::before {
            background-color: var(--mk-button-main-color);
        }

        @include on-primary {
            &::before {
                background-color: var(--app-background-color-on-primary);
            }
        }
    }

    &[data-type="plain"] {
        @mixin plain-hover-active-state {
            &::before {
                filter: brightness(90%);
            }
        }

        @include not-disabled {
            &:hover, {
                @include plain-hover-active-state;
            }

            &:active {
                &::before {
                    filter: brightness(80%);
                }
            }
        }

        @include is-active {
            @include plain-hover-active-state;
        }

        @include on-classic {
            color: var(--mk-button-text-color-on-main-color);
        }

        @include on-primary {
            color: var(--app-text-color-on-background-color-on-primary);
        }
    }

    &[data-type="light"] {
        @mixin light-hover-active-state {
            @include light {
                &::before {
                    opacity: 0.2;
                }
            }

            @include dark {
                &::before {
                    opacity: 0.4;
                }
            }
        }

        @include on-classic {
            @include icon-color;

            color: var(--mk-button-text-color);

            @include light {
                &::before {
                    opacity: 0.1;
                }
            }

            @include dark {
                &::before {
                    opacity: 0.35;
                }
            }

            @include not-disabled {
                &:hover {
                    @include light-hover-active-state;
                }

                &:active {
                    @include light {
                        &::before {
                            opacity: 0.4;
                        }
                    }

                    @include dark {
                        &::before {
                            opacity: 0.5;
                        }
                    }
                }
            }

            @include is-active {
                @include light-hover-active-state;
            }
        }

        @mixin light-on-primary-hover-active-state {
            &::before {
                opacity: 0.2;
            }
        }

        @include on-primary {
            color: var(--app-text-color-on-primary);

            &::before {
                opacity: 0.1;
            }

            @include not-disabled {
                &:hover {
                    @include light-on-primary-hover-active-state;
                }

                &:active {
                    &::before {
                        opacity: 0.4;
                    }
                }
            }

            @include is-active {
                @include light-on-primary-hover-active-state;
            }
        }
    }

    &[data-type="text"] {
        color: var(--mk-button-text-color);

        @include content {
            border-color: transparent;
        }

        @mixin text-hover-active-state {
            color: var(--mk-button-main-color);

            .mk-AppIcon {
                --mk-icon-color: var(--mk-button-main-color);
            }
        }

        @include on-classic {
            @include icon-color;

            @include not-disabled {
                &:hover {
                    @include text-hover-active-state;
                }
            }

            @include is-active {
                @include text-hover-active-state;
            }

            @include on-primary {
                color: var(--app-text-color-on-primary);
            }
        }
    }

    &[data-type="outlined"] {
        @include content {
            padding: var(--mk-button-bordered-padding-y) var(--mk-button-bordered-padding-x);
            border-style: solid;
            border-width: var(--mk-button-border-width);
        }

        @mixin outlined-hover-active-state {
            @include content {
                border-color: var(--mk-button-main-color);
            }
        }

        @include on-classic {
            @include icon-color;

            color: var(--mk-button-text-color);

            @include content {
                border-color: var(--mk-button-border-color);
            }

            &::before {
                background-color: var(--mk-button-main-color);
                opacity: 0;
            }

            @include not-disabled {
                &:hover {
                    @include outlined-hover-active-state;
                }

                &:active {
                    @include light {
                        &::before {
                            opacity: 0.4;
                        }
                    }

                    @include dark {
                        &::before {
                            opacity: 0.5;
                        }
                    }
                }
            }

            @include is-active {
                @include outlined-hover-active-state;

                @include light {
                    &::before {
                        opacity: 0.15;
                    }
                }

                @include dark {
                    &::before {
                        opacity: 0.3;
                    }
                }
            }
        }

        @mixin outlined-on-primary-hover-active-state {
            @include content {
                border-color: var(--app-background-color-on-primary);
            }

            &::before {
                opacity: 0.2;
            }
        }

        @include on-primary {
            color: var(--app-text-color-on-primary);

            @include content {
                border-color: var(--app-background-color-on-primary);
            }

            &::before {
                background-color: var(--app-background-color-on-primary);
                opacity: 0;
            }

            @include not-disabled {
                &:hover {
                    @include outlined-on-primary-hover-active-state;
                }

                &:active {
                    &::before {
                        opacity: 0.4;
                    }
                }
            }

            @include is-active {
                @include outlined-on-primary-hover-active-state;
            }
        }
    }

    &[data-size="wide"] {
        font-size: var(--mk-button-wide-font-size);

        @include content {
            padding: var(--mk-button-wide-padding-y) var(--mk-button-wide-padding-x);
        }
    }

    &[disabled] {
        cursor: not-allowed;
        opacity: var(--app-opacity-disabled);
    }
}
</style>
