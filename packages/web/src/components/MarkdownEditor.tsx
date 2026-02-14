"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { useTheme } from "@/lib/theme";

const darkHighlight = HighlightStyle.define([
  { tag: tags.heading1, color: "#e8c87a", fontWeight: "bold", fontSize: "1.4em" },
  { tag: tags.heading2, color: "#d4a94e", fontWeight: "bold", fontSize: "1.2em" },
  { tag: tags.heading3, color: "#c9a96e", fontWeight: "bold", fontSize: "1.1em" },
  { tag: tags.heading4, color: "#b8952e", fontWeight: "bold" },
  { tag: tags.strong, color: "#f0f0f0", fontWeight: "bold" },
  { tag: tags.emphasis, color: "#d4d4d4", fontStyle: "italic" },
  { tag: tags.link, color: "#6cb6ff", textDecoration: "underline" },
  { tag: tags.url, color: "#6cb6ff" },
  { tag: tags.monospace, color: "#7ee787", backgroundColor: "rgba(110,118,129,0.15)", borderRadius: "3px" },
  { tag: tags.strikethrough, textDecoration: "line-through", color: "#999" },
  { tag: tags.quote, color: "#a5a5a5", fontStyle: "italic" },
  { tag: tags.list, color: "#c9a96e" },
  { tag: tags.separator, color: "#555" },
  { tag: tags.meta, color: "#888" },
  { tag: tags.processingInstruction, color: "#888" },
]);

const lightHighlight = HighlightStyle.define([
  { tag: tags.heading1, color: "#7a5a10", fontWeight: "bold", fontSize: "1.4em" },
  { tag: tags.heading2, color: "#8a6a20", fontWeight: "bold", fontSize: "1.2em" },
  { tag: tags.heading3, color: "#9a7a2e", fontWeight: "bold", fontSize: "1.1em" },
  { tag: tags.heading4, color: "#a08030", fontWeight: "bold" },
  { tag: tags.strong, color: "#1a1a1a", fontWeight: "bold" },
  { tag: tags.emphasis, color: "#333", fontStyle: "italic" },
  { tag: tags.link, color: "#0969da", textDecoration: "underline" },
  { tag: tags.url, color: "#0969da" },
  { tag: tags.monospace, color: "#1a7f37", backgroundColor: "rgba(175,184,193,0.2)", borderRadius: "3px" },
  { tag: tags.strikethrough, textDecoration: "line-through", color: "#888" },
  { tag: tags.quote, color: "#666", fontStyle: "italic" },
  { tag: tags.list, color: "#9a7a2e" },
  { tag: tags.separator, color: "#ccc" },
  { tag: tags.meta, color: "#999" },
  { tag: tags.processingInstruction, color: "#999" },
]);

const baseTheme = {
  "&": {
    backgroundColor: "var(--color-bg-input)",
    color: "var(--color-text)",
    fontSize: "14px",
  },
  ".cm-content": {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    caretColor: "var(--color-text)",
    padding: "12px 0",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--color-text)",
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "var(--color-accent) !important",
    opacity: "0.3",
  },
  ".cm-gutters": {
    backgroundColor: "var(--color-bg-input)",
    borderRight: "1px solid var(--color-border)",
    color: "var(--color-text-muted)",
  },
  ".cm-activeLine": {
    backgroundColor: "var(--color-bg-hover)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--color-bg-hover)",
  },
  ".cm-placeholder": {
    color: "var(--color-text-muted)",
  },
};

const darkTheme = EditorView.theme(baseTheme, { dark: true });
const lightTheme = EditorView.theme(baseTheme, { dark: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  readOnly?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  style,
  readOnly,
}: MarkdownEditorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className ?? ""}`} style={style}>
      <CodeMirror
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          EditorView.lineWrapping,
          syntaxHighlighting(isDark ? darkHighlight : lightHighlight),
        ]}
        theme={isDark ? darkTheme : lightTheme}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
        }}
        style={{ height: "100%" }}
      />
    </div>
  );
}
