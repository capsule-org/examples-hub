import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { capsuleClient } from "../../client/capsule";
import { CountryCallingCode } from "libphonenumber-js";
import Separator from "../../components/Separator";
import OTPVerification from "../../components/OTPVerification";
import { webcrypto } from "crypto";
import ErrorMessage from "../../components/ErrorMessage";
import { NavigationProps } from "../../types";

/**
 * This example demonstrates how to authenticate a user with Capsule using their Phone number and passkey to protect their Wallet.
 *
 * Overview:
 * - Similar to email auth, but here we use `phoneNumber` and `countryCode`.
 * - After creating a user by phone, Capsule sends an OTP via SMS.
 * - Verifying the OTP returns a biometricsId, which you use to register a passkey.
 * - Once a passkey is registered, future logins can be done with the passkey directly, without needing another OTP.
 *
 * Key Points:
 * 1. **Create New User (Phone)**:
 *    - Use `capsuleClient.createUserByPhone(phoneNumber, countryCode)` to initiate a phone-based user creation.
 *    - The user receives an SMS with an OTP.
 *    - Verify the OTP with `verifyPhoneBiometricsId(otp)`.
 *    - Register a passkey to eliminate the need for repeated SMS OTPs in the future.
 *
 * 2. **Verify OTP**:
 *    - Call `capsuleClient.verifyPhoneBiometricsId(otp)` after the user enters the SMS code.
 *    - This returns a `biometricsId`.
 *    - Link the `biometricsId` to the user’s phone number by calling `registerPasskey(phoneNumber, biometricsId, webcrypto, "phone", countryCode)`.
 *
 * 3. **Passkey Login**:
 *    - `capsuleClient.login()` can be called with or without specifying `phoneNumber`.
 *    - If you specify `phoneNumber` and `countryCode`, Capsule filters available passkeys.
 *    - If user had already registered a passkey, they can log in seamlessly without another OTP.
 *
 * By using a passkey, you ensure that once the user is set up, they do not need to re-verify their phone number repeatedly. The secure passkey ensures only they can log in.
 */

const PhoneAuthScreen: React.FC<NavigationProps> = ({ goToScreen }) => {
  // Note: Country code needs to be have a "+" prefix, e.g., "+1" for the US.
  const [countryCode, setCountryCode] = useState("+1");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async () => {
    if (!phoneNumber || !countryCode) return;
    setLoading(true);
    setError(null);
    try {
      // Check if the user already exists before creating a new one with the same phone number.
      const exists = await capsuleClient.checkIfUserExistsByPhone(phoneNumber, countryCode as CountryCallingCode);
      if (exists) {
        // If user already exists, skip OTP. Just attempt a passkey login.
        await handlePasskeyLogin(phoneNumber, countryCode as CountryCallingCode);
        return;
      }
      // New user: send OTP via SMS. Sending the OTP is handled by Capsule automatically.
      await capsuleClient.createUserByPhone(phoneNumber, countryCode as CountryCallingCode);
      // Show OTP component for user to verify the code they received
      setShowOTP(true);
    } catch (e: any) {
      setError(e?.message || "An error occurred during user creation");
    }
    setLoading(false);
  };

  const onVerifyOTP = async (otp: string) => {
    if (!otp) return;
    setLoading(true);
    setError(null);
    try {
      // Verify the SMS OTP and get the biometricsId
      const biometricsId = await capsuleClient.verifyPhoneBiometricsId(otp);
      if (biometricsId) {
        // Register a passkey so no future OTPs are needed for login
        await capsuleClient.registerPasskey(
          phoneNumber,
          biometricsId,
          webcrypto,
          "phone",
          countryCode as CountryCallingCode
        );
        goToScreen("Home");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred during OTP verification");
    }
    setLoading(false);
  };

  const handlePasskeyLogin = async (phoneNumber?: string, countryCode?: CountryCallingCode) => {
    setLoading(true);
    setError(null);
    try {
      // Attempt passkey login. Providing `phoneNumber` and `countryCode` filters the passkeys.
      await capsuleClient.login(undefined, phoneNumber, countryCode as CountryCallingCode);
      goToScreen("Home");
    } catch (err: any) {
      setError(err?.message || "An error occurred during passkey login");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Authentication</Text>
      <ErrorMessage error={error} />
      {!showOTP && (
        <>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="+1"
              placeholderTextColor="#888"
              value={countryCode}
              onChangeText={setCountryCode}
              style={[styles.input, { flex: 0.3, marginRight: 10 }]}
              editable={!loading}
            />
            <TextInput
              placeholder="Enter Phone Number"
              placeholderTextColor="#888"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={[styles.input, { flex: 0.7 }]}
              keyboardType="phone-pad"
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
            onPress={() => handlePasskeyLogin(phoneNumber, countryCode as CountryCallingCode)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Authenticate with Passkey</Text>
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

export default PhoneAuthScreen;

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
  inputRow: {
    flexDirection: "row",
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
