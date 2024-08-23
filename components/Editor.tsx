import { Descendant, Transforms, createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { debounce, difference, throttle } from "lodash";
import { selectRawContent, setRawContent } from "../app/store/editorSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../app/store";

export default function Editor() {
  const editor = useState(() => withReact(createEditor()))[0];
  const dispatch = useDispatch<AppDispatch>();

  // Select the raw content from Redux
  const rawContent = useSelector(selectRawContent);

  // Handle editor changes and update the raw content in Redux
  const handleValueChange = (value: Descendant[]) => {
    // Convert Slate nodes to plain text
    console.log("handleValueChange");
    console.log(JSON.parse(JSON.stringify(rawContent)));
    console.log(JSON.parse(JSON.stringify(value)));
    if (JSON.stringify(rawContent) === JSON.stringify(value)) {
      console.log("return from handleValueChange");
      return;
    }
    // difference(rawContent, value).forEach((node: any) => {
    //   console.log(node);
    // });
    const newText = value.map((node: any) => node.children[0].text).join("\n");
    dispatch(setRawContent(newText));
  };

  // Update the editor's content when rawContent changes
  useEffect(() => {
    // Convert rawContent into Slate nodes
    const editorValue: Descendant[] = rawContent
      ? rawContent.split("\n").map((line) => ({
          type: "paragraph",
          children: [{ text: line }],
        }))
      : [];

    editor.children = editorValue;
    editor.onChange();
  }, [rawContent, editor]); // Dependency array includes editor and rawContent

  useEffect(() => {
    // Fetch the .txt file
    fetch("/editor-default-content.txt")
      .then((response) => response.text()) // Convert the response to text
      .then((text) => {
        dispatch(setRawContent(text));
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

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onValueChange={handleValueChange}
    >
      <Editable />
    </Slate>
  );
}
