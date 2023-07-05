import fileSize from 'filesize';
import {
  type Ref, computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

export function getSize(v: number, locale: string) {
  return fileSize.partial({ standard: 'jedec', locale })(v);
}

export default (rawSize: Ref<number>) => {
  const { locale } = useI18n();

  const size = computed(() => getSize(rawSize.value, locale.value));

  return {
    size,
  };
};
