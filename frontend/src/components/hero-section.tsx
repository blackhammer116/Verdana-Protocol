
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4)",
        }}
      />
      <div className="relative z-10 container flex flex-col items-center justify-center min-h-[80vh] py-24 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl">
          Get Paid for Planting Trees On-chain
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
        Verdana Protocol uses blockchain technology to reward farmers for capturing CO₂ through tree planting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="text-lg bg-primary hover:bg-primary/90"
            asChild
          >
            <Link href="/register">Register as a Farmer</Link>
          </Button>
          <Button 
            size="lg" 
            className="text-lg bg-white text-primary hover:bg-white/90"
            variant="outline"
            asChild
          >
            <Link href="/marketplace">Carbon Marketplace</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}