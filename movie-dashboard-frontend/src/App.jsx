import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";

export default function App() {
  return (
    <>
      <nav style={{ padding: 10 }}>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/movies">Manajemen Data</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </>
  );
}