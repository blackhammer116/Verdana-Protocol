"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddress } from "@meshsdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import WalletConnect from "@/components/wallet-connect";
import { Trees as Tree, MapPin } from "lucide-react";
import { mockFarmers } from "@/lib/mock-data";

export default function Register() {
  const router = useRouter();
  const address = useAddress();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast({
        title: "No wallet connected",
        description: "Please connect your Cardano wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate registration on blockchain
    toast({
      title: "Registration in progress",
      description: "Your information is being recorded on the blockchain...",
    });

    // After a short delay, simulate success and redirect
    setTimeout(() => {
      toast({
        title: "Registration successful!",
        description: "Your farmer profile has been created.",
      });

      // Add farmer to mock data
      const newFarmer = {
        id: (mockFarmers.length + 1).toString(),
        name: formData.name,
        walletAddress: address,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        },
        registeredAt: new Date(),
      };

      mockFarmers.push(newFarmer);

      // Set the registered farmer in local storage
      localStorage.setItem("registeredFarmer", JSON.stringify(newFarmer));

      // Redirect to dashboard
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center gap-2">
            <Tree className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Verdana Protocol</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Farmer Registration</CardTitle>
              <CardDescription>
                Register to start earning carbon tokens for your tree planting
                activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!address ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <p className="text-center text-muted-foreground mb-4">
                    Connect your Cardano wallet to register as a farmer.
                  </p>
                  <WalletConnect />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="wallet"
                        value={address}
                        disabled
                        className="text-sm font-mono opacity-70"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is the wallet that will receive your carbon tokens.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Location Coordinates
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="latitude" className="sr-only">
                          Latitude
                        </Label>
                        <Input
                          id="latitude"
                          placeholder="Latitude (e.g. 8.9806)"
                          type="number"
                          step="0.0001"
                          value={formData.latitude}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              latitude: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude" className="sr-only">
                          Longitude
                        </Label>
                        <Input
                          id="longitude"
                          placeholder="Longitude (e.g. 38.7578)"
                          type="number"
                          step="0.0001"
                          value={formData.longitude}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              longitude: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the GPS coordinates of your land.
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter>
              {address && (
                <Button className="w-full" onClick={handleSubmit}>
                  Register as Farmer
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
