import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/site/Navbar";

export default function RootLayout() {
  return (
    <AppShell header={{ height: 70 }} padding={0}>
      <Navbar />
      <AppShell.Main p={0} m={0}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}