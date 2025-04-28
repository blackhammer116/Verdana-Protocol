"use client";

import { useWallet } from "@meshsdk/react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, TreePine } from "lucide-react";
import Link from "next/link";
import WalletConnect from "@/components/wallet-connect";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connected } = useWallet();
  const pathname = usePathname();
  const router = useRouter();

  const isActiveRoute = (path: string) => {
    return pathname === path;
  };
  useEffect(() => {
    if (connected && pathname === "/") {
      router.push('/register');
    }
  }, [connected, router]);
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
              Verdana Protocol
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium ${
                    isActiveRoute(link.path)
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary transition-colors duration-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center">
              <WalletConnect />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white pb-3">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium ${
                  isActiveRoute(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;