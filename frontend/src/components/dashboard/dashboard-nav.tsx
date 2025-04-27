"use client";

import { Trees as Tree } from "lucide-react";
import Link from "next/link";
import WalletConnect from "@/components/wallet-connect";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardNav() {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Tree className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Vardano Protocol</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <WalletConnect />
        </div>
      </nav>
    </div>
  );
}