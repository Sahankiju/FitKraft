import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/site/Navbar";

export default function RootLayout() {
  return (
    <AppShell
    header={{ height: { base: 50, md: 80 } }}
    padding={0}>
    <AppShell.Header>
        <Navbar />
    </AppShell.Header>

    <AppShell.Main>
        <Outlet />
    </AppShell.Main>
</AppShell>
  );
}