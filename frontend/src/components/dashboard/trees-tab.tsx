"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trees as Tree, MapPin, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {  plantTree } from "@/lib/mock-data";
import { Tree as TreeType } from "@/lib/types";
import { useWallet } from "@meshsdk/react";
import {
  plantTrees as plantTreeOnChain,
} from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";

interface TreesTabProps {
  farmerId: string;
}

// // Import map component dynamically to avoid SSR issues with LeafletAdd commentMore actions
// const TreeMap = dynamic(() => import("@/components/dashboard/tree-map"), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-[400px] bg-muted flex items-center justify-center">
//       Loading map...
//     </div>
//   ),
// });

export default function TreesTab({ farmerId }: TreesTabProps) {
  const [trees, setTrees] = useState<TreeType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTree, setNewTree] = useState({
    treeType: "Eucalyptus",
    latitude: 0,
    longitude: 0,
  });
  const { wallet } = useWallet();
  const { toast } = useToast();


  
  const handlePlantTree = async () => {
    if (!newTree.latitude || !newTree.longitude) {
      toast({
        title: "Error",
        description: "Please enter valid coordinates.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create datum for the tree planting transaction
      const datum = {
        farmerId,
        treesPlanted: trees.length + 1,
        carbonCaptured: 0, // Initial carbon capture is 0
        latitude: newTree.latitude,
        longitude: newTree.longitude,
        treeType: newTree.treeType,
      };

        // Submit transaction to blockchainAdd commentMore actions
     const txHash = await plantTreeOnChain(wallet, datum, newTree);

      toast({
        title: "Transaction submitted",
        description:
   "Your tree planting transaction has been submitted to the blockchain...",
      });

      // After blockchain confirmation, update UI
      const tree = plantTree({
        farmerId,
        treeType: newTree.treeType,
        plantedAt: new Date(),
        location: {
          latitude: newTree.latitude,
          longitude: newTree.longitude,
        },
      });

      setTrees([...trees, tree]);
      setOpenDialog(false);

      toast({
        title: "Tree planted successfully!",
        description:
          typeof txHash === "string"
            ? `Transaction confirmed: ${txHash.substring(0, 8)}...`
            : "Tree added to local database",
      });
    } catch (error) {
      console.error("Error planting tree:", error);
      toast({
        title: "Error",
        description: "Failed to plant tree. Please try again.",
        variant: "destructive",
      });
    }
  };

  const growthStageLabel = (stage: number) => {
    switch (stage) {
      case 0:
        return "Seedling";
      case 1:
        return "Young";
      case 2:
        return "Growing";
      case 3:
        return "Mature";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Trees</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Plant New Tree
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Plant a New Tree</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="treeType">Tree Type</Label>
                <Select
                  defaultValue={newTree.treeType}
                  onValueChange={(value) =>
                    setNewTree({ ...newTree, treeType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tree type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eucalyptus">Eucalyptus</SelectItem>
                    <SelectItem value="Acacia">Acacia</SelectItem>
                    <SelectItem value="Baobab">Baobab</SelectItem>
                    <SelectItem value="Neem">Neem</SelectItem>
                    <SelectItem value="Mango">Mango</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 8.9806"
                  value={newTree.latitude || ""}
                  onChange={(e) =>
                    setNewTree({
                      ...newTree,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 38.7578"
                  value={newTree.longitude || ""}
                  onChange={(e) =>
                    setNewTree({
                      ...newTree,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <Button className="w-full" onClick={handlePlantTree}>
                Plant Tree
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Tree Locations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* <TreeMap trees={trees} height={400} /> */}
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold mt-8 mb-4">Tree Inventory</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trees.map((tree) => (
          <Card
            key={tree.id}
            className={`tree-growth-stage-${tree.growthStage + 1}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{tree.treeType}</CardTitle>
                <Tree className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID:</span>
                <span>{tree.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Planted:</span>
                <span>{new Date(tree.plantedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Growth:</span>
                <span className="flex items-center gap-1">
                  {growthStageLabel(tree.growthStage)}
                  <span className="inline-block w-3 h-3 rounded-full bg-primary"></span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Health:</span>
                <span>{tree.healthScore}%</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location:</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {tree.location.latitude.toFixed(4)},{" "}
                  {tree.location.longitude.toFixed(4)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
