<template>
  <AppInputSelect
    v-model="state"
    class="mk-AppLocaleSelector"
    :options="options"
  >
    <template #option="{ option }">
      {{ $t(`melkor.i18n.${option.value}`) }}
    </template>
  </AppInputSelect>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { persistLocale } from '@src/lib/modules/i18n';
import AppInputSelect from '@src/components/io/AppInputSelect.vue';
import type { InputState, SelectInputOption } from '@src/definition';
import { createInputState } from '@src/composables/useInput';

const { t, locale, availableLocales } = useI18n();

watch(locale, persistLocale);

type SelectInputValue = string;

const options = computed<SelectInputOption<SelectInputValue>[]>(() => availableLocales.map((availableLocale) => ({
  label: t(`melkor.i18n.${availableLocale}`),
  value: availableLocale,
})));

const state = ref<InputState<SelectInputValue>>(
  createInputState({
    value: locale.value,
  }),
);

watch(() => state.value.value, (newValue) => {
  if (newValue !== locale.value) {
    locale.value = newValue;
  }
});

watch(locale, (newLocale) => {
  if (newLocale !== state.value.value) {
    state.value.value = newLocale;
  }
});

</script>
