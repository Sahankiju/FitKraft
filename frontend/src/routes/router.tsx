import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/rootLayouts";
import HomePage from "../page/home/homePage";
import SignIn from "../page/login/login";
import Register from "../page/register/register";
import VerifyEmail from "../page/verifications/verifyEmail";
import NotFound from "../page/NotFound/notFound";
import ProductPage from "../page/product/productPage";
import { productPageLoader } from "../page/product/productPage.Loader";
import ProductDetail from "../page/productDetail/productDetail";
import { productDetailLoader } from "../page/productDetail/productDetail";
import MeasurementPage from "../page/measurement/measurementPage";
import CustomisationsPage from "../page/Customisations/CustomisationsPage";
import AdminRoute from "./adminRoute";
import RouteError from "./routeError";
import { measurementLoader } from "../page/measurement/measurement.Loader";

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
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProductPage />,
        loader: productPageLoader,  
        errorElement: <RouteError />,
      },
      {
        path: ":id",
        element: <ProductDetail />,
        loader: productDetailLoader,
        errorElement: <RouteError />,
      }
    ],
  },
  {
    path: "/measurements",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MeasurementPage />,
        loader: measurementLoader,
        errorElement: <RouteError/>
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin/customisations",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <CustomisationsPage />,
          },
        ],
      },
    ],
  },

  { path: "/login", element: <SignIn /> },
  { path: "/register", element: <Register /> },
  { path: "/verifyEmail", element: <VerifyEmail /> },

  { path: "*", element: <NotFound /> },
]);