<template>
  <div
    v-theme="theme"
    class="mk-AppInputWysiwyg"
    :data-focus="focused || undefined"
    :data-fill="props.fill || undefined"
  >
    <AppInputLabel v-if="props.label">
      {{ props.label }}
    </AppInputLabel>
    <div
      v-if="editor"
      class="mk-AppInputWysiwyg-controls"
    >
      <AppButton
        :outlined="!editor.isActive('bold')"
        @click="editor!.chain().focus().toggleBold().run()"
      >
        <AppIcon icon="format_bold" />
      </AppButton>
      <AppButton
        :outlined="!editor.isActive('italic')"
        @click="editor!.chain().focus().toggleItalic().run()"
      >
        <AppIcon icon="format_italic" />
      </AppButton>
      <AppButton
        :outlined="!editor.isActive('paragraph')"
        @click="editor!.chain().focus().setParagraph().run()"
      >
        <AppIcon icon="view_headline" />
      </AppButton>
      <AppButton
        :outlined="!editor.isActive('blockquote')"
        @click="editor!.chain().focus().setBlockquote().run()"
      >
        <AppIcon icon="format_quote" />
      </AppButton>
      <AppButton
        :outlined="!editor.isActive('heading', { level: 1 })"
        @click="() => editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <AppIcon icon="format_h1" />
      </AppButton>
      <AppButton
        :outlined="!editor.isActive('heading', { level: 2 })"
        @click="() => editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <AppIcon icon="format_h2" />
      </AppButton>
      <AppButton
        :outlined="!editor!.isActive('heading', { level: 3 })"
        @click="() => editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <AppIcon icon="format_h3" />
      </AppButton>
    </div>
    <label>
      <div class="mk-AppInputWysiwyg-input">
        <AppWysiwygPreview>
          <EditorContent :editor="editor" />
        </AppWysiwygPreview>
      </div>
    </label>
    <AppInputHint v-if="props.hint">
      {{ props.hint }}
    </AppInputHint>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, onBeforeUnmount, watch,
} from 'vue';
import type { InputState, ValidateInput } from '@src/definition';
import AppInputHint from '@src/components/io/decoration/AppInputHint.vue';
import AppInputLabel from '@src/components/io/decoration/AppInputLabel.vue';
import useInput from '@src/composables/useInput';
import useTheme from '@src/composables/useTheme';
import {
  useEditor, EditorContent,
} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import AppButton from '@src/components/AppButton.vue';
import AppWysiwygPreview from '@src/components/AppWysiwygPreview.vue';
import AppIcon from '@src/components/AppIcon.vue';

type Value = string | null;

type Props = {
  modelValue: InputState<Value>;
  name?: string;
  validate?: ValidateInput<Value>;
  label?: string;
  hint?: string;
  disabled?: boolean;
  fill?: boolean;
};

type Emits = {
  (event: 'update:model-value', value: InputState<Value>): void;
  (event: 'focus'): void;
  (event: 'blur'): void;
};

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  validate: undefined,
  hint: undefined,
  label: undefined,
});
const emit = defineEmits<Emits>();

const { theme } = useTheme();

const {
  onChange, onFocus, onBlur, state, focused,
} = useInput<Value>({
  props: computed(() => props),
  emit,
});

function handleChange(newValue: string) {
  if (newValue === '') {
    onChange({ value: null });
  } else {
    onChange({ value: newValue });
  }
}

const editor = useEditor({
  content: props.modelValue.value,
  extensions: [
    StarterKit,
  ],
  editorProps: {
    attributes: {
      class: 'mk-AppInputWysiwyg-editable mk-AppWysiwygPreview',
    },
  },
  onFocus,
  onBlur,
  onUpdate: ({ editor: newEditor }) => handleChange(newEditor.getHTML()),
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

watch(state, (newState) => {
  if (!editor.value) {
    return;
  }

  const editorValue = editor.value.getHTML();
  const isSame = editorValue === newState.value;

  if (isSame) {
    return;
  }

  editor.value.commands.setContent(newState.value, false);
});

</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppInputWysiwyg {
    --mk-input-wysiwyg-background-color: var(--app-input-background-color);
    --mk-input-wysiwyg-border-color: var(--app-input-border-color);
    --mk-input-wysiwyg-border-width: var(--app-input-border-width);
    --mk-input-wysiwyg-border-radius: var(--app-input-border-radius);
    --mk-input-wysiwyg-color: var(--app-input-color);
    --mk-input-wysiwyg-font-size: var(--app-input-font-size);
    --mk-input-wysiwyg-line-height: var(--app-input-line-height);
    --mk-input-wysiwyg-padding-x: var(--app-m-3);
    --mk-input-wysiwyg-padding-y: var(--app-m-3);

    display: inline-block;

    &-controls {
        display: flex;
        flex-wrap: wrap;
        gap: var(--app-m-1);
        align-items: center;
        margin: 0 0 var(--app-m-1) 0;
    }

    &-editable {
        width: 100%;
        min-height: 80px;
        padding: var(--mk-input-wysiwyg-padding-y) var(--mk-input-wysiwyg-padding-x);
        font-size: var(--mk-input-wysiwyg-font-size);
        line-height: var(--mk-input-wysiwyg-line-height);
        color: var(--mk-input-wysiwyg-color);
        cursor: text;
        background-color: var(--mk-input-wysiwyg-background-color);
        border: var(--mk-input-wysiwyg-border-width) solid var(--mk-input-wysiwyg-border-color);
        border-radius: var(--mk-input-wysiwyg-border-radius);
        outline: none;
        transition: border-color var(--app-transition-duration-color);
    }

    &[data-focus="true"] {
        --mk-input-wysiwyg-border-color: var(--app-primary-color);
    }

    &[data-fill="true"] {
        @include mk-fill;
    }

    .mk-AppInputLabel {
        display: block;
        margin-bottom: var(--app-m-1);
    }

    .mk-AppInputHint {
        display: block;
        margin-top: var(--app-m-1);
    }
}
</style>
