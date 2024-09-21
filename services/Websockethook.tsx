"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

interface SocketContextProps {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  messages: any[]; // Stores incoming messages
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]); // State for storing messages
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      const url = "ws://localhost:8080/ws";

      const connect = () => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
          console.log("Connected to WebSocket");
          setIsConnected(true);
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current?.send(JSON.stringify({ event: "reconnected" }));
          }
        };

        socketRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("Received message:", data);
          setMessages((prevMessages) => [...prevMessages, data]); // Add incoming messages to the state
        };

        socketRef.current.onclose = (event) => {
          console.log("Disconnected from WebSocket");
          setIsConnected(false);
          if (event.wasClean) {
            console.log("Connection closed cleanly.");
          } else {
            console.log("Connection lost. Attempting to reconnect...");
            setTimeout(() => {
              connect();
            }, 5000); // Retry after 5 seconds
          }
        };

        socketRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          socketRef.current?.close();
        };
      };

      connect();

      return () => {
        socketRef.current?.close();
        socketRef.current = null;
      };
    }
  }, []);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error(
        "Cannot send message, WebSocket is not connected or is not in OPEN state",
      );
    }
  };

  return (
    <SocketContext.Provider value={{ isConnected, sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
