<template>
  <div
    v-if="!props.html"
    v-theme="theme"
    class="mk-AppWysiwygPreview"
  >
    <slot />
  </div>
  <div
    v-else
    v-theme="theme"
    class="mk-AppWysiwygPreview"
    v-html="props.html"
  />
</template>

<script lang="ts" setup>
import useTheme from '@src/composables/useTheme';

const { theme } = useTheme();

type Props = {
  html?: string;
};

const props = defineProps<Props>();
</script>

<style lang="scss">
@import "@style/mixins";

.mk-AppWysiwygPreview {
    --mk-wysiwyg-preview-background-color: transparent;
    --mk-wysiwyg-preview-background-color-soft: var(--app-background-color-soft);
    --mk-wysiwyg-preview-background-color-highlight: var(--app-background-color-highlight);
    --mk-wysiwyg-preview-border-color: var(--app-border-color);
    --mk-wysiwyg-preview-border-color-soft: var(--app-border-color-highlight);
    --mk-wysiwyg-preview-font-family: var(--app-font-family-base);
    --mk-wysiwyg-preview-font-size: var(--app-font-size);
    --mk-wysiwyg-preview-line-height: var(--app-line-height);
    --mk-wysiwyg-preview-text-color: var(--app-text-color);
    --mk-wysiwyg-preview-text-color-accent: var(--app-primary-color);
    --mk-wysiwyg-preview-text-color-soft: var(--app-text-color-soft);

    @include light {
        --mk-wysiwyg-preview-background-color-attention: rgb(var(--app-primary-tone-color) / 0.15);
        --mk-wysiwyg-preview-text-color-attention: var(--app-text-color);
    }

    @include dark {
        --mk-wysiwyg-preview-background-color-attention: var(--app-primary-color);
        --mk-wysiwyg-preview-text-color-attention: var(--app-text-color-on-primary);
    }

    margin: 0;
    font-family: var(--mk-wysiwyg-preview-font-family);
    font-size: var(--mk-wysiwyg-preview-font-size);
    line-height: var(--mk-wysiwyg-preview-line-height);
    color: var(--mk-wysiwyg-preview-text-color);
    word-wrap: break-word;
    background-color: var(--mk-wysiwyg-preview-background-color);
    text-size-adjust: 100%;

    @mixin raw {
        &:not([class]) {
            @content;
        }
    }

    > *:first-child {
        @include raw {
            margin-top: 0 !important;
        }
    }

    > *:last-child {
        @include raw {
            margin-bottom: 0 !important;
        }
    }

    > div {
        @include raw {
            margin-top: 0;
            margin-bottom: var(--app-m-2);
        }
    }

    section {
        @include raw {
            margin: var(--app-m-6) 0;

            > *:first-child {
                @include raw {
                    margin-top: 0 !important;
                }
            }

            > *:last-child {
                @include raw {
                    margin-bottom: 0 !important;
                }
            }

            > div {
                @include raw {
                    margin-top: 0;
                    margin-bottom: var(--app-m-2);
                }
            }
        }
    }

    details,
    figcaption,
    figure {
        @include raw {
            display: block;
        }
    }

    summary {
        display: list-item;
    }

    [hidden] {
        @include raw {
            display: none !important;
        }
    }

    a {
        @include raw {
            color: var(--mk-wysiwyg-preview-text-color-accent);
            text-decoration: none;
            background-color: transparent;

            &:hover {
                text-decoration: underline;
            }

            &:hover,
            &:active {
                outline-width: 0;
            }

            &:not([href]) {
                color: inherit;
                text-decoration: none;
            }
        }
    }

    sub,
    sup {
        @include raw {
            position: relative;
            font-size: 75%;
            line-height: 0;
            vertical-align: baseline;
        }
    }

    sub {
        @include raw {
            bottom: -0.25em;
        }
    }

    sup {
        @include raw {
            top: -0.5em;
            /* stylelint-disable-next-line no-descending-specificity */
            > a {
                @include raw {
                    &::before {
                        content: "[";
                    }

                    &::after {
                        content: "]";
                    }
                }
            }
        }
    }

    abbr[title] {
        @include raw {
            text-decoration: underline dotted;
            border-bottom: none;
        }
    }

    b,
    strong {
        @include raw {
            font-weight: 600;
        }
    }

    dfn {
        @include raw {
            font-style: italic;
        }
    }

    mark {
        @include raw {
            color: var(--mk-wysiwyg-preview-text-color-attention);
            background-color: var(--mk-wysiwyg-preview-background-color-attention);
        }
    }

    small {
        @include raw {
            font-size: 90%;
        }
    }

    img {
        @include raw {
            box-sizing: content-box;
            max-width: 100%;
            border-style: none;
        }
    }

    code,
    kbd,
    pre,
    samp {
        @include raw {
            font-family: monospace;
            font-size: 1em;
        }
    }

    figure {
        @include raw {
            margin: 1em 40px;
        }
    }

    hr {
        @include raw {
            box-sizing: content-box;
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            overflow: hidden;
            background: transparent;
            background-color: var(--mk-wysiwyg-preview-border-color);
            border: 0;
            border-bottom: 1px solid var(--mk-wysiwyg-preview-border-color-soft);
        }
    }

    input {
        @include raw {
            margin: 0;
            overflow: visible;
            font: inherit;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
        }
    }

    [type="button"],
    [type="reset"],
    [type="submit"] {
        @include raw {
            appearance: button;
        }
    }

    [type="button"]::-moz-focus-inner,
    [type="reset"]::-moz-focus-inner,
    [type="submit"]::-moz-focus-inner {
        @include raw {
            padding: 0;
            border-style: none;
        }
    }

    [type="button"]:-moz-focusring,
    [type="reset"]:-moz-focusring,
    [type="submit"]:-moz-focusring {
        @include raw {
            outline: 1px dotted ButtonText;
        }
    }

    [type="checkbox"],
    [type="radio"] {
        @include raw {
            box-sizing: border-box;
            padding: 0;
        }
    }

    [type="number"]::-webkit-inner-spin-button,
    [type="number"]::-webkit-outer-spin-button {
        @include raw {
            height: auto;
        }
    }

    [type="search"] {
        @include raw {
            appearance: textfield;
            outline-offset: -2px;
        }
    }

    [type="search"]::-webkit-search-cancel-button,
    [type="search"]::-webkit-search-decoration {
        @include raw {
            appearance: none;
        }
    }

    ::-webkit-file-upload-button {
        @include raw {
            appearance: button;
            font: inherit;
        }
    }

    hr::before {
        @include raw {
            display: table;
            content: "";
        }
    }

    hr::after {
        @include raw {
            display: table;
            clear: both;
            content: "";
        }
    }

    details {
        @include raw {
            summary {
                @include raw {
                    cursor: pointer;
                }
            }

            &:not[open] {
                > *:not(summary) {
                    @include raw {
                        display: none !important;
                    }
                }
            }
        }
    }

    kbd {
        @include raw {
            display: inline-block;
            padding: 3px 5px;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
            font-size: 11px;
            line-height: 10px;
            color: var(--mk-wysiwyg-preview-text-color);
            vertical-align: middle;
            background-color: var(--mk-wysiwyg-preview-background-color-soft);
            border: solid 1px var(--app-border-color-highlight);
            border-radius: 6px;
            box-shadow: inset 0 -1px 0 var(--app-border-color-highlight);
        }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        @include raw {
            margin-top: var(--app-m-3);
            margin-bottom: var(--app-m-2);
            font-weight: 600;
            line-height: 1.25;
        }
    }

    h1 {
        @include raw {
            padding-bottom: 0.3em;
            margin: 0.67em 0;
            font-size: 2em;
            font-weight: 600;
            border-bottom: 1px solid var(--mk-wysiwyg-preview-border-color-soft);
        }
    }

    h2 {
        @include raw {
            padding-bottom: 0.3em;
            font-size: 1.5em;
            font-weight: 600;
            border-bottom: 1px solid var(--mk-wysiwyg-preview-border-color-soft);
        }
    }

    h3 {
        @include raw {
            font-size: 1.25em;
            font-weight: 600;
        }
    }

    h4 {
        @include raw {
            font-size: 1em;
            font-weight: 600;
        }
    }

    h5 {
        @include raw {
            font-size: 0.875em;
            font-weight: 600;
        }
    }

    h6 {
        @include raw {
            font-size: 0.85em;
            font-weight: 600;
            color: var(--mk-wysiwyg-preview-text-color-soft);
        }
    }

    blockquote {
        @include raw {
            padding: 0 1em;
            margin: 0;
            color: var(--mk-wysiwyg-preview-text-color-soft);
            border-left: 0.25em solid var(--mk-wysiwyg-preview-border-color);

            > :first-child {
                @include raw {
                    margin-top: 0;
                }
            }

            > :last-child {
                @include raw {
                    margin-bottom: 0;
                }
            }
        }
    }

    p,
    blockquote,
    ul,
    ol,
    dl,
    pre,
    details {
        @include raw {
            margin-top: 0;
            margin-bottom: var(--app-m-2);
        }
    }

    ul,
    ol {
        @include raw {
            padding-left: 2em;
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    ul ul,
    ul ol,
    ol ol,
    ol ul {
        @include raw {
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    ol ol,
    ul ol {
        @include raw {
            list-style-type: lower-roman;
        }
    }

    ul ul ol,
    ul ol ol,
    ol ul ol,
    ol ol ol {
        @include raw {
            list-style-type: lower-alpha;
        }
    }

    dd {
        @include raw {
            margin-left: 0;
        }
    }

    tt,
    code {
        @include raw {
            padding: 0.2em 0.4em;
            margin: 0;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
            font-size: 85%;
            background-color: var(--mk-wysiwyg-preview-background-color-highlight);
            border-radius: 6px;

            br {
                @include raw {
                    display: none;
                }
            }
        }
    }

    pre {
        @include raw {
            padding: var(--app-m-2);
            margin-top: 0;
            margin-bottom: 0;
            overflow: auto;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
            font-size: 85%;
            line-height: 1.45;
            word-wrap: normal;
            background-color: var(--mk-wysiwyg-preview-background-color-soft);
            border-radius: 6px;

            code {
                @include raw {
                    font-size: 100%;
                }
            }

            > code {
                @include raw {
                    padding: 0;
                    margin: 0;
                    word-break: normal;
                    white-space: pre;
                    background: transparent;
                    border: 0;
                }
            }

            code,
            tt {
                @include raw {
                    display: inline;
                    max-width: none;
                    padding: 0;
                    margin: 0;
                    overflow: visible;
                    line-height: inherit;
                    word-wrap: normal;
                    background-color: transparent;
                    border: 0;
                }
            }
        }
    }

    ::placeholder {
        color: var(--mk-wysiwyg-preview-text-color-soft);
        opacity: 1;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        @include raw {
            margin: 0;
            appearance: none;
        }
    }

    &::before {
        display: table;
        content: "";
    }

    &::after {
        display: table;
        clear: both;
        content: "";
    }

    ol[type="1"] {
        @include raw {
            list-style-type: decimal;
        }
    }

    ol[type="a"] {
        @include raw {
            list-style-type: lower-alpha;
        }
    }

    ol[type="i"] {
        @include raw {
            list-style-type: lower-roman;
        }
    }

    li {
        @include raw {
            & + li {
                @include raw {
                    margin-top: 0.25em;
                }
            }

            > p {
                @include raw {
                    margin-top: var(--app-m-2);
                }
            }
        }
    }

    dl {
        @include raw {
            padding: 0;

            dt {
                @include raw {
                    padding: 0;
                    margin-top: var(--app-m-2);
                    font-size: 1em;
                    font-style: italic;
                    font-weight: 600;
                }
            }

            dd {
                @include raw {
                    padding: 0 var(--app-m-2);
                    margin-bottom: var(--app-m-2);
                }
            }
        }
    }

    table {
        @include raw {
            display: block;
            width: max-content;
            max-width: 100%;
            margin-top: 0;
            margin-bottom: var(--app-m-2);
            overflow: auto;
            border-spacing: 0;
            border-collapse: collapse;

            th {
                @include raw {
                    font-weight: 600;
                }
            }

            th,
            td {
                @include raw {
                    padding: var(--app-m-1) var(--app-m-2);
                    border: 1px solid var(--mk-wysiwyg-preview-border-color);
                }
            }

            tr {
                @include raw {
                    background-color: var(--mk-wysiwyg-preview-background-color);
                    border-top: 1px solid var(--mk-wysiwyg-preview-border-color-soft);

                    &:nth-child(2n) {
                        background-color: var(--mk-wysiwyg-preview-background-color-soft);
                    }
                }
            }

            img {
                @include raw {
                    background-color: transparent;
                }
            }
        }
    }

    del {
        @include raw {
            code {
                @include raw {
                    text-decoration: inherit;
                }
            }
        }
    }

    pre code,
    pre tt {
        display: inline;
        max-width: none;
        padding: 0;
        margin: 0;
        overflow: visible;
        line-height: inherit;
        word-wrap: normal;
        background-color: transparent;
        border: 0;
    }
}

</style>
