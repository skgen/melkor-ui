import type { FileType } from '@src/lib/modules/file';

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
};

export type ValidateInput<TValue> = (value: TValue) => InputState<TValue>['error'];

export type InputModel<TValue, TOptions extends InputOptions<TValue> = InputOptions<TValue>> = {
  state: InputState<TValue>;
  options?: TOptions;
};

// Str
export type StrInputModel = InputModel<string>;

// Num
export type NumInputModel = InputModel<number>;

// Num
export type DateInputModel = InputModel<Date>;

// Checkable
export type CheckableOptions<TChecked = true, TUnchecked = false>
= InputOptions<TChecked | TUnchecked> & {
  checked?: TChecked;
  unchecked?: TUnchecked;
};

export type CheckableInputModel
<TChecked = true, TUnchecked = TChecked extends true ? false : true> =
InputModel<TChecked | TUnchecked, CheckableOptions<TChecked, TUnchecked>>;

// Radio
export type RadioInputModel<TValues extends Readonly<unknown[]>> =
InputModel<TValues[number]>;

// Range
export type RangeOptions<TValue> = InputOptions<TValue> & {
  min?: number;
  max?: number;
  step?: number;
};

export type RangeInputModel = InputModel<number, RangeOptions<number>>;

// Select
export type SelectOptions<TValue> = InputOptions<TValue> & {
  options: {
    label: string;
    value: TValue;
  }[];
};

export type SelectInputModel<TValue> = Required<InputModel<TValue, SelectOptions<TValue>>>;

// File
export type FileInputModel = InputModel<FileModel[]>;

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
