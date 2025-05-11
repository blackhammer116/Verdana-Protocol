"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trees as Tree,
  Leaf,
  Map,
  BarChart3,
  Coins,
  DollarSign,
  LineChart,
  TreePine,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import {
  mockFarmers,
  mockMonitoringData,
  mockCarbonTokens,
} from "@/lib/mock-data";
import WalletConnect from "@/components/wallet-connect";
import Link from "next/link";
import { useWallet } from "@meshsdk/react";
import { cn } from "@/lib/utils";
import router from "next/router";

export default function Home() {
  const [totalTrees, setTotalTrees] = useState(0);
  const [totalCO2, setTotalCO2] = useState(0);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const { connected } = useWallet(); 



  useEffect(() => {
    // Calculate total trees and CO2 from mock data
    const treeCount = mockMonitoringData.reduce(
      (acc, data) => acc + data.treeCount,
      0
    );
    const co2Captured = mockCarbonTokens.reduce(
      (acc, token) => acc + token.co2Captured,
      0
    );

    setTotalTrees(treeCount);
    setTotalCO2(co2Captured);
    setTotalFarmers(mockFarmers.length);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />

      <StatsSection
        totalTrees={totalTrees}
        totalCO2={totalCO2.toFixed(1)}
        totalFarmers={totalFarmers}
      />

<section className="container py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="card-hover-effect">
            <CardHeader>
              <Tree className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Plant Trees</CardTitle>
              <CardDescription>
                Register your land and plant native trees to start earning carbon tokens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Farmers register their land and tree planting activities on the blockchain, creating a permanent and transparent record.</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover-effect">
            <CardHeader>
              <Map className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Verify Growth</CardTitle>
              <CardDescription>
                Tree growth is verified through satellite imaging and AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Our system uses satellite data to monitor vegetation index (NDVI) and tree growth, ensuring accurate and transparent verification.</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover-effect">
            <CardHeader>
              <Coins className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Earn Tokens</CardTitle>
              <CardDescription>
                Receive carbon tokens based on the CO₂ your trees absorb from the atmosphere.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>For every ton of CO₂ captured, farmers receive COTREE tokens that can be traded or sold on the carbon marketplace.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
        <Link
          href="/dashboard"
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "h-10 py-2 px-4 text-lg ",
            !connected && "pointer-events-none opacity-50"
          )}
        >
          {connected ? 'Go to Dashboard' : 'Connect Wallet to Start'}
        </Link>
        {!connected && (
          <p className="mt-2 text-sm text-muted-foreground">
            Connect your Cardano wallet to access the dashboard.
          </p>
        )}
      </div>
      </section>

      <section className="py-16 bg-gray-50 rounded-3xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Together, we're making a measurable difference in the fight
              against climate change.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">
                105
              </div>
              <div className="text-gray-600">Trees Planted</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">3</div>
              <div className="text-gray-600">Farmers Registered</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">13.1+</div>
              <div className="text-gray-600">Tons of CO₂ Absorbed</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-primary mb-2">
                $300+
              </div>
              <div className="text-gray-600">Paid to Farmers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Benefits for Stakeholders
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform creates value for everyone involved in the ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Farmers */}
            <div className="card">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Farmers</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Earn income for eco-efforts, verified fairly</span>
                    </li>
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        Access to new revenue streams and sustainable practices
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        Transparency in payment and verification processes
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Governments/NGOs */}
            <div className="card">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Governments/NGOs
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Transparent proof of where funding goes</span>
                    </li>
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        Data-driven insights into environmental impact
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Streamlined process for funding distribution</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Companies */}
            <div className="card">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Companies</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Buy verified offsets for ESG compliance</span>
                    </li>
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Track impact of environmental investments</span>
                    </li>
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Showcase commitment to sustainability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="card">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <TreePine className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Environment</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Verified tree planting = more CO₂ removed</span>
                    </li>
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        Increased biodiversity and habitat restoration
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Leaf className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        Reduced soil erosion and improved water quality
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-primary text-white rounded-3xl mb-16 max-w-7xl flex flex-col items-center mx-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Verdana Protocol today and be part of the solution to climate
            change while earning rewards for your environmental efforts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/register"
              className="btn-primary bg-white text-primary hover:bg-gray-100"
            >
              Register Your Land
            </Link>
            <Link
              href="/marketplace"
              className="btn-secondary border-white text-white hover:bg-white/10"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
