import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DepartmentMain from "./pages/DepartmentMain";
import AdminMain from "./pages/AdminMain";
import Home from "./pages/Home";
import TopBar from "./components/TopBar";

function App() {
  return (
    <BrowserRouter>
    <TopBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<DepartmentMain />} />
        <Route path="/home/admin" element={<AdminMain />} />
        <Route path="/temp/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
