import {React, createContext, useContext, useEffect} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket(`ws://${process.env.WEBSOCKET_HOST || "localhost"}:${process.env.WEBSOCKET_PORT || "6835"}`);

  useEffect(() => {
    let socket = JSON.parse(sessionStorage.getItem('websocket'));

    if (!socket) {
      socket = new WebSocket(`ws://${process.env.WEBSOCKET_HOST || "localhost"}:${process.env.WEBSOCKET_PORT || "6835"}`);
      sessionStorage.setItem('websocket', JSON.stringify(socket));
    }

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      sessionStorage.removeItem('websocket');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={lastJsonMessage}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocketMessages = () => useContext(WebSocketContext);

export { WebSocketProvider, useWebSocketMessages };
