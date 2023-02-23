import type { App, Plugin } from 'vue';
import type { Router } from 'vue-router';
import type { I18n } from 'vue-i18n';
import { createPinia } from 'pinia';

import registerComponents from '@src/registerComponents';
import registerDirectives from '@src/registerDirectives';
import { setLocales } from '@src/lib/modules/i18n';
import { registerFloatingConfig } from '@src/plugins/floating';
import { getPreferedTheme, setDocumentTheme, setThemes } from '@src/lib/modules/theme';
import { configContextKey, type MelkorConfig } from '@src/definition';
import { createI18n } from 'vue-i18n';
import defaultI18nKeys from '@src/assets/i18n/default.json';

export type PluginOptions = {
  router: Router | null;
  i18n: I18n | null;
  debug: boolean;
  themes: string[];
};

let debugMode = false;

export function isDebugMode() {
  return debugMode;
}

export default (options?: Partial<PluginOptions>) => {
  const defaultOptions: PluginOptions = {
    router: null,
    i18n: null,
    debug: false,
    themes: [],
  };

  const pluginOptions: PluginOptions = options ? {
    ...defaultOptions,
    ...options,
  } : defaultOptions;

  debugMode = pluginOptions.debug;

  const plugin: Plugin = {
    install(app: App) {
      const melkorConfig: MelkorConfig = {
        i18n: { active: false },
        router: { active: false },
      };
      // eslint-disable-next-line no-param-reassign
      app.config.globalProperties.$melkor = melkorConfig;

      if (pluginOptions.i18n) {
        app.use(pluginOptions.i18n);
        setLocales(pluginOptions.i18n.global.availableLocales);
        melkorConfig.i18n.active = true;
      } else {
        app.use(createI18n({
          legacy: false,
          locale: 'en',
          messages: { en: defaultI18nKeys },
        }));
      }

      if (pluginOptions.router) {
        app.use(pluginOptions.router);
        melkorConfig.router.active = true;
      }

      if (pluginOptions.themes) {
        setThemes(pluginOptions.themes);
      }

      setDocumentTheme(getPreferedTheme());

      app.use(createPinia());

      registerComponents(app);
      registerDirectives(app);
      registerFloatingConfig();

      app.provide(configContextKey, melkorConfig);
    },
  };

  return plugin;
};
