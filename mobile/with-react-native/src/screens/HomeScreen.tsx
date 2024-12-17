import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NavigationProps } from "../types";

const HomeScreen: React.FC<NavigationProps> = () => {
  const [wallets, setWallets] = useState<any>(null);

  useEffect(() => {
    const fakeWallets = { wallets: [{ id: "wallet_123", balance: "100", currency: "USD" }] };
    setWallets(fakeWallets);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Authenticated Successfully</Text>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.jsonText}>{JSON.stringify(wallets, null, 2)}</Text>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 24,
    paddingTop: 80,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  scrollContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 14,
  },
  jsonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Courier",
  },
});
