import { Chunk, ChunkMetadata } from "../store/editorSlice";

import { CustomElement } from "@/components/Editor";

// Regex to match \begin{rag}[metadata] ... content ... \end{rag}
const ragRegex = /\\begin{rag}\[(.*?)\]\s*([\s\S]*?)\\end{rag}/gs;

// Function to extract metadata and content from the LaTeX document
export const extractChunksFromDescendants = (
  slateValue: CustomElement[]
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
const extractRagChunks = (slateElement: CustomElement): Chunk[] => {
  const chunks: Chunk[] = [];
  let match;

  const text = slateElement.children[0].text;

  // console.log("extractRagChunks: text", text);
  // Iterate through all rag environments in the document
  while ((match = ragRegex.exec(text)) !== null) {
    const metadataString = match[1]; // Metadata part
    const content = match[2].trim(); // Content part

    // Parse metadata into key-value pairs
    const metadata: ChunkMetadata = {};

    metadataString.split("\n").forEach((meta) => {
      if (meta === "") {
        return;
      }
      // Remove leading and trailing whitespaces and trailing commas

      meta = meta.trim().replace(/,$/, "");

      let [key, value] = meta.split("=");
      key = key.trim();
      value = value.trim();
      if (value === undefined) {
        return;
      }
      let parsedValue = value.trim().replace(/^"(.*)"$/, "$1");
      let finalValue: any;

      if (["parents", "keywords"].includes(key)) {
        const match = parsedValue.match(/^\{(.*?)\}$/);
        if (match) {
          // If the matched group is empty, return an empty array.
          if (match[1] === "") {
            finalValue = [];
          } else {
            // Split the values by commas and return the array.
            finalValue = match[1].split(",");
            // Remove quotes from each value
            finalValue = finalValue.map((val: string) => {
              return val.trim().replace(/^"(.*)"$/, "$1");
            });
          }
        } else {
          finalValue = [];
        }
      } else if (key === "nooftokens") {
        finalValue = parseInt(parsedValue);
      } else {
        finalValue = parsedValue;
      }
      metadata[key.trim()] = finalValue;
    });
    // Add the extracted chunk (metadata + content) to the result array
    chunks.push({ metadata, content });
  }

  // console.log("extractRagChunks: chunks", chunks);
  return chunks;
};

const rebuildMetadata = (metadata?: ChunkMetadata): string => {
  if (metadata === undefined) {
    return "";
  }
  const metadataObject: any = {};
  for (const [key, value] of Object.entries(metadata)) {
    const trimmedKey = key.trim();
    if (["id", "title", "type", "label"].includes(trimmedKey)) {
      metadataObject[trimmedKey] = `"${value}"`;
    } else if (["parents", "keywords"].includes(trimmedKey)) {
      if (value.length == 0) {
        metadataObject[trimmedKey] = `"{}"`;
      } else {
        let typedValue = value;
        if (!Array.isArray(value)) {
          typedValue = [];
        }
        const items = typedValue.map((parent: string) => `"${parent}"`);
        metadataObject[trimmedKey] = `{${items.join(", ")}}`;
      }
    } else if (trimmedKey === "nooftokens") {
      metadataObject[trimmedKey] = value;
    }
  }

  const result =
    "\n" +
    Object.entries(metadataObject)
      .map(([key, value]) => `${key}=${value}`)
      .join(",\n") +
    "\n";

  return result;
};

export const rebuildDescandants = (chunks: Chunk[]): CustomElement[] => {
  const rebuiltEditorContent = chunks.map((chunk) => {
    return {
      type: "paragraph",
      children: [
        {
          text: `\\begin{rag}[${rebuildMetadata(chunk?.metadata)}]
  ${chunk.content}
  \\end{rag}`,
          chunk,
        },
      ],
    } as CustomElement;
  });
  console.trace("rebuiltEditorContent", rebuiltEditorContent);
  return rebuiltEditorContent;
};

export const rebuildLatexDocument = (chunks: Chunk[]) => {
  return rebuildDescandants(chunks);
};
