import { BaseEditor, Descendant, createEditor } from "slate";
import {
  Chunk,
  selectRawContent,
  setRawContent,
} from "../app/store/editorSlice";
import { Editable, Slate, withReact } from "slate-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../app/store";
import Leaf from "./Leaf";
import { ReactEditor } from "slate-react";

export type CustomElement = { type: "paragraph"; children: CustomText[] };
export type CustomText = { text: string; chunk?: Chunk };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export default function Editor() {
  const editor = useState(() => withReact(createEditor()))[0];
  const rawContent = useSelector(selectRawContent);
  const dispatch = useDispatch<AppDispatch>();
  const initialValue: Descendant[] = [
    // {
    //   type: "paragraph",
    //   children: [{ text: "" }],
    // },
  ];

  useEffect(() => {
    fetch("/editor-default-content.txt")
      .then((response) => response.text())
      .then((text) => {
        dispatch(
          setRawContent([{ type: "paragraph", children: [{ text: text }] }])
        );
      })
      .catch((error) => {
        console.error("Error fetching the text file:", error);
      });
  });

  useEffect(() => {
    // console.log("rawContent", JSON.parse(JSON.stringify(rawContent)));
    if (JSON.stringify(rawContent) === JSON.stringify(editor.children)) {
      return;
    }
    editor.children = rawContent;
    editor.onChange();
  }, [rawContent, editor]);

  const handleValueChange = (value: Descendant[]) => {
    console.log("handleValueChange value");
    console.log(value);
    dispatch(setRawContent(value as CustomElement[]));
  };

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
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
      <Editable
        onKeyDown={handleKeyDown}
        renderLeaf={(props) => <Leaf {...props} />}
      />
    </Slate>
  );
}
