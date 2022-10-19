import type { FileType } from '@src/lib/modules/file';

// Theme

export enum Theme {
  light,
  dark,
  auto,
}

export enum ThemeScheme {
  light,
  dark,
}

export enum ThemeMode {
  manual,
  auto,
}

export type ThemeData = {
  scheme: ThemeScheme;
  mode: ThemeMode;
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
  name?: string;
  validate?: ValidateInput<TValue>;
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

export type TextInputOptions = InputOptions<TextInputValue> & {
  fill?: boolean;
};

// Textarea
export type TextareaInputValue = string | null;

export type TextareaInputOptions = InputOptions<TextareaInputValue> & {
  fill?: boolean;
  rows?: number;
};

export type TextareaInputModel = InputModel<TextareaInputValue, TextareaInputOptions>;

// Password
export type PasswordInputValue = string | null;

export type PasswordInputOptions = InputOptions<PasswordInputValue> & {
  fill?: boolean;
};

export type PasswordInputModel = InputModel<PasswordInputValue, PasswordInputOptions>;

// Num
export type NumberInputValue = number | null;

export type NumberInputModel = InputModel<NumberInputValue, NumberInputOptions>;

export type NumberInputOptions = InputOptions<NumberInputValue> & {
  fill?: boolean;
  min?: number;
  max?: number;
};

// Date
export type DateInputModel = InputModel<Date>;

// Checkable
export type CheckableInputOptions<TChecked = true, TUnchecked = false>
= InputOptions<TChecked | TUnchecked> & {
  checked?: TChecked;
  unchecked?: TUnchecked;
};

export type CheckableInputModel
<TChecked = true, TUnchecked = TChecked extends true ? false : true> =
InputModel<TChecked | TUnchecked, CheckableInputOptions<TChecked, TUnchecked>>;

// Toggle
export type ToggleInputOptions<TChecked = true, TUnchecked = false> = CheckableInputOptions<TChecked, TUnchecked> & {
  checkedLabel?: string;
  uncheckedLabel?: string;
};

export type ToggleInputModel
<TChecked = true, TUnchecked = TChecked extends true ? false : true> =
InputModel<TChecked | TUnchecked, ToggleInputOptions<TChecked, TUnchecked>>;

// Radio
export type RadioInputModel<TValues extends Readonly<unknown[]>> =
InputModel<TValues[number]>;

// Range
export type RangeInputValue = number;

export type RangeInputOptions = InputOptions<RangeInputValue> & {
  min?: number;
  max?: number;
  step?: number;
};

export type RangeInputModel = InputModel<RangeInputValue, RangeInputOptions>;

// Select
export type SelectInputOptions<TValue> = InputOptions<TValue> & {
  options: {
    label: string;
    value: TValue;
  }[];
};

export type SelectInputModel<TValue> = Required<InputModel<TValue, SelectInputOptions<TValue>>>;

// File
export type FileInputValue = FileModel[];

export type FileInputOptions = InputOptions<FileInputValue>;

export type FileInputModel = InputModel<FileInputValue, FileInputOptions>;

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
