import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/rootLayouts";
import HomePage from "../page/home/homePage";
import SignIn from "../page/login/login";
import Register from "../page/register/register";
import VerifyEmail from "../page/verifications/verifyEmail";
import NotFound from "../page/NotFound/notFound";
import ProductPage from "../page/product/productPage";
import ProductDetailPage from "../page/productDetail/productDetail";

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
  {
    path: "/product",
    element:<RootLayout/>,
    children: [
      {
        index: true,
        element: <ProductPage/>,
      },
      {
        path: ":id",
        element: <ProductDetailPage/>
      }
    ],
  },

  { path: "/login", element: <SignIn /> },
  { path: "/register", element: <Register /> },
  { path: "/verifyEmail", element: <VerifyEmail /> },

  { path: "*", element: <NotFound /> },
]);