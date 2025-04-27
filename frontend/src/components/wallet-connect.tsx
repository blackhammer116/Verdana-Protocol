"use client";

import { Button } from "./ui/button";
import { useWallet, useAddress } from "@meshsdk/react";
import { useEffect, useState } from "react";
import { truncateAddress } from "@/lib/utils";

interface WalletConnectProps {
  onConnected?: () => void;
}

export default function WalletConnect({ onConnected }: WalletConnectProps) {
  const { connect, disconnect, connected, name: walletName } = useWallet();
  const address = useAddress();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connect('eternl');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  useEffect(() => {
    if (connected && onConnected) {
      onConnected();
    }
  }, [connected, onConnected]);

  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <p className="text-sm font-medium">{walletName}</p>
          <p className="text-xs text-muted-foreground">{truncateAddress(address)}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}