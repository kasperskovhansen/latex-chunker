import { selectParsedList, selectRawContent } from "@/app/store/editorSlice";

import { rebuildLatexDocument } from "@/app/util/latex-parser";
import { useSelector } from "react-redux";

export default function Toolbar() {
  const parsedList = useSelector(selectParsedList);

  const exportChunks = () => {
    // Convert chunks to JSON
    const json = JSON.stringify(parsedList);

    // Create a Blob object with the JSON data
    const blob = new Blob([json], { type: "application/json" });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chunks.json";

    // Simulate a click on the download link
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  function exportLaTeX() {
    // Convert the parsed list to LaTeX
    const text = rebuildLatexDocument(parsedList);

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "output.tex";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <button
        onClick={exportChunks}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Export Chunks
      </button>
      <button
        onClick={exportLaTeX}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Export LaTeX
      </button>
    </>
  );
}
