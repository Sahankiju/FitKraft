import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../../lib/auth-client";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const registerWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const signUp = async (e: SubmitEvent) => {
    e.preventDefault();

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    console.log("OTP result:", error);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/verifyEmail", {
      state: {
        email,
      },
    });
  };

  return (
    <div>
      <h2>Sign Up</h2>

      <form onSubmit={signUp}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit">
          Sign Up
        </button>

        <button onClick={registerWithGoogle}>Register With Google</button>
      </form>
    </div>
  );
}