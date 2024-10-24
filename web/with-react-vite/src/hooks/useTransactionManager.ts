import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { capsuleClient } from "../capsuleClient";
import { WalletType } from "@usecapsule/web-sdk";

const useTransactionManager = () => {
  const [to, setTo] = useState<string>("");
  const [value, setValue] = useState<string>("0.1");
  const [nonce, setNonce] = useState<string>("");
  const [gasLimit, setGasLimit] = useState<string>("21000");
  const [gasPrice, setGasPrice] = useState<string>("20");
  const [isValid, setIsValid] = useState(false);
  const [fromAddress, setFromAddress] = useState<string>("");

  useEffect(() => {
    const fetchFromAddress = async () => {
      try {
        const wallets = await capsuleClient.getWalletsByType(WalletType.EVM);
        const wallet = Object.values(wallets)[0];
        console.log("wallet", wallet);
        const address = wallet.address!;
        console.log("address", address);
        setFromAddress(address);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

    fetchFromAddress();
  }, []);

  useEffect(() => {
    if (fromAddress) {
      setTo("");
      setValue("0.1");
      setGasLimit("21000");
      const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      const fetchDefaults = async () => {
        try {
          const gasPriceData = await provider.getFeeData();
          setGasPrice(gasPriceData.gasPrice ? ethers.formatUnits(gasPriceData.gasPrice, "gwei") : "20");
          const nonceValue = await provider.getTransactionCount(fromAddress);
          setNonce(nonceValue.toString());
        } catch (error) {
          console.error("Error fetching default gasPrice and nonce:", error);
        }
      };
      fetchDefaults();
    }
  }, [fromAddress]);

  useEffect(() => {
    const isToValid = ethers.isAddress(to);
    const isValueValid = /^\d*\.?\d+$/.test(value) && ethers.parseUnits(value, "ether") > 0n;
    const isNonceValid = /^\d+$/.test(nonce) && parseInt(nonce, 10) >= 0;
    const isGasLimitValid = /^\d+$/.test(gasLimit) && parseInt(gasLimit) > 0;
    const isGasPriceValid = /^\d*\.?\d+$/.test(gasPrice) && parseFloat(gasPrice) > 0;

    setIsValid(isToValid && isValueValid && isNonceValid && isGasLimitValid && isGasPriceValid);
  }, [to, value, nonce, gasLimit, gasPrice]);

  return {
    to,
    setTo,
    value,
    setValue,
    nonce,
    setNonce,
    gasLimit,
    setGasLimit,
    gasPrice,
    setGasPrice,
    isValid,
    fromAddress,
  };
};

export default useTransactionManager;
