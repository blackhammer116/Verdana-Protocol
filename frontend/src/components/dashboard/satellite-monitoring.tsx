"use client"

import { useEffect, useState } from "react"
import { MapPin, Calendar, Leaf, TrendingUp, BarChart3, Play, Pause, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import SatelliteMap from "./satellite-map"
import NDVIChart from "./ndvi-charts"
import TreeGrowthSimulation from "./tree-growth"

// Simulated farmer data
const farmerData = {
  name: "John Doe",
  location: "Niger, West Africa",
  area: 2.5,
  treeType: "Eucalyptus",
  startDate: "2023-10-15",
  estimatedCO2: 0,
  totalTrees: 100,
}

export default function SatelliteMonitoring() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentNDVI, setCurrentNDVI] = useState(0.2)
  const [co2Absorbed, setCo2Absorbed] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Start/stop simulation
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating)
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsSimulating(false)
    setCurrentNDVI(0.2)
    setCo2Absorbed(0)
    setTimeElapsed(0)
    setCurrentImageIndex(0)
  }

  // Simulate tree growth over time
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1

        // Update NDVI value based on time (simulating growth)
        // NDVI ranges from -1 to 1, with healthy vegetation typically 0.2 to 0.8
        if (newTime % 7 === 0) {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 5)
          setCurrentNDVI((prev) => {
            const newValue = Math.min(0.85, prev + 0.15)
            // Calculate CO2 based on NDVI
            // Simple formula: CO2 = TreeTypeFactor × Area × NDVI
            const treeTypeFactor = 2.5 // Factor for Eucalyptus
            const newCO2 = Number.parseFloat((treeTypeFactor * farmerData.area * newValue).toFixed(2))
            setCo2Absorbed(newCO2)
            return newValue
          })
        }

        return newTime
      })
    }, 1000 / simulationSpeed)

    return () => clearInterval(interval)
  }, [isSimulating, simulationSpeed])

  // Format time for display (months/days)
  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 30)
    return days === 0 ? "Initial planting" : `${days} months after planting`
  }

  // Calculate token rewards (simplified for demo)
  const calculateTokens = () => {
    return Math.floor(co2Absorbed * 10) / 10
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Vardano Protocol</h1>
        <p className="text-muted-foreground">Satellite Monitoring Dashboard - Tree Growth Simulation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Satellite Monitoring</CardTitle>
                <CardDescription>NDVI visualization of tree growth</CardDescription>
              </div>
              <Badge variant={currentNDVI > 0.6 ? "default" : "outline"}>{formatTime(timeElapsed)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="aspect-video relative rounded-md overflow-hidden border">
              <TreeGrowthSimulation currentImageIndex={currentImageIndex} ndviValue={currentNDVI} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button onClick={toggleSimulation} variant="outline" size="sm">
                {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isSimulating ? "Pause" : "Simulate Growth"}
              </Button>
              <Button onClick={resetSimulation} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Simulation Speed:</span>
              <Button
                variant={simulationSpeed === 1 ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSimulationSpeed(1)}
              >
                1x
              </Button>
              <Button
                variant={simulationSpeed === 2 ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSimulationSpeed(2)}
              >
                2x
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Farmer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Farmer</div>
                <div className="font-medium">{farmerData.name}</div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  Location
                </div>
                <div className="font-medium">{farmerData.location}</div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Leaf className="h-4 w-4 mr-1" />
                  Tree Type
                </div>
                <div className="font-medium">{farmerData.treeType}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Area</div>
                <div className="font-medium">{farmerData.area} hectares</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Trees Planted</div>
                <div className="font-medium">{farmerData.totalTrees}</div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Start Date
                </div>
                <div className="font-medium">{farmerData.startDate}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitoring Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    NDVI Value
                  </div>
                  <span className="text-sm font-medium">{currentNDVI.toFixed(2)}</span>
                </div>
                <Progress value={currentNDVI * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center text-sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    CO₂ Absorbed
                  </div>
                  <span className="text-sm font-medium">{co2Absorbed.toFixed(2)} tons</span>
                </div>
                <Progress value={(co2Absorbed / 5) * 100} className="h-2" />
              </div>

              <Separator />

              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Carbon Tokens Earned</span>
                  <Badge variant="outline" className="bg-green-50">
                    {calculateTokens()} COTREE
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="ndvi">
        <TabsList>
          <TabsTrigger value="ndvi">NDVI History</TabsTrigger>
          <TabsTrigger value="map">Location Map</TabsTrigger>
        </TabsList>
        <TabsContent value="ndvi" className="p-4 border rounded-md">
          <NDVIChart currentNDVI={currentNDVI} timeElapsed={timeElapsed} />
        </TabsContent>
        <TabsContent value="map" className="p-4 border rounded-md">
          <SatelliteMap />
        </TabsContent>
      </Tabs>
    </div>
  )
}
