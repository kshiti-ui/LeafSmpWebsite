import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Mask, Skull, Infinity, Info, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TicketPopup } from "./ticket-popup";
import type { RankTier } from "@shared/schema";

export default function RankShowcase() {
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const [selectedRank, setSelectedRank] = useState("");

  const { data: ranks = [], isLoading } = useQuery<RankTier[]>({
    queryKey: ["/api/ranks"],
    queryFn: async () => {
      const response = await fetch("/api/ranks");
      if (!response.ok) throw new Error("Failed to fetch ranks");
      return response.json();
    },
  });

  const handleRankSelect = (rankName: string) => {
    setSelectedRank(rankName);
    setShowTicketPopup(true);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "mask":
        return Shield;
      case "crown":
        return Crown;
      case "skull":
        return Skull;
      case "infinity":
        return Infinity;
      default:
        return Shield;
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-card/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-muted rounded w-96 mx-auto" />
              <div className="h-6 bg-muted rounded w-64 mx-auto" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-96 bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const getRankColorClasses = (rankId: string) => {
    switch (rankId) {
      case "ninja":
        return {
          border: "border-green-500/30 hover:border-green-500",
          shadow: "hover:shadow-green-500/20",
          badge: "bg-green-500 text-black",
          icon: "text-green-400",
          button: "bg-green-500 hover:bg-green-400 text-black",
          check: "text-green-400"
        };
      case "master":
        return {
          border: "border-blue-500/30 hover:border-blue-500",
          shadow: "hover:shadow-blue-500/20",
          badge: "bg-blue-500 text-white",
          icon: "text-blue-400",
          button: "bg-blue-500 hover:bg-blue-400 text-white",
          check: "text-blue-400"
        };
      case "deadliest":
        return {
          border: "border-leaf-purple/30 hover:border-leaf-purple",
          shadow: "hover:shadow-leaf-purple/20",
          badge: "bg-leaf-purple text-white",
          icon: "text-leaf-purple",
          button: "bg-leaf-purple hover:bg-purple-600 text-white",
          check: "text-leaf-purple"
        };
      case "immortal":
        return {
          border: "border-red-500/30 hover:border-red-500",
          shadow: "hover:shadow-red-500/20",
          badge: "bg-red-500 text-white",
          icon: "text-red-400",
          button: "bg-red-500 hover:bg-red-400 text-white",
          check: "text-red-400"
        };
      default:
        return {
          border: "border-gray-500/30 hover:border-gray-500",
          shadow: "hover:shadow-gray-500/20",
          badge: "bg-gray-500 text-white",
          icon: "text-gray-400",
          button: "bg-gray-500 hover:bg-gray-400 text-white",
          check: "text-gray-400"
        };
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-card/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-leaf-green to-leaf-purple">
            Choose Your Rank
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock exclusive perks, commands, and features to enhance your LeafSMP experience
          </p>
          <div className="mt-6 flex justify-center">
            <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400">
              <Info className="w-4 h-4 mr-2" />
              All purchases handled through Discord tickets
            </Badge>
          </div>
        </div>

        {/* Rank Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ranks?.map((rank, index) => {
            const colorClasses = getRankColorClasses(rank.id);
            const isPopular = rank.id === "immortal";
            const IconComponent = getIconComponent(rank.icon);

            return (
              <Card
                key={rank.id}
                className={`group relative bg-card rounded-2xl ${colorClasses.border} overflow-hidden transition-all duration-300 hover:shadow-2xl ${colorClasses.shadow} hover:-translate-y-2`}
                style={{
                  opacity: 0,
                  transform: "translateY(20px)",
                  animation: `fadeInUp 0.6s ease ${index * 0.1}s forwards`
                }}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}

                {/* Price Badge */}
                <div className={`absolute top-4 right-4 ${colorClasses.badge} px-3 py-1 rounded-full text-sm font-bold`}>
                  ₹{rank.price}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${rank.id === "ninja" ? "from-green-400 to-green-600" : rank.id === "master" ? "from-blue-400 to-blue-600" : rank.id === "deadliest" ? "from-leaf-purple to-purple-600" : "from-red-400 to-red-600"} rounded-xl flex items-center justify-center ${isPopular ? "animate-pulse" : ""}`}>
                      <IconComponent className="text-white text-2xl w-8 h-8" />
                    </div>
                    <h3 className={`text-2xl font-black ${colorClasses.icon} mb-2`}>{rank.name}</h3>
                    <p className="text-gray-400 text-sm">{rank.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {rank.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                        <Check className={`${colorClasses.check} w-4 h-4 flex-shrink-0`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleRankSelect(rank.name)}
                    className={`w-full ${colorClasses.button} font-bold py-3 rounded-lg transition-all duration-300 transform group-hover:scale-105`}
                  >
                    Select {rank.name}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Purchase Instructions */}
        <div className="mt-16 text-center">
          <Card className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-leaf-green/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-leaf-green">How to Purchase</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-leaf-green text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">1</div>
                <p className="text-gray-300">Join our Discord server using the link above</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-leaf-green text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">2</div>
                <p className="text-gray-300">Create a support ticket in the purchase channel</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-leaf-green text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">3</div>
                <p className="text-gray-300">Specify your desired rank and Minecraft username</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-leaf-green text-black rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">4</div>
                <p className="text-gray-300">Complete payment and enjoy your new perks!</p>
              </div>
            </div>

            <div className="mt-6">
              <Button
                asChild
                className="bg-gradient-to-r from-leaf-green to-green-500 hover:from-green-500 hover:to-leaf-green text-black font-bold"
              >
                <a 
                  href="https://discord.com/invite/PNWCynedgw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Open Discord</span>
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <TicketPopup
        isOpen={showTicketPopup}
        onClose={() => setShowTicketPopup(false)}
        selectedRank={selectedRank}
      />
    </section>
  );
}