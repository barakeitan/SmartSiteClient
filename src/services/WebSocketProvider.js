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
  console.log("Latest WebSocket message::::::" ,lastJsonMessage);

  useEffect(() => {
    setIsConnected(readyState === ReadyState.OPEN);
  }, [readyState]);


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
