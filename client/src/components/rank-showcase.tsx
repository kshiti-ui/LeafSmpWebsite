` tags.

```typescript
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Mask, Skull, Infinity, Info, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TicketPopup } from "./ticket-popup";
import type { RankTier } from "@shared/schema";

export function RankShowcase() {
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

  const getRankIcon = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "knight": return Crown;
      case "warrior": return Shield;
      case "assassin": return Mask;
      case "reaper": return Skull;
      case "immortal": return Infinity;
      default: return Crown;
    }
  };

  const handlePurchase = (rankName: string) => {
    setSelectedRank(rankName);
    setShowTicketPopup(true);
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="container mx-auto text-center">
          <div className="text-white">Loading ranks...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Rank</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Unlock exclusive perks, abilities, and status with our premium ranks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ranks.map((rank, index) => {
            const IconComponent = getRankIcon(rank.name);
            return (
              <Card
                key={rank.id}
                className={`relative overflow-hidden bg-gradient-to-br ${rank.gradient} border-2 border-opacity-50 hover:border-opacity-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  opacity: 0,
                  transform: "translateY(50px)",
                  animation: "fadeInUp 0.8s ease-out forwards",
                }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="relative p-6 text-center">
                  <div className="mb-4">
                    <IconComponent className="w-16 h-16 mx-auto text-white drop-shadow-lg" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{rank.name}</h3>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">${rank.price}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {rank.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-white/90">
                        <Check className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {rank.badge && (
                    <div className="mb-4">
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                        <Info className="w-3 h-3 mr-1" />
                        {rank.badge}
                      </Badge>
                    </div>
                  )}

                  <Button
                    onClick={() => handlePurchase(rank.name)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    Purchase Rank
                  </Button>
                </div>
              </Card>
            );
          })}
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