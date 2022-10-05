<template>
  <div class="mk-AppLocaleSelector">
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
    <!-- <ChevronDownIcon /> -->
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
// import ChevronDownIcon from '@heroicons/vue/24/outline/ChevronDownIcon';
import { persistLocale } from '@src/lib/modules/i18n';

const { t, locale, availableLocales } = useI18n();

watch(locale, persistLocale);

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppLocaleSelector {
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

    svg {
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
