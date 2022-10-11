<template>
  <div class="mk-AppWysiwygPreview">
    <slot />
  </div>
</template>

<style lang="scss">
@import "@style/mixins";

@include light {
    --mk-wysiwyg-preview-prettylights-syntax-comment: #6e7781;
    --mk-wysiwyg-preview-prettylights-syntax-constant: #0550ae;
    --mk-wysiwyg-preview-prettylights-syntax-entity: #8250df;
    --mk-wysiwyg-preview-prettylights-syntax-storage-modifier-import: #24292f;
    --mk-wysiwyg-preview-prettylights-syntax-entity-tag: #116329;
    --mk-wysiwyg-preview-prettylights-syntax-keyword: #cf222e;
    --mk-wysiwyg-preview-prettylights-syntax-string: #0a3069;
    --mk-wysiwyg-preview-prettylights-syntax-variable: #953800;
    --mk-wysiwyg-preview-prettylights-syntax-brackethighlighter-unmatched: #82071e;
    --mk-wysiwyg-preview-prettylights-syntax-invalid-illegal-text: #f6f8fa;
    --mk-wysiwyg-preview-prettylights-syntax-invalid-illegal-bg: #82071e;
    --mk-wysiwyg-preview-prettylights-syntax-carriage-return-text: #f6f8fa;
    --mk-wysiwyg-preview-prettylights-syntax-carriage-return-bg: #cf222e;
    --mk-wysiwyg-preview-prettylights-syntax-string-regexp: #116329;
    --mk-wysiwyg-preview-prettylights-syntax-markup-list: #3b2300;
    --mk-wysiwyg-preview-prettylights-syntax-markup-heading: #0550ae;
    --mk-wysiwyg-preview-prettylights-syntax-markup-italic: #24292f;
    --mk-wysiwyg-preview-prettylights-syntax-markup-bold: #24292f;
    --mk-wysiwyg-preview-prettylights-syntax-markup-deleted-text: #82071e;
    --mk-wysiwyg-preview-prettylights-syntax-markup-deleted-bg: #ffebe9;
    --mk-wysiwyg-preview-prettylights-syntax-markup-inserted-text: #116329;
    --mk-wysiwyg-preview-prettylights-syntax-markup-inserted-bg: #dafbe1;
    --mk-wysiwyg-preview-prettylights-syntax-markup-changed-text: #953800;
    --mk-wysiwyg-preview-prettylights-syntax-markup-changed-bg: #ffd8b5;
    --mk-wysiwyg-preview-prettylights-syntax-markup-ignored-text: #eaeef2;
    --mk-wysiwyg-preview-prettylights-syntax-markup-ignored-bg: #0550ae;
    --mk-wysiwyg-preview-prettylights-syntax-meta-diff-range: #8250df;
    --mk-wysiwyg-preview-prettylights-syntax-brackethighlighter-angle: #57606a;
    --mk-wysiwyg-preview-prettylights-syntax-sublimelinter-gutter-mark: #8c959f;
    --mk-wysiwyg-preview-prettylights-syntax-constant-other-reference-link: #0a3069;
    --mk-wysiwyg-preview-fg-default: #24292f;
    --mk-wysiwyg-preview-fg-muted: #57606a;
    --mk-wysiwyg-preview-fg-subtle: #6e7781;
    --mk-wysiwyg-preview-canvas-default: transparent;
    --mk-wysiwyg-preview-canvas-subtle: #f6f8fa;
    --mk-wysiwyg-preview-border-default: #d0d7de;
    --mk-wysiwyg-preview-border-muted: hsl(210deg 18% 87% / 1);
    --mk-wysiwyg-preview-neutral-muted: rgb(175 184 193 / 0.2);
    --mk-wysiwyg-preview-accent-fg: #0969da;
    --mk-wysiwyg-preview-accent-emphasis: #0969da;
    --mk-wysiwyg-preview-attention-subtle: #fff8c5;
    --mk-wysiwyg-preview-danger-fg: #cf222e;
}

