# Capsule SDK – React Native Example

This repository provides a practical example of integrating the [Capsule SDK](https://docs.usecapsule.com/) into a React
Native application. The included examples demonstrate authentication and passkey creation workflows using Capsule's
unique security model. Whether you're authenticating users via Email, Phone, or OAuth, these examples show you how to
create new users, verify them with OTP or OAuth flows, and then register a secure passkey for seamless future logins.

## Overview

**Key Highlights:**

- **Email Auth (Passwordless):** Create new users by email, verify via OTP, and register a passkey so the user never has
  to enter another OTP again.
- **Phone Auth (Passwordless):** Similar to email, but with SMS OTP verification for phone numbers.
- **OAuth Auth:** Integrate OAuth providers like Google, Apple, Twitter, and more. After successful OAuth, create a
  passkey so the user can log in with no additional steps in the future.

**Passkeys**: Once a user is authenticated (via OTP or OAuth), you set up a passkey. Future logins rely solely on that
passkey, removing the need for repeated OTPs or OAuth steps. This greatly improves the user experience and security.

## Project Structure

- **`src/App.tsx`**: Entry point that manages navigation between screens.
- **`src/screens/AuthSelectionScreen.tsx`**: Initial screen allowing you to choose Email, Phone, or OAuth authentication
  flows.
- **`src/screens/HomeScreen.tsx`**: Screen shown after successful authentication. Demonstrates how to fetch and display
  wallets.
- **`src/examples/auth/with-email.tsx`**: Comprehensive example of creating a user with email OTP and setting up a
  passkey.
- **`src/examples/auth/with-phone.tsx`**: Comprehensive example of creating a user with phone (SMS OTP) and setting up a
  passkey.
- **`src/examples/auth/with-oauth.tsx`**: Example of integrating OAuth providers. After success, create a passkey so
  user can sign in again without repeating OAuth.

**Additional Components:**

- **`src/components/OTPVerification.tsx`**: Renders an OTP input field and verification button.
- **`src/components/ErrorMessage.tsx`**: Displays errors caught during operations.
- **`src/components/Separator.tsx`**: A visual separator with "OR" text.

**Client Setup:**

- **`src/client/capsule.ts`**: Initializes the Capsule client. Make sure you set your `CAPSULE_API_KEY` in `.env` or
  `.env.example` before running.

## Running the Application

1. **Clone the Repository:**

   ```sh
   cd with-react-native
   ```

2. **Install Dependencies:**

   ```sh
   yarn install
   ```

3. **Set Environment Variables:** Copy `.env.example` to `.env` and set `CAPSULE_API_KEY`:

   ```sh
   cp .env.example .env
   # Open .env and add your CAPSULE_API_KEY
   ```

4. **Install iOS Pods (if running on iOS):**

   ```sh
   cd ios
   pod install
   cd ..
   ```

5. **Run the App:**

   - **Android:**

     ```sh
     yarn start
     yarn android
     ```

   - **iOS:**
     ```sh
     yarn start
     yarn ios
     ```

   The Metro bundler will start, and your app will launch in the emulator or connected device.

## Exploring the Examples

**Email Auth Flow** (`src/examples/auth/with-email.tsx`):

- Shows how to create a user using their email and verify with an OTP.
- Once verified, registers a passkey so subsequent logins are just a passkey tap away.

**Phone Auth Flow** (`src/examples/auth/with-phone.tsx`):

- Similar to email, but with phone number and SMS OTP.
- After verification, a passkey is registered. No need to re-verify phone again in future sessions.

**OAuth Auth Flow** (`src/examples/auth/with-oauth.tsx`):

- Initiates OAuth flow via a WebView.
- After OAuth completion, creates a passkey for passwordless future logins.
- Supports multiple providers like Google, Apple, Twitter, Discord, etc.

## Additional Information

- **Documentation:** For more details, refer to the [Capsule Docs](https://docs.usecapsule.com/) for implementation
  details, best practices, and advanced usage.
- **Troubleshooting:** Check error messages displayed by the `ErrorMessage` component and verify:

  - You have a valid `CAPSULE_API_KEY`.
  - The user flow (email/phone/OAuth) steps are followed correctly.
