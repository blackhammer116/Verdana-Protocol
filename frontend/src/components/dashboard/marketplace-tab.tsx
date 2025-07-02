"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCarbonTokens, getFarmerCarbonTokens } from "@/lib/mock-data";
import {  ShieldCheck, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface MarketplaceTabProps {
  farmerId: string;
}

export default function MarketplaceTab({ farmerId }: MarketplaceTabProps) {
  const [availableTokens, setAvailableTokens] = useState(0);
  const [marketTokens, ] = useState(mockCarbonTokens.filter(t => t.farmerId !== farmerId));
  const [myTokens, setMyTokens] = useState(getFarmerCarbonTokens(farmerId));
  const { toast } = useToast();

  useEffect(() => {
    const tokens = getFarmerCarbonTokens(farmerId);
    setMyTokens(tokens);
    setAvailableTokens(tokens.reduce((acc, token) => acc + token.amount, 0));
  }, [farmerId]);

  const handleBuy = () => {
    toast({
      title: "Transaction initiated",
      description: "Sending transaction to the blockchain...",
    });

    // Simulate blockchain delay
    setTimeout(() => {
      toast({
        title: "Purchase successful!",
        description: "You have successfully purchased carbon tokens.",
      });
    }, 2000);
  };

  const handleSell = () => {
    if (availableTokens <= 0) {
      toast({
        title: "No tokens available",
        description: "You don't have any tokens to sell.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Tokens listed for sale",
      description: `${availableTokens} COTREE tokens have been listed on the marketplace.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Carbon Tokens</CardTitle>
            <CardDescription>Tokens available for trading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-4xl font-bold">{availableTokens} COTREE</p>
                <p className="text-sm text-muted-foreground">≈ ${(availableTokens * 6).toFixed(2)} USD</p>
              </div>
              <ShieldCheck className="h-12 w-12 text-primary opacity-80" />
            </div>
            <Progress value={myTokens.length > 0 ? 100 : 0} className="h-2" />
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Info className="h-4 w-4" />
              All tokens are verified on the Cardano blockchain
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSell}>
              Sell Tokens
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Current carbon market stats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Current Price</span>
                <span className="font-medium">$6.00 USD / COTREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">24h Change</span>
                <span className="font-medium text-green-500">+2.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">7d Volume</span>
                <span className="font-medium">12,450 COTREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Buyers</span>
                <span className="font-medium">42</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" className="w-full">
              View Market History
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Carbon Credits</CardTitle>
          <CardDescription>Verified carbon credits from other farmers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>CO₂ Captured</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketTokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-medium">Farmer #{token.farmerId}</TableCell>
                  <TableCell>{token.co2Captured.toFixed(1)} tons</TableCell>
                  <TableCell>{token.amount} COTREE</TableCell>
                  <TableCell className="text-right">${(token.amount * 6).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleBuy(token.id)}>
                      Buy
                    </Button>
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