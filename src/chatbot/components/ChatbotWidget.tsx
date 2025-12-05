import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Bot, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { ChatMessage, ChatTab } from "../types/chatbot.type";
import {
  sendChatMessage,
  searchFAQ,
  searchFacilities,
  searchSOP,
  searchSimilarReports,
} from "../api/chatbot.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";

interface ChatbotWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatbotWidget({ open, onOpenChange }: ChatbotWidgetProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => `conv-${Date.now()}`);
  const [isMinimized, setIsMinimized] = useState(false);

  // Reset messages when tab changes
  useEffect(() => {
    setMessages([]);
  }, [activeTab]);

  // Add welcome message when widget opens
  useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: getWelcomeMessage(activeTab),
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: `msg-loading-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      let response;

      switch (activeTab) {
        case "general":
          response = await sendChatMessage({
            query: content,
            conversationId,
            sourceTypes: ["report", "faq", "sop", "facilities"],
          });
          break;

        case "faq":
          response = await searchFAQ(content);
          break;

        case "facilities":
          response = await searchFacilities(content);
          break;

        case "sop":
          response = await searchSOP(content);
          break;

        case "similar-reports":
          response = await searchSimilarReports(content);
          break;

        default:
          throw new Error("Invalid tab");
      }

      // Remove loading message and add AI response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: response.data.answer,
          timestamp: new Date(),
          sources: response.data.sources,
        };
        return [...filtered, aiMessage];
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = getErrorMessage(error, "Không thể gửi tin nhắn");
      toast.error(errorMsg);

      // Remove loading message and show error
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        const errorMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: `Xin lỗi, đã có lỗi xảy ra: ${errorMsg}. Vui lòng thử lại.`,
          timestamp: new Date(),
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-8 right-22 z-40 w-[400px] flex flex-col bg-white rounded-lg shadow-2xl border border-gray-200"
        style={{
          height: isMinimized ? "auto" : "500px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Trợ lý AI</h3>
              <p className="text-xs text-blue-100">Hệ thống CSVC IUH</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-white/20"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content - Only show when not minimized */}
        {!isMinimized && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ChatTab)}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="mx-3 mt-2 grid grid-cols-5 h-auto p-1">
              <TabsTrigger value="general" className="text-xs py-1.5">
                Tổng quát
              </TabsTrigger>
              <TabsTrigger value="faq" className="text-xs py-1.5">
                FAQ
              </TabsTrigger>
              <TabsTrigger value="facilities" className="text-xs py-1.5">
                CSVC
              </TabsTrigger>
              <TabsTrigger value="sop" className="text-xs py-1.5">
                Quy trình
              </TabsTrigger>
              <TabsTrigger value="similar-reports" className="text-xs py-1.5">
                Tương tự
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value={activeTab}
              className="flex-1 flex flex-col m-0 overflow-hidden h-full"
            >
              <div className="flex-1 flex flex-col overflow-hidden">
                <MessageList messages={messages} />
                <ChatInput
                  onSend={handleSendMessage}
                  isLoading={isLoading}
                  placeholder={getPlaceholder(activeTab)}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Helper functions
function getWelcomeMessage(tab: ChatTab): string {
  const messages: Record<ChatTab, string> = {
    general:
      "Xin chào! Tôi là trợ lý AI của hệ thống quản lý cơ sở vật chất IUH. Tôi có thể giúp bạn tìm kiếm thông tin, hướng dẫn quy trình, hoặc tra cứu báo cáo. Bạn cần tôi giúp gì?",
    faq: "Tôi sẽ giúp bạn tìm câu trả lời cho các câu hỏi thường gặp. Hãy đặt câu hỏi của bạn!",
    facilities:
      "Tôi sẽ giúp bạn tìm thông tin về cơ sở vật chất như vị trí phòng, tòa nhà, khu vực. Bạn muốn tìm gì?",
    sop: "Tôi sẽ hướng dẫn bạn về quy trình xử lý các sự cố. Bạn cần hướng dẫn về vấn đề gì?",
    "similar-reports":
      "Tôi sẽ tìm các báo cáo tương tự với mô tả của bạn. Hãy mô tả sự cố bạn gặp phải!",
  };
  return messages[tab];
}

function getPlaceholder(tab: ChatTab): string {
  const placeholders: Record<ChatTab, string> = {
    general: "Nhập câu hỏi của bạn...",
    faq: "VD: Làm sao để báo cáo sự cố?",
    facilities: "VD: Phòng máy tính ở đâu?",
    sop: "VD: Quy trình xử lý sự cố điện",
    "similar-reports": "VD: Điện giật ở nhà vệ sinh",
  };
  return placeholders[tab];
}
