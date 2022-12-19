import type { MelkorConfig } from '@src/definition';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $melkor: MelkorConfig;
  }
}
