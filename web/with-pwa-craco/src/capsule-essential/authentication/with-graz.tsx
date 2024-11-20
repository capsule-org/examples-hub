import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { CustomCapsuleModalView } from "@leapwallet/cosmos-social-login-capsule-provider-ui";
import "@leapwallet/cosmos-social-login-capsule-provider-ui/styles.css";
import { OAuthMethod } from "@usecapsule/web-sdk";
import { capsuleClient } from "../capsule-client";
import { disableNextAtom, disablePrevAtom, isLoadingAtom, isLoggedInAtom } from "../../demo-ui/state";
import { useCapsule } from "graz";
import { ModalTriggerCard } from "../../demo-ui/components/modal-trigger-card";
import { withMinimumLoadingTime } from "../../demo-ui/lib/utils";

type AuthWithGrazProps = {};

const AuthWithGraz: React.FC<AuthWithGrazProps> = () => {
  const { client, modalState, setModalState, onAfterLoginSuccessful, onLoginFailure } = useCapsule();
  const [step, setStep] = useState<0 | 1>(0);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [, setDisableNext] = useAtom(disableNextAtom);
  const [, setDisablePrev] = useAtom(disablePrevAtom);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    withMinimumLoadingTime(
      async () => {
        const loggedIn = await capsuleClient.isFullyLoggedIn();
        setIsLoggedIn(loggedIn);
        setDisableNext(!loggedIn);
        if (loggedIn) {
          setStep(1);
        }
      },
      250,
      setIsLoading
    );
  };

  useEffect(() => {
    if (isLoggedIn && step === 1) {
      setDisableNext(false);
      setDisablePrev(true);
    }
  }, [isLoggedIn, step]);

  const handleLoginSuccess = async () => {
    setModalState(false);
    await checkLoginStatus();
    onAfterLoginSuccessful?.();
  };

  const handleLoginFailure = () => {
    setModalState(false);
    onLoginFailure?.();
  };

  return (
    <ModalTriggerCard
      step={step}
      titles={{
        initial: "Graz + Leap Custom Capsule Modal",
        success: "Success!",
      }}
      buttonLabel="Open Modal"
      isLoading={isLoading}
      onModalOpen={() => setModalState(true)}>
      <div className="leap-ui">
        <CustomCapsuleModalView
          capsule={capsuleClient as any}
          showCapsuleModal={modalState}
          setShowCapsuleModal={setModalState}
          theme="light"
          onAfterLoginSuccessful={handleLoginSuccess}
          onLoginFailure={handleLoginFailure}
          oAuthMethods={[
            OAuthMethod.GOOGLE,
            OAuthMethod.TWITTER,
            OAuthMethod.FACEBOOK,
            OAuthMethod.DISCORD,
            OAuthMethod.APPLE,
          ]}
        />
      </div>
    </ModalTriggerCard>
  );
};

export default AuthWithGraz;