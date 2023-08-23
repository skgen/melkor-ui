import type { App, Plugin } from 'vue';

import registerComponents from '@src/registerComponents';
import registerDirectives from '@src/registerDirectives';
import { setLocales } from '@src/lib/modules/i18n';
import { registerFloatingConfig } from '@src/plugins/floating';
import { getPreferedTheme, setDocumentTheme, setThemes } from '@src/lib/modules/theme';
import {
  configContextKey, IconShape,
} from '@src/definition';
import merge from 'lodash/merge';
import { setDateFnsLocales, type DateFnsLocales } from '@src/lib/modules/date';

type IconOptions = {
  shape?: IconShape;
};

export type PluginOptions = {
  debug: boolean;
  themes: string[];
  dateFnsLocales?: DateFnsLocales;
  components?: {
    icon?: IconOptions;
  };
};

const defaultOptions: PluginOptions = {
  debug: false,
  themes: [],
  components: {
    icon: {
      shape: IconShape.rounded,
    },
  },
};

export type MelkorConfig = {
  components: PluginOptions['components'];
};

let debugMode = false;

export function isDebugMode() {
  return debugMode;
}

export default (options?: Partial<PluginOptions>) => {
  const pluginOptions: PluginOptions = options ? merge(merge({}, defaultOptions), options) : defaultOptions;

  debugMode = pluginOptions.debug;

  const plugin: Plugin = {
    install(app: App) {
      const melkorConfig: MelkorConfig = {
        components: pluginOptions.components,
      };

      if (pluginOptions.dateFnsLocales) {
        setDateFnsLocales(pluginOptions.dateFnsLocales);
      }

      if (!app.config.globalProperties.$pinia) {
        throw new Error('[MelkorUI] Missing pinia plugin active instance');
      }
      if (!app.config.globalProperties.$i18n) {
        throw new Error('[MelkorUI] Missing vue-i18n plugin active instance');
      }
      if (!app.config.globalProperties.$router) {
        throw new Error('[MelkorUI] Missing vue-router plugin active instance');
      }

      setLocales(app.config.globalProperties.$i18n.availableLocales);

      // eslint-disable-next-line no-param-reassign
      app.config.globalProperties.$melkor = melkorConfig;

      if (pluginOptions.themes) {
        setThemes(pluginOptions.themes);
      }

      setDocumentTheme(getPreferedTheme());

      registerComponents(app);
      registerDirectives(app);
      registerFloatingConfig();

      app.provide(configContextKey, melkorConfig);
    },
  };

  return plugin;
};
