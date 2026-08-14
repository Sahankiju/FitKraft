import { useState, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { authClient } from "../../lib/auth-client";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const verifyOtp = async (e: SubmitEvent) => {
    e.preventDefault();

    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  };

  return (
    <form onSubmit={verifyOtp}>
      <h2>Verify Email</h2>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />

      <button type="submit">
        Verify
      </button>
    </form>
  );
}