import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <Router>
    <ToastContainer
      autoClose={2000}
      pauseOnFocusLoss={false}
      pauseOnHover={false}
    />
    <App />
  </Router>
);
