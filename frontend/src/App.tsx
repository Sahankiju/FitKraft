import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./page/login/login";
import Register from "./page/register/register";
import VerifyEmail from "./page/verifications/verifyEmail";
import HomePage from "./page/home/homePage";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Notifications />
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}