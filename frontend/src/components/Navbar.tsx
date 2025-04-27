import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { Menu, X, TreePine } from "lucide-react";
import Link from "next/link";
import WalletConnect from "@/components/wallet-connect";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const pathname = usePathname();

  const isActiveRoute = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Register", path: "/register" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Projects", path: "/projects" },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TreePine className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-primary">
                Vardana Protocal
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}    className={`text-sm font-medium ${
                    isActiveRoute(link.path)
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary transition-colors duration-300'
                  }`}>
                  {link.name}
                  
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center">
              <WalletConnect onConnected={() => setIsConnected(true)} />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <WalletConnect onConnected={() => setIsConnected(true)} />
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium ${
                  isActiveRoute(link.path)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary transition-colors duration-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
