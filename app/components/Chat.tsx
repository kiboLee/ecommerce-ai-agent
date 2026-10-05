'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const sampleResponses: Record<string, string> = {
  '배송': '주문번호 #12345의 배송현황을 확인했습니다.\n\n📦 상태: 배송 중\n🚚 예상 배송일: 내일\n📍 현재위치: 부산 배송센터\n\n추가 도움이 필요하시면 알려주세요!',
  '주문': '최근 주문 내역입니다.\n\n1️⃣ 무선 이어폰 (₩89,000) - 2024.11.20\n2️⃣ USB-C 케이블 3개팩 (₩15,000) - 2024.11.18\n3️⃣ 휴대폰 케이스 (₩25,000) - 2024.11.15\n\n자세한 내용을 알고 싶은 주문이 있나요?',
  '환불': '환불 절차를 안내해드리겠습니다.\n\n📋 환불 가능 기한: 구매 후 14일 이내\n📩 신청 방법: 마이페이지 > 주문/배송 > 환불신청\n⏰ 처리기간: 신청 후 3~5 영업일\n💳 환불계좌: 원래 결제 수단으로 자동 환불\n\n환불 신청을 도와드릴까요?',
  '추천': '무선 이어폰 추천입니다!\n\n🎧 인기 상품:\n• 프리미엄 노이즈캔슬 이어폰 (₩189,000)\n  ⭐ 평점: 4.8/5 (1,234개 리뷰)\n• 스포츠 방수 이어폰 (₩79,000)\n  ⭐ 평점: 4.6/5 (856개 리뷰)\n• 가성비 무선 이어폰 (₩49,000)\n  ⭐ 평점: 4.5/5 (2,103개 리뷰)\n\n상세정보나 구매를 도와드릴까요?',
  'default': '안녕하세요! 무엇을 도와드릴까요?\n\n다음과 같이 도움을 드릴 수 있습니다:\n• 주문 조회\n• 배송 현황 확인\n• 환불 및 교환\n• 상품 검색\n• 기타 고객 지원\n\n편한 말로 물어봐주세요!'
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '안녕하세요! Ecommerce AI Agent입니다. 무엇을 도와드릴까요?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 끝으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 입력된 텍스트에 따라 적절한 응답 선택
  const getAIResponse = (userMessage: string): string => {
    const keywords = Object.keys(sampleResponses);
    for (const keyword of keywords) {
      if (keyword !== 'default' && userMessage.includes(keyword)) {
        return sampleResponses[keyword];
      }
    }
    return sampleResponses['default'];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 500);
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              무엇을 도와드릴까요?
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              상품, 주문, 배송, 환불 등 무엇이든 물어봐주세요.
              AI Agent가 도움을 드리겠습니다.
            </p>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-lg whitespace-pre-wrap ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-3 rounded-lg">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 예시 질문 (초기 상태) */}
      {messages.length === 1 && !isLoading && (
        <div className="px-4 sm:px-6 pb-4 space-y-2">
          <p className="text-sm text-muted-foreground mb-3">예시 질문</p>
          <div className="space-y-2">
            {[
              '내 주문 배송 현황 알려줘',
              '최근 주문한 상품 보여줘',
              '상품 환불 방법 알려줘',
              '무선 이어폰 추천해줘'
            ].map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleQuestion(question)}
                className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted transition-colors text-sm text-foreground"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력창 */}
      <div className="border-t border-border bg-background p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="질문을 입력해주세요..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
