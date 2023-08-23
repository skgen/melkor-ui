import type { Locale } from 'date-fns';
import dateFnsFormat from 'date-fns/format';
import dateFnsFormatDistance from 'date-fns/formatDistance';
import enGB from 'date-fns/locale/en-GB';
import fr from 'date-fns/locale/fr';
import { useI18n } from 'vue-i18n';

export type DateFnsLocales = { [key:string]: Locale };

let dateFnsLocales: DateFnsLocales = {
  fr,
  en: enGB,
};

export function setDateFnsLocales(newLocales: DateFnsLocales) {
  dateFnsLocales = newLocales;
}

export function formatDate(date: Date, formatStr: string) {
  const { locale } = useI18n();

  return dateFnsFormat(date, formatStr, {
    locale: dateFnsLocales[locale.value],
  });
}

export function formatDistance(date: Date, baseDate: Date, options?: {
  includeSeconds?: boolean;
  addSuffix?: boolean;
}) {
  const { locale } = useI18n();

  return dateFnsFormatDistance(date, baseDate, {
    ...options,
    locale: dateFnsLocales[locale.value],
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
