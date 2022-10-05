import type { App } from 'vue';
import { paramCase } from 'change-case';
import * as Components from '@src/components';
import { log } from '@src/lib/modules/logger';

export default function registerComponents(app: App) {
  Object.keys(Components).forEach((key) => {
    const dashed = paramCase(key);
    const splitted = dashed.split('-');
    if (splitted[0] === 'app') {
      splitted[0] = 'mk';
    }
    if (splitted[0] === 'the') {
      splitted[0] = 'mkt';
    }
    const name = splitted.join('-');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.component(name, Components[key]);

    const s = ['padding: 2px 0 2px 2px', 'background-color: #1E1E1E', 'color: #7D7D7D'].join(';');
    const e = ['padding: 2px 2px 2px 0', 'background-color: #1E1E1E', 'color: #7D7D7D'].join(';');
    const g = ['padding: 2px 0', 'background-color: #1E1E1E', 'color: #71C6B1'].join(';');
    // eslint-disable-next-line no-console
    log(`Registered %c<%c${name} %c/>`, s, g, e);
  });
}
