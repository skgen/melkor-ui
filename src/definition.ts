import type { FileType } from '@src/lib/modules/file';
import type { ComputedRef, InjectionKey, WritableComputedRef } from 'vue';

// Theme

export enum Theme {
  light = 'light',
  dark = 'dark',
  auto = 'auto',
}

export type ThemeInstance = {
  theme: string;
  seed: number;
};

// InputComponent

export type InputComponentBaseProps<TValue> = {
  modelValue: InputState<TValue>;
} & InputOptions<TValue>;

// Input
export type InputState<T> = {
  value: T;
  valid: boolean;
  touched: boolean;
  error: string | null;
};

export type InputOptions<TValue> = {
  validate?: ValidateInput<TValue>;
  name?: string;
  label?: string;
  hint?: string;
};

export type ValidateInput<TValue> = (value: TValue) => InputState<TValue>['error'];

export type InputModel<TValue, TOptions extends InputOptions<TValue> = InputOptions<TValue>> = {
  state: InputState<TValue>;
  options?: TOptions;
};

// Text
export type TextInputValue = string | null;

export type TextInputModel = InputModel<TextInputValue, TextInputOptions>;

export type TextInputOptions = InputOptions<TextInputValue> & {
  fill?: boolean;
  placeholder?: string;
};

// Textarea
export type TextareaInputValue = string | null;

export type TextareaInputModel = InputModel<TextareaInputValue, TextareaInputOptions>;

export type TextareaInputOptions = InputOptions<TextareaInputValue> & {
  fill?: boolean;
  placeholder?: string;
  rows?: number;
};

// Password
export type PasswordInputValue = string | null;

export type PasswordInputModel = InputModel<PasswordInputValue, PasswordInputOptions>;

export type PasswordInputOptions = InputOptions<PasswordInputValue> & {
  fill?: boolean;
};

// Number
export type NumberInputValue = number | null;

export type NumberInputModel = InputModel<NumberInputValue, NumberInputOptions>;

export type NumberInputOptions = InputOptions<NumberInputValue> & {
  fill?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
};

// Wysiwyg
export type WysiwygInputValue = string | null;

export type WysiwygInputModel = InputModel<WysiwygInputValue, WysiwygInputOptions>;

export type WysiwygInputOptions = InputOptions<WysiwygInputValue> & {
  fill?: boolean;
};

// Color
export type ColorInputValue = string | null;

export type ColorInputModel = InputModel<ColorInputValue, ColorInputOptions>;

export type ColorInputOptions = InputOptions<ColorInputValue> & {
  fill?: boolean;
  placeholder?: string;
};

// Date
export type DateInputValue = Date | null;

export type DateInputModel = InputModel<DateInputValue, DateInputOptions>;

export type DateInputOptions = InputOptions<DateInputValue> & {
  fill?: boolean;
  datetime?: boolean;
  showTimezone?: boolean;
};

// Checkable
export type CheckableInputModel
<TChecked = true, TUnchecked = TChecked extends true ? false : true> =
InputModel<TChecked | TUnchecked, CheckableInputOptions<TChecked, TUnchecked>>;

export type CheckableInputOptions<TChecked = true, TUnchecked = false>
= InputOptions<TChecked | TUnchecked> & {
  checked?: TChecked;
  unchecked?: TUnchecked;
};

// Toggle

export type ToggleInputModel
<TChecked = true, TUnchecked = TChecked extends true ? false : true> =
InputModel<TChecked | TUnchecked, ToggleInputOptions<TChecked, TUnchecked>>;

export type ToggleInputOptions<TChecked = true, TUnchecked = false> = CheckableInputOptions<TChecked, TUnchecked> & {
  checkedLabel?: string;
  uncheckedLabel?: string;
  checkedIcon?: string;
  uncheckedIcon?: string;
  iconInBackground?: boolean;
};

// Range
export type RangeInputValue = number;

export type RangeInputModel = InputModel<RangeInputValue, RangeInputOptions>;

export type RangeInputOptions = InputOptions<RangeInputValue> & {
  fill?: boolean;
  min?: number;
  max?: number;
  step?: number;
};

// Select
export type SelectInputModel<TValue> = Required<InputModel<TValue, SelectInputOptions<TValue>>>;

export type SelectInputOption<TValue> = {
  label: string;
  value: TValue;
};

export type SelectInputOptions<TValue> = InputOptions<TValue> & {
  fill?: boolean;
  options: SelectInputOption<TValue>[];
};

// Radio

export type RadioInputModel<TValue> = Required<InputModel<TValue, RadioInputOptions<TValue>>>;

export type RadioInputOption<TValue> = {
  label: string;
  value: TValue;
};

export type RadioInputOptions<TValue> = InputOptions<TValue> & {
  options: RadioInputOption<TValue>[];
};

// File
export type FileInputValue = FileModel[];

export type FileInputModel = InputModel<FileInputValue, FileInputOptions>;

export type FileInputOptions = InputOptions<FileInputValue>;

// Misc

export type NonArray<T, D> = T extends D[] ? never : T;

export type FileModel = {
  name: string | null;
  url: string | null;
  size: number | null;
  type: FileType | null;
  file: File | null;
};

export type TableHeader = { text: string; value: string };
export type TableItem<TValue extends string | number = string | number> = {
  [key: string]: TValue;
};
export type TableCellAsGeneric = [number, keyof TableItem, TableItem[keyof TableItem]];

export type TableOptions = {
  indexColumns: boolean;
};

/* Props duplication for export => https://github.com/vuejs/core/issues/4294 */
// Need to be kept sync manually

export type TableProps = {
  headers?: TableHeader[];
  items: TableItem[];
  options?: Partial<TableOptions>;
};

// Provide / inject keys

export const themeContextKey = Symbol('Inject key of theme context') as InjectionKey<ComputedRef<ThemeInstance>>;
export const tabsContextKey = Symbol('Inject key of tabs/tab') as InjectionKey<WritableComputedRef<unknown>>;
export const layersContextKey = Symbol('Inject key of layers/layer') as InjectionKey<WritableComputedRef<unknown>>;
