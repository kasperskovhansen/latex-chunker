"use client";

import { Provider } from "react-redux";
import Sidebar from "@/components/Sidebar";
import { setParsedList } from "../store/editorSlice";
import store from "../store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Editor() {
  return (
    <Provider store={store}>
      <Sidebar></Sidebar>
    </Provider>
  );
}
