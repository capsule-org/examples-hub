import React, { PropsWithChildren } from "react";
import StepLayout from "../layouts/stepLayout";
import { AuthOption } from "../../page";

import OAuthAuth from "../../auth/AuthWithOAuth";
import EmailAuth from "../../auth/AuthWithEmail";
import PhoneAuth from "../../auth/AuthWithPhone";
import CapsuleModalAuth from "../../auth/AuthWithCapsuleModal";
import RainbowKitAuth from "../../auth/AuthWithRainbowkit";
import Web3OnboardAuth from "../../auth/AuthWithWeb3Onboard";
import PreGenAuth from "../../auth/AuthWithPreGen";
import AuthWithLeapSocial from ".auth/AuthWithLeapSocial";
import AuthWithCosmosKit from ".auth/AuthWithCosmosKit";
import AuthWithGraz from ".auth/AuthWithGraz";

type Step2AuthenticateUserProps = {
  email: string;
  setEmail: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  countryCode: string;
  setCountryCode: (value: string) => void;
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  currentStep: number;
  setCurrentStep: (value: number) => void;
  selectedAuth: AuthOption | "";
};

const Step2AuthenticateUser: React.FC<PropsWithChildren<Step2AuthenticateUserProps>> = ({
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  countryCode,
  setCountryCode,
  verificationCode,
  setVerificationCode,
  currentStep,
  setCurrentStep,
  selectedAuth,
}) => {
  const [disableNext, setDisableNext] = React.useState(true);
  const [disablePrev, setDisablePrev] = React.useState(false);

  const renderAuthComponent = () => {
    switch (selectedAuth) {
      case "oauth":
        return (
          <OAuthAuth
            email={email}
            setEmail={setEmail}
            setCurrentStep={setCurrentStep}
            setDisableNext={setDisableNext}
            setDisablePrev={setDisablePrev}
          />
        );
      case "email":
        return (
          <EmailAuth
            email={email}
            setEmail={setEmail}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            setCurrentStep={setCurrentStep}
            setDisableNext={setDisableNext}
            setDisablePrev={setDisablePrev}
          />
        );
      case "phone":
        return (
          <PhoneAuth
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            setCurrentStep={setCurrentStep}
            setDisableNext={setDisableNext}
            setDisablePrev={setDisablePrev}
          />
        );
      case "capsuleModal":
        return (
          <CapsuleModalAuth
            setCurrentStep={setCurrentStep}
            setDisableNext={setDisableNext}
            setDisablePrev={setDisablePrev}
          />
        );
      case "rainbowkit":
        return (
          <RainbowKitAuth
            setCurrentStep={setCurrentStep}
            setDisableNext={setDisableNext}
            setDisablePrev={setDisablePrev}
          />
        );
      case "web3-onboard":
        return (
          <Web3OnboardAuth
            setCurrentStep={setCurrentStep}
            setDisableNext={setDisableNext}
            setDisablePrev={setDisablePrev}
          />
        );
      case "PreGen":
        return (
          <PreGenAuth
            setCurrentStep={setCurrentStep}
            setDisableNext={setDisableNext}
            setDisablePrev={setDisablePrev}
          />
        );
      case "leap-social":
        return <AuthWithLeapSocial />;
      case "cosmos-kit":
        return (
          <AuthWithCosmosKit
            setCurrentStep={setCurrentStep}
            setDisableNext={setDisableNext}
            setDisablePrev={setDisablePrev}
          />
        );
      case "graz":
        return <AuthWithGraz />;
      default:
        return <div>Please select an authentication method</div>;
    }
  };

  return (
    <StepLayout
      title="Step 2: Authenticate User"
      subtitle="Depending on the authentication method you selected authentication may require multiple steps. Reference the code snippets on the right to see how to authenticate a user with the selected method."
      currentStep={currentStep}
      onNextStep={() => setCurrentStep(currentStep + 1)}
      onPrevStep={() => setCurrentStep(currentStep - 1)}
      disableNext={disableNext}
      disablePrev={disablePrev}>
      {renderAuthComponent()}
    </StepLayout>
  );
};

export default Step2AuthenticateUser;
