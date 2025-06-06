import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Leaf, Users, ExternalLink, BookOpen, Ticket } from "lucide-react";
import { Link } from "wouter";

interface ServerStatus {
  online: boolean;
  playerCount: number;
  maxPlayers: number;
}

export default function Header() {
  const { data: serverStatus, isLoading } = useQuery<ServerStatus>({
    queryKey: ["/api/server/live-status"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <header className="relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-leaf-green/10 via-leaf-purple/10 to-leaf-orange/10 animate-pulse-slow" />

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-leaf-green to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <Leaf className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-leaf-orange tracking-wide">LEAF SMP</h1>
                <p className="text-xs text-leaf-green font-semibold">SEASON 12 LIVE</p>
              </div>
            </div>
          </div>

          {/* Navigation Links & Discord */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link href="/tickets">
                <Button variant="ghost" size="sm" className="text-leaf-green hover:text-leaf-orange">
                  <Ticket className="w-4 h-4 mr-2" />
                  My Tickets
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-leaf-purple hover:text-leaf-orange">
                  <Users className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-leaf-green/30">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-leaf-green rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  {isLoading ? "..." : serverStatus?.playerCount || 0}
                </span>
                <span className="text-xs text-gray-400">Players Online</span>
              </div>
            </div>

            {/* Rules Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-leaf-green/30 hover:border-leaf-green">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Rules</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-leaf-green">LEAF SMP RULES</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <p className="text-gray-300">
                    Rules for you all and you should follow these rules to not get banned:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-card/50 p-4 rounded-lg border-l-4 border-red-500">
                      <h3 className="font-bold text-red-400 mb-2">Hacking is Banned</h3>
                      <p className="text-gray-300">Hacking is banned and it's unfair for everyone. If you use it, you will get banned.</p>
                    </div>

                    <div className="bg-card/50 p-4 rounded-lg border-l-4 border-red-500">
                      <h3 className="font-bold text-red-400 mb-2">Duping or Lag Machines</h3>
                      <p className="text-gray-300">Duping or making lag machines can lead to ban.</p>
                    </div>

                    <div className="bg-card/50 p-4 rounded-lg border-l-4 border-yellow-500">
                      <h3 className="font-bold text-yellow-400 mb-2">No 18+ Content Posting</h3>
                      <p className="text-gray-300">No any type of 18+ things in Minecraft server and in Discord can lead to timeout or ban.</p>
                    </div>

                    <div className="bg-card/50 p-4 rounded-lg border-l-4 border-yellow-500">
                      <h3 className="font-bold text-yellow-400 mb-2">Inappropriate Jokes or Memes</h3>
                      <p className="text-gray-300">Dark humor can lead to ban. Don't try.</p>
                    </div>

                    <div className="bg-card/50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-bold text-blue-400 mb-2">No Server or Product Promotions</h3>
                      <p className="text-gray-300">Promoting other servers, products, or services within the server or Discord is not allowed.</p>
                    </div>

                    <div className="bg-card/50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="font-bold text-blue-400 mb-2">One Account per Player</h3>
                      <p className="text-gray-300">Using multiple accounts to gain unfair advantages is prohibited.</p>
                    </div>

                    <div className="bg-card/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-green-400 mb-2">Follow Staff Instructions</h3>
                      <p className="text-gray-300">Staff decisions are final; arguing or disrespecting staff may lead to penalties.</p>
                    </div>

                    <div className="bg-card/50 p-4 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-bold text-green-400 mb-2">No Exploiting Glitches</h3>
                      <p className="text-gray-300">Abusing game glitches or bugs for personal gain is not allowed.</p>
                    </div>

                    <div className="bg-card/50 p-4 rounded-lg border-l-4 border-leaf-purple">
                      <h3 className="font-bold text-leaf-purple mb-2">Keep Gender Equality</h3>
                      <p className="text-gray-300">Treat every player with equal respect.</p>
                    </div>
                  </div>

                  <div className="text-center pt-6 border-t border-gray-800">
                    <p className="text-leaf-green font-bold">Team Regards -</p>
                    <p className="text-leaf-orange font-black text-xl mt-2">LEAF TEAM</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Discord Link */}
            <Button
              asChild
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
            >
              <a 
                href="https://discord.com/invite/PNWCynedgw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span className="hidden md:inline font-medium">Join Discord</span>
              </a>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}