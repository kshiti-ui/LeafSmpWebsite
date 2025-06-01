
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface TicketPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRank: string;
}

export function TicketPopup({ isOpen, onClose, selectedRank }: TicketPopupProps) {
  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!minecraftUsername.trim() || !discordUsername.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          minecraftUsername: minecraftUsername.trim(),
          discordUsername: discordUsername.trim(),
          selectedRank,
          status: "open",
          priority: "normal",
          category: "rank_purchase",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      const ticket = await response.json();

      toast({
        title: "Ticket Created!",
        description: `Your ticket ${ticket.ticketNumber} has been created successfully. Please check your tickets page for updates.`,
      });

      // Reset form and close popup
      setMinecraftUsername("");
      setDiscordUsername("");
      onClose();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setMinecraftUsername("");
    setDiscordUsername("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Purchase {selectedRank} Rank
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="minecraft" className="text-gray-300">
              Minecraft Username *
            </Label>
            <Input
              id="minecraft"
              type="text"
              placeholder="Enter your Minecraft username"
              value={minecraftUsername}
              onChange={(e) => setMinecraftUsername(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discord" className="text-gray-300">
              Discord Username *
            </Label>
            <Input
              id="discord"
              type="text"
              placeholder="Enter your Discord username"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              required
            />
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-300">
              <strong>Selected Rank:</strong> {selectedRank}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              After submitting this ticket, our staff will review your request and contact you on Discord with payment instructions.
            </p>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-leaf-green hover:bg-leaf-green/90 text-white"
            >
              {isSubmitting ? "Creating..." : "Confirm"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
