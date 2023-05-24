import {React, createContext, useContext, useEffect} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket(`ws://${process.env.WEBSOCKET_HOST || "localhost"}:${process.env.WEBSOCKET_PORT || "6835"}`);

  // useEffect(() => {
  //   if (lastJsonMessage) {
  //     onMessageReceived(lastJsonMessage);
  //   }
  // }, [lastJsonMessage, onMessageReceived]);

  // const handleSendMessage = (message) => {
  //   // const message = { cpu_data: 'hello', cpu_avg: 'Hello, WebSocket!', timestamp: };
  //   sendJsonMessage(message);
  // };

  return (
    <WebSocketContext.Provider value={lastJsonMessage}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocketMessages = () => useContext(WebSocketContext);

export { WebSocketProvider, useWebSocketMessages };
