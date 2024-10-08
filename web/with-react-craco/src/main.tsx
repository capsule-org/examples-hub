import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import RenderStepContent from "./components/views/RenderStepContent";
import RenderCodeSnippet from "./components/views/RenderCodeSnippet";
import Stepper from "./components/ui/stepper";
import Layout from "./components/layouts/layout";
import FooterNavigation from "./components/ui/footerNavigation";

const authOptions = ["oauth", "email", "phone", "capsuleModal", "rainbowkit", "web3-onboard", "PreGen"] as const;

const signingOptions = [
  "capsule",
  "ethers",
  "viem",
  "wagmi",
  "cosmjs",
  "solana-web3js",
  "alchemy aa",
  "zerodev aa",
] as const;

export type AuthOption = (typeof authOptions)[number];
export type SigningOption = (typeof signingOptions)[number];

export default function Main() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAuth, setSelectedAuth] = useState<AuthOption | "">("");
  const [selectedSigner, setSelectedSigner] = useState<SigningOption | "">("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [signature, setSignature] = useState<string>("");

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-8 w-1/2">
        <Stepper
          currentStep={currentStep}
          totalSteps={6}
          className="mb-8"
        />
        <div className="flex-1 flex flex-col justify-center">
          <RenderStepContent
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            selectedAuth={selectedAuth}
            setSelectedAuth={setSelectedAuth}
            selectedSigner={selectedSigner}
            setSelectedSigner={setSelectedSigner}
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            signature={signature}
            setSignature={setSignature}
            authOptions={authOptions}
            signingOptions={signingOptions}
          />
        </div>
      </div>
      <div className="flex-1 bg-muted p-8 flex items-center justify-center w-1/2">
        <Card className="w-full max-w-2xl">
          <RenderCodeSnippet
            currentStep={currentStep}
            selectedSigner={selectedSigner}
            email={email}
            selectedAuth={selectedAuth}
          />
        </Card>
      </div>
    </Layout>
  );
}
