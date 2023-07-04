import type { ComputedRef, InjectionKey, WritableComputedRef } from 'vue';
import type { FileType } from '@src/lib/modules/file';
import type { MelkorConfig } from '@src/plugin';
import type { Time } from '@src/lib/models/time';

// Helpers

export type NonArray<T> = T extends (infer U)[] ? U : T;

export type RecursiveRequired<T> = Required<{
  [P in keyof T]: T[P] extends object | undefined ? RecursiveRequired<Required<T[P]>> : T[P];
}>;

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
// Only add properties that change only when value change
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
  disabled?: boolean;
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
  cancelable?: boolean;
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
  cancelable?: boolean;
};

// Number
export type NumberInputValue = number | null;

export type NumberInputModel = InputModel<NumberInputValue, NumberInputOptions>;

export type NumberInputOptions = InputOptions<NumberInputValue> & {
  fill?: boolean;
  placeholder?: string;
  cancelable?: boolean;
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
  cancelable?: boolean;
};

// Date
export type DateInputValue = Date | null;

export type DateInputModel = InputModel<DateInputValue, DateInputOptions>;

export type DateInputOptions = InputOptions<DateInputValue> & {
  fill?: boolean;
  cancelable?: boolean;
  datetime?: boolean;
  showTimezone?: boolean;
};

// Time

export type TimeInputValue = Time | null;

export type TimeInputModel = InputModel<TimeInputValue, TimeInputOptions>;

export type TimeInputOptions = InputOptions<TimeInputValue> & {
  fill?: boolean;
  cancelable?: boolean;
};

// Checkable
export type CheckableInputModel
<TChecked, TUnchecked> =
InputModel<TChecked | TUnchecked, CheckableInputOptions<TChecked, TUnchecked>>;

export type CheckableInputOptions<TChecked, TUnchecked>
= InputOptions<TChecked | TUnchecked> & {
  checked?: TChecked;
  unchecked?: TUnchecked;
};

// Toggle

export type ToggleInputModel
<TChecked, TUnchecked> =
InputModel<TChecked | TUnchecked, ToggleInputOptions<TChecked, TUnchecked>>;

export type ToggleInputOptions<TChecked, TUnchecked> = CheckableInputOptions<TChecked, TUnchecked> & {
  checkedLabel?: string;
  uncheckedLabel?: string;
  iconInBackground?: boolean;
};

// Checkbox

export type CheckboxInputModel
<TChecked, TUnchecked> =
Required<InputModel<TChecked | TUnchecked, CheckboxInputOptions<TChecked, TUnchecked>>>;

export type CheckboxInputOptions<TChecked, TUnchecked> = CheckableInputOptions<TChecked, TUnchecked> & {
  checkedLabel?: string;
  uncheckedLabel?: string;
};

// Checkbox Tree
export type CheckboxTreeLevel<TChecked, TUnchecked> = {
  input: CheckboxInputModel<TChecked, TUnchecked>;
  children?: CheckboxTreeLevel<TChecked, TUnchecked>[];
};

export type CheckboxTreeInputValue<TChecked, TUnchecked> = CheckboxTreeLevel<TChecked, TUnchecked>[];

export type CheckboxTreeInputModel<TChecked, TUnchecked> = InputModel<TChecked | TUnchecked, CheckboxTreeInputOptions<TChecked, TUnchecked>>;

export type CheckboxTreeInputOptions<TChecked, TUnchecked> = InputOptions<TChecked | TUnchecked>;

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
  value: TValue;
  disabled?: boolean;
};

export type SelectInputOptions<TValue> = InputOptions<TValue> & {
  fill?: boolean;
  options: SelectInputOption<TValue>[];
};

// Select X
export type SelectXInputModel<TValue> = Required<InputModel<TValue, SelectXInputOptions<TValue>>>;

export type SelectXInputOption<TValue> = {
  value: TValue;
  disabled?: boolean;
};

export type SelectXInputOptions<TValue> = InputOptions<TValue> & {
  fill?: boolean;
  options: SelectXInputOption<TValue>[];
  cancelable?: boolean;
  search?: InputState<TextInputValue>;
  hideSearchOnBlur?: boolean;
  cancelSearchOnBlur?: boolean;
};

// Icon Input
export type IconInputValue = string | null;

export type IconInputModel = Required<InputModel<IconInputValue, SelectInputOptions<IconInputValue>>>;

export type IconInputOption<TValue> = SelectInputOption<TValue>;

export type IconInputOptions<TValue> = InputOptions<TValue> & {
  fill?: boolean;
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

export type FileInputOptions = InputOptions<FileInputValue> & {
  fill?: boolean;
};

// Misc

export type FileModel = {
  name: string | null;
  url: string | null;
  size: number | null;
  type: FileType | null;
  file: File | null;
};

// Table

export type TableItemLeadingKeys = {
  __index?: number;
};
// eslint-disable-next-line @typescript-eslint/ban-types
export type TableItemTrailingKeys = {};

export type TableKey<TValue extends Record<string, unknown>> = (keyof (TValue & TableItemLeadingKeys & TableItemTrailingKeys));

export type TableHeader<TValue extends Record<string, unknown>, T> = {
  [key:string]: unknown;
  value?: T;
  key: keyof TValue;
};

export type TableDraggableOptions<TValue extends Record<string, unknown>> = {
  itemKey: TableKey<TValue>;
  handle?: string;
};

// Table Cell
export type CellState = {
  isCurrent: boolean;
  isCurrentX: boolean;
  isCurrentY: boolean;
  isFilteredX: boolean;
  isTarget: boolean;
  hasTarget: boolean;
  isTopTarget: boolean;
  isRightTarget: boolean;
  isBottomTarget: boolean;
  isLeftTarget: boolean;
  isOdd: boolean;
  isHidden: boolean;
};

/* Props duplication for export => https://github.com/vuejs/core/issues/4294 */
// Need to be kept sync manually

export type TableProps<TValue extends Record<string, unknown>, THeader> = {
  headers?: TableHeader<TValue, THeader>[];
  items: TValue[];
  indexRows?: boolean;
  sortableKeys?: TableKey<TValue>[];
  hiddenKeys?: TableKey<TValue>[];
};

// Floatings
// Menu
export enum FloatingPlacement {
  auto = 'auto',
  autoStart = 'auto-start',
  autoEnd = 'auto-end',
  top = 'top',
  topStart = 'top-start',
  topEnd = 'top-end',
  right = 'right',
  rightStart = 'right-start',
  rightEnd = 'right-end',
  bottom = 'bottom',
  bottomStart = 'bottom-start',
  bottomEnd = 'bottom-end',
  left = 'left',
  leftStart = 'left-start',
  leftEnd = 'left-end',
}

// Infinite scroll

export enum VerticalDirection {
  top,
  bottom,
}

export enum HorizontalDirection {
  left,
  right,
}

// Icons

export enum IconShape {
  rounded,
  sharp,
}

// Provide / inject keys

export const configContextKey = Symbol('Inject key of melkor config') as InjectionKey<MelkorConfig>;
export const themeContextKey = Symbol('Inject key of theme context') as InjectionKey<ComputedRef<ThemeInstance>>;
export const tabsContextKey = Symbol('Inject key of tabs/tab') as InjectionKey<WritableComputedRef<unknown>>;
export const layersContextKey = Symbol('Inject key of layers/layer') as InjectionKey<WritableComputedRef<unknown>>;
