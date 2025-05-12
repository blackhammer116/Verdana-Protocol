"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leaf, LoaderIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@meshsdk/react";
import ReactMarkdown from "react-markdown";

// Add these interfaces at the top of your file

interface Location {
  lat: number;
  lon: number;
}

interface FarmerData {
  location: Location;
  land_size: number;
  tree_type: string;
  tree_count: number;
}

interface SatelliteData {
  ndvi_value: number;
  timestamp: string;
  image_url: string;
}

interface TaskInputs {
  farmer_data: FarmerData;
  satellite_data: SatelliteData;
  // ... other input fields
}

interface Task {
  task_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  completed_at?: string;
  inputs: TaskInputs;
  result?: any;
  error?: string;
}

export default function VerifyPage() {
  const { connected, wallet } = useWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  console.log("selectedTaskId", selectedTaskId);
  const [tasks, setTasks] = useState([]);
  console.log("tasks", tasks);
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  console.log("selectedTask", selectedTask);

  const [formData, setFormData] = useState({
    treeType: "Eucalyptus",
    landSize: 2.5,
    location: {
      lat: -1.95,
      lon: 30.05,
    },
    network: "testnet", // Add network selection
  });

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  // Add effect to fetch task details when selectedTaskId changes
  useEffect(() => {
    if (selectedTaskId) {
      fetchTaskDetails(selectedTaskId);
    }
  }, [selectedTaskId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/tasks");
      const data = await response.json();
      setTasks(data);
      setTaskLoading(false);
    } catch (error) {
      setTaskError("Failed to fetch tasks");
      setTaskLoading(false);
    }
  };

  // Optimize task details fetching
  const fetchTaskDetails = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSelectedTask(data);

      // Auto-refresh details for pending/processing tasks
      if (data.status === "pending" || data.status === "processing") {
        setTimeout(() => fetchTaskDetails(taskId), 5000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch task details: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleVerification = async () => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to verify tree planting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_context: {
            name: "Vardano Protocol",
            description: "Tree planting verification",
            goal: "Verify and reward farmers for planting trees",
          },
          farmer_data: {
            location: formData.location,
            land_size: formData.landSize,
            tree_type: formData.treeType,
            tree_count: Math.floor(formData.landSize * 100), // Estimate 100 trees per hectare
          },
          satellite_data: {
            ndvi_value: 0.82,
            timestamp: new Date().toISOString(),
            image_url: "https://example.com/satellite/image.png",
          },
          carbon_metrics: {
            estimated_co2_per_tree: 0.048,
            token_rate: 6.0,
            min_threshold: 1.0,
          },
          blockchain_config: {
            // Add the required blockchain_config
            network: formData.network,
            token_name: "COTREE",
            smart_contract_address:
              "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp",
          },
        }),
      });

      const result = await response.json();
      setSelectedTaskId(result.task_id);
      setActiveTab("details");
      await fetchTaskDetails(result.task_id);

      toast({
        title: "Verification Started",
        description: "Your tree planting verification is being processed.",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Unable to start verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update task viewing in history tab
  const viewTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setActiveTab("details");
  };

  return (
    <div className="space-y-6 px-20 pb-20 pt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Tree Verification Assistant</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="new">New Verification</TabsTrigger>
          <TabsTrigger value="history">Verification History</TabsTrigger>
          {selectedTaskId && (
            <TabsTrigger value="details">Task Details</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="new">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Verify Your Trees</CardTitle>
                <CardDescription>
                  Let our AI assistant verify your tree planting progress using
                  satellite data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="treeType">Tree Type</Label>
                  <Select
                    defaultValue={formData.treeType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, treeType: value })
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network">Network</Label>
                  <Select
                    defaultValue={formData.network}
                    onValueChange={(value) =>
                      setFormData({ ...formData, network: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testnet">Testnet</SelectItem>
                      <SelectItem value="mainnet">Mainnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landSize">Land Size (hectares)</Label>
                  <Input
                    id="landSize"
                    type="number"
                    step="0.1"
                    value={formData.landSize}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        landSize: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      value={formData.location.lat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            lat: parseFloat(e.target.value),
                          },
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
                      value={formData.location.lon}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            lon: parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleVerification}
                  disabled={loading || !connected}
                >
                  {loading ? (
                    <>
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Leaf className="mr-2 h-4 w-4" />
                      Start Verification
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Verification History</CardTitle>
              <CardDescription>
                View all your verification tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {taskLoading ? (
                <div className="flex justify-center p-6">
                  <LoaderIcon className="h-8 w-8 animate-spin" />
                </div>
              ) : taskError ? (
                <div className="text-red-500 text-center p-6">{taskError}</div>
              ) : tasks.length === 0 ? (
                <div className="text-center text-muted-foreground p-6">
                  No verification tasks found
                </div>
              ) : (
                <div className="divide-y">
                  {tasks.map((task: Task) => (
                    <div
                      key={task.id}
                      className="py-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {task.inputs.farmer_data?.tree_type ||
                            "Unknown Tree Type"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(task.created_at).toLocaleString()}
                          {task.id && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              ID: {task.id}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "secondary" // Map "success" to "secondary" or another supported variant
                              : task.status === "failed"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {task.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewTask(task.task_id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          {selectedTask && (
            <Card>
              <CardHeader>
                <CardTitle>Verification Details</CardTitle>
                <CardDescription>Task ID: {selectedTaskId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status and Timeline section */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Status</h4>
                    <Badge
                      variant={
                        selectedTask.status === "completed"
                          ? "secondary" // Map "success" to "secondary" or another supported variant
                          : selectedTask.status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {selectedTask.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Timeline</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        Created:{" "}
                        {new Date(selectedTask.created_at).toLocaleString()}
                      </p>
                      {selectedTask.completed_at && (
                        <p>
                          Completed:{" "}
                          {new Date(selectedTask.completed_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Results section */}
                {selectedTask.result && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Verification Results</h4>

                    {/* Display task outputs */}
                    {selectedTask.result.tasks_output?.map((task, index) => (
                      <Card key={index} className="p-4">
                        <h5 className="font-medium mb-2">{task.name}</h5>
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                          <ReactMarkdown >
                            {task.raw}
                          </ReactMarkdown>
                        </ScrollArea>
                      </Card>
                    ))}

                    {/* Token Usage Stats */}
                    {selectedTask.result.token_usage && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h5 className="font-medium mb-2">Processing Stats</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            Total Tokens:{" "}
                            {selectedTask.result.token_usage.total_tokens}
                          </div>
                          <div>
                            Prompt Tokens:{" "}
                            {selectedTask.result.token_usage.prompt_tokens}
                          </div>
                          <div>
                            Completion Tokens:{" "}
                            {selectedTask.result.token_usage.completion_tokens}
                          </div>
                          <div>
                            Successful Requests:{" "}
                            {
                              selectedTask.result.token_usage
                                .successful_requests
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Input Data section */}
                <div className="space-y-2">
                  <h4 className="font-medium">Verification Details</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Tree Type</h5>
                      <p className="text-sm">
                        {selectedTask?.inputs?.farmer_data?.tree_type || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Land Size</h5>
                      <p className="text-sm">
                        {selectedTask?.inputs?.farmer_data?.land_size
                          ? `${selectedTask.inputs.farmer_data.land_size} hectares`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Location</h5>
                      <p className="text-sm">
                        {selectedTask?.inputs?.farmer_data?.location
                          ? `Lat: ${selectedTask.inputs.farmer_data.location.lat}, Lon: ${selectedTask.inputs.farmer_data.location.lon}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">NDVI Value</h5>
                      <p className="text-sm">
                        {selectedTask?.inputs?.satellite_data?.ndvi_value ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedTask.error && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Error</h4>
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md">
                      {selectedTask.error}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
