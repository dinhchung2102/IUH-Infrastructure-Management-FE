import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Bot } from "lucide-react";

interface ChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatbotDialog({ open, onOpenChange }: ChatbotDialogProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => `conv-${Date.now()}`);

  // Reset messages when tab changes
  useEffect(() => {
    setMessages([]);
  }, [activeTab]);

  // Add welcome message when dialog opens
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            Trợ lý AI - Hệ thống CSVC
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ChatTab)}
          className="flex-1 flex flex-col"
        >
          <TabsList className="mx-6 mt-2">
            <TabsTrigger value="general">Tổng quát</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="facilities">Cơ sở vật chất</TabsTrigger>
            <TabsTrigger value="sop">Quy trình</TabsTrigger>
            <TabsTrigger value="similar-reports">Báo cáo tương tự</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="flex-1 flex flex-col m-0">
            <MessageList messages={messages} />
            <ChatInput
              onSend={handleSendMessage}
              isLoading={isLoading}
              placeholder={getPlaceholder(activeTab)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
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

