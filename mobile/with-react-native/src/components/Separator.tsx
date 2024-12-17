// Separator.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Separator: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.orText}>OR</Text>
      <View style={styles.line} />
    </View>
  );
};

export default Separator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#444444",
  },
  orText: {
    marginHorizontal: 10,
    color: "#FFFFFF",
  },
});
