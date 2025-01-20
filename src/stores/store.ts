import { create } from "zustand";
import { useEffect } from "react";
import { Client, IMessage } from "@stomp/stompjs";


// 全域 WebSocket 客戶端
const stompClient = new Client({
  brokerURL: "wss://bridge-4204.onrender.com/gs-guide-websocket",
  reconnectDelay: 5000,
});

stompClient.activate(); // 啟動 WebSocket 客戶端

// 定義 Zustand 狀態的型別
interface AppState {
  currentPage: string; // 當前頁面名稱
  guestName: string;   // 訪客名稱
  setPage: (page: string) => void; // 切換頁面
  setGuestName: (name: string) => void; // 設定訪客名稱
  volume: number; // 音量大小 (0 ~ 1)
  setVolume: (newVolume: number) => void; // 設定音量
  account: string; // 儲存使用者帳號
  setAccount: (account: string) => void; // 設定帳號的方法
}

// 使用 Zustand 創建狀態，並提供明確的類型
export const useAppStore = create<AppState>((set) => ({
  currentPage: "home", // 預設為首頁
  guestName: "",
  setPage: (page: string) => set({ currentPage: page }), // 切換頁面函式
  setGuestName: (name: string) => set({ guestName: name }), // 設定訪客名稱函式
  volume: 0.5, // 預設音量大小為 0.5
  setVolume: (newVolume) => set({ volume: Math.min(Math.max(newVolume, 0), 1) }), // 限制範圍在 0 ~ 1
  account: "", // 初始帳號為空
  setAccount: (account) => set({ account }),
}));

interface WebSocketMessage {
  topic: string;
  body: string;
};

interface WebSocketState {
  connected: boolean;
  messages: Record<string, string[]>; // 儲存每個主題的訊息
  setConnected: (connected: boolean) => void;
  addMessage: (topic: string, message: string) => void;
  getMessages: () => WebSocketMessage[];
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  connected: false,
  messages: {},
  setConnected: (connected) => set({ connected }),    // 更新連線狀態
  addMessage: (topic, message) =>                     // 新增訊息到指定主題
    set((state) => ({
      messages: {
        ...state.messages,
        [topic]: [...(state.messages[topic] || []), message],
      },
    })),
  getMessages: () => {
    const state = get();
    return Object.entries(state.messages).flatMap(([topic, messages]) =>
      messages.map((body: string) => ({ topic, body }))
    );
  },
}));

// WebSocket Hook
export const useWebSocket = (): {
  sendMessage: (topic: string, body: any) => void;
  messages: WebSocketMessage[]; // 返回轉換後的 WebSocketMessage 陣列
} => {
  const setConnected = useWebSocketStore((state) => state.setConnected);
  const addMessage = useWebSocketStore((state) => state.addMessage);
  const getMessages = useWebSocketStore((state) => state.getMessages); // 使用 getMessages 方法

  useEffect(() => {
    stompClient.onConnect = () => {
      console.log("WebSocket 已連線");
      setConnected(true);

      // 訂閱主題
      const topics = ["/topic/entry", "/topic/begin"];
      topics.forEach((topic) =>
        stompClient.subscribe(topic, (message: IMessage) => {
          console.log(`收到訊息: ${message.body}`);
          addMessage(topic, message.body);
        })
      );
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP 錯誤: ", frame.headers["message"]);
    };

    return () => {
      stompClient.deactivate(); // 在應用結束時斷開連線
    };
  }, [setConnected, addMessage]);

  const sendMessage = (topic: string, body: any) => {
    if (stompClient.connected) {
      stompClient.publish({
        destination: topic,
        body: JSON.stringify(body),
      });
      console.log(`訊息已發送到 ${topic}:`, body);
    } else {
      console.error("WebSocket 尚未連線，無法發送訊息！");
    }
  };

  return { sendMessage, messages: getMessages() }; // 使用 getMessages
};