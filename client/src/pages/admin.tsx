
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Calendar, Clock, User, MessageSquare, Filter } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Ticket } from "@shared/schema";

type ViewMode = "grid" | "list";
type SortBy = "created_date" | "priority" | "status";

export default function Admin() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("created_date");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [editingTicket, setEditingTicket] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const { toast } = useToast();

  const { data: tickets = [], refetch } = useQuery<Ticket[]>({
    queryKey: ["/api/admin/tickets"],
    queryFn: async () => {
      const response = await fetch("/api/admin/tickets");
      if (!response.ok) throw new Error("Failed to fetch tickets");
      return response.json();
    },
  });

  const filteredAndSortedTickets = tickets
    .filter(ticket => statusFilter === "all" || ticket.status === statusFilter)
    .filter(ticket => priorityFilter === "all" || ticket.priority === priorityFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "created_date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const updateTicket = async (ticketId: string, updates: { status?: string; adminNotes?: string }) => {
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast({ title: "Success", description: "Ticket updated successfully" });
        refetch();
        setEditingTicket(null);
      } else {
        throw new Error("Failed to update ticket");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update ticket", variant: "destructive" });
    }
  };

  const startEditing = (ticket: Ticket) => {
    setEditingTicket(ticket.id.toString());
    setAdminNotes(ticket.adminNotes || "");
    setTicketStatus(ticket.status);
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

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <Card className="bg-gray-800/50 border-gray-700">
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
          <div className="text-right text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(ticket.createdAt), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(ticket.createdAt), "HH:mm")}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Minecraft Username</p>
              <p className="text-white flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{ticket.minecraftUsername}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Discord Username</p>
              <p className="text-white flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{ticket.discordUsername}</span>
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Selected Rank</p>
            <p className="text-white font-medium">{ticket.selectedRank}</p>
          </div>

          {editingTicket === ticket.id.toString() ? (
            <div className="space-y-3 border-t border-gray-600 pt-3">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Status</label>
                <Select value={ticketStatus} onValueChange={setTicketStatus}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Add admin notes..."
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => updateTicket(ticket.id.toString(), { status: ticketStatus, adminNotes })}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditingTicket(null)}
                  variant="outline"
                  className="border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {ticket.adminNotes && (
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-300 mb-1">Admin Notes:</p>
                  <p className="text-gray-400 text-sm">{ticket.adminNotes}</p>
                </div>
              )}
              <Button
                onClick={() => startEditing(ticket)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Edit Ticket
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Portal</h1>
            <p className="text-gray-300">Manage and track all rank purchase tickets</p>
          </div>

          {/* Controls */}
          <div className="mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Filters:</span>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                <SelectTrigger className="w-36 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_date">Created Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2 ml-auto">
                <Button
                  onClick={() => setViewMode("grid")}
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  className={viewMode === "grid" ? "bg-leaf-purple" : "border-gray-600"}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode("list")}
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  className={viewMode === "list" ? "bg-leaf-purple" : "border-gray-600"}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-white">{tickets.length}</p>
                <p className="text-gray-400 text-sm">Total Tickets</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {tickets.filter(t => t.status === "open").length}
                </p>
                <p className="text-gray-400 text-sm">Open</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {tickets.filter(t => t.status === "in_progress").length}
                </p>
                <p className="text-gray-400 text-sm">In Progress</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-400">
                  {tickets.filter(t => t.status === "closed").length}
                </p>
                <p className="text-gray-400 text-sm">Closed</p>
              </CardContent>
            </Card>
          </div>

          {/* Tickets */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : "space-y-4"}>
            {filteredAndSortedTickets.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 col-span-full">
                <CardContent className="text-center py-8">
                  <p className="text-gray-400">No tickets found matching your filters.</p>
                </CardContent>
              </Card>
            ) : (
              filteredAndSortedTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
