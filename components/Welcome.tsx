"use client";

import {
  Chunk,
  EditorState,
  setChunks,
  setParsedList,
} from "../app/store/editorSlice";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "../app/store";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function Welcome() {
  const [textAreaValue, setTextAreaValue] = useState("");
  const chunks = useSelector((state: RootState) => state.editor.chunks); // Get the relevant state from Redux store
  const router = useRouter();

  const parseContent = (content: string): Chunk[] => {
    console.log("Parsing content");
    console.log(content);
    return [
      {
        id: 0,
        content: "fdsfdsf",
        metadata: {
          title: "New Chunk",
          type: "chunk",
          label: "new",
          parents: [],
          keywords: [],
          nooftokens: 0,
        },
      },
    ];
  };

  const onClickParse = async () => {
    const parsedContent = parseContent(textAreaValue);
    store.dispatch(setChunks(parsedContent));

    // React next router navigate to page /editor
  };

  useEffect(() => {
    if (chunks.length > 0) {
      router.push("/editor");
    }
  });

  return (
    <>
      <h1>Welcome. Paste text or upload file</h1>
      <textarea
        className="text-black"
        name=""
        id=""
        placeholder="Paste text here"
        value={textAreaValue}
        onChange={(e) => setTextAreaValue(e.target.value)}
      ></textarea>
      <br />
      <button className="bg-white text-black" onClick={onClickParse}>
        Parse content
      </button>
    </>
  );
}
