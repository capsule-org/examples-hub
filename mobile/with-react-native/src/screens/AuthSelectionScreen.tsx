import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type ScreenName = "AuthSelection" | "EmailAuth" | "PhoneAuth" | "OAuthSelection" | "Home";

interface Props {
  goToScreen: (screen: ScreenName) => void;
  goBack: () => void;
}

const AuthSelectionScreen: React.FC<Props> = ({ goToScreen }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Authentication Method</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => goToScreen("EmailAuth")}>
        <Text style={styles.buttonText}>Email Auth</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => goToScreen("PhoneAuth")}>
        <Text style={styles.buttonText}>Phone Auth</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => goToScreen("OAuthSelection")}>
        <Text style={styles.buttonText}>OAuth</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    width: "100%",
    backgroundColor: "#ff754a",
    paddingVertical: 14,
    paddingHorizontal: 20,
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
