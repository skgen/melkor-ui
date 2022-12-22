import { useFloatingLayerStore } from '@src/stores/floating-layer';
import useTheme from '@src/composables/useTheme';
import {
  onMounted, onUnmounted, watch, type DefineComponent, type Ref,
} from 'vue';

type HookParams = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  floatingEl: Ref<DefineComponent<{}, {}, any>>;
};

export default function useFloatingModal(params: HookParams) {
  const { floatingEl } = params;
  const { theme } = useTheme();
  const layerStore = useFloatingLayerStore();

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
    if (!id || !theme?.value) {
      return;
    }
    layerStore.showModal(id);
    layerStore.updateModalTheme(id, theme.value.theme);
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
      if (target.classList.contains('v-popper--shown')) {
        handleShow();
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

  onMounted(() => {
    if (!floatingEl.value) {
      return;
    }
    observer.observe(floatingEl.value.$el, {
      attributeFilter: ['class'],
    });
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
