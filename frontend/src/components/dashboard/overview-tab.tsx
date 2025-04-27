"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Scaling as Seedling, Map, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  mockFarmers,
  getFarmerTrees,
  getFarmerCarbonTokens,
  getFarmerMonitoringData,
  getFarmerTransactions
} from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OverviewTabProps {
  farmerId: string;
}

export default function OverviewTab({ farmerId }: OverviewTabProps) {
  const [farmer, setFarmer] = useState(mockFarmers.find(f => f.id === farmerId));
  const [trees, setTrees] = useState(getFarmerTrees(farmerId));
  const [tokens, setTokens] = useState(getFarmerCarbonTokens(farmerId));
  const [monitoringData, setMonitoringData] = useState(getFarmerMonitoringData(farmerId));
  const [transactions, setTransactions] = useState(getFarmerTransactions(farmerId));

  const totalCO2 = tokens.reduce((acc, token) => acc + token.co2Captured, 0);
  const totalTokens = tokens.reduce((acc, token) => acc + token.amount, 0);
  const totalTrees = trees.length;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const chartData = tokens.map(token => ({
    date: formatDate(token.mintedAt),
    tokens: token.amount,
    co2: token.co2Captured
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

      <Card>
        <CardHeader>
          <CardTitle>Carbon Capture Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tokens" fill="hsl(var(--chart-1))" name="COTREE Tokens" />
              <Bar dataKey="co2" fill="hsl(var(--chart-2))" name="CO₂ Captured (tons)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Satellite Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          {monitoringData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={monitoringData[monitoringData.length - 1].imageUrl} 
                  alt="Satellite imagery" 
                  className="rounded-md w-full h-48 object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Date</h4>
                  <p>{new Date(monitoringData[monitoringData.length - 1].timestamp).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">NDVI Score</h4>
                  <p>{monitoringData[monitoringData.length - 1].ndvi.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Estimated CO₂ Captured</h4>
                  <p>{monitoringData[monitoringData.length - 1].estimatedCO2.toFixed(1)} tons</p>
                </div>
              </div>
            </div>
          ) : (
            <p>No monitoring data available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}