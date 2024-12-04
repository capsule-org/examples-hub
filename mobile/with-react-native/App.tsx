import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PolyfillCrypto from 'react-native-webview-crypto';
import Config from 'react-native-config';
import {
  CapsuleMobile,
  Environment,
  WalletType,
} from '@usecapsule/react-native-wallet';
import {webcrypto} from 'crypto';
import {logError} from './logger';

const capsuleClient = new CapsuleMobile(
  Environment.BETA,
  Config.CAPSULE_API_KEY,
  undefined,
  {
    disableWorkers: true,
  },
);

type LoadingState = {
  isLoading: boolean;
  message: string;
};

function App(): React.JSX.Element {
  const [authStage, setAuthStage] = useState('initial');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    message: '',
  });
  const [biometricsId, setBiometricsId] = useState<string | null>(null);

  useEffect(() => {
    const initCapsule = async () => {
      setLoading({isLoading: true, message: 'Initializing...'});
      try {
        await capsuleClient.init();
      } catch (error) {
        logError(error);
      } finally {
        setLoading({isLoading: false, message: ''});
      }
    };

    initCapsule();
  }, []);

  const handleCreateAccount = async () => {
    setLoading({isLoading: true, message: 'Creating account...'});

    try {
      setError('');
      const userExists = await capsuleClient.checkIfUserExists(email);

      if (userExists) {
        setError(
          'An account with this email already exists. Please sign in instead.',
        );
        return;
      }

      await capsuleClient.createUser(email);
      setAuthStage('verification');
    } catch (error) {
      logError(error);
    } finally {
      setLoading({isLoading: false, message: ''});
    }
  };

  const handleVerifyCode = async () => {
    setLoading({isLoading: true, message: 'Verifying code...'});

    try {
      setError('');
      const newBiometricsId = await capsuleClient.verifyEmailBiometricsId(
        verificationCode,
      );

      await capsuleClient.registerPasskey(
        email,
        newBiometricsId,
        crypto as webcrypto.Crypto,
      );

      setBiometricsId(newBiometricsId);
      setAuthStage('wallet_setup');
    } catch (error) {
      console.error('Error in handleVerifyCode:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown verification error';
      setError(`Verification failed: ${errorMessage}`);
    } finally {
      setLoading({isLoading: false, message: ''});
    }
  };

  const handleCreateWallet = async () => {
    setLoading({isLoading: true, message: 'Creating wallet...'});

    try {
      if (!capsuleClient) {
        throw new Error('Capsule client not initialized');
      }

      if (!biometricsId) {
        throw new Error('Authentication required before wallet creation');
      }

      const [wallet, recoverySecret] = await capsuleClient.createWallet(
        WalletType.EVM,
        false,
      );

      if (!wallet) {
        throw new Error('Wallet creation failed - no wallet returned');
      }

      if (recoverySecret) {
        console.log('Recovery secret generated successfully');
      }

      setAuthStage('authenticated');
    } catch (error) {
      console.error('Error in handleCreateWallet:', error);
      let errorMessage = 'Unknown wallet creation error';

      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }

      setError(
        `Wallet creation failed: ${errorMessage}. Please try again or contact support if the issue persists.`,
      );
    } finally {
      setLoading({isLoading: false, message: ''});
    }
  };

  const handleLoginWithPasskey = async () => {
    setLoading({isLoading: true, message: 'Signing in...'});

    try {
      setError('');
      if (email) {
        const userExists = await capsuleClient.checkIfUserExists(email);

        if (!userExists) {
          setError(
            'No account found with this email. Please create an account first.',
          );
          return;
        }
      }

      const wallets = await capsuleClient.login();
      setAuthStage('authenticated');
    } catch (error) {
      console.error('Error in handleLoginWithPasskey:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown login error';
      setError(`Login failed: ${errorMessage}`);
    } finally {
      setLoading({isLoading: false, message: ''});
    }
  };

  const handleGetWallets = () => {
    const wallets = capsuleClient.getWallets();
    Alert.alert('Wallets', JSON.stringify(wallets, null, 2));
  };

  const renderLoadingOverlay = () => {
    if (!loading.isLoading) return null;

    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{loading.message}</Text>
      </View>
    );
  };

  const renderContent = () => {
    switch (authStage) {
      case 'initial':
        return (
          <View>
            <View style={styles.signInSection}>
              <Text style={styles.sectionTitle}>Sign In</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={handleLoginWithPasskey}
                disabled={loading.isLoading}>
                <Text style={styles.buttonText}>Sign in with Passkey</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>or</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.createAccountSection}>
              <Text style={styles.sectionTitle}>Create Account</Text>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading.isLoading}
              />
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleCreateAccount}
                disabled={loading.isLoading || !email.trim()}>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'verification':
        return (
          <View>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              editable={!loading.isLoading}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerifyCode}
              disabled={loading.isLoading || !verificationCode.trim()}>
              <Text style={styles.buttonText}>Verify Code</Text>
            </TouchableOpacity>
          </View>
        );

      case 'wallet_setup':
        return (
          <View>
            <Text style={styles.welcomeText}>Account Verified!</Text>
            <Text style={styles.subtitle}>Set up your wallet to continue</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateWallet}
              disabled={loading.isLoading}>
              <Text style={styles.buttonText}>Create Wallet</Text>
            </TouchableOpacity>
          </View>
        );

      case 'authenticated':
        return (
          <View>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleGetWallets}
              disabled={loading.isLoading}>
              <Text style={styles.buttonText}>Get Wallets</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PolyfillCrypto />
      <View style={styles.content}>
        <Text style={styles.title}>Capsule RN Example</Text>
        {renderContent()}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {renderLoadingOverlay()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#333',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 16,
  },
  signInSection: {
    marginBottom: 8,
  },
  createAccountSection: {
    marginTop: 8,
  },
});

export default App;
