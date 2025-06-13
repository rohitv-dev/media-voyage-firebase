import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/notifications/styles.css";

const rootElement = document.getElementById("root");

if (!rootElement!.innerHTML) {
  const root = ReactDOM.createRoot(rootElement!);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
