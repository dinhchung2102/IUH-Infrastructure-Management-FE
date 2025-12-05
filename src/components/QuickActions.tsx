import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Phone, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ChatbotDialog } from "@/chatbot/components";

export default function QuickActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 300 && currentScrollY < lastScrollY) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePhoneClick = () => {
    // TODO: Implement phone call functionality
    console.log("Phone clicked");
  };

  const handleChatClick = () => {
    setChatbotOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        {/* Phone Button - Always visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.1,
            ease: "easeOut",
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handlePhoneClick}
                size="icon"
                className="size-14 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-all bg-green-500 hover:bg-green-600 text-white"
                aria-label="Gọi điện"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                >
                  <Phone className="size-6" />
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Gọi điện hỗ trợ</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Chat Button - Always visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.2,
            ease: "easeOut",
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleChatClick}
                size="icon"
                className="size-14 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-all bg-blue-500 hover:bg-blue-600 text-white relative"
                aria-label="Chat"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <MessageCircle className="size-6" />
                </motion.div>
                {/* Notification dot */}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Chat với chúng tôi</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Scroll to Top Button - Show on scroll */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0,
                y: 20,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={scrollToTop}
                    size="icon"
                    className="size-14 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
                    aria-label="Lên đầu trang"
                  >
                    <motion.div
                      animate={{ y: [-2, 2, -2] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ChevronUp className="size-6" />
                    </motion.div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Lên đầu trang</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chatbot Dialog */}
      <ChatbotDialog open={chatbotOpen} onOpenChange={setChatbotOpen} />
    </TooltipProvider>
  );
}
