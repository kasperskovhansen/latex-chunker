import { Chunk, ChunkMetadata } from "../store/editorSlice";

// Regex to match \begin{rag}[metadata] ... content ... \end{rag}
const ragRegex = /\\begin{rag}\[(.*?)\]\s*([\s\S]*?)\\end{rag}/gs;

// Function to extract metadata and content from the LaTeX document
export const extractRagChunks = (latexText: string): Chunk[] => {
  const chunks = [];
  let match;

  // Iterate through all rag environments in the document
  while ((match = ragRegex.exec(latexText)) !== null) {
    const metadataString = match[1]; // Metadata part
    const content = match[2].trim(); // Content part

    // Parse metadata into key-value pairs
    const metadata: ChunkMetadata = {};

    metadataString.split(",").forEach((meta) => {
      if (meta === "") {
        return;
      }
      const [key, value] = meta.split("=");
      if (value === undefined) {
        return;
      }
      metadata[key.trim()] = value.trim().replace(/^"(.*)"$/, "$1");
    });

    // Add the extracted chunk (metadata + content) to the result array
    chunks.push({ metadata, content });
  }

  return chunks;
};

const rebuildMetadata = (metadata: ChunkMetadata) => {
  if (metadata === undefined) {
    return "";
  }
  const metadataString = "";
  const metadataObject = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (["title", "type", "label"].includes(key)) {
      metadataObject[key] = `"${value}"`;
    } else if (key === "parents") {
      metadataObject[key] = `"${value}"`;
    } else if (key === "nooftokens") {
      metadataObject[key] = `${value}`;
    } else if (key === "nooftokens") {
      metadataObject[key] = `${value}`;
    }
  }

  return (
    "\n" +
    Object.entries(metadataObject)
      .map(([key, value]) => `${key}=${value}`)
      .join(",\n") +
    "\n"
  );
};

export const rebuildLatexDocument = (chunks: Chunk[]) => {
  return chunks
    .map((chunk) => {
      return `\\begin{rag}[${rebuildMetadata(chunk.metadata)}]
${chunk.content}
\\end{rag}`;
    })
    .join("\n");
};
