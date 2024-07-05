import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DepartmentMain from "./pages/DepartmentMain";
import AdminMain from "./pages/AdminMain";

// 로그인 유무(토큰의 유무)에 따라 로그인/홈 페이지로 이동
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<DepartmentMain />} />
        <Route path="/home/admin" element={<AdminMain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
