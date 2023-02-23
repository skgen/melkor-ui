import { useFloatingLayerStore } from '@src/stores/floating-layer';
import useTheme from '@src/composables/useTheme';
import {
  onUnmounted, onUpdated, ref, useAttrs, watch, type DefineComponent, type Ref,
} from 'vue';
import { clone } from 'lodash';

type HookParams = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  floatingEl: Ref<DefineComponent<{}, {}, any>>;
};

export default function useFloatingModal(params: HookParams) {
  const { floatingEl } = params;
  const { theme } = useTheme();
  const layerStore = useFloatingLayerStore();

  const attrs = useAttrs();

  const spreadAttrs = ref(attrs);

  onUpdated(() => {
    spreadAttrs.value = clone(attrs);
  });

  function getModalId() {
    if (!floatingEl.value) {
      return null;
    }
    const el = floatingEl.value.$el as HTMLElement;
    const child = el.children[0] as HTMLElement | undefined;
    if (!child) {
      return null;
    }
    const id = child.getAttribute('aria-describedby');
    return id;
  }

  function handleShow() {
    const id = getModalId();
    if (!id) {
      return;
    }
    layerStore.showModal(id);
    if (theme?.value) {
      layerStore.updateModalTheme(id, theme.value.theme);
    }
    layerStore.updateModalAttributes(id, spreadAttrs.value);
  }

  function handleHide() {
    const id = getModalId();
    if (!id || !theme) {
      return;
    }
    layerStore.hideModal(id);
  }

  function handleMutate(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      const target = mutation.target as HTMLElement;
      if (mutation.attributeName === 'class') {
        if (target.classList.contains('v-popper--shown')) {
          handleShow();
        }
      }
    }
  }

  const observer = new MutationObserver(handleMutate);

  watch(() => theme?.value, (newTheme) => {
    const id = getModalId();
    if (!id || !newTheme) {
      return;
    }
    layerStore.updateModalTheme(id, newTheme.theme);
  });

  watch(spreadAttrs, (newSpreadAttributes, oldSpreadAttributes) => {
    const id = getModalId();
    if (!id) {
      return;
    }
    layerStore.updateModalAttributes(id, newSpreadAttributes, oldSpreadAttributes);
  });

  watch(() => floatingEl.value?.$el, (newElement) => {
    if (!newElement) {
      return;
    }
    observer.disconnect();
    observer.observe(newElement, {
      attributeFilter: ['class'],
    });
  }, {
    immediate: true,
  });

  onUnmounted(() => {
    observer.disconnect();
    handleHide();
  });

  return {
    handleShow,
    handleHide,
  };
}
