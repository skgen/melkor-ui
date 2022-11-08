<template>
  <div
    v-theme="{ scheme }"
    class="mk-AppLocaleSelector"
  >
    <select
      v-model="locale"
      name="app-i18n-select"
    >
      <option
        v-for="option in availableLocales"
        :key="option"
        :value="option"
        :selected="option === locale"
      >
        {{ t(`app.i18n.${option}`) }}
      </option>
    </select>
    <AppIcon icon="expand_more" />
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '@src/components/AppIcon.vue';
import { persistLocale } from '@src/lib/modules/i18n';
import useComponentTheme from '@src/composables/useComponentTheme';

const { scheme } = useComponentTheme();

const { t, locale, availableLocales } = useI18n();

watch(locale, persistLocale);

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppLocaleSelector {
    --mk-locale-selector-background-color: var(--app-input-background-color);
    --mk-locale-selector-border-color: var(--app-border-color);

    position: relative;
    display: inline-flex;
    overflow: hidden;
    background-color: var(--mk-locale-selector-background-color);
    border: 1px solid var(--mk-locale-selector-border-color);
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
        background-color: var(--mk-locale-selector-background-color);
    }
}
</style>
