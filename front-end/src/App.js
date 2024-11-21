import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Components/common/Home";
import Login from "./Components/common/Login";
import Register from "./Components/common/Register";
import UserHome from "./Components/user/UserHome";
import AdminHome from "./Components/admin/AdminHome";
import UserAppointments from "./Components/user/UserAppointments";

function App() {
  const userLoggedIn = !!localStorage.getItem("userData");
  return (
    <div className="App">
      <Router>
        <div className="content">
          <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

            {userLoggedIn ? (
              <>
                <Route path="/adminhome" element={<AdminHome />} />
                <Route path="/userhome" element={<UserHome />} />
                <Route path="/userhome/userappointments/:doctorId" element={<UserAppointments />} />

              </>
            ) : (
              <Route path="c:/Users/Administrator/OneDrive/Documents/NM Porject Nov'24/front-end/src/Components/common/Login" element={<Login />} />
            )}
          </Routes>
        </div>
        <footer className="bg-light text-center text-lg-start">
          <div className="text-center p-3">© 2023 Copyright: MediCareBook</div>
        </footer>
      </Router>
    </div>
  );
}

export default App;