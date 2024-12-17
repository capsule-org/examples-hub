import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Separator from "../../components/Separator";
import { capsuleClient } from "../../client/capsule";
import OTPVerification from "../../components/OTPVerification";
import { webcrypto } from "crypto";
import ErrorMessage from "../../components/ErrorMessage";
import { NavigationProps } from "../../types";

/**
 * This example demonstrates how to authenticate a user with Capsule using their Email address and passkey to protect their Wallet.
 *
 * Overview:
 * - Users can create a new user account with just their email. Capsule will send them an OTP.
 * - After the OTP is verified, we register a passkey for the user. This ensures future logins are seamless and secure.
 * - If the user already exists, we can skip OTP and directly attempt a passkey login.
 *
 * Key Points:
 * 1. **Create New User (Email)**:
 *    - Call `capsuleClient.createUser(email)` to initiate a new user flow.
 *    - Capsule sends an OTP to the provided email.
 *    - Once OTP is verified, call `registerPasskey(...)` to create a passkey for the user.
 *    - After this initial setup, the user can authenticate solely with a passkey, avoiding repeated OTP steps.
 *
 * 2. **Verify OTP**:
 *    - When the user enters the OTP, call `capsuleClient.verifyEmailBiometricsId(otp)`.
 *    - This returns a `biometricsId` needed to associate a passkey with the user.
 *    - Then call `registerPasskey(email, biometricsId, webcrypto, "email")` to finalize passkey creation.
 *
 * 3. **Passkey Login**:
 *    - Use `capsuleClient.login(email)` to prompt a native passkey selection.
 *    - If you omit `email`, the user sees all available passkeys for your app. Providing `email` filters to relevant passkeys.
 *    - Once passkey login succeeds, no OTP or email verification is needed again.
 *
 * Why Passkeys?
 * - After the user’s first successful verification (via OTP or OAuth), a passkey is registered.
 * - Future logins are passwordless, secure, and user-friendly. No need to re-verify via email every time.
 *
 * In this component:
 * - `handleCreateUser()` checks if the user exists. If not, it creates them and triggers OTP flow.
 * - `onVerifyOTP()` handles OTP submission and passkey registration.
 * - `handlePasskeyLogin()` allows existing users to log in directly via passkey.
 */

const EmailAuthScreen: React.FC<NavigationProps> = ({ goToScreen }) => {
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      // Check if the user already exists before creating a new one with the same email.
      const exists = await capsuleClient.checkIfUserExists(email);
      if (exists) {
        // If user already exists, skip OTP. Just prompt passkey login.
        await handlePasskeyLogin(email);
        return;
      }
      // New user: send OTP to their email
      await capsuleClient.createUser(email);
      // After this, show the OTP component so the user can verify their email
      setShowOTP(true);
    } catch (e: any) {
      setError(e?.message || "An error occurred");
    }
    setLoading(false);
  };

  const onVerifyOTP = async (otp: string) => {
    if (!otp) return;
    setLoading(true);
    setError(null);
    try {
      // Verify the OTP and get the biometricsId
      const biometricsId = await capsuleClient.verifyEmailBiometricsId(otp);
      if (biometricsId) {
        // Register a passkey, linking this user’s email to a secure passkey on their device.
        await capsuleClient.registerPasskey(email, biometricsId, webcrypto, "email");
        // Now the user can log in with a passkey in the future without needing another OTP.
        goToScreen("Home");
      }
    } catch (e: any) {
      setError(e?.message || "An error occurred during OTP verification");
    }
    setLoading(false);
  };

  const handlePasskeyLogin = async (email?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Attempt a passkey login. If `e` is provided, Capsule filters the passkeys shown.
      await capsuleClient.login(email);
      goToScreen("Home");
    } catch (err: any) {
      setError(err?.message || "An error occurred during login");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Authentication</Text>
      <ErrorMessage error={error} />
      {!showOTP && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              editable={!loading}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateUser}
            disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Create New User</Text>}
          </TouchableOpacity>
          <Separator />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePasskeyLogin(email)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continue with Passkey</Text>
            )}
          </TouchableOpacity>
        </>
      )}
      {showOTP && (
        <OTPVerification
          onVerify={onVerifyOTP}
          loading={loading}
        />
      )}
    </View>
  );
};

export default EmailAuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    padding: 14,
    borderRadius: 8,
  },
  button: {
    width: "100%",
    backgroundColor: "#ff754a",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
});
