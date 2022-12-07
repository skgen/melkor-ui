import type { App, Plugin } from 'vue';
import type { Router } from 'vue-router';
import type { I18n } from 'vue-i18n';
import { createPinia } from 'pinia';

import registerComponents from '@src/registerComponents';
import registerDirectives from '@src/registerDirectives';
import { setLocales } from '@src/lib/modules/i18n';
import { registerTooltipConfig } from '@src/plugins/tooltip';
import { getPreferedTheme, setDocumentTheme, setThemes } from '@src/lib/modules/theme';

export type PluginOptions = {
  router: Router;
  i18n: I18n;
  debug?: boolean;
  themes?: string[];
};

let debugMode = false;

export function isDebugMode() {
  return debugMode;
}

export default (options: PluginOptions) => {
  debugMode = options.debug ?? false;
  const themes = options.themes ?? [];

  const plugin: Plugin = {
    install(app: App) {
      app.use(options.i18n);

      setLocales(options.i18n.global.availableLocales);
      setThemes(themes);
      setDocumentTheme(getPreferedTheme());

      app.use(options.router);

      app.use(createPinia());

      registerComponents(app);
      registerDirectives(app);
      registerTooltipConfig();
    },
  };

  return plugin;
};
