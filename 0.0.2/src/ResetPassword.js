import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from URL
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // AES encryption function
  const encryptData = (data) => {
    const key = CryptoJS.enc.Hex.parse("7c3932af93b283dae0c5173b9adffa299a87e33b92e13a9119e120d8249e199e"); // 32-byte key
    const iv = CryptoJS.lib.WordArray.random(12); // 12-byte random IV for AES-GCM
    const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.GCM, padding: CryptoJS.pad.NoPadding });
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const encryptedDataBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const tagBase64 = encrypted.tag.toString(CryptoJS.enc.Base64); // GCM tag
    return ivBase64 + encryptedDataBase64 + tagBase64;
  };

  // AES decryption function
  const decryptData = (data) => {
    const key = CryptoJS.enc.Hex.parse("7c3932af93b283dae0c5173b9adffa299a87e33b92e13a9119e120d8249e199e"); // 32-byte key
    const ivBase64 = data.substring(0, 16); // Extract IV from the encrypted data
    const encryptedDataBase64 = data.substring(16, data.length - 16); // Extract encrypted data
    const tagBase64 = data.substring(data.length - 16); // Extract tag

    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedDataBase64);
    const tag = CryptoJS.enc.Base64.parse(tagBase64);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData },
      key,
      { iv: iv, mode: CryptoJS.mode.GCM, padding: CryptoJS.pad.NoPadding, tag: tag }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

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

    // Encrypt the new password before sending it to the backend
    const encryptedPassword = encryptData(newPassword);

    // Construct API URL dynamically
    const apiUrl = `https://knowledgesunapi.quantumsoftdev.in/auth/reset-password/${token}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: encryptedPassword }), // Send encrypted password
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
