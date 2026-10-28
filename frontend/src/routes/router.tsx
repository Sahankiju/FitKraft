import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/rootLayouts";
import HomePage from "../page/home/homePage";
import SignIn from "../page/login/login";
import Register from "../page/register/register";
import VerifyEmail from "../page/verifications/verifyEmail";
import NotFound from "../page/NotFound/notFound";

export const router = createBrowserRouter([
  {
    path: "/home",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },

  { path: "/login", element: <SignIn /> },
  { path: "/register", element: <Register /> },
  { path: "/verifyEmail", element: <VerifyEmail /> },

  { path: "*", element: <NotFound /> },
]);