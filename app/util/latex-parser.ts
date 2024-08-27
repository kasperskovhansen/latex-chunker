import { Chunk, ChunkMetadata } from "../store/editorSlice";

import { Element } from "slate";
import { chunk } from "lodash";

// Regex to match \begin{rag}[metadata] ... content ... \end{rag}
const ragRegex = /\\begin{rag}\[(.*?)\]\s*([\s\S]*?)\\end{rag}/gs;

// Function to extract metadata and content from the LaTeX document
export const extractChunksFromDescendants = (
  slateValue: Element[]
): { chunks: Chunk[]; foundNewSubChunks: boolean } => {
  const chunks: Chunk[] = [];
  let foundNewSubChunks = false;
  for (const node of slateValue) {
    const subChunks = extractRagChunks(node);
    if (subChunks.length > 1) {
      foundNewSubChunks = true;
    }
    chunks.push(...subChunks);
  }
  // Assign a color to each chunk. The colors should be visually distinct. It should still be easy to read white text on top of the color. Also assign appropriate text colors based on the background color. (black or white)
  const colorPairs = [
    { color: "#F0F0F0", backgroundColor: "#2C2C2C" }, // Light Gray on Dark Gray
    { color: "#2C2C2C", backgroundColor: "#D4AF37" }, // Dark Gray on Soft Gold
    { color: "#F0F0F0", backgroundColor: "#567D46" }, // Light Gray on Olive Green
    { color: "#F0F0F0", backgroundColor: "#3C6E91" }, // Light Gray on Muted Blue
    { color: "#2C2C2C", backgroundColor: "#D16D58" }, // Dark Gray on Soft Red-Orange
    { color: "#F0F0F0", backgroundColor: "#5D4E8B" }, // Light Gray on Soft Indigo
    { color: "#2C2C2C", backgroundColor: "#D993B5" }, // Dark Gray on Soft Pink
    { color: "#F0F0F0", backgroundColor: "#5A3A3A" }, // Light Gray on Soft Maroon
    { color: "#2C2C2C", backgroundColor: "#E1C16E" }, // Dark Gray on Soft Yellow
    { color: "#F0F0F0", backgroundColor: "#804040" }, // Light Gray on Muted Dark Red
    { color: "#2C2C2C", backgroundColor: "#9ACD32" }, // Dark Gray on Soft Yellow Green
    { color: "#F0F0F0", backgroundColor: "#E2934E" }, // Light Gray on Soft Orange
  ];

  chunks.forEach((chunk, index) => {
    chunk.backgroundColor =
      colorPairs[index % colorPairs.length].backgroundColor;
    chunk.color = colorPairs[index % colorPairs.length].color;
    chunk.id = index;
  });
  return { chunks, foundNewSubChunks };
};

// Function to extract metadata and content from the LaTeX document
const extractRagChunks = (slateDescendant: Element): Chunk[] => {
  const chunks: Chunk[] = [];
  let match;

  const text = slateDescendant.children[0].text;
  // Iterate through all rag environments in the document
  while ((match = ragRegex.exec(text)) !== null) {
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
  const metadataObject: ChunkMetadata = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (["title", "type", "label"].includes(key)) {
      metadataObject[key] = `"${value}"`;
    } else if (key === "parents") {
      metadataObject[key] = `"${value}"`;
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

export const rebuildDescandants = (chunks: Chunk[]): Element[] => {
  return chunks.map((chunk) => {
    return {
      type: "paragraph",
      children: [
        {
          text: `\\begin{rag}[${rebuildMetadata(chunk.metadata)}]
${chunk.content}
\\end{rag}`,
          chunk,
        },
      ],
    };
  });
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
