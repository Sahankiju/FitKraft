import { AppShell } from "@mantine/core";
import { Outlet } from "react-router";
import { Navbar } from "../components/site/Navbar";

export default function RootLayout() {
  return (
    <AppShell header={{ height: 70 }}>
      <Navbar />
      <AppShell.Main p={0} w="100%">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}