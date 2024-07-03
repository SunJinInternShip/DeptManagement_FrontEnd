import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DepartmentMain from "./pages/DepartmentMain";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/regiser" element={<Register />} />
        <Route path="/home" element={<DepartmentMain />} />
        <Route path="/home/admin" element={<DepartmentMain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
