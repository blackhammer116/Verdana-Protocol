"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Scaling as Seedling,  ArrowUpRight } from "lucide-react";
import {  useState } from "react";
import {
  getFarmerTrees,
  getFarmerCarbonTokens,

} from "@/lib/mock-data";

import SatelliteMonitoring from "./satellite-monitoring";

interface OverviewTabProps {
  farmerId: string;
}

export default function OverviewTab({ farmerId }: OverviewTabProps) {

  const [trees, ] = useState(getFarmerTrees(farmerId));
  const [tokens, ] = useState(getFarmerCarbonTokens(farmerId));


  const totalCO2 = tokens.reduce((acc, token) => acc + token.co2Captured, 0);
  const totalTokens = tokens.reduce((acc, token) => acc + token.amount, 0);
  const totalTrees = trees.length;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const chartData = tokens.map((token) => ({
    date: formatDate(token.mintedAt),
    tokens: token.amount,
    co2: token.co2Captured,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Trees</CardTitle>
            <Seedling className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrees}</div>
            <p className="text-xs text-muted-foreground">
              + {Math.floor(totalTrees * 0.1)} new in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Captured</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCO2.toFixed(1)} tons</div>
            <p className="text-xs text-muted-foreground">
              + {(totalCO2 * 0.15).toFixed(1)} tons in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Carbon Tokens</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokens} COTREE</div>
            <p className="text-xs text-muted-foreground">
              ≈ ${(totalTokens * 6).toFixed(2)} USD value
            </p>
          </CardContent>
        </Card>
      </div>

      <SatelliteMonitoring />
    </div>
  );
}
