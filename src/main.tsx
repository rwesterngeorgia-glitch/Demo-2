import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "./store";
import App from "./App";
import "./styles.css";
import { RecoveryBoundary } from './RecoveryBoundary';
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoveryBoundary><Provider>
        <App />
      </Provider></RecoveryBoundary>
    </BrowserRouter>
  </React.StrictMode>,
);
