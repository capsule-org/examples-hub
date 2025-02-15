import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { webcrypto } from "crypto";
import { useRouter } from "expo-router";
import { CountryCallingCode } from "libphonenumber-js";
import OTPVerificationComponent from "@/components/OTPVerificationComponent";
import { capsuleClient } from "@/client/capsule";
import { randomTestPhone } from "@/util/random";

export default function PhoneAuthScreen() {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState(randomTestPhone());
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleContinue = async () => {
    if (!countryCode || !phoneNumber) return;
    setIsLoading(true);
    try {
      const userExists = await capsuleClient.checkIfUserExistsByPhone(phoneNumber, countryCode as CountryCallingCode);
      if (userExists) {
        await capsuleClient.login(undefined, phoneNumber, countryCode as CountryCallingCode);
        router.navigate("../home");
      } else {
        await capsuleClient.createUserByPhone(phoneNumber, countryCode as CountryCallingCode);
        setShowOTP(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const handleVerify = async (code: string) => {
    if (!code) return;
    try {
      const biometricsId = await capsuleClient.verifyPhoneBiometricsId(code);
      if (biometricsId) {
        await capsuleClient.registerPasskey(
          phoneNumber,
          biometricsId,
          webcrypto,
          "phone",
          countryCode as CountryCallingCode
        );
        router.navigate("../home");
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const resendOTP = async () => {
    await capsuleClient.resendVerificationCode();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text
            h2
            h2Style={styles.title}>
            {showOTP ? "Enter Verification Code" : "Phone Authentication Demo"}
          </Text>
          <Text style={styles.subtitle}>
            {showOTP
              ? "Enter the code sent to your phone. When using a +1-XXX-555-XXXX test number, a random 6-digit code is auto-filled for rapid testing. For personal numbers, check your phone for the actual code."
              : "Test the Capsule Auth SDK. A random test number (+1-XXX-555-XXXX) is pre-filled for quick testing with auto-generated codes. Use your phone number instead to test actual SMS delivery. Test users can be managed in your portal's API key section."}
          </Text>
        </View>

        {!showOTP ? (
          <>
            <View style={styles.phoneInputContainer}>
              <Input
                label="Code"
                placeholder="+1"
                value={countryCode}
                onChangeText={setCountryCode}
                keyboardType="phone-pad"
                containerStyle={styles.countryCodeInput}
                inputContainerStyle={styles.input}
              />
              <Input
                label="Number"
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                containerStyle={styles.phoneNumberInput}
                inputContainerStyle={styles.input}
              />
            </View>
            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!countryCode || !phoneNumber || isLoading}
              loading={isLoading}
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
            />
          </>
        ) : (
          <OTPVerificationComponent
            onVerify={handleVerify}
            resendOTP={resendOTP}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    color: "#333333",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "left",
    fontSize: 16,
    color: "#666666",
    lineHeight: 22,
  },
  phoneInputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  countryCodeInput: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 0,
  },
  phoneNumberInput: {
    flex: 3,
    paddingHorizontal: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: "#fc6c58",
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonContainer: {
    width: "100%",
  },
});
