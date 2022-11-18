import { format as dateFnsFormat } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { fr, enGB } from 'date-fns/locale';

const dateLocales: { [key:string]: Locale } = {
  fr,
  en: enGB,
};

export function formatDate(date: Date, formatStr: string) {
  const { locale } = useI18n();

  return dateFnsFormat(date, formatStr, {
    locale: dateLocales[locale.value],
  });
}

export function classicTime(date: Date) {
  const { locale } = useI18n();
  let format = 'h:mm aaa';
  if (['fr', 'frCA', 'frCH'].includes(locale.value)) {
    format = "HH'h'mm";
  }
  return formatDate(date, format);
}

export function classicDate(date: Date) {
  return formatDate(date, 'EEEE dd MMMM yyyy');
}
