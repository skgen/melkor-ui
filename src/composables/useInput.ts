import {
  computed, ref, type ComputedRef,
} from 'vue';
import type { InputComponentBaseProps, InputState, ValidateInput } from '@src/definition';
import { isValue } from '@src/lib/modules/definition';

// cant use in defineProps because of compiler
// export type InputProps<TState extends InputState<any>> = {
//   modelValue: TState;
//   name?: string;
//   validate?: ValidateInput<TState>;
// };

export function createInputState<T>(params: Partial<InputState<T>> & { value: InputState<T>['value'] }): InputState<T> {
  return {
    value: params.value,
    valid: params.valid ?? true,
    touched: params.touched ?? false,
    error: params.error ?? null,
  };
}

type HookParams<TValue, TEmits> = {
  props: ComputedRef<InputComponentBaseProps<TValue>>;
  emits: TEmits;
};

export function validateInputState<TValue>(state: InputState<TValue>, validate?: ValidateInput<TValue>): InputState<TValue> {
  const newState = { ...state };

  if (isValue(validate)) {
    newState.error = validate(newState.value);
    newState.valid = !newState.error;
  }
  return newState;
}

type InputEmits<Value> = {
  (event: 'update:modelValue', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

export default function useInput<TValue>(params: HookParams<TValue, InputEmits<TValue>>) {
  const { emits, props } = params;

  const state = computed(() => props.value.modelValue);
  const validate = computed(() => props.value.validate);

  const focus = ref(false);

  function onFocus() {
    emits('focus');
    focus.value = true;
  }

  function onBlur() {
    emits('blur');
    focus.value = false;
  }

  function onChange(value: TValue) {
    const newState: InputState<TValue> = validateInputState({
      value,
      valid: state.value.valid,
      touched: true,
      error: null,
    }, validate.value);

    emits('update:modelValue', newState);
  }

  return {
    onChange,
    onFocus,
    onBlur,
    focus,
    state,
  };
}
