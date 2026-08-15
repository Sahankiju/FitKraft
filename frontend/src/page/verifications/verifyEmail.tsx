import { useState, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { authClient } from "../../lib/auth-client";
import { XIcon, CheckIcon } from "@phosphor-icons/react";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Container,
  Paper,
  PinInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { email, name, password } = location.state || {};

  const verifyOtp = async (e: SubmitEvent) => {
    e.preventDefault();

    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (error) {
      notifications.show({
        title: "Verification Failed",
        message: error.message,
        color: "red",
        icon: <XIcon size={20} />,
      });

      return;
    }

    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (signUpError) {
      notifications.show({
        title: "Sign Up Failed",
        message: signUpError.message,
        color: "red",
        icon: <XIcon size={20} />,
      });

      return;
    }

    notifications.show({
      title: "Success",
      message: "Account created successfully.",
      color: "green",
      icon: <CheckIcon size={20} />,
    });

    navigate("/");
  };

  return (
    <Container size={420} my={80}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={verifyOtp}>
          <Stack align="center">
            <Title order={2}>Verify Email</Title>

            <Text size="sm" c="dimmed" ta="center">
              Enter the verification code sent to your email.
            </Text>

            <PinInput
              length={6}
              type="number"
              value={otp}
              onChange={setOtp}
              size="md"
            />

            <Button type="submit" fullWidth>
              Verify
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}