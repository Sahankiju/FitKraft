import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./page/login/login";
import Register from "./page/register/register";
import VerifyEmail from "./page/verifications/verifyEmail";
import HomePage from "./page/home/homePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;