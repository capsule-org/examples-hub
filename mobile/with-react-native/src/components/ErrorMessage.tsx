import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{error}</Text>
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ff4a4a",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
  },
});
