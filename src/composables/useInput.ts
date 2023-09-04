import {
  computed, ref, type ComputedRef,
} from 'vue';
import type { InputComponentBaseProps, InputState, ValidateInput } from '@src/definition';
import { isValue } from '@src/lib/modules/definition';
import isEqual from 'lodash/isEqual';

// cant use in defineProps because of compiler
// export type InputProps<TState extends InputState<any>> = {
//   modelValue: TState;
//   name?: string;
//   validate?: ValidateInput<TState>;
// };

type PartialInputState<T> = Partial<InputState<T>> & { value: InputState<T>['value'] };

export function createInputState<T>(params: PartialInputState<T>): InputState<T> {
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
  (event: 'update:model-value', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

export default function useInput<TValue>(options: UseInputOptions<TValue, InputEmits<TValue>>) {
  const { emit, props } = options;

  const state = computed(() => props.value.modelValue);
  const validate = computed(() => props.value.validate);

  const focused = ref(false);

  function onFocus() {
    focused.value = true;
    emit('focus');
  }

  function onBlur() {
    focused.value = false;
    emit('blur');
  }

  function onChange(newStateCandidate: PartialInputState<TValue>) {
    const scopeState: Pick<InputState<TValue>, 'touched' | 'error'> = {
      touched: true,
      error: null,
    };
    const newState: InputState<TValue> = validateInputState({
      ...state.value,
      ...scopeState,
      ...newStateCandidate,
    }, validate.value);

    if (!isEqual(state, newState)) {
      emit('update:model-value', newState);
    }
  }

  return {
    onChange,
    onFocus,
    onBlur,
    state,
    focused,
  };
}
