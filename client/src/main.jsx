import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
