"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@meshsdk/react";
import dynamic from "next/dynamic";
import {
  Search,
  Filter,
  ChevronDown,
  AlertTriangle,
  Users,
  TreePine,
  Leaf,
} from "lucide-react";

// Dynamically import MapContainer with no SSR
const MapWithNoSSR = dynamic(
  () => import("./MapComponent"), // We'll create this component
  { ssr: false }
);

// Dummy project data
const dummyProjects = [
  {
    id: 1,
    name: "Niger Community Reforestation",
    location: "Zinder, Niger",
    coordinates: [13.8069, 8.9881],
    status: "Active",
    farmers: 45,
    trees: 4800,
    area: 24,
    co2: 86.4,
    startDate: "2024-11-05",
    description:
      "Community-led reforestation project in the Zinder region of Niger, focusing on drought-resistant species.",
    image:
      "https://images.pexels.com/photos/97906/pexels-photo-97906.jpeg?auto=compress&cs=tinysrgb&w=1260",
  },
  {
    id: 2,
    name: "Sahel Greenbelt Initiative",
    location: "Maradi, Niger",
    coordinates: [13.5, 7.1],
    status: "Active",
    farmers: 78,
    trees: 12500,
    area: 62.5,
    co2: 225,
    startDate: "2024-09-18",
    description:
      "Large-scale effort to create a green belt across the Sahel region to combat desertification and provide sustainable livelihoods.",
    image:
      "https://images.pexels.com/photos/5967868/pexels-photo-5967868.jpeg?auto=compress&cs=tinysrgb&w=1260",
  },
  {
    id: 3,
    name: "Ethiopia Highland Restoration",
    location: "Amhara, Ethiopia",
    coordinates: [11.7, 37.8],
    status: "Active",
    farmers: 120,
    trees: 18000,
    area: 90,
    co2: 324,
    startDate: "2024-10-01",
    description:
      "Reforestation of degraded highlands in Ethiopia, providing sustainable livelihoods for local communities.",
    image:
      "https://images.pexels.com/photos/3794147/pexels-photo-3794147.jpeg?auto=compress&cs=tinysrgb&w=1260",
  },
  {
    id: 4,
    name: "Senegal Mangrove Restoration",
    location: "Sine Saloum, Senegal",
    coordinates: [14.1667, -16.7667],
    status: "Proposed",
    farmers: 0,
    trees: 0,
    area: 35,
    co2: 0,
    startDate: "2025-01-15",
    description:
      "Planned restoration of mangrove ecosystems along the Sine Saloum Delta, supporting biodiversity and protecting coastal communities.",
    image:
      "https://images.pexels.com/photos/4240498/pexels-photo-4240498.jpeg?auto=compress&cs=tinysrgb&w=1260",
  },
  {
    id: 5,
    name: "Mali Agroforestry Initiative",
    location: "Sikasso, Mali",
    coordinates: [11.3167, -5.6667],
    status: "Active",
    farmers: 65,
    trees: 8500,
    area: 42.5,
    co2: 153,
    startDate: "2024-08-22",
    description:
      "Integration of food crops with tree planting to improve soil fertility and provide multiple income sources for farmers.",
    image:
      "https://images.pexels.com/photos/942382/pexels-photo-942382.jpeg?auto=compress&cs=tinysrgb&w=1260",
  },
  {
    id: 6,
    name: "Kenya Community Forest",
    location: "Nakuru, Kenya",
    coordinates: [-0.3031, 36.08],
    status: "Active",
    farmers: 92,
    trees: 15000,
    area: 75,
    co2: 270,
    startDate: "2024-07-10",
    description:
      "Community-managed forest project that combines conservation with sustainable harvesting for timber and non-timber forest products.",
    image:
      "https://images.pexels.com/photos/775203/pexels-photo-775203.jpeg?auto=compress&cs=tinysrgb&w=1260",
  },
];

