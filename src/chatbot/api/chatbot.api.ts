import api from "@/lib/axios";
import type {
  ChatRequest,
  ChatResponse,
  ChatResponseData,
  ApiWrapperResponse,
  FAQResponse,
  SimilarReportsResponse,
  ClassifyReportRequest,
  ClassifyReportResponse,
  SuggestPriorityRequest,
  SuggestPriorityResponse,
} from "../types/chatbot.type";

/**
 * General Chat with RAG
 * Search across all knowledge base
 */
export const sendChatMessage = async (
  request: ChatRequest
): Promise<ChatResponse> => {
  const response = await api.post<ApiWrapperResponse<ChatResponseData>>(
    "/ai/chat",
    request
  );
  console.log("[API: CHAT - Full Response]:", response.data);

  // Extract the actual chat data from nested structure
  const chatData = response.data.data;
  return {
    success: chatData.success,
    data: chatData.data,
    meta: chatData.meta,
  };
};

/**
 * Search FAQ
 * Find frequently asked questions
 */
export const searchFAQ = async (query: string): Promise<FAQResponse> => {
  const response = await api.get<ApiWrapperResponse<FAQResponse>>(
    "/ai/chat/faq",
    {
      params: { q: query },
    }
  );
  console.log("[API: FAQ]:", response.data);
  // Extract inner data
  return response.data.data;
};

/**
 * Search Facilities
 * Find information about facilities
 */
export const searchFacilities = async (query: string): Promise<FAQResponse> => {
  const response = await api.get<ApiWrapperResponse<FAQResponse>>(
    "/ai/chat/facilities",
    {
      params: { q: query },
    }
  );
  console.log("[API: FACILITIES]:", response.data);
  return response.data.data;
};

/**
 * Search SOP (Standard Operating Procedures)
 * Find procedures and guidelines
 */
export const searchSOP = async (query: string): Promise<FAQResponse> => {
  const response = await api.get<ApiWrapperResponse<FAQResponse>>(
    "/ai/chat/sop",
    {
      params: { q: query },
    }
  );
  console.log("[API: SOP]:", response.data);
  return response.data.data;
};

/**
 * Search Similar Reports
 * Find reports similar to the description
 */
export const searchSimilarReports = async (
  query: string
): Promise<SimilarReportsResponse> => {
  const response = await api.get<ApiWrapperResponse<SimilarReportsResponse>>(
    "/ai/chat/similar-reports",
    {
      params: { q: query },
    }
  );
  console.log("[API: SIMILAR REPORTS]:", response.data);
  return response.data.data;
};

/**
 * Classify Report (Auto-categorize)
 * Automatically classify a report using AI
 */
export const classifyReport = async (
  request: ClassifyReportRequest
): Promise<ClassifyReportResponse> => {
  const response = await api.post<ApiWrapperResponse<ClassifyReportResponse>>(
    "/ai/classify/report",
    request
  );
  console.log("[API: CLASSIFY REPORT]:", response.data);
  return response.data.data;
};

/**
 * Suggest Priority Only
 * Get AI suggestion for priority level
 */
export const suggestPriority = async (
  request: SuggestPriorityRequest
): Promise<SuggestPriorityResponse> => {
  const response = await api.post<ApiWrapperResponse<SuggestPriorityResponse>>(
    "/ai/classify/suggest-priority",
    request
  );
  console.log("[API: SUGGEST PRIORITY]:", response.data);
  return response.data.data;
};
