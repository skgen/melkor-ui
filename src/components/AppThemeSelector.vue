<template>
  <div class="mk-AppThemeSelector">
    <select
      name="app-theme-selector"
      @change="handleChange"
    >
      <option
        v-for="option in themeStore.themes"
        :key="option"
        :value="option"
        :selected="themeStore.isCurrentTheme(option)"
      >
        {{ t(`app.theme.${Theme[option]}`) }}
      </option>
    </select>
    <AppIcon icon="expand_more" />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { Theme } from '@src/definition';
import { useThemeStore } from '@src/stores/theme';
import AppIcon from '@src/components/AppIcon.vue';

const themeStore = useThemeStore();

const { t } = useI18n();

function handleChange(evt: Event) {
  const target = evt.target as HTMLSelectElement;
  const newTheme: Theme = parseInt(target.value, 10);
  themeStore.updateTheme(newTheme);
}

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppThemeSelector {
    --mk-theme-selector-background-color: var(--app-input-background-color);
    --mk-theme-selector-border-color: var(--app-border-color);

    position: relative;
    display: inline-flex;
    overflow: hidden;
    background-color: var(--mk-theme-selector-background-color);
    border: 1px solid var(--mk-theme-selector-border-color);
    border-radius: 5px;

    select {
        width: 100%;
        padding: 5px 10px;
        color: var(--app-text-color);
        background-color: inherit;
        border: none;
        outline: none;
    }

    .mk-AppIcon {
        position: absolute;
        top: 52%;
        right: 0;
        font-size: 16px;
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
        background-color: var(--mk-theme-selector-background-color);
    }
}
</style>
