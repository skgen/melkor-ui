import { defineStore } from 'pinia';
import { setElementTheme } from '@src/lib/modules/theme';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import styleToObject from 'style-to-object';
import { isValue } from '@src/lib/modules/definition';

export type FloatingLayerStoreState = {
  modals: string[];
};

const forbiddenKeys = ['style', 'class', 'id', 'aria-hidden', 'data-popper-placement', 'data-theme'];

function filterAttrsKeys(attrs: Record<string, unknown>) {
  return Object.entries(attrs).reduce<Record<string, unknown>>((acc, [key, entry]) => {
    if (!forbiddenKeys.includes(key)) {
      acc[key] = entry;
    }
    return acc;
  }, {});
}

function parseStyle(style: unknown) {
  if (isString(style)) {
    return styleToObject(style);
  }
  if (isObject(style)) {
    const res = Object.entries(style).reduce<Record<string, string>>((acc, [styleKey, styleValue]) => {
      if (isString(styleValue)) {
        acc[styleKey] = styleValue;
      }
      return acc;
    }, {});
    return Object.keys(res).length > 0 ? res : null;
  }
  return null;
}

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
    updateModalAttributes(id: string, newAttrs: Record<string, unknown>, oldAttrs?: Record<string, unknown>) {
      const el = document.getElementById(id);
      if (!el) {
        return;
      }
      if (oldAttrs) {
        const filteredOldAttrs = filterAttrsKeys(oldAttrs);
        for (const key of Object.keys(filteredOldAttrs)) {
          el.removeAttribute(key);
        }
      }

      const filteredNewAttrs = filterAttrsKeys(newAttrs);

      for (const [key, value] of Object.entries(filteredNewAttrs)) {
        if (isString(value)) {
          el.setAttribute(key, value);
        }
      }

      const { style } = newAttrs;
      let oldStyleCandidate = null;
      if (oldAttrs) {
        oldStyleCandidate = oldAttrs.style;
      }
      if (isValue(style)) {
        const currentStyle = parseStyle(el.getAttribute('style') ?? '');
        const newStyle = parseStyle(style);
        const oldStyle = oldStyleCandidate ? parseStyle(oldStyleCandidate) : null;

        let baseStyle = {};
        if (currentStyle) {
          if (oldStyle) {
            baseStyle = currentStyle ? Object.entries(currentStyle).reduce<Record<string, string>>((acc, [key, value]) => {
              if (!Object.keys(oldStyle).includes(key)) {
                acc[key] = value;
              }
              return acc;
            }, {}) : {};
          } else {
            baseStyle = currentStyle;
          }
        }

        const finalStyle = {
          ...newStyle,
          ...baseStyle,
        };

        const finaleStyleStr = Object.entries(finalStyle).map(([key, value]) => `${key}: ${value}`).join('; ');

        el.setAttribute('style', finaleStyleStr);
      }
    },
  },
});

export default {};
