import { useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../../lib/auth-client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const signIn = async (e: React.SubmitEvent) => {
    e.preventDefault();

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (ctx) => {
          alert(ctx.error);
          return;
        },
      }
    );
    navigate("/");
  };

  return (
    <div>
      <h2>Sign In</h2>

      <form onSubmit={signIn}>
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
          Sign In
        </button>
        <button onClick={loginWithGoogle}>Register With Google</button>
      </form>
    </div>
  );
}