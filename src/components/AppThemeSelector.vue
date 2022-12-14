<template>
  <AppInputSelect
    v-model="state"
    class="mk-AppThemeSelector"
    :options="options"
  />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { InputState, SelectInputOption } from '@src/definition';
import { useThemeStore } from '@src/stores/theme';
import { computed, ref, watch } from 'vue';
import { createInputState } from '@src/composables/useInput';
import AppInputSelect from '@src/components/io/AppInputSelect.vue';

const themeStore = useThemeStore();

const { t } = useI18n();

type SelectInputValue = string;

const options = computed<SelectInputOption<SelectInputValue>[]>(() => themeStore.themes.map((theme) => ({
  label: t(`melkor.theme.${theme}`),
  value: theme,
})));

const state = ref<InputState<SelectInputValue>>(
  createInputState({
    value: themeStore.theme,
  }),
);

watch(() => state.value.value, (newValue) => {
  if (newValue !== themeStore.theme) {
    themeStore.updateTheme(newValue);
  }
});

watch(() => themeStore.theme, (newTheme) => {
  if (newTheme !== state.value.value) {
    state.value.value = newTheme;
  }
});
</script>
