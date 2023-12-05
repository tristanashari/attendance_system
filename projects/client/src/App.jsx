import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminHome from "./pages/Admin/AdminHome";
import SetPassword from "./pages/Employee/SetPassword";
import EmployeeHome from "./pages/Employee/EmployeeHome";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/employee" element={<EmployeeHome />} />
          <Route path="/set-password/:setPasswordToken" element={<SetPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
