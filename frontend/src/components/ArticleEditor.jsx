import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";

/**
 * BlockNote editor untuk Admin - mode tulis penuh
 * @param {object} props
 * @param {Array}  props.initialContent - JSON konten awal (untuk mode edit)
 * @param {function} props.onChange - callback saat konten berubah, dipanggil dengan blocks[]
 */
const ArticleEditor = ({ initialContent, onChange }) => {
  const editor = useCreateBlockNote({
    initialContent:
      initialContent && initialContent.length > 0
        ? initialContent
        : undefined,
  });

  // Kirim konten ke parent setiap kali editor berubah
  useEffect(() => {
    const unsubscribe = editor.onChange(() => {
      if (onChange) onChange(editor.document);
    });
    return () => unsubscribe?.();
  }, [editor, onChange]);

  return (
    <div className="w-full min-h-[500px] bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <BlockNoteView
        editor={editor}
        theme="light"
        style={{ minHeight: "500px", padding: "8px" }}
      />
    </div>
  );
};

export default ArticleEditor;
