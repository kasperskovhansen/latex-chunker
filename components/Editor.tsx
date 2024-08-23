// TypeScript users only add this code
import { BaseEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { Transforms, createEditor } from "slate";
import { selectRawContent, setRawContent } from "../app/store/editorSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../app/store";
import { ReactEditor } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export default function Editor() {
  const editor = useState(() => withReact(createEditor()))[0];
  const dispatch = useDispatch<AppDispatch>();

  // Select the raw content from Redux
  const rawContent = useSelector(selectRawContent);

  // Handle editor changes and update the raw content in Redux
  const handleValueChange = (value: Descendant[]) => {
    console.log("handleValueChange", value);
    dispatch(setRawContent(value));
  };

  // Update the editor's content when rawContent changes
  useEffect(() => {
    editor.children = rawContent;
    editor.onChange();
  }, [rawContent, editor]); // Dependency array includes editor and rawContent

  useEffect(() => {
    // Fetch the .txt file
    fetch("/editor-default-content.txt")
      .then((response) => response.text()) // Convert the response to text
      .then((text) => {
        dispatch(
          setRawContent([{ type: "paragraph", children: [{ text: text }] }])
        );
      })
      .catch((error) => {
        console.error("Error fetching the text file:", error);
      });
  }, []);

  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];

  // Custom handler for the keydown event
  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();

        // Insert a soft line break
        editor.insertText("\n");
      }
    },
    [editor]
  );

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onValueChange={handleValueChange}
    >
      <Editable onKeyDown={handleKeyDown} />
    </Slate>
  );
}
