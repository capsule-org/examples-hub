// src/components/StyledModalWebView.tsx

import React, { useRef, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import WebView from "react-native-webview";

interface StyledModalWebViewProps {
  uri: string;
  visible: boolean;
  onClose: () => void;
}

const StyledModalWebView: React.FC<StyledModalWebViewProps> = ({ uri, visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const screenHeight = Dimensions.get("window").height;
  const containerHeight = screenHeight * 0.75;

  const iosUserAgent =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1";
  const androidUserAgent =
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.40 Mobile Safari/537.36";

  const userAgent = Platform.OS === "ios" ? iosUserAgent : androidUserAgent;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade">
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.topOverlaySpace} />
        </TouchableWithoutFeedback>
        <View style={[styles.webviewContainer, { height: containerHeight }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.webviewWrapper}>
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator
                  color="#ffffff"
                  size="large"
                />
              </View>
            )}
            <WebView
              ref={webViewRef}
              source={{ uri }}
              style={styles.webview}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              containerStyle={styles.webviewContainerStyle}
              userAgent={userAgent}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StyledModalWebView;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  topOverlaySpace: {
    flex: 1,
  },
  webviewContainer: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "#333333",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  webviewWrapper: {
    flex: 1,
    marginTop: 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 15,
  },
  webview: {
    flex: 1,
  },
  webviewContainerStyle: {
    backgroundColor: "#1E1E1E",
  },
});
