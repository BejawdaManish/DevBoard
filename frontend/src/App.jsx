import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./page/Login";
import Register from "./page/Register";

import Dashboard from "./page/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;