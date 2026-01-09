import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { initializeMockUser } from "./data/mockUser";

// Initialize mock user data
initializeMockUser();

createRoot(document.getElementById("root")!).render(<App />);
