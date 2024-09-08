"use client";

import {
  Chunk,
  EditorState,
  setChunks,
  setParsedList,
} from "./store/editorSlice";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./store";
import { useEffect, useState } from "react";

import Welcome from "@/components/Welcome";
import { useRouter } from "next/navigation";

export default function Page() {
  return (
    <Provider store={store}>
      <Welcome />
    </Provider>
  );
}
