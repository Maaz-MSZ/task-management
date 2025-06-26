import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import ListItem from '@tiptap/extension-list-item';
import { Button } from "@/components/ui/button";

const TiptapEditor = ({ onSubmit }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false }
      }),
       ListItem,
      Placeholder.configure({ placeholder: "Write a rich comment..." }),
      Underline,
      Strike,
      Link.configure({ openOnClick: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      CodeBlock,
      Blockquote,
      HorizontalRule,
      HardBreak
    ],
    content: "",
  });

  const handlePost = () => {
    if (!editor || editor.isEmpty) return;
    const html = editor.getHTML();
    if (html === "<p></p>") return;
    onSubmit(html);
    editor.commands.clearContent();
  };

  if (!editor) return null;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border rounded-md px-2 py-1 bg-muted">
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()}>Bold</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleStrike().run()}>Strike</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setHorizontalRule().run()}>HR</Button>
        <Button size="sm" variant="ghost" onClick={() => editor.commands.clearContent()}>Clear</Button>
      </div>

      {/* Editor */}
      <div className="border rounded-md p-2 min-h-[150px] cursor-text">
        <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none focus:ring-0 focus:border-transparent" />
      </div>

      <Button onClick={handlePost} className="mt-2">Post Comment</Button>
    </div>
  );
};

export default TiptapEditor;
