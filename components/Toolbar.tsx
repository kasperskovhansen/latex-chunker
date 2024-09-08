import { selectParsedList, selectRawContent } from "@/app/store/editorSlice";

import { cloneDeep } from "lodash";
import { downloadFile } from "@/app/util/file-export";
import { rebuildLatexDocument } from "@/app/util/latex-parser";
import { useSelector } from "react-redux";

export default function Toolbar() {
  const parsedList = useSelector(selectParsedList);

  const exportChunks = () => {
    const listToExport = cloneDeep(parsedList).map((chunk) => {
      delete chunk?.id;
      delete chunk?.backgroundColor;
      delete chunk?.color;
      return chunk;
    });
    const json = JSON.stringify(listToExport, null, 2);
    downloadFile("chunks.json", json, "application/json");
  };

  function exportLaTeX() {
    const text = rebuildLatexDocument(parsedList);
    downloadFile("document.tex", text, null, 2, "text/plain");
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
