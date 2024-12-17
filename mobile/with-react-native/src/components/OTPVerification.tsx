import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

interface OTPVerificationProps {
  onVerify: (otp: string) => Promise<void>;
  loading: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onVerify, loading }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = async () => {
    if (!otp) return;
    await onVerify(otp);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <TextInput
        placeholder="Enter OTP"
        placeholderTextColor="#888"
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 5,
  },
  button: {
    width: "100%",
    backgroundColor: "#ff754a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
});
