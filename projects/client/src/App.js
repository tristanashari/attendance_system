import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/mainComponents/Login";
import { HomeAdmin } from "./components/mainComponents/HomeAdmin";
import { HomeEmployee } from "./components/mainComponents/HomeEmployee";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<HomeAdmin />} />
          <Route path="/employee" element={<HomeEmployee />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