const ProjectsPage = () => {
  const { connected } = useWallet();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
    const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter projects
  const filteredProjects = dummyProjects.filter(
    (project) =>
      (filterStatus === "All" || project.status === filterStatus) &&
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const handleOpenProject = (project) => {
    setSelectedProject(project);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "map" : "list");
  };

  if (!isMounted) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reforestation Projects</h1>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md text-sm font-medium bg-primary text-white">
              List View
            </button>
            <button className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 text-gray-700">
              Map View
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reforestation Projects</h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleViewMode}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            List View
          </button>
          <button
            onClick={toggleViewMode}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewMode === "map"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none w-full md:w-auto"
            >
              <option value="All">All Projects</option>
              <option value="Active">Active Projects</option>
              <option value="Proposed">Proposed Projects</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-2">
          Showing {filteredProjects.length} projects
        </div>
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {/* <div className="h-96">
            <MapWithNoSSR 
              projects={filteredProjects} 
              center={[8, 10]} 
              zoom={3} 
              onProjectSelect={handleOpenProject} 
            />
          </div> */}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-gray-600 text-sm">{project.location}</p>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {project.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                  <div>
                    <span className="text-gray-600 text-xs">Farmers</span>
                    <div className="font-medium">{project.farmers}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Trees</span>
                    <div className="font-medium">
                      {project.trees.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Area</span>
                    <div className="font-medium">{project.area} ha</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">CO₂ Absorbed</span>
                    <div className="font-medium">{project.co2} tons</div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenProject(project)}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <TreePine className="w-4 h-4 mr-2" />
                  View Project
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <AlertTriangle size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We couldn't find any projects matching your current filters. Try
            adjusting your search criteria.
          </p>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-64 overflow-hidden">
              <img
                src={selectedProject.image}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleCloseProject}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h2 className="text-2xl font-bold text-white">
                  {selectedProject.name}
                </h2>
                <p className="text-white/90">{selectedProject.location}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div
                  className={`text-sm px-3 py-1 rounded-full ${
                    selectedProject.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedProject.status}
                </div>
                <div className="text-sm text-gray-600">
                  Started:{" "}
                  {new Date(selectedProject.startDate).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Project Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Participating Farmers
                        </div>
                        <div className="text-xl font-bold">
                          {selectedProject.farmers}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <TreePine className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Trees Planted
                        </div>
                        <div className="text-xl font-bold">
                          {selectedProject.trees.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Leaf className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Land Area</div>
                        <div className="text-xl font-bold">
                          {selectedProject.area} hectares
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Environmental Impact
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-800">
                          CO₂ Absorbed
                        </span>
                        <span className="text-xl font-bold text-green-800">
                          {selectedProject.co2} tons
                        </span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div
                          className="bg-green-600 rounded-full h-2"
                          style={{
                            width: `${Math.min(
                              100,
                              (selectedProject.co2 / 500) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-green-700 mt-2">
                        Equivalent to removing{" "}
                        {Math.round(selectedProject.co2 * 0.21)} cars from the
                        road for one year
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">
                        Additional Benefits
                      </h4>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li className="flex items-start">
                          <Leaf className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Improved soil quality and reduced erosion</span>
                        </li>
                        <li className="flex items-start">
                          <Leaf className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Enhanced water retention and groundwater recharge
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Leaf className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            Increased biodiversity and habitat creation
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-2">
                        Social Impact
                      </h4>
                      <p className="text-sm text-amber-700">
                        This project has created approximately
                        <span className="font-bold">
                          {" "}
                          {Math.round(selectedProject.farmers * 1.5)} jobs
                        </span>
                        and improved livelihoods for
                        <span className="font-bold">
                          {" "}
                          {Math.round(selectedProject.farmers * 4)} people
                        </span>
                        in the local community.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                {/* <h3 className="text-lg font-semibold mb-4">Project Location</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapWithNoSSR 
                    projects={[selectedProject]} 
                    center={selectedProject.coordinates} 
                    zoom={10} 
                    scrollWheelZoom={false} 
                  />
                </div> */}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                {connected && selectedProject.status === "Active" && (
                  <button className="btn-primary flex items-center justify-center">
                    <Leaf className="w-5 h-5 mr-2" />
                    Support This Project
                  </button>
                )}
                <button onClick={handleCloseProject} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
