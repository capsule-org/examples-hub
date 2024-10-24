import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { disableNextAtom, disablePrevAtom } from "../../state";
import { capsuleClient } from "../../capsuleClient";
import StepLayout from "../layouts/stepLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { RefreshCw, LogOut } from "react-feather";

type Step6LogoutProps = {};

const TITLE = "Session Management";
const SUBTITLE = "Logout from the session or refresh the session to keep it active.";

const withMinimumLoadingTime = async (
  fn: () => Promise<void>,
  minTime: number,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  const start = Date.now();
  await fn();
  const elapsed = Date.now() - start;
  if (elapsed < minTime) {
    await new Promise((resolve) => setTimeout(resolve, minTime - elapsed));
  }
  setLoading(false);
};

const Step6Logout: React.FC<Step6LogoutProps> = () => {
  const [, setDisableNext] = useAtom(disableNextAtom);
  const [, setDisablePrev] = useAtom(disablePrevAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    checkLoginStatus();
    setDisablePrev(true);
  }, [setDisableNext, setDisablePrev]);

  const checkLoginStatus = () => {
    withMinimumLoadingTime(
      async () => {
        const loggedIn = await capsuleClient.isFullyLoggedIn();
        setIsLoggedIn(loggedIn);
        setDisableNext(loggedIn);
      },
      250,
      setLoading
    );
  };

  const handleLogout = async () => {
    setLoading(true);
    await capsuleClient.logout();
    await checkLoginStatus();
    setStatus("Successfully logged out");
    setLoading(false);
    
  };

  const handleRefreshSession = async () => {
    setLoading(true);
    try {
      await capsuleClient.refreshSession(true);
      setStatus("Session successfully refreshed");
    } catch (error) {
      setStatus("Failed to refresh session");
    }
    await checkLoginStatus();
    setLoading(false);
  };

  return (
    <StepLayout
      title={TITLE}
      subtitle={SUBTITLE}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={handleRefreshSession}
              disabled={loading || !isLoggedIn}
              className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Session
            </Button>

            <Button
              onClick={handleLogout}
              disabled={loading || !isLoggedIn}
              variant="destructive"
              className="flex-1">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {status && (
            <Alert>
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}

          <Alert variant={isLoggedIn ? "default" : "destructive"}>
            <AlertDescription>Status: {isLoggedIn ? "Logged In" : "Logged Out"}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </StepLayout>
  );
};

export default Step6Logout;
