"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, List, ListOrdered, Link2, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeRichText, toEditorHtml } from "@/lib/rich-text";
import { RICH_TEXT_STYLES } from "./RichText";

const TOOLS = [
  { icon: Bold, label: "Bold", command: "bold" },
  { icon: Italic, label: "Italic", command: "italic" },
  { icon: List, label: "Bullet list", command: "insertUnorderedList" },
  { icon: ListOrdered, label: "Numbered list", command: "insertOrderedList" },
  { icon: Link2, label: "Add link", command: "link" },
  { icon: Unlink, label: "Remove link", command: "unlink" },
];

/**
 * A small formatting editor for recipe descriptions and notes: bold, italic,
 * lists and links — links to other pages on this site ("/recipes/…") or to
 * other websites ("https://…").
 *
 * It is uncontrolled: the stored value is loaded once when it mounts, so give
 * it a `key` that changes when a different recipe is opened. Every change is
 * cleaned to the same allowlist the public pages use before it is passed up.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = "6rem",
  className,
}: {
  value: string | null | undefined;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = toEditorHtml(value);
    // Loaded once per mount on purpose; see the note above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emit() {
    if (ref.current) onChange(sanitizeRichText(ref.current.innerHTML));
  }

  function run(command: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  }

  function addLink() {
    const url = window.prompt(
      "Link address:\n• Page on this site — e.g. /recipes/chocolate-cherry-cake\n• Another website — e.g. https://example.com"
    );
    if (!url?.trim()) return;
    const href = url.trim();
    if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href) || href.startsWith("//")) {
      window.alert("Use a site path starting with / or a full address starting with https://");
      return;
    }

    const selection = window.getSelection();
    ref.current?.focus();
    if (selection && !selection.isCollapsed) {
      run("createLink", href);
    } else {
      // Nothing selected: the address itself becomes the link text.
      const safe = href.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
      run("insertHTML", `<a href="${safe}">${safe}</a>`);
    }
  }

  function applyTool(command: string) {
    if (command === "link") addLink();
    else run(command);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-paper transition-colors focus-within:border-green",
        className
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-line px-2 py-1.5">
        {TOOLS.map(({ icon: Icon, label, command }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            // Keep the text selection when the button is pressed.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyTool(command)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-cream-deep hover:text-ink"
          >
            <Icon size={15} />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
        onInput={emit}
        onBlur={emit}
        onPaste={(e) => {
          // Pasted text arrives without the source page's styling.
          e.preventDefault();
          document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
          emit();
        }}
        style={{ minHeight }}
        className={cn(
          "px-4 py-3 text-sm text-ink outline-none",
          "empty:before:pointer-events-none empty:before:text-ink-soft/60 empty:before:content-[attr(data-placeholder)]",
          RICH_TEXT_STYLES
        )}
      />
    </div>
  );
}
