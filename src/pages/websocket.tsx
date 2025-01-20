// websocket.tsx
import { Client, IMessage } from "@stomp/stompjs";
import { useEffect, useState } from "react";

const stompClient = new Client({
  brokerURL: "wss://bridge-4204.onrender.com/gs-guide-websocket",
  reconnectDelay: 5000,
});

stompClient.activate(); // 啟動 WebSocket 客戶端

interface WebSocketMessage {
  topic: string;
  body: string;
}

export const useWebSocket = (): {
  sendMessage: (topic: string, body: any) => void;
  messages: WebSocketMessage[];
  connected: boolean;
} => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    stompClient.onConnect = (frame) => {
      console.log("WebSocket 已成功連線到伺服器，sessionId:", frame.headers["session"]);
      setConnected(true);
   
      const topics = ["/topic/entry", "/topic/begin"];
      topics.forEach((topic) => {
        stompClient.subscribe(topic, (message: IMessage) => {
          console.log(`從 ${topic} 收到訊息: ${message.body}`);
          setMessages((prevMessages) => [...prevMessages, { topic, body: message.body }]);
        });
        console.log(`成功訂閱主題: ${topic}`);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP 錯誤: ", frame.headers["message"]);
   };

    return () => {
      stompClient.deactivate(); // 在應用結束時斷開連線
    };
  }, []);

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

  return { sendMessage, messages, connected };
};