## Capsule SDK Demo with React CRACO PWA

This repository demonstrates how to integrate the Capsule SDK with a React PWA (Progressive Web Application) using CRACO
as the build tool. The demo is an interactive walkthrough that guides you through authentication, signing, and session
management using Capsule SDKs, providing corresponding code snippets at every step.

### Project Structure

The project is structured to emphasize the core Capsule-specific features found in the `src/capsule-essentials` folder.
This folder contains the key authentication and signing methods that developers can reference and adapt as needed. The
`demo-ui` folder, on the other hand, is dedicated to the tutorial walkthrough that showcases how to use all the
Capsule-essentials methods in a complete UI example. We've intentionally abstracted most of the UI code away from
`capsule-essentials` to maintain a focus on Capsule's authentication and signing capabilities without prescribing a
specific UI.

> Note that some utility functions used in `capsule-essentials` are specific to this demo application and are not
> intended for production use. Developers should only reference the methods and adapt them for their projects.

The PWA version of this app is essentially the same as the React CRACO app, with added configuration to support PWA
installation. A minimal manifest file (`manifest.json`) is included in the `public` folder, allowing the app to be
installed as a PWA. Note that the app does not use service workers for offline functionality. If an app is aiming for an
offline experience, developers should consider using pre-generated wallets with local storage, along with a server
backup to ensure a copy of the wallet share is available offline. More details on pre-generated wallets can be found in
the [Capsule documentation](https://docs.usecapsule.com/integration-guides/wallet-pregeneration).

### Running the Demo

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure the required variables in `.env`
3. Run the development server:
   ```bash
   yarn start
   ```

### Environment Variables

- `REACT_APP_CAPSULE_API_KEY`: Your Capsule API key (required)
- `REACT_APP_ALCHEMY_API_KEY`: Your Alchemy API key (optional)
- `REACT_APP_ALCHEMY_GAS_POLICY_ID`: Your Alchemy Gas Policy ID (optional)

> Note: The Alchemy-related variables (`REACT_APP_ALCHEMY_API_KEY` and `REACT_APP_ALCHEMY_GAS_POLICY_ID`) are only
> required if you select Alchemy as the signer when configuring your project. If you're not using Alchemy, you can leave
> these fields blank or omit them entirely.

### Key Areas to Focus On

Developers should primarily focus on the `src/capsule-essentials` folder. This folder contains the core reference code
for different authentication and signing methods, which can be adapted based on your specific needs. The main examples
are divided as follows:

#### Authentication Methods (`src/capsule-essential/authentication`)

- [AuthWithCapsuleModal.tsx](src/capsule-essential/authentication/with-capsule-modal.tsx)
- [AuthWithCosmosKit.tsx](src/capsule-essential/authentication/with-cosmos-kit.tsx)
- [AuthWithEmail.tsx](src/capsule-essential/authentication/with-email.tsx)
- [AuthWithGraz.tsx](src/capsule-essential/authentication/with-graz.tsx)
- [AuthWithLeapSocial.tsx](src/capsule-essential/authentication/with-leap-social.tsx)
- [AuthWithOAuth.tsx](src/capsule-essential/authentication/with-oauth.tsx)
- [AuthWithPhone.tsx](src/capsule-essential/authentication/with-phone.tsx)
- [AuthWithPreGen.tsx](src/capsule-essential/authentication/with-pregen.tsx)
- [AuthWithRainbowkit.tsx](src/capsule-essential/authentication/with-rainbowkit.tsx)
- [AuthWithWagmi.tsx](src/capsule-essential/authentication/with-wagmi.tsx)
- [AuthWithWeb3Onboard.tsx](src/capsule-essential/authentication/with-web3-onboard.tsx)

#### Signing Methods (`src/capsule-essential/signers`)

- [SignWithCapsule.tsx](src/capsule-essential/signers/with-capsule-client.tsx)
- [SignWithCosmJS.tsx](src/capsule-essential/signers/with-cosmjs.tsx)
- [SignWithEthers.tsx](src/capsule-essential/signers/with-ethers.tsx)
- [SignWithSolanaWeb3.tsx](src/capsule-essential/signers/with-solana-web3.tsx)
- [SignWithViem.tsx](src/capsule-essential/signers/with-viem.tsx)

These files provide a variety of ways to authenticate users and sign transactions, each tailored to different tools and
platforms. Explore them to understand how Capsule SDK integrates with various Web3 services.

### Demo UI Walkthrough

By running the demo application, you can interactively select which authentication and signing methods to use. The
walkthrough provides step-by-step guidance on using Capsule at each stage, along with corresponding code snippets. Note
that these snippets are meant to be referenced and adapted to fit into your project's structure. They often include
state management specific to this demo application's components and UI, and therefore may not be directly copy-paste
ready.

### PWA Configuration

To enable PWA support, we've included a minimal `manifest.json` file in the `public` folder. This manifest allows the
application to be installed as a PWA, but note that no service workers are implemented for offline functionality. The
`craco.config.js` has been updated to generate the manifest file and ensure proper PWA behavior.

Currently, passkey-based authentication opens the user's browser even if the PWA is installed. If you are interested in
a fully embedded PWA experience, please contact a Capsule team member about our upcoming password-based support, which
will allow for a more seamless experience.

### Troubleshooting

If you encounter issues while running the code, note that React with CRACO may require additional configuration to
properly handle polyfills for Node.js-specific modules. Ensure that your CRACO configuration (`craco.config.js`)
includes appropriate polyfills for compatibility with the web.
