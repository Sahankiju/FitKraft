import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../../lib/auth-client";
import { XIcon, CheckIcon } from "@phosphor-icons/react";
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
import { notifications } from "@mantine/notifications";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const registerWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173/",
    });
  };

  const signUp = async (e: SubmitEvent) => {
    e.preventDefault();
    console.log("Sign Up initiated with:", { email, name, password });
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });
    if (error) {
      notifications.show({
        title: "Sign Up Failed",
        message: error.message,
        color: "red",
        icon: <XIcon size={20} />,
      });

      return;
    }
    
    notifications.show({
      title: "OTP Sent",
      message: "Check your email for the verification code.",
      color: "green",
      icon: <CheckIcon size={20} />,
    });

    navigate("/verifyEmail", {
      state: {
        email,
        name,
        password,
      },
    });
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
          <form onSubmit={signUp}>
            <Stack>
              <Title order={2} ta="center">
                Create an Account
              </Title>

              <Text size="sm" c="dimmed" ta="center">
                Create your FitKraft account to get started.
              </Text>

              <TextInput
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
              />

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
                Sign Up
              </Button>

              <Divider label="OR" labelPosition="center" />

              <Button
                type="button"
                variant="default"
                fullWidth
                onClick={registerWithGoogle}
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