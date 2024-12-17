import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import AuthSelectionScreen from "./screens/AuthSelectionScreen";
import EmailAuthScreen from "./examples/auth/with-email";
import PhoneAuthScreen from "./examples/auth/with-phone";
import OAuthSelectionScreen from "./examples/auth/with-oauth";
import HomeScreen from "./screens/HomeScreen";
import { capsuleClient } from "./client/capsule";
import { ScreenName, ScreenParams, StackEntry } from "./types";

export default function App() {
  const [screenStack, setScreenStack] = useState<StackEntry[]>([{ screen: "AuthSelection" }]);

  const current = screenStack[screenStack.length - 1];

  useEffect(() => {
    const initCapsule = async () => {
      try {
        await capsuleClient.init();
      } catch (error: any) {
        console.error("Initialization error:", error?.message || "Unknown error");
      }
    };
    initCapsule();
  }, []);

  const goToScreen = (screen: ScreenName, params?: ScreenParams) => {
    setScreenStack((prev) => [...prev, { screen, params }]);
  };

  const goBack = () => {
    setScreenStack((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const currentScreen = current.screen;

  return (
    <SafeAreaView style={styles.rootContainer}>
      {currentScreen === "AuthSelection" && (
        <AuthSelectionScreen
          goToScreen={goToScreen}
          goBack={goBack}
        />
      )}
      {currentScreen === "EmailAuth" && (
        <EmailAuthScreen
          goToScreen={goToScreen}
          goBack={goBack}
        />
      )}
      {currentScreen === "PhoneAuth" && (
        <PhoneAuthScreen
          goToScreen={goToScreen}
          goBack={goBack}
        />
      )}
      {currentScreen === "OAuthSelection" && (
        <OAuthSelectionScreen
          goToScreen={goToScreen}
          goBack={goBack}
        />
      )}
      {currentScreen === "Home" && (
        <HomeScreen
          goToScreen={goToScreen}
          goBack={goBack}
        />
      )}
      {currentScreen !== "AuthSelection" && currentScreen !== "Home" && (
        <View style={styles.backContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}>
            <Text style={styles.backButtonText}>{"< Back"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#121212",
  },
  backContainer: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
