import { CodeStepItem } from "../../types";

const exportSteps: CodeStepItem[] = [
  {
    title: "Export Session on Client",
    subtitle: "Export the current session from the client-side Capsule instance",
    code: `
  // Client-side code
  import { CapsuleClient } from "@usecapsule/web-sdk";
  
  // Your existing Capsule client instance
  const capsuleClient = new CapsuleClient({
    apiKey: CAPSULE_API_KEY,
    environment: Environment.BETA,
  });
  
  // Export the session after user authentication
  const exportedSession = await capsuleClient.exportSession();
  
  // Send this session to your server securely
  await fetch('your-server-endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session: exportedSession }),
  });`,
  },
  {
    title: "Import Session on Server",
    subtitle: "Import the exported session on your server to enable server-side signing",
    code: `
  // Server-side code
  import { CapsuleServer } from "@usecapsule/server-sdk";
  import { Environment } from "@usecapsule/sdk-core";
  
  // Initialize server-side Capsule client
  const capsuleServer = new CapsuleServer(Environment.BETA, CAPSULE_API_KEY);
  
  // Import the session received from client
  await capsuleServer.importSession(receivedSession);
  
  // The capsuleServer instance can now be used with any supported signer library
  // Example with Viem:
  import { createCapsuleAccount, createCapsuleViemClient } from "@usecapsule/viem-v2-integration";
  
  const viemCapsuleAccount = createCapsuleAccount(capsuleServer);
  const viemClient = createCapsuleViemClient(capsuleServer, {
    account: viemCapsuleAccount,
    // ... other config
  });
  
  // Example with Ethers:
  import { CapsuleEthersSigner } from "@usecapsule/ethers-v6-integration";
  
  const ethersSigner = new CapsuleEthersSigner(capsuleServer, provider);
  
  // Example with Alchemy AA:
  import { WalletClientSigner } from "@alchemy/aa-core";
  
  const walletClientSigner = new WalletClientSigner(viemClient, "capsule");
  const alchemyClient = await createModularAccountAlchemyClient({
    // ... config
    signer: walletClientSigner,
  });`,
  },
  {
    title: "Security Considerations",
    subtitle: "Important security notes for session management",
    code: `
  // SECURITY CONSIDERATIONS:
  
  // 1. Session Transport
  // Always use secure channels (HTTPS) when sending sessions to your server
  // Consider encrypting the session before transmission
  
  // 2. Session Storage
  // Store sessions securely on your server
  // Consider encryption at rest
  // Implement proper session rotation and expiration
  
  // 3. Access Control
  // Implement proper authentication for your server endpoints
  // Validate session ownership and permissions before use
  
  // 4. Environment Management
  // Ensure your server environment matches the client environment
  // Use appropriate environment variables for different deployments`,
  },
];

export default exportSteps;
