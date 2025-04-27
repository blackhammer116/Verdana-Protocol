"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockCarbonTokens } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trees as Tree, ShoppingCart, Leaf, BarChart2, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import { useToast } from "@/hooks/use-toast";
import { useAddress } from "@meshsdk/react";

export default function Marketplace() {
  const [tokens, setTokens] = useState(mockCarbonTokens);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const address = useAddress();

  const handlePurchase = (id: string, amount: number) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Purchase initiated",
      description: "Processing your purchase...",
    });

    setTimeout(() => {
      toast({
        title: "Purchase successful",
        description: `Successfully purchased ${amount} COTREE tokens!`,
      });
    }, 2000);
  };

  const filteredTokens = tokens.filter(token => {
    if (!searchTerm) return true;
    return token.id.includes(searchTerm) || 
           token.farmerId.includes(searchTerm) || 
           token.co2Captured.toString().includes(searchTerm);
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Carbon Marketplace</h1>
            <p className="text-muted-foreground">
              Buy and sell verified carbon credits from farmers across Africa
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search by ID, farmer, or amount..."
                className="w-[250px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
            {address ? (
              <Link href="/dashboard" passHref>
                <Button variant="outline">My Dashboard</Button>
              </Link>
            ) : (
              <Link href="/register" passHref>
                <Button variant="default">Register</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{tokens.length}</CardTitle>
              <CardDescription>Available Listings</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">${(6).toFixed(2)}</CardTitle>
              <CardDescription>Current Price (USD)</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{tokens.reduce((acc, token) => acc + token.co2Captured, 0).toFixed(1)}</CardTitle>
              <CardDescription>Total CO₂ Offset (tons)</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tokens</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Available Carbon Tokens</CardTitle>
                <CardDescription>
                  All verified carbon tokens available for purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token ID</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>CO₂ Captured</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell className="font-mono">{token.id}</TableCell>
                        <TableCell>Farmer #{token.farmerId}</TableCell>
                        <TableCell>{token.co2Captured.toFixed(1)} tons</TableCell>
                        <TableCell>{token.amount} COTREE</TableCell>
                        <TableCell>{new Date(token.mintedAt).toLocaleDateString()}</TableCell>
                        <TableCell>${(token.amount * 6).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePurchase(token.id, token.amount)}
                          >
                            Buy
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTokens.slice(0, 3).map((token) => (
                    <Card key={token.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>COTREE #{token.id}</CardTitle>
                            <CardDescription>Farmer #{token.farmerId}</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-primary/10">
                            New
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="font-medium">{token.amount} COTREE</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">CO₂:</span>
                            <span className="font-medium">{token.co2Captured.toFixed(1)} tons</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium">${(token.amount * 6).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">
                              {new Date(token.mintedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handlePurchase(token.id, token.amount)}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Tokens
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="popular">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...filteredTokens].sort((a, b) => b.amount - a.amount).slice(0, 3).map((token) => (
                    <Card key={token.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>COTREE #{token.id}</CardTitle>
                            <CardDescription>Farmer #{token.farmerId}</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-accent text-accent-foreground">
                            Popular
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="font-medium">{token.amount} COTREE</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">CO₂:</span>
                            <span className="font-medium">{token.co2Captured.toFixed(1)} tons</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium">${(token.amount * 6).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">
                              {new Date(token.mintedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handlePurchase(token.id, token.amount)}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Tokens
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}