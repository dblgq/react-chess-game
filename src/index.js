import React from "react";
import ReactDOM from "react-dom/client"; // Изменено
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Изменено

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
