import { defineStore } from 'pinia';

const FULLSCREEN_LAYER_KEY = 'data-is-fullscreen-layer-active';

export type FullscreenLayerStoreState = {
  views: string[];
};

export const useFullscreenLayerStore = defineStore({
  id: 'mk-fullscreen-layer',
  state: (): FullscreenLayerStoreState => ({
    views: [],
  }),
  getters: {
    modalCount: (state) => state.views.length,
    isActive: (state) => state.views.length > 0,
  },
  actions: {
    showView(id: string) {
      const index = this.views.indexOf(id);
      if (index === -1) {
        this.views = [...this.views, id];
      }
      if (this.isActive) {
        document.body.setAttribute(FULLSCREEN_LAYER_KEY, 'true');
      }
    },
    hideView(id: string) {
      this.views = this.views.filter((mid) => mid !== id);
      if (!this.isActive) {
        document.body.removeAttribute(FULLSCREEN_LAYER_KEY);
      }
    },
  },
});

export default {};
