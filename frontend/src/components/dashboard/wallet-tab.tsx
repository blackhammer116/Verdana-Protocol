"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAddress, useWallet } from "@meshsdk/react";
import { mockFarmers, getFarmerCarbonTokens } from "@/lib/mock-data";
import { CopyIcon, CheckIcon, CoinsIcon, ArrowRightIcon } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WalletTabProps {
  farmerId: string;
}

export default function WalletTab({ farmerId }: WalletTabProps) {
  const address = useAddress();
  const { connected, wallet } = useWallet();
  const [farmer, setFarmer] = useState(mockFarmers.find(f => f.id === farmerId));
  const [copySuccess, setCopySuccess] = useState(false);
  const [tokens, setTokens] = useState(getFarmerCarbonTokens(farmerId));
  const [sendAmount, setSendAmount] = useState<number>(0);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (farmerId) {
      setTokens(getFarmerCarbonTokens(farmerId));
      setFarmer(mockFarmers.find(f => f.id === farmerId));
    }
  }, [farmerId]);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSendTokens = () => {
    if (!sendAmount || sendAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to send.",
        variant: "destructive",
      });
      return;
    }

    if (!recipientAddress) {
      toast({
        title: "Invalid recipient",
        description: "Please enter a valid recipient address.",
        variant: "destructive",
      });
      return;
    }

    const totalAvailable = tokens.reduce((acc, token) => acc + token.amount, 0);
    if (sendAmount > totalAvailable) {
      toast({
        title: "Insufficient tokens",
        description: `You only have ${totalAvailable} COTREE tokens available.`,
        variant: "destructive",
      });
      return;
    }

    // Simulate blockchain transaction
    toast({
      title: "Transaction initiated",
      description: "Sending transaction to the blockchain...",
    });

     // Simulate transaction confirmation after delay
    setTimeout(() => {
      toast({
        title: "Transaction successful",
        description: `${sendAmount} COTREE tokens have been sent to ${truncateAddress(recipientAddress)}`,
      });
      setIsDialogOpen(false);
      setSendAmount(0);
      setRecipientAddress("");
    }, 2000);
  };

  const totalTokenBalance = tokens.reduce((acc, token) => acc + token.amount, 0);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle>Wallet Details</CardTitle>
          <CardDescription>Your connected Cardano wallet</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Wallet Address</h3>
              <div className="flex items-center gap-2">
                <div className="bg-muted p-2 rounded text-sm flex-1 overflow-hidden">
                  <p className="truncate">{address || "No wallet connected"}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={!address}
                  onClick={handleCopyAddress}
                >
                  {copySuccess ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Wallet Provider</h3>
              <p className="text-sm">{connected ? wallet : "Not connected"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Farmer ID</h3>
                <p className="text-sm">{farmer?.id || "Unknown"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CoinsIcon className="h-5 w-5 text-primary" />
              Token Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>COTREE Tokens</span>
                <span className="font-bold">{totalTokenBalance}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Value (USD)</span>
                <span>${(totalTokenBalance * 6).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  Send Tokens
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send COTREE Tokens</DialogTitle>
                  <DialogDescription>
                    Send your carbon tokens to another wallet address.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter COTREE amount"
                      value={sendAmount || ""}
                      onChange={(e) => setSendAmount(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="Enter Cardano address"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSendTokens}>Send Tokens</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token ID</TableHead>
                  <TableHead>CO₂ (tons)</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell className="font-medium">{token.id}</TableCell>
                    <TableCell>{token.co2Captured.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{token.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell>{new Date(token.mintedAt).toLocaleDateString()}</TableCell>
                  <TableCell>Token Mint</TableCell>
                  <TableCell>{token.amount} COTREE</TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {token.transactionId ? truncateAddress(token.transactionId) : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
