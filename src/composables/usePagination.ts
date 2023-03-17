import { toRefs } from '@vueuse/core';
import { computed, reactive } from 'vue';

type UsePaginationParams = {
  page: number;
  range: [number, number];
  gap?: number;
};

const defaultParams: Required<Pick<UsePaginationParams, 'gap'>> = {
  gap: 1,
};

export default (params: UsePaginationParams) => {
  const refParams = {
    ...toRefs(params),
    gap: computed(() => params.gap ?? defaultParams.gap),
  };
  const firstPage = computed(() => Math.min(refParams.range.value[0], refParams.range.value[1]));
  const lastPage = computed(() => Math.max(refParams.range.value[0], refParams.range.value[1]));
  const totalPages = computed(() => (lastPage.value - firstPage.value) + 1);

  const displayRangeMaxSize = computed(() => 1 + (refParams.gap.value + 1 + refParams.gap.value) + 1);
  const displayRangeSize = computed(() => Math.min(totalPages.value - 2, displayRangeMaxSize.value));

  function fill() {
    const rawBase = Array(displayRangeSize.value).fill(null);
    if (rawBase.length === totalPages.value - 2) {
      const withoutGap = rawBase.map<number>((_, i) => firstPage.value + i + 1);
      return withoutGap;
    }
    if (firstPage.value + (refParams.gap.value + 1 + 1) >= refParams.page.value) {
      const withoutGap = rawBase.map<number>((_, i) => firstPage.value + i + 1);
      if (withoutGap.length === displayRangeMaxSize.value && withoutGap[withoutGap.length - 1] + 1 === lastPage.value) {
        return withoutGap;
      }
      const withGap: (number | null)[] = withoutGap;
      withGap[withGap.length - 1] = null;
      return withGap;
    }
    if (lastPage.value - (refParams.gap.value + 1 + 1) <= refParams.page.value) {
      const withoutGap = rawBase.map<number>((_, i) => lastPage.value - i - 1).reverse();
      if (withoutGap.length === displayRangeMaxSize.value && withoutGap[0] - 1 === firstPage.value) {
        return withoutGap;
      }
      const withGap: (number | null)[] = withoutGap;
      withGap[0] = null;
      return withGap;
    }
    const withoutGap = [...rawBase];
    for (let i = 1; i < rawBase.length - 1; i += 1) {
      withoutGap[i] = refParams.page.value - refParams.gap.value + i - 1;
    }
    return withoutGap;
  }

  const blocks = reactive({
    prevCta: computed(() => refParams.page.value > firstPage.value),
    slotsRange: computed(() => fill()),
    nextCta: computed(() => refParams.page.value < lastPage.value),
  });

  return {
    firstPage,
    lastPage,
    ...refParams,
    blocks,
  };
};
