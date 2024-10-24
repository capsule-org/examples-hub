import { CodeStepItem } from "../../types";

const sessionManagementSteps: CodeStepItem[] = [
  {
    title: "Check Session Status",
    subtitle: "Verify if the user is currently logged in",
    code: `
import { CapsuleClient } from "@usecapsule/web-sdk";

// Your existing Capsule client instance
const capsuleClient = new CapsuleClient({
  apiKey: CAPSULE_API_KEY,
  environment: Environment.BETA,
});

// Check if user is logged in
const isLoggedIn = await capsuleClient.isFullyLoggedIn();

// You can also check specific session details
const session = await capsuleClient.getSession();
console.log("Session expires at:", session?.expiresAt);`,
  },
  {
    title: "Refresh Session",
    subtitle: "Extend the current session before it expires",
    code: `
// Refresh session with automatic popup
const refreshWithPopup = async () => {
  try {
    // This will automatically open a popup for session refresh
    await capsuleClient.refreshSession(true);
    console.log("Session refreshed successfully");
  } catch (error) {
    console.error("Failed to refresh session:", error);
  }
};

// Refresh session manually (control popup display yourself)
const refreshManually = async () => {
  // Get the refresh URL but don't open popup
  const refreshUrl = await capsuleClient.refreshSession(false);
  
  // You can now handle the popup/redirect yourself
  // For example:
  window.open(refreshUrl, "Refresh Session", "width=500,height=600");
};`,
  },
  {
    title: "Logout",
    subtitle: "End the current session",
    code: `
// Simple logout
const logout = async () => {
  await capsuleClient.logout();
  // User is now logged out
};

// Logout with wallet preservation
const logoutPreserveWallets = async () => {
  // Set preservePregenWallets to true to keep generated wallets in memory
  await capsuleClient.logout(true);
  
  // Wallets are preserved and can be reused after next login
  // This is useful if you want to maintain wallet addresses across sessions
};

// Complete cleanup
const cleanupAndLogout = async () => {
  // Remove all session data
  await capsuleClient.logout(false);
  
  // Clear any local state
  setIsLoggedIn(false);
  setUserData(null);
  
  // Redirect to login page if needed
  router.push('/login');
};`,
  },
  {
    title: "Session Management Best Practices",
    subtitle: "Recommendations for handling sessions effectively",
    code: `
// 1. Regular Session Checks
const setupSessionChecks = () => {
  // Check session status periodically
  setInterval(async () => {
    const isLoggedIn = await capsuleClient.isFullyLoggedIn();
    if (!isLoggedIn) {
      // Handle session expiration
      handleSessionExpired();
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
};

// 2. Pre-emptive Session Refresh
const setupPreemptiveRefresh = async () => {
  const session = await capsuleClient.getSession();
  if (session) {
    const expiresAt = new Date(session.expiresAt);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    
    // Refresh 5 minutes before expiry
    if (timeUntilExpiry < 5 * 60 * 1000) {
      await capsuleClient.refreshSession(true);
    }
  }
};

// 3. Handle Failed Refreshes
const handleRefreshWithRetry = async (maxRetries = 3) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      await capsuleClient.refreshSession(true);
      return true;
    } catch (error) {
      attempts++;
      if (attempts === maxRetries) {
        // Final attempt failed
        await capsuleClient.logout();
        return false;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};`,
  },
];

export default sessionManagementSteps;
