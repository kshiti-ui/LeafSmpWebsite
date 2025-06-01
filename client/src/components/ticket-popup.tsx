
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

  const handleSubmit = async () => {
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
        }),
      });

      if (response.ok) {
        const ticket = await response.json();
        toast({
          title: "Ticket Created!",
          description: `Your ticket #${ticket.ticketNumber} has been submitted successfully.`,
        });
        setMinecraftUsername("");
        setDiscordUsername("");
        onClose();
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-leaf-purple">
            Purchase {selectedRank} Rank
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="minecraft" className="text-sm font-medium">
              Minecraft Username
            </Label>
            <Input
              id="minecraft"
              placeholder="Enter your Minecraft username"
              value={minecraftUsername}
              onChange={(e) => setMinecraftUsername(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="discord" className="text-sm font-medium">
              Discord Username
            </Label>
            <Input
              id="discord"
              placeholder="Enter your Discord username"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-leaf-purple hover:bg-leaf-purple/90"
            >
              {isSubmitting ? "Creating..." : "Confirm Purchase"}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
