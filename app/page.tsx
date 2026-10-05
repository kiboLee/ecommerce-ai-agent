'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { Chat } from './components/Chat';
import { QuickMenu } from './components/QuickMenu';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | null>(null);

  const handleQuickMenuSelect = (query: string) => {
    setInitialQuery(query);
    setShowChat(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {!showChat ? (
        <>
          {/* 메인 소개 영역 */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
            <h1 className="text-3xl sm:text-5xl font-bold text-center text-foreground mb-4">
              AI와 함께 쇼핑하세요
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-2xl mb-8">
              자연어로 상품, 주문, 배송, 환불 등을 편하게 상담받으세요.
              AI Agent가 항상 준비되어 있습니다.
            </p>

            {/* Chat 입력 시작 버튼 */}
            <button
              onClick={() => setShowChat(true)}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold mb-12"
            >
              대화 시작하기
            </button>

            {/* 예시 질문 */}
            <div className="w-full max-w-2xl mb-12">
              <p className="text-muted-foreground text-center text-sm mb-4">
                어떤 것을 물어보고 싶으신가요?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  '내 주문 배송 현황 알려줘',
                  '최근 주문한 상품 보여줘',
                  '상품 환불 방법 알려줘',
                  '무선 이어폰 추천해줘'
                ].map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInitialQuery(question);
                      setShowChat(true);
                    }}
                    className="p-4 text-left border border-border rounded-lg hover:border-primary hover:bg-muted transition-all text-foreground text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 빠른 메뉴 */}
          <QuickMenu onSelectMenu={handleQuickMenuSelect} />
        </>
      ) : (
        <>
          {/* Chat 모드 */}
          <div className="flex-1">
            <Chat />
          </div>

          {/* Chat 종료 버튼 */}
          <div className="bg-background border-t border-border p-4 sm:p-6 text-center">
            <button
              onClick={() => {
                setShowChat(false);
                setInitialQuery(null);
              }}
              className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              ← 돌아가기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
