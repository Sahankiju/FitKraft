import { useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../../lib/auth-client";
import {
  Button,
  Center,
  Container,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173/",
    });
  };

  const Login = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  };

  return (
    <Container size={420} my={80}>
      <Center h="calc(100vh - 160px)">
        <Paper
          withBorder
          shadow="md"
          p={30}
          radius="md"
          w="100%"
        >
          <form onSubmit={Login}>
            <Stack>
              <Title order={2} ta="center">
                Welcome Back
              </Title>

              <Text size="sm" c="dimmed" ta="center">
                Sign in to your FitKraft account.
              </Text>

              <TextInput
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />

              <Button type="submit" fullWidth>
                Login
              </Button>

              <Divider label="OR" labelPosition="center" />

              <Button
                type="button"
                variant="default"
                fullWidth
                onClick={loginWithGoogle}
              >
                Continue with Google
              </Button>
            </Stack>
          </form>
        </Paper>
      </Center>
    </Container>
  );
}