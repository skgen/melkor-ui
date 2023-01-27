import { defineStore } from 'pinia';
import { warn } from '@src/lib/modules/logger';

export type FullscreenLayerStoreState = {
  modalCount: number;
};

export const useFullscreenLayerStore = defineStore({
  id: 'mk-fullscreen-layer',
  state: (): FullscreenLayerStoreState => ({
    modalCount: 0,
  }),
  getters: {
    isActive: (state) => state.modalCount > 0,
  },
  actions: {
    mutateLayer(active: boolean) {
      if (active) {
        this.modalCount += 1;
      } else if (this.modalCount > 0) {
        this.modalCount -= 1;
      } else {
        warn('Something went wrong... a remove mutation fired in fullscreen layer while no active modal exists.');
      }

      if (this.isActive) {
        document.body.setAttribute('data-fullscreen-modal', 'true');
      } else {
        document.body.removeAttribute('data-fullscreen-modal');
      }
    },
  },
});

export default {};
