"use client";

import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useRef, useState } from "react";
import { postFontGroups, postFonts, postSizes } from "@/lib/postFonts";
import { FontSize } from "./fontSize";
import { uploadImage } from "./uploadImage";

// "Lora, Georgia, serif" or "'Playfair Display', …" -> "Lora" / "Playfair Display"
const firstFont = (css?: string) => css?.split(",")[0].trim().replace(/^['"]|['"]$/g, "").toLowerCase() ?? "";

type Props = { value: string; onChange: (html: string) => void };

function ToolButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`rounded px-2.5 py-1.5 text-sm font-semibold disabled:opacity-40 ${
        active ? "bg-navy text-white" : "text-navy hover:bg-line/60"
      }`}
    >
      {label}
    </button>
  );
}

export default function Editor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ HTMLAttributes: { class: "rounded-md" } }),
      TextStyle,
      FontFamily,
      FontSize,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "post-body min-h-[340px] px-4 py-3 focus:outline-none", "aria-label": "Post content" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address (https://…)", previous ?? "https://");
    if (url === null) return;
    if (url === "" || url === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const pickImage = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !editor) return;

      setUploadError(null);
      setUploading(true);
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url, alt: "" }).run();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Could not upload the image.");
      } finally {
        setUploading(false);
      }
    },
    [editor],
  );

  if (!editor) return <div className="min-h-[400px] rounded-md border border-line bg-white" />;

  const textStyle = editor.getAttributes("textStyle");
  const currentFont = firstFont(textStyle.fontFamily as string | undefined);
  const selectedFont = postFonts.find((f) => f.label.toLowerCase() === currentFont)?.label ?? "";
  const selectedSize = postSizes.find((s) => s.css === textStyle.fontSize)?.css ?? "";
  const selectClass = "rounded border border-line bg-white px-2 py-1.5 text-sm font-semibold text-navy";

  return (
    <div className="rounded-md border border-line bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-line p-2">
        <label className="sr-only" htmlFor="editor-font">Font</label>
        <select
          id="editor-font"
          value={selectedFont}
          onChange={(e) => {
            const font = postFonts.find((f) => f.label === e.target.value);
            const chain = editor.chain().focus();
            (font ? chain.setFontFamily(font.css) : chain.unsetFontFamily()).run();
          }}
          title="Font for the selected text"
          className={selectClass}
        >
          <option value="">Default font</option>
          {postFontGroups.map((g) => (
            <optgroup key={g.group} label={g.group}>
              {g.fonts.map((f) => (
                <option key={f.label} value={f.label} style={{ fontFamily: f.css }}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <label className="sr-only" htmlFor="editor-size">Text size</label>
        <select
          id="editor-size"
          value={selectedSize}
          onChange={(e) => {
            const chain = editor.chain().focus();
            (e.target.value ? chain.setFontSize(e.target.value) : chain.unsetFontSize()).run();
          }}
          title="Size of the selected text"
          className={`${selectClass} mr-1`}
        >
          <option value="">Normal size</option>
          {postSizes.map((s) => (
            <option key={s.css} value={s.css}>
              {s.label}
            </option>
          ))}
        </select>
        <ToolButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolButton label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolButton label="Subheading" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <ToolButton label="Bullets" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolButton label="Numbers" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolButton label="Link" active={editor.isActive("link")} onClick={setLink} />
        <ToolButton label={uploading ? "Uploading…" : "Photo"} disabled={uploading} onClick={pickImage} />
        <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} />
        <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} />
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      {uploadError && <p className="border-b border-line bg-red-50 px-3 py-2 text-sm text-red-800">{uploadError}</p>}
      <EditorContent editor={editor} />
    </div>
  );
}
