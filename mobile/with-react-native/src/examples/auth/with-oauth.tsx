import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Separator from "../../components/Separator";
import { capsuleClient } from "../../client/capsule";
import { OAuthMethod } from "@usecapsule/web-sdk";
import { webcrypto } from "crypto";
import ErrorMessage from "../../components/ErrorMessage";
import { NavigationProps } from "../../types";
import StyledModalWebView from "../../components/StyledModalWebView";

/**
 * This example shows how to authenticate a user with Capsule using OAuth providers (e.g., Google, Apple).
 *
 * Overview:
 * - Users select an OAuth provider.
 * - We get an OAuth URL from Capsule and open it in a WebView.
 * - Once the OAuth flow is completed and `waitForOAuth()` returns, we know if a user exists or is new.
 * - If new, we create a passkey right away so future logins won't require going through OAuth again.
 * - If existing, we simply login via passkey.
 *
 * Key Points:
 * 1. **Initiating OAuth**:
 *    - Call `getOAuthURL(provider)` to get the provider’s auth page URL.
 *    - Show the WebView for user to complete the OAuth sign-in.
 *
 * 2. **Waiting for OAuth Completion**:
 *    - Call `waitForOAuth()` to wait for Capsule’s backend to confirm OAuth success.
 *    - Once it returns `email` and `userExists`, you know whether to create a new user or just login.
 *
 * 3. **New User (OAuth)**:
 *    - If `userExists` is false, call `getSetUpBiometricsURL()` to get a biometricsId.
 *    - Then `registerPasskey(email, biometricsId, webcrypto, "email")`.
 *    - Now the user can log in with a passkey next time without OAuth.
 *
 * 4. **Existing User (OAuth)**:
 *    - If `userExists` is true, just call `login(email)` to sign them in with a passkey.
 *
 * After initial OAuth-based registration, you no longer need to show OAuth for that user.
 * They can log in with their passkey directly, skipping the OAuth flow in future sessions.
 */

const OAuthSelectionScreen: React.FC<NavigationProps> = ({ goToScreen }) => {
  const [oauthURL, setOAuthURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showWebview, setShowWebview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortedRef = useRef(false);

  const handleOAuthPress = async (provider: OAuthMethod) => {
    setLoading(true);
    setError(null);
    abortedRef.current = false;

    try {
      // Get the OAuth URL for the selected provider
      const url = await capsuleClient.getOAuthURL(provider);
      if (!url) {
        setLoading(false);
        setError("Failed to get OAuth URL");
        return;
      }
      //Since we're using a WebView component, we need to set the URL and set showWebview to true so the WebView will render
      setOAuthURL(url);
      setShowWebview(true);

      // Wait for OAuth to complete on the backend. waitForOAuth() begins polling the backend for the OAuth process to complete.
      const { isError, email, userExists } = await capsuleClient.waitForOAuth();

      if (abortedRef.current) {
        // The user cancelled the flow early
        setError("User cancelled the OAuth flow");
        return;
      }

      if (isError) {
        setError("OAuth process failed");
        return;
      }

      // If the user exists, we can log them in directly. If not, we need to set up a passkey. This is similar to the email example.
      if (email) {
        if (userExists) {
          // Existing user: just log in using passkey
          await capsuleClient.login(email);
        } else {
          // New user via OAuth: set up a passkey
          // Unlike email where we can call verifyEmailBiometricsId() to get the biometricsId after an OTP is verified there is no corresponding method for OAuth. So we'll do what verifyEmailBiometricsId() does internally.
          // We'll get the biometricsId from the URL returned by getSetUpBiometricsURL() and  then call registerPasskey() to create a passkey.
          const setupUrl = await capsuleClient.getSetUpBiometricsURL(false, "email");
          const segments = setupUrl.split("/");
          const lastSegment = segments[segments.length - 1];
          const parts = lastSegment ? lastSegment.split("?") : [];
          const biometricsId = parts.length > 0 ? parts[0] : "";

          if (biometricsId) {
            // Register a passkey, linking this user’s email to a secure passkey on their device.
            await capsuleClient.registerPasskey(email, biometricsId, webcrypto, "email");
          }
        }
        goToScreen("Home");
      }
    } catch (e: any) {
      if (!abortedRef.current) {
        setError(e?.message || "An error occurred during OAuth");
      }
    } finally {
      setLoading(false);
      // If we finished without abort, webview should close as well
      if (!abortedRef.current) {
        setShowWebview(false);
      }
    }
  };

  const handlePasskeyLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // If user already has passkeys, this shows them so they can select one.
      await capsuleClient.login();
      goToScreen("Home");
    } catch (error: any) {
      setError(error?.message || "An error occurred during passkey login");
    }
    setLoading(false);
  };

  const handleWebviewClose = () => {
    abortedRef.current = true;
    setShowWebview(false);
    if (loading) {
      // We were still waiting for OAuth, now user canceled early
      setError("User cancelled the OAuth flow");
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>OAuth Authentication</Text>
        <ErrorMessage error={error} />
        <TouchableOpacity
          style={[styles.oauthButton, { backgroundColor: "#FFFFFF" }]}
          onPress={() => handleOAuthPress(OAuthMethod.GOOGLE)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text style={[styles.oauthButtonText, { color: "#000000" }]}>Continue with Google</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.oauthButton, { backgroundColor: "#000000" }]}
          onPress={() => handleOAuthPress(OAuthMethod.APPLE)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.oauthButtonText, { color: "#FFFFFF" }]}>Continue with Apple</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.oauthButton, { backgroundColor: "#1DA1F2" }]}
          onPress={() => handleOAuthPress(OAuthMethod.TWITTER)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.oauthButtonText, { color: "#FFFFFF" }]}>Continue with Twitter</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.oauthButton, { backgroundColor: "#7289DA" }]}
          onPress={() => handleOAuthPress(OAuthMethod.DISCORD)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.oauthButtonText, { color: "#FFFFFF" }]}>Continue with Discord</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.oauthButton, { backgroundColor: "#4267B2" }]}
          onPress={() => handleOAuthPress(OAuthMethod.FACEBOOK)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.oauthButtonText, { color: "#FFFFFF" }]}>Continue with Facebook</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.oauthButton, { backgroundColor: "#8862CF" }]}
          onPress={() => handleOAuthPress(OAuthMethod.FARCASTER)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.oauthButtonText, { color: "#FFFFFF" }]}>Continue with Farcaster</Text>
          )}
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          style={styles.button}
          onPress={handlePasskeyLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Continue with Passkey</Text>
          )}
        </TouchableOpacity>
      </View>

      {oauthURL && (
        <StyledModalWebView
          uri={oauthURL}
          visible={showWebview}
          onClose={handleWebviewClose}
        />
      )}
    </>
  );
};

export default OAuthSelectionScreen;

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
  oauthButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  oauthButtonText: {
    fontSize: 18,
    fontWeight: "500",
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
