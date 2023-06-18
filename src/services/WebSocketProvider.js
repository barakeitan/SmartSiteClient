import {React, createContext, useContext, useEffect, useRef, useState} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket(`ws://${process.env.WEBSOCKET_HOST || "localhost"}:${process.env.WEBSOCKET_PORT || "6835"}`, {
    shouldReconnect: () => true, // Enable automatic reconnection
    reconnectAttempts: 10, // Maximum number of reconnection attempts
    reconnectInterval: 3000, // Interval between reconnection attempts in milliseconds
  });

  useEffect(() => {
    setIsConnected(readyState === ReadyState.OPEN);
  }, [readyState]);

  // useEffect(() => {
  //   let socket = JSON.parse(sessionStorage.getItem('websocket'));

  //   if (!socket) {
  //     socket = new WebSocket(`ws://${process.env.WEBSOCKET_HOST || "localhost"}:${process.env.WEBSOCKET_PORT || "6835"}`);
  //     sessionStorage.setItem('websocket', JSON.stringify(socket));
  //   }

  //   socket.onopen = () => {
  //     console.log('WebSocket connection established');
  //   };

  //   socket.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     console.log('Received message:', message);
  //   };

  //   socket.onclose = () => {
  //     console.log('WebSocket connection closed');
  //     sessionStorage.removeItem('websocket');
  //   };

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <WebSocketContext.Provider value={{ sendJsonMessage, lastJsonMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// const useWebSocketMessages = () => useContext(WebSocketContext);
const useWebSocketMessages = () => {
  const { lastJsonMessage } = useContext(WebSocketContext);
  return lastJsonMessage;
};

export { WebSocketProvider, useWebSocketMessages };
