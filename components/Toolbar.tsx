import { selectParsedList, selectRawContent } from "@/app/store/editorSlice";

import { downloadFile } from "@/app/util/file-export";
import { rebuildLatexDocument } from "@/app/util/latex-parser";
import { useSelector } from "react-redux";

export default function Toolbar() {
  const parsedList = useSelector(selectParsedList);

  const exportChunks = () => {
    const json = JSON.stringify(parsedList);
    downloadFile("chunks.json", json, "application/json");
  };

  function exportLaTeX() {
    const text = rebuildLatexDocument(parsedList);
    downloadFile("document.tex", text, "text/plain");
  }

  return (
    <>
      <button
        onClick={exportChunks}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Export Chunks
      </button>
      <button
        onClick={exportLaTeX}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Export LaTeX
      </button>
    </>
  );
}
