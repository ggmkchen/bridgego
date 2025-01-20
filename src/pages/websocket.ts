// websocket.ts
import { Client, IMessage } from "@stomp/stompjs";
import { useEffect } from "react";
import { useWebSocketStore } from "../stores/store";

// 全域 WebSocket 客戶端
const stompClient = new Client({
  brokerURL: "wss://bridge-4204.onrender.com/gs-guide-websocket",
  reconnectDelay: 5000,
});

stompClient.activate(); // 啟動 WebSocket 客戶端

export const useWebSocket = (): {
  sendMessage: (topic: string, body: any) => void;
  messages: { topic: string; body: string }[];
} => {
  const setConnected = useWebSocketStore((state) => state.setConnected);
  const addMessage = useWebSocketStore((state) => state.addMessage);
  const getMessages = useWebSocketStore((state) => state.getMessages);

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

  return { sendMessage, messages: getMessages() };
};