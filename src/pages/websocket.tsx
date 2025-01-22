// websocket.tsx
import { Client, IMessage } from "@stomp/stompjs";
import { useEffect, useState } from "react";

const stompClient = new Client({
  brokerURL: "wss://bridge-4204.onrender.com/gs-guide-websocket",
  reconnectDelay: 5000,
  onConnect: (frame) => {
    console.log("WebSocket 已成功連線到伺服器，sessionId:", frame.headers["session"]);
  },
  onStompError: (frame) => {
    console.error("STOMP 錯誤，詳細資訊: ", frame);
  },
});

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
    console.log("正在啟動 WebSocket 連線...");
    stompClient.activate();

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
      console.error("STOMP 錯誤，詳細資訊: ", frame);
    };

    return () => {
      console.log("正在斷開 WebSocket 連線...");
      stompClient.deactivate();
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