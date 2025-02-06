import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from URL
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Construct API URL dynamically
    const apiUrl = "http://edu-auth.vercel.app/auth/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2E0MTNiOTM0OWEzZTAwMDM5MmQzOWIiLCJlbWFpbCI6ImR1YmV5c2hpdmFtMTIzMzIxQGdtYWlsLmNvbSIsImlhdCI6MTczODgwNjIyNCwiZXhwIjoxNzM4ODA5ODI0fQ.jbiZ0p8jg3gbGwIj3qKxKJzUwV5q8UU2PMIMNldzhxM";//`https://edu-auth.vercel.app/auth/reset-password/${token}`;

    try {
      const response = await fetch("https://edu-auth.vercel.app/auth/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2EzZWU5ZTNlODZmODVmYjBjZmUyZWQiLCJlbWFpbCI6ImR1YmV5c2hpdmFtcmFqQGdtYWlsLmNvbSIsImlhdCI6MTczODgxNTAyOCwiZXhwIjoxNzM4ODE4NjI4fQ.i1tC7-omAj34jj3JMlbdp6O-AUDg97hG272QEoBfrzQ", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }), // No need to send token again
      });

      const data = await response.json();
      setMessage(data.message || "Password reset successful!");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-2 border rounded-md"
            value={newPassword}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Re-enter new password"
            className="w-full px-4 py-2 border rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
