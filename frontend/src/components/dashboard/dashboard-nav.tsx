"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "../ui/button";

export default function DashboardNav() {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-start">
        <div className="flex items-center justify-start gap-2">
          {/* <Link href="/" className="flex items-center gap-2">
            <Tree className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Verdana Protocol</span>
          </Link> */}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/verify" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            <Button>Tree Verification</Button>
          </Link>
          <ModeToggle />
          {/* <WalletConnect /> */}
        </div>
      </nav>
    </div>
  );
}
