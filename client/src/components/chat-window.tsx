
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Image, X, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@shared/schema";

interface ChatWindowProps {
  ticketId: number;
  isAdmin?: boolean;
  adminName?: string;
  userNames?: { minecraft: string; discord: string };
}

export function ChatWindow({ ticketId, isAdmin = false, adminName, userNames }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: [`/api/tickets/${ticketId}/messages`],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (isAdmin) {
        const token = localStorage.getItem("adminToken");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(`/api/tickets/${ticketId}/messages`, { headers });
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; imageUrl?: string }) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (isAdmin) {
        const token = localStorage.getItem("adminToken");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          sender: isAdmin ? "admin" : "user",
          senderName: isAdmin ? adminName : userNames?.minecraft || "User",
          message: data.message,
          imageUrl: data.imageUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tickets/${ticketId}/messages`] });
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      
      // Convert to base64 for demo purposes
      const reader = new FileReader();
      return new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          fetch("/api/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageData: reader.result }),
          })
            .then(res => res.json())
            .then(data => resolve(data.imageUrl))
            .catch(reject);
        };
        reader.readAsDataURL(file);
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Error", description: "Image size must be less than 5MB", variant: "destructive" });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    try {
      let imageUrl: string | undefined;
      
      if (selectedImage) {
        imageUrl = await uploadImageMutation.mutateAsync(selectedImage);
      }

      await sendMessageMutation.mutateAsync({
        message: message.trim(),
        imageUrl,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-3 p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === (isAdmin ? "admin" : "user") ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === (isAdmin ? "admin" : "user")
                      ? "bg-leaf-purple text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        msg.sender === "admin" ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {msg.sender === "admin" ? "Admin" : "User"}
                    </Badge>
                    <span className="text-xs opacity-70">{msg.senderName}</span>
                  </div>
                  
                  {msg.message && <p className="text-sm">{msg.message}</p>}
                  
                  {msg.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={msg.imageUrl}
                        alt="Shared image"
                        className="max-w-full h-auto rounded border"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 mt-2 text-xs opacity-60">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(msg.createdAt), "HH:mm")}</span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-auto rounded border max-h-32"
            />
            <Button
              onClick={removeImage}
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Message Input */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="bg-gray-700 border-gray-600 text-white resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Image className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="bg-leaf-purple hover:bg-purple-700"
              disabled={sendMessageMutation.isPending || (!message.trim() && !selectedImage)}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
