import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./page/login/login";
import Register from "./page/register/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;