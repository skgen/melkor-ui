import type { Ref } from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
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
    valid: params.valid ?? false,
    touched: params.touched ?? false,
    error: params.error ?? null,
  };
}

type HookParams<TValue> = {
  state: Ref<InputState<TValue>>;
  emits: (event: 'update:modelValue', value : InputState<TValue>) => void;
  validate?: ValidateInput<TValue>;
};

export default function useInput
<TValue>(params: HookParams<TValue>) {
  const { emits, state, validate } = params;

  function onChange(value: TValue) {
    // console.log(mirrorState.value.touched);
    let error: ReturnType<ValidateInput<TValue>> = null;
    let newValid = state.value.valid;
    if (isValue(validate)) {
      error = validate(value);
      newValid = !error;
    }

    const newState: InputState<TValue> = {
      value,
      valid: newValid,
      touched: true,
      error,
    };
    emits('update:modelValue', newState);
  }

  return {
    onChange,
    state,
  };
}
