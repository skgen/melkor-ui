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
    --mk-wysiwyg-preview-text-color: var(--app-text-color);
    --mk-wysiwyg-preview-text-color-accent: var(--app-primary-color);
    --mk-wysiwyg-preview-text-color-soft: var(--app-text-color-soft);
    --mk-wysiwyg-preview-background-color: transparent;
    --mk-wysiwyg-preview-background-color-soft: var(--app-background-color-soft);
    --mk-wysiwyg-preview-background-color-highlight: var(--app-background-color-highlight);
    --mk-wysiwyg-preview-border-color: var(--app-border-color);
    --mk-wysiwyg-preview-border-color-soft: var(--app-border-color-highlight);

    @include light {
        --mk-wysiwyg-preview-background-color-attention: rgb(var(--app-primary-tone-color) / 0.15);
    }

    @include dark {
        --mk-wysiwyg-preview-background-color-attention: var(--app-primary-color);
    }

    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    font-size: 16px;
    line-height: 1.5;
    color: var(--mk-wysiwyg-preview-text-color);
    word-wrap: break-word;
    background-color: var(--mk-wysiwyg-preview-background-color);
    text-size-adjust: 100%;

    > *:first-child {
        margin-top: 0 !important;
    }

    > *:last-child {
        margin-bottom: 0 !important;
    }

    > div {
        margin-top: 0;
        margin-bottom: var(--app-m-2);
    }

    section {
        margin: var(--app-m-6) 0;

        > *:first-child {
            margin-top: 0 !important;
        }

        > *:last-child {
            margin-bottom: 0 !important;
        }

        > div {
            margin-top: 0;
            margin-bottom: var(--app-m-2);
        }
    }

    details,
    figcaption,
    figure {
        display: block;
    }

    summary {
        display: list-item;
    }

    [hidden] {
        display: none !important;
    }

    a:not(.mk-AppLink) {
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

        :not([href]) {
            color: inherit;
            text-decoration: none;
        }
    }

    sub,
    sup {
        position: relative;
        font-size: 75%;
        line-height: 0;
        vertical-align: baseline;
    }

    sub {
        bottom: -0.25em;
    }

    sup {
        top: -0.5em;
        /* stylelint-disable-next-line no-descending-specificity */
        > a:not(.mk-AppLink) {
            &::before {
                content: "[";
            }

            &::after {
                content: "]";
            }
        }
    }

    abbr[title] {
        text-decoration: underline dotted;
        border-bottom: none;
    }

    b,
    strong {
        font-weight: 600;
    }

    dfn {
        font-style: italic;
    }

    mark {
        color: var(--mk-wysiwyg-preview-text-color);
        background-color: var(--mk-wysiwyg-preview-background-color-attention);
    }

    small {
        font-size: 90%;
    }

    img {
        box-sizing: content-box;
        max-width: 100%;
        border-style: none;
    }

    code,
    kbd,
    pre,
    samp {
        font-family: monospace;
        font-size: 1em;
    }

    figure {
        margin: 1em 40px;
    }

    hr {
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

    input {
        margin: 0;
        overflow: visible;
        font: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    [type="button"],
    [type="reset"],
    [type="submit"] {
        appearance: button;
    }

    [type="button"]::-moz-focus-inner,
    [type="reset"]::-moz-focus-inner,
    [type="submit"]::-moz-focus-inner {
        padding: 0;
        border-style: none;
    }

    [type="button"]:-moz-focusring,
    [type="reset"]:-moz-focusring,
    [type="submit"]:-moz-focusring {
        outline: 1px dotted ButtonText;
    }

    [type="checkbox"],
    [type="radio"] {
        box-sizing: border-box;
        padding: 0;
    }

    [type="number"]::-webkit-inner-spin-button,
    [type="number"]::-webkit-outer-spin-button {
        height: auto;
    }

    [type="search"] {
        appearance: textfield;
        outline-offset: -2px;
    }

    [type="search"]::-webkit-search-cancel-button,
    [type="search"]::-webkit-search-decoration {
        appearance: none;
    }

    ::-webkit-file-upload-button {
        appearance: button;
        font: inherit;
    }

    hr::before {
        display: table;
        content: "";
    }

    hr::after {
        display: table;
        clear: both;
        content: "";
    }

    details summary {
        cursor: pointer;
    }

    details:not([open]) > *:not(summary) {
        display: none !important;
    }

    kbd {
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

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin-top: var(--app-m-3);
        margin-bottom: var(--app-m-2);
        font-weight: 600;
        line-height: 1.25;
    }

    h1 {
        padding-bottom: 0.3em;
        margin: 0.67em 0;
        font-size: 2em;
        font-weight: 600;
        border-bottom: 1px solid var(--mk-wysiwyg-preview-border-color-soft);
    }

    h2 {
        padding-bottom: 0.3em;
        font-size: 1.5em;
        font-weight: 600;
        border-bottom: 1px solid var(--mk-wysiwyg-preview-border-color-soft);
    }

    h3 {
        font-size: 1.25em;
        font-weight: 600;
    }

    h4 {
        font-size: 1em;
        font-weight: 600;
    }

    h5 {
        font-size: 0.875em;
        font-weight: 600;
    }

    h6 {
        font-size: 0.85em;
        font-weight: 600;
        color: var(--mk-wysiwyg-preview-text-color-soft);
    }

    blockquote {
        padding: 0 1em;
        margin: 0;
        color: var(--mk-wysiwyg-preview-text-color-soft);
        border-left: 0.25em solid var(--mk-wysiwyg-preview-border-color);
    }

    p,
    blockquote,
    ul,
    ol,
    dl,
    pre,
    details {
        margin-top: 0;
        margin-bottom: var(--app-m-2);
    }

    ul,
    ol {
        padding-left: 2em;
        margin-top: 0;
        margin-bottom: 0;
    }

    ul ul,
    ul ol,
    ol ol,
    ol ul {
        margin-top: 0;
        margin-bottom: 0;
    }

    ol ol,
    ul ol {
        list-style-type: lower-roman;
    }

    ul ul ol,
    ul ol ol,
    ol ul ol,
    ol ol ol {
        list-style-type: lower-alpha;
    }

    dd {
        margin-left: 0;
    }

    tt,
    code {
        padding: 0.2em 0.4em;
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        font-size: 85%;
        background-color: var(--mk-wysiwyg-preview-background-color-highlight);
        border-radius: 6px;
    }

    pre {
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
    }

    ::placeholder {
        color: var(--mk-wysiwyg-preview-text-color-soft);
        opacity: 1;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        margin: 0;
        appearance: none;
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

    blockquote > :first-child {
        margin-top: 0;
    }

    blockquote > :last-child {
        margin-bottom: 0;
    }

    ol[type="1"] {
        list-style-type: decimal;
    }

    ol[type="a"] {
        list-style-type: lower-alpha;
    }

    ol[type="i"] {
        list-style-type: lower-roman;
    }

    div > ol:not([type]) {
        list-style-type: decimal;
    }

    li > p {
        margin-top: var(--app-m-2);
    }

    li + li {
        margin-top: 0.25em;
    }

    dl {
        padding: 0;
    }

    dl dt {
        padding: 0;
        margin-top: var(--app-m-2);
        font-size: 1em;
        font-style: italic;
        font-weight: 600;
    }

    dl dd {
        padding: 0 var(--app-m-2);
        margin-bottom: var(--app-m-2);
    }

    table {
        &:not(.mk-AppTable) {
            display: block;
            width: max-content;
            max-width: 100%;
            margin-top: 0;
            margin-bottom: var(--app-m-2);
            overflow: auto;
            border-spacing: 0;
            border-collapse: collapse;

            th {
                font-weight: 600;
            }

            th,
            td {
                padding: 6px 13px;
                border: 1px solid var(--mk-wysiwyg-preview-border-color);
            }

            tr {
                background-color: var(--mk-wysiwyg-preview-background-color);
                border-top: 1px solid var(--mk-wysiwyg-preview-border-color-soft);

                &:nth-child(2n) {
                    background-color: var(--mk-wysiwyg-preview-background-color-soft);
                }
            }

            img {
                background-color: transparent;
            }
        }
    }

    img[align="right"] {
        padding-left: 20px;
    }

    img[align="left"] {
        padding-right: 20px;
    }

    code br,
    tt br {
        display: none;
    }

    del code {
        text-decoration: inherit;
    }

    pre code {
        font-size: 100%;
    }

    pre > code {
        padding: 0;
        margin: 0;
        word-break: normal;
        white-space: pre;
        background: transparent;
        border: 0;
    }

    pre code,
    pre tt {
        display: inline;
        max-width: auto;
        padding: 0;
        margin: 0;
        overflow: visible;
        line-height: inherit;
        word-wrap: normal;
        background-color: transparent;
        border: 0;
    }

    ::-webkit-calendar-picker-indicator {
        filter: invert(50%);
    }
}

</style>
