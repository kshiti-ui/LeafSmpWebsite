import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ChatWindow } from "@/components/chat-window";

interface Ticket {
  id: string;
  ticketNumber: number;
  minecraftUsername: string;
  discordUsername: string;
  status: string;
}

function Admin() {
  const [selectedTicketForChat, setSelectedTicketForChat] = useState<Ticket | null>(null);
  const [adminName, setAdminName] = useState<string>("");

  return (
    <div className="p-4">
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
                isAdmin={true}
                adminName={adminName}
                userNames={{
                  minecraft: selectedTicketForChat.minecraftUsername,
                  discord: selectedTicketForChat.discordUsername,
                }}
                ticketStatus={selectedTicketForChat.status}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;