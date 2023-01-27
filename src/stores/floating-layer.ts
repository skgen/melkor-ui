import { defineStore } from 'pinia';
import { setElementTheme } from '@src/lib/modules/theme';

export type FloatingLayerStoreState = {
  modals: string[];
};

export const useFloatingLayerStore = defineStore({
  id: 'mk-floating-layer',
  state: (): FloatingLayerStoreState => ({
    modals: [],
  }),
  actions: {
    showModal(id: string) {
      const index = this.modals.indexOf(id);
      if (index === -1) {
        this.modals = [...this.modals, id];
      }
    },
    hideModal(id: string) {
      this.modals = this.modals.filter((mid) => mid !== id);
    },
    updateModalTheme(id: string, theme: string) {
      const el = document.getElementById(id);
      if (!el) {
        return;
      }
      setElementTheme(el, theme);
    },
  },
});

export default {};
