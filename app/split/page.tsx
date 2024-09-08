"use client";

import Editor from "../../components/Editor";
import { Provider } from "react-redux";
import Sidebar from "../../components/Sidebar";
import Toolbar from "@/components/Toolbar";
import store from "../store";

export default function Page() {
  return (
    <Provider store={store}>
      <div className="h-[calc(80px)] bg-black text-white flex justify-between items-center px-10 border-b-4">
        <h1 className="text-2xl font-bold text-white">LaTeX Chunker</h1>
        <div className="flex items-center justify-center gap-8">
          <Toolbar />
        </div>
      </div>
      <div className="h-[calc(100vh-80px)] w-full grid grid-cols-6 gap-4">
        <div className="h-full max-h-full col-span-2 overflow-y-hidden sidebar">
          <Sidebar />
        </div>
        <div className="h-full max-h-full col-span-4 overflow-y-scroll text-white bg-black editor-container">
          <Editor />
        </div>
      </div>
    </Provider>
  );
}