.mk-AppWysiwygPreview {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    font-size: 16px;
    line-height: 1.5;
    color: var(--mk-wysiwyg-preview-fg-default);
    word-wrap: break-word;
    background-color: var(--mk-wysiwyg-preview-canvas-default);
    text-size-adjust: 100%;

    @include dark {
        --mk-wysiwyg-preview-prettylights-syntax-comment: #8b949e;
        --mk-wysiwyg-preview-prettylights-syntax-constant: #79c0ff;
        --mk-wysiwyg-preview-prettylights-syntax-entity: #d2a8ff;
        --mk-wysiwyg-preview-prettylights-syntax-storage-modifier-import: #c9d1d9;
        --mk-wysiwyg-preview-prettylights-syntax-entity-tag: #7ee787;
        --mk-wysiwyg-preview-prettylights-syntax-keyword: #ff7b72;
        --mk-wysiwyg-preview-prettylights-syntax-string: #a5d6ff;
        --mk-wysiwyg-preview-prettylights-syntax-variable: #ffa657;
        --mk-wysiwyg-preview-prettylights-syntax-brackethighlighter-unmatched: #f85149;
        --mk-wysiwyg-preview-prettylights-syntax-invalid-illegal-text: #f0f6fc;
        --mk-wysiwyg-preview-prettylights-syntax-invalid-illegal-bg: #8e1519;
        --mk-wysiwyg-preview-prettylights-syntax-carriage-return-text: #f0f6fc;
        --mk-wysiwyg-preview-prettylights-syntax-carriage-return-bg: #b62324;
        --mk-wysiwyg-preview-prettylights-syntax-string-regexp: #7ee787;
        --mk-wysiwyg-preview-prettylights-syntax-markup-list: #f2cc60;
        --mk-wysiwyg-preview-prettylights-syntax-markup-heading: #1f6feb;
        --mk-wysiwyg-preview-prettylights-syntax-markup-italic: #c9d1d9;
        --mk-wysiwyg-preview-prettylights-syntax-markup-bold: #c9d1d9;
        --mk-wysiwyg-preview-prettylights-syntax-markup-deleted-text: #ffdcd7;
        --mk-wysiwyg-preview-prettylights-syntax-markup-deleted-bg: #67060c;
        --mk-wysiwyg-preview-prettylights-syntax-markup-inserted-text: #aff5b4;
        --mk-wysiwyg-preview-prettylights-syntax-markup-inserted-bg: #033a16;
        --mk-wysiwyg-preview-prettylights-syntax-markup-changed-text: #ffdfb6;
        --mk-wysiwyg-preview-prettylights-syntax-markup-changed-bg: #5a1e02;
        --mk-wysiwyg-preview-prettylights-syntax-markup-ignored-text: #c9d1d9;
        --mk-wysiwyg-preview-prettylights-syntax-markup-ignored-bg: #1158c7;
        --mk-wysiwyg-preview-prettylights-syntax-meta-diff-range: #d2a8ff;
        --mk-wysiwyg-preview-prettylights-syntax-brackethighlighter-angle: #8b949e;
        --mk-wysiwyg-preview-prettylights-syntax-sublimelinter-gutter-mark: #484f58;
        --mk-wysiwyg-preview-prettylights-syntax-constant-other-reference-link: #a5d6ff;
        --mk-wysiwyg-preview-fg-default: #c9d1d9;
        --mk-wysiwyg-preview-fg-muted: #8b949e;
        --mk-wysiwyg-preview-fg-subtle: #484f58;
        --mk-wysiwyg-preview-canvas-default: transparent;
        --mk-wysiwyg-preview-canvas-subtle: #161b22;
        --mk-wysiwyg-preview-border-default: #30363d;
        --mk-wysiwyg-preview-border-muted: #21262d;
        --mk-wysiwyg-preview-neutral-muted: rgb(110 118 129 / 0.4);
        --mk-wysiwyg-preview-accent-fg: #58a6ff;
        --mk-wysiwyg-preview-accent-emphasis: #1f6feb;
        --mk-wysiwyg-preview-attention-subtle: rgb(187 128 9 / 0.15);
        --mk-wysiwyg-preview-danger-fg: #f85149;
    }

    > *:first-child {
        margin-top: 0 !important;
    }

    > *:last-child {
        margin-bottom: 0 !important;
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

    a {
        color: var(--mk-wysiwyg-preview-accent-fg);
        text-decoration: none;
        background-color: transparent;
    }

    a:active,
    a:hover {
        outline-width: 0;
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
        color: var(--mk-wysiwyg-preview-text-primary);
        background-color: var(--mk-wysiwyg-preview-attention-subtle);
    }

    small {
        font-size: 90%;
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
    }

    img {
        box-sizing: content-box;
        max-width: 100%;
        background-color: var(--mk-wysiwyg-preview-canvas-default);
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
        background-color: var(--mk-wysiwyg-preview-border-default);
        border: 0;
        border-bottom: 1px solid var(--mk-wysiwyg-preview-border-muted);
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

    a:hover {
        text-decoration: underline;
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

    table {
        display: block;
        width: max-content;
        max-width: 100%;
        overflow: auto;
        border-spacing: 0;
        border-collapse: collapse;
    }

    td,
    th {
        padding: 0;
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
        font: 11px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        line-height: 10px;
        color: var(--mk-wysiwyg-preview-fg-default);
        vertical-align: middle;
        background-color: var(--mk-wysiwyg-preview-canvas-subtle);
        border: solid 1px var(--mk-wysiwyg-preview-neutral-muted);
        border-bottom-color: var(--mk-wysiwyg-preview-neutral-muted);
        border-radius: 6px;
        box-shadow: inset 0 -1px 0 var(--mk-wysiwyg-preview-neutral-muted);
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
    }

    h1 {
        padding-bottom: 0.3em;
        margin: 0.67em 0;
        font-size: 2em;
        font-weight: 600;
        border-bottom: 1px solid var(--mk-wysiwyg-preview-border-muted);
    }

    h2 {
        padding-bottom: 0.3em;
        font-size: 1.5em;
        font-weight: 600;
        border-bottom: 1px solid var(--mk-wysiwyg-preview-border-muted);
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
        color: var(--mk-wysiwyg-preview-fg-muted);
    }

    p {
        margin-top: 0;
        margin-bottom: 10px;
    }

    blockquote {
        padding: 0 1em;
        margin: 0;
        color: var(--mk-wysiwyg-preview-fg-muted);
        border-left: 0.25em solid var(--mk-wysiwyg-preview-border-default);
    }

    p,
    blockquote,
    ul,
    ol,
    dl,
    table,
    pre,
    details {
        margin-top: 0;
        margin-bottom: 16px;
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
        background-color: var(--mk-wysiwyg-preview-neutral-muted);
        border-radius: 6px;
    }

    pre {
        padding: 16px;
        margin-top: 0;
        margin-bottom: 0;
        overflow: auto;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        font-size: 85%;
        line-height: 1.45;
        word-wrap: normal;
        background-color: var(--mk-wysiwyg-preview-canvas-subtle);
        border-radius: 6px;
    }

    ::placeholder {
        color: var(--mk-wysiwyg-preview-fg-subtle);
        opacity: 1;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        margin: 0;
        appearance: none;
    }

    [data-catalyst] {
        display: block;
    }

    g-emoji {
        font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
        font-size: 1em;
        font-style: normal !important;
        font-weight: 400;
        line-height: 1;
        vertical-align: -0.075em;
    }

    g-emoji img {
        width: 1em;
        height: 1em;
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

    a:not([href]) {
        color: inherit;
        text-decoration: none;
    }

    blockquote > :first-child {
        margin-top: 0;
    }

    blockquote > :last-child {
        margin-bottom: 0;
    }

    sup > a::before {
        content: "[";
    }

    sup > a::after {
        content: "]";
    }

    h1 tt,
    h1 code,
    h2 tt,
    h2 code,
    h3 tt,
    h3 code,
    h4 tt,
    h4 code,
    h5 tt,
    h5 code,
    h6 tt,
    h6 code {
        padding: 0 0.2em;
        font-size: inherit;
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
        margin-top: 16px;
    }

    li + li {
        margin-top: 0.25em;
    }

    dl {
        padding: 0;
    }

    dl dt {
        padding: 0;
        margin-top: 16px;
        font-size: 1em;
        font-style: italic;
        font-weight: 600;
    }

    dl dd {
        padding: 0 16px;
        margin-bottom: 16px;
    }

    table th {
        font-weight: 600;
    }

    table th,
    table td {
        padding: 6px 13px;
        border: 1px solid var(--mk-wysiwyg-preview-border-default);
    }

    table tr {
        background-color: var(--mk-wysiwyg-preview-canvas-default);
        border-top: 1px solid var(--mk-wysiwyg-preview-border-muted);
    }

    table tr:nth-child(2n) {
        background-color: var(--mk-wysiwyg-preview-canvas-subtle);
    }

    table img {
        background-color: transparent;
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
