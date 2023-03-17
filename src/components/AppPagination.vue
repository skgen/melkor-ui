<template>
  <div
    v-theme="theme"
    class="mk-AppPagination"
  >
    <button
      class="mk-AppPagination-slot mk-AppPagination-cta"
      :disabled="!blocks.prevCta"
      @click="handlePrev"
    >
      <slot name="prev-icon" />
      <mk-icon
        v-if="!$slots['prev-icon']"
        icon="arrow_back_ios_new"
      />
    </button>
    <div class="mk-AppPagination-list">
      <button
        class="mk-AppPagination-slot mk-AppPagination-page"
        :data-active="page === firstPage || undefined"
        @click="() => handlePage(firstPage)"
      >
        {{ firstPage }}
      </button>
      <template
        v-for="(s, index) of blocks.slotsRange"
        :key="index"
      >
        <button
          v-if="isValue(s)"
          class="mk-AppPagination-slot mk-AppPagination-page"
          :data-active="s === page || undefined"
          @click="() => handlePage(s)"
        >
          {{ s }}
        </button>
        <div
          v-else
          class="mk-AppPagination-slot mk-AppPagination-gap"
        >
          <mk-icon icon="more_horiz" />
        </div>
      </template>
      <button
        class="mk-AppPagination-slot mk-AppPagination-page"
        :data-active="page === lastPage || undefined"
        @click="() => handlePage(lastPage)"
      >
        {{ lastPage }}
      </button>
    </div>
    <button
      class="mk-AppPagination-slot mk-AppPagination-cta"
      :disabled="!blocks.nextCta"
      @click="handleNext"
    >
      <slot name="next-icon" />
      <mk-icon
        v-if="!$slots['next-icon']"
        icon="arrow_forward_ios"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import usePagination from '@src/composables/usePagination';
import useTheme from '@src/composables/useTheme';
import { isValue } from '@src/lib/modules/definition';

type Props = {
  modelValue: number;
  range: [number, number];
  gap?: number;
};

type Emits = {
  (event: 'update:modelValue', page: number): void;
};

const props = withDefaults(defineProps<Props>(), {
  gap: 1,
});
const emit = defineEmits<Emits>();

const { theme } = useTheme();

const {
  page, blocks, firstPage, lastPage,
} = usePagination(reactive({
  page: computed(() => props.modelValue),
  range: computed(() => props.range),
  gap: computed(() => props.gap),
}));

function handlePrev() {
  emit('update:modelValue', page.value - 1);
}

function handleNext() {
  emit('update:modelValue', page.value + 1);
}

function handlePage(pageNumber: number) {
  emit('update:modelValue', pageNumber);
}

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppPagination {
    --mk-pagination-border-color: var(--app-border-color);
    --mk-pagination-border-color-active: var(--app-primary-color);
    --mk-pagination-border-radius: var(--app-border-radius);
    --mk-pagination-border-width: 1px;
    --mk-pagination-slot-size: 35px;
    --mk-pagination-transition-duration: var(--app-transition-duration-opacity);

    @include light {
        --mk-pagination-background-color-active: rgb(var(--app-primary-tone-color) / 0.15);
    }

    @include dark {
        --mk-pagination-background-color-active: rgb(var(--app-primary-tone-color) / 0.3);
    }

    display: flex;

    > :first-child {
        border-left: var(--mk-pagination-border-width) solid var(--mk-pagination-border-color);

        &, &::before {
            border-top-left-radius: var(--mk-pagination-border-radius);
            border-bottom-left-radius: var(--mk-pagination-border-radius);
        }
    }

    >  :last-child {
        border-right: var(--mk-pagination-border-width) solid var(--mk-pagination-border-color);

        &, &::before {
            border-top-right-radius: var(--mk-pagination-border-radius);
            border-bottom-right-radius: var(--mk-pagination-border-radius);
        }
    }

    &-list {
        display: flex;
        border-right: var(--mk-pagination-border-width) solid var(--mk-pagination-border-color);

        > * {
            border-left: var(--mk-pagination-border-width) solid var(--mk-pagination-border-color);
        }

    }

    &-cta, &-page {
        &::before {
            @include pseudo;

            top: -1px;
            right: -1px;
            bottom: -1px;
            left: -1px;
            z-index: 1;
            pointer-events: none;
            border: var(--mk-pagination-border-width) solid var(--mk-pagination-border-color-active);
            opacity: 0;
            transition: opacity var(--mk-pagination-transition-duration);
        }
    }

    &-cta {
        color: var(--app-text-color-soft);
        cursor: pointer;

        &:not([disabled]) {
            &:hover {
                &::before {
                    opacity: 1;
                }
            }
        }

        &[disabled] {
            opacity: var(--app-opacity-disabled);
        }
    }

    &-page {
        cursor: pointer;
        transition: background-color var(--mk-pagination-transition-duration);

        &::before {
            @include pseudo;

            top: -1px;
            right: -1px;
            bottom: -1px;
            left: -1px;
            z-index: 1;
            pointer-events: none;
            border: var(--mk-pagination-border-width) solid var(--mk-pagination-border-color-active);
            opacity: 0;
            transition: opacity var(--mk-pagination-transition-duration);
        }

        &:hover, &[data-active="true"] {
            background-color: var(--mk-pagination-background-color-active);

            &::before {
                opacity: 1;
            }
        }
    }

    &-slot {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--mk-pagination-slot-size);
        height: var(--mk-pagination-slot-size);
        padding: 0;
        border-top: var(--mk-pagination-border-width) solid var(--mk-pagination-border-color);
        border-bottom: var(--mk-pagination-border-width) solid var(--mk-pagination-border-color);
    }
}
</style>
