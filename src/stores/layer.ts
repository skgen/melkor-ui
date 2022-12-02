import { defineStore } from 'pinia';
import { warn } from '@src/lib/modules/logger';

export const useLayerStore = defineStore({
  id: 'layer',
  state: () => ({
    fsModalCount: 0,
  }),
  getters: {
    fsLayerActive: (state) => state.fsModalCount > 0,
  },
  actions: {
    mutateFsLayer(active: boolean) {
      if (active) {
        this.fsModalCount += 1;
      } else if (this.fsModalCount > 0) {
        this.fsModalCount -= 1;
      } else {
        warn('Something went wrong... a remove mutation fired in fullscreen layer while no active modal exists.');
      }

      if (this.fsLayerActive) {
        document.body.setAttribute('data-fs-modal', 'true');
      } else {
        document.body.removeAttribute('data-fs-modal');
      }
    },
  },
});

export default {};
