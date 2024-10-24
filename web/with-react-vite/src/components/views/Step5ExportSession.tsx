import React, { PropsWithChildren, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { capsuleClient } from "../../capsuleClient";
import { disableNextAtom, disablePrevAtom } from "../../state";
import StepLayout from "../layouts/stepLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type Step5ExportSessionProps = {};

const TITLE = "Export Session (Bonus)";
const SUBTITLE =
  "Export the session to a server. As this demo is client-side only, this feature is not implemented but the code snippet is provided for reference.";

const Step5ExportSession: React.FC<PropsWithChildren<Step5ExportSessionProps>> = () => {
  const [, setDisableNext] = useAtom(disableNextAtom);
  const [, setDisablePrev] = useAtom(disablePrevAtom);
  const [exportedSession, setExportedSession] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDisableNext(true);
    setDisablePrev(true);
  }, [setDisableNext, setDisablePrev]);

  const handleExportSession = async () => {
    setLoading(true);
    const session = capsuleClient.exportSession();
    setExportedSession(session);
    setLoading(false);
    setDisableNext(false);
  };

  const truncateSession = (session: string) => {
    if (!session) return "";
    if (session.length <= 48) return session;
    return `${session.slice(0, 24)}...${session.slice(-24)}`;
  };

  return (
    <StepLayout
      title={TITLE}
      subtitle={SUBTITLE}>
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Session Export</CardTitle>
            <CardDescription>Export your client-side session to a server.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exportedSession && (
              <Alert>
                <AlertTitle>Exported Session:</AlertTitle>
                <AlertDescription className="break-all font-mono">{truncateSession(exportedSession)}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleExportSession}
              disabled={loading || !!exportedSession}
              className="w-full">
              {loading ? "Exporting..." : "Export Session"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </StepLayout>
  );
};

export default Step5ExportSession;
