import { configContextKey } from '@src/definition';
import { isValue } from '@src/lib/modules/definition';
import { inject } from 'vue';

export default () => {
  const context = inject(configContextKey);
  if (!isValue(context)) {
    throw new Error('useGlobalConfig must be called inside an app using Melkor plugin');
  }

  return context;
};
