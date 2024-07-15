import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DepartmentMain from "./pages/DepartmentMain";
import AdminMain from "./pages/AdminMain";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Management from "./pages/Management";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<DepartmentMain />} />
        <Route path="/home/admin" element={<AdminMain />} />
        <Route path="/temp/home" element={<Home />} />
        <Route path="/temp/search" element={<Search />} />
        <Route path="/temp/management" element={<Management />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
