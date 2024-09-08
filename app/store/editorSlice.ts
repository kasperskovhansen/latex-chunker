import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  extractChunksFromDescendants,
  rebuildDescandants,
} from "../util/latex-parser";

import { CustomElement } from "@/components/Editor";
import { RootState } from "./index";
import { cloneDeep } from "lodash";

// Chunk type for list items
export interface Chunk {
  id?: number;
  content?: string;
  metadata?: ChunkMetadata;
  backgroundColor?: string;
  color?: string;
}

export interface ChunkMetadata {
  id?: string;
  title?: string;
  type?: string;
  label?: string;
  parents?: string[];
  keywords?: string[];
  nooftokens?: number;
  [key: string]: any;
}

// Initial state for editor
export interface EditorState {
  rawContent: CustomElement[]; // Raw content from editor
  parsedList: Chunk[]; // List extracted from rawContent
  chunks: Chunk[];
}

const initialState: EditorState = {
  rawContent: [
    // { type: "paragraph", children: [{ text: "Loading content..." }] },
  ], // Initial empty content
  parsedList: [
    // {
    //   content: "Loading content...",
    //   metadata: { title: "Loading content..." },
    // },
  ], // Initial empty list
  chunks: [],
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    // Action to update raw content (from editor)
    setRawContent(state, action: PayloadAction<CustomElement[]>) {
      // Only update if rawContent has changed
      const actionPayload = JSON.parse(JSON.stringify(action.payload));
      if (JSON.stringify(state.rawContent) != JSON.stringify(action.payload)) {
        // state.rawContent = action.payload;
        // Parse rawContent into a list of chunks
        const { chunks, foundNewSubChunks } = extractChunksFromDescendants(
          action.payload
        );
        console.log("foundNewSubChunks: ", foundNewSubChunks);
        const newRawContent = unparseContent(chunks);
        if (
          JSON.stringify(state.rawContent) != JSON.stringify(newRawContent) ||
          foundNewSubChunks
        ) {
          state.parsedList = chunks;
          state.rawContent = unparseContent(chunks);
        }
      }
    },

    // Action to update parsed list (from sidebar)
    setParsedList(state, action: PayloadAction<Chunk[]>) {
      console.log("setParsedList: ", action.payload);
      // Only update if parsedList has changed
      const newParsedList = action.payload;
      state.parsedList = newParsedList;
      // Convert parsedList back to rawContent
      state.rawContent = unparseContent(newParsedList);
    },
    setChunks(state, action: PayloadAction<Chunk[]>) {
      state.chunks = action.payload;
    },

    // Helper to add new Chunk in the parsed list
    addChunk(state, action: PayloadAction<string>) {
      const newChunk = {
        content: action.payload,
        metadata: {
          title: "New Chunk",
          type: "chunk",
          label: "new",
          parents: [],
          keywords: [],
          nooftokens: 0,
        },
        id: state.parsedList.length,
      };
      const newParsedList = [...state.parsedList, newChunk];
      state.parsedList = newParsedList;
      state.rawContent = unparseContent(newParsedList);
    },

    // Helper to update a specific chunk in the parsed list
    updateChunk(
      state,
      action: PayloadAction<{
        chunkIndex: number;
        metadataKey: string;
        newValue: any;
      }>
    ) {
      const { chunkIndex, metadataKey, newValue } = action.payload;
      if (state.parsedList[chunkIndex]) {
        const newParsedList = cloneDeep(state.parsedList);

        const metadata = newParsedList[chunkIndex].metadata;
        if (metadata !== undefined && metadata.hasOwnProperty(metadataKey)) {
          metadata[metadataKey] = newValue;
          const newRawContent = unparseContent(newParsedList);

          state.parsedList = newParsedList;
          state.rawContent = newRawContent;
        }
      }
    },

    // Helper to remove a specific chunk
    removeChunk(state, action: PayloadAction<number>) {
      state.parsedList.splice(action.payload, 1);
      state.rawContent = unparseContent(state.parsedList);
    },
  },
});

// Unparser function to convert list back to raw content
export const unparseContent = (parsedList: Chunk[]): CustomElement[] => {
  return rebuildDescandants(parsedList);
};

// Selector to get raw content from the store
export const selectRawContent = (state: RootState) => state.editor.rawContent;

// Selector to get parsed list (chunks) from the store
export const selectParsedList = (state: RootState) => state.editor.parsedList;

// Actions and reducer export
export const {
  setRawContent,
  setParsedList,
  setChunks,
  addChunk,
  updateChunk,
  removeChunk,
} = editorSlice.actions;

export default editorSlice.reducer;
