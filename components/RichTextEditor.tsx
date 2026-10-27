"use client";

import { useEffect, useRef } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Unlink,
} from "lucide-react";
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
  { icon: AlignLeft, label: "Align left", command: "justifyLeft" },
  { icon: AlignCenter, label: "Align centre", command: "justifyCenter" },
  { icon: AlignRight, label: "Align right", command: "justifyRight" },
];

// No heading 1: the recipe title is the page's one <h1>.
const BLOCK_STYLES = [
  { value: "p", label: "Normal text" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
  { value: "h5", label: "Heading 5" },
  { value: "h6", label: "Heading 6" },
];

const TABLE_ACTIONS = [
  {
    group: "Table",
    items: [
      { value: "insert", label: "Insert table" },
      { value: "addRow", label: "Add row below" },
      { value: "addColumn", label: "Add column right" },
      { value: "deleteRow", label: "Delete row" },
      { value: "deleteColumn", label: "Delete column" },
      { value: "deleteTable", label: "Delete table" },
    ],
  },
  {
    group: "Table width",
    items: [
      { value: "width:full", label: "Full width" },
      { value: "width:three-quarter", label: "3/4 width" },
      { value: "width:half", label: "Half width" },
      { value: "width:fit", label: "Fit to content" },
    ],
  },
  {
    group: "Row height",
    items: [
      { value: "rows:compact", label: "Compact rows" },
      { value: "rows:normal", label: "Normal rows" },
      { value: "rows:tall", label: "Tall rows" },
    ],
  },
];

const SELECT_CLASS =
  "h-8 cursor-pointer rounded-lg border border-transparent bg-transparent px-2 text-xs font-medium text-ink-soft outline-none transition-colors hover:bg-cream-deep hover:text-ink focus:border-line";

/**
 * A small formatting editor for recipe descriptions and notes: bold, italic,
 * lists and links — links to other pages on this site ("/recipes/…") or to
 * other websites ("https://…"). With `blocks`, it also offers headings
 * (2 to 6) and tables.
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
  blocks = false,
  className,
}: {
  value: string | null | undefined;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  /** Offer headings and tables as well. */
  blocks?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Where the cursor was, so a dropdown that takes focus can put it back.
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = toEditorHtml(value);
    // Loaded once per mount on purpose; see the note above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remember every selection made in the editor, however it was made —
  // mouse, keyboard or a drag that ends outside the box.
  useEffect(() => {
    function remember() {
      const selection = window.getSelection();
      if (!selection?.rangeCount || !ref.current) return;
      const range = selection.getRangeAt(0);
      if (ref.current.contains(range.commonAncestorContainer)) {
        savedRange.current = range.cloneRange();
      }
    }
    document.addEventListener("selectionchange", remember);
    return () => document.removeEventListener("selectionchange", remember);
  }, []);

  function emit() {
    if (ref.current) onChange(sanitizeRichText(ref.current.innerHTML));
  }

  function saveSelection() {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !ref.current) return;
    const range = selection.getRangeAt(0);
    if (ref.current.contains(range.commonAncestorContainer)) {
      savedRange.current = range.cloneRange();
    }
  }

  function restoreSelection() {
    ref.current?.focus();
    const selection = window.getSelection();
    if (savedRange.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
  }

  function selectionInside() {
    const selection = window.getSelection();
    return (
      !!selection?.rangeCount &&
      !!ref.current?.contains(selection.getRangeAt(0).commonAncestorContainer)
    );
  }

  function run(command: string, arg?: string) {
    // Toolbar buttons leave the selection where it is; only a dropdown, which
    // takes focus, needs the remembered one put back.
    if (!selectionInside()) restoreSelection();
    document.execCommand(command, false, arg);
    saveSelection();
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

    restoreSelection();
    const selection = window.getSelection();
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

  /** The table cell the cursor is in, if any. */
  function currentCell(): HTMLTableCellElement | null {
    let node: Node | null = savedRange.current?.startContainer ?? null;
    while (node && node !== ref.current) {
      if (node instanceof HTMLTableCellElement) return node;
      node = node.parentNode;
    }
    return null;
  }

  function insertTable() {
    const answer = window.prompt("Rows × columns (the first row is the header), e.g. 3x2", "3x2");
    const match = answer?.trim().match(/^(\d+)\s*[x×*,]\s*(\d+)$/i);
    if (!match) return;
    const rows = Math.min(Math.max(Number(match[1]), 1), 30);
    const cols = Math.min(Math.max(Number(match[2]), 1), 8);
    const head = `<tr>${"<th><br></th>".repeat(cols)}</tr>`;
    const body = Array.from({ length: Math.max(rows - 1, 1) }, () => `<tr>${"<td><br></td>".repeat(cols)}</tr>`).join("");
    run("insertHTML", `<table><thead>${head}</thead><tbody>${body}</tbody></table><p><br></p>`);
  }

  function tableAction(action: string) {
    if (action === "insert") return insertTable();

    const cell = currentCell();
    const row = cell?.parentElement as HTMLTableRowElement | null;
    const table = cell?.closest("table");
    if (!cell || !row || !table) {
      window.alert("Click inside the table first.");
      return;
    }
    const col = cell.cellIndex;
    const rows = Array.from(table.rows);

    if (action === "addRow") {
      const fresh = document.createElement("tr");
      for (let i = 0; i < row.cells.length; i++) {
        const td = document.createElement("td");
        td.innerHTML = "<br>";
        fresh.appendChild(td);
      }
      // A row added under the header goes at the top of the body.
      if (row.parentElement?.tagName === "THEAD") {
        const tbody = table.tBodies[0] ?? table.createTBody();
        tbody.insertBefore(fresh, tbody.firstChild);
      } else {
        row.after(fresh);
      }
    } else if (action === "addColumn") {
      for (const r of rows) {
        const beside = r.cells[Math.min(col, r.cells.length - 1)];
        const fresh = document.createElement(r.parentElement?.tagName === "THEAD" ? "th" : "td");
        fresh.innerHTML = "<br>";
        beside.after(fresh);
      }
    } else if (action === "deleteRow") {
      if (rows.length <= 1) table.remove();
      else row.remove();
    } else if (action === "deleteColumn") {
      if (row.cells.length <= 1) table.remove();
      else for (const r of rows) r.cells[col]?.remove();
    } else if (action === "deleteTable") {
      table.remove();
    } else if (action.startsWith("width:")) {
      table.setAttribute("data-width", action.slice(6));
    } else if (action.startsWith("rows:")) {
      table.setAttribute("data-rows", action.slice(5));
    }
    savedRange.current = null;
    ref.current?.focus();
    emit();
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-paper transition-colors focus-within:border-green",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-line px-2 py-1.5">
        {blocks && (
          <select
            aria-label="Text style"
            title="Text style"
            value=""
            onChange={(e) => {
              const tag = e.target.value;
              if (tag) run("formatBlock", tag);
            }}
            className={SELECT_CLASS}
          >
            <option value="" disabled>
              Text style
            </option>
            {BLOCK_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}
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
        {blocks && (
          <select
            aria-label="Table"
            title="Table"
            value=""
            onChange={(e) => {
              if (e.target.value) tableAction(e.target.value);
            }}
            className={SELECT_CLASS}
          >
            <option value="" disabled>
              Table
            </option>
            {TABLE_ACTIONS.map(({ group, items }) => (
              <optgroup key={group} label={group}>
                {items.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
        onInput={() => {
          saveSelection();
          emit();
        }}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onBlur={() => {
          saveSelection();
          emit();
        }}
        onPaste={(e) => {
          // Pasted text arrives without the source page's styling.
          e.preventDefault();
          document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
          saveSelection();
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
