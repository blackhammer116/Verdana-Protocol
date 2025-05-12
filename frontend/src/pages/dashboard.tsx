"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAddress } from "@meshsdk/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "@/components/dashboard/overview-tab";
import TreesTab from "@/components/dashboard/trees-tab";
import MarketplaceTab from "@/components/dashboard/marketplace-tab";
import WalletTab from "@/components/dashboard/wallet-tab";
import { Card } from "@/components/ui/card";
import { mockFarmers } from "@/lib/mock-data";
import DashboardNav from "@/components/dashboard/dashboard-nav";

export default function Dashboard() {
  const router = useRouter();
  const address = useAddress();
  const [activeFarmer, setActiveFarmer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const storedFarmer = window.localStorage.getItem("registeredFarmer");

      if (storedFarmer) {
        const farmer = JSON.parse(storedFarmer);
        if (farmer.walletAddress === address) {
          setActiveFarmer(farmer.id);
          setLoading(false);
          return;
        }
      }

      // Find the farmer based on the connected wallet use local storage
      const farmer = storedFarmer ? JSON.parse(storedFarmer) : null;
      if (farmer) {
        setActiveFarmer(farmer.id);
      } else {
        // If no farmer found with this wallet, redirect to registration
        router.push("/register");
      }
    }

    setLoading(false);
  }, [address, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!activeFarmer) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />

      <div className="flex-1 container py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trees">My Trees</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab farmerId={activeFarmer} />
          </TabsContent>

          <TabsContent value="trees">
            <TreesTab farmerId={activeFarmer} />
          </TabsContent>

          <TabsContent value="marketplace">
            <MarketplaceTab farmerId={activeFarmer} />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletTab farmerId={activeFarmer} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
