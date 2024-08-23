"use client";

import Editor from "../components/Editor";
import { Provider } from "react-redux";
import Sidebar from "../components/Sidebar";
import store from "./store";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="h-screen w-full grid grid-cols-6  gap-4">
        <div className="sidebar pl-4 col-span-2 h-full overflow-x-scroll">
          <h1 className="text-white text-2xl">LaTeX Chunker</h1>
          <Sidebar />
        </div>
        <div className="editor-container h-full bg-black text-white col-span-4 max-h-full overflow-x-scroll">
          <Editor />
        </div>
      </div>
    </Provider>
  );
}
