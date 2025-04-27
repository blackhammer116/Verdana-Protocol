import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Trees as Tree, Leaf, Users } from "lucide-react";

interface StatsProps {
  totalTrees: number;
  totalCO2: string;
  totalFarmers: number;
}

export default function StatsSection({ totalTrees, totalCO2, totalFarmers }: StatsProps) {
  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <Tree className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold mb-2">{totalTrees}</CardTitle>
            <p className="text-xl text-muted-foreground">Trees Planted</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold mb-2">{totalCO2}</CardTitle>
            <p className="text-xl text-muted-foreground">Tons of CO₂ Captured</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold mb-2">{totalFarmers}</CardTitle>
            <p className="text-xl text-muted-foreground">Farmers Registered</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}