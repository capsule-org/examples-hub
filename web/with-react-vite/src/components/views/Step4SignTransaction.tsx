import React, { PropsWithChildren } from "react";
import StepLayout from "../layouts/stepLayout";
import { useAtom } from "jotai";
import { selectedSignerAtom } from "../../state";
import SignWithEthers from "../../signing/SignWithEthers";
import { ErrorBoundary } from "react-error-boundary";
import ErrorComponent from "../../components/ui/error";
import SignWithCapsule from "../../signing/SignWithCapsule";
import SignWithViem from "../../signing/SignWithViem";
import SignWithSolanaWeb3 from "../../signing/SignWithSolanaWeb3";
import SignWithCosmJS from "../../signing/SignWithCosmJS";
import SignWithAlchemy from "../../signing/SignWithAlchemy";

type Step4SignTransactionProps = {};

const TITLE = "Sign Transaction";
const SUBTITLE =
  "Sign a transaction or UserOperation with the selected library. Reference the code snippets on the right to see how to sign a transaction.";

const Step4SignTransaction: React.FC<PropsWithChildren<Step4SignTransactionProps>> = () => {
  const [selectedSigner] = useAtom(selectedSignerAtom);

  const renderSignComponent = () => {
    switch (selectedSigner) {
      case "capsule-client":
        return <SignWithCapsule />;
      case "ethers":
        return <SignWithEthers />;
      case "viem":
        return <SignWithViem />;
      case "solana-web3js":
        return <SignWithSolanaWeb3 />;
      case "cosmjs":
        return <SignWithCosmJS />;
      case "alchemy-aa":
        return <SignWithAlchemy />;
      default:
        return <div>Please select a signing method</div>;
    }
  };
  return (
    <StepLayout
      title={TITLE}
      subtitle={SUBTITLE}>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <ErrorComponent
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}>
        {renderSignComponent()}
      </ErrorBoundary>
    </StepLayout>
  );
};

export default Step4SignTransaction;
