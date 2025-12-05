import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Bot, User, ExternalLink } from "lucide-react";
import type { ChatMessage } from "../types/chatbot.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">
            Chào bạn! Tôi có thể giúp gì cho bạn?
          </p>
          <p className="text-xs text-muted-foreground">
            Hỏi về cơ sở vật chất, quy trình, hoặc báo cáo sự cố
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>

            {/* Message Content */}
            <div
              className={`flex-1 max-w-[80%] space-y-2 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Đang suy nghĩ...</span>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
              </div>

              {/* Timestamp */}
              <p className="text-xs text-muted-foreground px-1">
                {format(message.timestamp, "HH:mm", { locale: vi })}
              </p>

              {/* Sources (only for assistant) */}
              {message.role === "assistant" &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <p className="text-xs text-muted-foreground px-1">
                      Nguồn tham khảo:
                    </p>
                    {message.sources.map((source, idx) => (
                      <Card
                        key={`${source.id}-${idx}`}
                        className="p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getSourceTypeLabel(source.type)}
                              </Badge>
                              {source.metadata.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {source.metadata.category}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {Math.round(source.score * 100)}% liên quan
                              </span>
                            </div>
                            {source.metadata.title && (
                              <p className="text-sm font-medium">
                                {source.metadata.title}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {source.content}
                            </p>
                            {source.metadata.location && (
                              <p className="text-xs text-muted-foreground">
                                📍 {source.metadata.location}
                              </p>
                            )}
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

// Helper function to get source type label
function getSourceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    report: "Báo cáo",
    faq: "FAQ",
    sop: "Quy trình",
    facilities: "Cơ sở vật chất",
  };
  return labels[type] || type;
}

