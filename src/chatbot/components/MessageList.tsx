import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Bot, User, ExternalLink } from "lucide-react";
import type { ChatMessage } from "../types/chatbot.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <Bot className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
          <p className="text-xs text-muted-foreground">
            Chào bạn! Tôi có thể giúp gì cho bạn?
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-3 overflow-y-auto">
      <div className="space-y-3" ref={scrollRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {message.role === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5" />
              )}
            </div>

            {/* Message Content */}
            <div
              className={`flex-1 max-w-[80%] space-y-2 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-xs">Đang suy nghĩ...</span>
                  </div>
                ) : message.role === "assistant" ? (
                  <div className="text-xs leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0 text-gray-900">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-gray-700">{children}</em>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-2 space-y-1 text-gray-900">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-900">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="ml-2 text-gray-900">{children}</li>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-sm font-bold mb-2 text-gray-900">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xs font-bold mb-2 text-gray-900">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xs font-semibold mb-1 text-gray-900">
                            {children}
                          </h3>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-[10px] font-mono">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-200 text-gray-800 p-2 rounded text-[10px] font-mono overflow-x-auto mb-2">
                            {children}
                          </pre>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-gray-400 pl-2 italic mb-2 text-gray-700">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}
              </div>

              {/* Timestamp */}
              <p className="text-[10px] text-muted-foreground px-1">
                {format(message.timestamp, "HH:mm", { locale: vi })}
              </p>

              {/* Sources (only for assistant) */}
              {message.role === "assistant" &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    <p className="text-[10px] text-muted-foreground px-1">
                      Nguồn tham khảo:
                    </p>
                    {message.sources.slice(0, 3).map((source, idx) => (
                      <Card
                        key={`${source.id}-${idx}`}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {getSourceTypeLabel(source.type)}
                              </Badge>
                              {source.metadata.category && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {source.metadata.category}
                                </Badge>
                              )}
                              <span className="text-[10px] text-muted-foreground">
                                {Math.round(source.score * 100)}%
                              </span>
                            </div>
                            {source.metadata.title && (
                              <p className="text-xs font-medium line-clamp-1">
                                {source.metadata.title}
                              </p>
                            )}
                            <p className="text-[11px] text-muted-foreground line-clamp-2">
                              {source.content}
                            </p>
                            {source.metadata.location && (
                              <p className="text-[10px] text-muted-foreground">
                                📍 {source.metadata.location}
                              </p>
                            )}
                          </div>
                          <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
