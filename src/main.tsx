import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./index.css"
import {openDB} from "idb";
import DBContext from "./DBContext.tsx";
import {RouterProvider} from "react-router-dom";
import {router} from "./app/routes.tsx";

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  const run = async () => {
    const db = await openDB('main', 1);

    root.render(
      <React.StrictMode>
        <DBContext.Provider value={db}>
          <Provider store={store}>
            <RouterProvider router={router} />
          </Provider>
        </DBContext.Provider>
      </React.StrictMode>,
    )
  };

  run();
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
