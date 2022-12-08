import { computed } from 'vue';
import type { InputModel } from '@src/definition';

type HookParams<TState> = {
  state: TState;
  validate: (state: TState) => boolean;
};

// @todo fix this any;
export default function useForm<
  TValue,
  TState extends { [key: string]: InputModel<TValue> },
>(params: HookParams<TState>) {
  const { state, validate } = params;

  const valid = computed(() => validate(state));

  const data = computed(() => {
    const res: { [key: string]: TValue } = {};
    Object.keys(state).forEach((key) => {
      res[key] = state[key].state.value;
    });
    return res;
  });

  return {
    valid,
    data,
  };
}

// export type FormInputs = {
//   [key: string]: FormInputs[typeof key];
// };

// export type FormInputs = {
// //   [key:string]: {
// //     state: InputState<TValue>;
// //     validate?: ValidateInput<InputState<TValue>>;
// //   };
//   [Input in Inputs]: FormInput;
// //   [key: string]: FormInput[keyof typeof FormInputs];
// //   [key: string]: FormInputs[typeof key];
// };

// type InputStateValueType<S> = S extends InputState<infer T> ? T : never;

// type test = InputStateValueType<TextInputState>;

// ReturnType<()>
