// AI Chatbot Types based on API documentation

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: ChatSource[];
  isLoading?: boolean;
}

export interface ChatSource {
  id: string;
  type: "report" | "faq" | "sop" | "facilities";
  score: number;
  content: string;
  metadata: {
    title?: string;
    category?: string;
    location?: string;
    status?: string;
    building?: string;
    floor?: number;
    campus?: string;
    priority?: string;
    createdAt?: string;
  };
}

export interface ChatRequest {
  query: string;
  conversationId?: string;
  sourceTypes?: ("report" | "faq" | "sop" | "facilities")[];
}

// API wrapper response (outer layer)
export interface ApiWrapperResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Chat response (inner data)
export interface ChatResponseData {
  success: boolean;
  data: {
    answer: string;
    sources: ChatSource[];
    conversationId?: string;
  };
  meta?: {
    usage: {
      promptTokens: number;
      completionTokens: number;
    };
    timestamp: string;
  };
}

export interface ChatResponse {
  success: boolean;
  data: {
    answer: string;
    sources: ChatSource[];
    conversationId?: string;
  };
  meta?: {
    usage: {
      promptTokens: number;
      completionTokens: number;
    };
    timestamp: string;
  };
}

export interface FAQResponse {
  success: boolean;
  data: {
    answer: string;
    sources: ChatSource[];
  };
}

export interface SimilarReportsResponse {
  success: boolean;
  data: {
    answer: string;
    sources: ChatSource[];
  };
}

export interface ClassifyReportRequest {
  description: string;
  location?: string;
}

export interface ClassifyReportResponse {
  success: boolean;
  data: {
    category: ReportCategory;
    priority: ReportPriority;
    suggestedStaffSkills: string[];
    estimatedDuration: number;
    reasoning: string;
    confidence: number;
  };
  message: string;
}

export type ReportCategory =
  | "DIEN"
  | "NUOC"
  | "MANG"
  | "NOI_THAT"
  | "DIEU_HOA"
  | "VE_SINH"
  | "AN_NINH"
  | "KHAC";

export type ReportPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface SuggestPriorityRequest {
  description: string;
}

export interface SuggestPriorityResponse {
  success: boolean;
  data: {
    priority: ReportPriority;
  };
  message: string;
}

// Chat tab types for UI
export type ChatTab =
  | "general"
  | "faq"
  | "facilities"
  | "sop"
  | "similar-reports";

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
