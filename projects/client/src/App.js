import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/mainComponents/Login";
import { HomeAdmin } from "./components/mainComponents/HomeAdmin";
import { HomeEmployee } from "./components/mainComponents/HomeEmployee";
import { AddEmployeeMobile } from "./components/mainComponents/AddEmployeeMobile";
import { SetPassword } from "./components/mainComponents/SetPassword";
import { AttendanceLogMobile } from "./components/mainComponents/AttendanceLogMobile";
import { Payroll } from "./components/mainComponents/Payroll";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<HomeAdmin />} />
          <Route path="/employee" element={<HomeEmployee />} />
          <Route path="/add-employee" element={<AddEmployeeMobile />} />
          <Route path="/set-password/:setPasswordToken" element={<SetPassword />} />
          <Route path="/attendance-log" element={<AttendanceLogMobile />} />
          <Route path="/payroll" element={<Payroll />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
