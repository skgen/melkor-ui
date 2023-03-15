<template>
  <div
    ref="parent"
    class="mk-AppInfiniteScroll"
    :data-scrollable="props.scrollable"
  >
    <div
      v-if="props.top"
      ref="topTrigger"
    />
    <div ref="sizeTrigger">
      <slot />
    </div>
    <div
      v-if="props.bottom"
      ref="bottomTrigger"
    />
  </div>
</template>

<script lang="ts" setup>
import { VerticalDirection } from '@src/definition';
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';

type Props = {
  top?: boolean;
  bottom?: boolean;
  distance?: number;
  scrollable?: boolean;
  mainAutoloadDirection?: VerticalDirection;
};

type Emits = {
  (event: 'infinite', direction: VerticalDirection): void;
};

const props = withDefaults(defineProps<Props>(), {
  distance: 0,
  mainAutoloadDirection: VerticalDirection.bottom,
});

const emit = defineEmits<Emits>();

let topTriggerObserver: IntersectionObserver | null = null;
let bottomTriggerObserver: IntersectionObserver | null = null;
let sizeObserver: ResizeObserver | null = null;
const topTrigger = ref<HTMLElement | null>(null);
const bottomTrigger = ref<HTMLElement | null>(null);
const sizeTrigger = ref<HTMLElement | null>(null);
const prevHeight = ref(0);
const parent = ref<HTMLElement | null>(null);
const scroller = computed(() => {
  if (props.scrollable && parent.value) {
    return parent.value;
  }
  return document.documentElement;
});
let timeout: number | null = null;
let stopObservingSize: VoidFunction | null = null;
let stopObservingIntersections: VoidFunction | null = null;
let lastDirectionTrigger: VerticalDirection | null = null;
const ready = ref(false);

function scrollToMiddle() {
  if (scroller.value) {
    const { height } = scroller.value.getBoundingClientRect();
    scroller.value.scrollTop = scroller.value.scrollHeight / 2 - height / 2;
  }
}

function scrollToEnd() {
  if (scroller.value) {
    scroller.value.scrollTop = scroller.value.scrollHeight;
  }
}

function scrollToStart() {
  if (scroller.value) {
    scroller.value.scrollTop = 0;
  }
}

function scrollAfterTop() {
  const heightDiff = scroller.value.scrollHeight - prevHeight.value;
  if (scroller.value) {
    scroller.value.scrollTop += heightDiff;
  }
}

function scrollAfterBottom() {
}

function handleTrigger(direction: VerticalDirection) {
  if (timeout !== null) {
    clearTimeout(timeout);
  }
  timeout = window.setTimeout(() => {
    prevHeight.value = scroller.value.scrollHeight;
    lastDirectionTrigger = direction;
    console.log(`Trigger = ${VerticalDirection[lastDirectionTrigger]}`);
    emit('infinite', direction);
  }, 200);
}

function isTriggerVisible(trigger: HTMLElement | null) {
  if (!trigger) {
    return false;
  }
  const elRect = trigger.getBoundingClientRect();
  const computedTop = elRect.top;
  const computedBottom = elRect.bottom;
  if (scroller.value === document.documentElement) {
    const refTop = 0 - props.distance;
    const refBottom = window.innerHeight + props.distance;
    return computedTop >= refTop && computedBottom <= refBottom;
  } if (parent.value) {
    const viewRect = parent.value.getBoundingClientRect();
    const refTop = viewRect.top - props.distance;
    const refBottom = viewRect.bottom + props.distance;
    return computedTop >= refTop && computedBottom <= refBottom;
  }
  return false;
}

function createIntersectionObserver(direction: VerticalDirection) {
  const root = props.scrollable ? scroller.value : null;
  const topMargin = direction === VerticalDirection.top ? props.distance : 0;
  const bottomMargin = direction === VerticalDirection.bottom ? props.distance : 0;
  const rootMargin = `${topMargin}px 0px ${bottomMargin}px 0px`;
  return new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        console.log('intersection');
        handleTrigger(direction);
      }
    },
    { root, rootMargin },
  );
}

function startObservingIntersections() {
  if (!topTrigger.value && !bottomTrigger.value) {
    return null;
  }
  if (topTrigger.value) {
    topTriggerObserver = createIntersectionObserver(VerticalDirection.top);
    topTriggerObserver.observe(topTrigger.value);
  }
  if (bottomTrigger.value) {
    bottomTriggerObserver = createIntersectionObserver(VerticalDirection.bottom);
    bottomTriggerObserver.observe(bottomTrigger.value);
  }

  return () => {
    topTriggerObserver?.disconnect();
    bottomTriggerObserver?.disconnect();
  };
}

function startObservingSize() {
  sizeObserver = new ResizeObserver(
    () => {
      switch (lastDirectionTrigger) {
        case VerticalDirection.top:
          scrollAfterTop();
          break;
        case VerticalDirection.bottom:
          scrollAfterBottom();
          break;
        default:
      }

      const isTopVisible = isTriggerVisible(topTrigger.value);
      const isBottomVisible = isTriggerVisible(bottomTrigger.value);

      if (props.mainAutoloadDirection === VerticalDirection.top) {
        if (isTopVisible) {
          handleTrigger(VerticalDirection.top);
        } else if (isBottomVisible) {
          handleTrigger(VerticalDirection.bottom);
        } else {
          ready.value = true;
        }
      } else if (props.mainAutoloadDirection === VerticalDirection.bottom) {
        if (isBottomVisible) {
          handleTrigger(VerticalDirection.bottom);
        } else if (isTopVisible) {
          handleTrigger(VerticalDirection.top);
        } else {
          ready.value = true;
        }
      }
    },
  );
  if (sizeTrigger.value) {
    sizeObserver.observe(sizeTrigger.value);
  }

  return () => {
    sizeObserver?.disconnect();
  };
}

function reloadIntersectionObservers() {
  if (stopObservingIntersections) {
    stopObservingIntersections();
  }
  stopObservingIntersections = startObservingIntersections();
}

onMounted(() => {
  if (props.top && props.bottom) {
    scrollToMiddle();
  } else if (props.top) {
    scrollToEnd();
  } else if (props.bottom) {
    scrollToStart();
  }
  stopObservingSize = startObservingSize();
});

watch([ready, () => props.distance, () => props.top, () => props.bottom], ([newReady]) => {
  if (newReady) {
    reloadIntersectionObservers();
  }
}, {
  flush: 'post',
});

onUnmounted(() => {
  if (stopObservingSize) {
    stopObservingSize();
  }
  if (stopObservingIntersections) {
    stopObservingIntersections();
  }
});

</script>

<style lang="scss">
.mk-AppInfiniteScroll {
    position: relative;

    &[data-scrollable="true"] {
        height: 100%;
        overflow: auto;
    }
}
</style>
