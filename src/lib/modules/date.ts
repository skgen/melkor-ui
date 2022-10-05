import { format as dateFnsFormat } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { fr, enGB } from 'date-fns/locale';

const dateLocales: { [key:string]: Locale } = {
  fr,
  en: enGB,
};

// eslint-disable-next-line import/prefer-default-export
export function formatDate(date: Date, formatStr: string) {
  const { locale } = useI18n();
  return dateFnsFormat(date, formatStr, {
    locale: dateLocales[locale.value],
  });
}
