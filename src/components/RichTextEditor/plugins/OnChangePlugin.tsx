import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useEffect } from "react";
import { $getRoot, $insertNodes } from "lexical";

interface OnChangePluginProps {
  onChange: (html: string) => void;
  initialValue?: string;
}

export default function OnChangePlugin({
  onChange,
  initialValue,
}: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();

  // Set initial value
  useEffect(() => {
    if (initialValue && initialValue.trim() !== "") {
      editor.update(() => {
        // Parse HTML and insert into editor
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialValue, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);

        // Clear existing content
        $getRoot().clear();

        // Insert new nodes
        $insertNodes(nodes);
      });
    }
  }, [editor, initialValue]);

  // Listen to changes
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        onChange(htmlString);
      });
    });
  }, [editor, onChange]);

  return null;
}
