// page/error/routeError.tsx
import { Center, Stack, Title, Text, Anchor } from "@mantine/core";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function RouteError() {
    const error = useRouteError();

    const { title, message } = isRouteErrorResponse(error)
        ? {
              title: error.status === 404 ? "We couldn't find this." : "Something went wrong.",
              message: error.statusText || "Please try again.",
          }
        : {
              title: "Something went wrong.",
              message: "Please try again in a moment.",
          };

    return (
        <Center mih="60vh">
            <Stack align="center" gap="sm">
                <Title order={3}>{title}</Title>
                <Text c="dimmed">{message}</Text>
                <Anchor component={Link} to="/product">
                    Back to all designs
                </Anchor>
            </Stack>
        </Center>
    );
}