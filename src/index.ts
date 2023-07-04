import 'normalize.css';
import 'floating-vue/dist/style.css';
import '@style/main.scss';

export * from '@src/components';

export * from '@src/definition';

export * from '@src/composables/useForm';
export { default as useForm } from '@src/composables/useForm';
export * from '@src/composables/useInput';
export { default as useInput } from '@src/composables/useInput';
export { default as useTheme } from '@src/composables/useTheme';

export * from '@src/lib/models/time';

export * from '@src/lib/modules/clipboard';
export * from '@src/lib/modules/date';
export * from '@src/lib/modules/definition';
export * from '@src/lib/modules/file';
export * from '@src/lib/modules/i18n';
export * from '@src/lib/modules/math';
export * from '@src/lib/modules/theme';
export * from '@src/lib/modules/icons';

export { default as createMelkorUi } from '@src/plugin';
export type { PluginOptions } from '@src/plugin';
