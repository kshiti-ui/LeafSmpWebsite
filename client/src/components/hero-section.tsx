import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Server, Wifi, Play, Info } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Main Logo and Branding */}
        <div className="mb-8 animate-float">
          <Card className="inline-flex items-center space-x-4 bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-leaf-green/20">
            {/* Enhanced Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-leaf-green via-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-2xl animate-glow">
              <Leaf className="text-white text-3xl" />
            </div>
            <div className="text-left">
              <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-leaf-orange via-yellow-400 to-leaf-orange">
                LEAFSMP
              </h1>
              <p className="text-xl md:text-2xl text-leaf-green font-bold tracking-wider mt-2">
                SEASON 12 LIVE
              </p>
            </div>
          </Card>
        </div>

        {/* Server Information */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Join the Ultimate Minecraft Experience
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <Card className="bg-card/80 backdrop-blur-sm rounded-lg px-6 py-4 border border-leaf-purple/30">
              <div className="flex items-center space-x-3">
                <Server className="text-leaf-purple text-xl" />
                <div>
                  <p className="text-sm text-gray-300">Server IP</p>
                  <p className="font-bold text-lg">play.leafsmp.org</p>
                </div>
              </div>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm rounded-lg px-6 py-4 border border-leaf-orange/30">
              <div className="flex items-center space-x-3">
                <Wifi className="text-leaf-orange text-xl" />
                <div>
                  <p className="text-sm text-gray-300">Port</p>
                  <p className="font-bold text-lg">25590</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-leaf-green to-green-500 hover:from-green-500 hover:to-leaf-green text-black font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <a 
              href="https://discord.com/invite/PNWCynedgw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3"
            >
              <Play className="text-xl" />
              <span>Start Your Adventure</span>
            </a>
          </Button>
          <p className="text-sm text-gray-400 flex items-center justify-center space-x-1">
            <Info className="w-4 h-4" />
            <span>Purchase ranks through Discord for the best experience</span>
          </p>
        </div>
      </div>
    </section>
  );
}
