import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, MessageSquare, Search, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ChatWindow } from "@/components/chat-window";
import type { Ticket } from "@shared/schema";

export default function Tickets() {
  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [showTickets, setShowTickets] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTicketForChat, setSelectedTicketForChat] = useState<Ticket | null>(null);
  const { toast } = useToast();

  const { data: tickets = [], refetch } = useQuery<Ticket[]>({
    queryKey: ["/api/user-tickets", minecraftUsername, discordUsername],
    queryFn: async () => {
      if (!minecraftUsername || !discordUsername) return [];
      const response = await fetch(`/api/user-tickets?minecraft=${encodeURIComponent(minecraftUsername)}&discord=${encodeURIComponent(discordUsername)}`);
      if (!response.ok) throw new Error("Failed to fetch tickets");
      return response.json();
    },
    enabled: showTickets && !!minecraftUsername && !!discordUsername,
  });

  const handleViewTickets = () => {
    if (minecraftUsername.trim() && discordUsername.trim()) {
      setShowTickets(true);
      refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-500";
      case "in_progress": return "bg-yellow-500";
      case "closed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "normal": return "bg-blue-500";
      case "low": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">My Tickets</h1>
            <p className="text-gray-300">View and track your rank purchase tickets</p>
          </div>

          {!showTickets ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Enter Your Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Minecraft Username
                  </label>
                  <Input
                    placeholder="Enter your Minecraft username"
                    value={minecraftUsername}
                    onChange={(e) => setMinecraftUsername(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Discord Username
                  </label>
                  <Input
                    placeholder="Enter your Discord username"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button
                  onClick={handleViewTickets}
                  className="w-full bg-leaf-purple hover:bg-leaf-purple/90"
                  disabled={!minecraftUsername.trim() || !discordUsername.trim()}
                >
                  View My Tickets
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Welcome back!</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{minecraftUsername}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{discordUsername}</span>
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowTickets(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Change User
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {tickets.length === 0 ? (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="text-center py-8">
                      <p className="text-gray-400">No tickets found.</p>
                    </CardContent>
                  </Card>
                ) : (
                  tickets.map((ticket) => (
                    <Card key={ticket.id} className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center space-x-2">
                            <span>#{ticket.ticketNumber}</span>
                            <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                              {ticket.status.toUpperCase()}
                            </Badge>
                            <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                              {ticket.priority.toUpperCase()}
                            </Badge>
                          </CardTitle>
                          <div className="text-right">
                            <div className="text-sm text-gray-400 mb-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(ticket.createdAt), "MMM dd, yyyy")}</span>
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                <Clock className="w-4 h-4" />
                                <span>{format(new Date(ticket.createdAt), "HH:mm")}</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => setSelectedTicketForChat(ticket)}
                              size="sm"
                              className="bg-leaf-purple hover:bg-purple-700"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Chat
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-white">
                            <span className="font-medium">Rank:</span> {ticket.selectedRank}
                          </p>
                          <p className="text-white">
                            <span className="font-medium">Category:</span> {ticket.category.replace("_", " ").toUpperCase()}
                          </p>
                          {ticket.adminNotes && (
                            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                              <p className="text-sm font-medium text-gray-300 mb-1">Admin Notes:</p>
                              <p className="text-gray-400 text-sm">{ticket.adminNotes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {selectedTicketForChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Chat - Ticket #{selectedTicketForChat.ticketNumber}
              </h3>
              <Button
                onClick={() => setSelectedTicketForChat(null)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1">
              <ChatWindow
                ticketId={selectedTicketForChat.id}
                isAdmin={false}
                userNames={{
                  minecraft: selectedTicketForChat.minecraftUsername,
                  discord: selectedTicketForChat.discordUsername,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}