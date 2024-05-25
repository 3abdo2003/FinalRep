// ForgotPassword.tsx
import React, { useState } from "react";
import { sendForgotPassword } from "@/services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await sendForgotPassword(email);
      if (response.message === "user not found") {
        alert("email not sent");
      } else {
        alert("Email sent successfully");
      }
    } catch (error) {
      alert("Error occurred while sending email");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ margin: "10px 0", padding: "10px", width: "200px" }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Forgot Password
      </button>
    </form>
  );
};

export default ForgotPassword;
