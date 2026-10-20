import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import ProjectList from "./pages/ProjectList";
import ProjectDetails from "./pages/ProjectDetails";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">Project Management</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;