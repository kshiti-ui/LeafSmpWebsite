import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Users, Clock, Trophy } from "lucide-react";

interface ServerStatus {
  online: boolean;
  playerCount: number;
  maxPlayers: number;
}

export default function ServerStats() {
  const { data: serverStatus, isLoading } = useQuery<ServerStatus>({
    queryKey: ["/api/server/live-status"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const stats = [
    {
      icon: Users,
      value: isLoading ? "..." : serverStatus?.playerCount?.toString() || "0",
      label: "Players Online",
      color: "leaf-green",
      bgGradient: "from-leaf-green to-green-600"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Server Uptime",
      color: "leaf-orange",
      bgGradient: "from-leaf-orange to-orange-600"
    },
    {
      icon: Trophy,
      value: "12",
      label: "Current Season",
      color: "leaf-purple",
      bgGradient: "from-leaf-purple to-purple-600"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4 text-white">Server Statistics</h2>
          <p className="text-gray-400">Real-time information about LeafSMP</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-${stat.color}/20 text-center transition-all duration-300 hover:border-${stat.color}/50 hover:shadow-lg hover:shadow-${stat.color}/10`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className={`text-3xl font-bold text-${stat.color} mb-2`}>
                  {stat.value}
                </h3>
                <p className="text-gray-400">{stat.label}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
