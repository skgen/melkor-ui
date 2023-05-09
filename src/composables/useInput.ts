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

type UseInputOptions<TValue, TEmits> = {
  props: ComputedRef<InputComponentBaseProps<TValue>>;
  emit: TEmits;
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

export default function useInput<TValue>(options: UseInputOptions<TValue, InputEmits<TValue>>) {
  const { emit, props } = options;

  const state = computed(() => props.value.modelValue);
  const validate = computed(() => props.value.validate);

  const focus = ref(false);

  function onFocus() {
    emit('focus');
    focus.value = true;
  }

  function onBlur() {
    emit('blur');
    focus.value = false;
  }

  function onChange(value: TValue) {
    const newState: InputState<TValue> = validateInputState({
      value,
      valid: state.value.valid,
      touched: true,
      error: null,
    }, validate.value);

    emit('update:modelValue', newState);
  }

  return {
    onChange,
    onFocus,
    onBlur,
    focus,
    state,
  };
}
