import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/site/Navbar";
import { Footer } from "../components/site/footer";
import classes from "./rootLayouts.module.css";

export default function RootLayout() {
  return (
    <AppShell
      header={{ height: { base: 50, md: 80 } }}
      padding={0}
      classNames={{
        main: classes.main,
        header: classes.header,
      }}
    >
      <AppShell.Header>
        <Navbar />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet  />
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}