import React, { useEffect, useState } from "react";
import { CapsuleModal, OAuthMethod, AuthLayout, ExternalWallet } from "@usecapsule/react-sdk";
import "@usecapsule/react-sdk/styles.css";
import { CapsuleEvmProvider, metaMaskWallet, coinbaseWallet } from "@usecapsule/evm-wallet-connectors";
import { CapsuleSolanaProvider, phantomWallet } from "@usecapsule/solana-wallet-connectors";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";
import Logo from "../assets/capsule.svg";
import { capsuleClient } from "../capsuleClient";
import { disableNextAtom, disablePrevAtom, isLoadingAtom, isLoggedInAtom } from "../state";
import ModalTriggerCard from "../components/ui/modal-trigger-card";
import { withMinimumLoadingTime } from "../lib/utils";

type AuthWithCapsuleModalProps = {};

const QUERY_CLIENT = new QueryClient();
const SOLANA_NETWORK = WalletAdapterNetwork.Devnet;
const SOLANA_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);

const AuthWithCapsuleModal: React.FC<AuthWithCapsuleModalProps> = () => {
  const [internalStep, setInternalStep] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [, setDisableNext] = useAtom(disableNextAtom);
  const [, setDisablePrev] = useAtom(disablePrevAtom);

  const [showCapsuleModal, setShowCapsuleModal] = useState<boolean>(false);

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
          setInternalStep(1);
        }
      },
      250,
      setIsLoading
    );
  };

  useEffect(() => {
    if (isLoggedIn && internalStep === 1) {
      setDisableNext(false);
      setDisablePrev(true);
    }
  }, [isLoggedIn, internalStep]);

  const handleModalOpen = () => {
    setShowCapsuleModal(true);
  };

  const handleModalClose = async () => {
    setShowCapsuleModal(false);
    await checkLoginStatus();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ModalTriggerCard
        internalStep={internalStep}
        handleModalOpen={handleModalOpen}
        isLoading={isLoading}
        CardTitleStep0="Capsule Modal"
        CardTitleStep1="Success!"
        buttonLabel="Open Modal"
      />
      <QueryClientProvider client={QUERY_CLIENT}>
        <CapsuleEvmProvider
          config={{
            projectId: "",
            appName: "Capsule Modal Example",
            chains: [sepolia],
            wallets: [metaMaskWallet, coinbaseWallet],
          }}>
          <CapsuleSolanaProvider
            endpoint={SOLANA_ENDPOINT}
            wallets={[phantomWallet]}
            chain={SOLANA_NETWORK}
            appIdentity={{ name: "Capsule Modal Example", uri: `${location.protocol}//${location.host}` }}>
            <CapsuleModal
              logo={Logo as unknown as string}
              theme={{
                backgroundColor: "#FFF",
                foregroundColor: "#000",
                accentColor: "#FF754A",
                mode: "light",
                font: "Inter",
              }}
              capsule={capsuleClient}
              isOpen={showCapsuleModal}
              onClose={handleModalClose}
              appName="Capsule Modal Example"
              oAuthMethods={Object.values(OAuthMethod)}
              disableEmailLogin={false}
              disablePhoneLogin={false}
              authLayout={[AuthLayout.AUTH_FULL, AuthLayout.EXTERNAL_FULL]}
              externalWallets={[ExternalWallet.METAMASK, ExternalWallet.COINBASE, ExternalWallet.PHANTOM]}
              twoFactorAuthEnabled={true}
              recoverySecretStepEnabled={true}
              onRampTestMode={true}
            />
          </CapsuleSolanaProvider>
        </CapsuleEvmProvider>
      </QueryClientProvider>
    </div>
  );
};

export default AuthWithCapsuleModal;
