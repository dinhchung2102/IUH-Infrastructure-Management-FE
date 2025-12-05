# Chatbot AI - Hướng Dẫn Sử Dụng

## Tổng Quan

Hệ thống chatbot AI tích hợp vào ứng dụng IUH Facilities Management, sử dụng Gemini AI và RAG (Retrieval-Augmented Generation) để hỗ trợ người dùng.

## Cấu Trúc Thư Mục

```
src/chatbot/
├── api/
│   └── chatbot.api.ts          # API services
├── components/
│   ├── ChatbotDialog.tsx       # Main chatbot dialog
│   ├── MessageList.tsx         # Message display component
│   ├── ChatInput.tsx           # Input component
│   └── index.ts                # Exports
├── types/
│   └── chatbot.type.ts         # TypeScript types
└── README.md                   # This file
```

## Tính Năng

### 1. Chatbot Dialog

Chatbot có 5 tab chuyên biệt:

#### General (Tổng quát)
- Tìm kiếm toàn bộ knowledge base
- Trả lời câu hỏi tổng quát về hệ thống
- Hỗ trợ multiple source types

#### FAQ
- Tìm câu trả lời cho câu hỏi thường gặp
- Tự động suggest câu hỏi liên quan

#### Facilities (Cơ sở vật chất)
- Tìm thông tin về phòng, tòa nhà, khu vực
- Hướng dẫn vị trí

#### SOP (Quy trình)
- Tìm quy trình xử lý sự cố
- Hướng dẫn xử lý từng bước

#### Similar Reports (Báo cáo tương tự)
- Tìm các báo cáo tương tự
- Giúp tránh báo cáo trùng lặp

### 2. AI Classification trong ReportForm

Tự động phân tích và đề xuất khi người dùng nhập mô tả báo cáo:

- **Priority Suggestion**: Đề xuất độ ưu tiên (LOW, MEDIUM, HIGH, CRITICAL)
- **Similar Reports**: Hiển thị báo cáo tương tự để tránh trùng lặp
- **Confidence Score**: Độ tin cậy của AI (0-100%)
- **Reasoning**: Lý do phân loại

### 3. Quick Actions Integration

Nút chat nổi (floating button) ở góc phải màn hình:
- Click để mở chatbot
- Animation mượt mà
- Tooltip hướng dẫn

## Cách Sử Dụng

### 1. Mở Chatbot

```typescript
import { ChatbotDialog } from "@/chatbot/components";

function MyComponent() {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <>
      <button onClick={() => setChatbotOpen(true)}>
        Chat với AI
      </button>
      <ChatbotDialog open={chatbotOpen} onOpenChange={setChatbotOpen} />
    </>
  );
}
```

### 2. Sử Dụng API Services

```typescript
import {
  sendChatMessage,
  classifyReport,
  searchSimilarReports,
} from "@/chatbot/api/chatbot.api";

// General chat
const response = await sendChatMessage({
  query: "Làm sao để báo cáo sự cố?",
  sourceTypes: ["faq", "sop"],
});

// Classify report
const classification = await classifyReport({
  description: "Điện giật ở nhà vệ sinh",
  location: "Nhà vệ sinh H2",
});

// Find similar reports
const similar = await searchSimilarReports("Điện giật");
```

## API Endpoints

Tất cả endpoints yêu cầu authentication token trong header:
```
Authorization: Bearer <token>
```

### Chat Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/chat` | POST | General chat with RAG |
| `/api/ai/chat/faq` | GET | Search FAQ |
| `/api/ai/chat/facilities` | GET | Search facilities info |
| `/api/ai/chat/sop` | GET | Search procedures |
| `/api/ai/chat/similar-reports` | GET | Find similar reports |

### Classification Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/classify/report` | POST | Auto-classify report |
| `/api/ai/classify/suggest-priority` | POST | Suggest priority only |

## Response Format

### Chat Response

```typescript
{
  success: true,
  data: {
    answer: string,           // AI generated answer
    sources: [                // Reference sources
      {
        id: string,
        type: "report" | "faq" | "sop" | "facilities",
        score: number,        // 0-1 relevance score
        content: string,
        metadata: {
          title?: string,
          category?: string,
          location?: string,
          // ... more metadata
        }
      }
    ],
    conversationId?: string
  }
}
```

### Classification Response

```typescript
{
  success: true,
  data: {
    category: "DIEN" | "NUOC" | "MANG" | ...,
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    suggestedStaffSkills: string[],
    estimatedDuration: number,  // minutes
    reasoning: string,
    confidence: number          // 0-1
  }
}
```

## Best Practices

### 1. Debouncing

Sử dụng debounce cho AI classification:

```typescript
useEffect(() => {
  const timeoutId = setTimeout(async () => {
    const result = await classifyReport({ description });
    setAiSuggestion(result.data);
  }, 1000); // Wait 1s after user stops typing

  return () => clearTimeout(timeoutId);
}, [description]);
```

### 2. Error Handling

Xử lý lỗi gracefully vì AI là tính năng optional:

```typescript
try {
  const result = await classifyReport({ description });
  setAiSuggestion(result.data);
} catch (error) {
  console.error("Error classifying:", error);
  // Silent fail - don't block user
}
```

### 3. Loading States

Hiển thị loading state cho UX tốt hơn:

```typescript
const [isClassifying, setIsClassifying] = useState(false);

// Show loading indicator
{isClassifying && <Sparkles className="animate-pulse" />}
```

## Tính Năng Nổi Bật

### 1. Real-time AI Suggestions

- Tự động phân tích khi user nhập mô tả
- Debounce 1s để tránh spam API
- Hiển thị confidence score

### 2. Similar Reports Detection

- Tìm báo cáo tương tự để tránh trùng lặp
- Hiển thị top 2 báo cáo liên quan nhất
- Show category, location, và snippet

### 3. Smart Prioritization

- AI tự động đề xuất độ ưu tiên
- Badge màu sắc rõ ràng (CRITICAL = đỏ, HIGH = vàng, etc.)
- Giải thích lý do phân loại

### 4. Multi-Source Search

- Tìm kiếm đa nguồn: reports, FAQ, SOP, facilities
- Kết quả được rank theo độ liên quan
- Hiển thị metadata phong phú

## Troubleshooting

### Chatbot không mở được

- Kiểm tra authentication token
- Xem console log có lỗi API không
- Đảm bảo backend AI service đang chạy

### AI classification không hoạt động

- Mô tả phải >= 10 ký tự
- Kiểm tra network requests
- Xem error log trong console

### Sources không hiển thị

- Kiểm tra response format
- Verify data structure matching types
- Check console warnings

## Notes

- Rate limiting: Tùy theo server config
- Max query length: 500 ký tự
- Response time: 1-5 giây tùy độ phức tạp
- Language: Tiếng Việt

## Future Enhancements

- [ ] Voice input support
- [ ] Chat history persistence
- [ ] Multiple conversations
- [ ] Export chat transcript
- [ ] Feedback on AI suggestions
- [ ] Custom training data upload

