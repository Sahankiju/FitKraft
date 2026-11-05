import { RouterProvider } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import { router } from "./routes/router";
import { MantineProvider } from "@mantine/core";


export default function App() {
  return (
    <MantineProvider>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}


