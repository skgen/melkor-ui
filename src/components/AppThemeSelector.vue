<template>
  <div class="mk-AppThemeSelector">
    <select
      name="app-theme-selector"
      @change="handleChange"
    >
      <option
        v-for="option in themes"
        :key="option"
        :value="option"
        :selected="option === theme"
      >
        {{ t(`app.theme.${Theme[option]}`) }}
      </option>
    </select>
    <!-- <ChevronIcon /> -->
  </div>
</template>

<script lang="ts" setup>
// import ChevronIcon from '@heroicons/vue/24/outline/ChevronDownIcon';
import { useI18n } from 'vue-i18n';
import useTheme from '@src/composables/useTheme';
import { Theme } from '@src/lib/modules/theme';

const { themes, theme, update } = useTheme();

const { t } = useI18n();

function handleChange(evt: Event) {
  const target = evt.target as HTMLSelectElement;
  const newTheme: Theme = parseInt(target.value, 10);
  update(newTheme);
}

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppThemeSelector {
    position: relative;
    display: inline-flex;
    overflow: hidden;
    background-color: var(--app-background-color-soft);
    border: 1px solid var(--app-border-color);
    border-radius: 5px;

    select {
        width: 100%;
        padding: 5px 10px;
        color: var(--app-text-color);
        background-color: inherit;
        border: none;
        outline: none;
    }

    > svg {
        position: absolute;
        top: 52%;
        right: 5px;
        width: 16px;
        pointer-events: none;
        transform: translate(0, -50%);
    }

    &::before {
        @include pseudo;

        top: 0;
        right: 0;
        width: 15px;
        height: 100%;
        pointer-events: none;
        background-color: inherit;
    }
}
</style>
