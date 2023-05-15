import React from 'react';
import { useWebSocket } from 'react-use-websocket';

const WebSocketComponent = () => {
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket(`wss://${process.env.WEBSOCKET_HOST}:${process.env.WEBSOCKET_PORT}`);

  const handleSendMessage = (message) => {
    // const message = { cpu_data: 'hello', cpu_avg: 'Hello, WebSocket!', timestamp: };
    sendJsonMessage(message);
  };

  return (
    <div>
      {/* <div>WebSocket status: {readyState}</div> */}
      {/* <button onClick={handleSendMessage}>Send Message</button> */}
      <div>Last received message: {lastJsonMessage && JSON.stringify(lastJsonMessage)}</div>
    </div>
  );
};

export default WebSocketComponent;
